import { useState } from "react";

/*
 * TEACHER REVIEW SCREEN — Option C (Split Panel) — v4
 * 
 * DEFINITIVE design reference for Phase 4 Prompt 3 implementation.
 * Per Iron_Man_STEM_Mission_Project_Brief_v3_9.md, Sections 9–10.
 * 
 * ═══════════════════════════════════════════════════════════════
 * WHAT LIVES WHERE:
 * ═══════════════════════════════════════════════════════════════
 * 
 * SETUP SCREEN (TEKS selection — exists already, needs additions):
 *   - Grade selector
 *   - Math TEKS checkboxes + Science TEKS checkboxes
 *   - Problem Format selector: Pure Math / Mix / Word Problems  ← NEW
 *   - Cross-Curricular toggle                                    ← ALREADY EXISTS
 *   - Show Expression toggle (display raw math during gameplay)  ← ALREADY EXISTS
 *   - "Generate Mission" button
 * 
 * REVIEW SCREEN (this mockup):
 *   - NO global toggles — all generation settings live on setup screen
 *   - Per-problem quick-action chips handle individual overrides:
 *     Math: "Word Problem" / "Bare Math" (format), "Easier" / "Harder" (difficulty)
 *     Science: "Simpler Concept" / "Deeper Thinking" / "Better Distractors" / "Different Scenario"
 *   - Free-text feedback for custom regeneration instructions
 *   - Problems still DISPLAY cross-curricular tags (purple ✦ badges) when present
 * 
 * The format choice affects initial generation. If the teacher wants
 * to change ONE problem's format after the fact, she uses the
 * per-problem quick-action chips, not a global toggle.
 * 
 * ═══════════════════════════════════════════════════════════════
 * V4 CHANGES:
 * ═══════════════════════════════════════════════════════════════
 * - REMOVED format selector from review header (moved to setup screen)
 * - REMOVED cross-curricular toggle from review header (lives on setup screen)
 * - ADDED "↩ Undo Approval" button for already-approved problems
 * - ADDED "★ Favorite" button in the badges row (ALWAYS VISIBLE, any state)
 *   ★ is the ONLY mechanism that feeds the flywheel.
 *   Approving alone does NOT save to the exemplar bank.
 *   Only favorited+approved problems get saved via ExemplarBank.save().
 * - ADDED steel-blue (#7B9ECF) color for difficulty badges
 * - ADDED amber (#ffaa32) color for operation badges
 * - Header is now minimal: just progress bar + launch button
 * - Cross-curricular purple ✦ badges still DISPLAY on problems that have them
 * - Science TEKS field in custom form is always visible (not gated by toggle)
 * 
 * ═══════════════════════════════════════════════════════════════
 * VALIDATION SYSTEM (unchanged from v3):
 * ═══════════════════════════════════════════════════════════════
 * 
 * Structure — "Does this problem have all required fields?"
 *   GREEN ✅ = all fields present. RED ❌ = missing → HARD GATE
 * 
 * Math (math only) — "Is the arithmetic correct?"
 *   GREEN ✅ = JS matches LLM. RED ❌ = mismatch → HARD GATE
 * 
 * Science (science only) — "Is the MC question structurally valid?"
 *   GREEN ✅ = 4 options, valid correctIndex, recognized TEKS. RED ❌ → HARD GATE
 * 
 * Content — "Is this appropriate for kids?"
 *   GREEN ✅ = no concerns. YELLOW ⚠️ = soft warning, teacher decides
 * 
 * TEKS — "Does this match the Texas standard?"
 *   GREEN ✅ = within ranges. RED ❌ = violates teks-rules.json → HARD GATE
 * 
 * LLM Review — Future (Prompt 4). Shows ⏳ Pending.
 * 
 * TWO SEPARATE VISUAL SYSTEMS:
 * 1. Confidence = shapes (● circle / ▲ triangle / ◆ diamond) from Layers 1-4
 * 2. Llama Guard = 🛡️ shield icon in orange (independent safety check)
 */

// ── Validation Data ─────────────────────────────────────────────
const SAMPLE_VALIDATION = {
  "fw-1":  { category: "green",  chips: { structure: "pass", math: "pass", content: "pass", teks: "pass", llm: "pending" }, flags: [] },
  "fw-2":  { category: "green",  chips: { structure: "pass", math: "pass", content: "pass", teks: "pass", llm: "pending" }, flags: [] },
  "fw-3":  { category: "green",  chips: { structure: "pass", math: "pass", content: "pass", teks: "pass", llm: "pending" }, flags: [] },
  "fury-1":{ category: "green",  chips: { structure: "pass", science: "pass", content: "pass", teks: "pass", llm: "pending" }, flags: [] },
  // RED: TEKS hard gate — answer 4725 exceeds 3.4A max of 1000
  "fw-4":  { category: "red",    chips: { structure: "pass", math: "pass", content: "pass", teks: "fail", llm: "pending" }, flags: ["Layer 4 TEKS VIOLATION: Answer 4,725 exceeds TEKS 3.4A max result of 1,000. This problem does not meet the standard."] },
  "fw-5":  { category: "green",  chips: { structure: "pass", math: "pass", content: "pass", teks: "pass", llm: "pending" }, flags: [] },
  "fury-2":{ category: "green",  chips: { structure: "pass", science: "pass", content: "pass", teks: "pass", llm: "pending" }, flags: [] },
  // YELLOW: Llama Guard flagged + Layer 3 content warning, but all hard gates pass
  "fw-6":  { category: "yellow", chips: { structure: "pass", math: "pass", content: "warn", teks: "pass", llm: "pending" }, flags: ["Layer 3 Content Warning: Problem context involves dropping objects from buildings — review for age-appropriateness"] },
  "fw-7":  { category: "green",  chips: { structure: "pass", math: "pass", content: "pass", teks: "pass", llm: "pending" }, flags: [] },
  "fury-3":{ category: "green",  chips: { structure: "pass", science: "pass", content: "pass", teks: "pass", llm: "pending" }, flags: [] },
  "fw-8":  { category: "green",  chips: { structure: "pass", math: "pass", content: "pass", teks: "pass", llm: "pending" }, flags: [] },
  // Teacher-entered custom — skips automated validation
  "fw-9":  { category: "green",  chips: { structure: "pass", math: "skip", content: "skip", teks: "skip", llm: "skip" }, flags: [] },
  "fw-10": { category: "green",  chips: { structure: "pass", math: "pass", content: "pass", teks: "pass", llm: "pending" }, flags: [] },
};

