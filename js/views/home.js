/* Home View - Aligned with screenshot elements, layout, and animations */

window.renderHome = function() {
  const container = document.getElementById("view-container");
  if (!container) return;

  const dailyData = (typeof getDailyChallenge === 'function') ? getDailyChallenge() : {
    challenge: { title: "Traffic Light Controller", topic: "FSM Design", difficulty: "Medium", description: "Design a traffic light controller FSM with states for Red, Green, and Yellow lights." },
    index: 0,
    diffBadgeClass: "bg-amber-950/40 text-amber-400 border-amber-500/20",
    pointsVal: "+25 pts"
  };
  const daily = dailyData.challenge;
  const challengeIdx = dailyData.index;
  const diffBadgeClass = dailyData.diffBadgeClass;
  const pointsVal = dailyData.pointsVal;

  container.innerHTML = `
    <!-- Hero Section -->
    <div class="relative overflow-hidden min-h-[75vh] flex items-center justify-center border-b border-white/5 py-16 px-6">
      <canvas id="pcb-canvas" class="absolute inset-0 w-full h-full pointer-events-none z-0 opacity-40"></canvas>
      
      <!-- Ambient Glows -->
      <div class="absolute top-1/4 left-1/4 w-[350px] h-[350px] rounded-full bg-blue-600/5 blur-[100px] pointer-events-none"></div>
      <div class="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-purple-600/5 blur-[110px] pointer-events-none"></div>

      <div class="relative z-10 max-w-4xl mx-auto text-center flex flex-col items-center font-sans">
        <!-- Sparkle Premium Badge -->
        <div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-blue-500/25 bg-blue-950/20 text-blue-400 text-xs font-semibold mb-6 animate-pulse">
          <i class="fa-solid fa-wand-magic-sparkles text-[11px] animate-spin-slow"></i>
          <span>The world's most comprehensive VLSI learning platform</span>
        </div>

        <!-- Headline with exact dual gradient -->
        <h1 class="text-4xl sm:text-6xl font-heading font-extrabold tracking-tight text-white mb-6 leading-tight max-w-3xl">
          Master <span class="bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent text-glow-cyan font-extrabold text-shimmer">VLSI Design</span> &amp; <span class="bg-gradient-to-r from-purple-400 via-pink-500 to-purple-400 bg-clip-text text-transparent text-glow-purple font-extrabold text-shimmer">Verification</span> Through Interactive Learning
        </h1>

        <!-- Subheadline -->
        <p class="text-gray-400 text-xs sm:text-sm max-w-2xl mb-10 leading-relaxed font-sans">
          From digital logic to tape-out. Practice RTL, explore protocols, run virtual labs, and prepare for interviews — all in one platform built for ECE students and VLSI engineers.
        </p>

        <!-- Buttons with matching icons -->
        <div class="flex flex-wrap items-center justify-center gap-4">
          <button onclick="navigateTo('learn')" class="px-7 py-3 rounded-xl font-heading font-bold text-xs tracking-wider flex items-center gap-2 premium-btn-unified">
            Start Learning <i class="fa-solid fa-arrow-right text-[10px]"></i>
          </button>
          <button onclick="navigateTo('practice')" class="px-7 py-3 rounded-xl font-heading font-bold text-xs tracking-wider flex items-center gap-2 premium-btn-unified">
            <i class="fa-solid fa-code text-[11px]"></i> Practice RTL
          </button>
          <button onclick="navigateTo('projects')" class="px-7 py-3 rounded-xl font-heading font-bold text-xs tracking-wider flex items-center gap-2 premium-btn-unified">
            <i class="fa-solid fa-folder-open text-[11px]"></i> Explore Projects
          </button>
        </div>
      </div>
    </div>

    <!-- Statistics Counters (Row of 6) -->
    <div class="max-w-7xl mx-auto px-6 py-8 border-b border-white/5">
      <div class="grid grid-cols-2 md:grid-cols-6 gap-4">
        ${renderStatCard(200, "+", "RTL Challenges", "fa-code", "text-blue-400")}
        ${renderStatCard(200, "+", "Exam Questions", "fa-layer-group", "text-cyan-400")}
        ${renderStatCard(10, "", "Bus Protocols", "fa-circle-nodes", "text-purple-400")}
        ${renderStatCard(50, "", "SoC Blueprints", "fa-folder-open", "text-emerald-400")}
        ${renderStatCard(15, "", "Pipeline Stages", "fa-diagram-project", "text-pink-400")}
        ${renderStatCard(115, "+", "Interview Preps", "fa-user-tie", "text-amber-400")}
      </div>
    </div>

    <!-- Our Mission Section -->
    <div class="max-w-4xl mx-auto px-6 py-16 flex flex-col items-center text-center">
      <div class="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-650 flex items-center justify-center text-white text-2xl shadow-lg shadow-blue-500/10 mb-6">
        <i class="fa-solid fa-bullseye"></i>
      </div>
      <h2 class="text-3xl font-heading font-extrabold text-white mb-4">Our Mission</h2>
      <p class="text-sm text-gray-400 leading-relaxed max-w-2xl font-sans">
        To empower every Electronics and Communication Engineering student, VLSI engineer, and job seeker with the tools, knowledge, and practice needed to master VLSI design and verification — from digital fundamentals to tape-out.
      </p>
    </div>

    <!-- What Makes Us Different Grid (6 Features) -->
    <div class="max-w-7xl mx-auto px-6 py-12 border-t border-white/5 font-sans">
      <div class="text-center mb-12">
        <h2 class="text-3xl font-heading font-extrabold text-white mb-2">What Makes Us Different</h2>
        <p class="text-xs text-gray-500 uppercase tracking-widest font-mono">Everything you need to master VLSI, in one place</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        ${renderFeatureCard("Practice Arena", "LeetCode-style RTL coding challenges with online editor, hints, and solutions.", "fa-code", "from-blue-650 to-cyan-500", "practice")}
        ${renderFeatureCard("Digital Practice Arena", "Interactive 200+ GATE & Semiconductor exam level questions with SVG diagrams and solutions.", "fa-layer-group", "from-purple-650 to-pink-500", "digital-practice")}
        ${renderFeatureCard("Protocol Explorer", "Deep-dive into AXI, APB, AHB, SPI, UART, I2C, PCIe, USB, and CAN.", "fa-circle-nodes", "from-cyan-500 to-blue-500", "protocols")}
        ${renderFeatureCard("VLSI Studio", "Interactive step-by-step ASIC Engineering pipeline flow explorer.", "fa-diagram-project", "from-pink-500 to-rose-500", "studio")}
        ${renderFeatureCard("Silicon Projects", "Complete system-level hardware design projects with full RTL source code.", "fa-folder-open", "from-amber-500 to-orange-500", "projects")}
        ${renderFeatureCard("Interview Prep", "Interactive 3D flashcards, MCQs, and syllabus challenge quizzes.", "fa-user-tie", "from-blue-500 to-purple-600", "interviews")}
      </div>
    </div>

    <!-- Synchronized Daily Challenge -->
    <div class="max-w-7xl mx-auto px-6 py-12 border-t border-white/5 font-sans">
      <div class="glass-panel border-blue-500/20 daily-challenge-glow p-6 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden bg-gradient-to-r from-[#0b0f19] to-transparent shadow-xl">
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 rounded-xl bg-orange-950/40 border border-orange-500/20 flex items-center justify-center text-orange-400 text-xl shadow-lg">
            <i class="fa-solid fa-fire animate-pulse"></i>
          </div>
          <div>
            <div class="flex items-center gap-2 flex-wrap mb-1">
              <span class="text-sm font-heading font-extrabold text-white">Daily Challenge</span>
              <span class="text-[9px] ${diffBadgeClass} px-2 py-0.5 rounded font-bold font-mono">${daily.difficulty}</span>
              <span class="text-[9px] bg-emerald-950/40 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded font-bold font-mono">${pointsVal}</span>
            </div>
            <p class="text-xs text-gray-300 font-sans"><strong class="text-white">${daily.topic}: ${daily.title}</strong> — ${daily.description}</p>
          </div>
        </div>
        <button onclick="navigateTo('practice'); selectPracticeChallenge(${challengeIdx + 1});" class="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-heading font-bold text-xs tracking-wider rounded-xl transition-all flex items-center gap-2 shadow-lg shadow-blue-500/20">
          Solve Challenge <i class="fa-solid fa-arrow-right text-[10px]"></i>
        </button>
      </div>
    </div>

    <!-- Sleeker, Compact & Creative Join the VLSI Revolution CTA -->
    <div class="max-w-4xl mx-auto px-6 py-8 font-sans">
      <div class="relative rounded-2xl p-6 md:p-8 overflow-hidden border border-blue-500/30 bg-gradient-to-b from-[#0b0f19] via-slate-900/90 to-[#070b15] shadow-xl backdrop-blur-xl">
        <!-- Ambient Animated Glow Orbs -->
        <div class="absolute -top-20 -left-20 w-56 h-56 rounded-full bg-cyan-500/15 blur-2xl pointer-events-none animate-pulse"></div>
        <div class="absolute -bottom-20 -right-20 w-56 h-56 rounded-full bg-purple-600/20 blur-2xl pointer-events-none animate-pulse"></div>

        <div class="relative z-10 text-center flex flex-col items-center">
          <!-- Floating Tech Badge -->
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyan-500/30 bg-cyan-950/40 text-cyan-300 text-[9px] font-mono font-bold tracking-wider uppercase mb-4 shadow-sm">
            <i class="fa-solid fa-microchip text-cyan-400 text-xs animate-spin-slow"></i>
            <span>Future-Ready Silicon Engineering Engine</span>
          </div>

          <h2 class="text-2xl sm:text-3xl font-heading font-extrabold text-white mb-2.5 tracking-tight">
            Join the <span class="bg-gradient-to-r from-blue-400 via-cyan-400 to-indigo-400 bg-clip-text text-transparent">VLSI Revolution</span>
          </h2>
          
          <p class="text-xs text-gray-300 max-w-lg mb-6 leading-relaxed font-sans">
            Master silicon design, Verilog/SystemVerilog RTL, ASIC verification, and physical synthesis on VLSIVerse — completely free &amp; browser-based.
          </p>

          <!-- Interactive Highlights Row -->
          <div class="grid grid-cols-3 gap-3 w-full max-w-md mb-6 p-2.5 bg-slate-950/60 rounded-xl border border-white/5 text-center font-mono text-[10px]">
            <div class="flex flex-col items-center">
              <strong class="text-cyan-400 text-xs">200+</strong>
              <span class="text-[8px] text-gray-500 uppercase">RTL Problems</span>
            </div>
            <div class="flex flex-col items-center border-x border-white/10 px-1">
              <strong class="text-emerald-400 text-xs">Virtual</strong>
              <span class="text-[8px] text-gray-500 uppercase">ASIC Studio</span>
            </div>
            <div class="flex flex-col items-center">
              <strong class="text-purple-400 text-xs">100% Free</strong>
              <span class="text-[8px] text-gray-500 uppercase">Silicon Practice</span>
            </div>
          </div>

          <div class="flex flex-wrap items-center justify-center gap-3">
            <button onclick="navigateTo('learn')" class="px-6 py-2.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-heading font-bold text-xs tracking-wider rounded-xl shadow-lg shadow-blue-500/25 transition-all hover:scale-105 active:scale-95 flex items-center gap-2">
              Get Started Now <i class="fa-solid fa-arrow-right text-[10px]"></i>
            </button>
            <button onclick="navigateTo('practice')" class="px-5 py-2.5 bg-slate-900/80 hover:bg-slate-800 border border-white/10 text-gray-200 hover:text-white font-heading font-bold text-xs tracking-wider rounded-xl transition-all hover:scale-105 flex items-center gap-2">
              <i class="fa-solid fa-code text-[11px] text-blue-400"></i> Explore Practice Arena
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Get in Touch -->
    <div class="max-w-xl mx-auto px-6 py-12 text-center border-t border-white/5 flex flex-col items-center font-sans">
      <h3 class="text-lg font-heading font-bold text-white mb-1">Get in Touch</h3>
      <p class="text-xs text-gray-500 mb-6 font-sans">We'd love to hear from you</p>
      
      <!-- Social icons row (Twitter removed) -->
      <div class="flex items-center justify-center gap-4">
        ${["github", "linkedin", "envelope"].map(icon => `
          <button class="w-10 h-10 rounded-full bg-[#0b0f19] border border-white/5 hover:border-blue-500/25 flex items-center justify-center text-gray-400 hover:text-white transition-all">
            <i class="${icon === 'envelope' ? 'fa-solid fa-envelope' : 'fa-brands fa-' + icon} text-sm"></i>
          </button>
        `).join("")}
      </div>

      <!-- Creator Credit Signature -->
      <div class="text-[11px] text-gray-500 font-mono mt-6">
        Created by <span class="text-blue-400 font-bold hover:text-cyan-300 transition-colors cursor-pointer">Nandini</span> &amp; VLSIVerse Core Team
      </div>
    </div>
  `;

  setTimeout(initPcbCanvas, 100);
  setTimeout(animateCounters, 100);
};

