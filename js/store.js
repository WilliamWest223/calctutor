// ---------------------------------------------------------------
// store.js — progress, mastery, spaced repetition, and everything
// else that has to survive a page reload.
// ---------------------------------------------------------------
import { lessonById } from './bank/lessons.js';
const KEY = 'calctutor.v1';   // key kept stable; `v` field carries the schema version
const SCHEMA = 2;

const DEFAULTS = () => ({
  v: SCHEMA,
  skills: {},        // skillKey -> {seen,right,streak,level,due,ease,lastTs,ms}
  missed: [],        // mistake bank: {ref, skill, prompt, ts, n}
  starred: [],       // {ref, skill, prompt, ts}
  history: [],       // {ts, mode, n, right, secs}
  activity: {},      // 'YYYY-MM-DD' -> questions answered that day
  errors: {},        // error-type key -> count
  notes: {},         // skillKey -> free text
  achievements: [],  // unlocked ids
  exam: { date: null, name: '' },
  lessons: {},       // lessonId -> {read: ts, drilled: n}
  recent: [],        // last ~60 served templates: {k: gid|id, a: arch}
  day: { last: null, count: 0, best: 0 },
  totals: { answered: 0, right: 0, best: 0, secs: 0 },
  settings: {
    theme: 'blueprint',
    timed: true,
    seconds: 75,
    length: 20,          // questions per session
    difficulty: 'all',   // all | easy | medium | hard
    adaptive: true,      // ramp difficulty with mastery
    hints: true,
    sound: false,
    freeShare: 0.3,      // share of auto-convertible MC served as free response (0 off, .3 some, .6 most)
  },
});

// interval (days) unlocked at each mastery level
const INTERVAL = [0, 1, 2, 4, 9, 21];
export const MAX_LEVEL = 5;
export const DAY = 86400000;

// ---------------------------------------------------------------
// error taxonomy — what *kind* of mistake a distractor represents
// ---------------------------------------------------------------
export const ERROR_TYPES = {
  sign: { label: 'Sign errors', fix: 'Track every minus through the whole computation. Differentiating your antiderivative catches nearly all of these in five seconds.' },
  'chain-rule': { label: 'Missing the chain rule', fix: 'Whenever the inside is not plain $x$, you owe a factor of $u\'$ — or a division by it when integrating.' },
  'inverse-op': { label: 'Differentiating vs integrating', fix: 'You ran the operation backwards. Before you start, say out loud which direction you are going.' },
  'dropped-factor': { label: 'Dropped constants & factors', fix: 'A coefficient, a $\\frac12$, or a whole term went missing. Rebuild the last line slowly and check nothing evaporated.' },
  inverted: { label: 'Inverted / reversed', fix: 'The pieces were right but in the wrong order — numerator and denominator swapped, or top and bottom curves reversed. Write the formula out before substituting.' },
  'formula-confusion': { label: 'Formula mix-ups', fix: 'Two formulas look alike and you reached for the wrong one. Write the pair side by side and note the one thing that distinguishes them.' },
  'power-rule': { label: 'Exponent bookkeeping', fix: 'Raise the power, then divide by the **new** power. Off-by-one on an exponent is its own distinct habit.' },
  'algebra-slip': { label: 'Algebra slips', fix: 'The calculus was right, the arithmetic was not. Slow down on the last two lines.' },
  cancelling: { label: 'Illegal cancelling', fix: 'You can cancel factors, never terms. If it is joined by $+$ or $-$, it stays.' },
  distributing: { label: 'Illegal distributing', fix: 'Roots, logs and squares do not distribute over sums. Test with numbers whenever you are tempted.' },
  'off-by-one': { label: 'Off-by-one errors', fix: 'Index shifts, $b_{n+1}$ vs $b_n$, endpoints included or not. Write out the first two terms explicitly.' },
  'test-logic': { label: 'Test misapplied', fix: 'You used a real theorem to conclude something it does not license. Write the test\u2019s exact statement — hypotheses and conclusion — before applying it. The Divergence Test only proves divergence; comparison tests need positive terms; the Integral Test gives a verdict, never a value.' },
  endpoints: { label: 'Endpoints untested', fix: 'The Ratio Test gives the open interval and is inconclusive at the ends. Substitute each endpoint back in and run a separate test on the numeric series you get — the two ends often disagree.' },
  setup: { label: 'Wrong setup', fix: 'The method was right but the arrangement was not — a decomposition form, a degree check, a centre. Sanity-check the shape before solving: unknowns should equal the denominator degree, and the fraction must be proper.' },
  limits: { label: 'Limits not converted', fix: 'You changed the variable but kept the old limits. Convert them the moment you write the new integral sign, or undo the substitution before evaluating.' },
  improper: { label: 'Improper integral missed', fix: 'Check the integrand for infinities inside the interval, not just at the endpoints. FTC does not reach across a discontinuity.' },
  conceptual: { label: 'Concept gaps', fix: 'Not a slip — the underlying idea needs another pass. Read the topic primer before drilling it again.' },
  other: { label: 'Other', fix: '' },
};

