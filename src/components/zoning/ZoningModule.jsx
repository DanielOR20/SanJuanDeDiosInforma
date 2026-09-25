import { useState } from 'react';
import { ZoningSimulator } from './ZoningSimulator';
import { MinorWorkGuide } from './MinorWorkGuide';
import { Compass, Hammer } from 'lucide-react';

export const ZoningModule = () => {
  const [activeTab, setActiveTab] = useState('simulador');

  return (
    <div style={{ marginTop: '2.5rem', paddingTop: '2rem', borderTop: '2px solid var(--border)' }}>
      
      {/* Encabezado */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
        <div>
          <span style={{ fontSize: '0.75rem', fontWeight: '800', color: '#002B7F', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Autogestión Urbanística & Comercial
          </span>
          <h2 style={{ fontSize: '1.45rem', fontWeight: '900', color: 'var(--text-main)', margin: '0.2rem 0 0 0' }}>
            Uso de Suelo & Guía de Obra Menor
          </h2>
        </div>

        <div style={{ display: 'flex', gap: '0.4rem' }}>
          <button
            onClick={() => setActiveTab('simulador')}
            style={{
              padding: '0.45rem 0.85rem',
              fontSize: '0.82rem',
              fontWeight: '700',
              borderRadius: '4px',
              border: activeTab === 'simulador' ? '1px solid #002B7F' : '1px solid var(--border)',
              backgroundColor: activeTab === 'simulador' ? '#002B7F' : 'var(--surface-subtle)',
              color: activeTab === 'simulador' ? '#FFFFFF' : 'var(--text-main)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem'
            }}
          >
            <Compass size={15} /> Viabilidad de Uso de Suelo
          </button>

          <button
            onClick={() => setActiveTab('obras')}
            style={{
              padding: '0.45rem 0.85rem',
              fontSize: '0.82rem',
              fontWeight: '700',
              borderRadius: '4px',
              border: activeTab === 'obras' ? '1px solid #002B7F' : '1px solid var(--border)',
              backgroundColor: activeTab === 'obras' ? '#002B7F' : 'var(--surface-subtle)',
              color: activeTab === 'obras' ? '#FFFFFF' : 'var(--text-main)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem'
            }}
          >
            <Hammer size={15} /> Requisitos de Obra Menor
          </button>
        </div>
      </div>

      {activeTab === 'simulador' ? <ZoningSimulator /> : <MinorWorkGuide />}

    </div>
  );
};