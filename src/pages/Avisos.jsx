import { useEffect, useState } from 'react';
import { getNotices, createNotice } from '../services/api';
import { 
  AlertTriangle, 
  Bell, 
  Filter, 
  PlusCircle, 
  MapPin, 
  Calendar, 
  CheckCircle,
  X
} from 'lucide-react';

export const Avisos = () => {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('Todas');
  const [showModal, setShowModal] = useState(false);

  // Formulario nuevo reporte
  const [formData, setFormData] = useState({
    title: '',
    category: 'Servicios Públicos',
    priority: 'Normal',
    sector: 'San Juan Centro',
    description: '',
  });

  const loadNotices = async () => {
    try {
      const data = await getNotices();
      setNotices(data);
    } catch (error) {
      console.error('Error al cargar avisos:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotices();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.description.trim()) return;

    try {
      const newNotice = {
        ...formData,
        date: new Date().toISOString().split('T')[0],
        status: 'Activo'
      };
      await createNotice(newNotice);
      setShowModal(false);
      setFormData({
        title: '',
        category: 'Servicios Públicos',
        priority: 'Normal',
        sector: 'San Juan Centro',
        description: '',
      });
      loadNotices(); // Recargar lista desde el backend
    } catch (error) {
      alert('Error al publicar el aviso. Verifique que JSON Server esté activo.');
    }
  };

  const categories = ['Todas', 'Servicios Públicos', 'Recolección', 'Vialidad', 'Comunitario', 'Mascotas'];

  const filteredNotices = notices.filter(n => {
    if (selectedCategory === 'Todas') return true;
    return n.category === selectedCategory;
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
        marginBottom: '2rem' 
      }}>
        <div>
          <h1 style={{ color: 'var(--primary)', fontSize: '2rem', fontWeight: '800', marginBottom: '0.5rem' }}>
            Avisos y Alertas Comunitarias
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1rem' }}>
            Comunicados de servicios públicos, emergencias cantonales y reportes vecinales en San Juan de Dios.
          </p>
        </div>

        <button 
          onClick={() => setShowModal(true)}
          style={{
            backgroundColor: 'var(--primary)',
            color: '#FFFFFF',
            padding: '0.75rem 1.25rem',
            borderRadius: 'var(--radius-md)',
            fontWeight: '700',
            fontSize: '0.9rem',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
        >
          <PlusCircle size={18} /> Publicar Reporte / Aviso
        </button>
      </div>

      {/* Filtros */}
      <div style={{ 
        display: 'flex', 
        gap: '0.5rem', 
        marginBottom: '2rem', 
        flexWrap: 'wrap',
        alignItems: 'center'
      }}>
        <Filter size={16} color="var(--text-muted)" style={{ marginRight: '0.5rem' }} />
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            style={{
              padding: '0.4rem 0.85rem',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.85rem',
              fontWeight: '600',
              border: '1px solid var(--border)',
              backgroundColor: selectedCategory === cat ? 'var(--primary)' : 'var(--surface)',
              color: selectedCategory === cat ? '#FFFFFF' : 'var(--text-main)',
              cursor: 'pointer'
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Listado de Avisos */}
      {loading ? (
        <p style={{ textAlign: 'center', color: 'var(--text-muted)' }}>Cargando avisos comunitarios...</p>
      ) : (
        <div style={{ display: 'grid', gap: '1.25rem' }}>
          {filteredNotices.length > 0 ? (
            filteredNotices.map((notice) => {
              const isHigh = notice.priority === 'Alta';
              return (
                <div 
                  key={notice.id} 
                  className="stitch-card" 
                  style={{ 
                    padding: '1.5rem',
                    borderLeft: isHigh ? '5px solid var(--secondary)' : '5px solid var(--primary)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.75rem'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span className={isHigh ? 'badge badge-urgent' : 'badge badge-success'}>
                        {isHigh ? 'Prioridad Alta' : notice.category}
                      </span>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <MapPin size={14} /> {notice.sector}
                      </span>
                    </div>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-subtle)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <Calendar size={14} /> {notice.date}
                    </span>
                  </div>

                  <h3 style={{ fontSize: '1.15rem', fontWeight: '700', color: 'var(--text-main)' }}>
                    {notice.title}
                  </h3>

                  <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: '1.5' }}>
                    {notice.description}
                  </p>
                </div>
              );
            })
          ) : (
            <p style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem' }}>
              No hay avisos registrados bajo esta categoría.
            </p>
          )}
        </div>
      )}

      {/* Modal para crear aviso */}
      {showModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0,0,0,0.6)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100,
          padding: '1rem'
        }}>
          <div className="stitch-card" style={{ 
            width: '100%', 
            maxWidth: '520px', 
            padding: '2rem',
            position: 'relative'
          }}>
            <button 
              onClick={() => setShowModal(false)}
              style={{ position: 'absolute', top: '1.25rem', right: '1.25rem', background: 'none', border: 'none', color: 'var(--text-muted)' }}
            >
              <X size={20} />
            </button>

            <h2 style={{ fontSize: '1.3rem', fontWeight: '800', color: 'var(--primary)', marginBottom: '0.5rem' }}>
              Nuevo Aviso o Reporte
            </h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
              Publique averías comunales (agua, luz, calles) o avisos de utilidad para los vecinos de San Juan de Dios.
            </p>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.3rem' }}>
                  Título del aviso / avería
                </label>
                <input 
                  type="text" 
                  required
                  placeholder="Ej: Fuga de agua en tubería madre"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.65rem 0.85rem',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--border-strong)',
                    backgroundColor: 'var(--bg)',
                    color: 'var(--text-main)',
                    fontFamily: 'inherit'
                  }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.3rem' }}>
                    Categoría
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '0.65rem',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid var(--border-strong)',
                      backgroundColor: 'var(--bg)',
                      color: 'var(--text-main)',
                      fontFamily: 'inherit'
                    }}
                  >
                    <option value="Servicios Públicos">Servicios Públicos</option>
                    <option value="Recolección">Recolección</option>
                    <option value="Vialidad">Vialidad</option>
                    <option value="Comunitario">Comunitario</option>
                    <option value="Mascotas">Mascotas</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.3rem' }}>
                    Prioridad
                  </label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '0.65rem',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid var(--border-strong)',
                      backgroundColor: 'var(--bg)',
                      color: 'var(--text-main)',
                      fontFamily: 'inherit'
                    }}
                  >
                    <option value="Normal">Normal</option>
                    <option value="Alta">Alta (Urgente)</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.3rem' }}>
                  Sector o cuadrante
                </label>
                <input 
                  type="text" 
                  required
                  placeholder="Ej: Calle Fallas, frente a la pulpería"
                  value={formData.sector}
                  onChange={(e) => setFormData({ ...formData, sector: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.65rem 0.85rem',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--border-strong)',
                    backgroundColor: 'var(--bg)',
                    color: 'var(--text-main)',
                    fontFamily: 'inherit'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.3rem' }}>
                  Detalles y descripción
                </label>
                <textarea 
                  rows={3}
                  required
                  placeholder="Describa el problema, fecha estimada o instrucciones para vecinos..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.65rem 0.85rem',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--border-strong)',
                    backgroundColor: 'var(--bg)',
                    color: 'var(--text-main)',
                    fontFamily: 'inherit',
                    resize: 'none'
                  }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
                <button 
                  type="button" 
                  onClick={() => setShowModal(false)}
                  style={{
                    padding: '0.65rem 1rem',
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: 'var(--surface-subtle)',
                    color: 'var(--text-main)',
                    fontWeight: '600'
                  }}
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  style={{
                    padding: '0.65rem 1.25rem',
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: 'var(--primary)',
                    color: '#FFFFFF',
                    fontWeight: '700'
                  }}
                >
                  Publicar Aviso
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};