// ---------------------------------------------------------------
// mathcheck.js — parse a typed answer and decide whether it is
// mathematically equivalent to the key.
//
// Equivalence is decided NUMERICALLY: both expressions are evaluated
// at many random sample points and compared. That is how WeBWorK and
// MyOpenMath do it, and it is the only approach that accepts every
// algebraically-equivalent form without shipping a CAS —
//     2√x(ln x − 2) + C   ==   2√x ln x − 4√x + C
//     −cos²x/2            ==   sin²x/2        (differ by a constant)
//
// Nothing is eval()'d: input goes through a tokenizer and a real
// recursive-descent parser.
//
// Design rule: when the checker cannot verify something, it says so.
// It never reports "wrong" for its own limitations.
// ---------------------------------------------------------------

// ---------------------------------------------------------------
// 1. LaTeX → plain text
//    The on-screen options are TeX, so students paste/copy TeX shapes.
// ---------------------------------------------------------------
function braceArg(s, i) {
  // s[i] must be '{'; returns [content, indexAfterClosingBrace]
  let depth = 0;
  for (let j = i; j < s.length; j++) {
    if (s[j] === '{') depth++;
    else if (s[j] === '}') {
      depth--;
      if (depth === 0) return [s.slice(i + 1, j), j + 1];
    }
  }
  return [s.slice(i + 1), s.length];
}

/** A TeX argument: {braced}, a \command, or a single character (\frac12). */
function texArg(s, i) {
  while (s[i] === ' ') i++;
  if (s[i] === '{') return braceArg(s, i);
  if (s[i] === '\\') {
    let j = i + 1;
    while (j < s.length && /[a-zA-Z]/.test(s[j])) j++;
    return [s.slice(i, j), j];
  }
  return [s[i] || '', i + 1];
}

function stripLatex(input) {
  let s = String(input);

  // \frac{a}{b}, \dfrac, \tfrac  →  ((a)/(b))
  for (const name of ['dfrac', 'tfrac', 'frac']) {
    let guard = 0;
    while (s.includes('\\' + name) && guard++ < 60) {
      const at = s.indexOf('\\' + name);
      const i = at + name.length + 1;
      const [num, afterNum] = texArg(s, i);
      const [den, afterDen] = texArg(s, afterNum);
      if (!num || !den) { s = s.slice(0, at) + s.slice(afterDen); continue; }
      s = s.slice(0, at) + `((${stripLatex(num)})/(${stripLatex(den)}))` + s.slice(afterDen);
    }
  }

  // \sqrt[n]{x} → (x)^(1/(n)) ;  \sqrt{x} → sqrt(x)
  let guard = 0;
  while (s.includes('\\sqrt') && guard++ < 60) {
    const at = s.indexOf('\\sqrt');
    let i = at + 5;
    let root = null;
    if (s[i] === '[') {
      const close = s.indexOf(']', i);
      root = s.slice(i + 1, close);
      i = close + 1;
    }
    if (s[i] === '{') {
      const [body, after] = braceArg(s, i);
      const b = stripLatex(body);
      s = s.slice(0, at) + (root ? `((${b})^(1/(${stripLatex(root)})))` : `sqrt(${b})`) + s.slice(after);
    } else {
      s = s.slice(0, at) + 'sqrt' + s.slice(at + 5);
    }
  }

  s = s
    // students paste the on-screen TeX, dollar signs and all
    .replace(/\$/g, ' ')
    .replace(/\\operatorname\s*\{([^}]*)\}/g, '$1')
    .replace(/\\(left|right|displaystyle|textstyle|limits|!|,|;|:|\s)/g, ' ')
    .replace(/\\(quad|qquad)/g, ' ')
    .replace(/\\(cdot|times)/g, '*')
    .replace(/\\div/g, '/')
    .replace(/\\infty\b/g, ' inf ')
    // \sin, \ln, \arctan … → bare name.
    // Spaces matter: "\tan\theta" must not collapse into "tantheta".
    .replace(/\\([a-zA-Z]+)/g, ' $1 ')
    // ^{...} and _{...}
    .replace(/\^\s*\{/g, '^(')
    .replace(/_\s*\{[^}]*\}/g, '')
    .replace(/_/g, '');

  // remaining braces behave as grouping parentheses
  s = s.replace(/\{/g, '(').replace(/\}/g, ')');
  return s;
}

