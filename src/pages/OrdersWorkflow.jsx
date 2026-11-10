import { useMemo, useState } from 'react'
import { useDB } from '../store/db'
import OrderDocuments from '../components/OrderDocuments'

const stages = ['Nouvelle','En préparation','Prête','Livrée']
const colors = ['bg-sky-100 text-sky-800','bg-amber-100 text-amber-800','bg-violet-100 text-violet-800','bg-emerald-100 text-emerald-800']
const amount = n => (Number(n)||0).toLocaleString('fr-FR')+' MAD'

export default function OrdersWorkflow() {
  const db = useDB()
  const orders = db.list('orders')
  const clients = db.list('clients')
  const [query,setQuery] = useState('')
  const [stage,setStage] = useState('Tous')
  const filtered = useMemo(()=>orders.filter(o=>{
    const c = clients.find(x=>x.id===o.clientId)
    const name = [c?.firstName,c?.lastName].filter(Boolean).join(' ')
    return (stage==='Tous' || (o.workflowStatus||'Nouvelle')===stage) &&
      [o.orderNo,o.brand,o.ref,name].some(v=>String(v||'').toLowerCase().includes(query.toLowerCase()))
  }),[orders,clients,query,stage])
  return <div className="p-3 sm:p-6 min-w-0 overflow-x-hidden bg-gray-50 dark:bg-gray-900 min-h-screen space-y-5">
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div><h1 className="text-2xl font-bold text-gray-800 dark:text-white">Suivi des commandes</h1><p className="text-sm text-gray-500">Avancement de préparation et livraison · données de démonstration</p></div>
      <input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Rechercher commande ou client…" className="border rounded-lg p-2 w-full sm:w-72 text-gray-800" />
    </div>
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">{stages.map((s,i)=><button key={s} onClick={()=>setStage(stage===s?'Tous':s)} className={'rounded-xl p-4 text-left shadow-sm border-2 '+colors[i]+' '+(stage===s?'border-blue-600':'border-transparent')}>
      <div className="font-semibold">{s}</div><div className="text-2xl font-bold">{orders.filter(o=>(o.workflowStatus||'Nouvelle')===s).length}</div>
    </button>)}</div>
    <div className="flex items-center gap-3"><select className="border p-2 rounded-lg text-gray-800" value={stage} onChange={e=>setStage(e.target.value)}><option>Tous</option>{stages.map(s=><option key={s}>{s}</option>)}</select><span className="text-sm text-gray-500">{filtered.length} commande(s)</span></div>
    <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">{filtered.map(o=>{
      const c=clients.find(x=>x.id===o.clientId)
      return <div key={o.id} className="bg-white dark:bg-gray-800 rounded-xl p-4 min-w-0 shadow-sm border dark:border-gray-700 space-y-3">
        <div className="flex justify-between gap-2"><strong className="text-gray-800 dark:text-white">{o.orderNo || o.id}</strong><span className={'rounded-full px-2 py-1 text-xs '+colors[stages.indexOf(o.workflowStatus||'Nouvelle')<0?0:stages.indexOf(o.workflowStatus||'Nouvelle')]}>{o.workflowStatus||'Nouvelle'}</span></div>
        <div className="text-sm text-gray-600 dark:text-gray-300">{[c?.firstName,c?.lastName].filter(Boolean).join(' ')||'Client'} · {o.brand||o.productType||'Optique'}</div>
        <div className="text-sm font-semibold text-gray-800 dark:text-gray-100">{amount(o.sellPrice)} · Reste {amount(o.rest)}</div>
        <label className="block text-xs text-gray-500">Changer le statut<select className="block w-full border rounded p-2 mt-1 text-gray-800" value={o.workflowStatus||'Nouvelle'} onChange={e=>db.update('orders',o.id,{workflowStatus:e.target.value})}>{stages.map(s=><option key={s}>{s}</option>)}</select></label>
        <OrderDocuments order={o} client={c} />
      </div>
    })}</div>
    {!filtered.length && <p className="text-gray-500">Aucune commande trouvée.</p>}
  </div>
}
