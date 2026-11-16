// bank/x_misc.js — exam-variety pack (run mix). Owner: see .hnic/context/mix-contract.md
// Polar/parametric (Final) + thin topics. Every generator picks among several templates.
import { frac, choose, gcd, sgn } from '../util.js';
const P = [];
const G = [];
const R = String.raw;
const CHK = globalThis.__XCHK;                    // dev harness hook: attach independent numeric check
const m = s => `$${s}$`;
const PI = Math.PI;
const simp = (f, a, b, n = 4000) => { const h = (b - a) / n; let s = f(a) + f(b); for (let i = 1; i < n; i++) s += f(a + i * h) * (i % 2 ? 4 : 2); return s * h / 3; };
/** n*pi/d in TeX, reduced */
const pif = (n, d = 1) => {
  if (n === 0) return '0';
  const g = gcd(n, d); n /= g; d /= g;
  const num = `${Math.abs(n) === 1 ? '' : Math.abs(n)}\\pi`;
  return (n < 0 ? '-' : '') + (d === 1 ? num : `\\frac{${num}}{${d}}`);
};
/** (N/D)*sqrt(s) in TeX */
const rad = (N, D, s) => {
  if (N === 0) return '0';
  const g = gcd(N, D); N /= g; D /= g;
  const body = s === 1 ? `${Math.abs(N)}` : `${Math.abs(N) === 1 ? '' : Math.abs(N)}\\sqrt{${s}}`;
  return (N < 0 ? '-' : '') + (D === 1 ? body : `\\frac{${body}}{${D}}`);
};
const nz = (n, body) => (n === 1 ? body : `${n}${body}`);
const B = (key, wrongs) => [{ t: m(key), ok: true }, ...choose(m(key), wrongs.map(([t, why, err]) => ({ t: m(t), why, err })))];
/** standard single-answer item */
const Q = o => {
  const q = { prompt: o.q, choices: B(o.k, o.w), steps: o.s, recall: o.r, hints: o.h || o.s.slice(0, 2), arch: o.a, diff: o.d ?? 3 };
  if (o.f) q.fmt = o.f;
  if (CHK && o.c) q.chk = o.c;
  return q;
};
const gen = (id, unit, topic, diff, make) => G.push({ id, unit, topic, diff, make });
const SRC = 'Standard Calc II technique (no course source found)';

// =================================================================
// POLAR COORDINATES
// =================================================================
const BASE = [[1, 6, [1, 2, 3], [1, 2, 1]], [1, 4, [1, 2, 2], [1, 2, 2]], [1, 3, [1, 2, 1], [1, 2, 3]]];   // a=n/d·π, cos, sin as [N,D,radicand]
const quadAngle = (n, d, qd) => [[n, d], [d - n, d], [d + n, d], [2 * d - n, d]][qd];

gen('g-x-pol2rect', 'polar', 'Polar Coordinates', 2, r => {
  const [n, d, c, s] = r.pick(BASE), qd = r.int(0, 3), neg = r.int(0, 3) === 0, rr = r.pick([2, 3, 4, 5, 6]);
  const [tn, td] = quadAngle(n, d, qd);
  const sx = qd === 1 || qd === 2 ? -1 : 1, sy = qd >= 2 ? -1 : 1, rs = neg ? -rr : rr;
  const X = rad(rs * sx * c[0], c[1], c[2]), Y = rad(rs * sy * s[0], s[1], s[2]);
  const pt = (a, b) => `(${a},${b})`;
  const ax = rad(rr * c[0], c[1], c[2]), ay = rad(rr * s[0], s[1], s[2]);
  return Q({
    q: `Convert the polar point ${m(R`(${rs},\ ${pif(tn, td)})`)} to rectangular coordinates.`, a: 'pol2rect', d: 2,
    k: pt(X, Y), src: SRC,
    w: [
      [pt(Y, X), 'Swapped: $x=r\\cos\\theta$ goes first and $y=r\\sin\\theta$ second.', 'swap'],
      [pt(rad(-rs * sx * c[0], c[1], c[2]), Y), 'Sign slip on $x$: check the sign of $\\cos\\theta$ in this quadrant and of $r$.', 'sign'],
      [pt(rad(rs * sx * c[0], c[1], c[2]).replace(/^-/, ''), rad(rs * sy * s[0], s[1], s[2]).replace(/^-/, '')), 'Magnitudes only: the quadrant (and a negative $r$) decide the signs.', 'quadrant'],
      [pt(rad(sx * c[0], c[1], c[2]), rad(sy * s[0], s[1], s[2])), 'That is $(\\cos\\theta,\\sin\\theta)$: you forgot to multiply by $r$.', 'forgot-r'],
      [pt(rad(-rs * sx * c[0], c[1], c[2]), rad(-rs * sy * s[0], s[1], s[2])), neg ? 'You ignored that $r$ is negative: the point sits on the opposite side of the origin.' : 'Reflected through the origin: that is the point for $-r$.', 'neg-r'],
    ],
    s: [`$x=r\\cos\\theta=${rs}\\cos\\left(${pif(tn, td)}\\right)=${X}$.`, `$y=r\\sin\\theta=${rs}\\sin\\left(${pif(tn, td)}\\right)=${Y}$.`, `Point: ${m(pt(X, Y))}.`],
    r: '$x=r\\cos\\theta,\\ y=r\\sin\\theta$ — a negative $r$ flips both coordinates.',
  });
});

gen('g-x-rect2pol', 'polar', 'Polar Coordinates', 3, r => {
  const bs = r.pick([{ x: [1, 1], y: [1, 1], rr: mm => rad(mm, 1, 2), r2: mm => 2 * mm * mm, a: [1, 4] }, { x: [1, 1], y: [1, 3], rr: mm => `${2 * mm}`, r2: mm => 4 * mm * mm, a: [1, 3] }, { x: [1, 3], y: [1, 1], rr: mm => `${2 * mm}`, r2: mm => 4 * mm * mm, a: [1, 6] }]);
  const qd = r.int(0, 3), mm = r.int(1, 4), sx = qd === 1 || qd === 2 ? -1 : 1, sy = qd >= 2 ? -1 : 1;
  const [tn, td] = quadAngle(bs.a[0], bs.a[1], qd);
  const rt = bs.rr(mm), pt = (a, b) => `(${a},${b})`;
  const ref = qd === 1 || qd === 3 ? -bs.a[0] : bs.a[0];
  return Q({
    q: `Convert the rectangular point ${m(pt(rad(sx * mm * bs.x[0], 1, bs.x[1]), rad(sy * mm * bs.y[0], 1, bs.y[1])))} to polar coordinates ${m('(r,\\theta)')} with $r>0$ and $0\\le\\theta<2\\pi$.`,
    a: 'rect2pol', d: 3, k: pt(rt, pif(tn, td)), src: SRC,
    w: [
      [pt(rt, pif(ref, bs.a[1])), 'This is $\\arctan(y/x)$ straight off the calculator: it lands in the wrong quadrant. Check the signs of $x$ and $y$.', 'quadrant'],
      [pt(rt, pif(tn + td, td)), 'Off by $\\pi$: that ray points into the opposite quadrant.', 'quadrant'],
      [pt(`-${rt}`, pif(tn, td)), 'The problem demands $r>0$; and $-r$ at this angle is the opposite point anyway.', 'neg-r'],
      [pt(`${bs.r2(mm)}`, pif(tn, td)), 'You gave $r^2=x^2+y^2$ instead of $r=\\sqrt{x^2+y^2}$.', 'r-squared'],
    ],
    s: [`$r=\\sqrt{x^2+y^2}=${rt}$.`, `Reference angle from $|y|/|x|$: $${pif(bs.a[0], bs.a[1])}$.`, `Quadrant ${['I', 'II', 'III', 'IV'][qd]}, so $\\theta=${pif(tn, td)}$.`],
    r: 'Find $r$ with Pythagoras, then place $\\theta$ by looking at the quadrant, not just $\\arctan(y/x)$.',
  });
});

gen('g-x-polar-eqconv', 'polar', 'Polar Coordinates', 3, r => {
  const a = r.int(2, 6), t = r.int(0, 7);
  const T = [
    [`Convert to a rectangular equation: ${m(R`r=${a}\cos\theta`)}.`, R`x^2+y^2=${a}x`, [[R`(x-${a})^2+y^2=${a * a}`, 'That circle has centre $(a,0)$; here the centre is $(a/2,0)$.', 'center'], [R`x^2+y^2=${a * a}`, 'That is $r=a$. Multiply $r=a\\cos\\theta$ by $r$ first.', 'skip-r'], [R`x^2+y^2=${a}y`, 'Swapped $\\cos\\theta=x/r$ with $\\sin\\theta=y/r$.', 'swap'], [R`x=${a}`, 'That is $r=a\\sec\\theta$.', 'secant']], 'Multiply by $r$: $r^2=a\\,r\\cos\\theta$, then $r^2=x^2+y^2$, $r\\cos\\theta=x$.'],
    [`Convert to a rectangular equation: ${m(R`r=${a}\sin\theta`)}.`, R`x^2+y^2=${a}y`, [[R`x^2+y^2=${a}x`, 'Swapped sine and cosine.', 'swap'], [R`y=${a}`, 'That is $r=a\\csc\\theta$.', 'cosecant'], [R`x^2+y^2=${a * a}`, 'Multiply by $r$ first to turn $\\sin\\theta$ into $y/r$.', 'skip-r'], [R`x^2+(y-${a})^2=${a * a}`, 'Centre is $(0,a/2)$ and radius $a/2$.', 'center']], 'Multiply by $r$: $r^2=a\\,r\\sin\\theta$ gives $x^2+y^2=ay$.'],
    [`Convert to a rectangular equation: ${m(R`r=${a}\sec\theta`)}.`, `x=${a}`, [[`y=${a}`, 'That would be $r=a\\csc\\theta$.', 'swap'], [R`x^2+y^2=${a * a}`, 'That is $r=a$, a circle.', 'circle'], [R`y=${a}x`, 'That is $\\theta=\\arctan a$.', 'line'], [R`x=\frac{1}{${a}}`, 'Reciprocal slip: $r\\cos\\theta=a$ gives $x=a$.', 'inverted']], '$r=a\\sec\\theta\\Rightarrow r\\cos\\theta=a\\Rightarrow x=a$.'],
    [`Convert to a rectangular equation: ${m(R`r=${a}\csc\theta`)}.`, `y=${a}`, [[`x=${a}`, 'That would be $r=a\\sec\\theta$.', 'swap'], [R`x^2+y^2=${a * a}`, 'That is $r=a$.', 'circle'], [R`y=${a}x`, 'That is a line through the origin.', 'line'], [R`y=\frac{1}{${a}}`, 'Reciprocal slip.', 'inverted']], '$r=a\\csc\\theta\\Rightarrow r\\sin\\theta=a\\Rightarrow y=a$.'],
    [`Convert to a polar equation: ${m(R`x^2+y^2=${a}x`)}.`, R`r=${a}\cos\theta`, [[R`r=${a}\sin\theta`, 'The right side is $x$, which is $r\\cos\\theta$, not $r\\sin\\theta$.', 'swap'], [R`r=${a * a}\cos\theta`, 'You squared the coefficient: divide both sides by $r$, do not square.', 'square'], [`r=${a}`, 'That would need $x^2+y^2=a^2$.', 'circle'], [R`r=\sqrt{${a}}\cos\theta`, 'You took a root of $a$: $r^2=a\\,r\\cos\\theta$ simplifies to $r=a\\cos\\theta$.', 'root']], 'Substitute $x^2+y^2=r^2$ and $x=r\\cos\\theta$, then divide by $r$.'],
    [`Convert to a polar equation: ${m(R`x^2+y^2=${a * a}`)}.`, `r=${a}`, [[`r=${a * a}`, 'The $r^2=a^2$ equation gives $r=a$, not $r=a^2$.', 'square'], [R`r=\sqrt{${a}}`, 'Square root taken twice.', 'root'], [R`r=${a}\cos\theta`, 'That is a circle through the origin, not centred there.', 'circle'], [R`\theta=${a}`, 'That is a ray, not a circle.', 'line']], '$x^2+y^2=r^2$, so $r^2=a^2$ and $r=a$.'],
    [`Convert to a polar equation: ${m(`x=${a}`)}.`, R`r=${a}\sec\theta`, [[R`r=${a}\csc\theta`, 'Sine and cosine swapped.', 'swap'], [R`r=${a}\cos\theta`, 'Divide by $\\cos\\theta$, do not multiply.', 'inverted'], [`r=${a}`, 'That is a circle.', 'circle'], [R`r=\frac{1}{${a}}\sec\theta`, 'Reciprocal slip.', 'inverted']], '$x=r\\cos\\theta=a\\Rightarrow r=a\\sec\\theta$.'],
    [`Convert to a polar equation: ${m(`y=${a}`)}.`, R`r=${a}\csc\theta`, [[R`r=${a}\sec\theta`, 'That is $x=a$.', 'swap'], [R`r=${a}\sin\theta`, 'Divide by $\\sin\\theta$, do not multiply.', 'inverted'], [`r=${a}`, 'That is a circle.', 'circle'], [R`r=\frac{1}{${a}}\csc\theta`, 'Reciprocal slip.', 'inverted']], '$y=r\\sin\\theta=a\\Rightarrow r=a\\csc\\theta$.'],
  ][t];
  return Q({ q: T[0], a: 'polar-eqconv', d: 3, k: T[1], w: T[2], s: [T[3], 'Check with one point: pick an easy $\\theta$ and compare both forms.'], r: 'Dictionary: $x=r\\cos\\theta,\\ y=r\\sin\\theta,\\ x^2+y^2=r^2$. Multiply by $r$ to make $\\cos\\theta,\\sin\\theta$ appear as $x,y$.', src: SRC });
});

gen('g-x-polar-petals', 'polar', 'Polar Coordinates', 2, r => {
  const n = r.int(2, 7), a = r.int(2, 5), fn = r.pick(['\\cos', '\\sin']), key = n % 2 ? n : 2 * n, alt = n % 2 ? 2 * n : n;
  return Q({
    q: `How many petals does the rose ${m(R`r=${a}${fn}(${n}\theta)`)} have?`, a: 'rose-petals', d: 2, f: 'free', k: `${key}`, src: SRC,
    w: [[`${alt}`, n % 2 ? 'The $2n$ rule is for EVEN $n$. For odd $n$ the curve retraces itself, leaving $n$ petals.' : 'For even $n$ the loops do not overlap: there are $2n$ petals.', 'petal-rule'], [`${n + 1}`, 'There is no "$n+1$" rule: odd $n$ gives $n$, even $n$ gives $2n$.', 'petal-rule'], [`${a}`, 'The coefficient $a$ sets petal length, not the count.', 'coef'], [`${2 * n + 1}`, 'No such rule.', 'petal-rule'], [`${4 * n}`, 'Too many: even $n$ doubles once, not twice.', 'petal-rule']],
    s: [`Coefficient of $\\theta$ is $n=${n}$ (${n % 2 ? 'odd' : 'even'}).`, 'Odd $n$: $n$ petals. Even $n$: $2n$ petals.', `Answer: $${key}$.`],
    r: 'Rose $r=a\\cos n\\theta$ or $a\\sin n\\theta$: $n$ petals if $n$ odd, $2n$ if $n$ even. $|a|$ is the petal length.',
    c: () => key,
  });
});

gen('g-x-polar-equiv', 'polar', 'Polar Coordinates', 3, r => {
  const rr = r.int(2, 5), [n, d] = r.pick([[1, 6], [1, 4], [1, 3], [2, 3], [3, 4], [5, 6]]);
  const pt = (rv, N, D) => m(R`(${rv},\ ${pif(N, D)})`);
  const oks = r.some([
    [pt(rr, n + 2 * d, d), 'Adding $2\\pi$ is one full turn: same ray, same $r$.'],
    [pt(-rr, n + d, d), 'A negative $r$ walks backwards: ray $\\theta+\\pi$ reversed is ray $\\theta$.'],
    [pt(-rr, n - d, d), 'Ray $\\theta-\\pi$ reversed with $r<0$ is ray $\\theta$.'],
    [pt(rr, n - 2 * d, d), 'Subtracting $2\\pi$ is a full turn backwards: same point.'],
  ], 3);
  const nos = r.some([
    [pt(-rr, n, d), 'Same ray but $r$ negative: that is the point reflected through the origin.'],
    [pt(rr, n + d, d), 'Adding only $\\pi$ turns you around, so you land at the opposite point.'],
    [pt(rr, -n, d), 'Negating the angle reflects across the $x$-axis: a different point.'],
    [pt(rr, n - d, d), 'Subtracting only $\\pi$ also points the opposite way.'],
  ], 2);
  const choices = r.shuffle([...oks.map(([t, why]) => ({ t, ok: true, why })), ...nos.map(([t, why]) => ({ t, why, err: 'polar-equiv' }))]);
  return {
    prompt: `Select ALL pairs that name the same point as ${m(R`(${rr},\ ${pif(n, d)})`)}.`, fmt: 'multi', arch: 'polar-equiv', diff: 3, choices, src: SRC,
    steps: ['Same point means same distance along the same ray.', 'Adding any multiple of $2\\pi$ to $\\theta$ never changes the point.', '$(r,\\theta)=(-r,\\theta\\pm\\pi)$: a negative $r$ is compensated by a half-turn.', 'Reflections ($-\\theta$) and a lone $-r$ or lone $+\\pi$ give different points.'],
    recall: '$(r,\\theta)\\equiv(r,\\theta+2\\pi k)\\equiv(-r,\\theta+\\pi+2\\pi k)$.', hints: ['Which changes are full turns?', 'A sign flip on $r$ needs a half-turn to compensate.'],
  };
});

// =================================================================
// PARAMETRIC CURVES / CALCULUS
// =================================================================
gen('g-x-param-elim', 'polar', 'Parametric Curves', 3, r => {
  const f = r.int(0, 4);
  if (f === 0) {
    const c = r.int(1, 4);
    return Q({ q: `Eliminate the parameter: ${m(R`x=t-${c},\ y=t^2`)}. Give ${m('y')} in terms of ${m('x')}.`, a: 'param-elim', d: 2, k: `y=(x+${c})^2`, src: SRC,
      w: [[`y=(x-${c})^2`, `Sign slip: $t=x+${c}$, not $x-${c}$.`, 'sign'], [`y=x^2-${c}`, 'You substituted into the exponent only; $y=t^2$ and $t=x+c$ must be squared as a whole.', 'distribute'], [`y=x^2+${c * c}`, 'Squaring $(x+c)$ also produces a middle term $2cx$.', 'distribute'], [`y=(x+${c})`, 'Forgot the square.', 'dropped-power']],
      s: [`Solve for $t$: $t=x+${c}$.`, `Substitute: $y=(x+${c})^2$.`], r: 'Solve the simpler equation for $t$, then substitute whole into the other.' });
  }
  if (f === 1) {
    const k = r.int(2, 4);
    return Q({ q: `Eliminate the parameter: ${m(R`x=e^{t},\ y=e^{${k}t}`)}. Give ${m('y')} in terms of ${m('x')}.`, a: 'param-elim', d: 3, k: `y=x^{${k}}`, src: SRC,
      w: [[`y=${k}x`, 'Exponents do not become coefficients: $e^{kt}=(e^t)^k$.', 'power'], [`y=${k}\\ln x`, 'That would come from $x=e^t, y=kt$.', 'log'], [`y=x^{\\frac{1}{${k}}}`, 'Inverted exponent.', 'inverted'], [`y=e^{${k}x}`, 'You replaced $t$ by $x$, but $x=e^t$ means $t=\\ln x$.', 'sub']],
      s: [`$y=e^{${k}t}=(e^{t})^{${k}}$.`, `Since $x=e^t$: $y=x^{${k}}$ (with $x>0$).`], r: 'Rewrite one exponential as a power of the other: $e^{kt}=(e^t)^k$.' });
  }
  if (f === 2) {
    const a = r.int(2, 4), b = r.int(2, 5);
    return Q({ q: `Eliminate the parameter: ${m(R`x=${a}\sec t,\ y=${b}\tan t`)}.`, a: 'param-elim', d: 3, k: R`\frac{x^2}{${a * a}}-\frac{y^2}{${b * b}}=1`, src: SRC,
      w: [[R`\frac{x^2}{${a * a}}+\frac{y^2}{${b * b}}=1`, 'That is the ellipse identity $\\cos^2+\\sin^2=1$. Secant and tangent use $\\sec^2-\\tan^2=1$.', 'identity'], [R`\frac{x^2}{${b * b}}-\frac{y^2}{${a * a}}=1`, 'Denominators swapped.', 'swap'], [R`\frac{x^2}{${a}}-\frac{y^2}{${b}}=1`, 'Denominators must be squared: $(x/a)^2$.', 'square'], [R`\frac{y^2}{${b * b}}-\frac{x^2}{${a * a}}=1`, 'Order flipped: $\\sec^2t-\\tan^2t=1$ puts $x$ first.', 'order']],
      s: [`$\\sec t=x/${a}$ and $\\tan t=y/${b}$.`, 'Use $\\sec^2t-\\tan^2t=1$.', `$\\dfrac{x^2}{${a * a}}-\\dfrac{y^2}{${b * b}}=1$.`], r: '$\\cos^2+\\sin^2=1$ gives ellipses; $\\sec^2-\\tan^2=1$ gives hyperbolas.' });
  }
  if (f === 3) {
    const useCos = r.int(0, 1) === 0, fn = useCos ? '\\cos' : '\\sin';
    return Q({ q: `Eliminate the parameter: ${m(R`x=${fn} t,\ y=\cos 2t`)}.`, a: 'param-elim', d: 3, k: useCos ? 'y=2x^2-1' : 'y=1-2x^2', src: SRC,
      w: [[useCos ? 'y=1-2x^2' : 'y=2x^2-1', useCos ? 'That is the $\\sin$ version ($\\cos2t=1-2\\sin^2t$).' : 'That is the $\\cos$ version ($\\cos2t=2\\cos^2t-1$).', 'identity'], ['y=x^2-1', 'Missing the factor 2: $\\cos 2t=2\\cos^2t-1$, not $\\cos^2t-1$.', 'identity'], ['y=1-x^2', 'That is $\\sin^2t$ or $\\cos^2t$ territory, not a double angle.', 'identity'], ['y=2x-1', 'Squares dropped: $\\cos 2t$ involves $x^2$.', 'dropped-power']],
      s: [useCos ? 'Double-angle: $\\cos2t=2\\cos^2t-1$.' : 'Double-angle: $\\cos2t=1-2\\sin^2t$.', `Substitute $x=${fn}\\,t$: ${useCos ? '$y=2x^2-1$' : '$y=1-2x^2$'}.`], r: 'Pick the double-angle form that contains the function that $x$ equals.' });
  }
  const k = r.int(2, 5);
  return Q({ q: `Eliminate the parameter: ${m(R`x=\ln t,\ y=${k}t`)}, $t>0$.`, a: 'param-elim', d: 3, k: R`y=${k}e^{x}`, src: SRC,
    w: [[R`y=${k}\ln x`, 'Inverted: $x=\\ln t$ means $t=e^x$.', 'inverse'], [R`y=e^{${k}x}`, 'The coefficient $k$ is a multiplier of $t$, not of $x$.', 'coef'], [`y=x^{${k}}`, 'Not a power relation.', 'power'], [R`y=\ln(${k}x)`, 'You applied $\\ln$ instead of undoing it.', 'inverse']],
    s: ['$x=\\ln t\\Rightarrow t=e^{x}$.', `$y=${k}t=${k}e^{x}$.`], r: 'Undo $\\ln$ with $e^{(\\cdot)}$.' });
});

