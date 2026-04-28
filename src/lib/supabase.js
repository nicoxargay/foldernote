// Crea y exporta el cliente de Supabase que usan todos los demás módulos.
// Las claves viven en .env para no exponerlas en el repo.
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
