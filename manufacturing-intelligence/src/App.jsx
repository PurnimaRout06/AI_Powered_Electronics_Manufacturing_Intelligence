import { Routes, Route, Navigate } from 'react-router-dom'
import Overview from './pages/Overview'
import Equipment from './pages/Equipment'
import EquipmentDetails from './pages/EquipmentDetails'
import Production from './pages/Production'
import Quality from './pages/Quality'
import Maintenance from './pages/Maintenance'
import AIInsights from './pages/AIInsights'
import Preferences from './pages/Preferences'
import Login from './pages/Login'
import Register from './pages/Register'
import PlaceholderPage from './pages/PlaceholderPage'
import ProtectedRoute from './components/auth/ProtectedRoute'
import { grafanaDashboards } from './config/grafanaDashboards'

export default function App() {
  return (
    <Routes>
      {/* Public routes — no auth required */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Everything else requires a logged-in session */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Overview />
          </ProtectedRoute>
        }
      />
      <Route
        path="/equipment"
        element={
          <ProtectedRoute>
            <Equipment />
          </ProtectedRoute>
        }
      />
      <Route
        path="/equipment/:id"
        element={
          <ProtectedRoute>
            <EquipmentDetails />
          </ProtectedRoute>
        }
      />
      <Route
        path="/production"
        element={
          <ProtectedRoute>
            <Production />
          </ProtectedRoute>
        }
      />
      <Route
        path="/quality"
        element={
          <ProtectedRoute>
            <Quality />
          </ProtectedRoute>
        }
      />
      <Route
        path="/maintenance"
        element={
          <ProtectedRoute>
            <Maintenance />
          </ProtectedRoute>
        }
      />
      <Route
        path="/ai-insights"
        element={
          <ProtectedRoute>
            <AIInsights />
          </ProtectedRoute>
        }
      />
      <Route
        path="/preferences"
        element={
          <ProtectedRoute>
            <Preferences />
          </ProtectedRoute>
        }
      />

      <Route
        path="/analytics/production"
        element={
          <ProtectedRoute>
            <PlaceholderPage
              title="Production Analytics"
              breadcrumb="Analytics / Production"
              description="Deeper production analytics from the live Grafana dashboard."
              dashboards={[grafanaDashboards.production]}
            />
          </ProtectedRoute>
        }
      />
      <Route
        path="/analytics/equipment"
        element={
          <ProtectedRoute>
            <PlaceholderPage
              title="Equipment Analytics"
              breadcrumb="Analytics / Equipment"
              description="Fleet-wide machine status and sensor trends from Grafana."
              dashboards={[grafanaDashboards.machineStatus, grafanaDashboards.sensorsTrend]}
            />
          </ProtectedRoute>
        }
      />
      <Route
        path="/analytics/quality"
        element={
          <ProtectedRoute>
            <PlaceholderPage
              title="Quality Analytics"
              breadcrumb="Analytics / Quality"
              description="Deeper quality analytics from the live Grafana dashboard."
              dashboards={[grafanaDashboards.quality]}
            />
          </ProtectedRoute>
        }
      />
      <Route
        path="/analytics/downtime"
        element={
          <ProtectedRoute>
            <PlaceholderPage
              title="Downtime Analytics"
              breadcrumb="Analytics / Downtime"
              description="Downtime trends over the past 90 days from Grafana."
              dashboards={[grafanaDashboards.downtime90d]}
            />
          </ProtectedRoute>
        }
      />

      {/* Settings now lives at /preferences — keep the old sidebar link working */}
      <Route path="/settings" element={<Navigate to="/preferences" replace />} />

      <Route
        path="/help"
        element={
          <ProtectedRoute>
            <PlaceholderPage title="Help" breadcrumb="Manufacturing / Help" description="Documentation and support resources." />
          </ProtectedRoute>
        }
      />

      <Route
        path="*"
        element={
          <ProtectedRoute>
            <PlaceholderPage title="Page not found" breadcrumb="Manufacturing" description="That page doesn't exist yet." />
          </ProtectedRoute>
        }
      />
    </Routes>
  )
}
