import { NavLink } from 'react-router-dom'
import { useAuth } from '../store/auth'
import { useState } from 'react'

const items = [
  { label: 'Dashboard', to: '/', roles: ['Admin','Employé'] },
  { label: 'Clients', to: '/clients', roles: ['Admin','Employé'] },
  { label: 'Commandes', to: '/orders', roles: ['Admin','Employé'] },
  { label: 'Ordonnances', to: '/prescriptions', roles: ['Admin','Employé'] },
  { label: 'Fournisseurs', to: '/suppliers', roles: ['Admin','Employé']  },
  { label: 'Montures', to: '/frames', roles: ['Admin','Employé']  },
  { label: 'Lentilles', to: '/contacts', roles: ['Admin','Employé']  },
  { label: 'Tarifs Verres', to: '/lens-pricing', roles: ['Admin','Employé']  },
 // { label: 'Utilisateurs', to: '/users', roles: ['Admin','Employé']  },
]

export default function TopNav(){
  const user = useAuth(s=>s.user) || { role: 'Employé' }
  const visible = items.filter(i => i.roles.includes(user.role))
  const [open, setOpen] = useState(false)

  return (
    <nav className="bg-white dark:bg-brand-800 border-b dark:border-gray-700 sticky top-16 z-20 transition-colors">
      <div className="max-w-screen-2xl mx-auto px-4">
        {/* Mobile button */}
        <div className="sm:hidden flex justify-between items-center py-2">
          <span className="text-gray-800 dark:text-white font-medium">Menu</span>
          <button onClick={()=>setOpen(!open)} className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700">
            <svg className="w-6 h-6 text-gray-800 dark:text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16"/>
            </svg>
          </button>
        </div>

        {/* Menu items */}
        <div className={(open ? 'block' : 'hidden') + " sm:flex gap-2 overflow-x-auto no-scrollbar py-2"}>
          {visible.map(i => (
            <NavLink
              key={i.to}
              to={i.to}
              end={i.to === '/'}
              className={({isActive})=>
                'px-3 py-1.5 rounded-full text-sm whitespace-nowrap transition ' +
                (isActive ? 'bg-brand-100 text-brand-700 dark:bg-brand-600 dark:text-white border border-brand-200 dark:border-brand-500' : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200')
              }
            >
              {i.label}
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  )
}