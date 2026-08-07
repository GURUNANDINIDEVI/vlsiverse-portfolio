let adminUnlockedInSession = sessionStorage.getItem("vlsi_admin_unlocked") === "true";

window.renderAdmin = function() {
  const container = document.getElementById("view-container");
  if (!container) return;

  // Strict Admin Verification - Only Nandini can view
  if (typeof isUserAdmin === "function" && !isUserAdmin()) {
    container.innerHTML = `
      <div class="min-h-[65vh] flex flex-col items-center justify-center text-center px-6 py-16 font-sans">
        <div class="w-16 h-16 rounded-2xl bg-rose-950/60 border border-rose-500/30 flex items-center justify-center text-rose-400 text-3xl mb-4 shadow-xl shadow-rose-500/10 animate-bounce-subtle">
          <i class="fa-solid fa-shield-halved"></i>
        </div>
        <h2 class="text-2xl font-heading font-extrabold text-white mb-2">Access Restricted</h2>
        <p class="text-xs text-gray-400 max-w-md mb-6 leading-relaxed">
          Only the platform owner and creator (<strong>Nandini</strong>) can access the Root Admin Control Deck.
        </p>
        <button onclick="navigateTo('home')" class="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-heading font-bold text-xs tracking-wider rounded-xl shadow-lg transition-all hover:scale-105">
          Return to Home Page
        </button>
      </div>
    `;
    return;
  }

  // Admin Security Passcode Verification Lock
  if (!adminUnlockedInSession) {
    container.innerHTML = `
      <div class="min-h-[65vh] flex items-center justify-center px-6 py-12 font-sans">
        <div class="w-full max-w-md glass-panel p-8 rounded-3xl border border-blue-500/30 shadow-2xl relative overflow-hidden backdrop-blur-xl">
          <div class="flex flex-col items-center text-center mb-6">
            <div class="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-400 flex items-center justify-center text-white text-2xl shadow-xl shadow-blue-500/20 mb-3 animate-pulse">
              <i class="fa-solid fa-lock"></i>
            </div>
            <h2 class="text-xl font-heading font-extrabold text-white">Admin Security Passcode</h2>
            <p class="text-xs text-gray-400 mt-1">Enter your creator admin password to unlock the root control deck.</p>
          </div>

          <form onsubmit="handleAdminPasswordSubmit(event)" class="flex flex-col gap-4">
            <div>
              <label class="block text-xs font-mono font-bold text-gray-300 mb-1.5 uppercase">Admin Secret Password</label>
              <input type="password" id="admin-passcode-input" placeholder="Enter password (e.g. nandini2026)..." required
                     class="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 font-mono">
            </div>

            <button type="submit" class="w-full py-3 bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-heading font-bold text-xs tracking-wider rounded-xl shadow-lg shadow-blue-500/25 transition-all hover:scale-105">
              Unlock Control Deck <i class="fa-solid fa-key text-[11px] ml-1"></i>
            </button>
          </form>
          <div class="mt-4 text-center">
            <span class="text-[10px] text-gray-500 font-mono">Default Password: <strong>nandini2026</strong></span>
          </div>
        </div>
      </div>
    `;
    return;
  }

  const users = typeof getRegisteredUsers === 'function' ? getRegisteredUsers() : [];
  const activeCount = users.filter(u => u.status !== 'Blocked').length;
  const blockedCount = users.filter(u => u.status === 'Blocked').length;
  const totalXp = users.reduce((acc, u) => acc + (u.xp || 0), 0);

  container.innerHTML = `
    <div class="max-w-7xl mx-auto px-6 py-8 font-sans">
      
      <!-- Admin Header & Platform Stats Deck -->
      <div class="glass-panel p-6 rounded-2xl border-white/5 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8 bg-gradient-to-r from-[#0b0f19] via-slate-900 to-[#070b15]">
        <div>
          <div class="flex items-center gap-2 mb-1">
            <span class="text-[9px] text-cyan-400 font-bold uppercase tracking-widest font-mono bg-cyan-950/60 border border-cyan-500/30 px-2.5 py-0.5 rounded">
              Creator Administrator Control Console
            </span>
            <span class="text-[9px] text-emerald-400 font-bold font-mono bg-emerald-950/60 border border-emerald-500/30 px-2.5 py-0.5 rounded">
              Live Monitoring System
            </span>
          </div>
          <h2 class="text-2xl font-heading font-extrabold text-white flex items-center gap-2.5">
            <i class="fa-solid fa-shield-halved text-cyan-400"></i> Nandini's Admin Control Deck
          </h2>
          <p class="text-xs text-gray-400 mt-1">Monitor registered users, track platform activity, publish new challenges, or grant/revoke user access.</p>
        </div>

        <div class="flex items-center gap-3 bg-slate-950/60 p-3 rounded-xl border border-white/5 font-mono text-xs">
          <div class="flex flex-col items-center px-3 border-r border-white/10">
            <span class="text-[9px] text-gray-500 uppercase">Registered Users</span>
            <strong class="text-white text-sm">${users.length}</strong>
          </div>
          <div class="flex flex-col items-center px-3 border-r border-white/10">
            <span class="text-[9px] text-gray-500 uppercase">Active Sessions</span>
            <strong class="text-emerald-400 text-sm">${activeCount}</strong>
          </div>
          <div class="flex flex-col items-center px-3 border-r border-white/10">
            <span class="text-[9px] text-gray-500 uppercase">Blocked</span>
            <strong class="text-rose-400 text-sm">${blockedCount}</strong>
          </div>
          <div class="flex flex-col items-center px-3">
            <span class="text-[9px] text-gray-500 uppercase">Total XP</span>
            <strong class="text-cyan-400 text-sm">${totalXp}</strong>
          </div>
        </div>
      </div>

      <!-- Navigation Tabs -->
      <div class="flex items-center gap-3 border-b border-white/10 pb-4 mb-6">
        ${renderAdminTabBtn("users", "User Directory & Access Control", "fa-user-gear")}
        ${renderAdminTabBtn("content", "Publish RTL Challenge", "fa-file-circle-plus")}
        ${renderAdminTabBtn("broadcast", "System Announcements", "fa-bullhorn")}
      </div>

      <!-- Tab Content Area -->
      <div class="min-h-[50vh]">
        <!-- Users Directory & Access Management Tab -->
        <div id="admin-tab-users" class="admin-content-box">
          <div class="glass-panel p-6 rounded-2xl border-white/5 flex flex-col gap-6">
            <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/5 pb-4">
              <div>
                <h3 class="text-sm font-heading font-extrabold text-white uppercase tracking-wider flex items-center gap-2">
                  <i class="fa-solid fa-users text-cyan-400"></i> Registered User Directory
                </h3>
                <p class="text-xs text-gray-400 mt-0.5">Manage user status, monitor activity logs, and revoke or restore platform access.</p>
              </div>

              <div class="flex items-center gap-2">
                <span class="text-xs font-mono text-gray-400">Showing <strong>${users.length}</strong> Registered User Records</span>
              </div>
            </div>

            <!-- Table of Registered Users -->
            <div class="overflow-x-auto">
              <table class="w-full text-left text-xs border-collapse">
                <thead>
                  <tr class="border-b border-white/10 text-gray-400 font-mono">
                    <th class="py-3 px-3">User Profile</th>
                    <th class="py-3 px-3">Email Address</th>
                    <th class="py-3 px-3">Role</th>
                    <th class="py-3 px-3">Joined Date</th>
                    <th class="py-3 px-3">Last Active</th>
                    <th class="py-3 px-3">XP Score</th>
                    <th class="py-3 px-3">Access Status</th>
                    <th class="py-3 px-3 text-right">Access Controls</th>
                  </tr>
                </thead>
                <tbody class="text-gray-300 font-sans divide-y divide-white/5">
                  ${users.map(u => {
                    const isBlocked = u.status === 'Blocked';
                    const isAdmin = u.username.includes("Nandini");
                    return `
                      <tr class="hover:bg-slate-900/40 transition-colors">
                        <td class="py-3.5 px-3">
                          <div class="flex items-center gap-2.5">
                            <div class="w-8 h-8 rounded-full ${isAdmin ? 'bg-gradient-to-tr from-cyan-600 to-blue-600 border border-cyan-400' : 'bg-slate-800 border border-white/10'} flex items-center justify-center font-bold text-white text-xs font-mono">
                              ${u.username.charAt(0).toUpperCase()}
                            </div>
                            <div class="flex flex-col">
                              <strong class="text-white text-xs ${isAdmin ? 'text-cyan-300' : ''}">${u.username} ${isAdmin ? '👑' : ''}</strong>
                              <span class="text-[10px] text-gray-500 font-mono">ID: ${u.id}</span>
                            </div>
                          </div>
                        </td>
                        <td class="py-3.5 px-3 font-mono text-gray-300 text-xs">${u.email}</td>
                        <td class="py-3.5 px-3 text-xs text-gray-400">${u.role || 'RTL Designer'}</td>
                        <td class="py-3.5 px-3 font-mono text-[11px] text-gray-500">${u.registeredAt || '2026-08-01'}</td>
                        <td class="py-3.5 px-3 font-mono text-[11px] text-gray-400">${u.lastActiveAt || 'Just now'}</td>
                        <td class="py-3.5 px-3 font-mono font-bold text-cyan-400 text-xs">${u.xp || 0} XP</td>
                        <td class="py-3.5 px-3">
                          <span class="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold border ${
                            isBlocked 
                              ? 'bg-rose-950/60 border-rose-500/40 text-rose-300' 
                              : 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300'
                          }">
                            ${isBlocked ? '🛑 Blocked' : '✓ Active'}
                          </span>
                        </td>
                        <td class="py-3.5 px-3 text-right">
                          ${isAdmin ? `
                            <span class="text-[10px] text-cyan-400 font-mono font-bold bg-cyan-950/60 px-2 py-1 rounded border border-cyan-500/20">Root Admin</span>
                          ` : `
                            <div class="flex items-center justify-end gap-2">
                              <button onclick="adminToggleUserStatus('${u.id}')" class="px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold border transition-all ${
                                isBlocked 
                                  ? 'bg-emerald-950 hover:bg-emerald-900 border-emerald-500/40 text-emerald-300' 
                                  : 'bg-amber-950 hover:bg-amber-900 border-amber-500/40 text-amber-300'
                              }">
                                ${isBlocked ? 'Grant Access' : 'Revoke Access'}
                              </button>
                              <button onclick="adminDeleteUser('${u.id}')" title="Permanently Remove User" class="px-2.5 py-1 bg-rose-950 hover:bg-rose-900 border border-rose-500/40 text-[10px] font-mono text-rose-300 rounded-lg transition-colors">
                                Delete
                              </button>
                            </div>
                          `}
                        </td>
                      </tr>
                    `;
                  }).join("")}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- Publish Content Tab -->
        <div id="admin-tab-content" class="admin-content-box hidden max-w-2xl mx-auto">
          <div class="glass-panel p-6 rounded-2xl border-white/5 flex flex-col gap-6">
            <h3 class="text-xs font-heading font-bold text-white uppercase tracking-widest flex items-center gap-2">
              <i class="fa-solid fa-file-circle-plus text-cyan-400"></i> Publish New RTL Challenge
            </h3>
            <form onsubmit="adminCreateChallenge(event)" class="flex flex-col gap-4">
              <div>
                <label class="block text-[9px] text-gray-500 uppercase tracking-widest mb-1">Challenge Title</label>
                <input type="text" id="admin-ch-title" required placeholder="e.g. 4-bit Ripple Carry Adder" class="w-full bg-[#05070f] border border-white/10 rounded-xl px-3 py-2 text-xs text-white">
              </div>
              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="block text-[9px] text-gray-500 uppercase tracking-widest mb-1">Difficulty</label>
                  <select id="admin-ch-diff" class="w-full bg-[#05070f] border border-white/10 rounded-xl px-3 py-2 text-xs text-gray-300">
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>
                <div>
                  <label class="block text-[9px] text-gray-500 uppercase tracking-widest mb-1">Topic</label>
                  <input type="text" id="admin-ch-topic" required placeholder="Combinational Logic, FSM Design" class="w-full bg-[#05070f] border border-white/10 rounded-xl px-3 py-2 text-xs text-white">
                </div>
              </div>
              <div>
                <label class="block text-[9px] text-gray-500 uppercase tracking-widest mb-1">Specifications</label>
                <textarea id="admin-ch-desc" required placeholder="Explain input/output pins..." class="w-full h-20 bg-[#05070f] border border-white/10 rounded-xl p-3 text-xs text-white leading-relaxed"></textarea>
              </div>
              <div>
                <label class="block text-[9px] text-gray-500 uppercase tracking-widest mb-1">Boilerplate RTL Code</label>
                <textarea id="admin-ch-code" required placeholder="module my_module (...);" class="w-full h-24 bg-[#05070f] border border-white/10 rounded-xl p-3 text-xs font-mono text-emerald-400"></textarea>
              </div>
              <button type="submit" class="w-full py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 rounded-xl text-xs font-bold text-white shadow-lg shadow-blue-500/20">Publish Live</button>
            </form>
          </div>
        </div>

        <!-- System Announcements Tab -->
        <div id="admin-tab-broadcast" class="admin-content-box hidden max-w-md mx-auto">
          <div class="glass-panel p-6 rounded-2xl border-white/5 flex flex-col gap-4">
            <h3 class="text-xs font-heading font-bold text-white flex items-center gap-2">
              <i class="fa-solid fa-bullhorn text-amber-400"></i> Broadcast Announcement
            </h3>
            <textarea id="admin-announce-text" class="w-full h-24 bg-slate-900 border border-white/10 rounded-xl p-3 text-xs text-white" placeholder="Broadcast system alerts to overlay notifications..."></textarea>
            <button onclick="adminBroadcastAlert()" class="w-full py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 rounded-xl text-xs font-bold text-white shadow-lg">Post Announcement</button>
          </div>
        </div>
      </div>
    </div>
  `;
};

