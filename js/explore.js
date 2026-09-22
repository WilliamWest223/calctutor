// ---------------------------------------------------------------
// explore.js — interactive labs. Each one exposes a few controls
// and re-renders a figure plus a numeric readout on every change.
//
// An explorer is:
//   { id, name, unit, blurb, controls: [...], render(state) -> {svg, readout, note} }
// Control kinds: 'range' (min/max/step) and 'pick' (options).
// ---------------------------------------------------------------
import * as V from './viz.js';

// high-accuracy reference integral (composite Simpson)
function simpson(f, a, b, n = 2000) {
  if (n % 2) n++;
  const h = (b - a) / n;
  let s = f(a) + f(b);
  for (let i = 1; i < n; i++) s += f(a + i * h) * (i % 2 ? 4 : 2);
  return (s * h) / 3;
}

const rd = (v, d = 5) => {
  if (!isFinite(v)) return '—';
  const r = Math.round(v * 10 ** d) / 10 ** d;
  return String(r);
};

const FNS = {
  'x^2': { f: x => x * x, tex: 'x^{2}' },
  'sin x': { f: Math.sin, tex: '\\sin x' },
  'e^x': { f: Math.exp, tex: 'e^{x}' },
  '1/x': { f: x => 1 / x, tex: '\\frac{1}{x}' },
  '√x': { f: Math.sqrt, tex: '\\sqrt{x}' },
};

export const EXPLORERS = [];

// ---------------------------------------------------------------
EXPLORERS.push({
  id: 'riemann', name: 'Riemann Sums', unit: 'techniques',
  blurb: 'Watch an approximation converge. Push $n$ up and see which rule closes the gap fastest.',
  controls: [
    { key: 'fn', kind: 'pick', label: 'function', options: Object.keys(FNS), value: 'x^2' },
    { key: 'n', kind: 'range', label: 'subintervals n', min: 1, max: 40, step: 1, value: 6 },
    { key: 'rule', kind: 'pick', label: 'rule', options: ['left', 'right', 'midpoint', 'trap'], value: 'left' },
  ],
  render(s) {
    const F = FNS[s.fn] || FNS['x^2'];
    const a = s.fn === '1/x' || s.fn === '√x' ? 1 : 0;
    const b = a + 3;
    const n = Math.max(1, Math.round(s.n));
    const dx = (b - a) / n;
    let approx = 0;
    for (let i = 0; i < n; i++) {
      const x0 = a + i * dx, x1 = x0 + dx;
      if (s.rule === 'trap') approx += (F.f(x0) + F.f(x1)) / 2 * dx;
      else if (s.rule === 'left') approx += F.f(x0) * dx;
      else if (s.rule === 'right') approx += F.f(x1) * dx;
      else approx += F.f((x0 + x1) / 2) * dx;
    }
    const exact = simpson(F.f, a, b);
    const v = V.riemann({ f: F.f, a, b, n, rule: s.rule === 'midpoint' ? 'mid' : s.rule, tag: `${s.rule}, n = ${n}` });
    return {
      svg: v.svg,
      readout: [
        { label: 'approximation', value: rd(approx) },
        { label: 'exact', value: rd(exact) },
        { label: 'error', value: rd(Math.abs(exact - approx)), hot: Math.abs(exact - approx) > 0.05 },
      ],
      note: `$\\displaystyle\\int_{${a}}^{${b}} ${F.tex}\\,dx$ — doubling $n$ should roughly quarter the error for the trapezoid rule.`,
    };
  },
});

