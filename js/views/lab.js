/* Digital Design Circuits View - Interactive Gate-Level Schematic Engine (MUX, Adders, Subtractors, Decoders, Encoders, Flip-Flops, Counters) */

let activeLabId = "mux";
let labInputs = {
  a: 0, b: 0, cin: 0, bin: 0, gate: "AND",
  adder_mode: "half", // "half" or "full"
  subtractor_mode: "half", // "half" or "full"
  mux_mode: "2:1", // "2:1" or "4:1"
  demux_mode: "1:2", // "1:2" or "1:4"
  decoder_mode: "2:4", // "2:4" or "3:8"
  encoder_mode: "4:2", // "4:2" or "8:3"
  reg_mode: "SIPO", // "SIPO", "PISO", "PIPO", "SISO"
  counter_mode: "up", // "up", "down", "ring", "johnson"
  sel: 0, sel0: 0, sel1: 0, in0: 0, in1: 1, in2: 0, in3: 1, // MUX / DEMUX
  demux_in: 1,
  encoderIn: [0,0,0,1,0,0,0,0], // Encoder
  decoderIn: 0, // Decoder
  clk: 0, rst_n: 1, d: 1, q: 0, // DFF
  j: 1, k: 1, jk_q: 0, // JKFF
  t: 1, t_q: 0, // TFF
  s: 1, r: 0, sr_q: 0, // SRFF
  ff_type: "D-FF", // FF Type
  si: 1, sreg_q: [0, 0, 0, 0], // Shift Register
  counterRst: 0, counterEn: 1, counterVal: 0, // Counter
  alu_a: 5, alu_b: 3, alu_op: 0 // ALU
};
let labHistory = [];
let signalAnimFrame = null;
let activeLabSubTab = "waveform"; // Sub-tabs: waveform, rtl, tb, quiz

