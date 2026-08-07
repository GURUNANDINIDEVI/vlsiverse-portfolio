/* Learn View - Crisp Brief Topic Notes + 6-Page Interactive Handbook Reader Modal */

let activeTopicId = "digital-electronics";
let handbookState = {
  isOpen: false,
  topicId: "digital-electronics",
  currentPage: 1,
  totalPages: 6
};

window.renderLearn = function() {
  const container = document.getElementById("view-container");
  if (!container) return;

  const topicKeys = Object.keys(VLSIData.topics);
  const currentTopic = VLSIData.topics[activeTopicId] || VLSIData.topics["digital-electronics"];

  container.innerHTML = `
    <div class="max-w-7xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-4 gap-8 font-sans">
      <!-- Syllabus Index Sidebar Column -->
      <div class="lg:col-span-1 flex flex-col gap-4">
        <div class="glass-panel p-4 rounded-2xl border-white/5 flex flex-col gap-3">
          <h3 class="font-heading font-extrabold text-sm text-white px-1 flex items-center justify-between">
            <span class="flex items-center gap-2">
              <i class="fa-solid fa-graduation-cap text-blue-500"></i> Course Syllabus
            </span>
            <span class="text-[10px] font-mono bg-blue-950/60 border border-blue-500/30 text-blue-300 px-2 py-0.5 rounded font-bold">${topicKeys.length} Topics</span>
          </h3>
          <div class="flex flex-col gap-1.5 max-h-[75vh] overflow-y-auto pr-1">
            ${topicKeys.map(key => {
              const topic = VLSIData.topics[key];
              const isSelected = key === activeTopicId;
              return `
                <button onclick="selectTopic('${key}')" class="text-left w-full px-3 py-2.5 rounded-xl border text-xs transition-all flex items-center justify-between ${
                  isSelected 
                    ? 'bg-gradient-to-r from-blue-950/60 to-indigo-950/40 border-blue-500/40 text-blue-300 font-bold shadow-lg shadow-blue-950/30' 
                    : 'bg-[#0b0f19] border-white/5 text-gray-400 hover:text-gray-200 hover:border-white/10'
                }">
                  <span class="truncate">${topic.title}</span>
                  <i class="fa-solid fa-chevron-right text-[9px] ${isSelected ? 'text-blue-400' : 'text-gray-600'}"></i>
                </button>
              `;
            }).join("")}
          </div>
        </div>
      </div>

      <!-- Core Description & Brief Notes Area -->
      <div class="lg:col-span-3 flex flex-col gap-6">
        <!-- Topic Header Banner -->
        <div class="glass-panel p-6 rounded-2xl border-white/5 flex flex-col justify-between items-start gap-3 bg-gradient-to-r from-slate-900/90 via-blue-950/30 to-slate-900/90">
          <div>
            <div class="flex items-center gap-2 mb-1">
              <span class="text-[9px] text-blue-400 font-bold uppercase tracking-widest font-mono bg-blue-950/60 border border-blue-500/30 px-2.5 py-0.5 rounded">Silicon Engineering</span>
              <span class="text-[9px] text-emerald-400 font-bold font-mono bg-emerald-950/60 border border-emerald-500/30 px-2.5 py-0.5 rounded">Brief Topic Notes</span>
            </div>
            <h2 class="text-2xl font-heading font-extrabold text-white">${currentTopic.title}</h2>
            <p class="text-xs text-gray-400 font-sans leading-relaxed">${currentTopic.description || ""}</p>
          </div>
        </div>

        <!-- Brief Shortcuts & Formulas Cheat Sheet -->
        <div class="glass-panel p-6 rounded-2xl border-amber-500/20 bg-amber-950/10 shadow-lg shadow-amber-950/10">
          <div class="flex justify-between items-center mb-4 border-b border-amber-500/20 pb-3">
            <h3 class="text-xs font-heading font-bold text-amber-400 uppercase tracking-widest flex items-center gap-2">
              <i class="fa-solid fa-bolt text-amber-400 text-sm"></i> Key Shortcuts &amp; Formulas
            </h3>
            <span class="text-[10px] font-mono font-bold text-amber-300/80 bg-amber-950/60 border border-amber-500/30 px-2 py-0.5 rounded">Quick Reference</span>
          </div>
          <div class="bg-slate-950/60 p-4 rounded-xl border border-white/5">
            <ul class="grid grid-cols-1 md:grid-cols-2 gap-2.5 text-xs text-gray-200 font-mono leading-relaxed">
              ${(currentTopic.shortcuts || []).map(note => `
                <li class="flex items-start gap-2.5 bg-slate-900/60 p-2.5 rounded-lg border border-white/5">
                  <i class="fa-solid fa-check text-emerald-400 text-[10px] mt-1 shrink-0"></i>
                  <span>${note}</span>
                </li>
              `).join("")}
            </ul>
          </div>
        </div>

        <!-- Brief Theory Overview & Essential Concepts -->
        <div class="glass-panel p-6 rounded-2xl border-white/5 flex flex-col gap-4">
          <div class="flex items-center justify-between border-b border-white/5 pb-3">
            <h3 class="text-xs font-heading font-bold text-blue-400 uppercase tracking-widest flex items-center gap-2">
              <i class="fa-solid fa-book-open text-blue-400"></i> Brief Theory &amp; Core Concepts
            </h3>
            <span class="text-[10px] text-gray-400 font-mono">Summary Notes</span>
          </div>
          <div class="text-xs text-gray-300 leading-relaxed font-sans prose prose-invert max-w-none space-y-3">
            ${formatTheoryMarkdown(currentTopic.theory)}
          </div>
        </div>

        <!-- Practical Example (if available) -->
        ${currentTopic.example ? `
          <div class="glass-panel p-5 rounded-2xl border-purple-500/20 bg-purple-950/10">
            <h3 class="text-xs font-heading font-bold text-purple-400 uppercase tracking-widest mb-2.5 flex items-center gap-2">
              <i class="fa-solid fa-lightbulb text-purple-400"></i> Practical Design Tip / Example
            </h3>
            <div class="bg-slate-950/60 p-3.5 rounded-xl border border-white/5 text-xs text-gray-300 leading-relaxed font-sans">
              ${currentTopic.example}
            </div>
          </div>
        ` : ''}

        <!-- Important Interview Questions & Quick Answers -->
        <div class="glass-panel p-6 rounded-2xl border-white/5">
          <h3 class="text-xs font-heading font-bold text-amber-400 uppercase tracking-widest mb-4 flex items-center gap-2">
            <i class="fa-solid fa-comments text-amber-400"></i> Essential Concept Q&amp;A
          </h3>
          <div class="flex flex-col gap-3">
            ${(currentTopic.interviews || []).map((card, idx) => `
              <details class="bg-slate-900/60 border border-white/5 hover:border-white/10 rounded-xl p-3.5 transition-all">
                <summary class="text-xs font-heading font-bold text-white cursor-pointer select-none flex items-center justify-between">
                  <span>Q${idx + 1}: ${card.q}</span>
                  <i class="fa-solid fa-chevron-down text-[10px] text-gray-400"></i>
                </summary>
                <div class="text-xs text-gray-300 mt-2.5 font-mono leading-relaxed border-t border-white/5 pt-2.5 bg-slate-950/40 p-3 rounded-lg">
                  <strong class="text-emerald-400 block mb-1 font-sans">Quick Answer:</strong>
                  ${card.a}
                </div>
              </details>
            `).join("")}
          </div>
        </div>
      </div>
    </div>

    <!-- 6-PAGE INTERACTIVE HANDBOOK READER MODAL -->
    <div id="handbook-modal-backdrop" class="${handbookState.isOpen ? 'flex' : 'hidden'} fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md items-center justify-center p-4 sm:p-6 transition-all">
      <div class="bg-slate-900 border border-purple-500/30 rounded-2xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-fadeIn">
        <!-- Modal Header -->
        <div class="p-5 bg-gradient-to-r from-slate-950 via-purple-950/40 to-slate-950 border-b border-white/10 flex justify-between items-center">
          <div class="flex items-center gap-3">
            <div class="w-9 h-9 rounded-xl bg-purple-950/80 border border-purple-500/30 flex items-center justify-center text-purple-400 text-sm font-bold shadow-lg">
              <i class="fa-solid fa-book-open"></i>
            </div>
            <div>
              <span class="text-[10px] text-purple-400 font-mono font-bold uppercase tracking-wider block">Official Silicon Handbook</span>
              <h3 class="text-base font-heading font-extrabold text-white" id="handbook-title-display">
                ${currentTopic.title}
              </h3>
            </div>
          </div>
          
          <div class="flex items-center gap-3">
            <span class="text-xs font-mono font-bold text-amber-300 bg-amber-950/60 border border-amber-500/30 px-3 py-1 rounded-lg">
              Page ${handbookState.currentPage} of 6
            </span>
            <button onclick="closeTopicHandbook()" class="w-8 h-8 rounded-lg bg-slate-800 border border-white/10 hover:bg-rose-950/50 hover:text-rose-300 text-gray-400 flex items-center justify-center transition-colors">
              <i class="fa-solid fa-xmark text-sm"></i>
            </button>
          </div>
        </div>

        <!-- Page Progress Line -->
        <div class="w-full bg-slate-950 h-1 border-b border-white/5">
          <div class="bg-gradient-to-r from-blue-500 via-purple-500 to-amber-400 h-full transition-all duration-300" style="width: ${(handbookState.currentPage / 6) * 100}%"></div>
        </div>

        <!-- Modal Page Content -->
        <div class="p-6 overflow-y-auto flex-1 font-sans text-xs text-gray-300 leading-relaxed space-y-4" id="handbook-page-body">
          ${renderHandbookPageContent(handbookState.topicId, handbookState.currentPage)}
        </div>

        <!-- Modal Pagination Footer -->
        <div class="p-4 bg-slate-950 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-3">
          <div class="flex items-center gap-1.5 font-mono text-xs">
            ${Array.from({ length: 6 }, (_, pIdx) => {
              const pNum = pIdx + 1;
              const isCurr = pNum === handbookState.currentPage;
              return `
                <button onclick="setHandbookPage(${pNum})" class="w-7 h-7 rounded-lg text-xs font-bold transition-all flex items-center justify-center ${
                  isCurr 
                    ? 'bg-purple-650 text-white shadow-lg shadow-purple-500/30 border border-purple-400/50' 
                    : 'bg-slate-900 border border-white/10 text-gray-400 hover:text-white'
                }">
                  ${pNum}
                </button>
              `;
            }).join("")}
          </div>

          <div class="flex items-center gap-3">
            <button onclick="prevHandbookPage()" ${handbookState.currentPage === 1 ? 'disabled' : ''} 
                    class="px-4 py-2 rounded-xl bg-slate-900 border border-white/10 text-gray-300 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed text-xs font-mono font-bold flex items-center gap-2 transition-all">
              <i class="fa-solid fa-chevron-left text-[10px]"></i> Previous Page
            </button>
            <button onclick="nextHandbookPage()" ${handbookState.currentPage === 6 ? 'disabled' : ''} 
                    class="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white disabled:opacity-30 disabled:cursor-not-allowed text-xs font-mono font-bold flex items-center gap-2 shadow-lg shadow-purple-500/20 transition-all">
              Next Page <i class="fa-solid fa-chevron-right text-[10px]"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  `;
};

