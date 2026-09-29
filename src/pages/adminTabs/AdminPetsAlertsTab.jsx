import React, { useState, useEffect } from 'react';
import { getCommunityPets, deleteCommunityPet, getEmergencyAlerts, toggleEmergencyAlert } from '../../services/api';
import { Heart, Trash2, AlertTriangle, Power } from 'lucide-react';

export default function AdminPetsAlertsTab() {
  const [pets, setPets] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const [petsData, alertsData] = await Promise.all([
        getCommunityPets(),
        getEmergencyAlerts()
      ]);
      setPets(petsData);
      setAlerts(alertsData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDeletePet = async (id) => {
    if (!window.confirm('¿Confirmar que la mascota ya fue recuperada/adoptada y eliminar el reporte?')) return;
    try {
      await deleteCommunityPet(id);
      loadData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleAlert = async (id, currentActive) => {
    try {
      await toggleEmergencyAlert(id, !currentActive);
      loadData();
    } catch (err) {
      console.error(err);
    }
  };

  const mainAlert = alerts.find(a => a.id === "1") || alerts[0];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* SECCIÓN 1: SIRENA VECINAL */}
      <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <h2 style={{ color: '#002B7F', margin: '0 0 1rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <AlertTriangle size={24} /> Sistema de Alerta Cívica (Sirena)
        </h2>
        <p style={{ color: '#475569', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
          Activa o desactiva el banner rojo global en el portal. Úsalo solo para comunicados urgentes del Comité Municipal de Emergencias (Ej. Crecida de ríos, Cierre de vías).
        </p>

        {mainAlert ? (
          <div style={{ 
            border: `2px solid ${mainAlert.active ? '#DC2626' : '#CBD5E1'}`, 
            borderRadius: '8px', 
            padding: '1.5rem',
            backgroundColor: mainAlert.active ? '#FEF2F2' : '#F8FAFC',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem'
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: mainAlert.active ? '#DC2626' : '#94A3B8', animation: mainAlert.active ? 'pulse 2s infinite' : 'none' }}></div>
                <h3 style={{ margin: 0, color: mainAlert.active ? '#991B1B' : '#64748B' }}>
                  {mainAlert.active ? 'ALERTA ACTIVADA A NIVEL DISTRITAL' : 'SISTEMA EN ESPERA (INACTIVO)'}
                </h3>
              </div>
              <strong style={{ fontSize: '1.1rem', display: 'block', color: '#0F172A' }}>{mainAlert.title}</strong>
              <p style={{ margin: '0.25rem 0 0 0', color: '#334155' }}>{mainAlert.message}</p>
            </div>
            
            <button
              onClick={() => handleToggleAlert(mainAlert.id, mainAlert.active)}
              style={{
                backgroundColor: mainAlert.active ? '#DC2626' : '#059669',
                color: 'white',
                border: 'none',
                padding: '0.75rem 1.5rem',
                borderRadius: '99px',
                fontWeight: '900',
                fontSize: '1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                cursor: 'pointer',
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
              }}
            >
              <Power size={20} />
              {mainAlert.active ? 'APAGAR SIRENA' : 'ACTIVAR ALERTA GENERAL'}
            </button>
          </div>
        ) : (
          <p>Cargando configuración de emergencias...</p>
        )}
      </div>

      {/* SECCIÓN 2: MASCOTAS COMUNITARIAS */}
      <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <h2 style={{ color: '#059669', margin: '0 0 1.5rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Heart size={24} /> Auditoría de Mascotas (Huellitas)
        </h2>
        
        {loading ? (
          <p>Cargando reportes...</p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
            {pets.map(pet => (
              <div key={pet.id} style={{ border: '1px solid #CBD5E1', borderRadius: '8px', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                <div style={{ height: '140px', backgroundColor: '#F1F5F9', position: 'relative' }}>
                  <img src={pet.imageUrl} alt={pet.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <div style={{ position: 'absolute', top: '10px', right: '10px', backgroundColor: 'rgba(0,0,0,0.7)', color: 'white', padding: '0.25rem 0.6rem', borderRadius: '99px', fontSize: '0.75rem', fontWeight: 'bold' }}>
                    {pet.status.toUpperCase()}
                  </div>
                </div>
                <div style={{ padding: '1rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <h3 style={{ margin: '0 0 0.25rem 0', fontSize: '1.1rem', color: '#0F172A' }}>{pet.name}</h3>
                  <div style={{ fontSize: '0.85rem', color: '#64748B', marginBottom: '1rem' }}>
                    Sector: {pet.sector} <br/>
                    Reportado por: {pet.contactName}
                  </div>
                  <button 
                    onClick={() => handleDeletePet(pet.id)}
                    style={{ marginTop: 'auto', backgroundColor: '#FEF2F2', color: '#DC2626', border: '1px solid #FECACA', padding: '0.6rem', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', fontWeight: 'bold' }}
                  >
                    <Trash2 size={16} /> Marcar como Resuelto / Eliminar
                  </button>
                </div>
              </div>
            ))}
            {pets.length === 0 && (
              <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '2rem', color: '#64748B' }}>
                No hay reportes de mascotas activos.
              </div>
            )}
          </div>
        )}
      </div>

    </div>
  );
}
