import { useState } from 'react'
import LoginForm from '../components/Auth/LoginForm'
import RegisterForm from '../components/Auth/RegisterForm'

export default function AuthPage() {
  const [modo, setModo] = useState('login')

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: '#111827' }}>
      <div
        className="rounded-xl shadow-2xl p-8 w-full max-w-sm border"
        style={{ background: '#1a1a2e', borderColor: 'var(--acento-suave)' }}
      >
        <div className="text-center mb-6">
          <span className="text-4xl">📒</span>
          <h1 className="text-2xl font-bold mt-1" style={{ color: 'var(--acento)' }}>FolderNote</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--texto-suave)' }}>Tu cuaderno en el navegador</p>
        </div>

        {modo === 'login' ? (
          <LoginForm onCambiarModo={() => setModo('registro')} />
        ) : (
          <RegisterForm onCambiarModo={() => setModo('login')} />
        )}
      </div>
    </div>
  )
}
