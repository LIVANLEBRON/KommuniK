import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const ProtectedRoute = ({ children, requiredRole = null }) => {
  const { user, profile, loading } = useAuth();
  const location = useLocation();

  // Mostrar loading mientras se verifica la autenticación
  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Verificando acceso...</p>
        </div>
      </div>
    );
  }

  // Si no hay usuario, redirigir al login
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Si se requiere un rol específico, verificar que el usuario lo tenga
  if (requiredRole && profile) {
    const hasRequiredRole = Array.isArray(requiredRole)
      ? requiredRole.includes(profile.role)
      : profile.role === requiredRole;

    if (!hasRequiredRole) {
      return (
        <div className="access-denied">
          <div className="access-denied-content">
            <h2>Acceso Denegado</h2>
            <p>No tienes permisos para acceder a esta página.</p>
            <button 
              onClick={() => window.history.back()}
              className="btn btn-primary"
            >
              Volver
            </button>
          </div>
        </div>
      );
    }
  }

  // Si todo está bien, mostrar el componente
  return children;
};

export default ProtectedRoute;