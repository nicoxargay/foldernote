import { useState, useRef, useCallback, useEffect } from 'react'
import { useCarpeta } from '../../context/CarpetaContext'
import { useTema } from '../../context/TemaContext'
import { useNotes } from '../../hooks/useNotes'
import DrawingCanvas from '../Canvas/DrawingCanvas'

const LINEAS_POR_HOJA = 20
const ALTURA_LINEA = 36

// ── Barra de formato ──────────────────────────────────────────────────────────
// Aplica formato usando execCommand sobre la selección del contenteditable.
// Incluye: título, subtítulo, negrita, cursiva, subrayado, resaltado, color de texto.

const RESALTADOS = [
  { color: 'transparent', label: 'Sin resaltado', border: '#888' },
  { color: '#fde68a', label: 'Amarillo' },
  { color: '#bbf7d0', label: 'Verde' },
  { color: '#bfdbfe', label: 'Azul' },
  { color: '#fecaca', label: 'Rojo' },
]

const COLORES_TEXTO = [
  { color: '#1e1e1e', label: 'Negro' },
  { color: '#1d4ed8', label: 'Azul' },
  { color: '#dc2626', label: 'Rojo' },
  { color: '#16a34a', label: 'Verde' },
  { color: '#7c3aed', label: 'Violeta' },
]

