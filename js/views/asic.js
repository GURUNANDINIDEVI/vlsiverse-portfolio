/* ASIC Flow View - Interactive Synthesis Timeline with Playback Simulation */

const asicPhases = [
  {
    id: "spec",
    name: "Specification",
    desc: "Define microarchitectural block diagrams, timing limits, performance budgets, and power boundaries.",
    tools: "SystemC, Word, Markdown, Visio",
    outputs: "Design Specification Document (.pdf)",
    details: "Establish design rules, memory size limits, bus width, clock frequency requirements, and dynamic/static power limits before writing code."
  },
  {
    id: "rtl",
    name: "RTL Design",
    desc: "Implementing logic gate behavior in synthesizable Hardware Description Languages.",
    tools: "SpyGlass Lint, VS Code, Vim",
    outputs: "RTL source files (.v, .sv)",
    details: "Translate microarchitectural specifications into synthesizable blocks. Code must follow strict guidelines to avoid latch inferences or clock race conditions."
  },
  {
    id: "sim",
    name: "Verification & Sim",
    desc: "Testing RTL designs against spec requirements using testbenches.",
    tools: "VCS, ModelSim, Questa, Xcelium",
    outputs: "Test plans, Coverage metrics, VCD wave logs",
    details: "Run functional assertions and randomized transactions in dynamic UVM testbenches to verify functional block boundaries and coverage goals."
  },
  {
    id: "synth",
    name: "Synthesis",
    desc: "Mapping synthesizable RTL equations into logical gate-level netlists.",
    tools: "Design Compiler, Cadence Genus",
    outputs: "Gate-Level Netlist (.v), SDC Constraints",
    details: "Translates behavioral statements into standard cell geometries (AND, OR, DFF). Synthesized netlists must satisfy SDC timing, area, and power goals."
  },
  {
    id: "sta",
    name: "STA (Timing Analysis)",
    desc: "Evaluating setup and hold times across all paths to verify clock performance.",
    tools: "PrimeTime, Cadence Tempus",
    outputs: "Timing Slack Reports (.rep), SDF delays",
    details: "Static Analysis checks all timing paths without vectors. Setup margins ensure data arrives before clock triggers; hold margins ensure data remains stable after clocks trigger."
  },
  {
    id: "dft",
    name: "DFT Insertion",
    desc: "Adding scan chains and test loops to verify post-silicon chips.",
    tools: "Synopsys Testent, Mentor Tessent",
    outputs: "DFT-inserted Netlist, ATPG patterns",
    details: "Injects scan chains, logic BIST (Built-In Self-Test), and JTAG boundary cells so hardware testers (ATE) can inspect physical logic arrays for manufacturing faults."
  },
  {
    id: "floorplan",
    name: "Floorplanning",
    desc: "Defining die size aspect ratios, power grids, and placing RAM macros.",
    tools: "IC Compiler II, Cadence Innovus",
    outputs: "DEF layout guidelines, Power grids",
    details: "Allocates physical silicon real estate. Distributes power rails (VDD/GND) to prevent voltage drop anomalies and sets core utilization goals."
  },
  {
    id: "cts",
    name: "Clock Tree Synthesis",
    desc: "Balancing clock distribution trees to all registers to minimize skew.",
    tools: "ICC2, Innovus",
    outputs: "CTS trace files, buffered clock trees",
    details: "Synthesizes a balanced buffer tree structure, ensuring clock signals reach all registers at the same moment, minimizing skew and jitter."
  },
  {
    id: "route",
    name: "Routing",
    desc: "Connecting standard cell pins using metal tracks.",
    tools: "ICC2, Innovus",
    outputs: "SPEF Parasitics, detailed routed DEF",
    details: "Executes routing connecting logic cells using horizontal and vertical metal layers while adhering to spacing rules to avoid capacitive crosstalk."
  },
  {
    id: "signoff",
    name: "Signoff Checks",
    desc: "Final checks verifying layout logic matches netlist schematic.",
    tools: "Siemens Calibre, Star-RC",
    outputs: "DRC/LVS reports, final tape-out Netlist",
    details: "Runs DRC (Design Rule Check) and LVS (Layout vs Schematic) checks. Verifies physical geometries are valid for chip manufacturing."
  },
  {
    id: "gds",
    name: "GDSII (Tape-out)",
    desc: "Generating the final binary file of mask layouts sent to foundry.",
    tools: "Innovus, Calibre, ICC2",
    outputs: "GDSII layout file (.gds)",
    details: "The final step of the ASIC design flow. The binary mask database represents the physical layout layers fabricated at the foundry."
  }
];

