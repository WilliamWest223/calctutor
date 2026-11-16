// ---------------------------------------------------------------
// bank/lessons.js — the semester's teaching program.
//
// One lesson per topic block in Dr. McWhorter's Fall 2026 schedule,
// dated to the lecture that covers it. Each lesson teaches the idea,
// works an example the way he works it, names the traps, points at
// his real check-in for that day, and then hands you a drill set.
//
// `dates` are the actual lecture days, so the app can tell you what
// you are behind on and what is coming.
// ---------------------------------------------------------------

import { REWRITES } from './lessons/index.js';

const L = [];
const add = o => L.push(o);

// =================================================================
// Unit 1 — Techniques of Integration  (through Exam 1, 09/22)
// =================================================================

add({
  id: 'ln-review', n: 1, title: 'Integration Review', unit: 'foundations',
  dates: ['2026-08-18', '2026-08-24'],
  goal: 'Recognise and run a $u$-substitution without hesitating, and evaluate a definite integral correctly.',
  why: 'Everything else this term sits on this. His Gateway II and the first half of Exam 1 assume it is automatic — and a substitution slip is the most common way people lose points on problems they actually understood.',
  sections: [
    {
      h: 'What integration actually asks',
      body: 'An antiderivative answers "what function has *this* as its derivative?" That means **every integral can be checked by differentiating your answer** — the single most valuable habit in this course. It costs five seconds and catches nearly every sign error and dropped constant.',
    },
    {
      h: 'The substitution move',
      body: 'A $u$-substitution works when the integrand contains some inner function **and** (a constant multiple of) its derivative. Set $u$ to the inner function, compute $du$, and check that everything left over is accounted for. If a stray $x$ survives, you either picked the wrong $u$ or you need a **shifting** integral — solve $u=\\dots$ for $x$ and substitute that too.',
    },
    {
      h: 'Definite integrals: change the limits',
      body: 'Once you substitute, the old limits are $x$-values sitting on a $u$-integral. Convert them at the moment you write the new $\\int$ sign — not later, not never. The alternative is to back-substitute to $x$ before evaluating, but converting is faster and he expects to see it.',
    },
  ],
  worked: [
    {
      q: 'Evaluate $\\displaystyle\\int_{0}^{1} x e^{x^{2}}\\,dx$.',
      steps: [
        'Inner function $x^{2}$; its derivative $2x$ is present up to the constant $2$. Let $u=x^{2}$.',
        '$du = 2x\\,dx$, so $x\\,dx = \\tfrac12\\,du$.',
        'Convert the limits: $x=0\\Rightarrow u=0$, and $x=1\\Rightarrow u=1$.',
        '$\\displaystyle\\int_{0}^{1}xe^{x^{2}}dx = \\tfrac12\\int_{0}^{1}e^{u}du = \\tfrac12\\left[e^{u}\\right]_{0}^{1} = \\dfrac{e-1}{2}$.',
      ],
      note: 'Check: $\\frac{d}{dx}\\left(\\tfrac12 e^{x^{2}}\\right) = \\tfrac12 e^{x^{2}}\\cdot 2x = xe^{x^{2}}$ ✓',
    },
    {
      q: 'Evaluate $\\displaystyle\\int x\\sqrt[3]{x-2}\\,dx$ — a shifting integral.',
      steps: [
        'Let $u = x-2$. Then $du = dx$, but a loose $x$ is left over.',
        'Solve backwards: $x = u+2$. Now everything is in $u$.',
        '$\\displaystyle\\int (u+2)u^{1/3}\\,du = \\int\\left(u^{4/3}+2u^{1/3}\\right)du$.',
        '$= \\tfrac37 u^{7/3} + \\tfrac32 u^{4/3} + C = \\tfrac37(x-2)^{7/3} + \\tfrac32(x-2)^{4/3}+C$.',
      ],
      note: 'A leftover $x$ is not a dead end — it is the signal to shift.',
    },
  ],
  traps: [
    'Leaving the limits alone after substituting. They belong to whatever variable is being integrated.',
    'Forgetting $\\int\\frac{du}{u} = \\ln|u|$ — the absolute value is required, not decoration.',
    'Trying parts on something where the outside factor is the inner derivative. Test substitution first, always.',
  ],
  checkins: ['ci-s26-0115', 'ci-s25-0116', 'ci-f25-0821'],
  drill: ['foundations/u-Substitution', 'foundations/Antiderivatives', 'foundations/FTC & Definite Integrals', 'techniques/Linear u-Substitution'],
});

add({
  id: 'ln-gateway1', n: 2, title: 'Gateway I — Calc I Skills', unit: 'foundations',
  dates: ['2026-08-19'],
  goal: 'Pass Gateway I: limits, derivative rules, chain rule, and L\'Hôpital, at speed and without a calculator.',
  why: 'Gateway I is graded all-or-nothing and is worth 5% of your grade. You get unlimited proctored attempts, so the only real cost is time — but failing it and not enrolling in MATH 152 means eating the 5%.',
  sections: [
    {
      h: 'What it covers',
      body: 'Prerequisite Calc I only: evaluating limits (including indeterminate forms), the product/quotient/chain rules, implicit differentiation, and L\'Hôpital\'s rule. No integration.',
    },
    {
      h: 'The scoring',
      body: 'All-or-nothing, unlimited attempts, but you **must be proctored** — by your TA or Math Lab staff. Take it early. There is no advantage to waiting and a real cost to running out of attempts before the window closes.',
    },
  ],
  worked: [
    {
      q: 'Evaluate $\\displaystyle\\lim_{x\\to0}\\frac{\\sin 3x}{5x}$.',
      steps: [
        'Direct substitution gives $\\tfrac00$ — indeterminate, so a tool is needed.',
        'L\'Hôpital: differentiate top and bottom separately. $\\dfrac{3\\cos 3x}{5}$.',
        'Now substitute $x=0$: $\\dfrac{3\\cos 0}{5} = \\dfrac{3}{5}$.',
      ],
      note: 'L\'Hôpital differentiates numerator and denominator **separately** — it is not the quotient rule.',
    },
  ],
  traps: [
    'Applying L\'Hôpital to something that is not $\\frac00$ or $\\frac{\\infty}{\\infty}$. Check the form first, every time.',
    'Using the quotient rule instead of differentiating top and bottom independently.',
  ],
  drill: ['foundations/Limits & Indeterminate Forms', 'foundations/Derivative Rules', 'foundations/Chain Rule & Implicit', "foundations/L'Hôpital's Rule"],
});

add({
  id: 'ln-parts', n: 3, title: 'Integration by Parts', unit: 'techniques',
  dates: ['2026-08-20', '2026-08-25'],
  goal: 'Choose $u$ and $dv$ correctly with LIATE and run parts cleanly, including the $dv=1$ trick.',
  why: 'Every Exam 1 he has written contains at least one by-parts problem, usually two. Spring 2026 Q1 was $\\int_{0}^{\\pi}x\\sec^{2}(x/4)\\,dx$; Fall 2025 Q2 was $\\int x^{3}\\sin(2x)\\,dx$; Q3 was $\\int_{0}^{1}\\arcsin\\theta\\,d\\theta$.',
  sections: [
    {
      h: 'The formula and what it buys you',
      body: '$\\displaystyle\\int u\\,dv = uv - \\int v\\,du$. You are trading one integral for another, so the whole game is making the **new** integral easier than the old one. If it is not, you chose wrong — back up and swap.',
    },
    {
      h: 'LIATE',
      body: '**L**ogarithmic, **I**nverse trig, **A**lgebraic, **T**rigonometric, **E**xponential. Whichever appears **earlier** in that list becomes $u$. The reasoning behind it: earlier letters get *better* when differentiated ($\\ln x \\to \\frac1x$), later ones survive integration unchanged ($e^{x}\\to e^{x}$).',
    },
    {
      h: 'His box-7 layout',
      body: 'He draws a 2×2 box with a "7" through it: $u$ top-left, $dv$ top-right, $du$ bottom-left, $v$ bottom-right. Read $uv$ off the diagonal and $\\int v\\,du$ off the bottom row. Use it — it makes sign errors much harder and it is what he demonstrates in lecture.',
    },
    {
      h: 'The dv = 1 trick',
      body: 'A lone $\\ln x$, $\\arctan x$ or $\\text{arccot}\\,\\theta$ has only one factor. Supply the other yourself: take $dv = 1\\,dx$, so $v = x$. This is the *only* way to integrate $\\ln x$ and the inverse trig functions.',
    },
  ],
  worked: [
    {
      q: 'Evaluate $\\displaystyle\\int_{0}^{1}\\arcsin\\theta\\,d\\theta$  (his Fall 2025 Exam 1, Q3).',
      steps: [
        'One factor only, and it is inverse trig — the $dv=1$ case. Take $u = \\arcsin\\theta$, $dv = 1\\,d\\theta$.',
        '$du = \\dfrac{d\\theta}{\\sqrt{1-\\theta^{2}}}$ and $v = \\theta$.',
        '$\\displaystyle\\int_{0}^{1}\\arcsin\\theta\\,d\\theta = \\left[\\theta\\arcsin\\theta\\right]_{0}^{1} - \\int_{0}^{1}\\frac{\\theta}{\\sqrt{1-\\theta^{2}}}d\\theta$.',
        'First piece: $1\\cdot\\frac{\\pi}{2} - 0 = \\frac{\\pi}{2}$.',
        'Second piece by substitution $w = 1-\\theta^{2}$: $\\displaystyle\\int_{0}^{1}\\frac{\\theta\\,d\\theta}{\\sqrt{1-\\theta^{2}}} = \\left[-\\sqrt{1-\\theta^{2}}\\right]_{0}^{1} = 1$.',
        'Answer: $\\dfrac{\\pi}{2} - 1$.',
      ],
      note: 'Notice the second integral needed its own substitution. Parts often leaves you a smaller problem, not a finished one.',
    },
  ],
  traps: [
    'Choosing $dv$ to be something you cannot integrate. Always check you can actually find $v$ before committing — $\\int e^{-3x^{2}}dx$ does not exist in elementary form.',
    'Losing the minus sign in $-\\int v\\,du$. The box-7 layout exists to prevent exactly this.',
    'Reaching for parts when the integrand is really a substitution. $\\int xe^{x^{2}}dx$ is a $u$-sub, not parts.',
  ],
  checkins: ['ci-f26-0825', 'ci-s26-0120', 'ci-f25-0826', 'ci-s25-0121'],
  drill: ['techniques/Integration by Parts'],
});

add({
  id: 'ln-tabular', n: 4, title: 'Tabular & Looping Parts', unit: 'techniques',
  dates: ['2026-08-25'],
  goal: 'Run tabular integration when one factor dies, and solve the looping case algebraically when neither does.',
  why: 'His exams lean on this hard. $\\int x^{3}\\sin(2x)dx$ needs four rounds of parts — tabular does it in one table. $\\int e^{x}\\cos(2x)dx$ never terminates and must be solved as an equation.',
  sections: [
    {
      h: 'Tabular: when one factor dies',
      body: 'If one factor is a polynomial, it differentiates to $0$ eventually. Put it in the left column and differentiate down; put the other in the right column and integrate down. Multiply along the diagonals, alternating $+,-,+,-$. Stop when the left column hits $0$.',
    },
    {
      h: 'Looping: when neither dies',
      body: 'Exponential $\\times$ trig, or trig $\\times$ trig, never terminates — both factors regenerate forever. Do parts **twice**, and the original integral reappears with a coefficient. Call it $I$, move it to the left-hand side, and solve. Getting your integral back is success, not failure.',
    },
  ],
  worked: [
    {
      q: 'Evaluate $\\displaystyle\\int x^{3}\\sin(2x)\\,dx$  (his Fall 2025 Exam 1, Q2).',
      steps: [
        'Left column, differentiate: $x^{3},\\;3x^{2},\\;6x,\\;6,\\;0$.',
        'Right column, integrate: $\\sin 2x,\\;-\\tfrac{\\cos 2x}{2},\\;-\\tfrac{\\sin 2x}{4},\\;\\tfrac{\\cos 2x}{8},\\;\\tfrac{\\sin 2x}{16}$.',
        'Diagonals with alternating signs: $+\\,x^{3}\\!\\left(-\\tfrac{\\cos 2x}{2}\\right) -\\, 3x^{2}\\!\\left(-\\tfrac{\\sin 2x}{4}\\right) +\\, 6x\\!\\left(\\tfrac{\\cos 2x}{8}\\right) -\\, 6\\!\\left(\\tfrac{\\sin 2x}{16}\\right)$.',
        '$= -\\dfrac{x^{3}\\cos 2x}{2} + \\dfrac{3x^{2}\\sin 2x}{4} + \\dfrac{3x\\cos 2x}{4} - \\dfrac{3\\sin 2x}{8} + C$.',
      ],
      note: 'Four rounds of ordinary parts, done in one table. This is why he teaches it.',
    },
    {
      q: 'Evaluate $\\displaystyle\\int e^{x}\\sin(3x)\\,dx$ — a loop.',
      steps: [
        'Parts once ($u=\\sin 3x$, $dv=e^{x}dx$): $e^{x}\\sin 3x - 3\\displaystyle\\int e^{x}\\cos 3x\\,dx$.',
        'Parts again on the remainder: $e^{x}\\sin 3x - 3e^{x}\\cos 3x - 9\\displaystyle\\int e^{x}\\sin 3x\\,dx$.',
        'The original is back. Call it $I$: $\\;I = e^{x}\\sin 3x - 3e^{x}\\cos 3x - 9I$.',
        '$10I = e^{x}\\left(\\sin 3x - 3\\cos 3x\\right)$, so $I = \\dfrac{e^{x}\\left(\\sin 3x - 3\\cos 3x\\right)}{10}+C$.',
      ],
      note: 'Do not forget the $+C$ — it reappears only after you divide.',
    },
  ],
  traps: [
    'Getting the alternating signs wrong. They start $+$ on the first diagonal and alternate strictly.',
    'Abandoning a loop when the integral comes back. That is the moment to do algebra, not to start over.',
    'Using tabular when neither factor terminates — the table runs forever.',
  ],
  checkins: ['ci-f25-0828', 'ci-s25-0123', 'ci-s26-0122', 'ci-f26-0827'],
  drill: ['techniques/Tabular & Looping Parts', 'techniques/Integration by Parts'],
});