function BarraFormato({ editorRef }) {
  const [menuResaltado, setMenuResaltado] = useState(false)
  const [menuColor, setMenuColor] = useState(false)

  function cmd(comando, valor) {
    editorRef.current?.focus()
    document.execCommand(comando, false, valor)
  }

  function aplicarTitulo(tag) {
    editorRef.current?.focus()
    document.execCommand('formatBlock', false, tag)
  }

  const btnBase = 'px-2 py-1 rounded text-xs font-medium transition-colors hover:opacity-80 border'
  const btnStyle = { borderColor: 'var(--acento-suave)', color: 'var(--texto-suave)', background: 'transparent' }

  return (
    <div
      className="flex items-center gap-1.5 px-3 py-1.5 border-b flex-wrap"
      style={{ background: '#12122a', borderColor: 'var(--acento-suave)' }}
    >
      {/* Bloques de texto */}
      <button className={btnBase} style={btnStyle} onClick={() => aplicarTitulo('h1')}
        title="Título">
        <span className="font-bold text-sm">T1</span>
      </button>
      <button className={btnBase} style={btnStyle} onClick={() => aplicarTitulo('h2')}
        title="Subtítulo">
        <span className="font-semibold">T2</span>
      </button>
      <button className={btnBase} style={btnStyle} onClick={() => aplicarTitulo('p')}
        title="Párrafo normal">
        P
      </button>

      <div className="w-px h-4" style={{ background: 'var(--acento-suave)' }} />

      {/* Formato inline */}
      <button className={btnBase} style={btnStyle} onClick={() => cmd('bold')} title="Negrita">
        <strong>B</strong>
      </button>
      <button className={btnBase} style={btnStyle} onClick={() => cmd('italic')} title="Cursiva">
        <em>I</em>
      </button>
      <button className={btnBase} style={btnStyle} onClick={() => cmd('underline')} title="Subrayado">
        <u>U</u>
      </button>
      <button className={btnBase} style={btnStyle} onClick={() => cmd('strikeThrough')} title="Tachado">
        <s>S</s>
      </button>

      <div className="w-px h-4" style={{ background: 'var(--acento-suave)' }} />

      {/* Resaltado estilo marcador */}
      <div className="relative">
        <button
          className={btnBase}
          style={btnStyle}
          title="Resaltado"
          onClick={() => { setMenuResaltado(!menuResaltado); setMenuColor(false) }}
        >
          🖊 <span className="text-xs">▾</span>
        </button>
        {menuResaltado && (
          <div
            className="absolute top-8 left-0 z-20 flex gap-1.5 p-2 rounded-lg border shadow-xl"
            style={{ background: '#1a1a2e', borderColor: 'var(--acento-suave)' }}
          >
            {RESALTADOS.map((r) => (
              <button
                key={r.color}
                title={r.label}
                onClick={() => { cmd('hiliteColor', r.color); setMenuResaltado(false) }}
                className="w-5 h-5 rounded border"
                style={{ background: r.color, borderColor: r.border ?? r.color }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Color de texto */}
      <div className="relative">
        <button
          className={btnBase}
          style={btnStyle}
          title="Color de texto"
          onClick={() => { setMenuColor(!menuColor); setMenuResaltado(false) }}
        >
          A <span className="text-xs">▾</span>
        </button>
        {menuColor && (
          <div
            className="absolute top-8 left-0 z-20 flex gap-1.5 p-2 rounded-lg border shadow-xl"
            style={{ background: '#1a1a2e', borderColor: 'var(--acento-suave)' }}
          >
            {COLORES_TEXTO.map((c) => (
              <button
                key={c.color}
                title={c.label}
                onClick={() => { cmd('foreColor', c.color); setMenuColor(false) }}
                className="w-5 h-5 rounded-full border border-white/20"
                style={{ background: c.color }}
              />
            ))}
          </div>
        )}
      </div>

      <div className="w-px h-4" style={{ background: 'var(--acento-suave)' }} />

      {/* Listas */}
      <button className={btnBase} style={btnStyle} onClick={() => cmd('insertUnorderedList')} title="Lista">
        ≡
      </button>
      <button className={btnBase} style={btnStyle} onClick={() => cmd('insertOrderedList')} title="Lista numerada">
        1.
      </button>
    </div>
  )
}

// ── HojaContenido ─────────────────────────────────────────────────────────────
function HojaContenido({ seccion, hoja, userId }) {
  const { actualizarContenido, cambiarTipoHoja, guardarCanvasHoja } = useCarpeta()
  const { fuente } = useTema()
  const [mododibujo, setMododibujo] = useState(false)
  const editorRef = useRef(null)

  useNotes(userId, `${seccion.id}__${hoja.id}`, hoja.contenido, (nuevoContenido) => {
    actualizarContenido(seccion.id, hoja.id, nuevoContenido)
  })

  const alturaHoja = LINEAS_POR_HOJA * ALTURA_LINEA

  const estiloFondo =
    hoja.tipo === 'cuadriculado'
      ? {
          backgroundImage:
            'linear-gradient(rgba(150,180,220,0.25) 1px, transparent 1px), linear-gradient(90deg, rgba(150,180,220,0.25) 1px, transparent 1px)',
          backgroundSize: `${ALTURA_LINEA}px ${ALTURA_LINEA}px`,
        }
      : {
          backgroundImage: 'linear-gradient(rgba(150,180,220,0.25) 1px, transparent 1px)',
          backgroundSize: `100% ${ALTURA_LINEA}px`,
          backgroundPositionY: `${ALTURA_LINEA - 1}px`,
        }

  const onGuardarCanvas = useCallback(
    (data) => guardarCanvasHoja(seccion.id, hoja.id, data),
    [seccion.id, hoja.id, guardarCanvasHoja]
  )

  // Sincroniza el contenteditable → contexto al escribir.
  function onInput() {
    const html = editorRef.current?.innerHTML ?? ''
    actualizarContenido(seccion.id, hoja.id, html)
  }

  // Inicializa el editor la primera vez que el elemento monta.
  function initEditor(el) {
    if (!el || editorRef.current === el) return
    editorRef.current = el
    el.innerHTML = hoja.contenido
  }

  // Sincroniza el HTML cuando el contenido cambia desde afuera (carga Supabase,
  // cambio de tipo de hoja, etc.) sin pisar lo que el usuario está escribiendo.
  const ultimoContenidoRef = useRef(hoja.contenido)
  useEffect(() => {
    const el = editorRef.current
    if (!el) return
    // Solo actualiza si el cambio vino de afuera (no del propio onInput).
    if (hoja.contenido !== ultimoContenidoRef.current && hoja.contenido !== el.innerHTML) {
      el.innerHTML = hoja.contenido
    }
    ultimoContenidoRef.current = hoja.contenido
  }, [hoja.contenido])

  return (
    <div className="flex flex-col">
      {/* Barra de modo */}
      <div
        className="flex items-center gap-2 px-4 py-2 border-b"
        style={{ background: '#12122a', borderColor: 'var(--acento-suave)' }}
      >
        {[{ id: false, label: '✏️ Teclado' }, { id: true, label: '🖊️ Dibujo' }].map((m) => (
          <button
            key={String(m.id)}
            onClick={() => setMododibujo(m.id)}
            className="px-3 py-1 rounded text-sm font-medium transition-colors"
            style={{
              background: mododibujo === m.id ? 'var(--acento)' : 'transparent',
              color: mododibujo === m.id ? '#000' : 'var(--texto-suave)',
            }}
          >
            {m.label}
          </button>
        ))}

        <div className="w-px h-4 mx-1" style={{ background: 'var(--acento-suave)' }} />

        {/* Tipo de hoja */}
        {['rayado', 'cuadriculado'].map((tipo) => (
          <button
            key={tipo}
            onClick={() => cambiarTipoHoja(seccion.id, hoja.id, tipo)}
            className="px-2 py-0.5 rounded border text-xs transition-colors"
            style={{
              borderColor: 'var(--acento)',
              background: hoja.tipo === tipo ? 'var(--acento)' : 'transparent',
              color: hoja.tipo === tipo ? '#000' : 'var(--texto-suave)',
            }}
          >
            {tipo === 'rayado' ? '≡ Rayado' : '⊞ Cuad.'}
          </button>
        ))}
      </div>

      {/* Barra de formato (solo en modo teclado) */}
      {!mododibujo && <BarraFormato editorRef={editorRef} />}

      {/* Hoja */}
      <div
        className="relative w-full overflow-hidden"
        style={{ height: alturaHoja, background: '#f8f4e8', ...estiloFondo }}
      >
        <div className="absolute top-0 left-14 bottom-0 w-px bg-red-300 opacity-50" />

        {/* Editor de texto enriquecido */}
        <div
          ref={initEditor}
          contentEditable={!mododibujo}
          suppressContentEditableWarning
          onInput={onInput}
          className="absolute inset-0 w-full h-full pl-16 pr-6 pt-1 text-gray-800 focus:outline-none overflow-hidden"
          style={{
            lineHeight: `${ALTURA_LINEA}px`,
            fontSize: '1.1rem',
            fontFamily: `var(--font-${fuente.clase.replace('font-', '')})`,
            pointerEvents: mododibujo ? 'none' : 'auto',
          }}
          data-placeholder="Escribí acá..."
        />

        <DrawingCanvas
          activo={mododibujo}
          canvasData={hoja.canvasData}
          onGuardar={onGuardarCanvas}
        />
      </div>
    </div>
  )
}

// ── Sheet (contenedor de hojas) ───────────────────────────────────────────────
export default function Sheet({ seccion, userId }) {
  const { agregarHoja, irAHoja } = useCarpeta()
  const { fuente } = useTema()

  const idx = seccion.hojaActivaIdx
  const total = seccion.hojas.length
  const hojaActual = seccion.hojas[idx]

  return (
    <div className="flex flex-col flex-1 overflow-y-auto">
      {/* Header de sección */}
      <div
        className="px-6 py-3 border-b flex items-center justify-between shrink-0"
        style={{ borderColor: 'var(--acento-suave)' }}
      >
        <h2
          className="text-lg font-semibold"
          style={{ color: 'var(--acento)', fontFamily: `var(--font-${fuente.clase.replace('font-', '')})` }}
        >
          {seccion.nombre}
        </h2>

        <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--texto-suave)' }}>
          <button
            onClick={() => irAHoja(seccion.id, idx - 1)}
            disabled={idx === 0}
            className="px-2 py-0.5 rounded disabled:opacity-30 hover:opacity-70 transition-opacity"
            style={{ color: 'var(--acento)' }}
          >
            ←
          </button>
          <span>Hoja {idx + 1} / {total}</span>
          <button
            onClick={() => irAHoja(seccion.id, idx + 1)}
            disabled={idx === total - 1}
            className="px-2 py-0.5 rounded disabled:opacity-30 hover:opacity-70 transition-opacity"
            style={{ color: 'var(--acento)' }}
          >
            →
          </button>
          <button
            onClick={() => agregarHoja(seccion.id)}
            className="ml-2 px-3 py-0.5 rounded border text-xs transition-colors hover:opacity-80"
            style={{ borderColor: 'var(--acento)', color: 'var(--acento)' }}
          >
            + Hoja
          </button>
        </div>
      </div>

      {/* Hoja activa — key fuerza remontaje al cambiar de hoja, aislando el canvas */}
      {hojaActual && (
        <HojaContenido
          key={`${seccion.id}-${hojaActual.id}`}
          seccion={seccion}
          hoja={hojaActual}
          userId={userId}
        />
      )}
    </div>
  )
}
