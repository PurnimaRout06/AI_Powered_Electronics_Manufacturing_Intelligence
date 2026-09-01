import { Routes, Route } from 'react-router-dom'
import Overview from './pages/Overview'
import Equipment from './pages/Equipment'
import EquipmentDetails from './pages/EquipmentDetails'
import Production from './pages/Production'
import Quality from './pages/Quality'
import Maintenance from './pages/Maintenance'
import AIInsights from './pages/AIInsights'
import PlaceholderPage from './pages/PlaceholderPage'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Overview />} />
      <Route path="/equipment" element={<Equipment />} />
      <Route path="/equipment/:id" element={<EquipmentDetails />} />
      <Route path="/production" element={<Production />} />
      <Route path="/quality" element={<Quality />} />
      <Route path="/maintenance" element={<Maintenance />} />
      <Route path="/ai-insights" element={<AIInsights />} />

      <Route
        path="/analytics/production"
        element={
          <PlaceholderPage
            title="Production Analytics"
            breadcrumb="Analytics / Production"
            description="Deeper production analytics, ready for a Grafana dashboard embed."
            showGrafana
          />
        }
      />
      <Route
        path="/analytics/equipment"
        element={
          <PlaceholderPage
            title="Equipment Analytics"
            breadcrumb="Analytics / Equipment"
            description="Fleet-wide equipment analytics, ready for a Grafana dashboard embed."
            showGrafana
          />
        }
      />
      <Route
        path="/analytics/quality"
        element={
          <PlaceholderPage
            title="Quality Analytics"
            breadcrumb="Analytics / Quality"
            description="Deeper quality analytics, ready for a Grafana dashboard embed."
            showGrafana
          />
        }
      />
      <Route
        path="/analytics/downtime"
        element={
          <PlaceholderPage
            title="Downtime Analytics"
            breadcrumb="Analytics / Downtime"
            description="Deeper downtime analytics, ready for a Grafana dashboard embed."
            showGrafana
          />
        }
      />

      <Route
        path="/settings"
        element={<PlaceholderPage title="Settings" breadcrumb="Manufacturing / Settings" description="Application and account settings." />}
      />
      <Route
        path="/help"
        element={<PlaceholderPage title="Help" breadcrumb="Manufacturing / Help" description="Documentation and support resources." />}
      />

      <Route
        path="*"
        element={<PlaceholderPage title="Page not found" breadcrumb="Manufacturing" description="That page doesn't exist yet." />}
      />
    </Routes>
  )
}