add({
  id: 'ln-trigint', n: 5, title: 'Trigonometric Integrals', unit: 'techniques',
  dates: ['2026-08-27'],
  goal: 'Handle $\\sin^{m}\\cos^{n}$ and $\\tan^{m}\\sec^{n}$ by parity, and use product-to-sum when the angles differ.',
  why: 'Guaranteed Exam 1 material. Fall 2025 Q1 was $\\int\\sin^{3}(4x)\\cos^{6}(4x)dx$ and Q7 was $\\int\\sin(3x)\\cos(x)dx$ — one of each kind.',
  sections: [
    {
      h: 'Sine and cosine: look for an odd power',
      body: 'If **sine** has an odd power, peel off one $\\sin\\theta$ for $du$ and let $u=\\cos\\theta$; the remaining even power converts by $\\sin^{2}=1-\\cos^{2}$. If **cosine** is odd, do the mirror image with $u=\\sin\\theta$. If **both are even**, no substitution works — use the half-angle identities $\\sin^{2}\\theta = \\frac{1-\\cos 2\\theta}{2}$ and $\\cos^{2}\\theta = \\frac{1+\\cos 2\\theta}{2}$.',
    },
    {
      h: 'Tangent and secant: count what $du$ needs',
      body: '$\\frac{d}{dx}\\tan x = \\sec^{2}x$ and $\\frac{d}{dx}\\sec x = \\sec x\\tan x$. So $u=\\tan x$ needs **two** secants to spare; $u=\\sec x$ needs one secant and one tangent, leaving an even power of $\\tan$ to convert with $\\tan^{2}=\\sec^{2}-1$. If neither count works, convert to sines and cosines.',
    },
    {
      h: 'Different angles: product-to-sum',
      body: 'When the arguments differ — $\\sin(3x)\\cos(x)$ — no parity trick applies, because there is no shared inner function. Use $\\sin A\\cos B = \\tfrac12\\left[\\sin(A+B)+\\sin(A-B)\\right]$ and the two companion identities. This turns a product into a sum of single sines, which integrate instantly.',
    },
  ],
  worked: [
    {
      q: 'Evaluate $\\displaystyle\\int \\sin^{3}(4x)\\cos^{6}(4x)\\,dx$  (his Fall 2025 Exam 1, Q1).',
      steps: [
        'Sine has the odd power, so let $u = \\cos(4x)$, giving $du = -4\\sin(4x)\\,dx$.',
        'Split: $\\sin^{3}(4x) = \\sin^{2}(4x)\\cdot\\sin(4x) = \\left(1-\\cos^{2}(4x)\\right)\\sin(4x)$.',
        'Substitute: $-\\tfrac14\\displaystyle\\int\\left(1-u^{2}\\right)u^{6}\\,du = -\\tfrac14\\int\\left(u^{6}-u^{8}\\right)du$.',
        '$= -\\tfrac14\\left(\\dfrac{u^{7}}{7} - \\dfrac{u^{9}}{9}\\right)+C = -\\dfrac{\\cos^{7}(4x)}{28} + \\dfrac{\\cos^{9}(4x)}{36}+C$.',
      ],
      note: 'The $\\tfrac14$ comes from the inner $4x$. Linear inner functions cost you a constant every time.',
    },
    {
      q: 'Evaluate $\\displaystyle\\int\\sin(3x)\\cos(x)\\,dx$  (his Fall 2025 Exam 1, Q7).',
      steps: [
        'Different angles, so no parity trick. Use $\\sin A\\cos B = \\tfrac12\\left[\\sin(A+B)+\\sin(A-B)\\right]$.',
        '$\\sin 3x\\cos x = \\tfrac12\\left[\\sin 4x + \\sin 2x\\right]$.',
        '$\\displaystyle\\int = \\tfrac12\\left(-\\dfrac{\\cos 4x}{4} - \\dfrac{\\cos 2x}{2}\\right)+C$.',
        '$= -\\dfrac{\\cos 4x}{8} - \\dfrac{\\cos 2x}{4}+C$.',
      ],
      note: 'The three product-to-sum identities are on his formula sheet and on the app\'s cheat sheet (press **C**).',
    },
  ],
  traps: [
    'Both powers even and you reach for a substitution anyway. It cannot work — go to half-angle.',
    'For $\\tan^{m}\\sec^{n}$: choosing $u=\\sec x$ when an odd power of $\\tan$ would be left over. It cannot be converted.',
    'Dropping the constant from a linear inner function: $\\int\\sin(4x)dx = -\\frac{\\cos 4x}{4}$, not $-\\cos 4x$.',
  ],
  checkins: ['ci-f25-0902', 'ci-s25-0128', 'ci-s26-0127', 'ci-f26-0827'],
  drill: ['techniques/Trigonometric Integrals', 'techniques/Product-to-Sum Integrals', 'precalc/Trig Identities'],
});

add({
  id: 'ln-trigsub', n: 6, title: 'Trigonometric Substitution', unit: 'techniques',
  dates: ['2026-09-01'],
  goal: 'Recognise the three radical patterns, substitute, and get back to $x$ using a reference triangle.',
  why: 'On every Exam 1. Fall 2025 Q5 was $\\int\\frac{dx}{x^{2}\\sqrt{x^{2}-9}}$; the Spring 2025 final Q2 was $\\int\\frac{x^{2}}{\\sqrt{9-x^{2}}}dx$.',
  sections: [
    {
      h: 'Three patterns, one idea',
      body: 'Each substitution exists to turn the radical into a perfect square via a Pythagorean identity:\n\n$\\sqrt{a^{2}-x^{2}} \\Rightarrow x=a\\sin\\theta$, using $1-\\sin^{2}=\\cos^{2}$.\n\n$\\sqrt{a^{2}+x^{2}} \\Rightarrow x=a\\tan\\theta$, using $1+\\tan^{2}=\\sec^{2}$.\n\n$\\sqrt{x^{2}-a^{2}} \\Rightarrow x=a\\sec\\theta$, using $\\sec^{2}-1=\\tan^{2}$.',
    },
    {
      h: 'His framing: build the triangle',
      body: 'He teaches this through the Pythagorean theorem directly. Match $a^{2}+b^{2}=c^{2}$ against your expression to identify the two legs and hypotenuse, draw the right triangle, and read every trig ratio off it. That triangle is also how you convert back to $x$ at the end — which is the step people forget.',
    },
    {
      h: 'It is driven by the identity, not the table',
      body: 'Any substitution producing a Pythagorean identity works. For $x^{2}+9$, both $3\\tan\\theta$ and $3\\cot\\theta$ are legitimate — he has asked exactly this on a check-in. Memorise the *reason*, not the row.',
    },
  ],
  worked: [
    {
      q: 'Evaluate $\\displaystyle\\int\\frac{dx}{x^{2}\\sqrt{x^{2}-9}}$  (his Fall 2025 Exam 1, Q5).',
      steps: [
        'Pattern $\\sqrt{x^{2}-a^{2}}$ with $a=3$, so $x = 3\\sec\\theta$ and $dx = 3\\sec\\theta\\tan\\theta\\,d\\theta$.',
        '$\\sqrt{x^{2}-9} = \\sqrt{9\\sec^{2}\\theta - 9} = 3\\tan\\theta$.',
        'Substitute: $\\displaystyle\\int\\frac{3\\sec\\theta\\tan\\theta\\,d\\theta}{9\\sec^{2}\\theta\\cdot 3\\tan\\theta} = \\tfrac19\\int\\frac{d\\theta}{\\sec\\theta} = \\tfrac19\\int\\cos\\theta\\,d\\theta$.',
        '$= \\tfrac19\\sin\\theta + C$.',
        'Back to $x$ via the triangle: hypotenuse $x$, adjacent $3$, opposite $\\sqrt{x^{2}-9}$. So $\\sin\\theta = \\dfrac{\\sqrt{x^{2}-9}}{x}$.',
        'Answer: $\\dfrac{\\sqrt{x^{2}-9}}{9x}+C$.',
      ],
      note: 'The whole problem collapsed to $\\int\\cos\\theta\\,d\\theta$. That is what a good substitution does.',
    },
  ],
  traps: [
    'Stopping at $\\theta$. The answer must be in $x$ — draw the triangle and convert back.',
    'Using trig substitution when there is no radical. $(x^{2}+4)^{3}$ just expands.',
    'Forgetting to substitute $dx$ as well as the radical.',
  ],
  checkins: ['ci-f25-0904', 'ci-s25-0130', 'ci-s26-0129'],
  drill: ['techniques/Trigonometric Substitution', 'precalc/Completing the Square'],
});

add({
  id: 'ln-partfrac', n: 7, title: 'Partial Fractions', unit: 'techniques',
  dates: ['2026-09-03', '2026-09-08'],
  goal: 'Set up the correct decomposition form for any denominator, solve for the constants, and integrate each piece.',
  why: 'On every single Exam 1 he has written. The recurring shape is a cubic denominator that factors as $x(x^{2}+1)$ — Fall 2025 Q6, Spring 2026 Q3 — which mixes a log, a half-log, and an arctangent in one answer.',
  sections: [
    {
      h: 'Two checks before you write anything',
      body: '**One:** is the fraction proper? If $\\deg(\\text{numerator}) \\geq \\deg(\\text{denominator})$, do polynomial long division first. **Two:** factor the denominator *completely* — $x^{2}+6x+9$ is $(x+3)^{2}$, not an irreducible quadratic. A quadratic is irreducible only when $b^{2}-4ac<0$.',
    },
    {
      h: 'The forms',
      body: 'Distinct linear $(x-a)$: one term $\\dfrac{A}{x-a}$.\n\nRepeated linear $(x-a)^{k}$: one term per power, $\\dfrac{A}{x-a}+\\dfrac{B}{(x-a)^{2}}+\\cdots$ — each with a **constant** on top.\n\nIrreducible quadratic $(x^{2}+bx+c)$: a **linear** numerator, $\\dfrac{Ax+B}{x^{2}+bx+c}$.\n\nSanity check: the number of unknowns must equal the degree of the denominator.',
    },
    {
      h: 'Heaviside cover-up, and its limit',
      body: 'To find the coefficient over a linear factor, cover that factor in the original and evaluate at its root. Fast and exact — but it only reaches the **highest power** of each linear factor. For $(x-3)^{2}$ it gives the $\\frac{C}{(x-3)^{2}}$ coefficient and tells you nothing about $\\frac{B}{x-3}$; get that by plugging in another value.',
    },
    {
      h: 'Integrating the pieces',
      body: '$\\dfrac{A}{x-a}\\to A\\ln|x-a|$. $\\dfrac{Bx}{x^{2}+c}\\to \\dfrac{B}{2}\\ln(x^{2}+c)$ — the $\\frac12$ comes from $du=2x\\,dx$. $\\dfrac{C}{x^{2}+1}\\to C\\arctan x$. One irreducible quadratic produces **two different** kinds of antiderivative.',
    },
  ],
  worked: [
    {
      q: 'Evaluate $\\displaystyle\\int\\frac{-5x^{2}+x-3}{x^{3}+x}\\,dx$  (his Fall 2025 Exam 1, Q6).',
      steps: [
        'Factor: $x^{3}+x = x(x^{2}+1)$, and $x^{2}+1$ is irreducible.',
        'Form: $\\dfrac{-5x^{2}+x-3}{x(x^{2}+1)} = \\dfrac{A}{x}+\\dfrac{Bx+C}{x^{2}+1}$ — three unknowns, degree three ✓.',
        'Clear denominators: $-5x^{2}+x-3 = A(x^{2}+1) + (Bx+C)x$.',
        'At $x=0$: $-3 = A$. Matching $x^{2}$: $-5 = A+B$, so $B=-2$. Matching $x$: $1 = C$.',
        '$\\displaystyle\\int\\left[\\frac{-3}{x} + \\frac{-2x+1}{x^{2}+1}\\right]dx = -3\\ln|x| - \\ln(x^{2}+1) + \\arctan x + C$.',
      ],
      note: 'Three different antiderivative shapes from one fraction. That is the point of the problem.',
    },
  ],
  traps: [
    'Putting $\\frac{Ax+B}{x^{2}}$ over a repeated linear factor. $x^{2}$ factors, so it gets $\\frac{A}{x}+\\frac{B}{x^{2}}$.',
    'Skipping long division on an improper fraction.',
    'Dropping the $\\frac12$ on the $\\ln(x^{2}+c)$ term.',
    'Forgetting absolute values on $\\ln|x-a|$.',
  ],
  checkins: ['ci-f25-0909', 'ci-s26-0203', 'ci-s26-0210', 'ci-s25-0204', 'ci-s26-0205', 'ci-f25-0911', 'ci-s25-0206'],
  drill: ['techniques/Partial Fractions', 'precalc/Factoring & Polynomial Division'],
});

