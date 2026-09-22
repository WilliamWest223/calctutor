// ---------------------------------------------------------------
// bank/foundations.js — Unit 00: Calc I prerequisites
// These get interleaved into every review set on purpose.
// ---------------------------------------------------------------
import { frac, coef, pow, lin, choose } from '../util.js';

const P = [];
const G = [];

// =================================================================
// STATIC PROBLEMS
// =================================================================

P.push({
  id: 'f-lim-sinratio', topic: 'Limits & Indeterminate Forms', diff: 1,
  prompt: 'Evaluate $\\displaystyle\\lim_{x\\to 0}\\frac{\\sin 3x}{5x}$',
  choices: [
    { t: '$\\dfrac{3}{5}$', ok: true },
    { t: '$1$', why: 'You used $\\lim_{x\\to0}\\frac{\\sin x}{x}=1$ without accounting for the coefficients. That limit only equals $1$ when the argument of sine and the denominator are *identical*.' },
    { t: '$\\dfrac{5}{3}$', why: 'Flipped. The $3$ comes from the inside of the sine (numerator), the $5$ from the denominator — so it is $3/5$.' },
    { t: '$0$', why: 'You substituted $x=0$ and read $0/0$ as $0$. $0/0$ is indeterminate — it carries no value until you resolve it.' },
  ],
  steps: [
    'Force the pattern $\\frac{\\sin u}{u}$: multiply and divide by $3x$.',
    '$\\dfrac{\\sin 3x}{5x} = \\dfrac{\\sin 3x}{3x}\\cdot\\dfrac{3x}{5x} = \\dfrac{\\sin 3x}{3x}\\cdot\\dfrac{3}{5}$',
    'As $x\\to0$, $3x\\to0$, so $\\frac{\\sin 3x}{3x}\\to 1$.',
    'Limit $= 1\\cdot\\frac{3}{5} = \\frac{3}{5}$. (L\'Hôpital gives the same: $\\frac{3\\cos 3x}{5}\\to\\frac35$.)',
  ],
  recall: '$\\lim_{u\\to0}\\frac{\\sin u}{u}=1$ — the argument and the denominator must match exactly.',
  viz: {
    kind: 'plot', xmin: -2, xmax: 2, ymin: -0.2, ymax: 1.1,
    curves: [{ f: x => (x === 0 ? 0.6 : Math.sin(3 * x) / (5 * x)), color: 'var(--cyan)', label: 'sin(3x)/(5x)' }],
    points: [{ x: 0, y: 0.6, open: true, color: 'var(--lime)', label: '0.6' }],
    cap: 'The graph has a hole at $x=0$, but it is heading for $0.6=\\tfrac35$ from both sides. The function never *reaches* $1$.',
  },
});

P.push({
  id: 'f-chain-lncos', topic: 'Chain Rule & Implicit', diff: 1,
  prompt: 'Differentiate $f(x)=\\ln(\\cos x)$.',
  choices: [
    { t: '$-\\tan x$', ok: true },
    { t: '$\\tan x$', why: 'Sign slip. The inner derivative is $\\frac{d}{dx}\\cos x = -\\sin x$, and that minus survives: $\\frac{-\\sin x}{\\cos x}=-\\tan x$.' },
    { t: '$\\dfrac{1}{\\cos x}$', why: 'You differentiated the outer $\\ln$ and stopped. The chain rule requires multiplying by the derivative of the inside.' },
    { t: '$-\\dfrac{1}{\\sin x}$', why: 'You replaced the inside with its derivative instead of multiplying by it. $\\frac{d}{dx}\\ln u = \\frac{u\'}{u}$ — the original $u$ stays downstairs.' },
  ],
  steps: [
    'Outer function $\\ln u$ with $u=\\cos x$.',
    '$\\frac{d}{dx}\\ln u = \\frac{1}{u}\\cdot u\'$',
    '$u\' = -\\sin x$, so $f\'(x)=\\dfrac{-\\sin x}{\\cos x}$',
    '$= -\\tan x$.',
  ],
  recall: '$\\frac{d}{dx}\\ln u = \\dfrac{u\'}{u}$. The old inside stays in the denominator; the derivative goes on top.',
  viz: {
    kind: 'plot', xmin: -1.4, xmax: 1.4, ymin: -3, ymax: 1.2,
    curves: [
      { f: x => Math.log(Math.cos(x)), color: 'var(--cyan)', label: 'f = ln(cos x)' },
      { f: x => -Math.tan(x), color: 'var(--lime)', label: "f' = −tan x" },
    ],
    cap: 'Where $f$ is increasing (left of $0$) the derivative is positive; $-\\tan x$ matches that. $+\\tan x$ would have the signs exactly backwards.',
  },
});

P.push({
  id: 'f-ftc1-chain', topic: 'FTC & Definite Integrals', diff: 2,
  prompt: 'Find $\\dfrac{d}{dx}\\displaystyle\\int_{0}^{x^{2}}\\sin t\\,dt$.',
  choices: [
    { t: '$2x\\sin(x^{2})$', ok: true },
    { t: '$\\sin(x^{2})$', why: 'You applied FTC Part 1 but forgot the chain rule. The upper limit is $x^2$, not $x$, so you must multiply by $\\frac{d}{dx}(x^2)=2x$.' },
    { t: '$1-\\cos(x^{2})$', why: 'You evaluated the integral first and then forgot to differentiate. That expression *is* the integral — its derivative is the answer.' },
    { t: '$2x\\cos(x^{2})$', why: 'You differentiated the integrand. FTC Part 1 says you *substitute* into the integrand, never differentiate it.' },
  ],
  steps: [
    'FTC Part 1 with a variable upper limit: $\\frac{d}{dx}\\int_a^{u(x)} f(t)\\,dt = f(u(x))\\cdot u\'(x)$.',
    'Here $f(t)=\\sin t$ and $u(x)=x^{2}$.',
    'Substitute: $f(u(x)) = \\sin(x^{2})$.',
    'Multiply by $u\'(x)=2x$: the answer is $2x\\sin(x^{2})$.',
  ],
  recall: 'FTC Part 1: plug the upper limit into the integrand, then multiply by the derivative of that limit.',
});

P.push({
  id: 'f-usub-limits', topic: 'u-Substitution', diff: 2,
  prompt: 'Evaluate $\\displaystyle\\int_{0}^{1} x e^{x^{2}}\\,dx$.',
  choices: [
    { t: '$\\dfrac{e-1}{2}$', ok: true },
    { t: '$e-1$', why: 'You dropped the $\\frac12$. With $u=x^2$, $du=2x\\,dx$, so $x\\,dx=\\frac12 du$ — that factor is not optional.' },
    { t: '$\\dfrac{e^{2}-1}{2}$', why: 'You changed the limits incorrectly. When $x=1$, $u=x^2=1$ (not $2$), so the upper limit is $1$.' },
    { t: '$\\dfrac{e}{2}$', why: 'You forgot to subtract the lower limit: $e^{u}$ at $u=0$ is $1$, not $0$.' },
  ],
  steps: [
    'Let $u=x^{2}$, so $du = 2x\\,dx$ and $x\\,dx = \\tfrac12\\,du$.',
    'Change the limits: $x=0\\Rightarrow u=0$; $x=1\\Rightarrow u=1$.',
    '$\\displaystyle\\int_0^1 xe^{x^2}dx = \\tfrac12\\int_0^1 e^{u}\\,du$',
    '$= \\tfrac12\\left[e^{u}\\right]_0^1 = \\tfrac12(e-1)$.',
  ],
  recall: 'Change the limits when you change the variable — then you never have to substitute back.',
  viz: {
    kind: 'area', xmin: -0.05, xmax: 1.12, a: 0, b: 1, slice: 0.62,
    top: x => x * Math.exp(x * x), topLabel: 'x·e^(x²)',
    cap: 'The shaded area is about $0.859 = \\frac{e-1}{2}$. If your answer was $e-1\\approx1.72$, notice it is *twice* the visible area — that is the missing $\\frac12$.',
  },
});

