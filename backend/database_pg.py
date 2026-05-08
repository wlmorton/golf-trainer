"""
PostgreSQL database connection and initialization
"""
import os
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker
from contextlib import contextmanager

# Get database URL from environment variable
DATABASE_URL = os.getenv("DATABASE_URL")

# Render provides postgres:// but SQLAlchemy needs postgresql://
if DATABASE_URL and DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)

# Fallback to SQLite for local development
if not DATABASE_URL:
    DATABASE_URL = "sqlite:///./golf_trainer.db"
    print("Using SQLite for local development")
else:
    print(f"Using PostgreSQL: {DATABASE_URL.split('@')[1] if '@' in DATABASE_URL else 'connected'}")

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

@contextmanager
def get_db():
    """Get database session."""
    db = SessionLocal()
    try:
        yield db
        db.commit()
    except Exception as e:
        db.rollback()
        raise e
    finally:
        db.close()

def init_db():
    """Initialize database tables."""
    with engine.connect() as conn:
        # Weekly metrics table
        conn.execute(text("""
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
        """))
        
        # Session logs table
        conn.execute(text("""
            CREATE TABLE IF NOT EXISTS session_logs (
                id SERIAL PRIMARY KEY,
                week_number INTEGER NOT NULL,
                day_number INTEGER NOT NULL,
                drills_completed TEXT,
                notes TEXT,
                logged_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """))
        
        # Drill completions table
        conn.execute(text("""
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
        """))
        
        # Handicap log table
        conn.execute(text("""
            CREATE TABLE IF NOT EXISTS handicap_log (
                id SERIAL PRIMARY KEY,
                handicap REAL NOT NULL,
                notes TEXT,
                logged_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """))
        
        # Reminders table
        conn.execute(text("""
            CREATE TABLE IF NOT EXISTS reminders (
                id SERIAL PRIMARY KEY,
                day_of_week INTEGER NOT NULL,
                time TEXT NOT NULL,
                enabled INTEGER DEFAULT 1,
                message TEXT
            )
        """))
        
        # Settings table
        conn.execute(text("""
            CREATE TABLE IF NOT EXISTS settings (
                key TEXT PRIMARY KEY,
                value TEXT NOT NULL,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """))
        
        # Weekly adjustments table
        conn.execute(text("""
            CREATE TABLE IF NOT EXISTS weekly_adjustments (
                id SERIAL PRIMARY KEY,
                week_number INTEGER NOT NULL,
                adjustments TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """))
        
        conn.commit()
        print("Database tables initialized successfully")
