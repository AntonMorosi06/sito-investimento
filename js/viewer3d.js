(() => {
    "use strict";

    // =========================================================
    // HELPERS
    // =========================================================
    const $ = (id) => document.getElementById(id);
    const $$ = (selector) => Array.from(document.querySelectorAll(selector));
    const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
    const lerp = (a, b, t) => a + (b - a) * t;

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
    const canvas = $("viewerCanvas");
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    const viewButtons = $$(".viewer-btn");

    // =========================================================
    // STATE
    // =========================================================
    const VIEW = {
        ASSEMBLED: 0,
        EXPLODED: 1,
        COILS: 2,
        ELECTRONICS: 3
    };

    const state = {
        view: VIEW.ASSEMBLED,
        time: 0,
        rotationY: 0,
        autoRotate: true,
        drag: false,
        dragStartX: 0,
        rotationStart: 0,
        hover: false,
        mouseX: 0,
        mouseY: 0
    };

    // =========================================================
    // SIMPLE 3D MATH
    // =========================================================
    const rotateY = (x, y, z, angle) => {
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);
        return {
            x: x * cos + z * sin,
            y,
            z: -x * sin + z * cos
        };
    };

    const rotateX = (x, y, z, angle) => {
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);
        return {
            x,
            y: y * cos - z * sin,
            z: y * sin + z * cos
        };
    };

    const project = (x, y, z, w, h, scale = 1) => {
        const distance = 700;
        const perspective = distance / (distance - z);
        return {
            x: w / 2 + x * perspective * scale,
            y: h / 2 + y * perspective * scale,
            s: perspective * scale,
            z
        };
    };

    // =========================================================
    // DRAW HELPERS
    // =========================================================
    const drawLine3D = (a, b, w, h, stroke = "rgba(255,255,255,0.18)", width = 1) => {
        const p1 = project(a.x, a.y, a.z, w, h);
        const p2 = project(b.x, b.y, b.z, w, h);

        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.strokeStyle = stroke;
        ctx.lineWidth = width;
        ctx.stroke();
    };

    const drawPoint3D = (x, y, z, w, h, radius = 5, fill = "rgba(255,255,255,0.95)", glow = true) => {
        const p = project(x, y, z, w, h);

        ctx.beginPath();
        ctx.arc(p.x, p.y, radius * p.s, 0, Math.PI * 2);

        if (glow) {
            ctx.shadowBlur = 14;
            ctx.shadowColor = "rgba(255,255,255,0.25)";
        }

        ctx.fillStyle = fill;
        ctx.fill();
        ctx.shadowBlur = 0;
    };

    const drawCubeEdges = (cx, cy, cz, sx, sy, sz, w, h, rotationYAngle, rotationXAngle, stroke, lineWidth = 1.2) => {
        const hx = sx / 2;
        const hy = sy / 2;
        const hz = sz / 2;

        const verts = [
            { x: -hx, y: -hy, z: -hz },
            { x:  hx, y: -hy, z: -hz },
            { x:  hx, y:  hy, z: -hz },
            { x: -hx, y:  hy, z: -hz },
            { x: -hx, y: -hy, z:  hz },
            { x:  hx, y: -hy, z:  hz },
            { x:  hx, y:  hy, z:  hz },
            { x: -hx, y:  hy, z:  hz }
        ];

        const transformed = verts.map((v) => {
            let p = rotateY(v.x, v.y, v.z, rotationYAngle);
            p = rotateX(p.x, p.y, p.z, rotationXAngle);
            return {
                x: p.x + cx,
                y: p.y + cy,
                z: p.z + cz
            };
        });

        const edges = [
            [0, 1], [1, 2], [2, 3], [3, 0],
            [4, 5], [5, 6], [6, 7], [7, 4],
            [0, 4], [1, 5], [2, 6], [3, 7]
        ];

        edges.forEach(([a, b]) => {
            drawLine3D(transformed[a], transformed[b], w, h, stroke, lineWidth);
        });
    };

    const drawCylinderRing = (cx, cy, cz, r, hgt, segments, w, h, rotationYAngle, rotationXAngle, stroke) => {
        const top = [];
        const bottom = [];

        for (let i = 0; i < segments; i++) {
            const a = (Math.PI * 2 * i) / segments;
            const x = Math.cos(a) * r;
            const z = Math.sin(a) * r;

            let pt = rotateY(x, -hgt / 2, z, rotationYAngle);
            pt = rotateX(pt.x, pt.y, pt.z, rotationXAngle);
            top.push({ x: pt.x + cx, y: pt.y + cy, z: pt.z + cz });

            let pb = rotateY(x, hgt / 2, z, rotationYAngle);
            pb = rotateX(pb.x, pb.y, pb.z, rotationXAngle);
            bottom.push({ x: pb.x + cx, y: pb.y + cy, z: pb.z + cz });
        }

        for (let i = 0; i < segments; i++) {
            const ni = (i + 1) % segments;
            drawLine3D(top[i], top[ni], w, h, stroke, 1);
            drawLine3D(bottom[i], bottom[ni], w, h, stroke, 1);
            drawLine3D(top[i], bottom[i], w, h, stroke, 1);
        }
    };

    // =========================================================
    // MODEL
    // =========================================================
    const drawMicroBotModel = (w, h) => {
        const rotY = state.rotationY;
        const rotX = -0.35;

        const explode =
            state.view === VIEW.EXPLODED ? 42 :
            state.view === VIEW.COILS ? 28 :
            state.view === VIEW.ELECTRONICS ? 18 :
            0;

        // subtle central axis
        drawLine3D(
            rotateX(...Object.values(rotateY(0, -120, 0, rotY)), rotX),
            rotateX(...Object.values(rotateY(0, 120, 0, rotY)), rotX),
            w,
            h,
            "rgba(255,255,255,0.07)",
            1
        );

        // shell top
        if (state.view !== VIEW.ELECTRONICS) {
            drawCubeEdges(
                0, -55 - explode, 0,
                90, 42, 90,
                w, h, rotY, rotX,
                "rgba(255,255,255,0.22)",
                1.5
            );
        }

        // shell center
        if (state.view !== VIEW.COILS) {
            drawCubeEdges(
                0, 0, 0,
                105, 60, 105,
                w, h, rotY, rotX,
                "rgba(255,255,255,0.26)",
                1.7
            );
        }

        // shell bottom
        if (state.view !== VIEW.ELECTRONICS) {
            drawCubeEdges(
                0, 55 + explode, 0,
                90, 42, 90,
                w, h, rotY, rotX,
                "rgba(255,255,255,0.22)",
                1.5
            );
        }

        // internal PCB
        if (state.view === VIEW.ASSEMBLED || state.view === VIEW.EXPLODED || state.view === VIEW.ELECTRONICS) {
            drawCubeEdges(
                0, 0, 0,
                72, 8, 72,
                w, h, rotY, rotX,
                "rgba(135,206,235,0.38)",
                1.4
            );

            // chips
            const chips = [
                { x: -18, y: 0, z: -10, sx: 14, sy: 8, sz: 14 },
                { x:  18, y: 0, z:  10, sx: 16, sy: 8, sz: 12 },
                { x:   0, y: 0, z: -22, sx: 22, sy: 8, sz: 10 }
            ];

            chips.forEach((c) => {
                drawCubeEdges(
                    c.x, c.y, c.z,
                    c.sx, c.sy, c.sz,
                    w, h, rotY, rotX,
                    "rgba(135,206,235,0.55)",
                    1.2
                );
            });
        }

        // coils
        if (state.view === VIEW.ASSEMBLED || state.view === VIEW.EXPLODED || state.view === VIEW.COILS) {
            const coilY = 22 + explode * 0.25;
            const coilStroke = "rgba(255,215,0,0.42)";

            drawCylinderRing(-26, -coilY, 0, 12, 24, 20, w, h, rotY, rotX, coilStroke);
            drawCylinderRing(26, -coilY, 0, 12, 24, 20, w, h, rotY, rotX, coilStroke);
            drawCylinderRing(-26, coilY, 0, 12, 24, 20, w, h, rotY, rotX, coilStroke);
            drawCylinderRing(26, coilY, 0, 12, 24, 20, w, h, rotY, rotX, coilStroke);
        }

        // magnets
        if (state.view === VIEW.ASSEMBLED || state.view === VIEW.EXPLODED || state.view === VIEW.COILS) {
            const magnets = [
                { x: -36, y: -18 - explode * 0.15, z: 0 },
                { x:  36, y: -18 - explode * 0.15, z: 0 },
                { x: -36, y:  18 + explode * 0.15, z: 0 },
                { x:  36, y:  18 + explode * 0.15, z: 0 }
            ];

            magnets.forEach((m, i) => {
                drawPoint3D(
                    m.x, m.y, m.z,
                    w, h,
                    5,
                    i % 2 === 0 ? "rgba(255,107,107,0.95)" : "rgba(144,238,144,0.95)",
                    true
                );
            });
        }

        // battery
        if (state.view === VIEW.ASSEMBLED || state.view === VIEW.EXPLODED || state.view === VIEW.ELECTRONICS) {
            drawCubeEdges(
                0, 32 + explode * 0.2, -18,
                34, 16, 18,
                w, h, rotY, rotX,
                "rgba(144,238,144,0.45)",
                1.3
            );
        }

        // LED
        if (state.view !== VIEW.COILS) {
            drawPoint3D(
                0, -8, 42,
                w, h,
                4.5,
                "rgba(255,255,255,0.95)",
                true
            );
        }
    };

    // =========================================================
    // BACKGROUND / UI
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

        const step = Math.max(40, Math.floor(w / 14));
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

        // soft rings
        const cx = w / 2;
        const cy = h / 2;
        for (let i = 0; i < 4; i++) {
            ctx.beginPath();
            ctx.arc(cx, cy, 70 + i * 45, 0, Math.PI * 2);
            ctx.strokeStyle = `rgba(255,255,255,${0.06 - i * 0.01})`;
            ctx.stroke();
        }
    };

    const drawOverlayText = (w, h) => {
        ctx.fillStyle = "rgba(255,255,255,0.55)";
        ctx.font = `${Math.max(10, w * 0.014)}px JetBrains Mono, monospace`;
        ctx.textAlign = "left";
        ctx.fillText("MICROBOT STRUCTURE VIEW", 18, 28);

        const modeLabel =
            state.view === VIEW.ASSEMBLED ? "ASSEMBLED" :
            state.view === VIEW.EXPLODED ? "EXPLODED" :
            state.view === VIEW.COILS ? "COILS + MAGNETS" :
            "ELECTRONICS";

        ctx.fillText(`MODE: ${modeLabel}`, 18, 48);

        ctx.textAlign = "right";
        ctx.fillText("DRAG TO ROTATE", w - 18, 28);
    };

    // =========================================================
    // DRAW
    // =========================================================
    const draw = () => {
        resizeCanvasToDisplaySize(canvas);

        const w = canvas.width;
        const h = canvas.height;

        drawBackground(w, h);
        drawMicroBotModel(w, h);
        drawOverlayText(w, h);
    };

    // =========================================================
    // CONTROLS
    // =========================================================
    const setView = (viewIndex) => {
        state.view = viewIndex;

        viewButtons.forEach((btn) => {
            btn.classList.toggle("active", Number(btn.dataset.view) === viewIndex);
        });
    };

    const initButtons = () => {
        viewButtons.forEach((btn) => {
            btn.addEventListener("click", () => {
                const index = Number(btn.dataset.view);
                setView(index);
            });
        });
    };

    // =========================================================
    // MOUSE DRAG ROTATION
    // =========================================================
    const initMouse = () => {
        canvas.addEventListener("mousedown", (e) => {
            state.drag = true;
            state.dragStartX = e.clientX;
            state.rotationStart = state.rotationY;
            state.autoRotate = false;
        });

        window.addEventListener("mouseup", () => {
            state.drag = false;
        });

        window.addEventListener("mousemove", (e) => {
            if (!state.drag) return;
            const dx = e.clientX - state.dragStartX;
            state.rotationY = state.rotationStart + dx * 0.01;
        });

        canvas.addEventListener("mouseenter", () => {
            state.hover = true;
        });

        canvas.addEventListener("mouseleave", () => {
            state.hover = false;
        });
    };

    // =========================================================
    // LOOP
    // =========================================================
    const animate = () => {
        state.time += 0.016;

        if (state.autoRotate && !state.drag) {
            state.rotationY += 0.004;
        }

        draw();
        requestAnimationFrame(animate);
    };

    // =========================================================
    // INIT
    // =========================================================
    const init = () => {
        setView(VIEW.ASSEMBLED);
        initButtons();
        initMouse();
        animate();
    };

    window.addEventListener("resize", draw);

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }
})();