add({
  id: 'ln-improper', n: 8, title: 'Improper Integrals', unit: 'techniques',
  dates: ['2026-09-10'],
  goal: 'Spot every kind of impropriety, rewrite with a limit, and decide convergence rigorously.',
  why: 'Always on Exam 1, and it returns on the final. Fall 2025 Q4 hid a singularity *inside* the interval — $\\int_{1}^{3}\\frac{dx}{x-2}$ — which is the trap he most likes to set.',
  sections: [
    {
      h: 'Three ways an integral is improper',
      body: 'An infinite limit of integration; a vertical asymptote at an **endpoint**; or — the one people miss — a vertical asymptote **strictly inside** the interval. Always scan the denominator for zeros in $[a,b]$ before writing an antiderivative.',
    },
    {
      h: 'The interior singularity',
      body: 'If the integrand blows up at some $c$ with $a<c<b$, you must split: $\\displaystyle\\lim_{t\\to c^{-}}\\int_{a}^{t} + \\lim_{s\\to c^{+}}\\int_{s}^{b}$. **Both** pieces must converge, independently. If either diverges, the whole integral diverges — you may not let the infinities cancel.',
    },
    {
      h: 'The $p$-integral, both directions',
      body: 'On $[1,\\infty)$: $\\displaystyle\\int_{1}^{\\infty}\\frac{dx}{x^{p}}$ converges iff $p>1$. On $(0,1]$: $\\displaystyle\\int_{0}^{1}\\frac{dx}{x^{p}}$ converges iff $p<1$. The conditions are opposite — near infinity you need fast decay, near a singularity you need a mild one.',
    },
  ],
  worked: [
    {
      q: 'Determine whether $\\displaystyle\\int_{1}^{3}\\frac{dx}{x-2}$ converges  (his Fall 2025 Exam 1, Q4).',
      steps: [
        'The integrand blows up at $x=2$, which is **inside** $[1,3]$. This is improper.',
        'Split: $\\displaystyle\\lim_{t\\to2^{-}}\\int_{1}^{t}\\frac{dx}{x-2} + \\lim_{s\\to2^{+}}\\int_{s}^{3}\\frac{dx}{x-2}$.',
        'First piece: $\\displaystyle\\lim_{t\\to2^{-}}\\left[\\ln|x-2|\\right]_{1}^{t} = \\lim_{t\\to2^{-}}\\left(\\ln|t-2| - 0\\right) = -\\infty$.',
        'That piece diverges, so the whole integral **diverges**. No need to evaluate the second.',
      ],
      note: 'Applying FTC blindly gives $\\ln 1 - \\ln 1 = 0$, a confident and completely wrong answer. That is the trap.',
    },
  ],
  traps: [
    'Not checking for interior singularities. This is his favourite Exam 1 trap.',
    'Letting $+\\infty$ and $-\\infty$ cancel across a split. Each side must converge on its own.',
    'Writing an answer without ever writing a limit. He wants the limit notation.',
  ],
  checkins: ['ci-f25-0918', 'ci-s25-0211'],
  drill: ['techniques/Improper Integrals'],
});

add({
  id: 'ln-strategy', n: 9, title: 'Strategy & Applications', unit: 'techniques',
  dates: ['2026-09-15', '2026-09-17'],
  goal: 'Look at an unfamiliar integral and pick the right method in under fifteen seconds. Plus arc length.',
  why: 'Exam 1 gives you seven integrals with no instructions. Knowing *which* method is half the grade, and it is the skill that separates a 70 from a 95. Arc length is the one application he actually tests — Spring 2025 final, Q7.',
  sections: [
    {
      h: 'The decision order',
      body: '**1.** Can you simplify or expand first? (Often yes, and it ends the problem.)\n**2.** Is one factor the derivative of another\'s inside? → $u$-substitution.\n**3.** Is there a radical of the form $a^{2}\\pm x^{2}$ or $x^{2}-a^{2}$? → trig substitution.\n**4.** Is it a rational function? → partial fractions (after checking degrees).\n**5.** Powers of trig functions? → parity rules or product-to-sum.\n**6.** A product of unlike things? → parts, via LIATE.\n**7.** Still stuck? → convert everything to sines and cosines.',
    },
    {
      h: 'Arc length',
      body: '$L = \\displaystyle\\int_{a}^{b}\\sqrt{1+\\left(f\'(x)\\right)^{2}}\\,dx$. These are almost always designed so that $1+(f\')^{2}$ becomes a perfect square — if it does not simplify, re-check your derivative before grinding.',
    },
  ],
  worked: [
    {
      q: 'Compute the arc length of $y = 2+4x^{3/2}$ on $0\\leq x\\leq 2$  (Spring 2025 final, Q7).',
      steps: [
        '$f\'(x) = 6x^{1/2}$, so $\\left(f\'\\right)^{2} = 36x$.',
        '$L = \\displaystyle\\int_{0}^{2}\\sqrt{1+36x}\\,dx$.',
        'Substitute $u = 1+36x$, $du = 36\\,dx$: $\\tfrac{1}{36}\\displaystyle\\int_{1}^{73}\\sqrt u\\,du$.',
        '$= \\tfrac{1}{36}\\cdot\\tfrac23\\left[u^{3/2}\\right]_{1}^{73} = \\dfrac{73^{3/2}-1}{54}$.',
      ],
      note: 'The $\\frac32$ power exists so that squaring the derivative kills the fraction. That is the design.',
    },
  ],
  traps: [
    'Committing to a method before scanning for a simpler one. Expanding is often fastest.',
    'On arc length, squaring $f$ instead of $f\'$.',
  ],
  drill: ['techniques/Strategy for Integration', 'applications/Arc Length'],
});

add({
  id: 'ln-exam1', n: 10, title: 'Exam 1 Review', unit: 'techniques', kind: 'exam',
  dates: ['2026-09-22'],
  goal: 'Walk in able to name the method for any integral on sight, and execute it cleanly.',
  why: 'Exam 1 is 10% of your grade and is entirely techniques of integration plus improper integrals.',
  sections: [
    {
      h: 'What it actually looks like',
      body: 'Seven or eight integrals, no instructions beyond "showing all your work, compute the following." Based on his last four papers, expect: one odd-power trig integral, one tabular by-parts, one inverse-trig by-parts, one improper integral (check for an interior singularity), one trig substitution, one partial fraction over a cubic, and one product-to-sum.',
    },
    {
      h: 'How to spend the time',
      body: 'Do a first pass naming the method on every problem before solving any of them. Then work them in order of confidence. Show the setup line for each — he awards method marks even when the arithmetic goes wrong.',
    },
  ],
  traps: [
    'Not converting limits after a substitution.',
    'Missing an interior singularity on the improper integral.',
    'Leaving a trig-substitution answer in $\\theta$.',
    'Dropping absolute values inside logarithms.',
  ],
  drill: ['techniques/Strategy for Integration', 'techniques/Integration by Parts', 'techniques/Trigonometric Integrals',
    'techniques/Trigonometric Substitution', 'techniques/Partial Fractions', 'techniques/Improper Integrals',
    'techniques/Tabular & Looping Parts', 'techniques/Product-to-Sum Integrals'],
});

// =================================================================
// Unit 2 — Sequences & Series  (through Exam 2, 10/27)
// =================================================================

add({
  id: 'ln-sequences', n: 11, title: 'Sequences & Series', unit: 'series',
  dates: ['2026-09-24'],
  exam: [
    'Determine whether the sequence converges. If it converges, find its limit. (packet Sec 11.1)',
    'List the first N terms of the sequence. Does it converge? Explain.',
  ],
  goal: 'Tell a sequence from a series, and understand what it means for an infinite sum to have a value.',
  why: 'This is the conceptual foundation for the entire second half of the course — and for Exams 2, 3 and the final. Getting the sequence/series distinction wrong makes every later test meaningless.',
  sections: [
    {
      h: 'Sequence versus series',
      body: 'A **sequence** $\\{a_n\\}$ is a list. A **series** $\\sum a_n$ is the sum of that list. They are different objects with different questions: a sequence converges if its *terms* settle down; a series converges if its *partial sums* settle down.',
    },
    {
      h: 'Partial sums are the actual definition',
      body: '$\\sum_{n=1}^{\\infty}a_n$ means $\\displaystyle\\lim_{N\\to\\infty}S_N$ where $S_N = a_1+\\cdots+a_N$. Every convergence test is a shortcut for deciding whether that limit exists. When a test seems mysterious, come back to this.',
    },
    {
      h: 'The one-way street',
      body: 'If $\\sum a_n$ converges then $a_n\\to0$. The converse is **false** — $\\sum\\frac1n$ has terms going to zero and diverges anyway. This single asymmetry is the most-tested idea in the whole unit.',
    },
    {
      h: 'Decision checklist',
      body: '**1.** Direct limit? **2.** $\\infty/\\infty$: divide by top power or use L\'Hôpital on $f(x)$. **3.** Squeeze for bounded oscillation ($\\sin n/n$). **4.** Recursive: prove monotone and bounded before solving $L=g(L)$.',
    },
  ],
  worked: [
    {
      q: 'The sequence $a_n = \\dfrac{3n^{2}+1}{5n^{2}-n}$ converges to $\\tfrac35$. What about $\\sum a_n$?',
      steps: [
        'The *sequence* converges to $\\tfrac35$ — that is a statement about the terms.',
        'For the *series*, apply the Divergence Test: $\\lim a_n = \\tfrac35 \\neq 0$.',
        'Terms that do not shrink to zero can never sum to a finite number, so $\\sum a_n$ **diverges**.',
      ],
      note: 'A convergent sequence very often gives a divergent series. They are not the same question.',
    },
  ],
  traps: [
    'Concluding a series converges because its terms converge. Terms must go to **zero**, and even that is not enough.',
    'Confusing $a_n$ with $S_N$.',
    'Solving $L=2L+1$ without first proving the sequence converges.',
  ],
  drill: ['series/Sequences', 'precalc/Summation Notation'],
});

