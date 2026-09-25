import { useState, useEffect } from 'react';
import { 
  Droplet, 
  Zap, 
  Trash2, 
  FileText, 
  Search, 
  CheckCircle2, 
  AlertCircle, 
  Calendar, 
  ShieldCheck, 
  Clock 
} from 'lucide-react';
import { getServicesStatus, getWasteSchedule, createResidencyCertificate, getNotices } from '../services/api';

export const CivicServicesWidget = () => {
  const [activeSubTab, setActiveSubTab] = useState('semaforo');
  const [services, setServices] = useState(null);
  const [waste, setWaste] = useState([]);
  
  // Rastreo de Folio
  const [trackingCode, setTrackingCode] = useState('');
  const [trackedItem, setTrackedItem] = useState(null);
  const [trackingError, setTrackingError] = useState('');

  // Formulario Constancia
  const [certForm, setCertForm] = useState({ fullName: '', cedula: '', sector: 'San Juan Centro', purpose: '' });
  const [issuedCert, setIssuedCert] = useState(null);
  const [certLoading, setCertLoading] = useState(false);

  useEffect(() => {
    getServicesStatus().then(setServices).catch(() => {});
    getWasteSchedule().then(setWaste).catch(() => {});
  }, []);

  const handleTrackFolio = async (e) => {
    e.preventDefault();
    setTrackingError('');
    setTrackedItem(null);
    const code = trackingCode.trim().toUpperCase();
    if (!code) return;

    try {
      const notices = await getNotices();
      const match = notices.find(n => (n.caseNumber || '').toUpperCase() === code || `EXP-${n.id}` === code);
      if (match) {
        setTrackedItem({
          type: 'Incidencia / Reporte Técnico',
          title: match.title,
          sector: match.sector,
          status: match.status,
          date: match.date,
          detail: match.internalNote || match.description
        });
      } else {
        setTrackingError(`No se encontró ningún expediente activo con el folio "${code}".`);
      }
    } catch {
      setTrackingError('Error al conectar con la base de datos de expedientes.');
    }
  };

  const handleCreateCert = async (e) => {
    e.preventDefault();
    if (!certForm.fullName.trim() || !certForm.cedula.trim()) return;
    setCertLoading(true);
    try {
      const res = await createResidencyCertificate(certForm);
      setIssuedCert(res);
      setCertForm({ fullName: '', cedula: '', sector: 'San Juan Centro', purpose: '' });
    } catch {
      alert('Error al generar la constancia.');
    } finally {
      setCertLoading(false);
    }
  };

  return (
    <div className="stitch-card" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
      
      {/* Título de Sección */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1.25rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.85rem' }}>
        <div>
          <span style={{ fontSize: '0.75rem', fontWeight: '800', color: '#002B7F', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Servicios Ciudadanos & Transparencia ADI
          </span>
          <h2 style={{ fontSize: '1.35rem', fontWeight: '900', color: 'var(--text-main)', margin: '0.2rem 0 0 0' }}>
            Ventanilla Distrital en Línea
          </h2>
        </div>

        {/* Selector de herramientas */}
        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
          {[
            { id: 'semaforo', label: 'Estado Servicios' },
            { id: 'rastreo', label: 'Rastrear Folio' },
            { id: 'residuos', label: 'Recolección Basura' },
            { id: 'constancia', label: 'Constancia Vecindad' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id)}
              style={{
                padding: '0.45rem 0.85rem',
                fontSize: '0.8rem',
                fontWeight: '700',
                borderRadius: '4px',
                border: activeSubTab === tab.id ? '1px solid #002B7F' : '1px solid var(--border)',
                backgroundColor: activeSubTab === tab.id ? '#002B7F' : 'var(--surface-subtle)',
                color: activeSubTab === tab.id ? '#FFFFFF' : 'var(--text-main)',
                cursor: 'pointer'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* 1. SEMÁFORO DE SERVICIOS */}
      {activeSubTab === 'semaforo' && services && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
          {/* Agua AyA */}
          <div style={{ padding: '1rem', borderRadius: '6px', border: '1px solid var(--border)', backgroundColor: 'var(--surface-subtle)', borderLeft: `5px solid ${services.water.status === 'normal' ? '#059669' : '#DC2626'}` }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: '800', fontSize: '0.92rem' }}>
                <Droplet size={17} color="#002B7F" /> Acueducto (AyA)
              </div>
              <span style={{ fontSize: '0.72rem', fontWeight: '800', padding: '0.15rem 0.5rem', borderRadius: '4px', backgroundColor: services.water.status === 'normal' ? '#DCFCE7' : '#FEE2E2', color: services.water.status === 'normal' ? '#166534' : '#991B1B' }}>
                {services.water.label}
              </span>
            </div>
            <p style={{ margin: '0 0 0.35rem 0', fontSize: '0.84rem', color: 'var(--text-muted)' }}>{services.water.detail}</p>
            <span style={{ fontSize: '0.74rem', color: '#64748B' }}>Sector: {services.water.sector}</span>
          </div>

          {/* Electricidad CNFL */}
          <div style={{ padding: '1rem', borderRadius: '6px', border: '1px solid var(--border)', backgroundColor: 'var(--surface-subtle)', borderLeft: `5px solid ${services.electric.status === 'normal' ? '#059669' : '#D97706'}` }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: '800', fontSize: '0.92rem' }}>
                <Zap size={17} color="#D97706" /> Alumbrado y Red (CNFL)
              </div>
              <span style={{ fontSize: '0.72rem', fontWeight: '800', padding: '0.15rem 0.5rem', borderRadius: '4px', backgroundColor: services.electric.status === 'normal' ? '#DCFCE7' : '#FEF3C7', color: services.electric.status === 'normal' ? '#166534' : '#92400E' }}>
                {services.electric.label}
              </span>
            </div>
            <p style={{ margin: '0 0 0.35rem 0', fontSize: '0.84rem', color: 'var(--text-muted)' }}>{services.electric.detail}</p>
            <span style={{ fontSize: '0.74rem', color: '#64748B' }}>Sector: {services.electric.sector}</span>
          </div>
        </div>
      )}

      {/* 2. RASTREO DE FOLIO */}
      {activeSubTab === 'rastreo' && (
        <div>
          <form onSubmit={handleTrackFolio} style={{ display: 'flex', gap: '0.5rem', maxWidth: '520px', marginBottom: '1rem' }}>
            <input
              type="text"
              placeholder="Ingrese código de expediente (ej: EXP-2026-089)..."
              value={trackingCode}
              onChange={e => setTrackingCode(e.target.value)}
              style={{ flex: 1, padding: '0.55rem 0.85rem', fontSize: '0.88rem', borderRadius: '4px', border: '1px solid var(--border)' }}
            />
            <button
              type="submit"
              style={{ backgroundColor: '#002B7F', color: 'white', border: 'none', padding: '0.55rem 1.15rem', borderRadius: '4px', fontWeight: '700', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer' }}
            >
              <Search size={15} /> Consultar
            </button>
          </form>

          {trackingError && (
            <div style={{ padding: '0.75rem', backgroundColor: '#FEE2E2', color: '#991B1B', borderRadius: '4px', fontSize: '0.84rem', fontWeight: '700' }}>
              {trackingError}
            </div>
          )}

          {trackedItem && (
            <div style={{ padding: '1rem', border: '1px solid #CBD5E1', borderRadius: '6px', backgroundColor: 'var(--surface-subtle)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                <strong style={{ fontSize: '1rem', color: 'var(--text-main)' }}>{trackedItem.title}</strong>
                <span style={{ fontSize: '0.75rem', fontWeight: '800', padding: '0.2rem 0.55rem', borderRadius: '4px', backgroundColor: '#E0E7FF', color: '#002B7F' }}>
                  {trackedItem.status}
                </span>
              </div>
              <div style={{ fontSize: '0.8rem', color: '#64748B', marginBottom: '0.5rem' }}>
                Sector: <strong>{trackedItem.sector}</strong> • Reportado: {trackedItem.date}
              </div>
              <p style={{ margin: 0, fontSize: '0.86rem', color: 'var(--text-main)' }}>
                <strong>Seguimiento de la ADI:</strong> {trackedItem.detail}
              </p>
            </div>
          )}
        </div>
      )}

      {/* 3. CALENDARIO DE RESIDUOS */}
      {activeSubTab === 'residuos' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
          {waste.map((w, idx) => (
            <div key={idx} style={{ padding: '1rem', borderRadius: '6px', border: '1px solid var(--border)', backgroundColor: 'var(--surface-subtle)' }}>
              <strong style={{ fontSize: '0.95rem', color: '#002B7F', display: 'block', marginBottom: '0.5rem' }}>
                📍 {w.sector}
              </strong>
              <div style={{ fontSize: '0.82rem', display: 'flex', flexDirection: 'column', gap: '0.35rem', color: 'var(--text-muted)' }}>
                <div><strong>Ordinaria:</strong> {w.regular}</div>
                <div><strong>Reciclaje:</strong> {w.recycling}</div>
                <div><strong>No tradicionales:</strong> {w.bulky}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 4. CONSTANCIA COMUNAL DE VECINDAD */}
      {activeSubTab === 'constancia' && (
        <div>
          {issuedCert ? (
            <div style={{ padding: '1.5rem', textAlign: 'center', border: '2px solid #059669', borderRadius: '6px', backgroundColor: '#DCFCE7' }}>
              <CheckCircle2 size={36} color="#166534" style={{ margin: '0 auto 0.4rem auto' }} />
              <h3 style={{ margin: '0 0 0.35rem 0', color: '#166534' }}>¡Constancia Emitida con Éxito!</h3>
              <p style={{ margin: '0 0 0.75rem 0', fontSize: '0.86rem', color: '#166534' }}>
                Folio Oficial: <strong>{issuedCert.folio}</strong> • Solicitante: <strong>{issuedCert.fullName}</strong>
              </p>
              <span style={{ fontSize: '0.78rem', color: '#14532D', display: 'block', fontStyle: 'italic' }}>
                Este documento certifica su residencia en el Distrito 03 San Juan de Dios ante instituciones públicas (IMAS, CCSS, MEP).
              </span>
              <button
                onClick={() => setIssuedCert(null)}
                style={{ marginTop: '1rem', padding: '0.45rem 1rem', fontSize: '0.8rem', fontWeight: '700', borderRadius: '4px', border: '1px solid #166534', background: '#FFFFFF', cursor: 'pointer' }}
              >
                Emitir Otra Constancia
              </button>
            </div>
          ) : (
            <form onSubmit={handleCreateCert} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem', alignItems: 'flex-end' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: '700', marginBottom: '0.2rem' }}>Nombre Completo *</label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Daniel Morales Fallas"
                  value={certForm.fullName}
                  onChange={e => setCertForm({ ...certForm, fullName: e.target.value })}
                  style={{ width: '100%', padding: '0.5rem', fontSize: '0.85rem', borderRadius: '4px', border: '1px solid var(--border)' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: '700', marginBottom: '0.2rem' }}>Cédula *</label>
                <input
                  type="text"
                  required
                  placeholder="Ej: 1-1823-0492"
                  value={certForm.cedula}
                  onChange={e => setCertForm({ ...certForm, cedula: e.target.value })}
                  style={{ width: '100%', padding: '0.5rem', fontSize: '0.85rem', borderRadius: '4px', border: '1px solid var(--border)' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: '700', marginBottom: '0.2rem' }}>Sector de Residencia</label>
                <select
                  value={certForm.sector}
                  onChange={e => setCertForm({ ...certForm, sector: e.target.value })}
                  style={{ width: '100%', padding: '0.5rem', fontSize: '0.85rem', borderRadius: '4px', border: '1px solid var(--border)' }}
                >
                  <option value="San Juan Centro">San Juan Centro</option>
                  <option value="Sector Itaipú">Sector Itaipú</option>
                  <option value="Sector Pedrito Monge">Sector Pedrito Monge</option>
                  <option value="Sector Calle Máquinas">Sector Calle Máquinas</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: '700', marginBottom: '0.2rem' }}>Propósito de la Constancia</label>
                <input
                  type="text"
                  placeholder="Ej: Beca estudiantil, trámite bancario..."
                  value={certForm.purpose}
                  onChange={e => setCertForm({ ...certForm, purpose: e.target.value })}
                  style={{ width: '100%', padding: '0.5rem', fontSize: '0.85rem', borderRadius: '4px', border: '1px solid var(--border)' }}
                />
              </div>

              <button
                type="submit"
                disabled={certLoading}
                style={{ padding: '0.55rem 1rem', height: '38px', borderRadius: '4px', border: 'none', backgroundColor: '#002B7F', color: '#FFFFFF', fontWeight: '700', fontSize: '0.84rem', cursor: 'pointer' }}
              >
                {certLoading ? 'Generando...' : 'Emitir Constancia'}
              </button>
            </form>
          )}
        </div>
      )}

    </div>
  );
};