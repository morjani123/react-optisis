import { create } from 'zustand'
import { load, save, uid, nowISO } from '../utils/storage'
import { createDemoData } from '../data/demoData'

const KEY = 'optisis_db_v3'

const initial = () => createDemoData()

function readOrInit() {
  const existing = load(KEY, null)
  const marker = 'optisis_demo_seeded_v2'
  if (!existing || typeof existing !== 'object' || Array.isArray(existing)) {
    const seed = initial()
    save(KEY, seed)
    localStorage.setItem(marker, 'yes')
    return seed
  }
  if (localStorage.getItem(marker) === 'yes') return existing

  const demo = initial()
  const merged = { ...demo, ...existing }
  const clients = Array.isArray(existing.clients) && existing.clients.length ? existing.clients : demo.clients
  const suppliers = Array.isArray(existing.suppliers) && existing.suppliers.length ? existing.suppliers : demo.suppliers
  // Keep existing records, add demo records only to previously empty collections.
  for (const key of Object.keys(demo)) {
    if (key === 'users') continue
    if (!Array.isArray(existing[key]) || existing[key].length === 0) merged[key] = demo[key]
  }
  if (!Array.isArray(existing.orders) || existing.orders.length === 0) {
    merged.orders = demo.orders.map((o,i) => ({
      ...o, clientId: clients[i % clients.length].id,
      supplierId: suppliers[i % suppliers.length].id
    }))
  }
  if (!Array.isArray(existing.prescriptions) || existing.prescriptions.length === 0) {
    merged.prescriptions = demo.prescriptions.map((p,i) => ({
      ...p, clientId: clients[i % clients.length].id
    }))
  }
  save(KEY, merged)
  localStorage.setItem(marker, 'yes')
  return merged
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
