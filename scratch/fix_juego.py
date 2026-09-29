import re

with open(r'c:\Users\LENOV\OneDrive\Documents\Proyecto Final Daniel\SanJuanDeDiosInforma\src\pages\Juego.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Image upload state
img_state = """    const [caciqueImage, setCaciqueImage] = useState(null);
    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const url = URL.createObjectURL(file);
            const img = new Image();
            img.onload = () => setCaciqueImage(img);
            img.src = url;
        }
    };
"""
content = re.sub(r'(const \[totalCoins, setTotalCoins\] = useState\(4\);\n)', r'\1\n' + img_state, content)

# 2. Key events - e.repeat and visibilitychange
key_events = """
        const onKeyDown = (e) => {
            if (e.repeat) return;
            if (['ArrowUp', 'KeyW', 'Space'].includes(e.code)) {
                keysRef.current.up = true;
                e.preventDefault();
            }
            if (['ArrowLeft', 'KeyA'].includes(e.code)) {
                keysRef.current.left = true;
                e.preventDefault();
            }
            if (['ArrowRight', 'KeyD'].includes(e.code)) {
                keysRef.current.right = true;
                e.preventDefault();
            }
            
            if (['KeyF', 'Enter'].includes(e.code) || (e.code === 'Space' && player.hasTorch)) {
                if (player.hasTorch && fireballs.length < 3) {
                    fireballs.push({
                        x: player.x + player.width,
                        y: player.y + 10,
                        vx: 7,
                        vy: 0,
                        life: 60
                    });
                    playSfx('boost');
                }
            }
        };

        const onKeyUp = (e) => {
            if (['ArrowUp', 'KeyW', 'Space'].includes(e.code)) keysRef.current.up = false;
            if (['ArrowLeft', 'KeyA'].includes(e.code)) keysRef.current.left = false;
            if (['ArrowRight', 'KeyD'].includes(e.code)) keysRef.current.right = false;
        };

        const onBlur = () => resetKeys();
        const onVisibilityChange = () => {
            if (document.hidden) resetKeys();
        };

        window.addEventListener('keydown', onKeyDown);
        window.addEventListener('keyup', onKeyUp);
        window.addEventListener('blur', onBlur);
        document.addEventListener('visibilitychange', onVisibilityChange);
"""

content = re.sub(r"(const onKeyDown = \(e\) => \{[\s\S]*?window\.addEventListener\('blur', onBlur\);)", key_events, content)

# Don't forget to remove the event listeners in the return of useEffect
cleanup = """
            window.removeEventListener('keydown', onKeyDown);
            window.removeEventListener('keyup', onKeyUp);
            window.removeEventListener('blur', onBlur);
            document.removeEventListener('visibilitychange', onVisibilityChange);
"""
content = re.sub(r"(window\.removeEventListener\('keydown', onKeyDown\);\s*window\.removeEventListener\('keyup', onKeyUp\);\s*window\.removeEventListener\('blur', onBlur\);)", cleanup, content)

# 3. Draw cacique with image
draw_cacique = """
            // DRAW CACIQUE
            if (caciqueEncounter.active) {
                ctx.save();
                ctx.translate(caciqueEncounter.x, caciqueEncounter.y + Math.sin(Date.now()*0.005)*5);
                
                // Cacique Body (Plasticina)
                const cGrad = ctx.createRadialGradient(0, -10, 5, 0, 0, 20);
                cGrad.addColorStop(0, '#FCA5A5');
                cGrad.addColorStop(1, '#B91C1C');
                ctx.fillStyle = cGrad;
                ctx.beginPath();
                ctx.roundRect(-15, -20, 30, 40, 15);
                ctx.fill();
                
                // Head
                if (caciqueImage) {
                    ctx.save();
                    ctx.beginPath();
                    ctx.arc(0, -30, 15, 0, Math.PI * 2);
                    ctx.clip();
                    ctx.drawImage(caciqueImage, -15, -45, 30, 30);
                    ctx.restore();
                    // Border plasticina
                    ctx.strokeStyle = '#B91C1C';
                    ctx.lineWidth = 2;
                    ctx.beginPath();
                    ctx.arc(0, -30, 15, 0, Math.PI * 2);
                    ctx.stroke();
                } else {
                    ctx.fillStyle = '#FCA5A5';
                    ctx.beginPath();
                    ctx.arc(0, -30, 15, 0, Math.PI*2);
                    ctx.fill();
                }
                
                // Plumas
                ctx.fillStyle = '#DC2626';
                ctx.beginPath(); ctx.ellipse(-5, -45, 4, 15, -0.3, 0, Math.PI*2); ctx.fill();
                ctx.fillStyle = '#FDE047';
                ctx.beginPath(); ctx.ellipse(5, -45, 4, 15, 0.3, 0, Math.PI*2); ctx.fill();

                if (caciqueEncounter.phase === 'warning') {
                    ctx.fillStyle = '#EF4444';
                    ctx.font = 'bold 20px sans-serif';
                    ctx.fillText('!', 20, -30);
                }
                ctx.restore();
            }
"""
content = re.sub(r"(// DRAW CACIQUE[\s\S]*?ctx\.restore\(\);\s*\})", draw_cacique, content)

# 4. Add the input for the photo
input_html = """
            <div style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '1rem', backgroundColor: '#F8FAFC', padding: '0.75rem', borderRadius: '6px', border: '1px solid #CBD5E1' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: '700', color: '#334155' }}>Foto del Cacique (Opcional):</span>
                <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleImageUpload} 
                    style={{ fontSize: '0.8rem' }}
                />
            </div>
"""
content = re.sub(r"(<div style=\{\{\s*display: 'grid',\s*gridTemplateColumns: 'repeat\(auto-fit, minmax\(180px, 1fr\)\)',)", input_html + r"\n            \1", content)


with open(r'c:\Users\LENOV\OneDrive\Documents\Proyecto Final Daniel\SanJuanDeDiosInforma\src\pages\Juego.jsx', 'w', encoding='utf-8') as f:
    f.write(content)
