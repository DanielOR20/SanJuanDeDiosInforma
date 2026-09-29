import re

with open(r'c:\Users\LENOV\OneDrive\Documents\Proyecto Final Daniel\SanJuanDeDiosInforma\src\pages\Juego.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Image upload state removal and default image
img_state = """    const [caciqueImage, setCaciqueImage] = useState(null);
    useEffect(() => {
        const img = new Image();
        img.onload = () => setCaciqueImage(img);
        img.src = '/cacique-cara.png';
    }, []);
"""
content = re.sub(r'(const \[caciqueImage, setCaciqueImage\] = useState\(null\);\n    const handleImageUpload = \(e\) => \{[\s\S]*?\};\n)', img_state, content)

# Remove input html
content = re.sub(r"(<div style=\{\{\s*marginBottom: '1rem',\s*display: 'flex',\s*alignItems: 'center',\s*gap: '1rem',\s*backgroundColor: '#F8FAFC',\s*padding: '0\.75rem',\s*borderRadius: '6px',\s*border: '1px solid #CBD5E1'\s*\}\}>[\s\S]*?</div>\n)", "", content)

# 2. Draw Cacique
draw_cacique = """
            // DRAW CACIQUE
            if (caciqueEncounter.active) {
                ctx.save();
                ctx.translate(caciqueEncounter.x, caciqueEncounter.y + Math.sin(Date.now()*0.005)*5);
                
                ctx.shadowColor = '#EA580C';
                ctx.shadowBlur = 15;
                
                if (caciqueImage) {
                    ctx.save();
                    ctx.beginPath();
                    ctx.arc(0, 0, 38, 0, Math.PI * 2);
                    ctx.clip();
                    ctx.drawImage(caciqueImage, -38, -38, 76, 76);
                    ctx.restore();
                    // Border flameante
                    ctx.strokeStyle = '#B91C1C';
                    ctx.lineWidth = 3;
                    ctx.beginPath();
                    ctx.arc(0, 0, 38, 0, Math.PI * 2);
                    ctx.stroke();
                } else {
                    ctx.fillStyle = '#FCA5A5';
                    ctx.beginPath();
                    ctx.arc(0, 0, 38, 0, Math.PI*2);
                    ctx.fill();
                }
                
                if (caciqueEncounter.phase === 'warning') {
                    ctx.shadowBlur = 0;
                    ctx.fillStyle = '#EF4444';
                    ctx.font = 'bold 32px sans-serif';
                    ctx.fillText('!', 30, -30);
                }
                ctx.restore();
            }
"""
content = re.sub(r"(// DRAW CACIQUE[\s\S]*?ctx\.restore\(\);\s*\})", draw_cacique, content)

# 3. Piedrero Cinematic (Texts and lunging logic)
# First we need to replace the text drawing part
dialog_text = """
                // Diálogo en grande
                ctx.fillStyle = '#0F172A';
                ctx.font = 'bold 14px sans-serif';

                if (pokemonEncounter.phase === 'transition' || pokemonEncounter.phase === 'duel') {
                    ctx.fillText('¡EL PIEDRERO DEL PRECA APARECIÓ!', 60, 294);
                    ctx.fillText(`"${pokemonEncounter.phrase}"`, 60, 318);

                    if (pokemonEncounter.phase === 'transition') {
                        ctx.fillStyle = '#DC2626';
                        ctx.font = 'bold 12px sans-serif';
                        ctx.fillText(`Tejas en su bolsa: ${collectedCoins} / ${DIFF_PARAMS.coinsCount} necesarias`, 60, 342);
                    }

                    // Transición al duelo tras deslizarse
                    if (pokemonEncounter.animTimer > 90 && pokemonEncounter.phase === 'transition') {
                        pokemonEncounter.phase = 'duel';
                        pokemonEncounter.animTimer = 0; // Reset timer for duel phase
                    }
                }
"""
content = re.sub(r"(// Diálogo en grande\s+ctx\.fillStyle = '#0F172A';\s+ctx\.font = 'bold 14px sans-serif';\s+if \(pokemonEncounter\.phase === 'transition' \|\| pokemonEncounter\.phase === 'duel'\) \{[\s\S]*?\}\n\s+\})", dialog_text, content)

duel_eval = """
                // EVALUACIÓN DE LAS TEJAS
                if (pokemonEncounter.phase === 'duel') {
                    if (collectedCoins >= DIFF_PARAMS.coinsCount) {
                        ctx.fillStyle = '#166534';
                        ctx.font = 'bold 14px sans-serif';
                        ctx.fillText('¡Le soltó todas las tejas! "¡Conoce mi rico, pura vida!"', 60, 342);

                        // Efecto de tejas volando al piedrero
                        ctx.fillStyle = '#F59E0B';
                        ctx.beginPath();
                        ctx.arc(380 + Math.sin(pokemonEncounter.animTimer * 0.2) * 40, 200, 10, 0, Math.PI * 2);
                        ctx.fill();

                        if (pokemonEncounter.animTimer > 90) {
                            pokemonEncounter.active = false;
                            pokemonEncounter.phase = 'done';
                            playSfx('boost');
                        }
                    } else {
                        ctx.fillStyle = '#991B1B';
                        ctx.font = 'bold 14px sans-serif';
                        ctx.fillText('¡NO TIENE TODAS LAS TEJAS! "¡Ah playo, se está haciendo el ruso!"', 60, 342);

                        // Secuencia animada
                        // animTimer: 0-120 (Pausa de diálogo)
                        // animTimer: 120-210 (Piedrero se abalanza)
                        // animTimer: 210 (Apuñalamiento)
                        // animTimer: 210-225 (Screen shake y destello)
                        // animTimer: > 300 (Game Over)

                        if (pokemonEncounter.animTimer > 120 && pokemonEncounter.animTimer <= 210) {
                            // Se abalanza (interpolando x)
                            pokemonEncounter.piedreroOffset -= 6;
                            pokemonEncounter.slashAnim = 1;
                        }
                        
                        if (pokemonEncounter.animTimer === 210) {
                            playSfx('stab');
                            player.falling = true; // Juan cae
                        }

                        if (pokemonEncounter.animTimer >= 210 && pokemonEncounter.animTimer < 225) {
                            ctx.save();
                            ctx.translate(Math.random() * 12 - 6, Math.random() * 12 - 6);
                            ctx.fillStyle = 'rgba(220, 38, 38, 0.4)';
                            ctx.fillRect(0, 0, canvas.width, canvas.height);
                            ctx.restore();
                        }

                        if (pokemonEncounter.animTimer > 300) {
                            setDeathReason(`¡Lo apuñaló el piedrero por dejar botadas las tejas! Solo llevaba ${collectedCoins} de ${DIFF_PARAMS.coinsCount}.`);
                            setGameState('gameover');
                            cancelAnimationFrame(animId);
                            return;
                        }
                    }
                }
"""
content = re.sub(r"(// EVALUACIÓN DE LAS TEJAS\s+if \(pokemonEncounter\.phase === 'duel'\) \{[\s\S]*?return;\s*\}\s*\})", duel_eval, content)

# 4. Juan falling animation when stabbed
# In pokemon cinematic, Juan is drawn in primer plano
# Need to replace the drawing of Juan in pokemonEncounter to include rotation if falling
juan_pokemon = """
                // 2. JUAN SANTAMARÍA EN PRIMER PLANO (DE ESPALDAS / 3/4 A LA IZQUIERDA)
                ctx.save();
                let jX = 140 + pokemonEncounter.juanOffset;
                let jY = 150;
                
                if (player.falling && pokemonEncounter.phase === 'duel' && pokemonEncounter.animTimer >= 210) {
                    // Cae al suelo
                    let t = pokemonEncounter.animTimer - 210;
                    jY += t * 3;
                    ctx.translate(jX + 26, jY + 22);
                    ctx.rotate(-t * 0.05);
                    ctx.translate(-(jX + 26), -(jY + 22));
                }
                
                ctx.translate(jX, jY);
"""
content = re.sub(r"(// 2\. JUAN SANTAMARÍA EN PRIMER PLANO[\s\S]*?ctx\.translate\(jX, jY\);)", juan_pokemon, content)

with open(r'c:\Users\LENOV\OneDrive\Documents\Proyecto Final Daniel\SanJuanDeDiosInforma\src\pages\Juego.jsx', 'w', encoding='utf-8') as f:
    f.write(content)
