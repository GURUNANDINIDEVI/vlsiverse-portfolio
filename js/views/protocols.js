/* Protocols Explorer View - Custom Signals, Detailed Architecture Specifications, Revisions & Unlimited Practice Q&A */

let activeProtocolId = "apb";
let activeProtocolTab = "desc";
let currentProtocolQuestion = null;
let protocolUserSelectedOption = null;
let protocolQuestionSubmitted = false;
let protocolQuestionStats = { total: 0, correct: 0 };

// Database of curated protocol interview questions by protocol ID
const PROTOCOL_QUESTION_BANKS = {
  apb: [
    {
      q: "In AMBA APB3/APB4 protocol, which signal initiates the second phase (Access Phase) of a bus transfer?",
      options: ["PENABLE", "PSEL", "PREADY", "PSLVERR"],
      answer: 0,
      explanation: "PSEL asserts during the Setup phase (1st cycle); PENABLE asserts during the Access phase (2nd cycle) to signal the transfer completion or wait state polling."
    },
    {
      q: "How does an APB slave insert wait states during a read or write transfer?",
      options: ["By deasserting PREADY low", "By deasserting PSEL low", "By asserting PSLVERR high", "By driving PENABLE low"],
      answer: 0,
      explanation: "While PREADY is low during the Access phase (PENABLE=1), the master stalls and holds PSEL, PENABLE, PADDR, and PWDATA stable until PREADY goes high."
    },
    {
      q: "What is the minimum cycle latency of an APB bus transfer without wait states?",
      options: ["2 clock cycles (Setup + Access phase)", "1 clock cycle", "3 clock cycles", "4 clock cycles"],
      answer: 0,
      explanation: "Every APB transfer requires at least 2 clock cycles: 1 cycle for Setup phase (PSEL=1, PENABLE=0) and 1 cycle for Access phase (PSEL=1, PENABLE=1)."
    },
    {
      q: "In APB4 protocol, what is the function of PPROT signals?",
      options: ["Protection unit flags for Normal/Privileged, Secure/Non-Secure, and Data/Instruction access", "Parity error detection", "Pipeline handshake control", "Priority arbitration"],
      answer: 0,
      explanation: "PPROT[2:0] indicates access privilege levels: PPROT[0] (Normal/Privileged), PPROT[1] (Secure/Non-Secure), PPROT[2] (Data/Instruction)."
    },
    {
      q: "What is the status of PSEL and PENABLE when the APB bus is in the IDLE state?",
      options: ["PSEL = 0, PENABLE = 0", "PSEL = 1, PENABLE = 0", "PSEL = 0, PENABLE = 1", "PSEL = 1, PENABLE = 1"],
      answer: 0,
      explanation: "During IDLE state between transfers, both PSEL and PENABLE are driven low to save dynamic power."
    }
  ],
  ahb: [
    {
      q: "In AMBA AHB-Lite, what is the purpose of HREADYOUT from the slave to the interconnect?",
      options: ["Indicates when the slave has finished processing the current data phase", "Requests bus master ownership", "Signals a hardware reset condition", "Selects burst transfer length"],
      answer: 0,
      explanation: "HREADYOUT is driven by the slave to stall the master by extending the data phase until HREADYOUT goes high."
    },
    {
      q: "In AHB-Lite, how are address and data phases executed?",
      options: ["Pipelined: Address phase of transfer N coincides with Data phase of transfer N-1", "Sequential non-pipelined: Address and Data occur in same cycle", "Multi-channel out-of-order", "Asynchronous handshake"],
      answer: 0,
      explanation: "AHB-Lite uses a 2-stage pipeline where the address phase of the next transfer overlaps with the data phase of the current transfer."
    },
    {
      q: "Which HTRANS[1:0] encoding represents a non-sequential transfer initiating a new burst?",
      options: ["2'b10 (NONSEQ)", "2'b00 (IDLE)", "2'b01 (BUSY)", "2'b11 (SEQ)"],
      answer: 0,
      explanation: "HTRANS = 2'b10 (NONSEQ) indicates the first transfer of a burst or a single transfer."
    },
    {
      q: "What happens when an AHB slave returns an HRESP = 1 (ERROR) response?",
      options: ["Requires a 2-cycle error response sequence allowing master to cancel pipelined address phase", "Instantly resets the entire SoC", "Stalls the bus for 100 cycles", "Ignores the write data silently"],
      answer: 0,
      explanation: "AHB ERROR response requires 2 cycles so the master can detect the error and pull HTRANS back to IDLE on the following cycle."
    }
  ],
  axi: [
    {
      q: "Which of the 5 independent channels in AXI4 protocol returns write completion status from slave to master?",
      options: ["Write Response Channel (B)", "Write Data Channel (W)", "Write Address Channel (AW)", "Read Response Channel (R)"],
      answer: 0,
      explanation: "The Write Response (B) channel conveys BRESP status (OKAY, EXOKAY, SLVERR, DECERR) back to the master once write transaction commits."
    },
    {
      q: "How does AXI4 achieve out-of-order transaction completion across multiple memory slaves?",
      options: ["Using AXI Transaction IDs (AWID, WID, BID, ARID, RID) to tag independent transfers", "By locking the bus during read cycles", "Using dual-clock buffers", "By eliminating ready signals"],
      answer: 0,
      explanation: "AXI IDs allow slaves to return read data or write responses in a different order than requested, preventing slow memories from blocking fast ones."
    },
    {
      q: "What are the rules governing VALID and READY handshake signals in AXI protocol?",
      options: ["VALID can be asserted without waiting for READY, but once VALID is high, it MUST remain high until READY is asserted", "READY must always be high before VALID asserts", "VALID must be deasserted if READY is low", "VALID and READY must toggle on alternate clock edges"],
      answer: 0,
      explanation: "To prevent deadlocks, a master/slave asserting VALID must hold VALID high and maintain payload values stable until READY is sampled high."
    },
    {
      q: "Which AXI burst type is used for FIFO buffer accesses where the memory address remains fixed?",
      options: ["FIXED (2'b00)", "INCR (2'b01)", "WRAP (2'b10)", "RESERVED (2'b11)"],
      answer: 0,
      explanation: "FIXED bursts keep the target byte address constant across all beats in the burst, ideal for reading/writing FIFO memory mapped ports."
    }
  ],
  spi: [
    {
      q: "In SPI Mode 0 (CPOL=0, CPHA=0), on which clock edge is data sampled by the receiver?",
      options: ["First edge (Rising edge of SCLK)", "Second edge (Falling edge of SCLK)", "High logic level", "Low logic level"],
      answer: 0,
      explanation: "Mode 0 has clock idle low (CPOL=0) and sampling on 1st edge (CPHA=0), which corresponds to the rising edge of SCLK."
    },
    {
      q: "How many wires are required for a standard full-duplex 4-wire SPI bus?",
      options: ["4 wires: SCLK, MOSI, MISO, CS_N", "2 wires: SDA, SCL", "3 wires: TX, RX, GND", "5 wires: AW, W, B, AR, R"],
      answer: 0,
      explanation: "Standard SPI uses 4 lines: Serial Clock (SCLK), Master-Out-Slave-In (MOSI), Master-In-Slave-Out (MISO), and Chip Select Active-Low (CS_N)."
    }
  ],
  i2c: [
    {
      q: "How is an I2C START condition generated on the bus?",
      options: ["SDA transitions from High to Low while SCL remains High", "SDA transitions from Low to High while SCL remains High", "SCL transitions from High to Low while SDA is Low", "SDA and SCL both toggle high simultaneously"],
      answer: 0,
      explanation: "An I2C START condition is defined as a high-to-low transition on the SDA line while SCL is held high."
    },
    {
      q: "Why does I2C use open-drain outputs with external pull-up resistors on SDA and SCL?",
      options: ["To enable multi-master bus arbitration and clock stretching without electrical short circuits", "To increase clock speed to 10 GHz", "To eliminate power consumption", "To support differential signaling"],
      answer: 0,
      explanation: "Open-drain outputs allow multiple devices to drive SDA/SCL without contention; any device pulling line low wins, enabling arbitration & clock stretching."
    }
  ]
};