let activeAsicIdx = 1; // RTL Design default
let isAsicSimulating = false;
let asicSimInterval = null;
let asicSimLogs = ["[SYSTEM]: Awaiting synthesis trigger... click 'Play Synthesis Walkthrough'"];

window.renderAsic = function() {
  const container = document.getElementById("view-container");
  if (!container) return;

  const current = asicPhases[activeAsicIdx];

  container.innerHTML = `
    <div class="max-w-7xl mx-auto px-6 py-8 flex flex-col gap-8">
      
      <!-- Header -->
      <div class="text-center max-w-2xl mx-auto">
        <h2 class="text-3xl font-heading font-extrabold text-white">ASIC Backend Implementation Flow</h2>
        <p class="text-xs text-gray-400 mt-2">Explore the stages of digital chip synthesis and physical layout. Click on any step on the flowchart to audit its specifications.</p>
      </div>

      <!-- Playback Simulator controls -->
      <div class="glass-panel p-4 rounded-xl border-white/5 flex flex-wrap gap-4 justify-between items-center bg-slate-950/20">
        <div class="flex items-center gap-2">
          <span class="w-2.5 h-2.5 rounded-full ${isAsicSimulating ? 'bg-emerald-500 animate-ping' : 'bg-gray-600'}"></span>
          <span class="text-[10px] text-gray-400 font-mono">ASIC Flow Simulation Player</span>
        </div>
        <button onclick="triggerAsicSimulation()" class="px-5 py-2 rounded-xl text-xs font-bold text-white shadow-lg transition-all hover:scale-105 active:scale-95 ${
          isAsicSimulating ? 'bg-red-600 hover:bg-red-500' : 'bg-gradient-to-r from-blue-600 to-indigo-600'
        }">
          <i class="fa-solid ${isAsicSimulating ? 'fa-stop' : 'fa-play'} mr-1.5"></i> 
          ${isAsicSimulating ? 'Stop Synthesis' : 'Play Synthesis Walkthrough'}
        </button>
      </div>

      <!-- Flow Timeline Grid -->
      <div class="w-full overflow-x-auto pb-4 pt-2">
        <div class="flex items-center min-w-[950px] justify-between relative px-4">
          <!-- Connector line -->
          <div class="absolute left-6 right-6 top-1/2 h-[2px] bg-gradient-to-r from-blue-600 via-indigo-500 to-cyan-400 z-0 -translate-y-1/2 opacity-30"></div>
          
          ${asicPhases.map((phase, idx) => {
            const isActive = idx === activeAsicIdx;
            const completed = idx < activeAsicIdx;
            return `
              <div onclick="selectAsicPhase(${idx})" class="flex flex-col items-center gap-2.5 z-10 cursor-pointer group">
                <div class="w-9 h-9 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                  isActive 
                    ? 'bg-blue-950 border-blue-500 text-blue-300 glow-border-blue scale-110 shadow-[0_0_10px_rgba(59,130,246,0.5)]' 
                    : completed 
                      ? 'bg-blue-900/30 border-blue-500/40 text-blue-400' 
                      : 'bg-[#05070f] border-white/10 text-gray-500 group-hover:border-white/20'
                }">
                  <span class="font-heading font-bold text-xs">${idx + 1}</span>
                </div>
                <span class="text-[9px] font-heading font-semibold transition-colors ${isActive ? 'text-blue-400 font-bold' : 'text-gray-500 group-hover:text-gray-300'}">${phase.name}</span>
              </div>
            `;
          }).join("")}
        </div>
      </div>

      <!-- Detail Showcase Card -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-4">
        <!-- Main Description -->
        <div class="lg:col-span-2 glass-panel p-6 rounded-2xl border-white/5 flex flex-col justify-between gap-6">
          <div>
            <div class="flex items-center gap-3">
              <span class="text-[9px] font-mono text-blue-400 bg-blue-950/40 border border-blue-500/20 px-2.5 py-0.5 rounded">Phase ${activeAsicIdx + 1} of 11</span>
              <span class="text-[9px] font-mono text-purple-400 bg-purple-950/40 border border-purple-500/20 px-2.5 py-0.5 rounded">VLSI backend standard</span>
            </div>
            <h3 class="text-xl font-heading font-extrabold text-white mt-3">${current.name}</h3>
            <p class="text-xs text-gray-300 leading-relaxed mt-4 bg-slate-950/40 p-4 rounded-xl border border-white/5">${current.desc}</p>
          </div>

          <!-- Tools and outputs metadata -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-white/5 pt-4">
            <div class="flex items-start gap-3">
              <div class="p-2 rounded bg-slate-900 text-cyan-400 border border-white/5"><i class="fa-solid fa-screwdriver-wrench"></i></div>
              <div>
                <span class="block text-[8px] text-gray-500 uppercase tracking-widest">Industry Tools</span>
                <span class="text-xs font-semibold text-white mt-0.5 font-mono">${current.tools}</span>
              </div>
            </div>
            <div class="flex items-start gap-3">
              <div class="p-2 rounded bg-slate-900 text-purple-400 border border-white/5"><i class="fa-solid fa-file-export"></i></div>
              <div>
                <span class="block text-[8px] text-gray-500 uppercase tracking-widest">File formats</span>
                <span class="text-xs font-semibold text-white mt-0.5 font-mono">${current.outputs}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Simulator Logs / Detail Panel -->
        <div class="lg:col-span-1 glass-panel p-6 rounded-2xl border-white/5 flex flex-col justify-between gap-4">
          <h4 class="text-xs font-heading font-bold text-white uppercase tracking-widest flex items-center gap-2">
            <i class="fa-solid fa-terminal text-blue-400"></i> Tool log outputs
          </h4>
          <div id="asic-sim-logbox" class="flex-grow p-4 bg-slate-950/80 rounded-xl border border-white/5 text-[10px] font-mono text-emerald-400 h-44 overflow-y-auto leading-relaxed">
            ${asicSimLogs.join("<br>")}
          </div>
        </div>
      </div>
    </div>
  `;

  // Auto scroll logs
  setTimeout(() => {
    const box = document.getElementById("asic-sim-logbox");
    if (box) box.scrollTop = box.scrollHeight;
  }, 50);
};

