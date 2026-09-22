// ---------------------------------------------------------------
// bank/techniques.js — Unit 01: Techniques of Integration
// ---------------------------------------------------------------
import { frac, coef, lin, choose } from '../util.js';

const P = [];
const G = [];

// =================================================================
// STATIC
// =================================================================

P.push({
  id: 't-parts-lnx', topic: 'Integration by Parts', diff: 2,
  prompt: 'Evaluate $\\displaystyle\\int \\ln x\\,dx$.',
  choices: [
    { t: '$x\\ln x - x + C$', ok: true },
    { t: '$\\dfrac{1}{x}+C$', why: 'You differentiated instead of integrating. $\\frac1x$ is $\\frac{d}{dx}\\ln x$.' },
    { t: '$\\dfrac{(\\ln x)^{2}}{2}+C$', why: 'You treated $\\ln x$ like a power and applied the power rule. That only works if $dx$ were $\\frac{dx}{x}$ — there is no $\\frac1x$ here to serve as $du$.' },
    { t: '$x\\ln x + C$', why: 'You found $uv$ but never subtracted $\\int v\\,du = \\int 1\\,dx = x$. Differentiate your answer: you get $\\ln x + 1$, one too many.' },
  ],
  steps: [
    'There is only one function, so take $u=\\ln x$ and $dv=dx$ — the classic trick.',
    '$du = \\frac{1}{x}dx$, $v = x$.',
    '$\\displaystyle\\int \\ln x\\,dx = x\\ln x - \\int x\\cdot\\frac{1}{x}dx = x\\ln x - \\int 1\\,dx$',
    '$= x\\ln x - x + C$. Check: $\\ln x + x\\cdot\\frac1x - 1 = \\ln x$. ✓',
  ],
  recall: 'When the integrand is a lone logarithm or inverse trig function, let it be $u$ and let $dv = dx$.',
});

P.push({
  id: 't-sin2', topic: 'Trigonometric Integrals', diff: 2,
  prompt: 'Evaluate $\\displaystyle\\int \\sin^{2}x\\,dx$.',
  choices: [
    { t: '$\\dfrac{x}{2}-\\dfrac{\\sin 2x}{4}+C$', ok: true },
    { t: '$\\dfrac{\\sin^{3}x}{3}+C$', why: 'Power rule applied to a trig function. That requires $du=\\cos x\\,dx$ sitting in the integrand — there is no $\\cos x$ here.' },
    { t: '$-\\dfrac{\\cos^{3}x}{3}+C$', why: 'You substituted as though the integrand were $\\sin^{2}x\\cdot\\sin x$. The exponent is even, so no factor can be peeled off for $du$.' },
    { t: '$\\dfrac{x}{2}+\\dfrac{\\sin 2x}{4}+C$', why: 'That is $\\int\\cos^{2}x\\,dx$. The half-angle identity for **sine** carries a minus: $\\sin^2x = \\frac{1-\\cos 2x}{2}$.' },
  ],
  steps: [
    'Even powers of sine and cosine need the half-angle identity, not substitution.',
    '$\\sin^{2}x = \\dfrac{1-\\cos 2x}{2}$',
    '$\\displaystyle\\int\\frac{1-\\cos 2x}{2}dx = \\frac{x}{2}-\\frac{1}{2}\\cdot\\frac{\\sin 2x}{2}+C$',
    '$= \\dfrac{x}{2}-\\dfrac{\\sin 2x}{4}+C$',
  ],
  recall: 'Odd power → peel one off and substitute. Even powers only → half-angle identities.',
  viz: {
    kind: 'plot', xmin: 0, xmax: 6.3, ymin: -0.3, ymax: 3.4,
    curves: [
      { f: x => Math.sin(x) ** 2, color: 'var(--cyan)', label: 'sin²x' },
      { f: x => x / 2 - Math.sin(2 * x) / 4, color: 'var(--lime)', label: 'antiderivative' },
    ],
    cap: '$\\sin^{2}x\\ge0$ always, so its antiderivative must be **increasing everywhere** — the green curve is. Any answer like $\\frac{\\sin^3x}{3}$ would wiggle up and down, which is impossible.',
  },
});

P.push({
  id: 't-tanx', topic: 'Trigonometric Integrals', diff: 1,
  prompt: 'Evaluate $\\displaystyle\\int \\tan x\\,dx$.',
  choices: [
    { t: '$-\\ln|\\cos x| + C$', ok: true },
    { t: '$\\ln|\\cos x| + C$', why: 'Sign. With $u=\\cos x$, $du=-\\sin x\\,dx$, so the integral is $-\\int\\frac{du}{u}$ — that minus survives.' },
    { t: '$\\sec^{2}x + C$', why: 'You differentiated. $\\sec^{2}x$ is the *derivative* of $\\tan x$.' },
    { t: '$\\dfrac{\\tan^{2}x}{2}+C$', why: 'Power rule on a trig function without a matching $du$. There is no $\\sec^{2}x\\,dx$ in the integrand.' },
  ],
  steps: [
    'Rewrite: $\\tan x = \\dfrac{\\sin x}{\\cos x}$.',
    'Let $u=\\cos x$, so $du = -\\sin x\\,dx$, i.e. $\\sin x\\,dx = -du$.',
    '$\\displaystyle\\int\\frac{\\sin x}{\\cos x}dx = -\\int\\frac{du}{u} = -\\ln|u|+C$',
    '$= -\\ln|\\cos x|+C = \\ln|\\sec x|+C$ (both forms are correct).',
  ],
  recall: 'Rewriting in terms of $\\sin$ and $\\cos$ is almost always the first move on a stuck trig integral.',
});

P.push({
  id: 't-trigsub-pick', topic: 'Trigonometric Substitution', diff: 2,
  prompt: 'Which substitution should you use for $\\displaystyle\\int \\frac{dx}{x^{2}\\sqrt{x^{2}+9}}$?',
  choices: [
    { t: '$x = 3\\tan\\theta$', ok: true },
    { t: '$x = 3\\sin\\theta$', why: 'Sine handles $a^{2}-x^{2}$ (a difference). Here the radical contains a **sum**, so $1+\\tan^2 = \\sec^2$ is the identity that cleans it up.' },
    { t: '$x = 3\\sec\\theta$', why: 'Secant handles $x^{2}-a^{2}$, where the $x^2$ comes first and the constant is subtracted. Here the constant is added.' },
    { t: '$u = x^{2}+9$', why: 'A plain $u$-substitution needs $du = 2x\\,dx$ available. There is an $x^{2}$ in the *denominator*, not an $x$ in the numerator, so nothing matches $du$.' },
  ],
  steps: [
    'Identify the pattern inside the radical: $x^{2}+a^{2}$ with $a=3$.',
    'Use $x=a\\tan\\theta$: then $x^{2}+9 = 9\\tan^{2}\\theta+9 = 9\\sec^{2}\\theta$.',
    '$\\sqrt{x^{2}+9} = 3|\\sec\\theta|$ — the radical disappears cleanly.',
    'Also $dx = 3\\sec^{2}\\theta\\,d\\theta$.',
  ],
  recall: '$a^2-x^2\\to a\\sin\\theta$ · $a^2+x^2\\to a\\tan\\theta$ · $x^2-a^2\\to a\\sec\\theta$. The identity you need tells you which.',
  viz: {
    kind: 'triangle', adj: '3', opp: 'x', hyp: '√(x²+9)', angle: 'θ',
    notes: ['x = 3 tan θ   ⇒   tan θ = x/3', '√(x² + 9) = 3 sec θ'],
    cap: 'Build this triangle immediately — it is how you convert the answer back from $\\theta$ to $x$ at the end.',
  },
});

