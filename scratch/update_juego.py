import re

with open(r'c:\Users\LENOV\OneDrive\Documents\Proyecto Final Daniel\SanJuanDeDiosInforma\src\pages\Juego.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# ADD CACIQUE ENCOUNTER STATE
cacique_state = """        let caciqueEncounter = {
            active: false,
            timer: 0,
            x: -100,
            y: 40,
            throwsLeft: 0,
            cooldown: 200,
            phase: 'idle' // idle, flying_in, warning, throwing, retreating
        };
        let fireballs = [];
        
        let onScreenFireBtn = false; // flag para disparar desde botón
"""
content = re.sub(r'(let cinematic = \{[^}]*\};\n)', r'\1\n' + cacique_state, content)

# ADD EVENT LISTENER FOR FIREBALL
fireball_logic = """
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
"""
content = re.sub(r"(if \(\['ArrowUp', 'KeyW', 'Space'\]\.includes\(e\.code\)\) \{[\s\S]*?e\.preventDefault\(\);\n            \})", r'\1\n' + fireball_logic, content)

# OVERRIDE BOTTLE SPAWNING AND ADD CACIQUE LOGIC
cacique_logic = """
                // CACIQUE MECHANIC
                if (!caciqueEncounter.active && caciqueEncounter.cooldown <= 0 && totalProg > 800 && totalProg < DIFF_PARAMS.totalDist - 600) {
                    caciqueEncounter.active = true;
                    caciqueEncounter.phase = 'flying_in';
                    caciqueEncounter.x = canvas.width + 50;
                    caciqueEncounter.y = 30 + Math.random() * 40;
                    caciqueEncounter.timer = 0;
                    caciqueEncounter.throwsLeft = 2 + Math.floor(Math.random() * 2);
                }
                if (!caciqueEncounter.active && caciqueEncounter.cooldown > 0) {
                    caciqueEncounter.cooldown--;
                }

                if (caciqueEncounter.active) {
                    caciqueEncounter.timer++;
                    if (caciqueEncounter.phase === 'flying_in') {
                        caciqueEncounter.x -= 3;
                        if (caciqueEncounter.x < player.x + 150) {
                            caciqueEncounter.phase = 'warning';
                            caciqueEncounter.timer = 0;
                        }
                    } else if (caciqueEncounter.phase === 'warning') {
                        // Flotando y haciendo advertencia
                        caciqueEncounter.y += Math.sin(caciqueEncounter.timer * 0.1) * 0.5;
                        if (caciqueEncounter.timer > 45) {
                            caciqueEncounter.phase = 'throwing';
                            caciqueEncounter.timer = 0;
                        }
                    } else if (caciqueEncounter.phase === 'throwing') {
                        // Lanzar botella
                        if (caciqueEncounter.timer === 1 && caciqueEncounter.throwsLeft > 0) {
                            caciqueEncounter.throwsLeft--;
                            const worldTargetX = worldX + player.x + (player.vx || DIFF_PARAMS.speed) * 15; // lanza hacia donde va
                            const framesInFlight = (58 / DIFF_PARAMS.bottleSpeed);
                            bottles.push({
                                worldTargetX,
                                x: caciqueEncounter.x,
                                y: caciqueEncounter.y + 20,
                                vx: ((worldTargetX - worldX) - caciqueEncounter.x) / framesInFlight,
                                vy: -2.5,
                                gravity: 0.18 * DIFF_PARAMS.bottleSpeed,
                                angle: 0,
                                spin: 0.1
                            });
                        }
                        if (caciqueEncounter.timer > 30) {
                            if (caciqueEncounter.throwsLeft > 0) {
                                caciqueEncounter.phase = 'warning';
                                caciqueEncounter.timer = 0;
                            } else {
                                caciqueEncounter.phase = 'retreating';
                                caciqueEncounter.timer = 0;
                            }
                        }
                    } else if (caciqueEncounter.phase === 'retreating') {
                        caciqueEncounter.x += 4;
                        caciqueEncounter.y -= 1;
                        if (caciqueEncounter.x > canvas.width + 100) {
                            caciqueEncounter.active = false;
                            caciqueEncounter.cooldown = DIFF_PARAMS.bottleInterval * 2;
                        }
                    }
                }
                
                // Fireballs logic
                for (let i = fireballs.length - 1; i >= 0; i--) {
                    const fb = fireballs[i];
                    fb.x += fb.vx;
                    fb.life--;
                    if (fb.life <= 0) {
                        fireballs.splice(i, 1);
                    }
                }
"""
content = re.sub(r"(// BOTELLAS DE CACIQUE\s+spawnTimer\+\+;\s+if \(spawnTimer % DIFF_PARAMS\.bottleInterval === 0 && totalProg < DIFF_PARAMS\.totalDist - 420\) \{[\s\S]*?\}\n\s+\})", cacique_logic, content)

# Collision: remove immortality when having torch, and check fireball collision
bottle_collision = """
                if (
                    !cinematic.active &&
                    !pokemonEncounter.active &&
                    b.x > player.x - 3 &&
                    b.x < player.x + player.width + 3 &&
                    b.y > player.y - 4 &&
                    b.y < player.y + player.height - 12
                ) {
                    playSfx('hit');
                    resetKeys();
                    setDeathReason('¡Le cayó un Cacique en la jupa!');
                    setGameState('gameover');
                    cancelAnimationFrame(animId);
                    return;
                }
                
                // Fireball collision with bottle
                for (let f = fireballs.length - 1; f >= 0; f--) {
                    const fb = fireballs[f];
                    if (fb.x + 10 > b.x - 8 && fb.x - 10 < b.x + 8 && fb.y + 10 > b.y - 14 && fb.y - 10 < b.y + 14) {
                        b.y = GROUND_Y - 2; // Forzar ruptura
                        fireballs.splice(f, 1);
                        break;
                    }
                }
"""
content = re.sub(r"(if \(\s*!cinematic\.active &&\s*!pokemonEncounter\.active &&\s*b\.x > player\.x - 3 &&[\s\S]*?return;\s*\}\s*\})", bottle_collision, content)

# Draw cacique and fireballs
draw_cacique = """
            // DRAW FIREBALLS
            fireballs.forEach(fb => {
                const grad = ctx.createRadialGradient(fb.x, fb.y, 2, fb.x, fb.y, 12);
                grad.addColorStop(0, '#FFFFFF');
                grad.addColorStop(0.3, '#FDE047');
                grad.addColorStop(0.7, '#EA580C');
                grad.addColorStop(1, 'transparent');
                ctx.fillStyle = grad;
                ctx.beginPath();
                ctx.arc(fb.x, fb.y, 14, 0, Math.PI * 2);
                ctx.fill();
            });

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
                ctx.fillStyle = '#FCA5A5';
                ctx.beginPath();
                ctx.arc(0, -30, 15, 0, Math.PI*2);
                ctx.fill();
                
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
content = re.sub(r"(// LA ANTORCHA)", draw_cacique + r"\n            \1", content)


# Screen shake and delay on stab
screen_shake = """
                        // LE FALTAN TEJAS: APUÑALAMIENTO INEVITABLE
                        pokemonEncounter.slashAnim = 1;

                        ctx.fillStyle = '#991B1B';
                        ctx.font = 'bold 14px sans-serif';
                        ctx.fillText('¡NO TIENE TODAS LAS TEJAS! "¡Ah playo, se está haciendo el ruso!"', 60, 342);

                        // ANIMACIÓN DE CORTE ROJO SOBRE LA PANTALLA
                        ctx.strokeStyle = '#DC2626';
                        ctx.lineWidth = 6;
                        ctx.beginPath();
                        ctx.moveTo(120, 120);
                        ctx.lineTo(240, 240);
                        ctx.stroke();

                        if (pokemonEncounter.animTimer === 120) {
                            playSfx('stab');
                        }
                        
                        if (pokemonEncounter.animTimer > 120) {
                            ctx.save();
                            ctx.translate(Math.random() * 10 - 5, Math.random() * 10 - 5);
                            ctx.fillStyle = 'rgba(220, 38, 38, 0.3)';
                            ctx.fillRect(0, 0, canvas.width, canvas.height);
                            ctx.restore();
                        }

                        if (pokemonEncounter.animTimer > 250) {
                            setDeathReason(`¡Lo apuñaló el piedrero por dejar botadas las tejas! Solo llevaba ${collectedCoins} de ${DIFF_PARAMS.coinsCount}.`);
                            setGameState('gameover');
                            cancelAnimationFrame(animId);
                            return;
                        }
"""
content = re.sub(r"(// LE FALTAN TEJAS: APUÑALAMIENTO INEVITABLE[\s\S]*?return;\s*\})", screen_shake, content)

# Plasticina style for rounded elements
# I'll add some generic replacement to context drawing.
content = content.replace("ctx.fillRect(casonaScreenX, casona.y, 200, 155);", "ctx.beginPath(); ctx.roundRect(casonaScreenX, casona.y, 200, 155, 8); ctx.fill();")
content = content.replace("ctx.fillRect(casonaScreenX + 35, casona.y + 40, 36, 40);", "ctx.beginPath(); ctx.roundRect(casonaScreenX + 35, casona.y + 40, 36, 40, 4); ctx.fill();")
content = content.replace("ctx.fillRect(casonaScreenX + 115, casona.y + 65, 50, 90);", "ctx.beginPath(); ctx.roundRect(casonaScreenX + 115, casona.y + 65, 50, 90, 4); ctx.fill();")


# Button to throw fire
html_button = """
            {hasTorch && gameState === 'playing' && (
                <button
                    onClick={() => {
                        window.dispatchEvent(new KeyboardEvent('keydown', { code: 'KeyF' }));
                    }}
                    style={{
                        position: 'absolute',
                        bottom: '20px',
                        right: '20px',
                        backgroundColor: '#EA580C',
                        color: 'white',
                        border: '2px solid #FFFFFF',
                        borderRadius: '50%',
                        width: '60px',
                        height: '60px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                        cursor: 'pointer',
                        zIndex: 100
                    }}
                >
                    <Flame size={28} />
                </button>
            )}
"""
content = content.replace("                    <canvas", html_button + "\n                    <canvas")

with open(r'c:\Users\LENOV\OneDrive\Documents\Proyecto Final Daniel\SanJuanDeDiosInforma\src\pages\Juego.jsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Updated Juego.jsx successfully!")