gen('g-x-param-dydx', 'polar', 'Parametric Calculus', 3, r => {
  const f = r.int(0, 2), fmt = r.int(0, 2) === 0 ? 'free' : undefined;
  if (f === 0) {
    const p = r.int(1, 3), s = r.int(1, 3), t0 = r.pick([1, 2, -1]);
    let u = r.int(0, 4), q = r.int(0, 3); if (2 * p * t0 + q === 0) q++;
    const D = 2 * p * t0 + q;
    if (3 * s * t0 * t0 - u === 0) u++;
    const N = 3 * s * t0 * t0 - u;
    return Q({
      q: `Find ${m(R`\dfrac{dy}{dx}`)} at ${m(`t=${t0}`)} for ${m(R`x=${sgn(p, 't^{2}', true)}${sgn(q, 't')},\ y=${sgn(s, 't^{3}', true)}${sgn(-u, 't')}`)}.`, a: 'param-dydx', d: 3, f: fmt, k: frac(N, D), src: SRC,
      w: [[frac(D, N), 'Upside down: slope is $\\frac{dy/dt}{dx/dt}$ (y on top).', 'inverted'], [frac(-N, D), 'Sign error in $dy/dt$ or $dx/dt$ when substituting $t$.', 'sign'], [`${N}`, 'That is only $dy/dt$; divide by $dx/dt$.', 'dy-only'], [`${D}`, 'That is only $dx/dt$.', 'dx-only'], [frac(N + D, 1), 'You added the derivatives instead of dividing.', 'add'], [frac(-D, N), 'Upside down and sign flipped.', 'inverted'], [frac(N, 2 * D), 'Halved slope: check the derivative of the square term.', 'power']],
      s: [`$\\dfrac{dy}{dt}=${sgn(3 * s, 't^{2}', true)}${sgn(-u, '')}$, so at $t=${t0}$ it is $${N}$.`, `$\\dfrac{dx}{dt}=${sgn(2 * p, 't', true)}${sgn(q, '')}$, so at $t=${t0}$ it is $${D}$.`, `$\\dfrac{dy}{dx}=\\dfrac{${N}}{${D}}=${frac(N, D)}$.`],
      r: '$\\dfrac{dy}{dx}=\\dfrac{dy/dt}{dx/dt}$, evaluated at the given $t$.', c: () => N / D,
    });
  }
  if (f === 1) {
    const [a, b] = r.pick([[2, 3], [3, 2], [2, 5], [4, 3], [3, 5], [5, 2]]), tc = r.int(0, 2), ang = [[1, 4], [1, 6], [1, 3]][tc];
    const key = [frac(-b, a), rad(-b, a, 3), rad(-b, 3 * a, 3)][tc], flip = [frac(b, a), rad(b, a, 3), rad(b, 3 * a, 3)][tc], inv = [frac(-a, b), rad(-a, 3 * b, 3), rad(-a, b, 3)][tc], invf = [frac(a, b), rad(a, 3 * b, 3), rad(a, b, 3)][tc];
    const t = PI * ang[0] / ang[1];
    return Q({
      q: `Find ${m(R`\dfrac{dy}{dx}`)} at ${m(R`t=${pif(ang[0], ang[1])}`)} for ${m(R`x=${a}\cos t,\ y=${b}\sin t`)}.`, a: 'param-dydx', d: 3, f: fmt, k: key, src: SRC,
      w: [[flip, '$dx/dt=-a\\sin t$ is negative here: keep that minus sign.', 'sign'], [inv, 'Inverted ratio: it is $\\frac{dy/dt}{dx/dt}$.', 'inverted'], [invf, 'Inverted and sign dropped.', 'inverted'], [frac(-b, a), 'You took $\\cot t=1$; check the actual value of $\\cot t$ at this angle.', 'angle']],
      s: [`$\\dfrac{dy}{dt}=${b}\\cos t$, $\\dfrac{dx}{dt}=-${a}\\sin t$.`, `$\\dfrac{dy}{dx}=-\\dfrac{${b}}{${a}}\\cot t$.`, `At $t=${pif(ang[0], ang[1])}$ evaluate $\\cot t$ and simplify: $${key}$.`], r: 'For the ellipse, $\\frac{dy}{dx}=-\\frac{b}{a}\\cot t$.',
      c: () => (b * Math.cos(t)) / (-a * Math.sin(t)),
    });
  }
  const a = r.int(2, 4), t0 = r.int(2, 3), D = a * t0 ** a;
  return Q({
    q: `Find ${m(R`\dfrac{dy}{dx}`)} at ${m(`t=${t0}`)} for ${m(R`x=t^{${a}},\ y=\ln t`)}.`, a: 'param-dydx', d: 3, f: fmt, k: frac(1, D), src: SRC,
    w: [[frac(D, 1), 'Inverted ratio.', 'inverted'], [frac(1, t0), 'That is only $dy/dt=1/t$.', 'dy-only'], [frac(1, a * t0 ** (a - 1)), 'Forgot the $t$ from $dy/dt=1/t$: the denominator is $t\\cdot a t^{a-1}$.', 'dropped-t'], [frac(a * t0 ** (a - 1), 1), 'That is only $dx/dt$.', 'dx-only'], [frac(1, t0 * (a - 1)), 'Power rule misapplied to $x=t^a$.', 'power'], [frac(1, a * t0), 'Dropped the exponent on $t$ in the denominator.', 'power'], [frac(2, D), 'Doubled numerator: no such factor.', 'power']],
    s: [`$\\dfrac{dy}{dt}=\\dfrac1t$, $\\dfrac{dx}{dt}=${a}t^{${a - 1}}$.`, `$\\dfrac{dy}{dx}=\\dfrac{1/t}{${a}t^{${a - 1}}}=\\dfrac{1}{${a}t^{${a}}}$.`, `At $t=${t0}$: $${frac(1, D)}$.`], r: 'Divide the two derivatives, then simplify before plugging in.',
    c: () => (1 / t0) / (a * t0 ** (a - 1)),
  });
});

gen('g-x-param-tangent', 'polar', 'Parametric Calculus', 3, r => {
  let p = r.int(-2, 2); const t0 = r.pick([1, 2, -1]);
  let s = r.int(0, 3); if (3 * t0 * t0 === s) s++;
  while ((t0 ** 3 - s * t0) * 2 * t0 - (3 * t0 * t0 - s) * (t0 * t0 + p) === 0) p++;   // intercept 0 collapses distractors
  return tan2(p, s, t0);
  function tan2(p, s, t0) {
    const x0 = t0 * t0 + p, y0 = t0 ** 3 - s * t0, N = 3 * t0 * t0 - s, D = 2 * t0;
    const bN = y0 * D - N * x0, line = (mN, mD, bn, bd) => {
      const mc = frac(mN, mD), mp = mc === '1' ? '' : mc === '-1' ? '-' : mc, bs = bn === 0 ? '' : (frac(bn, bd).startsWith('-') ? '' : '+') + frac(bn, bd);
      return `y=${mp}x${bs}`;
    };
    const xs = `t^{2}${p === 0 ? '' : sgn(p, '')}`, ys = `t^{3}${s === 0 ? '' : sgn(-s, 't')}`;
    return Q({
      q: `Find an equation of the tangent line to ${m(R`x=${xs},\ y=${ys}`)} at ${m(`t=${t0}`)}.`, a: 'param-tangent', d: 3, k: line(N, D, bN, D), src: SRC,
      w: [[line(D, N, y0 * N - D * x0, N), 'Slope inverted: it is $\\frac{dy/dt}{dx/dt}$.', 'inverted'], [line(N, D, y0, 1), 'Intercept error: you used $b=y_0$. Solve $y_0=mx_0+b$ for $b$.', 'intercept'], [line(-N, D, y0 * D + N * x0, D), 'Sign error in the slope.', 'sign'], [line(N, 1, y0 - N * x0, 1), 'Slope forgot to divide by $dx/dt$.', 'dy-only'], [line(N, D, -bN, D), 'Intercept sign error.', 'intercept'], [line(N, D, y0 * D + N * x0, D), 'Added $mx_0$ instead of subtracting it when solving for $b$.', 'intercept']],
      s: [`Point: $(x,y)=(${x0},${y0})$ at $t=${t0}$.`, `Slope: $\\dfrac{dy/dt}{dx/dt}=\\dfrac{${N}}{${D}}$.`, `Point-slope: $y-${y0 < 0 ? `(${y0})` : y0}=${frac(N, D)}\\,(x-${x0 < 0 ? `(${x0})` : x0})$, i.e. $${line(N, D, bN, D).slice(2)}$.`], r: 'Tangent line: point from $(x(t_0),y(t_0))$, slope from $\\frac{dy/dt}{dx/dt}$, then point-slope.',
    });
  }
});

gen('g-x-param-hv', 'polar', 'Parametric Calculus', 4, r => {
  const mm = r.int(1, 3), wantH = r.int(0, 1) === 0, swap = !wantH, c0 = r.int(-2, 2);
  const cub = `t^{3}-${3 * mm * mm}t`, sq = `t^{2}${c0 === 0 ? '' : sgn(c0, '')}`;
  const xs = swap ? cub : sq, ys = swap ? sq : cub;
  const dxdt = t => (swap ? 3 * t * t - 3 * mm * mm : 2 * t), dydt = t => (swap ? 2 * t : 3 * t * t - 3 * mm * mm);
  const choices = [-2 * mm, -mm, 0, mm, 2 * mm].map(t => {
    const dx = dxdt(t), dy = dydt(t), isH = dy === 0 && dx !== 0, isV = dx === 0 && dy !== 0;
    const ok = wantH ? isH : isV;
    const kind = isH ? 'horizontal' : isV ? 'vertical' : 'neither';
    const why = `At $t=${t}$: $dx/dt=${dx}$, $dy/dt=${dy}$ — ${kind === 'neither' ? 'both nonzero, so the tangent is neither horizontal nor vertical' : kind + ' tangent'}.`;
    return ok ? { t: m(`t=${t}`), ok: true, why } : { t: m(`t=${t}`), why, err: 'hv-' + kind };
  });
  return {
    prompt: `For the curve ${m(R`x=${xs},\ y=${ys}`)}, select ALL values of ${m('t')} at which the tangent line is ${wantH ? 'horizontal' : 'vertical'}.`, fmt: 'multi', arch: 'param-hv', diff: 4, choices, src: SRC,
    steps: [`$\\dfrac{dx}{dt}=${swap ? `3t^{2}-${3 * mm * mm}` : '2t'}$, $\\dfrac{dy}{dt}=${swap ? '2t' : `3t^{2}-${3 * mm * mm}`}$.`, wantH ? 'Horizontal: $dy/dt=0$ and $dx/dt\\ne0$.' : 'Vertical: $dx/dt=0$ and $dy/dt\\ne0$.', 'Test each listed $t$ in BOTH derivatives.'],
    recall: 'Horizontal: $dy/dt=0,\\ dx/dt\\neq0$. Vertical: $dx/dt=0,\\ dy/dt\\neq0$. If both vanish, you must investigate.', hints: ['Compute both derivatives first.', 'A value qualifies only if one is zero and the other is not.'],
  };
});

gen('g-x-param-d2y', 'polar', 'Parametric Calculus', 4, r => {
  if (r.int(0, 2) < 2) {
    const p = r.int(1, 3), q = r.int(1, 3), t0 = r.int(2, 3);
    return Q({
      q: `Find ${m(R`\dfrac{d^2y}{dx^2}`)} at ${m(`t=${t0}`)} for ${m(R`x=${nz(p, 't^{2}')},\ y=${nz(q, 't^{3}')}`)}.`, a: 'param-d2y', d: 4, k: frac(3 * q, 4 * p * p * t0), src: SRC,
      w: [[frac(3 * q, 2 * p), 'That stops at $\\frac{d}{dt}\\left(\\frac{dy}{dx}\\right)$: divide that by $dx/dt$ once more.', 'forgot-divide'], [frac(3 * q * t0, p), 'You divided $d^2y/dt^2$ by $d^2x/dt^2$. That is not the second derivative of $y$ with respect to $x$.', 'second-over-second'], [frac(3 * q * t0, 2 * p), 'That is $dy/dx$ itself.', 'first-derivative'], [frac(3 * q, 4 * p * p), 'Dropped the $t$ from $dx/dt=2pt$ in the last division.', 'dropped-t']],
      s: [`$\\dfrac{dy}{dx}=\\dfrac{${3 * q}t^2}{${2 * p}t}=${frac(3 * q, 2 * p)}\\,t$.`, `$\\dfrac{d}{dt}\\!\\left(\\dfrac{dy}{dx}\\right)=${frac(3 * q, 2 * p)}$.`, `Divide by $dx/dt=${2 * p}t$: $\\dfrac{d^2y}{dx^2}=${frac(3 * q, 4 * p * p)}\\cdot\\dfrac1t$; at $t=${t0}$: $${frac(3 * q, 4 * p * p * t0)}$.`],
      r: '$\\dfrac{d^2y}{dx^2}=\\dfrac{\\frac{d}{dt}(dy/dx)}{dx/dt}$.', c: () => (3 * q) / (4 * p * p * t0),
    });
  }
  const k = r.int(1, 4);
  return Q({
    q: `Find ${m(R`\dfrac{d^2y}{dx^2}`)} at ${m('t=1')} for ${m(R`x=e^{t},\ y=${nz(k, 't^{3}')}`)}.`, a: 'param-d2y', d: 4, k: `${3 * k}e^{-2}`, src: SRC,
    w: [[`${3 * k}e^{-1}`, 'That is $\\frac{d}{dt}(dy/dx)$; still divide by $dx/dt=e^t$.', 'forgot-divide'], [`${6 * k}e^{-1}`, 'Second-derivative ratio $y\'\'/x\'\'$ is not $d^2y/dx^2$.', 'second-over-second'], [`${6 * k}e^{-2}`, 'Dropped the product-rule term $-t^2e^{-t}$ when differentiating $dy/dx$.', 'product-rule'], [`${3 * k}e^{-3}`, 'Divided by $e^{2t}$ instead of $e^{t}$.', 'arith']],
    s: [`$\\dfrac{dy}{dx}=\\dfrac{${3 * k}t^2}{e^t}=${3 * k}t^2e^{-t}$.`, `$\\dfrac{d}{dt}=${3 * k}(2t-t^2)e^{-t}$.`, `Divide by $e^t$: $${3 * k}(2t-t^2)e^{-2t}$; at $t=1$: $${3 * k}e^{-2}$.`], r: 'Differentiate $dy/dx$ with respect to $t$ (product rule!), then divide by $dx/dt$.',
    c: () => { const g = t => 3 * k * t * t * Math.exp(-t), h = 1e-5; return ((g(1 + h) - g(1 - h)) / (2 * h)) / Math.E; },
  });
});

gen('g-x-param-arclen', 'polar', 'Parametric Calculus', 4, r => {
  const f = r.int(0, 3);
  if (f === 0) {
    const b = r.int(1, 3), N = 4 + 9 * b * b;
    return Q({ q: `Find the length of the curve ${m(R`x=t^2,\ y=t^3`)} for ${m(`0\\le t\\le ${b}`)}.`, a: 'param-arclen', d: 4, k: R`\frac{${N}^{3/2}-8}{27}`, src: SRC,
      w: [[R`\frac{${N}^{3/2}}{27}`, 'Forgot to subtract the lower-limit value ($4^{3/2}=8$).', 'limits'], [R`\frac{${N}^{3/2}-8}{18}`, 'Missed the $\\frac23$ from $\\int u^{1/2}du$: $\\frac{1}{18}\\cdot\\frac23=\\frac1{27}$.', 'power'], [R`\sqrt{${b ** 4 + b ** 6}}`, 'That is the straight-line distance between the endpoints, not the arc length.', 'chord'], [R`\frac{${N}^{3/2}-8}{9}`, 'Check the $du$ factor: $u=4+9t^2$, $du=18t\\,dt$.', 'du']],
      s: ['$ds=\\sqrt{(2t)^2+(3t^2)^2}\\,dt=t\\sqrt{4+9t^2}\\,dt$.', `$u=4+9t^2,\\ du=18t\\,dt$: $L=\\dfrac1{18}\\displaystyle\\int_4^{${N}}u^{1/2}du$.`, `$=\\dfrac{1}{27}\\left[u^{3/2}\\right]_4^{${N}}=\\dfrac{${N}^{3/2}-8}{27}$.`], r: '$L=\\int\\sqrt{(dx/dt)^2+(dy/dt)^2}\\,dt$; the radicand must simplify to a perfect square times something integrable.',
      c: () => simp(t => Math.sqrt(4 * t * t + 9 * t ** 4), 0, b) });
  }
  if (f === 1) {
    const a = r.int(2, 6), [n, d] = r.pick([[1, 2], [1, 3], [3, 2], [2, 1], [1, 1]]);
    return Q({ q: `Find the length of the curve ${m(R`x=${a}\cos t,\ y=${a}\sin t`)} for ${m(R`0\le t\le ${pif(n, d)}`)}.`, a: 'param-arclen', d: 3, k: pif(a * n, d), src: SRC,
      w: [[pif(a * a * n, d), 'You used $a^2$: speed is $\\sqrt{a^2\\sin^2t+a^2\\cos^2t}=a$.', 'speed'], [pif(a * n, 2 * d), 'Extra factor $\\frac12$ — that is a sector area formula.', 'area'], [pif(2 * a * n, d), 'Speed is $a$, not $2a$.', 'speed'], [pif(n, d), 'Forgot the radius: $L=a\\cdot$(angle).', 'radius'], [pif(3 * a * n, d), 'Speed is $a$, not $3a$.', 'speed'], [pif(a * n, 3 * d), 'Stray factor $\\frac13$ — nothing divides the integral.', 'area']],
      s: [`Speed $=\\sqrt{(-${a}\\sin t)^2+(${a}\\cos t)^2}=${a}$.`, `$L=\\displaystyle\\int_0^{${pif(n, d)}}${a}\\,dt=${pif(a * n, d)}$.`], r: 'Circle of radius $a$: speed is constant $a$, so $L=a\\cdot\\Delta t$.', c: () => a * PI * n / d });
  }
  if (f === 2) {
    const b = r.int(1, 3);
    return Q({ q: `Find the length of the curve ${m(R`x=e^{t}\cos t,\ y=e^{t}\sin t`)} for ${m(`0\\le t\\le ${b}`)}.`, a: 'param-arclen', d: 4, k: R`\sqrt{2}\left(${b === 1 ? 'e' : `e^{${b}}`}-1\right)`, src: SRC,
      w: [[R`${b === 1 ? 'e' : `e^{${b}}`}-1`, 'Speed is $\\sqrt2e^t$; you lost the $\\sqrt2$.', 'speed'], [R`\sqrt{2}\,${b === 1 ? 'e' : `e^{${b}}`}`, 'Forgot to subtract the value at $t=0$.', 'limits'], [R`2\left(${b === 1 ? 'e' : `e^{${b}}`}-1\right)`, 'The radicand is $2e^{2t}$, so speed is $\\sqrt2e^t$, not $2e^t$.', 'speed'], [R`\sqrt{2}\left(${b === 1 ? 'e' : `e^{${b}}`}+1\right)`, 'Evaluate $F(b)-F(0)$; $F(0)=\\sqrt2$.', 'limits']],
      s: ['$x\'=e^t(\\cos t-\\sin t),\\ y\'=e^t(\\sin t+\\cos t)$.', '$(x\')^2+(y\')^2=e^{2t}\\cdot2$, so $ds=\\sqrt2e^t\\,dt$.', `$L=\\sqrt2\\left[e^t\\right]_0^{${b}}$.`], r: 'Expand the squares: the cross terms cancel, leaving $2e^{2t}$.', c: () => Math.SQRT2 * (Math.exp(b) - 1) });
  }
  const sq = r.int(2, 5), b = sq * sq - 1;
  return Q({ q: `Find the length of the curve ${m(R`x=t,\ y=\tfrac23t^{3/2}`)} for ${m(`0\\le t\\le ${b}`)}.`, a: 'param-arclen', d: 3, k: frac(2 * (sq ** 3 - 1), 3), src: SRC,
    w: [[frac(2 * sq ** 3, 3), 'Forgot to subtract the lower-limit value (the $-1$).', 'limits'], [frac(sq ** 3 - 1, 3), 'Missed the factor 2 in $\\frac23(1+t)^{3/2}$.', 'power'], [frac(2 * (b ** 1.5 > 0 ? b * b : 1), 3), 'Not a valid antiderivative.', 'arith'], [frac(2 * (sq ** 2 - 1), 3), 'Exponent: $(1+t)^{3/2}$ at $t=' + b + '$ is $' + sq + '^3$, not $' + sq + '^2$.', 'power']],
    s: ['$\\dfrac{dy}{dt}=t^{1/2}$, so $ds=\\sqrt{1+t}\\,dt$.', `$L=\\dfrac23\\left[(1+t)^{3/2}\\right]_0^{${b}}=\\dfrac23(${sq}^3-1)$.`], r: 'These textbook curves are built so $1+(y\')^2$ is a perfect square.', c: () => simp(t => Math.sqrt(1 + t), 0, b) });
});

