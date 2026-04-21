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
                "instructions": "Follow the Stack program. Swing at max intent. Track speed every session.",
            },
            {
                "id": "start_line_gate",
                "name": "Start Line Gate Drill",
                "duration": "15 min",
                "instructions": "Hit 30 balls through gate (2 alignment sticks ~2 yards apart). Track start line + offline with Garmin. Goal: ≥70% through gate.",
            },
            {
                "id": "driver_dispersion",
                "name": "Driver Dispersion Test",
                "duration": "15 min",
                "instructions": "Hit 20 drives. Track carry distance and offline (yards left/right) with Garmin. This becomes your baseline.",
            },
            {
                "id": "face_control",
                "name": "Face Control Drill",
                "duration": "10 min",
                "instructions": "Hit 10 fades (hold face open) then 10 draws (release face). Learning face control.",
            },
        ],
    },
    2: {
        "name": "Irons + Contact (Net + Garmin)",
        "drills": [
            {
                "id": "contact_spray",
                "name": "Contact Spray Drill",
                "duration": "20 min",
                "instructions": "Spray clubface with foot spray. Track center contact % and miss pattern (toe/heel/center).",
            },
            {
                "id": "low_point_towel",
                "name": "Low Point Control (Towel Drill)",
                "duration": "15 min",
                "instructions": "Place towel 2-3 inches behind ball. Don't hit towel. Goal: ≥80% clean strikes.",
            },
            {
                "id": "7iron_dispersion",
                "name": "7 Iron Dispersion Test",
                "duration": "15 min",
                "instructions": "Hit 15 balls with 7 iron. Track carry distance and offline with Garmin.",
            },
            {
                "id": "wedge_ladder",
                "name": "Wedge Ladder",
                "duration": "15 min",
                "instructions": "Hit wedges at 50% swing, 75% swing, and full swing. Track carry distance for each with Garmin.",
            },
        ],
    },
    3: {
        "name": "Range + Putting Green",
        "drills": [
            {
                "id": "play_simulation",
                "name": "Play Simulation",
                "duration": "25 min",
                "instructions": "Driver → Iron → Wedge sequence. Use full routine. Track shape, distance, and offline with Garmin.",
            },
            {
                "id": "putting_gate",
                "name": "Putting Gate Drill",
                "duration": "10 min",
                "instructions": "Place 2 tees slightly wider than putter. 50 reps from 5 ft. Focus on start line control.",
            },
            {
                "id": "distance_control_putting",
                "name": "Distance Control Putting",
                "duration": "10 min",
                "instructions": "Putt from 10 ft, 20 ft, 30 ft. Goal: within 3 ft of hole.",
            },
            {
                "id": "pressure_putting",
                "name": "Pressure Putting",
                "duration": "10 min",
                "instructions": "Make 10 putts in a row from 5 ft. Miss = restart.",
            },
        ],
    },
}

PHASE1_WEEKS_5_8_ADDITIONS = {
    1: "Progression: Narrow the gate (harder target). Add shot call before each swing.",
    2: "Progression: Call your shot before hitting ('small fade' or 'straight').",
    3: "Progression: Increase pressure putting to 15 in a row to finish.",
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
        ],
    },
    2: {
        "name": "Irons + Contact (Net + Garmin)",
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
        ],
    },
    3: {
        "name": "Range + Putting Green",
        "drills": [
            {
                "id": "play_simulation",
                "name": "Play Simulation",
                "duration": "25 min",
                "instructions": "Driver → Iron → Wedge. Full routine. Track with Garmin.",
            },
            {
                "id": "putting_ladder",
                "name": "Putting Ladder Drill",
                "duration": "15 min",
                "instructions": "Make putts from 3 ft, then 5 ft, then 7 ft. Must make all at each distance before moving back.",
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
                "id": "simulated_drives",
                "name": "Simulated On-Course Drives",
                "duration": "20 min",
                "instructions": "10 drives. Pick a specific hole, shape, and commit before each swing. Track with Garmin.",
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
        ],
    },
    3: {
        "name": "Range + Putting Green",
        "drills": [
            {
                "id": "up_and_down",
                "name": "Up-and-Down Game",
                "duration": "20 min",
                "instructions": "Chip → putt simulation. Track your % up-and-down success rate.",
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
                "id": "play_practice_full",
                "name": "Play Practice Sequence",
                "duration": "40 min",
                "instructions": "Driver → Iron → Wedge → repeat. Simulate real holes. Full routine every shot. Track with Garmin.",
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
        "name": "Range + Putting Green",
        "drills": [
            {
                "id": "par_18",
                "name": "Par 18 Short Game Challenge",
                "duration": "30 min",
                "instructions": "9 holes (chip + putt each). Goal: score ≤ 18.",
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
