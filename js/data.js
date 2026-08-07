/* VLSIVerse Core Database - Extended Theory Descriptions and Bulleted Shortcuts Arrays */

const VLSIData = {
  // --- 1. 15 LEARN TOPICS WITH BULLETED SHORTCUTS ---
  topics: {
    "digital-electronics": {
      title: "Digital Electronics & Number Systems",
      description: "Binary arithmetic, logic levels, noise margins, electrical parameters, and code conversions.",
      theory: "Digital electronics forms the bedrock of silicon engineering. Physical signal representations map continuous voltages into binary logic states: Logic 0 (Low) and Logic 1 (High), bounded by noise immunity margins (V_NMH and V_NML).\n\n### Key Concepts & Electrical Parameters:\n1. **Voltage Transfer Characteristic (VTC):** Defines output response vs input voltage. Key thresholds:\n   - **V_OH (Output High Min):** Minimum voltage guaranteed by an output pin when driving Logic 1.\n   - **V_OL (Output Low Max):** Maximum voltage guaranteed by an output pin when driving Logic 0.\n   - **V_IH (Input High Min):** Minimum voltage recognized by a gate input as Logic 1.\n   - **V_IL (Input Low Max):** Maximum voltage recognized by a gate input as Logic 0.\n2. **Noise Immunity Margins:**\n   - **High-State Noise Margin:** `V_NMH = V_OH - V_IH`\n   - **Low-State Noise Margin:** `V_NML = V_IL - V_OL`\n3. **Signed Number Systems & Arithmetic:**\n   - **Sign-Magnitude:** MSB represents sign (0 = positive, 1 = negative). Suffers from dual-zero representation (+0 and -0).\n   - **One's Complement:** Invert all bits. Dual zero issue remains.\n   - **Two's Complement:** Invert all bits and add 1 (2^N - N). Single zero, simple arithmetic hardware implementation. Max range for N bits: `-2^(N-1)` to `+2^(N-1)-1`.\n4. **Gray Code & Switching Hazards:**\n   - Gray codes enforce a single-bit transition between consecutive binary values (Single-Bit-Change-Code).\n   - Prevents glitches, code drops, and synchronization errors in rotary encoders and asynchronous FIFOs.",
      shortcuts: [
        "Noise Margin High: V_NMH = V_OH - V_IH (Protects logic 1 state).",
        "Noise Margin Low: V_NML = V_IL - V_OL (Protects logic 0 state).",
        "Two's Complement Rule: Invert all bits (1's complement) and add 1.",
        "N-bit Two's Complement Range: -2^(N-1) to +(2^(N-1) - 1).",
        "Binary to Gray: G_MSB = B_MSB; G_i = B_(i+1) XOR B_i.",
        "Gray to Binary: B_MSB = G_MSB; B_i = B_(i+1) XOR G_i.",
        "Fan-Out: N_fanout = I_OH_max / I_IH_max (maximum driven gate loads).",
        "Propagation Delay: t_pd = (t_pHL + t_pLH) / 2.",
        "Power-Delay Product (PDP): PDP = P_avg * t_pd (measures gate efficiency in Joules).",
        "ECL Logic Family: High speed, non-saturating BJTs, high static power dissipation."
      ],
      interviews: [{ q: "What is fan-out?", a: "The maximum number of standard logic gates that a single output driver can connect to without signal degradation." }]
    },
    "boolean-algebra": {
      title: "Boolean Algebra & K-Map Minimization",
      description: "De Morgan's laws, Karnaugh maps, prime implicants, duality, and consensus theorem.",
      theory: "Boolean algebra provides the mathematical framework for simplifying digital logic circuits to minimize gate count, silicon die area, and propagation delay.\n\n### Core Theorems & Optimization Methods:\n1. **De Morgan's Theorems:**\n   - `~(A + B) = ~A . ~B` (Break the sum line, change to product).\n   - `~(A . B) = ~A + ~B` (Break the product line, change to sum).\n2. **Duality Principle:**\n   - Swap AND (.) with OR (+), and 0 with 1, keeping variable names intact.\n3. **Consensus Theorem:**\n   - `AB + ~A.C + BC = AB + ~A.C` (The term BC is redundant).\n   - Dual: `(A + B)(~A + C)(B + C) = (A + B)(~A + C)`.\n4. **Karnaugh Map (K-Map) Minimization:**\n   - Uses Gray code ordering on cell axes (00, 01, 11, 10) so adjacent cells differ by 1 bit.\n   - Group cells in powers of 2 (1, 2, 4, 8, 16).\n   - A group of 2^k adjacent cells in an n-variable K-map eliminates k variables.\n   - **Prime Implicant (PI):** A rectangle of minterms that cannot be combined into a larger group.\n   - **Essential Prime Implicant (EPI):** A PI that covers at least one minterm not covered by any other PI.",
      shortcuts: [
        "De Morgan 1: ~(A + B) = ~A . ~B (OR becomes AND of complements).",
        "De Morgan 2: ~(A . B) = ~A + ~B (AND becomes OR of complements).",
        "Consensus Theorem: AB + A'C + BC = AB + A'C (Eliminates redundant term BC).",
        "K-Map Cell Grouping: Always group in powers of 2 (1, 2, 4, 8, 16).",
        "K-Map Variable Reduction: Grouping 2^k cells eliminates k variables.",
        "Essential Prime Implicant (EPI): Contains at least one 1 unique to that group.",
        "Duality Rule: Swap + with ., 0 with 1; variables remain unchanged.",
        "Universal Gates: NAND and NOR can realize any boolean function without extra gates.",
        "XOR Properties: A ^ 0 = A; A ^ 1 = ~A; A ^ A = 0; A ^ ~A = 1.",
        "Shannon's Expansion: F(A,B,C,..) = A . F(1,B,C,..) + A' . F(0,B,C,..)."
      ],
      interviews: [{ q: "Explain the Consensus Theorem.", a: "XY + YZ + X'Z = XY + X'Z. The YZ term is redundant and can be eliminated." }]
    },
    "combinational-logic": {
      title: "Combinational Logic & Module Design",
      description: "Multiplexers, decoders, encoders, priority encoders, and carry-lookahead adders.",
      theory: "Combinational logic circuits are time-independent systems where outputs depend strictly on current inputs.\n\n### Core Building Blocks & Architectures:\n1. **Multiplexers (MUX):**\n   - 2^N:1 MUX requires N select control lines. Output equation: `Y = Σ I_k . m_k(S)`.\n   - Universal property: An N-input MUX (2^N:1) can implement ANY boolean function of N+1 variables.\n2. **Decoders & Encoders:**\n   - **N:2^N Decoder:** Decodes binary inputs into 2^N one-hot output signals.\n   - **Priority Encoder:** Evaluates multiple simultaneous active inputs, encoding the index of the highest priority input.\n3. **Adders & Parallel Carry Architectures:**\n   - **Half Adder:** `Sum = A ^ B`, `Carry = A . B`.\n   - **Full Adder:** `Sum = A ^ B ^ Cin`, `Carry = AB + BCin + ACin`.\n   - **Ripple Carry Adder (RCA):** Serial carry propagation delay `t_delay = N * t_carry`.\n   - **Carry Lookahead Adder (CLA):** Computes carries in parallel using Generate (`G_i = A_i . B_i`) and Propagate (`P_i = A_i ^ B_i`). `C_(i+1) = G_i + P_i . C_i`. Eliminates O(N) ripple delays.",
      shortcuts: [
        "2^N to 1 MUX requires N select control lines.",
        "Universal MUX Rule: 2^N:1 MUX implements any N+1 variable boolean function.",
        "Decoder Output Count: N input lines yield 2^N one-hot active output lines.",
        "Priority Encoder: Resolves input conflicts by encoding highest index active bit.",
        "Full Adder Equations: Sum = A ^ B ^ Cin; Cout = AB + Cin(A ^ B).",
        "Carry Generate (Gi): Gi = Ai . Bi (Generates carry regardless of Cin).",
        "Carry Propagate (Pi): Pi = Ai ^ Bi (Propagates incoming carry Cin).",
        "CLA Carry Equation: C1 = G0 + P0.C0; C2 = G1 + P1.G0 + P1.P0.C0.",
        "Glitch/Hazard: Caused by unequal propagation path delays in combinational nets.",
        "Static-1 Hazard Fix: Add redundant consensus terms covering adjacent minterms."
      ],
      interviews: [{ q: "What is a hazard?", a: "A transient output glitch that occurs when input changes travel through paths with different propagation delays." }]
    },
    "sequential-logic": {
      title: "Sequential Logic & Finite State Machines",
      description: "Latches vs Flip-Flops, SR, D, JK, T flip-flops, counters, shift registers, Moore & Mealy FSMs.",
      theory: "Sequential logic includes memory elements (latches and flip-flops) whose outputs depend on current inputs and past stored states.\n\n### Latches vs Flip-Flops & FSM Design:\n1. **Latches vs Flip-Flops:**\n   - **Latch:** Level-sensitive (transparent while clock is active high/low).\n   - **Flip-Flop:** Edge-triggered (samples data on active clock transition posedge/negedge).\n2. **Flip-Flop Characteristic Equations:**\n   - **D FF:** `Q(next) = D`\n   - **JK FF:** `Q(next) = J.~Q + ~K.Q` (Toggles when J=1, K=1)\n   - **T FF:** `Q(next) = T ^ Q` (Toggles when T=1)\n3. **Counters & Shift Registers:**\n   - **Modulus (Mod-N):** Number of unique states. Requires `ceil(log2(N))` flip-flops.\n   - **Ring Counter:** N bits -> N states.\n   - **Johnson (Twisted Ring) Counter:** N bits -> 2N states.\n4. **Finite State Machines (FSM):**\n   - **Moore FSM:** Outputs depend **only** on current state registers. Synchronous outputs.\n   - **Mealy FSM:** Outputs depend on **current state and current inputs**. Asynchronous output glitches possible if inputs change.",
      shortcuts: [
        "Latch = Level-sensitive; Flip-Flop = Edge-triggered.",
        "D Flip-Flop Equation: Q(next) = D.",
        "JK Flip-Flop Equation: Q(next) = J.Q' + K'.Q (J=1, K=1 toggles output).",
        "T Flip-Flop Equation: Q(next) = T ^ Q (T=1 toggles output).",
        "Mod-N Counter FF Count: Requires N_ff = ceil(log2(N)) flip-flops.",
        "Ring Counter States: N flip-flops yield N states.",
        "Johnson Counter States: N flip-flops yield 2N states.",
        "Moore FSM: Output depends strictly on current state registers.",
        "Mealy FSM: Output depends on current state AND input pins.",
        "One-Hot FSM Encoding: Uses 1 FF per state; minimizes combinational decode logic."
      ],
      interviews: [{ q: "Mealy vs Moore?", a: "Mealy outputs change with input changes instantly. Moore outputs update only on clock edges." }]
    },
    "cmos": {
      title: "CMOS Logic & Silicon Transistor Architecture",
      description: "NMOS/PMOS characteristics, pull-up/pull-down networks, sub-threshold leakage, and latch-up prevention.",
      theory: "Complementary Metal-Oxide-Semiconductor (CMOS) logic is the dominant IC technology due to high noise immunity and zero static power dissipation in ideal steady states.\n\n### Structure & Electrical Characteristics:\n1. **Pull-Up Network (PUN) & Pull-Down Network (PDN):**\n   - **PUN:** Built with PMOS transistors connected to VDD. PMOS conducts strong Logic 1, weak Logic 0 (V_source drops below |V_tp|).\n   - **PDN:** Built with NMOS transistors connected to GND. NMOS conducts strong Logic 0, weak Logic 1 (VDD - V_tn).\n   - De Morgan Duality: Series PMOS <-> Parallel NMOS (NOR gate); Parallel PMOS <-> Series NMOS (NAND gate).\n2. **Power Dissipation in CMOS:**\n   - **Dynamic Power:** `P_dynamic = C_load * VDD^2 * f_clk * alpha` (where alpha is activity factor).\n   - **Static/Leakage Power:** `P_static = I_leak * VDD` (sub-threshold leakage + gate oxide tunneling).\n3. **Latch-Up Failure:**\n   - Low-impedance short circuit triggered between VDD and GND via parasitic PNPN thyristor structure.\n   - **Prevention:** Place substrate guard rings, tap N-wells to VDD, and tap P-substrates to GND.",
      shortcuts: [
        "PMOS: Conducts strong 1, weak 0 (Used in PUN to VDD).",
        "NMOS: Conducts strong 0, weak 1 (Used in PDN to GND).",
        "CMOS NAND: PMOS in parallel (PUN), NMOS in series (PDN).",
        "CMOS NOR: PMOS in series (PUN), NMOS in parallel (PDN).",
        "Transmission Gate (TG): Parallel NMOS + PMOS passes full rail-to-rail voltage.",
        "Dynamic Power Equation: P_dynamic = C_load * VDD^2 * f * alpha.",
        "Voltage Scaling Impact: Halving VDD reduces dynamic power by 75%.",
        "Sub-threshold Leakage: Increases exponentially with decreasing threshold voltage Vth.",
        "CMOS Latch-Up Cause: Parasitic PNPN thyristor triggering between VDD and GND.",
        "Latch-Up Fix: Place guard rings and minimize bulk substrate resistance."
      ],
      interviews: [{ q: "What is CMOS latch-up?", a: "Parasitic SCR triggering between VDD and GND, causing high current shorts." }]
    },
    "verilog": {
      title: "Verilog HDL & RTL Synthesis Guidelines",
      description: "Syntax, modules, blocking vs non-blocking assignments, and synthesis rules.",
      theory: "Verilog HDL models hardware at structural, dataflow, and behavioral abstraction levels.\n\n### Key Synthesis Guidelines:\n1. **Procedural Assignments:**\n   - **Blocking (`=`):** Evaluates and updates immediately. Use exclusively for combinational logic inside `always @(*)` blocks.\n   - **Non-blocking (`<=`):** Schedules updates for the end of the time step. Use exclusively for sequential logic inside `always @(posedge clk)` blocks to prevent race conditions.\n2. **Latch Avoidance:**\n   - Unspecified output paths in combinational `if-else` or `case` statements infer unwanted memory latches.\n   - **Fix:** Assign default values at the start of always blocks or cover all branches with a `default` case.\n3. **Net vs Variable Types:**\n   - `wire`: Represents physical structural connections (driven by `assign`).\n   - `reg`: Holds procedural assignment values inside `always` blocks.",
      shortcuts: [
        "Use blocking (=) for combinational always @(*) blocks.",
        "Use non-blocking (<=) for sequential always @(posedge clk) blocks.",
        "Continuous assign: Drives net types (wire) continuously in dataflow mode.",
        "Prevent Latches: Fully specify all branches in if-else and case statements.",
        "Sensitivity List: Use always @(*) to avoid missing inputs in combinational blocks.",
        "High Impedance Z: Represented as 1'bz (tri-state bus output).",
        "Undefined State X: Represented as 1'bx (simulation contention or uninitialized net).",
        "Concatenation Operator: {a, b} joins vectors; {4{a}} replicates bit a four times.",
        "Task vs Function: Functions execute in 0 time (no delays); Tasks can consume simulation time.",
        "Synthesis Exclusion: Initial blocks, # delays, and real data types are not synthesizable."
      ],
      interviews: [{ q: "Task vs Function?", a: "Functions execute in 0 time, cannot have delays. Tasks can have temporal delays." }]
    },
    "systemverilog": {
      title: "SystemVerilog & Advanced Verification",
      description: "Interfaces, OOP classes, logic types, random constraints, and coverage.",
      theory: "SystemVerilog extends Verilog by unifying hardware description and object-oriented testbench verification.\n\n### SystemVerilog Features:\n1. **Data Types:**\n   - `logic`: 4-state type (0, 1, X, Z). Single-driver net that replaces wire and reg.\n   - `bit`: 2-state type (0, 1). Efficient for testbench vectors and performance.\n2. **Interfaces & Modports:**\n   - Bundles related signals together into a single port connector.\n   - `modport` specifies pin directions (input/output/inout) for specific modules.\n3. **Object-Oriented Programming (OOP):**\n   - Classes, objects, inheritance, polymorphism, and random constraint solvers (`rand`, `constraint`).\n4. **Functional Coverage:**\n   - Measures test progress against verification plan covergroups and coverpoints.",
      shortcuts: [
        "logic Type: 4-state (0, 1, X, Z) single-driver data type.",
        "bit Type: 2-state (0, 1) high-performance testbench type.",
        "Interface: Bundles connection signals and enforces directions using modports.",
        "Dynamic Array: Resized at runtime using new[size] operator.",
        "Associative Array: Sparse key-value dictionary array.",
        "Queue Array: Bounded/unbounded FIFO buffer array ($ push/pop).",
        "Randomization: Declare rand variables and apply constraint bounds.",
        "Functional Coverage: Tracks tested scenarios using covergroups and coverpoints.",
        "Package: Shared database for parameters, typedefs, and class definitions.",
        "Virtual Interface: Allows OOP class components to drive physical module pins."
      ],
      interviews: [{ q: "logic vs bit?", a: "logic is 4-valued (0,1,X,Z); bit is 2-valued (0,1)." }]
    },
    "assertions": {
      title: "SystemVerilog Assertions (SVA)",
      description: "Immediate vs concurrent assertions, sequence operators, and temporal logic.",
      theory: "SystemVerilog Assertions (SVA) specify temporal rules to verify design behavior dynamically or formally.\n\n### Assertion Types & Operators:\n1. **Immediate Assertions:** Evaluated procedurally like `if` statements.\n2. **Concurrent Assertions:** Evaluated on clock edges across multiple cycles (`property`).\n3. **Implication Operators:**\n   - **Overlapping (`|->`):** If antecedent matches, evaluate consequent in the SAME cycle.\n   - **Non-overlapping (`|=>`):** If antecedent matches, evaluate consequent in the NEXT cycle (`##1`).\n4. **Repetition Operators:**\n   - `[*n]`: Consecutive repetition `n` times.\n   - `[=n]`: Non-consecutive repetition `n` times.",
      shortcuts: [
        "Immediate Assertions: Evaluated procedurally inside always blocks.",
        "Concurrent Assertions: Evaluated on clock edges across temporal cycles.",
        "Overlapping Implication (|->): Checks consequent in the same cycle.",
        "Non-overlapping Implication (|=>): Checks consequent 1 cycle later (##1).",
        "Delay Operator (##n): Delays evaluation by n clock cycles.",
        "Consecutive Repetition ([*n]): Specifies n consecutive matches.",
        "Assert vs Assume: Assert verifies design; Assume constrains inputs in formal tools.",
        "Cover Property: Monitors if a specific temporal sequence was hit in test runs.",
        "Local Variables: Track data across multi-cycle sequences.",
        "Failure Action: Triggers error logs to pinpoint bugs instantly."
      ],
      interviews: [{ q: "Immediate vs Concurrent?", a: "Immediate assertions run procedurally; concurrent assertions check temporal sequences on clocks." }]
    },
    "uvm": {
      title: "UVM Verification Framework",
      description: "Universal Verification Methodology, components, factory overrides, and phases.",
      theory: "UVM (Universal Verification Methodology) provides a standardized SystemVerilog framework for building scalable testbenches.\n\n### UVM Architecture & Execution Phases:\n1. **Core Components:**\n   - `uvm_driver`: Converts transaction objects to pin-level signal toggles.\n   - `uvm_monitor`: Samples pin signals and packages them into transaction objects.\n   - `uvm_sequencer`: Controls sequence item flow to drivers.\n   - `uvm_scoreboard`: Compares actual DUT outputs against expected reference models.\n2. **Phases Order:**\n   - `build_phase` (Top-down, 0 time) -> `connect_phase` (Bottom-up, 0 time) -> `run_phase` (Consumes time) -> `report_phase` (0 time).\n3. **Factory Overrides:**\n   - Allows substituting transaction or component classes without modifying source code.",
      shortcuts: [
        "build_phase: Constructs components top-down in zero simulation time.",
        "connect_phase: Connects ports and virtual interfaces bottom-up in zero time.",
        "run_phase: The ONLY phase that consumes simulation time.",
        "uvm_driver: Converts transaction packets into pin signal toggles.",
        "uvm_monitor: Samples pin signals via virtual interfaces into transactions.",
        "uvm_scoreboard: Checks DUT outputs against reference models.",
        "Factory Override: Replaces components/transactions without editing source code.",
        "Objection Mechanism: Controls phase start and finish (raise_objection / drop_objection).",
        "uvm_agent: Encapsulates driver, sequencer, and monitor for a protocol.",
        "Config DB: Centralized database for passing parameters and virtual interfaces."
      ],
      interviews: [{ q: "UVM Phase Order?", a: "Build phase runs top-down; Connect, end_of_elaboration, and run_phase run bottom-up." }]
    },
    "dft": {
      title: "Design for Testability (DFT)",
      description: "Scan chains, ATPG fault models, stuck-at faults, MBIST, and JTAG boundary scan.",
      theory: "DFT adds extra test circuitry to silicon designs to detect physical manufacturing defects post-fabrication.\n\n### Core DFT Methodologies:\n1. **Scan Insertion:**\n   - Replaces standard flip-flops with Scan Flip-Flops (multiplexed D input with `Scan Enable SE`).\n   - Chains registers into shift registers to shift in test vectors and shift out capture results.\n2. **Fault Models:**\n   - **Stuck-At Fault (SA0 / SA1):** Line permanently shorted to GND or VDD.\n   - **Bridging Fault:** Short circuit between adjacent signal wires.\n   - **Transition Delay Fault:** Delay fault causing slow 0->1 or 1->0 switching.\n3. **Memory BIST (MBIST) & JTAG:**\n   - **MBIST:** Built-In Self-Test logic embedded directly inside memory arrays.\n   - **JTAG (IEEE 1149.1):** Boundary scan architecture for board-level testing.",
      shortcuts: [
        "Scan Insertion: Converts functional flip-flops into serial shift registers.",
        "Scan Enable (SE): Toggles flip-flops between normal mode (0) and scan shift mode (1).",
        "Stuck-At-0 (SA0): Signal line shorted to GND permanently.",
        "Stuck-At-1 (SA1): Signal line shorted to VDD permanently.",
        "ATPG: Automatic Test Pattern Generation creates vectors to catch faults.",
        "MBIST: Memory Built-In Self-Test tests embedded RAM/ROM arrays.",
        "LBIST: Logic Built-In Self-Test uses PRBS generators for logic testing.",
        "JTAG (IEEE 1149.1): Boundary scan for board-level interconnect testing.",
        "Controllability: Ease of setting an internal node to a desired logic level.",
        "Observability: Ease of observing an internal node's state at primary outputs."
      ],
      interviews: [{ q: "What is ATPG?", a: "Automatic Test Pattern Generation produces stimulus arrays to catch physical silicon faults." }]
    },
    "sta": {
      title: "Static Timing Analysis (STA)",
      description: "Setup and hold timing checks, clock slack, propagation delay, and clock skew.",
      theory: "STA verifies that all timing paths meet setup and hold requirements across all corner conditions without requiring dynamic simulation vectors.\n\n### Timing Path Analysis & Equations:\n1. **Setup Time Check (Max Delay):**\n   - Data must arrive and settle BEFORE clock sampling edge.\n   - `T_arrival = T_clk1 + t_co + t_logic < T_period + T_clk2 - t_setup`\n   - `Setup Slack = T_required - T_arrival >= 0`\n   - **Fix:** Size up cells, optimize logic, or lower clock frequency.\n2. **Hold Time Check (Min Delay):**\n   - Data must remain stable AFTER clock sampling edge.\n   - `T_arrival = T_clk1 + t_co + t_logic > T_clk2 + t_hold` \n   - `Hold Slack = T_arrival - T_required >= 0`\n   - **Independent of Clock Frequency!**\n   - **Fix:** Insert delay buffers in data path.\n3. **Clock Skew & Jitter:**\n   - **Clock Skew:** Difference in clock arrival times at launch vs capture registers (`T_clk2 - T_clk1`).\n   - **Clock Jitter:** Cycle-to-cycle variation in clock period.",
      shortcuts: [
        "Setup Time (t_su): Minimum stable data window BEFORE clock edge.",
        "Hold Time (t_h): Minimum stable data window AFTER clock edge.",
        "Setup Slack Equation: Setup Slack = Required Time - Arrival Time.",
        "Hold Slack Equation: Hold Slack = Arrival Time - Required Time.",
        "Setup Fix: Size up drive cells, reduce logic levels, lower clock speed.",
        "Hold Fix: Insert delay buffers in data path (Independent of clock speed!).",
        "Critical Path: Longest delay path limiting maximum clock frequency.",
        "Clock Skew: Difference in clock arrival time between launch and capture registers.",
        "Positive Skew: Clock arrives at capture register LATER than launch register (helps setup, hurts hold).",
        "SDC File: Synopsys Design Constraints file defining clocks, IO delays, and false paths."
      ],
      interviews: [{ q: "How to fix setup?", a: "Optimize logic, size up drivers, reduce clock frequency." }]
    },
    "physical-design": {
      title: "Physical Design & ASIC Backend",
      description: "Floorplanning, placement, clock tree synthesis (CTS), routing, DRC, and LVS.",
      theory: "Physical design converts synthesized gate netlists into geometric physical mask layouts ready for foundry fabrication.\n\n### Key Physical Design Steps:\n1. **Floorplanning & Power Planning:**\n   - Defines die area, core boundary, IO pad locations, and macro placements.\n   - Builds power grid networks (VDD/GND rings, stripes, and rails).\n2. **Placement:**\n   - Places standard cells into rows while minimizing total wire length and congestion.\n3. **Clock Tree Synthesis (CTS):**\n   - Builds a balanced clock buffer tree to distribute clock signals with minimal skew and latency.\n4. **Routing & Physical Verification:**\n   - **Global & Detail Routing:** Connects all signal pins along metal grid tracks.\n   - **DRC (Design Rule Check):** Verifies metal widths, spacings, and overlaps match foundry design rules.\n   - **LVS (Layout Versus Schematic):** Verifies physical layout connections match the logical netlist.",
      shortcuts: [
        "Floorplanning: Defines chip boundary, macro placements, and IO pad locations.",
        "Power Grid: Uses top thick metal layers (Rings/Stripes) to minimize IR drop.",
        "Placement: Positions standard logic gates into row tracks.",
        "CTS (Clock Tree Synthesis): Distributes clock with minimal skew and latency.",
        "Global Routing: Allocates routing tracks across coarse grid regions.",
        "Detail Routing: Connects pins on exact metal tracks while satisfying DRC.",
        "DRC (Design Rule Check): Verifies physical layout spacing and geometry rules.",
        "LVS (Layout vs Schematic): Compares physical layout netlist against schematic netlist.",
        "Electromigration: Metal atom displacement caused by high current densities.",
        "GDSII / OASIS: Industry standard binary file format exported for manufacturing."
      ],
      interviews: [{ q: "DRC vs LVS?", a: "DRC checks physical spacing layout rules; LVS compares schematic netlist vs layout." }]
    },
    "low-power": {
      title: "Low Power VLSI Architecture",
      description: "Clock gating, power gating, multi-Vt standard cells, and DVFS.",
      theory: "Low Power VLSI techniques reduce static leakage and dynamic switching power dissipation.\n\n### Power Reduction Strategies:\n1. **Dynamic Power Reduction:**\n   - `P_dynamic = C_load * VDD^2 * f * alpha`\n   - **Clock Gating:** Shut off clock distribution to inactive registers using Integrated Clock Gating (ICG) cells.\n   - **Voltage Scaling:** Lowering VDD provides quadratic power savings.\n2. **Static Leakage Power Reduction:**\n   - **Power Gating:** Disconnects VDD or GND using sleep transistors during standby.\n   - **Multi-Vt Cells:** Use High-Vth cells on non-critical paths to minimize sub-threshold leakage, and Low-Vth cells on critical paths for speed.\n3. **Multi-Voltage Domains & DVFS:**\n   - **Level Shifters:** Bridge signals between different voltage domains.\n   - **Isolation Cells:** Clamp outputs of power-gated domains to prevent floating inputs.",
      shortcuts: [
        "Dynamic Power Equation: P = C * VDD^2 * f * alpha (Quadratic VDD impact!).",
        "Clock Gating: Disables clock trees to save dynamic power in idle registers.",
        "Power Gating: Shut off supply voltage (VDD) to save static leakage power.",
        "High-Vt Cells: Slow switching, extremely low leakage (Used on non-critical paths).",
        "Low-Vt Cells: Fast switching, high leakage (Used on critical timing paths).",
        "Sleep Transistors: Header (PMOS) or Footer (NMOS) switches for power gating.",
        "Level Shifters: Interface signals crossing between different voltage domains.",
        "Isolation Cells: Clamp signals from power-gated blocks to prevent floating inputs.",
        "DVFS: Dynamic Voltage and Frequency Scaling adjusts power to workload demands.",
        "UPF / CPF: Unified Power Format files defining power intent and domain rules."
      ],
      interviews: [{ q: "Power reduction techniques?", a: "Clock gating, power gating, multi-VDD, multi-Vt, DVFS." }]
    },
    "rtl-design": {
      title: "RTL Design & System Architecture",
      description: "Coding styles, state machine optimization, and clock domain crossing.",
      theory: "RTL (Register-Transfer Level) design translates system specifications into synthesizable HDL code following strict micro-architectural rules.\n\n### Micro-Architecture & Coding Rules:\n1. **Combinational vs Sequential Blocks:**\n   - Keep combinational logic separated from sequential register updates when possible.\n   - Use non-blocking assignments (`<=`) for registers and blocking (`=`) for combinational logic.\n2. **Clock Domain Crossing (CDC) Safeguards:**\n   - Never pass unsynchronized multi-bit signals directly across asynchronous clock domains.\n   - Use 2-flop synchronizers for single-bit signals.\n   - Use Asynchronous FIFOs or Handshake protocols for multi-bit buses.\n   - Use Gray code pointers in FIFOs to ensure single-bit transition property.",
      shortcuts: [
        "RTL Rule 1: Always use non-blocking (<=) for clocked register always blocks.",
        "RTL Rule 2: Always use blocking (=) for combinational always @(*) blocks.",
        "Latch Prevention: Specify default values or complete if-else / case branches.",
        "CDC Single Bit: Use 2-stage DFF synchronizer at destination domain.",
        "CDC Multi Bit: Use Asynchronous FIFO or Handshake protocol.",
        "Async FIFO Pointers: Encode in Gray code to avoid multi-bit read glitches.",
        "Metastability: Unstable intermediate state caused by setup/hold violations.",
        "MTBF (Mean Time Between Failures): Measures synchronizer reliability against metastability.",
        "Reset Strategy: Asynchronous assertion, synchronous de-assertion (Async Reset Synchronizer).",
        "One-Hot FSM: Fast decode, high register count; ideal for FPGA architectures."
      ],
      interviews: [{ q: "How to resolve metastability?", a: "Use multi-stage synchronizers (2 DFFs) at the destination domain." }]
    },
    "asic-flow": {
      title: "ASIC Design Flow & Methodology",
      description: "Frontend to backend design steps, tape-out signoff, and EDA toolflows.",
      theory: "The ASIC Design Flow transforms high-level behavioral specifications into verified physical silicon chips.\n\n### Stages in the ASIC Flow:\n1. **Frontend (Specification to Netlist):**\n   - Architecture & Specification -> RTL Coding -> Functional Simulation -> Logic Synthesis (RTL to Gate-Level Netlist) -> DFT Scan Insertion -> Formal Equivalence Checking (LEC).\n2. **Backend (Netlist to GDSII Layout):**\n   - Floorplanning & Power Planning -> Placement -> Clock Tree Synthesis (CTS) -> Routing -> Parasitic Extraction (RC) -> Static Timing Analysis (STA) Signoff -> Physical Verification (DRC/LVS) -> Tape-out (GDSII export).",
      shortcuts: [
        "Frontend Flow: Specs -> RTL -> Simulation -> Synthesis -> DFT -> LEC.",
        "Backend Flow: Floorplan -> Power Plan -> Placement -> CTS -> Route -> Extraction -> STA -> DRC/LVS -> Tapeout.",
        "Logic Synthesis: Converts RTL description into gate-level netlist using target cell library.",
        "LEC (Equivalence Check): Formally verifies RTL matches post-synthesis netlist without simulation.",
        "Parasitic Extraction (RC): Calculates wire resistance and capacitance from physical layout.",
        "Back-Annotation: Applies physical layout RC delays back to gate-level timing simulation.",
        "Signoff: Final verification checks (STA, DRC, LVS) required before chip manufacturing.",
        "Tape-out: Release of final GDSII/OASIS layout files to semiconductor foundry.",
        "SDC File: Contains timing constraints (clocks, IO delays, multicycle paths).",
        "Standard Cell Library: Contains characterization data (Liberty .lib, LEF abstracts, GDS layouts)."
      ],
      interviews: [{ q: "Frontend vs Backend?", a: "Frontend: RTL, sim, synthesis. Backend: Physical floorplanning, CTS, routing, tape-out." }]
    }
  },

  // --- 2. 16 VIRTUAL LABS ---
  labs: {
    "logic-gates": {
      name: "Logic Gates", type: "Combinational",
      description: "AND, OR, XOR, NAND, NOR, and XNOR foundational Boolean operations.",
      signals: ["A", "B", "Output"],
      defaults: { a: 0, b: 0, gate: "AND" },
      explanation: "Logic gates perform standard Boolean operations on input bits.",
      rtl: `module basic_gates (\n    input  wire a, b,\n    input  wire [2:0] sel,\n    output reg  y\n);\n    always @(*) begin\n        case(sel)\n            3'b000: y = a & b; // AND\n            3'b001: y = a | b; // OR\n            3'b010: y = a ^ b; // XOR\n            default: y = 1'b0;\n        endcase\n    end\nendmodule`,
      tb: `module basic_gates_tb;\n    reg a, b; reg [2:0] sel; wire y;\n    basic_gates uut(a, b, sel, y);\n    initial begin\n        a=0; b=0; sel=0; #10 b=1; #10 a=1;\n    end\nendmodule`,
      quiz: [
        { q: "Which gate yields 1 only if inputs are unequal?", opts: ["AND", "OR", "XOR", "NAND"], ans: 2 },
        { q: "Is NAND a universal gate?", opts: ["Yes", "No"], ans: 0 }
      ]
    },
    "half-adder": {
      name: "Half Adder", type: "Combinational",
      description: "Computes 1-bit addition yielding Sum (A ^ B) and Carry_out (A & B).",
      signals: ["A", "B", "Sum", "Carry"],
      defaults: { a: 1, b: 1 },
      explanation: "Half Adders add two 1-bit inputs to produce a Sum and Carry bit without a Carry-In.",
      rtl: `module half_adder (\n    input  wire a, b,\n    output wire sum, carry\n);\n    assign sum   = a ^ b;\n    assign carry = a & b;\nendmodule`,
      tb: `module half_adder_tb;\n    reg a, b; wire sum, carry;\n    half_adder uut(a, b, sum, carry);\n    initial begin\n        a=0; b=0; #10 a=1; #10 b=1;\n    end\nendmodule`,
      quiz: [
        { q: "What is the boolean formula for Half Adder Sum?", opts: ["A & B", "A ^ B", "A | B", "A ~^ B"], ans: 1 },
        { q: "Does a Half Adder accept a Carry-In input?", opts: ["Yes", "No"], ans: 1 }
      ]
    },
    "full-adder": {
      name: "Full Adder", type: "Combinational",
      description: "Cascadable 1-bit adder accepting A, B, and Carry_in (Cin) inputs.",
      signals: ["A", "B", "Cin", "Sum", "Cout"],
      defaults: { a: 1, b: 0, cin: 1 },
      explanation: "Full Adders add three 1-bit inputs (A, B, Cin) to produce Sum and Carry-Out.",
      rtl: `module full_adder (\n    input  wire a, b, cin,\n    output wire sum, cout\n);\n    assign sum  = a ^ b ^ cin;\n    assign cout = (a & b) | (cin & (a ^ b));\nendmodule`,
      tb: `module full_adder_tb;\n    reg a, b, cin; wire sum, cout;\n    full_adder uut(a, b, cin, sum, cout);\n    initial begin\n        a=1; b=1; cin=0; #10 cin=1;\n    end\nendmodule`,
      quiz: [
        { q: "If A=1, B=1, Cin=1, what are Sum and Cout?", opts: ["Sum=0, Cout=0", "Sum=1, Cout=1", "Sum=0, Cout=1"], ans: 1 },
        { q: "How many Half Adders are needed to build 1 Full Adder?", opts: ["1", "2", "3", "4"], ans: 1 }
      ]
    },
    "subtractor": {
      name: "Subtractor", type: "Combinational",
      description: "Half Subtractor and Full Subtractor circuits computing Difference and Borrow.",
      signals: ["A", "B", "Bin", "Diff", "Bout"],
      defaults: { a: 0, b: 1, bin: 0 },
      explanation: "Subtractors compute binary subtraction (A - B - Bin), yielding Difference and Borrow-Out.",
      rtl: `module full_subtractor (\n    input  wire a, b, bin,\n    output wire diff, bout\n);\n    assign diff = a ^ b ^ bin;\n    assign bout = (~a & b) | (~(a ^ b) & bin);\nendmodule`,
      tb: `module subtractor_tb;\n    reg a, b, bin; wire diff, bout;\n    full_subtractor uut(a, b, bin, diff, bout);\n    initial begin\n        a=0; b=1; bin=0; #10 a=1;\n    end\nendmodule`,
      quiz: [
        { q: "What is the Borrow-Out when A=0 and B=1 in a Half Subtractor?", opts: ["0", "1"], ans: 1 },
        { q: "What is the Difference formula for a Subtractor?", opts: ["A ^ B ^ Bin", "A & B & Bin"], ans: 0 }
      ]
    },
    "mux": {
      name: "Multiplexers (2:1 & 4:1)", type: "Combinational",
      description: "Data selectors routing multiple input sources to a single output line based on select pins.",
      signals: ["In0", "In1", "Sel", "Output"],
      defaults: { a: 0, b: 1, sel: 0 },
      explanation: "Multiplexers select one of several inputs to route to the output.",
      rtl: `module mux21 (\n    input  wire a, b, sel,\n    output wire y\n);\n    assign y = sel ? b : a;\nendmodule`,
      tb: `module mux_tb;\n    reg a, b, sel; wire y;\n    mux21 uut(a, b, sel, y);\n    initial begin\n        a=0; b=1; sel=0; #10 sel=1;\n    end\nendmodule`,
      quiz: [
        { q: "How many select lines does a 4:1 MUX require?", opts: ["1", "2", "3", "4"], ans: 1 },
        { q: "Can a MUX implement arbitrary Boolean functions?", opts: ["Yes", "No"], ans: 0 }
      ]
    },
    "demux": {
      name: "Demultiplexers (1:2 & 1:4)", type: "Combinational",
      description: "Demultiplexer routing one input line to one of several output channels.",
      signals: ["In", "Sel", "Out0", "Out1"],
      defaults: { a: 1, sel: 0, out0: 1, out1: 0 },
      explanation: "Demultiplexers route a single input to one of multiple outputs based on selector pins.",
      rtl: `module demux12 (\n    input  wire in, sel,\n    output wire out0, out1\n);\n    assign out0 = (!sel) ? in : 1'b0;\n    assign out1 = (sel)  ? in : 1'b0;\nendmodule`,
      tb: `module demux_tb;\n    reg in, sel; wire out0, out1;\n    demux12 uut(in, sel, out0, out1);\n    initial begin\n        in=1; sel=0; #10 sel=1;\n    end\nendmodule`,
      quiz: [
        { q: "What is the reverse circuit of a DEMUX?", opts: ["MUX", "Decoder", "Encoder", "Counter"], ans: 0 },
        { q: "What state do inactive outputs take in active-high DEMUX?", opts: ["Logic 0", "Logic 1", "High-Z"], ans: 0 }
      ]
    },
    "encoder": {
      name: "Priority Encoders", type: "Combinational",
      description: "Converts active input lines into binary index codes with priority handling.",
      signals: ["In[7:0]", "Out[2:0]", "Active"],
      defaults: { val: 4 },
      explanation: "Encoders convert an active input line into a binary index representation.",
      rtl: `module priority_encoder_83 (\n    input  wire [7:0] in,\n    output reg  [2:0] out,\n    output wire       active\n);\n    assign active = |in;\n    always @(*) begin\n        if (in[7])      out = 3'd7;\n        else if (in[6]) out = 3'd6;\n        else            out = 3'd0;\n    end\nendmodule`,
      tb: `module encoder_tb;\n    reg [7:0] in; wire [2:0] out; wire active;\n    priority_encoder_83 uut(in, out, active);\n    initial begin\n        in=8'h08; #10 in=8'h40;\n    end\nendmodule`,
      quiz: [
        { q: "What is the output size of an 8-to-3 encoder?", opts: ["3 bits", "4 bits", "8 bits"], answer: 0 },
        { q: "How does a priority encoder handle multiple active inputs?", opts: ["Selects the highest index input", "Produces zero output", "Oscillates"], answer: 0 }
      ]
    },
    "flip-flops": {
      name: "Flip-Flops (D, JK, T, SR)", type: "Sequential",
      description: "Edge-triggered 1-bit memory elements (D-FF, JK-FF, T-FF, SR-FF).",
      signals: ["Clock", "D", "Reset_n", "Q"],
      defaults: { clk: 0, d: 1, rst_n: 1, q: 0, ff_type: "D-FF" },
      explanation: "Flip-flops store 1 bit of data on active clock transition edges.",
      rtl: `module dff (\n    input  wire clk, rst_n, d,\n    output reg  q\n);\n    always @(posedge clk or negedge rst_n) begin\n        if (!rst_n) q <= 1'b0;\n        else        q <= d;\n    end\nendmodule`,
      tb: `module dff_tb;\n    reg clk, rst_n, d; wire q;\n    dff uut(clk, rst_n, d, q);\n    always #5 clk = ~clk;\n    initial begin\n        clk=0; rst_n=0; d=1; #10 rst_n=1;\n    end\nendmodule`,
      quiz: [
        { q: "What triggers a D Flip-Flop update?", opts: ["Clock active edge", "Clock level", "Enable pin level"], ans: 0 },
        { q: "What is the output of a JK Flip-Flop when J=1, K=1?", opts: ["Hold state", "Set state", "Reset state", "Toggle state"], ans: 3 }
      ]
    },
    "registers": {
      name: "Shift Registers (SIPO/PISO)", type: "Sequential",
      description: "4-bit Serial-In Parallel-Out (SIPO) and Parallel-In Serial-Out (PISO) registers.",
      signals: ["Clock", "SI", "Reset_n", "Q[3:0]"],
      defaults: { clk: 0, si: 1, rst_n: 1, q: 0 },
      explanation: "Registers store and shift data vectors synchronously.",
      rtl: `module shift_reg (\n    input  wire clk, rst_n, si,\n    output reg  [3:0] q\n);\n    always @(posedge clk or negedge rst_n) begin\n        if (!rst_n) q <= 4'b0;\n        else        q <= {q[2:0], si};\n    end\nendmodule`,
      tb: `module shift_reg_tb;\n    reg clk, rst_n, si; wire [3:0] q;\n    shift_reg uut(clk, rst_n, si, q);\n    always #5 clk = ~clk;\n    initial begin\n        clk=0; rst_n=0; si=1; #10 rst_n=1; #10 si=0;\n    end\nendmodule`,
      quiz: [
        { q: "What type of register shifts bits sequentially and reads all outputs simultaneously?", opts: ["SISO", "SIPO", "PISO"], ans: 1 },
        { q: "How many clock cycles are needed to load 4 bits in a SIPO register?", opts: ["1", "2", "4", "8"], ans: 2 }
      ]
    },
    "counters": {
      name: "Counters (Up/Down & Ring)", type: "Sequential",
      description: "4-bit Synchronous Up/Down Counter, Ring Counter, and Johnson Counter.",
      signals: ["Clock", "Reset", "Enable", "Count[3:0]"],
      defaults: { clk: 0, rst: 0, en: 1, count: 0 },
      explanation: "Counters cycle through state sequences on clock edges.",
      rtl: `module counter_4bit (\n    input  wire clk, rst, en,\n    output reg  [3:0] count\n);\n    always @(posedge clk) begin\n        if (rst)      count <= 4'b0;\n        else if (en)  count <= count + 1'b1;\n    end\nendmodule`,
      tb: `module counter_tb;\n    reg clk, rst, en; wire [3:0] count;\n    counter_4bit uut(clk, rst, en, count);\n    always #5 clk = ~clk;\n    initial begin\n        clk=0; rst=1; en=1; #10 rst=0;\n    end\nendmodule`,
      quiz: [
        { q: "What is the maximum count of a 4-bit binary counter?", opts: ["7", "8", "15", "16"], ans: 2 },
        { q: "How does a synchronous counter differ from a ripple counter?", opts: ["All FFs update simultaneously on common clock", "FFs cascade sequentially"], ans: 0 }
      ]
    },
    "alu": {
      name: "ALU (Arithmetic Logic Unit)", type: "Combinational",
      description: "ALU computing ADD, SUB, AND, OR, XOR, and Bitwise Shift operations.",
      signals: ["A[7:0]", "B[7:0]", "Op[1:0]", "Out[7:0]"],
      defaults: { a: 5, b: 3, op: 0 },
      explanation: "ALUs perform mathematical and logical calculations inside processor execution units.",
      rtl: `module alu_8bit (\n    input  wire [7:0] a, b,\n    input  wire [1:0] op,\n    output reg  [7:0] out\n);\n    always @(*) begin\n        case(op)\n            2'b00: out = a + b;\n            2'b01: out = a - b;\n            2 me2'b10: out = a & b;\n            2'b11: out = a ^ b;\n        endcase\n    end\nendmodule`,
      tb: `module alu_tb;\n    reg [7:0] a, b; reg [1:0] op; wire [7:0] out;\n    alu_8bit uut(a, b, op, out);\n    initial begin\n        a=5; b=3; op=0; #10 op=2;\n    end\nendmodule`,
      quiz: [
        { q: "Which unit inside a CPU performs arithmetic additions and logical comparisons?", opts: ["ALU", "Cache Controller", "DMA Engine"], ans: 0 },
        { q: "Does a pure combinational ALU require a clock input?", opts: ["Yes", "No"], ans: 1 }
      ]
    },
    "fifo": {
      name: "FIFO Data Buffer", type: "Sequential",
      description: "First-In First-Out memory queue buffer with Full and Empty flag status.",
      signals: ["Clock", "Wr_en", "Rd_en", "Data_in[7:0]", "Data_out[7:0]", "Full", "Empty"],
      defaults: { clk: 0, wr_en: 0, rd_en: 0, d_in: 0, d_out: 0 },
      explanation: "FIFOs buffer data vectors between mismatched processing speeds.",
      rtl: `module fifo_buffer (\n    input  wire clk, rst, wr, rd,\n    input  wire [7:0] din,\n    output wire [7:0] dout,\n    output wire       full, empty\n);\n    // Internal RAM and pointer registers\nendmodule`,
      tb: `initial begin\n    clk=0; rst=1; #10 rst=0;\n    #10 wr=1; din=8'hFF; #10 wr=0; \nend`,
      quiz: [
        { q: "What order is data read out of a FIFO queue?", opts: ["First In First Out", "Last In First Out"], ans: 0 },
        { q: "What happens if a write occurs when Full flag is high?", opts: ["Overwrites or drops transaction", "Speeds up clock"], ans: 0 }
      ]
    }
  },

  protocols: {
    "apb": {
      name: "APB (Advanced Peripheral Bus)", type: "AMBA Peripheral Bus",
      overview: "Optimized for minimal power and reduced design complexity. Connects low-bandwidth peripherals like Timers, UARTs, GPIOs, and System Control Registers.",
      signals: [
        { name: "PCLK", dir: "System", desc: "APB Clock. All transfers are synchronized to rising edge of PCLK." },
        { name: "PRESETn", dir: "System", desc: "Active-low System Reset signal." },
        { name: "PADDR[31:0]", dir: "Master -> Slave", desc: "APB Byte Address Bus." },
        { name: "PSELx", dir: "Master -> Slave", desc: "Select line asserted for target peripheral slave." },
        { name: "PENABLE", dir: "Master -> Slave", desc: "Strobe signal indicating the Access phase of an APB transfer." },
        { name: "PWRITE", dir: "Master -> Slave", desc: "Transfer direction: 1 = Write access, 0 = Read access." },
        { name: "PWDATA[31:0]", dir: "Master -> Slave", desc: "Write Data Bus driven during write transfers." },
        { name: "PRDATA[31:0]", dir: "Slave -> Master", desc: "Read Data Bus driven by slave during read transfers." },
        { name: "PREADY", dir: "Slave -> Master", desc: "Wait state indicator. When low, extends the Access phase." },
        { name: "PSLVERR", dir: "Slave -> Master", desc: "Error signal indicating a failed or invalid APB access." }
      ],
      timing: "Setup Phase: PSEL goes high, PADDR & PWRITE driven. Access Phase: PENABLE goes high. Transfer completes when PREADY is high.",
      detailedDescription: "The Advanced Peripheral Bus (APB) is part of the ARM AMBA protocol family. It is un-pipelined, non-bursting, and optimized for low-power operation and ease of integration. APB connects control registers and low-speed peripherals (e.g. WDT, I2C, SPI, GPIO, RTC) to the main system bus via an APB Bridge.",
      handshakeArchitecture: "An APB transfer consists of two distinct phases: 1) SETUP Phase: Master asserts PSELx and drives PADDR/PWRITE/PWDATA. PENABLE remains low. 2) ACCESS Phase: On the next PCLK edge, master asserts PENABLE high. The slave samples write data or drives read data. If the slave requires extra processing cycles, it deasserts PREADY low to insert wait states. Transfer completes when PREADY is sampled high with PENABLE high.",
      burstAndFlowControl: "APB does not support multi-beat burst transfers or out-of-order execution. Every read/write transfer is individual and requires at least 2 clock cycles (2-cycle minimum latency). Flow control is governed exclusively by PREADY line stretching.",
      errorHandling: "APB4 includes PSLVERR to indicate transaction errors (such as reading an unmapped address, write protection violation, or parity error). PSLVERR is valid only when PSEL, PENABLE, and PREADY are all high.",
      useCases: "Ideal for memory-mapped register banks, configuration control blocks, interrupt status registers, and low-frequency peripheral controllers where minimal logic gate count and ultra-low power consumption are prioritized over throughput.",
      revision: "2-cycle latency per transfer. Unpipelined. Low power, low performance peripheral bus for SoC control registers."
    },
    "axi": {
      name: "AXI4 (Advanced eXtensible Interface)", type: "AMBA High-Speed System Bus",
      overview: "High-performance, high-frequency SoC interconnect featuring 5 independent transaction channels, out-of-order completion, and burst transfers.",
      signals: [
        { name: "ACLK / ARESETn", dir: "System", desc: "Global Clock and Active-Low Reset signals." },
        { name: "AWADDR / AWVALID / AWREADY", dir: "Write Addr Channel", desc: "Write Address, Valid, and Ready handshake lines." },
        { name: "WDATA / WSTRB / WVALID / WREADY", dir: "Write Data Channel", desc: "Write Data, Byte Strobe, Valid, and Ready handshake lines." },
        { name: "BRESP / BVALID / BREADY", dir: "Write Resp Channel", desc: "Write Response status (OKAY, EXOKAY, SLVERR, DECERR) & handshake." },
        { name: "ARADDR / ARVALID / ARREADY", dir: "Read Addr Channel", desc: "Read Address, Valid, and Ready handshake lines." },
        { name: "RDATA / RRESP / RVALID / RREADY", dir: "Read Data Channel", desc: "Read Data, Response status, Valid, and Ready handshake lines." }
      ],
      timing: "Handshake Rule: A transaction beat occurs only on clock edges where both VALID and READY are high simultaneously.",
      detailedDescription: "AMBA AXI4 is the industry-standard bus architecture for high-performance SoCs. It decouples address, data, and response phases into 5 independent channels (AW, W, B, AR, R), enabling full-duplex parallel reads and writes, out-of-order completions, and multi-beat bursts up to 256 beats.",
      handshakeArchitecture: "Every AXI4 channel operates via an independent VALID/READY two-way handshake. The source drives VALID high when payload is stable; the destination drives READY high when able to accept data. Handshake rule: VALID must remain asserted until READY is sampled high. Source MUST NOT wait for READY before asserting VALID to prevent inter-channel deadlocks.",
      burstAndFlowControl: "AXI4 supports 3 burst types: 1) FIXED (address remains static, used for FIFOs), 2) INCR (address increments sequentially by beat size), and 3) WRAP (address wraps around boundary, used for cache line fills). Outstanding transfers are identified by Transaction IDs (AWID, ARID), allowing fast slaves to respond ahead of slow slaves (out-of-order execution).",
      errorHandling: "Responses are conveyed via BRESP (for writes) and RRESP (for reads). Status codes: OKAY (Normal success), EXOKAY (Exclusive access success), SLVERR (Slave error, e.g. illegal memory range), DECERR (Decode error, no slave decoded).",
      useCases: "Main interconnect for multi-core CPUs, GPUs, DDR4/DDR5 Memory Controllers, High-Speed DMA engines, NPU accelerators, and PCIe root complexes.",
      revision: "5 independent channels. Supports out-of-order execution, burst transfers up to 256 beats, and parallel bi-directional transfers."
    },
    "ahb": {
      name: "AHB-Lite (Advanced High-performance Bus)", type: "AMBA System Bus",
      overview: "High-performance single-channel pipelined bus protocol supporting burst transfers and split data/address phases.",
      signals: [
        { name: "HCLK / HRESETn", dir: "System", desc: "System Clock and Active-Low Reset." },
        { name: "HSELx", dir: "Interconnect -> Slave", desc: "Slave Select signal." },
        { name: "HADDR[31:0]", dir: "Master -> Slave", desc: "32-bit System Address Bus." },
        { name: "HTRANS[1:0]", dir: "Master -> Slave", desc: "Transfer type: IDLE (00), BUSY (01), NONSEQ (10), SEQ (11)." },
        { name: "HWDATA / HRDATA", dir: "Master / Slave", desc: "Write Data Bus / Read Data Bus." },
        { name: "HREADYOUT / HREADY", dir: "Slave / Interconnect", desc: "Ready indicator extending data phases." },
        { name: "HRESP", dir: "Slave -> Master", desc: "Transfer response: 0 = OKAY, 1 = ERROR." }
      ],
      timing: "Pipelined operations: Address phase of transfer N coincides with Data phase of transfer N-1.",
      detailedDescription: "AMBA AHB-Lite is a high-performance, single-master/multi-slave pipelined bus interface designed for CPU core execution units, embedded SRAM memories, and high-bandwidth microcontrollers. It features overlapping address and data phases to achieve high throughput without channel complexity.",
      handshakeArchitecture: "AHB-Lite operates on a 2-stage pipeline: 1) Address Phase (1 cycle): Master drives HADDR, HWRITE, HSIZE, and HTRANS. 2) Data Phase (1 or more cycles): Master drives HWDATA or Slave drives HRDATA. The slave holds HREADYOUT low to insert wait states if it requires additional processing cycles.",
      burstAndFlowControl: "Supports fixed-length bursts (4, 8, 16 beats) and undefined-length bursts in Incrementing (INCR) or Wrapping (WRAP) modes. HTRANS indicates transfer sequence: NONSEQ initiates a burst, SEQ continues a burst, and BUSY inserts wait states mid-burst.",
      errorHandling: "HRESP indicates transfer success (OKAY = 0) or failure (ERROR = 1). An ERROR response requires 2 clock cycles, allowing the master time to cancel the pipelined address phase of the subsequent transfer.",
      useCases: "Embedded ARM Cortex-M processors, on-chip SRAM controllers, flash memory controllers, and internal SOC bridge backbones.",
      revision: "Pipelined address/data phases. Single-channel burst bus. High-speed processor bus for embedded systems."
    },
    "spi": {
      name: "SPI (Serial Peripheral Interface)", type: "Synchronous Serial Bus",
      overview: "Full-duplex, 4-wire synchronous serial interface for high-speed master-slave chip-to-chip communication.",
      signals: [
        { name: "SCLK", dir: "Master -> Slave", desc: "Serial Clock line generated by Master." },
        { name: "MOSI", dir: "Master -> Slave", desc: "Master-Out Slave-In serial data line." },
        { name: "MISO", dir: "Slave -> Master", desc: "Master-In Slave-Out serial data line." },
        { name: "CS_N / SS_N", dir: "Master -> Slave", desc: "Chip Select Active-Low line per slave." }
      ],
      timing: "Bits are shifted out on MOSI on one clock edge and sampled on MISO on the opposite clock edge based on CPOL/CPHA mode.",
      detailedDescription: "Serial Peripheral Interface (SPI) is a synchronous serial protocol widely used for short-distance communications between microcontrollers and peripheral devices. It supports full-duplex data streaming at high clock speeds without protocol overhead.",
      handshakeArchitecture: "Data transfer is controlled by Chip Select (CS_N). When CS_N is pulled low, SCLK begins toggling. On every SCLK edge, 1 bit is shifted out on MOSI/MISO and sampled on the opposite edge according to the configured SPI mode.",
      burstAndFlowControl: "Four SPI Modes defined by CPOL (Clock Polarity) and CPHA (Clock Phase): Mode 0 (CPOL=0, CPHA=0), Mode 1 (CPOL=0, CPHA=1), Mode 2 (CPOL=1, CPHA=0), Mode 3 (CPOL=1, CPHA=1). SPI does not have built-in hardware flow control; speed is determined by SCLK frequency.",
      errorHandling: "SPI lacks native parity or error response signals; error checking is typically implemented in software/higher-layer protocols using CRC checksum bytes.",
      useCases: "NOR Flash memory, SD cards, LCD display controllers, high-speed ADCs/DACs, and board-level sensor ICs.",
      revision: "4-wire full duplex. Master-driven SCLK. No slave addressing overhead. High speed serial link."
    },
    "i2c": {
      name: "I2C (Inter-Integrated Circuit)", type: "2-Wire Serial Bus",
      overview: "Multi-master, half-duplex 2-wire serial bus using open-drain SDA and SCL lines with pull-up resistors.",
      signals: [
        { name: "SDA", dir: "Bi-directional Open-Drain", desc: "Serial Data line for address, data, and ACK/NACK." },
        { name: "SCL", dir: "Bi-directional Open-Drain", desc: "Serial Clock line. Supports slave clock stretching." }
      ],
      timing: "START: SDA transitions High->Low while SCL is High. STOP: SDA transitions Low->High while SCL is High.",
      detailedDescription: "I2C is a 2-wire serial protocol developed by Philips (NXP) for connecting low-speed ICs on a board. Its open-drain architecture allows multiple master and slave devices to share the same physical bus wires using external pull-up resistors.",
      handshakeArchitecture: "Transfers begin with a START condition (SDA drops while SCL is high). The master transmits a 7-bit slave address + R/W bit. The matching slave asserts ACK (pulls SDA low) on the 9th SCL clock cycle. Data bytes follow with ACK/NACK on every 9th cycle. Transfer ends with a STOP condition.",
      burstAndFlowControl: "I2C supports Clock Stretching: a slave can pull SCL low to hold the master in a wait state until the slave is ready to process data. Multi-master arbitration is performed bitwise on SDA; if a master reads 0 while attempting to drive 1, it loses arbitration gracefully.",
      errorHandling: "NACK (SDA remains high on 9th clock) indicates invalid slave address, buffer full, or end of read data stream.",
      useCases: "Real-Time Clocks (RTC), temperature sensors, EEPROMs, power management ICs (PMIC), and system monitoring chips.",
      revision: "2-wire open-drain bus. 7-bit/10-bit slave addressing. Supports clock stretching and multi-master arbitration."
    },
    "uart": {
      name: "UART (Universal Asynchronous RX/TX)", type: "Asynchronous Serial Link",
      overview: "Point-to-point asynchronous serial interface using independent RX and TX lines with configurable baud rates.",
      signals: [
        { name: "TX", dir: "Output", desc: "Transmit serial data line." },
        { name: "RX", dir: "Input", desc: "Receive serial data line." }
      ],
      timing: "Asynchronous: Uses Start Bit (0), 5-8 Data Bits, optional Parity Bit, and 1-2 Stop Bits (1). Over-sampled at 16x baud rate.",
      detailedDescription: "UART is a fundamental asynchronous protocol for point-to-point serial communication between microcontrollers, PCs, and peripherals. Because no clock signal is transmitted, both ends must be pre-configured to identical baud rates (e.g. 9600, 115200 bps).",
      handshakeArchitecture: "When idle, the TX line remains High (1). Transmission begins when TX drops to Low (0) for 1 baud period (Start Bit). The data bits are shifted out LSB-first, followed by an optional Parity bit and 1 or 2 High Stop Bits. The receiver over-samples RX at 16x the baud rate to detect the center of each bit.",
      burstAndFlowControl: "Hardware flow control uses RTS (Request to Send) and CTS (Clear to Send) lines to prevent receiver buffer overflow. Software flow control uses XON/XOFF control characters.",
      errorHandling: "Detects Framing Errors (missing Stop Bit), Parity Errors (even/odd bit mismatch), and Overrun Errors (new byte received before previous byte read).",
      useCases: "Debug consoles, GPS modules, Bluetooth/Wi-Fi modem modules, and microcontroller serial communication links.",
      revision: "No clock wire. Asynchronous 16x over-sampling. Configurable baud rates, parity, and stop bits."
    },
    "pcie": {
      name: "PCI Express (PCIe Gen5/Gen6)", type: "High-Speed Packet Serial",
      overview: "Point-to-point high-speed packetized serial interconnect using differential signaling lanes and SerDes transceivers.",
      signals: [
        { name: "PETp / PETn", dir: "Tx Diff Pair", desc: "Transmit differential data pair per lane." },
        { name: "PERp / PERn", dir: "Rx Diff Pair", desc: "Receive differential data pair per lane." },
        { name: "REFCLKp / REFCLKn", dir: "System", desc: "100MHz Reference Clock differential pair." },
        { name: "PERST_N", dir: "System", desc: "Fundamental Reset Active-Low." }
      ],
      timing: "Packet-based. Embedded clock via SerDes 128b/130b or 1b/1b PAM4 encoding.",
      detailedDescription: "PCI Express (PCIe) is the dominant high-speed expansion bus standard in modern computing. It uses point-to-point serial links grouped into x1, x4, x8, or x16 lanes. PCIe Gen5 delivers 32 GT/s per lane, and Gen6 delivers 64 GT/s using PAM4 signaling.",
      handshakeArchitecture: "PCIe operates as a 3-layer stack: 1) Transaction Layer: Builds TLP packets (Memory Read/Write, I/O, Configuration, Messages). 2) Data Link Layer: Adds Sequence Numbers & LCRC32, manages ACK/NAK retransmissions. 3) Physical Layer: Handles 128b/130b encoding, scrambling, SerDes serialization, and PHY lane training (LTSSM).",
      burstAndFlowControl: "Flow Control is credit-based: Receiver advertises available buffer credits for Header (H) and Data (D) payload for Posted (P), Non-Posted (NP), and Completion (Cpl) packets. Transmitter only sends TLPs if it holds sufficient credits, preventing packet drops.",
      errorHandling: "Advanced Error Reporting (AER): End-to-end LCRC checks, TLP poison bits, and automatic DLLP ACK/NAK retry buffer retransmissions.",
      useCases: "High-performance GPUs, NVMe Solid-State Drives (SSDs), 100G/400G Network Interface Cards (NICs), AI/ML accelerators, and host CPU root complexes.",
      revision: "Point-to-point differential serial lanes (x1 to x16). Packetized TLP stack. Credit-based flow control."
    },
    "usb": {
      name: "USB (Universal Serial Bus)", type: "Differential Serial Interface",
      overview: "Hot-pluggable differential serial bus standard connecting computer hosts to peripherals via polled token packets.",
      signals: [
        { name: "D+", dir: "Differential Data Plus", desc: "Positive differential data line." },
        { name: "D-", dir: "Differential Data Minus", desc: "Negative differential data line." },
        { name: "VBUS", dir: "Power Rail", desc: "+5V Power supply line." },
        { name: "GND", dir: "Ground Rail", desc: "Ground reference line." }
      ],
      timing: "Uses NRZI (Non-Return-to-Zero Inverted) encoding with bit stuffing after 6 consecutive ones.",
      detailedDescription: "Universal Serial Bus (USB) is the universal interface for connecting peripherals to computers. It supports hot-plugging, automatic device discovery (enumeration), and tiered star topologies through USB hubs.",
      handshakeArchitecture: "Host-controlled token-based protocol. Transactions consist of 3 packets: 1) Token Packet (IN/OUT/SETUP from host), 2) Data Packet (DATA0/DATA1 payload), 3) Handshake Packet (ACK/NAK/STALL from receiver).",
      burstAndFlowControl: "Supports 4 transfer types: Control (device setup), Isochronous (real-time streaming audio/video with guaranteed bandwidth but no retries), Interrupt (polled low-latency mouse/keyboard data), and Bulk (large data transfers like Flash drives with error checking).",
      errorHandling: "Packets include CRC-5 (for token headers) and CRC-16 (for data payloads). Unacknowledged packets are automatically retried by the host controller.",
      useCases: "Keyboards, mice, USB flash drives, external hard drives, webcams, audio interfaces, and smartphone charging/data links.",
      revision: "Half-duplex differential pair. Host-polled transfers. Supports Control, Bulk, Interrupt, and Isochronous endpoints."
    },
    "can": {
      name: "CAN (Controller Area Network)", type: "Automotive Network Bus",
      overview: "Robust vehicle bus standard allowing microcontrollers to communicate without a central host computer using bitwise arbitration.",
      signals: [
        { name: "CANH", dir: "Differential High", desc: "Dominant/Recessive voltage rail high line." },
        { name: "CANL", dir: "Differential Low", desc: "Dominant/Recessive voltage rail low line." }
      ],
      timing: "CSMA/CD with non-destructive bitwise arbitration. Dominant state (0) overrides Recessive state (1).",
      detailedDescription: "Controller Area Network (CAN) is an automotive and industrial serial bus designed by Bosch. It allows electronic control units (ECUs) in vehicles to communicate reliably in harsh electromagnetic environments.",
      handshakeArchitecture: "CAN uses differential signaling (CANH/CANL). Bus states: Dominant (0, active differential voltage) and Recessive (1, passive pull-up). If one node drives Dominant (0), the bus becomes 0 regardless of how many nodes drive Recessive (1).",
      burstAndFlowControl: "Non-destructive Bitwise Arbitration: When multiple ECUs transmit simultaneously, each node reads back the bus state during the identifier field. If a node transmits Recessive (1) but senses Dominant (0), it knows a higher-priority message (lower ID number) is transmitting and backs off instantly without interrupting the winning message.",
      errorHandling: "Includes 15-bit CRC, Bit Stuffing rules (stuff bit inserted after 5 identical bits), Frame Check, and Error Passive/Bus-Off fault containment states to isolate failing nodes.",
      useCases: "Automotive ECU networks (Engine control, ABS braking, Airbag units), industrial robotics, avionics, and medical equipment.",
      revision: "Differential 2-wire bus. Dominant (0) / Recessive (1) states. Priority-based non-destructive arbitration."
    }
  },

  // --- 3. 15 PROJECTS ---
  projects: [
    { id: "proj-1", title: "Parametric ALU Core", difficulty: "Easy", description: "Design a parameterized 8/16/32-bit ALU supporting ADD, SUB, AND, OR, XOR, SHIFT, and comparison ops with registered outputs.", idea: "Use parameterized case statements and registered outputs to maximize clock frequency.", situation: "Standard CPU arithmetic execution units.", hint: "Write a case block mapping opcodes.", code: "module alu #(parameter W = 8) (input [W-1:0] a, b, input [2:0] op, output reg [W-1:0] y);" },
    { id: "proj-2", title: "CDC Asynchronous FIFO", difficulty: "Hard", description: "Implement a dual-clock asynchronous FIFO with Gray-code read/write pointer synchronization across independent clock domains.", idea: "Synchronize Gray-coded pointers using 2-stage D-FF synchronizers to prevent CDC metastability.", situation: "High-speed PCIe to memory bus bridge.", hint: "Convert binary count to Gray code before sync.", code: "module async_fifo (input wclk, rclk, wr_en, rd_en);" },
    { id: "proj-3", title: "UART Transceiver Block", difficulty: "Medium", description: "Design a complete UART controller with 16x baud oversampling receiver and serial frame transmitter.", idea: "Divide main system clock into baud ticks and sample serial bits at bit center.", situation: "Microcontroller diagnostic links.", hint: "Establish clock dividers matching target baud.", code: "module uart (input clk, rx, output tx);" },
    { id: "proj-4", title: "Traffic Light Controller FSM", difficulty: "Medium", description: "Design a 4-way traffic light controller FSM with minor street sensors, yellow/green timers, and pedestrian override.", idea: "Model state machine with RED, YELLOW, GREEN states and internal delay counters.", situation: "Traffic intersection automation.", hint: "Include default state to avoid latches.", code: "module traffic_light (input clk, rst, output r, y, g);" },
    { id: "proj-5", title: "SPI Master Controller", difficulty: "Medium", description: "Develop a synthesizable SPI Master supporting Modes 0, 1, 2, 3 with CS chip select management.", idea: "Use shift registers to serialize 8-bit byte data over MOSI while clocking SCLK.", situation: "Interfacing microcontrollers with EEPROMs & sensors.", hint: "Pull CS active-low before clocking SCLK.", code: "module spi_master (input clk, cs, output sck, mosi);" },
    { id: "proj-6", title: "I2C Slave Register Bank", difficulty: "Medium", description: "Design an I2C Slave peripheral with 7-bit address decoding, START/STOP detection, and open-drain SDA control.", idea: "Monitor SDA/SCL lines for START conditions and generate ACK on 9th clock.", situation: "On-chip sensor configuration registers.", hint: "Drive SDA to Z during master read phases.", code: "module i2c_slave (input scl, inout sda);" },
    { id: "proj-7", title: "RISC-V Single-Cycle Core", difficulty: "Hard", description: "Design a complete RV32I single-cycle processor datapath with ALU, register file, and memory interface.", idea: "Decode instructions into ALU opcodes and register write enables in a single clock cycle.", situation: "Embedded microcontrollers in IoT chips.", hint: "Map instruction opcode bits directly to control lines.", code: "module riscv_core (input clk, rst, output [31:0] pc);" },
    { id: "proj-8", title: "APB Slave Interface", difficulty: "Easy", description: "Design an AMBA APB3/APB4 slave register bank parsing PSEL, PENABLE, PWRITE, PADDR, and PWDATA.", idea: "Commit write data when PSEL and PENABLE are high and drive PREADY.", situation: "Peripheral control register blocks.", hint: "Assert PREADY high on Access phase.", code: "module p_slave (input pclk, psel, penable, output pready);" },
    { id: "proj-9", title: "DMA Controller Core", difficulty: "Hard", description: "Design a Direct Memory Access controller to transfer data blocks directly between memory addresses without CPU intervention.", idea: "Manage source and destination address counters and length registers.", situation: "High-speed Ethernet and video buffer copies.", hint: "Fire done interrupt when length counter reaches zero.", code: "module dma_controller (input clk, start, output done);" },
    { id: "proj-10", title: "L1 Cache Controller", difficulty: "Hard", description: "Design an L1 Cache Controller for a direct-mapped SRAM cache with tag lookup, hit/miss detection, and write-back buffers.", idea: "Compare requested address tag against SRAM tag array; stall CPU on miss.", situation: "CPU memory sub-system latency reduction.", hint: "Trigger main memory fetch on tag mismatch.", code: "module cache_ctrl (input clk, req, output hit);" },
    { id: "proj-11", title: "Elevator Motion Controller", difficulty: "Hard", description: "Design a multi-floor elevator FSM managing motor directions, door timers, and prioritized hall calls.", idea: "Track current floor vs call requests in priority state machine.", situation: "Building automation PLCs.", hint: "Prevent motor motion while door sensors are high.", code: "module elevator (input clk, [3:0] req, output motor);" },
    { id: "proj-12", title: "CRC-32 Generator Core", difficulty: "Medium", description: "Implement a parallel CRC-32 checksum generator for Ethernet frames using polynomial 0x04C11DB7.", idea: "Feed data bytes through XOR feedback network matching CRC-32 polynomial.", situation: "Ethernet packet engines and storage checkers.", hint: "Initialize CRC register to 0xFFFFFFFF.", code: "module crc32 (input clk, data_in, output [31:0] crc);" },
    { id: "proj-13", title: "Fixed-Point Q8.8 Multiplier", difficulty: "Medium", description: "Implement a signed 16-bit fixed-point multiplier (Q8.8) with overflow saturation guarding.", idea: "Multiply signed 16-bit operands and shift out lower fractional bits.", situation: "DSP FIR filters and audio scalers.", hint: "Clamp output on signed overflow.", code: "module fixed_mult (input [15:0] a, b, output [15:0] y);" },
    { id: "proj-14", title: "PWM Generator Core", difficulty: "Easy", description: "Design a Pulse Width Modulation generator with configurable duty cycle register and frequency pre-scaler.", idea: "Compare clock counter against duty cycle register value.", situation: "Motor speed control and LED dimming.", hint: "Drive PWM high when counter < duty.", code: "module pwm_gen (input clk, [7:0] duty, output pwm);" },
    { id: "proj-15", title: "Dual-Port SRAM Controller", difficulty: "Easy", description: "Design a dual-port RAM controller supporting simultaneous read/write accesses with collision locks.", idea: "Provide independent address and data buses for Port A and Port B.", situation: "Video frame buffers and cross-domain FIFOs.", hint: "Detect simultaneous write collisions at matching address.", code: "module dual_port_ram (input wclk, rclk, wr_en, output [7:0] dout);" },
    { id: "proj-16", title: "AXI4-Lite Master Bridge", difficulty: "Hard", description: "Implement an AXI4-Lite master interface generating valid AW, W, AR transactions with response decoding.", idea: "Drive AWVALID/WVALID in parallel and wait for BVALID response.", situation: "Bridge CPU core accesses to AXI bus.", hint: "Hold VALID high until target READY is sampled.", code: "module axi_master_bridge (input clk, output awvalid);" },
    { id: "proj-17", title: "Floating-Point Adder IEEE-754", difficulty: "Hard", description: "Design a single-precision 32-bit floating point adder conforming to IEEE-754 standard.", idea: "Align mantissas by shifting according to exponent difference, add, and normalize.", situation: "3D graphics pipelines and AI accelerators.", hint: "Handle special cases like NaN and infinity.", code: "module fp_add (input [31:0] a, b, output [31:0] sum);" },
    { id: "proj-18", title: "VGA Graphics Controller", difficulty: "Medium", description: "Design a 640x480 @ 60Hz VGA timing generator outputting HSYNC, VSYNC, and RGB color signals.", idea: "Generate precise pixel counter and line counter matching 25.175MHz pixel clock.", situation: "FPGA display interfaces.", hint: "Assert HSYNC and VSYNC during blanking intervals.", code: "module vga_driver (input clk_25mhz, output hsync, vsync);" },
    { id: "proj-19", title: "CAN Bus Protocol Controller", difficulty: "Hard", description: "Implement a CAN 2.0B frame parser with bit-stuffing, CSMA/CD bitwise arbitration, and CRC calculation.", idea: "Monitor CANH/CANL lines for dominant bits and back off if recessive state is overridden.", situation: "Automotive ECU networking.", hint: "Insert inverted stuff bit after 5 identical consecutive bits.", code: "module can_controller (input rx, output tx);" },
    { id: "proj-20", title: "100M Ethernet MAC Layer", difficulty: "Hard", description: "Design a 100Mbps Media Access Control (MAC) unit interfacing via MII/RMII with preamble generation and FCS CRC.", idea: "Prepend 7 bytes of 0x55 + 1 byte SFD (0xD5) before packet payload.", situation: "Network interface cards.", hint: "Append 4-byte CRC32 at frame end.", code: "module eth_mac (input tx_clk, output [3:0] txd);" },
    { id: "proj-21", title: "Priority Arbiter (Round-Robin)", difficulty: "Medium", description: "Design a 4-request Round-Robin bus arbiter ensuring starvation-free access grants.", idea: "Rotate priority pointer to the request immediately following the last granted client.", situation: "Multi-master memory bus arbitration.", hint: "Use masking logic for round-robin priority wrapping.", code: "module round_robin_arbiter (input clk, [3:0] req, output [3:0] gnt);" },
    { id: "proj-22", title: "I2S Audio Serializer", difficulty: "Medium", description: "Implement an I2S digital audio interface emitting SCK, WS (Word Select), and SD serial audio data.", idea: "Toggle WS on left/right audio frame boundaries and shift 16-bit audio bits MSB-first.", situation: "Digital audio CODEC interfaces.", hint: "Shift data on negedge of SCK.", code: "module i2s_transmitter (input sck, [15:0] left, right, output sd, ws);" },
    { id: "proj-23", title: "AES-128 Encryption Engine", difficulty: "Hard", description: "Implement a hardware AES-128 crypto core with SubBytes, ShiftRows, MixColumns, and AddRoundKey phases.", idea: "Pipeline 10 cipher rounds using lookup S-Boxes and Galois field multiplication.", situation: "Hardware security modules & disk encryption.", hint: "Expand 128-bit key into 11 round keys.", code: "module aes128_cipher (input clk, [128:0] key, text_in, output [128:0] cipher_out);" },
    { id: "proj-24", title: "Synchronous FIFO Array", difficulty: "Easy", description: "Design a single-clock 16-entry 8-bit FIFO using dual-port RAM and binary pointer logic.", idea: "Increment read and write pointers independently and derive full/empty flags from count.", situation: "Internal pipeline stage buffers.", hint: "Flag full when count == 16, empty when count == 0.", code: "module sync_fifo (input clk, rst, wr, rd, output full, empty);" },
    { id: "proj-25", title: "JTAG TAP Controller FSM", difficulty: "Hard", description: "Design an IEEE 1149.1 JTAG 16-state TAP controller (Test-Logic-Reset, Shift-DR, Shift-IR).", idea: "Transition through 16 TAP states based on TMS input pin sampled on rising TCK edge.", situation: "On-chip silicon debug & boundary scan.", hint: "Reset state is entered whenever TMS is high for 5 TCK cycles.", code: "module jtag_tap (input tck, tms, tdi, output tdo);" },
    { id: "proj-26", title: "Configurable Cordic Calculator", difficulty: "Hard", description: "Implement a CORDIC algorithm core calculating Sine and Cosine values iteratively using additions and shifts.", idea: "Perform vector rotations using fixed micro-rotation shift angles.", situation: "DSP radar processing & trigonometry accelerators.", hint: "Pre-calculate arctan lookup table values.", code: "module cordic (input clk, [15:0] angle, output [15:0] sin, cos);" },
    { id: "proj-27", title: "FIR Digital Filter Engine", difficulty: "Hard", description: "Design a 4-tap Finite Impulse Response (FIR) digital filter core with constant coefficients.", idea: "Multiply tapped delay line values with filter coefficients and accumulate sum.", situation: "Digital signal processing & noise filtering.", hint: "Register multiply-accumulate outputs.", code: "module fir_filter (input clk, [7:0] sample_in, output [15:0] filter_out);" },
    { id: "proj-28", title: "Matrix Multiplier Hardware Unit", difficulty: "Hard", description: "Design a 2x2 matrix multiplier unit performing parallel dot products.", idea: "Use 4 parallel multiply-accumulate units to compute matrix output terms.", situation: "Neural network systolic arrays.", hint: "Accumulate products over clock steps.", code: "module matrix_mult_2x2 (input clk, start, output done);" },
    { id: "proj-29", title: "SDRAM Initialization Engine", difficulty: "Hard", description: "Design an SDRAM controller state machine generating PRECHARGE, REFRESH, and ACTIVATE commands.", idea: "Issue periodic auto-refresh commands to preserve dynamic RAM capacitor charges.", situation: "Off-chip main memory access engines.", hint: "Enforce tRP and tRCD timing delays.", code: "module sdram_controller (input clk, output cke, cs_n, ras_n, cas_n, we_n);" },
    { id: "proj-30", title: "Binary-Coded Decimal (BCD) Adder", difficulty: "Easy", description: "Implement a 2-digit BCD adder that adjusts sums > 9 by adding 6 (4'b0110).", idea: "Detect when 4-bit nibble sum exceeds 9 or produces carry and add 6 for BCD correction.", situation: "Digital clocks and financial calculators.", hint: "Add 4'b0110 whenever sum > 9.", code: "module bcd_adder (input [3:0] a, b, output [3:0] sum, output carry);" },
    { id: "proj-31", title: "DisplayPort AUX Transceiver", difficulty: "Hard", description: "Design a DisplayPort AUX channel transceiver encoding Manchester-II biphase serial data.", idea: "Encode data bits using Manchester phase transitions at center of bit period.", situation: "Video display interface controllers.", hint: "Toggle signal at bit center for 0, hold for 1.", code: "module dp_aux_tx (input clk, data_in, output aux_p, aux_n);" },
    { id: "proj-32", title: "Gray Code Pointer Synchronizer", difficulty: "Medium", description: "Implement a parameterized N-bit Gray Code converter and 2-stage synchronizer for CDC.", idea: "Convert binary count to Gray code (G = B ^ (B >> 1)) before passing across clock boundary.", situation: "Asynchronous FIFO pointers.", hint: "Only 1 bit changes per increment in Gray code.", code: "module gray_sync #(parameter W = 4) (input clk, [W-1:0] in, output [W-1:0] out);" },
    { id: "proj-33", title: "Quadrature Encoder Decoder", difficulty: "Medium", description: "Design a quadrature decoder processing Channel A and Channel B signals to track motor position.", idea: "Decode 2-bit Gray transition states on A/B to increment or decrement position counter.", situation: "Robotics motor shaft position tracking.", hint: "Detect phase lead/lag between A and B.", code: "module quad_decoder (input clk, a, b, output reg [15:0] pos);" },
    { id: "proj-34", title: "Pseudo-Random LFSR Generator", difficulty: "Easy", description: "Design a 16-bit Galois Linear Feedback Shift Register generating uniform pseudo-random numbers.", idea: "Feed back XOR tap outputs into shift register sequence.", situation: "Built-In Self-Test (BIST) pattern generators.", hint: "Avoid all-zero seed state.", code: "module lfsr_16 (input clk, rst, output [15:0] rnd);" },
    { id: "proj-35", title: "Keyboard PS/2 Controller", difficulty: "Medium", description: "Design a PS/2 serial protocol receiver decoding 11-bit keyboard scan code packets.", idea: "Sample PS2_DATA on falling edges of PS2_CLK line.", situation: "Legacy PC peripheral interfaces.", hint: "Extract 8-bit key scan code from 11-bit frame.", code: "module ps2_keyboard (input ps2_clk, ps2_data, output [7:0] key_code);" },
    { id: "proj-36", title: "Watchdog Timer Core", difficulty: "Easy", description: "Implement a System Watchdog Timer that triggers a hardware reset if not refreshed within deadline.", idea: "Count down from reload value; assert system reset if count reaches 0.", situation: "High-reliability embedded safety chips.", hint: "Clear counter on kick/pet signal.", code: "module wdt (input clk, rst_n, kick, output reg wdt_reset);" },
    { id: "proj-37", title: "SPI Slave Flash Memory Model", difficulty: "Medium", description: "Design a behavioral/synthesizable SPI Slave simulating READ, WRITE, and WREN commands.", idea: "Decode SPI command opcode byte and access internal RAM array.", situation: "Verification behavioral models.", hint: "Shift out requested byte on MISO during READ.", code: "module spi_flash_slave (input sclk, cs_n, mosi, output miso);" },
    { id: "proj-38", title: "Packet Framer & De-Framer", difficulty: "Hard", description: "Implement a network packet framer inserting Start-of-Packet (SOP) and End-of-Packet (EOP) flags.", idea: "Frame raw byte streams with control delimiters and byte-stuffing.", situation: "Serial data communications links.", hint: "Escape control bytes in payload.", code: "module packet_framer (input clk, [7:0] din, input sop, eop, output [7:0] dout);" },
    { id: "proj-39", title: "4-Channel Priority Interrupt Core", difficulty: "Medium", description: "Design a programmable Interrupt Controller handling 4 interrupt lines with masking and priority decoding.", idea: "Latch active interrupts and output interrupt vector corresponding to highest unmasked line.", situation: "Embedded CPU interrupt controllers.", hint: "Maintain ISR and IER status registers.", code: "module pic_core (input clk, [3:0] irq, mask, output [1:0] irq_vec, output irq_out);" },
    { id: "proj-40", title: "Booth Multiplier Algorithm Core", difficulty: "Hard", description: "Implement a signed 8-bit Radix-2 Booth Multiplier reducing total addition operations.", idea: "Examine 2 bits of multiplier at a time to determine add, subtract, or shift operations.", situation: "High-performance DSP arithmetic units.", hint: "Recode multiplier bits into +1, -1, 0 values.", code: "module booth_mult (input [7:0] m, r, output [15:0] prod);" },
    { id: "proj-41", title: "Integrated Clock Gating (ICG) Controller", difficulty: "Easy", description: "Design a glitch-free Integrated Clock Gating cell using a negative-edge latch and AND gate.", idea: "Latch clock enable on falling clock edge to ensure output clock toggles cleanly.", situation: "Low-power ASIC power management.", hint: "Prevent clock truncation glitches.", code: "module icg_cell (input clk, en, output gclk);" },
    { id: "proj-42", title: "Synchronous DRAM Refresh Controller", difficulty: "Medium", description: "Design an automated DRAM refresh controller firing refresh commands every 15.6 microseconds.", idea: "Maintain a timer counter that issues high-priority auto-refresh bus requests.", situation: "DDR memory interfaces.", hint: "Stall user read/write accesses during refresh.", code: "module dram_refresher (input clk, output reg ref_req);" },
    { id: "proj-43", title: "USB 2.0 NRZI Encoder/Decoder", difficulty: "Hard", description: "Implement a USB 2.0 NRZI encoder with automatic bit-stuffing after 6 consecutive ones.", idea: "Toggle signal for 0, maintain signal for 1, and stuff 0 bit after 6 ones.", situation: "USB physical layer transceivers.", hint: "Insert 0 bit after 6 consecutive 1s.", code: "module usb_nrzi_encoder (input clk, din, output reg dout);" },
    { id: "proj-44", title: "Parametric Barrel Shifter", difficulty: "Medium", description: "Design a 32-bit combinational Barrel Shifter supporting Logical Left, Logical Right, and Arithmetic Right shifts.", idea: "Use multi-stage MUX trees to shift data by 0 to 31 bit positions in 1 cycle.", situation: "CPU execution ALU shift blocks.", hint: "Sign-extend MSB during arithmetic right shifts.", code: "module barrel_shifter (input [31:0] in, input [4:0] shift_amt, input [1:0] mode, output [31:0] out);" },
    { id: "proj-45", title: "Hamming Code (7,4) Error Corrector", difficulty: "Medium", description: "Implement a Hamming (7,4) encoder and decoder capable of detecting and correcting single-bit errors.", idea: "Generate 3 parity bits for 4 data bits; compute syndrome to pinpoint and flip error bit.", situation: "ECC SRAM memory reliability.", hint: "Syndrome value indicates exact position of corrupted bit.", code: "module hamming_74 (input [3:0] data_in, output [6:0] code_out);" },
    { id: "proj-46", title: "SD Host Controller Interface", difficulty: "Hard", description: "Design an SD Card SPI-mode host controller reading and writing 512-byte block sectors.", idea: "Issue CMD0 (RESET), CMD8, and CMD17 (READ_SINGLE_BLOCK) over SPI interface.", situation: "Embedded storage controllers.", hint: "Wait for 0x00 response from SD card.", code: "module sd_controller (input clk, start, output done);" },
    { id: "proj-47", title: "Pulse Edge Synchronizer Block", difficulty: "Easy", description: "Design a single-bit pulse synchronizer transferring a 1-clock pulse safely across asynchronous domains.", idea: "Toggle a flip-flop in source domain, synchronize toggle signal, and detect edge in destination domain.", situation: "Clock Domain Crossing (CDC) pulse transfers.", hint: "Use toggle-based pulse conversion.", code: "module pulse_sync (input src_clk, dst_clk, src_pulse, output dst_pulse);" },
    { id: "proj-48", title: "8-Bit Serial Multiplier", difficulty: "Medium", description: "Design an 8-bit sequential multiplier using a shift-and-add algorithm over 8 clock cycles.", idea: "Add multiplicand to running sum whenever current multiplier bit is 1.", situation: "Low-area FPGA math blocks.", hint: "Shift multiplier right and multiplicand left on each step.", code: "module serial_mult (input clk, start, [7:0] a, b, output [15:0] prod, output done);" },
    { id: "proj-49", title: "PCIe TLP Packet Generator", difficulty: "Hard", description: "Implement a PCIe TLP generator crafting Memory Read and Memory Write packet headers.", idea: "Format 3-DW / 4-DW headers with Fmt/Type, Length, Requester ID, and Tag fields.", situation: "PCIe verification IP & root complex logic.", hint: "Align packet DWORDs.", code: "module pcie_tlp_gen (input clk, start, output [31:0] tlp_dw);" },
    { id: "proj-50", title: "MIPI D-PHY Receiver State Machine", difficulty: "Hard", description: "Design a MIPI D-PHY state machine decoding Low Power (LP) to High Speed (HS) transitions.", idea: "Detect LP-11 -> LP-01 -> LP-00 sequence to switch receiver from low-power to high-speed mode.", situation: "Mobile camera (CSI-2) and display (DSI) interfaces.", hint: "Assert HS_ENABLE when LP sequence completes.", code: "module mipi_dphy_rx (input clk, lp_p, lp_n, output hs_enable);" }
  ],

  challenges: [],
  interviews: { flashcards: [], mcqs: [], quizzes: [] }
};

