// ---------------------------------------------------------------
// bank/exams.js — problems taken from, and modelled on, Dr. McWhorter's
// actual MATH 142 exams (Spring 2025, Fall 2025, Spring 2026) and the
// Fall 2026 check-ins, all published on the course GitHub.
//
// Two kinds of content here:
//   1. `src`-tagged problems that ARE the real exam question, converted
//      to multiple choice.
//   2. Generators that produce fresh instances of the same archetype —
//      which is exactly what he does himself (his v1/v2 papers differ
//      only in the constants).
//
// Vocabulary follows his: "tabular integration", the "rule of 7" box,
// "shifting" and "looping" integrals, "linear u-sub in your head".
// ---------------------------------------------------------------
import { frac, sfrac, sgn, lin, choose } from '../util.js';

const P = [];
const G = [];

// =================================================================
// REAL EXAM PROBLEMS
// =================================================================

P.push({
  id: 'x-f25e1q4-improper-interior', unit: 'techniques', topic: 'Improper Integrals', diff: 3,
  src: 'Fall 2025 · Exam 1 · Q4',
  prompt: 'Determine whether $\\displaystyle\\int_{1}^{3}\\frac{dx}{x-2}$ converges or diverges. If it converges, find its value.',
  choices: [
    { t: 'Diverges', ok: true },
    { t: '$0$', why: 'The trap this question is built on. The integrand blows up at $x=2$, which is **inside** $[1,3]$, so FTC does not apply. Antidifferentiating blindly gives $\\ln|x-2|\\big|_1^3=\\ln1-\\ln1=0$ — but that computation is meaningless.', err: 'conceptual' },
    { t: '$\\ln 2$', why: 'You integrated over only part of the interval, or ignored one side of the singularity. Both halves must be tested separately, and each diverges.', err: 'conceptual' },
    { t: 'Converges to $\\ln\\left|\\dfrac{1}{2}\\right|$', why: 'Any finite answer is wrong here — the two one-sided limits are $-\\infty$ and $+\\infty$.', err: 'conceptual' },
  ],
  steps: [
    'Check for interior trouble **first**: the integrand is undefined at $x=2$, and $1<2<3$.',
    'Split: $\\displaystyle\\int_1^3 = \\int_1^2+\\int_2^3$, and test each with a limit.',
    '$\\displaystyle\\lim_{t\\to2^{-}}\\int_1^{t}\\frac{dx}{x-2} = \\lim_{t\\to2^{-}}\\left[\\ln|x-2|\\right]_1^{t} = \\lim_{t\\to2^{-}}\\ln|t-2| = -\\infty$.',
    'One divergent piece is enough: the whole integral **diverges**. (The symmetric cancellation to $0$ is exactly the error being tested.)',
  ],
  recall: 'Scan the interval for points where the integrand blows up before you antidifferentiate. An interior singularity voids the FTC.',
  viz: {
    kind: 'improper', f: x => 1 / (x - 2), a: 1, b: 3, xmin: 1, clip: 12, ymin: -12,
    shadeFrom: 1, shadeTo: 3, vertical: 2, verticalLabel: 'x = 2',
    tag: '1/(x−2) on [1,3]',
    cap: 'The two halves are unbounded in **opposite** directions. They do not cancel — each is separately infinite.',
  },
});

P.push({
  id: 'x-f25e1q7-prodsum', unit: 'techniques', topic: 'Product-to-Sum Integrals', diff: 2,
  src: 'Fall 2025 · Exam 1 · Q7',
  prompt: 'Compute $\\displaystyle\\int \\sin(3x)\\cos(x)\\,dx$.',
  choices: [
    { t: '$-\\dfrac{\\cos(4x)}{8}-\\dfrac{\\cos(2x)}{4}+C$', ok: true },
    { t: '$-\\dfrac{\\cos(3x)\\sin(x)}{3}+C$', why: 'You integrated one factor and left the other alone. $\\int fg\\ne\\left(\\int f\\right)g$.', err: 'formula-confusion' },
    { t: '$\\dfrac{\\cos(4x)}{8}+\\dfrac{\\cos(2x)}{4}+C$', why: 'Signs. $\\int\\sin(kx)dx=-\\frac{\\cos(kx)}{k}$ — each term carries a minus.', err: 'sign' },
    { t: '$-\\dfrac{\\cos(4x)}{4}-\\dfrac{\\cos(2x)}{2}+C$', why: 'You dropped the $\\frac12$ from the product-to-sum identity. Every term inherits it.', err: 'dropped-factor' },
  ],
  steps: [
    'Neither power is odd and the arguments differ, so peeling off a factor for $du$ will not work. Use the **product-to-sum** rule:',
    '$\\sin\\theta\\cos\\phi = \\dfrac{\\sin(\\theta+\\phi)+\\sin(\\theta-\\phi)}{2}$, with $\\theta=3x$, $\\phi=x$.',
    '$\\displaystyle\\int\\sin(3x)\\cos x\\,dx = \\frac12\\int\\left[\\sin(4x)+\\sin(2x)\\right]dx$',
    '$= \\frac12\\left[-\\frac{\\cos(4x)}{4}-\\frac{\\cos(2x)}{2}\\right]+C = -\\frac{\\cos(4x)}{8}-\\frac{\\cos(2x)}{4}+C$',
  ],
  recall: 'Different arguments inside sine and cosine → product-to-sum. $\\sin\\theta\\cos\\phi=\\frac{\\sin(\\theta+\\phi)+\\sin(\\theta-\\phi)}{2}$.',
});

P.push({
  id: 'x-f25final-q5-sectan', unit: 'techniques', topic: 'Trigonometric Integrals', diff: 2,
  src: 'Fall 2025 · Final · Q5',
  prompt: 'Compute $\\displaystyle\\int \\sec^{7}\\theta\\,\\tan\\theta\\,d\\theta$.',
  choices: [
    { t: '$\\dfrac{\\sec^{7}\\theta}{7}+C$', ok: true },
    { t: '$\\dfrac{\\sec^{8}\\theta}{8}+C$', why: 'You treated the whole $\\sec^{7}\\theta$ as $u$ and raised its power. In fact $u=\\sec\\theta$ and the integrand is $u^{6}\\,du$, which integrates to $\\frac{u^{7}}{7}$.', err: 'power-rule' },
    { t: '$\\dfrac{\\sec^{7}\\theta\\tan^{2}\\theta}{14}+C$', why: 'Both factors integrated separately. The $\\tan\\theta$ is consumed by $du$ and cannot survive.', err: 'formula-confusion' },
    { t: '$\\dfrac{\\tan^{2}\\theta}{2}\\sec^{7}\\theta+C$', why: 'Same issue — once $\\sec\\theta\\tan\\theta\\,d\\theta$ becomes $du$, it is gone.', err: 'formula-confusion' },
  ],
  steps: [
    'Recognize the pair: $\\dfrac{d}{d\\theta}\\sec\\theta = \\sec\\theta\\tan\\theta$.',
    'Peel one $\\sec\\theta$ off to join $\\tan\\theta$: $\\sec^{7}\\theta\\tan\\theta = \\sec^{6}\\theta\\cdot(\\sec\\theta\\tan\\theta)$.',
    'Let $u=\\sec\\theta$, $du=\\sec\\theta\\tan\\theta\\,d\\theta$: $\\displaystyle\\int u^{6}du = \\frac{u^{7}}{7}$.',
    '$= \\dfrac{\\sec^{7}\\theta}{7}+C$',
  ],
  recall: 'For $\\sec^{m}\\tan^{n}$ with an odd $\\tan$ power, save $\\sec\\theta\\tan\\theta$ for $du$ and let $u=\\sec\\theta$.',
});

P.push({
  id: 'x-f25final-q7-ratiofact', unit: 'series', topic: 'Ratio & Root Tests', diff: 3,
  src: 'Fall 2025 · Final · Q7',
  prompt: 'Determine whether $\\displaystyle\\sum_{n=0}^{\\infty}\\frac{(n!)^{2}}{(2n)!}$ converges or diverges.',
  choices: [
    { t: 'Converges, since $L=\\tfrac14<1$', ok: true },
    { t: 'Diverges, since $L=4>1$', why: 'The ratio is inverted. $\\frac{a_{n+1}}{a_n}=\\frac{(n+1)^{2}}{(2n+1)(2n+2)}$, whose numerator is quadratic and denominator is also quadratic but with leading coefficient $4$ — so the limit is $\\frac14$, not $4$.', err: 'inverted' },
    { t: 'Converges, since $L=0$', why: 'Factorials on top **and** bottom partially cancel here, leaving a finite nonzero ratio. $L=0$ happens when only the denominator has factorials.', err: 'algebra-slip' },
    { t: 'The Ratio Test is inconclusive', why: '$L=\\frac14$ is decisively less than $1$. Inconclusive means $L=1$ exactly.', err: 'conceptual' },
  ],
  steps: [
    'Factorials → Ratio Test. Expand each one step: $(n+1)!=(n+1)n!$ and $(2n+2)!=(2n+2)(2n+1)(2n)!$.',
    '$\\left|\\dfrac{a_{n+1}}{a_n}\\right| = \\dfrac{\\left[(n+1)!\\right]^{2}}{(2n+2)!}\\cdot\\dfrac{(2n)!}{(n!)^{2}} = \\dfrac{(n+1)^{2}}{(2n+2)(2n+1)}$',
    '$\\displaystyle\\lim_{n\\to\\infty}\\frac{n^{2}+2n+1}{4n^{2}+6n+2} = \\frac14$',
    '$L=\\frac14<1$, so the series **converges absolutely**.',
  ],
  recall: 'Expand factorials by exactly one step and cancel. Never try to evaluate them.',
});