function renderStatCard(targetVal, suffix, label, icon, colorClass) {
  return `
    <div class="glass-panel p-4 rounded-xl flex items-center gap-4 relative overflow-hidden bg-[#0b0f19]/40 border-white/5">
      <div class="w-10 h-10 rounded-lg bg-blue-950/20 border border-blue-500/10 flex items-center justify-center ${colorClass}">
        <i class="fa-solid ${icon} text-sm animate-pulse"></i>
      </div>
      <div class="flex flex-col items-start text-left">
        <span class="text-base font-heading font-extrabold text-white tracking-tight stat-counter" data-target="${targetVal}" data-suffix="${suffix}">0${suffix}</span>
        <span class="text-[9px] text-gray-500 font-semibold uppercase tracking-wider font-mono leading-none mt-1">${label}</span>
      </div>
    </div>
  `;
}

function animateCounters() {
  const counters = document.querySelectorAll(".stat-counter");
  counters.forEach(counter => {
    const target = parseInt(counter.getAttribute("data-target"));
    const suffix = counter.getAttribute("data-suffix") || "";
    let count = 0;
    const duration = 1500; // 1.5 seconds animation time
    const stepTime = Math.max(Math.floor(duration / target), 15);
    
    const timer = setInterval(() => {
      count += Math.ceil(target / (duration / stepTime));
      if (count >= target) {
        counter.innerText = target + suffix;
        clearInterval(timer);
      } else {
        counter.innerText = count + suffix;
      }
    }, stepTime);
  });
}

