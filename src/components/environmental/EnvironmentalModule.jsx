import { useState, useEffect } from 'react';
import { getEnvironmentalData } from '../../services/api';
import { DengueAlertBanner } from './DengueAlertBanner';
import { MosquitoReportModal } from './MosquitoReportModal';
import { Recycle, Calendar, MapPin, Truck, AlertOctagon, Check, Clock } from 'lucide-react';

export const EnvironmentalModule = () => {
  const [envData, setEnvData] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    getEnvironmentalData().then(setEnvData).catch(() => {});
  }, []);

  if (!envData) return null;

  return (
    <section style={{ borderTop: '4px solid #0F172A', paddingTop: '2rem' }}>
      
      {/* Encabezado */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem', borderBottom: '1px solid #CBD5E1', paddingBottom: '1rem' }}>
        <div>
          <span style={{ fontSize: '0.75rem', fontWeight: '800', color: '#059669', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <Recycle size={15} /> Sostenibilidad & Salud Pública Comunal
          </span>
          <h2 style={{ fontSize: '1.4rem', fontWeight: '900', color: '#0F172A', margin: '0.2rem 0 0.2rem 0', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Gestión Ambiental & Puntos Limpios
          </h2>
          <p style={{ margin: 0, fontSize: '0.86rem', color: '#475569' }}>
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
            padding: '0.75rem 1.25rem',
            fontWeight: '800',
            fontSize: '0.84rem',
            cursor: 'pointer',
            textTransform: 'uppercase',
            letterSpacing: '0.05em'
          }}
        >
          <AlertOctagon size={16} /> Reportar Criadero de Zancudos
        </button>
      </div>

      {/* Alerta Epidemiológica */}
      <DengueAlertBanner alertData={envData.dengueAlert} />

      <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
        
        {/* BLOQUE A: Campañas de Descarrichización (Ticket Horizontal) */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', borderBottom: '2px solid #002B7F', paddingBottom: '0.5rem' }}>
            <Truck size={20} color="#002B7F" />
            <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: '800', color: '#0F172A', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Campañas de No Tradicionales
            </h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {envData.cleanupCampaigns.map(camp => (
              <div key={camp.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.25rem 0', borderBottom: '1px solid #E2E8F0', flexWrap: 'wrap', gap: '1rem' }}>
                <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', flex: 1 }}>
                  <div style={{ backgroundColor: '#002B7F', color: 'white', padding: '0.5rem 1rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minWidth: '80px' }}>
                    <span style={{ fontSize: '1.2rem', fontWeight: '900', lineHeight: 1 }}>{camp.date.split(' ')[0] || 'SÁB'}</span>
                    <span style={{ fontSize: '0.7rem', fontWeight: '700', letterSpacing: '1px', marginTop: '2px' }}>{camp.date.split(' ')[1] || 'OCT'}</span>
                  </div>
                  <div>
                    <strong style={{ fontSize: '1.05rem', color: '#0F172A', display: 'block', marginBottom: '0.2rem' }}>
                      {camp.title}
                    </strong>
                    <div style={{ fontSize: '0.85rem', color: '#475569', marginBottom: '0.2rem' }}>
                      <Clock size={12} style={{ display: 'inline', marginRight: '4px' }}/> {camp.time}
                    </div>
                    <div style={{ fontSize: '0.85rem', color: '#334155' }}>
                      {camp.accepted.join(' • ')}
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#0F172A', fontWeight: '700', fontSize: '0.9rem', backgroundColor: '#F1F5F9', padding: '0.5rem 1rem' }}>
                  <MapPin size={16} color="#002B7F" /> {camp.meetingPoint}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* BLOQUE B: Puntos Limpios (Directorio Lineal) */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', borderBottom: '2px solid #059669', paddingBottom: '0.5rem' }}>
            <Recycle size={20} color="#059669" />
            <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: '800', color: '#0F172A', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Centros de Acopio & Puntos Limpios
            </h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {envData.ecoPoints.map(point => (
              <div key={point.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.25rem 0', borderBottom: '1px solid #E2E8F0', flexWrap: 'wrap', gap: '1rem' }}>
                <div style={{ flex: 1, minWidth: '250px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                    <strong style={{ fontSize: '1.05rem', color: '#0F172A' }}>{point.name}</strong>
                    <span style={{ fontSize: '0.65rem', fontWeight: '800', color: '#166534', backgroundColor: '#DCFCE7', padding: '0.15rem 0.45rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      {point.status}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.85rem', color: '#475569', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <MapPin size={14} /> {point.location}
                  </div>
                </div>
                
                <div style={{ flex: 1, minWidth: '200px', fontSize: '0.85rem', fontFamily: 'monospace', color: '#334155', fontWeight: '600' }}>
                  {point.schedule}
                </div>
                
                <div style={{ flex: 1, minWidth: '250px', fontSize: '0.85rem', color: '#475569' }}>
                  <span style={{ fontWeight: '700', color: '#059669' }}>SE RECIBE:</span> {point.materials}
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