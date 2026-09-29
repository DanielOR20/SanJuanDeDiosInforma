import re

path = r'c:\Users\LENOV\OneDrive\Documents\Proyecto Final Daniel\SanJuanDeDiosInforma\src\services\api.js'

with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

new_api = """
// --- MASCOTAS COMUNITARIAS ---
export const getCommunityPets = async () => {
  const res = await fetch(`${API_URL}/communityPets`);
  if (!res.ok) throw new Error('Error al obtener mascotas');
  return res.json();
};

export const createCommunityPet = async (petData) => {
  const res = await fetch(`${API_URL}/communityPets`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...petData, date: new Date().toISOString().split('T')[0] })
  });
  if (!res.ok) throw new Error('Error al reportar mascota');
  return res.json();
};

export const deleteCommunityPet = async (id) => {
  const res = await fetch(`${API_URL}/communityPets/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Error al eliminar reporte de mascota');
  return res.json();
};

// --- EMERGENCIAS Y ALERTAS ADI ---
export const getEmergencyAlerts = async () => {
  const res = await fetch(`${API_URL}/emergencyAlerts`);
  if (!res.ok) throw new Error('Error al obtener alertas de emergencia');
  return res.json();
};

export const toggleEmergencyAlert = async (id, active) => {
  const res = await fetch(`${API_URL}/emergencyAlerts/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ active })
  });
  if (!res.ok) throw new Error('Error al actualizar alerta');
  return res.json();
};
"""

if 'getCommunityPets' not in content:
    with open(path, 'a', encoding='utf-8') as f:
        f.write(new_api)