add({
  id: 'ln-geotel', n: 12, title: 'Geometric & Telescoping Series', unit: 'series',
  dates: ['2026-09-29'],
  exam: [
    'Is the geometric series convergent? If so, find its sum. (packet Sec 11.2 Ex 11-14)',
    'Show the series is telescoping, find $s_n$ by partial fractions, then find the sum. (Sec 11.2 Ex 9)',
    'Express the repeating decimal as a fraction. (Sec 11.2 Ex 40-41)',
  ],
  goal: 'Recognise a geometric series in disguise, find $r$ correctly, and sum telescoping series by cancellation.',
  why: 'These are the only two families where he asks for the **value**, not just convergence. Every Exam 2 has one of each: "determine whether the series converges. If it converges, find its sum."',
  sections: [
    {
      h: 'Normalise before reading $r$',
      body: 'A geometric series is $\\sum ar^{n}$. His exams never write it that way. $\\frac{7^{n}}{4^{2n}}$ looks like ratio $\\frac74$ until you notice $4^{2n} = 16^{n}$, making $r=\\frac{7}{16}$. Force every exponential onto a common power of $n$ **before** naming $r$: $b^{kn+c} = b^{c}\\left(b^{k}\\right)^{n}$.',
    },
    {
      h: 'The sum, and the starting index',
      body: 'If $|r|<1$: $\\displaystyle\\sum_{n=0}^{\\infty}ar^{n} = \\frac{a}{1-r}$. The formula is $\\frac{\\text{first term}}{1-r}$ — so if the sum starts at $n=1$, the first term is $ar$, not $a$. Getting this wrong is the most common way to lose the point after doing all the real work.',
    },
    {
      h: 'Telescoping',
      body: 'If $a_n = b_n - b_{n+1}$, almost everything cancels and $S_N = b_1 - b_{N+1}$. Write out three or four partial sums explicitly to see what survives — do not guess. Often you must run partial fractions first to reveal the difference.',
    },
    {
      h: 'Decision checklist',
      body: '**Geometric?** Normalise to $a r^{n}$, check $|r|<1$, sum $=\\frac{a}{1-r}$ with $a$ the FIRST term. **Telescoping?** Partial fractions, write $s_n$, take $\\lim s_n$.',
    },
  ],
  worked: [
    {
      q: 'Does $\\displaystyle\\sum_{n=1}^{\\infty}\\frac{(-3)^{n+1}}{2^{2n}}$ converge? If so, find its sum  (his Fall 2025 Exam 2, Q2).',
      steps: [
        'Normalise both exponentials: $(-3)^{n+1} = -3\\cdot(-3)^{n}$ and $2^{2n} = 4^{n}$.',
        'So the term is $-3\\left(\\dfrac{-3}{4}\\right)^{n}$ — geometric with $r = -\\tfrac34$.',
        '$|r| = \\tfrac34 < 1$, so it converges.',
        'Starting at $n=1$, the first term is $-3\\left(-\\tfrac34\\right) = \\tfrac94$.',
        'Sum $= \\dfrac{9/4}{1-(-3/4)} = \\dfrac{9/4}{7/4} = \\dfrac97$.',
      ],
      note: 'Two normalisations and a starting-index check. Each is a place to lose the problem.',
    },
    {
      q: 'Compute $\\displaystyle\\sum_{n=0}^{\\infty}\\left(\\frac{1}{n+2}-\\frac{1}{n+3}\\right)$  (his Fall 2025 Exam 2, Q7).',
      steps: [
        'Already a difference — telescoping. Write out $S_N$:',
        '$\\left(\\tfrac12-\\tfrac13\\right)+\\left(\\tfrac13-\\tfrac14\\right)+\\cdots+\\left(\\tfrac{1}{N+2}-\\tfrac{1}{N+3}\\right)$.',
        'Everything cancels except the first and last: $S_N = \\tfrac12 - \\dfrac{1}{N+3}$.',
        '$\\displaystyle\\lim_{N\\to\\infty}S_N = \\tfrac12$.',
      ],
      note: 'Writing $S_N$ explicitly is the whole method. Never try to see the cancellation in your head.',
    },
  ],
  traps: [
    'Reading $r$ off the unnormalised expression. $4^{2n}$ is $16^{n}$.',
    'Using $\\frac{a}{1-r}$ with $a$ from the formula rather than the actual first term of the sum.',
    'Guessing what telescopes instead of writing out $S_N$.',
    'Using $a/(1-r)$ with the wrong first term when the index starts at $n=1$ or $n=2$.',
  ],
  checkins: ['ci-f25-1002', 'ci-s26-0224', 'ci-s25-0225'],
  drill: ['series/Geometric & Telescoping'],
});

add({
  id: 'ln-divint', n: 13, title: 'Divergence & Integral Tests', unit: 'series',
  dates: ['2026-10-01'],
  exam: [
    'Use the Integral Test to determine whether the series converges. Verify the hypotheses. (packet Sec 11.3 Ex 3-8)',
    'Estimate the sum using the first $n$ terms and bound the remainder. (Sec 11.3 Ex 33-36)',
  ],
  goal: 'Use the Divergence Test as a first filter, and apply the Integral Test with its hypotheses stated.',
  why: 'The Divergence Test is the cheapest tool you own and settles several Exam 2 problems in one line. The Integral Test gets asked by name — Spring 2025 Q8 was "use the Integral Test to determine whether $\\sum\\frac{1}{n(\\ln n)^{4}}$ converges."',
  sections: [
    {
      h: 'The Divergence Test runs one way only',
      body: 'If $\\lim a_n\\neq0$, the series **diverges**. That is the entire theorem. If $\\lim a_n = 0$ it tells you **nothing** — not that the series converges, not that it diverges. He tests this asymmetry on a check-in nearly every semester, and the wrong answer is always "the terms go to zero, so it converges."',
    },
    {
      h: 'The Integral Test, hypotheses first',
      body: 'For $f$ **positive, continuous, and decreasing** on $[N,\\infty)$ with $a_n=f(n)$: $\\sum a_n$ and $\\int_N^{\\infty}f(x)dx$ converge or diverge **together**. You must state and check all three hypotheses — he grades that.',
    },
    {
      h: 'It gives a verdict, never a value',
      body: 'The series and the integral share a fate, not a number. $\\sum\\frac{n}{e^{n}} \\approx 0.9206$ while $\\int_1^\\infty\\frac{x}{e^{x}}dx = \\frac2e \\approx 0.7358$. If a question asks for a sum, the Integral Test is the wrong tool.',
    },
    {
      h: 'The $p$-series',
      body: '$\\displaystyle\\sum\\frac{1}{n^{p}}$ converges iff $p>1$. This is the Integral Test\'s most useful corollary and the yardstick for every comparison you will make.',
    },
    {
      h: 'Decision checklist',
      body: '**1.** $\\lim a_n\\ne0$: diverges. **2.** $p$-series: read $p$. **3.** Else Integral Test: write $f$, check positive, continuous, decreasing, integrate $\\int_1^\\infty f$.',
    },
  ],
  worked: [
    {
      q: 'Use the Integral Test on $\\displaystyle\\sum_{n=2}^{\\infty}\\frac{1}{n(\\ln n)^{4}}$  (Spring 2025 Exam 2, Q8).',
      steps: [
        'Let $f(x) = \\dfrac{1}{x(\\ln x)^{4}}$. On $[2,\\infty)$: positive ✓, continuous ✓, decreasing ✓ (both factors of the denominator grow).',
        '$\\displaystyle\\int_{2}^{\\infty}\\frac{dx}{x(\\ln x)^{4}}$ with $u=\\ln x$, $du = \\frac{dx}{x}$.',
        '$= \\displaystyle\\int_{\\ln 2}^{\\infty}u^{-4}du = \\left[\\frac{u^{-3}}{-3}\\right]_{\\ln 2}^{\\infty} = \\frac{1}{3(\\ln 2)^{3}}$.',
        'The integral converges, so the series converges.',
      ],
      note: 'Compare $\\sum\\frac{1}{n\\ln n}$: the same substitution gives $\\ln(\\ln x)\\to\\infty$, so *that* one diverges. The exponent on the log is everything.',
    },
  ],
  traps: [
    'Concluding convergence from $\\lim a_n = 0$.',
    'Applying the Integral Test without checking that $f$ is decreasing.',
    'Reporting the integral\'s value as the series\' sum.',
    'Skipping the "decreasing" hypothesis, or reporting the integral\'s value as the sum.',
  ],
  checkins: ['ci-f25-0930', 'ci-s26-0219', 'ci-s25-0220', 'ci-s26-0226'],
  drill: ['series/Divergence & Integral Tests', 'series/p-Series & Comparison'],
});

add({
  id: 'ln-alternating', n: 14, title: 'Alternating Series', unit: 'series',
  dates: ['2026-10-01'],
  exam: [
    'Show the alternating series converges. Find the smallest $N$ such that the error is less than $0.00005$. (packet Sec 11.5 Ex 23-26)',
    'Approximate the sum correct to 4 decimal places. (Sec 11.5 Ex 27-30)',
  ],
  goal: 'Apply the Alternating Series Test with both conditions, and bound the truncation error.',
  why: 'Every Exam 2 opens with an absolute-versus-conditional question built on an alternating series.',
  sections: [
    {
      h: 'The test',
      body: 'For $\\sum(-1)^{n}b_n$ with $b_n>0$: the series converges if **(1)** $b_n\\to0$ and **(2)** $b_n$ is eventually decreasing. Both conditions are required, and "eventually" is enough — the first few terms never matter.',
    },
    {
      h: 'The error bound',
      body: 'For a convergent alternating series, $\\left|S - S_N\\right| \\leq b_{N+1}$. The error is no bigger than the **first term you left out**. This is the cleanest error estimate in the course, and he asks for it.',
    },
    {
      h: 'Decision checklist',
      body: '**AST:** (i) $b_n\\to0$, (ii) $b_n$ decreasing. **Error:** $|R_N|\\le b_{N+1}$; solve $b_{N+1}<\\varepsilon$ and use $N$ terms.',
    },
  ],
  worked: [
    {
      q: 'How many terms of $\\displaystyle\\sum_{n=1}^{\\infty}\\frac{(-1)^{n-1}}{n^{2}}$ guarantee an error below $10^{-2}$?',
      steps: [
        'The bound is $\\left|S-S_N\\right|\\leq b_{N+1} = \\dfrac{1}{(N+1)^{2}}$.',
        'Require $\\dfrac{1}{(N+1)^{2}} < \\dfrac{1}{100}$, i.e. $(N+1)^{2}>100$, i.e. $N+1>10$.',
        'So $N \\geq 10$: ten terms suffice.',
      ],
      note: 'The bound uses the first **omitted** term, $b_{N+1}$ — an off-by-one here is a real answer change.',
    },
  ],
  traps: [
    'Checking $b_n\\to0$ but not that $b_n$ decreases.',
    'Using $b_N$ instead of $b_{N+1}$ in the error bound.',
    'Applying comparison tests to an alternating series — those require positive terms.',
    'Using $b_N$ instead of $b_{N+1}$ for the error bound.',
  ],
  checkins: ['ci-f25-1016', 'ci-f25-1007'],
  drill: ['series/Alternating Series & Error'],
});

add({
  id: 'ln-limcomp', n: 15, title: 'Limit Comparison Test', unit: 'series',
  dates: ['2026-10-06'],
  exam: [
    'Use the Limit Comparison Test to determine whether the series converges. (packet Sec 11.4 Ex 9-16)',
  ],
  goal: 'Choose the right comparison series by degree, and run the limit correctly.',
  why: 'His most-used test on Exam 2 — usually two problems. Fall 2025 Q3 and Q5 were both limit comparisons.',
  sections: [
    {
      h: 'The test',
      body: 'For **positive** sequences with $\\displaystyle\\lim_{n\\to\\infty}\\frac{a_n}{b_n} = L$ finite and nonzero, $\\sum a_n$ and $\\sum b_n$ share a fate. The positivity hypothesis is real: an alternating series disqualifies the test entirely.',
    },
    {
      h: 'Picking $b_n$: subtract the degrees',
      body: 'Keep only the dominant power on top and bottom and cancel. $\\dfrac{n^{2}}{n^{5}+1}\\to\\dfrac{n^{2}}{n^{5}} = \\dfrac{1}{n^{3}}$, so compare with $p=3$. Watch radicals: $\\sqrt{4n^{4}-2}$ behaves like $2n^{2}$, not $n^{4}$.',
    },
    {
      h: 'Decision checklist',
      body: '**1.** Keep leading behaviour to pick $b_n$. **2.** Compute $\\lim a_n/b_n$. **3.** Finite positive: same behaviour as $\\sum b_n$. **4.** $0$ or $\\infty$: not conclusive (unless the known side helps).',
    },
  ],
  worked: [
    {
      q: 'Does $\\displaystyle\\sum_{n=1}^{\\infty}\\frac{n+3}{\\sqrt{4n^{4}-2}}$ converge?  (his Fall 2025 Exam 2, Q3).',
      steps: [
        'Dominant behaviour: numerator $\\sim n$; denominator $\\sim\\sqrt{4n^{4}} = 2n^{2}$.',
        'So $a_n \\sim \\dfrac{n}{2n^{2}} = \\dfrac{1}{2n}$. Compare with $b_n = \\dfrac1n$.',
        '$\\displaystyle\\lim_{n\\to\\infty}\\frac{(n+3)/\\sqrt{4n^{4}-2}}{1/n} = \\lim\\frac{n^{2}+3n}{\\sqrt{4n^{4}-2}} = \\frac12$ — finite and nonzero ✓.',
        '$\\sum\\frac1n$ diverges ($p=1$), so the original series **diverges**.',
      ],
      note: 'The radical halves the exponent. Mishandling that is the usual error here.',
    },
  ],
  traps: [
    'Using it on an alternating series — the hypotheses require positive terms.',
    'Choosing $b_n$ from the wrong power. Subtract degrees carefully, with radicals halved.',
    'Not stating that the limit is finite and nonzero. That sentence is worth marks.',
    'Concluding from a limit of $0$ or $\\infty$ as if it were finite and positive.',
  ],
  checkins: ['ci-s26-0303', 'ci-f25-1007', 'ci-s25-0227', 'ci-s25-0306'],
  drill: ['series/Limit Comparison'],
});

