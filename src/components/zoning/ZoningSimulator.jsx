import { useState, useEffect } from 'react';
import { getZoningRules } from '../../services/api';
import { CheckCircle2, AlertCircle, FileText, ArrowRight, RotateCcw } from 'lucide-react';

export const ZoningSimulator = () => {
  const [rules, setRules] = useState([]);
  const [sector, setSector] = useState('San Juan Centro');
  const [activity, setActivity] = useState('Alimentación / Sodas');
  const [result, setResult] = useState(null);

  useEffect(() => {
    getZoningRules().then(data => setRules(data || [])).catch(() => {});
  }, []);

  const handleEvaluate = (e) => {
    e.preventDefault();
    const matched = rules.find(r => r.sector === sector);
    if (!matched) return;

    const isAllowed = matched.allowedActivities.some(act => 
      act.toLowerCase().includes(activity.toLowerCase()) || activity.toLowerCase().includes(act.toLowerCase())
    );

    setResult({
      sector: matched.sector,
      zoneType: matched.zoneType,
      isAllowed,
      activity,
      restrictions: matched.restrictions,
      requirements: matched.requirements
    });
  };

  const handleReset = () => {
    setResult(null);
  };

  return (
    <div style={{ backgroundColor: 'var(--surface)', padding: '1.25rem', borderRadius: '6px', border: '1px solid var(--border)' }}>
      <div style={{ marginBottom: '1rem' }}>
        <strong style={{ fontSize: '1rem', color: '#002B7F', display: 'block' }}>
          Simulador de Viabilidad de Uso de Suelo Comercial
        </strong>
        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          Consulte al instante si la actividad económica que desea emprender es apta para su sector.
        </span>
      </div>

      {!result ? (
        <form onSubmit={handleEvaluate} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.85rem', alignItems: 'flex-end' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: '700', marginBottom: '0.25rem' }}>Sector Distrital</label>
            <select
              value={sector}
              onChange={e => setSector(e.target.value)}
              style={{ width: '100%', padding: '0.55rem', fontSize: '0.85rem', borderRadius: '4px', border: '1px solid var(--border)', backgroundColor: 'var(--surface-subtle)', color: 'var(--text-main)' }}
            >
              <option value="San Juan Centro">San Juan Centro</option>
              <option value="Sector Itaipú & Calabacitas">Sector Itaipú & Calabacitas</option>
              <option value="Sector Pedrito Monge">Sector Pedrito Monge</option>
              <option value="Sector Calle Máquinas">Sector Calle Máquinas</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: '700', marginBottom: '0.25rem' }}>Actividad Deseada</label>
            <select
              value={activity}
              onChange={e => setActivity(e.target.value)}
              style={{ width: '100%', padding: '0.55rem', fontSize: '0.85rem', borderRadius: '4px', border: '1px solid var(--border)', backgroundColor: 'var(--surface-subtle)', color: 'var(--text-main)' }}
            >
              <option value="Alimentación / Sodas">Alimentación / Panadería / Sodas</option>
              <option value="Pulperías / Abastecedores">Pulpería / Minisúper / Abarrotes</option>
              <option value="Comercio General">Comercio General / Bazar</option>
              <option value="Barberías / Salones de Belleza">Barbería / Salón de Belleza</option>
              <option value="Talleres Mecánicos">Taller Mecánico / Automotriz</option>
            </select>
          </div>

          <button
            type="submit"
            style={{
              padding: '0.6rem 1.25rem',
              backgroundColor: '#002B7F',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '4px',
              fontWeight: '800',
              fontSize: '0.85rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.35rem'
            }}
          >
            <span>Evaluar Viabilidad</span>
            <ArrowRight size={15} />
          </button>
        </form>
      ) : (
        <div style={{
          padding: '1.25rem',
          borderRadius: '6px',
          border: `2px solid ${result.isAllowed ? '#059669' : '#DC2626'}`,
          backgroundColor: result.isAllowed ? 'rgba(5, 150, 105, 0.06)' : 'rgba(220, 38, 38, 0.06)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              {result.isAllowed ? <CheckCircle2 size={24} color="#059669" /> : <AlertCircle size={24} color="#DC2626" />}
              <div>
                <strong style={{ fontSize: '1.05rem', color: result.isAllowed ? '#059669' : '#DC2626' }}>
                  {result.isAllowed ? 'VIABILIDAD FAVORABLE (APTA)' : 'VIABILIDAD CONDICIONADA O RESTRINGIDA'}
                </strong>
                <span style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  Zonificación: {result.zoneType} ({result.sector})
                </span>
              </div>
            </div>

            <button
              onClick={handleReset}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.3rem',
                padding: '0.35rem 0.65rem',
                fontSize: '0.75rem',
                fontWeight: '700',
                border: '1px solid var(--border)',
                borderRadius: '4px',
                background: 'var(--surface)',
                cursor: 'pointer'
              }}
            >
              <RotateCcw size={13} /> Nueva Consulta
            </button>
          </div>

          <div style={{ fontSize: '0.84rem', lineHeight: 1.5, color: 'var(--text-main)' }}>
            <div style={{ marginBottom: '0.5rem' }}>
              <strong>Restricciones de la Zona:</strong> {result.restrictions}
            </div>
            <div>
              <strong>Requisitos Formales para la ADI:</strong>
              <ul style={{ margin: '0.35rem 0 0 1.25rem', padding: 0 }}>
                {result.requirements.map((req, idx) => (
                  <li key={idx}>{req}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};