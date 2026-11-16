// bank/x_integ.js — exam-variety pack (run mix). Owner: see .hnic/context/mix-contract.md
// Techniques of integration, u-sub/FTC, arc length/surface area, Method Judgment.
// Archetypes: Exam 1 v1/v2 (09/22/2026) + 08-18..09-10 lecture traps; see .hnic/context/mix-sources.md.
import { rng, choose, frac } from '../util.js';
const P = [];
const G = [];
const R = String.raw;

export const xinteg = { unit: 'techniques', problems: P, generators: G };

// ---------------- helpers ----------------
const K = t => ({ t: `$${t}$`, ok: true });
const W = (t, why, err) => ({ t: `$${t}$`, why, ...(err ? { err } : {}) });
/** key + 3 non-colliding distractors from a longer candidate pool */
const mc = (key, pool) => [K(key), ...choose(`$${key}$`, pool)];
const sg = n => (n < 0 ? `-${-n}` : `+${n}`);
const tr = (f, b, v = 'x') => (b === 1 ? `\\${f} ${v}` : `\\${f}(${b}${v})`);
const lnAbs = (c, inner) => (c === 1 ? '' : c === -1 ? '-' : String(c)) + `\\ln|${inner}|`;
const ordN = (n, lines) => lines.slice(0, n);

/** Find-the-error item. lines: [{ good, why, bads: [{ t, why }] }] ; picks one line to corrupt (or none). */
function errItem(r, o) {
  const noErr = r() < 0.15;
  const bad = noErr ? -1 : r.int(0, o.lines.length - 1);
  const pickBad = bad < 0 ? null : r.pick(o.lines[bad].bads);
  const work = o.lines.map((l, i) => (i === bad ? pickBad.t : l.good));
  const choices = o.lines.map((l, i) => {
    const c = { t: `Line ${i + 1}` };
    if (i === bad) { c.ok = true; c.why = pickBad.why; } else c.why = `Line ${i + 1} is fine: ${l.why}`;
    return c;
  });
  choices.push(noErr ? { t: 'No error', ok: true, why: 'Every line follows from the one before it.' }
    : { t: 'No error', why: `There is an error — look again at line ${bad + 1}: ${pickBad.why}` });
  return {
    fmt: 'error', arch: o.arch, topic: o.topic, unit: o.unit, diff: o.diff ?? 3, src: o.src,
    prompt: o.prompt, work: work.map(w => `$${w}$`), choices,
    keyWhy: noErr ? 'All lines are correct.' : `Line ${bad + 1}: ${pickBad.why}`,
    steps: o.steps, recall: o.recall, hints: o.hints,
  };
}

// =================================================================
// STATIC (exam-modeled + Method Judgment true/false)
// =================================================================
P.push({
  id: 'xi-s-xsqrt', topic: 'Linear u-Substitution', diff: 2, fmt: 'free', arch: 'linear-usub', exam: true,
  src: 'Exam 1 v1 Q1(b) (09/22/2026)',
  prompt: 'Compute $\\displaystyle\\int \\frac{x}{\\sqrt{x+5}}\\,dx$. Show all work and completely simplify.',
  choices: [K(R`\frac{2}{3}(x-10)\sqrt{x+5}+C`),
    W(R`\frac{2}{3}(x+5)^{3/2}+C`, 'You substituted $u=x+5$ but replaced only $dx$. The numerator $x$ must become $u-5$.', 'dropped-factor'),
    W(R`\frac{2}{3}(x+10)\sqrt{x+5}+C`, 'Sign slip: $x=u-5$, so the constant is $-2\\cdot5=-10$, not $+10$.', 'sign'),
    W(R`2x\sqrt{x+5}+C`, 'You integrated $\\frac{1}{\\sqrt{x+5}}$ and kept $x$ outside as a constant.', 'formula-confusion')],
  steps: ['$u=x+5$, $x=u-5$, $du=dx$.', '$\\int\\frac{u-5}{\\sqrt u}du=\\int(u^{1/2}-5u^{-1/2})du=\\frac23u^{3/2}-10u^{1/2}$.',
    'Factor: $\\sqrt u\\,(\\frac23u-10)=\\frac23(u-15)\\sqrt u$; with $u=x+5$ this is $\\frac23(x-10)\\sqrt{x+5}+C$.'],
  recall: 'Linear $u=x+a$: rewrite every leftover $x$ as $u-a$ before integrating.',
  hints: ['Let $u=x+5$. What is $x$ in terms of $u$?', 'Split the fraction into two power-rule terms.'],
});
P.push({
  id: 'xi-s-9minusx2', topic: 'Trigonometric Substitution', diff: 3, fmt: 'free', arch: 'trigsub-compute', exam: true,
  src: 'Exam 1 v1 Q6 (09/22/2026)',
  prompt: 'Compute $\\displaystyle\\int \\frac{dx}{(9-x^{2})^{3/2}}$. Back-substitute to $x$.',
  choices: [K(R`\frac{x}{9\sqrt{9-x^{2}}}+C`),
    W(R`\frac{x}{\sqrt{9-x^{2}}}+C`, 'The $\\frac{1}{9}$ from $\\frac{1}{9}\\int\\sec^2\\theta\\,d\\theta$ went missing ($27\\cos^3\\theta$ vs $3\\cos\\theta$ gives $\\frac1{9}$).', 'dropped-factor'),
    W(R`\frac{\sqrt{9-x^{2}}}{9x}+C`, 'Triangle sides inverted: $\\tan\\theta=\\frac{\\text{opp}}{\\text{adj}}=\\frac{x}{\\sqrt{9-x^2}}$, not the reciprocal.', 'inverted'),
    W(R`\frac{1}{9}\tan\theta+C`, 'Correct in $\\theta$ but never converted back to $x$ with the triangle.', 'setup')],
  steps: ['$x=3\\sin\\theta$, $dx=3\\cos\\theta\\,d\\theta$, $(9-x^2)^{3/2}=27\\cos^3\\theta$.', '$\\int\\frac{3\\cos\\theta}{27\\cos^3\\theta}d\\theta=\\frac19\\int\\sec^2\\theta\\,d\\theta=\\frac19\\tan\\theta$.', 'Triangle: opp $=x$, hyp $=3$, adj $=\\sqrt{9-x^2}$, so $\\tan\\theta=\\frac{x}{\\sqrt{9-x^2}}$.'],
  recall: '$a^2-x^2\\Rightarrow x=a\\sin\\theta$; draw the triangle before you back-substitute.',
  hints: ['Which substitution kills $9-x^2$?', 'Label opp and hyp from $\\sin\\theta=x/3$.'],
});
P.push({
  id: 'xi-s-pf-long', topic: 'Partial Fractions', diff: 3, fmt: 'free', arch: 'pf-long-division', exam: true,
  src: 'Exam 1 v1 Q3 (09/22/2026), v2 variant $x^2-9$',
  prompt: 'Compute $\\displaystyle\\int \\frac{x^{3}-4x+12}{x^{2}-4}\\,dx$.',
  choices: [K(R`\frac{x^{2}}{2}+3\ln|x-2|-3\ln|x+2|+C`),
    W(R`3\ln|x-2|-3\ln|x+2|+C`, 'You skipped long division. Degree 3 over degree 2 is improper: the quotient $x$ integrates to $\\frac{x^2}{2}$.', 'setup'),
    W(R`\frac{x^{2}}{2}+3\ln|x-2|+3\ln|x+2|+C`, 'Sign of $B$: $\\frac{12}{x^2-4}=\\frac{3}{x-2}-\\frac{3}{x+2}$.', 'sign'),
    W(R`x^{2}+3\ln|x-2|-3\ln|x+2|+C`, '$\\int x\\,dx=\\frac{x^2}{2}$, not $x^2$.', 'power-rule')],
  steps: ['Divide: $x^3-4x+12=x(x^2-4)+12$, so the integrand is $x+\\frac{12}{x^2-4}$.', '$\\frac{12}{(x-2)(x+2)}=\\frac{A}{x-2}+\\frac{B}{x+2}$; $12=A(x+2)+B(x-2)$: $A=3$, $B=-3$.', '$\\frac{x^2}{2}+3\\ln|x-2|-3\\ln|x+2|+C$.'],
  recall: 'Degree of numerator $\\ge$ denominator: long division first, then partial fractions.',
  hints: ['Compare the degrees.', 'After dividing, plug $x=\\pm2$ into $12=A(x+2)+B(x-2)$.'],
});
P.push({
  id: 'xi-s-9x3e', topic: 'Tabular & Looping Parts', diff: 3, fmt: 'free', arch: 'tabular', exam: true,
  src: 'Exam 1 v1 Q5 (09/22/2026)',
  prompt: 'Compute $\\displaystyle\\int 9x^{3}e^{-3x}\\,dx$.',
  choices: [K(R`-e^{-3x}\left(3x^{3}+3x^{2}+2x+\frac{2}{3}\right)+C`),
    W(R`-e^{-3x}\left(3x^{3}-3x^{2}+2x-\frac{2}{3}\right)+C`, 'Tabular signs alternate $+,-,+,-$ on the table but each $\\int e^{-3x}$ also brings a minus: all four terms end up with the same sign.', 'sign'),
    W(R`-e^{-3x}\left(3x^{3}+3x^{2}+2x+2\right)+C`, 'Last term: $\\frac{9\\cdot6}{81}=\\frac23$, not $2$. Every column divides by $-3$ again.', 'dropped-factor'),
    W(R`-3x^{3}e^{-3x}+C`, 'Only one round of parts; the leftover $\\int x^2e^{-3x}$ was dropped.', 'conceptual')],
  steps: ['Tabular: $u=9x^3$ and derivatives $27x^2,\\,54x,\\,54,\\,0$; $dv=e^{-3x}$ and antiderivatives $-\\frac13e^{-3x},\\,\\frac19e^{-3x},\\,-\\frac1{27}e^{-3x},\\,\\frac1{81}e^{-3x}$.', 'Terms: $-3x^3e^{-3x}-3x^2e^{-3x}-2xe^{-3x}-\\frac23e^{-3x}$.'],
  recall: 'Polynomial times exponential: tabular method, alternate signs, divide by the inner coefficient each step.',
  hints: ['Differentiate the polynomial column to zero.'],
});
P.push({
  id: 'xi-s-excos', topic: 'Tabular & Looping Parts', diff: 3, fmt: 'free', arch: 'looping-parts', exam: true,
  src: 'Exam 1 v1 Q8 (09/22/2026)',
  prompt: 'Compute $\\displaystyle\\int e^{x}\\cos x\\,dx$.',
  choices: [K(R`\frac{e^{x}(\sin x+\cos x)}{2}+C`),
    W(R`e^{x}(\sin x+\cos x)+C`, 'Parts twice gives $I=e^x(\\sin x+\\cos x)-I$. Solve: $2I=\\dots$, so divide by $2$.', 'dropped-factor'),
    W(R`\frac{e^{x}(\sin x-\cos x)}{2}+C`, 'Sign slip in the second round of parts: the $\\cos$ term is positive.', 'sign'),
    W(R`e^{x}\sin x+C`, 'One round only. Differentiating gives $e^x\\sin x+e^x\\cos x$, which is not $e^x\\cos x$.', 'conceptual')],
  steps: ['$I=e^x\\sin x-\\int e^x\\sin x\\,dx$.', '$\\int e^x\\sin x\\,dx=-e^x\\cos x+I$.', '$I=e^x\\sin x+e^x\\cos x-I\\Rightarrow I=\\frac{e^x(\\sin x+\\cos x)}{2}+C$.'],
  recall: 'When the original integral reappears, treat it as an unknown and solve.',
  hints: ['Do parts twice with the same choice of $u$ type both times.'],
});
P.push({
  id: 'xi-s-sin3', topic: 'Trigonometric Integrals', diff: 2, fmt: 'free', arch: 'trig-odd-def', exam: true,
  src: 'Exam 1 v1 Q4 / v2 solution (answer 4/3)',
  prompt: 'Compute $\\displaystyle\\int_{0}^{\\pi}\\sin^{3}\\theta\\,d\\theta$.',
  choices: [K(R`\frac{4}{3}`),
    W(R`0`, '$\\sin^3$ is not odd on $[0,\\pi]$; it is $\\ge0$ there, so the integral is positive.', 'conceptual'),
    W(R`\frac{2}{3}`, 'That is the value over $[0,\\pi/2]$. You need the full $[0,\\pi]$.', 'limits'),
    W(R`-\frac{4}{3}`, 'Sign: $u=\\cos\\theta$ gives $du=-\\sin\\theta\\,d\\theta$ **and** the limits flip ($1\\to-1$), so the two minus signs cancel.', 'sign')],
  steps: ['$\\sin^3\\theta=(1-\\cos^2\\theta)\\sin\\theta$; $u=\\cos\\theta$, $du=-\\sin\\theta\\,d\\theta$.', '$\\theta=0\\to u=1$, $\\theta=\\pi\\to u=-1$.', '$\\int_1^{-1}-(1-u^2)du=\\int_{-1}^{1}(1-u^2)du=\\frac43$.'],
  recall: 'Odd power of sine: peel one $\\sin$, set $u=\\cos$, and **change the limits**.',
  hints: ['Peel off one $\\sin\\theta$.', 'What are $u(0)$ and $u(\\pi)$?'],
});
P.push({
  id: 'xi-s-sin-setup', topic: 'Surface Area', unit: 'applications', diff: 3, fmt: 'multi', arch: 'setup-sin', exam: true,
  src: 'Exam 1 v1 Q2 (09/22/2026)',
  prompt: 'Let $C$ be the curve $y=\\sin x$ on $[0,\\pi]$. Select **all** correct set-ups (do not evaluate).',
  choices: [
    { t: R`$\displaystyle\int_0^{\pi}\sqrt{1+\cos^{2}x}\,dx$ is the arc length of $C$`, ok: true, why: 'Arc length is $\\int\\sqrt{1+(f\')^2}\\,dx$ with $f\'=\\cos x$.' },
    { t: R`$\displaystyle2\pi\int_0^{\pi}x\sqrt{1+\cos^{2}x}\,dx$ is the area from rotating $C$ about the $y$-axis`, ok: true, why: 'Rotating about the $y$-axis, the radius is $x$.' },
    { t: R`$\displaystyle2\pi\int_0^{\pi}\sin x\sqrt{1+\cos^{2}x}\,dx$ is the area from rotating $C$ about the $x$-axis`, ok: true, why: 'About the $x$-axis the radius is $y=\\sin x$.' },
    { t: R`$\displaystyle2\pi\int_0^{\pi}\sin x\sqrt{1+\sin^{2}x}\,dx$ is the area from rotating $C$ about the $x$-axis`, why: 'Inside the root you need $(f\')^2=\\cos^2x$, not $f^2$.' },
    { t: R`$\displaystyle2\pi\int_0^{\pi}x\sqrt{1+\cos^{2}x}\,dx$ is the area from rotating $C$ about the $x$-axis`, why: 'That radius $x$ belongs to a rotation about the $y$-axis.' },
  ],
  steps: ['$f(x)=\\sin x$, $f\'(x)=\\cos x$.', 'Arc length: $\\int_0^\\pi\\sqrt{1+\\cos^2x}\\,dx\\approx3.82$.', 'Surface area: $2\\pi\\int(\\text{radius})\\,ds$; radius is $y$ for the $x$-axis and $x$ for the $y$-axis.'],
  recall: 'Surface of revolution: $2\\pi\\cdot(\\text{distance to axis})\\cdot ds$.',
  hints: ['What is the distance from a point on the curve to each axis?'],
});
P.push({
  id: 'xi-s-err-usub', topic: 'Linear u-Substitution', diff: 3, fmt: 'error', arch: 'err-usub-xrad',
  src: 'Exam 1 v1 Q1(b) (typical student error)',
  prompt: 'A student computes $\\int\\frac{x}{\\sqrt{x+5}}\\,dx$. Find the first line that contains an error.',
  work: ['$u=x+5,\\quad du=dx$', '$\\displaystyle\\int\\frac{x}{\\sqrt{x+5}}dx=\\int\\frac{x}{\\sqrt u}\\,du=\\int\\frac{u}{\\sqrt u}\\,du$', '$=\\displaystyle\\int u^{1/2}du=\\frac23u^{3/2}+C$', '$=\\frac23(x+5)^{3/2}+C$'],
  choices: [
    { t: 'Line 1', why: 'Line 1 is fine: $u=x+5$ gives $du=dx$.' },
    { t: 'Line 2', ok: true, why: 'The numerator $x$ is **not** $u$. Since $u=x+5$, $x=u-5$. Replacing $x$ by $u$ is the error.' },
    { t: 'Line 3', why: 'Line 3 follows from line 2 as written; the error is earlier.' },
    { t: 'Line 4', why: 'Line 4 only substitutes back; the error is earlier.' },
    { t: 'No error', why: 'Line 2 is wrong: $x\\ne u$.' },
  ],
  keyWhy: 'Line 2: $x=u-5$, not $u$.',
  steps: ['Line 2 should read $\\int\\frac{u-5}{\\sqrt u}du$.', 'Then $\\frac23u^{3/2}-10u^{1/2}+C=\\frac23(x-10)\\sqrt{x+5}+C$.'],
  recall: 'Every $x$ in the integrand must be rewritten in terms of $u$, not only $dx$.',
  hints: ['Is the numerator equal to $u$?'],
});
P.push({
  id: 'xi-s-err-sin3', topic: 'Trigonometric Integrals', diff: 3, fmt: 'error', arch: 'err-limits', exam: true,
  src: 'Exam 1 v1 Q4 trap: change limits',
  prompt: 'A student computes $\\int_0^{\\pi}\\sin^3\\theta\\,d\\theta$. Find the first line that contains an error.',
  work: ['$\\sin^3\\theta=(1-\\cos^2\\theta)\\sin\\theta$', '$u=\\cos\\theta,\\quad du=-\\sin\\theta\\,d\\theta$', '$\\displaystyle\\int_0^{\\pi}\\sin^3\\theta\\,d\\theta=-\\int_0^{\\pi}(1-u^2)\\,du$', '$=-\\left[\\pi-\\frac{\\pi^3}{3}\\right]$'],
  choices: [
    { t: 'Line 1', why: 'Line 1 is the standard Pythagorean rewrite.' },
    { t: 'Line 2', why: 'Line 2 has the right $du$ with its minus sign.' },
    { t: 'Line 3', ok: true, why: 'Limits were not converted: $u=\\cos\\theta$ takes $\\theta=0\\mapsto1$ and $\\theta=\\pi\\mapsto-1$. The $u$-integral must run from $1$ to $-1$.' },
    { t: 'Line 4', why: 'Line 4 follows from line 3; the error is earlier.' },
    { t: 'No error', why: 'The limits in line 3 are still $\\theta$-values.' },
  ],
  keyWhy: 'Line 3: limits must become $u=1$ to $u=-1$.',
  steps: ['$-\\int_1^{-1}(1-u^2)du=\\int_{-1}^{1}(1-u^2)du=\\frac43$.'],
  recall: 'Substituting in a definite integral: convert the limits the instant you write the new integral sign.',
  hints: ['Evaluate $u=\\cos\\theta$ at each limit.'],
});

