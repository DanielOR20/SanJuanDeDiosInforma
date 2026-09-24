import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { Home } from './pages/Home';
import { Directorio } from './pages/Directorio';
import { Agenda } from './pages/Agenda';
import { Avisos } from './pages/Avisos';
import { Asistente } from './pages/Asistente';
import { Admin } from './pages/Admin';
import { Login } from './pages/Login';

// Componente para proteger la ruta de administración (Rúbrica: rutas protegidas)
const ProtectedAdminRoute = ({ children }) => {
  const { isAdmin } = useApp();
  if (!isAdmin) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

function AppContent() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <main style={{ flex: 1 }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/directorio" element={<Directorio />} />
          <Route path="/agenda" element={<Agenda />} />
          <Route path="/avisos" element={<Avisos />} />
          <Route path="/asistente" element={<Asistente />} />
          <Route path="/login" element={<Login />} />
          
          {/* Ruta protegida por rol de Administrador */}
          <Route 
            path="/admin" 
            element={
              <ProtectedAdminRoute>
                <Admin />
              </ProtectedAdminRoute>
            } 
          />
          
          {/* Redirección por defecto */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <footer style={{
        textAlign: 'center',
        padding: '1.5rem',
        fontSize: '0.85rem',
        color: 'var(--text-muted)',
        borderTop: '1px solid var(--border)',
        marginTop: '2rem'
      }}>
        © 2026 San Juan de Dios Informa. Portal Comunitario y Ciudadano.
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </AppProvider>
  );
}