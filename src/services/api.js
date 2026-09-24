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