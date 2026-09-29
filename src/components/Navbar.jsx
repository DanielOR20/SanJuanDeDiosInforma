import { useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { 
  LogIn, 
  LogOut, 
  Sun, 
  Moon, 
  Menu, 
  X, 
  Volume2, 
  VolumeX, 
  Eye,
  Gamepad2
} from 'lucide-react';

export const Navbar = () => {
  const { 
    user, 
    logout, 
    theme, 
    toggleTheme, 
    fontSize, 
    increaseFontSize, 
    decreaseFontSize,
    highContrast,
    toggleHighContrast,
    speakText,
    stopSpeaking,
    isSpeaking
  } = useApp();
  
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.getVoices();
      window.speechSynthesis.onvoiceschanged = () => {
        window.speechSynthesis.getVoices();
      };
    }
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMenuOpen(false);
  };

  const closeMenu = () => setMenuOpen(false);

  const speakAccessibility = () => {
    if (!('speechSynthesis' in window)) return;

    // 1. Detener cualquier audio previo
    window.speechSynthesis.cancel();

    // 2. Obtener lista real de voces
    const allVoices = window.speechSynthesis.getVoices();

    // 3. Filtrar de forma estricta voces que sean exclusivamente en español
    // En Windows suelen llamarse 'Microsoft Helena', 'Microsoft Sabina', 'Microsoft Raul', 'Google español', etc.
    const spanishVoice = allVoices.find(v => 
      (v.lang && v.lang.toLowerCase().includes('es')) ||
      (v.name && (
        v.name.toLowerCase().includes('spanish') || 
        v.name.toLowerCase().includes('español') ||
        v.name.toLowerCase().includes('helena') ||
        v.name.toLowerCase().includes('sabina') ||
        v.name.toLowerCase().includes('raul')
      ))
    );

    // Si por algún motivo extremo Windows no tiene NINGUNA voz en español instalada:
    if (!spanishVoice) {
      console.warn('No se detectó paquete de voz en español en el sistema operativo.');
    }

    const text = "Portal Comunal de San Juan de Dios. Bienvenido a la plataforma oficial de servicios ciudadanos y desarrollo distrital.";
    const utterance = new SpeechSynthesisUtterance(text);

    if (spanishVoice) {
      utterance.voice = spanishVoice;
      utterance.lang = spanishVoice.lang;
    } else {
      utterance.lang = 'es-ES';
    }

    utterance.rate = 0.9; // Velocidad pausada
    utterance.pitch = 1.0;

    // Forzar ejecución limpia
    window.speechSynthesis.speak(utterance);
  };

  return (
    <header style={{
      backgroundColor: 'var(--surface)',
      borderBottom: '2px solid var(--border)',
      position: 'sticky',
      top: 0,
      zIndex: 2000,
      boxShadow: 'var(--shadow-sm)'
    }}>
      {/* BARRA SUPERIOR DE ACCESIBILIDAD */}
      <div style={{
        backgroundColor: 'var(--surface-subtle)',
        borderBottom: '1px solid var(--border)',
        padding: '0.25rem 1rem',
        fontSize: '0.76rem'
      }}>
        <div className="stitch-container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
          <span style={{ fontWeight: '700', color: 'var(--text-muted)' }}>
            Accesibilidad Universal (Ley 7600):
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <button
              onClick={speakAccessibility}
              title={"Escuchar contenido por voz / Detener"}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.25rem',
                background: 'none',
                color: 'var(--text-main)',
                border: '1px solid var(--border)',
                borderRadius: '4px',
                padding: '0.2rem 0.45rem',
                fontSize: '0.74rem',
                fontWeight: '700',
                cursor: 'pointer'
              }}
            >
              <Volume2 size={13} />
              <span>Voz</span>
            </button>

            <button
              onClick={toggleHighContrast}
              title="Alternar alto contraste"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.25rem',
                background: highContrast ? '#FFFF00' : 'none',
                color: highContrast ? '#000000' : 'var(--text-main)',
                border: '1px solid var(--border)',
                borderRadius: '4px',
                padding: '0.2rem 0.45rem',
                fontSize: '0.74rem',
                fontWeight: '700',
                cursor: 'pointer'
              }}
            >
              <Eye size={13} />
              <span>Contraste</span>
            </button>

            <div style={{ display: 'inline-flex', border: '1px solid var(--border)', borderRadius: '4px' }}>
              <button onClick={decreaseFontSize} title="Reducir letra" style={{ background: 'none', border: 'none', padding: '0.2rem 0.4rem', cursor: 'pointer', fontWeight: '800', fontSize: '0.75rem', color: 'var(--text-main)' }}>A-</button>
              <button onClick={increaseFontSize} title="Aumentar letra" style={{ background: 'none', border: 'none', padding: '0.2rem 0.4rem', cursor: 'pointer', fontWeight: '800', fontSize: '0.85rem', color: 'var(--primary)', borderLeft: '1px solid var(--border)' }}>A+</button>
            </div>

            <button onClick={toggleTheme} title="Tema claro/oscuro" style={{ background: 'none', border: '1px solid var(--border)', borderRadius: '4px', padding: '0.2rem 0.4rem', cursor: 'pointer', display: 'flex', alignItems: 'center', color: 'var(--text-main)' }}>
              {theme === 'dark' ? <Sun size={13} /> : <Moon size={13} />}
            </button>
          </div>
        </div>
      </div>

      {/* NAVBAR PRINCIPAL */}
      <div className="stitch-container" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: '0.65rem',
        paddingBottom: '0.65rem'
      }}>
        <Link to="/" onClick={closeMenu} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', textDecoration: 'none' }}>
          <div style={{ backgroundColor: '#002B7F', color: 'white', fontWeight: '900', fontSize: '0.85rem', padding: '0.3rem 0.55rem', borderRadius: '4px' }}>
            CR
          </div>
          <div>
            <span style={{ fontSize: '1.05rem', fontWeight: '800', color: 'var(--text-main)', display: 'block', lineHeight: 1.1 }}>
              San Juan de Dios
            </span>
            <span style={{ fontSize: '0.68rem', fontWeight: '800', color: '#CE1126', letterSpacing: '0.5px' }}>
              INFORMA
            </span>
          </div>
        </Link>

        <button onClick={() => setMenuOpen(!menuOpen)} className="mobile-hamburger-btn" style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-main)', padding: '0.35rem', display: 'none' }}>
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        <nav className={`main-nav-links ${menuOpen ? 'nav-mobile-open' : ''}`}>
          <NavLink to="/" onClick={closeMenu} className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
            Inicio
          </NavLink>
          <NavLink to="/distrito" onClick={closeMenu} className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
            Nuestro Distrito
          </NavLink>
          <NavLink to="/directorio" onClick={closeMenu} className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
            Comercios
          </NavLink>
          <NavLink to="/marketplace" onClick={closeMenu} className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
            Mercadito
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
          <NavLink to="/reels" onClick={closeMenu} className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
            Reels
          </NavLink>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginLeft: 'auto' }}>
            <div style={{ borderLeft: '1px solid var(--border)', height: '24px', margin: '0 0.5rem' }}></div>
            
            <NavLink to="/asistente" onClick={closeMenu} className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
              Guía IA
            </NavLink>

            <NavLink 
              to="/juego" 
              onClick={closeMenu} 
              title="Minijuego Comunal: La Gesta de Rivas"
              className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'} 
              style={{ 
                display: 'inline-flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                padding: '0.4rem 0.55rem',
                borderRadius: '6px',
                backgroundColor: 'var(--surface-subtle)',
                border: '1px solid var(--border)'
              }}
            >
              <Gamepad2 size={18} color="var(--primary)" />
            </NavLink>

            {user?.role === 'admin' && (
              <NavLink to="/admin" onClick={closeMenu} className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'} style={{ color: '#002B7F', fontWeight: '900' }}>
                Panel ADI
              </NavLink>
            )}

            <div className="auth-btn-wrapper">
              {user ? (
                <button onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', backgroundColor: 'var(--surface-subtle)', color: 'var(--text-main)', border: '1px solid var(--border)', padding: '0.45rem 0.85rem', borderRadius: '4px', fontWeight: '700', fontSize: '0.82rem', cursor: 'pointer', whiteSpace: 'nowrap' }}>
                  <LogOut size={14} /> Salir ({user.name.split(' ')[0]})
                </button>
              ) : (
                <Link to="/login" onClick={closeMenu} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', backgroundColor: '#002B7F', color: 'white', padding: '0.45rem 0.95rem', borderRadius: '4px', fontWeight: '700', fontSize: '0.82rem', textDecoration: 'none', whiteSpace: 'nowrap' }}>
                  <LogIn size={14} /> Ingresar
                </Link>
              )}
            </div>
          </div>
        </nav>
      </div>

      <style>{`
        .main-nav-links { display: flex; align-items: center; gap: 0.85rem; font-size: 0.84rem; font-weight: 600; }
        .nav-link { white-space: nowrap; }
        @media (max-width: 980px) {
          .mobile-hamburger-btn { display: block !important; }
          .main-nav-links { display: none; position: absolute; top: 100%; left: 0; width: 100%; background-color: var(--surface); border-bottom: 2px solid var(--border); box-shadow: 0 10px 25px rgba(0,0,0,0.15); flex-direction: column; align-items: flex-start; padding: 1.25rem 1.5rem; gap: 1rem; z-index: 2500; }
          .main-nav-links.nav-mobile-open { display: flex !important; }
          .nav-link { width: 100%; padding: 0.5rem 0; font-size: 1rem; border-bottom: 1px solid var(--border); }
          .auth-btn-wrapper { margin-left: 0 !important; margin-top: 0.5rem; width: 100%; }
          .auth-btn-wrapper a, .auth-btn-wrapper button { width: 100%; justify-content: center; padding: 0.65rem !important; }
        }
      `}</style>
    </header>
  );
};