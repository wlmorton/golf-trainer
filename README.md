# Golf Trainer App

A Progressive Web App (PWA) for tracking your golf training from April 2026 through December 2026.

## Features

- **Today's Workout**: Auto-loads drills based on current week/day
- **Drill Tracking**: Check off drills as you complete them
- **Metrics Logging**: Track driver speed, center contact %, start line %, putts made
- **Handicap Tracker**: Log and visualize handicap progress over time
- **Progress Overview**: View streak, total drills completed, and trends
- **PWA**: Install on iPhone via Safari (Add to Home Screen)

## Tech Stack

- **Backend**: Python FastAPI + SQLite
- **Frontend**: React + Vite
- **PWA**: Installable, works offline

## Setup

### Backend

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Visit `http://localhost:5173` in your browser.

## Install on iPhone

1. Open Safari and navigate to the app URL
2. Tap the Share button
3. Select "Add to Home Screen"
4. Tap "Add"

The app will now appear on your home screen like a native app.

## Training Plan Structure

- **Phase 1 (Weeks 1-8)**: Foundation - Speed + Contact
- **Phase 2 (Weeks 9-16)**: Control + Shot Shaping
- **Phase 3 (Weeks 17-28)**: Scoring Focus
- **Phase 4 (Weeks 29+)**: Performance Mode

Each week has 3 training days:
- Day 1: Speed + Driver
- Day 2: Irons + Strike
- Day 3: Speed + Short Game

## Reminders

To set up workout reminders on iPhone:
1. Use the built-in Reminders app
2. Create recurring reminders for your training days (Mon/Wed/Fri recommended)
3. Link them to open the Golf Trainer app

## Database

SQLite database (`golf_trainer.db`) stores:
- Weekly metrics
- Drill completions
- Handicap history
- Session logs

## Future Enhancements

- Push notifications for workout reminders
- Charts/graphs for metrics visualization
- Export data to CSV
- Social sharing of progress
