(() => {
    "use strict";

    const $ = (id) => document.getElementById(id);
    const clamp = (v, min, max) => Math.max(min, Math.min(max, v));
    const lerp = (a, b, t) => a + (b - a) * t;
    const TAU = Math.PI * 2;

    const dom = {
        cameraCanvas: $("sensorCameraCanvas"),
        imuCanvas: $("sensorIMUCanvas"),
        magCanvas: $("sensorMagCanvas"),
        fusionCanvas: $("sensorFusionCanvas"),
        kalmanCanvas: $("kalmanCanvas"),

        imuRoll: $("imuRoll"),
        imuPitch: $("imuPitch"),
        imuYaw: $("imuYaw"),

        magBx: $("magBx"),
        magBy: $("magBy"),
        magB: $("magB"),

        fusionX: $("fusionX"),
        fusionY: $("fusionY"),
        fusionSigma: $("fusionSigma"),

        weightCamera: $("weightCamera"),
        weightIMU: $("weightIMU"),
        weightMag: $("weightMag"),
        fusionModeLabel: $("fusionModeLabel"),
        fusionConfidenceLabel: $("fusionConfidenceLabel"),
        fusionLatencyLabel: $("fusionLatencyLabel"),
        fusionStateLabel: $("fusionStateLabel"),
        fusionStatusBadge: $("fusionStatusBadge"),
        fusionLog: $("fusionLog")
    };

    if (
        !dom.cameraCanvas ||
        !dom.imuCanvas ||
        !dom.magCanvas ||
        !dom.fusionCanvas ||
        !dom.kalmanCanvas
    ) {
        return;
    }

    const ctx = {
        camera: dom.cameraCanvas.getContext("2d"),
        imu: dom.imuCanvas.getContext("2d"),
        mag: dom.magCanvas.getContext("2d"),
        fusion: dom.fusionCanvas.getContext("2d"),
        kalman: dom.kalmanCanvas.getContext("2d")
    };

    const state = {
        time: 0,
        lastTs: performance.now(),

        target: { x: 0.5, y: 0.5 },
        measured: { x: 0.5, y: 0.5 },
        predicted: { x: 0.5, y: 0.5 },
        estimated: { x: 0.5, y: 0.5 },

        sigma: 0.045,

        imu: {
            roll: 0,
            pitch: 0,
            yaw: 0
        },

        mag: {
            bx: 0,
            by: 0,
            b: 0
        },

        history: {
            measurement: [],
            prediction: [],
            estimate: [],
            sigma: []
        },

            weights: {
            camera: 0.52,
            imu: 0.31,
            mag: 0.17
        },

        confidence: 0.92,
        latency: 12,
        fusionStateText: "STABLE",
    };

    function resizeCanvasToDisplaySize(canvas) {
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
    }

    function prepCanvas(canvas, context) {
        resizeCanvasToDisplaySize(canvas);

        const w = canvas.width;
        const h = canvas.height;

        context.clearRect(0, 0, w, h);

        const bg = context.createLinearGradient(0, 0, w, h);
        bg.addColorStop(0, "rgba(255,255,255,0.020)");
        bg.addColorStop(1, "rgba(255,255,255,0.004)");
        context.fillStyle = bg;
        context.fillRect(0, 0, w, h);

        context.strokeStyle = "rgba(255,255,255,0.05)";
        context.lineWidth = 1;

        const step = Math.max(30, Math.floor(w / 9));
        for (let x = 0; x <= w; x += step) {
            context.beginPath();
            context.moveTo(x, 0);
            context.lineTo(x, h);
            context.stroke();
        }
        for (let y = 0; y <= h; y += step) {
            context.beginPath();
            context.moveTo(0, y);
            context.lineTo(w, y);
            context.stroke();
        }

        return { w, h };
    }

    function drawLabel(context, text, x, y, alpha = 0.58, size = 12) {
        context.fillStyle = `rgba(255,255,255,${alpha})`;
        context.font = `${size}px JetBrains Mono, monospace`;
        context.fillText(text, x, y);
    }

    function pushHistory(buffer, value, max = 100) {
        buffer.push(value);
        if (buffer.length > max) buffer.shift();
    }

    function getTrackingInfluence() {
        const gestureEl = document.getElementById("trackGesture");
        const opennessEl = document.getElementById("trackOpenness");

        if (!gestureEl || !opennessEl) {
            return { active: false, openness: 0.5, gesture: "NONE" };
        }

        const gesture = gestureEl.textContent || "NONE";
        const opennessText = opennessEl.textContent || "50%";
        const openness = clamp(parseFloat(opennessText) / 100 || 0.5, 0, 1);

        return {
            active: gesture !== "--" && gesture !== "WAITING",
            openness,
            gesture
        };
    }

    function updateModel(dt) {
        state.time += dt;

        const tracking = getTrackingInfluence();
        const influence = tracking.active ? tracking.openness : 0.5;

        const tx = 0.5 + Math.sin(state.time * 0.65) * (0.16 + influence * 0.10);
        const ty = 0.5 + Math.cos(state.time * 0.92) * (0.12 + influence * 0.07);

        state.target.x = clamp(tx, 0.1, 0.9);
        state.target.y = clamp(ty, 0.1, 0.9);

        const measurementNoiseX = Math.sin(state.time * 4.3) * 0.018;
        const measurementNoiseY = Math.cos(state.time * 3.7) * 0.016;

        state.measured.x = clamp(state.target.x + measurementNoiseX, 0, 1);
        state.measured.y = clamp(state.target.y + measurementNoiseY, 0, 1);

        state.predicted.x = clamp(
            state.estimated.x + Math.sin(state.time * 2.0) * 0.010,
            0,
            1
        );
        state.predicted.y = clamp(
            state.estimated.y + Math.cos(state.time * 1.8) * 0.010,
            0,
            1
        );

        const follow = tracking.active ? 0.12 : 0.08;
        state.estimated.x = lerp(state.estimated.x, state.measured.x, follow);
        state.estimated.y = lerp(state.estimated.y, state.measured.y, follow);

        state.sigma = 0.025 + ((Math.sin(state.time * 0.9) + 1) * 0.5) * 0.03;

        state.imu.roll = Math.sin(state.time * 0.95) * 35;
        state.imu.pitch = Math.cos(state.time * 0.70) * 24;
        state.imu.yaw = (state.time * 32) % 360;

        state.mag.bx = Math.sin(state.time * 1.25) * 2.7;
        state.mag.by = Math.cos(state.time * 0.90) * 2.2;
        state.mag.b = Math.sqrt(state.mag.bx * state.mag.bx + state.mag.by * state.mag.by);

        pushHistory(state.history.measurement, state.measured.x, 90);
        pushHistory(state.history.prediction, state.predicted.x, 90);
        pushHistory(state.history.estimate, state.estimated.x, 90);
        pushHistory(state.history.sigma, state.sigma, 90);

        state.weights.camera = 0.46 + ((Math.sin(state.time * 0.9) + 1) * 0.5) * 0.18;
        state.weights.imu = 0.22 + ((Math.cos(state.time * 1.1) + 1) * 0.5) * 0.16;
        state.weights.mag = Math.max(0.08, 1 - state.weights.camera - state.weights.imu);

        const totalWeight = state.weights.camera + state.weights.imu + state.weights.mag;
        state.weights.camera /= totalWeight;
        state.weights.imu /= totalWeight;
        state.weights.mag /= totalWeight;

        state.confidence = clamp(0.82 + Math.sin(state.time * 0.8) * 0.10, 0.68, 0.98);
        state.latency = 9 + Math.round(((Math.sin(state.time * 1.3) + 1) * 0.5) * 7);

        if (state.confidence > 0.9) {
            state.fusionStateText = "STABLE";
        } else if (state.confidence > 0.8) {
            state.fusionStateText = "TRACKING";
        } else {
            state.fusionStateText = "RECOVERING";
        }

        if (dom.imuRoll) dom.imuRoll.textContent = `${state.imu.roll.toFixed(1)}°`;
        if (dom.imuPitch) dom.imuPitch.textContent = `${state.imu.pitch.toFixed(1)}°`;
        if (dom.imuYaw) dom.imuYaw.textContent = `${state.imu.yaw.toFixed(1)}°`;

        if (dom.magBx) dom.magBx.textContent = `${state.mag.bx.toFixed(1)} mT`;
        if (dom.magBy) dom.magBy.textContent = `${state.mag.by.toFixed(1)} mT`;
        if (dom.magB) dom.magB.textContent = `${state.mag.b.toFixed(1)} mT`;

        if (dom.fusionX) dom.fusionX.textContent = state.estimated.x.toFixed(2);
        if (dom.fusionY) dom.fusionY.textContent = state.estimated.y.toFixed(2);
        if (dom.fusionSigma) dom.fusionSigma.textContent = `${state.sigma.toFixed(2)}mm`;

        if (dom.weightCamera) dom.weightCamera.textContent = state.weights.camera.toFixed(2);
        if (dom.weightIMU) dom.weightIMU.textContent = state.weights.imu.toFixed(2);
        if (dom.weightMag) dom.weightMag.textContent = state.weights.mag.toFixed(2);

        if (dom.fusionModeLabel) dom.fusionModeLabel.textContent = "MODE: ADAPTIVE";
        if (dom.fusionConfidenceLabel) dom.fusionConfidenceLabel.textContent = `CONFIDENCE: ${state.confidence.toFixed(2)}`;
        if (dom.fusionLatencyLabel) dom.fusionLatencyLabel.textContent = `${state.latency} ms`;
        if (dom.fusionStateLabel) dom.fusionStateLabel.textContent = state.fusionStateText;
        if (dom.fusionStatusBadge) dom.fusionStatusBadge.textContent = state.confidence > 0.9 ? "OPTIMAL" : "DYNAMIC";
    }

    function drawCrosshair(context, x, y, size = 24, color = "rgba(255,255,255,0.82)") {
        context.strokeStyle = color;
        context.lineWidth = 1.5;

        context.beginPath();
        context.moveTo(x - size, y);
        context.lineTo(x + size, y);
        context.moveTo(x, y - size);
        context.lineTo(x, y + size);
        context.stroke();

        context.beginPath();
        context.arc(x, y, size * 0.6, 0, TAU);
        context.stroke();
    }

    function drawCameraPanel() {
        const { w, h } = prepCanvas(dom.cameraCanvas, ctx.camera);

        const px = state.measured.x * w;
        const py = state.measured.y * h;

        drawLabel(ctx.camera, "CAMERA LOCK", 18, 22, 0.55, Math.max(10, w * 0.012));
        drawCrosshair(ctx.camera, px, py, Math.min(w, h) * 0.10);

        ctx.camera.beginPath();
        ctx.camera.arc(px, py, 6, 0, TAU);
        ctx.camera.fillStyle = "rgba(255,255,255,0.95)";
        ctx.camera.fill();

        ctx.camera.beginPath();
        ctx.camera.arc(px, py, 24, 0, TAU);
        ctx.camera.strokeStyle = "rgba(255,255,255,0.16)";
        ctx.camera.lineWidth = 5;
        ctx.camera.stroke();

        const trailCount = 5;
        for (let i = 0; i < trailCount; i++) {
            const t = i / trailCount;
            const tx = lerp(px, state.estimated.x * w, t);
            const ty = lerp(py, state.estimated.y * h, t);
            ctx.camera.beginPath();
            ctx.camera.arc(tx, ty, 2.5 + (1 - t) * 2, 0, TAU);
            ctx.camera.fillStyle = `rgba(255,255,255,${0.12 + (1 - t) * 0.2})`;
            ctx.camera.fill();
        }
    }

    function drawIMUPanel() {
        const { w, h } = prepCanvas(dom.imuCanvas, ctx.imu);

        const cx = w / 2;
        const cy = h / 2;
        const size = Math.min(w, h) * 0.20;

        drawLabel(ctx.imu, "IMU ORIENTATION", 18, 22, 0.55, Math.max(10, w * 0.012));

        ctx.imu.save();
        ctx.imu.translate(cx, cy);
        ctx.imu.rotate((state.imu.roll * Math.PI) / 180);

        ctx.imu.strokeStyle = "rgba(255,255,255,0.82)";
        ctx.imu.lineWidth = 2;
        ctx.imu.strokeRect(-size, -size, size * 2, size * 2);

        ctx.imu.beginPath();
        ctx.imu.moveTo(0, 0);
        ctx.imu.lineTo(size * 1.2, 0);
        ctx.imu.stroke();

        ctx.imu.beginPath();
        ctx.imu.arc(0, 0, 6, 0, TAU);
        ctx.imu.fillStyle = "rgba(255,255,255,0.95)";
        ctx.imu.fill();

        ctx.imu.restore();

        drawLabel(ctx.imu, `ROLL  ${state.imu.roll.toFixed(1)}°`, 18, h - 54, 0.58);
        drawLabel(ctx.imu, `PITCH ${state.imu.pitch.toFixed(1)}°`, 18, h - 34, 0.58);
        drawLabel(ctx.imu, `YAW   ${state.imu.yaw.toFixed(1)}°`, 18, h - 14, 0.58);
    }

    function drawMagPanel() {
        const { w, h } = prepCanvas(dom.magCanvas, ctx.mag);

        const cx = w / 2;
        const cy = h / 2;
        const scale = Math.min(w, h) * 0.13;

        drawLabel(ctx.mag, "MAGNETIC FIELD", 18, 22, 0.55, Math.max(10, w * 0.012));

        ctx.mag.beginPath();
        ctx.mag.arc(cx, cy, 6, 0, TAU);
        ctx.mag.fillStyle = "rgba(255,255,255,0.95)";
        ctx.mag.fill();

        const ex = cx + state.mag.bx * scale;
        const ey = cy - state.mag.by * scale;

        ctx.mag.beginPath();
        ctx.mag.moveTo(cx, cy);
        ctx.mag.lineTo(ex, ey);
        ctx.mag.strokeStyle = "rgba(255,255,255,0.85)";
        ctx.mag.lineWidth = 2.5;
        ctx.mag.stroke();

        ctx.mag.beginPath();
        ctx.mag.arc(ex, ey, 6, 0, TAU);
        ctx.mag.fillStyle = "rgba(255,255,255,0.95)";
        ctx.mag.fill();

        for (let i = 1; i <= 3; i++) {
            ctx.mag.beginPath();
            ctx.mag.arc(cx, cy, i * 28, 0, TAU);
            ctx.mag.strokeStyle = "rgba(255,255,255,0.06)";
            ctx.mag.lineWidth = 1;
            ctx.mag.stroke();
        }

        drawLabel(ctx.mag, `Bx ${state.mag.bx.toFixed(2)} mT`, 18, h - 54, 0.58);
        drawLabel(ctx.mag, `By ${state.mag.by.toFixed(2)} mT`, 18, h - 34, 0.58);
        drawLabel(ctx.mag, `|B| ${state.mag.b.toFixed(2)} mT`, 18, h - 14, 0.58);
    }

    function drawFusionPanel() {
        const { w, h } = prepCanvas(dom.fusionCanvas, ctx.fusion);

        drawLabel(ctx.fusion, "FUSION OUTPUT", 18, 22, 0.55, Math.max(10, w * 0.012));

        const mx = state.measured.x * w;
        const my = state.measured.y * h;
        const px = state.predicted.x * w;
        const py = state.predicted.y * h;
        const ex = state.estimated.x * w;
        const ey = state.estimated.y * h;

        ctx.fusion.beginPath();
        ctx.fusion.moveTo(mx, my);
        ctx.fusion.lineTo(px, py);
        ctx.fusion.lineTo(ex, ey);
        ctx.fusion.strokeStyle = "rgba(255,255,255,0.18)";
        ctx.fusion.lineWidth = 1.4;
        ctx.fusion.stroke();

        ctx.fusion.beginPath();
        ctx.fusion.arc(mx, my, 6, 0, TAU);
        ctx.fusion.fillStyle = "rgba(255,107,107,0.95)";
        ctx.fusion.fill();

        ctx.fusion.beginPath();
        ctx.fusion.arc(px, py, 6, 0, TAU);
        ctx.fusion.fillStyle = "rgba(255,215,0,0.95)";
        ctx.fusion.fill();

        ctx.fusion.beginPath();
        ctx.fusion.arc(ex, ey, 6, 0, TAU);
        ctx.fusion.fillStyle = "rgba(135,206,235,0.95)";
        ctx.fusion.fill();

        ctx.fusion.beginPath();
        ctx.fusion.arc(ex, ey, state.sigma * Math.min(w, h) * 2.2, 0, TAU);
        ctx.fusion.strokeStyle = "rgba(255,255,255,0.45)";
        ctx.fusion.lineWidth = 1.5;
        ctx.fusion.stroke();

        drawLabel(ctx.fusion, "M", mx + 10, my - 10, 0.7);
        drawLabel(ctx.fusion, "P", px + 10, py - 10, 0.7);
        drawLabel(ctx.fusion, "E", ex + 10, ey - 10, 0.7);
    }

    function drawSeries(context, series, bounds, color, width = 2) {
        if (series.length < 2) return;

        const { left, right, top, bottom } = bounds;
        const plotW = right - left;
        const plotH = bottom - top;

        context.beginPath();
        series.forEach((v, i) => {
            const x = left + (i / (series.length - 1)) * plotW;
            const y = bottom - v * plotH;
            if (i === 0) context.moveTo(x, y);
            else context.lineTo(x, y);
        });
        context.strokeStyle = color;
        context.lineWidth = width;
        context.stroke();
    }

    function drawKalmanPanel() {
        const { w, h } = prepCanvas(dom.kalmanCanvas, ctx.kalman);

        const bounds = {
            left: 28,
            right: w - 22,
            top: 24,
            bottom: h - 24
        };

        drawLabel(ctx.kalman, "KALMAN STATE", 18, 18, 0.55, Math.max(10, w * 0.012));

        ctx.kalman.strokeStyle = "rgba(255,255,255,0.08)";
        ctx.kalman.lineWidth = 1;

        for (let i = 0; i <= 4; i++) {
            const y = bounds.top + ((bounds.bottom - bounds.top) * i) / 4;
            ctx.kalman.beginPath();
            ctx.kalman.moveTo(bounds.left, y);
            ctx.kalman.lineTo(bounds.right, y);
            ctx.kalman.stroke();
        }

        drawSeries(ctx.kalman, state.history.measurement, bounds, "rgba(255,107,107,0.95)");
        drawSeries(ctx.kalman, state.history.prediction, bounds, "rgba(255,215,0,0.95)");
        drawSeries(ctx.kalman, state.history.estimate, bounds, "rgba(135,206,235,0.95)");

        if (state.history.estimate.length) {
            const last = state.history.estimate[state.history.estimate.length - 1];
            const x = bounds.right;
            const y = bounds.bottom - last * (bounds.bottom - bounds.top);
            ctx.kalman.beginPath();
            ctx.kalman.arc(x, y, 4.5, 0, TAU);
            ctx.kalman.fillStyle = "rgba(135,206,235,0.95)";
            ctx.kalman.fill();
        }
    }

    function render() {
        drawCameraPanel();
        drawIMUPanel();
        drawMagPanel();
        drawFusionPanel();
        drawKalmanPanel();
    }

    function frame(now) {
        const dt = clamp((now - state.lastTs) / 1000, 0.008, 0.05);
        state.lastTs = now;

        updateModel(dt);
        render();

        requestAnimationFrame(frame);
    }

    function init() {
        render();

        let resizeRaf = null;
        window.addEventListener("resize", () => {
            if (resizeRaf) cancelAnimationFrame(resizeRaf);
            resizeRaf = requestAnimationFrame(() => {
                render();
            });
        });

        requestAnimationFrame(frame);
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }
})();