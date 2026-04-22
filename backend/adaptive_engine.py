"""
Adaptive Training Engine
Analyzes performance and adjusts training plan dynamically
"""

import json
from typing import Dict, List, Optional
from database import get_db

# Performance thresholds for each drill type
DRILL_THRESHOLDS = {
    "driver_dispersion_game": {
        "target": 25,
        "excellent": 30,
        "needs_work": 20
    },
    "fairway_finder": {
        "target": 7,
        "excellent": 9,
        "needs_work": 5
    },
    "7iron_dispersion_game": {
        "target": 20,
        "excellent": 25,
        "needs_work": 15
    },
    "strike_ladder": {
        "target": 5,
        "excellent": 5,
        "needs_work": 3
    },
    "lag_putting_game": {
        "target": 5,  # 50% of 10 shots
        "excellent": 7,
        "needs_work": 3
    },
    "up_down_simulation": {
        "target": 5,  # 50% of 10 shots
        "excellent": 7,
        "needs_work": 3
    },
    "driver_combine": {
        "target": 6,
        "excellent": 8,
        "needs_work": 4
    },
    "iron_combine": {
        "target": 6,
        "excellent": 8,
        "needs_work": 4
    },
    "3_6_9_putting": {
        "target": 3,
        "excellent": 3,
        "needs_work": 2
    },
    "wedge_combine": {
        "target": 12,
        "excellent": 16,
        "needs_work": 8
    },
    "par_18_game": {
        "target": 18,
        "excellent": 16,
        "needs_work": 22
    }
}


def get_weekly_performance(week: int) -> Dict:
    """Get all drill completions for a specific week with scores."""
    conn = get_db()
    c = conn.cursor()
    
    c.execute("""
        SELECT drill_id, score, shot_data, completed_at
        FROM drill_completions
        WHERE week_number = ?
        ORDER BY completed_at DESC
    """, (week,))
    
    rows = c.fetchall()
    conn.close()
    
    # Group by drill_id and extract numeric scores
    drill_performance = {}
    
    for row in rows:
        drill_id = row[0]
        score_str = row[1]
        shot_data_str = row[2]
        
        if drill_id not in drill_performance:
            drill_performance[drill_id] = []
        
        # Try to extract numeric score
        score = None
        if shot_data_str:
            try:
                shot_data = json.loads(shot_data_str)
                if 'stats' in shot_data and 'totalScore' in shot_data['stats']:
                    score = shot_data['stats']['totalScore']
            except:
                pass
        
        if score is None and score_str:
            # Try to extract from score string
            import re
            numbers = re.findall(r'\d+\.?\d*', score_str)
            if numbers:
                try:
                    score = float(numbers[0])
                except:
                    pass
        
        if score is not None:
            drill_performance[drill_id].append(score)
    
    return drill_performance


def analyze_drill_performance(drill_id: str, scores: List[float]) -> Dict:
    """Analyze performance for a specific drill."""
    if not scores or drill_id not in DRILL_THRESHOLDS:
        return {"status": "no_data"}
    
    thresholds = DRILL_THRESHOLDS[drill_id]
    avg_score = sum(scores) / len(scores)
    
    if avg_score >= thresholds["excellent"]:
        status = "excellent"
        adjustment = "increase_difficulty"
    elif avg_score >= thresholds["target"]:
        status = "on_track"
        adjustment = "maintain"
    elif avg_score >= thresholds["needs_work"]:
        status = "needs_work"
        adjustment = "add_practice"
    else:
        status = "struggling"
        adjustment = "remedial_focus"
    
    return {
        "status": status,
        "avg_score": round(avg_score, 1),
        "target": thresholds["target"],
        "sessions": len(scores),
        "adjustment": adjustment,
        "trend": "improving" if len(scores) >= 2 and scores[-1] > scores[0] else "stable"
    }


