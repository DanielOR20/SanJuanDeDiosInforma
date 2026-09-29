import { useEffect, useRef, useState } from 'react';
import { Flame, Play, RotateCcw, Trophy, Volume2, VolumeX, Sparkles, Coins } from 'lucide-react';

export const Juego = () => {
    const canvasRef = useRef(null);
    const containerRef = useRef(null);
    const [gameState, setGameState] = useState('start'); // 'start' | 'playing' | 'gameover' | 'victory'
    const [deathReason, setDeathReason] = useState('');
    const [difficulty, setDifficulty] = useState('normal'); // 'facil' | 'normal' | 'leyenda'
    const [distance, setDistance] = useState(0);
    const [hasTorch, setHasTorch] = useState(false);
    const [soundEnabled, setSoundEnabled] = useState(true);
    const [bottlesDodged, setBottlesDodged] = useState(0);

    // Contador de Tejas de 100
    const [coinsCollected, setCoinsCollected] = useState(0);
    const [totalCoins, setTotalCoins] = useState(4);

        const [caciqueImage, setCaciqueImage] = useState(null);
    useEffect(() => {
        const img = new Image();
        img.onload = () => setCaciqueImage(img);
        img.src = '/cacique-cara.png';
    }, []);

    const audioCtxRef = useRef(null);

    const getAudioContext = () => {
        if (!audioCtxRef.current) {
            const AudioClass = window.AudioContext || window.webkitAudioContext;
            if (AudioClass) audioCtxRef.current = new AudioClass();
        }
        if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
            audioCtxRef.current.resume();
        }
        return audioCtxRef.current;
    };

    const playSfx = (type) => {
        if (!soundEnabled) return;
        try {
            const ctx = getAudioContext();
            if (!ctx) return;
            const now = ctx.currentTime;
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain);
            gain.connect(ctx.destination);

            if (type === 'jump') {
                osc.type = 'square';
                osc.frequency.setValueAtTime(140, now);
                osc.frequency.exponentialRampToValueAtTime(380, now + 0.12);
                gain.gain.setValueAtTime(0.14, now);
                gain.gain.linearRampToValueAtTime(0.01, now + 0.12);
                osc.start(now);
                osc.stop(now + 0.12);
            } else if (type === 'coin') {
                osc.type = 'sine';
                osc.frequency.setValueAtTime(987.77, now);
                osc.frequency.setValueAtTime(1318.51, now + 0.08);
                gain.gain.setValueAtTime(0.22, now);
                gain.gain.linearRampToValueAtTime(0.01, now + 0.28);
                osc.start(now);
                osc.stop(now + 0.28);
            } else if (type === 'pokemon') {
                // Sonido de inicio de batalla Pokémon (jingle de alerta)
                osc.type = 'square';
                osc.frequency.setValueAtTime(440, now);
                osc.frequency.setValueAtTime(554, now + 0.08);
                osc.frequency.setValueAtTime(659, now + 0.16);
                osc.frequency.setValueAtTime(880, now + 0.24);
                gain.gain.setValueAtTime(0.25, now);
                gain.gain.linearRampToValueAtTime(0.01, now + 0.45);
                osc.start(now);
                osc.stop(now + 0.45);
            } else if (type === 'shatter') {
                osc.type = 'sawtooth';
                osc.frequency.setValueAtTime(900, now);
                osc.frequency.exponentialRampToValueAtTime(110, now + 0.22);
                gain.gain.setValueAtTime(0.25, now);
                gain.gain.linearRampToValueAtTime(0.01, now + 0.22);
                osc.start(now);
                osc.stop(now + 0.22);
            } else if (type === 'slip') {
                osc.type = 'sine';
                osc.frequency.setValueAtTime(400, now);
                osc.frequency.linearRampToValueAtTime(150, now + 0.25);
                gain.gain.setValueAtTime(0.2, now);
                gain.gain.linearRampToValueAtTime(0.01, now + 0.25);
                osc.start(now);
                osc.stop(now + 0.25);
            } else if (type === 'stab') {
                // Sonido cortante de navaja
                osc.type = 'sawtooth';
                osc.frequency.setValueAtTime(500, now);
                osc.frequency.exponentialRampToValueAtTime(40, now + 0.3);
                gain.gain.setValueAtTime(0.45, now);
                gain.gain.linearRampToValueAtTime(0.01, now + 0.3);
                osc.start(now);
                osc.stop(now + 0.3);
            } else if (type === 'burn') {
                osc.type = 'sawtooth';
                osc.frequency.setValueAtTime(180, now);
                osc.frequency.exponentialRampToValueAtTime(650, now + 0.5);
                gain.gain.setValueAtTime(0.35, now);
                gain.gain.linearRampToValueAtTime(0.01, now + 0.5);
                osc.start(now);
                osc.stop(now + 0.5);
            } else if (type === 'hit') {
                osc.type = 'square';
                osc.frequency.setValueAtTime(120, now);
                osc.frequency.exponentialRampToValueAtTime(30, now + 0.35);
                gain.gain.setValueAtTime(0.35, now);
                gain.gain.linearRampToValueAtTime(0.01, now + 0.35);
                osc.start(now);
                osc.stop(now + 0.35);
            } else if (type === 'boost') {
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(260, now);
                osc.frequency.setValueAtTime(520, now + 0.15);
                gain.gain.setValueAtTime(0.25, now);
                gain.gain.linearRampToValueAtTime(0.01, now + 0.35);
                osc.start(now);
                osc.stop(now + 0.35);
            } else if (type === 'victory') {
                [330, 440, 554, 660].forEach((freq, idx) => {
                    const o = ctx.createOscillator();
                    const g = ctx.createGain();
                    o.connect(g);
                    g.connect(ctx.destination);
                    o.type = 'square';
                    o.frequency.setValueAtTime(freq, now + idx * 0.15);
                    g.gain.setValueAtTime(0.2, now + idx * 0.15);
                    g.gain.linearRampToValueAtTime(0.01, now + (idx + 1) * 0.15);
                    o.start(now + idx * 0.15);
                    o.stop(now + (idx + 1) * 0.15);
                });
            }
        } catch (e) { }
    };

    const keysRef = useRef({ left: false, right: false, up: false, option1: false, option2: false });

    const resetKeys = () => {
        keysRef.current = { left: false, right: false, up: false, option1: false, option2: false };
    };

    useEffect(() => {
        const handleScrollLock = (e) => {
            if (['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'KeyW', 'KeyS'].includes(e.code)) {
                e.preventDefault();
            }
        };
        window.addEventListener('keydown', handleScrollLock, { passive: false });
        return () => window.removeEventListener('keydown', handleScrollLock);
    }, []);

    useEffect(() => {
        if (gameState !== 'playing') {
            resetKeys();
            return;
        }

        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');

        // NIVELES EXTRALARGOS: FACILITO TIENE LA DISTANCIA DEL ANTERIOR LEYENDA
        const DIFF_PARAMS = {
            facil: {
                totalDist: 5800, // Facilito ahora es largo como el antiguo leyenda
                bottleInterval: 120,
                bottleSpeed: 0.95,
                speed: 5.0,
                hazardSpacing: 620,
                torchPosition: 0.45,
                coinsCount: 4
            },
            normal: {
                totalDist: 8500, // Más largo y retador
                bottleInterval: 85,
                bottleSpeed: 1.18,
                speed: 5.2,
                hazardSpacing: 480,
                torchPosition: 0.45,
                coinsCount: 6
            },
            leyenda: {
                totalDist: 12000, // Distancia colosal de pura destreza
                bottleInterval: 68,
                bottleSpeed: 1.35,
                speed: 5.4,
                hazardSpacing: 400,
                torchPosition: 0.38,
                coinsCount: 8
            }
        }[difficulty];

        setTotalCoins(DIFF_PARAMS.coinsCount);
        setCoinsCollected(0);

        const GROUND_Y = 300;

        let player = {
            x: 120,
            y: GROUND_Y - 48,
            width: 26,
            height: 48,
            vx: 0,
            vy: 0,
            isGrounded: true,
            hasTorch: false,
            facing: 1,
            walkCycle: 0,
            slipTimer: 0,
            falling: false
        };

        let worldX = 0;
        let bottles = [];
        let particles = [];
        let collectedCoins = 0;

        // Generar tejas doradas de ₡100
        const coinsList = [];
        const coinInterval = (DIFF_PARAMS.totalDist * 0.78) / (DIFF_PARAMS.coinsCount + 1);
        for (let c = 1; c <= DIFF_PARAMS.coinsCount; c++) {
            coinsList.push({
                id: c,
                worldX: c * coinInterval + Math.floor(Math.random() * 80),
                y: GROUND_Y - 24,
                collected: false
            });
        }

        let torchItem = { x: DIFF_PARAMS.totalDist * DIFF_PARAMS.torchPosition, y: GROUND_Y - 35, collected: false };

        let casona = {
            x: DIFF_PARAMS.totalDist - 340,
            y: GROUND_Y - 150,
            burningIntensity: 0,
            burned: false
        };

        let walkerEnemies = [
            { id: 'walker', x: casona.x + 35, y: casona.y + 40, defeated: false, charr: 0 },
            { id: 'mercenary', x: casona.x + 120, y: GROUND_Y - 42, defeated: false, charr: 0 }
        ];

        const PIEDRERO_PHRASES = [
            "¡Mi rico, mi rey! ¿Tiene una teja que me regale pa' una empanadita?",
            "¡Mi tata, tiene la hora? Y de paso una tejita pa' ajustar el pasaje...",
            "¡Compa, colabóreme con una teja por el amor de Diosito!",
            "¡Mopri! ¿Tiene una teja suelta que le sobre pa' una vara?"
        ];
        const chosenPhrase = PIEDRERO_PHRASES[Math.floor(Math.random() * PIEDRERO_PHRASES.length)];

        // ENCUENTRO ESTILO POKÉMON (AL 84% DE LA RUTA)
        let pokemonEncounter = {
            worldX: DIFF_PARAMS.totalDist * 0.84,
            active: false,
            phase: 'none', // 'transition' | 'duel' | 'resolving' | 'done'
            animTimer: 0,
            phrase: chosenPhrase,
            juanOffset: -200, // Deslizamiento desde la izquierda
            piedreroOffset: 200, // Deslizamiento desde la derecha
            slashAnim: 0,
            coinsGiven: 0
        };

        let cinematic = {
            active: false,
            timer: 0,
            torchProjectile: null,
            phase: 0
        };

        let caciqueEncounter = {
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

        let spawnTimer = 0;
        let dodgedCount = 0;
        let animId;

        // Obstáculos fijos bien distribuidos
        const staticObstacles = [];
        const obstacleTypes = ['zanja', 'alcantarilla', 'platano', 'cable'];
        let nextObstacleX = 550;

        while (nextObstacleX < DIFF_PARAMS.totalDist - 520) {
            if (Math.abs(nextObstacleX - pokemonEncounter.worldX) > 160) {
                const chosenType = obstacleTypes[Math.floor(Math.random() * obstacleTypes.length)];
                staticObstacles.push({
                    type: chosenType,
                    x: nextObstacleX,
                    width: chosenType === 'zanja' ? (difficulty === 'leyenda' ? 76 : 65) : (chosenType === 'alcantarilla' ? 44 : 26),
                    height: chosenType === 'zanja' ? 42 : 28
                });
            }
            nextObstacleX += DIFF_PARAMS.hazardSpacing + Math.floor(Math.random() * 80);
        }

        
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
            if (e.code === 'Digit1' || e.code === 'Numpad1') keysRef.current.option1 = true;
            if (e.code === 'Digit2' || e.code === 'Numpad2') keysRef.current.option2 = true;

            
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



        // BUCLE DEL CANVAS
        const loop = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // CIELO
            const skyGrad = ctx.createLinearGradient(0, 0, 0, GROUND_Y);
            if (player.hasTorch || cinematic.active) {
                skyGrad.addColorStop(0, '#FEF08A');
                skyGrad.addColorStop(1, '#FDE047');
            } else {
                skyGrad.addColorStop(0, '#38BDF8');
                skyGrad.addColorStop(1, '#E2E8F0');
            }
            ctx.fillStyle = skyGrad;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // MONTAÑAS
            ctx.fillStyle = '#475569';
            ctx.beginPath();
            ctx.moveTo(0, GROUND_Y);
            for (let i = 0; i <= canvas.width; i += 60) {
                ctx.lineTo(i, GROUND_Y - 75 - Math.sin((i + worldX * 0.1) * 0.015) * 35);
            }
            ctx.lineTo(canvas.width, GROUND_Y);
            ctx.fill();

            // COLINAS
            ctx.fillStyle = '#15803D';
            ctx.beginPath();
            ctx.moveTo(0, GROUND_Y);
            for (let i = 0; i <= canvas.width; i += 40) {
                ctx.lineTo(i, GROUND_Y - 35 - Math.sin((i + worldX * 0.22) * 0.02) * 20);
            }
            ctx.lineTo(canvas.width, GROUND_Y);
            ctx.fill();

            // ACERA Y CALZADA
            ctx.fillStyle = '#94A3B8';
            ctx.fillRect(0, GROUND_Y - 6, canvas.width, 6);
            ctx.fillStyle = '#CBD5E1';
            ctx.fillRect(0, GROUND_Y - 8, canvas.width, 2);

            const roadGrad = ctx.createLinearGradient(0, GROUND_Y, 0, canvas.height);
            roadGrad.addColorStop(0, '#334155');
            roadGrad.addColorStop(0.35, '#1E293B');
            roadGrad.addColorStop(1, '#0F172A');
            ctx.fillStyle = roadGrad;
            ctx.fillRect(0, GROUND_Y, canvas.width, canvas.height - GROUND_Y);

            // Líneas amarillas de calle
            ctx.fillStyle = '#EAB308';
            const stripeOffset = (worldX * 0.9) % 70;
            for (let x = -stripeOffset; x < canvas.width; x += 70) {
                ctx.fillRect(x, GROUND_Y + 28, 32, 5);
            }

            // ACTIVACIÓN DEL ENCUENTRO POKÉMON CON EL PIEDRERO
            const piedreroScreenX = pokemonEncounter.worldX - worldX;
            if (!pokemonEncounter.active && pokemonEncounter.phase === 'none' && (player.x + player.width >= piedreroScreenX - 50)) {
                pokemonEncounter.active = true;
                pokemonEncounter.phase = 'transition';
                pokemonEncounter.animTimer = 0;
                resetKeys();
                playSfx('pokemon');
            }

            // LÓGICA DE CONTROL DEL JUGADOR (SI NO ESTÁ EN MODO POKÉMON NI CINEMÁTICA)
            if (!cinematic.active && !pokemonEncounter.active) {
                const currentSpeed = player.hasTorch ? DIFF_PARAMS.speed * 1.8 : DIFF_PARAMS.speed;

                if (!player.falling) {
                    if (player.slipTimer > 0) {
                        player.slipTimer--;
                        player.x += currentSpeed * 0.7;
                        player.walkCycle += 0.4;
                    } else {
                        if (keysRef.current.right) {
                            player.facing = 1;
                            player.walkCycle += 0.22;
                            if (player.x < canvas.width * 0.45) {
                                player.x += currentSpeed;
                            } else {
                                worldX += currentSpeed;
                            }
                        } else if (keysRef.current.left) {
                            player.facing = -1;
                            player.walkCycle += 0.22;
                            if (player.x > 50) {
                                player.x -= currentSpeed;
                            } else if (worldX > 0) {
                                worldX -= currentSpeed;
                            }
                        } else {
                            player.walkCycle = 0;
                        }

                        if (keysRef.current.up && player.isGrounded) {
                            player.vy = -12.6;
                            player.isGrounded = false;
                            playSfx('jump');
                        }
                    }

                    player.vy += 0.68;
                    player.y += player.vy;

                    if (player.y >= GROUND_Y - player.height) {
                        player.y = GROUND_Y - player.height;
                        player.vy = 0;
                        player.isGrounded = true;
                    }
                } else {
                    player.y += 6;
                }

                const totalProg = Math.min(worldX + player.x, DIFF_PARAMS.totalDist);
                setDistance(Math.min(100, Math.round((totalProg / DIFF_PARAMS.totalDist) * 100)));

                // INICIAR CINEMÁTICA AL ALCANZAR EL MESÓN
                const casonaScreenX = casona.x - worldX;
                if (player.x + player.width >= casonaScreenX - 80 && player.hasTorch) {
                    cinematic.active = true;
                    cinematic.timer = 0;
                    cinematic.phase = 0;
                    resetKeys();
                }

                
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
            }

            // RENDERIZADO Y RECOLECCIÓN DE TEJAS (₡100)
            coinsList.forEach(c => {
                if (!c.collected) {
                    const coinScreenX = c.worldX - worldX;
                    if (coinScreenX > -30 && coinScreenX < canvas.width + 30) {
                        ctx.fillStyle = 'rgba(0,0,0,0.3)';
                        ctx.beginPath();
                        ctx.ellipse(coinScreenX, GROUND_Y + 2, 8, 3, 0, 0, Math.PI * 2);
                        ctx.fill();

                        ctx.fillStyle = '#F59E0B';
                        ctx.beginPath();
                        ctx.arc(coinScreenX, c.y + Math.sin(Date.now() * 0.008) * 3, 11, 0, Math.PI * 2);
                        ctx.fill();

                        ctx.fillStyle = '#FDE047';
                        ctx.beginPath();
                        ctx.arc(coinScreenX, c.y + Math.sin(Date.now() * 0.008) * 3, 8.5, 0, Math.PI * 2);
                        ctx.fill();

                        ctx.fillStyle = '#B45309';
                        ctx.font = 'bold 8px sans-serif';
                        ctx.textAlign = 'center';
                        ctx.fillText('100', coinScreenX, c.y + Math.sin(Date.now() * 0.008) * 3 + 3);

                        if (
                            !pokemonEncounter.active &&
                            player.x + player.width > coinScreenX - 10 &&
                            player.x < coinScreenX + 10 &&
                            player.y + player.height > c.y - 12 &&
                            player.y < c.y + 12
                        ) {
                            c.collected = true;
                            collectedCoins++;
                            setCoinsCollected(collectedCoins);
                            playSfx('coin');
                        }
                    }
                }
            });

            // RENDERIZADO DE BOTELLAS
            for (let i = bottles.length - 1; i >= 0; i--) {
                const b = bottles[i];
                b.vy += b.gravity;
                b.x += b.vx;
                b.y += b.vy;
                b.angle += b.spin;

                const screenLandingX = b.worldTargetX - worldX;
                const heightAbove = Math.max(0, GROUND_Y - b.y);
                const shadowScale = Math.max(0.2, 1 - heightAbove / 300);
                const shadowAlpha = Math.max(0.08, 0.45 - heightAbove / 350);

                ctx.fillStyle = `rgba(0, 0, 0, ${shadowAlpha})`;
                ctx.beginPath();
                ctx.ellipse(screenLandingX, GROUND_Y + 4, 18 * shadowScale, 6 * shadowScale, 0, 0, Math.PI * 2);
                ctx.fill();

                ctx.save();
                ctx.translate(b.x, b.y);
                ctx.rotate(b.angle);
                ctx.fillStyle = 'rgba(204, 251, 241, 0.9)';
                ctx.strokeStyle = '#0D9488';
                ctx.lineWidth = 1.3;
                ctx.beginPath();
                ctx.roundRect(-8, -14, 16, 28, 3);
                ctx.fill();
                ctx.stroke();
                ctx.fillRect(-4, -23, 8, 10);
                ctx.strokeRect(-4, -23, 8, 10);
                ctx.fillStyle = '#DC2626';
                ctx.fillRect(-7, -8, 14, 15);
                ctx.fillStyle = '#FDE047';
                ctx.fillRect(-4, -4, 8, 7);
                ctx.fillStyle = '#B91C1C';
                ctx.fillRect(-5, -26, 10, 4);
                ctx.restore();

                
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


                if (b.y >= GROUND_Y - 2) {
                    playSfx('shatter');
                    dodgedCount++;
                    setBottlesDodged(dodgedCount);

                    particles.push({
                        x: b.x,
                        y: GROUND_Y - 8,
                        vx: (Math.random() - 0.5) * 6,
                        vy: -7.5 - Math.random() * 3,
                        rotation: 0,
                        spin: 0.35,
                        type: 'cap',
                        life: 80
                    });

                    for (let p = 0; p < 7; p++) {
                        const ang = Math.random() * Math.PI;
                        const spd = 2 + Math.random() * 4;
                        particles.push({
                            x: b.x,
                            y: GROUND_Y - 3,
                            vx: Math.cos(ang) * spd * (Math.random() > 0.5 ? 1 : -1),
                            vy: -Math.sin(ang) * spd,
                            type: 'glass',
                            size: 2 + Math.random() * 3,
                            life: 30
                        });
                    }

                    bottles.splice(i, 1);
                }
            }

            // PARTÍCULAS
            for (let i = particles.length - 1; i >= 0; i--) {
                const p = particles[i];
                if (p.type === 'cap') {
                    p.vy += 0.38;
                    p.x += p.vx;
                    p.y += p.vy;
                    p.rotation += p.spin;
                    p.life--;

                    if (p.y >= GROUND_Y - 3) {
                        p.y = GROUND_Y - 3;
                        p.vy *= -0.65;
                        p.vx *= 0.72;
                    }

                    ctx.save();
                    ctx.translate(p.x, p.y);
                    ctx.rotate(p.rotation);
                    ctx.fillStyle = '#DC2626';
                    ctx.fillRect(-5, -2.5, 10, 5);
                    ctx.fillStyle = '#FFFFFF';
                    ctx.fillRect(-2, -1, 4, 2);
                    ctx.restore();
                } else if (p.type === 'glass') {
                    p.vy += 0.42;
                    p.x += p.vx;
                    p.y += p.vy;
                    p.life--;
                    if (p.y >= GROUND_Y - 2) {
                        p.y = GROUND_Y - 2;
                        p.vy = 0;
                        p.vx *= 0.6;
                    }
                    ctx.fillStyle = '#5EEAD4';
                    ctx.fillRect(p.x, p.y, p.size, p.size);
                }
                if (p.life <= 0) particles.splice(i, 1);
            }

            // RENDER DE OBSTÁCULOS FIJOS
            staticObstacles.forEach(obs => {
                const screenX = obs.x - worldX;
                if (screenX > -120 && screenX < canvas.width + 120) {
                    if (obs.type === 'zanja') {
                        ctx.fillStyle = '#020617';
                        ctx.fillRect(screenX, GROUND_Y, obs.width, obs.height);
                        ctx.fillStyle = '#451A03';
                        ctx.fillRect(screenX, GROUND_Y, 6, obs.height);
                        ctx.fillRect(screenX + obs.width - 6, GROUND_Y, 6, obs.height);

                        ctx.fillStyle = '#1E293B';
                        ctx.fillRect(screenX + 8, GROUND_Y + 22, obs.width - 16, 10);

                        ctx.fillStyle = '#FACC15';
                        ctx.fillRect(screenX - 6, GROUND_Y - 14, 6, 14);
                        ctx.fillRect(screenX + obs.width, GROUND_Y - 14, 6, 14);
                        ctx.fillStyle = '#000000';
                        ctx.font = 'bold 8px sans-serif';
                        ctx.textAlign = 'left';
                        ctx.fillText('ZANJA AYA', screenX + 4, GROUND_Y + 16);

                        const playerFeetX = player.x + player.width / 2;
                        if (
                            !cinematic.active &&
                            !pokemonEncounter.active &&
                            !player.hasTorch &&
                            playerFeetX > screenX + 6 &&
                            playerFeetX < screenX + obs.width - 6 &&
                            player.y >= GROUND_Y - player.height - 2
                        ) {
                            player.falling = true;
                            playSfx('slip');
                            resetKeys();
                            setTimeout(() => {
                                setDeathReason('¡Cayó en una zanja abierta de AyA!');
                                setGameState('gameover');
                            }, 350);
                        }
                    } else if (obs.type === 'alcantarilla') {
                        ctx.fillStyle = '#020617';
                        ctx.beginPath();
                        ctx.ellipse(screenX + obs.width / 2, GROUND_Y + 4, obs.width / 2, 8, 0, 0, Math.PI * 2);
                        ctx.fill();

                        ctx.strokeStyle = '#64748B';
                        ctx.lineWidth = 2;
                        ctx.stroke();

                        const playerFeetX = player.x + player.width / 2;
                        if (
                            !cinematic.active &&
                            !pokemonEncounter.active &&
                            !player.hasTorch &&
                            playerFeetX > screenX + 6 &&
                            playerFeetX < screenX + obs.width - 6 &&
                            player.y >= GROUND_Y - player.height - 2
                        ) {
                            player.falling = true;
                            playSfx('slip');
                            resetKeys();
                            setTimeout(() => {
                                setDeathReason('¡Se fue en una alcantarilla sin tapa del AyA!');
                                setGameState('gameover');
                            }, 350);
                        }
                    } else if (obs.type === 'platano') {
                        ctx.fillStyle = '#FACC15';
                        ctx.beginPath();
                        ctx.arc(screenX + 10, GROUND_Y - 2, 8, 0, Math.PI);
                        ctx.fill();
                        ctx.fillStyle = '#78350F';
                        ctx.fillRect(screenX + 8, GROUND_Y - 3, 4, 3);

                        if (
                            !cinematic.active &&
                            !pokemonEncounter.active &&
                            player.x + player.width > screenX &&
                            player.x < screenX + obs.width &&
                            player.y + player.height >= GROUND_Y - 4 &&
                            player.slipTimer === 0
                        ) {
                            player.slipTimer = 35;
                            playSfx('slip');
                        }
                    } else if (obs.type === 'cable') {
                        ctx.strokeStyle = '#1E293B';
                        ctx.lineWidth = 2.5;
                        ctx.beginPath();
                        ctx.moveTo(screenX, GROUND_Y - 30);
                        ctx.quadraticCurveTo(screenX + 16, GROUND_Y, screenX + 32, GROUND_Y - 30);
                        ctx.stroke();

                        if (Math.random() > 0.5) {
                            ctx.fillStyle = '#38BDF8';
                            ctx.beginPath();
                            ctx.arc(screenX + 16, GROUND_Y - 4, 5, 0, Math.PI * 2);
                            ctx.fill();
                        }

                        if (
                            !cinematic.active &&
                            !pokemonEncounter.active &&
                            !player.hasTorch &&
                            player.x + player.width > screenX + 6 &&
                            player.x < screenX + obs.width - 6 &&
                            player.y + player.height >= GROUND_Y - 8
                        ) {
                            playSfx('hit');
                            resetKeys();
                            setDeathReason('¡Hizo contacto con cables caídos del ICE!');
                            setGameState('gameover');
                            cancelAnimationFrame(animId);
                            return;
                        }
                    }
                }
            });

            
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



            // LA ANTORCHA
            if (!torchItem.collected) {
                const torchX = torchItem.x - worldX;
                if (torchX > -50 && torchX < canvas.width + 50) {
                    ctx.fillStyle = '#78350F';
                    ctx.fillRect(torchX + 8, torchItem.y + 8, 6, 22);

                    const fRad = 11 + Math.sin(Date.now() * 0.018) * 3;
                    ctx.fillStyle = '#F59E0B';
                    ctx.beginPath();
                    ctx.arc(torchX + 11, torchItem.y + 4, fRad, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.fillStyle = '#DC2626';
                    ctx.beginPath();
                    ctx.arc(torchX + 11, torchItem.y + 4, fRad * 0.6, 0, Math.PI * 2);
                    ctx.fill();

                    if (
                        !pokemonEncounter.active &&
                        player.x + player.width > torchX &&
                        player.x < torchX + 24 &&
                        player.y + player.height > torchItem.y
                    ) {
                        torchItem.collected = true;
                        player.hasTorch = true;
                        setHasTorch(true);
                        playSfx('boost');
                    }
                }
            }

            // PROYECTIL DE LA ANTORCHA EN CINEMÁTICA
            if (cinematic.active && cinematic.phase === 1 && cinematic.torchProjectile) {
                const tp = cinematic.torchProjectile;
                ctx.save();
                ctx.translate(tp.x, tp.y);
                ctx.rotate(tp.angle);
                ctx.fillStyle = '#78350F';
                ctx.fillRect(-3, -12, 6, 24);
                ctx.fillStyle = '#EA580C';
                ctx.beginPath();
                ctx.arc(0, -14, 12, 0, Math.PI * 2);
                ctx.fill();
                ctx.fillStyle = '#FDE047';
                ctx.beginPath();
                ctx.arc(0, -14, 6, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
            }

            // EL MESÓN DE RIVAS
            const casonaScreenX = casona.x - worldX;
            if (casonaScreenX < canvas.width + 160) {
                ctx.fillStyle = casona.burningIntensity > 0 ? '#581C1C' : '#78350F';
                ctx.beginPath(); ctx.roundRect(casonaScreenX, casona.y, 200, 155, 8); ctx.fill();

                ctx.fillStyle = casona.burningIntensity > 0 ? '#450A0A' : '#7F1D1D';
                ctx.beginPath();
                ctx.moveTo(casonaScreenX - 18, casona.y);
                ctx.lineTo(casonaScreenX + 100, casona.y - 65);
                ctx.lineTo(casonaScreenX + 215, casona.y);
                ctx.fill();

                ctx.fillStyle = '#0F172A';
                ctx.beginPath(); ctx.roundRect(casonaScreenX + 35, casona.y + 40, 36, 40, 4); ctx.fill();

                ctx.fillStyle = '#2A1205';
                ctx.beginPath(); ctx.roundRect(casonaScreenX + 115, casona.y + 65, 50, 90, 4); ctx.fill();

                walkerEnemies.forEach((e) => {
                    const ex = casonaScreenX + (e.id === 'walker' ? 40 : 125);
                    const ey = e.id === 'walker' ? casona.y + 45 : GROUND_Y - 42;

                    ctx.save();
                    ctx.translate(ex, ey);

                    const charrColor = e.defeated ? `rgb(${Math.max(20, Math.floor(30 - e.charr * 20))}, ${Math.max(20, Math.floor(40 - e.charr * 30))}, ${Math.max(20, Math.floor(50 - e.charr * 40))})` : '#1E3A8A';
                    const headColor = e.defeated ? `rgb(${Math.max(40, Math.floor(250 - e.charr * 200))}, ${Math.max(30, Math.floor(160 - e.charr * 130))}, ${Math.max(30, Math.floor(160 - e.charr * 130))})` : '#FCA5A5';

                    ctx.fillStyle = charrColor;
                    ctx.fillRect(0, 14, 18, 18);
                    ctx.fillStyle = e.defeated ? '#475569' : '#F8FAFC';
                    ctx.fillRect(2, 32, 6, 10);
                    ctx.fillRect(10, 32, 6, 10);

                    ctx.fillStyle = headColor;
                    ctx.fillRect(3, 4, 12, 10);

                    ctx.fillStyle = e.id === 'walker' ? '#0F172A' : '#1E293B';
                    ctx.fillRect(1, 0, 16, 5);

                    if (e.defeated) {
                        ctx.fillStyle = '#FFFFFF';
                        ctx.font = 'bold 8px sans-serif';
                        ctx.textAlign = 'left';
                        ctx.fillText('X X', 4, 12);

                        ctx.fillStyle = '#EF4444';
                        ctx.beginPath();
                        ctx.arc(9, 10, 8 + Math.sin(Date.now() * 0.05) * 3, 0, Math.PI * 2);
                        ctx.fill();
                    }

                    ctx.restore();
                });

                if (casona.burningIntensity > 0) {
                    const flamesCount = Math.floor(casona.burningIntensity * 3.5);
                    for (let f = 0; f < flamesCount; f++) {
                        ctx.fillStyle = Math.random() > 0.35 ? '#EA580C' : '#FBBF24';
                        ctx.beginPath();
                        ctx.arc(
                            casonaScreenX + Math.random() * 200,
                            casona.y - 30 + Math.random() * 160,
                            12 + Math.random() * 18,
                            0,
                            Math.PI * 2
                        );
                        ctx.fill();

                        ctx.fillStyle = 'rgba(30, 41, 59, 0.55)';
                        ctx.beginPath();
                        ctx.arc(
                            casonaScreenX + Math.random() * 200,
                            casona.y - 70 - Math.random() * 60,
                            16 + Math.random() * 20,
                            0,
                            Math.PI * 2
                        );
                        ctx.fill();
                    }
                }
            }

            // JUAN SANTAMARÍA EN EL JUEGO NORMAL
            if (!pokemonEncounter.active) {
                ctx.save();
                if (player.facing === -1) {
                    ctx.translate(player.x + player.width, player.y);
                    ctx.scale(-1, 1);
                } else {
                    ctx.translate(player.x, player.y);
                }

                ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
                ctx.beginPath();
                ctx.ellipse(player.width / 2, player.height + 2, 16, 5, 0, 0, Math.PI * 2);
                ctx.fill();

                if (player.hasTorch) {
                    ctx.fillStyle = 'rgba(251, 191, 36, 0.3)';
                    ctx.beginPath();
                    ctx.arc(player.width / 2, player.height / 2, 44, 0, Math.PI * 2);
                    ctx.fill();
                }

                const legOff = Math.sin(player.walkCycle) * 6;
                ctx.fillStyle = '#1E3A8A';
                ctx.fillRect(4, 28, 7, 20 + (player.isGrounded ? legOff : 0));
                ctx.fillRect(15, 28, 7, 20 - (player.isGrounded ? legOff : 0));

                ctx.fillStyle = '#F8FAFC';
                ctx.fillRect(3, 14, 20, 16);
                ctx.fillStyle = '#E2E8F0';
                ctx.fillRect(16, 14, 7, 16);
                ctx.fillStyle = '#DC2626';
                ctx.fillRect(5, 12, 16, 3);

                ctx.fillStyle = '#FBBF24';
                ctx.fillRect(7, 3, 13, 11);

                // Chonete tico
                ctx.fillStyle = '#FFFFFF';
                ctx.beginPath();
                ctx.roundRect(5, -6, 17, 8, [4, 4, 0, 0]);
                ctx.fill();
                ctx.strokeStyle = '#E2E8F0';
                ctx.lineWidth = 1;
                ctx.stroke();

                ctx.fillStyle = '#002B7F';
                ctx.fillRect(6, -2, 15, 2);
                ctx.fillStyle = '#CE1126';
                ctx.fillRect(6, 0, 15, 2);

                ctx.fillStyle = '#F8FAFC';
                ctx.beginPath();
                ctx.ellipse(13, 2, 15, 4, 0, 0, Math.PI * 2);
                ctx.fill();
                ctx.strokeStyle = '#CBD5E1';
                ctx.stroke();

                if (player.hasTorch) {
                    ctx.fillStyle = '#78350F';
                    ctx.fillRect(22, 6, 5, 20);
                    const fSize = 8 + Math.sin(Date.now() * 0.02) * 3;
                    ctx.fillStyle = '#F59E0B';
                    ctx.beginPath();
                    ctx.arc(24, 3, fSize, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.fillStyle = '#DC2626';
                    ctx.beginPath();
                    ctx.arc(24, 3, fSize * 0.6, 0, Math.PI * 2);
                    ctx.fill();
                }

                ctx.restore();
            }

            // =========================================================
            // ENCUENTRO Y DUELO ESTILO POKÉMON (PRIMER PLANO Y ZOOM)
            // =========================================================
            if (pokemonEncounter.active) {
                pokemonEncounter.animTimer++;

                // 1. Barras negras superior e inferior estilo cinemática letterbox
                ctx.fillStyle = '#090D16';
                ctx.fillRect(0, 0, canvas.width, 38);
                ctx.fillRect(0, canvas.height - 38, canvas.width, 38);

                // Fondo de combate tipo arena callejera
                ctx.fillStyle = 'rgba(15, 23, 42, 0.45)';
                ctx.fillRect(0, 38, canvas.width, canvas.height - 76);

                // Deslizamiento inicial de los personajes a su posición de batalla
                if (pokemonEncounter.juanOffset < 0) pokemonEncounter.juanOffset += 10;
                if (pokemonEncounter.piedreroOffset > 0) pokemonEncounter.piedreroOffset -= 10;

                // PLATAFORMA DE COMBATE (ELIPSES ESTILO POKÉMON)
                ctx.fillStyle = '#334155';
                ctx.beginPath();
                ctx.ellipse(180, 260, 110, 32, 0, 0, Math.PI * 2);
                ctx.fill();
                ctx.beginPath();
                ctx.ellipse(650, 190, 110, 30, 0, 0, Math.PI * 2);
                ctx.fill();

                
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


                // Espalda de Juan (más grande en primer plano)
                ctx.fillStyle = '#F8FAFC';
                ctx.fillRect(0, 35, 52, 45); // Camisa blanca
                ctx.fillStyle = '#1E3A8A';
                ctx.fillRect(4, 78, 20, 32); // Pantalón
                ctx.fillRect(28, 78, 20, 32);

                // Pañuelo rojo típico atrás
                ctx.fillStyle = '#DC2626';
                ctx.fillRect(10, 32, 32, 8);

                // Nuca
                ctx.fillStyle = '#FBBF24';
                ctx.fillRect(15, 12, 22, 22);

                // Chonete tico visto desde atrás en grande
                ctx.fillStyle = '#FFFFFF';
                ctx.beginPath();
                ctx.roundRect(10, -8, 32, 22, [8, 8, 0, 0]);
                ctx.fill();
                ctx.fillStyle = '#002B7F'; // Franja tricolor
                ctx.fillRect(10, 4, 32, 4);
                ctx.fillStyle = '#CE1126';
                ctx.fillRect(10, 8, 32, 4);
                ctx.fillStyle = '#F8FAFC';
                ctx.beginPath();
                ctx.ellipse(26, 16, 28, 8, 0, 0, Math.PI * 2);
                ctx.fill();

                ctx.restore();

                // 3. EL PIEDRERO EN GRANDE A LA DERECHA (DE FRENTE)
                ctx.save();
                const pX = 610 + pokemonEncounter.piedreroOffset;
                const pY = 85;
                ctx.translate(pX, pY);

                // Abrigo café desgastado
                ctx.fillStyle = '#573312';
                ctx.fillRect(0, 36, 55, 50);
                ctx.fillStyle = '#1E293B';
                ctx.fillRect(8, 85, 16, 25);
                ctx.fillRect(30, 85, 16, 25);

                // Rostro del piedrero
                ctx.fillStyle = '#D97706';
                ctx.fillRect(12, 8, 30, 28);
                ctx.fillStyle = '#DC2626'; // Gorra roja hacia atrás
                ctx.fillRect(6, 0, 42, 10);
                ctx.fillRect(38, 5, 15, 6);

                // Ojos callejeros
                ctx.fillStyle = '#FFFFFF';
                ctx.fillRect(18, 16, 6, 6);
                ctx.fillRect(30, 16, 6, 6);
                ctx.fillStyle = '#000000';
                ctx.fillRect(20, 18, 3, 3);
                ctx.fillRect(32, 18, 3, 3);

                // Mano extendida
                ctx.fillStyle = '#D97706';
                ctx.fillRect(-12, 54, 18, 10);

                // SI APUÑALA: ANIMACIÓN DE NAVAJA SALIENDO
                if (pokemonEncounter.slashAnim > 0) {
                    ctx.fillStyle = '#E2E8F0'; // Hoja metálica de la navaja
                    ctx.fillRect(-35, 48, 30, 8);
                    ctx.fillStyle = '#78350F'; // Mango
                    ctx.fillRect(-10, 46, 8, 12);
                }

                ctx.restore();

                // 4. CUADRO DE DIÁLOGO ESTILO POKÉMON EN LA PARTE INFERIOR
                ctx.fillStyle = '#FFFFFF';
                ctx.strokeStyle = '#0F172A';
                ctx.lineWidth = 4;
                ctx.beginPath();
                ctx.roundRect(40, 270, canvas.width - 80, 95, 8);
                ctx.fill();
                ctx.stroke();

                // Nombre del oponente
                ctx.fillStyle = '#002B7F';
                ctx.font = 'bold 13px monospace';
                ctx.textAlign = 'left';
                ctx.fillText('¡EL PIEDRERO DEL PRECA APARECIO!', 60, 292);

                
                
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

            }

            // CINEMÁTICA FINAL: VICTORIA
            if (cinematic.active) {
                cinematic.timer++;

                if (cinematic.phase === 0) {
                    player.facing = 1;
                    player.walkCycle += 0.25;
                    if (player.x < (casona.x - worldX) - 50) {
                        player.x += 3.5;
                    } else {
                        cinematic.phase = 1;
                        cinematic.torchProjectile = {
                            x: player.x + 20,
                            y: player.y + 10,
                            vx: 5.5,
                            vy: -6.5,
                            angle: 0
                        };
                        player.hasTorch = false;
                        playSfx('boost');
                    }
                } else if (cinematic.phase === 1) {
                    const tp = cinematic.torchProjectile;
                    tp.x += tp.vx;
                    tp.y += tp.vy;
                    tp.vy += 0.22;
                    tp.angle += 0.2;

                    const targetHitX = (casona.x - worldX) + 80;
                    if (tp.x >= targetHitX) {
                        cinematic.phase = 2;
                        casona.burningIntensity = 1;
                        playSfx('burn');
                        walkerEnemies.forEach(e => {
                            e.defeated = true;
                        });
                    }
                } else if (cinematic.phase === 2) {
                    if (casona.burningIntensity < 18) {
                        casona.burningIntensity += 0.14;
                    }
                    walkerEnemies.forEach(e => {
                        if (e.charr < 1) e.charr += 0.015;
                    });
                    if (cinematic.timer > 175) {
                        playSfx('victory');
                        setGameState('victory');
                        cancelAnimationFrame(animId);
                        return;
                    }
                }
            }

            animId = requestAnimationFrame(loop);
        };

        animId = requestAnimationFrame(loop);

        return () => {
            cancelAnimationFrame(animId);
            
            window.removeEventListener('keydown', onKeyDown);
            window.removeEventListener('keyup', onKeyUp);
            window.removeEventListener('blur', onBlur);
            
            document.removeEventListener('visibilitychange', onVisibilityChange);
            if (canvasRef.current) canvasRef.current.removeEventListener('click', onCanvasClick);


            resetKeys();
        };
    }, [gameState, difficulty]);

    const startGame = () => {
        resetKeys();
        setGameState('playing');
        setDistance(0);
        setBottlesDodged(0);
        setHasTorch(false);
    };

    return (
        <div ref={containerRef} className="stitch-container" style={{ padding: '2.5rem 1rem 4rem 1rem', maxWidth: '860px' }}>

            {/* CABECERA */}
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '1rem',
                marginBottom: '1.25rem',
                paddingBottom: '1rem',
                borderBottom: '2px solid var(--border)'
            }}>
                <div>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: '#002B7F', fontWeight: '800', fontSize: '0.82rem', textTransform: 'uppercase' }}>
                        <Sparkles size={15} /> Minijuego Distrital Costarricense
                    </div>
                    <h1 style={{ fontSize: '1.85rem', fontWeight: '900', color: '#0F172A', margin: '0.2rem 0 0 0' }}>
                        La Gesta de Juan Santamaría • Quema del Mesón
                    </h1>
                </div>

                <button
                    onClick={() => setSoundEnabled(!soundEnabled)}
                    style={{
                        background: '#FFFFFF',
                        border: '1px solid #CBD5E1',
                        borderRadius: '4px',
                        padding: '0.45rem 0.75rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.35rem',
                        fontSize: '0.82rem',
                        fontWeight: '700',
                        color: '#334155'
                    }}
                >
                    {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
                    <span>{soundEnabled ? 'Sonido ON' : 'Mudo'}</span>
                </button>
            </div>

            {/* DASHBOARD DE MÉTRICAS */}
            
            
            
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                gap: '0.75rem',
                marginBottom: '1.25rem'
            }}>
                <div className="stitch-card" style={{ padding: '0.75rem 1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.82rem', color: '#64748B', fontWeight: '700' }}>Avance al Mesón:</span>
                    <strong style={{ fontSize: '1.1rem', color: '#002B7F' }}>{distance}%</strong>
                </div>

                {/* CONTADOR DE TEJAS OBLIGATORIO */}
                <div className="stitch-card" style={{ padding: '0.75rem 1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderLeft: '4px solid #F59E0B' }}>
                    <span style={{ fontSize: '0.82rem', color: '#64748B', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                        <Coins size={15} color="#F59E0B" /> Tejas (₡100):
                    </span>
                    <strong style={{ fontSize: '1.1rem', color: coinsCollected === totalCoins ? '#059669' : '#D97706' }}>
                        {coinsCollected} / {totalCoins}
                    </strong>
                </div>

                <div className="stitch-card" style={{ padding: '0.75rem 1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.82rem', color: '#64748B', fontWeight: '700' }}>Caciques Esquivados:</span>
                    <strong style={{ fontSize: '1.1rem', color: '#059669' }}>{bottlesDodged}</strong>
                </div>

                <div className="stitch-card" style={{ padding: '0.75rem 1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.82rem', color: '#64748B', fontWeight: '700' }}>Tea Sagrada:</span>
                    <strong style={{ fontSize: '0.88rem', color: hasTorch ? '#EA580C' : '#64748B', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <Flame size={15} /> {hasTorch ? '¡Lista!' : 'Buscando'}
                    </strong>
                </div>
            </div>

            {/* CANVAS DEL JUEGO */}
            <div style={{
                position: 'relative',
                width: '100%',
                height: '380px',
                borderRadius: '8px',
                overflow: 'hidden',
                border: '3px solid #002B7F',
                boxShadow: '0 8px 24px rgba(0,0,0,0.1)'
            }}>
                <canvas
                    ref={canvasRef}
                    width={840}
                    height={380}
                    style={{ width: '100%', height: '100%', display: 'block' }}
                />

                {/* PANTALLA INICIAL: DIFICULTAD REAJUSTADA A NIVELES LARGOS */}
                {gameState === 'start' && (
                    <div style={{
                        position: 'absolute',
                        inset: 0,
                        backgroundColor: 'rgba(15, 23, 42, 0.94)',
                        color: '#FFFFFF',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '2rem',
                        textAlign: 'center'
                    }}>
                        <h2 style={{ fontSize: '2.1rem', fontWeight: '900', color: '#FDE047', margin: '0 0 0.4rem 0' }}>
                            Seleccione la Dificultad
                        </h2>
                        <p style={{ maxWidth: '540px', fontSize: '0.88rem', color: '#CBD5E1', lineHeight: 1.45, margin: '0 0 1.5rem 0' }}>
                            ⚠️ <strong>ATENCIÓN:</strong> Debe recoger <strong>todas las monedas de ₡100 (tejas)</strong>. Al 84% de la ruta se abrirá un duelo estilo Pokémon con el piedrero. ¡Si no tiene todas las tejas, lo apuñalará!
                        </p>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem', width: '100%', maxWidth: '560px', marginBottom: '1.5rem' }}>
                            {[
                                { id: 'facil', name: 'Facilito', sub: 'Modo Romería (5.8 km)', desc: 'Distancia de leyenda y 4 tejas' },
                                { id: 'normal', name: 'Tico Promedio', sub: 'Hora Pico (8.5 km)', desc: 'Ruta larga y 6 tejas obligatorias' },
                                { id: 'leyenda', name: 'Modo Leyenda', sub: 'Cruce Taras (12 km)', desc: 'Desafío colosal y 8 tejas' }
                            ].map(d => (
                                <button
                                    key={d.id}
                                    onClick={() => {
                                        resetKeys();
                                        setDifficulty(d.id);
                                    }}
                                    style={{
                                        padding: '0.85rem 0.55rem',
                                        borderRadius: '6px',
                                        border: difficulty === d.id ? '2px solid #FDE047' : '1px solid #475569',
                                        backgroundColor: difficulty === d.id ? 'rgba(253, 224, 71, 0.2)' : 'rgba(255,255,255,0.05)',
                                        color: difficulty === d.id ? '#FDE047' : '#FFFFFF',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        gap: '0.25rem',
                                        transition: 'all 0.2s'
                                    }}
                                >
                                    <strong style={{ fontSize: '0.92rem' }}>{d.name}</strong>
                                    <span style={{ fontSize: '0.7rem', color: '#94A3B8', fontWeight: '600' }}>{d.sub}</span>
                                    <span style={{ fontSize: '0.68rem', color: '#CBD5E1', marginTop: '0.2rem' }}>{d.desc}</span>
                                </button>
                            ))}
                        </div>

                        <button
                            onClick={startGame}
                            style={{
                                backgroundColor: '#DC2626',
                                color: '#FFFFFF',
                                border: 'none',
                                padding: '0.85rem 2.5rem',
                                borderRadius: '6px',
                                fontSize: '1.05rem',
                                fontWeight: '900',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                boxShadow: '0 4px 14px rgba(220, 38, 38, 0.4)'
                            }}
                        >
                            <Play size={18} /> Iniciar Gesta Heroica
                        </button>
                    </div>
                )}

                {/* PANTALLA DERROTA */}
                {gameState === 'gameover' && (
                    <div style={{
                        position: 'absolute',
                        inset: 0,
                        backgroundColor: 'rgba(15, 23, 42, 0.94)',
                        color: '#FFFFFF',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '2rem',
                        textAlign: 'center'
                    }}>
                        <h2 style={{ fontSize: '2.1rem', fontWeight: '900', color: '#EF4444', margin: '0 0 0.5rem 0' }}>
                            {deathReason}
                        </h2>
                        <p style={{ fontSize: '0.92rem', color: '#CBD5E1', margin: '0 0 1.5rem 0' }}>
                            Alcanzó a recorrer el <strong>{distance}%</strong> de la ruta y esquivó <strong>{bottlesDodged}</strong> botellas de Cacique.<br />
                            Dificultad: <strong>{difficulty.toUpperCase()}</strong>.
                        </p>

                        <button
                            onClick={startGame}
                            style={{
                                backgroundColor: '#002B7F',
                                color: '#FFFFFF',
                                border: 'none',
                                padding: '0.75rem 2rem',
                                borderRadius: '6px',
                                fontSize: '0.95rem',
                                fontWeight: '800',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.45rem'
                            }}
                        >
                            <RotateCcw size={17} /> Intentar de Nuevo
                        </button>
                    </div>
                )}

                {/* PANTALLA VICTORIA TRAS DERROTAR A WALKER */}
                {gameState === 'victory' && (
                    <div style={{
                        position: 'absolute',
                        inset: 0,
                        backgroundColor: 'rgba(5, 150, 105, 0.95)',
                        color: '#FFFFFF',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '2rem',
                        textAlign: 'center'
                    }}>
                        <Trophy size={50} color="#FDE047" style={{ marginBottom: '0.5rem' }} />
                        <h2 style={{ fontSize: '2.3rem', fontWeight: '900', color: '#FFFFFF', margin: '0 0 0.4rem 0' }}>
                            ¡SE QUEMO EL MEZON Y WALKER FUE DERROTADO!
                        </h2>
                        <p style={{ maxWidth: '520px', fontSize: '1rem', color: '#DCFCE7', lineHeight: 1.5, margin: '0 0 1.75rem 0' }}>
                            ¡Superó el encuentro con el piedrero, prendió el Mesón y carbonizó a los filibusteros en dificultad <strong>{difficulty.toUpperCase()}</strong>! La Patria y San Juan de Dios celebran su victoria.
                        </p>
                        <button
                            onClick={startGame}
                            style={{
                                backgroundColor: '#0F172A',
                                color: '#FFFFFF',
                                border: 'none',
                                padding: '0.8rem 2rem',
                                borderRadius: '6px',
                                fontSize: '0.95rem',
                                fontWeight: '800',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.45rem'
                            }}
                        >
                            <RotateCcw size={17} /> Jugar Otra Vez
                        </button>
                    </div>
                )}
            </div>

            {/* GUÍA DE CONTROLES */}
            <div style={{
                marginTop: '1rem',
                padding: '0.85rem 1rem',
                backgroundColor: '#FFFFFF',
                borderRadius: '6px',
                border: '1px solid #CBD5E1',
                fontSize: '0.82rem',
                color: '#475569',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '0.5rem'
            }}>
                <div>
                    ⌨️ <strong>Controles de Teclado:</strong> Teclas <strong>A / D</strong> o flechas para avanzar o retroceder • <strong>Espacio / W</strong> para saltar zanjas y alcantarillas.
                </div>
                <div style={{ fontSize: '0.78rem', color: '#D97706', fontWeight: '800' }}>
                    💰 Recuerde: ¡No deje ni una teja (₡100) botada para superar el encuentro con el piedro!
                </div>
            </div>

        </div>
    );
};