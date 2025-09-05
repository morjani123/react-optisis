import { NavLink } from 'react-router-dom'
import { useAuth } from '../store/auth'
import { useUI } from '../store/ui'
import { Fragment } from 'react'

const sections = [
  { title: 'Général', links: [{to:'/',label:'Dashboard'}, {to:'/clients',label:'Clients'}] },
  { title: 'Ventes', links: [{to:'/orders',label:'Commandes'}, {to:'/prescriptions',label:'Ordonnances'}] },
  { title: 'Stock & Fournisseurs', links: [{to:'/suppliers',label:'Fournisseurs'}, {to:'/frames',label:'Montures'}] },
  { title: 'Produits', links: [{to:'/contacts',label:'Lentilles'}, {to:'/lens-pricing',label:'Tarifs Verres'}] },
  { title: 'Administration', links: [{to:'/users',label:'Utilisateurs'}] }
]

export default function Sidebar(){
  const logout = useAuth(s=>s.logout)
  const sidebarOpen = useUI(s=>s.sidebarOpen)
  const closeSidebar = useUI(s=>s.closeSidebar)

  return (
    <Fragment>
      {/* Overlay for small screens */}
      <div className={`fixed inset-0 bg-black/30 transition-opacity ${sidebarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`} onClick={closeSidebar} />
      <aside className={`fixed left-0 top-0 bottom-0 w-72 bg-white border-r p-4 transform transition-transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} z-40`}>
        <div className="mb-6 px-2">
          <h2 className="text-xl font-bold">OptiSIS GROUP</h2>
          <p className="text-sm text-gray-500">Gestion d'optique</p>
        </div>
        <nav className="px-2 space-y-2">
          {sections.map((s) => (
            <div key={s.title}>
              <div className="px-3 py-2 text-sm font-medium text-gray-700">{s.title}</div>
              <div className="mt-1 pl-2 space-y-1">
                {s.links.map(l => (
                  <NavLink key={l.to} to={l.to} onClick={closeSidebar} className={({isActive}) =>
                    'block px-3 py-2 rounded-md transition ' + (isActive ? 'bg-brand-50 text-brand-700' : 'hover:bg-gray-100')}>
                    {l.label}
                  </NavLink>
                ))}
              </div>
            </div>
          ))}
        </nav>
        <div className="px-4 py-4 mt-auto">
          <button onClick={logout} className="btn btn-outline w-full">Logout</button>
        </div>
      </aside>
    </Fragment>
  )
}