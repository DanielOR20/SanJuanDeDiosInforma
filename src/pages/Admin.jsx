import { useEffect, useState } from 'react';
import { getBusinesses, updateBusiness, deleteBusiness, getNotices } from '../services/api';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';
import { 
  ShieldCheck, 
  Store, 
  Check, 
  Trash2, 
  AlertTriangle, 
  TrendingUp 
} from 'lucide-react';

export const Admin = () => {
  const [businesses, setBusinesses] = useState([]);
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      const [bizData, notData] = await Promise.all([
        getBusinesses(),
        getNotices()
      ]);
      setBusinesses(bizData);
      setNotices(notData);
    } catch (err) {
      console.error('Error cargando datos de admin:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Aprobar un comercio pendiente
  const handleApprove = async (id) => {
    try {
      await updateBusiness(id, { verified: true, status: 'Abierto Ahora' });
      loadData();
    } catch (err) {
      alert('Error al verificar el comercio');
    }
  };

  // Eliminar comercio
  const handleDeleteBusiness = async (id) => {
    if (!window.confirm('¿Está seguro de eliminar este comercio del registro?')) return;
    try {
      await deleteBusiness(id);
      loadData();
    } catch (err) {
      alert('Error al eliminar comercio');
    }
  };

  // Datos para gráficos de Recharts
  const reportStats = [
    { name: 'Servicios', cantidad: notices.filter(n => n.category === 'Servicios Públicos').length + 2 },
    { name: 'Recolección', cantidad: notices.filter(n => n.category === 'Recolección').length + 3 },
    { name: 'Vialidad', cantidad: 4 },
    { name: 'Seguridad', cantidad: 1 },
    { name: 'Mascotas', cantidad: 2 },
  ];

  const categoryPieData = [
    { name: 'Alimentación', value: businesses.filter(b => b.category === 'Alimentación').length || 1 },
    { name: 'Automotriz', value: businesses.filter(b => b.category === 'Automotriz').length || 1 },
    { name: 'Belleza', value: businesses.filter(b => b.category === 'Belleza').length || 1 },
  ];

  const COLORS = ['#1E3A8A', '#DC2626', '#16A34A', '#D97706'];

  return (
    <div className="stitch-container" style={{ paddingBottom: '3rem', marginTop: '2rem' }}>
      
      {/* Cabecera del Panel */}
      <div style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary)', fontWeight: '700', fontSize: '0.9rem', marginBottom: '0.2rem' }}>
            <ShieldCheck size={20} color="var(--tertiary)" /> Consola Directiva ADI San Juan de Dios
          </div>
          <h1 style={{ color: 'var(--primary)', fontSize: '2rem', fontWeight: '800' }}>
            Panel de Moderación y Métricas Comunales
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            Aprobación de establecimientos, monitoreo de reportes e incidencias ciudadanas.
          </p>
        </div>
        <span className="badge badge-success" style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}>
          Sesión de Administrador Activa
        </span>
      </div>

      {/* Tarjetas de Resumen Numérico */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', marginBottom: '2.5rem' }}>
        <div className="stitch-card" style={{ padding: '1.25rem' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '600' }}>COMERCIOS REGISTRADOS</span>
          <div style={{ fontSize: '1.8rem', fontWeight: '800', color: 'var(--primary)', margin: '0.25rem 0' }}>
            {businesses.length}
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--tertiary)', fontWeight: '600' }}>
            {businesses.filter(b => b.verified).length} verificados y activos
          </span>
        </div>

        <div className="stitch-card" style={{ padding: '1.25rem' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '600' }}>PENDIENTES DE APROBACIÓN</span>
          <div style={{ fontSize: '1.8rem', fontWeight: '800', color: 'var(--accent)', margin: '0.25rem 0' }}>
            {businesses.filter(b => !b.verified).length}
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Requieren revisión de ADI</span>
        </div>

        <div className="stitch-card" style={{ padding: '1.25rem' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '600' }}>AVISOS Y REPORTES ACTIVOS</span>
          <div style={{ fontSize: '1.8rem', fontWeight: '800', color: 'var(--secondary)', margin: '0.25rem 0' }}>
            {notices.length}
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>En seguimiento comunal</span>
        </div>
      </div>

      {/* SECCIÓN DE GRÁFICOS CON RECHARTS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
        
        {/* Gráfico 1: Barras de incidencias */}
        <div className="stitch-card" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <TrendingUp size={18} color="var(--primary)" /> Incidencias Comunitarias Reportadas
          </h3>
          <div style={{ width: '100%', height: 260 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={reportStats}>
                <XAxis dataKey="name" stroke="var(--text-muted)" fontSize={12} />
                <YAxis stroke="var(--text-muted)" fontSize={12} allowDecimals={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)', borderRadius: '8px' }}
                  itemStyle={{ color: 'var(--text-main)' }}
                />
                <Bar dataKey="cantidad" fill="var(--primary)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Gráfico 2: Pastel de Comercios por Categoría */}
        <div className="stitch-card" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Store size={18} color="var(--tertiary)" /> Comercios por Sector Económico
          </h3>
          <div style={{ width: '100%', height: 260 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryPieData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  labelLine={false}
                >
                  {categoryPieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)', borderRadius: '8px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* TABLA DE MODERACIÓN DE COMERCIOS */}
      <div className="stitch-card" style={{ padding: '1.5rem', overflowX: 'auto' }}>
        <h3 style={{ fontSize: '1.2rem', fontWeight: '800', marginBottom: '1rem', color: 'var(--primary)' }}>
          Gestión y Aprobación de Comercios
        </h3>
        
        {loading ? (
          <p style={{ color: 'var(--text-muted)' }}>Cargando registros...</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--border)', color: 'var(--text-muted)' }}>
                <th style={{ padding: '0.75rem' }}>Comercio</th>
                <th style={{ padding: '0.75rem' }}>Categoría</th>
                <th style={{ padding: '0.75rem' }}>Teléfono</th>
                <th style={{ padding: '0.75rem' }}>Estado</th>
                <th style={{ padding: '0.75rem', textAlign: 'right' }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {businesses.map(b => (
                <tr key={b.id} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '0.75rem', fontWeight: '600' }}>{b.name}</td>
                  <td style={{ padding: '0.75rem', color: 'var(--text-muted)' }}>{b.category}</td>
                  <td style={{ padding: '0.75rem' }}>{b.phone}</td>
                  <td style={{ padding: '0.75rem' }}>
                    {b.verified ? (
                      <span className="badge badge-success">Aprobado</span>
                    ) : (
                      <span className="badge badge-urgent">Pendiente</span>
                    )}
                  </td>
                  <td style={{ padding: '0.75rem', textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: '0.5rem' }}>
                      {!b.verified && (
                        <button
                          onClick={() => handleApprove(b.id)}
                          title="Aprobar y verificar negocio"
                          style={{
                            backgroundColor: 'var(--tertiary)',
                            color: '#FFFFFF',
                            padding: '0.35rem 0.65rem',
                            borderRadius: '4px',
                            fontWeight: '600',
                            fontSize: '0.8rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.25rem'
                          }}
                        >
                          <Check size={14} /> Aprobar
                        </button>
                      )}
                      <button
                        onClick={() => handleDeleteBusiness(b.id)}
                        title="Eliminar comercio"
                        style={{
                          backgroundColor: 'var(--secondary)',
                          color: '#FFFFFF',
                          padding: '0.35rem 0.5rem',
                          borderRadius: '4px',
                          display: 'flex',
                          alignItems: 'center'
                        }}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

    </div>
  );
};