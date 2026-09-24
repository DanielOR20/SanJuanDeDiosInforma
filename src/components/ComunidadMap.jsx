import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { MapPin, Navigation, Store, AlertTriangle, Building2, Phone } from 'lucide-react';

// Corrección de iconos de Leaflet para Vite/React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Iconos personalizados por categoría
const createCustomIcon = (colorBg) => {
    return L.divIcon({
        className: 'custom-leaflet-marker',
        html: `<div style="
      background-color: ${colorBg};
      width: 32px;
      height: 32px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      border: 3px solid white;
      box-shadow: 0 3px 8px rgba(0,0,0,0.3);
      font-weight: bold;
    ">•</div>`,
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -32]
    });
};

const iconComercio = createCustomIcon('#1E3A8A');  // Azul institucional
const iconLandmark = createCustomIcon('#16A34A');  // Verde cívico
const iconAlerta = createCustomIcon('#DC2626');    // Rojo emergencia

// Subcomponente para centrar el mapa cuando se selecciona un lugar
function ChangeMapView({ center, zoom }) {
    const map = useMap();
    useEffect(() => {
        if (center) {
            map.flyTo(center, zoom, { duration: 1.2 });
        }
    }, [center, zoom, map]);
    return null;
}

export const ComunidadMap = ({
    businesses = [],
    notices = [],
    landmarks = [],
    selectedItem = null,
    height = '500px'
}) => {
    // Coordenadas base: Parque Central de San Juan de Dios
    const defaultCenter = [9.8940, -84.0740];
    const [activeFilter, setActiveFilter] = useState('todos');

    const targetCenter = selectedItem?.lat && selectedItem?.lng
        ? [selectedItem.lat, selectedItem.lng]
        : defaultCenter;

    const targetZoom = selectedItem ? 17 : 15;

    return (
        <div className="stitch-card" style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>

            {/* Barra de Filtros del Mapa */}
            <div style={{
                padding: '0.75rem 1.25rem',
                backgroundColor: 'var(--surface)',
                borderBottom: '1px solid var(--border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '0.75rem'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '700', fontSize: '0.9rem' }}>
                    <MapPin size={18} color="var(--primary)" /> Mapa Geoespacial del Distrito
                </div>

                <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                    {[
                        { id: 'todos', label: 'Ver Todo' },
                        { id: 'comercios', label: 'Comercios (Azul)' },
                        { id: 'civico', label: 'Puntos Cívicos (Verde)' },
                        { id: 'alertas', label: 'Averías / Alertas (Rojo)' }
                    ].map(f => (
                        <button
                            key={f.id}
                            onClick={() => setActiveFilter(f.id)}
                            style={{
                                fontSize: '0.78rem',
                                padding: '0.35rem 0.75rem',
                                borderRadius: 'var(--radius-full)',
                                fontWeight: '600',
                                border: '1px solid var(--border)',
                                backgroundColor: activeFilter === f.id ? 'var(--primary)' : 'var(--surface-subtle)',
                                color: activeFilter === f.id ? '#FFFFFF' : 'var(--text-main)',
                                cursor: 'pointer'
                            }}
                        >
                            {f.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Contenedor Leaflet */}
            <div style={{ height: height, width: '100%', position: 'relative' }}>
                <MapContainer
                    center={defaultCenter}
                    zoom={15}
                    scrollWheelZoom={true}
                    style={{ height: '100%', width: '100%' }}
                >
                    <ChangeMapView center={targetCenter} zoom={targetZoom} />

                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> colaboradores'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />

                    {/* Marcadores de Comercios */}
                    {(activeFilter === 'todos' || activeFilter === 'comercios') &&
                        businesses.filter(b => b.verified && b.lat && b.lng).map(b => (
                            <Marker key={`biz-${b.id}`} position={[b.lat, b.lng]} icon={iconComercio}>
                                <Popup>
                                    <div style={{ minWidth: '200px', padding: '0.2rem' }}>
                                        <span style={{ fontSize: '0.7rem', fontWeight: '700', color: '#1E3A8A', textTransform: 'uppercase' }}>
                                            {b.category}
                                        </span>
                                        <h4 style={{ margin: '0.2rem 0 0.4rem', fontSize: '1rem', fontWeight: 'bold' }}>{b.name}</h4>
                                        <p style={{ margin: '0 0 0.5rem', fontSize: '0.8rem', color: '#4B5563' }}>{b.address}</p>
                                        {b.schedule && (
                                            <p style={{ margin: '0 0 0.5rem', fontSize: '0.75rem', color: '#6B7280' }}>
                                                🕒 {b.schedule}
                                            </p>
                                        )}
                                        <a
                                            href={`https://www.google.com/maps/dir/?api=1&destination=${b.lat},${b.lng}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            style={{
                                                display: 'inline-flex',
                                                alignItems: 'center',
                                                gap: '0.3rem',
                                                backgroundColor: '#1E3A8A',
                                                color: 'white',
                                                padding: '0.35rem 0.6rem',
                                                borderRadius: '4px',
                                                fontSize: '0.78rem',
                                                textDecoration: 'none',
                                                fontWeight: 'bold'
                                            }}
                                        >
                                            <Navigation size={13} /> Cómo llegar
                                        </a>
                                    </div>
                                </Popup>
                            </Marker>
                        ))
                    }

                    {/* Marcadores de Puntos Cívicos y Salud */}
                    {(activeFilter === 'todos' || activeFilter === 'civico') &&
                        landmarks.map(l => (
                            <Marker key={`lnd-${l.id}`} position={[l.lat, l.lng]} icon={iconLandmark}>
                                <Popup>
                                    <div style={{ minWidth: '190px' }}>
                                        <span style={{ fontSize: '0.7rem', fontWeight: '700', color: '#16A34A', textTransform: 'uppercase' }}>
                                            Punto Comunal ({l.type})
                                        </span>
                                        <h4 style={{ margin: '0.2rem 0', fontSize: '0.95rem', fontWeight: 'bold' }}>{l.name}</h4>
                                        <p style={{ margin: '0.3rem 0 0.5rem', fontSize: '0.8rem', color: '#4B5563' }}>{l.description}</p>
                                        <a
                                            href={`https://www.google.com/maps/dir/?api=1&destination=${l.lat},${l.lng}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            style={{
                                                display: 'inline-flex',
                                                alignItems: 'center',
                                                gap: '0.3rem',
                                                backgroundColor: '#16A34A',
                                                color: 'white',
                                                padding: '0.3rem 0.5rem',
                                                borderRadius: '4px',
                                                fontSize: '0.75rem',
                                                textDecoration: 'none'
                                            }}
                                        >
                                            <Navigation size={12} /> Ruta GPS
                                        </a>
                                    </div>
                                </Popup>
                            </Marker>
                        ))
                    }

                    {/* Marcadores de Averías y Alertas Activas */}
                    {(activeFilter === 'todos' || activeFilter === 'alertas') &&
                        notices.filter(n => n.lat && n.lng).map(n => (
                            <Marker key={`not-${n.id}`} position={[n.lat, n.lng]} icon={iconAlerta}>
                                <Popup>
                                    <div style={{ minWidth: '200px' }}>
                                        <span style={{ fontSize: '0.7rem', fontWeight: '700', color: '#DC2626', textTransform: 'uppercase' }}>
                                            ⚠️ {n.priority === 'Alta' ? 'Incidencia Crítica' : 'Reporte Vecinal'}
                                        </span>
                                        <h4 style={{ margin: '0.2rem 0', fontSize: '0.95rem', fontWeight: 'bold' }}>{n.title}</h4>
                                        <p style={{ margin: '0.3rem 0 0.5rem', fontSize: '0.8rem', color: '#4B5563' }}>{n.description}</p>
                                        <div style={{ fontSize: '0.75rem', color: '#9CA3AF' }}>
                                            Sector: {n.sector}
                                        </div>
                                    </div>
                                </Popup>
                            </Marker>
                        ))
                    }
                </MapContainer>
            </div>

        </div>
    );
};