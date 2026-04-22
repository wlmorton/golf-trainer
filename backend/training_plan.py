"""
Static training plan data derived from the golf training schedule document.
Weeks 1-29+ mapped to phases, days, and drills.
"""

def get_phase(week: int) -> dict:
    if week <= 8:
        return {
            "number": 1, 
            "name": "Foundation", 
            "goal": "Center contact, +3-6 mph speed, establish stock shot, baseline Garmin data",
            "benchmarks": "Driver offline ≤25 yards avg, 7i offline ≤10-12 yards, Wedges within ±5 yards, 5ft putts 80%+"
        }
    elif week <= 16:
        return {
            "number": 2, 
            "name": "Control", 
            "goal": "Tighten dispersion (Garmin focus), add shot shaping, introduce pressure",
            "benchmarks": "Driver offline ≤25 yards avg, 7i offline ≤10-12 yards, Wedges within ±5 yards, 5ft putts 80%+"
        }
    elif week <= 28:
        return {
            "number": 3, 
            "name": "Scoring Focus", 
            "goal": "Wedges + putting priority, on-course simulation, distance control mastery",
            "benchmarks": "Driver offline ≤25 yards avg, 7i offline ≤10-12 yards, Wedges within ±5 yards, 5ft putts 80%+"
        }
    else:
        return {
            "number": 4, 
            "name": "Performance Mode", 
            "goal": "Maintain speed, practice like you play, peak performance",
            "benchmarks": "Driver offline ≤25 yards avg, 7i offline ≤10-12 yards, Wedges within ±5 yards, 5ft putts 80%+"
        }


PHASE1_DAYS = {
    1: {
        "name": "Speed + Driver (Net + Stack + Garmin)",
        "drills": [
            {
                "id": "stack_system",
                "name": "Stack System",
                "duration": "25 min",
                "instructions": "Follow the Stack app Foundation program. Record your speeds every session.",
            },
            {
                "id": "start_line_gate",
                "name": "Start Line Gate Drill",
                "duration": "15 min",
                "instructions": "Hit 30 balls through gate (2 alignment sticks ~2 yards apart). Goal: start ball through gate.",
            },
            {
                "id": "face_awareness",
                "name": "Face Awareness Drill",
                "duration": "10 min",
                "instructions": "Hit 10 'hold face open' (fade feel) then 10 'close face' (draw feel). Learning face control.",
            },
            {
                "id": "driver_dispersion_game",
                "name": "Driver Dispersion Game 🎯",
                "duration": "15 min",
                "instructions": "Hit 20 drives. Track offline distance with Garmin. Scoring: <25 yds = 2 pts, 25-40 yds = 1 pt, >40 yds = 0 pts. Goal: 25+ points.",
            },
            {
                "id": "fairway_finder",
                "name": "Fairway Finder Challenge 🎯",
                "duration": "10 min",
                "instructions": "Narrow gate version. Hit 10 balls through tighter gate. Goal: 7/10 through gate.",
            },
        ],
    },
    2: {
        "name": "Irons + Strike (Net + Garmin)",
        "drills": [
            {
                "id": "foot_spray",
                "name": "Foot Spray Contact Drill",
                "duration": "20 min",
                "instructions": "Spray clubface with foot spray. Track center contact % and miss pattern (toe/heel/center).",
            },
            {
                "id": "low_point_towel",
                "name": "Low Point Control (Towel Drill)",
                "duration": "15 min",
                "instructions": "Place towel 2-3 inches behind ball. Don't hit towel.",
            },
            {
                "id": "random_club",
                "name": "Random Club Switching",
                "duration": "15 min",
                "instructions": "Rotate clubs every swing: 9i → 7i → 5i → repeat.",
            },
            {
                "id": "7iron_dispersion_game",
                "name": "7 Iron Dispersion Game 🎯",
                "duration": "15 min",
                "instructions": "Hit 15 balls with 7 iron. Scoring: ≤10 yds offline = 2 pts, 10-20 yds = 1 pt, >20 yds = 0 pts. Goal: 20+ points.",
            },
            {
                "id": "strike_ladder",
                "name": "Strike Ladder 🎯",
                "duration": "10 min",
                "instructions": "Hit 5 perfect center strikes in a row. If you miss center, restart.",
            },
        ],
    },
    3: {
        "name": "Speed + Short Game",
        "drills": [
            {
                "id": "stack_short",
                "name": "Stack System",
                "duration": "20-25 min",
                "instructions": "Follow the Stack app session for today.",
            },
            {
                "id": "gate_putting",
                "name": "Gate Putting Drill",
                "duration": "10 min",
                "instructions": "Place 2 tees slightly wider than putter. 50 reps from 5 ft.",
            },
            {
                "id": "landing_spot",
                "name": "Landing Spot Drill",
                "duration": "15 min",
                "instructions": "Place a towel as landing zone. Chip into net trying to hit the towel.",
            },
            {
                "id": "pressure_putting",
                "name": "Pressure Putting",
                "duration": "5 min",
                "instructions": "Make 10 putts in a row from 5 ft. Miss = restart.",
            },
            {
                "id": "lag_putting_game",
                "name": "Lag Putting Game 🎯",
                "duration": "10 min",
                "instructions": "Putt to 20-30 ft targets. Goal: inside 3 ft = success. Track your success %.",
            },
            {
                "id": "up_down_simulation",
                "name": "Up & Down Simulation 🎯",
                "duration": "10 min",
                "instructions": "Chip → simulate putt. Scoring: up & down = 1, miss = 0. Goal: 50%+ success rate.",
            },
        ],
    },
}

