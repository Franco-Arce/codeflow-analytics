import React from 'react'

const Header = ({ user, onLogout }) => {
  return (
    <div className="bg-gray-800 border-b border-gray-700">
      <div className="max-w-md mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold text-white">Mi Negocio</h1>
            <p className="text-sm text-gray-400">
              {user.negocios?.nombre} • {user.username}
            </p>
          </div>
          <button
            onClick={onLogout}
            className="text-gray-400 hover:text-white text-sm transition-colors"
          >
            Salir
          </button>
        </div>
      </div>
    </div>
  )
}

export default Header