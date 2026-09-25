import { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polygon, Tooltip } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Layers } from 'lucide-react';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const createCustomIcon = (bgColor) => {
  return L.divIcon({
    className: 'custom-map-marker',
    html: `
      <div style="
        background-color: ${bgColor};
        border: 2px solid #FFFFFF;
        width: 22px;
        height: 22px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 2px 5px rgba(0,0,0,0.35);
      ">
        <div style="width: 7px; height: 7px; background: white; border-radius: 50%;"></div>
      </div>
    `,
    iconSize: [22, 22],
    iconAnchor: [11, 11],
    popupAnchor: [0, -11]
  });
};

const iconNotice = createCustomIcon('#DC2626');
const iconBiz = createCustomIcon('#059669');
const iconCivic = createCustomIcon('#002B7F');

// Polígonos ubicados exactamente dentro del área de San Juan de Dios (Vía 217)
const SECTORS_POLYGONS = [
  {
    name: 'San Juan Centro / Padrón Monge (Vía 217)',
    color: '#002B7F',
    fillColor: '#002B7F',
    fillOpacity: 0.14,
    coords: [
      [9.8690, -84.0955],
      [9.8690, -84.0885],
      [9.8625, -84.0885],
      [9.8625, -84.0955]
    ],
    info: 'Sector central: Salón Comunal ADI, Parroquia, Escuela y locales comerciales sobre la Vía 217.'
  },
  {
    name: 'Itaipú / Calabacitas',
    color: '#D97706',
    fillColor: '#D97706',
    fillOpacity: 0.14,
    coords: [
      [9.8735, -84.0980],
      [9.8735, -84.0920],
      [9.8690, -84.0920],
      [9.8690, -84.0980]
    ],
    info: 'Zona residencial norte del distrito, conectando hacia Calabacitas y Los Ángeles.'
  },
  {
    name: 'Sector Máquinas / Límite Sur',
    color: '#059669',
    fillColor: '#059669',
    fillOpacity: 0.14,
    coords: [
      [9.8625, -84.0970],
      [9.8625, -84.0900],
      [9.8565, -84.0900],
      [9.8565, -84.0970]
    ],
    info: 'Sector residencial y agrícola sur hacia Calle Máquinas.'
  }
];

