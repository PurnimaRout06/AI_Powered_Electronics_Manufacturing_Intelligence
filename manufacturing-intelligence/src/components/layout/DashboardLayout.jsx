import { useState } from 'react'
import Sidebar from './Sidebar'
import Header from './Header'

export default function DashboardLayout({ title, breadcrumb, children }) {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <div className="flex min-h-screen bg-surface-bg">
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed((c) => !c)} />
      <div className="flex-1 min-w-0 flex flex-col">
        <Header title={title} breadcrumb={breadcrumb} />
        <main className="flex-1 px-6 py-6 animate-fadeIn">{children}</main>
      </div>
    </div>
  )
}
