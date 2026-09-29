import React, { useState } from 'react';
import { FileSpreadsheet, Save, UploadCloud } from 'lucide-react';

export default function AdminActasTab() {
  const [budgetData, setBudgetData] = useState({
    total: 25000000,
    executed: 18500000,
    period: 'Q3 2026'
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleBudgetSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    // Simulated API call
    setTimeout(() => {
      setLoading(false);
      setMessage('Presupuesto actualizado correctamente.');
      setTimeout(() => setMessage(''), 3000);
    }, 1000);
  };

  const handleFileUpload = (e) => {
    e.preventDefault();
    setLoading(true);
    // Simulated API call
    setTimeout(() => {
      setLoading(false);
      setMessage('Acta subida y publicada en el Portal de Transparencia.');
      setTimeout(() => setMessage(''), 3000);
    }, 1000);
  };

  return (
    <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
      <h2 style={{ color: '#002B7F', margin: '0 0 1.5rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <FileSpreadsheet size={24} /> Presupuesto y Actas
      </h2>

      {message && (
        <div style={{ backgroundColor: '#ECFDF5', border: '1px solid #10B981', color: '#065F46', padding: '1rem', borderRadius: '6px', marginBottom: '1.5rem' }}>
          {message}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        
        {/* Actualizar Presupuesto */}
        <div style={{ border: '1px solid #CBD5E1', padding: '1.5rem', borderRadius: '8px', backgroundColor: '#F8FAFC' }}>
          <h3 style={{ margin: '0 0 1rem 0', color: '#0F172A', fontSize: '1.1rem' }}>Actualizar Ejecución Presupuestaria</h3>
          <form onSubmit={handleBudgetSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.25rem', fontWeight: 'bold', fontSize: '0.85rem' }}>Período</label>
              <input 
                type="text" 
                value={budgetData.period}
                onChange={e => setBudgetData({...budgetData, period: e.target.value})}
                style={{ width: '100%', padding: '0.6rem', borderRadius: '4px', border: '1px solid #CBD5E1' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.25rem', fontWeight: 'bold', fontSize: '0.85rem' }}>Presupuesto Total (₡)</label>
              <input 
                type="number" 
                value={budgetData.total}
                onChange={e => setBudgetData({...budgetData, total: Number(e.target.value)})}
                style={{ width: '100%', padding: '0.6rem', borderRadius: '4px', border: '1px solid #CBD5E1' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.25rem', fontWeight: 'bold', fontSize: '0.85rem' }}>Monto Ejecutado (₡)</label>
              <input 
                type="number" 
                value={budgetData.executed}
                onChange={e => setBudgetData({...budgetData, executed: Number(e.target.value)})}
                style={{ width: '100%', padding: '0.6rem', borderRadius: '4px', border: '1px solid #CBD5E1' }}
              />
            </div>
            <button disabled={loading} style={{ backgroundColor: '#002B7F', color: 'white', padding: '0.6rem', borderRadius: '4px', border: 'none', fontWeight: 'bold', cursor: loading ? 'not-allowed' : 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
              <Save size={18} /> Guardar Presupuesto
            </button>
          </form>
        </div>

        {/* Subir Actas */}
        <div style={{ border: '1px solid #CBD5E1', padding: '1.5rem', borderRadius: '8px', backgroundColor: '#F8FAFC' }}>
          <h3 style={{ margin: '0 0 1rem 0', color: '#0F172A', fontSize: '1.1rem' }}>Cargar Nueva Acta Distrital</h3>
          <form onSubmit={handleFileUpload} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.25rem', fontWeight: 'bold', fontSize: '0.85rem' }}>Título / Número de Acta</label>
              <input 
                type="text" 
                required
                placeholder="Ej. ACTA-ORD-2026-19"
                style={{ width: '100%', padding: '0.6rem', borderRadius: '4px', border: '1px solid #CBD5E1' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.25rem', fontWeight: 'bold', fontSize: '0.85rem' }}>Fecha de Sesión</label>
              <input 
                type="date" 
                required
                style={{ width: '100%', padding: '0.6rem', borderRadius: '4px', border: '1px solid #CBD5E1' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.25rem', fontWeight: 'bold', fontSize: '0.85rem' }}>Archivo PDF</label>
              <input 
                type="file" 
                accept=".pdf"
                required
                style={{ width: '100%', padding: '0.6rem', borderRadius: '4px', border: '1px solid #CBD5E1', backgroundColor: 'white' }}
              />
            </div>
            <button disabled={loading} style={{ backgroundColor: '#059669', color: 'white', padding: '0.6rem', borderRadius: '4px', border: 'none', fontWeight: 'bold', cursor: loading ? 'not-allowed' : 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
              <UploadCloud size={18} /> Subir y Publicar Acta
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}