P.push({
  id: 'f-lhop-notform', topic: "L'Hôpital's Rule", diff: 2,
  prompt: 'Evaluate $\\displaystyle\\lim_{x\\to 0^{+}}\\frac{\\cos x}{x}$.',
  choices: [
    { t: '$+\\infty$', ok: true },
    { t: '$0$', why: "You applied L'Hôpital and got $\\frac{-\\sin x}{1}\\to 0$. But L'Hôpital does not apply — the form is $\\frac{1}{0^+}$, not $\\frac00$ or $\\frac\\infty\\infty$. Using it on a non-indeterminate form gives a wrong answer." },
    { t: '$1$', why: 'You matched this to $\\frac{\\sin x}{x}\\to1$, but cosine tends to $1$, not $0$, so the numerator does not vanish and the ratio blows up.' },
    { t: 'Does not exist (oscillates)', why: 'Nothing oscillates here. From the right, numerator $\\to1$ and denominator $\\to0^{+}$, giving a clean $+\\infty$.' },
  ],
  steps: [
    'First **check the form**: as $x\\to0^{+}$, $\\cos x\\to 1$ and $x\\to 0^{+}$.',
    'That is $\\frac{1}{0^{+}}$ — determinate, and equal to $+\\infty$.',
    "L'Hôpital's Rule requires $\\frac00$ or $\\frac{\\infty}{\\infty}$. Applying it here would illegally give $0$.",
    'Answer: $+\\infty$.',
  ],
  recall: "Always verify the indeterminate form *before* differentiating. L'Hôpital on a determinate form produces confident nonsense.",
  viz: {
    kind: 'plot', xmin: 0.02, xmax: 3, ymin: -1, ymax: 12,
    curves: [{ f: x => Math.cos(x) / x, color: 'var(--cyan)', label: 'cos(x)/x' }],
    cap: 'Near $x=0^{+}$ the curve rockets upward. The "L\'Hôpital answer" of $0$ is nowhere near the graph.',
  },
});

P.push({
  id: 'f-antider-signs', topic: 'Antiderivatives', diff: 1,
  prompt: 'Find $\\displaystyle\\int e^{-3x}\\,dx$.',
  choices: [
    { t: '$-\\dfrac{1}{3}e^{-3x}+C$', ok: true },
    { t: '$\\dfrac{1}{3}e^{-3x}+C$', why: 'Sign error. Differentiating your answer gives $-e^{-3x}$, not $+e^{-3x}$. Dividing by the inner coefficient $-3$ keeps the minus sign.' },
    { t: '$-3e^{-3x}+C$', why: 'You multiplied by the inner coefficient instead of dividing. Integration undoes the chain rule, so you divide.' },
    { t: '$e^{-3x}+C$', why: 'That is the antiderivative of $-3e^{-3x}$. Check by differentiating: you would get $-3e^{-3x}$.' },
  ],
  steps: [
    '$\\int e^{kx}dx = \\frac{1}{k}e^{kx}+C$ with $k=-3$.',
    '$= \\dfrac{1}{-3}e^{-3x}+C = -\\dfrac13 e^{-3x}+C$.',
    'Check: $\\frac{d}{dx}\\left(-\\frac13 e^{-3x}\\right) = -\\frac13\\cdot(-3)e^{-3x} = e^{-3x}$. ✓',
  ],
  recall: 'Every antiderivative can be checked by differentiating. Do it — it costs five seconds and catches every sign slip.',
});

P.push({
  id: 'f-odd-symmetry', topic: 'FTC & Definite Integrals', diff: 2,
  prompt: 'Evaluate $\\displaystyle\\int_{-2}^{2}\\left(x^{3}+x\\right)dx$.',
  choices: [
    { t: '$0$', ok: true },
    { t: '$12$', why: 'You computed $\\int_0^2$ and doubled it. That trick works for **even** functions; this integrand is odd, so the two halves cancel instead of adding.' },
    { t: '$8$', why: 'You antidifferentiated only the $x^3$ term, or dropped a term when evaluating. Track both pieces.' },
    { t: '$24$', why: 'You evaluated the antiderivative at $2$ but subtracted a sign incorrectly at $-2$. $F(-2)=-F(2)$ here, so $F(2)-F(-2)=2F(2)$ only if $F$ were odd — but $F$ is even.' },
  ],
  steps: [
    'Note $f(-x) = (-x)^3+(-x) = -(x^3+x) = -f(x)$: the integrand is **odd**.',
    'An odd function integrated over an interval symmetric about $0$ gives $0$.',
    'Verify directly: $F(x)=\\frac{x^4}{4}+\\frac{x^2}{2}$, and $F(2)=4+2=6$, $F(-2)=4+2=6$.',
    '$\\int_{-2}^{2} = F(2)-F(-2) = 6-6 = 0$.',
  ],
  recall: 'Odd function on $[-a,a]$ → $0$. Even function on $[-a,a]$ → $2\\int_0^a$. Check symmetry before grinding.',
  viz: {
    kind: 'plot', xmin: -2.4, xmax: 2.4,
    curves: [{ f: x => x ** 3 + x, color: 'var(--cyan)', label: 'x³ + x' }],
    bands: [{ f: x => x ** 3 + x, a: 0, b: 2, color: 'var(--lime)', op: 0.2 }, { f: x => x ** 3 + x, a: -2, b: 0, color: 'var(--coral)', op: 0.2 }],
    cap: 'The area below the axis (red) exactly cancels the area above it (green). Signed area, not total area.',
  },
});

P.push({
  id: 'f-implicit-circle', topic: 'Chain Rule & Implicit', diff: 2,
  prompt: 'If $x^{2}+y^{2}=25$, find $\\dfrac{dy}{dx}$.',
  choices: [
    { t: '$-\\dfrac{x}{y}$', ok: true },
    { t: '$\\dfrac{x}{y}$', why: 'Sign slip when solving. From $2x+2y\\,y\'=0$ you get $y\'=-x/y$; the $2x$ moves to the other side and picks up a minus.' },
    { t: '$-\\dfrac{y}{x}$', why: 'Flipped. Differentiating $y^2$ gives $2y\\,y\'$, so $y$ ends up in the *denominator* when you divide.' },
    { t: '$2x+2y$', why: 'You differentiated but never used the chain rule on $y$ or solved for $y\'$. Every $y$ carries a hidden $\\frac{dy}{dx}$.' },
  ],
  steps: [
    'Differentiate both sides with respect to $x$, treating $y$ as a function of $x$:',
    '$2x + 2y\\dfrac{dy}{dx} = 0$',
    '$2y\\dfrac{dy}{dx} = -2x$',
    '$\\dfrac{dy}{dx} = -\\dfrac{x}{y}$. (Geometrically: the tangent to a circle is perpendicular to the radius — slopes are negative reciprocals.)',
  ],
  recall: 'Differentiating $y$-terms produces a factor $\\frac{dy}{dx}$. Everything else is ordinary differentiation.',
  viz: {
    kind: 'plot', xmin: -6.5, xmax: 6.5, ymin: -6.5, ymax: 6.5,
    curves: [
      { f: x => (Math.abs(x) < 5 ? Math.sqrt(25 - x * x) : NaN), color: 'var(--cyan)' },
      { f: x => (Math.abs(x) < 5 ? -Math.sqrt(25 - x * x) : NaN), color: 'var(--cyan)' },
    ],
    segs: [{ x1: 0, y1: 0, x2: 3, y2: 4, color: 'var(--amber)' }, { x1: -1, y1: 7, x2: 7, y2: 1, color: 'var(--lime)' }],
    points: [{ x: 3, y: 4, color: 'var(--lime)', label: '(3,4)' }],
    cap: 'At $(3,4)$ the radius has slope $\\frac43$ and the tangent has slope $-\\frac34 = -x/y$. Perpendicular — exactly what the minus sign encodes.',
  },
});