add({
  id: 'ln-dircomp', n: 16, title: 'Direct Comparison Test', unit: 'series',
  dates: ['2026-10-08'],
  exam: [
    'Use the Comparison Test to determine whether the series converges. (packet Sec 11.4 Ex 3-8, 11-30, e.g. $\\sum\\frac{2+\\sin n}{n}$)',
  ],
  goal: 'Build a valid inequality in the direction the test actually needs.',
  why: 'He specifically tests the *direction* of the comparison — a check-in almost every semester presents a true inequality pointing the useless way.',
  sections: [
    {
      h: 'Two conclusions, and only two',
      body: 'For $0\\leq a_n\\leq b_n$: if $\\sum b_n$ **converges** then $\\sum a_n$ converges (squeezed below something finite). If $\\sum a_n$ **diverges** then $\\sum b_n$ diverges (pushed up by something infinite).\n\nBeing *smaller* than a divergent series tells you nothing. Being *bigger* than a convergent one tells you nothing.',
    },
    {
      h: 'Making the inequality',
      body: 'To make a fraction **bigger**: enlarge the numerator or shrink the denominator. To make it **smaller**: the reverse. Dropping a $+1$ from a denominator makes the fraction bigger; dropping it from a numerator makes it smaller.',
    },
    {
      h: 'When it gets awkward, switch',
      body: 'Direct comparison needs the inequality to point the right way, which sometimes it stubbornly refuses to do. Limit comparison does not care about direction — use it instead.',
    },
    {
      h: 'Decision checklist',
      body: '**Larger converges: smaller converges. Smaller diverges: larger diverges.** Mixed directions say nothing. Write the inequality explicitly for every $n$.',
    },
  ],
  worked: [
    {
      q: 'Show $\\displaystyle\\sum_{n=1}^{\\infty}\\frac{1}{n^{2}+1}$ converges by direct comparison.',
      steps: [
        'Want an upper bound. Shrinking the denominator makes the fraction bigger: $n^{2}+1 > n^{2}$.',
        'So $\\dfrac{1}{n^{2}+1} < \\dfrac{1}{n^{2}}$ for all $n\\geq1$.',
        '$\\sum\\dfrac{1}{n^{2}}$ converges ($p=2>1$).',
        'Smaller than a convergent series ⇒ the original converges.',
      ],
      note: 'This is the direction that works. The reverse inequality would prove nothing.',
    },
  ],
  traps: [
    'Concluding divergence because your series is *smaller* than a divergent one.',
    'Concluding convergence because your series is *bigger* than a convergent one.',
    'Forgetting that both series must be non-negative.',
    'Comparing in the wrong direction: a smaller convergent series proves nothing about a bigger one.',
  ],
  checkins: ['ci-f25-1014', 'ci-s26-0303'],
  drill: ['series/p-Series & Comparison'],
});

add({
  id: 'ln-abscond', n: 17, title: 'Absolute vs Conditional Convergence', unit: 'series',
  dates: ['2026-10-13'],
  exam: [
    'Determine whether the series is absolutely convergent, conditionally convergent, or divergent. Fully justify.',
  ],
  goal: 'Classify any alternating series as absolutely convergent, conditionally convergent, or divergent.',
  why: 'This is Question 1 on every Exam 2 he has written, phrased identically each time: "determine whether the following series is divergent, conditionally convergent, or absolutely convergent."',
  sections: [
    {
      h: 'The procedure',
      body: 'Always in this order. **1.** Test $\\sum|a_n|$. If it converges, the series is **absolutely convergent** and you are done. **2.** If $\\sum|a_n|$ diverges, test $\\sum a_n$ itself with the Alternating Series Test. If that converges, it is **conditionally convergent**. **3.** If neither converges, it **diverges**.',
    },
    {
      h: 'Why absolute is stronger',
      body: 'Absolute convergence implies convergence, but not conversely. $\\sum\\frac{(-1)^{n}}{n}$ converges while $\\sum\\frac1n$ does not — that is conditional convergence, and it is fragile: rearranging a conditionally convergent series can change its sum to anything you like.',
    },
    {
      h: 'Decision checklist',
      body: '**1.** Test $\\sum|a_n|$ first. **2.** If it converges: absolute. **3.** If it diverges and the series is alternating: AST, then conditional. **4.** If AST fails: divergent.',
    },
  ],
  worked: [
    {
      q: 'Classify $\\displaystyle\\sum_{n=1}^{\\infty}(-1)^{n}\\frac{\\sqrt n}{n+1}$  (his Fall 2025 Exam 2, Q1).',
      steps: [
        'Absolute first: $\\left|a_n\\right| = \\dfrac{\\sqrt n}{n+1} \\sim \\dfrac{n^{1/2}}{n} = \\dfrac{1}{n^{1/2}}$.',
        'Limit-compare with $\\frac{1}{\\sqrt n}$: the limit is $1$, and $\\sum\\frac{1}{\\sqrt n}$ diverges ($p=\\tfrac12<1$). So it is **not** absolutely convergent.',
        'Now the AST on the original: $b_n = \\dfrac{\\sqrt n}{n+1}\\to 0$ ✓, and it is eventually decreasing ✓.',
        'So the series converges — **conditionally convergent**.',
      ],
      note: 'Both halves are required for full marks: showing the absolute series diverges *and* that the alternating one converges.',
    },
  ],
  traps: [
    'Stopping after the AST and calling it "convergent" when the question asked which kind.',
    'Applying limit comparison to the alternating series rather than to $\\sum|a_n|$.',
    'Calling a series convergent when only the AST was checked, without testing absolute convergence.',
  ],
  checkins: ['ci-s25-0306', 'ci-f25-1016'],
  drill: ['series/Alternating Series & Error', 'series/Ratio & Root Tests'],
});

add({
  id: 'ln-ratioroot', n: 18, title: 'Ratio & Root Tests', unit: 'series',
  dates: ['2026-10-20'],
  exam: [
    'Use the Ratio Test to determine convergence. (packet Sec 11.6)',
    'Use the Root Test (whole term to the $n$-th power). (Fall 2025 Exam 2 Q4)',
  ],
  goal: 'Apply both tests, and know that $L=1$ is the only inconclusive case.',
  why: 'Exam 2 always has one of each, and the Ratio Test is how you find every radius of convergence on Exam 3. This lesson pays twice.',
  sections: [
    {
      h: 'Which one to reach for',
      body: '**Factorials or $n$ in an exponent** → Ratio Test: $L = \\displaystyle\\lim\\left|\\frac{a_{n+1}}{a_n}\\right|$. **The whole term raised to the $n$** → Root Test: $L = \\displaystyle\\lim\\left|a_n\\right|^{1/n}$, where the $n$th root cancels the exponent outright.',
    },
    {
      h: 'The three cases',
      body: '$L<1$ → converges absolutely. $L>1$ → diverges. $L=1$ → **inconclusive**, pick another test. Note that $L=0$ is not "no information" — it is the strongest possible convergence signal. He has set a check-in on exactly that confusion.',
    },
    {
      h: 'Factorial arithmetic',
      body: '$\\dfrac{(n+1)!}{n!} = n+1$. $\\dfrac{(2n+2)!}{(2n)!} = (2n+2)(2n+1)$. Expand carefully — most Ratio Test errors are factorial bookkeeping, not calculus.',
    },
    {
      h: 'Decision checklist',
      body: 'Factorial or $c^{n}$: Ratio. Whole term raised to $n$: Root. $L<1$ converges absolutely; $L>1$ diverges; $L=1$ inconclusive; never use on $p$-series.',
    },
  ],
  worked: [
    {
      q: 'Does $\\displaystyle\\sum_{n=0}^{\\infty}\\frac{n\\,2^{n}}{(2n)!}$ converge?  (his Fall 2025 Exam 2, Q6).',
      steps: [
        'Factorials ⇒ Ratio Test.',
        '$\\dfrac{a_{n+1}}{a_n} = \\dfrac{(n+1)2^{n+1}}{(2n+2)!}\\cdot\\dfrac{(2n)!}{n\\,2^{n}} = \\dfrac{(n+1)}{n}\\cdot\\dfrac{2}{(2n+2)(2n+1)}$.',
        'As $n\\to\\infty$: $\\dfrac{n+1}{n}\\to1$ and $\\dfrac{2}{(2n+2)(2n+1)}\\to0$.',
        '$L=0<1$, so the series converges absolutely.',
      ],
      note: 'Factorials in the denominator crush everything. $L=0$ here, which is decisive convergence.',
    },
    {
      q: 'Does $\\displaystyle\\sum_{n=1}^{\\infty}\\left(\\frac{3n^{2}+5}{2n(n+1)}\\right)^{n}$ converge?  (his Fall 2025 Exam 2, Q4).',
      steps: [
        'The whole term is to the $n$ ⇒ Root Test.',
        '$\\left|a_n\\right|^{1/n} = \\dfrac{3n^{2}+5}{2n(n+1)} = \\dfrac{3n^{2}+5}{2n^{2}+2n}$.',
        'Degrees match, so the limit is the ratio of leading coefficients: $L = \\tfrac32$.',
        '$L = 1.5 > 1$, so the series **diverges**.',
      ],
      note: 'The Root Test turns an intimidating expression into a routine rational limit.',
    },
  ],
  traps: [
    'Calling $L=0$ inconclusive. Only $L=1$ is.',
    'Botching $\\frac{(2n+2)!}{(2n)!}$ — write out the factors.',
    'Using the Ratio Test on a plain $p$-series, where it always gives $L=1$ and wastes your time.',
    'Treating $L=1$ as divergence.',
  ],
  checkins: ['ci-f25-1021', 'ci-s25-0318', 'ci-s26-0317', 'ci-s25-0304'],
  drill: ['series/Ratio & Root Tests', 'series/Choosing a Test'],
});

add({
  id: 'ln-powerseries', n: 19, title: 'Power Series', unit: 'series',
  dates: ['2026-10-22'],
  exam: [
    'Find the interval of convergence of $\\sum a_n(x-c)^n$. Be sure to check the endpoints. (Exam 3 Q3 and Q5 pattern)',
    'Find the centre and radius of convergence. (radius only: no endpoint work)',
    'Given the interval $[-1,2)$, state the centre and radius: centre $\\frac12$, radius $\\frac32$.',
    'Determine all $x$ for which the series converges. Fully justify.',
  ],
  goal: 'Find centre, radius, and the full interval of convergence — endpoints included.',
  why: 'Bridges Exams 2 and 3, and appears on both plus the final. Exam 3 typically has two or three of these.',
  sections: [
    {
      h: 'Three separate steps',
      body: '**Centre:** the $x$ that kills every term. **Radius:** run the Ratio Test on $|x-c|$ and solve $L<1$. **Endpoints:** substitute each one back in and test the resulting *numeric* series by hand. The Ratio Test is inconclusive exactly at the endpoints, which is why they need separate work — and why he gives them their own marks.',
    },
    {
      h: 'The shape is always an interval',
      body: 'A power series converges on: just the centre ($R=0$), an interval of radius $R$ about the centre, or the whole line ($R=\\infty$). Never a union of two tails. Given an interval, centre $=$ midpoint and radius $=$ half-width.',
    },
    {
      h: 'The two extremes',
      body: 'Factorial in the **numerator** ($\\sum n!x^{n}$) → $R=0$, converges only at the centre. Factorial in the **denominator** ($\\sum\\frac{x^{n}}{n!}$) → $R=\\infty$. And watch for a coefficient on $x$: $\\sum n!(5x+2)^{n}$ has centre $-\\frac25$, not $0$.',
    },
    {
      h: 'Decision checklist',
      body: '**1.** Factor to the form $(x-c)^n$ (pull any coefficient off $x$). **2.** Ratio Test on $|a_{n+1}/a_n|$, solve $L<1$ for $|x-c|<R$. **3.** Write the open interval $(c-R,c+R)$. **4.** Substitute each endpoint, name a test for each numeric series. **5.** State the interval with the right bracket on each side. If a factorial is on top, $R=0$; if on the bottom, $R=\\infty$ (no endpoints).',
    },
  ],
  worked: [
    {
      q: 'Find the interval of convergence of $\\displaystyle\\sum_{n=1}^{\\infty}\\frac{(x-4)^{n}}{n\\,5^{n}}$.',
      steps: [
        'Centre: $x=4$.',
        'Ratio Test: $\\displaystyle\\lim\\left|\\frac{(x-4)^{n+1}}{(n+1)5^{n+1}}\\cdot\\frac{n5^{n}}{(x-4)^{n}}\\right| = \\frac{|x-4|}{5}$.',
        '$\\frac{|x-4|}{5}<1 \\Rightarrow |x-4|<5 \\Rightarrow R=5$, open interval $(-1,9)$.',
        'Endpoint $x=9$: $\\sum\\frac{5^{n}}{n5^{n}} = \\sum\\frac1n$ — the harmonic series, **diverges**.',
        'Endpoint $x=-1$: $\\sum\\frac{(-5)^{n}}{n5^{n}} = \\sum\\frac{(-1)^{n}}{n}$ — alternating harmonic, **converges**.',
        'Interval of convergence: $[-1, 9)$.',
      ],
      note: 'The two endpoints disagreed. They usually do — which is exactly why you must test both.',
    },
    {
      q: 'Find the centre, radius and interval of convergence of $\\displaystyle\\sum_{n=1}^{\\infty}\\frac{(2x-1)^{n}}{n^{2}\\,3^{n}}$.',
      steps: [
        'Rewrite $2x-1 = 2\\left(x-\\tfrac12\\right)$: centre $x=\\tfrac12$.',
        'Ratio Test: $\\displaystyle\\lim\\left|\\frac{(2x-1)^{n+1}}{(n+1)^{2}3^{n+1}}\\cdot\\frac{n^{2}3^{n}}{(2x-1)^{n}}\\right|=\\frac{|2x-1|}{3}$.',
        '$\\frac{|2x-1|}{3}<1\\Rightarrow|2x-1|<3\\Rightarrow -1<x<2$, so $R=\\tfrac32$.',
        'Endpoint $x=2$: $\\sum\\frac{3^{n}}{n^{2}3^{n}}=\\sum\\frac1{n^{2}}$, a convergent $p$-series.',
        'Endpoint $x=-1$: $\\sum\\frac{(-3)^{n}}{n^{2}3^{n}}=\\sum\\frac{(-1)^{n}}{n^{2}}$, converges absolutely.',
        'Interval of convergence: $[-1,2]$.',
      ],
      note: 'Different archetype: coefficient on $x$, and both endpoints converge. Radius is half the width, $\\frac{2-(-1)}{2}$, not $3$.',
    },
  ],
  traps: [
    'Stopping at the radius and calling the open interval the answer.',
    'Assuming both endpoints behave the same way.',
    'Forgetting to factor out a coefficient on $x$ before reading the centre.',
    'Reading the radius as $3$ when the series is in $(2x-1)^n$: the radius is for $x-c$, so divide by the $2$.',
  ],
  checkins: ['ci-f25-1030', 'ci-s25-0327', 'ci-s26-0331', 'ci-s26-0326', 'ci-f25-1104', 'ci-s25-0401'],
  drill: ['series/Power Series & Radius'],
});

