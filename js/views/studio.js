/* VLSI Studio View Controller - ASIC Flow Explorer */

// --- Flow Explorer State ---
let selectedFlowStageIdx = 2; // Default to RTL Design
let flowScale = 1.0;
let isFlowAutoPlaying = false;
let flowAutoPlayTimer = null;

// Static Databases
const FLOW_STAGES = [
  {
    title: "Specification",
    overview: "Define features, target frequency, power boundaries, and physical dimensions of the chip.",
    purpose: "Establishes baseline product targets and silicon scope.",
    inputs: "Market requirements, standard constraints, target technology library nodes.",
    outputs: "Design Requirement Documents (DRD), technical briefs.",
    tools: ["Word", "Excel", "DOORS", "Confluence"],
    cmd: "N/A - Requirements Traceability Matrix validation",
    skills: "Systems Engineering, Architecture scoping",
    errors: "Feature creep, incompatible performance expectations."
  },
  {
    title: "Architecture",
    overview: "Define system blocks, bus protocols (AHB, AXI, APB), and memory controllers.",
    purpose: "Provides a functional hardware partitions blueprint.",
    inputs: "Design requirements, performance targets.",
    outputs: "Block diagrams, interface protocols definitions.",
    tools: ["SystemC", "MATLAB", "Python System Models"],
    cmd: "python -m simulator_model --cycles 100000",
    skills: "Processor microarchitecture, high-level modelling",
    errors: "Memory bottleneck issues, throughput congestion."
  },
  {
    title: "RTL Design",
    overview: "Write synthesizable hardware description code using Verilog, SystemVerilog, or VHDL.",
    purpose: "Translates functional microarchitecture block design to logic gates descriptions.",
    inputs: "Architecture specifications.",
    outputs: "RTL Code base, IP netlists.",
    tools: ["Vim/VS Code", "Cadence Jasper", "Synopsys VCS"],
    cmd: "vlog -sv my_module.v",
    skills: "Verilog, RTL design rules, logic coding",
    errors: "Latch inferences, timing race hazards."
  },
  {
    title: "Functional Simulation",
    overview: "Verify code accuracy using assertions, testbenches, and UVM verification strategies.",
    purpose: "Ensures logic matches specifications before physical synthesis.",
    inputs: "RTL code, testbench constraints.",
    outputs: "Simulation pass reports, VCD/FSDB wave files.",
    tools: ["Synopsys VCS", "Siemens Questa", "Cadence Xcelium"],
    cmd: "xrun -uvm testbench.sv rtl.v",
    skills: "SystemVerilog, UVM OOP, coverage checking",
    errors: "Missing test coverage, failing assertion vectors."
  },
  {
    title: "Lint Checking",
    overview: "Perform static analysis of RTL code to capture coding style mistakes, non-synthesizable elements, and port wiring bugs.",
    purpose: "Catches hardware bugs early before running complex logic compilation.",
    inputs: "RTL code.",
    outputs: "Lint analysis reports.",
    tools: ["Synopsys SpyGlass", "RealIntent", "Verilator"],
    cmd: "spyglass -project lint.prj",
    skills: "Static analysis rules, RTL lint scripts",
    errors: "Latch inferences, vector sizing mismatches."
  },
  {
    title: "Formal Verification",
    overview: "Mathematically prove that logic properties are satisfied across all possible states.",
    purpose: "Ensures exhaustive proof coverage of complex controllers (arbiters, FIFO structures) without simulation testcases.",
    inputs: "RTL code, Assertion files (SVA).",
    outputs: "Formal proofs mathematical confirmation.",
    tools: ["Cadence JasperGold", "Synopsys VC Formal"],
    cmd: "jg formal_check.tcl",
    skills: "SystemVerilog Assertions (SVA), formal solver config",
    errors: "Unbounded assertions causing solver timeout."
  },
  {
    title: "Synthesis",
    overview: "Compile RTL code into netlists of physical technology standard cells.",
    purpose: "Converts text code into hardware schematics.",
    inputs: "RTL code, Timing constraints (SDC), Standard Cell libraries (.lib).",
    outputs: "Gate-level netlist (.v), standard delay files (SDF).",
    tools: ["Synopsys Design Compiler", "Cadence Genus"],
    cmd: "compile_ultra -incremental",
    skills: "SDC constraint formulation, cell mapping",
    errors: "Failing to constrain paths, mapping to illegal cell nodes."
  },
  {
    title: "DFT Insertion",
    overview: "Embed test structures (scan chains, BIST) to test chips post-fabrication.",
    purpose: "Ensures high manufacturing defect coverage.",
    inputs: "Synthesized Netlist.",
    outputs: "DFT netlist, test patterns (ATPG).",
    tools: ["Synopsys TestMax", "Siemens Tessent"],
    cmd: "insert_dft -scan_chains 8",
    skills: "Scan chain structures, memory BIST insertion",
    errors: "Scan chain broken transitions, timing violations on scan paths."
  },
  {
    title: "STA (Static Timing)",
    overview: "Validate setup, hold, recovery, and removal timing margins across all corners.",
    purpose: "Guarantees logic operates at speed without failure.",
    inputs: "Gate-level netlist, parasitics, clock constraints.",
    outputs: "Timing Reports (.rpt).",
    tools: ["Synopsys PrimeTime", "Cadence Tempus"],
    cmd: "report_timing -delay_type max",
    skills: "Timing violation debugging, clock-tree constraints",
    errors: "Negative Slack violations on setup/hold paths."
  },
  {
    title: "Floorplanning",
    overview: "Determine pad placement, power grid rails, and macro/memory blocks positions.",
    purpose: "Establishes structural chip core layouts.",
    inputs: "Gate-level netlist, floorplan coordinates.",
    outputs: "DEF files, cell grid regions.",
    tools: ["Synopsys IC Compiler II", "Cadence Innovus"],
    cmd: "initialize_floorplan -core_utilization 0.7",
    skills: "Floorplanning constraints, IR drop planning",
    errors: "Congested routing corridors, hot spots in macro layouts."
  },
  {
    title: "Placement",
    overview: "Place standard cells inside rows to optimize timing, congestion, and wire-length.",
    purpose: "Positions logic cells for optimal routing paths.",
    inputs: "Floorplanned layout, cell locations constraints.",
    outputs: "Placed cell layout.",
    tools: ["Cadence Innovus", "Synopsys ICC2"],
    cmd: "place_opt -effort high",
    skills: "Placement density optimization",
    errors: "Cell overlaps, timing degradation on path routes."
  },
  {
    title: "Clock Tree Synthesis",
    overview: "Distribute clock signals uniformly to all registers using buffers and tree structures.",
    purpose: "Minimizes clock skew and logic latency limits.",
    inputs: "Placed layout, clock specifications.",
    outputs: "CTS layout, clock trees reports.",
    tools: ["Cadence Innovus", "Synopsys ICC2"],
    cmd: "synthesize_clock_tree -skew_target 0.05",
    skills: "CTS buffers insertion, skew management",
    errors: "High clock skew, excessive power grid clock noise."
  },
  {
    title: "Routing",
    overview: "Route metal wire connections between standard cell pins.",
    purpose: "Physically connects all electronic logic blocks.",
    inputs: "CTS layout, routing grids specs.",
    outputs: "GDSII / OASIS layout database files.",
    tools: ["Cadence Innovus", "Synopsys ICC2"],
    cmd: "route_design -effort medium",
    skills: "Detail routing optimization, DRC rules",
    errors: "Antenna violations, shorted routing coordinates."
  },
  {
    title: "Physical Verification",
    overview: "Verify DRC (Design Rules Check) and LVS (Layout vs Schematic) cell matching.",
    purpose: "Ensures mask layers match gate-level netlists.",
    inputs: "Routed GDSII layouts, schematic netlist.",
    outputs: "Verification pass reports, DRC marker files.",
    tools: ["Siemens Calibre", "Synopsys IC Validator"],
    cmd: "calibre -drc -hier rules.drc",
    skills: "DRC/LVS rules diagnostics, metal density checks",
    errors: "Metal space violations, LVS mismatches."
  },
  {
    title: "Signoff & Tape-Out",
    overview: "Export GDSII layout database to fabricator masks workshop.",
    purpose: "Final submission for silicon chip fabrication.",
    inputs: "Fully verified GDSII files.",
    outputs: "Tape-out database files.",
    tools: ["Siemens Calibre", "Synopsys ICC2"],
    cmd: "write_gds final_design.gds",
    skills: "GDSII exports, mask data preparation",
    errors: "Corrupt file stream outputs, unverified changes."
  }
];