// ---- Method Judgment true/false (checkins) ----
function tf(id, q, v, keyWhy, src) {
  P.push({
    id, topic: 'Method Judgment', unit: 'checkins', diff: 3, tf: true, arch: id, src,
    prompt: `**True or false?**  ${q}`,
    choices: [{ t: 'True', ok: v === true, ...(v ? {} : {}) }, { t: 'False', ok: v === false }].map((c, i) => (c.ok ? c : { ...c, why: keyWhy })),
    keyWhy, steps: [keyWhy], recall: keyWhy,
  });
}
tf('xi-tf-bounds', 'For $\\int_0^2xe^{x^2}dx$ with $u=x^2$, the new integral is $\\frac12\\int_0^2e^u\\,du$.', false,
  'The limits are in $x$. At $x=2$, $u=4$, so the integral is $\\frac12\\int_0^4e^u\\,du$.', 'Lecture 08-18 trap: change bounds');
tf('xi-tf-log-parts', 'To compute $\\int\\ln x\\,dx$ you must use integration by parts, even though there is only one factor.', true,
  'Take $u=\\ln x$, $dv=dx$ (a hidden factor of $1$): $x\\ln x-x+C$. No substitution makes $\\ln x$ elementary.', 'Lecture 08-25 LIATE');
tf('xi-tf-ftc-pole', 'Since $\\frac{-1}{x}$ is an antiderivative of $\\frac1{x^2}$, $\\int_{-1}^{1}\\frac{dx}{x^2}=\\left[-\\frac1x\\right]_{-1}^{1}=-2$.', false,
  'The integrand blows up at $x=0$ inside $[-1,1]$, so the integral is improper (and diverges). FTC does not apply across a discontinuity; a positive integrand can never give $-2$.', 'Lecture 09-10 improper integrals');
tf('xi-tf-irreducible', 'To integrate $\\frac{1}{x^2+4}$ you first need partial fractions.', false,
  '$x^2+4$ is irreducible and the fraction is already proper: it is directly $\\frac12\\arctan\\frac x2+C$. Partial fractions only splits products of factors.', 'Lecture 09-03 partial fractions');
tf('xi-tf-sec-for-sqrt', 'For $\\int\\sqrt{9-x^2}\\,dx$ the right substitution is $x=3\\tan\\theta$.', false,
  '$9-x^2$ has the form $a^2-x^2$, so use $x=3\\sin\\theta$ (then $\\sqrt{9-x^2}=3\\cos\\theta$). $\\tan$ is for $a^2+x^2$.', 'Exam 1 v1 Q6 pattern');
tf('xi-tf-comp-dir', 'If $0\\le f(x)\\le g(x)$ on $[1,\\infty)$ and $\\int_1^\\infty g$ diverges, then $\\int_1^\\infty f$ diverges.', false,
  'The smaller function can still converge. Divergence transfers only **up**: if $f\\ge g\\ge0$ and $\\int g$ diverges. Example $f=\\frac1{x^2}\\le g=\\frac1x$.', 'Direct Comparison for improper integrals');
tf('xi-tf-trap-over', 'If $f$ is concave up on $[a,b]$, the Trapezoid Rule overestimates $\\int_a^bf$.', true,
  'On a concave-up graph a chord lies above the curve, so each trapezoid is larger than the area under the curve.', 'Numerical integration');
tf('xi-tf-arc-sa', 'The arc length of $y=f(x)$ on $[a,b]$ is $2\\pi\\int_a^b f(x)\\sqrt{1+f\'(x)^2}\\,dx$.', false,
  'That is the surface area when revolving about the $x$-axis. Arc length is $\\int_a^b\\sqrt{1+f\'(x)^2}\\,dx$ with no $2\\pi f$.', 'Exam 1 v1 Q2');

// =================================================================
// GENERATORS
// =================================================================

// 1. linear u-sub, three families
G.push({
  id: 'g-xi-linusub', topic: 'Linear u-Substitution', diff: 2,
  make(r) {
    const a = r.int(2, 7);
    const fam = r.pick(['rad', 'xrad', 'rat']);
    let integrand, key, pool, steps, recall;
    if (fam === 'rad') {
      integrand = R`\frac{x}{\sqrt{x+${a}}}`;
      key = R`\frac{2}{3}(x-${2 * a})\sqrt{x+${a}}+C`;
      pool = [W(R`\frac{2}{3}(x+${a})^{3/2}+C`, 'You turned $dx$ into $du$ but left the numerator $x$ unconverted ($x=u-a$).', 'dropped-factor'),
        W(R`\frac{2}{3}(x+${2 * a})\sqrt{x+${a}}+C`, `Sign: $x=u-${a}$, so the constant is $-2\\cdot${a}$.`, 'sign'),
        W(R`2x\sqrt{x+${a}}+C`, 'You integrated $\\frac1{\\sqrt{x+a}}$ and carried $x$ along as a constant.', 'formula-confusion'),
        W(R`\frac{2}{3}(x-${a})\sqrt{x+${a}}+C`, `The constant is $-2a=-${2 * a}$; you forgot the 2 from $\\int u^{-1/2}=2u^{1/2}$.`, 'dropped-factor')];
      steps = [`$u=x+${a}$, $x=u-${a}$.`, `$\\int\\frac{u-${a}}{\\sqrt u}du=\\frac23u^{3/2}-${2 * a}u^{1/2}$.`, 'Factor out $\\sqrt u$ and substitute back.'];
    } else if (fam === 'xrad') {
      integrand = R`x\sqrt{x+${a}}`;
      key = R`\frac{2}{15}(3x-${2 * a})(x+${a})^{3/2}+C`;
      pool = [W(R`\frac{2}{5}(x+${a})^{5/2}+C`, 'You substituted only inside the root; the factor $x$ must become $u-a$.', 'dropped-factor'),
        W(R`\frac{2}{15}(3x+${2 * a})(x+${a})^{3/2}+C`, 'Sign of the constant after factoring $(x+a)^{3/2}$.', 'sign'),
        W(R`\frac{x^{2}}{2}\cdot\frac{2}{3}(x+${a})^{3/2}+C`, 'Integrating factors separately is never a rule.', 'formula-confusion'),
        W(R`\frac{2}{15}(3x-${a})(x+${a})^{3/2}+C`, `Constant should be $-2a=-${2 * a}$ after combining $\\frac25u^{5/2}-\\frac{2a}{3}u^{3/2}$.`, 'algebra-slip')];
      steps = [`$u=x+${a}$, $x=u-${a}$.`, `$\\int(u-${a})u^{1/2}du=\\frac25u^{5/2}-\\frac{${2 * a}}{3}u^{3/2}$.`, 'Factor $u^{3/2}$ and substitute back.'];
    } else {
      integrand = R`\frac{x}{(x+${a})^{2}}`;
      key = R`\ln|x+${a}|+\frac{${a}}{x+${a}}+C`;
      pool = [W(R`\ln|x+${a}|-\frac{${a}}{x+${a}}+C`, `Sign: $\\int-${a}u^{-2}du=+\\frac{${a}}{u}$.`, 'sign'),
        W(R`-\frac{1}{x+${a}}+C`, 'You treated the numerator as if it were $1$.', 'dropped-factor'),
        W(R`\frac{x^{2}}{2(x+${a})}+C`, 'Power rule applied to numerator and denominator separately.', 'formula-confusion'),
        W(R`\ln|x+${a}|+C`, `The $-${a}$ part of $x=u-${a}$ was dropped.`, 'dropped-factor')];
      steps = [`$u=x+${a}$, $x=u-${a}$.`, `$\\int\\frac{u-${a}}{u^2}du=\\int(\\frac1u-\\frac{${a}}{u^2})du=\\ln|u|+\\frac{${a}}{u}$.`];
    }
    return {
      fmt: 'free', arch: 'linear-usub', src: 'Exam 1 v1 Q1(b) archetype',
      prompt: `Compute $\\displaystyle\\int ${integrand}\\,dx$. Show all work and completely simplify.`,
      choices: mc(key, pool), steps,
      recall: 'Linear $u=x+a$: rewrite every leftover $x$ as $u-a$, integrate term by term, substitute back.',
      hints: [`Let $u=x+${a}$. What is $x$ in terms of $u$?`],
    };
  },
});

// 2. u-sub definite (foundations): bounds
G.push({
  id: 'g-xi-usubdef', topic: 'u-Substitution', unit: 'foundations', diff: 2,
  make(r) {
    const fam = r.pick(['rad', 'ln', 'exp']);
    if (fam === 'rad') {
      const [b, m] = r.pick([[3, 4], [4, 3], [6, 8]]);
      const n = Math.round(Math.sqrt(b * b + m * m));
      const key = frac(n ** 3 - m ** 3, 3);
      return {
        fmt: 'mc', arch: 'usub-bounds', src: 'Lecture 08-18: change bounds',
        prompt: `Evaluate $\\displaystyle\\int_{0}^{${b}} x\\sqrt{x^{2}+${m * m}}\\,dx$.`,
        choices: mc(key, [W(frac(2 * (n ** 3 - m ** 3), 3), 'Forgot the $\\frac12$ from $du=2x\\,dx$.', 'dropped-factor'),
          W(frac(n ** 3, 3), 'You evaluated at the upper limit only; subtract the lower value.', 'limits'),
          W(`\\frac{${b}^{3/2}}{3}`, 'You used $u^{3/2}/3$ with the old $x$-limits. Convert: $x=0\\mapsto u=' + m * m + '$.', 'limits'),
          W(frac(n ** 2 - m ** 2, 2), 'Power rule for $\\sqrt u$ gives $\\frac23u^{3/2}$, not $\\frac{u^2}{2}$.', 'power-rule')]),
        steps: [`$u=x^2+${m * m}$, $du=2x\\,dx$; limits $0\\mapsto${m * m}$, $${b}\\mapsto${n * n}$.`, `$\\frac12\\int_{${m * m}}^{${n * n}}u^{1/2}du=\\frac13\\left(${n * n}^{3/2}-${m * m}^{3/2}\\right)=${key}$.`],
        recall: 'Change the limits with the variable, or substitute back before evaluating. Never mix.',
      };
    }
    if (fam === 'ln') {
      const k = r.int(2, 3), n = r.int(2, 3);
      const key = frac(k ** (n + 1), n + 1);
      return {
        fmt: 'mc', arch: 'usub-bounds', src: 'Lecture 08-18: change bounds',
        prompt: `Evaluate $\\displaystyle\\int_{1}^{e^{${k}}} \\frac{(\\ln x)^{${n}}}{x}\\,dx$.`,
        choices: mc(key, [W(R`k^{${n + 1}}`.replace('k', k), `Forgot the $\\frac1{${n + 1}}$ from the power rule.`, 'dropped-factor'),
          W(`\\frac{e^{${k * (n + 1)}}-1}{${n + 1}}`, 'You plugged the $x$-limits into $u^{n+1}/(n+1)$. With $u=\\ln x$ the limits become $0$ and $' + k + '$.', 'limits'),
          W(frac(k ** n, n), 'Power-rule slip: antiderivative of $u^{' + n + '}$ is $\\frac{u^{' + (n + 1) + '}}{' + (n + 1) + '}$.', 'power-rule'),
          W(frac(k ** (n + 1) + 1, n + 1), 'Lower limit $x=1$ gives $u=\\ln1=0$, contributing $0$, not $\\frac1{' + (n + 1) + '}$.', 'limits')]),
        steps: [`$u=\\ln x$, $du=\\frac{dx}{x}$; $x=1\\mapsto0$, $x=e^{${k}}\\mapsto${k}$.`, `$\\int_0^{${k}}u^{${n}}du=\\frac{${k}^{${n + 1}}}{${n + 1}}=${key}$.`],
        recall: 'Spot the pair $f(g(x))\\,g\'(x)$: here $\\frac{dx}{x}=d(\\ln x)$.',
      };
    }
    const a = r.int(2, 4);
    const key = `\\frac{e^{${a}}-1}{${2 * a}}`;
    return {
      fmt: 'mc', arch: 'usub-bounds', src: 'Lecture 08-18: change bounds',
      prompt: `Evaluate $\\displaystyle\\int_{0}^{1} x\\,e^{${a}x^{2}}\\,dx$.`,
      choices: mc(key, [W(`\\frac{e^{${a}}-1}{${a}}`, 'Forgot the $\\frac12$: $du=' + 2 * a + 'x\\,dx$ means $x\\,dx=\\frac{du}{' + 2 * a + '}$.', 'dropped-factor'),
        W(`\\frac{e^{${a}}}{${2 * a}}`, 'You forgot to subtract the lower value $e^0=1$.', 'limits'),
        W(`e^{${a}}-1`, 'Both the constant $\\frac1{' + 2 * a + '}$ and the chain factor were dropped.', 'dropped-factor'),
        W(`\\frac{e-1}{${2 * a}}`, 'Limits: $x=1$ gives $u=' + a + '$, not $1$.', 'limits')]),
      steps: [`$u=${a}x^2$, $du=${2 * a}x\\,dx$; $x:0\\to1$ gives $u:0\\to${a}$.`, `$\\frac1{${2 * a}}\\int_0^{${a}}e^udu=${key}$.`],
      recall: 'The derivative of the inside is sitting outside: $x\\,dx\\leftrightarrow du$.',
    };
  },
});

// 3. FTC part 1 with chain
G.push({
  id: 'g-xi-ftc', topic: 'FTC & Definite Integrals', unit: 'foundations', diff: 3,
  make(r) {
    const fam = r.pick(['rad', 'atan', 'sin']);
    const k = r.int(2, 4);
    let body, up, key, wrongs;
    if (fam === 'rad') {
      body = R`\sqrt{1+t^{3}}`; up = `x^{${k}}`; key = `${k}x^{${k - 1}}\\sqrt{1+x^{${3 * k}}}`;
      wrongs = [W(`\\sqrt{1+x^{${3 * k}}}`, 'You forgot the chain factor $u\'(x)$.', 'chain-rule'), W(`${k}x^{${k - 1}}\\sqrt{1+x^{3}}`, 'Substitute the **upper limit** for $t$, not $x$.', 'chain-rule'), W(`\\frac{(1+x^{${3 * k}})^{3/2}}{${frac(3, 2)}}`, 'You integrated. FTC says differentiate: the answer is the integrand evaluated at the limit.', 'inverse-op')];
    } else if (fam === 'atan') {
      body = R`\frac{1}{1+t^{2}}`; up = `x^{${k}}`; key = `\\frac{${k}x^{${k - 1}}}{1+x^{${2 * k}}}`;
      wrongs = [W(`\\frac{1}{1+x^{${2 * k}}}`, 'You forgot the chain factor $u\'(x)$.', 'chain-rule'), W(`\\arctan(x^{${k}})`, 'You evaluated the antiderivative instead of differentiating.', 'inverse-op'), W(`\\frac{${k}x^{${k - 1}}}{1+x^{2}}`, 'Substitute the whole upper limit $x^{' + k + '}$ for $t$ in $t^2$.', 'chain-rule')];
    } else {
      body = R`e^{t^{2}}`; up = R`\sin x`; key = R`e^{\sin^{2}x}\cos x`;
      wrongs = [W(R`e^{\sin^{2}x}`, 'You forgot the chain factor $\\cos x$.', 'chain-rule'), W(R`e^{x^{2}}\cos x`, 'Replace $t$ by the upper limit $\\sin x$, not $x$.', 'chain-rule'), W(R`2\sin x\cos x\,e^{\sin^{2}x}`, 'You differentiated the integrand again; FTC just evaluates it at the limit.', 'inverse-op')];
    }
    return {
      fmt: 'mc', arch: 'ftc-chain', src: 'FTC part 1 + chain rule',
      prompt: `Let $g(x)=\\int_{0}^{${up}} ${body}\\,dt$. Find $g'(x)$.`,
      choices: mc(key, wrongs),
      steps: ['FTC 1 with chain rule: $\\frac{d}{dx}\\int_0^{u(x)}f(t)\\,dt=f(u(x))\\,u\'(x)$.', `Here $u(x)=${up.replace(/\\/g, '\\')}$, so the answer is $${key}$.`],
      recall: 'Plug the upper limit into the integrand, then multiply by its derivative.',
    };
  },
});

