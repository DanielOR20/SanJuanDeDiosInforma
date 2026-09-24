import { useEffect, useState } from 'react';
import { getNotices, getLocalWeather } from '../services/api';
import {
    AlertTriangle,
    CloudSun,
    Droplets,
    Wind,
    PhoneCall,
    Calendar,
    ArrowRight,
    Sparkles
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const Home = () => {
    const [notices, setNotices] = useState([]);
    const [weather, setWeather] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadHomeData = async () => {
            try {
                // Carga simultánea: Avisos locales y Clima externo
                const [noticesData, weatherData] = await Promise.all([
                    getNotices(),
                    getLocalWeather()
                ]);
                setNotices(noticesData);
                setWeather(weatherData.current);
            } catch (error) {
                console.error('Error cargando datos de inicio:', error);
            } finally {
                setLoading(false);
            }
        };

        loadHomeData();
    }, []);

    // Alerta principal urgente (primer aviso con prioridad alta)
    const urgentNotice = notices.find(n => n.priority === 'Alta') || notices[0];

    return (
        <div className="stitch-container" style={{ paddingBottom: '3rem' }}>

            {/* 1. Banner de Alerta Urgente (AyA / Emergencia) */}
            {urgentNotice && (
                <div style={{
                    marginTop: '1.5rem',
                    padding: '1rem 1.25rem',
                    backgroundColor: 'var(--secondary-light)',
                    borderLeft: '5px solid var(--secondary)',
                    borderRadius: 'var(--radius-md)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '1rem'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                        <div style={{ color: 'var(--secondary)' }}>
                            <AlertTriangle size={28} />
                        </div>
                        <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
                                <span className="badge badge-urgent">ALERTA CRÍTICA</span>
                                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{urgentNotice.category}</span>
                            </div>
                            <h3 style={{ fontSize: '1rem', fontWeight: '700' }}>{urgentNotice.title}</h3>
                            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                                {urgentNotice.description} • <strong>Sector:</strong> {urgentNotice.sector}
                            </p>
                        </div>
                    </div>
                    <Link
                        to="/avisos"
                        style={{
                            backgroundColor: 'var(--secondary)',
                            color: '#FFFFFF',
                            padding: '0.5rem 1rem',
                            borderRadius: 'var(--radius-sm)',
                            fontSize: '0.85rem',
                            fontWeight: '600'
                        }}
                    >
                        Ver cuadrantes afectados
                    </Link>
                </div>
            )}

            {/* 2. Hero: Título Comunal + Widget de Clima API Externa */}
            <section style={{
                marginTop: '2rem',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                gap: '1.5rem',
                alignItems: 'center'
            }}>
                <div>
                    <span style={{
                        fontSize: '0.8rem',
                        fontWeight: '700',
                        color: 'var(--secondary)',
                        letterSpacing: '1px',
                        textTransform: 'uppercase'
                    }}>
                        • Distrito 03 de Desamparados
                    </span>
                    <h1 style={{
                        fontSize: '2.2rem',
                        fontWeight: '800',
                        lineHeight: '1.2',
                        margin: '0.5rem 0 1rem',
                        color: 'var(--primary)'
                    }}>
                        San Juan de Dios Conectado e Informado
                    </h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '1rem', marginBottom: '1.5rem' }}>
                        Plataforma cívica oficial para la difusión de proyectos comunales, reportes ciudadanos en tiempo real, reactivación comercial de barrio y coordinación de emergencias cantonal.
                    </p>

                    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                        <Link
                            to="/directorio"
                            style={{
                                backgroundColor: 'var(--primary)',
                                color: '#FFFFFF',
                                padding: '0.75rem 1.25rem',
                                borderRadius: 'var(--radius-md)',
                                fontWeight: '600',
                                fontSize: '0.9rem',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.5rem'
                            }}
                        >
                            Explorar Comercios <ArrowRight size={16} />
                        </Link>
                        <Link
                            to="/asistente"
                            style={{
                                backgroundColor: 'var(--surface)',
                                color: 'var(--text-main)',
                                border: '1px solid var(--border)',
                                padding: '0.75rem 1.25rem',
                                borderRadius: 'var(--radius-md)',
                                fontWeight: '600',
                                fontSize: '0.9rem',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.5rem'
                            }}
                        >
                            <Sparkles size={16} color="var(--accent)" /> Preguntar a Guía IA
                        </Link>
                    </div>
                </div>

                {/* Tarjeta del Clima (API en vivo) */}
                <div className="stitch-card" style={{ padding: '1.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                        <span style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-muted)' }}>
                            📍 San Juan de Dios, 1,180 msnm
                        </span>
                        <span className="badge badge-success">En Directo</span>
                    </div>

                    {weather ? (
                        <div>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <div>
                                    <div style={{ fontSize: '2.8rem', fontWeight: '800', lineHeight: '1' }}>
                                        {Math.round(weather.temperature_2m)}°C
                                    </div>
                                    <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
                                        Valle Central Sur
                                    </div>
                                </div>
                                <CloudSun size={52} color="var(--accent)" />
                            </div>

                            <div style={{
                                marginTop: '1.5rem',
                                paddingTop: '1rem',
                                borderTop: '1px solid var(--border)',
                                display: 'grid',
                                gridTemplateColumns: '1fr 1fr',
                                gap: '1rem'
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}>
                                    <Droplets size={16} color="#3B82F6" />
                                    <span>Humedad: <strong>{weather.relative_humidity_2m}%</strong></span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}>
                                    <Wind size={16} color="#64748B" />
                                    <span>Viento: <strong>{weather.wind_speed_10m} km/h</strong></span>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                            {loading ? 'Consultando estación meteorológica...' : 'No disponible'}
                        </p>
                    )}
                </div>
            </section>

            {/* 3. Sección de Teléfonos de Emergencia Rápida */}
            <section style={{ marginTop: '3rem' }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <PhoneCall size={20} color="var(--secondary)" /> Directorio de Emergencias Locales
                </h2>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                    gap: '1rem'
                }}>
                    {[
                        { title: 'Policía de Proximidad', number: '2259-0111', badge: 'Fuerza Pública' },
                        { title: 'Bomberos Desamparados', number: '2259-2020', badge: 'Estación M-12' },
                        { title: 'EBAIS San Juan de Dios', number: '2250-4560', badge: 'CCSS' },
                        { title: 'Cruz Roja Costarricense', number: '2259-8080', badge: 'Comité Auxiliar' }
                    ].map((item, idx) => (
                        <div key={idx} className="stitch-card" style={{ padding: '1rem' }}>
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '600' }}>{item.badge}</span>
                            <h4 style={{ fontSize: '0.95rem', margin: '0.2rem 0 0.5rem' }}>{item.title}</h4>
                            <a
                                href={`tel:${item.number.replace('-', '')}`}
                                style={{
                                    color: 'var(--primary)',
                                    fontWeight: '700',
                                    fontSize: '1.05rem',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.3rem'
                                }}
                            >
                                📞 {item.number}
                            </a>
                        </div>
                    ))}
                </div>
            </section>

        </div>
    );
};