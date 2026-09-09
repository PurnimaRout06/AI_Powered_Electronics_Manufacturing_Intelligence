import { useEffect, useState } from 'react'
import { Check } from 'lucide-react'
import DashboardLayout from '../components/layout/DashboardLayout'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import { LoadingSkeleton, ErrorState } from '../components/ui/States'
import { preferencesService } from '../services/preferencesService'

const THEME_OPTIONS = [
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' }
]
const RANGE_OPTIONS = [
  { value: 'today', label: 'Today' },
  { value: '7d', label: 'Last 7 Days' },
  { value: '30d', label: 'Last 30 Days' }
]
const UNIT_OPTIONS = [
  { value: 'celsius', label: 'Celsius (°C)' },
  { value: 'fahrenheit', label: 'Fahrenheit (°F)' }
]
const LANDING_OPTIONS = [
  { value: 'overview', label: 'Overview' },
  { value: 'equipment', label: 'Equipment' },
  { value: 'production', label: 'Production' },
  { value: 'ai-insights', label: 'AI Insights' }
]

function SegmentedControl({ options, value, onChange }) {
  return (
    <div className="inline-flex rounded-lg border border-surface-border bg-surface-bg p-1">
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          onClick={() => onChange(opt.value)}
          className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
            value === opt.value ? 'bg-white text-primary shadow-card font-medium' : 'text-ink-muted hover:text-ink'
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  )
}

function Toggle({ checked, onChange }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`relative h-6 w-11 rounded-full transition-colors ${checked ? 'bg-primary' : 'bg-slate-200'}`}
    >
      <span
        className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
          checked ? 'translate-x-[22px]' : 'translate-x-0.5'
        }`}
      />
    </button>
  )
}

function Row({ label, description, children }) {
  return (
    <div className="flex items-center justify-between py-4 border-b border-surface-border last:border-0">
      <div>
        <p className="text-sm font-medium text-ink">{label}</p>
        {description && <p className="text-xs text-ink-muted mt-0.5">{description}</p>}
      </div>
      {children}
    </div>
  )
}

export default function Preferences() {
  const [prefs, setPrefs] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    preferencesService
      .get()
      .then(setPrefs)
      .catch(setError)
      .finally(() => setLoading(false))
  }, [])

  function update(key, value) {
    setPrefs((p) => ({ ...p, [key]: value }))
    setSaved(false)
  }

  async function handleSave() {
    setSaving(true)
    setSaved(false)
    try {
      await preferencesService.update(prefs)
      setSaved(true)
    } catch (err) {
      setError(err)
    } finally {
      setSaving(false)
    }
  }

  return (
    <DashboardLayout title="Preferences" breadcrumb="Manufacturing / Preferences">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-ink">Preferences</h2>
        <p className="text-sm text-ink-muted mt-1">Personalize how the dashboard looks and behaves for your account.</p>
      </div>

      <Card className="max-w-2xl">
        {loading && <LoadingSkeleton rows={4} />}
        {error && <ErrorState onRetry={() => window.location.reload()} />}

        {prefs && (
          <>
            <Row label="Theme" description="Choose a light or dark interface.">
              <SegmentedControl options={THEME_OPTIONS} value={prefs.theme} onChange={(v) => update('theme', v)} />
            </Row>

            <Row label="Default date range" description="Applied to the Overview dashboard on load.">
              <SegmentedControl
                options={RANGE_OPTIONS}
                value={prefs.defaultDateRange}
                onChange={(v) => update('defaultDateRange', v)}
              />
            </Row>

            <Row label="Temperature unit" description="Used across equipment temperature readings.">
              <SegmentedControl
                options={UNIT_OPTIONS}
                value={prefs.temperatureUnit}
                onChange={(v) => update('temperatureUnit', v)}
              />
            </Row>

            <Row label="Default landing page" description="The page you see right after signing in.">
              <select
                value={prefs.defaultLandingPage}
                onChange={(e) => update('defaultLandingPage', e.target.value)}
                className="h-9 rounded-lg border border-surface-border bg-white px-3 text-sm outline-none focus:border-primary"
              >
                {LANDING_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </Row>

            <Row label="Email notifications" description="Receive email alerts for critical equipment and quality events.">
              <Toggle checked={prefs.emailNotifications} onChange={(v) => update('emailNotifications', v)} />
            </Row>

            <div className="flex items-center gap-3 pt-5">
              <Button onClick={handleSave} disabled={saving}>
                {saving ? 'Saving...' : 'Save preferences'}
              </Button>
              {saved && (
                <span className="flex items-center gap-1.5 text-sm text-status-success">
                  <Check size={15} />
                  Saved
                </span>
              )}
            </div>
          </>
        )}
      </Card>
    </DashboardLayout>
  )
}
