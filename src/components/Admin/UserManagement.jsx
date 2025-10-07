import React, { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'

const UserManagement = ({ user }) => {
  const [users, setUsers] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    username: '',
    pin: '',
    rol: 'vendedor'
  })

  useEffect(() => {
    if (user?.rol === 'admin') {
      loadUsers()
    }
  }, [user])

  const loadUsers = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('usuarios')
        .select('*')
        .eq('negocio_id', user.negocio_id)
        .order('username')

      if (error) throw error
      setUsers(data || [])
    } catch (error) {
      console.error('Error cargando usuarios:', error)
      alert('Error al cargar los usuarios')
    } finally {
      setLoading(false)
    }
  }

  const createUser = async (e) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      const { data, error } = await supabase
        .from('usuarios')
        .insert([
          {
            username: formData.username,
            pin: formData.pin,
            negocio_id: user.negocio_id,
            rol: formData.rol,
            activo: true
          }
        ])
        .select()

      if (error) throw error

      setUsers(prev => [...prev, data[0]])
      setFormData({ username: '', pin: '', rol: 'vendedor' })
      setShowForm(false)
      alert('✅ Usuario creado exitosamente!')
    } catch (error) {
      console.error('Error creando usuario:', error)
      alert(`Error: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  const toggleUserStatus = async (userId, currentStatus) => {
    try {
      const { error } = await supabase
        .from('usuarios')
        .update({ activo: !currentStatus })
        .eq('id', userId)

      if (error) throw error

      setUsers(prev =>
        prev.map(u =>
          u.id === userId ? { ...u, activo: !currentStatus } : u
        )
      )
      alert(`Usuario ${!currentStatus ? 'activado' : 'desactivado'}`)
    } catch (error) {
      console.error('Error actualizando usuario:', error)
      alert(`Error: ${error.message}`)
    }
  }

  if (user?.rol !== 'admin') {
    return (
      <div className="min-h-screen bg-gray-900 p-4">
        <div className="max-w-md mx-auto text-center py-8">
          <div className="text-6xl mb-4">⛔</div>
          <h2 className="text-xl font-bold text-white mb-2">Acceso Denegado</h2>
          <p className="text-gray-400">No tenés permisos de administrador para acceder a esta sección.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 p-4">
      <div className="max-w-md mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-white">👥 Gestión de Usuarios</h1>
          <button
            onClick={() => setShowForm(true)}
            disabled={loading}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-purple-700 transition-colors disabled:opacity-50"
          >
            + Agregar Usuario
          </button>
        </div>

        {/* Formulario para crear usuario */}
        {showForm && (
          <div className="bg-gray-800 rounded-lg p-4 border border-purple-500 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-white">Crear Nuevo Usuario</h3>
              <button
                onClick={() => setShowForm(false)}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>
            <form onSubmit={createUser} className="space-y-3">
              <input
                type="text"
                placeholder="Nombre de usuario"
                className="w-full px-3 py-2 border border-gray-600 bg-gray-700 rounded focus:ring-2 focus:ring-purple-500 text-white placeholder-gray-400"
                value={formData.username}
                onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
                required
              />
              <input
                type="password"
                maxLength="4"
                placeholder="PIN de 4 dígitos"
                className="w-full px-3 py-2 border border-gray-600 bg-gray-700 rounded focus:ring-2 focus:ring-purple-500 text-white placeholder-gray-400"
                value={formData.pin}
                onChange={(e) => setFormData(prev => ({ ...prev, pin: e.target.value.replace(/\D/g, '') }))}
                required
              />
              <select
                className="w-full px-3 py-2 border border-gray-600 bg-gray-700 rounded focus:ring-2 focus:ring-purple-500 text-white"
                value={formData.rol}
                onChange={(e) => setFormData(prev => ({ ...prev, rol: e.target.value }))}
              >
                <option value="vendedor">Vendedor</option>
                <option value="admin">Administrador</option>
              </select>
              <div className="flex space-x-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-green-600 text-white py-2 rounded font-semibold hover:bg-green-700 transition-colors disabled:opacity-50"
                >
                  {loading ? 'Creando...' : 'Crear Usuario'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 bg-gray-600 text-white py-2 rounded font-semibold hover:bg-gray-700 transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Lista de usuarios */}
        <div className="space-y-3">
          {users.map(usuario => (
            <div key={usuario.id} className="bg-gray-800 rounded-lg border border-gray-700 p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-white text-lg">
                    {usuario.username}
                    {usuario.id === user.id && <span className="ml-2 text-purple-400 text-sm">(Tú)</span>}
                  </h3>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      usuario.rol === 'admin' 
                        ? 'bg-purple-600 text-white' 
                        : 'bg-gray-600 text-gray-300'
                    }`}>
                      {usuario.rol}
                    </span>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      usuario.activo 
                        ? 'bg-green-600 text-white' 
                        : 'bg-red-600 text-white'
                    }`}>
                      {usuario.activo ? 'Activo' : 'Inactivo'}
                    </span>
                  </div>
                </div>
                
                {usuario.id !== user.id && (
                  <button
                    onClick={() => toggleUserStatus(usuario.id, usuario.activo)}
                    className={`px-3 py-1 rounded text-sm font-medium ${
                      usuario.activo 
                        ? 'bg-red-600 hover:bg-red-700 text-white' 
                        : 'bg-green-600 hover:bg-green-700 text-white'
                    } transition-colors`}
                  >
                    {usuario.activo ? 'Desactivar' : 'Activar'}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {users.length === 0 && !loading && (
          <div className="text-center py-8 text-gray-400">
            <p>No hay usuarios registrados</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default UserManagement