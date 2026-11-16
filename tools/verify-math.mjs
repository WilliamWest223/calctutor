// ---------------------------------------------------------------
// tools/verify-math.mjs — does each answer actually answer its question?
//
//   node tools/verify-math.mjs [--verbose]
//
// check-bank.mjs checks the SHAPE of a problem (one key, four distinct
// options, a diagnosis on each). This checks the MATHEMATICS: it reads the
// prompt, works out what is being asked, and verifies the key numerically.
//
//   indefinite integral   differentiate the key, compare with the integrand
//   definite integral     integrate numerically, compare with the key
//   derivative            differentiate the function, compare with the key
//   limit                 evaluate close to the point, compare with the key
//
// Anything it cannot confidently parse is skipped and counted, so the
// coverage number is honest.
// ---------------------------------------------------------------
import { STATIC, GENS, materialize } from '../js/bank/index.js';
import { parseExpression, __internals } from '../js/mathcheck.js';

const VERBOSE = process.argv.includes('--verbose');
const seedArg = process.argv.find(a => a.startsWith('--seeds='));
const SEEDS = seedArg ? Number(seedArg.slice(8)) : 40;

// ---------------------------------------------------------------
// numeric tools
// ---------------------------------------------------------------
// the real evaluator, so this tool agrees with the app's own checker
const evaluateAst = __internals.evaluate;

const evalAt = (ast, v, x) => {
  const env = { C: 0 };
  env[v] = x;
  return evaluateAst(ast, env);
};

/** 4th-order central difference. */
function deriv(f, x) {
  const h = Math.max(1e-5, Math.abs(x) * 1e-5);
  const a = f(x - 2 * h), b = f(x - h), c = f(x + h), d = f(x + 2 * h);
  return (a - 8 * b + 8 * c - d) / (12 * h);
}

/** Composite Simpson on [a,b]. */
function integrate(f, a, b, n = 2000) {
  if (n % 2) n++;
  const h = (b - a) / n;
  let s = f(a) + f(b);
  if (!isFinite(s)) return NaN;
  for (let i = 1; i < n; i++) {
    const y = f(a + i * h);
    if (!isFinite(y)) return NaN;
    s += y * (i % 2 ? 4 : 2);
  }
  return (s * h) / 3;
}

/** tanh-sinh quadrature on (a,b) — converges even with endpoint singularities. */
function tanhSinh(f, a, b, level = 12) {
  const c = (a + b) / 2, r = (b - a) / 2;
  const h = 1 / Math.pow(2, level);
  let sum = 0;
  for (let k = -Math.ceil(4 / h); k <= Math.ceil(4 / h); k++) {
    const t = k * h;
    const u = (Math.PI / 2) * Math.sinh(t);
    const x = c + r * Math.tanh(u);
    if (x <= a || x >= b) continue;
    const y = f(x);
    if (!isFinite(y)) continue;
    sum += y * (Math.PI / 2) * Math.cosh(t) / Math.pow(Math.cosh(u), 2);
  }
  return sum * h * r;
}

/** ∫_a^∞ f, via x = a + tan(θ). */
const toInfinity = (f, a) =>
  tanhSinh(th => f(a + Math.tan(th)) / Math.pow(Math.cos(th), 2), 0, Math.PI / 2);

const near = (a, b, tol = 1e-4) =>
  isFinite(a) && isFinite(b) && Math.abs(a - b) <= tol * (1 + Math.max(Math.abs(a), Math.abs(b)));

// ---------------------------------------------------------------
// reading the prompt
// ---------------------------------------------------------------
/** Body of the {...} group starting at index i. */
function braceArg(s, i) {
  let d = 0;
  for (let j = i; j < s.length; j++) {
    if (s[j] === '{') d++;
    else if (s[j] === '}' && --d === 0) return { body: s.slice(i + 1, j), end: j + 1 };
  }
  return null;
}

