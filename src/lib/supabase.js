import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

console.log('[supabase] URL:', supabaseUrl)
console.log('[supabase] KEY:', supabaseAnonKey?.slice(0, 20) + '...')

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Faltan las variables de entorno VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY. ' +
    'Configurarlas en Vercel → Settings → Environment Variables.'
  )
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