// =================================================================
// POLAR AREA & ARC LENGTH
// =================================================================
gen('g-x-polar-petalarea', 'polar', 'Polar Area & Arc Length', 3, r => {
  const n = r.int(2, 5), a = r.int(1, 4), fn = r.pick(['\\cos', '\\sin']), one = r.int(0, 1) === 0, a2 = a * a;
  const key = one ? pif(a2, 4 * n) : (n % 2 ? pif(a2, 4) : pif(a2, 2));
  const petal = () => (fn === '\\cos'
    ? 0.5 * simp(t => (a * Math.cos(n * t)) ** 2, -PI / (2 * n), PI / (2 * n))
    : 0.5 * simp(t => (a * Math.sin(n * t)) ** 2, 0, PI / n));
  const cnt = n % 2 ? n : 2 * n;
  return Q({
    q: one ? `Find the area of ONE petal of the rose ${m(R`r=${nz(a, `${fn}(${n}\\theta)`)}`)}.` : `Find the total area enclosed by the rose ${m(R`r=${nz(a, `${fn}(${n}\\theta)`)}`)}.`, a: one ? 'polar-petal' : 'polar-rose-total', d: 3, k: key, src: SRC,
    w: one
      ? [[pif(2 * a2, 4 * n), 'Missing the $\\frac12$ in $A=\\frac12\\int r^2d\\theta$.', 'dropped-half'], [pif(a2, 2 * n), 'Petal limits too wide: one petal spans an angle of $\\pi/n$, not $2\\pi/n$.', 'limits'], [pif(a2, 4), 'That is the area of the whole rose (odd $n$), not one petal.', 'whole'], [pif(a2, n), 'Both the $\\frac12$ and the angle span are wrong.', 'limits'], [pif(a2, 8 * n), 'Over-reduced: $\\int\\cos^2$ over the petal gives $\\frac{\\pi}{2n}$, then times $\\frac12a^2$.', 'arith']]
      : [[n % 2 ? pif(a2, 2) : pif(a2, 4), n % 2 ? 'Odd $n$: the curve closes after $\\pi$, so $\\int_0^{2\\pi}$ double-counts. Use $\\pi$ (or $n$ petals).' : 'Even $n$ has $2n$ petals, not $n$.', 'petal-count'], [pif(a2 * n, 4), 'Multiplying by $n$ again: the single-petal area already contains $\\frac1n$.', 'count'], [pif(a2, 1), 'Missing the $\\frac12$ in the area formula.', 'dropped-half'], [pif(a2 * (n % 2 ? 2 : 4) * n, 4 * n), 'Double-counted by integrating over too large a range.', 'limits'], [pif(a2, 8), 'Too small.', 'arith']],
    s: one
      ? [`One petal: ${fn === '\\cos' ? `$-\\frac{\\pi}{${2 * n}}\\le\\theta\\le\\frac{\\pi}{${2 * n}}$` : `$0\\le\\theta\\le\\frac{\\pi}{${n}}$`}.`, `$A=\\frac12\\displaystyle\\int${nz(a2, '')}\\left(\\text{trig}\\right)^2d\\theta$, and $\\int\\sin^2 n\\theta$ over a petal is $\\frac{\\pi}{2n}$.`, `$A=\\frac12\\cdot${a2}\\cdot\\frac{\\pi}{2n}=${key}$.`]
      : [`${cnt} petals (n ${n % 2 ? 'odd' : 'even'}), each of area $${pif(a2, 4 * n)}$.`, `Total $=${cnt}\\cdot${pif(a2, 4 * n)}=${key}$.`],
    r: 'One petal of a rose has area $\\frac{\\pi a^2}{4n}$. Total: $\\frac{\\pi a^2}{4}$ (odd $n$) or $\\frac{\\pi a^2}{2}$ (even $n$).', c: () => (one ? petal() : cnt * petal()),
  });
});

gen('g-x-polar-limacon', 'polar', 'Polar Area & Arc Length', 3, r => {
  const b = r.int(1, 3), a = b + r.pick([0, 0, 1, 2]), fn = r.pick(['\\cos', '\\sin']), N = 2 * a * a + b * b, key = pif(N, 2);
  return Q({
    q: `Find the area enclosed by the ${a === b ? 'cardioid' : 'limaçon'} ${m(R`r=${a}+${nz(b, `${fn}\\theta`).replace(/^1/, '')}`)}.`, a: 'polar-limacon', d: 3, k: key, src: SRC,
    w: [[pif(N, 1), 'Missing the $\\frac12$ in $A=\\frac12\\int r^2d\\theta$.', 'dropped-half'], [pif(2 * a * a, 2), `Lost the $b^2${fn}^2$ term: $\\int ${fn}^2\\ne0$.`, 'dropped-term'], [pif((a + b) * (a + b), 2), 'You squared the sum as if it were constant: $r^2$ has a cross term that integrates to 0 and a $b^2$ term with average $\\frac12$.', 'no-expand'], [pif(N, 4), 'Half the range: the full curve needs $0$ to $2\\pi$.', 'limits']],
    s: [`$r^2=${a * a}+${2 * a * b}${fn}\\theta+${b * b}${fn}^2\\theta$.`, `Over $[0,2\\pi]$: $\\int${fn}\\theta=0$ and $\\int${fn}^2\\theta=\\pi$.`, `$A=\\frac12\\left(${2 * a * a}\\pi+${b * b}\\pi\\right)=${key}$.`], r: '$A=\\pi\\left(a^2+\\frac{b^2}{2}\\right)$ for $r=a\\pm b\\cos\\theta$ with $a\\ge b$.',
    c: () => 0.5 * simp(t => (a + b * (fn === '\\cos' ? Math.cos(t) : Math.sin(t))) ** 2, 0, 2 * PI),
  });
});

gen('g-x-polar-between', 'polar', 'Polar Area & Arc Length', 4, r => {
  const a = r.int(1, 4), A = a * a, nn = A === 1 ? '' : `${A}`, f = r.int(0, 2);
  const [pr, key, w, why, c] = [
    [`Find the area of the region inside the cardioid ${m(R`r=${nz(a, '(1+\\cos\\theta)')}`)} and outside the circle ${m(`r=${a}`)}.`, R`${nn}\left(2+\frac{\pi}{4}\right)`,
      [[R`${2 * A}\left(2+\frac{\pi}{4}\right)`, 'Missing the $\\frac12$.', 'dropped-half'], [R`\frac{${nn}\pi}{2}`, 'You integrated over $0$ to $2\\pi$; the cardioid is outside the circle only for $-\\frac\\pi2\\le\\theta\\le\\frac\\pi2$.', 'limits'], [`${2 * A}`, 'Dropped the $\\cos^2\\theta$ contribution.', 'dropped-term'], [R`${nn}\left(2-\frac{\pi}{4}\right)`, 'Sign slip on the $\\cos^2$ integral.', 'sign']],
      ['Intersections: $a(1+\\cos\\theta)=a\\Rightarrow\\theta=\\pm\\frac\\pi2$.', `$A=\\frac12\\displaystyle\\int_{-\\pi/2}^{\\pi/2}\\left(${nn}(1+\\cos\\theta)^2-${A}\\right)d\\theta=${A}\\cdot\\frac12\\int(2\\cos\\theta+\\cos^2\\theta)d\\theta$.`, `$=${nn}\\left(2+\\frac\\pi4\\right)$.`],
      () => 0.5 * simp(t => (a * (1 + Math.cos(t))) ** 2 - a * a, -PI / 2, PI / 2)],
    [`Find the area of the region inside the circle ${m(R`r=${nz(2 * a, '\\cos\\theta')}`)} and outside the circle ${m(`r=${a}`)}.`, R`${nn}\left(\frac{\pi}{3}+\frac{\sqrt{3}}{2}\right)`,
      [[`${A === 1 ? '' : A}\\pi`, 'That is the whole big circle: you forgot to remove the inner circle.', 'no-subtract'], [R`${nn}\left(\frac{\pi}{3}-\frac{\sqrt{3}}{2}\right)`, 'Sign slip on $\\sin2\\theta$ at the limits.', 'sign'], [R`${2 * A}\left(\frac{\pi}{3}+\frac{\sqrt{3}}{2}\right)`, 'Missing the $\\frac12$.', 'dropped-half'], [R`${nn}\left(\frac{2\pi}{3}+\frac{\sqrt{3}}{2}\right)`, 'Check the $\\theta$ integral of $a^2$: $\\frac12a^2\\cdot\\frac{2\\pi}{3}$ is subtracted.', 'arith']],
      [`Intersect: $${2 * a}\\cos\\theta=${a}\\Rightarrow\\theta=\\pm\\frac\\pi3$.`, `$A=\\frac12\\displaystyle\\int_{-\\pi/3}^{\\pi/3}\\left(${4 * A}\\cos^2\\theta-${A}\\right)d\\theta$.`, `$=${nn}\\left(\\frac\\pi3+\\frac{\\sqrt3}{2}\\right)$.`],
      () => 0.5 * simp(t => (2 * a * Math.cos(t)) ** 2 - a * a, -PI / 3, PI / 3)],
    [`Find the area of the region inside BOTH circles ${m(R`r=${nz(2 * a, '\\cos\\theta')}`)} and ${m(`r=${a}`)}.`, R`${nn}\left(\frac{2\pi}{3}-\frac{\sqrt{3}}{2}\right)`,
      [[R`${nn}\left(\frac{2\pi}{3}+\frac{\sqrt{3}}{2}\right)`, 'Sign slip on $\\sin 2\\theta$ at the limits.', 'sign'], [R`${nn}\left(\frac{\pi}{3}+\frac{\sqrt{3}}{2}\right)`, 'That is the region inside the big circle but outside the small one.', 'wrong-region'], [`${A === 1 ? '' : A}\\pi`, 'That is the area of the larger circle only.', 'whole'], [R`\frac{${nn}\pi}{3}`, 'Only the small-circle sector; the common region has two arcs.', 'partial']],
      ['The inner boundary changes where the circles cross, at $\\theta=\\pm\\frac\\pi3$.', `$|\\theta|\\le\\frac\\pi3$: bound by $r=${a}$. $\\frac\\pi3\\le|\\theta|\\le\\frac\\pi2$: bound by $r=${2 * a}\\cos\\theta$.`, `$A=2\\left[\\frac12\\int_0^{\\pi/3}${A}d\\theta+\\frac12\\int_{\\pi/3}^{\\pi/2}${4 * A}\\cos^2\\theta d\\theta\\right]=${nn}\\left(\\frac{2\\pi}3-\\frac{\\sqrt3}2\\right)$.`],
      () => 2 * (0.5 * simp(t => a * a, 0, PI / 3) + 0.5 * simp(t => (2 * a * Math.cos(t)) ** 2, PI / 3, PI / 2))],
  ][f];
  return Q({ q: pr, a: 'polar-between', d: 4, k: key, w, s: why, r: 'Between polar curves: $A=\\frac12\\int(r_{out}^2-r_{in}^2)\\,d\\theta$; find the crossing angles first and sketch to see which curve is outer.', src: SRC, c });
});

gen('g-x-polar-innerloop', 'polar', 'Polar Area & Arc Length', 5, r => {
  const a = r.int(1, 3), A = a * a, nn = A === 1 ? '' : `${A}`, inner = r.int(0, 1) === 0, fn = r.pick(['\\cos', '\\sin']);
  const lo = fn === '\\cos' ? 2 * PI / 3 : 7 * PI / 6, hi = fn === '\\cos' ? 4 * PI / 3 : 11 * PI / 6, rf = t => a + 2 * a * (fn === '\\cos' ? Math.cos(t) : Math.sin(t));
  const Iv = 0.5 * simp(t => rf(t) ** 2, lo, hi), ph = fn === '\\cos' ? 'cos' : 'sin';
  const keyI = R`${nn}\left(\pi-\frac{3\sqrt{3}}{2}\right)`, keyD = R`${nn}\left(\pi+3\sqrt{3}\right)`;
  const lim = fn === '\\cos' ? ['\\frac{2\\pi}{3}', '\\frac{4\\pi}{3}'] : ['\\frac{7\\pi}{6}', '\\frac{11\\pi}{6}'];
  return Q({
    q: inner ? `Find the area of the INNER loop of the limaçon ${m(R`r=${nz(a, `(1+2${fn}\\theta)`)}`)}.` : `Find the area of the region inside the OUTER loop but outside the INNER loop of ${m(R`r=${nz(a, `(1+2${fn}\\theta)`)}`)}.`,
    a: inner ? 'polar-innerloop' : 'polar-loop-diff', d: 5, k: inner ? keyI : keyD, src: SRC,
    w: inner
      ? [[`${3 * A === 1 ? '' : 3 * A}\\pi`, 'That is $\\frac12\\int_0^{2\\pi}r^2$: the whole sweep, with the inner loop counted inside the outer.', 'limits'], [R`${nn}\left(2\pi+\frac{3\sqrt{3}}{2}\right)`, 'That is the OUTER loop region (including the inner loop).', 'wrong-region'], [R`${nn}\left(\pi+3\sqrt{3}\right)`, 'That is outer minus inner (the crescent between the loops).', 'wrong-region'], [R`${2 * A}\left(\pi-\frac{3\sqrt{3}}{2}\right)`, 'Missing the $\\frac12$.', 'dropped-half'], [R`${nn}\left(\pi+\frac{3\sqrt{3}}{2}\right)`, 'Sign slip on the $\\sin$ terms at the limits.', 'sign']]
      : [[R`${nn}\left(2\pi+\frac{3\sqrt{3}}{2}\right)`, 'That is the whole outer-loop region; also remove the inner loop.', 'wrong-region'], [keyI.replace('R', ''), 'That is only the inner loop.', 'wrong-region'], [`${3 * A === 1 ? '' : 3 * A}\\pi`, 'That is $\\frac12\\int_0^{2\\pi}r^2d\\theta$, which double-counts the inner loop.', 'limits'], [R`${nn}\left(\pi-3\sqrt{3}\right)`, 'Negative: sign error on the $\\sin$ terms.', 'sign'], [R`${nn}\left(2\pi-3\sqrt{3}\right)`, 'That is twice the inner loop.', 'wrong-region']],
    s: [`$r=0$ when $${fn.slice(1)}\\theta=-\\tfrac12$, giving $\\theta=${lim[0]}$ and $${lim[1]}$: the inner loop lives between them (where $r<0$).`, `Inner loop $=\\frac12\\displaystyle\\int_{${lim[0]}}^{${lim[1]}}r^2d\\theta=${keyI}$.`, `Full sweep $\\frac12\\int_0^{2\\pi}r^2=${3 * A}\\pi$ = outer region + inner loop, so outer region $=${nn}(2\\pi+\\frac{3\\sqrt3}2)$ and outer minus inner $=${keyD}$.`].slice(0, inner ? 2 : 3),
    r: 'A limaçon with $a<b$ has an inner loop where $r<0$. Integrate $\\frac12r^2$ between the two angles where $r=0$.', c: () => (inner ? Iv : 0.5 * simp(t => rf(t) ** 2, fn === '\\cos' ? -2 * PI / 3 : -PI / 6, fn === '\\cos' ? 2 * PI / 3 : 7 * PI / 6) - Iv),
  });
});

gen('g-x-polar-arclen', 'polar', 'Polar Area & Arc Length', 4, r => {
  const f = r.int(0, 3), a = r.int(1, 4), an = a === 1 ? '' : `${a}`;
  if (f === 0) return Q({ q: `Find the total length of the cardioid ${m(R`r=${nz(a, '(1+\\cos\\theta)')}`)}.`, a: 'polar-arclen', d: 4, k: `${8 * a}`, src: SRC,
    w: [[`${4 * a}`, 'That is only the top half ($0\\le\\theta\\le\\pi$).', 'limits'], [`${16 * a}`, 'Doubled: $\\sqrt{2+2\\cos\\theta}=2|\\cos\\frac\\theta2|$, so the integral over $[0,2\\pi]$ is $8a$.', 'arith'], [pif(2 * a, 1), 'That is a circle of radius $a$, not a cardioid.', 'circle'], [`${6 * a}`, 'Arithmetic slip in $\\int|\\cos\\frac\\theta2|d\\theta$.', 'arith']],
    s: [`$r\'=-${an}\\sin\\theta$, so $r^2+r\'^2=${an === '' ? '' : `${a * a}`}(2+2\\cos\\theta)$.`, `$\\sqrt{2+2\\cos\\theta}=2\\cos\\frac\\theta2$ for $0\\le\\theta\\le\\pi$.`, `$L=2\\displaystyle\\int_0^{\\pi}${2 * a}\\cos\\frac\\theta2\\,d\\theta=${8 * a}$.`], r: '$L=\\int\\sqrt{r^2+(dr/d\\theta)^2}\\,d\\theta$; use the half-angle identity $1+\\cos\\theta=2\\cos^2\\frac\\theta2$.',
    c: () => simp(t => Math.sqrt((a * (1 + Math.cos(t))) ** 2 + (a * Math.sin(t)) ** 2), 0, 2 * PI) });
  if (f === 1) return Q({ q: `Find the circumference of the circle ${m(R`r=${nz(a, '\\cos\\theta')}`)} using the polar arc length formula.`, a: 'polar-arclen', d: 3, k: pif(a, 1), src: SRC,
    w: [[pif(2 * a, 1), 'That treats the diameter as the radius: the circle has radius $a/2$ (it passes through the origin).', 'radius'], [pif(a, 2), 'Half the circle: one trace needs $\\theta$ from $-\\frac\\pi2$ to $\\frac\\pi2$, a full $\\pi$ of angle.', 'limits'], [pif(a * a, 1), 'Squared $a$: $\\sqrt{r^2+r\'^2}=a$.', 'arith'], [pif(a, 4), 'Only a quarter turn of the circle: one full trace takes a length-$\\pi$ interval of $\\theta$.', 'limits']],
    s: ['$r\'=-a\\sin\\theta$, so $r^2+r\'^2=a^2$.', `$L=\\displaystyle\\int_{-\\pi/2}^{\\pi/2}${an === '' ? '1' : a}\\,d\\theta=${pif(a, 1)}$.`], r: 'One trace of $r=a\\cos\\theta$ takes $\\theta$ over a length-$\\pi$ interval.',
    c: () => simp(t => Math.sqrt((a * Math.cos(t)) ** 2 + (a * Math.sin(t)) ** 2), -PI / 2, PI / 2) });
  if (f === 2) { const b = r.int(1, 3), E = b === 1 ? 'e' : `e^{${b}}`; return Q({ q: `Find the length of the spiral ${m(R`r=${nz(a, 'e^{\\theta}')}`)} for ${m(`0\\le\\theta\\le ${b}`)}.`, a: 'polar-arclen', d: 4, k: R`${an}\sqrt{2}\left(${E}-1\right)`, src: SRC,
    w: [[R`${an}\left(${E}-1\right)`, 'Lost the $\\sqrt2$: $r^2+r\'^2=2r^2$.', 'dropped-factor'], [R`${an}\sqrt{2}\,${E}`, 'Forgot the lower-limit value.', 'limits'], [R`${2 * a}\left(${E}-1\right)`, '$\\sqrt{r^2+r\'^2}=\\sqrt2\\,r$, not $2r$.', 'arith'], [R`${an}\sqrt{2}\left(${E}+1\right)`, 'Subtract the value at $\\theta=0$.', 'limits']],
    s: [`$r\'=${an}e^\\theta=r$, so $\\sqrt{r^2+r\'^2}=\\sqrt2\\,${an}e^\\theta$.`, `$L=\\sqrt2\\,${an}\\left[e^\\theta\\right]_0^{${b}}$.`], r: 'For $r=ae^\\theta$, $r\'=r$ and the integrand is $\\sqrt2\\,r$.',
    c: () => simp(t => Math.sqrt(2) * a * Math.exp(t), 0, b) }); }
  const b = r.int(1, 2), N = b * b + 4;
  return Q({ q: `Find the length of the curve ${m(R`r=${nz(a, '\\theta^{2}')}`)} for ${m(`0\\le\\theta\\le ${b}`)}.`, a: 'polar-arclen', d: 5, k: R`\frac{${an}\left(${N}^{3/2}-8\right)}{3}`, src: SRC,
    w: [[R`\frac{${an}\left(${N}^{3/2}-8\right)}{2}`, 'Antiderivative of $u^{1/2}$ has $\\frac23$; combined with $\\frac12$ from $du=2\\theta d\\theta$ gives $\\frac13$.', 'power'], [R`\frac{${an}\,${N}^{3/2}}{3}`, 'Forgot the lower limit ($4^{3/2}=8$).', 'limits'], [R`\frac{${an}\,${b}^{3}}{3}`, 'You integrated $r$ instead of $\\sqrt{r^2+r\'^2}$.', 'wrong-integrand'], [R`\frac{${an}\left(${N}^{2}-16\right)}{3}`, 'Wrong power: antiderivative of $\\sqrt u$ is $u^{3/2}$.', 'power']],
    s: [`$r\'=${nz(2 * a, '\\theta')}$, so $\\sqrt{r^2+r\'^2}=${an}\\theta\\sqrt{\\theta^2+4}$.`, `$u=\\theta^2+4$: $L=${an}\\cdot\\frac12\\displaystyle\\int_4^{${N}}\\sqrt u\\,du=\\frac{${an}\\left(${N}^{3/2}-8\\right)}{3}$.`], r: 'Factor $a\\theta$ out of the radical, then $u$-substitute.',
    c: () => simp(t => a * t * Math.sqrt(t * t + 4), 0, b) });
});

