// tools/check-lessons.mjs — acceptance check for rewritten lessons (run fin).
//   node tools/check-lessons.mjs ln-remainder [ln-taylor ...]   check named lessons (a stub = FAIL)
//   node tools/check-lessons.mjs                                check every non-stub lesson
// Contract: .hnic/context/fin-contract.md. Exit 1 on any error.
import { readdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { LESSONS } from '../js/bank/lessons.js';
import { normalize, ALL_SKILLS } from '../js/bank/index.js';
import { isCheckable } from '../js/mathcheck.js';
import { EXPLORERS } from '../js/explore.js';

const DIR = join(dirname(fileURLToPath(import.meta.url)), '../js/bank/lessons');
const named = process.argv.slice(2);
const ids = named.length ? named : readdirSync(DIR).filter(f => f.startsWith('ln-')).map(f => f.replace(/\.js$/, ''));
const errs = [], warns = [];
const STAGES = ['warmup', 'core', 'exam'];
const LABS = new Set(EXPLORERS.map(e => e.id));
// ex3 contract: try / w.ask = 2-5 choices, exactly one ok, every choice has t + why
const checkMC = (tag, t, E) => {
  if (!t || !t.q) return E(`${tag}: needs q`);
  const cs = Array.isArray(t.choices) ? t.choices : [];
  if (cs.length < 2 || cs.length > 5) E(`${tag}: ${cs.length} choices, need 2-5`);
  const oks = cs.filter(c => c && c.ok).length;
  if (oks !== 1) E(`${tag}: ${oks} ok choices, need exactly 1`);
  cs.forEach((c, j) => { if (!c || !c.t || !c.why) E(`${tag}: choice ${j + 1} needs t and why`); });
};

const strings = (o, out = []) => {
  if (typeof o === 'string') out.push(o);
  else if (Array.isArray(o)) o.forEach(x => strings(x, out));
  else if (o && typeof o === 'object') Object.values(o).forEach(x => strings(x, out));
  return out;
};
const dollars = s => (s.replace(/\\\$/g, '').match(/\$/g) || []).length;
const junk = s => /NaN|\[object|undefined\}|\{undefined|\$undefined/.test(s);

let checked = 0;
for (const id of ids) {
  const E = m => errs.push(`${id}: ${m}`), W = m => warns.push(`${id}: ${m}`);
  let l;
  try { l = (await import(join(DIR, id + '.js'))).default; } catch (e) { E(`import failed: ${e.message}`); continue; }
  if (!l) { if (named.length) E('still a stub (export default null)'); continue; }
  checked++;
  const old = LESSONS.find(x => x.id === id);
  if (!old) { E('no lesson with this id in lessons.js'); continue; }
  if (l.id !== id) E(`id is "${l.id}", must be "${id}"`);
  for (const k of ['n', 'dates', 'unit', 'title']) if (k in l) W(`sets "${k}" — leave schedule fields to lessons.js`);

  // ---- teaching ----
  for (const k of ['goal', 'why', 'plain']) if (typeof l[k] !== 'string' || !l[k].trim()) E(`missing ${k}`);
  if ((l.plain || '').length < 400) E('plain: under 400 chars — the big idea needs a real plain-English explanation');
  if (!Array.isArray(l.prereq) || l.prereq.length < 3 || l.prereq.some(p => !p.term || !p.means)) E('prereq: need 3+ {term, means}');
  const secs = l.sections || [];
  if (secs.length < 5) E(`sections: ${secs.length}, need 5+ (one idea each, built from the ground up)`);
  secs.forEach((s, i) => { if (!s.h || (s.body || '').length < 250) E(`section ${i + 1}: needs h and a body of 250+ chars`); });
  if (secs.filter(s => s.check && s.check.q && s.check.a).length < 3) E('sections: need 3+ with a quick check {q, a}');
  if (!Array.isArray(l.recipe) || l.recipe.length < 3) E('recipe: need 3+ numbered steps');
  const worked = l.worked || [];
  if (worked.length < 3) E(`worked: ${worked.length}, need 3+ (easy -> exam level)`);
  worked.forEach((w, i) => { if (!w.q || !Array.isArray(w.steps) || w.steps.length < 4) E(`worked ${i + 1}: needs q and 4+ steps`); });
  if (!Array.isArray(l.traps) || l.traps.length < 3) E('traps: need 3+');

  // ---- interactive fields (ex3 contract, all optional) ----
  secs.forEach((s, i) => {
    if (s.widget) {
      if (!LABS.has(s.widget.lab)) E(`section ${i + 1}: widget lab "${s.widget.lab}" is not an explorer id (${[...LABS].join(', ')})`);
      if (s.widget.set != null && (typeof s.widget.set !== 'object' || Array.isArray(s.widget.set))) E(`section ${i + 1}: widget.set must be an object`);
      const ex = EXPLORERS.find(e => e.id === s.widget.lab);
      if (ex && s.widget.set && typeof s.widget.set === 'object') for (const [k, v] of Object.entries(s.widget.set)) {
        const c = ex.controls.find(c => c.key === k);
        if (!c) E(`section ${i + 1}: widget.set key "${k}" is not a control of ${ex.id}`);
        else if (c.kind === 'pick' && !c.options.includes(v)) E(`section ${i + 1}: widget.set ${k}="${v}" not in options`);
        else if (c.kind === 'range' && !(v >= c.min && v <= c.max)) E(`section ${i + 1}: widget.set ${k}=${v} outside ${c.min}-${c.max}`);
      }
    }
    if (s.try) checkMC(`section ${i + 1} try`, s.try, E);
  });
  worked.forEach((w, i) => (w.ask || []).forEach((a, j) => {
    const n = (w.steps || []).length;
    if (!a) return E(`worked ${i + 1} ask ${j + 1}: empty`);
    if (!Number.isInteger(a.at) || a.at < 2 || a.at > n) E(`worked ${i + 1} ask ${j + 1}: at=${a.at} must be 2-${n} (step 1 is always shown)`);
    checkMC(`worked ${i + 1} ask ${j + 1}`, a, E);
  }));
  if (l.cards != null) {
    if (!Array.isArray(l.cards)) E('cards: must be an array');
    else l.cards.forEach((c, i) => { if (!c || !c.f || !c.b) E(`card ${i + 1}: needs f and b`); });
  }
  if (/\b(clearly|obviously|trivially|it is easy to see)\b/i.test(strings([l.plain, secs, worked]).join(' '))) E('banned word (clearly/obviously/trivially/"it is easy to see")');
  const sent = (l.plain || '').replace(/\$[^$]*\$/g, 'X').split(/[.!?]+\s/).filter(s => s.trim());
  const avg = sent.reduce((n, s) => n + s.trim().split(/\s+/).length, 0) / Math.max(1, sent.length);
  if (avg > 24) E(`plain: average sentence is ${avg.toFixed(0)} words — shorten (limit 24)`);

  // ---- practice ladder ----
  const P = l.practice || [];
  if (P.length < 10 || P.length > 14) E(`practice: ${P.length} items, need 10-14`);
  const slug = id.replace(/^ln-/, '');
  const drillSkills = new Set(old.drill || []);
  const archs = new Set(), pids = new Set(), fmts = {};
  let lastStage = 0;
  P.forEach((raw, i) => {
    const tag = `practice ${i + 1} (${raw.id})`;
    if (!new RegExp(`^lp-${slug}-\\d\\d$`).test(raw.id || '')) E(`${tag}: id must be lp-${slug}-NN`);
    if (pids.has(raw.id)) E(`${tag}: duplicate id`); pids.add(raw.id);
    if (!raw.arch) E(`${tag}: no arch`); else if (archs.has(raw.arch)) E(`${tag}: arch "${raw.arch}" repeats — every item must be a different problem type`);
    archs.add(raw.arch);
    const skill = `${raw.unit}/${raw.topic}`;
    if (!ALL_SKILLS.includes(skill)) E(`${tag}: "${skill}" is not a real skill`);
    else if (!drillSkills.has(skill)) E(`${tag}: skill "${skill}" is not in this lesson's drill list (${[...drillSkills].join(', ')})`);
    const st = STAGES.indexOf(raw.stage);
    if (st < 0) E(`${tag}: stage must be warmup|core|exam`); else { if (st < lastStage) E(`${tag}: stages out of order`); lastStage = st; }
    if (!(raw.diff >= 1 && raw.diff <= 5)) E(`${tag}: diff 1-5`);
    if (raw.stage === 'warmup' && raw.diff > 2) E(`${tag}: warmup must be diff 1-2`);
    if (raw.stage === 'exam' && raw.diff < 4) E(`${tag}: exam stage must be diff 4-5`);
    const fmt = raw.tf ? 'tf' : (raw.fmt || 'mc');
    if (!['mc', 'tf', 'free', 'multi', 'error'].includes(fmt)) E(`${tag}: unknown fmt ${fmt}`);
    fmts[fmt] = (fmts[fmt] || 0) + 1;
    if (!raw.prompt || raw.prompt.length < 20) E(`${tag}: prompt missing/too short`);
    if (!Array.isArray(raw.hints) || raw.hints.length < 2) E(`${tag}: need 2+ hints (nudge -> near-answer)`);
    if (!Array.isArray(raw.steps) || raw.steps.length < (raw.diff >= 3 ? 3 : 2)) E(`${tag}: worked solution too short`);
    if (!raw.recall) E(`${tag}: no recall line`);
    const p = normalize({ ...raw, choices: (raw.choices || []).map(c => ({ ...c })), skill });
    const keys = p.choices.filter(c => c.ok);
    if (fmt === 'multi' ? keys.length < 2 : keys.length !== 1) E(`${tag}: ${keys.length} correct choices`);
    if (p.choices.length < (fmt === 'tf' ? 2 : 4) || (fmt === 'tf' && p.choices.length !== 2)) E(`${tag}: ${p.choices.length} choices after dedupe`);
    if (fmt === 'multi' && p.choices.some(c => !c.why)) E(`${tag}: multi needs a why on every choice`);
    for (const c of p.choices) if (!c.ok && (!c.why || c.why.length < 40)) E(`${tag}: distractor "${String(c.t).slice(0, 30)}" needs a real diagnosis (40+ chars: what mistake produces it)`);
    if (fmt === 'error' && !(raw.work && raw.work.length >= 3)) E(`${tag}: error item needs 3+ work lines`);
    if (fmt === 'free' && !isCheckable(p.choices) && !(raw.accept && raw.accept.length)) E(`${tag}: free key is not typed-answer checkable and has no accept[]`);
  });
  if (Object.keys(fmts).length < 4) E(`practice: only formats ${Object.keys(fmts).join(',')} — need 4+ of mc/tf/free/multi/error`);
  for (const [f, n] of Object.entries(fmts)) if (n > 5) E(`practice: ${n} items are ${f} — max 5 per format`);
  if (P.filter(p => p.stage === 'exam').length < 3) E('practice: need 3+ exam-stage items');
  if (P.filter(p => p.stage === 'warmup').length < 2) E('practice: need 2+ warmup items');

  for (const s of strings(l)) {
    if (dollars(s) % 2) E(`unbalanced $ in: "${s.slice(0, 70)}"`);
    if (junk(s)) E(`junk token in: "${s.slice(0, 70)}"`);
  }
}

console.log(`checked ${checked} rewritten lesson(s) of ${ids.length}`);
if (warns.length) { console.log(`WARNINGS (${warns.length}):`); warns.forEach(w => console.log('  ! ' + w)); }
console.log(`ERRORS: ${errs.length}`);
errs.forEach(e => console.log('  x ' + e));
process.exit(errs.length ? 1 : 0);