P.push({
  id: 'x-s26f-q15-geomseq', unit: 'series', topic: 'Geometric & Telescoping', diff: 2,
  src: 'Spring 2026 · Final · Q15',
  prompt: 'Find the sum: $\\;12 - 6 + 3 - \\dfrac{3}{2} + \\dfrac{3}{4} - \\dfrac{3}{8}+\\cdots$',
  choices: [
    { t: '$8$', ok: true },
    { t: '$24$', why: 'You used $\\frac{a}{1-|r|}=\\frac{12}{1/2}$. The ratio is $r=-\\frac12$, and $1-\\left(-\\frac12\\right)=\\frac32$, not $\\frac12$.', err: 'sign' },
    { t: '$6$', why: 'You used $\\frac{a}{1+r}$ or halved the first term. The formula is $\\frac{a}{1-r}$ with $r$ substituted **including its sign**.', err: 'formula-confusion' },
    { t: 'Diverges', why: '$|r|=\\frac12<1$, so it converges. Alternating signs do not prevent a geometric series from summing.', err: 'conceptual' },
  ],
  steps: [
    'Find the ratio: $\\dfrac{-6}{12}=-\\dfrac12$, and $\\dfrac{3}{-6}=-\\dfrac12$. Geometric with $r=-\\frac12$.',
    '$|r|=\\frac12<1$, so the series converges.',
    'First term $a=12$.',
    '$S=\\dfrac{a}{1-r}=\\dfrac{12}{1-\\left(-\\frac12\\right)}=\\dfrac{12}{\\frac32}=8$',
  ],
  recall: 'Substitute $r$ **with its sign** into $\\frac{a}{1-r}$. A negative $r$ makes the denominator bigger, not smaller.',
});

P.push({
  id: 'x-s26f-q13-t3sqrt', unit: 'series', topic: 'Taylor Polynomials & Error', diff: 3,
  src: 'Spring 2026 · Final · Q13',
  prompt: 'Find the third-degree Taylor polynomial $T_{3}(x)$ for $f(x)=\\sqrt{x}$ centered at $x=1$.',
  choices: [
    { t: '$1+\\dfrac{x-1}{2}-\\dfrac{(x-1)^{2}}{8}+\\dfrac{(x-1)^{3}}{16}$', ok: true },
    { t: '$1+\\dfrac{x-1}{2}-\\dfrac{(x-1)^{2}}{4}+\\dfrac{3(x-1)^{3}}{8}$', why: 'You used $f^{(n)}(1)$ without dividing by $n!$. The coefficients are $\\frac{f^{(n)}(1)}{n!}$: $-\\frac14\\div2!=-\\frac18$ and $\\frac38\\div3!=\\frac1{16}$.', err: 'dropped-factor' },
    { t: '$1+\\dfrac{x}{2}-\\dfrac{x^{2}}{8}+\\dfrac{x^{3}}{16}$', why: 'You dropped the centering. Every power must be $(x-1)^{n}$ — this polynomial is built **around** $x=1$.', err: 'conceptual' },
    { t: '$1+\\dfrac{x-1}{2}+\\dfrac{(x-1)^{2}}{8}+\\dfrac{(x-1)^{3}}{16}$', why: 'Sign on the quadratic term: $f\'\'(x)=-\\frac14x^{-3/2}$ is negative at $x=1$.', err: 'sign' },
  ],
  steps: [
    '$f(x)=x^{1/2}$: $f\'=\\frac12x^{-1/2}$, $f\'\'=-\\frac14x^{-3/2}$, $f\'\'\'=\\frac38x^{-5/2}$.',
    'At $x=1$: $f=1$, $f\'=\\frac12$, $f\'\'=-\\frac14$, $f\'\'\'=\\frac38$.',
    '$T_3(x)=\\sum_{n=0}^{3}\\dfrac{f^{(n)}(1)}{n!}(x-1)^{n}$',
    '$=1+\\dfrac{x-1}{2}+\\dfrac{-1/4}{2}(x-1)^{2}+\\dfrac{3/8}{6}(x-1)^{3} = 1+\\dfrac{x-1}{2}-\\dfrac{(x-1)^{2}}{8}+\\dfrac{(x-1)^{3}}{16}$',
  ],
  recall: 'Divide the $n$th derivative by $n!$, and keep every power centered at $a$.',
  viz: {
    kind: 'taylor', f: x => Math.sqrt(x), c: 1, xmin: 0.02, xmax: 4, fLabel: '√x',
    polys: [
      { n: 1, label: 'T₁', p: x => 1 + (x - 1) / 2 },
      { n: 3, label: 'T₃', p: x => 1 + (x - 1) / 2 - (x - 1) ** 2 / 8 + (x - 1) ** 3 / 16 },
    ],
    cap: '$T_3$ tracks $\\sqrt x$ closely near the centre $x=1$ and peels away as you move off — exactly what the $|x-a|^{4}$ error term predicts.',
  },
});

P.push({
  id: 'x-f26ci-0820-shifting', unit: 'techniques', topic: 'Strategy for Integration', diff: 3,
  src: 'Fall 2026 · Check-In 08/20',
  prompt: '**True or False.** The integral $\\displaystyle\\int (x-1)^{2}(x+5)^{3}\\,dx$ can be computed as a "shifting" integral.',
  choices: [
    { t: 'False', ok: true },
    { t: 'True', why: 'A shift needs the *whole* integrand to become a single power of $u$. Either $u=x-1$ (so $x+5=u+6$) or $u=x+5$ (so $x-1=u-6$) still leaves a **product of non-matching powers** — $\\int u^{2}(u+6)^{3}du$ — which you cannot integrate without expanding anyway.', err: 'conceptual' },
    { t: 'True, using $u = x-1$', why: 'That substitution is legal but does not finish the job: it gives $\\int u^{2}(u+6)^{3}du$, still a product needing expansion.', err: 'conceptual' },
    { t: 'Only if you expand first', why: 'Expanding is a valid route to the answer, but expanding is precisely *not* a shift — the claim being tested is about the shifting technique itself.', err: 'conceptual' },
  ],
  steps: [
    'A "shift" replaces $x$ by $u\\pm c$ to turn the integrand into a single power.',
    'There are only two candidates. $u=x-1$ gives $\\displaystyle\\int u^{2}(u+6)^{3}du$; $u=x+5$ gives $\\displaystyle\\int(u-6)^{2}u^{3}du$.',
    'Both still contain a product of mismatched powers — the shift did not collapse anything.',
    'Real options: expand and use the power rule, or use **tabular integration** (the $(x-1)^{2}$ factor differentiates to $0$ in three steps).',
  ],
  recall: 'A shift only helps when it leaves you with one power of $u$. Mismatched powers survive the shift.',
});

P.push({
  id: 'x-f26ci-0825-liate', unit: 'techniques', topic: 'Integration by Parts', diff: 3,
  src: 'Fall 2026 · Check-In 08/25',
  prompt: '**True or False.** To integrate $\\displaystyle\\int x e^{-3x^{2}}dx$, one uses LIATE to choose $u=x$ and $dv=e^{-3x^{2}}$.',
  choices: [
    { t: 'False', ok: true },
    { t: 'True', why: 'LIATE would suggest it, but the choice is unusable: $v=\\int e^{-3x^{2}}dx$ has **no elementary antiderivative** (it is the Gaussian). Never pick a $dv$ you cannot integrate.', err: 'conceptual' },
    { t: 'True, but you must integrate by parts twice', why: 'Repeating an impossible step does not help. The first $v$ cannot be found at all.', err: 'conceptual' },
    { t: 'False — you should choose $u=e^{-3x^{2}}$ instead', why: 'Right verdict, wrong reason. Parts is the wrong tool entirely: the $x$ out front is exactly $du$ for a plain substitution.', err: 'conceptual' },
  ],
  steps: [
    'Before applying LIATE, check that the proposed $dv$ can actually be integrated.',
    '$\\displaystyle\\int e^{-3x^{2}}dx$ is not elementary, so $v$ does not exist in closed form. Parts is dead on arrival.',
    'Look again: there is a lone $x$ beside $e^{-3x^{2}}$ — that is a **$u$-substitution** signal.',
    '$u=-3x^{2}$, $du=-6x\\,dx$: $\\displaystyle\\int xe^{-3x^{2}}dx = -\\frac16\\int e^{u}du = -\\frac{e^{-3x^{2}}}{6}+C$',
  ],
  recall: 'LIATE is a heuristic, not a law. It is overruled whenever the resulting $dv$ cannot be integrated — and always check for a plain $u$-sub first.',
});

