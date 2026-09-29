import re

with open(r'c:\Users\LENOV\OneDrive\Documents\Proyecto Final Daniel\SanJuanDeDiosInforma\src\pages\Juego.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Update keysRef definition
keysRef_def = "const keysRef = useRef({ left: false, right: false, up: false, option1: false, option2: false });"
content = re.sub(r'const keysRef = useRef\(\{ left: false, right: false, up: false \}\);', keysRef_def, content)

keysRef_reset = "keysRef.current = { left: false, right: false, up: false, option1: false, option2: false };"
content = re.sub(r'keysRef\.current = \{ left: false, right: false, up: false \};', keysRef_reset, content)

# 2. Add keyboard events and click events for the decision menu
key_down_addition = """
            if (e.code === 'Digit1' || e.code === 'Numpad1') keysRef.current.option1 = true;
            if (e.code === 'Digit2' || e.code === 'Numpad2') keysRef.current.option2 = true;
"""
content = re.sub(r"(if \(\['ArrowRight', 'KeyD'\]\.includes\(e\.code\)\) \{[\s\S]*?e\.preventDefault\(\);\n            \})", r'\1' + key_down_addition, content)

click_listener = """
        const onCanvasClick = (e) => {
            const canvas = canvasRef.current;
            if (!canvas) return;
            const rect = canvas.getBoundingClientRect();
            const scaleX = canvas.width / rect.width;
            const scaleY = canvas.height / rect.height;
            const x = (e.clientX - rect.left) * scaleX;
            const y = (e.clientY - rect.top) * scaleY;
            
            // Botón 1: x: 60, y: 340, width: 140, height: 32
            if (x >= 60 && x <= 200 && y >= 340 && y <= 372) keysRef.current.option1 = true;
            // Botón 2: x: 210, y: 340, width: 150, height: 32
            if (x >= 210 && x <= 360 && y >= 340 && y <= 372) keysRef.current.option2 = true;
        };
        canvasRef.current?.addEventListener('click', onCanvasClick);
"""
# Need to insert this near the window.addEventListener
content = re.sub(r"(document\.addEventListener\('visibilitychange', onVisibilityChange\);)", r'\1' + click_listener, content)

click_cleanup = """
            document.removeEventListener('visibilitychange', onVisibilityChange);
            if (canvasRef.current) canvasRef.current.removeEventListener('click', onCanvasClick);
"""
content = re.sub(r"(document\.removeEventListener\('visibilitychange', onVisibilityChange\);)", click_cleanup, content)


# 3. Rewrite dialogue and decision logic
dialog_text = """
                // Diálogo en grande
                ctx.fillStyle = '#0F172A';
                ctx.font = 'bold 14px sans-serif';

                if (pokemonEncounter.phase === 'transition' || pokemonEncounter.phase === 'decision' || pokemonEncounter.phase === 'duel') {
                    ctx.fillText('¡EL PIEDRERO DEL PRECA APARECIÓ!', 60, 294);
                    ctx.fillText(`"${pokemonEncounter.phrase}"`, 60, 318);

                    if (pokemonEncounter.phase === 'transition') {
                        // Transición a decisión tras deslizarse
                        if (pokemonEncounter.animTimer > 90) {
                            pokemonEncounter.phase = 'decision';
                            pokemonEncounter.animTimer = 0;
                            // reset keys to avoid accidental selection
                            keysRef.current.option1 = false;
                            keysRef.current.option2 = false;
                        }
                    } else if (pokemonEncounter.phase === 'decision') {
                        // Mostrar menú de decisión interactivo
                        ctx.fillStyle = '#059669';
                        ctx.beginPath();
                        ctx.roundRect(60, 340, 140, 32, 6);
                        ctx.fill();
                        ctx.fillStyle = '#FFFFFF';
                        ctx.font = 'bold 13px sans-serif';
                        ctx.fillText('1. 💰 Pagar', 85, 361);
                        
                        ctx.fillStyle = '#DC2626';
                        ctx.beginPath();
                        ctx.roundRect(210, 340, 150, 32, 6);
                        ctx.fill();
                        ctx.fillStyle = '#FFFFFF';
                        ctx.font = 'bold 13px sans-serif';
                        ctx.fillText('2. ⚔️ Pelear', 235, 361);

                        // Evaluar inputs
                        if (keysRef.current.option1) {
                            pokemonEncounter.phase = 'duel';
                            pokemonEncounter.decision = 'pay';
                            pokemonEncounter.animTimer = 0;
                        } else if (keysRef.current.option2) {
                            pokemonEncounter.phase = 'duel';
                            pokemonEncounter.decision = 'fight';
                            pokemonEncounter.animTimer = 0;
                        }
                    }
                }
"""
# Matches from `// Diálogo en grande` to `if (pokemonEncounter.animTimer > 90 ...`
content = re.sub(r"(// Diálogo en grande\s+ctx\.fillStyle = '#0F172A';\s+ctx\.font = 'bold 14px sans-serif';\s+if \(pokemonEncounter\.phase === 'transition' \|\| pokemonEncounter\.phase === 'duel'\) \{[\s\S]*?\}\n\s+\})", dialog_text, content)

duel_eval = """
                // EVALUACIÓN DE LAS TEJAS
                if (pokemonEncounter.phase === 'duel') {
                    if (pokemonEncounter.decision === 'pay' && collectedCoins >= DIFF_PARAMS.coinsCount) {
                        ctx.fillStyle = '#166534';
                        ctx.font = 'bold 14px sans-serif';
                        ctx.fillText('¡Le soltó todas las tejas! "¡Conoce mi rico, pura vida!"', 60, 342);

                        // Efecto de tejas volando al piedrero
                        ctx.fillStyle = '#F59E0B';
                        ctx.beginPath();
                        ctx.arc(380 + Math.sin(pokemonEncounter.animTimer * 0.2) * 40, 200, 10, 0, Math.PI * 2);
                        ctx.fill();

                        if (pokemonEncounter.animTimer > 120) {
                            pokemonEncounter.active = false;
                            pokemonEncounter.phase = 'done';
                            playSfx('boost');
                        }
                    } else {
                        ctx.fillStyle = '#991B1B';
                        ctx.font = 'bold 14px sans-serif';
                        if (pokemonEncounter.decision === 'fight') {
                            ctx.fillText('¡Intentaste pelear, pero el piedrero sacó un puñal oxidado!', 60, 342);
                        } else {
                            ctx.fillText('¡NO TIENE TODAS LAS TEJAS! "¡Ah papi, se está haciendo el ruso!"', 60, 342);
                        }

                        // Secuencia animada
                        if (pokemonEncounter.animTimer > 120 && pokemonEncounter.animTimer <= 210) {
                            pokemonEncounter.piedreroOffset -= 6;
                            pokemonEncounter.slashAnim = 1;
                        }
                        
                        if (pokemonEncounter.animTimer === 210) {
                            playSfx('stab');
                            player.falling = true;
                        }

                        if (pokemonEncounter.animTimer >= 210 && pokemonEncounter.animTimer < 225) {
                            ctx.save();
                            ctx.translate(Math.random() * 12 - 6, Math.random() * 12 - 6);
                            ctx.fillStyle = 'rgba(220, 38, 38, 0.4)';
                            ctx.fillRect(0, 0, canvas.width, canvas.height);
                            ctx.restore();
                        }

                        if (pokemonEncounter.animTimer > 300) {
                            setDeathReason(
                                pokemonEncounter.decision === 'fight' 
                                    ? '¡Te apuñaló el piedrero en un duelo desigual!' 
                                    : `¡Te apuñaló por dejar botadas las tejas! Solo llevabas ${collectedCoins} de ${DIFF_PARAMS.coinsCount}.`
                            );
                            setGameState('gameover');
                            cancelAnimationFrame(animId);
                            return;
                        }
                    }
                }
"""
content = re.sub(r"(// EVALUACIÓN DE LAS TEJAS\s+if \(pokemonEncounter\.phase === 'duel'\) \{[\s\S]*?return;\s*\}\s*\}\s*\})", duel_eval, content)


with open(r'c:\Users\LENOV\OneDrive\Documents\Proyecto Final Daniel\SanJuanDeDiosInforma\src\pages\Juego.jsx', 'w', encoding='utf-8') as f:
    f.write(content)

