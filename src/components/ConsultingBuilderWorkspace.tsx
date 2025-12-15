import { useMemo, useState } from 'react'
import SlideCard, { type Slide } from './SlideCard'

const SAMPLE_INPUT = `Current state:
- Requests are inconsistent across departments
- Approvals happen over email and Teams
- Urgent buys bypass policy
- Vendor data is duplicated
- Tax fields are inconsistent
- This creates invoice errors

Target outcomes: reduce maverick spend by 15–20%
- shorten cycle time by 25%
- on-time payment >90% by Q3 2026`

const API_URL = '/api/generate'

export default function ConsultingBuilderWorkspace() {
  const [content, setContent] = useState('')
  const [slides, setSlides] = useState<Slide[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const canGenerate = useMemo(() => content.trim().length > 0 && !loading, [content, loading])

  const loadSample = () => {
    setContent(SAMPLE_INPUT)
    setError(null)
  }

  const generate = async () => {
    if (!content.trim()) {
      setError('Please paste some content first.')
      return
    }
    setLoading(true)
    setError(null)

    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: content.trim() }),
      })

      const text = await res.text()
      let data: any
      try {
        data = JSON.parse(text)
      } catch {
        data = { raw: text }
      }

      if (!res.ok) {
        throw new Error(data?.error ? `${data.error}` : `Request failed (${res.status})`)
      }

      if (!data || !Array.isArray(data.slides)) {
        throw new Error('Invalid response format: expected { slides: [...] }')
      }

      setSlides(data.slides)
    } catch (e: any) {
      setSlides([])
      setError(e?.message || 'Failed to generate slides.')
    } finally {
      setLoading(false)
    }
  }

  const copyAllJson = async () => {
    await navigator.clipboard.writeText(JSON.stringify({ slides }, null, 2))
  }

  return (
    <div className="workspace">
      <div className="workspace-header">
        <h2 className="workspace-title">Consulting Slides Builder</h2>
        <p className="workspace-desc">Paste pre-developed content and generate slide-ready structured output.</p>
      </div>

      <div className="panel">
        <div className="label">
          <div>Enter your content</div>
          <div className="hint">
            Uses <code>{API_URL}</code> (server-side proxy)
          </div>
        </div>

        <textarea
          className="textarea"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Paste paragraphs and/or bullets here..."
          disabled={loading}
        />

        <div className="actions">
          <button className="btn primary" onClick={generate} disabled={!canGenerate}>
            {loading ? (
              <>
                <span className="spinner" /> Generating...
              </>
            ) : (
              'Generate Slides'
            )}
          </button>
          <button className="btn" onClick={loadSample} disabled={loading}>
            Load sample input
          </button>
          <div className="spacer" />
          <button className="btn" onClick={copyAllJson} disabled={loading || slides.length === 0}>
            Copy All JSON
          </button>
        </div>

        {error && (
          <div className="notice">
            <div className="notice-title">Notice</div>
            <div className="notice-msg">{error}</div>
          </div>
        )}

        <div className="result-head">
          <div style={{ fontWeight: 1000, marginTop: 10 }}>Slides</div>
          <span className="badge">{slides.length}</span>
        </div>

        {slides.length > 0 && (
          <div className="grid">
            {slides.map((s, idx) => (
              <SlideCard key={idx} slide={s} index={idx} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
