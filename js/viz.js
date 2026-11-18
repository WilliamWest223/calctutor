// ---------------------------------------------------------------
// viz.js — SVG visual explanations. Every generator returns SVG
// markup sized to a 0..W x 0..H viewBox; CSS variables supply color
// so figures track the active theme.
// ---------------------------------------------------------------
import { esc } from './util.js';

const W = 700, H = 330;
const PAD = { l: 46, r: 20, t: 22, b: 34 };

const C = {
  f: 'var(--cyan)', g: 'var(--violet)', hi: 'var(--lime)', bad: 'var(--coral)',
  warn: 'var(--amber)', axis: 'var(--ink-3)', grid: 'var(--line)', text: 'var(--ink-2)',
  strong: 'var(--ink)',
};

// ---------------- core plotting frame ----------------
class Frame {
  constructor(o = {}) {
    this.w = o.w || W; this.h = o.h || H;
    this.pad = Object.assign({}, PAD, o.pad);
    this.xmin = o.xmin ?? -1; this.xmax = o.xmax ?? 1;
    this.ymin = o.ymin ?? -1; this.ymax = o.ymax ?? 1;
    this.parts = [];
  }
  get iw() { return this.w - this.pad.l - this.pad.r; }
  get ih() { return this.h - this.pad.t - this.pad.b; }
  X(x) { return this.pad.l + ((x - this.xmin) / (this.xmax - this.xmin)) * this.iw; }
  Y(y) { return this.pad.t + (1 - (y - this.ymin) / (this.ymax - this.ymin)) * this.ih; }
  add(s) { this.parts.push(s); return this; }
  ok(p) { return isFinite(p) && Math.abs(p) < 1e7; }

  /** sample f into path segments, breaking at discontinuities/out-of-view */
  path(f, a = this.xmin, b = this.xmax, n = 420) {
    const segs = []; let cur = [];
    const lim = (this.ymax - this.ymin) * 6;
    let prev = null;
    for (let i = 0; i <= n; i++) {
      const x = a + (b - a) * (i / n);
      let y; try { y = f(x); } catch (e) { y = NaN; }
      const bad = !this.ok(y) || y > this.ymax + lim || y < this.ymin - lim ||
        (prev !== null && Math.abs(y - prev) > lim * 0.9);
      if (bad) { if (cur.length > 1) segs.push(cur); cur = []; prev = null; continue; }
      cur.push([this.X(x), this.Y(Math.max(this.ymin - lim, Math.min(this.ymax + lim, y)))]);
      prev = y;
    }
    if (cur.length > 1) segs.push(cur);
    return segs.map(s => 'M' + s.map(p => `${p[0].toFixed(1)},${p[1].toFixed(1)}`).join('L')).join(' ');
  }

  curve(f, opt = {}) {
    const d = this.path(f, opt.from ?? this.xmin, opt.to ?? this.xmax, opt.n);
    if (!d) return this;
    return this.add(`<path d="${d}" fill="none" stroke="${opt.color || C.f}" stroke-width="${opt.w || 2.1}"
      stroke-linecap="round" stroke-linejoin="round"${opt.dash ? ` stroke-dasharray="${opt.dash}"` : ''}
      opacity="${opt.op ?? 1}"/>`);
  }

  /** shaded vertical region between top f and bottom g on [a,b] */
  band(f, g, a, b, opt = {}) {
    const n = opt.n || 260, up = [], dn = [];
    for (let i = 0; i <= n; i++) {
      const x = a + (b - a) * (i / n);
      let yt = f(x), yb = g ? g(x) : 0;
      if (!this.ok(yt) || !this.ok(yb)) continue;
      const cl = v => Math.max(this.ymin - 0.5, Math.min(this.ymax + 0.5, v));
      up.push([this.X(x), this.Y(cl(yt))]); dn.push([this.X(x), this.Y(cl(yb))]);
    }
    if (up.length < 2) return this;
    const d = 'M' + up.map(p => `${p[0].toFixed(1)},${p[1].toFixed(1)}`).join('L') +
      'L' + dn.reverse().map(p => `${p[0].toFixed(1)},${p[1].toFixed(1)}`).join('L') + 'Z';
    return this.add(`<path d="${d}" fill="${opt.color || C.hi}" opacity="${opt.op ?? .17}"
      ${opt.stroke ? `stroke="${opt.color || C.hi}" stroke-width="1"` : ''}/>`);
  }