window.renderStudio = function() {
  const container = document.getElementById("view-container");
  if (!container) return;
  renderFlowExplorer(container);
};

// --- View: Flow Explorer ---
function renderFlowExplorer(container, shouldScrollToActive = false) {
  container.innerHTML = `
    <div class="max-w-7xl mx-auto px-6 py-8 flex flex-col gap-6 font-sans animate-fade-in-up">
      
      <!-- Header & Zoom Controls -->
      <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/5 pb-4">
        <div>
          <span class="text-xs text-cyan-400 font-bold uppercase tracking-widest font-mono block">ASIC Engineering Pipeline</span>
          <h2 class="text-2xl font-heading font-extrabold text-white flex items-center gap-2">
            <i class="fa-solid fa-diagram-project text-cyan-400"></i> ASIC Flow Explorer
          </h2>
        </div>

        <div class="flex items-center gap-3 flex-wrap">
          <!-- Flow Simulation Auto-Play Toggle -->
          <button id="flow-autoplay-btn"
                  type="button"
                  onclick="toggleFlowAutoPlay()" 
                  class="px-3.5 py-1.5 rounded-xl border text-xs font-mono font-bold flex items-center gap-1.5 transition-all shadow-lg ${isFlowAutoPlaying ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 active-stage-glow' : 'bg-slate-900 border-white/10 text-gray-300 hover:text-white hover:border-cyan-500/40'}">
            <i class="fa-solid ${isFlowAutoPlaying ? 'fa-pause animate-pulse text-cyan-400' : 'fa-play text-emerald-400'}"></i>
            <span>${isFlowAutoPlaying ? 'Auto-Simulating Pipeline...' : 'Auto-Play Flow'}</span>
          </button>

          <!-- Zoom Scale panel -->
          <div class="flex items-center gap-2 bg-slate-950 px-3 py-1.5 rounded-xl border border-white/5">
            <button type="button" onclick="adjustFlowZoom(0.1)" title="Zoom In" class="w-6 h-6 rounded bg-slate-900 border border-white/5 text-xs text-gray-400 hover:text-white flex items-center justify-center"><i class="fa-solid fa-magnifying-glass-plus"></i></button>
            <button type="button" onclick="adjustFlowZoom(-0.1)" title="Zoom Out" class="w-6 h-6 rounded bg-slate-900 border border-white/5 text-xs text-gray-400 hover:text-white flex items-center justify-center"><i class="fa-solid fa-magnifying-glass-minus"></i></button>
            <span id="flow-zoom-scale-text" class="text-[9px] font-mono text-gray-500">Scale: ${Math.round(flowScale * 100)}%</span>
          </div>
        </div>
      </div>

      <!-- Scrollable Horizontal Flow Pipeline -->
      <div id="flow-pipeline-scroll" class="relative bg-slate-950 p-6 rounded-2xl border border-white/5 overflow-x-auto whitespace-nowrap scrollbar-thin">
        <div id="flow-pipeline-zoom-inner" class="flex items-center gap-4 py-2" style="transform: scale(${flowScale}); transform-origin: left center; min-width: 100%;">
          ${FLOW_STAGES.map((stg, idx) => {
            return `
              <div id="stage-card-${idx}" 
                   onclick="selectFlowStage(${idx}, false)" 
                   class="inline-flex flex-col gap-2.5 p-4 rounded-xl border min-w-[160px] cursor-pointer flow-card-transition text-left border-white/10 hover:border-cyan-500/40 bg-slate-900/40">
                
                <div class="flex justify-between items-center">
                  <span class="text-[9px] font-mono text-cyan-400 font-bold uppercase tracking-widest bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-500/20">Stage #${idx + 1}</span>
                </div>
                
                <strong class="text-xs text-white block truncate font-heading font-extrabold">${stg.title}</strong>
                
                <div class="flex items-center justify-between mt-1 text-[9px] font-mono">
                  <span class="text-gray-400">Flow Stage</span>
                  <div class="active-badge-container"></div>
                </div>
              </div>

              ${idx < FLOW_STAGES.length - 1 ? `
                <div class="inline-flex flex-col items-center justify-center text-cyan-400/70 select-none px-1">
                  <i class="fa-solid fa-arrow-right-long text-sm text-cyan-400 animate-signal-pulse"></i>
                  <i class="fa-solid fa-circle-nodes text-[8px] text-cyan-500/40 animate-pulse mt-0.5"></i>
                </div>
              ` : ''}
            `;
          }).join("")}
        </div>
      </div>

      <!-- Stage Detailed Viewport -->
      <div id="studio-details-container" class="grid grid-cols-1 lg:grid-cols-3 gap-6 transition-all duration-200 opacity-100">
        <!-- Content will be injected here dynamically -->
      </div>
    </div>
  `;

  // Initial update to render the selected stage contents
  updateFlowStageUI(shouldScrollToActive, true);
}

