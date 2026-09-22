// ---------------------------------------------------------------
// session.js — question selection + running-session state
// ---------------------------------------------------------------
import { candidates, materialize, LIVE_SKILLS, liveSkillsOf, UNITS } from './bank/index.js';
import { EXAMS, GATEWAYS, examById, gatewayById, coveredSkills, OFF_SYLLABUS } from './bank/course.js';
import * as store from './store.js';
import { rand, hash } from './util.js';

export const MODES = {
  rapid: {
    key: 'rapid', name: 'Rapid Fire', glyph: '⚡', accent: 'lime', count: 20, timed: true, secs: 60,
    blurb: 'Weighted across everything you have unlocked. Fast, keyboard-only, instant feedback.',
  },
  review: {
    key: 'review', name: 'Cumulative Review', glyph: '↻', accent: 'cyan', count: 20, timed: false,
    blurb: 'Deliberately interleaved: old units resurface next to new ones so nothing quietly rots.',
  },
  mistakes: {
    key: 'mistakes', name: 'Mistake Bank', glyph: '⌾', accent: 'coral', count: 15, timed: false,
    blurb: 'Only what you have gotten wrong. Answer one correctly and it leaves the bank.',
  },
  exam: {
    key: 'exam', name: 'Exam Simulation', glyph: '⏱', accent: 'coral', count: 25, timed: true, secs: 150,
    defer: true,
    blurb: 'Full spread, timed, and no feedback until the end — like the real thing.',
  },
  cram: {
    key: 'cram', name: 'Cram Session', glyph: '◆', accent: 'amber', count: 30, timed: false,
    blurb: 'Everything due for review plus your weakest topics, hardest first. For the night before.',
  },
  starred: {
    key: 'starred', name: 'Starred', glyph: '★', accent: 'amber', count: 15, timed: false,
    blurb: 'Problems you flagged to come back to.',
  },
  topic: {
    key: 'topic', name: 'Topic Drill', glyph: '◎', accent: 'violet', count: 12, timed: false,
    blurb: 'One skill at a time, until it is automatic.',
  },
  unit: {
    key: 'unit', name: 'Unit Drill', glyph: '▦', accent: 'violet', count: 16, timed: false,
    blurb: 'Every topic in one unit, mixed.',
  },
  custom: {
    key: 'custom', name: "Today's Plan", glyph: '◈', accent: 'amber', count: 16, timed: false,
    blurb: 'The topics your study plan scheduled for today.',
  },
  covered: {
    key: 'covered', name: 'Covered So Far', glyph: '◐', accent: 'lime', count: 20, timed: false,
    blurb: 'Only what Dr. McWhorter has actually lectured on to date. Nothing you have not seen yet.',
  },
  examscope: {
    key: 'examscope', name: 'Exam Practice', glyph: '✦', accent: 'coral', count: 20, timed: true, secs: 150,
    defer: true,
    blurb: 'Timed, no feedback until the end, scoped to one of his real exams.',
  },
  gateway: {
    key: 'gateway', name: 'Gateway', glyph: '⊘', accent: 'violet', count: 20, timed: true, secs: 90,
    blurb: 'The 30-minute mastery check. Fast and mechanical — exactly what a Gateway is.',
  },
};

/** Weighted pick without replacement bias — returns a skill key. */
function pickSkill(skills, recent) {
  const live = skills.filter(s => LIVE_SKILLS.includes(s));
  if (!live.length) return null;
  const ws = live.map(s => {
    let w = store.weight(s);
    const back = recent.lastIndexOf(s);
    if (back >= 0) w *= 0.18 + 0.16 * (recent.length - back);   // discourage immediate repeats
    return Math.max(0.02, w);
  });
  const total = ws.reduce((a, b) => a + b, 0);
  let t = rand() * total;
  for (let i = 0; i < live.length; i++) { t -= ws[i]; if (t <= 0) return live[i]; }
  return live[live.length - 1];
}

// The bank uses difficulties 1-5. `all` must list every one of them, or the
// hardest content — including most of his real check-ins — is unreachable no
// matter how well you are doing.
export const DIFF_BAND = { easy: [1, 2], medium: [2, 3], hard: [3, 4, 5], all: [1, 2, 3, 4, 5] };

