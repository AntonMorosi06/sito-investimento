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
        const w = canvas.width, h = canvas.height;
        const cx = w / 2, cy = h / 2;

        ctx.clearRect(0, 0, w, h);

        /* grid */
        ctx.strokeStyle = C.grid;
        ctx.lineWidth = 1;
        const step = Math.max(30, Math.floor(w / 18));
        for (let x = 0; x < w; x += step) {
            ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke();
        }
        for (let y = 0; y < h; y += step) {
            ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
        }

        /* orbital rings */
        for (let i = 0; i < 4; i++) {
            ctx.beginPath();
            ctx.arc(cx, cy, 50 + i * 35, 0, Math.PI * 2);
            ctx.strokeStyle = `rgba(0,212,255,${0.08 - i * 0.012})`;
            ctx.lineWidth = 1;
            ctx.stroke();
        }

        /* links */
        state.bots.forEach((bot, i) => {
            const a = bot.angle + state.time * bot.speed * 20;
            const r = bot.radius + Math.sin(state.time + bot.pulse) * 8 + bot.orbitOffset * 0.15;
            bot.x = cx + Math.cos(a) * r;
            bot.y = cy + Math.sin(a) * r;

            /* radial link to center */
            ctx.beginPath();
            ctx.moveTo(cx, cy);
            ctx.lineTo(bot.x, bot.y);
            ctx.strokeStyle = C.link;
            ctx.lineWidth = 1;
            ctx.stroke();

            /* peer link */
            const next = state.bots[(i + 1) % state.bots.length];
            if (next.x !== undefined) {
                ctx.beginPath();
                ctx.moveTo(bot.x, bot.y);
                ctx.lineTo(next.x, next.y);
                ctx.strokeStyle = C.cyanFaint;
                ctx.lineWidth = 1;
                ctx.stroke();
            }
        });

        /* central controller */
        ctx.beginPath();
        ctx.arc(cx, cy, 10, 0, Math.PI * 2);
        ctx.fillStyle = C.cyan;
        ctx.shadowBlur = 24;
        ctx.shadowColor = C.cyanGlow;
        ctx.fill();
        ctx.shadowBlur = 0;

        /* controller pulse ring */
        ctx.beginPath();
        ctx.arc(cx, cy, 20 + Math.sin(state.time * 2.4) * 3, 0, Math.PI * 2);
        ctx.strokeStyle = "rgba(0,212,255,0.20)";
        ctx.lineWidth = 2;
        ctx.stroke();

        /* bots */
        state.bots.forEach((bot, idx) => {
            const pulse = (Math.sin(state.time * 3 + bot.pulse) + 1) * 0.5;
            const size = bot.size + pulse * 1.5;

            /* decide color: most are cyan, every 8th is green (leader) */
            const isLeader = idx % 8 === 0;
            const fill = isLeader ? C.green : C.cyan;
            const glow = isLeader ? C.greenGlow : C.cyanGlow;

            ctx.beginPath();
            ctx.arc(bot.x, bot.y, size, 0, Math.PI * 2);
            ctx.fillStyle = fill;
            ctx.shadowBlur = 12;
            ctx.shadowColor = glow;
            ctx.fill();
            ctx.shadowBlur = 0;

            /* halo on every 6th */
            if (idx % 6 === 0) {
                ctx.beginPath();
                ctx.arc(bot.x, bot.y, size + 5 + pulse * 3, 0, Math.PI * 2);
                ctx.strokeStyle = isLeader ? "rgba(0,255,136,0.18)" : "rgba(0,212,255,0.15)";
                ctx.lineWidth = 1;
                ctx.stroke();
            }
        });

        /* labels */
        ctx.fillStyle = C.text;
        ctx.font = `${Math.max(11, w * 0.014)}px JetBrains Mono, monospace`;
        ctx.textAlign = "left";
        ctx.fillText("CENTRAL CONTROLLER", 18, 28);
        ctx.fillText(`ACTIVE NODES: ${state.values.botCount}`, 18, 48);
        ctx.fillText(`LATENCY: ${state.values.latency.toFixed(1)}ms`, 18, 68);
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
