import React from 'react';
import { Map, Users, Mountain, CalendarHeart, Milestone, MapPin, School } from 'lucide-react';
import { DistrictMapViewer } from '../components/DistrictMapViewer';

export default function AboutDistrict() {
  const metrics = [
    { title: 'Superficie', value: '2.98 km²', icon: Map, color: '#002B7F' },
    { title: 'Población', value: '22,049 hab.', subtext: '(5,397 viviendas)', icon: Users, color: '#059669' },
    { title: 'Altitud', value: '1,190 m s.n.m.', icon: Mountain, color: '#D97706' },
    { title: 'Fiestas Patronales', value: '8 de Marzo', subtext: 'Celebración de San Juan de Dios', icon: CalendarHeart, color: '#DC2626' }
  ];

  const timeline = [
    { year: '1786', title: 'El Molino Colonial', desc: 'Solicitud ante la Real Audiencia por el español Rodrigo de Calderón para instalar un molino de trigo en sus tres caballerías de tierra.' },
    { year: '1841', title: 'El Cuartel del Molino', desc: 'Asentamiento de don José Fallas Garbanzo y familias pioneras (Valverde, Mora, Zúñiga, Sotero González).' },
    { year: '1860', title: 'Origen de "Calle Las Máquinas"', desc: 'Fundación de tres aserraderos con sierras de cinta vertical por Pablo Días, Benedicto Valverde y Vicente Chacón.' },
    { year: '1877', title: 'Primera Ermita y Bautizo del Distrito', desc: 'Edificación de la ermita de madera por el mayordomo Rafael Abarca y el cura Matías Zavaleta, consolidando el nombre San Juan de Dios.' }
  ];

  const neighborhoods = [
    'Barrio Vasconia', 'Calabacitas', 'Calle De Los Robles', 'Calle Del Común',
    'Calle 17 de Octubre', 'Calle Máquinas', 'Calle Pedrito Monge', 'Cruz Roja',
    'Mota', 'Novedades', 'Río', 'Urb. Fuentes Este', 'Urb. Itaipú', 'Urb. La Elsa',
    'Urb. La Lucha', 'Urb. Sibaja'
  ];

  const institutions = [
    'Unidad Pedagógica Sotero González Barquero',
    'Jardín de Niños Sotero González Barquero',
    'Escuela Aruba',
    'CINDEA San Juan de Dios'
  ];

  return (
    <div style={{ backgroundColor: '#F8FAFC', minHeight: '100vh', paddingBottom: '4rem' }}>
      
      {/* HEADER BANNER */}
      <div style={{ 
        backgroundColor: '#002B7F', 
        color: 'white', 
        padding: '4rem 1rem',
        textAlign: 'center',
        backgroundImage: 'linear-gradient(to right, #002B7F, #1E3A8A)'
      }}>
        <div className="stitch-container">
          <h1 style={{ fontSize: '2.5rem', fontWeight: '900', margin: '0 0 1rem 0', textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>
            San Juan de Dios • Villa Distrital #03
          </h1>
          <p style={{ fontSize: '1.15rem', color: '#E2E8F0', maxWidth: '800px', margin: '0 auto', lineHeight: 1.5 }}>
            Historia, territorio, identidad comunal y raíces folclóricas de Desamparados.
          </p>
        </div>
      </div>

      <div className="stitch-container" style={{ padding: '0 1rem', marginTop: '-2rem' }}>
        
        {/* BLOQUE 1: MÉTRICAS */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '4rem' }}>
          {metrics.map((m, i) => (
            <div key={i} className="stitch-card" style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.5rem', borderBottom: `4px solid ${m.color}`, backgroundColor: 'white' }}>
              <div style={{ backgroundColor: `${m.color}15`, padding: '0.75rem', borderRadius: '50%', color: m.color, display: 'flex', flexShrink: 0 }}>
                <m.icon size={28} />
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: '0.85rem', color: '#64748B', textTransform: 'uppercase', fontWeight: '700' }}>{m.title}</h3>
                <div style={{ fontSize: '1.25rem', fontWeight: '900', color: '#0F172A', marginTop: '0.2rem' }}>{m.value}</div>
                {m.subtext && <div style={{ fontSize: '0.75rem', color: '#475569', marginTop: '0.1rem' }}>{m.subtext}</div>}
              </div>
            </div>
          ))}
        </div>

        {/* BLOQUE 2: LÍNEA DE TIEMPO */}
        <div style={{ marginBottom: '4rem', backgroundColor: 'white', padding: '2rem', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
          <h2 style={{ color: '#002B7F', fontSize: '1.5rem', fontWeight: '900', display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem', borderBottom: '2px solid #E2E8F0', paddingBottom: '1rem' }}>
            <Milestone size={28} /> Hitos Históricos
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {timeline.map((item, i) => (
              <div key={i} style={{ display: 'flex', gap: '1.5rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
                  <div style={{ backgroundColor: '#002B7F', color: 'white', fontWeight: '900', padding: '0.5rem 1rem', borderRadius: '99px', fontSize: '0.9rem', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                    {item.year}
                  </div>
                  {i !== timeline.length - 1 && (
                    <div style={{ width: '2px', flex: 1, backgroundColor: '#CBD5E1', marginTop: '0.5rem' }}></div>
                  )}
                </div>
                <div style={{ paddingBottom: i !== timeline.length - 1 ? '1.5rem' : '0' }}>
                  <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.25rem', fontWeight: '800', color: '#0F172A' }}>
                    {item.title}
                  </h3>
                  <p style={{ margin: 0, color: '#475569', lineHeight: 1.6, fontSize: '0.95rem' }}>
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* BLOQUE 3 Y 4: TERRITORIO Y EDUCACIÓN */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
          
          <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
            <h2 style={{ color: '#059669', fontSize: '1.25rem', fontWeight: '900', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', borderBottom: '2px solid #E2E8F0', paddingBottom: '1rem' }}>
              <MapPin size={24} /> Poblados y Sectores
            </h2>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {neighborhoods.map((n, i) => (
                <span key={i} style={{ backgroundColor: '#F1F5F9', color: '#334155', padding: '0.5rem 0.8rem', borderRadius: '6px', fontSize: '0.85rem', fontWeight: '600', border: '1px solid #E2E8F0' }}>
                  {n}
                </span>
              ))}
            </div>
          </div>

          <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
            <h2 style={{ color: '#D97706', fontSize: '1.25rem', fontWeight: '900', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', borderBottom: '2px solid #E2E8F0', paddingBottom: '1rem' }}>
              <School size={24} /> Centros Educativos
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {institutions.map((inst, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1rem', backgroundColor: '#FFFBEB', border: '1px solid #FDE68A', borderRadius: '8px', color: '#92400E', fontWeight: '700', fontSize: '0.9rem' }}>
                  <School size={18} /> {inst}
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* VISOR CATASTRAL OFICIAL */}
        <DistrictMapViewer />

      </div>
    </div>
  );
}
