import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import TodayWorkout from './pages/TodayWorkout'
import Progress from './pages/Progress'
import Metrics from './pages/Metrics'
import Handicap from './pages/Handicap'

function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <nav className="nav">
          <Link to="/" className="nav-link">Today</Link>
          <Link to="/progress" className="nav-link">Progress</Link>
          <Link to="/metrics" className="nav-link">Metrics</Link>
          <Link to="/handicap" className="nav-link">Handicap</Link>
        </nav>
        
        <main className="main">
          <Routes>
            <Route path="/" element={<TodayWorkout />} />
            <Route path="/progress" element={<Progress />} />
            <Route path="/metrics" element={<Metrics />} />
            <Route path="/handicap" element={<Handicap />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}

export default App