P.push({
  id: 't-pf-form', topic: 'Partial Fractions', diff: 2,
  prompt: 'What is the correct partial-fraction form for $\\dfrac{5x+1}{(x-2)^{2}(x^{2}+4)}$?',
  choices: [
    { t: '$\\dfrac{A}{x-2}+\\dfrac{B}{(x-2)^{2}}+\\dfrac{Cx+D}{x^{2}+4}$', ok: true },
    { t: '$\\dfrac{A}{(x-2)^{2}}+\\dfrac{Bx+C}{x^{2}+4}$', why: 'A repeated linear factor needs **every** power: both $\\frac{A}{x-2}$ and $\\frac{B}{(x-2)^{2}}$. Skipping the first power leaves the system unsolvable.' },
    { t: '$\\dfrac{A}{x-2}+\\dfrac{B}{(x-2)^{2}}+\\dfrac{C}{x^{2}+4}$', why: 'An **irreducible quadratic** denominator needs a linear numerator $Cx+D$, not a constant. A constant is not general enough.' },
    { t: '$\\dfrac{A}{x-2}+\\dfrac{B}{x+2}+\\dfrac{C}{x^{2}+4}$', why: '$x^{2}+4$ does not factor over the reals — it has no real roots, so you cannot split it into $(x-2)(x+2)$. That factoring works for $x^{2}-4$.' },
  ],
  steps: [
    'Repeated linear factor $(x-2)^{2}$ contributes one term per power: $\\frac{A}{x-2}+\\frac{B}{(x-2)^{2}}$.',
    'Check whether $x^{2}+4$ factors: discriminant $0-16<0$, so it is irreducible.',
    'An irreducible quadratic gets a **linear** numerator: $\\frac{Cx+D}{x^{2}+4}$.',
    'Total: $\\dfrac{A}{x-2}+\\dfrac{B}{(x-2)^{2}}+\\dfrac{Cx+D}{x^{2}+4}$ — four unknowns for a degree-3 numerator over degree 4. Consistent.',
  ],
  recall: 'Count unknowns: they must equal the degree of the denominator. Here $4$ unknowns for a degree-$4$ denominator. ✓',
});

P.push({
  id: 't-improper-mid', topic: 'Improper Integrals', diff: 3,
  prompt: 'Evaluate $\\displaystyle\\int_{-1}^{1}\\frac{dx}{x^{2}}$.',
  choices: [
    { t: 'Divergent', ok: true },
    { t: '$-2$', why: 'This is the classic trap: applying FTC blindly gives $\\left[-\\frac1x\\right]_{-1}^{1} = -1-1=-2$. But a **negative** answer for a strictly positive integrand is impossible — that contradiction is your alarm bell. The antiderivative is not continuous across $x=0$, so FTC does not apply.' },
    { t: '$2$', why: 'You caught the sign problem but not the real issue. The integral is improper at $x=0$ and each half diverges to $+\\infty$.' },
    { t: '$0$', why: 'You cancelled the two halves by symmetry. Cancellation requires both halves to be finite; here each is $+\\infty$, and $\\infty-\\infty$ is meaningless (and both are $+\\infty$ anyway).' },
  ],
  steps: [
    'The integrand blows up at $x=0$, which is **inside** $[-1,1]$. This is an improper integral.',
    'Split it: $\\int_{-1}^{0}+\\int_{0}^{1}$, and test each with a limit.',
    '$\\displaystyle\\int_{t}^{1}\\frac{dx}{x^{2}} = \\left[-\\frac1x\\right]_t^1 = -1+\\frac1t \\to +\\infty$ as $t\\to0^{+}$.',
    'One divergent piece makes the whole integral divergent. **Answer: divergent.**',
  ],
  recall: 'Before using FTC, check the integrand is continuous on the *entire closed interval*. Interior singularities are easy to miss.',
  viz: {
    kind: 'improper', f: x => 1 / (x * x), a: -1, b: 1, xmin: -1, clip: 40,
    shadeFrom: -1, shadeTo: 1, vertical: 0, verticalLabel: 'x = 0',
    tag: 'area under 1/x² on [−1,1]',
    cap: 'The region is unbounded at $x=0$ and lies entirely **above** the axis. No positive region can have area $-2$.',
  },
});

P.push({
  id: 't-improper-endpoints', topic: 'Improper Integrals', diff: 3,
  prompt: 'Which of these converges?',
  choices: [
    { t: '$\\displaystyle\\int_{0}^{1}\\frac{dx}{\\sqrt{x}}$', ok: true },
    { t: '$\\displaystyle\\int_{1}^{\\infty}\\frac{dx}{\\sqrt{x}}$', why: 'At infinity the tail must decay **faster** than $\\frac1x$. Since $\\frac{1}{\\sqrt x}=x^{-1/2}$ with $p=\\frac12\\le1$, it decays too slowly and diverges.' },
    { t: '$\\displaystyle\\int_{0}^{1}\\frac{dx}{x^{2}}$', why: 'Near $0$ the singularity must be **milder** than $\\frac1x$. Here $p=2>1$, so it is too severe and diverges.' },
    { t: '$\\displaystyle\\int_{1}^{\\infty}\\frac{dx}{x}$', why: 'The borderline case $p=1$ diverges at infinity (it grows like $\\ln t$). $\\frac1x$ is exactly the dividing line, and the dividing line itself fails.' },
  ],
  steps: [
    'Two different $p$-tests, and they point **opposite ways**:',
    '**At $\\infty$:** $\\int_1^\\infty x^{-p}dx$ converges $\\iff p>1$ (needs fast decay).',
    '**At $0$:** $\\int_0^1 x^{-p}dx$ converges $\\iff p<1$ (needs a mild singularity).',
    'Here $\\int_0^1 x^{-1/2}dx$ has $p=\\frac12<1$ at the $0$ endpoint: convergent, and equal to $\\left[2\\sqrt x\\right]_0^1 = 2$.',
  ],
  recall: 'Same $p$, opposite verdicts depending on **where** the trouble is. At $\\infty$: $p>1$. At $0$: $p<1$.',
  viz: {
    kind: 'improper', f: x => 1 / Math.sqrt(x), a: 0.002, b: 1.6, xmin: 0, clip: 12,
    shadeFrom: 0.002, shadeTo: 1, vertical: 0, verticalLabel: 'x = 0',
    tag: '1/√x near 0: finite area',
    cap: 'The spike at $0$ is thin enough that its area converges to $2$. Raise the exponent to $1$ or beyond and the same picture has infinite area.',
  },
});

P.push({
  id: 't-strategy-choose', topic: 'Strategy for Integration', diff: 2,
  prompt: 'What is the fastest route for $\\displaystyle\\int \\frac{x}{x^{2}+1}\\,dx$?',
  choices: [
    { t: 'Substitute $u=x^{2}+1$', ok: true },
    { t: 'Partial fractions', why: '$x^{2}+1$ is irreducible over the reals, so partial fractions has nothing to split. It also would not help — the numerator already matches $du$.' },
    { t: 'Trig substitution $x=\\tan\\theta$', why: 'It technically works but is far slower, and you would end up back-substituting through a triangle for no reason. Always check for a plain $u$-sub first.' },
    { t: 'Integration by parts with $u=x$', why: 'Parts would leave you with $\\int \\frac{1}{2}\\ln(x^2+1)dx$ — strictly harder than what you started with.' },
  ],
  steps: [
    'Scan for $u$-substitution **first**, always. Look for a function and (a multiple of) its derivative.',
    'The derivative of $x^{2}+1$ is $2x$, and the numerator is $x$ — a match up to the constant $2$.',
    '$u=x^{2}+1$, $du=2x\\,dx$, so $x\\,dx = \\frac12 du$.',
    '$\\displaystyle\\int\\frac{x\\,dx}{x^{2}+1} = \\frac12\\int\\frac{du}{u} = \\frac12\\ln(x^{2}+1)+C$',
  ],
  recall: 'Strategy order: (1) simplify algebraically, (2) $u$-sub, (3) parts, (4) trig identity / trig sub, (5) partial fractions.',
});