// --- Programmatic Generator for 200 UNIQUE Main Practice Problems ---
const challengesTopics = ["Verilog Basics", "Combinational Logic", "Sequential Logic", "FSM Design", "Timing Analysis", "Protocol Design", "SystemVerilog", "Debugging"];

const mainProblemSeeds = [
  // --- 1. Verilog Basics (25 Problems) ---
  { title: "Simple Wire", topic: "Verilog Basics", difficulty: "Easy", desc: "Implement a continuous wire assignment routing input pin to output pin.", code: "assign out = in;" },
  { title: "Four Wires", topic: "Verilog Basics", difficulty: "Easy", desc: "Wire 3 inputs (a, b, c) into 4 outputs (w, x, y, z).", code: "assign w = a; assign x = b; assign y = b; assign z = c;" },
  { title: "Inverter Gate", topic: "Verilog Basics", difficulty: "Easy", desc: "Implement a 1-bit logic NOT gate inverter.", code: "assign out = ~in;" },
  { title: "AND Gate", topic: "Verilog Basics", difficulty: "Easy", desc: "Implement a 2-input AND gate.", code: "assign out = a & b;" },
  { title: "NOR Gate", topic: "Verilog Basics", difficulty: "Easy", desc: "Implement a 2-input NOR gate.", code: "assign out = ~(a | b);" },
  { title: "XOR Gate", topic: "Verilog Basics", difficulty: "Easy", desc: "Implement a 2-input bitwise XOR gate.", code: "assign out = a ^ b;" },
  { title: "Vector Bit Selection", topic: "Verilog Basics", difficulty: "Easy", desc: "Extract bits [7:4] and [3:0] from a 8-bit input vector.", code: "assign high_nibble = in[7:4]; assign low_nibble = in[3:0];" },
  { title: "Vector Reversal", topic: "Verilog Basics", difficulty: "Easy", desc: "Reverse the bit order of an 8-bit input vector.", code: "assign out = {in[0], in[1], in[2], in[3], in[4], in[5], in[6], in[7]};" },
  { title: "Bitwise vs Logical Operators", topic: "Verilog Basics", difficulty: "Easy", desc: "Evaluate bitwise AND vs logical AND for two 4-bit vectors.", code: "assign out_bit = a & b; assign out_log = a && b;" },
  { title: "Reduction Operators", topic: "Verilog Basics", difficulty: "Easy", desc: "Compute reduction parity (XOR sum) of an 8-bit input vector.", code: "assign parity = ^in;" },
  { title: "Concatenation Operator", topic: "Verilog Basics", difficulty: "Easy", desc: "Combine four 2-bit inputs into one 8-bit output bus.", code: "assign out = {a, b, c, d};" },
  { title: "Replication Operator", topic: "Verilog Basics", difficulty: "Easy", desc: "Sign-extend a 4-bit signed input to an 8-bit output vector.", code: "assign out = {{4{in[3]}}, in};" },
  { title: "Tri-State Buffer", topic: "Verilog Basics", difficulty: "Easy", desc: "Implement a tri-state buffer with active-high enable pin.", code: "assign out = enable ? in : 1'bz;" },
  { title: "Conditional Operator Mux", topic: "Verilog Basics", difficulty: "Easy", desc: "Implement a 2-to-1 multiplexer using ternary operator.", code: "assign out = sel ? b : a;" },
  { title: "Scalar to Vector Expansion", topic: "Verilog Basics", difficulty: "Easy", desc: "Broadcast a 1-bit control line across an 8-bit output bus.", code: "assign out = {8{ctrl}};" },
  { title: "Byte Swapper", topic: "Verilog Basics", difficulty: "Medium", desc: "Swap upper and lower bytes of a 16-bit word input.", code: "assign out = {in[7:0], in[15:8]};" },
  { title: "Gray Code Converter", topic: "Verilog Basics", difficulty: "Medium", desc: "Convert a 4-bit binary input to 4-bit Gray code.", code: "assign out = in ^ (in >> 1);" },
  { title: "Gray to Binary Converter", topic: "Verilog Basics", difficulty: "Medium", desc: "Convert a 4-bit Gray code input back to 4-bit binary.", code: "assign out[3] = in[3]; assign out[2] = in[3]^in[2]; assign out[1] = in[3]^in[2]^in[1]; assign out[0] = in[3]^in[2]^in[1]^in[0];" },
  { title: "Bit Shift Left Operator", topic: "Verilog Basics", difficulty: "Easy", desc: "Shift an 8-bit vector left by 2 positions with zero fill.", code: "assign out = in << 2;" },
  { title: "Arithmetic Shift Right", topic: "Verilog Basics", difficulty: "Medium", desc: "Perform signed arithmetic right shift on an 8-bit vector.", code: "assign out = $signed(in) >>> 2;" },
  { title: "Masked Bit Inserter", topic: "Verilog Basics", difficulty: "Medium", desc: "Insert a 4-bit field into an 8-bit bus using a 4-bit mask.", code: "assign out = (bus & ~mask) | (data & mask);" },
  { title: "Even Parity Generator", topic: "Verilog Basics", difficulty: "Easy", desc: "Generate an even parity bit for a 7-bit ASCII character.", code: "assign parity = ~^in;" },
  { title: "Odd Parity Generator", topic: "Verilog Basics", difficulty: "Easy", desc: "Generate an odd parity bit for an 8-bit data payload.", code: "assign parity = ^in;" },
  { title: "Bitwise XNOR Equality Check", topic: "Verilog Basics", difficulty: "Easy", desc: "Compare two 4-bit vectors bit-by-bit for equality.", code: "assign equal = &(a ~^ b);" },
  { title: "Bus Endianness Swapper", topic: "Verilog Basics", difficulty: "Medium", desc: "Reverse byte order of a 32-bit big-endian word to little-endian.", code: "assign out = {in[7:0], in[15:8], in[23:16], in[31:24]};" },

  // --- 2. Combinational Logic (25 Problems) ---
  { title: "4-to-1 Multiplexer", topic: "Combinational Logic", difficulty: "Easy", desc: "Implement a 4-to-1 MUX using case statement inside always_comb.", code: "always @(*) begin case(sel) 2'b00: out=a; 2'b01: out=b; 2'b10: out=c; default: out=d; endcase end" },
  { title: "3-to-8 Decoder", topic: "Combinational Logic", difficulty: "Easy", desc: "Implement a 3-to-8 line active-high binary decoder.", code: "always @(*) begin out = 8'b0; out[in] = 1'b1; end" },
  { title: "8-to-3 Encoder", topic: "Combinational Logic", difficulty: "Medium", desc: "Implement an 8-to-3 line standard binary encoder.", code: "always @(*) begin case(in) 8'h01: out=3'd0; 8'h02: out=3'd1; 8'h04: out=3'd2; 8'h08: out=3'd3; default: out=3'd0; endcase end" },
  { title: "4-bit Priority Encoder", topic: "Combinational Logic", difficulty: "Medium", desc: "Design a 4-bit priority encoder prioritizing higher-bit index.", code: "always @(*) begin if(in[3]) out=2'd3; else if(in[2]) out=2'd2; else if(in[1]) out=2'd1; else out=2'd0; end" },
  { title: "Half Adder", topic: "Combinational Logic", difficulty: "Easy", desc: "Implement a 1-bit half adder computing sum and carry-out.", code: "assign sum = a ^ b; assign cout = a & b;" },
  { title: "Full Adder", topic: "Combinational Logic", difficulty: "Easy", desc: "Implement a 1-bit full adder with inputs a, b, cin.", code: "assign sum = a ^ b ^ cin; assign cout = (a & b) | (cin & (a ^ b));" },
  { title: "4-bit Ripple Carry Adder", topic: "Combinational Logic", difficulty: "Medium", desc: "Cascade 4 full adders to form a 4-bit ripple carry adder.", code: "assign {cout, sum} = a + b + cin;" },
  { title: "4-bit Carry Lookahead Adder", topic: "Combinational Logic", difficulty: "Hard", desc: "Design a 4-bit Lookahead Adder generating fast carry bits.", code: "assign p = a ^ b; assign g = a & b; assign c[1] = g[0] | (p[0] & cin);" },
  { title: "4-bit Subtractor", topic: "Combinational Logic", difficulty: "Medium", desc: "Implement a 4-bit binary subtractor using 2's complement adder.", code: "assign {borrow, diff} = a - b;" },
  { title: "2-bit Magnitude Comparator", topic: "Combinational Logic", difficulty: "Easy", desc: "Compare 2-bit inputs A and B for Greater, Equal, and Less states.", code: "assign A_gt_B = (a > b); assign A_eq_B = (a == b); assign A_lt_B = (a < b);" },
  { title: "7-Segment Display Decoder", topic: "Combinational Logic", difficulty: "Medium", desc: "Map 4-bit BCD input to 7-segment cathode signals (a-g).", code: "always @(*) begin case(bcd) 4'd0: seg=7'b1111110; 4'd1: seg=7'b0110000; default: seg=7'b0; endcase end" },
  { title: "4-bit Barrel Shifter", topic: "Combinational Logic", difficulty: "Medium", desc: "Design a 4-bit barrel shifter supporting left shift by 0-3 bits.", code: "assign out = in << shift_amt;" },
  { title: "BCD to Excess-3 Converter", topic: "Combinational Logic", difficulty: "Easy", desc: "Convert a 4-bit BCD digit to Excess-3 code by adding 3.", code: "assign out = bcd + 4'd3;" },
  { title: "Excess-3 to BCD Converter", topic: "Combinational Logic", difficulty: "Easy", desc: "Convert a 4-bit Excess-3 digit back to standard BCD.", code: "assign bcd = excess3 - 4'd3;" },
  { title: "Parity Checker Circuit", topic: "Combinational Logic", difficulty: "Easy", desc: "Check parity of 9-bit data stream (8 data bits + 1 parity bit).", code: "assign error = ^data_in;" },
  { title: "4-bit Arithmetic Logic Unit (ALU)", topic: "Combinational Logic", difficulty: "Hard", desc: "Design a 4-bit ALU supporting ADD, SUB, AND, OR, XOR, NOT operations.", code: "always @(*) begin case(op) 3'd0: out=a+b; 3'd1: out=a-b; 3'd2: out=a&b; 3'd3: out=a|b; default: out=4'b0; endcase end" },
  { title: "9-bit Population Counter", topic: "Combinational Logic", difficulty: "Medium", desc: "Count total number of set bits (1s) in a 9-bit input.", code: "integer i; always @(*) begin out=0; for(i=0;i<9;i=i+1) out=out+in[i]; end" },
  { title: "1-of-4 De-Multiplexer", topic: "Combinational Logic", difficulty: "Easy", desc: "Route a 1-bit input signal to 1 of 4 outputs based on select bus.", code: "always @(*) begin out=4'b0; out[sel]=in; end" },
  { title: "Majority Voter Logic", topic: "Combinational Logic", difficulty: "Easy", desc: "Implement a 3-input majority voter gate (outputs 1 if >=2 inputs high).", code: "assign out = (a & b) | (b & c) | (a & c);" },
  { title: "Leading Zero Counter", topic: "Combinational Logic", difficulty: "Hard", desc: "Count the number of leading zeros in an 8-bit vector.", code: "always @(*) begin if(in[7]) out=0; else if(in[6]) out=1; else if(in[5]) out=2; else out=8; end" },
  { title: "4-bit Array Multiplier", topic: "Combinational Logic", difficulty: "Hard", desc: "Implement an unsigned 4-bit by 4-bit combinational array multiplier.", code: "assign product = a * b;" },
  { title: "Hamming Weight Estimator", topic: "Combinational Logic", difficulty: "Medium", desc: "Compute Hamming distance between two 8-bit input buses.", code: "integer i; always @(*) begin out=0; for(i=0;i<8;i=i+1) if(a[i]!=b[i]) out=out+1; end" },
  { title: "Programmable Bit Mask Generator", topic: "Combinational Logic", difficulty: "Medium", desc: "Generate an 8-bit bitmask with N lower bits set to 1.", code: "assign mask = (1 << n) - 1;" },
  { title: "Biquad Coeff Selector Mux", topic: "Combinational Logic", difficulty: "Medium", desc: "Select 1 of 4 16-bit filter coefficients based on mode inputs.", code: "always @(*) begin case(mode) 2'd0: coeff=16'h00A0; default: coeff=16'h0; endcase end" },
  { title: "Minimum Value Finder", topic: "Combinational Logic", difficulty: "Easy", desc: "Return the minimum value among three 8-bit unsigned inputs.", code: "assign min_val = (a < b) ? ((a < c) ? a : c) : ((b < c) ? b : c);" },

  // --- 3. Sequential Logic (25 Problems) ---
  { title: "D Flip-Flop with Sync Reset", topic: "Sequential Logic", difficulty: "Easy", desc: "Implement a D Flip-Flop with active-high synchronous reset.", code: "always @(posedge clk) begin if(rst) q <= 0; else q <= d; end" },
  { title: "D Flip-Flop with Async Reset", topic: "Sequential Logic", difficulty: "Easy", desc: "Implement a D Flip-Flop with active-low asynchronous reset.", code: "always @(posedge clk or negedge rst_n) begin if(!rst_n) q <= 0; else q <= d; end" },
  { title: "T Flip-Flop", topic: "Sequential Logic", difficulty: "Easy", desc: "Design a T (Toggle) Flip-Flop that toggles state when T=1.", code: "always @(posedge clk) begin if(rst) q <= 0; else if(t) q <= ~q; end" },
  { title: "JK Flip-Flop", topic: "Sequential Logic", difficulty: "Medium", desc: "Implement a clocked JK Flip-Flop supporting Hold, Set, Reset, Toggle.", code: "always @(posedge clk) begin case({j,k}) 2'b01: q<=0; 2'b10: q<=1; 2'b11: q<=~q; endcase end" },
  { title: "SR Latch with Enable", topic: "Sequential Logic", difficulty: "Easy", desc: "Implement a level-sensitive Set-Reset latch with enable line.", code: "always @(*) begin if(en) begin if(r) q=0; else if(s) q=1; end end" },
  { title: "4-bit Serial-In Parallel-Out (SIPO)", topic: "Sequential Logic", difficulty: "Medium", desc: "Shift serial bits into a 4-bit parallel output register.", code: "always @(posedge clk) q <= {q[2:0], sin};" },
  { title: "4-bit Parallel-In Serial-Out (PISO)", topic: "Sequential Logic", difficulty: "Medium", desc: "Load parallel data and shift out 1 bit per clock cycle.", code: "always @(posedge clk) begin if(load) q <= data_in; else q <= {1'b0, q[3:1]}; end" },
  { title: "4-bit Ring Counter", topic: "Sequential Logic", difficulty: "Medium", desc: "Implement a 4-bit circulating ring counter (1000 -> 0100 -> 0010 -> 0001).", code: "always @(posedge clk) begin if(rst) q <= 4'b1000; else q <= {q[0], q[3:1]}; end" },
  { title: "4-bit Johnson Counter", topic: "Sequential Logic", difficulty: "Medium", desc: "Implement a 4-bit inverted feedback Johnson counter.", code: "always @(posedge clk) begin if(rst) q <= 0; else q <= {~q[0], q[3:1]}; end" },
  { title: "4-bit Modulo-10 Counter", topic: "Sequential Logic", difficulty: "Medium", desc: "Design a decade counter counting 0 to 9 with active-low async reset.", code: "always @(posedge clk or negedge rst_n) begin if(!rst_n) q <= 0; else if(q==9) q <= 0; else q <= q+1; end" },
  { title: "4-bit Up/Down Counter", topic: "Sequential Logic", difficulty: "Medium", desc: "Synchronous 4-bit counter that increments when up=1 and decrements when up=0.", code: "always @(posedge clk) begin if(rst) q <= 0; else if(up) q <= q+1; else q <= q-1; end" },
  { title: "Saturating Counter", topic: "Sequential Logic", difficulty: "Medium", desc: "4-bit counter that caps at 15 and stops incrementing.", code: "always @(posedge clk) begin if(rst) q <= 0; else if(en && q<15) q <= q+1; end" },
  { title: "Linear Feedback Shift Register (LFSR)", topic: "Sequential Logic", difficulty: "Hard", desc: "4-bit Galois LFSR generating pseudo-random sequences.", code: "always @(posedge clk) begin if(rst) q <= 4'b0001; else q <= {q[2:0], q[3] ^ q[2]}; end" },
  { title: "Clock Enable Register", topic: "Sequential Logic", difficulty: "Easy", desc: "D register updated only when clock enable (clk_en) signal is high.", code: "always @(posedge clk) begin if(clk_en) q <= d; end" },
  { title: "Pulse Generator Edge Detector", topic: "Sequential Logic", difficulty: "Medium", desc: "Detect rising edges on input signal and output a 1-clock pulse.", code: "always @(posedge clk) begin in_d <= in; pulse <= in && !in_d; end" },
  { title: "Falling Edge Pulse Detector", topic: "Sequential Logic", difficulty: "Medium", desc: "Detect falling edges on input signal and output a 1-clock pulse.", code: "always @(posedge clk) begin in_d <= in; pulse <= !in && in_d; end" },
  { title: "Dual-Edge Pulse Generator", topic: "Sequential Logic", difficulty: "Medium", desc: "Generate a 1-clock pulse on both rising and falling edges.", code: "always @(posedge clk) begin in_d <= in; pulse <= in ^ in_d; end" },
  { title: "Register File 4x8-bit", topic: "Sequential Logic", difficulty: "Hard", desc: "Design a 4-entry 8-bit register file with 1 write and 2 read ports.", code: "always @(posedge clk) begin if(wr_en) rf[wr_addr] <= wr_data; end" },
  { title: "Programmable Timer Counter", topic: "Sequential Logic", difficulty: "Medium", desc: "Timer that counts down from target reload value and fires interrupt.", code: "always @(posedge clk) begin if(load) cnt <= reload; else if(cnt>0) cnt <= cnt-1; end" },
  { title: "Clock Frequency Divider by 2", topic: "Sequential Logic", difficulty: "Easy", desc: "Divide input clock frequency by 2 using a T flip-flop.", code: "always @(posedge clk) clk_out <= ~clk_out;" },
  { title: "Clock Frequency Divider by 4", topic: "Sequential Logic", difficulty: "Easy", desc: "Divide input clock frequency by 4 using a 2-bit counter.", code: "always @(posedge clk) cnt <= cnt + 1; assign clk_out = cnt[1];" },
  { title: "Glitch Filter Circuit", topic: "Sequential Logic", difficulty: "Hard", desc: "Filter noisy input line; require input to stay stable for 3 clock cycles.", code: "always @(posedge clk) begin shift <= {shift[1:0], in}; if(shift==3'b111) out <= 1; else if(shift==3'b000) out <= 0; end" },
  { title: "8-bit Accumulator Register", topic: "Sequential Logic", difficulty: "Medium", desc: "Accumulate input values into an 8-bit sum register on enable.", code: "always @(posedge clk) begin if(rst) sum <= 0; else if(en) sum <= sum + in; end" },
  { title: "Serial Bit Pattern Matcher", topic: "Sequential Logic", difficulty: "Hard", desc: "Shift incoming serial bits and assert flag when pattern 4'b1011 matches.", code: "always @(posedge clk) begin sr <= {sr[2:0], sin}; match <= (sr == 4'b1011); end" },
  { title: "Ping-Pong Buffer Register", topic: "Sequential Logic", difficulty: "Hard", desc: "Alternate writes between Buffer A and Buffer B on frame boundaries.", code: "always @(posedge clk) begin if(swap) bank <= ~bank; end" },

  // --- 4. FSM Design (25 Problems) ---
  { title: "Mealy Sequence Detector 1101", topic: "FSM Design", difficulty: "Medium", desc: "Detect sequence 1101 using a Mealy state machine.", code: "always @(posedge clk) begin case(state) S0: next = in ? S1 : S0; default: next = S0; endcase end" },
  { title: "Moore Sequence Detector 101", topic: "FSM Design", difficulty: "Medium", desc: "Detect sequence 101 using a 4-state Moore state machine.", code: "always @(posedge clk) begin case(state) S0: next = in ? S1 : S0; default: next = S0; endcase end" },
  { title: "Non-Overlapping Sequence Detector 11", topic: "FSM Design", difficulty: "Easy", desc: "Detect 2 consecutive 1s without overlapping sequence matches.", code: "always @(posedge clk) begin case(state) S0: next = in ? S1 : S0; S1: next = in ? S2 : S0; S2: next = S0; endcase end" },
  { title: "Traffic Light Controller FSM", topic: "FSM Design", difficulty: "Medium", desc: "FSM cycling through RED (5s), GREEN (5s), and YELLOW (2s) states.", code: "always @(posedge clk) begin case(state) RED: if(timer==5) state <= GREEN; default: state <= RED; endcase end" },
  { title: "Vending Machine FSM", topic: "FSM Design", difficulty: "Medium", desc: "Dispense item when total inserted coins (5c, 10c) equal or exceed 15c.", code: "always @(posedge clk) begin case(total) 4'd15: dispense <= 1; default: dispense <= 0; endcase end" },
  { title: "Elevator Motion FSM", topic: "FSM Design", difficulty: "Hard", desc: "Control 3-floor elevator states: IDLE, MOVING_UP, MOVING_DOWN, DOOR_OPEN.", code: "always @(posedge clk) begin case(state) IDLE: if(req > curr) state <= MOVING_UP; default: state <= IDLE; endcase end" },
  { title: "UART Transmitter FSM", topic: "FSM Design", difficulty: "Hard", desc: "FSM generating UART frame: START bit, 8 data bits, and STOP bit.", code: "always @(posedge clk) begin case(state) IDLE: if(start) state <= START_BIT; default: state <= IDLE; endcase end" },
  { title: "UART Receiver FSM", topic: "FSM Design", difficulty: "Hard", desc: "FSM sampling UART line at center of start bit and 8 data bits.", code: "always @(posedge clk) begin case(state) START: if(sample_tick) state <= DATA; default: state <= START; endcase end" },
  { title: "SPI Slave Controller FSM", topic: "FSM Design", difficulty: "Hard", desc: "SPI Slave FSM handling CS_N assertion, SCLK data sampling, and MISO shift.", code: "always @(posedge clk) begin if(!cs_n) state <= SHIFT; else state <= IDLE; end" },
  { title: "I2C Master Start/Stop FSM", topic: "FSM Design", difficulty: "Hard", desc: "FSM generating I2C START condition (SDA drops while SCL high) and STOP condition.", code: "always @(posedge clk) begin case(state) IDLE: if(cmd_start) state <= GEN_START; default: state <= IDLE; endcase end" },
  { title: "Simple Bus Arbiter FSM", topic: "FSM Design", difficulty: "Medium", desc: "2-request round-robin bus arbiter alternating grant lines.", code: "always @(posedge clk) begin case(state) GNT0: if(!req0 && req1) state <= GNT1; default: state <= GNT0; endcase end" },
  { title: "Handshake Controller (Req/Ack) FSM", topic: "FSM Design", difficulty: "Medium", desc: "Implement 4-phase request-acknowledge handshake state machine.", code: "always @(posedge clk) begin case(state) IDLE: if(req) state <= ACK_WAIT; default: state <= IDLE; endcase end" },
  { title: "Washing Machine Cycle FSM", topic: "FSM Design", difficulty: "Medium", desc: "FSM managing WASH, RINSE, SPIN, and COMPLETE states with timer inputs.", code: "always @(posedge clk) begin case(state) WASH: if(done_wash) state <= RINSE; default: state <= WASH; endcase end" },
  { title: "Digital Combination Lock FSM", topic: "FSM Design", difficulty: "Medium", desc: "4-digit combination lock FSM unlocking door only on exact passcode sequence.", code: "always @(posedge clk) begin case(state) DIG1: if(key==4'b0011) state <= DIG2; default: state <= DIG1; endcase end" },
  { title: "Pulse Width Modulator FSM", topic: "FSM Design", difficulty: "Easy", desc: "FSM toggling PWM signal high during ON-period and low during OFF-period.", code: "always @(posedge clk) begin if(cnt < duty) pwm <= 1; else pwm <= 0; end" },
  { title: "SDRAM Controller State Machine", topic: "FSM Design", difficulty: "Hard", desc: "SDRAM command FSM issuing PRECHARGE, AUTO_REFRESH, and ACTIVATE sequences.", code: "always @(posedge clk) begin case(state) IDLE: if(ref_req) state <= REFRESH; default: state <= IDLE; endcase end" },
  { title: "Debounce Filter FSM", topic: "FSM Design", difficulty: "Medium", desc: "FSM filtering mechanical switch bounce using 10ms stability timers.", code: "always @(posedge clk) begin if(btn != btn_stable) cnt <= cnt+1; else cnt <= 0; end" },
  { title: "Alarm System Security FSM", topic: "FSM Design", difficulty: "Easy", desc: "Security FSM states: DISARMED, ARMED, TRIGGERED, ALARM_SOUNDING.", code: "always @(posedge clk) begin case(state) ARMED: if(sensor) state <= ALARM; default: state <= ARMED; endcase end" },
  { title: "AXI Read Address Channel FSM", topic: "FSM Design", difficulty: "Hard", desc: "AXI4-Lite read address state machine managing ARVALID and ARREADY signals.", code: "always @(posedge clk) begin case(state) IDLE: if(arvalid) state <= READ_DATA; default: state <= IDLE; endcase end" },
  { title: "AXI Write Channel FSM", topic: "FSM Design", difficulty: "Hard", desc: "AXI4-Lite write state machine managing AWVALID, WVALID, and BVALID responses.", code: "always @(posedge clk) begin case(state) IDLE: if(awvalid && wvalid) state <= RESP; default: state <= IDLE; endcase end" },
  { title: "Dual-Port RAM Lock FSM", topic: "FSM Design", difficulty: "Medium", desc: "FSM resolving simultaneous read/write collisions at matching RAM addresses.", code: "always @(posedge clk) begin if(addr_match && wr_en) state <= STALL_READ; end" },
  { title: "PCIe TLP Header Parser FSM", topic: "FSM Design", difficulty: "Hard", desc: "FSM parsing 3-dword/4-dword PCIe Transaction Layer Packet headers.", code: "always @(posedge clk) begin case(state) HDR0: state <= HDR1; HDR1: state <= PAYLOAD; default: state <= HDR0; endcase end" },
  { title: "DMA Channel Controller FSM", topic: "FSM Design", difficulty: "Hard", desc: "FSM managing DMA transfer cycles: CONFIG, FETCH_SRC, WRITE_DST, INTERRUPT.", code: "always @(posedge clk) begin case(state) FETCH: state <= WRITE; WRITE: if(count==0) state <= DONE; default: state <= FETCH; endcase end" },
  { title: "Stepper Motor Phase Driver FSM", topic: "FSM Design", difficulty: "Medium", desc: "4-phase stepper motor FSM generating full-step drive sequences.", code: "always @(posedge clk) begin case(step) 2'd0: phase <= 4'b0001; 2'd1: phase <= 4'b0010; default: phase <= 4'b0001; endcase end" },
  { title: "FIFO Threshold Flag FSM", topic: "FSM Design", difficulty: "Easy", desc: "FSM asserting ALMOST_FULL and ALMOST_EMPTY flags based on FIFO level.", code: "always @(*) begin almost_full = (count >= 14); almost_empty = (count <= 2); end" },

  // --- 5. Timing Analysis (25 Problems) ---
  { title: "Setup Time Slack Calculation", topic: "Timing Analysis", difficulty: "Easy", desc: "Calculate setup slack given T_clk=10ns, T_cq=1ns, T_comb=6ns, T_su=1.5ns.", code: "assign setup_slack = 10.0 - (1.0 + 6.0 + 1.5);" },
  { title: "Hold Time Violation Check", topic: "Timing Analysis", difficulty: "Easy", desc: "Check for hold time violation given T_cq=0.4ns, T_comb=0.1ns, T_hold=0.8ns.", code: "assign hold_slack = (0.4 + 0.1) - 0.8;" },
  { title: "Maximum Clock Frequency Calculation", topic: "Timing Analysis", difficulty: "Medium", desc: "Calculate max clock frequency F_max for path with T_cq=1.2ns, T_comb=4.8ns, T_su=1.0ns.", code: "assign f_max_mhz = 1000.0 / (1.2 + 4.8 + 1.0);" },
  { title: "Clock Skew Effect on Setup Time", topic: "Timing Analysis", difficulty: "Medium", desc: "Calculate setup slack with positive clock skew T_skew=0.5ns.", code: "assign setup_slack = (T_clk + 0.5) - (T_cq + T_comb + T_su);" },
  { title: "Clock Skew Effect on Hold Time", topic: "Timing Analysis", difficulty: "Medium", desc: "Calculate hold slack with positive clock skew T_skew=0.5ns.", code: "assign hold_slack = (T_cq + T_comb) - (T_hold + 0.5);" },
  { title: "Clock Jitter Impact Analysis", topic: "Timing Analysis", difficulty: "Medium", desc: "Calculate reduced clock period accounting for peak-to-peak clock jitter.", code: "assign effective_t_clk = T_clk - T_jitter;" },
  { title: "Multicycle Path Constraint 2x", topic: "Timing Analysis", difficulty: "Hard", desc: "Constrain a 2-cycle multicycle path allowing 2 clock periods for logic propagation.", code: "assign max_comb_delay = 2 * T_clk - T_cq - T_su;" },
  { title: "False Path Indication", topic: "Timing Analysis", difficulty: "Easy", desc: "Identify false timing paths between asynchronous reset domains.", code: "assign is_false_path = (src_domain != dst_domain);" },
  { title: "Minimum Pulse Width Constraint", topic: "Timing Analysis", difficulty: "Easy", desc: "Verify minimum high/low clock pulse width constraints.", code: "assign pulse_ok = (clk_high >= t_min_high) && (clk_low >= t_min_low);" },
  { title: "Recovery Time Violation Check", topic: "Timing Analysis", difficulty: "Medium", desc: "Calculate recovery slack for async reset deassertion relative to clock edge.", code: "assign recovery_slack = T_clk - (T_reset_delay + T_recovery);" },
  { title: "Removal Time Violation Check", topic: "Timing Analysis", difficulty: "Medium", desc: "Calculate removal slack ensuring async reset remains active long enough.", code: "assign removal_slack = T_reset_delay - T_removal;" },
  { title: "Input Delay Constraint SDC", topic: "Timing Analysis", difficulty: "Medium", desc: "Calculate external input delay constraint relative to board clock.", code: "assign t_input_delay = t_board_max - t_trace_delay;" },
  { title: "Output Delay Constraint SDC", topic: "Timing Analysis", difficulty: "Medium", desc: "Calculate external output delay constraint for driving off-chip RAM.", code: "assign t_output_delay = t_setup_ext + t_trace_ext;" },
  { title: "CRPR Clock Reconvergence Pessimism", topic: "Timing Analysis", difficulty: "Hard", desc: "Calculate CRPR credit adjustment for common clock tree branch paths.", code: "assign crpr_credit = t_max_common - t_min_common;" },
  { title: "Data Path Gate Resizing for Setup", topic: "Timing Analysis", difficulty: "Medium", desc: "Determine required cell drive strength increase to eliminate -200ps setup slack.", code: "assign required_cell_speedup_ps = 200;" },
  { title: "Buffer Insertion for Hold Fix", topic: "Timing Analysis", difficulty: "Easy", desc: "Calculate number of 50ps delay buffers needed to fix a -120ps hold violation.", code: "assign buffers_needed = 3;" },
  { title: "Clock Gating Setup Violation", topic: "Timing Analysis", difficulty: "Hard", desc: "Calculate setup margin on clock enable signal driving integrated clock gating (ICG) cell.", code: "assign icg_setup_slack = T_clk_low - (T_cq + T_comb + T_icg_setup);" },
  { title: "Half-Period Path Timing", topic: "Timing Analysis", difficulty: "Hard", desc: "Analyze timing for data launched on posedge and captured on negedge of clock.", code: "assign half_period_slack = (T_clk / 2.0) - (T_cq + T_comb + T_su);" },
  { title: "On-Chip Variation (OCV) Derating", topic: "Timing Analysis", difficulty: "Hard", desc: "Apply 10% OCV derate factor to max data path and min clock path delays.", code: "assign derated_data_delay = max_data_delay * 1.10;" },
  { title: "Advanced OCV (AOCV) Stage Count", topic: "Timing Analysis", difficulty: "Hard", desc: "Calculate reduced OCV derate margin based on logic depth of 12 logic stages.", code: "assign aocv_margin = 1.0 + (0.15 / 3.46);" },
  { title: "Dynamic Power Switching Activity", topic: "Timing Analysis", difficulty: "Medium", desc: "Calculate dynamic power consumption P_dyn = alpha * C * V^2 * f.", code: "assign p_dyn_mw = alpha * C_pf * V_val * V_val * f_mhz;" },
  { title: "Static Leakage Power Bounds", topic: "Timing Analysis", difficulty: "Easy", desc: "Calculate subthreshold static leakage power across 100k standard cells.", code: "assign p_leak_mw = cell_count * i_leak_per_cell * v_dd;" },
  { title: "IR Drop Voltage Degradation", topic: "Timing Analysis", difficulty: "Hard", desc: "Calculate path delay increase due to 5% power grid IR drop voltage dip.", code: "assign delay_penalty_percent = 5.0 * 1.8;" },
  { title: "Crosstalk Noise Delay Penalty", topic: "Timing Analysis", difficulty: "Hard", desc: "Calculate aggressor net crosstalk victim delay penalty during opposite switching.", code: "assign total_delay = base_delay + crosstalk_delta_ps;" },
  { title: "Duty Cycle Distortion (DCD)", topic: "Timing Analysis", difficulty: "Medium", desc: "Analyze timing degradation caused by 45/55 clock duty cycle distortion.", code: "assign worst_half_period = T_clk * 0.45;" },

  // --- 6. Protocol Design (25 Problems) ---
  { title: "APB3 Read Transaction", topic: "Protocol Design", difficulty: "Medium", desc: "Parse APB3 read transfer with PSEL, PENABLE, PWRITE=0, PREADY.", code: "always @(posedge pclk) begin if(psel && penable && !pwrite && pready) prdata <= mem[paddr]; end" },
  { title: "APB3 Write Transaction", topic: "Protocol Design", difficulty: "Medium", desc: "Parse APB3 write transfer committing PWDATA on PENABLE high.", code: "always @(posedge pclk) begin if(psel && penable && pwrite && pready) mem[paddr] <= pwdata; end" },
  { title: "APB4 Error Response PSLVERR", topic: "Protocol Design", difficulty: "Medium", desc: "Assert PSLVERR when accessing invalid out-of-bounds APB register address.", code: "always @(posedge pclk) begin if(psel && penable && paddr >= 8'h80) pslverr <= 1; else pslverr <= 0; end" },
  { title: "AHB-Lite Single Read Cycle", topic: "Protocol Design", difficulty: "Hard", desc: "AHB-Lite read transaction asserting HREADYOUT when HRDATA is valid.", code: "always @(posedge hclk) begin if(hsel && hready && (htrans==2'b10) && !hwrite) hreadyout <= 1; end" },
  { title: "AXI4-Lite Write Address Channel", topic: "Protocol Design", difficulty: "Hard", desc: "Handshake AWVALID and AWREADY signals on AXI write address bus.", code: "always @(posedge aclk) begin if(awvalid && !awready) awready <= 1; else awready <= 0; end" },
  { title: "AXI4-Lite Write Data Channel", topic: "Protocol Design", difficulty: "Hard", desc: "Handshake WVALID and WREADY and apply WSTRB byte enables.", code: "always @(posedge aclk) begin if(wvalid && wstrb[0]) mem[addr][7:0] <= wdata[7:0]; end" },
  { title: "AXI4-Lite Write Response BVALID", topic: "Protocol Design", difficulty: "Hard", desc: "Assert BVALID response after successful write address and data handshake.", code: "always @(posedge aclk) begin if(aw_done && w_done) bvalid <= 1; else if(bready) bvalid <= 0; end" },
  { title: "AXI4 Stream Master FIFO", topic: "Protocol Design", difficulty: "Hard", desc: "Implement AXI4 Stream master interface with TVALID, TREADY, TDATA, TLAST.", code: "always @(posedge aclk) begin if(tvalid && tready) begin tdata <= next_data; tlast <= is_last; end end" },
  { title: "SPI Master Mode 0 (CPOL=0, CPHA=0)", topic: "Protocol Design", difficulty: "Hard", desc: "Transmit SPI byte: sample MISO on rising SCLK, drive MOSI on falling SCLK.", code: "always @(posedge sclk) begin miso_sample <= miso; end" },
  { title: "SPI Mode 3 Transceiver (CPOL=1, CPHA=1)", topic: "Protocol Design", difficulty: "Hard", desc: "Implement SPI Mode 3 transceiver with idle-high SCLK.", code: "always @(negedge sclk) begin mosi <= tx_reg[7]; tx_reg <= {tx_reg[6:0], 1'b0}; end" },
  { title: "I2C Start Condition Generator", topic: "Protocol Design", difficulty: "Hard", desc: "Generate I2C START: pull SDA low while SCL remains high.", code: "always @(posedge clk) begin if(start_cmd) begin sda <= 0; scl <= 1; end end" },
  { title: "I2C Stop Condition Generator", topic: "Protocol Design", difficulty: "Hard", desc: "Generate I2C STOP: release SDA to high while SCL remains high.", code: "always @(posedge clk) begin if(stop_cmd) begin scl <= 1; sda <= 1; end end" },
  { title: "I2C ACK/NACK Bit Checker", topic: "Protocol Design", difficulty: "Medium", desc: "Sample SDA during 9th SCL clock cycle to verify slave ACK (SDA=0).", code: "always @(posedge scl) begin if(bit_cnt == 9) ack_error <= sda; end" },
  { title: "UART 115200 Baud Generator", topic: "Protocol Design", difficulty: "Medium", desc: "Generate baud tick pulses from 50MHz clock for 115200 bps (divider = 434).", code: "always @(posedge clk) begin if(cnt == 433) begin cnt <= 0; tick <= 1; end else begin cnt <= cnt+1; tick <= 0; end end" },
  { title: "UART Transmitter Serializer", topic: "Protocol Design", difficulty: "Medium", desc: "Serialize 8-bit byte framing with 1 start bit (0) and 1 stop bit (1).", code: "always @(posedge baud_tick) begin tx <= tx_shift[0]; tx_shift <= {1'b1, tx_shift[9:1]}; end" },
  { title: "UART Receiver 16x Oversampler", topic: "Protocol Design", difficulty: "Hard", desc: "Sample serial RX line 16 times per baud bit to locate center sample point.", code: "always @(posedge sample_tick) begin if(sample_cnt == 7) rx_bit <= rx_pin; end" },
  { title: "CAN Bus Bit Stuffing Engine", topic: "Protocol Design", difficulty: "Hard", desc: "Insert an inverted stuff bit after 5 consecutive identical bits on CAN bus.", code: "always @(posedge clk) begin if(same_cnt == 5) begin stuff_bit <= ~last_bit; same_cnt <= 1; end end" },
  { title: "Ethernet Preamble Generator", topic: "Protocol Design", difficulty: "Hard", desc: "Generate 7 bytes of 0x55 followed by 1 byte SFD (0xD5) for 100M Ethernet.", code: "always @(posedge tx_clk) begin if(cnt < 7) byte_out <= 8'h55; else byte_out <= 8'hD5; end" },
  { title: "PCIe TLP Header Encoder", topic: "Protocol Design", difficulty: "Hard", desc: "Encode 3-DW Memory Read TLP Header format.", code: "assign header_dw0 = {1'b0, fmt_type, 1'b0, tc, 4'b0, td, ep, attr, 2'b0, length};" },
  { title: "USB 2.0 NRZI Bit Encoder", topic: "Protocol Design", difficulty: "Hard", desc: "Encode binary stream to NRZI: toggle signal for 0, hold signal for 1.", code: "always @(posedge clk) begin if(data_bit == 0) nrzi_out <= ~nrzi_out; end" },
  { title: "JTAG TAP Controller FSM", topic: "Protocol Design", difficulty: "Hard", desc: "Implement IEEE 1149.1 JTAG 16-state TAP controller (Test-Logic-Reset, Shift-DR).", code: "always @(posedge tck) begin case(tap_state) RESET: tap_state <= tms ? RESET : RUN_IDLE; default: tap_state <= RESET; endcase end" },
  { title: "AMBA APB Bridge Master", topic: "Protocol Design", difficulty: "Hard", desc: "Bridge AHB read/write commands into 2-phase APB setup and access cycles.", code: "always @(posedge clk) begin case(state) SETUP: begin psel <= 1; penable <= 0; end ACCESS: penable <= 1; endcase end" },
  { title: "AXI4 Burst Address Calculator", topic: "Protocol Design", difficulty: "Hard", desc: "Calculate INCR burst addresses for AXI transfers (address + (1 << size)).", code: "assign next_addr = curr_addr + (1 << axsize);" },
  { title: "I2S Audio Serializer", topic: "Protocol Design", difficulty: "Medium", desc: "Serialize 16-bit audio samples over I2S bus (SD, WS, SCK lines).", code: "always @(negedge sck) begin sd <= tx_sample[bit_cnt]; end" },
  { title: "DisplayPort Aux Channel Transceiver", topic: "Protocol Design", difficulty: "Hard", desc: "Encode Manchester II biphase data on DisplayPort AUX channel.", code: "always @(posedge clk) aux_out <= bit_val ^ clock_phase;" },

  // --- 7. SystemVerilog (25 Problems) ---
  { title: "SystemVerilog Logic Type Usage", topic: "SystemVerilog", difficulty: "Easy", desc: "Use 4-state 'logic' type to declare continuous assign and procedural nets.", code: "logic [7:0] data_bus; assign data_bus = in_val;" },
  { title: "SystemVerilog Enum State Encoding", topic: "SystemVerilog", difficulty: "Easy", desc: "Declare strongly-typed enumerated state type for FSM design.", code: "typedef enum logic [1:0] {IDLE=2'b00, READ=2'b01, WRITE=2'b10} state_t; state_t state;" },
  { title: "SystemVerilog Packed Struct", topic: "SystemVerilog", difficulty: "Medium", desc: "Define a packed struct representing an Ethernet header field.", code: "typedef struct packed { logic [47:0] dst_mac; logic [47:0] src_mac; logic [15:0] ethertype; } eth_hdr_t;" },
  { title: "SystemVerilog Always_ff Usage", topic: "SystemVerilog", difficulty: "Easy", desc: "Model clocked registers using explicit 'always_ff' construct.", code: "always_ff @(posedge clk or negedge rst_n) begin if(!rst_n) q <= 0; else q <= d; end" },
  { title: "SystemVerilog Always_comb Usage", topic: "SystemVerilog", difficulty: "Easy", desc: "Model combinational logic using 'always_comb' with automatic sensitivity list.", code: "always_comb begin y = a & b | c; end" },
  { title: "SystemVerilog Always_latch Usage", topic: "SystemVerilog", difficulty: "Easy", desc: "Model intentional transparent latch using 'always_latch'.", code: "always_latch begin if(enable) q = d; end" },
  { title: "SystemVerilog Interface Definition", topic: "SystemVerilog", difficulty: "Medium", desc: "Define a SystemVerilog interface bundling master/slave bus signals.", code: "interface memory_bus(input logic clk); logic [31:0] addr, data; logic read, write; endinterface" },
  { title: "SystemVerilog Modport Scoping", topic: "SystemVerilog", difficulty: "Medium", desc: "Define master and slave modports inside a SystemVerilog interface.", code: "modport master(output addr, data, read, write); modport slave(input addr, data, read, write);" },
  { title: "SystemVerilog Unique Case Statement", topic: "SystemVerilog", difficulty: "Medium", desc: "Use 'unique case' to enforce parallel non-overlapping case evaluation.", code: "unique case(opcode) 2'b00: y=a+b; 2'b01: y=a-b; default: y=0; endcase" },
  { title: "SystemVerilog Priority If Statement", topic: "SystemVerilog", difficulty: "Medium", desc: "Use 'priority if' to check conditions sequentially in priority encoder.", code: "priority if(in[3]) out=3; else if(in[2]) out=2; else out=0;" },
  { title: "SystemVerilog Concurrent Assertion (SVA)", topic: "SystemVerilog", difficulty: "Hard", desc: "Write a SVA property proving req is followed by ack within 2 cycles.", code: "property p_req_ack; @(posedge clk) req |-> ##[1:2] ack; endproperty assert property(p_req_ack);" },
  { title: "SystemVerilog Immediate Assertion", topic: "SystemVerilog", difficulty: "Easy", desc: "Write an immediate assertion checking valid data bounds.", code: "always_ff @(posedge clk) begin assert (data < 250) else $error(\"Data out of bounds!\"); end" },
  { title: "SystemVerilog Inside Operator Range", topic: "SystemVerilog", difficulty: "Easy", desc: "Use SystemVerilog 'inside' operator to check set membership.", code: "assign valid = val inside {[8'd10:8'd50], 8'd100, 8'd200};" },
  { title: "SystemVerilog Streaming Operator {>>}", topic: "SystemVerilog", difficulty: "Medium", desc: "Pack 4 bytes into 32-bit word using right streaming operator.", code: "assign word = {>>{byte3, byte2, byte1, byte0}};" },
  { title: "SystemVerilog Streaming Operator {<<}", topic: "SystemVerilog", difficulty: "Medium", desc: "Reverse byte order using left streaming operator.", code: "assign rev_word = {<<byte{orig_word}};" },
  { title: "SystemVerilog Packages import", topic: "SystemVerilog", difficulty: "Easy", desc: "Import shared constants and types from a SystemVerilog package.", code: "import chip_params_pkg::*; assign width = DATA_WIDTH;" },
  { title: "SystemVerilog Union Packed", topic: "SystemVerilog", difficulty: "Hard", desc: "Define a packed union sharing 32-bit memory space between DWORD and 4 BYTES.", code: "typedef union packed { logic [31:0] dword; logic [3:0][7:0] bytes; } data_u;" },
  { title: "SystemVerilog Dynamic Array Declaration", topic: "SystemVerilog", difficulty: "Medium", desc: "Declare and allocate a SystemVerilog dynamic array.", code: "int dyn_arr[]; initial begin dyn_arr = new[10]; end" },
  { title: "SystemVerilog Queue Operations", topic: "SystemVerilog", difficulty: "Medium", desc: "Push and pop items from a SystemVerilog queue.", code: "int q[$]; initial begin q.push_back(100); val = q.pop_front(); end" },
  { title: "SystemVerilog Associative Array Lookup", topic: "SystemVerilog", difficulty: "Hard", desc: "Declare associative array indexed by string addresses.", code: "int mem[string]; initial begin mem[\"config_reg\"] = 32'hA000;" },
  { title: "SystemVerilog Functional Coverage Covergroup", topic: "SystemVerilog", difficulty: "Hard", desc: "Define covergroup tracking opcode coverage bins.", code: "covergroup cg_op @(posedge clk); coverpoint opcode { bins add_op = {0}; bins sub_op = {1}; } endgroup" },
  { title: "SystemVerilog Constraint Block", topic: "SystemVerilog", difficulty: "Hard", desc: "Write random constraints specifying addr must be 4-byte aligned.", code: "class packet; rand logic [31:0] addr; constraint c_align { addr[1:0] == 2'b00; } endclass" },
  { title: "SystemVerilog Cross Coverage Bin", topic: "SystemVerilog", difficulty: "Hard", desc: "Cross opcode coverpoint with mode coverpoint to track combinations.", code: "cross_op_mode: cross cp_op, cp_mode;" },
  { title: "SystemVerilog Soft Constraint", topic: "SystemVerilog", difficulty: "Medium", desc: "Declare a soft constraint that can be overridden by test scenarios.", code: "constraint c_len { soft length == 64; }" },
  { title: "SystemVerilog Mailbox Data Exchange", topic: "SystemVerilog", difficulty: "Hard", desc: "Pass transaction objects between generator and driver using uvm/sv mailboxes.", code: "mailbox #(packet) mbx; initial mbx.put(pkt);" },

  // --- 8. Debugging (25 Problems) ---
  { title: "Latch Inference Removal Debug", topic: "Debugging", difficulty: "Medium", desc: "Fix inferred latch in combinational block by adding missing else branch.", code: "always @(*) begin if(sel) y = a; else y = b; // Fixed else branch end" },
  { title: "Clocked Blocking Assignment Fix", topic: "Debugging", difficulty: "Medium", desc: "Replace blocking '=' with non-blocking '<=' inside clocked always block.", code: "always @(posedge clk) begin q1 <= d; q2 <= q1; // Fixed non-blocking end" },
  { title: "Missing Reset Register Initialization", topic: "Debugging", difficulty: "Medium", desc: "Add active-low asynchronous reset branch to initialize counter.", code: "always @(posedge clk or negedge rst_n) begin if(!rst_n) count <= 0; else count <= count+1; end" },
  { title: "Vector Width Truncation Debug", topic: "Debugging", difficulty: "Easy", desc: "Fix vector width mismatch assigning 8-bit value to 4-bit register.", code: "assign out[3:0] = in[3:0]; // Sized correctly" },
  { title: "Combinational Loop Elimination", topic: "Debugging", difficulty: "Hard", desc: "Break feedback loop where 'assign y = y & x' by registering through flip-flop.", code: "always @(posedge clk) y <= y & x; // Fixed registered feedback" },
  { title: "Sensitivity List Missing Signal Fix", topic: "Debugging", difficulty: "Easy", desc: "Fix incomplete sensitivity list in Verilog-1995 combinational always block.", code: "always @(a or b or sel) begin // Fixed complete sensitivity list end" },
  { title: "Multiple Driver Resolution", topic: "Debugging", difficulty: "Hard", desc: "Fix signal driven concurrently by continuous assign and always block.", code: "// Removed continuous assign; kept single procedural driver" },
  { title: "Division by Zero Guarding", topic: "Debugging", difficulty: "Easy", desc: "Add check to prevent division by zero in hardware math block.", code: "assign result = (divisor != 0) ? (dividend / divisor) : 32'hFFFFFFFF;" },
  { title: "Unused Signal Pruning", topic: "Debugging", difficulty: "Easy", desc: "Remove declared internal wire that is never read or assigned.", code: "// Removed unused wire floating_node;" },
  { title: "Off-By-One Counter Bound Fix", topic: "Debugging", difficulty: "Medium", desc: "Fix off-by-one error in 0-to-9 decade counter resetting at 10 instead of 9.", code: "if(count == 4'd9) count <= 0; // Fixed reset threshold" },
  { title: "Unsigned Negative Subtraction Fix", topic: "Debugging", difficulty: "Medium", desc: "Fix underflow error when subtracting larger unsigned number from smaller.", code: "assign diff = (a >= b) ? (a - b) : 0; // Guarded underflow" },
  { title: "Race Condition Timing Window Fix", topic: "Debugging", difficulty: "Hard", desc: "Fix race condition where data and clock change simultaneously in testbench.", code: "always @(posedge clk) #1 d_reg <= d; // Added non-zero setup skew" },
  { title: "Active-Low Reset Logic Inversion Fix", topic: "Debugging", difficulty: "Easy", desc: "Fix logic error where active-low reset (!rst_n) was written active-high (rst_n).", code: "if(!rst_n) state <= RESET; // Fixed active-low check" },
  { title: "Unconnected Port Instantiation Fix", topic: "Debugging", difficulty: "Medium", desc: "Connect floating output pin on sub-module instantiation.", code: "sub_module u0 (.clk(clk), .rst(rst), .out(net_out)); // Connected out" },
  { title: "Blocking Assignment in Comb Case Fix", topic: "Debugging", difficulty: "Easy", desc: "Ensure combinational case statements use blocking '=' instead of non-blocking '<='.", code: "always @(*) begin case(sel) 2'b0: out = a; default: out = b; endcase end" },
  { title: "Bus Bit Order Mismatch Fix", topic: "Debugging", difficulty: "Medium", desc: "Fix reversed bus bit ordering connecting [0:7] port to [7:0] net.", code: "assign dst_bus[7:0] = src_bus[7:0]; // Aligned bit direction" },
  { title: "State Machine Deadlock Escape Fix", topic: "Debugging", difficulty: "Hard", desc: "Add default case to FSM to escape unhandled state deadlocks.", code: "default: next_state = IDLE; // Added deadlock recovery" },
  { title: "Bitwise AND vs Logical AND Bug Fix", topic: "Debugging", difficulty: "Easy", desc: "Fix bug where logical && was used instead of bitwise & for bus masking.", code: "assign bus_masked = in_bus & 8'h0F; // Fixed bitwise AND" },
  { title: "FSM Output Glitch Reduction", topic: "Debugging", difficulty: "Hard", desc: "Register Mealy outputs into flip-flops to prevent combinational glitches.", code: "always @(posedge clk) out_reg <= (state == S1) && in;" },
  { title: "Signed Arithmetic Extension Bug Fix", topic: "Debugging", difficulty: "Medium", desc: "Fix signed addition zero-extending negative numbers instead of sign-extending.", code: "assign sum = $signed(a) + $signed(b); // Fixed signed extension" },
  { title: "Metastability Synchronizer Insertion", topic: "Debugging", difficulty: "Hard", desc: "Fix metastability issue on async input by adding 2-stage D-FF synchronizer.", code: "always @(posedge clk) begin sync0 <= async_in; sync1 <= sync0; end" },
  { title: "CDC Reset Glitch Filter", topic: "Debugging", difficulty: "Hard", desc: "Add reset synchronizer (async assert, sync deassert) to clean reset tree.", code: "always @(posedge clk or negedge rst_n_raw) begin if(!rst_n_raw) {rst_n_sync, rst0} <= 2'b00; else {rst_n_sync, rst0} <= {rst0, 1'b1}; end" },
  { title: "Tri-State Bus Contention Guard", topic: "Debugging", difficulty: "Hard", desc: "Ensure enable signals for two tri-state drivers are mutually exclusive.", code: "assign oe1 = en1; assign oe2 = en2 && !en1; // Guaranteed no overlap" },
  { title: "Array Index Out Of Bounds Guard", topic: "Debugging", difficulty: "Medium", desc: "Clamp lookup table index to prevent reading past array bounds.", code: "assign safe_idx = (idx > 4'd15) ? 4'd15 : idx;" },
  { title: "Floating Clock Net Wire Fix", topic: "Debugging", difficulty: "Easy", desc: "Connect undriven clock port on sequential block to main system clock.", code: "always @(posedge sys_clk) // Connected system clock net" }
];

