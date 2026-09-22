// ---------------------------------------------------------------
// bank/diffeq.js — Unit 03: Differential Equations
// ---------------------------------------------------------------
import { frac, choose } from '../util.js';

const P = [];
const G = [];

// =================================================================
// STATIC
// =================================================================

P.push({
  id: 'd-sep-const', topic: 'Separable Equations', diff: 2,
  prompt: 'Solve $\\dfrac{dy}{dx}=xy$.',
  choices: [
    { t: '$y = Ce^{x^{2}/2}$', ok: true },
    { t: '$y = e^{x^{2}/2}+C$', why: 'The constant is in the wrong place. Integrating gives $\\ln|y| = \\frac{x^{2}}{2}+C$; **exponentiating** turns that additive constant into a multiplicative one: $y=e^{C}e^{x^{2}/2}$.' },
    { t: '$y = \\dfrac{x^{2}y}{2}+C$', why: 'You integrated the right-hand side while treating $y$ as a constant. But $y$ is the unknown function — it must be moved to the left before integrating.' },
    { t: '$y = \\dfrac{x^{2}}{2}+C$', why: 'You dropped the $y$ entirely. Separating gives $\\frac{dy}{y}=x\\,dx$, and the left side integrates to $\\ln|y|$, not $y$.' },
  ],
  steps: [
    'Separate: $\\dfrac{dy}{y} = x\\,dx$ (all $y$ left, all $x$ right).',
    'Integrate both sides: $\\ln|y| = \\dfrac{x^{2}}{2}+C$.',
    'Exponentiate: $|y| = e^{C}e^{x^{2}/2}$.',
    'Absorb $\\pm e^{C}$ into a single constant: $y=Ce^{x^{2}/2}$.',
  ],
  recall: 'An additive constant inside a log becomes a **multiplicative** constant after exponentiating. This is where most separable-equation points are lost.',
  viz: {
    kind: 'slopefield', f: (x, y) => x * y, xrange: [-2.5, 2.5], yrange: [-3, 3],
    solutions: [{ x0: 0, y0: 1 }, { x0: 0, y0: -0.6, dash: '5 4' }],
    cap: 'Every solution curve is a vertical scaling of $e^{x^{2}/2}$. The family stretches, it does not shift — that is the multiplicative $C$.',
  },
});

P.push({
  id: 'd-logistic-limit', topic: 'Logistic Model', diff: 2,
  prompt: 'For $\\dfrac{dP}{dt}=0.4P\\left(1-\\dfrac{P}{800}\\right)$ with $P(0)=50$, what is $\\lim_{t\\to\\infty}P(t)$?',
  choices: [
    { t: '$800$', ok: true },
    { t: '$400$', why: 'That is $K/2$ — where the population **grows fastest** (the inflection point), not where it settles. Growth is fastest halfway up, then slows toward the ceiling.' },
    { t: '$\\infty$', why: 'The factor $\\left(1-\\frac{P}{800}\\right)$ shrinks to $0$ as $P\\to800$, which shuts growth off. Only pure exponential growth ($\\frac{dP}{dt}=kP$) runs away.' },
    { t: '$50$', why: 'That is the initial value. Since $\\frac{dP}{dt}>0$ at $P=50$, the population increases from there.' },
  ],
  steps: [
    'Compare with the standard form $\\frac{dP}{dt}=kP\\left(1-\\frac PK\\right)$: here $k=0.4$ and $K=800$.',
    'Equilibria are where $\\frac{dP}{dt}=0$: $P=0$ and $P=800$.',
    'For $0<P<800$ the derivative is positive, so $P$ increases toward $800$.',
    '$P=800$ is the stable equilibrium — the **carrying capacity**. $\\lim_{t\\to\\infty}P=800$.',
  ],
  recall: '$K$ = carrying capacity = the limit. $K/2$ = inflection point = fastest growth. Do not swap them.',
  viz: {
    kind: 'slopefield', f: (t, p) => 0.4 * p * (1 - p / 800), xrange: [0, 22], yrange: [0, 1000],
    nx: 16, ny: 10,
    solutions: [{ x0: 0, y0: 50 }, { x0: 0, y0: 980, dash: '5 4' }],
    cap: 'Solutions from below rise toward $800$; solutions from above fall toward it. The slope marks flatten out exactly at the carrying capacity.',
  },
});