P.push({
  id: 't-strategy-lookalike', topic: 'Strategy for Integration', diff: 3,
  prompt: 'These look almost identical. Which requires a **trigonometric substitution**?',
  choices: [
    { t: '$\\displaystyle\\int \\frac{dx}{\\sqrt{4-x^{2}}}\\cdot x^{2}$ — i.e. $\\displaystyle\\int\\frac{x^{2}}{\\sqrt{4-x^{2}}}dx$', ok: true },
    { t: '$\\displaystyle\\int \\frac{x}{\\sqrt{4-x^{2}}}dx$', why: 'This one is a $u$-substitution: $u=4-x^{2}$, $du=-2x\\,dx$, and there is exactly one $x$ on top to absorb. Answer: $-\\sqrt{4-x^{2}}+C$.' },
    { t: '$\\displaystyle\\int \\frac{dx}{\\sqrt{4-x^{2}}}$', why: 'This is a memorized template: $\\arcsin\\frac{x}{2}+C$. No substitution machinery needed.' },
    { t: '$\\displaystyle\\int \\frac{dx}{4-x^{2}}$', why: 'No radical, and $4-x^{2}=(2-x)(2+x)$ factors — this is a partial-fractions problem.' },
  ],
  steps: [
    'The $x^{2}$ in the numerator is the tell: it is an **even** power, so it cannot be absorbed into $du$.',
    'With $x=2\\sin\\theta$: $\\sqrt{4-x^{2}} = 2\\cos\\theta$ and $dx = 2\\cos\\theta\\,d\\theta$.',
    '$\\displaystyle\\int\\frac{4\\sin^{2}\\theta}{2\\cos\\theta}\\cdot2\\cos\\theta\\,d\\theta = 4\\int\\sin^{2}\\theta\\,d\\theta$',
    'Then half-angle: $= 2\\theta - \\sin2\\theta + C$, and convert back with a triangle.',
  ],
  recall: 'An **odd** power of $x$ next to a radical → $u$-sub. An **even** power → trig substitution.',
});

P.push({
  id: 't-simpson-exact', topic: 'Numerical Integration', diff: 3,
  prompt: 'Simpson\'s Rule gives the **exact** value of $\\int_a^b f(x)\\,dx$ for which functions?',
  choices: [
    { t: 'All polynomials of degree $\\le 3$', ok: true },
    { t: 'All polynomials of degree $\\le 2$', why: 'Close, but Simpson\'s Rule does better than its construction suggests. It is built from parabolas, yet the cubic error terms cancel by symmetry — it is exact through degree **3**. The error formula involves $f^{(4)}$, which vanishes for cubics.' },
    { t: 'All continuous functions', why: 'No numerical rule is exact for everything — otherwise integration would be solved. Simpson has error $\\propto\\frac{(b-a)^{5}}{180n^{4}}\\max|f^{(4)}|$.' },
    { t: 'Only linear functions', why: 'That is the **Trapezoid** Rule, which is exact for degree $\\le1$ since it connects points with straight lines.' },
  ],
  steps: [
    'The error bound for Simpson\'s Rule is $|E_S|\\le \\dfrac{K(b-a)^{5}}{180n^{4}}$ where $K\\ge|f^{(4)}(x)|$.',
    'If $f$ is a cubic, $f^{(4)}\\equiv 0$, so $K=0$ and the error is exactly zero.',
    'Compare Trapezoid: $|E_T|\\le\\frac{K(b-a)^{3}}{12n^{2}}$ with $K\\ge|f\'\'|$ — exact only for degree $\\le1$.',
    'Midpoint: also uses $f\'\'$, with error half the size of trapezoid and the opposite sign.',
  ],
  recall: 'Trapezoid & Midpoint see $f\'\'$ (exact for lines). Simpson sees $f^{(4)}$ (exact for cubics).',
  viz: {
    kind: 'riemann', f: x => 0.35 * x ** 3 - 1.4 * x ** 2 + 1.2 * x + 2.4, a: 0, b: 4, n: 4, kind2: 'trap',
    tag: 'trapezoids on a cubic — visibly wrong',
    cap: 'Trapezoids clearly miss the curvature of a cubic. Simpson fits parabolas through triples of points and nails cubics exactly.',
  },
});

P.push({
  id: 't-parts-twice', topic: 'Integration by Parts', diff: 3,
  prompt: 'For $\\displaystyle\\int e^{x}\\sin x\\,dx$, what happens after applying parts twice?',
  choices: [
    { t: 'The original integral reappears — solve for it algebraically', ok: true },
    { t: 'The integrand becomes a polynomial', why: 'Neither $e^{x}$ nor $\\sin x$ ever simplifies under differentiation — that is exactly why the cycle happens instead of terminating.' },
    { t: 'You must switch to trig substitution', why: 'There is no radical or quadratic form here. Trig substitution addresses a completely different structure.' },
    { t: 'The process never terminates, so the integral is unsolvable', why: 'The repetition is the *solution*, not a dead end. Getting $I$ back with a coefficient lets you solve for $I$ like an algebra problem.' },
  ],
  steps: [
    'Call the integral $I=\\int e^{x}\\sin x\\,dx$.',
    'Parts once ($u=\\sin x$, $dv=e^{x}dx$): $I = e^{x}\\sin x - \\int e^{x}\\cos x\\,dx$.',
    'Parts again on the new integral: $\\int e^{x}\\cos x\\,dx = e^{x}\\cos x + \\int e^{x}\\sin x\\,dx = e^{x}\\cos x + I$.',
    'Substitute back: $I = e^{x}\\sin x - e^{x}\\cos x - I \\Rightarrow 2I = e^{x}(\\sin x-\\cos x)$, so $I = \\frac{e^{x}(\\sin x-\\cos x)}{2}+C$.',
  ],
  recall: 'Cyclic parts: when the original integral returns, move it to the left side and divide. Keep $u$ and $dv$ **consistent** across both applications or everything collapses to $0=0$.',
});

P.push({
  id: 't-parts-choice', topic: 'Integration by Parts', diff: 1,
  prompt: 'In $\\displaystyle\\int x^{2}\\ln x\\,dx$, what should $u$ be?',
  choices: [
    { t: '$u=\\ln x$', ok: true },
    { t: '$u=x^{2}$', why: 'Then $dv=\\ln x\\,dx$ — but finding $v$ means integrating $\\ln x$, which is harder than the original problem. Never choose a $dv$ you cannot easily integrate.' },
    { t: '$u=x^{2}\\ln x$', why: 'That is the whole integrand, leaving $dv=dx$ and $\\int v\\,du$ worse than before.' },
    { t: '$u=x$', why: '$u$ must be one of the actual factors of the integrand. Splitting $x^2$ into $x\\cdot x$ and mixing pieces is not how parts works here.' },
  ],
  steps: [
    'LIATE priority for $u$: **L**og, **I**nverse trig, **A**lgebraic, **T**rig, **E**xponential.',
    '$\\ln x$ is a Log and $x^{2}$ is Algebraic, so $u=\\ln x$ wins.',
    '$du=\\frac{dx}{x}$, $dv=x^{2}dx$, $v=\\frac{x^{3}}{3}$.',
    '$\\displaystyle\\int x^{2}\\ln x\\,dx = \\frac{x^{3}}{3}\\ln x - \\int\\frac{x^{2}}{3}dx = \\frac{x^{3}}{3}\\ln x-\\frac{x^{3}}{9}+C$',
  ],
  recall: 'LIATE: whichever type comes **first** in the list becomes $u$. The real test is whether $du$ simplifies and $v$ is easy.',
});

// =================================================================
// GENERATORS
// =================================================================

