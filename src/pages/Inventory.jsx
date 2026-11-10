import { useMemo, useState } from 'react'
import { useDB } from '../store/db'

export default function Inventory() {
  const db=useDB()
  const [q,setQ]=useState('')
  const [onlyLow,setOnlyLow]=useState(false)
  const products=useMemo(()=>[
    ...db.list('frames').map(p=>({...p,category:'Monture'})),
    ...db.list('contacts').map(p=>({...p,category:'Lentille'}))
  ],[db.data])
  const low=products.filter(p=>Number(p.quantity||0)<=Number(p.minStock||0))
  const shown=products.filter(p=>(!onlyLow || Number(p.quantity||0)<=Number(p.minStock||0))&&[p.ref,p.brand,p.category].join(' ').toLowerCase().includes(q.toLowerCase()))
  const change=(p,amount)=>{
    const col=p.category==='Monture'?'frames':'contacts'
    const current=Number(p.quantity)||0
    if(current+amount<0)return
    db.update(col,p.id,{quantity:current+amount})
  }
  return <div className="p-3 sm:p-6 min-w-0 overflow-x-hidden bg-gray-50 dark:bg-gray-900 min-h-screen space-y-5">
    <div><h1 className="text-2xl font-bold text-gray-800 dark:text-white">Gestion de Stock</h1><p className="text-sm text-gray-500">Entrées, sorties, seuils et alertes · démonstration locale</p></div>
    <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">{[['Références',products.length],['Unités disponibles',products.reduce((a,p)=>a+(Number(p.quantity)||0),0)],['Sous stock minimum',low.length]].map(([k,v])=><div key={k} className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm"><div className="text-sm text-gray-500">{k}</div><div className="text-3xl font-bold text-blue-600">{v}</div></div>)}</div>
    <div className="flex flex-wrap items-center gap-4"><input className="border rounded-lg p-2 w-full sm:w-80" value={q} onChange={e=>setQ(e.target.value)} placeholder="Rechercher marque ou référence…" /><label className="text-sm text-gray-700 dark:text-gray-200 flex gap-2"><input type="checkbox" checked={onlyLow} onChange={e=>setOnlyLow(e.target.checked)}/> Alertes uniquement</label></div>
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-x-auto"><table className="min-w-full text-sm"><thead className="bg-gray-100 dark:bg-gray-700"><tr>{['Article','Référence','Stock','Minimum','Statut','Mouvements'].map(x=><th key={x} className="p-3 text-left">{x}</th>)}</tr></thead><tbody>{shown.map(p=>{const warning=Number(p.quantity||0)<=Number(p.minStock||0);return <tr key={p.category+p.id} className="border-t dark:border-gray-700"><td className="p-3">{p.brand||p.subBrand||p.category}</td><td className="p-3">{p.ref||p.category}</td><td className="p-3 font-semibold">{p.quantity??0}</td><td className="p-3">{p.minStock??0}</td><td className="p-3"><span className={'rounded-full px-2 py-1 '+(warning?'bg-red-100 text-red-700':'bg-green-100 text-green-700')}>{warning?'À réapprovisionner':'Disponible'}</span></td><td className="p-3"><div className="flex gap-2"><button aria-label="Sortie stock" className="bg-gray-100 text-gray-800 rounded px-3 py-1" onClick={()=>change(p,-1)}>−</button><button aria-label="Entrée stock" className="bg-blue-600 text-white rounded px-3 py-1" onClick={()=>change(p,1)}>+</button></div></td></tr>})}</tbody></table></div>
    <p className="text-xs text-gray-500">Les commandes marquées « Livrée » ajustent automatiquement le stock lorsqu'une référence correspond. Les mouvements manuels modifient le stock local de démonstration.</p>
  </div>
}