  axes(o = {}) {
    const { xmin, xmax, ymin, ymax } = this;
    const g = [];
    const xs = o.xticks || ticks(xmin, xmax);
    const ys = o.yticks || ticks(ymin, ymax);
    for (const t of xs) g.push(`<line x1="${this.X(t)}" y1="${this.pad.t}" x2="${this.X(t)}" y2="${this.h - this.pad.b}" stroke="${C.grid}" stroke-width="1"/>`);
    for (const t of ys) g.push(`<line x1="${this.pad.l}" y1="${this.Y(t)}" x2="${this.w - this.pad.r}" y2="${this.Y(t)}" stroke="${C.grid}" stroke-width="1"/>`);
    const y0 = Math.max(this.pad.t, Math.min(this.h - this.pad.b, this.Y(0)));
    const x0 = Math.max(this.pad.l, Math.min(this.w - this.pad.r, this.X(0)));
    g.push(`<line x1="${this.pad.l}" y1="${y0}" x2="${this.w - this.pad.r}" y2="${y0}" stroke="${C.axis}" stroke-width="1.3"/>`);
    g.push(`<line x1="${x0}" y1="${this.pad.t}" x2="${x0}" y2="${this.h - this.pad.b}" stroke="${C.axis}" stroke-width="1.3"/>`);
    if (o.labels !== false) {
      for (const t of xs) if (Math.abs(t) > 1e-9) g.push(txt(this.X(t), y0 + 14, num(t), { size: 10, anchor: 'middle', fill: C.text }));
      for (const t of ys) if (Math.abs(t) > 1e-9) g.push(txt(x0 - 6, this.Y(t) + 3.5, num(t), { size: 10, anchor: 'end', fill: C.text }));
    }
    if (o.xlabel) g.push(txt(this.w - this.pad.r, y0 - 8, o.xlabel, { size: 12, anchor: 'end', fill: C.text, style: 'italic' }));
    if (o.ylabel) g.push(txt(x0 + 6, this.pad.t - 8, o.ylabel, { size: 12, fill: C.text, style: 'italic' }));
    this.parts.unshift(g.join(''));
    return this;
  }

  vline(x, o = {}) {
    return this.add(`<line x1="${this.X(x)}" y1="${this.pad.t}" x2="${this.X(x)}" y2="${this.h - this.pad.b}"
      stroke="${o.color || C.warn}" stroke-width="${o.w || 1.4}" stroke-dasharray="${o.dash || '4 4'}" opacity="${o.op ?? .85}"/>` +
      (o.label ? txt(this.X(x) + 4, this.pad.t + 12, o.label, { size: 11, fill: o.color || C.warn }) : ''));
  }
  seg(x1, y1, x2, y2, o = {}) {
    return this.add(`<line x1="${this.X(x1)}" y1="${this.Y(y1)}" x2="${this.X(x2)}" y2="${this.Y(y2)}"
      stroke="${o.color || C.text}" stroke-width="${o.w || 1.5}"${o.dash ? ` stroke-dasharray="${o.dash}"` : ''} opacity="${o.op ?? 1}"
      ${o.cap ? `stroke-linecap="${o.cap}"` : ''}/>`);
  }
  dot(x, y, o = {}) {
    const fill = o.open ? 'var(--panel)' : (o.fill || o.color || C.hi);
    const ring = o.open ? ` stroke="${o.color || C.hi}" stroke-width="1.8"` : '';
    return this.add(`<circle cx="${this.X(x)}" cy="${this.Y(y)}" r="${o.r || 3.6}" fill="${fill}"${ring}/>` +
      (o.label ? txt(this.X(x) + (o.lx ?? 7), this.Y(y) + (o.ly ?? -7), o.label, { size: 11, fill: o.color || C.strong }) : ''));
  }
  label(x, y, s, o = {}) { return this.add(txt(this.X(x), this.Y(y), s, o)); }
  rect(x0, y0, x1, y1, o = {}) {
    const X = Math.min(this.X(x0), this.X(x1)), Y = Math.min(this.Y(y0), this.Y(y1));
    return this.add(`<rect x="${X}" y="${Y}" width="${Math.abs(this.X(x1) - this.X(x0))}" height="${Math.abs(this.Y(y1) - this.Y(y0))}"
      fill="${o.fill || C.hi}" opacity="${o.op ?? .2}" stroke="${o.stroke || o.fill || C.hi}" stroke-width="${o.w ?? 1}"/>`);
  }
  ellipse(cx, cy, rx, ry, o = {}) {
    return this.add(`<ellipse cx="${this.X(cx)}" cy="${this.Y(cy)}" rx="${Math.abs(this.X(rx) - this.X(0))}"
      ry="${Math.abs(this.Y(ry) - this.Y(0))}" fill="${o.fill || 'none'}" opacity="${o.op ?? 1}"
      stroke="${o.stroke || C.hi}" stroke-width="${o.w || 1.4}"${o.dash ? ` stroke-dasharray="${o.dash}"` : ''}/>`);
  }
  legend(items, o = {}) {
    const x = o.x ?? this.w - this.pad.r - 8, y0 = o.y ?? this.pad.t + 4;
    const rows = items.map((it, i) => {
      const y = y0 + i * 17;
      return `<line x1="${x - 112}" y1="${y - 4}" x2="${x - 94}" y2="${y - 4}" stroke="${it.color}" stroke-width="2.4"${it.dash ? ` stroke-dasharray="${it.dash}"` : ''}/>` +
        txt(x - 88, y, it.label, { size: 11, fill: C.text });
    }).join('');
    return this.add(`<rect x="${x - 120}" y="${y0 - 16}" width="128" height="${items.length * 17 + 8}" rx="5"
      fill="var(--panel)" opacity=".82" stroke="${C.grid}"/>` + rows);
  }
  out() {
    return `<svg viewBox="0 0 ${this.w} ${this.h}" xmlns="http://www.w3.org/2000/svg"
      font-family="'IBM Plex Mono',monospace" role="img">${this.parts.join('')}</svg>`;
  }
}