gen('g-x-polar-setup', 'polar', 'Polar Area & Arc Length', 3, r => {
  const a = r.int(1, 4), A = a * a;
  const I = (lo, hi, body, half = true) => `${half ? R`\frac12` : ''}\int_{${lo}}^{${hi}}${body}\,d\theta`;
  const T = [
    [`Set up, but do not evaluate, an integral for the area of ONE petal of ${m(R`r=${a}\sin 2\theta`)} (the one in the first quadrant).`, I('0', R`\pi/2`, R`(${a}\sin2\theta)^2`), [I('0', R`\pi`, R`(${a}\sin2\theta)^2`), 'Range $0$ to $\\pi$ covers two petals.'], [I('0', R`\pi/2`, R`${a}\sin2\theta`), 'Forgot to square $r$.'], [I('0', R`\pi/2`, R`(${a}\sin2\theta)^2`, false), 'Missing the $\\frac12$.'], [I('0', R`\pi/4`, R`(${a}\sin2\theta)^2`), 'Half a petal: $\\sin2\\theta\\ge0$ on $[0,\\frac\\pi2]$.']],
    [`Set up, but do not evaluate, an integral for the area of ONE petal of ${m(R`r=${a}\cos 3\theta`)} (the petal centred on the $x$-axis).`, I(R`-\pi/6`, R`\pi/6`, R`(${a}\cos3\theta)^2`), [I('0', R`\pi/3`, R`(${a}\cos3\theta)^2`), 'That sweeps $\\cos3\\theta$ from $1$ to $-1$: more than one petal.'], [I(R`-\pi/3`, R`\pi/3`, R`(${a}\cos3\theta)^2`), 'Two petals-worth of angle.'], [I(R`-\pi/6`, R`\pi/6`, R`${a}\cos3\theta`), 'Forgot to square $r$.'], [I(R`-\pi/6`, R`\pi/6`, R`(${a}\cos3\theta)^2`, false), 'Missing the $\\frac12$.']],
    [`Set up, but do not evaluate, an integral for the area inside the cardioid ${m(R`r=${a}(1+\cos\theta)`)}.`, I('0', R`2\pi`, R`${a}^2(1+\cos\theta)^2`), [I('0', R`\pi`, R`${a}^2(1+\cos\theta)^2`), 'That is the upper half only.'], [I('0', R`2\pi`, R`${a}(1+\cos\theta)`), 'Forgot to square $r$.'], [I('0', R`2\pi`, R`${a}^2(1+\cos\theta)^2`, false), 'Missing the $\\frac12$.'], [I('0', R`2\pi`, R`${a}^2+\cos^2\theta`), 'Squaring $a(1+\\cos\\theta)$ is not squaring each piece.']],
    [`Set up, but do not evaluate, an integral for the area inside the circle ${m(R`r=${2 * a}\cos\theta`)} and outside the circle ${m(`r=${a}`)}.`, I(R`-\pi/3`, R`\pi/3`, R`\left(${4 * A}\cos^2\theta-${A}\right)`), [I(R`-\pi/2`, R`\pi/2`, R`\left(${4 * A}\cos^2\theta-${A}\right)`), 'The circles cross at $\\pm\\frac\\pi3$; beyond that the big circle is inside.'], [I(R`-\pi/3`, R`\pi/3`, R`\left(${A}-${4 * A}\cos^2\theta\right)`), 'Subtracted in the wrong order (negative area).'], [I(R`-\pi/3`, R`\pi/3`, R`\left(${2 * a}\cos\theta-${a}\right)^2`), 'Subtract the SQUARES of the radii, not square the difference.'], [I(R`-\pi/3`, R`\pi/3`, R`${4 * A}\cos^2\theta`), 'Forgot to remove the inner circle.']],
    [`Set up, but do not evaluate, an integral for the area of the inner loop of ${m(R`r=1+2\cos\theta`)}.`, I(R`2\pi/3`, R`4\pi/3`, R`(1+2\cos\theta)^2`), [I('0', R`2\pi`, R`(1+2\cos\theta)^2`), 'That sweeps the whole curve (the inner loop counted twice).'], [I(R`-2\pi/3`, R`2\pi/3`, R`(1+2\cos\theta)^2`), 'That is the outer loop.'], [I(R`2\pi/3`, R`4\pi/3`, R`(1+2\cos\theta)^2`, false), 'Missing the $\\frac12$.'], [I(R`\pi/3`, R`5\pi/3`, R`(1+2\cos\theta)^2`), '$r=0$ at $\\cos\\theta=-\\frac12$, i.e. $\\frac{2\\pi}{3},\\frac{4\\pi}{3}$ — not $\\frac\\pi3$.']],
  ];
  const t = T[r.int(0, 4)];
  return Q({ q: t[0], a: 'polar-setup', d: 3, k: t[1], w: t.slice(2).map(([x, why]) => [x, why, 'setup']), s: ['Find the bounding angles by sketching or solving $r=0$ / $r_1=r_2$.', 'Use $A=\\frac12\\int r^2d\\theta$ (or outer$^2-$inner$^2$).', 'Check the angle range covers exactly the region once.'], r: '$A=\\frac12\\int_\\alpha^\\beta r^2\\,d\\theta$ — half, square, and exactly the right angles.', src: 'Old-final style “set up, do not evaluate” (cf. MAT 296 final p.1)' });
});

gen('g-x-polar-slope', 'polar', 'Polar Area & Arc Length', 4, r => {
  const a = r.int(1, 4), b = r.int(1, 4);
  if (r.int(0, 1) === 0) {
    const atPi = r.int(0, 1) === 1, N = atPi ? -a : a, key = frac(N, b);
    return Q({ q: `Find the slope ${m(R`\dfrac{dy}{dx}`)} of ${m(R`r=${a}+${nz(b, '\\sin\\theta')}`)} at ${m(atPi ? R`\theta=\pi` : R`\theta=0`)}.`, a: 'polar-slope', d: 4, k: key, src: SRC,
      w: [[frac(b, N), 'Upside down: numerator is $dy/d\\theta$.', 'inverted'], [frac(-N, b), 'Sign error in $\\cos\\theta$ or $\\sin\\theta$ at this angle.', 'sign'], ['0', 'Slope $0$ needs $dy/d\\theta=0$, but $r\\cos\\theta\\ne0$ here.', 'zero'], ['\\text{DNE}', 'Needs $dx/d\\theta=0$; here it is $' + b + '$.', 'dne'], [frac(a, 1), 'Used only $dy/d\\theta$.', 'dy-only']],
      s: [`$r\'=${nz(b, '\\cos\\theta')}$.`, `$\\dfrac{dy}{d\\theta}=r\'\\sin\\theta+r\\cos\\theta$ and $\\dfrac{dx}{d\\theta}=r\'\\cos\\theta-r\\sin\\theta$.`, `At $\\theta=${atPi ? '\\pi' : '0'}$: $dy/d\\theta=${N}$, $dx/d\\theta=${b}$. Slope $=${key}$.`], r: 'Polar slope: $\\frac{r\'\\sin\\theta+r\\cos\\theta}{r\'\\cos\\theta-r\\sin\\theta}$.',
      c: () => { const X = t => (a + b * Math.sin(t)) * Math.cos(t), Y = t => (a + b * Math.sin(t)) * Math.sin(t), t0 = atPi ? PI : 0, h = 1e-6; return ((Y(t0 + h) - Y(t0 - h)) / (X(t0 + h) - X(t0 - h))); } });
  }
  const atPi = r.int(0, 1) === 1, key = atPi ? '\\pi' : '-\\dfrac{2}{\\pi}';
  return Q({ q: `Find the slope ${m(R`\dfrac{dy}{dx}`)} of the spiral ${m(R`r=${nz(a, '\\theta')}`)} at ${m(atPi ? R`\theta=\pi` : R`\theta=\frac{\pi}{2}`)}.`, a: 'polar-slope', d: 4, k: key, src: SRC,
    w: [[atPi ? '\\dfrac{1}{\\pi}' : '-\\dfrac{\\pi}{2}', 'Inverted ratio.', 'inverted'], [atPi ? '-\\pi' : '\\dfrac{2}{\\pi}', 'Sign error when evaluating $\\sin,\\cos$.', 'sign'], [atPi ? '0' : '1', 'Check both derivatives numerically.', 'arith'], [atPi ? `${a}\\pi` : `-${a}`, 'Left a factor $a$ in the answer: it cancels in the ratio.', 'coef']],
    s: [`$r\'=${a}$.`, `At $\\theta=${atPi ? '\\pi' : '\\pi/2'}$: ${atPi ? `$dy/d\\theta=${a}\\cdot0+${a}\\pi(-1)=-${a}\\pi$, $dx/d\\theta=${a}(-1)-0=-${a}$` : `$dy/d\\theta=${a}(1)+0=${a}$, $dx/d\\theta=0-${a}\\pi/2\\cdot1=-${a}\\pi/2$`}.`, `Slope $=${key}$.`], r: 'The factor $a$ cancels; at $\\theta=\\frac\\pi2$ or $\\pi$ one of $\\sin,\\cos$ vanishes.',
    c: () => { const X = t => a * t * Math.cos(t), Y = t => a * t * Math.sin(t), t0 = atPi ? PI : PI / 2, h = 1e-6; return ((Y(t0 + h) - Y(t0 - h)) / (X(t0 + h) - X(t0 - h))); } });
});

// =================================================================
// APPLICATIONS: thin topics
// =================================================================
const ABC = (id, k, w, steps, prompt, c) => ({ id, k, w, steps, prompt, c });
gen('g-x-abc', 'applications', 'Area Between Curves', 3, r => {
  const f = r.int(0, 5), k = r.int(2, 6), mm = r.int(1, 3), n = r.int(2, 4), a = r.int(1, 5), kk = r.int(2, 3);
  const T = [
    [`Find the area of the region bounded by ${m(`y=x^2`)} and ${m(`y=${k}x`)}.`, frac(k ** 3, 6), [[frac(-(k ** 3), 6), 'Subtract top minus bottom; area is positive.', 'order'], [frac(k ** 3, 2), 'That is the area under the line only.', 'one-curve'], [frac(k ** 3, 3), 'That is the area under the parabola only.', 'one-curve'], [frac(k ** 3, 1), 'Arithmetic error in $\\int_0^k(kx-x^2)dx=\\frac{k^3}{2}-\\frac{k^3}{3}$.', 'arith']], [`Intersect: $x^2=${k}x\\Rightarrow x=0,${k}$.`, `On $[0,${k}]$ the line is above: $A=\\int_0^{${k}}(${k}x-x^2)dx$.`, `$=\\frac{${k}^3}{2}-\\frac{${k}^3}{3}=${frac(k ** 3, 6)}$.`], () => simp(x => k * x - x * x, 0, k)],
    [`Find the area of the region enclosed by ${m(`y=${mm * mm}-x^2`)} and ${m(`y=x^2-${mm * mm}`)}.`, frac(8 * mm ** 3, 3), [[frac(4 * mm ** 3, 3), 'Half: you integrated only $0$ to ' + mm + '. Use symmetry correctly (double it).', 'symmetry'], [frac(16 * mm ** 3, 3), 'Doubled twice: the vertical gap is $2(m^2-x^2)$ already.', 'symmetry'], [`${4 * mm ** 3}`, 'That treats it as a rectangle of height $2m^2$.', 'rectangle'], [frac(2 * mm ** 3, 3), 'Forgot the factor 2 in the height.', 'height']], [`Intersect: $${mm * mm}-x^2=x^2-${mm * mm}\\Rightarrow x=\\pm${mm}$.`, `Gap $=2(${mm * mm}-x^2)$: $A=2\\displaystyle\\int_{-${mm}}^{${mm}}(${mm * mm}-x^2)dx$.`, `$=${frac(8 * mm ** 3, 3)}$.`], () => simp(x => 2 * (mm * mm - x * x), -mm, mm)],
    [`Find the area between ${m(`y=e^x`)} and ${m(`y=e^{-x}`)} from ${m('x=0')} to ${m(`x=\\ln ${n}`)}.`, frac((n - 1) ** 2, n), [[frac(n * n - 1, n), 'You added the two areas; the region between is the DIFFERENCE.', 'added'], [`${n - 1}`, 'That is the area under $e^x$ only.', 'one-curve'], [frac(n - 1, n), 'That is the area under $e^{-x}$ only.', 'one-curve'], [frac(n * n - 2 * n, n), 'Check $e^{-\\ln n}=\\frac1n$.', 'arith']], ['$e^x\\ge e^{-x}$ for $x\\ge0$.', `$A=\\displaystyle\\int_0^{\\ln ${n}}(e^x-e^{-x})dx=\\left[e^x+e^{-x}\\right]_0^{\\ln ${n}}$.`, `$=${n}+\\frac1${n}-2=${frac((n - 1) ** 2, n)}$.`], () => simp(x => Math.exp(x) - Math.exp(-x), 0, Math.log(n))],
    [`Find the area of the region bounded by ${m(R`y=\sqrt{x}`)} and ${m(R`y=\frac{x}{${k}}`)}.`, frac(k ** 3, 6), [[frac(2 * k ** 3, 3), 'That is the area under $\\sqrt x$ only.', 'one-curve'], [frac(k ** 3, 2), 'You subtracted $\\frac{2}{3}k^3$ and $\\frac{k^3}{3}$; the line integral is $\\frac{k^3}{2}$.', 'arith'], [frac(k ** 3, 3), 'Check the line: $\\int_0^{k^2}\\frac{x}{k}dx=\\frac{k^3}{2}$.', 'arith'], [frac(-(k ** 3), 6), 'Order: $\\sqrt x$ is above the line between the crossings.', 'order']], [`Intersect: $\\sqrt x=x/${k}\\Rightarrow x=0,${k * k}$.`, `$A=\\displaystyle\\int_0^{${k * k}}\\left(\\sqrt x-\\frac x${k}\\right)dx=\\frac23${k}^3-\\frac{${k}^3}{2}$.`, `$=${frac(k ** 3, 6)}$.`], () => simp(x => Math.sqrt(x) - x / k, 0, k * k)],
    [`Find the area between ${m(`y=${a}\\sin x`)} and ${m(`y=${a}\\cos x`)} from ${m('x=0')} to ${m(R`x=\frac{\pi}{2}`)}.`, `${2 * a}\\sqrt{2}-${2 * a}`, [['0', 'The curves cross at $\\frac\\pi4$: the signed integral cancels. Split at the crossing.', 'no-split'], [`${a}\\sqrt{2}-${a}`, 'Only one of the two regions.', 'partial'], [`${4 * a}\\sqrt{2}-${4 * a}`, 'Doubled twice.', 'arith'], [`${2 * a}-${a}\\sqrt{2}`, 'Evaluation slip at the limits.', 'arith']], [`They cross at $x=\\frac\\pi4$.`, `$A=${a}\\displaystyle\\int_0^{\\pi/4}(\\cos x-\\sin x)dx+${a}\\int_{\\pi/4}^{\\pi/2}(\\sin x-\\cos x)dx$.`, `$=${a}(\\sqrt2-1)+${a}(\\sqrt2-1)=${2 * a}\\sqrt2-${2 * a}$.`], () => simp(x => Math.abs(a * Math.sin(x) - a * Math.cos(x)), 0, PI / 2, 8000)],
    [`Find the total area enclosed by ${m(`y=x^3`)} and ${m(`y=${kk * kk}x`)}.`, frac(kk ** 4 * 2, 1) + '', [['0', 'By symmetry the signed areas cancel; the problem wants total (positive) area.', 'no-split'], [`${kk ** 4}`, 'Only one lobe: there are two (left and right).', 'partial'], [`${4 * kk ** 4}`, 'Doubled twice.', 'arith'], [frac(kk ** 4, 4), 'Evaluation slip.', 'arith']], [`Intersect: $x^3=${kk * kk}x\\Rightarrow x=0,\\pm${kk}$.`, `By symmetry $A=2\\displaystyle\\int_0^{${kk}}(${kk * kk}x-x^3)dx$.`, `$=2\\left(\\frac{${kk * kk}\\cdot${kk * kk}}{2}-\\frac{${kk}^4}{4}\\right)=${2 * kk ** 4 / 2 * 1 + 0}$.`], () => 2 * simp(x => kk * kk * x - x ** 3, 0, kk)],
  ][f];
  if (f === 5) { T[1] = `${kk ** 4 / 2}`; T[3][2] = `$=2\\left(\\frac{${kk ** 4}}{2}-\\frac{${kk ** 4}}{4}\\right)=${kk ** 4 / 2}$.`; T[2] = [['0', 'By symmetry the signed areas cancel; the problem wants total (positive) area.', 'no-split'], [`${kk ** 4}`, 'Doubled: you counted four lobes.', 'arith'], [`${kk ** 4 / 4}`, 'Only one lobe: there are two (left and right).', 'partial'], [`${kk ** 4 / 2 + 2}`, 'Evaluation slip.', 'arith']]; T[4] = () => 2 * simp(x => kk * kk * x - x ** 3, 0, kk); }
  return Q({ q: T[0], a: 'abc-' + f, d: 3, k: T[1], w: T[2], s: T[3], r: 'Find intersections, decide who is on top on each piece, integrate (top − bottom).', src: SRC, c: T[4] });
});

gen('g-x-avg', 'applications', 'Average Value', 3, r => {
  const f = r.int(0, 6), b = r.int(2, 6), k = r.int(2, 5), mm = r.int(1, 3), a = r.int(1, 4), a1 = r.int(0, 3), b1 = a1 + r.int(2, 4);
  const T = [
    [`Find the average value of ${m('f(x)=x^2')} on ${m(`[0,${b}]`)}.`, frac(b * b, 3), [[frac(b ** 3, 3), 'That is the integral, not divided by the interval length.', 'no-divide'], [frac(b * b, 2), 'That is $\\frac{f(0)+f(b)}{2}$: the average of endpoint values is not the average value.', 'endpoints'], [frac(b * b, 1), 'That is $f(b)$.', 'endpoint'], [frac(b * b, 6), 'Divided by $2b$ instead of $b$.', 'arith']], [`$f_{avg}=\\frac{1}{${b}-0}\\displaystyle\\int_0^{${b}}x^2dx$.`, `$=\\frac1${b}\\cdot\\frac{${b}^3}{3}=${frac(b * b, 3)}$.`], () => simp(x => x * x, 0, b) / b],
    [`Find the average value of ${m(`f(x)=${a}\\sin x`)} on ${m(R`[0,\pi]`)}.`, R`\frac{${2 * a}}{\pi}`, [[`${2 * a}`, 'Forgot to divide by the length $\\pi$.', 'no-divide'], [R`\frac{${a}}{\pi}`, '$\\int_0^\\pi\\sin x\\,dx=2$, not 1.', 'arith'], ['0', 'That would be the average over a full period $[0,2\\pi]$.', 'period'], [R`\frac{${a}}{\pi}\cdot\frac{1}{2}`, 'Divided by an extra 2 — the interval length is $\\pi$, already used.', 'interval']], ['$f_{avg}=\\frac1\\pi\\displaystyle\\int_0^\\pi a\\sin x\\,dx=\\frac{a}{\\pi}[-\\cos x]_0^\\pi$.', `$=\\frac{${2 * a}}{\\pi}$.`], () => simp(x => a * Math.sin(x), 0, PI) / PI],
    [`Find the average value of ${m(`f(x)=e^{${k}x}`)} on ${m('[0,1]')}.`, R`\frac{e^{${k}}-1}{${k}}`, [[R`e^{${k}}-1`, 'Forgot $\\frac1k$ from the antiderivative.', 'chain'], [R`\frac{e^{${k}}}{${k}}`, 'Forgot to subtract the lower-limit value.', 'limits'], [R`${k}e^{${k}}`, 'Differentiated instead of integrating.', 'wrong-op'], [R`\frac{e^{${k}}-1}{${k + 1}}`, 'Wrong denominator.', 'arith']], [`$f_{avg}=\\frac{1}{1-0}\\displaystyle\\int_0^1e^{${k}x}dx=\\frac1${k}\\left[e^{${k}x}\\right]_0^1$.`, `$=\\frac{e^{${k}}-1}{${k}}$.`], () => simp(x => Math.exp(k * x), 0, 1)],
    [`Find the average value of ${m(R`f(x)=\sqrt{x}`)} on ${m(`[0,${mm * mm}]`)}.`, frac(2 * mm, 3), [[frac(2 * mm ** 3, 3), 'Forgot to divide by the length ' + mm * mm + '.', 'no-divide'], [frac(mm, 2), 'That is the average of the endpoint values $\\frac{0+m}{2}$.', 'endpoints'], [`${mm}`, 'That is $f(' + mm * mm + ')$.', 'endpoint'], [frac(4 * mm, 3), 'Antiderivative of $\\sqrt x$ is $\\frac23x^{3/2}$ — check the $\\frac23$.', 'power']], [`$f_{avg}=\\frac1{${mm * mm}}\\displaystyle\\int_0^{${mm * mm}}x^{1/2}dx=\\frac1{${mm * mm}}\\cdot\\frac23(${mm * mm})^{3/2}$.`, `$=${frac(2 * mm, 3)}$.`], () => simp(x => Math.sqrt(x), 0, mm * mm) / (mm * mm)],
    [`Find the average value of ${m(R`f(x)=\frac1x`)} on ${m(R`[1,e^{${mm}}]`)}.`, R`\frac{${mm}}{e^{${mm}}-1}`.replace('e^{1}', 'e'), [[`${mm}`, 'Forgot to divide by the length $e^m-1$.', 'no-divide'], [R`\frac{1}{e^{${mm}}-1}`.replace('e^{1}', 'e'), '$\\int_1^{e^m}\\frac dx x=\\ln e^m=m$, not 1.', 'arith'], [R`\frac{${mm}}{e^{${mm}}}`.replace('e^{1}', 'e'), 'The interval length is $e^m-1$, not $e^m$.', 'interval'], [R`\frac{${mm}}{e^{${mm}}+1}`.replace('e^{1}', 'e'), 'Length is $b-a=e^m-1$.', 'interval']], [`$f_{avg}=\\frac{1}{e^{${mm}}-1}\\displaystyle\\int_1^{e^{${mm}}}\\frac1x\\,dx$.`, `$=\\frac{\\ln e^{${mm}}-0}{e^{${mm}}-1}=\\frac{${mm}}{e^{${mm}}-1}$.`], () => simp(x => 1 / x, 1, Math.exp(mm), 20000) / (Math.exp(mm) - 1)],
    [`Find the average value of ${m('f(x)=x^2')} on ${m(`[${a1},${b1}]`)}.`, frac(a1 * a1 + a1 * b1 + b1 * b1, 3), [[frac(b1 * b1 + a1 * a1, 2), 'That is the average of endpoint values.', 'endpoints'], [frac(b1 ** 3 - a1 ** 3, 3), 'Not divided by the length $b-a$.', 'no-divide'], [frac(b1 ** 3 - a1 ** 3, 3 * b1), 'Divided by $b$ instead of $b-a$.', 'interval'], [frac(b1 * b1 + b1 * a1 + a1 * a1, 9), 'Over-divided.', 'arith']], [`$f_{avg}=\\frac1{${b1 - a1}}\\displaystyle\\int_{${a1}}^{${b1}}x^2dx=\\frac{${b1}^3-${a1}^3}{3(${b1 - a1})}$.`, `$=${frac(a1 * a1 + a1 * b1 + b1 * b1, 3)}$.`], () => simp(x => x * x, a1, b1) / (b1 - a1)],
    [`Let ${m('f(x)=x^2')} on ${m(`[0,${b}]`)}. The Mean Value Theorem for Integrals guarantees ${m('c')} with ${m(R`f(c)=f_{avg}`)}. Find ${m('c')}.`, R`\frac{${b}\sqrt{3}}{3}`, [[frac(b, 3), 'That is $f_{avg}/b$, not $c$: solve $c^2=f_{avg}$.', 'avg'], [frac(b, 2), 'The midpoint need not satisfy $f(c)=f_{avg}$.', 'midpoint'], [frac(b * b, 3), 'That is $f_{avg}$ itself, not the $x$-value.', 'avg'], [R`\frac{${b}\sqrt{2}}{2}`, 'Solve $c^2=\\frac{b^2}{3}$.', 'arith']], [`$f_{avg}=\\frac{${b * b}}{3}$.`, `$c^2=\\frac{${b * b}}{3}\\Rightarrow c=\\frac{${b}}{\\sqrt3}=\\frac{${b}\\sqrt3}{3}$ (positive root, in $[0,${b}]$).`], () => b / Math.sqrt(3)],
  ][f];
  return Q({ q: T[0], a: 'avg-' + f, d: 3, k: T[1], w: T[2], s: T[3], r: '$f_{avg}=\\dfrac{1}{b-a}\\displaystyle\\int_a^bf(x)\\,dx$ — NOT the average of endpoint values.', src: SRC, c: T[4] });
});

