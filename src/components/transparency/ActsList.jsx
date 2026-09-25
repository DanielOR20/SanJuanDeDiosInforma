import { useState } from 'react';
import { FileText, Download, CheckCircle, Search } from 'lucide-react';

export const ActsList = ({ acts }) => {
  const [query, setQuery] = useState('');

  const filtered = acts.filter(a => 
    a.actNumber.toLowerCase().includes(query.toLowerCase()) ||
    a.summary.toLowerCase().includes(query.toLowerCase())
  );

  const handleSimulateDownload = (actNumber) => {
    alert(`Descargando documento oficial: ${actNumber}.pdf (Firma Digital Verificada)`);
  };

  return (
    <div>
      <div style={{ marginBottom: '1rem', maxWidth: '380px' }}>
        <input
          type="text"
          placeholder="Buscar acta por número o tema..."
          value={query}
          onChange={e => setQuery(e.target.value)}
          style={{
            width: '100%',
            padding: '0.55rem 0.85rem',
            fontSize: '0.85rem',
            borderRadius: '4px',
            border: '1px solid var(--border)',
            backgroundColor: 'var(--surface-subtle)',
            color: 'var(--text-main)'
          }}
        />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {filtered.map(act => (
          <div
            key={act.id}
            className="stitch-card"
            style={{
              padding: '1rem 1.25rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '0.75rem',
              borderLeft: '4px solid #002B7F'
            }}
          >
            <div style={{ flex: 1, minWidth: '240px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '0.2rem' }}>
                <FileText size={16} color="#002B7F" />
                <strong style={{ fontSize: '0.95rem', color: 'var(--text-main)' }}>{act.actNumber}</strong>
                <span style={{ fontSize: '0.7rem', fontWeight: '800', backgroundColor: '#DCFCE7', color: '#166534', padding: '0.15rem 0.45rem', borderRadius: '4px' }}>
                  {act.status}
                </span>
              </div>
              <div style={{ fontSize: '0.78rem', color: '#64748B', marginBottom: '0.35rem' }}>
                {act.type} • Fecha: {act.date} • Tamaño: {act.fileSize}
              </div>
              <p style={{ margin: 0, fontSize: '0.84rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
                {act.summary}
              </p>
            </div>

            <button
              onClick={() => handleSimulateDownload(act.actNumber)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                padding: '0.5rem 0.85rem',
                fontSize: '0.8rem',
                fontWeight: '700',
                borderRadius: '4px',
                border: '1px solid #002B7F',
                backgroundColor: 'transparent',
                color: '#002B7F',
                cursor: 'pointer'
              }}
            >
              <Download size={14} /> Descargar Acta
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};