G.push({
  id: 'g-t-parts', topic: 'Integration by Parts', diff: 2,
  make(r) {
    const kind = r.pick(['xexp', 'xsin', 'xlnx', 'x2exp']);
    const a = r.nz(2, 4);
    if (kind === 'xexp') {
      return {
        prompt: `Evaluate $\\displaystyle\\int x e^{${a}x}\\,dx$.`,
        choices: [
          { t: `$\\dfrac{x e^{${a}x}}{${a}}-\\dfrac{e^{${a}x}}{${a * a}}+C$`, ok: true },
          { t: `$\\dfrac{x e^{${a}x}}{${a}}+\\dfrac{e^{${a}x}}{${a * a}}+C$`, why: 'Sign error on the $-\\int v\\,du$ term. Parts *subtracts* the second integral.' },
          { t: `$\\dfrac{x^{2}}{2}\\cdot\\dfrac{e^{${a}x}}{${a}}+C$`, why: 'You integrated each factor separately. $\\int fg \\ne \\int f\\int g$ — that is never a rule.' },
          { t: `$x e^{${a}x}-\\dfrac{e^{${a}x}}{${a}}+C$`, why: `You forgot to divide by $${a}$ when integrating $dv=e^{${a}x}dx$: $v = \\frac{e^{${a}x}}{${a}}$, not $e^{${a}x}$.` },
        ],
        steps: [
          `LIATE: $u=x$ (Algebraic) beats $e^{${a}x}$ (Exponential).`,
          `$du = dx$, $dv = e^{${a}x}dx \\Rightarrow v = \\dfrac{e^{${a}x}}{${a}}$.`,
          `$uv-\\displaystyle\\int v\\,du = \\dfrac{xe^{${a}x}}{${a}} - \\int\\dfrac{e^{${a}x}}{${a}}dx$`,
          `$= \\dfrac{xe^{${a}x}}{${a}}-\\dfrac{e^{${a}x}}{${a * a}}+C$`,
        ],
        recall: 'Parts turns $x\\cdot(\\text{stuff})$ into $(\\text{stuff})$ by knocking the power of $x$ down by one.',
      };
    }
    if (kind === 'xsin') {
      return {
        prompt: `Evaluate $\\displaystyle\\int x\\sin(${a}x)\\,dx$.`,
        choices: [
          { t: `$-\\dfrac{x\\cos(${a}x)}{${a}}+\\dfrac{\\sin(${a}x)}{${a * a}}+C$`, ok: true },
          { t: `$\\dfrac{x\\cos(${a}x)}{${a}}-\\dfrac{\\sin(${a}x)}{${a * a}}+C$`, why: `Both signs flipped. $v=\\int\\sin(${a}x)dx = -\\frac{\\cos(${a}x)}{${a}}$ — that leading minus is easy to drop.` },
          { t: `$-\\dfrac{x\\cos(${a}x)}{${a}}-\\dfrac{\\sin(${a}x)}{${a * a}}+C$`, why: 'The second sign is wrong: $-\\int v\\,du = -\\int\\left(-\\frac{\\cos}{a}\\right)dx = +\\frac{\\sin}{a^{2}}$. Two minuses make a plus.' },
          { t: `$-\\dfrac{x^{2}\\cos(${a}x)}{2${a}}+C$`, why: 'You integrated both factors independently. Parts produces $uv-\\int v\\,du$, never a product of two antiderivatives.' },
        ],
        steps: [
          `$u=x$, $dv=\\sin(${a}x)dx$.`,
          `$du=dx$, $v = -\\dfrac{\\cos(${a}x)}{${a}}$.`,
          `$uv - \\displaystyle\\int v\\,du = -\\dfrac{x\\cos(${a}x)}{${a}} + \\dfrac{1}{${a}}\\int\\cos(${a}x)dx$`,
          `$= -\\dfrac{x\\cos(${a}x)}{${a}}+\\dfrac{\\sin(${a}x)}{${a * a}}+C$`,
        ],
        recall: 'Track the two minus signs separately: one from $v$, one from the parts formula.',
      };
    }
    if (kind === 'xlnx') {
      const n = r.int(1, 3);
      return {
        prompt: `Evaluate $\\displaystyle\\int x^{${n}}\\ln x\\,dx$.`,
        choices: [
          { t: `$\\dfrac{x^{${n + 1}}\\ln x}{${n + 1}}-\\dfrac{x^{${n + 1}}}{${(n + 1) ** 2}}+C$`, ok: true },
          { t: `$\\dfrac{x^{${n + 1}}\\ln x}{${n + 1}}+\\dfrac{x^{${n + 1}}}{${(n + 1) ** 2}}+C$`, why: 'Parts subtracts $\\int v\\,du$; this adds it.' },
          { t: `$\\dfrac{x^{${n + 1}}}{${n + 1}}\\cdot\\dfrac{1}{x}+C$`, why: 'You multiplied the two antiderivative/derivative pieces. The formula is $uv-\\int v\\,du$, not $v\\cdot du$.' },
          { t: `$\\dfrac{x^{${n + 1}}\\ln x}{${n + 1}}-\\dfrac{x^{${n + 1}}}{${n + 1}}+C$`, why: `The leftover integral is $\\int\\frac{x^{${n}}}{${n + 1}}dx = \\frac{x^{${n + 1}}}{${n + 1}\\cdot${n + 1}}$ — you divided by $${n + 1}$ only once instead of twice.` },
        ],
        steps: [
          `LIATE: $u=\\ln x$ (Log wins), $dv=x^{${n}}dx$.`,
          `$du=\\dfrac{dx}{x}$, $v=\\dfrac{x^{${n + 1}}}{${n + 1}}$.`,
          `$= \\dfrac{x^{${n + 1}}\\ln x}{${n + 1}} - \\displaystyle\\int \\dfrac{x^{${n + 1}}}{${n + 1}}\\cdot\\dfrac{dx}{x} = \\dfrac{x^{${n + 1}}\\ln x}{${n + 1}}-\\dfrac{1}{${n + 1}}\\int x^{${n}}dx$`,
          `$= \\dfrac{x^{${n + 1}}\\ln x}{${n + 1}}-\\dfrac{x^{${n + 1}}}{${(n + 1) ** 2}}+C$`,
        ],
        recall: 'The point of $u=\\ln x$: $du=\\frac{dx}{x}$ cancels a power of $x$, turning the leftover into a plain power rule.',
      };
    }
    return {
      prompt: `Evaluate $\\displaystyle\\int x^{2} e^{${a}x}\\,dx$.`,
      choices: [
        { t: `$e^{${a}x}\\left(\\dfrac{x^{2}}{${a}}-\\dfrac{2x}{${a * a}}+\\dfrac{2}{${a ** 3}}\\right)+C$`, ok: true },
        { t: `$e^{${a}x}\\left(\\dfrac{x^{2}}{${a}}-\\dfrac{2x}{${a * a}}-\\dfrac{2}{${a ** 3}}\\right)+C$`, why: 'Sign of the last term. Two applications of parts flip the sign twice: $-,+$. The final term is positive.' },
        { t: `$e^{${a}x}\\left(\\dfrac{x^{2}}{${a}}+\\dfrac{2x}{${a * a}}+\\dfrac{2}{${a ** 3}}\\right)+C$`, why: 'The middle term must be negative — the first application of parts subtracts.' },
        { t: `$\\dfrac{x^{3}}{3}\\cdot\\dfrac{e^{${a}x}}{${a}}+C$`, why: 'Integrating factors separately. Not a rule.' },
      ],
      steps: [
        `Parts once with $u=x^{2}$: $\\dfrac{x^{2}e^{${a}x}}{${a}} - \\dfrac{2}{${a}}\\displaystyle\\int xe^{${a}x}dx$.`,
        `Parts again on $\\int xe^{${a}x}dx = \\dfrac{xe^{${a}x}}{${a}}-\\dfrac{e^{${a}x}}{${a * a}}$.`,
        `Substitute: $\\dfrac{x^{2}e^{${a}x}}{${a}} - \\dfrac{2}{${a}}\\left(\\dfrac{xe^{${a}x}}{${a}}-\\dfrac{e^{${a}x}}{${a * a}}\\right)$`,
        `$= e^{${a}x}\\left(\\dfrac{x^{2}}{${a}}-\\dfrac{2x}{${a * a}}+\\dfrac{2}{${a ** 3}}\\right)+C$`,
      ],
      recall: 'Each round of parts drops the power by one. Degree $n$ needs $n$ applications, with alternating signs.',
    };
  },
});