P.push({
  id: 'd-euler-concept', topic: 'Slope Fields & Euler', diff: 2,
  prompt: 'Euler\'s method with step $h$ approximates the solution using which update?',
  choices: [
    { t: '$y_{n+1}=y_{n}+h\\,f(x_{n},y_{n})$', ok: true },
    { t: '$y_{n+1}=y_{n}+f(x_{n},y_{n})$', why: 'The step size $h$ is missing. You move along the tangent line for a horizontal distance $h$, so the rise is (slope)$\\times h$.' },
    { t: '$y_{n+1}=y_{n}+h\\,f(x_{n+1},y_{n+1})$', why: 'That is the **backward** (implicit) Euler method — it requires solving for $y_{n+1}$, which is not what the standard method does.' },
    { t: '$y_{n+1}=h\\,f(x_{n},y_{n})$', why: 'You dropped $y_n$. Each step **adds** to the current value; it does not replace it.' },
  ],
  steps: [
    'The differential equation gives you the slope at any point: $y\'=f(x,y)$.',
    'From $(x_n,y_n)$, follow the tangent line for a horizontal run of $h$.',
    'Rise $=$ slope $\\times$ run $= f(x_n,y_n)\\cdot h$.',
    '$y_{n+1}=y_n+h\\,f(x_n,y_n)$, and $x_{n+1}=x_n+h$.',
  ],
  recall: 'Euler = repeatedly walking along tangent lines. Smaller $h$ → smaller error (roughly proportional to $h$).',
  viz: {
    kind: 'slopefield', f: (x, y) => x + y, xrange: [0, 2.2], yrange: [0, 5],
    solutions: [{ x0: 0, y0: 1 }],
    cap: 'The curve is the true solution; Euler approximates it by hopping along the little slope marks. Where the field curves sharply, the hops drift below the truth.',
  },
});

P.push({
  id: 'd-linear-mu', topic: 'First-Order Linear', diff: 2,
  prompt: 'For $y\'+\\dfrac{2}{x}y = x^{3}$, what is the integrating factor?',
  choices: [
    { t: '$\\mu = x^{2}$', ok: true },
    { t: '$\\mu = e^{2/x}$', why: 'You exponentiated $P(x)$ itself instead of its **integral**. $\\mu = e^{\\int P\\,dx}$, and $\\int\\frac2x dx = 2\\ln x$, not $\\frac2x$.' },
    { t: '$\\mu = e^{x^{3}}$', why: 'You used $Q(x)$, the right-hand side. The integrating factor is built only from the coefficient of $y$.' },
    { t: '$\\mu = 2\\ln x$', why: 'You stopped after integrating. You still have to exponentiate: $e^{2\\ln x}=x^{2}$.' },
  ],
  steps: [
    'The equation is already in standard form $y\'+P(x)y=Q(x)$ with $P=\\frac2x$.',
    '$\\displaystyle\\int P\\,dx = \\int\\frac{2}{x}dx = 2\\ln|x|$',
    '$\\mu = e^{2\\ln|x|} = e^{\\ln x^{2}} = x^{2}$',
    'Then $\\left(x^{2}y\\right)\' = x^{2}\\cdot x^{3}=x^{5}$, so $x^{2}y = \\frac{x^{6}}{6}+C$ and $y=\\frac{x^{4}}{6}+Cx^{-2}$.',
  ],
  recall: '$\\mu = e^{\\int P\\,dx}$ — integrate first, **then** exponentiate. Simplify $e^{\\ln(\\cdot)}$ immediately.',
});

