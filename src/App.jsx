import { useAuth } from './hooks/useAuth'
import { TemaProvider } from './context/TemaContext'
import AuthPage from './pages/AuthPage'
import HomePage from './pages/HomePage'

export default function App() {
  const { usuario, cargando, cerrarSesion } = useAuth()

  if (cargando) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#111827' }}>
        <p className="text-sm" style={{ color: 'var(--texto-suave)' }}>Cargando...</p>
      </div>
    )
  }

  return (
    <TemaProvider>
      {usuario ? (
        <HomePage usuario={usuario} cerrarSesion={cerrarSesion} />
      ) : (
        <AuthPage />
      )}
    </TemaProvider>
  )
}