const SORT_PRIORITY = { red: 0, yellow: 1, green: 2 };

// ── Problem Data (10 math + 3 science = 13) ────────────────────
const SAMPLE_PROBLEMS = [
  {
    id: "fw-1", type: "math", teks: "3.4A", operation: "ADD",
    expression: "347 + 285", displayText: "What is 347 + 285?",
    answer: 632, difficulty: "easy", crossCurricular: null, source: "ai"
  },
  {
    id: "fw-2", type: "math", teks: "3.4A", operation: "SUBTRACT",
    expression: "503 - 267", displayText: "What is 503 - 267?",
    answer: 236, difficulty: "easy", crossCurricular: null, source: "ai"
  },
  {
    id: "fw-3", type: "math", teks: "3.4F", operation: "MULTIPLY",
    expression: "25 × 16",
    displayText: "The weather station recorded 25 days of rain this month. Each rainy day averaged 16 millimeters of precipitation. How many total millimeters of rain fell?",
    answer: 400, difficulty: "medium",
    crossCurricular: { scienceTeks: "3.10A", label: "Weather & Precipitation" },
    source: "ai"
  },
  {
    id: "fury-1", type: "science", teks: "3.9B",
    question: "Which layer of Earth's atmosphere is closest to the surface?",
    options: ["Stratosphere", "Troposphere", "Mesosphere", "Thermosphere"],
    correctIndex: 1, difficulty: null, crossCurricular: null, source: "ai"
  },
  {
    // RED — TEKS violation: 4725 > max 1000 for 3.4A
    id: "fw-4", type: "math", teks: "3.4A", operation: "ADD",
    expression: "1,250 + 3,475",
    displayText: "A scientist measured 1,250 grams of sand erosion on Monday and 3,475 grams on Tuesday. How many total grams of sand eroded?",
    answer: 4725, difficulty: "medium",
    crossCurricular: { scienceTeks: "3.10B", label: "Weathering & Erosion" },
    source: "ai"
  },
  {
    id: "fw-5", type: "math", teks: "3.4J", operation: "DIVIDE",
    expression: "144 ÷ 12", displayText: "What is 144 ÷ 12?",
    answer: 12, difficulty: "easy", crossCurricular: null, source: "ai"
  },
  {
    id: "fury-2", type: "science", teks: "3.7A",
    question: "Which of these is an example of a force acting at a distance?",
    options: ["Pushing a wagon", "Pulling a door open", "A magnet attracting a paperclip", "Kicking a soccer ball"],
    correctIndex: 2, difficulty: null, crossCurricular: null, source: "ai"
  },
  {
    // YELLOW — Llama Guard flagged + content warning, but TEKS/math pass
    id: "fw-6", type: "math", teks: "3.4F", operation: "MULTIPLY",
    expression: "45 × 12",
    displayText: "A scientist drops 45 objects from a building to test gravity. Each object weighs 12 pounds. What is the total weight dropped?",
    answer: 540, difficulty: "hard",
    crossCurricular: { scienceTeks: "3.7A", label: "Forces & Gravity" },
    flagged: true, flagReason: "Content involves dropping objects from buildings — review for age-appropriateness",
    source: "ai"
  },
  {
    id: "fw-7", type: "math", teks: "3.4A", operation: "ADD",
    expression: "456 + 321", displayText: "What is 456 + 321?",
    answer: 777, difficulty: "medium", crossCurricular: null, source: "ai"
  },
  {
    id: "fury-3", type: "science", teks: "3.12B",
    question: "In a food chain, what would most likely happen if all the frogs were removed from a pond?",
    options: ["Nothing would change", "Insects would increase and plants might decrease", "Fish would increase", "The pond would dry up"],
    correctIndex: 1, difficulty: null, crossCurricular: null, source: "ai"
  },
  {
    id: "fw-8", type: "math", teks: "3.4F", operation: "MULTIPLY",
    expression: "32 × 15",
    displayText: "A park ranger counts 32 migrating birds each day for 15 days. How many birds were counted in total?",
    answer: 480, difficulty: "medium",
    crossCurricular: { scienceTeks: "3.12A", label: "Migration & Hibernation" },
    source: "ai"
  },
  {
    // Teacher-entered via "Replace with Custom" form
    id: "fw-9", type: "math", teks: "3.4A", operation: "ADD",
    expression: "150 + 275",
    displayText: "Mrs. Johnson's class collected 150 cans in October and 275 cans in November for the food drive. How many cans did they collect altogether?",
    answer: 425, difficulty: "easy", crossCurricular: null, source: "uploaded"
  },
  {
    id: "fw-10", type: "math", teks: "3.4A", operation: "SUBTRACT",
    expression: "800 - 347",
    displayText: "An astronomer measured 800 visible stars last month but only 347 this month due to light pollution. How many fewer stars were visible?",
    answer: 453, difficulty: "medium",
    crossCurricular: { scienceTeks: "3.9A", label: "Sun, Earth & Moon" },
    source: "ai"
  },
];

