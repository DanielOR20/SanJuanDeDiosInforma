const API_URL = 'http://localhost:5000';

// ==========================================
// 1. CLIMA (Open-Meteo para San Juan de Dios)
// ==========================================
export const getLocalWeather = async () => {
  const url = 'https://api.open-meteo.com/v1/forecast?latitude=9.8940&longitude=-84.0740&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&timezone=America%2FCosta_Rica';
  const res = await fetch(url);
  if (!res.ok) throw new Error('Error al consultar el clima exterior');
  return res.json();
};

// ==========================================
// 2. COMERCIOS LOCALES
// ==========================================
export const getBusinesses = async () => {
  const res = await fetch(`${API_URL}/businesses`);
  if (!res.ok) throw new Error('Error al cargar comercios');
  return res.json();
};

export const createBusiness = async (businessData) => {
  const res = await fetch(`${API_URL}/businesses`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(businessData),
  });
  if (!res.ok) throw new Error('Error al registrar comercio');
  return res.json();
};

export const updateBusinessStatus = async (id, verified) => {
  const res = await fetch(`${API_URL}/businesses/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ verified }),
  });
  if (!res.ok) throw new Error('Error al actualizar estado del comercio');
  return res.json();
};

export const deleteBusiness = async (id) => {
  const res = await fetch(`${API_URL}/businesses/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Error al eliminar comercio');
  return res.json();
};

// ==========================================
// 3. PUNTOS CÍVICOS Y MAPA
// ==========================================
export const getLandmarks = async () => {
  const res = await fetch(`${API_URL}/landmarks`);
  if (!res.ok) throw new Error('Error al obtener puntos cívicos');
  return res.json();
};

// ==========================================
// 4. AVISOS E INCIDENCIAS PÚBLICAS
// ==========================================
export const getNotices = async () => {
  const res = await fetch(`${API_URL}/notices`);
  if (!res.ok) throw new Error('Error al cargar avisos');
  return res.json();
};

export const createNotice = async (noticeData) => {
  const res = await fetch(`${API_URL}/notices`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(noticeData),
  });
  if (!res.ok) throw new Error('Error al publicar aviso');
  return res.json();
};

export const voteNotice = async (notice) => {
  const currentVotes = Number(notice.votes) || 0;
  const res = await fetch(`${API_URL}/notices/${notice.id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ votes: currentVotes + 1 })
  });
  if (!res.ok) throw new Error(`Error en servidor: ${res.status}`);
  return res.json();
};

export const updateNoticeStatus = async (id, status) => {
  const res = await fetch(`${API_URL}/notices/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status })
  });
  if (!res.ok) throw new Error('Error al actualizar estado del reporte');
  return res.json();
};

export const deleteNotice = async (id) => {
  const res = await fetch(`${API_URL}/notices/${id}`, {
    method: 'DELETE'
  });
  if (!res.ok) throw new Error('Error al eliminar el reporte');
  return res.json();
};

// ==========================================
// 5. AUTENTICACIÓN Y PADRÓN DE USUARIOS
// ==========================================
export const authenticateUser = async (email, password) => {
  const res = await fetch(`${API_URL}/users?email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`);
  if (!res.ok) throw new Error('Error al conectar con servidor de autenticación');
  const users = await res.json();
  return users.length > 0 ? users[0] : null;
};

export const registerResident = async (userData) => {
  const res = await fetch(`${API_URL}/users`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      ...userData,
      role: 'user',
      status: 'Activo',
      registeredAt: new Date().toISOString()
    })
  });
  if (!res.ok) throw new Error('Error al registrar usuario');
  return res.json();
};

export const getAllUsers = async () => {
  const res = await fetch(`${API_URL}/users`);
  if (!res.ok) throw new Error('Error al obtener padrón de usuarios');
  return res.json();
};

