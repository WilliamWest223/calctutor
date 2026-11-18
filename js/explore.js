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

// signif-digit format for long readout values (shorter than fixed decimals, keeps tiny errors visible)
const sg = (v, d = 4) => (isFinite(v) ? String(+v.toPrecision(d)) : '—');
const texMap = o => Object.fromEntries(Object.entries(o).map(([k, v]) => [k, v.tex]));

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
    { key: 'fn', kind: 'pick', label: 'function', options: Object.keys(FNS), tex: texMap(FNS), value: 'x^2' },
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
  'arctan x': {
    f: Math.atan, tex: '\\arctan x', c: 0, span: 2,
    term: k => (k % 2 === 0 ? 0 : ((k - 1) / 2 % 2 === 0 ? 1 : -1) / k),
  },
};
// radius-1 series: y-window fixed so the blow-up outside |x| < 1 is clipped, not rescaled
for (const [k, y] of [['ln(1+x)', [-4, 3]], ['1/(1-x)', [-4, 6]], ['arctan x', [-2.5, 2.5]]]) { TAYLOR_FNS[k].R = 1; TAYLOR_FNS[k].ylim = y; }
function fact(n) { let f = 1; for (let i = 2; i <= n; i++) f *= i; return f; }

EXPLORERS.push({
  id: 'taylor', name: 'Taylor Polynomials', unit: 'series',
  blurb: 'Add terms one at a time and watch the polynomial peel away from the function further and further out.',
  controls: [
    { key: 'fn', kind: 'pick', label: 'function', options: Object.keys(TAYLOR_FNS), tex: texMap(TAYLOR_FNS), value: 'sin x' },
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
      ymin: T.ylim ? T.ylim[0] : T.f === Math.exp ? -1 : undefined, ymax: T.ylim ? T.ylim[1] : T.f === Math.exp ? 15 : undefined,
      fLabel: s.fn,
      polys: show.map(d => ({ n: d, label: `T${d}`, p: poly(d) })),
    });
    return {
      svg: v.svg,
      readout: [
        { label: `T${deg}(${rd(at, 2)})`, tex: `T_{${deg}}(${rd(at, 2)})`, value: rd(approx) },
        { label: `f(${rd(at, 2)})`, tex: `f(${rd(at, 2)})`, value: rd(truth) },
        { label: 'error', value: rd(Math.abs(truth - approx)), hot: Math.abs(truth - approx) > 0.01 },
      ],
      note: T.R
        ? `Radius of convergence is $R=1$: for $|x|>1$ every extra term makes $T_n$ worse (the plot is clipped to a fixed window). Inside, raise $n$ to close the gap.`
        : `Error grows like $|x-a|^{n+1}$ — move the evaluation point away from the centre and watch it explode, then raise the degree to tame it.`,
    };
  },
});

