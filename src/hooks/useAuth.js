import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

// Expone el usuario actual y escucha cambios de sesión en tiempo real.
// `cargando` es true mientras Supabase resuelve la sesión inicial.
export function useAuth() {
  const [usuario, setUsuario] = useState(null)
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    // Leer sesión ya existente al montar (ej: el usuario recargó la página).
    supabase.auth.getSession().then(({ data }) => {
      setUsuario(data.session?.user ?? null)
      setCargando(false)
    })

    // Escuchar cambios: login, logout, expiración de token.
    const { data: listener } = supabase.auth.onAuthStateChange((_evento, session) => {
      setUsuario(session?.user ?? null)
    })

    return () => listener.subscription.unsubscribe()
  }, [])

  const cerrarSesion = () => supabase.auth.signOut()

  return { usuario, cargando, cerrarSesion }
}