add({
  id: 'ln-exam2', n: 20, title: 'Exam 2 Review', unit: 'series', kind: 'exam',
  dates: ['2026-10-27'],
  exam: [
    'Determine whether the series is absolutely convergent, conditionally convergent, or divergent. Fully justify.',
    'Use the Ratio Test (or Root Test) to determine convergence. (Fall 2025 Exam 2 Q4 is a Root Test)',
    'Is the geometric series convergent? If so, find its sum.',
    'Show the series is telescoping, find $s_n$ by partial fractions, then find the sum.',
    'Decide which test to use for each series (packet Sec 11.7 style).',
  ],
  goal: 'Pick the right convergence test on sight and justify it the way he grades it.',
  why: 'Exam 2 is 10% of your grade: eight series, each needing a test named, applied, and justified.',
  sections: [
    {
      h: 'The shape of the paper',
      body: 'Eight problems. Typically: one absolute/conditional classification, one geometric with a sum, two limit comparisons, one root test, one ratio test with factorials, one telescoping sum, and one divergence test.',
    },
    {
      h: 'Choosing a test, in order',
      body: '**1.** Do the terms go to $0$? If not — done, diverges.\n**2.** Geometric or telescoping? Then you can get the actual sum.\n**3.** Rational or root-of-rational? → limit comparison with a $p$-series.\n**4.** Factorials or $n$ in an exponent? → Ratio Test.\n**5.** Whole thing to the $n$th power? → Root Test.\n**6.** Alternating? → absolute first, then AST.\n**7.** $f(n)$ easy to integrate? → Integral Test.',
    },
    {
      h: 'Justification is the grade',
      body: 'He writes "fully justifying your reasoning" on every problem. Name the test, verify its hypotheses out loud, show the limit, state the conclusion. A correct verdict with absent or invalid reasoning earns very little.',
    },
    {
      h: 'Decision checklist',
      body: 'Per series: **(a)** $\\lim a_n\\ne0$? Divergence Test, stop. **(b)** Name the form (geometric, telescoping, $p$, rational, factorial, $n$th power, alternating). **(c)** State the test\'s hypotheses (positive, decreasing, ...). **(d)** Show the limit or inequality. **(e)** Write the conclusion in the words he asked for (converges absolutely / conditionally / diverges).',
    },
  ],
  worked: [
    {
      q: 'Classify $\\displaystyle\\sum_{n=1}^{\\infty}\\frac{(-1)^{n}n}{n^{2}+1}$ as absolutely convergent, conditionally convergent, or divergent. Fully justify.',
      steps: [
        'Absolute series: $\\sum\\frac{n}{n^{2}+1}$. Positive terms, rational, so Limit Comparison with $\\sum\\frac1n$.',
        '$\\displaystyle\\lim\\frac{n/(n^{2}+1)}{1/n}=\\lim\\frac{n^{2}}{n^{2}+1}=1$, finite and positive, and $\\sum\\frac1n$ diverges, so $\\sum|a_n|$ **diverges**.',
        'Alternating Series Test on $b_n=\\frac{n}{n^{2}+1}$: $b_n\\to0$.',
        '$b_n$ is decreasing for $n\\ge1$: $b\'(n)=\\frac{1-n^{2}}{(n^{2}+1)^{2}}\\le0$.',
        'AST holds, so the series converges, but not absolutely: **conditionally convergent**.',
      ],
      note: 'Two tests, two verdicts, one classification. Order matters: absolute first.',
    },
  ],
  traps: [
    'Using a comparison test on an alternating series.',
    'Concluding convergence from $\\lim a_n = 0$.',
    'Reporting the Integral Test\'s value as the sum.',
    'Reading $r$ off an unnormalised geometric series.',
    'Stopping after the AST passes and calling it "convergent": he wants absolute vs conditional.',
  ],
  drill: ['series/Choosing a Test', 'series/Geometric & Telescoping', 'series/Divergence & Integral Tests',
    'series/p-Series & Comparison', 'series/Limit Comparison', 'series/Alternating Series & Error',
    'series/Ratio & Root Tests', 'series/Power Series & Radius'],
});

// =================================================================
// Unit 3 — Taylor Series  (through Exam 3, 11/19)
// =================================================================

add({
  id: 'ln-taylor', n: 21, title: 'Taylor & Maclaurin Series', unit: 'series',
  dates: ['2026-10-29', '2026-11-05'],
  exam: [
    'Complete the table of Maclaurin series: write each series in sigma notation and give its interval of convergence. (Exam 3 Q1, 18 pts, six rows)',
    'Find the Taylor series for $f(x)$ centred at $x=c$, from scratch. Do not use known series. (Exam 3 Q2)',
    'Find the Maclaurin series for $x\\cos(x^{3})$ and give its radius of convergence. (Exam 3 Q4)',
    'Use a known series to find the Maclaurin series of $f$; write your answer in sigma notation.',
  ],
  goal: 'Know the six standard Maclaurin series cold, build new ones by substitution, and derive one from scratch.',
  why: 'Exam 3 Question 1 is an 18-point table of exactly six Maclaurin series — the biggest single question of the term, and pure recall. Question 2 is a from-scratch derivation.',
  sections: [
    {
      h: 'The definition',
      body: 'Taylor series centred at $c$: $\\displaystyle\\sum_{n=0}^{\\infty}\\frac{f^{(n)}(c)}{n!}(x-c)^{n}$. Maclaurin is the case $c=0$. The degree-$n$ partial sum $T_n$ matches the first $n$ derivatives of $f$ at the centre.',
    },
    {
      h: 'The six you must memorise',
      body: '$\\dfrac{1}{1-x} = \\sum x^{n}$ on $(-1,1)$.\n\n$e^{x} = \\sum\\dfrac{x^{n}}{n!}$ on $(-\\infty,\\infty)$.\n\n$\\sin x = \\sum(-1)^{n}\\dfrac{x^{2n+1}}{(2n+1)!}$ on $(-\\infty,\\infty)$.\n\n$\\cos x = \\sum(-1)^{n}\\dfrac{x^{2n}}{(2n)!}$ on $(-\\infty,\\infty)$.\n\n$\\ln(1+x) = \\sum_{n\\geq1}(-1)^{n+1}\\dfrac{x^{n}}{n}$ on $(-1,1]$.\n\n$\\arctan x = \\sum(-1)^{n}\\dfrac{x^{2n+1}}{2n+1}$ on $[-1,1]$.\n\nThe intervals are part of the answer. Note all three are different at the endpoints.',
    },
    {
      h: 'Building new series',
      body: 'Substitute into a known one, then multiply through. For $x\\cos(x^{3})$: start from $\\cos u=\\sum(-1)^{n}\\frac{u^{2n}}{(2n)!}$, put $u=x^{3}$ to get exponent $6n$, then multiply by $x$ for $6n+1$. You may also differentiate or integrate term by term inside the radius.',
    },
    {
      h: 'From scratch',
      body: 'When he forbids known series: compute $f(c), f\'(c), f\'\'(c), f\'\'\'(c)$ as **numbers**, find the pattern for $f^{(n)}(c)$, then divide by $n!$. The factorials usually cancel. Compute four derivatives — three is not enough to see the pattern.',
    },
    {
      h: 'Decision checklist',
      body: '**Is a known series allowed?** Yes: pick the closest of the six, substitute for $x$, then multiply, differentiate or integrate. No ("from scratch"): four derivatives at $c$ as numbers, guess $f^{(n)}(c)$, divide by $n!$. **Check:** the first 2 or 3 terms of your sigma must match the derivatives. **Interval:** after substituting $u=g(x)$, solve the old interval for $u$ in $x$ (e.g. $|x/2|<1$ gives $R=2$).',
    },
  ],
  worked: [
    {
      q: 'Find the Maclaurin series for $x\\cos(x^{3})$  (his Fall 2025 Exam 3, Q4).',
      steps: [
        'Start from $\\cos u = \\displaystyle\\sum_{n=0}^{\\infty}(-1)^{n}\\frac{u^{2n}}{(2n)!}$.',
        'Substitute $u = x^{3}$: $\\left(x^{3}\\right)^{2n} = x^{6n}$.',
        'Multiply by the outside $x$: every exponent gains $1$.',
        '$x\\cos(x^{3}) = \\displaystyle\\sum_{n=0}^{\\infty}(-1)^{n}\\frac{x^{6n+1}}{(2n)!}$, valid for all $x$.',
      ],
      note: 'Substituting is not differentiating — no chain-rule factor appears.',
    },
    {
      q: 'Find the Taylor series for $f(x)=\\dfrac{3}{x^{2}}$ centred at $x=-1$, from scratch  (his Fall 2025 Exam 3, Q2).',
      steps: [
        'Derivatives: $f = 3x^{-2}$, $f\' = -6x^{-3}$, $f\'\' = 18x^{-4}$, $f\'\'\' = -72x^{-5}$.',
        'At $x=-1$: $3,\\;6,\\;18,\\;72$ — that is $3\\cdot1!,\\,3\\cdot2!,\\,3\\cdot3!,\\,3\\cdot4!$, so $f^{(n)}(-1) = 3(n+1)!$.',
        'Divide by $n!$: $\\dfrac{3(n+1)!}{n!} = 3(n+1)$.',
        'Centre $-1$ means powers of $(x+1)$: $\\;\\dfrac{3}{x^{2}} = \\displaystyle\\sum_{n=0}^{\\infty}3(n+1)(x+1)^{n}$.',
      ],
      note: 'The two sign factors cancelled — from the derivative and from evaluating at a negative number.',
    },
    {
      q: 'Find the Maclaurin series of $f(x)=\\dfrac{x^{2}}{2+x}$ and its radius of convergence.',
      steps: [
        'Rewrite as geometric: $\\dfrac{1}{2+x}=\\dfrac{1}{2}\\cdot\\dfrac{1}{1-(-x/2)}$.',
        '$\\dfrac1{1-u}=\\sum u^{n}$ with $u=-\\frac x2$: $\\dfrac1{2+x}=\\displaystyle\\sum_{n=0}^{\\infty}\\frac{(-1)^{n}x^{n}}{2^{n+1}}$.',
        'Multiply by $x^{2}$: $\\displaystyle\\frac{x^{2}}{2+x}=\\sum_{n=0}^{\\infty}\\frac{(-1)^{n}x^{n+2}}{2^{n+1}}=\\frac{x^{2}}2-\\frac{x^{3}}4+\\frac{x^{4}}8-\\cdots$',
        'Need $|u|=|x/2|<1$, so $R=2$.',
      ],
      note: 'Different archetype: a rational function, not a standard series. Force the form $\\frac1{1-u}$ by factoring out the constant. The radius changes from the standard $1$ to $2$.',
    },
  ],
  traps: [
    'Mixing up sine and cosine: odd powers with $(2n+1)!$ versus even powers with $(2n)!$.',
    'Putting factorials in $\\ln(1+x)$ or $\\arctan x$ — those have plain $n$ and $2n+1$.',
    'Writing $(x-c)^{n}$ with the wrong sign when the centre is negative.',
    'Using $\\frac1{1-x}$ directly on $\\frac1{2+x}$: factor out the $2$ first or the leading term is wrong.',
  ],
  checkins: ['ci-s26-0402', 'ci-f25-1106', 'ci-f25-1118', 'ci-s26-0414', 'ci-s25-0403'],
  drill: ['series/Taylor & Maclaurin Series'],
});

