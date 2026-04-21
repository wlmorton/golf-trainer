import { useState, useEffect } from 'react'
import API_URL from '../config'

function Metrics() {
  const [week, setWeek] = useState(1)
  const [formData, setFormData] = useState({
    driver_avg_carry: '',
    driver_avg_offline: '',
    driver_speed: '',
    iron_7i_carry: '',
    iron_7i_offline: '',
    center_contact_pct: '',
    wedge_50_pct_carry: '',
    wedge_75_pct_carry: '',
    wedge_full_carry: '',
    putting_5ft_made: '',
    putting_5ft_total: '',
    putting_lag_rating: '',
    notes: ''
  })
  const [history, setHistory] = useState([])

  useEffect(() => {
    fetchCurrentWeek()
    fetchHistory()
  }, [])

  const fetchCurrentWeek = async () => {
    try {
      const res = await fetch(`${API_URL}/workouts/today`)
      const data = await res.json()
      setWeek(data.week)
    } catch (err) {
      console.error('Failed to fetch week:', err)
    }
  }

  const fetchHistory = async () => {
    try {
      const res = await fetch(`${API_URL}/metrics/history`)
      const data = await res.json()
      setHistory(data)
    } catch (err) {
      console.error('Failed to fetch history:', err)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await fetch(`${API_URL}/metrics/weekly`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          week_number: week,
          driver_avg_carry: formData.driver_avg_carry ? parseFloat(formData.driver_avg_carry) : null,
          driver_avg_offline: formData.driver_avg_offline ? parseFloat(formData.driver_avg_offline) : null,
          driver_speed: formData.driver_speed ? parseFloat(formData.driver_speed) : null,
          iron_7i_carry: formData.iron_7i_carry ? parseFloat(formData.iron_7i_carry) : null,
          iron_7i_offline: formData.iron_7i_offline ? parseFloat(formData.iron_7i_offline) : null,
          center_contact_pct: formData.center_contact_pct ? parseFloat(formData.center_contact_pct) : null,
          wedge_50_pct_carry: formData.wedge_50_pct_carry ? parseFloat(formData.wedge_50_pct_carry) : null,
          wedge_75_pct_carry: formData.wedge_75_pct_carry ? parseFloat(formData.wedge_75_pct_carry) : null,
          wedge_full_carry: formData.wedge_full_carry ? parseFloat(formData.wedge_full_carry) : null,
          putting_5ft_made: formData.putting_5ft_made ? parseInt(formData.putting_5ft_made) : null,
          putting_5ft_total: formData.putting_5ft_total ? parseInt(formData.putting_5ft_total) : null,
          putting_lag_rating: formData.putting_lag_rating ? parseInt(formData.putting_lag_rating) : null,
          notes: formData.notes || null
        })
      })
      setFormData({
        driver_avg_carry: '',
        driver_avg_offline: '',
        driver_speed: '',
        iron_7i_carry: '',
        iron_7i_offline: '',
        center_contact_pct: '',
        wedge_50_pct_carry: '',
        wedge_75_pct_carry: '',
        wedge_full_carry: '',
        putting_5ft_made: '',
        putting_5ft_total: '',
        putting_lag_rating: '',
        notes: ''
      })
      fetchHistory()
      alert('Metrics logged!')
    } catch (err) {
      console.error('Failed to log metrics:', err)
    }
  }

  return (
    <div className="page">
      <h1>Log Metrics</h1>
      <p className="subtitle">Week {week}</p>

      <form onSubmit={handleSubmit} className="metrics-form">
        <h3>🏌️ Driver</h3>
        <div className="form-group">
          <label>Avg Carry (yards)</label>
          <input
            type="number"
            step="0.1"
            value={formData.driver_avg_carry}
            onChange={(e) => setFormData({ ...formData, driver_avg_carry: e.target.value })}
            placeholder="e.g. 245"
          />
        </div>

        <div className="form-group">
          <label>Avg Offline (yards)</label>
          <input
            type="number"
            step="0.1"
            value={formData.driver_avg_offline}
            onChange={(e) => setFormData({ ...formData, driver_avg_offline: e.target.value })}
            placeholder="e.g. 18"
          />
        </div>

        <div className="form-group">
          <label>Speed (mph)</label>
          <input
            type="number"
            step="0.1"
            value={formData.driver_speed}
            onChange={(e) => setFormData({ ...formData, driver_speed: e.target.value })}
            placeholder="e.g. 105.5"
          />
        </div>

        <h3>⛳ Irons (7i)</h3>
        <div className="form-group">
          <label>7i Carry (yards)</label>
          <input
            type="number"
            step="0.1"
            value={formData.iron_7i_carry}
            onChange={(e) => setFormData({ ...formData, iron_7i_carry: e.target.value })}
            placeholder="e.g. 165"
          />
        </div>

        <div className="form-group">
          <label>7i Offline (yards)</label>
          <input
            type="number"
            step="0.1"
            value={formData.iron_7i_offline}
            onChange={(e) => setFormData({ ...formData, iron_7i_offline: e.target.value })}
            placeholder="e.g. 10"
          />
        </div>

        <div className="form-group">
          <label>Center Contact %</label>
          <input
            type="number"
            step="0.1"
            value={formData.center_contact_pct}
            onChange={(e) => setFormData({ ...formData, center_contact_pct: e.target.value })}
            placeholder="e.g. 75"
          />
        </div>

        <h3>🎯 Wedges</h3>
        <div className="form-group">
          <label>50% Swing Carry (yards)</label>
          <input
            type="number"
            step="0.1"
            value={formData.wedge_50_pct_carry}
            onChange={(e) => setFormData({ ...formData, wedge_50_pct_carry: e.target.value })}
            placeholder="e.g. 50"
          />
        </div>

        <div className="form-group">
          <label>75% Swing Carry (yards)</label>
          <input
            type="number"
            step="0.1"
            value={formData.wedge_75_pct_carry}
            onChange={(e) => setFormData({ ...formData, wedge_75_pct_carry: e.target.value })}
            placeholder="e.g. 75"
          />
        </div>

        <div className="form-group">
          <label>Full Swing Carry (yards)</label>
          <input
            type="number"
            step="0.1"
            value={formData.wedge_full_carry}
            onChange={(e) => setFormData({ ...formData, wedge_full_carry: e.target.value })}
            placeholder="e.g. 100"
          />
        </div>

        <h3>⛳ Putting</h3>
        <div className="form-group">
          <label>5 ft Putts Made</label>
          <input
            type="number"
            value={formData.putting_5ft_made}
            onChange={(e) => setFormData({ ...formData, putting_5ft_made: e.target.value })}
            placeholder="e.g. 42"
          />
        </div>

        <div className="form-group">
          <label>5 ft Putts Total</label>
          <input
            type="number"
            value={formData.putting_5ft_total}
            onChange={(e) => setFormData({ ...formData, putting_5ft_total: e.target.value })}
            placeholder="e.g. 50"
          />
        </div>

        <div className="form-group">
          <label>Lag Putting Rating (1-10)</label>
          <input
            type="number"
            min="1"
            max="10"
            value={formData.putting_lag_rating}
            onChange={(e) => setFormData({ ...formData, putting_lag_rating: e.target.value })}
            placeholder="e.g. 7"
          />
        </div>

        <div className="form-group">
          <label>Notes</label>
          <textarea
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            placeholder="What improved, what needs work, next focus..."
            rows="4"
          />
        </div>

        <button type="submit" className="btn-primary">Log Metrics</button>
      </form>

      {history.length > 0 && (
        <div className="history">
          <h2>Recent Logs</h2>
          {history.map((entry) => (
            <div key={entry.id} className="history-card">
              <div className="history-header">
                <strong>Week {entry.week_number}</strong>
                <span className="history-date">
                  {new Date(entry.logged_at).toLocaleDateString()}
                </span>
              </div>
              <div className="history-values">
                {entry.driver_avg_carry && <div>🏌️ Driver Carry: {entry.driver_avg_carry} yds</div>}
                {entry.driver_avg_offline && <div>🏌️ Driver Offline: {entry.driver_avg_offline} yds</div>}
                {entry.driver_speed && <div>🏌️ Speed: {entry.driver_speed} mph</div>}
                {entry.iron_7i_carry && <div>⛳ 7i Carry: {entry.iron_7i_carry} yds</div>}
                {entry.iron_7i_offline && <div>⛳ 7i Offline: {entry.iron_7i_offline} yds</div>}
                {entry.center_contact_pct && <div>⛳ Contact: {entry.center_contact_pct}%</div>}
                {entry.wedge_50_pct_carry && <div>🎯 Wedge 50%: {entry.wedge_50_pct_carry} yds</div>}
                {entry.wedge_75_pct_carry && <div>🎯 Wedge 75%: {entry.wedge_75_pct_carry} yds</div>}
                {entry.wedge_full_carry && <div>🎯 Wedge Full: {entry.wedge_full_carry} yds</div>}
                {entry.putting_5ft_made && entry.putting_5ft_total && (
                  <div>⛳ 5ft Putts: {entry.putting_5ft_made}/{entry.putting_5ft_total} ({Math.round(entry.putting_5ft_made/entry.putting_5ft_total*100)}%)</div>
                )}
                {entry.putting_lag_rating && <div>⛳ Lag Rating: {entry.putting_lag_rating}/10</div>}
                {entry.notes && <div className="notes">{entry.notes}</div>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Metrics
