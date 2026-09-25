import { useState } from 'react';
import { createCommunityJob } from '../../services/api';
import { PlusCircle, CheckCircle2, AlertTriangle, X } from 'lucide-react';

export const JobModalForm = ({ isOpen, onClose, onJobCreated }) => {
  const [formData, setFormData] = useState({
    title: '',
    businessName: '',
    sector: 'San Juan Centro',
    type: 'Empleo Comercial',
    schedule: 'Tiempo Completo',
    salary: '',
    description: '',
    contactPhone: '',
    contactType: 'whatsapp'
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.contactPhone.trim()) return;

    setSubmitting(true);
    try {
      await createCommunityJob(formData);
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onJobCreated();
        onClose();
        setFormData({
          title: '',
          businessName: '',
          sector: 'San Juan Centro',
          type: 'Empleo Comercial',
          schedule: 'Tiempo Completo',
          salary: '',
          description: '',
          contactPhone: '',
          contactType: 'whatsapp'
        });
      }, 1800);
    } catch {
      alert('Error al publicar vacante u oficio.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(0,0,0,0.65)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1rem',
      zIndex: 5000,
      backdropFilter: 'blur(2px)'
    }}>
      <div className="stitch-card" style={{ width: '100%', maxWidth: '580px', maxHeight: '90vh', overflowY: 'auto', padding: '1.75rem', backgroundColor: 'var(--surface)' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid #E2E8F0', paddingBottom: '0.75rem' }}>
          <h2 style={{ fontSize: '1.3rem', fontWeight: '900', color: 'var(--text-main)', margin: 0 }}>
            Publicar Vacante u Oficio Comunitario
          </h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
            <X size={20} />
          </button>
        </div>

        {success ? (
          <div style={{ padding: '2rem', textAlign: 'center', backgroundColor: '#DCFCE7', color: '#166534', borderRadius: '6px' }}>
            <CheckCircle2 size={40} style={{ margin: '0 auto 0.5rem auto' }} />
            <h3 style={{ margin: 0 }}>¡Oportunidad Publicada!</h3>
            <p style={{ margin: '0.4rem 0 0 0', fontSize: '0.85rem' }}>Ya está visible para los vecinos del distrito.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '0.75rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: '700', marginBottom: '0.2rem', color: 'var(--text-main)' }}>Puesto u Oficio Ofrecido *</label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Dependiente de mostrador / Pintura de casas"
                  value={formData.title}
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                  style={{ width: '100%', padding: '0.6rem 0.85rem', fontSize: '0.85rem', borderRadius: '6px', border: '1px solid var(--border)', backgroundColor: 'var(--surface-subtle)', color: 'var(--text-main)' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: '700', marginBottom: '0.2rem', color: 'var(--text-main)' }}>Modalidad *</label>
                <select
                  value={formData.type}
                  onChange={e => setFormData({ ...formData, type: e.target.value })}
                  style={{ width: '100%', padding: '0.6rem 0.85rem', fontSize: '0.85rem', borderRadius: '6px', border: '1px solid var(--border)', backgroundColor: 'var(--surface-subtle)', color: 'var(--text-main)' }}
                >
                  <option value="Empleo Comercial">Empleo Comercial (Local / Negocio)</option>
                  <option value="Oficio Vecinal">Oficio Vecinal (Independiente)</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: '700', marginBottom: '0.2rem', color: 'var(--text-main)' }}>Nombre del Negocio o Vecino *</label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Panadería San Juan / Don Carlos"
                  value={formData.businessName}
                  onChange={e => setFormData({ ...formData, businessName: e.target.value })}
                  style={{ width: '100%', padding: '0.6rem 0.85rem', fontSize: '0.85rem', borderRadius: '6px', border: '1px solid var(--border)', backgroundColor: 'var(--surface-subtle)', color: 'var(--text-main)' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: '700', marginBottom: '0.2rem', color: 'var(--text-main)' }}>Sector Distrital *</label>
                <select
                  value={formData.sector}
                  onChange={e => setFormData({ ...formData, sector: e.target.value })}
                  style={{ width: '100%', padding: '0.6rem 0.85rem', fontSize: '0.85rem', borderRadius: '6px', border: '1px solid var(--border)', backgroundColor: 'var(--surface-subtle)', color: 'var(--text-main)' }}
                >
                  <option value="San Juan Centro">San Juan Centro</option>
                  <option value="Sector Itaipú">Sector Itaipú</option>
                  <option value="Sector Pedrito Monge">Sector Pedrito Monge</option>
                  <option value="Sector Calle Máquinas">Sector Calle Máquinas</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: '700', marginBottom: '0.2rem', color: 'var(--text-main)' }}>Horario o Jornada</label>
                <input
                  type="text"
                  placeholder="Ej: Tiempo Completo / Fines de Semana"
                  value={formData.schedule}
                  onChange={e => setFormData({ ...formData, schedule: e.target.value })}
                  style={{ width: '100%', padding: '0.6rem 0.85rem', fontSize: '0.85rem', borderRadius: '6px', border: '1px solid var(--border)', backgroundColor: 'var(--surface-subtle)', color: 'var(--text-main)' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: '700', marginBottom: '0.2rem', color: 'var(--text-main)' }}>Salario o Tarifa (Opcional)</label>
                <input
                  type="text"
                  placeholder="Ej: ₡360,000 / mes o A convenir"
                  value={formData.salary}
                  onChange={e => setFormData({ ...formData, salary: e.target.value })}
                  style={{ width: '100%', padding: '0.6rem 0.85rem', fontSize: '0.85rem', borderRadius: '6px', border: '1px solid var(--border)', backgroundColor: 'var(--surface-subtle)', color: 'var(--text-main)' }}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '0.75rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: '700', marginBottom: '0.2rem', color: 'var(--text-main)' }}>Teléfono de Contacto *</label>
                <input
                  type="text"
                  required
                  placeholder="Ej: 8888-1122"
                  value={formData.contactPhone}
                  onChange={e => setFormData({ ...formData, contactPhone: e.target.value })}
                  style={{ width: '100%', padding: '0.6rem 0.85rem', fontSize: '0.85rem', borderRadius: '6px', border: '1px solid var(--border)', backgroundColor: 'var(--surface-subtle)', color: 'var(--text-main)' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: '700', marginBottom: '0.2rem', color: 'var(--text-main)' }}>Canal Preferido</label>
                <select
                  value={formData.contactType}
                  onChange={e => setFormData({ ...formData, contactType: e.target.value })}
                  style={{ width: '100%', padding: '0.6rem 0.85rem', fontSize: '0.85rem', borderRadius: '6px', border: '1px solid var(--border)', backgroundColor: 'var(--surface-subtle)', color: 'var(--text-main)' }}
                >
                  <option value="whatsapp">WhatsApp Directo</option>
                  <option value="phone">Llamada Telefónica</option>
                </select>
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: '700', marginBottom: '0.2rem', color: 'var(--text-main)' }}>Descripción y Requisitos *</label>
              <textarea
                rows={3}
                required
                placeholder="Detalle los requisitos (experiencia, herramientas, etc.)..."
                value={formData.description}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
                style={{ width: '100%', padding: '0.6rem 0.85rem', fontSize: '0.85rem', borderRadius: '6px', border: '1px solid var(--border)', backgroundColor: 'var(--surface-subtle)', color: 'var(--text-main)', fontFamily: 'inherit' }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '0.5rem' }}>
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
                style={{ padding: '0.6rem 1.35rem', borderRadius: '6px', border: 'none', backgroundColor: '#002B7F', color: '#FFFFFF', cursor: 'pointer', fontWeight: '700' }}
              >
                {submitting ? 'Publicando...' : 'Publicar Anuncio'}
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
};