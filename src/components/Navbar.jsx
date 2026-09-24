import { useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { 
  LogIn, 
  LogOut, 
  Sun, 
  Moon, 
  Menu,
  X,
  MessageSquareWarning
} from 'lucide-react';

export const Navbar = () => {
  const { 
    user, 
    logout, 
    theme, 
    toggleTheme, 
    fontSize, 
    increaseFontSize, 
    decreaseFontSize 
  } = useApp();
  
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
    setMenuOpen(false);
  };

  const closeMenu = () => setMenuOpen(false);

  return (
    <header style={{
      backgroundColor: 'var(--surface)',
      borderBottom: '1px solid var(--border)',
      position: 'sticky',
      top: 0,
      zIndex: 2000,
      boxShadow: 'var(--shadow-sm)'
    }}>
      <div className="stitch-container" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: '0.65rem',
        paddingBottom: '0.65rem',
        position: 'relative'
      }}>
        {/* LOGO */}
        <Link to="/" onClick={closeMenu} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', textDecoration: 'none', zIndex: 2001 }}>
          <div style={{
            backgroundColor: 'var(--primary)',
            color: 'white',
            fontWeight: '900',
            fontSize: '0.85rem',
            padding: '0.3rem 0.55rem',
            borderRadius: 'var(--radius-sm)'
          }}>
            CR
          </div>
          <div>
            <span style={{ fontSize: '1.05rem', fontWeight: '800', color: 'var(--text-main)', display: 'block', lineHeight: 1.1 }}>
              San Juan de Dios
            </span>
            <span style={{ fontSize: '0.68rem', fontWeight: '700', color: 'var(--primary)', letterSpacing: '0.5px' }}>
              INFORMA
            </span>
          </div>
        </Link>

        {/* ACCESIBILIDAD (A- / A+ y TEMA) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', zIndex: 2001 }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            backgroundColor: 'var(--surface-subtle)',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--border)',
            padding: '0.1rem 0.2rem'
          }}>
            <button
              onClick={decreaseFontSize}
              title="Reducir texto"
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontWeight: '800',
                fontSize: '0.75rem',
                color: fontSize === 'normal' ? 'var(--text-subtle)' : 'var(--primary)',
                padding: '0.2rem 0.45rem'
              }}
            >
              A-
            </button>
            <span style={{ color: 'var(--border-strong)', fontSize: '0.7rem' }}>|</span>
            <button
              onClick={increaseFontSize}
              title="Aumentar texto"
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontWeight: '800',
                fontSize: '0.85rem',
                color: fontSize === 'xlarge' ? 'var(--text-subtle)' : 'var(--primary)',
                padding: '0.2rem 0.45rem'
              }}
            >
              A+
            </button>
          </div>

          <button 
            onClick={toggleTheme}
            title="Cambiar tema"
            style={{
              background: 'none',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-sm)',
              cursor: 'pointer',
              color: 'var(--text-muted)',
              padding: '0.35rem',
              display: 'flex',
              alignItems: 'center',
              backgroundColor: 'var(--surface-subtle)'
            }}
          >
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          </button>

          {/* Menú hamburguesa móvil */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="mobile-hamburger-btn"
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--text-main)',
              padding: '0.35rem',
              marginLeft: '0.25rem',
              display: 'none'
            }}
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* ENLACES PRINCIPALES */}
        <nav className={`main-nav-links ${menuOpen ? 'nav-mobile-open' : ''}`}>
          <NavLink to="/" onClick={closeMenu} className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
            Inicio
          </NavLink>
          <NavLink to="/directorio" onClick={closeMenu} className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
            Comercios
          </NavLink>
          <NavLink to="/agenda" onClick={closeMenu} className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
            Agenda & Servicios
          </NavLink>
          <NavLink to="/avisos" onClick={closeMenu} className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
            Avisos
          </NavLink>
          <NavLink to="/foro" onClick={closeMenu} className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
            Tribuna & Denuncias
          </NavLink>
          <NavLink to="/asistente" onClick={closeMenu} className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
            Guía IA
          </NavLink>

          {user?.role === 'admin' && (
            <NavLink to="/admin" onClick={closeMenu} className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'} style={{ color: 'var(--tertiary)', fontWeight: '800' }}>
              Panel ADI
            </NavLink>
          )}

          {/* Autenticación */}
          <div style={{ marginLeft: '0.5rem' }} className="auth-btn-wrapper">
            {user ? (
              <button
                onClick={handleLogout}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  backgroundColor: 'var(--surface-subtle)',
                  color: 'var(--secondary)',
                  border: '1px solid var(--border)',
                  padding: '0.45rem 0.85rem',
                  borderRadius: 'var(--radius-sm)',
                  fontWeight: '700',
                  fontSize: '0.82rem',
                  cursor: 'pointer'
                }}
              >
                <LogOut size={14} /> Salir ({user.name.split(' ')[0]})
              </button>
            ) : (
              <Link
                to="/login"
                onClick={closeMenu}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  backgroundColor: 'var(--primary)',
                  color: 'white',
                  padding: '0.45rem 0.95rem',
                  borderRadius: 'var(--radius-sm)',
                  fontWeight: '700',
                  fontSize: '0.82rem',
                  textDecoration: 'none'
                }}
              >
                <LogIn size={14} /> Ingresar
              </Link>
            )}
          </div>
        </nav>
      </div>

      <style>{`
        .main-nav-links {
          display: flex;
          align-items: center;
          gap: 1.15rem;
        }

        @media (max-width: 980px) {
          .mobile-hamburger-btn {
            display: block !important;
          }

          .main-nav-links {
            display: none;
            position: absolute;
            top: 100%;
            left: 0;
            width: 100%;
            background-color: var(--surface);
            border-bottom: 2px solid var(--border);
            box-shadow: 0 10px 25px rgba(0,0,0,0.15);
            flex-direction: column;
            align-items: flex-start;
            padding: 1.25rem 1.5rem;
            gap: 1rem;
            z-index: 2500;
          }

          .main-nav-links.nav-mobile-open {
            display: flex !important;
          }

          .nav-link {
            width: 100%;
            padding: 0.5rem 0;
            font-size: 1rem;
            border-bottom: 1px solid var(--border);
          }

          .auth-btn-wrapper {
            margin-left: 0 !important;
            margin-top: 0.5rem;
            width: 100%;
          }

          .auth-btn-wrapper a, .auth-btn-wrapper button {
            width: 100%;
            justify-content: center;
            padding: 0.65rem !important;
          }
        }
      `}</style>
    </header>
  );
};