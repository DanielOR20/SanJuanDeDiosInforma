import React from 'react';
import { MapIcon, ExternalLink, Map, LandPlot, Axis3d } from 'lucide-react';

export const DistrictMapViewer = () => {
  return (
    <div style={{ marginTop: '3rem' }}>
      <div style={{
        position: 'relative',
        width: '100%',
        height: '420px',
        borderRadius: '12px',
        overflow: 'hidden',
        boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
        backgroundColor: '#F8FAFC'
      }}>
        {/* Imagen de fondo / Cartografía vectorial */}
        <img 
          src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=1600&q=80" 
          alt="Catastro Oficial" 
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
        
        {/* Capa Interactiva (Overlay) */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to top, rgba(0, 43, 127, 0.9) 0%, rgba(0, 0, 0, 0.25) 100%)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          padding: '2.5rem',
          color: 'white'
        }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', backgroundColor: 'rgba(255,255,255,0.2)', padding: '0.4rem 0.85rem', borderRadius: '99px', fontSize: '0.8rem', fontWeight: '800', marginBottom: '1rem', width: 'fit-content', backdropFilter: 'blur(4px)' }}>
            🗺️ Sistema de Información Geográfica (SIG)
          </div>
          
          <h2 style={{ fontSize: 'clamp(1.5rem, 3vw, 2.5rem)', fontWeight: '900', margin: '0 0 0.5rem 0', textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
            Plano Catastral Predial • San Juan de Dios
          </h2>
          
          <p style={{ fontSize: '1.05rem', opacity: 0.9, maxWidth: '700px', margin: '0 0 1.5rem 0', lineHeight: 1.5, textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}>
            Consulte cuadrantes, vías de acceso, límites distritales y números de finca en la plataforma oficial del municipio.
          </p>
          
          <a 
            href="https://mapas.desamparados.go.cr/mapas/san-juan-de-dios/catastro" 
            target="_blank" 
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              backgroundColor: '#059669',
              color: 'white',
              padding: '0.85rem 1.5rem',
              borderRadius: '8px',
              textDecoration: 'none',
              fontWeight: '800',
              fontSize: '1rem',
              width: 'fit-content',
              boxShadow: '0 4px 6px rgba(5,150,105,0.3)',
              transition: 'transform 0.2s, background-color 0.2s'
            }}
            onMouseOver={(e) => { e.currentTarget.style.backgroundColor = '#047857'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
            onMouseOut={(e) => { e.currentTarget.style.backgroundColor = '#059669'; e.currentTarget.style.transform = 'translateY(0)'; }}
          >
            Abrir Visor Catastral Municipal <ExternalLink size={18} />
          </a>
        </div>
      </div>

      {/* Bloque Inferior de Utilidades Catastrales */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem', marginTop: '1.5rem' }}>
        
        <div className="stitch-card" style={{ padding: '1.25rem', backgroundColor: 'white', display: 'flex', alignItems: 'flex-start', gap: '1rem', borderTop: '4px solid #D97706' }}>
          <div style={{ backgroundColor: '#FFFBEB', padding: '0.5rem', borderRadius: '8px', color: '#D97706' }}>
            <MapIcon size={24} />
          </div>
          <div>
            <h3 style={{ margin: '0 0 0.25rem 0', fontSize: '1.05rem', fontWeight: '800', color: '#0F172A' }}>Zonificación</h3>
            <p style={{ margin: 0, fontSize: '0.85rem', color: '#475569', lineHeight: 1.4 }}>Consulta de uso de suelo y retiros frontales/laterales.</p>
          </div>
        </div>

        <div className="stitch-card" style={{ padding: '1.25rem', backgroundColor: 'white', display: 'flex', alignItems: 'flex-start', gap: '1rem', borderTop: '4px solid #002B7F' }}>
          <div style={{ backgroundColor: '#EFF6FF', padding: '0.5rem', borderRadius: '8px', color: '#002B7F' }}>
            <Axis3d size={24} />
          </div>
          <div>
            <h3 style={{ margin: '0 0 0.25rem 0', fontSize: '1.05rem', fontWeight: '800', color: '#0F172A' }}>Alineamiento</h3>
            <p style={{ margin: 0, fontSize: '0.85rem', color: '#475569', lineHeight: 1.4 }}>Verificación de afectación vial o derecho de vía pública.</p>
          </div>
        </div>

        <div className="stitch-card" style={{ padding: '1.25rem', backgroundColor: 'white', display: 'flex', alignItems: 'flex-start', gap: '1rem', borderTop: '4px solid #059669' }}>
          <div style={{ backgroundColor: '#ECFDF5', padding: '0.5rem', borderRadius: '8px', color: '#059669' }}>
            <LandPlot size={24} />
          </div>
          <div>
            <h3 style={{ margin: '0 0 0.25rem 0', fontSize: '1.05rem', fontWeight: '800', color: '#0F172A' }}>Límites Oficiales</h3>
            <p style={{ margin: 0, fontSize: '0.85rem', color: '#475569', lineHeight: 1.4 }}>Colindancias con San Rafael Abajo, Desamparados y Alajuelita.</p>
          </div>
        </div>

      </div>

      <div style={{ marginTop: '1rem', fontSize: '0.75rem', color: '#64748B', textAlign: 'center' }}>
        Fuente: SIG Municipalidad de Desamparados • Datos catastrales de acceso público regulados bajo lineamientos municipales.
      </div>
    </div>
  );
};
