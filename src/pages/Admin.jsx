import { useState, useEffect } from 'react';
import { 
  getBusinesses, 
  updateBusinessStatus, 
  deleteBusiness, 
  getNotices, 
  updateNoticeStatus, 
  deleteNotice,
  getAllUsers,
  updateUserRoleOrStatus,
  getBulletins,
  createBulletin,
  deleteBulletin,
  getAuditLogs,
  createAuditLog,
  getPublicComplaints,
  updateComplaintStatus,
  deleteComplaint,
  getProcedures,
  updateProcedureStatus,
  getBudgetProjects
} from '../services/api';
import { useApp } from '../context/AppContext';
import { 
  Building2, 
  Store, 
  AlertTriangle, 
  Users, 
  Megaphone, 
  History, 
  BarChart3, 
  Download, 
  Search, 
  PlusCircle, 
  Trash2, 
  RefreshCw,
  ShieldCheck,
  MessageSquareWarning,
  CheckCircle2,
  XCircle,
  FileSpreadsheet
} from 'lucide-react';

export const Admin = () => {
  const { user } = useApp();
  const [activeTab, setActiveTab] = useState('kpis');

  // Estados de datos
  const [businesses, setBusinesses] = useState([]);
  const [notices, setNotices] = useState([]);
  const [usersList, setUsersList] = useState([]);
  const [bulletins, setBulletins] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [procedures, setProcedures] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);

  // Formulario nuevo boletín
  const [newBulletin, setNewBulletin] = useState({
    title: '',
    category: 'Institucional',
    priority: 'Normal',
    author: user?.department || 'Junta Directiva ADI',
    summary: '',
    isPinned: false
  });

  // Filtro
  const [searchTerm, setSearchTerm] = useState('');

  const loadAllData = async () => {
    setLoading(true);
    try {
      const [bizData, noticeData, userData, bullData, auditData, compData, procData, budData] = await Promise.all([
        getBusinesses(),
        getNotices(),
        getAllUsers(),
        getBulletins(),
        getAuditLogs(),
        getPublicComplaints(),
        getProcedures(),
        getBudgetProjects()
      ]);
      setBusinesses(bizData || []);
      setNotices(noticeData || []);
      setUsersList(userData || []);
      setBulletins(bullData || []);
      setAuditLogs((auditData || []).reverse());
      setComplaints(compData || []);
      setProcedures(procData || []);
      setBudgets(budData || []);
    } catch (err) {
      console.error('Error al cargar datos del panel:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  // Handlers Comercios
  const handleToggleBusiness = async (biz, verified) => {
    try {
      await updateBusinessStatus(biz.id, verified);
      await createAuditLog({
        user: user?.name || 'Administrador ADI',
        action: verified ? 'APROBAR_COMERCIO' : 'SUSPENDER_COMERCIO',
        target: biz.name,
        details: `Comercio ${verified ? 'aprobado y publicado' : 'marcado como no verificado'}.`
      });
      loadAllData();
    } catch (e) {
      alert('Error al modificar comercio');
    }
  };

  const handleDeleteBusiness = async (biz) => {
    if (!window.confirm(`¿Confirma eliminar el comercio "${biz.name}"?`)) return;
    try {
      await deleteBusiness(biz.id);
      await createAuditLog({
        user: user?.name || 'Administrador ADI',
        action: 'ELIMINAR_COMERCIO',
        target: biz.name,
        details: 'Registro eliminado del directorio comercial cantonal.'
      });
      loadAllData();
    } catch (e) {
      alert('Error al eliminar comercio');
    }
  };

  // Handlers Incidencias
  const handleStatusNotice = async (notice, status) => {
    try {
      await updateNoticeStatus(notice.id, status);
      await createAuditLog({
        user: user?.name || 'Administrador ADI',
        action: 'CAMBIO_ESTADO_INCIDENCIA',
        target: `${notice.caseNumber || 'Avería'} - ${notice.title}`,
        details: `Estado actualizado a "${status}".`
      });
      loadAllData();
    } catch (e) {
      alert('Error al actualizar incidencia');
    }
  };

  const handleDeleteNotice = async (notice) => {
    if (!window.confirm(`¿Confirma archivar la incidencia "${notice.title}"?`)) return;
    try {
      await deleteNotice(notice.id);
      await createAuditLog({
        user: user?.name || 'Administrador ADI',
        action: 'ARCHIVAR_INCIDENCIA',
        target: notice.title,
        details: 'Incidencia archivada y retirada del mapa público.'
      });
      loadAllData();
    } catch (e) {
      alert('Error al eliminar aviso');
    }
  };

  // Handlers Usuarios
  const handleToggleUserStatus = async (targetUser) => {
    const newStatus = targetUser.status === 'Activo' ? 'Suspendido' : 'Activo';
    try {
      await updateUserRoleOrStatus(targetUser.id, { status: newStatus });
      await createAuditLog({
        user: user?.name || 'Administrador ADI',
        action: 'MODIFICAR_ESTADO_USUARIO',
        target: targetUser.name,
        details: `Cuenta cambiada a estado: ${newStatus}.`
      });
      loadAllData();
    } catch (e) {
      alert('Error al modificar usuario');
    }
  };

  const handleChangeRole = async (targetUser, newRole) => {
    try {
      await updateUserRoleOrStatus(targetUser.id, { role: newRole });
      await createAuditLog({
        user: user?.name || 'Administrador ADI',
        action: 'CAMBIO_ROL_SEGURIDAD',
        target: targetUser.name,
        details: `Rol modificado a "${newRole}".`
      });
      loadAllData();
    } catch (e) {
      alert('Error al actualizar rol');
    }
  };

  // Handlers Denuncias Públicas (Foro)
  const handleApproveComplaint = async (c) => {
    try {
      await updateComplaintStatus(c.id, 'Aprobada');
      await createAuditLog({
        user: user?.name || 'Administrador ADI',
        action: 'APROBAR_DENUNCIA_FORO',
        target: c.title,
        details: `Denuncia aprobada y publicada en la tribuna ciudadana.`
      });
      loadAllData();
    } catch (e) {
      alert('Error al aprobar denuncia');
    }
  };

  const handleDeleteComplaint = async (c) => {
    if (!window.confirm(`¿Confirma rechazar y descartar la denuncia "${c.title}"?`)) return;
    try {
      await deleteComplaint(c.id);
      await createAuditLog({
        user: user?.name || 'Administrador ADI',
        action: 'DESCARTAR_DENUNCIA',
        target: c.title,
        details: 'Denuncia descartada por la mesa de moderación.'
      });
      loadAllData();
    } catch (e) {
      alert('Error al descartar denuncia');
    }
  };

  // Handlers Trámites
  const handleProcedureStatus = async (proc, status) => {
    try {
      await updateProcedureStatus(proc.id, status);
      await createAuditLog({
        user: user?.name || 'Administrador ADI',
        action: 'RESOLUCION_TRAMITE',
        target: `${proc.type} - ${proc.applicant}`,
        details: `Solicitud de espacio marcada como "${status}".`
      });
      loadAllData();
    } catch (e) {
      alert('Error al actualizar trámite');
    }
  };

  // Handlers Boletines
  const handleCreateBulletin = async (e) => {
    e.preventDefault();
    if (!newBulletin.title.trim() || !newBulletin.summary.trim()) return;
    try {
      await createBulletin({
        ...newBulletin,
        date: new Date().toISOString().split('T')[0]
      });
      await createAuditLog({
        user: user?.name || 'Administrador ADI',
        action: 'EMITIR_BOLETIN_OFICIAL',
        target: newBulletin.title,
        details: `Publicado comunicado en categoría ${newBulletin.category}.`
      });
      setNewBulletin({
        title: '',
        category: 'Institucional',
        priority: 'Normal',
        author: user?.department || 'Junta Directiva ADI',
        summary: '',
        isPinned: false
      });
      loadAllData();
    } catch (e) {
      alert('Error al emitir comunicado');
    }
  };

  const handleDeleteBulletin = async (bull) => {
    if (!window.confirm('¿Eliminar comunicado oficial?')) return;
    try {
      await deleteBulletin(bull.id);
      await createAuditLog({
        user: user?.name || 'Administrador ADI',
        action: 'ELIMINAR_BOLETIN',
        target: bull.title,
        details: 'Comunicado retirado del portal.'
      });
      loadAllData();
    } catch (e) {
      alert('Error al eliminar boletín');
    }
  };

  // Exportar Informe CSV
  const handleExportCSV = () => {
    const rows = [
      ['Tipo Registro', 'Identificador / Titulo', 'Sector / Categoria', 'Estado / Rol', 'Impacto / Info'],
      ...notices.map(n => ['INCIDENCIA', n.caseNumber || n.id, n.sector || 'Distrital', n.status, `${n.votes || 0} vecinos afectados`]),
      ...businesses.map(b => ['COMERCIO', b.name, b.category, b.verified ? 'Verificado' : 'Pendiente', b.phone || 'S/T']),
      ...complaints.map(c => ['DENUNCIA_FORO', c.title, c.category, c.status, `${c.comments?.length || 0} comentarios`]),
      ...usersList.map(u => ['PADRON', u.name, u.email, u.role, u.status || 'Activo'])
    ];

    const csvContent = 'data:text/csv;charset=utf-8,' + rows.map(e => e.map(cell => `"${cell}"`).join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Informe_Ejecutivo_ADI_SanJuan_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Cálculos de KPIs
  const totalVotes = notices.reduce((acc, curr) => acc + (Number(curr.votes) || 0), 0);
  const resolvedNotices = notices.filter(n => n.status === 'Resuelto').length;
  const resolutionRate = notices.length > 0 ? Math.round((resolvedNotices / notices.length) * 100) : 0;
  const pendingBiz = businesses.filter(b => !b.verified).length;
  const pendingComplaints = complaints.filter(c => c.status === 'Pendiente').length;
  const pendingProcs = procedures.filter(p => p.status === 'Pendiente').length;

  return (
    <div className="stitch-container" style={{ padding: '2rem 1rem 4rem 1rem' }}>
      
      {/* Header Institucional */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        flexWrap: 'wrap',
        gap: '1rem',
        marginBottom: '1.75rem',
        paddingBottom: '1.25rem',
        borderBottom: '2px solid var(--border)'
      }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary)', fontWeight: '700', fontSize: '0.85rem', marginBottom: '0.35rem' }}>
            <ShieldCheck size={18} />
            Módulo Oficial de Moderación y Gobierno Comunal
          </div>
          <h1 style={{ fontSize: '1.85rem', fontWeight: '900', color: 'var(--text-main)', margin: '0 0 0.4rem 0' }}>
            Panel de Control ADI • San Juan de Dios
          </h1>
          <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: '0.92rem' }}>
            Suite integral de fiscalización comercial, mesa de averías, moderación de tribuna ciudadana, trámites y bitácora de auditoría.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
          <button
            onClick={handleExportCSV}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.45rem',
              backgroundColor: 'var(--surface)',
              color: 'var(--text-main)',
              border: '1px solid var(--border)',
              padding: '0.55rem 0.95rem',
              borderRadius: 'var(--radius-sm)',
              fontWeight: '700',
              fontSize: '0.84rem',
              cursor: 'pointer'
            }}
          >
            <Download size={16} /> Exportar Informe CSV
          </button>

          <button
            onClick={loadAllData}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.45rem',
              backgroundColor: 'var(--primary)',
              color: 'white',
              border: 'none',
              padding: '0.55rem 0.95rem',
              borderRadius: 'var(--radius-sm)',
              fontWeight: '700',
              fontSize: '0.84rem',
              cursor: 'pointer'
            }}
          >
            <RefreshCw size={15} /> Actualizar Datos
          </button>
        </div>
      </div>

      {/* Pestañas de Navegación del Panel */}
      <div style={{
        display: 'flex',
        gap: '0.5rem',
        borderBottom: '1px solid var(--border)',
        marginBottom: '2rem',
        overflowX: 'auto',
        paddingBottom: '0.2rem'
      }}>
        {[
          { id: 'kpis', label: 'Métricas & KPIs', icon: BarChart3, count: null },
          { id: 'businesses', label: 'Comercios', icon: Store, count: pendingBiz > 0 ? pendingBiz : null, badgeColor: '#EF4444' },
          { id: 'notices', label: 'Incidencias & Averías', icon: AlertTriangle, count: notices.length, badgeColor: 'var(--primary)' },
          { id: 'complaintsMod', label: 'Moderación Denuncias', icon: MessageSquareWarning, count: pendingComplaints > 0 ? pendingComplaints : null, badgeColor: '#DC2626' },
          { id: 'proceduresTab', label: 'Trámites y Permisos', icon: Building2, count: pendingProcs > 0 ? pendingProcs : null, badgeColor: '#D97706' },
          { id: 'budgetTab', label: 'Presupuesto Cantonal', icon: BarChart3, count: null },
          { id: 'users', label: 'Padrón Ciudadano', icon: Users, count: usersList.length, badgeColor: 'var(--border-strong)' },
          { id: 'bulletins', label: 'Boletines Oficiales', icon: Megaphone, count: bulletins.length, badgeColor: 'var(--border-strong)' },
          { id: 'audit', label: 'Bitácora de Auditoría', icon: History, count: auditLogs.length, badgeColor: 'var(--border-strong)' }
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.75rem 1.15rem',
                border: 'none',
                background: 'none',
                borderBottom: isActive ? '3px solid var(--primary)' : '3px solid transparent',
                color: isActive ? 'var(--primary)' : 'var(--text-muted)',
                fontWeight: isActive ? '800' : '600',
                fontSize: '0.9rem',
                cursor: 'pointer',
                whiteSpace: 'nowrap'
              }}
            >
              <Icon size={17} />
              {tab.label}
              {tab.count !== null && (
                <span style={{
                  backgroundColor: tab.badgeColor,
                  color: 'white',
                  borderRadius: '10px',
                  padding: '0.1rem 0.5rem',
                  fontSize: '0.72rem',
                  fontWeight: '800'
                }}>
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* 1. METRICAS Y KPIS */}
      {activeTab === 'kpis' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
            
            <div className="stitch-card" style={{ padding: '1.5rem', borderLeft: '4px solid var(--primary)' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                Tasa de Resolución
              </div>
              <div style={{ fontSize: '2.1rem', fontWeight: '900', color: 'var(--primary)', marginTop: '0.4rem' }}>
                {resolutionRate}%
              </div>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>
                {resolvedNotices} de {notices.length} averías solucionadas
              </div>
            </div>

            <div className="stitch-card" style={{ padding: '1.5rem', borderLeft: '4px solid #DC2626' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                Impacto Vecinal Confirmado
              </div>
              <div style={{ fontSize: '2.1rem', fontWeight: '900', color: '#DC2626', marginTop: '0.4rem' }}>
                {totalVotes}
              </div>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>
                Votos de vecinos en incidencias públicas
              </div>
            </div>

            <div className="stitch-card" style={{ padding: '1.5rem', borderLeft: '4px solid #059669' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                Directorio Comercial
              </div>
              <div style={{ fontSize: '2.1rem', fontWeight: '900', color: '#059669', marginTop: '0.4rem' }}>
                {businesses.filter(b => b.verified).length}
              </div>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>
                Comercios verificados ({pendingBiz} por auditar)
              </div>
            </div>

            <div className="stitch-card" style={{ padding: '1.5rem', borderLeft: '4px solid #D97706' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                Padrón Ciudadano ADI
              </div>
              <div style={{ fontSize: '2.1rem', fontWeight: '900', color: '#D97706', marginTop: '0.4rem' }}>
                {usersList.length}
              </div>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>
                Vecinos con credencial digital activa
              </div>
            </div>

          </div>

          <div className="stitch-card" style={{ padding: '1.75rem' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: '800', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <AlertTriangle size={18} color="var(--primary)" />
              Distribución Territorial de Incidencias en San Juan de Dios
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {['San Juan Centro', 'Calle Fallas', 'Cruce Poás', 'Plaza de Deportes'].map(sector => {
                const count = notices.filter(n => (n.sector || '').includes(sector)).length;
                const percentage = notices.length > 0 ? (count / notices.length) * 100 : 0;
                return (
                  <div key={sector}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: '700', marginBottom: '0.3rem' }}>
                      <span>{sector}</span>
                      <span>{count} casos ({Math.round(percentage)}%)</span>
                    </div>
                    <div style={{ width: '100%', height: '8px', backgroundColor: 'var(--border)', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{ width: `${percentage}%`, height: '100%', backgroundColor: 'var(--primary)' }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* 2. GESTION DE COMERCIOS */}
      {activeTab === 'businesses' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '800', margin: 0 }}>
              Fiscalización y Patentes del Directorio Local ({businesses.length})
            </h2>
            <div style={{ position: 'relative', width: '280px' }}>
              <Search size={15} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type="text"
                placeholder="Filtrar comercio por nombre..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.45rem 0.75rem 0.45rem 2.2rem',
                  fontSize: '0.85rem',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border)'
                }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {businesses
              .filter(b => b.name.toLowerCase().includes(searchTerm.toLowerCase()))
              .map(biz => (
                <div key={biz.id} className="stitch-card" style={{ padding: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                  <div style={{ maxWidth: '650px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.25rem' }}>
                      <span style={{ fontWeight: '800', fontSize: '1.05rem', color: 'var(--text-main)' }}>{biz.name}</span>
                      <span style={{
                        fontSize: '0.72rem',
                        fontWeight: '800',
                        padding: '0.15rem 0.5rem',
                        borderRadius: '4px',
                        backgroundColor: biz.verified ? '#DCFCE7' : '#FEF3C7',
                        color: biz.verified ? '#166534' : '#92400E'
                      }}>
                        {biz.verified ? 'Verificado ADI' : 'Pendiente Revisión'}
                      </span>
                    </div>
                    <p style={{ margin: '0 0 0.35rem 0', fontSize: '0.84rem', color: 'var(--text-muted)' }}>
                      <strong>Categoría:</strong> {biz.category} • <strong>Ubicación:</strong> {biz.address}
                    </p>
                    <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--text-subtle)' }}>
                      {biz.description}
                    </p>
                  </div>

                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    {biz.verified ? (
                      <button
                        onClick={() => handleToggleBusiness(biz, false)}
                        style={{ padding: '0.45rem 0.75rem', fontSize: '0.8rem', fontWeight: '700', borderRadius: 'var(--radius-sm)', border: '1px solid #D1D5DB', backgroundColor: 'var(--surface-subtle)', cursor: 'pointer' }}
                      >
                        Desactivar
                      </button>
                    ) : (
                      <button
                        onClick={() => handleToggleBusiness(biz, true)}
                        style={{ padding: '0.45rem 0.75rem', fontSize: '0.8rem', fontWeight: '700', borderRadius: 'var(--radius-sm)', border: 'none', backgroundColor: '#059669', color: 'white', cursor: 'pointer' }}
                      >
                        Aprobar y Publicar
                      </button>
                    )}
                    <button
                      onClick={() => handleDeleteBusiness(biz)}
                      style={{ padding: '0.45rem 0.75rem', fontSize: '0.8rem', fontWeight: '700', borderRadius: 'var(--radius-sm)', border: '1px solid #FCA5A5', backgroundColor: '#FEE2E2', color: '#991B1B', cursor: 'pointer' }}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* 3. AVERIAS E INCIDENCIAS */}
      {activeTab === 'notices' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: '800', margin: 0 }}>
            Mesa de Enlace Técnico con AyA, CNFL y Municipalidad ({notices.length})
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {notices.map(notice => (
              <div key={notice.id} className="stitch-card" style={{ padding: '1.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '0.75rem' }}>
                  <div>
                    <span style={{ fontSize: '0.75rem', fontWeight: '800', color: 'var(--primary)', backgroundColor: 'var(--primary-light)', padding: '0.2rem 0.5rem', borderRadius: '4px', marginRight: '0.5rem' }}>
                      {notice.caseNumber || `CASO-#${notice.id}`}
                    </span>
                    <strong style={{ fontSize: '1.05rem', color: 'var(--text-main)' }}>{notice.title}</strong>
                    <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                      Sector: <strong>{notice.sector || 'San Juan de Dios'}</strong> • Fecha: {notice.date} • <strong>{notice.votes || 0} vecinos afectados</strong>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <label style={{ fontSize: '0.78rem', fontWeight: '700', color: 'var(--text-muted)' }}>Estado Oficial:</label>
                    <select
                      value={notice.status}
                      onChange={e => handleStatusNotice(notice, e.target.value)}
                      style={{
                        padding: '0.35rem 0.65rem',
                        fontSize: '0.82rem',
                        fontWeight: '700',
                        borderRadius: 'var(--radius-sm)',
                        border: '1px solid var(--border-strong)',
                        backgroundColor: 'var(--surface)'
                      }}
                    >
                      <option value="Reportado por Vecino">Reportado por Vecino</option>
                      <option value="Inspección Municipal">Inspección Municipal</option>
                      <option value="En Cuadrilla (AyA/CNFL)">En Cuadrilla (AyA/CNFL)</option>
                      <option value="Resuelto">Resuelto</option>
                    </select>
                    <button
                      onClick={() => handleDeleteNotice(notice)}
                      title="Archivar"
                      style={{ padding: '0.35rem 0.5rem', border: '1px solid var(--border)', background: 'none', borderRadius: 'var(--radius-sm)', cursor: 'pointer', color: '#DC2626' }}
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>

                <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.85rem', color: 'var(--text-main)' }}>
                  {notice.description}
                </p>

                {notice.internalNote && (
                  <div style={{ backgroundColor: 'var(--surface-subtle)', borderLeft: '3px solid var(--tertiary)', padding: '0.5rem 0.75rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    <strong>Bitácora de Inspección:</strong> {notice.internalNote}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. MODERACION DE DENUNCIAS DEL FORO */}
      {activeTab === 'complaintsMod' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: '800', margin: 0 }}>
            Mesa de Moderación de Denuncias y Foro Ciudadano ({complaints.length})
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {complaints.map(c => (
              <div key={c.id} className="stitch-card" style={{ padding: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                <div style={{ maxWidth: '650px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.3rem' }}>
                    <strong style={{ fontSize: '1.05rem' }}>{c.title}</strong>
                    <span style={{
                      fontSize: '0.72rem',
                      fontWeight: '800',
                      padding: '0.15rem 0.5rem',
                      borderRadius: '4px',
                      backgroundColor: c.status === 'Aprobada' ? '#DCFCE7' : '#FEF3C7',
                      color: c.status === 'Aprobada' ? '#166534' : '#92400E'
                    }}>
                      {c.status}
                    </span>
                  </div>
                  <p style={{ margin: '0 0 0.35rem 0', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    <strong>Autor:</strong> {c.authorName} ({c.isAnonymous ? 'Anónimo' : 'Identificado'}) • <strong>Sector:</strong> {c.sector}
                  </p>
                  <p style={{ margin: 0, fontSize: '0.84rem', color: 'var(--text-main)' }}>{c.description}</p>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  {c.status !== 'Aprobada' && (
                    <button
                      onClick={() => handleApproveComplaint(c)}
                      style={{ padding: '0.45rem 0.85rem', fontSize: '0.8rem', fontWeight: '700', borderRadius: 'var(--radius-sm)', border: 'none', backgroundColor: '#059669', color: 'white', cursor: 'pointer' }}
                    >
                      Aprobar para el Foro
                    </button>
                  )}
                  <button
                    onClick={() => handleDeleteComplaint(c)}
                    style={{ padding: '0.45rem 0.75rem', fontSize: '0.8rem', fontWeight: '700', borderRadius: 'var(--radius-sm)', border: '1px solid #FCA5A5', backgroundColor: '#FEE2E2', color: '#991B1B', cursor: 'pointer' }}
                  >
                    Rechazar
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. TRAMITES Y PERMISOS */}
      {activeTab === 'proceduresTab' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: '800', margin: 0 }}>
            Gestión de Solicitudes y Permisos de Espacios Comunales
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {procedures.map(p => (
              <div key={p.id} className="stitch-card" style={{ padding: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                    <strong style={{ fontSize: '1.05rem' }}>{p.type}</strong>
                    <span style={{ fontSize: '0.75rem', fontWeight: '800', padding: '0.15rem 0.5rem', borderRadius: '4px', backgroundColor: p.status === 'Aprobado' ? '#DCFCE7' : '#FEF3C7', color: p.status === 'Aprobado' ? '#166534' : '#92400E' }}>
                      {p.status}
                    </span>
                  </div>
                  <p style={{ margin: '0 0 0.35rem 0', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    <strong>Solicitante:</strong> {p.applicant} ({p.cedula}) • <strong>Fecha Requerida:</strong> {p.dateRequested}
                  </p>
                  <p style={{ margin: 0, fontSize: '0.84rem', color: 'var(--text-main)' }}>{p.purpose}</p>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    onClick={() => handleProcedureStatus(p, 'Aprobado')}
                    style={{ padding: '0.45rem 0.75rem', fontSize: '0.8rem', fontWeight: '700', borderRadius: 'var(--radius-sm)', border: 'none', backgroundColor: '#059669', color: 'white', cursor: 'pointer' }}
                  >
                    Aprobar
                  </button>
                  <button
                    onClick={() => handleProcedureStatus(p, 'Rechazado')}
                    style={{ padding: '0.45rem 0.75rem', fontSize: '0.8rem', fontWeight: '700', borderRadius: 'var(--radius-sm)', border: '1px solid #D1D5DB', backgroundColor: 'var(--surface-subtle)', cursor: 'pointer' }}
                  >
                    Rechazar
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 6. PRESUPUESTO CANTONAL */}
      {activeTab === 'budgetTab' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: '800', margin: 0 }}>
            Ejecución de Fondos y Presupuesto Cantonal ADI
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {budgets.map(b => (
              <div key={b.id} className="stitch-card" style={{ padding: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.75rem' }}>
                  <div>
                    <span style={{ fontSize: '0.75rem', fontWeight: '800', color: 'var(--primary)', backgroundColor: 'var(--primary-light)', padding: '0.2rem 0.5rem', borderRadius: '4px', marginRight: '0.5rem' }}>
                      {b.code}
                    </span>
                    <strong style={{ fontSize: '1.1rem' }}>{b.title}</strong>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                      Responsable: <strong>{b.department}</strong> • Estado: <strong>{b.status}</strong>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '1.25rem', fontWeight: '900', color: 'var(--primary)' }}>
                      ₡{b.budgetExecuted.toLocaleString('es-CR')} / ₡{b.budgetTotal.toLocaleString('es-CR')}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Avance Financiero: {b.progressPercent}%</div>
                  </div>
                </div>
                <div style={{ width: '100%', height: '10px', backgroundColor: 'var(--border)', borderRadius: '5px', overflow: 'hidden' }}>
                  <div style={{ width: `${b.progressPercent}%`, height: '100%', backgroundColor: b.progressPercent === 100 ? '#059669' : 'var(--primary)' }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 7. PADRON CIUDADANO */}
      {activeTab === 'users' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: '800', margin: 0 }}>
            Padrón Digital Distrital y Control de Acceso ({usersList.length})
          </h2>

          <div className="stitch-card" style={{ padding: 0, overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
              <thead>
                <tr style={{ backgroundColor: 'var(--surface-subtle)', borderBottom: '1px solid var(--border)' }}>
                  <th style={{ padding: '0.75rem 1rem' }}>Nombre Completo</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Cédula / Identificación</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Correo Electrónico</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Rol Asignado</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Estado</th>
                  <th style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {usersList.map(u => (
                  <tr key={u.id} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '0.75rem 1rem', fontWeight: '700' }}>{u.name}</td>
                    <td style={{ padding: '0.75rem 1rem', color: 'var(--text-muted)' }}>{u.cedula || 'En trámite'}</td>
                    <td style={{ padding: '0.75rem 1rem' }}>{u.email}</td>
                    <td style={{ padding: '0.75rem 1rem' }}>
                      <select
                        value={u.role}
                        onChange={e => handleChangeRole(u, e.target.value)}
                        style={{ padding: '0.2rem 0.4rem', fontSize: '0.78rem', borderRadius: '4px', border: '1px solid var(--border)' }}
                      >
                        <option value="user">Vecino (user)</option>
                        <option value="moderator">Comité / Moderador</option>
                        <option value="admin">Junta Directiva (admin)</option>
                      </select>
                    </td>
                    <td style={{ padding: '0.75rem 1rem' }}>
                      <span style={{
                        fontSize: '0.72rem',
                        fontWeight: '800',
                        padding: '0.15rem 0.5rem',
                        borderRadius: '4px',
                        backgroundColor: u.status === 'Suspendido' ? '#FEE2E2' : '#DCFCE7',
                        color: u.status === 'Suspendido' ? '#991B1B' : '#166534'
                      }}>
                        {u.status || 'Activo'}
                      </span>
                    </td>
                    <td style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>
                      <button
                        onClick={() => handleToggleUserStatus(u)}
                        style={{
                          fontSize: '0.75rem',
                          fontWeight: '700',
                          padding: '0.25rem 0.6rem',
                          borderRadius: '4px',
                          border: '1px solid var(--border)',
                          backgroundColor: 'var(--surface)',
                          cursor: 'pointer'
                        }}
                      >
                        {u.status === 'Suspendido' ? 'Reactivar' : 'Suspender'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 8. BOLETINES OFICIALES */}
      {activeTab === 'bulletins' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(320px, 1fr) 2fr', gap: '2rem' }}>
          
          <div className="stitch-card" style={{ padding: '1.5rem', height: 'fit-content' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '800', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <PlusCircle size={18} color="var(--primary)" />
              Emitir Comunicado Oficial
            </h3>
            <form onSubmit={handleCreateBulletin} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: '700', marginBottom: '0.25rem' }}>Título del Comunicado</label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Convocatoria a Presupuesto Participativo"
                  value={newBulletin.title}
                  onChange={e => setNewBulletin({ ...newBulletin, title: e.target.value })}
                  style={{ width: '100%', padding: '0.5rem', fontSize: '0.85rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: '700', marginBottom: '0.25rem' }}>Categoría Institucional</label>
                <select
                  value={newBulletin.category}
                  onChange={e => setNewBulletin({ ...newBulletin, category: e.target.value })}
                  style={{ width: '100%', padding: '0.5rem', fontSize: '0.85rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}
                >
                  <option value="Institucional">Institucional / Asamblea</option>
                  <option value="Salud Pública">Salud Pública / EBAIS</option>
                  <option value="Seguridad">Seguridad y Vigilancia</option>
                  <option value="Vialidad">Vialidad e Infraestructura</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: '700', marginBottom: '0.25rem' }}>Contenido / Síntesis</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Redacte el acuerdo o comunicado oficial..."
                  value={newBulletin.summary}
                  onChange={e => setNewBulletin({ ...newBulletin, summary: e.target.value })}
                  style={{ width: '100%', padding: '0.5rem', fontSize: '0.85rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', fontFamily: 'inherit' }}
                />
              </div>

              <button
                type="submit"
                style={{
                  backgroundColor: 'var(--primary)',
                  color: 'white',
                  border: 'none',
                  padding: '0.65rem',
                  fontWeight: '700',
                  borderRadius: 'var(--radius-sm)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.4rem'
                }}
              >
                <Megaphone size={16} /> Publicar Boletín Comunal
              </button>
            </form>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '800', margin: 0 }}>
              Boletines en Circulación ({bulletins.length})
            </h3>
            {bulletins.map(bull => (
              <div key={bull.id} className="stitch-card" style={{ padding: '1.25rem', borderLeft: '4px solid var(--primary)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.4rem' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: '800', color: 'var(--primary)', textTransform: 'uppercase' }}>
                    {bull.category} • {bull.date}
                  </span>
                  <button
                    onClick={() => handleDeleteBulletin(bull)}
                    style={{ background: 'none', border: 'none', color: '#DC2626', cursor: 'pointer' }}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
                <h4 style={{ margin: '0 0 0.4rem 0', fontSize: '1.05rem', color: 'var(--text-main)' }}>{bull.title}</h4>
                <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>{bull.summary}</p>
                <div style={{ marginTop: '0.75rem', fontSize: '0.75rem', color: 'var(--text-subtle)', fontWeight: '600' }}>
                  Emitido por: {bull.author}
                </div>
              </div>
            ))}
          </div>

        </div>
      )}

      {/* 9. BITACORA DE AUDITORIA */}
      {activeTab === 'audit' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '800', margin: '0 0 0.25rem 0' }}>
              Bitácora Inmutable de Auditoría Gubernamental
            </h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>
              Registro cronológico de todas las intervenciones administrativas realizadas en la plataforma distrital.
            </p>
          </div>

          <div className="stitch-card" style={{ padding: 0, overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.84rem' }}>
              <thead>
                <tr style={{ backgroundColor: 'var(--surface-subtle)', borderBottom: '1px solid var(--border)' }}>
                  <th style={{ padding: '0.75rem 1rem' }}>Fecha y Hora</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Operador Responsable</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Evento / Acción</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Objetivo</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Detalle de Transacción</th>
                </tr>
              </thead>
              <tbody>
                {auditLogs.map(log => (
                  <tr key={log.id} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '0.75rem 1rem', whiteSpace: 'nowrap', color: 'var(--text-muted)' }}>
                      {log.timestamp ? new Date(log.timestamp).toLocaleString('es-CR') : '24/09/2026 10:00'}
                    </td>
                    <td style={{ padding: '0.75rem 1rem', fontWeight: '700' }}>{log.user}</td>
                    <td style={{ padding: '0.75rem 1rem' }}>
                      <span style={{
                        fontSize: '0.72rem',
                        fontWeight: '800',
                        padding: '0.15rem 0.5rem',
                        borderRadius: '4px',
                        backgroundColor: 'var(--primary-light)',
                        color: 'var(--primary)'
                      }}>
                        {log.action}
                      </span>
                    </td>
                    <td style={{ padding: '0.75rem 1rem', fontWeight: '600' }}>{log.target}</td>
                    <td style={{ padding: '0.75rem 1rem', color: 'var(--text-muted)' }}>{log.details}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
};