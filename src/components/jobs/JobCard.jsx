import { Briefcase, MapPin, Clock, DollarSign, MessageCircle, Phone, Tag } from 'lucide-react';

export const JobCard = ({ job }) => {
  const isCommercial = job.type === 'Empleo Comercial';

  return (
    <div className="stitch-card" style={{
      padding: '1.25rem',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      borderLeft: `5px solid ${isCommercial ? '#002B7F' : '#059669'}`
    }}>
      <div>
        {/* Cabecera de la tarjeta */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem', marginBottom: '0.35rem' }}>
          <span style={{
            fontSize: '0.72rem',
            fontWeight: '800',
            padding: '0.15rem 0.55rem',
            borderRadius: '4px',
            backgroundColor: isCommercial ? '#E0E7FF' : '#DCFCE7',
            color: isCommercial ? '#002B7F' : '#166534',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.25rem'
          }}>
            <Tag size={12} /> {job.type}
          </span>
          <span style={{ fontSize: '0.75rem', color: '#64748B' }}>{job.date}</span>
        </div>

        <h3 style={{ fontSize: '1.15rem', fontWeight: '800', margin: '0.2rem 0 0.25rem 0', color: '#0F172A' }}>
          {job.title}
        </h3>

        <div style={{ fontSize: '0.82rem', fontWeight: '700', color: '#002B7F', marginBottom: '0.5rem' }}>
          {job.businessName}
        </div>

        <p style={{ fontSize: '0.85rem', color: '#475569', lineHeight: 1.45, margin: '0 0 0.85rem 0' }}>
          {job.description}
        </p>

        {/* Metadatos */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', fontSize: '0.78rem', color: '#64748B', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <MapPin size={14} color="#002B7F" />
            <span>{job.sector}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <Clock size={14} color="#002B7F" />
            <span>{job.schedule}</span>
          </div>
          {job.salary && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#059669', fontWeight: '700' }}>
              <DollarSign size={14} />
              <span>{job.salary}</span>
            </div>
          )}
        </div>
      </div>

      {/* Enlace de contacto directo */}
      <div style={{ paddingTop: '0.75rem', borderTop: '1px solid #E2E8F0' }}>
        {job.contactType === 'whatsapp' ? (
          <a
            href={`https://wa.me/506${job.contactPhone.replace(/[^0-9]/g, '')}?text=Hola,%20vi%20su%20publicación%20en%20la%20Bolsa%20de%20Empleo%20de%20San%20Juan%20de%20Dios`}
            target="_blank"
            rel="noreferrer"
            style={{
              backgroundColor: '#16A34A',
              color: '#FFFFFF',
              padding: '0.55rem',
              borderRadius: '4px',
              textDecoration: 'none',
              fontWeight: '700',
              fontSize: '0.82rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.35rem'
            }}
          >
            <MessageCircle size={15} /> Postularme por WhatsApp
          </a>
        ) : (
          <a
            href={`tel:${job.contactPhone.replace(/[^0-9]/g, '')}`}
            style={{
              backgroundColor: '#002B7F',
              color: '#FFFFFF',
              padding: '0.55rem',
              borderRadius: '4px',
              textDecoration: 'none',
              fontWeight: '700',
              fontSize: '0.82rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.35rem'
            }}
          >
            <Phone size={15} /> Llamar ({job.contactPhone})
          </a>
        )}
      </div>
    </div>
  );
};