gen('g-x-shell-eval', 'applications', 'Volumes: Shells', 4, r => {
  const f = r.int(0, 5), b = r.int(1, 3), k = r.int(2, 5), mm = r.int(1, 3), a = r.int(1, 4), bb = r.int(1, 2), cc = bb + r.int(1, 2);
  const T = [
    [`Use cylindrical shells to find the volume generated by rotating the region under ${m('y=x^2')}, ${m(`0\\le x\\le ${b}`)}, about the $y$-axis.`, pif(b ** 4, 2), [[pif(b ** 4, 4), 'Forgot the $2$ in $2\\pi$.', 'dropped-2'], [pif(2 * b ** 3, 3), 'Forgot the radius $x$ in the integrand.', 'no-radius'], [pif(b ** 5, 5), 'That is disks about the $x$-axis ($\\pi\\int y^2$).', 'wrong-method'], [pif(2 * b ** 4, 1), 'Arithmetic: $2\\pi\\int_0^bx^3dx=2\\pi\\frac{b^4}{4}$.', 'arith']], ['Shell radius $x$, height $x^2$, thickness $dx$.', `$V=2\\pi\\displaystyle\\int_0^{${b}}x\\cdot x^2dx=2\\pi\\frac{${b}^4}{4}=${pif(b ** 4, 2)}$.`], () => 2 * PI * simp(x => x ** 3, 0, b)],
    [`Use shells: rotate the region between ${m('y=x^2')} and ${m(`y=${k}x`)} about the $y$-axis. Find the volume.`, pif(k ** 4, 6), [[pif(k ** 4, 12), 'Forgot the $2$ in $2\\pi$.', 'dropped-2'], [pif(k ** 3, 3), 'Forgot the radius $x$.', 'no-radius'], [pif(2 * k ** 5, 15), 'That is washers about the $x$-axis.', 'wrong-method'], [pif(k ** 4, 2), 'Used only the line as height (no subtraction).', 'one-curve']], [`Intersect at $x=0,${k}$; line is higher. Height $=${k}x-x^2$.`, `$V=2\\pi\\displaystyle\\int_0^{${k}}x(${k}x-x^2)dx=2\\pi\\left(\\frac{${k}^4}{3}-\\frac{${k}^4}{4}\\right)=${pif(k ** 4, 6)}$.`], () => 2 * PI * simp(x => x * (k * x - x * x), 0, k)],
    [`Use shells: rotate the region under ${m(R`y=\sqrt{x}`)}, ${m(`0\\le x\\le ${mm * mm}`)}, about the $y$-axis.`, pif(4 * mm ** 5, 5), [[pif(2 * mm ** 5, 5), 'Forgot the $2$ in $2\\pi$.', 'dropped-2'], [pif(4 * mm ** 3, 3), 'Forgot the radius $x$.', 'no-radius'], [pif(mm ** 4, 2), 'That is disks about the $x$-axis.', 'wrong-method'], [pif(2 * mm ** 5, 3), 'Power rule slip: $\\int x^{3/2}=\\frac25x^{5/2}$.', 'power']], ['Radius $x$, height $\\sqrt x$.', `$V=2\\pi\\displaystyle\\int_0^{${mm * mm}}x^{3/2}dx=2\\pi\\cdot\\frac25(${mm * mm})^{5/2}=${pif(4 * mm ** 5, 5)}$.`], () => 2 * PI * simp(x => x ** 1.5, 0, mm * mm)],
    [`Use shells: rotate the region under ${m('y=x^2')}, ${m(`0\\le x\\le ${bb}`)}, about the line ${m(`x=${cc}`)}.`, pif(4 * cc * bb ** 3 - 3 * bb ** 4, 6), [[pif(bb ** 4, 2), 'Radius is the distance to the axis, $(' + cc + '-x)$, not $x$.', 'wrong-radius'], [pif(-(4 * cc * bb ** 3 - 3 * bb ** 4), 6), 'Radius $x-' + cc + '$ is negative; use the positive distance.', 'sign'], [pif(4 * cc * bb ** 3 - 3 * bb ** 4, 12), 'Forgot the $2$ in $2\\pi$.', 'dropped-2'], [pif(4 * cc * bb ** 3 + 3 * bb ** 4, 6), 'Radius is $c-x$, not $c+x$.', 'wrong-radius']], [`Radius $${cc}-x$, height $x^2$.`, `$V=2\\pi\\displaystyle\\int_0^{${bb}}(${cc}-x)x^2dx=2\\pi\\left(\\frac{${cc}\\cdot${bb}^3}{3}-\\frac{${bb}^4}{4}\\right)$.`, `$=${pif(4 * cc * bb ** 3 - 3 * bb ** 4, 6)}$.`], () => 2 * PI * simp(x => (cc - x) * x * x, 0, bb)],
    [`Use shells: rotate the region under ${m(`y=${nz(a, '\\sin x')}`)}, ${m(R`0\le x\le\pi`)}, about the $y$-axis.`, `${nz(2 * a, '\\pi^{2}')}`, [[`${nz(a, '\\pi^{2}')}`, 'Forgot the $2$ in $2\\pi$.', 'dropped-2'], [`${4 * a}\\pi`, 'Forgot the radius $x$: that is $2\\pi\\int a\\sin x$.', 'no-radius'], [R`\frac{${a * a}\pi^{2}}{2}`, 'That is disks about the $x$-axis: $\\pi\\int y^2dx$.', 'wrong-method'], [`${nz(2 * a, '\\pi')}`, 'Integration by parts: $\\int_0^\\pi x\\sin x\\,dx=\\pi$, not 1.', 'parts']], ['Radius $x$, height $a\\sin x$.', `$V=2\\pi a\\displaystyle\\int_0^\\pi x\\sin x\\,dx$ (parts) $=2\\pi a\\cdot\\pi=${nz(2 * a, '\\pi^{2}')}$.`], () => 2 * PI * simp(x => x * a * Math.sin(x), 0, PI)],
    [`Use shells: rotate the region under ${m(R`y=e^{-x^2}`)}, ${m(`0\\le x\\le ${b}`)}, about the $y$-axis.`, R`\pi\left(1-e^{-${b * b}}\right)`, [[R`2\pi\left(1-e^{-${b * b}}\right)`, 'Missed the $\\frac12$ from $u=x^2,\\ du=2x\\,dx$.', 'u-sub'], [R`\pi e^{-${b * b}}`, 'Forgot the "$1-$" from the lower limit.', 'limits'], [R`\pi\left(e^{-${b * b}}-1\right)`, 'Sign: volume cannot be negative.', 'sign'], [R`\pi\left(1-e^{-${b}}\right)`, 'Substituting $u=x^2$ changes the limit to $' + b * b + '$, not $' + b + '$.', 'u-sub']], ['Radius $x$, height $e^{-x^2}$.', `$V=2\\pi\\displaystyle\\int_0^{${b}}xe^{-x^2}dx$, $u=x^2$.`, `$=\\pi\\displaystyle\\int_0^{${b * b}}e^{-u}du=\\pi(1-e^{-${b * b}})$.`], () => 2 * PI * simp(x => x * Math.exp(-x * x), 0, b)],
  ][f];
  return Q({ q: T[0], a: 'shell-' + f, d: 4, k: T[1], w: T[2], s: T[3], r: 'Shells: $V=2\\pi\\int(\\text{radius})(\\text{height})\\,dx$. Radius = distance from the axis of rotation.', src: SRC, c: T[4] });
});

gen('g-x-shell-setup', 'applications', 'Volumes: Shells', 3, r => {
  const c = r.int(2, 4), a = r.int(2, 4), c2 = r.int(5, 7);
  const V = (lo, hi, body) => `2\\pi\\int_{${lo}}^{${hi}}${body}\\,dx`;
  const T = [
    [`Set up, but do not evaluate, an integral for the volume obtained by rotating the region bounded by ${m('y=x^2')} and ${m('y=2-x^2')} about the line ${m(`x=${c + 1}`)}.`, V('-1', '1', `(${c + 1}-x)(2-2x^2)`), [V('-1', '1', `x(2-2x^2)`), 'Radius is the distance to the axis $x=' + (c + 1) + '$, i.e. $' + (c + 1) + '-x$.'], [V('-1', '1', `(${c + 1}-x)(x^2-(2-x^2))`), 'Height is top minus bottom: $(2-x^2)-x^2$.'], [V('0', '1', `(${c + 1}-x)(2-2x^2)`), 'The region spans $-1$ to $1$ (curves meet at $x=\\pm1$).'], [V('-1', '1', `(${c + 1}+x)(2-2x^2)`), 'Radius is $c-x$, not $c+x$.']],
    [`Set up, but do not evaluate, an integral for the volume obtained by rotating the first-quadrant region between the $x$-axis and ${m(`y=${a}x-x^2`)} about the $y$-axis.`, V('0', `${a}`, `x(${a}x-x^2)`), [V('0', `${a}`, `(${a}x-x^2)`), 'Forgot the radius $x$.'], [`\\pi\\int_0^{${a}}(${a}x-x^2)^2dx`, 'That is the disk method about the $x$-axis.'], [V('0', `${a}`, `x^2(${a}x-x^2)`), 'Radius is $x$, not $x^2$.'], [V('0', `${a * 2}`, `x(${a}x-x^2)`), 'Upper limit: the parabola meets the axis at $x=' + a + '$.']],
    [`Set up, but do not evaluate, an integral for the volume obtained by rotating the region under ${m(R`y=\sqrt{x}`)}, ${m(R`0\le x\le 4`)}, about the line ${m(`x=${c2}`)}.`, V('0', '4', `(${c2}-x)\\sqrt{x}`), [V('0', '4', `x\\sqrt{x}`), 'Radius is the distance to $x=' + c2 + '$.'], [V('0', '4', `(${c2}-x)x`), 'Height is $\\sqrt x$, not $x$.'], [`\\pi\\int_0^4(${c2}-x)^2\\,dx`, 'That mixes washers with shells.'], [V('0', '4', `(x-${c2})\\sqrt{x}`), 'Radius must be positive: $c-x$.']],
    [`Set up, but do not evaluate, an integral for the volume obtained by rotating the region between ${m('y=x')} and ${m('y=x^2')} about the line ${m('x=-1')}.`, V('0', '1', '(x+1)(x-x^2)'), [V('0', '1', 'x(x-x^2)'), 'The axis is $x=-1$, so the radius is $x-(-1)=x+1$.'], [V('0', '1', '(1-x)(x-x^2)'), 'Radius is $x+1$ (axis to the left).'], [V('0', '1', '(x+1)(x^2-x)'), 'Height is top minus bottom: $x-x^2\\ge0$.'], [V('-1', '1', '(x+1)(x-x^2)'), 'The curves enclose a region only on $[0,1]$.']],
  ];
  const t = T[r.int(0, 3)];
  return Q({ q: t[0], a: 'shell-setup', d: 3, k: t[1], w: t.slice(2).map(([x, why]) => [x, why, 'setup']), s: ['Sketch; pick shell radius = distance from the axis; height = top − bottom.', 'Thickness $dx$ means the limits are $x$-values.'], r: '$V=2\\pi\\int(\\text{distance to axis})\\cdot(\\text{height})\\,dx$.', src: 'MAT 296 Fall 2016 final p.1 (setup-only archetype)' });
});

gen('g-x-centroid', 'applications', 'Centroids', 4, r => {
  const f = r.int(0, 3), n = r.int(2, 3), b = r.int(1, 4), R_ = r.int(1, 6), nn = r.int(2, 3);
  if (f === 0) {
    const askX = r.int(0, 1) === 0, kx = frac((n + 1) * b, n + 2), ky = frac((n + 1) * b ** n, 2 * (2 * n + 1));
    const area = () => simp(x => x ** n, 0, b);
    return Q({ q: `Find the ${askX ? m(R`\bar{x}`) : m(R`\bar{y}`)} coordinate of the centroid of the region under ${m(`y=x^{${n}}`)} for ${m(`0\\le x\\le ${b}`)}.`, a: 'centroid-power', d: 4, k: askX ? kx : ky, src: SRC,
      w: askX
        ? [[frac(b, 2), 'The centroid is not the midpoint: more area sits near $x=b$ for an increasing curve.', 'midpoint'], [frac((n + 2) * b, n + 1), 'Inverted ratio (would lie outside $[0,b]$).', 'inverted'], [frac(n * b, n + 1), 'That is $\\frac{\\int x\\,f}{\\int f}$ with an off-by-one exponent.', 'power'], [frac((n + 1) * b, n + 3), 'Moment integral has $x^{n+1}$, so the exponent after integrating is $n+2$.', 'power']]
        : [[frac((n + 1) * b ** n, 2 * n + 1), 'Forgot the $\\frac12$ in $\\bar y=\\frac{1}{A}\\int\\frac12f^2$.', 'dropped-half'], [frac((n + 1) * b, n + 2), 'That is $\\bar x$.', 'wrong-coordinate'], [frac(b ** n, 2), 'That is half the height at $x=b$: not the centroid.', 'midpoint'], [frac((n + 1) * b ** n, 4 * n + 1), 'Check $\\int_0^bx^{2n}dx=\\frac{b^{2n+1}}{2n+1}$.', 'arith']],
      s: [`Area $A=\\displaystyle\\int_0^{${b}}x^{${n}}dx=\\frac{${b}^{${n + 1}}}{${n + 1}}$.`, askX ? `$\\bar x=\\frac1A\\displaystyle\\int_0^{${b}}x\\cdot x^{${n}}dx=\\frac{(${n + 1})\\,${b}}{${n + 2}}$.` : `$\\bar y=\\frac1A\\cdot\\frac12\\displaystyle\\int_0^{${b}}x^{${2 * n}}dx=\\frac{(${n + 1})${b}^{${n}}}{${2 * (2 * n + 1)}}$.`, `Answer: $${askX ? kx : ky}$.`], r: '$\\bar x=\\frac1A\\int xf\\,dx,\\ \\bar y=\\frac1A\\int\\frac12f^2dx$.',
      c: () => (askX ? simp(x => x * x ** n, 0, b) / area() : simp(x => 0.5 * x ** (2 * n), 0, b) / area()) });
  }
  if (f === 1) return Q({ q: `Find the ${m(R`\bar{y}`)} coordinate of the centroid of the upper half-disk ${m(`x^2+y^2\\le ${R_ * R_}`)}, ${m('y\\ge0')}.`, a: 'centroid-semi', d: 4, k: R`\frac{${4 * R_}}{3\pi}`, src: SRC,
    w: [[frac(R_, 2), 'Half the radius is the centroid of a triangle-like shape, not a semicircle.', 'midpoint'], [R`\frac{${2 * R_}}{\pi}`, 'That is the centroid of the semicircular ARC (a curve), not the region.', 'arc'], [R`\frac{${4 * R_}}{3}`, 'Forgot to divide by the area $\\frac{\\pi R^2}{2}$.', 'no-area'], [R`\frac{${4 * R_}}{\pi}`, 'Missing the $3$: $\\int\\frac12(R^2-x^2)dx=\\frac{2R^3}{3}$.', 'arith']],
    s: [`$A=\\frac{\\pi ${R_}^2}{2}$ and $\\bar y=\\frac1A\\displaystyle\\int_{-${R_}}^{${R_}}\\frac12(${R_ * R_}-x^2)dx=\\frac1A\\cdot\\frac{2\\cdot${R_}^3}{3}$.`, `$\\bar y=\\frac{4R}{3\\pi}=\\frac{${4 * R_}}{3\\pi}$.`], r: 'Semicircle region: $\\bar y=\\frac{4R}{3\\pi}$ (arc: $\\frac{2R}{\\pi}$).', c: () => (simp(x => 0.5 * (R_ * R_ - x * x), -R_, R_) / (PI * R_ * R_ / 2)) });
  if (f === 2) { const tb = { 2: [[1, 2], [2, 5]], 3: [[8, 15], [8, 21]] }[nn], askX = r.int(0, 1) === 0, v = tb[askX ? 0 : 1];
    const A = simp(x => x - x ** nn, 0, 1);
    return Q({ q: `Find the ${askX ? m(R`\bar{x}`) : m(R`\bar{y}`)} coordinate of the centroid of the region between ${m('y=x')} and ${m(`y=x^{${nn}}`)} for ${m('0\\le x\\le1')}.`, a: 'centroid-between', d: 4, k: frac(v[0], v[1]), src: SRC,
      w: [[frac(1, 2), 'The region is not symmetric; the midpoint is not the centroid.', 'midpoint'], [askX ? frac(tb[1][0], tb[1][1]) : frac(tb[0][0], tb[0][1]), 'That is the other coordinate.', 'wrong-coordinate'], [frac(v[0] * 2, v[1]), 'Forgot to divide by the area (or used the wrong area).', 'no-area'], [frac(v[0], v[1] * 2), 'Over-divided.', 'arith'], [frac(v[0] + 1, v[1] + 1), 'Not a valid simplification.', 'arith']],
      s: [`Area $A=\\displaystyle\\int_0^1(x-x^{${nn}})dx=${frac(nn - 1, 2 * (nn + 1))}$.`, askX ? `$\\bar x=\\frac1A\\displaystyle\\int_0^1x(x-x^{${nn}})dx$.` : `$\\bar y=\\frac1A\\displaystyle\\int_0^1\\frac12\\left(x^2-x^{${2 * nn}}\\right)dx$.`, `$=${frac(v[0], v[1])}$.`], r: 'For a region between curves use top$^2-$bottom$^2$ in the $\\bar y$ formula.',
      c: () => (askX ? simp(x => x * (x - x ** nn), 0, 1) / A : simp(x => 0.5 * (x * x - x ** (2 * nn)), 0, 1) / A) }); }
  const bb = 3 * r.int(1, 3), hh = 3 * r.int(1, 3);
  return Q({ q: `Find the centroid of the triangle with vertices ${m(`(0,0),\\ (${bb},0),\\ (0,${hh})`)}.`, a: 'centroid-tri', d: 3, k: `(${bb / 3},${hh / 3})`, src: SRC,
    w: [[`(${frac(bb, 2)},${frac(hh, 2)})`, 'That is the midpoint of the hypotenuse region box; centroid is at one third.', 'midpoint'], [`(${frac(2 * bb, 3)},${frac(2 * hh, 3)})`, 'Two thirds measured from the wrong vertex.', 'wrong-third'], [`(${bb / 3},${frac(hh, 2)})`, 'Both coordinates use the same one-third rule.', 'mixed'], [`(${frac(bb, 3)},${frac(2 * hh, 3)})`, 'Both coordinates use the same one-third rule.', 'mixed']],
    s: ['Centroid of a triangle = average of the vertices.', `$\\bar x=\\frac{0+${bb}+0}{3},\\ \\bar y=\\frac{0+0+${hh}}{3}$.`], r: 'Triangle centroid: average of the three vertices (one third up from each side).', c: () => bb / 3 });
});