G.push({
  id: 'g-t-trigint', topic: 'Trigonometric Integrals', diff: 2,
  make(r) {
    const kind = r.pick(['oddcos', 'oddsin', 'tansec']);
    if (kind === 'oddcos') {
      const m = r.pick([2, 3, 4]);
      return {
        prompt: `Evaluate $\\displaystyle\\int \\sin^{${m}}x\\,\\cos^{3}x\\,dx$.`,
        choices: [
          { t: `$\\dfrac{\\sin^{${m + 1}}x}{${m + 1}}-\\dfrac{\\sin^{${m + 3}}x}{${m + 3}}+C$`, ok: true },
          { t: `$\\dfrac{\\sin^{${m + 1}}x}{${m + 1}}+\\dfrac{\\sin^{${m + 3}}x}{${m + 3}}+C$`, why: 'Sign. After $\\cos^{2}x = 1-\\sin^{2}x$, the second piece enters with a **minus**.' },
          { t: `$\\dfrac{\\sin^{${m + 1}}x}{${m + 1}}\\cdot\\dfrac{\\cos^{4}x}{4}+C$`, why: 'You applied the power rule to each factor separately. Products of antiderivatives are never antiderivatives of products.' },
          { t: `$-\\dfrac{\\cos^{4}x}{4}\\sin^{${m}}x+C$`, why: `You substituted $u=\\cos x$, but then the leftover $\\sin^{${m}}x$ has an **even** power and cannot be converted — the substitution fails. Peel from the odd factor instead.` },
        ],
        steps: [
          `The **cosine** power is odd, so save one $\\cos x$ for $du$ and convert the rest.`,
          `$\\cos^{3}x = \\cos^{2}x\\cdot\\cos x = (1-\\sin^{2}x)\\cos x$`,
          `Let $u=\\sin x$, $du = \\cos x\\,dx$: $\\displaystyle\\int u^{${m}}(1-u^{2})du$`,
          `$= \\dfrac{u^{${m + 1}}}{${m + 1}}-\\dfrac{u^{${m + 3}}}{${m + 3}}+C = \\dfrac{\\sin^{${m + 1}}x}{${m + 1}}-\\dfrac{\\sin^{${m + 3}}x}{${m + 3}}+C$`,
        ],
        recall: 'Odd power → peel one factor off for $du$, convert the remaining **even** power with $\\sin^2+\\cos^2=1$.',
      };
    }
    if (kind === 'oddsin') {
      const n = r.pick([2, 3, 4]);
      return {
        prompt: `Evaluate $\\displaystyle\\int \\sin^{3}x\\,\\cos^{${n}}x\\,dx$.`,
        choices: [
          { t: `$-\\dfrac{\\cos^{${n + 1}}x}{${n + 1}}+\\dfrac{\\cos^{${n + 3}}x}{${n + 3}}+C$`, ok: true },
          { t: `$\\dfrac{\\cos^{${n + 1}}x}{${n + 1}}-\\dfrac{\\cos^{${n + 3}}x}{${n + 3}}+C$`, why: 'Overall sign. With $u=\\cos x$, $du=-\\sin x\\,dx$, which introduces a global minus.' },
          { t: `$-\\dfrac{\\cos^{${n + 1}}x}{${n + 1}}-\\dfrac{\\cos^{${n + 3}}x}{${n + 3}}+C$`, why: 'The second term flips sign twice (once from $-du$, once from $-u^{2}$) and ends up positive.' },
          { t: `$\\dfrac{\\sin^{4}x}{4}\\cdot\\dfrac{\\cos^{${n + 1}}x}{${n + 1}}+C$`, why: 'Separate antiderivatives multiplied together — not a valid operation.' },
        ],
        steps: [
          `The **sine** power is odd: save one $\\sin x$, convert the rest with $\\sin^{2}x = 1-\\cos^{2}x$.`,
          `$\\displaystyle\\int (1-\\cos^{2}x)\\cos^{${n}}x\\,\\sin x\\,dx$`,
          `$u=\\cos x$, $du=-\\sin x\\,dx$: $-\\displaystyle\\int(1-u^{2})u^{${n}}du$`,
          `$= -\\dfrac{u^{${n + 1}}}{${n + 1}}+\\dfrac{u^{${n + 3}}}{${n + 3}}+C$, then $u=\\cos x$.`,
        ],
        recall: 'Whichever power is odd tells you which function becomes $u$ — you substitute for the **other** one.',
      };
    }
    const k = r.int(2, 5);
    return {
      prompt: `Evaluate $\\displaystyle\\int \\tan^{${k}}x\\,\\sec^{2}x\\,dx$.`,
      choices: [
        { t: `$\\dfrac{\\tan^{${k + 1}}x}{${k + 1}}+C$`, ok: true },
        { t: `$\\dfrac{\\sec^{3}x}{3}\\tan^{${k}}x+C$`, why: 'You substituted $u=\\sec x$, but $du = \\sec x\\tan x\\,dx$ and there is no lone $\\sec x\\tan x$ available.' },
        { t: `$\\dfrac{\\tan^{${k + 1}}x\\sec^{3}x}{${3 * (k + 1)}}+C$`, why: 'Both factors integrated separately. The $\\sec^{2}x$ is *consumed* by $du$ — it cannot survive.' },
        { t: `$\\dfrac{\\tan^{${k + 1}}x}{${k + 1}}\\sec^{2}x+C$`, why: 'Same issue: once $\\sec^{2}x\\,dx$ becomes $du$, it is gone.' },
      ],
      steps: [
        `Recognize $\\dfrac{d}{dx}\\tan x = \\sec^{2}x$ — the derivative is sitting right there.`,
        `$u=\\tan x$, $du=\\sec^{2}x\\,dx$.`,
        `$\\displaystyle\\int u^{${k}}du = \\dfrac{u^{${k + 1}}}{${k + 1}}+C = \\dfrac{\\tan^{${k + 1}}x}{${k + 1}}+C$`,
      ],
      recall: 'For $\\tan^{m}\\sec^{n}$: even $\\sec$ power → save $\\sec^{2}$ for $du$, use $u=\\tan x$.',
    };
  },
});

G.push({
  id: 'g-t-trigsub', topic: 'Trigonometric Substitution', diff: 2,
  make(r) {
    const a = r.int(2, 6);
    const kind = r.pick(['minus', 'plus', 'sec']);
    const forms = {
      minus: { rad: `\\sqrt{${a * a}-x^{2}}`, sub: `x=${a}\\sin\\theta`, id: `${a * a}\\cos^{2}\\theta`, res: `${a}\\cos\\theta`, why: 'a²−x² pairs with sine because $1-\\sin^{2}=\\cos^{2}$.' },
      plus: { rad: `\\sqrt{${a * a}+x^{2}}`, sub: `x=${a}\\tan\\theta`, id: `${a * a}\\sec^{2}\\theta`, res: `${a}\\sec\\theta`, why: 'a²+x² pairs with tangent because $1+\\tan^{2}=\\sec^{2}$.' },
      sec: { rad: `\\sqrt{x^{2}-${a * a}}`, sub: `x=${a}\\sec\\theta`, id: `${a * a}\\tan^{2}\\theta`, res: `${a}\\tan\\theta`, why: 'x²−a² pairs with secant because $\\sec^{2}-1=\\tan^{2}$.' },
    };
    const F = forms[kind];
    const wrong = Object.entries(forms).filter(([k]) => k !== kind);
    return {
      prompt: `Which substitution rationalizes $${F.rad}$?`,
      choices: [
        { t: `$${F.sub}$`, ok: true },
        { t: `$${wrong[0][1].sub}$`, why: `That handles $${wrong[0][1].rad.replace('\\sqrt', '').replace('{', '').replace('}', '')}$-type radicals. ${wrong[0][1].why} Yours needs a different identity.` },
        { t: `$${wrong[1][1].sub}$`, why: `That handles a different pattern. ${wrong[1][1].why}` },
        { t: `$u=${F.rad.replace('\\sqrt', '').replace(/[{}]/g, '')}$`, why: 'A plain $u$-substitution only works if a matching $du$ (a lone factor of $x$) is present. The whole point of trig substitution is that it is not.' },
      ],
      steps: [
        `Match the pattern: $${F.rad}$.`,
        `Substitute $${F.sub}$; the expression under the radical becomes $${F.id}$.`,
        `So $${F.rad} = ${F.res}$ — the radical is gone.`,
        `Afterwards, use a right triangle to convert back from $\\theta$ to $x$.`,
      ],
      recall: '$a^{2}-x^{2}\\to a\\sin\\theta$ · $a^{2}+x^{2}\\to a\\tan\\theta$ · $x^{2}-a^{2}\\to a\\sec\\theta$.',
      viz: kind === 'minus'
        ? { kind: 'triangle', adj: `√(${a * a}−x²)`, opp: 'x', hyp: String(a), angle: 'θ', notes: [`x = ${a} sin θ  ⇒  sin θ = x/${a}`, `√(${a * a} − x²) = ${a} cos θ`], cap: 'Sine substitution: $x$ is opposite, $a$ is the hypotenuse.' }
        : kind === 'plus'
          ? { kind: 'triangle', adj: String(a), opp: 'x', hyp: `√(${a * a}+x²)`, angle: 'θ', notes: [`x = ${a} tan θ  ⇒  tan θ = x/${a}`, `√(${a * a} + x²) = ${a} sec θ`], cap: 'Tangent substitution: the radical is the hypotenuse.' }
          : { kind: 'triangle', adj: String(a), opp: `√(x²−${a * a})`, hyp: 'x', angle: 'θ', notes: [`x = ${a} sec θ  ⇒  sec θ = x/${a}`, `√(x² − ${a * a}) = ${a} tan θ`], cap: 'Secant substitution: $x$ itself is the hypotenuse.' },
    };
  },
});

