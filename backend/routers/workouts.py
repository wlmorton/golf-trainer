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
    shot_data: Optional[str] = None  # JSON string of shot-by-shot data

@router.post("/complete-drill")
def complete_drill(completion: DrillCompletion):
    """Mark a drill as completed."""
    conn = get_db()
    c = conn.cursor()
    c.execute("""
        INSERT INTO drill_completions (week_number, day_number, drill_id, score, notes, shot_data)
        VALUES (?, ?, ?, ?, ?, ?)
    """, (completion.week, completion.day, completion.drill_id, completion.score, completion.notes, completion.shot_data))
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

@router.get("/drill-history/{drill_id}")
def get_drill_history(drill_id: str, limit: int = 10):
    """Get completion history for a specific drill across all sessions."""
    conn = get_db()
    c = conn.cursor()
    c.execute("""
        SELECT week_number, day_number, score, notes, shot_data, completed_at 
        FROM drill_completions 
        WHERE drill_id = ?
        ORDER BY completed_at DESC
        LIMIT ?
    """, (drill_id, limit))
    rows = c.fetchall()
    conn.close()
    
    history = []
    for row in rows:
        history.append({
            "week": row[0],
            "day": row[1],
            "score": row[2],
            "notes": row[3],
            "shot_data": row[4],
            "completed_at": row[5]
        })
    
    return history

@router.get("/drill-stats/{drill_id}")
def get_drill_stats(drill_id: str):
    """Get statistics for a specific drill."""
    conn = get_db()
    c = conn.cursor()
    
    # Get all numeric scores
    c.execute("""
        SELECT score, completed_at FROM drill_completions 
        WHERE drill_id = ? AND score IS NOT NULL
        ORDER BY completed_at DESC
    """, (drill_id,))
    rows = c.fetchall()
    conn.close()
    
    if not rows:
        return None
    
    # Try to extract numeric values from scores
    numeric_scores = []
    for row in rows:
        score_str = row[0]
        if score_str:
            # Try to extract first number from string (e.g., "42/50" -> 42, "25 points" -> 25)
            import re
            numbers = re.findall(r'\d+\.?\d*', score_str)
            if numbers:
                try:
                    numeric_scores.append(float(numbers[0]))
                except:
                    pass
    
    if not numeric_scores:
        return {
            "total_completions": len(rows),
            "recent_scores": [row[0] for row in rows[:5]]
        }
    
    return {
        "total_completions": len(rows),
        "average": round(sum(numeric_scores) / len(numeric_scores), 1),
        "best": max(numeric_scores),
        "recent": numeric_scores[0] if numeric_scores else None,
        "trend": "improving" if len(numeric_scores) >= 2 and numeric_scores[0] > numeric_scores[-1] else "stable",
        "recent_scores": [row[0] for row in rows[:5]]
    }