/** \int\frac{dx}{g} is an ordinary integrand 1/g — rewrite so the dx lands last. */
function liftDifferential(p) {
  for (;;) {
    const m = p.match(/\\frac\{\s*d\s*([a-z]|\\theta)\s*\}/);
    if (!m) return p;
    const after = m.index + m[0].length;
    if (p[after] !== '{') return p;                    // not \frac{dx}{...}; leave alone
    const den = braceArg(p, after);
    if (!den) return p;
    p = p.slice(0, m.index) + `\\frac{1}{${den.body}}\\,d${m[1]}` + p.slice(den.end);
  }
}

const clean = s => String(s)
  .replace(/\\displaystyle|\\dfrac/g, m => (m === '\\dfrac' ? '\\frac' : ' '))
  .replace(/\\!|\\ /g, ' ');

/** Classify a prompt and pull out the pieces we need. */
function classify(prompt) {
  const p = liftDifferential(clean(prompt));

  // Questions whose answer is deliberately NOT the exact value: a Riemann
  // rule, a truncated series, a bound. The key is meant to differ from the
  // true value, so numeric comparison would report a defect that isn't one.
  if (/Trapezoid|Simpson|Midpoint|Riemann|Approximate|estimate|nonzero terms|first \w+ terms|error bound|remainder/i.test(p)) return null;

  // d/dx of an integral is not an integral question
  if (/\\frac\{d\}\{dx\}\s*\\int/.test(p)) return null;

  // FTC part 1:  Let g(x) = \int_c^{u(x)} f dt.  Find g'(x).
  let m = p.match(/g\(x\)\s*=\s*.*?\\int_\{?([^{}]*)\}?\^\{([^{}]*(?:\{[^{}]*\})?[^{}]*)\}\s*(.+?)\s*\\?,?\s*dt\$/);
  if (m && /g'\(x\)/.test(p)) return { kind: 'ftc', lo: m[1], up: m[2], body: m[3] };

  // A power-series question asks for centre/radius/interval, so its summand
  // still contains x; "how many terms" wants a count, not a sum. Neither is a
  // claim about one fixed numeric series.
  if (/radius|interval of convergence|centre|center|how many terms|number of terms/i.test(p)) return null;

  // series:  \sum_{n=k}^{\infty} a_n , answer a number
  m = p.match(/\\sum_\{\s*([a-z])\s*=\s*([^}]+)\}\^\{?\\infty\}?\s*(.+?)\s*\$/);
  if (m) return { kind: 'series', v: m[1], from: m[2], body: m[3] };

  // improper integral: "Determine whether ∫... converges. If it does, find its value."
  m = p.match(/\\int_\{([^}]*)\}\^\{([^}]*)\}\s*(.*?)\$\s*converges/i);
  if (m && /converges/i.test(p)) return { kind: 'improper', lo: m[1], hi: m[2], body: m[3] };

  // average value of f on [a,b]
  m = p.match(/average value of \$([^$]+)\$\s*on\s*\$\\?\[?([^,]+),\s*([^\]$]+)\\?\]?\$/);
  if (m) {
    const body = m[1].replace(/^[a-z]\s*\(\s*[a-z]\s*\)\s*=\s*/, '');
    return { kind: 'average', body, lo: m[2], hi: m[3], v: 'x' };
  }

  // definite integral:  \int_{a}^{b} f dx
  m = p.match(/\\int_\{?([^{}\s]+|[^}]*)\}?\^\{?([^{}\s]+|[^}]*)\}?\s*(.+?)\s*\\?,?\s*d\s*([a-z]|\\theta)\b/);
  if (m) return { kind: 'defint', lo: m[1], hi: m[2], body: m[3], v: m[4].replace('\\', '') };

  // indefinite integral:  \int f dx
  m = p.match(/\\int(?!_)\s*(.+?)\s*\\?,?\s*d\s*([a-z]|\\theta)\b/);
  if (m) return { kind: 'indef', body: m[1], v: m[2].replace('\\', '') };

  // Differentiate $f(x) = g$
  m = p.match(/Differentiate\s*\$f\(([a-z])\)\s*=\s*(.+?)\$/);
  if (m) return { kind: 'deriv', v: m[1], body: m[2] };

  // limit
  m = p.match(/\\lim_\{\s*([a-z])\s*\\to\s*([^}]+)\}\s*(.+?)\s*\$/);
  if (m) return { kind: 'limit', v: m[1], to: m[2], body: m[3] };

  return null;
}