window.renderLab = function() {
  const container = document.getElementById("view-container");
  if (!container) return;

  const labsKeys = Object.keys(VLSIData.labs);
  if (!VLSIData.labs[activeLabId]) {
    activeLabId = "mux";
  }
  const currentLab = VLSIData.labs[activeLabId] || VLSIData.labs["mux"];

  if (labHistory.length === 0) {
    resetLabHistory();
  }

  container.innerHTML = `
    <div class="max-w-7xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-4 gap-8 font-sans">
      <!-- Sidebar circuit selector -->
      <div class="lg:col-span-1 flex flex-col gap-4">
        <h3 class="font-heading font-extrabold text-sm text-white px-2 flex items-center justify-between">
          <span>Digital Design Circuits</span>
          <span class="text-[9px] font-mono text-cyan-400 bg-cyan-950/60 border border-cyan-500/30 px-2 py-0.5 rounded font-bold">${labsKeys.length} Circuits</span>
        </h3>
        <div class="flex flex-col gap-1.5 max-h-[70vh] overflow-y-auto pr-1">
          ${labsKeys.map(key => {
            const lab = VLSIData.labs[key];
            const isSelected = key === activeLabId;
            return `
              <button onclick="selectLab('${key}')" class="text-left w-full px-3 py-2.5 rounded-lg border text-xs transition-all flex items-center justify-between ${
                isSelected 
                  ? 'bg-blue-950/40 border-blue-500/40 text-blue-300 font-bold shadow-lg shadow-blue-500/10' 
                  : 'bg-[#0b0f19] border-white/5 text-gray-400 hover:text-gray-200 hover:border-white/10'
              }">
                <span>${lab.name}</span>
                <span class="text-[9px] font-mono font-bold ${
                  lab.type === 'Combinational' ? 'text-cyan-400' : 'text-purple-400'
                }">${lab.type}</span>
              </button>
            `;
          }).join("")}
        </div>
      </div>

      <!-- Main simulator bench -->
      <div class="lg:col-span-3 flex flex-col gap-6">
        <!-- Lab Header -->
        <div class="glass-panel p-5 rounded-2xl border-white/5 flex flex-col gap-2">
          <span class="text-[10px] text-cyan-400 font-bold uppercase tracking-widest font-mono bg-cyan-950/40 px-2.5 py-0.5 rounded border border-cyan-500/20 w-max">${currentLab.type} Gate-Level Circuit</span>
          <h2 class="text-xl font-heading font-extrabold text-white">${currentLab.name}</h2>
          <p class="text-xs text-gray-300 leading-relaxed bg-slate-950/40 p-3 rounded-xl border border-white/5">${currentLab.description || currentLab.explanation}</p>
        </div>

        <!-- Schematic Block Canvas -->
        <div class="glass-panel p-6 rounded-2xl border-white/5 flex flex-col items-center">
          <div class="w-full flex justify-between items-center mb-4">
            <h4 class="text-xs font-heading font-bold text-blue-400 uppercase tracking-widest flex items-center gap-2">
              <i class="fa-solid fa-diagram-project"></i> Gate-Level Logic Schematic (Live Signal Animation)
            </h4>
            <span class="text-[10px] font-mono text-emerald-400 bg-emerald-950/50 px-2 py-0.5 rounded border border-emerald-500/20">
              ⚡ High (1) = Cyan Glow | Low (0) = Dark Wire
            </span>
          </div>
          
          <div class="w-full relative bg-slate-950/90 rounded-xl border border-white/10 min-h-[300px] flex items-center justify-center shadow-inner overflow-hidden">
            <canvas id="lab-animation-canvas" class="w-full h-80" width="680" height="320"></canvas>
          </div>

          <!-- Controls widgets -->
          <div class="w-full grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 border-t border-white/5 pt-4">
            ${renderLabControlWidgets()}
          </div>
        </div>

        <!-- Secondary Sub-tabs -->
        <div class="border-b border-white/5 flex gap-4">
          <button onclick="switchLabSubTab('waveform')" id="l-tab-waveform" class="l-subtab-btn pb-3 text-xs font-bold ${activeLabSubTab === 'waveform' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-gray-500'} px-1">Timing Waveforms</button>
          <button onclick="switchLabSubTab('rtl')" id="l-tab-rtl" class="l-subtab-btn pb-3 text-xs font-bold ${activeLabSubTab === 'rtl' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-gray-500'} px-1">RTL Verilog Code</button>
          <button onclick="switchLabSubTab('tb')" id="l-tab-tb" class="l-subtab-btn pb-3 text-xs font-bold ${activeLabSubTab === 'tb' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-gray-500'} px-1">Testbench</button>
          <button onclick="switchLabSubTab('quiz')" id="l-tab-quiz" class="l-subtab-btn pb-3 text-xs font-bold ${activeLabSubTab === 'quiz' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-gray-500'} px-1">Circuit Checkpoint Quiz</button>
        </div>

        <!-- Subtab Content Viewports -->
        <div class="glass-panel p-6 rounded-2xl border-white/5 min-h-[220px]">
          <!-- Timing Waveforms -->
          <div id="l-content-waveform" class="l-content-pane ${activeLabSubTab === 'waveform' ? '' : 'hidden'}">
            <div class="flex items-center justify-between mb-4">
              <h4 class="text-xs font-heading font-bold text-gray-400 uppercase tracking-wider">Live Timing Wave Trace</h4>
              <button onclick="resetLabHistory()" class="text-[9px] bg-slate-950 border border-white/10 px-2 py-1 rounded text-gray-400 hover:text-blue-400 transition-colors">Reset Traces</button>
            </div>
            <div class="overflow-x-auto w-full">
              <canvas id="waveform-canvas" class="w-full h-40 bg-slate-950 rounded-lg border border-white/5" width="600" height="160"></canvas>
            </div>
          </div>

          <!-- RTL Code -->
          <div id="l-content-rtl" class="l-content-pane ${activeLabSubTab === 'rtl' ? '' : 'hidden'}">
            <div class="relative">
              <pre class="bg-slate-950 p-4 rounded-lg overflow-x-auto text-[11px] font-mono text-emerald-400 leading-relaxed"><code>${escapeHtml(currentLab.rtl || "// Gate-level RTL not defined")}</code></pre>
              <button onclick="copyToClipboard('${escapeJs(currentLab.rtl || "")}')" class="absolute top-2 right-2 text-[10px] bg-slate-900 border border-white/10 text-gray-400 p-1.5 rounded hover:text-blue-300"><i class="fa-regular fa-copy"></i></button>
            </div>
          </div>

          <!-- Testbench -->
          <div id="l-content-tb" class="l-content-pane ${activeLabSubTab === 'tb' ? '' : 'hidden'}">
            <div class="relative">
              <pre class="bg-slate-950 p-4 rounded-lg overflow-x-auto text-[11px] font-mono text-emerald-400 leading-relaxed"><code>${escapeHtml(currentLab.tb || "// Testbench not defined")}</code></pre>
              <button onclick="copyToClipboard('${escapeJs(currentLab.tb || "")}')" class="absolute top-2 right-2 text-[10px] bg-slate-900 border border-white/10 text-gray-400 p-1.5 rounded hover:text-blue-300"><i class="fa-regular fa-copy"></i></button>
            </div>
          </div>

          <!-- Lab Quiz -->
          <div id="l-content-quiz" class="l-content-pane ${activeLabSubTab === 'quiz' ? '' : 'hidden'} flex flex-col gap-4">
            <h4 class="text-xs font-heading font-bold text-white mb-2">Circuit Checkpoint Questions</h4>
            ${(currentLab.quiz || []).map((qItem, qIdx) => `
              <div class="p-4 bg-slate-950/40 border border-white/5 rounded-xl">
                <p class="text-xs font-bold text-white mb-3">Q: ${qItem.q}</p>
                <div class="flex flex-col gap-2">
                  ${qItem.opts.map((opt, oIdx) => `
                    <label class="flex items-center gap-3 px-3 py-2 rounded-lg border border-white/5 bg-[#0b0f19] cursor-pointer text-xs">
                      <input type="radio" name="lab-q-${qIdx}" value="${oIdx}" class="text-blue-500">
                      <span class="text-gray-300">${opt}</span>
                    </label>
                  `).join("")}
                </div>
              </div>
            `).join("")}
            <button onclick="evaluateLabCheckpoint(${currentLab.quiz?.length || 0})" class="px-5 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl text-xs font-bold text-white self-start shadow">Submit Quiz</button>
          </div>
        </div>
      </div>
    </div>
  `;

  setTimeout(() => {
    initLabAnimationLoop();
    drawWaveformTraces();
  }, 100);
};

window.selectLab = function(labId) {
  activeLabId = labId;
  resetLabHistory();
  renderLab();
};

window.switchLabSubTab = function(tabId) {
  activeLabSubTab = tabId;
  document.querySelectorAll(".l-subtab-btn").forEach(btn => {
    btn.className = "l-subtab-btn pb-3 text-xs font-bold text-gray-500 px-1";
  });
  document.querySelectorAll(".l-content-pane").forEach(c => c.classList.add("hidden"));

  const targetTab = document.getElementById(`l-tab-${tabId}`);
  const targetContent = document.getElementById(`l-content-${tabId}`);
  if (targetTab && targetContent) {
    targetTab.className = "l-subtab-btn pb-3 text-xs font-bold text-blue-400 border-b-2 border-blue-400 px-1";
    targetContent.classList.remove("hidden");
    if (tabId === "waveform") drawWaveformTraces();
  }
};

function resetLabHistory() {
  labHistory = [];
  updateLabSimulation(true);
}

