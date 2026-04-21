import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Chart as ChartJS, ArcElement, BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend } from 'chart.js'
import { Bar, Doughnut } from 'react-chartjs-2'
import api from '../api/client'

ChartJS.register(ArcElement, BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend)

function Dashboard() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    loadDashboard()
  }, [])

  const loadDashboard = async () => {
    try {
      const dashboard = await api.getDashboard()
      setData(dashboard)
    } catch (err) {
      if (err.message.includes('Authentication')) {
        navigate('/login')
      } else {
        setError(err.message)
      }
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      await api.logout()
      navigate('/login')
    } catch (err) {
      console.error('Logout error:', err)
    }
  }

  if (loading) return <div className="loading">Loading dashboard...</div>
  if (error) return <div className="error">{error}</div>

  const overview = data?.overview || {}
  const categoryStats = data?.categoryStats || []
  const recentActivity = data?.recentActivity || []

  const barData = {
    labels: categoryStats.map(c => c.name),
    datasets: [{
      label: 'Average Rating',
      data: categoryStats.map(c => c.average?.toFixed(1)),
      backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF']
    }]
  }

  const doughnutData = {
    labels: categoryStats.map(c => c.name),
    datasets: [{
      data: categoryStats.map(c => c.total),
      backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF']
    }]
  }

  const barOptions = { responsive: true, plugins: { legend: { display: false }, title: { display: true, text: 'Average Rating by Category' } } }
  const doughnutOptions = { responsive: true, plugins: { legend: { position: 'bottom' }, title: { display: true, text: 'Ratings Distribution' } } }

  return (
    <div className="dashboard">
      <nav className="nav">
        <h2>Rating App Admin</h2>
        <div className="nav-links">
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/share-links">Share Links</Link>
          <button onClick={handleLogout}>Logout</button>
        </div>
      </nav>

      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Ratings</h3>
          <p className="stat-value">{overview.totalRatings || 0}</p>
        </div>
        <div className="stat-card">
          <h3>Average Rating</h3>
          <p className="stat-value">{overview.averageRating?.toFixed(1) || '0.0'}</p>
        </div>
        <div className="stat-card">
          <h3>Categories</h3>
          <p className="stat-value">{overview.totalCategories || 0}</p>
        </div>
        <div className="stat-card">
          <h3>Top Category</h3>
          <p className="stat-value">{overview.topRatedCategory?.name || '-'}</p>
        </div>
      </div>

      <div className="charts-grid">
        <div className="chart-card">
          <Bar data={barData} options={barOptions} />
        </div>
        <div className="chart-card">
          <Doughnut data={doughnutData} options={doughnutOptions} />
        </div>
      </div>

      <div className="activity-section">
        <h3>Recent Ratings</h3>
        <table className="activity-table">
          <thead>
            <tr>
              <th>Category</th>
              <th>Rating</th>
              <th>Comment</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {recentActivity.length === 0 ? (
              <tr><td colSpan="4">No ratings yet</td></tr>
            ) : (
              recentActivity.map(r => (
                <tr key={r.id}>
                  <td>{r.category?.name}</td>
                  <td>{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</td>
                  <td>{r.comment || '-'}</td>
                  <td>{new Date(r.created_at).toLocaleDateString()}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Dashboard