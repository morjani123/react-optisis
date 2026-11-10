import { toast } from '../utils/notify'

export default function FormModal({ open, title, children, onClose, onSave }) {
  if (!open) return null
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-3 sm:p-6">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-2xl max-h-[calc(100dvh-1.5rem)] flex flex-col overflow-hidden">
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-lg font-semibold">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition"
          >
            ✕
          </button>
        </div>
        <div className="p-4 overflow-y-auto min-h-0">{children}</div>
        <div className="p-4 border-t flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
          >
            Annuler
          </button>
          <button
            onClick={() => {
              toast('Enregistré ✅')
              onSave()
            }}
            className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
          >
            Enregistrer
          </button>
        </div>
      </div>
    </div>
  )
}