add({
  id: 'ln-remainder', n: 22, title: 'Taylor Remainder Theorem', unit: 'series',
  dates: ['2026-11-10'],
  exam: [
    'If one uses $T_2(x)$ to approximate $f(x)$ on $(-1,1)$, what is the largest possible error? (Exam 3 Q6/Q7 pattern)',
    'Use Taylor\'s inequality / the Lagrange remainder to bound $|R_n(x)|$ on the given interval.',
    'How many terms are needed to guarantee error less than $0.001$?',
    'True or false (justify): the Taylor series of $f$ converges to $f$ everywhere it converges.',
  ],
  goal: 'Write the Lagrange remainder correctly and bound the error of a Taylor approximation.',
  why: 'An Exam 3 question every semester: "if one uses $T_2(x)$ to approximate $f$ on $(-1,1)$, what is the largest possible error?"',
  sections: [
    {
      h: 'The formula, and the subtle part',
      body: '$R_n(x) = \\dfrac{f^{(n+1)}(z)}{(n+1)!}(x-c)^{n+1}$ for some $z$ **between** $x$ and $c$. It looks like the next term of the series, but the derivative is evaluated at an unknown interior point $z$ — not at the centre. Putting $z=c$ turns the remainder into the next *term*, which is a different object. He sets a check-in on exactly this.',
    },
    {
      h: 'You bound it, you never evaluate it',
      body: 'Since $z$ is unknown, maximise. Bound $\\left|f^{(n+1)}(z)\\right|$ over the interval, bound $|x-c|^{n+1}$ over the interval, multiply, divide by $(n+1)!$. Two separate maximisations.',
    },
    {
      h: 'Convergence is not automatic',
      body: 'A Taylor series converging does not mean it converges **to** $f$. That requires $R_n\\to0$, which can fail. The standard counterexample: $g(x)=e^{-1/x}$ for $x>0$ and $0$ otherwise has every derivative zero at the origin, so its Maclaurin series is identically $0$ and equals $g$ nowhere but the centre.',
    },
    {
      h: 'Decision checklist',
      body: '**1.** Identify $f$, centre $c$, degree $n$, interval. **2.** Write $R_n=\\frac{f^{(n+1)}(z)}{(n+1)!}(x-c)^{n+1}$. **3.** Find $M\\ge|f^{(n+1)}|$ on the interval (max, not value at $c$). **4.** Find the largest $|x-c|$ on the interval. **5.** Multiply and divide by $(n+1)!$. **6.** For "how many terms": solve the bound $<\\varepsilon$ by trying $n=1,2,\\dots$',
    },
  ],
  worked: [
    {
      q: 'Bound the error when $T_2(x)$ approximates $e^{x}$ on $(-1,1)$  (Spring 2025 Exam 3, Q7).',
      steps: [
        '$R_2(x) = \\dfrac{f^{(3)}(z)}{3!}x^{3}$ for some $z$ between $x$ and $0$.',
        'Every derivative of $e^{x}$ is $e^{x}$, so $f^{(3)}(z) = e^{z}$.',
        'Bound each piece on $(-1,1)$: $|z|<1 \\Rightarrow e^{z}<e$; and $|x|<1 \\Rightarrow |x|^{3}<1$.',
        '$\\left|R_2(x)\\right| < \\dfrac{e\\cdot1}{6} = \\dfrac{e}{6} \\approx 0.453$.',
      ],
      note: 'Using $z=0$ would give $\\frac16$ — a much smaller number, and not a valid bound.',
    },
    {
      q: 'How large must $n$ be so that $T_n(x)$ for $\\sin x$ at $c=0$ approximates $\\sin(1)$ with error less than $0.001$?',
      steps: [
        'Every derivative of $\\sin$ is $\\pm\\sin$ or $\\pm\\cos$, so $|f^{(n+1)}(z)|\\le1$.',
        '$|R_n(1)|\\le\\dfrac{1}{(n+1)!}\\cdot1^{n+1}=\\dfrac1{(n+1)!}$.',
        '$n=5$: $\\frac1{720}\\approx0.00139>0.001$ (not enough).',
        '$n=6$: $\\frac1{5040}\\approx0.000198<0.001$. So $n=6$.',
      ],
      note: 'Different archetype: find $n$ rather than bound a given $n$. Here $T_6=T_5$ for sine (no $x^6$ term), so $T_5$ already has error under $0.000198$.',
    },
  ],
  traps: [
    'Evaluating $f^{(n+1)}$ at the centre instead of bounding it over the interval.',
    'Using $n!$ instead of $(n+1)!$.',
    'Assuming a Taylor series always converges to its function.',
    'For "how many terms", solving with $n!$ instead of $(n+1)!$ and ending one degree short.',
  ],
  checkins: ['ci-s26-0409', 'ci-f25-1113', 'ci-s25-0415', 'ci-s25-0408'],
  drill: ['series/Taylor Polynomials & Error'],
});

add({
  id: 'ln-serapp', n: 23, title: 'Applications of Series', unit: 'series',
  dates: ['2026-11-12'],
  exam: [
    'Compute the following sum: $\\sum\\frac{3^{n}}{n!}$ (Exam 3 Q6; also on the final).',
    'Use a Maclaurin series to approximate $\\int_0^1 e^{-x^{2}}dx$; give the first nonzero terms.',
    'Use series to evaluate $\\lim_{x\\to0}\\frac{\\arctan x-x}{x^{3}}$.',
    'Find the sum of the series by recognising it as a Taylor series evaluated at a point.',
  ],
  goal: 'Sum numeric series by recognising a known Maclaurin form, and use series to evaluate limits and integrals.',
  why: 'Exam 3 and the final both ask you to "compute the following sum" for something like $\\sum\\frac{3^{n}}{n!}$ — trivial if you recognise it, impossible otherwise.',
  sections: [
    {
      h: 'Summing by pattern-matching',
      body: 'Rewrite the term so the variable part is literally $(\\text{something})^{n}$, match it against a known series, and read off $x$. Plain $n!$ → $e^{x}$. $(2n)!$ with even powers → $\\cos x$. $(2n+1)!$ with odd powers → $\\sin x$. No factorial, odd denominators → $\\arctan x$.',
    },
    {
      h: 'Non-elementary integrals',
      body: '$\\int e^{-x^{2}}dx$ has no elementary antiderivative, but its series does: substitute into $e^{u}$ and integrate term by term. This is how $\\int_{0}^{1}e^{-x^{2}}dx$ gets approximated, and he asks for the first few nonzero terms.',
    },
    {
      h: 'Limits by series',
      body: 'For $\\displaystyle\\lim_{x\\to0}\\frac{\\arctan x - x}{x^{3}}$, substitute the series: the numerator is $-\\frac{x^{3}}{3}+\\frac{x^{5}}{5}-\\cdots$, so the ratio tends to $-\\frac13$. Often faster than three rounds of L\'Hôpital.',
    },
    {
      h: 'Decision checklist',
      body: '**Sum:** factorial? $e^{x}$, $\\sin$, $\\cos$. Plain $n$ or $2n+1$ in the denominator? $\\ln(1+x)$ or $\\arctan x$. Constant ratio only? geometric. Pull out $(\\text{stuff})^{n}$ to read $x$, fix the starting index, check for $(-1)^{n}$. **Integral:** substitute, integrate term by term, evaluate bounds, stop after the requested terms. **Limit:** expand numerator and denominator to the first nonzero power, cancel.',
    },
  ],
  worked: [
    {
      q: 'Compute $\\displaystyle\\sum_{n=0}^{\\infty}\\frac{3^{n}}{n!}$  (Spring 2025 Exam 3, Q6).',
      steps: [
        'Plain $n!$ in the denominator ⇒ the exponential series $e^{x}=\\sum\\frac{x^{n}}{n!}$.',
        'Match $x^{n} = 3^{n}$, so $x=3$.',
        'The index starts at $n=0$ in both, so nothing needs shifting.',
        'Sum $= e^{3}$.',
      ],
      note: 'Compare $\\sum\\frac{1}{n!2^{n}}$: there the $2^{n}$ is in the denominator, so $x=\\frac12$ and the sum is $\\sqrt e$ — not $e^{2}$. He has set that exact trap.',
    },
    {
      q: 'Approximate $\\displaystyle\\int_{0}^{1}e^{-x^{2}}\\,dx$ using the first four nonzero terms of its series, and bound the error.',
      steps: [
        '$e^{u}=\\sum\\frac{u^{n}}{n!}$ with $u=-x^{2}$: $e^{-x^{2}}=1-x^{2}+\\frac{x^{4}}2-\\frac{x^{6}}6+\\frac{x^{8}}{24}-\\cdots$',
        'Integrate term by term: $\\displaystyle\\int_0^1=1-\\frac13+\\frac1{10}-\\frac1{42}+\\frac1{216}-\\cdots$',
        'First four terms: $1-\\frac13+\\frac1{10}-\\frac1{42}=\\frac{26}{35}\\approx0.7429$.',
        'Alternating series with decreasing terms: error $\\le$ first omitted term $=\\frac1{216}\\approx0.0046$.',
      ],
      note: 'Different archetype: an integral with no elementary antiderivative. True value $\\approx0.7468$, inside the bound.',
    },
  ],
  traps: [
    'Reading $x$ as $2$ when the term has $\\frac{1}{2^{n}}$ — it is $x=\\frac12$.',
    'Ignoring a starting index that differs from the standard series.',
    'Forgetting the alternating factor when matching sine or cosine.',
    'Putting the $x^{2}$ from $e^{-x^{2}}$ into the factorial: the term is $\\frac{(-1)^{n}x^{2n}}{n!}$, not $(2n)!$.',
  ],
  checkins: ['ci-s25-0410', 'ci-s26-0407', 'ci-f25-1111'],
  drill: ['series/Applications of Series', 'series/Taylor & Maclaurin Series'],
});

add({
  id: 'ln-exam3', n: 24, title: 'Exam 3 Review', unit: 'series', kind: 'exam',
  dates: ['2026-11-19'],
  exam: [
    'Q1: Fill in the table of six Maclaurin series with sigma form and interval of convergence (18 pts).',
    'Q2: Find the Taylor series centred at $c$ from scratch.',
    'Q3/Q5: Find the interval of convergence. Check endpoints.',
    'Q4: Find the Maclaurin series of a substituted function.',
    'Q6: Taylor polynomial and largest possible error on an interval; also compute $\\sum\\frac{3^{n}}{n!}$-type sums.',
  ],
  goal: 'Have the six-series table memorised and the power-series procedure automatic.',
  why: 'Exam 3 is 10% of your grade and is entirely power and Taylor series.',
  sections: [
    {
      h: 'The shape of the paper',
      body: 'Q1 the six-row Maclaurin table (18 points, pure recall). Q2 a Taylor series from scratch. Q3 and Q5 centre/radius/interval of convergence. Q4 a new Maclaurin series by substitution. Q6 a Taylor polynomial with a remainder bound.',
    },
    {
      h: 'Where the free points are',
      body: 'The table is the single biggest question of the term and requires no thinking at all — only memory. Write all six rows, all three columns, from memory in under two minutes, repeatedly, until the week of the exam. That alone is most of a letter grade.',
    },
    {
      h: 'Decision checklist',
      body: '**Series asks "for which $x$"?** Ratio Test then endpoints. **Asks for a series of $f$?** Known allowed: substitute; from scratch: derivatives. **Asks for a sum?** Match a known series. **Asks for an error?** Lagrange remainder: max of derivative times max of $|x-c|^{n+1}$ over $(n+1)!$. **Time check:** the table first (2 minutes), then the endpoint-heavy problems.',
    },
  ],
  worked: [
    {
      q: 'Compute $\\displaystyle\\sum_{n=0}^{\\infty}\\frac{(-1)^{n}\\pi^{2n}}{(2n)!}$.',
      steps: [
        'Even powers, $(2n)!$, alternating sign: $\\cos x=\\sum(-1)^{n}\\frac{x^{2n}}{(2n)!}$.',
        'Match $x^{2n}=\\pi^{2n}$, so $x=\\pi$.',
        'Sum $=\\cos\\pi=-1$.',
      ],
      note: 'Different archetype from $\\sum\\frac{3^n}{n!}$: sign and the exponent $2n$ tell you it is cosine, not the exponential.',
    },
  ],
  traps: [
    'Endpoint intervals: $\\frac{1}{1-x}$ is $(-1,1)$, $\\ln(1+x)$ is $(-1,1]$, $\\arctan x$ is $[-1,1]$. All three differ.',
    'Evaluating the remainder derivative at the centre.',
    'Stopping a power-series problem at the radius.',
    'Reading the sine/cosine pair by the numerator only: check whether the factorial is $(2n)!$ or $(2n+1)!$.',
  ],
  drill: ['series/Taylor & Maclaurin Series', 'series/Power Series & Radius', 'series/Taylor Polynomials & Error',
    'series/Applications of Series', 'series/Ratio & Root Tests'],
});

// =================================================================
// Unit 4 — Parametric & Polar, and the Final
// =================================================================

