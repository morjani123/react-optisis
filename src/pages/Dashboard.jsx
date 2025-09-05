import { useMemo } from 'react';
import { useDB } from '../store/db';
import { useAuth } from "../context/AuthContext";
import { useNavigate } from 'react-router-dom'; // <-- 1. Zedt l'importation dyal useNavigate
import {
  PieChart, Pie, Cell, ResponsiveContainer,
  Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid
} from 'recharts';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate(); // <-- 2. Khdina l'fonction navigate

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
      const nbOrdonnances = clientOrders.filter(o => o.type === 'ordonnance').length;
      const nbCommandes = clientOrders.filter(o => o.type === 'commande').length;
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

  // 3. Drna fonction jdida l logout
  const handleLogout = async () => {
    try {
      await logout();
      navigate('/'); // <-- Mli ydir logout y'redirectih l '/'
    } catch (error) {
      console.error("Failed to log out", error);
    }
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      {/* Welcome Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
          Welcome, {user?.email}
        </h1>
        <button
          onClick={handleLogout} // <-- 4. كنعيطو ل fonction jdida hna
          className="bg-red-600 hover:bg-red-700 text-white font-semibold px-5 py-2 rounded-lg shadow-md transition duration-300 ease-in-out"
        >
          Logout
        </button>
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

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Commandes par statut */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-lg">
          <h3 className="font-semibold mb-4 text-lg text-gray-700 dark:text-gray-200">Commandes par statut</h3>
          <div style={{ height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={ordersByStatus} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                  {ordersByStatus.map((entry, idx) => (
                    <Cell key={`cell-${idx}`} fill={['#3b82f6', '#10b981', '#f59e0b', '#ef4444'][idx % 4]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Stock repartition (Donut) */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-lg">
          <h3 className="font-semibold mb-4 text-lg text-gray-700 dark:text-gray-200">Répartition Stock</h3>
          <div style={{ height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={stockPie} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={60} outerRadius={100} label>
                  {stockPie.map((entry, idx) => (
                    <Cell key={`cell-${idx}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Clients vs Fournisseurs (Bar) */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-lg">
          <h3 className="font-semibold mb-4 text-lg text-gray-700 dark:text-gray-200">Clients vs Fournisseurs</h3>
          <div style={{ height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={clientSupplierData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#8884d8">
                  {clientSupplierData.map((entry, idx) => (
                    <Cell key={`cell-${idx}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

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