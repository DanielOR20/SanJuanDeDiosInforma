import sys

path = r'c:\Users\LENOV\OneDrive\Documents\Proyecto Final Daniel\SanJuanDeDiosInforma\src\pages\Home.jsx'
with open(path, 'r', encoding='utf-8') as f:
    c = f.read()

if 'import HeroCarousel' not in c:
    c = c.replace("import { Link } from 'react-router-dom';", "import { Link } from 'react-router-dom';\nimport HeroCarousel from '../components/HeroCarousel';")

if '<HeroCarousel />' not in c:
    c = c.replace('return (\n    <div className="stitch-container" style={{ padding: \'2rem 1rem 4rem 1rem\' }}>', 'return (\n    <>\n      <HeroCarousel />\n      <div className="stitch-container" style={{ padding: \'2rem 1rem 4rem 1rem\' }}>')
    # Because there's a lot of nested divs, replace the last </div>\n  );\n};\n
    # A safer way to replace the last occurrence:
    c = c.rsplit('  );\n};\n', 1)
    c = '  );\n};\n'.join(c)
    # wait, rsplit splits from right.
    # Actually just replacing the exact end of file:
    
    parts = c.rsplit('    </div>\n  );\n};\n', 1)
    if len(parts) == 2:
        c = parts[0] + '    </div>\n    </>\n  );\n};\n'

with open(path, 'w', encoding='utf-8') as f:
    f.write(c)