P.push({
  id: 'x-f26ci-0827-looping', unit: 'techniques', topic: 'Tabular & Looping Parts', diff: 3,
  src: 'Fall 2026 · Check-In 08/27',
  prompt: '**True or False.** The integral $\\displaystyle\\int \\sin(2x)\\cos(3x)\\,dx$ can be treated as a "looping" integral.',
  choices: [
    { t: 'True', ok: true },
    { t: 'False', why: 'It genuinely loops. Applying parts twice returns a multiple of the original integral, and you solve for it algebraically — here you end up with $\\frac59\\int\\sin(2x)\\cos(3x)dx$ on one side.', err: 'conceptual' },
    { t: 'False — neither factor ever differentiates to zero', why: 'That is true, and it is exactly *why* it loops rather than terminating. Looping is the alternative to a terminating tabular column.', err: 'conceptual' },
    { t: 'True, but only with the product-to-sum identity', why: 'Product-to-sum is a second, faster route — but the question is whether looping works, and it does.', err: 'conceptual' },
  ],
  steps: [
    'Neither $\\sin(2x)$ nor $\\cos(3x)$ ever differentiates to $0$, so a tabular column never terminates — the signal for a **loop**.',
    'Take $u=\\sin(2x)$, $dv=\\cos(3x)dx$ and apply parts twice, keeping the choice consistent.',
    'The original integral reappears: $\\displaystyle\\int\\sin(2x)\\cos(3x)dx = \\frac{\\sin(2x)\\sin(3x)}{3}+\\frac{2\\cos(2x)\\cos(3x)}{9}+\\frac49\\int\\sin(2x)\\cos(3x)dx$',
    'Move it across: $\\frac59 I = \\cdots$, so $I=\\frac15\\left(3\\sin(2x)\\sin(3x)+2\\cos(2x)\\cos(3x)\\right)+C$. (Product-to-sum gives the same answer faster.)',
  ],
  recall: 'Terminating column → **tabular**. Repeating column → **looping**: apply parts twice, then solve for the integral algebraically.',
});

// =================================================================
// EXAM ARCHETYPE GENERATORS
// =================================================================

// ---- Exam 1: partial fractions over x(x²+1) ----------------------
G.push({
  id: 'gx-pf-irreducible', unit: 'techniques', topic: 'Partial Fractions', diff: 3,
  src: 'modelled on Fall 2025 Exam 1 Q6',
  make(r) {
    const p = r.nz(2, 7) * (r.pick([1, -1])), q = r.nz(1, 4);
    let rr = r.nz(2, 5) * (r.pick([1, -1]));
    while (rr === p) rr = r.nz(2, 5) * (r.pick([1, -1]));   // B = 0 would delete a whole term
    const B = p - rr;
    // every coefficient goes through sgn/sfrac — pasted numbers produce
    // "+-3/2", "+0\ln(...)" and "+1\arctan x" for perfectly ordinary values
    const num = `${sgn(p, 'x^{2}', true)}${sgn(q, 'x')}${sgn(rr, '')}`;
    const logx = sgn(rr, '\\ln|x|', true);
    const logq = sfrac(B, 2, '\\ln(x^{2}+1)');
    const atan = sgn(q, '\\arctan x');
    const key = `$${logx}${logq}${atan}+C$`;
    return {
      prompt: `Compute $\\displaystyle\\int \\frac{${num}}{x^{3}+x}\\,dx$.`,
      choices: [
        { t: key, ok: true },
        ...choose(key, [
          { t: `$${logx}${sgn(B, '\\ln(x^{2}+1)')}${atan}+C$`, why: 'The $\\frac{Bx}{x^{2}+1}$ term integrates to $\\frac{B}{2}\\ln(x^{2}+1)$ — the $\\frac12$ comes from $du=2x\\,dx$.', err: 'dropped-factor' },
          { t: `$${logx}${logq}+C$`, why: 'The constant part of the numerator over $x^{2}+1$ gives an **arctangent** term, which you dropped.', err: 'dropped-factor' },
          { t: `$${logx}${sfrac(B, 2, '\\ln|x^{2}+1|')}${sgn(q, '\\ln|x^{2}+1|')}+C$`, why: '$\\int\\frac{dx}{x^{2}+1}=\\arctan x$, not a logarithm. Only $\\frac{u\'}{u}$ shapes give logs.', err: 'formula-confusion' },
          { t: `$\\ln\\left|\\dfrac{${num}}{x^{3}+x}\\right|+C$`, why: 'You treated the whole fraction as $\\frac{u\'}{u}$. The numerator is not the derivative of the denominator.', err: 'formula-confusion' },
          { t: `$${logx}${logq}${sgn(q, '\\arctan(x^{2})')}+C$`, why: 'The arctangent comes from $\\int\\frac{du}{u^{2}+1}$ with $u=x$, so the argument stays $x$.', err: 'chain-rule' },
        ]),
      ],
      steps: [
        `Factor the denominator: $x^{3}+x = x(x^{2}+1)$, with $x^{2}+1$ **irreducible**.`,
        `Set up $\\dfrac{${num}}{x(x^{2}+1)} = \\dfrac{A}{x}+\\dfrac{Bx+C}{x^{2}+1}$ — a linear numerator over the quadratic.`,
        `Clearing denominators gives $A+B=${p}$ (the $x^{2}$ coefficient), $C=${q}$, $A=${rr}$. So $A=${rr}$, $B=${B}$, $C=${q}$.`,
        `$\\displaystyle\\int\\left[\\frac{${rr}}{x}+\\frac{${lin(B, q)}}{x^{2}+1}\\right]dx = ${logx}${logq}${atan}+C$`,
      ],
    recall: 'Irreducible quadratic → $Bx+C$ on top. The $Bx$ part gives $\\frac B2\\ln$, the $C$ part gives $\\arctan$. Two different antiderivatives from one fraction.',
    };
  },
});

// ---- Exam 1: improper with an interior singularity ---------------
G.push({
  id: 'gx-improper-interior', unit: 'techniques', topic: 'Improper Integrals', diff: 3,
  src: 'modelled on Fall 2025 Exam 1 Q4',
  make(r) {
    const c = r.int(2, 7);
    const lo = c - r.int(1, 2), hi = c + r.int(1, 2);
    const key = 'Diverges';
    return {
      prompt: `Determine whether $\\displaystyle\\int_{${lo}}^{${hi}}\\frac{dx}{x-${c}}$ converges or diverges. If it converges, find its value.`,
      choices: [
        { t: key, ok: true },
        ...choose(key, [
          { t: '$0$', why: `The integrand blows up at $x=${c}$, which lies **inside** $[${lo},${hi}]$. Antidifferentiating straight through gives a fake cancellation to $0$ — but FTC requires continuity on the whole closed interval.`, err: 'conceptual' },
          { t: `$\\ln\\left(\\dfrac{${hi - c}}{${c - lo}}\\right)$`, why: 'That is what you get by ignoring the singularity entirely. Both one-sided limits are infinite, so no finite value exists.', err: 'conceptual' },
          { t: `Converges to $\\ln ${hi - c}$`, why: 'You evaluated only one side. Each half has to be tested separately, and both diverge.', err: 'conceptual' },
          { t: 'Converges, by symmetry the two halves cancel', why: 'Cancellation requires both halves to be **finite**. Here they are $-\\infty$ and $+\\infty$, which cannot be added.', err: 'conceptual' },
        ]),
      ],
      steps: [
        `Check the interval before anything else: the integrand is undefined at $x=${c}$, and $${lo}<${c}<${hi}$.`,
        `Split at the singularity: $\\displaystyle\\int_{${lo}}^{${c}}+\\int_{${c}}^{${hi}}$.`,
        `$\\displaystyle\\lim_{t\\to${c}^{-}}\\left[\\ln|x-${c}|\\right]_{${lo}}^{t}=-\\infty$ — the left piece already diverges.`,
        'A single divergent piece makes the whole integral divergent.',
      ],
      recall: 'Interior singularities are the most commonly missed improper integrals. Always scan the interval first.',
      viz: {
        kind: 'improper', f: x => 1 / (x - c), a: lo, b: hi, xmin: lo, clip: 10, ymin: -10,
        shadeFrom: lo, shadeTo: hi, vertical: c, verticalLabel: `x = ${c}`,
        tag: `1/(x−${c}) on [${lo},${hi}]`,
        cap: 'Unbounded in opposite directions on the two sides. Infinities of opposite sign do not cancel.',
      },
    };
  },
});

