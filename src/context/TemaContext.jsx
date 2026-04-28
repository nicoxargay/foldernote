import { createContext, useContext, useState, useEffect } from 'react'

// Colores de acento disponibles. Cada uno define sus variantes para dark theme.
export const TEMAS = {
  naranja: {
    nombre: 'Naranja',
    acento: '#f97316',
    acentoSuave: '#431407',
    acentoHover: '#ea6a0a',
    texto: '#fed7aa',
    textSuave: '#fdba74',
  },
  azul: {
    nombre: 'Azul',
    acento: '#3b82f6',
    acentoSuave: '#1e3a5f',
    acentoHover: '#2563eb',
    texto: '#bfdbfe',
    textSuave: '#93c5fd',
  },
  rojo: {
    nombre: 'Rojo',
    acento: '#ef4444',
    acentoSuave: '#450a0a',
    acentoHover: '#dc2626',
    texto: '#fecaca',
    textSuave: '#fca5a5',
  },
  verde: {
    nombre: 'Verde',
    acento: '#22c55e',
    acentoSuave: '#052e16',
    acentoHover: '#16a34a',
    texto: '#bbf7d0',
    textSuave: '#86efac',
  },
  violeta: {
    nombre: 'Violeta',
    acento: '#a855f7',
    acentoSuave: '#2e1065',
    acentoHover: '#9333ea',
    texto: '#e9d5ff',
    textSuave: '#d8b4fe',
  },
}

export const FUENTES = {
  caveat: { nombre: 'Caveat', clase: 'font-caveat' },
  patrickHand: { nombre: 'Patrick Hand', clase: 'font-patrick' },
  indieFlower: { nombre: 'Indie Flower', clase: 'font-indie' },
  shadowsIntoLight: { nombre: 'Shadows Into Light', clase: 'font-shadows' },
  kalam: { nombre: 'Kalam', clase: 'font-kalam' },
}

const TemaContext = createContext(null)

export function TemaProvider({ children }) {
  const [temaId, setTemaId] = useState(() => localStorage.getItem('fn-tema') ?? 'naranja')
  const [fuenteId, setFuenteId] = useState(() => localStorage.getItem('fn-fuente') ?? 'caveat')

  const tema = TEMAS[temaId]
  const fuente = FUENTES[fuenteId]

  useEffect(() => localStorage.setItem('fn-tema', temaId), [temaId])
  useEffect(() => localStorage.setItem('fn-fuente', fuenteId), [fuenteId])

  // Aplica las variables CSS al :root para que todo el árbol las use.
  useEffect(() => {
    const r = document.documentElement.style
    r.setProperty('--acento', tema.acento)
    r.setProperty('--acento-suave', tema.acentoSuave)
    r.setProperty('--acento-hover', tema.acentoHover)
    r.setProperty('--texto', tema.texto)
    r.setProperty('--texto-suave', tema.textSuave)
  }, [tema])

  return (
    <TemaContext.Provider value={{ temaId, setTemaId, fuenteId, setFuenteId, tema, fuente }}>
      {children}
    </TemaContext.Provider>
  )
}

export function useTema() {
  return useContext(TemaContext)
}