PHASE1_WEEKS_5_8_ADDITIONS = {
    1: "Progression: Narrow gate further. Add 'call shot' before each swing.",
    2: "Progression: Must call shot shape before hitting. Dispersion target tightens.",
    3: "Progression: Pressure putting → 15 in a row. Up & Down goal → 60%.",
}

PHASE2_DAYS = {
    1: {
        "name": "Speed + Driver (Net + Stack + Garmin)",
        "drills": [
            {
                "id": "stack_system",
                "name": "Stack System",
                "duration": "25 min",
                "instructions": "Follow the Stack program. Track speeds.",
            },
            {
                "id": "shot_shaping_ladder",
                "name": "Shot Shaping Ladder",
                "duration": "20 min",
                "instructions": "Hit 5 fades, 5 draws, 5 straight. Must complete the full sequence without restarting.",
            },
            {
                "id": "driver_combine",
                "name": "Driver Combine Test 🎯",
                "duration": "15 min",
                "instructions": "10 random 'holes'. Pick target + shape each time. Scoring: fairway hit = 1, miss = 0. Track your score.",
            },
        ],
    },
    2: {
        "name": "Irons + Strike (Net + Garmin)",
        "drills": [
            {
                "id": "distance_control_ladder",
                "name": "Distance Control Ladder",
                "duration": "20 min",
                "instructions": "Pick one club. Hit at 50%, 75%, 100% swing. Repeat 3x each. Track carry with Garmin.",
            },
            {
                "id": "strike_start_combo",
                "name": "Strike + Start Combo",
                "duration": "15 min",
                "instructions": "Each shot must have center contact AND start on your intended line.",
            },
            {
                "id": "iron_combine",
                "name": "Iron Combine 🎯",
                "duration": "15 min",
                "instructions": "10 shots. Different targets each. Scoring: on target line = 1, miss = 0. Track your score.",
            },
        ],
    },
    3: {
        "name": "Speed + Short Game",
        "drills": [
            {
                "id": "stack_short",
                "name": "Stack System",
                "duration": "20-25 min",
                "instructions": "Follow the Stack app session.",
            },
            {
                "id": "putting_ladder",
                "name": "Putting Ladder Drill",
                "duration": "15 min",
                "instructions": "Make putts from 3 ft, then 5 ft, then 7 ft. Must make all at each distance before moving back.",
            },
            {
                "id": "3_6_9_putting",
                "name": "3-6-9 Putting Game 🎯",
                "duration": "15 min",
                "instructions": "3 ft → 6 ft → 9 ft. Goal: make all before moving back. Track completion.",
            },
            {
                "id": "one_ball_routine",
                "name": "One-Ball Routine",
                "duration": "10 min",
                "instructions": "10 shots with full pre-shot routine before each one.",
            },
        ],
    },
}