// ---- Exam 1: parts producing a log -------------------------------
G.push({
  id: 'gx-parts-lnroot', unit: 'techniques', topic: 'Integration by Parts', diff: 2,
  src: 'modelled on Fall 2025 Final Q1',
  make(r) {
    const k = r.pick([2, 3, 4]);   // ∫ ln x / x^{1/k}... keep it to the sqrt case family
    const key = '$2\\sqrt{x}\\ln x-4\\sqrt{x}+C$';
    if (k === 2) {
      return {
        prompt: 'Compute $\\displaystyle\\int \\frac{\\ln x}{\\sqrt{x}}\\,dx$.',
        choices: [
          { t: key, ok: true },
          ...choose(key, [
            { t: '$2\\sqrt{x}\\ln x-2\\sqrt{x}+C$', why: 'The leftover integral is $\\int\\frac{2\\sqrt x}{x}dx = 2\\int x^{-1/2}dx = 4\\sqrt x$, not $2\\sqrt x$.', err: 'algebra-slip' },
            { t: '$2\\sqrt{x}\\ln x+4\\sqrt{x}+C$', why: 'Parts **subtracts** $\\int v\\,du$.', err: 'sign' },
            { t: '$\\dfrac{(\\ln x)^{2}}{2}\\cdot 2\\sqrt{x}+C$', why: 'Both factors integrated separately — not a valid operation.', err: 'formula-confusion' },
            { t: '$\\dfrac{2(\\ln x)^{2}}{\\sqrt{x}}+C$', why: 'That would need $\\frac{dx}{x}$ present to serve as $du$. Here $dv=x^{-1/2}dx$.', err: 'formula-confusion' },
          ]),
        ],
        steps: [
          'LIATE: $u=\\ln x$ (Log wins), $dv=x^{-1/2}dx$.',
          '$du=\\dfrac{dx}{x}$, $v=2\\sqrt{x}$.',
          'Rule of 7: $\\;2\\sqrt{x}\\ln x-\\displaystyle\\int\\frac{2\\sqrt{x}}{x}dx = 2\\sqrt{x}\\ln x-2\\int x^{-1/2}dx$',
          '$=2\\sqrt{x}\\ln x-4\\sqrt{x}+C = 2\\sqrt{x}\\left(\\ln x-2\\right)+C$',
        ],
        recall: 'A lone $\\ln x$ over a power is always parts with $u=\\ln x$. Simplify $\\frac{v}{x}$ before integrating again.',
      };
    }
    const a = k;
    const key2 = `$\\dfrac{x^{${a + 1}}\\ln x}{${a + 1}}-\\dfrac{x^{${a + 1}}}{${(a + 1) ** 2}}+C$`;
    return {
      prompt: `Compute $\\displaystyle\\int x^{${a}}\\ln x\\,dx$.`,
      choices: [
        { t: key2, ok: true },
        ...choose(key2, [
          { t: `$\\dfrac{x^{${a + 1}}\\ln x}{${a + 1}}+\\dfrac{x^{${a + 1}}}{${(a + 1) ** 2}}+C$`, why: 'Parts subtracts the second integral.', err: 'sign' },
          { t: `$\\dfrac{x^{${a + 1}}\\ln x}{${a + 1}}-\\dfrac{x^{${a + 1}}}{${a + 1}}+C$`, why: `The leftover $\\frac{1}{${a + 1}}\\int x^{${a}}dx$ divides by $${a + 1}$ a **second** time.`, err: 'algebra-slip' },
          { t: `$\\dfrac{x^{${a + 1}}}{${a + 1}}\\cdot\\dfrac{1}{x}+C$`, why: 'That is $v\\cdot du$. The formula is $uv-\\int v\\,du$.', err: 'formula-confusion' },
        ]),
      ],
      steps: [
        `LIATE: $u=\\ln x$, $dv=x^{${a}}dx$, so $v=\\frac{x^{${a + 1}}}{${a + 1}}$.`,
        `$\\dfrac{x^{${a + 1}}\\ln x}{${a + 1}}-\\dfrac{1}{${a + 1}}\\displaystyle\\int x^{${a}}dx$`,
        `$= \\dfrac{x^{${a + 1}}\\ln x}{${a + 1}}-\\dfrac{x^{${a + 1}}}{${(a + 1) ** 2}}+C$`,
      ],
      recall: '$u=\\ln x$ turns the leftover into a plain power-rule integral.',
    };
  },
});

// ---- Exam 2: series archetypes -----------------------------------
G.push({
  id: 'gx-series-geomsigned', unit: 'series', topic: 'Geometric & Telescoping', diff: 3,
  src: 'modelled on Fall 2025 Exam 2 Q2',
  make(r) {
    const a = r.int(2, 5), b = r.int(2, 4);
    // sum_{n=1}^inf (-a)^{n+1}/b^{2n} = a^2/(b^2+a)
    const num = a * a, den = b * b + a;
    const key = `Converges to $${frac(num, den)}$`;
    return {
      prompt: `Determine whether $\\displaystyle\\sum_{n=1}^{\\infty}\\frac{(-${a})^{n+1}}{${b}^{2n}}$ converges. If it converges, find its sum.`,
      choices: [
        { t: key, ok: true },
        ...choose(key, [
          { t: `Converges to $${frac(num, b * b - a)}$`, why: `Sign slip in the denominator. With $r=-\\frac{${a}}{${b * b}}$, $1-r = 1+\\frac{${a}}{${b * b}}$ — the ratio is negative, so subtracting it **adds**.`, err: 'sign' },
          { t: 'Diverges', why: `$|r|=\\frac{${a}}{${b * b}}<1$, so it converges. The alternating sign does not cause divergence.`, err: 'conceptual' },
          { t: `Converges to $${frac(a, den)}$`, why: `The first term (at $n=1$) is $\\frac{(-${a})^{2}}{${b * b}}=\\frac{${a * a}}{${b * b}}$, not $\\frac{${a}}{${b * b}}$ — the exponent is $n+1$.`, err: 'off-by-one' },
          { t: `Converges to $${frac(num, b * b)}$`, why: 'You reported the first term rather than the sum. Divide it by $1-r$.', err: 'formula-confusion' },
        ]),
      ],
      steps: [
        `Rewrite so the ratio is visible: $\\dfrac{(-${a})^{n+1}}{${b}^{2n}} = \\dfrac{(-${a})^{n+1}}{${b * b}^{\\,n}}$.`,
        `This is geometric with $r=-\\dfrac{${a}}{${b * b}}$, and $|r|<1$, so it converges.`,
        `First term (at $n=1$): $\\dfrac{(-${a})^{2}}{${b * b}}=\\dfrac{${a * a}}{${b * b}}$.`,
        `$S=\\dfrac{a}{1-r}=\\dfrac{${a * a}/${b * b}}{1+\\frac{${a}}{${b * b}}}=\\dfrac{${a * a}}{${b * b}+${a}}=${frac(num, den)}$`,
      ],
      recall: 'Rewrite $b^{2n}$ as $(b^{2})^{n}$ to expose $r$, and read the first term at the actual starting index.',
    };
  },
});

G.push({
  id: 'gx-series-limcomp-root', unit: 'series', topic: 'Limit Comparison', diff: 3,
  src: 'modelled on Fall 2025 Exam 2 Q3',
  make(r) {
    const c = r.int(2, 6), k = r.pick([4, 9, 16, 25]);
    const s = Math.sqrt(k);
    const key = 'Diverges, by comparison with $\\sum\\frac1n$';
    return {
      prompt: `Determine whether $\\displaystyle\\sum_{n=1}^{\\infty}\\frac{n+${c}}{\\sqrt{${k}n^{4}-2}}$ converges or diverges.`,
      choices: [
        { t: key, ok: true },
        ...choose(key, [
          { t: 'Converges, by comparison with $\\sum\\frac{1}{n^{2}}$', why: `The square root halves the exponent: $\\sqrt{${k}n^{4}}=${s}n^{2}$. The terms behave like $\\frac{n}{${s}n^{2}}=\\frac{1}{${s}n}$, which is harmonic — not $\\frac{1}{n^{2}}$.`, err: 'power-rule' },
          { t: 'Converges, by comparison with $\\sum\\frac{1}{n^{3/2}}$', why: 'Compare leading behaviour carefully: numerator degree $1$, denominator degree $2$ after the root. The difference is $1$, giving $\\frac1n$.', err: 'power-rule' },
          { t: 'Diverges, by the Divergence Test', why: `The terms do tend to $0$ (like $\\frac{1}{${s}n}$), so the Divergence Test is inconclusive. You need a comparison.`, err: 'conceptual' },
          { t: 'Converges, by the Ratio Test', why: 'Rational-in-$n$ terms always give $L=1$ on the Ratio Test — it can never conclude here.', err: 'conceptual' },
        ]),
      ],
      steps: [
        `Leading behaviour: $\\sqrt{${k}n^{4}-2}\\sim\\sqrt{${k}n^{4}}=${s}n^{2}$.`,
        `So $a_n\\sim\\dfrac{n}{${s}n^{2}}=\\dfrac{1}{${s}n}$ — take $b_n=\\frac1n$.`,
        `$\\displaystyle\\lim_{n\\to\\infty}\\frac{a_n}{b_n}=\\frac{1}{${s}}$, finite and nonzero, so both series do the same thing.`,
        `$\\sum\\frac1n$ is the harmonic series, which **diverges**. Therefore the given series diverges.`,
      ],
      recall: 'A square root halves the degree. $\\sqrt{n^{4}}=n^{2}$ — getting this wrong flips the verdict.',
    };
  },
});

