import { create } from 'zustand'
import { load, save, uid, nowISO } from '../utils/storage'

const KEY = 'optisis_db_v3'

const initial = () => ({
  clients: [
    { id: uid('cli_'), firstName: 'Youssef', lastName: 'Amrani', phone: '0612345678', address: 'Fès', gender: 'Homme', age: 29, email: 'y.amrani@example.com', createdAt: nowISO() },
    { id: uid('cli_'), firstName: 'Sara', lastName: 'El Idrissi', phone: '0687654321', address: 'Rabat', gender: 'Femme', age: 34, email: '' , createdAt: nowISO() }
  ],
  users: [
    { id: uid('usr_'), name: 'Admin', email: 'admin@example.com', role: 'Admin', password: 'password' }
  ],
  prescriptions: [], orders: [], suppliers: [], frames: [], contacts: [], lensPricing: []
})

function readOrInit(){
  const existing = load(KEY, null)
  if(existing) return existing
  const seed = initial()
  save(KEY, seed)
  return seed
}

export const useDB = create((set, get) => ({
  data: readOrInit(),
  reset: () => { const seed = initial(); save(KEY, seed); set({ data: seed }) },
  list: (col) => get().data[col] ?? [],
  add: (col, item) => {
    const db = { ...get().data }
    const entity = { id: uid(col.slice(0,3)+'_'), createdAt: nowISO(), ...item }
    db[col] = [entity, ...db[col]]
    set({ data: db }); save(KEY, db)
    return entity
  },
  update: (col, id, patch) => {
    const db = { ...get().data }
    db[col] = db[col].map(r => r.id === id ? { ...r, ...patch, updatedAt: nowISO() } : r)
    set({ data: db }); save(KEY, db)
  },
  remove: (col, id) => {
    const db = { ...get().data }
    db[col] = db[col].filter(r => r.id !== id)
    set({ data: db }); save(KEY, db)
  },
  find: (col, id) => (get().data[col]||[]).find(r=>r.id===id)
}))