function safeParse(tex) {
  try { return parseExpression(tex); } catch (e) { return null; }
}

const numberFrom = tex => {
  const ast = safeParse(tex);
  if (!ast) return null;
  const v = evaluateAst(ast, { C: 0 });
  return isFinite(v) ? v : null;
};

// Sample points. Integrands are not all defined in the same place —
// sqrt(x^2-25) needs x>5, arcsin needs |x|<1 — so try each window and use
// the first where enough points are defined rather than giving up.
const WINDOWS = [
  [0.37, 0.61, 0.94, 1.23, 1.58, 1.92, 2.31, 2.66],
  [5.4, 6.3, 7.7, 9.2, 11.6, 14.3, 18.1, 23.5],
  [0.06, 0.11, 0.19, 0.27, 0.38, 0.47, 0.58, 0.71],
  [-2.66, -1.92, -1.23, -0.61, 0.61, 1.23, 1.92, 2.66],
];

/** Compare g(x) with h(x) across the windows; returns null if never defined. */
function agreeOn(g, h, tol) {
  for (const xs of WINDOWS) {
    let good = 0, tried = 0, worst = null;
    for (const x of xs) {
      const a = g(x), b = h(x);
      if (!isFinite(a) || !isFinite(b)) continue;
      tried++;
      if (near(a, b, tol)) good++;
      else if (!worst) worst = { x, a, b };
    }
    if (tried >= 3) return { ok: good === tried, worst, tried };
  }
  return null;
}

// ---------------------------------------------------------------
// A numeric convergence oracle for the series families in this course.
//
// Returns 'converges' | 'diverges' | null (genuinely undecidable here).
// It is deliberately conservative: anything near the p=1 boundary, or
// where the numerics get shaky, returns null rather than a guess.
// ---------------------------------------------------------------
function classifySeries(term, n0 = 1) {
  const at = n => { const v = term(n); return typeof v === 'number' ? v : NaN; };
  const ok = v => isFinite(v) && v !== 0;

  // Find the largest sample point where the term still evaluates cleanly.
  // 3^n/4^n is computed as two separate powers, so it overflows to NaN long
  // before the series does anything interesting; (n!)^2/(2n)! overflows by
  // n=100. Neither is divergence, so never read an overflow as one.
  let N = 0;
  for (const n of [8, 16, 32, 48, 64, 96, 128, 192, 256, 400, 700, 1200, 2500, 6000, 15000]) {
    if (ok(at(n)) && ok(at(n + 1))) N = n; else break;
  }
  if (!N) return null;

  // Does it alternate? Decided on consecutive terms in the usable window.
  let alternates = true;
  for (let n = Math.max(n0 + 4, N - 12); n < Math.max(n0 + 4, N - 12) + 8; n++) {
    const x = at(n), y = at(n + 1);
    if (!ok(x) || !ok(y) || Math.sign(x) === Math.sign(y)) { alternates = false; break; }
  }

  // Ratio test, measured at two scales so a fluke does not decide it.
  const rho1 = Math.abs(at(N + 1) / at(N));
  const half = Math.max(8, Math.floor(N / 2));
  const rho2 = ok(at(half)) && ok(at(half + 1)) ? Math.abs(at(half + 1) / at(half)) : rho1;
  if (isFinite(rho1) && isFinite(rho2)) {
    if (rho1 < 0.95 && rho2 < 0.95) return 'converges';   // geometric / factorial decay
    if (rho1 > 1.05 && rho2 > 1.05) return 'diverges';    // terms growing
  }

  // Otherwise the family decays polynomially (rho -> 1). Fit |a_n| ~ n^-p
  // across the widest window that still evaluates.
  let lo = 0, hi = 0;
  for (const n of [200, 400, 800]) if (ok(at(n))) { lo = n; break; }
  for (const n of [30000, 12000, 5000, 2000, 1000]) if (ok(at(n))) { hi = n; break; }
  if (!lo || !hi || hi <= lo * 2) return null;

  const slope = (n1, n2) => {
    const A = Math.abs(at(n1)), B = Math.abs(at(n2));
    return ok(A) && ok(B) ? -Math.log(B / A) / Math.log(n2 / n1) : NaN;
  };
  const pExp = slope(lo, hi);
  if (!isFinite(pExp)) return null;

  // A log factor fakes a polynomial exponent: 1/(n ln n) measures as about
  // n^-1.14 over a decade and would be called convergent, though it diverges.
  // The tell is drift — a true power law has a constant slope, while a
  // log-modified one creeps toward 1 as n grows. If the slope moves, refuse.
  const mid = Math.round(Math.sqrt(lo * hi));
  const p1 = slope(lo, mid), p2 = slope(mid, hi);
  const drifting = isFinite(p1) && isFinite(p2) && Math.abs(p1 - p2) > 0.04;

  // Divergence Test: terms that barely shrink (or grow) never sum.
  if (pExp < 0.02) return 'diverges';
  if (alternates && pExp > 0.02) return 'converges';      // AST: terms -> 0, alternating
  if (drifting) return null;                              // log factor in play
  if (pExp > 1.3) return 'converges';
  if (pExp < 0.7) return 'diverges';
  return null;                                            // too near p=1 to call
}

