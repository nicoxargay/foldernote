import { useEffect, useRef } from 'react'
import { supabase } from '../lib/supabase'

// Sincroniza el contenido de una hoja con Supabase usando debounce.
// El estado vive en CarpetaContext; este hook solo se encarga de la persistencia remota.
export function useNotes(userId, claveNota, contenido, onCarga) {
  const cargado = useRef(false)
  const debounceRef = useRef(null)

  // Carga inicial desde Supabase cuando cambia la clave (distinta hoja/sección).
  useEffect(() => {
    if (!userId || !claveNota) return
    cargado.current = false

    supabase
      .from('notas')
      .select('contenido')
      .eq('user_id', userId)
      .eq('seccion_id', claveNota)
      .single()
      .then(({ data, error }) => {
        // 406 = no se encontró la fila (hoja nueva sin nota guardada), es normal.
        if (error && error.code !== 'PGRST116') console.error(error)
        if (data?.contenido !== undefined) onCarga(data.contenido)
        cargado.current = true
      })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId, claveNota])

  // Guarda con debounce cada vez que el contenido cambia (después de la carga inicial).
  useEffect(() => {
    if (!userId || !claveNota || !cargado.current) return

    clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      supabase.from('notas').upsert(
        { user_id: userId, seccion_id: claveNota, contenido, updated_at: new Date().toISOString() },
        { onConflict: 'user_id,seccion_id' }
      )
    }, 800)

    return () => clearTimeout(debounceRef.current)
  }, [contenido, userId, claveNota])
}