export const updateUserRoleOrStatus = async (id, payload) => {
  const res = await fetch(`${API_URL}/users/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error('Error al actualizar registro de usuario');
  return res.json();
};

export const deleteUserAccount = async (id) => {
  const res = await fetch(`${API_URL}/users/${id}`, {
    method: 'DELETE'
  });
  if (!res.ok) throw new Error('Error al eliminar usuario');
  return res.json();
};

// ==========================================
// 6. COMUNICADOS OFICIALES (Boletines ADI)
// ==========================================
export const getBulletins = async () => {
  const res = await fetch(`${API_URL}/bulletins`);
  if (!res.ok) throw new Error('Error al obtener boletines');
  return res.json();
};

export const createBulletin = async (bulletinData) => {
  const res = await fetch(`${API_URL}/bulletins`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(bulletinData)
  });
  if (!res.ok) throw new Error('Error al emitir comunicado');
  return res.json();
};

export const deleteBulletin = async (id) => {
  const res = await fetch(`${API_URL}/bulletins/${id}`, {
    method: 'DELETE'
  });
  if (!res.ok) throw new Error('Error al eliminar comunicado');
  return res.json();
};

// ==========================================
// 7. BITÁCORA DE AUDITORÍA (Audit Logs)
// ==========================================
export const getAuditLogs = async () => {
  const res = await fetch(`${API_URL}/auditLogs`);
  if (!res.ok) throw new Error('Error al obtener bitácora');
  return res.json();
};

export const createAuditLog = async (logEntry) => {
  try {
    await fetch(`${API_URL}/auditLogs`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...logEntry,
        timestamp: new Date().toISOString()
      })
    });
  } catch (e) {
    console.warn('No se pudo guardar la auditoría:', e);
  }
};

// ==========================================
// 8. DENUNCIAS PÚBLICAS Y FORO CIUDADANO
// ==========================================
export const getPublicComplaints = async () => {
  const res = await fetch(`${API_URL}/publicComplaints`);
  if (!res.ok) throw new Error('Error al cargar denuncias');
  return res.json();
};

export const createPublicComplaint = async (complaintData) => {
  const res = await fetch(`${API_URL}/publicComplaints`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      ...complaintData,
      date: new Date().toISOString().split('T')[0],
      comments: []
    })
  });
  if (!res.ok) throw new Error('Error al enviar denuncia');
  return res.json();
};

export const updateComplaintStatus = async (id, status) => {
  const res = await fetch(`${API_URL}/publicComplaints/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status })
  });
  if (!res.ok) throw new Error('Error al modificar estado de la denuncia');
  return res.json();
};

export const addComplaintComment = async (complaintId, updatedComments) => {
  const res = await fetch(`${API_URL}/publicComplaints/${complaintId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ comments: updatedComments })
  });
  if (!res.ok) throw new Error('Error al publicar comentario');
  return res.json();
};

export const deleteComplaint = async (id) => {
  const res = await fetch(`${API_URL}/publicComplaints/${id}`, {
    method: 'DELETE'
  });
  if (!res.ok) throw new Error('Error al eliminar denuncia');
  return res.json();
};

// ==========================================
// 9. TRÁMITES COMUNALES Y PRESUPUESTO
// ==========================================
export const getProcedures = async () => {
  const res = await fetch(`${API_URL}/procedures`);
  if (!res.ok) throw new Error('Error al cargar trámites');
  return res.json();
};

export const updateProcedureStatus = async (id, status) => {
  const res = await fetch(`${API_URL}/procedures/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status })
  });
  if (!res.ok) throw new Error('Error al actualizar trámite');
  return res.json();
};

export const getBudgetProjects = async () => {
  const res = await fetch(`${API_URL}/budgetProjects`);
  if (!res.ok) throw new Error('Error al cargar presupuestos');
  return res.json();
};

// ==========================================
// 10. TICKETS DE AYUDA Y ASISTENCIA COMUNAL
// ==========================================
export const getSupportTickets = async () => {
  const res = await fetch(`${API_URL}/supportTickets`);
  if (!res.ok) throw new Error('Error al cargar tickets de soporte');
  return res.json();
};

export const createSupportTicket = async (ticketData) => {
  const res = await fetch(`${API_URL}/supportTickets`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      ...ticketData,
      ticketNumber: `TCK-2026-${Math.floor(100 + Math.random() * 900)}`,
      date: new Date().toISOString().split('T')[0],
      status: 'Abierto',
      response: null
    })
  });
  if (!res.ok) throw new Error('Error al registrar ticket');
  return res.json();
};