// ---------------------------------------------------------------
// 2. Tokenizer
// ---------------------------------------------------------------
const FUNCS = {
  sin: Math.sin, cos: Math.cos, tan: Math.tan,
  sec: x => 1 / Math.cos(x), csc: x => 1 / Math.sin(x), cot: x => 1 / Math.tan(x),
  asin: Math.asin, acos: Math.acos, atan: Math.atan,
  arcsin: Math.asin, arccos: Math.acos, arctan: Math.atan,
  arcsec: x => Math.acos(1 / x), arccsc: x => Math.asin(1 / x), arccot: x => Math.atan(1 / x),
  sinh: Math.sinh, cosh: Math.cosh, tanh: Math.tanh,
  sech: x => 1 / Math.cosh(x), csch: x => 1 / Math.sinh(x), coth: x => 1 / Math.tanh(x),
  arcsinh: Math.asinh, arccosh: Math.acosh, arctanh: Math.atanh,
  asinh: Math.asinh, acosh: Math.acosh, atanh: Math.atanh,
  ln: Math.log, log: Math.log, lg: Math.log10, exp: Math.exp,
  sqrt: Math.sqrt, cbrt: Math.cbrt, abs: Math.abs,
};
// trig functions whose ^{-1} means the inverse, not the reciprocal
const INVERSE_OF = {
  sin: 'asin', cos: 'acos', tan: 'atan', sec: 'arcsec', csc: 'arccsc', cot: 'arccot',
  sinh: 'asinh', cosh: 'acosh', tanh: 'atanh',
};
const CONSTS = { pi: Math.PI, e: Math.E, inf: Infinity };
const GREEK = ['theta', 'phi', 'alpha', 'beta', 'gamma', 'delta', 'epsilon', 'zeta',
  'eta', 'kappa', 'lambda', 'mu', 'nu', 'rho', 'sigma', 'tau', 'omega', 'psi', 'chi', 'xi'];
// longest-first so `arcsin` wins over `a`, `sinh` over `sin`
const NAMES = [...new Set([...Object.keys(FUNCS), ...Object.keys(CONSTS), ...GREEK])]
  .sort((a, b) => b.length - a.length);

function tokenize(src) {
  const t = [];
  let i = 0;
  const s = src.replace(/\s+/g, ' ');
  while (i < s.length) {
    const c = s[i];
    if (c === ' ') { i++; continue; }
    if (/[0-9.]/.test(c)) {
      let j = i;
      while (j < s.length && /[0-9.]/.test(s[j])) j++;
      const num = parseFloat(s.slice(i, j));
      if (!isFinite(num)) throw new ParseError(`"${s.slice(i, j)}" is not a number`);
      t.push({ k: 'num', v: num });
      i = j;
      continue;
    }
    if (/[a-zA-Z]/.test(c)) {
      const rest = s.slice(i);
      const name = NAMES.find(n => rest.toLowerCase().startsWith(n) && !/[a-zA-Z]/.test(rest[n.length] || ''));
      if (name) {
        if (FUNCS[name]) t.push({ k: 'func', v: name });
        else if (CONSTS[name] !== undefined) t.push({ k: 'const', v: name });
        else t.push({ k: 'var', v: name });
        i += name.length;
        continue;
      }
      // a bare letter is a variable (C is the constant of integration)
      t.push({ k: 'var', v: c });
      i++;
      continue;
    }
    if ('+-*/^(),|!'.includes(c)) { t.push({ k: c }); i++; continue; }
    if (c === '[') { t.push({ k: '(' }); i++; continue; }
    if (c === ']') { t.push({ k: ')' }); i++; continue; }
    if (c === '·' || c === '×') { t.push({ k: '*' }); i++; continue; }
    if (c === '−' || c === '–' || c === '—') { t.push({ k: '-' }); i++; continue; }
    throw new ParseError(`I do not understand the character "${c}"`);
  }
  return t;
}

export class ParseError extends Error {}

