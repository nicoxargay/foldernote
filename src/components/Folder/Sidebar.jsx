import { useState } from 'react'
import { useCarpeta } from '../../context/CarpetaContext'

// Sidebar izquierdo: lista de secciones con opciones de gestión.
export default function Sidebar() {
  const {
    secciones, seccionActivaId, setSeccionActivaId,
    agregarSeccion, eliminarSeccion, renombrarSeccion,
  } = useCarpeta()

  const [editandoId, setEditandoId] = useState(null)
  const [nombreEdit, setNombreEdit] = useState('')
  const [menuAbierto, setMenuAbierto] = useState(null)

  function confirmarRename(id) {
    if (nombreEdit.trim()) renombrarSeccion(id, nombreEdit.trim())
    setEditandoId(null)
  }

  function iniciarEdit(s) {
    setEditandoId(s.id)
    setNombreEdit(s.nombre)
    setMenuAbierto(null)
  }

  return (
    <div
      className="flex flex-col w-56 shrink-0 border-r"
      style={{ background: '#12122a', borderColor: 'var(--acento-suave)' }}
    >
      {/* Logo / tapa */}
      <button
        onClick={() => setSeccionActivaId(null)}
        className="px-4 py-4 text-left border-b font-bold text-sm tracking-wide transition-opacity hover:opacity-80"
        style={{ borderColor: 'var(--acento-suave)', color: 'var(--acento)' }}
      >
        📒 Mi Carpeta
      </button>

      {/* Lista de secciones */}
      <nav className="flex-1 overflow-y-auto py-2">
        {secciones.map((s) => (
          <div key={s.id} className="relative group">
            {editandoId === s.id ? (
              <div className="flex items-center px-3 py-1 gap-1">
                <input
                  autoFocus
                  value={nombreEdit}
                  onChange={(e) => setNombreEdit(e.target.value)}
                  onBlur={() => confirmarRename(s.id)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') confirmarRename(s.id)
                    if (e.key === 'Escape') setEditandoId(null)
                  }}
                  className="flex-1 bg-transparent border-b text-sm focus:outline-none"
                  style={{ borderColor: 'var(--acento)', color: 'var(--texto)' }}
                />
              </div>
            ) : (
              <button
                onClick={() => setSeccionActivaId(s.id)}
                className="w-full text-left px-4 py-2.5 text-sm transition-colors flex items-center justify-between"
                style={{
                  background: s.id === seccionActivaId ? 'var(--acento-suave)' : 'transparent',
                  color: s.id === seccionActivaId ? 'var(--acento)' : 'var(--texto-suave)',
                  borderLeft: s.id === seccionActivaId ? '3px solid var(--acento)' : '3px solid transparent',
                }}
              >
                <span className="truncate">{s.nombre}</span>

                {/* Botón de menú contextual */}
                <span
                  role="button"
                  onClick={(e) => { e.stopPropagation(); setMenuAbierto(menuAbierto === s.id ? null : s.id) }}
                  className="opacity-0 group-hover:opacity-100 ml-1 px-1 rounded hover:opacity-80 text-xs"
                  style={{ color: 'var(--texto-suave)' }}
                >
                  ···
                </span>
              </button>
            )}

            {/* Menú contextual */}
            {menuAbierto === s.id && (
              <div
                className="absolute right-2 top-8 z-20 rounded-lg shadow-xl py-1 w-44 border text-sm"
                style={{ background: '#1e1e3f', borderColor: 'var(--acento-suave)' }}
              >
                <button
                  onClick={() => iniciarEdit(s)}
                  className="w-full text-left px-3 py-1.5 hover:bg-white/10 transition-colors"
                  style={{ color: 'var(--texto)' }}
                >
                  ✏️ Renombrar
                </button>
                <button
                  onClick={() => { eliminarSeccion(s.id); setMenuAbierto(null) }}
                  className="w-full text-left px-3 py-1.5 hover:bg-red-900/30 transition-colors text-red-400 border-t"
                  style={{ borderColor: 'var(--acento-suave)' }}
                >
                  🗑 Eliminar
                </button>
              </div>
            )}
          </div>
        ))}
      </nav>

      {/* Botón agregar sección */}
      <button
        onClick={agregarSeccion}
        className="mx-3 mb-4 py-2 rounded-lg text-sm font-medium border transition-colors hover:opacity-80"
        style={{ borderColor: 'var(--acento)', color: 'var(--acento)' }}
      >
        + Nueva sección
      </button>
    </div>
  )
}
