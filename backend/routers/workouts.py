from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
from datetime import datetime, timedelta
from training_plan import get_day_plan, get_phase
from database import get_db

router = APIRouter()

START_DATE = datetime(2026, 4, 20)  # Week 1 starts April 20, 2026

def get_current_week() -> int:
    """Calculate current week number based on start date."""
    delta = datetime.now() - START_DATE
    week = (delta.days // 7) + 1
    return max(1, week)

def get_current_day() -> int:
    """Return current day of week (1=Mon, 2=Wed, 3=Fri for training days)."""
    weekday = datetime.now().weekday()  # 0=Mon, 6=Sun
    if weekday in [0, 1]:
        return 1
    elif weekday in [2, 3]:
        return 2
    elif weekday in [4, 5, 6]:
        return 3
    return 1

@router.get("/today")
def get_today_workout():
    """Get today's workout based on current week and day."""
    week = get_current_week()
    day = get_current_day()
    plan = get_day_plan(week, day)
    
    # Check which drills are already completed
    conn = get_db()
    c = conn.cursor()
    c.execute("""
        SELECT drill_id, score, notes FROM drill_completions 
        WHERE week_number = ? AND day_number = ?
    """, (week, day))
    completions = {row[0]: {"score": row[1], "notes": row[2]} for row in c.fetchall()}
    conn.close()
    
    for drill in plan.get("drills", []):
        drill["completed"] = drill["id"] in completions
        if drill["id"] in completions:
            drill["score"] = completions[drill["id"]]["score"]
            drill["notes"] = completions[drill["id"]]["notes"]
    
    return plan

@router.get("/workout/{week_number}/{day_number}")
def get_specific_workout(week_number: int, day_number: int):
    """Get workout for a specific week and day."""
    plan = get_day_plan(week_number, day_number)
    
    # Check which drills are already completed
    conn = get_db()
    c = conn.cursor()
    c.execute("""
        SELECT drill_id, score, notes FROM drill_completions 
        WHERE week_number = ? AND day_number = ?
    """, (week_number, day_number))
    completions = {row[0]: {"score": row[1], "notes": row[2]} for row in c.fetchall()}
    conn.close()
    
    for drill in plan.get("drills", []):
        drill["completed"] = drill["id"] in completions
        if drill["id"] in completions:
            drill["score"] = completions[drill["id"]]["score"]
            drill["notes"] = completions[drill["id"]]["notes"]
    
    return plan

@router.get("/week/{week_number}")
def get_week_plan(week_number: int):
    """Get full week plan for a specific week."""
    return {
        "week": week_number,
        "phase": get_phase(week_number),
        "days": [
            get_day_plan(week_number, 1),
            get_day_plan(week_number, 2),
            get_day_plan(week_number, 3),
        ]
    }

class DrillCompletion(BaseModel):
    week: int
    day: int
    drill_id: str
    score: Optional[str] = None
    notes: Optional[str] = None

@router.post("/complete-drill")
def complete_drill(completion: DrillCompletion):
    """Mark a drill as completed."""
    conn = get_db()
    c = conn.cursor()
    c.execute("""
        INSERT INTO drill_completions (week_number, day_number, drill_id, score, notes)
        VALUES (?, ?, ?, ?, ?)
    """, (completion.week, completion.day, completion.drill_id, completion.score, completion.notes))
    conn.commit()
    conn.close()
    return {"status": "success"}

@router.delete("/complete-drill")
def uncomplete_drill(completion: DrillCompletion):
    """Unmark a drill as completed."""
    conn = get_db()
    c = conn.cursor()
    c.execute("""
        DELETE FROM drill_completions 
        WHERE week_number = ? AND day_number = ? AND drill_id = ?
    """, (completion.week, completion.day, completion.drill_id))
    conn.commit()
    conn.close()
    return {"status": "success"}

@router.get("/drill-data/{week}/{day}/{drill_id}")
def get_drill_data(week: int, day: int, drill_id: str):
    """Get completion data for a specific drill."""
    conn = get_db()
    c = conn.cursor()
    c.execute("""
        SELECT score, notes, completed_at FROM drill_completions 
        WHERE week_number = ? AND day_number = ? AND drill_id = ?
        ORDER BY completed_at DESC
        LIMIT 1
    """, (week, day, drill_id))
    row = c.fetchone()
    conn.close()
    
    if not row:
        return None
    
    return {
        "score": row[0],
        "notes": row[1],
        "completed_at": row[2]
    }