/** "hello there friend" tokenizes as h*e*l*l*o*…, which parses fine but is not
 *  an answer. Three or more single-letter variables in a row means words. */
function looksLikeWords(text) {
  let toks;
  try { toks = tokenize(stripLatex(text).replace(/=/g, ' ')); } catch (e) { return true; }
  let run = 0;
  for (const t of toks) {
    if (t.k === 'var' && String(t.v).length === 1) {
      if (++run >= 3) return true;
    } else run = 0;
  }
  return false;
}

// ---------------------------------------------------------------
// 3. Parser  →  AST
//    expr := term (('+'|'-') term)*
//    term := unary (('*'|'/') unary | implicit-multiply unary)*
//    unary:= ('-'|'+') unary | power
//    power:= atom ('^' unary)?            (right associative)
// ---------------------------------------------------------------
function parse(tokens) {
  let p = 0;
  const peek = () => tokens[p];
  const eat = k => { if (tokens[p] && tokens[p].k === k) { p++; return true; } return false; };
  const expect = k => { if (!eat(k)) throw new ParseError(`expected "${k}"`); };

  function expr() {
    let left = term();
    for (;;) {
      if (eat('+')) left = { op: '+', a: left, b: term() };
      else if (eat('-')) left = { op: '-', a: left, b: term() };
      else return left;
    }
  }

  // can a token begin a new factor? (drives implicit multiplication)
  function startsFactor(tk) {
    if (!tk) return false;
    // inside |...| a bar is the closing delimiter, never the start of another
    // factor — otherwise |x| reads as |  x|…  and never terminates
    if (tk.k === '|') return absDepth === 0;
    return tk.k === 'num' || tk.k === 'var' || tk.k === 'const' || tk.k === 'func' || tk.k === '(';
  }

  let absDepth = 0;

  function term() {
    let left = unary();
    for (;;) {
      if (eat('*')) { left = { op: '*', a: left, b: unary() }; continue; }
      if (eat('/')) { left = { op: '/', a: left, b: unary() }; continue; }
      // implicit multiplication: 2x, 3sin(x), x(x+1), (a)(b)
      if (startsFactor(peek())) { left = { op: '*', a: left, b: unary() }; continue; }
      return left;
    }
  }

  function unary() {
    if (eat('-')) return { op: 'neg', a: unary() };
    if (eat('+')) return unary();
    return power();
  }

  // A function written without brackets takes the whole juxtaposed factor
  // that follows it, the way it reads on paper: "sin 2x" is sin(2x), not
  // sin(2)*x. It stops at the next function name, so "sin x cos x" is still
  // a product of two functions rather than sin(x*cos(x)).
  function bareArg() {
    let node = power();
    for (;;) {
      const tk = peek();
      if (!tk || (tk.k !== 'num' && tk.k !== 'var' && tk.k !== 'const')) return node;
      node = { op: '*', a: node, b: power() };
    }
  }

  function power() {
    let base = atom();
    while (eat('!')) base = { op: 'fact', a: base };     // n!, (2n+1)!
    if (eat('^')) return { op: '^', a: base, b: unary() };
    return base;
  }

  function atom() {
    const tk = peek();
    if (!tk) throw new ParseError('the expression ends too early');

    if (tk.k === 'num') { p++; return { op: 'num', v: tk.v }; }
    if (tk.k === 'const') { p++; return { op: 'const', v: tk.v }; }
    if (tk.k === 'var') { p++; return { op: 'var', v: tk.v }; }

    if (tk.k === 'func') {
      p++;
      let name = tk.v;
      let outerPow = null;
      if (eat('^')) {
        const ex = unary();
        // sin^{-1} x  is arcsin x ;  sin^2 x  is (sin x)^2
        if (ex.op === 'neg' && ex.a.op === 'num' && ex.a.v === 1 && INVERSE_OF[name]) name = INVERSE_OF[name];
        else outerPow = ex;
      }
      // argument: parenthesised, or the next factor (sin x, ln 2x)
      let arg;
      if (eat('(')) { arg = expr(); expect(')'); }
      else arg = bareArg();
      let node = { op: 'call', f: name, a: arg };
      if (outerPow) node = { op: '^', a: node, b: outerPow };
      return node;
    }

    if (eat('(')) { const e = expr(); expect(')'); return e; }
    if (eat('|')) {
      absDepth++;
      const e = expr();
      absDepth--;
      expect('|');
      return { op: 'call', f: 'abs', a: e };
    }

    throw new ParseError(`unexpected "${tk.v ?? tk.k}"`);
  }

  const out = expr();
  if (p < tokens.length) throw new ParseError(`unexpected "${tokens[p].v ?? tokens[p].k}" at the end`);
  return out;
}

