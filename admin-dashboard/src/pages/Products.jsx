import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { Plus, Trash2, Edit } from 'lucide-react'

export default function Products() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const { token } = useAuth()

  const [showModal, setShowModal] = useState(false)
  const [editingId, setEditingId] = useState(null)
  
  const defaultForm = {
    name: '', description: '', price: 0, category: '', supplier: '', stock: 0
  }
  const [formData, setFormData] = useState(defaultForm)

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products')
      const data = await res.json()
      if (res.ok) setProducts(data.data || [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const openCreateModal = () => {
    setEditingId(null)
    setFormData(defaultForm)
    setShowModal(true)
  }

  const openEditModal = (product) => {
    setEditingId(product._id)
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      supplier: product.supplier,
      stock: product.stock
    })
    setShowModal(true)
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return

    try {
      const res = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (res.ok) {
        fetchProducts()
      } else {
        const errorData = await res.json()
        alert(errorData.message || 'Failed to delete product')
      }
    } catch (err) {
      console.error(err)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    const method = editingId ? 'PUT' : 'POST'
    const url = editingId ? `/api/products/${editingId}` : '/api/products'

    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({...formData, price: Number(formData.price), stock: Number(formData.stock)})
      })
      if (res.ok) {
        setShowModal(false)
        fetchProducts()
      } else {
        const errorData = await res.json()
        alert(errorData.message || 'Validation failed')
      }
    } catch (err) {
      console.error(err)
    }
  }

  if (loading) return <div>Loading products...</div>

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '32px', marginBottom: '8px' }}>Products Management</h1>
          <p style={{ color: 'var(--text-muted)' }}>Inventory overview and catalogue limits.</p>
        </div>
        <button onClick={openCreateModal} className="btn btn-primary">
          <Plus size={18} /> Add Product
        </button>
      </div>

      <div className="glass-panel" style={{ overflow: 'hidden' }}>
        <table className="data-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Category</th>
              <th>Supplier</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.length === 0 ? (
              <tr><td colSpan="7" style={{ textAlign: 'center', padding: '24px' }}>No products found</td></tr>
            ) : products.map(p => (
              <tr key={p._id}>
                <td style={{ fontWeight: 500 }}>{p.name}</td>
                <td>{p.category}</td>
                <td>{p.supplier}</td>
                <td>${p.price.toFixed(2)}</td>
                <td>{p.stock}</td>
                <td><span className={`badge ${p.isActive ? 'badge-paid' : 'badge-canceled'}`}>{p.isActive ? 'Active' : 'Inactive'}</span></td>
                <td>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button onClick={() => openEditModal(p)} style={{ background: 'transparent', border: 'none', color: 'var(--accent-primary)', cursor: 'pointer' }}>
                      <Edit size={16} />
                    </button>
                    <button onClick={() => handleDelete(p._id)} style={{ background: 'transparent', border: 'none', color: 'var(--danger)', cursor: 'pointer' }}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50 }}>
          <div className="glass-panel" style={{ width: '500px', padding: '32px' }}>
            <h2 style={{ marginBottom: '24px' }}>{editingId ? 'Edit Product' : 'Create New Product'}</h2>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <input placeholder="Name" required className="input-glass" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
              <textarea placeholder="Description" required className="input-glass" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
              <div style={{ display: 'flex', gap: '16px' }}>
                <input type="number" step="0.01" placeholder="Price" required className="input-glass" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} />
                <input type="number" placeholder="Stock" required className="input-glass" value={formData.stock} onChange={e => setFormData({...formData, stock: e.target.value})} />
              </div>
              <div style={{ display: 'flex', gap: '16px' }}>
                <input placeholder="Category" required className="input-glass" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} />
                <input placeholder="Supplier" required className="input-glass" value={formData.supplier} onChange={e => setFormData({...formData, supplier: e.target.value})} />
              </div>
              <div style={{ display: 'flex', gap: '12px', marginTop: '16px', justifyContent: 'flex-end' }}>
                <button type="button" className="btn" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">{editingId ? 'Save Changes' : 'Create Product'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
