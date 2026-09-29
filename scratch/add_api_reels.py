import re

path = r'c:\Users\LENOV\OneDrive\Documents\Proyecto Final Daniel\SanJuanDeDiosInforma\src\services\api.js'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

new_funcs = """
export const getCommunityReels = async () => {
  const res = await fetch(`${BASE_URL}/communityReels`);
  if (!res.ok) throw new Error('Error al cargar reels');
  return res.json();
};

export const updateReelLikes = async (id, newLikes) => {
  const res = await fetch(`${BASE_URL}/communityReels/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ likes: newLikes })
  });
  if (!res.ok) throw new Error('Error al actualizar likes');
  return res.json();
};
"""

if "getCommunityReels" not in content:
    with open(path, 'a', encoding='utf-8') as f:
        f.write(new_funcs)
