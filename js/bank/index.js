// ---------------------------------------------------------------
// bank/index.js — curriculum map + problem registry
// ---------------------------------------------------------------
import { rng, hash } from '../util.js';
import { precalc } from './precalc.js';
import { foundations } from './foundations.js';
import { techniques } from './techniques.js';
import { applications } from './applications.js';
import { diffeq } from './diffeq.js';
import { seriesUnit } from './series.js';
import { polar } from './polar.js';
import { exams } from './exams.js';
import { checkins } from './checkins.js';
import { taylor } from './taylor.js';
import { wide } from './wide.js';
import { mockExam3 } from './mock3.js';
import { mockFinal } from './mockf.js';

export const UNITS = [
  {
    key: 'precalc', n: 'PRE', name: 'Prerequisite Toolkit', accent: 'violet',
    blurb: 'The algebra and trig Calc II quietly assumes. Most "calculus mistakes" are actually one of these — a botched log rule, a dropped sign, cancelling terms instead of factors.',
    topics: ['Exponent & Radical Rules', 'Factoring & Polynomial Division', 'Rational Expressions',
      'Completing the Square', 'Logarithm & Exponential Rules', 'Unit Circle & Exact Values',
      'Trig Identities', 'Inverse Trig Values', 'Function Transformations & Domain',
      'Geometry Formulas', 'Summation Notation', 'Inequalities & Sign Charts'],
  },
  {
    key: 'foundations', n: '00', name: 'Foundations', accent: 'cyan',
    blurb: 'Calc I muscle memory. Everything in 142 sits on top of this — it gets mixed into every review set.',
    topics: ['Limits & Indeterminate Forms', 'Derivative Rules', 'Chain Rule & Implicit',
      "L'Hôpital's Rule", 'Antiderivatives', 'FTC & Definite Integrals', 'u-Substitution',
      'Inverse Trig, Log & Exp', 'Hyperbolic Functions'],
  },
  {
    key: 'techniques', n: '01', name: 'Techniques of Integration', accent: 'lime',
    blurb: 'The toolbox. Parts, trig, trig substitution, partial fractions — plus knowing which one to reach for.',
    topics: ['Linear u-Substitution', 'Integration by Parts', 'Tabular & Looping Parts',
      'Trigonometric Integrals', 'Product-to-Sum Integrals', 'Trigonometric Substitution',
      'Partial Fractions', 'Strategy for Integration', 'Numerical Integration', 'Improper Integrals'],
  },
  {
    key: 'applications', n: '02', name: 'Applications of Integration', accent: 'violet',
    blurb: 'Turning integrals into geometry and physics: area, volume, length, work, mass.',
    topics: ['Area Between Curves', 'Volumes: Disks & Washers', 'Volumes: Shells',
      'Arc Length', 'Surface Area', 'Work', 'Average Value', 'Centroids'],
  },
  {
    key: 'diffeq', n: '03', name: 'Differential Equations', accent: 'amber',
    blurb: 'Separable equations, slope fields, growth and decay, logistic models, integrating factors.',
    topics: ['Separable Equations', 'Slope Fields & Euler', 'Growth & Decay', 'Logistic Model',
      'First-Order Linear'],
  },
  {
    key: 'series', n: '04', name: 'Sequences & Series', accent: 'coral',
    blurb: 'The heart of the course and the place most points are lost. Tests, then power series, then Taylor.',
    topics: ['Sequences', 'Geometric & Telescoping', 'Divergence & Integral Tests',
      'p-Series & Comparison', 'Limit Comparison', 'Alternating Series & Error',
      'Ratio & Root Tests', 'Choosing a Test', 'Power Series & Radius',
      'Taylor & Maclaurin Series', 'Taylor Polynomials & Error', 'Applications of Series'],
  },
  {
    key: 'checkins', n: 'CI', name: 'Check-Ins', accent: 'amber',
    blurb: 'His actual in-class check-ins, transcribed from four semesters of published solutions. Every lecture opens with one of these: a single true/false claim about method or reasoning. They are traps for specific wrong ideas — which makes them the fastest way to find out what you only think you understand.',
    topics: ['Method Judgment', 'Series Test Logic', 'Power & Taylor Claims'],
  },
  {
    key: 'polar', n: '05', name: 'Parametric & Polar', accent: 'cyan',
    blurb: 'Curves that fail the vertical line test — slopes, arc length, and area swept by a ray.',
    topics: ['Parametric Curves', 'Parametric Calculus', 'Polar Coordinates',
      'Polar Area & Arc Length'],
  },
];

export const UNIT_BY_KEY = Object.fromEntries(UNITS.map(u => [u.key, u]));

