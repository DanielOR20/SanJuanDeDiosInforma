import re

path = r'c:\Users\LENOV\OneDrive\Documents\Proyecto Final Daniel\SanJuanDeDiosInforma\src\services\api.js'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# Replace BASE_URL with API_URL globally
content = content.replace("BASE_URL", "API_URL")

# Append missing jobs functions if they don't exist
jobs_funcs = """
export const getJobs = async () => {
  const res = await fetch(`${API_URL}/jobs`);
  if (!res.ok) throw new Error('Error al obtener empleos');
  return res.json();
};

export const updateJobStatus = async (id, status) => {
  const res = await fetch(`${API_URL}/jobs/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status })
  });
  if (!res.ok) throw new Error('Error al actualizar empleo');
  return res.json();
};

export const deleteJob = async (id) => {
  const res = await fetch(`${API_URL}/jobs/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Error al eliminar empleo');
  return res.json();
};
"""

if "export const deleteJob = async" not in content:
    content += jobs_funcs

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
