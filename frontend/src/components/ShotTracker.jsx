import { useState } from 'react'

// Drill configurations with scoring rules
const DRILL_CONFIGS = {
  stack_system: {
    name: "Stack System",
    shots: 1,
    metric: "Speed Tracking",
    metricType: "stack_speed",
    scoring: () => 0,
    goal: "Track progress"
  },
  stack_short: {
    name: "Stack System",
    shots: 1,
    metric: "Speed Tracking",
    metricType: "stack_speed",
    scoring: () => 0,
    goal: "Track progress"
  },
  stack_maintenance: {
    name: "Stack System (Maintenance)",
    shots: 1,
    metric: "Speed Tracking",
    metricType: "stack_speed",
    scoring: () => 0,
    goal: "Track progress"
  },
  start_line_gate: {
    name: "Start Line Gate Drill",
    shots: 30,
    metric: "Through gate? (yes/no)",
    metricType: "boolean",
    scoring: (value) => value === 'yes' ? 1 : 0,
    goal: "Track success rate"
  },
  foot_spray: {
    name: "Foot Spray Contact Drill",
    shots: 20,
    metric: "Center contact? (yes/no)",
    metricType: "boolean",
    scoring: (value) => value === 'yes' ? 1 : 0,
    goal: "Track center contact %"
  },
  low_point_towel: {
    name: "Low Point Control (Towel Drill)",
    shots: 20,
    metric: "Missed towel? (yes/no)",
    metricType: "boolean",
    scoring: (value) => value === 'yes' ? 1 : 0,
    goal: "Don't hit towel"
  },
  face_awareness: {
    name: "Face Awareness Drill",
    shots: 20,
    metric: "Achieved shape? (yes/no)",
    metricType: "boolean",
    scoring: (value) => value === 'yes' ? 1 : 0,
    goal: "Control face angle"
  },
  random_club: {
    name: "Random Club Switching",
    shots: 15,
    metric: "Good contact? (yes/no)",
    metricType: "boolean",
    scoring: (value) => value === 'yes' ? 1 : 0,
    goal: "Adaptability"
  },
  gate_putting: {
    name: "Gate Putting Drill",
    shots: 50,
    metric: "Through gate? (yes/no)",
    metricType: "boolean",
    scoring: (value) => value === 'yes' ? 1 : 0,
    goal: "50 reps"
  },
  landing_spot: {
    name: "Landing Spot Drill",
    shots: 20,
    metric: "Hit towel? (yes/no)",
    metricType: "boolean",
    scoring: (value) => value === 'yes' ? 1 : 0,
    goal: "Precision"
  },
  pressure_putting: {
    name: "Pressure Putting",
    shots: 10,
    metric: "Made? (yes/no)",
    metricType: "boolean",
    scoring: (value) => value === 'yes' ? 1 : 0,
    goal: "Make 10 in a row"
  },
  shot_shaping_ladder: {
    name: "Shot Shaping Ladder",
    shots: 15,
    metric: "Achieved shape? (yes/no)",
    metricType: "boolean",
    scoring: (value) => value === 'yes' ? 1 : 0,
    goal: "5 fades, 5 draws, 5 straight"
  },
  distance_control_ladder: {
    name: "Distance Control Ladder",
    shots: 9,
    metric: "Carry distance (yards)",
    metricType: "numeric",
    scoring: () => 1,
    goal: "Track distances"
  },
  strike_start_combo: {
    name: "Strike + Start Combo",
    shots: 15,
    metric: "Both good? (yes/no)",
    metricType: "boolean",
    scoring: (value) => value === 'yes' ? 1 : 0,
    goal: "Center + line"
  },
  putting_ladder: {
    name: "Putting Ladder Drill",
    shots: 3,
    metric: "Made? (yes/no)",
    metricType: "boolean",
    scoring: (value) => value === 'yes' ? 1 : 0,
    goal: "Make all 3 distances"
  },
  one_ball_routine: {
    name: "One-Ball Routine",
    shots: 10,
    metric: "Good shot? (yes/no)",
    metricType: "boolean",
    scoring: (value) => value === 'yes' ? 1 : 0,
    goal: "Full routine"
  },
  wedge_matrix: {
    name: "Wedge Matrix",
    shots: 9,
    metric: "Carry distance (yards)",
    metricType: "numeric",
    scoring: () => 1,
    goal: "Build distance matrix"
  },
  up_and_down: {
    name: "Up-and-Down Game",
    shots: 10,
    metric: "Up & down? (yes/no)",
    metricType: "boolean",
    scoring: (value) => value === 'yes' ? 1 : 0,
    goal: "Track success %"
  },
  pressure_putting_upgrade: {
    name: "Pressure Putting Upgrade",
    shots: 25,
    metric: "Made? (yes/no)",
    metricType: "boolean",
    scoring: (value) => value === 'yes' ? 1 : 0,
    goal: "Make 25 from 5ft"
  },
  pressure_putting_final: {
    name: "Pressure Putting",
    shots: 25,
    metric: "Made? (yes/no)",
    metricType: "boolean",
    scoring: (value) => value === 'yes' ? 1 : 0,
    goal: "Make 25 from 5ft"
  },
  course_sim_drives: {
    name: "Course Simulation Drives",
    shots: 10,
    metric: "Good drive? (yes/no)",
    metricType: "boolean",
    scoring: (value) => value === 'yes' ? 1 : 0,
    goal: "Simulate real holes"
  },
  play_practice_full: {
    name: "Play Practice Sequence",
    shots: 9,
    metric: "Good shot? (yes/no)",
    metricType: "boolean",
    scoring: (value) => value === 'yes' ? 1 : 0,
    goal: "Simulate play"
  },
  par_18_weekly: {
    name: "Par 18 Weekly Challenge",
    shots: 9,
    metric: "Strokes (chip+putt)",
    metricType: "numeric",
    scoring: (value) => value <= 2 ? 1 : 0,
    goal: "≤18 total"
  },
  driver_dispersion_game: {
    name: "Driver Dispersion Game",
    shots: 20,
    metric: "Offline (yards)",
    metricType: "directional",
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
    metricType: "directional",
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
    metricType: "boolean",
    scoring: (value) => value === 'yes' ? 1 : 0,
    goal: 5
  },
  lag_putting_game: {
    name: "Lag Putting Game",
    shots: 10,
    metric: "Distance from hole (ft)",
    metricType: "numeric",
    scoring: (value) => value <= 3 ? 1 : 0,
    goal: "50%"
  },
  up_down_simulation: {
    name: "Up & Down Simulation",
    shots: 10,
    metric: "Up & down? (yes/no)",
    metricType: "boolean",
    scoring: (value) => value === 'yes' ? 1 : 0,
    goal: "50%"
  },
  driver_combine: {
    name: "Driver Combine Test",
    shots: 10,
    metric: "Fairway hit? (yes/no)",
    metricType: "boolean",
    scoring: (value) => value === 'yes' ? 1 : 0,
    goal: "Track score"
  },
  iron_combine: {
    name: "Iron Combine",
    shots: 10,
    metric: "On target line? (yes/no)",
    metricType: "boolean",
    scoring: (value) => value === 'yes' ? 1 : 0,
    goal: "Track score"
  },
  "3_6_9_putting": {
    name: "3-6-9 Putting Game",
    shots: 3,
    metric: "Made? (yes/no)",
    metricType: "boolean",
    scoring: (value) => value === 'yes' ? 1 : 0,
    goal: "Complete all"
  },
  wedge_combine: {
    name: "Wedge Combine",
    shots: 10,
    metric: "Distance from hole (ft)",
    metricType: "numeric",
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
    metricType: "numeric",
    scoring: (value) => value <= 2 ? 1 : 0,
    goal: "≤18 total"
  },
  full_combine: {
    name: "Full Combine Session",
    shots: 9,
    metric: "Score (par=4)",
    metricType: "numeric",
    scoring: (value) => Math.max(0, 4 - value),
    goal: "Track score"
  }
}