// ── Quick Actions: DIFFERENT for math vs science ────────────────
const MATH_QUICK_ACTIONS = [
  { label: "Easier Numbers", icon: "↓", feedback: "Use smaller, simpler numbers appropriate for this grade level" },
  { label: "Harder Numbers", icon: "↑", feedback: "Increase the difficulty with larger or more complex numbers" },
  { label: "Word Problem", icon: "📖", feedback: "Rewrite as a real-world word problem with context" },
  { label: "Bare Math", icon: "🔢", feedback: "Simplify to just the arithmetic expression, no word problem" },
];

const SCIENCE_QUICK_ACTIONS = [
  { label: "Simpler Concept", icon: "↓", feedback: "Simplify to a basic recall or identification question" },
  { label: "Deeper Thinking", icon: "↑", feedback: "Rewrite to require prediction, cause-and-effect reasoning, or analysis" },
  { label: "Better Distractors", icon: "🎯", feedback: "Make the wrong answer choices more plausible and STAAR-quality" },
  { label: "Different Scenario", icon: "🔄", feedback: "Same TEKS standard, but use a completely different example or phenomenon" },
];

const AVAILABLE_MATH_TEKS = ["3.4A","3.4B","3.4C","3.4D","3.4E","3.4F","3.4G","3.4H","3.4J","3.4K","3.5A","3.5B","3.5C","3.5D","3.5E"];
const AVAILABLE_SCIENCE_TEKS = ["3.7A","3.9A","3.9B","3.10A","3.10B","3.12A","3.12B"];

// ── Confidence Badge (geometric shapes for colorblind accessibility) ──
function ConfidenceBadge({ category, small }) {
  const size = small ? 14 : 18;
  if (category === "green") {
    return (
      <div title="High Confidence — all checks pass" style={{
        width: size, height: size, borderRadius: "50%",
        background: "rgba(0,255,100,0.2)", border: "1.5px solid rgba(0,255,100,0.5)",
        flexShrink: 0,
      }} />
    );
  }
  if (category === "yellow") {
    return (
      <div title="Needs Review — content warning (teacher decides)" style={{
        width: 0, height: 0, flexShrink: 0,
        borderLeft: `${size/2}px solid transparent`,
        borderRight: `${size/2}px solid transparent`,
        borderBottom: `${size}px solid rgba(255,200,0,0.5)`,
        filter: "drop-shadow(0 0 2px rgba(255,200,0,0.3))",
      }} />
    );
  }
  return (
    <div title="TEKS or Math Violation — must fix" style={{
      width: size * 0.75, height: size * 0.75, flexShrink: 0,
      background: "rgba(255,60,60,0.25)", border: "1.5px solid rgba(255,60,60,0.5)",
      transform: "rotate(45deg)",
    }} />
  );
}

// ── Validation Chip ────────────────────────────────────────────
function ValidationChip({ label, status }) {
  const cfg = {
    pass:    { bg: "rgba(0,255,100,0.08)", bd: "rgba(0,255,100,0.2)", c: "#00ff64", icon: "✅" },
    warn:    { bg: "rgba(255,200,0,0.08)", bd: "rgba(255,200,0,0.2)", c: "#ffc800", icon: "⚠️" },
    fail:    { bg: "rgba(255,60,60,0.08)", bd: "rgba(255,60,60,0.2)", c: "#ff6b6b", icon: "❌" },
    pending: { bg: "rgba(255,255,255,0.03)", bd: "rgba(255,255,255,0.08)", c: "rgba(255,255,255,0.35)", icon: "⏳" },
    skip:    { bg: "rgba(255,255,255,0.02)", bd: "rgba(255,255,255,0.06)", c: "rgba(255,255,255,0.25)", icon: "—" },
  }[status] || { bg: "rgba(255,255,255,0.03)", bd: "rgba(255,255,255,0.08)", c: "rgba(255,255,255,0.35)", icon: "⏳" };
  return (
    <span style={{
      fontSize: 11, padding: "3px 10px", borderRadius: 3,
      background: cfg.bg, border: `1px solid ${cfg.bd}`, color: cfg.c,
      whiteSpace: "nowrap",
    }}>
      {cfg.icon} {label}{status === "pending" ? ": Pending" : ""}
    </span>
  );
}

// ── Validation Chips Row (math shows "Math", science shows "Science") ──
function ValidationChipsRow({ validation, isScience }) {
  const c = validation.chips;
  return (
    <div style={{ display: "flex", gap: 6, marginBottom: 8, flexWrap: "wrap", alignItems: "center" }}>
      <ValidationChip label="Structure" status={c.structure} />
      {isScience
        ? <ValidationChip label="Science" status={c.science || "pass"} />
        : <ValidationChip label="Math" status={c.math} />
      }
      <ValidationChip label="Content" status={c.content} />
      <ValidationChip label="TEKS" status={c.teks} />
      <ValidationChip label="LLM Review" status={c.llm} />
      <div style={{ marginLeft: 8, display: "flex", alignItems: "center", gap: 6 }}>
        <ConfidenceBadge category={validation.category} />
        <span style={{ fontSize: 11, color:
          validation.category === "green" ? "rgba(0,255,100,0.6)"
          : validation.category === "yellow" ? "rgba(255,200,0,0.6)"
          : "rgba(255,60,60,0.6)"
        }}>
          {validation.category === "green" ? "High Confidence"
           : validation.category === "yellow" ? "Needs Review"
           : "TEKS/Math Violation"}
        </span>
      </div>
    </div>
  );
}

