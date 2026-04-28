import { useState } from 'react'

// Drill configurations with scoring rules
const DRILL_CONFIGS = {
  driver_dispersion_game: {
    name: "Driver Dispersion Game",
    shots: 20,
    metric: "Offline (yards)",
    metricType: "directional", // left/right tracking
    scoring: (value) => {
      const distance = Math.abs(parseFloat(value))
      if (distance < 25) return 2
      if (distance <= 40) return 1
      return 0
    },
    goal: 25
  },
  fairway_finder: {
    name: "Fairway Finder Challenge",
    shots: 10,
    metric: "Through gate? (yes/no)",
    metricType: "boolean",
    scoring: (value) => value === 'yes' ? 1 : 0,
    goal: 7
  },
  "7iron_dispersion_game": {
    name: "7 Iron Dispersion Game",
    shots: 15,
    metric: "Offline (yards)",
    metricType: "directional", // left/right tracking
    scoring: (value) => {
      const distance = Math.abs(parseFloat(value))
      if (distance <= 10) return 2
      if (distance <= 20) return 1
      return 0
    },
    goal: 20
  },
  strike_ladder: {
    name: "Strike Ladder",
    shots: 5,
    metric: "Center strike? (yes/no)",
    scoring: (value) => value === 'yes' ? 1 : 0,
    goal: 5
  },
  lag_putting_game: {
    name: "Lag Putting Game",
    shots: 10,
    metric: "Distance from hole (ft)",
    scoring: (value) => value <= 3 ? 1 : 0,
    goal: "50%"
  },
  up_down_simulation: {
    name: "Up & Down Simulation",
    shots: 10,
    metric: "Up & down? (yes/no)",
    scoring: (value) => value === 'yes' ? 1 : 0,
    goal: "50%"
  },
  driver_combine: {
    name: "Driver Combine Test",
    shots: 10,
    metric: "Fairway hit? (yes/no)",
    scoring: (value) => value === 'yes' ? 1 : 0,
    goal: "Track score"
  },
  iron_combine: {
    name: "Iron Combine",
    shots: 10,
    metric: "On target line? (yes/no)",
    scoring: (value) => value === 'yes' ? 1 : 0,
    goal: "Track score"
  },
  "3_6_9_putting": {
    name: "3-6-9 Putting Game",
    shots: 3,
    metric: "Made? (yes/no)",
    scoring: (value) => value === 'yes' ? 1 : 0,
    goal: "Complete all"
  },
  wedge_combine: {
    name: "Wedge Combine",
    shots: 10,
    metric: "Distance from hole (ft)",
    scoring: (value) => {
      if (value <= 10) return 2
      if (value <= 20) return 1
      return 0
    },
    goal: "Track score"
  },
  par_18_game: {
    name: "Par 18 Game",
    shots: 9,
    metric: "Strokes (chip+putt)",
    scoring: (value) => value <= 2 ? 1 : 0,
    goal: "≤18 total"
  },
  full_combine: {
    name: "Full Combine Session",
    shots: 9,
    metric: "Score (par=4)",
    scoring: (value) => Math.max(0, 4 - value),
    goal: "Track score"
  }
}