// Ordered most-specific first; the first match wins.
const ERROR_RULES = [
  // a diagnosis that *opens* by naming the sign is a sign error, whatever else it mentions
  ['sign', /^(sign|signs)\b|^sign[.,]|^both signs|^overall sign/],
  ['chain-rule', /chain rule|inner derivative|forgot the chain|multiply by the inside|inner coefficient|divide by the inner|derivative of the inside/],
  ['cancelling', /cancel/],
  ['distributing', /distribut|does not split|factored the sum|split the fraction|break it up|no rule for/],
  ['inverse-op', /you differentiated|differentiated instead|is the \*?\*?derivative|that is the derivative|you integrated .*instead|never got applied|is the antiderivative of/],
  ['off-by-one', /off by one|one too (many|few)|index (shift|start)|first omitted|shifted the|inequality (is |must be )?strict|endpoint|included|excluded/],
  ['power-rule', /exponent|power rule|raise the power|new (power|exponent)|squared? (first|it|the)|must be \*?\*?squared|drop by one|increase by one/],
  ['inverted', /invert|upside down|reversed|swapped|order reversed|wrong order|backwards|other way|flipped\b(?!.*sign)|numerator .*denominator|radii reversed/],
  ['sign', /\bsign\b|minus|sign (error|slip|flip)|negative(?! exponent)|two negatives/],
  ['formula-confusion', /that is (the|a|just) |different (formula|quantity|function|series|integral|rule|thing)|belongs to|wrong (template|formula|inverse|rule)|you used the |is the (volume|area|circumference|sum|value|closed form)|that would be|mnemonic|\bis what\b/],
  ['dropped-factor', /forgot|is missing|missing the|you dropped|never (subtract|divid|multipli|got)|dropped the|left out|without the|no coefficient/],
  ['conceptual', /inconclusive|only (works|applies|when|ever|if)|never (proves|says|equal)|cannot|does not (prove|apply|mean|follow|force|help)|is not (sufficient|enough|general)|requires|impossible|contradiction|proves nothing|says nothing|one-way|useless/],
];

/** Classify a distractor. Explicit `err` wins; otherwise infer from the diagnosis text. */
export function errorTypeOf(choice) {
  if (!choice) return 'other';
  if (choice.err && ERROR_TYPES[choice.err]) return choice.err;
  const w = String(choice.why || '').toLowerCase();
  if (!w) return 'other';
  for (const [type, re] of ERROR_RULES) if (re.test(w)) return type;
  return 'algebra-slip';
}

// ---------------------------------------------------------------
let S = load();

function load() {
  try {
    const raw = JSON.parse(localStorage.getItem(KEY));
    if (raw && raw.v === SCHEMA) return migrateShape(raw);
    if (raw && raw.v === 1) return migrateV1(raw);
  } catch (e) { /* corrupt -> reset */ }
  return DEFAULTS();
}

/** fill in any key added after this save was written.
 *  NB: every merge target must be a FRESH object. Assigning `raw` onto `d`
 *  first would alias d.settings to raw.settings, and the subsequent merge
 *  would be a no-op — silently dropping every newly-added default. */
