export default function Dashboard() {
  return (
    <div>
      <h1 style={{ fontSize: '32px', marginBottom: '8px' }}>Dashboard Overview</h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: '32px' }}>Welcome back. Here is what's happening today.</p>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px' }}>
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h3 style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Total Sales</h3>
          <p style={{ fontSize: '32px', fontWeight: 'bold', marginTop: '8px' }}>$0.00</p>
        </div>
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h3 style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Active Users</h3>
          <p style={{ fontSize: '32px', fontWeight: 'bold', marginTop: '8px' }}>0</p>
        </div>
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h3 style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Pending Orders</h3>
          <p style={{ fontSize: '32px', fontWeight: 'bold', marginTop: '8px' }}>0</p>
        </div>
      </div>
    </div>
  )
}
