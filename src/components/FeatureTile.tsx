import type { Feature } from './Sidebar'

export default function FeatureTile(props: { feature: Feature; active: boolean; onClick: () => void }) {
  const { feature, active, onClick } = props
  return (
    <button type="button" className={['feature-tile', active ? 'active' : ''].join(' ')} onClick={onClick}>
      <div className="feature-name">{feature.name}</div>
      <div className="feature-desc">{feature.isFunctional ? feature.description : 'Coming soon'}</div>
      {!feature.isFunctional && <div className="feature-badge">Coming soon</div>}
    </button>
  )
}
