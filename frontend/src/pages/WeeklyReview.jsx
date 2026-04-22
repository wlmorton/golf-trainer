import { useState, useEffect } from 'react'
import API_URL from '../config'

function WeeklyReview() {
  const [week, setWeek] = useState(1)
  const [adjustments, setAdjustments] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchCurrentWeek()
  }, [])

  const fetchCurrentWeek = async () => {
    try {
      const res = await fetch(`${API_URL}/workouts/today`)
      const data = await res.json()
      setWeek(data.week)
      if (data.week > 1) {
        fetchAdjustments(data.week - 1) // Show last week's analysis
      }
    } catch (err) {
      console.error('Failed to fetch week:', err)
    }
  }

  const fetchAdjustments = async (weekNum) => {
    try {
      setLoading(true)
      const res = await fetch(`${API_URL}/adaptive/adjustments/${weekNum}`)
      const data = await res.json()
      setAdjustments(data)
    } catch (err) {
      console.error('Failed to fetch adjustments:', err)
    } finally {
      setLoading(false)
    }
  }

  const analyzeWeek = async (weekNum) => {
    try {
      setLoading(true)
      const res = await fetch(`${API_URL}/adaptive/analyze-week/${weekNum}`, {
        method: 'POST'
      })
      const data = await res.json()
      setAdjustments(data)
    } catch (err) {
      console.error('Failed to analyze week:', err)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'excellent': return '#10b981'
      case 'on_track': return '#3b82f6'
      case 'needs_work': return '#f59e0b'
      case 'struggling': return '#ef4444'
      default: return '#6b7280'
    }
  }

  const getStatusEmoji = (status) => {
    switch (status) {
      case 'excellent': return '🔥'
      case 'on_track': return '✅'
      case 'needs_work': return '⚠️'
      case 'struggling': return '🔴'
      default: return '➖'
    }
  }

  if (loading) return <div className="loading">Analyzing performance...</div>

  return (
    <div className="page">
      <h1>Weekly Review</h1>
      
      <div className="week-selector">
        <button onClick={() => setWeek(Math.max(1, week - 1))} className="nav-btn">←</button>
        <span className="week-display">Week {week}</span>
        <button onClick={() => setWeek(week + 1)} className="nav-btn">→</button>
      </div>

      {week > 1 && (
        <button 
          onClick={() => analyzeWeek(week - 1)} 
          className="btn-primary analyze-btn"
        >
          Analyze Week {week - 1}
        </button>
      )}

      {adjustments && Object.keys(adjustments.analyzed_drills).length > 0 ? (
        <>
          <div className="review-summary">
            <h2>Performance Summary</h2>
            <div className="drill-reviews">
              {Object.entries(adjustments.analyzed_drills).map(([drillId, analysis]) => (
                <div 
                  key={drillId} 
                  className="drill-review-card"
                  style={{ borderLeftColor: getStatusColor(analysis.status) }}
                >
                  <div className="drill-review-header">
                    <span className="drill-status-emoji">{getStatusEmoji(analysis.status)}</span>
                    <div>
                      <h3>{drillId.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</h3>
                      <span className="drill-status-label" style={{ color: getStatusColor(analysis.status) }}>
                        {analysis.status.replace(/_/g, ' ')}
                      </span>
                    </div>
                  </div>
                  
                  <div className="drill-review-stats">
                    <div className="review-stat">
                      <span className="review-stat-label">Average Score</span>
                      <span className="review-stat-value">{analysis.avg_score}</span>
                    </div>
                    <div className="review-stat">
                      <span className="review-stat-label">Target</span>
                      <span className="review-stat-value">{analysis.target}</span>
                    </div>
                    <div className="review-stat">
                      <span className="review-stat-label">Sessions</span>
                      <span className="review-stat-value">{analysis.sessions}</span>
                    </div>
                    <div className="review-stat">
                      <span className="review-stat-label">Trend</span>
                      <span className="review-stat-value">
                        {analysis.trend === 'improving' ? '📈' : '➡️'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {adjustments.recommendations.length > 0 && (
            <div className="recommendations">
              <h2>Automatic Adjustments</h2>
              <p className="recommendations-intro">
                Based on your performance, the following adjustments will be applied to your training:
              </p>
              {adjustments.recommendations.map((rec, idx) => (
                <div key={idx} className={`recommendation-card ${rec.type}`}>
                  <div className="recommendation-icon">
                    {rec.type === 'increase_difficulty' && '⬆️'}
                    {rec.type === 'add_remedial' && '🔄'}
                    {rec.type === 'maintain_focus' && '🎯'}
                    {rec.type === 'phase_change' && '🚀'}
                  </div>
                  <p>{rec.message}</p>
                </div>
              ))}
            </div>
          )}

          {adjustments.phase_adjustment && (
            <div className="phase-adjustment-banner">
              {adjustments.phase_adjustment === 'advance' ? (
                <div className="phase-advance">
                  <span className="phase-icon">🚀</span>
                  <div>
                    <strong>Ready to Advance!</strong>
                    <p>Your performance is excellent. Consider moving to the next phase early.</p>
                  </div>
                </div>
              ) : (
                <div className="phase-extend">
                  <span className="phase-icon">⏸️</span>
                  <div>
                    <strong>Building Foundation</strong>
                    <p>Extending current phase to strengthen fundamentals.</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </>
      ) : (
        <div className="no-data">
          <p>No performance data yet for Week {week - 1}.</p>
          <p>Complete some drills and check back!</p>
        </div>
      )}
    </div>
  )
}

export default WeeklyReview
