import React, { useState, useEffect } from 'react';
import { AlertTriangle, Clock } from 'lucide-react';
import { getEmergencyAlerts } from '../services/api';

export default function EmergencyBanner() {
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    const loadAlerts = async () => {
      try {
        const data = await getEmergencyAlerts();
        setAlerts(data.filter(a => a.active));
      } catch (err) {
        console.error('Error fetching alerts:', err);
      }
    };
    loadAlerts();
    // In a real app this would poll or use websockets, here we check once on mount
    const interval = setInterval(loadAlerts, 30000);
    return () => clearInterval(interval);
  }, []);

  if (alerts.length === 0) return null;

  return (
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', zIndex: 50 }}>
      {alerts.map(alert => (
        <div key={alert.id} style={{ 
          backgroundColor: alert.level === 'danger' ? '#DC2626' : '#D97706',
          color: 'white',
          padding: '0.75rem 1rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '1rem',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
        }}>
          <AlertTriangle size={24} style={{ flexShrink: 0, animation: 'pulse 2s infinite' }} />
          <div style={{ flex: 1, maxWidth: '1200px' }}>
            <h4 style={{ margin: '0 0 0.15rem 0', fontSize: '1rem', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              ALERTA OFICIAL: {alert.title}
            </h4>
            <p style={{ margin: 0, fontSize: '0.9rem', opacity: 0.95, lineHeight: 1.4 }}>
              {alert.message}
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.8rem', fontWeight: 'bold', flexShrink: 0, opacity: 0.9 }}>
            <Clock size={14} /> {alert.date}
          </div>
        </div>
      ))}
      <style>{`
        @keyframes pulse {
          0% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.15); opacity: 0.8; }
          100% { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
}