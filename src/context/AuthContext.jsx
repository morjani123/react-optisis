import { createContext, useContext } from 'react'

const AuthContext = createContext(null)
const DEMO_USER = { id: 'demo_visitor', name: 'Visiteur Démo', email: 'demo@optisis.local', role: 'Admin' }

export function AuthProvider({ children }) {
  return (
    <AuthContext.Provider value={{ user: DEMO_USER, logout: () => {} }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