mainProblemSeeds.forEach((item, idx) => {
  VLSIData.challenges.push({
    id: `ch-${idx + 1}`,
    title: item.title,
    topic: item.topic,
    difficulty: item.difficulty,
    description: item.desc,
    initial_code: `module design_block_${idx+1} (\n    input  wire clk,\n    input  wire rst,\n    input  wire [7:0] in,\n    output reg  [7:0] out\n);\n    // Write your solution here\nendmodule`,
    solution: item.code,
    acceptance: `${65 + (idx * 7) % 30}% acceptance`,
    solved: `${1 + (idx * 3) % 18}.${(idx * 5) % 9}k solved`,
    tags: [item.topic.toLowerCase().replace(" ", "-"), item.difficulty.toLowerCase()]
  });
});

// --- Comprehensive VLSI Interview Flashcards, MCQs & Quizzes ---
VLSIData.interviews.flashcards = [
  // 1. RTL & Digital Design
  {
    q: "What is the difference between blocking (=) and non-blocking (<=) assignments in Verilog?",
    a: "Blocking (=) executes sequentially within a procedural block and is used for combinational logic (always_comb). Non-blocking (<=) evaluates all RHS expressions concurrently before updating LHS targets at the end of the time step, preventing race conditions in sequential logic (always_ff)."
  },
  {
    q: "What is metastability in digital circuits, and how is it mitigated during Clock Domain Crossing (CDC)?",
    a: "Metastability occurs when setup or hold times are violated, causing a flip-flop output to hover between 0 and 1 for an unpredictable duration. It is mitigated by inserting a Multi-Stage Synchronizer (2-FF or 3-FF) on single-bit signals or using Async FIFOs with Gray-coded pointers for multi-bit buses."
  },
  {
    q: "Why are Gray codes mandatory for Asynchronous FIFO read and write pointer synchronization across clock domains?",
    a: "Gray code ensures only a single bit changes between consecutive pointer increments. This guarantees that even if a bit transitions right at a clock edge, the synchronized value can only be off by at most 1 count, preventing false FIFO full or empty conditions."
  },
  {
    q: "Compare Synchronous vs. Asynchronous Reset strategies in ASIC design.",
    a: "Async Reset acts immediately without waiting for clock, saving power and cycles during startup, but can cause metastability on reset deassertion if not synchronized. Sync Reset is immune to glitch noise, but requires an active clock to reset and increases datapath cell sizes."
  },
  {
    q: "What is Clock Gating, and how does an Integrated Clock Gating (ICG) cell prevent glitches?",
    a: "Clock Gating turns off the clock line to idle flip-flops to save dynamic power (P_dyn = alpha * C * V^2 * f). An ICG cell uses a negative-edge latch before an AND/OR gate to ensure the clock enable signal only transitions while the clock is low, eliminating clock glitches."
  },
  {
    q: "What is a latch-up condition in CMOS technology, and how is it prevented in physical layout?",
    a: "Latch-up is a low-impedance short-circuit path between VDD and GND caused by parasitic PNP and NPN bipolar transistors (SCR structure) in CMOS substrates. It is prevented by placing abundant Substrate/Well Taps, minimizing well resistance, and adding guard rings around I/O cells."
  },
  {
    q: "What is the difference between Setup Time (t_su) and Hold Time (t_hold)?",
    a: "Setup Time is the minimum duration data input must remain stable BEFORE the active clock edge. Hold Time is the minimum duration data must remain stable AFTER the active clock edge to ensure reliable capture by the flip-flop."
  },
  {
    q: "How do you detect rising and falling edges of a signal using a single flip-flop?",
    a: "Register the signal into a flip-flop (sig_d <= sig). Rising edge pulse = (sig && !sig_d). Falling edge pulse = (!sig && sig_d). Dual-edge pulse = (sig ^ sig_d)."
  },

  // 2. STA & Physical Design
  {
    q: "How does positive clock skew affect Setup Slack and Hold Slack?",
    a: "Positive Clock Skew (capture clock arrives later than launch clock) HELPS Setup Slack (Setup Slack = T_clk + T_skew - T_data - T_su) but HURTS Hold Slack (Hold Slack = T_data - T_hold - T_skew)."
  },
  {
    q: "Why can hold time violations NOT be fixed by slowing down the clock frequency (F_clk)?",
    a: "Hold time equations (T_launch + T_cq + T_comb >= T_capture + T_hold) do not depend on the clock period (T_clk). Hold violations occur on the same clock edge, so increasing T_clk does not change data propagation delay."
  },
  {
    q: "What is the Antenna Effect in VLSI fabrication, and how is it resolved during physical routing?",
    a: "During plasma etching, long metal wires accumulate electrostatic charges that can breakdown thin gate oxide in input transistors. It is resolved by routing long wires up to higher metal layers (layer hopping) or inserting Antenna Diodes near the gate to discharge excess voltage to GND."
  },
  {
    q: "Explain On-Chip Variation (OCV) and why derating factors are applied during Static Timing Analysis (STA).",
    a: "OCV accounts for localized process, voltage, and temperature variations across a single die. STA applies derate factors (e.g. 1.05 max delay for launch path, 0.95 min delay for capture path) to ensure setup and hold timing yield under worst-case local gradients."
  },
  {
    q: "What is Clock Tree Synthesis (CTS), and what are its primary objectives?",
    a: "CTS is the physical design step that builds balanced clock buffer trees to distribute clock signals from the PLL source to all sequential elements. Its main objectives are minimizing Clock Skew, reducing Clock Insertion Delay (latency), and conserving clock power."
  },
  {
    q: "What causes Electromigration (EM) in interconnect wires, and how is it mitigated?",
    a: "EM is the transport of metal atoms due to high current density (J), leading to voids (opens) or hillocks (shorts). It is mitigated by widening power/signal wires, using higher metal layers for power grids, and inserting redundant vias."
  },
  {
    q: "What is Crosstalk Delay and Crosstalk Noise (Noise Glitch) in sub-micron interconnects?",
    a: "Crosstalk is capacitive coupling between adjacent signal wires (aggressor and victim). If aggressor switches in opposite direction, it increases victim delay (Crosstalk Delay). If victim is idle, aggressor switching can induce a false voltage glitch (Crosstalk Noise)."
  },
  {
    q: "What is the difference between Setup Slack and Hold Slack?",
    a: "Setup Slack is the time margin by which data arrives BEFORE the setup window closes. Positive setup slack means the path meets timing. Hold Slack is the margin by which data remains stable AFTER the hold window opens."
  },

  // 3. Verification (SystemVerilog & UVM)
  {
    q: "What is the difference between a class and a struct in SystemVerilog?",
    a: "A struct is a value-based data type allocated on the stack (copied by value). A class is a dynamic reference type allocated on the heap using 'new()' (copied by handle reference), supporting OOP features like inheritance and polymorphism."
  },
  {
    q: "In SystemVerilog assertions (SVA), what is the difference between overlapping (|->) and non-overlapping (|=>) implication?",
    a: "Overlapping implication (A |-> B) evaluates condition B on the SAME clock cycle that antecedent A matches. Non-overlapping implication (A |=> B) evaluates condition B on the NEXT clock cycle (equivalent to A |-> ##1 B)."
  },
  {
    q: "What is the purpose of a Virtual Interface in SystemVerilog UVM testbenches?",
    a: "A Virtual Interface is a variable handle inside dynamic UVM class components (like Drivers and Monitors) pointing to a physical static Verilog interface. It allows OOP verification components to drive and monitor DUT hardware pins."
  },
  {
    q: "What are the execution phases of UVM, and in what order do build_phase and connect_phase execute?",
    a: "UVM uses standardized phases: Build, Connect, End of Elaboration, Start of Simulation, Run, Extract, Check, Report. The 'build_phase' executes top-down in zero simulation time. The 'connect_phase' executes bottom-up to bind ports and exports."
  },
  {
    q: "Explain the difference between Code Coverage and Functional Coverage in ASIC verification.",
    a: "Code Coverage (statement, branch, toggle, FSM) measures how much RTL source code was exercised by simulator stimulus. Functional Coverage (covergroups, coverpoints) measures whether all feature requirements defined in the test plan have been verified."
  },
  {
    q: "What is the UVM Factory, and how does factory overriding benefit verification reuse?",
    a: "The UVM Factory manages object creation dynamically. Factory overriding allows a testcase to swap a base transaction or driver class with an extended specialized class without modifying the existing testbench code structure."
  },
  {
    q: "What is the difference between a UVM Sequence, Sequencer, and Driver?",
    a: "A UVM Sequence generates transaction items (`uvm_do`). A UVM Sequencer acts as a buffer/arbiter routing items from sequences. A UVM Driver receives items from the sequencer, unpacks transaction fields, and drives physical pins of the DUT interface."
  },
  {
    q: "What is a constraint block in SystemVerilog, and what is the difference between hard and soft constraints?",
    a: "Constraint blocks define rules for randomized variables (`rand` / `randc`). Hard constraints MUST be satisfied, causing solver failure if unresolvable. Soft constraints supply default random values that can be overridden by higher-priority test constraints."
  },

  // 4. Protocols & Architecture
  {
    q: "Compare AMBA APB, AHB, and AXI bus protocols in terms of speed and complexity.",
    a: "APB is a non-pipelined, low-power 2-phase bus for low-bandwidth peripherals. AHB is a single-channel pipelined bus supporting burst transfers. AXI is a high-performance out-of-order, multi-channel (5 independent channels: AW, W, B, AR, R) bus for high-speed SoCs."
  },
  {
    q: "Explain the 5 independent channels in AMBA AXI4 protocol.",
    a: "AXI4 has 5 channels: Write Address (AW), Write Data (W), Write Response (B), Read Address (AR), Read Data (R). Independent VALID/READY handshakes allow concurrent read and write operations, bi-directional pipelined transactions, and out-of-order completions."
  },
  {
    q: "In SPI protocol, explain the 4 SPI Modes based on CPOL and CPHA.",
    a: "CPOL defines clock idle state (0=Low, 1=High). CPHA defines sampling edge (0=1st edge, 1=2nd edge). Mode 0 (CPOL=0, CPHA=0): sample on rising edge. Mode 3 (CPOL=1, CPHA=1): sample on rising edge with idle-high clock."
  },
  {
    q: "How does I2C open-drain bus architecture handle multi-master bus arbitration?",
    a: "I2C uses pull-up resistors on SDA and SCL lines. Line state is 1 unless pulled to GND (0). If a master reads 0 while driving 1 during arbitration, it loses arbitration gracefully. Slaves stretch SCL by pulling SCL low until ready."
  },
  {
    q: "What is MESI cache coherence protocol, and what do the states (M, E, S, I) signify?",
    a: "MESI maintains consistency across multi-core caches. Modified (M): Line present only in local cache and dirty. Exclusive (E): Line present only in local cache and clean. Shared (S): Line present in multiple caches, clean. Invalid (I): Line out of date."
  },
  {
    q: "What are the three main types of pipeline hazards in computer architecture (RAW, WAR, WAW)?",
    a: "RAW (Read-After-Write, Data hazard): True dependency where instruction needs value written by preceding instruction. WAR (Write-After-Read, Anti-dependency): Later instruction writes before earlier reads it. WAW (Write-After-Write, Output dependency): Later instruction writes before earlier instruction writes."
  },

  // 5. DFT & Low Power
  {
    q: "What is Scan Chain Insertion in DFT, and how does it convert standard flip-flops into Scan Flip-Flops?",
    a: "Scan insertion replaces standard D-FFs with Scan FFs (adding a 2-to-1 MUX on data input controlled by Scan Enable SE). During Test Mode (SE=1), FFs are stitched into shift registers (scan chains) allowing ATPG patterns to shift in test vectors and shift out silicon responses."
  },
  {
    q: "What is Power Gating, and why are Retention Registers and Isolation Cells required?",
    a: "Power Gating shuts off VDD to idle blocks using sleep transistors to eliminate leakage current. Retention Registers save internal flip-flop state before power-down. Isolation Cells clamp output lines to fixed logic values (0 or 1) so floating signals don't corrupt active domains."
  },
  {
    q: "What is Clock Domain Crossing (CDC), and what is the difference between a control signal CDC vs a data bus CDC?",
    a: "CDC occurs when a signal is sampled by a clock domain different from the domain that launched it. A control signal (single-bit) is synchronized using a multi-stage (2-FF) synchronizer. A data bus (multi-bit) cannot be synchronized using independent bit synchronizers due to routing skew; instead, it requires handshake protocols, asynchronous FIFOs, or MUX-synchronizers."
  },
  {
    q: "What is a false path in Static Timing Analysis (STA), and give an example.",
    a: "A false path is a timing path that exists physically in the netlist but cannot be exercised logically during normal circuit operations (e.g., paths between asynchronous clocks, configuration register paths set once at boot, or test mode paths). They are declared as false paths in SDC using 'set_false_path' to prevent the tool from wasting optimization effort on them."
  },
  {
    q: "What is Multi-Cycle Path (MCP) setup and hold constraints in STA?",
    a: "An MCP is a path designed to take multiple clock cycles (N cycles) to propagate data from source to capture register. By default, setup is checked at N cycles and hold is checked at N-1 cycles. To prevent the hold check from moving to N-1, SDC constraint 'set_multicycle_path -hold -end N-1' is applied to move the hold check back to cycle 0."
  },
  {
    q: "What is Clock Gating Efficiency, and why is structural clock gating preferred over RTL-inferred gating in large designs?",
    a: "Clock gating efficiency measures the percentage of sequential cells gated by clock-enables. Structural clock gating inserts clock-gating cells (ICGs) explicitly in the clock tree, controlling entire register banks. Inferred clock gating relies on synthesis tools to convert RTL enable conditions ('if (enable) q <= d') into ICGs, which can miss optimizations if enable logic is complex."
  },
  {
    q: "What is the difference between uvm_monitor and uvm_scoreboard in a UVM environment?",
    a: "A uvm_monitor is a passive component that observes physical interface pins (via a virtual interface), reconstructs pin-level activity into high-level transaction objects (sequence items), and broadcasts them via analysis ports. A uvm_scoreboard is a component that receives these transaction objects, compares them against a golden reference model, and reports mismatches."
  },
  {
    q: "Explain the concept of Virtual Sequencer and Virtual Sequence in UVM.",
    a: "A Virtual Sequence is a high-level sequence that controls execution and coordinates timing of multiple sub-sequences on different interfaces. It does not generate transactions directly. A Virtual Sequencer contains handles to physical sequencers (drivers) of different agents, providing the execution context for the virtual sequence."
  },
  {
    q: "Explain the difference between AXI4-Lite and full AXI4 protocols.",
    a: "AXI4-Lite is a subset of AXI4 designed for register access in control registers. It does not support burst transfers (always 1 data transfer per transaction), out-of-order execution, cache-support parameters, or data widening. AXI4 supports full bursts up to 256 beats, transaction IDs, cache controls, and advanced QoS features."
  },
  {
    q: "How does the PCIe Link Training and Status State Machine (LTSSM) function?",
    a: "LTSSM is a state machine that controls PCIe link initialization, training, power management, and recovery. It progresses through states like Detect (sensing receiver impedance), Polling (aligning clock/data phases), Configuration (negotiating lane width and link numbers), L0 (active data transfer), and Recovery (retraining if errors occur)."
  },
  {
    q: "What is a transition delay fault (TDF) vs. a path delay fault (PDF) in DFT testing?",
    a: "TDF assumes a delay defect is localized at a single gate terminal (slow-to-rise or slow-to-fall transition). PDF measures the cumulative delay along a predefined physical path to verify if it meets the operational frequency target, representing the worst-case speed-limiting paths."
  },
  {
    q: "What is Dynamic Voltage and Frequency Scaling (DVFS), and how does it save energy?",
    a: "DVFS dynamically adjusts supply voltage and clock frequency of a processor based on workload. Because dynamic power scales quadratically with voltage (P is proportional to C * V^2 * f), reducing both voltage and frequency during low-demand periods yields exponential energy savings."
  },
  {
    q: "What is a Pulse Synchronizer (Toggle Synchronizer), and when is it used instead of a standard 2-FF synchronizer?",
    a: "A Pulse Synchronizer is used to pass a single-cycle pulse from a fast clock domain to a slow clock domain. Because a fast pulse might not be active long enough to be sampled by the slow clock, the fast domain converts the pulse into a level toggle. This toggle crosses the clock boundary via a 2-FF synchronizer, and the slow domain detects the edge of the synchronized level to reconstruct a single-cycle pulse."
  },
  {
    q: "Explain the difference between a 2-phase handshake and a 4-phase handshake protocol.",
    a: "A 4-phase handshake (Return-to-Zero) uses level transitions: REQ goes High, ACK goes High, REQ goes Low, ACK goes Low. It is slow but simple. A 2-phase handshake (Non-Return-to-Zero) uses edge transitions: any change on REQ (rising or falling) initiates a transfer, and any change on ACK completes it. It is twice as fast but requires complex transition-detect logic."
  },
  {
    q: "Compare Static IR Drop vs. Dynamic IR Drop in power grid analysis.",
    a: "Static IR Drop is caused by average current draw in the power distribution network, depending on wire resistance (V_drop = I_avg * R). Dynamic IR Drop is caused by high localized instantaneous switching currents (di/dt) occurring right at the clock edge, heavily influenced by localized power rail inductance and high gate switching activity."
  },
  {
    q: "What is Clock tree skew budgeting, and what is the difference between global skew and local skew?",
    a: "Global skew is the difference in clock arrival times between any two registers on the entire chip. Local skew is the difference in clock arrival times between two registers that communicate directly (data paths exist between them). Physical design focuses on minimizing local skew to maximize setup and hold margins."
  },
  {
    q: "What is the difference between an Active Agent and a Passive Agent in UVM?",
    a: "An Active Agent instantiates a sequencer, driver, and monitor to both drive stimulus into the DUT and observe the bus. A Passive Agent instantiates only a monitor to passively capture and analyze data on a bus without driving signals, commonly used for monitoring system interfaces or interfaces driven by other agents."
  },
  {
    q: "Explain OOP composition over inheritance, and how it is applied in UVM agent verification architecture.",
    a: "Inheritance defines an 'IS-A' relationship by extending a base class. Composition defines a 'HAS-A' relationship by instantiating smaller, modular objects inside a complex component. A UVM agent uses composition to combine a driver, sequencer, and monitor into a single reusable unit rather than inheriting all their behaviors into one monolithic class."
  },
  {
    q: "Explain the physical bank/rank organization of a DDR4 SDRAM memory module.",
    a: "A DDR4 SDRAM module is structured hierarchically: a Rank is a set of memory chips controlled by a single chip select. Within each chip, memory is organized into Bank Groups, which contain individual Banks. Banks contain Pages of memory cells. Accessing Bank Groups in a round-robin fashion maximizes data throughput by hiding precharge and activation latency."
  },
  {
    q: "Explain the 3 layers of the PCIe protocol stack: Transaction, Data Link, and Physical Layer.",
    a: "The Transaction Layer generates Transaction Layer Packets (TLPs) supporting read/write operations and manages flow control. The Data Link Layer ensures reliable transmission by adding sequence numbers and CRC (LCRC), handling acknowledgments (ACK/NAK). The Physical Layer handles 8b/10b or 128b/130b encoding, framing, and serialized electrical lane transmission."
  },
  {
    q: "What is IDDQ testing in DFT, and what kind of physical defects does it detect?",
    a: "IDDQ testing measures the quiescent (idle) supply current of a CMOS circuit. Because idle CMOS circuits consume almost zero static power, a high IDDQ current indicates physical defects like gate-oxide short-circuits, bridging faults, or transistor leakage that might pass standard logical voltage tests."
  },
  {
    q: "What is Body Biasing (Forward and Reverse) in low-power and high-performance design?",
    a: "Body Biasing applies a voltage to the substrate (well) of a transistor. Forward Body Biasing (FBB) lowers the threshold voltage (Vt) to increase speed at the cost of higher leakage. Reverse Body Biasing (RBB) raises Vt to reduce static leakage current during standby or low-performance modes."
  }
];

