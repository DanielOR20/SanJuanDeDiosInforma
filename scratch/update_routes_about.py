import sys

# Update Navbar.jsx
path_nav = r'c:\Users\LENOV\OneDrive\Documents\Proyecto Final Daniel\SanJuanDeDiosInforma\src\components\Navbar.jsx'
with open(path_nav, 'r', encoding='utf-8') as f:
    n = f.read()

# Add after Inicio
if '/distrito' not in n:
    n = n.replace('<NavLink to="/" onClick={closeMenu} className={({ isActive }) => isActive ? \'nav-link active\' : \'nav-link\'}>\n            Inicio\n          </NavLink>', '<NavLink to="/" onClick={closeMenu} className={({ isActive }) => isActive ? \'nav-link active\' : \'nav-link\'}>\n            Inicio\n          </NavLink>\n          <NavLink to="/distrito" onClick={closeMenu} className={({ isActive }) => isActive ? \'nav-link active\' : \'nav-link\'}>\n            Nuestro Distrito\n          </NavLink>')

with open(path_nav, 'w', encoding='utf-8') as f:
    f.write(n)


# Update AppRoutes.jsx
path_routes = r'c:\Users\LENOV\OneDrive\Documents\Proyecto Final Daniel\SanJuanDeDiosInforma\src\routes\AppRoutes.jsx'
with open(path_routes, 'r', encoding='utf-8') as f:
    r = f.read()

if 'AboutDistrict' not in r:
    r = r.replace('import { Home } from \'../pages/Home\';', 'import { Home } from \'../pages/Home\';\nimport AboutDistrict from \'../pages/AboutDistrict\';')

if '/distrito' not in r:
    r = r.replace('<Route path="/" element={<Home />} />', '<Route path="/" element={<Home />} />\n        <Route path="/distrito" element={<AboutDistrict />} />')

with open(path_routes, 'w', encoding='utf-8') as f:
    f.write(r)