function migrateShape(raw) {
  const d = DEFAULTS();
  const out = Object.assign({}, d, raw);
  out.settings = Object.assign({}, d.settings, raw.settings || {});
  out.day = Object.assign({}, d.day, raw.day || {});
  out.totals = Object.assign({}, d.totals, raw.totals || {});
  out.exam = Object.assign({}, d.exam, raw.exam || {});
  return out;
}

function migrateV1(raw) {
  const out = migrateShape(raw);
  out.v = SCHEMA;
  return out;
}

let saveT = null;
function flush() {
  clearTimeout(saveT); saveT = null;
  try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { /* quota */ }
}
function save() {
  clearTimeout(saveT);
  saveT = setTimeout(flush, 120);
}
// Writes are debounced; make sure a pending one survives the tab closing.
if (typeof window !== 'undefined') {
  addEventListener('pagehide', () => saveT && flush());
  addEventListener('visibilitychange', () => { if (document.visibilityState === 'hidden' && saveT) flush(); });
}

export const state = () => S;
export const settings = () => S.settings;
export function setSetting(k, v) { S.settings[k] = v; save(); }

// cross-session memory of which templates were served (anti-repeat)
export const recent = () => S.recent;
export function pushRecent(k, a) {
  S.recent.push({ k, a: a || '' });
  if (S.recent.length > 60) S.recent.splice(0, S.recent.length - 60);
  save();
}

export function skill(key) {
  if (!S.skills[key]) S.skills[key] = { seen: 0, right: 0, streak: 0, level: 0, due: 0, ease: 2.3, lastTs: 0, ms: 0 };
  const s = S.skills[key];
  if (s.ms == null) s.ms = 0;
  return s;
}

// ---------------------------------------------------------------
// recording answers
// ---------------------------------------------------------------

/** Record one graded answer. Returns {rec, unlocked} */
export function record(skillKey, correct, ms, ref, promptText, chosenChoice) {
  const s = skill(skillKey);
  s.seen++; s.lastTs = Date.now(); s.ms += ms || 0;
  S.totals.answered++; S.totals.secs += Math.round((ms || 0) / 1000);

  const today = dayKey();
  S.activity[today] = (S.activity[today] || 0) + 1;

  if (correct) {
    s.right++; s.streak++;
    S.totals.right++;
    // level up after two consecutive correct (one, the first time at level 0)
    if (s.streak >= (s.level === 0 ? 1 : 2)) { s.level = Math.min(MAX_LEVEL, s.level + 1); s.streak = 0; }
    s.ease = Math.min(2.8, s.ease + 0.06);
    s.due = Date.now() + INTERVAL[s.level] * DAY * (s.ease / 2.3);
    removeMissed(ref);
  } else {
    s.streak = 0;
    s.level = Math.max(0, s.level - (s.level >= 4 ? 2 : 1));
    s.ease = Math.max(1.4, s.ease - 0.22);
    s.due = Date.now();                       // resurface soon
    addMissed(ref, skillKey, promptText);
    const et = errorTypeOf(chosenChoice);
    S.errors[et] = (S.errors[et] || 0) + 1;
  }
  save();
  return s;
}

function refId(ref) { return ref ? (ref.id || `${ref.gid}#${ref.seed}`) : ''; }

function addMissed(ref, skillKey, promptText) {
  if (!ref) return;
  const id = refId(ref);
  const found = S.missed.find(m => refId(m.ref) === id);
  if (found) { found.n++; found.ts = Date.now(); return; }
  S.missed.unshift({ ref, skill: skillKey, prompt: promptText || '', ts: Date.now(), n: 1 });
  if (S.missed.length > 300) S.missed.length = 300;
}
function removeMissed(ref) {
  if (!ref) return;
  const id = refId(ref);
  const i = S.missed.findIndex(m => refId(m.ref) === id);
  if (i >= 0) S.missed.splice(i, 1);
}
export const missed = () => S.missed;
export function clearMissed() { S.missed = []; save(); }

