// ---------------------------------------------------------------
// bank/course.js — the actual MATH 142 Fall 2026 course.
//
// Lecture schedule, exam dates and exam coverage transcribed from
// Dr. McWhorter's syllabus; coverage cross-checked against his real
// Spring 2025 / Fall 2025 / Spring 2026 exams.
//
// This is what lets the app say "your next lecture is Trigonometric
// Integrals" and "Exam 1 covers exactly these topics".
// ---------------------------------------------------------------

export const COURSE = {
  code: 'MATH 142',
  term: 'Fall 2026',
  instructor: 'Dr. Caleb McWhorter',
  site: 'https://coffeeintotheorems.com/courses/2026-2/fall/math-142/',
  firstDay: '2026-08-18',
  lastDay: '2026-12-10', // final exam (Blackboard calendar: Thu 12/10 12:30 PM, LeConte 444)
};

/** Lecture schedule. `skills` are the topic keys a day maps onto. */
export const SCHEDULE = [
  // Verified 2026-09-17 against the syllabus course schedule (p.25), the Blackboard
  // calendar, and the dated lecture-note folders he posts on Blackboard. The first
  // version of this file had the 08/27–09/17 topics shifted one class late.
  { d: '2026-08-18', t: 'Integration Review (u-Substitution)', skills: ['foundations/u-Substitution', 'foundations/Antiderivatives', 'foundations/FTC & Definite Integrals'] },
  { d: '2026-08-19', t: 'Gateway I opens', kind: 'gateway', gateway: 1 },
  { d: '2026-08-20', t: 'Integration by Parts', skills: ['techniques/Integration by Parts'] },
  { d: '2026-08-24', t: 'Integration Review', skills: ['techniques/Linear u-Substitution', 'foundations/u-Substitution'] },
  { d: '2026-08-25', t: 'Integration by Parts (tabular & looping)', skills: ['techniques/Integration by Parts', 'techniques/Tabular & Looping Parts'] },
  { d: '2026-08-26', t: 'Lab 1', kind: 'lab' },
  { d: '2026-08-27', t: 'Trigonometric Integrals', skills: ['techniques/Trigonometric Integrals', 'techniques/Product-to-Sum Integrals', 'precalc/Trig Identities'] },
  { d: '2026-08-31', t: 'Lab 2', kind: 'lab' },
  { d: '2026-09-01', t: 'Trigonometric Substitution', skills: ['techniques/Trigonometric Substitution'] },
  { d: '2026-09-01', t: 'Gateway I deadline (6 PM, proctored)', kind: 'gateway', gateway: 1 },
  { d: '2026-09-02', t: 'Recitation', kind: 'rec' },
  { d: '2026-09-03', t: 'Partial Fractions (watch the pre-lecture video first)', skills: ['techniques/Partial Fractions', 'precalc/Factoring & Polynomial Division'] },
  { d: '2026-09-07', t: 'Labor Day — no class', kind: 'off' },
  { d: '2026-09-08', t: 'Partial Fractions', skills: ['techniques/Partial Fractions'] },
  { d: '2026-09-09', t: 'Recitation', kind: 'rec' },
  { d: '2026-09-10', t: 'Improper Integrals', skills: ['techniques/Improper Integrals'] },
  { d: '2026-09-14', t: 'Recitation', kind: 'rec' },
  { d: '2026-09-15', t: 'Applications: Arc Length & Surface Area', skills: ['applications/Arc Length', 'applications/Surface Area'] },
  { d: '2026-09-16', t: 'Recitation', kind: 'rec' },
  { d: '2026-09-17', t: 'Integration Review', skills: ['techniques/Strategy for Integration', 'techniques/Improper Integrals', 'techniques/Partial Fractions'] },
  { d: '2026-09-18', t: 'HW due: Partial Fractions', kind: 'due' },
  { d: '2026-09-20', t: 'HW due: Improper Integrals', kind: 'due' },
  { d: '2026-09-21', t: 'Recitation', kind: 'rec' },
  { d: '2026-09-22', t: 'Exam 1 (1:15 PM, LeConte 444)', kind: 'exam', exam: 1 },
  { d: '2026-09-23', t: 'Lab 3', kind: 'lab' },
  { d: '2026-09-24', t: 'Sequences & Series', skills: ['series/Sequences'] },
  { d: '2026-09-25', t: 'HW due: Applications of Integration', kind: 'due' },
  { d: '2026-09-28', t: 'Lab 4', kind: 'lab' },
  { d: '2026-09-29', t: 'Telescoping & Geometric Series', skills: ['series/Geometric & Telescoping'] },
  { d: '2026-09-30', t: 'Recitation · Lab 3 due', kind: 'rec' },
  { d: '2026-10-01', t: 'Integral & Alternating Series Test', skills: ['series/Divergence & Integral Tests', 'series/Alternating Series & Error'] },
  { d: '2026-10-02', t: 'HW due: Sequences & Introduction to Series', kind: 'due' },
  { d: '2026-10-05', t: 'Recitation · Lab 4 due', kind: 'rec' },
  { d: '2026-10-06', t: 'Limit Comparison Test', skills: ['series/Limit Comparison'] },
  { d: '2026-10-07', t: 'Recitation', kind: 'rec' },
  { d: '2026-10-08', t: 'Direct Comparison Test', skills: ['series/p-Series & Comparison'] },
  { d: '2026-10-09', t: 'HW due: Telescoping & Geometric Series', kind: 'due' },
  { d: '2026-10-11', t: 'HW due: Integral Test · Alternating Series Test', kind: 'due' },
  { d: '2026-10-12', t: 'Recitation', kind: 'rec' },
  { d: '2026-10-13', t: 'Absolute / Conditional Convergence', skills: ['series/Alternating Series & Error', 'series/Ratio & Root Tests'] },
  { d: '2026-10-14', t: 'Recitation', kind: 'rec' },
  { d: '2026-10-15', t: 'Fall Break — no class', kind: 'off' },
  { d: '2026-10-18', t: 'HW due: Comparison Tests', kind: 'due' },
  { d: '2026-10-19', t: 'Lab 5', kind: 'lab' },
  { d: '2026-10-20', t: 'Ratio & Root Test', skills: ['series/Ratio & Root Tests', 'series/Choosing a Test'] },
  { d: '2026-10-21', t: 'Recitation', kind: 'rec' },
  { d: '2026-10-22', t: 'Power Series', skills: ['series/Power Series & Radius'] },
  { d: '2026-10-23', t: 'Gateway II deadline (6 PM, proctored) · HW due: Absolute & Conditional', kind: 'gateway', gateway: 2 },
  { d: '2026-10-25', t: 'HW due: Ratio & Root Test · Power Series', kind: 'due' },
  { d: '2026-10-26', t: 'Lab 6 · Lab 5 due', kind: 'lab' },
  { d: '2026-10-27', t: 'Exam 2 (1:15 PM, LeConte 444)', kind: 'exam', exam: 2 },
  { d: '2026-10-28', t: 'Recitation', kind: 'rec' },
  { d: '2026-10-29', t: 'Taylor Series', skills: ['series/Taylor & Maclaurin Series'] },
  { d: '2026-10-30', t: 'Study: Maclaurin table cold (6 rows + IOC), Power Series drill', skills: ['series/Power Series & Radius', 'series/Taylor & Maclaurin Series'], kind: 'study' },
  { d: '2026-11-02', t: 'Lab 7 · Lab 6 due', kind: 'lab' },
  { d: '2026-11-03', t: 'Election Day — no class', kind: 'off' },
  { d: '2026-11-04', t: 'Labs 8 & 9', kind: 'lab' },
  { d: '2026-11-05', t: 'Taylor Series', skills: ['series/Taylor & Maclaurin Series'] },
  { d: '2026-11-06', t: 'Study: Taylor from scratch at non-zero centre x4, Mock Exam 3 A untimed', skills: ['series/Taylor & Maclaurin Series'], kind: 'study' },
  { d: '2026-11-09', t: 'Recitation · Lab 7 due', kind: 'rec' },
  { d: '2026-11-10', t: 'Taylor Remainder Theorem', skills: ['series/Taylor Polynomials & Error'] },
  { d: '2026-11-11', t: 'Recitation · Labs 8 & 9 due', kind: 'rec' },
  { d: '2026-11-12', t: 'Series Applications', skills: ['series/Applications of Series'] },
  { d: '2026-11-13', t: 'HW due: Taylor & Maclaurin Series', kind: 'due' },
  { d: '2026-11-14', t: 'Study: remainder bounds + series apps drill, Cheatsheet Exam 3 section', skills: ['series/Taylor Polynomials & Error', 'series/Applications of Series'], kind: 'study' },
  { d: '2026-11-15', t: 'HW due: Taylor Remainder Theorem', kind: 'due' },
  { d: '2026-11-16', t: 'Recitation', kind: 'rec' },
  { d: '2026-11-16', t: 'Study: Mock Exam 3 B timed (50 min), redo every miss', skills: ['series/Power Series & Radius', 'series/Taylor & Maclaurin Series', 'series/Taylor Polynomials & Error', 'series/Applications of Series'], kind: 'study' },
  { d: '2026-11-17', t: 'Exam Review · HW due: Mathematical Applications of Series', kind: 'rec' },
  { d: '2026-11-18', t: 'Recitation', kind: 'rec' },
  { d: '2026-11-18', t: 'Study: Mistake Bank + Exam 3 Exam Practice, sleep', skills: ['series/Taylor & Maclaurin Series', 'series/Taylor Polynomials & Error', 'series/Applications of Series'], kind: 'study' },
  { d: '2026-11-19', t: 'Exam 3 (1:15 PM, LeConte 444)', kind: 'exam', exam: 3 },
  { d: '2026-11-22', t: 'Study: techniques refresh (parts, trig sub, partial fractions, improper)', skills: ['techniques/Strategy for Integration', 'techniques/Improper Integrals'], kind: 'study' },
  { d: '2026-11-23', t: 'Thanksgiving Break — no class', kind: 'off' },
  { d: '2026-11-28', t: 'Study: convergence tests refresh (Choosing a Test drill)', skills: ['series/Choosing a Test', 'series/Limit Comparison'], kind: 'study' },
  { d: '2026-11-30', t: 'Recitation', kind: 'rec' },
  { d: '2026-12-01', t: 'Polar Coordinates', skills: ['polar/Polar Coordinates', 'polar/Polar Area & Arc Length'] },
  { d: '2026-12-02', t: 'Recitation', kind: 'rec' },
  { d: '2026-12-02', t: 'Study: polar area + slope drill after lecture', skills: ['polar/Polar Coordinates', 'polar/Polar Area & Arc Length'], kind: 'study' },
  { d: '2026-12-03', t: 'Parametric Functions', skills: ['polar/Parametric Curves', 'polar/Parametric Calculus'] },
  { d: '2026-12-04', t: 'Last day of classes · HW due: Parametric Functions & Polar Coordinates', kind: 'due' },
  { d: '2026-12-05', t: 'Study: Mock Final A untimed, parametric drill', skills: ['polar/Parametric Curves', 'polar/Parametric Calculus'], kind: 'study' },
  { d: '2026-12-07', t: 'Study: Mock Final B timed (2 h, no calculator), redo misses', skills: ['polar/Parametric Calculus', 'series/Taylor Polynomials & Error'], kind: 'study' },
  { d: '2026-12-09', t: 'Study: Final cheatsheet sections + Mistake Bank + Cram Session', skills: ['techniques/Strategy for Integration', 'series/Choosing a Test'], kind: 'study' },
  { d: '2026-12-10', t: 'Final Exam (12:30 PM, LeConte 444)', kind: 'exam', exam: 0 },
];

