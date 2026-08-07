/* Interview Prep View - Re-engineered Interactive 3D Flashcards Studio & Career Tracker */

let activeFlashcardIdx = 0;
let activeMcqQuestIdx = 0;
let activeQuizQuestIdx = 0;
let activeDomainFilter = "All Domains";
let masteredCards = new Set();
let isCardFlipped = false;
let audioCtx = null;
let isDeckShuffled = false;
let shuffledCardsList = [];

function playSound(type) {
  try {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    if (audioCtx.state === "suspended") audioCtx.resume();
    
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    
    if (type === "flip") {
      osc.type = "sine";
      osc.frequency.setValueAtTime(280, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(560, audioCtx.currentTime + 0.08);
      gain.gain.setValueAtTime(0.12, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.08);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.08);
    } else if (type === "mastered") {
      osc.type = "triangle";
      osc.frequency.setValueAtTime(523.25, audioCtx.currentTime);
      osc.frequency.setValueAtTime(659.25, audioCtx.currentTime + 0.09);
      osc.frequency.setValueAtTime(783.99, audioCtx.currentTime + 0.18);
      gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.3);
    }
  } catch (e) {}
}

function getCardDomain(idx) {
  if (idx < 8) return "RTL & Verilog";
  if (idx < 16) return "STA & Physical Design";
  if (idx < 24) return "Verification & UVM";
  if (idx < 30) return "Protocols & Arch";
  return "DFT & Low Power";
}

function getFilteredFlashcards() {
  const allCards = VLSIData.interviews.flashcards || [];
  let mapped = allCards.map((c, originalIdx) => ({ ...c, originalIdx }));
  
  if (activeDomainFilter !== "All Domains") {
    mapped = mapped.filter(c => getCardDomain(c.originalIdx) === activeDomainFilter);
  }
  
  if (isDeckShuffled) {
    return shuffledCardsList;
  }
  return mapped;
}