VLSIData.interviews.mcqs = [
  {
    question: "In a 4-bit Asynchronous Gray Code Counter, how many bits change state between consecutive counts?",
    options: ["Exactly 1 bit", "2 bits", "Depends on the count value", "4 bits"],
    answer: 0,
    explanation: "By definition, Gray code ensures that exactly 1 bit changes state during any consecutive transition, eliminating CDC hazard spikes."
  },
  {
    question: "A digital circuit has a setup time of 1.5 ns, clock-to-q delay of 1.0 ns, and maximum combinational path delay of 4.5 ns. What is the maximum operating clock frequency (F_max)?",
    options: ["142.8 MHz", "200.0 MHz", "100.0 MHz", "250.0 MHz"],
    answer: 0,
    explanation: "T_clk_min = T_cq + T_comb + T_su = 1.0 + 4.5 + 1.5 = 7.0 ns. F_max = 1 / 7.0 ns = 142.85 MHz."
  },
  {
    question: "Which SystemVerilog block is specifically designed to enforce combinational logic synthesis without latch inference?",
    options: ["always_comb", "always @(*)", "always_ff", "always_latch"],
    answer: 0,
    explanation: "always_comb automatically infers complete sensitivity lists and throws compiler warnings if any path leaves a signal unassigned (latch inference)."
  },
  {
    question: "What is the primary function of an Isolation Cell when interfacing a power-gated domain with an always-on domain?",
    options: [
      "Prevents floating/undefined X-states from propagating into the always-on domain",
      "Speeds up data transfers across power domains",
      "Provides clock frequency division",
      "Stores flip-flop state during deep sleep"
    ],
    answer: 0,
    explanation: "When a domain powers off, its outputs float. Isolation cells clamp these outputs to a steady 0 or 1 to prevent high short-circuit current in receiving gates."
  },
  {
    question: "In AMBA AXI4 protocol, which channel handles write completion acknowledgments from slave to master?",
    options: ["Write Response Channel (B)", "Write Data Channel (W)", "Write Address Channel (AW)", "Read Response Channel (R)"],
    answer: 0,
    explanation: "The B channel (Write Response) conveys BRESP status (OKAY, EXOKAY, SLVERR, DECERR) back to the master once write transaction completes."
  },
  {
    question: "In UVM verification methodology, which UVM phase executes top-down in zero simulation time?",
    options: ["build_phase", "connect_phase", "run_phase", "report_phase"],
    answer: 0,
    explanation: "build_phase executes top-down in zero simulation time to construct component hierarchies using factory allocations."
  },
  {
    question: "Hold time violations in an ASIC physical design are typically resolved by doing which of the following?",
    options: [
      "Inserting delay buffers in the data path",
      "Decreasing the operational clock frequency",
      "Increasing the supply voltage VDD",
      "Replacing data path gates with High-Drive LVT cells"
    ],
    answer: 0,
    explanation: "Hold violations mean data arrived too quickly. Adding non-inverting delay buffers into the data path increases path delay without affecting setup slack."
  },
  {
    question: "Which boundary scan IEEE standard defines the JTAG 16-state Test Access Port (TAP) controller?",
    options: ["IEEE 1149.1", "IEEE 1500", "IEEE 1800", "IEEE 1364"],
    answer: 0,
    explanation: "IEEE 1149.1 specifies standard Test Access Port (TAP) and boundary-scan architecture for IC testing."
  },
  {
    question: "In static timing analysis, what is Positive Clock Skew?",
    options: [
      "Capture clock edge arrives LATER than Launch clock edge",
      "Capture clock edge arrives EARLIER than Launch clock edge",
      "Clock signal frequency increases dynamically",
      "Data path propagation delay exceeds clock period"
    ],
    answer: 0,
    explanation: "Positive Clock Skew occurs when the clock arrives at the receiving (capture) flip-flop after it arrives at the launching flip-flop."
  },
  {
    question: "In SystemVerilog Assertions (SVA), what does the construct 'req |-> ##2 ack' specify?",
    options: [
      "If req is high, ack MUST be high exactly 2 clock cycles later",
      "req and ack must both be high for 2 cycles",
      "ack is high 2 cycles before req",
      "req repeats 2 times whenever ack is high"
    ],
    answer: 0,
    explanation: "Overlapping implication |-> with cycle delay ##2 asserts that whenever antecedent 'req' is true, consequent 'ack' must hold true 2 clocks later."
  },
  {
    question: "Which cell sizing strategy is applied to slack-rich paths to minimize static leakage power?",
    options: [
      "Replacing Low-Vt (LVT) cells with High-Vt (HVT) cells",
      "Replacing High-Vt (HVT) cells with Ultra-Low-Vt (ULVT) cells",
      "Increasing transistor width W/L ratio",
      "Inserting additional clock buffers"
    ],
    answer: 0,
    explanation: "High-Vt (HVT) cells have higher threshold voltage, resulting in significantly lower sub-threshold leakage power while running slightly slower."
  },
  {
    question: "What is the primary function of a 2-stage D flip-flop synchronizer in single-bit Clock Domain Crossing?",
    options: [
      "Allow metastable state generated at 1st FF to decay before 2nd FF samples",
      "Invert signal phase across clock domains",
      "Double the clock frequency",
      "Provide asynchronous reset filtering"
    ],
    answer: 0,
    explanation: "The 1st FF may enter metastability due to setup/hold violation; giving it a full clock cycle allows the voltage to resolve to a stable 0 or 1 before being captured by the 2nd FF."
  },
  {
    question: "In computer architecture, what type of hazard is a Read-After-Write (RAW) dependency?",
    options: ["Data Hazard", "Control Hazard", "Structural Hazard", "Branch Hazard"],
    answer: 0,
    explanation: "RAW is a true data hazard occurring when an instruction depends on the output of a preceding instruction that has not yet completed execution."
  },
  {
    question: "What is the purpose of an Integrated Clock Gating (ICG) cell latch element?",
    options: [
      "Ensure clock enable only changes while the clock is low to prevent output glitches",
      "Store output data during sleep mode",
      "Multiply input clock frequency by 2",
      "Provide ESD protection at pin pads"
    ],
    answer: 0,
    explanation: "The negative-edge latch inside an ICG freezes the enable signal while clock is high, so the gating AND gate only changes output state when clock is low."
  },
  {
    question: "What is the main advantage of AXI out-of-order transaction completion?",
    options: [
      "Slow memory responses (e.g. DRAM) do not block fast responses (e.g. SRAM/SFRS)",
      "Reduces total bus wire count by 50%",
      "Eliminates clock tree synthesis requirement",
      "Replaces serial SPI interfaces"
    ],
    answer: 0,
    explanation: "Out-of-order IDs allow the interconnect slave to return quick responses for fast memory locations ahead of slow access requests."
  },
  {
    question: "Which command in Synopsys Design Constraints (SDC) is used to specify timing paths that do not need to be optimized for timing?",
    options: ["set_false_path", "set_multicycle_path", "set_max_delay", "set_disable_timing"],
    answer: 0,
    explanation: "set_false_path disables timing checks on paths that cannot occur logically or are between asynchronous clock domains."
  },
  {
    question: "In a PCIe Gen 3 link, what line encoding scheme is used to achieve high bandwidth efficiency?",
    options: ["128b/130b encoding", "8b/10b encoding", "Manchester encoding", "NRZ encoding"],
    answer: 0,
    explanation: "PCIe Gen 1 and 2 use 8b/10b (20% overhead). PCIe Gen 3 and Gen 4 use 128b/130b encoding, reducing overhead to less than 1.5%."
  },
  {
    question: "Which UVM verification component is responsible for translating transaction-level sequence items into pin-level activities?",
    options: ["uvm_driver", "uvm_monitor", "uvm_sequencer", "uvm_agent"],
    answer: 0,
    explanation: "The driver receives transactions from the sequencer and drives the physical pins of the DUT using a virtual interface."
  },
  {
    question: "What does the setup check for a 2-cycle multicycle path do by default in STA tools if no hold multicycle path is specified?",
    options: ["Checks setup at cycle 2 and hold at cycle 1", "Checks setup at cycle 2 and hold at cycle 0", "Checks setup at cycle 1 and hold at cycle 0", "Disables hold check completely"],
    answer: 0,
    explanation: "By default, setting setup multicycle to N cycles moves the setup check to cycle N, and automatically moves the hold check to cycle N-1."
  },
  {
    question: "In SystemVerilog, which keyword is used to declare a variable that is randomized without repeat values in a circular order?",
    options: ["randc", "rand", "random", "const rand"],
    answer: 0,
    explanation: "randc (random-cyclic) randomizes variables such that all possible values are selected once before any value is repeated."
  },
  {
    question: "What is the function of a Multiple-Input Signature Register (MISR) in Logic BIST (LBIST)?",
    options: ["Compresses test response outputs into a single signature", "Generates pseudo-random test patterns", "Controls the clock gating logic", "Stores the test control instructions"],
    answer: 0,
    explanation: "MISR collects the logic outputs of the scan chains and compresses them into a unique signature register to check for faults."
  },
  {
    question: "In AMBA AXI4, what is the width of the transaction ID signals (AWID/ARID) used for?",
    options: ["Enabling out-of-order and interleaving transactions", "Specifying the length of the data burst", "Defining the security status of the bus master", "Dividing the address space into sub-pages"],
    answer: 0,
    explanation: "Transaction IDs allow slaves to complete operations out-of-order and interleave read data beats with different transaction tags."
  },
  {
    question: "Which power reduction technique isolates static leakage by cutting off the power supply completely to a dormant block?",
    options: ["Power Gating", "Clock Gating", "Dynamic Voltage Scaling", "Multi-Vt Sizing"],
    answer: 0,
    explanation: "Power Gating uses header or footer sleep transistors to disconnect the VDD/GND rails, eliminating leakage current completely."
  },
  {
    question: "What does the SystemVerilog constraint operator 'inside' evaluate?",
    options: ["True if a value is within a specified set or range", "True if a class instance is constructed", "The inside temperature of the die", "The scope of local variables inside a class"],
    answer: 0,
    explanation: "The 'inside' operator checks if a variable matches any value in a list or falls within a specified bracket range."
  },
  {
    question: "In JTAG boundary scan, how many TAP controller states are there?",
    options: ["16 states", "8 states", "10 states", "32 states"],
    answer: 0,
    explanation: "The Test Access Port (TAP) controller is a 16-state finite state machine controlled by TMS and TCK signals."
  },
  {
    question: "What is the purpose of a pulse synchronizer in Clock Domain Crossing?",
    options: ["To pass a single-cycle pulse from a fast clock domain to a slow clock domain", "To double the frequency of the input clock", "To clean up static noise on a reset signal", "To synchronize multi-bit data buses without skew"],
    answer: 0,
    explanation: "Pulse synchronizers convert a pulse to a level toggle in the source domain, synchronize it across domains, and then convert it back to a pulse in the destination domain."
  },
  {
    question: "In static timing analysis, what timing path is excluded by using the 'set_disable_timing' command?",
    options: ["It breaks the timing analysis loop on a specific cell pin-to-pin arc", "It lowers the operating frequency of the clock net", "It defines a false path between asynchronous domains", "It forces the tool to check hold timing only"],
    answer: 0,
    explanation: "set_disable_timing disables specific timing arcs inside a cell library (e.g. from input to output of a multiplexer) to break combinational loops."
  },
  {
    question: "Which layer of the PCIe protocol stack is responsible for flow control credit management?",
    options: ["Transaction Layer", "Data Link Layer", "Physical Layer", "Application Layer"],
    answer: 0,
    explanation: "The Transaction Layer manages buffer space advertisements and flow control credits to ensure packets are only sent when the receiver has buffer space."
  },
  {
    question: "In DDR4 memory, what is the primary benefit of Bank Groups?",
    options: ["Reduces access latency by allowing faster back-to-back commands on different groups", "Increases the absolute storage density per chip", "Allows memory modules to run at lower voltage", "Eliminates the need for periodic refreshes"],
    answer: 0,
    explanation: "Accessing different bank groups requires a shorter timing constraint (tCCD_S) compared to the same bank group (tCCD_L), increasing overall bus utilization."
  },
  {
    question: "What does a high IDDQ current value indicate during wafer testing of CMOS digital chips?",
    options: ["Presence of physical leakage defects or gate oxide short-circuits", "The chip is operating at maximum frequency", "The boundary scan chain is operating correctly", "The clock tree has high skew"],
    answer: 0,
    explanation: "Since CMOS gates draw negligible current when quiescent, any elevated IDDQ current indicates shorts, bridges, or manufacturing faults."
  },
  {
    question: "Which UVM component is typically passive and does not instantiate a sequencer or driver?",
    options: ["Passive Agent", "Active Agent", "Scoreboard", "Syllabus Monitor"],
    answer: 0,
    explanation: "A passive agent is configured to only observe bus pins via a monitor. It does not instantiate a driver or sequencer."
  },
  {
    question: "In physical design, which effect describes localized voltage drops caused by high instantaneous switching currents at clock edges?",
    options: ["Dynamic IR Drop", "Static IR Drop", "Electromigration", "Crosstalk Delay"],
    answer: 0,
    explanation: "Dynamic IR drop occurs due to peak current demand (di/dt) when thousands of flip-flops switch simultaneously on the clock edge."
  },
  {
    question: "In JTAG IEEE 1149.1, which boundary scan instruction is used to run internal testing on the chip logic while decoupling the pins?",
    options: ["INTEST", "EXTEST", "BYPASS", "SAMPLE"],
    answer: 0,
    explanation: "INTEST tests the internal logic of the chip by applying vectors to scan cells, while EXTEST tests external board-level connections."
  },
  {
    question: "Which body biasing technique is applied during idle modes to raise Vt and reduce static leakage power?",
    options: ["Reverse Body Biasing (RBB)", "Forward Body Biasing (FBB)", "Dynamic Voltage Scaling (DVS)", "Clock Gating (CG)"],
    answer: 0,
    explanation: "RBB applies a reverse bias voltage to the substrate, increasing the threshold voltage (Vt) to suppress sub-threshold leakage."
  },
  {
    question: "In SystemVerilog, what is the key difference between composition and inheritance?",
    options: ["Composition creates object instances inside a class; inheritance extends a class", "Inheritance allows objects to be clean-compiled; composition does not", "Composition is used only for structs; inheritance is for modules", "There is no difference in class structures"],
    answer: 0,
    explanation: "Inheritance defines an IS-A relationship by extending classes. Composition defines a HAS-A relationship by instantiating modular components within a class."
  }
];

