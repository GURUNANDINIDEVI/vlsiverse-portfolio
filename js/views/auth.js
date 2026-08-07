/* Auth View - Professional Silicon Design Sign In & Registration Controller */

let authMode = "signin"; // 'signin' or 'signup'

function getRegisteredUsers() {
  const defaultUsers = [
    {
      id: "usr-admin-1",
      username: "Nandini (Admin)",
      email: "nandini@vlsiverse.com",
      password: "adminpassword",
      role: "Platform Creator / Admin",
      status: "Active",
      registeredAt: "2026-08-01 10:00 AM",
      lastActiveAt: new Date().toLocaleString(),
      solvedCount: 0,
      xp: 0
    }
  ];

  const stored = localStorage.getItem("vlsi_registered_users");
  if (!stored) {
    localStorage.setItem("vlsi_registered_users", JSON.stringify(defaultUsers));
    return defaultUsers;
  }
  try {
    return JSON.parse(stored);
  } catch (e) {
    return defaultUsers;
  }
}

function saveRegisteredUsers(users) {
  localStorage.setItem("vlsi_registered_users", JSON.stringify(users));
}

// Loads isolated per-user progress data
window.loadUserDataState = function(email) {
  const userKey = "vlsi_user_data_" + email.toLowerCase().trim();
  const rawData = localStorage.getItem(userKey);
  if (rawData) {
    try {
      const data = JSON.parse(rawData);
      AppState.user.xp = data.xp || 0;
      AppState.user.solved_count = data.solved_count || 0;
      AppState.user.streak = data.streak || 1;
      AppState.user.completed_challenges = data.completed_challenges || [];
      AppState.user.activityLog = data.activityLog || {};
      AppState.user.progress = data.progress || {};
      AppState.user.certificates = data.certificates || [];

      // Restore Digital Practice solved & bookmarked IDs
      if (data.solvedIds) {
        localStorage.setItem("vlsi_solved_dp", JSON.stringify(data.solvedIds));
        if (window.digitalPracticeState) {
          window.digitalPracticeState.solvedIds = new Set(data.solvedIds);
        }
      }
      if (data.bookmarkedIds) {
        localStorage.setItem("vlsi_bookmarked_dp", JSON.stringify(data.bookmarkedIds));
        if (window.digitalPracticeState) {
          window.digitalPracticeState.bookmarkedIds = new Set(data.bookmarkedIds);
        }
      }
      return data;
    } catch(e) {}
  }

  // Fresh user state fallback
  const freshData = {
    email: email,
    xp: 0,
    solved_count: 0,
    streak: 0,
    completed_challenges: [],
    activityLog: {},
    progress: {},
    certificates: [],
    solvedIds: [],
    bookmarkedIds: []
  };

  AppState.user.xp = 0;
  AppState.user.solved_count = 0;
  AppState.user.streak = 0;
  AppState.user.completed_challenges = [];
  AppState.user.activityLog = {};
  AppState.user.progress = {};
  AppState.user.certificates = [];

  localStorage.setItem(userKey, JSON.stringify(freshData));
  return freshData;
};

// Saves current AppState user progress into their isolated localStorage bucket
window.persistCurrentUserProgress = function() {
  if (!AppState.user.email) return;
  const userKey = "vlsi_user_data_" + AppState.user.email.toLowerCase().trim();
  
  let dpSolved = [];
  let dpBookmarked = [];
  try {
    dpSolved = JSON.parse(localStorage.getItem("vlsi_solved_dp") || "[]");
    dpBookmarked = JSON.parse(localStorage.getItem("vlsi_bookmarked_dp") || "[]");
  } catch(e) {}

  const saveData = {
    email: AppState.user.email,
    xp: AppState.user.xp || 0,
    solved_count: AppState.user.solved_count || 0,
    streak: AppState.user.streak || 1,
    completed_challenges: AppState.user.completed_challenges || [],
    activityLog: AppState.user.activityLog || {},
    progress: AppState.user.progress || {},
    certificates: AppState.user.certificates || [],
    solvedIds: dpSolved,
    bookmarkedIds: dpBookmarked
  };

  localStorage.setItem(userKey, JSON.stringify(saveData));
};

