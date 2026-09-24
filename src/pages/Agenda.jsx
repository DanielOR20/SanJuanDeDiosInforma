import { useState, useEffect } from 'react';
import {
    Bus,
    Trash2,
    CalendarDays,
    Clock,
    MapPin,
    Ticket,
    CalendarPlus,
    AlertCircle,
    Repeat,
    Calculator,
    Timer
} from 'lucide-react';

export const Agenda = () => {
    const [activeTab, setActiveTab] = useState('buses');
    const [selectedSector, setSelectedSector] = useState('San Juan Centro');

    // Datos de Transporte Comunal con tarifas numéricas reales
    const busRoutes = [
        {
            id: 'sanjuan-sj',
            title: 'San Juan de Dios ⇄ San José Centro',
            operator: 'Autotransportes Desamparados',
            priceNum: 340,
            priceStr: '₡340',
            frequencyMin: 12,
            firstBus: '04:45 AM',
            lastBus: '10:45 PM',
            stops: 'Parque Central San Juan, Cruce Calle Fallas, Clínica Marcial Fallas, Terminal Sur Parque Central SJ.',
            scheduleWeek: 'Lunes a Viernes: 4:45 AM - 10:45 PM',
            status: 'Servicio Regular'
        },
        {
            id: 'poas-sanjuan',
            title: 'Poás de Aserrí ⇄ San Juan de Dios',
            operator: 'Empresa Local San Juan',
            priceNum: 380,
            priceStr: '₡380',
            frequencyMin: 25,
            firstBus: '05:15 AM',
            lastBus: '09:30 PM',
            stops: 'Poás Alto, Entrada a San Juan, Cruce de la Cancha, Terminal Local.',
            scheduleWeek: 'Lunes a Sábado continuo | Domingos cada 40 min',
            status: 'Servicio Regular'
        },
        {
            id: 'interlineas',
            title: 'Interlínea Desamparados ⇄ Moravia (Paso San Juan)',
            operator: 'Consorcio Interlíneas',
            priceNum: 420,
            priceStr: '₡420',
            frequencyMin: 20,
            firstBus: '05:00 AM',
            lastBus: '07:30 PM',
            stops: 'Cruce San Juan, San Antonio, Curridabat, Guadalupe, Moravia.',
            scheduleWeek: 'Lunes a Viernes en horas pico y valle extendido',
            status: 'Operando'
        }
    ];

    // Estado de la calculadora de pasajes
    const [selectedRouteId, setSelectedRouteId] = useState('sanjuan-sj');
    const [passengersCount, setPassengersCount] = useState(1);
    const [paymentBill, setPaymentBill] = useState(1000);

    // Estimador de próximo bus
    const currentRoute = busRoutes.find(r => r.id === selectedRouteId) || busRoutes[0];
    const totalFare = currentRoute.priceNum * passengersCount;
    const changeMoney = paymentBill >= totalFare ? paymentBill - totalFare : 0;

    // Minutos para próxima salida simulada basados en minutos de la hora
    const [minutesToNext, setMinutesToNext] = useState(6);
    useEffect(() => {
        const now = new Date();
        const currentMinute = now.getMinutes();
        const remaining = currentRoute.frequencyMin - (currentMinute % currentRoute.frequencyMin);
        setMinutesToNext(remaining === 0 ? currentRoute.frequencyMin : remaining);
    }, [selectedRouteId]);

    // Cronograma de Residuos
    const wasteSchedule = {
        'San Juan Centro': {
            ordinary: 'Martes y Viernes (a partir de las 6:00 AM)',
            recycling: '2do y 4to Jueves de cada mes (Plástico, cartón y latas limpios)',
            bulkWaste: 'Primer lunes de mes (muebles y enseres grandes con aviso a la ADI)',
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
            googleCalTitle: 'Feria de Emprendedores San Juan de Dios',
            googleCalDetails: 'Apoyo a pequeños productores y artesanos locales.'
        }
    ];

    const getGoogleCalendarUrl = (title, details, location) => {
        const baseUrl = 'https://calendar.google.com/calendar/render?action=TEMPLATE';
        return `${baseUrl}&text=${encodeURIComponent(title)}&details=${encodeURIComponent(details)}&location=${encodeURIComponent(location)}`;
    };

    return (
        <div className="stitch-container" style={{ paddingBottom: '3rem', marginTop: '2rem' }}>

            {/* Encabezado */}
            <div style={{ marginBottom: '2rem' }}>
                <h1 style={{ color: 'var(--primary)', fontSize: '2rem', fontWeight: '800', marginBottom: '0.4rem' }}>
                    Agenda Comunal & Servicios Públicos
                </h1>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
                    Horarios de transporte, cálculo de tarifas, aseo cantonal y actividades culturales del distrito.
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
                    <Bus size={18} /> Transporte y Calculadora de Pasajes
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

            {/* PESTAÑA 1: TRANSPORTE Y CALCULADORA */}
            {activeTab === 'buses' && (
                <div style={{ display: 'grid', gap: '2rem' }}>

                    {/* HERRAMIENTA: CALCULADORA Y MONITOR DE SALIDAS */}
                    <div className="stitch-card" style={{ padding: '1.5rem', borderLeft: '5px solid var(--tertiary)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', color: 'var(--primary)' }}>
                            <Calculator size={22} color="var(--tertiary)" />
                            <h2 style={{ fontSize: '1.25rem', fontWeight: '800', margin: 0 }}>
                                Calculadora de Tarifas y Próxima Salida
                            </h2>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem', alignItems: 'end' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.35rem' }}>
                                    Seleccionar Ruta:
                                </label>
                                <select
                                    value={selectedRouteId}
                                    onChange={(e) => setSelectedRouteId(e.target.value)}
                                    style={{
                                        width: '100%',
                                        padding: '0.65rem',
                                        borderRadius: 'var(--radius-sm)',
                                        border: '1px solid var(--border-strong)',
                                        backgroundColor: 'var(--bg)',
                                        color: 'var(--text-main)',
                                        fontFamily: 'inherit',
                                        fontSize: '0.9rem'
                                    }}
                                >
                                    {busRoutes.map(r => (
                                        <option key={r.id} value={r.id}>{r.title} ({r.priceStr})</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.35rem' }}>
                                    Cantidad de Pasajes:
                                </label>
                                <input
                                    type="number"
                                    min="1"
                                    max="10"
                                    value={passengersCount}
                                    onChange={(e) => setPassengersCount(Math.max(1, parseInt(e.target.value) || 1))}
                                    style={{
                                        width: '100%',
                                        padding: '0.65rem',
                                        borderRadius: 'var(--radius-sm)',
                                        border: '1px solid var(--border-strong)',
                                        backgroundColor: 'var(--bg)',
                                        color: 'var(--text-main)',
                                        fontFamily: 'inherit',
                                        fontSize: '0.9rem'
                                    }}
                                />
                            </div>

                            <div>
                                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.35rem' }}>
                                    Paga con Billete de:
                                </label>
                                <select
                                    value={paymentBill}
                                    onChange={(e) => setPaymentBill(parseInt(e.target.value))}
                                    style={{
                                        width: '100%',
                                        padding: '0.65rem',
                                        borderRadius: 'var(--radius-sm)',
                                        border: '1px solid var(--border-strong)',
                                        backgroundColor: 'var(--bg)',
                                        color: 'var(--text-main)',
                                        fontFamily: 'inherit',
                                        fontSize: '0.9rem'
                                    }}
                                >
                                    <option value={1000}>₡1.000</option>
                                    <option value={2000}>₡2.000</option>
                                    <option value={5000}>₡5.000</option>
                                    <option value={10000}>₡10.000</option>
                                </select>
                            </div>
                        </div>

                        {/* Resultado del Cálculo */}
                        <div style={{
                            marginTop: '1.25rem',
                            padding: '1rem',
                            backgroundColor: 'var(--surface-subtle)',
                            borderRadius: 'var(--radius-sm)',
                            display: 'flex',
                            justifyContent: 'space-around',
                            alignItems: 'center',
                            flexWrap: 'wrap',
                            gap: '1rem'
                        }}>
                            <div>
                                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block' }}>Total a pagar</span>
                                <strong style={{ fontSize: '1.3rem', color: 'var(--primary)' }}>₡{totalFare.toLocaleString()}</strong>
                            </div>

                            <div>
                                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block' }}>Vuelto estimado</span>
                                <strong style={{ fontSize: '1.3rem', color: 'var(--tertiary)' }}>
                                    {paymentBill >= totalFare ? `₡${changeMoney.toLocaleString()}` : 'Billete insuficiente'}
                                </strong>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: 'var(--bg)', padding: '0.5rem 1rem', borderRadius: 'var(--radius-full)' }}>
                                <Timer size={18} color="var(--accent)" />
                                <span style={{ fontSize: '0.85rem', fontWeight: '700' }}>
                                    Próxima unidad en aprox: <span style={{ color: 'var(--accent)' }}>{minutesToNext} minutos</span>
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Tarjetas de Rutas Detalladas */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
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
                                        <span style={{ color: 'var(--text-muted)', display: 'block' }}>Pasaje ARESEP:</span>
                                        <strong style={{ color: 'var(--tertiary)', fontSize: '1.05rem' }}>{route.priceStr}</strong>
                                    </div>
                                    <div style={{ fontSize: '0.85rem' }}>
                                        <span style={{ color: 'var(--text-muted)', display: 'block' }}>Frecuencia regular:</span>
                                        <strong>Cada {route.frequencyMin} min</strong>
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
                                    <strong style={{ color: 'var(--text-main)', display: 'block', marginBottom: '0.2rem' }}>Puntos de Abordaje:</strong>
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

            {/* PESTAÑA 2: RECOLECCIÓN */}
            {activeTab === 'recoleccion' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
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
                            </div>

                            <div style={{ padding: '1.25rem', backgroundColor: 'var(--bg)', borderRadius: 'var(--radius-md)', borderTop: '4px solid var(--tertiary)' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                                    <Repeat size={22} color="var(--tertiary)" />
                                    <h3 style={{ fontSize: '1.1rem', fontWeight: '700' }}>Ruta de Reciclaje</h3>
                                </div>
                                <p style={{ fontSize: '0.95rem', fontWeight: '600', color: 'var(--text-main)' }}>
                                    {wasteSchedule[selectedSector].recycling}
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
                            </div>
                        </div>

                        <div style={{ marginTop: '1.5rem', padding: '1rem', backgroundColor: 'var(--tertiary-light)', borderRadius: 'var(--radius-sm)', fontSize: '0.85rem', color: 'var(--tertiary)', fontWeight: '600' }}>
                            💡 {wasteSchedule[selectedSector].note}
                        </div>
                    </div>
                </div>
            )}

            {/* PESTAÑA 3: EVENTOS */}
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
                                    fontSize: '0.85rem'
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