G.push({
  id: 'gx-series-roottest', unit: 'series', topic: 'Ratio & Root Tests', diff: 3,
  src: 'modelled on Fall 2025 Exam 2 Q4',
  make(r) {
    const a = r.int(3, 7);
    let c = r.int(2, 6);
    while (c === a) c = r.int(2, 6);
    const conv = a < c;
    const key = conv ? `Converges, since $L=${frac(a, c)}<1$` : `Diverges, since $L=${frac(a, c)}>1$`;
    return {
      prompt: `Determine whether $\\displaystyle\\sum_{n=1}^{\\infty}\\left(\\frac{${a}n^{2}+5}{${c}n(n+1)}\\right)^{n}$ converges or diverges.`,
      choices: [
        { t: key, ok: true },
        ...choose(key, [
          { t: conv ? `Diverges, since $L=${frac(c, a)}>1$` : `Converges, since $L=${frac(c, a)}<1$`, why: `The ratio is inverted. The leading coefficients give $\\lim\\frac{${a}n^{2}}{${c}n^{2}}=${frac(a, c)}$.`, err: 'inverted' },
          { t: 'The Root Test is inconclusive', why: `$L=${frac(a, c)}\\ne1$, so the test decides. Inconclusive requires exactly $L=1$.`, err: 'conceptual' },
          { t: 'Converges, by the Divergence Test', why: 'The Divergence Test can never prove convergence — it only ever concludes divergence.', err: 'conceptual' },
          { t: 'Diverges, by comparison with $\\sum\\frac1n$', why: 'The whole term is raised to the $n$th power, which is the Root Test signal. Comparison with a $p$-series does not apply.', err: 'conceptual' },
        ]),
      ],
      steps: [
        'The entire term is an $n$th power — that is the **Root Test** signal.',
        `$\\sqrt[n]{|a_n|}=\\dfrac{${a}n^{2}+5}{${c}n(n+1)}$`,
        `$\\displaystyle\\lim_{n\\to\\infty}\\frac{${a}n^{2}+5}{${c}n^{2}+${c}n}=\\frac{${a}}{${c}}=${frac(a, c)}$`,
        `$L=${frac(a, c)}${conv ? '<1$, so the series **converges**.' : '>1$, so the series **diverges**.'}`,
      ],
      recall: 'Whole term to the $n$th power → Root Test. The $n$th root cancels the exponent and leaves a plain limit.',
    };
  },
});

G.push({
  id: 'gx-series-telescope', unit: 'series', topic: 'Geometric & Telescoping', diff: 2,
  src: 'modelled on Fall 2025 Exam 2 Q7',
  make(r) {
    const start = r.pick([0, 1]);
    const a = r.int(1, 3);
    const first = start + a;   // sum = 1/(start+a)
    const key = `Converges to $${frac(1, first)}$`;
    return {
      prompt: `Determine whether $\\displaystyle\\sum_{n=${start}}^{\\infty}\\left(\\frac{1}{n+${a}}-\\frac{1}{n+${a + 1}}\\right)$ converges. If it converges, find its sum.`,
      choices: [
        { t: key, ok: true },
        ...choose(key, [
          { t: `Converges to $${frac(1, first + 1)}$`, why: `Off by one on the starting index. At $n=${start}$ the surviving first term is $\\frac{1}{${start}+${a}}=${frac(1, first)}$.`, err: 'off-by-one' },
          { t: 'Converges to $0$', why: 'The terms tend to $0$, but the **sum** is the limit of the partial sums, which is the first surviving term.', err: 'conceptual' },
          { t: 'Diverges', why: 'The partial sums telescope to $\\frac{1}{' + first + '}-\\frac{1}{N+' + (a + 1) + '}$, which converges.', err: 'conceptual' },
          { t: `Converges to $${frac(2, first)}$`, why: 'Only one term survives at the front, not two. Write out $s_N$ explicitly.', err: 'algebra-slip' },
        ]),
      ],
      steps: [
        'Write out the partial sum and watch the cancellation:',
        `$s_N=\\left(\\frac{1}{${first}}-\\frac{1}{${first + 1}}\\right)+\\left(\\frac{1}{${first + 1}}-\\frac{1}{${first + 2}}\\right)+\\cdots$`,
        `Everything cancels except the very first and the very last: $s_N=\\dfrac{1}{${first}}-\\dfrac{1}{N+${a + 1}}$.`,
        `$\\displaystyle\\lim_{N\\to\\infty}s_N=\\frac{1}{${first}}=${frac(1, first)}$`,
      ],
      recall: 'Telescoping: write $s_N$ out and see exactly what survives at each end. Never guess.',
    };
  },
});

G.push({
  id: 'gx-series-divtest-exp', unit: 'series', topic: 'Divergence & Integral Tests', diff: 2,
  src: 'modelled on Fall 2025 Exam 2 Q8 / Spring 2026 Final Q6',
  make(r) {
    const kind = r.pick(['exp', 'rat']);
    if (kind === 'exp') {
      const key = 'Diverges, since the terms tend to $1$';
      return {
        prompt: 'Determine whether $\\displaystyle\\sum_{n=1}^{\\infty}\\frac{e^{n}-1}{e^{n}+1}$ converges or diverges.',
        choices: [
          { t: key, ok: true },
          ...choose(key, [
            { t: 'Converges, since the terms tend to $1$', why: 'Terms tending to a **nonzero** limit force divergence — you are adding roughly $1$ infinitely often.', err: 'conceptual' },
            { t: 'Diverges, since the terms tend to $\\infty$', why: 'The terms are bounded: dividing through by $e^{n}$ gives $\\frac{1-e^{-n}}{1+e^{-n}}\\to1$. Bounded, but not zero.', err: 'algebra-slip' },
            { t: 'Converges by the Ratio Test', why: 'The Ratio Test gives $L=1$ here and cannot conclude. The Divergence Test settles it in one line.', err: 'conceptual' },
            { t: 'Converges, since it behaves like a geometric series', why: 'There is no constant ratio — the terms flatten out at $1$ rather than shrinking geometrically.', err: 'conceptual' },
          ]),
        ],
        steps: [
          'Always check $\\lim a_n$ first — it is free.',
          'Divide numerator and denominator by $e^{n}$: $\\dfrac{1-e^{-n}}{1+e^{-n}}$.',
          'As $n\\to\\infty$, $e^{-n}\\to0$, so $a_n\\to\\dfrac{1-0}{1+0}=1\\ne0$.',
          'By the Divergence Test the series **diverges**.',
        ],
        recall: 'Check $\\lim a_n$ before anything else. A nonzero limit ends the problem immediately.',
        viz: {
          kind: 'series', a: n => (Math.exp(n) - 1) / (Math.exp(n) + 1), N: 16, start: 1,
          limit: 1, limitLabel: 'terms → 1',
          cap: 'The terms flatten at $1$, so every additional term adds about $1$ to the running total. No ceiling.',
        },
      };
    }
    const p = r.int(2, 6);
    let q = r.int(2, 8);
    while (q === p) q = r.int(2, 8);
    const c = r.int(1, 6), d = r.int(1, 5);
    const key = `Diverges, since the terms tend to $${frac(p, q)}\\ne0$`;
    return {
      prompt: `Determine whether $\\displaystyle\\sum_{n=1}^{\\infty}\\frac{${p}n+${c}}{${q}n-${d}}$ converges or diverges.`,
      choices: [
        { t: key, ok: true },
        ...choose(key, [
          { t: `Converges to $${frac(p, q)}$`, why: `$${frac(p, q)}$ is the limit of the **terms**, not the sum. A series whose terms do not vanish cannot converge at all.`, err: 'conceptual' },
          { t: 'Converges, by limit comparison with $\\sum\\frac1n$', why: `Limit comparison is unnecessary — and $\\sum\\frac1n$ diverges anyway. The terms here tend to $${frac(p, q)}\\ne0$, so the Divergence Test applies directly.`, err: 'conceptual' },
          { t: 'Diverges, since the terms tend to $\\infty$', why: 'Numerator and denominator are both degree $1$, so the ratio settles at a finite nonzero number.', err: 'algebra-slip' },
          { t: 'The Divergence Test is inconclusive', why: `Inconclusive only when $\\lim a_n=0$. Here the limit is $${frac(p, q)}\\ne0$.`, err: 'conceptual' },
        ]),
      ],
      steps: [
        `Equal degrees top and bottom, so $\\displaystyle\\lim_{n\\to\\infty}\\frac{${p}n+${c}}{${q}n-${d}}=\\frac{${p}}{${q}}=${frac(p, q)}$.`,
        'That limit is **not** zero.',
        'Divergence Test: if $\\lim a_n\\ne0$, the series diverges.',
        'Done in one line — no comparison needed.',
      ],
      recall: 'A ratio of equal-degree polynomials never tends to $0$, so such a series always diverges.',
    };
  },
});

