import { Routes, Route, Navigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { MainLayout } from './MainLayout';
import { ProtectedRoute } from './ProtectedRoute';

// Páginas de la plataforma
import { Home } from '../pages/Home';
import { Directorio } from '../pages/Directorio';
import { Agenda } from '../pages/Agenda';
import { Avisos } from '../pages/Avisos';
import { Foro } from '../pages/Foro';
import { Asistente } from '../pages/Asistente';
import { Admin } from '../pages/Admin';
import { Login } from '../pages/Login';

export const AppRoutes = () => {
  const { user } = useApp();

  return (
    <Routes>
      {/* Contenedor principal con Layout (Navbar + Outlet + Footer) */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/directorio" element={<Directorio />} />
        <Route path="/agenda" element={<Agenda />} />
        <Route path="/avisos" element={<Avisos />} />
        <Route path="/foro" element={<Foro />} />
        <Route path="/asistente" element={<Asistente />} />

        {/* Acceso Comunal: si ya inició sesión, se redirige según su rol */}
        <Route 
          path="/login" 
          element={user ? <Navigate to={user.role === 'admin' ? '/admin' : '/directorio'} replace /> : <Login />} 
        />

        {/* Panel ADI protegido por rol administrativo */}
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute requiredRole="admin">
              <Admin />
            </ProtectedRoute>
          } 
        />

        {/* Ruta comodín para capturar direcciones no encontradas */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
};