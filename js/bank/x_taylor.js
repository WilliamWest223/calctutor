// bank/x_taylor.js — exam-variety pack (run mix). Owner: see .hnic/context/mix-contract.md
// Power series / Taylor / error / applications / claims. Generators vary STRUCTURE
// (function family, template, asked quantity, format), not just constants.
// Every generated item carries a hidden `chk` object so keys can be re-derived with sympy.
import { frac, choose } from '../util.js';
const P = [];
const G = [];
const R = String.raw;

const SER = 'Power Series & Radius', TM = 'Taylor & Maclaurin Series', TP = 'Taylor Polynomials & Error', AP = 'Applications of Series';
const CL = 'Power & Taylor Claims';

// ---------------- exact rationals: [num, den] ----------------
const gcd = (a, b) => { a = Math.abs(a); b = Math.abs(b); while (b) [a, b] = [b, a % b]; return a || 1; };
const Q = (n, d = 1) => { if (d < 0) { n = -n; d = -d; } const g = gcd(n, d); return [n / g, d / g]; };
const qadd = (a, b) => Q(a[0] * b[1] + b[0] * a[1], a[1] * b[1]);
const qmul = (a, b) => Q(a[0] * b[0], a[1] * b[1]);
const qinv = a => Q(a[1], a[0]);
const qneg = a => Q(-a[0], a[1]);
const qpow = (a, n) => { let o = Q(1); const b = n >= 0 ? a : qinv(a); for (let i = 0; i < Math.abs(n); i++) o = qmul(o, b); return o; };
const qt = q => frac(q[0], q[1]);
const qs = q => `${q[0]}/${q[1]}`;
const fact = n => { let o = 1; for (let i = 2; i <= n; i++) o *= i; return o; };

/** MC/free choices from a rational key and [[Q|texString, why, err]] distractors. */
function qch(k, items) {
  const T = q => (typeof q === 'string' ? q : `$${qt(q)}$`);
  const kt = T(k);
  const safe = q => typeof q === 'string' || (Math.abs(q[0]) < 1e9 && q[1] < 1e9); // shortcut: drop distractors from huge factorials, no BigInt
  const pool = items.filter(it => it && safe(it[0])).map(([q, why, err]) => ({ t: T(q), why, err }));
  const slip = 'Off by a whole unit -- redo each step with exact fractions and compare with the worked solution.';
  pool.push({ t: T(qadd(k, Q(1))), why: slip, err: 'algebra-slip' });
  pool.push({ t: T(qmul(k, Q(2))), why: 'A stray factor of $2$ crept in -- recheck the factorial or coefficient you divided by.', err: 'algebra-slip' });
  pool.push({ t: T(qadd(k, Q(-1))), why: slip, err: 'algebra-slip' });
  pool.push({ t: T(qadd(k, Q(2))), why: slip, err: 'algebra-slip' });
  return [{ t: kt, ok: true }, ...choose(kt, pool)];
}
const tch = (kt, pool) => [{ t: kt, ok: true }, ...choose(kt, pool)];
const fmtOf = (r, share = 0.5) => (r() < share ? 'free' : 'mc');

// ---------------- term text:  q * X^e  ----------------
function tt(q, e, first = false, X = 'x') {
  const [n, d] = q; if (n === 0) return '';
  const neg = n < 0, an = Math.abs(n);
  const xp = e === 0 ? '' : e === 1 ? X : `${X}^{${e}}`;
  let body;
  if (e === 0) body = d === 1 ? `${an}` : `\\frac{${an}}{${d}}`;
  else if (d === 1) body = (an === 1 ? '' : an) + xp;
  else body = `\\frac{${an === 1 ? '' : an}${xp}}{${d}}`;
  return (neg ? '-' : first ? '' : '+') + body;
}
const poly = (terms, X = 'x') => terms.map(([q, e], i) => tt(q, e, i === 0, X)).join('');
const xc = c => (c === 0 ? 'x' : `(x${c < 0 ? '+' : '-'}${Math.abs(c)})`);

// ---------------- known series library ----------------
const FN = {
  exp: { ex: () => true, c: e => Q(1, fact(e)) },
  sin: { ex: e => e % 2 === 1, c: e => Q(((e - 1) / 2) % 2 ? -1 : 1, fact(e)) },
  cos: { ex: e => e % 2 === 0, c: e => Q((e / 2) % 2 ? -1 : 1, fact(e)) },
  geo: { ex: () => true, c: () => Q(1) },
  ln: { ex: e => e >= 1, c: e => Q(e % 2 ? 1 : -1, e) },
  atan: { ex: e => e % 2 === 1, c: e => Q(((e - 1) / 2) % 2 ? -1 : 1, e) },
};
const KNOWN = {
  exp: R`e^{u}=\sum_{n=0}^{\infty}\frac{u^{n}}{n!}`,
  sin: R`\sin u=\sum_{n=0}^{\infty}(-1)^{n}\frac{u^{2n+1}}{(2n+1)!}`,
  cos: R`\cos u=\sum_{n=0}^{\infty}(-1)^{n}\frac{u^{2n}}{(2n)!}`,
  geo: R`\frac{1}{1-u}=\sum_{n=0}^{\infty}u^{n}`,
  ln: R`\ln(1+u)=\sum_{n=1}^{\infty}(-1)^{n+1}\frac{u^{n}}{n}`,
  atan: R`\arctan u=\sum_{n=0}^{\infty}(-1)^{n}\frac{u^{2n+1}}{2n+1}`,
};
const xpw = j => (j === 1 ? 'x' : `x^{${j}}`);
const mpre = m => (m === 0 ? '' : m === 1 ? 'x' : `x^{${m}}`);
function fnTex(nm, k, j, m = 0) {
  const ak = Math.abs(k) === 1 ? '' : Math.abs(k);
  const a = `${k < 0 ? '-' : ''}${ak}${xpw(j)}`;
  if (nm === 'geo') return `\\dfrac{${m === 0 ? '1' : mpre(m)}}{1${k > 0 ? '-' : '+'}${ak}${xpw(j)}}`;
  const body = nm === 'exp' ? `e^{${a}}`
    : nm === 'ln' ? `\\ln\\left(1${k > 0 ? '+' : '-'}${ak}${xpw(j)}\\right)`
      : `\\${nm === 'atan' ? 'arctan' : nm}\\left(${a}\\right)`;
  return mpre(m) + body;
}
/** the first n valid inner exponents e (ascending) for a family */
const evals = (nm, n = 6) => { const o = []; for (let e = 0; o.length < n && e < 40; e++) if (FN[nm].ex(e)) o.push(e); return o; };
/** coefficient of x^(m+j e) in x^m * fn(k x^j) */
const fcoef = (nm, k, j, e) => qmul(FN[nm].c(e), qpow(Q(k), e));
function pickFn(r, opts = {}) {
  const nm = r.pick(opts.names || ['exp', 'sin', 'cos', 'geo', 'ln', 'atan']);
  const k = r.pick([-3, -2, -1, 1, 2, 3]);
  const j = (nm === 'geo' || nm === 'ln') ? r.pick([1, 1, 2]) : r.pick([1, 2, 2, 3]);
  const m = opts.m0 ? 0 : r.pick([0, 1, 1, 2]);
  return { nm, k, j, m };
}
const symF = f => {
  const u = `(${f.k})*x**${f.j}`, pre = `x**${f.m}*`;
  return f.nm === 'geo' ? `x**${f.m}/(1-${u})` : f.nm === 'ln' ? `${pre}log(1+${u})` : f.nm === 'atan' ? `${pre}atan(${u})` : `${pre}${f.nm}(${u})`;
};
const CHK_F = f => ({ nm: f.nm, kc: f.k, j: f.j, m: f.m, sym: symF(f) });
const fTexOf = f => fnTex(f.nm, f.k, f.j, f.m);

// ---------------- power-series family:  sum s^n (x-c)^n / (n^p b^n)  or  a^n (x-c)^n / n^p ----------------
const pTex = p => (p === 0 ? '' : p === 0.5 ? R`\sqrt{n}` : p === 1 ? 'n' : `n^{${p}}`);
function ioSpec(r, o = {}) {
  const mode = o.mode || r.pick(['den', 'den', 'num']);
  return {
    mode, b: mode === 'den' ? r.int(2, 6) : r.int(2, 4),
    p: o.p ?? r.pick([0, 1, 1, 2, 0.5]),
    s: o.s ?? r.pick([1, -1]),
    c: o.c ?? r.pick([0, 0, r.nz(1, 6), r.nz(-6, -1)]),
  };
}
const radOf = sp => (sp.mode === 'den' ? Q(sp.b) : Q(1, sp.b));
const n0Of = sp => (sp.p === 0 ? 0 : 1);
function termTex(sp, p = sp.p, sumOnly = false) {
  const alt = sp.s < 0 ? '(-1)^{n}' : '';
  const pw = sp.c === 0 ? 'x^{n}' : `(x${sp.c < 0 ? '+' : '-'}${Math.abs(sp.c)})^{n}`;
  const num = sp.mode === 'num' ? `${alt}${sp.b}^{n}${pw}` : `${alt}${pw}`;
  const den = sp.mode === 'den' ? `${pTex(p) ? pTex(p) + '\\,' : ''}${sp.b}^{n}` : pTex(p);
  const body = den ? `\\frac{${num}}{${den}}` : num;
  return sumOnly ? body : `\\sum_{n=${n0Of(sp)}}^{\\infty}${body}`;
}
/** behaviour at an endpoint: side=+1 right (x=c+R), -1 left. sg = sign^n carried by terms */
function endp(sp, side, p = sp.p) {
  const sg = side * sp.s;
  const pt = pTex(p);
  if (p <= 0) return { conv: false, why: sg === 1 ? R`the terms are all $1$, so they do not tend to $0$` : R`the terms $(-1)^{n}$ do not tend to $0$`, ser: sg === 1 ? '\\sum 1' : '\\sum(-1)^{n}', test: 'Divergence Test' };
  if (sg === 1) {
    const conv = p > 1;
    return { conv, abs: conv, ser: `\\sum\\frac{1}{${pt}}`, test: 'p-series', why: R`$p=${p === 0.5 ? '\\frac12' : p}${conv ? '>' : '\\le'}1$, so the $p$-series ${conv ? 'converges' : 'diverges'}` };
  }
  const abs = p > 1;
  return { conv: true, abs, ser: `\\sum\\frac{(-1)^{n}}{${pt}}`, test: 'Alternating Series Test', why: abs ? R`it is absolutely convergent ($p=${p}>1$)` : R`$\frac{1}{${pt}}$ decreases to $0$, so the Alternating Series Test gives (conditional) convergence` };
}
function ends(sp) {
  const Rd = radOf(sp), c = Q(sp.c);
  const Lq = qadd(c, qneg(Rd)), Rq = qadd(c, Rd);
  return { Lq, Rq, eL: endp(sp, -1), eR: endp(sp, +1) };
}
const ivl = (Lq, Rq, li, ri) => `$${li ? '[' : '('}${qt(Lq)},\\ ${qt(Rq)}${ri ? ']' : ')'}$`;
const ivlKey = sp => { const e = ends(sp); return ivl(e.Lq, e.Rq, e.eL.conv, e.eR.conv); };
const ivChk = sp => { const e = ends(sp); return { sp, L: qs(e.Lq), Rt: qs(e.Rq), li: e.eL.conv, ri: e.eR.conv, R: qs(radOf(sp)) }; };
const absX = c => (c === 0 ? '|x|' : `|x${c < 0 ? '+' : '-'}${Math.abs(c)}|`);
const ratioStep = sp => (sp.mode === 'den'
  ? `$\\left|\\dfrac{t_{n+1}}{t_n}\\right|\\to\\dfrac{${absX(sp.c)}}{${sp.b}}$`
  : `$\\left|\\dfrac{t_{n+1}}{t_n}\\right|\\to ${sp.b}${absX(sp.c)}$`);
const radStep = sp => (sp.mode === 'den'
  ? `$\\dfrac{${absX(sp.c)}}{${sp.b}}<1\\iff ${absX(sp.c)}<${sp.b}$, so $R=${sp.b}$.`
  : `$${sp.b}${absX(sp.c)}<1\\iff ${absX(sp.c)}<\\frac{1}{${sp.b}}$, so $R=\\frac{1}{${sp.b}}$.`);
const endStep = (sp, side) => {
  const E = qadd(Q(sp.c), side > 0 ? radOf(sp) : qneg(radOf(sp))), e = endp(sp, side);
  return `At $x=${qt(E)}$ the series becomes $${e.ser}$: ${e.why}. ${e.conv ? 'Include' : 'Exclude'} this endpoint.`;
};

// =====================================================================
// POWER SERIES & RADIUS
// =====================================================================

/** the three wrong bracket patterns + a radius slip, each with a diagnosis */
function iocPool(sp, r) {
  const pRadius = true;
  const e = ends(sp), Rd = radOf(sp), c = Q(sp.c);
  const pool = [];
  if (pRadius) {
    const bad = sp.mode === 'den' ? Q(1, sp.b) : Q(sp.b);
    pool.push({ t: ivl(qadd(c, qneg(bad)), qadd(c, bad), e.eL.conv, e.eR.conv), err: 'formula-confusion',
      why: sp.mode === 'den' ? `The Ratio Test limit is $\\frac{|x-c|}{${sp.b}}$, which is $<1$ when $|x-c|<${sp.b}$ -- so $R=${sp.b}$, not $\\frac1{${sp.b}}$. You inverted the ratio.`
        : `The limit is $${sp.b}|x-c|$, which is $<1$ when $|x-c|<\\frac1{${sp.b}}$. The radius is $\\frac1{${sp.b}}$, not $${sp.b}$.` });
  }
  const sides = [['L', e.Lq, e.eL], ['R', e.Rq, e.eR]];
  for (const [li, ri] of [[true, true], [false, false], [true, false], [false, true]]) {
    if (li === e.eL.conv && ri === e.eR.conv) continue;
    const why = [];
    if (li !== e.eL.conv) why.push(endWhy(sides[0], li));
    if (ri !== e.eR.conv) why.push(endWhy(sides[1], ri));
    pool.push({ t: ivl(e.Lq, e.Rq, li, ri), why: why.join(' '), err: 'endpoints' });
  }
  return r.shuffle(pool);
}
function endWhy([, q, e], included) {
  return included
    ? `At $x=${qt(q)}$ the series is $${e.ser}$, which diverges (${e.why}), so $${qt(q)}$ must be left out.`
    : `At $x=${qt(q)}$ the series is $${e.ser}$, which converges (${e.why}), so $${qt(q)}$ belongs in the interval.`;
}
const iocSteps = sp => {
  const e = ends(sp);
  return [`Ratio Test: ${ratioStep(sp)}`, radStep(sp), endStep(sp, -1), endStep(sp, +1),
    `Interval of convergence: ${ivl(e.Lq, e.Rq, e.eL.conv, e.eR.conv)}.`];
};
const IOC_RECALL = 'The Ratio Test only gives the OPEN interval. Each endpoint is its own numeric series: substitute, then name the test (Divergence, $p$-series, Alternating).';

// ---- G1: interval of convergence with endpoint checks (MC) ----
G.push({
  id: 'gx-ioc-endpoints', unit: 'series', topic: SER, diff: 4,
  src: 'modeled on Taylor Series handout (ln(1+x) endpoint remark) + Stewart 11.8 packet style; exam wording: "Find the interval of convergence. Be sure to check endpoints."',
  make(r) {
    const sp = ioSpec(r), key = ivlKey(sp);
    return {
      fmt: 'mc', arch: 'ioc-endpoints', chk: { k: 'ioc', ...ivChk(sp) },
      prompt: `Find the **interval of convergence** of $${termTex(sp)}$. Be sure to check the endpoints.`,
      choices: tch(key, iocPool(sp, r)),
      keyWhy: `Radius ${qt(radOf(sp))} from the Ratio Test; the two endpoints are tested separately and behave ${ends(sp).eL.conv === ends(sp).eR.conv ? 'the same way' : 'differently'}.`,
      hints: ['Ratio Test first: it gives the radius and the open interval.', 'Substitute each endpoint into the series and decide each resulting numeric series on its own.'],
      steps: iocSteps(sp), recall: IOC_RECALL,
    };
  },
});

// ---- G2: radius of convergence by ratio test, many coefficient families ----
const RFAM = [
  r => { const b = r.int(2, 7), m = r.int(1, 3);
    return { tex: x => `\\sum_{n=1}^{\\infty}\\frac{n^{${m}}\\,${x}^{n}}{${b}^{n}}`, key: String(b), val: String(b), py: `n**${m}*z**n/${b}**n`,
      steps: [`$\\left|\\frac{t_{n+1}}{t_n}\\right|=\\left(\\frac{n+1}{n}\\right)^{${m}}\\frac{|${'x'}-c|}{${b}}\\to\\frac{|x-c|}{${b}}$.`, `$<1$ exactly when $|x-c|<${b}$, so $R=${b}$.`],
      wrong: [[`\\frac{1}{${b}}`, 'The ratio limit is $|x-c|/b$, so $R=b$. You reported the limit coefficient $1/b$ instead of solving $|x-c|/b<1$.', 'formula-confusion'], ['1', 'The polynomial factor $n^m$ has ratio $\\to1$ and does not change the radius; the $b^n$ does.', 'conceptual'], [`${b * b}`, 'Only one power of $b$ appears per step in the ratio.', 'algebra-slip']] }; },
  r => { const b = r.int(2, 6), m = r.int(0, 2);
    return { tex: x => `\\sum_{n=1}^{\\infty}\\frac{${b}^{n}\\,${x}^{n}}{n^{${m + 1}}}`, key: `\\frac{1}{${b}}`, val: `1/${b}`, py: `${b}**n*z**n/n**${m + 1}`,
      steps: [`$\\left|\\frac{t_{n+1}}{t_n}\\right|\\to ${b}|x-c|$.`, `$${b}|x-c|<1\\iff|x-c|<\\frac1{${b}}$, so $R=\\frac1{${b}}$.`],
      wrong: [[`${b}`, `The limit is $${b}|x-c|$; you must DIVIDE: $|x-c|<1/${b}$.`, 'formula-confusion'], ['1', 'The $n^p$ factor tends to $1$ in the ratio; the $b^n$ sets the radius.', 'conceptual'], [`\\frac{1}{${b * b}}`, 'One power of $b$ per step, not two.', 'algebra-slip']] }; },
  r => { const b = r.pick([2, 3, 5, 6, 7]);
    return { tex: x => `\\sum_{n=0}^{\\infty}\\frac{${x}^{2n}}{${b}^{n}}`, key: `\\sqrt{${b}}`, val: `sqrt(${b})`, py: `z**(2*n)/${b}**n`,
      steps: [`Ratio: $\\left|\\frac{t_{n+1}}{t_n}\\right|=\\frac{|x-c|^{2}}{${b}}$.`, `$<1\\iff|x-c|^{2}<${b}\\iff|x-c|<\\sqrt{${b}}$.`],
      wrong: [[`${b}`, 'The exponent is $2n$, so the ratio is $|x-c|^{2}/b$. Take a square root: $R=\\sqrt{b}$, not $b$.', 'chain-rule'], [`\\frac{1}{\\sqrt{${b}}}`, 'You inverted: $|x-c|^2<b$ gives $R=\\sqrt b$.', 'formula-confusion'], [`\\frac{${b}}{2}`, 'The exponent $2$ becomes a square ROOT, not a division.', 'algebra-slip']] }; },
  () => ({ tex: x => `\\sum_{n=1}^{\\infty}\\frac{(n!)^{2}}{(2n)!}\\,${x}^{n}`, key: '4', val: '4', py: 'factorial(n)**2/factorial(2*n)*z**n',
    steps: ['$\\left|\\frac{t_{n+1}}{t_n}\\right|=\\frac{(n+1)^2}{(2n+2)(2n+1)}|x-c|\\to\\frac14|x-c|$.', '$\\frac14|x-c|<1\\iff|x-c|<4$, so $R=4$.'],
    wrong: [['\\frac14', 'The ratio limit is $\\frac14|x-c|$; the radius solves $\\frac14|x-c|<1$, i.e. $R=4$. Do not report the ratio limit itself.', 'formula-confusion'], ['\\infty', 'A factorial in the numerator does not force $R=\\infty$ here: $(2n)!$ in the denominator grows as fast as $4^n(n!)^2$.', 'conceptual'], ['2', '$(2n+2)(2n+1)\\approx4n^2$ and $(n+1)^2\\approx n^2$, giving $\\frac14$, not $\\frac12$.', 'algebra-slip']] }),
  () => ({ tex: x => `\\sum_{n=1}^{\\infty}\\frac{(2n)!}{(n!)^{2}}\\,${x}^{n}`, key: '\\frac{1}{4}', val: '1/4', py: 'factorial(2*n)/factorial(n)**2*z**n',
    steps: ['$\\left|\\frac{t_{n+1}}{t_n}\\right|=\\frac{(2n+2)(2n+1)}{(n+1)^2}|x-c|\\to4|x-c|$.', '$4|x-c|<1\\iff|x-c|<\\frac14$, so $R=\\frac14$.'],
    wrong: [['4', 'The ratio limit is $4|x-c|$; solve $4|x-c|<1$ to get $\\frac14$ -- do not just report the $4$.', 'formula-confusion'], ['0', 'The coefficients grow like $4^n$ (geometric), not like $n!$, so $R>0$.', 'conceptual'], ['\\frac12', '$\\frac{(2n+2)(2n+1)}{(n+1)^2}\\to4$, not $2$.', 'algebra-slip']] }),
  () => ({ tex: x => `\\sum_{n=1}^{\\infty}\\frac{n!}{n^{n}}\\,${x}^{n}`, key: 'e', val: 'E', py: 'factorial(n)/n**n*z**n',
    steps: ['$\\left|\\frac{t_{n+1}}{t_n}\\right|=\\frac{(n+1)!\\,n^n}{(n+1)^{n+1}\\,n!}|x-c|=\\left(\\frac{n}{n+1}\\right)^{n}|x-c|\\to\\frac{|x-c|}{e}$.', '$\\frac{|x-c|}{e}<1\\iff|x-c|<e$, so $R=e$.'],
    wrong: [['\\frac{1}{e}', 'The ratio limit is $|x-c|/e$, so the radius is $e$. $1/e$ is the limit of $(n/(n+1))^n$.', 'formula-confusion'], ['1', '$(n/(n+1))^n\\to1/e$, not $1$ -- the exponent $n$ matters.', 'conceptual'], ['0', 'The $n^n$ in the denominator beats $n!$ by a factor $\\approx e^n$, so $R>0$.', 'conceptual']] }),
];
G.push({
  id: 'gx-radius-ratio', unit: 'series', topic: SER, diff: 3,
  src: 'Stewart 11.8 packet style (radius via Ratio Test); exam wording "Find the radius of convergence."',
  make(r) {
    const f = r.pick(RFAM)(r), c = r.pick([0, 0, r.nz(1, 5), r.nz(-5, -1)]);
    const X = xc(c);
    const k = `$${f.key}$`;
    return {
      fmt: fmtOf(r, 0.6), arch: 'radius-ratio', chk: { k: 'rad', py: f.py, val: f.val },
      prompt: `Use the Ratio Test to find the **radius of convergence** of $${f.tex(X)}$.`,
      choices: tch(k, f.wrong.map(([t, why, err]) => ({ t: `$${t}$`, why, err })).concat([{ t: '$\\infty$', why: 'The ratio limit is a finite nonzero multiple of $|x-c|$, so the radius is finite.', err: 'conceptual' }, { t: '$0$', why: 'Radius $0$ needs coefficients growing factorially; the ratio here gives a finite nonzero multiple of $|x-c|$.', err: 'conceptual' }])),
      hints: ['Form $\\left|\\frac{t_{n+1}}{t_n}\\right|$, simplify, take $n\\to\\infty$.', 'Set the limit $<1$ and solve for $|x-c|$.'],
      steps: [...f.steps.map(s => s.replace(/\|x-c\|/g, absX(c))), `The centre $${c}$ only shifts the interval; it does not change $R$.`],
      recall: 'Ratio Test: limit $L|x-c|$ gives $R=1/L$. Factorial ratios: reduce $(n+1)!/n!=n+1$ first.',
    };
  },
});