// ---------------------------------------------------------------
// Exam coverage — from the syllabus schedule, verified against the
// real past papers in his GitHub repo.
// ---------------------------------------------------------------
const TECHNIQUES_ALL = [
  'techniques/Linear u-Substitution', 'techniques/Integration by Parts',
  'techniques/Tabular & Looping Parts', 'techniques/Trigonometric Integrals',
  'techniques/Product-to-Sum Integrals', 'techniques/Trigonometric Substitution',
  'techniques/Partial Fractions', 'techniques/Strategy for Integration',
  'techniques/Improper Integrals',
];
const SERIES_TESTS = [
  'series/Sequences', 'series/Geometric & Telescoping', 'series/Divergence & Integral Tests',
  'series/p-Series & Comparison', 'series/Limit Comparison', 'series/Alternating Series & Error',
  'series/Ratio & Root Tests', 'series/Choosing a Test', 'series/Power Series & Radius',
];
const TAYLOR = [
  'series/Power Series & Radius', 'series/Taylor & Maclaurin Series',
  'series/Taylor Polynomials & Error', 'series/Applications of Series',
];

export const EXAMS = [
  {
    id: 1, name: 'Exam 1', date: '2026-09-22',
    blurb: 'Techniques of integration, improper integrals, and arc length / surface area (lectured 09/15).',
    note: 'His Fall 2025 paper: odd-power trig integral, tabular by-parts, inverse-trig by-parts, an improper integral with an interior singularity, secant trig-sub, partial fractions over $x(x^{2}+1)$, and a product-to-sum integral.',
    skills: [...TECHNIQUES_ALL, 'foundations/u-Substitution', 'foundations/Antiderivatives',
      'foundations/FTC & Definite Integrals', 'foundations/Inverse Trig, Log & Exp', 'precalc/Trig Identities',
      'applications/Arc Length', 'applications/Surface Area'],
  },
  {
    id: 2, name: 'Exam 2', date: '2026-10-27',
    blurb: 'Sequences, series and every convergence test, up through power series.',
    note: 'His Fall 2025 paper: absolute/conditional convergence, a signed geometric series, two limit comparisons, a root test, a ratio test with factorials, a telescoping sum, and a divergence test.',
    skills: [...SERIES_TESTS, 'precalc/Summation Notation', 'foundations/Limits & Indeterminate Forms'],
  },
  {
    id: 3, name: 'Exam 3', date: '2026-11-19',
    blurb: 'Power series, Taylor and Maclaurin series, and the remainder theorem.',
    note: 'His Fall 2025 paper: the Maclaurin-series table, a Taylor series derived from scratch, radius/interval of convergence, building a series by substitution, and summing one by differentiating $\\sum x^{n}$.',
    skills: [...TAYLOR, 'series/Ratio & Root Tests'],
  },
  {
    id: 0, name: 'Final Exam', date: '2026-12-10',
    blurb: 'Cumulative, plus polar and parametric.',
    note: 'His finals run long and wide: a handful of integration techniques, most of the convergence tests, two or three power-series questions, and a Taylor polynomial.',
    skills: [...TECHNIQUES_ALL, ...SERIES_TESTS, ...TAYLOR,
      'polar/Polar Coordinates', 'polar/Polar Area & Arc Length',
      'polar/Parametric Curves', 'polar/Parametric Calculus',
      'applications/Arc Length'],
  },
];

