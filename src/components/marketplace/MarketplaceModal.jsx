import React, { useState } from 'react';
import { X, Send, Camera, Info } from 'lucide-react';
import { createMarketplaceItem } from '../../services/api';
import { useApp } from '../../context/AppContext';

export default function MarketplaceModal({ onClose, onPublished }) {
  const { user } = useApp();
  const [formData, setFormData] = useState({
    title: '',
    price: '',
    category: 'Otros',
    condition: 'Usado - Buen estado',
    sector: 'San Juan Centro',
    description: '',
    phone: '',
    imageUrl: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const payload = {
        ...formData,
        price: Number(formData.price),
        sellerName: user?.name || 'Vecino de San Juan',
        imageUrl: formData.imageUrl || 'https://images.unsplash.com/photo-1558486518-e4eb723046f4?w=500&auto=format&fit=crop&q=60' // Default box image
      };
      
      await createMarketplaceItem(payload);
      setSuccess(true);
      setTimeout(() => {
        onPublished();
        onClose();
      }, 3000);
    } catch (err) {
      console.error(err);
      setError('Hubo un problema al enviar la publicación.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(15, 23, 42, 0.75)',
      backdropFilter: 'blur(4px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      padding: '1rem'
    }}>
      <div className="stitch-card" style={{
        width: '100%',
        maxWidth: '600px',
        maxHeight: '90vh',
        overflowY: 'auto',
        backgroundColor: '#FFFFFF',
        padding: '2rem',
        position: 'relative'
      }}>
        <button 
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '1.5rem',
            right: '1.5rem',
            background: 'none',
            border: 'none',
            color: '#64748B',
            cursor: 'pointer'
          }}
        >
          <X size={24} />
        </button>

        <h2 style={{ color: '#002B7F', fontSize: '1.5rem', fontWeight: '900', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Store size={24} /> Publicar Artículo
        </h2>

        {success ? (
          <div style={{
            backgroundColor: '#ECFDF5',
            border: '1px solid #10B981',
            borderRadius: '6px',
            padding: '1.5rem',
            textAlign: 'center',
            color: '#065F46'
          }}>
            <h3 style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', fontSize: '1.25rem', marginBottom: '0.5rem' }}>
              <Info size={24} /> ¡Artículo enviado a revisión!
            </h3>
            <p>El artículo aparecerá en el Mercadito una vez aprobado por la administración de la ADI.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {error && (
              <div style={{ color: '#DC2626', backgroundColor: '#FEF2F2', padding: '0.75rem', borderRadius: '4px', fontSize: '0.85rem' }}>
                {error}
              </div>
            )}
            
            <div>
              <label style={{ display: 'block', marginBottom: '0.25rem', fontWeight: 'bold', fontSize: '0.85rem' }}>Título del Artículo</label>
              <input 
                type="text" 
                name="title" 
                required 
                value={formData.title}
                onChange={handleChange}
                placeholder="Ej. Bicicleta de montaña"
                style={{ width: '100%', padding: '0.6rem 0.85rem', borderRadius: '6px', border: '1px solid var(--border)' }}
              />
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.25rem', fontWeight: 'bold', fontSize: '0.85rem' }}>Precio (₡)</label>
                <input 
                  type="number" 
                  name="price" 
                  required 
                  min="0"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="Ej. 15000"
                  style={{ width: '100%', padding: '0.6rem 0.85rem', borderRadius: '6px', border: '1px solid var(--border)' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.25rem', fontWeight: 'bold', fontSize: '0.85rem' }}>Teléfono WhatsApp</label>
                <input 
                  type="tel" 
                  name="phone" 
                  required 
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="50688888888"
                  style={{ width: '100%', padding: '0.6rem 0.85rem', borderRadius: '6px', border: '1px solid var(--border)' }}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.25rem', fontWeight: 'bold', fontSize: '0.85rem' }}>Categoría</label>
                <select 
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  style={{ width: '100%', padding: '0.6rem 0.85rem', borderRadius: '6px', border: '1px solid var(--border)', backgroundColor: 'white' }}
                >
                  <option value="Hogar & Electrodomésticos">Hogar & Electrodomésticos</option>
                  <option value="Vehículos & Bicis">Vehículos & Bicis</option>
                  <option value="Juguetes & Bebés">Juguetes & Bebés</option>
                  <option value="Tecnología">Tecnología</option>
                  <option value="Ropa & Calzado">Ropa & Calzado</option>
                  <option value="Otros">Otros</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.25rem', fontWeight: 'bold', fontSize: '0.85rem' }}>Condición</label>
                <select 
                  name="condition"
                  value={formData.condition}
                  onChange={handleChange}
                  style={{ width: '100%', padding: '0.6rem 0.85rem', borderRadius: '6px', border: '1px solid var(--border)', backgroundColor: 'white' }}
                >
                  <option value="Nuevo">Nuevo</option>
                  <option value="Usado - Como nuevo">Usado - Como nuevo</option>
                  <option value="Usado - Buen estado">Usado - Buen estado</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.25rem', fontWeight: 'bold', fontSize: '0.85rem' }}>Sector de Entrega</label>
                <select 
                  name="sector"
                  value={formData.sector}
                  onChange={handleChange}
                  style={{ width: '100%', padding: '0.6rem 0.85rem', borderRadius: '6px', border: '1px solid var(--border)', backgroundColor: 'white' }}
                >
                  <option value="San Juan Centro">San Juan Centro</option>
                  <option value="Sector Itaipú">Sector Itaipú</option>
                  <option value="Sector Pedrito Monge">Sector Pedrito Monge</option>
                  <option value="Sector Calle Máquinas">Sector Calle Máquinas</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.25rem', fontWeight: 'bold', fontSize: '0.85rem' }}>URL Foto (Opcional)</label>
                <input 
                  type="url" 
                  name="imageUrl" 
                  value={formData.imageUrl}
                  onChange={handleChange}
                  placeholder="https://ejemplo.com/foto.jpg"
                  style={{ width: '100%', padding: '0.6rem 0.85rem', borderRadius: '6px', border: '1px solid var(--border)' }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.25rem', fontWeight: 'bold', fontSize: '0.85rem' }}>Descripción</label>
              <textarea 
                name="description" 
                required 
                value={formData.description}
                onChange={handleChange}
                rows={3}
                placeholder="Detalles del artículo, estado, accesorios incluidos..."
                style={{ width: '100%', padding: '0.6rem 0.85rem', borderRadius: '6px', border: '1px solid var(--border)', resize: 'vertical' }}
              />
            </div>

            <button 
              type="submit" 
              disabled={loading}
              style={{
                backgroundColor: '#002B7F',
                color: 'white',
                padding: '0.75rem',
                borderRadius: '6px',
                border: 'none',
                fontWeight: '800',
                fontSize: '1rem',
                cursor: loading ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                marginTop: '0.5rem'
              }}
            >
              {loading ? 'Enviando...' : <><Send size={18} /> Publicar para Revisión</>}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

// Needed imports workaround for missing icons
import { Store } from 'lucide-react';
