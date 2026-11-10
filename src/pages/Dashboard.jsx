import { lazy, Suspense, useEffect, useMemo, useState } from 'react';
const DashboardCharts = lazy(() => import('../components/DashboardCharts'));
import { useDB } from '../store/db';
import { useAuth } from "../context/AuthContext";
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const { user } = useAuth();
  const [showCharts, setShowCharts] = useState(false);
  useEffect(() => {
    const timer = window.setTimeout(() => setShowCharts(true), 400);
    return () => window.clearTimeout(timer);
  }, []);

  const db = useDB();
  const clients = db.list('clients');
  const suppliers = db.list('suppliers') || [];
  const orders = db.list('orders');
  const frames = db.list('frames');
  const contacts = db.list('contacts');
  const tarifs = db.list('lensPricing');

  const totalSales = orders.reduce((sum,o)=>sum+(Number(o.sellPrice)||0),0);
  const collected = orders.reduce((sum,o)=>sum+(Number(o.deposit)||0),0);
  const outstanding = orders.reduce((sum,o)=>sum+Math.max(0,(Number(o.sellPrice)||0)-(Number(o.deposit)||0)),0);
  const grossMargin = orders.reduce((sum,o)=>sum+(Number(o.sellPrice)||0)-(Number(o.buyPrice)||0),0);
  const lowStock = [...frames,...contacts].filter(p=>p.quantity!==undefined && Number(p.quantity)<=Number(p.minStock||0)).length;
  const fmt = n => new Intl.NumberFormat('fr-FR',{maximumFractionDigits:0}).format(n)+' MAD';

  // Orders by status (Pie)
  const ordersByStatus = useMemo(() => {
    const map = {};
    orders.forEach(o => {
      const s = o.paymentStatus || 'Impayé';
      map[s] = (map[s] || 0) + 1;
    });
    return Object.entries(map).map(([k, v]) => ({ name: k, value: v }));
  }, [orders]);

  // Stock repartition (Donut)
  const stockPie = [
    { name: 'Montures', value: frames.length, color: '#3b82f6' },
    { name: 'Lentilles', value: contacts.length, color: '#10b981' },
    { name: 'Tarifs Verres', value: tarifs.length, color: '#f59e0b' },
  ];

  // Clients vs Fournisseurs (Bar)
  const clientSupplierData = [
    { name: 'Clients', value: clients.length, color: '#6366f1' },
    { name: 'Fournisseurs', value: suppliers.length, color: '#ef4444' },
  ];

  // Summary counts (cards)
  const counts = [
    { label: 'Clients', value: clients.length, color: '#3b82f6' },
    { label: 'Commandes', value: orders.length, color: '#10b981' },
    { label: 'Montures', value: frames.length, color: '#f59e0b' },
    { label: 'Lentilles', value: contacts.length, color: '#ef4444' },
    { label: 'Tarifs Verres', value: tarifs.length, color: '#6366f1' },
  ];

  // Client summary table
  const clientSummary = useMemo(() => {
    return clients.map(c => {
      const clientOrders = orders.filter(o => o.clientId === c.id);
      const nbOrdonnances = db.list('prescriptions').filter(p => p.clientId === c.id).length;
      const nbCommandes = clientOrders.length;
      const totalPaid = clientOrders.filter(o => o.paymentStatus === 'Payé').length;
      const totalUnpaid = clientOrders.filter(o => o.paymentStatus !== 'Payé').length;

      const clientName = c.firstName && c.lastName ? `${c.firstName} ${c.lastName}` : c.name || 'Inconnu';

      return {
        id: c.id,
        name: clientName,
        nbOrdonnances,
        nbCommandes,
        totalPaid,
        totalUnpaid
      };
    });
  }, [clients, orders]);

  return (
    <div className="p-6 space-y-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      {/* Welcome Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
          Bienvenue sur OptiSIS — {user?.name}
        </h1>

      </div>

      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-5">
        {[["Chiffre d’affaires",fmt(totalSales)],["Montant encaissé",fmt(collected)],["Reste à payer",fmt(outstanding)],["Marge brute estimée",fmt(grossMargin)]].map(([label,value])=><div key={label} className="bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-5 shadow-sm border dark:border-gray-700"><div className="text-sm text-gray-500 dark:text-gray-300">{label}</div><div className="text-xl sm:text-2xl font-bold text-blue-600 mt-2">{value}</div></div>)}
      </div>
      <div className="flex flex-wrap gap-3 items-center"><Link to="/suivi-commandes" className="bg-blue-600 text-white rounded-lg px-4 py-2 text-sm">Suivi commandes</Link><Link to="/fiches-clients" className="bg-white dark:bg-gray-800 dark:text-white border rounded-lg px-4 py-2 text-sm">Fiches clients</Link><Link to="/stock" className="bg-white dark:bg-gray-800 dark:text-white border rounded-lg px-4 py-2 text-sm">Gestion Stock · {lowStock} alerte(s)</Link></div>
      <p className="text-xs text-gray-500">Données fictives · Marge brute indicative avant charges et taxes.</p>
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-6">
        {counts.map(c => (
          <div key={c.label} className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-lg transition-transform transform hover:scale-105">
            <div className="text-sm font-medium text-gray-500 dark:text-gray-400">{c.label}</div>
            <div className="text-3xl font-bold mt-2" style={{ color: c.color }}>{c.value}</div>
          </div>
        ))}
      </div>

      {/* Render charts after initial dashboard paint. */}
      {showCharts && <Suspense fallback={<div className="p-6 text-gray-500">Chargement des graphiques…</div>}><DashboardCharts ordersByStatus={ordersByStatus} stockPie={stockPie} clientSupplierData={clientSupplierData} /></Suspense>}

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4"><h3 className="text-lg font-semibold mb-3 text-gray-800 dark:text-white">Dernières commandes</h3><div className="overflow-x-auto"><table className="min-w-full text-sm"><thead><tr className="border-b text-left">{['N°','Date','Statut','Montant','Reste'].map(t=><th key={t} className="p-2">{t}</th>)}</tr></thead><tbody>{[...orders].sort((a,b)=>String(b.orderDate||'').localeCompare(String(a.orderDate||''))).slice(0,6).map(o=><tr key={o.id} className="border-b dark:border-gray-700"><td className="p-2">{o.orderNo}</td><td className="p-2">{o.orderDate}</td><td className="p-2">{o.workflowStatus||'Nouvelle'}</td><td className="p-2">{fmt(o.sellPrice)}</td><td className="p-2">{fmt(Math.max(0,(Number(o.sellPrice)||0)-(Number(o.deposit)||0)))}</td></tr>)}</tbody></table></div></div>
      {/* Client Summary Table */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-lg">
        <h3 className="font-semibold mb-4 text-lg text-gray-700 dark:text-gray-200">Résumé Clients</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto border-collapse">
            <thead className="bg-gray-100 dark:bg-gray-700">
              <tr>
                <th className="py-3 px-4 text-left font-semibold text-gray-600 dark:text-gray-300">Client</th>
                <th className="py-3 px-4 text-left font-semibold text-gray-600 dark:text-gray-300"># Ordonnances</th>
                <th className="py-3 px-4 text-left font-semibold text-gray-600 dark:text-gray-300"># Commandes</th>
                <th className="py-3 px-4 text-left font-semibold text-gray-600 dark:text-gray-300">Payé</th>
                <th className="py-3 px-4 text-left font-semibold text-gray-600 dark:text-gray-300">Impayé</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
              {clientSummary.map(c => (
                <tr key={c.id} className="hover:bg-gray-50 dark:hover:bg-gray-600">
                  <td className="py-3 px-4">{c.name}</td>
                  <td className="py-3 px-4">{c.nbOrdonnances}</td>
                  <td className="py-3 px-4">{c.nbCommandes}</td>
                  <td className="py-3 px-4 text-green-600 font-medium">{c.totalPaid}</td>
                  <td className="py-3 px-4 text-red-600 font-medium">{c.totalUnpaid}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}