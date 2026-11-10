import { lazy, Suspense, useEffect, useMemo, useState } from 'react';
const DashboardCharts = lazy(() => import('../components/DashboardCharts'));
import { useDB } from '../store/db';
import { useAuth } from "../context/AuthContext";

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