// Procedural Unlimited Scenario Generator for any protocol
function generateProtocolScenarioQuestion(protocolKey) {
  const proto = VLSIData.protocols[protocolKey] || VLSIData.protocols["apb"];
  const name = proto.name;

  const templates = [
    {
      q: `Scenario: In a ${name} interface, a timing bug occurs where the master drops VALID/ENABLE before READY/PREADY goes high. What hardware failure happens?`,
      options: [
        "Data loss / dropped transaction beat due to incomplete handshake violation",
        "The clock frequency doubles automatically",
        "The bus switches to SPI mode",
        "No issue, transfers complete immediately"
      ],
      answer: 0,
      explanation: "Dropping VALID/ENABLE early violates protocol handshake rules. The receiver fails to capture the data beat, corrupting the payload."
    },
    {
      q: `Scenario: You are writing SystemVerilog Assertions (SVA) for ${name}. What assertion verifies that PREADY/HREADYOUT/READY resolves within 16 cycles?`,
      options: [
        "assert property (@(posedge clk) valid |-> ##[1:16] ready);",
        "assert property (@(posedge clk) ready |=> ##2 valid);",
        "assert property (@(posedge clk) valid == 0);",
        "assert property (@(posedge clk) ##1 ready);"
      ],
      answer: 0,
      explanation: "SVA overlapping implication |-> with range ##[1:16] checks that once valid asserts, ready MUST be asserted within 1 to 16 cycles."
    },
    {
      q: `Scenario: In ${name} system design, a slave device requires 4 wait cycles to fetch data from memory. How is this signaled back to the bus master?`,
      options: [
        "The slave holds its ready/wait line deasserted for 4 clock cycles while maintaining valid signals",
        "The slave sends an interrupt packet over USB",
        "The master resets the clock generator",
        "The bus switches from 32-bit to 8-bit mode"
      ],
      answer: 0,
      explanation: "Holding the ready/acknowledge signal low stalls the bus pipeline, allowing the slave required processing time without dropping the transfer request."
    },
    {
      q: `Scenario: During CDC (Clock Domain Crossing) verification of a ${name} bridge, a single-bit control signal crosses asynchronously. What component MUST be inserted?`,
      options: [
        "A 2-Stage D-FF Synchronizer on the receiving clock domain",
        "An inverter gate",
        "A 64-bit multiplier",
        "A tri-state buffer"
      ],
      answer: 0,
      explanation: "Asynchronous control signals crossing clock domains must pass through a 2-FF or 3-FF synchronizer to prevent metastability."
    }
  ];

  return templates[Math.floor(Math.random() * templates.length)];
}

