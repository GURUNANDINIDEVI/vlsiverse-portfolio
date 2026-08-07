/* Projects View - 50 Silicon Blueprints with Detailed Specs (No canvas animation) */

let activeProjectIdx = 0;

window.renderProjects = function() {
  const container = document.getElementById("view-container");
  if (!container) return;

  const projects = VLSIData.projects;
  const current = projects[activeProjectIdx] || projects[0];



  container.innerHTML = `
    <div class="max-w-7xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-4 gap-8 font-sans">
      <!-- Projects Sidebar -->
      <div class="lg:col-span-1 flex flex-col gap-4">
        <h3 class="font-heading font-extrabold text-sm text-white px-2">Design Hub (${projects.length})</h3>
        <div class="flex flex-col gap-1.5 max-h-[75vh] overflow-y-auto pr-1">
          ${projects.map((proj, idx) => `
            <button onclick="selectProject(${idx})" class="text-left w-full px-3 py-2.5 rounded-lg border text-xs transition-all flex items-center justify-between ${
              idx === activeProjectIdx 
                ? 'bg-blue-950/20 border-blue-500/25 text-blue-300 font-bold' 
                : 'bg-[#0b0f19] border-white/5 text-gray-400 hover:text-gray-200'
            }">
              <span class="truncate pr-1">${proj.title}</span>
              <span class="text-[9px] font-semibold text-gray-500 font-mono">${proj.difficulty}</span>
            </button>
          `).join("")}
        </div>
      </div>

      <!-- Main Workspace -->
      <div class="lg:col-span-3 flex flex-col gap-6 animate-fade-in-up">
        <!-- Project Header & Detailed Description -->
        <div class="glass-panel p-6 rounded-2xl border-white/5">
          <div class="flex items-center justify-between mb-2">
            <span class="text-[10px] text-blue-400 font-bold uppercase tracking-widest font-mono">SoC Hardware Blueprint</span>
            <span class="px-2.5 py-0.5 rounded-full border border-blue-500/25 bg-blue-950/40 text-[9px] font-bold text-blue-300 font-mono">${current.difficulty}</span>
          </div>
          <h2 class="text-2xl font-heading font-extrabold text-white">${current.title}</h2>
          
          <div class="mt-4 p-5 bg-slate-950/40 rounded-xl border border-white/5">
            <h4 class="text-[10px] font-heading font-bold text-blue-400 uppercase tracking-widest mb-3">Technical Specification &amp; Design Scope</h4>
            <p class="text-xs text-gray-300 leading-relaxed font-sans">${current.description}</p>
          </div>
        </div>

        <!-- Concept detail cards -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="glass-panel p-5 rounded-2xl border-white/5 flex flex-col gap-2">
            <h4 class="text-[10px] font-heading font-bold text-blue-400 uppercase tracking-widest">Theoretical Abstract</h4>
            <p class="text-xs text-gray-400 leading-relaxed font-sans">${current.idea}</p>
          </div>
          <div class="glass-panel p-5 rounded-2xl border-white/5 flex flex-col gap-2">
            <h4 class="text-[10px] font-heading font-bold text-purple-400 uppercase tracking-widest">Real-world SoC application</h4>
            <p class="text-xs text-gray-400 leading-relaxed font-sans">${current.situation}</p>
          </div>
          <div class="glass-panel p-5 rounded-2xl border-white/5 flex flex-col gap-2">
            <h4 class="text-[10px] font-heading font-bold text-cyan-400 uppercase tracking-widest">Implementation Guidelines</h4>
            <p class="text-xs text-gray-400 leading-relaxed font-sans">${current.hint}</p>
          </div>
        </div>

        <!-- Step-by-Step Project Implementation Roadmap (Customized per Project) -->
        <div class="glass-panel p-6 rounded-2xl border-white/5 flex flex-col gap-4">
          <div class="flex items-center justify-between border-b border-white/5 pb-3">
            <h4 class="text-[10px] font-heading font-bold text-emerald-400 uppercase tracking-widest flex items-center gap-1.5">
              <i class="fa-solid fa-map-location-dot"></i> Step-by-Step Implementation Roadmap &bull; ${current.title}
            </h4>
            <span class="text-[9px] font-mono text-gray-400">4 Custom Milestones</span>
          </div>
          
          <div class="flex flex-col gap-4 text-xs font-sans">
            ${getProjectRoadmap(current).map(step => `
              <div class="flex gap-3 bg-slate-900/40 p-4 rounded-xl border border-white/5">
                <div class="w-7 h-7 rounded-full bg-${step.color}-950/60 border border-${step.color}-500/30 flex items-center justify-center font-bold text-${step.color}-400 font-mono flex-shrink-0 text-xs shadow-md">
                  ${step.step}
                </div>
                <div class="flex flex-col gap-1">
                  <strong class="text-white text-xs font-heading font-bold">${step.title}</strong>
                  <span class="text-gray-300 leading-relaxed text-xs">${step.desc}</span>
                </div>
              </div>
            `).join("")}
          </div>
        </div>
      </div>
    </div>
  `;
};

