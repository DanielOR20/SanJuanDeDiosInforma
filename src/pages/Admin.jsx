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
    getBudgetProjects,
    getSupportTickets,
    respondSupportTicket
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
    LifeBuoy,
    Send,
    ExternalLink,
    MapPin,
    Calendar,
    Phone,
    Eye,
    FileSpreadsheet
} from 'lucide-react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Legend
} from 'recharts';

import AdminMarketplaceTab from './adminTabs/AdminMarketplaceTab';
import AdminFiscalizationTab from './adminTabs/AdminFiscalizationTab';
import AdminJobsTab from './adminTabs/AdminJobsTab';
import AdminReelsTab from './adminTabs/AdminReelsTab';
import AdminActasTab from './adminTabs/AdminActasTab';
import AdminPetsAlertsTab from './adminTabs/AdminPetsAlertsTab';

export const Admin = () => {
    const { user } = useApp();
    const [activeTab, setActiveTab] = useState('kpis');

    // Estados de Datos Maestros
    const [businesses, setBusinesses] = useState([]);
    const [notices, setNotices] = useState([]);
    const [usersList, setUsersList] = useState([]);
    const [bulletins, setBulletins] = useState([]);
    const [auditLogs, setAuditLogs] = useState([]);
    const [complaints, setComplaints] = useState([]);
    const [procedures, setProcedures] = useState([]);
    const [budgets, setBudgets] = useState([]);
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);

    // Filtros de búsqueda
    const [searchTerm, setSearchTerm] = useState('');
    const [ticketFilter, setTicketFilter] = useState('Todos'); // 'Todos' | 'Abierto' | 'Resuelto'
    const [noticeFilter, setNoticeFilter] = useState('Todos');

    // Respuestas en redacción para tickets
    const [ticketResponses, setTicketResponses] = useState({});

    // Formulario nuevo boletín oficial ADI
    const [newBulletin, setNewBulletin] = useState({
        title: '',
        category: 'Institucional',
        priority: 'Normal',
        author: user?.department || 'Junta Directiva ADI',
        summary: '',
        isPinned: false
    });

    // Carga unificada de todos los servicios
    const loadAllData = async () => {
        setLoading(true);
        try {
            const [
                bizData,
                noticeData,
                userData,
                bullData,
                auditData,
                compData,
                procData,
                budData,
                tickData
            ] = await Promise.all([
                getBusinesses(),
                getNotices(),
                getAllUsers(),
                getBulletins(),
                getAuditLogs(),
                getPublicComplaints(),
                getProcedures(),
                getBudgetProjects(),
                getSupportTickets()
            ]);

            setBusinesses(bizData || []);
            setNotices(noticeData || []);
            setUsersList(userData || []);
            setBulletins(bullData || []);
            setAuditLogs((auditData || []).reverse());
            setComplaints(compData || []);
            setProcedures(procData || []);
            setBudgets(budData || []);
            setTickets(tickData || []);
        } catch (err) {
            console.error('Error al sincronizar datos administrativos:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadAllData();
    }, []);

    // ==========================================
    // OPERACIONES: COMERCIOS
    // ==========================================
    const handleToggleBusiness = async (biz, verified) => {
        try {
            await updateBusinessStatus(biz.id, verified);
            await createAuditLog({
                user: user?.name || 'Administrador ADI',
                action: verified ? 'APROBAR_COMERCIO' : 'SUSPENDER_COMERCIO',
                target: biz.name,
                details: `Patente comercial ${verified ? 'aprobada y visible en mapa' : 'suspendida temporalmente'}.`
            });
            loadAllData();
        } catch (e) {
            alert('No se pudo actualizar el comercio');
        }
    };

    const handleDeleteBusiness = async (biz) => {
        if (!window.confirm(`¿Confirma eliminar definitivamente "${biz.name}" del padrón comercial?`)) return;
        try {
            await deleteBusiness(biz.id);
            await createAuditLog({
                user: user?.name || 'Administrador ADI',
                action: 'ELIMINAR_COMERCIO',
                target: biz.name,
                details: 'Comercio purgado del directorio cantonal.'
            });
            loadAllData();
        } catch (e) {
            alert('Error al eliminar comercio');
        }
    };

    // ==========================================
    // OPERACIONES: INCIDENCIAS & CUADRILLAS
    // ==========================================
    const handleStatusNotice = async (notice, newStatus) => {
        try {
            await updateNoticeStatus(notice.id, newStatus);
            await createAuditLog({
                user: user?.name || 'Administrador ADI',
                action: 'ACTUALIZAR_INCIDENCIA',
                target: `${notice.caseNumber || 'Avería'} - ${notice.title}`,
                details: `Estado operativo trasladado a "${newStatus}".`
            });
            loadAllData();
        } catch (e) {
            alert('Error al actualizar estado de la incidencia');
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
                details: 'Reporte retirado del monitor ciudadano.'
            });
            loadAllData();
        } catch (e) {
            alert('Error al archivar incidencia');
        }
    };

    // ==========================================
    // OPERACIONES: USUARIOS Y PADRÓN
    // ==========================================
    const handleToggleUserStatus = async (targetUser) => {
        const newStatus = targetUser.status === 'Activo' ? 'Suspendido' : 'Activo';
        try {
            await updateUserRoleOrStatus(targetUser.id, { status: newStatus });
            await createAuditLog({
                user: user?.name || 'Administrador ADI',
                action: 'MODIFICAR_ESTADO_USUARIO',
                target: targetUser.name,
                details: `Acceso del vecino cambiado a: ${newStatus}.`
            });
            loadAllData();
        } catch (e) {
            alert('Error al actualizar estado del usuario');
        }
    };

    const handleChangeRole = async (targetUser, newRole) => {
        try {
            await updateUserRoleOrStatus(targetUser.id, { role: newRole });
            await createAuditLog({
                user: user?.name || 'Administrador ADI',
                action: 'ASIGNACION_ROL_SEGURIDAD',
                target: targetUser.name,
                details: `Nivel de acceso institucional actualizado a "${newRole}".`
            });
            loadAllData();
        } catch (e) {
            alert('Error al cambiar rol del usuario');
        }
    };

    // ==========================================
    // OPERACIONES: TRIBUNA Y DENUNCIAS
    // ==========================================
    const handleApproveComplaint = async (complaint) => {
        try {
            await updateComplaintStatus(complaint.id, 'Aprobada');
            await createAuditLog({
                user: user?.name || 'Administrador ADI',
                action: 'PUBLICAR_DENUNCIA_FORO',
                target: complaint.title,
                details: `Denuncia vecinal verificada y autorizada en tribuna pública.`
            });
            loadAllData();
        } catch (e) {
            alert('Error al aprobar denuncia');
        }
    };

    const handleDeleteComplaint = async (complaint) => {
        if (!window.confirm(`¿Confirma desestimar la denuncia "${complaint.title}"?`)) return;
        try {
            await deleteComplaint(complaint.id);
            await createAuditLog({
                user: user?.name || 'Administrador ADI',
                action: 'DESESTIMAR_DENUNCIA',
                target: complaint.title,
                details: 'Denuncia descartada en mesa de revisión por no cumplir directrices.'
            });
            loadAllData();
        } catch (e) {
            alert('Error al descartar denuncia');
        }
    };

    // ==========================================
    // OPERACIONES: TRÁMITES COMUNALES
    // ==========================================
    const handleProcedureStatus = async (proc, newStatus) => {
        try {
            await updateProcedureStatus(proc.id, newStatus);
            await createAuditLog({
                user: user?.name || 'Administrador ADI',
                action: 'RESOLUCION_TRAMITE',
                target: `${proc.type} - ${proc.applicant}`,
                details: `Solicitud distrital resuelta como: "${newStatus}".`
            });
            loadAllData();
        } catch (e) {
            alert('Error al actualizar trámite');
        }
    };

    // ==========================================
    // OPERACIONES: MESA DE AYUDA (TICKETS)
    // ==========================================
    const handleRespondTicket = async (ticket) => {
        const responseText = ticketResponses[ticket.id]?.trim();
        if (!responseText) {
            alert('Por favor redacte el dictamen o respuesta para el vecino');
            return;
        }

        try {
            await respondSupportTicket(ticket.id, responseText);
            await createAuditLog({
                user: user?.name || 'Administrador ADI',
                action: 'RESOLVER_TICKET_AYUDA',
                target: ticket.ticketNumber,
                details: `Respuesta oficial enviada al vecino ${ticket.residentName}.`
            });
            setTicketResponses(prev => ({ ...prev, [ticket.id]: '' }));
            loadAllData();
        } catch (e) {
            alert('Error al registrar respuesta del ticket');
        }
    };

    // ==========================================
    // OPERACIONES: BOLETINES OFICIALES
    // ==========================================
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
                details: `Acuerdo publicado en categoría ${newBulletin.category}.`
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
        if (!window.confirm(`¿Eliminar el boletín "${bull.title}"?`)) return;
        try {
            await deleteBulletin(bull.id);
            await createAuditLog({
                user: user?.name || 'Administrador ADI',
                action: 'RETIRAR_BOLETIN',
                target: bull.title,
                details: 'Comunicado retirado de la cartelera distrital.'
            });
            loadAllData();
        } catch (e) {
            alert('Error al eliminar boletín');
        }
    };

    // ==========================================
    // EXPORTACIÓN DE INFORME EJECUTIVO A CSV
    // ==========================================
    const handleExportCSV = () => {
        const rows = [
            ['Modulo', 'Identificador / Titulo', 'Sector / Categoria', 'Estado Operativo', 'Detalle / Metrica'],
            ...notices.map(n => ['INCIDENCIA', n.caseNumber || n.id, n.sector || 'Distrital', n.status, `${n.votes || 0} vecinos afectados`]),
            ...businesses.map(b => ['COMERCIO', b.name, b.category, b.verified ? 'Verificado ADI' : 'Pendiente', b.phone || 'S/T']),
            ...complaints.map(c => ['DENUNCIA_PUBLICA', c.title, c.category, c.status, `${c.comments?.length || 0} comentarios vecinales`]),
            ...tickets.map(t => ['TICKET_SOPORTE', t.ticketNumber, t.sector, t.status, `Vecino: ${t.residentName}`]),
            ...procedures.map(p => ['TRAMITE_ESPACIO', p.type, p.applicant, p.status, `Fecha: ${p.dateRequested}`]),
            ...budgets.map(bg => ['PRESUPUESTO', bg.code, bg.title, bg.status, `Avance: ${bg.progressPercent}%`]),
            ...usersList.map(u => ['PADRON_CIUDADANO', u.name, u.email, u.role, u.status || 'Activo'])
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

    // ==========================================
    // METRICAS Y DATOS DE VISUALIZACIÓN
    // ==========================================
    const totalVotes = notices.reduce((acc, curr) => acc + (Number(curr.votes) || 0), 0);
    const resolvedNotices = notices.filter(n => n.status === 'Resuelto').length;
    const resolutionRate = notices.length > 0 ? Math.round((resolvedNotices / notices.length) * 100) : 0;

    const pendingBiz = businesses.filter(b => !b.verified).length;
    const pendingComplaints = complaints.filter(c => c.status === 'Pendiente').length;
    const pendingProcs = procedures.filter(p => p.status === 'Pendiente').length;
    const pendingTickets = tickets.filter(t => t.status === 'Abierto').length;

    const sectorChartData = [
        { name: 'Centro', casos: notices.filter(n => (n.sector || '').includes('Centro')).length },
        { name: 'Calle Fallas', casos: notices.filter(n => (n.sector || '').includes('Fallas')).length },
        { name: 'Poás', casos: notices.filter(n => (n.sector || '').includes('Poás')).length },
        { name: 'Plaza / Deportes', casos: notices.filter(n => (n.sector || '').includes('Plaza')).length }
    ];

    const statusPieData = [
        { name: 'Resueltos', value: notices.filter(n => n.status === 'Resuelto').length, color: '#059669' },
        { name: 'En Cuadrilla', value: notices.filter(n => n.status === 'En Cuadrilla (AyA/CNFL)').length, color: '#002B7F' },
        { name: 'Inspección', value: notices.filter(n => n.status === 'Inspección Municipal').length, color: '#D97706' },
        { name: 'Reportados', value: notices.filter(n => n.status === 'Reportado por Vecino').length, color: '#DC2626' }
    ].filter(item => item.value > 0);

    return (
        <div className="stitch-container" style={{ padding: '2rem 1rem 4rem 1rem' }}>

            {/* HEADER INSTITUCIONAL SUPERIOR */}
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                flexWrap: 'wrap',
                gap: '1rem',
                marginBottom: '2rem',
                paddingBottom: '1.25rem',
                borderBottom: '2px solid var(--border)'
            }}>
                <div>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem', color: '#002B7F', fontWeight: '800', fontSize: '0.85rem', marginBottom: '0.35rem' }}>
                        <ShieldCheck size={18} />
                        Módulo Oficial de Moderación y Gobierno Comunal • Distrito 03
                    </div>
                    <h1 style={{ fontSize: '1.95rem', fontWeight: '900', color: '#0F172A', margin: '0 0 0.4rem 0' }}>
                        Panel de Control ADI • San Juan de Dios
                    </h1>
                    <p style={{ color: '#475569', margin: 0, fontSize: '0.92rem' }}>
                        Supervisión integral de servicios públicos, fiscalización de patentes, tribuna ciudadana y bitácora de auditoría.
                    </p>
                </div>

                <div style={{ display: 'flex', gap: '0.65rem', flexWrap: 'wrap' }}>
                    <button
                        onClick={handleExportCSV}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.45rem',
                            backgroundColor: '#FFFFFF',
                            color: '#0F172A',
                            border: '1px solid #CBD5E1',
                            padding: '0.6rem 1rem',
                            borderRadius: '4px',
                            fontWeight: '700',
                            fontSize: '0.85rem',
                            cursor: 'pointer',
                            boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
                        }}
                    >
                        <Download size={16} color="#002B7F" /> Exportar Informe CSV
                    </button>

                    <button
                        onClick={loadAllData}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.45rem',
                            backgroundColor: '#002B7F',
                            color: 'white',
                            border: 'none',
                            padding: '0.6rem 1rem',
                            borderRadius: '4px',
                            fontWeight: '700',
                            fontSize: '0.85rem',
                            cursor: 'pointer'
                        }}
                    >
                        <RefreshCw size={15} /> Actualizar Datos
                    </button>
                </div>
            </div>

            {/* BARRA NAVEGACIÓN DE PESTAÑAS */}
            <div style={{
                display: 'flex',
                gap: '0.4rem',
                borderBottom: '2px solid #E2E8F0',
                marginBottom: '2rem',
                overflowX: 'auto',
                paddingBottom: '0.25rem'
            }}>
                {[
                    { id: 'kpis', label: 'Estadísticas & DataViz', icon: BarChart3, count: null },
                    { id: 'ticketsTab', label: 'Mesa de Ayuda', icon: LifeBuoy, count: pendingTickets > 0 ? pendingTickets : null, badgeColor: '#DC2626' },
                    { id: 'notices', label: 'Incidencias & Averías', icon: AlertTriangle, count: notices.length, badgeColor: '#002B7F' },
                    { id: 'complaintsMod', label: 'Tribuna & Denuncias', icon: MessageSquareWarning, count: pendingComplaints > 0 ? pendingComplaints : null, badgeColor: '#DC2626' },
                    { id: 'businesses', label: 'Comercios', icon: Store, count: pendingBiz > 0 ? pendingBiz : null, badgeColor: '#D97706' },
                    { id: 'proceduresTab', label: 'Trámites y Permisos', icon: Building2, count: pendingProcs > 0 ? pendingProcs : null, badgeColor: '#D97706' },
                    { id: 'budgetTab', label: 'Presupuesto ADI', icon: BarChart3, count: null },
                    { id: 'users', label: 'Padrón Vecinal', icon: Users, count: usersList.length, badgeColor: '#64748B' },
                    { id: 'bulletins', label: 'Boletines Oficiales', icon: Megaphone, count: bulletins.length, badgeColor: '#64748B' },
                    { id: 'audit', label: 'Bitácora de Auditoría', icon: History, count: auditLogs.length, badgeColor: '#64748B' },
                    { id: 'marketplaceAdmin', label: 'Mercadito Comunal', icon: Store, count: null, badgeColor: '#002B7F' },
                    { id: 'fiscalizationAdmin', label: 'Fiscalización & Denuncias', icon: ShieldCheck, count: null, badgeColor: '#002B7F' },
                    { id: 'jobsAdmin', label: 'Bolsa de Empleo', icon: Users, count: null, badgeColor: '#002B7F' },
                    { id: 'reelsAdmin', label: 'Moderación Reels', icon: CheckCircle2, count: null, badgeColor: '#002B7F' },
                    { id: 'actasAdmin', label: 'Presupuesto y Actas', icon: FileSpreadsheet, count: null, badgeColor: '#002B7F' },
                    { id: 'petsAlertsAdmin', label: 'Seguridad & Mascotas', icon: ShieldCheck, count: null, badgeColor: '#DC2626' }
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
                                gap: '0.45rem',
                                padding: '0.75rem 1.1rem',
                                border: 'none',
                                background: 'none',
                                borderBottom: isActive ? '3px solid #002B7F' : '3px solid transparent',
                                color: isActive ? '#002B7F' : '#64748B',
                                fontWeight: isActive ? '800' : '600',
                                fontSize: '0.88rem',
                                cursor: 'pointer',
                                whiteSpace: 'nowrap'
                            }}
                        >
                            <Icon size={16} />
                            {tab.label}
                            {tab.count !== null && (
                                <span style={{
                                    backgroundColor: tab.badgeColor,
                                    color: 'white',
                                    borderRadius: '10px',
                                    padding: '0.1rem 0.45rem',
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

            {/* ========================================== */}
            {/* PESTAÑA 1: DATAVIZ Y KPIS CANTONALES */}
            {/* ========================================== */}
            {activeTab === 'kpis' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>

                        <div className="stitch-card" style={{ padding: '1.5rem', borderLeft: '4px solid #002B7F' }}>
                            <div style={{ fontSize: '0.78rem', fontWeight: '800', color: '#64748B', textTransform: 'uppercase' }}>Tasa de Resolución</div>
                            <div style={{ fontSize: '2.25rem', fontWeight: '900', color: '#002B7F', marginTop: '0.35rem' }}>
                                {resolutionRate}%
                            </div>
                            <div style={{ fontSize: '0.82rem', color: '#64748B', marginTop: '0.25rem' }}>
                                {resolvedNotices} de {notices.length} averías solventadas
                            </div>
                        </div>

                        <div className="stitch-card" style={{ padding: '1.5rem', borderLeft: '4px solid #DC2626' }}>
                            <div style={{ fontSize: '0.78rem', fontWeight: '800', color: '#64748B', textTransform: 'uppercase' }}>Afectación Vecinal</div>
                            <div style={{ fontSize: '2.25rem', fontWeight: '900', color: '#DC2626', marginTop: '0.35rem' }}>
                                {totalVotes}
                            </div>
                            <div style={{ fontSize: '0.82rem', color: '#64748B', marginTop: '0.25rem' }}>
                                Confirmaciones ciudadanas registradas
                            </div>
                        </div>

                        <div className="stitch-card" style={{ padding: '1.5rem', borderLeft: '4px solid #059669' }}>
                            <div style={{ fontSize: '0.78rem', fontWeight: '800', color: '#64748B', textTransform: 'uppercase' }}>Directorio Activo</div>
                            <div style={{ fontSize: '2.25rem', fontWeight: '900', color: '#059669', marginTop: '0.35rem' }}>
                                {businesses.filter(b => b.verified).length}
                            </div>
                            <div style={{ fontSize: '0.82rem', color: '#64748B', marginTop: '0.25rem' }}>
                                Comercios verificados ({pendingBiz} por auditar)
                            </div>
                        </div>

                        <div className="stitch-card" style={{ padding: '1.5rem', borderLeft: '4px solid #D97706' }}>
                            <div style={{ fontSize: '0.78rem', fontWeight: '800', color: '#64748B', textTransform: 'uppercase' }}>Casos en Mesa de Ayuda</div>
                            <div style={{ fontSize: '2.25rem', fontWeight: '900', color: '#D97706', marginTop: '0.35rem' }}>
                                {tickets.length}
                            </div>
                            <div style={{ fontSize: '0.82rem', color: '#64748B', marginTop: '0.25rem' }}>
                                {pendingTickets} boletas requieren respuesta
                            </div>
                        </div>

                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1.75rem' }}>

                        <div className="stitch-card" style={{ padding: '1.75rem' }}>
                            <h3 style={{ fontSize: '1.05rem', fontWeight: '800', marginBottom: '1.25rem', color: '#0F172A' }}>
                                Distribución Territorial de Incidencias en San Juan de Dios
                            </h3>
                            <div style={{ width: '100%', height: 270 }}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={sectorChartData}>
                                        <XAxis dataKey="name" stroke="#64748B" fontSize={12} />
                                        <YAxis allowDecimals={false} stroke="#64748B" fontSize={12} />
                                        <Tooltip contentStyle={{ backgroundColor: '#FFFFFF', borderRadius: '4px', border: '1px solid #CBD5E1' }} />
                                        <Bar dataKey="casos" fill="#002B7F" radius={[4, 4, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        <div className="stitch-card" style={{ padding: '1.75rem' }}>
                            <h3 style={{ fontSize: '1.05rem', fontWeight: '800', marginBottom: '1.25rem', color: '#0F172A' }}>
                                Estado Operativo de Casos (AyA, CNFL, Vialidad)
                            </h3>
                            <div style={{ width: '100%', height: 270 }}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie data={statusPieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={85} label>
                                            {statusPieData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                        <Legend wrapperStyle={{ fontSize: '12px' }} />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                    </div>

                </div>
            )}

            {/* ========================================== */}
            {/* PESTAÑA 2: MESA DE AYUDA (TICKETS) */}
            {/* ========================================== */}
            {activeTab === 'ticketsTab' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                        <div>
                            <h2 style={{ fontSize: '1.25rem', fontWeight: '800', margin: '0 0 0.25rem 0', color: '#0F172A' }}>
                                Mesa de Ayuda y Asistencia Directa al Vecino ({tickets.length})
                            </h2>
                            <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748B' }}>
                                Boletas elevadas desde la Guía IA que requieren respuesta formal de la Junta Directiva.
                            </p>
                        </div>

                        <div style={{ display: 'flex', gap: '0.4rem' }}>
                            {['Todos', 'Abierto', 'Resuelto'].map(st => (
                                <button
                                    key={st}
                                    onClick={() => setTicketFilter(st)}
                                    style={{
                                        padding: '0.4rem 0.85rem',
                                        borderRadius: '20px',
                                        fontSize: '0.8rem',
                                        fontWeight: '700',
                                        border: ticketFilter === st ? '1px solid #002B7F' : '1px solid #CBD5E1',
                                        backgroundColor: ticketFilter === st ? '#E0E7FF' : '#FFFFFF',
                                        color: ticketFilter === st ? '#002B7F' : '#64748B',
                                        cursor: 'pointer'
                                    }}
                                >
                                    {st}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {tickets
                            .filter(t => ticketFilter === 'Todos' ? true : t.status === ticketFilter)
                            .map(t => (
                                <div key={t.id} className="stitch-card" style={{ padding: '1.5rem', borderLeft: t.status === 'Abierto' ? '4px solid #DC2626' : '4px solid #059669' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '0.6rem' }}>
                                        <div>
                                            <span style={{ fontSize: '0.75rem', fontWeight: '800', backgroundColor: '#F1F5F9', color: '#002B7F', padding: '0.2rem 0.5rem', borderRadius: '4px', marginRight: '0.5rem' }}>
                                                {t.ticketNumber}
                                            </span>
                                            <strong style={{ fontSize: '1.05rem', color: '#0F172A' }}>{t.subject}</strong>
                                            <div style={{ fontSize: '0.82rem', color: '#64748B', marginTop: '0.25rem' }}>
                                                Solicitante: <strong>{t.residentName}</strong> ({t.email}) • Sector: <strong>{t.sector}</strong> • Fecha: {t.date}
                                            </div>
                                        </div>

                                        <span style={{
                                            fontSize: '0.75rem',
                                            fontWeight: '800',
                                            padding: '0.2rem 0.6rem',
                                            borderRadius: '4px',
                                            backgroundColor: t.status === 'Abierto' ? '#FEE2E2' : '#DCFCE7',
                                            color: t.status === 'Abierto' ? '#991B1B' : '#166534'
                                        }}>
                                            {t.status}
                                        </span>
                                    </div>

                                    <p style={{ fontSize: '0.9rem', color: '#334155', lineHeight: 1.5, margin: '0 0 1rem 0' }}>
                                        {t.message}
                                    </p>

                                    {t.response ? (
                                        <div style={{ backgroundColor: '#F8FAFC', borderLeft: '3px solid #059669', padding: '0.85rem 1rem', borderRadius: '4px', fontSize: '0.86rem' }}>
                                            <strong style={{ color: '#059669', display: 'block', marginBottom: '0.25rem' }}>
                                                Dictamen / Resolución Oficial de la ADI:
                                            </strong>
                                            <p style={{ margin: 0, color: '#334155' }}>{t.response}</p>
                                        </div>
                                    ) : (
                                        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem' }}>
                                            <input
                                                type="text"
                                                placeholder="Redactar acuerdo o resolución administrativa para el vecino..."
                                                value={ticketResponses[t.id] || ''}
                                                onChange={e => setTicketResponses({ ...ticketResponses, [t.id]: e.target.value })}
                                                style={{
                                                    flex: 1,
                                                    padding: '0.55rem 0.85rem',
                                                    fontSize: '0.86rem',
                                                    borderRadius: '4px',
                                                    border: '1px solid #CBD5E1'
                                                }}
                                            />
                                            <button
                                                onClick={() => handleRespondTicket(t)}
                                                style={{
                                                    backgroundColor: '#002B7F',
                                                    color: 'white',
                                                    border: 'none',
                                                    padding: '0.55rem 1.15rem',
                                                    borderRadius: '4px',
                                                    fontWeight: '700',
                                                    fontSize: '0.84rem',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '0.4rem',
                                                    cursor: 'pointer'
                                                }}
                                            >
                                                <Send size={14} /> Responder y Cerrar
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ))}
                    </div>
                </div>
            )}

            {/* ========================================== */}
            {/* PESTAÑA 3: INCIDENCIAS Y AVERIAS */}
            {/* ========================================== */}
            {activeTab === 'notices' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                        <h2 style={{ fontSize: '1.25rem', fontWeight: '800', margin: 0, color: '#0F172A' }}>
                            Mesa Técnica de Enlace con AyA, CNFL y Municipalidad ({notices.length})
                        </h2>

                        <div style={{ display: 'flex', gap: '0.4rem' }}>
                            {['Todos', 'Reportado por Vecino', 'Inspección Municipal', 'En Cuadrilla (AyA/CNFL)', 'Resuelto'].map(st => (
                                <button
                                    key={st}
                                    onClick={() => setNoticeFilter(st)}
                                    style={{
                                        padding: '0.35rem 0.75rem',
                                        borderRadius: '20px',
                                        fontSize: '0.78rem',
                                        fontWeight: '700',
                                        border: noticeFilter === st ? '1px solid #002B7F' : '1px solid #CBD5E1',
                                        backgroundColor: noticeFilter === st ? '#E0E7FF' : '#FFFFFF',
                                        color: noticeFilter === st ? '#002B7F' : '#64748B',
                                        cursor: 'pointer'
                                    }}
                                >
                                    {st}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {notices
                            .filter(n => noticeFilter === 'Todos' ? true : n.status === noticeFilter)
                            .map(notice => (
                                <div key={notice.id} className="stitch-card" style={{ padding: '1.35rem' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '0.65rem' }}>
                                        <div>
                                            <span style={{ fontSize: '0.75rem', fontWeight: '800', color: '#002B7F', backgroundColor: '#E2E8F0', padding: '0.2rem 0.5rem', borderRadius: '4px', marginRight: '0.5rem' }}>
                                                {notice.caseNumber || `EXP-${notice.id}`}
                                            </span>
                                            <strong style={{ fontSize: '1.1rem', color: '#0F172A' }}>{notice.title}</strong>
                                            <div style={{ fontSize: '0.82rem', color: '#64748B', marginTop: '0.3rem' }}>
                                                Sector: <strong>{notice.sector || 'San Juan de Dios'}</strong> • Fecha: {notice.date} • <strong>{notice.votes || 0} vecinos afectados</strong>
                                            </div>
                                        </div>

                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            <label style={{ fontSize: '0.78rem', fontWeight: '700', color: '#64748B' }}>Ciclo Oficial:</label>
                                            <select
                                                value={notice.status}
                                                onChange={e => handleStatusNotice(notice, e.target.value)}
                                                style={{
                                                    padding: '0.35rem 0.65rem',
                                                    fontSize: '0.82rem',
                                                    fontWeight: '700',
                                                    borderRadius: '4px',
                                                    border: '1px solid #CBD5E1',
                                                    backgroundColor: '#FFFFFF'
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
                                                style={{ padding: '0.35rem 0.5rem', border: '1px solid #FCA5A5', backgroundColor: '#FEE2E2', borderRadius: '4px', cursor: 'pointer', color: '#991B1B' }}
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    </div>

                                    <p style={{ margin: '0 0 0.65rem 0', fontSize: '0.88rem', color: '#334155', lineHeight: 1.5 }}>
                                        {notice.description}
                                    </p>

                                    {notice.internalNote && (
                                        <div style={{ backgroundColor: '#F8FAFC', borderLeft: '3px solid #D97706', padding: '0.55rem 0.85rem', fontSize: '0.82rem', color: '#64748B' }}>
                                            <strong>Bitácora de Cuadrilla:</strong> {notice.internalNote}
                                        </div>
                                    )}
                                </div>
                            ))}
                    </div>
                </div>
            )}

            {/* ========================================== */}
            {/* PESTAÑA 4: TRIBUNA & DENUNCIAS (FORO) */}
            {/* ========================================== */}
            {activeTab === 'complaintsMod' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    <div>
                        <h2 style={{ fontSize: '1.25rem', fontWeight: '800', margin: '0 0 0.25rem 0', color: '#0F172A' }}>
                            Mesa de Moderación de Denuncias y Foro Ciudadano ({complaints.length})
                        </h2>
                        <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748B' }}>
                            Las denuncias requieren autorización de la Junta Directiva antes de publicarse en la tribuna comunal.
                        </p>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {complaints.map(c => (
                            <div key={c.id} className="stitch-card" style={{ padding: '1.35rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                                <div style={{ maxWidth: '650px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.3rem' }}>
                                        <strong style={{ fontSize: '1.05rem', color: '#0F172A' }}>{c.title}</strong>
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
                                    <p style={{ margin: '0 0 0.35rem 0', fontSize: '0.85rem', color: '#64748B' }}>
                                        <strong>Autor:</strong> {c.authorName} ({c.isAnonymous ? 'Anónimo' : 'Identificado'}) • <strong>Sector:</strong> {c.sector} • <strong>Categoría:</strong> {c.category}
                                    </p>
                                    <p style={{ margin: '0 0 0.45rem 0', fontSize: '0.88rem', color: '#334155' }}>{c.description}</p>
                                    {c.imageUrl && (
                                        <a href={c.imageUrl} target="_blank" rel="noreferrer" style={{ fontSize: '0.78rem', color: '#002B7F', fontWeight: '700', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                                            <Eye size={13} /> Ver Fotografía Adjunta
                                        </a>
                                    )}
                                </div>

                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                    {c.status !== 'Aprobada' && (
                                        <button
                                            onClick={() => handleApproveComplaint(c)}
                                            style={{ padding: '0.5rem 0.95rem', fontSize: '0.82rem', fontWeight: '700', borderRadius: '4px', border: 'none', backgroundColor: '#059669', color: 'white', cursor: 'pointer' }}
                                        >
                                            Aprobar y Publicar
                                        </button>
                                    )}
                                    <button
                                        onClick={() => handleDeleteComplaint(c)}
                                        style={{ padding: '0.5rem 0.85rem', fontSize: '0.82rem', fontWeight: '700', borderRadius: '4px', border: '1px solid #FCA5A5', backgroundColor: '#FEE2E2', color: '#991B1B', cursor: 'pointer' }}
                                    >
                                        Descartar
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* ========================================== */}
            {/* PESTAÑA 5: GESTIÓN DE COMERCIOS */}
            {/* ========================================== */}
            {activeTab === 'businesses' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                        <div>
                            <h2 style={{ fontSize: '1.25rem', fontWeight: '800', margin: '0 0 0.25rem 0', color: '#0F172A' }}>
                                Patentes y Auditoría del Directorio Comercial ({businesses.length})
                            </h2>
                            <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748B' }}>
                                Validación de comercios distritales para su difusión en el mapa y directorio vecinal.
                            </p>
                        </div>

                        <div style={{ position: 'relative', width: '280px' }}>
                            <Search size={15} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#64748B' }} />
                            <input
                                type="text"
                                placeholder="Filtrar por nombre comercial..."
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '0.45rem 0.75rem 0.45rem 2.2rem',
                                    fontSize: '0.85rem',
                                    borderRadius: '4px',
                                    border: '1px solid #CBD5E1'
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
                                            <span style={{ fontWeight: '800', fontSize: '1.05rem', color: '#0F172A' }}>{biz.name}</span>
                                            <span style={{
                                                fontSize: '0.72rem',
                                                fontWeight: '800',
                                                padding: '0.15rem 0.5rem',
                                                borderRadius: '4px',
                                                backgroundColor: biz.verified ? '#DCFCE7' : '#FEF3C7',
                                                color: biz.verified ? '#166534' : '#92400E'
                                            }}>
                                                {biz.verified ? 'Verificado ADI' : 'Pendiente Verificación'}
                                            </span>
                                        </div>
                                        <p style={{ margin: '0 0 0.25rem 0', fontSize: '0.85rem', color: '#64748B' }}>
                                            <strong>Categoría:</strong> {biz.category} • <strong>Ubicación:</strong> {biz.address} • <strong>Teléfono:</strong> {biz.phone || 'No indicado'}
                                        </p>
                                        <p style={{ margin: 0, fontSize: '0.82rem', color: '#334155' }}>{biz.description}</p>
                                    </div>

                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                        {biz.verified ? (
                                            <button
                                                onClick={() => handleToggleBusiness(biz, false)}
                                                style={{ padding: '0.45rem 0.85rem', fontSize: '0.82rem', fontWeight: '700', borderRadius: '4px', border: '1px solid #CBD5E1', backgroundColor: '#F8FAFC', cursor: 'pointer' }}
                                            >
                                                Suspender
                                            </button>
                                        ) : (
                                            <button
                                                onClick={() => handleToggleBusiness(biz, true)}
                                                style={{ padding: '0.45rem 0.85rem', fontSize: '0.82rem', fontWeight: '700', borderRadius: '4px', border: 'none', backgroundColor: '#059669', color: 'white', cursor: 'pointer' }}
                                            >
                                                Aprobar Patente
                                            </button>
                                        )}
                                        <button
                                            onClick={() => handleDeleteBusiness(biz)}
                                            style={{ padding: '0.45rem 0.75rem', fontSize: '0.82rem', fontWeight: '700', borderRadius: '4px', border: '1px solid #FCA5A5', backgroundColor: '#FEE2E2', color: '#991B1B', cursor: 'pointer' }}
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                    </div>
                </div>
            )}

            {/* ========================================== */}
            {/* PESTAÑA 6: TRÁMITES Y SOLICITUDES */}
            {/* ========================================== */}
            {activeTab === 'proceduresTab' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    <div>
                        <h2 style={{ fontSize: '1.25rem', fontWeight: '800', margin: '0 0 0.25rem 0', color: '#0F172A' }}>
                            Gestión de Solicitudes y Permisos de Espacios Comunales ({procedures.length})
                        </h2>
                        <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748B' }}>
                            Peticiones de uso del Salón Comunal y la Plaza de Deportes para eventos comunales o privados.
                        </p>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {procedures.map(p => (
                            <div key={p.id} className="stitch-card" style={{ padding: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                                <div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                                        <strong style={{ fontSize: '1.05rem', color: '#0F172A' }}>{p.type}</strong>
                                        <span style={{ fontSize: '0.75rem', fontWeight: '800', padding: '0.15rem 0.5rem', borderRadius: '4px', backgroundColor: p.status === 'Aprobado' ? '#DCFCE7' : '#FEF3C7', color: p.status === 'Aprobado' ? '#166534' : '#92400E' }}>
                                            {p.status}
                                        </span>
                                    </div>
                                    <p style={{ margin: '0 0 0.35rem 0', fontSize: '0.85rem', color: '#64748B' }}>
                                        Solicitante: <strong>{p.applicant}</strong> ({p.cedula}) • Fecha Solicitada: <strong>{p.dateRequested}</strong>
                                    </p>
                                    <p style={{ margin: 0, fontSize: '0.85rem', color: '#334155' }}>{p.purpose}</p>
                                    {p.notes && (
                                        <div style={{ marginTop: '0.35rem', fontSize: '0.78rem', color: '#64748B', fontStyle: 'italic' }}>
                                            Nota: {p.notes}
                                        </div>
                                    )}
                                </div>

                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                    <button
                                        onClick={() => handleProcedureStatus(p, 'Aprobado')}
                                        style={{ padding: '0.45rem 0.85rem', fontSize: '0.82rem', fontWeight: '700', borderRadius: '4px', border: 'none', backgroundColor: '#059669', color: 'white', cursor: 'pointer' }}
                                    >
                                        Aprobar
                                    </button>
                                    <button
                                        onClick={() => handleProcedureStatus(p, 'Rechazado')}
                                        style={{ padding: '0.45rem 0.85rem', fontSize: '0.82rem', fontWeight: '700', borderRadius: '4px', border: '1px solid #CBD5E1', backgroundColor: '#F8FAFC', cursor: 'pointer' }}
                                    >
                                        Rechazar
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* ========================================== */}
            {/* PESTAÑA 7: PRESUPUESTO PARTICIPATIVO */}
            {/* ========================================== */}
            {activeTab === 'budgetTab' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div>
                        <h2 style={{ fontSize: '1.25rem', fontWeight: '800', margin: '0 0 0.25rem 0', color: '#0F172A' }}>
                            Ejecución de Fondos y Presupuesto Cantonal ADI
                        </h2>
                        <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748B' }}>
                            Control financiero de partidas de bacheo, alumbrado y obras de infraestructura comunal.
                        </p>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                        {budgets.map(b => (
                            <div key={b.id} className="stitch-card" style={{ padding: '1.5rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.75rem' }}>
                                    <div>
                                        <span style={{ fontSize: '0.75rem', fontWeight: '800', color: '#002B7F', backgroundColor: '#E2E8F0', padding: '0.2rem 0.5rem', borderRadius: '4px', marginRight: '0.5rem' }}>
                                            {b.code}
                                        </span>
                                        <strong style={{ fontSize: '1.1rem', color: '#0F172A' }}>{b.title}</strong>
                                        <div style={{ fontSize: '0.8rem', color: '#64748B', marginTop: '0.25rem' }}>
                                            Unidad Responsable: <strong>{b.department}</strong> • Estado: <strong>{b.status}</strong>
                                        </div>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <div style={{ fontSize: '1.3rem', fontWeight: '900', color: '#002B7F' }}>
                                            ₡{b.budgetExecuted.toLocaleString('es-CR')} / ₡{b.budgetTotal.toLocaleString('es-CR')}
                                        </div>
                                        <div style={{ fontSize: '0.78rem', color: '#64748B' }}>Ejecución Financiera: {b.progressPercent}%</div>
                                    </div>
                                </div>
                                <div style={{ width: '100%', height: '10px', backgroundColor: '#E2E8F0', borderRadius: '5px', overflow: 'hidden' }}>
                                    <div style={{ width: `${b.progressPercent}%`, height: '100%', backgroundColor: b.progressPercent === 100 ? '#059669' : '#002B7F' }} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* ========================================== */}
            {/* PESTAÑA 8: PADRÓN DE USUARIOS */}
            {/* ========================================== */}
            {activeTab === 'users' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div>
                        <h2 style={{ fontSize: '1.25rem', fontWeight: '800', margin: '0 0 0.25rem 0', color: '#0F172A' }}>
                            Padrón Digital Distrital y Control de Acceso ({usersList.length})
                        </h2>
                        <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748B' }}>
                            Gestión de credenciales de vecinos registrados, asignación de roles y estados de cuenta.
                        </p>
                    </div>

                    <div className="stitch-card" style={{ padding: 0, overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
                            <thead>
                                <tr style={{ backgroundColor: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
                                    <th style={{ padding: '0.75rem 1rem' }}>Nombre Completo</th>
                                    <th style={{ padding: '0.75rem 1rem' }}>Cédula</th>
                                    <th style={{ padding: '0.75rem 1rem' }}>Correo Electrónico</th>
                                    <th style={{ padding: '0.75rem 1rem' }}>Rol</th>
                                    <th style={{ padding: '0.75rem 1rem' }}>Estado</th>
                                    <th style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>Acción</th>
                                </tr>
                            </thead>
                            <tbody>
                                {usersList.map(u => (
                                    <tr key={u.id} style={{ borderBottom: '1px solid #E2E8F0' }}>
                                        <td style={{ padding: '0.75rem 1rem', fontWeight: '700' }}>{u.name}</td>
                                        <td style={{ padding: '0.75rem 1rem', color: '#64748B' }}>{u.cedula || 'En trámite'}</td>
                                        <td style={{ padding: '0.75rem 1rem' }}>{u.email}</td>
                                        <td style={{ padding: '0.75rem 1rem' }}>
                                            <select
                                                value={u.role}
                                                onChange={e => handleChangeRole(u, e.target.value)}
                                                style={{ padding: '0.25rem 0.45rem', fontSize: '0.78rem', borderRadius: '4px', border: '1px solid #CBD5E1' }}
                                            >
                                                <option value="user">Vecino (user)</option>
                                                <option value="moderator">Comité / Moderador</option>
                                                <option value="admin">Junta Directiva (admin)</option>
                                            </select>
                                        </td>
                                        <td style={{ padding: '0.75rem 1rem' }}>
                                            <span style={{ fontSize: '0.72rem', fontWeight: '800', padding: '0.15rem 0.5rem', borderRadius: '4px', backgroundColor: u.status === 'Suspendido' ? '#FEE2E2' : '#DCFCE7', color: u.status === 'Suspendido' ? '#991B1B' : '#166534' }}>
                                                {u.status || 'Activo'}
                                            </span>
                                        </td>
                                        <td style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>
                                            <button
                                                onClick={() => handleToggleUserStatus(u)}
                                                style={{ fontSize: '0.75rem', fontWeight: '700', padding: '0.25rem 0.6rem', borderRadius: '4px', border: '1px solid #CBD5E1', backgroundColor: '#FFFFFF', cursor: 'pointer' }}
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

            {/* ========================================== */}
            {/* PESTAÑA 9: BOLETINES OFICIALES */}
            {/* ========================================== */}
            {activeTab === 'bulletins' && (
                <div style={{ display: 'grid', gridTemplateColumns: 'minmax(320px, 1fr) 2fr', gap: '2rem' }}>

                    <div className="stitch-card" style={{ padding: '1.5rem', height: 'fit-content' }}>
                        <h3 style={{ fontSize: '1.1rem', fontWeight: '800', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#0F172A' }}>
                            <PlusCircle size={18} color="#002B7F" /> Emitir Comunicado Oficial
                        </h3>
                        <form onSubmit={handleCreateBulletin} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: '700', marginBottom: '0.25rem' }}>Título</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="Ej: Convocatoria a Presupuesto Participativo"
                                    value={newBulletin.title}
                                    onChange={e => setNewBulletin({ ...newBulletin, title: e.target.value })}
                                    style={{ width: '100%', padding: '0.5rem', fontSize: '0.85rem', borderRadius: '4px', border: '1px solid #CBD5E1' }}
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: '700', marginBottom: '0.25rem' }}>Categoría Institucional</label>
                                <select
                                    value={newBulletin.category}
                                    onChange={e => setNewBulletin({ ...newBulletin, category: e.target.value })}
                                    style={{ width: '100%', padding: '0.5rem', fontSize: '0.85rem', borderRadius: '4px', border: '1px solid #CBD5E1' }}
                                >
                                    <option value="Institucional">Institucional / Asamblea</option>
                                    <option value="Salud Pública">Salud Pública / EBAIS</option>
                                    <option value="Seguridad">Seguridad y Vigilancia</option>
                                    <option value="Vialidad">Vialidad e Infraestructura</option>
                                </select>
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: '700', marginBottom: '0.25rem' }}>Síntesis del Acuerdo</label>
                                <textarea
                                    rows={4}
                                    required
                                    placeholder="Redacte el comunicado oficial..."
                                    value={newBulletin.summary}
                                    onChange={e => setNewBulletin({ ...newBulletin, summary: e.target.value })}
                                    style={{ width: '100%', padding: '0.5rem', fontSize: '0.85rem', borderRadius: '4px', border: '1px solid #CBD5E1', fontFamily: 'inherit' }}
                                />
                            </div>
                            <button
                                type="submit"
                                style={{ backgroundColor: '#002B7F', color: 'white', border: 'none', padding: '0.65rem', fontWeight: '700', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}
                            >
                                <Megaphone size={16} /> Publicar Boletín Comunal
                            </button>
                        </form>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <h3 style={{ fontSize: '1.1rem', fontWeight: '800', margin: 0, color: '#0F172A' }}>
                            Boletines en Circulación ({bulletins.length})
                        </h3>
                        {bulletins.map(bull => (
                            <div key={bull.id} className="stitch-card" style={{ padding: '1.25rem', borderLeft: '4px solid #002B7F' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.35rem' }}>
                                    <span style={{ fontSize: '0.75rem', fontWeight: '800', color: '#002B7F', textTransform: 'uppercase' }}>
                                        {bull.category} • {bull.date}
                                    </span>
                                    <button
                                        onClick={() => handleDeleteBulletin(bull)}
                                        style={{ background: 'none', border: 'none', color: '#DC2626', cursor: 'pointer' }}
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                                <h4 style={{ margin: '0 0 0.35rem 0', fontSize: '1.05rem', color: '#0F172A' }}>{bull.title}</h4>
                                <p style={{ margin: 0, fontSize: '0.85rem', color: '#475569' }}>{bull.summary}</p>
                                <div style={{ marginTop: '0.65rem', fontSize: '0.75rem', color: '#64748B', fontWeight: '600' }}>
                                    Emitido por: {bull.author}
                                </div>
                            </div>
                        ))}
                    </div>

                </div>
            )}

            {/* ========================================== */}
            {/* PESTAÑA 10: BITÁCORA DE AUDITORÍA */}
            {/* ========================================== */}
            {activeTab === 'audit' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    <div>
                        <h2 style={{ fontSize: '1.25rem', fontWeight: '800', margin: '0 0 0.25rem 0', color: '#0F172A' }}>
                            Bitácora Inmutable de Auditoría Gubernamental
                        </h2>
                        <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748B' }}>
                            Trazabilidad total de cada acción administrativa ejecutada en la plataforma distrital.
                        </p>
                    </div>

                    <div className="stitch-card" style={{ padding: 0, overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.84rem' }}>
                            <thead>
                                <tr style={{ backgroundColor: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
                                    <th style={{ padding: '0.75rem 1rem' }}>Fecha y Hora</th>
                                    <th style={{ padding: '0.75rem 1rem' }}>Operador Responsable</th>
                                    <th style={{ padding: '0.75rem 1rem' }}>Acción</th>
                                    <th style={{ padding: '0.75rem 1rem' }}>Objetivo</th>
                                    <th style={{ padding: '0.75rem 1rem' }}>Detalle de la Operación</th>
                                </tr>
                            </thead>
                            <tbody>
                                {auditLogs.map(log => (
                                    <tr key={log.id} style={{ borderBottom: '1px solid #E2E8F0' }}>
                                        <td style={{ padding: '0.75rem 1rem', whiteSpace: 'nowrap', color: '#64748B' }}>
                                            {log.timestamp ? new Date(log.timestamp).toLocaleString('es-CR') : '24/09/2026 14:00'}
                                        </td>
                                        <td style={{ padding: '0.75rem 1rem', fontWeight: '700' }}>{log.user}</td>
                                        <td style={{ padding: '0.75rem 1rem' }}>
                                            <span style={{ fontSize: '0.72rem', fontWeight: '800', padding: '0.15rem 0.5rem', borderRadius: '4px', backgroundColor: '#E0E7FF', color: '#002B7F' }}>
                                                {log.action}
                                            </span>
                                        </td>
                                        <td style={{ padding: '0.75rem 1rem', fontWeight: '600' }}>{log.target}</td>
                                        <td style={{ padding: '0.75rem 1rem', color: '#475569' }}>{log.details}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}


            {/* ========================================== */}
            {/* 5 NUEVAS PESTAÑAS (MODULOS ADI)            */}
            {/* ========================================== */}
            {activeTab === 'marketplaceAdmin' && <AdminMarketplaceTab />}
            {activeTab === 'fiscalizationAdmin' && <AdminFiscalizationTab />}
            {activeTab === 'jobsAdmin' && <AdminJobsTab />}
            {activeTab === 'reelsAdmin' && <AdminReelsTab />}
            {activeTab === 'actasAdmin' && <AdminActasTab />}
            {activeTab === 'petsAlertsAdmin' && <AdminPetsAlertsTab />}

        </div>
    );
};