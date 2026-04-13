import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'

export default function Users() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { token } = useAuth()

  useEffect(() => {
    // We fetch users through a protected endpoint (assuming one exists)
    // If you don't have a GET /api/users endpoint, this will just show the structure
    const fetchUsers = async () => {
      try {
        const res = await fetch('/api/users', { // Assumption: API endpoint for users
          headers: { 'Authorization': `Bearer ${token}` }
        })
        const data = await res.json()
        if (res.ok) {
          setUsers(data.data?.users || [])
        } else {
          setError('Could not establish connection to users endpoint (may not be implemented).')
        }
      } catch (err) {
        setError('Network error fetching users.')
      } finally {
        setLoading(false)
      }
    }
    fetchUsers()
  }, [token])

  if (loading) return <div>Loading users...</div>

  return (
    <div>
      <h1 style={{ fontSize: '32px', marginBottom: '8px' }}>User Administration</h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: '32px' }}>Manage platform accounts and roles.</p>

      {error ? (
        <div style={{ color: 'var(--danger)', padding: '24px', background: 'rgba(239,68,68,0.1)', borderRadius: '12px' }}>
          {error}
        </div>
      ) : (
        <div className="glass-panel" style={{ overflow: 'hidden' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Joined</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr><td colSpan="4" style={{ textAlign: 'center', padding: '24px' }}>No users deployed</td></tr>
              ) : users.map(u => (
                <tr key={u._id}>
                  <td>{u.name}</td>
                  <td>{u.email}</td>
                  <td><span className={`badge ${u.role === 'admin' ? 'badge-pending' : 'badge-paid'}`}>{u.role}</span></td>
                  <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