function txt(x, y, s, o = {}) {
  return `<text x="${x}" y="${y}" font-size="${o.size || 11}" fill="${o.fill || C.text}"
    text-anchor="${o.anchor || 'start'}"${o.style ? ` font-style="${o.style}"` : ''}
    ${o.weight ? `font-weight="${o.weight}"` : ''}>${esc(s)}</text>`;
}

function num(t) {
  const r = Math.round(t * 1000) / 1000;
  return Math.abs(r) >= 1000 ? r.toExponential(0) : String(r);
}

function ticks(lo, hi, target = 8) {
  const span = hi - lo;
  const raw = span / target;
  const mag = 10 ** Math.floor(Math.log10(raw));
  const step = [1, 2, 2.5, 5, 10].map(m => m * mag).find(s => s >= raw) || mag * 10;
  const out = [];
  for (let t = Math.ceil(lo / step) * step; t <= hi + step * 1e-6; t += step) out.push(Math.round(t / step) * step);
  return out;
}

function autoY(fns, xmin, xmax) {
  let lo = Infinity, hi = -Infinity;
  for (const f of fns) {
    for (let i = 0; i <= 200; i++) {
      const x = xmin + (xmax - xmin) * i / 200;
      let y; try { y = f(x); } catch (e) { continue; }
      if (!isFinite(y) || Math.abs(y) > 1e5) continue;
      lo = Math.min(lo, y); hi = Math.max(hi, y);
    }
  }
  if (!isFinite(lo)) { lo = -1; hi = 1; }
  if (hi - lo < 1e-6) { hi = lo + 1; }
  const pad = (hi - lo) * 0.18;
  return [Math.min(0, lo - pad), hi + pad];
}

// =================================================================
// public builders — each returns { svg, cap }
// =================================================================

/** Generic multi-curve plot with optional shading. */
export function plot(o) {
  const fns = (o.curves || []).map(c => c.f);
  let [ymin, ymax] = o.ymin != null ? [o.ymin, o.ymax] : autoY(fns, o.xmin, o.xmax);
  const F = new Frame({ xmin: o.xmin, xmax: o.xmax, ymin, ymax, w: o.w, h: o.h });
  F.axes({ xlabel: o.xlabel ?? 'x', ylabel: o.ylabel ?? 'y' });
  (o.bands || []).forEach(b => F.band(b.f, b.g || (() => 0), b.a, b.b, b));
  (o.curves || []).forEach(c => F.curve(c.f, c));
  (o.vlines || []).forEach(v => F.vline(v.x, v));
  (o.points || []).forEach(p => F.dot(p.x, p.y, p));
  (o.segs || []).forEach(s => F.seg(s.x1, s.y1, s.x2, s.y2, s));
  (o.labels || []).forEach(l => F.label(l.x, l.y, l.text, l));
  const leg = (o.curves || []).filter(c => c.label).map(c => ({ label: c.label, color: c.color || C.f, dash: c.dash }));
  if (leg.length > 1 || o.forceLegend) F.legend(leg, o.legendPos);
  return { svg: F.out(), cap: o.cap };
}

/** Area between two curves, with a representative slice. */
export function area(o) {
  const top = o.top, bot = o.bot || (() => 0);
  let [ymin, ymax] = autoY([top, bot], o.xmin, o.xmax);
  const F = new Frame({ xmin: o.xmin, xmax: o.xmax, ymin, ymax });
  F.axes({ xlabel: 'x', ylabel: 'y' });
  F.band(top, bot, o.a, o.b, { color: C.hi, op: .19 });
  F.curve(top, { color: C.f, label: o.topLabel });
  if (o.bot) F.curve(bot, { color: C.g, label: o.botLabel });
  F.vline(o.a, { label: `x=${num(o.a)}` }); F.vline(o.b, { label: `x=${num(o.b)}` });
  (o.vlines || []).forEach(v => F.vline(v.x, v));
  if (o.slice != null) {
    const xs = o.slice;
    F.seg(xs, bot(xs), xs, top(xs), { color: C.warn, w: 2.6, cap: 'round' });
    F.label(xs, top(xs), '  slice: (top − bottom)', { size: 10.5, fill: C.warn });
  }
  F.legend([
    { label: o.topLabel || 'top', color: C.f },
    ...(o.bot ? [{ label: o.botLabel || 'bottom', color: C.g }] : []),
  ]);
  return { svg: F.out(), cap: o.cap };
}

/** Riemann / trapezoid / midpoint approximation picture. */
export function riemann(o) {
  // NB: `kind` is reserved by build() for dispatch, so the rule lives on `rule`
  const f = o.f, n = o.n || 6, a = o.a, b = o.b, kind = o.rule || o.kind2 || 'left';
  let [ymin, ymax] = autoY([f], a - (b - a) * .1, b + (b - a) * .1);
  const F = new Frame({ xmin: a - (b - a) * .12, xmax: b + (b - a) * .12, ymin, ymax });
  F.axes({ xlabel: 'x' });
  const dx = (b - a) / n;
  for (let i = 0; i < n; i++) {
    const x0 = a + i * dx, x1 = x0 + dx;
    if (kind === 'trap') {
      const d = `M${F.X(x0)},${F.Y(0)} L${F.X(x0)},${F.Y(f(x0))} L${F.X(x1)},${F.Y(f(x1))} L${F.X(x1)},${F.Y(0)} Z`;
      F.add(`<path d="${d}" fill="${C.hi}" fill-opacity=".16" stroke="${C.hi}" stroke-width="1.5" stroke-opacity=".85"/>`);
    } else {
      const xs = kind === 'left' ? x0 : kind === 'right' ? x1 : (x0 + x1) / 2;
      F.rect(x0, 0, x1, f(xs), { fill: C.hi, op: .17, stroke: C.hi });
    }
  }
  F.curve(f, { color: C.f, w: 2.3 });
  F.label(a + (b - a) / 2, ymax * .92, o.tag || `${kind} sum, n = ${n}`, { anchor: 'middle', size: 11.5, fill: C.strong });
  return { svg: F.out(), cap: o.cap };
}