// ---- G3: centre and radius from an interval (reverse direction) ----
G.push({
  id: 'gx-center-from-interval', unit: 'series', topic: SER, diff: 2,
  src: 'Exam 3 style: "a power series converges exactly on [a,b) -- find centre and radius"; check-in family (Fall 2025/Spring 2025/Spring 2026)',
  make(r) {
    const a = r.int(-9, 4), w = r.int(2, 9), b = a + w + (r() < 0.5 ? 0 : 1);
    const li = r() < 0.5, ri = r() < 0.5;
    const c = Q(a + b, 2), Rd = Q(b - a, 2);
    const I = `${li ? '[' : '('}${a},${b}${ri ? ']' : ')'}`;
    const ask = r.pick(['center', 'radius', 'both']);
    const chk = { k: 'cr', a, b };
    if (ask !== 'both') {
      const key = ask === 'center' ? c : Rd;
      return {
        fmt: 'free', arch: 'center-radius-interval', chk: { ...chk, ask, val: qs(key) },
        prompt: `A power series $\\sum a_n(x-c)^n$ has interval of convergence $${I}$. Find its **${ask}** ${ask === 'center' ? '$c$' : '$R$'}.`,
        choices: qch(key, ask === 'center'
          ? [[Q(a), 'The left endpoint is not the centre. The interval is symmetric about $c$, so $c$ is the midpoint.', 'conceptual'], [Rd, 'That is half the width -- the radius. The centre is the midpoint $\\frac{a+b}{2}$.', 'formula-confusion'], [Q(b - a), 'That is the full width, not a position.', 'conceptual']]
          : [[Q(b - a), 'That is the full length of the interval, i.e. the diameter. Radius is half of it.', 'dropped-factor'], [c, 'That is the midpoint (the centre), not the radius.', 'formula-confusion'], [Q(b), 'An endpoint is a position, not a radius.', 'conceptual']]),
        hints: ['The interval of convergence is symmetric about the centre (endpoints may or may not be included).'],
        steps: [`Centre = midpoint $=\\frac{${a}+${b}}{2}=${qt(c)}$.`, `Radius = half-width $=\\frac{${b}-${a}}{2}=${qt(Rd)}$.`, 'Endpoint inclusion never moves $c$ or $R$.'],
        recall: 'Centre = midpoint, radius = half-width. Endpoints are a separate question.',
      };
    }
    const T = (cc, rr) => `$c=${qt(cc)},\\ R=${qt(rr)}$`;
    return {
      fmt: 'mc', arch: 'center-radius-interval', chk: { ...chk, ask, val: `${qs(c)} ${qs(Rd)}` },
      prompt: `A power series $\\sum a_n(x-c)^n$ converges exactly on $${I}$. Find the centre $c$ and the radius $R$.`,
      choices: tch(T(c, Rd), [
        { t: T(Q(a), Q(b - a)), why: 'You took the left endpoint as the centre and the full length as the radius. The centre is the midpoint and the radius is half the length.', err: 'conceptual' },
        { t: T(Rd, c), why: 'Centre and radius swapped: the centre is the midpoint, the radius is half the width.', err: 'formula-confusion' },
        { t: T(c, Q(b - a)), why: 'Right centre, but $R$ is half of the length $b-a$, not all of it.', err: 'dropped-factor' },
        { t: T(Q(b), Rd), why: 'The centre is the midpoint of the interval, not its right endpoint.', err: 'conceptual' },
      ]),
      hints: ['Symmetry about the centre.'], steps: [`$c=\\frac{${a}+${b}}{2}=${qt(c)}$`, `$R=\\frac{${b}-${a}}{2}=${qt(Rd)}$`], recall: 'Centre = midpoint, radius = half-width.',
    };
  },
});

// ---- G4: IOC after differentiating / integrating term by term ----
G.push({
  id: 'gx-ioc-termwise', unit: 'series', topic: SER, diff: 5,
  src: 'Exam 3 style: term-by-term differentiation/integration -- same radius, endpoints may change (Taylor Series handout, power-series lectures 10-22/10-29)',
  make(r) {
    const op = r.pick(['d', 'i']);
    const sp = ioSpec(r, { mode: 'den', p: op === 'd' ? r.pick([1, 2]) : r.pick([0, 1, 2]) });
    const e0 = ends(sp);
    const p2 = op === 'd' ? sp.p - 1 : sp.p + 1;
    const eL = endp(sp, -1, p2), eR = endp(sp, +1, p2);
    const key = ivl(e0.Lq, e0.Rq, eL.conv, eR.conv);
    const Fn = op === 'd' ? "f'(x)" : R`F(x)=\int_{${sp.c}}^{x}f(t)\,dt`;
    const pool = [];
    pool.push({ t: ivl(e0.Lq, e0.Rq, e0.eL.conv, e0.eR.conv), why: `That is the interval of the ORIGINAL series. Term-by-term ${op === 'd' ? 'differentiation' : 'integration'} keeps $R$ but can change which endpoints converge: the endpoint series now behaves like a $p$-series with $p=${p2}$.`, err: 'conceptual' });
    for (const [li, ri] of [[true, true], [false, false], [true, false], [false, true]]) {
      if (li === eL.conv && ri === eR.conv) continue;
      if (li === e0.eL.conv && ri === e0.eR.conv) continue;
      const bad = [];
      if (li !== eL.conv) bad.push(endWhy(['', e0.Lq, eL], li));
      if (ri !== eR.conv) bad.push(endWhy(['', e0.Rq, eR], ri));
      pool.push({ t: ivl(e0.Lq, e0.Rq, li, ri), why: bad.join(' '), err: 'endpoints' });
    }
    return {
      fmt: 'mc', arch: 'ioc-termwise', chk: { k: 'iocT', sp, op, L: qs(e0.Lq), Rt: qs(e0.Rq), li: eL.conv, ri: eR.conv },
      prompt: `The power series $f(x)=${termTex(sp)}$ has interval of convergence ${ivlKey(sp)}. Find the interval of convergence of ${op === 'd' ? "$f'(x)$ (differentiate term by term)" : `$${Fn}$ (integrate term by term)`}.`,
      choices: tch(key, r.shuffle(pool)),
      keyWhy: 'Term-by-term differentiation or integration keeps the radius but re-tests the endpoints: the new endpoint series has a different power of $n$.',
      hints: ['The radius does not change. Only endpoints can.', op === 'd' ? 'Differentiating lowers the power of $n$ in the denominator by one.' : 'Integrating raises the power of $n$ in the denominator by one.'],
      steps: [`Radius is unchanged: $R=${sp.b}$, open interval $(${qt(e0.Lq)},${qt(e0.Rq)})$.`,
        `${op === 'd' ? 'Differentiating' : 'Integrating'} turns the coefficient $\\frac{1}{${pTex(sp.p) || '1'}\\,${sp.b}^n}$ into one with $n^{${p2}}$ in the denominator (up to a constant).`,
        `Right endpoint $x=${qt(e0.Rq)}$: ${eR.conv ? 'converges' : 'diverges'} (${eR.why}).`, `Left endpoint $x=${qt(e0.Lq)}$: ${eL.conv ? 'converges' : 'diverges'} (${eL.why}).`, `New interval: ${key}.`],
      recall: 'Differentiate/integrate term by term: same $R$, endpoints re-tested. Differentiation can LOSE an endpoint; integration can GAIN one.',
    };
  },
});

// ---- G5: multi-select claims about one explicit series ----
G.push({
  id: 'gx-ioc-multi', unit: 'series', topic: SER, diff: 4,
  src: 'Exam 3 style "select all true statements" about a power series (radius, endpoints, absolute vs conditional)',
  make(r) {
    const sp = ioSpec(r), e = ends(sp), Rd = radOf(sp);
    const xL = `$x=${qt(e.Lq)}$`, xR = `$x=${qt(e.Rq)}$`;
    const wrongR = sp.mode === 'den' ? Q(1, sp.b) : Q(sp.b);
    const bothConv = e.eL.conv && e.eR.conv;
    const rFalse = bothConv || r() < 0.5;
    const side = r.pick([-1, +1]), es = side < 0 ? e.eL : e.eR, xs = side < 0 ? xL : xR;
    const flip = !es.conv || r() < 0.5;
    const word = es.conv ? ((es.abs) !== flip ? 'absolutely' : 'conditionally') : 'conditionally';
    const six = { t: `The series converges ${word} at ${xs}.`, ok: !flip,
      why: es.conv ? (es.abs ? 'It converges ABSOLUTELY there ($\\sum|t_n|$ is a convergent $p$-series).' : 'It converges, but $\\sum|t_n|$ is a divergent $p$-series, so the convergence is conditional, not absolute.') : 'The series diverges at that endpoint, so it converges neither absolutely nor conditionally.' };
    const C = [
      { t: `The series converges at its centre, $x=${sp.c}$.`, ok: true, why: 'Every power series converges at its centre (all terms but the first vanish).' },
      { t: `The series diverges for every $x$ with $|x${sp.c === 0 ? '' : (sp.c < 0 ? '+' : '-') + Math.abs(sp.c)}|>${qt(Rd)}$.`, ok: true, why: 'Outside the radius the Ratio Test limit exceeds $1$, so the terms do not tend to $0$.' },
      rFalse ? { t: `The radius of convergence is $R=${qt(wrongR)}$.`, ok: false, why: `The Ratio Test gives $R=${qt(Rd)}$; $${qt(wrongR)}$ is the reciprocal.` }
        : { t: `The radius of convergence is $R=${qt(Rd)}$.`, ok: true, why: `Ratio Test: ${sp.mode === 'den' ? '$|x-c|/' + sp.b + '<1$' : '$' + sp.b + '|x-c|<1$'}.` },
      { t: `The series converges at ${xR}.`, ok: e.eR.conv, why: `At ${xR} the series is $${e.eR.ser}$: ${e.eR.why}.` },
      { t: `The series converges at ${xL}.`, ok: e.eL.conv, why: `At ${xL} the series is $${e.eL.ser}$: ${e.eL.why}.` },
      six,
    ];
    const items = r.shuffle(C.slice(2)).slice(0, 3).concat(C.slice(0, 2));
    return {
      fmt: 'multi', arch: 'ioc-multi', chk: { k: 'iocM', ...ivChk(sp), claims: items.map(c => [c.t, c.ok]) },
      prompt: `Consider $${termTex(sp)}$. Select **all** true statements.`,
      choices: items.map(c => ({ t: c.t, ok: c.ok, why: c.why })),
      keyWhy: 'Radius from the Ratio Test; every endpoint is its own series; absolute vs conditional is decided by $\\sum|t_n|$.',
      hints: ['Find $R$ first, then test each endpoint.', 'Conditional convergence: the series converges but the series of absolute values does not.'],
      steps: iocSteps(sp), recall: IOC_RECALL,
    };
  },
});

// ---- G6: find the error in a student's interval-of-convergence work ----
G.push({
  id: 'gx-ioc-error', unit: 'series', topic: SER, diff: 4,
  src: 'Exam 3 style "find the error" -- realistic IOC slips: inverted ratio, wrong p-series verdict, skipped endpoint check',
  make(r) {
    const kind = r.pick(['invert', 'p1conv', 'p2div', 'noend', 'none', 'noend']);
    const p = kind === 'p1conv' ? 1 : kind === 'p2div' ? 2 : r.pick([1, 2]);
    const sp = ioSpec(r, { mode: 'den', s: 1, p });
    const b = sp.b, c = sp.c, e = ends(sp), cx = absX(c);
    const S = termTex(sp);
    const lines = [];
    let bad;                       // 1-based line holding the error (0 = none)
    const Lq = qt(e.Lq), Rq = qt(e.Rq);
    const lim = kind === 'invert' ? `${b}${cx}` : `\\dfrac{${cx}}{${b}}`;
    lines.push(`$\\left|\\dfrac{t_{n+1}}{t_n}\\right|\\to ${lim}$`);
    if (kind === 'invert') { lines.push(`$${b}${cx}<1\\Rightarrow ${cx}<\\frac{1}{${b}}$, so $R=\\frac1{${b}}$`); bad = 1; }
    else { lines.push(`$\\dfrac{${cx}}{${b}}<1\\Rightarrow ${cx}<${b}$, so $R=${b}$ and the series converges on $(${Lq},${Rq})$`); bad = 0; }
    let left = `At $x=${Lq}$ the series is $\\sum\\frac{(-1)^{n}}{${pTex(p)}}$, which converges by the Alternating Series Test`;
    let right = `At $x=${Rq}$ the series is $\\sum\\frac{1}{${pTex(p)}}$, ${p === 1 ? 'a $p$-series with $p=1$, which diverges' : 'a $p$-series with $p=2>1$, which converges'}`;
    let fin = `Interval of convergence: ${ivl(e.Lq, e.Rq, true, p === 2)}`;
    if (kind === 'invert') {
      const ie = Q(c, 1), ir = Q(1, b);
      lines.push(`At $x=${qt(qadd(ie, qneg(ir)))}$ and $x=${qt(qadd(ie, ir))}$ the series are $\\sum\\frac{(\\pm1)^{n}}{${pTex(p)}}$; the left converges (AST) and the right ${p === 1 ? 'diverges' : 'converges'}`);
      lines.push(`Interval of convergence: ${ivl(qadd(ie, qneg(ir)), qadd(ie, ir), true, p === 2)}`);
    } else if (kind === 'p1conv') {
      lines.push(left); lines.push(`At $x=${Rq}$ the series is $\\sum\\frac1n$, a $p$-series with $p=1$, which converges`); lines.push(`Interval of convergence: ${ivl(e.Lq, e.Rq, true, true)}`); bad = 4;
    } else if (kind === 'p2div') {
      lines.push(left); lines.push(`At $x=${Rq}$ the series is $\\sum\\frac1{n^2}$, a $p$-series with $p=2>1$, which diverges`); lines.push(`Interval of convergence: ${ivl(e.Lq, e.Rq, true, false)}`); bad = 4;
    } else if (kind === 'noend') {
      lines.push(`Interval of convergence: ${ivl(e.Lq, e.Rq, false, false)}`); bad = 3;
    } else {
      lines.push(left); lines.push(right); lines.push(fin); bad = 0;
    }
    const nL = lines.length;
    const wl = {
      invert: { 1: `The ratio is $\\frac{|x-c|}{${b}}$ (the $${b}^{n}$ is in the DENOMINATOR), not $${b}|x-c|$. This inverts the radius.` },
      p1conv: { 4: `$\\sum\\frac1n$ is the harmonic series: $p=1\\le1$, so it DIVERGES. The right endpoint is excluded.` },
      p2div: { 4: `$\\sum\\frac1{n^2}$ has $p=2>1$, so it CONVERGES. The right endpoint is included.` },
      noend: { 3: 'The Ratio Test is inconclusive at $|x-c|=R$. The endpoints must each be substituted and tested before writing the interval.' },
    }[kind] || {};
    const choices = [];
    for (let i = 1; i <= nL; i++) {
      choices.push(i === bad ? { t: `Line ${i}`, ok: true, why: wl[i] }
        : { t: `Line ${i}`, why: (kind === 'none' ? 'This line is correct.' : (kind === 'invert' && i > 1 ? 'Consistent with its (wrong) first line, but the real slip is upstream in line 1.' : (i === 1 ? 'The ratio limit is correct.' : i === nL ? 'The conclusion follows from the lines above it.' : 'This step is correct.'))) });
    }
    choices.push(bad === 0 ? { t: 'No error', ok: true, why: 'Every line is correct: $R=' + b + '$, left endpoint included (AST), right endpoint ' + (p === 2 ? 'included ($p=2$)' : 'excluded ($p=1$)') + '.' }
      : { t: 'No error', why: 'There is a mistake: ' + (wl[bad]) });
    return {
      fmt: 'error', arch: 'ioc-error', chk: { k: 'iocE', ...ivChk(sp), kind },
      prompt: `A student finds the interval of convergence of $${S}$. Find the line with the first error, or choose "No error".`,
      work: lines, choices,
      keyWhy: bad ? wl[bad] : 'The work is correct.',
      hints: ['Redo the Ratio Test, then each endpoint, and compare line by line.'],
      steps: iocSteps(sp), recall: IOC_RECALL,
    };
  },
});

// ---- G22: centre and radius after factoring the coefficient of x ----
G.push({
  id: 'gx-center-rewrite', unit: 'series', topic: SER, diff: 3,
  src: 'Exam 3 style: "find the center and radius" for a series written in (ax - m)^n form',
  make(r) {
    const a = r.pick([2, 3, 4, 5]), d = r.pick([2, 3, 5, 6, 7]), m = r.nz(-9, 9), p = r.pick([0, 1, 2]);
    const cq = Q(-m, a), rq = Q(d, a);               // (a x + m)^n
    const inner = `${a}x${m < 0 ? '-' : '+'}${Math.abs(m)}`;
    const S = `\\sum_{n=${p === 0 ? 0 : 1}}^{\\infty}\\frac{(${inner})^{n}}{${pTex(p) ? pTex(p) + '\\,' : ''}${d}^{n}}`;
    const T = (cc, rr) => `$c=${qt(cc)},\\ R=${qt(rr)}$`;
    return {
      fmt: 'mc', arch: 'center-radius-rewrite', chk: { k: 'cr2', a, d, m, p },
      prompt: `Find the **center** and **radius of convergence** of $${S}$.`,
      choices: tch(T(cq, rq), [
        { t: T(Q(m), Q(d)), why: `You read $c$ and $R$ straight off $(${inner})^n/${d}^n$. The power must look like $(x-c)^n$ -- factor $${a}$ out first.`, err: 'setup' },
        { t: T(Q(m, a), rq), why: 'Sign slip on the centre: $a x+m=a\\,(x-(-m/a))$, so $c=-m/a$.', err: 'sign' },
        { t: T(cq, Q(d)), why: `After factoring, the ratio limit is $\\frac{${a}|x-c|}{${d}}$, so $R=\\frac{${d}}{${a}}$. You forgot to divide by the $${a}$.`, err: 'dropped-factor' },
        { t: T(Q(-m), rq), why: `The centre is $-m/a$, not $-m$: factor $${a}$ out of $${inner}$.`, err: 'dropped-factor' },
        { t: T(cq, Q(d * a)), why: `Multiplied instead of divided: $\\frac{${a}|x-c|}{${d}}<1\\iff|x-c|<\\frac{${d}}{${a}}$.`, err: 'formula-confusion' },
      ]),
      hints: ['Write $ax+m$ as $a(x-c)$.', `Then the ratio limit is $\\frac{${a}|x-c|}{${d}}$.`],
      steps: [`$${inner}=${a}\\left(x${cq[0] < 0 ? '+' : '-'}${qt(Q(Math.abs(cq[0]), cq[1]))}\\right)$, so $c=${qt(cq)}$.`, `$\\left|\\frac{t_{n+1}}{t_n}\\right|\\to\\frac{${a}|x-c|}{${d}}$.`, `$\\frac{${a}|x-c|}{${d}}<1\\iff|x-c|<\\frac{${d}}{${a}}$, so $R=${qt(rq)}$.`],
      recall: 'Always factor the coefficient of $x$ out of the base so the power is $(x-c)^n$; it divides the radius.',
    };
  },
});

