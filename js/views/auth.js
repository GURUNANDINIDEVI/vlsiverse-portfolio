/* Auth View - Professional Silicon Design Sign In & Registration Controller */

let authMode = "signin"; // 'signin' or 'signup'

// Web Crypto SHA-256 Password Verifier Hashing
window.hashPassword = async function(password) {
  if (!password) return "";
  try {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
  } catch(e) {
    // Fallback hashing for older environments
    let hash = 0;
    for (let i = 0; i < password.length; i++) {
      hash = (hash << 5) - hash + password.charCodeAt(i);
      hash |= 0;
    }
    return "h_" + Math.abs(hash).toString(16);
  }
};

window.getRegisteredUsers = function() {
  const defaultUsers = [
    {
      id: "usr_admin_1",
      username: "Admin",
      email: "admin@vlsiverse.com",
      role: "admin",
      status: "Active",
      registeredAt: "2026-08-01 10:00 AM",
      lastActiveAt: new Date().toLocaleString(),
      solvedCount: 0,
      xp: 0
    }
  ];

  let usersList = [];
  const stored = localStorage.getItem("vlsi_registered_users");
  if (stored) {
    try {
      usersList = JSON.parse(stored);
    } catch (e) {
      usersList = [...defaultUsers];
    }
  } else {
    usersList = [...defaultUsers];
  }

  // Sanitize user models: ensure stable id, remove plaintext password props
  usersList.forEach(u => {
    delete u.password;
    if (!u.id || !u.id.startsWith("usr_")) {
      u.id = "usr_" + Math.random().toString(36).substring(2, 10);
    }
    if (!u.role) u.role = "user";
  });

  localStorage.setItem("vlsi_registered_users", JSON.stringify(usersList));
  return usersList;
};

window.saveRegisteredUsers = function(users) {
  const sanitized = users.map(u => {
    const copy = { ...u };
    delete copy.password;
    return copy;
  });
  localStorage.setItem("vlsi_registered_users", JSON.stringify(sanitized));
};

// Loads isolated per-user progress data scoped strictly to stable AppState.user.id
window.loadUserDataState = function(userObj) {
  const targetId = (userObj && userObj.id) ? userObj.id : (AppState.user && AppState.user.id ? AppState.user.id : "usr_guest");
  const userKey = "vlsi_user_" + targetId + "_data";
  const rawData = localStorage.getItem(userKey);
  
  if (rawData) {
    try {
      const data = JSON.parse(rawData);
      AppState.user.xp = data.xp || 0;
      AppState.user.solved_count = data.solved_count || 0;
      AppState.user.streak = data.streak || 0;
      AppState.user.completed_challenges = data.completed_challenges || [];
      AppState.user.activityLog = data.activityLog || {};
      AppState.user.progress = data.progress || {};
      AppState.user.certificates = data.certificates || [];
      AppState.user.solved_dp_ids = data.solved_dp_ids || [];
      AppState.user.bookmarked_dp_ids = data.bookmarked_dp_ids || [];

      if (window.digitalPracticeState) {
        window.digitalPracticeState.solvedIds = new Set(data.solved_dp_ids || []);
        window.digitalPracticeState.bookmarkedIds = new Set(data.bookmarked_dp_ids || []);
      }
      return data;
    } catch(e) {}
  }

  // Fresh isolated user state
  const freshData = {
    userId: targetId,
    xp: 0,
    solved_count: 0,
    streak: 0,
    completed_challenges: [],
    activityLog: {},
    progress: {},
    certificates: [],
    solved_dp_ids: [],
    bookmarked_dp_ids: []
  };

  AppState.user.xp = 0;
  AppState.user.solved_count = 0;
  AppState.user.streak = 0;
  AppState.user.completed_challenges = [];
  AppState.user.activityLog = {};
  AppState.user.progress = {};
  AppState.user.certificates = [];
  AppState.user.solved_dp_ids = [];
  AppState.user.bookmarked_dp_ids = [];

  if (window.digitalPracticeState) {
    window.digitalPracticeState.solvedIds = new Set();
    window.digitalPracticeState.bookmarkedIds = new Set();
  }

  localStorage.setItem(userKey, JSON.stringify(freshData));
  return freshData;
};