/** Solid of revolution: the region, its mirror across the axis, and one representative slice.
 *  Curves are drawn only on [a,b] — the solid does not exist outside it. */
export function revolve(o) {
  const top = o.top, bot = o.bot || (() => 0), axis = o.axis ?? 0;
  const a = o.a, b = o.b;
  const ref = y => 2 * axis - y;                        // reflection through the axis

  // vertical window must hold the region AND its mirror image
  let [rlo, rhi] = autoY([top, bot], a, b);
  const reach = Math.max(Math.abs(rhi - axis), Math.abs(rlo - axis), 1e-6);
  const ymin = axis - reach * 1.22, ymax = axis + reach * 1.22;

  const padX = (b - a) * .2;
  const F = new Frame({ xmin: a - padX, xmax: b + padX, ymin, ymax });
  F.axes({ xlabel: 'x' });
  const xSpan = F.xmax - F.xmin;

  F.band(top, bot, a, b, { color: C.hi, op: .2 });
  F.band(x => ref(top(x)), x => ref(bot(x)), a, b, { color: C.hi, op: .07 });
  F.curve(top, { color: C.f, w: 2.2, from: a, to: b });
  F.curve(x => ref(top(x)), { color: C.f, w: 1.2, op: .45, dash: '4 3', from: a, to: b });
  if (o.bot) {
    F.curve(bot, { color: C.g, w: 2, from: a, to: b });
    F.curve(x => ref(bot(x)), { color: C.g, w: 1.1, op: .45, dash: '4 3', from: a, to: b });
  }

  // axis of rotation
  F.add(`<line x1="${F.pad.l}" y1="${F.Y(axis)}" x2="${F.w - F.pad.r}" y2="${F.Y(axis)}"
     stroke="${C.warn}" stroke-width="2" stroke-dasharray="7 4"/>`);
  F.add(txt(F.w - F.pad.r - 4, F.pad.t + 12, `axis of rotation: ${o.axisLabel || 'y = ' + num(axis)}`,
    { size: 10.5, fill: C.warn, anchor: 'end' }));

  const xs = Math.min(Math.max(o.slice ?? (a + b) / 2, a), b);
  if (o.method === 'shell') {
    const axisX = o.axisX ?? 0;
    F.seg(xs, bot(xs), xs, top(xs), { color: C.bad, w: 3.4, cap: 'round' });
    F.seg(2 * axisX - xs, bot(xs), 2 * axisX - xs, top(xs), { color: C.bad, w: 1.8, op: .45, cap: 'round' });
    F.add(`<line x1="${F.X(2 * axisX - xs)}" y1="${F.Y(top(xs))}" x2="${F.X(xs)}" y2="${F.Y(top(xs))}"
       stroke="${C.bad}" stroke-width="1" stroke-dasharray="3 3" opacity=".6"/>`);
    F.add(txt(F.X(xs) + 6, F.Y(top(xs)) - 8, 'shell: 2π·radius·height', { size: 10.5, fill: C.bad }));
  } else {
    // radii are DATA-UNIT lengths, not coordinates
    const R = top(xs) - axis;
    const thin = xSpan * .028;
    F.seg(xs, ref(top(xs)), xs, top(xs), { color: C.bad, w: 2.4 });
    F.ellipse(xs, axis, thin, R, { stroke: C.bad, w: 1.6 });
    if (o.bot) F.ellipse(xs, axis, thin * .62, bot(xs) - axis, { stroke: C.g, w: 1.3, dash: '3 2' });
    F.add(txt(F.X(xs) + 8, F.Y(ymax) + 16, o.bot ? 'washer: R² − r²' : 'disk: radius R',
      { size: 10.5, fill: C.bad }));
  }
  return { svg: F.out(), cap: o.cap };
}

