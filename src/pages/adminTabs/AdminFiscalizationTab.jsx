import React, { useState, useEffect } from 'react';
import { getFormalDenunciations, updateDenunciationStatus } from '../../services/api';
import { ShieldCheck, Save } from 'lucide-react';

export default function AdminFiscalizationTab() {
  const [denunciations, setDenunciations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editStatus, setEditStatus] = useState('');
  const [editNote, setEditNote] = useState('');

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await getFormalDenunciations();
      setDenunciations(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleStartEdit = (d) => {
    setEditingId(d.id);
    setEditStatus(d.status || 'Recibida en Plataforma');
    setEditNote(d.resolutionNote || '');
  };

  const handleSave = async (id) => {
    try {
      await updateDenunciationStatus(id, editStatus, editNote);
      setEditingId(null);
      loadData();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
      <h2 style={{ color: '#002B7F', margin: '0 0 1.5rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <ShieldCheck size={24} /> Fiscalización y Denuncias
      </h2>

      {loading ? (
        <p>Cargando expedientes...</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {denunciations.map(d => (
            <div key={d.id} style={{ border: '1px solid #CBD5E1', borderRadius: '8px', padding: '1.5rem', backgroundColor: '#F8FAFC' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                  <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.2rem', color: '#0F172A' }}>
                    {d.folio || `DEN-2026-${d.id}`} - {d.title || d.subject}
                  </h3>
                  <div style={{ fontSize: '0.85rem', color: '#64748B', marginBottom: '1rem' }}>
                    <strong>Denunciante:</strong> {d.author || 'Anónimo'} | <strong>Fecha:</strong> {d.date}
                  </div>
                  <p style={{ margin: 0, color: '#334155', fontSize: '0.9rem' }}>{d.description}</p>
                </div>
                
                <div style={{ minWidth: '300px' }}>
                  {editingId === d.id ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                      <select 
                        value={editStatus} 
                        onChange={e => setEditStatus(e.target.value)}
                        style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #CBD5E1', width: '100%' }}
                      >
                        <option value="Recibida en Plataforma">Recibida en Plataforma</option>
                        <option value="Inspección Programada">Inspección Programada</option>
                        <option value="Elevada a Municipalidad">Elevada a Municipalidad</option>
                        <option value="Resuelta">Resuelta</option>
                      </select>
                      <textarea
                        value={editNote}
                        onChange={e => setEditNote(e.target.value)}
                        placeholder="Nota de resolución ADI..."
                        rows={3}
                        style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #CBD5E1', width: '100%', resize: 'vertical' }}
                      />
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button onClick={() => handleSave(d.id)} style={{ flex: 1, backgroundColor: '#002B7F', color: 'white', border: 'none', padding: '0.5rem', borderRadius: '4px', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.4rem' }}>
                          <Save size={16} /> Guardar
                        </button>
                        <button onClick={() => setEditingId(null)} style={{ flex: 1, backgroundColor: '#E2E8F0', color: '#334155', border: 'none', padding: '0.5rem', borderRadius: '4px', cursor: 'pointer' }}>
                          Cancelar
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.5rem' }}>
                      <span style={{ 
                        padding: '0.4rem 0.75rem', 
                        borderRadius: '4px', 
                        backgroundColor: d.status === 'Resuelta' ? '#ECFDF5' : '#EFF6FF',
                        color: d.status === 'Resuelta' ? '#059669' : '#1D4ED8',
                        fontWeight: 'bold',
                        fontSize: '0.9rem'
                      }}>
                        {d.status || 'Recibida en Plataforma'}
                      </span>
                      {d.resolutionNote && (
                        <div style={{ backgroundColor: 'white', padding: '0.75rem', borderRadius: '4px', border: '1px dashed #CBD5E1', fontSize: '0.85rem', width: '100%', fontStyle: 'italic' }}>
                          <strong>Nota ADI:</strong> {d.resolutionNote}
                        </div>
                      )}
                      <button onClick={() => handleStartEdit(d)} style={{ marginTop: '0.5rem', background: 'none', border: '1px solid #CBD5E1', padding: '0.4rem 1rem', borderRadius: '4px', cursor: 'pointer', color: '#334155', fontSize: '0.85rem', fontWeight: 'bold', backgroundColor: 'white' }}>
                        Editar Estado / Resolución
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
          {denunciations.length === 0 && (
            <div style={{ textAlign: 'center', padding: '2rem', color: '#64748B' }}>No hay denuncias registradas.</div>
          )}
        </div>
      )}
    </div>
  );
}
