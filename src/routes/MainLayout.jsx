import { Outlet, Link } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  ShieldAlert, 
  ExternalLink,
  ChevronRight
} from 'lucide-react';

const FooterInternal = () => {
  return (
    <footer style={{
      backgroundColor: '#F1F5F9', // Gris claro institucional limpio
      color: '#1E293B',
      marginTop: 'auto',
      borderTop: '3px solid #002B7F', // Azul bandera CR
      position: 'relative',
      zIndex: 10
    }}>
      {/* FRANJA DE EMERGENCIA: Rojo y blanco sobrio de atención rápida */}
      <div style={{
        backgroundColor: '#002B7F',
        color: '#FFFFFF',
        padding: '0.75rem 1rem',
        fontSize: '0.84rem'
      }}>
        <div className="stitch-container" style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '0.75rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '700' }}>
            <ShieldAlert size={17} color="#FDE047" />
            <span>Líneas de Asistencia Inmediata:</span>
          </div>
          <div style={{ display: 'flex', gap: '1.25rem', flexWrap: 'wrap', fontSize: '0.82rem' }}>
            <span>Emergencias: <strong>9-1-1</strong></span>
            <span>Delegación Policial San Juan: <strong>2250-4112</strong></span>
            <span>AyA Averías: <strong>800-737-6783</strong></span>
            <span>CNFL Electricidad: <strong>1026</strong></span>
          </div>
        </div>
      </div>

      {/* CUERPO DEL FOOTER */}
      <div className="stitch-container" style={{
        paddingTop: '3rem',
        paddingBottom: '2.5rem',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '2.5rem'
      }}>
        
        {/* COLUMNA 1: IDENTIDAD */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.85rem' }}>
            <div style={{
              backgroundColor: '#002B7F',
              color: '#FFFFFF',
              fontWeight: '900',
              fontSize: '0.85rem',
              padding: '0.3rem 0.55rem',
              borderRadius: '4px'
            }}>
              CR
            </div>
            <div>
              <span style={{ fontSize: '1.05rem', fontWeight: '800', color: '#0F172A', display: 'block', lineHeight: 1.1 }}>
                San Juan de Dios
              </span>
              <span style={{ fontSize: '0.7rem', fontWeight: '800', color: '#CE1126', letterSpacing: '0.5px' }}>
                INFORMA
              </span>
            </div>
          </div>

          <p style={{ fontSize: '0.84rem', color: '#475569', lineHeight: 1.55, margin: '0 0 1rem 0' }}>
            Portal cívico y de servicios del Distrito 03 del Cantón de Desamparados. Desarrollado para la transparencia comunal, coordinación de averías y participación ciudadana.
          </p>

          <div style={{ fontSize: '0.75rem', color: '#64748B', lineHeight: 1.4 }}>
            En coordinación con la <strong>Asociación de Desarrollo Integral (ADI)</strong> y la Municipalidad de Desamparados.
          </div>
        </div>

        {/* COLUMNA 2: SERVICIOS */}
        <div>
          <h4 style={{ fontSize: '0.88rem', fontWeight: '800', marginBottom: '1rem', color: '#002B7F', textTransform: 'uppercase', letterSpacing: '0.4px' }}>
            Servicios Comunales
          </h4>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.55rem', fontSize: '0.85rem' }}>
            <li>
              <Link to="/directorio" style={{ color: '#334155', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.35rem', fontWeight: '600' }}>
                <ChevronRight size={14} color="#002B7F" /> Directorio Comercial
              </Link>
            </li>
            <li>
              <Link to="/agenda" style={{ color: '#334155', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.35rem', fontWeight: '600' }}>
                <ChevronRight size={14} color="#002B7F" /> Horarios de Buses y Recolección
              </Link>
            </li>
            <li>
              <Link to="/avisos" style={{ color: '#334155', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.35rem', fontWeight: '600' }}>
                <ChevronRight size={14} color="#002B7F" /> Reportes de Averías y Cortes
              </Link>
            </li>
            <li>
              <Link to="/foro" style={{ color: '#334155', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.35rem', fontWeight: '600' }}>
                <ChevronRight size={14} color="#002B7F" /> Tribuna y Denuncias Públicas
              </Link>
            </li>
            <li>
              <Link to="/asistente" style={{ color: '#334155', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.35rem', fontWeight: '600' }}>
                <ChevronRight size={14} color="#002B7F" /> Guía Distrital IA
              </Link>
            </li>
          </ul>
        </div>

        {/* COLUMNA 3: SEDE */}
        <div>
          <h4 style={{ fontSize: '0.88rem', fontWeight: '800', marginBottom: '1rem', color: '#002B7F', textTransform: 'uppercase', letterSpacing: '0.4px' }}>
            Atención Ciudadana
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.84rem', color: '#475569' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
              <MapPin size={16} color="#002B7F" style={{ flexShrink: 0, marginTop: '0.15rem' }} />
              <span>Costado este de la Plaza de Deportes, frente al Salón Comunal.</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Phone size={16} color="#002B7F" style={{ flexShrink: 0 }} />
              <span>(506) 2250-0000 • Sede Central</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Mail size={16} color="#002B7F" style={{ flexShrink: 0 }} />
              <span>administracion@sanjuan.go.cr</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
              <Clock size={16} color="#002B7F" style={{ flexShrink: 0, marginTop: '0.15rem' }} />
              <span>Lunes a Viernes: 8:00 AM - 4:00 PM</span>
            </div>
          </div>
        </div>

        {/* COLUMNA 4: SECTORES */}
        <div>
          <h4 style={{ fontSize: '0.88rem', fontWeight: '800', marginBottom: '1rem', color: '#002B7F', textTransform: 'uppercase', letterSpacing: '0.4px' }}>
            Comunidades Atendidas
          </h4>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
            {[
              'San Juan Centro',
              'Calle Fallas',
              'Barrio Novedades',
              'Poás',
              'San Rafael Abajo',
              'Plaza Deportiva',
              'El Cruce',
              'La Quebrada'
            ].map(sec => (
              <span key={sec} style={{
                fontSize: '0.74rem',
                fontWeight: '600',
                padding: '0.25rem 0.5rem',
                borderRadius: '4px',
                backgroundColor: '#FFFFFF',
                border: '1px solid #CBD5E1',
                color: '#334155'
              }}>
                {sec}
              </span>
            ))}
          </div>

          <div style={{ marginTop: '1.25rem' }}>
            <a 
              href="https://www.desamparados.go.cr" 
              target="_blank" 
              rel="noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                fontSize: '0.8rem',
                fontWeight: '700',
                color: '#002B7F',
                textDecoration: 'none'
              }}
            >
              <span>Municipalidad de Desamparados</span>
              <ExternalLink size={13} />
            </a>
          </div>
        </div>

      </div>

      {/* BARRA DE DERECHOS */}
      <div style={{
        borderTop: '1px solid #CBD5E1',
        padding: '1rem 1rem',
        fontSize: '0.8rem',
        color: '#64748B',
        backgroundColor: '#E2E8F0'
      }}>
        <div className="stitch-container" style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '0.5rem'
        }}>
          <div>
            © 2026 <strong>San Juan de Dios Informa</strong> • Distrito 03, Desamparados.
          </div>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <span>Transparencia Distrital</span>
            <span>•</span>
            <span>Ley N° 3859</span>
            <span>•</span>
            <span>Costa Rica</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export const MainLayout = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      {/* Margen inferior para que el contenido respire antes del pie */}
      <main style={{ flex: 1, paddingBottom: '3rem' }}>
        <Outlet />
      </main>
      <FooterInternal />
    </div>
  );
};