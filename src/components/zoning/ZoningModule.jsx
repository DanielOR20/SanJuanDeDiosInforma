import { useState } from 'react';
import { ZoningSimulator } from './ZoningSimulator';
import { MinorWorkGuide } from './MinorWorkGuide';
import { Compass, Hammer } from 'lucide-react';

export const ZoningModule = () => {
  const [activeTab, setActiveTab] = useState('simulador');

  return (
    <div className="stitch-card" style={{ padding: '2rem', borderRadius: '8px', border: '1px solid var(--border)', marginTop: '3rem', width: '100%' }}>
      
      {/* Encabezado */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
        <div>
          <span style={{ fontSize: '0.75rem', fontWeight: '800', color: '#002B7F', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Autogestión Urbanística & Comercial
          </span>
          <h2 style={{ fontSize: '1.45rem', fontWeight: '900', color: 'var(--text-main)', margin: '0.2rem 0 0 0' }}>
            Uso de Suelo & Guía de Obra Menor
          </h2>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            onClick={() => setActiveTab('simulador')}
            style={{
              padding: '0.5rem 1rem',
              fontSize: '0.82rem',
              fontWeight: '700',
              borderRadius: '4px',
              border: '1px solid',
              borderColor: activeTab === 'simulador' ? '#002B7F' : 'var(--border)',
              backgroundColor: activeTab === 'simulador' ? '#002B7F' : '#FFFFFF',
              color: activeTab === 'simulador' ? '#FFFFFF' : 'var(--text-main)',
              boxShadow: activeTab === 'simulador' ? '0 2px 4px rgba(0,43,127,0.2)' : 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              transition: 'all 0.2s ease-in-out'
            }}
          >
            <Compass size={15} /> Viabilidad de Uso de Suelo
          </button>

          <button
            onClick={() => setActiveTab('obras')}
            style={{
              padding: '0.5rem 1rem',
              fontSize: '0.82rem',
              fontWeight: '700',
              borderRadius: '4px',
              border: '1px solid',
              borderColor: activeTab === 'obras' ? '#002B7F' : 'var(--border)',
              backgroundColor: activeTab === 'obras' ? '#002B7F' : '#FFFFFF',
              color: activeTab === 'obras' ? '#FFFFFF' : 'var(--text-main)',
              boxShadow: activeTab === 'obras' ? '0 2px 4px rgba(0,43,127,0.2)' : 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              transition: 'all 0.2s ease-in-out'
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