add({
  id: 'ln-polar', n: 25, title: 'Polar Coordinates', unit: 'polar',
  dates: ['2026-12-01'],
  exam: [
    'Find the area of the region enclosed by $r=f(\\theta)$. (set up and evaluate)',
    'Convert the rectangular equation/point to polar (or the reverse).',
    'Find the area inside one curve and outside another. (find the intersection angles first)',
    'Sketch the polar curve $r=\\dots$ and label the petals.',
  ],
  goal: 'Convert between polar and rectangular, sketch the standard curves, and set up polar area integrals.',
  why: 'Taught after Exam 3, so it appears only on the final — but it is guaranteed to be there and it is entirely learnable in an afternoon.',
  sections: [
    {
      h: 'The conversions',
      body: '$x = r\\cos\\theta$ and $y = r\\sin\\theta$ — cosine goes with $x$. Backwards: $r^{2}=x^{2}+y^{2}$ and $\\tan\\theta = \\frac yx$. Draw the triangle rather than trusting memory; $\\theta$ is measured from the positive $x$-axis, so the adjacent leg is $x$.',
    },
    {
      h: 'Area in polar',
      body: '$A = \\displaystyle\\frac12\\int_{\\alpha}^{\\beta}r^{2}\\,d\\theta$. The $\\frac12$ and the **square** are both essential — this is a sum of circular sectors, not rectangles. The hard part is almost always finding $\\alpha$ and $\\beta$: set $r=0$ or find where two curves intersect.',
    },
    {
      h: 'Petal counting',
      body: '$r = a\\cos(k\\theta)$ or $a\\sin(k\\theta)$ has $k$ petals when $k$ is **odd** and $2k$ petals when $k$ is **even**.',
    },
    {
      h: 'Decision checklist',
      body: '**1.** Find where $r=0$ or where the curves meet (limits). **2.** Decide which curve is outer on that interval. **3.** $A=\\frac12\\int(r_{out}^{2}-r_{in}^{2})\\,d\\theta$, not $(r_{out}-r_{in})^2$. **4.** Reduce $\\sin^2,\\cos^2$ with half-angle. **5.** Sanity check: area positive, less than the circle that contains it.',
    },
  ],
  worked: [
    {
      q: 'Find the area of one petal of $r = 3\\cos(2\\theta)$.',
      steps: [
        '$k=2$ is even, so there are $4$ petals.',
        'A petal spans from one zero of $r$ to the next: $\\cos 2\\theta = 0$ at $\\theta = \\pm\\frac{\\pi}{4}$.',
        '$A = \\displaystyle\\frac12\\int_{-\\pi/4}^{\\pi/4}9\\cos^{2}(2\\theta)\\,d\\theta$.',
        'Half-angle: $\\cos^{2}(2\\theta) = \\frac{1+\\cos 4\\theta}{2}$, giving $A = \\frac94\\left[\\theta + \\frac{\\sin 4\\theta}{4}\\right]_{-\\pi/4}^{\\pi/4} = \\frac{9\\pi}{8}$.',
      ],
      note: 'Finding the limits was the real work. The integral itself is a routine half-angle.',
    },
    {
      q: 'Find the area inside $r=3\\sin\\theta$ and outside $r=1+\\sin\\theta$.',
      steps: [
        'Intersect: $3\\sin\\theta=1+\\sin\\theta\\Rightarrow\\sin\\theta=\\frac12\\Rightarrow\\theta=\\frac\\pi6,\\frac{5\\pi}6$.',
        'On $(\\frac\\pi6,\\frac{5\\pi}6)$ the circle $3\\sin\\theta$ is the outer curve.',
        '$A=\\frac12\\displaystyle\\int_{\\pi/6}^{5\\pi/6}\\left(9\\sin^{2}\\theta-(1+\\sin\\theta)^{2}\\right)d\\theta$.',
        'Simplify the integrand: $8\\sin^{2}\\theta-2\\sin\\theta-1$; evaluate: $A=\\pi$.',
      ],
      note: 'Different archetype: two curves. The key step is subtracting squares of the radii, not squaring the difference.',
    },
  ],
  traps: [
    'Swapping the conversions — it is $x=r\\cos\\theta$, not $r\\sin\\theta$.',
    'Dropping the $\\frac12$ or forgetting to square $r$.',
    'Integrating over the whole circle when you wanted one petal.',
    'Using $\\theta$ limits from the sketch of one curve only, when the region is bounded by two.',
  ],
  checkins: ['ci-s25-0424'],
  drill: ['polar/Polar Coordinates', 'polar/Polar Area & Arc Length'],
});

add({
  id: 'ln-parametric', n: 26, title: 'Parametric Functions', unit: 'polar',
  dates: ['2026-12-03'],
  exam: [
    'Find $\\frac{dy}{dx}$ (and $\\frac{d^{2}y}{dx^{2}}$) at the given value of $t$.',
    'Find the equation of the tangent line to the curve at $t=\\dots$.',
    'Find the length of the curve $x=\\dots,\\ y=\\dots,\\ a\\le t\\le b$.',
    'Eliminate the parameter and sketch, indicating direction.',
  ],
  goal: 'Differentiate and find arc length for a curve given parametrically.',
  why: 'The last topic of the term, and it appears on the final. Short, formula-driven, and worth locking down.',
  sections: [
    {
      h: 'Slope',
      body: '$\\dfrac{dy}{dx} = \\dfrac{dy/dt}{dx/dt}$ — a ratio of derivatives, not a derivative of a ratio. For the second derivative, differentiate $\\frac{dy}{dx}$ with respect to $t$ and divide by $\\frac{dx}{dt}$ again: $\\dfrac{d^{2}y}{dx^{2}} = \\dfrac{\\frac{d}{dt}\\left(\\frac{dy}{dx}\\right)}{dx/dt}$.',
    },
    {
      h: 'Arc length',
      body: '$L = \\displaystyle\\int_{a}^{b}\\sqrt{\\left(\\frac{dx}{dt}\\right)^{2}+\\left(\\frac{dy}{dt}\\right)^{2}}\\,dt$ — the same Pythagorean idea as the rectangular version, with both coordinates now moving.',
    },
    {
      h: 'Decision checklist',
      body: '**Slope:** $\\frac{dy/dt}{dx/dt}$ at the given $t$. **Horizontal tangent:** $dy/dt=0$, $dx/dt\\ne0$. **Vertical:** $dx/dt=0$, $dy/dt\\ne0$. **Second derivative:** differentiate $dy/dx$ in $t$, divide by $dx/dt$. **Arc length:** simplify $x\'^2+y\'^2$ to a perfect square if the problem was designed to allow it.',
    },
  ],
  worked: [
    {
      q: 'Find $\\dfrac{dy}{dx}$ for $x=t^{2}+1$, $y=t^{3}-t$ at $t=2$.',
      steps: [
        '$\\dfrac{dx}{dt} = 2t$ and $\\dfrac{dy}{dt} = 3t^{2}-1$.',
        '$\\dfrac{dy}{dx} = \\dfrac{3t^{2}-1}{2t}$.',
        'At $t=2$: $\\dfrac{12-1}{4} = \\dfrac{11}{4}$.',
      ],
      note: 'No need to eliminate the parameter — that usually makes it harder.',
    },
    {
      q: 'Find the length of $x=t^{2},\\ y=t^{3}$ for $0\\le t\\le1$.',
      steps: [
        '$x\'=2t$, $y\'=3t^{2}$, so $x\'^{2}+y\'^{2}=4t^{2}+9t^{4}=t^{2}(4+9t^{2})$.',
        'For $t\\ge0$: $\\sqrt{\\cdot}=t\\sqrt{4+9t^{2}}$.',
        '$L=\\displaystyle\\int_0^1t\\sqrt{4+9t^{2}}\\,dt$, $u=4+9t^{2}$, $du=18t\\,dt$.',
        '$L=\\frac1{18}\\cdot\\frac23\\left[u^{3/2}\\right]_4^{13}=\\frac{13\\sqrt{13}-8}{27}\\approx1.4397$.',
      ],
      note: 'Factoring $t^2$ out of the radicand makes the substitution work. Also, $\\frac{d^2y}{dx^2}$ for $x=t^2+1,\\ y=t^3-t$ is $\\frac{3t^2+1}{4t^3}$, i.e. $\\frac{13}{32}$ at $t=2$.',
    },
  ],
  traps: [
    'Inverting the ratio: it is $\\frac{dy/dt}{dx/dt}$.',
    'For $\\frac{d^{2}y}{dx^{2}}$, forgetting the second division by $\\frac{dx}{dt}$.',
    'Forgetting that $\\sqrt{t^{2}}=|t|$; the sign matters when $t$ can be negative.',
  ],
  drill: ['polar/Parametric Curves', 'polar/Parametric Calculus'],
});

add({
  id: 'ln-final', n: 27, title: 'Final Exam Review', unit: 'series', kind: 'exam',
  dates: ['2026-12-10'],
  exam: [
    'Set up but do not evaluate an integral for arc length / surface area. (Exam 1 v1 Q2 pattern)',
    'Determine whether the series converges absolutely, conditionally, or diverges. Fully justify. (6 to 7 per final)',
    'Compute the integral (show all work, completely simplify). (Exam 1 Q1, Q3, Q4, Q5, Q6, Q8)',
    'Find the interval of convergence / Maclaurin series / error bound.',
  ],
  goal: 'Be ready for anything from the whole term, weighted toward series.',
  why: 'The final is 25% of your grade — more than any two midterms combined — and it is cumulative.',
  sections: [
    {
      h: 'The shape of the paper',
      body: 'His finals run 15 to 18 questions. Based on the last three: roughly five or six integration techniques, six or seven convergence tests, three power/Taylor questions, and one each of arc length, polar, and parametric.',
    },
    {
      h: 'How to revise',
      body: 'Series is the biggest block, so start there — but the integration techniques are the easiest marks to recover because the methods are mechanical once recognised. Use the mistake bank: it already knows what you personally get wrong.',
    },
    {
      h: 'Decision checklist',
      body: '**Integral?** Name the technique first: $u$-sub, parts (LIATE), trig integral, trig sub, partial fractions (long division if deg top $\\ge$ deg bottom), improper (limit!). **Series?** Divergence Test first, then the Choosing-a-Test order from Exam 2. **Taylor/power?** Ratio Test plus endpoints, six-series table. **Setup-only?** Write the integral and stop; do not evaluate.',
    },
  ],
  worked: [
    {
      q: 'Which test settles each? (a) $\\sum\\frac{n!}{3^{n}}$  (b) $\\sum\\frac{2n+1}{n^{3}+4}$  (c) $\\sum\\left(\\frac{n}{2n+1}\\right)^{n}$  (d) $\\sum\\frac{(-1)^{n}}{\\ln n}$ ($n\\ge2$).',
      steps: [
        '(a) Factorial: Ratio Test. $\\frac{n+1}{3}\\to\\infty$, so **diverges**.',
        '(b) Rational: Limit Comparison with $\\sum\\frac1{n^{2}}$; limit $2$; **converges**.',
        '(c) $n$th power: Root Test. $\\frac{n}{2n+1}\\to\\frac12<1$; **converges**.',
        '(d) Alternating: AST ($\\frac1{\\ln n}\\downarrow0$) converges; $\\sum\\frac1{\\ln n}\\ge\\sum\\frac1n$ diverges, so **conditionally convergent**.',
      ],
      note: 'Four series, four tests: this is the Exam 2 / final series block in miniature.',
    },
  ],
  traps: [
    'Under-preparing integration because it feels like old material. It is a third of the paper.',
    'Neglecting polar and parametric because they were taught in the last week.',
    'Using the Ratio Test on (b): $L=1$, inconclusive. Rational terms need Limit Comparison.',
  ],
  drill: ['techniques/Strategy for Integration', 'series/Choosing a Test', 'series/Taylor & Maclaurin Series',
    'series/Power Series & Radius', 'applications/Arc Length', 'polar/Polar Area & Arc Length', 'polar/Parametric Calculus'],
});

// Per-lesson rewrites (run fin): layer onto the old lesson with the same id.
// A rewrite only sets teaching fields; n/title/dates/unit/checkins/drill/exam stay unless it sets them.
for (const r of REWRITES) {
  const old = L.find(x => x.id === r.id);
  if (old) Object.assign(old, r);
}

/** Fixed practice ladders, flat, each item tagged with its lesson. Order = ladder order. */
export const LESSON_PRACTICE = L.flatMap(l => l.plain ? (l.practice || []).map(p => ({ ...p, lesson: l.id })) : []);

export const LESSONS = L;
export const lessonById = id => L.find(x => x.id === id) || null;

/** Lessons whose lecture has already happened, oldest first. */
export function lessonsThrough(dateKey) {
  return L.filter(l => l.dates[0] <= dateKey);
}

/** The lesson covering the next lecture on or after `dateKey`. */
export function nextLesson(dateKey) {
  return L.find(l => l.dates[l.dates.length - 1] >= dateKey) || null;
}

/** Group into the weeks of the semester, for the program view. */
export function byWeek() {
  const weeks = new Map();
  for (const l of L) {
    const d = new Date(l.dates[0] + 'T12:00:00Z');
    const day = d.getUTCDay();                       // 0=Sun
    const monday = new Date(d);
    monday.setUTCDate(d.getUTCDate() - ((day + 6) % 7));
    const key = monday.toISOString().slice(0, 10);
    if (!weeks.has(key)) weeks.set(key, []);
    weeks.get(key).push(l);
  }
  return [...weeks.entries()].sort((a, b) => a[0].localeCompare(b[0]));
}
