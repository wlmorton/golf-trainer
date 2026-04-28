import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import TodayWorkout from './pages/TodayWorkout'
import Progress from './pages/Progress'
import Metrics from './pages/Metrics'
import Handicap from './pages/Handicap'
import WeeklyReview from './pages/WeeklyReview'
import Settings from './pages/Settings'
import Debug from './pages/Debug'

function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <nav className="nav">
          <Link to="/" className="nav-link">Today</Link>
          <Link to="/review" className="nav-link">Review</Link>
          <Link to="/progress" className="nav-link">Progress</Link>
          <Link to="/settings" className="nav-link">⚙️</Link>
        </nav>
        
        <main className="main">
          <Routes>
            <Route path="/" element={<TodayWorkout />} />
            <Route path="/review" element={<WeeklyReview />} />
            <Route path="/progress" element={<Progress />} />
            <Route path="/metrics" element={<Metrics />} />
            <Route path="/handicap" element={<Handicap />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/debug" element={<Debug />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}

export default App
