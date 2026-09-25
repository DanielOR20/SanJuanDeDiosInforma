import { AlertTriangle, ShieldCheck, HeartHandshake } from 'lucide-react';

export const DengueAlertBanner = ({ alertData }) => {
  if (!alertData) return null;

  return (
    <div style={{
      backgroundColor: '#FEF3C7',
      borderLeft: '6px solid #D97706',
      borderRadius: '6px',
      padding: '1.25rem',
      marginBottom: '1.5rem',
      display: 'flex',
      alignItems: 'flex-start',
      gap: '0.85rem'
    }}>
      <div style={{ backgroundColor: '#D97706', color: '#FFFFFF', padding: '0.45rem', borderRadius: '4px', flexShrink: 0 }}>
        <AlertTriangle size={20} />
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '0.25rem' }}>
          <strong style={{ fontSize: '0.98rem', color: '#92400E' }}>
            {alertData.level} • {alertData.sector}
          </strong>
          <span style={{ fontSize: '0.75rem', fontWeight: '800', backgroundColor: '#FDE68A', color: '#78350F', padding: '0.15rem 0.5rem', borderRadius: '4px' }}>
            Actualizado: {alertData.updatedAt}
          </span>
        </div>
        <p style={{ margin: '0 0 0.4rem 0', fontSize: '0.86rem', color: '#78350F', lineHeight: 1.45 }}>
          {alertData.message} Casos sospechosos reportados en seguimiento: <strong>{alertData.casesReported}</strong>.
        </p>
        <span style={{ fontSize: '0.78rem', color: '#92400E', fontWeight: '700' }}>
          💡 Recuerde: Lave pilas cada 3 días, tape tanques de captación y deseche llantas inservibles en la campaña del sábado.
        </span>
      </div>
    </div>
  );
};