G.push({
  id: 'gx-series-abscond', unit: 'series', topic: 'Alternating Series & Error', diff: 3,
  src: 'modelled on Fall 2025 Exam 2 Q1 / Final Q8',
  make(r) {
    const kind = r.pick(['sqrt', 'linear']);
    if (kind === 'sqrt') {
      const key = 'Conditionally convergent';
      return {
        prompt: 'Determine whether $\\displaystyle\\sum_{n=1}^{\\infty}(-1)^{n}\\,\\frac{\\sqrt{n}}{n+1}$ is divergent, conditionally convergent, or absolutely convergent.',
        choices: [
          { t: key, ok: true },
          ...choose(key, [
            { t: 'Absolutely convergent', why: 'Check $\\sum\\left|a_n\\right|=\\sum\\frac{\\sqrt n}{n+1}$. That behaves like $\\frac{n^{1/2}}{n}=\\frac{1}{n^{1/2}}$, a $p$-series with $p=\\frac12\\le1$, which **diverges**.', err: 'conceptual' },
            { t: 'Divergent', why: 'The Alternating Series Test applies: $\\frac{\\sqrt n}{n+1}$ is eventually decreasing and tends to $0$, so the series does converge.', err: 'conceptual' },
            { t: 'Divergent, by the Divergence Test', why: '$\\frac{\\sqrt n}{n+1}\\to0$, so the Divergence Test is inconclusive here.', err: 'conceptual' },
          ]),
        ],
        steps: [
          '**Step 1 — absolute convergence.** $\\left|a_n\\right|=\\dfrac{\\sqrt n}{n+1}\\sim\\dfrac{n^{1/2}}{n}=\\dfrac{1}{n^{1/2}}$.',
          'That is a $p$-series with $p=\\frac12\\le1$: **diverges**. So not absolutely convergent.',
          '**Step 2 — the alternating series itself.** $b_n=\\frac{\\sqrt n}{n+1}$ is positive, eventually decreasing, and $\\to0$.',
          'The AST gives convergence. Converges but not absolutely ⟹ **conditionally convergent**.',
        ],
        recall: 'Always test $\\sum|a_n|$ first. Diverging there but converging by AST is the definition of conditional convergence.',
      };
    }
    const a = r.int(3, 9), b = r.int(2, 4);
    const key = 'Conditionally convergent';
    return {
      prompt: `Determine whether $\\displaystyle\\sum_{n=1}^{\\infty}\\frac{(-1)^{n-1}}{${a}+${b}n}$ is divergent, conditionally convergent, or absolutely convergent.`,
      choices: [
        { t: key, ok: true },
        ...choose(key, [
          { t: 'Absolutely convergent', why: `$\\sum\\frac{1}{${a}+${b}n}$ behaves like $\\frac{1}{${b}n}$ — harmonic, which diverges. So it is not absolute.`, err: 'conceptual' },
          { t: 'Divergent', why: 'The terms decrease to $0$ and alternate, so the AST gives convergence.', err: 'conceptual' },
          { t: 'Absolutely convergent, by the Ratio Test', why: 'The Ratio Test returns $L=1$ for rational terms and cannot conclude.', err: 'conceptual' },
        ]),
      ],
      steps: [
        `**Absolute?** $\\sum\\dfrac{1}{${a}+${b}n}$ limit-compares with $\\sum\\frac1n$ (limit $\\frac{1}{${b}}$), which diverges. Not absolutely convergent.`,
        `**AST?** $b_n=\\dfrac{1}{${a}+${b}n}$ is positive, decreasing, and $\\to0$. ✓`,
        'The series converges by the Alternating Series Test.',
        'Converges, but not absolutely ⟹ **conditionally convergent**.',
      ],
      recall: 'Alternating over a linear denominator is the standard conditionally-convergent shape.',
    };
  },
});

// ---- Exam 3: power series radius & interval ----------------------
G.push({
  id: 'gx-ps-factorial', unit: 'series', topic: 'Power Series & Radius', diff: 3,
  src: 'modelled on Fall 2025 Exam 3 Q3 / Spring 2026 Final Q11',
  make(r) {
    const c = r.nz(1, 6);
    const cs = c > 0 ? `x+${c}` : `x-${-c}`;
    const center = -c;
    const key = `$R=0$; converges only at $x=${center}$`;
    return {
      prompt: `Find the center, radius and interval of convergence of $\\displaystyle\\sum_{n=0}^{\\infty} n!\\,(${cs})^{n}$.`,
      choices: [
        { t: key, ok: true },
        ...choose(key, [
          { t: `$R=\\infty$; converges for all $x$`, why: 'The factorial is in the **numerator** here, which makes the ratio blow up rather than vanish. A denominator factorial gives $R=\\infty$; a numerator factorial gives $R=0$.', err: 'inverted' },
          { t: `$R=1$; interval $(${center - 1},${center + 1})$`, why: 'The default guess. Run the Ratio Test: $\\lim|(n+1)(x-c)|=\\infty$ for every $x\\ne c$.', err: 'conceptual' },
          { t: `$R=0$; converges only at $x=${-center}$`, why: `Sign of the centre. The series is in powers of $(${cs})$, which vanishes at $x=${center}$.`, err: 'sign' },
          { t: `$R=1$; interval $[${center - 1},${center + 1}]$`, why: 'Both the radius and the endpoint reasoning are off — the Ratio Test limit is infinite for every $x$ except the centre.', err: 'conceptual' },
        ]),
      ],
      steps: [
        `Ratio Test: $\\left|\\dfrac{(n+1)!\\,(${cs})^{n+1}}{n!\\,(${cs})^{n}}\\right| = (n+1)\\left|${cs}\\right|$.`,
        `As $n\\to\\infty$ this $\\to\\infty$ unless $\\left|${cs}\\right|=0$.`,
        `So the series converges **only** at the centre, $x=${center}$.`,
        `$R=0$, interval $\\{${center}\\}$.`,
      ],
      recall: 'Factorial on top → $R=0$. Factorial on the bottom → $R=\\infty$. Read which side it is on before computing.',
      viz: { kind: 'interval', center, R: 0, cap: 'A single point. The series is useless as a function — it converges nowhere else.' },
    };
  },
});

G.push({
  id: 'gx-ps-halfopen', unit: 'series', topic: 'Power Series & Radius', diff: 3,
  src: 'modelled on Fall 2025 Final Q12 / Spring 2026 Final Q12',
  make(r) {
    const a = r.int(2, 5), c = r.nz(1, 4);
    const cs = c > 0 ? `x-${c}` : `x+${-c}`;
    const lo = c - a, hi = c + a;
    const key = `$R=${a}$, interval $[${lo},\\,${hi})$`;
    return {
      prompt: `Find the radius and interval of convergence of $\\displaystyle\\sum_{n=1}^{\\infty}\\frac{(${cs})^{n}}{n\\,${a}^{n}}$.`,
      choices: [
        { t: key, ok: true },
        ...choose(key, [
          { t: `$R=${a}$, interval $(${lo},\\,${hi})$`, why: `You never tested the endpoints. At $x=${lo}$ the series becomes $\\sum\\frac{(-1)^{n}}{n}$, which **converges** by the AST — so the left endpoint is included.`, err: 'off-by-one' },
          { t: `$R=${a}$, interval $[${lo},\\,${hi}]$`, why: `At $x=${hi}$ the series becomes the harmonic series $\\sum\\frac1n$, which diverges. The right endpoint is excluded.`, err: 'off-by-one' },
          { t: `$R=${a}$, interval $(${lo},\\,${hi}]$`, why: `The two endpoints are swapped. $x=${lo}$ gives the convergent alternating harmonic series; $x=${hi}$ gives the divergent harmonic series.`, err: 'inverted' },
          { t: `$R=${frac(1, a)}$, interval $\\left(${c}-${frac(1, a)},\\,${c}+${frac(1, a)}\\right)$`, why: `Radius inverted. From $\\frac{|${cs}|}{${a}}<1$ you get $|${cs}|<${a}$.`, err: 'inverted' },
        ]),
      ],
      steps: [
        `Ratio Test: $\\left|\\dfrac{a_{n+1}}{a_n}\\right| = \\dfrac{|${cs}|}{${a}}\\cdot\\dfrac{n}{n+1}\\to\\dfrac{|${cs}|}{${a}}$.`,
        `Converges when $\\dfrac{|${cs}|}{${a}}<1$, i.e. $|${cs}|<${a}$. So $R=${a}$, centred at $x=${c}$.`,
        `**Right endpoint** $x=${hi}$: the series becomes $\\sum\\frac{1}{n}$ — harmonic, **diverges**. Excluded.`,
        `**Left endpoint** $x=${lo}$: the series becomes $\\sum\\frac{(-1)^{n}}{n}$ — alternating harmonic, **converges**. Included. Interval $[${lo},${hi})$.`,
      ],
      recall: 'The $\\frac1n$ factor is what makes the endpoints behave differently. Always substitute both and test them as numerical series.',
      viz: {
        kind: 'interval', center: c, R: a, leftClosed: true, rightClosed: false,
        leftLabel: `${lo} (converges)`, rightLabel: `${hi} (diverges)`,
        note: `R = ${a}, centre ${c}`,
        cap: 'Filled = included, hollow = excluded. The two ends genuinely differ here.',
      },
    };
  },
});