export const respondSupportTicket = async (id, responseText) => {
  const res = await fetch(`${API_URL}/supportTickets/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      response: responseText,
      status: 'Resuelto'
    })
  });
  if (!res.ok) throw new Error('Error al responder ticket');
  return res.json();
};

// --- MÓDULOS INSTITUCIONALES (INSPIRACIÓN MUNICIPALIDAD) ---

export const getServicesStatus = async () => {
  const res = await fetch(`${API_URL}/servicesStatus`);
  if (!res.ok) throw new Error('Error al obtener estado de servicios');
  return res.json();
};

export const getWasteSchedule = async () => {
  const res = await fetch(`${API_URL}/wasteSchedule`);
  if (!res.ok) throw new Error('Error al obtener calendario de residuos');
  return res.json();
};

export const createResidencyCertificate = async (certData) => {
  const folio = `CONST-2026-${Math.floor(1000 + Math.random() * 9000)}`;
  const payload = {
    ...certData,
    folio,
    issuedAt: new Date().toISOString().split('T')[0],
    status: 'Emitida'
  };
  const res = await fetch(`${API_URL}/residencyCertificates`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error('Error al emitir constancia comunal');
  return res.json();
};

export const getEmergencyContacts = async () => {
  const res = await fetch(`${API_URL}/emergencyContacts`);
  if (!res.ok) throw new Error('Error al obtener contactos de emergencia');
  return res.json();
};

// --- MÓDULO MODULAR: BOLSA DE EMPLEO Y OFICIOS VECINALES ---

export const getCommunityJobs = async () => {
  const res = await fetch(`${API_URL}/communityJobs`);
  if (!res.ok) throw new Error('Error al obtener la bolsa de empleo');
  return res.json();
};

export const createCommunityJob = async (jobData) => {
  const payload = {
    ...jobData,
    date: new Date().toISOString().split('T')[0]
  };
  const res = await fetch(`${API_URL}/communityJobs`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error('Error al publicar vacante u oficio');
  return res.json();
};

// --- MÓDULO MODULAR: ZONIFICACIÓN Y OBRA MENOR ---

export const getZoningRules = async () => {
  const res = await fetch(`${API_URL}/zoningRules`);
  if (!res.ok) throw new Error('Error al obtener reglas de zonificación');
  return res.json();
};

export const getMinorWorkRules = async () => {
  const res = await fetch(`${API_URL}/minorWorkRules`);
  if (!res.ok) throw new Error('Error al obtener normativas de obra menor');
  return res.json();
};

// --- MÓDULO AMBIENTAL ---

export const getEnvironmentalData = async () => {
  const res = await fetch(`${API_URL}/environmentalData`);
  if (!res.ok) throw new Error('Error al obtener datos ambientales');
  return res.json();
};

export const createMosquitoReport = async (reportData) => {
  const payload = {
    ...reportData,
    date: new Date().toISOString().split('T')[0],
    status: 'Pendiente Inspección'
  };
  const res = await fetch(`${API_URL}/mosquitoReports`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error('Error al registrar reporte de criadero');
  return res.json();
};

// --- MÓDULO MODULAR: TRANSPARENCIA Y ACTAS ADI ---

export const getTransparencyData = async () => {
  const res = await fetch(`${API_URL}/transparencyData`);
  if (!res.ok) throw new Error('Error al obtener datos de transparencia');
  return res.json();
};

export const getDistrictActs = async () => {
  const res = await fetch(`${API_URL}/districtActs`);
  if (!res.ok) throw new Error('Error al obtener actas distritales');
  return res.json();
};

// --- MÓDULO MODULAR: DENUNCIAS CATEGORIZADAS Y FOLIO ---

export const getDenunciationCategories = async () => {
  const res = await fetch(`${BASE_URL}/denunciationCategories`);
  if (!res.ok) throw new Error('Error al obtener categorías de denuncias');
  return res.json();
};

export const getFormalDenunciations = async () => {
  const res = await fetch(`${BASE_URL}/formalDenunciations`);
  if (!res.ok) throw new Error('Error al obtener denuncias formales');
  return res.json();
};

export const createFormalDenunciation = async (data) => {
  const folio = `DEN-2026-${Math.floor(1000 + Math.random() * 9000)}`;
  const payload = {
    ...data,
    folio,
    status: 'Recibida en Plataforma',
    date: new Date().toISOString().split('T')[0],
    resolutionNote: 'Expediente aperturado para asignación de cuadrilla o inspector comunal.'
  };
  const res = await fetch(`${BASE_URL}/formalDenunciations`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error('Error al registrar la denuncia');
  return res.json();
};