function ShotTracker({ drillId, onComplete, onCancel }) {
  const config = DRILL_CONFIGS[drillId]
  const [shots, setShots] = useState([])
  const [currentInput, setCurrentInput] = useState('')
  const [direction, setDirection] = useState('straight') // left, right, straight
  
  // Stack system specific state
  const [stackData, setStackData] = useState({
    avg195g: '',
    top195g: '',
    notes: ''
  })

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
    // Handle Stack System separately
    if (config.metricType === 'stack_speed') {
      const shotData = {
        type: 'stack_speed',
        avg195g: parseFloat(stackData.avg195g) || 0,
        top195g: parseFloat(stackData.top195g) || 0,
        notes: stackData.notes,
        config: {
          name: config.name,
          metric: config.metric,
          goal: config.goal
        }
      }
      const scoreDisplay = `Avg: ${stackData.avg195g} mph, Top: ${stackData.top195g} mph`
      onComplete(scoreDisplay, shotData)
      return
    }

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
  const isStackComplete = config.metricType === 'stack_speed' && stackData.avg195g && stackData.top195g

  // Stack System UI
  if (config.metricType === 'stack_speed') {
    return (
      <div className="shot-tracker">
        <h3>{config.name}</h3>
        <div className="tracker-info">
          <span className="metric-label">Record your swing speeds from today's Stack session</span>
        </div>

        <div className="stack-input-section">
          <div className="input-group">
            <label>Average Speed (195g max swings)</label>
            <input
              type="number"
              step="0.1"
              value={stackData.avg195g}
              onChange={(e) => setStackData({...stackData, avg195g: e.target.value})}
              placeholder="e.g., 112.5"
              className="shot-input"
            />
            <span className="input-unit">mph</span>
          </div>

          <div className="input-group">
            <label>Top Speed (195g max swings)</label>
            <input
              type="number"
              step="0.1"
              value={stackData.top195g}
              onChange={(e) => setStackData({...stackData, top195g: e.target.value})}
              placeholder="e.g., 115.2"
              className="shot-input"
            />
            <span className="input-unit">mph</span>
          </div>

          <div className="input-group">
            <label>Notes (optional)</label>
            <textarea
              value={stackData.notes}
              onChange={(e) => setStackData({...stackData, notes: e.target.value})}
              placeholder="How did the session feel?"
              className="shot-input"
              rows="3"
            />
          </div>
        </div>

        <div className="tracker-actions">
          <button onClick={onCancel} className="btn-secondary">
            Cancel
          </button>
          <button 
            onClick={handleComplete} 
            className="btn-primary"
            disabled={!isStackComplete}
          >
            Complete Session
          </button>
        </div>
      </div>
    )
  }

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