// ---------------------------------------------------------------
const TAYLOR_FNS = {
  'sin x': {
    f: Math.sin, tex: '\\sin x', c: 0, span: 8,
    term: k => (k % 2 === 0 ? 0 : ((k - 1) / 2 % 2 === 0 ? 1 : -1) / fact(k)),
  },
  'cos x': {
    f: Math.cos, tex: '\\cos x', c: 0, span: 8,
    term: k => (k % 2 === 1 ? 0 : (k / 2 % 2 === 0 ? 1 : -1) / fact(k)),
  },
  'e^x': { f: Math.exp, tex: 'e^{x}', c: 0, span: 4, term: k => 1 / fact(k) },
  'ln(1+x)': {
    f: x => Math.log(1 + x), tex: '\\ln(1+x)', c: 0, span: 1.9,
    term: k => (k === 0 ? 0 : (k % 2 === 1 ? 1 : -1) / k),
  },
  '1/(1-x)': { f: x => 1 / (1 - x), tex: '\\frac{1}{1-x}', c: 0, span: 1.6, term: () => 1 },
};
function fact(n) { let f = 1; for (let i = 2; i <= n; i++) f *= i; return f; }

EXPLORERS.push({
  id: 'taylor', name: 'Taylor Polynomials', unit: 'series',
  blurb: 'Add terms one at a time and watch the polynomial peel away from the function further and further out.',
  controls: [
    { key: 'fn', kind: 'pick', label: 'function', options: Object.keys(TAYLOR_FNS), value: 'sin x' },
    { key: 'deg', kind: 'range', label: 'degree n', min: 1, max: 15, step: 1, value: 3 },
    { key: 'at', kind: 'range', label: 'evaluate at x =', min: -6, max: 6, step: 0.25, value: 2 },
  ],
  render(s) {
    const T = TAYLOR_FNS[s.fn] || TAYLOR_FNS['sin x'];
    const deg = Math.round(s.deg);
    const poly = d => x => {
      let sum = 0;
      for (let k = 0; k <= d; k++) sum += T.term(k) * Math.pow(x - T.c, k);
      return sum;
    };
    // candidate degrees, then drop any that produce a polynomial identical to one
    // already shown (sin/cos skip every other term, so T1 ≡ T2 and so on)
    const probe = p => [0.4, 0.9, 1.7].map(x => Math.round(p(x) * 1e9)).join(',');
    const show = [];
    const seenPoly = new Set();
    for (const d of [1, Math.max(1, Math.round(deg / 2)), deg]) {
      if (d > deg || show.includes(d)) continue;
      const sig = probe(poly(d));
      if (seenPoly.has(sig)) continue;
      seenPoly.add(sig);
      show.push(d);
    }
    if (!show.length) show.push(deg);
    const at = Math.max(-T.span, Math.min(T.span, s.at));
    const approx = poly(deg)(at);
    const truth = T.f(at);
    const v = V.taylor({
      f: T.f, c: T.c, xmin: -T.span, xmax: T.span,
      ymin: T.f === Math.exp ? -1 : undefined, ymax: T.f === Math.exp ? 15 : undefined,
      fLabel: s.fn,
      polys: show.map(d => ({ n: d, label: `T${d}`, p: poly(d) })),
    });
    return {
      svg: v.svg,
      readout: [
        { label: `T${deg}(${rd(at, 2)})`, value: rd(approx) },
        { label: `f(${rd(at, 2)})`, value: rd(truth) },
        { label: 'error', value: rd(Math.abs(truth - approx)), hot: Math.abs(truth - approx) > 0.01 },
      ],
      note: `Error grows like $|x-a|^{n+1}$ — move the evaluation point away from the centre and watch it explode, then raise the degree to tame it.`,
    };
  },
});

