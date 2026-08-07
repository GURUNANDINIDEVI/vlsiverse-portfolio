/* Dashboard View - Zero-State with GitHub-style Daily Activity Consistency Grid */

window.renderDashboard = function() {
  const container = document.getElementById("view-container");
  if (!container) return;

  const user = AppState.user;

  container.innerHTML = `
    <div class="max-w-7xl mx-auto px-6 py-8 flex flex-col gap-8">
      
      <!-- Upper Profile Header -->
      <div class="glass-panel p-6 rounded-2xl border-white/5 flex flex-col md:flex-row items-center justify-between gap-6">
        <div class="flex items-center gap-4">
          <div class="w-16 h-16 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 border border-white/10 flex items-center justify-center text-white font-heading font-extrabold text-2xl">
            VS
          </div>
          <div>
            <h2 class="text-xl font-heading font-bold text-white">${user.name}</h2>
            <p class="text-xs text-gray-500 font-mono">${user.email}</p>
            <span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-blue-950/40 text-blue-400 border border-blue-500/25 text-[10px] mt-2 font-mono">Rank: Beginner Architect</span>
          </div>
        </div>

        <!-- Reset stats indicators -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          ${renderStatBlock("XP Score", user.xp, "text-cyan-400")}
          ${renderStatBlock("Solved RTL", user.solved_count, "text-purple-400")}
          ${renderStatBlock("Daily Streak", `${user.streak}🔥`, "text-amber-400")}
          ${renderStatBlock("Certificates", user.certificates.length, "text-emerald-400")}
        </div>
      </div>

      <!-- Main Columns -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <!-- Left 2 Cols: Activity Grid & Pathways -->
        <div class="lg:col-span-2 flex flex-col gap-8">
          
          <!-- Daily Activity Consistency Grid (GitHub style) -->
          <div class="glass-panel p-6 rounded-2xl border-white/5">
            <div class="flex justify-between items-center mb-4">
              <div>
                <h3 class="text-xs font-heading font-bold text-white uppercase tracking-widest">Daily Activity Log</h3>
                <span class="text-[10px] text-gray-500">Maintained consistency over the last 15 weeks</span>
              </div>
              <div class="flex items-center gap-1.5 text-[8px] text-gray-500 font-mono">
                <span>Less</span>
                <span class="w-2.5 h-2.5 bg-slate-900 rounded-sm"></span>
                <span class="w-2.5 h-2.5 bg-blue-950 rounded-sm"></span>
                <span class="w-2.5 h-2.5 bg-blue-800 rounded-sm"></span>
                <span class="w-2.5 h-2.5 bg-blue-600 rounded-sm"></span>
                <span>More</span>
              </div>
            </div>
            
            <!-- Activity Grid boxes -->
            <div class="grid grid-flow-col grid-rows-7 gap-1 overflow-x-auto p-1 bg-slate-950/30 rounded-xl border border-white/5 h-28 pr-2">
              ${renderDailyActivityGridHTML()}
            </div>
            
            <p class="text-[10px] text-gray-500 font-mono mt-3 text-right">Current Streak: ${user.streak} days &bull; Consistency: ${Object.keys(user.activityLog).length} active days logged</p>
          </div>

          <!-- My Saved Work & Submissions -->
          <div class="glass-panel p-6 rounded-2xl border-white/5 flex flex-col gap-4">
            <div class="flex justify-between items-center border-b border-white/5 pb-3">
              <h3 class="text-xs font-heading font-bold text-white uppercase tracking-widest flex items-center gap-2">
                <i class="fa-solid fa-box-archive text-purple-400"></i> My Saved Work & Code Submissions
              </h3>
              <span class="text-[10px] text-purple-300 font-mono font-bold bg-purple-950/60 px-2 py-0.5 rounded border border-purple-500/20">
                ${Object.keys(typeof getUserSubmissions === 'function' ? getUserSubmissions() : {}).length} Saved Modules
              </span>
            </div>
            
            <div class="flex flex-col gap-3 max-h-64 overflow-y-auto pr-1">
              ${renderDashboardSubmissionsHTML()}
            </div>
          </div>

          <!-- Syllabus Pathways -->
          <div class="glass-panel p-6 rounded-2xl border-white/5">
            <h3 class="text-xs font-heading font-bold text-white mb-4 uppercase tracking-widest">Active Pathway Progress</h3>
            <div class="flex flex-col gap-4">
              ${renderDashboardProgressRow("Digital Electronics", user.progress["digital-electronics"] || 0)}
              ${renderDashboardProgressRow("Combinational Logic", user.progress["combinational-logic"] || 0)}
              ${renderDashboardProgressRow("Sequential Logic", user.progress["sequential-logic"] || 0)}
            </div>
          </div>
        </div>

        <!-- Right 1 Col: Streak Achievements & Milestones -->
        <div class="flex flex-col gap-8">
          <!-- Streak rewards calendar -->
          <div class="glass-panel p-6 rounded-2xl border-white/5">
            <h3 class="text-xs font-heading font-bold text-white mb-3 uppercase tracking-widest">Streak Achievements</h3>
            <div class="flex flex-col gap-2 text-xs text-gray-400 font-mono">
              <div class="flex items-center gap-2 p-2 bg-[#0b0f19] rounded border border-white/5">
                <span class="text-amber-500">🔥</span>
                <span>3-Day Streak: ${user.streak >= 3 ? '<span class="text-emerald-400">UNLOCKED</span>' : 'Locked'}</span>
              </div>
              <div class="flex items-center gap-2 p-2 bg-[#0b0f19] rounded border border-white/5">
                <span class="text-purple-500">⚡</span>
                <span>7-Day Streak: ${user.streak >= 7 ? '<span class="text-emerald-400">UNLOCKED</span>' : 'Locked'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Certificate Inspection Modal -->
    <div id="cert-inspect-modal" class="hidden fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div class="bg-slate-900 border-2 border-amber-500/30 max-w-lg w-full p-8 rounded-2xl relative shadow-2xl overflow-hidden">
        <button onclick="closeDashboardCert()" class="absolute top-4 right-4 text-gray-500 hover:text-white"><i class="fa-solid fa-xmark text-lg"></i></button>

        <div class="border border-amber-500/20 p-6 rounded-xl text-center flex flex-col items-center gap-5 bg-slate-950/40 relative">
          <div class="text-3xl text-amber-500"><i class="fa-solid fa-award"></i></div>
          <div>
            <span class="text-[9px] text-amber-500 uppercase tracking-widest font-heading font-bold">Verification Credential</span>
            <h2 class="text-2xl font-heading font-bold text-white mt-1.5">VLSIVerse Platform</h2>
          </div>
          <div class="h-[1px] w-1/3 bg-amber-500/25"></div>
          <p class="text-xs text-gray-400 leading-relaxed">This certifies that <strong class="text-white">${user.name}</strong> completed the verified silicon checks for:</p>
          <h3 id="cert-display-title" class="text-base font-heading font-bold text-amber-400 bg-amber-950/20 border border-amber-500/20 px-5 py-1 rounded-full">-</h3>
          <div class="flex justify-between items-center w-full mt-4 text-[8px] text-gray-500 font-mono">
            <span>Date: <strong id="cert-display-date" class="text-gray-300">-</strong></span>
            <span>Cred ID: <strong class="text-gray-300">VLV-01-OK</strong></span>
          </div>
        </div>
      </div>
    </div>
  `;
};

