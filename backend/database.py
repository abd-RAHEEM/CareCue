import os
from pathlib import Path
import sqlite3

# Store SQLite DB in the backend directory or a writable directory
DATABASE = Path(os.getenv("SQLITE_DB_PATH", Path(__file__).with_name("cognicare.db")))


def get_connection() -> sqlite3.Connection:
    connection = sqlite3.connect(str(DATABASE))
    connection.row_factory = sqlite3.Row
    return connection


def initialize_database() -> None:
    connection = get_connection()
    cursor = connection.cursor()

    cursor.execute(
        """
        CREATE TABLE IF NOT EXISTS patients (
            patient_id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            pin TEXT NOT NULL,
            language TEXT NOT NULL,
            created_at TEXT NOT NULL
        )
        """
    )
    cursor.execute(
        """
        CREATE TABLE IF NOT EXISTS events (
            id TEXT PRIMARY KEY,
            patient_id TEXT NOT NULL,
            type TEXT,
            activity TEXT,
            level INTEGER,
            score INTEGER,
            hints INTEGER,
            reminder TEXT,
            status TEXT,
            language TEXT,
            created_at TEXT
        )
        """
    )
    cursor.execute(
        """
        CREATE TABLE IF NOT EXISTS health_workers (
            username TEXT PRIMARY KEY,
            password TEXT NOT NULL,
            name TEXT NOT NULL
        )
        """
    )

    cursor.executemany(
        """
        INSERT OR IGNORE INTO patients
        (patient_id, name, pin, language, created_at)
        VALUES (?, ?, ?, ?, ?)
        """,
        [
            ("patient-1", "Anima Devi", "1234", "Assamese", "2026-09-08T00:00:00Z"),
            ("patient-2", "Hemanta Bora", "2345", "English", "2026-09-08T00:00:00Z"),
        ],
    )
    cursor.execute(
        """
        INSERT OR IGNORE INTO health_workers (username, password, name)
        VALUES (?, ?, ?)
        """,
        ("worker01", "1234", "Health Worker"),
    )

    connection.commit()
    connection.close()