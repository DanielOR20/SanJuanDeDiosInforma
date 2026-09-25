import { useState, useEffect } from 'react';
import { CivicServicesWidget } from '../components/CivicServicesWidget';
import { EnvironmentalModule } from '../components/environmental/EnvironmentalModule';
import { Link } from 'react-router-dom';
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
  Calendar
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
    <div className="stitch-container" style={{ padding: '2rem 1rem 4rem 1rem' }}>
      
      {/* FRANJA SUPERIOR: CLIMA EN VIVO & COMUNICADO PRIORITARIO */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '1rem',
        marginBottom: '2rem'
      }}>
        {/* Widget Clima Open-Meteo */}
        <div className="stitch-card" style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderLeft: '4px solid #002B7F' }}>
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: '800', color: '#64748B', textTransform: 'uppercase' }}>
              Estación Climatológica San Juan
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.4rem', marginTop: '0.25rem' }}>
              <span style={{ fontSize: '2rem', fontWeight: '900', color: '#0F172A' }}>
                {weather ? `${Math.round(weather.temperature_2m)}°C` : '22°C'}
              </span>
              <span style={{ fontSize: '0.82rem', color: '#64748B', fontWeight: '600' }}>Distrito 03</span>
            </div>
            <div style={{ display: 'flex', gap: '1rem', fontSize: '0.78rem', color: '#475569', marginTop: '0.25rem' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                <Droplets size={13} color="#002B7F" /> Humedad: {weather ? `${weather.relative_humidity_2m}%` : '78%'}
              </span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                <Wind size={13} color="#002B7F" /> Viento: {weather ? `${weather.wind_speed_10m} km/h` : '14 km/h'}
              </span>
            </div>
          </div>
          <CloudSun size={42} color="#002B7F" />
        </div>

        {/* Boletín Oficial Fijado */}
        {pinnedBulletin && (
          <div className="stitch-card" style={{ padding: '1.25rem', borderLeft: '4px solid #D97706', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', fontWeight: '800', color: '#D97706', textTransform: 'uppercase' }}>
              <Megaphone size={14} /> Comunicado Oficial de la Junta Directiva
            </div>
            <h4 style={{ margin: '0.3rem 0 0.25rem 0', fontSize: '1rem', color: '#0F172A', fontWeight: '800' }}>
              {pinnedBulletin.title}
            </h4>
            <p style={{ margin: 0, fontSize: '0.84rem', color: '#475569', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {pinnedBulletin.summary}
            </p>
          </div>
        )}
      </div>

      {/* ACCESOS RÁPIDOS MUNICIPALES */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))',
        gap: '1.25rem',
        marginBottom: '2.5rem'
      }}>
        <Link to="/directorio" style={{ textDecoration: 'none' }} className="stitch-card quick-access-card">
          <div style={{ padding: '1.5rem' }}>
            <Store size={26} color="#002B7F" style={{ marginBottom: '0.75rem' }} />
            <h3 style={{ fontSize: '1.05rem', fontWeight: '800', color: '#0F172A', margin: '0 0 0.35rem 0' }}>Comercio Local</h3>
            <p style={{ fontSize: '0.84rem', color: '#64748B', margin: 0 }}>Directorio con enlace a WhatsApp y ubicación GPS de negocios del distrito.</p>
          </div>
        </Link>

        <Link to="/agenda" style={{ textDecoration: 'none' }} className="stitch-card quick-access-card">
          <div style={{ padding: '1.5rem' }}>
            <Bus size={26} color="#002B7F" style={{ marginBottom: '0.75rem' }} />
            <h3 style={{ fontSize: '1.05rem', fontWeight: '800', color: '#0F172A', margin: '0 0 0.35rem 0' }}>Transporte & Rutas</h3>
            <p style={{ fontSize: '0.84rem', color: '#64748B', margin: 0 }}>Calculadora de tarifas ARESEP, frecuencias y cronograma de basura.</p>
          </div>
        </Link>

        <Link to="/avisos" style={{ textDecoration: 'none' }} className="stitch-card quick-access-card">
          <div style={{ padding: '1.5rem' }}>
            <AlertTriangle size={26} color="#DC2626" style={{ marginBottom: '0.75rem' }} />
            <h3 style={{ fontSize: '1.05rem', fontWeight: '800', color: '#0F172A', margin: '0 0 0.35rem 0' }}>Avisos & Averías</h3>
            <p style={{ fontSize: '0.84rem', color: '#64748B', margin: 0 }}>Monitor de cuadrillas AyA/CNFL con votación de afectación vecinal.</p>
          </div>
        </Link>

        <Link to="/foro" style={{ textDecoration: 'none' }} className="stitch-card quick-access-card">
          <div style={{ padding: '1.5rem' }}>
            <MessageSquareWarning size={26} color="#D97706" style={{ marginBottom: '0.75rem' }} />
            <h3 style={{ fontSize: '1.05rem', fontWeight: '800', color: '#0F172A', margin: '0 0 0.35rem 0' }}>Tribuna Ciudadana</h3>
            <p style={{ fontSize: '0.84rem', color: '#64748B', margin: 0 }}>Denuncias públicas vecinales moderadas por la ADI con debate comunitario.</p>
          </div>
        </Link>
      </div>

      {/* SECCIÓN DEL MAPA DISTRITAL GEOREFERENCIADO */}
      <div style={{ marginBottom: '3rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: '#002B7F', fontWeight: '800', fontSize: '0.85rem' }}>
              <ShieldCheck size={16} /> Sistema de Información Geográfica Comunal (SIG)
            </div>
            <h2 style={{ fontSize: '1.45rem', fontWeight: '900', color: '#0F172A', margin: '0.2rem 0 0 0' }}>
              Mapa Territorial Interactivo de San Juan de Dios
            </h2>
          </div>
          <span style={{ fontSize: '0.82rem', color: '#64748B' }}>
            Haga clic en los sectores delimitados o marcadores para ver cuadrillas y detalles
          </span>
        </div>

        <EnvironmentalModule /> 
        <CivicServicesWidget />
        <DistrictMap 
          notices={notices} 
          businesses={businesses} 
          landmarks={landmarks} 
        />
      </div>

    </div>
  );
};