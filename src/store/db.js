import { create } from 'zustand'
import { load, save, uid, nowISO } from '../utils/storage'
import { createDemoData } from '../data/demoData'

const KEY = 'optisis_db_v3'

const initial = () => createDemoData()

function readOrInit() {
  const existing = load(KEY, null)
  if (!existing || typeof existing !== 'object' || Array.isArray(existing)) {
    const seed = initial()
    save(KEY, seed)
    return seed
  }
  // Preserve every existing record. Fill only empty collections with demo data.
  // Avoid reseeding when a visitor intentionally clears a collection later.
  const seeded = localStorage.getItem('optisis_demo_seeded_v1') === 'yes'
  if (seeded) return existing
  const demo = initial()
  const merged = { ...demo, ...existing }
  for (const key of Object.keys(demo)) {
    if (key === 'users') continue
    if (!Array.isArray(existing[key]) || existing[key].length === 0) merged[key] = demo[key]
  }
  // Keep sample orders and prescriptions linked to the actual visible clients.
  if (Array.isArray(merged.clients) && merged.clients.length && merged.clients !== demo.clients) {
    const remapClient = id => {
      const idx = demo.clients.findIndex(c => c.id === id)
      return idx < 0 ? id : merged.clients[idx % merged.clients.length].id
    }
    if (merged.orders === demo.orders) merged.orders = demo.orders.map(o => ({...o, clientId: remapClient(o.clientId)}))
    if (merged.prescriptions === demo.prescriptions) merged.prescriptions = demo.prescriptions.map(p => ({...p, clientId: remapClient(p.clientId)}))
  }
  if (Array.isArray(merged.suppliers) && merged.suppliers.length && merged.suppliers !== demo.suppliers && merged.orders === demo.orders) {
    merged.orders = merged.orders.map((o,i)=>({...o,supplierId:merged.suppliers[i%merged.suppliers.length].id}))
  }
  save(KEY, merged)
  localStorage.setItem('optisis_demo_seeded_v1', 'yes')
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
