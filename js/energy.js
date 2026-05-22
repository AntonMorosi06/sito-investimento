(() => {
    "use strict";

    const $ = (id) => document.getElementById(id);
    const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
    const rand = (min, max) => Math.random() * (max - min) + min;

    const canvas = $("energyCanvas");
    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    const buttons = {
        all: $("energyAll"),
        coils: $("energyCoils"),
        led: $("energyLED"),
        comm: $("energyComm"),
        cpu: $("energyCPU")
    };

    const FILTERS = {
        all: "all",
        coils: "coils",
        led: "led",
        comm: "comm",
        cpu: "cpu"
    };

    const state = {
        filter: FILTERS.all,
        time: 0,
        bars: [],
        labels: ["Bot 01", "Bot 02", "Bot 03", "Bot 04", "Bot 05", "Bot 06"],
        data: []
    };

    const resizeCanvasToDisplaySize = (canvas) => {
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

    const makeBotEnergy = () => ({
        base: rand(65, 95),
        coils: rand(20, 60),
        led: rand(8, 25),
        comm: rand(10, 35),
        cpu: rand(12, 30),
        drift: rand(0, Math.PI * 2)
    });

    const initData = () => {
        state.data = [];
        for (let i = 0; i < state.labels.length; i++) {
            state.data.push(makeBotEnergy());
        }
    };

    const setActiveButton = (key) => {
        Object.entries(buttons).forEach(([name, btn]) => {
            if (!btn) return;
            btn.classList.toggle("active", name === key);
        });
    };

    const getSeriesValue = (bot, filter, t) => {
        const wave = Math.sin(t + bot.drift) * 4 + Math.sin(t * 0.6 + bot.drift * 0.5) * 2;

        switch (filter) {
            case FILTERS.coils:
                return clamp(bot.coils + wave, 0, 100);
            case FILTERS.led:
                return clamp(bot.led + wave * 0.4, 0, 100);
            case FILTERS.comm:
                return clamp(bot.comm + wave * 0.5, 0, 100);
            case FILTERS.cpu:
                return clamp(bot.cpu + wave * 0.45, 0, 100);
            case FILTERS.all:
            default:
                return clamp(bot.base + wave, 0, 100);
        }
    };

    const drawBackground = (w, h) => {
        ctx.clearRect(0, 0, w, h);

        const gradient = ctx.createLinearGradient(0, 0, 0, h);
        gradient.addColorStop(0, "rgba(255,255,255,0.025)");
        gradient.addColorStop(1, "rgba(255,255,255,0.005)");
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, w, h);

        ctx.strokeStyle = "rgba(255,255,255,0.05)";
        ctx.lineWidth = 1;

        const rows = 5;
        for (let i = 0; i <= rows; i++) {
            const y = 25 + (h - 50) * (i / rows);
            ctx.beginPath();
            ctx.moveTo(70, y);
            ctx.lineTo(w - 20, y);
            ctx.stroke();
        }
    };

    const drawBars = (w, h) => {
        const left = 90;
        const right = w - 30;
        const top = 30;
        const bottom = h - 35;
        const chartH = bottom - top;
        const count = state.data.length;
        const slot = (right - left) / count;
        const barW = slot * 0.52;

        ctx.font = `${Math.max(10, w * 0.012)}px JetBrains Mono, monospace`;
        ctx.textAlign = "right";
        ctx.fillStyle = "rgba(255,255,255,0.45)";

        for (let i = 0; i <= 5; i++) {
            const value = 100 - i * 20;
            const y = top + (chartH * i) / 5;
            ctx.fillText(`${value}%`, 62, y + 4);
        }

        ctx.textAlign = "center";

        state.data.forEach((bot, i) => {
            const value = getSeriesValue(bot, state.filter, state.time);
            const x = left + i * slot + slot / 2;
            const barH = (value / 100) * chartH;
            const y = bottom - barH;

            const fill = ctx.createLinearGradient(0, y, 0, bottom);
            fill.addColorStop(0, "rgba(255,255,255,0.95)");
            fill.addColorStop(1, "rgba(255,255,255,0.18)");

            // glow
            ctx.fillStyle = "rgba(255,255,255,0.08)";
            ctx.fillRect(x - barW / 2 - 4, y - 4, barW + 8, barH + 8);

            // bar
            ctx.fillStyle = fill;
            ctx.fillRect(x - barW / 2, y, barW, barH);

            // top line
            ctx.fillStyle = "rgba(255,255,255,0.95)";
            ctx.fillRect(x - barW / 2, y, barW, 2);

            // value
            ctx.fillStyle = "rgba(255,255,255,0.9)";
            ctx.fillText(`${Math.round(value)}%`, x, y - 10);

            // label
            ctx.fillStyle = "rgba(255,255,255,0.5)";
            ctx.fillText(state.labels[i], x, h - 10);
        });
    };

    const drawHeader = (w) => {
        const label =
            state.filter === FILTERS.all ? "TOTAL ENERGY PROFILE" :
            state.filter === FILTERS.coils ? "COILS CONSUMPTION" :
            state.filter === FILTERS.led ? "LED CONSUMPTION" :
            state.filter === FILTERS.comm ? "COMMUNICATION LOAD" :
            "CPU LOAD";

        ctx.textAlign = "left";
        ctx.fillStyle = "rgba(255,255,255,0.55)";
        ctx.font = `${Math.max(10, w * 0.012)}px JetBrains Mono, monospace`;
        ctx.fillText(label, 18, 20);
    };

    const render = () => {
        resizeCanvasToDisplaySize(canvas);
        const w = canvas.width;
        const h = canvas.height;

        state.time += 0.025;

        drawBackground(w, h);
        drawHeader(w);
        drawBars(w, h);

        requestAnimationFrame(render);
    };

    const initButtons = () => {
        if (buttons.all) {
            buttons.all.addEventListener("click", () => {
                state.filter = FILTERS.all;
                setActiveButton("all");
            });
        }

        if (buttons.coils) {
            buttons.coils.addEventListener("click", () => {
                state.filter = FILTERS.coils;
                setActiveButton("coils");
            });
        }

        if (buttons.led) {
            buttons.led.addEventListener("click", () => {
                state.filter = FILTERS.led;
                setActiveButton("led");
            });
        }

        if (buttons.comm) {
            buttons.comm.addEventListener("click", () => {
                state.filter = FILTERS.comm;
                setActiveButton("comm");
            });
        }

        if (buttons.cpu) {
            buttons.cpu.addEventListener("click", () => {
                state.filter = FILTERS.cpu;
                setActiveButton("cpu");
            });
        }
    };

    const init = () => {
        initData();
        initButtons();
        setActiveButton("all");
        render();
    };

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }
})();