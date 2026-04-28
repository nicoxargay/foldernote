import { useCarpeta } from '../../context/CarpetaContext'
import { useTema } from '../../context/TemaContext'
import Sidebar from './Sidebar'
import Sheet from '../Sheet/Sheet'
import TapaPortada from './TapaPortada'

// Carpeta principal: sidebar izquierdo + área de contenido derecha.
export default function Folder({ userId, nombreUsuario, onNombreChange }) {
  const { seccionActiva, seccionActivaId } = useCarpeta()
  const { fuente } = useTema()

  return (
    <div
      className="flex w-full max-w-6xl mx-auto rounded-xl overflow-hidden shadow-2xl"
      style={{ minHeight: '85vh', fontFamily: `var(--font-${fuente.clase.replace('font-', '')})` }}
    >
      {/* Sidebar de secciones */}
      <Sidebar />

      {/* Área principal */}
      <div className="flex-1 flex flex-col" style={{ background: '#1a1a2e' }}>
        {seccionActivaId === null ? (
          <TapaPortada nombreUsuario={nombreUsuario} onNombreChange={onNombreChange} />
        ) : seccionActiva ? (
          <Sheet
            seccion={seccionActiva}
            userId={userId}
          />
        ) : null}
      </div>
    </div>
  )
}