window.openTopicHandbook = function(topicId) {
  handbookState.isOpen = true;
  handbookState.topicId = topicId;
  handbookState.currentPage = 1;
  renderLearn();
};

window.closeTopicHandbook = function() {
  handbookState.isOpen = false;
  renderLearn();
};

window.setHandbookPage = function(page) {
  if (page >= 1 && page <= 6) {
    handbookState.currentPage = page;
    const body = document.getElementById("handbook-page-body");
    if (body) {
      body.innerHTML = renderHandbookPageContent(handbookState.topicId, page);
      body.scrollTop = 0;
    }
    renderLearn();
  }
};

window.nextHandbookPage = function() {
  if (handbookState.currentPage < 6) {
    setHandbookPage(handbookState.currentPage + 1);
  }
};

window.prevHandbookPage = function() {
  if (handbookState.currentPage > 1) {
    setHandbookPage(handbookState.currentPage - 1);
  }
};

function renderHandbookPageContent(topicId, pageNum) {
  const t = VLSIData.topics[topicId] || VLSIData.topics["digital-electronics"];
  
  switch(pageNum) {
    case 1:
      return `
        <div class="space-y-4">
          <div class="flex items-center justify-between border-b border-white/10 pb-2">
            <h4 class="text-sm font-heading font-extrabold text-blue-400">Page 1: Fundamental Principles &amp; Mathematical Definitions</h4>
            <span class="text-[10px] font-mono text-gray-400">Chapter 1.1</span>
          </div>
          <p class="text-gray-300 leading-relaxed font-sans">
            Welcome to Page 1 of the official engineering handbook for <strong>${t.title}</strong>. This chapter establishes the fundamental laws, binary abstractions, and baseline principles required for silicon design.
          </p>
          <div class="p-4 bg-slate-950 rounded-xl border border-white/5 font-mono text-xs text-emerald-400 space-y-2">
            <div class="font-bold text-white mb-1 border-b border-white/10 pb-1">Core Theoretical Takeaways:</div>
            <div>&bull; Primary Goal: Map continuous voltage signals into discrete binary logic levels (0 and 1).</div>
            <div>&bull; Signal Noise Margins: V_NMH = V_OH - V_IH and V_NML = V_IL - V_OL.</div>
            <div>&bull; Operating Voltages: Standard CMOS core VDD ranges from 0.7V (7nm FinFET) to 1.2V (28nm Planar).</div>
          </div>
          <div class="text-xs text-gray-300 leading-relaxed font-sans">
            ${t.theory}
          </div>
        </div>
      `;
    case 2:
      return `
        <div class="space-y-4">
          <div class="flex items-center justify-between border-b border-white/10 pb-2">
            <h4 class="text-sm font-heading font-extrabold text-purple-400">Page 2: Circuit Architectures &amp; Electrical Schematics</h4>
            <span class="text-[10px] font-mono text-gray-400">Chapter 1.2</span>
          </div>
          <p class="text-gray-300 leading-relaxed font-sans">
            Page 2 covers internal transistor schematics, gate topologies, and structural component layouts for <strong>${t.title}</strong>.
          </p>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div class="p-4 bg-slate-950 rounded-xl border border-purple-500/20">
              <strong class="text-purple-300 font-mono block mb-2">Pull-Up Network (PUN):</strong>
              <p class="text-gray-300 leading-relaxed">PUN uses PMOS transistors connected between VDD and the output node. PMOS conducts a strong logic 1 but weak logic 0 due to Vsg threshold limits.</p>
            </div>
            <div class="p-4 bg-slate-950 rounded-xl border border-blue-500/20">
              <strong class="text-blue-300 font-mono block mb-2">Pull-Down Network (PDN):</strong>
              <p class="text-gray-300 leading-relaxed">PDN uses NMOS transistors connected between the output node and GND. NMOS conducts a strong logic 0 but weak logic 1 due to Vgs threshold limits.</p>
            </div>
          </div>
          <div class="p-4 bg-slate-950/80 rounded-xl border border-white/5 font-mono text-[11px] text-amber-300 space-y-1">
            <div>// Transmission Gate Equation:</div>
            <div>assign Output = (Select) ? Input_A : 1'bz; // Parallel NMOS + PMOS TG</div>
          </div>
        </div>
      `;
    case 3:
      return `
        <div class="space-y-4">
          <div class="flex items-center justify-between border-b border-white/10 pb-2">
            <h4 class="text-sm font-heading font-extrabold text-amber-400">Page 3: Equations, Formulations &amp; Derivations</h4>
            <span class="text-[10px] font-mono text-gray-400">Chapter 1.3</span>
          </div>
          <p class="text-gray-300 leading-relaxed font-sans">
            Page 3 details mathematical formulations, propagation delay equations, and boolean reduction rules for <strong>${t.title}</strong>.
          </p>
          <div class="bg-slate-950 p-4 rounded-xl border border-white/5 font-mono text-xs text-gray-200 space-y-2">
            <div class="text-amber-400 font-bold mb-1">Key Equations Reference:</div>
            <div>1. De Morgan Sum Complement: ~(A + B) = ~A . ~B</div>
            <div>2. De Morgan Product Complement: ~(A . B) = ~A + ~B</div>
            <div>3. Dynamic Power Dissipation: P_dynamic = C_load * VDD^2 * f_clk * alpha</div>
            <div>4. Static Leakage Power: P_static = I_subthreshold * VDD + I_gate_leak * VDD</div>
            <div>5. Propagation Delay: t_pd = (t_pHL + t_pLH) / 2</div>
          </div>
        </div>
      `;
    case 4:
      return `
        <div class="space-y-4">
          <div class="flex items-center justify-between border-b border-white/10 pb-2">
            <h4 class="text-sm font-heading font-extrabold text-emerald-400">Page 4: Timing Waveforms &amp; Glitch Hazard Analysis</h4>
            <span class="text-[10px] font-mono text-gray-400">Chapter 1.4</span>
          </div>
          <p class="text-gray-300 leading-relaxed font-sans">
            Page 4 analyzes clock phase waveforms, setup/hold stability windows, and race conditions for <strong>${t.title}</strong>.
          </p>
          <div class="p-4 bg-slate-950 rounded-xl border border-emerald-500/20 font-mono text-xs space-y-2">
            <div class="text-emerald-400 font-bold">Timing Bounds Summary:</div>
            <div>&bull; Setup Time Constraint: T_arrival = T_clk1 + t_co + t_logic < T_period + T_clk2 - t_setup.</div>
            <div>&bull; Hold Time Constraint: T_arrival = T_clk1 + t_co + t_logic > T_clk2 + t_hold.</div>
            <div>&bull; Setup Slack: Setup Slack = Required Time - Arrival Time >= 0.</div>
            <div>&bull; Hold Slack: Hold Slack = Arrival Time - Required Time >= 0.</div>
          </div>
        </div>
      `;
    case 5:
      return `
        <div class="space-y-4">
          <div class="flex items-center justify-between border-b border-white/10 pb-2">
            <h4 class="text-sm font-heading font-extrabold text-cyan-400">Page 5: RTL Synthesis &amp; Verilog Coding Rules</h4>
            <span class="text-[10px] font-mono text-gray-400">Chapter 1.5</span>
          </div>
          <p class="text-gray-300 leading-relaxed font-sans">
            Page 5 presents synthesizable RTL coding styles, latch avoidance techniques, and procedural assignment rules for <strong>${t.title}</strong>.
          </p>
          <div class="bg-slate-950 p-4 rounded-xl border border-white/5 font-mono text-[11px] text-emerald-400 space-y-2">
            <div class="text-white font-bold">Synthesizable Verilog Guidelines:</div>
            <div>// Rule 1: Use non-blocking (<=) inside sequential always blocks</div>
            <div>always @(posedge clk or negedge rst_n) begin</div>
            <div>    if (!rst_n) q <= 1'b0;</div>
            <div>    else        q <= d;</div>
            <div>end</div>
            <div class="mt-2">// Rule 2: Use blocking (=) inside combinational always blocks</div>
            <div>always @(*) begin</div>
            <div>    y = a & b;</div>
            <div>end</div>
          </div>
        </div>
      `;
    case 6:
      return `
        <div class="space-y-4">
          <div class="flex items-center justify-between border-b border-white/10 pb-2">
            <h4 class="text-sm font-heading font-extrabold text-rose-400">Page 6: Industry Placement Benchmarks &amp; Exam Case Studies</h4>
            <span class="text-[10px] font-mono text-gray-400">Chapter 1.6</span>
          </div>
          <p class="text-gray-300 leading-relaxed font-sans">
            Page 6 concludes with real GATE, ISRO, Intel, Qualcomm, Cadence, and Synopsys placement test benchmarks and solved numerical problems for <strong>${t.title}</strong>.
          </p>
          <div class="p-4 bg-slate-950 rounded-xl border border-rose-500/20 space-y-3">
            <div class="font-mono text-xs font-bold text-rose-300">Benchmark Problem:</div>
            <p class="text-gray-300 text-xs leading-relaxed">
              Calculate the maximum operating clock frequency for a register-to-register path with T_co = 1.2 ns, T_logic = 4.8 ns, T_setup = 0.8 ns, and Clock Skew = 0.3 ns.
            </p>
            <div class="font-mono text-xs text-emerald-400 bg-slate-900 p-2.5 rounded-lg border border-white/5">
              <strong>Solution:</strong><br>
              Minimum Clock Period T_min = T_co + T_logic + T_setup - T_skew<br>
              T_min = 1.2 + 4.8 + 0.8 - 0.3 = 6.5 ns.<br>
              Max Frequency F_max = 1 / 6.5 ns = <strong>153.85 MHz</strong>.
            </div>
          </div>
        </div>
      `;
    default:
      return ``;
  }
}

