import { createClient } from '@supabase/supabase-js'

// EN VITE se usa import.meta.env, NO process.env
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

console.log('🔧 Configurando Supabase...', { 
  url: supabaseUrl ? '✅ Configurada' : '❌ Faltante',
  key: supabaseKey ? '✅ Configurada' : '❌ Faltante'
})

if (!supabaseUrl || !supabaseKey) {
  const errorMsg = '❌ ERROR: Variables de entorno de Supabase no configuradas correctamente'
  console.error(errorMsg)
  console.error('URL:', supabaseUrl || 'NO CONFIGURADA')
  console.error('KEY:', supabaseKey ? 'CONFIGURADA' : 'NO CONFIGURADA')
  alert('Error: Configura las variables de entorno en .env')
}

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  }
})

// Función para obtener negocio por código
export const getNegocioByCodigo = async (codigo) => {
  console.log('🔍 Buscando negocio con código:', codigo)
  
  const { data, error } = await supabase
    .from('negocios')
    .select('*')
    .eq('codigo', codigo)
    .single()

  if (error) {
    console.error('❌ Error buscando negocio:', error)
    throw error
  }
  
  console.log('✅ Negocio encontrado:', data)
  return data
}

// Función para registrar usuario
export const registerUser = async (username, pin, negocioId, rol = 'empleado') => {
  console.log('👤 Registrando usuario:', { username, negocioId, rol })
  
  const { data, error } = await supabase
    .from('usuarios')
    .insert([
      { 
        username, 
        pin, 
        negocio_id: negocioId, 
        rol,
        activo: true
      }
    ])
    .select()
    .single()

  if (error) {
    console.error('❌ Error registrando usuario:', error)
    throw error
  }
  
  console.log('✅ Usuario registrado:', data)
  return data
}

// Función para login
export const loginUser = async (username, pin) => {
  console.log('🔐 Intentando login:', username)
  
  const startTime = Date.now()
  
  try {
    // QUITA el .single() y maneja el array de resultados
    const { data, error } = await supabase
      .from('usuarios')
      .select(`
        *,
        negocios (*)
      `)
      .eq('username', username)
      .eq('pin', pin)
      .eq('activo', true)
    // ← .single() QUITADO

    const endTime = Date.now()
    console.log(`⏱️ Tiempo de login: ${endTime - startTime}ms`)

    if (error) {
      console.error('❌ Error en login:', error)
      throw error
    }

    // Manejar los resultados manualmente
    if (!data || data.length === 0) {
      console.error('❌ Usuario no encontrado o credenciales incorrectas')
      throw new Error('Credenciales incorrectas o usuario inactivo')
    }

    if (data.length > 1) {
      console.warn('⚠️ Múltiples usuarios encontrados, usando el primero')
    }

    const userData = data[0] // Tomar el primer resultado
    console.log('✅ Login exitoso:', userData)
    return userData
    
  } catch (error) {
    console.error('💥 Error completo en login:', error)
    throw error
  }
}