import { useState } from 'react'
import { jsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable'

const money = n => (Number(n) || 0).toLocaleString('fr-FR', {minimumFractionDigits:2,maximumFractionDigits:2}) + ' MAD'

export default function OrderDocuments({ order, client }) {
  const [kind, setKind] = useState('Facture')
  const [vat, setVat] = useState(20)
  const [discount, setDiscount] = useState(0)

  const generate = () => {
    const doc = new jsPDF()
    const gross = Math.max(0, Number(order.sellPrice) || 0)
    const rebate = gross * Math.min(100, Math.max(0, Number(discount)||0)) / 100
    const net = gross - rebate
    // Demo assumption: entered sale price is excluding VAT.
    const tax = net * Math.min(100, Math.max(0, Number(vat)||0)) / 100
    const total = net + tax
    const paid = kind === 'Facture' ? Math.max(0, Number(order.deposit)||0) : 0
    doc.setFillColor(17, 43, 89); doc.rect(0, 0, 210, 38, 'F')
    doc.setTextColor(255,255,255);doc.setFontSize(21);doc.text('OPTISIS GROUP',14,19)
    doc.setFontSize(10);doc.text('DOCUMENT DE DEMONSTRATION - SANS VALEUR COMMERCIALE',14,29)
    doc.setTextColor(25,40,70);doc.setFontSize(18);doc.text(kind.toUpperCase(),14,55)
    doc.setFontSize(10)
    doc.text('Reference : '+String(order.orderNo || order.id).slice(0,40),14,65)
    doc.text('Date : '+new Date().toLocaleDateString('fr-FR'),14,72)
    doc.text('Client : '+(client ? [client.firstName,client.lastName].filter(Boolean).join(' ') : 'Client demo'),14,85)
    doc.text('Adresse : '+String(client?.address || 'Non renseignee').slice(0,75),14,92)
    autoTable(doc,{
      startY:105,
      head:[['Description','Qte','Prix HT','Total HT']],
      body:[[String([order.productType,order.brand,order.ref].filter(Boolean).join(' / ')).slice(0,65),String(order.quantity || 1),money(gross),money(gross)]],
      theme:'striped',headStyles:{fillColor:[17,43,89]}
    })
    let y = (doc.lastAutoTable?.finalY || 140)+13
    ;[['Sous-total HT',gross],['Remise',-rebate],['TVA ('+vat+' %)',tax],['TOTAL TTC',total],...(kind==='Facture'?[['Versement enregistre',paid],['Reste TTC (indicatif)',Math.max(0,total-paid)]]:[])].forEach(([label,value])=>{
      doc.text(label,120,y);doc.text(money(value),195,y,{align:'right'});y+=9
    })
    doc.setFontSize(9);doc.setTextColor(110,120,135)
    doc.text('Simulation uniquement. TVA et remise applicables a ce document de demonstration.',14,275)
    doc.save(kind.toLowerCase()+'-'+String(order.orderNo || 'demo').replace(/[^a-zA-Z0-9-]/g,'')+'.pdf')
  }
  return (
    <div className="flex flex-wrap gap-2 items-center mt-2 text-sm">
      <select aria-label="Type document" value={kind} onChange={e=>setKind(e.target.value)} className="border rounded px-2 py-1 bg-white text-gray-800">
        <option>Facture</option><option>Devis</option>
      </select>
      <label className="flex items-center gap-1">TVA % <input aria-label="TVA" className="w-14 border rounded p-1" type="number" min="0" max="100" value={vat} onChange={e=>setVat(e.target.value)} /></label>
      <label className="flex items-center gap-1">Remise % <input aria-label="Remise" className="w-14 border rounded p-1" type="number" min="0" max="100" value={discount} onChange={e=>setDiscount(e.target.value)} /></label>
      <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded" onClick={generate}>PDF {kind}</button>
    </div>
  )
}
