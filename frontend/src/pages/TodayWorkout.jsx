import { useState, useEffect } from 'react'
import API_URL from '../config'

function TodayWorkout() {
  const [workout, setWorkout] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedWeek, setSelectedWeek] = useState(null)
  const [selectedDay, setSelectedDay] = useState(null)
  const [currentWeek, setCurrentWeek] = useState(1)
  const [currentDay, setCurrentDay] = useState(1)
  const [showScoreModal, setShowScoreModal] = useState(null)
  const [scoreInput, setScoreInput] = useState('')
  const [notesInput, setNotesInput] = useState('')

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
      // Show score modal
      setShowScoreModal(drillId)
      setScoreInput('')
      setNotesInput('')
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
              <div>
                <h3>{drill.name}</h3>
                <span className="duration">{drill.duration}</span>
              </div>
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

      {showScoreModal && (
        <div className="modal-overlay" onClick={() => setShowScoreModal(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>Log Drill Completion</h3>
            <div className="form-group">
              <label>Score/Result (optional)</label>
              <input
                type="text"
                value={scoreInput}
                onChange={(e) => setScoreInput(e.target.value)}
                placeholder="e.g. 42/50, 105 mph, 75%"
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
    </div>
  )
}

export default TodayWorkout
