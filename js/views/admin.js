/* Admin View - Real Database User Analytics & Platform Control Deck */

let activeAdminTab = "analytics";
let adminSearchQuery = "";
let adminFilterRole = "All";
let adminSortOption = "newest";
let adminAnalyticsData = null;
let adminUsersList = [];

window.isUserAdmin = function() {
  return Boolean(AppState.user && (AppState.user.role === "admin" || AppState.user.role === "Administrator"));
};

window.renderAdmin = async function() {
  const container = document.getElementById("view-container");
  if (!container) return;

  // Strict Database Role Verification (AppState.user.role === 'admin')
  if (!window.isUserAdmin()) {
    container.innerHTML = `
      <div class="min-h-[65vh] flex flex-col items-center justify-center text-center px-6 py-16 font-sans">
        <div class="w-16 h-16 rounded-2xl bg-rose-950/60 border border-rose-500/30 flex items-center justify-center text-rose-400 text-3xl mb-4 shadow-xl shadow-rose-500/10">
          <i class="fa-solid fa-shield-halved"></i>
        </div>
        <h2 class="text-2xl font-heading font-extrabold text-white mb-2">Access Denied</h2>
        <p class="text-xs text-gray-400 max-w-md mb-6 leading-relaxed">
          Administrator privileges (<code>role: "admin"</code>) are required to access the Platform User Analytics Console.
        </p>
        <button onclick="navigateTo('home')" class="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-heading font-bold text-xs tracking-wider rounded-xl shadow-lg transition-all hover:scale-105" aria-label="Return home">
          Return to Home Page
        </button>
      </div>
    `;
    return;
  }

  // Load live database analytics & user list
  try {
    if (!adminAnalyticsData) {
      adminAnalyticsData = await window.VLSISupabase.fetchAdminAnalytics();
    }
    adminUsersList = await window.VLSISupabase.fetchRegisteredUsers({
      search: adminSearchQuery,
      filter: adminFilterRole,
      sort: adminSortOption
    });
  } catch(err) {
    console.error("[VLSIVerse Admin Data Fetch Error]:", err);
  }

  const stats = adminAnalyticsData || {
    totalUsers: 0,
    newToday: 0,
    newThisWeek: 0,
    newThisMonth: 0,
    totalLogins: 0,
    uniqueLoggedInUsers: 0,
    activeToday: 0,
    activeThisWeek: 0,
    chartLabels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    chartCounts: [0, 0, 0, 0, 0, 0, 0]
  };

  container.innerHTML = `
    <div class="max-w-7xl mx-auto px-6 py-8 font-sans">
      
      <!-- Admin Header & Platform Control Deck -->
      <div class="glass-panel p-6 rounded-2xl border-white/5 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8 bg-gradient-to-r from-[#0b0f19] via-slate-900 to-[#070b15]">
        <div>
          <div class="flex items-center gap-2 mb-1">
            <span class="text-[9px] text-cyan-400 font-bold uppercase tracking-widest font-mono bg-cyan-950/60 border border-cyan-500/30 px-2.5 py-0.5 rounded">
              Supabase PostgreSQL Database Connected
            </span>
            <span class="text-[9px] text-emerald-400 font-bold font-mono bg-emerald-950/60 border border-emerald-500/30 px-2.5 py-0.5 rounded">
              Real User Analytics &bull; Multi-Device Tracking
            </span>
          </div>
          <h2 class="text-2xl font-heading font-extrabold text-white flex items-center gap-2.5">
            <i class="fa-solid fa-chart-pie text-cyan-400"></i> Platform User Analytics & Console
          </h2>
          <p class="text-xs text-gray-400 mt-1">Track registered users, active login occurrences, daily registrations, and user access control.</p>
        </div>

        <div class="flex items-center gap-3">
          <button onclick="refreshAdminAnalytics()" class="px-4 py-2.5 bg-slate-900 border border-white/10 hover:border-white/20 text-xs font-bold font-heading text-gray-300 rounded-xl flex items-center gap-2 transition-all hover:bg-slate-800" aria-label="Refresh user statistics">
            <i class="fa-solid fa-rotate-right text-xs"></i> Refresh Analytics
          </button>
        </div>
      </div>

      <!-- Navigation Tabs -->
      <div class="flex items-center gap-3 border-b border-white/10 pb-4 mb-6">
        ${renderAdminTabBtn("analytics", "User Analytics", "fa-chart-line")}
        ${renderAdminTabBtn("users", "Registered Users", "fa-users")}
        ${renderAdminTabBtn("content", "Publish Challenge", "fa-file-circle-plus")}
        ${renderAdminTabBtn("broadcast", "Announcements", "fa-bullhorn")}
      </div>

      <!-- Tab Content Area -->
      <div class="min-h-[50vh]">
        
        <!-- Tab 1: User Analytics -->
        <div id="admin-tab-analytics" class="admin-content-box ${activeAdminTab === 'analytics' ? '' : 'hidden'}">
          
          <!-- Stat Cards Grid -->
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div class="glass-panel p-5 rounded-2xl border-white/5 relative overflow-hidden">
              <span class="text-[9px] font-mono font-bold text-gray-500 uppercase tracking-widest">Total Registered Users</span>
              <div class="text-3xl font-heading font-extrabold text-white mt-1">${stats.totalUsers}</div>
              <p class="text-[10px] text-gray-400 mt-1 flex items-center gap-1">
                <span class="text-emerald-400 font-bold">+${stats.newThisMonth}</span> this month
              </p>
              <i class="fa-solid fa-users absolute right-4 bottom-4 text-white/5 text-4xl"></i>
            </div>

            <div class="glass-panel p-5 rounded-2xl border-white/5 relative overflow-hidden">
              <span class="text-[9px] font-mono font-bold text-gray-500 uppercase tracking-widest">New Users Today</span>
              <div class="text-3xl font-heading font-extrabold text-emerald-400 mt-1">${stats.newToday}</div>
              <p class="text-[10px] text-gray-400 mt-1 flex items-center gap-1">
                <span class="text-cyan-400 font-bold">${stats.newThisWeek}</span> registered this week
              </p>
              <i class="fa-solid fa-user-plus absolute right-4 bottom-4 text-emerald-500/10 text-4xl"></i>
            </div>

            <div class="glass-panel p-5 rounded-2xl border-white/5 relative overflow-hidden">
              <span class="text-[9px] font-mono font-bold text-gray-500 uppercase tracking-widest">Active Users Today</span>
              <div class="text-3xl font-heading font-extrabold text-cyan-400 mt-1">${stats.activeToday}</div>
              <p class="text-[10px] text-gray-400 mt-1 flex items-center gap-1">
                <span class="text-blue-400 font-bold">${stats.activeThisWeek}</span> active this week
              </p>
              <i class="fa-solid fa-bolt absolute right-4 bottom-4 text-cyan-500/10 text-4xl"></i>
            </div>

            <div class="glass-panel p-5 rounded-2xl border-white/5 relative overflow-hidden">
              <span class="text-[9px] font-mono font-bold text-gray-500 uppercase tracking-widest">Total Login Events</span>
              <div class="text-3xl font-heading font-extrabold text-blue-400 mt-1">${stats.totalLogins}</div>
              <p class="text-[10px] text-gray-400 mt-1 flex items-center gap-1">
                <span class="text-purple-400 font-bold">${stats.uniqueLoggedInUsers}</span> unique logged-in users
              </p>
              <i class="fa-solid fa-right-to-bracket absolute right-4 bottom-4 text-blue-500/10 text-4xl"></i>
            </div>
          </div>

          <!-- Registration Activity Bar Chart -->
          <div class="glass-panel p-6 rounded-2xl border-white/5 mb-8">
            <div class="flex items-center justify-between mb-6">
              <div>
                <h3 class="text-sm font-heading font-extrabold text-white uppercase tracking-wider flex items-center gap-2">
                  <i class="fa-solid fa-chart-column text-cyan-400"></i> User Registrations Over Time (Last 7 Days)
                </h3>
                <p class="text-xs text-gray-400 mt-0.5">Real-time daily user registration metrics from database records.</p>
              </div>
            </div>

            <div class="h-48 flex items-end justify-between gap-4 px-4 pt-6 pb-2 border-b border-white/10">
              ${renderBarChart(stats.chartLabels, stats.chartCounts)}
            </div>
          </div>
        </div>

        <!-- Tab 2: Registered Users Directory -->
        <div id="admin-tab-users" class="admin-content-box ${activeAdminTab === 'users' ? '' : 'hidden'}">
          <div class="glass-panel p-6 rounded-2xl border-white/5 flex flex-col gap-6">
            
            <!-- Controls Bar: Search, Filter & Sort -->
            <div class="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 border-b border-white/10 pb-6">
              <div>
                <h3 class="text-sm font-heading font-extrabold text-white uppercase tracking-wider flex items-center gap-2">
                  <i class="fa-solid fa-address-book text-cyan-400"></i> Registered Users Directory
                </h3>
                <p class="text-xs text-gray-400 mt-0.5">View user details, login counts, registration timestamps, and manage user status.</p>
              </div>

              <div class="flex flex-wrap items-center gap-3 w-full lg:w-auto">
                <div class="relative flex-1 sm:w-64">
                  <input type="text" id="admin-search-input" value="${window.escapeHtml(adminSearchQuery)}" oninput="handleAdminSearch(event)" placeholder="Search by name or email..." class="w-full bg-slate-900 border border-white/10 rounded-xl py-2 pl-9 pr-4 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-blue-500">
                  <i class="fa-solid fa-magnifying-glass absolute left-3 top-2.5 text-gray-500 text-xs"></i>
                </div>

                <select onchange="handleAdminFilter(event)" class="bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-gray-300 focus:outline-none">
                  <option value="All" ${adminFilterRole === 'All' ? 'selected' : ''}>All Roles</option>
                  <option value="Users" ${adminFilterRole === 'Users' ? 'selected' : ''}>Normal Users</option>
                  <option value="Admins" ${adminFilterRole === 'Admins' ? 'selected' : ''}>Administrators</option>
                  <option value="Active" ${adminFilterRole === 'Active' ? 'selected' : ''}>Active Accounts</option>
                  <option value="Today" ${adminFilterRole === 'Today' ? 'selected' : ''}>Registered Today</option>
                  <option value="ThisWeek" ${adminFilterRole === 'ThisWeek' ? 'selected' : ''}>Registered This Week</option>
                </select>

                <select onchange="handleAdminSort(event)" class="bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-gray-300 focus:outline-none">
                  <option value="newest" ${adminSortOption === 'newest' ? 'selected' : ''}>Sort: Newest First</option>
                  <option value="oldest" ${adminSortOption === 'oldest' ? 'selected' : ''}>Sort: Oldest First</option>
                  <option value="latest_login" ${adminSortOption === 'latest_login' ? 'selected' : ''}>Sort: Latest Login</option>
                  <option value="most_logins" ${adminSortOption === 'most_logins' ? 'selected' : ''}>Sort: Most Logins</option>
                </select>
              </div>
            </div>

            <!-- Users Table -->
            <div class="overflow-x-auto">
              ${renderUsersTable(adminUsersList)}
            </div>
          </div>
        </div>

        <!-- Tab 3: Publish Challenge -->
        <div id="admin-tab-content" class="admin-content-box ${activeAdminTab === 'content' ? '' : 'hidden'} max-w-2xl mx-auto">
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
                <label for="admin-ch-code" class="block text-[9px] text-gray-500 uppercase tracking-widest mb-1">Starter / Boilerplate RTL Code</label>
                <textarea id="admin-ch-code" required placeholder="module my_module (input wire clk, output wire y);" class="w-full h-20 bg-[#05070f] border border-white/10 rounded-xl p-3 text-xs font-mono text-emerald-400"></textarea>
              </div>
              <div>
                <label for="admin-ch-solution" class="block text-[9px] text-gray-500 uppercase tracking-widest mb-1">Reference RTL Solution</label>
                <textarea id="admin-ch-solution" required placeholder="module my_module (input wire clk, output wire y); assign y = 1'b1; endmodule" class="w-full h-20 bg-[#05070f] border border-white/10 rounded-xl p-3 text-xs font-mono text-cyan-400"></textarea>
              </div>
              <button type="submit" class="w-full py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 rounded-xl text-xs font-bold text-white shadow-lg shadow-blue-500/20" aria-label="Publish live challenge">Publish Live Challenge</button>
            </form>
          </div>
        </div>

        <!-- Tab 4: Announcements -->
        <div id="admin-tab-broadcast" class="admin-content-box ${activeAdminTab === 'broadcast' ? '' : 'hidden'} max-w-md mx-auto">
          <div class="glass-panel p-6 rounded-2xl border-white/5 flex flex-col gap-4">
            <h3 class="text-xs font-heading font-bold text-white flex items-center gap-2">
              <i class="fa-solid fa-bullhorn text-amber-400"></i> Broadcast Announcement
            </h3>
            <label for="admin-announce-text" class="block text-[9px] text-gray-500 uppercase tracking-widest mb-1">Announcement Body</label>
            <textarea id="admin-announce-text" class="w-full h-24 bg-slate-900 border border-white/10 rounded-xl p-3 text-xs text-white" placeholder="Write announcement alert message..."></textarea>
            <button onclick="adminBroadcastAlert()" class="w-full py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 rounded-xl text-xs font-bold text-white shadow-lg" aria-label="Post system announcement">Post Announcement</button>
          </div>
        </div>

      </div>
    </div>

    <!-- User Details Accessible Modal Container -->
    <div id="user-details-modal" class="hidden fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4" role="dialog" aria-modal="true" aria-labelledby="user-details-title"></div>
  `;
};