// ---------------------------------------------------------------
EXPLORERS.push({
  id: 'series', name: 'Series Convergence', unit: 'series',
  blurb: 'Terms shrinking is not enough. Compare how the partial sums behave across families.',
  controls: [
    { key: 'family', kind: 'pick', label: 'series', options: ['1/n^p', 'geometric r^n', 'alternating (−1)ⁿ/n^p'], value: '1/n^p' },
    { key: 'p', kind: 'range', label: 'p (or r)', min: 0.1, max: 3, step: 0.1, value: 1 },
    { key: 'N', kind: 'range', label: 'terms shown', min: 5, max: 40, step: 1, value: 20 },
  ],
  render(s) {
    const p = s.p, N = Math.round(s.N);
    let a, verdict, limit = null;
    if (s.family === 'geometric r^n') {
      const r = Math.min(p, 2);
      a = n => Math.pow(r, n);
      verdict = r < 1 ? `converges (|r| < 1) to ${rd(r / (1 - r), 4)}` : 'diverges (|r| ≥ 1)';
      if (r < 1) limit = r / (1 - r);
    } else if (s.family === '1/n^p') {
      a = n => 1 / Math.pow(n, p);
      verdict = p > 1 ? `converges (p = ${rd(p, 2)} > 1)` : `diverges (p = ${rd(p, 2)} ≤ 1)`;
    } else {
      a = n => Math.pow(-1, n + 1) / Math.pow(n, p);
      verdict = p > 1 ? 'converges absolutely' : p > 0 ? 'converges conditionally' : 'diverges';
    }
    let sum = 0;
    for (let n = 1; n <= 400; n++) sum += a(n);
    const partial = (() => { let t = 0; for (let n = 1; n <= N; n++) t += a(n); return t; })();
    const v = V.series({ a, N, start: 1, limit, cap: '' });
    return {
      svg: v.svg,
      readout: [
        { label: `s_${N}`, value: rd(partial, 4) },
        { label: 's₄₀₀', value: rd(sum, 4) },
        { label: 'verdict', value: verdict, wide: true, hot: /diverges/.test(verdict) },
      ],
      note: 'Set $p=1$ on the first family: the terms visibly go to zero and the partial sums still climb forever. That is the harmonic series.',
    };
  },
});

// ---------------------------------------------------------------
EXPLORERS.push({
  id: 'revolve', name: 'Solids of Revolution', unit: 'applications',
  blurb: 'Move the axis and watch the radii change. This is where washer problems go wrong.',
  controls: [
    { key: 'curve', kind: 'pick', label: 'curve', options: ['√x', 'x', 'x²', 'sin x'], value: '√x' },
    { key: 'axis', kind: 'range', label: 'axis y =', min: -2, max: 4, step: 0.25, value: 0 },
    { key: 'method', kind: 'pick', label: 'method', options: ['disk/washer', 'shell'], value: 'disk/washer' },
    { key: 'slice', kind: 'range', label: 'slice at x =', min: 0.1, max: 3.9, step: 0.1, value: 2 },
  ],
  render(s) {
    const map = { '√x': x => Math.sqrt(Math.max(0, x)), x: x => x, 'x²': x => x * x / 2, 'sin x': x => 1 + Math.sin(x) };
    const f = map[s.curve] || map['√x'];
    const a = 0.02, b = 4;
    const axis = s.axis;
    const vol = s.method === 'shell'
      ? 2 * Math.PI * simpson(x => Math.abs(x) * Math.abs(f(x) - axis), a, b)
      : Math.PI * simpson(x => (f(x) - axis) ** 2, a, b);
    const v = V.revolve({
      top: f, a, b, axis, slice: s.slice,
      method: s.method === 'shell' ? 'shell' : 'disk',
      axisX: 0, axisLabel: `y = ${rd(axis, 2)}`,
    });
    return {
      svg: v.svg,
      readout: [
        { label: 'radius at slice', value: rd(Math.abs(f(s.slice) - axis), 4) },
        { label: s.method === 'shell' ? 'volume (shells)' : 'volume (disks)', value: rd(vol, 4) },
      ],
      note: 'Radius is the distance from the **axis** to the curve — drag the axis and note that the volume changes even though the region does not.',
    };
  },
});