P.push({
  id: 'f-hyper-deriv', topic: 'Hyperbolic Functions', diff: 2,
  prompt: 'Differentiate $f(x)=\\cosh x$.',
  choices: [
    { t: '$\\sinh x$', ok: true },
    { t: '$-\\sinh x$', why: 'You imported the minus sign from $\\frac{d}{dx}\\cos x=-\\sin x$. Hyperbolic functions have **no sign flip** — that minus is exactly what distinguishes them from the circular ones.' },
    { t: '$\\cosh x$', why: 'That is $\\frac{d}{dx}e^{x}$-style thinking. $\\cosh$ and $\\sinh$ swap under differentiation; only $e^x$ is its own derivative.' },
    { t: '$\\tanh x$', why: 'Mixing up quotient identities. $\\tanh x = \\frac{\\sinh x}{\\cosh x}$ is not a derivative of $\\cosh$.' },
  ],
  steps: [
    'By definition $\\cosh x = \\dfrac{e^{x}+e^{-x}}{2}$.',
    'Differentiate: $\\dfrac{e^{x}-e^{-x}}{2}$.',
    'That is exactly $\\sinh x$. No minus sign appears.',
    'Likewise $\\frac{d}{dx}\\sinh x = \\cosh x$.',
  ],
  recall: 'Hyperbolic derivatives mirror trig derivatives **without** the sign flips: $(\\cosh)\'=\\sinh$, $(\\sinh)\'=\\cosh$.',
  viz: {
    kind: 'plot', xmin: -2.5, xmax: 2.5,
    curves: [
      { f: x => Math.cosh(x), color: 'var(--cyan)', label: 'cosh x' },
      { f: x => Math.sinh(x), color: 'var(--lime)', label: 'sinh x' },
    ],
    cap: '$\\cosh$ has a minimum at $x=0$, so its derivative crosses zero there going upward — that is $\\sinh x$, positive for $x>0$.',
  },
});

P.push({
  id: 'f-lnabs', topic: 'Antiderivatives', diff: 2,
  prompt: 'Evaluate $\\displaystyle\\int_{-3}^{-1}\\frac{1}{x}\\,dx$.',
  choices: [
    { t: '$-\\ln 3$', ok: true },
    { t: '$\\ln 3$', why: 'Sign. The function $1/x$ is *negative* on $[-3,-1]$, so the signed area must be negative.' },
    { t: 'Undefined — the integrand blows up', why: 'The singularity of $1/x$ is at $x=0$, which is **not** in $[-3,-1]$. The integrand is continuous on the whole interval.' },
    { t: '$\\ln(-1)-\\ln(-3)$', why: 'You used $\\ln x$ instead of $\\ln|x|$. Logs of negatives are undefined; the antiderivative of $1/x$ is $\\ln|x|+C$.' },
  ],
  steps: [
    'The antiderivative of $\\frac1x$ is $\\ln|x|$ — absolute value matters here.',
    '$\\displaystyle\\int_{-3}^{-1}\\frac{dx}{x} = \\Big[\\ln|x|\\Big]_{-3}^{-1} = \\ln 1 - \\ln 3$',
    '$= 0 - \\ln 3 = -\\ln 3 \\approx -1.0986$.',
    'Sanity check: $1/x<0$ on this interval, so a negative answer is right.',
  ],
  recall: '$\\int \\frac{dx}{x} = \\ln|x|+C$. Only the point $x=0$ is forbidden, not all negatives.',
  viz: {
    kind: 'plot', xmin: -4, xmax: -0.4, ymin: -3, ymax: 0.4,
    curves: [{ f: x => 1 / x, color: 'var(--cyan)', label: '1/x' }],
    bands: [{ f: x => 1 / x, a: -3, b: -1, color: 'var(--coral)', op: 0.22 }],
    cap: 'The region sits entirely *below* the axis — its signed area is negative. Nothing here is undefined.',
  },
});

P.push({
  id: 'f-growth-order', topic: 'Limits & Indeterminate Forms', diff: 2,
  prompt: 'Evaluate $\\displaystyle\\lim_{x\\to\\infty}\\frac{x^{100}}{e^{x}}$.',
  choices: [
    { t: '$0$', ok: true },
    { t: '$\\infty$', why: 'The exponent $100$ is intimidating but irrelevant. Exponential growth beats *every* fixed power eventually — apply L\'Hôpital 100 times and the numerator becomes a constant while $e^x$ still runs away.' },
    { t: '$1$', why: 'Both pieces tend to $\\infty$, but $\\frac\\infty\\infty$ is indeterminate — it does not default to $1$.' },
    { t: '$100$', why: 'The exponent does not survive as a value. Repeated L\'Hôpital produces $100!/e^x\\to0$, not $100$.' },
  ],
  steps: [
    'Form is $\\frac{\\infty}{\\infty}$, so L\'Hôpital is legal.',
    'Each application drops the power by one and leaves $e^{x}$ untouched:',
    '$\\frac{x^{100}}{e^x}\\to\\frac{100x^{99}}{e^x}\\to\\cdots\\to\\frac{100!}{e^{x}}$',
    '$100!$ is a (huge) constant and $e^x\\to\\infty$, so the limit is $0$.',
  ],
  recall: 'Growth hierarchy: $\\ln x \\ll x^{p} \\ll e^{x} \\ll x!$. Anything to the left over anything to the right $\\to 0$.',
  viz: {
    kind: 'plot', xmin: 0, xmax: 14, ymin: 0, ymax: 1200,
    curves: [
      { f: x => x ** 4, color: 'var(--cyan)', label: 'x⁴' },
      { f: x => Math.exp(x), color: 'var(--lime)', label: 'eˣ' },
    ],
    cap: 'Even with only $x^{4}$, the exponential wins by $x\\approx 9$. With $x^{100}$ the crossover is later — but it always happens.',
  },
});

P.push({
  id: 'f-avg-vs-int', topic: 'FTC & Definite Integrals', diff: 2,
  prompt: 'A car\'s velocity is $v(t)$ m/s for $0\\le t\\le 10$. What does $\\displaystyle\\int_{0}^{10}|v(t)|\\,dt$ represent?',
  choices: [
    { t: 'Total distance travelled', ok: true },
    { t: 'Net displacement', why: 'Displacement is $\\int_0^{10} v\\,dt$ **without** the absolute value — backward motion subtracts. The absolute value makes every bit of motion count positively.' },
    { t: 'Average velocity', why: 'Average velocity is $\\frac{1}{10}\\int_0^{10}v\\,dt$ — you would need to divide by the length of the interval.' },
    { t: 'Final position', why: 'Final position is initial position plus displacement. This integral does not know where the car started, and the absolute value destroys direction information.' },
  ],
  steps: [
    '$\\int v\\,dt$ accumulates **signed** motion: moving backwards subtracts.',
    'Taking $|v|$ first makes every instant contribute positively.',
    'So $\\int_0^{10}|v|\\,dt$ adds up all motion regardless of direction — that is distance travelled.',
    'Contrast: displacement $=\\int_0^{10}v\\,dt$; average velocity $=\\frac{1}{10}\\int_0^{10}v\\,dt$.',
  ],
  recall: 'Signed area = displacement. Total area = distance. The absolute value is the whole difference.',
});

// =================================================================
// GENERATORS
// =================================================================