function updateFlowStageUI(shouldScroll = true, isFirstTime = false) {
  const currentStage = FLOW_STAGES[selectedFlowStageIdx];

  // 1. Update horizontal cards
  FLOW_STAGES.forEach((stg, idx) => {
    const card = document.getElementById(`stage-card-${idx}`);
    if (card) {
      const isSelected = idx === selectedFlowStageIdx;
      if (isSelected) {
        card.className = "inline-flex flex-col gap-2.5 p-4 rounded-xl border min-w-[160px] cursor-pointer flow-card-transition text-left border-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.35)] bg-cyan-950/30 active-stage-glow";
        const badge = card.querySelector(".active-badge-container");
        if (badge) badge.innerHTML = `<span class="text-[8px] text-cyan-300 bg-cyan-900/50 px-1.5 rounded animate-pulse">ACTIVE</span>`;
      } else {
        card.className = "inline-flex flex-col gap-2.5 p-4 rounded-xl border min-w-[160px] cursor-pointer flow-card-transition text-left border-white/10 hover:border-cyan-500/40 bg-slate-900/40";
        const badge = card.querySelector(".active-badge-container");
        if (badge) badge.innerHTML = ``;
      }
    }
  });

  // 2. Handle scroll positioning
  const scrollContainer = document.getElementById("flow-pipeline-scroll");
  if (scrollContainer && shouldScroll) {
    const activeCard = document.getElementById(`stage-card-${selectedFlowStageIdx}`);
    if (activeCard) {
      activeCard.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    }
  }

  // 3. Update details container with smooth fade transition
  const detailsContainer = document.getElementById("studio-details-container");
  if (detailsContainer) {
    const renderContent = () => {
      detailsContainer.innerHTML = `
        <!-- Left 2 Columns: Overview, Tools and Inputs -->
        <div class="lg:col-span-2 flex flex-col gap-6">
          
          <!-- Summary card -->
          <div class="glass-panel p-6 rounded-2xl border-white/5 flex flex-col gap-4">
            <div class="flex justify-between items-start flex-wrap gap-3">
              <div>
                <span class="text-[9px] text-cyan-400 font-bold uppercase tracking-widest font-mono block">Stage ${selectedFlowStageIdx + 1} of ${FLOW_STAGES.length} Overview</span>
                <h3 class="text-xl font-heading font-extrabold text-white flex items-center gap-2 mt-0.5">
                  ${currentStage.title}
                </h3>
              </div>

              <!-- Stage Controls (Step Prev/Next) -->
              <div class="flex items-center gap-2 flex-wrap">
                <button type="button"
                        onclick="navigateFlowStage(-1)" ${selectedFlowStageIdx === 0 ? 'disabled' : ''}
                        class="px-3 py-1.5 bg-slate-900 border border-white/10 hover:border-cyan-500/40 disabled:opacity-30 disabled:cursor-not-allowed rounded-xl text-xs font-mono text-gray-300 hover:text-white transition-colors flex items-center gap-1">
                  <i class="fa-solid fa-chevron-left"></i> Prev Stage
                </button>
                <button type="button"
                        onclick="navigateFlowStage(1)" ${selectedFlowStageIdx === FLOW_STAGES.length - 1 ? 'disabled' : ''}
                        class="px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 disabled:opacity-30 disabled:cursor-not-allowed rounded-xl text-xs font-mono text-white font-bold transition-colors flex items-center gap-1 shadow-lg">
                  Next Stage <i class="fa-solid fa-chevron-right"></i>
                </button>
              </div>
            </div>
            
            <p class="text-xs text-gray-200 leading-relaxed font-sans bg-slate-950 p-4 rounded-xl border border-white/5">${currentStage.overview}</p>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-sans">
              <div class="flex flex-col gap-1 bg-slate-900/40 p-3 rounded-xl border border-white/5">
                <strong class="text-[10px] text-gray-400 font-mono uppercase tracking-wider">Primary Purpose</strong>
                <span class="text-gray-200">${currentStage.purpose}</span>
              </div>
              <div class="flex flex-col gap-1 bg-slate-900/40 p-3 rounded-xl border border-white/5">
                <strong class="text-[10px] text-gray-400 font-mono uppercase tracking-wider">Required Engineering Skills</strong>
                <span class="text-cyan-400 font-bold">${currentStage.skills}</span>
              </div>
            </div>
          </div>

          <!-- Files and Commands -->
          <div class="glass-panel p-6 rounded-2xl border-white/5 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="flex flex-col gap-2">
              <strong class="text-[10px] text-gray-400 font-mono uppercase tracking-wider flex items-center gap-1.5">
                <i class="fa-solid fa-file-import text-blue-400"></i> Input Files
              </strong>
              <div class="p-3.5 bg-slate-950 rounded-xl border border-white/5 text-[10px] font-mono text-gray-300 leading-relaxed">${currentStage.inputs}</div>
            </div>
            <div class="flex flex-col gap-2">
              <strong class="text-[10px] text-gray-400 font-mono uppercase tracking-wider flex items-center gap-1.5">
                <i class="fa-solid fa-file-export text-emerald-400"></i> Expected Outputs
              </strong>
              <div class="p-3.5 bg-slate-950 rounded-xl border border-white/5 text-[10px] font-mono text-emerald-400 font-semibold leading-relaxed">${currentStage.outputs}</div>
            </div>
          </div>
        </div>

        <!-- Right 1 Column: Tools Used and Common Errors -->
        <div class="lg:col-span-1 flex flex-col gap-6">
          <!-- Tools checklist -->
          <div class="glass-panel p-5 rounded-2xl border-white/5 flex flex-col gap-4">
            <h3 class="text-xs font-heading font-bold text-purple-400 uppercase tracking-widest flex items-center gap-1.5">
              <i class="fa-solid fa-screwdriver-wrench"></i> Industry CAD Tools
            </h3>
            
            <div class="flex flex-col gap-3">
              <div class="flex flex-col gap-1.5 border-b border-white/5 pb-3">
                <span class="text-[9px] text-gray-400 font-mono uppercase">Standard EDA Platforms</span>
                <div class="flex flex-wrap gap-1.5">
                  ${currentStage.tools.map(tool => `
                    <span class="px-2.5 py-1 bg-slate-900 border border-purple-500/20 rounded-lg text-[10px] font-mono text-purple-300 font-bold">${tool}</span>
                  `).join("")}
                </div>
              </div>

              <div class="flex flex-col gap-1.5">
                <span class="text-[9px] text-gray-400 font-mono uppercase">Terminal Execution Command</span>
                <code class="bg-slate-950 p-3 rounded-xl border border-emerald-500/20 text-[10px] text-emerald-400 font-mono select-all overflow-x-auto block shadow-inner">${currentStage.cmd}</code>
              </div>
            </div>
          </div>

          <!-- Common Errors panel -->
          <div class="glass-panel p-5 rounded-2xl border-white/5 flex flex-col gap-3">
            <h3 class="text-xs font-heading font-bold text-red-400 uppercase tracking-widest flex items-center gap-1.5">
              <i class="fa-solid fa-triangle-exclamation"></i> Common Failure Modes
            </h3>
            <p class="text-[11px] text-red-300 leading-relaxed font-sans bg-red-950/20 border border-red-500/20 p-3.5 rounded-xl">${currentStage.errors}</p>
          </div>
        </div>
      `;
    };

    if (isFirstTime) {
      renderContent();
    } else {
      detailsContainer.style.opacity = "0";
      detailsContainer.style.transform = "translateY(8px)";
      setTimeout(() => {
        renderContent();
        detailsContainer.style.opacity = "1";
        detailsContainer.style.transform = "translateY(0)";
      }, 150);
    }
  }
}