// ---------------------------------------------------------------
EXPLORERS.push({
  id: 'euler', name: "Slope Fields & Euler's Method", unit: 'diffeq',
  blurb: 'Shrink the step size and watch the polygonal path settle onto the true solution.',
  controls: [
    { key: 'ode', kind: 'pick', label: "y' =", options: ['x + y', 'x·y', 'y(1 − y)', '−2y'], value: 'x + y' },
    { key: 'y0', kind: 'range', label: 'y(0) =', min: -2, max: 3, step: 0.25, value: 1 },
    { key: 'h', kind: 'range', label: 'step h', min: 0.05, max: 1, step: 0.05, value: 0.5 },
  ],
  render(s) {
    const odes = {
      'x + y': (x, y) => x + y,
      'x·y': (x, y) => x * y,
      'y(1 − y)': (x, y) => y * (1 - y),
      '−2y': (x, y) => -2 * y,
    };
    const F = odes[s.ode] || odes['x + y'];
    const h = s.h, X = 2;
    // Euler walk
    let x = 0, y = s.y0;
    const pts = [[x, y]];
    while (x < X - 1e-9) { y += h * F(x, y); x += h; pts.push([x, y]); }
    // fine-grained reference
    let rx = 0, ry = s.y0;
    const fine = 0.001;
    while (rx < X - 1e-9) { ry += fine * F(rx, ry); rx += fine; }
    const v = V.slopefield({
      f: F, xrange: [0, X], yrange: [Math.min(-2, s.y0 - 3), Math.max(4, s.y0 + 3)],
      solutions: [{ x0: 0, y0: s.y0 }],
    });
    // overlay the Euler polygon
    const poly = pts.map(p => p).filter(p => isFinite(p[1]));
    const svg = v.svg.replace('</svg>', `${eulerPath(poly, 0, X, Math.min(-2, s.y0 - 3), Math.max(4, s.y0 + 3))}</svg>`);
    return {
      svg,
      readout: [
        { label: 'steps', value: String(pts.length - 1) },
        { label: `Euler y(${X})`, value: rd(y, 4) },
        { label: `true y(${X})`, value: rd(ry, 4) },
        { label: 'error', value: rd(Math.abs(ry - y), 4), hot: Math.abs(ry - y) > 0.1 },
      ],
      note: 'Halving $h$ should roughly halve the error — Euler is only first-order accurate.',
    };
  },
});

// Euler polygon drawn in the same frame geometry viz.js uses (W=700,H=330, pad l46 r20 t22 b34)
function eulerPath(pts, xmin, xmax, ymin, ymax) {
  const W = 700, H = 330, PL = 46, PR = 20, PT = 22, PB = 34;
  const iw = W - PL - PR, ih = H - PT - PB;
  const X = x => PL + ((x - xmin) / (xmax - xmin)) * iw;
  const Y = y => PT + (1 - (y - ymin) / (ymax - ymin)) * ih;
  const inside = p => p[1] >= ymin - 1e6 && p[1] <= ymax + 1e6;
  const good = pts.filter(inside);
  if (good.length < 2) return '';
  const d = 'M' + good.map(p => `${X(p[0]).toFixed(1)},${Y(p[1]).toFixed(1)}`).join('L');
  const dots = good.map(p => `<circle cx="${X(p[0]).toFixed(1)}" cy="${Y(p[1]).toFixed(1)}" r="3" fill="var(--coral)"/>`).join('');
  return `<path d="${d}" fill="none" stroke="var(--coral)" stroke-width="2.2" stroke-dasharray="6 3"/>${dots}`;
}