// ---- G29: true/false -- what does the series do at an endpoint? ----
G.push({
  id: 'gx-tf-endpoint', unit: 'series', topic: SER, diff: 3,
  src: 'Exam 3 style T/F with justification: behaviour at an endpoint (absolute vs conditional vs divergent)',
  make(r) {
    const sp = ioSpec(r), e = ends(sp), side = r.pick([-1, 1]), es = side < 0 ? e.eL : e.eR, E = side < 0 ? e.Lq : e.Rq;
    const claim = r.pick(['conv', 'abs', 'div']);
    const truth = claim === 'conv' ? es.conv : claim === 'abs' ? (es.conv && es.abs) : !es.conv;
    const word = claim === 'conv' ? 'converges' : claim === 'abs' ? 'converges absolutely' : 'diverges';
    const J = `At $x=${qt(E)}$ the series is $${es.ser}$: ${es.why}. ${es.conv ? (es.abs ? 'It converges absolutely.' : 'It converges conditionally (not absolutely).') : 'It diverges.'}`;
    return {
      fmt: 'mc', tf: true, arch: 'tf-endpoint', chk: { k: 'tfE', ...ivChk(sp), side, claim, truth },
      prompt: `**True or false?** The series $${termTex(sp)}$ ${word} at $x=${qt(E)}$. Justify.`,
      choices: [{ t: 'True', ok: truth, why: truth ? undefined : J }, { t: 'False', ok: !truth, why: truth ? J : undefined }],
      keyWhy: J,
      hints: ['Substitute the endpoint to get a numeric series.', 'Name the test: Divergence, $p$-series or Alternating Series.'],
      steps: [`Radius $R=${qt(radOf(sp))}$, so $x=${qt(E)}$ is an endpoint.`, J],
      recall: 'Endpoints: substitute, then decide the numeric series. Absolute convergence needs $\\sum|t_n|$ to converge.',
    };
  },
});

// ---- G31: solve for x so that a geometric power series has a given sum ----
G.push({
  id: 'gx-geo-solve', unit: 'series', topic: SER, diff: 3,
  src: 'Exam 3 style: geometric power series -- find x giving a prescribed sum (needs |ratio|<1 check)',
  make(r) {
    const b = r.int(2, 5), c = r.int(-4, 4), s = r.pick([[2, 1], [3, 1], [4, 1], [5, 1], [3, 2], [2, 3], [3, 4]]);
    const sq = Q(s[0], s[1]), ratio = qadd(Q(1), qneg(qinv(sq))), x = qadd(Q(c), qmul(Q(b), ratio));
    const base = c === 0 ? 'x' : `x${c < 0 ? '+' : '-'}${Math.abs(c)}`;
    const wrongRatio = qinv(sq);
    return {
      fmt: 'free', arch: 'geometric-solve-x', chk: { k: 'geo', b, c, s: qs(sq), val: qs(x) },
      prompt: `For what value of $x$ does $\\displaystyle\\sum_{n=0}^{\\infty}\\left(\\frac{${base}}{${b}}\\right)^{n}=${qt(sq)}$?`,
      choices: qch(x, [
        [qadd(Q(c), qmul(Q(b), wrongRatio)), `You set the ratio equal to $\\frac1S$; the sum is $\\frac{1}{1-r}=S$, so $r=1-\\frac1S=${qt(ratio)}$.`, 'setup'],
        [qmul(Q(b), ratio), 'That is $r\\cdot b$ -- the shift by $c=' + c + '$ is missing. Solve $\\frac{x' + (c < 0 ? '+' : '-') + Math.abs(c) + '}{' + b + '}=r$.', 'dropped-factor'],
        [qadd(Q(c), qmul(Q(b), qadd(Q(1), qneg(sq)))), 'You solved $r=1-S$ instead of $\\frac{1}{1-r}=S\\Rightarrow r=1-\\frac1S$.', 'algebra-slip'],
      ]),
      hints: ['Geometric sum: $\\sum r^n=\\frac{1}{1-r}$ when $|r|<1$.', 'Solve $\\frac{1}{1-r}=S$ for $r$, then solve $r=\\frac{x-c}{b}$ for $x$.'],
      steps: [`With $r=\\frac{${base}}{${b}}$: $\\frac{1}{1-r}=${qt(sq)}\\Rightarrow r=1-\\frac1{${qt(sq)}}=${qt(ratio)}$.`, `$|r|=${qt(Q(Math.abs(ratio[0]), ratio[1]))}<1$, so the series does converge there.`, `$x=${c}+${b}\\cdot${qt(ratio)}=${qt(x)}$.`],
      recall: 'Geometric series: first check $|r|<1$, then $S=\\frac{1}{1-r}$ (first term $1$).',
    };
  },
});

// ---- G21: what the radius must be, given convergence / divergence at two points ----
G.push({
  id: 'gx-radius-bounds', unit: 'series', topic: SER, diff: 4,
  src: 'Exam 3 style: "a power series converges at x=a and diverges at x=b -- what can you say about R?"',
  make(r) {
    const c = r.int(-3, 4), u = r.int(2, 5), w = u + r.int(1, 4);
    const s1 = r.pick([-1, 1]), s2 = r.pick([-1, 1]);
    const x1 = c + s1 * u, x2 = c + s2 * w;
    const cx = c === 0 ? 'x' : `(x${c < 0 ? '+' : '-'}${Math.abs(c)})`;
    const T = t => `$${t}$`;
    return {
      fmt: 'mc', arch: 'converge-diverge-points', chk: { k: 'bounds', c, x1, x2, u, w },
      prompt: `The power series $\\sum_{n=0}^{\\infty}a_n${cx}^{n}$ converges at $x=${x1}$ and diverges at $x=${x2}$. Which statement about its radius $R$ **must** be true?`,
      choices: tch(T(`${u}\\le R\\le ${w}`), [
        { t: T(`${u}<R<${w}`), why: 'Strict inequalities are too strong: convergence at $x_1$ is also possible when $x_1$ is an endpoint ($R=|x_1-c|$), and divergence at $x_2$ is possible with $R=|x_2-c|$ too.', err: 'endpoints' },
        { t: T(`R=${u}`), why: 'Convergence at one point only gives $R\\ge$ its distance from the centre; it need not be an endpoint.', err: 'conceptual' },
        { t: T(`R\\ge ${w}`), why: 'Divergence at $x_2$ forces $|x_2-c|\\ge R$, i.e. $R\\le$ that distance -- the inequality goes the other way.', err: 'conceptual' },
        { t: T(`R\\le ${u}`), why: 'Convergence at $x_1$ forces $R\\ge|x_1-c|$ (inside or on the boundary), not $\\le$.', err: 'conceptual' },
        { t: T(`R<${u}`), why: 'If $R<|x_1-c|$ the series would diverge at $x_1$. So $R\\ge|x_1-c|$.', err: 'conceptual' },
      ]),
      keyWhy: `Distance from centre: $|${x1}-${c}|=${u}$ (converges $\\Rightarrow R\\ge${u}$) and $|${x2}-${c}|=${w}$ (diverges $\\Rightarrow R\\le${w}$). Either bound can be an equality.`,
      hints: ['Distance from the centre to each point.', 'A power series converges at every point strictly inside $R$ and diverges at every point strictly outside.'],
      steps: [`Centre $c=${c}$.`, `Converges at $x=${x1}$ (distance $${u}$) $\\Rightarrow R\\ge${u}$.`, `Diverges at $x=${x2}$ (distance $${w}$) $\\Rightarrow R\\le${w}$.`, `So $${u}\\le R\\le${w}$.`],
      recall: 'Converges at distance $d_1\\Rightarrow R\\ge d_1$. Diverges at distance $d_2\\Rightarrow R\\le d_2$. Endpoints allow equality.',
    };
  },
});

// ---- G11: function -> power series by rewriting as a geometric series ----
G.push({
  id: 'gx-geo-rewrite', unit: 'series', topic: SER, diff: 3,
  src: 'Exam 3 style: "express as a power series centered at 0 and find the radius" via 1/(1-u)',
  make(r) {
    const t = r.int(0, 2);
    if (t === 0) {
      const d = r.int(2, 6), m = r.int(0, 2);
      const f = `\\dfrac{${m === 0 ? '1' : mpre(m)}}{${d}-x}`;
      const K = (e, den, R_) => `$\\displaystyle\\sum_{n=0}^{\\infty}\\frac{x^{${e}}}{${den}},\\quad R=${R_}$`;
      const ex = m === 0 ? 'n' : `n+${m}`;
      return {
        fmt: 'mc', arch: 'geometric-rewrite', chk: { k: 'geoR', t, d, m, f: `x**${m}/(${d}-x)`, term: `x**(n+${m})/${d}**(n+1)`, n0: 0 },
        prompt: `Write $f(x)=${f}$ as a power series centered at $0$ and give its radius of convergence.`,
        choices: tch(K(ex, `${d}^{n+1}`, d), [
          { t: K(ex, `${d}^{n}`, d), why: `$\\frac{1}{${d}-x}=\\frac{1}{${d}}\\cdot\\frac{1}{1-x/${d}}$: the leading $\\frac1{${d}}$ gives $${d}^{n+1}$, not $${d}^n$.`, err: 'dropped-factor' },
          { t: K(ex, `${d}^{n+1}`, `\\frac1{${d}}`), why: `$|x/${d}|<1\\iff|x|<${d}$, so $R=${d}$, not $\\frac1{${d}}$.`, err: 'formula-confusion' },
          m ? { t: K('n', `${d}^{n+1}`, d), why: `Multiplying by $${mpre(m)}$ shifts every exponent up by $${m}$.`, err: 'dropped-factor' } : { t: K('n', `(-${d})^{n+1}`, d), why: 'The ratio is $+x/d$ (from $d-x$), so there is no alternating sign.', err: 'sign' },
          { t: K(ex, `${d}^{n+1}`, d * d), why: `The condition is $|x/${d}|<1$, i.e. $R=${d}$ -- the ${d} is not squared.`, err: 'algebra-slip' },
          { t: K(`${ex}`, `(${d}-1)^{n+1}`, d - 1), why: 'Factor $d$ out of the denominator: $d-x=d(1-x/d)$.', err: 'algebra-slip' },
        ]),
        hints: [`Factor ${d} out: $${d}-x=${d}\\left(1-\\frac{x}{${d}}\\right)$.`, 'Then use $\\frac{1}{1-u}=\\sum u^n$ with $u=x/' + d + '$.'],
        steps: [`$\\frac{1}{${d}-x}=\\frac{1}{${d}}\\cdot\\frac{1}{1-x/${d}}$.`, `$=\\frac1{${d}}\\sum_{n=0}^{\\infty}\\left(\\frac{x}{${d}}\\right)^{n}=\\sum\\frac{x^n}{${d}^{n+1}}$, valid for $|x|<${d}$.`, m ? `Multiply by $${mpre(m)}$: exponents become $n+${m}$.` : 'No outside factor.'],
        recall: 'Make the denominator look like $1-u$ (factor out the constant), then sum $u^n$; the radius is where $|u|<1$.',
      };
    }
    if (t === 1) {
      const q = r.pick([2, 3, 4]), k = q * q;
      const K = (body, R_) => `$\\displaystyle\\sum_{n=0}^{\\infty}${body},\\quad R=${R_}$`;
      return {
        fmt: 'mc', arch: 'geometric-rewrite', chk: { k: 'geoR', t, d: k, m: 0, f: `1/(1+${k}*x**2)`, term: `(-1)**n*${k}**n*x**(2*n)`, n0: 0 },
        prompt: `Write $f(x)=\\dfrac{1}{1+${k}x^{2}}$ as a power series centered at $0$ and give its radius of convergence.`,
        choices: tch(K(`(-1)^{n}${k}^{n}x^{2n}`, `\\frac1{${q}}`), [
          { t: K(`${k}^{n}x^{2n}`, `\\frac1{${q}}`), why: 'The denominator is $1+u$, so $u=-' + k + 'x^2$ and the terms alternate: $(-1)^n$ is missing.', err: 'sign' },
          { t: K(`(-1)^{n}${k}^{n}x^{n}`, `\\frac1{${q}}`), why: '$u=-' + k + 'x^{2}$, so $u^n$ contains $x^{2n}$, not $x^n$.', err: 'chain-rule' },
          { t: K(`(-1)^{n}${k}^{n}x^{2n}`, q), why: `$|${k}x^2|<1\\iff|x|<\\frac{1}{${q}}$. The radius is $\\frac1{${q}}$, not ${q}.`, err: 'formula-confusion' },
          { t: K(`(-1)^{n}${k}^{n}x^{2n}`, `\\frac1{${k}}`), why: `$${k}x^2<1\\iff x^2<\\frac1{${k}}\\iff|x|<\\frac1{${q}}$ -- take the square root.`, err: 'algebra-slip' },
        ]),
        hints: ['$\\frac{1}{1+u}=\\frac{1}{1-(-u)}$.', 'Here $u=' + k + 'x^2$.'],
        steps: [`$\\frac{1}{1+${k}x^2}=\\frac{1}{1-(-${k}x^2)}=\\sum(-${k}x^2)^n=\\sum(-1)^n${k}^nx^{2n}$.`, `Converges when $${k}x^2<1\\iff|x|<\\frac1{${q}}$.`],
        recall: 'For $\\frac{1}{1+u}$ use ratio $-u$ (alternating); a power inside $u$ shows up in the exponent AND the radius.',
      };
    }
    const a = r.pick([2, 3, 4, 5]), b2 = r.pick([2, 3].filter(v => v !== a));
    const K = (body, R_) => `$\\displaystyle\\sum_{n=0}^{\\infty}${body},\\quad R=${R_}$`;
    const Rq = Q(a, b2);
    return {
      fmt: 'mc', arch: 'geometric-rewrite', chk: { k: 'geoR', t, d: a, m: b2, f: `1/(${a}-${b2}*x)`, term: `${b2}**n*x**n/${a}**(n+1)`, n0: 0 },
      prompt: `Write $f(x)=\\dfrac{1}{${a}-${b2}x}$ as a power series centered at $0$ and give its radius of convergence.`,
      choices: tch(K(`\\frac{${b2}^{n}}{${a}^{n+1}}x^{n}`, qt(Rq)), [
        { t: K(`\\frac{${b2}^{n}}{${a}^{n}}x^{n}`, qt(Rq)), why: `Factoring ${a} out gives a leading $\\frac1{${a}}$, so the denominator is $${a}^{n+1}$.`, err: 'dropped-factor' },
        { t: K(`\\frac{${b2}^{n}}{${a}^{n+1}}x^{n}`, qt(qinv(Rq))), why: `$\\left|\\frac{${b2}x}{${a}}\\right|<1\\iff|x|<\\frac{${a}}{${b2}}$ -- you inverted.`, err: 'formula-confusion' },
        { t: K(`\\frac{1}{${a}^{n+1}}x^{n}`, a), why: `The ${b2} in front of $x$ also gets raised to the $n$th power: $u=\\frac{${b2}x}{${a}}$.`, err: 'chain-rule' },
        { t: K(`\\frac{(-${b2})^{n}}{${a}^{n+1}}x^{n}`, qt(Rq)), why: 'The denominator is $a-bx=a(1-\\frac bax)$ -- the ratio is $+\\frac bax$, so no alternating sign.', err: 'sign' },
      ]),
      hints: [`$${a}-${b2}x=${a}\\left(1-\\frac{${b2}}{${a}}x\\right)$.`],
      steps: [`$\\frac{1}{${a}-${b2}x}=\\frac1{${a}}\\cdot\\frac{1}{1-\\frac{${b2}}{${a}}x}=\\frac1{${a}}\\sum\\left(\\frac{${b2}x}{${a}}\\right)^n$.`, `$=\\sum\\frac{${b2}^n}{${a}^{n+1}}x^n$, valid for $\\left|\\frac{${b2}x}{${a}}\\right|<1$, i.e. $|x|<${qt(Rq)}$.`],
      recall: 'Factor the constant out of the denominator to reach $1-u$; the whole $u$ (including its coefficient) is raised to $n$.',
    };
  },
});

// =====================================================================
// TAYLOR & MACLAURIN SERIES
// =====================================================================
const uSub = f => `u=${f.k === 1 ? '' : f.k === -1 ? '-' : f.k}${xpw(f.j)}`;
const firstTerms = (f, n = 3) => evals(f.nm, 8).map(e => [fcoef(f.nm, f.k, f.j, e), f.m + f.j * e]).slice(0, n);

// ---- G7: coefficient of x^E in x^m * g(k x^j) by substitution into a known series ----
G.push({
  id: 'gx-mac-coef', unit: 'series', topic: TM, diff: 3,
  src: 'Exam 3 Q4 style (Taylor Series handout table): new Maclaurin series by substitution, read off one coefficient',
  make(r) {
    const f = pickFn(r), es = evals(f.nm, 8).filter(e => e >= 1);
    const e = r.pick(es.slice(0, 3)), E = f.m + f.j * e;
    const key = fcoef(f.nm, f.k, f.j, e), nxt = es[es.indexOf(e) + 1];
    return {
      fmt: fmtOf(r), arch: 'known-series-sub', chk: { k: 'coef', ...CHK_F(f), E, val: qs(key) },
      prompt: `Use a known Maclaurin series to find the coefficient of $x^{${E}}$ in the Maclaurin series of $f(x)=${fTexOf(f)}$.`,
      choices: qch(key, [
        [FN[f.nm].c(e), `The base series was evaluated at $u=${f.k === 1 ? '' : f.k}x^{${f.j}}$ -- the constant ${f.k} is raised to the power $${e}$ as well: $(${f.k})^{${e}}$ multiplies the coefficient.`, 'chain-rule'],
        [qpow(Q(f.k), e), 'That keeps $k^e$ but drops the factorial/alternation/denominator of the base series.', 'dropped-factor'],
        [qneg(key), 'Sign slip: recheck the sign pattern of the base series and the sign of the constant raised to the power.', 'sign'],
        [fcoef(f.nm, f.k, f.j, nxt), 'That is the coefficient of a neighbouring term: match the exponent $m+j\\,e=' + E + '$ exactly.', 'off-by-one'],
        [FN[f.nm].c(E) && fcoef(f.nm, f.k, f.j, E), `The exponent $${E}$ on $x$ is $m+j\\,e$, not $e$: you must solve $${f.m}+${f.j}e=${E}$ for $e$.`, 'setup'],
      ]),
      hints: [`Start from ${'$' + KNOWN[f.nm] + '$'} and put $${uSub(f)}$.`, `Which $e$ makes $${f.m}+${f.j}e=${E}$?`],
      steps: [`Known: $${KNOWN[f.nm]}$.`, `Substitute $${uSub(f)}$ and multiply by $${f.m ? mpre(f.m) : '1'}$: the $u^{e}$ term becomes $x^{${f.m}+${f.j}e}$.`, `$${f.m}+${f.j}e=${E}\\Rightarrow e=${e}$.`, `Coefficient $=\\text{(coefficient of }u^{${e}})\\cdot(${f.k})^{${e}}=${qt(key)}$.`],
      recall: 'Substitution: $u=kx^j$ raises $k$ to the same power as $x$; an outside factor $x^m$ shifts every exponent by $m$.',
    };
  },
});

