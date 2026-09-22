// ---------------------------------------------------------------
// util.js — DOM helpers, TeX rendering, seeded RNG, formatting
// ---------------------------------------------------------------

/** Render inline TeX delimited by $...$ (and display $$...$$) inside a plain string.
 *  Everything outside the delimiters is HTML-escaped. */
export function tex(str) {
  if (str == null) return '';
  const src = String(str);
  let out = '', i = 0;
  while (i < src.length) {
    const d = src.indexOf('$', i);
    if (d === -1) { out += md(src.slice(i)); break; }
    out += md(src.slice(i, d));
    const display = src[d + 1] === '$';
    const open = display ? d + 2 : d + 1;
    const close = src.indexOf(display ? '$$' : '$', open);
    if (close === -1) { out += md(src.slice(d)); break; }
    out += katexOr(src.slice(open, close), display);
    i = close + (display ? 2 : 1);
  }
  return out;
}

/** Render a bare TeX expression (no $ needed). */
export function texOnly(s, display = false) { return katexOr(String(s ?? ''), display); }

function katexOr(expr, display) {
  try {
    return katex.renderToString(expr, {
      displayMode: !!display, throwOnError: false, strict: false,
      trust: true, macros: { '\\d': '\\,\\mathrm{d}' },
    });
  } catch (e) {
    return `<code class="mono">${esc(expr)}</code>`;
  }
}

/** Escape, then honour a tiny markdown subset in non-math text:
 *  **bold**, *italic*, and `code`. Bold runs first so the italic rule
 *  cannot chew through a pair of double asterisks. */