window.selectAsicPhase = function(idx) {
  activeAsicIdx = idx;
  renderAsic();
};

window.triggerAsicSimulation = function() {
  if (isAsicSimulating) {
    // Stop
    clearInterval(asicSimInterval);
    isAsicSimulating = false;
    asicSimLogs.push("[SYSTEM]: Simulation halted by user.");
    renderAsic();
  } else {
    // Start
    isAsicSimulating = true;
    activeAsicIdx = 0;
    asicSimLogs = ["[SYSTEM]: Initializing synthesis walkthrough player..."];
    renderAsic();

    asicSimInterval = setInterval(() => {
      if (activeAsicIdx < asicPhases.length - 1) {
        activeAsicIdx++;
        const phase = asicPhases[activeAsicIdx];
        asicSimLogs.push(`[INFO]: Triggered stage ${activeAsicIdx + 1} (${phase.name}). running tools: ${phase.tools}...`);
        asicSimLogs.push(`[SUCCESS]: Exported files: ${phase.outputs}`);
        renderAsic();
      } else {
        clearInterval(asicSimInterval);
        isAsicSimulating = false;
        asicSimLogs.push("[SYSTEM]: ASIC Tape-out completed. GDSII verified! +50 XP");
        AppState.user.xp += 50;
        showToast("ASIC Walkthrough simulation complete! +50 XP", "success");
        renderAsic();
      }
    }, 2000);
  }
};
