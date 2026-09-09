# Manufacturing Intelligence — Frontend

A React + Vite frontend for a manufacturing analytics platform. This is the
UI layer only — it's built to plug into a Node.js/Express API, a shared SQL
database, an ML module, Grafana, and an AI/LLM layer without any
architectural changes.

## Stack

- React 18 + Vite
- React Router (client-side routing)
- Tailwind CSS
- Recharts (charts)
- lucide-react (icons)

## Getting started

```bash
npm install
cp .env.example .env
npm run dev
```

The app runs on `http://localhost:5173` by default.

## Architecture

```
React (this project)
   ↓
Node.js + Express        ← not built yet
   ↓
Shared SQL Database
   ↓
ML Module
   ↓
AI / LLM Layer
```

### Services layer (`src/services/`)

No component talks to `fetch` directly. Every domain area has its own
service file (`equipmentService.js`, `productionService.js`,
`qualityService.js`, `maintenanceService.js`, `aiService.js`,
`manufacturingService.js`), and every service routes through
`src/services/api.js`.

Right now `VITE_USE_MOCKS=true` (see `.env.example`), so every service
function resolves data from `src/data/mockData.js` instead of hitting the
network. Each mock resolution goes through the same async, delayed contract
a real HTTP call would use, so components never had to be written
differently for mock vs. live data.

**To connect the real backend:**
1. Implement the Express endpoints referenced in each service file's
   `else` branch (e.g. `GET /equipment`, `POST /ai/ask`).
2. Set `VITE_USE_MOCKS=false` and point `VITE_API_BASE_URL` at your API.
3. No component code needs to change.

### AI Insights (`src/services/aiService.js`)

The `AI Insights` page and the `AI Equipment Insight` panel on the
equipment detail page both go through `aiService.askQuestion()` /
`aiService.getInsights()`. Today these return canned responses. Point
`askQuestion` at `POST /ai/ask` (or stream from it) once the LLM layer is
live — the response shape (`{ title, summary, sections }`) is already what
`ChatMessage` renders.

### Grafana (`src/components/dashboard/GrafanaPanel.jsx`)

A placeholder component used on the Production, and Analytics sub-pages.
Pass a `src` prop with a dashboard URL and it renders an iframe instead of
the placeholder card — nothing else changes.

## Project structure

```
src/
├── components/
│   ├── layout/       Sidebar, Header, DashboardLayout
│   ├── ui/            Button, Card, Badge, Modal, Dropdown, loading/error/empty states
│   ├── dashboard/     KPICard, TrendCard, AIInsightCard, StatusOverview, GrafanaPanel
│   ├── charts/        ProductionChart, QualityChart, DowntimeChart, EquipmentChart
│   ├── equipment/     EquipmentTable, EquipmentCard, EquipmentStatus
│   └── ai/            ChatWindow, ChatMessage, SuggestedQuestions
├── pages/             Overview, Equipment, EquipmentDetails, Production,
│                      Quality, Maintenance, AIInsights, PlaceholderPage
├── services/          api.js + one service per domain
├── data/              mockData.js
├── hooks/             useAsync.js
└── App.jsx            Routes
```

## Routes

```
/                     Overview
/equipment            Equipment list (table/grid, search, filter, sort)
/equipment/:id        Equipment detail (charts, maintenance history, AI insight)
/production           Production analytics
/quality              Quality analytics
/maintenance          Maintenance / downtime
/ai-insights          AI chat + insight cards
/analytics/*           Placeholder pages wired for Grafana embeds
/settings, /help       Placeholders
```

## Notes

- Colour tokens, spacing, and status colours live in `tailwind.config.js`
  under `theme.extend.colors` — this is the single place to adjust the
  palette.
- Every data-driven section handles loading, empty, and error states via
  `src/hooks/useAsync.js` and `src/components/ui/States.jsx`.
- The sidebar collapses to icon-only with hover tooltips; layout otherwise
  targets desktop/laptop/tablet, not mobile-first.
