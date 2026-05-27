(() => {
    "use strict";

    const $ = (id) => document.getElementById(id);
    const clamp = (v, min, max) => Math.max(min, Math.min(max, v));
    const rand = (min, max) => Math.random() * (max - min) + min;

    /* ── Accent palette ── */
    const C = {
        cyan:        "#00d4ff",
        cyanSoft:    "rgba(0,212,255,0.15)",
        cyanGlow:    "rgba(0,212,255,0.30)",
        cyanLine:    "rgba(0,212,255,0.90)",
        cyanFaint:   "rgba(0,212,255,0.06)",
        green:       "#00ff88",
        greenSoft:   "rgba(0,255,136,0.12)",
        greenGlow:   "rgba(0,255,136,0.30)",
        greenLine:   "rgba(0,255,136,0.90)",
        warn:        "#ffbe2e",
        warnSoft:    "rgba(255,190,46,0.12)",
        warnLine:    "rgba(255,190,46,0.90)",
        warnGlow:    "rgba(255,190,46,0.25)",
        danger:      "#ff4d6a",
        dangerSoft:  "rgba(255,77,106,0.12)",
        dangerLine:  "rgba(255,77,106,0.90)",
        dangerGlow:  "rgba(255,77,106,0.25)",
        grid:        "rgba(0,212,255,0.04)",
        ring:        "rgba(0,212,255,0.07)",
        link:        "rgba(0,212,255,0.10)",
        text:        "rgba(0,212,255,0.55)",
        tick:        "rgba(0,212,255,0.15)",
        arcBg:       "rgba(0,212,255,0.08)",
    };

    /* Card-specific palettes keyed by card type */
    const CARD_COLORS = {
        success: { line: C.greenLine, area: C.greenSoft, glow: C.greenGlow },
        info:    { line: C.cyanLine,  area: C.cyanSoft,  glow: C.cyanGlow  },
        warning: { line: C.warnLine,  area: C.warnSoft,  glow: C.warnGlow  },
        energy:  { line: C.cyanLine,  area: C.cyanSoft,  glow: C.cyanGlow  },
    };

    const resizeCanvas = (canvas) => {
        if (!canvas) return false;
        const dpr = window.devicePixelRatio || 1;
        const rect = canvas.getBoundingClientRect();
        const w = Math.floor(rect.width * dpr);
        const h = Math.floor(rect.height * dpr);
        if (canvas.width !== w || canvas.height !== h) {
            canvas.width = w;
            canvas.height = h;
            return true;
        }
        return false;
    };

    /* ── DOM ── */
    const els = {
        botCount: $("dashBotCount"),
        fps: $("dashFPS"),
        latency: $("dashLatency"),
        energy: $("dashEnergy"),

        chart1: $("dashChart1"),
        chart2: $("dashChart2"),
        chart3: $("dashChart3"),
        chart4: $("dashChart4"),

        dashboardCanvas: $("dashboardCanvas"),

        gaugeTemp: $("gaugeTemp"),
        gaugeCPU: $("gaugeCPU"),
        gaugeNetwork: $("gaugeNetwork"),

        gaugeTempValue: $("gaugeTempValue"),
        gaugeCPUValue: $("gaugeCPUValue"),
        gaugeNetworkValue: $("gaugeNetworkValue"),

        /* change indicators */
        changeBots: null,
        changeFps: null,
        changeLatency: null,
        changeEnergy: null,
    };

    /* Try to grab the change indicator divs */
    const cards = document.querySelectorAll(".dashboard-card");
    if (cards[0]) els.changeBots = cards[0].querySelector(".dashboard-change");
    if (cards[1]) els.changeFps = cards[1].querySelector(".dashboard-change");
    if (cards[2]) els.changeLatency = cards[2].querySelector(".dashboard-change");
    if (cards[3]) els.changeEnergy = cards[3].querySelector(".dashboard-change");

    const hasDashboard =
        els.dashboardCanvas && els.chart1 && els.chart2 &&
        els.chart3 && els.chart4 && els.gaugeTemp &&
        els.gaugeCPU && els.gaugeNetwork;

    if (!hasDashboard) return;

    /* ── STATE ── */
    const state = {
        time: 0,
        bots: [],
        miniCharts: { botCount: [], fps: [], latency: [], energy: [] },
        prev: { botCount: 24, fps: 120, latency: 4.2, energy: 87 },
        values: {
            botCount: 24, fps: 120, latency: 4.2, energy: 87,
            temp: 32, cpu: 45, network: 23
        }
    };

    /* ── INIT BOTS ── */
    const initBots = () => {
        state.bots = [];
        for (let i = 0; i < 24; i++) {
            state.bots.push({
                angle: (Math.PI * 2 * i) / 24,
                radius: rand(70, 150),
                speed: rand(0.002, 0.008),
                pulse: rand(0, Math.PI * 2),
                size: rand(2.5, 5),
                orbitOffset: rand(-20, 20)
            });
        }
    };

    /* ── SEED MINI CHARTS ── */
    const seedMiniCharts = () => {
        for (let i = 0; i < 40; i++) {
            state.miniCharts.botCount.push(20 + Math.sin(i * 0.25) * 2 + rand(-0.5, 0.5));
            state.miniCharts.fps.push(118 + Math.sin(i * 0.2) * 2 + rand(-0.4, 0.4));
            state.miniCharts.latency.push(4.2 + Math.sin(i * 0.18) * 0.25 + rand(-0.08, 0.08));
            state.miniCharts.energy.push(87 - i * 0.03 + Math.sin(i * 0.12) * 0.3);
        }
    };

    const push = (arr, v, max = 40) => { arr.push(v); if (arr.length > max) arr.shift(); };

    /* ── LIVE VALUES ── */
    const updateValues = () => {
        state.time += 0.016;
        const t = state.time;

        /* snapshot previous for delta */
        state.prev.botCount = state.values.botCount;
        state.prev.fps      = state.values.fps;
        state.prev.latency  = state.values.latency;
        state.prev.energy   = state.values.energy;

        state.values.botCount = Math.round(24 + Math.sin(t * 0.7) * 2 + rand(-0.2, 0.2));
        state.values.fps      = Math.round(120 + Math.sin(t * 1.2) * 1.5 + rand(-0.4, 0.4));
        state.values.latency  = clamp(4.2 + Math.sin(t * 0.9) * 0.35 + rand(-0.05, 0.05), 3.5, 5.3);
        state.values.energy   = clamp(87 + Math.sin(t * 0.25) * 1.2 - t * 0.01, 72, 92);
        state.values.temp     = clamp(32 + Math.sin(t * 0.6) * 2 + rand(-0.15, 0.15), 28, 39);
        state.values.cpu      = clamp(45 + Math.sin(t * 1.1) * 7 + rand(-0.4, 0.4), 28, 68);
        state.values.network  = clamp(23 + Math.sin(t * 0.85) * 5 + rand(-0.3, 0.3), 12, 41);

        push(state.miniCharts.botCount, state.values.botCount);
        push(state.miniCharts.fps, state.values.fps);
        push(state.miniCharts.latency, state.values.latency);
        push(state.miniCharts.energy, state.values.energy);

        /* DOM text updates */
        if (els.botCount) els.botCount.textContent = `${state.values.botCount}`;
        if (els.fps) els.fps.textContent = `${state.values.fps}`;
        if (els.latency) els.latency.innerHTML = `${state.values.latency.toFixed(1)}<span style="font-size:1rem">ms</span>`;
        if (els.energy) els.energy.innerHTML = `${Math.round(state.values.energy)}<span style="font-size:1rem">%</span>`;

        if (els.gaugeTempValue) els.gaugeTempValue.textContent = `${Math.round(state.values.temp)}°C`;
        if (els.gaugeCPUValue) els.gaugeCPUValue.textContent = `${Math.round(state.values.cpu)}%`;
        if (els.gaugeNetworkValue) els.gaugeNetworkValue.textContent = `${Math.round(state.values.network)}%`;

        /* live change indicators */
        updateChangeIndicator(els.changeBots, state.values.botCount - state.prev.botCount, "", 0);
        updateChangeIndicator(els.changeFps, state.values.fps - state.prev.fps, "", 0);
        updateChangeIndicator(els.changeLatency, state.values.latency - state.prev.latency, "ms", 1);
        updateChangeIndicator(els.changeEnergy, state.values.energy - state.prev.energy, "%/s", 1);
    };

    const updateChangeIndicator = (el, delta, unit, decimals) => {
        if (!el) return;
        const abs = Math.abs(delta);
        if (abs < 0.01) {
            el.textContent = "— Stabile";
            el.className = "dashboard-change stable";
        } else if (delta > 0) {
            el.textContent = `↑ ${abs.toFixed(decimals)}${unit}`;
            el.className = "dashboard-change up";
        } else {
            el.textContent = `↓ ${abs.toFixed(decimals)}${unit}`;
            el.className = "dashboard-change down";
        }
    };

    /* ══════════════════════════════════════════════════════
       MINI CHARTS — per-card accent colors
    ══════════════════════════════════════════════════════ */
    const drawMiniChart = (canvas, values, palette) => {
        if (!canvas) return;
        resizeCanvas(canvas);
        const ctx = canvas.getContext("2d");
        const w = canvas.width, h = canvas.height;
        ctx.clearRect(0, 0, w, h);
        if (!values.length) return;

        const min = Math.min(...values);
        const max = Math.max(...values);
        const range = Math.max(max - min, 0.001);

        const pts = values.map((v, i) => ({
            x: (i / (values.length - 1)) * w,
            y: h - ((v - min) / range) * (h - 8) - 4
        }));

        /* gradient fill */
        ctx.beginPath();
        pts.forEach((p, i) => i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y));
        ctx.lineTo(w, h);
        ctx.lineTo(0, h);
        ctx.closePath();

        const grad = ctx.createLinearGradient(0, 0, 0, h);
        grad.addColorStop(0, palette.area);
        grad.addColorStop(1, "transparent");
        ctx.fillStyle = grad;
        ctx.fill();

        /* line */
        ctx.beginPath();
        pts.forEach((p, i) => i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y));
        ctx.strokeStyle = palette.line;
        ctx.lineWidth = 2;
        ctx.shadowBlur = 12;
        ctx.shadowColor = palette.glow;
        ctx.stroke();
        ctx.shadowBlur = 0;

        /* live dot at the end */
        const last = pts[pts.length - 1];
        ctx.beginPath();
        ctx.arc(last.x, last.y, 3, 0, Math.PI * 2);
        ctx.fillStyle = palette.line;
        ctx.shadowBlur = 8;
        ctx.shadowColor = palette.glow;
        ctx.fill();
        ctx.shadowBlur = 0;
    };

    /* ══════════════════════════════════════════════════════
       GAUGES — cyan arcs with colored zones
    ══════════════════════════════════════════════════════ */
    const drawGauge = (canvas, value, labelType) => {
        if (!canvas) return;
        resizeCanvas(canvas);
        const ctx = canvas.getContext("2d");
        const w = canvas.width, h = canvas.height;
        const cx = w / 2, cy = h * 0.82;
        const radius = Math.min(w, h) * 0.36;
        const lw = Math.max(8, w * 0.03);

        ctx.clearRect(0, 0, w, h);

        /* background arc */
        ctx.beginPath();
        ctx.arc(cx, cy, radius, Math.PI, Math.PI * 2);
        ctx.strokeStyle = C.arcBg;
        ctx.lineWidth = lw;
        ctx.stroke();

        /* value arc — color by zone */
        const norm = clamp(value / 100, 0, 1);
        let arcColor = C.cyanLine;
        let arcGlow  = C.cyanGlow;
        if (labelType === "temp") {
            if (value > 36) { arcColor = C.warnLine; arcGlow = C.warnGlow; }
            if (value > 38) { arcColor = C.dangerLine; arcGlow = C.dangerGlow; }
        } else {
            if (value > 55) { arcColor = C.warnLine; arcGlow = C.warnGlow; }
            if (value > 65) { arcColor = C.dangerLine; arcGlow = C.dangerGlow; }
        }

        ctx.beginPath();
        ctx.arc(cx, cy, radius, Math.PI, Math.PI + Math.PI * norm);
        ctx.strokeStyle = arcColor;
        ctx.lineWidth = lw;
        ctx.lineCap = "round";
        ctx.shadowBlur = 18;
        ctx.shadowColor = arcGlow;
        ctx.stroke();
        ctx.shadowBlur = 0;

        /* ticks */
        for (let i = 0; i <= 10; i++) {
            const a = Math.PI + (Math.PI * i) / 10;
            const x1 = cx + Math.cos(a) * (radius + 10);
            const y1 = cy + Math.sin(a) * (radius + 10);
            const x2 = cx + Math.cos(a) * (radius + 2);
            const y2 = cy + Math.sin(a) * (radius + 2);
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.strokeStyle = C.tick;
            ctx.lineWidth = 1;
            ctx.stroke();
        }

        /* needle */
        const na = Math.PI + Math.PI * norm;
        const nx = cx + Math.cos(na) * (radius - 8);
        const ny = cy + Math.sin(na) * (radius - 8);
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(nx, ny);
        ctx.strokeStyle = arcColor;
        ctx.lineWidth = 2;
        ctx.stroke();

        /* center dot */
        ctx.beginPath();
        ctx.arc(cx, cy, 5, 0, Math.PI * 2);
        ctx.fillStyle = arcColor;
        ctx.shadowBlur = 10;
        ctx.shadowColor = arcGlow;
        ctx.fill();
        ctx.shadowBlur = 0;

        /* inner label */
        ctx.fillStyle = arcColor;
        ctx.font = `${Math.max(12, w * 0.06)}px Orbitron, sans-serif`;
        ctx.textAlign = "center";
        ctx.fillText(`${Math.round(value)}${labelType === "temp" ? "°" : "%"}`, cx, cy - 12);
    };

    /* ══════════════════════════════════════════════════════
       MAIN DASHBOARD CANVAS — cyan network visualization
    ══════════════════════════════════════════════════════ */
    const drawDashboardCanvas = () => {
        const canvas = els.dashboardCanvas;
        if (!canvas) return;
        resizeCanvas(canvas);

        const ctx = canvas.getContext("2d");
        const w = canvas.width;
        const h = canvas.height;
        const cx = w / 2;
        const cy = h / 2;
        const base = Math.min(w, h);
        const time = state.time;

        ctx.clearRect(0, 0, w, h);

        /* dark radial background */
        const bg = ctx.createRadialGradient(cx, cy, base * 0.05, cx, cy, base * 0.74);
        bg.addColorStop(0, "rgba(0,212,255,0.055)");
        bg.addColorStop(0.42, "rgba(0,0,0,0.10)");
        bg.addColorStop(1, "rgba(0,0,0,0.32)");
        ctx.fillStyle = bg;
        ctx.fillRect(0, 0, w, h);

        /* technical grid */
        const step = Math.max(34, Math.floor(base / 9));
        ctx.lineWidth = 1;
        for (let x = 0; x < w; x += step) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, h);
            ctx.strokeStyle = x % (step * 3) === 0 ? "rgba(0,212,255,0.075)" : C.grid;
            ctx.stroke();
        }
        for (let y = 0; y < h; y += step) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(w, y);
            ctx.strokeStyle = y % (step * 3) === 0 ? "rgba(0,212,255,0.075)" : C.grid;
            ctx.stroke();
        }

        /* central axes */
        ctx.beginPath();
        ctx.moveTo(cx, 0);
        ctx.lineTo(cx, h);
        ctx.moveTo(0, cy);
        ctx.lineTo(w, cy);
        ctx.strokeStyle = "rgba(0,212,255,0.07)";
        ctx.lineWidth = 1;
        ctx.stroke();

        /* orbital zones */
        const rings = [0.18, 0.29, 0.40, 0.51];
        rings.forEach((factor, i) => {
            ctx.beginPath();
            ctx.arc(cx, cy, base * factor, 0, Math.PI * 2);
            ctx.strokeStyle = `rgba(0,212,255,${0.11 - i * 0.018})`;
            ctx.lineWidth = i === 0 ? 1.6 : 1;
            ctx.stroke();
        });

        /* compute bot positions first, scaled to fill the panel better */
        state.bots.forEach((bot, i) => {
            const a = bot.angle + time * bot.speed * 26 + Math.sin(time * 0.18 + i) * 0.025;
            const normalizedRadius = 0.18 + ((bot.radius - 70) / 80) * 0.26;
            const r = base * normalizedRadius + Math.sin(time + bot.pulse) * base * 0.018 + bot.orbitOffset * 0.35;
            bot.x = cx + Math.cos(a) * r;
            bot.y = cy + Math.sin(a) * r;
        });

        /* mesh links between nearby nodes */
        for (let i = 0; i < state.bots.length; i++) {
            for (let j = i + 1; j < state.bots.length; j++) {
                const a = state.bots[i];
                const b = state.bots[j];
                const d = Math.hypot(a.x - b.x, a.y - b.y);
                const maxD = base * 0.26;
                if (d < maxD) {
                    const strength = 1 - d / maxD;
                    ctx.beginPath();
                    ctx.moveTo(a.x, a.y);
                    ctx.lineTo(b.x, b.y);
                    ctx.strokeStyle = `rgba(0,212,255,${0.035 + strength * 0.12})`;
                    ctx.lineWidth = 0.75 + strength * 1.1;
                    ctx.stroke();
                }
            }
        }

        /* radial controller links and animated packets */
        state.bots.forEach((bot, i) => {
            const leader = i % 8 === 0;
            ctx.beginPath();
            ctx.moveTo(cx, cy);
            ctx.lineTo(bot.x, bot.y);
            ctx.strokeStyle = leader ? "rgba(0,255,136,0.16)" : "rgba(0,212,255,0.085)";
            ctx.lineWidth = leader ? 1.35 : 0.8;
            ctx.stroke();

            if (i % 3 === 0) {
                const phase = (time * (0.35 + (i % 5) * 0.05) + i * 0.13) % 1;
                const px = cx + (bot.x - cx) * phase;
                const py = cy + (bot.y - cy) * phase;
                ctx.beginPath();
                ctx.arc(px, py, leader ? 3.6 : 2.6, 0, Math.PI * 2);
                ctx.fillStyle = leader ? C.green : C.cyan;
                ctx.shadowBlur = leader ? 14 : 10;
                ctx.shadowColor = leader ? C.greenGlow : C.cyanGlow;
                ctx.fill();
                ctx.shadowBlur = 0;
            }
        });

        /* controller field */
        const pulse = (Math.sin(time * 2.4) + 1) * 0.5;
        for (let i = 0; i < 3; i++) {
            ctx.beginPath();
            ctx.arc(cx, cy, base * (0.055 + i * 0.042) + pulse * 5, 0, Math.PI * 2);
            ctx.strokeStyle = `rgba(0,212,255,${0.20 - i * 0.045})`;
            ctx.lineWidth = 1.2;
            ctx.stroke();
        }

        /* central controller */
        ctx.beginPath();
        ctx.arc(cx, cy, base * 0.018, 0, Math.PI * 2);
        ctx.fillStyle = C.cyan;
        ctx.shadowBlur = 26;
        ctx.shadowColor = C.cyanGlow;
        ctx.fill();
        ctx.shadowBlur = 0;

        ctx.beginPath();
        ctx.arc(cx, cy, base * 0.032, 0, Math.PI * 2);
        ctx.strokeStyle = "rgba(0,212,255,0.42)";
        ctx.lineWidth = 2;
        ctx.stroke();

        /* bots */
        state.bots.forEach((bot, idx) => {
            const botPulse = (Math.sin(time * 3 + bot.pulse) + 1) * 0.5;
            const leader = idx % 8 === 0;
            const nodeSize = (leader ? base * 0.012 : base * 0.0085) + botPulse * base * 0.003;
            const fill = leader ? C.green : C.cyan;
            const glow = leader ? C.greenGlow : C.cyanGlow;

            if (leader || idx % 5 === 0) {
                ctx.beginPath();
                ctx.arc(bot.x, bot.y, nodeSize + base * 0.012 + botPulse * 5, 0, Math.PI * 2);
                ctx.strokeStyle = leader ? "rgba(0,255,136,0.22)" : "rgba(0,212,255,0.16)";
                ctx.lineWidth = 1;
                ctx.stroke();
            }

            ctx.beginPath();
            ctx.arc(bot.x, bot.y, nodeSize, 0, Math.PI * 2);
            ctx.fillStyle = fill;
            ctx.shadowBlur = leader ? 18 : 12;
            ctx.shadowColor = glow;
            ctx.fill();
            ctx.shadowBlur = 0;

            if (leader) {
                ctx.fillStyle = "rgba(0,255,136,0.65)";
                ctx.font = `${Math.max(10, base * 0.017)}px JetBrains Mono, monospace`;
                ctx.textAlign = "center";
                ctx.fillText(`L${Math.floor(idx / 8) + 1}`, bot.x, bot.y - nodeSize - 8);
            }
        });

        /* corner telemetry labels */
        ctx.fillStyle = C.text;
        ctx.font = `${Math.max(11, base * 0.018)}px JetBrains Mono, monospace`;
        ctx.textAlign = "left";
        ctx.fillText("CENTRAL CONTROLLER", 18, 28);
        ctx.fillText(`ACTIVE NODES: ${state.values.botCount}`, 18, 50);
        ctx.fillText(`SIMULATED LATENCY: ${state.values.latency.toFixed(1)}ms`, 18, 72);
        ctx.fillText("MODE: PRE-HARDWARE MESH", 18, 94);

        ctx.textAlign = "right";
        ctx.fillText("PUBLIC DEMONSTRATOR", w - 18, 28);
        ctx.fillText("HARDWARE PENDING", w - 18, 50);
    };

    /* ══════════════════════════════════════════════════════
       RENDER LOOP
    ══════════════════════════════════════════════════════ */
    const render = () => {
        updateValues();

        drawMiniChart(els.chart1, state.miniCharts.botCount, CARD_COLORS.success);
        drawMiniChart(els.chart2, state.miniCharts.fps, CARD_COLORS.info);
        drawMiniChart(els.chart3, state.miniCharts.latency, CARD_COLORS.warning);
        drawMiniChart(els.chart4, state.miniCharts.energy, CARD_COLORS.energy);

        drawGauge(els.gaugeTemp, state.values.temp, "temp");
        drawGauge(els.gaugeCPU, state.values.cpu, "percent");
        drawGauge(els.gaugeNetwork, state.values.network, "percent");

        drawDashboardCanvas();

        requestAnimationFrame(render);
    };

    /* ── INIT ── */
    const init = () => {
        initBots();
        seedMiniCharts();
        render();
    };

    window.addEventListener("resize", () => {
        drawMiniChart(els.chart1, state.miniCharts.botCount, CARD_COLORS.success);
        drawMiniChart(els.chart2, state.miniCharts.fps, CARD_COLORS.info);
        drawMiniChart(els.chart3, state.miniCharts.latency, CARD_COLORS.warning);
        drawMiniChart(els.chart4, state.miniCharts.energy, CARD_COLORS.energy);
        drawGauge(els.gaugeTemp, state.values.temp, "temp");
        drawGauge(els.gaugeCPU, state.values.cpu, "percent");
        drawGauge(els.gaugeNetwork, state.values.network, "percent");
        drawDashboardCanvas();
    });

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }
})();
