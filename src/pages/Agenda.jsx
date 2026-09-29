import React, { useState, useEffect } from 'react';
import { getBusRoutesLared, getDistrictSchedule } from '../services/api';
import { Bus, MapPin, Clock, Phone, Calendar as CalendarIcon, Filter } from 'lucide-react';

export const Agenda = () => {
  const [routes, setRoutes] = useState([]);
  const [schedule, setSchedule] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('L-01');
  const [filter, setFilter] = useState('Todos');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const loadData = async () => {
      try {
        const [rData, sData] = await Promise.all([
          getBusRoutesLared(),
          getDistrictSchedule()
        ]);
        setRoutes(rData);
        setSchedule(sData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const activeRoute = routes.find(r => r.code === activeTab);
  
  const filteredSchedule = schedule.filter(s => {
    const matchesFilter = filter === 'Todos' || s.category === filter;
    const matchesSearch = s.title.toLowerCase().includes(searchTerm.toLowerCase()) || s.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  if (loading) return <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>Cargando datos distritales...</div>;

  return (
    <div className="stitch-container" style={{ padding: '2rem 1rem' }}>
      
      {/* SECCIÓN SUPERIOR: TERMINAL DE MOVILIDAD */}
      <div style={{ marginBottom: '3rem' }}>
        <h1 style={{ color: 'var(--primary)', margin: '0 0 1.5rem 0', display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '1.8rem', fontWeight: '900' }}>
          <Bus size={32} /> Terminal de Movilidad Distrital
        </h1>

        <div className="stitch-card" style={{ overflow: 'hidden' }}>
          <div style={{ backgroundColor: 'var(--primary)', color: 'white', padding: '1rem 1.5rem', fontWeight: 'bold' }}>
            Rutas Oficiales de Transporte Público - Empresa Lared Protur S.A.
          </div>
          
          <div style={{ display: 'flex', borderBottom: '1px solid var(--border)' }}>
            {routes.map(r => (
              <button 
                key={r.code}
                onClick={() => setActiveTab(r.code)}
                style={{
                  flex: 1,
                  padding: '1rem',
                  backgroundColor: activeTab === r.code ? 'white' : 'var(--surface-subtle)',
                  border: 'none',
                  borderBottom: activeTab === r.code ? '3px solid var(--primary)' : '3px solid transparent',
                  fontWeight: 'bold',
                  color: activeTab === r.code ? 'var(--primary)' : 'var(--text-muted)',
                  cursor: 'pointer',
                  fontSize: '0.9rem'
                }}
              >
                {r.code} {r.name.split(' - ')[1]}
              </button>
            ))}
          </div>

          {activeRoute && (
            <div style={{ padding: '2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
                <div>
                  <div style={{ display: 'inline-block', backgroundColor: 'var(--primary)', color: 'white', padding: '0.4rem 0.75rem', borderRadius: '4px', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                    {activeRoute.code}
                  </div>
                  <h2 style={{ margin: '0 0 0.5rem 0', color: 'var(--text-main)', fontSize: '1.5rem' }}>{activeRoute.name}</h2>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{activeRoute.operator}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 'bold' }}>Tarifa Oficial</div>
                  <div style={{ fontSize: '2rem', fontWeight: '900', color: '#059669' }}>{activeRoute.fare}</div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
                <div style={{ backgroundColor: 'var(--surface-subtle)', padding: '1.5rem', borderRadius: '8px', border: '1px solid var(--border)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary)', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                    <Clock size={18} /> Horarios de Salida
                  </div>
                  <div style={{ fontSize: '0.9rem', color: 'var(--text-main)', marginBottom: '0.25rem' }}>Primer bus: <strong>{activeRoute.firstBus}</strong></div>
                  <div style={{ fontSize: '0.9rem', color: 'var(--text-main)' }}>Último bus: <strong>{activeRoute.lastBus}</strong></div>
                </div>
                <div style={{ backgroundColor: 'var(--surface-subtle)', padding: '1.5rem', borderRadius: '8px', border: '1px solid var(--border)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary)', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                    <Bus size={18} /> Frecuencias
                  </div>
                  <div style={{ fontSize: '0.9rem', color: 'var(--text-main)', marginBottom: '0.25rem' }}>Hora pico: <strong>{activeRoute.peakFrequency}</strong></div>
                  <div style={{ fontSize: '0.9rem', color: 'var(--text-main)' }}>Regular: <strong>{activeRoute.regularFrequency}</strong></div>
                </div>
              </div>

              <div style={{ marginBottom: '2rem' }}>
                <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.1rem', color: 'var(--text-main)' }}>Recorrido y Paradas Clave</h3>
                <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {activeRoute.stopsKey.map((stop, i) => (
                    <React.Fragment key={i}>
                      <span style={{ backgroundColor: '#E2E8F0', padding: '0.4rem 0.8rem', borderRadius: '99px', fontSize: '0.85rem', color: 'var(--text-main)', fontWeight: 'bold' }}>
                        {stop}
                      </span>
                      {i < activeRoute.stopsKey.length - 1 && <span style={{ color: '#94A3B8' }}>➔</span>}
                    </React.Fragment>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <a href={`tel:${activeRoute.phone}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', backgroundColor: '#002B7F', color: 'white', padding: '0.75rem 1.5rem', borderRadius: '6px', textDecoration: 'none', fontWeight: 'bold', border: 'none', cursor: 'pointer' }}>
                  <Phone size={18} /> Quejas o Consultas a Lared
                </a>
                <a href={`https://wa.me/${activeRoute.phone.replace(/[^0-9]/g, '')}`} target="_blank" rel="noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', backgroundColor: '#25D366', color: 'white', padding: '0.75rem 1.5rem', borderRadius: '6px', textDecoration: 'none', fontWeight: 'bold', border: 'none', cursor: 'pointer' }}>
                  WhatsApp Lared
                </a>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* SECCIÓN INFERIOR: CRONOGRAMA DISTRITAL */}
      <div>
        <h1 style={{ color: 'var(--primary)', margin: '0 0 1.5rem 0', display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '1.8rem', fontWeight: '900' }}>
          <CalendarIcon size={32} /> Cronograma Comunal & Trámites
        </h1>

        <div className="stitch-card" style={{ padding: '1.5rem', marginBottom: '2rem', display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
          <input 
            type="text" 
            placeholder="Buscar evento o trámite..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ flex: '1 1 300px', padding: '0.75rem', borderRadius: '6px', border: '1px solid var(--border)', fontSize: '0.95rem' }}
          />
          <select 
            value={filter} 
            onChange={e => setFilter(e.target.value)}
            style={{ flex: '1 1 150px', padding: '0.75rem', borderRadius: '6px', border: '1px solid var(--border)', backgroundColor: 'white', fontSize: '0.95rem' }}
          >
            <option value="Todos">Todas las Categorías</option>
            <option value="Concejo & ADI">Concejo & ADI</option>
            <option value="Ambiental">Ambiental</option>
            <option value="Salud">Salud</option>
          </select>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {filteredSchedule.map(s => {
            const dateObj = new Date(s.date + 'T00:00:00');
            const day = dateObj.getDate().toString().padStart(2, '0');
            const monthNames = ['ENE', 'FEB', 'MAR', 'ABR', 'MAY', 'JUN', 'JUL', 'AGO', 'SEP', 'OCT', 'NOV', 'DIC'];
            const month = monthNames[dateObj.getMonth()];

            return (
              <div key={s.id} className="stitch-card" style={{ display: 'flex', overflow: 'hidden' }}>
                {/* Date Block */}
                <div style={{ backgroundColor: 'var(--primary)', color: 'white', padding: '1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minWidth: '100px' }}>
                  <div style={{ fontSize: '2.5rem', fontWeight: '900', lineHeight: 1 }}>{day}</div>
                  <div style={{ fontSize: '1.2rem', fontWeight: '700', letterSpacing: '1px' }}>{month}</div>
                </div>
                
                {/* Content Block */}
                <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '0.5rem' }}>
                    <h2 style={{ margin: 0, fontSize: '1.3rem', color: 'var(--text-main)', fontWeight: '800' }}>{s.title}</h2>
                    <span style={{ backgroundColor: '#ECFDF5', color: '#059669', padding: '0.3rem 0.6rem', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 'bold' }}>
                      {s.status}
                    </span>
                  </div>
                  
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <Clock size={16} /> {s.time}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <MapPin size={16} /> {s.location}
                    </div>
                  </div>
                  
                  <p style={{ margin: '0 0 1.5rem 0', color: 'var(--text-main)', fontSize: '0.95rem' }}>{s.description}</p>
                  
                  <div style={{ marginTop: 'auto' }}>
                    <button style={{ backgroundColor: 'var(--surface-subtle)', color: 'var(--text-main)', border: '1px solid var(--border)', padding: '0.5rem 1rem', borderRadius: '4px', fontWeight: '700', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                      <CalendarIcon size={16} /> Agregar a mi Calendario
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
          {filteredSchedule.length === 0 && (
            <div style={{ textAlign: 'center', padding: '3rem', backgroundColor: 'var(--surface-subtle)', borderRadius: '8px', color: 'var(--text-muted)' }}>
              No se encontraron eventos en el cronograma distrital.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};