// ---------------------------------------------------------------
// 4. Evaluate
// ---------------------------------------------------------------
function evaluate(node, env) {
  switch (node.op) {
    case 'num': return node.v;
    case 'const': return CONSTS[node.v];
    case 'var': return env[node.v] !== undefined ? env[node.v] : NaN;
    case 'fact': {
      const v = evaluate(node.a, env);
      if (!isFinite(v) || v < 0 || Math.abs(v - Math.round(v)) > 1e-9) return NaN;
      let out = 1;
      for (let i = 2; i <= Math.round(v); i++) { out *= i; if (!isFinite(out)) return Infinity; }
      return out;
    }
    case 'neg': return -evaluate(node.a, env);
    case '+': return evaluate(node.a, env) + evaluate(node.b, env);
    case '-': return evaluate(node.a, env) - evaluate(node.b, env);
    case '*': return evaluate(node.a, env) * evaluate(node.b, env);
    case '/': return evaluate(node.a, env) / evaluate(node.b, env);
    case '^': return Math.pow(evaluate(node.a, env), evaluate(node.b, env));
    case 'eq': return NaN;
    case 'call': {
      const f = FUNCS[node.f];
      if (!f) return NaN;
      return f(evaluate(node.a, env));
    }
    default: return NaN;
  }
}

function varsOf(node, set = new Set()) {
  if (!node || typeof node !== 'object') return set;
  if (node.op === 'var') set.add(node.v);
  varsOf(node.a, set); varsOf(node.b, set);
  return set;
}

/** Parse a string into an AST, or throw ParseError.
 *  A single '=' produces an {op:'eq'} node — answers like "x = 3\tan\theta"
 *  are legitimate responses to "which substitution?". */
export function parseExpression(text) {
  const cleaned = stripLatex(text)
    .replace(/\s*\+\s*C\b/gi, ' + C')       // keep +C as a variable named C
    .trim();
  if (!cleaned) throw new ParseError('nothing to read');
  const parts = cleaned.split('=').filter(x => x.trim());
  if (parts.length === 2) {
    return { op: 'eq', a: parse(tokenize(parts[0])), b: parse(tokenize(parts[1])) };
  }
  if (parts.length > 2) throw new ParseError('too many "=" signs');
  return parse(tokenize(cleaned));
}

// ---------------------------------------------------------------
// 5. Equivalence
// ---------------------------------------------------------------
const SAMPLE_POINTS = 40;
const MIN_VALID = 8;
const TOL = 1e-6;

// Sampling domains, tried in order. The first keeps ln/sqrt defined for the
// usual shapes; the second exists for answers like sqrt(x^2 - 25), which are
// undefined everywhere in the first.
const DOMAINS = [
  [0.31, 0.57, 0.83, 1.19, 1.44, 1.77, 2.06, 2.38, 2.71, 3.13, 0.12, 0.46, 1.61],
  [6.4, 7.1, 8.3, 9.7, 11.2, 13.6, 15.1, 17.8, 21.3, 25.6, 29.4, 34.2, 41.5],
];

function sampleValue(rand, i, domain) {
  const pool = DOMAINS[domain] || DOMAINS[0];
  const base = pool[i % pool.length];
  return base * (1 + (rand() - 0.5) * 0.08);
}

/**
 * Compare two expressions numerically.
 * @returns {{equivalent:boolean, reason:string, constantOff?:boolean, samples:number}}
 */
