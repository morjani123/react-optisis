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

const number = value => Number.isFinite(Number(value)) ? Number(value) : 0
const orderQty = order => Math.max(1, number(order?.quantity) || 1)
const delivered = order => order?.workflowStatus === 'Livrée'
const collectionFor = order => order?.productType === 'Lentilles' ? 'contacts' : order?.productType === 'Monture' || order?.productType === 'Solaire' ? 'frames' : null

function adjustStock(db, order, direction) {
  const col = collectionFor(order)
  if (!col || !order?.ref || !Array.isArray(db[col])) return
  db[col] = db[col].map(product => product.ref === order.ref && product.quantity !== undefined
    ? { ...product, quantity: Math.max(0, number(product.quantity) + direction * orderQty(order)) }
    : product)
}
function normalizeOrder(order) {
  if (!order) return order
  const sellPrice = Math.max(0, number(order.sellPrice))
  const deposit = Math.min(sellPrice, Math.max(0, number(order.deposit)))
  return { ...order, sellPrice, deposit, rest: sellPrice - deposit,
    paymentStatus: deposit >= sellPrice && sellPrice > 0 ? 'Payé' : deposit > 0 ? 'Acompte' : 'Impayé',
    workflowStatus: order.workflowStatus || 'Nouvelle' }
}
function commitDB(set, db) { set({ data: db }); save(KEY, db) }

export const useDB = create((set, get) => ({
  data: readOrInit(),
  reset: () => { const seed = initial(); save(KEY, seed); localStorage.setItem('optisis_demo_seeded_v2','yes'); set({ data: seed }) },
  list: (col) => get().data[col] ?? [],
  add: (col, item) => {
    const db = { ...get().data }
    const entity = { id: uid(col.slice(0,3)+'_'), createdAt: nowISO(), ...(col === 'orders' ? normalizeOrder(item) : item) }
    db[col] = [entity, ...db[col]]
    if (col === 'orders' && delivered(entity)) adjustStock(db, entity, -1)
    commitDB(set, db)
    return entity
  },
  update: (col, id, patch) => {
    const db = { ...get().data }
    const old = db[col].find(r => r.id === id)
    const next = col === 'orders' ? normalizeOrder({ ...old, ...patch }) : { ...old, ...patch }
    if (col === 'orders' && old && delivered(old)) adjustStock(db, old, 1)
    db[col] = db[col].map(r => r.id === id ? { ...next, updatedAt: nowISO() } : r)
    if (col === 'orders' && delivered(next)) adjustStock(db, next, -1)
    commitDB(set, db)
  },
  remove: (col, id) => {
    const db = { ...get().data }
    const old = db[col].find(r => r.id === id)
    if (col === 'orders' && delivered(old)) adjustStock(db, old, 1)
    db[col] = db[col].filter(r => r.id !== id)
    commitDB(set, db)
  },
  find: (col, id) => (get().data[col]||[]).find(r=>r.id===id)
}))