function renderAdminTabBtn(tabId, label, icon) {
  return `
    <button type="button" onclick="switchAdminTab('${tabId}')" id="btn-admin-${tabId}" class="px-4 py-2 rounded-xl text-xs font-bold font-heading flex items-center gap-2 border transition-all ${
      tabId === activeAdminTab 
        ? 'bg-blue-950/40 border-blue-500/40 text-blue-300 shadow-md' 
        : 'bg-[#0b0f19] border-white/5 text-gray-400 hover:text-gray-200'
    }" aria-label="Switch to admin ${label} tab">
      <i class="fa-solid ${icon} text-xs"></i>
      ${label}
    </button>
  `;
}

function renderBarChart(labels, counts) {
  const maxVal = Math.max(...counts, 1);
  return labels.map((lbl, idx) => {
    const val = counts[idx] || 0;
    const heightPct = Math.max(10, Math.round((val / maxVal) * 100));
    return `
      <div class="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
        <span class="text-[10px] font-mono font-bold text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity">${val}</span>
        <div class="w-full max-w-[36px] bg-gradient-to-t from-blue-600 to-cyan-400 rounded-t-lg transition-all duration-500 hover:brightness-125" style="height: ${heightPct}%"></div>
        <span class="text-[10px] font-mono text-gray-400 uppercase">${lbl}</span>
      </div>
    `;
  }).join("");
}

