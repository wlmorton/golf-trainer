import { useState, useEffect } from 'react'
import API_URL from '../config'

function Progress() {
  const [progress, setProgress] = useState(null)
  const [streak, setStreak] = useState(null)

  useEffect(() => {
    fetchProgress()
    fetchStreak()
  }, [])

  const fetchProgress = async () => {
    try {
      const res = await fetch(`${API_URL}/progress/overview`)
      const data = await res.json()
      setProgress(data)
    } catch (err) {
      console.error('Failed to fetch progress:', err)
    }
  }

  const fetchStreak = async () => {
    try {
      const res = await fetch(`${API_URL}/progress/streak`)
      const data = await res.json()
      setStreak(data)
    } catch (err) {
      console.error('Failed to fetch streak:', err)
    }
  }

  if (!progress) return <div className="loading">Loading...</div>

  return (
    <div className="page">
      <h1>Your Progress</h1>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-value">{progress.current_week}</div>
          <div className="stat-label">Current Week</div>
        </div>

        <div className="stat-card">
          <div className="stat-value">{progress.total_drills_completed}</div>
          <div className="stat-label">Total Drills</div>
        </div>

        <div className="stat-card">
          <div className="stat-value">{progress.drills_this_week}</div>
          <div className="stat-label">This Week</div>
        </div>

        {streak && (
          <div className="stat-card highlight">
            <div className="stat-value">🔥 {streak.streak}</div>
            <div className="stat-label">Week Streak</div>
          </div>
        )}
      </div>

      {progress.current_handicap && (
        <div className="handicap-display">
          <h2>Current Handicap</h2>
          <div className="handicap-value">{progress.current_handicap}</div>
          <div className="handicap-date">
            Last updated: {new Date(progress.handicap_logged_at).toLocaleDateString()}
          </div>
        </div>
      )}

      {progress.metrics_trend.length > 0 && (
        <div className="metrics-trend">
          <h2>Recent Metrics</h2>
          {progress.metrics_trend.map((m) => (
            <div key={m.week_number} className="trend-row">
              <strong>Week {m.week_number}</strong>
              <div className="trend-values">
                {m.driver_speed && <span>Speed: {m.driver_speed} mph</span>}
                {m.driver_avg_offline && <span>Driver Offline: {m.driver_avg_offline} yds</span>}
                {m.center_contact_pct && <span>Contact: {m.center_contact_pct}%</span>}
                {m.iron_7i_offline && <span>7i Offline: {m.iron_7i_offline} yds</span>}
                {m.putting_5ft_made && m.putting_5ft_total && (
                  <span>5ft Putts: {Math.round(m.putting_5ft_made/m.putting_5ft_total*100)}%</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Progress