// ---- G8: f^(n)(c) read off a series ----
const DFAM = [
  { n0: 0, a: (n, b) => Q((n % 2 ? -1 : 1), (n + 1) * b ** n), tex: b => `\\frac{(-1)^{n}}{(n+1)\\,${b}^{n}}`, py: b => `(-1)**n/((n+1)*${b}**n)` },
  { n0: 1, a: (n, b) => Q(1, n * n * b ** n), tex: b => `\\frac{1}{n^{2}\\,${b}^{n}}`, py: b => `1/(n**2*${b}**n)` },
  { n0: 0, a: (n, b) => Q(n + 1, b ** n), tex: b => `\\frac{n+1}{${b}^{n}}`, py: b => `(n+1)/${b}**n` },
  { n0: 0, a: (n, b) => Q((n % 2 ? -1 : 1) * b ** n, n + 2), tex: b => `\\frac{(-1)^{n}${b}^{n}}{n+2}`, py: b => `(-1)**n*${b}**n/(n+2)` },
];
G.push({
  id: 'gx-deriv-from-series', unit: 'series', topic: TM, diff: 4,
  src: 'Exam 3 style: "find f^(n)(c)" from a power series -- coefficient a_n = f^(n)(c)/n!',
  make(r) {
    if (r() < 0.5) {
      const fam = r.pick(DFAM), b = r.int(2, 4), c = r.pick([0, r.nz(1, 4), r.nz(-4, -1)]), kk = r.int(3, 5);
      const ak = fam.a(kk, b), key = qmul(Q(fact(kk)), ak);
      const S = `\\sum_{n=${fam.n0}}^{\\infty}${fam.tex(b)}\\,${c === 0 ? 'x^{n}' : `(x${c < 0 ? '+' : '-'}${Math.abs(c)})^{n}`}`;
      return {
        fmt: fmtOf(r, 0.6), arch: 'coef-extraction', chk: { k: 'deriv', n0: fam.n0, b, kk, c, py: fam.py(b), val: qs(key) },
        prompt: `A function is given by $f(x)=${S}$. Find $f^{(${kk})}(${c})$.`,
        choices: qch(key, [
          [ak, `That is the coefficient $a_{${kk}}=\\frac{f^{(${kk})}(${c})}{${kk}!}$. The derivative is ${kk}! times larger.`, 'dropped-factor'],
          [qmul(Q(fact(kk - 1)), ak), `Use ${kk}!, not $(${kk}-1)!$: $f^{(n)}(c)=n!\\,a_n$.`, 'off-by-one'],
          [qmul(Q(fact(kk + 1)), ak), `Use ${kk}!, not $(${kk}+1)!$.`, 'off-by-one'],
          [qmul(Q(fact(kk)), fam.a(kk - 1 >= fam.n0 ? kk - 1 : kk + 1, b)), `You picked the coefficient of the wrong power: you need $a_{${kk}}$, the coefficient of $(x-${c})^{${kk}}$.`, 'off-by-one'],
        ]),
        hints: ['Taylor series: $a_n=\\dfrac{f^{(n)}(c)}{n!}$.', 'Find the coefficient of the right power, then multiply by the factorial.'],
        steps: [`The series is in powers of $(x-${c})$, so it is the Taylor series of $f$ about $c=${c}$ and $a_n=\\frac{f^{(n)}(${c})}{n!}$.`, `$a_{${kk}}=${qt(ak)}$.`, `$f^{(${kk})}(${c})=${kk}!\\cdot a_{${kk}}=${qt(key)}$.`],
        recall: '$f^{(n)}(c)=n!\\,a_n$. The coefficient of $(x-c)^n$ is NOT the derivative.',
      };
    }
    const f = pickFn(r), es = evals(f.nm, 8).filter(e => e >= 1), e = r.pick(es.slice(0, 3)), E = f.m + f.j * e;
    const cf = fcoef(f.nm, f.k, f.j, e), key = qmul(Q(fact(E)), cf);
    return {
      fmt: fmtOf(r, 0.6), arch: 'coef-extraction', chk: { k: 'deriv0', ...CHK_F(f), N: E, val: qs(key) },
      prompt: `Use the Maclaurin series of $f(x)=${fTexOf(f)}$ to find $f^{(${E})}(0)$.`,
      choices: qch(key, [
        [cf, `That is the COEFFICIENT of $x^{${E}}$. The derivative is $${E}!$ times it.`, 'dropped-factor'],
        [qmul(Q(fact(E - 1)), cf), `$f^{(n)}(0)=n!\\,a_n$ with $n=${E}$, not $(n-1)!$.`, 'off-by-one'],
        [qneg(key), 'Sign slip in the coefficient.', 'sign'],
        [qmul(Q(E), cf), `Multiplying by $n=${E}$ is one derivative's worth. You need the full factorial $${E}!$.`, 'dropped-factor'],
      ]),
      hints: ['$f^{(n)}(0)=n!\\cdot(\\text{coefficient of }x^n)$.', `Find the coefficient of $x^{${E}}$ by substitution.`],
      steps: [`Known: $${KNOWN[f.nm]}$; put $${uSub(f)}$ and multiply by $${f.m ? mpre(f.m) : '1'}$.`, `$x^{${E}}$ comes from $e=${e}$: coefficient $${qt(cf)}$.`, `$f^{(${E})}(0)=${E}!\\cdot${qt(cf)}=${qt(key)}$.`],
      recall: 'Derivative at the centre = factorial times coefficient.',
    };
  },
});

// ---- G9: Taylor coefficients of x^alpha at a nonzero centre ----
const PW = [
  { p: 1, q: 2, ms: [2, 3, 4, 5], t: 'f(x)=\\sqrt{x}' }, { p: -1, q: 1, ms: [2, 3, 4, 5], t: 'f(x)=\\dfrac{1}{x}' },
  { p: -1, q: 2, ms: [2, 3], t: 'f(x)=\\dfrac{1}{\\sqrt{x}}' }, { p: 1, q: 3, ms: [2, 3], t: 'f(x)=\\sqrt[3]{x}' },
  { p: 3, q: 2, ms: [2, 3], t: 'f(x)=x^{3/2}' }, { p: -2, q: 1, ms: [2, 3], t: 'f(x)=\\dfrac{1}{x^{2}}' },
];
const binomQ = (al, n) => { let o = Q(1); for (let i = 0; i < n; i++) o = qmul(o, qadd(al, Q(-i))); return qmul(o, Q(1, fact(n))); };
const pwCoef = (w, m, n) => qmul(binomQ(Q(w.p, w.q), n), qpow(Q(m), w.p - n * w.q));    // c = m^q
G.push({
  id: 'gx-taylor-scratch', unit: 'series', topic: TM, diff: 4,
  src: 'Exam 3 Q2 style: Taylor series from the definition at a nonzero centre (derivatives at c, divide by n!)',
  make(r) {
    const w = r.pick(PW), m = r.pick(w.ms), c = m ** w.q, al = Q(w.p, w.q);
    const a = n => pwCoef(w, m, n), d = n => qmul(Q(fact(n)), a(n));
    const X = `(x-${c})`;
    const derivs = [0, 1, 2, 3].map(n => `$f^{(${n})}(${c})=${qt(d(n))}$`).join(', ');
    const steps = ['Differentiate repeatedly (power rule), then evaluate each derivative AT the centre.', derivs.replace(/\$/g, '$') + '.', 'Divide by $n!$ for the coefficient of $(x-c)^n$.'];
    if (r() < 0.5) {
      const n = r.pick([2, 3]), key = a(n);
      return {
        fmt: fmtOf(r, 0.65), arch: 'taylor-from-scratch', chk: { k: 'tay', p: w.p, q: w.q, m, n, val: qs(key) },
        prompt: `Find the coefficient of $(x-${c})^{${n}}$ in the Taylor series of $${w.t}$ centered at $x=${c}$.`,
        choices: qch(key, [
          [d(n), `That is $f^{(${n})}(${c})$. The coefficient is $\\frac{f^{(${n})}(${c})}{${n}!}$.`, 'dropped-factor'],
          [qneg(key), 'Check the sign: each derivative of a decreasing power brings a factor of $(\\alpha-i)$.', 'sign'],
          [qmul(binomQ(al, n), qpow(Q(m), w.p)), `The power of the centre drops by $${n}$ after $${n}$ derivatives: use $c^{\\alpha-${n}}$, not $c^{\\alpha}$.`, 'algebra-slip'],
          [a(n - 1), `You found the coefficient of $(x-${c})^{${n - 1}}$. You need $n=${n}$.`, 'off-by-one'],
        ]),
        hints: ['$a_n=f^{(n)}(c)/n!$.', 'Differentiate $' + n + '$ times, plug in $x=' + c + '$.'],
        steps: [...steps, `$a_{${n}}=\\frac{${qt(d(n))}}{${n}!}=${qt(key)}$.`],
        recall: 'Taylor coefficient at $c$: $f^{(n)}(c)/n!$. Evaluate AT $c$, never at $0$.',
      };
    }
    const T = (co, X2 = X) => `$${poly([[a(0), 0], [co[0], 1], [co[1], 2]], X2)}$`;
    const key = T([a(1), a(2)]);
    return {
      fmt: 'mc', arch: 'taylor-from-scratch', chk: { k: 'tay2', p: w.p, q: w.q, m, a0: qs(a(0)), a1: qs(a(1)), a2: qs(a(2)) },
      prompt: `Find the degree-2 Taylor polynomial $T_2(x)$ for $${w.t}$ centered at $x=${c}$.`,
      choices: tch(key, [
        { t: T([a(1), d(2)]), why: `The quadratic coefficient is $\\frac{f''(${c})}{2!}$; you used $f''(${c})$ itself.`, err: 'dropped-factor' },
        { t: T([qneg(a(1)), a(2)]), why: `Check the sign of $f'(${c})$: it is $${qt(a(1))}$.`, err: 'sign' },
        { t: T([a(1), a(2)], 'x'), why: `The powers must be $(x-${c})^n$ -- centred at $${c}$, not $0$.`, err: 'setup' },
        { t: T([a(1), qneg(a(2))]), why: `Check the sign of $\\frac{f''(${c})}{2}$: it is $${qt(a(2))}$.`, err: 'sign' },
        { t: T([qmul(Q(w.p, w.q), qpow(Q(m), w.p)), a(2)]), why: `$f'(c)=\\alpha c^{\\alpha-1}$ -- lower the power by one.`, err: 'algebra-slip' },
      ]),
      hints: ['$T_2(x)=f(c)+f\'(c)(x-c)+\\frac{f\'\'(c)}{2!}(x-c)^2$.'],
      steps: [...steps, `$T_2(x)=${poly([[a(0), 0], [a(1), 1], [a(2), 2]], X)}$.`],
      recall: '$T_n(x)=\\sum_{k\\le n}\\frac{f^{(k)}(c)}{k!}(x-c)^k$: numbers first, then divide by $k!$.',
    };
  },
});

// ---- G10: Taylor polynomial at a nonzero centre for e^{kx}, ln x, sin/cos at a nice angle ----
const ANG = {
  6: { s: '\\frac12', c: '\\frac{\\sqrt3}{2}', hs: '\\frac14', hc: '\\frac{\\sqrt3}{4}', ps: '1/2', pc: 'sqrt(3)/2' },
  4: { s: '\\frac{\\sqrt2}{2}', c: '\\frac{\\sqrt2}{2}', hs: '\\frac{\\sqrt2}{4}', hc: '\\frac{\\sqrt2}{4}', ps: 'sqrt(2)/2', pc: 'sqrt(2)/2' },
  3: { s: '\\frac{\\sqrt3}{2}', c: '\\frac12', hs: '\\frac{\\sqrt3}{4}', hc: '\\frac14', ps: 'sqrt(3)/2', pc: '1/2' },
};
G.push({
  id: 'gx-taylor-shift', unit: 'series', topic: TM, diff: 4,
  src: 'Exam 3 Q2 style: Taylor polynomial from the definition -- e^{kx}, ln x, sin/cos at nonzero centres',
  make(r) {
    const fam = r.pick(['ln', 'exp', 'sin', 'cos']);
    const mk = (key, wrongs, steps, chk) => ({
      fmt: 'mc', arch: 'taylor-from-scratch', chk,
      choices: tch(key, wrongs.map(([t, why, err]) => ({ t, why, err }))),
      hints: ['$T_2=f(c)+f\'(c)(x-c)+\\frac{f\'\'(c)}{2}(x-c)^2$: build the three numbers first.'], steps,
      recall: 'List $f,f\',f\''+"'"+'$ as functions, THEN evaluate at $c$, then divide the last by $2!$.',
    });
    if (fam === 'ln') {
      const c = r.int(2, 5), X = `(x-${c})`;
      const T = (a0, a1, a2, XX = X) => `$${a0}+\\dfrac{${XX}}{${a1}}${a2}$`;
      const key = `$\\ln ${c}+\\dfrac{x-${c}}{${c}}-\\dfrac{(x-${c})^{2}}{${2 * c * c}}$`;
      const o = mk(key, [
        [`$\\ln ${c}+\\dfrac{x-${c}}{${c}}-\\dfrac{(x-${c})^{2}}{${c * c}}$`, `The quadratic term is $\\frac{f''(${c})}{2!}(x-${c})^2$ with $f''(${c})=-\\frac1{${c * c}}$: divide by $2!$ to get $\\frac1{${2 * c * c}}$.`, 'dropped-factor'],
        [`$\\ln ${c}+\\dfrac{x-${c}}{${c}}+\\dfrac{(x-${c})^{2}}{${2 * c * c}}$`, `$f''(x)=-\\frac{1}{x^{2}}<0$, so the quadratic coefficient is negative.`, 'sign'],
        [`$\\ln ${c}+\\dfrac{x-${c}}{${c * c}}-\\dfrac{(x-${c})^{2}}{${2 * c * c * c}}$`, `$f'(x)=\\frac1x$, so $f'(${c})=\\frac1{${c}}$ (not $\\frac1{${c * c}}$).`, 'algebra-slip'],
        [`$\\ln ${c}+\\dfrac{x}{${c}}-\\dfrac{x^{2}}{${2 * c * c}}$`, `Powers must be $(x-${c})^n$ -- centre $${c}$.`, 'setup'],
        [`$0+\\dfrac{x-${c}}{${c}}-\\dfrac{(x-${c})^{2}}{${2 * c * c}}$`, `$f(${c})=\\ln ${c}\\neq0$; only $\\ln1=0$.`, 'conceptual'],
      ], [`$f=\\ln x,\\ f'=\\frac1x,\\ f''=-\\frac1{x^2}$.`, `At $x=${c}$: $\\ln ${c},\\ \\frac1{${c}},\\ -\\frac1{${c * c}}$.`, `$T_2=\\ln ${c}+\\frac1{${c}}(x-${c})+\\frac{-1/${c * c}}{2}(x-${c})^2$.`], { k: 'shift', f: 'log(x)', c, coefs: [`log(${c})`, `1/${c}`, `-1/(2*${c}**2)`] });
      o.prompt = `Find the degree-2 Taylor polynomial of $f(x)=\\ln x$ centered at $x=${c}$.`;
      return o;
    }
    if (fam === 'exp') {
      const c = r.pick([1, 2]), k = r.pick([2, 3, -1, -2]), X = `(x-${c})`;
      const E = `e^{${k * c}}`;
      const T = (pref, co) => `$${pref}\\left[${poly([[Q(1), 0], [co[0], 1], [co[1], 2]], X)}\\right]$`;
      const kk = Q(k), half = Q(k * k, 2);
      const key = T(E, [kk, half]);
      const o = mk(key, [
        [T(E, [kk, Q(k * k)]), `The quadratic coefficient is $\\frac{f''(${c})}{2!}=\\frac{k^{2}e^{k${c}}}{2}$; you left out the $2!$.`, 'dropped-factor'],
        [T(E, [Q(1), Q(1, 2)]), `The chain rule brings a factor $k=${k}$ at EACH derivative of $e^{${k}x}$: $f^{(n)}=k^{n}e^{${k}x}$.`, 'chain-rule'],
        [T(`e^{${k}}`, [kk, half]), `The prefactor is $f(${c})=e^{${k}\\cdot ${c}}=e^{${k * c}}$.`, 'algebra-slip'],
        [T(E, [kk, Q(k, 2)]), `Each derivative of $e^{${k}x}$ brings a factor $k$: the quadratic term has $k^{2}=${k * k}$, not $k=${k}$.`, 'chain-rule'],
        [T(E, [qneg(kk), half]), 'Sign: $f\'(c)=ke^{kc}$ has the sign of $k$.', 'sign'],
      ], [`$f^{(n)}(x)=${k}^{n}e^{${k}x}$, so $f^{(n)}(${c})=${k}^{n}e^{${k * c}}$.`, `$T_2=${E}\\left[1+${k}(x-${c})+\\frac{${k * k}}{2}(x-${c})^2\\right]$.`], { k: 'shift', f: `exp(${k}*x)`, c, coefs: [`exp(${k * c})`, `${k}*exp(${k * c})`, `${k * k}*exp(${k * c})/2`] });
      o.prompt = `Find the degree-2 Taylor polynomial of $f(x)=e^{${k === 1 ? '' : k}x}$ centered at $x=${c}$.`;
      return o;
    }
    const d = r.pick([6, 4, 3]), A = ANG[d], isS = fam === 'sin';
    const arg = `\\left(x-\\frac{\\pi}{${d}}\\right)`;
    const B = (a0, a1, a2) => `$${a0}${a1[0]}${a1[1]}${arg}${a2[0]}${a2[1]}${arg}^{2}$`;
    const sinK = B(A.s, ['+', A.c], ['-', A.hs]), cosK = B(A.c, ['-', A.s], ['-', A.hc]);
    const key = isS ? sinK : cosK;
    const o = mk(key, isS ? [
      [B(A.s, ['+', A.c], ['-', A.s]), 'The quadratic coefficient is $\\frac{f\'\'}{2!}=-\\frac{\\sin(\\pi/' + d + ')}{2}$; you did not divide by $2!$.', 'dropped-factor'],
      [cosK, 'That is the Taylor polynomial of $\\cos x$. For $\\sin x$: $f=\\sin,\\ f\'=\\cos,\\ f\'\'=-\\sin$.', 'formula-confusion'],
      [B(A.s, ['-', A.c], ['-', A.hs]), 'The derivative of $\\sin$ is $+\\cos$, so the linear term is positive.', 'sign'],
      [B(A.s, ['+', A.c], ['+', A.hs]), '$f\'\'=-\\sin x$, so the quadratic term is negative.', 'sign'],
      [`$${A.s}+${A.c}x-${A.hs}x^{2}$`, 'Powers of $\\left(x-\\frac{\\pi}{' + d + '}\\right)$, not of $x$.', 'setup'],
    ] : [
      [B(A.c, ['-', A.s], ['-', A.c]), 'The quadratic coefficient is $\\frac{f\'\'}{2!}=-\\frac{\\cos(\\pi/' + d + ')}{2}$; divide by $2!$.', 'dropped-factor'],
      [sinK, 'That is the Taylor polynomial of $\\sin x$. For $\\cos x$: $f=\\cos,\\ f\'=-\\sin,\\ f\'\'=-\\cos$.', 'formula-confusion'],
      [B(A.c, ['+', A.s], ['-', A.hc]), 'The derivative of $\\cos$ is $-\\sin$, so the linear term is negative.', 'sign'],
      [B(A.c, ['-', A.s], ['+', A.hc]), '$f\'\'=-\\cos x$, so the quadratic term is negative.', 'sign'],
      [`$${A.c}-${A.s}x-${A.hc}x^{2}$`, 'Powers of $\\left(x-\\frac{\\pi}{' + d + '}\\right)$, not of $x$.', 'setup'],
    ], [`$f=\\${fam}x,\\ f'=${isS ? '\\cos x' : '-\\sin x'},\\ f''=${isS ? '-\\sin x' : '-\\cos x'}$.`, `Evaluate at $\\frac{\\pi}{${d}}$ and divide the last by $2!$.`],
    { k: 'shift', f: `${fam}(x)`, c: `pi/${d}`, coefs: isS ? [`${A.ps}`, `${A.pc}`, `-(${A.ps})/2`] : [`${A.pc}`, `-(${A.ps})`, `-(${A.pc})/2`] });
    o.prompt = `Find the degree-2 Taylor polynomial of $f(x)=\\${fam}\\,x$ centered at $x=\\dfrac{\\pi}{${d}}$.`;
    return o;
  },
});