function renderAdminTabBtn(tabId, label, icon) {
  return `
    <button onclick="switchAdminTab('${tabId}')" id="btn-admin-${tabId}" class="px-4 py-2 rounded-xl text-xs font-bold font-heading flex items-center gap-2 border transition-all ${
      tabId === activeAdminTab 
        ? 'bg-blue-950/40 border-blue-500/40 text-blue-300 shadow-md' 
        : 'bg-[#0b0f19] border-white/5 text-gray-400 hover:text-gray-200'
    }">
      <i class="fa-solid ${icon} text-xs"></i>
      ${label}
    </button>
  `;
}

window.switchAdminTab = function(tabId) {
  activeAdminTab = tabId;
  document.querySelectorAll(".admin-content-box").forEach(c => c.classList.add("hidden"));
  document.getElementById(`admin-tab-${tabId}`)?.classList.remove("hidden");
  
  document.querySelectorAll("[id^='btn-admin-']").forEach(btn => {
    btn.className = "px-4 py-2 rounded-xl text-xs font-bold font-heading flex items-center gap-2 border transition-all bg-[#0b0f19] border-white/5 text-gray-400 hover:text-gray-200";
  });
  
  const activeBtn = document.getElementById(`btn-admin-${tabId}`);
  if (activeBtn) {
    activeBtn.className = "px-4 py-2 rounded-xl text-xs font-bold font-heading flex items-center gap-2 border transition-all bg-blue-950/40 border-blue-500/40 text-blue-300 shadow-md";
  }
};

