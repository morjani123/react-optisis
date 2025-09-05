import { useMemo } from 'react'
import { useDB } from '../store/db'
import {
  PieChart, Pie, Cell, ResponsiveContainer,
  Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid
} from 'recharts'

export default function Dashboard() {
  const db = useDB()
  const clients = db.list('clients')
  const suppliers = db.list('suppliers') || []
  const orders = db.list('orders')
  const frames = db.list('frames')
  const contacts = db.list('contacts')
  const tarifs = db.list('lensPricing')

  // Orders by status (Pie)
  const ordersByStatus = useMemo(() => {
    const map = {}
    orders.forEach(o => {
      const s = o.paymentStatus || 'Impayé'
      map[s] = (map[s] || 0) + 1
    })
    return Object.entries(map).map(([k, v]) => ({ name: k, value: v }))
  }, [orders])

  // Stock repartition (Donut)
  const stockPie = [
    { name: 'Montures', value: frames.length, color: '#3b82f6' },
    { name: 'Lentilles', value: contacts.length, color: '#10b981' },
    { name: 'Tarifs Verres', value: tarifs.length, color: '#f59e0b' },
  ]

  // Clients vs Fournisseurs (Bar)
  const clientSupplierData = [
    { name: 'Clients', value: clients.length, color: '#6366f1' },
    { name: 'Fournisseurs', value: suppliers.length, color: '#ef4444' },
  ]

  // Summary counts (cards)
  const counts = [
    { label: 'Clients', value: clients.length, color: '#3b82f6' },
    { label: 'Commandes', value: orders.length, color: '#10b981' },
    { label: 'Montures', value: frames.length, color: '#f59e0b' },
    { label: 'Lentilles', value: contacts.length, color: '#ef4444' },
    { label: 'Tarifs Verres', value: tarifs.length, color: '#6366f1' },
  ]

  // Client summary table
  const clientSummary = useMemo(() => {
    return clients.map(c => {
      const clientOrders = orders.filter(o => o.clientId === c.id)
      const nbOrdonnances = clientOrders.filter(o => o.type === 'ordonnance').length
      const nbCommandes = clientOrders.filter(o => o.type === 'commande').length
      const totalPaid = clientOrders.filter(o => o.paymentStatus === 'Payé').length
      const totalUnpaid = clientOrders.filter(o => o.paymentStatus !== 'Payé').length

      const clientName = c.firstName && c.lastName ? `${c.firstName} ${c.lastName}` : c.name || 'Inconnu'

      return {
        id: c.id,
        name: clientName,
        nbOrdonnances,
        nbCommandes,
        totalPaid,
        totalUnpaid
      }
    })
  }, [clients, orders])

  return (
    <div className="p-6 space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-6">
        {counts.map(c => (
          <div key={c.label} className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow">
            <div className="text-sm text-gray-500 dark:text-gray-400">{c.label}</div>
            <div className="text-2xl font-bold mt-1" style={{ color: c.color }}>{c.value}</div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Commandes par statut */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow">
          <h3 className="font-semibold mb-4 text-gray-700 dark:text-gray-200">Commandes par statut</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={ordersByStatus} dataKey="value" nameKey="name" outerRadius={90} label>
                  {ordersByStatus.map((entry, idx) => (
                    <Cell key={idx} fill={['#3b82f6', '#10b981', '#f59e0b', '#ef4444'][idx % 4]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Stock repartition (Donut) */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow">
          <h3 className="font-semibold mb-4 text-gray-700 dark:text-gray-200">Répartition Stock</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={stockPie} dataKey="value" nameKey="name" outerRadius={90} innerRadius={40} label>
                  {stockPie.map((entry, idx) => (
                    <Cell key={idx} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Clients vs Fournisseurs (Bar) */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow">
          <h3 className="font-semibold mb-4 text-gray-700 dark:text-gray-200">Clients vs Fournisseurs</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={clientSupplierData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value">
                  {clientSupplierData.map((entry, idx) => (
                    <Cell key={idx} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Client Summary Table */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow">
        <h3 className="font-semibold mb-4 text-gray-700 dark:text-gray-200">Résumé Clients</h3>
        <div className="overflow-auto">
          <table className="min-w-full table-auto border-collapse">
            <thead className="bg-gray-100 dark:bg-gray-700">
              <tr>
                <th className="py-2 px-3 text-left">Client</th>
                <th className="py-2 px-3 text-left"># Ordonnances</th>
                <th className="py-2 px-3 text-left"># Commandes</th>
                <th className="py-2 px-3 text-left">Payé</th>
                <th className="py-2 px-3 text-left">Impayé</th>
              </tr>
            </thead>
            <tbody>
              {clientSummary.map(c => (
                <tr key={c.id} className="border-t hover:bg-gray-50 dark:hover:bg-gray-600">
                  <td className="py-2 px-3">{c.name}</td>
                  <td className="py-2 px-3">{c.nbOrdonnances}</td>
                  <td className="py-2 px-3">{c.nbCommandes}</td>
                  <td className="py-2 px-3">{c.totalPaid}</td>
                  <td className="py-2 px-3">{c.totalUnpaid}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
