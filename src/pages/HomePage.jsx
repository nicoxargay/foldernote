import { useState } from 'react'
import { CarpetaProvider } from '../context/CarpetaContext'
import Folder from '../components/Folder/Folder'
import Header from '../components/Header'

// Deriva el nombre de display desde los metadatos de Supabase o el email.
function nombreDesdeUsuario(usuario) {
  return usuario.user_metadata?.nombre
    || usuario.user_metadata?.full_name
    || usuario.email.split('@')[0]
}

export default function HomePage({ usuario, cerrarSesion }) {
  const [nombre, setNombre] = useState(() => {
    return localStorage.getItem('fn-nombre') || nombreDesdeUsuario(usuario)
  })

  function actualizarNombre(nuevoNombre) {
    setNombre(nuevoNombre)
    localStorage.setItem('fn-nombre', nuevoNombre)
  }

  return (
    <CarpetaProvider>
      <div className="min-h-screen flex flex-col" style={{ background: '#111827' }}>
        <Header email={usuario.email} cerrarSesion={cerrarSesion} />

        <main className="flex-1 flex items-start justify-center py-8 px-4">
          <Folder
            userId={usuario.id}
            nombreUsuario={nombre}
            onNombreChange={actualizarNombre}
          />
        </main>
      </div>
    </CarpetaProvider>
  )
}
