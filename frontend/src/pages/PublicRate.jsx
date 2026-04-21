import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import api from '../api/client'

function PublicRate() {
  const { slug } = useParams()
  const [link, setLink] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [form, setForm] = useState({ client_name: '', rating: 5, comment: '' })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    loadLink()
  }, [slug])

  const loadLink = async () => {
    try {
      const data = await api.getPublicLink(slug)
      setLink(data.link)
    } catch (err) {
      setError(err.message || 'Link not found or expired')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      await api.submitPublicRating(slug, form)
      setSubmitted(true)
    } catch (err) {
      alert(err.message)
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="loading">Loading...</div>
  if (error) return <div className="error-page"><h2>{error}</h2></div>

  if (submitted) {
    return (
      <div className="public-rate success">
        <h2>Thank you for your rating!</h2>
        <p>Your feedback has been submitted successfully.</p>
        <div className="stars-display">
          {'★'.repeat(form.rating)}{'☆'.repeat(5 - form.rating)}
        </div>
      </div>
    )
  }

  return (
    <div className="public-rate">
      <div className="rate-card">
        <h1>{link.title || 'Rate Us'}</h1>
        {link.description && <p className="description">{link.description}</p>}
        <p className="category">Category: {link.category?.name}</p>

        {link.stats && link.stats.total > 0 && (
          <div className="stats-preview">
            <p>Current Rating: <strong>{link.stats.average.toFixed(1)}</strong> / 5 ({link.stats.total} reviews)</p>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Your Name</label>
            <input
              type="text"
              value={form.client_name}
              onChange={(e) => setForm({ ...form, client_name: e.target.value })}
              required
              placeholder="Enter your name"
            />
          </div>

          <div className="form-group">
            <label>Rating</label>
            <div className="stars-input">
              {[1, 2, 3, 4, 5].map(star => (
                <button
                  key={star}
                  type="button"
                  className={`star-btn ${form.rating >= star ? 'active' : ''}`}
                  onClick={() => setForm({ ...form, rating: star })}
                >
                  {form.rating >= star ? '★' : '☆'}
                </button>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label>Comment (optional)</label>
            <textarea
              value={form.comment}
              onChange={(e) => setForm({ ...form, comment: e.target.value })}
              placeholder="Share your experience..."
              maxLength={500}
            />
          </div>

          <button type="submit" disabled={saving} className="submit-btn">
            {saving ? 'Submitting...' : 'Submit Rating'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default PublicRate