function renderUsersTable(users) {
  if (!users || users.length === 0) {
    return `
      <div class="p-8 text-center text-xs text-gray-400 font-mono">
        <i class="fa-solid fa-users-slash text-2xl text-gray-600 mb-2 block"></i>
        No registered users match the current search or filter criteria.
      </div>
    `;
  }

  return `
    <table class="w-full text-left text-xs border-collapse">
      <thead>
        <tr class="border-b border-white/10 text-gray-400 font-mono text-[10px] uppercase">
          <th class="py-3 px-3">User Profile</th>
          <th class="py-3 px-3">Email Address</th>
          <th class="py-3 px-3">Role</th>
          <th class="py-3 px-3">Joined Date</th>
          <th class="py-3 px-3">Last Login</th>
          <th class="py-3 px-3">Logins</th>
          <th class="py-3 px-3">Status</th>
          <th class="py-3 px-3 text-right">Actions</th>
        </tr>
      </thead>
      <tbody class="text-gray-300 font-sans divide-y divide-white/5">
        ${users.map(u => {
          const isBlocked = u.account_status === "blocked";
          const isAdmin = u.role === "admin";
          const joinedStr = u.created_at ? new Date(u.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "Aug 1, 2026";
          const lastLoginStr = u.last_login_at ? new Date(u.last_login_at).toLocaleString() : "Never";

          return `
            <tr class="hover:bg-slate-900/40 transition-colors">
              <td class="py-3.5 px-3">
                <div class="flex items-center gap-2.5">
                  <div class="w-8 h-8 rounded-full ${isAdmin ? 'bg-gradient-to-tr from-cyan-600 to-blue-600 border border-cyan-400' : 'bg-slate-800 border border-white/10'} flex items-center justify-center font-bold text-white text-xs font-mono">
                    ${(u.name || "U").charAt(0).toUpperCase()}
                  </div>
                  <div class="flex flex-col">
                    <strong class="text-white text-xs ${isAdmin ? 'text-cyan-300' : ''}">${window.escapeHtml(u.name || "User")} ${isAdmin ? '👑' : ''}</strong>
                    <span class="text-[10px] text-gray-500 font-mono">ID: ${u.id ? u.id.substring(0, 12) : "usr"}...</span>
                  </div>
                </div>
              </td>
              <td class="py-3.5 px-3 font-mono text-gray-300 text-xs">${window.escapeHtml(u.email || "")}</td>
              <td class="py-3.5 px-3">
                <span class="px-2 py-0.5 rounded text-[10px] font-mono uppercase ${isAdmin ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/30' : 'bg-slate-900 text-gray-400'}">
                  ${u.role || 'user'}
                </span>
              </td>
              <td class="py-3.5 px-3 font-mono text-[11px] text-gray-400">${joinedStr}</td>
              <td class="py-3.5 px-3 font-mono text-[11px] text-gray-400">${lastLoginStr}</td>
              <td class="py-3.5 px-3 font-mono font-bold text-blue-400 text-xs">${u.login_count || 1}</td>
              <td class="py-3.5 px-3">
                <span class="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold border ${
                  isBlocked 
                    ? 'bg-rose-950/60 border-rose-500/40 text-rose-300' 
                    : 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300'
                }">
                  ${isBlocked ? '🛑 Blocked' : '✓ Active'}
                </span>
              </td>
              <td class="py-3.5 px-3 text-right">
                <div class="flex items-center justify-end gap-2">
                  <button type="button" onclick="showUserDetailsModal('${u.id}')" class="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 border border-white/10 text-[10px] font-mono text-gray-300 rounded-lg transition-colors" aria-label="View user profile details">
                    Details
                  </button>
                </div>
              </td>
            </tr>
          `;
        }).join("")}
      </tbody>
    </table>
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

window.refreshAdminAnalytics = async function() {
  if (window.showToast) window.showToast("Fetching live database analytics...", "info");
  try {
    adminAnalyticsData = await window.VLSISupabase.fetchAdminAnalytics();
    adminUsersList = await window.VLSISupabase.fetchRegisteredUsers({
      search: adminSearchQuery,
      filter: adminFilterRole,
      sort: adminSortOption
    });
    renderAdmin();
    if (window.showToast) window.showToast("User statistics updated successfully.", "success");
  } catch(e) {
    console.error("Refresh error:", e);
  }
};

window.handleAdminSearch = function(e) {
  adminSearchQuery = e.target.value;
  refreshUsersTableOnly();
};

window.handleAdminFilter = function(e) {
  adminFilterRole = e.target.value;
  refreshUsersTableOnly();
};

window.handleAdminSort = function(e) {
  adminSortOption = e.target.value;
  refreshUsersTableOnly();
};

async function refreshUsersTableOnly() {
  adminUsersList = await window.VLSISupabase.fetchRegisteredUsers({
    search: adminSearchQuery,
    filter: adminFilterRole,
    sort: adminSortOption
  });
  const container = document.querySelector("#admin-tab-users .overflow-x-auto");
  if (container) {
    container.innerHTML = renderUsersTable(adminUsersList);
  }
}

window.showUserDetailsModal = function(userId) {
  const user = adminUsersList.find(u => u.id === userId);
  if (!user) return;

  const modal = document.getElementById("user-details-modal");
  if (!modal) return;

  const isBlocked = user.account_status === "blocked";
  const isAdmin = user.role === "admin";

  modal.innerHTML = `
    <div class="glass-panel p-6 rounded-3xl border-white/10 max-w-md w-full shadow-2xl relative animate-fade-in-up">
      <div class="flex items-center justify-between mb-4 border-b border-white/10 pb-3">
        <h3 id="user-details-title" class="text-sm font-heading font-extrabold text-white flex items-center gap-2">
          <i class="fa-solid fa-id-card text-cyan-400"></i> User Profile Details
        </h3>
        <button type="button" onclick="closeUserDetailsModal()" class="text-gray-400 hover:text-white p-1" aria-label="Close user details modal">
          <i class="fa-solid fa-xmark text-sm"></i>
        </button>
      </div>

      <div class="flex flex-col gap-3 font-mono text-xs">
        <div class="flex justify-between py-1 border-b border-white/5">
          <span class="text-gray-500">User ID:</span>
          <span class="text-white font-bold">${window.escapeHtml(user.id)}</span>
        </div>
        <div class="flex justify-between py-1 border-b border-white/5">
          <span class="text-gray-500">Full Name:</span>
          <span class="text-white font-bold">${window.escapeHtml(user.name || "N/A")}</span>
        </div>
        <div class="flex justify-between py-1 border-b border-white/5">
          <span class="text-gray-500">Email Address:</span>
          <span class="text-cyan-300 font-bold">${window.escapeHtml(user.email || "N/A")}</span>
        </div>
        <div class="flex justify-between py-1 border-b border-white/5">
          <span class="text-gray-500">Role:</span>
          <span class="text-purple-300 font-bold uppercase">${window.escapeHtml(user.role || "user")}</span>
        </div>
        <div class="flex justify-between py-1 border-b border-white/5">
          <span class="text-gray-500">Registration Date:</span>
          <span class="text-gray-300">${user.created_at ? new Date(user.created_at).toLocaleString() : "N/A"}</span>
        </div>
        <div class="flex justify-between py-1 border-b border-white/5">
          <span class="text-gray-500">Last Login:</span>
          <span class="text-gray-300">${user.last_login_at ? new Date(user.last_login_at).toLocaleString() : "Never"}</span>
        </div>
        <div class="flex justify-between py-1 border-b border-white/5">
          <span class="text-gray-500">Total Logins:</span>
          <span class="text-blue-400 font-bold">${user.login_count || 1}</span>
        </div>
        <div class="flex justify-between py-1 border-b border-white/5">
          <span class="text-gray-500">Account Status:</span>
          <span class="${isBlocked ? 'text-rose-400' : 'text-emerald-400'} font-bold">${isBlocked ? 'Blocked' : 'Active'}</span>
        </div>
      </div>

      <div class="flex items-center justify-end gap-3 mt-6">
        <button type="button" onclick="adminToggleUserRole('${user.id}')" class="px-3 py-2 bg-purple-950 hover:bg-purple-900 border border-purple-500/40 text-purple-300 rounded-xl text-xs font-mono">
          ${isAdmin ? 'Demote to User' : 'Promote to Admin'}
        </button>
        <button type="button" onclick="adminToggleUserStatus('${user.id}')" class="px-3 py-2 ${isBlocked ? 'bg-emerald-950 text-emerald-300 border-emerald-500/40' : 'bg-amber-950 text-amber-300 border-amber-500/40'} border rounded-xl text-xs font-mono">
          ${isBlocked ? 'Unblock Account' : 'Block Account'}
        </button>
      </div>
    </div>
  `;
  modal.classList.remove("hidden");
};

window.closeUserDetailsModal = function() {
  const modal = document.getElementById("user-details-modal");
  if (modal) modal.classList.add("hidden");
};

window.adminToggleUserRole = async function(userId) {
  const user = adminUsersList.find(u => u.id === userId);
  if (!user) return;
  const newRole = user.role === "admin" ? "user" : "admin";

  await window.VLSISupabase.updateUserProfile(userId, { role: newRole });
  if (window.showToast) window.showToast(`Updated user role to "${newRole}".`, "success");
  closeUserDetailsModal();
  refreshAdminAnalytics();
};

window.adminToggleUserStatus = async function(userId) {
  const user = adminUsersList.find(u => u.id === userId);
  if (!user) return;
  const newStatus = user.account_status === "blocked" ? "active" : "blocked";

  await window.VLSISupabase.updateUserProfile(userId, { account_status: newStatus });
  if (window.showToast) window.showToast(`Account status updated to "${newStatus}".`, "info");
  closeUserDetailsModal();
  refreshAdminAnalytics();
};

window.adminCreateChallenge = function(e) {
  e.preventDefault();
  
  const title = document.getElementById("admin-ch-title").value.trim();
  const diff = document.getElementById("admin-ch-diff").value;
  const topic = document.getElementById("admin-ch-topic").value;
  const desc = document.getElementById("admin-ch-desc").value.trim();
  const code = document.getElementById("admin-ch-code").value.trim();
  const sol = document.getElementById("admin-ch-solution") ? document.getElementById("admin-ch-solution").value.trim() : code;

  if (!title || !desc || !code) return;

  const newCh = {
    id: `ch-admin-${Date.now()}`,
    title,
    difficulty: diff,
    topic,
    description: desc,
    initial_code: code,
    solution: sol || code,
    acceptance: "100% acceptance",
    solved: "0 solved",
    tags: [topic.toLowerCase().replace(/\s+/g, "-")],
    isAdminCreated: true
  };

  VLSIData.challenges.push(newCh);
  if (typeof window.saveAdminPersistedData === "function") {
    window.saveAdminPersistedData();
  }

  if (window.showToast) window.showToast(`Challenge "${title}" saved and published live!`, "success");
  
  document.getElementById("admin-ch-title").value = "";
  document.getElementById("admin-ch-desc").value = "";
  document.getElementById("admin-ch-code").value = "";
  if (document.getElementById("admin-ch-solution")) document.getElementById("admin-ch-solution").value = "";
  
  switchAdminTab("users");
};
