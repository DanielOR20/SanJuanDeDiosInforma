import { useEffect, useState } from 'react';
import { getLocalWeather, getBusinesses, getNotices, getLandmarks } from '../services/api';
import { ComunidadMap } from '../components/ComunidadMap';
import {
    CloudSun,
    Wind,
    Droplets,
    AlertTriangle,
    Store,
    Bus,
    Calendar,
    Bot,
    MapPin,
    ArrowRight,
    ShieldCheck
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const Home = () => {
    const [weather, setWeather] = useState(null);
    const [businesses, setBusinesses] = useState([]);
    const [notices, setNotices] = useState([]);
    const [landmarks, setLandmarks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHomeData = async () => {
            try {
                const [weatherData, bizData, noticeData, landData] = await Promise.all([
                    getLocalWeather().catch(() => null),
                    getBusinesses().catch(() => []),
                    getNotices().catch(() => []),
                    getLandmarks().catch(() => [])
                ]);

                setWeather(weatherData);
                setBusinesses(bizData);
                setNotices(noticeData);
                setLandmarks(landData);
            } catch (err) {
                console.error('Error cargando portada:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchHomeData();
    }, []);

    const activeAlerts = notices.filter(n => n.priority === 'Alta');

    return (
        <div className="stitch-container" style={{ paddingBottom: '3rem', marginTop: '2rem' }}>

            {/* SECCIÓN HERO PRINCIPAL */}
            <div style={{
                background: 'linear-gradient(135deg, var(--primary) 0%, #172554 100%)',
                color: '#FFFFFF',
                padding: '2.5rem',
                borderRadius: 'var(--radius-lg)',
                marginBottom: '2rem',
                boxShadow: 'var(--shadow-md)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '2rem'
            }}>
                <div style={{ maxWidth: '600px' }}>
                    <div style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.4rem',
                        backgroundColor: 'rgba(255,255,255,0.15)',
                        padding: '0.35rem 0.85rem',
                        borderRadius: 'var(--radius-full)',
                        fontSize: '0.85rem',
                        fontWeight: '700',
                        marginBottom: '1rem'
                    }}>
                        <ShieldCheck size={16} color="#FCD34D" /> Portal Oficial del Distrito 03 • Desamparados
                    </div>

                    <h1 style={{ fontSize: '2.4rem', fontWeight: '800', lineHeight: '1.2', marginBottom: '1rem' }}>
                        San Juan de Dios Informa
                    </h1>

                    <p style={{ fontSize: '1.05rem', opacity: 0.9, lineHeight: '1.5', marginBottom: '1.5rem' }}>
                        Plataforma comunitaria integral para consulta de transporte, comercios locales, alertas en tiempo real y servicios de la Asociación de Desarrollo Integral (ADI).
                    </p>

                    <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                        <Link
                            to="/directorio"
                            style={{
                                backgroundColor: 'var(--secondary)',
                                color: '#FFFFFF',
                                padding: '0.75rem 1.4rem',
                                borderRadius: 'var(--radius-md)',
                                fontWeight: '700',
                                fontSize: '0.95rem',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                textDecoration: 'none'
                            }}
                        >
                            <Store size={18} /> Explorar Directorio
                        </Link>

                        <Link
                            to="/avisos"
                            style={{
                                backgroundColor: 'rgba(255,255,255,0.2)',
                                color: '#FFFFFF',
                                padding: '0.75rem 1.4rem',
                                borderRadius: 'var(--radius-md)',
                                fontWeight: '700',
                                fontSize: '0.95rem',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                textDecoration: 'none'
                            }}
                        >
                            <AlertTriangle size={18} /> Ver Averías y Alertas
                        </Link>
                    </div>
                </div>

                {/* Tarjeta del Clima Cantonal (Open-Meteo) */}
                <div className="stitch-card" style={{
                    padding: '1.5rem',
                    minWidth: '260px',
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    color: '#1E293B'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                        <CloudSun size={24} color="#D97706" />
                        <div>
                            <div style={{ fontSize: '0.75rem', fontWeight: '700', color: '#64748B', textTransform: 'uppercase' }}>Clima en Tiempo Real</div>
                            <strong style={{ fontSize: '0.95rem' }}>San Juan de Dios Centro</strong>
                        </div>
                    </div>

                    {weather ? (
                        <div>
                            <div style={{ fontSize: '2.5rem', fontWeight: '800', color: '#1E3A8A', margin: '0.2rem 0' }}>
                                {weather.current?.temperature_2m || 24}°C
                            </div>
                            <div style={{ display: 'flex', gap: '1rem', fontSize: '0.85rem', color: '#64748B' }}>
                                <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                    <Droplets size={14} color="#0284C7" /> {weather.current?.relative_humidity_2m || 75}% Humedad
                                </span>
                                <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                    <Wind size={14} color="#64748B" /> {weather.current?.wind_speed_10m || 12} km/h
                                </span>
                            </div>
                        </div>
                    ) : (
                        <p style={{ fontSize: '0.85rem', color: '#64748B' }}>Conectando con estación meteorológica...</p>
                    )}
                </div>
            </div>

            {/* BANNER DE ALERTAS CRÍTICAS ACTIVAS */}
            {activeAlerts.length > 0 && (
                <div style={{
                    backgroundColor: '#FEE2E2',
                    borderLeft: '5px solid #DC2626',
                    borderRadius: 'var(--radius-md)',
                    padding: '1rem 1.5rem',
                    marginBottom: '2rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '1rem'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <AlertTriangle size={24} color="#DC2626" />
                        <div>
                            <strong style={{ color: '#991B1B', display: 'block', fontSize: '0.95rem' }}>
                                Alerta Crítica Comunal ({activeAlerts[0].category}):
                            </strong>
                            <span style={{ color: '#7F1D1D', fontSize: '0.9rem' }}>
                                {activeAlerts[0].title} — <em>{activeAlerts[0].sector}</em>
                            </span>
                        </div>
                    </div>
                    <Link
                        to="/avisos"
                        style={{
                            color: '#DC2626',
                            fontWeight: '700',
                            fontSize: '0.85rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.25rem',
                            textDecoration: 'none'
                        }}
                    >
                        Ver detalles <ArrowRight size={16} />
                    </Link>
                </div>
            )}

            {/* MAPA INTERACTIVO DISTRITAL EN LA PORTADA */}
            <div style={{ marginBottom: '2.5rem' }}>
                <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <div>
                        <h2 style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--primary)', margin: 0 }}>
                            Mapa Comunitario en Vivo
                        </h2>
                        <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', margin: '0.2rem 0 0' }}>
                            Puntos cívicos, comercios activos y reportes ciudadanos sobre el mapa de San Juan de Dios.
                        </p>
                    </div>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-subtle)' }}>
                        Navegación interactiva OpenStreetMap
                    </span>
                </div>

                <ComunidadMap
                    businesses={businesses}
                    notices={notices}
                    landmarks={landmarks}
                    height="450px"
                />
            </div>

            {/* ACCESOS RÁPIDOS A MÓDULOS */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>

                <Link to="/directorio" className="stitch-card" style={{ padding: '1.5rem', textDecoration: 'none', color: 'inherit' }}>
                    <div style={{ width: '45px', height: '45px', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                        <Store size={22} color="var(--primary)" />
                    </div>
                    <h3 style={{ fontSize: '1.15rem', fontWeight: '800', marginBottom: '0.35rem', color: 'var(--primary)' }}>
                        Comercio Local
                    </h3>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>
                        Directorio con enlaces directos a WhatsApp, horarios y ubicación GPS de los locales del distrito.
                    </p>
                </Link>

                <Link to="/agenda" className="stitch-card" style={{ padding: '1.5rem', textDecoration: 'none', color: 'inherit' }}>
                    <div style={{ width: '45px', height: '45px', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--tertiary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                        <Bus size={22} color="var(--tertiary)" />
                    </div>
                    <h3 style={{ fontSize: '1.15rem', fontWeight: '800', marginBottom: '0.35rem', color: 'var(--primary)' }}>
                        Transporte y Agenda
                    </h3>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>
                        Horarios de buses, calculadora de tarifas por pasajero y cronograma cantonal de reciclaje y basura.
                    </p>
                </Link>

                <Link to="/avisos" className="stitch-card" style={{ padding: '1.5rem', textDecoration: 'none', color: 'inherit' }}>
                    <div style={{ width: '45px', height: '45px', borderRadius: 'var(--radius-md)', backgroundColor: '#FEE2E2', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                        <AlertTriangle size={22} color="var(--secondary)" />
                    </div>
                    <h3 style={{ fontSize: '1.15rem', fontWeight: '800', marginBottom: '0.35rem', color: 'var(--primary)' }}>
                        Alertas Ciudadanas
                    </h3>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>
                        Reportes vecinales de cortes de agua, averías eléctricas y bacheo con votos de afectación vecinal.
                    </p>
                </Link>

                <Link to="/asistente" className="stitch-card" style={{ padding: '1.5rem', textDecoration: 'none', color: 'inherit' }}>
                    <div style={{ width: '45px', height: '45px', borderRadius: 'var(--radius-md)', backgroundColor: '#FEF3C7', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                        <Bot size={22} color="#D97706" />
                    </div>
                    <h3 style={{ fontSize: '1.15rem', fontWeight: '800', marginBottom: '0.35rem', color: 'var(--primary)' }}>
                        Guía Cívica IA
                    </h3>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>
                        Asistente conversacional para responder dudas inmediatas sobre trámites, rutas y contactos del cantón.
                    </p>
                </Link>

            </div>

        </div>
    );
};