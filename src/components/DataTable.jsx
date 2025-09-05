import { useMemo, useState } from 'react'
import { useDB } from '../store/db'
import { PencilIcon, TrashIcon } from "@heroicons/react/24/solid"
import ConfirmModal from './ConfirmModal'
import { toast } from '../utils/notify'
import PDFButton from './PDFButton'

export default function DataTable({ schema, rows, onEdit, onDelete, filters = [] }) {
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [toDelete, setToDelete] = useState(null)
  const [q, setQ] = useState('')
  const [localFilters, setLocalFilters] = useState({})
  const db = useDB()
  const cols = schema.columns.filter(c => !c.hideInTable)

  const openConfirm = row => { setToDelete(row); setConfirmOpen(true) }
  const cancelConfirm = () => { setToDelete(null); setConfirmOpen(false) }
  const confirmAndDelete = () => { if(toDelete) { onDelete && onDelete(toDelete); toast('Supprimé avec succès',{type:'success'}); setToDelete(null); setConfirmOpen(false) } }

  const rowsWithRelations = useMemo(() => {
    return rows.map(r => {
      const out = {...r}
      schema.columns.forEach(c => {
        if(c.type?.startsWith('rel:') && r[c.key]){
          const relKey = c.type.split(':')[1]
          const found = db.list(relKey).find(x=>x.id===r[c.key])
          if(found) out[c.key+'Name'] = found.firstName ? (found.firstName+' '+found.lastName) : (found.name||found.ref||found.brand)
        }
      })
      return out
    })
  }, [rows, db.data])

  const filtered = useMemo(() => {
    let out = rowsWithRelations
    if(q){
      const keys = schema.searchBy ?? cols.map(c=>c.key)
      out = out.filter(r => keys.some(k => String(r[k]??r[k+'Name']??'').toLowerCase().includes(q.toLowerCase())))
    }
    Object.keys(localFilters).forEach(k=>{
      const v = localFilters[k]
      if(v) out = out.filter(r => String(r[k]??'').toLowerCase()===String(v).toLowerCase())
    })
    return out
  }, [q, rowsWithRelations, localFilters])

  const cellValue = (row, col) => {
    const v = row[col.key]
    if(col.type?.startsWith('rel:') && row[col.key+'Name']) return row[col.key+'Name']
    return v
  }

  return (
    <div className="card p-4 bg-white rounded-xl shadow">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-4">
        <input className="input border rounded px-2 py-1 max-w-xs" placeholder="Rechercher..." value={q} onChange={e=>setQ(e.target.value)} />
        <div className="flex items-center gap-2 flex-wrap">
          {filters.map(f => (
            <select key={f.key} className="input border rounded px-2 py-1" value={localFilters[f.key]||''} onChange={e=>setLocalFilters(s=>({...s,[f.key]:e.target.value}))}>
              <option value="">{f.label}</option>
              {f.options?.map(op => <option key={op} value={op}>{op}</option>)}
            </select>
          ))}
          <div className="text-sm text-gray-500">{filtered.length} enregistrements</div>
        </div>
      </div>

      <div className="overflow-auto">
        <table className="min-w-full table-auto border-collapse">
          <thead>
            <tr className="bg-gray-100">
              {cols.map(c => <th key={c.key} className="py-2 pr-4 text-left">{c.label}</th>)}
              <th className="py-2 pr-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(row => (
              <tr key={row.id} className="border-t hover:bg-gray-50">
                {cols.map(col => <td key={col.key} className="py-2 pr-4">{String(cellValue(row,col)??'')}</td>)}
                <td className="py-2 pr-4 flex gap-2 items-center">
                  <button onClick={()=>onEdit(row)} className="text-blue-600 hover:text-blue-800"><PencilIcon className="w-5 h-5"/></button>
                  <button onClick={()=>openConfirm(row)} className="text-red-600 hover:text-red-800"><TrashIcon className="w-5 h-5"/></button>
                  {schema.key==='prescriptions' && <PDFButton ordonnance={row} />}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {confirmOpen && <ConfirmModal open={confirmOpen} onCancel={cancelConfirm} onConfirm={confirmAndDelete} title="Confirmer la suppression" message="Êtes-vous sûr de vouloir supprimer cet enregistrement ?" />}
    </div>
  )
}