/** Sequence / series behaviour: stems of a_n plus partial sums. */
export function series(o) {
  const N = o.N || 18, a = o.a;
  const terms = [], sums = []; let s = 0;
  for (let n = (o.start ?? 1); n < (o.start ?? 1) + N; n++) { const t = a(n); terms.push([n, t]); s += t; sums.push([n, s]); }
  const vals = [...terms.map(t => t[1]), ...(o.showSums === false ? [] : sums.map(t => t[1])), ...(o.limit != null ? [o.limit] : [])]
    .filter(v => isFinite(v));
  let lo = Math.min(0, ...vals), hi = Math.max(...vals);
  const pad = (hi - lo) * .16 || 1;
  const F = new Frame({ xmin: (o.start ?? 1) - .8, xmax: (o.start ?? 1) + N, ymin: lo - pad, ymax: hi + pad });
  F.axes({ xlabel: 'n', yticks: o.yticks });
  for (const [n, t] of terms) {
    if (!isFinite(t)) continue;
    F.seg(n, 0, n, t, { color: C.f, w: 2.4, op: .55, cap: 'round' });
    F.dot(n, t, { r: 2.8, fill: C.f });
  }
  if (o.showSums !== false) {
    const d = 'M' + sums.filter(p => isFinite(p[1])).map(p => `${F.X(p[0]).toFixed(1)},${F.Y(p[1]).toFixed(1)}`).join('L');
    F.add(`<path d="${d}" fill="none" stroke="${C.hi}" stroke-width="2.2" stroke-linejoin="round"/>`);
    sums.forEach(p => isFinite(p[1]) && F.dot(p[0], p[1], { r: 2.6, fill: C.hi }));
  }
  if (o.limit != null) {
    F.add(`<line x1="${F.pad.l}" y1="${F.Y(o.limit)}" x2="${F.w - F.pad.r}" y2="${F.Y(o.limit)}"
      stroke="${C.warn}" stroke-width="1.6" stroke-dasharray="6 4"/>`);
    F.add(txt(F.w - F.pad.r - 4, F.Y(o.limit) - 6, o.limitLabel || `→ ${num(o.limit)}`, { anchor: 'end', size: 11, fill: C.warn }));
  }
  F.legend([
    { label: o.termLabel || 'aₙ (terms)', color: C.f },
    ...(o.showSums === false ? [] : [{ label: o.sumLabel || 'sₙ (partial sums)', color: C.hi }]),
  ], { x: F.w - F.pad.r - 8 });
  return { svg: F.out(), cap: o.cap };
}

/** Interval of convergence on a number line. */
export function interval(o) {
  const c = o.center, R = o.R;
  const span = (isFinite(R) && R > 0 ? R : 1) * 2.6;
  const F = new Frame({ xmin: c - span, xmax: c + span, ymin: -1, ymax: 1, h: 150, pad: { l: 30, r: 30, t: 30, b: 44 } });
  F.add(`<line x1="${F.pad.l}" y1="${F.Y(0)}" x2="${F.w - F.pad.r}" y2="${F.Y(0)}" stroke="${C.axis}" stroke-width="1.5"/>`);
  for (const t of ticks(F.xmin, F.xmax, 9)) {
    F.add(`<line x1="${F.X(t)}" y1="${F.Y(0) - 4}" x2="${F.X(t)}" y2="${F.Y(0) + 4}" stroke="${C.axis}" stroke-width="1"/>`);
    F.add(txt(F.X(t), F.Y(0) + 19, num(t), { anchor: 'middle', size: 10, fill: C.text }));
  }
  if (!isFinite(R)) {
    F.add(`<line x1="${F.pad.l}" y1="${F.Y(0)}" x2="${F.w - F.pad.r}" y2="${F.Y(0)}" stroke="${C.hi}" stroke-width="7" opacity=".3"/>`);
    F.add(txt(F.w / 2, F.Y(0) - 22, 'converges for every x   (R = ∞)', { anchor: 'middle', size: 12, fill: C.hi }));
  } else if (R === 0) {
    F.dot(c, 0, { r: 5, fill: C.hi });
    F.add(txt(F.X(c), F.Y(0) - 20, 'converges only at the center (R = 0)', { anchor: 'middle', size: 12, fill: C.hi }));
  } else {
    F.add(`<line x1="${F.X(c - R)}" y1="${F.Y(0)}" x2="${F.X(c + R)}" y2="${F.Y(0)}" stroke="${C.hi}" stroke-width="7" opacity=".32"/>`);
    F.dot(c, 0, { r: 3.4, fill: C.warn });
    F.add(txt(F.X(c), F.Y(0) - 30, `center ${num(c)}`, { anchor: 'middle', size: 10.5, fill: C.warn }));
    // verdict: closed endpoint converges (green), open endpoint diverges (coral)
    const ec = closed => (o.verdictColors && !closed ? C.bad : C.hi);
    F.dot(c - R, 0, { r: 5.2, color: ec(o.leftClosed), open: !o.leftClosed, fill: o.leftClosed ? C.hi : undefined });
    F.dot(c + R, 0, { r: 5.2, color: ec(o.rightClosed), open: !o.rightClosed, fill: o.rightClosed ? C.hi : undefined });
    F.add(txt(F.X(c - R), F.Y(0) - 14, o.leftLabel || num(c - R), { anchor: 'middle', size: 11, fill: C.hi }));
    F.add(txt(F.X(c + R), F.Y(0) - 14, o.rightLabel || num(c + R), { anchor: 'middle', size: 11, fill: C.hi }));
    F.add(txt(F.w / 2, F.h - 10, o.note || `R = ${num(R)}`, { anchor: 'middle', size: 11.5, fill: C.text }));
  }
  if (o.mark) {   // evaluation point x, clamped into view; short tick + label below the axis so it never overlaps the endpoint labels above
    const mx = Math.max(F.xmin, Math.min(F.xmax, o.mark.x));
    const col = o.mark.color || C.g, X = F.X(mx);
    F.add(`<line x1="${X}" y1="${F.Y(0) - 8}" x2="${X}" y2="${F.Y(0) + 8}" stroke="${col}" stroke-width="2.4"/>`);
    F.add(txt(X, F.Y(0) + 36, o.mark.label || `x = ${num(o.mark.x)}`, { anchor: X < F.pad.l + 40 ? 'start' : X > F.w - F.pad.r - 40 ? 'end' : 'middle', size: 11, fill: col }));
  }
  return { svg: F.out(), cap: o.cap };
}