window.renderProtocols = function() {
  const container = document.getElementById("view-container");
  if (!container) return;

  const current = VLSIData.protocols[activeProtocolId] || VLSIData.protocols["apb"];

  // Initialize question if needed
  if (!currentProtocolQuestion || currentProtocolQuestion.protocolId !== activeProtocolId) {
    pickProtocolQuestion(activeProtocolId);
  }

  container.innerHTML = `
    <div class="max-w-7xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-4 gap-8 font-sans">
      <!-- Protocols selection list -->
      <div class="lg:col-span-1 flex flex-col gap-4">
        <h3 class="font-heading font-extrabold text-sm text-white px-2 flex items-center justify-between">
          <span>Protocol Standards</span>
          <span class="text-[9px] font-mono text-cyan-400 bg-cyan-950/60 border border-cyan-500/30 px-2 py-0.5 rounded font-bold">${Object.keys(VLSIData.protocols).length} Protocols</span>
        </h3>
        <div class="flex flex-col gap-2">
          ${Object.keys(VLSIData.protocols).map(key => {
            const proto = VLSIData.protocols[key];
            const isSelected = key === activeProtocolId;
            return `
              <button onclick="selectProtocol('${key}')" class="text-left w-full px-3 py-2.5 rounded-lg border text-xs transition-all flex items-center justify-between ${
                isSelected 
                  ? 'bg-blue-950/40 border-blue-500/40 text-blue-300 font-bold shadow-lg shadow-blue-500/10' 
                  : 'bg-[#0b0f19] border-white/5 text-gray-400 hover:text-gray-200 hover:border-white/10'
              }">
                <span>${proto.name}</span>
                <i class="fa-solid fa-network-wired text-[10px] ${isSelected ? 'text-blue-400' : 'text-gray-500'}"></i>
              </button>
            `;
          }).join("")}
        </div>
      </div>

      <!-- Main Protocol Sheets -->
      <div class="lg:col-span-3 flex flex-col gap-6">
        <!-- Overview Header -->
        <div class="glass-panel p-6 rounded-2xl border-white/5 flex flex-col gap-3">
          <div class="flex justify-between items-center flex-wrap gap-2">
            <span class="text-[10px] text-blue-400 font-bold uppercase tracking-widest font-mono bg-blue-950/50 px-2.5 py-0.5 rounded border border-blue-500/20">${current.type}</span>
            <div class="flex items-center gap-3">
              <button onclick="openProtocolHandbookModal(1)" class="px-3.5 py-1.5 bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-heading font-bold text-xs rounded-xl shadow-lg shadow-cyan-500/20 transition-all hover:scale-105 flex items-center gap-2">
                <i class="fa-solid fa-book-open text-xs"></i> 📖 Open 6-Page Protocol Master Handbook
              </button>
              <span class="text-[10px] text-purple-400 font-mono flex items-center gap-1.5">
                <i class="fa-solid fa-trophy text-amber-400"></i> Mastery XP: <strong class="text-white font-bold">${protocolQuestionStats.correct * 15} pts</strong>
              </span>
            </div>
          </div>
          <h2 class="text-xl font-heading font-extrabold text-white flex items-center gap-2">${current.name}</h2>
          <p class="text-xs text-gray-300 leading-relaxed bg-slate-950/40 p-4 rounded-xl border border-white/5">${current.overview}</p>
        </div>

        <!-- Navigation Tabs: Detailed Architecture, Signals, Revision, Q&A Bank -->
        <div class="border-b border-white/5 flex gap-2 overflow-x-auto pb-1 scrollbar-thin">
          <button onclick="switchProtocolTab('desc')" id="p-tab-desc" class="p-tab-btn pb-2.5 text-xs font-heading font-bold ${activeProtocolTab === 'desc' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-gray-500'} px-3 whitespace-nowrap flex items-center gap-1.5">
            <i class="fa-solid fa-microchip text-blue-400"></i> Detailed Architecture & Specs
          </button>
          <button onclick="switchProtocolTab('signals')" id="p-tab-signals" class="p-tab-btn pb-2.5 text-xs font-heading font-bold ${activeProtocolTab === 'signals' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-gray-500'} px-3 whitespace-nowrap">Signals Mapping</button>
          <button onclick="switchProtocolTab('rev')" id="p-tab-rev" class="p-tab-btn pb-2.5 text-xs font-heading font-bold ${activeProtocolTab === 'rev' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-gray-500'} px-3 whitespace-nowrap">Quick Revision Sheet</button>
          <button onclick="switchProtocolTab('qbank')" id="p-tab-qbank" class="p-tab-btn pb-2.5 text-xs font-heading font-bold ${activeProtocolTab === 'qbank' ? 'text-cyan-400 border-b-2 border-cyan-400' : 'text-gray-500'} px-3 whitespace-nowrap flex items-center gap-1.5">
            <i class="fa-solid fa-circle-question text-cyan-400"></i> Practice & Interview Q&A
          </button>
        </div>

        <!-- Tab Contents -->
        <div class="glass-panel p-6 rounded-2xl border-white/5 min-h-[30vh]">
          
          <!-- Detailed Architecture & Specifications Tab -->
          <div id="p-content-desc" class="p-content ${activeProtocolTab === 'desc' ? '' : 'hidden'} flex flex-col gap-6">
            
            <!-- Section 1: Detailed Architectural Overview -->
            <div class="flex flex-col gap-2 bg-slate-950/60 p-5 rounded-xl border border-white/5">
              <h3 class="text-xs font-heading font-bold text-cyan-400 uppercase tracking-widest flex items-center gap-2">
                <i class="fa-solid fa-book-open"></i> Architectural Overview & Target Standard
              </h3>
              <p class="text-xs text-gray-300 leading-relaxed font-sans mt-1">
                ${current.detailedDescription || current.overview}
              </p>
            </div>

            <!-- Section 2: Handshake & Phase Architecture -->
            <div class="flex flex-col gap-2 bg-slate-950/60 p-5 rounded-xl border border-white/5">
              <h3 class="text-xs font-heading font-bold text-purple-400 uppercase tracking-widest flex items-center gap-2">
                <i class="fa-solid fa-handshake"></i> Signal Handshake Mechanism & Protocol Phases
              </h3>
              <p class="text-xs text-gray-300 leading-relaxed font-sans mt-1">
                ${current.handshakeArchitecture || current.timing}
              </p>
            </div>

            <!-- Section 3: Burst Modes & Flow Control -->
            <div class="flex flex-col gap-2 bg-slate-950/60 p-5 rounded-xl border border-white/5">
              <h3 class="text-xs font-heading font-bold text-amber-400 uppercase tracking-widest flex items-center gap-2">
                <i class="fa-solid fa-layer-group"></i> Burst Modes, Flow Control & Latency Bounds
              </h3>
              <p class="text-xs text-gray-300 leading-relaxed font-sans mt-1">
                ${current.burstAndFlowControl || current.revision}
              </p>
            </div>

            <!-- Section 4: Error Handling & Fault Management -->
            <div class="flex flex-col gap-2 bg-slate-950/60 p-5 rounded-xl border border-white/5">
              <h3 class="text-xs font-heading font-bold text-red-400 uppercase tracking-widest flex items-center gap-2">
                <i class="fa-solid fa-shield-halved"></i> Error Handling, Response Codes & Verification
              </h3>
              <p class="text-xs text-gray-300 leading-relaxed font-sans mt-1">
                ${current.errorHandling || "Includes transaction error detection, timeout monitors, and protocol compliance assertion checks."}
              </p>
            </div>

            <!-- Section 5: Real-World SoC Applications -->
            <div class="flex flex-col gap-2 bg-slate-950/60 p-5 rounded-xl border border-white/5">
              <h3 class="text-xs font-heading font-bold text-emerald-400 uppercase tracking-widest flex items-center gap-2">
                <i class="fa-solid fa-microchip"></i> Real-World Silicon Applications
              </h3>
              <p class="text-xs text-gray-300 leading-relaxed font-sans mt-1">
                ${current.useCases || "Used widely across modern VLSI System-on-Chip (SoC) architectures for microcontrollers, GPUs, and network processors."}
              </p>
            </div>

          </div>

          <!-- Signals Table -->
          <div id="p-content-signals" class="p-content ${activeProtocolTab === 'signals' ? '' : 'hidden'}">
            <h3 class="text-xs font-heading font-bold text-white mb-4 uppercase tracking-widest">Signal Definitions & Directions</h3>
            <div class="overflow-x-auto">
              <table class="w-full text-left text-xs border-collapse">
                <thead>
                  <tr class="border-b border-white/10 text-gray-500 font-mono">
                    <th class="py-2.5">Signal Name</th>
                    <th class="py-2.5">Direction</th>
                    <th class="py-2.5">Description</th>
                  </tr>
                </thead>
                <tbody class="text-gray-300">
                  ${current.signals.map(sig => `
                    <tr class="border-b border-white/5 hover:bg-slate-900/30">
                      <td class="py-2.5 font-mono text-cyan-400 font-semibold">${sig.name}</td>
                      <td class="py-2.5 text-purple-400 font-medium">${sig.dir}</td>
                      <td class="py-2.5 text-gray-400">${sig.desc}</td>
                    </tr>
                  `).join("")}
                </tbody>
              </table>
            </div>
          </div>

          <!-- Revision Tab -->
          <div id="p-content-rev" class="p-content ${activeProtocolTab === 'rev' ? '' : 'hidden'}">
            <h3 class="text-xs font-heading font-bold text-white mb-3 uppercase tracking-widest">Quick Revision & Handshake Rules</h3>
            <p class="text-xs text-gray-300 leading-relaxed bg-[#0b0f19] p-4 rounded-xl border border-white/5">${current.revision}</p>
          </div>

          <!-- Practice & Interview Q&A Bank Tab -->
          <div id="p-content-qbank" class="p-content ${activeProtocolTab === 'qbank' ? '' : 'hidden'} flex flex-col gap-6">
            
            <!-- Interactive Unlimited Generator Card -->
            <div class="bg-slate-950 p-6 rounded-2xl border border-cyan-500/20 flex flex-col gap-4">
              <div class="flex justify-between items-center flex-wrap gap-2">
                <span class="text-[10px] text-cyan-400 font-bold uppercase tracking-widest font-mono flex items-center gap-1.5">
                  <i class="fa-solid fa-robot"></i> Unlimited ${current.name} Question Generator
                </span>
                <button onclick="pickNextProtocolScenario('${activeProtocolId}')" class="px-3.5 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-xs font-bold font-mono transition-all flex items-center gap-1.5 shadow-lg shadow-cyan-500/20">
                  <i class="fa-solid fa-dice"></i> Generate Random Scenario
                </button>
              </div>

              <div class="flex flex-col gap-3 mt-1">
                <h4 class="text-sm font-semibold text-white leading-relaxed font-sans bg-slate-900/60 p-4 rounded-xl border border-white/5">
                  ${currentProtocolQuestion.q}
                </h4>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-3 mt-1">
                  ${currentProtocolQuestion.options.map((opt, oIdx) => {
                    const isSelected = protocolUserSelectedOption === oIdx;
                    let optionStyle = "bg-slate-900 border-white/5 text-gray-300 hover:border-cyan-500/30";

                    if (protocolQuestionSubmitted) {
                      if (oIdx === currentProtocolQuestion.answer) {
                        optionStyle = "bg-emerald-950/40 border-emerald-500/40 text-emerald-300 font-bold";
                      } else if (isSelected) {
                        optionStyle = "bg-red-950/40 border-red-500/40 text-red-300";
                      } else {
                        optionStyle = "bg-slate-900/40 border-white/5 text-gray-600 opacity-60";
                      }
                    }

                    return `
                      <button onclick="selectProtocolOption(${oIdx})" ${protocolQuestionSubmitted ? 'disabled' : ''}
                              class="p-3 rounded-xl border text-xs text-left transition-all flex items-center gap-3 ${optionStyle}">
                        <span class="w-5 h-5 rounded-full border border-white/10 flex items-center justify-center text-[10px] font-mono font-bold ${isSelected ? 'bg-cyan-500 text-slate-950 border-cyan-400' : 'bg-slate-950 text-gray-400'}">
                          ${String.fromCharCode(65 + oIdx)}
                        </span>
                        <span class="leading-normal">${opt}</span>
                      </button>
                    `;
                  }).join("")}
                </div>

                ${protocolQuestionSubmitted ? `
                  <div class="p-4 rounded-xl border text-xs font-sans leading-relaxed mt-2 ${
                    protocolUserSelectedOption === currentProtocolQuestion.answer 
                      ? 'bg-emerald-950/30 border-emerald-500/30 text-emerald-300' 
                      : 'bg-red-950/30 border-red-500/30 text-red-300'
                  }">
                    <strong class="font-bold flex items-center gap-1.5 mb-1">
                      <i class="fa-solid ${protocolUserSelectedOption === currentProtocolQuestion.answer ? 'fa-circle-check text-emerald-400' : 'fa-circle-xmark text-red-400'}"></i>
                      ${protocolUserSelectedOption === currentProtocolQuestion.answer ? 'CORRECT ANSWER (+15 XP)' : 'INCORRECT'}
                    </strong>
                    <p class="text-gray-300 text-[11px] mt-1 font-mono">${currentProtocolQuestion.explanation}</p>
                  </div>
                ` : `
                  <button onclick="submitProtocolQuestionAnswer()" ${protocolUserSelectedOption === null ? 'disabled' : ''}
                          class="w-full mt-2 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 disabled:opacity-40 disabled:cursor-not-allowed hover:from-blue-500 hover:to-indigo-500 text-white font-heading font-bold text-xs tracking-wider rounded-xl transition-all shadow-lg">
                    Check Protocol Answer
                  </button>
                `}
              </div>
            </div>

            <!-- Static Curated Question Bank for this protocol -->
            <div class="flex flex-col gap-4">
              <h4 class="text-xs font-heading font-bold text-white uppercase tracking-widest flex items-center justify-between">
                <span>Curated ${current.name} Interview Questions</span>
                <span class="text-[10px] text-gray-500 font-mono">Real VLSI / DV Scenarios</span>
              </h4>

              <div class="flex flex-col gap-3">
                ${(PROTOCOL_QUESTION_BANKS[activeProtocolId] || PROTOCOL_QUESTION_BANKS.apb).map((item, idx) => `
                  <details class="bg-slate-950 p-4 rounded-xl border border-white/5 group">
                    <summary class="text-xs font-bold text-gray-200 cursor-pointer select-none flex items-center justify-between">
                      <span class="flex items-center gap-2">
                        <span class="text-cyan-400 font-mono text-[10px]">#Q${idx + 1}</span>
                        ${item.q}
                      </span>
                      <i class="fa-solid fa-chevron-down text-gray-500 text-[10px] group-open:rotate-180 transition-transform"></i>
                    </summary>
                    <div class="mt-3 pt-3 border-t border-white/5 text-xs text-gray-300 leading-relaxed font-sans bg-slate-900/60 p-3 rounded-lg border border-white/5">
                      <strong class="text-emerald-400 font-mono text-[10px] block mb-1">ENGINEERING SOLUTION:</strong>
                      ${item.explanation}
                    </div>
                  </details>
                `).join("")}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  `;
};