function renderFeatureCard(title, desc, icon, gradient, viewId) {
  return `
    <div onclick="navigateTo('${viewId}')" class="glass-panel premium-card-lift p-6 rounded-2xl border-white/5 flex flex-col justify-between items-start cursor-pointer transition-all">
      <div class="flex flex-col gap-4">
        <div class="w-10 h-10 rounded-xl bg-gradient-to-tr ${gradient} flex items-center justify-center text-white text-sm shadow-md">
          <i class="fa-solid ${icon}"></i>
        </div>
        <div>
          <h4 class="text-sm font-heading font-bold text-white mb-2">${title}</h4>
          <p class="text-xs text-gray-400 leading-relaxed font-sans">${desc}</p>
        </div>
      </div>
      <span class="text-[10px] font-heading font-bold text-blue-400 mt-6 inline-flex items-center gap-1">
        Explore <i class="fa-solid fa-chevron-right text-[8px]"></i>
      </span>
    </div>
  `;
}

function initPcbCanvas() {
  const canvas = document.getElementById("pcb-canvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  
  let w = (canvas.width = canvas.offsetWidth);
  let h = (canvas.height = canvas.offsetHeight);

  let tick = 0;
  function animate() {
    if (!document.getElementById("pcb-canvas")) return;
    ctx.clearRect(0, 0, w, h);

    // Draw tech background grids
    ctx.strokeStyle = "rgba(255, 255, 255, 0.008)";
    ctx.lineWidth = 1;
    const gridSz = 50;
    for (let x = 0; x < w; x += gridSz) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke();
    }
    for (let y = 0; y < h; y += gridSz) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
    }

    // Draw chip matrices on the sides
    drawChipMatrixGrid(ctx, 60, 100, tick);
    drawChipMatrixGrid(ctx, w - 120, 80, tick + 20);

    // Glowing connection lines
    ctx.strokeStyle = "rgba(59, 130, 246, 0.12)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(110, 120);
    ctx.lineTo(250, 120);
    ctx.lineTo(250, 280);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(w - 120, 100);
    ctx.lineTo(w - 240, 100);
    ctx.lineTo(w - 240, 320);
    ctx.stroke();

    // Pulses traveling down connections
    const pos = (tick * 0.8) % 300;
    ctx.fillStyle = "#06b6d4";
    ctx.beginPath();
    if (pos < 140) {
      ctx.arc(110 + pos, 120, 2, 0, Math.PI * 2);
    } else {
      ctx.arc(250, 120 + (pos - 140), 2, 0, Math.PI * 2);
    }
    ctx.fill();

    tick++;
    requestAnimationFrame(animate);
  }

  animate();
}

function drawChipMatrixGrid(ctx, cx, cy, tick) {
  // Draw 3x3 square grid matrix block
  ctx.strokeStyle = "rgba(59, 130, 246, 0.15)";
  ctx.lineWidth = 1.2;
  ctx.strokeRect(cx, cy, 40, 40);

  ctx.fillStyle = "rgba(6, 182, 212, 0.05)";
  ctx.fillRect(cx, cy, 40, 40);

  ctx.fillStyle = "rgba(59, 130, 246, 0.25)";
  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 3; c++) {
      const px = cx + 8 + c * 12;
      const py = cy + 8 + r * 12;
      const active = (Math.sin(tick * 0.05 + r + c) > 0.4);
      ctx.fillStyle = active ? "#06b6d4" : "rgba(71, 85, 105, 0.3)";
      ctx.fillRect(px, py, 4, 4);
    }
  }
}
