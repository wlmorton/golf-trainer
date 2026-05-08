"""
Database connection - supports both SQLite (local) and PostgreSQL (production)
"""
import os

# Check if we should use PostgreSQL
DATABASE_URL = os.getenv("DATABASE_URL")
USE_POSTGRES = DATABASE_URL is not None

if USE_POSTGRES:
    import psycopg2
    from psycopg2.extras import RealDictCursor
    
    # Render provides postgres:// but psycopg2 needs postgresql://
    if DATABASE_URL.startswith("postgres://"):
        DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)
    
    print(f"Using PostgreSQL")
    
    def get_db():
        """Get database connection (PostgreSQL)."""
        return psycopg2.connect(DATABASE_URL, cursor_factory=RealDictCursor)
    
    def init_db():
        """Initialize database (PostgreSQL)."""
        conn = get_db()
        cur = conn.cursor()
        
        cur.execute("""
            CREATE TABLE IF NOT EXISTS weekly_metrics (
                id SERIAL PRIMARY KEY,
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
        
        cur.execute("""
            CREATE TABLE IF NOT EXISTS drill_completions (
                id SERIAL PRIMARY KEY,
                week_number INTEGER NOT NULL,
                day_number INTEGER NOT NULL,
                drill_id TEXT NOT NULL,
                score TEXT,
                notes TEXT,
                shot_data TEXT,
                completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)
        
        cur.execute("""
            CREATE TABLE IF NOT EXISTS handicap_log (
                id SERIAL PRIMARY KEY,
                handicap REAL NOT NULL,
                notes TEXT,
                logged_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)
        
        cur.execute("""
            CREATE TABLE IF NOT EXISTS settings (
                key TEXT PRIMARY KEY,
                value TEXT NOT NULL,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)
        
        cur.execute("""
            CREATE TABLE IF NOT EXISTS weekly_adjustments (
                id SERIAL PRIMARY KEY,
                week_number INTEGER NOT NULL,
                adjustments TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)
        
        conn.commit()
        cur.close()
        conn.close()
        print("PostgreSQL tables initialized")

else:
    import sqlite3
    
    DB_PATH = os.path.join(os.path.dirname(__file__), "golf_trainer.db")
    print(f"Using SQLite: {DB_PATH}")

    def get_db():
        """Get database connection (SQLite)."""
        conn = sqlite3.connect(DB_PATH)
        conn.row_factory = sqlite3.Row
        return conn

    def init_db():
        """Initialize database (SQLite)."""
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
            CREATE TABLE IF NOT EXISTS drill_completions (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                week_number INTEGER NOT NULL,
                day_number INTEGER NOT NULL,
                drill_id TEXT NOT NULL,
                score TEXT,
                notes TEXT,
                shot_data TEXT,
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
            CREATE TABLE IF NOT EXISTS settings (
                key TEXT PRIMARY KEY,
                value TEXT NOT NULL,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)

        conn.commit()
        conn.close()
        print("SQLite database initialized")
