import { Link } from 'react-router-dom';
import { 
  Building2, 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  ShieldAlert, 
  ExternalLink,
  ChevronRight
} from 'lucide-react';

export const Footer = () => {
  return (
    <footer style={{
      backgroundColor: 'var(--surface)',
      borderTop: '2px solid var(--border)',
      color: 'var(--text-main)',
      marginTop: 'auto',
      position: 'relative',
      zIndex: 10
    }}>
      {/* FRANJA DE CONTACTOS DE EMERGENCIA */}
      <div style={{
        backgroundColor: 'var(--primary)',
        color: '#FFFFFF',
        padding: '0.85rem 1rem',
        fontSize: '0.85rem'
      }}>
        <div className="stitch-container" style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '0.75rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '700' }}>
            <ShieldAlert size={18} color="#FDE047" />
            <span>Líneas de Atención Distrital y Emergencias:</span>
          </div>
          <div style={{ display: 'flex', gap: '1.25rem', flexWrap: 'wrap', fontWeight: '600', fontSize: '0.82rem' }}>
            <span>Emergencias: <strong>9-1-1</strong></span>
            <span>Delegación Policial San Juan: <strong>2250-4112</strong></span>
            <span>Averías AyA: <strong>800-737-6783</strong></span>
            <span>Averías CNFL: <strong>1026</strong></span>
          </div>
        </div>
      </div>

      {/* CUERPO PRINCIPAL DEL FOOTER */}
      <div className="stitch-container" style={{
        paddingTop: '3rem',
        paddingBottom: '2.5rem',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '2.5rem'
      }}>
        
        {/* COLUMNA 1: IDENTIDAD DISTRITAL */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.85rem' }}>
            <div style={{
              backgroundColor: 'var(--primary)',
              color: 'white',
              fontWeight: '900',
              fontSize: '0.85rem',
              padding: '0.35rem 0.6rem',
              borderRadius: 'var(--radius-sm)'
            }}>
              CR
            </div>
            <div>
              <span style={{ fontSize: '1.05rem', fontWeight: '800', display: 'block', lineHeight: 1.1 }}>
                San Juan de Dios
              </span>
              <span style={{ fontSize: '0.7rem', fontWeight: '700', color: 'var(--primary)', letterSpacing: '0.5px' }}>
                INFORMA
              </span>
            </div>
          </div>

          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.5, margin: '0 0 1rem 0' }}>
            Plataforma cívica y comunitaria oficial del Distrito 03 del Cantón de Desamparados. Promoviendo la transparencia, la participación ciudadana y el desarrollo integral distrital.
          </p>

          <div style={{ fontSize: '0.78rem', color: 'var(--text-subtle)', lineHeight: 1.4 }}>
            Bajo el amparo de la <strong>Ley N° 3859</strong> sobre Desarrollo de la Comunidad y articulación con el Gobierno Local de Desamparados.
          </div>
        </div>

        {/* COLUMNA 2: NAVEGACIÓN Y SERVICIOS */}
        <div>
          <h4 style={{ fontSize: '0.95rem', fontWeight: '800', marginBottom: '1.1rem', color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Servicios Ciudadanos
          </h4>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.86rem' }}>
            <li>
              <Link to="/directorio" style={{ color: 'var(--text-muted)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                <ChevronRight size={14} color="var(--primary)" /> Directorio Comercial
              </Link>
            </li>
            <li>
              <Link to="/agenda" style={{ color: 'var(--text-muted)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                <ChevronRight size={14} color="var(--primary)" /> Horarios de Buses y Recolección
              </Link>
            </li>
            <li>
              <Link to="/avisos" style={{ color: 'var(--text-muted)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                <ChevronRight size={14} color="var(--primary)" /> Monitor de Averías AyA / CNFL
              </Link>
            </li>
            <li>
              <Link to="/foro" style={{ color: 'var(--text-muted)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                <ChevronRight size={14} color="var(--primary)" /> Cabildo y Denuncias Públicas
              </Link>
            </li>
            <li>
              <Link to="/asistente" style={{ color: 'var(--text-muted)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                <ChevronRight size={14} color="var(--primary)" /> Guía y Asistente Distrital IA
              </Link>
            </li>
          </ul>
        </div>

        {/* COLUMNA 3: SEDE Y ATENCIÓN CIUDADANA */}
        <div>
          <h4 style={{ fontSize: '0.95rem', fontWeight: '800', marginBottom: '1.1rem', color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Sede Comunal y Atención
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
              <MapPin size={16} color="var(--primary)" style={{ flexShrink: 0, marginTop: '0.2rem' }} />
              <span>Costado este de la Plaza de Deportes, frente al Salón Comunal, San Juan de Dios Centro.</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Phone size={16} color="var(--primary)" style={{ flexShrink: 0 }} />
              <span>(506) 2250-0000 / Oficina Comunal</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Mail size={16} color="var(--primary)" style={{ flexShrink: 0 }} />
              <span>administracion@sanjuan.go.cr</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
              <Clock size={16} color="var(--primary)" style={{ flexShrink: 0, marginTop: '0.2rem' }} />
              <span>Lunes a Viernes: 8:00 AM - 4:00 PM</span>
            </div>
          </div>
        </div>

        {/* COLUMNA 4: SECTORES DEL DISTRITO */}
        <div>
          <h4 style={{ fontSize: '0.95rem', fontWeight: '800', marginBottom: '1.1rem', color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Sectores del Distrito
          </h4>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
            {[
              'San Juan Centro',
              'Calle Fallas',
              'Barrio Novedades',
              'Sector Poás',
              'Límite San Rafael Abajo',
              'Plaza de Deportes',
              'Barrio El Cruce',
              'La Quebrada'
            ].map(sec => (
              <span key={sec} style={{
                fontSize: '0.75rem',
                fontWeight: '600',
                padding: '0.25rem 0.55rem',
                borderRadius: '4px',
                backgroundColor: 'var(--surface-subtle)',
                border: '1px solid var(--border)',
                color: 'var(--text-muted)'
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
                color: 'var(--primary)',
                textDecoration: 'none'
              }}
            >
              <span>Portal Municipalidad de Desamparados</span>
              <ExternalLink size={13} />
            </a>
          </div>
        </div>

      </div>

      {/* BARRA INFERIOR DE DERECHOS */}
      <div style={{
        borderTop: '1px solid var(--border)',
        padding: '1.25rem 1rem',
        fontSize: '0.82rem',
        color: 'var(--text-muted)',
        backgroundColor: 'var(--surface-subtle)'
      }}>
        <div className="stitch-container" style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '0.75rem'
        }}>
          <div>
            © 2026 <strong>San Juan de Dios Informa</strong>. Portal Comunitario y Ciudadano. Todos los derechos reservados.
          </div>
          <div style={{ display: 'flex', gap: '1rem', fontSize: '0.78rem' }}>
            <span>Términos de Convivencia Digital</span>
            <span>•</span>
            <span>Transparencia Distrital</span>
            <span>•</span>
            <span>Desamparados, San José, Costa Rica</span>
          </div>
        </div>
      </div>
    </footer>
  );
};