function getProjectRoadmap(proj) {
  const title = proj.title || "SoC Module";
  const diff = proj.difficulty || "Medium";

  if (title.includes("FIFO") || title.includes("Queue")) {
    return [
      {
        step: 1,
        title: `1. Dual Clock Domain Architecture & Gray Pointer Setup`,
        color: "blue",
        desc: `Define write clock (wclk) and read clock (rclk) domains. Configure dual-port RAM array and convert write/read binary pointers into Gray code to prevent Clock Domain Crossing (CDC) metastability.`
      },
      {
        step: 2,
        title: `2. Synchronizer Flops & Full/Empty Flag Logic`,
        color: "purple",
        desc: `Instantiate 2-stage D flip-flop synchronizers for cross-domain pointer transfer. Compute wfull = (wptr_gray == {~rptr_synced[N:N-1], rptr_synced[N-2:0]}) and rempty = (rptr_gray == wptr_synced).`
      },
      {
        step: 3,
        title: `3. Asynchronous Burst Testbench & Corner-Case Stressing`,
        color: "cyan",
        desc: `Write a SystemVerilog testbench driving asynchronous clocks (e.g. 100MHz wclk vs 33MHz rclk). Test simultaneous burst writes at full capacity and continuous reads down to empty state.`
      },
      {
        step: 4,
        title: `4. CDC Timing Constraints & ASIC Netlist Synthesis`,
        color: "amber",
        desc: `Apply SDC constraints 'set_max_delay' and 'set_false_path' on cross-domain pointer nets. Verify zero setup/hold timing violations and check RAM macro area footprint.`
      }
    ];
  } else if (title.includes("UART") || title.includes("Serial")) {
    return [
      {
        step: 1,
        title: `1. Baud Rate Generator & Oversampling Engine`,
        color: "blue",
        desc: `Design a 16x baud rate clock divider tick generator (e.g., 50MHz / (16 * 115200) = 27 ticks). Setup internal registers for START, 8 Data, Parity, and STOP bit framing.`
      },
      {
        step: 2,
        title: `2. RX Majority Voting State Machine & TX Shift Register`,
        color: "purple",
        desc: `Implement 3-sample majority voting on the 8th tick of each bit interval to filter out serial line noise glitching. Implement TX PISO (Parallel-In Serial-Out) shift register with active-low start bit generation.`
      },
      {
        step: 3,
        title: `3. Loopback Verification Testbench & Frame Error Injection`,
        color: "cyan",
        desc: `Connect TXD pin directly to RXD pin in testbench. Drive random byte sequences, introduce intentional baud frequency jitter (±2%), and check framing error (FE) and parity error (PE) flags.`
      },
      {
        step: 4,
        title: `4. Standard Cell Synthesis & I/O Pad Mapping`,
        color: "amber",
        desc: `Synthesize UART core targeting CMOS 45nm library. Map TXD/RXD pins to tri-state I/O pad cells with schmitt trigger inputs to enhance noise immunity.`
      }
    ];
  } else if (title.includes("FSM") || title.includes("State Machine") || title.includes("Traffic")) {
    return [
      {
        step: 1,
        title: `1. State Diagram & One-Hot / Binary State Encoding`,
        color: "blue",
        desc: `Define all operating states (e.g., RED, GREEN, YELLOW, PEDESTRIAN_WALK). Select state encoding (One-Hot for high-speed synthesis or Binary for area-constrained microcontrollers).`
      },
      {
        step: 2,
        title: `2. 3-Always Block Synthesizable RTL Structuring`,
        color: "purple",
        desc: `Structure RTL using 3 always blocks: Block 1 for sequential state register update, Block 2 for next-state combinational logic (always_comb), and Block 3 for registered output generation.`
      },
      {
        step: 3,
        title: `3. State Coverage & Illegal State Recovery Testing`,
        color: "cyan",
        desc: `Verify state transition coverage in simulation. Force the state register into an unmapped illegal state (e.g. 3'b111) and verify automatic default recovery back to the RESET state.`
      },
      {
        step: 4,
        title: `4. FSM Optimization & Combinational Glitch Elimination`,
        color: "amber",
        desc: `Analyze synthesized gate netlist. Ensure Moore outputs are registered (flop-buffered) to eliminate combinational hazard glitches before driving chip pins.`
      }
    ];
  } else if (title.includes("ALU") || title.includes("Arithmetic")) {
    return [
      {
        step: 1,
        title: `1. Arithmetic & Logic Operations Datapath Matrix`,
        color: "blue",
        desc: `Map arithmetic functions (ADD, SUB, MUL) and bitwise logic operations (AND, OR, XOR, SHIFT). Design a 4-bit opcode selector decoder.`
      },
      {
        step: 2,
        title: `2. Carry-Lookahead Adder & Flag Generation Logic`,
        color: "purple",
        desc: `Implement a high-speed Carry Lookahead Adder (CLA) for ADD/SUB operations. Generate status flags: Zero (Z), Carry-Out (C), Negative (N), and Overflow (V = A_msb ^ B_msb ^ Sum_msb ^ Cout).`
      },
      {
        step: 3,
        title: `3. Self-Checking Randomized Testbench Vector Suite`,
        color: "cyan",
        desc: `Build a SystemVerilog testbench comparing RTL outputs against a golden C-reference model. Apply random 32-bit integer operands and verify overflow detection on signed arithmetic.`
      },
      {
        step: 4,
        title: `4. Gate Delay Optimization & Maximum Operating Frequency (Fmax)`,
        color: "amber",
        desc: `Synthesize ALU core. Perform static timing analysis (STA) to identify critical paths through the multiplier tree and optimize propagation delay to achieve target Fmax.`
      }
    ];
  }

  return [
    {
      step: 1,
      title: `1. ${title} Specifications & Signal Architecture`,
      color: "blue",
      desc: `Define interface signals, bus widths, and control registers for "${title}". Draw the architectural block diagram mapping internal datapath registers and control logic.`
    },
    {
      step: 2,
      title: `2. ${title} Synthesizable RTL Sub-Module Coding`,
      color: "purple",
      desc: `Write clean synthesizable Verilog code for "${title}". ${proj.hint || "Ensure complete branch coverage in case/if statements to prevent unintended latches and use non-blocking (<=) for sequential registers."}`
    },
    {
      step: 3,
      title: `3. ${title} Testbench Verification & Waveform Inspection`,
      color: "cyan",
      desc: `Build a SystemVerilog testbench for '${title}'. Drive reset, apply edge-case input vectors, and verify real-world SoC operation (${proj.situation || "data integrity"}) in GTKWave simulation.`
    },
    {
      step: 4,
      title: `4. ASIC Synthesis, Timing Constraints & Gate Optimization (${diff} Level)`,
      color: "amber",
      desc: `Synthesize "${title}" targeting standard cell libraries. Apply clock constraints (SDC) to check gate cell count, power dissipation, setup/hold margins, and verify zero negative slack.`
    }
  ];
}



window.selectProject = function(idx) {
  activeProjectIdx = idx;
  renderProjects();
};
