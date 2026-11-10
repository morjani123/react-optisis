import { useEffect, useState } from 'react'
import { useAuth } from '../store/auth'
import AddItemModal from './AddItemModal'
import { useDB } from '../store/db'

export default function Topbar() {
  const user = useAuth(s => s.user)
  const resetDemo = useDB(s => s.reset)
  const [showInfo, setShowInfo] = useState(false)
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
    <header className="min-h-16 bg-white dark:bg-brand-900 flex flex-wrap sm:flex-nowrap items-center justify-between gap-2 px-3 sm:px-4 py-2 border-b dark:border-gray-700 sticky top-0 z-30 transition-colors">
      <div className="flex items-center space-x-3">
        <div className="text-sm sm:text-lg font-semibold text-gray-800 dark:text-white whitespace-nowrap">OptiSIS Dashboard</div>
      </div>

      <div className="flex flex-wrap items-center justify-end gap-2 sm:gap-3 min-w-0">
        {/* Add Button */}
        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg shadow"
        >
          ➕ Ajouter
        </button>
        <AddItemModal open={modalOpen} onClose={() => setModalOpen(false)} />

        {/* Toggle Switch */}
        <button onClick={toggle} className="relative w-12 h-6 flex items-center bg-gray-300 dark:bg-gray-600 rounded-full p-1 transition-colors duration-300" title="Toggle theme">
          <span className={"bg-white w-4 h-4 rounded-full shadow-md transform duration-300 " + (dark ? "translate-x-6 bg-yellow-400" : "translate-x-0")} />
        </button>

        <button onClick={()=>setShowInfo(!showInfo)} className="text-xs sm:text-sm bg-blue-50 text-blue-700 border border-blue-200 rounded-lg px-2 py-1.5" title="À propos de la démonstration">Démo ⓘ</button>
        <button onClick={()=>{ if(window.confirm('Réinitialiser toutes les données locales avec les exemples fictifs ?')) resetDemo() }} className="text-xs sm:text-sm border border-gray-300 dark:border-gray-600 rounded-lg px-2 py-1.5 text-gray-700 dark:text-gray-200">Réinitialiser</button>
        {user && (
          <div className="flex items-center space-x-3">
            <div className="hidden xl:block text-sm text-gray-600 dark:text-gray-200">Mode Démo</div>

          </div>
        )}
      </div>
      {showInfo && <div className="absolute top-16 right-3 max-w-sm bg-white dark:bg-gray-800 dark:text-white border dark:border-gray-700 shadow-xl rounded-xl p-4 text-sm z-50"><strong>Mode démonstration public</strong><p className="mt-2">Tous les clients et ordonnances présentés sont fictifs. Vos modifications restent dans ce navigateur. N'ajoutez aucune donnée personnelle réelle.</p><button className="mt-3 text-blue-600" onClick={()=>setShowInfo(false)}>Compris</button></div>}
    </header>
  )
}