/** Polar curve r(θ) drawn in the plane, optional swept sector. */
export function polar(o) {
  const r = o.r, t0 = o.t0 ?? 0, t1 = o.t1 ?? Math.PI * 2;
  const pts = []; let R = 0;
  for (let i = 0; i <= 700; i++) {
    const t = t0 + (t1 - t0) * i / 700, rv = r(t);
    if (!isFinite(rv)) continue;
    pts.push([rv * Math.cos(t), rv * Math.sin(t)]);
    R = Math.max(R, Math.abs(rv));
  }
  R = Math.max(R, .5) * 1.25;
  // isotropic: units-per-pixel must match on both axes or circles render as ellipses
  const F = new Frame({ xmin: -R, xmax: R, ymin: -R, ymax: R, w: 620, h: 360 });
  const halfX = R * (F.iw / F.ih);
  F.xmin = -halfX; F.xmax = halfX;
  F.axes({ xlabel: 'x', ylabel: 'y' });
  for (let k = 1; k <= 3; k++) F.ellipse(0, 0, (R / 3) * k, (R / 3) * k, { stroke: C.grid, w: 1, dash: '3 4' });
  if (o.shade !== false) {
    const sp = pts.map(p => `${F.X(p[0]).toFixed(1)},${F.Y(p[1]).toFixed(1)}`).join('L');
    F.add(`<path d="M${F.X(0)},${F.Y(0)}L${sp}Z" fill="${C.hi}" opacity=".17"/>`);
  }
  F.add(`<path d="M${pts.map(p => `${F.X(p[0]).toFixed(1)},${F.Y(p[1]).toFixed(1)}`).join('L')}"
     fill="none" stroke="${C.f}" stroke-width="2.2" stroke-linejoin="round"/>`);
  (o.rays || []).forEach(t => {
    const rv = Math.abs(r(t)) || R * .8;
    F.seg(0, 0, rv * Math.cos(t), rv * Math.sin(t), { color: C.warn, dash: '4 3', w: 1.4 });
  });
  if (o.tag) F.add(txt(F.pad.l + 6, F.pad.t + 12, o.tag, { size: 12, fill: C.strong }));
  return { svg: F.out(), cap: o.cap };
}

/** Parametric curve with direction arrows. */
export function param(o) {
  const x = o.x, y = o.y, t0 = o.t0, t1 = o.t1;
  const pts = [];
  for (let i = 0; i <= 600; i++) { const t = t0 + (t1 - t0) * i / 600; pts.push([x(t), y(t), t]); }
  const xs = pts.map(p => p[0]), ys = pts.map(p => p[1]);
  const pX = (Math.max(...xs) - Math.min(...xs)) * .15 || 1, pY = (Math.max(...ys) - Math.min(...ys)) * .18 || 1;
  const F = new Frame({ xmin: Math.min(...xs) - pX, xmax: Math.max(...xs) + pX, ymin: Math.min(...ys) - pY, ymax: Math.max(...ys) + pY });
  F.axes({ xlabel: 'x', ylabel: 'y' });
  F.add(`<path d="M${pts.map(p => `${F.X(p[0]).toFixed(1)},${F.Y(p[1]).toFixed(1)}`).join('L')}"
     fill="none" stroke="${C.f}" stroke-width="2.2" stroke-linejoin="round"/>`);
  for (const frac2 of [.2, .5, .8]) {
    const i = Math.floor(600 * frac2), p = pts[i], q = pts[i + 6] || pts[i];
    const ang = Math.atan2(F.Y(q[1]) - F.Y(p[1]), F.X(q[0]) - F.X(p[0])) * 180 / Math.PI;
    F.add(`<g transform="translate(${F.X(p[0])},${F.Y(p[1])}) rotate(${ang})">
      <path d="M-5,-4 L5,0 L-5,4 Z" fill="${C.warn}"/></g>`);
  }
  (o.marks || []).forEach(t => F.dot(x(t), y(t), { r: 4, fill: C.hi, label: o.markLabel ? o.markLabel(t) : `t=${num(t)}` }));
  return { svg: F.out(), cap: o.cap };
}

/** Slope field for y' = F(x,y) with optional solution curves. */
export function slopefield(o) {
  const f = o.f, xr = o.xrange || [-3, 3], yr = o.yrange || [-3, 3];
  const F = new Frame({ xmin: xr[0], xmax: xr[1], ymin: yr[0], ymax: yr[1] });
  F.axes({ xlabel: 'x', ylabel: 'y' });
  const nx = o.nx || 15, ny = o.ny || 11, L = 11;
  for (let i = 0; i <= nx; i++) for (let j = 0; j <= ny; j++) {
    const x = xr[0] + (xr[1] - xr[0]) * i / nx, y = yr[0] + (yr[1] - yr[0]) * j / ny;
    let m; try { m = f(x, y); } catch (e) { continue; }
    if (!isFinite(m)) continue;
    const th = Math.atan(m), dx = Math.cos(th) * L / 2, dy = -Math.sin(th) * L / 2;
    const cx = F.X(x), cy = F.Y(y);
    const op = .28 + Math.min(.55, 1 / (1 + Math.abs(m)) * .6);
    F.add(`<line x1="${cx - dx}" y1="${cy - dy}" x2="${cx + dx}" y2="${cy + dy}" stroke="${C.text}" stroke-width="1.35" opacity="${op}"/>`);
  }
  (o.solutions || []).forEach((sol, k) => {
    const col = k === 0 ? C.hi : C.bad;
    const pts = eulerCurve(f, sol.x0, sol.y0, xr, .01);
    F.add(`<path d="M${pts.map(p => `${F.X(p[0]).toFixed(1)},${F.Y(p[1]).toFixed(1)}`).join('L')}"
       fill="none" stroke="${col}" stroke-width="2.3" stroke-linejoin="round"${sol.dash ? ` stroke-dasharray="${sol.dash}"` : ''}/>`);
    F.dot(sol.x0, sol.y0, { r: 4, fill: col });
  });
  return { svg: F.out(), cap: o.cap };
}

