import { useTema, TEMAS, FUENTES } from '../context/TemaContext'

// Header global: logo, selector de tema, selector de fuente y botón de logout.
export default function Header({ email, cerrarSesion }) {
  const { temaId, setTemaId, fuenteId, setFuenteId } = useTema()

  return (
    <header
      className="flex items-center justify-between px-6 py-2 border-b shrink-0"
      style={{ background: '#0d0d1a', borderColor: 'var(--acento-suave)' }}
    >
      {/* Logo */}
      <span className="font-bold text-base" style={{ color: 'var(--acento)' }}>
        📒 FolderNote
      </span>

      <div className="flex items-center gap-4">
        {/* Selector de color de acento */}
        <div className="flex items-center gap-1.5">
          {Object.entries(TEMAS).map(([id, t]) => (
            <button
              key={id}
              onClick={() => setTemaId(id)}
              title={t.nombre}
              className="w-5 h-5 rounded-full border-2 transition-transform hover:scale-110"
              style={{
                background: t.acento,
                borderColor: temaId === id ? '#fff' : 'transparent',
              }}
            />
          ))}
        </div>

        {/* Separador */}
        <div className="w-px h-4" style={{ background: 'var(--acento-suave)' }} />

        {/* Selector de fuente */}
        <select
          value={fuenteId}
          onChange={(e) => setFuenteId(e.target.value)}
          className="text-xs bg-transparent border rounded px-2 py-1 focus:outline-none cursor-pointer"
          style={{ borderColor: 'var(--acento-suave)', color: 'var(--texto-suave)' }}
        >
          {Object.entries(FUENTES).map(([id, f]) => (
            <option key={id} value={id} style={{ background: '#1a1a2e' }}>
              {f.nombre}
            </option>
          ))}
        </select>

        {/* Separador */}
        <div className="w-px h-4" style={{ background: 'var(--acento-suave)' }} />

        {/* Usuario y logout */}
        <span className="text-xs" style={{ color: 'var(--texto-suave)' }}>{email}</span>
        <button
          onClick={cerrarSesion}
          className="text-xs underline hover:no-underline transition-colors"
          style={{ color: 'var(--texto-suave)' }}
        >
          Salir
        </button>
      </div>
    </header>
  )
}
