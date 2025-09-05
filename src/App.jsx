import { Routes, Route, useNavigate } from 'react-router-dom'
import ProtectedRoute from './components/ProtectedRoute'
import TopNav from './components/TopNav'
import Topbar from './components/Topbar'

import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import ResourcePage from './pages/ResourcePage'

import clients from './schemas/clients'
import users from './schemas/users'
import prescriptions from './schemas/prescriptions'
import orders from './schemas/orders'
import suppliers from './schemas/suppliers'
import frames from './schemas/frames'
import contacts from './schemas/contacts'
import lensPricing from './schemas/lensPricing'

import AddItemModal from './components/AddItemModal'
import { useState } from 'react'

function Layout({ children, onAddClick }) {
  return (
    <div className="flex">
      <div className="flex-1 min-h-screen bg-gray-50">
        <Topbar onAddClick={onAddClick} />
        <TopNav />
        {children}
      </div>
    </div>
  )
}

export default function App() {
  const navigate = useNavigate()
  const [addOpen, setAddOpen] = useState(false)
  const [selectedType, setSelectedType] = useState(null)

  const handleAddSelect = (type) => {
    setSelectedType(type)
    setAddOpen(false)

    // navigate to the right page
    switch(type) {
      case 'clients': navigate('/clients'); break
      case 'users': navigate('/users'); break
      case 'orders': navigate('/orders'); break
      case 'prescriptions': navigate('/prescriptions'); break
      case 'suppliers': navigate('/suppliers'); break
      case 'frames': navigate('/frames'); break
      case 'contacts': navigate('/contacts'); break
      case 'lensPricing': navigate('/lens-pricing'); break
      default: break
    }
  }

  return (
    <>
      <AddItemModal open={addOpen} onClose={() => setAddOpen(false)} onSelect={handleAddSelect} />

      <Routes>
        <Route path="/login" element={<Login />} />

        <Route path="/" element={
          <ProtectedRoute>
            <Layout onAddClick={() => setAddOpen(true)}><Dashboard /></Layout>
          </ProtectedRoute>
        }/>

        <Route path="/clients" element={
          <ProtectedRoute>
            <Layout onAddClick={() => setAddOpen(true)}>
              <ResourcePage schema={clients} autoOpen={selectedType==='clients'} onClose={()=>setSelectedType(null)} />
            </Layout>
          </ProtectedRoute>
        }/>

        <Route path="/users" element={
          <ProtectedRoute>
            <Layout onAddClick={() => setAddOpen(true)}>
              <ResourcePage schema={users} autoOpen={selectedType==='users'} onClose={()=>setSelectedType(null)} />
            </Layout>
          </ProtectedRoute>
        }/>

        <Route path="/prescriptions" element={
          <ProtectedRoute>
            <Layout onAddClick={() => setAddOpen(true)}>
              <ResourcePage schema={prescriptions} autoOpen={selectedType==='prescriptions'} onClose={()=>setSelectedType(null)} />
            </Layout>
          </ProtectedRoute>
        }/>

        <Route path="/orders" element={
          <ProtectedRoute>
            <Layout onAddClick={() => setAddOpen(true)}>
              <ResourcePage schema={orders} autoOpen={selectedType==='orders'} onClose={()=>setSelectedType(null)} />
            </Layout>
          </ProtectedRoute>
        }/>

        <Route path="/suppliers" element={
          <ProtectedRoute>
            <Layout onAddClick={() => setAddOpen(true)}>
              <ResourcePage schema={suppliers} autoOpen={selectedType==='suppliers'} onClose={()=>setSelectedType(null)} />
            </Layout>
          </ProtectedRoute>
        }/>

        <Route path="/frames" element={
          <ProtectedRoute>
            <Layout onAddClick={() => setAddOpen(true)}>
              <ResourcePage schema={frames} autoOpen={selectedType==='frames'} onClose={()=>setSelectedType(null)} />
            </Layout>
          </ProtectedRoute>
        }/>

        <Route path="/contacts" element={
          <ProtectedRoute>
            <Layout onAddClick={() => setAddOpen(true)}>
              <ResourcePage schema={contacts} autoOpen={selectedType==='contacts'} onClose={()=>setSelectedType(null)} />
            </Layout>
          </ProtectedRoute>
        }/>

        <Route path="/lens-pricing" element={
          <ProtectedRoute>
            <Layout onAddClick={() => setAddOpen(true)}>
              <ResourcePage schema={lensPricing} autoOpen={selectedType==='lensPricing'} onClose={()=>setSelectedType(null)} />
            </Layout>
          </ProtectedRoute>
        }/>
      </Routes>
    </>
  )
}