function pickProtocolQuestion(protoId) {
  const bank = PROTOCOL_QUESTION_BANKS[protoId] || PROTOCOL_QUESTION_BANKS.apb;
  const useCurated = Math.random() > 0.5 && bank.length > 0;
  if (useCurated) {
    const qObj = bank[Math.floor(Math.random() * bank.length)];
    currentProtocolQuestion = { ...qObj, protocolId: protoId };
  } else {
    currentProtocolQuestion = { ...generateProtocolScenarioQuestion(protoId), protocolId: protoId };
  }
  protocolUserSelectedOption = null;
  protocolQuestionSubmitted = false;
}

window.selectProtocol = function(id) {
  activeProtocolId = id;
  pickProtocolQuestion(id);
  renderProtocols();
};

window.switchProtocolTab = function(tabId) {
  activeProtocolTab = tabId;
  renderProtocols();
};

window.selectProtocolOption = function(oIdx) {
  protocolUserSelectedOption = oIdx;
  renderProtocols();
};

window.submitProtocolQuestionAnswer = function() {
  if (protocolUserSelectedOption === null || !currentProtocolQuestion) return;
  protocolQuestionSubmitted = true;
  protocolQuestionStats.total += 1;

  if (protocolUserSelectedOption === currentProtocolQuestion.answer) {
    protocolQuestionStats.correct += 1;
    if (typeof AppState !== 'undefined' && AppState.user) {
      AppState.user.xp = (AppState.user.xp || 0) + 15;
    }
    showToast("Correct Protocol Answer! +15 XP", "success");
  } else {
    showToast("Incorrect answer. Check explanation.", "error");
  }
  renderProtocols();
};