/** Turn a skill into a concrete problem reference, honouring the difficulty filter. */
function refFor(skillKey, used, salt, opts = {}) {
  const all = candidates([skillKey]);
  if (!all.length) return null;
  let pool = all;

  // difficulty filter — fall back to the full pool if it empties the options
  let allowed = DIFF_BAND[opts.difficulty] || DIFF_BAND.all;
  if (opts.adaptive) {
    const band = store.bandFor(skillKey);
    allowed = allowed.filter(d => Math.abs(d - band) <= 1);
    if (!allowed.length) allowed = DIFF_BAND[opts.difficulty] || DIFF_BAND.all;
  }
  // Narrowing to a single source turns a session into the same question
  // twelve times over, which is worse than serving something slightly off-band.
  const filtered = pool.filter(c => (c.diffs ? c.diffs.some(d => allowed.includes(d)) : allowed.includes(c.diff)));
  if (filtered.length >= 2 || (filtered.length === 1 && filtered[0].gen)) pool = filtered;

  // Exhausting the unseen problems inside the band is a reason to step outside
  // it, not a reason to show the same question again.
  let src = pool.filter(c => c.gen || !used.has(c.id));
  if (!src.length) src = all.filter(c => c.gen || !used.has(c.id));
  if (!src.length) src = pool;
  // favour generators — they never run out
  const gens = src.filter(c => c.gen);
  const pick = gens.length && rand() < 0.68 ? gens[Math.floor(rand() * gens.length)]
    : src[Math.floor(rand() * src.length)];

  if (pick.gen) {
    // A generator with 100 variants still draws a duplicate roughly half the
    // time over a 12-question session — the birthday problem, and exactly what
    // "I keep seeing the same question" feels like. Re-roll the seed instead.
    for (let attempt = 0; attempt < 12; attempt++) {
      const ref = { gid: pick.gid, seed: (hash(pick.gid + ':' + salt + ':' + attempt + ':' + rand()) >>> 0) };
      const made = materialize(ref);
      if (!made) return ref;
      if (!used.has(made.prompt)) { used.add(made.prompt); return ref; }
    }
    return { gid: pick.gid, seed: (hash(pick.gid + ':' + salt + ':' + rand()) >>> 0) };
  }
  used.add(pick.id);
  return { id: pick.id };
}

/** Skills for a given mode/scope. */
/** Skills that count as "on the syllabus" — used for the default drill pool. */
export const SYLLABUS_SKILLS = LIVE_SKILLS.filter(s => !OFF_SYLLABUS[s.split('/')[0]]);

export function scopeSkills(mode, scope) {
  if (mode === 'topic') return [scope];
  if (mode === 'unit') return liveSkillsOf(scope);
  if (mode === 'custom') return (Array.isArray(scope) ? scope : []).filter(s => LIVE_SKILLS.includes(s));
  if (mode === 'covered') {
    const c = coveredSkills().filter(s => LIVE_SKILLS.includes(s));
    return c.length ? c : SYLLABUS_SKILLS;
  }
  if (mode === 'examscope') {
    const e = examById(scope);
    return e ? e.skills.filter(s => LIVE_SKILLS.includes(s)) : SYLLABUS_SKILLS;
  }
  if (mode === 'gateway') {
    const g = gatewayById(scope);
    return g ? g.skills.filter(s => LIVE_SKILLS.includes(s)) : SYLLABUS_SKILLS;
  }
  // everything else defaults to the syllabus, not the whole bank
  return SYLLABUS_SKILLS;
}

