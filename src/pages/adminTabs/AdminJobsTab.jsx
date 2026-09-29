import React, { useState, useEffect } from 'react';
import { getJobs, updateJobStatus, deleteJob } from '../../services/api';
import { Users, CheckCircle, Trash2 } from 'lucide-react';

export default function AdminJobsTab() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await getJobs();
      setJobs(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleUpdate = async (id, status) => {
    try {
      await updateJobStatus(id, status);
      loadData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Eliminar puesto de empleo definitivamente?')) return;
    try {
      await deleteJob(id);
      loadData();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
      <h2 style={{ color: '#002B7F', margin: '0 0 1.5rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <Users size={24} /> Bolsa de Empleo
      </h2>

      {loading ? (
        <p>Cargando ofertas de empleo...</p>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #CBD5E1', backgroundColor: '#F8FAFC' }}>
                <th style={{ padding: '1rem' }}>Puesto / Empresa</th>
                <th style={{ padding: '1rem' }}>Ubicación</th>
                <th style={{ padding: '1rem' }}>Estado</th>
                <th style={{ padding: '1rem', textAlign: 'right' }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {jobs.map(job => (
                <tr key={job.id} style={{ borderBottom: '1px solid #E2E8F0', opacity: job.status === 'closed' ? 0.6 : 1 }}>
                  <td style={{ padding: '1rem' }}>
                    <div style={{ fontWeight: 'bold' }}>{job.title}</div>
                    <div style={{ fontSize: '0.85rem', color: '#64748B' }}>{job.company}</div>
                  </td>
                  <td style={{ padding: '1rem', fontSize: '0.9rem' }}>{job.location}</td>
                  <td style={{ padding: '1rem' }}>
                    <span style={{
                      padding: '0.25rem 0.5rem',
                      borderRadius: '4px',
                      fontSize: '0.8rem',
                      fontWeight: 'bold',
                      backgroundColor: job.status === 'closed' ? '#E2E8F0' : '#ECFDF5',
                      color: job.status === 'closed' ? '#64748B' : '#059669'
                    }}>
                      {job.status === 'closed' ? 'Cubierto/Cerrado' : 'Activo'}
                    </span>
                  </td>
                  <td style={{ padding: '1rem', textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                      {job.status !== 'closed' && (
                        <button onClick={() => handleUpdate(job.id, 'closed')} title="Marcar como Cubierto" style={{ background: 'none', border: 'none', color: '#059669', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.2rem', fontWeight: 'bold', fontSize: '0.8rem' }}>
                          <CheckCircle size={18} /> Cerrar
                        </button>
                      )}
                      <button onClick={() => handleDelete(job.id)} title="Eliminar" style={{ background: 'none', border: 'none', color: '#DC2626', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.2rem', fontWeight: 'bold', fontSize: '0.8rem', marginLeft: '1rem' }}>
                        <Trash2 size={18} /> Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {jobs.length === 0 && (
                <tr>
                  <td colSpan="4" style={{ padding: '2rem', textAlign: 'center', color: '#64748B' }}>
                    No hay ofertas de empleo registradas.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
