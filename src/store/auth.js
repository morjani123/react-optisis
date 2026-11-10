import { create } from 'zustand'

// Public demo account: no credentials or backend authentication.
const DEMO_USER = { id: 'demo_visitor', name: 'Visiteur Démo', email: 'demo@optisis.local', role: 'Admin' }

export const useAuth = create(() => ({
  user: DEMO_USER,
  login: () => ({ ok: true }),
  logout: () => {}
}))