G.push({
  id: 'gx-taylor-sub', unit: 'series', topic: 'Taylor & Maclaurin Series', diff: 3,
  src: 'modelled on Fall 2025 Exam 3 Q4 / Final Q13',
  make(r) {
    const k = r.int(2, 4);
    const key = `$\\displaystyle\\sum_{n=0}^{\\infty}(-1)^{n}\\,\\frac{x^{${2 * k}n+1}}{(2n)!}$`;
    return {
      prompt: `Use the Maclaurin series for $\\cos x$ to find the Maclaurin series for $x\\cos\\!\\left(x^{${k}}\\right)$.`,
      choices: [
        { t: key, ok: true },
        ...choose(key, [
          { t: `$\\displaystyle\\sum_{n=0}^{\\infty}(-1)^{n}\\,\\frac{x^{${2 * k}n}}{(2n)!}$`, why: 'You substituted correctly but forgot to multiply the whole series by the outside $x$, which raises every exponent by $1$.', err: 'dropped-factor' },
          { t: `$\\displaystyle\\sum_{n=0}^{\\infty}(-1)^{n}\\,\\frac{x^{${2 * k}n+1}}{(${2 * k}n)!}$`, why: 'Only the **variable** gets substituted. The factorial index stays $(2n)!$ — it counts terms, not powers.', err: 'formula-confusion' },
          { t: `$\\displaystyle\\sum_{n=0}^{\\infty}\\frac{x^{${2 * k}n+1}}{(2n)!}$`, why: 'The alternating factor $(-1)^{n}$ belongs to the cosine series and survives substitution.', err: 'sign' },
          { t: `$\\displaystyle\\sum_{n=0}^{\\infty}(-1)^{n}\\,\\frac{x^{${k}n+1}}{(2n)!}$`, why: `$\\left(x^{${k}}\\right)^{2n}=x^{${2 * k}n}$ — multiply the exponents, do not just copy $${k}$.`, err: 'power-rule' },
        ]),
      ],
      steps: [
        `Start from the known series: $\\cos u=\\displaystyle\\sum_{n=0}^{\\infty}(-1)^{n}\\frac{u^{2n}}{(2n)!}$, valid for all $u$.`,
        `Substitute $u=x^{${k}}$: $\\;\\cos\\!\\left(x^{${k}}\\right)=\\displaystyle\\sum_{n=0}^{\\infty}(-1)^{n}\\frac{\\left(x^{${k}}\\right)^{2n}}{(2n)!}=\\sum_{n=0}^{\\infty}(-1)^{n}\\frac{x^{${2 * k}n}}{(2n)!}$`,
        `Multiply through by the outside $x$, which bumps every exponent by $1$:`,
        `$x\\cos\\!\\left(x^{${k}}\\right)=\\displaystyle\\sum_{n=0}^{\\infty}(-1)^{n}\\frac{x^{${2 * k}n+1}}{(2n)!}$`,
      ],
      recall: 'Substitute into the variable only, then distribute any outside factor. Factorials never change.',
    };
  },
});

G.push({
  id: 'gx-taylor-t3', unit: 'series', topic: 'Taylor Polynomials & Error', diff: 3,
  src: 'modelled on Fall 2025 Final Q15 / Spring 2026 Final Q13',
  make(r) {
    const which = r.pick(['sqrt1x', 'invx', 'lnx']);
    if (which === 'sqrt1x') {
      const key = '$1+\\dfrac{x}{2}-\\dfrac{x^{2}}{8}+\\dfrac{x^{3}}{16}$';
      return {
        prompt: 'Find the third-degree Taylor polynomial $T_{3}(x)$ centered at $x=0$ for $f(x)=\\sqrt{x+1}$.',
        choices: [
          { t: key, ok: true },
          ...choose(key, [
            { t: '$1+\\dfrac{x}{2}-\\dfrac{x^{2}}{4}+\\dfrac{3x^{3}}{8}$', why: 'You used $f^{(n)}(0)$ without dividing by $n!$. The coefficients are $\\frac{f^{(n)}(0)}{n!}$.', err: 'dropped-factor' },
            { t: '$1+\\dfrac{x}{2}+\\dfrac{x^{2}}{8}+\\dfrac{x^{3}}{16}$', why: '$f\'\'(0)=-\\frac14$ is negative, so the quadratic term is negative.', err: 'sign' },
            { t: '$1+x-\\dfrac{x^{2}}{2}+\\dfrac{x^{3}}{3}$', why: 'Those are the coefficients of $\\ln(1+x)$, a different function.', err: 'formula-confusion' },
          ]),
        ],
        steps: [
          '$f=(1+x)^{1/2}$, $f\'=\\frac12(1+x)^{-1/2}$, $f\'\'=-\\frac14(1+x)^{-3/2}$, $f\'\'\'=\\frac38(1+x)^{-5/2}$.',
          'At $x=0$: $f=1$, $f\'=\\frac12$, $f\'\'=-\\frac14$, $f\'\'\'=\\frac38$.',
          'Divide by $n!$: $\\;c_0=1$, $c_1=\\frac12$, $c_2=\\frac{-1/4}{2}=-\\frac18$, $c_3=\\frac{3/8}{6}=\\frac1{16}$.',
          '$T_3(x)=1+\\dfrac{x}{2}-\\dfrac{x^{2}}{8}+\\dfrac{x^{3}}{16}$',
        ],
        recall: 'Compute derivatives, evaluate at the centre, **then divide by $n!$**. The division is the step people skip.',
        viz: {
          kind: 'taylor', f: x => Math.sqrt(x + 1), c: 0, xmin: -0.95, xmax: 3, fLabel: '√(x+1)',
          polys: [
            { n: 1, label: 'T₁', p: x => 1 + x / 2 },
            { n: 3, label: 'T₃', p: x => 1 + x / 2 - x * x / 8 + x ** 3 / 16 },
          ],
          cap: 'Excellent near $x=0$, visibly wrong by $x=2$ — the error grows like $|x|^{4}$.',
        },
      };
    }
    if (which === 'invx') {
      const key = '$1-(x-1)+(x-1)^{2}-(x-1)^{3}$';
      return {
        prompt: 'Find the third-degree Taylor polynomial $T_{3}(x)$ centered at $x=1$ for $f(x)=\\dfrac{1}{x}$.',
        choices: [
          { t: key, ok: true },
          ...choose(key, [
            { t: '$1-(x-1)+2(x-1)^{2}-6(x-1)^{3}$', why: 'You used $f^{(n)}(1)$ raw. Dividing by $n!$ turns $2$ into $1$ and $-6$ into $-1$.', err: 'dropped-factor' },
            { t: '$1+(x-1)+(x-1)^{2}+(x-1)^{3}$', why: 'The signs alternate: $f^{(n)}(1)=(-1)^{n}n!$.', err: 'sign' },
            { t: '$1-x+x^{2}-x^{3}$', why: 'Centering dropped. Every power must be $(x-1)^{n}$.', err: 'conceptual' },
          ]),
        ],
        steps: [
          '$f=x^{-1}$, $f\'=-x^{-2}$, $f\'\'=2x^{-3}$, $f\'\'\'=-6x^{-4}$.',
          'At $x=1$: $1,\\,-1,\\,2,\\,-6$.',
          'Divide by $n!$: $1,\\,-1,\\,\\frac{2}{2}=1,\\,\\frac{-6}{6}=-1$.',
          '$T_3(x)=1-(x-1)+(x-1)^{2}-(x-1)^{3}$ — the start of the geometric series, as expected since $\\frac1x=\\frac{1}{1+(x-1)}$.',
        ],
        recall: '$f^{(n)}(1)=(-1)^{n}n!$ for $\\frac1x$, so after dividing by $n!$ the coefficients are just $\\pm1$.',
      };
    }
    const key = '$(x-1)-\\dfrac{(x-1)^{2}}{2}+\\dfrac{(x-1)^{3}}{3}$';
    return {
      prompt: 'Find the third-degree Taylor polynomial $T_{3}(x)$ centered at $x=1$ for $f(x)=\\ln x$.',
      choices: [
        { t: key, ok: true },
        ...choose(key, [
          { t: '$(x-1)-(x-1)^{2}+2(x-1)^{3}$', why: 'Missing the $\\frac{1}{n!}$: $f\'\'(1)=-1$ gives $-\\frac12$, and $f\'\'\'(1)=2$ gives $\\frac{2}{6}=\\frac13$.', err: 'dropped-factor' },
          { t: '$1+(x-1)-\\dfrac{(x-1)^{2}}{2}+\\dfrac{(x-1)^{3}}{3}$', why: '$f(1)=\\ln1=0$, so there is no constant term.', err: 'algebra-slip' },
          { t: '$x-\\dfrac{x^{2}}{2}+\\dfrac{x^{3}}{3}$', why: 'Centering dropped — the polynomial is built around $x=1$.', err: 'conceptual' },
        ]),
      ],
      steps: [
        '$f=\\ln x$, $f\'=x^{-1}$, $f\'\'=-x^{-2}$, $f\'\'\'=2x^{-3}$.',
        'At $x=1$: $0,\\,1,\\,-1,\\,2$.',
        'Divide by $n!$: $0,\\,1,\\,-\\frac12,\\,\\frac{2}{6}=\\frac13$.',
        '$T_3(x)=(x-1)-\\dfrac{(x-1)^{2}}{2}+\\dfrac{(x-1)^{3}}{3}$',
      ],
      recall: '$\\ln x$ centred at $1$ reproduces the $\\ln(1+u)$ series with $u=x-1$.',
    };
  },
});