P.push({
  id: 'd-check-solution', topic: 'Separable Equations', diff: 1,
  prompt: 'Which function satisfies $y\'=-2y$ with $y(0)=5$?',
  choices: [
    { t: '$y=5e^{-2x}$', ok: true },
    { t: '$y=5e^{2x}$', why: 'Sign. This one **grows**; check it: $y\'=10e^{2x}=+2y$, not $-2y$. A negative rate constant means decay.' },
    { t: '$y=-2x+5$', why: 'That solves $y\'=-2$ (a constant rate), not $y\'=-2y$ (a rate proportional to the current amount).' },
    { t: '$y=5e^{-2}$', why: 'That is a constant — its derivative is $0$, not $-2y$. The variable $x$ has to appear in the exponent.' },
  ],
  steps: [
    '$y\'=ky$ always has solution $y=Ce^{kx}$; here $k=-2$.',
    'Apply $y(0)=5$: $Ce^{0}=C=5$.',
    '$y=5e^{-2x}$.',
    'Verify: $y\'=-10e^{-2x}$ and $-2y=-10e^{-2x}$. ✓',
  ],
  recall: 'You can always **check** a differential-equation answer by substituting it back. Do this on exams — it is faster than re-deriving.',
  viz: {
    kind: 'plot', xmin: 0, xmax: 2.5, ymin: 0, ymax: 6,
    curves: [
      { f: x => 5 * Math.exp(-2 * x), color: 'var(--lime)', label: '5e^(−2x)' },
      { f: x => 5 * Math.exp(-x) * 0 + 5 - 2 * x, color: 'var(--coral)', label: '−2x + 5', dash: '5 3' },
    ],
    cap: 'Both start at $5$, but exponential decay bends and approaches zero asymptotically; the line crosses straight through it. Proportional decay never reaches zero.',
  },
});

P.push({
  id: 'd-equilibrium', topic: 'Logistic Model', diff: 3,
  prompt: 'For $\\dfrac{dy}{dt}=y(y-3)$, classify the equilibrium at $y=3$.',
  choices: [
    { t: 'Unstable — solutions move away from it', ok: true },
    { t: 'Stable — solutions approach it', why: 'Check the sign of $y\'$ on each side. For $y>3$ both factors are positive so $y\'>0$ (moving **up**, away). For $0<y<3$, $y\'<0$ (moving **down**, away). Both directions flee.' },
    { t: 'Semi-stable', why: 'Semi-stable means attracting from one side and repelling from the other. Here both sides repel.' },
    { t: 'Not an equilibrium', why: 'It is: substituting $y=3$ gives $y\'=3(0)=0$, so the constant function $y=3$ is a solution.' },
  ],
  steps: [
    'Equilibria: $y(y-3)=0\\Rightarrow y=0$ and $y=3$.',
    'Sign chart for $y\'=y(y-3)$:',
    '$y>3$: $(+)(+)=+$ → increasing, moving away from $3$. $\\;0<y<3$: $(+)(-)=-$ → decreasing, also moving away from $3$.',
    'Both sides flee $y=3$, so it is **unstable**. (At $y=0$: for $y<0$, $(-)(-)=+$ → increasing toward $0$; for $0<y<3$ decreasing toward $0$ — so $y=0$ is stable.)',
  ],
  recall: 'Build a sign chart for $y\'$. Arrows pointing **toward** a value = stable; **away** = unstable.',
  viz: {
    kind: 'slopefield', f: (t, y) => y * (y - 3), xrange: [0, 4], yrange: [-1.2, 4.6],
    nx: 14, ny: 12,
    solutions: [{ x0: 0, y0: 3.25 }, { x0: 0, y0: 2.7, dash: '5 4' }],
    cap: 'Two solutions starting a hair either side of $y=3$ separate immediately — one shoots up, one falls to $0$. That divergence is what "unstable" means.',
  },
});

// =================================================================
// GENERATORS
// =================================================================

