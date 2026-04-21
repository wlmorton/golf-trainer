import { useState, useEffect } from 'react'
import API_URL from '../config'

function Handicap() {
  const [handicap, setHandicap] = useState('')
  const [notes, setNotes] = useState('')
  const [history, setHistory] = useState([])
  const [current, setCurrent] = useState(null)

  useEffect(() => {
    fetchHistory()
    fetchCurrent()
  }, [])

  const fetchHistory = async () => {
    try {
      const res = await fetch(`${API_URL}/metrics/handicap/history`)
      const data = await res.json()
      setHistory(data)
    } catch (err) {
      console.error('Failed to fetch history:', err)
    }
  }

  const fetchCurrent = async () => {
    try {
      const res = await fetch(`${API_URL}/metrics/handicap/current`)
      const data = await res.json()
      setCurrent(data)
    } catch (err) {
      console.error('Failed to fetch current:', err)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await fetch(`${API_URL}/metrics/handicap`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          handicap: parseFloat(handicap),
          notes: notes || null
        })
      })
      setHandicap('')
      setNotes('')
      fetchHistory()
      fetchCurrent()
      alert('Handicap logged!')
    } catch (err) {
      console.error('Failed to log handicap:', err)
    }
  }

  return (
    <div className="page">
      <h1>Handicap Tracker</h1>

      {current && (
        <div className="current-handicap">
          <div className="handicap-big">{current.handicap}</div>
          <div className="handicap-label">Current Handicap</div>
          <div className="handicap-date">
            Last updated: {new Date(current.logged_at).toLocaleDateString()}
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="handicap-form">
        <div className="form-group">
          <label>New Handicap</label>
          <input
            type="number"
            step="0.1"
            value={handicap}
            onChange={(e) => setHandicap(e.target.value)}
            placeholder="e.g. 12.5"
            required
          />
        </div>

        <div className="form-group">
          <label>Notes (optional)</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Any context..."
            rows="2"
          />
        </div>

        <button type="submit" className="btn-primary">Log Handicap</button>
      </form>

      {history.length > 0 && (
        <div className="history">
          <h2>History</h2>
          <div className="handicap-chart">
            {history.map((entry, idx) => {
              const prev = history[idx + 1]
              const change = prev ? (entry.handicap - prev.handicap).toFixed(1) : null
              return (
                <div key={entry.id} className="handicap-entry">
                  <div className="handicap-value">{entry.handicap}</div>
                  {change && (
                    <div className={`handicap-change ${change < 0 ? 'positive' : 'negative'}`}>
                      {change > 0 ? '+' : ''}{change}
                    </div>
                  )}
                  <div className="handicap-date">
                    {new Date(entry.logged_at).toLocaleDateString()}
                  </div>
                  {entry.notes && <div className="handicap-notes">{entry.notes}</div>}
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

export default Handicap
