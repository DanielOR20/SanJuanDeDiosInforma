import { Routes, Route, Navigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { MainLayout } from './MainLayout';
import { ProtectedRoute } from './ProtectedRoute';

// Páginas de la plataforma
import { Home } from '../pages/Home';
import AboutDistrict from '../pages/AboutDistrict';
import { Directorio } from '../pages/Directorio';
import { Agenda } from '../pages/Agenda';
import { Avisos } from '../pages/Avisos';
import { Foro } from '../pages/Foro';
import { Asistente } from '../pages/Asistente';
import { Admin } from '../pages/Admin';
import { Login } from '../pages/Login';
import { Juego } from '../pages/Juego';
import Pets from '../pages/Pets';
import Reels from '../pages/Reels';
import Marketplace from '../pages/Marketplace';

export const AppRoutes = () => {
  const { user } = useApp();

  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/distrito" element={<AboutDistrict />} />
        <Route path="/directorio" element={<Directorio />} />
        <Route path="/agenda" element={<Agenda />} />
        <Route path="/avisos" element={<Avisos />} />
        <Route path="/foro" element={<Foro />} />
        <Route path="/asistente" element={<Asistente />} />
        <Route path="/juego" element={<Juego />} />
                <Route path="/mascotas" element={<Pets />} />
        <Route path="/reels" element={<Reels />} />
        <Route path="/marketplace" element={<Marketplace />} />

        <Route 
          path="/login" 
          element={user ? <Navigate to={user.role === 'admin' ? '/admin' : '/directorio'} replace /> : <Login />} 
        />

        <Route 
          path="/admin" 
          element={
            <ProtectedRoute requiredRole="admin">
              <Admin />
            </ProtectedRoute>
          } 
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
};