// ---------------------------------------------------------------
EXPLORERS.push({
  id: 'series', name: 'Series Convergence', unit: 'series',
  blurb: 'Terms shrinking is not enough. Compare how the partial sums behave across families.',
  controls: [
    { key: 'family', kind: 'pick', label: 'series', options: ['1/n^p', 'geometric r^n', 'alternating (−1)ⁿ/n^p'], tex: { '1/n^p': '\\frac{1}{n^{p}}', 'geometric r^n': 'r^{n}', 'alternating (−1)ⁿ/n^p': '\\frac{(-1)^{n}}{n^{p}}' }, value: '1/n^p' },
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
        { label: `s_${N}`, tex: `s_{${N}}`, value: rd(partial, 4) },
        { label: 's₄₀₀', tex: 's_{400}', value: rd(sum, 4) },
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

// ---------------------------------------------------------------
// power-series interval of convergence: ratio test for the radius, then each endpoint by hand
const HARM = 'harmonic series $\\sum\\frac1n$ diverges (p = 1)';
const ALT = 'alternating harmonic $\\sum\\frac{(-1)^n}{n}$ converges (alternating series test)';
const POWER_FAMILIES = {
  'x^n/n': { c: 0, R: 1, a: (n, x) => Math.pow(x, n) / n,
    L: { ok: true, why: ALT }, Rt: { ok: false, why: HARM } },
  'x^n/n^2': { c: 0, R: 1, a: (n, x) => Math.pow(x, n) / (n * n),
    L: { ok: true, why: '$\\sum\\frac1{n^2}$ converges absolutely (p = 2 > 1)' }, Rt: { ok: true, why: '$\\sum\\frac1{n^2}$ converges (p = 2 > 1)' } },
  '(x-2)^n/3^n': { c: 2, R: 3, a: (n, x) => Math.pow((x - 2) / 3, n),
    L: { ok: false, why: 'terms are (−1)ⁿ and do not go to 0 (nth-term test)' }, Rt: { ok: false, why: 'terms are 1 and do not go to 0 (nth-term test)' } },
  'n!x^n': { c: 0, R: 0, a: (n, x) => fact(n) * Math.pow(x, n) },
  'x^n/n!': { c: 0, R: Infinity, a: (n, x) => Math.pow(x, n) / fact(n) },
  '(x+1)^n/(n·4^n)': { c: -1, R: 4, a: (n, x) => Math.pow((x + 1) / 4, n) / n,
    L: { ok: true, why: ALT }, Rt: { ok: false, why: HARM } },
};

EXPLORERS.push({
  id: 'powerint', name: 'Interval of Convergence', unit: 'series',
  blurb: 'Ratio test gives the radius; the endpoints need their own test. Pick a series, slide $x$ across the line, and see which side of each endpoint you are on.',
  controls: [
    { key: 'family', kind: 'pick', label: 'series Σ aₙ', options: Object.keys(POWER_FAMILIES), value: 'x^n/n', tex: {
      'x^n/n': '\\frac{x^{n}}{n}', 'x^n/n^2': '\\frac{x^{n}}{n^{2}}', '(x-2)^n/3^n': '\\frac{(x-2)^{n}}{3^{n}}',
      'n!x^n': 'n!\\,x^{n}', 'x^n/n!': '\\frac{x^{n}}{n!}', '(x+1)^n/(n·4^n)': '\\frac{(x+1)^{n}}{n\\cdot 4^{n}}' } },
    { key: 'x', kind: 'range', label: 'evaluate at x =', min: -6, max: 6, step: 0.25, value: 0.5 },
    { key: 'N', kind: 'range', label: 'terms N', min: 5, max: 60, step: 1, value: 20 },
  ],
  render(s) {
    const P = POWER_FAMILIES[s.family] || POWER_FAMILIES['x^n/n'];
    const { c, R } = P;
    const x = s.x, N = Math.max(5, Math.round(s.N));
    const eps = 1e-9;
    let interval, verdict, why;
    const lo = c - R, hi = c + R;
    if (R === Infinity) interval = '(-∞, ∞)';
    else if (R === 0) interval = `{${c}}`;
    else interval = `${P.L.ok ? '[' : '('}${lo}, ${hi}${P.Rt.ok ? ']' : ')'}`;
    if (R === Infinity) { verdict = 'converges'; why = 'ratio test: |aₙ₊₁/aₙ| → 0 < 1 for every x'; }
    else if (R === 0) {
      if (Math.abs(x - c) < eps) { verdict = 'converges'; why = 'only at the centre: every term but a₀ is 0'; }
      else { verdict = 'diverges'; why = 'ratio test: |aₙ₊₁/aₙ| → ∞ for every x ≠ 0'; }
    } else {
      const d = Math.abs(x - c);
      if (d < R - eps) { verdict = 'converges (absolutely)'; why = `ratio test: |x−c|/R = ${rd(d / R, 3)} < 1`; }
      else if (d > R + eps) { verdict = 'diverges'; why = `ratio test: |x−c|/R = ${rd(d / R, 3)} > 1`; }
      else {
        const e = x < c ? P.L : P.Rt;
        verdict = e.ok ? 'converges (endpoint)' : 'diverges (endpoint)';
        why = `ratio test is silent at |x−c| = R; ${e.why}`;
      }
    }
    const v1 = V.interval({
      center: c, R, leftClosed: R !== 0 && R !== Infinity && P.L.ok, rightClosed: R !== 0 && R !== Infinity && P.Rt.ok,
      verdictColors: true, mark: { x, label: `x = ${rd(x, 2)}` },
      note: R === 0 || R === Infinity ? undefined : `R = ${rd(R, 3)}   ·   filled = converges at endpoint, open = diverges`,
    });
    const v2 = V.series({ a: n => P.a(n, x), N, start: 1, cap: '' });
    return {
      svg: v1.svg + v2.svg,
      readout: [
        { label: 'centre', value: String(c) },
        { label: 'radius R', value: R === Infinity ? '∞' : String(R) },
        { label: 'interval', value: interval },
        { label: `at x = ${rd(x, 2)}`, value: verdict, hot: /^diverges/.test(verdict) },
        { label: 'why', value: why, wide: true },
      ],
      note: 'Top: the interval of convergence. Bottom: terms and partial sums at your $x$ — they settle when $x$ is inside, run away when outside. Endpoints are the only places that need a second test.',
    };
  },
});

// ---------------------------------------------------------------
// Lagrange remainder: closed-form (n+1)th derivative, M by dense sampling (+ exact critical points for sin/cos)
const phase = ph => (k, x) => Math.sin(x + k * Math.PI / 2 + ph);
const REM_FNS = {
  'e^x': { c: 0, f: Math.exp, d: (k, x) => Math.exp(x), rmax: 4 },
  'sin x': { c: 0, f: Math.sin, d: phase(0), ph: 0, rmax: 4 },
  'cos x': { c: 0, f: Math.cos, d: phase(Math.PI / 2), ph: Math.PI / 2, rmax: 4 },
  'ln(1+x)': {
    c: 0, f: x => Math.log(1 + x), rmax: 0.9, why: 'ln(1+x) needs x > −1, so r is capped at 0.9',
    d: (k, x) => (k === 0 ? Math.log(1 + x) : (k % 2 ? 1 : -1) * fact(k - 1) / Math.pow(1 + x, k)),
  },
  'sqrt(x) at 4': {
    c: 4, f: Math.sqrt, rmax: 3.5, why: '√x is singular at 0, so r is capped at 3.5 (interval stays right of 0.5)',
    d: (k, x) => { let m = 1; for (let j = 0; j < k; j++) m *= 0.5 - j; return m * Math.pow(x, 0.5 - k); },
  },
  'ln x at 4': {
    c: 4, f: Math.log, rmax: 3.5, why: 'ln x is singular at 0, so r is capped at 3.5 (interval stays right of 0.5)',
    d: (k, x) => (k === 0 ? Math.log(x) : (k % 2 ? 1 : -1) * fact(k - 1) / Math.pow(x, k)),
  },
  '1/x at 1': {
    c: 1, f: x => 1 / x, rmax: 0.9, why: '1/x is singular at 0, so r is capped at 0.9 (interval stays right of 0.1)',
    d: (k, x) => (k % 2 ? -1 : 1) * fact(k) / Math.pow(x, k + 1),
  },
};

EXPLORERS.push({
  id: 'remainder', name: 'Taylor Remainder (Lagrange)', unit: 'series',
  blurb: 'The true error of $T_n$ always hides under the Lagrange bound $M|x-c|^{n+1}/(n+1)!$. Watch the gap and the bound shrink together.',
  controls: [
    { key: 'fn', kind: 'pick', label: 'function', options: Object.keys(REM_FNS), value: 'e^x', tex: {
      'e^x': 'e^{x}', 'sin x': '\\sin x', 'cos x': '\\cos x', 'ln(1+x)': '\\ln(1+x)', 'sqrt(x) at 4': '\\sqrt{x}\\text{ at }4',
      'ln x at 4': '\\ln x\\text{ at }4', '1/x at 1': '\\tfrac1x\\text{ at }1' } },
    { key: 'n', kind: 'range', label: 'degree n', min: 0, max: 8, step: 1, value: 2 },
    { key: 'r', kind: 'range', label: 'half-width r', min: 0.1, max: 4, step: 0.1, value: 1 },
  ],
  render(s) {
    const F = REM_FNS[s.fn] || REM_FNS['e^x'];
    const n = Math.max(0, Math.round(s.n)), c = F.c;
    const r = Math.min(s.r, F.rmax), clamped = s.r > F.rmax + 1e-12;
    const lo = c - r, hi = c + r;
    const coef = []; for (let k = 0; k <= n; k++) coef.push(F.d(k, c) / fact(k));
    const T = x => { let t = 0; for (let k = n; k >= 0; k--) t = t * (x - c) + coef[k]; return t; };
    const err = x => Math.abs(F.f(x) - T(x));
    // M = max |f^(n+1)| on [lo, hi]: dense grid + exact critical points for sin/cos
    const pts = [];
    for (let i = 0; i <= 4000; i++) pts.push(lo + (hi - lo) * i / 4000);
    if (F.ph !== undefined) {
      const base = Math.PI / 2 - (n + 1) * Math.PI / 2 - F.ph;
      for (let m = Math.ceil((lo - base) / Math.PI); base + m * Math.PI <= hi; m++) pts.push(base + m * Math.PI);
    }
    let M = 0, xM = c;
    for (const x of pts) { const v = Math.abs(F.d(n + 1, x)); if (v > M) { M = v; xM = x; } }
    const bound = x => M * Math.pow(Math.abs(x - c), n + 1) / fact(n + 1);
    let actual = 0, xA = c;
    for (let i = 0; i <= 2000; i++) { const x = lo + (hi - lo) * i / 2000; const e = err(x); if (e > actual) { actual = e; xA = x; } }
    const edge = bound(hi) > bound(lo) ? bound(hi) : bound(lo);
    const holds = edge + 1e-12 >= actual;   // 1e-12 = float roundoff in f - T_n
    const top = Math.max(edge, actual) * 1.1 || 1;
    const v = V.plot({
      xmin: lo, xmax: hi, ymin: 0, ymax: top,
      curves: [
        { f: bound, color: 'var(--amber)', label: 'bound', dash: '6 4', w: 2 },
        { f: err, color: 'var(--cyan)', label: '|f − Tₙ|', w: 2.4 },
      ],
      vlines: [{ x: c, color: 'var(--ink-3)', dash: '3 4', label: `c = ${rd(c, 2)}` }],
      points: [{ x: xA, y: actual, color: 'var(--cyan)' }],
      ylabel: 'error',
    });
    return {
      svg: v.svg,
      data: { bound: edge, actual, M, holds },
      readout: [
        { label: 'interval', value: `[${rd(lo, 3)}, ${rd(hi, 3)}]`.replace(/-/g, '−') },
        { label: `M = max|f⁽${n + 1}⁾|`, tex: `M=\\max|f^{(${n + 1})}|`, value: `${sg(M)} at x = ${rd(xM, 2)}`.replace(/-/g, '−') },
        { label: 'bound at edge', value: sg(edge) },
        { label: 'actual max error', value: `${sg(actual)} at x = ${rd(xA, 2)}`.replace(/-/g, '−') },
        { label: 'bound ≥ actual', tex: '\\text{bound}\\ge\\text{actual}', value: holds ? 'yes' : 'NO — bug', hot: !holds },
      ],
      note: (clamped ? `${F.why}. ` : F.why ? `${F.why}. ` : '') +
        `$M$ is the largest $|f^{(${n + 1})}|$ anywhere on the interval, so the bound is a worst-case ceiling.`,
    };
  },
});

// ---------------------------------------------------------------
// alternating-series error bound: |S - S_N| <= |a_{N+1}|
const ALT_EXS = {
  '∫₀¹ e^{-x²} dx': { a: j => (j % 2 ? 1 : -1) / (fact(j - 1) * (2 * j - 1)), truth: () => simpson(x => Math.exp(-x * x), 0, 1) },
  'sin(0.5)': { a: j => (j % 2 ? 1 : -1) * Math.pow(0.5, 2 * j - 1) / fact(2 * j - 1), truth: () => Math.sin(0.5) },
  'ln(1.2)': { a: j => (j % 2 ? 1 : -1) * Math.pow(0.2, j) / j, truth: () => Math.log(1.2) },
  '∫₀^{0.5} cos(x²) dx': { a: j => (j % 2 ? 1 : -1) * Math.pow(0.5, 4 * j - 3) / (fact(2 * j - 2) * (4 * j - 3)), truth: () => simpson(x => Math.cos(x * x), 0, 0.5) },
  'arctan(0.2)': { a: j => (j % 2 ? 1 : -1) * Math.pow(0.2, 2 * j - 1) / (2 * j - 1), truth: () => Math.atan(0.2) },
  'e^{-0.3}': { a: j => (j % 2 ? 1 : -1) * Math.pow(0.3, j - 1) / fact(j - 1), truth: () => Math.exp(-0.3) },
};

EXPLORERS.push({
  id: 'altest', name: 'Alternating Series Error', unit: 'series',
  blurb: 'Stop an alternating series after $N$ terms: the error is no bigger than the first term you dropped.',
  controls: [
    { key: 'ex', kind: 'pick', label: 'quantity', options: Object.keys(ALT_EXS), value: 'sin(0.5)', tex: {
      '∫₀¹ e^{-x²} dx': '\\int_0^1 e^{-x^{2}}dx', 'sin(0.5)': '\\sin(0.5)', 'ln(1.2)': '\\ln(1.2)',
      '∫₀^{0.5} cos(x²) dx': '\\int_0^{0.5}\\cos(x^{2})dx', 'arctan(0.2)': '\\arctan(0.2)', 'e^{-0.3}': 'e^{-0.3}' } },
    { key: 'N', kind: 'range', label: 'terms N', min: 1, max: 8, step: 1, value: 3 },
  ],
  render(s) {
    const E = ALT_EXS[s.ex] || ALT_EXS['sin(0.5)'];
    const N = Math.max(1, Math.round(s.N));
    let S = 0; for (let j = 1; j <= N; j++) S += E.a(j);
    const truth = E.truth();
    const error = Math.abs(truth - S);
    const next = Math.abs(E.a(N + 1));
    const holds = error <= next + 1e-13;   // 1e-13 = float roundoff floor
    const show = Math.min(N, 4);
    let ser = ''; for (let j = 1; j <= show; j++) { const t = E.a(j); ser += (j === 1 ? '' : t < 0 ? ' − ' : ' + ') + rd(j === 1 ? t : Math.abs(t), 6); }
    ser += ' + …';
    const v = V.series({ a: E.a, N, start: 1, limit: truth, limitLabel: `true ${rd(truth, 5)}`, cap: '' });
    return {
      svg: v.svg,
      data: { error, next, holds },
      readout: [
        { label: 'series', value: ser.replace(/-/g, '−'), wide: true },
        { label: `S_${N}`, tex: `S_{${N}}`, value: sg(S, 6) },
        { label: 'true value', value: sg(truth, 6) },
        { label: 'actual error', value: sg(error) },
        { label: `next term |a_${N + 1}|`, tex: `|a_{${N + 1}}|`, value: sg(next) },
        { label: 'error ≤ next term', tex: '\\text{error}\\le\\text{next}', value: holds ? 'yes' : 'NO — bug', hot: !holds },
      ],
      note: 'Terms alternate in sign and shrink to 0, so the partial sums leapfrog the true value and the error is trapped by the next term. Below about $10^{-13}$ the comparison is lost in floating-point roundoff.',
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