G.push({
  id: 'g-d-expgrowth', topic: 'Growth & Decay', diff: 2,
  make(r) {
    const A = r.pick([100, 200, 500, 40]);
    const half = r.pick([3, 5, 8, 10]);
    const n = r.int(2, 3);                 // whole number of half-lives elapsed
    const t = half * n;
    const left = A / 2 ** n;
    const rd = v => Math.round(v * 1000) / 1000;
    const key = `$${rd(left)}$ g`;
    return {
      prompt: `A radioactive sample has mass $${A}$ g and a half-life of $${half}$ years. How much remains after $${t}$ years?`,
      choices: [
        { t: key, ok: true },
        ...choose(key, [
          { t: `$${rd(A / 2)}$ g`, why: `That is the amount after a **single** half-life. $${t}$ years is $${n}$ half-lives, so you halve it $${n}$ times: $\\frac{${A}}{2^{${n}}}$.` },
          { t: `$${rd(A - left)}$ g`, why: 'That is the amount that **decayed away**, not the amount remaining. The question asks what is left.' },
          { t: `$${rd(A / n)}$ g`, why: `You divided by the number of half-lives. Halving $${n}$ times divides by $2^{${n}}=${2 ** n}$, not by $${n}$.` },
          { t: `$${rd(A / 2 ** (n + 1))}$ g`, why: `You counted one half-life too many. $\\frac{${t}}{${half}} = ${n}$, so the factor is $2^{-${n}}$.` },
          { t: `$${rd(A / 2 ** (n - 1))}$ g`, why: `You counted one half-life too few. $\\frac{${t}}{${half}} = ${n}$ half-lives have elapsed.` },
        ]),
      ],
      steps: [
        `Exponential decay: $m(t)=${A}\\left(\\frac12\\right)^{t/${half}}$.`,
        `Number of half-lives elapsed: $\\dfrac{${t}}{${half}} = ${n}$.`,
        `$m = ${A}\\left(\\frac12\\right)^{${n}} = \\dfrac{${A}}{${2 ** n}} = ${rd(left)}$ g`,
        `(Equivalently $m=${A}e^{-kt}$ with $k=\\frac{\\ln 2}{${half}}$.)`,
      ],
      recall: 'Each half-life multiplies by $\\frac12$. After $n$ half-lives the factor is $2^{-n}$ — exponential, never linear.',
      viz: {
        kind: 'plot', xmin: 0, xmax: half * 4, ymin: 0, ymax: A * 1.15,
        curves: [{ f: x => A * Math.pow(0.5, x / half), color: 'var(--cyan)', label: 'mass(t)' }],
        points: [{ x: t, y: left, color: 'var(--lime)', label: `${rd(left)} g` }],
        vlines: [{ x: half, label: '1 half-life' }],
        cap: 'Equal time steps multiply the mass by the same factor. The curve flattens but never touches zero.',
      },
    };
  },
});

G.push({
  id: 'g-d-euler', topic: 'Slope Fields & Euler', diff: 2,
  make(r) {
    const h = r.pick([0.1, 0.2, 0.5]);
    const y0 = r.int(1, 3);
    // every family must have a NONZERO slope at (0,y0), otherwise several
    // distractors collapse onto the same value
    const kind = r.pick(['xy1', 'xplusy', 'ysq']);
    const F = { xy1: (x, y) => x * y + 1, xplusy: (x, y) => x + y, ysq: (x, y) => y * y }[kind];
    const tex = { xy1: 'xy+1', xplusy: 'x+y', ysq: 'y^{2}' }[kind];
    const s1 = y0 + h * F(0, y0);
    const s2 = s1 + h * F(h, s1);
    const rd = v => Math.round(v * 100000) / 100000;
    const key = `$${rd(s2)}$`;
    return {
      prompt: `Use Euler's method with $h=${h}$ on $y'=${tex}$, $y(0)=${y0}$. Estimate $y(${rd(2 * h)})$ (two steps).`,
      choices: [
        { t: key, ok: true },
        ...choose(key, [
          { t: `$${rd(s1)}$`, why: `That is the value after **one** step. You need two steps to reach $x=${rd(2 * h)}$.` },
          { t: `$${rd(y0 + 2 * h * F(0, y0))}$`, why: 'You reused the slope from the starting point for both steps. The slope must be **recomputed** at each new point — that is the entire method.' },
          { t: `$${rd(y0 + F(0, y0) + F(h, s1))}$`, why: `You added the slopes without multiplying by $h=${h}$. Each step contributes (slope)$\\times h$.` },
          { t: `$${rd(s1 + h * F(2 * h, s1))}$`, why: `You evaluated the second slope at the wrong point. Step 2 starts from $(${h},${rd(s1)})$ — the $x$ you have *reached*, not the one you are heading for.` },
          { t: `$${rd(y0 + h * F(h, y0))}$`, why: 'You advanced $x$ before computing the first slope. Step 1 uses the slope at the **initial** point.' },
        ]),
      ],
      steps: [
        `Step 1 from $(0,${y0})$: slope $=${tex}\\big|_{(0,${y0})} = ${rd(F(0, y0))}$.`,
        `$y_1 = ${y0} + ${h}(${rd(F(0, y0))}) = ${rd(s1)}$ at $x_1=${h}$.`,
        `Step 2 from $(${h},${rd(s1)})$: slope $= ${rd(F(h, s1))}$.`,
        `$y_2 = ${rd(s1)} + ${h}(${rd(F(h, s1))}) = ${rd(s2)}$`,
      ],
      recall: 'Recompute the slope at every new point. Reusing the first slope turns Euler into a single straight line.',
      viz: {
        kind: 'slopefield', f: F, xrange: [0, Math.max(1, 6 * h)], yrange: [0, Math.max(4, y0 * 3)],
        solutions: [{ x0: 0, y0 }],
        cap: 'Euler walks along these slope marks. The true solution (drawn) curves away from any single tangent line — which is why each step needs a fresh slope.',
      },
    };
  },
});