// Saves current AppState user progress into their isolated localStorage bucket
window.persistCurrentUserProgress = function() {
  const userId = AppState.user.id;
  if (!userId) return;
  const userKey = "vlsi_user_" + userId + "_data";

  let dpSolved = AppState.user.solved_dp_ids || [];
  let dpBookmarked = AppState.user.bookmarked_dp_ids || [];
  if (window.digitalPracticeState) {
    dpSolved = Array.from(window.digitalPracticeState.solvedIds || []);
    dpBookmarked = Array.from(window.digitalPracticeState.bookmarkedIds || []);
  }

  const saveData = {
    userId: userId,
    xp: AppState.user.xp || 0,
    solved_count: AppState.user.solved_count || 0,
    streak: AppState.user.streak || 0,
    completed_challenges: AppState.user.completed_challenges || [],
    activityLog: AppState.user.activityLog || {},
    progress: AppState.user.progress || {},
    certificates: AppState.user.certificates || [],
    solved_dp_ids: dpSolved,
    bookmarked_dp_ids: dpBookmarked
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

      <div class="w-full max-w-md glass-panel p-8 rounded-3xl border-white/10 shadow-2xl relative z-10 animate-fade-in-up">
        
        <!-- Tab Toggle Buttons -->
        <div class="flex items-center justify-center gap-2 p-1 bg-slate-900/80 rounded-xl border border-white/5 mb-8">
          <button type="button" onclick="switchAuthMode('signin')" id="tab-auth-signin" class="flex-1 py-2 text-xs font-bold font-heading rounded-lg transition-all ${
            authMode === 'signin' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-400 hover:text-gray-200'
          }" aria-label="Switch to sign in view">
            Sign In
          </button>
          <button type="button" onclick="switchAuthMode('signup')" id="tab-auth-signup" class="flex-1 py-2 text-xs font-bold font-heading rounded-lg transition-all ${
            authMode === 'signup' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-400 hover:text-gray-200'
          }" aria-label="Switch to register view">
            Create Account
          </button>
        </div>

        <!-- Header Titles -->
        <div class="text-center mb-6">
          <div class="w-12 h-12 mx-auto rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-400 flex items-center justify-center text-white text-xl font-bold mb-3 shadow-lg glow-border-blue">
            <i class="fa-solid fa-user-shield"></i>
          </div>
          <h2 id="auth-title" class="text-xl font-heading font-extrabold text-white">
            ${authMode === 'signin' ? 'Welcome Back to VLSIVerse' : 'Join VLSIVerse Platform'}
          </h2>
          <p id="auth-subtitle" class="text-xs text-gray-400 mt-1">
            ${authMode === 'signin' ? 'Enter credentials to access RTL practice & progress.' : 'Create demo account for silicon engineering practice.'}
          </p>
        </div>

        <!-- Dynamic Form -->
        <form onsubmit="handleAuthSubmit(event)" class="flex flex-col gap-4">
          <div id="auth-name-field" class="${authMode === 'signup' ? '' : 'hidden'}">
            <label for="auth-username" class="block text-[10px] font-heading font-bold text-gray-400 uppercase tracking-widest mb-1.5">Full Name / Engineer ID</label>
            <input type="text" id="auth-username" placeholder="e.g. Guru Nandini Devi" class="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none transition-colors">
          </div>

          <div>
            <label for="auth-email" class="block text-[10px] font-heading font-bold text-gray-400 uppercase tracking-widest mb-1.5">Email Address or Username</label>
            <input type="text" id="auth-email" required placeholder="engineer@vlsiverse.com" class="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none transition-colors">
          </div>

          <div>
            <label for="auth-password" class="block text-[10px] font-heading font-bold text-gray-400 uppercase tracking-widest mb-1.5">Password</label>
            <input type="password" id="auth-password" required placeholder="••••••••" class="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none transition-colors">
          </div>

          <button type="submit" id="auth-submit-btn" class="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 rounded-xl text-xs font-bold font-heading text-white shadow-lg shadow-blue-500/20 transition-all hover:scale-[1.02] active:scale-[0.98] mt-2" aria-label="Submit authentication credentials">
            ${authMode === 'signin' ? 'Sign In to Workspace' : 'Create Local Account'}
          </button>
        </form>

        <p class="text-[10px] text-gray-500 text-center mt-6">
          🔒 Demo Browser Authentication &bull; SHA-256 Verifiers &bull; Isolated Local Storage
        </p>
      </div>
    </div>
  `;
};

window.switchAuthMode = function(mode) {
  authMode = mode;
  renderAuth();
};

window.handleAuthSubmit = async function(e) {
  e.preventDefault();

  const emailOrUser = document.getElementById("auth-email").value.trim();
  const password = document.getElementById("auth-password").value.trim();
  const usernameInput = document.getElementById("auth-username")?.value.trim();

  if (!emailOrUser || !password) {
    if (window.showToast) window.showToast("Please provide both email/username and password.", "error");
    return;
  }

  const cleanEmail = emailOrUser.includes("@") ? emailOrUser : `${emailOrUser.toLowerCase()}@vlsiverse.com`;
  const finalUsername = usernameInput || emailOrUser.split("@")[0];

  try {
    let result = null;
    if (authMode === "signup") {
      result = await window.VLSISupabase.signUp(cleanEmail, password, finalUsername);
    } else {
      result = await window.VLSISupabase.signIn(cleanEmail, password);
    }

    const profile = result.profile || {};
    AppState.user = {
      id: profile.id || "usr_" + Date.now(),
      name: profile.name || finalUsername,
      email: profile.email || cleanEmail,
      role: profile.role || "user",
      signedIn: true
    };

    window.loadUserDataState(AppState.user);
    window.persistCurrentUserProgress();

    localStorage.setItem("vlsi_active_user", JSON.stringify({
      id: AppState.user.id,
      name: AppState.user.name,
      email: AppState.user.email,
      role: AppState.user.role
    }));

    if (window.showToast) {
      window.showToast(
        authMode === "signup" 
          ? `Account registered successfully! Welcome, ${AppState.user.name}.` 
          : `Welcome back, ${AppState.user.name}!`, 
        "success"
      );
    }

    if (window.navigateTo) window.navigateTo("dashboard");
  } catch(err) {
    console.error("[VLSIVerse Auth Error]:", err);
    if (window.showToast) {
      window.showToast(err.message || "Authentication failed. Please check your credentials.", "error");
    }
  }
};

window.signOutUser = async function() {
  if (AppState.user && AppState.user.id) {
    window.persistCurrentUserProgress();
  }
  try {
    if (window.VLSISupabase && typeof window.VLSISupabase.signOut === "function") {
      await window.VLSISupabase.signOut();
    }
  } catch(e) {
    console.warn("[VLSIVerse] Supabase SignOut notice:", e);
  }
  
  AppState.user = {
    id: "usr_guest",
    name: "VLSI Student",
    email: "student@vlsiverse.com",
    streak: 0,
    xp: 0,
    solved_count: 0,
    signedIn: false
  };
  localStorage.removeItem("vlsi_active_user");
  // Clean up legacy localStorage auth keys
  localStorage.removeItem("vlsi_registered_users");

  if (window.showToast) window.showToast("Signed out successfully.", "info");
  if (window.navigateTo) window.navigateTo("home");
};