// 4. parts with a lone function / mixed
G.push({
  id: 'g-xi-parts', topic: 'Integration by Parts', diff: 3,
  make(r) {
    const fam = r.pick(['atan', 'xexp', 'lnq']);
    const a = r.int(2, 4);
    if (fam === 'atan') {
      const key = `x\\arctan(${a}x)-\\frac{1}{${2 * a}}\\ln(1+${a * a}x^{2})+C`;
      return { fmt: 'free', arch: 'parts-lone-fn', src: 'Lecture 08-25 LIATE',
        prompt: `Compute $\\displaystyle\\int \\arctan(${a}x)\\,dx$.`,
        choices: mc(key, [W(`x\\arctan(${a}x)-\\ln(1+${a * a}x^{2})+C`, `Missing $\\frac1{${2 * a}}$: $\\int\\frac{${a}x}{1+${a * a}x^2}dx=\\frac1{${2 * a}}\\ln(1+${a * a}x^2)$.`, 'dropped-factor'),
          W(`x\\arctan(${a}x)+\\frac{1}{${2 * a}}\\ln(1+${a * a}x^{2})+C`, 'Parts subtracts $\\int v\\,du$.', 'sign'),
          W(`\\frac{${a}}{1+${a * a}x^{2}}+C`, 'You differentiated instead of integrating.', 'inverse-op'),
          W(`x\\arctan(${a}x)+C`, 'You stopped at $uv$ and dropped $-\\int v\\,du$.', 'conceptual')]),
        steps: [`$u=\\arctan(${a}x)$, $dv=dx$; $du=\\frac{${a}}{1+${a * a}x^2}dx$, $v=x$.`, `$x\\arctan(${a}x)-\\int\\frac{${a}x}{1+${a * a}x^2}dx$, then $w=1+${a * a}x^2$.`],
        recall: 'A lone inverse trig or log: it becomes $u$, and $dv=dx$.' };
    }
    if (fam === 'xexp') {
      const key = `-\\frac{(${a}x+1)e^{-${a}x}}{${a * a}}+C`;
      return { fmt: 'free', arch: 'parts-poly-exp', src: 'Lecture 08-25 LIATE',
        prompt: `Compute $\\displaystyle\\int x\\,e^{-${a}x}\\,dx$.`,
        choices: mc(key, [W(`-\\frac{(${a}x-1)e^{-${a}x}}{${a * a}}+C`, 'Sign: $-\\frac{x}{a}e^{-ax}-\\frac{1}{a^2}e^{-ax}$; both terms are negative.', 'sign'),
          W(`-\\frac{(${a}x+1)e^{-${a}x}}{${a}}+C`, `The second integral divides by $${a}$ again.`, 'dropped-factor'),
          W(`\\frac{(${a}x+1)e^{-${a}x}}{${a * a}}+C`, `Derivative of $v=-\\frac1{${a}}e^{-${a}x}$ carries the minus sign.`, 'sign'),
          W(`-\\frac{x^{2}e^{-${a}x}}{${2 * a}}+C`, 'Integrating each factor separately is not a rule.', 'formula-confusion')]),
        steps: [`$u=x$, $dv=e^{-${a}x}dx$: $v=-\\frac1{${a}}e^{-${a}x}$.`, `$-\\frac{x}{${a}}e^{-${a}x}+\\frac1{${a}}\\int e^{-${a}x}dx=-\\frac{x}{${a}}e^{-${a}x}-\\frac{1}{${a * a}}e^{-${a}x}$.`],
        recall: 'Polynomial times exponential: let the polynomial be $u$, and track the minus signs from the negative exponent.' };
    }
    const key = `x\\ln(x^{2}+${a * a})-2x+${2 * a}\\arctan\\frac{x}{${a}}+C`;
    return { fmt: 'free', arch: 'parts-lone-fn', src: 'Lecture 08-25 LIATE',
      prompt: `Compute $\\displaystyle\\int \\ln(x^{2}+${a * a})\\,dx$.`,
      choices: mc(key, [W(`x\\ln(x^{2}+${a * a})-2x+C`, `The leftover $\\int\\frac{2x^2}{x^2+${a * a}}dx=2x-${2 * a}\\arctan\\frac x${a}$; the $\\arctan$ part was lost.`, 'dropped-factor'),
        W(`x\\ln(x^{2}+${a * a})-2x-${2 * a}\\arctan\\frac{x}{${a}}+C`, 'Sign: $-\\int(2-\\frac{2a^2}{x^2+a^2})dx$ gives $-2x+2a\\arctan$.', 'sign'),
        W(`x\\ln(x^{2}+${a * a})-2x+${2 * a}\\arctan x+C`, `$\\int\\frac{dx}{x^2+a^2}=\\frac1a\\arctan\\frac xa$, so the argument is $\\frac x${a}$.`, 'formula-confusion'),
        W(`\\frac{2x}{x^{2}+${a * a}}+C`, 'You differentiated.', 'inverse-op')]),
      steps: [`$u=\\ln(x^2+${a * a})$, $dv=dx$: $du=\\frac{2x}{x^2+${a * a}}dx$, $v=x$.`, `$x\\ln(\\cdot)-\\int\\frac{2x^2}{x^2+${a * a}}dx$; divide: $\\frac{2x^2}{x^2+${a * a}}=2-\\frac{${2 * a * a}}{x^2+${a * a}}$.`],
      recall: 'After parts, the new integral may be improper-looking rational: divide first.' };
  },
});

// 5. looping / tabular
G.push({
  id: 'g-xi-looping', topic: 'Tabular & Looping Parts', diff: 3,
  make(r) {
    const fam = r.pick(['sin', 'cos', 'cube']);
    const a = r.int(1, 3), b = r.pick([1, 2, 3].filter(v => v !== a));
    if (fam === 'cube') {
      const c = r.int(2, 3);
      const key = `e^{${c}x}\\left(\\frac{x^{3}}{${c}}-\\frac{x^{2}}{${frac(c * c, 3)}}+\\frac{2x}{${frac(c ** 3, 3)}}-\\frac{2}{${frac(c ** 4, 3)}}\\right)+C`;
      const k2 = `e^{${c}x}\\left(\\frac{x^{3}}{${c}}-\\frac{3x^{2}}{${c * c}}+\\frac{6x}{${c ** 3}}-\\frac{6}{${c ** 4}}\\right)+C`;
      const bad1 = `e^{${c}x}\\left(\\frac{x^{3}}{${c}}+\\frac{3x^{2}}{${c * c}}+\\frac{6x}{${c ** 3}}+\\frac{6}{${c ** 4}}\\right)+C`;
      const bad2 = `e^{${c}x}\\left(\\frac{x^{3}}{${c}}-\\frac{3x^{2}}{${c * c}}+\\frac{3x}{${c ** 3}}-\\frac{1}{${c ** 4}}\\right)+C`;
      const bad3 = `e^{${c}x}\\left(x^{3}-3x^{2}+6x-6\\right)+C`;
      return { fmt: 'free', arch: 'tabular', src: 'Exam 1 v1 Q5 archetype',
        prompt: `Compute $\\displaystyle\\int x^{3}e^{${c}x}\\,dx$.`,
        choices: mc(k2, [W(bad1, 'Tabular method alternates $+,-,+,-$; all-plus is wrong.', 'sign'), W(bad2, 'Derivatives of $x^3$ are $3x^2,\\,6x,\\,6$: the coefficients $3,6,6$ were mis-copied.', 'dropped-factor'), W(bad3, `Each step divides by $${c}$ again; $${c}$ was dropped.`, 'dropped-factor')]),
        steps: ['Derivative column: $x^3,\\,3x^2,\\,6x,\\,6,\\,0$.', `Antiderivative column: $\\frac{e^{${c}x}}{${c}},\\frac{e^{${c}x}}{${c * c}},\\frac{e^{${c}x}}{${c ** 3}},\\frac{e^{${c}x}}{${c ** 4}}$.`, 'Multiply diagonally with alternating signs.'],
        recall: 'Tabular: differentiate to $0$, integrate down, diagonal products with signs $+,-,+,-,\\dots$' };
    }
    const d = a * a + b * b;
    const E = `e^{${coefx(a)}}`;
    function coefx(n) { return n === 1 ? 'x' : `${n}x`; }
    const S = tr('sin', b), C = tr('cos', b);
    let key, w1, w2, w3, f;
    if (fam === 'sin') {
      f = S;
      key = `\\frac{${E}\\left(${a}${S}-${b}${C}\\right)}{${d}}+C`;
      w1 = `\\frac{${E}\\left(${a}${S}+${b}${C}\\right)}{${d}}+C`;
      w2 = `${E}\\left(${a}${S}-${b}${C}\\right)+C`;
      w3 = `\\frac{${E}\\left(${b}${S}-${a}${C}\\right)}{${d}}+C`;
    } else {
      f = C;
      key = `\\frac{${E}\\left(${a}${C}+${b}${S}\\right)}{${d}}+C`;
      w1 = `\\frac{${E}\\left(${a}${C}-${b}${S}\\right)}{${d}}+C`;
      w2 = `${E}\\left(${a}${C}+${b}${S}\\right)+C`;
      w3 = `\\frac{${E}\\left(${b}${C}+${a}${S}\\right)}{${d}}+C`;
    }
    return { fmt: 'free', arch: 'looping-parts', src: 'Exam 1 v1 Q8 archetype',
      prompt: `Compute $\\displaystyle\\int ${E}${f}\\,dx$.`,
      choices: mc(key, [W(w1, 'A sign slipped in the second round of parts. Re-derive the relation $I=\\dots-\\frac{b^2}{a^2}I$.', 'sign'), W(w2, `After two rounds you solve for $I$ and must divide by $1+\\frac{b^2}{a^2}$ (equivalently by $${d}$ after clearing $a$).`, 'dropped-factor'), W(w3, 'The roles of $a$ and $b$ are swapped: the coefficient from the exponential goes with the function you did **not** differentiate last.', 'formula-confusion')]),
      steps: ['Parts twice, keeping the same type of $u$ both times.', 'The original integral reappears with a coefficient; move it to the left and divide.', `Check: differentiate the answer and compare with $${E}${f}$.`],
      recall: 'Exp times trig: parts twice, solve for the integral, then divide by $1+(b/a)^2$ (the $a^2+b^2$ shows up in the denominator).' };
  },
});

// 6. trigonometric integrals
G.push({
  id: 'g-xi-trigint', topic: 'Trigonometric Integrals', diff: 2,
  make(r) {
    const fam = r.pick(['odd', 'even', 'mixed']);
    if (fam === 'odd') {
      const n = r.pick([3, 5]);
      const val = n === 3 ? [4, 3] : [16, 15];
      const key = frac(val[0], val[1]);
      const half = n === 3 ? [2, 3] : [8, 15];
      return { fmt: 'free', arch: 'trig-odd-def', src: 'Exam 1 v1 Q4 archetype',
        prompt: `Compute $\\displaystyle\\int_{0}^{\\pi}\\sin^{${n}}\\theta\\,d\\theta$.`,
        choices: mc(key, [W('0', '$\\sin^n$ is non-negative on $[0,\\pi]$, so the integral is positive.', 'conceptual'), W(frac(half[0], half[1]), 'That is the value on $[0,\\pi/2]$.', 'limits'), W(frac(-val[0], val[1]), 'Two minus signs (from $du$ and from flipping limits) cancel.', 'sign'), W(frac(2 * val[0], val[1]), 'Double counting: you used $[0,\\pi]$ and then doubled again.', 'dropped-factor')]),
        steps: [`Peel off $\\sin\\theta$: $\\sin^{${n}}\\theta=(1-\\cos^2\\theta)^{${(n - 1) / 2}}\\sin\\theta$.`, '$u=\\cos\\theta$: limits $1\\to-1$; $du=-\\sin\\theta\\,d\\theta$.', `Value $=${key}$.`],
        recall: 'Odd power of $\\sin$: save one $\\sin$, convert the rest to $\\cos$, $u=\\cos$, change limits.' };
    }
    if (fam === 'even') {
      const [f, v, w] = r.pick([[R`\sin^{2}x`, '\\frac{\\pi}{2}', 'half-angle'], [R`\sin^{4}x`, '\\frac{3\\pi}{8}', 'twice'], [R`\sin^{2}x\cos^{2}x`, '\\frac{\\pi}{8}', 'double-angle']]);
      return { fmt: 'free', arch: 'trig-even-def', src: 'Half-angle identities',
        prompt: `Compute $\\displaystyle\\int_{0}^{\\pi} ${f}\\,dx$.`,
        choices: mc(v, [W('0', 'Even powers of sine are non-negative, so the integral cannot be zero.', 'conceptual'), W('\\pi', 'You integrated $1$: the $\\cos2x$ pieces integrate to $0$ but the constant has a coefficient $<1$.', 'dropped-factor'), W('\\frac{\\pi}{4}', 'Wrong constant term after the half-angle identity.', 'algebra-slip'), W('\\frac{3\\pi}{16}', 'Mixed up the coefficient of the constant term.', 'algebra-slip')]),
        steps: ['Even power: use $\\sin^2=\\frac{1-\\cos2x}{2}$ (and $\\sin x\\cos x=\\frac12\\sin2x$).', 'Terms with $\\cos(kx)$, $k\\ne0$, integrate to $0$ over a full period multiple; only the constant survives.'],
        recall: 'Even powers: half-angle / double-angle, never plain $u$-sub.' };
    }
    const n = r.pick([2, 4]);
    const key = n === 2 ? R`-\frac{\cos^{3}x}{3}+\frac{\cos^{5}x}{5}+C` : R`-\frac{\cos^{5}x}{5}+\frac{\cos^{7}x}{7}+C`;
    return { fmt: 'free', arch: 'trig-mixed-indef', src: 'Trig integrals strategy',
      prompt: `Compute $\\displaystyle\\int \\sin^{3}x\\cos^{${n}}x\\,dx$.`,
      choices: mc(key, [W(n === 2 ? R`\frac{\cos^{3}x}{3}-\frac{\cos^{5}x}{5}+C` : R`\frac{\cos^{5}x}{5}-\frac{\cos^{7}x}{7}+C`, '$du=-\\sin x\\,dx$ supplies a minus sign.', 'sign'),
        W(`-\\frac{\\cos^{${n + 1}}x}{${n + 1}}+C`, 'You used $\\sin^3x\\,dx=-du$ but left $\\sin^2x=1-u^2$ unexpanded as a constant.', 'dropped-factor'),
        W(`\\frac{\\sin^{4}x}{4}\\cdot\\frac{\\cos^{${n + 1}}x}{${n + 1}}+C`, 'Integrating the factors separately is not a rule.', 'formula-confusion'),
        W(n === 2 ? R`-\frac{\cos^{3}x}{3}+C` : R`-\frac{\cos^{5}x}{5}+C`, 'Expand $\\sin^2x=1-\\cos^2x$: there are two terms.', 'dropped-factor')]),
      steps: [`$\\sin^3x\\cos^{${n}}x=(1-\\cos^2x)\\cos^{${n}}x\\,\\sin x$.`, '$u=\\cos x$, $du=-\\sin x\\,dx$: $-\\int(1-u^2)u^{' + n + '}du$.'],
      recall: 'Odd power of $\\sin$ (or $\\cos$): save one factor for $du$ and convert the rest with $\\sin^2+\\cos^2=1$.' };
  },
});

// 7. product to sum
G.push({
  id: 'g-xi-prod2sum', topic: 'Product-to-Sum Integrals', diff: 3,
  make(r) {
    const a = r.int(3, 6), b = r.int(1, a - 1);
    const fam = r.pick(['sc', 'ss', 'cc']);
    const p = a + b, m = a - b;
    const t = (f, k) => `\\${f}${k === 1 ? ' x' : `(${k}x)`}`;
    let key, f, bads;
    if (fam === 'sc') {
      f = `\\sin(${a}x)\\cos(${b}x)`;
      key = `-\\frac{${t('cos', p)}}{${2 * p}}-\\frac{${t('cos', m)}}{${2 * m}}+C`;
      bads = [`-\\frac{${t('cos', p)}}{${2 * p}}+\\frac{${t('cos', m)}}{${2 * m}}+C`, `-\\frac{${t('cos', p)}}{${p}}-\\frac{${t('cos', m)}}{${m}}+C`, `-\\frac{\\cos(${a}x)\\sin(${b}x)}{${a * b}}+C`];
    } else if (fam === 'ss') {
      f = `\\sin(${a}x)\\sin(${b}x)`;
      key = `\\frac{${t('sin', m)}}{${2 * m}}-\\frac{${t('sin', p)}}{${2 * p}}+C`;
      bads = [`\\frac{${t('sin', m)}}{${2 * m}}+\\frac{${t('sin', p)}}{${2 * p}}+C`, `\\frac{${t('sin', m)}}{${m}}-\\frac{${t('sin', p)}}{${p}}+C`, `\\frac{\\cos(${a}x)\\cos(${b}x)}{${a * b}}+C`];
    } else {
      f = `\\cos(${a}x)\\cos(${b}x)`;
      key = `\\frac{${t('sin', m)}}{${2 * m}}+\\frac{${t('sin', p)}}{${2 * p}}+C`;
      bads = [`\\frac{${t('sin', m)}}{${2 * m}}-\\frac{${t('sin', p)}}{${2 * p}}+C`, `\\frac{${t('sin', m)}}{${m}}+\\frac{${t('sin', p)}}{${p}}+C`, `\\frac{\\sin(${a}x)\\sin(${b}x)}{${a * b}}+C`];
    }
    const whys = [['Sign of the second term: it comes from the identity, so check $\\pm$ in the product-to-sum formula.', 'sign'], ['The $\\frac12$ from the product-to-sum identity was dropped.', 'dropped-factor'], ['Integrating each factor separately. $\\int fg\\ne\\int f\\int g$.', 'formula-confusion']];
    return { fmt: 'free', arch: 'prod2sum', src: 'Product-to-sum identities',
      prompt: `Compute $\\displaystyle\\int ${f}\\,dx$.`,
      choices: mc(key, bads.map((t2, i) => W(t2, whys[i][0], whys[i][1]))),
      steps: [fam === 'sc' ? '$\\sin A\\cos B=\\frac12[\\sin(A+B)+\\sin(A-B)]$.' : fam === 'ss' ? '$\\sin A\\sin B=\\frac12[\\cos(A-B)-\\cos(A+B)]$.' : '$\\cos A\\cos B=\\frac12[\\cos(A-B)+\\cos(A+B)]$.', `Here $A+B=${p}x$ and $A-B=${m}x$; integrate each term.`],
      recall: 'Product of different-frequency sines/cosines: turn it into a sum with the product-to-sum identities.' };
  },
});