window.pickNextProtocolScenario = function(protoId) {
  pickProtocolQuestion(protoId);
  renderProtocols();
};

// 6-Page Protocol Master Handbook Modal (Spacious w-[95vw] h-[90vh] with unique protocol data)
let activeHandbookPage = 1;

window.openProtocolHandbookModal = function(pageNo = 1) {
  activeHandbookPage = pageNo;
  let modal = document.getElementById("protocol-handbook-modal");
  if (!modal) {
    modal = document.createElement("div");
    modal.id = "protocol-handbook-modal";
    modal.className = "fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md font-sans animate-fade-in";
    document.body.appendChild(modal);
  }

  const current = VLSIData.protocols[activeProtocolId] || VLSIData.protocols["apb"];
  
  // Protocol specific calculations & content
  const protoData = getProtocolHandbookData(activeProtocolId, current);

  modal.innerHTML = `
    <div class="w-[95vw] max-w-6xl h-[90vh] glass-panel rounded-3xl border border-cyan-500/30 flex flex-col overflow-hidden shadow-2xl bg-[#0b0f19]">
      
      <!-- Handbook Header -->
      <div class="bg-slate-950 px-6 py-4 border-b border-white/10 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white text-lg shadow-lg">
            <i class="fa-solid fa-book-open"></i>
          </div>
          <div>
            <h2 class="text-base font-heading font-extrabold text-white flex items-center gap-2">
              ${current.name} &bull; 6-Page Engineering Master Handbook
            </h2>
            <span class="text-[10px] text-cyan-300 font-mono">Spacious Reference Deck &bull; Page ${activeHandbookPage} of 6</span>
          </div>
        </div>

        <button onclick="closeProtocolHandbookModal()" class="w-8 h-8 rounded-xl bg-slate-900 text-gray-400 hover:text-white flex items-center justify-center transition-colors">
          <i class="fa-solid fa-xmark text-sm"></i>
        </button>
      </div>

      <!-- 6-Page Navigation Tabs -->
      <div class="px-6 py-2.5 bg-slate-950/60 border-b border-white/5 flex gap-2 overflow-x-auto font-mono text-xs scrollbar-none">
        <button onclick="switchHandbookPage(1)" class="px-3.5 py-1.5 rounded-xl border ${activeHandbookPage === 1 ? 'bg-cyan-950/80 border-cyan-500/40 text-cyan-300 font-bold' : 'border-white/5 bg-slate-900 text-gray-400 hover:text-white'} flex items-center gap-1.5 whitespace-nowrap">
          <span>Page 1: Overview &amp; Topology</span>
        </button>
        <button onclick="switchHandbookPage(2)" class="px-3.5 py-1.5 rounded-xl border ${activeHandbookPage === 2 ? 'bg-cyan-950/80 border-cyan-500/40 text-cyan-300 font-bold' : 'border-white/5 bg-slate-900 text-gray-400 hover:text-white'} flex items-center gap-1.5 whitespace-nowrap">
          <span>Page 2: Signal Handshakes</span>
        </button>
        <button onclick="switchHandbookPage(3)" class="px-3.5 py-1.5 rounded-xl border ${activeHandbookPage === 3 ? 'bg-cyan-950/80 border-cyan-500/40 text-cyan-300 font-bold' : 'border-white/5 bg-slate-900 text-gray-400 hover:text-white'} flex items-center gap-1.5 whitespace-nowrap">
          <span>Page 3: Formulas &amp; Bandwidth Math</span>
        </button>
        <button onclick="switchHandbookPage(4)" class="px-3.5 py-1.5 rounded-xl border ${activeHandbookPage === 4 ? 'bg-cyan-950/80 border-cyan-500/40 text-cyan-300 font-bold' : 'border-white/5 bg-slate-900 text-gray-400 hover:text-white'} flex items-center gap-1.5 whitespace-nowrap">
          <span>Page 4: State Machine &amp; Timing</span>
        </button>
        <button onclick="switchHandbookPage(5)" class="px-3.5 py-1.5 rounded-xl border ${activeHandbookPage === 5 ? 'bg-cyan-950/80 border-cyan-500/40 text-cyan-300 font-bold' : 'border-white/5 bg-slate-900 text-gray-400 hover:text-white'} flex items-center gap-1.5 whitespace-nowrap">
          <span>Page 5: Error Control &amp; DV</span>
        </button>
        <button onclick="switchHandbookPage(6)" class="px-3.5 py-1.5 rounded-xl border ${activeHandbookPage === 6 ? 'bg-cyan-950/80 border-cyan-500/40 text-cyan-300 font-bold' : 'border-white/5 bg-slate-900 text-gray-400 hover:text-white'} flex items-center gap-1.5 whitespace-nowrap">
          <span>Page 6: Silicon Applications</span>
        </button>
      </div>

      <!-- Page Content Area -->
      <div class="flex-grow p-6 overflow-y-auto font-sans leading-relaxed text-xs text-gray-300">
        ${renderHandbookPageContent(activeHandbookPage, activeProtocolId, current, protoData)}
      </div>

      <!-- Bottom Pagination Footer -->
      <div class="bg-slate-950 px-6 py-3 border-t border-white/10 flex items-center justify-between text-xs font-mono">
        <button onclick="switchHandbookPage(${Math.max(1, activeHandbookPage - 1)})" ${activeHandbookPage === 1 ? 'disabled' : ''} class="px-4 py-2 bg-slate-900 border border-white/10 hover:border-white/20 disabled:opacity-30 disabled:cursor-not-allowed text-gray-300 rounded-xl transition-all flex items-center gap-1.5">
          <i class="fa-solid fa-arrow-left text-[10px]"></i> Previous Page
        </button>
        <span class="text-gray-400">Page <strong>${activeHandbookPage}</strong> / 6</span>
        <button onclick="switchHandbookPage(${Math.min(6, activeHandbookPage + 1)})" ${activeHandbookPage === 6 ? 'disabled' : ''} class="px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-30 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-all flex items-center gap-1.5 shadow-lg">
          Next Page <i class="fa-solid fa-arrow-right text-[10px]"></i>
        </button>
      </div>
    </div>
  `;

  modal.classList.remove("hidden");
};

