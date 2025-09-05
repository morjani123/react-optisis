import { useDB } from '../store/db'

export default function FormRenderer({ schema, value={}, onChange }){
  const db = useDB()
  const inputs = schema.columns.filter(c => !c.auto && c.type !== 'auto:order' && !c.readOnly)
  const handle = (key, v) => onChange({ ...value, [key]: v })

  const renderInput = (c) => {
    const common = { className: 'input', value: value[c.key] ?? '', onChange: e => handle(c.key, e.target.value) }
    if (['text','email','tel','password','number','date'].includes(c.type)) {
      return <input type={c.type} {...common} />
    }
    if (c.type === 'textarea') return <textarea {...common} rows={4} />
    if (c.type?.startsWith('rel:')) {
      const rel = c.type.split(':')[1]
      const options = db.list(rel)
      return (
        <select className="input" value={value[c.key] ?? ''} onChange={e=>handle(c.key, e.target.value)}>
          <option value="">-- Sélectionner --</option>
          {options.map(o => <option key={o.id} value={o.id}>{o.firstName ? (o.firstName+' '+o.lastName) : (o.name || o.ref || o.brand)}</option>)}
        </select>
      )
    }
    if (c.type === 'select') {
      return (
        <select className="input" value={value[c.key] ?? ''} onChange={e=>handle(c.key, e.target.value)}>
          <option value="">-- Sélectionner --</option>
          {c.options?.map(op => <option key={op} value={op}>{op}</option>)}
        </select>
      )
    }
    if (c.type === 'auto:order') return <input className="input" value={value[c.key] ?? 'Auto'} disabled />
    return <input type="text" {...common} />
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {inputs.map(c => (
        <label key={c.key} className="flex flex-col gap-1">
          <span className="label">{c.label}{c.required && <span className="text-red-500 ml-1">*</span>}</span>
          {renderInput(c)}
        </label>
      ))}
    </div>
  )
}