// =================================================================
// PRECALC thin topics
// =================================================================
gen('g-x-trigid', 'precalc', 'Trig Identities', 3, r => {
  const v = r.pick(['x', 't']), f = r.int(0, 2);
  if (f === 0) {
    const T = [
      [R`\frac{1-\cos^{2}${v}}{\sin ${v}}`, R`\sin ${v}`, [[R`\cos ${v}`, '$1-\\cos^2=\\sin^2$, not $\\cos$.'], [R`\sin^{2}${v}`, 'One factor of $\\sin$ cancels.'], [R`\tan ${v}`, 'The numerator is $\\sin^2$, no $\\cos$ in it.'], ['1', 'Not $1$: after cancelling one $\\sin$, one remains.']]],
      [R`\sin^{2}${v}+\cos^{2}${v}+\tan^{2}${v}`, R`\sec^{2}${v}`, [[R`\tan^{2}${v}`, 'Forgot that $\\sin^2+\\cos^2=1$ adds a 1.'], ['1', 'You dropped $\\tan^2$.'], [R`\csc^{2}${v}`, '$1+\\cot^2=\\csc^2$ — the tangent version is $\\sec^2$.'], [R`\cot^{2}${v}`, 'Wrong Pythagorean variant.']]],
      [R`(1-\sin ${v})(1+\sin ${v})`, R`\cos^{2}${v}`, [[R`\sin^{2}${v}`, 'Difference of squares: $1-\\sin^2$.'], [R`1+\sin^{2}${v}`, 'Sign slip: it is $1-\\sin^2$.'], [R`\cos ${v}`, 'It is squared.'], ['1', 'Only if you forgot to square $\\sin$.']]],
      [R`\frac{\sin 2${v}}{\cos ${v}}`, R`2\sin ${v}`, [[R`2\cos ${v}`, 'Cosine cancels, leaving sine.'], [R`\sin ${v}`, 'Forgot the 2 in $\\sin2x=2\\sin x\\cos x$.'], [R`2\tan ${v}`, 'Only one $\\cos$ cancels; no leftover denominator.'], [R`\sin ${v}\cos ${v}`, 'Missed the double-angle expansion.']]],
      [R`\sec^{2}${v}-1`, R`\tan^{2}${v}`, [[R`\sin^{2}${v}`, 'Wrong Pythagorean identity.'], [R`\cot^{2}${v}`, '$\\csc^2-1=\\cot^2$, not $\\sec^2-1$.'], ['0', 'Not an identity for constant zero.'], [R`\cos^{2}${v}`, 'Wrong identity.']]],
      [R`\cos^{2}${v}-\sin^{2}${v}`, R`\cos 2${v}`, [['1', 'That is $\\cos^2+\\sin^2$.'], [R`\sin 2${v}`, 'Double-angle for cosine, not sine.'], [R`2\cos^{2}${v}`, 'That is $\\cos^2+\\cos^2-1+...$ — not equivalent.'], [R`\cos ${v}`, 'Squared terms do not collapse to a single power.']]],
      [R`\frac{\tan ${v}}{\sec ${v}}`, R`\sin ${v}`, [[R`\cos ${v}`, '$\\tan/\\sec=\\frac{\\sin/\\cos}{1/\\cos}=\\sin$.'], [R`\tan ${v}`, 'You cancelled the wrong function.'], ['1', 'Not constant.'], [R`\csc ${v}`, 'Inverted.']]],
      [R`\frac{1-\cos 2${v}}{2}`, R`\sin^{2}${v}`, [[R`\cos^{2}${v}`, 'Power-reducing: $\\sin^2=\\frac{1-\\cos2x}{2}$, $\\cos^2=\\frac{1+\\cos2x}{2}$.'], [R`\sin 2${v}`, 'Mixing double-angle and power-reducing.'], [R`\frac{\sin ${v}}{2}`, 'No such simplification.']]],
    ];
    const t = r.pick(T);
    return Q({ q: `Simplify ${m(t[0])} to a single trig expression.`, a: 'trig-simplify', d: 3, f: 'free', k: t[1], w: t[2].map(([x, why]) => [x, why, 'identity']), s: ['Rewrite using Pythagorean / double-angle identities.', 'Cancel common factors.'], r: '$\\sin^2+\\cos^2=1,\\ 1+\\tan^2=\\sec^2,\\ \\cos2x=\\cos^2-\\sin^2,\\ \\sin2x=2\\sin\\cos$.', src: SRC, c: { eq: [t[0], t[1]] } });
  }
  if (f === 1) {
    const [p, c, q] = r.pick([[3, 4, 5], [4, 3, 5], [5, 12, 13], [12, 5, 13], [8, 15, 17], [7, 24, 25]]), qII = r.int(0, 1) === 1, askS = r.int(0, 1) === 0, sgnC = qII ? -1 : 1;
    const s2 = frac(sgnC * 2 * p * c, q * q), c2 = frac(q * q - 2 * p * p, q * q);
    return Q({ q: askS ? `If ${m(R`\sin\theta=\frac{${p}}{${q}}`)} and $\\theta$ is in quadrant ${qII ? 'II' : 'I'}, find ${m(R`\sin 2\theta`)}.` : `If ${m(R`\sin\theta=\frac{${p}}{${q}}`)}, find ${m(R`\cos 2\theta`)}.`, a: 'trig-double', d: 3, f: 'free', k: askS ? s2 : c2, src: SRC,
      w: askS
        ? [[frac(-sgnC * 2 * p * c, q * q), qII ? '$\\cos\\theta<0$ in quadrant II, so $\\sin2\\theta<0$.' : 'In quadrant I both are positive.', 'sign'], [frac(2 * p, q), '$\\sin2\\theta\\ne2\\sin\\theta$: you need the $\\cos\\theta$ factor.', 'linear'], [frac(q * q - 2 * p * p, q * q), 'That is $\\cos2\\theta$.', 'wrong-identity'], [frac(2 * p * c, q), 'Squared denominator: $\\sin\\theta\\cos\\theta=\\frac{pc}{q^2}$.', 'arith']]
        : [[frac(2 * p * p - q * q, q * q), 'Sign: $\\cos2\\theta=1-2\\sin^2\\theta$.', 'sign'], [frac(2 * p * c, q * q), 'That is $\\sin2\\theta$.', 'wrong-identity'], [frac(2 * c * c - q * q, q * q) === c2 ? frac(c * c, q * q) : frac(2 * c * c - q * q, q * q), 'That is $\\cos2\\theta$ with the wrong leg; check which leg is $\\sin\\theta$.', 'leg'], [frac(q * q - p * p, q * q), 'That is $\\cos^2\\theta$ — missing the second $\\sin^2$.', 'identity'], [frac(1 - 2 * p, q), 'Squares dropped.', 'arith']],
      s: askS ? [`Pythagoras: $\\cos\\theta=${qII ? '-' : ''}\\frac{${c}}{${q}}$ (${qII ? 'negative in QII' : 'positive in QI'}).`, `$\\sin2\\theta=2\\sin\\theta\\cos\\theta=${s2}$.`] : [`$\\cos2\\theta=1-2\\sin^2\\theta=1-2\\cdot\\frac{${p * p}}{${q * q}}=${c2}$.`, 'No quadrant needed.'], r: '$\\sin2\\theta=2\\sin\\theta\\cos\\theta$ needs the sign of $\\cos\\theta$; $\\cos2\\theta=1-2\\sin^2\\theta$ does not.',
      c: { v: askS ? () => { const th = qII ? PI - Math.asin(p / q) : Math.asin(p / q); return Math.sin(2 * th); } : () => Math.cos(2 * Math.asin(p / q)) } });
  }
  const a = r.int(2, 5), bb = r.int(1, a - 1), k = r.int(1, 4), ct = x => `${x === 1 ? '' : x}${v}`, kind = r.int(0, 4);
  const T2 = [
    [R`\sin^{2}(${ct(k)})`, R`\frac{1-\cos(${ct(2 * k)})}{2}`, [[R`\frac{1+\cos(${ct(2 * k)})}{2}`, 'Sign: $\\sin^2$ uses $1-\\cos2\\theta$.'], [R`\frac{1-\cos(${ct(k)})}{2}`, 'The argument doubles: $\\cos(2\\cdot kx)$.'], [R`1-\cos(${ct(2 * k)})`, 'Missing the $\\frac12$.'], [R`\frac{1-\cos^2(${ct(2 * k)})}{2}`, 'Not squared again.']]],
    [R`\cos^{2}(${ct(k)})`, R`\frac{1+\cos(${ct(2 * k)})}{2}`, [[R`\frac{1-\cos(${ct(2 * k)})}{2}`, 'Sign: $\\cos^2$ uses $1+\\cos2\\theta$.'], [R`\frac{1+\cos(${ct(k)})}{2}`, 'The argument doubles.'], [R`1+\cos(${ct(2 * k)})`, 'Missing the $\\frac12$.'], [R`\frac{1+\cos^2(${ct(2 * k)})}{2}`, 'Not squared again.']]],
    [R`\sin(${ct(a)})\cos(${ct(bb)})`, R`\frac{1}{2}\left[\sin(${ct(a + bb)})+\sin(${ct(a - bb)})\right]`, [[R`\frac{1}{2}\left[\cos(${ct(a + bb)})+\cos(${ct(a - bb)})\right]`, 'Wrong function: $\\sin A\\cos B$ gives sines.'], [R`\sin(${ct(a + bb)})+\sin(${ct(a - bb)})`, 'Missing the $\\frac12$.'], [R`\frac{1}{2}\left[\sin(${ct(a + bb)})-\sin(${ct(a - bb)})\right]`, 'Sign: it is a SUM of sines.'], [R`\frac{1}{2}\sin(${ct(a * bb)})`, 'Frequencies add and subtract; they do not multiply.']]],
    [R`\cos(${ct(a)})\cos(${ct(bb)})`, R`\frac{1}{2}\left[\cos(${ct(a - bb)})+\cos(${ct(a + bb)})\right]`, [[R`\frac{1}{2}\left[\cos(${ct(a - bb)})-\cos(${ct(a + bb)})\right]`, 'Sign: $\\cos A\\cos B$ is a SUM.'], [R`\cos(${ct(a - bb)})+\cos(${ct(a + bb)})`, 'Missing the $\\frac12$.'], [R`\frac{1}{2}\left[\sin(${ct(a - bb)})+\sin(${ct(a + bb)})\right]`, 'Wrong function.'], [R`\frac{1}{2}\cos(${ct(a * bb)})`, 'Frequencies add and subtract.']]],
    [R`\sin(${ct(a)})\sin(${ct(bb)})`, R`\frac{1}{2}\left[\cos(${ct(a - bb)})-\cos(${ct(a + bb)})\right]`, [[R`\frac{1}{2}\left[\cos(${ct(a - bb)})+\cos(${ct(a + bb)})\right]`, 'Sign: $\\sin A\\sin B$ is a DIFFERENCE, difference-first.'], [R`\frac{1}{2}\left[\cos(${ct(a + bb)})-\cos(${ct(a - bb)})\right]`, 'Order: $\\cos(A-B)$ comes first.'], [R`\cos(${ct(a - bb)})-\cos(${ct(a + bb)})`, 'Missing the $\\frac12$.'], [R`\frac{1}{2}\left[\sin(${ct(a - bb)})-\sin(${ct(a + bb)})\right]`, 'Wrong function.']]],
  ][kind];
  return Q({ q: `Rewrite ${m(T2[0])} as a sum/difference with no products or powers of trig functions.`, a: 'trig-rewrite', d: 3, k: T2[1], w: T2[2].map(([x, why]) => [x, why, 'identity']), s: ['Use the power-reducing / product-to-sum identity.', 'Check by plugging in a value.'], r: '$\\sin A\\cos B=\\frac12[\\sin(A+B)+\\sin(A-B)]$, $\\cos A\\cos B=\\frac12[\\cos(A-B)+\\cos(A+B)]$, $\\sin A\\sin B=\\frac12[\\cos(A-B)-\\cos(A+B)]$.', src: SRC, c: { eq: [T2[0], T2[1]] } });
});

gen('g-x-geom', 'precalc', 'Geometry Formulas', 2, r => {
  const f = r.int(0, 6), R_ = r.pick([2, 3, 4, 5, 6]), h = r.pick([3, 4, 6, 8]), [tn, td] = r.pick([[1, 3], [1, 4], [1, 6], [2, 3], [3, 4], [5, 6], [1, 2]]), rs = r.pick([4, 6, 8, 10, 12]);
  const [rt, ht, lt] = r.pick([[3, 4, 5], [5, 12, 13], [6, 8, 10], [8, 6, 10]]), a = r.pick([4, 6, 8, 10]), bb = r.pick([6, 8, 12]), cs = r.int(0, 3), outer = R_ + r.int(1, 3);
  const T = [
    [`A sector of a circle of radius ${rs} has central angle ${m(pif(tn, td))}. Find its area.`, pif(rs * rs * tn, 2 * td), [[pif(rs * rs * tn, td), 'Forgot the $\\frac12$ in $A=\\frac12r^2\\theta$.'], [pif(rs * tn, 2 * td), 'Used $r$ instead of $r^2$.'], [pif(rs * tn, td), 'That is the ARC LENGTH $s=r\\theta$.'], [pif(rs * rs * tn, 4 * td), 'Over-divided.']], ['$A=\\frac12r^2\\theta$ (angle in radians).'], 'Sector: $A=\\frac12r^2\\theta$; arc: $s=r\\theta$.'],
    [`A circular arc has radius ${rs} and central angle ${m(pif(tn, td))}. Find its length.`, pif(rs * tn, td), [[pif(rs * tn, 2 * td), 'That has a stray $\\frac12$: $s=r\\theta$, no half.'], [pif(rs * rs * tn, 2 * td), 'That is the sector AREA.'], [pif(rs * rs * tn, td), 'Squared $r$.'], [pif(2 * rs * tn, td), 'Extra factor 2 (that is a diameter).']], ['$s=r\\theta=' + rs + '\\cdot' + pif(tn, td) + '$.'], 'Arc length $s=r\\theta$ requires radians.'],
    [`Find the volume of a sphere of ${r.int(0, 1) ? 'radius' : 'radius'} ${R_}.`, pif(4 * R_ ** 3, 3), [[pif(4 * R_ * R_, 1), 'That is the SURFACE area $4\\pi r^2$.'], [pif(R_ ** 3, 3), 'Forgot the 4: $V=\\frac43\\pi r^3$.'], [pif(4 * (2 * R_) ** 3, 3), 'Used the diameter as radius.'], [pif(2 * R_ ** 3, 3), '$\\frac23\\pi r^3$ is a hemisphere.']], ['$V=\\frac43\\pi r^3$.'], 'Sphere: $V=\\frac43\\pi r^3$, $S=4\\pi r^2$.'],
    [`Find the volume of a right circular cone with base radius ${R_} and height ${h}.`, pif(R_ * R_ * h, 3), [[pif(R_ * R_ * h, 1), 'That is a cylinder: cone is $\\frac13$.'], [pif(R_ * h, 3), 'Radius must be squared.'], [pif(R_ * R_ * h, 6), 'Over-divided.'], [pif(R_ * R_ * h, 2), 'Wrong fraction: cone is $\\frac13$.']], ['$V=\\frac13\\pi r^2h$.'], 'Cone: $V=\\frac13\\pi r^2h$ (a third of the cylinder).'],
    [`Find the lateral (side) surface area of a right circular cone with base radius ${rt} and height ${ht}.`, pif(rt * lt, 1), [[pif(rt * ht, 1), 'Used the height, not the slant height $\\ell=\\sqrt{r^2+h^2}=' + lt + '$.'], [pif(rt * (rt + lt), 1), 'That includes the base disk (total surface area).'], [pif(rt * lt, 3), 'The $\\frac13$ belongs to volume, not area.'], [pif(2 * rt * lt, 1), 'Cone lateral area is $\\pi r\\ell$, no 2.']], [`Slant height $\\ell=\\sqrt{${rt}^2+${ht}^2}=${lt}$.`, `$A=\\pi r\\ell=${pif(rt * lt, 1)}$.`], 'Cone lateral area $\\pi r\\ell$ with slant height $\\ell=\\sqrt{r^2+h^2}$.'],
    [`A right triangle-free setup: a triangle has sides ${a} and ${bb} with included angle ${m(['\\frac{\\pi}{6}', '\\frac{\\pi}{4}', '\\frac{\\pi}{3}', '\\frac{\\pi}{2}'][cs])}. Find its area.`, [frac(a * bb, 4), rad(a * bb, 4, 2), rad(a * bb, 4, 3), frac(a * bb, 2)][cs], [[`${a * bb}`, 'Forgot the $\\frac12$ and the sine.'], [[frac(a * bb, 2), frac(a * bb, 2), frac(a * bb, 2), `${a * bb}`][cs], 'Used $\\sin\\theta=1$ regardless of the angle.'], [[rad(a * bb, 4, 3), rad(a * bb, 4, 3), rad(a * bb, 4, 2), '0'][cs], 'Used $\\cos\\theta$ instead of $\\sin\\theta$.'], [frac(a * bb, 8), 'Over-divided.']], ['$A=\\frac12ab\\sin C$.'], 'Triangle: $A=\\frac12ab\\sin C$.'],
    [`Find the area of the ring (annulus) between concentric circles of radii ${R_} and ${outer}.`, pif(outer * outer - R_ * R_, 1), [[pif((outer - R_) ** 2, 1), 'Subtract the AREAS ($R^2-r^2$), not the radii first.'], [pif(outer * outer + R_ * R_, 1), 'Subtract, do not add.'], [pif(2 * (outer - R_), 1), 'That looks like a circumference difference.'], [pif((outer - R_) * (outer + R_), 2), 'Stray $\\frac12$.']], ['$A=\\pi(R^2-r^2)$.'], 'Annulus: $\\pi(R^2-r^2)$.'],
  ][f];
  return Q({ q: T[0], a: 'geom-' + f, d: 2, f: 'free', k: T[1], w: T[2].map(([x, why]) => [x, why, 'formula']), s: T[3], r: T[4], src: SRC });
});

gen('g-x-invtrig', 'precalc', 'Inverse Trig Values', 3, r => {
  const f = r.int(0, 2);
  if (f === 0) {
    const T = [['\\arcsin', '\\frac12', 1, 6], ['\\arcsin', '\\frac{\\sqrt{3}}{2}', 1, 3], ['\\arcsin', '-\\frac12', -1, 6], ['\\arcsin', '-\\frac{\\sqrt{2}}{2}', -1, 4], ['\\arccos', '-\\frac12', 2, 3], ['\\arccos', '-\\frac{\\sqrt{2}}{2}', 3, 4], ['\\arccos', '\\frac{\\sqrt{3}}{2}', 1, 6], ['\\arccos', '0', 1, 2], ['\\arctan', '1', 1, 4], ['\\arctan', '\\sqrt{3}', 1, 3], ['\\arctan', '-1', -1, 4], ['\\arctan', '\\frac{1}{\\sqrt{3}}', 1, 6], ['\\arctan', '-\\sqrt{3}', -1, 3], ['\\arccos', '-1', 1, 1]];
    const [fn, arg, n, d] = r.pick(T), rng_ = fn === '\\arcsin' ? '[-\\frac\\pi2,\\frac\\pi2]' : fn === '\\arccos' ? '[0,\\pi]' : '(-\\frac\\pi2,\\frac\\pi2)';
    return Q({ q: `Evaluate ${m(R`${fn}\left(${arg}\right)`)}.`, a: 'invtrig-direct', d: 2, f: 'free', k: pif(n, d), src: SRC,
      w: [[pif(-n, d), `Sign/range slip: ${fn.slice(1)} takes values in $${rng_}$.`, 'range'], [pif(d - n, d), 'Reflected into the wrong quadrant: check the range of the inverse function.', 'range'], [pif(n + d, d), 'Outside the range of the inverse function.', 'range'], [pif(d - 2 * n, 2 * d), 'Complementary-angle confusion between arcsin and arccos.', 'swap'], [pif(1, 2), 'Not an exact value for this input.', 'guess']],
      s: [`Find the angle in $${rng_}$ whose ${fn.slice(1) === 'arcsin' ? 'sine' : fn === '\\arccos' ? 'cosine' : 'tangent'} is $${arg}$.`, `That angle is $${pif(n, d)}$.`], r: 'Ranges: $\\arcsin\\in[-\\frac\\pi2,\\frac\\pi2]$, $\\arccos\\in[0,\\pi]$, $\\arctan\\in(-\\frac\\pi2,\\frac\\pi2)$.',
      c: { v: () => { const val = arg === '\\frac12' ? 0.5 : arg === '-\\frac12' ? -0.5 : arg === '\\frac{\\sqrt{3}}{2}' ? Math.sqrt(3) / 2 : arg === '-\\frac{\\sqrt{2}}{2}' ? -Math.SQRT1_2 : arg === '0' ? 0 : arg === '1' ? 1 : arg === '-1' ? -1 : arg === '\\sqrt{3}' ? Math.sqrt(3) : arg === '-\\sqrt{3}' ? -Math.sqrt(3) : 1 / Math.sqrt(3); return { '\\arcsin': Math.asin, '\\arccos': Math.acos, '\\arctan': Math.atan }[fn](val); } } });
  }
  if (f === 1) {
    const fn = r.pick(['asin', 'acos', 'atan']), d = r.pick([3, 4, 6]);
    let n = r.int(1, 4 * d);
    if (fn === 'atan' && (((n % d) + d) % d) * 2 === d) n++;
    const un = ((n % (2 * d)) + 2 * d) % (2 * d);
    let key;
    if (fn === 'asin') key = un <= d / 2 ? un : un <= 3 * d / 2 ? d - un : un - 2 * d;
    else if (fn === 'acos') key = un <= d ? un : 2 * d - un;
    else { const w = ((n % d) + d) % d; key = w * 2 < d ? w : w - d; }
    const name = { asin: ['\\arcsin', '\\sin', '[-\\frac\\pi2,\\frac\\pi2]'], acos: ['\\arccos', '\\cos', '[0,\\pi]'], atan: ['\\arctan', '\\tan', '(-\\frac\\pi2,\\frac\\pi2)'] }[fn];
    return Q({ q: `Evaluate ${m(R`${name[0]}\left(${name[1]}\left(${pif(n, d)}\right)\right)`)}.`, a: 'invtrig-comp', d: 4, f: 'free', k: pif(key, d), src: SRC,
      w: [[pif(n, d), `Inverse functions only cancel when the angle is already in the range $${name[2]}$. This one is not.`, 'cancel'], [pif(-key, d), 'Sign slip: find the angle in the range with the same function value.', 'range'], [pif(d - key, d), 'Reflected the wrong way.', 'range'], [pif(key + d, d), 'Shifted by $\\pi$ instead of reducing into the range.', 'range'], [pif(key + 2 * d, d), 'Shifted by $2\\pi$: still not in the range.', 'range'], [pif(key - d, d), 'Shifted by $-\\pi$ instead of reducing into the range.', 'range'], [pif(2 * key + d, d), 'Not a reflection of the angle into the range.', 'range']],
      s: [`$${pif(n, d)}$ is ${(fn === 'asin' && un <= d / 2) || (fn === 'acos' && un <= d) ? '' : 'NOT '}in $${name[2]}$ (after reducing mod $2\\pi$).`, `Find the angle in the range with the same ${name[1].slice(1)} value: $${pif(key, d)}$.`], r: '$f^{-1}(f(\\theta))=\\theta$ ONLY if $\\theta$ is in the range of $f^{-1}$; otherwise reflect into it.',
      c: { v: () => ({ asin: Math.asin(Math.sin(PI * n / d)), acos: Math.acos(Math.cos(PI * n / d)), atan: Math.atan(Math.tan(PI * n / d)) })[fn] } });
  }
  const [p, c, q] = r.pick([[3, 4, 5], [5, 12, 13], [8, 15, 17], [7, 24, 25]]), sg = r.pick([1, -1]), kind = r.int(0, 3), sgs = sg < 0 ? '-' : '';
  const T = [
    [`\\cos\\left(\\arcsin\\left(${sgs}\\frac{${p}}{${q}}\\right)\\right)`, frac(c, q), 'cos'],
    [`\\tan\\left(\\arcsin\\left(${sgs}\\frac{${p}}{${q}}\\right)\\right)`, frac(sg * p, c), 'tan'],
    [`\\sin\\left(\\arccos\\left(${sgs}\\frac{${c}}{${q}}\\right)\\right)`, frac(p, q), 'sin'],
    [`\\tan\\left(\\arccos\\left(${sgs}\\frac{${c}}{${q}}\\right)\\right)`, frac(sg * p, c), 'tan'],
  ][kind];
  return Q({ q: `Evaluate ${m(T[0])} exactly.`, a: 'invtrig-triangle', d: 4, f: 'free', k: T[1], src: SRC,
    w: [[T[1].startsWith('-') ? T[1].slice(1) : '-' + T[1], 'Sign error: decide the quadrant from the range of the inverse function.', 'sign'], [frac(p, q), 'That is the sine of the angle; the question asks for a different function.', 'wrong-function'], [frac(q, c), 'Reciprocal (secant) instead of the requested function.', 'reciprocal'], [frac(c, p), 'Cotangent/inverted ratio.', 'inverted'], [frac(p, c), 'Magnitude right but check the sign.', 'sign']],
    s: [`Draw the right triangle with legs $${p},${c}$ and hypotenuse $${q}$.`, 'Read the requested ratio; fix the sign from the range of the inverse function.'], r: 'Draw the triangle for the inverse; the range of arcsin/arccos tells you the sign.',
    c: { v: () => { const th = T[0].includes('arcsin') ? Math.asin(sg * p / q) : Math.acos(sg * c / q); return T[2] === 'cos' ? Math.cos(th) : T[2] === 'sin' ? Math.sin(th) : Math.tan(th); } } });
});