// ---- G12: new Maclaurin series by differentiating / integrating a known one ----
const kp = k => (k < 0 ? `(${k})` : `${k}`);
G.push({
  id: 'gx-series-diff-int', unit: 'series', topic: TM, diff: 4,
  src: 'Exam 3 Q4 style: Maclaurin series by differentiating/integrating 1/(1-x), 1/(1+x^2), e^{-x^2} term by term',
  make(r) {
    const t = r.int(0, 3), S = b => `$\\displaystyle ${b}$`;
    if (t === 0) {
      const k = r.pick([2, 3, -1, -2]), K = kp(k);
      return {
        fmt: 'mc', arch: 'diff-int-series', chk: { k: 'sumterm', f: `1/(1-(${k})*x)**2`, term: `(n+1)*(${k})**n*x**n`, n0: 0 },
        prompt: `Differentiate the series $\\dfrac{1}{1-${k < 0 ? '(' + k + ')' : k}x}=\\sum_{n=0}^{\\infty}${K}^{n}x^{n}$ term by term to find the Maclaurin series of $\\dfrac{1}{(1-${k < 0 ? '(' + k + ')' : k}x)^{2}}$.`,
        choices: tch(S(`\\sum_{n=0}^{\\infty}(n+1)${K}^{n}x^{n}`), [
          { t: S(`\\sum_{n=0}^{\\infty}(n+1)${kp(k)}^{n+1}x^{n}`), why: `$\\frac{d}{dx}\\frac{1}{1-kx}=\\frac{k}{(1-kx)^2}$, so you must DIVIDE the differentiated series by $k$. Without that, you have $\\frac{k}{(1-kx)^2}$.`, err: 'chain-rule' },
          { t: S(`\\sum_{n=0}^{\\infty}n${K}^{n}x^{n}`), why: 'After differentiating, $nk^nx^{n-1}$ must be re-indexed so the power is $x^{n}$ again: that turns $n$ into $n+1$.', err: 'off-by-one' },
          { t: S(`\\sum_{n=0}^{\\infty}\\frac{${K}^{n}x^{n}}{n+1}`), why: 'That is what INTEGRATING would give. Differentiating multiplies by the exponent.', err: 'formula-confusion' },
          { t: S(`\\sum_{n=0}^{\\infty}(n+1)x^{n}`), why: 'The constant $k$ is raised to the $n$th power too: it is part of $u=kx$.', err: 'chain-rule' },
        ]),
        hints: ['Differentiate both sides; the left side is $\\frac{k}{(1-kx)^2}$.', 'Re-index so the exponent is $n$.'],
        steps: [`$\\frac{d}{dx}\\frac{1}{1-${K}x}=\\frac{${K}}{(1-${K}x)^2}$.`, `$\\frac{d}{dx}\\sum ${K}^nx^n=\\sum_{n=1}^{\\infty}n${K}^nx^{n-1}$.`, `Divide by $${K}$ and shift $n\\to n+1$: $\\frac{1}{(1-${K}x)^2}=\\sum_{n=0}^{\\infty}(n+1)${K}^{n}x^{n}$.`],
        recall: 'Differentiating a series: lower the exponent by 1, multiply by the old exponent, then re-index. Don\'t forget the chain-rule constant.',
      };
    }
    if (t === 1) {
      const k = r.pick([2, 3, 4]);
      return {
        fmt: 'mc', arch: 'diff-int-series', chk: { k: 'sumterm', f: `log(1+${k}*x)`, term: `(-1)**(n+1)*${k}**n*x**n/n`, n0: 1 },
        prompt: `Integrate $\\dfrac{1}{1+${k}x}=\\sum_{n=0}^{\\infty}(-${k}x)^{n}$ term by term to find the Maclaurin series of $\\ln(1+${k}x)$.`,
        choices: tch(S(`\\sum_{n=1}^{\\infty}(-1)^{n+1}\\frac{${k}^{n}x^{n}}{n}`), [
          { t: S(`\\sum_{n=1}^{\\infty}(-1)^{n+1}\\frac{${k}^{n}x^{n}}{n!}`), why: 'Integration divides by the NEW exponent $n$, not $n!$. Factorials come from repeated differentiation of $e^x$, $\\sin$, $\\cos$.', err: 'formula-confusion' },
          { t: S(`\\sum_{n=1}^{\\infty}(-1)^{n+1}\\frac{x^{n}}{n}`), why: `$\\int_0^x\\frac{dt}{1+${k}t}$: the constant ${k} is part of the ratio $-${k}t$, so $${k}^{n}$ survives. (Check: derivative of $\\ln(1+${k}x)$ is $\\frac{${k}}{1+${k}x}$.)`, err: 'chain-rule' },
          { t: S(`\\sum_{n=1}^{\\infty}\\frac{${k}^{n}x^{n}}{n}`), why: 'The ratio is $-kx$, so the terms alternate. Check the sign of the second term of $\\ln(1+kx)=kx-\\frac{k^2x^2}{2}+\\cdots$.', err: 'sign' },
          { t: S(`\\sum_{n=0}^{\\infty}(-1)^{n}\\frac{${k}^{n}x^{n+1}}{n+1}`), why: `You integrated $\\sum(-${k}x)^n$ correctly but forgot the factor ${k} from $\\int\\frac{${k}}{1+${k}t}dt$ -- the missing $${k}$ shifts $${k}^n$ to $${k}^{n+1}$.`, err: 'dropped-factor' },
        ]),
        hints: ['$\\ln(1+kx)=\\int_0^x\\frac{k}{1+kt}\\,dt$.', 'Integrate each $t^n$ to get $\\frac{x^{n+1}}{n+1}$, then re-index.'],
        steps: [`$\\ln(1+${k}x)=\\int_0^x\\frac{${k}}{1+${k}t}dt=\\int_0^x${k}\\sum(-${k}t)^n dt$.`, `$=\\sum_{n=0}^{\\infty}(-1)^n\\frac{${k}^{n+1}x^{n+1}}{n+1}$.`, `Re-index ($n+1\\to n$): $\\sum_{n=1}^{\\infty}(-1)^{n+1}\\frac{${k}^nx^n}{n}$.`],
        recall: '$\\ln(1+u)=\\sum(-1)^{n+1}\\frac{u^n}{n}$ comes from integrating $\\frac1{1+u}$; keep the chain factor.',
      };
    }
    if (t === 2) {
      const k = r.pick([2, 3]);
      return {
        fmt: 'mc', arch: 'diff-int-series', chk: { k: 'sumterm', f: `atan(${k}*x)`, term: `(-1)**n*${k}**(2*n+1)*x**(2*n+1)/(2*n+1)`, n0: 0 },
        prompt: `Use $\\arctan u=\\sum_{n=0}^{\\infty}(-1)^n\\frac{u^{2n+1}}{2n+1}$ to write the Maclaurin series of $\\arctan(${k}x)$.`,
        choices: tch(S(`\\sum_{n=0}^{\\infty}(-1)^{n}\\frac{${k}^{2n+1}x^{2n+1}}{2n+1}`), [
          { t: S(`\\sum_{n=0}^{\\infty}(-1)^{n}\\frac{${k}^{n}x^{2n+1}}{2n+1}`), why: `$u=${k}x$, so $u^{2n+1}=${k}^{2n+1}x^{2n+1}$ -- the constant gets the SAME exponent $2n+1$.`, err: 'chain-rule' },
          { t: S(`\\sum_{n=0}^{\\infty}(-1)^{n}\\frac{${k}x^{2n+1}}{2n+1}`), why: `Substituting $u=${k}x$ raises ${k} to the power $2n+1$; it is not a simple multiplier.`, err: 'chain-rule' },
          { t: S(`\\sum_{n=0}^{\\infty}(-1)^{n}\\frac{${k}^{2n+1}x^{2n+1}}{(2n+1)!}`), why: 'That is $\\sin(kx)$. Arctangent has plain odd denominators $1,3,5,\\dots$ (it integrates $\\frac{1}{1+u^2}$).', err: 'formula-confusion' },
          { t: S(`\\sum_{n=0}^{\\infty}\\frac{${k}^{2n+1}x^{2n+1}}{2n+1}`), why: 'The alternating factor $(-1)^n$ survives substitution -- check the sign of the second term.', err: 'sign' },
        ]),
        hints: ['Replace every $u$ by $' + k + 'x$.'],
        steps: [`$u=${k}x\\Rightarrow u^{2n+1}=${k}^{2n+1}x^{2n+1}$.`, `$\\arctan(${k}x)=\\sum_{n=0}^{\\infty}(-1)^n\\frac{${k}^{2n+1}x^{2n+1}}{2n+1}$, valid for $|${k}x|\\le1$.`],
        recall: 'Substitution: every $u$ becomes $kx$ -- including inside the power $2n+1$.',
      };
    }
    const k = r.pick([1, 2, 3]), kx = k === 1 ? '' : k;
    return {
      fmt: 'mc', arch: 'diff-int-series', chk: { k: 'sumterm', f: `integrate(exp(-${k}*t**2),(t,0,x))`, term: `(-1)**n*${k}**n*x**(2*n+1)/(factorial(n)*(2*n+1))`, n0: 0 },
      prompt: `Find the Maclaurin series of $\\displaystyle F(x)=\\int_0^{x}e^{-${kx}t^{2}}\\,dt$ by substituting into the series for $e^{u}$ and integrating term by term.`,
      choices: tch(S(`\\sum_{n=0}^{\\infty}\\frac{(-1)^{n}${k}^{n}x^{2n+1}}{n!\\,(2n+1)}`), [
        { t: S(`\\sum_{n=0}^{\\infty}\\frac{(-1)^{n}${k}^{n}x^{2n+1}}{(2n+1)!}`), why: 'The $n!$ from $e^u$ stays; integrating adds a factor $(2n+1)$ -- giving the PRODUCT $n!\\,(2n+1)$, not the single factorial $(2n+1)!$.', err: 'formula-confusion' },
        { t: S(`\\sum_{n=0}^{\\infty}\\frac{(-1)^{n}${k}^{n}x^{2n}}{n!}`), why: 'That is the integrand\'s series, not its antiderivative: integrate each power of $t$.', err: 'setup' },
        { t: S(`\\sum_{n=0}^{\\infty}\\frac{(-1)^{n}${k}^{n}x^{2n+1}}{n!}`), why: 'Integrating $t^{2n}$ gives $\\frac{x^{2n+1}}{2n+1}$ -- you raised the exponent but did not divide.', err: 'dropped-factor' },
        { t: S(`\\sum_{n=0}^{\\infty}\\frac{${k}^{n}x^{2n+1}}{n!\\,(2n+1)}`), why: '$e^{-kt^2}$ has $u=-kt^2$, so the terms alternate: $(-1)^n$.', err: 'sign' },
      ]),
      hints: ['$e^{u}=\\sum u^n/n!$ with $u=-' + kx + 't^2$.', 'Integrate $t^{2n}$ from $0$ to $x$.'],
      steps: [`$e^{-${kx}t^2}=\\sum_{n=0}^{\\infty}\\frac{(-1)^n${k}^nt^{2n}}{n!}$.`, `$\\int_0^xt^{2n}dt=\\frac{x^{2n+1}}{2n+1}$.`, `$F(x)=\\sum_{n=0}^{\\infty}\\frac{(-1)^n${k}^nx^{2n+1}}{n!\\,(2n+1)}$.`],
      recall: 'Integrating a series divides each term by its NEW exponent; the original factorial stays.',
    };
  },
});

// ---- G24: binomial series coefficient ----
const BIN = [
  { al: Q(1, 2), f: k => `\\sqrt{1${k > 0 ? '+' : '-'}${Math.abs(k) === 1 ? '' : Math.abs(k)}x}` }, { al: Q(-1, 2), f: k => `\\dfrac{1}{\\sqrt{1${k > 0 ? '+' : '-'}${Math.abs(k) === 1 ? '' : Math.abs(k)}x}}` },
  { al: Q(1, 3), f: k => `\\sqrt[3]{1${k > 0 ? '+' : '-'}${Math.abs(k) === 1 ? '' : Math.abs(k)}x}` }, { al: Q(-2), f: k => `\\dfrac{1}{(1${k > 0 ? '+' : '-'}${Math.abs(k) === 1 ? '' : Math.abs(k)}x)^{2}}` },
  { al: Q(3, 2), f: k => `(1${k > 0 ? '+' : '-'}${Math.abs(k) === 1 ? '' : Math.abs(k)}x)^{3/2}` },
];
G.push({
  id: 'gx-binomial', unit: 'series', topic: TM, diff: 4,
  src: 'Exam 3 style (Taylor Series handout: (1+x)^k binomial series): coefficient of x^N in (1+kx)^alpha',
  make(r) {
    const b = r.pick(BIN), k = r.pick([1, 2, 4, -1, -2, 3]), N = r.pick([2, 3]);
    const key = qmul(binomQ(b.al, N), qpow(Q(k), N));
    const falling = qmul(Q(1, fact(N)), qpow(b.al, N));
    return {
      fmt: fmtOf(r, 0.6), arch: 'binomial-series', chk: { k: 'coef', sym: `(1+(${k})*x)**(${qs(b.al)})`, E: N, val: qs(key) },
      prompt: `Use the binomial series $(1+u)^{\\alpha}=\\sum_{n=0}^{\\infty}\\binom{\\alpha}{n}u^{n}$ to find the coefficient of $x^{${N}}$ in the Maclaurin series of $f(x)=${b.f(k)}$.`,
      choices: qch(key, [
        [binomQ(b.al, N), `The substitution is $u=${k}x$, so $u^{${N}}=(${k})^{${N}}x^{${N}}$; multiply the binomial coefficient by $(${k})^{${N}}$.`, 'chain-rule'],
        [qmul(falling, qpow(Q(k), N)), `$\\binom{\\alpha}{n}=\\frac{\\alpha(\\alpha-1)\\cdots(\\alpha-n+1)}{n!}$: the factors DECREASE by 1 each time; they are not all $\\alpha$.`, 'formula-confusion'],
        [qmul(binomQ(b.al, N), Q(k * N)), `Substitution gives $k^{${N}}$, not $k\\cdot${N}$.`, 'chain-rule'],
        [qneg(key), 'Recheck signs: each factor $(\\alpha-i)$ can be negative.', 'sign'],
      ]),
      hints: ['$u=' + k + 'x$, $\\alpha=' + qt(b.al) + '$.', '$\\binom{\\alpha}{n}=\\frac{\\alpha(\\alpha-1)\\cdots(\\alpha-n+1)}{n!}$.'],
      steps: [`$\\alpha=${qt(b.al)}$, $u=${k}x$.`, `$\\binom{\\alpha}{${N}}=${qt(binomQ(b.al, N))}$.`, `Coefficient $=\\binom{\\alpha}{${N}}\\cdot(${k})^{${N}}=${qt(key)}$.`],
      recall: 'Binomial series: falling factorial over $n!$, then raise the inner constant to the same power as $x$.',
    };
  },
});

// ---- G25: find the error in a Maclaurin-by-substitution derivation ----
G.push({
  id: 'gx-mac-error', unit: 'series', topic: TM, diff: 4,
  src: 'Exam 3 Q4 style "find the error": substitution slips -- constant not raised, factorial rewritten, exponent shift, radius confusion',
  make(r) {
    const nm = r.pick(['cos', 'exp']), k = r.pick([2, 3]), j = r.pick([2, 3]), m = r.pick([1, 2]);
    const kind = r.pick(['kpow', 'fact', 'mshift', 'radius', 'none']);
    const cs = nm === 'cos';
    const f = `${mpre(m)}${cs ? `\\cos(${k}${xpw(j)})` : `e^{${k}${xpw(j)}}`}`;
    const sgn = cs ? '(-1)^{n}' : '';
    const fa = cs ? '(2n)!' : 'n!', ex = cs ? `${2 * j}n` : `${j}n`, kp_ = cs ? `${k}^{2n}` : `${k}^{n}`;
    let body2 = `\\frac{${sgn}${kp_}x^{${ex}}}{${fa}}`;
    if (kind === 'kpow') body2 = `\\frac{${sgn}${k}\\,x^{${ex}}}{${fa}}`;
    if (kind === 'fact') body2 = `\\frac{${sgn}${kp_}x^{${ex}}}{(${cs ? 2 * j : j}n)!}`;
    const body3 = kind === 'mshift' ? `\\frac{${sgn}${kp_}x^{${m}(${ex})}}{${fa}}` : body2.replace(`x^{${ex}}`, `x^{${ex}+${m}}`);
    const lines = [
      `$${KNOWN[nm]}$ for all $u$`,
      `Put $u=${k}${xpw(j)}$: $${cs ? `\\cos(${k}${xpw(j)})` : `e^{${k}${xpw(j)}}`}=\\sum_{n=0}^{\\infty}${body2}$`,
      `Multiply by $${mpre(m)}$: $${f}=\\sum_{n=0}^{\\infty}${body3}$`,
      kind === 'radius' ? `Convergence: need $|${k}${xpw(j)}|<1$, so the series converges only for $|x|<${j === 2 ? `\\frac{1}{\\sqrt{${k}}}` : `\\frac{1}{\\sqrt[3]{${k}}}`}$` : 'Convergence: the base series converges for every $u$, so this one converges for all real $x$',
    ];
    const bad = { kpow: 2, fact: 2, mshift: 3, radius: 4, none: 0 }[kind];
    const why = {
      kpow: `$(${k}x^{${j}})^{${cs ? '2n' : 'n'}}=${kp_}x^{${ex}}$: the constant ${k} gets the same exponent as $x$.`,
      fact: `The factorial belongs to the BASE series ($${fa}$); substituting for $u$ changes the power of $x$, never the factorial.`,
      mshift: `Multiplying $x^{${ex}}$ by $x^{${m}}$ ADDS exponents: $x^{${ex}+${m}}$, not $x^{${m}(${ex})}$.`,
      radius: 'The base series converges for ALL $u$, so every substitution $u=g(x)$ converges for all $x$ (no ratio-test restriction).',
    }[kind];
    const choices = [1, 2, 3, 4].map(i => (i === bad ? { t: `Line ${i}`, ok: true, why } : { t: `Line ${i}`, why: kind === 'none' || i < bad || bad === 0 ? 'This line is correct.' : 'Possibly consistent with the earlier mistake, but the first error is above.' }));
    choices.push(bad === 0 ? { t: 'No error', ok: true, why: 'Every line is correct.' } : { t: 'No error', why: `There is an error: ${why}` });
    return {
      fmt: 'error', arch: 'mac-sub-error', chk: { k: 'sumterm', f: `x**${m}*${cs ? 'cos' : 'exp'}(${k}*x**${j})`, term: `${cs ? `(-1)**n*${k}**(2*n)*x**(${2 * j}*n+${m})/factorial(2*n)` : `${k}**n*x**(${j}*n+${m})/factorial(n)`}`, n0: 0 },
      prompt: `A student finds the Maclaurin series of $${f}$ as follows. Find the first line containing an error, or choose "No error".`,
      work: lines, choices,
      keyWhy: why || 'The derivation is correct.',
      hints: ['Substitute into the known series line by line and compare.'],
      steps: [`$u=${k}${xpw(j)}$ gives $u^{${cs ? '2n' : 'n'}}=${kp_}x^{${ex}}$.`, `Multiply by $${mpre(m)}$: exponent $${ex}+${m}$.`, `$${f}=\\sum_{n=0}^{\\infty}\\frac{${sgn}${kp_}x^{${ex}+${m}}}{${fa}}$, valid for all $x$.`],
      recall: 'Substitution changes powers of $x$ (and $k$); the factorial and signs of the base series stay; outside factors ADD to the exponent.',
    };
  },
});

// ---- G30: parity multi-select ----
const PAR = [
  ['\\sin x', 'odd', '$\\sin$ is odd: only odd powers.'], ['\\cos x', 'even', '$\\cos$ is even: only even powers.'],
  ['x\\cos x', 'odd', '$x$ (odd) times $\\cos$ (even) is odd.'], ['x^{2}\\sin x', 'odd', '$x^{2}$ even times $\\sin$ odd is odd: $x^3-\\frac{x^5}{6}+\\cdots$.'],
  ['x\\sin x', 'even', 'odd times odd is even: $x^2-\\frac{x^4}{6}+\\cdots$.'], ['e^{x}', 'neither', '$e^x$ has every power: $1+x+\\frac{x^2}{2}+\\cdots$.'],
  ['e^{-x^{2}}', 'even', 'Only $x^{2}$ appears inside: $1-x^2+\\frac{x^4}{2}-\\cdots$.'], ['x\\,e^{x^{2}}', 'odd', '$x\\cdot(1+x^2+\\cdots)=x+x^3+\\cdots$.'],
  ['\\arctan x', 'odd', 'Series $x-\\frac{x^3}{3}+\\cdots$ has only odd powers.'], ['\\ln(1+x)', 'neither', '$x-\\frac{x^2}{2}+\\frac{x^3}{3}-\\cdots$ has every power.'],
  ['\\dfrac{1}{1-x}', 'neither', '$1+x+x^2+\\cdots$ has every power.'], ['\\dfrac{1}{1-x^{2}}', 'even', '$1+x^2+x^4+\\cdots$.'],
  ['\\dfrac{\\sin x}{x}', 'even', '$1-\\frac{x^2}{6}+\\cdots$ (odd/odd).'], ['\\sin(x^{2})', 'even', '$x^2-\\frac{x^6}{6}+\\cdots$: only even powers.'],
  ['x^{3}\\cos x', 'odd', 'odd times even.'], ['x^{2}e^{x}', 'neither', '$x^2+x^3+\\frac{x^4}{2}+\\cdots$ has even and odd powers.'],
];
G.push({
  id: 'gx-parity-multi', unit: 'series', topic: TM, diff: 3,
  src: 'Taylor Series handout remark "is it even, odd, or neither -- why this matters for series"; select-all format',
  make(r) {
    const want = r.pick(['odd', 'even']);
    const pos = r.some(PAR.filter(p => p[1] === want), r.int(2, 3)), neg = r.some(PAR.filter(p => p[1] !== want), 6 - pos.length > 3 ? 3 : 6 - pos.length);
    const items = [...pos, ...neg];
    const W = want === 'odd' ? 'ODD' : 'EVEN';
    return {
      fmt: 'multi', arch: 'parity-multi', chk: { k: 'parity', want, items: items.map(i => [i[0], i[1]]) },
      prompt: `Select **all** functions whose Maclaurin series contain only ${W} powers of $x$ (constant term counts as an even power).`,
      choices: items.map(([t, par, why]) => ({ t: `$${t}$`, ok: par === want, why })),
      keyWhy: want === 'odd' ? 'An odd function ($f(-x)=-f(x)$) has only odd powers.' : 'An even function ($f(-x)=f(x)$) has only even powers.',
      hints: ['Check $f(-x)$: equal to $f(x)$ means even; equal to $-f(x)$ means odd.', 'Parity multiplies: odd$\\cdot$even = odd, odd$\\cdot$odd = even.'],
      steps: ['Decide the parity of each function, using parity of products.', 'Even functions $\\leftrightarrow$ even powers only; odd functions $\\leftrightarrow$ odd powers only; otherwise both appear.'],
      recall: 'Even function: only even powers. Odd function: only odd powers. Parity multiplies like signs.',
    };
  },
});