G.push({
  id: 'g-t-pf', topic: 'Partial Fractions', diff: 2,
  make(r) {
    let a = r.int(1, 5), b = r.int(1, 5);
    while (b === a) b = r.int(1, 5);
    return {
      prompt: `Evaluate $\\displaystyle\\int \\frac{dx}{(x-${a})(x-${b})}$.`,
      choices: [
        { t: `$\\dfrac{1}{${a - b}}\\ln\\left|\\dfrac{x-${a}}{x-${b}}\\right|+C$`, ok: true },
        { t: `$\\ln\\left|(x-${a})(x-${b})\\right|+C$`, why: 'You integrated as if the whole denominator were a single $u$. That needs its derivative on top, which is not $1$.' },
        { t: `$\\dfrac{1}{${b - a}}\\ln\\left|\\dfrac{x-${a}}{x-${b}}\\right|+C$`, why: `The coefficients are swapped. $A = \\frac{1}{${a}-${b}} = ${frac(1, a - b)}$ goes with $\\ln|x-${a}|$.` },
        { t: `$\\dfrac{\\ln|x-${a}|}{\\ln|x-${b}|}+C$`, why: 'Partial fractions produces a **sum** of logs, and $\\ln A-\\ln B = \\ln\\frac AB$ — a quotient inside one log, never a quotient of logs.' },
      ],
      steps: [
        `Decompose: $\\dfrac{1}{(x-${a})(x-${b})} = \\dfrac{A}{x-${a}}+\\dfrac{B}{x-${b}}$.`,
        `Multiply through: $1 = A(x-${b})+B(x-${a})$.`,
        `Cover-up at $x=${a}$: $1 = A(${a - b})$, so $A=${frac(1, a - b)}$. At $x=${b}$: $B=${frac(1, b - a)}$.`,
        `$\\displaystyle\\int = ${frac(1, a - b)}\\ln|x-${a}| ${b - a > 0 ? '+' : '-'} ${frac(1, Math.abs(b - a))}\\ln|x-${b}| + C = \\dfrac{1}{${a - b}}\\ln\\left|\\dfrac{x-${a}}{x-${b}}\\right|+C$`,
      ],
      recall: 'The cover-up method: set $x$ equal to each root in turn and read the coefficient off instantly.',
    };
  },
});

G.push({
  id: 'g-t-pf-setup', topic: 'Partial Fractions', diff: 2,
  make(r) {
    const a = r.int(1, 4), k = r.pick([2, 3]);
    const irr = r.pick([1, 4, 9]);
    const which = r.pick(['rep', 'quad']);
    if (which === 'rep') {
      const terms = Array.from({ length: k }, (_, i) => `\\dfrac{${String.fromCharCode(65 + i)}}{(x-${a})^{${i + 1}}}`).join('+')
        .replace(`^{1}`, '');
      return {
        prompt: `Set up (do not solve) the partial-fraction decomposition of $\\dfrac{x+1}{(x-${a})^{${k}}}$.`,
        choices: [
          { t: `$${terms}$`, ok: true },
          { t: `$\\dfrac{A}{(x-${a})^{${k}}}$`, why: `A repeated factor needs one term for **every** power from $1$ to $${k}$, not just the highest.` },
          { t: `$\\dfrac{A}{x-${a}}$`, why: `You dropped down to a single power. The decomposition must be able to reproduce a denominator of $(x-${a})^{${k}}$.` },
          { t: `$\\dfrac{Ax+B}{(x-${a})^{${k}}}$`, why: 'Linear numerators belong over **irreducible quadratics**. Linear factors get constant numerators.' },
        ],
        steps: [
          `The factor $(x-${a})$ is repeated $${k}$ times.`,
          `Rule: include $\\frac{A_1}{x-${a}}+\\frac{A_2}{(x-${a})^{2}}+\\cdots+\\frac{A_{${k}}}{(x-${a})^{${k}}}$.`,
          `That gives $${k}$ unknowns for a degree-$${k}$ denominator — exactly the right count.`,
        ],
        recall: 'Unknown count must equal the denominator\'s degree. If it does not, your setup is wrong.',
      };
    }
    return {
      prompt: `Set up (do not solve) the partial-fraction decomposition of $\\dfrac{3x}{(x-${a})(x^{2}+${irr})}$.`,
      choices: [
        { t: `$\\dfrac{A}{x-${a}}+\\dfrac{Bx+C}{x^{2}+${irr}}$`, ok: true },
        { t: `$\\dfrac{A}{x-${a}}+\\dfrac{B}{x^{2}+${irr}}$`, why: 'An irreducible quadratic needs a **linear** numerator $Bx+C$. A lone constant is not general enough to represent every such fraction.' },
        { t: `$\\dfrac{A}{x-${a}}+\\dfrac{B}{x+${Math.round(Math.sqrt(irr))}}+\\dfrac{C}{x-${Math.round(Math.sqrt(irr))}}$`, why: `$x^{2}+${irr}$ has no real roots — it cannot be factored over the reals. You are thinking of $x^{2}-${irr}$.` },
        { t: `$\\dfrac{Ax+B}{x-${a}}+\\dfrac{Cx+D}{x^{2}+${irr}}$`, why: 'A **linear** factor gets a constant numerator. Giving it $Ax+B$ over-parameterizes the system.' },
      ],
      steps: [
        `Factor check: $x^{2}+${irr}$ has discriminant $-4(${irr})<0$, so it is irreducible.`,
        `Linear factor $\\to$ constant numerator: $\\frac{A}{x-${a}}$.`,
        `Irreducible quadratic $\\to$ linear numerator: $\\frac{Bx+C}{x^{2}+${irr}}$.`,
        `Three unknowns, degree-3 denominator. ✓`,
      ],
      recall: 'Numerator degree is always one less than its denominator factor\'s degree.',
    };
  },
});