function formatTheoryMarkdown(text) {
  if (!text) return "";

  let lines = text.split('\n');
  let html = "";

  lines.forEach(line => {
    let trimmed = line.trim();
    if (!trimmed) return;

    if (trimmed.startsWith("### ")) {
      html += `<h4 class="text-xs font-heading font-bold text-cyan-400 mt-4 mb-2 border-b border-white/10 pb-1 flex items-center gap-2">
        <i class="fa-solid fa-layer-group text-blue-400"></i> ${trimmed.replace("### ", "")}
      </h4>`;
    } else if (trimmed.startsWith("Key Concepts") || trimmed.endsWith(":")) {
      html += `<h4 class="text-xs font-heading font-extrabold text-white mt-3 mb-2 flex items-center gap-2">
        <i class="fa-solid fa-list-check text-amber-400"></i> ${trimmed}
      </h4>`;
    } else {
      let parts = trimmed.split(/(?=\d+\.\s)/g);
      parts.forEach(part => {
        let pTrimmed = part.trim();
        if (!pTrimmed) return;

        let numMatch = pTrimmed.match(/^(\d+)\.\s+(.*)/);
        if (numMatch) {
          let num = numMatch[1];
          let content = numMatch[2];
          
          let subItems = content.split(/\s*-\s+/g);
          let itemTitle = subItems[0];
          let bullets = subItems.slice(1);

          html += `
            <div class="bg-slate-900/60 p-4 rounded-xl border border-white/5 my-2.5 flex flex-col gap-2">
              <div class="flex items-center gap-2 text-xs font-heading font-bold text-cyan-300">
                <span class="w-5 h-5 rounded-full bg-cyan-950 border border-cyan-500/30 text-cyan-400 text-[10px] flex items-center justify-center font-mono font-bold">${num}</span>
                <span>${itemTitle}</span>
              </div>
              ${bullets.length > 0 ? `
                <ul class="flex flex-col gap-1.5 pl-2 sm:pl-4 text-xs text-gray-300 font-sans mt-1">
                  ${bullets.map(b => `
                    <li class="flex items-start gap-2 bg-slate-950/40 p-2 rounded-lg border border-white/5">
                      <span class="text-blue-400 text-xs mt-0.5 font-bold">&bull;</span>
                      <span>${b.replace(/\*\*(.*?)\*\*/g, '<strong class="text-white font-semibold">$1</strong>').replace(/`(.*?)`/g, '<code class="bg-slate-950 text-emerald-400 font-mono text-[10px] px-1 py-0.5 rounded border border-white/5">$1</code>')}</span>
                    </li>
                  `).join("")}
                </ul>
              ` : ''}
            </div>
          `;
        } else {
          let formattedPara = pTrimmed
            .replace(/\*\*(.*?)\*\*/g, '<strong class="text-blue-300 font-semibold">$1</strong>')
            .replace(/`(.*?)`/g, '<code class="bg-slate-950 text-emerald-400 font-mono text-[10px] px-1.5 py-0.5 rounded border border-white/5">$1</code>');
          html += `<p class="text-xs text-gray-300 leading-relaxed font-sans my-1.5">${formattedPara}</p>`;
        }
      });
    }
  });

  return html;
}

window.selectTopic = function(topicId) {
  activeTopicId = topicId;
  renderLearn();
  window.scrollTo({ top: 0, behavior: 'smooth' });
};
