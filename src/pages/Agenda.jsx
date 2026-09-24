import { useState } from 'react';
import {
    Bus,
    Trash2,
    CalendarDays,
    Clock,
    MapPin,
    Ticket,
    CalendarPlus,
    AlertCircle,
    Repeat
} from 'lucide-react';

export const Agenda = () => {
    const [activeTab, setActiveTab] = useState('buses');
    const [selectedSector, setSelectedSector] = useState('San Juan Centro');

    // Datos de Transporte Comunal
    const busRoutes = [
        {
            id: 'sanjuan-sj',
            title: 'San Juan de Dios ⇄ San José Centro',
            operator: 'Autotransportes Desamparados',
            price: '₡340 aprox.',
            frequency: 'Cada 10 a 15 min',
            firstBus: '04:45 AM',
            lastBus: '10:45 PM',
            stops: 'Parque Central San Juan, Calle Fallas, Clínica Marcial Fallas, Terminal San José (Costado Sur Parque Central).',
            scheduleWeek: 'Lunes a Viernes: 4:45 AM - 10:45 PM',
            scheduleWeekend: 'Sábados: 5:00 AM - 10:30 PM | Domingos: 5:30 AM - 10:00 PM',
            status: 'Servicio Regular'
        },
        {
            id: 'poas-sanjuan',
            title: 'Poás de Aserrí ⇄ San Juan de Dios',
            operator: 'Empresa Local San Juan',
            price: '₡380 aprox.',
            frequency: 'Cada 25 min',
            firstBus: '05:15 AM',
            lastBus: '09:30 PM',
            stops: 'Poás Alto, Entrada a San Juan, Cruce de la Cancha, Terminal.',
            scheduleWeek: 'Lunes a Sábado continuo',
            scheduleWeekend: 'Domingos cada 40 minutos',
            status: 'Servicio Regular'
        },
        {
            id: 'interlineas',
            title: 'Interlínea Desamparados ⇄ Moravia (Paso por San Juan)',
            operator: 'Consorcio Operativo Interlíneas',
            price: '₡420',
            frequency: 'Cada 20 min en horas pico',
            firstBus: '05:00 AM',
            lastBus: '07:30 PM',
            stops: 'Cruce San Juan, San Antonio, Curridabat, Guadalupe, Moravia.',
            scheduleWeek: 'Lunes a Viernes únicamente (horas pico y valle extendido)',
            scheduleWeekend: 'Sin servicio fines de semana ni feriados',
            status: 'Hora pico activa'
        }
    ];

    // Datos de Recolección de Residuos por Sector
    const wasteSchedule = {
        'San Juan Centro': {
            ordinary: 'Martes y Viernes (a partir de las 6:00 AM)',
            recycling: '2do y 4to Jueves de cada mes (Plástico, cartón y latas limpios)',
            bulkWaste: 'Primer lunes de mes (muebles y enseres grandes previa solicitud a la ADI)',
            note: 'Favor sacar los desechos en bolsas resistentes debidamente cerradas para evitar dispersión.'
        },
        'Calle Fallas': {
            ordinary: 'Lunes y Jueves (a partir de las 6:30 AM)',
            recycling: '1er y 3er Miércoles de cada mes',
            bulkWaste: 'Segundo lunes de mes',
            note: 'Camión recolector ingresa por la entrada principal de la plaza.'
        },
        'Sector La Cancha / Plaza Deportes': {
            ordinary: 'Martes y Sábados (a partir de las 7:00 AM)',
            recycling: 'Todos los Viernes por la mañana',
            bulkWaste: 'Último viernes de mes',
            note: 'Punto de acopio temporal habilitado en el salón comunal para vidrio.'
        }
    };

    // Eventos Comunitarios
    const events = [
        {
            id: 1,
            title: 'Clases Comunitarias de Zumba y Acondicionamiento',
            category: 'Deportes y Salud',
            date: 'Lunes y Miércoles',
            time: '6:00 PM - 7:30 PM',
            location: 'Salón Comunal de San Juan de Dios',
            price: '₡2.000 por clase',
            contact: '8899-1122 (Comité de Deportes)',
            googleCalTitle: 'Clase de Zumba - Salón Comunal San Juan',
            googleCalDetails: 'Clase comunitaria de acondicionamiento físico. Aporte: ₡2.000.'
        },
        {
            id: 2,
            title: 'Gran Ensayo Abierto: Banda Municipal de San Juan',
            category: 'Cultura y Juventud',
            date: 'Viernes 25 de Septiembre',
            time: '7:00 PM - 9:00 PM',
            location: 'Plaza de Deportes y Anfiteatro Comunal',
            price: 'Entrada Libre',
            contact: 'Comisión Cultural ADI',
            googleCalTitle: 'Ensayo Abierto Banda Municipal San Juan de Dios',
            googleCalDetails: 'Presentación comunitaria y preparación para desfiles y eventos cívicos.'
        },
        {
            id: 3,
            title: 'Feria de Emprendedores y Productores Locales',
            category: 'Comercio Vecinal',
            date: 'Sábado 26 y Domingo 27 de Septiembre',
            time: '8:30 AM - 4:00 PM',
            location: 'Costado Oeste del Parque Central',
            price: 'Acceso Gratuito',
            contact: 'WhatsApp ADI: 2259-0000',
            googleCalTitle: 'Feria de Emprendedores San Juan de Dios',
            googleCalDetails: 'Apoyo a pequeños productores y artesanos locales.'
        }
    ];

    // Generador de enlace directo a Google Calendar
    const getGoogleCalendarUrl = (title, details, location) => {
        const baseUrl = 'https://calendar.google.com/calendar/render?action=TEMPLATE';
        return `${baseUrl}&text=${encodeURIComponent(title)}&details=${encodeURIComponent(details)}&location=${encodeURIComponent(location)}`;
    };

    return (
        <div className="stitch-container" style={{ paddingBottom: '3rem', marginTop: '2rem' }}>

            {/* Encabezado Principal */}
            <div style={{ marginBottom: '2rem' }}>
                <h1 style={{ color: 'var(--primary)', fontSize: '2rem', fontWeight: '800', marginBottom: '0.5rem' }}>
                    Agenda Comunal & Servicios Públicos
                </h1>
                <p style={{ color: 'var(--text-muted)', fontSize: '1rem' }}>
                    Horarios de buses, rutas interlíneas, cronograma de aseo cantonal y actividades culturales de San Juan de Dios.
                </p>
            </div>

            {/* Selector de Pestañas */}
            <div style={{
                display: 'flex',
                gap: '0.5rem',
                borderBottom: '2px solid var(--border)',
                marginBottom: '2rem',
                overflowX: 'auto',
                paddingBottom: '0.5rem'
            }}>
                <button
                    onClick={() => setActiveTab('buses')}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        padding: '0.75rem 1.25rem',
                        borderRadius: 'var(--radius-md)',
                        fontWeight: '700',
                        fontSize: '0.95rem',
                        backgroundColor: activeTab === 'buses' ? 'var(--primary)' : 'transparent',
                        color: activeTab === 'buses' ? '#FFFFFF' : 'var(--text-muted)'
                    }}
                >
                    <Bus size={18} /> Transporte y Rutas de Bus
                </button>

                <button
                    onClick={() => setActiveTab('recoleccion')}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        padding: '0.75rem 1.25rem',
                        borderRadius: 'var(--radius-md)',
                        fontWeight: '700',
                        fontSize: '0.95rem',
                        backgroundColor: activeTab === 'recoleccion' ? 'var(--primary)' : 'transparent',
                        color: activeTab === 'recoleccion' ? '#FFFFFF' : 'var(--text-muted)'
                    }}
                >
                    <Trash2 size={18} /> Recolección de Basura & Reciclaje
                </button>

                <button
                    onClick={() => setActiveTab('eventos')}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        padding: '0.75rem 1.25rem',
                        borderRadius: 'var(--radius-md)',
                        fontWeight: '700',
                        fontSize: '0.95rem',
                        backgroundColor: activeTab === 'eventos' ? 'var(--primary)' : 'transparent',
                        color: activeTab === 'eventos' ? '#FFFFFF' : 'var(--text-muted)'
                    }}
                >
                    <CalendarDays size={18} /> Actividades Comunitarias & Banda
                </button>
            </div>

            {/* PESTAÑA 1: TRANSPORTE Y BUSES */}
            {activeTab === 'buses' && (
                <div style={{ display: 'grid', gap: '1.5rem' }}>
                    <div style={{
                        padding: '1rem',
                        backgroundColor: 'var(--surface-subtle)',
                        borderRadius: 'var(--radius-md)',
                        borderLeft: '4px solid var(--primary)',
                        fontSize: '0.9rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem'
                    }}>
                        <AlertCircle size={20} color="var(--primary)" />
                        <span>
                            <strong>Aviso de Movilidad:</strong> Horarios oficiales coordinados con las empresas operadoras del cantón de Desamparados. Tarifas sujetas a revisión periódica de ARESEP.
                        </span>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.5rem' }}>
                        {busRoutes.map(route => (
                            <div key={route.id} className="stitch-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                    <span className="badge badge-success">{route.status}</span>
                                    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '600' }}>{route.operator}</span>
                                </div>

                                <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: 'var(--primary)' }}>
                                    {route.title}
                                </h3>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', padding: '0.75rem', backgroundColor: 'var(--bg)', borderRadius: 'var(--radius-sm)' }}>
                                    <div style={{ fontSize: '0.85rem' }}>
                                        <span style={{ color: 'var(--text-muted)', display: 'block' }}>Pasaje aprox:</span>
                                        <strong style={{ color: 'var(--tertiary)', fontSize: '1rem' }}>{route.price}</strong>
                                    </div>
                                    <div style={{ fontSize: '0.85rem' }}>
                                        <span style={{ color: 'var(--text-muted)', display: 'block' }}>Frecuencia:</span>
                                        <strong>{route.frequency}</strong>
                                    </div>
                                    <div style={{ fontSize: '0.85rem' }}>
                                        <span style={{ color: 'var(--text-muted)', display: 'block' }}>Primer bus:</span>
                                        <strong>{route.firstBus}</strong>
                                    </div>
                                    <div style={{ fontSize: '0.85rem' }}>
                                        <span style={{ color: 'var(--text-muted)', display: 'block' }}>Último bus:</span>
                                        <strong>{route.lastBus}</strong>
                                    </div>
                                </div>

                                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                                    <strong style={{ color: 'var(--text-main)', display: 'block', marginBottom: '0.2rem' }}>Paradas y Recorrido:</strong>
                                    {route.stops}
                                </div>

                                <div style={{ fontSize: '0.8rem', borderTop: '1px solid var(--border)', paddingTop: '0.75rem', color: 'var(--text-subtle)' }}>
                                    {route.scheduleWeek}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* PESTAÑA 2: RECOLECCIÓN DE BASURA Y RECICLAJE */}
            {activeTab === 'recoleccion' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    {/* Selector de Sector */}
                    <div className="stitch-card" style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                        <span style={{ fontWeight: '700', fontSize: '0.95rem' }}>📍 Seleccione su Sector o Barrio:</span>
                        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                            {Object.keys(wasteSchedule).map(sector => (
                                <button
                                    key={sector}
                                    onClick={() => setSelectedSector(sector)}
                                    style={{
                                        padding: '0.5rem 1rem',
                                        borderRadius: 'var(--radius-sm)',
                                        fontWeight: '600',
                                        fontSize: '0.85rem',
                                        backgroundColor: selectedSector === sector ? 'var(--primary)' : 'var(--surface-subtle)',
                                        color: selectedSector === sector ? '#FFFFFF' : 'var(--text-main)',
                                        border: '1px solid var(--border)'
                                    }}
                                >
                                    {sector}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Tarjeta de Cronograma del Sector */}
                    <div className="stitch-card" style={{ padding: '2rem' }}>
                        <h2 style={{ fontSize: '1.35rem', fontWeight: '800', color: 'var(--primary)', marginBottom: '1.5rem' }}>
                            Cronograma de Limpieza Comunal: {selectedSector}
                        </h2>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>

                            <div style={{ padding: '1.25rem', backgroundColor: 'var(--bg)', borderRadius: 'var(--radius-md)', borderTop: '4px solid #64748B' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                                    <Trash2 size={22} color="#64748B" />
                                    <h3 style={{ fontSize: '1.1rem', fontWeight: '700' }}>Basura Ordinaria</h3>
                                </div>
                                <p style={{ fontSize: '0.95rem', fontWeight: '600', color: 'var(--text-main)' }}>
                                    {wasteSchedule[selectedSector].ordinary}
                                </p>
                                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
                                    Desechos no reciclables del hogar.
                                </p>
                            </div>

                            <div style={{ padding: '1.25rem', backgroundColor: 'var(--bg)', borderRadius: 'var(--radius-md)', borderTop: '4px solid var(--tertiary)' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                                    <Repeat size={22} color="var(--tertiary)" />
                                    <h3 style={{ fontSize: '1.1rem', fontWeight: '700' }}>Ruta de Reciclaje</h3>
                                </div>
                                <p style={{ fontSize: '0.95rem', fontWeight: '600', color: 'var(--text-main)' }}>
                                    {wasteSchedule[selectedSector].recycling}
                                </p>
                                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
                                    Cartón seco, aluminio, plástico tipo 1 y 2.
                                </p>
                            </div>

                            <div style={{ padding: '1.25rem', backgroundColor: 'var(--bg)', borderRadius: 'var(--radius-md)', borderTop: '4px solid var(--accent)' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                                    <CalendarDays size={22} color="var(--accent)" />
                                    <h3 style={{ fontSize: '1.1rem', fontWeight: '700' }}>Desechos No Tradicionales</h3>
                                </div>
                                <p style={{ fontSize: '0.95rem', fontWeight: '600', color: 'var(--text-main)' }}>
                                    {wasteSchedule[selectedSector].bulkWaste}
                                </p>
                                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
                                    Chatarra, colchones y electrodomésticos en desuso.
                                </p>
                            </div>

                        </div>

                        <div style={{ marginTop: '1.5rem', padding: '1rem', backgroundColor: 'var(--tertiary-light)', borderRadius: 'var(--radius-sm)', fontSize: '0.85rem', color: 'var(--tertiary)', fontWeight: '600' }}>
                            💡 Recomendación ambiental: {wasteSchedule[selectedSector].note}
                        </div>
                    </div>
                </div>
            )}

            {/* PESTAÑA 3: ACTIVIDADES Y EVENTOS */}
            {activeTab === 'eventos' && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
                    {events.map(event => (
                        <div key={event.id} className="stitch-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                            <div>
                                <span className="badge badge-success" style={{ marginBottom: '0.75rem' }}>
                                    {event.category}
                                </span>

                                <h3 style={{ fontSize: '1.2rem', fontWeight: '800', marginBottom: '0.75rem', color: 'var(--primary)' }}>
                                    {event.title}
                                </h3>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                        <CalendarDays size={16} color="var(--primary)" /> <strong>Fecha:</strong> {event.date}
                                    </span>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                        <Clock size={16} color="var(--primary)" /> <strong>Hora:</strong> {event.time}
                                    </span>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                        <MapPin size={16} color="var(--primary)" /> <strong>Lugar:</strong> {event.location}
                                    </span>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                        <Ticket size={16} color="var(--tertiary)" /> <strong>Costo:</strong> {event.price}
                                    </span>
                                </div>
                            </div>

                            {/* Botón funcional: Agregar a Google Calendar */}
                            <a
                                href={getGoogleCalendarUrl(event.googleCalTitle, event.googleCalDetails, event.location)}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '0.5rem',
                                    backgroundColor: 'var(--surface-subtle)',
                                    color: 'var(--primary)',
                                    border: '1px solid var(--border)',
                                    padding: '0.65rem 1rem',
                                    borderRadius: 'var(--radius-sm)',
                                    fontWeight: '700',
                                    fontSize: '0.85rem',
                                    transition: 'background-color 0.2s'
                                }}
                            >
                                <CalendarPlus size={16} /> Agregar a mi Calendario
                            </a>
                        </div>
                    ))}
                </div>
            )}

        </div>
    );
};