/** every skill key in the course, in curriculum order */
export const ALL_SKILLS = UNITS.flatMap(u => u.topics.map(t => `${u.key}/${t}`));
export const skillsOf = unitKey => UNIT_BY_KEY[unitKey].topics.map(t => `${unitKey}/${t}`);
export const unitOfSkill = s => s.split('/')[0];
export const topicOfSkill = s => s.split('/').slice(1).join('/');

// ---- registry ---------------------------------------------------
const SOURCES = [precalc, foundations, techniques, applications, diffeq, seriesUnit, polar, exams, checkins, taylor, wide, mockExam3, mockFinal];

export const STATIC = [];
export const GENS = [];
for (const src of SOURCES) {
  // a problem may override the file's unit, so one source file can span units
  for (const p of src.problems || []) {
    const u = p.unit || src.unit;
    STATIC.push({ ...p, unit: u, skill: `${u}/${p.topic}` });
  }
  for (const g of src.generators || []) {
    const u = g.unit || src.unit;
    GENS.push({ ...g, unit: u, skill: `${u}/${g.topic}` });
  }
}
const STATIC_BY_ID = Object.fromEntries(STATIC.map(p => [p.id, p]));
const GEN_BY_ID = Object.fromEntries(GENS.map(g => [g.id, g]));

/** every skill that actually has content behind it */
export const LIVE_SKILLS = [...new Set([...STATIC.map(p => p.skill), ...GENS.map(g => g.skill)])];
export const liveSkillsOf = unitKey => skillsOf(unitKey).filter(s => LIVE_SKILLS.includes(s));

export function countsFor(skillKey) {
  return {
    static: STATIC.filter(p => p.skill === skillKey).length,
    gens: GENS.filter(g => g.skill === skillKey).length,
  };
}

/** Materialize a problem from a reference. */
export function materialize(ref) {
  if (ref.id) {
    const p = STATIC_BY_ID[ref.id];
    return p ? normalize({ ...p }, ref) : null;
  }
  const g = GEN_BY_ID[ref.gid];
  if (!g) return null;
  const r = rng(ref.seed);
  let made;
  try { made = g.make(r); } catch (e) { console.warn('gen failed', ref.gid, e); return null; }
  if (!made) return null;
  return normalize({ ...made, topic: made.topic || g.topic, unit: g.unit, skill: g.skill, diff: made.diff ?? g.diff ?? 2 }, ref);
}

/** Candidate refs for a set of skills. */
export function candidates(skills) {
  const set = new Set(skills);
  const out = [];
  for (const p of STATIC) if (set.has(p.skill)) out.push({ id: p.id, skill: p.skill, diff: p.diff ?? 2 });
  // A generator that spans several difficulties advertises `diffs`, so the
  // band filter can see the whole range instead of one declared number.
  for (const g of GENS) if (set.has(g.skill)) out.push({ gid: g.id, skill: g.skill, diff: g.diff ?? 2, diffs: g.diffs, gen: true });
  return out;
}

export function seedRef(ref, salt) {
  if (ref.gid) return { gid: ref.gid, seed: (hash(ref.gid + ':' + salt) ^ ((Math.random() * 1e9) | 0)) >>> 0 };
  return { id: ref.id };
}

// ---- normalization ----------------------------------------------
export function normalize(p, ref) {
  p.ref = ref || (p.id ? { id: p.id } : null);
  const seen = new Set();
  p.choices = (p.choices || []).filter(Boolean)
    .map(c => (typeof c === 'string' ? { t: c } : c))
    .sort((a, b) => (b.ok ? 1 : 0) - (a.ok ? 1 : 0))     // keep the key if a distractor collides
    .filter(c => { const k = String(c.t).replace(/\s+/g, ''); if (seen.has(k)) return false; seen.add(k); return true; });
  if (!p.choices.some(c => c.ok) && p.choices.length) p.choices[0].ok = true;

  // True/false keeps its natural order: the labels carry the meaning, so
  // shuffling adds nothing but a position pattern a student could learn.
  // Everything else is shuffled, or the key would always sit in position 1
  // after the dedupe sort. Seeded from the ref so re-materializing the SAME
  // problem (mistake bank, exam review) reproduces the ordering and any
  // stored answer index still points at the same option.
  p.choices = p.tf
    ? p.choices.sort((a, b) => (a.t === 'True' ? -1 : 1) - (b.t === 'True' ? -1 : 1))
    : rng(hash(refKey(p.ref))).shuffle(p.choices);

  p.steps = (p.steps || []).filter(Boolean);
  return p;
}

function refKey(ref) {
  if (!ref) return 'anon';
  return ref.id ? `id:${ref.id}` : `gen:${ref.gid}:${ref.seed}`;
}
