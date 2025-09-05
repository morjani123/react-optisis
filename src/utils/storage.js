export const load = (key, fallback) => {
  try { const raw = localStorage.getItem(key); return raw ? JSON.parse(raw) : fallback } catch { return fallback }
}
export const save = (key, data) => localStorage.setItem(key, JSON.stringify(data))
export const uid = (prefix='') => prefix + Math.random().toString(36).slice(2,9)
export const nowISO = () => new Date().toISOString().slice(0,19)
