import { HashRouter, Routes, Route } from 'react-router-dom'
import { DashboardProvider } from './store/DashboardContext'
import { LearnPrepProvider } from './store/LearnPrepContext'
import Dashboard from './pages/Dashboard'
import LearnPrep from './pages/LearnPrep'

export default function App() {
  return (
    <HashRouter>
      <DashboardProvider>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/learn-prep" element={
            <LearnPrepProvider>
              <LearnPrep />
            </LearnPrepProvider>
          } />
        </Routes>
      </DashboardProvider>
    </HashRouter>
  )
}
