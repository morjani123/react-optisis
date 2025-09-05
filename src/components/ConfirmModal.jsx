export default function ConfirmModal({ open, title='Confirmer', message='Êtes-vous sûr ?', onCancel, onConfirm }) {
  if (!open) return null
  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow p-6 w-full max-w-md">
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <p className="text-sm text-gray-600 mb-4">{message}</p>
        <div className="flex justify-end gap-3">
          <button onClick={onCancel} className="btn btn-outline">Annuler</button>
          <button onClick={onConfirm} className="btn btn-primary">Confirmer</button>
        </div>
      </div>
    </div>
  )
}