G.push({
  id: 'g-t-improper', topic: 'Improper Integrals', diff: 2,
  make(r) {
    const atZero = r.pick([true, false]);
    const p = r.pick([0.5, 1, 1.5, 2, 3]);
    const ptex = p === 0.5 ? '1/2' : p === 1.5 ? '3/2' : String(p);
    const conv = atZero ? p < 1 : p > 1;
    const val = atZero ? (p < 1 ? 1 / (1 - p) : null) : (p > 1 ? 1 / (p - 1) : null);
    const wrongVal = atZero ? (p !== 1 ? 1 / (1 - p) : 2) : (p !== 1 ? 1 / (p - 1) : 2);
    const label = atZero ? `\\int_{0}^{1}\\frac{dx}{x^{${ptex}}}` : `\\int_{1}^{\\infty}\\frac{dx}{x^{${ptex}}}`;
    const rd = v => Math.round(v * 1000) / 1000;
    let choices;
    if (conv) {
      const key = `Converges to $${rd(val)}$`;
      choices = [
        { t: key, ok: true },
        ...choose(key, [
          { t: 'Diverges', why: atZero
            ? `At the endpoint $0$, convergence needs $p<1$. Here $p=${ptex}<1$, so it **does** converge — you likely applied the $\\infty$ rule ($p>1$) by mistake.`
            : `At $\\infty$, convergence needs $p>1$. Here $p=${ptex}>1$, so it converges.` },
          { t: `Converges to $${rd(1 / Math.abs(p - 1) + 1)}$`, why: 'Arithmetic slip evaluating the limit. Set up $\\lim\\left[\\frac{x^{1-p}}{1-p}\\right]$ carefully and track which term dies and which survives.' },
          { t: `Converges to $${rd(Math.abs(p - 1))}$`, why: 'You reported $|1-p|$ instead of its reciprocal. The antiderivative divides by $1-p$.' },
          { t: 'Converges to $0$', why: 'The integrand is strictly positive on the interval, so the area cannot be zero.' },
        ]),
      ];
    } else {
      choices = [
        { t: 'Diverges', ok: true },
        ...choose('Diverges', [
          { t: `Converges to $${rd(Math.abs(wrongVal))}$`, why: p === 1
            ? 'For $p=1$ the antiderivative is $\\ln x$, which grows without bound — there is no finite value. The formula $\\frac{1}{p-1}$ has no meaning at $p=1$.'
            : `You applied the wrong direction of the $p$-test and plugged into $\\frac{1}{|p-1|}$. The limit here is infinite, so no value exists.` },
          { t: 'Converges to $1$', why: 'A guess at the "nice" value. Evaluate the limit explicitly — it is unbounded.' },
          { t: 'Cannot be determined', why: 'It absolutely can: set up the limit and evaluate. The $p$-test settles every case of this form.' },
          { t: 'Converges to $\\infty$', why: 'Converging **to** infinity is a contradiction in terms. If the limit is infinite, the integral diverges.' },
        ]),
      ];
    }
    return {
      prompt: `Does $\\displaystyle ${label}$ converge? If so, to what?`,
      choices,
      steps: [
        atZero
          ? `Trouble is at the **left endpoint** $x=0$. Write $\\lim_{t\\to0^{+}}\\int_{t}^{1}x^{-${ptex}}dx$.`
          : `Trouble is at **$\\infty$**. Write $\\lim_{t\\to\\infty}\\int_{1}^{t}x^{-${ptex}}dx$.`,
        p === 1
          ? `Antiderivative is $\\ln x$: ${atZero ? `$\\ln 1-\\ln t\\to+\\infty$` : `$\\ln t-\\ln 1\\to+\\infty$`}. Divergent.`
          : `Antiderivative is $\\dfrac{x^{1-${ptex}}}{1-${ptex}}$; evaluate the limit.`,
        atZero ? `**At $0$:** converges $\\iff p<1$. Here $p=${ptex}$, so it ${conv ? 'converges' : 'diverges'}.`
          : `**At $\\infty$:** converges $\\iff p>1$. Here $p=${ptex}$, so it ${conv ? 'converges' : 'diverges'}.`,
        conv ? `Value: $\\dfrac{1}{${atZero ? `1-${ptex}` : `${ptex}-1`}} = ${Math.round(val * 1000) / 1000}$.` : 'No finite value exists.',
      ],
      recall: 'Two opposite rules. At $\\infty$: $p>1$ converges. At $0$: $p<1$ converges. $p=1$ always diverges.',
      viz: {
        kind: 'improper',
        f: x => 1 / Math.pow(x, p),
        a: atZero ? 0.004 : 1, b: atZero ? 1.8 : 12,
        xmin: atZero ? 0 : 0.8, clip: atZero ? 14 : 1.6,
        shadeFrom: atZero ? 0.004 : 1, shadeTo: atZero ? 1 : 12,
        vertical: atZero ? 0 : null, verticalLabel: 'x = 0',
        tag: `1/x^${ptex} — ${conv ? 'finite' : 'infinite'} area`,
        cap: atZero
          ? 'The question is whether the **spike at $0$** is thin enough. Smaller $p$ means a milder spike and a finite area.'
          : 'The question is whether the **tail** decays fast enough. Larger $p$ means a thinner tail and a finite area.',
      },
    };
  },
});

G.push({
  id: 'g-t-numint', topic: 'Numerical Integration', diff: 2,
  make(r) {
    const which = r.pick(['trap', 'simp', 'errorpow']);
    if (which === 'errorpow') {
      const rule = r.pick(['Trapezoid', 'Simpson']);
      const factor = rule === 'Trapezoid' ? 4 : 16;
      const other = rule === 'Trapezoid' ? 16 : 4;
      return {
        prompt: `If you **double** $n$ in the ${rule} Rule, the error bound shrinks by roughly what factor?`,
        choices: [
          { t: `$${factor}$`, ok: true },
          { t: `$${other}$`, why: rule === 'Trapezoid'
            ? 'That is Simpson\'s behaviour. Trapezoid error goes like $\\frac{1}{n^{2}}$, so doubling $n$ divides the error by $2^{2}=4$.'
            : 'That is the Trapezoid rate. Simpson\'s error goes like $\\frac{1}{n^{4}}$, so doubling $n$ divides the error by $2^{4}=16$.' },
          { t: '$2$', why: `You used $\\frac1n$. ${rule} error scales like $\\frac{1}{n^{${rule === 'Trapezoid' ? 2 : 4}}}$, not $\\frac1n$.` },
          { t: '$8$', why: `That would be $\\frac{1}{n^{3}}$. No standard rule has cubic convergence — the exponents are $2$ (trap/midpoint) and $4$ (Simpson).` },
        ],
        steps: [
          `${rule} error bound: $|E|\\le\\dfrac{K(b-a)^{${rule === 'Trapezoid' ? 3 : 5}}}{${rule === 'Trapezoid' ? '12n^{2}' : '180n^{4}'}}$.`,
          `Only $n$ changes, so $E \\propto n^{-${rule === 'Trapezoid' ? 2 : 4}}$.`,
          `Replace $n\\to 2n$: error multiplied by $2^{-${rule === 'Trapezoid' ? 2 : 4}} = \\frac{1}{${factor}}$.`,
        ],
        recall: 'Trapezoid & Midpoint: $O(n^{-2})$. Simpson: $O(n^{-4})$ — dramatically better for smooth functions.',
      };
    }
    const fdef = r.pick([
      { tex: 'x^{2}', f: x => x * x },
      { tex: '\\sqrt{x}', f: x => Math.sqrt(x) },
      { tex: '\\dfrac{1}{x}', f: x => 1 / x },
    ]);
    const a = 1, b = 3, n = 4, dx = (b - a) / n;
    const y = [0, 1, 2, 3, 4].map(i => fdef.f(a + i * dx));
    const T = (dx / 2) * (y[0] + 2 * y[1] + 2 * y[2] + 2 * y[3] + y[4]);
    const S = (dx / 3) * (y[0] + 4 * y[1] + 2 * y[2] + 4 * y[3] + y[4]);
    const bad = (dx) * (y[0] + y[1] + y[2] + y[3]);   // left sum
    const rd = v => Math.round(v * 10000) / 10000;
    if (which === 'trap') {
      return {
        prompt: `Approximate $\\displaystyle\\int_{1}^{3}${fdef.tex}\\,dx$ with the **Trapezoid Rule**, $n=4$.`,
        choices: [
          { t: `$${rd(T)}$`, ok: true },
          { t: `$${rd(S)}$`, why: 'You used Simpson\'s weights $1,4,2,4,1$ with $\\frac{\\Delta x}{3}$. Trapezoid uses $1,2,2,2,1$ with $\\frac{\\Delta x}{2}$.' },
          { t: `$${rd(bad)}$`, why: 'That is a left Riemann sum: every point weighted once, no doubling of the interior. Trapezoid counts interior points **twice**.' },
          { t: `$${rd(T * 2)}$`, why: 'You forgot the $\\frac12$ in $\\frac{\\Delta x}{2}$ — a trapezoid\'s area is the *average* of its two heights times the width.' },
        ],
        steps: [
          `$\\Delta x = \\dfrac{3-1}{4} = ${dx}$; nodes $x=1,1.5,2,2.5,3$.`,
          `$T_4 = \\dfrac{\\Delta x}{2}\\left[f(x_0)+2f(x_1)+2f(x_2)+2f(x_3)+f(x_4)\\right]$`,
          `$= ${dx / 2}\\left[${rd(y[0])}+2(${rd(y[1])})+2(${rd(y[2])})+2(${rd(y[3])})+${rd(y[4])}\\right]$`,
          `$= ${rd(T)}$`,
        ],
        recall: 'Trapezoid weights: $1,2,2,\\dots,2,1$ times $\\frac{\\Delta x}{2}$. Endpoints once, interiors twice.',
        viz: { kind: 'riemann', f: fdef.f, a, b, n, kind2: 'trap', tag: `trapezoids, n = ${n}`, cap: 'Each strip is a trapezoid: the two edge heights averaged. Interior heights are shared by two strips — that is where the factor of $2$ comes from.' },
      };
    }
    return {
      prompt: `Approximate $\\displaystyle\\int_{1}^{3}${fdef.tex}\\,dx$ with **Simpson's Rule**, $n=4$.`,
      choices: [
        { t: `$${rd(S)}$`, ok: true },
        { t: `$${rd(T)}$`, why: 'Those are Trapezoid weights $1,2,2,2,1$ over $\\frac{\\Delta x}{2}$. Simpson alternates $4$ and $2$ over $\\frac{\\Delta x}{3}$.' },
        { t: `$${rd((dx / 3) * (y[0] + 4 * y[1] + 4 * y[2] + 4 * y[3] + y[4]))}$`, why: 'All interior weights set to $4$. They must **alternate** $4,2,4,2,\\dots$, starting and ending with $4$.' },
        { t: `$${rd((dx / 2) * (y[0] + 4 * y[1] + 2 * y[2] + 4 * y[3] + y[4]))}$`, why: 'Right weights, wrong divisor. Simpson divides by $3$, not $2$.' },
      ],
      steps: [
        `$\\Delta x = ${dx}$, and $n=4$ is even (required for Simpson).`,
        `$S_4 = \\dfrac{\\Delta x}{3}\\left[f_0+4f_1+2f_2+4f_3+f_4\\right]$`,
        `$= ${rd(dx / 3)}\\left[${rd(y[0])}+4(${rd(y[1])})+2(${rd(y[2])})+4(${rd(y[3])})+${rd(y[4])}\\right]$`,
        `$= ${rd(S)}$`,
      ],
      recall: 'Simpson: $\\frac{\\Delta x}{3}[1,4,2,4,\\dots,4,1]$. $n$ **must** be even. Odd indices always get $4$.',
    };
  },
});

