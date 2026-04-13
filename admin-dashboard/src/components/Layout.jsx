import { Link, Outlet, useLocation } from 'react-router-dom'
import { LayoutDashboard, Package, ShoppingCart, Users, LogOut } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export default function Layout() {
  const { pathname } = useLocation()
  const { logout } = useAuth()

  const navItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Products', path: '/products', icon: Package },
    { name: 'Orders', path: '/orders', icon: ShoppingCart },
    { name: 'Users', path: '/users', icon: Users },
  ]

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      {/* Sidebar */}
      <aside className="glass-panel" style={{ width: '260px', borderLeft: 'none', borderTop: 'none', borderBottom: 'none', borderRadius: 0, padding: '24px', display: 'flex', flexDirection: 'column' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--accent-primary)', marginBottom: '40px' }}>E-Commerce Admin</h1>
        
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.path
            return (
              <Link 
                key={item.path} 
                to={item.path} 
                style={{
                  display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', borderRadius: '12px',
                  color: isActive ? 'var(--text-main)' : 'var(--text-muted)',
                  background: isActive ? 'var(--bg-hover)' : 'transparent',
                  textDecoration: 'none', transition: 'all 0.2s', fontWeight: isActive ? 500 : 400
                }}
              >
                <Icon size={20} color={isActive ? 'var(--accent-primary)' : 'currentColor'} />
                {item.name}
              </Link>
            )
          })}
        </nav>

        <button onClick={logout} className="btn" style={{ width: '100%', justifyContent: 'center', color: 'var(--danger)' }}>
          <LogOut size={18} /> Logout
        </button>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, padding: '40px', overflowY: 'auto' }}>
        <Outlet />
      </main>
    </div>
  )
}
