const BASE_URL = 'http://localhost:5000';

// --- Servicios Locales (JSON Server) ---

// Comercios
export const getBusinesses = async () => {
    const res = await fetch(`${BASE_URL}/businesses`);
    if (!res.ok) throw new Error('Error al cargar comercios');
    return res.json();
};

export const createBusiness = async (businessData) => {
    const res = await fetch(`${BASE_URL}/businesses`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(businessData),
    });
    if (!res.ok) throw new Error('Error al registrar comercio');
    return res.json();
};

export const updateBusiness = async (id, updatedData) => {
    const res = await fetch(`${BASE_URL}/businesses/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData),
    });
    if (!res.ok) throw new Error('Error al actualizar comercio');
    return res.json();
};

export const deleteBusiness = async (id) => {
    const res = await fetch(`${BASE_URL}/businesses/${id}`, {
        method: 'DELETE',
    });
    if (!res.ok) throw new Error('Error al eliminar comercio');
    return res.json();
};

// Avisos Comunitarios
export const getNotices = async () => {
    const res = await fetch(`${BASE_URL}/notices`);
    if (!res.ok) throw new Error('Error al cargar avisos');
    return res.json();
};

export const createNotice = async (noticeData) => {
    const res = await fetch(`${BASE_URL}/notices`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(noticeData),
    });
    if (!res.ok) throw new Error('Error al publicar aviso');
    return res.json();
};

export const deleteNotice = async (id) => {
    const res = await fetch(`${BASE_URL}/notices/${id}`, {
        method: 'DELETE',
    });
    if (!res.ok) throw new Error('Error al eliminar aviso');
    return res.json();
};

// --- Servicio Externo Real: Clima en San Juan de Dios (Open-Meteo) ---
export const getLocalWeather = async () => {
    // Coordenadas aproximadas de San Juan de Dios de Desamparados (9.89, -84.07)
    const url = 'https://api.open-meteo.com/v1/forecast?latitude=9.89&longitude=-84.07&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&timezone=auto';
    const res = await fetch(url);
    if (!res.ok) throw new Error('Error al consultar el clima exterior');
    return res.json();
};

export const getLandmarks = async () => {
    const response = await fetch(`${API_URL}/landmarks`);
    if (!response.ok) throw new Error('Error al obtener puntos cívicos');
    return response.json();
};