window.closeProtocolHandbookModal = function() {
  document.getElementById("protocol-handbook-modal")?.classList.add("hidden");
};

window.switchHandbookPage = function(pageNo) {
  openProtocolHandbookModal(pageNo);
};

// Protocol Specific Formulas and Math helper
function getProtocolHandbookData(id, current) {
  if (id === "apb") {
    return {
      bandwidthFormula: "Maximum Bandwidth = (F_clk * Data_Bits) / (2 * 8) Bytes/sec",
      freqRange: "10 MHz - 100 MHz (Clock synchronous with APB domain)",
      latencyFormula: "Minimum Latency = 2 Clock Cycles per transfer (Setup Phase + Access Phase)",
      timingEquation: "T_transfer = T_setup (1 cycle) + T_access (1 + N_wait cycles)",
      efficiencyMath: "Bus Efficiency = 50% max (since Setup cycle carries no data movement)",
      pinCount: "12-16 Signals (PADDR, PWDATA, PRDATA, PSEL, PENABLE, PWRITE, PREADY, PSLVERR, etc.)"
    };
  } else if (id === "axi") {
    return {
      bandwidthFormula: "Maximum Bandwidth = (F_clk * Data_Bits / 8) * 2 (Simultaneous Read + Write)",
      freqRange: "200 MHz - 1.5 GHz High-Performance SoC Fabric",
      latencyFormula: "Single-beat Latency = 1 Clock Cycle (Pipelined VALID/READY)",
      timingEquation: "T_burst = T_addr_phase + (N_beats * T_data_cycle)",
      efficiencyMath: "Bus Efficiency = 95%-99% (Out-of-order execution hides memory stall latency)",
      pinCount: "50-150 Signals across 5 channels (AW, W, B, AR, R)"
    };
  } else if (id === "ahb") {
    return {
      bandwidthFormula: "Maximum Bandwidth = (F_clk * Data_Bits / 8) * Efficiency",
      freqRange: "50 MHz - 400 MHz On-chip Main Memory Bus",
      latencyFormula: "2-Stage Pipelined: Address Phase (Cycle N) overlaps with Data Phase (Cycle N-1)",
      timingEquation: "T_total = 1 Address Cycle + N Data Cycles",
      efficiencyMath: "Bus Efficiency = 80%-90% (Pipelined address/data overlapping)",
      pinCount: "25-40 Signals (HADDR, HWDATA, HRDATA, HWRITE, HSEL, HREADY, HRESP, HTRANS)"
    };
  } else if (id === "spi") {
    return {
      bandwidthFormula: "Bit Rate = F_sclk (Full Duplex Concurrent MOSI & MISO)",
      freqRange: "1 MHz - 100 MHz Synchronous Serial",
      latencyFormula: "Baud Rate = F_system_clk / (2 * SPI_DIVISOR)",
      timingEquation: "Mode 0/1/2/3 timing defined by CPOL (Clock Idle) and CPHA (Sampling Edge)",
      efficiencyMath: "Bus Efficiency = 100% per clock edge (No address framing overhead)",
      pinCount: "4 Signals (SCLK, MOSI, MISO, CS#)"
    };
  } else if (id === "i2c") {
    return {
      bandwidthFormula: "Standard: 100 kbps | Fast: 400 kbps | Fast+: 1 Mbps | High-Speed: 3.4 Mbps",
      freqRange: "100 kHz - 3.4 MHz Open-Drain Synchronous",
      latencyFormula: "Byte Latency = 9 SCL cycles (8 data bits + 1 ACK/NACK bit)",
      timingEquation: "Pull-up Resistor Equation: R_pullup_min = (V_CC - V_OL) / I_OL; R_max = t_r / (0.8473 * C_bus)",
      efficiencyMath: "Bus Efficiency = ~75% (Includes START, STOP, 7-bit/10-bit address header)",
      pinCount: "2 Signals (SDA - Serial Data, SCL - Serial Clock)"
    };
  } else if (id === "uart") {
    return {
      bandwidthFormula: "Effective Throughput = Baud_Rate * (Data_Bits / Total_Frame_Bits)",
      freqRange: "9600 Baud to 3.0 Mbps Asynchronous Serial",
      latencyFormula: "Baud Rate Generator = F_clk / (16 * Baud_Divisor)",
      timingEquation: "Frame = 1 Start Bit + 5-9 Data Bits + 1 Parity Bit + 1-2 Stop Bits",
      efficiencyMath: "Bus Efficiency = 80% (10 bits per 8-bit data byte frame)",
      pinCount: "2 Signals (TXD - Transmit, RXD - Receive)"
    };
  } else if (id === "pcie") {
    return {
      bandwidthFormula: "Gen3: 8.0 GT/s * Lanes * (128/130) | Gen4: 16.0 GT/s * Lanes | Gen5: 32.0 GT/s * Lanes",
      freqRange: "2.5 GHz - 32.0 GHz High-Speed SerDes Differential",
      latencyFormula: "Packet Latency = TLP Framing + Flow Control Credit Check + SerDes Deserialization",
      timingEquation: "Total Bandwidth (x16 Gen4) = 16 * 16.0 GT/s * 0.985 = ~31.5 GB/s",
      efficiencyMath: "Bus Efficiency = >98.5% (128b/130b line encoding)",
      pinCount: "4-64 High-speed differential pairs (PETp/n, PERp/n, REFCLKp/n)"
    };
  } else if (id === "usb") {
    return {
      bandwidthFormula: "USB 2.0: 480 Mbps | USB 3.0: 5.0 Gbps | USB 3.2: 20 Gbps | USB4: 40 Gbps",
      freqRange: "12 MHz - 10 GHz Differential Pair",
      latencyFormula: "Frame Latency = 1 ms (Full Speed) / 125 us (High Speed SOF frame interval)",
      timingEquation: "NRZI Encoding with Bit Stuffing (Insert 0 after six consecutive 1s)",
      efficiencyMath: "Bus Efficiency = 85%-92% (Packet headers + CRC16 checks)",
      pinCount: "4-12 Pins (VBUS, D+, D-, GND, SSTX+, SSTX-, SSRX+, SSRX-)"
    };
  }
  return {
    bandwidthFormula: "Bit Rate = F_osc / (2 * Prescaler * Total_Time_Quanta)",
    freqRange: "125 kbps - 1.0 Mbps Automotive Differential",
    latencyFormula: "Frame Latency = (47 + 8 * Data_Bytes) * T_bit",
    timingEquation: "Bit Time = T_sync_seg + T_prop_seg + T_phase_seg1 + T_phase_seg2",
    efficiencyMath: "Bus Efficiency = ~60% (11-bit / 29-bit ID header + 15-bit CRC)",
    pinCount: "2 Signals (CAN_H, CAN_L)"
  };
}

