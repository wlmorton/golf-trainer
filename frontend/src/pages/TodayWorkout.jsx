import { useState, useEffect } from 'react'
import API_URL from '../config'
import ShotTracker from '../components/ShotTracker'

function TodayWorkout() {
  const [workout, setWorkout] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedWeek, setSelectedWeek] = useState(null)
  const [selectedDay, setSelectedDay] = useState(null)
  const [currentWeek, setCurrentWeek] = useState(1)
  const [currentDay, setCurrentDay] = useState(1)
  const [showScoreModal, setShowScoreModal] = useState(null)
  const [showShotTracker, setShowShotTracker] = useState(null)
  const [scoreInput, setScoreInput] = useState('')
  const [notesInput, setNotesInput] = useState('')
  const [showHistory, setShowHistory] = useState(null)
  const [drillHistory, setDrillHistory] = useState([])
  const [drillStats, setDrillStats] = useState(null)

  // List of drill IDs that use shot tracking
  const GAME_DRILLS = [
    'driver_dispersion_game',
    'fairway_finder',
    '7iron_dispersion_game',
    'strike_ladder',
    'lag_putting_game',
    'up_down_simulation',
    'driver_combine',
    'iron_combine',
    '3_6_9_putting',
    'wedge_combine',
    'par_18_game',
    'full_combine'
  ]

  useEffect(() => {
    fetchTodayWorkout()
  }, [])

  useEffect(() => {
    if (selectedWeek !== null && selectedDay !== null) {
      fetchSpecificWorkout(selectedWeek, selectedDay)
    }
  }, [selectedWeek, selectedDay])

  const fetchTodayWorkout = async () => {
    try {
      const res = await fetch(`${API_URL}/workouts/today`)
      const data = await res.json()
      setWorkout(data)
      setCurrentWeek(data.week)
      setCurrentDay(data.day)
      setSelectedWeek(data.week)
      setSelectedDay(data.day)
    } catch (err) {
      console.error('Failed to fetch workout:', err)
    } finally {
      setLoading(false)
    }
  }

  const fetchSpecificWorkout = async (week, day) => {
    try {
      setLoading(true)
      const res = await fetch(`${API_URL}/workouts/workout/${week}/${day}`)
      const data = await res.json()
      setWorkout(data)
    } catch (err) {
      console.error('Failed to fetch workout:', err)
    } finally {
      setLoading(false)
    }
  }

  const fetchDrillHistory = async (drillId) => {
    try {
      const [historyRes, statsRes] = await Promise.all([
        fetch(`${API_URL}/workouts/drill-history/${drillId}`),
        fetch(`${API_URL}/workouts/drill-stats/${drillId}`)
      ])
      const history = await historyRes.json()
      const stats = await statsRes.json()
      setDrillHistory(history)
      setDrillStats(stats)
      setShowHistory(drillId)
    } catch (err) {
      console.error('Failed to fetch drill history:', err)
    }
  }

  const toggleDrill = async (drillId, completed) => {
    if (completed) {
      // Uncomplete
      try {
        await fetch(`${API_URL}/workouts/complete-drill`, {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            week: selectedWeek,
            day: selectedDay,
            drill_id: drillId
          })
        })
        fetchSpecificWorkout(selectedWeek, selectedDay)
      } catch (err) {
        console.error('Failed to toggle drill:', err)
      }
    } else {
      // Check if this is a game drill
      if (GAME_DRILLS.includes(drillId)) {
        setShowShotTracker(drillId)
      } else {
        setShowScoreModal(drillId)
        setScoreInput('')
        setNotesInput('')
      }
    }
  }

  const handleShotTrackerComplete = async (totalScore, shotData) => {
    try {
      await fetch(`${API_URL}/workouts/complete-drill`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          week: selectedWeek,
          day: selectedDay,
          drill_id: showShotTracker,
          score: `${totalScore} points`,
          shot_data: JSON.stringify(shotData),
          notes: null
        })
      })
      setShowShotTracker(null)
      fetchSpecificWorkout(selectedWeek, selectedDay)
    } catch (err) {
      console.error('Failed to save drill:', err)
    }
  }

  const saveDrillCompletion = async () => {
    try {
      await fetch(`${API_URL}/workouts/complete-drill`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          week: selectedWeek,
          day: selectedDay,
          drill_id: showScoreModal,
          score: scoreInput || null,
          notes: notesInput || null
        })
      })
      setShowScoreModal(null)
      fetchSpecificWorkout(selectedWeek, selectedDay)
    } catch (err) {
      console.error('Failed to save drill:', err)
    }
  }

  const changeWeek = (delta) => {
    const newWeek = Math.max(1, Math.min(30, selectedWeek + delta))
    setSelectedWeek(newWeek)
  }

  const changeDay = (delta) => {
    let newDay = selectedDay + delta
    if (newDay < 1) newDay = 3
    if (newDay > 3) newDay = 1
    setSelectedDay(newDay)
  }

  if (loading) return <div className="loading">Loading...</div>

  if (!workout) return <div className="error">No workout found</div>

  const isToday = selectedWeek === currentWeek && selectedDay === currentDay

  return (
    <div className="page">
      <div className="workout-nav">
        <div className="nav-section">
          <button onClick={() => changeWeek(-1)} className="nav-btn">←</button>
          <span className="nav-label">Week {selectedWeek}</span>
          <button onClick={() => changeWeek(1)} className="nav-btn">→</button>
        </div>
        <div className="nav-section">
          <button onClick={() => changeDay(-1)} className="nav-btn">←</button>
          <span className="nav-label">Day {selectedDay}</span>
          <button onClick={() => changeDay(1)} className="nav-btn">→</button>
        </div>
        {!isToday && (
          <button 
            onClick={() => {
              setSelectedWeek(currentWeek)
              setSelectedDay(currentDay)
            }} 
            className="today-btn"
          >
            Today
          </button>
        )}
      </div>

      <div className="header">
        <h1>{workout.day_name}</h1>
        <div className="phase-badge">
          Phase {workout.phase.number}: {workout.phase.name}
        </div>
      </div>

      <div className="goal-card">
        <strong>Phase Goal:</strong> {workout.phase.goal}
      </div>

      {workout.progression_note && (
        <div className="progression-note">
          📈 {workout.progression_note}
        </div>
      )}

      <div className="drills">
        {workout.drills.map((drill) => (
          <div key={drill.id} className={`drill-card ${drill.completed ? 'completed' : ''}`}>
            <div className="drill-header">
              <input
                type="checkbox"
                checked={drill.completed}
                onChange={() => toggleDrill(drill.id, drill.completed)}
                className="drill-checkbox"
              />
              <div className="drill-title-section">
                <h3>{drill.name}</h3>
                <span className="duration">{drill.duration}</span>
              </div>
              <button 
                onClick={() => fetchDrillHistory(drill.id)} 
                className="history-btn"
                title="View history"
              >
                📊
              </button>
            </div>
            <p className="instructions">{drill.instructions}</p>
            {drill.completed && drill.score && (
              <div className="drill-score">
                <strong>Score:</strong> {drill.score}
              </div>
            )}
            {drill.completed && drill.notes && (
              <div className="drill-notes">
                <strong>Notes:</strong> {drill.notes}
              </div>
            )}
          </div>
        ))}
      </div>

      {showShotTracker && (
        <div className="modal-overlay" onClick={() => setShowShotTracker(null)}>
          <div className="modal tracker-modal" onClick={(e) => e.stopPropagation()}>
            <ShotTracker 
              drillId={showShotTracker}
              onComplete={handleShotTrackerComplete}
              onCancel={() => setShowShotTracker(null)}
            />
          </div>
        </div>
      )}

      {showScoreModal && (
        <div className="modal-overlay" onClick={() => setShowScoreModal(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>Log Drill Completion</h3>
            <div className="form-group">
              <label>Score/Result</label>
              <input
                type="text"
                value={scoreInput}
                onChange={(e) => setScoreInput(e.target.value)}
                placeholder="e.g. 42/50, 25 points, 105 mph"
                autoFocus
              />
            </div>
            <div className="form-group">
              <label>Notes (optional)</label>
              <textarea
                value={notesInput}
                onChange={(e) => setNotesInput(e.target.value)}
                placeholder="How did it feel? Any observations..."
                rows="3"
              />
            </div>
            <div className="modal-actions">
              <button onClick={() => setShowScoreModal(null)} className="btn-secondary">
                Cancel
              </button>
              <button onClick={saveDrillCompletion} className="btn-primary">
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {showHistory && (
        <div className="modal-overlay" onClick={() => setShowHistory(null)}>
          <div className="modal history-modal" onClick={(e) => e.stopPropagation()}>
            <h3>Drill History</h3>
            
            {drillStats && (
              <div className="stats-summary">
                <div className="stat-item">
                  <span className="stat-label">Total Sessions</span>
                  <span className="stat-value">{drillStats.total_completions}</span>
                </div>
                {drillStats.average && (
                  <>
                    <div className="stat-item">
                      <span className="stat-label">Average</span>
                      <span className="stat-value">{drillStats.average}</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-label">Best</span>
                      <span className="stat-value">{drillStats.best}</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-label">Trend</span>
                      <span className={`stat-value ${drillStats.trend === 'improving' ? 'positive' : ''}`}>
                        {drillStats.trend === 'improving' ? '📈' : '➡️'} {drillStats.trend}
                      </span>
                    </div>
                  </>
                )}
              </div>
            )}

            <div className="history-list">
              <h4>Recent Sessions</h4>
              {drillHistory.length === 0 ? (
                <p className="no-history">No history yet. Complete this drill to start tracking!</p>
              ) : (
                drillHistory.map((entry, idx) => {
                  const shotData = entry.shot_data ? JSON.parse(entry.shot_data) : null
                  return (
                    <div key={idx} className="history-entry">
                      <div className="history-entry-header">
                        <span className="history-week">Week {entry.week}, Day {entry.day}</span>
                        <span className="history-date">
                          {new Date(entry.completed_at).toLocaleDateString()}
                        </span>
                      </div>
                      {entry.score && (
                        <div className="history-score">
                          <strong>Score:</strong> {entry.score}
                        </div>
                      )}
                      {shotData && shotData.stats && (
                        <div className="shot-stats">
                          {shotData.stats.avg && (
                            <span>Avg: {shotData.stats.avg} | Best: {shotData.stats.best} | Worst: {shotData.stats.worst}</span>
                          )}
                        </div>
                      )}
                      {entry.notes && (
                        <div className="history-notes">{entry.notes}</div>
                      )}
                    </div>
                  )
                })
              )}
            </div>

            <button onClick={() => setShowHistory(null)} className="btn-primary">
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default TodayWorkout
