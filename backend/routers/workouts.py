from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
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
        SELECT drill_id FROM drill_completions 
        WHERE week_number = ? AND day_number = ?
    """, (week, day))
    completed = {row[0] for row in c.fetchall()}
    conn.close()
    
    for drill in plan.get("drills", []):
        drill["completed"] = drill["id"] in completed
    
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

@router.post("/complete-drill")
def complete_drill(completion: DrillCompletion):
    """Mark a drill as completed."""
    conn = get_db()
    c = conn.cursor()
    c.execute("""
        INSERT INTO drill_completions (week_number, day_number, drill_id)
        VALUES (?, ?, ?)
    """, (completion.week, completion.day, completion.drill_id))
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
