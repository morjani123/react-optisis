import { useNavigate } from 'react-router-dom'

export default function AddItemModal({ open, onClose }) {
  const navigate = useNavigate()
  const items = [
    { key: 'clients', label: 'Client', icon: '👤' },
    { key: 'orders', label: 'Commande', icon: '📦' },
    { key: 'prescriptions', label: 'Ordonnance', icon: '📄' },
    { key: 'suppliers', label: 'Fournisseur', icon: '🏭' },
    { key: 'frames', label: 'Monture', icon: '👓' },
    { key: 'contacts', label: 'Lentille', icon: '👁️' },
    { key: 'lens-pricing', label: 'Tarif Verre', icon: '🔍' },
  ]

  if (!open) return null

  const handleSelect = (key) => {
    navigate(`/${key}`, { state: { openForm: true } })
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/30" onClick={onClose} />
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-xl relative max-w-2xl w-full z-10">
        <h2 className="text-lg font-bold mb-4 text-gray-800 dark:text-gray-200">Que souhaitez-vous ajouter ?</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {items.map(item => (
            <button
              key={item.key}
              onClick={() => handleSelect(item.key)}
              className="p-4 rounded-lg border hover:bg-gray-100 dark:hover:bg-gray-700 flex flex-col items-center transition"
            >
              <span className="text-3xl mb-2">{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </div>
        <button onClick={onClose} className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">✖</button>
      </div>
    </div>
  )
}
