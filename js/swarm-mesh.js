(() => {
    "use strict";

    const $ = (id) => document.getElementById(id);
    const clamp = (v, min, max) => Math.max(min, Math.min(max, v));
    const lerp = (a, b, t) => a + (b - a) * t;
    const rand = (min, max) => Math.random() * (max - min) + min;

    const canvas = $("swarmMeshCanvas");
    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    const els = {
        nodes: $("swarmNodes"),
        links: $("swarmLinks"),
        mode: $("swarmMode"),
        status: $("swarmMeshStatus")
    };

    const state = {
        width: 0,
        height: 0,
        dpr: window.devicePixelRatio || 1,
        nodes: [],
        nodeCount: 24,
        maxLinks: 0,
        time: 0,
        gesture: "WAITING",
        head: "HEAD_CENTER",
        openness: 0,
        meshMode: "Idle",
        spreadTarget: 1,
        spreadCurrent: 1,
        driftXTarget: 0,
        driftYTarget: 0,
        driftX: 0,
        driftY: 0,
        pulseTarget: 1,
        pulseCurrent: 1
    };

    function resizeCanvas() {
        const rect = canvas.getBoundingClientRect();
        const dpr = window.devicePixelRatio || 1;

        canvas.width = Math.floor(rect.width * dpr);
        canvas.height = Math.floor(rect.height * dpr);
        canvas.style.width = `${rect.width}px`;
        canvas.style.height = `${rect.height}px`;

        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

        state.width = rect.width;
        state.height = rect.height;
        state.dpr = dpr;
    }

    function createNodes() {
        state.nodes = [];

        for (let i = 0; i < state.nodeCount; i++) {
            const angle = (Math.PI * 2 * i) / state.nodeCount;
            const radius = rand(40, 130);

            state.nodes.push({
                id: i,
                baseAngle: angle,
                radius,
                x: 0,
                y: 0,
                vx: rand(-0.15, 0.15),
                vy: rand(-0.15, 0.15),
                pulse: rand(0, Math.PI * 2),
                size: rand(2.5, 5),
                energy: rand(0.5, 1)
            });
        }
    }

    function updateModeFromGesture(gesture, head) {
        state.gesture = gesture || "WAITING";
        state.head = head || "HEAD_CENTER";

        if (gesture.includes("BOTH_OPEN")) {
            state.meshMode = "Expand";
            state.spreadTarget = 1.35;
            state.pulseTarget = 1.35;
        } else if (gesture.includes("BOTH_CLOSED")) {
            state.meshMode = "Aggregate";
            state.spreadTarget = 0.68;
            state.pulseTarget = 0.9;
        } else if (gesture.includes("LEFT_OPEN")) {
            state.meshMode = "Rotate Left";
            state.spreadTarget = 1.05;
            state.pulseTarget = 1.1;
        } else if (gesture.includes("RIGHT_OPEN")) {
            state.meshMode = "Rotate Right";
            state.spreadTarget = 1.05;
            state.pulseTarget = 1.1;
        } else if (gesture.includes("WAITING")) {
            state.meshMode = "Idle";
            state.spreadTarget = 1.0;
            state.pulseTarget = 1.0;
        } else {
            state.meshMode = "Tracking";
            state.spreadTarget = 1.0;
            state.pulseTarget = 1.05;
        }

        if (head === "HEAD_LEFT") {
            state.driftXTarget = -30;
        } else if (head === "HEAD_RIGHT") {
            state.driftXTarget = 30;
        } else {
            state.driftXTarget = 0;
        }

        if (head === "HEAD_UP") {
            state.driftYTarget = -22;
        } else if (head === "HEAD_DOWN") {
            state.driftYTarget = 22;
        } else {
            state.driftYTarget = 0;
        }

        if (els.mode) els.mode.textContent = state.meshMode;
        if (els.status) {
            els.status.textContent = state.gesture.includes("WAITING") ? "IDLE" : "SYNCED";
            els.status.classList.toggle("live", !state.gesture.includes("WAITING"));
        }
    }

    function updateNodes() {
        state.time += 0.016;

        state.spreadCurrent = lerp(state.spreadCurrent, state.spreadTarget, 0.05);
        state.driftX = lerp(state.driftX, state.driftXTarget, 0.06);
        state.driftY = lerp(state.driftY, state.driftYTarget, 0.06);
        state.pulseCurrent = lerp(state.pulseCurrent, state.pulseTarget, 0.05);

        const cx = state.width / 2 + state.driftX;
        const cy = state.height / 2 + state.driftY;

        state.nodes.forEach((node, i) => {
            let rotOffset = 0;

            if (state.meshMode === "Rotate Left") rotOffset = -state.time * 0.45;
            if (state.meshMode === "Rotate Right") rotOffset = state.time * 0.45;

            const angle = node.baseAngle + rotOffset + Math.sin(state.time * 0.7 + i * 0.35) * 0.08;
            const dynamicRadius =
                node.radius * state.spreadCurrent +
                Math.sin(state.time * 1.2 + node.pulse) * 10 * state.pulseCurrent;

            let tx = cx + Math.cos(angle) * dynamicRadius;
            let ty = cy + Math.sin(angle) * dynamicRadius;

            if (state.meshMode === "Tracking" || state.meshMode === "Idle") {
                tx += Math.sin(state.time * 0.9 + i) * 8;
                ty += Math.cos(state.time * 0.8 + i * 0.5) * 8;
            }

            node.x = lerp(node.x || tx, tx, 0.08);
            node.y = lerp(node.y || ty, ty, 0.08);
        });
    }

    function drawBackground() {
        ctx.clearRect(0, 0, state.width, state.height);

        const g = ctx.createLinearGradient(0, 0, state.width, state.height);
        g.addColorStop(0, "rgba(255,255,255,0.03)");
        g.addColorStop(1, "rgba(255,255,255,0.00)");
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, state.width, state.height);

        ctx.strokeStyle = "rgba(255,255,255,0.04)";
        ctx.lineWidth = 1;

        const step = Math.max(28, Math.floor(state.width / 18));
        for (let x = 0; x <= state.width; x += step) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, state.height);
            ctx.stroke();
        }

        for (let y = 0; y <= state.height; y += step) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(state.width, y);
            ctx.stroke();
        }
    }

    function drawCore() {
        const cx = state.width / 2 + state.driftX;
        const cy = state.height / 2 + state.driftY;
        const r = 14 + Math.sin(state.time * 2.2) * 2;

        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255,255,255,0.95)";
        ctx.shadowBlur = 18;
        ctx.shadowColor = "rgba(255,255,255,0.28)";
        ctx.fill();
        ctx.shadowBlur = 0;

        ctx.beginPath();
        ctx.arc(cx, cy, 40 + Math.sin(state.time * 1.8) * 3, 0, Math.PI * 2);
        ctx.strokeStyle = "rgba(255,255,255,0.12)";
        ctx.lineWidth = 1;
        ctx.stroke();
    }

    function drawLinks() {
        let linkCount = 0;

        const threshold =
            state.meshMode === "Aggregate" ? 95 :
            state.meshMode === "Expand" ? 150 :
            120;

        for (let i = 0; i < state.nodes.length; i++) {
            for (let j = i + 1; j < state.nodes.length; j++) {
                const a = state.nodes[i];
                const b = state.nodes[j];

                const dx = a.x - b.x;
                const dy = a.y - b.y;
                const d = Math.hypot(dx, dy);

                if (d < threshold) {
                    const alpha = clamp(1 - d / threshold, 0, 1) * 0.35;

                    ctx.beginPath();
                    ctx.moveTo(a.x, a.y);
                    ctx.lineTo(b.x, b.y);

                    if (state.meshMode === "Aggregate") {
                        ctx.strokeStyle = `rgba(144,238,144,${alpha})`;
                    } else if (state.meshMode === "Expand") {
                        ctx.strokeStyle = `rgba(135,206,235,${alpha})`;
                    } else {
                        ctx.strokeStyle = `rgba(255,255,255,${alpha})`;
                    }

                    ctx.lineWidth = state.meshMode === "Aggregate" ? 1.4 : 1;
                    ctx.stroke();

                    linkCount++;
                }
            }
        }

        state.maxLinks = linkCount;
        if (els.links) els.links.textContent = `${linkCount}`;
    }

    function drawNodes() {
        state.nodes.forEach((node, i) => {
            const pulse = 1 + Math.sin(state.time * 2 + node.pulse) * 0.18;
            const r = node.size * pulse * state.pulseCurrent;

            ctx.beginPath();
            ctx.arc(node.x, node.y, r, 0, Math.PI * 2);

            if (state.meshMode === "Aggregate") {
                ctx.fillStyle = "rgba(144,238,144,0.95)";
            } else if (state.meshMode === "Expand") {
                ctx.fillStyle = "rgba(135,206,235,0.95)";
            } else if (state.meshMode === "Rotate Left" || state.meshMode === "Rotate Right") {
                ctx.fillStyle = "rgba(255,215,0,0.95)";
            } else {
                ctx.fillStyle = "rgba(255,255,255,0.92)";
            }

            ctx.shadowBlur = 12;
            ctx.shadowColor = "rgba(255,255,255,0.18)";
            ctx.fill();
            ctx.shadowBlur = 0;

            if (i % 6 === 0) {
                ctx.font = '10px "JetBrains Mono", monospace';
                ctx.fillStyle = "rgba(255,255,255,0.4)";
                ctx.fillText(`MB-${String(i + 1).padStart(2, "0")}`, node.x + 8, node.y - 8);
            }
        });

        if (els.nodes) els.nodes.textContent = `${state.nodeCount}`;
    }

    function drawHud() {
        ctx.font = '12px "JetBrains Mono", monospace';
        ctx.fillStyle = "rgba(255,255,255,0.45)";
        ctx.textAlign = "left";
        ctx.fillText("COLLECTIVE INTELLIGENCE MAP", 16, 20);
    }

    function render() {
        updateNodes();
        drawBackground();
        drawCore();
        drawLinks();
        drawNodes();
        drawHud();

        requestAnimationFrame(render);
    }

    function handleGestureEvent(e) {
        const detail = e.detail || {};
        const gesture = detail.gesture || "WAITING";
        const head = detail.head || "HEAD_CENTER";

        state.openness = detail.openness || 0;
        updateModeFromGesture(gesture, head);
    }

    function init() {
        resizeCanvas();
        createNodes();
        updateModeFromGesture("WAITING", "HEAD_CENTER");
        render();

        window.addEventListener("resize", resizeCanvas);
        window.addEventListener("microbotGesture", handleGestureEvent);
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }
})();