window.renderInterviews = function() {
  const container = document.getElementById("view-container");
  if (!container) return;

  const filteredCards = getFilteredFlashcards();
  if (activeFlashcardIdx >= filteredCards.length) {
    activeFlashcardIdx = 0;
  }

  const currentCard = filteredCards[activeFlashcardIdx] || { q: "No flashcards found.", a: "", originalIdx: 0 };
  const cardDomain = getCardDomain(currentCard.originalIdx);
  const isMastered = masteredCards.has(currentCard.originalIdx);

  const totalCards = VLSIData.interviews.flashcards.length;
  const masteredCount = masteredCards.size;
  const masteryPercent = Math.round((masteredCount / totalCards) * 100);

  const mcqs = VLSIData.interviews.mcqs || [];
  const quizzes = VLSIData.interviews.quizzes || [];

  // Determine Silicon Career Rank
  let careerRank = "Silicon Apprentice";
  let rankColor = "text-cyan-400 border-cyan-500/20 bg-cyan-950/20";
  if (AppState.user.xp >= 600) {
    careerRank = "ASIC Principal Architect";
    rankColor = "text-rose-400 border-rose-500/20 bg-rose-950/20";
  } else if (AppState.user.xp >= 300) {
    careerRank = "Verification Specialist";
    rankColor = "text-purple-400 border-purple-500/20 bg-purple-950/20";
  } else if (AppState.user.xp >= 100) {
    careerRank = "Junior RTL Designer";
    rankColor = "text-blue-400 border-blue-500/20 bg-blue-950/20";
  }

  const domains = ["All Domains", "RTL & Verilog", "STA & Physical Design", "Verification & UVM", "Protocols & Arch", "DFT & Low Power"];

  container.innerHTML = `
    <!-- Inline 3D Parallax & Depth Styles -->
    <style>
      .perspective-stage {
        perspective: 1200px;
      }
      .flip-card-inner {
        transition: transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
        transform-style: preserve-3d;
      }
      .flip-card-inner.flipped {
        transform: rotateY(180deg) !important;
      }
      .flip-card-front, .flip-card-back {
        backface-visibility: hidden;
        -webkit-backface-visibility: hidden;
      }
      .flip-card-back {
        transform: rotateY(180deg);
      }
      .deck-shadow-1 {
        transform: translateY(12px) scale(0.95);
        opacity: 0.5;
        filter: blur(2px);
      }
      .deck-shadow-2 {
        transform: translateY(22px) scale(0.90);
        opacity: 0.25;
        filter: blur(4px);
      }
      @keyframes pulseGlow {
        0%, 100% { box-shadow: 0 0 20px rgba(59, 130, 246, 0.3); }
        50% { box-shadow: 0 0 35px rgba(59, 130, 246, 0.6); }
      }
      .active-3d-glow {
        animation: pulseGlow 3s infinite ease-in-out;
      }
    </style>

    <div class="max-w-7xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-4 gap-8">
      <!-- Left sidebar career tracker -->
      <div class="lg:col-span-1 flex flex-col gap-6">
        <div class="glass-panel p-5 rounded-2xl border-white/5 flex flex-col gap-4">
          <h3 class="font-heading font-extrabold text-sm text-white flex items-center justify-between">
            <span>Career Rank</span>
            <i class="fa-solid fa-trophy text-amber-400 text-xs"></i>
          </h3>
          <div class="flex flex-col items-center text-center p-4 bg-slate-950/40 border border-white/5 rounded-xl">
            <div class="w-16 h-16 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-650 flex items-center justify-center text-white text-2xl mb-3 shadow-lg shadow-blue-500/20">
              <i class="fa-solid fa-graduation-cap"></i>
            </div>
            <span class="text-[10px] uppercase font-mono tracking-widest text-gray-500 mb-1">Current Title</span>
            <strong class="text-xs px-3 py-1 rounded-full border ${rankColor} font-bold font-mono tracking-wide">${careerRank}</strong>
          </div>
          <div class="flex flex-col gap-2 mt-1">
            <div class="flex justify-between text-[11px] font-mono text-gray-400">
              <span>Experience Points</span>
              <span class="text-blue-400 font-bold">${AppState.user.xp} XP</span>
            </div>
            <div class="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden border border-white/5">
              <div class="bg-blue-500 h-full" style="width: ${Math.min(100, (AppState.user.xp / 800) * 100)}%"></div>
            </div>
          </div>
        </div>

        <!-- Mastery Progress Box -->
        <div class="glass-panel p-5 rounded-2xl border-white/5 flex flex-col gap-3">
          <h4 class="text-xs font-heading font-bold text-gray-300 flex justify-between items-center">
            <span>Flashcard Mastery</span>
            <span class="text-emerald-400 font-mono text-[11px]">${masteryPercent}%</span>
          </h4>
          <div class="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-white/5">
            <div class="bg-gradient-to-r from-emerald-500 to-cyan-400 h-full transition-all duration-500" style="width: ${masteryPercent}%"></div>
          </div>
          <div class="flex justify-between items-center text-[10px] font-mono text-gray-400 mt-1">
            <span>Mastered: <strong class="text-white">${masteredCount}</strong></span>
            <span>Total: <strong class="text-white">${totalCards}</strong></span>
          </div>
        </div>
      </div>

      <!-- Right Area: Content tabs -->
      <div class="lg:col-span-3 flex flex-col gap-6">
        <!-- Sub-tabs header -->
        <div class="border-b border-white/5 flex gap-6 justify-start">
          <button onclick="switchPrepTab('flashcards')" id="tab-p-flashcards" class="prep-tab-btn pb-3 text-xs font-heading font-bold text-blue-400 border-b-2 border-blue-400 px-1">
            <i class="fa-solid fa-layer-group mr-1.5 text-blue-400"></i> Interactive 3D Flashcards (${filteredCards.length})
          </button>
          <button onclick="switchPrepTab('mcqs')" id="tab-p-mcqs" class="prep-tab-btn pb-3 text-xs font-heading font-bold text-gray-500 border-b-2 border-transparent hover:text-gray-300 px-1">
            <i class="fa-solid fa-list-check mr-1.5 text-gray-500"></i> ASIC MCQs (${mcqs.length})
          </button>
          <button onclick="switchPrepTab('quizzes')" id="tab-p-quizzes" class="prep-tab-btn pb-3 text-xs font-heading font-bold text-gray-500 border-b-2 border-transparent hover:text-gray-300 px-1">
            <i class="fa-solid fa-brain mr-1.5 text-gray-500"></i> Challenge Quizzes (${quizzes.length})
          </button>
        </div>

        <div class="min-h-[50vh] mt-1">
          <!-- 1. 3D Flashcard studio -->
          <div id="prep-content-flashcards" class="prep-content flex flex-col gap-6">
            <!-- Domain Filter Chips -->
            <div class="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              ${domains.map(d => `
                <button onclick="setFlashcardDomain('${d}')" class="px-3 py-1.5 rounded-xl border text-[11px] font-mono whitespace-nowrap transition-all ${
                  activeDomainFilter === d 
                    ? 'bg-blue-600/20 border-blue-500/40 text-blue-300 font-bold shadow-lg shadow-blue-500/10' 
                    : 'bg-[#0b0f19] border-white/5 text-gray-400 hover:text-gray-200 hover:bg-white/5'
                }">
                  ${d}
                </button>
              `).join("")}
            </div>

            <div class="flex flex-col items-center gap-6 max-w-lg mx-auto w-full">
              <!-- Top bar controls & indicator -->
              <div class="w-full flex justify-between items-center text-xs font-mono text-gray-400 bg-[#0b0f19] px-4 py-2 rounded-xl border border-white/5">
                <div class="flex items-center gap-2">
                  <span class="text-gray-500">Card</span>
                  <input type="number" min="1" max="${filteredCards.length}" value="${activeFlashcardIdx + 1}" onchange="jumpToFlashcard(this.value)" class="w-12 bg-slate-950 border border-white/10 rounded px-1 text-center text-white focus:outline-none focus:border-blue-500 font-bold">
                  <span class="text-gray-500">of ${filteredCards.length}</span>
                </div>

                <div class="flex items-center gap-3">
                  <span class="px-2 py-0.5 rounded text-[10px] bg-blue-950/40 border border-blue-500/20 text-blue-400 font-bold">${cardDomain}</span>
                  ${isMastered ? '<span class="px-2 py-0.5 rounded text-[10px] bg-emerald-950/40 border border-emerald-500/20 text-emerald-400 font-bold"><i class="fa-solid fa-check mr-1"></i>Mastered</span>' : ''}
                </div>
              </div>

              <!-- 3D Perspective Stage with Stacked Cards -->
              <div class="perspective-stage w-full relative h-72">
                <!-- Stacked background depth cards -->
                <div class="absolute inset-0 w-full h-full rounded-2xl border border-white/5 bg-slate-950/80 deck-shadow-2 pointer-events-none"></div>
                <div class="absolute inset-0 w-full h-full rounded-2xl border border-white/10 bg-slate-900/40 deck-shadow-1 pointer-events-none"></div>

                <!-- Primary Interactive 3D Card -->
                <div 
                  id="flip-card-viewport" 
                  onclick="flip3DCard()" 
                  onmousemove="handleCard3DMouseMove(event, this)" 
                  onmouseleave="handleCard3DMouseLeave(this)"
                  class="absolute inset-0 w-full h-full cursor-pointer select-none rounded-2xl active-3d-glow transition-shadow duration-300"
                >
                  <div class="flip-card-inner relative w-full h-full text-center ${isCardFlipped ? 'flipped' : ''}"
                       style="transform: ${isCardFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)'};">
                     
                     <!-- Front: Question -->
                     <div class="flip-card-front absolute inset-0 w-full h-full p-8 flex flex-col items-center justify-between border border-white/15 bg-gradient-to-b from-slate-900/90 to-[#070b15] shadow-2xl rounded-2xl backdrop-blur-md ${isCardFlipped ? 'pointer-events-none' : ''}">
                       <div class="w-full flex justify-between items-center text-[10px] font-mono text-blue-400 border-b border-white/5 pb-3">
                         <span class="uppercase tracking-widest font-extrabold flex items-center gap-1.5">
                           <i class="fa-solid fa-circle-question text-blue-400"></i> VLSI Interview Question
                         </span>
                         <span class="text-blue-400 font-bold bg-blue-950/60 px-2 py-0.5 rounded border border-blue-500/30">Click to Flip 🔄</span>
                       </div>

                       <div class="my-auto px-2">
                         <p class="text-sm font-semibold text-white leading-relaxed font-sans">${currentCard.q}</p>
                       </div>

                       <div class="w-full pt-3 border-t border-white/5 flex items-center justify-center gap-2 text-[11px] font-mono">
                         <button onclick="event.stopPropagation(); flip3DCard();" class="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl shadow transition-all flex items-center gap-1.5">
                           <i class="fa-solid fa-eye"></i> Click to Reveal Answer
                         </button>
                       </div>
                     </div>

                     <!-- Back: Answer & Mastered Trigger -->
                     <div class="flip-card-back absolute inset-0 w-full h-full p-8 flex flex-col items-center justify-between border border-white/15 bg-gradient-to-b from-blue-950/40 via-slate-900 to-[#070b15] shadow-2xl rounded-2xl backdrop-blur-md ${!isCardFlipped ? 'pointer-events-none' : ''}">
                      <div class="w-full flex justify-between items-center text-[10px] font-mono text-emerald-400 border-b border-white/5 pb-3">
                        <span class="uppercase tracking-widest font-extrabold flex items-center gap-1.5">
                          <i class="fa-solid fa-square-check text-emerald-400"></i> Verified Industry Solution
                        </span>
                        <button onclick="event.stopPropagation(); flip3DCard();" class="text-gray-400 hover:text-white font-bold bg-slate-950 px-2 py-0.5 rounded border border-white/10">Show Question 🔄</button>
                      </div>

                      <div class="my-auto px-2 overflow-y-auto max-h-36 scrollbar-none w-full" onclick="event.stopPropagation()">
                        <div class="text-xs text-emerald-300 leading-relaxed font-sans text-left bg-slate-950/80 p-4 rounded-xl border border-emerald-500/20 font-mono">
                          <strong class="text-white block mb-1.5 text-[11px]">SOLVER EXPLANATION:</strong>
                          ${currentCard.a}
                        </div>
                      </div>

                      <div class="w-full pt-3 border-t border-white/5 flex items-center justify-center gap-3" onclick="event.stopPropagation()">
                        <button onclick="markCardMastered(${currentCard.originalIdx})" class="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-mono font-bold text-xs rounded-xl shadow-lg shadow-emerald-600/20 transition-all flex items-center gap-1.5 hover:scale-105 active:scale-95">
                          <i class="fa-solid fa-check"></i> Mastered (+10 XP)
                        </button>
                        <button onclick="nextPrepCard()" class="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-gray-300 font-mono text-xs rounded-xl transition-all">
                          Need Review
                        </button>
                      </div>
                    </div>

                  </div>
                </div>
              </div>

              <!-- Deck Control Buttons -->
              <div class="flex items-center gap-3 mt-2 w-full justify-between">
                <button onclick="prevPrepCard()" class="px-5 py-2.5 bg-[#0b0f19] border border-white/10 hover:border-blue-500/40 text-xs font-bold text-gray-300 hover:text-white rounded-xl transition-all flex items-center gap-2 hover:-translate-x-1">
                  <i class="fa-solid fa-arrow-left text-xs text-blue-400"></i> Previous Card
                </button>

                <button onclick="shuffleFlashcardDeck()" class="px-4 py-2.5 bg-slate-900 border border-white/10 hover:border-purple-500/40 text-xs font-bold text-purple-400 hover:text-purple-300 rounded-xl transition-all flex items-center gap-1.5">
                  <i class="fa-solid fa-shuffle text-xs"></i> Shuffle Deck
                </button>

                <button onclick="nextPrepCard()" class="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-blue-500/20 transition-all flex items-center gap-2 hover:translate-x-1">
                  Next Card <i class="fa-solid fa-arrow-right text-xs"></i>
                </button>
              </div>
            </div>
          </div>

          <!-- 2. MCQ Panel -->
          <div id="prep-content-mcqs" class="prep-content hidden max-w-2xl mx-auto">
            <div class="glass-panel p-6 rounded-2xl border-white/5">
              <div class="flex justify-between items-center mb-5">
                <span class="text-[9px] text-blue-400 font-bold uppercase tracking-widest font-mono">Multiple Choice MCQ</span>
                <div class="flex items-center gap-2 text-[10px] text-gray-500 font-mono">
                  <span>Q.</span>
                  <input type="number" min="1" max="${mcqs.length}" value="${activeMcqQuestIdx + 1}" onchange="jumpToMcq(this.value)" class="w-12 bg-slate-950 border border-white/10 rounded px-1 text-center text-white focus:outline-none">
                  <span>of ${mcqs.length}</span>
                </div>
              </div>
              <p class="text-xs font-semibold text-white mb-6 leading-relaxed font-sans">${mcqs[activeMcqQuestIdx].question}</p>
              <div class="flex flex-col gap-3">
                ${mcqs[activeMcqQuestIdx].options.map((opt, oIdx) => `
                  <button onclick="evaluateMcqSelection(${oIdx})" class="text-left w-full px-4 py-3.5 rounded-xl border border-white/5 bg-slate-900/40 hover:bg-slate-800/60 text-xs text-gray-300 hover:text-white flex items-center gap-3 transition-all hover:translate-x-1">
                    <span class="w-6 h-6 rounded-full bg-slate-950 border border-white/10 flex items-center justify-center text-[10px] font-bold text-gray-500">${String.fromCharCode(65 + oIdx)}</span>
                    <span class="flex-grow">${opt}</span>
                  </button>
                `).join("")}
              </div>
              <div id="mcq-prep-feedback" class="mt-4 p-4 rounded-xl text-xs font-mono hidden border"></div>
              <div class="flex justify-between items-center mt-6 pt-4 border-t border-white/5">
                <span class="text-[10px] text-gray-500 font-mono">Select answer to verify</span>
                <div class="flex gap-2">
                  <button onclick="prevMcqQuestion()" class="px-4 py-2 bg-[#0b0f19] border border-white/10 text-xs text-gray-400 rounded-xl hover:text-white">Previous</button>
                  <button onclick="nextMcqQuestion()" class="px-4 py-2 bg-[#0b0f19] border border-white/10 text-xs text-gray-400 rounded-xl hover:text-white">Next</button>
                </div>
              </div>
            </div>
          </div>

          <!-- 3. Syllabus Quizzes Panel -->
          <div id="prep-content-quizzes" class="prep-content hidden max-w-2xl mx-auto">
            <div class="glass-panel p-6 rounded-2xl border-white/5">
              <div class="flex justify-between items-center mb-5">
                <span class="text-[9px] text-blue-400 font-bold uppercase tracking-widest font-mono">Syllabus Challenge Quiz</span>
                <div class="flex items-center gap-2 text-[10px] text-gray-500 font-mono">
                  <span>Q.</span>
                  <input type="number" min="1" max="${quizzes.length}" value="${activeQuizQuestIdx + 1}" onchange="jumpToQuiz(this.value)" class="w-12 bg-slate-950 border border-white/10 rounded px-1 text-center text-white focus:outline-none">
                  <span>of ${quizzes.length}</span>
                </div>
              </div>
              <p class="text-xs font-semibold text-white mb-6 leading-relaxed font-sans">${quizzes[activeQuizQuestIdx].question}</p>
              <div class="flex flex-col gap-3">
                ${quizzes[activeQuizQuestIdx].options.map((opt, oIdx) => `
                  <button onclick="evaluateQuizSelection(${oIdx})" class="text-left w-full px-4 py-3.5 rounded-xl border border-white/5 bg-slate-900/40 hover:bg-slate-800/60 text-xs text-gray-300 hover:text-white flex items-center gap-3 transition-all hover:translate-x-1">
                    <span class="w-6 h-6 rounded-full bg-slate-950 border border-white/10 flex items-center justify-center text-[10px] font-bold text-gray-500">${String.fromCharCode(65 + oIdx)}</span>
                    <span class="flex-grow">${opt}</span>
                  </button>
                `).join("")}
              </div>
              <div id="quiz-prep-feedback" class="mt-4 p-4 rounded-xl text-xs font-mono hidden border"></div>
              <div class="flex justify-between items-center mt-6 pt-4 border-t border-white/5">
                <span class="text-[10px] text-gray-500 font-mono">Select answer to verify</span>
                <div class="flex gap-2">
                  <button onclick="prevQuizQuestion()" class="px-4 py-2 bg-[#0b0f19] border border-white/10 text-xs text-gray-400 rounded-xl hover:text-white">Previous</button>
                  <button onclick="nextQuizQuestion()" class="px-4 py-2 bg-[#0b0f19] border border-white/10 text-xs text-gray-400 rounded-xl hover:text-white">Next</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
};

window.switchPrepTab = function(tabId) {
  document.querySelectorAll(".prep-tab-btn").forEach(btn => {
    btn.classList.remove("text-blue-400", "border-blue-400");
    btn.classList.add("text-gray-500", "border-transparent");
  });
  document.querySelectorAll(".prep-content").forEach(c => c.classList.add("hidden"));

  const targetTab = document.getElementById(`tab-p-${tabId}`);
  const targetContent = document.getElementById(`prep-content-${tabId}`);
  if (targetTab && targetContent) {
    targetTab.classList.remove("text-gray-500", "border-transparent");
    targetTab.classList.add("text-blue-400", "border-blue-400");
    targetContent.classList.remove("hidden");
  }
};

window.setFlashcardDomain = function(domain) {
  activeDomainFilter = domain;
  isDeckShuffled = false;
  activeFlashcardIdx = 0;
  isCardFlipped = false;
  renderInterviews();
};

window.jumpToFlashcard = function(val) {
  const filtered = getFilteredFlashcards();
  const parsed = parseInt(val) - 1;
  if (parsed >= 0 && parsed < filtered.length) {
    activeFlashcardIdx = parsed;
    isCardFlipped = false;
    renderInterviews();
  }
};

window.jumpToMcq = function(val) {
  const parsed = parseInt(val) - 1;
  if (parsed >= 0 && parsed < VLSIData.interviews.mcqs.length) {
    activeMcqQuestIdx = parsed;
    renderInterviews();
    switchPrepTab("mcqs");
  }
};

window.jumpToQuiz = function(val) {
  const parsed = parseInt(val) - 1;
  if (parsed >= 0 && parsed < VLSIData.interviews.quizzes.length) {
    activeQuizQuestIdx = parsed;
    renderInterviews();
    switchPrepTab("quizzes");
  }
};

window.flip3DCard = function() {
  isCardFlipped = !isCardFlipped;
  playSound("flip");
  
  const inner = document.querySelector(".flip-card-inner");
  const front = document.querySelector(".flip-card-front");
  const back = document.querySelector(".flip-card-back");
  
  if (inner && front && back) {
    if (isCardFlipped) {
      inner.classList.add("flipped");
      front.classList.add("pointer-events-none");
      back.classList.remove("pointer-events-none");
    } else {
      inner.classList.remove("flipped");
      inner.style.transform = "rotateX(0deg) rotateY(0deg) scale(1)";
      front.classList.remove("pointer-events-none");
      back.classList.add("pointer-events-none");
    }
  }
};

window.handleCard3DMouseMove = function(e, cardEl) {
  if (isCardFlipped) return;
  const rect = cardEl.getBoundingClientRect();
  const x = e.clientX - rect.left - rect.width / 2;
  const y = e.clientY - rect.top - rect.height / 2;
  const rotateX = (-y / rect.height) * 14;
  const rotateY = (x / rect.width) * 14;
  const inner = cardEl.querySelector(".flip-card-inner");
  if (inner) {
    inner.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
  }
};

window.handleCard3DMouseLeave = function(cardEl) {
  const inner = cardEl.querySelector(".flip-card-inner");
  if (inner) {
    if (isCardFlipped) {
      inner.style.transform = "";
    } else {
      inner.style.transform = "rotateX(0deg) rotateY(0deg) scale(1)";
    }
  }
};

window.nextPrepCard = function() {
  const filtered = getFilteredFlashcards();
  if (filtered.length === 0) return;
  activeFlashcardIdx = (activeFlashcardIdx + 1) % filtered.length;
  isCardFlipped = false;
  playSound("flip");
  renderInterviews();
};

window.prevPrepCard = function() {
  const filtered = getFilteredFlashcards();
  if (filtered.length === 0) return;
  activeFlashcardIdx = (activeFlashcardIdx - 1 + filtered.length) % filtered.length;
  isCardFlipped = false;
  playSound("flip");
  renderInterviews();
};

window.shuffleFlashcardDeck = function() {
  isDeckShuffled = false;
  const filtered = getFilteredFlashcards();
  if (filtered.length > 0) {
    let shuffled = [...filtered];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    shuffledCardsList = shuffled;
    isDeckShuffled = true;
    activeFlashcardIdx = 0;
    isCardFlipped = false;
    playSound("flip");
    showToast("Deck shuffled! 🎴", "success");
    renderInterviews();
  }
};

window.markCardMastered = function(origIdx) {
  masteredCards.add(origIdx);
  AppState.user.xp += 10;
  playSound("mastered");
  nextPrepCard();
};

window.evaluateMcqSelection = function(oIdx) {
  const current = VLSIData.interviews.mcqs[activeMcqQuestIdx];
  const fb = document.getElementById("mcq-prep-feedback");
  if (!fb) return;

  fb.className = "mt-4 p-4 rounded-xl text-xs font-mono border";
  fb.classList.remove("hidden");

  if (oIdx === current.answer) {
    AppState.user.xp += 10;
    fb.classList.add("bg-emerald-950/60", "border-emerald-500/25", "text-emerald-400");
    fb.innerHTML = `<strong>Correct! +10 XP added.</strong> <br>${current.explanation}`;
  } else {
    fb.classList.add("bg-red-950/60", "border-red-500/25", "text-red-400");
    fb.innerHTML = `<strong>Incorrect selection.</strong> <br>${current.explanation}`;
  }
};

window.nextMcqQuestion = function() {
  activeMcqQuestIdx = (activeMcqQuestIdx + 1) % VLSIData.interviews.mcqs.length;
  renderInterviews();
  switchPrepTab("mcqs");
};

window.prevMcqQuestion = function() {
  activeMcqQuestIdx = (activeMcqQuestIdx - 1 + VLSIData.interviews.mcqs.length) % VLSIData.interviews.mcqs.length;
  renderInterviews();
  switchPrepTab("mcqs");
};

window.evaluateQuizSelection = function(oIdx) {
  const current = VLSIData.interviews.quizzes[activeQuizQuestIdx];
  const fb = document.getElementById("quiz-prep-feedback");
  if (!fb) return;

  fb.className = "mt-4 p-4 rounded-xl text-xs font-mono border";
  fb.classList.remove("hidden");

  if (oIdx === current.answer) {
    AppState.user.xp += 15;
    fb.classList.add("bg-emerald-950/60", "border-emerald-500/25", "text-emerald-400");
    fb.innerHTML = `<strong>Correct! +15 XP added.</strong> <br>${current.explanation}`;
  } else {
    fb.classList.add("bg-red-950/60", "border-red-500/25", "text-red-400");
    fb.innerHTML = `<strong>Incorrect selection.</strong> <br>${current.explanation}`;
  }
};

window.nextQuizQuestion = function() {
  activeQuizQuestIdx = (activeQuizQuestIdx + 1) % VLSIData.interviews.quizzes.length;
  renderInterviews();
  switchPrepTab("quizzes");
};

window.prevQuizQuestion = function() {
  activeQuizQuestIdx = (activeQuizQuestIdx - 1 + VLSIData.interviews.quizzes.length) % VLSIData.interviews.quizzes.length;
  renderInterviews();
  switchPrepTab("quizzes");
};