// 8. trig sub compute
G.push({
  id: 'g-xi-trigsub', topic: 'Trigonometric Substitution', diff: 3,
  make(r) {
    const a = r.int(2, 5), a2 = a * a;
    const fam = r.pick(['sin', 'tan', 'sec']);
    if (fam === 'sin') {
      const key = `\\frac{x}{${a2}\\sqrt{${a2}-x^{2}}}+C`;
      return { fmt: 'free', arch: 'trigsub-compute', src: 'Exam 1 v1 Q6 archetype',
        prompt: `Compute $\\displaystyle\\int \\frac{dx}{(${a2}-x^{2})^{3/2}}$.`,
        choices: mc(key, [W(`\\frac{x}{\\sqrt{${a2}-x^{2}}}+C`, `The $\\frac1{${a2}}$ in front of $\\int\\sec^2\\theta\\,d\\theta$ was dropped.`, 'dropped-factor'), W(`\\frac{\\sqrt{${a2}-x^{2}}}{${a2}x}+C`, 'Triangle inverted: $\\tan\\theta=\\frac{\\text{opp}}{\\text{adj}}=\\frac{x}{\\sqrt{a^2-x^2}}$.', 'inverted'), W(`\\frac{1}{${a2}}\\tan\\theta+C`, 'Never converted back to $x$.', 'setup'), W(`\\frac{x}{${a}\\sqrt{${a2}-x^{2}}}+C`, `Factor is $\\frac1{a^2}=\\frac1{${a2}}$, not $\\frac1a$.`, 'dropped-factor')]),
        steps: [`$x=${a}\\sin\\theta$, $dx=${a}\\cos\\theta\\,d\\theta$, $(${a2}-x^2)^{3/2}=${a ** 3}\\cos^3\\theta$.`, `$\\frac1{${a2}}\\int\\sec^2\\theta\\,d\\theta=\\frac1{${a2}}\\tan\\theta$; triangle: opp $x$, hyp $${a}$.`],
        recall: '$a^2-x^2\\to x=a\\sin\\theta$.' };
    }
    if (fam === 'tan') {
      const key = `\\frac{x}{${a2}\\sqrt{x^{2}+${a2}}}+C`;
      return { fmt: 'free', arch: 'trigsub-compute', src: 'Trig-sub archetype (Exam 1 v1 Q6 style)',
        prompt: `Compute $\\displaystyle\\int \\frac{dx}{(x^{2}+${a2})^{3/2}}$.`,
        choices: mc(key, [W(`\\frac{x}{\\sqrt{x^{2}+${a2}}}+C`, `Missing the $\\frac1{${a2}}$ from $\\frac{1}{a^2}\\int\\cos\\theta\\,d\\theta$.`, 'dropped-factor'), W(`\\frac{\\sqrt{x^{2}+${a2}}}{${a2}x}+C`, 'Triangle inverted: $\\sin\\theta=\\frac{x}{\\sqrt{x^2+a^2}}$.', 'inverted'), W(`\\frac{1}{${a2}}\\sin\\theta+C`, 'Not back-substituted.', 'setup'), W(`\\frac{1}{${a2}}\\ln|x+\\sqrt{x^{2}+${a2}}|+C`, 'That is $\\int\\frac{dx}{\\sqrt{x^2+a^2}}$; here the exponent is $3/2$.', 'formula-confusion')]),
        steps: [`$x=${a}\\tan\\theta$, $dx=${a}\\sec^2\\theta\\,d\\theta$, $(x^2+${a2})^{3/2}=${a ** 3}\\sec^3\\theta$.`, `$\\frac1{${a2}}\\int\\cos\\theta\\,d\\theta=\\frac{\\sin\\theta}{${a2}}$; $\\sin\\theta=\\frac{x}{\\sqrt{x^2+${a2}}}$.`],
        recall: '$a^2+x^2\\to x=a\\tan\\theta$.' };
    }
    const key = `\\frac{\\sqrt{x^{2}-${a2}}}{${a2}x}+C`;
    return { fmt: 'free', arch: 'trigsub-compute', src: 'Trig-sub archetype',
      prompt: `Compute $\\displaystyle\\int \\frac{dx}{x^{2}\\sqrt{x^{2}-${a2}}}$ for $x>${a}$.`,
      choices: mc(key, [W(`\\frac{x}{${a2}\\sqrt{x^{2}-${a2}}}+C`, 'Triangle inverted: $\\sin\\theta=\\frac{\\text{opp}}{\\text{hyp}}=\\frac{\\sqrt{x^2-a^2}}{x}$.', 'inverted'), W(`\\frac{\\sqrt{x^{2}-${a2}}}{x}+C`, `The $\\frac1{${a2}}$ was dropped.`, 'dropped-factor'), W(`\\frac{\\sin\\theta}{${a2}}+C`, 'Not back-substituted.', 'setup'), W(`\\frac{1}{${a}}\\operatorname{arcsec}\\frac{x}{${a}}+C`, 'That is $\\int\\frac{dx}{x\\sqrt{x^2-a^2}}$; here there is an $x^2$.', 'formula-confusion')]),
      steps: [`$x=${a}\\sec\\theta$, $dx=${a}\\sec\\theta\\tan\\theta\\,d\\theta$, $\\sqrt{x^2-${a2}}=${a}\\tan\\theta$.`, `$\\frac1{${a2}}\\int\\cos\\theta\\,d\\theta=\\frac{\\sin\\theta}{${a2}}$ with $\\sin\\theta=\\frac{\\sqrt{x^2-${a2}}}{x}$.`],
      recall: '$x^2-a^2\\to x=a\\sec\\theta$.' };
  },
});

// 9. trig sub setup
G.push({
  id: 'g-xi-trigsub-setup', topic: 'Trigonometric Substitution', diff: 2,
  make(r) {
    const a = r.int(2, 6), a2 = a * a;
    const fam = r.pick(['sin', 'tan', 'sec']);
    const defs = {
      sin: { f: `\\frac{x^{2}}{\\sqrt{${a2}-x^{2}}}`, sub: `x=${a}\\sin\\theta`, res: `${a2}\\displaystyle\\int\\sin^{2}\\theta\\,d\\theta`, forgot: `${a}\\displaystyle\\int\\frac{\\sin^{2}\\theta}{\\cos\\theta}\\,d\\theta`, wsub: `x=${a}\\tan\\theta`, wres: `${a2}\\displaystyle\\int\\tan^{2}\\theta\\,d\\theta`, wsub2: `x=${a}\\sec\\theta`, wres2: `${a2}\\displaystyle\\int\\sec^2\\theta\\,d\\theta` },
      tan: { f: `\\frac{x^{2}}{\\sqrt{x^{2}+${a2}}}`, sub: `x=${a}\\tan\\theta`, res: `${a2}\\displaystyle\\int\\tan^{2}\\theta\\sec\\theta\\,d\\theta`, forgot: `${a}\\displaystyle\\int\\tan^{2}\\theta\\,d\\theta`, wsub: `x=${a}\\sin\\theta`, wres: `${a2}\\displaystyle\\int\\frac{\\sin^{2}\\theta}{\\cos\\theta}\\,d\\theta`, wsub2: `x=${a}\\sec\\theta`, wres2: `${a2}\\displaystyle\\int\\sec^{2}\\theta\\tan\\theta\\,d\\theta` },
      sec: { f: `\\frac{\\sqrt{x^{2}-${a2}}}{x}`, sub: `x=${a}\\sec\\theta`, res: `${a}\\displaystyle\\int\\tan^{2}\\theta\\,d\\theta`, forgot: `${a}\\displaystyle\\int\\frac{\\tan\\theta}{\\sec\\theta}\\,d\\theta`, wsub: `x=${a}\\tan\\theta`, wres: `${a}\\displaystyle\\int\\frac{\\sec^{2}\\theta\\,d\\theta}{\\tan\\theta}`, wsub2: `x=${a}\\sin\\theta`, wres2: `${a}\\displaystyle\\int\\frac{\\cos^2\\theta}{\\sin\\theta}\\,d\\theta` },
    }[fam];
    const t = (s, q) => `${s}:\\ ${q}`;
    return { fmt: 'mc', arch: 'trigsub-setup', src: 'Exam 1 v1 Q6 archetype (set up only)',
      prompt: `Which substitution, and which resulting $\\theta$-integral, correctly starts $\\displaystyle\\int ${defs.f}\\,dx$? (Do not finish.)`,
      choices: [K(t(defs.sub, defs.res)), W(t(defs.sub, defs.forgot), 'You used the right substitution but forgot the factor from $dx$ (it contributes $a\\cos\\theta$, $a\\sec^2\\theta$, or $a\\sec\\theta\\tan\\theta$).', 'dropped-factor'), W(t(defs.wsub, defs.wres), `The radical does not match this substitution: look at the sign inside the root ($${fam === 'sin' ? 'a^2-x^2\\to\\sin' : fam === 'tan' ? 'a^2+x^2\\to\\tan' : 'x^2-a^2\\to\\sec'}$).`, 'setup'), W(t(defs.wsub2, defs.wres2), 'With this substitution the root does not simplify to a single trig factor.', 'setup')],
      steps: [fam === 'sin' ? '$a^2-x^2$: $x=a\\sin\\theta$ makes the root $a\\cos\\theta$.' : fam === 'tan' ? '$x^2+a^2$: $x=a\\tan\\theta$ makes the root $a\\sec\\theta$.' : '$x^2-a^2$: $x=a\\sec\\theta$ makes the root $a\\tan\\theta$.', 'Do not forget $dx$.'],
      recall: '$a^2-x^2$: sine. $a^2+x^2$: tangent. $x^2-a^2$: secant. And always include the $dx$ factor.' };
  },
});

// 10. trig sub back-substitution via triangle
G.push({
  id: 'g-xi-trigsub-back', topic: 'Trigonometric Substitution', diff: 2,
  make(r) {
    const a = r.int(2, 7);
    const fam = r.pick(['sin', 'tan', 'sec']);
    const T = {
      sin: { sub: `x=${a}\\sin\\theta`, opp: 'x', adj: `\\sqrt{${a * a}-x^{2}}`, hyp: `${a}` },
      tan: { sub: `x=${a}\\tan\\theta`, opp: 'x', adj: `${a}`, hyp: `\\sqrt{x^{2}+${a * a}}` },
      sec: { sub: `x=${a}\\sec\\theta`, opp: `\\sqrt{x^{2}-${a * a}}`, adj: `${a}`, hyp: 'x' },
    }[fam];
    const ratios = { sin: ['opp', 'hyp'], cos: ['adj', 'hyp'], tan: ['opp', 'adj'], cot: ['adj', 'opp'], sec: ['hyp', 'adj'], csc: ['hyp', 'opp'] };
    const asked = r.pick(['cos', 'tan', 'sec', 'cot']).replace(/^$/, 'cos');
    const fr = ([n, d]) => `\\frac{${T[n]}}{${T[d]}}`;
    const inv = { cos: 'sec', tan: 'cot', sec: 'cos', cot: 'tan' }[asked];
    const other = { cos: 'sin', tan: 'sin', sec: 'tan', cot: 'cos' }[asked];
    const key = fr(ratios[asked]);
    return { fmt: 'mc', arch: 'trigsub-triangle', src: 'Exam 1 v1 Q6 back-substitution',
      prompt: `After the substitution $${T.sub}$ (with $\\theta$ acute), express $\\${asked}\\theta$ in terms of $x$.`,
      choices: mc(key, [inv, other, ...Object.keys(ratios).filter(k => k !== asked && k !== inv && k !== other)].map(k => W(fr(ratios[k]), k === inv ? `That is $\\${k}\\theta$, the reciprocal. Re-read the ratio: $\\${asked}=\\frac{${ratios[asked][0]}}{${ratios[asked][1]}}$.` : `That is $\\${k}\\theta$, a different ratio from the same triangle.`, k === inv ? 'inverted' : 'formula-confusion'))),
      steps: [`Label the right triangle from $${T.sub}$: opposite $=${T.opp}$, adjacent $=${T.adj}$, hypotenuse $=${T.hyp}$.`, `$\\${asked}\\theta=\\frac{${ratios[asked][0]}}{${ratios[asked][1]}}=${key}$.`],
      recall: 'Draw the triangle from the substitution, fill the third side with Pythagoras, then read off the ratio.' };
  },
});

// 11. partial fractions: form
G.push({
  id: 'g-xi-pf-setup', topic: 'Partial Fractions', diff: 2,
  make(r) {
    const p = r.int(2, 5), q = r.int(1, 4), a = r.int(2, 5);
    const fam = r.pick(['repeat', 'quad', 'improper']);
    if (fam === 'repeat') {
      return { fmt: 'mc', arch: 'pf-form', src: 'Lecture 09-03/09-08 partial fractions',
        prompt: `Write the form of the partial fraction decomposition of $\\dfrac{3x+1}{(x-${p})(x+${q})^{2}}$. Do not solve for the constants.`,
        choices: mc(`\\frac{A}{x-${p}}+\\frac{B}{x+${q}}+\\frac{C}{(x+${q})^{2}}`, [W(`\\frac{A}{x-${p}}+\\frac{B}{(x+${q})^{2}}`, 'A repeated factor needs one term for **each** power up to the multiplicity: both $(x+q)$ and $(x+q)^2$.', 'setup'), W(`\\frac{A}{x-${p}}+\\frac{Bx+C}{(x+${q})^{2}}`, 'Linear numerators are for irreducible quadratics, not repeated linear factors.', 'setup'), W(`\\frac{A}{x-${p}}+\\frac{B}{x+${q}}+\\frac{C}{(x+${q})^{2}}+\\frac{D}{(x+${q})^{3}}`, 'Multiplicity is 2, so stop at the second power; the number of unknowns equals the denominator degree (3).', 'setup'), W(`\\frac{A}{(x-${p})(x+${q})^{2}}`, 'That is the original shape; partial fractions splits it.', 'setup')]),
        steps: ['Linear factor $\\to\\frac{A}{x-p}$.', 'Repeated factor $(x+q)^2\\to\\frac{B}{x+q}+\\frac{C}{(x+q)^2}$.', 'Total unknowns $=$ degree of the denominator $=3$.'],
        recall: 'Repeated factor of multiplicity $m$: $m$ terms, one per power.' };
    }
    if (fam === 'quad') {
      return { fmt: 'mc', arch: 'pf-form', src: 'Lecture 09-03/09-08 partial fractions',
        prompt: `Write the form of the partial fraction decomposition of $\\dfrac{x+2}{x(x^{2}+${a * a})}$. Do not solve for the constants.`,
        choices: mc(`\\frac{A}{x}+\\frac{Bx+C}{x^{2}+${a * a}}`, [W(`\\frac{A}{x}+\\frac{B}{x^{2}+${a * a}}`, 'An irreducible quadratic needs a **linear** numerator $Bx+C$.', 'setup'), W(`\\frac{A}{x}+\\frac{B}{x+${a}}+\\frac{C}{x-${a}}`, `$x^2+${a * a}$ has no real roots; it does not factor over the reals.`, 'setup'), W(`\\frac{A}{x}+\\frac{Bx}{x^{2}+${a * a}}`, 'Missing the constant term $C$ in the numerator.', 'setup'), W(`\\frac{Ax+B}{x}+\\frac{C}{x^{2}+${a * a}}`, 'Linear numerators go over the quadratic; the linear factor $x$ gets a constant.', 'setup')]),
        steps: ['$x$ is linear: $\\frac{A}{x}$.', `$x^2+${a * a}$ is irreducible: $\\frac{Bx+C}{x^2+${a * a}}$.`],
        recall: 'Linear factor $\\to$ constant. Irreducible quadratic $\\to$ linear numerator.' };
    }
    const d = p - q;
    const key = `x+${d}+\\frac{A}{x-${p}}+\\frac{B}{x+${q}}`;
    return { fmt: 'mc', arch: 'pf-form', src: 'Exam 1 v1 Q3: long division first',
      prompt: `Write the form that results from long division and partial fractions of $\\dfrac{x^{3}+1}{(x-${p})(x+${q})}$. Do not solve for $A$, $B$.`,
      choices: mc(key, [W(`\\frac{A}{x-${p}}+\\frac{B}{x+${q}}`, 'Degree 3 over degree 2 is improper: divide first, then decompose the remainder.', 'setup'), W(`x-${d}+\\frac{A}{x-${p}}+\\frac{B}{x+${q}}`, `Sign slip in the quotient. $x^3\\div(x^2+${q - p}x${sg(-p * q)})$ gives $x${sg(-(q - p))}=x+${d}$ as the quotient's constant.`, 'sign'), W(`x+${d}+\\frac{Ax+B}{x-${p}}+\\frac{C}{x+${q}}`, 'After division the remainder has degree $<2$; each linear factor gets a constant.', 'setup'), W(`\\frac{Ax+B}{x-${p}}+\\frac{Cx+D}{x+${q}}`, 'Linear factors take constants, and the division is still missing.', 'setup')]),
      steps: [`$(x-${p})(x+${q})=x^2${sg(q - p)}x${sg(-p * q)}$.`, `$x^3+1=(x${sg(p - q)})\\cdot\\text{den}+\\text{(linear remainder)}$, so quotient $x${sg(p - q)}$.`, 'Decompose the proper remainder with constants over each linear factor.'],
      recall: 'Improper rational function: divide first, then decompose.' };
  },
});

// 12. partial fractions: integrate
G.push({
  id: 'g-xi-pf-int', topic: 'Partial Fractions', diff: 3,
  make(r) {
    const fam = r.pick(['proper', 'long', 'repeat']);
    if (fam === 'proper') {
      const p = r.int(1, 4), q = r.int(1, 4);
      const A = r.nz(-4, 4), B = r.nz(-4, 4);
      if (A + B === 0 || p === -q) return this.make(r);
      const c = A + B, d = A * q - B * p;
      const num = `${c === 1 ? '' : c === -1 ? '-' : c}x${d === 0 ? '' : sg(d)}`;
      const key = `${lnAbs(A, `x-${p}`)}${B < 0 ? '' : '+'}${lnAbs(B, `x+${q}`)}+C`;
      return { fmt: 'free', arch: 'pf-integrate', src: 'Lecture 09-03/09-08 partial fractions',
        prompt: `Compute $\\displaystyle\\int \\frac{${num}}{(x-${p})(x+${q})}\\,dx$.`,
        choices: mc(key, [W(`${lnAbs(B, `x-${p}`)}${A < 0 ? '' : '+'}${lnAbs(A, `x+${q}`)}+C`, 'The constants are attached to the wrong factors. Plug in $x=' + p + '$ (cover-up) to get the coefficient of $\\frac{1}{x-' + p + '}$.', 'setup'), W(`${lnAbs(-A, `x-${p}`)}${-B < 0 ? '' : '+'}${lnAbs(-B, `x+${q}`)}+C`, 'Overall sign error in both coefficients.', 'sign'), W(`-\\frac{${A}}{(x-${p})^{2}}-\\frac{${B}}{(x+${q})^{2}}+C`.replace('-\\frac{-', '\\frac{').replace('}-\\frac{-', '}+\\frac{'), 'Power rule used on $\\frac1{x-p}$. Its antiderivative is a log.', 'power-rule'), W(`\\ln|(x-${p})(x+${q})|+C`, 'The coefficients $A$, $B$ were not carried through.', 'dropped-factor')]),
        steps: [`$\\frac{${num}}{(x-${p})(x+${q})}=\\frac{A}{x-${p}}+\\frac{B}{x+${q}}$.`, `Cover-up: $A=${A}$ at $x=${p}$, $B=${B}$ at $x=-${q}$.`, `Integrate: ${key.replace(/^/, '$')}$.`],
        recall: 'Proper fraction with distinct linear factors: cover-up for each constant, integrate to logs.' };
    }
    if (fam === 'long') {
      const m = r.int(2, 4), k = r.int(1, 3), K2 = 2 * m * k;
      const key = `\\frac{x^{2}}{2}+${k === 1 ? '' : k}\\ln|x-${m}|-${k === 1 ? '' : k}\\ln|x+${m}|+C`;
      return { fmt: 'free', arch: 'pf-long-division', src: 'Exam 1 v1 Q3 archetype',
        prompt: `Compute $\\displaystyle\\int \\frac{x^{3}-${m * m}x+${K2}}{x^{2}-${m * m}}\\,dx$.`,
        choices: mc(key, [W(`${k === 1 ? '' : k}\\ln|x-${m}|-${k === 1 ? '' : k}\\ln|x+${m}|+C`, 'No long division: improper fraction, quotient $x$ contributes $\\frac{x^2}{2}$.', 'setup'), W(`\\frac{x^{2}}{2}+${k === 1 ? '' : k}\\ln|x-${m}|+${k === 1 ? '' : k}\\ln|x+${m}|+C`, `$\\frac{${K2}}{x^2-${m * m}}=\\frac{${k}}{x-${m}}-\\frac{${k}}{x+${m}}$: the second term is negative.`, 'sign'), W(`x^{2}+${k === 1 ? '' : k}\\ln|x-${m}|-${k === 1 ? '' : k}\\ln|x+${m}|+C`, '$\\int x\\,dx=\\frac{x^2}{2}$.', 'power-rule'), W(`\\frac{x^{2}}{2}+${2 * k}\\ln|x-${m}|-${2 * k}\\ln|x+${m}|+C`, 'Cover-up gives $A=\\frac{' + K2 + '}{' + 2 * m + '}=' + k + '$, not double.', 'dropped-factor')]),
        steps: [`$x^3-${m * m}x+${K2}=x(x^2-${m * m})+${K2}$, so the integrand is $x+\\frac{${K2}}{x^2-${m * m}}$.`, `$\\frac{${K2}}{(x-${m})(x+${m})}=\\frac{${k}}{x-${m}}-\\frac{${k}}{x+${m}}$.`],
        recall: 'Divide first when degree top $\\ge$ degree bottom.' };
    }
    const a = r.int(1, 3);
    const key = `\\frac{1}{${a * a}}\\ln|x|-\\frac{1}{${a * a}}\\ln|x+${a}|+\\frac{1}{${a}(x+${a})}+C`;
    return { fmt: 'free', arch: 'pf-repeated', src: 'Lecture 09-03/09-08 partial fractions',
      prompt: `Compute $\\displaystyle\\int \\frac{dx}{x(x+${a})^{2}}$.`,
      choices: mc(key, [W(`\\frac{1}{${a * a}}\\ln|x|-\\frac{1}{${a * a}}\\ln|x+${a}|-\\frac{1}{${a}(x+${a})}+C`, '$\\int\\frac{-1/a}{(x+a)^2}dx=+\\frac{1}{a(x+a)}$: two minus signs.', 'sign'), W(`\\frac{1}{${a * a}}\\ln|x|-\\frac{1}{${a * a}}\\ln|x+${a}|+C`, 'The repeated-factor term $\\frac{C}{(x+a)^2}$ was dropped.', 'setup'), W(`\\frac{1}{${a * a}}\\ln|x|+\\frac{1}{${a * a}}\\ln|x+${a}|+\\frac{1}{${a}(x+${a})}+C`, 'Sign of the $\\frac{B}{x+a}$ coefficient: $B=-\\frac{1}{a^2}$.', 'sign'), W(`\\ln|x|-\\ln|x+${a}|+\\frac{1}{x+${a}}+C`, 'The constants $\\frac1{a^2}$, $\\frac1a$ were not carried.', 'dropped-factor')]),
      steps: [`$\\frac1{x(x+${a})^2}=\\frac{A}{x}+\\frac{B}{x+${a}}+\\frac{C}{(x+${a})^2}$.`, `Cover-up: $A=\\frac1{${a * a}}$, $C=-\\frac1{${a}}$ (at $x=-${a}$); $A+B=0$ gives $B=-\\frac1{${a * a}}$.`],
      recall: 'Repeated factor: constants for each power; use cover-up for the highest power, then compare leading coefficients.' };
  },
});