export function compareExpressions(userAst, keyAst, opts = {}) {
  if (opts.allowConstant === undefined) {
    // infer: a constant of integration is present on either side
    opts = { ...opts, allowConstant: varsOf(userAst).has('C') || varsOf(keyAst).has('C') };
  }
  // equations: compare (lhs - rhs) up to a nonzero constant multiple, so
  // "x = 3tan(t)" and "x/3 = tan(t)" both count
  const uEq = userAst.op === 'eq', kEq = keyAst.op === 'eq';
  if (uEq !== kEq) return { equivalent: false, reason: 'different', samples: 0 };
  if (uEq && kEq) {
    return compareUpToScale(
      { op: '-', a: userAst.a, b: userAst.b },
      { op: '-', a: keyAst.a, b: keyAst.b },
    );
  }

  const uv = varsOf(userAst);
  const kv = varsOf(keyAst);
  // "+C" is an arbitrary constant on both sides — never a real variable
  uv.delete('C'); kv.delete('C');
  const vars = [...new Set([...uv, ...kv])];

  let diffs = [];
  for (let domain = 0; domain < DOMAINS.length; domain++) {
    let seed = 20260830;
    const rand = () => {
      seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
      return seed / 4294967296;
    };
    const got = [];
    for (let i = 0; i < SAMPLE_POINTS; i++) {
      const env = { C: 0 };
      vars.forEach((v, k) => { env[v] = sampleValue(rand, i + k * 3, domain); });
      let a, b;
      try { a = evaluate(userAst, env); b = evaluate(keyAst, env); } catch (e) { continue; }
      if (!isFinite(a) || !isFinite(b)) continue;
      if (Math.abs(a) > 1e12 || Math.abs(b) > 1e12) continue;
      got.push({ a, b, d: a - b });
    }
    if (got.length >= MIN_VALID) { diffs = got; break; }
    if (got.length > diffs.length) diffs = got;
  }
  const valid = diffs.length;
  if (valid < MIN_VALID) {
    return { equivalent: false, reason: 'undecidable', samples: valid };
  }

  // Tolerance must be relative to EACH sample. A single global max would make
  // the tolerance absurdly loose whenever values span orders of magnitude —
  // that is how sinh(5x) once compared equal to cosh(5x).
  const close = (a, b) => Math.abs(a - b) <= TOL * (1 + Math.max(Math.abs(a), Math.abs(b)));

  const exact = diffs.every(x => close(x.a, x.b));
  if (exact) return { equivalent: true, reason: 'exact', samples: valid };

  // Differ by a constant? Legitimate ONLY for an indefinite integral, i.e.
  // when a "+C" is actually in play. Without this guard every pair of
  // constants would compare equal — 3/5 would "match" 1.
  if (opts.allowConstant === true) {
    const mean = diffs.reduce((s, x) => s + x.d, 0) / diffs.length;
    const spread = Math.max(...diffs.map(x => Math.abs(x.d - mean)));
    const dScale = Math.max(...diffs.map(x => Math.abs(x.d)));
    // scale by the size of the DIFFERENCES, not of the values
    if (spread <= TOL * (1 + dScale)) {
      return { equivalent: true, reason: 'constant', constantOff: Math.abs(mean) > 1e-9, samples: valid };
    }
  }

  return { equivalent: false, reason: 'different', samples: valid };
}