function md(s) {
  return esc(s)
    .replace(/\*\*([^*]+)\*\*/g, '<b>$1</b>')
    .replace(/(^|[\s(])\*([^*\n]+)\*(?=$|[\s.,;:)!?])/g, '$1<i>$2</i>')
    .replace(/`([^`\n]+)`/g, '<code>$1</code>');
}

export function esc(s) {
  return String(s).replace(/[&<>"']/g, c => (
    { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

/** Minimal hyperscript. h('div.cls#id', {attrs}, ...children) */
export function h(sel, attrs, ...kids) {
  const m = /^([a-z0-9]+)?([^\s]*)$/i.exec(sel) || [];
  const el = document.createElement(m[1] || 'div');
  const rest = m[2] || '';
  const id = /#([\w-]+)/.exec(rest); if (id) el.id = id[1];
  const cls = rest.replace(/#[\w-]+/g, '').split('.').filter(Boolean);
  if (cls.length) el.className = cls.join(' ');
  if (attrs && (attrs.nodeType || typeof attrs === 'string' || Array.isArray(attrs))) { kids.unshift(attrs); attrs = null; }
  for (const k in attrs || {}) {
    const v = attrs[k];
    if (v == null || v === false) continue;
    if (k === 'html') el.innerHTML = v;
    else if (k.startsWith('on') && typeof v === 'function') el.addEventListener(k.slice(2).toLowerCase(), v);
    else if (k === 'style' && typeof v === 'object') Object.assign(el.style, v);
    else if (k === 'class') el.className += (el.className ? ' ' : '') + v;
    else el.setAttribute(k, v === true ? '' : v);
  }
  const add = k => {
    if (k == null || k === false) return;
    if (Array.isArray(k)) return k.forEach(add);
    el.appendChild(k.nodeType ? k : document.createTextNode(String(k)));
  };
  kids.forEach(add);
  return el;
}

/** Element whose text contains $tex$ markup. */
export function ht(sel, str, attrs) { return h(sel, { ...(attrs || {}), html: tex(str) }); }

export function clear(el) { while (el.firstChild) el.removeChild(el.firstChild); return el; }

// ---------------- seeded RNG (mulberry32) ----------------
export function rng(seed) {
  let a = (seed >>> 0) || 1;
  const f = () => {
    a |= 0; a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  f.int = (lo, hi) => lo + Math.floor(f() * (hi - lo + 1));          // inclusive
  f.pick = arr => arr[Math.floor(f() * arr.length)];
  f.sign = () => (f() < 0.5 ? -1 : 1);
  f.nz = (lo, hi) => { let v = 0; while (v === 0) v = f.int(lo, hi); return v; };
  f.shuffle = arr => {
    const a2 = arr.slice();
    for (let i = a2.length - 1; i > 0; i--) { const j = Math.floor(f() * (i + 1)); [a2[i], a2[j]] = [a2[j], a2[i]]; }
    return a2;
  };
  f.some = (arr, n) => f.shuffle(arr).slice(0, n);
  return f;
}
export const rand = rng((Math.random() * 1e9) | 0);

// ---------------- number / algebra formatting ----------------
export function gcd(a, b) { a = Math.abs(a); b = Math.abs(b); while (b) { [a, b] = [b, a % b]; } return a || 1; }

/** TeX for a fraction a/b, reduced; returns integer string when it divides. */
export function frac(a, b) {
  if (b === 0) return '\\text{undef}';
  if (b < 0) { a = -a; b = -b; }
  const g = gcd(a, b); a /= g; b /= g;
  if (b === 1) return String(a);
  return (a < 0 ? '-' : '') + `\\frac{${Math.abs(a)}}{${b}}`;
}

/** Coefficient prefix: 1 -> '', -1 -> '-', else the number. */
export function coef(c) { return c === 1 ? '' : c === -1 ? '-' : String(c); }

/** x^n with tidy exponents. */
export function pow(v, n) {
  if (n === 0) return '1';
  if (n === 1) return v;
  return `${v}^{${n}}`;
}

/** Signed term for building sums: +3x, -x^2 ... */
export function sgn(c, body, first = false) {
  if (c === 0) return '';
  const s = c < 0 ? '-' : (first ? '' : '+');
  const mag = Math.abs(c);
  const mid = mag === 1 && body ? '' : String(mag);
  return `${s}${mid}${body}`;
}

/** Signed term whose coefficient is a fraction: +\frac{3}{2}\ln x, -\ln x, … */
export function sfrac(a, b, body, first = false) {
  if (a === 0) return '';
  const neg = (a < 0) !== (b < 0);
  const mag = frac(Math.abs(a), Math.abs(b));
  const sign = neg ? '-' : (first ? '' : '+');
  return `${sign}${mag === '1' && body ? '' : mag}${body}`;
}

/** Build "ax+b" style linear TeX. */
export function lin(a, b, v = 'x') {
  let s = sgn(a, v, true);
  if (b) s += sgn(b, '');
  return s || '0';
}

/** Pick `n` distractors from `pool` that collide neither with the key nor each other.
 *  Generators should hand over MORE candidates than needed — parameter values that
 *  make two formulas coincide are common, and a silently dropped option is a bug. */
export function choose(keyTex, pool, n = 3) {
  const norm = s => String(s).replace(/\s+/g, '');
  const seen = new Set([norm(keyTex)]);
  const out = [];
  for (const c of pool) {
    if (!c) continue;
    const k = norm(c.t);
    if (seen.has(k)) continue;
    seen.add(k);
    out.push(c);
    if (out.length === n) break;
  }
  return out;
}

export function fmt(n, dp = 4) {
  if (!isFinite(n)) return n > 0 ? '∞' : '-∞';
  const r = Math.round(n * 10 ** dp) / 10 ** dp;
  return String(r);
}

export function pct(a, b) { return b ? Math.round((a / b) * 100) : 0; }

export function plural(n, w) { return `${n} ${w}${n === 1 ? '' : 's'}`; }

export function hash(str) {
  let x = 2166136261;
  for (let i = 0; i < str.length; i++) { x ^= str.charCodeAt(i); x = Math.imul(x, 16777619); }
  return x >>> 0;
}

export function toast(msg, ms = 1800) {
  const el = document.getElementById('toast');
  el.textContent = msg; el.classList.add('show');
  clearTimeout(toast._t);
  toast._t = setTimeout(() => el.classList.remove('show'), ms);
}

export function flash(kind) {
  const el = document.getElementById('flash');
  el.className = 'flash ' + kind;
  void el.offsetWidth;
  el.classList.add('go');
}
