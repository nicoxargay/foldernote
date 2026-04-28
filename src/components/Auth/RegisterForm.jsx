import { useState } from 'react'
import { supabase } from '../../lib/supabase'

export default function RegisterForm({ onCambiarModo }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [exito, setExito] = useState(false)
  const [cargando, setCargando] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setCargando(true)
    const { error } = await supabase.auth.signUp({ email, password })
    if (error) setError(error.message)
    else setExito(true)
    setCargando(false)
  }

  const inputClass = 'w-full bg-transparent border rounded px-3 py-2 text-sm focus:outline-none'

  if (exito) {
    return (
      <div className="flex flex-col gap-4 text-center">
        <span className="text-3xl">✉️</span>
        <h2 className="font-bold" style={{ color: 'var(--texto)' }}>¡Cuenta creada!</h2>
        <p className="text-xs" style={{ color: 'var(--texto-suave)' }}>
          Revisá tu email para confirmar la cuenta y después iniciá sesión.
        </p>
        <button
          onClick={onCambiarModo}
          className="py-2 rounded font-semibold text-sm hover:opacity-90"
          style={{ background: 'var(--acento)', color: '#000' }}
        >
          Ir al login
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <h2 className="text-lg font-bold" style={{ color: 'var(--texto)' }}>Crear cuenta</h2>

      <div className="flex flex-col gap-1">
        <label className="text-xs" style={{ color: 'var(--texto-suave)' }}>Email</label>
        <input
          type="email" required value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={inputClass}
          style={{ borderColor: 'var(--acento-suave)', color: 'var(--texto)' }}
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs" style={{ color: 'var(--texto-suave)' }}>Contraseña</label>
        <input
          type="password" required minLength={6} value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={inputClass}
          style={{ borderColor: 'var(--acento-suave)', color: 'var(--texto)' }}
        />
        <span className="text-xs" style={{ color: 'var(--texto-suave)' }}>Mínimo 6 caracteres</span>
      </div>

      {error && <p className="text-red-400 text-xs">{error}</p>}

      <button
        type="submit" disabled={cargando}
        className="py-2 rounded font-semibold text-sm transition-opacity disabled:opacity-50 hover:opacity-90"
        style={{ background: 'var(--acento)', color: '#000' }}
      >
        {cargando ? 'Creando...' : 'Crear cuenta'}
      </button>

      <p className="text-xs text-center" style={{ color: 'var(--texto-suave)' }}>
        ¿Ya tenés cuenta?{' '}
        <button type="button" onClick={onCambiarModo} className="underline" style={{ color: 'var(--acento)' }}>
          Iniciá sesión
        </button>
      </p>
    </form>
  )
}