function renderStatBlock(label, val, color) {
  return `
    <div class="flex flex-col gap-1 p-2 bg-slate-900/60 rounded-xl border border-white/5 min-w-[70px]">
      <span class="text-[9px] text-gray-500 uppercase tracking-widest font-mono">${label}</span>
      <strong class="text-sm font-heading font-extrabold ${color}">${val}</strong>
    </div>
  `;
}

function renderDashboardProgressRow(title, val) {
  return `
    <div class="flex flex-col gap-1.5">
      <div class="flex justify-between items-center text-xs font-heading">
        <span class="text-gray-300">${title}</span>
        <span class="text-blue-400 font-bold">${val}%</span>
      </div>
      <div class="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-white/5">
        <div class="bg-blue-500 h-full rounded-full" style="width: ${val}%"></div>
      </div>
    </div>
  `;
}

function renderDailyActivityGridHTML() {
  const days = 105; // 15 weeks * 7 days
  const cells = [];
  const today = new Date();
  
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(today.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    const val = AppState.user.activityLog[dateStr] || 0;
    
    // Choose active intensity class
    let activeClass = "";
    if (val > 0) {
      if (val === 1) activeClass = "bg-blue-900/50";
      else if (val === 2) activeClass = "bg-blue-700/60";
      else activeClass = "bg-blue-500 shadow-[0_0_5px_rgba(59,130,246,0.3)]";
    } else {
      activeClass = "bg-slate-900/80 border border-white/5";
    }

    cells.push(`
      <div class="w-2.5 h-2.5 rounded-sm ${activeClass} group relative" title="${dateStr}: ${val} logs">
        <!-- Hover tooltip -->
        <span class="hidden group-hover:block absolute bottom-4 left-1/2 -translate-x-1/2 bg-slate-950 text-[7px] text-gray-300 px-1 py-0.5 rounded whitespace-nowrap border border-white/10 z-30 font-mono">${dateStr}</span>
      </div>
    `);
  }
  return cells.join("");
}