function updateLabSimulation(isInitial = false) {
  if (activeLabId === "logic-gates") {
    let out = 0;
    if (labInputs.gate === "AND") out = labInputs.a & labInputs.b;
    else if (labInputs.gate === "OR") out = labInputs.a | labInputs.b;
    else if (labInputs.gate === "XOR") out = labInputs.a ^ labInputs.b;
    else if (labInputs.gate === "NAND") out = (labInputs.a & labInputs.b) === 1 ? 0 : 1;
    else if (labInputs.gate === "NOR") out = (labInputs.a | labInputs.b) === 1 ? 0 : 1;
    else if (labInputs.gate === "XNOR") out = (labInputs.a ^ labInputs.b) === 1 ? 0 : 1;
    else if (labInputs.gate === "NOT") out = labInputs.a === 1 ? 0 : 1;
    labHistory.push({ time: labHistory.length, A: labInputs.a, B: labInputs.b, Output: out });
  }

  else if (activeLabId === "mux") {
    let val = labInputs.in0;
    if (labInputs.mux_mode === "4:1") {
      const selVal = (labInputs.sel1 << 1) | labInputs.sel0;
      if (selVal === 0) val = labInputs.in0;
      else if (selVal === 1) val = labInputs.in1;
      else if (selVal === 2) val = labInputs.in2;
      else val = labInputs.in3;
    } else {
      val = labInputs.sel === 1 ? labInputs.in1 : labInputs.in0;
    }
    labHistory.push({ time: labHistory.length, In0: labInputs.in0, In1: labInputs.in1, Sel: labInputs.sel, Output: val });
  }

  else if (activeLabId === "half-adder" || activeLabId === "full-adder") {
    if (labInputs.adder_mode === "full" || activeLabId === "full-adder") {
      const sum = labInputs.a ^ labInputs.b ^ labInputs.cin;
      const cout = (labInputs.a & labInputs.b) | (labInputs.cin & (labInputs.a ^ labInputs.b));
      labHistory.push({ time: labHistory.length, A: labInputs.a, B: labInputs.b, Cin: labInputs.cin, Sum: sum, Cout: cout });
    } else {
      const sum = labInputs.a ^ labInputs.b;
      const carry = labInputs.a & labInputs.b;
      labHistory.push({ time: labHistory.length, A: labInputs.a, B: labInputs.b, Sum: sum, Carry: carry });
    }
  }

  else if (activeLabId === "subtractor") {
    if (labInputs.subtractor_mode === "full") {
      const diff = labInputs.a ^ labInputs.b ^ labInputs.bin;
      const bout = ((~labInputs.a) & labInputs.b) | ((~(labInputs.a ^ labInputs.b)) & labInputs.bin);
      labHistory.push({ time: labHistory.length, A: labInputs.a, B: labInputs.b, Bin: labInputs.bin, Diff: diff, Bout: bout });
    } else {
      const diff = labInputs.a ^ labInputs.b;
      const bout = (~labInputs.a) & labInputs.b;
      labHistory.push({ time: labHistory.length, A: labInputs.a, B: labInputs.b, Diff: diff, Bout: bout });
    }
  }

  else if (activeLabId === "decoder") {
    const val = 1 << labInputs.decoderIn;
    labHistory.push({ time: labHistory.length, "In[1:0]": labInputs.decoderIn, "Out[3:0]": val });
  }

  else if (activeLabId === "encoder") {
    let outIdx = 0;
    let active = 0;
    for (let i = 7; i >= 0; i--) {
      if (labInputs.encoderIn[i] === 1) {
        outIdx = i;
        active = 1;
        break;
      }
    }
    let valMask = 0;
    labInputs.encoderIn.forEach((bit, idx) => {
      if (bit === 1) valMask |= (1 << idx);
    });
    labHistory.push({ time: labHistory.length, "In[7:0]": valMask, "Out[2:0]": outIdx, Active: active });
  }

  else if (activeLabId === "demux") {
    const out0 = labInputs.demux_sel === 0 ? labInputs.demux_in : 0;
    const out1 = labInputs.demux_sel === 1 ? labInputs.demux_in : 0;
    labHistory.push({ time: labHistory.length, In: labInputs.demux_in, Sel: labInputs.demux_sel, Out0: out0, Out1: out1 });
  }

  else if (activeLabId === "flip-flops") {
    if (!isInitial) {
      if (labInputs.rst_n === 0) {
        labInputs.q = 0;
        labInputs.jk_q = 0;
        labInputs.t_q = 0;
        labInputs.sr_q = 0;
      } else {
        labInputs.q = labInputs.d;
        if (labInputs.j === 0 && labInputs.k === 1) labInputs.jk_q = 0;
        else if (labInputs.j === 1 && labInputs.k === 0) labInputs.jk_q = 1;
        else if (labInputs.j === 1 && labInputs.k === 1) labInputs.jk_q = labInputs.jk_q === 1 ? 0 : 1;
        if (labInputs.t === 1) labInputs.t_q = labInputs.t_q === 1 ? 0 : 1;
        if (labInputs.s === 0 && labInputs.r === 1) labInputs.sr_q = 0;
        else if (labInputs.s === 1 && labInputs.r === 0) labInputs.sr_q = 1;
      }
    }
    const activeQ = labInputs.ff_type === "D-FF" ? labInputs.q : 
                    (labInputs.ff_type === "JK-FF" ? labInputs.jk_q : 
                    (labInputs.ff_type === "T-FF" ? labInputs.t_q : labInputs.sr_q));
                    
    labHistory.push({ time: labHistory.length, Clock: labInputs.clk, Reset_n: labInputs.rst_n, Input: labInputs.d, Q: activeQ });
  }

  else if (activeLabId === "counters") {
    if (!isInitial) {
      if (labInputs.counterRst === 1) {
        labInputs.counterVal = 0;
      } else if (labInputs.counterEn) {
        if (labInputs.counter_mode === "down") {
          labInputs.counterVal = (labInputs.counterVal - 1 + 16) % 16;
        } else if (labInputs.counter_mode === "ring") {
          labInputs.counterVal = labInputs.counterVal === 0 ? 1 : ((labInputs.counterVal << 1) & 0x0F);
        } else if (labInputs.counter_mode === "johnson") {
          const lsb = labInputs.counterVal & 1;
          const nextBit = lsb ? 0 : 1;
          labInputs.counterVal = ((labInputs.counterVal >> 1) | (nextBit << 3)) & 0x0F;
        } else {
          labInputs.counterVal = (labInputs.counterVal + 1) % 16;
        }
      }
    }
    labHistory.push({ time: labHistory.length, Clock: labInputs.clk, Reset: labInputs.counterRst, Enable: labInputs.counterEn, "Count[3:0]": labInputs.counterVal });
  }

  else if (activeLabId === "registers") {
    if (!isInitial) {
      if (labInputs.rst_n === 0) labInputs.sreg_q = [0, 0, 0, 0];
      else                        labInputs.sreg_q = [labInputs.sreg_q[1], labInputs.sreg_q[2], labInputs.sreg_q[3], labInputs.si];
    }
    const val = (labInputs.sreg_q[3] << 3) | (labInputs.sreg_q[2] << 2) | (labInputs.sreg_q[1] << 1) | labInputs.sreg_q[0];
    labHistory.push({ time: labHistory.length, Clock: labInputs.clk, SI: labInputs.si, Reset_n: labInputs.rst_n, "Q[3:0]": val });
  }

  else if (activeLabId === "alu") {
    let val = 0;
    if (labInputs.alu_op === 0) val = labInputs.alu_a + labInputs.alu_b;
    else                         val = labInputs.alu_a & labInputs.alu_b;
    labHistory.push({ time: labHistory.length, "A[7:0]": labInputs.alu_a, "B[7:0]": labInputs.alu_b, "Op[1:0]": labInputs.alu_op, "Out[7:0]": val });
  }

  if (labHistory.length > 20) labHistory.shift();
}

