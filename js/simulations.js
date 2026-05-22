(() => {
    "use strict";

    // =========================================================
    // HELPERS
    // =========================================================
    const $ = (id) => document.getElementById(id);
    const $$ = (selector) => Array.from(document.querySelectorAll(selector));
    const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
    const lerp = (a, b, t) => a + (b - a) * t;
    const rand = (min, max) => Math.random() * (max - min) + min;
    const dist = (x1, y1, x2, y2) => Math.hypot(x2 - x1, y2 - y1);

    const resizeCanvasToDisplaySize = (canvas) => {
        if (!canvas) return false;
        const dpr = window.devicePixelRatio || 1;
        const rect = canvas.getBoundingClientRect();
        const width = Math.floor(rect.width * dpr);
        const height = Math.floor(rect.height * dpr);

        if (canvas.width !== width || canvas.height !== height) {
            canvas.width = width;
            canvas.height = height;
            return true;
        }
        return false;
    };

    // =========================================================
    // DOM
    // =========================================================
    const canvas = $("simCanvas");
    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    const patternButtons = $$("#patternButtons .pattern-btn");

    const wSlider = $("wSlider");
    const countSlider = $("countSlider");
    const forceSlider = $("forceSlider");
    const speedSlider = $("speedSlider");
    const micBtn = $("micBtn");

    const simPatternLabel = $("simPatternLabel");
    const simCountLabel = $("simCountLabel");
    const simWLabel = $("simWLabel");
    const simFpsLabel = $("simFpsLabel");

    const wValue = $("wValue");
    const countValue = $("countValue");
    const forceValue = $("forceValue");

    const statSpeed = $("statSpeed");
    const statLinks = $("statLinks");
    const statEnergy = $("statEnergy");
    const statDocked = $("statDocked");

    // =========================================================
    // STATE
    // =========================================================
    const PATTERN_NAMES = [
        "CIRCLE",
        "VORTEX",
        "WAVE",
        "LINE",
        "BOIDS",
        "SPIRAL",
        "FIG-8",
        "GRID"
    ];

    const state = {
        time: 0,
        pattern: 0,
        w: 0.5,
        count: 60,
        force: 0.5,
        speed: 1,
        bots: [],
        fps: 60,
        lastFrameTime: performance.now(),
        mouse: {
            x: 0,
            y: 0,
            active: false,
            down: false
        },
        audioMode: false
    };

    // =========================================================
    // BOT FACTORY
    // =========================================================
    const makeBot = (w, h, i) => ({
        id: i,
        x: rand(w * 0.2, w * 0.8),
        y: rand(h * 0.2, h * 0.8),
        vx: rand(-1, 1),
        vy: rand(-1, 1),
        tx: w / 2,
        ty: h / 2,
        size: rand(2.5, 4.8),
        energy: rand(85, 100),
        phase: rand(0, Math.PI * 2),
        docked: false
    });

    const rebuildBots = () => {
        resizeCanvasToDisplaySize(canvas);
        const w = canvas.width;
        const h = canvas.height;

        const newBots = [];
        for (let i = 0; i < state.count; i++) {
            const existing = state.bots[i];
            if (existing) {
                newBots.push(existing);
            } else {
                newBots.push(makeBot(w, h, i));
            }
        }
        state.bots = newBots;
    };

    // =========================================================
    // TARGET GENERATORS
    // =========================================================
    const setTargetsCircle = (w, h) => {
        const cx = w / 2;
        const cy = h / 2;
        const radius = Math.min(w, h) * (0.18 + state.w * 0.22);

        state.bots.forEach((bot, i) => {
            const a = (Math.PI * 2 * i) / state.bots.length + state.time * 0.15 * state.speed;
            bot.tx = cx + Math.cos(a) * radius;
            bot.ty = cy + Math.sin(a) * radius;
        });
    };

    const setTargetsVortex = (w, h) => {
        const cx = w / 2;
        const cy = h / 2;

        state.bots.forEach((bot, i) => {
            const t = state.time * 0.7 * state.speed;
            const ratio = i / Math.max(1, state.bots.length - 1);
            const radius = 25 + ratio * Math.min(w, h) * 0.32;
            const a = ratio * 10 + t;
            bot.tx = cx + Math.cos(a) * radius;
            bot.ty = cy + Math.sin(a) * radius;
        });
    };

    const setTargetsWave = (w, h) => {
        const left = w * 0.12;
        const width = w * 0.76;
        const cy = h / 2;
        const amplitude = h * (0.08 + state.w * 0.18);

        state.bots.forEach((bot, i) => {
            const ratio = i / Math.max(1, state.bots.length - 1);
            const x = left + ratio * width;
            const y = cy + Math.sin(ratio * Math.PI * 4 + state.time * 2.2 * state.speed) * amplitude;
            bot.tx = x;
            bot.ty = y;
        });
    };

    const setTargetsLine = (w, h) => {
        const left = w * 0.15;
        const right = w * 0.85;
        const y = h / 2 + Math.sin(state.time * 1.2) * h * 0.03;

        state.bots.forEach((bot, i) => {
            const ratio = i / Math.max(1, state.bots.length - 1);
            bot.tx = lerp(left, right, ratio);
            bot.ty = y;
        });
    };

    const setTargetsBoids = (w, h) => {
        state.bots.forEach((bot, i) => {
            let separationX = 0;
            let separationY = 0;
            let cohesionX = 0;
            let cohesionY = 0;
            let alignmentX = 0;
            let alignmentY = 0;
            let neighbors = 0;

            for (let j = 0; j < state.bots.length; j++) {
                if (i === j) continue;
                const other = state.bots[j];
                const d = dist(bot.x, bot.y, other.x, other.y);

                if (d < 110) {
                    neighbors++;
                    cohesionX += other.x;
                    cohesionY += other.y;
                    alignmentX += other.vx;
                    alignmentY += other.vy;

                    if (d < 30 && d > 0.001) {
                        separationX += (bot.x - other.x) / d;
                        separationY += (bot.y - other.y) / d;
                    }
                }
            }

            if (neighbors > 0) {
                cohesionX /= neighbors;
                cohesionY /= neighbors;
                alignmentX /= neighbors;
                alignmentY /= neighbors;

                bot.tx = bot.x +
                    (cohesionX - bot.x) * 0.06 +
                    alignmentX * 8 +
                    separationX * 18;
                bot.ty = bot.y +
                    (cohesionY - bot.y) * 0.06 +
                    alignmentY * 8 +
                    separationY * 18;
            } else {
                bot.tx = bot.x + Math.cos(state.time + bot.phase) * 10;
                bot.ty = bot.y + Math.sin(state.time + bot.phase) * 10;
            }

            bot.tx = clamp(bot.tx, 30, w - 30);
            bot.ty = clamp(bot.ty, 30, h - 30);
        });
    };

    const setTargetsSpiral = (w, h) => {
        const cx = w / 2;
        const cy = h / 2;
        const maxRadius = Math.min(w, h) * 0.35;

        state.bots.forEach((bot, i) => {
            const ratio = i / Math.max(1, state.bots.length - 1);
            const radius = ratio * maxRadius;
            const a = ratio * Math.PI * 8 + state.time * 0.9 * state.speed;
            bot.tx = cx + Math.cos(a) * radius;
            bot.ty = cy + Math.sin(a) * radius;
        });
    };

    const setTargetsFig8 = (w, h) => {
        const cx = w / 2;
        const cy = h / 2;
        const scale = Math.min(w, h) * 0.22;

        state.bots.forEach((bot, i) => {
            const ratio = i / Math.max(1, state.bots.length - 1);
            const t = ratio * Math.PI * 2 + state.time * 0.8 * state.speed;
            bot.tx = cx + Math.sin(t) * scale;
            bot.ty = cy + Math.sin(t * 2) * scale * 0.6;
        });
    };

    const setTargetsGrid = (w, h) => {
        const cols = Math.ceil(Math.sqrt(state.bots.length));
        const rows = Math.ceil(state.bots.length / cols);
        const spacingX = Math.min(55, w * 0.08 + state.w * 10);
        const spacingY = Math.min(55, h * 0.08 + state.w * 10);

        const totalW = (cols - 1) * spacingX;
        const totalH = (rows - 1) * spacingY;
        const startX = w / 2 - totalW / 2;
        const startY = h / 2 - totalH / 2;

        state.bots.forEach((bot, i) => {
            const col = i % cols;
            const row = Math.floor(i / cols);
            bot.tx = startX + col * spacingX;
            bot.ty = startY + row * spacingY;
        });
    };

    const computeTargets = (w, h) => {
        switch (state.pattern) {
            case 0: setTargetsCircle(w, h); break;
            case 1: setTargetsVortex(w, h); break;
            case 2: setTargetsWave(w, h); break;
            case 3: setTargetsLine(w, h); break;
            case 4: setTargetsBoids(w, h); break;
            case 5: setTargetsSpiral(w, h); break;
            case 6: setTargetsFig8(w, h); break;
            case 7: setTargetsGrid(w, h); break;
            default: setTargetsCircle(w, h); break;
        }
    };

    // =========================================================
    // INTERACTION
    // =========================================================
    const applyMouseInfluence = () => {
        if (!state.mouse.active) return;

        state.bots.forEach((bot) => {
            const d = dist(bot.x, bot.y, state.mouse.x, state.mouse.y);
            const range = 140;
            if (d < range && d > 0.001) {
                const strength = (1 - d / range) * (state.mouse.down ? 1.8 : 0.7);
                const dx = (state.mouse.x - bot.x) / d;
                const dy = (state.mouse.y - bot.y) / d;

                bot.vx += dx * strength * 0.35;
                bot.vy += dy * strength * 0.35;
            }
        });
    };

    // =========================================================
    // UPDATE BOTS
    // =========================================================
    const updateBots = (dt, w, h) => {
        const stiffness = 0.02 + state.w * 0.08;
        const interaction = 0.15 + state.force * 0.45;
        const damping = 0.90 - state.w * 0.08;

        computeTargets(w, h);
        applyMouseInfluence();

        for (let i = 0; i < state.bots.length; i++) {
            const bot = state.bots[i];

            const ax = (bot.tx - bot.x) * stiffness;
            const ay = (bot.ty - bot.y) * stiffness;

            bot.vx += ax * dt * 60 * state.speed;
            bot.vy += ay * dt * 60 * state.speed;

            // inter-bot soft repulsion / cohesion
            for (let j = i + 1; j < state.bots.length; j++) {
                const other = state.bots[j];
                const dx = other.x - bot.x;
                const dy = other.y - bot.y;
                const d = Math.hypot(dx, dy) || 0.001;

                const desired = 18 + state.w * 24;
                if (d < desired * 1.5) {
                    const push = (desired - d) * 0.0025 * interaction;
                    const nx = dx / d;
                    const ny = dy / d;

                    bot.vx -= nx * push * dt * 60;
                    bot.vy -= ny * push * dt * 60;
                    other.vx += nx * push * dt * 60;
                    other.vy += ny * push * dt * 60;
                }
            }

            bot.vx *= damping;
            bot.vy *= damping;

            bot.x += bot.vx * dt * 60;
            bot.y += bot.vy * dt * 60;

            // bounds
            if (bot.x < 18) {
                bot.x = 18;
                bot.vx *= -0.6;
            }
            if (bot.x > w - 18) {
                bot.x = w - 18;
                bot.vx *= -0.6;
            }
            if (bot.y < 18) {
                bot.y = 18;
                bot.vy *= -0.6;
            }
            if (bot.y > h - 18) {
                bot.y = h - 18;
                bot.vy *= -0.6;
            }

            bot.energy = clamp(bot.energy - 0.0015 * state.speed + Math.sin(state.time + bot.phase) * 0.002, 65, 100);
        }
    };

    // =========================================================
    // DRAW
    // =========================================================
    const drawBackground = (w, h) => {
        ctx.clearRect(0, 0, w, h);

        const gradient = ctx.createLinearGradient(0, 0, w, h);
        gradient.addColorStop(0, "rgba(255,255,255,0.02)");
        gradient.addColorStop(1, "rgba(255,255,255,0.00)");
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, w, h);

        ctx.strokeStyle = "rgba(255,255,255,0.05)";
        ctx.lineWidth = 1;

        const step = Math.max(40, Math.floor(w / 18));
        for (let x = 0; x <= w; x += step) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, h);
            ctx.stroke();
        }
        for (let y = 0; y <= h; y += step) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(w, y);
            ctx.stroke();
        }
    };

    const drawLinks = () => {
        let links = 0;
        let docked = 0;

        for (let i = 0; i < state.bots.length; i++) {
            const a = state.bots[i];
            a.docked = false;

            for (let j = i + 1; j < state.bots.length; j++) {
                const b = state.bots[j];
                const d = dist(a.x, a.y, b.x, b.y);

                if (d < 65) {
                    links++;
                    const alpha = clamp(1 - d / 65, 0.05, 0.32);

                    ctx.beginPath();
                    ctx.moveTo(a.x, a.y);
                    ctx.lineTo(b.x, b.y);
                    ctx.strokeStyle = `rgba(255,255,255,${alpha})`;
                    ctx.lineWidth = d < 28 ? 1.8 : 1;
                    ctx.stroke();

                    if (d < 24) {
                        a.docked = true;
                        b.docked = true;
                    }
                }
            }
        }

        state._links = links;
        state._docked = state.bots.filter((b) => b.docked).length;
    };

    const drawTargets = () => {
        ctx.fillStyle = "rgba(255,255,255,0.05)";
        state.bots.forEach((bot, i) => {
            if (i % 2 !== 0) return;
            ctx.beginPath();
            ctx.arc(bot.tx, bot.ty, 1.5, 0, Math.PI * 2);
            ctx.fill();
        });
    };

    const drawBots = () => {
        state.bots.forEach((bot) => {
            const pulse = (Math.sin(state.time * 3 + bot.phase) + 1) * 0.5;
            const r = bot.size + pulse * 1.1;

            // glow
            ctx.beginPath();
            ctx.arc(bot.x, bot.y, r + 7, 0, Math.PI * 2);
            ctx.fillStyle = bot.docked
                ? "rgba(255,255,255,0.10)"
                : "rgba(255,255,255,0.05)";
            ctx.fill();

            // body
            ctx.beginPath();
            ctx.arc(bot.x, bot.y, r, 0, Math.PI * 2);
            ctx.fillStyle = bot.docked
                ? "rgba(255,255,255,0.95)"
                : "rgba(225,225,225,0.85)";
            ctx.shadowBlur = bot.docked ? 16 : 10;
            ctx.shadowColor = "rgba(255,255,255,0.25)";
            ctx.fill();
            ctx.shadowBlur = 0;
        });
    };

    const drawMouseField = () => {
        if (!state.mouse.active) return;

        ctx.beginPath();
        ctx.arc(state.mouse.x, state.mouse.y, state.mouse.down ? 80 : 50, 0, Math.PI * 2);
        ctx.strokeStyle = state.mouse.down
            ? "rgba(255,255,255,0.28)"
            : "rgba(255,255,255,0.14)";
        ctx.lineWidth = 1.5;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(state.mouse.x, state.mouse.y, 6, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255,255,255,0.85)";
        ctx.fill();
    };

    const draw = () => {
        resizeCanvasToDisplaySize(canvas);

        const w = canvas.width;
        const h = canvas.height;

        drawBackground(w, h);
        drawTargets();
        drawLinks();
        drawBots();
        drawMouseField();
    };

    // =========================================================
    // HUD / LABELS / STATS
    // =========================================================
    const updateHud = () => {
        if (simPatternLabel) simPatternLabel.textContent = PATTERN_NAMES[state.pattern];
        if (simCountLabel) simCountLabel.textContent = `N=${state.count}`;
        if (simWLabel) simWLabel.textContent = `W=${state.w.toFixed(2)}`;
        if (simFpsLabel) simFpsLabel.textContent = `${Math.round(state.fps)} FPS`;

        if (wValue) wValue.textContent = state.w.toFixed(2);
        if (countValue) countValue.textContent = `${state.count} bot`;
        if (forceValue) forceValue.textContent = `${Math.round(state.force * 100)}%`;

        const avgSpeed =
            state.bots.reduce((sum, b) => sum + Math.hypot(b.vx, b.vy), 0) /
            Math.max(1, state.bots.length);

        const avgEnergy =
            state.bots.reduce((sum, b) => sum + b.energy, 0) /
            Math.max(1, state.bots.length);

        if (statSpeed) statSpeed.textContent = avgSpeed.toFixed(1);
        if (statLinks) statLinks.textContent = `${state._links || 0}`;
        if (statEnergy) statEnergy.textContent = `${Math.round(avgEnergy)}%`;
        if (statDocked) statDocked.textContent = `${state._docked || 0}`;
    };

    // =========================================================
    // CONTROLS
    // =========================================================
    const setPattern = (index) => {
        state.pattern = index;
        patternButtons.forEach((btn) => {
            btn.classList.toggle("active", Number(btn.dataset.pattern) === index);
        });
    };

    const initControls = () => {
        patternButtons.forEach((btn) => {
            btn.addEventListener("click", () => {
                const index = Number(btn.dataset.pattern);
                setPattern(index);
            });
        });

        if (wSlider) {
            state.w = Number(wSlider.value) / 100;
            wSlider.addEventListener("input", () => {
                state.w = Number(wSlider.value) / 100;
            });
        }

        if (countSlider) {
            state.count = Number(countSlider.value);
            countSlider.addEventListener("input", () => {
                state.count = Number(countSlider.value);
                rebuildBots();
            });
        }

        if (forceSlider) {
            state.force = Number(forceSlider.value) / 100;
            forceSlider.addEventListener("input", () => {
                state.force = Number(forceSlider.value) / 100;
            });
        }

        if (speedSlider) {
            state.speed = Number(speedSlider.value) / 100;
            speedSlider.addEventListener("input", () => {
                state.speed = Number(speedSlider.value) / 100;
            });
        }

        if (micBtn) {
            micBtn.addEventListener("click", () => {
                state.audioMode = !state.audioMode;
                micBtn.classList.toggle("active", state.audioMode);
            });
        }
    };

    // =========================================================
    // MOUSE EVENTS
    // =========================================================
    const getMousePos = (e) => {
        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;
        return {
            x: (e.clientX - rect.left) * scaleX,
            y: (e.clientY - rect.top) * scaleY
        };
    };

    const initMouse = () => {
        canvas.addEventListener("mousemove", (e) => {
            const pos = getMousePos(e);
            state.mouse.x = pos.x;
            state.mouse.y = pos.y;
            state.mouse.active = true;
        });

        canvas.addEventListener("mouseenter", () => {
            state.mouse.active = true;
        });

        canvas.addEventListener("mouseleave", () => {
            state.mouse.active = false;
            state.mouse.down = false;
        });

        canvas.addEventListener("mousedown", (e) => {
            const pos = getMousePos(e);
            state.mouse.x = pos.x;
            state.mouse.y = pos.y;
            state.mouse.down = true;
            state.mouse.active = true;
        });

        window.addEventListener("mouseup", () => {
            state.mouse.down = false;
        });
    };

    // =========================================================
    // LOOP
    // =========================================================
    const tick = (now) => {
        const dt = clamp((now - state.lastFrameTime) / 1000, 0.001, 0.03);
        state.lastFrameTime = now;
        state.time += dt * (state.audioMode ? 1.35 : 1);

        state.fps = 1 / dt;

        resizeCanvasToDisplaySize(canvas);
        updateBots(dt, canvas.width, canvas.height);
        draw();
        updateHud();

        requestAnimationFrame(tick);
    };

    // =========================================================
    // INIT
    // =========================================================
    const init = () => {
        resizeCanvasToDisplaySize(canvas);
        rebuildBots();
        initControls();
        initMouse();
        updateHud();
        setPattern(0);
        requestAnimationFrame(tick);
    };

    window.addEventListener("resize", () => {
        resizeCanvasToDisplaySize(canvas);
        rebuildBots();
    });

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }
})();