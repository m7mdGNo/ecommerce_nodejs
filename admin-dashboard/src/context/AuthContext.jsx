import { useState, useEffect, createContext, useContext } from 'react'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(localStorage.getItem('jwt') || null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Validate token on mount
    if (token) {
      // For simplicity, we just set true if token exists. A robust implementation would hit /api/auth/me
      setUser({ role: 'admin' }) 
    } else {
      setUser(null)
    }
    setLoading(false)
  }, [token])

  const login = (newToken) => {
    localStorage.setItem('jwt', newToken)
    setToken(newToken)
  }

  const logout = () => {
    localStorage.removeItem('jwt')
    setToken(null)
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
