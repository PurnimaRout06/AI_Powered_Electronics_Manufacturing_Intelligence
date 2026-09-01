import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import {
  LayoutGrid,
  Cpu,
  Factory,
  ShieldCheck,
  Wrench,
  Sparkles,
  BarChart3,
  Settings,
  HelpCircle,
  ChevronsLeft,
  ChevronsRight,
  Activity
} from 'lucide-react'
import clsx from 'clsx'

const PRIMARY_NAV = [
  { to: '/', label: 'Overview', icon: LayoutGrid, end: true },
  { to: '/equipment', label: 'Equipment', icon: Cpu },
  { to: '/production', label: 'Production', icon: Factory },
  { to: '/quality', label: 'Quality', icon: ShieldCheck },
  { to: '/maintenance', label: 'Maintenance', icon: Wrench },
  { to: '/ai-insights', label: 'AI Insights', icon: Sparkles }
]

const ANALYTICS_NAV = [
  { to: '/analytics/production', label: 'Production Analytics', icon: BarChart3 },
  { to: '/analytics/equipment', label: 'Equipment Analytics', icon: BarChart3 },
  { to: '/analytics/quality', label: 'Quality Analytics', icon: BarChart3 },
  { to: '/analytics/downtime', label: 'Downtime Analytics', icon: BarChart3 }
]

function NavItem({ item, collapsed }) {
  return (
    <NavLink
      to={item.to}
      end={item.end}
      className={({ isActive }) =>
        clsx(
          'group relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-150',
          isActive
            ? 'bg-primary text-white'
            : 'text-slate-300 hover:bg-white/5 hover:text-white'
        )
      }
    >
      <item.icon size={17} strokeWidth={2} className="shrink-0" />
      {!collapsed && <span className="truncate">{item.label}</span>}
      {collapsed && (
        <span className="pointer-events-none absolute left-full ml-2 whitespace-nowrap rounded-md bg-navy-secondary px-2 py-1 text-xs text-white opacity-0 shadow-raised transition-opacity duration-150 group-hover:opacity-100 z-30">
          {item.label}
        </span>
      )}
    </NavLink>
  )
}

export default function Sidebar({ collapsed, onToggle }) {
  return (
    <aside
      className={clsx(
        'sticky top-0 h-screen shrink-0 bg-navy text-white flex flex-col transition-all duration-200',
        collapsed ? 'w-[72px]' : 'w-64'
      )}
    >
      <div className={clsx('flex items-center gap-2.5 px-4 h-16 border-b border-white/10', collapsed && 'justify-center px-0')}>
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary">
          <Activity size={17} strokeWidth={2.5} className="text-white" />
        </div>
        {!collapsed && (
          <span className="text-sm font-semibold tracking-tight truncate">Manufacturing Intelligence</span>
        )}
      </div>

      <nav className="flex-1 overflow-y-auto scrollbar-thin px-3 py-4 space-y-6">
        <div className="space-y-1">
          {PRIMARY_NAV.map((item) => (
            <NavItem key={item.to} item={item} collapsed={collapsed} />
          ))}
        </div>

        <div>
          {!collapsed && (
            <p className="px-3 mb-2 text-[11px] font-semibold text-slate-500 tracking-wide">Analytics</p>
          )}
          <div className="space-y-1">
            {ANALYTICS_NAV.map((item) => (
              <NavItem key={item.to} item={item} collapsed={collapsed} />
            ))}
          </div>
        </div>
      </nav>

      <div className="border-t border-white/10 px-3 py-4 space-y-1">
        <NavItem item={{ to: '/settings', label: 'Settings', icon: Settings }} collapsed={collapsed} />
        <NavItem item={{ to: '/help', label: 'Help', icon: HelpCircle }} collapsed={collapsed} />

        <div className={clsx('flex items-center gap-2.5 px-3 pt-3 mt-2 border-t border-white/10', collapsed && 'justify-center px-0')}>
          <div className="h-7 w-7 shrink-0 rounded-full bg-primary-light flex items-center justify-center text-[11px] font-semibold text-primary-dark">
            AK
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <p className="text-xs font-medium text-white truncate">Anjali Krishnan</p>
              <p className="text-[11px] text-slate-400 truncate">Plant Manager</p>
            </div>
          )}
        </div>

        <button
          onClick={onToggle}
          className={clsx(
            'mt-3 flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-slate-400 hover:bg-white/5 hover:text-white transition-colors',
            collapsed && 'justify-center px-0'
          )}
        >
          {collapsed ? <ChevronsRight size={16} /> : <ChevronsLeft size={16} />}
          {!collapsed && <span>Collapse</span>}
        </button>
      </div>
    </aside>
  )
}
