from fastapi import APIRouter
from database import get_db
from routers.workouts import get_current_week

router = APIRouter()

@router.get("/overview")
def get_progress_overview():
    """Get overall progress stats."""
    week = get_current_week()
    
    conn = get_db()
    c = conn.cursor()
    
    # Total drills completed
    c.execute("SELECT COUNT(*) FROM drill_completions")
    total_drills = c.fetchone()[0]
    
    # Drills this week
    c.execute("""
        SELECT COUNT(*) FROM drill_completions 
        WHERE week_number = ?
    """, (week,))
    drills_this_week = c.fetchone()[0]
    
    # Latest handicap
    c.execute("""
        SELECT handicap, logged_at FROM handicap_log 
        ORDER BY logged_at DESC LIMIT 1
    """)
    handicap_row = c.fetchone()
    
    # Metrics trend (last 4 weeks)
    c.execute("""
        SELECT week_number, driver_speed, driver_avg_offline, center_contact_pct, 
               iron_7i_offline, putting_5ft_made, putting_5ft_total
        FROM weekly_metrics 
        WHERE week_number >= ?
        ORDER BY week_number ASC
    """, (max(1, week - 3),))
    metrics_trend = [dict(row) for row in c.fetchall()]
    
    conn.close()
    
    return {
        "current_week": week,
        "total_drills_completed": total_drills,
        "drills_this_week": drills_this_week,
        "current_handicap": handicap_row[0] if handicap_row else None,
        "handicap_logged_at": handicap_row[1] if handicap_row else None,
        "metrics_trend": metrics_trend
    }

@router.get("/streak")
def get_completion_streak():
    """Calculate current training streak (consecutive weeks with drills completed)."""
    conn = get_db()
    c = conn.cursor()
    
    c.execute("""
        SELECT DISTINCT week_number 
        FROM drill_completions 
        ORDER BY week_number DESC
    """)
    weeks = [row[0] for row in c.fetchall()]
    conn.close()
    
    if not weeks:
        return {"streak": 0}
    
    streak = 1
    for i in range(len(weeks) - 1):
        if weeks[i] - weeks[i + 1] == 1:
            streak += 1
        else:
            break
    
    return {"streak": streak, "weeks_trained": weeks}
