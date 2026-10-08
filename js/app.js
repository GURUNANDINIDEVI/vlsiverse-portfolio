/* VLSIVerse Core Application Router and Global Controller */

const AppState = {
  user: {
    id: "usr_guest",
    name: "VLSI Student",
    email: "student@vlsiverse.com",
    streak: 0,
    xp: 0,
    solved_count: 0,
    progress: {},
    certificates: [],
    bookmarks: [],
    completed_challenges: [],
    activityLog: {} 
  },
  currentView: "home",
  notifications: [
    { id: 1, text: "Welcome to VLSIVerse! Begin your silicon learning journey.", read: false }
  ]
};

// Route mapper (Tools and Internships removed)
const routes = {
  "home": "renderHome",
  "studio": "renderStudio",
  "digital-practice": "renderDigitalPractice",
  "learn": "renderLearn",
  "practice": "renderPractice",
  "protocols": "renderProtocols",
  "projects": "renderProjects",
  "asic": "renderAsic",
  "interviews": "renderInterviews",
  "dashboard": "renderDashboard",
  "admin": "renderAdmin",
  "auth": "renderAuth"
};

// Toast notification helper
function showToast(message, type = "success") {
  const container = document.getElementById("toast-container");
  if (!container) return;
  
  const toast = document.createElement("div");
  toast.className = `flex items-center gap-3 px-4 py-3 rounded-lg border backdrop-blur-md transition-all duration-300 transform translate-y-5 opacity-0 ${
    type === "success" 
      ? "bg-emerald-950/90 border-emerald-500/30 text-emerald-400" 
      : "bg-red-950/90 border-red-500/30 text-red-400"
  }`;
  
  toast.innerHTML = `
    <span class="w-2 h-2 rounded-full ${type === 'success' ? 'bg-emerald-400' : 'bg-red-400'}"></span>
    <p class="text-xs font-semibold">${message}</p>
  `;
  
  container.appendChild(toast);
  setTimeout(() => {
    toast.classList.remove("translate-y-5", "opacity-0");
  }, 10);

  setTimeout(() => {
    toast.classList.add("translate-y-5", "opacity-0");
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

// Router dispatch with strict Admin Authorization Guard
function navigateTo(viewId) {
  if (viewId === "admin" && !isUserAdmin()) {
    showToast("Access Denied: Admin authorization required.", "error");
    viewId = AppState.user.signedIn ? "dashboard" : "auth";
  }
  AppState.currentView = viewId;
  window.location.hash = viewId;
  renderApp();
}

window.addEventListener("hashchange", () => {
  let hash = window.location.hash.substring(1) || "home";
  if (hash === "admin" && !isUserAdmin()) {
    showToast("Access Denied: Admin authorization required.", "error");
    hash = AppState.user.signedIn ? "dashboard" : "auth";
  }
  if (routes[hash]) {
    AppState.currentView = hash;
    renderApp();
  }
});

// Build standard layout shell (Clean styling synced to screenshot)
function renderApp() {
  const root = document.getElementById("app-root");
  if (!root) return;

  const viewName = AppState.currentView;
  
  // Render layout frame (Excluding Tools and Internships, adding floating AI widget hooks)
  root.innerHTML = `
    <div class="min-h-screen flex flex-col bg-[#05070f]/70 text-[#f1f5f9] grid-bg">
      <!-- Header -->
      <header class="sticky top-0 z-40 w-full glass-panel border-b border-white/5 backdrop-blur-md px-6 py-4 flex items-center justify-between">
        <div class="flex items-center gap-3 cursor-pointer" onclick="navigateTo('home')">
          <div class="w-9 h-9 rounded-lg bg-gradient-to-tr from-blue-600 to-cyan-400 flex items-center justify-center glow-border-blue">
            <i class="fa-solid fa-microchip text-white text-lg"></i>
          </div>
          <span class="font-heading font-extrabold text-xl tracking-tight">
            <span class="text-white">VLSI</span><span class="text-blue-500">Verse</span>
          </span>
        </div>
        
        <!-- Navigation Menu -->
        <nav class="hidden lg:flex items-center gap-6">
          ${getNavHTML()}
        </nav>
        
        <!-- Sign In and User Streak controls -->
        <div class="flex items-center gap-3">
          <button onclick="navigateTo('dashboard')" aria-label="View streak and user dashboard" class="hidden md:flex items-center gap-1.5 border border-blue-500/20 bg-blue-950/20 rounded-full px-3 py-1 text-xs hover:border-blue-400 transition-colors">
            <span class="text-amber-500">🔥</span>
            <span class="font-bold text-blue-300 font-heading" id="streak-counter-header">${AppState.user.streak || 0} Streak</span>
          </button>
          
          ${AppState.user.signedIn ? `
            <div class="flex items-center gap-2">
              <button onclick="navigateTo('dashboard')" aria-label="View user profile" class="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-white/10 bg-slate-900/60 hover:bg-slate-800 text-xs transition-all hover:border-blue-500/30">
                <div class="w-6 h-6 rounded-full bg-gradient-to-tr from-blue-600 to-cyan-400 flex items-center justify-center text-[10px] font-bold text-white uppercase shadow">
                  ${(AppState.user.name || "U").charAt(0)}
                </div>
                <span class="font-semibold text-white text-xs hidden sm:inline">${AppState.user.name || "Explorer"}</span>
              </button>
              <button onclick="signOutUser()" title="Sign Out" aria-label="Sign out of account" class="p-2 text-gray-400 hover:text-red-400 transition-colors rounded-lg hover:bg-white/5">
                <i class="fa-solid fa-right-from-bracket text-xs"></i>
              </button>
            </div>
          ` : `
            <button onclick="navigateTo('auth')" aria-label="Sign in to platform" class="px-5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-heading font-semibold text-xs tracking-wider transition-all shadow-lg shadow-blue-500/20 hover:scale-105 active:scale-95">
              Sign In
            </button>
          `}
        </div>
      </header>

      <!-- Mobile Navigation Drawer trigger -->
      <div class="lg:hidden bg-slate-900 border-b border-white/5 px-6 py-2 flex items-center justify-between">
        <span class="text-xs text-gray-400 font-heading">Navigation Menu</span>
        <button onclick="toggleMobileMenu()" aria-label="Toggle mobile navigation menu" class="text-blue-400 text-xs font-bold flex items-center gap-1">
          <i class="fa-solid fa-bars"></i> Menu
        </button>
      </div>
      
      <!-- Mobile Menu Panel -->
      <div id="mobile-menu" class="hidden lg:hidden glass-panel border-b border-white/10 p-4 flex flex-col gap-2">
        ${getMobileNavHTML()}
      </div>

      <!-- Main Layout Body -->
      <main class="flex-grow flex flex-col w-full relative">
        <div id="view-container" class="flex-grow w-full"></div>
      </main>

      <!-- Floating AI Widget (Right Bottom Overlay) -->
      ${renderFloatingAiWidget()}

      <!-- Footer -->
      <footer class="border-t border-white/5 bg-slate-950/80 px-8 py-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-gray-500">
        <p>&copy; 2026 VLSIVerse Platform. Created by Guru Nandini Devi. Semiconductor &amp; Hardware Practice Engine.</p>
        <div class="flex items-center gap-6 font-medium">
          <a href="https://github.com/GURUNANDINIDEVI/vlsiverse-portfolio" target="_blank" rel="noopener noreferrer" class="hover:text-blue-400 transition-colors" aria-label="Visit GitHub repository">GitHub</a>
          <a href="https://linkedin.com/in/gurunandinidevi" target="_blank" rel="noopener noreferrer" class="hover:text-blue-400 transition-colors" aria-label="Visit LinkedIn profile">LinkedIn</a>
          <a href="mailto:nandinidevitekumudi@gmail.com" class="hover:text-blue-400 transition-colors" aria-label="Send email contact">Contact</a>
        </div>
      </footer>
    </div>
  `;

  // Render active view
  const viewFunc = routes[viewName];
  if (viewFunc && typeof window[viewFunc] === "function") {
    try {
      window[viewFunc]();
      const viewContainer = document.getElementById("view-container");
      if (viewContainer) {
        viewContainer.classList.remove("animate-fade-in-up");
        void viewContainer.offsetWidth;
        viewContainer.classList.add("animate-fade-in-up");
      }
    } catch(err) {
      console.error(`[VLSIVerse Error rendering view '${viewName}']:`, err);
      window.renderSectionError(viewName);
    }
  } else {
    window.render404View(viewName);
  }
}

window.render404View = function(requestedRoute) {
  const container = document.getElementById("view-container");
  if (!container) return;

  container.innerHTML = `
    <div class="max-w-4xl mx-auto px-6 py-20 text-center font-sans animate-fade-in-up">
      <div class="glass-panel p-10 rounded-3xl border-white/10 flex flex-col items-center gap-6 shadow-2xl">
        <div class="w-20 h-20 rounded-full bg-red-950/40 border border-red-500/30 flex items-center justify-center text-red-400 text-3xl font-mono">
          <i class="fa-solid fa-triangle-exclamation"></i>
        </div>
        <div>
          <span class="text-xs text-red-400 font-mono font-bold uppercase tracking-widest">HTTP 404 &bull; Routing Error</span>
          <h1 class="text-3xl font-heading font-extrabold text-white mt-1">404 — Page Not Found</h1>
          <p class="text-sm text-gray-400 mt-2 max-w-md mx-auto">
            The requested VLSIVerse route <code class="bg-slate-900 px-2 py-0.5 rounded text-red-300 font-mono">#${window.escapeHtml(requestedRoute || "unknown")}</code> does not exist or is no longer available.
          </p>
        </div>
        <div class="flex flex-wrap items-center justify-center gap-4 mt-2">
          <button onclick="navigateTo('home')" class="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-xs font-bold text-white shadow-lg shadow-blue-500/20 flex items-center gap-2" aria-label="Return to home page">
            <i class="fa-solid fa-house text-xs"></i> Return to Home
          </button>
          <button onclick="navigateTo('dashboard')" class="px-5 py-2.5 rounded-xl bg-slate-900 border border-white/10 hover:border-white/20 text-xs font-bold text-gray-300 flex items-center gap-2" aria-label="Go to user dashboard">
            <i class="fa-solid fa-gauge-high text-xs"></i> Go to Dashboard
          </button>
        </div>
      </div>
    </div>
  `;
};

window.renderSectionError = function(sectionName) {
  const container = document.getElementById("view-container");
  if (!container) return;

  container.innerHTML = `
    <div class="max-w-4xl mx-auto px-6 py-20 text-center font-sans animate-fade-in-up">
      <div class="glass-panel p-10 rounded-3xl border-red-500/20 flex flex-col items-center gap-6 shadow-2xl">
        <div class="w-16 h-16 rounded-full bg-red-950/50 border border-red-500/30 flex items-center justify-center text-red-400 text-2xl font-mono">
          <i class="fa-solid fa-circle-exclamation"></i>
        </div>
        <div>
          <span class="text-xs text-red-400 font-mono font-bold uppercase tracking-widest">Section Error &bull; ${window.escapeHtml(sectionName)}</span>
          <h2 class="text-2xl font-heading font-extrabold text-white mt-1">Something went wrong while loading this section</h2>
          <p class="text-xs text-gray-400 mt-2 max-w-md mx-auto">
            An unexpected error occurred. Other parts of VLSIVerse remain fully functional.
          </p>
        </div>
        <div class="flex items-center gap-3">
          <button onclick="navigateTo('${sectionName}')" class="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-xs font-bold text-white shadow-lg flex items-center gap-2" aria-label="Try loading section again">
            <i class="fa-solid fa-rotate-right text-xs"></i> Try Again
          </button>
          <button onclick="navigateTo('home')" class="px-5 py-2.5 rounded-xl bg-slate-900 border border-white/10 hover:border-white/20 text-xs font-bold text-gray-300 flex items-center gap-2" aria-label="Return home">
            Return Home
          </button>
        </div>
      </div>
    </div>
  `;
};

// Unified Date-Seeded Daily Challenge Helper (Synchronized across Home, Dashboard, Practice)
function getDailyChallenge() {
  const challenges = (typeof VLSIData !== 'undefined' && VLSIData.challenges) ? VLSIData.challenges : [];
  if (challenges.length === 0) {
    return {
      challenge: { title: "Traffic Light Controller", topic: "FSM Design", difficulty: "Medium", description: "Design a traffic light controller FSM with states for Red, Green, and Yellow lights." },
      index: 0,
      diffBadgeClass: "bg-amber-950/40 text-amber-400 border-amber-500/20",
      pointsVal: "+25 pts"
    };
  }

  const today = new Date();
  const dateSeed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
  const index = dateSeed % challenges.length;
  const challenge = challenges[index];

  let diffBadgeClass = "bg-amber-950/40 text-amber-400 border-amber-500/20";
  let pointsVal = "+25 pts";
  if (challenge.difficulty === "Easy") {
    diffBadgeClass = "bg-emerald-950/40 text-emerald-400 border-emerald-500/20";
    pointsVal = "+10 pts";
  } else if (challenge.difficulty === "Hard") {
    diffBadgeClass = "bg-rose-950/40 text-rose-400 border-rose-500/20";
    pointsVal = "+50 pts";
  }

  return { challenge, index, diffBadgeClass, pointsVal };
}

// Admin Verification Helper (Strict role === "admin" authorization)
function isUserAdmin() {
  if (!AppState.user || !AppState.user.signedIn) return false;
  return AppState.user.role === "admin";
}

// Centralized streak increment logic (ONLY called when a user solves a problem!)
function recordProblemSolvedStreak() {
  if (!AppState.user || !AppState.user.signedIn) return;
  
  const todayStr = new Date().toISOString().split('T')[0];
  if (!AppState.user.activityLog) AppState.user.activityLog = {};

  const solvedTodayAlready = AppState.user.activityLog[todayStr] && AppState.user.activityLog[todayStr] > 0;
  
  // Record activity count for today
  AppState.user.activityLog[todayStr] = (AppState.user.activityLog[todayStr] || 0) + 1;

  if (!solvedTodayAlready) {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    if (AppState.user.activityLog[yesterdayStr]) {
      AppState.user.streak = (AppState.user.streak || 0) + 1;
    } else {
      AppState.user.streak = 1;
    }
  }

  // Update DOM header streak counter
  const headerStreak = document.getElementById("streak-counter-header");
  if (headerStreak) {
    headerStreak.textContent = `${AppState.user.streak || 0} Streak`;
  }

  // Save updated user progress
  if (typeof persistCurrentUserProgress === "function") {
    persistCurrentUserProgress();
  }
}

// Restore active logged in user session on startup (Supabase Auth + Cache)
(async function initUserSession() {
  const activeUser = localStorage.getItem("vlsi_active_user");
  if (activeUser) {
    try {
      const parsed = JSON.parse(activeUser);
      if (parsed && parsed.email) {
        AppState.user.signedIn = true;
        AppState.user.id = parsed.id || AppState.user.id;
        AppState.user.name = parsed.name || "Explorer";
        AppState.user.email = parsed.email;
        AppState.user.role = parsed.role || "user";
        AppState.user.xp = parsed.xp || 0;
        AppState.user.solved_count = parsed.solved_count || 0;
      }
    } catch(e) {}
  }

  // Restore live Supabase session if available
  if (window.VLSISupabase && typeof window.VLSISupabase.getSession === "function") {
    try {
      const sessData = await window.VLSISupabase.getSession();
      if (sessData && sessData.user) {
        const p = sessData.profile || {};
        AppState.user.signedIn = true;
        AppState.user.id = p.id || sessData.user.id;
        AppState.user.email = p.email || sessData.user.email;
        AppState.user.name = p.name || sessData.user.user_metadata?.name || AppState.user.email.split("@")[0];
        AppState.user.role = p.role || "user";
        
        if (typeof window.loadUserDataState === "function") {
          window.loadUserDataState(AppState.user);
        }

        localStorage.setItem("vlsi_active_user", JSON.stringify({
          id: AppState.user.id,
          name: AppState.user.name,
          email: AppState.user.email,
          role: AppState.user.role
        }));
      }
    } catch(err) {
      console.warn("[VLSIVerse] Supabase session sync notice:", err);
    }
  }
})();

function getNavHTML() {
  const items = [
    { id: "home", label: "Home" },
    { id: "studio", label: "VLSI Studio" },
    { id: "digital-practice", label: "Digital Practice" },
    { id: "practice", label: "Practice" },
    { id: "learn", label: "Learn" },
    { id: "protocols", label: "Protocols" },
    { id: "projects", label: "Projects" },
    { id: "interviews", label: "Interview Prep" }
  ];

  if (isUserAdmin()) {
    items.push({ id: "admin", label: "⚡ Admin Panel" });
  }

  return items.map(item => {
    const isActive = AppState.currentView === item.id;
    const activeClass = isActive 
      ? "bg-[#0b0f19] border border-blue-500/20 text-white font-bold" 
      : "border-transparent text-gray-400 hover:text-white hover:bg-white/5";
    return `
      <button onclick="navigateTo('${item.id}')" class="px-3 py-1.5 rounded-lg border text-xs font-semibold tracking-wide transition-all ${activeClass}">
        ${item.label}
      </button>
    `;
  }).join("");
}

function getMobileNavHTML() {
  const items = [
    { id: "home", label: "Home" },
    { id: "studio", label: "VLSI Studio" },
    { id: "digital-practice", label: "Digital Practice" },
    { id: "practice", label: "Practice" },
    { id: "learn", label: "Learn" },
    { id: "protocols", label: "Protocols" },
    { id: "projects", label: "Projects" },
    { id: "interviews", label: "Interview Prep" },
    { id: "dashboard", label: "User Dashboard" }
  ];

  if (isUserAdmin()) {
    items.push({ id: "admin", label: "Admin Console" });
  }

  return items.map(item => `
    <button onclick="navigateTo('${item.id}'); toggleMobileMenu();" class="text-left w-full px-4 py-2 hover:bg-slate-800 text-xs rounded ${AppState.currentView === item.id ? 'text-blue-400 font-bold bg-blue-950/20' : 'text-gray-300'}">
      ${item.label}
    </button>
  `).join("");
}

function toggleMobileMenu() {
  const menu = document.getElementById("mobile-menu");
  menu.classList.toggle("hidden");
}

function simulateSignIn() {
  showToast("Mock Authentication Successful! Welcome explorer.", "success");
  navigateTo("dashboard");
}

// --- Floating AI Chat Overlay logic ---
let floatingChatHistory = [
  { sender: "ai", text: "Hello! I am your VLSIVerse AI companion. Ask me anything about Verilog logic gates, FSM design patterns, setup-hold slack timing violations, or system buses." }
];

function renderFloatingAiWidget() {
  return `
    <div class="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3 pointer-events-auto">
      <!-- Chat Window Overlay (Hidden by Default) -->
      <div id="ai-chat-overlay" class="hidden w-[360px] sm:w-[400px] h-[500px] glass-panel border-white/10 rounded-3xl flex flex-col overflow-hidden ai-chat-window shadow-2xl backdrop-blur-xl">
        <!-- Overlay Header -->
        <div class="bg-slate-950 px-4 py-3.5 border-b border-white/10 flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md">
              <i class="fa-solid fa-robot text-base animate-pulse"></i>
            </div>
            <div>
              <strong class="text-white text-xs block font-heading font-extrabold flex items-center gap-1.5">
                VLSIVerse AI Companion <span class="w-2 h-2 rounded-full bg-emerald-400"></span>
              </strong>
              <span class="text-[9px] text-cyan-300 font-mono">Friendly Assistant • Ask me anything!</span>
            </div>
          </div>
          <button onclick="toggleAiOverlay()" class="w-7 h-7 rounded-lg bg-slate-900 text-gray-400 hover:text-white flex items-center justify-center transition-colors">
            <i class="fa-solid fa-xmark text-xs"></i>
          </button>
        </div>

        <!-- Messages Thread -->
        <div id="ai-overlay-messages" class="flex-grow p-4 overflow-y-auto flex flex-col gap-3 font-sans">
          ${floatingChatHistory.map(msg => renderOverlayMessage(msg)).join("")}
        </div>

        <!-- Recipe Quick Chips -->
        <div class="px-4 py-2 border-t border-white/5 bg-slate-950/40 flex gap-2 overflow-x-auto whitespace-nowrap scrollbar-none font-mono text-[9px]">
          <button onclick="triggerOverlayRecipe('Hello! Tell me about yourself')" class="px-3 py-1 rounded-full border border-blue-500/20 bg-blue-950/40 text-blue-300 hover:bg-blue-900/60 transition-colors">👋 Say Hi</button>
          <button onclick="triggerOverlayRecipe('Generate D Flip-Flop code')" class="px-3 py-1 rounded-full border border-white/5 bg-slate-900 text-gray-300 hover:text-white transition-colors">DFF Code</button>
          <button onclick="triggerOverlayRecipe('Explain Setup vs Hold time')" class="px-3 py-1 rounded-full border border-white/5 bg-slate-900 text-gray-300 hover:text-white transition-colors">Setup/Hold</button>
          <button onclick="triggerOverlayRecipe('Give me career advice for VLSI')" class="px-3 py-1 rounded-full border border-white/5 bg-slate-900 text-gray-300 hover:text-white transition-colors">Career Advice</button>
        </div>

        <!-- Chat Input -->
        <div class="p-3 bg-slate-950/90 border-t border-white/10 flex gap-2">
          <input type="text" id="ai-overlay-input" onkeydown="handleOverlayInputKey(event)" placeholder="Ask anything! (VLSI, career, coding, or just chat)..." class="flex-grow bg-slate-900 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-blue-500 transition-colors">
          <button onclick="sendOverlayMessage()" class="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 rounded-xl text-xs font-bold text-white shadow-lg shadow-blue-500/20 transition-all hover:scale-105 active:scale-95 flex items-center gap-1">
            Send <i class="fa-solid fa-paper-plane text-[10px]"></i>
          </button>
        </div>
      </div>

      <!-- Floating Trigger Button (BIGGER & PROMINENT) -->
      <button onclick="toggleAiOverlay()" title="Open AI Assistant" class="w-16 h-16 rounded-2xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 flex items-center justify-center text-white ai-chat-bubble glow-border-blue relative shadow-2xl hover:scale-110 active:scale-95 transition-all group">
        <i class="fa-solid fa-robot text-2xl text-white group-hover:rotate-12 transition-transform"></i>
        <span class="absolute -top-1 -right-1 w-4 h-4 bg-emerald-400 border-2 border-slate-950 rounded-full flex items-center justify-center">
          <span class="w-2 h-2 bg-white rounded-full animate-ping"></span>
        </span>
      </button>
    </div>
  `;
}

function renderOverlayMessage(msg) {
  const isAi = msg.sender === "ai";
  return `
    <div class="flex ${isAi ? 'justify-start' : 'justify-end'}">
      <div class="max-w-[88%] p-3 rounded-2xl text-xs border ${
        isAi 
          ? 'bg-slate-900/90 border-white/10 text-gray-200 rounded-tl-none shadow-md' 
          : 'bg-gradient-to-r from-blue-600 to-indigo-600 border-blue-400/30 text-white rounded-tr-none shadow-md'
      }">
        <span class="font-heading block mb-1 text-[9px] uppercase tracking-wider font-bold ${isAi ? 'text-cyan-400' : 'text-blue-200'}">
          ${isAi ? '🤖 AI Companion' : '👤 You'}
        </span>
        <p class="leading-relaxed whitespace-pre-wrap">${msg.text}</p>
      </div>
    </div>
  `;
}

window.toggleAiOverlay = function() {
  const w = document.getElementById("ai-chat-overlay");
  w?.classList.toggle("hidden");
  setTimeout(scrollOverlayChat, 50);
};

window.handleOverlayInputKey = function(e) {
  if (e.key === "Enter") {
    sendOverlayMessage();
  }
};

window.sendOverlayMessage = function() {
  const el = document.getElementById("ai-overlay-input");
  const val = el?.value.trim();
  if (!val) return;

  floatingChatHistory.push({ sender: "user", text: val });
  el.value = "";
  refreshOverlayChat();

  // Thinking State
  setTimeout(() => {
    floatingChatHistory.push({ sender: "ai", text: "Thinking..." });
    refreshOverlayChat();

    setTimeout(() => {
      floatingChatHistory.pop();
      const ans = getAiCoreAnswer(val);
      floatingChatHistory.push({ sender: "ai", text: ans });
      refreshOverlayChat();
    }, 600);
  }, 300);
};

window.triggerOverlayRecipe = function(promptText) {
  const input = document.getElementById("ai-overlay-input");
  if (input) {
    input.value = promptText;
    input.focus();
    sendOverlayMessage();
  }
};

function refreshOverlayChat() {
  const box = document.getElementById("ai-overlay-messages");
  if (box) {
    box.innerHTML = floatingChatHistory.map(msg => renderOverlayMessage(msg)).join("");
  }
  scrollOverlayChat();
}

function scrollOverlayChat() {
  const box = document.getElementById("ai-overlay-messages");
  if (box) {
    box.scrollTop = box.scrollHeight;
  }
}

// Global Warm & Friendly AI Assistant Response Engine (Answers ANY question)
function getAiCoreAnswer(query) {
  const q = query.toLowerCase();

  // Greetings & Conversational
  if (q.includes("hi") || q.includes("hello") || q.includes("hey") || q.includes("greetings")) {
    return `Hello there! 😊 It's wonderful to chat with you! I'm your friendly VLSIVerse AI companion. How can I help you today? Feel free to ask me anything — whether it's silicon concepts, Verilog code, career guidance, or just a general question!`;
  }
  if (q.includes("how are you") || q.includes("how r u")) {
    return `I'm doing fantastic, thank you for asking! 🚀 Ready and excited to help you learn, solve problems, or answer any questions on your mind. How is your day going?`;
  }
  if (q.includes("who created you") || q.includes("who made you") || q.includes("creator")) {
    return `I was created by **Nandini** as part of the VLSIVerse platform! 🌟 Designed to be your friendly learning partner for silicon design, RTL coding, and engineering support.`;
  }
  if (q.includes("thank")) {
    return `You're super welcome! 🤗 Always happy to help. Let me know if there's anything else you'd like to explore or chat about!`;
  }
  if (q.includes("career") || q.includes("job") || q.includes("interview")) {
    return `Great question! 💼 For a successful career in VLSI & Semiconductor Engineering:
1. **Master Fundamentals**: Focus on Digital Electronics, Two's Complement, Setup/Hold timing, and FSM design.
2. **Hands-on Verilog**: Practice writing synthesizable Verilog code and building testbenches.
3. **Protocols**: Learn bus protocols like AXI, APB, and SPI.
4. **Projects**: Build complete RTL projects (like FIFO, UART, or Traffic Controller) to highlight on your resume!

Check out our **Interview Prep** and **Projects** tabs for complete practice guidance!`;
  }

  // Technical & VLSI
  if (q.includes("d flip-flop") || q.includes("dff")) {
    return `Here is a synthesizable Verilog D Flip-Flop with active-low async reset:

\`\`\`verilog
module dff (
    input clk, rst_n, d,
    output reg q
);
    always @(posedge clk or negedge rst_n) begin
        if (!rst_n) q <= 1'b0;
        else        q <= d;
    end
endmodule
\`\`\`

D Flip-Flops store 1 bit of data on the rising edge of the clock signal! ⚡`;
  }
  if (q.includes("setup vs hold") || q.includes("setup/hold") || q.includes("setup") || q.includes("hold")) {
    return `Here is a friendly breakdown of Setup vs Hold timing bounds:

⏱️ **Setup Time**: The minimum duration input data must remain stable BEFORE the active clock edge. (If violated, lower the clock frequency or optimize logic delay!).

🔒 **Hold Time**: The minimum duration input data must remain stable AFTER the active clock edge. (If violated, add delay buffers — lowering clock frequency won't fix hold violations!).`;
  }
  if (q.includes("apb") || q.includes("axi") || q.includes("bus")) {
    return `AMBA Bus Protocols Overview:
- **APB (Advanced Peripheral Bus)**: Low-power, unpipelined bus for simple peripherals (2-phase transfers: Setup & Access).
- **AXI (Advanced eXtensible Interface)**: High-performance, pipelined bus with 5 independent channels for simultaneous read/write operations!`;
  }

  // General fallback - Friendly & helpful answer to ANY question
  return `That's an interesting question! 😊 Here is my perspective:

Regarding "${query}": I'm here to support you in any way I can! If you're exploring engineering topics, RTL coding, or just need general guidance, feel free to ask me to write code, explain concepts, or break down complex ideas step-by-step. 

Is there a specific topic or detail you'd like to dive into next?`;
}

// Deterministic Application Initialization & Routing Bootstrap
function initApp() {
  if (typeof window.loadAdminPersistedData === "function") {
    window.loadAdminPersistedData();
  }

  const storedUser = localStorage.getItem("vlsi_active_user");
  if (storedUser) {
    try {
      const activeData = JSON.parse(storedUser);
      if (activeData && (activeData.email || activeData.id)) {
        const registered = typeof window.getRegisteredUsers === "function" ? window.getRegisteredUsers() : [];
        const found = registered.find(u => (u.id && u.id === activeData.id) || (u.email && u.email.toLowerCase() === (activeData.email || "").toLowerCase()));
        if (found) {
          AppState.user.id = found.id;
          AppState.user.name = found.username;
          AppState.user.email = found.email;
          AppState.user.role = found.role || "user";
          AppState.user.signedIn = true;
          if (typeof window.loadUserDataState === "function") {
            window.loadUserDataState(AppState.user);
          }
        }
      }
    } catch(e) {
      console.error("Error restoring active user session:", e);
    }
  }

  const hash = window.location.hash.substring(1) || "home";
  AppState.currentView = routes[hash] ? hash : "home";
  renderApp();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initApp);
} else {
  initApp();
}

// Fallback safety timeout (1.5 seconds) to ensure the boot screen never hangs
setTimeout(() => {
  const root = document.getElementById("app-root");
  if (root && root.innerHTML.includes("BOOTING VLSIVERSE ENGINE")) {
    initApp();
  }
}, 1500);

// Global Helper Functions shared across views
window.escapeHtml = function(str) {
  if (!str) return "";
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
};

window.escapeJs = function(str) {
  if (!str) return "";
  return str.replace(/\\/g, "\\\\").replace(/'/g, "\\'").replace(/"/g, '\\"').replace(/\n/g, "\\n").replace(/\r/g, "\\r");
};

window.copyToClipboard = function(content) {
  navigator.clipboard.writeText(content).then(() => {
    showToast("Code copied to clipboard!", "success");
  }).catch(() => {
    showToast("Failed to copy code.", "error");
  });
};

/* Centralized Admin Data & Announcement Persistence Layer */
window.loadAdminPersistedData = function() {
  const adminKey = "vlsi_admin_data";
  try {
    const raw = localStorage.getItem(adminKey);
    if (raw && typeof VLSIData !== "undefined") {
      const data = JSON.parse(raw);
      if (data.challenges && Array.isArray(data.challenges)) {
        data.challenges.forEach(adminCh => {
          const idx = VLSIData.challenges.findIndex(c => c.id === adminCh.id);
          if (idx >= 0) {
            VLSIData.challenges[idx] = adminCh;
          } else {
            VLSIData.challenges.push(adminCh);
          }
        });
      }
      if (data.announcements && Array.isArray(data.announcements)) {
        VLSIData.announcements = data.announcements;
      }
    }
  } catch(e) {
    console.error("Error loading admin persisted data:", e);
  }
};

window.saveAdminPersistedData = function() {
  const adminKey = "vlsi_admin_data";
  try {
    if (typeof VLSIData === "undefined") return;
    const adminChallenges = VLSIData.challenges.filter(c => c.isAdminCreated || c.isEditedByAdmin);
    const adminAnnouncements = VLSIData.announcements || [];
    const payload = {
      challenges: adminChallenges,
      announcements: adminAnnouncements,
      updatedAt: new Date().toISOString()
    };
    localStorage.setItem(adminKey, JSON.stringify(payload));
  } catch(e) {
    console.error("Error saving admin persisted data:", e);
  }
};

window.addAdminAnnouncement = function(title, message, priority = "normal") {
  if (!title || !message) return false;
  if (typeof VLSIData === "undefined") return false;
  if (!VLSIData.announcements) VLSIData.announcements = [];
  
  const newAnn = {
    id: "ann_" + Date.now(),
    title: title.trim(),
    message: message.trim(),
    createdAt: new Date().toLocaleString(),
    createdBy: AppState.user?.name || "Administrator",
    priority: priority
  };
  
  VLSIData.announcements.unshift(newAnn);
  window.saveAdminPersistedData();
  return true;
};

window.deleteAdminAnnouncement = function(annId) {
  if (typeof VLSIData === "undefined" || !VLSIData.announcements) return false;
  VLSIData.announcements = VLSIData.announcements.filter(a => a.id !== annId);
  window.saveAdminPersistedData();
  return true;
};

/* Centralized Production Global Error & Keyboard Modal Listener */
window.addEventListener("keydown", function(e) {
  if (e.key === "Escape") {
    const authModal = document.getElementById("auth-modal");
    if (authModal && !authModal.classList.contains("hidden")) {
      authModal.classList.add("hidden");
    }
    if (typeof handbookState !== "undefined" && handbookState.isOpen) {
      if (typeof closeHandbookModal === "function") closeHandbookModal();
    }
  }
});

window.addEventListener("error", function(event) {
  console.error("[VLSIVerse Global Error]", event.error || event.message);
  if (typeof showToast === "function") {
    showToast("Something went wrong while loading this section. Please try again.", "error");
  }
});

window.addEventListener("unhandledrejection", function(event) {
  console.error("[VLSIVerse Unhandled Promise Rejection]", event.reason);
});
