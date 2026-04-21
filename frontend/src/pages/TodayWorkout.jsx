import { useState, useEffect } from 'react'
import API_URL from '../config'

function TodayWorkout() {
  const [workout, setWorkout] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTodayWorkout()
  }, [])

  const fetchTodayWorkout = async () => {
    try {
      const res = await fetch(`${API_URL}/workouts/today`)
      const data = await res.json()
      setWorkout(data)
    } catch (err) {
      console.error('Failed to fetch workout:', err)
    } finally {
      setLoading(false)
    }
  }

  const toggleDrill = async (drillId, completed) => {
    try {
      const method = completed ? 'DELETE' : 'POST'
      await fetch(`${API_URL}/workouts/complete-drill`, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          week: workout.week,
          day: workout.day,
          drill_id: drillId
        })
      })
      fetchTodayWorkout()
    } catch (err) {
      console.error('Failed to toggle drill:', err)
    }
  }

  if (loading) return <div className="loading">Loading...</div>

  if (!workout) return <div className="error">No workout found</div>

  return (
    <div className="page">
      <div className="header">
        <h1>Week {workout.week}, Day {workout.day}</h1>
        <div className="phase-badge">
          Phase {workout.phase.number}: {workout.phase.name}
        </div>
      </div>

      <div className="goal-card">
        <strong>Phase Goal:</strong> {workout.phase.goal}
      </div>

      <h2>{workout.day_name}</h2>

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
          </div>
        ))}
      </div>
    </div>
  )
}

export default TodayWorkout
