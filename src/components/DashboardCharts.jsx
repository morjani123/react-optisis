import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts'

export default function DashboardCharts({ ordersByStatus, stockPie, clientSupplierData, monthlySales = [] }) {
  return (
    <div className="space-y-6">
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
    <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm"><h3 className="font-semibold text-lg mb-4 text-gray-700 dark:text-gray-200">Ventes mensuelles (MAD)</h3><div style={{height:270}}><ResponsiveContainer width="100%" height="100%"><BarChart data={monthlySales}><CartesianGrid strokeDasharray="3 3"/><XAxis dataKey="name"/><YAxis/><Tooltip/><Bar dataKey="value" name="Ventes" fill="#2563eb" radius={[5,5,0,0]}/></BarChart></ResponsiveContainer></div></div>
    </div>
  )
}
