import { useState, useEffect } from 'react';
import { getMinorWorkRules } from '../../services/api';
import { Hammer, Check, Info } from 'lucide-react';

export const MinorWorkGuide = () => {
  const [works, setWorks] = useState([]);

  useEffect(() => {
    getMinorWorkRules().then(data => setWorks(data || [])).catch(() => {});
  }, []);

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
      {works.map(w => (
        <div
          key={w.id}
          className="stitch-card"
          style={{
            padding: '1.25rem',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            borderTop: '4px solid #002B7F',
            boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)',
            backgroundColor: '#FFFFFF'
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.35rem' }}>
              <Hammer size={16} color="#002B7F" />
              <strong style={{ fontSize: '0.95rem', color: 'var(--text-main)' }}>{w.workType}</strong>
            </div>

            <span style={{ fontSize: '0.74rem', fontWeight: '800', color: '#059669', display: 'block', marginBottom: '0.5rem' }}>
              {w.permitType} • Alcance: {w.limit}
            </span>

            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.4, margin: '0 0 0.75rem 0' }}>
              {w.specs}
            </p>
          </div>

          <div style={{ paddingTop: '0.75rem', borderTop: '1px solid var(--border)', fontSize: '0.76rem', color: 'var(--text-main)' }}>
            <strong style={{ color: '#002B7F', display: 'flex', alignItems: 'center', gap: '0.3rem', marginBottom: '0.35rem' }}>
              <Info size={14} /> Documentos mínimos requeridos:
            </strong>
            <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
              {w.docs.map((doc, idx) => (
                <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.35rem', color: 'var(--text-muted)' }}>
                  <Check size={14} color="#059669" style={{ flexShrink: 0, marginTop: '0.1rem' }} />
                  <span>{doc}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      ))}
    </div>
  );
};