export function build({ mode, scope, count, difficulty, adaptive, refs }) {
  const cfg = MODES[mode];
  const st = store.settings();
  const n = count || cfg.count || st.length;
  const opts = {
    difficulty: difficulty || st.difficulty || 'all',
    adaptive: adaptive != null ? adaptive : st.adaptive,
  };
  const queue = [];

  // an explicit playlist — used by a lesson to drill exactly his check-ins
  if (refs && refs.length) {
    return session(cfg, refs.slice(0, Math.max(n, refs.length)), scope, opts);
  }

  if (mode === 'mistakes' || mode === 'starred') {
    const bank = (mode === 'mistakes' ? store.missed() : store.starred()).slice(0, n);
    for (const m of bank) queue.push(m.ref);
    return session(cfg, queue, scope, opts);
  }

  const skills = scopeSkills(mode, scope);
  const used = new Set();
  const recent = [];

  if (mode === 'cram') {
    // everything due, then the weakest, hardest-first
    const now = Date.now();
    const ranked = skills
      .map(s => ({ s, w: store.weight(s), due: (store.state().skills[s] || {}).due <= now }))
      .sort((a, b) => (b.due - a.due) || (b.w - a.w));
    for (const { s } of ranked) {
      if (queue.length >= n) break;
      const ref = refFor(s, used, `cram${queue.length}`, { ...opts, adaptive: false, difficulty: 'hard' });
      if (ref) { queue.push(ref); recent.push(s); }
    }
    while (queue.length < n) {
      const sk = pickSkill(skills, recent);
      const ref = sk && refFor(sk, used, `cram${queue.length}`, opts);
      if (!ref) break;
      queue.push(ref); recent.push(sk);
    }
    return session(cfg, queue, scope, opts);
  }

  if (mode === 'exam' || mode === 'examscope') {
    // proportional spread across units, so the sim always covers the course
    const inScope = new Set(skills);
    const units = UNITS.filter(u => liveSkillsOf(u.key).some(s => inScope.has(s)));
    const perUnit = Math.max(1, Math.floor(n / Math.max(1, units.length)));
    for (const u of units) {
      const us = liveSkillsOf(u.key).filter(s => inScope.has(s));
      for (let i = 0; i < perUnit && us.length; i++) {
        const sk = pickSkill(us, recent);
        const ref = sk && refFor(sk, used, `${mode}${i}${u.key}`, opts);
        if (ref) { queue.push(ref); recent.push(sk); }
      }
    }
    while (queue.length < n) {
      const sk = pickSkill(skills, recent);
      const ref = sk && refFor(sk, used, `${mode}${queue.length}`, opts);
      if (!ref) break;
      queue.push(ref); recent.push(sk);
    }
    shuffle(queue);
    return session(cfg, queue, scope, opts);
  }

  if (mode === 'review') {
    // interleave: never two in a row from the same unit when avoidable
    let lastUnit = null;
    for (let i = 0; i < n; i++) {
      let sk = null;
      for (let tries = 0; tries < 6; tries++) {
        const c = pickSkill(skills, recent);
        if (!c) break;
        if (c.split('/')[0] !== lastUnit) { sk = c; break; }
        sk = c;
      }
      const ref = sk && refFor(sk, used, `${mode}${i}`, opts);
      if (!ref) break;
      queue.push(ref); recent.push(sk); lastUnit = sk.split('/')[0];
      if (recent.length > 6) recent.shift();
    }
    return session(cfg, queue, scope, opts);
  }

  for (let i = 0; i < n; i++) {
    const sk = pickSkill(skills, recent);
    const ref = sk && refFor(sk, used, `${mode}${i}`, opts);
    if (!ref) break;
    queue.push(ref); recent.push(sk);
    if (recent.length > 5) recent.shift();
  }
  return session(cfg, queue, scope, opts);
}

function shuffle(a) {
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rand() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
}

function session(cfg, queue, scope, opts) {
  return {
    cfg, scope, queue, idx: 0, opts,
    results: [],           // {ref, skill, prompt, correct, ms, chosen, hinted}
    startTs: Date.now(),
    run: 0, bestRun: 0,
    hintsUsed: 0,
    current: null,
    seen: [],
  };
}

/** Materialize the problem at the cursor; skips any that fail to build. */
export function currentProblem(S) {
  while (S.idx < S.queue.length) {
    const p = materialize(S.queue[S.idx]);
    if (p && p.choices.length >= 2) { S.current = p; return p; }
    S.queue.splice(S.idx, 1);
  }
  S.current = null;
  return null;
}

export function grade(S, p, choiceIdx, ms, hinted) {
  const chosen = p.choices[choiceIdx];
  const correct = !!(chosen && chosen.ok);
  if (correct) { S.run++; S.bestRun = Math.max(S.bestRun, S.run); store.bumpBest(S.run); }
  else S.run = 0;
  store.record(p.skill, correct, ms, p.ref, p.prompt, chosen);
  S.results.push({ ref: p.ref, skill: p.skill, prompt: p.prompt, correct, ms, chosen: choiceIdx, hinted: !!hinted });
  return correct;
}

export function advance(S) { S.idx++; return currentProblem(S); }

export function finish(S) {
  const secs = Math.round((Date.now() - S.startTs) / 1000);
  const right = S.results.filter(r => r.correct).length;

  // facts the achievement predicates need
  const units = new Set(Object.keys(store.state().skills).map(k => k.split('/')[0]));
  const toolkit = liveSkillsOf('precalc');
  store.setAchievementContext({
    allUnits: units.size >= UNITS.length,
    unitMastered: UNITS.some(u => {
      const ks = liveSkillsOf(u.key);
      return ks.length > 0 && ks.every(k => (store.state().skills[k] || {}).level === store.MAX_LEVEL);
    }),
    toolkitSolid: toolkit.length > 0 && toolkit.every(k => (store.state().skills[k] || {}).level >= 3),
    bankEmptied: S.cfg.key === 'mistakes' && S.bankStart >= 10 && store.missed().length === 0,
  });

  const unlocked = store.endSession(S.cfg.key, S.results.length, right, secs);
  return { right, n: S.results.length, secs, unlocked };
}