G.push({
  id: 'g-d-separable', topic: 'Separable Equations', diff: 2,
  make(r) {
    const kind = r.pick(['ky', 'xovery', 'ysq']);
    if (kind === 'ky') {
      const k = r.nz(2, 4), A = r.int(2, 6);
      return {
        prompt: `Solve $\\dfrac{dy}{dt}=${k}y$ with $y(0)=${A}$.`,
        choices: [
          { t: `$y=${A}e^{${k}t}$`, ok: true },
          { t: `$y=${A}e^{${-k}t}$`, why: `Sign of the exponent. The equation says the rate is $${k > 0 ? '+' : ''}${k}$ times $y$, so the exponent carries the same sign.` },
          { t: `$y=${k}t+${A}$`, why: 'That solves $y\'=' + k + '$ — a constant rate. Here the rate is **proportional to $y$**, which forces an exponential.' },
          { t: `$y=e^{${k}t}+${A}$`, why: `The initial condition scales the exponential, it does not shift it. At $t=0$ this gives $1+${A}$, not $${A}$.` },
        ],
        steps: [
          `Separate: $\\dfrac{dy}{y}=${k}\\,dt$.`,
          `Integrate: $\\ln|y| = ${k}t + C$.`,
          `Exponentiate: $y = Ce^{${k}t}$.`,
          `$y(0)=${A}$ gives $C=${A}$, so $y=${A}e^{${k}t}$.`,
        ],
        recall: '$y\'=ky \\Rightarrow y=y_0e^{kt}$. Recognize this instantly — it is the most common ODE in the course.',
      };
    }
    if (kind === 'xovery') {
      const c = r.int(2, 4);   // c>1 so that c² and c differ in the distractor
      return {
        prompt: `Solve $\\dfrac{dy}{dx}=\\dfrac{x}{y}$ with $y(0)=${c}$.`,
        choices: [
          { t: `$y=\\sqrt{x^{2}+${c * c}}$`, ok: true },
          { t: `$y=\\sqrt{x^{2}}+${c}$`, why: 'You took the square root term by term. $\\sqrt{a+b}\\ne\\sqrt a+\\sqrt b$ — the constant lives **inside** the radical.' },
          { t: `$y=\\dfrac{x^{2}}{2}+${c}$`, why: 'You integrated the right side but never moved the $y$ over. Separating gives $y\\,dy = x\\,dx$, so the left side integrates to $\\frac{y^{2}}{2}$.' },
          { t: `$y=\\sqrt{x^{2}+${c}}$`, why: `The constant must satisfy $y(0)=${c}$: $\\frac{${c}^{2}}{2}=0+C$ gives $C=\\frac{${c * c}}{2}$, so under the radical you get $${c * c}$, not $${c}$.` },
        ],
        steps: [
          `Separate: $y\\,dy = x\\,dx$.`,
          `Integrate: $\\dfrac{y^{2}}{2}=\\dfrac{x^{2}}{2}+C$, i.e. $y^{2}=x^{2}+C'$.`,
          `Apply $y(0)=${c}$: $${c * c} = 0 + C'$, so $C'=${c * c}$.`,
          `$y=\\sqrt{x^{2}+${c * c}}$ (positive root, to match $y(0)=${c}>0$).`,
        ],
        recall: 'Cross-multiply to separate, integrate both sides, **then** apply the initial condition to pin down $C$.',
        viz: {
          kind: 'slopefield', f: (x, y) => x / y, xrange: [-3, 3], yrange: [0.2, 5],
          solutions: [{ x0: 0, y0: c }],
          cap: 'The solution curves are the upper halves of hyperbolas $y^{2}-x^{2}=C$. The initial height fixes which one you are on.',
        },
      };
    }
    const A = r.int(1, 4);
    return {
      prompt: `Solve $\\dfrac{dy}{dx}=y^{2}$ with $y(0)=${A}$.`,
      choices: [
        { t: `$y=\\dfrac{1}{${frac(1, A)}-x}$`, ok: true },
        { t: `$y=\\dfrac{x^{3}}{3}+${A}$`, why: 'You integrated the right-hand side in $x$, treating $y$ as if it were $x$. The unknown must be separated first.' },
        { t: `$y=-\\dfrac{1}{x}+${A}$`, why: 'You integrated $\\frac{dy}{y^{2}}$ to $-\\frac1y$ correctly but then solved for $y$ incorrectly — you cannot invert term by term.' },
        { t: `$y=${A}e^{x}$`, why: 'That solves $y\'=y$, not $y\'=y^{2}$. The squared term produces a solution that blows up in **finite** time, not an exponential.' },
      ],
      steps: [
        `Separate: $\\dfrac{dy}{y^{2}}=dx$.`,
        `Integrate: $-\\dfrac1y = x + C$.`,
        `$y(0)=${A}$: $-${frac(1, A)} = C$.`,
        `So $-\\frac1y = x-${frac(1, A)}$, giving $y=\\dfrac{1}{${frac(1, A)}-x}$ — note it blows up at $x=${frac(1, A)}$.`,
      ],
      recall: 'Nonlinear equations can blow up in finite time. Always check where the denominator of your answer vanishes.',
    };
  },
});