window.renderAuth = function() {
  const container = document.getElementById("view-container");
  if (!container) return;

  container.innerHTML = `
    <div class="min-h-[85vh] flex items-center justify-center px-6 py-12 relative overflow-hidden font-sans">
      <!-- Ambient Background Glows -->
      <div class="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>
      <div class="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div class="w-full max-w-md glass-panel p-8 rounded-3xl border border-white/10 shadow-2xl relative z-10 backdrop-blur-xl">
        <!-- Logo & Header -->
        <div class="flex flex-col items-center text-center mb-6">
          <div class="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-400 flex items-center justify-center glow-border-blue mb-3 shadow-xl shadow-blue-500/20">
            <i class="fa-solid fa-microchip text-white text-2xl"></i>
          </div>
          <h2 class="text-2xl font-heading font-extrabold text-white tracking-tight">
            VLSIVerse <span class="text-blue-500">Silicon Engine</span>
          </h2>
          <p class="text-xs text-gray-400 mt-1">Sign in to access 200+ practice problems, ASIC pipelines & virtual labs.</p>
        </div>

        <!-- Mode Selector Tabs -->
        <div class="grid grid-cols-2 p-1 bg-slate-950/60 rounded-xl border border-white/5 mb-6 text-xs font-mono">
          <button onclick="switchAuthTab('signin')" id="auth-tab-signin" class="py-2.5 rounded-lg font-bold transition-all ${authMode === 'signin' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-400 hover:text-white'}">
            <i class="fa-solid fa-right-to-bracket mr-1.5"></i> Sign In
          </button>
          <button onclick="switchAuthTab('signup')" id="auth-tab-signup" class="py-2.5 rounded-lg font-bold transition-all ${authMode === 'signup' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-400 hover:text-white'}">
            <i class="fa-solid fa-user-plus mr-1.5"></i> Register Account
          </button>
        </div>

        <!-- Clean Form Area -->
        <form onsubmit="handleAuthSubmit(event)" class="flex flex-col gap-4">
          ${authMode === 'signup' ? `
            <div>
              <label class="block text-[10px] text-gray-400 font-mono font-bold uppercase tracking-wider mb-1.5">Username</label>
              <div class="relative">
                <input type="text" id="auth-username" required placeholder="e.g. Nandini_RTL" class="w-full bg-[#0b0f19] border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-xs text-white focus:outline-none focus:border-blue-500 transition-colors">
                <i class="fa-solid fa-user-tag absolute left-3.5 top-3 text-gray-500 text-xs"></i>
              </div>
            </div>
          ` : ''}

          <div>
            <label class="block text-[10px] text-gray-400 font-mono font-bold uppercase tracking-wider mb-1.5">${authMode === 'signin' ? 'Email Address or Username' : 'Email Address'}</label>
            <div class="relative">
              <input type="text" id="auth-email" required placeholder="${authMode === 'signin' ? 'user@vlsiverse.com or username' : 'user@vlsiverse.com'}" class="w-full bg-[#0b0f19] border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-xs text-white focus:outline-none focus:border-blue-500 transition-colors">
              <i class="fa-solid fa-envelope absolute left-3.5 top-3 text-gray-500 text-xs"></i>
            </div>
          </div>

          <div>
            <label class="block text-[10px] text-gray-400 font-mono font-bold uppercase tracking-wider mb-1.5">Password</label>
            <div class="relative">
              <input type="password" id="auth-password" required placeholder="••••••••" class="w-full bg-[#0b0f19] border border-white/10 rounded-xl py-2.5 pl-10 pr-10 text-xs text-white focus:outline-none focus:border-blue-500 transition-colors">
              <i class="fa-solid fa-lock absolute left-3.5 top-3 text-gray-500 text-xs"></i>
              <button type="button" onclick="togglePasswordVisibility()" class="absolute right-3.5 top-3 text-gray-500 hover:text-white text-xs">
                <i class="fa-solid fa-eye" id="pass-eye-icon"></i>
              </button>
            </div>
          </div>

          <button type="submit" class="w-full py-3 mt-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-heading font-bold text-xs tracking-wider rounded-xl shadow-lg shadow-blue-500/20 transition-all hover:scale-[1.01] active:scale-95">
            ${authMode === 'signin' ? 'Sign In to Workspace' : 'Complete Registration & Sign In'}
          </button>
        </form>
      </div>
    </div>
  `;
};