PHASE3_DAYS = {
    1: {
        "name": "Speed + Driver (Net + Stack + Garmin)",
        "drills": [
            {
                "id": "stack_system",
                "name": "Stack System (Maintenance)",
                "duration": "20 min",
                "instructions": "Stack 2x/week only (maintenance). Track speeds.",
            },
            {
                "id": "course_sim_drives",
                "name": "Course Simulation Drives 🎯",
                "duration": "20 min",
                "instructions": "Pick real holes. Commit to shot shape and target before each swing. Track with Garmin.",
            },
        ],
    },
    2: {
        "name": "Irons + Wedges (Net + Garmin)",
        "drills": [
            {
                "id": "wedge_matrix",
                "name": "Wedge Matrix",
                "duration": "30 min",
                "instructions": "Build 3 distances per wedge: half swing, 3/4 swing, full swing. Track carry with Garmin. Random practice only — NO block practice.",
            },
            {
                "id": "wedge_combine",
                "name": "Wedge Combine 🎯",
                "duration": "15 min",
                "instructions": "10 wedge shots. Scoring: within 10 ft = 2 pts, 10-20 ft = 1 pt, >20 ft = 0 pts. Track your score.",
            },
        ],
    },
    3: {
        "name": "Short Game",
        "drills": [
            {
                "id": "up_and_down",
                "name": "Up-and-Down Game",
                "duration": "20 min",
                "instructions": "Chip → putt simulation. Track your % up-and-down success rate.",
            },
            {
                "id": "par_18_game",
                "name": "Par 18 Game 🎯",
                "duration": "20 min",
                "instructions": "9 chip + putt scenarios. Goal: score ≤ 18. Track your total score.",
            },
            {
                "id": "pressure_putting_upgrade",
                "name": "Pressure Putting Upgrade",
                "duration": "15 min",
                "instructions": "Make 25 total putts from 5 ft. Track every miss.",
            },
        ],
    },
}

PHASE4_DAYS = {
    1: {
        "name": "Play Practice",
        "drills": [
            {
                "id": "full_combine",
                "name": "Full Combine Session 🎯",
                "duration": "45 min",
                "instructions": "Driver → Iron → Wedge → Putt. Score each 'hole'. Full routine every shot. Track with Garmin.",
            },
            {
                "id": "stack_maintenance",
                "name": "Stack System (Maintenance)",
                "duration": "15 min",
                "instructions": "1-2x per week only. Maintain speed gains.",
            },
        ],
    },
    2: {
        "name": "Play Practice",
        "drills": [
            {
                "id": "play_practice_full",
                "name": "Play Practice Sequence",
                "duration": "45 min",
                "instructions": "Driver → Iron → Wedge → repeat. Simulate real holes. No block practice.",
            },
        ],
    },
    3: {
        "name": "Short Game Challenge",
        "drills": [
            {
                "id": "par_18_weekly",
                "name": "Par 18 Weekly Challenge 🎯",
                "duration": "30 min",
                "instructions": "9 holes (chip + putt each). Goal: score ≤ 18. Track improvement week over week.",
            },
            {
                "id": "pressure_putting_final",
                "name": "Pressure Putting",
                "duration": "10 min",
                "instructions": "Make 25 total putts from 5 ft. Track misses.",
            },
        ],
    },
}


def get_day_plan(week: int, day: int) -> dict:
    """Return the drill plan for a given week and day number (1, 2, or 3)."""
    phase = get_phase(week)
    phase_num = phase["number"]

    if phase_num == 1:
        days = PHASE1_DAYS
        additions = PHASE1_WEEKS_5_8_ADDITIONS if week >= 5 else {}
        day_plan = dict(days.get(day, {}))
        if additions and day in additions:
            day_plan["progression_note"] = additions[day]
    elif phase_num == 2:
        days = PHASE2_DAYS
        day_plan = dict(days.get(day, {}))
    elif phase_num == 3:
        days = PHASE3_DAYS
        day_plan = dict(days.get(day, {}))
    else:
        days = PHASE4_DAYS
        day_plan = dict(days.get(day, {}))

    return {
        "week": week,
        "day": day,
        "phase": phase,
        "day_name": day_plan.get("name", "Rest / Flex"),
        "drills": day_plan.get("drills", []),
        "progression_note": day_plan.get("progression_note"),
    }
