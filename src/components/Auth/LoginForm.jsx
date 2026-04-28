import { useState } from 'react'
import { supabase } from '../../lib/supabase'

export default function LoginForm({ onCambiarModo }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [cargando, setCargando] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setCargando(true)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) setError(error.message)
    setCargando(false)
  }

  const inputClass = 'w-full bg-transparent border rounded px-3 py-2 text-sm focus:outline-none focus:ring-1'

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <h2 className="text-lg font-bold" style={{ color: 'var(--texto)' }}>Iniciar sesión</h2>

      <div className="flex flex-col gap-1">
        <label className="text-xs" style={{ color: 'var(--texto-suave)' }}>Email</label>
        <input
          type="email" required value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={inputClass}
          style={{ borderColor: 'var(--acento-suave)', color: 'var(--texto)', '--tw-ring-color': 'var(--acento)' }}
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs" style={{ color: 'var(--texto-suave)' }}>Contraseña</label>
        <input
          type="password" required value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={inputClass}
          style={{ borderColor: 'var(--acento-suave)', color: 'var(--texto)' }}
        />
      </div>

      {error && <p className="text-red-400 text-xs">{error}</p>}

      <button
        type="submit" disabled={cargando}
        className="py-2 rounded font-semibold text-sm transition-opacity disabled:opacity-50 hover:opacity-90"
        style={{ background: 'var(--acento)', color: '#000' }}
      >
        {cargando ? 'Entrando...' : 'Entrar'}
      </button>

      <p className="text-xs text-center" style={{ color: 'var(--texto-suave)' }}>
        ¿No tenés cuenta?{' '}
        <button type="button" onClick={onCambiarModo} className="underline" style={{ color: 'var(--acento)' }}>
          Registrate
        </button>
      </p>
    </form>
  )
}
