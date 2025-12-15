import { useMemo } from 'react'

export interface Slide {
  header: string
  title: string
  bullets: string[]
  suggested_graphs: string[]
}

function slideToText(slide: Slide, index: number) {
  const bullets = (slide.bullets || []).map((b) => `- ${b}`).join('\n')
  const graphs = (slide.suggested_graphs || []).map((g) => `- ${g}`).join('\n')
  return [
    `Slide ${index + 1}`,
    `Header: ${slide.header || ''}`,
    `Title: ${slide.title || ''}`,
    `Bullets:\n${bullets}`,
    `Suggested graphs:\n${graphs}`,
  ].join('\n')
}

export default function SlideCard({ slide, index }: { slide: Slide; index: number }) {
  const safe = useMemo(
    () => ({
      header: String(slide.header || ''),
      title: String(slide.title || ''),
      bullets: Array.isArray(slide.bullets) ? slide.bullets.map(String) : [],
      suggested_graphs: Array.isArray(slide.suggested_graphs) ? slide.suggested_graphs.map(String) : [],
    }),
    [slide],
  )

  const copy = async (text: string) => {
    await navigator.clipboard.writeText(text)
  }

  return (
    <div className="card">
      <div className="card-top">
        <div className="card-num">{index + 1}</div>
        <div>
          <div className="card-header">{safe.header}</div>
          <div className="card-title">{safe.title}</div>
        </div>
      </div>

      <div className="section">
        <div className="section-label">Bullets</div>
        <ul>
          {safe.bullets.map((b, i) => (
            <li key={i}>{b}</li>
          ))}
        </ul>
      </div>

      <div className="section">
        <div className="section-label">Suggested graphs</div>
        <div className="chips">
          {safe.suggested_graphs.map((g, i) => (
            <span className="chip" key={i}>
              {g}
            </span>
          ))}
        </div>
      </div>

      <div className="card-actions">
        <button className="btn small" onClick={() => copy(JSON.stringify(safe, null, 2))}>
          Copy Slide JSON
        </button>
        <button className="btn small" onClick={() => copy(slideToText(safe, index))}>
          Copy Slide Text
        </button>
      </div>
    </div>
  )
}