// ---------------------------------------------------------------
// starred problems
// ---------------------------------------------------------------
export const starred = () => S.starred;
export function isStarred(ref) { return S.starred.some(m => refId(m.ref) === refId(ref)); }
export function toggleStar(ref, skillKey, promptText) {
  const id = refId(ref);
  const i = S.starred.findIndex(m => refId(m.ref) === id);
  if (i >= 0) { S.starred.splice(i, 1); save(); return false; }
  S.starred.unshift({ ref, skill: skillKey, prompt: promptText || '', ts: Date.now() });
  if (S.starred.length > 200) S.starred.length = 200;
  save();
  return true;
}

// ---------------------------------------------------------------
// notes
// ---------------------------------------------------------------
export const noteFor = k => S.notes[k] || '';
export function setNote(k, txt) {
  if (txt && txt.trim()) S.notes[k] = txt; else delete S.notes[k];
  save();
}

// ---------------------------------------------------------------
// scheduling / weighting
// ---------------------------------------------------------------

/** Priority weight for a skill: higher = more urgent to drill. */
export function weight(key) {
  const s = S.skills[key];
  if (!s || s.seen === 0) return 3.2;                       // never seen: high
  const acc = s.right / s.seen;
  let w = 1 + (1 - acc) * 3.4 + (MAX_LEVEL - s.level) * 0.42;
  if (Date.now() >= s.due) w += 1.5;                        // due for review
  const ageDays = (Date.now() - s.lastTs) / DAY;
  w += Math.min(1.2, ageDays * 0.09);                       // decay: stale skills resurface
  return w;
}

export function dueCount(keys) {
  const now = Date.now();
  return keys.filter(k => { const s = S.skills[k]; return s && s.seen > 0 && now >= s.due; }).length;
}

/** 0..1 mastery for a set of skill keys. */
export function mastery(keys) {
  if (!keys.length) return 0;
  let t = 0;
  for (const k of keys) { const s = S.skills[k]; t += s ? s.level / MAX_LEVEL : 0; }
  return t / keys.length;
}

/** Suggested difficulty band for a skill, when adaptive mode is on. */
export function bandFor(key) {
  const s = S.skills[key];
  if (!s || s.seen < 2) return 1;
  if (s.level >= 5) return 4;      // so the adaptive window can reach difficulty 5
  if (s.level >= 4) return 3;
  if (s.level >= 2) return 2;
  return 1;
}

// ---------------------------------------------------------------
// sessions, days, achievements
// ---------------------------------------------------------------
export function endSession(mode, n, right, secs) {
  S.history.unshift({ ts: Date.now(), mode, n, right, secs });
  if (S.history.length > 400) S.history.length = 400;
  save();
  return checkAchievements({ lastN: n, lastRight: right, lastSecs: secs });
}

function dayKey(d = new Date()) { return d.toISOString().slice(0, 10); }

/** Daily streak bookkeeping — call once per app load / session start. */
export function touchDay() {
  const today = dayKey();
  const d = S.day;
  if (d.last === today) return d.count;
  const yest = dayKey(new Date(Date.now() - DAY));
  d.count = d.last === yest ? d.count + 1 : 1;
  d.best = Math.max(d.best || 0, d.count);
  d.last = today; save();
  return d.count;
}

export function bumpBest(run) {
  if (run > S.totals.best) { S.totals.best = run; save(); }
}

export const activity = () => S.activity;
export const errors = () => S.errors;

// ---- learn program ----------------------------------------------
export function lesson(id) { return S.lessons[id] || { read: 0, drilled: 0 }; }
export function markLessonRead(id) {
  const l = S.lessons[id] || { read: 0, drilled: 0 };
  if (!l.read) l.read = Date.now();
  S.lessons[id] = l; save();
}
export function markLessonDrilled(id) {
  const l = S.lessons[id] || { read: 0, drilled: 0 };
  l.drilled = (l.drilled || 0) + 1;
  if (!l.read) l.read = Date.now();
  S.lessons[id] = l; save();
}
/** Fixed-ladder progress: ladder[itemId] = 1 (latest answer right) | 0 (wrong). */
export function recordLadder(id, itemId, right) {
  const l = S.lessons[id] || { read: 0, drilled: 0 };
  (l.ladder = l.ladder || {})[itemId] = right ? 1 : 0;
  S.lessons[id] = l; save();
}
export function ladderStats(id) {
  const def = lessonById(id);
  const items = def && def.plain ? (def.practice || []) : [];
  const lad = (S.lessons[id] || {}).ladder || {};
  return {
    n: items.length,
    tried: items.filter(p => p.id in lad).length,
    right: items.filter(p => lad[p.id] === 1).length,
    ladder: lad,
  };
}
export function lessonDone(id) {
  const l = lesson(id);
  if (!l.read) return false;
  const st = ladderStats(id);
  // intent: done = attempted every ladder item (right or wrong), not all correct
  return st.n ? st.tried === st.n : l.drilled > 0;
}

