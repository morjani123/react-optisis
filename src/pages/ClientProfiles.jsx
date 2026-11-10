import { useMemo, useState } from 'react'
import { useDB } from '../store/db'
import { jsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable'

const money = n => (Number(n)||0).toLocaleString('fr-FR')+' MAD'

export default function ClientProfiles() {
  const db=useDB()
  const clients=db.list('clients')
  const orders=db.list('orders')
  const prescriptions=db.list('prescriptions')
  const [search,setSearch]=useState('')
  const [selected,setSelected]=useState('')
  const matches=useMemo(()=>clients.filter(c=>[c.firstName,c.lastName,c.phone].join(' ').toLowerCase().includes(search.toLowerCase())),[clients,search])
  const client=clients.find(c=>c.id===selected)||matches[0]
  const history=client?orders.filter(o=>o.clientId===client.id):[]
  const exams=client?prescriptions.filter(p=>p.clientId===client.id):[]
  const paid=history.reduce((a,o)=>a+(Number(o.deposit)||0),0)
  const due=history.reduce((a,o)=>a+Math.max(0,(Number(o.sellPrice)||0)-(Number(o.deposit)||0)),0)
  const exportPDF=()=>{
    if(!client)return
    const pdf=new jsPDF()
    pdf.setFontSize(18);pdf.text('FICHE CLIENT - OPTISIS DEMO',14,20)
    pdf.setFontSize(10);pdf.text('Informations fictives - document de demonstration',14,28)
    pdf.text('Client : '+[client.firstName,client.lastName].join(' '),14,42)
    pdf.text('Telephone : '+(client.phone||'-'),14,50)
    pdf.text('Commandes : '+history.length+' | Ordonnances : '+exams.length,14,58)
    pdf.text('Versements : '+money(paid)+' | Reste : '+money(due),14,66)
    autoTable(pdf,{startY:78,head:[['Commande','Date','Produit','Montant','Verse']],body:history.map(o=>[o.orderNo||'-',o.orderDate||'-',o.productType||'-',money(o.sellPrice),money(o.deposit)])})
    pdf.save('fiche-client-demo.pdf')
  }
  return <div className="p-4 sm:p-6 bg-gray-50 dark:bg-gray-900 min-h-screen space-y-5">
    <div><h1 className="text-2xl font-bold text-gray-800 dark:text-white">Fiche Client 360°</h1><p className="text-gray-500 text-sm">Achats, paiements et ordonnances au même endroit</p></div>
    <input value={search} onChange={e=>{setSearch(e.target.value);setSelected('')}} placeholder="Rechercher un client…" className="border p-3 rounded-lg w-full max-w-lg" />
    <div className="grid lg:grid-cols-[270px_1fr] gap-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-3 max-h-[480px] overflow-auto space-y-1">{matches.map(c=><button key={c.id} onClick={()=>setSelected(c.id)} className={'w-full text-left rounded-lg p-3 text-sm '+(client?.id===c.id?'bg-blue-100 text-blue-900':'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700')}>{c.firstName} {c.lastName}<div className="text-xs opacity-70">{c.phone}</div></button>)}</div>
      {client?<div className="space-y-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-5 flex flex-wrap items-center justify-between gap-3"><div><h2 className="text-xl font-bold text-gray-800 dark:text-white">{client.firstName} {client.lastName}</h2><p className="text-sm text-gray-500">{client.phone} · {client.address}</p></div><button onClick={exportPDF} className="bg-blue-600 text-white px-4 py-2 rounded-lg">Exporter fiche PDF</button></div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">{[['Commandes',history.length],['Ordonnances',exams.length],['Encaissé',money(paid)],['Reste à payer',money(due)]].map(([k,v])=><div key={k} className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm"><div className="text-sm text-gray-500">{k}</div><strong className="text-xl text-blue-600">{v}</strong></div>)}</div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm"><h3 className="font-bold mb-3">Historique des commandes</h3><div className="overflow-x-auto"><table className="w-full text-sm"><thead><tr className="text-left border-b">{['Référence','Date','Produit','Montant','Paiement'].map(x=><th key={x} className="p-2">{x}</th>)}</tr></thead><tbody>{history.map(o=><tr key={o.id} className="border-b"><td className="p-2">{o.orderNo}</td><td className="p-2">{o.orderDate}</td><td className="p-2">{o.productType}</td><td className="p-2">{money(o.sellPrice)}</td><td className="p-2">{o.paymentStatus}</td></tr>)}</tbody></table></div></div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm"><h3 className="font-bold mb-2">Ordonnances ({exams.length})</h3>{exams.map(p=><p className="text-sm py-2 border-b" key={p.id}>{p.visitDate} · OD {p.odSph} / {p.odCyl} · OG {p.ogSph} / {p.ogCyl} · {p.correctionType}</p>)}</div>
      </div>:<p className="text-gray-500">Sélectionnez un client.</p>}
    </div>
  </div>
}