function eulerCurve(f, x0, y0, xr, hStep) {
  const fwd = [], back = [];
  let x = x0, y = y0;
  while (x <= xr[1]) { fwd.push([x, y]); const m = f(x, y); if (!isFinite(m) || Math.abs(y) > 1e4) break; y += m * hStep; x += hStep; }
  x = x0; y = y0;
  while (x >= xr[0]) { back.push([x, y]); const m = f(x, y); if (!isFinite(m) || Math.abs(y) > 1e4) break; y -= m * hStep; x -= hStep; }
  return back.reverse().concat(fwd.slice(1));
}

/** f versus successive Taylor polynomials. */
export function taylor(o) {
  const f = o.f, c = o.c ?? 0, polys = o.polys;   // polys: [{n, p}]
  const [ymin, ymax] = autoY([f], o.xmin, o.xmax);
  const F = new Frame({ xmin: o.xmin, xmax: o.xmax, ymin: o.ymin ?? ymin, ymax: o.ymax ?? ymax });
  F.axes({ xlabel: 'x' });
  const cols = [C.g, C.warn, C.bad, C.hi];
  polys.forEach((p, i) => F.curve(p.p, { color: cols[i % 4], w: 1.7, dash: '5 3', label: p.label || `T${p.n}` }));
  F.curve(f, { color: C.f, w: 2.6, label: o.fLabel || 'f(x)' });
  F.vline(c, { label: `center ${num(c)}`, color: C.text, dash: '3 4' });
  F.legend([{ label: o.fLabel || 'f(x)', color: C.f }, ...polys.map((p, i) => ({ label: p.label || `T${p.n}`, color: cols[i % 4], dash: '5 3' }))]);
  return { svg: F.out(), cap: o.cap };
}

/** Right triangle for a trig substitution. */
export function triangle(o) {
  const w = 520, h = 260;
  const P = { x: 90, y: 200 }, Q = { x: 380, y: 200 }, R = { x: 380, y: 60 };
  const s = [];
  s.push(`<path d="M${P.x},${P.y} L${Q.x},${Q.y} L${R.x},${R.y} Z" fill="${C.hi}" opacity=".10" stroke="${C.f}" stroke-width="2.2" stroke-linejoin="round"/>`);
  s.push(`<path d="M${Q.x - 18},${Q.y} L${Q.x - 18},${Q.y - 18} L${Q.x},${Q.y - 18}" fill="none" stroke="${C.axis}" stroke-width="1.4"/>`);
  s.push(`<path d="M${P.x + 34},${P.y} A34,34 0 0 0 ${P.x + 30},${P.y - 16}" fill="none" stroke="${C.warn}" stroke-width="1.6"/>`);
  s.push(txt(P.x + 42, P.y - 8, o.angle || 'θ', { size: 14, fill: C.warn, style: 'italic' }));
  s.push(txt((P.x + Q.x) / 2, Q.y + 22, o.adj, { size: 13, anchor: 'middle', fill: C.strong }));
  s.push(txt(R.x + 12, (Q.y + R.y) / 2 + 4, o.opp, { size: 13, fill: C.strong }));
  s.push(txt((P.x + R.x) / 2 - 12, (P.y + R.y) / 2 - 10, o.hyp, { size: 13, anchor: 'middle', fill: C.strong }));
  (o.notes || []).forEach((n, i) => s.push(txt(24, 30 + i * 20, n, { size: 12, fill: C.text })));
  return {
    svg: `<svg viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg" font-family="'IBM Plex Mono',monospace">${s.join('')}</svg>`,
    cap: o.cap,
  };
}

/** Improper integral: shrinking/growing tail with the limit marked. */
export function improper(o) {
  const f = o.f, a = o.a, b = o.b;
  // NB: never let autoY see the singularity — one huge sample would drag the
  // whole window (including ymin) off to thousands. Clip explicitly instead.
  const [alo] = autoY([f], a, b);
  const ymax = o.clip ?? autoY([f], a, b)[1];
  const ymin = o.ymin ?? Math.min(0, Math.max(alo, -ymax * 0.25));
  const F = new Frame({ xmin: o.xmin ?? a - (b - a) * .05, xmax: b, ymin, ymax });
  F.axes({ xlabel: 'x' });
  F.band(f, () => 0, o.shadeFrom ?? a, o.shadeTo ?? b, { color: C.hi, op: .18 });
  F.curve(f, { color: C.f, w: 2.3 });
  if (o.vertical != null) {
    F.vline(o.vertical, { color: C.bad, dash: '5 4', label: o.verticalLabel || 'singularity' });
  }
  if (o.tag) F.add(txt(F.w - F.pad.r - 6, F.pad.t + 14, o.tag, { anchor: 'end', size: 12, fill: C.strong }));
  return { svg: F.out(), cap: o.cap };
}