window.selectFlowStage = function(idx, shouldScroll = true) {
  selectedFlowStageIdx = idx;
  updateFlowStageUI(shouldScroll, false);
};

window.navigateFlowStage = function(dir) {
  const newIdx = selectedFlowStageIdx + dir;
  if (newIdx >= 0 && newIdx < FLOW_STAGES.length) {
    selectFlowStage(newIdx, true);
  }
};

window.toggleFlowAutoPlay = function() {
  const btn = document.getElementById("flow-autoplay-btn");
  if (isFlowAutoPlaying) {
    isFlowAutoPlaying = false;
    if (flowAutoPlayTimer) clearInterval(flowAutoPlayTimer);
    flowAutoPlayTimer = null;
    showToast("Flow Auto-Play paused.", "info");
    
    if (btn) {
      btn.className = "px-3.5 py-1.5 rounded-xl border text-xs font-mono font-bold flex items-center gap-1.5 transition-all shadow-lg bg-slate-900 border-white/10 text-gray-300 hover:text-white hover:border-cyan-500/40";
      btn.innerHTML = `<i class="fa-solid fa-play text-emerald-400"></i> <span>Auto-Play Flow</span>`;
    }
  } else {
    isFlowAutoPlaying = true;
    showToast("Starting ASIC Flow Auto-Play Simulation...", "success");
    
    if (btn) {
      btn.className = "px-3.5 py-1.5 rounded-xl border text-xs font-mono font-bold flex items-center gap-1.5 transition-all shadow-lg bg-cyan-500/20 border-cyan-400 text-cyan-300 active-stage-glow";
      btn.innerHTML = `<i class="fa-solid fa-pause animate-pulse text-cyan-400"></i> <span>Auto-Simulating Pipeline...</span>`;
    }
    
    flowAutoPlayTimer = setInterval(() => {
      let nextIdx = selectedFlowStageIdx + 1;
      if (nextIdx >= FLOW_STAGES.length) nextIdx = 0;
      selectFlowStage(nextIdx, true);
    }, 2500);
  }
};

window.adjustFlowZoom = function(amount) {
  flowScale = Math.max(0.6, Math.min(1.4, flowScale + amount));
  
  const innerZoom = document.getElementById("flow-pipeline-zoom-inner");
  if (innerZoom) {
    innerZoom.style.transform = `scale(${flowScale})`;
  }
  
  const scaleText = document.getElementById("flow-zoom-scale-text");
  if (scaleText) {
    scaleText.innerText = `Scale: ${Math.round(flowScale * 100)}%`;
  }
};