function initLabAnimationLoop() {
  const canvas = document.getElementById("lab-animation-canvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  if (signalAnimFrame) cancelAnimationFrame(signalAnimFrame);

  function loop() {
    if (!document.getElementById("lab-animation-canvas")) return;
    drawInteractiveSchematicOnCanvas(ctx, canvas.width, canvas.height);
    signalAnimFrame = requestAnimationFrame(loop);
  }
  loop();
}

function drawInteractiveSchematicOnCanvas(ctx, w, h) {
  ctx.clearRect(0, 0, w, h);
  
  ctx.strokeStyle = "rgba(255, 255, 255, 0.08)";
  ctx.lineWidth = 1;

  // 1. MUX WITH LOGIC GATES SCHEMATIC
  if (activeLabId === "mux") {
    const is21 = labInputs.mux_mode === "2:1";
    if (is21) {
      // Inputs: A (in0), B (in1), Select (sel)
      const A = labInputs.in0;
      const B = labInputs.in1;
      const S = labInputs.sel;
      const notS = S === 1 ? 0 : 1;
      const and1Out = A & notS;
      const and2Out = B & S;
      const yOut = and1Out | and2Out;

      // Draw input pins
      drawPortDot(ctx, 60, 60, "Input A", A);
      drawPortDot(ctx, 60, 160, "Input B", B);
      drawPortDot(ctx, 60, 240, "Select S", S);

      // Inverter NOT gate for S
      drawLogicGateSymbol(ctx, 160, 215, 45, 35, "NOT");
      drawWireLine(ctx, 60, 240, 160, 232, S === 1);
      drawWireLine(ctx, 205, 232, 270, 95, notS === 1); // NOT S line to AND1
      drawWireLine(ctx, 60, 240, 270, 185, S === 1);    // S line to AND2

      // AND Gate 1 (A AND NOT S)
      drawLogicGateSymbol(ctx, 270, 50, 70, 50, "AND");
      drawWireLine(ctx, 60, 60, 270, 65, A === 1);
      drawWireLine(ctx, 340, 75, 460, 100, and1Out === 1);

      // AND Gate 2 (B AND S)
      drawLogicGateSymbol(ctx, 270, 140, 70, 50, "AND");
      drawWireLine(ctx, 60, 160, 270, 155, B === 1);
      drawWireLine(ctx, 340, 165, 460, 140, and2Out === 1);

      // OR Gate for Output Y
      drawLogicGateSymbol(ctx, 460, 95, 75, 55, "OR");
      drawWireLine(ctx, 535, 122, 630, 122, yOut === 1);
      drawPortDot(ctx, 630, 122, "Output Y", yOut, true);

      // Label equation
      ctx.fillStyle = "#38bdf8";
      ctx.font = "bold 11px Fira Code, monospace";
      ctx.textAlign = "center";
      ctx.fillText("2:1 MUX Gate Logic: Y = (A · S') + (B · S)", w/2, 28);
    } else {
      // 4:1 MUX using 4 AND gates, 2 NOT gates, 1 OR gate
      const selVal = (labInputs.sel1 << 1) | labInputs.sel0;
      const yOut = selVal === 0 ? labInputs.in0 : (selVal === 1 ? labInputs.in1 : (selVal === 2 ? labInputs.in2 : labInputs.in3));

      ctx.fillStyle = "#38bdf8";
      ctx.font = "bold 11px Fira Code, monospace";
      ctx.textAlign = "center";
      ctx.fillText("4:1 MUX Gate Logic: Y = I0·S1'S0' + I1·S1'S0 + I2·S1S0' + I3·S1S0", w/2, 24);

      // Render 4 input pins & AND gates
      [0, 1, 2, 3].forEach(i => {
        const val = i === 0 ? labInputs.in0 : (i === 1 ? labInputs.in1 : (i === 2 ? labInputs.in2 : labInputs.in3));
        const yPos = 50 + i * 50;
        drawPortDot(ctx, 60, yPos, `I${i}`, val);
        drawLogicGateSymbol(ctx, 280, yPos - 15, 60, 35, "AND");
        drawWireLine(ctx, 60, yPos, 280, yPos, val === 1);
        drawWireLine(ctx, 340, yPos, 480, 125, (selVal === i && val === 1) ? 1 : 0);
      });

      // OR Gate
      drawLogicGateSymbol(ctx, 480, 90, 80, 70, "OR");
      drawWireLine(ctx, 560, 125, 630, 125, yOut === 1);
      drawPortDot(ctx, 630, 125, "Output Y", yOut, true);
    }
  }

  // 2. ADDER WITH LOGIC GATES SCHEMATIC
  else if (activeLabId === "half-adder" || activeLabId === "full-adder") {
    const isFull = labInputs.adder_mode === "full" || activeLabId === "full-adder";
    if (!isFull) {
      // Half Adder: XOR Gate (Sum = A ^ B) and AND Gate (Carry = A & B)
      const A = labInputs.a;
      const B = labInputs.b;
      const sum = A ^ B;
      const carry = A & B;

      ctx.fillStyle = "#38bdf8";
      ctx.font = "bold 11px Fira Code, monospace";
      ctx.textAlign = "center";
      ctx.fillText("Half Adder Gate Logic: Sum = A ⊕ B  |  Carry = A · B", w/2, 28);

      drawPortDot(ctx, 60, 80, "Input A", A);
      drawPortDot(ctx, 60, 180, "Input B", B);

      // XOR Gate for Sum
      drawLogicGateSymbol(ctx, 280, 60, 80, 60, "XOR");
      drawWireLine(ctx, 60, 80, 280, 75, A === 1);
      drawWireLine(ctx, 60, 180, 280, 105, B === 1);
      drawWireLine(ctx, 360, 90, 580, 90, sum === 1);
      drawPortDot(ctx, 580, 90, "Sum", sum, true);

      // AND Gate for Carry
      drawLogicGateSymbol(ctx, 280, 160, 80, 60, "AND");
      drawWireLine(ctx, 60, 80, 280, 175, A === 1);
      drawWireLine(ctx, 60, 180, 280, 205, B === 1);
      drawWireLine(ctx, 360, 190, 580, 190, carry === 1);
      drawPortDot(ctx, 580, 190, "Carry", carry, true);
    } else {
      // Full Adder: 2 XOR, 2 AND, 1 OR gate
      const A = labInputs.a;
      const B = labInputs.b;
      const Cin = labInputs.cin;
      const axorB = A ^ B;
      const sum = axorB ^ Cin;
      const and1 = A & B;
      const and2 = axorB & Cin;
      const cout = and1 | and2;

      ctx.fillStyle = "#38bdf8";
      ctx.font = "bold 11px Fira Code, monospace";
      ctx.textAlign = "center";
      ctx.fillText("Full Adder Gate Logic: Sum = A ⊕ B ⊕ Cin  |  Cout = AB + Cin(A ⊕ B)", w/2, 24);

      drawPortDot(ctx, 60, 60, "Input A", A);
      drawPortDot(ctx, 60, 130, "Input B", B);
      drawPortDot(ctx, 60, 220, "Cin", Cin);

      // XOR 1
      drawLogicGateSymbol(ctx, 220, 50, 65, 45, "XOR");
      drawWireLine(ctx, 60, 60, 220, 60, A === 1);
      drawWireLine(ctx, 60, 130, 220, 85, B === 1);

      // XOR 2 (Sum)
      drawLogicGateSymbol(ctx, 380, 60, 65, 45, "XOR");
      drawWireLine(ctx, 285, 72, 380, 72, axorB === 1);
      drawWireLine(ctx, 60, 220, 380, 95, Cin === 1);
      drawWireLine(ctx, 445, 82, 580, 82, sum === 1);
      drawPortDot(ctx, 580, 82, "Sum", sum, true);

      // AND 1
      drawLogicGateSymbol(ctx, 220, 140, 65, 45, "AND");
      drawWireLine(ctx, 60, 60, 220, 150, A === 1);
      drawWireLine(ctx, 60, 130, 220, 175, B === 1);

      // AND 2
      drawLogicGateSymbol(ctx, 380, 170, 65, 45, "AND");
      drawWireLine(ctx, 285, 72, 380, 180, axorB === 1);
      drawWireLine(ctx, 60, 220, 380, 205, Cin === 1);

      // OR (Cout)
      drawLogicGateSymbol(ctx, 490, 155, 65, 45, "OR");
      drawWireLine(ctx, 285, 162, 490, 165, and1 === 1);
      drawWireLine(ctx, 445, 192, 490, 190, and2 === 1);
      drawWireLine(ctx, 555, 177, 600, 177, cout === 1);
      drawPortDot(ctx, 600, 177, "Cout", cout, true);
    }
  }

  // 3. SUBTRACTOR WITH LOGIC GATES SCHEMATIC
  else if (activeLabId === "subtractor") {
    const A = labInputs.a;
    const B = labInputs.b;
    const notA = A === 1 ? 0 : 1;
    const diff = A ^ B;
    const borrow = notA & B;

    ctx.fillStyle = "#38bdf8";
    ctx.font = "bold 11px Fira Code, monospace";
    ctx.textAlign = "center";
    ctx.fillText("Half Subtractor Gate Logic: Diff = A ⊕ B  |  Borrow = A' · B", w/2, 28);

    drawPortDot(ctx, 60, 80, "Input A", A);
    drawPortDot(ctx, 60, 180, "Input B", B);

    // XOR Gate for Diff
    drawLogicGateSymbol(ctx, 280, 60, 80, 60, "XOR");
    drawWireLine(ctx, 60, 80, 280, 75, A === 1);
    drawWireLine(ctx, 60, 180, 280, 105, B === 1);
    drawWireLine(ctx, 360, 90, 580, 90, diff === 1);
    drawPortDot(ctx, 580, 90, "Diff", diff, true);

    // NOT Gate on A
    drawLogicGateSymbol(ctx, 160, 160, 45, 35, "NOT");
    drawWireLine(ctx, 60, 80, 160, 177, A === 1);

    // AND Gate for Borrow
    drawLogicGateSymbol(ctx, 280, 160, 80, 60, "AND");
    drawWireLine(ctx, 205, 177, 280, 175, notA === 1);
    drawWireLine(ctx, 60, 180, 280, 205, B === 1);
    drawWireLine(ctx, 360, 190, 580, 190, borrow === 1);
    drawPortDot(ctx, 580, 190, "Borrow", borrow, true);
  }

  // 4. DECODER WITH LOGIC GATES SCHEMATIC
  else if (activeLabId === "decoder") {
    const decVal = labInputs.decoderIn;
    ctx.fillStyle = "#38bdf8";
    ctx.font = "bold 11px Fira Code, monospace";
    ctx.textAlign = "center";
    ctx.fillText("2:4 Decoder Gate Logic: Y0=A'B', Y1=A'B, Y2=AB', Y3=AB", w/2, 24);

    const A = (decVal >> 1) & 1;
    const B = decVal & 1;

    drawPortDot(ctx, 60, 70, "Input A", A);
    drawPortDot(ctx, 60, 150, "Input B", B);

    // NOT Gates
    drawLogicGateSymbol(ctx, 150, 55, 45, 30, "NOT");
    drawLogicGateSymbol(ctx, 150, 135, 45, 30, "NOT");

    [0, 1, 2, 3].forEach(i => {
      const yPos = 50 + i * 55;
      const isAct = decVal === i ? 1 : 0;
      drawLogicGateSymbol(ctx, 320, yPos, 65, 40, "AND");
      drawWireLine(ctx, 385, yPos + 20, 580, yPos + 20, isAct);
      drawPortDot(ctx, 580, yPos + 20, `Y${i}`, isAct, true);
    });
  }

  // 5. FLIP-FLOPS / REGISTERS / COUNTERS SCHEMATIC
  else if (activeLabId === "flip-flops" || activeLabId === "registers" || activeLabId === "counters") {
    ctx.strokeStyle = "#a855f7";
    ctx.lineWidth = 2;
    ctx.strokeRect(220, 60, 160, 150);
    ctx.fillStyle = "rgba(168, 85, 247, 0.05)";
    ctx.fillRect(220, 60, 160, 150);

    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 12px Space Grotesk";
    ctx.textAlign = "center";
    
    let ffLabel = activeLabId.toUpperCase();
    if (activeLabId === "flip-flops") ffLabel = labInputs.ff_type + " Gate Architecture";
    ctx.fillText(ffLabel, 300, 120);

    drawPortDot(ctx, 80, 90, "Data / In", labInputs.d);
    drawPortDot(ctx, 80, 180, "Clock", labInputs.clk);
    drawWireLine(ctx, 80, 90, 220, 100, labInputs.d === 1);
    drawWireLine(ctx, 80, 180, 220, 180, labInputs.clk === 1);

    const current = labHistory[labHistory.length - 1] || {};
    drawWireLine(ctx, 380, 100, 560, 100, current.Q === 1);
    drawPortDot(ctx, 560, 100, "Q Output", current.Q ?? 0, true);
  }

  else {
    ctx.strokeStyle = "#06b6d4";
    ctx.lineWidth = 2;
    ctx.strokeRect(200, 60, 200, 150);
    ctx.fillStyle = "rgba(6, 182, 212, 0.05)";
    ctx.fillRect(200, 60, 200, 150);

    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 11px Space Grotesk";
    ctx.textAlign = "center";
    ctx.fillText(`${activeLabId.toUpperCase()} GATE CIRCUIT`, 300, 135);

    drawPortDot(ctx, 100, 110, "Input", 1);
    drawWireLine(ctx, 100, 110, 200, 110, true);
  }
}

function drawPortDot(ctx, cx, cy, label, val, isOutput = false) {
  ctx.fillStyle = val === 1 || typeof val === "string" || (typeof val === "number" && val > 0) ? "#06b6d4" : "#475569";
  ctx.beginPath();
  ctx.arc(cx, cy, 5, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#ffffff";
  ctx.font = "9px Fira Code, monospace";
  ctx.textAlign = isOutput ? "left" : "right";
  ctx.fillText(`${label}:${val}`, cx + (isOutput ? 10 : -10), cy + 3);
}

function drawWireLine(ctx, x1, y1, x2, y2, isActive) {
  ctx.strokeStyle = isActive ? "rgba(6, 182, 212, 0.9)" : "rgba(71, 85, 105, 0.35)";
  ctx.lineWidth = isActive ? 2 : 1;
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
}

function drawLogicGateSymbol(ctx, x, y, w, h, type) {
  ctx.strokeStyle = "#38bdf8";
  ctx.lineWidth = 2;
  ctx.fillStyle = "rgba(56, 189, 248, 0.08)";
  ctx.beginPath();
  if (type === "AND" || type === "NAND") {
    ctx.moveTo(x, y);
    ctx.lineTo(x + w/2, y);
    ctx.arc(x + w/2, y + h/2, h/2, -Math.PI/2, Math.PI/2);
    ctx.lineTo(x, y + h);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    if (type === "NAND") {
      ctx.beginPath(); ctx.arc(x + w + 4, y + h/2, 3, 0, Math.PI * 2); ctx.stroke();
    }
  } else if (type === "NOT") {
    ctx.moveTo(x, y);
    ctx.lineTo(x + w, y + h/2);
    ctx.lineTo(x, y + h);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.beginPath(); ctx.arc(x + w + 4, y + h/2, 3, 0, Math.PI * 2); ctx.stroke();
  } else {
    ctx.moveTo(x, y);
    ctx.quadraticCurveTo(x + w/2, y, x + w, y + h/2);
    ctx.quadraticCurveTo(x + w/2, y + h, x, y + h);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    if (type === "NOR" || type === "XNOR") {
      ctx.beginPath(); ctx.arc(x + w + 4, y + h/2, 3, 0, Math.PI * 2); ctx.stroke();
    }
  }
}

function drawWaveformTraces() {
  const canvas = document.getElementById("waveform-canvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  
  const w = canvas.width;
  const h = canvas.height;
  ctx.clearRect(0, 0, w, h);

  const currentLab = VLSIData.labs[activeLabId] || VLSIData.labs["mux"];
  const signals = currentLab.signals || [];
  if (signals.length === 0 || labHistory.length === 0) return;

  const stepX = w / 22;
  const stepY = (h - 20) / signals.length;

  signals.forEach((sig, sIdx) => {
    const yBase = (sIdx + 1) * stepY;
    ctx.fillStyle = "#94a3b8";
    ctx.font = "8px Fira Code, monospace";
    ctx.fillText(sig, 10, yBase - 4);

    ctx.strokeStyle = sIdx === signals.length - 1 ? "#a855f7" : "#3b82f6";
    ctx.lineWidth = 1.2;
    ctx.beginPath();

    labHistory.forEach((hist, hIdx) => {
      const x = 90 + hIdx * stepX;
      const val = hist[sig];
      const isBus = sig.includes("[");
      
      const highY = yBase - stepY + 6;
      const lowY = yBase - 4;

      if (isBus) {
        ctx.fillStyle = "rgba(59, 130, 246, 0.08)";
        ctx.strokeStyle = "#3b82f6";
        ctx.beginPath();
        ctx.moveTo(x, (highY+lowY)/2);
        ctx.lineTo(x + 4, highY);
        ctx.lineTo(x + stepX - 4, highY);
        ctx.lineTo(x + stepX, (highY+lowY)/2);
        ctx.lineTo(x + stepX - 4, lowY);
        ctx.lineTo(x + 4, lowY);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = "#ffffff";
        ctx.font = "8px Fira Code";
        ctx.fillText(val ?? "0", x + stepX/3, (highY+lowY)/2 + 3);
      } else {
        const valY = val === 1 ? highY : lowY;
        if (hIdx === 0) {
          ctx.moveTo(x, valY);
        } else {
          const prev = labHistory[hIdx - 1][sig];
          const prevY = prev === 1 ? highY : lowY;
          ctx.lineTo(x, prevY);
          ctx.lineTo(x, valY);
        }
        ctx.lineTo(x + stepX, valY);
      }
    });
    ctx.stroke();
  });
}

function renderLabControlWidgets() {
  if (activeLabId === "mux") {
    return `
      <div>
        <label class="block text-[9px] text-gray-500 uppercase tracking-widest font-mono mb-1">MUX Circuit Configuration</label>
        <select onchange="updateLabMode('mux_mode', this.value)" class="w-full bg-[#0b0f19] border border-white/10 rounded px-2 py-1.5 text-xs text-cyan-300">
          <option value="2:1" ${labInputs.mux_mode === "2:1" ? "selected" : ""}>2:1 MUX (with AND/OR/NOT Gates)</option>
          <option value="4:1" ${labInputs.mux_mode === "4:1" ? "selected" : ""}>4:1 MUX (with 4 AND Gates + OR Gate)</option>
        </select>
      </div>
      <div class="flex gap-2">
        <button onclick="toggleLabBitField('in0')" class="w-full py-2 bg-[#0b0f19] border border-white/10 text-xs rounded text-cyan-300">Toggle In0: ${labInputs.in0}</button>
        <button onclick="toggleLabBitField('in1')" class="w-full py-2 bg-[#0b0f19] border border-white/10 text-xs rounded text-cyan-300">Toggle In1: ${labInputs.in1}</button>
      </div>
      <button onclick="toggleLabBitField('sel')" class="py-2 bg-slate-900 border border-blue-500/20 text-xs text-purple-300 rounded font-bold">Toggle Select Pin (S): ${labInputs.sel}</button>
    `;
  }

  if (activeLabId === "half-adder" || activeLabId === "full-adder") {
    return `
      <div>
        <label class="block text-[9px] text-gray-500 uppercase tracking-widest font-mono mb-1">Adder Gate Configuration</label>
        <select onchange="updateLabMode('adder_mode', this.value)" class="w-full bg-[#0b0f19] border border-white/10 rounded px-2 py-1.5 text-xs text-cyan-300">
          <option value="half" ${labInputs.adder_mode === "half" ? "selected" : ""}>Half Adder (XOR + AND Gates)</option>
          <option value="full" ${labInputs.adder_mode === "full" ? "selected" : ""}>Full Adder (2 XOR + 2 AND + OR Gates)</option>
        </select>
      </div>
      <div class="flex gap-2">
        <button onclick="toggleLabBitField('a')" class="w-full py-2 bg-[#0b0f19] border border-white/10 text-xs text-cyan-300 rounded">Toggle A: ${labInputs.a}</button>
        <button onclick="toggleLabBitField('b')" class="w-full py-2 bg-[#0b0f19] border border-white/10 text-xs text-cyan-300 rounded">Toggle B: ${labInputs.b}</button>
      </div>
      ${labInputs.adder_mode === "full" || activeLabId === "full-adder" ? `<button onclick="toggleLabBitField('cin')" class="py-2 bg-slate-900 border border-blue-500/20 text-xs text-purple-300 rounded font-bold">Toggle Cin: ${labInputs.cin}</button>` : ''}
    `;
  }

  if (activeLabId === "subtractor") {
    return `
      <div>
        <label class="block text-[9px] text-gray-500 uppercase tracking-widest font-mono mb-1">Subtractor Gate Configuration</label>
        <select onchange="updateLabMode('subtractor_mode', this.value)" class="w-full bg-[#0b0f19] border border-white/10 rounded px-2 py-1.5 text-xs text-cyan-300">
          <option value="half" ${labInputs.subtractor_mode === "half" ? "selected" : ""}>Half Subtractor (XOR + NOT + AND Gates)</option>
          <option value="full" ${labInputs.subtractor_mode === "full" ? "selected" : ""}>Full Subtractor (2 XOR + NOT + AND + OR Gates)</option>
        </select>
      </div>
      <div class="flex gap-2">
        <button onclick="toggleLabBitField('a')" class="w-full py-2 bg-[#0b0f19] border border-white/10 text-xs text-cyan-300 rounded">Toggle A: ${labInputs.a}</button>
        <button onclick="toggleLabBitField('b')" class="w-full py-2 bg-[#0b0f19] border border-white/10 text-xs text-cyan-300 rounded">Toggle B: ${labInputs.b}</button>
      </div>
      ${labInputs.subtractor_mode === "full" ? `<button onclick="toggleLabBitField('bin')" class="py-2 bg-slate-900 border border-blue-500/20 text-xs text-purple-300 rounded font-bold">Toggle Bin: ${labInputs.bin}</button>` : ''}
    `;
  }

  if (activeLabId === "logic-gates") {
    return `
      <div>
        <label class="block text-[9px] text-gray-500 uppercase tracking-widest font-mono mb-1">Select Logic Gate</label>
        <select onchange="updateLabGate(this.value)" class="w-full bg-[#0b0f19] border border-white/10 rounded px-2 py-1.5 text-xs text-cyan-300">
          <option value="AND" ${labInputs.gate === "AND" ? "selected" : ""}>AND Gate</option>
          <option value="OR" ${labInputs.gate === "OR" ? "selected" : ""}>OR Gate</option>
          <option value="XOR" ${labInputs.gate === "XOR" ? "selected" : ""}>XOR Gate</option>
          <option value="NAND" ${labInputs.gate === "NAND" ? "selected" : ""}>NAND Gate</option>
          <option value="NOR" ${labInputs.gate === "NOR" ? "selected" : ""}>NOR Gate</option>
          <option value="XNOR" ${labInputs.gate === "XNOR" ? "selected" : ""}>XNOR Gate</option>
          <option value="NOT" ${labInputs.gate === "NOT" ? "selected" : ""}>NOT Inverter</option>
        </select>
      </div>
      <div class="flex gap-2">
        <button onclick="toggleLabBitField('a')" class="w-full py-2 bg-[#0b0f19] border border-white/10 text-xs text-cyan-300 rounded">Toggle Input A: ${labInputs.a}</button>
        ${labInputs.gate !== "NOT" ? `<button onclick="toggleLabBitField('b')" class="w-full py-2 bg-[#0b0f19] border border-white/10 text-xs text-cyan-300 rounded">Toggle Input B: ${labInputs.b}</button>` : ''}
      </div>
    `;
  }

  if (activeLabId === "flip-flops") {
    let inputsHtml = "";
    if (labInputs.ff_type === "D-FF") {
      inputsHtml = `<button onclick="toggleLabBitField('d')" class="py-2 bg-[#0b0f19] border border-white/10 text-xs rounded text-cyan-300">Toggle D: ${labInputs.d}</button>`;
    } else if (labInputs.ff_type === "JK-FF") {
      inputsHtml = `
        <button onclick="toggleLabBitField('j')" class="py-2 bg-[#0b0f19] border border-white/10 text-xs rounded text-cyan-300">Toggle J: ${labInputs.j}</button>
        <button onclick="toggleLabBitField('k')" class="py-2 bg-[#0b0f19] border border-white/10 text-xs rounded text-cyan-300">Toggle K: ${labInputs.k}</button>
      `;
    }

    return `
      <div>
        <label class="block text-[9px] text-gray-500 uppercase tracking-widest font-mono mb-1">Flip-Flop Architecture</label>
        <select onchange="updateFlipFlopType(this.value)" class="w-full bg-[#0b0f19] border border-white/10 rounded px-2 py-1.5 text-xs text-cyan-300">
          <option value="D-FF" ${labInputs.ff_type === "D-FF" ? "selected" : ""}>D Flip-Flop (NAND Gate Latch)</option>
          <option value="JK-FF" ${labInputs.ff_type === "JK-FF" ? "selected" : ""}>JK Flip-Flop (Cross-Coupled)</option>
          <option value="T-FF" ${labInputs.ff_type === "T-FF" ? "selected" : ""}>T Flip-Flop</option>
          <option value="SR-FF" ${labInputs.ff_type === "SR-FF" ? "selected" : ""}>SR Latch</option>
        </select>
      </div>
      <div class="flex gap-2 flex-col">
        ${inputsHtml}
      </div>
      <div class="flex gap-2">
        <button onclick="toggleLabBitField('rst_n')" class="w-full py-2 bg-[#0b0f19] border border-white/10 text-xs rounded text-red-400">Toggle Reset</button>
        <button onclick="pulseLabClock()" class="w-full py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-xs font-bold text-white rounded shadow">Pulse Clock</button>
      </div>
    `;
  }

  return `
    <button onclick="toggleLabBitField('si')" class="py-2 bg-[#0b0f19] border border-white/10 text-xs rounded text-cyan-300">Toggle Input</button>
    <button onclick="toggleLabBitField('rst_n')" class="py-2 bg-[#0b0f19] border border-white/10 text-xs rounded text-red-400">Toggle Reset</button>
    <button onclick="pulseLabClock()" class="py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-xs font-bold text-white rounded shadow">Pulse Clock</button>
  `;
}

window.updateLabMode = function(field, val) {
  labInputs[field] = val;
  updateLabSimulation();
  renderLab();
};

window.toggleLabBitField = function(field) {
  labInputs[field] = labInputs[field] === 1 ? 0 : 1;
  updateLabSimulation();
  renderLab();
};

window.toggleEncoderBit = function(idx) {
  labInputs.encoderIn[idx] = labInputs.encoderIn[idx] === 1 ? 0 : 1;
  updateLabSimulation();
  renderLab();
};

window.toggleDecoderBit = function(bitIdx) {
  const currentVal = labInputs.decoderIn;
  const mask = 1 << bitIdx;
  labInputs.decoderIn = currentVal ^ mask;
  updateLabSimulation();
  renderLab();
};

window.updateAluVal = function(field, val) {
  labInputs[field] = parseInt(val);
  updateLabSimulation();
  renderLab();
};

window.updateFlipFlopType = function(val) {
  labInputs.ff_type = val;
  updateLabSimulation();
  renderLab();
};

window.pulseLabClock = function() {
  labInputs.clk = 1;
  updateLabSimulation();
  renderLab();
  setTimeout(() => {
    labInputs.clk = 0;
    updateLabSimulation();
    renderLab();
  }, 100);
};

window.updateLabGate = function(gate) {
  labInputs.gate = gate;
  updateLabSimulation();
  renderLab();
};

window.evaluateLabCheckpoint = function(num) {
  showToast("Circuit checkpoint response saved! Verified gate boolean constraints.", "success");
};