// ---- G33: identify the function from the first terms of its series ----
G.push({
  id: 'gx-identify-fn', unit: 'series', topic: TM, diff: 3,
  src: 'Exam 3 style: recognise a Maclaurin series (substitution into the table) from its first terms',
  make(r) {
    const f = pickFn(r, { m0: true }); if (f.nm === 'ln' && f.k < 0) f.k = -f.k;   // keep typed-answer domain checks valid
    const ft = n => firstTerms(f, n);
    const show = `$${poly(ft(3))}+\\cdots$`;
    const alts = [];
    for (const nm of Object.keys(FN)) if (nm !== f.nm) alts.push({ ...f, nm });
    alts.push({ ...f, k: -f.k }, { ...f, k: f.k === 1 ? 2 : f.k + 1 });
    const pool = alts.map(g => ({ t: `$${fTexOf(g)}$`, why: `The series for $${fTexOf(g)}$ begins $${poly(firstTerms(g, 3))}+\\cdots$, which does not match.`, err: 'formula-confusion' }));
    return {
      fmt: 'mc', arch: 'identify-series', chk: { k: 'ident', sym: symF(f), shown: poly(ft(3)) },
      prompt: `The first three nonzero terms of a Maclaurin series are ${show} Which function is it?`,
      choices: tch(`$${fTexOf(f)}$`, r.shuffle(pool)),
      hints: ['Look at the exponents and the pattern of signs and denominators.', 'Compare with the table: $e^u,\\sin u,\\cos u,\\frac1{1-u},\\ln(1+u),\\arctan u$.'],
      steps: [`Powers jump by ${f.j * (f.nm === 'sin' || f.nm === 'cos' || f.nm === 'atan' ? 2 : 1)}; the first term is $${poly(ft(1))}$.`, 'Match the coefficient pattern (factorials -> $e^u$/sin/cos; $1/n$ -> ln/arctan; all $1$ -> geometric).', `The function is $${fTexOf(f)}$.`],
      recall: 'Recognition: factorials mean $e,\\sin,\\cos$; plain $1/n$ means $\\ln,\\arctan$; all ones means geometric. Constants and powers inside show the substitution $u=kx^j$.',
    };
  },
});

// =====================================================================
// ADDITIONS: error bounds, alternating-series terms, integrals/limits/sums via series, claims
// =====================================================================
const ALT_TERMS = (p, t) => { let N = 1; while (!(Math.pow(N + 1, p) > t)) N++; return N; };

// ---- Lagrange / Taylor's inequality: bound, or smallest n ----
G.push({
  id: 'gx-lagrange-bound', unit: 'series', topic: TP, diff: 4,
  src: 'Exam 3 style: Taylor\'s inequality for sin/cos with |f^(n+1)| <= 1 -- error bound, or smallest n for a tolerance',
  make(r) {
    const fn = r.pick(['sin', 'cos']), a = r.pick([1, 2, 3]);
    if (r() < 0.5) {
      const n = r.pick([2, 3, 4, 5]), key = Q(a ** (n + 1), fact(n + 1));
      return {
        fmt: fmtOf(r), arch: 'lagrange-bound', chk: { k: 'lagr', fn, a, n, val: qs(key) },
        prompt: `Use Taylor's inequality to bound the error $|R_{${n}}(x)|$ when $T_{${n}}$ (centred at $0$) approximates $\\${fn} x$ for $|x|\\le ${a}$. Give the bound as a fraction.`,
        choices: qch(key, [
          [Q(a ** n, fact(n)), `Use the $(n+1)$st derivative: $\\frac{M|x|^{n+1}}{(n+1)!}$ with $n+1=${n + 1}$, not $${n}$.`, 'off-by-one'],
          [Q(a ** (n + 1), fact(n)), `The denominator is $(n+1)!=${n + 1}!$, not $${n}!$.`, 'off-by-one'],
          [Q(a ** (n + 1), fact(n + 2)), `The denominator is $(n+1)!=${n + 1}!$; $${n + 2}!$ is one too many.`, 'off-by-one'],
          [Q(a ** (n + 2), fact(n + 2)), `Exponent and factorial are both $n+1=${n + 1}$.`, 'off-by-one'],
        ]),
        hints: ['$|R_n(x)|\\le\\dfrac{M}{(n+1)!}|x|^{n+1}$ where $|f^{(n+1)}|\\le M$.', `Every derivative of $\\${fn}$ is $\\pm\\sin$ or $\\pm\\cos$, so $M=1$.`],
        steps: [`$|f^{(${n + 1})}(x)|\\le1$, so $M=1$.`, `$|R_{${n}}(x)|\\le\\dfrac{1\\cdot ${a}^{${n + 1}}}{${n + 1}!}=${qt(key)}$.`],
        recall: 'Taylor\'s inequality: $\\frac{M|x-a|^{n+1}}{(n+1)!}$ -- exponent and factorial both $n+1$, with $M$ a bound on the $(n+1)$st derivative.',
      };
    }
    const tolK = r.pick([2, 3, 4, 5]);
    let n = 0; while (!(a ** (n + 1) / fact(n + 1) < 10 ** -tolK)) n++;
    const wrong = [n - 1, n + 1, n + 2, n + 3].filter(v => v >= 1);
    return {
      fmt: 'mc', arch: 'lagrange-smallest-n', chk: { k: 'lagrN', a, tolK, n },
      prompt: `Using Taylor's inequality with $M=1$, what is the smallest degree $n$ for which the Maclaurin polynomial $T_n$ of $\\${fn} x$ is guaranteed to be within $10^{-${tolK}}$ of $\\${fn} x$ for $|x|\\le ${a}$?`,
      choices: tch(`$n=${n}$`, wrong.map(v => ({
        t: `$n=${v}$`,
        why: v < n ? `At $n=${v}$ the bound is $\\frac{${a}^{${v + 1}}}{${v + 1}!}=${(a ** (v + 1) / fact(v + 1)).toPrecision(2)}$, which is NOT below $10^{-${tolK}}$.` : `That works, but it is not the smallest: $n=${n}$ already gives a bound below $10^{-${tolK}}$.`,
        err: v < n ? 'off-by-one' : 'conceptual',
      }))),
      hints: [`Need $\\frac{${a}^{n+1}}{(n+1)!}<10^{-${tolK}}$.`, 'Tabulate the bound for increasing $n$ until it first drops below the tolerance.'],
      steps: [`Bound at degree $n$: $\\frac{${a}^{n+1}}{(n+1)!}$.`, `At $n=${n}$: ${(a ** (n + 1) / fact(n + 1)).toExponential(2)} $<10^{-${tolK}}$; at $n=${n - 1}$ it is ${(a ** n / fact(n)).toExponential(2)} (not small enough).`],
      recall: 'Smallest n: compute $\\frac{M|x|^{n+1}}{(n+1)!}$ for n = 1, 2, 3, ... until it first falls below the tolerance.',
    };
  },
});

// ---- alternating series: how many terms for a given accuracy ----
G.push({
  id: 'gx-alt-terms', unit: 'series', topic: 'Alternating Series & Error', diff: 3,
  src: 'Exam 2/3 style: Alternating Series Estimation Theorem, |R_N| <= b_{N+1}, find N',
  make(r) {
    const p = r.pick([2, 3]), t = r.pick([50, 100, 500, 1000]);
    const N = ALT_TERMS(p, t);
    const pool = [[N - 1, 'off-by-one'], [N + 1, 'off-by-one'], [t, 'conceptual'], [Math.ceil(t ** (1 / p)), 'off-by-one']].filter(([v], i, a) => v >= 1 && v !== N && a.findIndex(w => w[0] === v) === i);
    return {
      fmt: 'mc', arch: 'alt-terms', chk: { k: 'altN', p, t, N },
      prompt: `By the Alternating Series Estimation Theorem, how many terms of $\\displaystyle\\sum_{n=1}^{\\infty}\\frac{(-1)^{n+1}}{n^{${p}}}$ guarantee a partial sum within $\\frac{1}{${t}}$ of the exact sum (error strictly less than $\\frac1{${t}}$)?`,
      choices: tch(`$${N}$ terms`, pool.map(([v, err]) => ({
        t: `$${v}$ terms`,
        why: v < N ? `With ${v} terms, $b_{${v + 1}}=\\frac{1}{${(v + 1) ** p}}$, which is not below $\\frac1{${t}}$.` : v === N + 1 ? `That is enough but not the fewest: ${N} terms already give $b_{${N + 1}}=\\frac1{${(N + 1) ** p}}<\\frac1{${t}}$.` : `The first omitted term must satisfy $\\frac1{(N+1)^{${p}}}<\\frac1{${t}}$, i.e. $(N+1)^{${p}}>${t}$; solve for $N$ instead of reading off ${t}.`,
        err,
      }))),
      hints: ['$|R_N|\\le b_{N+1}$, the first omitted term.', `Solve $(N+1)^{${p}}>${t}$.`],
      steps: ['The error is at most the first omitted term: $|R_N|\\le b_{N+1}=\\frac{1}{(N+1)^{' + p + '}}$.', `Need $(N+1)^{${p}}>${t}$: $N+1=${N + 1}$ gives $${(N + 1) ** p}>${t}$ (while $N=${N - 1}$ gives $${N ** p}$, too small), so $N=${N}$.`],
      recall: 'Alternating error: $|R_N|\\le b_{N+1}$. Set $b_{N+1}<$ tolerance and solve for $N$ (the sum has $N$ terms).',
    };
  },
});

// ---- integral of a series: coefficient of x^(E+1) in the integral from 0 to x ----
G.push({
  id: 'gx-series-integral', unit: 'series', topic: 'Applications of Series', diff: 4,
  src: 'Exam 3 style: integrate a Maclaurin series term by term (e.g. the series for the integral of e^{-t^2})',
  make(r) {
    const f = pickFn(r, { names: ['exp', 'sin', 'cos', 'atan', 'geo'] }), es = evals(f.nm, 6);
    const e = r.pick(es.slice(0, 3)), E = f.m + f.j * e, c = fcoef(f.nm, f.k, f.j, e), key = qmul(c, Q(1, E + 1));
    return {
      fmt: fmtOf(r), arch: 'series-integral', chk: { k: 'integ', ...CHK_F(f), E, val: qs(key) },
      prompt: `Integrate the Maclaurin series of $f(t)=${fTexOf(f).replace(/\bx\b/g, 't').replace(/x\^/g, 't^')}$ term by term. What is the coefficient of $x^{${E + 1}}$ in the series for $\\displaystyle\\int_0^x f(t)\\,dt$?`,
      choices: qch(key, [
        [c, `That is the coefficient of $t^{${E}}$ in $f$ itself. Integrating $t^{${E}}$ divides by the new exponent ${E + 1}.`, 'dropped-factor'],
        [qmul(c, Q(1, E)), `Divide by the NEW exponent $${E + 1}$, not the old one $${E}$.`, 'off-by-one'],
        [qmul(c, Q(E + 1)), 'Integration divides by the new exponent; it does not multiply.', 'inverted'],
        [qmul(c, Q(1, E + 2)), `Integrating $t^{${E}}$ gives $\\frac{x^{${E + 1}}}{${E + 1}}$, so divide by $${E + 1}$.`, 'off-by-one'],
      ]),
      hints: [`First find the coefficient of $t^{${E}}$ in $f$.`, '$\\int_0^x t^{m}\\,dt=\\frac{x^{m+1}}{m+1}$.'],
      steps: [`Coefficient of $t^{${E}}$ in $f$: $${qt(c)}$.`, `Integrate: $${qt(c)}\\cdot\\frac{x^{${E + 1}}}{${E + 1}}$, coefficient $${qt(key)}$.`],
      recall: 'Term-by-term integration: coefficient of $x^{m+1}$ is (coefficient of $x^m$)$/(m+1)$.',
    };
  },
});

// ---- limit via Maclaurin series ----
G.push({
  id: 'gx-series-limit', unit: 'series', topic: 'Applications of Series', diff: 4,
  src: 'Exam 3 style: evaluate a limit at 0 by replacing the function with its Maclaurin series',
  make(r) {
    const f = { ...pickFn(r, { m0: true, names: ['exp', 'cos', 'ln'] }), j: 1 }, ft = firstTerms(f, 4);
    const t = r.pick([1, 2].filter(v => ft[v][1] <= 2)), key = ft[t][0], p = ft[t][1];
    const sub = ft.slice(0, t), subTex = poly(sub);
    return {
      fmt: fmtOf(r), arch: 'series-limit', chk: { k: 'lim', sym: symF(f), sub: sub.map(([q, e]) => `(${qs(q)})*x**${e}`).join('+'), p, val: qs(key) },
      prompt: `Use Maclaurin series to evaluate $\\displaystyle\\lim_{x\\to0}\\frac{${fTexOf(f)}-\\left(${subTex}\\right)}{x^{${p}}}$.`,
      choices: qch(key, [
        [ft[t - 1][0], `That is the coefficient of the term you subtracted. The limit is the coefficient of the first term that survives, $x^{${p}}$.`, 'conceptual'],
        [ft[t + 1][0], `That is the next term ($x^{${ft[t + 1][1]}}$): it vanishes in the limit because the numerator is already of order $x^{${p}}$.`, 'off-by-one'],
        [qneg(key), 'Sign slip: recheck the sign pattern of the base series.', 'sign'],
        [Q(0), 'The numerator is NOT $o(x^' + p + ')$: after the subtraction the leading term is $c\\,x^{' + p + '}$ with $c\\ne0$.', 'conceptual'],
      ]),
      hints: [`Expand ${'$' + fTexOf(f) + '$'} to a few terms and cancel what is subtracted.`, `Divide by $x^{${p}}$ and let $x\\to0$: only the $x^{${p}}$ coefficient survives.`],
      steps: [`$${fTexOf(f)}=${poly(ft)}+\\cdots$.`, `Subtract $${subTex}$: the numerator is $${tt(key, p, true)}+\\cdots$ (higher powers).`, `Divide by $x^{${p}}$: the limit is $${qt(key)}$.`],
      recall: 'Series limits: expand to just past the order of the denominator, cancel, divide, and take the surviving coefficient.',
    };
  },
});

// ---- recognise a sum as a value of a known function ----
G.push({
  id: 'gx-sum-recognize', unit: 'series', topic: 'Applications of Series', diff: 4,
  src: 'Exam 3 style: find the exact sum of a numerical series by recognising a Maclaurin series',
  make(r) {
    const kind = r.pick(['exp', 'cos', 'ln', 'atan']);
    let tex, key, val, term, n0, wrong;
    if (kind === 'exp') {
      const k = r.pick([2, 3, -1, -2]);
      tex = `\\sum_{n=0}^{\\infty}\\frac{${k < 0 ? `(${k})` : k}^{n}}{n!}`; key = `e^{${k}}`; val = `exp(${k})`; term = `(${k})**n/factorial(n)`; n0 = 0;
      wrong = [[`e^{${-k}}`, 'sign'], [`${k}e`, 'chain-rule'], [`e^{${k + 1}}`, 'off-by-one'], [`\\frac{1}{1-${k}}`, 'formula-confusion']];
    } else if (kind === 'cos') {
      const d = r.pick([3, 4, 6]), sv = { 3: '\\frac12', 4: '\\frac{\\sqrt2}{2}', 6: '\\frac{\\sqrt3}{2}' }, ov = { 3: '\\frac{\\sqrt3}{2}', 4: '\\frac{\\sqrt2}{2}', 6: '\\frac12' };
      tex = `\\sum_{n=0}^{\\infty}\\frac{(-1)^{n}\\pi^{2n}}{${d}^{2n}(2n)!}`; key = sv[d]; val = `cos(pi/${d})`; term = `(-1)**n*pi**(2*n)/(${d}**(2*n)*factorial(2*n))`; n0 = 0;
      wrong = [[ov[d], 'formula-confusion'], ['1', 'conceptual'], [`\\frac{\\pi}{${d}}`, 'conceptual'], ['0', 'conceptual']];
      if (d === 4) wrong[0] = ['-\\frac{\\sqrt2}{2}', 'sign'];
    } else if (kind === 'ln') {
      const b = r.pick([2, 3, 4]);
      tex = `\\sum_{n=1}^{\\infty}\\frac{(-1)^{n+1}}{n\\,${b}^{n}}`; key = `\\ln\\frac{${b + 1}}{${b}}`; val = `log(1+1/${b})`; term = `(-1)**(n+1)/(n*${b}**n)`; n0 = 1;
      wrong = [[`\\ln\\frac{${b}}{${b + 1}}`, 'inverted'], [`\\ln ${b}`, 'conceptual'], [`\\ln\\frac{${b - 1}}{${b}}`, 'sign'], [`\\frac{1}{${b}}`, 'dropped-factor']];
    } else {
      const b = r.pick([2, 3]);
      tex = `\\sum_{n=0}^{\\infty}\\frac{(-1)^{n}}{(2n+1)\\,${b}^{2n+1}}`; key = `\\arctan\\frac1{${b}}`; val = `atan(1/${b})`; term = `(-1)**n/((2*n+1)*${b}**(2*n+1))`; n0 = 0;
      wrong = [[`\\arctan ${b}`, 'inverted'], [`\\ln\\frac{${b + 1}}{${b}}`, 'formula-confusion'], [`\\frac1{${b}}`, 'dropped-factor'], [`\\arctan\\frac1{${b + 1}}`, 'off-by-one']];
    }
    return {
      fmt: 'mc', arch: 'sum-recognize', chk: { k: 'sumval', term, n0, val },
      prompt: `Find the exact sum: $\\displaystyle${tex}$.`,
      choices: tch(`$${key}$`, wrong.map(([t, err]) => ({ t: `$${t}$`, why: 'Substitute the specific value into the Maclaurin series and compare term by term; that value does not reproduce this series.', err }))),
      hints: ['Match the pattern of signs, factorials/denominators and powers against the table.', 'Find the value of $x$ (or $u$) that makes the general term agree.'],
      steps: [{ exp: 'This is $e^{u}=\\sum\\frac{u^n}{n!}$ with $u$ read off from the numerators.', cos: 'This is $\\cos u=\\sum(-1)^n\\frac{u^{2n}}{(2n)!}$ with $u=\\pi/d$.', ln: 'This is $\\ln(1+u)=\\sum(-1)^{n+1}\\frac{u^n}{n}$ with $u=1/b$.', atan: 'This is $\\arctan u=\\sum(-1)^n\\frac{u^{2n+1}}{2n+1}$ with $u=1/b$.' }[kind], `The sum is $${key}$.`],
      recall: 'Series sums: identify the base series from its pattern, read off the substituted value, evaluate the function there.',
    };
  },
});

// ---- true/false claims about power & Taylor series (multi + tf) ----
function claimPool(r) {
  const k = r.pick([2, 3]), n = r.int(2, 5);
  return [
    { t: 'A power series centred at $a$ always converges at $x=a$.', ok: true, why: 'At $x=a$ every term after the constant vanishes.' },
    { t: 'If a power series has radius $R$, it converges for every $x$ with $|x-a|<R$.', ok: true, why: 'That is the definition of the radius of convergence.' },
    { t: `The Maclaurin series of $e^{${k}x}$ converges for every real $x$.`, ok: true, why: 'Ratio Test: $\\frac{k}{n+1}\\to0$, so $R=\\infty$.' },
    { t: `The Maclaurin series of $\\dfrac{1}{1-${k}x}$ has radius $\\dfrac1{${k}}$.`, ok: true, why: `It is geometric with ratio $${k}x$, so $|${k}x|<1$.` },
    { t: 'Differentiating a power series term by term does not change its radius of convergence.', ok: true, why: 'Term-by-term differentiation/integration preserves $R$.' },
    { t: 'Differentiating a power series term by term never changes its interval of convergence.', ok: false, why: 'The radius is preserved, but endpoints can be gained or lost.' },
    { t: 'The Taylor series of every infinitely differentiable function converges to the function.', ok: false, why: 'False: e.g. $e^{-1/x^2}$ (with $f(0)=0$) has Taylor series $0$.' },
    { t: `The Maclaurin series of $\\sin(${k}x)$ contains only even powers of $x$.`, ok: false, why: '$\\sin$ is odd, so only odd powers appear.' },
    { t: 'The Maclaurin series of $\\ln(1+x)$ has radius of convergence $\\infty$.', ok: false, why: 'Its radius is $1$ (singularity at $x=-1$).' },
    { t: `The coefficient of $x^{${n}}$ in a Maclaurin series equals $f^{(${n})}(0)$.`, ok: false, why: `It equals $\\frac{f^{(${n})}(0)}{${n}!}$.` },
    { t: 'If the Ratio Test limit is $L<1$ at an endpoint, the series converges there.', ok: false, why: 'At an endpoint the Ratio Test limit is always $1$ (inconclusive).' },
  ];
}
G.push({
  id: 'gx-claims-multi', unit: 'checkins', topic: CL, diff: 3,
  src: 'Check-in style: select-all true claims about power series and Taylor series',
  make(r) {
    const pool = claimPool(r), nT = r.int(2, 3);
    const items = r.shuffle([...r.shuffle(pool.filter(c => c.ok)).slice(0, nT), ...r.shuffle(pool.filter(c => !c.ok)).slice(0, 5 - nT)]);
    return {
      fmt: 'multi', arch: 'claims-multi', chk: { k: 'claims', items: items.map(c => [c.t, c.ok]) },
      prompt: 'Select **all** true statements.',
      choices: items.map(c => ({ t: c.t, ok: c.ok, why: c.why })),
      keyWhy: 'Radius is preserved by differentiation and integration; endpoints and convergence-to-$f$ are not guaranteed.',
      hints: ['Test each statement against a standard example.'],
      steps: ['Judge each claim separately; for each false one, recall the counterexample or the correct statement.'],
      recall: 'Power series facts: always converge at the centre; $R$ survives calculus; Taylor series need not equal $f$.',
    };
  },
});
G.push({
  id: 'gx-claims-tf', unit: 'checkins', topic: CL, diff: 3,
  src: 'Check-in style: true/false claim about power series and Taylor series',
  make(r) {
    const c = r.pick(claimPool(r));
    return {
      fmt: 'mc', tf: true, arch: 'claims-tf', chk: { k: 'claims', items: [[c.t, c.ok]] },
      prompt: `**True or false?** ${c.t}`,
      choices: [{ t: 'True', ok: c.ok, why: c.ok ? undefined : c.why }, { t: 'False', ok: !c.ok, why: c.ok ? c.why : undefined }],
      keyWhy: c.why,
      hints: ['Think of the standard example or counterexample.'],
      steps: [c.why],
      recall: 'Power series facts: always converge at the centre; $R$ survives calculus; Taylor series need not equal $f$.',
    };
  },
});

