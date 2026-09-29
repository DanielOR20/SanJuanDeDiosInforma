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
    <div style={{ marginBottom: '2rem' }}>
      
      {/* Título de Sección y Pestañas */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1.25rem', borderBottom: '2px solid #CBD5E1', paddingBottom: '0' }}>
        <div style={{ paddingBottom: '0.85rem' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: '800', color: '#002B7F', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Servicios Ciudadanos & Transparencia ADI
          </span>
          <h2 style={{ fontSize: '1.35rem', fontWeight: '900', color: 'var(--text-main)', margin: '0.2rem 0 0 0' }}>
            Ventanilla Distrital en Línea
          </h2>
        </div>

        {/* Selector de herramientas (Estilo Menú Gubernamental) */}
        <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', marginBottom: '-2px' }}>
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
                padding: '0.65rem 0.25rem',
                fontSize: '0.85rem',
                fontWeight: '700',
                background: 'none',
                border: 'none',
                borderBottom: activeSubTab === tab.id ? '2px solid #002B7F' : '2px solid transparent',
                color: activeSubTab === tab.id ? '#002B7F' : '#64748B',
                cursor: 'pointer',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                transition: 'all 0.2s'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div style={{ backgroundColor: 'white', border: '1px solid #E2E8F0', padding: '1.5rem' }}>
        {/* 1. SEMÁFORO DE SERVICIOS */}
        {activeSubTab === 'semaforo' && services && (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            
            <div style={{ display: 'flex', alignItems: 'center', padding: '1rem', borderBottom: '1px solid #E2E8F0' }}>
              <div style={{ width: '25%', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '800', fontSize: '0.95rem', color: '#0F172A' }}>
                <Droplet size={18} color="#002B7F" /> Acueducto (AyA)
              </div>
              <div style={{ width: '25%', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: services.water.status === 'normal' ? '#10B981' : '#F59E0B' }}></div>
                <span style={{ fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', color: '#475569' }}>{services.water.label}</span>
              </div>
              <div style={{ width: '30%', fontSize: '0.9rem', color: '#334155' }}>
                {services.water.detail}
              </div>
              <div style={{ width: '20%', textAlign: 'right' }}>
                <span style={{ backgroundColor: '#F1F5F9', padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem', color: '#475569', fontWeight: '600' }}>{services.water.sector}</span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', padding: '1rem', borderBottom: '1px solid #E2E8F0' }}>
              <div style={{ width: '25%', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '800', fontSize: '0.95rem', color: '#0F172A' }}>
                <Zap size={18} color="#D97706" /> Alumbrado (CNFL)
              </div>
              <div style={{ width: '25%', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: services.electric.status === 'normal' ? '#10B981' : '#F59E0B' }}></div>
                <span style={{ fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', color: '#475569' }}>{services.electric.label}</span>
              </div>
              <div style={{ width: '30%', fontSize: '0.9rem', color: '#334155' }}>
                {services.electric.detail}
              </div>
              <div style={{ width: '20%', textAlign: 'right' }}>
                <span style={{ backgroundColor: '#F1F5F9', padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem', color: '#475569', fontWeight: '600' }}>{services.electric.sector}</span>
              </div>
            </div>

          </div>
        )}

        {/* 2. RASTREO DE EXPEDIENTES / FOLIOS */}
        {activeSubTab === 'rastreo' && (
          <div>
            <form onSubmit={handleTrackFolio} style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
              <input 
                type="text" 
                placeholder="Ej. DEN-2026-1042 o EXP-1" 
                value={trackingCode}
                onChange={(e) => setTrackingCode(e.target.value)}
                style={{ flex: 1, padding: '0.75rem', border: '1px solid #CBD5E1', borderRadius: '4px', outline: 'none', fontSize: '0.9rem' }}
              />
              <button type="submit" style={{ padding: '0.75rem 1.5rem', backgroundColor: '#002B7F', color: 'white', border: 'none', borderRadius: '4px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Search size={16} /> Consultar
              </button>
            </form>
            {trackingError && <div style={{ color: '#DC2626', fontSize: '0.85rem', padding: '1rem', backgroundColor: '#FEF2F2', border: '1px solid #FCA5A5' }}>{trackingError}</div>}
            {trackedItem && (
              <div style={{ padding: '1.5rem', border: '1px solid #CBD5E1', backgroundColor: '#F8FAFC' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                  <span style={{ fontWeight: '800', color: '#002B7F', textTransform: 'uppercase', fontSize: '0.8rem' }}>{trackedItem.type}</span>
                  <span style={{ fontWeight: '700', color: trackedItem.status === 'resolved' ? '#059669' : '#D97706', fontSize: '0.8rem', textTransform: 'uppercase' }}>Estado: {trackedItem.status}</span>
                </div>
                <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1.1rem' }}>{trackedItem.title}</h4>
                <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.9rem', color: '#475569' }}>{trackedItem.detail}</p>
                <div style={{ display: 'flex', gap: '1rem', fontSize: '0.8rem', color: '#64748B' }}>
                  <span><MapPin size={12} style={{display:'inline'}}/> {trackedItem.sector}</span>
                  <span><Calendar size={12} style={{display:'inline'}}/> {new Date(trackedItem.date).toLocaleDateString()}</span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* 3. RECOLECCIÓN DE RESIDUOS */}
        {activeSubTab === 'residuos' && (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {waste.map(w => (
              <div key={w.id} style={{ display: 'flex', alignItems: 'center', padding: '1rem', borderBottom: '1px solid #E2E8F0' }}>
                <div style={{ width: '15%', fontWeight: '800', fontSize: '1rem', color: '#0F172A', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Trash2 size={18} color="#475569" /> {w.day}
                </div>
                <div style={{ width: '40%', fontSize: '0.9rem', color: '#334155' }}>
                  <strong>{w.sector}</strong>
                </div>
                <div style={{ width: '25%', fontSize: '0.85rem', color: '#475569' }}>
                  <Clock size={14} style={{display:'inline'}} /> {w.time}
                </div>
                <div style={{ width: '20%', textAlign: 'right' }}>
                  <span style={{ backgroundColor: '#F1F5F9', padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem', color: '#475569', fontWeight: '600' }}>{w.type}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 4. CONSTANCIA DE VECINDAD */}
        {activeSubTab === 'constancia' && (
          <div>
            {!issuedCert ? (
              <form onSubmit={handleCreateCert} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '600px' }}>
                <p style={{ fontSize: '0.9rem', color: '#475569', marginBottom: '0.5rem' }}>Emita su constancia de residencia oficial respaldada por la ADI de forma automática.</p>
                <input type="text" placeholder="Nombre Completo" required value={certForm.fullName} onChange={e => setCertForm({...certForm, fullName: e.target.value})} style={{ padding: '0.75rem', border: '1px solid #CBD5E1', borderRadius: '4px' }}/>
                <input type="text" placeholder="Número de Cédula" required value={certForm.cedula} onChange={e => setCertForm({...certForm, cedula: e.target.value})} style={{ padding: '0.75rem', border: '1px solid #CBD5E1', borderRadius: '4px' }}/>
                <select value={certForm.sector} onChange={e => setCertForm({...certForm, sector: e.target.value})} style={{ padding: '0.75rem', border: '1px solid #CBD5E1', borderRadius: '4px' }}>
                  <option>San Juan Centro</option><option>Sector Itaipú</option><option>Calle Máquinas</option><option>Pedrito Monge</option>
                </select>
                <input type="text" placeholder="Motivo o Institución (Ej. Banco Nacional)" required value={certForm.purpose} onChange={e => setCertForm({...certForm, purpose: e.target.value})} style={{ padding: '0.75rem', border: '1px solid #CBD5E1', borderRadius: '4px' }}/>
                <button type="submit" disabled={certLoading} style={{ padding: '0.85rem', backgroundColor: '#059669', color: 'white', border: 'none', borderRadius: '4px', fontWeight: '700', cursor: 'pointer', marginTop: '0.5rem' }}>
                  {certLoading ? 'Generando...' : 'Generar Documento Oficial'}
                </button>
              </form>
            ) : (
              <div style={{ padding: '2rem', border: '2px solid #10B981', backgroundColor: '#F0FDF4', textAlign: 'center' }}>
                <CheckCircle2 size={48} color="#10B981" style={{ marginBottom: '1rem' }} />
                <h3 style={{ margin: '0 0 0.5rem 0', color: '#065F46' }}>Constancia Emitida Exitosamente</h3>
                <p style={{ margin: '0 0 1rem 0', color: '#047857' }}>Folio Digital: {issuedCert.id}</p>
                <button onClick={() => setIssuedCert(null)} style={{ padding: '0.5rem 1rem', border: '1px solid #10B981', backgroundColor: 'transparent', color: '#065F46', fontWeight: '700', cursor: 'pointer' }}>Emitir Otra</button>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};