// 13. cover-up
G.push({
  id: 'g-xi-pf-coeff', topic: 'Partial Fractions', diff: 1,
  make(r) {
    const p = r.int(1, 5), q = r.int(1, 5);
    let A = r.nz(-5, 5), B = r.nz(-5, 5);
    while (A + B === 0 || Math.abs(A) === Math.abs(B)) { A = r.nz(-5, 5); B = r.nz(-5, 5); }
    const c = A + B, d = A * q - B * p;
    const num = `${c === 1 ? '' : c === -1 ? '-' : c}x${d === 0 ? '' : sg(d)}`;
    const which = r.pick(['A', 'B']);
    const ans = which === 'A' ? A : B, oth = which === 'A' ? B : A;
    return { fmt: 'free', arch: 'pf-coverup', src: 'Lecture 09-03/09-08 partial fractions',
      prompt: `If $\\dfrac{${num}}{(x-${p})(x+${q})}=\\dfrac{A}{x-${p}}+\\dfrac{B}{x+${q}}$, find $${which}$.`,
      choices: mc(String(ans), [W(String(oth), `That is the other constant (${which === 'A' ? 'B' : 'A'}). Plug in $x=${which === 'A' ? p : -q}$ to isolate $${which}$.`, 'setup'), W(String(-ans), 'Sign slip when evaluating the numerator.', 'sign'), W(String(A + B), `$A+B$ is the coefficient of $x$ in the numerator, not $${which}$.`, 'setup'), W(String(d), 'That is the constant term of the numerator.', 'setup')]),
      steps: [`Multiply through: $${num}=A(x+${q})+B(x-${p})$.`, `Plug in $x=${which === 'A' ? p : -q}$ to kill the other term: $${which}=${ans}$.`],
      recall: 'Cover-up: set $x$ equal to the root of the factor you want, evaluate everything else.' };
  },
});

// 14. which technique first
const POOL_TECH = {
  usub: [x => `\\frac{x}{x^{2}+${x}}`, x => `x\\sqrt{x^{2}+${x}}`, x => `\\frac{\\ln x}{x}`, x => `e^{x}\\sqrt{1+e^{x}}`, x => `\\sin x\\cos^{${x}}x`],
  parts: [x => `x\\sin(${x}x)`, x => `x^{2}e^{${x}x}`, x => `\\arctan(${x}x)`, x => `x^{${x}}\\ln x`],
  trig: [x => `\\sqrt{${x * x}-x^{2}}`, x => `\\frac{1}{x^{2}\\sqrt{x^{2}+${x * x}}}`, x => `\\frac{x^{2}}{\\sqrt{${x * x}-x^{2}}}`],
  pf: [x => `\\frac{1}{x^{2}-${x * x}}`, x => `\\frac{x+1}{(x-${x})(x+${x + 1})}`, x => `\\frac{2x+1}{x(x+${x})^{2}}`],
};
const TECH = { usub: 'u-substitution', parts: 'integration by parts', trig: 'trigonometric substitution', pf: 'partial fractions' };
const WHYNOT = {
  usub: { parts: 'There is no product of unrelated types to trade; the inside function and its derivative are already present, so a substitution finishes the job.', trig: 'No radical of the form $a^2\\pm x^2$ that needs a trig identity; the derivative of the inside is already there.', pf: 'The denominator is not a product of different factors to split; a substitution collapses it.' },
  parts: { usub: 'Nothing is the derivative of an inside function: $\\frac{d}{dx}$ of the inside does not appear. Substitution leaves an $x$ behind.', trig: 'There is no $\\sqrt{a^2\\pm x^2}$; the integrand is a product of unlike functions (LIATE).', pf: 'It is not a rational function.' },
  trig: { usub: 'Try it: $u=$ the radicand leaves a stray $x$ (no $x\\,dx$ in the integrand).', parts: 'There is no pair of unlike factors; the obstacle is the radical $\\sqrt{a^2\\pm x^2}$ or $\\sqrt{x^2-a^2}$.', pf: 'A radical is not a rational function.' },
  pf: { usub: 'The numerator is not (a multiple of) the derivative of the denominator, so $u$ does not clear it.', parts: 'It is a rational function, not a product of unlike types. Split it.', trig: 'There is no radical. The quadratic denominator factors, so use partial fractions.' },
};
G.push({
  id: 'g-xi-which', topic: 'Strategy for Integration', diff: 2,
  make(r) {
    const k = r.pick(Object.keys(POOL_TECH));
    const x = k === 'trig' ? r.int(2, 5) : r.int(2, 4);
    const f = r.pick(POOL_TECH[k])(x);
    const others = Object.keys(TECH).filter(t => t !== k);
    return { fmt: 'mc', arch: 'which-technique', src: 'Strategy for integration (Exam 1 mixed)',
      prompt: `Which technique should you try **first** on $\\displaystyle\\int ${f}\\,dx$? (Do not compute.)`,
      choices: [{ t: TECH[k], ok: true }, ...others.map(o => ({ t: TECH[o], why: WHYNOT[k][o] }))],
      keyWhy: `This integrand is the textbook case for ${TECH[k]}.`,
      steps: [`Read the integrand's shape: ${k === 'usub' ? 'an inside function whose derivative (up to a constant) is also present' : k === 'parts' ? 'a product of unlike types (LIATE)' : k === 'trig' ? 'a radical of the form $\\sqrt{a^2\\pm x^2}$ or $\\sqrt{x^2-a^2}$' : 'a rational function with a factorable denominator'}.`, `So try ${TECH[k]} first.`],
      recall: 'Look for: inside/derivative pair $\\to u$; unlike product $\\to$ parts; $\\sqrt{a^2\\pm x^2}\\to$ trig sub; rational $\\to$ partial fractions.' };
  },
});

// 15. multi: select all
G.push({
  id: 'g-xi-which-multi', topic: 'Strategy for Integration', diff: 3,
  make(r) {
    const mode = r.pick(['parts', 'usub']);
    const a = r.int(2, 4);
    const yes = { parts: [[`x\\,e^{${a}x}`, 'a polynomial times an exponential'], [`x\\sin(${a}x)`, 'a polynomial times a trig function'], [`\\ln x`, 'a lone logarithm ($u=\\ln x$, $dv=dx$)'], [`\\arctan x`, 'a lone inverse trig function'], [`x^{2}\\cos x`, 'a polynomial times a trig function']],
      usub: [[`x\\,e^{${a}x^{2}}`, `$u=${a}x^2$ and $x\\,dx\\propto du$`], [`\\frac{x}{x^{2}+${a}}`, `$u=x^2+${a}$`], [`\\frac{\\ln x}{x}`, '$u=\\ln x$'], [`\\sin x\\cos^{${a}}x`, '$u=\\cos x$'], [`\\frac{e^{x}}{1+e^{x}}`, '$u=1+e^x$']] }[mode];
    const no = { parts: [[`x\\,e^{${a}x^{2}}`, `$u=${a}x^2$ works directly`], [`\\frac{x}{x^{2}+${a}}`, '$u=x^2+a$ works directly'], [`\\frac{\\ln x}{x}`, '$u=\\ln x$ works directly'], [`\\sin x\\cos^{${a}}x`, '$u=\\cos x$ works directly']],
      usub: [[`x\\,e^{${a}x}`, 'no inside whose derivative appears; this is a polynomial times an exponential (parts)'], [`\\ln x`, 'a lone logarithm needs parts'], [`x\\sin(${a}x)`, 'a polynomial times a trig function needs parts'], [`\\arctan x`, 'a lone inverse trig needs parts']] }[mode];
    const ny = r.int(2, 3);
    const Y = r.some(yes, ny), N = r.some(no, 5 - ny);
    const lab = mode === 'parts' ? 'integration by parts' : 'u-substitution alone';
    const choices = r.shuffle([...Y.map(([f, w]) => ({ t: `$\\displaystyle\\int ${f}\\,dx$`, ok: true, why: mode === 'parts' ? `Yes: ${w}.` : `Yes: ${w}.` })), ...N.map(([f, w]) => ({ t: `$\\displaystyle\\int ${f}\\,dx$`, why: mode === 'parts' ? `No: ${w}.` : `No: ${w}.` }))]);
    return { fmt: 'multi', arch: 'select-technique', src: 'Strategy for integration',
      prompt: `Select **all** integrals that are evaluated using ${lab} as the main technique.`,
      choices, keyWhy: `Correct set: ${Y.map(([, w]) => w.replace(/\$/g, '')).length} integrals.`,
      steps: mode === 'parts' ? ['Parts targets unlike products and lone log / inverse-trig functions.', 'If the derivative of an inside function is present, u-sub is enough.'] : ['u-sub needs the derivative of an inside function present.', 'Otherwise the integrand is a product of unlike types (parts).'],
      recall: 'Ask: is the derivative of an inside function sitting outside? Yes $\\to u$-sub. No, and it is an unlike product $\\to$ parts.' };
  },
});

// 16. improper integrals with value
G.push({
  id: 'g-xi-improper', topic: 'Improper Integrals', diff: 3,
  make(r) {
    const fam = r.pick(['p1', 'exp', 'atan']);
    const acc = ['diverges', 'diverges to infinity', 'does not converge', 'divergent'];
    const DV = { t: 'Diverges', why: '' };
    if (fam === 'p1') {
      const [d, val] = r.pick([['x^{2}', [1, 1]], ['x^{3}', [1, 2]], ['x^{4}', [1, 3]], ['x^{3/2}', [2, 1]], ['x', null], ['\\sqrt{x}', null], ['x^{1/3}', null]]);
      const key = val ? frac(val[0], val[1]) : 'Diverges';
      const pool = val ? [{ t: 'Diverges', why: 'The tail $\\int_1^\\infty x^{-p}$ converges exactly when $p>1$; here $p>1$ and the integrand shrinks fast enough.' }, { t: '0', why: 'The integrand tends to $0$, but the **integral** is the area, which is positive.' }, W(frac(val[0] + val[1], val[1]), 'Check your antiderivative at $x=1$: $\\frac{x^{1-p}}{1-p}\\Big|_1^\\infty$ gives $\\frac{1}{p-1}$.', 'algebra-slip'), W(frac(val[1], val[0]), 'Reciprocal of $\\frac{1}{p-1}$.', 'inverted')]
        : [W('0', 'The integrand tends to $0$, but that does not make the area $0$.', 'test-logic'), W('1', 'The formula $\\frac{1}{p-1}$ requires $p>1$; it does not apply here.', 'test-logic'), W('\\frac{1}{p-1}', 'For $p\\le1$ the antiderivative grows without bound; no finite value.', 'test-logic'), W('2', 'No finite value exists: the limit of the antiderivative is $\\infty$.', 'test-logic')];
      return { fmt: 'free', arch: 'improper-p', src: 'Lecture 09-10 improper integrals',
        prompt: `Determine whether $\\displaystyle\\int_{1}^{\\infty}\\frac{dx}{${d}}$ converges. If it converges, find its value.`,
        accept: val ? undefined : acc,
        choices: [val ? K(key) : { t: 'Diverges', ok: true }, ...choose(val ? `$${key}$` : 'Diverges', val ? pool.map(c => (c.t.startsWith('$') ? c : c)) : pool.map(c => (c.t === 'Diverges' ? c : c)))].map(c => (c.t === 'Diverges' || c.t.startsWith('$') ? c : { ...c, t: `$${c.t}$` })),
        steps: ['Write $\\lim_{t\\to\\infty}\\int_1^t x^{-p}dx$.', val ? `For $p>1$: $\\frac{1}{p-1}=${key}$.` : 'For $p\\le1$ the limit is $\\infty$.'],
        recall: '$\\int_1^\\infty x^{-p}dx$ converges iff $p>1$, with value $\\frac{1}{p-1}$.' };
    }
    if (fam === 'exp') {
      const a = r.int(2, 5);
      const key = `\\frac{1}{${a}}`;
      return { fmt: 'free', arch: 'improper-exp', src: 'Lecture 09-10 improper integrals',
        prompt: `Determine whether $\\displaystyle\\int_{0}^{\\infty}e^{-${a}x}\\,dx$ converges. If it converges, find its value.`,
        choices: mc(key, [{ t: 'Diverges', why: 'The integrand $\\to0$ exponentially fast; the area is finite.' }, W(`${a}`, 'Reciprocal: $\\int e^{-ax}dx=-\\frac1ae^{-ax}$.', 'inverted'), W(`-\\frac{1}{${a}}`, 'Sign: $\\left[-\\frac1ae^{-ax}\\right]_0^\\infty=0-(-\\frac1a)$.', 'sign'), W('0', 'The limit of the antiderivative at $\\infty$ is $0$, but you must subtract the value at $0$.', 'limits')]),
        steps: [`$\\lim_{t\\to\\infty}\\left[-\\frac1{${a}}e^{-${a}x}\\right]_0^t=0+\\frac1{${a}}$.`],
        recall: 'Exponential decay integrates to a finite value: evaluate the limit at $\\infty$, subtract the value at $0$.' };
    }
    if (fam === 'p0') {
      const hi = 1;
      const [d, val] = r.pick([['\\sqrt{x}', [2, 1]], ['x', null]]);
      const key = val ? frac(val[0], val[1]) : 'Diverges';
      const pool = val ? [{ t: 'Diverges', why: 'The singularity at $0$ is mild ($p=\\frac12<1$), so the area is finite.' }, W('0', 'Not zero: the integrand is positive.', 'conceptual'), W(frac(val[0], 2), 'Antiderivative of $x^{-1/2}$ is $2x^{1/2}$: the factor is $2$, not $\\frac12$, and the lower value is $0$.', 'power-rule'), W(frac(val[0] + 1, 1), 'Evaluate $2\\sqrt{x}$ at the upper limit and subtract its value $0$ at $0$.', 'algebra-slip')]
        : [W('0', 'Not zero: the integrand is positive and unbounded.', 'conceptual'), W('1', 'The formula $\\frac{1}{1-p}$ needs $p<1$.', 'test-logic'), W('\\frac{1}{p-1}', 'The antiderivative blows up at $0$ for $p\\ge1$.', 'test-logic'), W('2', 'Not finite.', 'test-logic')];
      return { fmt: 'free', arch: 'improper-p', src: 'Lecture 09-10 improper integrals',
        prompt: `Determine whether $\\displaystyle\\int_{0}^{${hi}}\\frac{dx}{${d}}$ converges. If it converges, find its value.`,
        accept: val ? undefined : acc,
        choices: [val ? K(key) : { t: 'Diverges', ok: true }, ...choose(val ? `$${key}$` : 'Diverges', pool)].map(c => (c.t === 'Diverges' || c.t.startsWith('$') ? c : { ...c, t: `$${c.t}$` })),
        steps: ['The integrand blows up at an endpoint ($x=0$ or $x=1$): replace it by a one-sided limit of finite bounds.', val ? '$\\int x^{-1/2}dx=2\\sqrt{x}$ (or $-2\\sqrt{1-x}$), so the area is $2$.' : 'For $p\\ge1$ the limit is $\\infty$.'],
        recall: '$\\int_0^1x^{-p}dx$ converges iff $p<1$ (the opposite of the $[1,\\infty)$ rule).' };
    }
    const a = r.int(2, 4);
    const key = `\\frac{\\pi}{${2 * a}}`;
    return { fmt: 'free', arch: 'improper-atan', src: 'Lecture 09-10 improper integrals',
      prompt: `Determine whether $\\displaystyle\\int_{0}^{\\infty}\\frac{dx}{x^{2}+${a * a}}$ converges. If it converges, find its value.`,
      choices: mc(key, [{ t: 'Diverges', why: 'The integrand is comparable to $\\frac1{x^2}$ at infinity, which converges.' }, W(`\\frac{\\pi}{${a}}`, `$\\int\\frac{dx}{x^2+a^2}=\\frac1a\\arctan\\frac xa$; $\\arctan\\to\\frac\\pi2$, so $\\frac{\\pi}{2a}$.`, 'dropped-factor'), W(`\\frac{\\pi}{2}`, 'The factor $\\frac1a$ in front of $\\arctan\\frac xa$ was dropped.', 'dropped-factor'), W('0', 'The antiderivative at $0$ is $0$ but at $\\infty$ it is positive.', 'limits')]),
      steps: [`$\\lim_{t\\to\\infty}\\frac1{${a}}\\arctan\\frac{t}{${a}}=\\frac{1}{${a}}\\cdot\\frac\\pi2$.`],
      recall: '$\\int\\frac{dx}{x^2+a^2}=\\frac1a\\arctan\\frac xa$, and $\\arctan\\to\\frac\\pi2$ as $x\\to\\infty$.' };
  },
});