gen('g-x-sum', 'precalc', 'Summation Notation', 2, r => {
  const f = r.int(0, 6), a = r.int(2, 5), bb = r.int(1, 5), n = r.int(5, 15), lo = r.int(3, 5), rr = r.pick([2, 3]), c0 = r.int(2, 7), c1 = r.int(2, 5), nn = r.int(4, 7), hi = lo + r.int(4, 9);
  const S = (t, l, h) => { let s = 0; for (let k = l; k <= h; k++) s += t(k); return s; };
  const mkS = (l, h, body) => `\\sum_{k=${l}}^{${h}}${body}`;
  const T = [
    [mkS(1, n, `(${a}k+${bb})`), k => a * k + bb, 1, n, a * n * (n + 1) / 2 + bb * n, `$\\sum(ak+b)=a\\cdot\\frac{n(n+1)}{2}+bn$`],
    [mkS(1, n, 'k^{2}'), k => k * k, 1, n, n * (n + 1) * (2 * n + 1) / 6, '$\\sum k^2=\\frac{n(n+1)(2n+1)}{6}$'],
    [mkS(1, n, 'k^{3}'), k => k ** 3, 1, n, (n * (n + 1) / 2) ** 2, '$\\sum k^3=\\left(\\frac{n(n+1)}{2}\\right)^2$'],
    [mkS(0, nn, `${c1}\\cdot${rr}^{k}`), k => c1 * rr ** k, 0, nn, c1 * (rr ** (nn + 1) - 1) / (rr - 1), '$\\sum_{k=0}^nar^k=a\\frac{r^{n+1}-1}{r-1}$'],
    [mkS(lo, hi, 'k'), k => k, lo, hi, hi * (hi + 1) / 2 - (lo - 1) * lo / 2, '$\\sum_{k=m}^nk=\\frac{n(n+1)}{2}-\\frac{(m-1)m}{2}$'],
    [mkS(lo, hi, `${c0}`), k => c0, lo, hi, c0 * (hi - lo + 1), 'A constant summed $n-m+1$ times'],
  ];
  if (f === 6) {
    return Q({ q: `Evaluate the telescoping sum ${m(R`\sum_{k=1}^{${n}}\left(\frac1k-\frac1{k+1}\right)`)}.`, a: 'sum-telescope', d: 3, f: 'free', k: frac(n, n + 1), src: SRC,
      w: [[frac(n - 1, n), 'Last surviving term is $\\frac1{n+1}$, not $\\frac1n$.', 'off-by-one'], ['1', 'That is the infinite sum; the finite sum leaves $-\\frac1{n+1}$.', 'infinite'], [frac(n + 1, n + 2), 'Index shift: with $n$ terms the last denominator is $n+1$.', 'off-by-one'], [frac(1, n + 1), 'You kept only the last piece; the first term $1$ survives too.', 'partial']],
      s: ['Write the first terms: $(1-\\frac12)+(\\frac12-\\frac13)+\\cdots$ — middle terms cancel.', `$S_n=1-\\frac1{${n + 1}}=${frac(n, n + 1)}$.`], r: 'Telescoping: only the first and last pieces survive: $1-\\frac{1}{n+1}$.', c: { v: () => S(k => 1 / k - 1 / (k + 1), 1, n) } });
  }
  const [body, t, l, h, closed, rule] = T[f];
  const key = S(t, l, h);
  return Q({ q: `Evaluate ${m(body)}.`, a: 'sum-eval-' + f, d: 2, f: 'free', k: `${key}`, src: SRC,
    w: [[`${S(t, l, h - 1)}`, 'Off by one: the sum includes the last index.', 'off-by-one'], [`${S(t, l, h + 1)}`, 'One term too many.', 'off-by-one'], [f === 4 ? `${S(t, 1, h)}` : `${S(t, l - 1, h)}`, f === 4 ? 'Started at $k=1$ instead of the stated lower index.' : 'Included an extra term below the lower index.', 'index'], [f === 5 ? `${c0 + hi - lo + 1}` : `${key + 2}`, f === 5 ? 'Added the constant to the term count instead of multiplying.' : 'Arithmetic slip.', 'count'], [f === 5 ? `${hi - lo + 1}` : `${key - 1}`, f === 5 ? 'Forgot to multiply by the constant.' : 'Arithmetic slip.', 'count'], [`${S(t, l + 1, h)}`, 'Skipped the first term.', 'off-by-one'], [f === 5 ? `${c0 * (hi - lo)}` : f === 0 ? `${a * n * (n + 1) / 2 + bb}` : `${key + 1}`, f === 5 ? 'Number of terms is $hi-lo+1$, not $hi-lo$.' : f === 0 ? 'The constant $b$ is added $n$ times.' : 'Arithmetic slip.', 'count']],
    s: [rule + '.', `Plug in: $${key}$.`], r: 'Check the index limits first: lower bound, upper bound, number of terms $=n-m+1$.', c: { v: () => closed } });
});

gen('g-x-reindex', 'precalc', 'Summation Notation', 3, r => {
  const T = [(v, p) => R`\frac{1}{${p}^{2}}`, (v, p) => R`\frac{(-1)^{${v}}}{${p}}`, (v, p) => R`\frac{2^{${v}}}{${p}}`, (v, p) => R`\frac{${p}}{3^{${v}}}`];
  const t = r.pick(T), mm = r.int(1, 3), sh = s => (s === 0 ? 'k' : s > 0 ? `k+${s}` : `k-${-s}`), term = s => t(sh(s), s === 0 ? 'k' : `(${sh(s)})`);
  const S = (lo, s) => m(R`\sum_{k=${lo}}^{\infty}${term(s)}`);
  return Q({ q: `Rewrite ${m(R`\sum_{k=${mm}}^{\infty}${t('k', 'k')}`)} so that the index starts at ${m('k=0')}.`, a: 'reindex', d: 3,
    k: R`\sum_{k=0}^{\infty}${term(mm)}`,
    w: [[R`\sum_{k=0}^{\infty}${term(-mm)}`, 'Wrong direction: the old index equals the new index plus the shift, so substitute $k\\to k+m$, not $k-m$.', 'direction'], [R`\sum_{k=0}^{\infty}${term(0)}`, 'Changing the lower limit alone changes the terms; every $k$ in the formula must shift too.', 'no-shift'], [R`\sum_{k=${mm}}^{\infty}${term(mm)}`, 'You shifted the formula but not the lower limit.', 'half-shift'], [R`\sum_{k=0}^{\infty}${term(mm - 1)}`, 'Off by one in the shift.', 'off-by-one'], [R`\sum_{k=0}^{\infty}${term(mm + 1)}`, 'Off by one in the shift.', 'off-by-one']],
    s: [`Let $j=k-${mm}$, so $k=j+${mm}$; $k=${mm}$ becomes $j=0$.`, 'Replace every $k$ in the term by $(j+' + mm + ')$ (parentheses!).', 'Rename $j\\to k$.'], r: 'To start at 0, set $j=k-m$, replace $k\\to j+m$ everywhere, keep the upper limit $\\infty$.', src: SRC });
});

// =================================================================
// FOUNDATIONS: Inverse Trig, Log & Exp
// =================================================================
gen('g-x-ilx-deriv', 'foundations', 'Inverse Trig, Log & Exp', 3, r => {
  const k = r.int(2, 5), bb = r.pick([2, 3, 5]), t = r.int(0, 7);
  const T = [
    [`\\arctan(${k}x)`, `\\frac{${k}}{1+${k * k}x^{2}}`, [[`\\frac{1}{1+${k * k}x^{2}}`, 'Chain rule: multiply by the inner derivative $' + k + '$.'], [`\\frac{${k}}{1+${k}x^{2}}`, 'The inside $kx$ is squared: $(kx)^2=k^2x^2$.'], [`\\frac{${k}}{\\sqrt{1-${k * k}x^{2}}}`, 'That is arcsin.'], [`${k}\\left(1+${k * k}x^{2}\\right)`, 'Inverted: $\\arctan$ gives a reciprocal.']]],
    [`\\arcsin\\left(\\frac{x}{${k}}\\right)`, `\\frac{1}{\\sqrt{${k * k}-x^{2}}}`, [[`\\frac{${k}}{\\sqrt{${k * k}-x^{2}}}`, 'Chain rule factor is $\\frac1' + k + '$, which cancels the $k$.'], [`\\frac{1}{\\sqrt{${k * k}+x^{2}}}`, 'Sign inside: $\\arcsin$ has $1-u^2$.'], [`\\frac{1}{${k * k}-x^{2}}`, 'Missing the square root.'], [`\\frac{1}{\\sqrt{${k}-x^{2}}}`, 'The constant is squared: $k^2$.']]],
    [`\\arccos\\left(\\frac{x}{${k}}\\right)`, `-\\frac{1}{\\sqrt{${k * k}-x^{2}}}`, [[`\\frac{1}{\\sqrt{${k * k}-x^{2}}}`, 'Arccos has the OPPOSITE sign of arcsin.'], [`-\\frac{${k}}{\\sqrt{${k * k}-x^{2}}}`, 'Chain rule factor $\\frac1' + k + '$ cancels the $k$.'], [`-\\frac{1}{${k * k}+x^{2}}`, 'That is arctan form.'], [`-\\frac{1}{\\sqrt{${k}-x^{2}}}`, 'The constant is squared.']]],
    [`\\ln(x^{2}+${k})`, `\\frac{2x}{x^{2}+${k}}`, [[`\\frac{1}{x^{2}+${k}}`, 'Chain rule: multiply by $2x$.'], [`\\frac{2x}{x^{2}}`, 'The constant stays in the denominator.'], [`2x\\ln(x^{2}+${k})`, 'That is not the derivative of $\\ln$.'], [`\\frac{x}{x^{2}+${k}}`, 'Derivative of $x^2$ is $2x$.']]],
    [`\\log_{${bb}}(x)`, `\\frac{1}{x\\ln ${bb}}`, [[`\\frac{1}{x}`, 'Change of base: divide by $\\ln b$.'], [`\\frac{\\ln ${bb}}{x}`, '$\\log_b x=\\frac{\\ln x}{\\ln b}$: $\\ln b$ goes in the DENOMINATOR.'], [`\\frac{1}{${bb}x}`, 'The base appears as $\\ln b$, not $b$.'], [`\\frac{x}{\\ln ${bb}}`, 'Inverted.']]],
    [`${bb}^{x}`, `${bb}^{x}\\ln ${bb}`, [[`x\\cdot ${bb}^{x-1}`, 'That is the power rule; here the variable is in the exponent.'], [`${bb}^{x}`, 'Missing the $\\ln b$.'], [`\\frac{${bb}^{x}}{\\ln ${bb}}`, 'That is the integral.'], [`${bb}^{x}\\ln x`, 'It is $\\ln$ of the base.']]],
    [`\\arctan\\left(\\frac{x}{${k}}\\right)`, `\\frac{${k}}{${k * k}+x^{2}}`, [[`\\frac{1}{${k * k}+x^{2}}`, 'Chain rule factor $\\frac1' + k + '$ makes this $\\frac{k}{k^2+x^2}$.'], [`\\frac{1}{1+x^{2}/${k}}`, 'The inside is squared: $\\left(\\frac xk\\right)^2$.'], [`\\frac{${k}}{1+x^{2}}`, 'Simplify the double fraction carefully.'], [`\\frac{1}{${k}(1+x^{2})}`, 'Wrong simplification.']]],
    [`x\\arctan(x)`, `\\arctan(x)+\\frac{x}{1+x^{2}}`, [[`\\frac{1}{1+x^{2}}`, 'Product rule: $x$ is not constant.'], [`\\arctan(x)`, 'Missing the second product-rule term.'], [`\\arctan(x)+\\frac{1}{1+x^{2}}`, 'Second term is $x\\cdot\\frac1{1+x^2}$.'], [`\\arctan(x)-\\frac{x}{1+x^{2}}`, 'Product rule adds.']]],
  ][t];
  return Q({ q: `Find ${m(R`\dfrac{d}{dx}\left[${T[0]}\right]`)}.`, a: 'ilx-deriv', d: 3, f: 'free', k: T[1], w: T[2].map(([x, why]) => [x, why, 'deriv']), s: ['Use the inverse-trig / log / exponential derivative formula.', 'Multiply by the derivative of the inside (chain rule).'], r: '$(\\arctan u)\'=\\frac{u\'}{1+u^2}$, $(\\arcsin u)\'=\\frac{u\'}{\\sqrt{1-u^2}}$, $(\\log_bx)\'=\\frac1{x\\ln b}$, $(b^x)\'=b^x\\ln b$.', src: SRC, c: { deriv: [T[0], T[1]] } });
});

gen('g-x-ilx-integ', 'foundations', 'Inverse Trig, Log & Exp', 3, r => {
  const k = r.int(2, 6), bb = r.pick([2, 3, 5]), t = r.int(0, 5);
  const T = [
    [R`\int\frac{dx}{${k * k}+x^{2}}`, R`\frac{1}{${k}}\arctan\left(\frac{x}{${k}}\right)+C`, [[R`\arctan\left(\frac{x}{${k}}\right)+C`, 'Missing the $\\frac1a$ factor.'], [R`\frac{1}{${k * k}}\arctan\left(\frac{x}{${k}}\right)+C`, 'The factor is $\\frac1a$, not $\\frac1{a^2}$.'], [R`\frac{1}{${k}}\arcsin\left(\frac{x}{${k}}\right)+C`, 'Plus sign in the denominator means arctan.'], [R`\ln\left(${k * k}+x^{2}\right)+C`, 'That would need $2x$ in the numerator.']]],
    [R`\int\frac{dx}{\sqrt{${k * k}-x^{2}}}`, R`\arcsin\left(\frac{x}{${k}}\right)+C`, [[R`\frac{1}{${k}}\arcsin\left(\frac{x}{${k}}\right)+C`, 'No extra $\\frac1a$ for arcsin.'], [R`\arctan\left(\frac{x}{${k}}\right)+C`, 'Square root with minus means arcsin.'], [R`\arcsin(x)+C`, 'Keep the $a$ inside: $\\arcsin(x/a)$.'], [R`\arccos\left(\frac{x}{${k}}\right)+C`, 'Differs by a sign: $-\\arccos$.']]],
    [R`\int\frac{dx}{x\ln x}`, R`\ln\left|\ln x\right|+C`, [[R`\ln\left|x\right|+C`, 'Let $u=\\ln x$, $du=dx/x$.'], [R`\frac{1}{2}\left(\ln x\right)^{2}+C`, 'That is $\\int\\frac{\\ln x}{x}dx$.'], [R`\frac{1}{\ln x}+C`, 'Not a power rule.'], [R`\ln x+C`, 'Missing the outer log.']]],
    [R`\int ${bb}^{x}\,dx`, R`\frac{${bb}^{x}}{\ln ${bb}}+C`, [[R`${bb}^{x}\ln ${bb}+C`, 'That is the derivative.'], [R`\frac{${bb}^{x+1}}{x+1}+C`, 'Power rule does not apply: the variable is in the exponent.'], [R`${bb}^{x}+C`, 'Missing $\\frac1{\\ln b}$.'], [R`\frac{${bb}^{x}}{${bb}}+C`, 'Divide by $\\ln b$, not $b$.']]],
    [R`\int\frac{dx}{${k}x+1}`, R`\frac{1}{${k}}\ln\left|${k}x+1\right|+C`, [[R`\ln\left|${k}x+1\right|+C`, 'Missing $\\frac1k$ from the inner derivative.'], [R`${k}\ln\left|${k}x+1\right|+C`, 'Divide by $k$, not multiply.'], [R`\frac{1}{${k}x+1}+C`, 'Not a power rule.'], [R`\frac{1}{${k}}\ln\left|x\right|+C`, 'Keep the whole denominator inside the log.']]],
    [R`\int_0^{${k}}\frac{dx}{${k * k}+x^{2}}`, R`\frac{\pi}{${4 * k}}`, [[R`\frac{\pi}{4}`, 'Missing the $\\frac1a$ factor.'], [R`\frac{\pi}{${2 * k}}`, '$\\arctan(1)=\\frac\\pi4$, not $\\frac\\pi2$.'], [R`\frac{\pi}{${4 * k * k}}`, 'The factor is $\\frac1a$.'], [R`\frac{${k}\pi}{4}`, 'Multiplied by $a$ instead of dividing.']]],
  ][t];
  return Q({ q: `Evaluate ${m(T[0])}.`, a: 'ilx-integ', d: 3, f: t === 5 ? 'free' : undefined, k: T[1], w: T[2].map(([x, why]) => [x, why, 'integ']), s: ['Match the form to an inverse-trig / log / exponential antiderivative.', 'Track the constant factor from the inner function.'], r: '$\\int\\frac{dx}{a^2+x^2}=\\frac1a\\arctan\\frac xa$; $\\int\\frac{dx}{\\sqrt{a^2-x^2}}=\\arcsin\\frac xa$; $\\int b^xdx=\\frac{b^x}{\\ln b}$.', src: SRC, c: t === 5 ? { v: () => simp(x => 1 / (k * k + x * x), 0, k) } : { anti: [T[0], T[1]] } });
});

gen('g-x-ilx-solve', 'foundations', 'Inverse Trig, Log & Exp', 2, r => {
  const k = r.int(2, 5), mm = r.int(2, 9), t = r.int(0, 3), p = r.int(2, 4), q = p + r.int(1, 3);
  const bb = k === 2 ? r.int(2, 4) : r.int(1, 4);   // k=2,bb=1 makes the log distractors collide
  const T = [
    [`Solve ${m(`e^{${k}x}=${mm}`)} for ${m('x')}.`, R`\frac{\ln ${mm}}{${k}}`, [[R`\ln\left(\frac{${mm}}{${k}}\right)`, 'Take $\\ln$ of the whole equation first: $kx=\\ln m$.'], [R`${k}\ln ${mm}`, 'Divide by $k$, do not multiply.'], [R`\frac{${mm}}{${k}}`, 'Forgot to take the log.'], [R`e^{\frac{${mm}}{${k}}}`, 'The exponent equation is $kx=\\ln m$.']]],
    [`Solve ${m(`\\ln(x+${bb})=${k}`)} for ${m('x')}.`, `e^{${k}}-${bb}`, [[`e^{${k}-${bb}}`, 'Exponentiate both sides FIRST, then subtract.'], [`${k}-${bb}`, 'Forgot to exponentiate.'], [`e^{${k}}+${bb}`, 'Subtract $b$ after exponentiating.'], [`e^{${k}}\\cdot${bb}`, 'Sum, not product, inside the log.']]],
    [`Solve ${m(`\\log_{${k}}(x)=${bb + 1}`)} for ${m('x')}.`, `${k ** (bb + 1)}`, [[`${k * (bb + 1)}`, 'Exponentiate: $x=b^{n}$, not $b\\cdot n$.'], [`${(bb + 1) ** k}`, 'Base and exponent swapped.'], [`${k + bb + 1}`, 'Not an operation that undoes a log.'], [`${k ** (bb + 1) - 1}`, 'Arithmetic slip.']]],
    [`Find all solutions of ${m(`e^{2x}-${p + q}e^{x}+${p * q}=0`)}.`, `x=\\ln ${p}\\ \\text{or}\\ x=\\ln ${q}`, [[`x=${p}\\ \\text{or}\\ x=${q}`, 'Those are the values of $e^x$; take $\\ln$ to get $x$.'], [`x=\\ln ${p + q}`, 'Factor the quadratic in $u=e^x$ first.'], [`x=\\ln ${p}\\ \\text{only}`, 'Both roots $u>0$ give a solution.'], [`x=-\\ln ${p}\\ \\text{or}\\ x=-\\ln ${q}`, 'Sign: $e^x=u$ gives $x=\\ln u$.']]],
  ][t];
  return Q({ q: T[0], a: 'ilx-solve', d: 2, f: t < 3 ? 'free' : undefined, k: T[1], w: T[2].map(([x, why]) => [x, why, 'solve']), s: ['Undo the outermost operation first: $e^{(\\cdot)}\\leftrightarrow\\ln$.', 'Then solve the remaining linear equation.'], r: '$\\ln e^u=u$ and $e^{\\ln u}=u$; apply to BOTH sides before isolating $x$.', src: SRC, c: t === 0 ? { v: () => Math.log(mm) / k } : t === 1 ? { v: () => Math.exp(k) - bb } : t === 2 ? { v: () => k ** (bb + 1) } : undefined });
});

