import { create } from 'zustand'
import { load, save } from '../utils/storage'

const DEFAULT_USER = { id: 'u_admin', name: 'Admin', email: 'admin@example.com', role: 'Admin' }

export const useAuth = create((set)=> ({
  user: load('auth_user', null),
  login: ({email, password}) => {
    if (email === 'admin@example.com' && password === 'password') {
      save('auth_user', DEFAULT_USER)
      set({ user: DEFAULT_USER })
      return { ok: true }
    }
    return { ok: false, message: 'Email ou mot de passe incorrect.' }
  },
  logout: () => {
    localStorage.removeItem('auth_user')
    set({ user: null })
  }
}))