def generate_weekly_adjustments(week: int) -> Dict:
    """Generate training adjustments based on previous week's performance."""
    performance = get_weekly_performance(week)
    
    adjustments = {
        "week": week,
        "analyzed_drills": {},
        "recommendations": [],
        "phase_adjustment": None
    }
    
    excellent_count = 0
    struggling_count = 0
    
    for drill_id, scores in performance.items():
        analysis = analyze_drill_performance(drill_id, scores)
        adjustments["analyzed_drills"][drill_id] = analysis
        
        if analysis["status"] == "excellent":
            excellent_count += 1
            adjustments["recommendations"].append({
                "drill_id": drill_id,
                "type": "increase_difficulty",
                "message": f"Crushing it! Increasing difficulty for {drill_id}"
            })
        elif analysis["status"] == "struggling":
            struggling_count += 1
            adjustments["recommendations"].append({
                "drill_id": drill_id,
                "type": "add_remedial",
                "message": f"Adding extra practice for {drill_id}"
            })
        elif analysis["status"] == "needs_work":
            adjustments["recommendations"].append({
                "drill_id": drill_id,
                "type": "maintain_focus",
                "message": f"Keep practicing {drill_id} - you're close to target"
            })
    
    # Phase progression logic
    total_drills = len(performance)
    if total_drills > 0:
        if excellent_count / total_drills >= 0.7:
            adjustments["phase_adjustment"] = "advance"
            adjustments["recommendations"].append({
                "type": "phase_change",
                "message": "Outstanding performance! Consider advancing to next phase early."
            })
        elif struggling_count / total_drills >= 0.5:
            adjustments["phase_adjustment"] = "extend"
            adjustments["recommendations"].append({
                "type": "phase_change",
                "message": "Extending current phase to build stronger foundation."
            })
    
    return adjustments


def get_adjusted_drill_config(drill_id: str, adjustment: str) -> Dict:
    """Get modified drill configuration based on adjustment type."""
    modifications = {
        "increase_difficulty": {
            "driver_dispersion_game": "Narrow target zones: <20 yds = 2 pts, 20-35 yds = 1 pt",
            "fairway_finder": "Reduce gate width by 25%",
            "7iron_dispersion_game": "Tighter targets: ≤8 yds = 2 pts, 8-15 yds = 1 pt",
            "lag_putting_game": "Increase distance to 25-35 ft, target within 2 ft"
        },
        "add_practice": {
            "driver_dispersion_game": "Add 10 extra drives focusing on alignment",
            "7iron_dispersion_game": "Add contact drill before dispersion test",
            "lag_putting_game": "Add distance control ladder drill"
        },
        "remedial_focus": {
            "driver_dispersion_game": "Focus on alignment and setup. Reduce to 15 shots with emphasis on process.",
            "7iron_dispersion_game": "Add towel drill and foot spray before testing",
            "strike_ladder": "Reduce to 3 consecutive strikes, focus on tempo"
        }
    }
    
    if adjustment in modifications and drill_id in modifications[adjustment]:
        return {
            "modified": True,
            "adjustment_note": modifications[adjustment][drill_id]
        }
    
    return {"modified": False}


def save_weekly_adjustment(week: int, adjustments: Dict):
    """Save adjustment recommendations to database."""
    conn = get_db()
    c = conn.cursor()
    
    c.execute("""
        CREATE TABLE IF NOT EXISTS weekly_adjustments (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            week_number INTEGER NOT NULL,
            adjustments TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)
    
    c.execute("""
        INSERT INTO weekly_adjustments (week_number, adjustments)
        VALUES (?, ?)
    """, (week, json.dumps(adjustments)))
    
    conn.commit()
    conn.close()


def get_latest_adjustments(week: int) -> Optional[Dict]:
    """Get the most recent adjustments for a week."""
    conn = get_db()
    c = conn.cursor()
    
    c.execute("""
        SELECT adjustments FROM weekly_adjustments
        WHERE week_number = ?
        ORDER BY created_at DESC
        LIMIT 1
    """, (week,))
    
    row = c.fetchone()
    conn.close()
    
    if row:
        return json.loads(row[0])
    
    return None