G.push({
  id: 'g-f-chain', topic: 'Chain Rule & Implicit', diff: 2,
  make(r) {
    const a = r.nz(2, 5), n = r.int(2, 3);
    const kind = r.pick(['sin', 'exp', 'ln', 'pow']);
    const inner = `${coef(a)}${pow('x', n)}`;
    const dinner = a * n;
    if (kind === 'sin') {
      return {
        prompt: `Differentiate $f(x)=\\sin\\!\\left(${inner}\\right)$.`,
        choices: [
          { t: `$${dinner}${pow('x', n - 1)}\\cos\\!\\left(${inner}\\right)$`, ok: true },
          { t: `$\\cos\\!\\left(${inner}\\right)$`, why: 'You differentiated the outer sine and stopped. The chain rule needs the inner derivative as a multiplier.' },
          { t: `$-${dinner}${pow('x', n - 1)}\\cos\\!\\left(${inner}\\right)$`, why: 'Sign flip. $\\frac{d}{dx}\\sin u = +\\cos u\\cdot u\'$ — the minus belongs to cosine\'s derivative, not sine\'s.' },
          { t: `$${dinner}${pow('x', n - 1)}\\sin\\!\\left(${inner}\\right)$`, why: 'You kept the outer function unchanged. Differentiating $\\sin$ turns it into $\\cos$.' },
        ],
        steps: [
          `Outer: $\\sin u$ with $u=${inner}$.`,
          `$u' = ${dinner}${pow('x', n - 1)}$`,
          `$f'(x) = \\cos(u)\\cdot u' = ${dinner}${pow('x', n - 1)}\\cos\\!\\left(${inner}\\right)$`,
        ],
        recall: '$\\frac{d}{dx}\\sin u = \\cos u \\cdot u\'$ — never drop $u\'$.',
      };
    }
    if (kind === 'exp') {
      return {
        prompt: `Differentiate $f(x)=e^{${inner}}$.`,
        choices: [
          { t: `$${dinner}${pow('x', n - 1)}e^{${inner}}$`, ok: true },
          { t: `$e^{${inner}}$`, why: '$e^{x}$ is its own derivative, but $e^{u(x)}$ is not — you still multiply by $u\'$.' },
          { t: `$${dinner}${pow('x', n - 1)}e^{${coef(a)}${pow('x', n - 1)}}$`, why: 'You differentiated the exponent *inside* the exponential too. The exponent stays exactly as it was.' },
          { t: `$e^{${dinner}${pow('x', n - 1)}}$`, why: 'You replaced the exponent by its derivative. The chain rule multiplies by $u\'$; it does not substitute $u\'$ for $u$.' },
        ],
        steps: [
          `$\\frac{d}{dx}e^{u} = e^{u}\\cdot u'$ with $u=${inner}$.`,
          `$u' = ${dinner}${pow('x', n - 1)}$`,
          `$f'(x) = ${dinner}${pow('x', n - 1)}e^{${inner}}$`,
        ],
        recall: 'The exponent never changes. It just gets a copy of its own derivative out front.',
      };
    }
    if (kind === 'ln') {
      const b = r.nz(1, 6);
      const ins = `${coef(a)}${pow('x', n)}${b > 0 ? '+' : '-'}${Math.abs(b)}`;
      return {
        prompt: `Differentiate $f(x)=\\ln\\!\\left(${ins}\\right)$.`,
        choices: [
          { t: `$\\dfrac{${dinner}${pow('x', n - 1)}}{${ins}}$`, ok: true },
          { t: `$\\dfrac{1}{${ins}}$`, why: 'You used $\\frac{d}{dx}\\ln x=\\frac1x$ and forgot the inner derivative on top.' },
          { t: `$\\dfrac{${ins}}{${dinner}${pow('x', n - 1)}}$`, why: 'Upside down. $\\frac{d}{dx}\\ln u=\\frac{u\'}{u}$: derivative on top, original underneath.' },
          { t: `$\\dfrac{${dinner}${pow('x', n - 1)}}{${coef(a)}${pow('x', n)}}$`, why: `You dropped the constant $${b > 0 ? '+' : '-'}${Math.abs(b)}$ from the denominator. The full inside function stays.` },
        ],
        steps: [
          `$u = ${ins}$, so $u' = ${dinner}${pow('x', n - 1)}$.`,
          `$\\frac{d}{dx}\\ln u = \\dfrac{u'}{u}$`,
          `$f'(x) = \\dfrac{${dinner}${pow('x', n - 1)}}{${ins}}$`,
        ],
        recall: '$(\\ln u)\' = u\'/u$.',
      };
    }
    const b = r.nz(1, 5), m = r.int(3, 6);
    return {
      prompt: `Differentiate $f(x)=\\left(${lin(a, b)}\\right)^{${m}}$.`,
      choices: [
        { t: `$${m * a}\\left(${lin(a, b)}\\right)^{${m - 1}}$`, ok: true },
        { t: `$${m}\\left(${lin(a, b)}\\right)^{${m - 1}}$`, why: `You applied the power rule but forgot the inner derivative $${a}$.` },
        { t: `$${m * a}\\left(${lin(a, b)}\\right)^{${m}}$`, why: 'The exponent must drop by one. You reduced nothing.' },
        { t: `$${m * a}\\left(${a}\\right)^{${m - 1}}$`, why: 'You replaced the inside with its derivative. Multiply by $u\'$, keep $u$ inside.' },
      ],
      steps: [
        `Power rule + chain rule: $\\frac{d}{dx}u^{${m}} = ${m}u^{${m - 1}}u'$.`,
        `$u=${lin(a, b)}$, $u' = ${a}$.`,
        `$f'(x) = ${m}\\cdot${a}\\left(${lin(a, b)}\\right)^{${m - 1}} = ${m * a}\\left(${lin(a, b)}\\right)^{${m - 1}}$`,
      ],
      recall: 'Bring the power down, subtract one, multiply by the inside derivative.',
    };
  },
});

G.push({
  id: 'g-f-lhop', topic: "L'Hôpital's Rule", diff: 2,
  make(r) {
    // a !== b, else the answer a/b reduces to 1 and collides with a distractor
    const a = r.int(2, 6);
    let b = r.int(2, 6);
    while (b === a) b = r.int(2, 6);
    const kind = r.pick(['sin', 'exp', 'ln1p']);
    const map = {
      sin: { num: `\\sin(${a}x)`, val: a / b, dn: `${a}\\cos(${a}x)` },
      exp: { num: `e^{${a}x}-1`, val: a / b, dn: `${a}e^{${a}x}` },
      ln1p: { num: `\\ln(1+${a}x)`, val: a / b, dn: `\\dfrac{${a}}{1+${a}x}` },
    }[kind];
    return {
      prompt: `Evaluate $\\displaystyle\\lim_{x\\to0}\\frac{${map.num}}{${b}x}$.`,
      choices: [
        { t: `$${frac(a, b)}$`, ok: true },
        { t: '$1$', why: 'You matched a memorized template ($\\frac{\\sin x}{x}\\to1$) without tracking the coefficients. They do not cancel unless they are equal.' },
        { t: `$${frac(b, a)}$`, why: 'Inverted. The numerator\'s coefficient goes on top after differentiating.' },
        { t: '$0$', why: 'Substituting gives $\\frac00$, which is indeterminate — it is not $0$. You must resolve it.' },
      ],
      steps: [
        `At $x=0$ the numerator and denominator are both $0$ — the form is $\\frac00$, so L'Hôpital applies.`,
        `Differentiate top and bottom **separately** (not the quotient rule): $\\dfrac{${map.dn}}{${b}}$.`,
        `Substitute $x=0$: $\\dfrac{${a}}{${b}} = ${frac(a, b)}$.`,
      ],
      recall: "L'Hôpital differentiates numerator and denominator independently — it is not the quotient rule.",
      viz: {
        kind: 'plot', xmin: -1, xmax: 1, ymin: (a / b) - 1.2, ymax: (a / b) + 1.2,
        curves: [{ f: x => (x === 0 ? a / b : (kind === 'sin' ? Math.sin(a * x) : kind === 'exp' ? Math.exp(a * x) - 1 : Math.log(1 + a * x)) / (b * x)), color: 'var(--cyan)' }],
        points: [{ x: 0, y: a / b, open: true, color: 'var(--lime)', label: String(Math.round((a / b) * 1000) / 1000) }],
        cap: 'The hole at $x=0$ sits at the limiting value. Read the height, not the gap.',
      },
    };
  },
});

