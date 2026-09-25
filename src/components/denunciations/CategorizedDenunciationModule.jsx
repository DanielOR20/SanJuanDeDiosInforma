import { useState, useEffect } from 'react';
import { getDenunciationCategories, createFormalDenunciation } from '../../services/api';
import { DenunciationTracker } from './DenunciationTracker';
import { AlertCircle, CheckCircle2, ShieldAlert, PlusCircle, X } from 'lucide-react';

export const CategorizedDenunciationModule = () => {
  const [categories, setCategories] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    category: 'Aceras destruidas o sin rampa Ley 7600',
    sector: 'San Juan Centro',
    locationExact: '',
    description: '',
    isAnonymous: false,
    citizenName: ''
  });
  const [issuedFolio, setIssuedFolio] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getDenunciationCategories().then(data => setCategories(data || [])).catch(() => {});
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.locationExact.trim() || !formData.description.trim()) return;

    setLoading(true);
    try {
      const res = await createFormalDenunciation({
        ...formData,
        citizenName: formData.isAnonymous ? 'Anónimo' : (formData.citizenName.trim() || 'Vecino del Distrito')
      });
      setIssuedFolio(res.folio);
    } catch {
      alert('Error al registrar la denuncia formal.');
    } finally {
      setLoading(false);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setIssuedFolio(null);
    setFormData({
      category: 'Aceras destruidas o sin rampa Ley 7600',
      sector: 'San Juan Centro',
      locationExact: '',
      description: '',
      isAnonymous: false,
      citizenName: ''
    });
  };

  return (
    <section style={{ marginTop: '2.5rem', paddingTop: '2rem', borderTop: '2px solid var(--border)' }}>
      
      {/* Cabecera */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
        <div>
          <span style={{ fontSize: '0.75rem', fontWeight: '800', color: '#DC2626', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <ShieldAlert size={16} /> Fiscalización Ciudadana Formal
          </span>
          <h2 style={{ fontSize: '1.45rem', fontWeight: '900', color: 'var(--text-main)', margin: '0.2rem 0 0 0' }}>
            Denuncias Clasificadas con Folio ADI
          </h2>
          <p style={{ margin: 0, fontSize: '0.86rem', color: 'var(--text-muted)' }}>
            Reportes con tipificación municipal para coordinar inspecciones con cuadrillas de la ADI, AyA y gobierno local.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.35rem',
            backgroundColor: '#DC2626',
            color: '#FFFFFF',
            border: 'none',
            padding: '0.55rem 1.15rem',
            borderRadius: '4px',
            fontWeight: '800',
            fontSize: '0.84rem',
            cursor: 'pointer'
          }}
        >
          <PlusCircle size={16} /> Interponer Denuncia Formal
        </button>
      </div>

      {/* Widget de Rastreo */}
      <DenunciationTracker />

      {/* Modal de Ingreso de Denuncia */}
      {showModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0,0,0,0.65)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1rem',
          zIndex: 3500
        }}>
          <div className="stitch-card" style={{ width: '100%', maxWidth: '540px', padding: '1.75rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.65rem' }}>
              <strong style={{ fontSize: '1.15rem', color: '#DC2626' }}>Formulario Formal de Denuncia</strong>
              <button onClick={handleCloseModal} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B' }}>
                <X size={20} />
              </button>
            </div>

            {issuedFolio ? (
              <div style={{ padding: '1.5rem', textAlign: 'center', backgroundColor: '#DCFCE7', color: '#166534', borderRadius: '6px' }}>
                <CheckCircle2 size={40} style={{ margin: '0 auto 0.5rem auto' }} />
                <h3 style={{ margin: 0 }}>¡Denuncia Formal Radicada!</h3>
                <p style={{ margin: '0.4rem 0 0.75rem 0', fontSize: '0.88rem' }}>
                  Su folio oficial de seguimiento es:
                </p>
                <div style={{ fontSize: '1.25rem', fontWeight: '900', color: '#002B7F', padding: '0.4rem', backgroundColor: '#FFFFFF', borderRadius: '4px', display: 'inline-block', marginBottom: '0.85rem' }}>
                  {issuedFolio}
                </div>
                <span style={{ fontSize: '0.78rem', display: 'block', color: '#14532D' }}>
                  Guarde este código para consultar el avance del caso en la barra de búsqueda superior.
                </span>
                <button
                  onClick={handleCloseModal}
                  style={{ marginTop: '1rem', padding: '0.45rem 1rem', fontSize: '0.8rem', fontWeight: '700', borderRadius: '4px', border: '1px solid #166534', background: '#FFFFFF', cursor: 'pointer' }}
                >
                  Entendido y Cerrar
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: '700', marginBottom: '0.25rem' }}>Clasificación del Hecho *</label>
                  <select
                    value={formData.category}
                    onChange={e => setFormData({ ...formData, category: e.target.value })}
                    style={{ width: '100%', padding: '0.55rem', fontSize: '0.85rem', borderRadius: '4px', border: '1px solid var(--border)' }}
                  >
                    {categories.map(c => (
                      <option key={c.id} value={c.label}>{c.label}</option>
                    ))}
                  </select>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: '700', marginBottom: '0.25rem' }}>Sector Distrital *</label>
                    <select
                      value={formData.sector}
                      onChange={e => setFormData({ ...formData, sector: e.target.value })}
                      style={{ width: '100%', padding: '0.55rem', fontSize: '0.85rem', borderRadius: '4px', border: '1px solid var(--border)' }}
                    >
                      <option value="San Juan Centro">San Juan Centro</option>
                      <option value="Sector Itaipú">Sector Itaipú</option>
                      <option value="Sector Pedrito Monge">Sector Pedrito Monge</option>
                      <option value="Sector Calle Máquinas">Sector Calle Máquinas</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: '700', marginBottom: '0.25rem' }}>Dirección Exacta o Hito *</label>
                    <input
                      type="text"
                      required
                      placeholder="Ej: 100m norte del parque..."
                      value={formData.locationExact}
                      onChange={e => setFormData({ ...formData, locationExact: e.target.value })}
                      style={{ width: '100%', padding: '0.55rem', fontSize: '0.85rem', borderRadius: '4px', border: '1px solid var(--border)' }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: '700', marginBottom: '0.25rem' }}>Descripción Detallada *</label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Detalle la afectación, peligrosidad o daños observables..."
                    value={formData.description}
                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                    style={{ width: '100%', padding: '0.55rem', fontSize: '0.85rem', borderRadius: '4px', border: '1px solid var(--border)', fontFamily: 'inherit' }}
                  />
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.4rem 0' }}>
                  <input
                    type="checkbox"
                    id="anonCheck"
                    checked={formData.isAnonymous}
                    onChange={e => setFormData({ ...formData, isAnonymous: e.target.checked })}
                  />
                  <label htmlFor="anonCheck" style={{ fontSize: '0.8rem', color: 'var(--text-main)', cursor: 'pointer' }}>
                    Presentar esta denuncia de forma <strong>anónima</strong>
                  </label>
                </div>

                {!formData.isAnonymous && (
                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: '700', marginBottom: '0.25rem' }}>Nombre del Denunciante</label>
                    <input
                      type="text"
                      placeholder="Su nombre y apellidos..."
                      value={formData.citizenName}
                      onChange={e => setFormData({ ...formData, citizenName: e.target.value })}
                      style={{ width: '100%', padding: '0.55rem', fontSize: '0.85rem', borderRadius: '4px', border: '1px solid var(--border)' }}
                    />
                  </div>
                )}

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '0.5rem' }}>
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    style={{ padding: '0.5rem 1rem', borderRadius: '4px', border: '1px solid var(--border)', background: 'none', cursor: 'pointer', fontWeight: '700' }}
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    style={{ padding: '0.5rem 1.25rem', borderRadius: '4px', border: 'none', backgroundColor: '#DC2626', color: '#FFFFFF', cursor: 'pointer', fontWeight: '800' }}
                  >
                    {loading ? 'Generando Folio...' : 'Radicar Denuncia'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

    </section>
  );
};