window.viewDashboardCert = function(certId) {
  const cert = AppState.user.certificates.find(c => c.id === certId);
  if (!cert) return;

  const titleEl = document.getElementById("cert-display-title");
  const dateEl = document.getElementById("cert-display-date");
  if (titleEl && dateEl) {
    titleEl.textContent = cert.title;
    dateEl.textContent = cert.date;
  }
  document.getElementById("cert-inspect-modal")?.classList.remove("hidden");
};

window.closeDashboardCert = function() {
  document.getElementById("cert-inspect-modal")?.classList.add("hidden");
};

function renderDashboardSubmissionsHTML() {
  if (typeof getUserSubmissions !== 'function') {
    return `<div class="p-4 bg-slate-950/30 border border-dashed border-white/10 rounded-xl text-center text-xs text-gray-500 italic">No code submissions stored yet. Complete practice challenges to store your RTL solutions.</div>`;
  }
  const subs = getUserSubmissions();
  const subKeys = Object.keys(subs);
  if (subKeys.length === 0) {
    return `<div class="p-4 bg-slate-950/30 border border-dashed border-white/10 rounded-xl text-center text-xs text-gray-500 italic">No code submissions stored yet. Complete practice challenges to store your RTL solutions.</div>`;
  }
  return subKeys.map(key => {
    const item = subs[key];
    return `
      <div class="p-3 bg-slate-900/80 border border-white/5 rounded-xl flex items-center justify-between gap-3">
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 rounded-lg bg-purple-950/40 border border-purple-500/20 flex items-center justify-center text-purple-400 text-xs">
            <i class="fa-solid fa-file-code"></i>
          </div>
          <div>
            <strong class="text-xs font-bold text-white block truncate max-w-[180px]">${item.challengeTitle || item.challengeId}</strong>
            <span class="text-[9px] text-gray-400 font-mono">Submitted: ${item.latestTimestamp}</span>
          </div>
        </div>
        <div class="flex items-center gap-2">
          <span class="text-[9px] font-mono font-bold ${item.isPassed ? 'text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-500/20' : 'text-amber-400 bg-amber-950/40 px-2 py-0.5 rounded border border-amber-500/20'}">
            ${item.isPassed ? '✓ Passed' : 'Pending'}
          </span>
          <button onclick="selectPracticeChallenge(${getChallengeNumberById(item.challengeId)}); navigateTo('practice');" class="px-2.5 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded text-[10px] font-bold flex items-center gap-1 shadow">
            <i class="fa-solid fa-code"></i> Recode
          </button>
        </div>
      </div>
    `;
  }).join("");
}

function getChallengeNumberById(chId) {
  if (typeof VLSIData === 'undefined' || !VLSIData.challenges) return 1;
  const idx = VLSIData.challenges.findIndex(c => c.id === chId);
  return idx >= 0 ? idx + 1 : 1;
}