export const DistrictMap = ({ notices = [], businesses = [], landmarks = [] }) => {
  const [showNotices, setShowNotices] = useState(true);
  const [showBusinesses, setShowBusinesses] = useState(true);
  const [showCivic, setShowCivic] = useState(true);
  const [showPolygons, setShowPolygons] = useState(true);
  const [selectedSector, setSelectedSector] = useState(null);

  // Coordenadas centrales en el centro del círculo negro (Vía 217)
  const center = [9.8655, -84.0925];

  return (
    <div style={{ position: 'relative', width: '100%', height: '520px', borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--border)' }}>
      
      {/* Control flotante de capas */}
      <div style={{
        position: 'absolute',
        top: '12px',
        right: '12px',
        zIndex: 1000,
        backgroundColor: '#FFFFFF',
        borderRadius: '6px',
        padding: '0.75rem',
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        border: '1px solid #CBD5E1',
        fontSize: '0.82rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.45rem',
        minWidth: '200px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: '800', color: '#0F172A', marginBottom: '0.2rem' }}>
          <Layers size={15} color="#002B7F" />
          <span>Capas Distrito 03</span>
        </div>

        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', color: '#334155' }}>
          <input 
            type="checkbox" 
            checked={showNotices} 
            onChange={e => setShowNotices(e.target.checked)} 
            style={{ cursor: 'pointer' }}
          />
          <span style={{ display: 'inline-block', width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#DC2626' }}></span>
          Averías ({notices.length})
        </label>

        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', color: '#334155' }}>
          <input 
            type="checkbox" 
            checked={showBusinesses} 
            onChange={e => setShowBusinesses(e.target.checked)} 
            style={{ cursor: 'pointer' }}
          />
          <span style={{ display: 'inline-block', width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#059669' }}></span>
          Comercios ({businesses.filter(b => b.verified).length})
        </label>

        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', color: '#334155' }}>
          <input 
            type="checkbox" 
            checked={showCivic} 
            onChange={e => setShowCivic(e.target.checked)} 
            style={{ cursor: 'pointer' }}
          />
          <span style={{ display: 'inline-block', width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#002B7F' }}></span>
          Puntos Cívicos ({landmarks.length})
        </label>

        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', color: '#334155' }}>
          <input 
            type="checkbox" 
            checked={showPolygons} 
            onChange={e => setShowPolygons(e.target.checked)} 
            style={{ cursor: 'pointer' }}
          />
          <span style={{ display: 'inline-block', width: '10px', height: '10px', borderRadius: '2px', backgroundColor: '#94A3B8' }}></span>
          Sectores Oficiales
        </label>
      </div>

      {/* Info Flotante de Sector */}
      {selectedSector && (
        <div style={{
          position: 'absolute',
          bottom: '16px',
          left: '16px',
          zIndex: 1000,
          backgroundColor: '#FFFFFF',
          borderRadius: '6px',
          padding: '0.85rem 1.15rem',
          boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
          border: '2px solid #002B7F',
          maxWidth: '340px',
          fontSize: '0.84rem'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
            <strong style={{ color: '#002B7F', fontSize: '0.92rem' }}>{selectedSector.name}</strong>
            <button 
              onClick={() => setSelectedSector(null)} 
              style={{ background: 'none', border: 'none', cursor: 'pointer', fontWeight: '800', color: '#64748B' }}
            >
              ×
            </button>
          </div>
          <p style={{ margin: 0, color: '#334155', lineHeight: 1.4 }}>
            {selectedSector.info}
          </p>
        </div>
      )}

      {/* Mapa Leaflet centrado en el círculo negro */}
      <MapContainer
        center={center}
        zoom={15}
        scrollWheelZoom={false}
        style={{ width: '100%', height: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {showPolygons && SECTORS_POLYGONS.map((sec, idx) => (
          <Polygon
            key={idx}
            positions={sec.coords}
            pathOptions={{
              color: sec.color,
              fillColor: sec.fillColor,
              fillOpacity: sec.fillOpacity,
              weight: 2
            }}
            eventHandlers={{
              click: () => setSelectedSector(sec)
            }}
          >
            <Tooltip sticky>
              <strong>{sec.name}</strong>
            </Tooltip>
          </Polygon>
        ))}

        {showNotices && notices.map(item => {
          if (!item.lat || !item.lng) return null;
          return (
            <Marker key={`n-${item.id}`} position={[item.lat, item.lng]} icon={iconNotice}>
              <Popup>
                <div style={{ minWidth: '190px' }}>
                  <span style={{ fontSize: '0.72rem', fontWeight: '800', backgroundColor: '#FEE2E2', color: '#991B1B', padding: '0.15rem 0.45rem', borderRadius: '4px' }}>
                    {item.caseNumber || 'Avería'}
                  </span>
                  <h4 style={{ margin: '0.4rem 0 0.2rem 0', fontSize: '0.95rem', color: '#0F172A' }}>{item.title}</h4>
                  <div style={{ fontSize: '0.78rem', color: '#64748B', marginBottom: '0.4rem' }}>
                    Sector: <strong>{item.sector || 'San Juan'}</strong> • Estado: <strong>{item.status}</strong>
                  </div>
                  <p style={{ margin: '0 0 0.4rem 0', fontSize: '0.8rem', color: '#334155' }}>
                    {item.description}
                  </p>
                  <div style={{ fontSize: '0.75rem', fontWeight: '700', color: '#DC2626' }}>
                    {item.votes || 0} vecinos afectados
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}

        {showBusinesses && businesses.filter(b => b.verified).map(biz => {
          if (!biz.lat || !biz.lng) return null;
          return (
            <Marker key={`b-${biz.id}`} position={[biz.lat, biz.lng]} icon={iconBiz}>
              <Popup>
                <div style={{ minWidth: '180px' }}>
                  <span style={{ fontSize: '0.72rem', fontWeight: '800', backgroundColor: '#DCFCE7', color: '#166534', padding: '0.15rem 0.45rem', borderRadius: '4px' }}>
                    Patente ADI Verificada
                  </span>
                  <h4 style={{ margin: '0.4rem 0 0.2rem 0', fontSize: '0.95rem', color: '#0F172A' }}>{biz.name}</h4>
                  <div style={{ fontSize: '0.78rem', color: '#64748B', marginBottom: '0.35rem' }}>
                    {biz.category}
                  </div>
                  <p style={{ margin: '0 0 0.4rem 0', fontSize: '0.8rem', color: '#334155' }}>
                    {biz.address}
                  </p>
                  {biz.whatsapp && (
                    <a 
                      href={`https://wa.me/506${biz.whatsapp.replace('-', '')}`} 
                      target="_blank" 
                      rel="noreferrer"
                      style={{ fontSize: '0.78rem', fontWeight: '700', color: '#059669', textDecoration: 'none' }}
                    >
                      WhatsApp: {biz.whatsapp}
                    </a>
                  )}
                </div>
              </Popup>
            </Marker>
          );
        })}

        {showCivic && landmarks.map(lm => {
          if (!lm.lat || !lm.lng) return null;
          return (
            <Marker key={`l-${lm.id}`} position={[lm.lat, lm.lng]} icon={iconCivic}>
              <Popup>
                <div style={{ minWidth: '180px' }}>
                  <span style={{ fontSize: '0.72rem', fontWeight: '800', backgroundColor: '#E0E7FF', color: '#002B7F', padding: '0.15rem 0.45rem', borderRadius: '4px' }}>
                    {lm.type || 'Punto Cívico'}
                  </span>
                  <h4 style={{ margin: '0.4rem 0 0.2rem 0', fontSize: '0.95rem', color: '#0F172A' }}>{lm.name}</h4>
                  <p style={{ margin: 0, fontSize: '0.8rem', color: '#475569' }}>
                    {lm.info}
                  </p>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
};