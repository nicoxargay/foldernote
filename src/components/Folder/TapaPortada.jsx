import { useState } from 'react'
import { useTema } from '../../context/TemaContext'

// Tapa de la carpeta: se muestra cuando no hay sección activa.
// Permite editar el nombre del usuario en la portada.
export default function TapaPortada({ nombreUsuario, onNombreChange }) {
  const { fuente } = useTema()
  const [editando, setEditando] = useState(false)
  const [nombreTemp, setNombreTemp] = useState(nombreUsuario)

  function confirmar() {
    if (nombreTemp.trim()) onNombreChange(nombreTemp.trim())
    setEditando(false)
  }

  const estiloFuente = { fontFamily: `var(--font-${fuente.clase.replace('font-', '')})` }

  return (
    <div
      className="flex-1 flex flex-col items-center justify-center gap-6 px-8"
      style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)' }}
    >
      {/* Decoración de tapa */}
      <div
        className="w-full max-w-md rounded-2xl border-2 p-10 flex flex-col items-center gap-4 shadow-2xl"
        style={{ borderColor: 'var(--acento)', background: 'rgba(0,0,0,0.3)' }}
      >
        <span className="text-5xl">📒</span>

        <p className="text-sm uppercase tracking-widest" style={{ color: 'var(--texto-suave)' }}>
          Carpeta de
        </p>

        {editando ? (
          <div className="flex flex-col items-center gap-2 w-full">
            <input
              autoFocus
              value={nombreTemp}
              onChange={(e) => setNombreTemp(e.target.value)}
              onBlur={confirmar}
              onKeyDown={(e) => { if (e.key === 'Enter') confirmar(); if (e.key === 'Escape') setEditando(false) }}
              className="text-center text-2xl bg-transparent border-b-2 w-full focus:outline-none pb-1"
              style={{ ...estiloFuente, borderColor: 'var(--acento)', color: 'var(--texto)' }}
            />
          </div>
        ) : (
          <button
            onClick={() => { setNombreTemp(nombreUsuario); setEditando(true) }}
            className="text-3xl font-bold text-center hover:opacity-80 transition-opacity group flex items-center gap-2"
            style={{ ...estiloFuente, color: 'var(--acento)' }}
          >
            {nombreUsuario}
            <span className="text-sm opacity-0 group-hover:opacity-60 transition-opacity" style={{ color: 'var(--texto-suave)' }}>✏️</span>
          </button>
        )}

        <p className="text-xs mt-2" style={{ color: 'var(--texto-suave)' }}>
          Elegí una sección en el panel izquierdo para empezar a escribir
        </p>
      </div>
    </div>
  )
}
