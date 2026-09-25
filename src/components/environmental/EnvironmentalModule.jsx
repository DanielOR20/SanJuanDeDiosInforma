import { useState, useEffect } from 'react';
import { getEnvironmentalData } from '../../services/api';
import { DengueAlertBanner } from './DengueAlertBanner';
import { MosquitoReportModal } from './MosquitoReportModal';
import { Recycle, Calendar, MapPin, Truck, AlertOctagon, Check } from 'lucide-react';

export const EnvironmentalModule = () => {
  const [envData, setEnvData] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    getEnvironmentalData().then(setEnvData).catch(() => {});
  }, []);

  if (!envData) return null;

  return (
    <section style={{ marginTop: '3rem', paddingTop: '2rem', borderTop: '2px solid var(--border)' }}>
      
      {/* Encabezado */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
        <div>
          <span style={{ fontSize: '0.75rem', fontWeight: '800', color: '#059669', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <Recycle size={15} /> Sostenibilidad & Salud Pública Comunal
          </span>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '900', color: 'var(--text-main)', margin: '0.2rem 0 0.2rem 0' }}>
            Gestión Ambiental & Puntos Limpios
          </h2>
          <p style={{ margin: 0, fontSize: '0.86rem', color: 'var(--text-muted)' }}>
            Campañas de descarrichización contra el dengue y puntos oficiales de reciclaje en el Distrito 03.
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
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
          <AlertOctagon size={16} /> Reportar Criadero de Zancudos
        </button>
      </div>

      {/* Alerta Epidemiológica */}
      <DengueAlertBanner alertData={envData.dengueAlert} />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
        
        {/* Columna 1: Campañas de Descarrichización */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.85rem' }}>
            <Truck size={18} color="#002B7F" />
            <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: '800', color: 'var(--text-main)' }}>
              Próximas Campañas de No Tradicionales
            </h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {envData.cleanupCampaigns.map(camp => (
              <div key={camp.id} className="stitch-card" style={{ padding: '1rem', borderLeft: '4px solid #002B7F' }}>
                <strong style={{ fontSize: '0.95rem', color: 'var(--text-main)', display: 'block', marginBottom: '0.25rem' }}>
                  {camp.title}
                </strong>
                <div style={{ fontSize: '0.8rem', color: '#002B7F', fontWeight: '700', marginBottom: '0.4rem' }}>
                  📍 {camp.sector}
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '0.2rem', marginBottom: '0.5rem' }}>
                  <div><strong>Fecha:</strong> {camp.date} ({camp.time})</div>
                  <div><strong>Punto de encuentro:</strong> {camp.meetingPoint}</div>
                </div>
                <div style={{ fontSize: '0.74rem', color: '#166534', backgroundColor: '#DCFCE7', padding: '0.35rem 0.5rem', borderRadius: '4px' }}>
                  <strong>Materiales aceptados:</strong> {camp.accepted.join(', ')}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Columna 2: Puntos Limpios (Reciclaje) */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.85rem' }}>
            <Recycle size={18} color="#059669" />
            <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: '800', color: 'var(--text-main)' }}>
              Centros de Acopio & Puntos Limpios
            </h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {envData.ecoPoints.map(point => (
              <div key={point.id} className="stitch-card" style={{ padding: '1rem', borderLeft: '4px solid #059669' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.25rem' }}>
                  <strong style={{ fontSize: '0.95rem', color: 'var(--text-main)' }}>{point.name}</strong>
                  <span style={{ fontSize: '0.7rem', fontWeight: '800', color: '#166534', backgroundColor: '#DCFCE7', padding: '0.15rem 0.45rem', borderRadius: '4px' }}>
                    {point.status}
                  </span>
                </div>
                <div style={{ fontSize: '0.78rem', color: '#64748B', display: 'flex', alignItems: 'center', gap: '0.25rem', marginBottom: '0.4rem' }}>
                  <MapPin size={13} /> {point.location}
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                  <strong>Horario:</strong> {point.schedule}
                </div>
                <div style={{ fontSize: '0.74rem', color: '#0F172A', backgroundColor: '#F1F5F9', padding: '0.35rem 0.5rem', borderRadius: '4px' }}>
                  <strong>Se recibe:</strong> {point.materials}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      <MosquitoReportModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
      />

    </section>
  );
};