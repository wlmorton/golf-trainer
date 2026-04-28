from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from datetime import datetime
from database import get_db

router = APIRouter()

class StartDateUpdate(BaseModel):
    start_date: str  # ISO format: YYYY-MM-DD

@router.get("/start-date")
def get_start_date():
    """Get the training start date."""
    conn = get_db()
    c = conn.cursor()
    
    # Create settings table if it doesn't exist
    c.execute("""
        CREATE TABLE IF NOT EXISTS settings (
            key TEXT PRIMARY KEY,
            value TEXT NOT NULL,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)
    
    c.execute("SELECT value FROM settings WHERE key = 'start_date'")
    row = c.fetchone()
    conn.close()
    
    if row:
        start_date_str = row[0]
        start_date = datetime.fromisoformat(start_date_str)
        delta = datetime.now() - start_date
        current_week = (delta.days // 7) + 1
        
        return {
            "start_date": start_date_str,
            "current_week": max(1, current_week)
        }
    
    # Default to April 20, 2026 if not set
    default_date = "2026-04-20"
    start_date = datetime.fromisoformat(default_date)
    delta = datetime.now() - start_date
    current_week = (delta.days // 7) + 1
    
    return {
        "start_date": default_date,
        "current_week": max(1, current_week)
    }

@router.post("/start-date")
def set_start_date(update: StartDateUpdate):
    """Set the training start date."""
    conn = get_db()
    c = conn.cursor()
    
    # Create settings table if it doesn't exist
    c.execute("""
        CREATE TABLE IF NOT EXISTS settings (
            key TEXT PRIMARY KEY,
            value TEXT NOT NULL,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)
    
    # Validate date format
    try:
        start_date = datetime.fromisoformat(update.start_date)
    except ValueError:
        conn.close()
        return {"error": "Invalid date format. Use YYYY-MM-DD"}
    
    try:
        # Check if exists
        c.execute("SELECT key FROM settings WHERE key = 'start_date'")
        exists = c.fetchone()
        
        if exists:
            # Update existing
            c.execute("""
                UPDATE settings 
                SET value = ?, updated_at = CURRENT_TIMESTAMP
                WHERE key = 'start_date'
            """, (update.start_date,))
        else:
            # Insert new
            c.execute("""
                INSERT INTO settings (key, value, updated_at)
                VALUES ('start_date', ?, CURRENT_TIMESTAMP)
            """, (update.start_date,))
        
        conn.commit()
    except Exception as e:
        conn.rollback()
        conn.close()
        print(f"Error saving start date: {e}")
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        conn.close()
    
    # Calculate current week
    delta = datetime.now() - start_date
    current_week = (delta.days // 7) + 1
    
    return {
        "status": "success",
        "start_date": update.start_date,
        "current_week": max(1, current_week)
    }
