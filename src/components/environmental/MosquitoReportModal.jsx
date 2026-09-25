import { useState } from 'react';
import { createMosquitoReport } from '../../services/api';
import { CheckCircle2, AlertOctagon, X } from 'lucide-react';

export const MosquitoReportModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    reporterName: '',
    sector: 'San Juan Centro',
    description: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.description.trim()) return;

    setSubmitting(true);
    try {
      await createMosquitoReport(formData);
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onClose();
        setFormData({ reporterName: '', sector: 'San Juan Centro', description: '' });
      }, 2000);
    } catch {
      alert('Error al enviar el reporte.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(0,0,0,0.65)',
      backdropFilter: 'blur(2px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1rem',
      zIndex: 5000
    }}>
      <div className="stitch-card" style={{ width: '100%', maxWidth: '520px', padding: '1.75rem', backgroundColor: 'var(--surface)' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.65rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#DC2626' }}>
            <AlertOctagon size={18} />
            <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: '900', color: 'var(--text-main)' }}>
              Reportar Criadero de Zancudos
            </h3>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
            <X size={20} />
          </button>
        </div>

        {success ? (
          <div style={{ padding: '1.75rem', textAlign: 'center', backgroundColor: '#DCFCE7', color: '#166534', borderRadius: '6px' }}>
            <CheckCircle2 size={36} style={{ margin: '0 auto 0.4rem auto' }} />
            <h4 style={{ margin: 0 }}>¡Reporte Registrado!</h4>
            <p style={{ margin: '0.3rem 0 0 0', fontSize: '0.84rem' }}>
              La cuadrilla de inspección de la ADI y el EBAIS coordinarán la visita técnica.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: '700', marginBottom: '0.2rem', color: 'var(--text-main)' }}>Su Nombre o "Anónimo"</label>
              <input
                type="text"
                placeholder="Ej: Vecino / María González"
                value={formData.reporterName}
                onChange={e => setFormData({ ...formData, reporterName: e.target.value })}
                style={{ width: '100%', padding: '0.6rem 0.85rem', fontSize: '0.85rem', borderRadius: '6px', border: '1px solid var(--border)', backgroundColor: 'var(--surface-subtle)', color: 'var(--text-main)' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: '700', marginBottom: '0.2rem', color: 'var(--text-main)' }}>Sector del Criadero *</label>
              <select
                value={formData.sector}
                onChange={e => setFormData({ ...formData, sector: e.target.value })}
                style={{ width: '100%', padding: '0.6rem 0.85rem', fontSize: '0.85rem', borderRadius: '6px', border: '1px solid var(--border)', backgroundColor: 'var(--surface-subtle)', color: 'var(--text-main)' }}
              >
                <option value="San Juan Centro">San Juan Centro</option>
                <option value="Sector Itaipú & Calabacitas">Sector Itaipú & Calabacitas</option>
                <option value="Sector Pedrito Monge">Sector Pedrito Monge</option>
                <option value="Sector Calle Máquinas">Sector Calle Máquinas</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: '700', marginBottom: '0.2rem', color: 'var(--text-main)' }}>Detalle de Ubicación y Tipo de Criadero *</label>
              <textarea
                rows={3}
                required
                placeholder="Describa el lugar (lote baldío, canoas dañadas, acumulación de llantas, etc.)..."
                value={formData.description}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
                style={{ width: '100%', padding: '0.6rem 0.85rem', fontSize: '0.85rem', borderRadius: '6px', border: '1px solid var(--border)', backgroundColor: 'var(--surface-subtle)', color: 'var(--text-main)', fontFamily: 'inherit' }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '0.4rem' }}>
              <button
                type="button"
                onClick={onClose}
                style={{ padding: '0.6rem 1rem', borderRadius: '6px', border: '1px solid var(--border)', backgroundColor: 'var(--surface-subtle)', color: 'var(--text-main)', cursor: 'pointer', fontWeight: '700' }}
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={submitting}
                style={{ padding: '0.6rem 1.25rem', borderRadius: '6px', border: 'none', backgroundColor: '#DC2626', color: '#FFFFFF', cursor: 'pointer', fontWeight: '800' }}
              >
                {submitting ? 'Enviando...' : 'Enviar Reporte'}
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
};