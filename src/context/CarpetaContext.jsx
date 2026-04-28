import { createContext, useContext, useState } from 'react'

// Estructura de una hoja: { id, contenido, tipo, canvasData }
// Estructura de una sección: { id, nombre, hojas: [...], hojaActivaIdx }

const CarpetaContext = createContext(null)

function seccionesIniciales() {
  const guardadas = localStorage.getItem('fn-secciones')
  if (guardadas) {
    try {
      const parsed = JSON.parse(guardadas)
      // Valida que sea un array con secciones que tengan hojas válidas.
      // Si algo está corrupto, descarta y arranca limpio.
      if (!Array.isArray(parsed)) throw new Error('inválido')
      return parsed.map((s) => {
        if (!s.id || !Array.isArray(s.hojas)) throw new Error('inválido')
        return {
          ...s,
          hojas: s.hojas.map((h) => ({
            ...h,
            tipo: h.tipo ?? 'rayado',
            canvasData: h.canvasData ?? null,
          })),
        }
      })
    } catch {
      localStorage.removeItem('fn-secciones')
    }
  }
  return []
}

function guardar(secciones) {
  localStorage.setItem('fn-secciones', JSON.stringify(secciones))
}

function uid() {
  return Math.random().toString(36).slice(2, 9)
}

export function CarpetaProvider({ children }) {
  const [secciones, setSecciones] = useState(seccionesIniciales)
  const [seccionActivaId, setSeccionActivaId] = useState(null)

  function actualizar(nuevas) {
    setSecciones(nuevas)
    guardar(nuevas)
  }

  // --- Secciones ---
  function agregarSeccion() {
    const nueva = {
      id: uid(),
      nombre: 'Nueva sección',
      hojas: [{ id: uid(), contenido: '', tipo: 'rayado', canvasData: null }],
      hojaActivaIdx: 0,
    }
    const nuevas = [...secciones, nueva]
    actualizar(nuevas)
    setSeccionActivaId(nueva.id)
  }

  function eliminarSeccion(id) {
    const nuevas = secciones.filter((s) => s.id !== id)
    actualizar(nuevas)
    if (seccionActivaId === id) setSeccionActivaId(nuevas[0]?.id ?? null)
  }

  function renombrarSeccion(id, nombre) {
    actualizar(secciones.map((s) => (s.id === id ? { ...s, nombre } : s)))
  }

  // --- Hojas ---
  function agregarHoja(seccionId) {
    actualizar(secciones.map((s) => {
      if (s.id !== seccionId) return s
      const nuevasHojas = [...s.hojas, { id: uid(), contenido: '', tipo: 'rayado', canvasData: null }]
      return { ...s, hojas: nuevasHojas, hojaActivaIdx: nuevasHojas.length - 1 }
    }))
  }

  function irAHoja(seccionId, idx) {
    actualizar(secciones.map((s) => (s.id === seccionId ? { ...s, hojaActivaIdx: idx } : s)))
  }

  function actualizarContenido(seccionId, hojaId, contenido) {
    actualizar(secciones.map((s) => {
      if (s.id !== seccionId) return s
      return { ...s, hojas: s.hojas.map((h) => (h.id === hojaId ? { ...h, contenido } : h)) }
    }))
  }

  function cambiarTipoHoja(seccionId, hojaId, tipo) {
    actualizar(secciones.map((s) => {
      if (s.id !== seccionId) return s
      return { ...s, hojas: s.hojas.map((h) => (h.id === hojaId ? { ...h, tipo } : h)) }
    }))
  }

  function guardarCanvasHoja(seccionId, hojaId, canvasData) {
    actualizar(secciones.map((s) => {
      if (s.id !== seccionId) return s
      return { ...s, hojas: s.hojas.map((h) => (h.id === hojaId ? { ...h, canvasData } : h)) }
    }))
  }

  const seccionActiva = secciones.find((s) => s.id === seccionActivaId) ?? null

  return (
    <CarpetaContext.Provider value={{
      secciones, seccionActiva, seccionActivaId, setSeccionActivaId,
      agregarSeccion, eliminarSeccion, renombrarSeccion,
      agregarHoja, irAHoja, actualizarContenido, cambiarTipoHoja, guardarCanvasHoja,
    }}>
      {children}
    </CarpetaContext.Provider>
  )
}

export function useCarpeta() {
  return useContext(CarpetaContext)
}
