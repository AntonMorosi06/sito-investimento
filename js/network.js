(() => {
    "use strict";

    // =========================================================
    // HELPERS
    // =========================================================
    const $ = (id) => document.getElementById(id);
    const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
    const rand = (min, max) => Math.random() * (max - min) + min;

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
    const canvas = $("networkCanvas");
    const packetsEl = $("netPackets");
    const rssiEl = $("netRSSI");
    const lossEl = $("netLoss");
    const retryEl = $("netRetry");

    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    // =========================================================
    // STATE
    // =========================================================
    const state = {
        time: 0,
        controller: { x: 0, y: 0 },
        nodes: [],
        packets: [],
        links: [],
        values: {
            packets: 1200,
            rssi: -42,
            loss: 0.1,
            retry: 12
        }
    };

    // =========================================================
    // INITIALIZE NODES
    // =========================================================
    const initNetwork = () => {
        state.nodes = [];
        state.links = [];
        state.packets = [];

        const count = 12;

        for (let i = 0; i < count; i++) {
            state.nodes.push({
                id: i + 1,
                angle: (Math.PI * 2 * i) / count,
                baseRadius: rand(110, 180),
                size: rand(5, 8),
                speed: rand(0.0015, 0.0045),
                phase: rand(0, Math.PI * 2),
                active: Math.random() > 0.15
            });
        }

        // some secondary bot-to-bot links
        for (let i = 0; i < count; i++) {
            if (i < count - 1) {
                state.links.push([i, i + 1]);
            }
            if (i % 3 === 0 && i + 3 < count) {
                state.links.push([i, i + 3]);
            }
        }
    };

    // =========================================================
    // PACKET PULSES
    // =========================================================
    const spawnPacket = () => {
        if (!state.nodes.length) return;

        const nodeIndex = Math.floor(Math.random() * state.nodes.length);
        const mode = Math.random() > 0.25 ? "controller-to-node" : "node-to-node";

        if (mode === "controller-to-node") {
            state.packets.push({
                type: "controller",
                fromX: state.controller.x,
                fromY: state.controller.y,
                toNode: nodeIndex,
                progress: 0,
                speed: rand(0.01, 0.028)
            });
        } else if (state.links.length) {
            const pair = state.links[Math.floor(Math.random() * state.links.length)];
            state.packets.push({
                type: "peer",
                fromNode: pair[0],
                toNode: pair[1],
                progress: 0,
                speed: rand(0.01, 0.024)
            });
        }

        if (state.packets.length > 40) {
            state.packets.shift();
        }
    };

    // =========================================================
    // LIVE VALUES
    // =========================================================
    const updateStats = () => {
        state.values.packets = Math.round(1200 + Math.sin(state.time * 0.9) * 90 + rand(-20, 20));
        state.values.rssi = Math.round(-42 + Math.sin(state.time * 0.7) * 4 + rand(-1.2, 1.2));
        state.values.loss = clamp(0.1 + Math.sin(state.time * 0.45) * 0.08 + rand(-0.03, 0.03), 0.0, 0.6);
        state.values.retry = Math.round(clamp(12 + Math.sin(state.time * 0.8) * 4 + rand(-1, 1), 4, 26));

        if (packetsEl) packetsEl.textContent = `${(state.values.packets / 1000).toFixed(1)}K`;
        if (rssiEl) rssiEl.textContent = `${state.values.rssi}`;
        if (lossEl) lossEl.textContent = `${state.values.loss.toFixed(1)}%`;
        if (retryEl) retryEl.textContent = `${state.values.retry}`;
    };

    // =========================================================
    // UPDATE GEOMETRY
    // =========================================================
    const updateNodes = (w, h) => {
        state.controller.x = w / 2;
        state.controller.y = h / 2 - h * 0.03;

        state.nodes.forEach((node, i) => {
            const a = node.angle + state.time * (0.4 + node.speed * 50);
            const radius = node.baseRadius + Math.sin(state.time * 1.4 + node.phase) * 8;

            node.x = state.controller.x + Math.cos(a) * radius * (w / 900);
            node.y = state.controller.y + Math.sin(a) * radius * (h / 450);
            node.glow = 0.55 + Math.sin(state.time * 3 + i) * 0.2;
        });

        state.packets.forEach((packet) => {
            packet.progress += packet.speed;
        });

        state.packets = state.packets.filter((packet) => packet.progress <= 1);
    };

    // =========================================================
    // DRAW
    // =========================================================
    const drawBackground = (w, h) => {
        ctx.clearRect(0, 0, w, h);

        // subtle bg
        const gradient = ctx.createLinearGradient(0, 0, w, h);
        gradient.addColorStop(0, "rgba(0,0,0,0.15)");
        gradient.addColorStop(1, "rgba(255,255,255,0.01)");
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, w, h);

        // grid
        ctx.strokeStyle = "rgba(255,255,255,0.04)";
        ctx.lineWidth = 1;

        const step = Math.max(32, Math.floor(w / 16));
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
        // controller to nodes
        state.nodes.forEach((node) => {
            ctx.beginPath();
            ctx.moveTo(state.controller.x, state.controller.y);
            ctx.lineTo(node.x, node.y);
            ctx.strokeStyle = node.active
                ? "rgba(255,255,255,0.12)"
                : "rgba(255,255,255,0.05)";
            ctx.lineWidth = 1.2;
            ctx.stroke();
        });

        // peer links
        state.links.forEach(([aIndex, bIndex]) => {
            const a = state.nodes[aIndex];
            const b = state.nodes[bIndex];
            if (!a || !b) return;

            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = "rgba(255,255,255,0.07)";
            ctx.lineWidth = 1;
            ctx.stroke();
        });
    };

    const drawController = () => {
        // outer pulse
        ctx.beginPath();
        ctx.arc(
            state.controller.x,
            state.controller.y,
            24 + Math.sin(state.time * 2.2) * 3,
            0,
            Math.PI * 2
        );
        ctx.strokeStyle = "rgba(255,255,255,0.20)";
        ctx.lineWidth = 2;
        ctx.stroke();

        // main body
        ctx.beginPath();
        ctx.arc(state.controller.x, state.controller.y, 12, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255,255,255,0.95)";
        ctx.shadowBlur = 18;
        ctx.shadowColor = "rgba(255,255,255,0.35)";
        ctx.fill();
        ctx.shadowBlur = 0;

        // center point
        ctx.beginPath();
        ctx.arc(state.controller.x, state.controller.y, 4, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(0,0,0,0.85)";
        ctx.fill();
    };

    const drawNodes = () => {
        state.nodes.forEach((node) => {
            // glow
            ctx.beginPath();
            ctx.arc(node.x, node.y, node.size + 8, 0, Math.PI * 2);
            ctx.fillStyle = node.active
                ? `rgba(144,238,144,${0.08 + node.glow * 0.06})`
                : "rgba(255,255,255,0.04)";
            ctx.fill();

            // body
            ctx.beginPath();
            ctx.arc(node.x, node.y, node.size, 0, Math.PI * 2);
            ctx.fillStyle = node.active
                ? "rgba(144,238,144,0.95)"
                : "rgba(180,180,180,0.65)";
            ctx.shadowBlur = node.active ? 14 : 0;
            ctx.shadowColor = node.active ? "rgba(144,238,144,0.30)" : "transparent";
            ctx.fill();
            ctx.shadowBlur = 0;

            // label
            ctx.fillStyle = "rgba(255,255,255,0.55)";
            ctx.font = `${Math.max(9, canvas.width * 0.012)}px JetBrains Mono, monospace`;
            ctx.textAlign = "center";
            ctx.fillText(`${node.id}`, node.x, node.y - 14);
        });
    };

    const drawPackets = () => {
        state.packets.forEach((packet) => {
            let x1, y1, x2, y2;

            if (packet.type === "controller") {
                const target = state.nodes[packet.toNode];
                if (!target) return;

                x1 = state.controller.x;
                y1 = state.controller.y;
                x2 = target.x;
                y2 = target.y;
            } else {
                const from = state.nodes[packet.fromNode];
                const to = state.nodes[packet.toNode];
                if (!from || !to) return;

                x1 = from.x;
                y1 = from.y;
                x2 = to.x;
                y2 = to.y;
            }

            const px = x1 + (x2 - x1) * packet.progress;
            const py = y1 + (y2 - y1) * packet.progress;

            ctx.beginPath();
            ctx.arc(px, py, 3.5, 0, Math.PI * 2);
            ctx.fillStyle =
                packet.type === "controller"
                    ? "rgba(255,255,255,0.95)"
                    : "rgba(135,206,235,0.95)";
            ctx.shadowBlur = 12;
            ctx.shadowColor =
                packet.type === "controller"
                    ? "rgba(255,255,255,0.35)"
                    : "rgba(135,206,235,0.35)";
            ctx.fill();
            ctx.shadowBlur = 0;
        });
    };

    const drawLabels = (w) => {
        ctx.textAlign = "left";
        ctx.fillStyle = "rgba(255,255,255,0.50)";
        ctx.font = `${Math.max(10, w * 0.012)}px JetBrains Mono, monospace`;
        ctx.fillText("CENTRAL CONTROLLER", 18, 28);
        ctx.fillText(`ACTIVE PEERS: ${state.nodes.filter((n) => n.active).length}`, 18, 48);
    };

    const draw = () => {
        resizeCanvasToDisplaySize(canvas);

        const w = canvas.width;
        const h = canvas.height;

        drawBackground(w, h);
        updateNodes(w, h);
        drawLinks();
        drawPackets();
        drawController();
        drawNodes();
        drawLabels(w);
    };

    // =========================================================
    // LOOP
    // =========================================================
    let packetSpawnAccumulator = 0;

    const animate = () => {
        state.time += 0.016;
        packetSpawnAccumulator += 0.016;

        if (packetSpawnAccumulator > 0.09) {
            spawnPacket();
            packetSpawnAccumulator = 0;
        }

        updateStats();
        draw();

        requestAnimationFrame(animate);
    };

    // =========================================================
    // INIT
    // =========================================================
    const init = () => {
        initNetwork();
        animate();
    };

    window.addEventListener("resize", () => {
        draw();
    });

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }
})();