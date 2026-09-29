import re

path = r'c:\Users\LENOV\OneDrive\Documents\Proyecto Final Daniel\SanJuanDeDiosInforma\src\services\api.js'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

new_funcs = """
export const getFormalDenunciations = async () => {
  const res = await fetch(`${BASE_URL}/formalDenunciations`);
  if (!res.ok) throw new Error('Error al obtener denuncias formales');
  return res.json();
};

export const getJobs = async () => {
  const res = await fetch(`${BASE_URL}/jobs`);
  if (!res.ok) throw new Error('Error al obtener empleos');
  return res.json();
};

export const updateJobStatus = async (id, status) => {
  const res = await fetch(`${BASE_URL}/jobs/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status })
  });
  if (!res.ok) throw new Error('Error al actualizar empleo');
  return res.json();
};

export const deleteJob = async (id) => {
  const res = await fetch(`${BASE_URL}/jobs/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Error al eliminar empleo');
  return res.json();
};
"""

if "getFormalDenunciations" not in content:
    with open(path, 'a', encoding='utf-8') as f:
        f.write(new_funcs)
