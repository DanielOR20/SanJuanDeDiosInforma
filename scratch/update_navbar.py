import re

path = r'c:\Users\LENOV\OneDrive\Documents\Proyecto Final Daniel\SanJuanDeDiosInforma\src\components\Navbar.jsx'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Simplify text
content = content.replace(">Agenda & Servicios<", ">Agenda<")
content = content.replace(">Tribuna & Denuncias<", ">Tribuna<")

# 2. Update styles in CSS string at the bottom
css_old = ".main-nav-links { display: flex; align-items: center; gap: 1.1rem; }"
css_new = ".main-nav-links { display: flex; align-items: center; gap: 0.85rem; font-size: 0.84rem; font-weight: 600; }\n        .nav-link { white-space: nowrap; }"
content = content.replace(css_old, css_new)

# 3. Restructure links to put tools on the right side
old_right_side = """<NavLink to="/asistente" onClick={closeMenu} className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
            Guía IA
          </NavLink>
          <NavLink to="/reels" onClick={closeMenu} className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
            Reels
          </NavLink>
          
          {/* BOTÓN DISCRETO DEL MINIJUEGO (SOLO ÍCONO ELEGANTE) */}
          <NavLink 
            to="/juego" 
            onClick={closeMenu} 
            title="Minijuego Comunal: La Gesta de Rivas"
            className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'} 
            style={{ 
              display: 'inline-flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              padding: '0.4rem 0.55rem',
              borderRadius: '6px',
              backgroundColor: 'var(--surface-subtle)',
              border: '1px solid var(--border)'
            }}
          >
            <Gamepad2 size={18} color="var(--primary)" />
          </NavLink>

          {user?.role === 'admin' && (
            <NavLink to="/admin" onClick={closeMenu} className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'} style={{ color: '#002B7F', fontWeight: '900' }}>
              Panel ADI
            </NavLink>
          )}

          <div style={{ marginLeft: '0.5rem' }} className="auth-btn-wrapper">
            {user ? (
              <button onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', backgroundColor: 'var(--surface-subtle)', color: 'var(--text-main)', border: '1px solid var(--border)', padding: '0.45rem 0.85rem', borderRadius: '4px', fontWeight: '700', fontSize: '0.82rem', cursor: 'pointer' }}>
                <LogOut size={14} /> Salir ({user.name.split(' ')[0]})
              </button>
            ) : (
              <Link to="/login" onClick={closeMenu} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', backgroundColor: '#002B7F', color: 'white', padding: '0.45rem 0.95rem', borderRadius: '4px', fontWeight: '700', fontSize: '0.82rem', textDecoration: 'none' }}>
                <LogIn size={14} /> Ingresar
              </Link>
            )}
          </div>"""

new_right_side = """<NavLink to="/reels" onClick={closeMenu} className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
            Reels
          </NavLink>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginLeft: 'auto' }}>
            <div style={{ borderLeft: '1px solid var(--border)', height: '24px', margin: '0 0.5rem' }}></div>
            
            <NavLink to="/asistente" onClick={closeMenu} className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
              Guía IA
            </NavLink>

            <NavLink 
              to="/juego" 
              onClick={closeMenu} 
              title="Minijuego Comunal: La Gesta de Rivas"
              className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'} 
              style={{ 
                display: 'inline-flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                padding: '0.4rem 0.55rem',
                borderRadius: '6px',
                backgroundColor: 'var(--surface-subtle)',
                border: '1px solid var(--border)'
              }}
            >
              <Gamepad2 size={18} color="var(--primary)" />
            </NavLink>

            {user?.role === 'admin' && (
              <NavLink to="/admin" onClick={closeMenu} className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'} style={{ color: '#002B7F', fontWeight: '900' }}>
                Panel ADI
              </NavLink>
            )}

            <div className="auth-btn-wrapper">
              {user ? (
                <button onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', backgroundColor: 'var(--surface-subtle)', color: 'var(--text-main)', border: '1px solid var(--border)', padding: '0.45rem 0.85rem', borderRadius: '4px', fontWeight: '700', fontSize: '0.82rem', cursor: 'pointer', whiteSpace: 'nowrap' }}>
                  <LogOut size={14} /> Salir ({user.name.split(' ')[0]})
                </button>
              ) : (
                <Link to="/login" onClick={closeMenu} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', backgroundColor: '#002B7F', color: 'white', padding: '0.45rem 0.95rem', borderRadius: '4px', fontWeight: '700', fontSize: '0.82rem', textDecoration: 'none', whiteSpace: 'nowrap' }}>
                  <LogIn size={14} /> Ingresar
                </Link>
              )}
            </div>
          </div>"""

content = content.replace(old_right_side, new_right_side)

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
