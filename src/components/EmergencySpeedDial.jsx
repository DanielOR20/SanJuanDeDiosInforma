import React, { useState } from 'react';
import { Phone, AlertCircle, Shield, X, Zap, Flame, Droplets } from 'lucide-react';

export default function EmergencySpeedDial() {
  const [isOpen, setIsOpen] = useState(false);

  const CONTACTS = [
    { name: 'Delegación Policial (SJD)', phone: '22504112', icon: Shield, color: '#1E3A8A' },
    { name: 'Cruz Roja Desamparados', phone: '22596411', icon: AlertCircle, color: '#DC2626' },
    { name: 'Bomberos Emergencias', phone: '911', icon: Flame, color: '#EA580C' },
    { name: 'AyA Fugas y Averías', phone: '8007376783', icon: Droplets, color: '#0284C7' },
    { name: 'CNFL Averías Eléctricas', phone: '1026', icon: Zap, color: '#D97706' },
  ];

  return (
    <div style={{ position: 'fixed', bottom: '2rem', right: '2rem', zIndex: 9999, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '1rem' }}>
      
      {isOpen && (
        <div style={{ 
          backgroundColor: 'white', 
          borderRadius: '16px', 
          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.3)',
          padding: '1rem',
          width: '280px',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem',
          animation: 'slideUpFade 0.2s ease-out'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem', borderBottom: '1px solid #E2E8F0', paddingBottom: '0.5rem' }}>
            <h3 style={{ margin: 0, fontSize: '0.95rem', fontWeight: '900', color: '#0F172A', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <AlertCircle size={16} color="#DC2626" /> Emergencias
            </h3>
            <button onClick={() => setIsOpen(false)} style={{ background: 'none', border: 'none', color: '#64748B', cursor: 'pointer', display: 'flex' }}>
              <X size={18} />
            </button>
          </div>
          
          {CONTACTS.map((c, i) => (
            <a 
              key={i} 
              href={`tel:${c.phone}`}
              style={{
                display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem', borderRadius: '8px',
                textDecoration: 'none', color: '#334155', backgroundColor: '#F8FAFC', transition: 'background-color 0.2s'
              }}
              onMouseOver={e => e.currentTarget.style.backgroundColor = '#F1F5F9'}
              onMouseOut={e => e.currentTarget.style.backgroundColor = '#F8FAFC'}
            >
              <div style={{ backgroundColor: c.color, color: 'white', padding: '0.4rem', borderRadius: '50%', display: 'flex' }}>
                <c.icon size={16} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '0.8rem', fontWeight: '800', marginBottom: '0.1rem' }}>{c.name}</div>
                <div style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: '600' }}>{c.phone}</div>
              </div>
              <Phone size={14} color="#94A3B8" />
            </a>
          ))}
        </div>
      )}

      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          backgroundColor: '#DC2626',
          color: 'white',
          border: 'none',
          width: '64px',
          height: '64px',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          boxShadow: '0 10px 15px -3px rgba(220, 38, 38, 0.4)',
          transition: 'transform 0.2s',
          transform: isOpen ? 'rotate(45deg)' : 'rotate(0)'
        }}
      >
        {isOpen ? <X size={28} /> : <Phone size={28} fill="white" />}
      </button>

      <style>{`
        @keyframes slideUpFade {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
