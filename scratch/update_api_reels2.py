import re

path = r'c:\Users\LENOV\OneDrive\Documents\Proyecto Final Daniel\SanJuanDeDiosInforma\src\services\api.js'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

new_funcs = """
export const createReel = async (reelData) => {
  const res = await fetch(`${API_URL}/communityReels`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(reelData)
  });
  if (!res.ok) throw new Error('Error al subir reel');
  return res.json();
};

export const updateReelStatus = async (id, status) => {
  const res = await fetch(`${API_URL}/communityReels/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status })
  });
  if (!res.ok) throw new Error('Error al actualizar estado del reel');
  return res.json();
};
"""

if 'createReel' not in content:
    with open(path, 'a', encoding='utf-8') as f:
        f.write(new_funcs)