VLSIData.interviews.quizzes = [
  {
    question: "Which of the following causes a setup time violation in a synchronous timing path?",
    options: [
      "Data path delay + T_su + T_cq > T_clk + T_skew",
      "Data path delay < T_hold + T_skew",
      "Clock frequency is reduced below 1 MHz",
      "Reset signal remains asserted during clock edge"
    ],
    answer: 0,
    explanation: "Setup violation occurs when total launch + combinational + setup delay exceeds the effective clock period available."
  },
  {
    question: "What is the Gray code representation of decimal value 6 (4-bit binary 0110)?",
    options: ["0101", "0111", "0011", "1010"],
    answer: 0,
    explanation: "Binary 0110 to Gray: G[3]=B[3]=0, G[2]=B[3]^B[2]=0^1=1, G[1]=B[2]^B[1]=1^1=0, G[0]=B[1]^B[0]=1^0=1. Result: 0101."
  },
  {
    question: "What happens if a design contains an un-gated combinational loop (e.g. assign y = ~y & en)?",
    options: [
      "The simulator or hardware oscillates rapidly, creating an unconstrained ring oscillator",
      "The compiler automatically inserts a flip-flop to break the loop",
      "Setup slack becomes infinitely positive",
      "The signal resolves silently to 0"
    ],
    answer: 0,
    explanation: "Combinational loops cause infinite timing loops in STA tools and race conditions/oscillations in simulation and physical silicon."
  },
  {
    question: "Why is Gray code preferred over Binary count for cross-domain FIFO pointers?",
    options: [
      "Only 1 bit changes per increment, avoiding multi-bit sample race conditions",
      "Gray code uses fewer flip-flops than binary counters",
      "Gray code allows higher clock frequencies than binary",
      "Gray code eliminates the need for write enable signals"
    ],
    answer: 0,
    explanation: "Multi-bit binary transitions (e.g. 0111 -> 1000 where 4 bits change simultaneously) can cause severe CDC sampling errors if bits arrive with slightly different delays."
  },
  {
    question: "In a 2-stage D flip-flop synchronizer, what is the primary role of the second flip-flop?",
    options: [
      "Allows the output of the first flip-flop 1 full clock period to resolve any metastability before capture",
      "Inverts the polarity of the input signal",
      "Multiplies the input signal frequency",
      "Stores data permanently during power-down"
    ],
    answer: 0,
    explanation: "The 1st FF may enter a metastable state if setup/hold is violated. The 2nd FF captures the 1st FF's output after 1 full clock cycle, by which time metastability has decayed exponentially to a clean 0 or 1."
  },
  {
    question: "What is the purpose of CRPR (Clock Reconvergence Pessimism Removal) in STA?",
    options: [
      "Removes artificial timing pessimism caused by using different derate factors on common clock tree paths",
      "Increases hold time margin across all registers",
      "Eliminates the need for setup checks on multicycle paths",
      "Calculates maximum dynamic power dissipation"
    ],
    answer: 0,
    explanation: "Common clock tree branches physically experience identical delays for launch and capture clocks; CRPR credits back the artificial delay difference imposed by min/max derate timing analysis."
  },
  {
    question: "In SystemVerilog UVM, what is the difference between uvm_component and uvm_object?",
    options: [
      "uvm_component exists throughout the entire simulation and has a structural hierarchy (e.g. Driver, Monitor); uvm_object is transient (e.g. Sequence Item, Packet)",
      "uvm_object cannot be randomized",
      "uvm_component is used only for signal logging",
      "There is no functional difference"
    ],
    answer: 0,
    explanation: "uvm_components are static structural entities constructed during build_phase; uvm_objects are transient transaction data packets created dynamically during run_phase."
  },
  {
    question: "Which AMBA APB signal indicates the second phase (Access phase) of an APB bus transfer?",
    options: ["PENABLE", "PSEL", "PREADY", "PSLVERR"],
    answer: 0,
    explanation: "PSEL asserts during Setup phase; PENABLE asserts during Access phase to signal the second clock cycle of the APB transfer."
  },
  {
    question: "What is an Antenna Diode used for in physical layout?",
    options: [
      "Provides a discharge path to ground to protect gate oxide from plasma charge accumulation during etching",
      "Improves RF antenna transmission power",
      "Acts as a decoupling capacitor for power grid spikes",
      "Stores flip-flop state during deep power down"
    ],
    answer: 0,
    explanation: "Antenna diodes are connected near input transistor gates in reverse bias so excess electrostatic charges accumulated during plasma etching bleed safely to GND."
  },
  {
    question: "What is the difference between a Mealy FSM and a Moore FSM?",
    options: [
      "Mealy outputs depend on current state AND inputs; Moore outputs depend ONLY on current state",
      "Moore outputs depend on inputs; Mealy outputs do not",
      "Mealy FSMs cannot have reset inputs",
      "Moore FSMs use fewer states than Mealy FSMs for sequence detection"
    ],
    answer: 0,
    explanation: "In a Mealy state machine, outputs react immediately to input changes within the same clock cycle; in a Moore state machine, outputs are strictly a function of current state."
  },
  {
    question: "Which SVA assertion operator is used to specify that a condition must remain true continuously over a range of cycles?",
    options: ["throughout", "within", "intersect", "and"],
    answer: 0,
    explanation: "The 'throughout' operator specifies that a boolean expression must be true during the execution of a sequence."
  },
  {
    question: "In STA, what is the name of the process that adjusts launch and capture paths for common clock buffers?",
    options: ["CRPR (Clock Reconvergence Pessimism Removal)", "OCV (On-Chip Variation) Derating", "CTS (Clock Tree Synthesis) Balancing", "DMSA (Direct Multi-Scenario Analysis)"],
    answer: 0,
    explanation: "CRPR removes timing pessimism that arises when common clock path buffers are calculated with max delay for launch and min delay for capture."
  },
  {
    question: "Which AMBA APB signal indicates that a slave has completed a transfer phase?",
    options: ["PREADY", "PENABLE", "PSEL", "PSLVERR"],
    answer: 0,
    explanation: "PREADY is driven by the slave to signal the completion of an access phase, extending it if pulled low."
  },
  {
    question: "In a CMOS inverter, what is the state of the PMOS and NMOS transistors when the input is at VDD?",
    options: ["PMOS is Off, NMOS is On", "PMOS is On, NMOS is Off", "Both are On", "Both are Off"],
    answer: 0,
    explanation: "When input is High (VDD), PMOS gate-source voltage is 0 (Off), and NMOS gate-source voltage is VDD (On), pulling output to GND."
  },
  {
    question: "In low-power design, what is the role of a Level Shifter?",
    options: ["Translates signal voltage amplitudes between different voltage domains", "Changes clock frequency ratios", "Buffers signals crossing asynchronous clocks", "Adjusts threshold voltage levels during synthesis"],
    answer: 0,
    explanation: "Level shifters translate signals from a low-voltage domain to a high-voltage domain (or vice versa) to prevent leakage current and gate damage."
  },
  {
    question: "What is the purpose of the 'super.new(name)' call in a UVM component constructor?",
    options: ["Invokes the parent class constructor to initialize UVM base properties", "Allocates the component memory in the factory", "Registers the class string in the database", "Starts the build phase execution"],
    answer: 0,
    explanation: "Calling 'super.new' runs the base class constructor (like uvm_component) to configure hierarchy paths and base configurations."
  },
  {
    question: "In physical design, which step must be executed before Clock Tree Synthesis (CTS)?",
    options: ["Placement", "Routing", "Design Rule Checking (DRC)", "Parasitic Extraction (RC)"],
    answer: 0,
    explanation: "Transistors must be placed in their physical locations (Placement) before building the clock trees (CTS) and routing signal wires."
  },
  {
    question: "Which test pattern type is generated by ATPG to detect delay-related faults on physical silicon?",
    options: ["At-Speed Transition patterns", "Stuck-At DC patterns", "IDDQ Leakage patterns", "Boundary scan bypass patterns"],
    answer: 0,
    explanation: "At-Speed transition patterns use double clock pulses to detect transitions that are slow-to-rise or slow-to-fall."
  },
  {
    question: "In a FIFO design, what condition is indicated when the write pointer equals the read pointer?",
    options: ["Either Empty or Full (depends on index tracking)", "Always Empty", "Always Full", "Overflow condition"],
    answer: 0,
    explanation: "When pointers are equal, the FIFO is either completely empty (write caught up to read) or completely full (write wrapped around to read)."
  },
  {
    question: "What does the term 'IR Drop' refer to in power network analysis?",
    options: [
      "Voltage drop along the power grid due to wire resistance and current flow",
      "The decay rate of dynamic clock frequencies",
      "Leakage current flow in PMOS transistors",
      "The temperature coefficient of silicon substrates"
    ],
    answer: 0,
    explanation: "IR drop is the voltage degradation across power distribution networks (V_drop = I * R) due to wire resistance (R) and switching current load (I)."
  },
  {
    question: "What is the primary role of a DLL (Delay-Locked Loop) in a high-speed memory controller?",
    options: ["Aligns the phase of the clock signal with the data signal to maximize timing windows", "Generates higher clock frequencies from a low-frequency reference", "Maintains charge on DRAM capacitors during refresh cycles", "Protects the interface lines against electrostatic discharge"],
    answer: 0,
    explanation: "A DLL inserts variable delay into a clock path to align its phase exactly with the data path, compensating for PVT variation."
  },
  {
    question: "Which SDC timing constraint is used to define clock uncertainty due to jitter and skew?",
    options: ["set_clock_uncertainty", "set_clock_latency", "set_clock_transition", "set_input_delay"],
    answer: 0,
    explanation: "set_clock_uncertainty models clock jitter, skew, and timing margins, reducing the available setup timing window during synthesis."
  },
  {
    question: "Which AMBA AXI4 channel is used to convey read data from the memory slave to the master?",
    options: ["Read Data Channel (R)", "Read Address Channel (AR)", "Write Response Channel (B)", "Write Data Channel (W)"],
    answer: 0,
    explanation: "The R channel (Read Data) transfers both read data and read status responses (RRESP) back to the master."
  },
  {
    question: "What type of FSM output transition depends ONLY on the current state of the state machine?",
    options: ["Moore FSM output", "Mealy FSM output", "Asynchronous state output", "Latch-based output"],
    answer: 0,
    explanation: "Moore outputs depend strictly on the current state flip-flop values, shielding outputs from direct combinational input changes."
  },
  {
    question: "Which UVM component class receives sequence items from the sequencer and converts them to pin actions?",
    options: ["uvm_driver", "uvm_monitor", "uvm_agent", "uvm_env"],
    answer: 0,
    explanation: "The driver acts as the interface translator, pulling sequence items and driving physical interface pins."
  },
  {
    question: "What layout guard strategy is used in physical design to prevent CMOS latch-up?",
    options: ["Substrate/Well taps and guard rings", "Dummy metal fill", "Antenna diodes", "LVT cell swaps"],
    answer: 0,
    explanation: "Substrate taps collect stray minority carriers, preventing the formation of parasitic bipolar latch circuits."
  },
  {
    question: "Which DFT structure stitches normal register cells into long shift register paths for testing?",
    options: ["Scan Chain", "Boundary Scan TAP", "BIST generator", "Test wrapper"],
    answer: 0,
    explanation: "Scan chains stitch scan flip-flops together to form serial shift registers, allowing full controllability of internal nodes."
  },
  {
    question: "Which Low Power design element is used to retain register values when power to a domain is cut off?",
    options: ["Retention Flip-Flop", "Level Shifter", "Isolation Cell", "Sleep Transistor"],
    answer: 0,
    explanation: "Retention registers contain an always-on auxiliary latch that holds the state of the flip-flop when the main power rails are cut."
  },
  {
    question: "What is the primary objective of Clock Tree Synthesis (CTS)?",
    options: ["Minimize clock skew and latency across the chip", "Invert reset trees to prevent timing glitches", "Route signal lines away from noise sources", "Insert decoupling capacitors next to cells"],
    answer: 0,
    explanation: "CTS builds balanced buffer distribution systems to minimize clock skew (arrival differences) and clock latency (insertion delay)."
  },
  {
    question: "What is the function of the LCRC (Link Cyclic Redundancy Check) in PCIe?",
    options: ["Provides error detection for Transaction Layer Packets at the Data Link Layer", "Performs line encoding conversions", "Manages the link power state transition", "Coordinates routing tables inside switches"],
    answer: 0,
    explanation: "LCRC is added at the Data Link Layer to ensure transmission integrity. If a CRC mismatch is detected, the receiver requests a retransmission (NAK)."
  }
];
