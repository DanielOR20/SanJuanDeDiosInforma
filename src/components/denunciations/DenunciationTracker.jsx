import { useState } from 'react';
import { Search, CheckCircle2, Clock, AlertTriangle, FileText } from 'lucide-react';
import { getFormalDenunciations } from '../../services/api';

export const DenunciationTracker = () => {
  const [folioInput, setFolioInput] = useState('');
  const [result, setResult] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleTrack = async (e) => {
    e.preventDefault();
    const query = folioInput.trim().toUpperCase();
    if (!query) return;

    setLoading(true);
    setNotFound(false);
    setResult(null);

    try {
      const list = await getFormalDenunciations();
      const match = list.find(d => d.folio.toUpperCase() === query);
      if (match) {
        setResult(match);
      } else {
        setNotFound(true);
      }
    } catch {
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Elevada a Municipalidad':
        return { bg: '#E0E7FF', text: '#002B7F', icon: <Clock size={14} /> };
      case 'Inspección Programada':
        return { bg: '#FEF3C7', text: '#92400E', icon: <AlertTriangle size={14} /> };
      case 'Resuelta':
        return { bg: '#DCFCE7', text: '#166534', icon: <CheckCircle2 size={14} /> };
      default:
        return { bg: '#F1F5F9', text: '#475569', icon: <FileText size={14} /> };
    }
  };

  return (
    <div style={{ backgroundColor: 'var(--surface)', padding: '1.25rem', borderRadius: '6px', border: '1px solid var(--border)', marginBottom: '1.5rem' }}>
      <strong style={{ fontSize: '0.98rem', color: '#002B7F', display: 'block', marginBottom: '0.25rem' }}>
        Rastreo y Consulta de Expediente Comunal
      </strong>
      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.85rem' }}>
        Verifique el avance de inspección de su reporte introduciendo su número de folio (ejemplo: DEN-2026-1042).
      </span>

      <form onSubmit={handleTrack} style={{ display: 'flex', gap: '0.5rem', maxWidth: '480px' }}>
        <input
          type="text"
          placeholder="Código de Folio (DEN-2026-...)"
          value={folioInput}
          onChange={e => setFolioInput(e.target.value)}
          style={{
            flex: 1,
            padding: '0.6rem 0.85rem',
            fontSize: '0.85rem',
            borderRadius: '6px',
            border: '1px solid var(--border)',
            backgroundColor: 'var(--surface-subtle)',
            color: 'var(--text-main)'
          }}
        />
        <button
          type="submit"
          disabled={loading}
          style={{
            backgroundColor: '#002B7F',
            color: '#FFFFFF',
            border: 'none',
            padding: '0.6rem 1.15rem',
            borderRadius: '6px',
            fontSize: '0.82rem',
            fontWeight: '700',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.35rem'
          }}
        >
          <Search size={15} /> Consultar
        </button>
      </form>

      {notFound && (
        <div style={{ marginTop: '0.85rem', padding: '0.65rem', backgroundColor: '#FEE2E2', color: '#991B1B', borderRadius: '4px', fontSize: '0.82rem', fontWeight: '700' }}>
          No se encontró ningún expediente registrado con el folio "{folioInput}".
        </div>
      )}

      {result && (
        <div style={{ marginTop: '1rem', padding: '1rem', borderRadius: '6px', border: '1px solid var(--border)', backgroundColor: 'var(--surface-subtle)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.4rem' }}>
            <div>
              <span style={{ fontSize: '0.72rem', fontWeight: '800', color: '#002B7F' }}>EXPEDIENTE: {result.folio}</span>
              <h4 style={{ margin: '0.15rem 0 0 0', fontSize: '0.98rem', color: 'var(--text-main)' }}>{result.category}</h4>
            </div>
            {(() => {
              const badge = getStatusBadge(result.status);
              return (
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.72rem', fontWeight: '800', backgroundColor: badge.bg, color: badge.text, padding: '0.2rem 0.55rem', borderRadius: '4px' }}>
                  {badge.icon} {result.status}
                </span>
              );
            })()}
          </div>

          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
            Sector: <strong>{result.sector}</strong> ({result.locationExact}) • Registrado: {result.date}
          </div>

          <p style={{ margin: '0 0 0.6rem 0', fontSize: '0.84rem', color: 'var(--text-main)', lineHeight: 1.45 }}>
            "{result.description}"
          </p>

          <div style={{ fontSize: '0.78rem', color: '#002B7F', backgroundColor: '#EFF6FF', padding: '0.5rem 0.65rem', borderRadius: '4px' }}>
            <strong>Nota de Resolución ADI:</strong> {result.resolutionNote}
          </div>
        </div>
      )}
    </div>
  );
};