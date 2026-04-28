import { useState, useEffect } from 'react'
import API_URL from '../config'

function Debug() {
  const [completions, setCompletions] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCompletions()
  }, [])

  const fetchCompletions = async () => {
    try {
      const res = await fetch(`${API_URL}/workouts/debug/all-completions`)
      const data = await res.json()
      setCompletions(data)
    } catch (err) {
      console.error('Failed to fetch completions:', err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div className="loading">Loading...</div>

  return (
    <div className="page">
      <h1>Debug: All Drill Completions</h1>
      <p>Total completions: {completions.length}</p>

      {completions.length === 0 ? (
        <div className="no-data">
          <p>No drill completions found in database.</p>
          <p>Complete some drills and refresh this page.</p>
        </div>
      ) : (
        <div className="debug-list">
          {completions.map((completion) => (
            <div key={completion.id} className="debug-card">
              <div className="debug-header">
                <strong>Week {completion.week}, Day {completion.day}</strong>
                <span className="debug-date">
                  {new Date(completion.completed_at).toLocaleString()}
                </span>
              </div>
              <div className="debug-content">
                <div><strong>Drill ID:</strong> {completion.drill_id}</div>
                <div><strong>Score:</strong> {completion.score || 'None'}</div>
                {completion.shot_data && (
                  <div>
                    <strong>Shot Data:</strong>
                    <pre>{JSON.stringify(JSON.parse(completion.shot_data), null, 2)}</pre>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <button onClick={fetchCompletions} className="btn-primary" style={{marginTop: '20px'}}>
        Refresh
      </button>
    </div>
  )
}

export default Debug
