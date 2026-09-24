import { useEffect, useState } from 'react';
import { getBusinesses } from '../services/api';
import { 
  Search, 
  MapPin, 
  Star, 
  MessageCircle, 
  Store,
  Filter
} from 'lucide-react';

export const Directorio = () => {
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todas');

  useEffect(() => {
    const loadBusinesses = async () => {
      try {
        const data = await getBusinesses();
        setBusinesses(data);
      } catch (error) {
        console.error('Error cargando comercios:', error);
      } finally {
        setLoading(false);
      }
    };
    loadBusinesses();
  }, []);

  // Extraer categorías únicas para los filtros
  const categories = ['Todas', ...new Set(businesses.map(b => b.category))];

  // Lógica de filtrado
  const filteredBusinesses = businesses.filter(business => {
    const matchesSearch = business.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          business.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'Todas' || business.category === selectedCategory;
    
    // Si la ADI no lo ha verificado (status pendiente), no lo mostramos al público aún
    const isVerified = business.verified === true; 

    return matchesSearch && matchesCategory && isVerified;
  });

  return (
    <div className="stitch-container" style={{ paddingBottom: '3rem', marginTop: '2rem' }}>
      
      {/* Encabezado del Directorio */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ color: 'var(--primary)', fontSize: '2rem', fontWeight: '800', marginBottom: '0.5rem' }}>
          Directorio Comercial y Emprendimientos
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1rem' }}>
          Apoye el comercio local: descubra restaurantes, talleres, pulperías y servicios a pocos pasos de su hogar en San Juan de Dios.
        </p>
      </div>

      {/* Barra de Búsqueda y Filtros */}
      <div style={{ 
        display: 'flex', 
        gap: '1rem', 
        marginBottom: '2rem', 
        flexWrap: 'wrap',
        backgroundColor: 'var(--surface)',
        padding: '1rem',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--border)'
      }}>
        <div style={{ flex: '1 1 300px', position: 'relative' }}>
          <Search size={20} color="var(--text-muted)" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
          <input 
            type="text" 
            placeholder="Buscar por nombre de panadería, taller, servicio..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '0.75rem 1rem 0.75rem 2.75rem',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border-strong)',
              backgroundColor: 'var(--bg)',
              color: 'var(--text-main)',
              fontFamily: 'inherit',
              fontSize: '0.95rem'
            }}
          />
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Filter size={18} color="var(--text-muted)" />
          <select 
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            style={{
              padding: '0.75rem 1rem',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border-strong)',
              backgroundColor: 'var(--bg)',
              color: 'var(--text-main)',
              fontFamily: 'inherit',
              fontSize: '0.95rem',
              cursor: 'pointer'
            }}
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Grilla de Tarjetas de Negocios */}
      {loading ? (
        <p style={{ textAlign: 'center', color: 'var(--text-muted)' }}>Cargando directorio...</p>
      ) : (
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', 
          gap: '1.5rem' 
        }}>
          {filteredBusinesses.length > 0 ? (
            filteredBusinesses.map(business => (
              <div key={business.id} className="stitch-card" style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
                
                {/* Cabecera de la Tarjeta (Simulando foto) */}
                <div style={{ 
                  height: '100px', 
                  backgroundColor: 'var(--border)', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  position: 'relative'
                }}>
                  <Store size={40} color="var(--text-muted)" opacity={0.5} />
                  <span className="badge badge-success" style={{ position: 'absolute', top: '0.75rem', left: '0.75rem' }}>
                    <span style={{ width: '6px', height: '6px', backgroundColor: 'var(--tertiary)', borderRadius: '50%', display: 'inline-block' }}></span>
                    {business.status}
                  </span>
                </div>

                {/* Contenido */}
                <div style={{ padding: '1.25rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--primary)', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
                    {business.category}
                  </div>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: '700', marginBottom: '0.5rem', lineHeight: '1.2' }}>
                    {business.name}
                  </h3>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', marginBottom: '0.75rem' }}>
                    <Star size={16} fill="var(--accent)" color="var(--accent)" />
                    <span style={{ fontWeight: '700', fontSize: '0.9rem' }}>{business.rating}</span>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>({business.reviewsCount} reseñas)</span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1.25rem', flex: 1 }}>
                    <MapPin size={16} style={{ flexShrink: 0, marginTop: '0.1rem' }} />
                    <span>{business.address}</span>
                  </div>

                  {/* Botón WhatsApp */}
                  <a 
                    href={`https://wa.me/506${business.phone.replace('-', '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.5rem',
                      backgroundColor: '#25D366', /* Color oficial WhatsApp */
                      color: 'white',
                      padding: '0.75rem',
                      borderRadius: 'var(--radius-sm)',
                      fontWeight: '700',
                      fontSize: '0.95rem',
                      width: '100%',
                      transition: 'filter 0.2s'
                    }}
                    onMouseOver={(e) => e.target.style.filter = 'brightness(0.95)'}
                    onMouseOut={(e) => e.target.style.filter = 'brightness(1)'}
                  >
                    <MessageCircle size={18} /> Contactar por WhatsApp
                  </a>
                </div>
              </div>
            ))
          ) : (
            <p style={{ color: 'var(--text-muted)', gridColumn: '1 / -1', textAlign: 'center', padding: '2rem' }}>
              No se encontraron comercios que coincidan con tu búsqueda.
            </p>
          )}
        </div>
      )}
    </div>
  );
};