// =====================================================================
// MORE "find the error" + "select all" generators (exam-3 student slips)
// =====================================================================
/** Build an error item: lines = student work, bad = 1-based first wrong line (0 = no error). */
function errItem({ arch, chk, prompt, lines, bad, why, steps, recall, hints }) {
  const choices = lines.map((_, i) => ({ t: `Line ${i + 1}`, ...(i + 1 === bad ? { ok: true, why } : { why: bad && i + 1 > bad ? 'Follows from the line above; the first mistake is earlier.' : 'This line is correct.' }) }));
  choices.push(bad ? { t: 'No error', why: `There is an error: ${why}` } : { t: 'No error', ok: true, why: 'Every line is correct.' });
  return { fmt: 'error', arch, chk, prompt: `${prompt} Find the first line containing an error, or choose "No error".`, work: lines, choices, keyWhy: bad ? why : 'The work is correct.', hints: hints || ['Redo the problem yourself and compare line by line.'], steps, recall };
}
const pos = q => qt(q);

// ---- E3: Taylor polynomial at a centre (missing n!, wrong centre powers) ----
G.push({
  id: 'gx-taylor-error', unit: 'series', topic: TM, diff: 4,
  src: 'Exam 3 style "find the error": Taylor polynomial slips -- dropped n!, powers of x instead of (x-a)',
  make(r) {
    const fam = r.pick([
      { f: '\\ln x', a: 1, c: [Q(0), Q(1), Q(-1, 2), Q(1, 3)], py: 'log(x)' },
      { f: '\\dfrac1x', a: 2, c: [Q(1, 2), Q(-1, 4), Q(1, 8), Q(-1, 16)], py: '1/x' },
      { f: '\\sqrt{x}', a: 4, c: [Q(2), Q(1, 4), Q(-1, 64), Q(1, 512)], py: 'sqrt(x)' },
    ]);
    const kind = r.pick(['nofact', 'centerpow', 'none', 'nofact', 'centerpow']);
    const X = `(x-${fam.a})`;
    const d = fam.c.map((q, n) => qmul(q, Q(fact(n))));
    const nz = arr => arr.map((q, n) => [q, n]).filter(t => t[0][0] !== 0);
    const l1 = `$f(${fam.a})=${pos(d[0])},\\ f'(${fam.a})=${pos(d[1])},\\ f''(${fam.a})=${pos(d[2])},\\ f'''(${fam.a})=${pos(d[3])}$`;
    const term = (q, n, den, B) => (q[0] === 0 ? null : `${den ? `\\dfrac{${pos(q)}}{${n}!}` : `(${pos(q)})`}${n === 0 ? '' : n === 1 ? B : `${B}^{${n}}`}`);
    const join = ts => ts.filter(Boolean).join('+');
    const l2 = kind === 'nofact' ? `$T_3(x)=${join(d.map((q, n) => term(q, n, false, X)))}$`
      : kind === 'centerpow' ? `$T_3(x)=${join(d.map((q, n) => term(q, n, true, 'x')))}$`
      : `$T_3(x)=${join(d.map((q, n) => term(q, n, true, X)))}$`;
    const l3 = `$T_3(x)=${poly(nz(kind === 'nofact' ? d : fam.c), kind === 'centerpow' ? 'x' : X)}$`;
    const bad = kind === 'none' ? 0 : 2;
    const why = kind === 'nofact' ? 'Each Taylor term is $\\frac{f^{(n)}(a)}{n!}(x-a)^n$: the student left out the $n!$.' : 'The powers must be of $(x-a)$, not $x$: $\\frac{f^{(n)}(a)}{n!}(x-a)^n$.';
    return errItem({
      arch: 'taylor-error', chk: { k: 'taylorE', py: fam.py, a: fam.a, c: fam.c.map(qs), kind },
      prompt: `A student finds the degree-3 Taylor polynomial of $f(x)=${fam.f}$ centred at $x=${fam.a}$.`,
      lines: [l1, l2, l3], bad, why,
      steps: [l1, `$T_3(x)=\\sum_{n=0}^{3}\\frac{f^{(n)}(${fam.a})}{n!}(x-${fam.a})^n$`, `$T_3(x)=${poly(nz(fam.c), X)}$`],
      recall: 'Taylor term: $\\frac{f^{(n)}(a)}{n!}(x-a)^n$ -- divide by $n!$ and use powers of $(x-a)$.',
    });
  },
});

// ---- E4: Taylor's inequality with the wrong M / wrong factorial ----
G.push({
  id: 'gx-lagrange-error', unit: 'series', topic: TP, diff: 4,
  src: 'Exam 3 style "find the error": Taylor\'s inequality -- M taken at the wrong point, n! instead of (n+1)!',
  make(r) {
    const n = r.int(2, 4), kind = r.pick(['M1', 'factn', 'none', 'M1', 'factn']);
    const v = kind === 'M1' ? Q(1, fact(n + 1)) : kind === 'factn' ? Q(3, fact(n)) : Q(3, fact(n + 1));
    const l1 = `$|R_{${n}}(x)|\\le\\dfrac{M}{${n + 1}!}\\,|x|^{${n + 1}}$, where $|f^{(${n + 1})}(t)|\\le M$ for $|t|\\le1$`;
    const l2 = kind === 'M1' ? `$f^{(${n + 1})}(t)=e^{t}$; on $[-1,1]$ its largest value is at $t=0$, where it equals $1$, so take $M=1$`
      : `$f^{(${n + 1})}(t)=e^{t}$; on $[-1,1]$ its largest value is at $t=1$, where $e<3$, so take $M=3$`;
    const l3 = kind === 'M1' ? `$|R_{${n}}(x)|\\le\\dfrac{1}{${n + 1}!}=${pos(v)}$` : kind === 'factn' ? `$|R_{${n}}(x)|\\le\\dfrac{3}{${n}!}=${pos(v)}$` : `$|R_{${n}}(x)|\\le\\dfrac{3}{${n + 1}!}=${pos(v)}$`;
    const bad = kind === 'M1' ? 2 : kind === 'factn' ? 3 : 0;
    const why = kind === 'M1' ? '$e^{t}$ is INCREASING, so its maximum on $[-1,1]$ is at $t=1$ ($e$), not at $t=0$. Using $M=1$ underestimates the bound.' : 'The denominator is $(n+1)!$ -- the factorial of the derivative order used for $M$ -- not $n!$.';
    return errItem({
      arch: 'lagrange-error', chk: { k: 'lagrE', n, kind, val: qs(Q(3, fact(n + 1))) },
      prompt: `A student bounds the error of the degree-${n} Maclaurin polynomial of $e^{x}$ for $|x|\\le1$ with Taylor's inequality.`,
      lines: [l1, l2, l3], bad, why,
      steps: [`$|f^{(${n + 1})}|=e^{t}\\le e<3$ on $[-1,1]$, so $M=3$.`, `$|R_{${n}}|\\le\\frac{3}{${n + 1}!}=${pos(Q(3, fact(n + 1)))}$.`],
      recall: 'Taylor\'s inequality: $|R_n|\\le\\frac{M}{(n+1)!}|x-a|^{n+1}$ with $M$ bounding $|f^{(n+1)}|$ on the whole interval.',
    });
  },
});

// ---- E5: Alternating Series Estimation Theorem -- wrong omitted term ----
G.push({
  id: 'gx-ast-error', unit: 'series', topic: 'Alternating Series & Error', diff: 3,
  src: 'Exam 3 style "find the error": AST error bound -- last used term, skipped term, arithmetic slip',
  make(r) {
    const p = r.pick([2, 3]), N = r.int(3, 6), kind = r.pick(['last', 'skip', 'arith', 'none', 'last']);
    const idx = kind === 'last' ? N : kind === 'skip' ? N + 2 : N + 1;
    const b = m => Q(1, m ** p);
    const l1 = `$b_n=\\dfrac1{n^{${p}}}$ is positive, decreasing, and tends to $0$, so the Alternating Series Test applies`;
    const l2 = `$|S-S_{${N}}|\\le b_{${idx}}$`;
    const l3 = kind === 'arith' ? `$b_{${N + 1}}=\\dfrac{1}{${N + 1}\\cdot${p}}=${pos(Q(1, (N + 1) * p))}$` : `$b_{${idx}}=\\dfrac1{${idx}^{${p}}}=${pos(b(idx))}$`;
    const bad = { last: 2, skip: 2, arith: 3, none: 0 }[kind];
    const why = { last: `The theorem bounds the error by the FIRST OMITTED term $b_{${N + 1}}$. The last used term $b_{${N}}$ is a valid but much weaker bound, not the one the theorem gives.`, skip: `The first omitted term is $b_{${N + 1}}$, not $b_{${N + 2}}$; skipping one term gives a bound the error can exceed.`, arith: `$n^{${p}}$ means $n$ raised to ${p}, not $n\\cdot${p}$: $b_{${N + 1}}=\\frac1{${(N + 1) ** p}}$.` }[kind];
    return errItem({
      arch: 'ast-error', chk: { k: 'astE', p, N, kind, val: qs(b(N + 1)) },
      prompt: `A student approximates $S=\\sum_{n=1}^{\\infty}\\frac{(-1)^{n+1}}{n^{${p}}}$ by $S_{${N}}$, the sum of the first ${N} terms, and uses the Alternating Series Estimation Theorem to bound the error.`,
      lines: [l1, l2, l3], bad, why,
      steps: [`Terms used: $n=1,\\dots,${N}$; first omitted: $n=${N + 1}$.`, `$|S-S_{${N}}|\\le b_{${N + 1}}=\\frac1{${N + 1}^{${p}}}=${pos(b(N + 1))}$.`],
      recall: 'AST: after $N$ terms the error is at most the first omitted term $b_{N+1}$.',
    });
  },
});

// ---- E6: Ratio Test algebra slips ----
G.push({
  id: 'gx-ratio-error', unit: 'series', topic: SER, diff: 4,
  src: 'Exam 3 style "find the error": Ratio Test algebra -- (n+1)!/n!, squared power, centre ignored',
  make(r) {
    const fam = r.pick(['fact', 'sq', 'center']), kind = r.pick(['bad', 'bad', 'none']);
    let S, lines, bad, why, steps, chk;
    if (fam === 'fact') {
      const b = r.pick([2, 3, 4]);
      S = `\\sum_{n=0}^{\\infty}\\frac{n!\\,x^{n}}{${b}^{n}}`;
      const good = [`$\\left|\\dfrac{t_{n+1}}{t_n}\\right|=\\dfrac{(n+1)!\\,|x|^{n+1}}{${b}^{n+1}}\\cdot\\dfrac{${b}^{n}}{n!\\,|x|^{n}}=\\dfrac{(n+1)|x|}{${b}}$`, 'As $n\\to\\infty$ this tends to $\\infty$ for every $x\\ne0$, so the ratio is below $1$ only at $x=0$', '$R=0$: the series converges only at $x=0$'];
      const wrong = [`$\\left|\\dfrac{t_{n+1}}{t_n}\\right|=\\dfrac{(n+1)!\\,|x|^{n+1}}{${b}^{n+1}}\\cdot\\dfrac{${b}^{n}}{n!\\,|x|^{n}}=\\dfrac{|x|}{${b}}$`, `The limit is $\\frac{|x|}{${b}}<1$, so $|x|<${b}$`, `$R=${b}$`];
      lines = kind === 'bad' ? wrong : good; bad = kind === 'bad' ? 1 : 0;
      why = '$\\frac{(n+1)!}{n!}=n+1$, not $1$. The extra factor $n+1$ makes the ratio blow up.'; steps = [good[0], good[1], good[2]]; chk = { k: 'ratioE', fam, b };
    } else if (fam === 'sq') {
      const b = r.pick([2, 3, 5]);
      S = `\\sum_{n=0}^{\\infty}\\frac{x^{2n}}{${b}^{n}}`;
      const l1 = `$\\left|\\dfrac{t_{n+1}}{t_n}\\right|=\\dfrac{|x|^{2n+2}}{${b}^{n+1}}\\cdot\\dfrac{${b}^{n}}{|x|^{2n}}=\\dfrac{x^{2}}{${b}}$`;
      const good = [l1, `$\\dfrac{x^{2}}{${b}}<1\\ \\Rightarrow\\ |x|<\\sqrt{${b}}$`, `$R=\\sqrt{${b}}$`];
      const wrong = [l1, `$\\dfrac{x^{2}}{${b}}<1\\ \\Rightarrow\\ |x|<\\dfrac{${b}}{2}$`, `$R=\\dfrac{${b}}{2}$`];
      lines = kind === 'bad' ? wrong : good; bad = kind === 'bad' ? 2 : 0;
      why = `$x^{2}<${b}$ gives $|x|<\\sqrt{${b}}$ (take the square root of both sides), not $${b}/2$.`; steps = good; chk = { k: 'ratioE', fam, b };
    } else {
      const b = r.pick([2, 3, 5]), c = r.pick([2, 3, 4, -1, -2]);
      S = `\\sum_{n=1}^{\\infty}\\frac{${xc(c)}^{n}}{n\\,${b}^{n}}`;
      const l1 = `$\\left|\\dfrac{t_{n+1}}{t_n}\\right|=\\dfrac{n}{n+1}\\cdot\\dfrac{|x${c < 0 ? '+' : '-'}${Math.abs(c)}|}{${b}}$`;
      const l2 = `As $n\\to\\infty$ the limit is $\\dfrac{|x${c < 0 ? '+' : '-'}${Math.abs(c)}|}{${b}}<1$, so $R=${b}$`;
      const good = [l1, l2, `The series converges for $${c - b}<x<${c + b}$`];
      const wrong = [l1, l2, `The series converges for $-${b}<x<${b}$`];
      lines = kind === 'bad' ? wrong : good; bad = kind === 'bad' ? 3 : 0;
      why = `The interval is centred at $x=${c}$, not $0$: $${c}-${b}<x<${c}+${b}$ (that is, $${c - b}<x<${c + b}$).`; steps = good; chk = { k: 'ratioE', fam, b, c };
    }
    return errItem({
      arch: 'ratio-error', chk, prompt: `A student applies the Ratio Test to $${S}$ to find where it converges (endpoints aside).`,
      lines, bad, why, steps, recall: 'Ratio Test: simplify the ratio carefully ($(n+1)!/n!=n+1$, $x^{2n}$ gives $x^2$), then solve $L<1$ about the centre.',
    });
  },
});

// ---- E7: geometric-series substitution ----
G.push({
  id: 'gx-geo-error', unit: 'series', topic: SER, diff: 4,
  src: 'Exam 3 style "find the error": rewriting 1/(b+cx^j) as a geometric series -- sign of r, lost 1/b, radius of x^j',
  make(r) {
    const kind = r.pick(['sign', 'bconst', 'radius', 'none']);
    const b = r.pick([3, 5, 6]), c = r.pick([1, 2]), j = kind === 'radius' ? r.pick([2, 3]) : r.pick([1, 2, 3]);
    const cx = `${c === 1 ? '' : c}${xpw(j)}`, rr = `\\dfrac{${c}}{${b}}${xpw(j)}`;
    const Rq = qt(Q(b, c)), Rt = j === 1 ? Rq : `\\sqrt[${j}]{${Rq}}`;
    const f = `\\dfrac{1}{${b}+${cx}}`;
    const l1 = `$${f}=\\dfrac1{${b}}\\cdot\\dfrac{1}{1-\\left(${kind === 'sign' ? '' : '-'}${rr}\\right)}$`;
    const sg = kind === 'sign' ? '' : '-';
    const l2 = `$=\\sum_{n=0}^{\\infty}${kind === 'bconst' ? '' : `\\dfrac1{${b}}`}\\left(${sg}\\dfrac{${c}}{${b}}\\right)^{n}x^{${j === 1 ? '' : j}n}$`;
    const l3 = `Converges when $\\left|${rr}\\right|<1$, i.e. $R=${kind === 'radius' ? Rq : Rt}$`;
    const bad = { sign: 1, bconst: 2, radius: 3, none: 0 }[kind];
    const why = { sign: `$b+cx^j=b\\left(1-\\left(-\\frac{c}{b}x^{j}\\right)\\right)$: the ratio is $r=-\\frac{${c}}{${b}}${xpw(j)}$, with a MINUS sign (match $1-r$).`, bconst: `The factor $\\frac1{${b}}$ pulled out in line 1 must stay in front of the sum.`, radius: `$|x|^{${j}}<${Rq}$ means $|x|<\\sqrt[${j}]{${Rq}}$; taking the ${j === 2 ? 'square' : 'cube'} root is required.` }[kind];
    return errItem({
      arch: 'geo-sub-error', chk: { k: 'geoE', b, c, j, kind },
      prompt: `A student writes $${f}$ as a power series and finds its radius of convergence.`,
      lines: [l1, l2, l3], bad, why,
      steps: [`$${f}=\\frac1{${b}}\\cdot\\frac1{1-r}$ with $r=-${rr}$.`, `$=\\sum_{n=0}^{\\infty}\\frac1{${b}}\\left(-\\frac{${c}}{${b}}\\right)^{n}x^{${j === 1 ? '' : j}n}$`, `$|r|<1\\Rightarrow R=${Rt}$.`],
      recall: 'Geometric rewrite: factor so the denominator is $1-r$; then $\\frac{1}{1-r}=\\sum r^n$ and $|r|<1$.',
    });
  },
});

// ---- E8: summing a series by recognising e^u ----
G.push({
  id: 'gx-sum-error', unit: 'series', topic: AP, diff: 3,
  src: 'Exam 3 style "find the error": sum of a series from e^u -- value of u, terms missing from the start',
  make(r) {
    const k = r.pick([2, 3]), kind = r.pick(['start', 'sign', 'none']);
    const s = kind === 'sign' ? -1 : kind === 'start' ? 1 : r.pick([1, -1]);
    const n0 = kind === 'sign' ? 0 : kind === 'start' ? r.pick([1, 2]) : r.pick([0, 1, 2]);
    const U = s * k, Uw = kind === 'sign' ? k : U;
    const tail = m => (m === 0 ? '' : m === 1 ? '-1' : `-1${U >= 0 ? '-' + U : '+' + (-U)}`);
    const S = `\\sum_{n=${n0}}^{\\infty}\\frac{${s < 0 ? '(-1)^{n}' : ''}${k}^{n}}{n!}`;
    const l1 = '$e^{u}=\\sum_{n=0}^{\\infty}\\dfrac{u^{n}}{n!}$';
    const l2b = `Here $u=${Uw}$${s < 0 ? ` (since $(-1)^{n}${k}^{n}=(-${k})^{n}$)` : ''}`;
    const l3k = kind === 'start' ? `$${S}=e^{${U}}$` : `$${S}=e^{${Uw}}${tail(n0)}$`;
    const bad = { start: 3, sign: 2, none: 0 }[kind];
    const goodVal = `e^{${U}}${tail(n0)}`;
    const why = kind === 'start' ? `The sum starts at $n=${n0}$, so the ${n0 === 1 ? 'term $1$' : 'terms $1$ and $u$'} of $e^{u}$ must be subtracted: $${goodVal}$.` : `$(-1)^{n}${k}^{n}=(-${k})^{n}$, so $u=-${k}$, not $${k}$.`;
    return errItem({
      arch: 'sum-error', chk: { k: 'sumE', k0: k, s, n0, kind, val: goodVal },
      prompt: `A student finds the exact sum of $${S}$.`,
      lines: [l1, l2b, l3k], bad, why,
      steps: [l1, `$u=${U}$`, `$${S}=${goodVal}$`],
      recall: 'Match to $e^u$: identify $u$ from $(\\pm k)^n$, then subtract the terms $n<n_0$ that the sum skips.',
    });
  },
});

