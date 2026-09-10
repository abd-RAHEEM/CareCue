from datetime import datetime, timezone
from typing import List, Optional, Any, Dict
from uuid import uuid4

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from database import get_connection

router = APIRouter()


class Event(BaseModel):
    id: str
    type: str
    activity: Optional[str] = None
    level: Optional[int] = None
    score: Optional[int] = None
    hints: Optional[int] = None
    reminder: Optional[str] = None
    status: Optional[str] = None
    createdAt: Optional[str] = None


class SyncRequest(BaseModel):
    version: int
    patientId: str
    language: Optional[str] = None
    lastSync: Optional[str] = None
    events: List[Event]


class ActivityRequest(BaseModel):
    id: Optional[str] = None
    gameId: str
    date: str
    accuracy: int
    responseTimeMs: int = 0
    hintsUsed: int = 0
    retries: int = 0
    difficultyLevel: int = 1
    abandoned: bool = False
    breakRequested: bool = False


@router.get("")
def get_all_patients() -> dict:
    connection = get_connection()
    rows = connection.execute(
        """
        SELECT p.patient_id, p.name, p.language,
               COUNT(e.id) AS total_events, MAX(e.created_at) AS last_activity
        FROM patients p
        LEFT JOIN events e ON p.patient_id = e.patient_id
        GROUP BY p.patient_id, p.name, p.language
        ORDER BY last_activity DESC
        """
    ).fetchall()
    connection.close()

    return {
        "success": True,
        "patients": [
            {
                "patientId": row["patient_id"],
                "name": row["name"],
                "language": row["language"],
                "totalEvents": row["total_events"],
                "lastActivity": row["last_activity"],
            }
            for row in rows
        ],
    }


@router.get("/{patient_id}")
def get_patient(patient_id: str) -> dict:
    connection = get_connection()
    row = connection.execute(
        "SELECT patient_id, name, language, created_at FROM patients WHERE patient_id = ?",
        (patient_id,),
    ).fetchone()
    connection.close()
    if not row:
        raise HTTPException(status_code=404, detail="Patient does not exist")

    return {
        "success": True,
        "patient": {
            "patientId": row["patient_id"],
            "name": row["name"],
            "language": row["language"],
            "createdAt": row["created_at"],
        },
    }


@router.get("/{patient_id}/events")
def get_patient_events(patient_id: str) -> dict:
    connection = get_connection()
    rows = connection.execute(
        "SELECT * FROM events WHERE patient_id = ? ORDER BY created_at DESC",
        (patient_id,),
    ).fetchall()
    connection.close()
    return {"success": True, "patientId": patient_id, "events": [dict(row) for row in rows]}


@router.post("/{patient_id}/activity")
def record_patient_activity(patient_id: str, activity: ActivityRequest) -> dict:
    event_id = activity.id or f"act-{uuid4().hex}"
    connection = get_connection()
    cursor = connection.cursor()
    patient = cursor.execute("SELECT language FROM patients WHERE patient_id = ?", (patient_id,)).fetchone()
    if not patient:
        connection.close()
        raise HTTPException(status_code=404, detail="Patient does not exist")

    cursor.execute(
        """
        INSERT OR IGNORE INTO events
        (id, patient_id, type, activity, level, score, hints, status, language, created_at)
        VALUES (?, ?, 'activity', ?, ?, ?, ?, ?, ?, ?)
        """,
        (
            event_id,
            patient_id,
            activity.gameId,
            activity.difficultyLevel,
            activity.accuracy,
            activity.hintsUsed,
            'abandoned' if activity.abandoned else 'completed',
            patient["language"],
            activity.date,
        ),
    )
    connection.commit()
    connection.close()
    return {**activity.model_dump(), "id": event_id}


@router.get("/{patient_id}/snapshot")
def get_patient_snapshot(patient_id: str) -> dict:
    connection = get_connection()
    patient = connection.execute(
        "SELECT patient_id, name, language FROM patients WHERE patient_id = ?",
        (patient_id,),
    ).fetchone()
    if not patient:
        connection.close()
        raise HTTPException(status_code=404, detail="Patient does not exist")

    rows = connection.execute(
        "SELECT id, activity, level, score, hints, status, created_at FROM events WHERE patient_id = ? ORDER BY created_at ASC",
        (patient_id,),
    ).fetchall()
    connection.close()
    events = [
        {
            "id": row["id"],
            "gameId": row["activity"] or "unknown",
            "date": row["created_at"] or datetime.now(timezone.utc).isoformat(),
            "accuracy": row["score"] or 0,
            "responseTimeMs": 0,
            "hintsUsed": row["hints"] or 0,
            "retries": 0,
            "difficultyLevel": row["level"] or 1,
            "abandoned": row["status"] == "abandoned",
            "breakRequested": False,
        }
        for row in rows
    ]
    return {
        "patientId": patient["patient_id"],
        "name": patient["name"],
        "language": patient["language"],
        "events": events,
        "report": {
            "totalActivities": len(events),
            "gamesPlayed": sorted({event["gameId"] for event in events}),
            "averageAccuracy": round(sum(event["accuracy"] for event in events) / len(events), 1) if events else 0,
            "lastActivity": events[-1]["date"] if events else None,
        },
    }
