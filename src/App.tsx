import { useMemo, useState } from 'react'
import Sidebar, { type Feature, type FeatureId } from './components/Sidebar'
import ConsultingBuilderWorkspace from './components/ConsultingBuilderWorkspace'
import ComingSoonWorkspace from './components/ComingSoonWorkspace'

const FEATURES: Feature[] = [
  { id: 'consulting', name: 'Consulting Slides Builder', description: 'Paste pre-developed content and generate slide-ready structured output.', isFunctional: true },
  { id: 'analytics', name: 'Analytics Dashboard', description: 'Track metrics and generate reports.', isFunctional: false },
  { id: 'automation', name: 'Content Automation', description: 'Automate content generation and distribution.', isFunctional: false },
  { id: 'integration', name: 'API Integration', description: 'Connect with external services.', isFunctional: false },
  { id: 'reporting', name: 'Advanced Reporting', description: 'Generate custom insights and exports.', isFunctional: false },
  { id: 'insights', name: 'AI Insights', description: 'AI-powered recommendations and analysis.', isFunctional: false },
]

export default function App() {
  const [activeFeature, setActiveFeature] = useState<FeatureId>('consulting')
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const active = useMemo(() => FEATURES.find((f) => f.id === activeFeature)!, [activeFeature])

  const closeSidebar = () => setSidebarOpen(false)

  return (
    <>
      <div className="main">
        <div className="topbar">
          <button className="icon-btn" onClick={() => setSidebarOpen((s) => !s)} aria-label="Toggle sidebar">
            ☰
          </button>
          <div style={{ fontWeight: 1000 }}>{active.name}</div>
          <div style={{ width: 40 }} />
        </div>
      </div>

      <div className="app-shell">
        {sidebarOpen && <div className="overlay" onClick={closeSidebar} />}
        <Sidebar
          features={FEATURES}
          activeFeature={activeFeature}
          onFeatureSelect={(id) => {
            setActiveFeature(id)
            setSidebarOpen(false)
          }}
          isOpen={sidebarOpen}
          onToggle={() => setSidebarOpen((s) => !s)}
        />

        <main className="main">
          {activeFeature === 'consulting' ? <ConsultingBuilderWorkspace /> : <ComingSoonWorkspace feature={active} />}
        </main>
      </div>
    </>
  )
}
