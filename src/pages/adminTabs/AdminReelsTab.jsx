import React, { useState, useEffect } from 'react';
import { deleteReel, updateReelStatus, getCommunityReels } from '../../services/api';
import { PlaySquare, Trash2, Heart, CheckCircle, Clock } from 'lucide-react';

export default function AdminReelsTab() {
  const [reels, setReels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('pending'); // 'pending' | 'published'

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await getCommunityReels();
      setReels(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('¿Eliminar reel definitivamente?')) return;
    try {
      await deleteReel(id);
      loadData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleApprove = async (id) => {
    try {
      await updateReelStatus(id, 'approved');
      loadData();
    } catch (err) {
      console.error(err);
    }
  };

  const pendingReels = reels.filter(r => r.status === 'pending');
  // Legacy reels without status or 'approved' go here
  const publishedReels = reels.filter(r => r.status === 'approved' || !r.status);

  const displayReels = tab === 'pending' ? pendingReels : publishedReels;

  return (
    <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
      <h2 style={{ color: '#002B7F', margin: '0 0 1.5rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <PlaySquare size={24} /> Moderación de Reels
      </h2>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', borderBottom: '1px solid #E2E8F0' }}>
        <button 
          onClick={() => setTab('pending')}
          style={{ 
            background: 'none', border: 'none', padding: '0.5rem 1rem', cursor: 'pointer',
            fontWeight: 'bold', fontSize: '1rem', color: tab === 'pending' ? '#002B7F' : '#64748B',
            borderBottom: tab === 'pending' ? '3px solid #002B7F' : '3px solid transparent'
          }}
        >
          Pendientes de Aprobación ({pendingReels.length})
        </button>
        <button 
          onClick={() => setTab('published')}
          style={{ 
            background: 'none', border: 'none', padding: '0.5rem 1rem', cursor: 'pointer',
            fontWeight: 'bold', fontSize: '1rem', color: tab === 'published' ? '#002B7F' : '#64748B',
            borderBottom: tab === 'published' ? '3px solid #002B7F' : '3px solid transparent'
          }}
        >
          Publicados ({publishedReels.length})
        </button>
      </div>

      {loading ? (
        <p>Cargando reels...</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1.5rem' }}>
          {displayReels.map(reel => (
            <div key={reel.id} style={{ border: '1px solid #CBD5E1', borderRadius: '8px', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
              <div style={{ position: 'relative', width: '100%', paddingTop: '150%', backgroundColor: '#000' }}>
                <video 
                  src={reel.videoUrl} 
                  muted 
                  playsInline
                  loop
                  onMouseOver={e => e.target.play()}
                  onMouseOut={e => e.target.pause()}
                  style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }}
                />
                {tab === 'published' && (
                  <div style={{ position: 'absolute', top: '10px', right: '10px', backgroundColor: 'rgba(0,0,0,0.7)', color: 'white', padding: '0.3rem 0.6rem', borderRadius: '99px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <Heart size={14} color="#EF4444" fill="#EF4444" /> {reel.likes}
                  </div>
                )}
                {tab === 'pending' && (
                  <div style={{ position: 'absolute', top: '10px', right: '10px', backgroundColor: '#F59E0B', color: 'white', padding: '0.3rem 0.6rem', borderRadius: '99px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.3rem', fontWeight: 'bold' }}>
                    <Clock size={14} /> Pendiente
                  </div>
                )}
              </div>
              <div style={{ padding: '1rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <h3 style={{ margin: '0 0 0.25rem 0', fontSize: '1rem', color: '#0F172A' }}>{reel.title}</h3>
                <div style={{ fontSize: '0.8rem', color: '#059669', fontWeight: 'bold', marginBottom: '0.25rem' }}>{reel.sector}</div>
                <div style={{ fontSize: '0.85rem', color: '#64748B', marginBottom: '1rem' }}>
                  Por: {reel.author}
                </div>
                
                <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {tab === 'pending' && (
                    <button 
                      onClick={() => handleApprove(reel.id)}
                      style={{ backgroundColor: '#ECFDF5', color: '#059669', border: '1px solid #A7F3D0', padding: '0.6rem', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', fontWeight: 'bold' }}
                    >
                      <CheckCircle size={16} /> Aprobar Reel
                    </button>
                  )}
                  <button 
                    onClick={() => handleDelete(reel.id)}
                    style={{ backgroundColor: '#FEF2F2', color: '#DC2626', border: '1px solid #FECACA', padding: '0.6rem', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', fontWeight: 'bold' }}
                  >
                    <Trash2 size={16} /> {tab === 'pending' ? 'Rechazar' : 'Eliminar'}
                  </button>
                </div>
              </div>
            </div>
          ))}
          {displayReels.length === 0 && (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '2rem', color: '#64748B' }}>
              No hay reels en esta lista.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
