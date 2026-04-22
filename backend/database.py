import sqlite3
import os

DB_PATH = os.path.join(os.path.dirname(__file__), "golf_trainer.db")

def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db()
    c = conn.cursor()

    c.execute("""
        CREATE TABLE IF NOT EXISTS weekly_metrics (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            week_number INTEGER NOT NULL,
            driver_avg_carry REAL,
            driver_avg_offline REAL,
            driver_speed REAL,
            iron_7i_carry REAL,
            iron_7i_offline REAL,
            center_contact_pct REAL,
            wedge_50_pct_carry REAL,
            wedge_75_pct_carry REAL,
            wedge_full_carry REAL,
            putting_5ft_made INTEGER,
            putting_5ft_total INTEGER,
            putting_lag_rating INTEGER,
            notes TEXT,
            logged_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)

    c.execute("""
        CREATE TABLE IF NOT EXISTS session_logs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            week_number INTEGER NOT NULL,
            day_number INTEGER NOT NULL,
            drills_completed TEXT,
            notes TEXT,
            logged_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)

    c.execute("""
        CREATE TABLE IF NOT EXISTS drill_completions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            week_number INTEGER NOT NULL,
            day_number INTEGER NOT NULL,
            drill_id TEXT NOT NULL,
            score TEXT,
            notes TEXT,
            completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)

    c.execute("""
        CREATE TABLE IF NOT EXISTS handicap_log (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            handicap REAL NOT NULL,
            notes TEXT,
            logged_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)

    c.execute("""
        CREATE TABLE IF NOT EXISTS reminders (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            day_of_week INTEGER NOT NULL,
            time TEXT NOT NULL,
            enabled INTEGER DEFAULT 1,
            message TEXT
        )
    """)

    conn.commit()
    conn.close()