export const GATEWAYS = [
  {
    id: 1, name: 'Gateway I', date: '2026-09-01', // Blackboard deadline, 6 PM
    blurb: 'Precalculus and Calculus I mastery. 30 minutes, WebWork, proctored in the Math Lab. Deadline Tue 09/01 6 PM.',
    note: 'The syllabus describes Gateway I as securing "basic Precalculus/Calculus". This draws entirely from the Prerequisite Toolkit and Foundations.',
    skills: [
      'precalc/Exponent & Radical Rules', 'precalc/Factoring & Polynomial Division',
      'precalc/Rational Expressions', 'precalc/Completing the Square',
      'precalc/Logarithm & Exponential Rules', 'precalc/Unit Circle & Exact Values',
      'precalc/Trig Identities', 'precalc/Inverse Trig Values',
      'precalc/Function Transformations & Domain', 'precalc/Geometry Formulas',
      'precalc/Summation Notation', 'precalc/Inequalities & Sign Charts',
      'foundations/Derivative Rules', 'foundations/Chain Rule & Implicit',
      'foundations/Limits & Indeterminate Forms', 'foundations/Antiderivatives',
    ],
  },
  {
    id: 2, name: 'Gateway II', date: '2026-10-23', // Blackboard deadline, 6 PM
    blurb: 'Early Calculus II integration skills. 30 minutes, WebWork, all-or-nothing, unlimited proctored attempts in the Math Lab (1st floor LeConte). Deadline Fri 10/23 6 PM — go early.',
    note: 'The syllabus describes Gateway II as securing "integration skills" — his linear-$u$-sub handout is the clearest statement of what that means.',
    skills: [
      'techniques/Linear u-Substitution', 'foundations/u-Substitution',
      'foundations/Antiderivatives', 'foundations/Inverse Trig, Log & Exp',
      'techniques/Integration by Parts', 'techniques/Trigonometric Integrals',
      'techniques/Strategy for Integration',
    ],
  },
];

