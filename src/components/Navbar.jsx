import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { 
  Sun, 
  Moon, 
  User, 
  LogOut, 
  ShieldCheck, 
  Compass, 
  Calendar, 
  Bell, 
  Bot, 
  LayoutDashboard 
} from 'lucide-react';

export const Navbar = () => {
  const { user, logout, isAdmin, theme, toggleTheme, adjustFontSize } = useApp();

  return (
    <header style={{
      backgroundColor: 'var(--primary)',
      color: '#FFFFFF',
      padding: '0.75rem 1.5rem',
      position: 'sticky',
      top: 0,
      zIndex: 50,
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        {/* Marca / Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: '#FFFFFF' }}>
          <div style={{
            backgroundColor: '#DC2626',
            color: '#FFFFFF',
            fontWeight: 'bold',
            padding: '0.3rem 0.6rem',
            borderRadius: '4px',
            fontSize: '0.9rem',
            letterSpacing: '0.5px'
          }}>
            CR
          </div>
          <div>
            <div style={{ fontWeight: '800', fontSize: '1.15rem', lineHeight: '1.2' }}>
              San Juan de Dios
            </div>
            <div style={{ fontSize: '0.75rem', letterSpacing: '2px', opacity: 0.9 }}>
              INFORMA
            </div>
          </div>
        </Link>

        {/* Enlaces de Navegación Principal */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', fontSize: '0.95rem' }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            Inicio
          </Link>
          <Link to="/directorio" style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <Compass size={16} /> Comercios
          </Link>
          <Link to="/agenda" style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <Calendar size={16} /> Agenda & Servicios
          </Link>
          <Link to="/avisos" style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <Bell size={16} /> Avisos
          </Link>
          <Link to="/asistente" style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: '#FCD34D', fontWeight: '600' }}>
            <Bot size={16} /> Guía IA
          </Link>
          {isAdmin && (
            <Link to="/admin" style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.3rem', 
              backgroundColor: 'rgba(255,255,255,0.15)',
              padding: '0.3rem 0.6rem',
              borderRadius: '4px'
            }}>
              <LayoutDashboard size={16} /> Panel ADI
            </Link>
          )}
        </nav>

        {/* Herramientas de Accesibilidad y Sesión */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {/* Ajuste de Texto A- / A+ */}
          <div style={{ display: 'flex', backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: '4px' }}>
            <button 
              onClick={() => adjustFontSize(-1)}
              title="Reducir tamaño de letra"
              style={{ background: 'none', border: 'none', color: '#fff', padding: '0.3rem 0.5rem', fontWeight: 'bold' }}
            >
              A-
            </button>
            <button 
              onClick={() => adjustFontSize(1)}
              title="Aumentar tamaño de letra"
              style={{ background: 'none', border: 'none', color: '#fff', padding: '0.3rem 0.5rem', fontWeight: 'bold' }}
            >
              A+
            </button>
          </div>

          {/* Modo Claro / Oscuro */}
          <button 
            onClick={toggleTheme}
            title={theme === 'light' ? 'Cambiar a modo oscuro' : 'Cambiar a modo claro'}
            style={{ background: 'none', border: 'none', color: '#fff', display: 'flex', alignItems: 'center', padding: '0.3rem' }}
          >
            {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
          </button>

          {/* Usuario / Sesión */}
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                {isAdmin ? <ShieldCheck size={16} color="#6EE7B7" /> : <User size={16} />}
                {user.name.split(' ')[0]}
              </span>
              <button 
                onClick={logout}
                title="Cerrar sesión"
                style={{ background: 'none', border: 'none', color: '#fff', display: 'flex', alignItems: 'center' }}
              >
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <Link 
              to="/login"
              style={{
                backgroundColor: '#FFFFFF',
                color: 'var(--primary)',
                padding: '0.35rem 0.8rem',
                borderRadius: '4px',
                fontWeight: '600',
                fontSize: '0.85rem'
              }}
            >
              Ingresar
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};