// ── Main Component ──────────────────────────────────────────────
export default function TeacherReviewScreen() {
  const sorted = [...SAMPLE_PROBLEMS].sort((a, b) => {
    const va = SAMPLE_VALIDATION[a.id] || { category: "yellow" };
    const vb = SAMPLE_VALIDATION[b.id] || { category: "yellow" };
    if (a.type === "science" && b.type !== "science") return 1;
    if (a.type !== "science" && b.type === "science") return -1;
    return (SORT_PRIORITY[va.category] || 1) - (SORT_PRIORITY[vb.category] || 1);
  });

  const [problems, setProblems] = useState(
    sorted.map(p => ({ ...p, status: p.source === "uploaded" ? "approved" : "pending", feedback: "", favorited: false }))
  );
  const [selected, setSelected] = useState(0);
  const [showIssues, setShowIssues] = useState(false);
  const [showCustomForm, setShowCustomForm] = useState(false);
  const [customQ, setCustomQ] = useState("");
  const [customA, setCustomA] = useState("");
  const [customTeks, setCustomTeks] = useState("3.4A");
  const [customDiff, setCustomDiff] = useState("medium");
  const [customOp, setCustomOp] = useState("ADD");
  const [customSci, setCustomSci] = useState("");
  const [customFav, setCustomFav] = useState(false);

  const approved = problems.filter(p => p.status === "approved").length;
  const p = problems[selected];
  const v = SAMPLE_VALIDATION[(p && p.id) || ""] || { category: "yellow", chips: {}, flags: [] };
  const isScience = p && p.type === "science";
  const quickActions = isScience ? SCIENCE_QUICK_ACTIONS : MATH_QUICK_ACTIONS;
  const allDone = approved >= problems.length;

  const approve = () => {
    if (p.status === "approved") return;
    setProblems(pr => pr.map((x, i) => i === selected ? { ...x, status: "approved" } : x));
    setShowIssues(false); setShowCustomForm(false);
    // Auto-advance to next unapproved problem
    const next = problems.findIndex((x, i) => i > selected && x.status !== "approved");
    if (next !== -1) setSelected(next);
  };

  // UN-APPROVE: teacher can change her mind on any previously approved problem
  const unapprove = () => {
    setProblems(pr => pr.map((x, i) => i === selected ? { ...x, status: "pending", favorited: false } : x));
  };

  // ★ FAVORITE: flags this problem as a high-quality exemplar for the flywheel.
  // Available on ANY problem in any state. Only favorited+approved problems get saved to the bank.
  const toggleFavorite = () => {
    setProblems(pr => pr.map((x, i) => i === selected ? { ...x, favorited: !x.favorited } : x));
  };

  const regen = () => {
    setProblems(pr => pr.map((x, i) => i === selected ? { ...x, status: "regenerating" } : x));
    setShowIssues(false);
    setTimeout(() => {
      setProblems(pr => pr.map((x, i) =>
        i === selected ? { ...x, status: "pending", feedback: "", flagged: false, flagReason: null } : x
      ));
    }, 1500);
  };

  const fb = (t) => setProblems(pr => pr.map((x, i) => i === selected ? { ...x, feedback: t } : x));

  const saveCust = () => {
    if (!customQ.trim() || !customA.trim()) return;
    setProblems(pr => pr.map((x, i) => i === selected ? {
      ...x, displayText: customQ, answer: parseFloat(customA) || customA,
      expression: customA, teks: customTeks, difficulty: customDiff,
      operation: customOp, source: "uploaded", status: "approved",
      favorited: customFav, // ★ teacher can favorite a custom problem at save time
      crossCurricular: customSci ? { scienceTeks: customSci, label: "Teacher-assigned" } : null,
      flagged: false, flagReason: null,
    } : x));
    setShowCustomForm(false); setCustomQ(""); setCustomA(""); setCustomFav(false);
  };

  const inputStyle = {
    width: "100%", background: "rgba(0,0,0,0.3)",
    border: "1px solid rgba(0,150,255,0.15)",
    color: "#e0e0e0", padding: "8px 12px",
    borderRadius: 4, fontSize: 13, outline: "none", boxSizing: "border-box",
    fontFamily: "'Rajdhani', sans-serif",
  };

  return (
    <div style={{ background: "#0a0e17", minHeight: "100vh", fontFamily: "'Rajdhani', 'Segoe UI', sans-serif", display: "flex", flexDirection: "column" }}>

      {/* ═══ HEADER (cleaner — no format selector, it lives on setup screen) ═══ */}
      <div style={{
        borderBottom: "1px solid rgba(0,255,255,0.2)", padding: "14px 24px",
        display: "flex", justifyContent: "space-between", alignItems: "center",
        background: "linear-gradient(180deg, rgba(0,229,255,0.03) 0%, transparent 100%)",
        flexWrap: "wrap", gap: 12,
      }}>
        <div>
          <h1 style={{ color: "#00e5ff", fontSize: 20, margin: 0, fontFamily: "'Orbitron', monospace", letterSpacing: 2, textTransform: "uppercase" }}>
            Mission Review
          </h1>
          <p style={{ color: "rgba(0,229,255,0.5)", fontSize: 13, margin: "4px 0 0" }}>
            Grade 3 · TEKS: 3.4A, 3.4F, 3.4J · Science: 3.7A, 3.9B, 3.10A, 3.12A, 3.12B
          </p>
        </div>

        <div style={{ display: "flex", gap: 20, alignItems: "center", flexWrap: "wrap" }}>

          {/* Progress */}
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 140, height: 6, background: "rgba(0,255,255,0.1)", borderRadius: 3, overflow: "hidden" }}>
              <div style={{
                width: `${(approved / problems.length) * 100}%`, height: "100%", borderRadius: 3, transition: "width 0.5s",
                background: allDone ? "#00ff64" : "linear-gradient(90deg, #00e5ff, #00ff64)",
              }} />
            </div>
            <span style={{ color: "#00e5ff", fontSize: 13, fontFamily: "'Orbitron', monospace" }}>{approved}/{problems.length}</span>
          </div>

          {/* Launch */}
          <button style={{
            background: allDone ? "rgba(0,255,100,0.2)" : "rgba(0,255,255,0.04)",
            border: `1px solid ${allDone ? "#00ff64" : "rgba(0,255,255,0.12)"}`,
            color: allDone ? "#00ff64" : "rgba(0,255,255,0.25)",
            padding: "10px 28px", borderRadius: 4, cursor: allDone ? "pointer" : "default",
            fontFamily: "'Orbitron', monospace", fontSize: 12, letterSpacing: 1, textTransform: "uppercase", transition: "all 0.3s",
          }}>{allDone ? "▶ Launch Mission" : "Approve All to Launch"}</button>
        </div>
      </div>

      {/* ═══ SPLIT LAYOUT ═════════════════════════ */}
      <div style={{ display: "flex", flex: 1, minHeight: 0 }}>

        {/* ═══ LEFT PANEL ═════════════════════════ */}
        <div style={{ width: 360, borderRight: "1px solid rgba(0,255,255,0.1)", overflowY: "auto", padding: "4px 0", background: "rgba(0,0,0,0.15)" }}>
          {problems.map((prob, idx) => {
            const isSel = idx === selected;
            const isSci = prob.type === "science";
            const isOk = prob.status === "approved";
            const isFlag = prob.flagged && !isOk;
            const isUp = prob.source === "uploaded";
            const pv = SAMPLE_VALIDATION[prob.id] || { category: "yellow" };
            return (
              <div key={prob.id} onClick={() => { setSelected(idx); setShowIssues(false); setShowCustomForm(false); }} style={{
                padding: "11px 14px", cursor: "pointer",
                background: isSel ? "rgba(0,255,255,0.06)" : "transparent",
                borderLeft: isSel ? "3px solid #00e5ff" : "3px solid transparent",
                borderBottom: "1px solid rgba(0,255,255,0.03)", transition: "all 0.15s",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{
                    width: 30, height: 30, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
                    background: isOk ? "rgba(0,255,100,0.15)" : isSci ? "rgba(255,100,0,0.15)" : "rgba(0,255,255,0.1)",
                    border: `1px solid ${isOk ? "rgba(0,255,100,0.3)" : isSci ? "rgba(255,100,0,0.3)" : "rgba(0,255,255,0.2)"}`,
                    color: isOk ? "#00ff64" : isSci ? "#ff8a00" : "#00e5ff", fontSize: 12, fontWeight: 700, flexShrink: 0,
                  }}>{isOk ? "✓" : idx + 1}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ color: isOk ? "rgba(0,255,100,0.5)" : "#c0c0c0", fontSize: 13, margin: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {prob.displayText || prob.question}
                    </p>
                    <div style={{ display: "flex", gap: 6, alignItems: "center", marginTop: 2 }}>
                      <span style={{ fontSize: 10, color: "rgba(255,255,255,0.25)" }}>{prob.teks}{prob.difficulty ? ` · ${prob.difficulty}` : ""}</span>
                      {prob.crossCurricular && <span style={{ fontSize: 9, color: "#b388ff" }}>✦ cross</span>}
                      {isUp && <span style={{ fontSize: 9, padding: "0 4px", borderRadius: 2, border: "1px solid rgba(0,150,255,0.4)", color: "rgba(0,150,255,0.7)" }}>UPLOADED</span>}
                    </div>
                  </div>
                  <ConfidenceBadge category={pv.category} small />
                  {prob.favorited && <span style={{ fontSize: 13, color: "#ffc800", flexShrink: 0 }} title="★ Favorited — high-quality exemplar">★</span>}
                  {isFlag && <span style={{ fontSize: 15, flexShrink: 0 }} title={"Llama Guard: " + prob.flagReason}>🛡️</span>}
                </div>
              </div>
            );
          })}
        </div>

        {/* ═══ RIGHT PANEL ════════════════════════ */}
        <div style={{ flex: 1, padding: 24, overflowY: "auto" }}>
          {p && (
            <div>
              {/* Llama Guard banner — 🛡️ shield */}
              {p.flagged && p.status !== "approved" && (
                <div style={{
                  background: "rgba(255,160,0,0.08)", border: "1px solid rgba(255,160,0,0.25)",
                  borderRadius: 6, padding: "12px 16px", marginBottom: 16, display: "flex", gap: 10, alignItems: "flex-start",
                }}>
                  <span style={{ fontSize: 20, flexShrink: 0 }}>🛡️</span>
                  <div>
                    <p style={{ color: "#ffa000", fontSize: 13, margin: "0 0 4px", fontWeight: 600 }}>LLAMA GUARD FLAG</p>
                    <p style={{ color: "rgba(255,160,0,0.7)", fontSize: 12, margin: 0 }}>{p.flagReason}</p>
                  </div>
                </div>
              )}

              {/* TEKS + metadata badges + ★ Favorite (always visible) */}
              <div style={{ display: "flex", gap: 8, marginBottom: 12, flexWrap: "wrap", alignItems: "center" }}>
                <span style={{ fontSize: 11, padding: "3px 10px", borderRadius: 3, background: isScience ? "rgba(255,100,0,0.12)" : "rgba(0,255,255,0.1)", color: isScience ? "#ff8a00" : "#00e5ff", textTransform: "uppercase", letterSpacing: 1 }}>{p.teks}</span>
                {p.difficulty && <span style={{ fontSize: 11, padding: "3px 10px", borderRadius: 3, background: "rgba(123,158,207,0.12)", border: "1px solid rgba(123,158,207,0.3)", color: "#7B9ECF" }}>{p.difficulty}</span>}
                {p.operation && <span style={{ fontSize: 11, padding: "3px 10px", borderRadius: 3, background: "rgba(255,170,50,0.12)", border: "1px solid rgba(255,170,50,0.25)", color: "#ffaa32" }}>{p.operation}</span>}
                {isScience && <span style={{ fontSize: 11, padding: "3px 10px", borderRadius: 3, background: "rgba(255,100,0,0.08)", border: "1px solid rgba(255,100,0,0.2)", color: "#ff8a00" }}>SCIENCE · FURY INTERRUPTION</span>}
                {p.crossCurricular && <span style={{ fontSize: 11, padding: "3px 10px", borderRadius: 3, background: "rgba(179,136,255,0.12)", border: "1px solid rgba(179,136,255,0.25)", color: "#b388ff" }}>✦ {p.crossCurricular.scienceTeks}: {p.crossCurricular.label}</span>}
                {p.source === "uploaded" && <span style={{ fontSize: 11, padding: "3px 10px", borderRadius: 3, background: "rgba(0,150,255,0.08)", border: "1px solid rgba(0,150,255,0.3)", color: "rgba(0,150,255,0.8)" }}>UPLOADED</span>}
                {p.status === "approved" && <span style={{ fontSize: 11, padding: "3px 10px", borderRadius: 3, background: "rgba(0,255,100,0.1)", color: "#00ff64" }}>✓ APPROVED</span>}

                {/* ★ Favorite — always visible, any state. This is the ONLY thing that feeds the flywheel. */}
                <button onClick={toggleFavorite} style={{
                  background: p.favorited ? "rgba(255,200,0,0.15)" : "rgba(255,200,0,0.05)",
                  border: `1px solid ${p.favorited ? "rgba(255,200,0,0.5)" : "rgba(255,200,0,0.25)"}`,
                  color: p.favorited ? "#ffc800" : "rgba(255,200,0,0.55)",
                  padding: "3px 10px", borderRadius: 3,
                  cursor: "pointer", fontSize: 11, fontWeight: 600,
                  transition: "all 0.2s", marginLeft: "auto",
                }}>
                  {p.favorited ? "★ Favorited" : "☆ Favorite"}
                </button>
              </div>

              {/* Validation chips — different for math vs science */}
              <ValidationChipsRow validation={v} isScience={isScience} />

              {/* View issues (expandable) */}
              {v.flags.length > 0 && (
                <div style={{ marginBottom: 16 }}>
                  <button onClick={() => setShowIssues(!showIssues)} style={{
                    background: "none", border: "none", cursor: "pointer", padding: 0, textDecoration: "underline",
                    color: v.category === "red" ? "rgba(255,60,60,0.6)" : "rgba(255,200,0,0.6)", fontSize: 11,
                  }}>{showIssues ? "▾ Hide issues" : "▸ View issues"}</button>
                  {showIssues && (
                    <div style={{
                      marginTop: 8, padding: "10px 14px", borderRadius: 4,
                      background: v.category === "red" ? "rgba(255,60,60,0.04)" : "rgba(255,200,0,0.04)",
                      border: `1px solid ${v.category === "red" ? "rgba(255,60,60,0.12)" : "rgba(255,200,0,0.12)"}`,
                    }}>
                      {v.flags.map((f, i) => (
                        <p key={i} style={{ color: f.includes("VIOLATION") ? "rgba(255,60,60,0.7)" : "rgba(255,200,0,0.7)", fontSize: 12, margin: i === 0 ? 0 : "6px 0 0", lineHeight: 1.4 }}>• {f}</p>
                      ))}
                    </div>
                  )}
                </div>
              )}
              {v.flags.length === 0 && <div style={{ marginBottom: 16 }} />}

              {/* Problem content */}
              <div style={{
                background: isScience ? "rgba(255,100,0,0.03)" : "rgba(0,255,255,0.02)",
                border: `1px solid ${isScience ? "rgba(255,100,0,0.12)" : "rgba(0,255,255,0.1)"}`,
                borderRadius: 6, padding: 20, marginBottom: 20,
              }}>
                <p style={{ color: "#f0f0f0", fontSize: 18, margin: "0 0 8px", lineHeight: 1.5 }}>{p.displayText || p.question}</p>
                {p.expression && <p style={{ color: "rgba(0,255,255,0.4)", fontSize: 13, margin: "0 0 4px" }}>Expression: <span style={{ fontFamily: "monospace" }}>{p.expression}</span></p>}
                {p.answer !== undefined && !p.options && <p style={{ color: "#00e5ff", fontSize: 15, margin: 0 }}>Answer: <strong style={{ fontFamily: "monospace" }}>{typeof p.answer === "number" ? p.answer.toLocaleString() : p.answer}</strong></p>}
                {p.options && (
                  <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 12 }}>
                    {p.options.map((opt, oi) => (
                      <div key={oi} style={{
                        fontSize: 14, padding: "8px 14px", borderRadius: 4,
                        background: oi === p.correctIndex ? "rgba(0,255,100,0.06)" : "rgba(255,255,255,0.02)",
                        border: `1px solid ${oi === p.correctIndex ? "rgba(0,255,100,0.25)" : "rgba(255,255,255,0.06)"}`,
                        color: oi === p.correctIndex ? "#00ff64" : "rgba(255,255,255,0.6)",
                      }}><strong>{String.fromCharCode(65 + oi)})</strong> {opt}{oi === p.correctIndex && " ✓ Correct"}</div>
                    ))}
                  </div>
                )}
              </div>

              {/* ═══ APPROVED STATE: confirmation + undo (★ lives in badges row above) ═══ */}
              {p.status === "approved" && (
                <div style={{
                  background: "rgba(0,255,100,0.03)", border: "1px solid rgba(0,255,100,0.12)",
                  borderRadius: 6, padding: "16px 20px", marginBottom: 20,
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                }}>
                  <p style={{ color: "rgba(0,255,100,0.5)", fontSize: 14, margin: 0 }}>
                    ✓ This {isScience ? "question" : "problem"} has been approved.
                    {p.favorited && <span style={{ color: "#ffc800", marginLeft: 10, fontSize: 12 }}>★ Will inform future generations for {p.teks}</span>}
                  </p>
                  <button onClick={unapprove} style={{
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.12)",
                    color: "rgba(255,255,255,0.4)",
                    padding: "6px 16px", borderRadius: 4,
                    cursor: "pointer", fontSize: 12,
                    transition: "all 0.15s",
                  }}>
                    ↩ Undo Approval
                  </button>
                </div>
              )}

              {/* ═══ PENDING/REGENERATING STATE: feedback + action buttons ═══ */}
              {p.status !== "approved" && (
                <>
                  {/* Feedback — DIFFERENT chips for math vs science */}
                  <div style={{ background: "rgba(255,200,0,0.03)", border: "1px solid rgba(255,200,0,0.12)", borderRadius: 6, padding: 20, marginBottom: 20 }}>
                    <p style={{ color: "#ffc800", fontSize: 12, margin: "0 0 12px", textTransform: "uppercase", letterSpacing: 1, fontWeight: 600 }}>
                      Refine This {isScience ? "Question" : "Problem"}
                    </p>
                    <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 12, margin: "0 0 10px" }}>Quick adjustments:</p>
                    <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
                      {quickActions.map(qa => (
                        <button key={qa.label} onClick={() => fb(qa.feedback)} style={{
                          background: "rgba(255,200,0,0.08)", border: "1px solid rgba(255,200,0,0.2)", color: "#ffc800",
                          padding: "8px 16px", borderRadius: 20, cursor: "pointer", fontSize: 13, transition: "all 0.15s",
                        }}>{qa.icon} {qa.label}</button>
                      ))}
                    </div>
                    <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 12, margin: "0 0 8px" }}>Or describe what you want changed:</p>
                    <textarea value={p.feedback} onChange={e => fb(e.target.value)}
                      placeholder={isScience
                        ? "e.g. 'Ask about a different type of force'\nor 'Make option C more plausible'\nor 'Rewrite as a scenario-based question'"
                        : "e.g. 'Keep the multiplication concept but use numbers under 50'\nor 'Make this about buying school supplies instead'\nor 'Connect this to the gravity TEKS'"}
                      rows={3} style={{ ...inputStyle, border: "1px solid rgba(255,200,0,0.15)", resize: "vertical" }} />

                    {/* Submit button — directly below textarea, inside the gold box */}
                    {p.feedback && p.feedback.trim() && (
                      <button onClick={regen} disabled={p.status === "regenerating"} style={{
                        marginTop: 10, width: "100%",
                        background: "rgba(255,200,0,0.12)", border: "1px solid rgba(255,200,0,0.3)",
                        color: "#ffc800", padding: "10px 20px", borderRadius: 4,
                        cursor: "pointer", fontSize: 14, fontWeight: 600,
                        transition: "all 0.2s",
                        opacity: p.status === "regenerating" ? 0.5 : 1,
                      }}>
                        {p.status === "regenerating" ? "Regenerating..." : "↻ Regenerate with Changes"}
                      </button>
                    )}
                  </div>

                  {/* Action buttons */}
                  <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginBottom: 16 }}>
                    <button onClick={regen} disabled={p.status === "regenerating"} style={{
                      background: p.feedback ? "rgba(255,200,0,0.15)" : "rgba(255,60,60,0.08)",
                      border: `1px solid ${p.feedback ? "rgba(255,200,0,0.3)" : "rgba(255,60,60,0.2)"}`,
                      color: p.feedback ? "#ffc800" : "#ff6b6b", padding: "10px 24px", borderRadius: 4,
                      cursor: "pointer", fontSize: 13, opacity: p.status === "regenerating" ? 0.5 : 1,
                    }}>{p.status === "regenerating" ? "Regenerating..." : p.feedback ? "Regenerate with Feedback" : "Regenerate (Random)"}</button>
                    <button onClick={approve} style={{
                      background: "rgba(0,255,100,0.12)",
                      border: "1px solid rgba(0,255,100,0.3)",
                      color: "#00ff64", padding: "10px 32px", borderRadius: 4,
                      cursor: "pointer", fontSize: 13,
                      fontFamily: "'Orbitron', monospace", letterSpacing: 1,
                    }}>APPROVE & NEXT →</button>
                  </div>

                  {/* Replace with Custom (math only) */}
                  {!isScience && (
                    <div style={{ borderTop: "1px solid rgba(0,255,255,0.06)", paddingTop: 16 }}>
                      <button onClick={() => setShowCustomForm(!showCustomForm)} style={{
                        background: "rgba(0,150,255,0.06)", border: "1px solid rgba(0,150,255,0.2)", color: "rgba(0,150,255,0.7)",
                        padding: "8px 20px", borderRadius: 4, cursor: "pointer", fontSize: 12, width: "100%", textAlign: "left",
                      }}>{showCustomForm ? "▾ Cancel Custom Problem" : "▸ Replace with Custom Problem"}</button>

                      {showCustomForm && (
                        <div style={{ marginTop: 12, padding: 16, borderRadius: 6, background: "rgba(0,150,255,0.03)", border: "1px solid rgba(0,150,255,0.12)" }}>
                          <label style={{ color: "rgba(255,255,255,0.5)", fontSize: 11, display: "block", marginBottom: 4 }}>Question Text *</label>
                          <textarea value={customQ} onChange={e => setCustomQ(e.target.value)} placeholder="e.g. Mrs. Johnson's class has 24 students..." rows={2} style={{ ...inputStyle, marginBottom: 12, resize: "vertical" }} />
                          <div style={{ display: "flex", gap: 12, marginBottom: 12 }}>
                            <div style={{ flex: 1 }}>
                              <label style={{ color: "rgba(255,255,255,0.5)", fontSize: 11, display: "block", marginBottom: 4 }}>Answer *</label>
                              <input value={customA} onChange={e => setCustomA(e.target.value)} placeholder="e.g. 632" style={inputStyle} />
                            </div>
                            <div style={{ flex: 1 }}>
                              <label style={{ color: "rgba(255,255,255,0.5)", fontSize: 11, display: "block", marginBottom: 4 }}>TEKS Code *</label>
                              <select value={customTeks} onChange={e => setCustomTeks(e.target.value)} style={inputStyle}>
                                {AVAILABLE_MATH_TEKS.map(t => <option key={t} value={t}>{t}</option>)}
                              </select>
                            </div>
                          </div>
                          <div style={{ display: "flex", gap: 12, marginBottom: 12 }}>
                            <div style={{ flex: 1 }}>
                              <label style={{ color: "rgba(255,255,255,0.5)", fontSize: 11, display: "block", marginBottom: 4 }}>Difficulty</label>
                              <select value={customDiff} onChange={e => setCustomDiff(e.target.value)} style={inputStyle}>
                                <option value="easy">Easy</option><option value="medium">Medium</option><option value="hard">Hard</option>
                              </select>
                            </div>
                            <div style={{ flex: 1 }}>
                              <label style={{ color: "rgba(255,255,255,0.5)", fontSize: 11, display: "block", marginBottom: 4 }}>Operation</label>
                              <select value={customOp} onChange={e => setCustomOp(e.target.value)} style={inputStyle}>
                                <option value="ADD">ADD</option><option value="SUBTRACT">SUBTRACT</option><option value="MULTIPLY">MULTIPLY</option><option value="DIVIDE">DIVIDE</option>
                              </select>
                            </div>
                          </div>
                          <div style={{ marginBottom: 12 }}>
                            <label style={{ color: "rgba(255,255,255,0.5)", fontSize: 11, display: "block", marginBottom: 4 }}>Science TEKS Connection (optional)</label>
                            <select value={customSci} onChange={e => setCustomSci(e.target.value)} style={{ ...inputStyle, border: "1px solid rgba(179,136,255,0.15)" }}>
                              <option value="">None</option>
                              {AVAILABLE_SCIENCE_TEKS.map(t => <option key={t} value={t}>{t}</option>)}
                            </select>
                          </div>
                          {/* ★ Favorite toggle for custom problems */}
                          <div style={{ marginBottom: 14, display: "flex", alignItems: "center", gap: 10 }}>
                            <button onClick={() => setCustomFav(!customFav)} style={{
                              background: customFav ? "rgba(255,200,0,0.15)" : "rgba(255,200,0,0.05)",
                              border: `1px solid ${customFav ? "rgba(255,200,0,0.5)" : "rgba(255,200,0,0.25)"}`,
                              color: customFav ? "#ffc800" : "rgba(255,200,0,0.55)",
                              padding: "5px 14px", borderRadius: 4,
                              cursor: "pointer", fontSize: 12, fontWeight: 600,
                              transition: "all 0.2s",
                            }}>
                              {customFav ? "★ Favorited" : "☆ Favorite"}
                            </button>
                            <span style={{ color: customFav ? "rgba(255,200,0,0.5)" : "rgba(255,255,255,0.3)", fontSize: 11 }}>
                              {customFav ? "This problem will feed the flywheel for future generation" : "Favorite to use as a template for future AI-generated problems"}
                            </span>
                          </div>
                          <button onClick={saveCust} disabled={!customQ.trim() || !customA.trim()} style={{
                            background: (customQ.trim() && customA.trim()) ? "rgba(0,150,255,0.15)" : "rgba(0,150,255,0.05)",
                            border: "1px solid rgba(0,150,255,0.3)", color: "rgba(0,150,255,0.8)",
                            padding: "10px 24px", borderRadius: 4, fontSize: 13, width: "100%",
                            cursor: (customQ.trim() && customA.trim()) ? "pointer" : "default",
                            opacity: (customQ.trim() && customA.trim()) ? 1 : 0.5,
                          }}>Save Custom Problem</button>
                        </div>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ═══ FOOTER ═══════════════════════════════ */}
      <div style={{
        borderTop: "1px solid rgba(0,255,255,0.05)", padding: "8px 24px",
        display: "flex", justifyContent: "space-between", alignItems: "center",
      }}>
        <span style={{ color: "rgba(0,229,255,0.2)", fontSize: 10 }}>TEACHER REVIEW SCREEN · IRON MAN STEM MISSION</span>
        <span style={{ color: "rgba(255,255,255,0.15)", fontSize: 10 }}>
          ● High Confidence {"\u00A0\u00A0"} ▲ Needs Review {"\u00A0\u00A0"} ◆ TEKS/Math Violation {"\u00A0\u00A0"} 🛡️ Safety Flag (Llama Guard)
        </span>
      </div>
    </div>
  );
}
