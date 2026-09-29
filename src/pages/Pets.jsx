import React, { useState, useEffect } from 'react';
import { getCommunityPets, createCommunityPet } from '../services/api';
import { Heart, Search, Home, PlusCircle, MapPin, Calendar, Phone, Share2, X, Dog, Cat } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';

export default function Pets() {
  const { user } = useApp();
  const navigate = useNavigate();
  const [pets, setPets] = useState([]);
  const [filter, setFilter] = useState('Todos');
  const [loading, setLoading] = useState(true);
  
  // Modals
  const [showModal, setShowModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState({
    name: '', type: 'perro', status: 'perdido', breed: '', sector: '', phone: '', imageUrl: '', description: ''
  });

  const loadPets = async () => {
    setLoading(true);
    try {
      const data = await getCommunityPets();
      // Reverse to show newest first
      setPets(data.reverse());
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPets();
  }, []);

  const handleReportClick = () => {
    if (!user) {
      setShowAuthModal(true);
    } else {
      setFormData({ ...formData, contactName: user.name });
      setShowModal(true);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createCommunityPet(formData);
      setShowModal(false);
      setFormData({ name: '', type: 'perro', status: 'perdido', breed: '', sector: '', phone: '', imageUrl: '', description: '' });
      loadPets();
    } catch (err) {
      console.error(err);
      alert("Error al reportar mascota");
    }
  };

  const getStatusConfig = (status) => {
    switch(status) {
      case 'perdido': return { color: '#DC2626', bg: '#FEE2E2', label: 'PERDIDO', icon: Search };
      case 'encontrado': return { color: '#002B7F', bg: '#E0E7FF', label: 'ENCONTRADO', icon: Dog };
      case 'adopcion': return { color: '#059669', bg: '#D1FAE5', label: 'EN ADOPCIÓN', icon: Home };
      default: return { color: '#64748B', bg: '#F1F5F9', label: status.toUpperCase(), icon: Heart };
    }
  };

  const handleShare = (pet) => {
    const text = encodeURIComponent(`¡ALERTA COMUNAL DE SAN JUAN DE DIOS! 🐾 Se busca a ${pet.name} en ${pet.sector}. Por favor avisar a ${pet.contactName}: ${pet.phone} - ${window.location.origin}/mascotas`);
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  const handleContact = (pet) => {
    const text = encodeURIComponent(`Hola ${pet.contactName}, le escribo por el reporte de la mascota ${pet.name} en el portal de San Juan de Dios.`);
    window.open(`https://api.whatsapp.com/send?phone=${pet.phone.replace(/[^0-9]/g, '')}&text=${text}`, '_blank');
  };

  const filteredPets = filter === 'Todos' ? pets : pets.filter(p => p.status === filter);

  return (
    <div className="stitch-container" style={{ padding: '2rem 1rem 4rem 1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem', borderBottom: '2px solid #E2E8F0', paddingBottom: '1.5rem' }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem', color: '#059669', fontWeight: '800', fontSize: '0.85rem', marginBottom: '0.35rem' }}>
            <Heart size={18} /> Módulo de Bienestar Animal
          </div>
          <h1 style={{ fontSize: '2rem', fontWeight: '900', color: '#0F172A', margin: '0 0 0.4rem 0' }}>Huellitas San Juan</h1>
          <p style={{ color: '#475569', margin: 0, fontSize: '0.95rem' }}>Directorio vecinal para reporte de mascotas perdidas, encontradas y en adopción distrital.</p>
        </div>
        
        <button 
          onClick={handleReportClick}
          style={{ backgroundColor: '#059669', color: 'white', border: 'none', padding: '0.75rem 1.25rem', borderRadius: '8px', fontWeight: '800', fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', boxShadow: '0 4px 6px rgba(5, 150, 105, 0.2)' }}
        >
          <PlusCircle size={20} /> Reportar Mascota
        </button>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
        {[
          { id: 'Todos', label: 'Todos' },
          { id: 'perdido', label: '🚨 Perdidos' },
          { id: 'encontrado', label: '✅ Encontrados' },
          { id: 'adopcion', label: '🏡 En Adopción' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setFilter(tab.id)}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '99px',
              border: filter === tab.id ? '2px solid #002B7F' : '1px solid #CBD5E1',
              backgroundColor: filter === tab.id ? '#002B7F' : 'white',
              color: filter === tab.id ? 'white' : '#475569',
              fontWeight: '700',
              fontSize: '0.85rem',
              cursor: 'pointer',
              whiteSpace: 'nowrap'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#64748B' }}>Cargando huellitas...</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
          {filteredPets.map(pet => {
            const status = getStatusConfig(pet.status);
            return (
              <div key={pet.id} className="stitch-card" style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                <div style={{ position: 'relative', height: '220px', width: '100%', backgroundColor: '#F1F5F9' }}>
                  <img src={pet.imageUrl || 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=500&auto=format&fit=crop&q=60'} alt={pet.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <div style={{ position: 'absolute', top: '12px', right: '12px', backgroundColor: status.bg, color: status.color, padding: '0.35rem 0.75rem', borderRadius: '99px', fontWeight: '900', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.35rem', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                    <status.icon size={14} /> {status.label}
                  </div>
                </div>
                
                <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                    <h3 style={{ margin: 0, fontSize: '1.4rem', fontWeight: '900', color: '#0F172A' }}>{pet.name}</h3>
                    <div style={{ color: '#64748B', fontSize: '0.85rem', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      {pet.type === 'gato' ? <Cat size={14} /> : <Dog size={14} />} {pet.breed}
                    </div>
                  </div>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', marginBottom: '1rem', color: '#475569', fontSize: '0.85rem', fontWeight: '600' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                      <MapPin size={14} color="#002B7F" /> Sector: {pet.sector}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                      <Calendar size={14} color="#002B7F" /> Fecha: {pet.date}
                    </div>
                  </div>
                  
                  <p style={{ fontSize: '0.9rem', color: '#334155', lineHeight: 1.5, margin: '0 0 1.25rem 0', flex: 1 }}>
                    {pet.description}
                  </p>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                    <button 
                      onClick={() => handleContact(pet)}
                      style={{ backgroundColor: '#E0E7FF', color: '#002B7F', border: 'none', padding: '0.65rem', borderRadius: '6px', fontWeight: '800', fontSize: '0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem', cursor: 'pointer' }}
                    >
                      <Phone size={16} /> Contactar
                    </button>
                    <button 
                      onClick={() => handleShare(pet)}
                      style={{ backgroundColor: '#25D366', color: 'white', border: 'none', padding: '0.65rem', borderRadius: '6px', fontWeight: '800', fontSize: '0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem', cursor: 'pointer' }}
                    >
                      <Share2 size={16} /> Compartir
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Upload Modal */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '1rem' }}>
          <div className="stitch-card" style={{ width: '100%', maxWidth: '500px', backgroundColor: 'white', padding: '2rem', borderRadius: '16px', position: 'relative', maxHeight: '90vh', overflowY: 'auto' }}>
            <button onClick={() => setShowModal(false)} style={{ position: 'absolute', top: '1.25rem', right: '1.25rem', background: 'none', border: 'none', color: '#64748B', cursor: 'pointer' }}><X size={24} /></button>
            <h2 style={{ margin: '0 0 1.5rem 0', color: '#0F172A', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <PlusCircle size={24} color="#059669" /> Reportar Mascota
            </h2>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div><label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', marginBottom: '0.25rem' }}>Nombre (o Alias)</label><input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} style={{ width: '100%', padding: '0.65rem', borderRadius: '4px', border: '1px solid #CBD5E1' }} /></div>
                <div><label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', marginBottom: '0.25rem' }}>Estado</label>
                  <select required value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} style={{ width: '100%', padding: '0.65rem', borderRadius: '4px', border: '1px solid #CBD5E1', backgroundColor: 'white' }}>
                    <option value="perdido">Perdido</option>
                    <option value="encontrado">Encontrado</option>
                    <option value="adopcion">En Adopción</option>
                  </select>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div><label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', marginBottom: '0.25rem' }}>Tipo</label>
                  <select required value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} style={{ width: '100%', padding: '0.65rem', borderRadius: '4px', border: '1px solid #CBD5E1', backgroundColor: 'white' }}>
                    <option value="perro">Perro</option>
                    <option value="gato">Gato</option>
                    <option value="otro">Otro</option>
                  </select>
                </div>
                <div><label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', marginBottom: '0.25rem' }}>Raza / Rasgos</label><input type="text" required value={formData.breed} onChange={e => setFormData({...formData, breed: e.target.value})} style={{ width: '100%', padding: '0.65rem', borderRadius: '4px', border: '1px solid #CBD5E1' }} /></div>
              </div>
              <div><label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', marginBottom: '0.25rem' }}>Sector o lugar exacto</label><input type="text" required value={formData.sector} onChange={e => setFormData({...formData, sector: e.target.value})} style={{ width: '100%', padding: '0.65rem', borderRadius: '4px', border: '1px solid #CBD5E1' }} /></div>
              <div><label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', marginBottom: '0.25rem' }}>URL Foto (JPG/PNG)</label><input type="url" required value={formData.imageUrl} onChange={e => setFormData({...formData, imageUrl: e.target.value})} style={{ width: '100%', padding: '0.65rem', borderRadius: '4px', border: '1px solid #CBD5E1' }} /></div>
              <div><label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', marginBottom: '0.25rem' }}>Teléfono de WhatsApp</label><input type="tel" required value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} style={{ width: '100%', padding: '0.65rem', borderRadius: '4px', border: '1px solid #CBD5E1' }} placeholder="Ej: 88889999" /></div>
              <div><label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', marginBottom: '0.25rem' }}>Descripción</label><textarea required rows={3} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} style={{ width: '100%', padding: '0.65rem', borderRadius: '4px', border: '1px solid #CBD5E1', resize: 'none' }}></textarea></div>
              <button type="submit" style={{ backgroundColor: '#059669', color: 'white', padding: '0.85rem', borderRadius: '6px', border: 'none', fontWeight: '800', fontSize: '1rem', cursor: 'pointer', marginTop: '0.5rem' }}>Publicar Alerta</button>
            </form>
          </div>
        </div>
      )}

      {/* Auth Modal */}
      {showAuthModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '1rem' }}>
          <div className="stitch-card" style={{ width: '100%', maxWidth: '400px', backgroundColor: 'white', padding: '2rem', borderRadius: '16px', position: 'relative', textAlign: 'center' }}>
            <button onClick={() => setShowAuthModal(false)} style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', color: '#64748B', cursor: 'pointer' }}><X size={24} /></button>
            <div style={{ backgroundColor: '#EEF2FF', width: '64px', height: '64px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem auto' }}>
              <Heart size={32} color="#002B7F" />
            </div>
            <h2 style={{ color: '#0F172A', fontSize: '1.25rem', fontWeight: '800', margin: '0 0 0.5rem 0' }}>Registro Vecinal Requerido</h2>
            <p style={{ color: '#475569', fontSize: '0.95rem', marginBottom: '1.5rem' }}>Para reportar mascotas y evitar spam, necesitas iniciar sesión.</p>
            <button onClick={() => navigate('/login')} style={{ backgroundColor: '#002B7F', color: 'white', padding: '0.85rem', borderRadius: '8px', border: 'none', fontWeight: '700', fontSize: '1rem', cursor: 'pointer', width: '100%' }}>Iniciar Sesión</button>
          </div>
        </div>
      )}
    </div>
  );
}