G.push({
  id: 'g-d-logistic', topic: 'Logistic Model', diff: 2,
  make(r) {
    const K = r.pick([100, 500, 800, 1200, 2000]);
    const k = r.pick([0.2, 0.3, 0.5]);
    const ask = r.pick(['cap', 'inflect', 'rate']);
    if (ask === 'cap') {
      return {
        prompt: `A population satisfies $\\dfrac{dP}{dt}=${k}P\\left(1-\\dfrac{P}{${K}}\\right)$. What is the carrying capacity?`,
        choices: [
          { t: `$${K}$`, ok: true },
          { t: `$${K / 2}$`, why: 'That is where growth is **fastest**, not where it stops. The population keeps rising past $K/2$, just more slowly.' },
          { t: `$${k}$`, why: 'That is the intrinsic growth rate $k$, which controls how *quickly* the population approaches the ceiling, not the ceiling itself.' },
          { t: `$${K * 2}$`, why: 'Read the standard form $\\frac{dP}{dt}=kP(1-\\frac PK)$ directly: $K$ is the number in the denominator.' },
        ],
        steps: [
          `Standard logistic form: $\\frac{dP}{dt}=kP\\left(1-\\frac{P}{K}\\right)$.`,
          `Matching: $k=${k}$, $K=${K}$.`,
          `Growth stops when the bracket is $0$, i.e. $P=${K}$.`,
          `That equilibrium is stable, so $P\\to${K}$ for any positive start.`,
        ],
        recall: 'Read $K$ straight off the denominator inside the parentheses.',
      };
    }
    if (ask === 'inflect') {
      return {
        prompt: `For $\\dfrac{dP}{dt}=${k}P\\left(1-\\dfrac{P}{${K}}\\right)$, at what population is the growth **rate** largest?`,
        choices: [
          { t: `$P=${K / 2}$`, ok: true },
          ...choose(`$P=${K / 2}$`, [
            { t: `$P=${K}$`, why: 'At the carrying capacity the growth rate is exactly **zero** — that is the slowest, not the fastest.' },
            { t: `$P=0$`, why: 'At $P=0$ the rate is also zero. With nobody around, nothing reproduces.' },
            { t: `$P=${Math.round(K * k)}$`, why: 'Mixing the rate constant into a population value. The maximizer depends only on $K$.' },
            { t: `$P=${K / 4}$`, why: 'The parabola $kP(1-P/K)$ peaks midway between its roots $0$ and $K$ — that is $K/2$, not $K/4$.' },
            { t: `$P=${K * 2}$`, why: 'Beyond the carrying capacity the growth rate is **negative** — the population shrinks there.' },
          ]),
        ],
        steps: [
          `The growth rate as a function of $P$ is $g(P)=${k}P\\left(1-\\frac{P}{${K}}\\right)$ — a downward parabola in $P$.`,
          `Its roots are $P=0$ and $P=${K}$.`,
          `A parabola peaks halfway between its roots: $P=\\dfrac{0+${K}}{2}=${K / 2}$.`,
          `This is the inflection point of the $P$ vs $t$ curve — the S-curve's steepest moment.`,
        ],
        recall: 'Logistic growth is fastest at half the carrying capacity. The $P(t)$ curve is S-shaped, and $K/2$ is where it changes concavity.',
        viz: {
          kind: 'plot', xmin: 0, xmax: K * 1.1, ymin: 0, ymax: k * K / 4 * 1.25,
          curves: [{ f: p => k * p * (1 - p / K), color: 'var(--cyan)', label: 'dP/dt' }],
          vlines: [{ x: K / 2, label: `P = ${K / 2}` }],
          xlabel: 'P',
          cap: 'This plots the growth **rate** against the population. It peaks at $K/2$ and returns to zero at $K$.',
        },
      };
    }
    const P0 = Math.round(K / 4);
    const rate = Math.round(k * P0 * (1 - P0 / K) * 1000) / 1000;
    return {
      prompt: `For $\\dfrac{dP}{dt}=${k}P\\left(1-\\dfrac{P}{${K}}\\right)$, find the growth rate when $P=${P0}$.`,
      choices: [
        { t: `$${rate}$`, ok: true },
        { t: `$${Math.round(k * P0 * 1000) / 1000}$`, why: 'You used pure exponential growth $kP$ and ignored the limiting factor $\\left(1-\\frac PK\\right)$, which here equals $0.75$.' },
        { t: `$${Math.round(k * K * (1 - P0 / K) * 1000) / 1000}$`, why: `You substituted $K$ where $P$ belongs in the first factor. Both $P$'s are the current population $${P0}$.` },
        { t: `$${Math.round(k * P0 * (P0 / K) * 1000) / 1000}$`, why: 'You used $\\frac PK$ instead of $1-\\frac PK$. The bracket measures the *remaining room*, not the fraction used.' },
      ],
      steps: [
        `Substitute $P=${P0}$: $\\dfrac{dP}{dt}=${k}(${P0})\\left(1-\\dfrac{${P0}}{${K}}\\right)$.`,
        `$1-\\dfrac{${P0}}{${K}} = ${Math.round((1 - P0 / K) * 1000) / 1000}$`,
        `$\\dfrac{dP}{dt} = ${k}\\cdot${P0}\\cdot${Math.round((1 - P0 / K) * 1000) / 1000} = ${rate}$`,
      ],
      recall: 'The bracket $\\left(1-\\frac PK\\right)$ is the fraction of capacity still **available**. Near $0$ it throttles growth to nothing.',
    };
  },
});