/** Bar comparison of two sequences (comparison test). */
export function compare(o) {
  const N = o.N || 14;
  const A = [], B = [];
  for (let n = 1; n <= N; n++) { A.push([n, o.a(n)]); B.push([n, o.b(n)]); }
  const hi = Math.max(...A.map(p => p[1]), ...B.map(p => p[1])) * 1.2;
  const F = new Frame({ xmin: .3, xmax: N + .7, ymin: 0, ymax: hi });
  F.axes({ xlabel: 'n' });
  const bw = (F.iw / N) * .34;
  A.forEach(([n, v]) => F.add(`<rect x="${F.X(n) - bw - 1}" y="${F.Y(v)}" width="${bw}" height="${F.Y(0) - F.Y(v)}" fill="${C.f}" opacity=".8" rx="1.5"/>`));
  B.forEach(([n, v]) => F.add(`<rect x="${F.X(n) + 1}" y="${F.Y(v)}" width="${bw}" height="${F.Y(0) - F.Y(v)}" fill="${C.warn}" opacity=".8" rx="1.5"/>`));
  F.legend([{ label: o.aLabel || 'aₙ', color: C.f }, { label: o.bLabel || 'bₙ', color: C.warn }]);
  return { svg: F.out(), cap: o.cap };
}

/** Arc length: curve with the inscribed polygon that defines it. */
export function arclen(o) {
  const f = o.f, a = o.a, b = o.b, n = o.n || 7;
  const [ymin, ymax] = autoY([f], a, b);
  const F = new Frame({ xmin: a - (b - a) * .1, xmax: b + (b - a) * .1, ymin, ymax });
  F.axes({ xlabel: 'x' });
  F.curve(f, { color: C.f, w: 2.4 });
  for (let i = 0; i < n; i++) {
    const x0 = a + (b - a) * i / n, x1 = a + (b - a) * (i + 1) / n;
    F.seg(x0, f(x0), x1, f(x1), { color: C.hi, w: 1.8, dash: '5 3' });
    F.seg(x0, f(x0), x1, f(x0), { color: C.text, w: 1, op: .5 });
    F.seg(x1, f(x0), x1, f(x1), { color: C.text, w: 1, op: .5 });
    F.dot(x0, f(x0), { r: 2.6, fill: C.hi });
  }
  F.dot(b, f(b), { r: 2.6, fill: C.hi });
  const mid = Math.floor(n / 2);
  const mx = a + (b - a) * mid / n, mx1 = a + (b - a) * (mid + 1) / n;
  F.label((mx + mx1) / 2, (f(mx) + f(mx1)) / 2 + (ymax - ymin) * .06, ' √(dx² + dy²)', { size: 11, fill: C.hi });
  return { svg: F.out(), cap: o.cap };
}

/** A plain annotated number line (sign charts, convergence facts). */
export function numline(o) {
  const F = new Frame({ xmin: o.min, xmax: o.max, ymin: -1, ymax: 1, h: 130, pad: { l: 34, r: 34, t: 34, b: 40 } });
  F.add(`<line x1="${F.pad.l}" y1="${F.Y(0)}" x2="${F.w - F.pad.r}" y2="${F.Y(0)}" stroke="${C.axis}" stroke-width="1.5"/>`);
  for (const t of ticks(o.min, o.max, 8)) {
    F.add(`<line x1="${F.X(t)}" y1="${F.Y(0) - 4}" x2="${F.X(t)}" y2="${F.Y(0) + 4}" stroke="${C.axis}"/>`);
    F.add(txt(F.X(t), F.Y(0) + 18, num(t), { anchor: 'middle', size: 10, fill: C.text }));
  }
  (o.spans || []).forEach(s => F.add(`<line x1="${F.X(s.from)}" y1="${F.Y(0)}" x2="${F.X(s.to)}" y2="${F.Y(0)}"
      stroke="${s.color || C.hi}" stroke-width="7" opacity=".3"/>` +
    (s.label ? txt((F.X(s.from) + F.X(s.to)) / 2, F.Y(0) - 14, s.label, { anchor: 'middle', size: 11, fill: s.color || C.hi }) : '')));
  (o.marks || []).forEach(m => F.dot(m.x, 0, { r: 5, color: m.color || C.warn, open: m.open, fill: m.open ? undefined : (m.color || C.warn), label: m.label, lx: 0, ly: -12 }));
  return { svg: F.out(), cap: o.cap };
}

export const V = { plot, area, riemann, revolve, series, interval, polar, param, slopefield, taylor, triangle, improper, compare, arclen, numline };

/** Build a viz from a spec object {kind, ...opts}; tolerant of unknown kinds. */
export function build(spec) {
  if (!spec) return null;
  const fn = V[spec.kind];
  if (!fn) return null;
  try { return fn(spec); } catch (e) { console.warn('viz failed', spec.kind, e); return null; }
}
