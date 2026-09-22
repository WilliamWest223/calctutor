// ---------------------------------------------------------------
// tools/check-bank.mjs — content self-check.
//
//   node tools/check-bank.mjs
//
// Validates every written problem and SEEDS seeded instances of every
// generator. Catches the failure modes that are invisible until a
// question shows up mid-drill:
//   - no unique correct answer
//   - a distractor that collides with the key (silently dropped, so the
//     student sees three options and the answer is easier to guess)
//   - a distractor with no diagnosis — the whole point of the app
//   - machine artifacts (NaN, [object Object]) leaking into TeX
//   - a viz spec that throws or renders nothing
// ---------------------------------------------------------------
import { OFF_SYLLABUS } from '../js/bank/course.js';
import { DIFF_BAND } from '../js/session.js';
import { STATIC, GENS, materialize, LIVE_SKILLS, ALL_SKILLS } from '../js/bank/index.js';
import { build as buildViz } from '../js/viz.js';

// 40 was far too thin — collisions between a distractor formula and the answer
// can occur for only one parameter combination in a thousand. The UI picks
// random seeds, so anything reachable must be swept.
const SEEDS = 600;

const errs = [];
const warns = [];
let nChecked = 0;

// only flag machine artifacts, never the English word "undefined"
const junk = s => /NaN|\[object|\$undefined|\{undefined|undefined\}|=undefined/.test(String(s));

function check(p, label) {
  nChecked++;
  if (!p) { errs.push(`${label}: failed to materialize`); return; }

  const keys = p.choices.filter(c => c.ok);
  if (keys.length !== 1) errs.push(`${label}: ${keys.length} correct choices (need exactly 1)`);
  const want = p.tf ? 2 : 4;                      // true/false questions have exactly two
  if (p.choices.length < want) errs.push(`${label}: only ${p.choices.length} choices — a collision dropped a distractor`);
  if (p.tf && p.choices.length !== 2) errs.push(`${label}: a true/false question must have exactly 2 choices`);

  for (const c of p.choices) {
    if (!c.ok && !c.why) errs.push(`${label}: distractor with no diagnosis -> ${c.t}`);
    if (junk(c.t)) errs.push(`${label}: junk token in choice "${c.t}"`);
    if (c.why && junk(c.why)) errs.push(`${label}: junk token in diagnosis "${String(c.why).slice(0, 80)}"`);
  }
  if (junk(p.prompt)) errs.push(`${label}: junk token in prompt "${p.prompt}"`);
  for (const s of p.steps) if (junk(s)) errs.push(`${label}: junk token in step "${String(s).slice(0, 80)}"`);

  if (!p.steps.length) warns.push(`${label}: no worked solution`);
  if (!p.recall) warns.push(`${label}: no recall line`);

  if (p.viz) {
    const spec = typeof p.viz === 'function' ? p.viz() : p.viz;
    const v = buildViz(spec);
    if (!v) errs.push(`${label}: viz failed to build (kind=${spec && spec.kind})`);
    else if (!/^<svg/.test(v.svg.trim())) errs.push(`${label}: viz produced no <svg>`);
    else if (/NaN|undefined/.test(v.svg)) errs.push(`${label}: NaN/undefined inside svg (kind=${spec.kind})`);
  }
}

for (const p of STATIC) check(materialize({ id: p.id }), `written:${p.id}`);
for (const g of GENS) {
  for (let s = 1; s <= SEEDS; s++) check(materialize({ gid: g.id, seed: (Math.imul(s, 2654435761) >>> 0) }), `gen:${g.id}#${s}`);
}

// Every difficulty the bank uses must be selectable. `DIFF_BAND.all` once
// stopped at 3, which quietly made 21 sources — including most of his hardest
// check-ins — impossible to be served.
const REACHABLE = new Set(DIFF_BAND.all);
const unreachable = new Set();
for (const p of STATIC) if (!REACHABLE.has(p.diff ?? 2)) unreachable.add(`${p.id} (diff ${p.diff})`);
for (const g of GENS) {
  for (let s = 1; s <= 60; s++) {
    const m = materialize({ gid: g.id, seed: (Math.imul(s, 2654435761) >>> 0) });
    if (m && !REACHABLE.has(m.diff)) unreachable.add(`${g.id} (diff ${m.diff})`);
  }
}
for (const u of unreachable) errs.push(`${u}: difficulty is outside DIFF_BAND.all, so it can never be served`);

// Repetition guard. A generator can produce 600 valid instances and still be
// four problems in a trench coat — that is what the bank felt like before the
// techniques generators were made formula-driven. Measure DISTINCT prompts per
// topic, because that is what a student actually experiences.
const MIN_DISTINCT = 12;
const distinct = new Map();
const addP = (skill, prompt) => {
  if (!distinct.has(skill)) distinct.set(skill, new Set());
  distinct.get(skill).add(prompt);
};
for (const p of STATIC) addP(p.skill, p.prompt);
for (const g of GENS) {
  for (let s = 1; s <= 300; s++) {
    const p = materialize({ gid: g.id, seed: (Math.imul(s, 2654435761) >>> 0) });
    if (p) addP(g.skill, p.prompt);
  }
}
// Below BROKEN a topic is unusable; between there and MIN_DISTINCT it is a
// known backlog, listed so it stays visible instead of silently rotting.
// Units his course never tests are held to the lower bar only.
const BROKEN = 6;
const thin = [...distinct].filter(([, v]) => v.size < MIN_DISTINCT).sort((a, b) => a[1].size - b[1].size);
const backlog = [];
for (const [skill, v] of thin) {
  const offSyllabus = !!OFF_SYLLABUS[skill.split('/')[0]];
  if (v.size < BROKEN && !offSyllabus) {
    errs.push(`${skill}: only ${v.size} distinct problems — that is not enough to drill at all`);
  } else {
    backlog.push(`${skill} (${v.size})`);
  }
}
const techniqueTotal = [...distinct]
  .filter(([k]) => k.startsWith('techniques/'))
  .reduce((n, [, v]) => n + v.size, 0);

// Answer position must be spread across the four slots. True/false questions
// are deliberately always True-then-False, so they are excluded — including
// them would make a correct app look like a broken one.
const slots = {};
for (const p of STATIC) {
  if (p.tf) continue;
  const i = materialize({ id: p.id }).choices.findIndex(c => c.ok);
  slots[i] = (slots[i] || 0) + 1;
}
for (const g of GENS) {
  for (let s = 1; s <= SEEDS; s++) {
    const i = materialize({ gid: g.id, seed: (Math.imul(s, 2654435761) >>> 0) }).choices.findIndex(c => c.ok);
    slots[i] = (slots[i] || 0) + 1;
  }
}
const total = Object.values(slots).reduce((a, b) => a + b, 0);
for (const [slot, n] of Object.entries(slots)) {
  const share = n / total;
  if (share > 0.4) errs.push(`answer lands in slot ${+slot + 1} ${(share * 100).toFixed(0)}% of the time — choices are not being shuffled`);
}

const uncovered = ALL_SKILLS.filter(s => !LIVE_SKILLS.includes(s));

console.log(`checked ${nChecked} problem instances  (${STATIC.length} written, ${GENS.length} generators × ${SEEDS} seeds)`);
console.log(`skills with content: ${LIVE_SKILLS.length} / ${ALL_SKILLS.length}`);
if (backlog.length) {
  console.log(`\nthin topics — ${backlog.length} below ${MIN_DISTINCT} distinct problems, worth widening next:`);
  console.log('  ' + backlog.join(', '));
}
console.log(`\ndistinct problems: ${[...distinct.values()].reduce((n, v) => n + v.size, 0)} across ${distinct.size} topics  (techniques: ${techniqueTotal}, thinnest topic: ${Math.min(...[...distinct.values()].map(v => v.size))})`);
console.log('answer position: ' + Object.keys(slots).sort()
  .map(k => `slot ${+k + 1} ${(slots[k] / total * 100).toFixed(1)}%`).join('  '));

if (uncovered.length) {
  console.log(`\nNO CONTENT YET (${uncovered.length}):`);
  uncovered.forEach(s => console.log('  - ' + s));
}

if (warns.length) {
  console.log(`\nWARNINGS (${warns.length}):`);
  warns.slice(0, 20).forEach(w => console.log('  ! ' + w));
}

console.log(`\nERRORS: ${errs.length}`);
errs.slice(0, 60).forEach(e => console.log('  x ' + e));
if (errs.length > 60) console.log(`  ... and ${errs.length - 60} more`);

process.exit(errs.length ? 1 : 0);
