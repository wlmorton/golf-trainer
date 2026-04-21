from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional
from database import get_db

router = APIRouter()

class WeeklyMetrics(BaseModel):
    week_number: int
    driver_avg_carry: Optional[float] = None
    driver_avg_offline: Optional[float] = None
    driver_speed: Optional[float] = None
    iron_7i_carry: Optional[float] = None
    iron_7i_offline: Optional[float] = None
    center_contact_pct: Optional[float] = None
    wedge_50_pct_carry: Optional[float] = None
    wedge_75_pct_carry: Optional[float] = None
    wedge_full_carry: Optional[float] = None
    putting_5ft_made: Optional[int] = None
    putting_5ft_total: Optional[int] = None
    putting_lag_rating: Optional[int] = None
    notes: Optional[str] = None

@router.post("/weekly")
def log_weekly_metrics(metrics: WeeklyMetrics):
    """Log weekly metrics."""
    conn = get_db()
    c = conn.cursor()
    c.execute("""
        INSERT INTO weekly_metrics 
        (week_number, driver_avg_carry, driver_avg_offline, driver_speed, 
         iron_7i_carry, iron_7i_offline, center_contact_pct,
         wedge_50_pct_carry, wedge_75_pct_carry, wedge_full_carry,
         putting_5ft_made, putting_5ft_total, putting_lag_rating, notes)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        metrics.week_number,
        metrics.driver_avg_carry,
        metrics.driver_avg_offline,
        metrics.driver_speed,
        metrics.iron_7i_carry,
        metrics.iron_7i_offline,
        metrics.center_contact_pct,
        metrics.wedge_50_pct_carry,
        metrics.wedge_75_pct_carry,
        metrics.wedge_full_carry,
        metrics.putting_5ft_made,
        metrics.putting_5ft_total,
        metrics.putting_lag_rating,
        metrics.notes
    ))
    conn.commit()
    conn.close()
    return {"status": "success"}

@router.get("/weekly/{week_number}")
def get_weekly_metrics(week_number: int):
    """Get metrics for a specific week."""
    conn = get_db()
    c = conn.cursor()
    c.execute("""
        SELECT * FROM weekly_metrics 
        WHERE week_number = ?
        ORDER BY logged_at DESC
        LIMIT 1
    """, (week_number,))
    row = c.fetchone()
    conn.close()
    
    if not row:
        return None
    
    return dict(row)

@router.get("/history")
def get_metrics_history(limit: int = 10):
    """Get recent metrics history."""
    conn = get_db()
    c = conn.cursor()
    c.execute("""
        SELECT * FROM weekly_metrics 
        ORDER BY week_number DESC
        LIMIT ?
    """, (limit,))
    rows = c.fetchall()
    conn.close()
    
    return [dict(row) for row in rows]

class HandicapLog(BaseModel):
    handicap: float
    notes: Optional[str] = None

@router.post("/handicap")
def log_handicap(log: HandicapLog):
    """Log current handicap."""
    conn = get_db()
    c = conn.cursor()
    c.execute("""
        INSERT INTO handicap_log (handicap, notes)
        VALUES (?, ?)
    """, (log.handicap, log.notes))
    conn.commit()
    conn.close()
    return {"status": "success"}

@router.get("/handicap/history")
def get_handicap_history(limit: int = 20):
    """Get handicap history."""
    conn = get_db()
    c = conn.cursor()
    c.execute("""
        SELECT * FROM handicap_log 
        ORDER BY logged_at DESC
        LIMIT ?
    """, (limit,))
    rows = c.fetchall()
    conn.close()
    
    return [dict(row) for row in rows]

@router.get("/handicap/current")
def get_current_handicap():
    """Get most recent handicap."""
    conn = get_db()
    c = conn.cursor()
    c.execute("""
        SELECT * FROM handicap_log 
        ORDER BY logged_at DESC
        LIMIT 1
    """)
    row = c.fetchone()
    conn.close()
    
    if not row:
        return None
    
    return dict(row)