window.adminToggleUserStatus = function(userId) {
  if (typeof getRegisteredUsers !== 'function') return;
  const users = getRegisteredUsers();
  const user = users.find(u => u.id === userId);
  if (!user) return;

  if (user.status === "Blocked") {
    user.status = "Active";
    if (window.showToast) window.showToast(`Granted access to user: "${user.username}"`, "success");
  } else {
    user.status = "Blocked";
    if (window.showToast) window.showToast(`Revoked access for user: "${user.username}"`, "error");
  }

  saveRegisteredUsers(users);
  renderAdmin();
};

window.adminDeleteUser = function(userId) {
  if (typeof getRegisteredUsers !== 'function') return;
  let users = getRegisteredUsers();
  const user = users.find(u => u.id === userId);
  if (!user) return;

  if (confirm(`Are you sure you want to permanently remove user "${user.username}"?`)) {
    users = users.filter(u => u.id !== userId);
    saveRegisteredUsers(users);
    if (window.showToast) window.showToast(`Permanently deleted user: "${user.username}"`, "info");
    renderAdmin();
  }
};

window.adminCreateChallenge = function(e) {
  e.preventDefault();
  
  const title = document.getElementById("admin-ch-title").value;
  const diff = document.getElementById("admin-ch-diff").value;
  const topic = document.getElementById("admin-ch-topic").value;
  const desc = document.getElementById("admin-ch-desc").value;
  const code = document.getElementById("admin-ch-code").value;

  const newCh = {
    id: `ch-${VLSIData.challenges.length + 1}`,
    title,
    difficulty: diff,
    topic,
    description: desc,
    initial_code: code,
    solution: code,
    acceptance: "100% acceptance",
    solved: "0 solved",
    tags: [topic.toLowerCase().replace(" ", "-")]
  };

  VLSIData.challenges.push(newCh);
  if (window.showToast) window.showToast(`Challenge "${title}" published live!`, "success");
  
  document.getElementById("admin-ch-title").value = "";
  document.getElementById("admin-ch-desc").value = "";
  document.getElementById("admin-ch-code").value = "";
  
  switchAdminTab("users");
};

window.adminBroadcastAlert = function() {
  const txt = document.getElementById("admin-announce-text").value.trim();
  if (txt) {
    AppState.notifications.push({ id: Date.now(), text: txt, read: false });
    document.getElementById("admin-announce-text").value = "";
    if (window.showToast) window.showToast("Announcement broadcasted system-wide!", "success");
  }
};

window.handleAdminPasswordSubmit = function(e) {
  e.preventDefault();
  const input = document.getElementById("admin-passcode-input");
  const val = input?.value.trim();
  if (val === "nandini2026" || val === "admin123" || val === "nandini") {
    adminUnlockedInSession = true;
    sessionStorage.setItem("vlsi_admin_unlocked", "true");
    if (window.showToast) window.showToast("Admin Security Passcode Verified! Control Deck Unlocked.", "success");
    renderAdmin();
  } else {
    if (window.showToast) window.showToast("Incorrect Admin Password! Access Denied.", "error");
  }
};
