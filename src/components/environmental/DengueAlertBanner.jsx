import { AlertTriangle, ShieldCheck, HeartHandshake } from 'lucide-react';

export const DengueAlertBanner = ({ alertData }) => {
  if (!alertData) return null;

  return (
    <div style={{
      backgroundColor: '#FEF3C7',
      borderLeft: '4px solid #D97706',
      padding: '1rem',
      marginBottom: '1.5rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      gap: '1rem'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div style={{ color: '#D97706', flexShrink: 0 }}>
          <AlertTriangle size={24} />
        </div>
        <div>
          <strong style={{ fontSize: '1rem', color: '#92400E', display: 'block' }}>
            {alertData.level} • {alertData.sector}
          </strong>
          <span style={{ fontSize: '0.85rem', color: '#78350F' }}>
            {alertData.message} Casos sospechosos: <strong>{alertData.casesReported}</strong>.
          </span>
        </div>
      </div>
      
      <div style={{ fontSize: '0.8rem', color: '#92400E', fontWeight: '700', textAlign: 'right' }}>
        <div style={{ backgroundColor: '#FDE68A', padding: '0.2rem 0.5rem', display: 'inline-block', marginBottom: '0.25rem' }}>
          ACTUALIZADO: {alertData.updatedAt}
        </div>
        <div>
          Lave pilas, tape tanques y deseche llantas.
        </div>
      </div>
    </div>
  );
};