// 17. improper: direct comparison verdict
G.push({
  id: 'g-xi-improper-cmp', topic: 'Improper Integrals', diff: 3,
  make(r) {
    const POOL = [
      { f: R`\frac{1}{x^{2}+1}`, g: R`\frac{1}{x^{2}}`, up: true, ineq: '<' },
      { f: R`\frac{\sin^{2}x}{x^{2}}`, g: R`\frac{1}{x^{2}}`, up: true, ineq: '\\le' },
      { f: R`e^{-x^{2}}`, g: R`e^{-x}`, up: true, ineq: '\\le' },
      { f: R`\frac{2+\cos x}{x}`, g: R`\frac{1}{x}`, up: false, ineq: '\\ge' },
      { f: R`\frac{1}{\sqrt{x}+1}`, g: R`\frac{1}{2\sqrt{x}}`, up: false, ineq: '\\ge' },
      { f: R`\frac{x}{x^{2}+x+1}`, g: R`\frac{1}{3x}`, up: false, ineq: '\\ge' },
    ];
    const it = r.pick(POOL);
    const v = it.up ? 'Converges' : 'Diverges', ov = it.up ? 'Diverges' : 'Converges';
    const gC = it.up ? 'converges' : 'diverges';
    const key = `${v}: $f(x)${it.ineq}g(x)=${it.g}$ on $[1,\\infty)$ and $\\int_1^\\infty g$ ${gC}`;
    return { fmt: 'mc', arch: 'improper-compare', src: 'Direct Comparison for improper integrals',
      prompt: `Use the Comparison Theorem on $\\displaystyle\\int_{1}^{\\infty}${it.f}\\,dx$ (take $f(x)$ to be the integrand). Which conclusion is justified?`,
      choices: [{ t: key, ok: true }, { t: `${ov}: $f(x)${it.ineq}g(x)=${it.g}$ and $\\int_1^\\infty g$ ${gC}`, why: `The theorem transfers the behaviour of $g$ in one direction only: ${it.up ? 'small $f\\le g$ converging gives convergence' : 'large $f\\ge g$ diverging gives divergence'}.` }, { t: `Inconclusive: the inequality with $g=${it.g}$ goes the wrong way`, why: 'The inequality does go the right way here (checks on $[1,\\infty)$).' }, { t: `${v}: $f(x)\\to0$ as $x\\to\\infty$`, why: 'Tending to $0$ is not a test: $\\int_1^\\infty\\frac1x$ diverges while $\\frac1x\\to0$.' }],
      steps: ['Pick $g$ with a known verdict (a $p$-integral).', 'Check the inequality direction against the verdict needed.', `$g=${it.g}$: $\\int_1^\\infty g$ ${gC}.`],
      recall: 'Comparison: small and converges $\\Rightarrow$ converges; big and diverges $\\Rightarrow$ diverges.' };
  },
});

// 18. numerical integration
G.push({
  id: 'g-xi-numint', topic: 'Numerical Integration', diff: 2,
  make(r) {
    const fn = r.pick([['x^{2}', x => x * x], ['x^{3}', x => x ** 3], ['x^{2}+x', x => x * x + x]]);
    const f = fn[1];
    const b = 8, n = 4, h = 2;
    const xs = [0, 2, 4, 6, 8];
    const T = h / 2 * (f(0) + 2 * (f(2) + f(4) + f(6)) + f(8));
    const M = h * (f(1) + f(3) + f(5) + f(7));
    const S = h / 3 * (f(0) + 4 * f(2) + 2 * f(4) + 4 * f(6) + f(8));
    const rule = r.pick(['Trapezoid', 'Midpoint', 'Simpson']);
    const val = { Trapezoid: T, Midpoint: M, Simpson: S }[rule];
    const fr = v => { const d = 3; return frac(Math.round(v * d), d); };
    const wrongW = h / 3 * (f(0) + 2 * f(2) + 4 * f(4) + 2 * f(6) + f(8));
    const pool = [];
    for (const [nm, v] of [['Trapezoid', T], ['Midpoint', M], ['Simpson', S]]) if (nm !== rule) pool.push(W(fr(v), `That is the ${nm} approximation, not the ${rule} rule.`, 'formula-confusion'));
    pool.push(W(fr(wrongW), 'Simpson weights are $1,4,2,4,1$: odd-indexed nodes get $4$.', 'setup'), W(fr(h * (f(0) + f(2) + f(4) + f(6) + f(8))), 'Plain sum $\\times h$ is a Riemann sum, not this rule.', 'formula-confusion'));
    return { fmt: 'mc', arch: 'numint-compute', src: 'Numerical integration',
      prompt: `Use the ${rule} Rule with $n=4$ subintervals to approximate $\\displaystyle\\int_{0}^{8}${fn[0]}\\,dx$.`,
      choices: mc(fr(val), pool),
      steps: ['$\\Delta x=\\frac{8-0}{4}=2$; nodes $0,2,4,6,8$' + (rule === 'Midpoint' ? ' and midpoints $1,3,5,7$.' : '.'), { Trapezoid: '$T_4=\\frac{\\Delta x}{2}[f_0+2f_1+2f_2+2f_3+f_4]$.', Midpoint: '$M_4=\\Delta x\\,[f(1)+f(3)+f(5)+f(7)]$.', Simpson: '$S_4=\\frac{\\Delta x}{3}[f_0+4f_1+2f_2+4f_3+f_4]$.' }[rule]],
      recall: 'Trapezoid weights $1,2,2,2,1$; Simpson $1,4,2,4,1$ (with $\\Delta x/3$); midpoint uses midpoints.' };
  },
});

// 19. arc length setup
const CURVES = [
  { f: '\\sin x', d: '\\cos x', lo: '0', hi: '\\pi', v: 'x', desc: '$y=\\sin x$, $0\\le x\\le\\pi$' },
  { f: 'e^{2x}', d: '2e^{2x}', lo: '0', hi: '1', v: 'x', desc: '$y=e^{2x}$, $0\\le x\\le1$' },
  { f: '\\ln x', d: '\\frac{1}{x}', lo: '1', hi: 'e', v: 'x', desc: '$y=\\ln x$, $1\\le x\\le e$' },
  { f: 'x^{3}', d: '3x^{2}', lo: '0', hi: '2', v: 'x', desc: '$y=x^3$, $0\\le x\\le2$' },
  { f: '\\tan x', d: '\\sec^{2}x', lo: '0', hi: '\\frac{\\pi}{4}', v: 'x', desc: '$y=\\tan x$, $0\\le x\\le\\frac\\pi4$' },
];
G.push({
  id: 'g-xi-arclen-setup', topic: 'Arc Length', unit: 'applications', diff: 2,
  make(r) {
    const c = r.pick(CURVES);
    const mode = r.pick(['x', 'x', 'y']);
    if (mode === 'y') {
      const n = r.int(2, 3), hi = r.int(1, 3);
      const d = `${n}y^{${n - 1}}`;
      return { fmt: 'mc', arch: 'arclen-setup', src: 'Exam 1 v1 Q2 archetype (set up only)',
        prompt: `Which integral gives the length of the curve $x=y^{${n}}$ for $0\\le y\\le${hi}$?`,
        choices: mc(`\\int_{0}^{${hi}}\\sqrt{1+(${d})^{2}}\\,dy`, [W(`\\int_{0}^{${hi}}\\sqrt{1+y^{${n}}}\\,dy`, 'The derivative must appear inside: $(x\')^2=(' + d + ')^2$.', 'chain-rule'), W(`\\int_{0}^{${hi}}\\sqrt{1+${d}}\\,dy`, 'Forgot to **square** the derivative.', 'formula-confusion'), W(`\\int_{0}^{${hi}}\\left(1+(${d})^{2}\\right)dy`, 'The square root is missing.', 'formula-confusion'), W(`\\int_{0}^{${hi}}\\sqrt{1+(${d})^{2}}\\,dx`, 'The curve is $x=g(y)$, so integrate with respect to $y$ (limits are $y$-values).', 'setup')]),
        steps: [`$x=y^{${n}}$, $\\frac{dx}{dy}=${d}$.`, '$L=\\int_c^d\\sqrt{1+(dx/dy)^2}\\,dy$.'],
        recall: 'Arc length: $\\int\\sqrt{1+(\\text{derivative})^2}$ in the variable the curve is a function of.' };
    }
    return { fmt: 'mc', arch: 'arclen-setup', src: 'Exam 1 v1 Q2 archetype (set up only)',
      prompt: `Which integral gives the length of the curve ${c.desc}?`,
      choices: mc(`\\int_{${c.lo}}^{${c.hi}}\\sqrt{1+(${c.d})^{2}}\\,dx`, [W(`\\int_{${c.lo}}^{${c.hi}}\\sqrt{1+${c.f}}\\,dx`, 'You used $f$ instead of $f\'$ inside the root.', 'chain-rule'), W(`\\int_{${c.lo}}^{${c.hi}}\\sqrt{1+${c.d}}\\,dx`, 'Forgot to square the derivative.', 'formula-confusion'), W(`2\\pi\\int_{${c.lo}}^{${c.hi}}${c.f}\\sqrt{1+(${c.d})^{2}}\\,dx`, 'That is surface area about the $x$-axis.', 'formula-confusion'), W(`\\int_{${c.lo}}^{${c.hi}}\\left(1+(${c.d})^{2}\\right)dx`, 'The square root is missing.', 'formula-confusion')]),
      steps: [`$f(x)=${c.f}$, $f'(x)=${c.d}$.`, '$L=\\int_a^b\\sqrt{1+(f\')^2}\\,dx$.'],
      recall: 'Arc length: $\\int_a^b\\sqrt{1+(f\')^2}\\,dx$. Derivative **squared**, inside the root.' };
  },
});

// 20. arc length evaluate
G.push({
  id: 'g-xi-arclen-eval', topic: 'Arc Length', unit: 'applications', diff: 4,
  make(r) {
    const fam = r.pick(['pow', 'lnq', 'cosh']);
    if (fam === 'pow') {
      const b = r.pick([3, 8, 15, 24]);
      const m = Math.round(Math.sqrt(b + 1) ** 3);
      const key = frac(2 * (m - 1), 3);
      return { fmt: 'free', arch: 'arclen-eval', src: 'Arc length with perfect-square integrand',
        prompt: `Find the exact length of the curve $y=\\frac23x^{3/2}$ for $0\\le x\\le${b}$.`,
        choices: mc(key, [W(frac(2 * m, 3), 'The lower limit contributes $-\\frac23(1)^{3/2}$.', 'limits'), W(frac(m - 1, 3), 'The factor from $\\int\\sqrt{u}\\,du=\\frac23u^{3/2}$ was dropped.', 'dropped-factor'), W(String(b), 'Not the length: you integrated $1$ (the horizontal width).', 'conceptual'), W(frac(2 * (Math.round((b ** 1.5)) - 0), 3), 'You used $x$ instead of $1+x$ under the root.', 'setup')]),
        steps: ["$y'=x^{1/2}$, so $1+(y')^2=1+x$.", `$L=\\int_0^{${b}}\\sqrt{1+x}\\,dx=\\frac23(1+x)^{3/2}\\Big|_0^{${b}}=${key}$.`],
        recall: 'Pick curves so that $1+(f\')^2$ is a perfect square or a linear function; then it is an easy $u$-sub.' };
    }
    if (fam === 'lnq') {
      const b = r.int(2, 4);
      const key = `${frac(b * b - 1, 4)}+\\frac{\\ln ${b}}{2}`;
      return { fmt: 'free', arch: 'arclen-eval', src: 'Arc length with perfect-square integrand',
        prompt: `Find the exact length of the curve $y=\\frac{x^{2}}{4}-\\frac{\\ln x}{2}$ for $1\\le x\\le${b}$.`,
        choices: mc(key, [W(`${frac(b * b - 1, 4)}-\\frac{\\ln ${b}}{2}`, 'Sign: $1+(y\')^2=\\left(\\frac x2+\\frac1{2x}\\right)^2$ (plus), so $L=\\int\\left(\\frac x2+\\frac1{2x}\\right)dx$.', 'sign'), W(`${frac(b * b - 1, 2)}+\\ln ${b}`, 'Factor of $\\frac12$ lost in both terms.', 'dropped-factor'), W(`${frac(b * b, 4)}+\\frac{\\ln ${b}}{2}`, 'The lower limit $x=1$ contributes $\\frac14$.', 'limits'), W(`\\frac{${b * b - 1}}{4}`, 'The logarithm term was dropped.', 'dropped-factor')]),
        steps: ["$y'=\\frac x2-\\frac1{2x}$, so $1+(y')^2=\\left(\\frac x2+\\frac1{2x}\\right)^2$.", `$L=\\int_1^{${b}}\\left(\\frac x2+\\frac1{2x}\\right)dx=\\frac{x^2}{4}+\\frac{\\ln x}{2}\\Big|_1^{${b}}$.`],
        recall: '$1+(f\')^2$ often is a perfect square: expand, then take the root.' };
    }
    const b = r.pick([2, 3, 4]);
    const key = frac(b * b - 1, 2 * b);
    return { fmt: 'free', arch: 'arclen-eval', src: 'Arc length with perfect-square integrand',
      prompt: `Find the exact length of the curve $y=\\frac{e^{x}+e^{-x}}{2}$ for $0\\le x\\le\\ln ${b}$.`,
      choices: mc(key, [W(frac(b * b + 1, 2 * b), 'The length is $\\sinh(\\ln b)=\\frac{b-1/b}{2}$, not $\\cosh$.', 'sign'), W(frac(b - 1, 2), 'You evaluated $\\frac{e^x-e^{-x}}{2}$ with $e^{-x}\\to1$ at the upper limit.', 'algebra-slip'), W(`\\ln ${b}`, 'That is the horizontal width, not the length.', 'conceptual'), W(frac(b * b - 1, b), 'Missing the $\\frac12$ in $\\sinh$.', 'dropped-factor')]),
      steps: ["$y'=\\frac{e^x-e^{-x}}{2}$, $1+(y')^2=\\left(\\frac{e^x+e^{-x}}{2}\\right)^2$.", `$L=\\int_0^{\\ln ${b}}\\frac{e^x+e^{-x}}{2}dx=\\frac{e^x-e^{-x}}{2}\\Big|_0^{\\ln ${b}}=\\frac{${b}-1/${b}}{2}=${key}$.`],
      recall: 'Hyperbolic identity: $1+\\sinh^2=\\cosh^2$.' };
  },
});

// 21. surface area setup
G.push({
  id: 'g-xi-sa-setup', topic: 'Surface Area', unit: 'applications', diff: 3,
  make(r) {
    const c = r.pick(CURVES.slice(0, 4));
    const axis = r.pick(['x', 'y']);
    const rad = axis === 'x' ? c.f : 'x';
    const rad2 = axis === 'x' ? 'x' : c.f;
    const rt = `\\sqrt{1+(${c.d})^{2}}`;
    const key = `2\\pi\\int_{${c.lo}}^{${c.hi}}${rad}${rt}\\,dx`;
    return { fmt: 'mc', arch: 'sa-setup', src: 'Exam 1 v1 Q2 archetype (set up only)',
      prompt: `Which integral gives the area of the surface obtained by rotating ${c.desc} about the $${axis}$-axis?`,
      choices: mc(key, [W(`2\\pi\\int_{${c.lo}}^{${c.hi}}${rad2}${rt}\\,dx`, `The radius is the distance to the $${axis}$-axis: ${axis === 'x' ? '$y=f(x)$' : '$x$'}, not ${axis === 'x' ? '$x$' : '$f(x)$'}.`, 'inverted'), W(`2\\pi\\int_{${c.lo}}^{${c.hi}}${rad}\\sqrt{1+${c.d}}\\,dx`, 'Derivative not squared.', 'formula-confusion'), W(`\\int_{${c.lo}}^{${c.hi}}${rad}${rt}\\,dx`, 'Missing $2\\pi$ (circumference of the swept circle).', 'dropped-factor'), W(`2\\pi\\int_{${c.lo}}^{${c.hi}}${rad}\\sqrt{1+${c.f}}\\,dx`, 'Used $f$ instead of $f\'$ under the root.', 'chain-rule')]),
      steps: ['$S=2\\pi\\int(\\text{radius})\\,ds$ with $ds=\\sqrt{1+(f\')^2}\\,dx$.', axis === 'x' ? 'Rotating about the $x$-axis: radius $=y=f(x)$.' : 'Rotating about the $y$-axis: radius $=x$.'],
      recall: 'Surface area: $2\\pi\\cdot r\\cdot ds$; $r$ is the distance from the curve to the axis.' };
  },
});