G.push({
  id: 'gx-series-diffgeom', unit: 'series', topic: 'Applications of Series', diff: 3,
  src: 'modelled on Fall 2025 Exam 3 Q4(b)',
  make(r) {
    const num = r.pick([1, 1, 1, 2]), den = r.pick([2, 3, 4, 5]);
    const neg = r.pick([true, false]);
    const rv = (neg ? -num : num) / den;
    const sum = 1 / (1 - rv) ** 2;
    const rTex = `${neg ? '-' : ''}\\frac{${num}}{${den}}`;
    const sTex = frac(den * den, (den - (neg ? -num : num)) ** 2);
    const key = `$${sTex}$`;
    return {
      prompt: `Compute $\\displaystyle\\sum_{n=0}^{\\infty} n\\left(${rTex}\\right)^{n-1}$. \u2004[Hint: differentiate $\\displaystyle\\sum_{n=0}^{\\infty}x^{n}$.]`,
      choices: [
        { t: key, ok: true },
        ...choose(key, [
          { t: `$${frac(den, den - (neg ? -num : num))}$`, why: 'That is $\\frac{1}{1-r}$, the value of $\\sum x^{n}$ itself. Differentiating gives $\\frac{1}{(1-r)^{2}}$ — the denominator is **squared**.', err: 'power-rule' },
          { t: `$${frac(den * den, (den + (neg ? -num : num)) ** 2)}$`, why: 'Sign of $r$ mishandled inside $1-r$. Substitute $r$ with its sign and simplify carefully.', err: 'sign' },
          { t: 'Diverges', why: `$|r|=\\frac{${num}}{${den}}<1$, and differentiating a power series is valid inside its radius, so the sum is finite.`, err: 'conceptual' },
          { t: '$0$', why: 'The $n=0$ term vanishes, but every later term is nonzero and they sum to a positive number.', err: 'algebra-slip' },
        ]),
      ],
      steps: [
        'Start from $\\displaystyle\\sum_{n=0}^{\\infty}x^{n}=\\frac{1}{1-x}$ for $|x|<1$.',
        'Differentiate both sides term by term (legal inside the radius):',
        '$\\displaystyle\\sum_{n=0}^{\\infty}n x^{n-1}=\\frac{1}{(1-x)^{2}}$',
        `Substitute $x=${rTex}$: $\\;\\dfrac{1}{\\left(1-${rTex}\\right)^{2}}=${sTex}$`,
      ],
      recall: 'Differentiating or integrating $\\sum x^{n}$ term by term generates whole families of sums. The radius is unchanged.',
    };
  },
});

// ---- Linear u-sub "in your head" (his handout) --------------------
G.push({
  id: 'gx-linear-usub', unit: 'techniques', topic: 'Linear u-Substitution', diff: 2,
  src: "from Dr. McWhorter's 'Linear u-Sub in Your Head' handout",
  make(r) {
    const items = [
      { q: '\\int \\sin(\\pi x)\\,dx', a: '-\\dfrac{\\cos(\\pi x)}{\\pi}+C', lin: true, k: '\\pi' },
      { q: '\\int e^{5x}\\,dx', a: '\\dfrac{e^{5x}}{5}+C', lin: true, k: '5' },
      { q: '\\int \\tan(6s)\\,ds', a: '\\dfrac{\\ln|\\sec 6s|}{6}+C', lin: true, k: '6' },
      { q: '\\int (6x-7)^{4}\\,dx', a: '\\dfrac{(6x-7)^{5}}{5}\\cdot\\dfrac{1}{6}+C', lin: true, k: '6' },
      { q: '\\int \\sin(1-3a)\\,da', a: '-\\cos(1-3a)\\cdot\\left(-\\dfrac13\\right)+C', lin: true, k: '-3' },
      { q: '\\int \\dfrac{dt}{6t-13}', a: '\\dfrac{\\ln|6t-13|}{6}+C', lin: true, k: '6' },
      { q: '\\int \\cos(5x)\\,dx', a: '\\dfrac{\\sin(5x)}{5}+C', lin: true, k: '5' },
      { q: '\\int \\dfrac{1}{(5x+2)^{4}}\\,dx', a: '\\dfrac{(5x+2)^{-3}}{-3}\\cdot\\dfrac15+C', lin: true, k: '5' },
      { q: '\\int \\sin\\left(\\dfrac{x}{7}\\right)dx', a: '-\\cos\\left(\\dfrac{x}{7}\\right)\\cdot 7+C', lin: true, k: '\\tfrac17' },
      { q: '\\int \\csc^{2}(9z)\\,dz', a: '\\dfrac{-\\cot(9z)}{9}+C', lin: true, k: '9' },
      { q: '\\int \\sec(4x)\\tan(4x)\\,dx', a: '\\dfrac{\\sec(4x)}{4}+C', lin: true, k: '4' },
      { q: '\\int e^{9-x}\\,dx', a: '-e^{9-x}+C', lin: true, k: '-1' },
      // non-examples straight from his answer key
      { q: '\\int \\dfrac{dx}{x^{2}-10x+25}', a: 'Not an obvious linear $u$-sub', lin: false, why: 'The denominator is $(x-5)^{2}$ — you have to factor it first, so it is not an *obvious* linear substitution.' },
      { q: '\\int \\dfrac{\\left(1+\\frac1x\\right)^{6}}{x^{2}}\\,dx', a: 'Not a linear $u$-sub', lin: false, why: 'Here $u=1+\\frac1x$ is a perfectly good substitution, but $u$ is **not linear** in $x$.' },
      { q: '\\int \\sin(\\cos x)\\sin x\\,dx', a: 'Not a linear $u$-sub', lin: false, why: 'The natural $u=\\cos x$ is not linear.' },
      { q: '\\int \\dfrac{e^{\\ln x}}{x}\\,dx', a: 'Not a linear $u$-sub', lin: false, why: 'The inner function $\\ln x$ is not linear (and this one simplifies to $\\int dx$ anyway).' },
      { q: '\\int \\dfrac{x}{\\sqrt{x+1}}\\,dx', a: 'Not an obvious linear $u$-sub', lin: false, why: 'The substitution $u=x+1$ is linear, but the stray $x$ in the numerator must be rewritten as $u-1$ first — so it is not doable in your head.' },
      { q: '\\int q^{3}\\sqrt{q^{2}+1}\\,dq', a: 'Not a linear $u$-sub', lin: false, why: '$u=q^{2}+1$ is quadratic, not linear.' },
      { q: '\\int \\dfrac{\\arcsin x}{\\sqrt{1-x^{2}}}\\,dx', a: 'Not a linear $u$-sub', lin: false, why: '$u=\\arcsin x$ is the right substitution and it is certainly not linear.' },
    ];
    const NOPE = 'Not a linear $u$-substitution';
    const it = r.pick(items);
    const linears = items.filter(o => o.lin);

    // Correct answer is either the antiderivative, or the single "no" verdict.
    // Distractors are always *other* antiderivatives (plus the "no" verdict when
    // the answer is an antiderivative), so every option is textually distinct.
    const key = it.lin ? `$${it.a}$` : NOPE;
    const pool = r.shuffle(linears.filter(o => o.a !== it.a)).map(o => ({
      t: `$${o.a}$`,
      why: `That is the answer to $\\displaystyle ${o.q}$, a different integral in the set. ${it.lin
        ? 'Here the inner function is $' + it.k + '$ — integrate the outer function and divide by that.'
        : 'This one is not a mental substitution at all: ' + it.why}`,
      err: 'formula-confusion',
    }));
    if (it.lin) {
      pool.splice(r.int(0, Math.min(2, pool.length)), 0, {
        t: NOPE,
        why: `The inner function here **is** linear (coefficient $${it.k}$), so this is exactly the kind you should be able to do in your head.`,
        err: 'conceptual',
      });
    }
    return {
      prompt: `Is $\\displaystyle ${it.q}$ an "obvious" linear $u$-substitution? If so, evaluate it.`,
      choices: [
        { t: key, ok: true },
        ...choose(key, pool),
      ],
      steps: it.lin
        ? [
          `The inner function is linear, so this is a "$u$-sub in your head": integrate as usual and divide by the coefficient of $x$.`,
          `Inner coefficient: $${it.k}$.`,
          `$\\displaystyle ${it.q} = ${it.a}$`,
          'Written unsimplified, exactly as you would jot it down from your head.',
        ]
        : [
          'Ask: is the inner function of the form $ax+b$?',
          it.why,
          'So this is **not** an obvious linear $u$-substitution — it needs real work.',
          'Recognising which integrals are instant is worth serious time on a timed exam.',
        ],
      recall: 'Linear inside → integrate the outer function and divide by the inner coefficient. Anything non-linear inside needs a written-out substitution.',
    };
  },
});

export const exams = { unit: 'techniques', problems: P, generators: G };
