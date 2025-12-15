import type { Feature } from './Sidebar'

export default function ComingSoonWorkspace({ feature }: { feature: Feature }) {
  return (
    <div className="workspace">
      <div className="workspace-header">
        <h2 className="workspace-title">{feature.name}</h2>
        <p className="workspace-desc">{feature.description}</p>
      </div>
      <div className="panel" style={{ marginTop: 14 }}>
        <div className="section-label">Status</div>
        <div style={{ color: 'var(--muted)', fontWeight: 700, lineHeight: 1.45 }}>
          Coming soon. This tile is a placeholder to demonstrate a centralized feature hub.
        </div>
      </div>
    </div>
  )
}