window.switchAuthTab = function(mode) {
  authMode = mode;
  renderAuth();
};

window.togglePasswordVisibility = function() {
  const input = document.getElementById("auth-password");
  const icon = document.getElementById("pass-eye-icon");
  if (!input || !icon) return;
  if (input.type === "password") {
    input.type = "text";
    icon.className = "fa-solid fa-eye-slash";
  } else {
    input.type = "password";
    icon.className = "fa-solid fa-eye";
  }
};

window.handleAuthSubmit = function(e) {
  e.preventDefault();
  const emailOrUser = document.getElementById("auth-email")?.value.trim() || "";
  const password = document.getElementById("auth-password")?.value || "";
  const users = getRegisteredUsers();

  if (authMode === "signup") {
    const username = document.getElementById("auth-username")?.value.trim() || emailOrUser.split("@")[0] || "User";

    const exists = users.find(u => u.email.toLowerCase() === emailOrUser.toLowerCase() || u.username.toLowerCase() === username.toLowerCase());
    if (exists) {
      if (window.showToast) window.showToast("An account with this email or username already exists! Please sign in.", "error");
      return;
    }

    const newUser = {
      id: "usr-" + Date.now(),
      username: username,
      email: emailOrUser,
      password: password,
      role: "RTL Design Engineer",
      status: "Active",
      registeredAt: new Date().toLocaleString(),
      lastActiveAt: new Date().toLocaleString(),
      solvedCount: 0,
      xp: 0
    };

    users.push(newUser);
    saveRegisteredUsers(users);

    AppState.user.signedIn = true;
    AppState.user.name = username;
    AppState.user.email = emailOrUser;
    AppState.user.role = "RTL Design Engineer";
    
    // Load fresh 0-state for new user
    window.loadUserDataState(emailOrUser);

    localStorage.setItem("vlsi_active_user", JSON.stringify({
      name: username,
      email: emailOrUser,
      role: "RTL Design Engineer"
    }));

    if (window.showToast) window.showToast(`Account created! Welcome, ${username}.`, "success");
    if (window.navigateTo) window.navigateTo("dashboard");
  } else {
    // Sign In
    const found = users.find(u => (u.email.toLowerCase() === emailOrUser.toLowerCase() || u.username.toLowerCase() === emailOrUser.toLowerCase()) && u.password === password);
    
    if (!found) {
      if (window.showToast) window.showToast("Invalid email/username or password.", "error");
      return;
    }

    if (found.status === "Blocked") {
      if (window.showToast) window.showToast("Account Access Revoked: Your access has been suspended by the administrator.", "error");
      return;
    }

    found.lastActiveAt = new Date().toLocaleString();
    saveRegisteredUsers(users);

    AppState.user.signedIn = true;
    AppState.user.name = found.username;
    AppState.user.email = found.email;
    AppState.user.role = found.role || "RTL Design Engineer";

    // Restore exact saved progress for returning user
    window.loadUserDataState(found.email);

    localStorage.setItem("vlsi_active_user", JSON.stringify({
      name: found.username,
      email: found.email,
      role: found.role
    }));

    if (window.showToast) window.showToast(`Welcome back, ${found.username}! Continuing your progress.`, "success");
    if (window.navigateTo) window.navigateTo("dashboard");
  }
};

window.signOutUser = function() {
  if (AppState.user.email) {
    window.persistCurrentUserProgress();
  }
  AppState.user.signedIn = false;
  localStorage.removeItem("vlsi_active_user");
  if (window.showToast) window.showToast("Signed out successfully.", "info");
  if (window.navigateTo) window.navigateTo("home");
};