// 22. surface area evaluate
G.push({
  id: 'g-xi-sa-eval', topic: 'Surface Area', unit: 'applications', diff: 4,
  make(r) {
    const fam = r.pick(['cone', 'sphere', 'sqrt']);
    if (fam === 'cone') {
      const k = r.int(1, 3), b = r.int(2, 4);
      const root = k === 1 ? '\\sqrt{2}' : `\\sqrt{${1 + k * k}}`;
      const key = `${k * b * b === 1 ? '' : k * b * b}\\pi${root}`;
      return { fmt: 'free', arch: 'sa-eval', src: 'Surface area of a cone',
        prompt: `Find the area of the surface obtained by rotating $y=${k === 1 ? '' : k}x$, $0\\le x\\le${b}$, about the $x$-axis.`,
        choices: mc(key, [W(`${2 * k * b * b}\\pi${root}`, '$\\int_0^b x\\,dx=\\frac{b^2}{2}$; the $\\frac12$ cancels one of the $2$s in $2\\pi$.', 'dropped-factor'), W(`${k * b * b}\\pi`, `The slant factor $\\sqrt{1+k^2}$ was dropped.`, 'dropped-factor'), W(`${k * k * b * b}\\pi${root}`, 'Radius is $y=kx$ (one factor of $k$); the second $k$ is inside the root.', 'algebra-slip'), W(`${k * b}\\pi${root}`, '$\\int_0^bx\\,dx=\\frac{b^2}{2}$, not $b$.', 'power-rule')]),
        steps: [`$y'=${k}$, $ds=${root}\\,dx$.`, `$S=2\\pi\\int_0^{${b}}${k === 1 ? '' : k}x\\cdot${root}\\,dx=2\\pi${k === 1 ? '' : k}${root}\\cdot\\frac{${b * b}}{2}$.`],
        recall: 'Constant slope: $ds$ is a constant multiple of $dx$, so the integral is just $\\int x\\,dx$.' };
    }
    if (fam === 'sphere') {
      const rr = r.int(2, 5), h = r.int(1, rr - 1);
      const key = `${4 * rr * h}\\pi`.replace(/^1/, '1');
      const pair = r.pick([[rr, h]]);
      return { fmt: 'free', arch: 'sa-eval', src: 'Surface area of a spherical zone',
        prompt: `Find the area of the surface obtained by rotating $y=\\sqrt{${rr * rr}-x^{2}}$, $-${h}\\le x\\le${h}$, about the $x$-axis.`,
        choices: mc(key, [W(`${2 * rr * h}\\pi`, 'The interval has length $2h$: $\\int_{-h}^{h}1\\,dx=2h$.', 'limits'), W(`${rr * rr * h}\\pi`, 'Under the root, $y\\sqrt{1+y\'^2}=r$ exactly, so the integrand is the constant $r$.', 'algebra-slip'), W(`${8 * rr * h}\\pi`, 'Extra factor of $2$.', 'dropped-factor'), W(`${4 * rr * h * rr}\\pi`, 'Only one factor of $r$ remains after $y\\sqrt{1+y\'^2}=r$.', 'algebra-slip'), W(`${rr * h}\\pi`, 'You dropped the $2\\pi$ and the interval length $2h$ (only $r\\cdot h$ remains).', 'dropped-factor')]),
        steps: [`$y'=\\frac{-x}{y}$, $y\\sqrt{1+y'^2}=\\sqrt{y^2+x^2}=${rr}$.`, `$S=2\\pi\\int_{-${h}}^{${h}}${rr}\\,dx=2\\pi\\cdot${rr}\\cdot${2 * h}=${key}$.`],
        recall: 'For a sphere, $y\\sqrt{1+y\'^2}=r$: zone area $=2\\pi rh_{\\text{total}}$.' };
    }
    const bb = r.pick([[2, 3, '13\\pi'], [6, 3, '62\\pi']]);
    const b = bb[0];
    const num = b === 2 ? 13 : 62;
    const key = `\\frac{${num}\\pi}{3}`;
    return { fmt: 'free', arch: 'sa-eval', src: 'Surface area, root integrand',
      prompt: `Find the area of the surface obtained by rotating $y=\\sqrt{x}$, $0\\le x\\le${b}$, about the $x$-axis.`,
      choices: mc(key, [W(`\\frac{${2 * num}\\pi}{3}`, 'A factor of $2$ too many.', 'dropped-factor'), W(`\\frac{${num}\\pi}{6}`, 'Missing the $2\\pi\\cdot\\frac23$ combination: it is $\\frac{4\\pi}{3}(\\ldots)$.', 'dropped-factor'), W(`\\frac{${num + 1}\\pi}{3}`, 'The lower-limit value $\\frac18$ was handled incorrectly.', 'limits'), W(`${num}\\pi`, 'The $\\frac13$ from $\\int\\sqrt u\\,du=\\frac23u^{3/2}$ is missing.', 'dropped-factor')]),
      steps: ["$y'=\\frac1{2\\sqrt x}$; $y\\sqrt{1+y'^2}=\\sqrt{x}\\sqrt{1+\\frac{1}{4x}}=\\sqrt{x+\\frac14}$.", `$S=2\\pi\\int_0^{${b}}\\sqrt{x+\\tfrac14}\\,dx=\\frac{4\\pi}{3}\\left[(${b}+\\tfrac14)^{3/2}-\\tfrac18\\right]=${key}$.`],
      recall: 'Put $y\\sqrt{1+y\'^2}$ under one root; the integrand often collapses to $\\sqrt{\\text{linear}}$.' };
  },
});

// 23. Method Judgment: generated true/false
G.push({
  id: 'g-xi-judge', topic: 'Method Judgment', unit: 'checkins', diff: 3,
  make(r) {
    const fam = r.pick(['bounds', 'p', 'trap', 'pf']);
    let q, v, why;
    if (fam === 'bounds') {
      const b = r.int(2, 4), c = r.int(1, 3);
      const keep = r.pick([true, false]);
      q = `For $\\int_0^{${b}}x\\sqrt{x^2+${c}}\\,dx$ with $u=x^2+${c}$, the integral becomes $\\frac12\\int_{${keep ? 0 : c}}^{${keep ? b : b * b + c}}\\sqrt u\\,du$.`;
      v = !keep;
      why = v ? `Correct: $x=0\\mapsto u=${c}$ and $x=${b}\\mapsto u=${b * b + c}$.` : `The limits were left as $x$-values. They become $u=${c}$ and $u=${b * b + c}$.`;
    } else if (fam === 'p') {
      const [p, pt] = r.pick([[0.5, '\\frac12'], [1, '1'], [1.5, '\\frac32'], [2, '2'], [3, '3']]);
      const side = r.pick(['conv', 'div']);
      q = `The improper integral $\\int_1^\\infty\\frac{dx}{x^{${pt}}}$ ${side === 'conv' ? 'converges' : 'diverges'}.`;
      v = (p > 1) === (side === 'conv');
      why = `$\\int_1^\\infty x^{-p}dx$ converges iff $p>1$. Here $p=${pt}$, so it ${p > 1 ? 'converges' : 'diverges'}.`;
    } else if (fam === 'trap') {
      const [fx, conc, ex] = r.pick([['x^2', 'up', '$f\'\'=2>0$'], ['\\sqrt x', 'down', '$f\'\'=-\\frac14x^{-3/2}<0$'], ['e^x', 'up', '$f\'\'=e^x>0$'], ['\\ln x', 'down', '$f\'\'=-\\frac1{x^2}<0$']]);
      const claim = r.pick(['over', 'under']);
      q = `The Trapezoid Rule ${claim === 'over' ? 'overestimates' : 'underestimates'} $\\int_1^3${fx}\\,dx$.`;
      v = (conc === 'up') === (claim === 'over');
      why = `${ex}, so the graph is concave ${conc}; chords lie ${conc === 'up' ? 'above' : 'below'} the curve and the Trapezoid Rule ${conc === 'up' ? 'overestimates' : 'underestimates'}.`;
    } else {
      const p = r.int(1, 4), a = r.int(2, 4);
      const ok = r.pick([true, false]);
      q = ok ? `The decomposition form of $\\frac{5}{(x-${p})(x^2+${a * a})}$ is $\\frac{A}{x-${p}}+\\frac{Bx+C}{x^2+${a * a}}$.` : `The decomposition form of $\\frac{5}{(x-${p})(x^2+${a * a})}$ is $\\frac{A}{x-${p}}+\\frac{B}{x^2+${a * a}}$.`;
      v = ok;
      why = ok ? 'Irreducible quadratic: linear numerator $Bx+C$; linear factor: constant.' : 'An irreducible quadratic needs a linear numerator $Bx+C$ (constant numerator is too few unknowns).';
    }
    return { tf: true, arch: 'judge-tf', src: 'Method Judgment (check-in style)',
      prompt: `**True or false?**  ${q}`,
      choices: [{ t: 'True', ok: v, ...(v ? {} : { why }) }, { t: 'False', ok: !v, ...(!v ? {} : { why }) }],
      keyWhy: why, steps: [why], recall: why };
  },
});

// 24. Method Judgment: select all
G.push({
  id: 'g-xi-judge-multi', topic: 'Method Judgment', unit: 'checkins', diff: 3,
  make(r) {
    const POOLY = [[`\\int_{0}^{1}\\frac{dx}{x}`, 'the integrand is unbounded at $x=0$'], [`\\int_{-1}^{1}\\frac{dx}{x^{2}}`, 'unbounded at $x=0$ inside the interval'], [`\\int_{0}^{1}\\ln x\\,dx`, 'the log is unbounded at $x=0$'], [`\\int_{\\pi/4}^{\\pi/2}\\tan x\\,dx`, '$\\tan x\\to\\infty$ at $\\pi/2$'], [`\\int_{1}^{\\infty}e^{-x}dx`, 'infinite limit'], [`\\int_{2}^{3}\\frac{dx}{x-2}`, 'unbounded at $x=2$']];
    const POOLN = [[`\\int_{0}^{1}\\frac{dx}{x+1}`, 'continuous on $[0,1]$'], [`\\int_{0}^{\\pi}\\sin x\\,dx`, 'continuous on a closed interval'], [`\\int_{1}^{4}\\sqrt{x}\\,dx`, 'continuous on $[1,4]$'], [`\\int_{0}^{1}\\frac{\\sin x}{x}dx`, 'removable at $0$: $\\frac{\\sin x}{x}\\to1$, so the integrand is bounded'], [`\\int_{0}^{\\pi/4}\\tan x\\,dx`, '$\\tan$ is continuous on $[0,\\pi/4]$'], [`\\int_{-1}^{1}\\frac{dx}{x^{2}+1}`, 'continuous everywhere']];
    const ny = r.int(2, 3);
    const Y = r.some(POOLY, ny), N = r.some(POOLN, 5 - ny);
    return { fmt: 'multi', arch: 'select-improper', src: 'Method Judgment (improper integrals)',
      prompt: 'Select **all** integrals that are improper (so FTC cannot be applied directly).',
      choices: r.shuffle([...Y.map(([f, w]) => ({ t: `$\\displaystyle ${f}$`, ok: true, why: `Improper: ${w}.` })), ...N.map(([f, w]) => ({ t: `$\\displaystyle ${f}$`, why: `Proper: ${w}.` }))]),
      keyWhy: 'Improper means an infinite limit or an integrand unbounded somewhere on the interval.',
      steps: ['Scan each integral for (a) an infinite limit, (b) a point in $[a,b]$ where the integrand blows up.'],
      recall: 'Check the integrand for infinities **inside** the interval, not just at the ends.' };
  },
});

// 25-30. Find-the-error generators
G.push({
  id: 'g-xi-err-parts', topic: 'Integration by Parts', diff: 3,
  make(r) {
    const fam = r.pick(['xexp', 'xln', 'loop']);
    const a = r.int(2, 4);
    if (fam === 'xexp') {
      return errItem(r, { arch: 'err-parts', topic: 'Integration by Parts', src: 'Parts: typical student errors',
        prompt: `A student computes $\\int xe^{${a}x}dx$. Find the first line that contains an error.`,
        lines: [
          { good: `u=x,\\ dv=e^{${a}x}dx\\Rightarrow du=dx,\\ v=\\frac{1}{${a}}e^{${a}x}`, why: '$v=\\int e^{ax}dx=\\frac1ae^{ax}$.', bads: [{ t: `u=x,\\ dv=e^{${a}x}dx\\Rightarrow du=dx,\\ v=e^{${a}x}`, why: `$v$ must be $\\frac1{${a}}e^{${a}x}$ (inner coefficient).` }] },
          { good: `\\int xe^{${a}x}dx=\\frac{x}{${a}}e^{${a}x}-\\int\\frac{1}{${a}}e^{${a}x}dx`, why: 'parts is $uv-\\int v\\,du$.', bads: [{ t: `\\int xe^{${a}x}dx=\\frac{x}{${a}}e^{${a}x}+\\int\\frac{1}{${a}}e^{${a}x}dx`, why: 'Parts is $uv-\\int v\\,du$; the sign was flipped.' }] },
          { good: `=\\frac{x}{${a}}e^{${a}x}-\\frac{1}{${a * a}}e^{${a}x}+C`, why: 'the remaining integral gives another $\\frac1a$.', bads: [{ t: `=\\frac{x}{${a}}e^{${a}x}-\\frac{1}{${a}}e^{${a}x}+C`, why: `$\\int\\frac1{${a}}e^{${a}x}dx=\\frac1{${a * a}}e^{${a}x}$: divide by $${a}$ a second time.` }] },
        ],
        steps: ['Re-derive each line; differentiating the final answer must give $xe^{ax}$.'], recall: 'Check every antiderivative of $e^{ax}$ for the $\\frac1a$.' });
    }
    if (fam === 'xln') {
      return errItem(r, { arch: 'err-parts', topic: 'Integration by Parts', src: 'Parts: typical student errors',
        prompt: `A student computes $\\int x^{${a}}\\ln x\\,dx$. Find the first line that contains an error.`,
        lines: [
          { good: `u=\\ln x,\\ dv=x^{${a}}dx\\Rightarrow du=\\frac{dx}{x},\\ v=\\frac{x^{${a + 1}}}{${a + 1}}`, why: 'LIATE: log is $u$; power rule for $v$.', bads: [{ t: `u=\\ln x,\\ dv=x^{${a}}dx\\Rightarrow du=\\frac{dx}{x},\\ v=x^{${a + 1}}`, why: `$v=\\frac{x^{${a + 1}}}{${a + 1}}$: you must divide by the new exponent.` }] },
          { good: `\\int x^{${a}}\\ln x\\,dx=\\frac{x^{${a + 1}}}{${a + 1}}\\ln x-\\int\\frac{x^{${a + 1}}}{${a + 1}}\\cdot\\frac{1}{x}dx`, why: 'the $uv-\\int v\\,du$ pattern.', bads: [{ t: `\\int x^{${a}}\\ln x\\,dx=\\frac{x^{${a + 1}}}{${a + 1}}\\ln x-\\int\\frac{x^{${a + 1}}}{${a + 1}}\\cdot x\\,dx`, why: '$du=\\frac{dx}{x}$, not $x\\,dx$.' }] },
          { good: `=\\frac{x^{${a + 1}}}{${a + 1}}\\ln x-\\frac{x^{${a + 1}}}{${(a + 1) ** 2}}+C`, why: `$\\frac1{${a + 1}}\\int x^{${a}}dx=\\frac{x^{${a + 1}}}{${(a + 1) ** 2}}$.`, bads: [{ t: `=\\frac{x^{${a + 1}}}{${a + 1}}\\ln x-\\frac{x^{${a + 1}}}{${a + 1}}+C`, why: `The leftover divides by $${a + 1}$ twice (once from $v$, once from the power rule).` }] },
        ],
        steps: ['Differentiate the final answer to confirm.'], recall: 'With $u=\\ln x$, $du=\\frac{dx}{x}$ cancels one power of $x$.' });
    }
    return errItem(r, { arch: 'err-parts', topic: 'Integration by Parts', src: 'Exam 1 v1 Q8 archetype',
      prompt: 'A student computes $I=\\int e^x\\cos x\\,dx$. Find the first line that contains an error.',
      lines: [
        { good: 'I=e^x\\sin x-\\int e^x\\sin x\\,dx', why: '$u=\\cos x$, $dv=e^xdx$ gives $e^x\\cos x$... then $u=e^x$, $dv=\\cos x$: $e^x\\sin x-\\int e^x\\sin x$.', bads: [{ t: 'I=e^x\\sin x+\\int e^x\\sin x\\,dx', why: 'Parts subtracts $\\int v\\,du$.' }] },
        { good: '\\int e^x\\sin x\\,dx=-e^x\\cos x+\\int e^x\\cos x\\,dx=-e^x\\cos x+I', why: '$\\int\\sin x=-\\cos x$ and the minus from parts cancels.', bads: [{ t: '\\int e^x\\sin x\\,dx=e^x\\cos x-I', why: '$\\int\\sin x\\,dx=-\\cos x$, and parts gives $-e^x\\cos x+\\int e^x\\cos x$.' }] },
        { good: 'I=e^x\\sin x+e^x\\cos x-I', why: 'substituting line 2 into line 1.', bads: [{ t: 'I=e^x\\sin x+e^x\\cos x+I', why: 'Substituting $-(\\,-e^x\\cos x+I\\,)$ gives $-I$.' }] },
        { good: 'I=\\frac{e^x(\\sin x+\\cos x)}{2}+C', why: 'solve $2I=\\dots$ for $I$.', bads: [{ t: 'I=e^x(\\sin x+\\cos x)+C', why: '$2I=\\dots$, so divide by $2$.' }] },
      ],
      steps: ['The cycle returns $\\pm I$; track the sign through both rounds.'], recall: 'Looping parts: move $I$ to the left and divide by the coefficient.' });
  },
});

