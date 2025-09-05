import { useEffect, useState } from 'react'
import { useAuth } from '../store/auth'
import AddItemModal from './AddItemModal'

export default function Topbar() {
  const user = useAuth(s => s.user)
  const logout = useAuth(s => s.logout)
  const [dark, setDark] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)

  useEffect(() => {
    const t = localStorage.getItem('theme') || (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
    if (t === 'dark') {
      document.documentElement.classList.add('dark')
      setDark(true)
    } else {
      document.documentElement.classList.remove('dark')
      setDark(false)
    }
  }, [])

  const toggle = () => {
    const next = !dark
    setDark(next)
    if (next) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  }

  return (
    <header className="h-16 bg-white dark:bg-brand-900 flex items-center justify-between px-4 border-b dark:border-gray-700 sticky top-0 z-30 transition-colors">
      <div className="flex items-center space-x-3">
        <div className="text-lg font-semibold text-gray-800 dark:text-white">OptiSIS Dashboard</div>
      </div>

      <div className="flex items-center space-x-4">
        {/* Add Button */}
        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg shadow"
        >
          ➕ Ajouter
        </button>
        <AddItemModal open={modalOpen} onClose={() => setModalOpen(false)} />

        {/* Toggle Switch */}
        <button onClick={toggle} className="relative w-12 h-6 flex items-center bg-gray-300 dark:bg-gray-600 rounded-full p-1 transition-colors duration-300" title="Toggle theme">
          <span className={"bg-white w-4 h-4 rounded-full shadow-md transform duration-300 " + (dark ? "translate-x-6 bg-yellow-400" : "translate-x-0")} />
        </button>

        {user && (
          <div className="flex items-center space-x-3">
            <div className="text-sm text-gray-600 dark:text-gray-200">Welcome, {user?.name}</div>
            <button onClick={logout} className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">Logout</button>
          </div>
        )}
      </div>
    </header>
  )
}
