import sys

path = r'c:\Users\LENOV\OneDrive\Documents\Proyecto Final Daniel\SanJuanDeDiosInforma\src\routes\MainLayout.jsx'
with open(path, 'r', encoding='utf-8') as f:
    c = f.read()

c = c.replace("import FooterInternal from '../pages/Footer';", "import FooterInternal from '../pages/Footer';\nimport EmergencyBanner from '../components/EmergencyBanner';\nimport EmergencySpeedDial from '../components/EmergencySpeedDial';")
c = c.replace("<Navbar />", "<EmergencyBanner />\n            <Navbar />")
c = c.replace("{!isReels && <FooterInternal />}", "{!isReels && <FooterInternal />}\n            <EmergencySpeedDial />")

with open(path, 'w', encoding='utf-8') as f:
    f.write(c)


path_routes = r'c:\Users\LENOV\OneDrive\Documents\Proyecto Final Daniel\SanJuanDeDiosInforma\src\routes\AppRoutes.jsx'
with open(path_routes, 'r', encoding='utf-8') as f:
    r = f.read()

r = r.replace("import { Juego } from '../pages/Juego';", "import { Juego } from '../pages/Juego';\nimport Pets from '../pages/Pets';")
r = r.replace('<Route path="/juego" element={<Juego />} />', '<Route path="/juego" element={<Juego />} />\n                <Route path="/mascotas" element={<Pets />} />')

with open(path_routes, 'w', encoding='utf-8') as f:
    f.write(r)


path_nav = r'c:\Users\LENOV\OneDrive\Documents\Proyecto Final Daniel\SanJuanDeDiosInforma\src\components\Navbar.jsx'
with open(path_nav, 'r', encoding='utf-8') as f:
    n = f.read()

n = n.replace('<NavLink to="/juego"', '<NavLink to="/mascotas" className={({ isActive }) => `nav-link ${isActive ? \'active\' : \'\'}`} style={{ whiteSpace: \'nowrap\' }}>Mascotas</NavLink>\n          <NavLink to="/juego"')

with open(path_nav, 'w', encoding='utf-8') as f:
    f.write(n)