G.push({
  id: 'g-d-linear', topic: 'First-Order Linear', diff: 3,
  make(r) {
    const a = r.int(2, 5);   // a>1 so the factor never prints as e^{1x}
    return {
      prompt: `Find the integrating factor for $y' + ${a}y = e^{x}$.`,
      choices: [
        { t: `$\\mu = e^{${a}x}$`, ok: true },
        { t: `$\\mu = e^{x}$`, why: 'You used the right-hand side $Q(x)=e^{x}$. The integrating factor depends only on $P(x)$, the coefficient of $y$.' },
        { t: `$\\mu = ${a}x$`, why: 'You integrated $P$ but forgot to exponentiate. $\\mu = e^{\\int P\\,dx}$.' },
        { t: `$\\mu = e^{${a}x^{2}/2}$`, why: `You integrated as though $P=${a}x$. Here $P=${a}$ is a **constant**, so $\\int P\\,dx = ${a}x$.` },
      ],
      steps: [
        `Standard form $y'+P(x)y=Q(x)$ with $P=${a}$, $Q=e^{x}$.`,
        `$\\displaystyle\\int P\\,dx = ${a}x$`,
        `$\\mu = e^{${a}x}$`,
        `Multiplying through makes the left side an exact derivative: $\\left(e^{${a}x}y\\right)' = e^{${a}x}\\cdot e^{x} = e^{${a + 1}x}$.`,
      ],
      recall: 'The whole point of $\\mu$: it makes the left side collapse into $(\\mu y)\'$, so you can just integrate once.',
    };
  },
});

export const diffeq = { unit: 'diffeq', problems: P, generators: G };