// Control test for the oracle itself: an oracle that always answered
// "converges" would also report zero defects, so prove it discriminates.
if (process.argv.includes('--oracle-selftest')) {
  const cases = [
    ['1/n', n => 1 / n, 'diverges'],
    ['1/n^2', n => 1 / (n * n), 'converges'],
    ['1/sqrt(n)', n => 1 / Math.sqrt(n), 'diverges'],
    ['(-1)^n/sqrt(n)', n => Math.pow(-1, n) / Math.sqrt(n), 'converges'],
    ['(-1)^n/n', n => Math.pow(-1, n) / n, 'converges'],
    ['n/(n+1)', n => n / (n + 1), 'diverges'],
    ['(3/4)^n', n => Math.pow(3, n) / Math.pow(4, n), 'converges'],
    ['(5/4)^n', n => Math.pow(5, n) / Math.pow(4, n), 'diverges'],
    ['n!/2^n', n => { let f = 1; for (let i = 2; i <= n; i++) f *= i; return f / Math.pow(2, n); }, 'diverges'],
    ['2^n/n!', n => { let f = 1; for (let i = 2; i <= n; i++) f *= i; return Math.pow(2, n) / f; }, 'converges'],
    ['1/n^1.5', n => Math.pow(n, -1.5), 'converges'],
    ['1/(n ln n)', n => 1 / (n * Math.log(n)), 'diverges'],
    ['ln(n)/n', n => Math.log(n) / n, 'diverges'],
    ['n^2/2^n', n => n * n / Math.pow(2, n), 'converges'],
    ['1/n^3', n => Math.pow(n, -3), 'converges'],
    ['(-1)^n n/(n+1)', n => Math.pow(-1, n) * n / (n + 1), 'diverges'],
  ];
  let pass = 0, fail = 0, skipped = 0;
  for (const [name, f, want] of cases) {
    const got = classifySeries(f, 2);
    if (got === null) { skipped++; console.log(`  ~ ${name.padEnd(18)} undecided (want ${want})`); }
    else if (got === want) { pass++; console.log(`  ok ${name.padEnd(18)} ${got}`); }
    else { fail++; console.log(`  ✗ ${name.padEnd(18)} said ${got}, truth ${want}`); }
  }
  console.log(`\noracle self-test: ${pass} correct, ${fail} wrong, ${skipped} undecided`);
  process.exit(fail ? 1 : 0);
}

// ---------------------------------------------------------------
// verification
// ---------------------------------------------------------------
const stats = { checked: 0, ok: 0, skipped: 0, byKind: {} };
const skips = new Map();
function skip(reason) { stats.skipped++; skips.set(reason, (skips.get(reason) || 0) + 1); }
const problems = [];

