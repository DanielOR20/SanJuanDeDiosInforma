import re

path = r'c:\Users\LENOV\OneDrive\Documents\Proyecto Final Daniel\SanJuanDeDiosInforma\src\services\api.js'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

new_funcs = """
export const getBusRoutesLared = async () => {
  const res = await fetch(`${API_URL}/busRoutesLared`);
  if (!res.ok) throw new Error('Error al obtener rutas de buses');
  return res.json();
};

export const getDistrictSchedule = async () => {
  const res = await fetch(`${API_URL}/districtSchedule`);
  if (!res.ok) throw new Error('Error al obtener cronograma');
  return res.json();
};
"""

if 'getBusRoutesLared' not in content:
    with open(path, 'a', encoding='utf-8') as f:
        f.write(new_funcs)
