from fastapi import APIRouter
from adaptive_engine import (
    generate_weekly_adjustments,
    save_weekly_adjustment,
    get_latest_adjustments,
    get_weekly_performance,
    get_adjusted_drill_config
)

router = APIRouter()

@router.post("/analyze-week/{week_number}")
def analyze_week(week_number: int):
    """Analyze performance for a week and generate adjustments."""
    adjustments = generate_weekly_adjustments(week_number)
    save_weekly_adjustment(week_number, adjustments)
    return adjustments

@router.get("/adjustments/{week_number}")
def get_adjustments(week_number: int):
    """Get adjustments for a specific week."""
    adjustments = get_latest_adjustments(week_number)
    if not adjustments:
        # Generate if not exists
        adjustments = generate_weekly_adjustments(week_number)
        if adjustments["analyzed_drills"]:
            save_weekly_adjustment(week_number, adjustments)
    return adjustments

@router.get("/performance/{week_number}")
def get_performance(week_number: int):
    """Get raw performance data for a week."""
    return get_weekly_performance(week_number)

@router.get("/drill-adjustment/{drill_id}/{adjustment_type}")
def get_drill_adjustment(drill_id: str, adjustment_type: str):
    """Get specific drill adjustment configuration."""
    return get_adjusted_drill_config(drill_id, adjustment_type)
