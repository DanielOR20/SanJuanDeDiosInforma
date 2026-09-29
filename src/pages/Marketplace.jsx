import React, { useState, useEffect } from 'react';
import { Store, PlusCircle, Search, MapPin, Tag, Phone } from 'lucide-react';
import { getMarketplaceItems } from '../services/api';
import MarketplaceModal from '../components/marketplace/MarketplaceModal';

export default function Marketplace() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Filtros
  const [searchTerm, setSearchTerm] = useState('');
  const [catFilter, setCatFilter] = useState('Todas');
  const [condFilter, setCondFilter] = useState('Todos');
  const [secFilter, setSecFilter] = useState('Todos');

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await getMarketplaceItems();
      setItems(data.filter(item => item.status === 'approved'));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredItems = items.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = catFilter === 'Todas' || item.category === catFilter;
    const matchesCond = condFilter === 'Todos' || item.condition === condFilter;
    const matchesSec = secFilter === 'Todos' || item.sector === secFilter;
    return matchesSearch && matchesCat && matchesCond && matchesSec;
  });

  const handleWhatsApp = (item) => {
    const text = encodeURIComponent(`Hola ${item.sellerName}, vi su artículo '${item.title}' en el Mercadito de San Juan de Dios y me interesa coordinar la compra.`);
    window.open(`https://api.whatsapp.com/send?phone=${item.phone}&text=${text}`, '_blank');
  };

  return (
    <div className="stitch-container" style={{ padding: '2rem 1rem' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', gap: '1rem' }}>
        <h1 style={{ color: '#002B7F', margin: 0, display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '1.8rem', fontWeight: '900' }}>
          <Store size={32} /> Mercadito San Juan: Compra y Venta Comunal
        </h1>
        <button 
          onClick={() => setIsModalOpen(true)}
          style={{
            backgroundColor: '#002B7F',
            color: 'white',
            padding: '0.6rem 1.25rem',
            borderRadius: '6px',
            border: 'none',
            fontWeight: '800',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            cursor: 'pointer'
          }}
        >
          <PlusCircle size={18} /> Vender un Artículo
        </button>
      </div>

      {/* Controles y Filtros */}
      <div className="stitch-card" style={{ padding: '1.25rem', marginBottom: '2rem', display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ flex: '1 1 300px', display: 'flex', alignItems: 'center', backgroundColor: '#F8FAFC', border: '1px solid #CBD5E1', borderRadius: '6px', padding: '0.5rem 0.75rem' }}>
          <Search size={18} color="#64748B" />
          <input 
            type="text" 
            placeholder="Buscar por palabra clave..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ border: 'none', background: 'transparent', outline: 'none', width: '100%', marginLeft: '0.5rem', fontSize: '0.9rem' }}
          />
        </div>
        
        <select 
          value={catFilter} 
          onChange={e => setCatFilter(e.target.value)}
          style={{ padding: '0.6rem 0.85rem', borderRadius: '6px', border: '1px solid #CBD5E1', flex: '1 1 150px' }}
        >
          <option value="Todas">Todas las Categorías</option>
          <option value="Hogar & Electrodomésticos">Hogar & Electrodomésticos</option>
          <option value="Vehículos & Bicis">Vehículos & Bicis</option>
          <option value="Juguetes & Bebés">Juguetes & Bebés</option>
          <option value="Tecnología">Tecnología</option>
          <option value="Ropa & Calzado">Ropa & Calzado</option>
          <option value="Otros">Otros</option>
        </select>

        <select 
          value={condFilter} 
          onChange={e => setCondFilter(e.target.value)}
          style={{ padding: '0.6rem 0.85rem', borderRadius: '6px', border: '1px solid #CBD5E1', flex: '1 1 150px' }}
        >
          <option value="Todos">Cualquier Condición</option>
          <option value="Nuevo">Nuevo</option>
          <option value="Usado - Como nuevo">Usado - Como nuevo</option>
          <option value="Usado - Buen estado">Usado - Buen estado</option>
        </select>

        <select 
          value={secFilter} 
          onChange={e => setSecFilter(e.target.value)}
          style={{ padding: '0.6rem 0.85rem', borderRadius: '6px', border: '1px solid #CBD5E1', flex: '1 1 150px' }}
        >
          <option value="Todos">Todos los Sectores</option>
          <option value="San Juan Centro">San Juan Centro</option>
          <option value="Sector Itaipú">Sector Itaipú</option>
          <option value="Sector Pedrito Monge">Sector Pedrito Monge</option>
          <option value="Sector Calle Máquinas">Sector Calle Máquinas</option>
        </select>
      </div>

      {/* Lista de Artículos */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#64748B' }}>Cargando artículos...</div>
      ) : filteredItems.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem', backgroundColor: '#F8FAFC', borderRadius: '8px', border: '1px dashed #CBD5E1' }}>
          <Store size={48} color="#94A3B8" style={{ marginBottom: '1rem' }} />
          <h3 style={{ color: '#334155', margin: '0 0 0.5rem 0' }}>No se encontraron artículos</h3>
          <p style={{ color: '#64748B', margin: 0 }}>Intenta cambiar los filtros de búsqueda.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
          {filteredItems.map(item => (
            <div key={item.id} className="stitch-card" style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
              <div style={{ position: 'relative', width: '100%', paddingTop: '75%', backgroundColor: '#E2E8F0' }}>
                <img 
                  src={item.imageUrl} 
                  alt={item.title} 
                  style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <div style={{ 
                  position: 'absolute', 
                  top: '10px', 
                  right: '10px', 
                  backgroundColor: 'rgba(0,0,0,0.7)', 
                  color: 'white', 
                  padding: '0.2rem 0.5rem', 
                  borderRadius: '4px',
                  fontSize: '0.75rem',
                  fontWeight: '700'
                }}>
                  {item.condition}
                </div>
              </div>
              <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                <div style={{ color: '#059669', fontSize: '1.4rem', fontWeight: '900', marginBottom: '0.5rem' }}>
                  ₡{item.price.toLocaleString()}
                </div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#0F172A', margin: '0 0 0.5rem 0', lineHeight: 1.3 }}>
                  {item.title}
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', marginBottom: '1rem', flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#64748B', fontSize: '0.85rem' }}>
                    <MapPin size={14} /> {item.sector}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#64748B', fontSize: '0.85rem' }}>
                    <Tag size={14} /> {item.category}
                  </div>
                  <p style={{ fontSize: '0.85rem', color: '#475569', marginTop: '0.5rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {item.description}
                  </p>
                </div>
                
                <button 
                  onClick={() => handleWhatsApp(item)}
                  style={{
                    backgroundColor: '#059669',
                    color: 'white',
                    padding: '0.6rem',
                    borderRadius: '6px',
                    border: 'none',
                    fontWeight: '700',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.4rem',
                    cursor: 'pointer',
                    width: '100%',
                    marginTop: 'auto'
                  }}
                >
                  <Phone size={16} /> Contactar al vendedor
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {isModalOpen && (
        <MarketplaceModal 
          onClose={() => setIsModalOpen(false)} 
          onPublished={loadData}
        />
      )}
    </div>
  );
}