G.push({
  id: 'g-xi-err-trigsub', topic: 'Trigonometric Substitution', diff: 4,
  make(r) {
    const a = r.int(2, 5), a2 = a * a;
    if (r() < 0.5) {
      return errItem(r, { arch: 'err-trigsub', topic: 'Trigonometric Substitution', src: 'Exam 1 v1 Q6 archetype',
        prompt: `A student computes $\\int\\sqrt{${a2}-x^2}\\,dx$. Find the first line that contains an error.`,
        lines: [
          { good: `x=${a}\\sin\\theta,\\ dx=${a}\\cos\\theta\\,d\\theta,\\ \\sqrt{${a2}-x^2}=${a}\\cos\\theta`, why: 'standard sine substitution.', bads: [{ t: `x=${a}\\sin\\theta,\\ dx=\\cos\\theta\\,d\\theta,\\ \\sqrt{${a2}-x^2}=${a}\\cos\\theta`, why: `$dx=${a}\\cos\\theta\\,d\\theta$: the factor ${a} from $x=${a}\\sin\\theta$ was dropped.` }] },
          { good: `\\int\\sqrt{${a2}-x^2}dx=${a2}\\int\\cos^2\\theta\\,d\\theta`, why: '$a\\cos\\theta\\cdot a\\cos\\theta=a^2\\cos^2\\theta$.', bads: [{ t: `\\int\\sqrt{${a2}-x^2}dx=${a}\\int\\cos^2\\theta\\,d\\theta`, why: `Two factors of ${a}: $\\sqrt{\\cdot}=${a}\\cos\\theta$ and $dx=${a}\\cos\\theta\\,d\\theta$, giving $${a2}$.` }] },
          { good: `=\\frac{${a2}}{2}\\left(\\theta+\\sin\\theta\\cos\\theta\\right)+C`, why: '$\\cos^2\\theta=\\frac{1+\\cos2\\theta}{2}$, and $\\frac{\\sin2\\theta}{2}=\\sin\\theta\\cos\\theta$.', bads: [{ t: `=\\frac{${a2}}{2}\\left(\\theta+\\sin 2\\theta\\right)+C`, why: '$\\int\\cos2\\theta\\,d\\theta=\\frac{\\sin2\\theta}{2}$; dividing by $2$ was forgotten.' }] },
          { good: `=\\frac{${a2}}{2}\\arcsin\\frac{x}{${a}}+\\frac{x}{2}\\sqrt{${a2}-x^2}+C`, why: `$\\sin\\theta\\cos\\theta=\\frac{x}{${a}}\\cdot\\frac{\\sqrt{${a2}-x^2}}{${a}}$.`, bads: [{ t: `=\\frac{${a2}}{2}\\arcsin\\frac{x}{${a}}+\\frac{${a}x}{2}\\sqrt{${a2}-x^2}+C`, why: `$\\cos\\theta=\\frac{\\sqrt{${a2}-x^2}}{${a}}$, so $\\frac{${a2}}{2}\\cdot\\frac{x\\sqrt{\\cdot}}{${a2}}=\\frac{x}{2}\\sqrt{\\cdot}$: the second $\\frac1{${a}}$ was dropped.` }] },
        ],
        steps: ['Check $dx$ and the radical separately; then the back-substitution.'], recall: 'Trig sub has three places to slip: $dx$, the identity, the triangle.' });
    }
    return errItem(r, { arch: 'err-trigsub', topic: 'Trigonometric Substitution', src: 'Trig-sub: sec integral',
      prompt: `A student computes $\\int\\frac{dx}{\\sqrt{x^2+${a2}}}$. Find the first line that contains an error.`,
      lines: [
        { good: `x=${a}\\tan\\theta,\\ dx=${a}\\sec^2\\theta\\,d\\theta,\\ \\sqrt{x^2+${a2}}=${a}\\sec\\theta`, why: 'standard tangent substitution.', bads: [{ t: `x=${a}\\tan\\theta,\\ dx=${a}\\sec\\theta\\,d\\theta,\\ \\sqrt{x^2+${a2}}=${a}\\sec\\theta`, why: '$\\frac{d}{d\\theta}\\tan\\theta=\\sec^2\\theta$, not $\\sec\\theta$.' }] },
        { good: `\\int\\frac{dx}{\\sqrt{x^2+${a2}}}=\\int\\sec\\theta\\,d\\theta`, why: `$\\frac{${a}\\sec^2\\theta}{${a}\\sec\\theta}=\\sec\\theta$.`, bads: [{ t: `\\int\\frac{dx}{\\sqrt{x^2+${a2}}}=\\int\\sec^2\\theta\\,d\\theta`, why: `Dividing $\\sec^2\\theta$ by $\\sec\\theta$ leaves $\\sec\\theta$, not $\\sec^2\\theta$.` }] },
        { good: '=\\ln|\\sec\\theta+\\tan\\theta|+C', why: 'the standard secant integral.', bads: [{ t: '=\\ln|\\sec\\theta|+C', why: '$\\int\\sec\\theta\\,d\\theta=\\ln|\\sec\\theta+\\tan\\theta|$; the $\\tan\\theta$ cannot be dropped.' }] },
        { good: `=\\ln\\left|\\frac{\\sqrt{x^2+${a2}}}{${a}}+\\frac{x}{${a}}\\right|+C`, why: `$\\sec\\theta=\\frac{\\sqrt{x^2+${a2}}}{${a}}$ and $\\tan\\theta=\\frac x${a}$.`, bads: [{ t: `=\\ln\\left|\\frac{${a}}{\\sqrt{x^2+${a2}}}+\\frac{x}{${a}}\\right|+C`, why: '$\\sec\\theta=\\frac{\\text{hyp}}{\\text{adj}}=\\frac{\\sqrt{x^2+a^2}}{a}$: the triangle ratio was inverted.' }] },
      ],
      steps: ['Recompute $dx$ and the radical, then simplify the ratio.'], recall: 'The tan-sub triangle: opp $x$, adj $a$, hyp $\\sqrt{x^2+a^2}$.' });
  },
});

G.push({
  id: 'g-xi-err-pf', topic: 'Partial Fractions', diff: 4,
  make(r) {
    if (r() < 0.5) {
      const p = r.int(1, 4), q = r.int(1, 4);
      let A = r.nz(-4, 4), B = r.nz(-4, 4);
      while (A === B || A + B === 0) { A = r.nz(-4, 4); B = r.nz(-4, 4); }
      const c = A + B, d = A * q - B * p;
      const num = `${c === 1 ? '' : c === -1 ? '-' : c}x${d === 0 ? '' : sg(d)}`;
      const L = (co, inner) => `${co === 1 ? '' : co === -1 ? '-' : co}\\ln|${inner}|`;
      return errItem(r, { arch: 'err-pf', topic: 'Partial Fractions', src: 'Partial fractions: typical student errors',
        prompt: `A student computes $\\int\\frac{${num}}{(x-${p})(x+${q})}dx$. Find the first line that contains an error.`,
        lines: [
          { good: `\\frac{${num}}{(x-${p})(x+${q})}=\\frac{A}{x-${p}}+\\frac{B}{x+${q}}`, why: 'distinct linear factors.', bads: [{ t: `\\frac{${num}}{(x-${p})(x+${q})}=\\frac{A}{x-${p}}\\cdot\\frac{B}{x+${q}}`, why: 'Partial fractions is a **sum**, not a product.' }] },
          { good: `${num}=A(x+${q})+B(x-${p})`, why: 'multiply through by the denominator.', bads: [{ t: `${num}=A(x-${p})+B(x+${q})`, why: `$A$ multiplies the **other** factor $(x+${q})$ after clearing denominators.` }] },
          { good: `A=${A},\\ B=${B}`, why: `cover-up at $x=${p}$ and $x=-${q}$.`, bads: [{ t: `A=${B},\\ B=${A}`, why: `Swapped: $x=${p}$ gives $A$ (the coefficient of $\\frac1{x-${p}}$).` }] },
          { good: `\\int=${L(A, `x-${p}`)}${B < 0 ? '' : '+'}${L(B, `x+${q}`)}+C`, why: '$\\int\\frac{c}{x-a}dx=c\\ln|x-a|$.', bads: [{ t: `\\int=-\\frac{${A}}{(x-${p})^2}-\\frac{${B}}{(x+${q})^2}+C`, why: '$\\frac{1}{x-a}$ integrates to a logarithm, not by the power rule.' }] },
        ],
        steps: ['Re-derive $A$, $B$ with cover-up.'], recall: 'Partial fractions: sum of terms; each linear term integrates to a log.' });
    }
    const m = r.int(2, 4), k = r.int(1, 3), K2 = 2 * m * k;
    return errItem(r, { arch: 'err-pf', topic: 'Partial Fractions', src: 'Exam 1 v1 Q3 archetype',
      prompt: `A student computes $\\int\\frac{x^3-${m * m}x+${K2}}{x^2-${m * m}}dx$. Find the first line that contains an error.`,
      lines: [
        { good: `\\frac{x^3-${m * m}x+${K2}}{x^2-${m * m}}=x+\\frac{${K2}}{x^2-${m * m}}`, why: 'long division first (degree 3 over degree 2).', bads: [{ t: `\\frac{x^3-${m * m}x+${K2}}{x^2-${m * m}}=\\frac{A}{x-${m}}+\\frac{B}{x+${m}}`, why: 'The fraction is improper (degree $3\\ge2$): divide first, then decompose.' }] },
        { good: `\\frac{${K2}}{x^2-${m * m}}=\\frac{${k}}{x-${m}}-\\frac{${k}}{x+${m}}`, why: `cover-up: $\\frac{${K2}}{2\\cdot${m}}=${k}$.`, bads: [{ t: `\\frac{${K2}}{x^2-${m * m}}=\\frac{${k}}{x-${m}}+\\frac{${k}}{x+${m}}`, why: `At $x=-${m}$ the cover-up value is $\\frac{${K2}}{-${2 * m}}=-${k}$: the second term is negative.` }] },
        { good: `\\int=\\frac{x^2}{2}+${k}\\ln|x-${m}|-${k}\\ln|x+${m}|+C`, why: '$\\int x\\,dx=\\frac{x^2}{2}$ plus the logs.', bads: [{ t: `\\int=x^2+${k}\\ln|x-${m}|-${k}\\ln|x+${m}|+C`, why: '$\\int x\\,dx=\\frac{x^2}{2}$, not $x^2$.' }] },
      ],
      steps: ['Check degrees first, then the cover-up values.'], recall: 'Degree check before every partial fractions problem.' });
  },
});

G.push({
  id: 'g-xi-err-usub', topic: 'u-Substitution', unit: 'foundations', diff: 3,
  make(r) {
    if (r() < 0.5) {
      const n = r.int(2, 4);
      return errItem(r, { arch: 'err-usub', topic: 'u-Substitution', unit: 'foundations', src: 'Exam 1 v1 Q4 trap',
        prompt: `A student computes $\\int_0^{\\pi/2}\\sin x\\cos^{${n}}x\\,dx$. Find the first line that contains an error.`,
        lines: [
          { good: 'u=\\cos x,\\ du=-\\sin x\\,dx', why: 'chain rule on $\\cos x$.', bads: [{ t: 'u=\\cos x,\\ du=\\sin x\\,dx', why: '$\\frac{d}{dx}\\cos x=-\\sin x$.' }] },
          { good: 'x=0\\Rightarrow u=1,\\quad x=\\tfrac{\\pi}{2}\\Rightarrow u=0', why: '$\\cos0=1$, $\\cos\\frac\\pi2=0$.', bads: [{ t: 'x=0\\Rightarrow u=0,\\quad x=\\tfrac{\\pi}{2}\\Rightarrow u=1', why: '$\\cos0=1$ and $\\cos\\frac\\pi2=0$: the limits are swapped.' }] },
          { good: `\\int_0^{\\pi/2}\\sin x\\cos^{${n}}x\\,dx=-\\int_1^0u^{${n}}du=\\int_0^1u^{${n}}du`, why: 'flipping limits cancels the minus.', bads: [{ t: `\\int_0^{\\pi/2}\\sin x\\cos^{${n}}x\\,dx=\\int_1^0u^{${n}}du`, why: 'The minus sign from $du=-\\sin x\\,dx$ was dropped.' }] },
          { good: `=\\frac{1}{${n + 1}}`, why: 'power rule, then evaluate.', bads: [{ t: `=\\frac{1}{${n}}`, why: `$\\int_0^1u^{${n}}du=\\frac1{${n + 1}}$.` }] },
        ],
        steps: ['Track the minus sign and the limits separately.'], recall: 'Definite u-sub: new limits, and $du=-\\sin x\\,dx$ supplies a minus.' });
    }
    const [b, m] = r.pick([[3, 4], [4, 3]]);
    const n = Math.round(Math.sqrt(b * b + m * m));
    return errItem(r, { arch: 'err-usub', topic: 'u-Substitution', unit: 'foundations', src: 'Lecture 08-18 trap: change bounds',
      prompt: `A student computes $\\int_0^{${b}}x\\sqrt{x^2+${m * m}}\\,dx$. Find the first line that contains an error.`,
      lines: [
        { good: `u=x^2+${m * m},\\ du=2x\\,dx`, why: 'chain rule.', bads: [{ t: `u=x^2+${m * m},\\ du=x\\,dx`, why: '$d(x^2)=2x\\,dx$.' }] },
        { good: `\\int_0^{${b}}x\\sqrt{x^2+${m * m}}\\,dx=\\frac12\\int_{${m * m}}^{${n * n}}\\sqrt u\\,du`, why: `limits $0\\mapsto${m * m}$, $${b}\\mapsto${n * n}$.`, bads: [{ t: `\\int_0^{${b}}x\\sqrt{x^2+${m * m}}\\,dx=\\frac12\\int_{0}^{${b}}\\sqrt u\\,du`, why: `The limits were not converted: they must become $u=${m * m}$ and $u=${n * n}$.` }] },
        { good: `=\\frac12\\cdot\\frac23u^{3/2}\\Big|_{${m * m}}^{${n * n}}`, why: 'power rule for $\\sqrt u$.', bads: [{ t: `=\\frac12\\cdot\\frac32u^{3/2}\\Big|_{${m * m}}^{${n * n}}`, why: '$\\int u^{1/2}du=\\frac{u^{3/2}}{3/2}=\\frac23u^{3/2}$.' }] },
        { good: `=\\frac13\\left(${n ** 3}-${m ** 3}\\right)=${frac(n ** 3 - m ** 3, 3)}`, why: `$${n * n}^{3/2}=${n ** 3}$ and $${m * m}^{3/2}=${m ** 3}$.`, bads: [{ t: `=\\frac13\\left(${n * n}-${m * m}\\right)=${frac(n * n - m * m, 3)}`, why: `$u^{3/2}$ at $u=${n * n}$ is $${n ** 3}$, not $${n * n}$.` }] },
      ],
      steps: ['Check the limits in the second line first.'], recall: 'Change the limits with the variable.' });
  },
});

G.push({
  id: 'g-xi-err-improper', topic: 'Improper Integrals', diff: 4,
  make(r) {
    if (r() < 0.5) {
      const a = r.int(2, 5);
      return errItem(r, { arch: 'err-improper', topic: 'Improper Integrals', src: 'Lecture 09-10 improper integrals',
        prompt: `A student computes $\\int_0^\\infty e^{-${a}x}dx$. Find the first line that contains an error.`,
        lines: [
          { good: `\\int_0^\\infty e^{-${a}x}dx=\\lim_{t\\to\\infty}\\int_0^te^{-${a}x}dx`, why: 'definition of the improper integral.', bads: [{ t: `\\int_0^\\infty e^{-${a}x}dx=\\int_0^\\infty e^{-${a}\\cdot\\infty}dx`, why: 'Infinity is never substituted directly: it is a limit of finite bounds.' }] },
          { good: `=\\lim_{t\\to\\infty}\\left[-\\frac{1}{${a}}e^{-${a}x}\\right]_0^t`, why: `$\\int e^{-${a}x}dx=-\\frac1{${a}}e^{-${a}x}$.`, bads: [{ t: `=\\lim_{t\\to\\infty}\\left[\\frac{1}{${a}}e^{-${a}x}\\right]_0^t`, why: `The antiderivative of $e^{-${a}x}$ is $-\\frac1{${a}}e^{-${a}x}$; the minus sign from the inner derivative was lost.` }] },
          { good: `=\\lim_{t\\to\\infty}\\left(-\\frac{1}{${a}}e^{-${a}t}+\\frac{1}{${a}}\\right)`, why: 'upper minus lower.', bads: [{ t: `=\\lim_{t\\to\\infty}\\left(-\\frac{1}{${a}}e^{-${a}t}-\\frac{1}{${a}}\\right)`, why: 'Lower limit: $-(-\\frac1a e^0)=+\\frac1a$.' }] },
          { good: `=\\frac{1}{${a}}`, why: '$e^{-at}\\to0$.', bads: [{ t: '=\\infty', why: '$e^{-at}\\to0$, not $\\infty$; the limit exists.' }] },
        ],
        steps: ['Verify the limit and the signs.'], recall: 'Improper: replace $\\infty$ by $t$, integrate, take $t\\to\\infty$.' });
    }
    const a = r.int(2, 4);
    return {
      fmt: 'error', arch: 'err-improper', topic: 'Improper Integrals', unit: 'techniques', diff: 4, src: 'Lecture 09-10: FTC across a discontinuity',
      prompt: `A student computes $\\int_{-${a}}^{${a}}\\frac{dx}{x^2}$. Find the first line that contains an error.`,
      work: [`$\\displaystyle\\int_{-${a}}^{${a}}\\frac{dx}{x^2}=\\left[-\\frac1x\\right]_{-${a}}^{${a}}$`, `$=-\\frac1{${a}}-\\frac1{${a}}$`, `$=-\\frac{${2}}{${a}}$`].map(s => s),
      choices: [
        { t: 'Line 1', ok: true, why: 'The integrand is unbounded at $x=0\\in[-' + a + ',' + a + ']$. The integral is improper; FTC cannot be applied across the discontinuity (and the integral diverges).' },
        { t: 'Line 2', why: 'The arithmetic in line 2 follows from line 1 as written; the error is earlier.' },
        { t: 'Line 3', why: 'Line 3 only simplifies; the error is in line 1.' },
        { t: 'No error', why: 'A positive integrand can never integrate to a negative number: line 1 is invalid.' },
      ],
      keyWhy: 'Line 1: $\\frac1{x^2}$ is not continuous on $[-a,a]$; split at $0$ and use limits.',
      steps: ['A positive function has a positive integral, so the negative answer is impossible.', 'Split: $\\int_{-a}^0+\\int_0^a$, each is $\\lim\\int$ and diverges.'],
      recall: 'Check the integrand for infinities **inside** the interval before using FTC.',
    };
  },
});

G.push({
  id: 'g-xi-err-arclen', topic: 'Arc Length', unit: 'applications', diff: 3,
  make(r) {
    const b = r.pick([3, 8, 15]);
    const m = Math.round(Math.sqrt(b + 1) ** 3);
    return errItem(r, { arch: 'err-arclen', topic: 'Arc Length', unit: 'applications', src: 'Exam 1 v1 Q2 archetype',
      prompt: `A student finds the length of $y=\\frac23x^{3/2}$ on $[0,${b}]$. Find the first line that contains an error.`,
      lines: [
        { good: "y'=x^{1/2}", why: "$\\frac23\\cdot\\frac32=1$.", bads: [{ t: "y'=\\frac{3}{2}x^{1/2}", why: "$\\frac{d}{dx}\\frac23x^{3/2}=\\frac23\\cdot\\frac32x^{1/2}=x^{1/2}$." }] },
        { good: "1+(y')^2=1+x", why: '$(x^{1/2})^2=x$.', bads: [{ t: "1+(y')^2=(1+x^{1/2})^2", why: 'Square the derivative only: $1+(y\')^2$, not $(1+y\')^2$.' }] },
        { good: `L=\\int_0^{${b}}\\sqrt{1+x}\\,dx`, why: 'arc length formula.', bads: [{ t: `L=\\int_0^{${b}}(1+x)\\,dx`, why: 'The square root is part of the arc length formula.' }] },
        { good: `L=\\frac23(1+x)^{3/2}\\Big|_0^{${b}}=\\frac23(${m}-1)=${frac(2 * (m - 1), 3)}`, why: 'evaluate both limits.', bads: [{ t: `L=\\frac23(1+x)^{3/2}\\Big|_0^{${b}}=\\frac23\\cdot${m}=${frac(2 * m, 3)}`, why: 'The lower limit contributes $\\frac23(1)^{3/2}$.' }] },
      ],
      steps: ['Verify each line against the arc length formula.'], recall: 'Arc length: derivative, square, add 1, root, integrate, evaluate both limits.' });
  },
});