// ---- M4: select-all about interval of convergence of sum (x-c)^n/(n^p b^n) ----
G.push({
  id: 'gx-ioc-claims-multi', unit: 'series', topic: SER, diff: 4,
  src: 'Exam 3 style: select all true statements about a given power series',
  make(r) {
    const p = r.pick([1, 2]), b = r.pick([2, 3, 4]), c = r.pick([0, 1, 2, -1, 3]);
    const Lx = c - b, Rx = c + b;
    const S = `\\sum_{n=1}^{\\infty}\\frac{${xc(c)}^{n}}{n^{${p}}\\,${b}^{n}}`;
    const pool = [
      { t: `The radius of convergence is $${b}$.`, ok: true, why: `Ratio Test: $|x${c < 0 ? '+' : '-'}${Math.abs(c)}|/${b}<1$ gives $R=${b}$.` },
      { t: `The radius of convergence is $${b + 1}$.`, ok: false, why: `The ratio test limit is $|x-c|/${b}$, so $R=${b}$.` },
      { t: `The series converges at $x=${c}$.`, ok: true, why: 'Every power series converges at its centre.' },
      { t: `The series converges at $x=${Rx + 1}$.`, ok: false, why: `$x=${Rx + 1}$ is outside $|x-c|<${b}$ (past the right endpoint), so the series diverges there.` },
      { t: `The series converges at $x=${Rx}$.`, ok: p === 2, why: p === 2 ? `At $x=${Rx}$ it is $\\sum\\frac1{n^2}$, a convergent $p$-series.` : `At $x=${Rx}$ it is the harmonic series $\\sum\\frac1n$, which diverges.` },
      { t: `The series converges absolutely at $x=${Lx}$.`, ok: p === 2, why: p === 2 ? `$\\sum\\left|\\frac{(-1)^n}{n^2}\\right|=\\sum\\frac1{n^2}$ converges.` : `$\\sum\\left|\\frac{(-1)^n}{n}\\right|$ is the harmonic series: it diverges, so the convergence at $x=${Lx}$ is only conditional.` },
      { t: `The series converges conditionally at $x=${Lx}$.`, ok: p === 1, why: p === 1 ? 'The alternating harmonic series converges by the AST but not absolutely.' : 'It converges absolutely ($p=2>1$), so it is not merely conditional.' },
    ];
    let items;
    do { items = r.shuffle(pool).slice(0, 5); } while (items.filter(i => i.ok).length < 2 || !items.some(i => !i.ok));
    return {
      fmt: 'multi', arch: 'ioc-claims-multi', chk: { k: 'iocC', b, c, p, items: items.map(i => [i.t, i.ok]) },
      prompt: `Consider $${S}$. Select **all** true statements.`,
      choices: items.map(i => ({ t: i.t, ok: i.ok, why: i.why })),
      keyWhy: `$R=${b}$; the endpoints are $x=${Lx}$ (alternating) and $x=${Rx}$ (${p === 1 ? 'harmonic, diverges' : '$p=2$, converges'}).`,
      hints: ['Find R with the Ratio Test, then substitute each endpoint.'],
      steps: [`$R=${b}$, so the open interval is $(${Lx},${Rx})$.`, `Left endpoint: $\\sum\\frac{(-1)^n}{n^{${p}}}$ ${p === 1 ? 'converges conditionally' : 'converges absolutely'}.`, `Right endpoint: $\\sum\\frac1{n^{${p}}}$ ${p === 1 ? 'diverges' : 'converges'}.`],
      recall: 'Ratio Test gives R; endpoints are tested separately with AST / p-series.',
    };
  },
});

// ---- M5: select-all about Taylor polynomials of a named function ----
G.push({
  id: 'gx-taylor-claims-multi', unit: 'series', topic: TM, diff: 3,
  src: 'Exam 3 style: select all true statements about the Maclaurin series of a named function',
  make(r) {
    const fams = {
      '\\sin x': [
        ['The Maclaurin series contains only odd powers of $x$.', true, '$\\sin$ is odd.'],
        ['The coefficient of $x^{5}$ is $\\frac1{120}$.', true, '$\\frac{(-1)^2}{5!}=\\frac1{120}$.'],
        ['$f^{(5)}(0)=\\frac1{120}$.', false, 'The coefficient is $\\frac{f^{(5)}(0)}{5!}=\\frac1{120}$, so $f^{(5)}(0)=1$.'],
        ['$T_3(x)=T_4(x)$.', true, 'There is no $x^4$ term, so $T_4=T_3=x-\\frac{x^3}6$.'],
        ['The radius of convergence is $1$.', false, 'The Ratio Test gives $R=\\infty$.'],
        ['$T_2(x)=x-\\frac{x^{2}}{2}$.', false, 'There is no $x^2$ term: $T_2(x)=x$.'],
        ['$|R_n(x)|\\le\\frac{|x|^{n+1}}{(n+1)!}$ for every $x$.', true, 'Every derivative of $\\sin$ is bounded by $M=1$.'],
      ],
      '\\cos x': [
        ['The Maclaurin series contains only even powers of $x$.', true, '$\\cos$ is even.'],
        ['The coefficient of $x^{4}$ is $\\frac1{24}$.', true, '$\\frac{(-1)^2}{4!}=\\frac1{24}$.'],
        ['$f^{(4)}(0)=\\frac1{24}$.', false, '$f^{(4)}(0)=\\cos0=1$; the coefficient divides by $4!$.'],
        ['$T_2(x)=T_3(x)$.', true, 'There is no $x^3$ term.'],
        ['The series has a nonzero $x^{3}$ term.', false, 'Odd powers vanish for an even function.'],
        ['The radius of convergence is $1$.', false, 'The Ratio Test gives $R=\\infty$.'],
        ['$T_2(x)=1-\\frac{x^{2}}{2}$.', true, '$f(0)=1,\\ f\'(0)=0,\\ f\'\'(0)=-1$.'],
      ],
      '\\ln(1+x)': [
        ['The radius of convergence is $1$.', true, 'The singularity at $x=-1$ limits $R$ to $1$.'],
        ['The series converges at $x=1$.', true, 'It is the alternating harmonic series (AST).'],
        ['The series converges at $x=-1$.', false, 'At $x=-1$ it is $-\\sum\\frac1n$, the harmonic series: diverges.'],
        ['The coefficient of $x^{3}$ is $\\frac13$.', true, '$\\frac{(-1)^{3+1}}{3}=\\frac13$.'],
        ['The coefficient of $x^{3}$ is $\\frac{1}{6}$.', false, 'The coefficient is $\\frac{f\'\'\'(0)}{3!}=\\frac{2}{6}=\\frac13$.'],
        ['$T_2(x)=x-\\frac{x^{2}}{2}$.', true, '$f(0)=0,\\ f\'(0)=1,\\ f\'\'(0)=-1$.'],
        ['The radius of convergence is $\\infty$.', false, '$R=1$.'],
      ],
    };
    const nm = r.pick(Object.keys(fams)), pool = fams[nm].map(([t, ok, why]) => ({ t, ok, why }));
    let items;
    do { items = r.shuffle(pool).slice(0, 5); } while (items.filter(i => i.ok).length < 2 || items.filter(i => !i.ok).length < 1);
    return {
      fmt: 'multi', arch: 'taylor-claims-multi', chk: { k: 'tayC', f: nm, items: items.map(i => [i.t, i.ok]) },
      prompt: `Let $f(x)=${nm}$. Select **all** true statements about its Maclaurin series.`,
      choices: items.map(i => ({ t: i.t, ok: i.ok, why: i.why })),
      keyWhy: 'Check each statement against $c_n=\\frac{f^{(n)}(0)}{n!}$ and the known radius.',
      hints: ['Write the first few terms of the series, then test each claim.'],
      steps: ['Write out the series and compare each claim with its terms, coefficients and radius.'],
      recall: 'Coefficient $=f^{(n)}(0)/n!$; parity decides which powers appear; use the known radius.',
    };
  },
});

// ---- M6: select-all about error bounds ----
G.push({
  id: 'gx-errbound-multi', unit: 'series', topic: TP, diff: 4,
  src: 'Exam 3 style: select all true statements about the Alternating Series Estimation Theorem and Taylor\'s inequality',
  make(r) {
    const pool = [
      ['The Alternating Series Estimation Theorem bounds the error by the first omitted term.', true, 'After $N$ terms, $|S-S_N|\\le b_{N+1}$.'],
      ['The Alternating Series Estimation Theorem bounds the error by the last term used.', false, 'It is the first OMITTED term $b_{N+1}$.'],
      ['The Alternating Series Estimation Theorem needs $b_n$ decreasing and tending to $0$.', true, 'These are the hypotheses of the Alternating Series Test.'],
      ['The Alternating Series Estimation Theorem applies to every convergent series.', false, 'It requires an alternating series with decreasing terms.'],
      ['In Taylor\'s inequality, $M$ bounds $|f^{(n+1)}|$ on the interval.', true, 'The remainder involves the $(n+1)$st derivative.'],
      ['In Taylor\'s inequality, $M$ bounds $|f^{(n)}|$ on the interval.', false, 'It is the $(n+1)$st derivative.'],
      ['For $\\sin x$ or $\\cos x$, $M=1$ works on every interval.', true, 'Every derivative is $\\pm\\sin$ or $\\pm\\cos$, bounded by $1$.'],
      ['For $e^{x}$ on $[0,1]$ one may take $M=1$.', false, '$e^{x}$ reaches $e>1$ at $x=1$; take $M=e$ (or $3$).'],
      ['Taylor\'s inequality gives the exact error $|R_n(x)|$.', false, 'It gives an upper bound only.'],
      ['If $|R_n(x)|\\to0$ as $n\\to\\infty$, the Taylor series converges to $f(x)$.', true, 'That is the criterion for $f$ to equal its Taylor series.'],
    ].map(([t, ok, why]) => ({ t, ok, why }));
    let items;
    do { items = r.shuffle(pool).slice(0, 5); } while (items.filter(i => i.ok).length < 2 || items.filter(i => !i.ok).length < 1);
    return {
      fmt: 'multi', arch: 'errbound-multi', chk: { k: 'errC', items: items.map(i => [i.t, i.ok]) },
      prompt: 'Select **all** true statements about error bounds for series.',
      choices: items.map(i => ({ t: i.t, ok: i.ok, why: i.why })),
      keyWhy: 'AST: first omitted term. Taylor: $M$ bounds the $(n+1)$st derivative; the result is a bound, not the exact error.',
      hints: ['Recall the exact hypothesis and conclusion of each theorem.'],
      steps: ['Judge each statement against the theorem statement it refers to.'],
      recall: 'AST: $|R_N|\\le b_{N+1}$. Taylor: $|R_n|\\le\\frac{M}{(n+1)!}|x-a|^{n+1}$, $M\\ge|f^{(n+1)}|$.',
    };
  },
});

// =====================================================================
// STATIC ITEMS
// =====================================================================
const SP = (id, topic, diff, arch, src, prompt, key, wrongs, steps, recall, extra = {}) => P.push({
  id, topic, unit: 'series', diff, arch, exam: true, src, prompt,
  choices: [{ t: key, ok: true }, ...wrongs.map(([t, why, err]) => ({ t, why, err }))], steps, recall, ...extra,
});
SP('x-t-mac-ex2', TM, 2, 'known-series-sub', 'Exam 3 style: substitution into a known series',
  'Find the coefficient of $x^{6}$ in the Maclaurin series of $e^{x^{2}}$.', '$\\dfrac16$',
  [['$\\dfrac1{720}$', 'That is $\\frac1{6!}$; the exponent $6$ comes from $x^{2e}$ with $e=3$, so the coefficient is $\\frac1{3!}$.', 'setup'], ['$\\dfrac12$', 'That is the $x^4$ coefficient ($e=2$).', 'off-by-one'], ['$1$', 'That is the $x^2$ coefficient ($e=1$).', 'off-by-one']],
  ['$e^{u}=\\sum\\frac{u^n}{n!}$ with $u=x^2$ gives $\\sum\\frac{x^{2n}}{n!}$.', '$2n=6\\Rightarrow n=3$, coefficient $\\frac1{3!}=\\frac16$.'], 'Substitute first, then match the exponent to find n.');
SP('x-t-ioc-ex', SER, 3, 'ioc', 'Exam 3 style: interval of convergence',
  'Find the interval of convergence of $\\displaystyle\\sum_{n=1}^{\\infty}\\frac{(x-3)^{n}}{n\\,2^{n}}$.', '$[1,5)$',
  [['$(1,5)$', 'At $x=1$ the series is $\\sum\\frac{(-1)^n}{n}$, which converges (AST): include $1$.', 'endpoint'], ['$[1,5]$', 'At $x=5$ the series is $\\sum\\frac1n$, the harmonic series: diverges.', 'endpoint'], ['$(1,5]$', 'Reversed: $x=1$ converges, $x=5$ diverges.', 'endpoint']],
  ['Ratio Test: $\\frac{|x-3|}{2}<1$, so $R=2$, interval $(1,5)$.', '$x=5$: harmonic, diverges. $x=1$: alternating harmonic, converges.'], 'Test both endpoints separately.');
SP('x-t-taylor-sqrt', TP, 3, 'taylor-from-scratch', 'Exam 3 style: Taylor polynomial at a nonzero centre',
  'Find the degree-2 Taylor polynomial of $f(x)=\\sqrt{x}$ centred at $x=4$.', '$2+\\dfrac{x-4}{4}-\\dfrac{(x-4)^{2}}{64}$',
  [['$2+\\dfrac{x-4}{4}-\\dfrac{(x-4)^{2}}{32}$', '$f\'\'(4)=-\\frac1{32}$; divide by $2!$ to get $-\\frac1{64}$.', 'dropped-factor'], ['$2+\\dfrac{x-4}{2}-\\dfrac{(x-4)^{2}}{64}$', '$f\'(x)=\\frac1{2\\sqrt x}$, so $f\'(4)=\\frac14$.', 'algebra-slip'], ['$2+\\dfrac{x-4}{4}+\\dfrac{(x-4)^{2}}{64}$', '$f\'\'(x)=-\\frac14x^{-3/2}<0$: the quadratic term is negative.', 'sign']],
  ['$f(4)=2$, $f\'(4)=\\frac14$, $f\'\'(4)=-\\frac14\\cdot\\frac18=-\\frac1{32}$.', '$T_2=2+\\frac14(x-4)-\\frac{1}{64}(x-4)^2$.'], 'Evaluate derivatives at the centre, divide f\'\' by 2!.');
SP('x-t-sum-ln2', 'Applications of Series', 2, 'sum-recognize', 'Exam 3 style: recognise a sum',
  'Find the exact sum $\\displaystyle\\sum_{n=1}^{\\infty}\\frac{(-1)^{n+1}}{n}$.', '$\\ln 2$',
  [['$\\ln\\frac12$', 'Sign: $\\ln(1+1)=\\ln2>0$.', 'sign'], ['$1$', 'The first term is $1$, but the later terms change the sum.', 'conceptual'], ['$\\dfrac{\\pi}{4}$', 'That is the $\\arctan1$ series (odd denominators).', 'formula-confusion']],
  ['$\\ln(1+u)=\\sum(-1)^{n+1}\\frac{u^n}{n}$ at $u=1$.', 'Sum $=\\ln2$ (the series converges at $u=1$).'], 'Match to the table, then evaluate at the right u.');
SP('x-t-limit-sin', 'Applications of Series', 3, 'series-limit', 'Exam 3 style: limit by series',
  'Evaluate $\\displaystyle\\lim_{x\\to0}\\frac{x-\\sin x}{x^{3}}$.', '$\\dfrac16$',
  [['$0$', 'The numerator is of order $x^3$, not smaller.', 'conceptual'], ['$-\\dfrac16$', '$x-\\sin x=\\frac{x^3}{6}-\\cdots$ is positive.', 'sign'], ['$\\dfrac1{120}$', 'That is the next coefficient, $\\frac{1}{5!}$.', 'off-by-one']],
  ['$\\sin x=x-\\frac{x^3}{6}+\\frac{x^5}{120}-\\cdots$.', '$x-\\sin x=\\frac{x^3}{6}-\\cdots$, divide by $x^3$.'], 'Expand just past the order of the denominator.');
SP('x-t-lagrange-e', TP, 4, 'lagrange-bound', 'Exam 3 style: Taylor\'s inequality',
  'Use Taylor\'s inequality (with $e<3$) to bound $|R_{3}(x)|$ for $T_3$ of $e^{x}$ at $0$ when $|x|\\le1$.', '$\\dfrac18$',
  [['$\\dfrac1{24}$', 'Remember $M$: the fourth derivative of $e^x$ is bounded by $e<3$ on $[-1,1]$, not by $1$.', 'conceptual'], ['$\\dfrac{3}{6}$', 'The factorial is $(n+1)!=4!=24$, not $3!$.', 'off-by-one'], ['$\\dfrac{3}{120}$', 'The factorial is $4!$, not $5!$.', 'off-by-one']],
  ['$|f^{(4)}(x)|=e^{x}\\le e<3$, so $M=3$.', '$|R_3|\\le\\frac{3}{4!}\\cdot1^4=\\frac18$.'], 'M bounds the (n+1)st derivative on the interval.');
SP('x-t-alt-err', 'Alternating Series & Error', 3, 'alt-terms', 'Exam 2 style: alternating error',
  'If $\\displaystyle\\sum_{n=1}^{\\infty}\\frac{(-1)^{n+1}}{n^{2}}$ is approximated by its first $3$ terms, which bound on the error does the Alternating Series Estimation Theorem give?', '$\\dfrac1{16}$',
  [['$\\dfrac19$', 'That is $b_3$, the last term used; the bound is the first omitted term $b_4$.', 'off-by-one'], ['$\\dfrac1{25}$', 'That is $b_5$; the first omitted term after 3 terms is $b_4$.', 'off-by-one'], ['$\\dfrac1{4}$', 'That is $b_2$.', 'off-by-one']],
  ['$|R_3|\\le b_4=\\frac1{4^2}=\\frac1{16}$.'], 'Error is at most the first omitted term.');
SP('x-t-integral-gauss', 'Applications of Series', 4, 'series-integral', 'Exam 3 style: integral by series',
  'Using the first three nonzero terms of the Maclaurin series of $e^{-x^{2}}$, approximate $\\displaystyle\\int_0^1e^{-x^{2}}\\,dx$.', '$\\dfrac{23}{30}$',
  [['$\\dfrac{37}{30}$', 'The terms alternate: $1-\\frac13+\\frac1{10}$, not $1+\\frac13+\\frac1{10}$.', 'sign'], ['$\\dfrac{13}{15}$', 'The $x^4$ coefficient is $\\frac1{2!}=\\frac12$, so its integral is $\\frac1{10}$, not $\\frac15$.', 'dropped-factor'], ['$\\dfrac{2}{3}$', 'That uses only two terms; add the $x^4/2$ term.', 'conceptual']],
  ['$e^{-x^2}=1-x^2+\\frac{x^4}{2}-\\cdots$.', '$\\int_0^1=1-\\frac13+\\frac1{10}=\\frac{23}{30}$.'], 'Integrate term by term; divide by the new exponent.');
P.push({
  id: 'x-t-tf-converge', topic: CL, unit: 'checkins', diff: 3, fmt: 'mc', tf: true, arch: 'claims-tf', exam: true,
  src: 'Check-in style: convergence at one point forces convergence at nearer points',
  prompt: '**True or false?** If $\\sum c_nx^{n}$ converges at $x=-2$, then it converges at $x=1$.',
  choices: [{ t: 'True', ok: true }, { t: 'False', why: 'Convergence at $|x|=2$ means $R\\ge2$, so every $|x|<2$ is inside the interval of convergence.', err: 'conceptual' }],
  steps: ['Convergence at $x=-2$ implies $R\\ge2$.', '$|1|<2$, so the series converges at $x=1$.'], recall: 'Convergence at one point gives convergence at every point closer to the centre.',
});
SP('x-t-binomial-ex', TM, 3, 'binomial-series', 'Exam 3 style: binomial series',
  'Find the coefficient of $x^{2}$ in the Maclaurin series of $\\sqrt{1+x}$.', '$-\\dfrac18$',
  [['$\\dfrac18$', '$\\binom{1/2}{2}=\\frac{(1/2)(-1/2)}{2}<0$.', 'sign'], ['$-\\dfrac14$', 'Divide by $2!$: $\\binom{1/2}{2}=\\frac{(1/2)(-1/2)}{2}=-\\frac18$.', 'dropped-factor'], ['$\\dfrac12$', 'That is the coefficient of $x$.', 'off-by-one']],
  ['$\\binom{1/2}{2}=\\frac{\\frac12\\cdot(-\\frac12)}{2!}=-\\frac18$.'], 'Binomial coefficient: falling product over n!.');

export const xtaylor = { unit: 'series', problems: P, generators: G };
