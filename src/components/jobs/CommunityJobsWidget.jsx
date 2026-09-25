import { useState, useEffect } from 'react';
import { getCommunityJobs } from '../../services/api';
import { JobCard } from './JobCard';
import { JobModalForm } from './JobModalForm';
import { Briefcase, PlusCircle, Search, Filter } from 'lucide-react';

export const CommunityJobsWidget = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState('Todos');
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);

  const loadJobs = async () => {
    setLoading(true);
    try {
      const data = await getCommunityJobs();
      setJobs(data || []);
    } catch (err) {
      console.error('Error al cargar bolsa de empleo:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadJobs();
  }, []);

  const filteredJobs = jobs.filter(j => {
    const matchType = filterType === 'Todos' || j.type === filterType;
    const matchSearch = j.title.toLowerCase().includes(search.toLowerCase()) ||
                        j.businessName.toLowerCase().includes(search.toLowerCase()) ||
                        j.description.toLowerCase().includes(search.toLowerCase()) ||
                        j.sector.toLowerCase().includes(search.toLowerCase());
    return matchType && matchSearch;
  });

  return (
    <section style={{ marginTop: '2.5rem', paddingTop: '2rem', borderTop: '2px solid #E2E8F0' }}>
      
      {/* Encabezado del Módulo */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: '#002B7F', fontWeight: '800', fontSize: '0.82rem', textTransform: 'uppercase' }}>
            <Briefcase size={16} /> Empleabilidad & Emprendimiento Local
          </div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '900', color: '#0F172A', margin: '0.2rem 0 0.2rem 0' }}>
            Bolsa de Empleo & Oficios Comunitarios
          </h2>
          <p style={{ margin: 0, fontSize: '0.88rem', color: '#64748B' }}>
            Conecte con vacantes de comercios del distrito u oficios independientes ofrecidos por vecinos de San Juan de Dios.
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            backgroundColor: '#059669',
            color: 'white',
            border: 'none',
            padding: '0.6rem 1.15rem',
            borderRadius: '4px',
            fontWeight: '700',
            fontSize: '0.85rem',
            cursor: 'pointer'
          }}
        >
          <PlusCircle size={16} /> Publicar Vacante u Oficio
        </button>
      </div>

      {/* Barra de Filtros */}
      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '1.5rem', alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: '240px' }}>
          <Search size={15} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: '#64748B' }} />
          <input
            type="text"
            placeholder="Buscar por puesto, oficio, negocio o sector..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              width: '100%',
              padding: '0.55rem 0.85rem 0.55rem 2.3rem',
              fontSize: '0.86rem',
              borderRadius: '4px',
              border: '1px solid #CBD5E1',
              backgroundColor: '#FFFFFF'
            }}
          />
        </div>

        <div style={{ display: 'flex', gap: '0.35rem' }}>
          {['Todos', 'Empleo Comercial', 'Oficio Vecinal'].map(t => (
            <button
              key={t}
              onClick={() => setFilterType(t)}
              style={{
                padding: '0.5rem 0.85rem',
                fontSize: '0.8rem',
                fontWeight: '700',
                borderRadius: '4px',
                border: filterType === t ? '1px solid #002B7F' : '1px solid #CBD5E1',
                backgroundColor: filterType === t ? '#E0E7FF' : '#FFFFFF',
                color: filterType === t ? '#002B7F' : '#64748B',
                cursor: 'pointer'
              }}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Rejilla de Tarjetas */}
      {loading ? (
        <div style={{ padding: '2rem', textAlign: 'center', color: '#64748B' }}>Cargando anuncios comunitarios...</div>
      ) : filteredJobs.length === 0 ? (
        <div className="stitch-card" style={{ padding: '2rem', textAlign: 'center', color: '#64748B' }}>
          No hay vacantes u oficios publicados bajo este criterio de búsqueda.
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(310px, 1fr))',
          gap: '1.25rem'
        }}>
          {filteredJobs.map(job => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      )}

      {/* Modal Modular de Publicación */}
      <JobModalForm
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onJobCreated={loadJobs}
      />

    </section>
  );
};