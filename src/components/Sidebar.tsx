import FeatureTile from './FeatureTile'

export type FeatureId = 'consulting' | 'analytics' | 'automation' | 'integration' | 'reporting' | 'insights'

export interface Feature {
  id: FeatureId
  name: string
  description: string
  isFunctional: boolean
}

export default function Sidebar(props: {
  features: Feature[]
  activeFeature: FeatureId
  onFeatureSelect: (id: FeatureId) => void
  isOpen: boolean
  onToggle: () => void
}) {
  const { features, activeFeature, onFeatureSelect, isOpen } = props

  return (
    <aside className={['sidebar', isOpen ? 'open' : ''].join(' ')}>
      <div className="sidebar-title">FEATURES</div>
      <div className="feature-list">
        {features.map((f) => (
          <FeatureTile key={f.id} feature={f} active={f.id === activeFeature} onClick={() => onFeatureSelect(f.id)} />
        ))}
      </div>
    </aside>
  )
}