// ---------------------------------------------------------------
EXPLORERS.push({
  id: 'polar', name: 'Polar Curves', unit: 'polar',
  blurb: 'Change $k$ and count the petals. Odd and even behave completely differently.',
  controls: [
    { key: 'family', kind: 'pick', label: 'curve', options: ['rose cos(kθ)', 'cardioid a + cos θ', 'circle a·cos θ'], value: 'rose cos(kθ)' },
    { key: 'k', kind: 'range', label: 'k (or a)', min: 1, max: 8, step: 1, value: 4 },
    { key: 'sweep', kind: 'range', label: 'sweep θ up to', min: 0.5, max: 2, step: 0.125, value: 2 },
  ],
  render(s) {
    const k = Math.round(s.k);
    let r, tag, area;
    if (s.family === 'rose cos(kθ)') {
      r = t => Math.cos(k * t);
      tag = `r = cos(${k}θ)`;
      area = Math.PI / (4 * k);
    } else if (s.family === 'cardioid a + cos θ') {
      r = t => k + Math.cos(t);
      tag = `r = ${k} + cos θ`;
      area = 0.5 * simpson(t => (k + Math.cos(t)) ** 2, 0, 2 * Math.PI);
    } else {
      r = t => k * Math.cos(t);
      tag = `r = ${k} cos θ`;
      area = Math.PI * (k / 2) ** 2;
    }
    const t1 = Math.PI * 2 * s.sweep / 2;
    const v = V.polar({ r, t0: 0, t1, shade: s.family !== 'rose cos(kθ)', tag });
    const petals = k % 2 === 1 ? k : 2 * k;
    return {
      svg: v.svg,
      readout: [
        s.family === 'rose cos(kθ)' ? { label: 'petals', value: `${petals} (k ${k % 2 ? 'odd' : 'even'})` } : { label: 'curve', value: tag },
        { label: s.family === 'rose cos(kθ)' ? 'area of one petal' : 'enclosed area', value: rd(area, 4) },
        { label: 'θ swept', value: `${rd(s.sweep, 3)}π` },
      ],
      note: 'Drop the sweep below $2\\pi$ on an odd rose — the curve is already complete, and going further just retraces it.',
    };
  },
});

// ---------------------------------------------------------------
EXPLORERS.push({
  id: 'area', name: 'Area Between Curves', unit: 'applications',
  blurb: 'Move the bounds and watch which curve is on top — the integrand flips with it.',
  controls: [
    { key: 'pair', kind: 'pick', label: 'curves', options: ['x vs x²', '2x vs x²', 'sin x vs cos x', '√x vs x²'], value: '2x vs x²' },
    { key: 'a', kind: 'range', label: 'lower bound a', min: -1, max: 2, step: 0.1, value: 0 },
    { key: 'b', kind: 'range', label: 'upper bound b', min: 0.2, max: 3.5, step: 0.1, value: 2 },
  ],
  render(s) {
    const pairs = {
      'x vs x²': [x => x, x => x * x, 'x', 'x²'],
      '2x vs x²': [x => 2 * x, x => x * x, '2x', 'x²'],
      'sin x vs cos x': [Math.sin, Math.cos, 'sin x', 'cos x'],
      '√x vs x²': [x => Math.sqrt(Math.max(0, x)), x => x * x, '√x', 'x²'],
    };
    const [f, g, fl, gl] = pairs[s.pair] || pairs['2x vs x²'];
    const a = Math.min(s.a, s.b - 0.1), b = Math.max(s.b, s.a + 0.1);
    const signed = simpson(x => f(x) - g(x), a, b);
    const total = simpson(x => Math.abs(f(x) - g(x)), a, b);
    const mid = (a + b) / 2;
    const v = V.area({
      xmin: a - 0.4, xmax: b + 0.4, a, b, slice: mid,
      top: f, bot: g, topLabel: fl, botLabel: gl,
    });
    return {
      svg: v.svg,
      readout: [
        { label: `∫(${fl} − ${gl})`, value: rd(signed, 4) },
        { label: 'true area |f − g|', value: rd(total, 4) },
        { label: 'curves cross?', value: Math.abs(signed - total) > 1e-3 ? 'yes — split the integral' : 'no', hot: Math.abs(signed - total) > 1e-3 },
      ],
      note: 'When the two numbers disagree, the curves crossed inside $[a,b]$ and a single integral is subtracting area from itself.',
    };
  },
});

export const explorerById = id => EXPLORERS.find(e => e.id === id) || null;

/** default state object for an explorer */
export function initialState(ex) {
  const s = {};
  for (const c of ex.controls) s[c.key] = c.value;
  return s;
}