function renderHandbookPageContent(pageNo, protoId, current, mathData) {
  if (pageNo === 1) {
    return `
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="bg-slate-900/60 p-5 rounded-2xl border border-white/5 flex flex-col gap-3">
          <h3 class="text-sm font-heading font-extrabold text-cyan-400 uppercase tracking-widest flex items-center gap-2">
            <i class="fa-solid fa-sitemap"></i> Protocol Architecture &amp; Topologies
          </h3>
          <p class="text-gray-300 leading-relaxed">${current.detailedDescription || current.overview}</p>
          <div class="p-3 bg-slate-950 rounded-xl border border-white/5 font-mono text-[11px] text-cyan-300 mt-2">
            <strong>Target Standard:</strong> ${current.type}<br>
            <strong>Bus Topology:</strong> ${current.name} Master-Slave Interconnect Infrastructure
          </div>
        </div>

        <div class="bg-slate-900/60 p-5 rounded-2xl border border-white/5 flex flex-col gap-3">
          <h3 class="text-sm font-heading font-extrabold text-purple-400 uppercase tracking-widest flex items-center gap-2">
            <i class="fa-solid fa-star"></i> Protocol Significance &amp; Engineering Role
          </h3>
          <p class="text-gray-300 leading-relaxed">${current.overview}</p>
          <div class="p-3 bg-slate-950 rounded-xl border border-white/5 font-mono text-[11px] text-purple-300 mt-2">
            <strong>Physical Interface Pins:</strong> ${mathData.pinCount}
          </div>
        </div>
      </div>
    `;
  } else if (pageNo === 2) {
    return `
      <div class="flex flex-col gap-4">
        <h3 class="text-sm font-heading font-extrabold text-white uppercase tracking-widest flex items-center gap-2">
          <i class="fa-solid fa-handshake"></i> ${current.name} Signal Matrix &amp; Handshake Mapping
        </h3>
        <p class="text-gray-400 text-xs">Complete signal direction, bit-widths, and handshake semantics for ${current.name}.</p>
        
        <div class="overflow-x-auto bg-slate-900/60 rounded-2xl border border-white/5 p-4">
          <table class="w-full text-left text-xs border-collapse">
            <thead>
              <tr class="border-b border-white/10 font-mono text-cyan-400">
                <th class="py-2.5 px-3">Signal Name</th>
                <th class="py-2.5 px-3">Direction</th>
                <th class="py-2.5 px-3">Functional Description</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-white/5 font-sans">
              ${current.signals.map(s => `
                <tr class="hover:bg-slate-950/40">
                  <td class="py-2.5 px-3 font-mono text-cyan-300 font-bold">${s.name}</td>
                  <td class="py-2.5 px-3 font-mono text-purple-300 font-bold">${s.dir}</td>
                  <td class="py-2.5 px-3 text-gray-300">${s.desc}</td>
                </tr>
              `).join("")}
            </tbody>
          </table>
        </div>
      </div>
    `;
  } else if (pageNo === 3) {
    return `
      <div class="flex flex-col gap-6">
        <h3 class="text-sm font-heading font-extrabold text-cyan-400 uppercase tracking-widest flex items-center gap-2">
          <i class="fa-solid fa-calculator"></i> ${current.name} Protocol Formulas &amp; Bandwidth Calculations
        </h3>
        <p class="text-gray-300 leading-relaxed">Unique mathematical equations governing throughput, latency bounds, frequency scaling, and bus efficiency for ${current.name}.</p>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="p-4 bg-slate-900/80 rounded-2xl border border-cyan-500/30 flex flex-col gap-2 font-mono">
            <strong class="text-cyan-300 text-xs uppercase">⚡ Bandwidth Equation:</strong>
            <p class="text-white text-xs bg-slate-950 p-3 rounded-xl border border-white/5">${mathData.bandwidthFormula}</p>
          </div>

          <div class="p-4 bg-slate-900/80 rounded-2xl border border-purple-500/30 flex flex-col gap-2 font-mono">
            <strong class="text-purple-300 text-xs uppercase">⏱️ Operating Frequency Range:</strong>
            <p class="text-white text-xs bg-slate-950 p-3 rounded-xl border border-white/5">${mathData.freqRange}</p>
          </div>

          <div class="p-4 bg-slate-900/80 rounded-2xl border border-emerald-500/30 flex flex-col gap-2 font-mono">
            <strong class="text-emerald-300 text-xs uppercase">📊 Latency &amp; Transfer Equation:</strong>
            <p class="text-white text-xs bg-slate-950 p-3 rounded-xl border border-white/5">${mathData.latencyFormula}</p>
          </div>

          <div class="p-4 bg-slate-900/80 rounded-2xl border border-amber-500/30 flex flex-col gap-2 font-mono">
            <strong class="text-amber-300 text-xs uppercase">📈 Bus Efficiency Calculation:</strong>
            <p class="text-white text-xs bg-slate-950 p-3 rounded-xl border border-white/5">${mathData.efficiencyMath}</p>
          </div>
        </div>

        <div class="p-4 bg-slate-950 rounded-2xl border border-white/10 flex flex-col gap-2">
          <strong class="text-cyan-400 font-mono text-xs">📐 Precise Timing Phase Equation:</strong>
          <code class="text-emerald-400 font-mono text-xs bg-slate-900 p-3 rounded-xl block">${mathData.timingEquation}</code>
        </div>
      </div>
    `;
  } else if (pageNo === 4) {
    return `
      <div class="flex flex-col gap-6">
        <h3 class="text-sm font-heading font-extrabold text-purple-400 uppercase tracking-widest flex items-center gap-2">
          <i class="fa-solid fa-clock"></i> State Machine &amp; Timing Transition Diagrams
        </h3>
        <p class="text-gray-300 leading-relaxed">${current.timing || "Handshake waveforms and state transition sequences."}</p>
        
        <div class="p-5 bg-slate-900/60 rounded-2xl border border-white/5 flex flex-col gap-3 font-mono text-xs">
          <strong class="text-purple-300">State Machine Flow:</strong>
          <p class="text-gray-300 font-sans leading-relaxed">${current.handshakeArchitecture || current.overview}</p>
        </div>
      </div>
    `;
  } else if (pageNo === 5) {
    return `
      <div class="flex flex-col gap-6">
        <h3 class="text-sm font-heading font-extrabold text-red-400 uppercase tracking-widest flex items-center gap-2">
          <i class="fa-solid fa-shield-halved"></i> Error Handling, CRC &amp; Design Verification
        </h3>
        <p class="text-gray-300 leading-relaxed">${current.errorHandling || "Fault detection mechanisms, parity checking, and assertion rules."}</p>

        <div class="p-4 bg-slate-900/60 rounded-2xl border border-white/5 flex flex-col gap-2">
          <strong class="text-red-300 font-mono text-xs">DV Assertion Check Rule:</strong>
          <p class="text-gray-300 text-xs font-sans">${current.revision || "Always check that valid signals do not drop before ready signals assert."}</p>
        </div>
      </div>
    `;
  } else {
    return `
      <div class="flex flex-col gap-6">
        <h3 class="text-sm font-heading font-extrabold text-emerald-400 uppercase tracking-widest flex items-center gap-2">
          <i class="fa-solid fa-microchip"></i> Real-World Silicon Applications &amp; Interview Cheat Sheet
        </h3>
        <p class="text-gray-300 leading-relaxed">${current.useCases || "Used extensively across mobile SoCs, GPUs, microcontrollers, and automotive ECUs."}</p>

        <div class="p-4 bg-slate-900/60 rounded-2xl border border-white/5 flex flex-col gap-2">
          <strong class="text-emerald-300 font-mono text-xs">Interview Pro Tip:</strong>
          <p class="text-gray-300 text-xs font-sans">Focus on explaining the ready/valid handshake, burst mode parameters, and latency bounds for ${current.name} during DV technical rounds!</p>
        </div>
      </div>
    `;
  }
}