G.push({
  id: 'g-f-usub', topic: 'u-Substitution', diff: 2,
  make(r) {
    const a = r.nz(2, 5), b = r.nz(1, 6), n = r.int(2, 4);
    const kind = r.pick(['lin', 'inner', 'trig']);
    if (kind === 'lin') {
      return {
        prompt: `Evaluate $\\displaystyle\\int \\left(${lin(a, b)}\\right)^{${n}}dx$.`,
        choices: [
          { t: `$\\dfrac{\\left(${lin(a, b)}\\right)^{${n + 1}}}{${a * (n + 1)}}+C$`, ok: true },
          { t: `$\\dfrac{\\left(${lin(a, b)}\\right)^{${n + 1}}}{${n + 1}}+C$`, why: `You forgot to divide by the inner derivative $${a}$. Differentiate your answer: an extra $${a}$ appears.` },
          { t: `$${a * (n + 1)}\\left(${lin(a, b)}\\right)^{${n + 1}}+C$`, why: 'You multiplied where you should divide. Integration undoes the chain rule, so the inner coefficient goes underneath.' },
          { t: `$\\dfrac{\\left(${lin(a, b)}\\right)^{${n}}}{${a * n}}+C$`, why: 'The exponent must go **up** by one when integrating, not stay put.' },
        ],
        steps: [
          `$u = ${lin(a, b)}$, $du = ${a}\\,dx$, so $dx = \\frac{du}{${a}}$.`,
          `$\\displaystyle\\int u^{${n}}\\frac{du}{${a}} = \\frac{1}{${a}}\\cdot\\frac{u^{${n + 1}}}{${n + 1}}+C$`,
          `Back-substitute: $\\dfrac{\\left(${lin(a, b)}\\right)^{${n + 1}}}{${a * (n + 1)}}+C$`,
        ],
        recall: 'Linear inside → divide by the coefficient. $\\int f(ax+b)dx = \\frac1a F(ax+b)+C$.',
      };
    }
    if (kind === 'inner') {
      const p = r.int(2, 3);
      return {
        prompt: `Evaluate $\\displaystyle\\int x^{${p - 1}}\\left(${coef(a)}x^{${p}}${b > 0 ? '+' : '-'}${Math.abs(b)}\\right)^{${n}}dx$.`,
        choices: [
          { t: `$\\dfrac{\\left(${coef(a)}x^{${p}}${b > 0 ? '+' : '-'}${Math.abs(b)}\\right)^{${n + 1}}}{${a * p * (n + 1)}}+C$`, ok: true },
          { t: `$\\dfrac{\\left(${coef(a)}x^{${p}}${b > 0 ? '+' : '-'}${Math.abs(b)}\\right)^{${n + 1}}}{${n + 1}}+C$`, why: `You never divided by $du/dx = ${a * p}x^{${p - 1}}$. The $x^{${p - 1}}$ cancels, but the constant $${a * p}$ does not.` },
          { t: `$\\dfrac{x^{${p}}\\left(${coef(a)}x^{${p}}${b > 0 ? '+' : '-'}${Math.abs(b)}\\right)^{${n + 1}}}{${a * p * (n + 1)}}+C$`, why: 'You kept the $x$ factor *and* substituted. The $x^{' + (p - 1) + '}$ is consumed by $du$ — it cannot appear in the answer.' },
          { t: `$\\dfrac{\\left(${coef(a)}x^{${p}}${b > 0 ? '+' : '-'}${Math.abs(b)}\\right)^{${n}}}{${a * p * n}}+C$`, why: 'Exponent should increase by one on integration.' },
        ],
        steps: [
          `Choose $u = ${coef(a)}x^{${p}}${b > 0 ? '+' : '-'}${Math.abs(b)}$ — the messy inside.`,
          `$du = ${a * p}x^{${p - 1}}dx \\Rightarrow x^{${p - 1}}dx = \\dfrac{du}{${a * p}}$`,
          `The leftover $x^{${p - 1}}dx$ matches exactly — that is why this $u$ works.`,
          `$\\dfrac{1}{${a * p}}\\displaystyle\\int u^{${n}}du = \\dfrac{u^{${n + 1}}}{${a * p * (n + 1)}}+C$`,
        ],
        recall: 'Pick $u$ so that the *rest* of the integrand is $du$ up to a constant.',
      };
    }
    return {
      prompt: `Evaluate $\\displaystyle\\int \\sin^{${n}}(x)\\cos(x)\\,dx$.`,
      choices: [
        { t: `$\\dfrac{\\sin^{${n + 1}}x}{${n + 1}}+C$`, ok: true },
        { t: `$\\dfrac{\\cos^{${n + 1}}x}{${n + 1}}+C$`, why: 'You substituted the wrong piece. Since $\\cos x\\,dx = d(\\sin x)$, the *sine* is $u$.' },
        { t: `$-\\dfrac{\\cos^{${n + 1}}x}{${n + 1}}+C$`, why: 'That would come from $u=\\cos x$, which needs a $-\\sin x\\,dx$ leftover — not what is here.' },
        { t: `$\\dfrac{\\sin^{${n + 1}}x\\sin x}{${n + 1}}+C$`, why: 'The $\\cos x$ is consumed by $du$; nothing extra survives.' },
      ],
      steps: [
        `$u=\\sin x$, $du = \\cos x\\,dx$ — the $\\cos x$ in the integrand is exactly $du$.`,
        `$\\displaystyle\\int u^{${n}}du = \\dfrac{u^{${n + 1}}}{${n + 1}}+C$`,
        `$= \\dfrac{\\sin^{${n + 1}}x}{${n + 1}}+C$`,
      ],
      recall: 'Whichever function has its derivative sitting next to it — that is $u$.',
    };
  },
});

G.push({
  id: 'g-f-ftc1', topic: 'FTC & Definite Integrals', diff: 2,
  make(r) {
    const k = r.int(2, 4), c = r.int(0, 3);
    const fn = r.pick([
      { tex: '\\sqrt{1+t^{3}}', sub: u => `\\sqrt{1+\\left(${u}\\right)^{3}}` },
      { tex: '\\cos(t^{2})', sub: u => `\\cos\\!\\left(\\left(${u}\\right)^{2}\\right)` },
      { tex: 'e^{-t^{2}}', sub: u => `e^{-\\left(${u}\\right)^{2}}` },
      { tex: '\\ln(1+t^{2})', sub: u => `\\ln\\!\\left(1+\\left(${u}\\right)^{2}\\right)` },
    ]);
    const u = `x^{${k}}`;
    return {
      prompt: `Let $g(x)=\\displaystyle\\int_{${c}}^{${u}} ${fn.tex}\\,dt$. Find $g'(x)$.`,
      choices: [
        { t: `$${k}${pow('x', k - 1)}\\,${fn.sub('x^{' + k + '}')}$`, ok: true },
        { t: `$${fn.sub('x^{' + k + '}')}$`, why: `FTC Part 1 was applied, but the upper limit is $x^{${k}}$, not $x$ — you owe a factor of $${k}${pow('x', k - 1)}$.` },
        { t: `$${k}${pow('x', k - 1)}\\,${fn.sub('t')}$`, why: 'The variable $t$ must disappear: it is the dummy variable of integration and cannot survive into $g\'(x)$.' },
        { t: `$${fn.sub('x')}$`, why: `You substituted $x$ instead of the actual upper limit $x^{${k}}$.` },
      ],
      steps: [
        `FTC Part 1 + chain rule: $\\dfrac{d}{dx}\\displaystyle\\int_a^{u(x)}f(t)dt = f(u(x))\\,u'(x)$.`,
        `Here $u(x)=x^{${k}}$ so $u'(x)=${k}${pow('x', k - 1)}$.`,
        `Substitute the upper limit into the integrand: $${fn.sub('x^{' + k + '}')}$.`,
        `Multiply: $g'(x)=${k}${pow('x', k - 1)}\\,${fn.sub('x^{' + k + '}')}$.`,
      ],
      recall: 'The lower constant limit contributes nothing. Only the moving limit matters.',
    };
  },
});