/** Units the syllabus does not actually cover. Kept, but de-emphasised. */
export const OFF_SYLLABUS = {
  diffeq: 'Not on the Fall 2026 syllabus — no lecture day and no past-exam question. Kept for completeness (many Calc II courses include it).',
};
export const LIGHT_COVERAGE = {
  applications: 'Only one lecture (09/15: arc length & surface area) and one 8-point homework (Applications of Integration, due 09/25). Arc length and surface area are fair game on Exam 1; volumes/work/centroids were not lectured.',
};

// ---------------------------------------------------------------
const DAY = 86400000;
const dkey = d => d.toISOString().slice(0, 10);

/** Where the course is right now. */
export function courseToday(now = new Date()) {
  const today = dkey(now);
  const classes = SCHEDULE.filter(s => s.kind !== 'due' && s.kind !== 'study');
  const past = classes.filter(s => s.d <= today);
  const future = classes.filter(s => s.d > today);
  return {
    today: classes.find(s => s.d === today) || null,
    last: past[past.length - 1] || null,
    next: future[0] || null,
    upcoming: future.slice(0, 4),
    beforeTerm: today < COURSE.firstDay,
    afterTerm: today > COURSE.lastDay,
  };
}

/** Next graded assessment (exam or gateway), with days remaining. */
export function nextAssessment(now = new Date()) {
  const today = dkey(now);
  const items = [
    ...EXAMS.map(e => ({ kind: 'exam', ...e })),
    ...GATEWAYS.filter(g => g.date).map(g => ({ kind: 'gateway', ...g })),
  ].filter(x => x.date && x.date >= today).sort((a, b) => a.date.localeCompare(b.date));
  if (!items.length) return null;
  const n = items[0];
  const days = Math.round((new Date(n.date + 'T23:59:59') - now) / DAY);
  return { ...n, days };
}

/** Everything covered in lecture up to today — the honest "review" scope. */
export function coveredSkills(now = new Date()) {
  const today = dkey(now);
  const out = new Set();
  for (const s of SCHEDULE) {
    if (s.d > today) break;
    (s.skills || []).forEach(k => out.add(k));
  }
  return [...out];
}

export const examById = id => EXAMS.find(e => e.id === id) || null;
export const gatewayById = id => GATEWAYS.find(g => g.id === id) || null;
