import { useState, useEffect } from 'react';
import { PhoneCall, ShieldAlert, HeartPulse, Droplet, Zap, Users, ChevronDown, ChevronUp } from 'lucide-react';
import { getEmergencyContacts } from '../services/api';

export const EmergencyBanner = () => {
  const [contacts, setContacts] = useState([]);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    getEmergencyContacts()
      .then(data => setContacts(data || []))
      .catch(() => {});
  }, []);

  const getIcon = (type) => {
    switch (type) {
      case 'policia': return <ShieldAlert size={18} color="#002B7F" />;
      case 'salud': return <HeartPulse size={18} color="#DC2626" />;
      case 'agua': return <Droplet size={18} color="#0284C7" />;
      case 'luz': return <Zap size={18} color="#D97706" />;
      default: return <Users size={18} color="#059669" />;
    }
  };

  return (
    <section style={{
      backgroundColor: '#0F172A',
      color: '#FFFFFF',
      borderTop: '3px solid #CE1126',
      padding: '1.25rem 1rem',
      marginTop: '3rem'
    }}>
      <div className="stitch-container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div style={{ backgroundColor: '#CE1126', padding: '0.45rem', borderRadius: '4px', display: 'flex' }}>
              <PhoneCall size={20} color="#FFFFFF" />
            </div>
            <div>
              <strong style={{ fontSize: '1rem', display: 'block', letterSpacing: '0.3px' }}>
                Directorio Rápido de Emergencias & Cuadrantes
              </strong>
              <span style={{ fontSize: '0.78rem', color: '#94A3B8' }}>
                Enlace directo con la Delegación, EBAIS, Cuadrillas AyA / CNFL y Comité ADI
              </span>
            </div>
          </div>

          <button
            onClick={() => setExpanded(!expanded)}
            style={{
              backgroundColor: 'transparent',
              color: '#FDE047',
              border: '1px solid #334155',
              padding: '0.4rem 0.85rem',
              borderRadius: '4px',
              fontSize: '0.8rem',
              fontWeight: '700',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem'
            }}
          >
            <span>{expanded ? 'Ocultar Cuadrantes' : 'Ver Líneas de Emergencia'}</span>
            {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
        </div>

        {/* Panel Desplegable con los contactos */}
        {expanded && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '0.85rem',
            marginTop: '1.25rem',
            paddingTop: '1rem',
            borderTop: '1px solid #1E293B'
          }}>
            {contacts.map(item => (
              <div
                key={item.id}
                style={{
                  backgroundColor: '#1E293B',
                  padding: '0.85rem',
                  borderRadius: '6px',
                  border: '1px solid #334155',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: '0.5rem'
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.35rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      {getIcon(item.type)}
                      <span style={{ fontSize: '0.7rem', fontWeight: '800', color: '#94A3B8', textTransform: 'uppercase' }}>
                        {item.badge}
                      </span>
                    </div>
                  </div>
                  <strong style={{ fontSize: '0.88rem', color: '#FFFFFF', display: 'block', lineHeight: 1.25 }}>
                    {item.entity}
                  </strong>
                  <span style={{ fontSize: '0.74rem', color: '#64748B', display: 'block', marginTop: '0.2rem' }}>
                    {item.location}
                  </span>
                </div>

                <a
                  href={`tel:${item.phone.replace(/[^0-9]/g, '')}`}
                  style={{
                    backgroundColor: '#002B7F',
                    color: '#FFFFFF',
                    textAlign: 'center',
                    padding: '0.45rem',
                    borderRadius: '4px',
                    fontSize: '0.82rem',
                    fontWeight: '800',
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.4rem',
                    marginTop: '0.3rem'
                  }}
                >
                  <PhoneCall size={13} /> {item.phone}
                </a>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};