function ShotTracker({ drillId, onComplete, onCancel }) {
  const config = DRILL_CONFIGS[drillId]
  const [shots, setShots] = useState([])
  const [currentInput, setCurrentInput] = useState('')
  const [direction, setDirection] = useState('straight') // left, right, straight

  if (!config) {
    return (
      <div>
        <p>This drill doesn't have shot tracking configured yet.</p>
        <button onClick={onCancel} className="btn-secondary">Back</button>
      </div>
    )
  }

  const addShot = () => {
    if (!currentInput) return
    
    let value = currentInput.toLowerCase()
    
    // Handle directional input
    if (config.metricType === 'directional') {
      const numValue = parseFloat(value)
      if (!isNaN(numValue)) {
        // Store as signed number: negative = left, positive = right
        const signedValue = direction === 'left' ? -Math.abs(numValue) : 
                           direction === 'right' ? Math.abs(numValue) : 0
        setShots([...shots, signedValue])
        setCurrentInput('')
        setDirection('straight')
        return
      }
    }
    
    // Handle boolean input
    if (value === 'yes' || value === 'y') value = 'yes'
    if (value === 'no' || value === 'n') value = 'no'
    
    // Try to parse as number
    const numValue = parseFloat(value)
    if (!isNaN(numValue)) {
      value = numValue
    }

    setShots([...shots, value])
    setCurrentInput('')
  }

  const removeLastShot = () => {
    setShots(shots.slice(0, -1))
  }

  const calculateStats = () => {
    if (shots.length === 0) return null

    const scores = shots.map(shot => config.scoring(shot))
    const totalScore = scores.reduce((a, b) => a + b, 0)
    
    // Calculate numeric stats if applicable
    const numericShots = shots.filter(s => typeof s === 'number')
    let avg = null
    let best = null
    let worst = null
    let leftCount = 0
    let rightCount = 0
    let straightCount = 0
    
    if (numericShots.length > 0) {
      // For directional metrics, calculate absolute values for avg/best/worst
      if (config.metricType === 'directional') {
        const absValues = numericShots.map(s => Math.abs(s))
        avg = (absValues.reduce((a, b) => a + b, 0) / absValues.length).toFixed(1)
        best = Math.min(...absValues)
        worst = Math.max(...absValues)
        
        // Count directions
        numericShots.forEach(shot => {
          if (shot < -0.5) leftCount++
          else if (shot > 0.5) rightCount++
          else straightCount++
        })
      } else {
        avg = (numericShots.reduce((a, b) => a + b, 0) / numericShots.length).toFixed(1)
        best = Math.min(...numericShots)
        worst = Math.max(...numericShots)
      }
    }

    return { 
      totalScore, 
      avg, 
      best, 
      worst, 
      count: shots.length,
      leftCount,
      rightCount,
      straightCount
    }
  }

  const handleComplete = () => {
    const stats = calculateStats()
    if (!stats) return

    const shotData = {
      shots: shots,
      stats: stats,
      config: {
        name: config.name,
        metric: config.metric,
        goal: config.goal
      }
    }

    onComplete(stats.totalScore, shotData)
  }

  const stats = calculateStats()
  const isComplete = shots.length >= config.shots

  return (
    <div className="shot-tracker">
      <h3>{config.name}</h3>
      <div className="tracker-info">
        <span>Shot {shots.length + 1} of {config.shots}</span>
        <span className="metric-label">{config.metric}</span>
      </div>

      <div className="shot-input-section">
        {config.metricType === 'directional' ? (
          <>
            <div className="direction-buttons">
              <button 
                onClick={() => setDirection('left')} 
                className={`direction-btn ${direction === 'left' ? 'active' : ''}`}
              >
                ← Left
              </button>
              <button 
                onClick={() => setDirection('straight')} 
                className={`direction-btn ${direction === 'straight' ? 'active' : ''}`}
              >
                Straight
              </button>
              <button 
                onClick={() => setDirection('right')} 
                className={`direction-btn ${direction === 'right' ? 'active' : ''}`}
              >
                Right →
              </button>
            </div>
            <div className="directional-input-group">
              <input
                type="number"
                step="0.5"
                value={currentInput}
                onChange={(e) => setCurrentInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addShot()}
                placeholder="Distance (yards)"
                autoFocus
                className="shot-input"
              />
              <button onClick={addShot} className="btn-primary" disabled={!currentInput}>
                Add Shot
              </button>
            </div>
          </>
        ) : (
          <>
            <input
              type="text"
              value={currentInput}
              onChange={(e) => setCurrentInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addShot()}
              placeholder={config.metric.includes('yes/no') ? 'yes or no' : 'Enter value'}
              autoFocus
              className="shot-input"
            />
            <button onClick={addShot} className="btn-primary" disabled={!currentInput}>
              Add Shot
            </button>
          </>
        )}
      </div>

      {shots.length > 0 && (
        <div className="shots-list">
          <div className="shots-header">
            <span>Shot #</span>
            <span>Result</span>
            <span>Points</span>
          </div>
          {shots.map((shot, idx) => {
            const displayValue = typeof shot === 'number' && config.metricType === 'directional'
              ? `${Math.abs(shot).toFixed(1)} ${shot < -0.5 ? '←' : shot > 0.5 ? '→' : '•'}`
              : typeof shot === 'number' 
                ? shot.toFixed(1) 
                : shot
            
            return (
              <div key={idx} className="shot-row">
                <span>{idx + 1}</span>
                <span>{displayValue}</span>
                <span className="shot-points">{config.scoring(shot)}</span>
              </div>
            )
          })}
          <button onClick={removeLastShot} className="btn-remove">
            Remove Last
          </button>
        </div>
      )}

      {stats && (
        <div className="tracker-stats">
          <div className="stat-box">
            <span className="stat-label">Total Score</span>
            <span className="stat-value">{stats.totalScore}</span>
          </div>
          {stats.avg && (
            <>
              <div className="stat-box">
                <span className="stat-label">Average</span>
                <span className="stat-value">{stats.avg}</span>
              </div>
              <div className="stat-box">
                <span className="stat-label">Best</span>
                <span className="stat-value">{stats.best}</span>
              </div>
              <div className="stat-box">
                <span className="stat-label">Worst</span>
                <span className="stat-value">{stats.worst}</span>
              </div>
            </>
          )}
          {config.metricType === 'directional' && stats.leftCount + stats.rightCount > 0 && (
            <>
              <div className="stat-box miss-pattern">
                <span className="stat-label">Miss Pattern</span>
                <div className="pattern-visual">
                  <div className="pattern-bar">
                    <span className="pattern-left" style={{width: `${(stats.leftCount / shots.length) * 100}%`}}>
                      ← {stats.leftCount}
                    </span>
                    <span className="pattern-straight">
                      {stats.straightCount}
                    </span>
                    <span className="pattern-right" style={{width: `${(stats.rightCount / shots.length) * 100}%`}}>
                      {stats.rightCount} →
                    </span>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      )}

      <div className="tracker-actions">
        <button onClick={onCancel} className="btn-secondary">
          Cancel
        </button>
        <button 
          onClick={handleComplete} 
          className="btn-primary"
          disabled={!isComplete}
        >
          {isComplete ? 'Complete Drill' : `${config.shots - shots.length} shots remaining`}
        </button>
      </div>
    </div>
  )
}

export default ShotTracker
