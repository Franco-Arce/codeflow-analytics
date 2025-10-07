import React, { useState, useEffect } from 'react'
import { useAuth } from './hooks/useAuth'
import Login from './components/Auth/Login'
import Register from './components/Auth/Register'
import SalesScreen from './components/Sales/SalesScreen'
import ProductList from './components/Products/ProductList'
import AnalyticsScreen from './components/Analytics/AnalyticsScreen'
import UserManagement from './components/Admin/UserManagement'
import Header from './components/Layout/Header'
import Navigation from './components/Layout/Navigation'
import DebugInfo from './components/Debug/DebugInfo'

function App() {
  const { user, login, logout, loading, isInitialized } = useAuth()
  const [authMode, setAuthMode] = useState('login')
  const [currentTab, setCurrentTab] = useState('sales')

  // DEBUG: Este efecto se ejecutará cuando user cambie
  useEffect(() => {
    console.log('🎯 App - User state changed:', user ? `Logged as ${user.username}` : 'No user')
    console.log('🎯 App - Full user object:', user)
  }, [user])

  // Debug info
  console.log('🏠 App Render - State:', { 
    hasUser: !!user,
    username: user?.username,
    rol: user?.rol,
    authMode,
    currentTab,
    isInitialized,
    loading
  })

  // Mostrar loading mientras se inicializa la autenticación
  if (!isInitialized) {
    console.log('⏳ App - Waiting for auth initialization...')
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-white">Cargando...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    console.log('🔐 App - Showing auth screen:', authMode)
    return authMode === 'login' ? (
      <Login 
        onSwitchToRegister={() => setAuthMode('register')} 
      />
    ) : (
      <Register onSwitchToLogin={() => setAuthMode('login')} />
    )
  }

  console.log('✅ App - User authenticated, showing main app')

  const renderCurrentScreen = () => {
    console.log('📄 App - Rendering screen:', currentTab)
    
    switch (currentTab) {
      case 'sales':
        return <SalesScreen user={user} />
      case 'products':
        return <ProductList user={user} />
      case 'analytics':
        return <AnalyticsScreen user={user} />
      case 'users':
        return <UserManagement user={user} />
      default:
        return <SalesScreen user={user} />
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 pb-16">
      {/* Componente de Debug - Temporal */}
      <DebugInfo />
      
      <Header user={user} onLogout={logout} />
      {renderCurrentScreen()}
      <Navigation 
        currentTab={currentTab} 
        onTabChange={setCurrentTab} 
        user={user}
      />
    </div>
  )
}

export default App