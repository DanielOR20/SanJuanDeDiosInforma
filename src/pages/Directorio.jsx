import { useEffect, useState } from 'react';
import { getBusinesses, createBusiness, getLandmarks } from '../services/api';
import { ComunidadMap } from '../components/ComunidadMap';
import {
    Search,
    MapPin,
    Star,
    MessageCircle,
    Store,
    Filter,
    PlusCircle,
    Map,
    Grid,
    Navigation,
    Clock,
    X
} from 'lucide-react';

export const Directorio = () => {
    const [businesses, setBusinesses] = useState([]);
    const [landmarks, setLandmarks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('Todas');
    const [selectedBusiness, setSelectedBusiness] = useState(null);
    const [viewMode, setViewMode] = useState('both'); // 'both', 'cards', 'map'
    const [showModal, setShowModal] = useState(false);

    // Formulario nuevo comercio
    const [formData, setFormData] = useState({
        name: '',
        category: 'Alimentación',
        description: '',
        phone: '',
        whatsapp: '',
        address: '',
        schedule: 'Lunes a Sábado: 8:00 AM - 6:00 PM',
        lat: 9.8940,
        lng: -84.0740
    });

    const loadData = async () => {
        try {
            const [bizData, landData] = await Promise.all([
                getBusinesses(),
                getLandmarks().catch(() => [])
            ]);
            setBusinesses(bizData);
            setLandmarks(landData);
        } catch (error) {
            console.error('Error cargando comercios:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleCreateBusiness = async (e) => {
        e.preventDefault();
        if (!formData.name.trim() || !formData.phone.trim()) return;

        try {
            const newBiz = {
                ...formData,
                whatsapp: `506${formData.whatsapp.replace(/\D/g, '')}`,
                lat: 9.8940, // Coordenadas fijas en el centro de San Juan de Dios
                lng: -84.0740,
                rating: 5.0,
                reviewsCount: 1,
                status: 'En Revisión',
                verified: false // <-- Pasa a moderación del administrador
            };

            await createBusiness(newBiz);
            setShowModal(false);
            alert('¡Negocio enviado con éxito! La ADI revisará la información antes de publicarlo en el directorio.');
            setFormData({
                name: '',
                category: 'Alimentación',
                description: '',
                phone: '',
                whatsapp: '',
                address: '',
                schedule: 'Lunes a Sábado: 8:00 AM - 6:00 PM',
                lat: 9.8940,
                lng: -84.0740
            });
            loadData();
        } catch (err) {
            alert('Error al registrar el comercio');
        }
    };

    const categories = ['Todas', ...new Set(businesses.map(b => b.category))];

    const filteredBusinesses = businesses.filter(b => {
        const matchesSearch = b.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            b.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (b.description && b.description.toLowerCase().includes(searchTerm.toLowerCase()));
        const matchesCategory = selectedCategory === 'Todas' || b.category === selectedCategory;
        const isVerified = b.verified === true;

        return matchesSearch && matchesCategory && isVerified;
    });

    return (
        <div className="stitch-container" style={{ paddingBottom: '3rem', marginTop: '2rem' }}>

            {/* Encabezado */}
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                flexWrap: 'wrap',
                gap: '1rem',
                marginBottom: '1.5rem'
            }}>
                <div>
                    <h1 style={{ color: 'var(--primary)', fontSize: '2rem', fontWeight: '800', marginBottom: '0.4rem' }}>
                        Directorio Comercial & Emprendimientos
                    </h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
                        Encuentre comercios locales geolocalizados, consulte horarios y comuníquese directo por WhatsApp.
                    </p>
                </div>

                <button
                    onClick={() => setShowModal(true)}
                    style={{
                        backgroundColor: 'var(--tertiary)',
                        color: '#FFFFFF',
                        padding: '0.7rem 1.25rem',
                        borderRadius: 'var(--radius-md)',
                        fontWeight: '700',
                        fontSize: '0.9rem',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        boxShadow: 'var(--shadow-sm)'
                    }}
                >
                    <PlusCircle size={18} /> Inscribir Mi Negocio
                </button>
            </div>

            {/* Controles: Búsqueda, Filtro y Modos de Vista */}
            <div style={{
                display: 'flex',
                gap: '1rem',
                marginBottom: '1.5rem',
                flexWrap: 'wrap',
                alignItems: 'center',
                justifyContent: 'space-between',
                backgroundColor: 'var(--surface)',
                padding: '0.85rem 1.25rem',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border)'
            }}>
                <div style={{ display: 'flex', gap: '0.75rem', flex: '1 1 320px', flexWrap: 'wrap' }}>
                    <div style={{ position: 'relative', flex: '1 1 220px' }}>
                        <Search size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} />
                        <input
                            type="text"
                            placeholder="Buscar por negocio, servicio o repuesto..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '0.65rem 0.85rem 0.65rem 2.4rem',
                                borderRadius: 'var(--radius-sm)',
                                border: '1px solid var(--border-strong)',
                                backgroundColor: 'var(--bg)',
                                color: 'var(--text-main)',
                                fontFamily: 'inherit',
                                fontSize: '0.9rem'
                            }}
                        />
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <Filter size={16} color="var(--text-muted)" />
                        <select
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            style={{
                                padding: '0.65rem 0.85rem',
                                borderRadius: 'var(--radius-sm)',
                                border: '1px solid var(--border-strong)',
                                backgroundColor: 'var(--bg)',
                                color: 'var(--text-main)',
                                fontFamily: 'inherit',
                                fontSize: '0.9rem',
                                cursor: 'pointer'
                            }}
                        >
                            {categories.map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Botones de conmutación de vista */}
                <div style={{ display: 'flex', gap: '0.35rem', backgroundColor: 'var(--surface-subtle)', padding: '0.25rem', borderRadius: 'var(--radius-sm)' }}>
                    <button
                        onClick={() => setViewMode('both')}
                        title="Vista dividida (Tarjetas + Mapa)"
                        style={{
                            padding: '0.4rem 0.75rem',
                            borderRadius: 'var(--radius-sm)',
                            fontSize: '0.8rem',
                            fontWeight: '600',
                            backgroundColor: viewMode === 'both' ? 'var(--primary)' : 'transparent',
                            color: viewMode === 'both' ? '#fff' : 'var(--text-muted)'
                        }}
                    >
                        Dividida
                    </button>
                    <button
                        onClick={() => setViewMode('cards')}
                        title="Solo tarjetas"
                        style={{
                            padding: '0.4rem 0.75rem',
                            borderRadius: 'var(--radius-sm)',
                            fontSize: '0.8rem',
                            fontWeight: '600',
                            backgroundColor: viewMode === 'cards' ? 'var(--primary)' : 'transparent',
                            color: viewMode === 'cards' ? '#fff' : 'var(--text-muted)'
                        }}
                    >
                        <Grid size={15} style={{ verticalAlign: 'middle' }} />
                    </button>
                    <button
                        onClick={() => setViewMode('map')}
                        title="Solo mapa"
                        style={{
                            padding: '0.4rem 0.75rem',
                            borderRadius: 'var(--radius-sm)',
                            fontSize: '0.8rem',
                            fontWeight: '600',
                            backgroundColor: viewMode === 'map' ? 'var(--primary)' : 'transparent',
                            color: viewMode === 'map' ? '#fff' : 'var(--text-muted)'
                        }}
                    >
                        <Map size={15} style={{ verticalAlign: 'middle' }} />
                    </button>
                </div>
            </div>

            {/* ÁREA PRINCIPAL SEGÚN MODO DE VISTA */}
            {loading ? (
                <p style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '3rem' }}>Cargando comercios de San Juan de Dios...</p>
            ) : (
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: viewMode === 'both' ? '1fr 1fr' : '1fr',
                    gap: '1.5rem',
                    alignItems: 'start'
                }}>

                    {/* Columna de Tarjetas */}
                    {viewMode !== 'map' && (
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: viewMode === 'cards' ? 'repeat(auto-fill, minmax(300px, 1fr))' : '1fr',
                            gap: '1.25rem',
                            maxHeight: viewMode === 'both' ? '700px' : 'none',
                            overflowY: viewMode === 'both' ? 'auto' : 'visible',
                            paddingRight: viewMode === 'both' ? '0.5rem' : '0'
                        }}>
                            {filteredBusinesses.length > 0 ? (
                                filteredBusinesses.map(biz => {
                                    const isSelected = selectedBusiness?.id === biz.id;
                                    return (
                                        <div
                                            key={biz.id}
                                            className="stitch-card"
                                            style={{
                                                padding: '1.25rem',
                                                border: isSelected ? '2px solid var(--primary)' : '1px solid var(--border)',
                                                backgroundColor: isSelected ? 'var(--primary-light)' : 'var(--surface)',
                                                cursor: 'pointer'
                                            }}
                                            onClick={() => setSelectedBusiness(biz)}
                                        >
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.4rem' }}>
                                                <span style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--primary)', textTransform: 'uppercase' }}>
                                                    {biz.category}
                                                </span>
                                                <span className="badge badge-success" style={{ fontSize: '0.7rem' }}>
                                                    {biz.status}
                                                </span>
                                            </div>

                                            <h3 style={{ fontSize: '1.15rem', fontWeight: '700', marginBottom: '0.35rem' }}>
                                                {biz.name}
                                            </h3>

                                            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.75rem', lineHeight: '1.4' }}>
                                                {biz.description}
                                            </p>

                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                                                <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                                                    <MapPin size={14} color="var(--primary)" /> {biz.address}
                                                </span>
                                                {biz.schedule && (
                                                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                                                        <Clock size={14} color="var(--accent)" /> {biz.schedule}
                                                    </span>
                                                )}
                                                <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                                                    <Star size={14} fill="var(--accent)" color="var(--accent)" />
                                                    <strong>{biz.rating}</strong> ({biz.reviewsCount} opiniones vecinales)
                                                </span>
                                            </div>

                                            {/* Botones de acción */}
                                            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                                                <a
                                                    href={`https://wa.me/${biz.whatsapp || '506' + biz.phone.replace(/\D/g, '')}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    onClick={(e) => e.stopPropagation()}
                                                    style={{
                                                        flex: 1,
                                                        minWidth: '130px',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        gap: '0.4rem',
                                                        backgroundColor: '#25D366',
                                                        color: 'white',
                                                        padding: '0.55rem',
                                                        borderRadius: 'var(--radius-sm)',
                                                        fontWeight: '700',
                                                        fontSize: '0.85rem'
                                                    }}
                                                >
                                                    <MessageCircle size={15} /> WhatsApp
                                                </a>

                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setSelectedBusiness(biz);
                                                        if (viewMode === 'cards') setViewMode('both');
                                                    }}
                                                    style={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: '0.35rem',
                                                        padding: '0.55rem 0.85rem',
                                                        backgroundColor: 'var(--surface-subtle)',
                                                        color: 'var(--text-main)',
                                                        borderRadius: 'var(--radius-sm)',
                                                        fontSize: '0.85rem',
                                                        fontWeight: '600',
                                                        border: '1px solid var(--border)'
                                                    }}
                                                >
                                                    <Navigation size={14} color="var(--primary)" /> Ubicar
                                                </button>
                                            </div>

                                        </div>
                                    );
                                })
                            ) : (
                                <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '2rem' }}>
                                    No hay comercios que coincidan con la búsqueda.
                                </p>
                            )}
                        </div>
                    )}

                    {/* Columna del Mapa Interactivo */}
                    {viewMode !== 'cards' && (
                        <div style={{ position: viewMode === 'both' ? 'sticky' : 'static', top: '90px' }}>
                            <ComunidadMap
                                businesses={filteredBusinesses}
                                landmarks={landmarks}
                                selectedItem={selectedBusiness}
                                height={viewMode === 'both' ? '680px' : '550px'}
                            />
                        </div>
                    )}

                </div>
            )}

            {/* Modal para inscribir nuevo comercio */}
            {showModal && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    backgroundColor: 'rgba(0,0,0,0.65)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 100,
                    padding: '1rem'
                }}>
                    <div className="stitch-card" style={{ width: '100%', maxWidth: '540px', padding: '2rem', position: 'relative' }}>
                        <button
                            onClick={() => setShowModal(false)}
                            style={{ position: 'absolute', top: '1.25rem', right: '1.25rem', background: 'none', border: 'none', color: 'var(--text-muted)' }}
                        >
                            <X size={20} />
                        </button>

                        <h2 style={{ fontSize: '1.3rem', fontWeight: '800', color: 'var(--primary)', marginBottom: '0.3rem' }}>
                            Registrar Negocio o Emprendimiento
                        </h2>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
                            Impulse su comercio dentro de la comunidad de San Juan de Dios y aparezca en el mapa distrital.
                        </p>

                        <form onSubmit={handleCreateBusiness} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', marginBottom: '0.25rem' }}>Nombre Comercial</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="Ej: Taller & Repuestos Solís"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    style={{ width: '100%', padding: '0.6rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-strong)', backgroundColor: 'var(--bg)', color: 'var(--text-main)', fontFamily: 'inherit' }}
                                />
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', marginBottom: '0.25rem' }}>Categoría</label>
                                    <select
                                        value={formData.category}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                        style={{ width: '100%', padding: '0.6rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-strong)', backgroundColor: 'var(--bg)', color: 'var(--text-main)', fontFamily: 'inherit' }}
                                    >
                                        <option value="Alimentación">Alimentación</option>
                                        <option value="Automotriz">Automotriz</option>
                                        <option value="Salud">Salud</option>
                                        <option value="Construcción">Construcción</option>
                                        <option value="Mascotas">Mascotas</option>
                                        <option value="Belleza">Belleza</option>
                                        <option value="Servicios">Servicios</option>
                                    </select>
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', marginBottom: '0.25rem' }}>Teléfono / WhatsApp</label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="Ej: 8899-2211"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value, whatsapp: e.target.value })}
                                        style={{ width: '100%', padding: '0.6rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-strong)', backgroundColor: 'var(--bg)', color: 'var(--text-main)', fontFamily: 'inherit' }}
                                    />
                                </div>
                            </div>

                            <div>
                                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', marginBottom: '0.25rem' }}>Dirección Exacta</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="Ej: 150m Sur de la Plaza de Deportes, San Juan"
                                    value={formData.address}
                                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                    style={{ width: '100%', padding: '0.6rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-strong)', backgroundColor: 'var(--bg)', color: 'var(--text-main)', fontFamily: 'inherit' }}
                                />
                            </div>

                            <div>
                                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', marginBottom: '0.25rem' }}>Descripción de Productos / Servicios</label>
                                <textarea
                                    rows={2}
                                    required
                                    placeholder="Qué ofrece, marcas, especialidades..."
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    style={{ width: '100%', padding: '0.6rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-strong)', backgroundColor: 'var(--bg)', color: 'var(--text-main)', fontFamily: 'inherit', resize: 'none' }}
                                />
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    style={{ padding: '0.6rem 1rem', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--surface-subtle)', color: 'var(--text-main)', fontWeight: '600' }}
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    style={{ padding: '0.6rem 1.25rem', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--tertiary)', color: '#FFFFFF', fontWeight: '700' }}
                                >
                                    Registrar Comercio
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

        </div>
    );
};