// =================================================================
// STATIC
// =================================================================
const errItem = (id, unit, topic, prompt, work, lines, badIdx, whyBad, expl, steps, recall, diff = 3) => ({
  id, unit, topic, diff, fmt: 'error', arch: id, prompt, work, src: SRC,
  choices: [...lines.map((w, i) => (i === badIdx ? { t: `Line ${i + 1}`, ok: true, why: whyBad } : { t: `Line ${i + 1}`, why: w, err: 'misplaced-blame' })), { t: 'No error', why: expl, err: 'missed-error' }],
  steps, recall, hints: steps.slice(0, 1),
});

P.push(errItem('x-err-polar-area', 'polar', 'Polar Area & Arc Length', 'A student finds the area of one petal of $r=\\sin 2\\theta$ in the first quadrant. Find the first line with an error.',
  ['$A=\\displaystyle\\int_0^{\\pi/2}\\sin^2 2\\theta\\,d\\theta$', '$=\\displaystyle\\int_0^{\\pi/2}\\frac{1-\\cos4\\theta}{2}\\,d\\theta$', '$=\\left[\\frac{\\theta}{2}-\\frac{\\sin4\\theta}{8}\\right]_0^{\\pi/2}$', '$=\\dfrac{\\pi}{4}$'],
  ['Line 1 is the first place the setup can go wrong — compare with $\\frac12\\int r^2$.', 'Power-reducing is right: $\\sin^2u=\\frac{1-\\cos2u}{2}$ with $u=2\\theta$.', 'The antiderivative is right.', 'Arithmetic follows from line 3.'], 0,
  'Line 1 leaves out the $\\frac12$ of $A=\\frac12\\int r^2d\\theta$. The correct area is $\\frac\\pi8$.', 'There is an error: the area formula needs a factor $\\frac12$, so $\\frac\\pi4$ is twice the true area.',
  ['$A=\\frac12\\int_0^{\\pi/2}\\sin^22\\theta\\,d\\theta$.', 'Everything after the first line is then correct but doubled: $A=\\frac\\pi8$.'], 'Polar area always carries the $\\frac12$.'));

P.push(errItem('x-err-param-d2y', 'polar', 'Parametric Calculus', 'For $x=t^2,\\ y=t^3$ a student computes $\\dfrac{d^2y}{dx^2}$. Find the first line with an error.',
  ['$\\dfrac{dy}{dx}=\\dfrac{3t^2}{2t}=\\dfrac{3t}{2}$', '$\\dfrac{d^2y}{dx^2}=\\dfrac{d}{dt}\\left(\\dfrac{3t}{2}\\right)=\\dfrac32$', 'So the curve has constant concavity $\\frac32$.'],
  ['Correct.', 'Line 2 differentiates with respect to $t$ and stops: it must also divide by $dx/dt$.', 'Follows from line 2.'], 1,
  'Line 2: $\\frac{d^2y}{dx^2}=\\frac{d(dy/dx)/dt}{dx/dt}=\\frac{3/2}{2t}=\\frac{3}{4t}$. Concavity changes with $t$.', 'There is an error in line 2: the result should be $\\frac{3}{4t}$, not a constant.',
  ['$\\frac{d}{dt}\\left(\\frac{3t}{2}\\right)=\\frac32$ is $\\frac{d}{dt}(dy/dx)$.', 'Divide by $dx/dt=2t$: $\\frac{3}{4t}$.'], '$\\dfrac{d^2y}{dx^2}=\\dfrac{\\frac{d}{dt}(dy/dx)}{dx/dt}$.', 4));

P.push(errItem('x-err-shell-radius', 'applications', 'Volumes: Shells', 'Rotate the region under $y=x^2$, $0\\le x\\le1$, about the line $x=2$ using shells. Find the first line with an error.',
  ['$V=2\\pi\\displaystyle\\int_0^1 x\\cdot x^2\\,dx$', '$=2\\pi\\left[\\dfrac{x^4}{4}\\right]_0^1$', '$=\\dfrac{\\pi}{2}$'],
  ['The shell radius about $x=2$ is the distance to the axis, $2-x$, not $x$.', 'Antiderivative is right for the integrand given.', 'Arithmetic is right for the integral given.'], 0,
  'Line 1 uses radius $x$ (distance to the $y$-axis). About $x=2$ the radius is $2-x$: $V=2\\pi\\int_0^1(2-x)x^2dx=2\\pi\\left(\\frac23-\\frac14\\right)=\\frac{5\\pi}{6}$.', 'There is an error: the radius must be $2-x$, giving $\\frac{5\\pi}{6}$.',
  ['Radius = distance from the axis $x=2$: $2-x$.', '$V=2\\pi\\int_0^1(2-x)x^2dx=\\frac{5\\pi}{6}$.'], 'Shell radius is measured to the axis of rotation.', 3));

P.push(errItem('x-err-avg-value', 'applications', 'Average Value', 'A student finds the average value of $f(x)=x^2$ on $[1,4]$. Find the first line with an error.',
  ['$f_{avg}=\\dfrac{1}{4}\\displaystyle\\int_1^4x^2\\,dx$', '$=\\dfrac14\\cdot\\dfrac{4^3-1^3}{3}$', '$=\\dfrac{63}{12}=\\dfrac{21}{4}$'],
  ['The prefactor must be $\\frac{1}{b-a}=\\frac13$, not $\\frac1b$.', 'Consistent with line 1.', 'Arithmetic is fine for line 2.'], 0,
  'Line 1 uses $\\frac1b$ instead of $\\frac1{b-a}=\\frac13$. The correct average is $\\frac{63}{9}=7$.', 'There is an error: dividing by $4$ instead of $3$.',
  ['Interval length is $4-1=3$.', '$f_{avg}=\\frac13\\cdot21=7$.'], '$f_{avg}=\\frac1{b-a}\\int_a^bf$.', 2));

P.push(errItem('x-err-arcsin-sin', 'precalc', 'Inverse Trig Values', 'A student evaluates $\\arcsin\\!\\left(\\sin\\dfrac{5\\pi}{6}\\right)$. Find the first line with an error.',
  ['$\\sin\\dfrac{5\\pi}{6}=\\dfrac12$', '$\\arcsin\\!\\left(\\sin\\dfrac{5\\pi}{6}\\right)=\\dfrac{5\\pi}{6}$ since inverse functions cancel.', 'So the answer is $\\dfrac{5\\pi}{6}$.'],
  ['$\\sin\\frac{5\\pi}{6}=\\frac12$ is correct.', 'Line 2 cancels illegally: $\\frac{5\\pi}{6}$ is outside the range of arcsin.', 'Follows from line 2.'], 1,
  'Line 2: $\\arcsin\\frac12=\\frac\\pi6$. Cancelling only works when the angle is in $[-\\frac\\pi2,\\frac\\pi2]$.', 'There is an error: the answer is $\\frac\\pi6$.',
  ['$\\sin\\frac{5\\pi}{6}=\\frac12$.', '$\\arcsin\\frac12=\\frac\\pi6$ (angle in $[-\\frac\\pi2,\\frac\\pi2]$).'], '$\\arcsin(\\sin\\theta)=\\theta$ only for $\\theta\\in[-\\frac\\pi2,\\frac\\pi2]$.', 3));

P.push(errItem('x-err-sum-index', 'precalc', 'Summation Notation', 'A student evaluates $\\displaystyle\\sum_{k=3}^{10}k$. Find the first line with an error.',
  ['$\\displaystyle\\sum_{k=3}^{10}k=\\frac{10\\cdot11}{2}$', '$=55$', '$\\text{so the sum is }55$'],
  ['The formula $\\frac{n(n+1)}2$ starts at $k=1$; this sum starts at $k=3$.', 'Arithmetic follows.', 'Restates line 2.'], 0,
  'Line 1 includes $k=1,2$. Subtract $1+2$: $55-3=52$.', 'There is an error: the sum starts at $k=3$, so the value is $52$.',
  ['$\\sum_{k=1}^{10}k=55$.', 'Remove $k=1,2$: $55-3=52$.'], 'Match the formula\'s starting index to the sum\'s.', 2));

P.push(errItem('x-err-trig-power', 'precalc', 'Trig Identities', 'A student rewrites $\\sin^2 x$ to integrate it. Find the first line with an error.',
  ['$\\displaystyle\\int\\sin^2x\\,dx=\\int\\frac{1+\\cos2x}{2}\\,dx$', '$=\\dfrac{x}{2}+\\dfrac{\\sin2x}{4}+C$', '$=\\dfrac{2x+\\sin2x}{4}+C$'],
  ['$\\sin^2x=\\frac{1-\\cos2x}{2}$; the plus sign belongs to $\\cos^2x$.', 'Line 2 is the correct antiderivative of line 1.', 'Line 3 is line 2 over a common denominator.'], 0,
  'Line 1 has the sign wrong: $\\sin^2x=\\frac{1-\\cos2x}{2}$, giving $\\frac x2-\\frac{\\sin2x}4+C$.', 'There is an error: the sign in the power-reducing formula.',
  ['$\\sin^2x=\\frac{1-\\cos2x}{2}$.', '$\\int=\\frac x2-\\frac{\\sin2x}{4}+C$.'], 'Sine squared: minus. Cosine squared: plus.', 2));

P.push({
  id: 'x-tf-polar-quadrant', unit: 'polar', topic: 'Polar Coordinates', diff: 2, tf: true, arch: 'tf-polar-quadrant', src: SRC,
  prompt: 'True or false: the polar point $\\left(-3,\\dfrac{\\pi}{4}\\right)$ lies in quadrant II.',
  choices: [{ t: 'True', why: 'A negative $r$ reflects through the origin, so the point is NOT where angle $\\frac\\pi4$ points.', err: 'neg-r' }, { t: 'False', ok: true }],
  keyWhy: 'False. The ray $\\theta=\\frac\\pi4$ is in quadrant I, but $r=-3<0$ puts the point on the opposite side: $(-\\frac{3\\sqrt2}{2},-\\frac{3\\sqrt2}{2})$, quadrant III.',
  steps: ['$x=-3\\cos\\frac\\pi4<0$, $y=-3\\sin\\frac\\pi4<0$.', 'Both negative: quadrant III.'], recall: 'Negative $r$: go the opposite direction along the ray.', hints: ['Convert to $(x,y)$.'],
});

P.push({
  id: 'x-tf-param-vertical', unit: 'polar', topic: 'Parametric Calculus', diff: 3, tf: true, arch: 'tf-param-vertical', src: SRC,
  prompt: 'True or false: if $\\dfrac{dx}{dt}=0$ at $t=t_0$, then the curve $x=x(t),\\ y=y(t)$ has a vertical tangent at $t_0$.',
  choices: [{ t: 'True', why: 'You also need $dy/dt\\ne0$; if both vanish the slope is $\\frac00$ and the curve may have a cusp or no vertical tangent.', err: 'both-zero' }, { t: 'False', ok: true }],
  keyWhy: 'False. Vertical tangent requires $dx/dt=0$ AND $dy/dt\\ne0$. Counterexample: $x=t^3,\\ y=t^3$ has $x\'=y\'=0$ at $t=0$, yet the curve is the line $y=x$ with slope 1.',
  steps: ['Slope is $\\frac{dy/dt}{dx/dt}$.', 'If numerator also $0$, the quotient is indeterminate.'], recall: 'Vertical: $x\'=0,\\ y\'\\ne0$. Horizontal: $y\'=0,\\ x\'\\ne0$.', hints: ['What if $dy/dt$ is also 0?'],
});

P.push({
  id: 'x-tf-avg-endpoints', unit: 'applications', topic: 'Average Value', diff: 2, tf: true, arch: 'tf-avg-endpoints', src: SRC,
  prompt: 'True or false: the average value of a continuous $f$ on $[a,b]$ always equals $\\dfrac{f(a)+f(b)}{2}$.',
  choices: [{ t: 'True', why: 'That is the average of two numbers, not of the whole function.', err: 'endpoints' }, { t: 'False', ok: true }],
  keyWhy: 'False. $f_{avg}=\\frac1{b-a}\\int_a^bf$. For $f=x^2$ on $[0,2]$: $f_{avg}=\\frac43$ but $\\frac{f(0)+f(2)}{2}=2$. (Equality holds for linear $f$.)',
  steps: ['Compute both sides for $x^2$ on $[0,2]$.', '$\\frac43\\ne2$.'], recall: 'Average value uses the integral; endpoints average is only right for straight lines.', hints: ['Test $f=x^2$.'],
});

P.push({
  id: 'x-tf-arccos-neg', unit: 'precalc', topic: 'Inverse Trig Values', diff: 3, tf: true, arch: 'tf-arccos-neg', src: SRC,
  prompt: 'True or false: for every $x\\in[-1,1]$, $\\arccos(-x)=\\pi-\\arccos(x)$.',
  choices: [{ t: 'True', ok: true }, { t: 'False', why: 'Test $x=\\frac12$: $\\arccos(-\\frac12)=\\frac{2\\pi}{3}=\\pi-\\frac\\pi3$.', err: 'range' }],
  keyWhy: 'True. $\\cos(\\pi-\\theta)=-\\cos\\theta$ and $\\pi-\\theta\\in[0,\\pi]$ whenever $\\theta\\in[0,\\pi]$, so $\\pi-\\arccos x$ is the angle in $[0,\\pi]$ whose cosine is $-x$.',
  steps: ['Let $\\theta=\\arccos x\\in[0,\\pi]$.', '$\\cos(\\pi-\\theta)=-x$ and $\\pi-\\theta\\in[0,\\pi]$.'], recall: '$\\arccos(-x)=\\pi-\\arccos x$ (arcsin is odd; arccos is not).', hints: ['Check the range.'],
});

P.push({
  id: 'x-multi-circle-area', unit: 'polar', topic: 'Polar Area & Arc Length', diff: 4, fmt: 'multi', arch: 'multi-circle-area', src: SRC,
  prompt: 'The circle $r=2\\cos\\theta$ is traced once as $\\theta$ runs over an interval of length $\\pi$. Select ALL expressions that equal its area.',
  choices: [
    { t: '$\\dfrac12\\displaystyle\\int_{-\\pi/2}^{\\pi/2}4\\cos^2\\theta\\,d\\theta$', ok: true, why: 'One full trace, correct formula: equals $\\pi$.' },
    { t: '$\\dfrac12\\displaystyle\\int_{0}^{\\pi}4\\cos^2\\theta\\,d\\theta$', ok: true, why: 'Any interval of length $\\pi$ traces the circle once (negative $r$ is fine): equals $\\pi$.' },
    { t: '$\\dfrac12\\displaystyle\\int_{0}^{2\\pi}4\\cos^2\\theta\\,d\\theta$', why: 'This traces the circle twice, giving $2\\pi$.' },
    { t: '$\\pi\\cdot1^2$', ok: true, why: 'The circle has diameter 2, so radius 1.' },
    { t: '$\\dfrac12\\displaystyle\\int_{0}^{\\pi/2}4\\cos^2\\theta\\,d\\theta$', why: 'That is only the upper half of the circle: $\\frac\\pi2$.' },
  ],
  steps: ['$\\frac12\\int4\\cos^2\\theta\\,d\\theta$ over a length-$\\pi$ interval is $\\pi$.', 'A length-$2\\pi$ interval double-counts.'], recall: 'Count how many times the curve is traced before integrating.', hints: ['Check the radius from the Cartesian form.'],
});

P.push({
  id: 'x-multi-limacon', unit: 'polar', topic: 'Polar Coordinates', diff: 4, fmt: 'multi', arch: 'multi-limacon', src: SRC,
  prompt: 'Select ALL true statements about the limaçon $r=1+2\\cos\\theta$.',
  choices: [
    { t: 'It has an inner loop.', ok: true, why: '$a<b$ ($1<2$): $r$ becomes negative for part of the sweep.' },
    { t: 'It passes through the origin.', ok: true, why: '$r=0$ when $\\cos\\theta=-\\frac12$, i.e. $\\theta=\\frac{2\\pi}3,\\frac{4\\pi}3$.' },
    { t: 'It is symmetric about the $x$-axis.', ok: true, why: 'Replacing $\\theta$ with $-\\theta$ leaves $\\cos\\theta$ unchanged.' },
    { t: 'It is symmetric about the $y$-axis.', why: 'Replacing $\\theta$ with $\\pi-\\theta$ changes $\\cos\\theta$ to $-\\cos\\theta$.' },
    { t: 'It is a cardioid.', why: 'Cardioid needs $a=b$; here $a=1\\ne2$.' },
  ],
  steps: ['Compare $a=1$ and $b=2$.', 'Solve $r=0$.', 'Test symmetry with $\\theta\\to-\\theta$ and $\\theta\\to\\pi-\\theta$.'], recall: 'Cosine limaçons are symmetric about the $x$-axis.', hints: ['Compare $a$ and $b$.'],
});

P.push({
  id: 'x-free-cardioid-area', unit: 'polar', topic: 'Polar Area & Arc Length', diff: 3, fmt: 'free', arch: 'free-cardioid-area', src: SRC,
  prompt: 'Find the area enclosed by the cardioid $r=1+\\cos\\theta$.',
  choices: [{ t: '$\\dfrac{3\\pi}{2}$', ok: true }, { t: '$3\\pi$', why: 'Missing the $\\frac12$ in $A=\\frac12\\int r^2d\\theta$.', err: 'dropped-half' }, { t: '$\\pi$', why: 'Lost the $\\cos^2\\theta$ term: $\\int_0^{2\\pi}\\cos^2\\theta d\\theta=\\pi$.', err: 'dropped-term' }, { t: '$\\dfrac{3\\pi}{4}$', why: 'That is half the area (upper half only).', err: 'limits' }],
  steps: ['$A=\\frac12\\int_0^{2\\pi}(1+\\cos\\theta)^2d\\theta=\\frac12\\int(1+2\\cos\\theta+\\cos^2\\theta)d\\theta$.', '$=\\frac12(2\\pi+0+\\pi)=\\frac{3\\pi}{2}$.'], recall: 'Cardioid $r=a(1+\\cos\\theta)$ has area $\\frac{3\\pi a^2}{2}$.', hints: ['Expand $(1+\\cos\\theta)^2$.'],
});

P.push({
  id: 'x-free-param-arclen', unit: 'polar', topic: 'Parametric Calculus', diff: 4, fmt: 'free', arch: 'free-param-arclen', src: SRC,
  prompt: 'Find the length of the curve $x=3t^2,\\ y=2t^3$ for $0\\le t\\le1$.',
  choices: [{ t: '$4\\sqrt{2}-2$', ok: true }, { t: '$2\\sqrt{2}-1$', why: 'Missed the factor 2: $\\int 6t\\sqrt{1+t^2}dt=2(1+t^2)^{3/2}$.', err: 'dropped-factor' }, { t: '$5$', why: 'That adds $\\Delta x+\\Delta y=3+2$, not arc length.', err: 'taxicab' }, { t: '$\\sqrt{13}$', why: 'Straight-line distance between the endpoints $(0,0)$ and $(3,2)$.', err: 'chord' }],
  steps: ['$x\'=6t,\\ y\'=6t^2$; $\\sqrt{36t^2+36t^4}=6t\\sqrt{1+t^2}$.', '$u=1+t^2$, $du=2t\\,dt$: $L=3\\int_1^2\\sqrt u\\,du=3\\cdot\\frac23\\left(2^{3/2}-1\\right)=4\\sqrt2-2$.'], recall: 'Factor the radicand into (perfect square)×(something nice).', hints: ['Factor $36t^2$ out of the radical.'],
});

P.push({
  id: 'x-free-shells', unit: 'applications', topic: 'Volumes: Shells', diff: 3, fmt: 'free', arch: 'free-shells', src: SRC,
  prompt: 'Use shells to find the volume generated by rotating the region between the $x$-axis and $y=2x-x^2$ about the $y$-axis.',
  choices: [{ t: '$\\dfrac{8\\pi}{3}$', ok: true }, { t: '$\\dfrac{16\\pi}{15}$', why: 'That is the volume about the $x$-axis (disks): $\\pi\\int(2x-x^2)^2$.', err: 'wrong-method' }, { t: '$\\dfrac{4\\pi}{3}$', why: 'Forgot the factor 2 in $2\\pi$.', err: 'dropped-2' }, { t: '$\\dfrac{8}{3}$', why: 'Forgot the $\\pi$ (and the $2$): check $2\\pi\\int$.', err: 'dropped-pi' }],
  steps: ['Radius $x$, height $2x-x^2$, $0\\le x\\le2$.', '$V=2\\pi\\int_0^2(2x^2-x^3)dx=2\\pi\\left(\\frac{16}{3}-4\\right)=\\frac{8\\pi}{3}$.'], recall: 'Shells about the $y$-axis: $2\\pi\\int x\\,f(x)\\,dx$.', hints: ['Radius is $x$.'],
});

P.push({
  id: 'x-free-centroid-semi', unit: 'applications', topic: 'Centroids', diff: 3, fmt: 'free', arch: 'free-centroid', src: SRC,
  prompt: 'Find $\\bar{y}$ for the region between $y=x^2$ and the line $y=4$.',
  choices: [{ t: '$\\dfrac{12}{5}$', ok: true }, { t: '$2$', why: 'The midpoint of the height is not the centroid; the region is wider at the top.', err: 'midpoint' }, { t: '$\\dfrac{32}{3}$', why: 'That is the area, not $\\bar y$.', err: 'area' }, { t: '$\\dfrac{8}{5}$', why: 'Check $\\bar y=\\frac1A\\int\\frac12(16-x^4)dx$.', err: 'arith' }],
  steps: ['$A=\\int_{-2}^{2}(4-x^2)dx=\\frac{32}{3}$.', '$\\bar y=\\frac1A\\int_{-2}^{2}\\frac12(16-x^4)dx=\\frac{3}{32}\\cdot\\frac{128}{5}=\\frac{12}{5}$.'], recall: '$\\bar y=\\frac1A\\int\\frac12(f^2-g^2)dx$ (top$^2-$bottom$^2$).', hints: ['Use top$^2-$bottom$^2$.'],
});

export const xmisc = { unit: 'polar', problems: P, generators: G };
