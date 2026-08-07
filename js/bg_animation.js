/* VLSI Animated Background Engine - Clean Circuit Grid & Data Pulses */

(function initVlsiBackground() {
  function createBgCanvas() {
    let canvas = document.getElementById("vlsi-bg-canvas");
    if (!canvas) {
      canvas = document.createElement("canvas");
      canvas.id = "vlsi-bg-canvas";
      canvas.className = "fixed inset-0 pointer-events-none z-0 opacity-70";
      document.body.insertBefore(canvas, document.body.firstChild);
    }
    return canvas;
  }

  const canvas = createBgCanvas();
  const ctx = canvas.getContext("2d");

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener("resize", () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  // Circuit Grid Junction Nodes (Clean floating nodes without text labels)
  const nodes = [];
  const colors = ["#06b6d4", "#3b82f6", "#6366f1", "#38bdf8"];

  for (let i = 0; i < 30; i++) {
    nodes.push({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: -0.2 - Math.random() * 0.4,
      radius: 1.5 + Math.random() * 2,
      opacity: 0.15 + Math.random() * 0.35,
      color: colors[Math.floor(Math.random() * colors.length)],
      pulse: Math.random() * Math.PI * 2
    });
  }

  // Horizontal Signal Bus Lines & Data Pulses
  const busLines = [];
  const numBusses = 7;
  for (let i = 0; i < numBusses; i++) {
    busLines.push({
      y: (height / (numBusses + 1)) * (i + 1),
      pulses: [
        { x: Math.random() * width, speed: 1.5 + Math.random() * 2.0, len: 50 + Math.random() * 70 },
        { x: Math.random() * width, speed: 1.0 + Math.random() * 1.5, len: 35 + Math.random() * 50 }
      ]
    });
  }

  // Square Wave Clocks
  let clockPhase = 0;

  function drawClockWave(y, phase, opacity) {
    ctx.beginPath();
    ctx.strokeStyle = `rgba(6, 182, 212, ${opacity})`;
    ctx.lineWidth = 1.2;
    const step = 24;
    const waveH = 12;

    ctx.moveTo(0, y);
    for (let x = - (phase % (step * 2)); x < width + step * 2; x += step * 2) {
      ctx.lineTo(x + step, y);
      ctx.lineTo(x + step, y - waveH);
      ctx.lineTo(x + step * 2, y - waveH);
      ctx.lineTo(x + step * 2, y);
    }
    ctx.stroke();
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);

    // 1. Draw Square Wave Clocks in background
    clockPhase += 1.2;
    drawClockWave(height * 0.25, clockPhase, 0.08);
    drawClockWave(height * 0.72, clockPhase * 0.8, 0.06);

    // 2. Draw PCB Bus Lines & Glowing Signal Pulses
    busLines.forEach(bus => {
      ctx.beginPath();
      ctx.strokeStyle = "rgba(255, 255, 255, 0.02)";
      ctx.lineWidth = 1;
      ctx.moveTo(0, bus.y);
      ctx.lineTo(width, bus.y);
      ctx.stroke();

      bus.pulses.forEach(p => {
        p.x += p.speed;
        if (p.x > width + p.len) {
          p.x = -p.len;
        }

        const grad = ctx.createLinearGradient(p.x - p.len, bus.y, p.x, bus.y);
        grad.addColorStop(0, "rgba(6, 182, 212, 0)");
        grad.addColorStop(1, "rgba(6, 182, 212, 0.5)");

        ctx.beginPath();
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.8;
        ctx.moveTo(p.x - p.len, bus.y);
        ctx.lineTo(p.x, bus.y);
        ctx.stroke();

        // Lead dot
        ctx.beginPath();
        ctx.arc(p.x, bus.y, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = "#38bdf8";
        ctx.shadowColor = "#38bdf8";
        ctx.shadowBlur = 6;
        ctx.fill();
        ctx.shadowBlur = 0;
      });
    });

    // 3. Draw Floating Circuit Junction Micro-Dots
    nodes.forEach(node => {
      node.x += node.vx;
      node.y += node.vy;
      node.pulse += 0.02;

      if (node.y < -10) {
        node.y = height + 10;
        node.x = Math.random() * width;
      }
      if (node.x < -10) node.x = width + 10;
      if (node.x > width + 10) node.x = -10;

      const currentOpacity = node.opacity + Math.sin(node.pulse) * 0.1;
      ctx.beginPath();
      ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
      ctx.fillStyle = node.color;
      ctx.globalAlpha = Math.max(0.05, Math.min(0.5, currentOpacity));
      ctx.fill();
      ctx.globalAlpha = 1.0;
    });

    requestAnimationFrame(animate);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", animate);
  } else {
    animate();
  }
})();
