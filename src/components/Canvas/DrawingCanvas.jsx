import { useRef, useEffect, useState } from 'react'

const COLORES = [
  { id: 'negro',   valor: '#1e1e1e', label: 'Negro' },
  { id: 'azul',    valor: '#1d4ed8', label: 'Azul' },
  { id: 'rojo',    valor: '#dc2626', label: 'Rojo' },
  { id: 'verde',   valor: '#16a34a', label: 'Verde' },
  { id: 'violeta', valor: '#7c3aed', label: 'Violeta' },
]

// Un solo <canvas> siempre montado — evita que el elemento se destruya al
// alternar entre modo lápiz y modo teclado, lo que borraba el dibujo.
export default function DrawingCanvas({ activo, canvasData, onGuardar }) {
  const canvasRef = useRef(null)
  const dibujando = useRef(false)
  const ultimoPunto = useRef({ x: 0, y: 0 })
  const cargadoRef = useRef(false)

  const [herramienta, setHerramienta] = useState('lapiz')
  const [colorId, setColorId] = useState('negro')
  const [grosor, setGrosor] = useState(2)

  const colorActual = COLORES.find((c) => c.id === colorId)?.valor ?? '#1e1e1e'

  // Ajusta dimensiones y restaura el dibujo guardado solo en el montaje inicial.
  useEffect(() => {
    const canvas = canvasRef.current
    const contenedor = canvas.parentElement

    function ajustar() {
      // Preservar el dibujo actual antes de redimensionar.
      const snapshot = cargadoRef.current ? canvas.toDataURL() : null
      canvas.width = contenedor.offsetWidth
      canvas.height = contenedor.offsetHeight

      const ctx = canvas.getContext('2d')
      const src = snapshot ?? canvasData
      if (src) {
        const img = new Image()
        img.src = src
        img.onload = () => ctx.drawImage(img, 0, 0)
      }
      cargadoRef.current = true
    }

    ajustar()
    const ro = new ResizeObserver(ajustar)
    ro.observe(contenedor)
    return () => ro.disconnect()
  // Solo se ejecuta al montar — canvasData es el estado inicial de la hoja.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Al desmontar (cambio de hoja), guarda el dibujo en el contexto.
  useEffect(() => {
    return () => {
      if (canvasRef.current && onGuardar) {
        onGuardar(canvasRef.current.toDataURL())
      }
    }
  // onGuardar es un useCallback estable por hoja, no cambia.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const obtenerPunto = (e) => {
    const rect = canvasRef.current.getBoundingClientRect()
    return { x: e.clientX - rect.left, y: e.clientY - rect.top }
  }

  const iniciarTrazo = (e) => {
    if (!activo) return
    e.preventDefault()
    dibujando.current = true
    ultimoPunto.current = obtenerPunto(e)

    if (herramienta === 'lapiz') {
      const ctx = canvasRef.current.getContext('2d')
      ctx.globalCompositeOperation = 'source-over'
      ctx.beginPath()
      ctx.arc(ultimoPunto.current.x, ultimoPunto.current.y, grosor / 2, 0, Math.PI * 2)
      ctx.fillStyle = colorActual
      ctx.fill()
    }
  }

  const dibujar = (e) => {
    if (!activo || !dibujando.current) return
    e.preventDefault()

    const ctx = canvasRef.current.getContext('2d')
    const punto = obtenerPunto(e)
    const presion = e.pressure > 0 ? e.pressure : 1

    ctx.beginPath()
    ctx.moveTo(ultimoPunto.current.x, ultimoPunto.current.y)
    ctx.lineTo(punto.x, punto.y)

    if (herramienta === 'borrador') {
      ctx.globalCompositeOperation = 'destination-out'
      ctx.strokeStyle = 'rgba(0,0,0,1)'
      ctx.lineWidth = grosor * 6
    } else {
      ctx.globalCompositeOperation = 'source-over'
      ctx.strokeStyle = colorActual
      ctx.lineWidth = grosor * presion
    }

    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    ctx.stroke()

    ultimoPunto.current = punto
  }

  const terminarTrazo = () => { dibujando.current = false }

  function limpiarCanvas() {
    const c = canvasRef.current
    c.getContext('2d').clearRect(0, 0, c.width, c.height)
  }

  return (
    <>
      {/* Barra de herramientas — solo visible en modo dibujo */}
      {activo && (
        <div
          className="absolute top-2 left-1/2 -translate-x-1/2 z-10 flex items-center gap-2 px-3 py-1.5 rounded-full shadow-lg border"
          style={{ background: '#1a1a2e', borderColor: 'var(--acento-suave)' }}
        >
          {[{ id: 'lapiz', icon: '✏️' }, { id: 'borrador', icon: '⬜' }].map((h) => (
            <button
              key={h.id}
              title={h.id}
              onClick={() => setHerramienta(h.id)}
              className="w-7 h-7 rounded-full text-sm flex items-center justify-center"
              style={{ background: herramienta === h.id ? 'var(--acento)' : 'transparent' }}
            >
              {h.icon}
            </button>
          ))}

          <div className="w-px h-4 mx-1" style={{ background: 'var(--acento-suave)' }} />

          {COLORES.map((c) => (
            <button
              key={c.id}
              title={c.label}
              onClick={() => { setColorId(c.id); setHerramienta('lapiz') }}
              className="w-5 h-5 rounded-full border-2 transition-transform hover:scale-110"
              style={{
                background: c.valor,
                borderColor: colorId === c.id && herramienta === 'lapiz' ? '#fff' : 'transparent',
              }}
            />
          ))}

          <div className="w-px h-4 mx-1" style={{ background: 'var(--acento-suave)' }} />

          <input
            type="range" min={1} max={8} value={grosor}
            onChange={(e) => setGrosor(Number(e.target.value))}
            className="w-16 cursor-pointer"
            style={{ accentColor: 'var(--acento)' }}
          />

          <div className="w-px h-4 mx-1" style={{ background: 'var(--acento-suave)' }} />

          <button
            onClick={limpiarCanvas}
            className="text-xs px-2 py-0.5 rounded border hover:opacity-80"
            style={{ borderColor: '#dc2626', color: '#dc2626' }}
          >
            🗑
          </button>
        </div>
      )}

      {/* Canvas siempre presente — nunca se desmonta al cambiar de modo */}
      <canvas
        ref={canvasRef}
        onPointerDown={iniciarTrazo}
        onPointerMove={dibujar}
        onPointerUp={terminarTrazo}
        onPointerLeave={terminarTrazo}
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: activo ? 'auto' : 'none',
          cursor: activo ? (herramienta === 'borrador' ? 'cell' : 'crosshair') : 'default',
          touchAction: 'none',
        }}
      />
    </>
  )
}