G.push({
  id: 'g-f-defint', topic: 'FTC & Definite Integrals', diff: 1,
  make(r) {
    const p = r.nz(1, 4), q = r.nz(1, 5), b = r.int(2, 3);   // b>=2 so b² and b³ differ
    // ∫_0^b (p x^2 + q) dx = p b^3/3 + q b
    const num = p * b ** 3 + 3 * q * b;
    const key = `$${frac(num, 3)}$`;
    return {
      prompt: `Evaluate $\\displaystyle\\int_{0}^{${b}}\\left(${coef(p)}x^{2}${q > 0 ? '+' : '-'}${Math.abs(q)}\\right)dx$.`,
      choices: [
        { t: key, ok: true },
        ...choose(key, [
          { t: `$${frac(p * b ** 3, 3)}$`, why: `You integrated the $x^{2}$ term and dropped the constant $${q}$. A constant integrates to $${q}x$, contributing $${q * b}$.` },
          { t: `$${frac(p * b ** 2 + 3 * q * b, 3)}$`, why: `Power slip: $\\int x^{2}dx = \\frac{x^{3}}{3}$, so you evaluate $\\frac{${b}^{3}}{3}$, not $\\frac{${b}^{2}}{3}$.` },
          { t: `$${p * b ** 2 + q}$`, why: 'You substituted into the *integrand* instead of the antiderivative. FTC evaluates $F$, not $f$.' },
          { t: `$${frac(p * b ** 3 + q, 3)}$`, why: `The constant term contributes $${q}\\cdot${b} = ${q * b}$, not $${q}$ — do not forget to evaluate $${q}x$ at $x=${b}$.` },
          { t: `$${frac(num, 2)}$`, why: '$\\int x^{2}dx$ divides by $3$, not $2$. (Dividing by $2$ is the antiderivative of $x$.)' },
        ]),
      ],
      steps: [
        `Antiderivative: $F(x)=${coef(p)}\\dfrac{x^{3}}{3}${q > 0 ? '+' : '-'}${Math.abs(q)}x$.`,
        `$F(${b}) = \\dfrac{${p}\\cdot${b ** 3}}{3}${q > 0 ? '+' : '-'}${Math.abs(q * b)} = ${frac(num, 3)}$`,
        `$F(0)=0$, so the integral is $${frac(num, 3)}$.`,
      ],
      recall: 'Antidifferentiate every term, then evaluate — top minus bottom.',
    };
  },
});

G.push({
  id: 'g-f-invtrig', topic: 'Inverse Trig, Log & Exp', diff: 2,
  make(r) {
    const a = r.int(2, 6);
    const kind = r.pick(['atan', 'asin']);
    if (kind === 'atan') {
      return {
        prompt: `Evaluate $\\displaystyle\\int \\frac{dx}{x^{2}+${a * a}}$.`,
        choices: [
          { t: `$\\dfrac{1}{${a}}\\arctan\\!\\left(\\dfrac{x}{${a}}\\right)+C$`, ok: true },
          { t: `$\\arctan\\!\\left(\\dfrac{x}{${a}}\\right)+C$`, why: `Missing the $\\frac{1}{a}$ out front. The formula is $\\int\\frac{dx}{x^2+a^2}=\\frac1a\\arctan\\frac xa+C$ — differentiate to see the extra $\\frac{1}{${a}}$ is needed.` },
          { t: `$\\dfrac{1}{${a}}\\arcsin\\!\\left(\\dfrac{x}{${a}}\\right)+C$`, why: 'Wrong inverse function. A **sum** $x^2+a^2$ gives arctangent; a **difference under a root** gives arcsine.' },
          { t: `$\\ln\\left|x^{2}+${a * a}\\right|+C$`, why: 'That is the $\\int\\frac{u\'}{u}$ pattern, but the numerator here is $1$, not $2x$. There is no $x$ on top to supply $du$.' },
        ],
        steps: [
          `Match the template $\\displaystyle\\int\\frac{dx}{x^{2}+a^{2}} = \\frac1a\\arctan\\frac xa + C$ with $a=${a}$.`,
          `Answer: $\\dfrac{1}{${a}}\\arctan\\!\\left(\\dfrac{x}{${a}}\\right)+C$.`,
          `Check by differentiating: $\\frac{1}{${a}}\\cdot\\frac{1/${a}}{1+x^{2}/${a * a}} = \\frac{1}{x^{2}+${a * a}}$. ✓`,
        ],
        recall: 'Sum of squares → arctan (with $\\frac1a$). Difference under a radical → arcsin (no $\\frac1a$).',
      };
    }
    return {
      prompt: `Evaluate $\\displaystyle\\int \\frac{dx}{\\sqrt{${a * a}-x^{2}}}$.`,
      choices: [
        { t: `$\\arcsin\\!\\left(\\dfrac{x}{${a}}\\right)+C$`, ok: true },
        { t: `$\\dfrac{1}{${a}}\\arcsin\\!\\left(\\dfrac{x}{${a}}\\right)+C$`, why: `You imported the $\\frac1a$ from the arctangent formula. The arcsine formula has **no** leading fraction.` },
        { t: `$\\dfrac{1}{${a}}\\arctan\\!\\left(\\dfrac{x}{${a}}\\right)+C$`, why: 'Wrong template: the radical with a difference of squares signals arcsine.' },
        { t: `$\\ln\\left|x+\\sqrt{${a * a}-x^{2}}\\right|+C$`, why: 'That log form belongs to $\\int\\frac{dx}{\\sqrt{x^{2}\\pm a^{2}}}$, where the $x^2$ is positive.' },
      ],
      steps: [
        `Template: $\\displaystyle\\int\\frac{dx}{\\sqrt{a^{2}-x^{2}}}=\\arcsin\\frac xa+C$, here $a=${a}$.`,
        `Answer: $\\arcsin\\!\\left(\\dfrac{x}{${a}}\\right)+C$.`,
        `Check: $\\frac{d}{dx}\\arcsin\\frac{x}{${a}} = \\frac{1/${a}}{\\sqrt{1-x^{2}/${a * a}}} = \\frac{1}{\\sqrt{${a * a}-x^{2}}}$. ✓`,
      ],
      recall: 'Memorize the pair together so the $\\frac1a$ lands on the right one.',
    };
  },
});

G.push({
  id: 'g-f-prodquot', topic: 'Derivative Rules', diff: 1,
  make(r) {
    const a = r.int(2, 4), k = r.nz(2, 4);
    const kind = r.pick(['prod', 'quot']);
    if (kind === 'prod') {
      return {
        prompt: `Differentiate $f(x)=x^{${a}}e^{${k}x}$.`,
        choices: [
          { t: `$x^{${a - 1}}e^{${k}x}\\left(${a}+${k}x\\right)$`, ok: true },
          { t: `$${a * k}x^{${a - 1}}e^{${k}x}$`, why: 'You multiplied the two derivatives together. The product rule is $u\'v+uv\'$, a **sum**, not a product of derivatives.' },
          { t: `$${a}x^{${a - 1}}e^{${k}x}$`, why: 'You differentiated only the first factor and left the second alone. Both terms are required.' },
          { t: `$${k}x^{${a}}e^{${k}x}$`, why: 'You differentiated only the exponential. The $u\'v$ term is missing.' },
        ],
        steps: [
          `$u=x^{${a}}$, $v=e^{${k}x}$; $u'=${a}x^{${a - 1}}$, $v'=${k}e^{${k}x}$.`,
          `$f' = u'v+uv' = ${a}x^{${a - 1}}e^{${k}x}+${k}x^{${a}}e^{${k}x}$`,
          `Factor $x^{${a - 1}}e^{${k}x}$: $f' = x^{${a - 1}}e^{${k}x}\\left(${a}+${k}x\\right)$.`,
        ],
        recall: 'Product rule: derivative of the first times the second, **plus** the first times derivative of the second.',
      };
    }
    return {
      prompt: `Differentiate $f(x)=\\dfrac{x^{${a}}}{${lin(1, k)}}$.`,
      choices: [
        { t: `$\\dfrac{${a}x^{${a - 1}}\\left(${lin(1, k)}\\right)-x^{${a}}}{\\left(${lin(1, k)}\\right)^{2}}$`, ok: true },
        { t: `$\\dfrac{x^{${a}}-${a}x^{${a - 1}}\\left(${lin(1, k)}\\right)}{\\left(${lin(1, k)}\\right)^{2}}$`, why: 'Order reversed — the quotient rule is (low·d-high − high·d-low), so the numerator-derivative term comes **first**.' },
        { t: `$\\dfrac{${a}x^{${a - 1}}}{1}$`, why: 'You differentiated top and bottom separately. That is never a valid rule (it is not even L\'Hôpital, which only applies to limits).' },
        { t: `$\\dfrac{${a}x^{${a - 1}}\\left(${lin(1, k)}\\right)-x^{${a}}}{${lin(1, k)}}$`, why: 'The denominator must be **squared**.' },
      ],
      steps: [
        `Quotient rule: $\\left(\\frac{u}{v}\\right)' = \\dfrac{u'v-uv'}{v^{2}}$.`,
        `$u=x^{${a}}\\Rightarrow u'=${a}x^{${a - 1}}$; $v=${lin(1, k)}\\Rightarrow v'=1$.`,
        `$f' = \\dfrac{${a}x^{${a - 1}}\\left(${lin(1, k)}\\right)-x^{${a}}}{\\left(${lin(1, k)}\\right)^{2}}$`,
      ],
      recall: '"Low d-high minus high d-low, over the square of what\'s below."',
    };
  },
});

