import re

path = r'c:\Users\LENOV\OneDrive\Documents\Proyecto Final Daniel\SanJuanDeDiosInforma\src\services\api.js'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

new_funcs = """
// --- MARKETPLACE COMUNAL ---
export const getMarketplaceItems = async () => {
  const res = await fetch(`${BASE_URL}/marketplaceItems`);
  if (!res.ok) throw new Error('Error al obtener productos');
  return res.json();
};

export const createMarketplaceItem = async (itemData) => {
  const payload = {
    ...itemData,
    status: 'pending', // Requiere aprobación en panel ADI
    date: new Date().toISOString().split('T')[0]
  };
  const res = await fetch(`${BASE_URL}/marketplaceItems`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error('Error al publicar artículo');
  return res.json();
};

export const updateMarketplaceItemStatus = async (id, status) => {
  const res = await fetch(`${BASE_URL}/marketplaceItems/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status })
  });
  if (!res.ok) throw new Error('Error al actualizar estado del artículo');
  return res.json();
};

export const deleteMarketplaceItem = async (id) => {
  const res = await fetch(`${BASE_URL}/marketplaceItems/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Error al eliminar artículo');
  return res.json();
};

// --- SERVICIOS GLOBALES DE MODERACIÓN ADI ---
export const updateDenunciationStatus = async (id, status, resolutionNote) => {
  const res = await fetch(`${BASE_URL}/formalDenunciations/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status, resolutionNote })
  });
  if (!res.ok) throw new Error('Error al moderar denuncia');
  return res.json();
};

export const deleteReel = async (id) => {
  const res = await fetch(`${BASE_URL}/communityReels/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Error al eliminar reel');
  return res.json();
};
"""

if "getMarketplaceItems" not in content:
    with open(path, 'a', encoding='utf-8') as f:
        f.write(new_funcs)
