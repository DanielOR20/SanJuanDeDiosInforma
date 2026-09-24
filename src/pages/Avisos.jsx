import { useEffect, useState } from 'react';
import { getNotices, createNotice } from '../services/api';
import { ComunidadMap } from '../components/ComunidadMap';
import {
  AlertTriangle,
  Bell,
  Filter,
  PlusCircle,
  MapPin,
  Calendar,
  ThumbsUp,
  X,
  Map,
  List
} from 'lucide-react';

const SECTORES_SAN_JUAN = [
  { name: 'San Juan Centro (Parque / Iglesia)', lat: 9.8940, lng: -84.0740 },
  { name: 'Calle Fallas (Entrada / Pulpería)', lat: 9.8915, lng: -84.0718 },
  { name: 'Sector Plaza de Deportes / Salón Comunal', lat: 9.8930, lng: -84.0742 },
  { name: 'Cruce hacia Poás de Aserrí', lat: 9.8890, lng: -84.0710 },
  { name: 'Sector EBAIS / San Juan Norte', lat: 9.8952, lng: -84.0754 }
];

export const Avisos = () => {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('Todas');
  const [showModal, setShowModal] = useState(false);
  const [viewMode, setViewMode] = useState('split'); // 'split', 'list', 'map'
  
  // Carga inicial persistente de los avisos votados
  const [votedIds, setVotedIds] = useState(() => {
    try {
      const saved = localStorage.getItem('voted_notices');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [formData, setFormData] = useState({
    title: '',
    category: 'Servicios Públicos',
    priority: 'Normal',
    sectorIndex: 0,
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

  const handleVote = async (notice) => {
    if (votedIds.includes(notice.id)) return;

    const currentCount = Number(notice.votes) || 0;
    const newCount = currentCount + 1;

    // 1. Guardar voto en memoria del navegador
    const updatedVoted = [...votedIds, notice.id];
    setVotedIds(updatedVoted);
    localStorage.setItem('voted_notices', JSON.stringify(updatedVoted));

    // 2. Reflejo visual inmediato
    setNotices((prev) =>
      prev.map((n) => (n.id === notice.id ? { ...n, votes: newCount } : n))
    );

    // 3. Sincronización silenciosa con JSON Server
    try {
      await fetch(`http://localhost:5000/notices/${notice.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ votes: newCount })
      });
    } catch (e) {
      console.warn('Voto guardado localmente (servidor no disponible):', e);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.description.trim()) return;

    const sectorObj = SECTORES_SAN_JUAN[formData.sectorIndex];

    try {
      const newNotice = {
        title: formData.title,
        category: formData.category,
        priority: formData.priority,
        sector: sectorObj.name,
        lat: sectorObj.lat,
        lng: sectorObj.lng,
        description: formData.description,
        date: new Date().toISOString().split('T')[0],
        status: 'Reportado por Vecino',
        votes: 1
      };
      await createNotice(newNotice);
      setShowModal(false);
      setFormData({
        title: '',
        category: 'Servicios Públicos',
        priority: 'Normal',
        sectorIndex: 0,
        description: '',
      });
      loadNotices();
    } catch (error) {
      alert('Error al publicar el aviso.');
    }
  };

  const categories = ['Todas', 'Servicios Públicos', 'Recolección', 'Vialidad', 'Comunitario', 'Mascotas'];

  const filteredNotices = notices.filter((n) => {
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
        marginBottom: '1.5rem'
      }}>
        <div>
          <h1 style={{ color: 'var(--primary)', fontSize: '2rem', fontWeight: '800', marginBottom: '0.4rem' }}>
            Avisos y Alertas Comunitarias
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            Monitoreo en tiempo real de averías (AyA, CNFL), cierres viales y alertas vecinales en San Juan de Dios.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          style={{
            backgroundColor: 'var(--secondary)',
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
          <PlusCircle size={18} /> Reportar Avería o Incidencia
        </button>
      </div>

      {/* Barra de Filtros y Vistas */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1rem',
        backgroundColor: 'var(--surface)',
        padding: '0.85rem 1.25rem',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--border)',
        marginBottom: '1.5rem'
      }}>
        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <Filter size={16} color="var(--text-muted)" style={{ marginRight: '0.25rem' }} />
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              style={{
                padding: '0.35rem 0.75rem',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.8rem',
                fontWeight: '600',
                border: '1px solid var(--border)',
                backgroundColor: selectedCategory === cat ? 'var(--primary)' : 'var(--surface-subtle)',
                color: selectedCategory === cat ? '#FFFFFF' : 'var(--text-main)',
                cursor: 'pointer'
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', gap: '0.35rem', backgroundColor: 'var(--surface-subtle)', padding: '0.25rem', borderRadius: 'var(--radius-sm)' }}>
          <button
            onClick={() => setViewMode('split')}
            style={{
              padding: '0.35rem 0.7rem',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.8rem',
              fontWeight: '600',
              backgroundColor: viewMode === 'split' ? 'var(--primary)' : 'transparent',
              color: viewMode === 'split' ? '#fff' : 'var(--text-muted)'
            }}
          >
            Dividida
          </button>
          <button
            onClick={() => setViewMode('list')}
            style={{
              padding: '0.35rem 0.7rem',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.8rem',
              fontWeight: '600',
              backgroundColor: viewMode === 'list' ? 'var(--primary)' : 'transparent',
              color: viewMode === 'list' ? '#fff' : 'var(--text-muted)'
            }}
          >
            <List size={15} style={{ verticalAlign: 'middle' }} />
          </button>
          <button
            onClick={() => setViewMode('map')}
            style={{
              padding: '0.35rem 0.7rem',
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

      {/* Contenido Principal */}
      {loading ? (
        <p style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '3rem' }}>Cargando incidencias comunales...</p>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: viewMode === 'split' ? '1.1fr 0.9fr' : '1fr',
          gap: '1.5rem',
          alignItems: 'start'
        }}>
          {/* Lista de Alertas */}
          {viewMode !== 'map' && (
            <div style={{
              display: 'grid',
              gap: '1rem',
              maxHeight: viewMode === 'split' ? '700px' : 'none',
              overflowY: viewMode === 'split' ? 'auto' : 'visible',
              paddingRight: viewMode === 'split' ? '0.5rem' : '0'
            }}>
              {filteredNotices.length > 0 ? (
                filteredNotices.map((notice) => {
                  const isHigh = notice.priority === 'Alta';
                  const hasVoted = votedIds.includes(notice.id);
                  return (
                    <div
                      key={notice.id}
                      className="stitch-card"
                      style={{
                        padding: '1.25rem',
                        borderLeft: isHigh ? '5px solid var(--secondary)' : '5px solid var(--primary)'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem', marginBottom: '0.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
                          <span className={isHigh ? 'badge badge-urgent' : 'badge badge-success'}>
                            {isHigh ? 'Crítica' : notice.category}
                          </span>
                          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                            <MapPin size={13} /> {notice.sector}
                          </span>
                        </div>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>
                          {notice.date}
                        </span>
                      </div>

                      <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '0.4rem' }}>
                        {notice.title}
                      </h3>

                      <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.45', marginBottom: '1rem' }}>
                        {notice.description}
                      </p>

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border)', paddingTop: '0.75rem' }}>
                        <span style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--primary)' }}>
                          Estado: {notice.status || 'Activo'}
                        </span>

                        <button
                          onClick={() => handleVote(notice)}
                          disabled={hasVoted}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.4rem',
                            padding: '0.4rem 0.8rem',
                            borderRadius: 'var(--radius-sm)',
                            fontSize: '0.8rem',
                            fontWeight: '700',
                            backgroundColor: hasVoted ? 'var(--tertiary-light)' : 'var(--surface-subtle)',
                            color: hasVoted ? 'var(--tertiary)' : 'var(--text-main)',
                            border: '1px solid var(--border)',
                            cursor: hasVoted ? 'default' : 'pointer'
                          }}
                        >
                          <ThumbsUp size={14} />
                          {hasVoted ? 'Confirmado' : 'A mí también me afecta'} ({notice.votes || 0})
                        </button>
                      </div>
                    </div>
                  );
                })
              ) : (
                <p style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem' }}>
                  No hay reportes bajo esta categoría.
                </p>
              )}
            </div>
          )}

          {/* Mapa de Incidentes */}
          {viewMode !== 'list' && (
            <div style={{ position: viewMode === 'split' ? 'sticky' : 'static', top: '90px' }}>
              <ComunidadMap
                notices={filteredNotices}
                height={viewMode === 'split' ? '680px' : '550px'}
              />
            </div>
          )}
        </div>
      )}

      {/* Modal de Reporte Ciudadano */}
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
          <div className="stitch-card" style={{ width: '100%', maxWidth: '520px', padding: '2rem', position: 'relative' }}>
            <button
              onClick={() => setShowModal(false)}
              style={{ position: 'absolute', top: '1.25rem', right: '1.25rem', background: 'none', border: 'none', color: 'var(--text-muted)' }}
            >
              <X size={20} />
            </button>

            <h2 style={{ fontSize: '1.3rem', fontWeight: '800', color: 'var(--secondary)', marginBottom: '0.3rem' }}>
              Reportar Incidencia o Avería
            </h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
              Notifique a los vecinos y a la ADI para coordinar con cuadrillas de AyA, CNFL o la Municipalidad.
            </p>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', marginBottom: '0.25rem' }}>Tipo o Título del Problema</label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Fuga de agua potable en acera principal"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
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
                    <option value="Servicios Públicos">Servicios Públicos (AyA/CNFL)</option>
                    <option value="Vialidad">Vialidad (Calles/Huecos)</option>
                    <option value="Recolección">Recolección de Aseo</option>
                    <option value="Comunitario">Comunitario</option>
                    <option value="Mascotas">Mascotas Perdidas</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', marginBottom: '0.25rem' }}>Severidad</label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                    style={{ width: '100%', padding: '0.6rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-strong)', backgroundColor: 'var(--bg)', color: 'var(--text-main)', fontFamily: 'inherit' }}
                  >
                    <option value="Normal">Normal</option>
                    <option value="Alta">Alta (Urgente)</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', marginBottom: '0.25rem' }}>Ubicación Geográfica en San Juan</label>
                <select
                  value={formData.sectorIndex}
                  onChange={(e) => setFormData({ ...formData, sectorIndex: parseInt(e.target.value) })}
                  style={{ width: '100%', padding: '0.6rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-strong)', backgroundColor: 'var(--bg)', color: 'var(--text-main)', fontFamily: 'inherit' }}
                >
                  {SECTORES_SAN_JUAN.map((sec, idx) => (
                    <option key={idx} value={idx}>{sec.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', marginBottom: '0.25rem' }}>Descripción Detallada</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Detalles sobre cuadrillas en el lugar, horas sin servicio, rutas alternas..."
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
                  style={{ padding: '0.6rem 1.25rem', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--secondary)', color: '#FFFFFF', fontWeight: '700' }}
                >
                  Publicar Reporte
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};