G.push({
  id: 'g-f-hyper', topic: 'Hyperbolic Functions', diff: 2,
  make(r) {
    const a = r.int(2, 5);
    const kind = r.pick(['dsinh', 'dtanh', 'icosh']);
    if (kind === 'dsinh') {
      return {
        prompt: `Differentiate $f(x)=\\sinh(${a}x)$.`,
        choices: [
          { t: `$${a}\\cosh(${a}x)$`, ok: true },
          { t: `$-${a}\\cosh(${a}x)$`, why: 'No sign flip in hyperbolic derivatives — that minus belongs to circular trig.' },
          { t: `$\\cosh(${a}x)$`, why: `Chain rule: multiply by the inner derivative $${a}$.` },
          { t: `$${a}\\sinh(${a}x)$`, why: '$\\sinh$ and $\\cosh$ swap when differentiated; the function must change.' },
        ],
        steps: [`$\\frac{d}{dx}\\sinh u = \\cosh u\\cdot u'$`, `$u=${a}x$, $u'=${a}$`, `$f'=${a}\\cosh(${a}x)$`],
        recall: '$(\\sinh)\'=\\cosh$, $(\\cosh)\'=\\sinh$ — both positive.',
      };
    }
    if (kind === 'dtanh') {
      return {
        prompt: `Differentiate $f(x)=\\tanh(${a}x)$.`,
        choices: [
          { t: `$${a}\\,\\operatorname{sech}^{2}(${a}x)$`, ok: true },
          { t: `$-${a}\\,\\operatorname{sech}^{2}(${a}x)$`, why: 'Positive. Compare $(\\tan)\'=\\sec^{2}$ — also positive; the hyperbolic version keeps the sign.' },
          { t: `$${a}\\,\\operatorname{sech}(${a}x)\\tanh(${a}x)$`, why: 'That is $-\\frac{d}{dx}\\operatorname{sech}$, a different derivative.' },
          { t: `$\\operatorname{sech}^{2}(${a}x)$`, why: `Missing the chain factor $${a}$.` },
        ],
        steps: [`$\\frac{d}{dx}\\tanh u = \\operatorname{sech}^{2}u\\cdot u'$`, `$u'=${a}$`, `$f'=${a}\\operatorname{sech}^{2}(${a}x)$`],
        recall: '$(\\tanh)\' = \\operatorname{sech}^{2}$ — mirrors $(\\tan)\'=\\sec^{2}$, no sign change.',
      };
    }
    return {
      prompt: `Evaluate $\\displaystyle\\int \\cosh(${a}x)\\,dx$.`,
      choices: [
        { t: `$\\dfrac{1}{${a}}\\sinh(${a}x)+C$`, ok: true },
        { t: `$\\dfrac{1}{${a}}\\cosh(${a}x)+C$`, why: 'The function must switch: integrating $\\cosh$ gives $\\sinh$.' },
        { t: `$-\\dfrac{1}{${a}}\\sinh(${a}x)+C$`, why: 'No sign flip — that would be the circular-trig pattern $\\int\\cos \\to \\sin$ misremembered.' },
        { t: `$${a}\\sinh(${a}x)+C$`, why: 'Divide by the inner coefficient when integrating, do not multiply.' },
      ],
      steps: [`$\\int\\cosh(kx)dx = \\frac1k\\sinh(kx)+C$ with $k=${a}$.`, `Check: $\\frac{d}{dx}\\frac{1}{${a}}\\sinh(${a}x) = \\cosh(${a}x)$. ✓`],
      recall: 'Hyperbolic integrals mirror the derivatives, with the usual $\\frac1k$ from the chain rule.',
    };
  },
});

