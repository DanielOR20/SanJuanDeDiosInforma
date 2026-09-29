import { useState, useEffect } from 'react';
import { CivicServicesWidget } from '../components/CivicServicesWidget';
import { EnvironmentalModule } from '../components/environmental/EnvironmentalModule';
import { Link } from 'react-router-dom';
import HeroCarousel from '../components/HeroCarousel';
import { 
  getLocalWeather, 
  getNotices, 
  getBusinesses, 
  getLandmarks,
  getBulletins 
} from '../services/api';
import { DistrictMap } from '../components/DistrictMap';
import { 
  CloudSun, 
  Wind, 
  Droplets, 
  AlertTriangle, 
  Store, 
  Bus, 
  MessageSquareWarning, 
  Bot, 
  ArrowRight,
  ShieldCheck,
  Megaphone,
  Calendar,
  FileText,
  Map,
  Clock,
  Mail,
  PhoneCall,
  MapPin,
  Activity,
  ChevronRight,
  ShieldAlert
} from 'lucide-react';

export const Home = () => {
  const [weather, setWeather] = useState(null);
  const [notices, setNotices] = useState([]);
  const [businesses, setBusinesses] = useState([]);
  const [landmarks, setLandmarks] = useState([]);
  const [bulletins, setBulletins] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [wData, nData, bData, lData, bulData] = await Promise.all([
          getLocalWeather().catch(() => null),
          getNotices().catch(() => []),
          getBusinesses().catch(() => []),
          getLandmarks().catch(() => []),
          getBulletins().catch(() => [])
        ]);

        setWeather(wData?.current || null);
        setNotices(nData || []);
        setBusinesses(bData || []);
        setLandmarks(lData || []);
        setBulletins(bulData || []);
      } catch (err) {
        console.error('Error al inicializar portal principal:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const pinnedBulletin = bulletins.find(b => b.isPinned) || bulletins[0];

  return (
    <>
      <HeroCarousel />
      
      {/* CINTILLO RÁPIDO DE TRÁMITES Y GESTIÓN CIUDADANA - ESTILO TABULAR */}
      <div style={{ backgroundColor: '#002B7F', color: 'white', borderBottom: '4px solid #1E3A8A' }}>
        <div className="stitch-container" style={{ padding: '0', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
          <Link to="/foro" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', padding: '1.25rem 1rem', color: 'white', textDecoration: 'none', borderRight: '1px solid rgba(255,255,255,0.2)', borderBottom: '1px solid rgba(255,255,255,0.2)', transition: 'background-color 0.2s', fontWeight: '700', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }} onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#1E3A8A'} onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
            <FileText size={18} /> Trámites y Denuncias
          </Link>
          <Link to="/agenda" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', padding: '1.25rem 1rem', color: 'white', textDecoration: 'none', borderRight: '1px solid rgba(255,255,255,0.2)', borderBottom: '1px solid rgba(255,255,255,0.2)', transition: 'background-color 0.2s', fontWeight: '700', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }} onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#1E3A8A'} onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
            <Bus size={18} /> Rutas de Bus Lared
          </Link>
          <Link to="/marketplace" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', padding: '1.25rem 1rem', color: 'white', textDecoration: 'none', borderRight: '1px solid rgba(255,255,255,0.2)', borderBottom: '1px solid rgba(255,255,255,0.2)', transition: 'background-color 0.2s', fontWeight: '700', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }} onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#1E3A8A'} onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
            <Store size={18} /> Mercadito Vecinal
          </Link>
          <Link to="/distrito" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', padding: '1.25rem 1rem', color: 'white', textDecoration: 'none', transition: 'background-color 0.2s', fontWeight: '700', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1px solid rgba(255,255,255,0.2)' }} onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#1E3A8A'} onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
            <Map size={18} /> Conozca el Distrito
          </Link>
        </div>
      </div>

      <div className="stitch-container" style={{ padding: '3rem 1rem 4rem 1rem', maxWidth: '1200px', margin: '0 auto' }}>
        
        {/* TABLERO ASIMÉTRICO 70/30 ESTILO GACETA OFICIAL */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2.5rem', marginBottom: '4rem', alignItems: 'start' }}>
          
          {/* COLUMNA IZQUIERDA (70%) - NOTICIAS FORMATO BOLETÍN */}
          <div className="news-column" style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
            <div style={{ borderBottom: '4px solid #0F172A', paddingBottom: '0.5rem', marginBottom: '2rem' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: '800', color: '#002B7F', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', marginBottom: '0.25rem' }}>Publicaciones Oficiales</span>
              <h2 style={{ fontSize: '1.8rem', fontWeight: '900', color: '#0F172A', margin: 0, fontFamily: 'serif', letterSpacing: '-0.02em' }}>
                Gaceta del Distrito 03
              </h2>
            </div>
            
            {/* Artículo Principal */}
            <article style={{ borderBottom: '1px solid #CBD5E1', paddingBottom: '2rem', marginBottom: '2rem' }}>
              <div style={{ display: 'flex', gap: '1.5rem', flexDirection: 'row', flexWrap: 'wrap' }}>
                <div style={{ flex: '1 1 300px' }}>
                  <img src="https://images.unsplash.com/photo-1596704017254-9b121068fb31?auto=format&fit=crop&w=800&q=80" alt="Mejoras viales" style={{ width: '100%', height: 'auto', display: 'block' }} />
                </div>
                <div style={{ flex: '1 1 300px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <span style={{ fontSize: '0.7rem', fontWeight: '800', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.75rem', borderLeft: '2px solid #002B7F', paddingLeft: '0.5rem' }}>INFRAESTRUCTURA • {new Date().toLocaleDateString()}</span>
                  <h3 style={{ fontSize: '1.45rem', fontWeight: '800', color: '#0F172A', margin: '0 0 1rem 0', lineHeight: 1.25 }}>Plan Integral de Mejora en Aceras y Vías Principales</h3>
                  <p style={{ color: '#334155', margin: '0 0 1.25rem 0', lineHeight: 1.6, fontSize: '0.95rem', textAlign: 'justify' }}>
                    La Asociación de Desarrollo Integral informa del inicio de las labores de recarpeteo y demarcación peatonal en el casco central de San Juan de Dios y Calle Máquinas, buscando garantizar la seguridad de todas las familias residentes.
                  </p>
                  <Link to="/foro" style={{ color: '#002B7F', fontWeight: '700', textDecoration: 'underline', fontSize: '0.9rem', display: 'inline-flex', alignItems: 'center', gap: '0.2rem', textUnderlineOffset: '4px' }} onMouseOver={(e) => e.currentTarget.style.color = '#1E3A8A'} onMouseOut={(e) => e.currentTarget.style.color = '#002B7F'}>
                    Leer documento oficial <ChevronRight size={14} />
                  </Link>
                </div>
              </div>
            </article>

            {/* Artículos Secundarios (Filas) */}
            <article style={{ display: 'flex', gap: '1.5rem', borderBottom: '1px solid #CBD5E1', paddingBottom: '1.5rem', marginBottom: '1.5rem' }}>
              <div style={{ backgroundColor: '#0F172A', color: 'white', width: '60px', height: '60px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <span style={{ fontSize: '1.25rem', fontWeight: '900', lineHeight: 1 }}>01</span>
                <span style={{ fontSize: '0.65rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', marginTop: '2px' }}>OCT</span>
              </div>
              <div style={{ flex: 1 }}>
                <span style={{ fontSize: '0.7rem', fontWeight: '800', color: '#D97706', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.35rem', display: 'block' }}>CONVOCATORIA ADI</span>
                <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1.1rem', fontWeight: '800', color: '#0F172A' }}>
                  <Link to="/agenda" style={{ color: 'inherit', textDecoration: 'none' }} onMouseOver={(e) => e.currentTarget.style.textDecoration = 'underline'} onMouseOut={(e) => e.currentTarget.style.textDecoration = 'none'}>Sesión Ordinaria Abierta a Vecinos</Link>
                </h4>
                <p style={{ margin: 0, fontSize: '0.9rem', color: '#475569', lineHeight: 1.5 }}>Se convoca a la asamblea comunal en el Salón Principal para rendición de presupuestos del Q3.</p>
              </div>
            </article>

            <article style={{ display: 'flex', gap: '1.5rem', borderBottom: '1px solid #CBD5E1', paddingBottom: '1.5rem', marginBottom: '1.5rem' }}>
              <div style={{ backgroundColor: '#059669', color: 'white', width: '60px', height: '60px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <span style={{ fontSize: '1.25rem', fontWeight: '900', lineHeight: 1 }}>05</span>
                <span style={{ fontSize: '0.65rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', marginTop: '2px' }}>OCT</span>
              </div>
              <div style={{ flex: 1 }}>
                <span style={{ fontSize: '0.7rem', fontWeight: '800', color: '#059669', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.35rem', display: 'block' }}>MEDIO AMBIENTE</span>
                <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1.1rem', fontWeight: '800', color: '#0F172A' }}>
                  <Link to="/agenda" style={{ color: 'inherit', textDecoration: 'none' }} onMouseOver={(e) => e.currentTarget.style.textDecoration = 'underline'} onMouseOut={(e) => e.currentTarget.style.textDecoration = 'none'}>Gran Campaña de Reciclaje y No Tradicionales</Link>
                </h4>
                <p style={{ margin: 0, fontSize: '0.9rem', color: '#475569', lineHeight: 1.5 }}>Recolección prioritaria en los sectores Itaipú, Novedades y Calabacitas.</p>
              </div>
            </article>

          </div>

          {/* COLUMNA DERECHA (30%) - PANEL SÓLIDO DE UTILIDAD */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            
            {/* Panel de Seguridad y Emergencias */}
            <div style={{ backgroundColor: '#0F172A', color: 'white', padding: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                <ShieldAlert size={24} color="#FDE047" />
                <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Seguridad y Apoyo
                </h3>
              </div>
              
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <li>
                  <span style={{ fontSize: '0.75rem', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '0.2rem' }}>Delegación Policial SJD</span>
                  <a href="tel:22504112" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: 'rgba(255,255,255,0.1)', padding: '0.75rem 1rem', color: 'white', textDecoration: 'none', fontFamily: 'monospace', fontSize: '1.1rem', fontWeight: '700', borderLeft: '3px solid #3B82F6', transition: 'background-color 0.2s' }} onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.15)'} onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)'}>
                    2250-4112 <PhoneCall size={18} opacity={0.7} />
                  </a>
                </li>
                <li>
                  <span style={{ fontSize: '0.75rem', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '0.2rem' }}>Cruz Roja Desamparados</span>
                  <a href="tel:22596411" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: 'rgba(255,255,255,0.1)', padding: '0.75rem 1rem', color: 'white', textDecoration: 'none', fontFamily: 'monospace', fontSize: '1.1rem', fontWeight: '700', borderLeft: '3px solid #EF4444', transition: 'background-color 0.2s' }} onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.15)'} onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)'}>
                    2259-6411 <PhoneCall size={18} opacity={0.7} />
                  </a>
                </li>
                <li>
                  <span style={{ fontSize: '0.75rem', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '0.2rem' }}>Emergencias Nacionales</span>
                  <a href="tel:911" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#DC2626', padding: '0.75rem 1rem', color: 'white', textDecoration: 'none', fontFamily: 'monospace', fontSize: '1.25rem', fontWeight: '800', transition: 'background-color 0.2s' }} onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#B91C1C'} onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#DC2626'}>
                    9-1-1 <AlertTriangle size={18} opacity={0.9} />
                  </a>
                </li>
              </ul>

              <div style={{ borderTop: '1px solid rgba(255,255,255,0.15)', marginTop: '1.5rem', paddingTop: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <span style={{ fontSize: '0.7rem', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Clima Actual SJD</span>
                  <div style={{ fontSize: '1.75rem', fontWeight: '900', display: 'flex', alignItems: 'baseline', gap: '0.25rem' }}>
                    {weather ? `${Math.round(weather.temperature_2m)}°C` : '22°C'}
                  </div>
                </div>
                <CloudSun size={38} color="#94A3B8" />
              </div>
            </div>

            {/* Panel de Horarios Institucionales */}
            <div style={{ backgroundColor: '#E2E8F0', padding: '2rem', borderTop: '4px solid #002B7F' }}>
              <h3 style={{ margin: '0 0 1rem 0', fontSize: '1rem', fontWeight: '800', color: '#0F172A', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Atención Institucional ADI</h3>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '0.85rem', color: '#334155', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                <li style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                  <Clock size={16} color="#002B7F" style={{ marginTop: '2px', flexShrink: 0 }} />
                  <span><strong>Lunes a Viernes</strong><br/>8:00 a.m. a 4:00 p.m.</span>
                </li>
                <li style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                  <MapPin size={16} color="#002B7F" style={{ marginTop: '2px', flexShrink: 0 }} />
                  <span><strong>Sede Principal</strong><br/>Salón Comunal, Contiguo a la Plaza de Deportes.</span>
                </li>
                <li style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                  <Mail size={16} color="#002B7F" style={{ marginTop: '2px', flexShrink: 0 }} />
                  <span>info@sanjuandedios.cr</span>
                </li>
              </ul>
            </div>

          </div>
        </div>

        <hr style={{ border: 'none', borderBottom: '1px solid #CBD5E1', margin: '4rem 0' }} />

        {/* RESTO DE LOS COMPONENTES MANTIENEN SU DISEÑO PERO SIN SHADOWS */}
        <div style={{ marginBottom: '4rem' }}>
          <h2 style={{ fontSize: '1.4rem', fontWeight: '900', color: '#0F172A', borderBottom: '3px solid #002B7F', paddingBottom: '0.5rem', marginBottom: '2rem', display: 'inline-block', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Ventanilla Distrital y Servicios
          </h2>
          <CivicServicesWidget />
        </div>

        <div style={{ marginBottom: '4rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem', borderBottom: '3px solid #0F172A', paddingBottom: '0.5rem', marginBottom: '2rem' }}>
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: '#002B7F', fontWeight: '800', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                <ShieldCheck size={14} /> Sistema de Información Geográfica Comunal (SIG)
              </div>
              <h2 style={{ fontSize: '1.4rem', fontWeight: '900', color: '#0F172A', margin: '0.2rem 0 0 0', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Mapa Interactivo
              </h2>
            </div>
            <span style={{ fontSize: '0.8rem', color: '#64748B', fontWeight: '600' }}>
              Consulte cuadrillas, locales y puntos de referencia.
            </span>
          </div>
          <DistrictMap 
            notices={notices} 
            businesses={businesses} 
            landmarks={landmarks} 
          />
        </div>

        <div style={{ marginTop: '4rem' }}>
          <EnvironmentalModule /> 
        </div>

      </div>

      <style>{`
        @media (min-width: 992px) {
          .news-column {
            grid-column: span 2;
          }
        }
        @media (max-width: 991px) {
          .news-column {
            grid-column: span 1;
          }
        }
        .stitch-card {
          box-shadow: none !important;
          border-radius: 4px !important;
          border: 1px solid #E2E8F0 !important;
        }
      `}</style>
    </>
  );
};