import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../api/client'

function ShareLinks() {
  const [links, setLinks] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [showNewCategory, setShowNewCategory] = useState(false)
  const [newCategoryName, setNewCategoryName] = useState('')
  const [form, setForm] = useState({ category_id: '', title: '', description: '', expires_at: '' })
  const [saving, setSaving] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [linksData, catsData] = await Promise.all([
        api.getShareLinks(),
        api.getCategories()
      ])
      setLinks(linksData.links || [])
      setCategories(catsData.categories || [])
    } catch (err) {
      if (err.message.includes('Authentication')) {
        navigate('/login')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleCreateCategory = async (e) => {
    e.preventDefault()
    if (!newCategoryName.trim()) return
    try {
      const cat = await api.createCategory(newCategoryName.trim())
      setCategories([...categories, cat])
      setForm({ ...form, category_id: cat.id })
      setNewCategoryName('')
      setShowNewCategory(false)
    } catch (err) {
      alert(err.message)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      await api.createShareLink(form)
      setForm({ category_id: '', title: '', description: '', expires_at: '' })
      setShowForm(false)
      loadData()
    } catch (err) {
      alert(err.message)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this link?')) return
    try {
      await api.deleteShareLink(id)
      loadData()
    } catch (err) {
      alert(err.message)
    }
  }

  const copyLink = (slug) => {
    const url = `${window.location.origin}/r/${slug}`
    navigator.clipboard.writeText(url)
    alert('Link copied!')
  }

  if (loading) return <div className="loading">Loading...</div>

  return (
    <div className="share-links-page">
      <nav className="nav">
        <h2>Share Links</h2>
        <div className="nav-links">
          <Link to="/dashboard">Dashboard</Link>
        </div>
      </nav>

      <div className="content">
        <div className="header-row">
          <h3>Generate Links for Clients</h3>
          <button onClick={() => setShowForm(!showForm)}>
            {showForm ? 'Cancel' : '+ New Link'}
          </button>
        </div>

        {showForm && (
          <form onSubmit={handleSubmit} className="form">
            <div className="form-group">
              <label>Category</label>
              {categories.length === 0 ? (
                <div className="new-category-inline">
                  <input
                    type="text"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    placeholder="Enter new category name"
                  />
                  <button type="button" onClick={handleCreateCategory}>Add</button>
                </div>
              ) : (
                <>
                  <select
                    value={form.category_id}
                    onChange={(e) => setForm({ ...form, category_id: e.target.value })}
                    required
                  >
                    <option value="">Select category</option>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                  <button type="button" className="link-btn" onClick={() => setShowNewCategory(!showNewCategory)}>
                    + New Category
                  </button>
                  {showNewCategory && (
                    <div className="new-category-inline" style={{ marginTop: '0.5rem' }}>
                      <input
                        type="text"
                        value={newCategoryName}
                        onChange={(e) => setNewCategoryName(e.target.value)}
                        placeholder="New category name"
                      />
                      <button type="button" onClick={handleCreateCategory}>Add</button>
                    </div>
                  )}
                </>
              )}
            </div>
            <div className="form-group">
              <label>Title (optional)</label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="e.g., Rate our service"
              />
            </div>
            <div className="form-group">
              <label>Description (optional)</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Instructions for the client"
              />
            </div>
            <div className="form-group">
              <label>Expires (optional)</label>
              <input
                type="datetime-local"
                value={form.expires_at}
                onChange={(e) => setForm({ ...form, expires_at: e.target.value })}
              />
            </div>
            <button type="submit" disabled={saving}>
              {saving ? 'Creating...' : 'Create Link'}
            </button>
          </form>
        )}

        <table className="table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Category</th>
              <th>Link</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {links.length === 0 ? (
              <tr><td colSpan="5">No links yet</td></tr>
            ) : (
              links.map(link => (
                <tr key={link.id}>
                  <td>{link.title || '-'}</td>
                  <td>{link.category?.name}</td>
                  <td>
                    <button onClick={() => copyLink(link.slug)} className="btn-small">
                      Copy Link
                    </button>
                  </td>
                  <td>{new Date(link.created_at).toLocaleDateString()}</td>
                  <td>
                    <button onClick={() => handleDelete(link.id)} className="btn-danger">
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default ShareLinks