/** Are two expressions equal up to a nonzero constant factor? */
function compareUpToScale(userAst, keyAst) {
  const vars = [...new Set([...varsOf(userAst), ...varsOf(keyAst)])].filter(v => v !== 'C');
  let seed = 987654321;
  const rand = () => { seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0; return seed / 4294967296; };
  let pts = [];
  for (let domain = 0; domain < DOMAINS.length; domain++) {
    const got = [];
    for (let i = 0; i < SAMPLE_POINTS; i++) {
      const env = { C: 0 };
      vars.forEach((v, k) => { env[v] = sampleValue(rand, i + k * 3, domain); });
      let a, b;
      try { a = evaluate(userAst, env); b = evaluate(keyAst, env); } catch (e) { continue; }
      if (!isFinite(a) || !isFinite(b) || Math.abs(a) > 1e12 || Math.abs(b) > 1e12) continue;
      got.push({ a, b });
    }
    if (got.length >= MIN_VALID) { pts = got; break; }
    if (got.length > pts.length) pts = got;
  }
  if (pts.length < MIN_VALID) return { equivalent: false, reason: 'undecidable', samples: pts.length };
  const tiny = v => Math.abs(v) <= TOL * 10;
  // both sides identically zero: two true identities
  if (pts.every(x => tiny(x.a)) && pts.every(x => tiny(x.b))) {
    return { equivalent: true, reason: 'exact', samples: pts.length };
  }
  if (pts.every(x => tiny(x.b)) !== pts.every(x => tiny(x.a))) {
    return { equivalent: false, reason: 'different', samples: pts.length };
  }
  const anchor = pts.reduce((m, x) => (Math.abs(x.b) > Math.abs(m.b) ? x : m), pts[0]);
  if (Math.abs(anchor.b) < 1e-9) return { equivalent: false, reason: 'different', samples: pts.length };
  const r = anchor.a / anchor.b;
  if (!isFinite(r) || Math.abs(r) < 1e-9) return { equivalent: false, reason: 'different', samples: pts.length };
  const ok = pts.every(x => Math.abs(x.a - r * x.b) <= TOL * (1 + Math.abs(x.a)));
  return { equivalent: ok, reason: ok ? 'exact' : 'different', samples: pts.length };
}

