import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../store/auth'

export default function Login(){
  const [email, setEmail] = useState('admin@example.com')
  const [password, setPassword] = useState('password')
  const [error, setError] = useState('')
  const login = useAuth(s=>s.login)
  const navigate = useNavigate()

  const submit = (e) => {
    e.preventDefault()
    const res = login({ email, password })
    if (res.ok) navigate('/')
    else setError(res.message)
  }

  return (
    <div className="min-h-screen grid place-items-center">
      <form onSubmit={submit} className="card w-full max-w-md">
        <h1 className="text-2xl font-semibold mb-4 text-center text-brand-600">OptiSIS Group - Login</h1>
        <label className="label">Email</label>
        <input className="input mb-3" value={email} onChange={e=>setEmail(e.target.value)} />
        <label className="label">Mot de passe</label>
        <input className="input mb-3" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
        {error && <div className="text-red-600 text-sm mb-3">{error}</div>}
        <button className="btn btn-primary w-full">Se connecter</button>
      </form>
    </div>
  )
}