export function setExam(date, name) { S.exam = { date: date || null, name: name || '' }; save(); }
export const exam = () => S.exam;

export function daysToExam() {
  if (!S.exam.date) return null;
  const ms = new Date(S.exam.date + 'T23:59:59').getTime() - Date.now();
  return Math.ceil(ms / DAY);
}

// ---------------------------------------------------------------
export const ACHIEVEMENTS = [
  { id: 'first', name: 'First Contact', desc: 'Answer your first question', test: s => s.totals.answered >= 1 },
  { id: 'ten-run', name: 'On a Roll', desc: '10 correct in a row', test: s => s.totals.best >= 10 },
  { id: 'twentyfive-run', name: 'Locked In', desc: '25 correct in a row', test: s => s.totals.best >= 25 },
  { id: 'century', name: 'Century', desc: 'Answer 100 questions', test: s => s.totals.answered >= 100 },
  { id: 'five-hundred', name: 'Five Hundred', desc: 'Answer 500 questions', test: s => s.totals.answered >= 500 },
  { id: 'perfect', name: 'Clean Sweep', desc: 'Finish a set of 10+ with no misses', test: (s, x) => x.lastN >= 10 && x.lastRight === x.lastN },
  { id: 'week', name: 'Seven Straight', desc: 'Practise 7 days in a row', test: s => (s.day.best || 0) >= 7 },
  { id: 'month', name: 'Thirty Straight', desc: 'Practise 30 days in a row', test: s => (s.day.best || 0) >= 30 },
  { id: 'empty-bank', name: 'Debt Free', desc: 'Empty a mistake bank of 10 or more', test: (s, x) => x.bankEmptied },
  { id: 'unit-master', name: 'Unit Master', desc: 'Reach full mastery in every topic of a unit', test: (s, x) => x.unitMastered },
  { id: 'all-units', name: 'Grand Tour', desc: 'Practise every unit at least once', test: (s, x) => x.allUnits },
  { id: 'hour', name: 'Deep Work', desc: 'Drill for 60 minutes total', test: s => s.totals.secs >= 3600 },
  { id: 'toolkit', name: 'Foundations First', desc: 'Reach level 3+ in every Prerequisite topic', test: (s, x) => x.toolkitSolid },
];

let achContext = {};
/** Feed derived facts the predicates need (computed in session.js / ui.js). */
export function setAchievementContext(o) { achContext = Object.assign(achContext, o); }

export function checkAchievements(extra = {}) {
  const ctx = Object.assign({ lastN: 0, lastRight: 0 }, achContext, extra);
  const unlocked = [];
  for (const a of ACHIEVEMENTS) {
    if (S.achievements.includes(a.id)) continue;
    let ok = false;
    try { ok = !!a.test(S, ctx); } catch (e) { ok = false; }
    if (ok) { S.achievements.push(a.id); unlocked.push(a); }
  }
  if (unlocked.length) save();
  return unlocked;
}
export const achievements = () => S.achievements;

// ---------------------------------------------------------------
export function resetAll() { S = DEFAULTS(); localStorage.removeItem(KEY); save(); }
export function exportJSON() { return JSON.stringify(S, null, 2); }
export function importJSON(txt) {
  const o = JSON.parse(txt);
  if (!o || (o.v !== SCHEMA && o.v !== 1)) throw new Error('Not a Calctutor save file');
  S = o.v === 1 ? migrateV1(o) : migrateShape(o);
  flush();
}
