import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { useDB } from '../store/db'
import DataTable from '../components/DataTable'
import FormModal from '../components/FormModal'
import FormRenderer from '../components/FormRenderer'
import { uid } from '../utils/storage'

export default function ResourcePage({ schema }) {
  const db = useDB()
  const location = useLocation()
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({})

  const rows = db.list(schema.key)

  // Open modal automatically if navigated from AddItemModal
  useEffect(() => {
    if(location.state?.openForm) {
      openAdd()
    }
  }, [location.state])

  const openAdd = () => {
    setEditing(null)
    setForm({})
    const orderCol = schema.columns.find(c => c.type === 'auto:order')
    if(orderCol) setForm({ [orderCol.key]: 'CMD-' + uid('').slice(-6).toUpperCase() })
    setOpen(true)
  }

  const openEdit = row => {
    setEditing(row)
    setForm(row)
    setOpen(true)
  }

  const close = () => setOpen(false)

  const save = () => {
    for (const c of schema.columns) {
      if(c.required && !form[c.key]) {
        alert(`Le champ "${c.label}" est requis.`)
        return
      }
    }
    if(editing) db.update(schema.key, editing.id, form)
    else db.add(schema.key, form)
    setOpen(false)
  }

  const remove = row => {
    if(confirm('Supprimer cet enregistrement ?')) db.remove(schema.key, row.id)
  }

  const filters = schema.columns
    .filter(c => c.type === 'select')
    .map(c => ({ key: c.key, label: c.label, options: c.options }))

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">{schema.title}</h1>
        <button className="btn btn-primary" onClick={openAdd}>Ajouter</button>
      </div>

      <DataTable
        schema={schema}
        rows={rows}
        onEdit={openEdit}
        onDelete={remove}
        filters={filters}
      />

      <FormModal
        open={open}
        title={(editing ? 'Modifier ' : 'Ajouter ') + schema.title}
        onClose={close}
        onSave={save}
      >
        <FormRenderer schema={schema} value={form} onChange={setForm} />
      </FormModal>
    </div>
  )
}
