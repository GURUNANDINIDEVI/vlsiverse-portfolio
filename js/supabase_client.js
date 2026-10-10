/* VLSIVerse Supabase Authentication & Real-Time PostgreSQL User Analytics Client */

(function(window) {
  // Configurable Supabase Environment Settings
  const ENV_URL = (window.VLSIVERSE_ENV && window.VLSIVERSE_ENV.SUPABASE_URL) || localStorage.getItem("vlsi_supabase_url") || "";
  const ENV_ANON_KEY = (window.VLSIVERSE_ENV && window.VLSIVERSE_ENV.SUPABASE_ANON_KEY) || localStorage.getItem("vlsi_supabase_anon_key") || "";

  let supabaseInstance = null;

  function initSupabase() {
    if (supabaseInstance) return supabaseInstance;
    const url = (window.VLSIVERSE_ENV && window.VLSIVERSE_ENV.SUPABASE_URL) || localStorage.getItem("vlsi_supabase_url") || ENV_URL;
    const key = (window.VLSIVERSE_ENV && window.VLSIVERSE_ENV.SUPABASE_ANON_KEY) || localStorage.getItem("vlsi_supabase_anon_key") || ENV_ANON_KEY;

    if (window.supabase && typeof window.supabase.createClient === "function" && url && key && !url.includes("YOUR_SUPABASE_PROJECT_URL")) {
      try {
        supabaseInstance = window.supabase.createClient(url, key);
        console.log("[VLSIVerse] Connected to Supabase PostgreSQL Database Server.");
      } catch(e) {
        console.warn("[VLSIVerse] Supabase client initialization notice:", e);
      }
    }
    return supabaseInstance;
  }

  // Local Encapsulated Real Database Store Engine (Fallback when Supabase URL/Key is pending setup)
  const DB_PROFILES_KEY = "vlsi_db_profiles_v2";
  const DB_LOGINS_KEY = "vlsi_db_login_events_v2";

  function getLocalProfiles() {
    const raw = localStorage.getItem(DB_PROFILES_KEY);
    if (raw) {
      try { return JSON.parse(raw); } catch(e) {}
    }
    // Seed initial admin user if DB is fresh
    const initialAdmin = [{
      id: "usr_admin_nandini_001",
      name: "Guru Nandini Devi",
      email: "admin@vlsiverse.com",
      role: "admin",
      created_at: new Date(Date.now() - 10 * 86400000).toISOString(),
      last_login_at: new Date().toISOString(),
      login_count: 14,
      account_status: "active"
    }];
    localStorage.setItem(DB_PROFILES_KEY, JSON.stringify(initialAdmin));
    return initialAdmin;
  }

  function saveLocalProfiles(profiles) {
    localStorage.setItem(DB_PROFILES_KEY, JSON.stringify(profiles));
  }

  function getLocalLoginEvents() {
    const raw = localStorage.getItem(DB_LOGINS_KEY);
    if (raw) {
      try { return JSON.parse(raw); } catch(e) {}
    }
    const initialEvents = [
      { id: "evt_1", user_id: "usr_admin_nandini_001", logged_in_at: new Date().toISOString(), device_type: "Desktop" }
    ];
    localStorage.setItem(DB_LOGINS_KEY, JSON.stringify(initialEvents));
    return initialEvents;
  }

  function saveLocalLoginEvents(events) {
    localStorage.setItem(DB_LOGINS_KEY, JSON.stringify(events));
  }
  function detectDeviceType() {
    const ua = navigator.userAgent || "";
    if (/mobile/i.test(ua)) return "Mobile";
    if (/tablet|ipad/i.test(ua)) return "Tablet";
    return "Desktop";
  }

  const VLSISupabase = {
    isConfigured: function() {
      return Boolean(initSupabase());
    },

    setCredentials: function(url, anonKey) {
      localStorage.setItem("vlsi_supabase_url", url);
      localStorage.setItem("vlsi_supabase_anon_key", anonKey);
      supabaseInstance = null;
      return initSupabase();
    },

    // --- Authentication APIs ---
    signUp: async function(email, password, name) {
      const client = initSupabase();
      const cleanEmail = email.trim().toLowerCase();
      const userName = name.trim() || cleanEmail.split("@")[0];

<<<<<<< HEAD
      if (client) {
        // Real Supabase Auth SignUp
        const { data, error } = await client.auth.signUp({
          email: cleanEmail,
          password: password,
          options: { data: { name: userName } }
        });
        if (error) throw error;
        const user = data.user;

        // Upsert database profile record
        const profile = {
          id: user.id,
          name: userName,
          email: cleanEmail,
          role: "user",
          created_at: user.created_at,
          last_login_at: null,
          login_count: 0,
          account_status: "active"
        };
        await client.from("Profiles").upsert(profile);
        return { user, profile };
      } else {
        // Encapsulated Local DB Engine Registration
        const profiles = getLocalProfiles();
        let existing = profiles.find(p => p.email.toLowerCase() === cleanEmail);
        if (existing) {
          if (existing.account_status === "blocked") {
            throw new Error("Account Access Revoked: Your access has been suspended by the administrator.");
          }
          return { user: { id: existing.id, email: existing.email }, profile: existing };
        }

        const newProfile = {
          id: "usr_" + Date.now() + "_" + Math.random().toString(36).substring(2, 7),
          name: userName,
          email: cleanEmail,
          role: "user",
          created_at: new Date().toISOString(),
          last_login_at: null,
          login_count: 0,
          account_status: "active"
        };
        profiles.push(newProfile);
        saveLocalProfiles(profiles);

        return { user: { id: newProfile.id, email: newProfile.email }, profile: newProfile };
      }
=======
      if (!client) {
        throw new Error("Unable to connect to database registration server. Please check your internet connection.");
      }

      // Real Supabase Auth SignUp
      const { data, error } = await client.auth.signUp({
        email: cleanEmail,
        password: password,
        options: { data: { name: userName } }
      });
      if (error) throw error;
      const user = data.user;

      // Upsert database profile record
      const profile = {
        id: user.id,
        name: userName,
        email: cleanEmail,
        role: "user",
        created_at: user.created_at || new Date().toISOString(),
        last_login_at: null,
        login_count: 0,
        account_status: "active"
      };
      await client.from("Profiles").upsert(profile);
      return { user, profile };
>>>>>>> 36fc80c3555dba7b8309e3094200618edf91f93f
    },

    signIn: async function(email, password) {
      const client = initSupabase();
      const cleanEmail = email.trim().toLowerCase();

<<<<<<< HEAD
      if (client) {
        // Real Supabase Auth SignIn
        const { data, error } = await client.auth.signInWithPassword({
          email: cleanEmail,
          password: password
        });
        if (error) throw error;
        const user = data.user;

        // Fetch user profile from PostgreSQL
        const { data: profileData, error: profileErr } = await client.from("Profiles").select("*").eq("id", user.id).single();
        let profile = profileData;

        if (!profile) {
          profile = {
            id: user.id,
            name: user.user_metadata?.name || cleanEmail.split("@")[0],
            email: cleanEmail,
            role: "user",
            created_at: user.created_at || new Date().toISOString(),
            last_login_at: new Date().toISOString(),
            login_count: 1,
            account_status: "active"
          };
          await client.from("Profiles").insert(profile);
        } else {
          if (profile.account_status === "blocked") {
            await client.auth.signOut();
            throw new Error("Account Access Revoked: Your access has been suspended by the administrator.");
          }
          profile.last_login_at = new Date().toISOString();
          profile.login_count = (profile.login_count || 0) + 1;
          await client.from("Profiles").update({
            last_login_at: profile.last_login_at,
            login_count: profile.login_count
          }).eq("id", user.id);
        }

=======
      if (!client) {
        throw new Error("Unable to connect to database authentication server. Please check your internet connection.");
      }

      // Real Supabase Auth SignIn
      const { data, error } = await client.auth.signInWithPassword({
        email: cleanEmail,
        password: password
      });
      if (error) throw error;
      const user = data.user;

      // Fetch user profile from PostgreSQL
      const { data: profileData, error: profileErr } = await client
        .from("Profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      let profile = profileData;

      if (!profile) {
        profile = {
          id: user.id,
          name: user.user_metadata?.name || cleanEmail.split("@")[0],
          email: cleanEmail,
          role: "user",
          created_at: user.created_at || new Date().toISOString(),
          last_login_at: new Date().toISOString(),
          login_count: 1,
          account_status: "active"
        };
        await client.from("Profiles").insert(profile);
      } else {
        if (profile.account_status === "blocked") {
          await client.auth.signOut();
          throw new Error("Account Access Revoked: Your access has been suspended by the administrator.");
        }
        profile.last_login_at = new Date().toISOString();
        profile.login_count = (profile.login_count || 0) + 1;
        await client.from("Profiles").update({
          last_login_at: profile.last_login_at,
          login_count: profile.login_count
        }).eq("id", user.id);
      }

      try {
>>>>>>> 36fc80c3555dba7b8309e3094200618edf91f93f
        await client.from("login_events").insert({
          user_id: user.id,
          logged_in_at: new Date().toISOString(),
          device_type: detectDeviceType()
        });
<<<<<<< HEAD

        return { user, profile };
      } else {
        // Encapsulated Local DB Engine SignIn
        const profiles = getLocalProfiles();
        let profile = profiles.find(p => p.email.toLowerCase() === cleanEmail || p.name.toLowerCase() === cleanEmail);

        if (!profile) {
          // Auto-provision profile for first-time sign-in
          profile = {
            id: "usr_" + Date.now() + "_" + Math.random().toString(36).substring(2, 7),
            name: cleanEmail.split("@")[0],
            email: cleanEmail.includes("@") ? cleanEmail : `${cleanEmail}@vlsiverse.com`,
            role: "user",
            created_at: new Date().toISOString(),
            last_login_at: new Date().toISOString(),
            login_count: 1,
            account_status: "active"
          };
          profiles.push(profile);
        } else {
          if (profile.account_status === "blocked") {
            throw new Error("Account Access Revoked: Your access has been suspended by the administrator.");
          }
          profile.last_login_at = new Date().toISOString();
          profile.login_count = (profile.login_count || 0) + 1;
        }

        saveLocalProfiles(profiles);

        const events = getLocalLoginEvents();
        events.push({
          id: "evt_" + Date.now(),
          user_id: profile.id,
          logged_in_at: new Date().toISOString(),
          device_type: detectDeviceType()
        });
        saveLocalLoginEvents(events);

        return { user: { id: profile.id, email: profile.email }, profile };
      }
=======
      } catch (evtErr) {
        console.warn("[VLSIVerse] Login event tracking notice:", evtErr);
      }

      return { user, profile };
>>>>>>> 36fc80c3555dba7b8309e3094200618edf91f93f
    },

    signOut: async function() {
      const client = initSupabase();
      if (client) {
        await client.auth.signOut();
      }
    },

    getSession: async function() {
      const client = initSupabase();
      if (client) {
        try {
          const { data: { session } } = await client.auth.getSession();
          if (session && session.user) {
            const user = session.user;
            const { data: profile } = await client.from("Profiles").select("*").eq("id", user.id).single();
            return {
              user,
              profile: profile || {
                id: user.id,
                email: user.email,
                name: user.user_metadata?.name || user.email.split("@")[0],
                role: "user"
              }
            };
          }
        } catch(e) {
<<<<<<< HEAD
          console.warn("[VLSIVerse] Get session error:", e);
=======
          console.warn("[VLSIVerse] Get session notice:", e);
>>>>>>> 36fc80c3555dba7b8309e3094200618edf91f93f
        }
      }
      return null;
    },

    // --- Admin User Analytics & Query APIs ---
    fetchAdminAnalytics: async function() {
      const client = initSupabase();
<<<<<<< HEAD

      if (client) {
        const { data: profiles, error: pErr } = await client.from("Profiles").select("*");
        if (pErr) throw pErr;
        const { data: events, error: eErr } = await client.from("login_events").select("*");
        if (eErr) throw eErr;

        return calculateAnalytics(profiles || [], events || []);
      } else {
        const profiles = getLocalProfiles();
        const events = getLocalLoginEvents();
        return calculateAnalytics(profiles, events);
      }
=======
      if (!client) {
        return calculateAnalytics([], []);
      }

      const { data: profiles, error: pErr } = await client.from("Profiles").select("*");
      if (pErr) throw pErr;
      const { data: events, error: eErr } = await client.from("login_events").select("*");
      if (eErr) throw eErr;

      return calculateAnalytics(profiles || [], events || []);
>>>>>>> 36fc80c3555dba7b8309e3094200618edf91f93f
    },

    fetchRegisteredUsers: async function(options = {}) {
      const client = initSupabase();
      const { search = "", filter = "All", sort = "newest" } = options;

      let profiles = [];
      if (client) {
        const { data, error } = await client.from("Profiles").select("*");
        if (error) throw error;
        profiles = data || [];
<<<<<<< HEAD
      } else {
        profiles = getLocalProfiles();
=======
>>>>>>> 36fc80c3555dba7b8309e3094200618edf91f93f
      }

      // Filter
      let filtered = profiles.filter(p => {
<<<<<<< HEAD
        const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.email.toLowerCase().includes(search.toLowerCase());
=======
        const matchSearch = !search || (p.name && p.name.toLowerCase().includes(search.toLowerCase())) || (p.email && p.email.toLowerCase().includes(search.toLowerCase()));
>>>>>>> 36fc80c3555dba7b8309e3094200618edf91f93f
        if (!matchSearch) return false;

        if (filter === "Users") return p.role === "user";
        if (filter === "Admins") return p.role === "admin";
        if (filter === "Active") return p.account_status === "active";
        if (filter === "Today") {
          const now = new Date().toDateString();
          return new Date(p.created_at).toDateString() === now;
        }
        if (filter === "ThisWeek") {
          const diff = Date.now() - new Date(p.created_at).getTime();
          return diff <= 7 * 86400000;
        }
        return true;
      });

      // Sort
      filtered.sort((a, b) => {
<<<<<<< HEAD
        if (sort === "newest") return new Date(b.created_at) - new Date(a.created_at);
        if (sort === "oldest") return new Date(a.created_at) - new Date(b.created_at);
=======
        if (sort === "newest") return new Date(b.created_at || 0) - new Date(a.created_at || 0);
        if (sort === "oldest") return new Date(a.created_at || 0) - new Date(b.created_at || 0);
>>>>>>> 36fc80c3555dba7b8309e3094200618edf91f93f
        if (sort === "latest_login") return new Date(b.last_login_at || 0) - new Date(a.last_login_at || 0);
        if (sort === "most_logins") return (b.login_count || 0) - (a.login_count || 0);
        return 0;
      });

      return filtered;
    },

    updateUserProfile: async function(userId, updates) {
      const client = initSupabase();
<<<<<<< HEAD

      if (client) {
        const { data, error } = await client.from("Profiles").update(updates).eq("id", userId).select();
        if (error) throw error;
        return data;
      } else {
        const profiles = getLocalProfiles();
        const user = profiles.find(p => p.id === userId);
        if (user) {
          Object.assign(user, updates);
          saveLocalProfiles(profiles);
        }
        return user;
      }
=======
      if (!client) throw new Error("Supabase client not initialized.");

      const { data, error } = await client.from("Profiles").update(updates).eq("id", userId).select();
      if (error) throw error;
      return data;
>>>>>>> 36fc80c3555dba7b8309e3094200618edf91f93f
    }
  };

  // Helper function to calculate accurate User Analytics metrics
  function calculateAnalytics(profiles, events) {
    const now = new Date();
    const todayStr = now.toDateString();
    const oneWeekAgo = new Date(now.getTime() - 7 * 86400000);
    const oneMonthAgo = new Date(now.getTime() - 30 * 86400000);

    const totalUsers = profiles.length;
    const newToday = profiles.filter(p => new Date(p.created_at).toDateString() === todayStr).length;
    const newThisWeek = profiles.filter(p => new Date(p.created_at) >= oneWeekAgo).length;
    const newThisMonth = profiles.filter(p => new Date(p.created_at) >= oneMonthAgo).length;

    const totalLogins = events.length;
    const uniqueLoggedInUsers = new Set(events.map(e => e.user_id)).size;

    const activeToday = new Set(
      events.filter(e => new Date(e.logged_in_at).toDateString() === todayStr).map(e => e.user_id)
    ).size;

    const activeThisWeek = new Set(
      events.filter(e => new Date(e.logged_in_at) >= oneWeekAgo).map(e => e.user_id)
    ).size;

    // Registrations over 7 days chart data generator
    const chartLabels = [];
    const chartCounts = [];

    for (let i = 6; i >= 0; i--) {
      const d = new Date(now.getTime() - i * 86400000);
      const dStr = d.toDateString();
      const count = profiles.filter(p => new Date(p.created_at).toDateString() === dStr).length;
      const label = d.toLocaleDateString("en-US", { weekday: "short" });
      chartLabels.push(label);
      chartCounts.push(count);
    }

    return {
      totalUsers,
      newToday,
      newThisWeek,
      newThisMonth,
      totalLogins,
      uniqueLoggedInUsers,
      activeToday,
      activeThisWeek,
      chartLabels,
      chartCounts
    };
  }

  window.VLSISupabase = VLSISupabase;
<<<<<<< HEAD
})(window);
=======
})(window);
>>>>>>> 36fc80c3555dba7b8309e3094200618edf91f93f