G.push({
  id: 'g-t-strategy', topic: 'Strategy for Integration', diff: 3,
  make(r) {
    const items = [
      // --- u-substitution
      { s: '\\int \\frac{x}{x^{2}+4}\\,dx', t: 'u-substitution', why: 'The numerator is (a multiple of) the derivative of the denominator — $u=x^{2}+4$ finishes it in one line.' },
      { s: '\\int x\\sqrt{x^{2}+1}\\,dx', t: 'u-substitution', why: 'The spare factor of $x$ is exactly what $du=2x\\,dx$ needs — no trig substitution required.' },
      { s: '\\int \\frac{\\ln x}{x}\\,dx', t: 'u-substitution', why: '$u=\\ln x$ has $du=\\frac{dx}{x}$, and that $\\frac1x$ is sitting right there.' },
      { s: '\\int xe^{-x^{2}}\\,dx', t: 'u-substitution', why: 'The $x$ out front is $du$ up to a constant. Parts would need $\\int e^{-x^{2}}dx$, which does not exist in elementary form.' },
      { s: '\\int \\frac{\\sec^{2}x}{\\tan x}\\,dx', t: 'u-substitution', why: '$u=\\tan x$ gives $du=\\sec^{2}x\\,dx$ — the numerator is the derivative of the denominator.' },
      { s: '\\int \\frac{e^{x}}{1+e^{x}}\\,dx', t: 'u-substitution', why: 'Again $\\frac{u\'}{u}$: the answer is a logarithm.' },

      // --- integration by parts
      { s: '\\int x\\cos x\\,dx', t: 'Integration by parts', why: 'A polynomial times a trig function: parts knocks the power of $x$ down to nothing.' },
      { s: '\\int \\ln x\\,dx', t: 'Integration by parts', why: 'A lone logarithm: take $u=\\ln x$, $dv=dx$.' },
      { s: '\\int \\arctan x\\,dx', t: 'Integration by parts', why: 'A lone inverse-trig function — supply the missing factor with $dv=1\\,dx$.' },
      { s: '\\int x^{2}e^{3x}\\,dx', t: 'Integration by parts', why: 'Polynomial times exponential, and the polynomial dies — run it as a tabular table.' },
      { s: '\\int e^{x}\\sin x\\,dx', t: 'Integration by parts', why: 'Neither factor ever dies, so it loops: parts twice, then solve for the integral.' },
      { s: '\\int x\\sec^{2}x\\,dx', t: 'Integration by parts', why: 'Algebraic before trigonometric in LIATE, and $\\sec^{2}x$ integrates cleanly to $\\tan x$.' },

      // --- partial fractions
      { s: '\\int \\frac{dx}{x^{2}-9}', t: 'Partial fractions', why: 'The denominator factors as $(x-3)(x+3)$, so split it into two simple logs.' },
      { s: '\\int \\frac{3x+1}{x^{2}+x}\\,dx', t: 'Partial fractions', why: 'A proper rational function with a factorable denominator — split it before integrating.' },
      { s: '\\int \\frac{x^{2}+1}{x^{3}+x}\\,dx', t: 'Partial fractions', why: 'Denominator $x(x^{2}+1)$: one linear factor and one irreducible quadratic, giving a log and an arctangent.' },

      // --- trig substitution
      { s: '\\int \\sqrt{9-x^{2}}\\,dx', t: 'Trigonometric substitution', why: 'A radical $\\sqrt{a^{2}-x^{2}}$ with no spare factor of $x$ — substitute $x=3\\sin\\theta$.' },
      { s: '\\int \\frac{dx}{x^{2}\\sqrt{x^{2}-16}}', t: 'Trigonometric substitution', why: '$\\sqrt{x^{2}-a^{2}}$ is the secant case, and there is no spare $x$ to make a substitution work.' },
      { s: '\\int \\frac{dx}{\\left(x^{2}+4\\right)^{3/2}}', t: 'Trigonometric substitution', why: 'A half-integer power of $x^{2}+a^{2}$ is a radical in disguise — use $x=2\\tan\\theta$.' },

      // --- trig identities
      { s: '\\int \\sin^{3}x\\cos^{2}x\\,dx', t: 'Trig identity, then u-substitution', why: 'The odd sine power lets you peel off one $\\sin x$ for $du$ and convert the rest with $\\sin^{2}=1-\\cos^{2}$.' },
      { s: '\\int \\cos^{2}x\\,dx', t: 'Trig identity, then u-substitution', why: 'Both powers even, so no substitution works — use the half-angle identity $\\cos^{2}x=\\frac{1+\\cos 2x}{2}$.' },
      { s: '\\int \\sin(5x)\\cos(2x)\\,dx', t: 'Trig identity, then u-substitution', why: 'Different angles share no inner function — the product-to-sum identity turns it into a sum of single sines.' },
      { s: '\\int \\tan^{4}x\\sec^{2}x\\,dx', t: 'Trig identity, then u-substitution', why: 'An even power of secant means $\\sec^{2}x$ is available as $du$ for $u=\\tan x$.' },

      // --- recognise it outright
      { s: '\\int \\frac{dx}{x^{2}+9}', t: 'Recognize an inverse-trig form', why: 'A sum of squares in the denominator with a constant on top is the arctangent template — no work needed.' },
      { s: '\\int \\frac{dx}{\\sqrt{25-x^{2}}}', t: 'Recognize an inverse-trig form', why: 'This is the arcsine template $\\int\\frac{dx}{\\sqrt{a^{2}-x^{2}}}=\\arcsin\\frac{x}{a}$ — reaching for trig substitution works but wastes time.' },

      // --- simplify first
      { s: '\\int \\left(x^{2}+4\\right)^{3}dx', t: 'Expand or simplify first', why: 'There is no radical here — a positive integer power just expands into a polynomial.' },
      { s: '\\int \\frac{x^{2}+3x}{x}\\,dx', t: 'Expand or simplify first', why: 'Divide through term by term and the whole thing collapses to the power rule.' },
      { s: '\\int \\frac{x^{3}}{x+1}\\,dx', t: 'Expand or simplify first', why: 'The fraction is improper, so polynomial long division comes before anything else.' },
    ];
    const pick = r.pick(items);
    // several entries share a technique name — dedupe by name or options collide
    const seen = new Set([pick.t]);
    const others = r.shuffle(items).filter(i => {
      if (seen.has(i.t)) return false;
      seen.add(i.t); return true;
    }).slice(0, 3);
    return {
      prompt: `Which technique should you reach for first on $\\displaystyle ${pick.s}$?`,
      choices: [
        { t: pick.t, ok: true },
        ...others.map(o => ({
          t: o.t, why: `${o.t} is the right call for something like $\\displaystyle ${o.s}$ (${o.why}) — but not here. For this integral: ${pick.why}`,
        })),
      ],
      steps: [
        'Work down the checklist: (1) simplify algebraically, (2) $u$-substitution, (3) parts, (4) trig identities / trig substitution, (5) partial fractions.',
        `Look at the structure of $\\displaystyle ${pick.s}$.`,
        pick.why,
        `Best first move: **${pick.t}**.`,
      ],
      recall: 'Scan for a $u$-substitution before anything else — it is the cheapest technique and it hides inside many problems that look harder.',
    };
  },
});

export const techniques = { unit: 'techniques', problems: P, generators: G };
