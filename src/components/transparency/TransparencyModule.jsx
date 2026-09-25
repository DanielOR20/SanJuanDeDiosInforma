import { useState, useEffect } from 'react';
import { getTransparencyData, getDistrictActs } from '../../services/api';
import { ActsList } from './ActsList';
import { ShieldCheck, PieChart, Users, FileText } from 'lucide-react';

export const TransparencyModule = () => {
  const [data, setData] = useState(null);
  const [acts, setActs] = useState([]);
  const [tab, setTab] = useState('actas');

  useEffect(() => {
    getTransparencyData().then(setData).catch(() => {});
    getDistrictActs().then(setActs).catch(() => {});
  }, []);

  if (!data) return null;

  const { financialSummary, boardMembers } = data;
  const executionPercent = Math.round((financialSummary.executedBudget / financialSummary.allocatedBudget) * 100);

  return (
    <section className="stitch-container" style={{ marginTop: '3rem', marginBottom: '3rem' }}>
      
      {/* Cabecera */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem', borderBottom: '2px solid var(--border)', paddingBottom: '0.85rem' }}>
        <div>
          <span style={{ fontSize: '0.75rem', fontWeight: '800', color: '#002B7F', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <ShieldCheck size={16} /> Rendición de Cuentas & Datos Abiertos
          </span>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '900', color: 'var(--text-main)', margin: '0.2rem 0 0 0' }}>
            Portal de Transparencia Distrital ADI
          </h2>
        </div>

        <div style={{ display: 'flex', gap: '0.4rem' }}>
          {[
            { id: 'actas', label: 'Actas del Concejo', icon: <FileText size={14} /> },
            { id: 'finanzas', label: 'Ejecución Presupuestaria', icon: <PieChart size={14} /> },
            { id: 'junta', label: 'Mesa Directiva', icon: <Users size={14} /> }
          ].map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                padding: '0.45rem 0.85rem',
                fontSize: '0.8rem',
                fontWeight: '700',
                borderRadius: '4px',
                border: tab === t.id ? '1px solid #002B7F' : '1px solid var(--border)',
                backgroundColor: tab === t.id ? '#002B7F' : 'var(--surface-subtle)',
                color: tab === t.id ? '#FFFFFF' : 'var(--text-main)',
                cursor: 'pointer'
              }}
            >
              {t.icon} {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Contenido según pestaña */}
      {tab === 'actas' && <ActsList acts={acts} />}

      {tab === 'finanzas' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
          <div className="stitch-card" style={{ padding: '1.25rem' }}>
            <span style={{ fontSize: '0.78rem', color: '#64748B', fontWeight: '800' }}>PERIODO FISCAL {financialSummary.quarter}</span>
            <h3 style={{ margin: '0.3rem 0 0.85rem 0', fontSize: '1.2rem', color: '#002B7F' }}>Estado de Fondos Comunales</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.88rem' }}>
              <div>Presupuesto Asignado: <strong>₡{financialSummary.allocatedBudget.toLocaleString()}</strong></div>
              <div>Fondos Ejecutados: <strong style={{ color: '#059669' }}>₡{financialSummary.executedBudget.toLocaleString()} ({executionPercent}%)</strong></div>
              <div>Disponible en Caja ADI: <strong>₡{financialSummary.remainingBudget.toLocaleString()}</strong></div>
            </div>
            
            {/* Barra de progreso */}
            <div style={{ height: '8px', backgroundColor: '#E2E8F0', borderRadius: '4px', overflow: 'hidden', marginTop: '1rem' }}>
              <div style={{ width: `${executionPercent}%`, height: '100%', backgroundColor: '#059669' }}></div>
            </div>
          </div>

          <div className="stitch-card" style={{ padding: '1.25rem' }}>
            <span style={{ fontSize: '0.78rem', color: '#64748B', fontWeight: '800' }}>DESTINO DE LOS FONDOS</span>
            <h3 style={{ margin: '0.3rem 0 0.85rem 0', fontSize: '1.2rem', color: 'var(--text-main)' }}>Obras Principales Financiadas</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              {financialSummary.mainInvestments.map((inv, idx) => (
                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border)', paddingBottom: '0.4rem', fontSize: '0.84rem' }}>
                  <span>{inv.concept}</span>
                  <strong style={{ color: '#002B7F' }}>₡{inv.amount.toLocaleString()}</strong>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {tab === 'junta' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
          {boardMembers.map(m => (
            <div key={m.id} className="stitch-card" style={{ padding: '1rem', borderTop: '3px solid #002B7F' }}>
              <span style={{ fontSize: '0.72rem', fontWeight: '800', color: '#002B7F', textTransform: 'uppercase' }}>{m.role}</span>
              <strong style={{ display: 'block', fontSize: '0.95rem', margin: '0.2rem 0', color: 'var(--text-main)' }}>{m.name}</strong>
              <div style={{ fontSize: '0.76rem', color: '#64748B' }}>Periodo: {m.period}</div>
              <div style={{ fontSize: '0.76rem', color: '#059669', marginTop: '0.3rem' }}>{m.contact}</div>
            </div>
          ))}
        </div>
      )}

    </section>
  );
};