// ---------------------------------------------------------------
// 6. Prose answers
// ---------------------------------------------------------------
function normalizeText(s) {
  return String(s)
    .replace(/\$[^$]*\$/g, m => m)      // keep math, normalised below
    .toLowerCase()
    .replace(/\\[a-z]+/g, ' ')
    .replace(/[${}\\,.;:!()\[\]]/g, ' ')
    .replace(/\b(the|a|an|is|it|to|of|by|with|and)\b/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/** Pull the math part out of things like "Converges to $\frac97$" or "$3$ J". */
function mathPart(s) {
  const str = String(s);
  const m = str.match(/\$([^$]+)\$/g);
  if (m && m.length) return m.map(x => x.slice(1, -1)).join(' ');
  return str;
}

function looksMathematical(s) {
  const t = String(s).trim();
  if (!t) return false;
  // Strip the parts that are unambiguously math, then look at what English
  // is left over. Any real word means this is a written answer, not a formula.
  const prose = t
    .replace(/\$[^$]*\$/g, ' ')          // $...$ segments
    .replace(/\\[a-zA-Z]+/g, ' ')        // \sin, \frac, \theta …
    .replace(/\\left|\\right/g, ' ');
  const known = new Set([...Object.keys(FUNCS), ...Object.keys(CONSTS), ...GREEK]);
  const words = prose.split(/[^a-zA-Z]+/)
    .filter(w => w.length >= 3 && !known.has(w.toLowerCase()));
  if (words.length) return false;

  // inequalities are not equations — comparing them numerically would call
  // "x < 2" equivalent to "x > 2". Leave those to the text comparison.
  if (/[<>]|\\leq|\\geq|≤|≥/.test(t)) return false;
  // infinities cannot be sampled
  if (/\\infty|∞/.test(t)) return false;

  // Must agree with what checkTyped will actually accept, or we would show a
  // free-entry box for a question it cannot grade.
  if (looksLikeWords(mathPart(t))) return false;
  try {
    parseExpression(mathPart(t));
    return true;
  } catch (e) { return false; }
}

// ---------------------------------------------------------------
// 7. The public entry point used by the drill
// ---------------------------------------------------------------

/** Can this question accept a typed mathematical answer? */
export function isCheckable(choices) {
  const key = choices.find(c => c.ok);
  return !!key && looksMathematical(key.t);
}

/**
 * Grade a typed answer against the whole choice list.
 * @returns {{status, index, note}} where status is one of
 *   'correct' | 'matched-distractor' | 'wrong' | 'unparsed' | 'undecidable'
 */
export function checkTyped(text, choices) {
  const raw = String(text || '').trim();
  if (!raw) return { status: 'unparsed', index: -1, note: 'Type an answer first.' };

  const keyIdx = choices.findIndex(c => c.ok);
  const key = choices[keyIdx];
  const mathMode = looksMathematical(key.t);

  // ---- prose / mixed answers: normalised text comparison
  if (!mathMode) {
    const nUser = normalizeText(raw);
    if (!nUser) return { status: 'unparsed', index: -1, note: 'Type an answer first.' };
    for (let i = 0; i < choices.length; i++) {
      const nOpt = normalizeText(choices[i].t);
      if (nOpt && (nOpt === nUser || nOpt.includes(nUser) || nUser.includes(nOpt))) {
        return i === keyIdx
          ? { status: 'correct', index: keyIdx, note: '' }
          : { status: 'matched-distractor', index: i, note: '' };
      }
    }
    return {
      status: 'unparsed', index: -1,
      note: 'This one is a written answer — type it in words, or pick an option above.',
    };
  }

  // ---- mathematical answers: numeric equivalence
  if (looksLikeWords(raw)) {
    return {
      status: 'unparsed', index: -1,
      note: 'That reads as words rather than an expression. Try something like `2sqrt(x)*ln(x) - 4sqrt(x) + C`.',
    };
  }

  let userAst;
  try {
    userAst = parseExpression(raw);
  } catch (e) {
    return {
      status: 'unparsed', index: -1,
      note: `I could not read that — ${e.message}. Try plain text like \`2sqrt(x)*ln(x) - 4sqrt(x) + C\`.`,
    };
  }

  let keyAst;
  try { keyAst = parseExpression(mathPart(key.t)); } catch (e) {
    return { status: 'undecidable', index: -1, note: 'This answer cannot be checked automatically — please pick an option above.' };
  }

  let res = compareExpressions(userAst, keyAst);

  // "4.5 J" parses as 4.5*J. If the key is a pure number, a trailing unit
  // token is a unit, not a variable — retry without it.
  if (!res.equivalent && varsOf(keyAst).size === 0 && varsOf(userAst).size > 0) {
    const stripped = raw.replace(/[\s*]*[a-zA-Z]+\.?\s*$/, '').trim();
    if (stripped && stripped !== raw) {
      try {
        const retry = parseExpression(stripped);
        if (varsOf(retry).size === 0) {
          const r2 = compareExpressions(retry, keyAst);
          if (r2.equivalent) res = r2;
        }
      } catch (e) { /* keep the original verdict */ }
    }
  }
  if (res.equivalent) {
    let note = '';
    if (res.reason === 'constant') {
      note = 'Equivalent — your form differs from mine by a constant, which is fine for an indefinite integral.';
    } else if (!/\bC\b/.test(raw) && /\bC\b/.test(key.t)) {
      note = 'Correct — but do not forget the $+C$ on an indefinite integral.';
    }
    return { status: 'correct', index: keyIdx, note };
  }
  if (res.reason === 'undecidable') {
    return {
      status: 'undecidable', index: -1,
      note: 'I could not evaluate that at enough points to be sure. Pick an option above so you are not marked down for my limitation.',
    };
  }

  // did they land on one of the wrong options? then show its diagnosis
  for (let i = 0; i < choices.length; i++) {
    if (i === keyIdx) continue;
    try {
      const dAst = parseExpression(mathPart(choices[i].t));
      if (compareExpressions(userAst, dAst).equivalent) {
        return { status: 'matched-distractor', index: i, note: '' };
      }
    } catch (e) { /* option is not parseable — skip */ }
  }

  return { status: 'wrong', index: -1, note: '' };
}

// ---------------------------------------------------------------
// 8. AST → TeX, so the input box can show you what it understood
// ---------------------------------------------------------------
const GREEK_TEX = new Set(GREEK);
const TEX_FUNC = {
  ln: '\\ln', log: '\\log', exp: '\\exp',
  sin: '\\sin', cos: '\\cos', tan: '\\tan',
  sec: '\\sec', csc: '\\csc', cot: '\\cot',
  sinh: '\\sinh', cosh: '\\cosh', tanh: '\\tanh',
  sech: '\\operatorname{sech}', csch: '\\operatorname{csch}', coth: '\\coth',
  asin: '\\sin^{-1}', acos: '\\cos^{-1}', atan: '\\tan^{-1}',
  arcsin: '\\sin^{-1}', arccos: '\\cos^{-1}', arctan: '\\tan^{-1}',
  arcsec: '\\sec^{-1}', arccsc: '\\csc^{-1}', arccot: '\\cot^{-1}',
  asinh: '\\sinh^{-1}', acosh: '\\cosh^{-1}', atanh: '\\tanh^{-1}',
  arcsinh: '\\sinh^{-1}', arccosh: '\\cosh^{-1}', arctanh: '\\tanh^{-1}',
};
const PREC = { eq: 0, '+': 1, '-': 1, '*': 2, '/': 2, neg: 2, '^': 4, fact: 5, atom: 5 };
const precOf = n => PREC[n.op] !== undefined ? PREC[n.op] : PREC.atom;

function wrap(child, min) {
  const tex = astToTeX(child);
  return precOf(child) < min ? `\\left(${tex}\\right)` : tex;
}

/** Render an AST as TeX. Used for the live "reads as" preview. */
export function astToTeX(n) {
  if (!n) return '';
  switch (n.op) {
    case 'num': {
      const v = n.v;
      return Number.isInteger(v) ? String(v) : String(Math.round(v * 1e10) / 1e10);
    }
    case 'const': return n.v === 'pi' ? '\\pi' : n.v === 'inf' ? '\\infty' : n.v;
    case 'var': return GREEK_TEX.has(n.v) ? '\\' + n.v : n.v;
    case 'fact': return wrap(n.a, PREC.fact) + '!';
    case 'neg': return '-' + wrap(n.a, PREC.neg);
    case '+': return `${astToTeX(n.a)}+${wrap(n.b, PREC['+'])}`;
    case '-': return `${astToTeX(n.a)}-${wrap(n.b, PREC['*'])}`;
    case '*': {
      const a = wrap(n.a, PREC['*']);
      const b = wrap(n.b, PREC['*']);
      // a dot is only needed between two things that would otherwise merge
      const needDot = /[0-9]$/.test(a) && /^[0-9]/.test(b);
      return needDot ? `${a}\\cdot ${b}` : `${a}\\,${b}`;
    }
    case '/': return `\\frac{${astToTeX(n.a)}}{${astToTeX(n.b)}}`;
    case '^': {
      const base = wrap(n.a, PREC.atom);
      return `${base}^{${astToTeX(n.b)}}`;
    }
    case 'eq': return `${astToTeX(n.a)} = ${astToTeX(n.b)}`;
    case 'call': {
      const inner = astToTeX(n.a);
      if (n.f === 'sqrt') return `\\sqrt{${inner}}`;
      if (n.f === 'cbrt') return `\\sqrt[3]{${inner}}`;
      if (n.f === 'abs') return `\\left|${inner}\\right|`;
      const name = TEX_FUNC[n.f] || `\\operatorname{${n.f}}`;
      return `${name}\\!\\left(${inner}\\right)`;
    }
    default: return '';
  }
}

/**
 * Live feedback for the input box: is this readable yet, and what does it say?
 * @returns {{ok:boolean, tex:string, error:string, unbalanced:number}}
 */
export function previewInput(text) {
  const raw = String(text || '');
  const trimmed = raw.trim();
  if (!trimmed) return { ok: false, tex: '', error: '', unbalanced: 0 };

  // count bracket balance on the raw text — the most common typing mistake
  let depth = 0;
  for (const ch of stripLatex(raw)) {
    if (ch === '(') depth++;
    else if (ch === ')') depth--;
    if (depth < 0) return { ok: false, tex: '', error: 'one too many closing brackets', unbalanced: depth };
  }

  try {
    const ast = parseExpression(trimmed);
    return { ok: true, tex: astToTeX(ast), error: '', unbalanced: depth };
  } catch (e) {
    if (depth > 0) {
      return { ok: false, tex: '', error: `${depth} bracket${depth > 1 ? 's' : ''} still open`, unbalanced: depth };
    }
    return { ok: false, tex: '', error: e.message, unbalanced: 0 };
  }
}

// exposed for the test suite
export const __internals = { stripLatex, parseExpression, compareExpressions, looksMathematical, normalizeText, evaluate, varsOf, FUNCS };
