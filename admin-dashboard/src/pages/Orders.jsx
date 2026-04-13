import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'

export default function Orders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const { token } = useAuth()

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      const res = await fetch('/api/orders', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const data = await res.json()
      if (res.ok) setOrders(data.data) // Assuming data.data holds the array
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const updateStatus = async (id, newStatus) => {
    try {
      const res = await fetch(`/api/orders/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      })
      
      if (res.ok) {
        fetchOrders() // Refresh UI
      } else {
        const errorData = await res.json()
        alert(errorData.message || 'Failed to update status')
      }
    } catch (err) {
      console.error(err)
    }
  }

  if (loading) return <div>Loading orders...</div>

  return (
    <div>
      <h1 style={{ fontSize: '32px', marginBottom: '8px' }}>Orders Management</h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: '32px' }}>Track and manage customer orders.</p>

      <div className="glass-panel" style={{ overflow: 'hidden' }}>
        <table className="data-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Date</th>
              <th>Total</th>
              <th>Payment</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr><td colSpan="6" style={{ textAlign: 'center', padding: '24px' }}>No orders found</td></tr>
            ) : orders.map(order => (
              <tr key={order._id}>
                <td style={{ fontFamily: 'monospace' }}>...{order._id.slice(-6)}</td>
                <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                <td>${order.totalPrice.toFixed(2)}</td>
                <td style={{ textTransform: 'uppercase' }}>{order.paymentType}</td>
                <td>
                  <span className={`badge badge-${order.status}`}>{order.status}</span>
                </td>
                <td>
                  <select 
                    className="input-glass" 
                    style={{ width: 'auto', padding: '6px 10px', fontSize: '14px' }}
                    value={order.status}
                    onChange={(e) => updateStatus(order._id, e.target.value)}
                  >
                    <option value="pending">Pending</option>
                    <option value="paid">Paid</option>
                    <option value="failed">Failed</option>
                    <option value="canceled">Canceled</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
