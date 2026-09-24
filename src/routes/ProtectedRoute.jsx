import { Navigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

export const ProtectedRoute = ({ children, requiredRole = 'admin' }) => {
  const { user } = useApp();

  if (!user) {
    // Si no ha iniciado sesión, se redirige al portal de acceso comunal
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && user.role !== requiredRole) {
    // Si no cuenta con las credenciales de administración requeridas, se redirige al directorio
    return <Navigate to="/directorio" replace />;
  }

  return children;
};