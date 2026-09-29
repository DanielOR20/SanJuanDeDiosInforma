import re

path = r'c:\Users\LENOV\OneDrive\Documents\Proyecto Final Daniel\SanJuanDeDiosInforma\src\services\api.js'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

new_func = """
export const updateReelComments = async (id, comments) => {
  const res = await fetch(`${API_URL}/communityReels/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ comments })
  });
  if (!res.ok) throw new Error('Error al publicar comentario en reel');
  return res.json();
};
"""

if 'updateReelComments' not in content:
    with open(path, 'a', encoding='utf-8') as f:
        f.write(new_func)