function bump(kind, field) {
  stats.byKind[kind] = stats.byKind[kind] || { ok: 0, bad: 0 };
  stats.byKind[kind][field]++;
}

function verify(p, label) {
  if (p.fmt === 'multi' || p.fmt === 'error') { skip('multi/error format'); return; }
  if (/do not compute|which first step|which set-?up/i.test(p.prompt)) { skip('asks for a method/set-up, not a value'); return; }
  const info = classify(p.prompt);
  if (!info) { skip('prompt is not a computable integral/derivative/limit'); return; }

  const key = p.choices.find(c => c.ok);
  if (!key) { skip('no key'); return; }
  const keyTex = (String(key.t).match(/\$([^$]+)\$/) || [null, key.t])[1];

  // ---------- indefinite integral: d/dx(key) must equal the integrand
  if (info.kind === 'indef') {
    const F = safeParse(keyTex);
    const f = safeParse(info.body);
    if (!F || !f) { skip(`could not parse ${!f ? 'integrand' : 'key'}: ${(!f ? info.body : keyTex).slice(0, 60)}`); return; }
    const res = agreeOn(x => deriv(t => evalAt(F, info.v, t), x), x => evalAt(f, info.v, x), 1e-3);
    if (!res) { skip('integrand/key undefined on every sample window'); return; }
    stats.checked++;
    if (res.ok) { stats.ok++; bump('indefinite integral', 'ok'); }
    else {
      bump('indefinite integral', 'bad');
      problems.push({ label, skill: p.skill, kind: 'indefinite integral', prompt: p.prompt, key: key.t,
        detail: `at ${info.v}=${res.worst.x}: d/d${info.v}(key)=${res.worst.a.toFixed(6)} but integrand=${res.worst.b.toFixed(6)}` });
    }
    return;
  }

  // ---------- definite integral: numeric value must equal the key
  if (info.kind === 'defint') {
    const lo = numberFrom(info.lo), hi = numberFrom(info.hi);
    const f = safeParse(info.body);
    const kv = numberFrom(keyTex);
    if (lo === null || hi === null || !f || kv === null) { skip(kv === null ? `key is not a number: ${keyTex.slice(0, 50)}` : !f ? `could not parse integrand: ${info.body.slice(0, 50)}` : 'limits not numeric'); return; }
    const val = integrate(t => evalAt(f, info.v, t), lo, hi);
    if (!isFinite(val)) { skip('integral is improper on the sample grid'); return; }
    stats.checked++;
    if (near(val, kv, 1e-3)) { stats.ok++; bump('definite integral', 'ok'); }
    else { bump('definite integral', 'bad'); problems.push({ label, skill: p.skill, kind: 'definite integral', prompt: p.prompt, key: key.t, detail: `numeric value ${val.toFixed(6)} vs key ${kv.toFixed(6)}` }); }
    return;
  }

  // ---------- derivative
  if (info.kind === 'deriv') {
    const g = safeParse(info.body);
    const K = safeParse(keyTex);
    if (!g || !K) { skip(`could not parse ${!g ? 'function' : 'key'}: ${(!g ? info.body : keyTex).slice(0, 60)}`); return; }
    const res = agreeOn(x => deriv(t => evalAt(g, info.v, t), x), x => evalAt(K, info.v, x), 1e-3);
    if (!res) { skip('function/key undefined on every sample window'); return; }
    stats.checked++;
    if (res.ok) { stats.ok++; bump('derivative', 'ok'); }
    else {
      bump('derivative', 'bad');
      problems.push({ label, skill: p.skill, kind: 'derivative', prompt: p.prompt, key: key.t,
        detail: `at ${info.v}=${res.worst.x}: true f'=${res.worst.a.toFixed(6)} but key=${res.worst.b.toFixed(6)}` });
    }
    return;
  }

  // ---------- FTC: d/dx of an integral with a moving upper limit
  if (info.kind === 'ftc') {
    const f = safeParse(info.body);
    const K = safeParse(keyTex);
    const c = numberFrom(info.lo);
    const u = safeParse(info.up);
    if (!f || !K || !u || c === null) { skip('FTC pieces did not parse'); return; }
    const G = x => integrate(t => evalAt(f, 't', t), c, evalAt(u, 'x', x), 400);
    let good = 0, tried = 0, worst = null;
    for (const x of [0.7, 0.9, 1.1, 1.3]) {
      const dG = deriv(G, x);
      const kx = evalAt(K, 'x', x);
      if (!isFinite(dG) || !isFinite(kx)) continue;
      tried++;
      if (near(dG, kx, 2e-3)) good++;
      else if (!worst) worst = `at x=${x}: numeric g'=${dG.toFixed(6)} but key=${kx.toFixed(6)}`;
    }
    if (tried < 2) { skip('FTC integrand undefined on the sample points'); return; }
    stats.checked++;
    if (good === tried) { stats.ok++; bump('FTC derivative', 'ok'); }
    else { bump('FTC derivative', 'bad'); problems.push({ label, skill: p.skill, kind: 'FTC derivative', prompt: p.prompt, key: key.t, detail: worst }); }
    return;
  }

  // ---------- infinite series: partial sums must settle on the key
  if (info.kind === 'series') {
    const a = safeParse(info.body);
    const kv = numberFrom(keyTex);
    const k0 = numberFrom(info.from);
    if (!a) { skip('series term did not parse'); return; }
    if (/\\lim|smallest|bound|error|Comparison|how many/i.test(p.prompt)) { skip('series prompt asks for a limit/N/bound, not the sum'); return; }

    // The key may state a verdict rather than a value. "Conditionally
    // convergent" and "absolutely convergent" both mean the series converges.
    if (kv === null) {
      const kt = String(key.t);
      const saysConv = /converg/i.test(kt);
      const saysDiv = /diverg/i.test(kt);
      if (saysConv === saysDiv) { skip('series answer states neither convergence nor divergence'); return; }
      const claim = saysConv ? 'converges' : 'diverges';
      const truth = classifySeries(n => evalAt(a, info.v, n), k0 === null ? 1 : k0);
      if (!truth) { skip('series sits too close to the p=1 boundary to judge numerically'); return; }
      stats.checked++;
      if (truth === claim) { stats.ok++; bump('series verdict', 'ok'); }
      else {
        bump('series verdict', 'bad');
        problems.push({ label, skill: p.skill, kind: 'series verdict', prompt: p.prompt, key: key.t,
          detail: `key claims it ${claim}, numeric classification says it ${truth}` });
      }
      return;
    }
    if (k0 === null) { skip('series lower limit did not parse'); return; }
    let sum = 0, half = 0;
    const N = 200000;
    for (let n = k0; n < k0 + N; n++) {
      const t = evalAt(a, info.v, n);
      if (!isFinite(t)) { sum = NaN; break; }
      sum += t;
      if (n === k0 + N / 2) half = sum;
    }
    if (!isFinite(sum)) { skip('series term undefined'); return; }
    // only judge if the tail has actually gone quiet
    if (Math.abs(sum - half) > 1e-4 * (1 + Math.abs(sum))) { skip('series converges too slowly to judge numerically'); return; }
    stats.checked++;
    if (near(sum, kv, 1e-3)) { stats.ok++; bump('series sum', 'ok'); }
    else { bump('series sum', 'bad'); problems.push({ label, skill: p.skill, kind: 'series sum', prompt: p.prompt, key: key.t, detail: `partial sums → ${sum.toFixed(6)} but key = ${kv.toFixed(6)}` }); }
    return;
  }

  // ---------- average value
  if (info.kind === 'average') {
    const f = safeParse(info.body);
    const lo = numberFrom(info.lo), hi = numberFrom(info.hi), kv = numberFrom(keyTex);
    if (!f || lo === null || hi === null || kv === null) { skip('average-value pieces did not parse'); return; }
    const val = integrate(t => evalAt(f, info.v, t), lo, hi) / (hi - lo);
    if (!isFinite(val)) { skip('average-value integral is improper'); return; }
    stats.checked++;
    if (near(val, kv, 1e-3)) { stats.ok++; bump('average value', 'ok'); }
    else { bump('average value', 'bad'); problems.push({ label, skill: p.skill, kind: 'average value', prompt: p.prompt, key: key.t, detail: `numeric average ${val.toFixed(6)} vs key ${kv.toFixed(6)}` }); }
    return;
  }

  // ---------- improper integral: verdict, and value when it converges
  if (info.kind === 'improper') {
    let body = info.body.replace(/\\displaystyle/g, '').trim();
    const fr = body.match(/^\\frac\{dx\}\{(.*)\}$/);
    body = fr ? `\\frac{1}{${fr[1]}}` : body.replace(/\\?,?\s*dx$/, '').trim();
    const lim = t => (/-\\infty/.test(t) ? -Infinity : /\\infty/.test(t) ? Infinity
      : t.trim() === 'e' ? Math.E : numberFrom(t));
    const lo = lim(info.lo), hi = lim(info.hi);
    const ast = safeParse(body);
    if (!ast || lo === null || hi === null) { skip('improper integral did not parse'); return; }
    const f = x => evalAt(ast, 'x', x);
    const claimsDiv = /diverg/i.test(String(key.t));

    // A pole rarely lands on a grid point: find it by the sign flip.
    let sing = null;
    if (isFinite(lo) && isFinite(hi)) {
      let px = null, py = null;
      for (let i = 0; i <= 4000; i++) {
        const x = lo + (hi - lo) * i / 4000, y = f(x);
        if (!isFinite(y)) { sing = x; break; }
        if (py !== null && Math.sign(y) !== Math.sign(py) && Math.abs(y) + Math.abs(py) > 50) {
          sing = (x + px) / 2; break;
        }
        px = x; py = y;
      }
    }

    // 1/(x (ln x)^q) cannot be settled by truncation — u = ln x is exact.
    const logp = body.match(/^\\frac\{1\}\{x\\left\(\\ln x\\right\)\^\{(\d+)\}\}$/);
    let val;
    if (logp && Math.abs(lo - Math.E) < 1e-12 && !isFinite(hi)) {
      const q = Number(logp[1]);
      val = q <= 1 ? Infinity : toInfinity(u => Math.pow(u, -q), 1);
    } else if (sing !== null) {
      const part = d => Math.abs(tanhSinh(f, lo, sing - d));
      const a1 = part(1e-2), a2 = part(1e-5), a3 = part(1e-8);
      val = (a3 > a2 && a2 > a1 && a3 > a1 + 1) ? Infinity : tanhSinh(f, lo, sing);
    } else if (!isFinite(lo) && !isFinite(hi)) {
      val = toInfinity(f, 0) + toInfinity(x => f(-x), 0);
    } else if (!isFinite(hi)) {
      val = toInfinity(f, lo);
    } else if (!isFinite(lo)) {
      val = toInfinity(x => f(-x), -hi);
    } else {
      val = tanhSinh(f, lo, hi);
    }
    if (Math.abs(val) > 1e6) val = Infinity;
    if (Number.isNaN(val)) { skip('improper integral is not numerically resolvable'); return; }

    stats.checked++;
    if (claimsDiv) {
      if (!isFinite(val)) { stats.ok++; bump('improper integral', 'ok'); }
      else {
        bump('improper integral', 'bad');
        problems.push({ label, skill: p.skill, kind: 'improper integral', prompt: p.prompt, key: key.t,
          detail: `key says it diverges, but it evaluates to ${val.toFixed(6)}` });
      }
      return;
    }
    const kv = numberFrom(keyTex);
    if (kv === null) { stats.checked--; skip('improper integral key is neither a verdict nor a number'); return; }
    if (!isFinite(val)) {
      bump('improper integral', 'bad');
      problems.push({ label, skill: p.skill, kind: 'improper integral', prompt: p.prompt, key: key.t,
        detail: `key claims it converges to ${kv}, but it diverges` });
      return;
    }
    if (near(val, kv, 1e-3)) { stats.ok++; bump('improper integral', 'ok'); }
    else {
      bump('improper integral', 'bad');
      problems.push({ label, skill: p.skill, kind: 'improper integral', prompt: p.prompt, key: key.t,
        detail: `numeric value ${val.toFixed(6)} vs key ${kv}` });
    }
    return;
  }

  // ---------- limit
  if (info.kind === 'limit') {
    const f = safeParse(info.body);
    const kv = numberFrom(keyTex);
    if (!f || kv === null) { skip(kv === null ? `limit key is not a number: ${keyTex.slice(0, 50)}` : `could not parse: ${info.body.slice(0, 50)}`); return; }
    const toRaw = info.to.trim();
    let approach;
    if (/infty/.test(toRaw)) approach = [1e4, 1e5, 1e6];
    else {
      const a = numberFrom(toRaw.replace(/\^?\{?[+-]\}?$/, ''));
      if (a === null) { skip('limit point not numeric'); return; }
      const side = /\^\{?\+/.test(toRaw) ? 1 : /\^\{?-/.test(toRaw) ? -1 : 0;
      approach = side === 0
        ? [a + 1e-4, a - 1e-4, a + 1e-5, a - 1e-5]
        : [a + side * 1e-4, a + side * 1e-5, a + side * 1e-6];
    }
    const vals = approach.map(x => evalAt(f, info.v, x)).filter(isFinite);
    if (vals.length < 2) { skip('function undefined near the limit point'); return; }
    const last = vals[vals.length - 1];
    stats.checked++;
    if (near(last, kv, 5e-3)) { stats.ok++; bump('limit', 'ok'); }
    else { bump('limit', 'bad'); problems.push({ label, skill: p.skill, kind: 'limit', prompt: p.prompt, key: key.t, detail: `f near the point → ${last.toFixed(6)} but key = ${kv.toFixed(6)}` }); }
    return;
  }

  skip('unclassified');
}

// ---------------------------------------------------------------
for (const p of STATIC) verify(materialize({ id: p.id }), `written:${p.id}`);
for (const g of GENS) {
  for (let s = 1; s <= SEEDS; s++) {
    const seed = (Math.imul(s, 2654435761) >>> 0);
    verify(materialize({ gid: g.id, seed }), `gen:${g.id}#${s}`);
  }
}

const total = stats.checked + stats.skipped;
console.log(`examined ${total} problems`);
console.log(`  mathematically verified: ${stats.checked}`);
console.log(`  not machine-checkable:   ${stats.skipped}  (conceptual, set-up-the-integral, series, …)`);
console.log('');
for (const [k, v] of Object.entries(stats.byKind).sort()) {
  console.log(`  ${k.padEnd(22)} ${String(v.ok).padStart(5)} verified   ${v.bad ? String(v.bad).padStart(4) + ' WRONG' : '   0 wrong'}`);
}

if (process.argv.includes('--skips')) {
  console.log('\nwhy problems were skipped:');
  const rows = [...skips].sort((a, b) => b[1] - a[1]);
  for (const [why, n] of rows.slice(0, 40)) console.log(`  ${String(n).padStart(5)}  ${why}`);
  if (rows.length > 40) console.log(`  … ${rows.length - 40} more distinct reasons`);
}

// group failures so 12 seeds of one bad generator read as one defect
const byKey = new Map();
for (const f of problems) {
  const gid = f.label.replace(/#\d+$/, '');
  if (!byKey.has(gid)) byKey.set(gid, { ...f, count: 0 });
  byKey.get(gid).count++;
}

console.log(`\nDEFECTS: ${byKey.size} distinct (${problems.length} instances)`);
for (const f of byKey.values()) {
  console.log(`\n  ✗ ${f.label}  [${f.kind}]  ×${f.count}`);
  console.log(`    topic:  ${f.skill}`);
  console.log(`    prompt: ${f.prompt.replace(/\s+/g, ' ').slice(0, 110)}`);
  console.log(`    key:    ${String(f.key).replace(/\s+/g, ' ').slice(0, 110)}`);
  console.log(`    ${f.detail}`);
}

process.exit(byKey.size ? 1 : 0);
