from datetime import datetime, timezone
from typing import List, Optional
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
    events: List[Event] = []


@router.post("")
def sync_patient_data(sync_request: SyncRequest) -> dict:
    connection = get_connection()
    cursor = connection.cursor()
    patient = cursor.execute(
        "SELECT patient_id, language FROM patients WHERE patient_id = ?",
        (sync_request.patientId,),
    ).fetchone()

    if not patient:
        connection.close()
        raise HTTPException(status_code=404, detail="Patient does not exist")

    patient_lang = sync_request.language or patient["language"]
    inserted = 0
    duplicates = 0
    for event in sync_request.events:
        existing = cursor.execute("SELECT id FROM events WHERE id = ?", (event.id,)).fetchone()
        if existing:
            duplicates += 1
            continue
        cursor.execute(
            """
            INSERT INTO events
            (id, patient_id, type, activity, level, score, hints, reminder, status, language, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """,
            (
                event.id,
                sync_request.patientId,
                event.type,
                event.activity,
                event.level,
                event.score,
                event.hints,
                event.reminder,
                event.status,
                patient_lang,
                event.createdAt or datetime.now(timezone.utc).isoformat(),
            ),
        )
        inserted += 1

    connection.commit()
    total_events = cursor.execute(
        "SELECT COUNT(*) FROM events WHERE patient_id = ?",
        (sync_request.patientId,),
    ).fetchone()[0]
    connection.close()

    return {
        "success": True,
        "patientId": sync_request.patientId,
        "inserted": inserted,
        "duplicates": duplicates,
        "totalEvents": total_events,
        "lastSync": sync_request.lastSync or datetime.now(timezone.utc).isoformat(),
    }
