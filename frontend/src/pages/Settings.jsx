import { useState, useEffect } from 'react'
import API_URL from '../config'

function Settings() {
  const [startDate, setStartDate] = useState('')
  const [loading, setLoading] = useState(false)
  const [currentWeek, setCurrentWeek] = useState(null)

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      const res = await fetch(`${API_URL}/settings/start-date`)
      const data = await res.json()
      if (data.start_date) {
        setStartDate(data.start_date)
      }
      setCurrentWeek(data.current_week)
    } catch (err) {
      console.error('Failed to fetch settings:', err)
    }
  }

  const saveStartDate = async () => {
    if (!startDate) {
      alert('Please enter a start date')
      return
    }

    try {
      setLoading(true)
      const res = await fetch(`${API_URL}/settings/start-date`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ start_date: startDate })
      })
      
      if (!res.ok) {
        throw new Error('Failed to save start date')
      }

      const data = await res.json()
      setCurrentWeek(data.current_week)
      alert('Start date saved! You are now on Week ' + data.current_week)
    } catch (err) {
      console.error('Failed to save start date:', err)
      alert('Error saving start date: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  const setToToday = () => {
    const today = new Date().toISOString().split('T')[0]
    setStartDate(today)
  }

  return (
    <div className="page">
      <h1>Settings</h1>

      <div className="settings-section">
        <h2>Training Start Date</h2>
        <p className="settings-description">
          Set when you started Week 1 of your training program. This determines which week and phase you're currently in.
        </p>

        {currentWeek !== null && (
          <div className="current-week-display">
            <strong>Current Week:</strong> Week {currentWeek}
          </div>
        )}

        <div className="form-group">
          <label>Start Date (Week 1, Day 1)</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="date-input"
          />
        </div>

        <div className="button-group">
          <button onClick={setToToday} className="btn-secondary">
            Start Today
          </button>
          <button onClick={saveStartDate} className="btn-primary" disabled={loading}>
            {loading ? 'Saving...' : 'Save Start Date'}
          </button>
        </div>

        <div className="settings-info">
          <h3>How it works:</h3>
          <ul>
            <li>Week 1 starts on the date you set</li>
            <li>Each week runs for 7 days</li>
            <li>The app automatically calculates your current week</li>
            <li>Phases progress based on week number</li>
          </ul>
        </div>
      </div>

      <div className="settings-section">
        <h2>Training Schedule</h2>
        <div className="schedule-info">
          <div className="schedule-item">
            <strong>Phase 1:</strong> Weeks 1-8 (Foundation)
          </div>
          <div className="schedule-item">
            <strong>Phase 2:</strong> Weeks 9-16 (Control)
          </div>
          <div className="schedule-item">
            <strong>Phase 3:</strong> Weeks 17-28 (Scoring)
          </div>
          <div className="schedule-item">
            <strong>Phase 4:</strong> Weeks 29+ (Performance)
          </div>
        </div>
      </div>
    </div>
  )
}

export default Settings