G.push({
  id: 'g-f-antider', topic: 'Antiderivatives', diff: 1,
  make(r) {
    const kind = r.pick(['power', 'sec2', 'expbase', 'recip']);
    const a = r.int(2, 5);
    if (kind === 'power') {
      const n = r.int(2, 6);
      const key = `$\\dfrac{x^{${n + 1}}}{${n + 1}}+C$`;
      return {
        prompt: `Evaluate $\\displaystyle\\int x^{${n}}\\,dx$.`,
        choices: [
          { t: key, ok: true },
          ...choose(key, [
            { t: `$${n}x^{${n - 1}}+C$`, why: 'You differentiated. Integration raises the power; differentiation lowers it.' },
            { t: `$x^{${n + 1}}+C$`, why: `You raised the power but forgot to divide by the new exponent $${n + 1}$.` },
            { t: `$\\dfrac{x^{${n}}}{${n}}+C$`, why: 'The exponent must increase by one before you divide.' },
            { t: `$\\dfrac{x^{${n + 1}}}{${n}}+C$`, why: `Divide by the **new** exponent $${n + 1}$, not the old one.` },
          ]),
        ],
        steps: [
          `Power rule for integration: $\\int x^{n}dx = \\dfrac{x^{n+1}}{n+1}+C$ (valid for $n\\ne-1$).`,
          `With $n=${n}$: $\\dfrac{x^{${n + 1}}}{${n + 1}}+C$.`,
          `Check by differentiating: $\\dfrac{${n + 1}x^{${n}}}{${n + 1}} = x^{${n}}$. ✓`,
        ],
        recall: 'Raise the power, divide by the new power. The exception $n=-1$ gives $\\ln|x|$.',
      };
    }
    if (kind === 'sec2') {
      const key = `$\\dfrac{\\tan(${a}x)}{${a}}+C$`;
      return {
        prompt: `Evaluate $\\displaystyle\\int \\sec^{2}(${a}x)\\,dx$.`,
        choices: [
          { t: key, ok: true },
          ...choose(key, [
            { t: `$\\tan(${a}x)+C$`, why: `Missing the $\\frac{1}{${a}}$. Differentiating $\\tan(${a}x)$ produces an extra factor of $${a}$ by the chain rule.` },
            { t: `$${a}\\tan(${a}x)+C$`, why: 'Multiplied where you should divide. Integration undoes the chain rule.' },
            { t: `$\\dfrac{\\sec^{3}(${a}x)}{3${a}}+C$`, why: 'Power rule applied to a trig function without a matching $du$. $\\sec^{2}$ is a derivative you should recognize, not a power to integrate.' },
            { t: `$\\dfrac{\\sec(${a}x)\\tan(${a}x)}{${a}}+C$`, why: 'That is the antiderivative of $\\sec(ax)\\tan(ax)$, a different integrand.' },
          ]),
        ],
        steps: [
          `Recognize $\\dfrac{d}{dx}\\tan x = \\sec^{2}x$.`,
          `With the inner $${a}x$: $\\int\\sec^{2}(${a}x)dx = \\dfrac{\\tan(${a}x)}{${a}}+C$.`,
          `Check: $\\dfrac{1}{${a}}\\cdot\\sec^{2}(${a}x)\\cdot${a} = \\sec^{2}(${a}x)$. ✓`,
        ],
        recall: 'Learn the derivative table backwards — most antiderivatives are just recognition.',
      };
    }
    if (kind === 'expbase') {
      const b = r.pick([2, 3, 5, 7]);
      const key = `$\\dfrac{${b}^{x}}{\\ln ${b}}+C$`;
      return {
        prompt: `Evaluate $\\displaystyle\\int ${b}^{x}\\,dx$.`,
        choices: [
          { t: key, ok: true },
          ...choose(key, [
            { t: `$${b}^{x}\\ln ${b}+C$`, why: `That is the **derivative** of $${b}^{x}$. Integration divides by $\\ln ${b}$; differentiation multiplies by it.` },
            { t: `$\\dfrac{${b}^{x+1}}{x+1}+C$`, why: `Power rule misapplied. The variable is in the **exponent**, not the base — $${b}^{x}$ is exponential, not a power function.` },
            { t: `$${b}^{x}+C$`, why: `Only $e^{x}$ is its own antiderivative. Any other base picks up a $\\frac{1}{\\ln ${b}}$.` },
            { t: `$x\\,${b}^{x-1}+C$`, why: 'That treats the base as the variable. Compare $\\frac{d}{dx}x^{n}$ (power) with $\\frac{d}{dx}b^{x}$ (exponential) — completely different rules.' },
          ]),
        ],
        steps: [
          `Rewrite with base $e$: $${b}^{x}=e^{x\\ln ${b}}$.`,
          `$\\displaystyle\\int e^{x\\ln ${b}}dx = \\dfrac{e^{x\\ln ${b}}}{\\ln ${b}}+C$`,
          `$= \\dfrac{${b}^{x}}{\\ln ${b}}+C$`,
        ],
        recall: '$\\int b^{x}dx = \\frac{b^{x}}{\\ln b}+C$. The $\\ln b$ is downstairs when integrating, upstairs when differentiating.',
      };
    }
    const key = `$${a}\\ln|x|+C$`;
    return {
      prompt: `Evaluate $\\displaystyle\\int \\frac{${a}}{x}\\,dx$.`,
      choices: [
        { t: key, ok: true },
        ...choose(key, [
          { t: `$${a}\\ln x+C$`, why: 'The absolute value matters: $\\frac1x$ is defined for negative $x$ too, and $\\ln$ of a negative number is not. The antiderivative is $\\ln|x|$.' },
          { t: `$-\\dfrac{${a}}{x^{2}}+C$`, why: 'You differentiated instead of integrating.' },
          { t: `$\\dfrac{${a}x^{0}}{0}+C$`, why: 'The power rule breaks at $n=-1$ — dividing by zero. That exact gap is why $\\ln|x|$ exists.' },
          { t: `$\\dfrac{${a}}{\\ln|x|}+C$`, why: 'The constant multiplies the log; it does not go underneath it.' },
        ]),
      ],
      steps: [
        `Pull the constant out: $${a}\\displaystyle\\int\\frac{dx}{x}$.`,
        `$\\displaystyle\\int\\frac{dx}{x} = \\ln|x|+C$ — the one case the power rule cannot handle.`,
        `Answer: $${a}\\ln|x|+C$.`,
      ],
      recall: '$n=-1$ is the exception to the power rule, and the absolute value is part of the answer.',
    };
  },
});

G.push({
  id: 'g-f-limform', topic: 'Limits & Indeterminate Forms', diff: 2,
  make(r) {
    const kind = r.pick(['ratio', 'classify']);
    if (kind === 'ratio') {
      const p = r.int(2, 6);
      let q = r.int(2, 6);
      while (q === p) q = r.int(2, 6);      // p/q must not reduce to 1 (collides with a distractor)
      const m = r.int(1, 3), n = r.int(1, 3);
      const key = m === n ? `$${frac(p, q)}$` : m < n ? '$0$' : '$\\infty$';
      // the trailing term has to stay strictly below the leading one, or it
      // merges with it: qx + x is (q+1)x, and the ratio of leading
      // coefficients silently stops being p/q
      const pw = e => (e === 1 ? 'x' : `x^{${e}}`);
      const tail = e => (e > 1 ? '+x' : '+1');
      return {
        prompt: `Evaluate $\\displaystyle\\lim_{x\\to\\infty}\\frac{${coef(p)}${pw(m)}${tail(m)}}{${coef(q)}${pw(n)}${tail(n)}}$.`,
        choices: [
          { t: key, ok: true },
          ...choose(key, [
            { t: `$${frac(p, q)}$`, why: `The ratio of leading coefficients is the answer only when the **degrees match**. Here the top has degree $${m}$ and the bottom degree $${n}$.` },
            { t: '$0$', why: `A limit of $0$ requires the denominator's degree to be strictly larger. Here top is degree $${m}$, bottom degree $${n}$.` },
            { t: '$\\infty$', why: `Unbounded growth requires the numerator's degree to be strictly larger. Here top is degree $${m}$, bottom degree $${n}$.` },
            { t: '$1$', why: 'Both parts grow without bound, but $\\frac{\\infty}{\\infty}$ is indeterminate — it does not default to $1$.' },
            { t: `$${frac(q, p)}$`, why: 'Coefficients inverted — the numerator\'s leading coefficient belongs on top.' },
            { t: 'Does not exist', why: 'Rational functions always settle down at infinity: the answer is $0$, a finite ratio, or $\\pm\\infty$ depending on the degrees.' },
          ]),
        ],
        steps: [
          `Compare degrees: numerator $${m}$, denominator $${n}$.`,
          `Divide everything by $x^{${Math.max(m, n)}}$, the highest power present.`,
          m === n ? `Equal degrees → the limit is the ratio of leading coefficients, $${frac(p, q)}$.`
            : m < n ? `Denominator wins → the fraction is crushed to $0$.`
              : `Numerator wins → the fraction grows without bound, so the limit is $\\infty$.`,
          `(Equivalently, L'Hôpital applied $${Math.max(m, n)}$ times gives the same answer.)`,
        ],
        recall: 'Top degree < bottom → $0$. Equal → ratio of leading coefficients. Top > bottom → $\\pm\\infty$.',
      };
    }
    const forms = [
      { ex: '\\lim_{x\\to0^{+}} x\\ln x', f: '$0\\cdot\\infty$', why: '$x\\to0$ and $\\ln x\\to-\\infty$.' },
      { ex: '\\lim_{x\\to\\infty}\\left(\\sqrt{x^{2}+x}-x\\right)', f: '$\\infty-\\infty$', why: 'Both terms grow without bound and are subtracted.' },
      { ex: '\\lim_{x\\to\\infty}\\left(1+\\tfrac1x\\right)^{x}', f: '$1^{\\infty}$', why: 'The base tends to $1$ while the exponent grows.' },
      { ex: '\\lim_{x\\to0^{+}} x^{x}', f: '$0^{0}$', why: 'Base and exponent both tend to $0$.' },
    ];
    const pick = r.pick(forms);
    const others = r.some(forms.filter(f => f.f !== pick.f), 3);
    return {
      prompt: `What indeterminate form does $\\displaystyle ${pick.ex}$ have?`,
      choices: [
        { t: pick.f, ok: true },
        ...others.map(o => ({ t: o.f, why: `${o.f} arises when ${o.why} That is not the situation here — instead, ${pick.why.charAt(0).toLowerCase()}${pick.why.slice(1)}` })),
      ],
      steps: [
        `Substitute the limiting value into each piece separately.`,
        `${pick.why}`,
        `So the form is ${pick.f}.`,
        `None of $0\\cdot\\infty$, $\\infty-\\infty$, $1^{\\infty}$, $0^{0}$ can be used with L'Hôpital directly — first rewrite as a quotient (take logs for the exponential forms).`,
      ],
      recall: "L'Hôpital only accepts $\\frac00$ and $\\frac\\infty\\infty$. Every other indeterminate form must be algebraically converted into one of those first.",
    };
  },
});

export const foundations = { unit: 'foundations', problems: P, generators: G };
