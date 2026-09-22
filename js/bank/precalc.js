// ---------------------------------------------------------------
// bank/precalc.js — Unit PRE: the algebra and trig Calc II assumes.
//
// Nothing here is Calc II content. Everything here is a place where
// Calc II problems actually go wrong: a botched log rule, a dropped
// sign in a half-angle identity, cancelling terms instead of factors.
// ---------------------------------------------------------------
import { frac, coef, choose } from '../util.js';

const P = [];
const G = [];

// =================================================================
// STATIC
// =================================================================

P.push({
  id: 'pre-radical-sum', topic: 'Exponent & Radical Rules', diff: 1,
  prompt: 'Simplify $\\sqrt{x^{2}+9}$.',
  choices: [
    { t: 'It is already simplified', ok: true },
    { t: '$x+3$', why: 'The single most expensive algebra error in Calc II. $\\sqrt{a+b}\\ne\\sqrt a+\\sqrt b$ — the root does **not** distribute over addition. Test it: $\\sqrt{16+9}=5$, but $4+3=7$.', err: 'distributing' },
    { t: '$x\\sqrt{9}$', why: 'You factored the sum as if it were a product. $x^{2}+9$ has no common factor to pull out.', err: 'distributing' },
    { t: '$x^{2}+3$', why: 'You took the root of the $9$ only. A radical applies to the **entire** expression underneath it.', err: 'distributing' },
  ],
  steps: [
    'Radicals distribute over **multiplication**, never over addition: $\\sqrt{ab}=\\sqrt a\\sqrt b$, but $\\sqrt{a+b}\\ne\\sqrt a+\\sqrt b$.',
    'Test with numbers whenever you are tempted: $\\sqrt{16+9}=\\sqrt{25}=5$, while $\\sqrt{16}+\\sqrt 9 = 4+3=7$.',
    '$x^{2}+9$ does not factor over the reals, so nothing escapes the radical.',
    'This is exactly why $\\int\\frac{dx}{\\sqrt{x^{2}+9}}$ needs a trig substitution — you cannot simplify your way out of it.',
  ],
  recall: '$\\sqrt{a+b}\\ne\\sqrt{a}+\\sqrt{b}$. When in doubt, plug in numbers.',
  viz: {
    kind: 'plot', xmin: 0, xmax: 6, ymin: 0, ymax: 10,
    curves: [
      { f: x => Math.sqrt(x * x + 9), color: 'var(--cyan)', label: '√(x²+9)' },
      { f: x => x + 3, color: 'var(--coral)', label: 'x + 3', dash: '5 3' },
    ],
    cap: 'The two are never equal (except in the limit). If an algebra step were valid, the curves would sit on top of each other.',
  },
});

P.push({
  id: 'pre-log-sum', topic: 'Logarithm & Exponential Rules', diff: 1,
  prompt: 'Which is a valid logarithm identity?',
  choices: [
    { t: '$\\ln(ab)=\\ln a+\\ln b$', ok: true },
    { t: '$\\ln(a+b)=\\ln a+\\ln b$', why: 'Logs turn **products** into sums, not sums into sums. $\\ln(a+b)$ cannot be broken up at all. Test: $\\ln(2+2)=\\ln4\\approx1.386$, but $\\ln2+\\ln2\\approx1.386$… careful — that one coincidence is exactly why people trust this. Try $\\ln(1+1)=0.693$ vs $\\ln1+\\ln1=0$.', err: 'distributing' },
    { t: '$\\dfrac{\\ln a}{\\ln b}=\\ln a-\\ln b$', why: 'A **quotient inside** the log becomes a difference: $\\ln\\frac ab=\\ln a-\\ln b$. A quotient **of** logs does not simplify (it is the change-of-base ratio).', err: 'formula-confusion' },
    { t: '$(\\ln a)^{2}=2\\ln a$', why: 'The power rule applies to an exponent **inside**: $\\ln(a^{2})=2\\ln a$. Squaring the whole logarithm is different.', err: 'formula-confusion' },
  ],
  steps: [
    'The three real rules: $\\ln(ab)=\\ln a+\\ln b$, $\\ln\\frac ab=\\ln a-\\ln b$, $\\ln(a^{b})=b\\ln a$.',
    'Every one of them acts on the **argument** of the log.',
    'Nothing simplifies $\\ln(a+b)$. There is no rule for the log of a sum.',
    'This matters in partial fractions: $\\int\\frac{dx}{(x-1)(x-2)}$ gives $\\ln|x-1|-\\ln|x-2| = \\ln\\left|\\frac{x-1}{x-2}\\right|$ — a difference of logs is a log of a quotient.',
  ],
  recall: 'Products → sums. Quotients → differences. Exponents → coefficients. Sums → nothing.',
});

P.push({
  id: 'pre-cancel', topic: 'Rational Expressions', diff: 2,
  prompt: 'Simplify $\\dfrac{x^{2}+4}{x^{2}}$.',
  choices: [
    { t: '$1+\\dfrac{4}{x^{2}}$', ok: true },
    { t: '$4$', why: 'You cancelled $x^{2}$ from the numerator and denominator. You may only cancel a common **factor** of the whole numerator — here $x^{2}$ is a *term* being added to $4$, not a factor multiplying it.', err: 'cancelling' },
    { t: '$1+4=5$', why: 'Same error, carried one step further. You cannot cancel $x^{2}$ against a term.', err: 'cancelling' },
    { t: '$\\dfrac{4}{x^{2}}$', why: 'You dropped the $x^{2}$ in the numerator instead of dividing it. $\\frac{x^{2}}{x^{2}}=1$, not $0$.', err: 'algebra-slip' },
  ],
  steps: [
    'Split the fraction over the common denominator: $\\dfrac{x^{2}+4}{x^{2}} = \\dfrac{x^{2}}{x^{2}}+\\dfrac{4}{x^{2}}$.',
    '$= 1+\\dfrac{4}{x^{2}}$',
    'You may cancel **factors**, never **terms**. $\\frac{x^{2}\\cdot 4}{x^{2}}=4$ is fine; $\\frac{x^{2}+4}{x^{2}}$ is not.',
    'Splitting like this is a standard first move — it turns hard-looking integrands into easy ones: $\\int\\frac{x^{2}+4}{x^{2}}dx = \\int\\left(1+4x^{-2}\\right)dx$.',
  ],
  recall: 'Cancel factors, not terms. If it is joined by $+$ or $-$, it cannot be cancelled.',
});

P.push({
  id: 'pre-halfangle', topic: 'Trig Identities', diff: 2,
  prompt: 'Which identity lets you integrate $\\sin^{2}x$?',
  choices: [
    { t: '$\\sin^{2}x=\\dfrac{1-\\cos 2x}{2}$', ok: true },
    { t: '$\\sin^{2}x=\\dfrac{1+\\cos 2x}{2}$', why: 'Signs swapped — that one is $\\cos^{2}x$. Check at $x=0$: $\\sin^{2}0=0$, and $\\frac{1-\\cos 0}{2}=\\frac{1-1}{2}=0$. ✓ Your version gives $1$. ✗', err: 'sign' },
    { t: '$\\sin^{2}x = 1-\\cos^{2}x$', why: 'True, but useless here — it just trades one even power for another. You need an identity that **removes** the square, and only the half-angle formula does that.', err: 'conceptual' },
    { t: '$\\sin^{2}x = 2\\sin x\\cos x$', why: 'That is $\\sin 2x$, the double-angle formula for sine — a different quantity entirely.', err: 'formula-confusion' },
  ],
  steps: [
    'An even power of sine or cosine cannot be handled by substitution — there is no spare factor to become $du$.',
    'The half-angle identities trade the square for a plain cosine: $\\sin^{2}x=\\frac{1-\\cos2x}{2}$, $\\cos^{2}x=\\frac{1+\\cos2x}{2}$.',
    'Remember which sign goes where by testing $x=0$: $\\sin^{2}0=0$ needs the minus; $\\cos^{2}0=1$ needs the plus.',
    '$\\displaystyle\\int\\sin^{2}x\\,dx = \\int\\frac{1-\\cos2x}{2}dx = \\frac x2-\\frac{\\sin2x}{4}+C$',
  ],
  recall: 'Sine gets the **minus**, cosine gets the **plus**. Verify with $x=0$ every time.',
  viz: {
    kind: 'plot', xmin: 0, xmax: 6.3, ymin: -0.3, ymax: 1.3,
    curves: [
      { f: x => Math.sin(x) ** 2, color: 'var(--cyan)', label: 'sin²x' },
      { f: x => (1 - Math.cos(2 * x)) / 2, color: 'var(--lime)', label: '(1−cos2x)/2', dash: '6 4' },
    ],
    cap: 'The two curves coincide exactly — that is what an identity means. The $+$ version would be its mirror image about $y=\\frac12$.',
  },
});

P.push({
  id: 'pre-arcsin-range', topic: 'Inverse Trig Values', diff: 3,
  prompt: 'Evaluate $\\sin^{-1}\\!\\left(\\sin\\frac{3\\pi}{4}\\right)$.',
  choices: [
    { t: '$\\dfrac{\\pi}{4}$', ok: true },
    { t: '$\\dfrac{3\\pi}{4}$', why: 'The tempting "they cancel" answer. But $\\sin^{-1}$ only returns values in $\\left[-\\frac\\pi2,\\frac\\pi2\\right]$, and $\\frac{3\\pi}{4}$ is outside that range. The functions undo each other only when the input is already in the restricted range.', err: 'conceptual' },
    { t: '$-\\dfrac{\\pi}{4}$', why: 'Right magnitude, wrong sign. $\\sin\\frac{3\\pi}{4}=+\\frac{\\sqrt2}{2}$ is positive, so the arcsine is positive too.', err: 'sign' },
    { t: '$\\dfrac{\\pi}{2}$', why: 'That would be $\\sin^{-1}(1)$. Here the inner value is $\\frac{\\sqrt2}{2}\\approx0.707$, not $1$.', err: 'algebra-slip' },
  ],
  steps: [
    'Work from the inside out — never assume inverse functions cancel.',
    '$\\sin\\frac{3\\pi}{4} = \\frac{\\sqrt2}{2}$.',
    'Now ask: which angle **in $\\left[-\\frac\\pi2,\\frac\\pi2\\right]$** has sine $\\frac{\\sqrt2}{2}$? That is $\\frac\\pi4$.',
    'So the answer is $\\frac\\pi4$, not $\\frac{3\\pi}{4}$. This range restriction is what makes trig substitution back-substitution work.',
  ],
  recall: 'Ranges: $\\sin^{-1}\\in\\left[-\\frac\\pi2,\\frac\\pi2\\right]$, $\\cos^{-1}\\in[0,\\pi]$, $\\tan^{-1}\\in\\left(-\\frac\\pi2,\\frac\\pi2\\right)$. Always evaluate inside-out.',
});

P.push({
  id: 'pre-index-shift', topic: 'Summation Notation', diff: 3,
  prompt: 'Rewrite $\\displaystyle\\sum_{n=2}^{\\infty} \\frac{1}{n-1}$ with the index starting at $n=1$.',
  choices: [
    { t: '$\\displaystyle\\sum_{n=1}^{\\infty}\\frac{1}{n}$', ok: true },
    { t: '$\\displaystyle\\sum_{n=1}^{\\infty}\\frac{1}{n-1}$', why: 'You moved the starting index without compensating inside. That changes the series — your version starts with $\\frac{1}{0}$, which is undefined.', err: 'off-by-one' },
    { t: '$\\displaystyle\\sum_{n=1}^{\\infty}\\frac{1}{n-2}$', why: 'Shifted the wrong way. Lowering the start by $1$ means replacing $n$ with $n+1$ inside, giving $\\frac{1}{(n+1)-1}=\\frac1n$.', err: 'off-by-one' },
    { t: '$\\displaystyle\\sum_{n=1}^{\\infty}\\frac{1}{n+1}$', why: 'That is the shift for a series that started at $n=2$ with $\\frac{1}{n+1}$ inside. Substitute carefully: replace every $n$ by $n+1$.', err: 'off-by-one' },
  ],
  steps: [
    'Let $m=n-1$. When $n=2$, $m=1$ — so the new index starts where you want.',
    'Solve back: $n=m+1$.',
    'Substitute into the term: $\\dfrac{1}{n-1}=\\dfrac{1}{(m+1)-1}=\\dfrac1m$.',
    'Rename $m$ back to $n$: $\\displaystyle\\sum_{n=1}^{\\infty}\\frac1n$ — the harmonic series, which diverges.',
  ],
  recall: 'Shifting the index down by $k$ means replacing $n$ with $n+k$ inside. Always check the first term matches before and after.',
});

P.push({
  id: 'pre-completing-square', topic: 'Completing the Square', diff: 2,
  prompt: 'Write $x^{2}+6x+13$ in completed-square form.',
  choices: [
    { t: '$(x+3)^{2}+4$', ok: true },
    { t: '$(x+3)^{2}+13$', why: 'You added $9$ to make the perfect square but never subtracted it back. $(x+3)^{2}=x^{2}+6x+9$, so you must write $13-9=4$ as the leftover.', err: 'algebra-slip' },
    { t: '$(x+6)^{2}-23$', why: 'You used $b$ instead of $\\frac b2$ inside. The constant inside is **half** the coefficient of $x$: $\\frac62=3$.', err: 'formula-confusion' },
    { t: '$(x-3)^{2}+4$', why: 'Sign. $(x-3)^{2}$ expands to $x^{2}-6x+9$, giving the wrong middle term.', err: 'sign' },
  ],
  steps: [
    'Take half the coefficient of $x$: $\\frac{6}{2}=3$. That is what goes inside.',
    '$(x+3)^{2} = x^{2}+6x+9$ — this accounts for $9$ of the constant.',
    'The original constant is $13$, so the leftover is $13-9=4$.',
    '$x^{2}+6x+13 = (x+3)^{2}+4$. Now $\\int\\frac{dx}{x^{2}+6x+13} = \\int\\frac{dx}{(x+3)^{2}+4} = \\frac12\\arctan\\frac{x+3}{2}+C$.',
  ],
  recall: 'Half the middle coefficient goes inside; subtract its square from the constant. This is how an unfactorable quadratic becomes an arctangent.',
});

P.push({
  id: 'pre-domain', topic: 'Function Transformations & Domain', diff: 2,
  prompt: 'What is the domain of $f(x)=\\ln(x-2)$?',
  choices: [
    { t: '$x>2$', ok: true },
    { t: '$x\\ge 2$', why: 'At $x=2$ the argument is $0$, and $\\ln 0$ is undefined ($\\to-\\infty$). The inequality must be **strict**.', err: 'off-by-one' },
    { t: '$x>0$', why: 'You applied the domain of $\\ln x$ without accounting for the shift. The **argument** must be positive: $x-2>0$.', err: 'conceptual' },
    { t: 'All real numbers', why: 'Logarithms are only defined for positive arguments. This restriction is why $\\int\\frac{dx}{x}=\\ln|x|+C$ carries absolute-value bars.', err: 'conceptual' },
  ],
  steps: [
    'A logarithm requires a **strictly positive** argument.',
    'Set the argument positive: $x-2>0$.',
    '$x>2$.',
    'Domain restrictions matter for improper integrals — $\\int_{2}^{5}\\ln(x-2)\\,dx$ is improper at the left endpoint precisely because of this.',
  ],
  recall: 'Check the argument, not the variable: $\\ln(\\square)$ needs $\\square>0$; $\\sqrt{\\square}$ needs $\\square\\ge0$; $\\frac{1}{\\square}$ needs $\\square\\ne0$.',
});

P.push({
  id: 'pre-geometry-cone', topic: 'Geometry Formulas', diff: 1,
  prompt: 'What is the volume of a cone of radius $r$ and height $h$?',
  choices: [
    { t: '$\\dfrac{1}{3}\\pi r^{2}h$', ok: true },
    { t: '$\\pi r^{2}h$', why: 'That is a **cylinder**. A cone occupies exactly one third of the cylinder that contains it — which you can prove with the disk method.', err: 'formula-confusion' },
    { t: '$\\dfrac{4}{3}\\pi r^{3}$', why: 'That is a sphere. Note it has no $h$ in it — a giveaway that it cannot describe a cone.', err: 'formula-confusion' },
    { t: '$\\dfrac{1}{2}\\pi r^{2}h$', why: 'The factor is $\\frac13$, not $\\frac12$. Integrating $\\pi r^{2}$ scaled by $(x/h)^{2}$ produces the $\\frac13$ from $\\int x^{2}dx$.', err: 'formula-confusion' },
  ],
  steps: [
    'Set the cone up as a solid of revolution: revolve the line $y=\\frac{r}{h}x$ about the $x$-axis for $0\\le x\\le h$.',
    '$V=\\pi\\displaystyle\\int_0^h\\left(\\frac{r}{h}x\\right)^{2}dx = \\frac{\\pi r^{2}}{h^{2}}\\int_0^h x^{2}dx$',
    '$= \\dfrac{\\pi r^{2}}{h^{2}}\\cdot\\dfrac{h^{3}}{3} = \\dfrac{1}{3}\\pi r^{2}h$',
    'The $\\frac13$ comes straight from $\\int x^{2}dx=\\frac{x^{3}}{3}$ — the geometry formula *is* a calculus result.',
  ],
  recall: 'You can rederive every one of these with the disk method. Cone $=\\frac13$ of its cylinder; sphere $=\\frac23$ of its cylinder.',
  viz: {
    kind: 'revolve', top: x => 0.5 * x, a: 0, b: 4, axis: 0, slice: 2.6,
    axisLabel: 'y = 0', cap: 'Revolving a straight line gives a cone. Its volume is the integral of $\\pi(\\text{radius})^{2}$ — the $\\frac13$ is just the power rule.',
  },
});

P.push({
  id: 'pre-signchart', topic: 'Inequalities & Sign Charts', diff: 3,
  prompt: 'Solve $|x-3|<2$.',
  choices: [
    { t: '$1<x<5$', ok: true },
    { t: '$x<5$', why: 'You dropped the lower bound. An absolute-value **less-than** always produces a bounded interval, trapped on both sides.', err: 'conceptual' },
    { t: '$x<1$ or $x>5$', why: 'That is the solution to $|x-3|>2$. The inequality direction flips the answer from an interval to its complement.', err: 'conceptual' },
    { t: '$-5<x<5$', why: 'You solved $|x|<5$. The $-3$ shifts the center of the interval to $3$, not $0$.', err: 'algebra-slip' },
  ],
  steps: [
    'Read $|x-3|<2$ as: the distance from $x$ to $3$ is less than $2$.',
    'Unwrap into a double inequality: $-2<x-3<2$.',
    'Add $3$ throughout: $1<x<5$.',
    'This is exactly the structure of an interval of convergence: $|x-c|<R$ means $c-R<x<c+R$.',
  ],
  recall: '$|x-c|<R \\iff c-R<x<c+R$ — an interval centered at $c$ with radius $R$. Greater-than gives the two outside pieces instead.',
  viz: {
    kind: 'numline', min: -1, max: 7,
    spans: [{ from: 1, to: 5, label: '|x − 3| < 2', color: 'var(--lime)' }],
    marks: [{ x: 3, label: 'center', color: 'var(--amber)' }, { x: 1, open: true, color: 'var(--lime)' }, { x: 5, open: true, color: 'var(--lime)' }],
    cap: 'Identical in structure to a radius of convergence: a center, a radius, and two endpoints that need checking separately.',
  },
});

P.push({
  id: 'pre-longdiv', topic: 'Factoring & Polynomial Division', diff: 3,
  prompt: 'Before applying partial fractions to $\\dfrac{x^{3}}{x^{2}-1}$, what must you do first?',
  choices: [
    { t: 'Divide — the fraction is improper', ok: true },
    { t: 'Nothing; set up $\\frac{A}{x-1}+\\frac{B}{x+1}$ directly', why: 'Partial fractions requires the numerator degree to be **less than** the denominator degree. Here $3\\ge 2$, so the setup is invalid and the system will have no solution.', err: 'conceptual' },
    { t: 'Factor the numerator', why: '$x^{3}$ is already factored. The problem is its **degree**, not its form.', err: 'conceptual' },
    { t: 'Complete the square in the denominator', why: '$x^{2}-1$ factors as $(x-1)(x+1)$ — it has real roots, so completing the square gains you nothing.', err: 'formula-confusion' },
  ],
  steps: [
    'Compare degrees: numerator $3$, denominator $2$. The fraction is **improper**.',
    'Long division first: $\\dfrac{x^{3}}{x^{2}-1} = x + \\dfrac{x}{x^{2}-1}$.',
    'Now the remainder $\\frac{x}{x^{2}-1}$ is proper, so partial fractions applies to it.',
    '$\\displaystyle\\int\\frac{x^{3}}{x^{2}-1}dx = \\int x\\,dx+\\int\\frac{x\\,dx}{x^{2}-1} = \\frac{x^{2}}{2}+\\frac12\\ln|x^{2}-1|+C$',
  ],
  recall: 'Always compare degrees before partial fractions. Numerator degree $\\ge$ denominator degree → divide first.',
});

P.push({
  id: 'pre-exp-solve', topic: 'Logarithm & Exponential Rules', diff: 2,
  prompt: 'Solve $e^{2x}=7$ for $x$.',
  choices: [
    { t: '$x=\\dfrac{\\ln 7}{2}$', ok: true },
    { t: '$x=\\ln\\dfrac{7}{2}$', why: 'You divided the $7$ by $2$ instead of dividing the whole logarithm. Take the log **first**, then divide: $2x=\\ln7$, so $x=\\frac{\\ln7}{2}$. Note $\\frac{\\ln7}{2}\\approx0.973$ while $\\ln3.5\\approx1.253$.', err: 'algebra-slip' },
    { t: '$x=2\\ln 7$', why: 'Multiplied where you should divide. From $2x=\\ln7$ you divide both sides by $2$.', err: 'algebra-slip' },
    { t: '$x=\\ln 7-2$', why: 'The $2$ is a **coefficient** of $x$, not something added to it. Undo multiplication by dividing.', err: 'algebra-slip' },
  ],
  steps: [
    'Take the natural log of both sides: $\\ln\\left(e^{2x}\\right)=\\ln 7$.',
    '$\\ln(e^{u})=u$, so the left side becomes $2x$.',
    '$2x=\\ln 7$',
    '$x=\\dfrac{\\ln 7}{2}\\approx 0.973$. This is exactly the half-life computation in disguise.',
  ],
  recall: '$\\ln$ and $e^{\\square}$ undo each other. Peel the exponential off first, then do ordinary algebra.',
});

// =================================================================
// GENERATORS
// =================================================================

G.push({
  id: 'g-pre-exponents', topic: 'Exponent & Radical Rules', diff: 1,
  make(r) {
    const kind = r.pick(['mult', 'power', 'neg', 'root']);
    // a !== b: with a = b = 2 the sum, product and power all equal 4 and the
    // distractors collapse onto the answer
    const a = r.int(2, 7);
    let b = r.int(2, 7);
    while (b === a) b = r.int(2, 7);
    if (kind === 'mult') {
      const key = `$x^{${a + b}}$`;
      return {
        prompt: `Simplify $x^{${a}}\\cdot x^{${b}}$.`,
        choices: [
          { t: key, ok: true },
          ...choose(key, [
            { t: `$x^{${a * b}}$`, why: `Multiplying powers of the same base **adds** the exponents. Multiplying the exponents is what happens for $(x^{${a}})^{${b}}$.`, err: 'formula-confusion' },
            { t: `$x^{${a}}x^{${b}}$`, why: 'It does simplify — same base, so combine the exponents.', err: 'conceptual' },
            { t: `$2x^{${a + b}}$`, why: 'No coefficient appears. $x^{a}\\cdot x^{b}$ is a single power, not two copies added.', err: 'algebra-slip' },
            { t: `$x^{${Math.abs(a - b)}}$`, why: 'Subtraction is for **division**: $\\frac{x^{a}}{x^{b}}=x^{a-b}$.', err: 'formula-confusion' },
          ]),
        ],
        steps: [
          `$x^{${a}}\\cdot x^{${b}}$ means $${a}$ copies of $x$ times $${b}$ copies of $x$.`,
          `Altogether that is $${a}+${b}=${a + b}$ copies.`,
          `$= x^{${a + b}}$`,
        ],
        recall: 'Same base: multiply → add exponents, divide → subtract, power of a power → multiply.',
      };
    }
    if (kind === 'power') {
      const key = `$x^{${a * b}}$`;
      return {
        prompt: `Simplify $\\left(x^{${a}}\\right)^{${b}}$.`,
        choices: [
          { t: key, ok: true },
          ...choose(key, [
            { t: `$x^{${a + b}}$`, why: 'Adding is for multiplying two powers. A power **of** a power multiplies the exponents.', err: 'formula-confusion' },
            a ** b <= 1e6 && { t: `$x^{${a ** b}}$`, why: 'You raised the exponent to a power rather than multiplying. The rule is $(x^{a})^{b}=x^{ab}$.', err: 'formula-confusion' },
            { t: `$${b}x^{${a}}$`, why: 'The outer exponent does not become a coefficient.', err: 'algebra-slip' },
            { t: `$x^{${Math.abs(a - b)}}$`, why: 'Subtraction is for dividing powers of the same base.', err: 'formula-confusion' },
            { t: `$${a}x^{${b}}$`, why: 'Neither number becomes a coefficient — both stay in the exponent.', err: 'algebra-slip' },
          ]),
        ],
        steps: [
          `$\\left(x^{${a}}\\right)^{${b}}$ is $${b}$ copies of $x^{${a}}$ multiplied together.`,
          `Adding the exponent $${a}$ a total of $${b}$ times gives $${a}\\cdot${b}=${a * b}$.`,
          `$= x^{${a * b}}$`,
        ],
        recall: '$(x^{a})^{b}=x^{ab}$. Multiply the exponents.',
      };
    }
    if (kind === 'neg') {
      const key = `$\\dfrac{1}{x^{${a}}}$`;
      return {
        prompt: `Rewrite $x^{-${a}}$ without a negative exponent.`,
        choices: [
          { t: key, ok: true },
          ...choose(key, [
            { t: `$-x^{${a}}$`, why: 'A negative **exponent** means a reciprocal, not a negative value. $2^{-1}=\\frac12$, not $-2$.', err: 'conceptual' },
            { t: `$-\\dfrac{1}{x^{${a}}}$`, why: 'The minus sign is consumed by the flip; it does not also survive out front.', err: 'sign' },
            { t: `$x^{\\frac{1}{${a}}}$`, why: 'A **fractional** exponent means a root. A **negative** exponent means a reciprocal.', err: 'formula-confusion' },
          ]),
        ],
        steps: [
          `$x^{-n}=\\dfrac{1}{x^{n}}$ — the minus flips the term across the fraction bar.`,
          `$x^{-${a}} = \\dfrac{1}{x^{${a}}}$`,
          `This is essential for integration: $\\int\\frac{dx}{x^{${a}}}=\\int x^{-${a}}dx = \\frac{x^{${1 - a}}}{${1 - a}}+C$.`,
        ],
        recall: 'Negative exponent → reciprocal. Fractional exponent → root. Rewrite every $\\frac{1}{x^{n}}$ as $x^{-n}$ before integrating.',
      };
    }
    const n = r.pick([2, 3]);
    // m must not be a multiple of n (else the exponent reduces and collides),
    // and m !== n (else the answer is just x)
    const m = r.pick(n === 2 ? [3, 5, 7] : [2, 4, 5, 7]);
    const key = n === 2 ? `$x^{${m}/2}$` : `$x^{${m}/3}$`;
    return {
      prompt: `Rewrite $\\sqrt[${n}]{x^{${m}}}$ with a fractional exponent.`,
      choices: [
        { t: key, ok: true },
        ...choose(key, [
          { t: `$x^{${n}/${m}}$`, why: `Inverted. The **root index** goes in the denominator: $\\sqrt[n]{x^{m}}=x^{m/n}$.`, err: 'formula-confusion' },
          { t: `$x^{${m * n}}$`, why: 'A root divides the exponent; it does not multiply it.', err: 'formula-confusion' },
          { t: `$x^{${m - n}}$`, why: 'Subtraction is for dividing powers, not for taking roots.', err: 'formula-confusion' },
        ]),
      ],
      steps: [
        `$\\sqrt[n]{x^{m}} = x^{m/n}$ — the root index becomes the denominator of the exponent.`,
        `$\\sqrt[${n}]{x^{${m}}} = x^{${m}/${n}}$`,
        `Always convert roots to exponents before integrating — the power rule needs an exponent to work with.`,
      ],
      recall: '$\\sqrt[n]{x^{m}}=x^{m/n}$. Index on the bottom, power on top.',
    };
  },
});

G.push({
  id: 'g-pre-factor', topic: 'Factoring & Polynomial Division', diff: 2,
  make(r) {
    const kind = r.pick(['quad', 'diffsq', 'cubes']);
    if (kind === 'quad') {
      const p = r.int(1, 6);
      let q = r.int(1, 6);
      while (q === p) q = r.int(1, 6);
      const b = p + q, c = p * q;
      const key = `$(x-${p})(x-${q})$`;
      return {
        prompt: `Factor $x^{2}-${b}x+${c}$.`,
        choices: [
          { t: key, ok: true },
          ...choose(key, [
            { t: `$(x+${p})(x+${q})$`, why: `Signs. Expanding your answer gives $x^{2}+${b}x+${c}$ — the middle term comes out positive, but it should be $-${b}x$.`, err: 'sign' },
            { t: `$(x-${p})(x+${q})$`, why: `Expanding gives a constant of $-${p * q}$, but you need $+${c}$. Two negatives are required to make the constant positive and the middle term negative.`, err: 'sign' },
            { t: `$(x-${b})(x-${c})$`, why: 'You used the coefficients themselves rather than the pair of numbers that multiply to the constant and add to the middle coefficient.', err: 'algebra-slip' },
            { t: `$(x-${p + 1})(x-${Math.max(1, q - 1)})$`, why: `Check by multiplying out: the constant must be exactly $${c}$ and the middle term $-${b}x$.`, err: 'algebra-slip' },
          ]),
        ],
        steps: [
          `Find two numbers that multiply to $${c}$ and add to $${b}$.`,
          `$${p}\\cdot${q}=${c}$ and $${p}+${q}=${b}$. ✓`,
          `Since the middle term is negative and the constant positive, both factors are negative: $(x-${p})(x-${q})$.`,
          `Factoring like this is step one of every partial-fractions problem.`,
        ],
        recall: 'Multiply to the constant, add to the middle coefficient. Then fix the signs by expanding mentally.',
      };
    }
    if (kind === 'diffsq') {
      const a = r.int(2, 9);
      const key = `$(x-${a})(x+${a})$`;
      return {
        prompt: `Factor $x^{2}-${a * a}$.`,
        choices: [
          { t: key, ok: true },
          ...choose(key, [
            { t: `$(x-${a})^{2}$`, why: `That expands to $x^{2}-${2 * a}x+${a * a}$ — it has a middle term, which the original does not.`, err: 'formula-confusion' },
            { t: `$(x+${a})^{2}$`, why: `That expands to $x^{2}+${2 * a}x+${a * a}$, with the wrong sign on the constant and an extra middle term.`, err: 'formula-confusion' },
            { t: 'It does not factor over the reals', why: `A **difference** of squares always factors: $a^{2}-b^{2}=(a-b)(a+b)$. It is the **sum** $x^{2}+${a * a}$ that is irreducible.`, err: 'conceptual' },
          ]),
        ],
        steps: [
          `Recognize the pattern $a^{2}-b^{2}$ with $a=x$, $b=${a}$.`,
          `$a^{2}-b^{2}=(a-b)(a+b)$`,
          `$x^{2}-${a * a} = (x-${a})(x+${a})$`,
          `Contrast: $x^{2}+${a * a}$ has no real roots and stays intact — which is why it becomes an arctangent rather than two logs.`,
        ],
        recall: 'Difference of squares factors. Sum of squares does not (over the reals).',
      };
    }
    const a = r.int(2, 4);
    const key = `$(x-${a})(x^{2}+${a}x+${a * a})$`;
    return {
      prompt: `Factor $x^{3}-${a ** 3}$.`,
      choices: [
        { t: key, ok: true },
        ...choose(key, [
          { t: `$(x-${a})^{3}$`, why: `That expands to $x^{3}-${3 * a}x^{2}+\\cdots$ — it has $x^{2}$ and $x$ terms the original lacks.`, err: 'formula-confusion' },
          { t: `$(x-${a})(x^{2}-${a}x+${a * a})$`, why: `Sign inside. For a **difference** of cubes the quadratic factor is $x^{2}+ax+a^{2}$ — the middle sign is opposite to the binomial's.`, err: 'sign' },
          { t: `$(x+${a})(x^{2}-${a}x+${a * a})$`, why: `That is the factorization of $x^{3}+${a ** 3}$, a **sum** of cubes.`, err: 'sign' },
        ]),
      ],
      steps: [
        `$a^{3}-b^{3}=(a-b)(a^{2}+ab+b^{2})$, with $b=${a}$.`,
        `$x^{3}-${a ** 3} = (x-${a})(x^{2}+${a}x+${a * a})$`,
        `Mnemonic (SOAP): **S**ame sign, **O**pposite sign, **A**lways **P**ositive.`,
        `The quadratic factor has discriminant $${a * a}-4(${a * a})<0$, so it is irreducible — it gets a linear numerator in partial fractions.`,
      ],
      recall: 'SOAP: same, opposite, always positive. $a^{3}\\mp b^{3}=(a\\mp b)(a^{2}\\pm ab+b^{2})$.',
    };
  },
});

G.push({
  id: 'g-pre-logs', topic: 'Logarithm & Exponential Rules', diff: 2,
  make(r) {
    const kind = r.pick(['expand', 'condense', 'solve']);
    if (kind === 'expand') {
      const n = r.int(2, 5);
      const key = `$\\ln x+${n}\\ln y$`;
      return {
        prompt: `Expand $\\ln\\left(xy^{${n}}\\right)$.`,
        choices: [
          { t: key, ok: true },
          ...choose(key, [
            { t: `$\\ln x\\cdot ${n}\\ln y$`, why: 'A product **inside** the log becomes a **sum** of logs, not a product of logs.', err: 'formula-confusion' },
            { t: `$${n}\\ln(xy)$`, why: `The exponent belongs only to $y$, so only $\\ln y$ picks up the factor $${n}$.`, err: 'algebra-slip' },
            { t: `$\\ln x+\\ln y^{${n}}\\cdot${n}$`, why: `Double-counted the exponent. Bring it down once: $\\ln y^{${n}}=${n}\\ln y$.`, err: 'algebra-slip' },
            { t: `$\\ln(x+${n}y)$`, why: 'You moved the operations inside the log. Expansion moves them **outside**.', err: 'distributing' },
          ]),
        ],
        steps: [
          `Product rule: $\\ln(xy^{${n}}) = \\ln x+\\ln y^{${n}}$.`,
          `Power rule on the second term: $\\ln y^{${n}} = ${n}\\ln y$.`,
          `$= \\ln x+${n}\\ln y$`,
        ],
        recall: 'Expand in two steps: split the product first, then bring exponents down.',
      };
    }
    if (kind === 'condense') {
      const n = r.int(2, 4);
      const key = `$\\ln\\dfrac{x^{${n}}}{y}$`;
      return {
        prompt: `Write $${n}\\ln x-\\ln y$ as a single logarithm.`,
        choices: [
          { t: key, ok: true },
          ...choose(key, [
            { t: `$\\ln\\dfrac{${n}x}{y}$`, why: `The coefficient becomes an **exponent**, not a multiplier: $${n}\\ln x=\\ln x^{${n}}$.`, err: 'formula-confusion' },
            { t: `$\\dfrac{\\ln x^{${n}}}{\\ln y}$`, why: 'A **difference** of logs is the log of a quotient — the division happens inside, not between the logs.', err: 'formula-confusion' },
            { t: `$\\ln\\left(x^{${n}}-y\\right)$`, why: 'Subtraction outside becomes **division** inside, never subtraction inside.', err: 'formula-confusion' },
          ]),
        ],
        steps: [
          `Move the coefficient up as an exponent: $${n}\\ln x=\\ln x^{${n}}$.`,
          `Difference of logs → log of a quotient: $\\ln x^{${n}}-\\ln y = \\ln\\dfrac{x^{${n}}}{y}$.`,
          `This is how partial-fraction answers get compressed: $\\ln|x-1|-\\ln|x-2| = \\ln\\left|\\frac{x-1}{x-2}\\right|$.`,
        ],
        recall: 'Coefficients become exponents; subtraction becomes division; addition becomes multiplication.',
      };
    }
    const c = r.int(2, 9), k = r.int(2, 4);
    const key = `$x=\\dfrac{\\ln ${c}}{${k}}$`;
    return {
      prompt: `Solve $e^{${k}x}=${c}$.`,
      choices: [
        { t: key, ok: true },
        ...choose(key, [
          { t: `$x=\\ln\\dfrac{${c}}{${k}}$`, why: `You divided inside the logarithm. Take $\\ln$ first to get $${k}x=\\ln ${c}$, **then** divide the whole thing by $${k}$.`, err: 'algebra-slip' },
          { t: `$x=${k}\\ln ${c}$`, why: `Multiplied instead of divided. From $${k}x=\\ln${c}$, divide both sides by $${k}$.`, err: 'algebra-slip' },
          { t: `$x=\\ln ${c}-${k}$`, why: `$${k}$ multiplies $x$; undo it by dividing, not subtracting.`, err: 'algebra-slip' },
          { t: `$x=\\dfrac{${c}}{${k}}$`, why: 'The logarithm never got applied. You cannot strip the $e$ without taking $\\ln$ of both sides.', err: 'conceptual' },
        ]),
      ],
      steps: [
        `Take $\\ln$ of both sides: $\\ln\\left(e^{${k}x}\\right)=\\ln ${c}$.`,
        `$\\ln(e^{u})=u$, so $${k}x=\\ln ${c}$.`,
        `$x=\\dfrac{\\ln ${c}}{${k}}\\approx ${Math.round(Math.log(c) / k * 1000) / 1000}$`,
      ],
      recall: 'Peel the exponential with $\\ln$, then solve the ordinary linear equation underneath.',
    };
  },
});

G.push({
  id: 'g-pre-unitcircle', topic: 'Unit Circle & Exact Values', diff: 1,
  make(r) {
    const table = [
      { ang: '0', s: '0', c: '1', t: '0' },
      { ang: '\\frac{\\pi}{6}', s: '\\frac{1}{2}', c: '\\frac{\\sqrt{3}}{2}', t: '\\frac{\\sqrt{3}}{3}' },
      { ang: '\\frac{\\pi}{4}', s: '\\frac{\\sqrt{2}}{2}', c: '\\frac{\\sqrt{2}}{2}', t: '1' },
      { ang: '\\frac{\\pi}{3}', s: '\\frac{\\sqrt{3}}{2}', c: '\\frac{1}{2}', t: '\\sqrt{3}' },
      { ang: '\\frac{\\pi}{2}', s: '1', c: '0', t: '\\text{undefined}' },
      { ang: '\\frac{2\\pi}{3}', s: '\\frac{\\sqrt{3}}{2}', c: '-\\frac{1}{2}', t: '-\\sqrt{3}' },
      { ang: '\\frac{3\\pi}{4}', s: '\\frac{\\sqrt{2}}{2}', c: '-\\frac{\\sqrt{2}}{2}', t: '-1' },
      { ang: '\\pi', s: '0', c: '-1', t: '0' },
      { ang: '\\frac{7\\pi}{6}', s: '-\\frac{1}{2}', c: '-\\frac{\\sqrt{3}}{2}', t: '\\frac{\\sqrt{3}}{3}' },
      { ang: '\\frac{3\\pi}{2}', s: '-1', c: '0', t: '\\text{undefined}' },
    ];
    const row = r.pick(table);
    // don't ask for tan where cos = 0 — "undefined" makes a poor multiple-choice key
    const fn = row.t === '\\text{undefined}' ? r.pick(['sin', 'cos']) : r.pick(['sin', 'cos', 'tan']);
    const key = `$${row[fn === 'sin' ? 's' : fn === 'cos' ? 'c' : 't']}$`;
    // plausible wrong values: the same angle's other functions, and sign flips
    const keyRaw = row[fn === 'sin' ? 's' : fn === 'cos' ? 'c' : 't'];
    const negate = v => (v.startsWith('-') ? v.slice(1) : '-' + v);
    const pool = [
      { t: `$${row.s}$`, why: `That is $\\sin${row.ang}$. Sine is the **$y$**-coordinate on the unit circle.`, err: 'formula-confusion' },
      { t: `$${row.c}$`, why: `That is $\\cos${row.ang}$. Cosine is the **$x$**-coordinate on the unit circle.`, err: 'formula-confusion' },
      row.t !== '\\text{undefined}' && { t: `$${row.t}$`, why: `That is $\\tan${row.ang}=\\frac{\\sin}{\\cos}$, not what was asked.`, err: 'formula-confusion' },
      keyRaw !== '0' && { t: `$${negate(keyRaw)}$`, why: 'Sign error — check which quadrant the angle lands in. ASTC: All, Sine, Tangent, Cosine are positive in quadrants I–IV respectively.', err: 'sign' },
      { t: '$\\frac{1}{2}$', why: 'A common exact value, but not this one. Rebuild it from the 30-60-90 or 45-45-90 triangle.', err: 'algebra-slip' },
      { t: '$\\frac{\\sqrt{2}}{2}$', why: 'That is the $45^{\\circ}$ value. This angle is not $\\frac\\pi4$ or a reflection of it.', err: 'algebra-slip' },
      { t: '$\\frac{\\sqrt{3}}{2}$', why: 'That is a $30^{\\circ}$/$60^{\\circ}$ value. Check the reference triangle for this specific angle.', err: 'algebra-slip' },
      { t: '$0$', why: 'Zero only occurs on the axes. Check where this angle actually lands.', err: 'algebra-slip' },
    ].filter(Boolean);
    return {
      prompt: `Evaluate $\\${fn}\\left(${row.ang}\\right)$.`,
      choices: [{ t: key, ok: true }, ...choose(key, r.shuffle(pool))],
      steps: [
        `Locate $${row.ang}$ on the unit circle and read off the point $(\\cos\\theta,\\sin\\theta)$.`,
        `At $${row.ang}$: $\\cos = ${row.c}$, $\\sin = ${row.s}$.`,
        fn === 'tan' ? `$\\tan = \\dfrac{\\sin}{\\cos} = ${row.t}$` : `So $\\${fn}\\left(${row.ang}\\right)=${row[fn === 'sin' ? 's' : 'c']}$.`,
        'These values appear constantly as limits of integration in trig substitution — knowing them cold saves real time.',
      ],
      recall: 'Cosine is $x$, sine is $y$. Build the rest from the 30-60-90 and 45-45-90 triangles.',
    };
  },
});

G.push({
  id: 'g-pre-identities', topic: 'Trig Identities', diff: 2,
  make(r) {
    const items = [
      { q: '\\sin^{2}\\theta+\\cos^{2}\\theta', a: '1', why: 'The Pythagorean identity — it is the equation of the unit circle.' },
      { q: '1+\\tan^{2}\\theta', a: '\\sec^{2}\\theta', why: 'Divide $\\sin^{2}+\\cos^{2}=1$ by $\\cos^{2}\\theta$. This is the identity that powers the $x=a\\tan\\theta$ substitution.' },
      { q: '\\sec^{2}\\theta-1', a: '\\tan^{2}\\theta', why: 'Rearranged Pythagorean identity — the one behind $x=a\\sec\\theta$.' },
      { q: '2\\sin\\theta\\cos\\theta', a: '\\sin 2\\theta', why: 'The double-angle formula for sine.' },
      { q: '\\cos^{2}\\theta-\\sin^{2}\\theta', a: '\\cos 2\\theta', why: 'The double-angle formula for cosine, in its symmetric form.' },
      { q: '1-2\\sin^{2}\\theta', a: '\\cos 2\\theta', why: 'Another form of $\\cos2\\theta$, obtained by substituting $\\cos^{2}=1-\\sin^{2}$.' },
    ];
    const pick = r.pick(items);
    const seen = new Set([pick.a]);
    const others = r.shuffle(items).filter(i => {
      if (seen.has(i.a)) return false;
      seen.add(i.a); return true;
    }).slice(0, 3);
    return {
      prompt: `Simplify $${pick.q}$.`,
      choices: [
        { t: `$${pick.a}$`, ok: true },
        ...others.map(o => ({
          t: `$${o.a}$`,
          why: `$${o.a}$ is what $${o.q}$ simplifies to (${o.why}) — a different starting expression. For yours: ${pick.why}`,
          err: 'formula-confusion',
        })),
      ],
      steps: [
        `Start from the unit-circle identity $\\sin^{2}\\theta+\\cos^{2}\\theta=1$; the others all follow from it.`,
        pick.why,
        `$${pick.q} = ${pick.a}$`,
      ],
      recall: 'Memorize $\\sin^{2}+\\cos^{2}=1$ and derive the rest by dividing by $\\cos^{2}$ or $\\sin^{2}$.',
    };
  },
});

G.push({
  id: 'g-pre-invtrig', topic: 'Inverse Trig Values', diff: 2,
  make(r) {
    const items = [
      { f: '\\sin^{-1}', arg: '\\frac{1}{2}', a: '\\frac{\\pi}{6}', range: '\\left[-\\frac\\pi2,\\frac\\pi2\\right]' },
      { f: '\\sin^{-1}', arg: '\\frac{\\sqrt{2}}{2}', a: '\\frac{\\pi}{4}', range: '\\left[-\\frac\\pi2,\\frac\\pi2\\right]' },
      { f: '\\sin^{-1}', arg: '-\\frac{1}{2}', a: '-\\frac{\\pi}{6}', range: '\\left[-\\frac\\pi2,\\frac\\pi2\\right]' },
      { f: '\\cos^{-1}', arg: '\\frac{1}{2}', a: '\\frac{\\pi}{3}', range: '[0,\\pi]' },
      { f: '\\cos^{-1}', arg: '0', a: '\\frac{\\pi}{2}', range: '[0,\\pi]' },
      { f: '\\cos^{-1}', arg: '-\\frac{1}{2}', a: '\\frac{2\\pi}{3}', range: '[0,\\pi]' },
      { f: '\\tan^{-1}', arg: '1', a: '\\frac{\\pi}{4}', range: '\\left(-\\frac\\pi2,\\frac\\pi2\\right)' },
      { f: '\\tan^{-1}', arg: '\\sqrt{3}', a: '\\frac{\\pi}{3}', range: '\\left(-\\frac\\pi2,\\frac\\pi2\\right)' },
    ];
    const o = r.pick(items);
    const key = `$${o.a}$`;
    const pool = [
      { t: '$\\frac{\\pi}{6}$', why: 'Check the reference triangle: which angle actually has this value?', err: 'algebra-slip' },
      { t: '$\\frac{\\pi}{3}$', why: 'Reference angle mixed up — $\\frac\\pi6$ and $\\frac\\pi3$ swap sine and cosine values.', err: 'algebra-slip' },
      { t: '$\\frac{\\pi}{4}$', why: 'That is the value whose sine and cosine are both $\\frac{\\sqrt2}{2}$.', err: 'algebra-slip' },
      { t: `$${o.a.startsWith('-') ? o.a.slice(1) : '-' + o.a}$`, why: `Sign. The output must lie in the range $${o.range}$, and the sign of the input determines which half.`, err: 'sign' },
      { t: '$\\frac{5\\pi}{6}$', why: `Outside the range $${o.range}$. Infinitely many angles share this trig value, but the inverse function returns exactly one.`, err: 'conceptual' },
      { t: '$\\frac{2\\pi}{3}$', why: `Check it against the range $${o.range}$ before accepting it.`, err: 'conceptual' },
    ];
    return {
      prompt: `Evaluate $${o.f}\\left(${o.arg}\\right)$.`,
      choices: [{ t: key, ok: true }, ...choose(key, r.shuffle(pool))],
      steps: [
        `Ask: which angle has $\\${o.f.replace('^{-1}', '')}$ equal to $${o.arg}$?`,
        `Restrict to the range of $${o.f}$, which is $${o.range}$.`,
        `The unique such angle is $${o.a}$.`,
        'The range restriction is what makes trig substitution reversible — it guarantees one answer, not infinitely many.',
      ],
      recall: `$\\sin^{-1}\\in\\left[-\\frac\\pi2,\\frac\\pi2\\right]$, $\\cos^{-1}\\in[0,\\pi]$, $\\tan^{-1}\\in\\left(-\\frac\\pi2,\\frac\\pi2\\right)$.`,
    };
  },
});

G.push({
  id: 'g-pre-rational', topic: 'Rational Expressions', diff: 2,
  make(r) {
    const kind = r.pick(['cancel', 'combine']);
    const a = r.int(2, 7);
    if (kind === 'cancel') {
      const key = `$x+${a}$`;
      return {
        prompt: `Simplify $\\dfrac{x^{2}-${a * a}}{x-${a}}$ (for $x\\ne ${a}$).`,
        choices: [
          { t: key, ok: true },
          ...choose(key, [
            { t: `$x-${a}$`, why: `Sign. Factoring gives $\\frac{(x-${a})(x+${a})}{x-${a}}$; the surviving factor is $x+${a}$.`, err: 'sign' },
            { t: `$x^{2}-${a * a - a}$`, why: 'You subtracted term by term instead of factoring and cancelling. Cancellation needs a common **factor**.', err: 'cancelling' },
            { t: `$\\dfrac{x^{2}}{x}-\\dfrac{${a * a}}{${a}}$`, why: 'Denominators do not split across a subtraction in the numerator that way. Factor first.', err: 'distributing' },
            { t: `$x$`, why: `You cancelled $x^{2}$ against $x$ and $${a * a}$ against $${a}$ — cancelling terms, not factors.`, err: 'cancelling' },
          ]),
        ],
        steps: [
          `Factor the numerator as a difference of squares: $x^{2}-${a * a}=(x-${a})(x+${a})$.`,
          `$\\dfrac{(x-${a})(x+${a})}{x-${a}}$`,
          `Now $x-${a}$ is a genuine **factor** of both, so it cancels: $x+${a}$.`,
          `This is the algebra behind $\\lim_{x\\to${a}}\\frac{x^{2}-${a * a}}{x-${a}} = ${2 * a}$ — a $\\frac00$ form resolved by factoring.`,
        ],
        recall: 'Factor before you cancel. A cancellation is only legal once both parts are products.',
      };
    }
    let b = r.int(2, 6);
    while (a + b === a * b) b = r.int(2, 6);   // a=b=2 makes sum and product collide
    const key = `$\\dfrac{${a + b}}{x}$`;
    return {
      prompt: `Combine $\\dfrac{${a}}{x}+\\dfrac{${b}}{x}$.`,
      choices: [
        { t: key, ok: true },
        ...choose(key, [
          { t: `$\\dfrac{${a + b}}{2x}$`, why: 'The denominators are already the same — you do not add them. Add only the numerators.', err: 'algebra-slip' },
          { t: `$\\dfrac{${a * b}}{x}$`, why: 'Adding fractions adds the numerators; multiplying them would multiply the numerators.', err: 'algebra-slip' },
          { t: `$\\dfrac{${a + b}}{x^{2}}$`, why: 'Common denominators stay as they are. Squaring would come from multiplying the fractions.', err: 'algebra-slip' },
        ]),
      ],
      steps: [
        `The denominators already match, so just add numerators.`,
        `$\\dfrac{${a}}{x}+\\dfrac{${b}}{x} = \\dfrac{${a}+${b}}{x} = \\dfrac{${a + b}}{x}$`,
        'Partial fractions runs this backwards — splitting one fraction into several with simpler denominators.',
      ],
      recall: 'Same denominator → add numerators only. Different denominators → find the LCD first.',
    };
  },
});

G.push({
  id: 'g-pre-complete-square', topic: 'Completing the Square', diff: 2,
  make(r) {
    const h = r.int(1, 6), k = r.int(1, 9);
    const b = 2 * h, c = h * h + k;
    const key = `$(x+${h})^{2}+${k}$`;
    return {
      prompt: `Write $x^{2}+${b}x+${c}$ in the form $(x+h)^{2}+k$.`,
      choices: [
        { t: key, ok: true },
        ...choose(key, [
          { t: `$(x+${h})^{2}+${c}$`, why: `You added $${h * h}$ to complete the square but never subtracted it back. The leftover constant is $${c}-${h * h}=${k}$.`, err: 'algebra-slip' },
          { t: `$(x+${b})^{2}+${k}$`, why: `Inside goes **half** the middle coefficient: $\\frac{${b}}{2}=${h}$, not $${b}$.`, err: 'formula-confusion' },
          { t: `$(x-${h})^{2}+${k}$`, why: `Sign. $(x-${h})^{2}$ expands with $-${b}x$, but the original has $+${b}x$.`, err: 'sign' },
          { t: `$(x+${h})^{2}-${k}$`, why: `The leftover is $+${k}$: $${c}-${h * h}=+${k}$.`, err: 'sign' },
        ]),
      ],
      steps: [
        `Half the middle coefficient: $\\dfrac{${b}}{2}=${h}$.`,
        `$(x+${h})^{2}=x^{2}+${b}x+${h * h}$ — this uses up $${h * h}$ of the constant.`,
        `Leftover: $${c}-${h * h}=${k}$.`,
        `$x^{2}+${b}x+${c}=(x+${h})^{2}+${k}$, which turns $\\int\\frac{dx}{x^{2}+${b}x+${c}}$ into an arctangent.`,
      ],
      recall: 'Half the middle coefficient goes inside; subtract its square from the constant.',
    };
  },
});

G.push({
  id: 'g-pre-summation', topic: 'Summation Notation', diff: 2,
  make(r) {
    const kind = r.pick(['formula', 'evaluate']);
    if (kind === 'formula') {
      const items = [
        { q: '\\sum_{i=1}^{n} 1', a: 'n', why: 'Adding $1$ a total of $n$ times.' },
        { q: '\\sum_{i=1}^{n} i', a: '\\dfrac{n(n+1)}{2}', why: 'Pair the first and last terms: $n/2$ pairs each summing to $n+1$.' },
        { q: '\\sum_{i=1}^{n} i^{2}', a: '\\dfrac{n(n+1)(2n+1)}{6}', why: 'The standard sum-of-squares formula.' },
        { q: '\\sum_{i=1}^{n} i^{3}', a: '\\left[\\dfrac{n(n+1)}{2}\\right]^{2}', why: 'The sum of cubes is the square of the sum of the first $n$ integers.' },
      ];
      const pick = r.pick(items);
      const others = r.some(items.filter(i => i.a !== pick.a), 3);
      return {
        prompt: `What is $\\displaystyle ${pick.q}$ in closed form?`,
        choices: [
          { t: `$${pick.a}$`, ok: true },
          ...others.map(o => ({ t: `$${o.a}$`, why: `That is the closed form of $\\displaystyle ${o.q}$ (${o.why}) — a different sum.`, err: 'formula-confusion' })),
        ],
        steps: [
          `${pick.why}`,
          `$\\displaystyle ${pick.q} = ${pick.a}$`,
          'These formulas are what turn a Riemann sum into a definite integral by hand — you need them to evaluate $\\lim_{n\\to\\infty}\\sum f(x_i)\\Delta x$ from the definition.',
        ],
        recall: '$\\sum i=\\frac{n(n+1)}{2}$, $\\sum i^{2}=\\frac{n(n+1)(2n+1)}{6}$, $\\sum i^{3}=\\left(\\sum i\\right)^{2}$.',
      };
    }
    const n = r.int(3, 6);
    const val = n * (n + 1) / 2;
    const key = `$${val}$`;
    return {
      prompt: `Evaluate $\\displaystyle\\sum_{i=1}^{${n}} i$.`,
      choices: [
        { t: key, ok: true },
        ...choose(key, [
          { t: `$${n}$`, why: `That is just the last term. The sigma means **add** every term from $i=1$ to $i=${n}$.`, err: 'conceptual' },
          { t: `$${n * n}$`, why: `You squared instead of using $\\frac{n(n+1)}{2}$.`, err: 'formula-confusion' },
          { t: `$${n * (n + 1)}$`, why: `Forgot to divide by $2$: $\\frac{${n}\\cdot${n + 1}}{2}=${val}$.`, err: 'algebra-slip' },
          { t: `$${(n * (n + 1) * (2 * n + 1)) / 6}$`, why: 'That is $\\sum i^{2}$, the sum of **squares**.', err: 'formula-confusion' },
        ]),
      ],
      steps: [
        `Write it out: $1+2+\\cdots+${n}$.`,
        `Or use the formula $\\sum_{i=1}^{n}i=\\frac{n(n+1)}{2}$ with $n=${n}$.`,
        `$= \\dfrac{${n}\\cdot${n + 1}}{2} = ${val}$`,
      ],
      recall: 'Sigma notation means add them all up — the index runs over every integer in the range.',
    };
  },
});

G.push({
  id: 'g-pre-domain', topic: 'Function Transformations & Domain', diff: 2,
  make(r) {
    const a = r.int(1, 6);
    const kind = r.pick(['sqrt', 'log', 'rational']);
    if (kind === 'sqrt') {
      const key = `$x\\ge ${a}$`;
      return {
        prompt: `What is the domain of $f(x)=\\sqrt{x-${a}}$?`,
        choices: [
          { t: key, ok: true },
          ...choose(key, [
            { t: `$x>${a}$`, why: `At $x=${a}$ the radicand is $0$, and $\\sqrt0=0$ is perfectly defined. The inequality is **not** strict (unlike a logarithm).`, err: 'off-by-one' },
            { t: `$x\\ge 0$`, why: `You used the domain of $\\sqrt x$ without the shift. The **radicand** must be non-negative: $x-${a}\\ge0$.`, err: 'conceptual' },
            { t: `$x\\le ${a}$`, why: 'Inequality reversed — you need the inside to be non-negative, not non-positive.', err: 'sign' },
            { t: 'All real numbers', why: 'Even roots of negative numbers are not real.', err: 'conceptual' },
          ]),
        ],
        steps: [
          `An even root needs a non-negative radicand.`,
          `$x-${a}\\ge 0$`,
          `$x\\ge ${a}$ — note $\\ge$, since $\\sqrt0$ is fine.`,
        ],
        recall: '$\\sqrt{\\square}$ allows $\\square=0$; $\\ln(\\square)$ and $\\frac{1}{\\square}$ do not.',
      };
    }
    if (kind === 'log') {
      const key = `$x>${a}$`;
      return {
        prompt: `What is the domain of $f(x)=\\ln(x-${a})$?`,
        choices: [
          { t: key, ok: true },
          ...choose(key, [
            { t: `$x\\ge ${a}$`, why: `$\\ln 0$ is undefined — it diverges to $-\\infty$. The inequality must be strict.`, err: 'off-by-one' },
            { t: `$x>0$`, why: `The **argument** must be positive, not $x$ itself: $x-${a}>0$.`, err: 'conceptual' },
            { t: `$x<${a}$`, why: 'Reversed. A logarithm needs a positive argument.', err: 'sign' },
            { t: 'All real numbers', why: 'Logarithms of non-positive numbers are undefined.', err: 'conceptual' },
          ]),
        ],
        steps: [
          `A logarithm requires a strictly positive argument.`,
          `$x-${a}>0$`,
          `$x>${a}$`,
        ],
        recall: 'Set the argument $>0$ and solve. Strict, always.',
      };
    }
    const key = `$x\\ne \\pm${a}$`;
    return {
      prompt: `What is the domain of $f(x)=\\dfrac{1}{x^{2}-${a * a}}$?`,
      choices: [
        { t: key, ok: true },
        ...choose(key, [
          { t: `$x\\ne ${a}$`, why: `$x^{2}-${a * a}=(x-${a})(x+${a})$ has **two** roots. Both $x=${a}$ and $x=-${a}$ must be excluded.`, err: 'algebra-slip' },
          { t: `$x\\ne ${a * a}$`, why: `Solve $x^{2}=${a * a}$, which gives $x=\\pm${a}$, not $x=${a * a}$.`, err: 'algebra-slip' },
          { t: `$x>${a}$`, why: 'A rational function is defined everywhere except where the denominator vanishes — the excluded set is two points, not a half-line.', err: 'conceptual' },
          { t: 'All real numbers', why: `The denominator is zero at $x=\\pm${a}$, so those points are excluded.`, err: 'conceptual' },
        ]),
      ],
      steps: [
        `Exclude wherever the denominator is zero.`,
        `$x^{2}-${a * a}=0 \\Rightarrow (x-${a})(x+${a})=0$`,
        `$x=\\pm${a}$ are excluded, so the domain is $x\\ne\\pm${a}$.`,
        `These are exactly the points that make $\\int\\frac{dx}{x^{2}-${a * a}}$ improper if they fall inside the interval.`,
      ],
      recall: 'Set the denominator to zero and solve. A quadratic usually excludes **two** points.',
    };
  },
});

G.push({
  id: 'g-pre-geometry', topic: 'Geometry Formulas', diff: 1,
  make(r) {
    const items = [
      { q: 'the area of a circle of radius $r$', a: '\\pi r^{2}' },
      { q: 'the circumference of a circle of radius $r$', a: '2\\pi r' },
      { q: 'the volume of a sphere of radius $r$', a: '\\frac{4}{3}\\pi r^{3}' },
      { q: 'the surface area of a sphere of radius $r$', a: '4\\pi r^{2}' },
      { q: 'the volume of a cylinder of radius $r$ and height $h$', a: '\\pi r^{2}h' },
      { q: 'the volume of a cone of radius $r$ and height $h$', a: '\\frac{1}{3}\\pi r^{2}h' },
      { q: 'the lateral surface area of a cylinder of radius $r$, height $h$', a: '2\\pi rh' },
    ];
    const pick = r.pick(items);
    const others = r.some(items.filter(i => i.a !== pick.a), 3);
    return {
      prompt: `What is ${pick.q}?`,
      choices: [
        { t: `$${pick.a}$`, ok: true },
        ...others.map(o => ({
          t: `$${o.a}$`, err: 'formula-confusion',
          why: `$${o.a}$ is ${o.q}. Check the **units**: an area formula must be quadratic in length, a volume formula cubic.`,
        })),
      ],
      steps: [
        `Check dimensions first — that alone rules out most wrong options.`,
        `Areas are quadratic in length ($r^{2}$, or $rh$); volumes are cubic ($r^{3}$, or $r^{2}h$).`,
        `${pick.q.charAt(0).toUpperCase() + pick.q.slice(1)} is $${pick.a}$.`,
        'You will use these constantly as sanity checks on volume and surface-area integrals.',
      ],
      recall: 'Dimension check: area ~ length², volume ~ length³. It catches most formula mix-ups instantly.',
    };
  },
});

G.push({
  id: 'g-pre-inequality', topic: 'Inequalities & Sign Charts', diff: 2,
  make(r) {
    const c = r.int(1, 6), R = r.int(1, 5);
    const kind = r.pick(['abs-less', 'abs-more']);
    if (kind === 'abs-less') {
      const key = `$${c - R}<x<${c + R}$`;
      return {
        prompt: `Solve $|x-${c}|<${R}$.`,
        choices: [
          { t: key, ok: true },
          ...choose(key, [
            { t: `$x<${c - R}$ or $x>${c + R}$`, why: 'That solves the **greater-than** version. Less-than traps $x$ between the two bounds.', err: 'conceptual' },
            { t: `$-${R}<x<${R}$`, why: `You solved $|x|<${R}$ and ignored the shift. The interval is centered at $${c}$, not $0$.`, err: 'algebra-slip' },
            { t: `$x<${c + R}$`, why: 'Only half the answer — absolute value bounds $x$ from **both** sides.', err: 'conceptual' },
            { t: `$${c - R}\\le x\\le ${c + R}$`, why: 'The inequality is strict, so the endpoints are excluded.', err: 'off-by-one' },
          ]),
        ],
        steps: [
          `$|x-${c}|<${R}$ says the distance from $x$ to $${c}$ is less than $${R}$.`,
          `Unwrap: $-${R}<x-${c}<${R}$.`,
          `Add $${c}$ throughout: $${c - R}<x<${c + R}$.`,
          `Same structure as a radius of convergence centered at $${c}$ with $R=${R}$.`,
        ],
        recall: '$|x-c|<R$ → the open interval $(c-R,\\,c+R)$.',
        viz: {
          kind: 'numline', min: c - R - 2, max: c + R + 2,
          spans: [{ from: c - R, to: c + R, label: `|x − ${c}| < ${R}`, color: 'var(--lime)' }],
          marks: [{ x: c, label: 'center', color: 'var(--amber)' }, { x: c - R, open: true, color: 'var(--lime)' }, { x: c + R, open: true, color: 'var(--lime)' }],
          cap: 'Hollow endpoints — the inequality is strict, exactly like the interior of an interval of convergence.',
        },
      };
    }
    const key = `$x<${c - R}$ or $x>${c + R}$`;
    return {
      prompt: `Solve $|x-${c}|>${R}$.`,
      choices: [
        { t: key, ok: true },
        ...choose(key, [
          { t: `$${c - R}<x<${c + R}$`, why: 'That is the **less-than** solution. Greater-than gives the two pieces **outside** the interval.', err: 'conceptual' },
          { t: `$x>${c + R}$`, why: 'Only one of the two pieces. Points far to the left are also more than $' + R + '$ away from $' + c + '$.', err: 'conceptual' },
          { t: `$x>${c - R}$`, why: 'Check a test point: $x=' + c + '$ satisfies this but has distance $0$ from the center, so it should fail.', err: 'algebra-slip' },
          { t: `$-${R}>x>${R}$`, why: 'That inequality is impossible as written, and it ignores the shift to center $' + c + '$.', err: 'algebra-slip' },
        ]),
      ],
      steps: [
        `$|x-${c}|>${R}$ means the distance from $x$ to $${c}$ **exceeds** $${R}$.`,
        `Split into two cases: $x-${c}>${R}$ or $x-${c}<-${R}$.`,
        `$x>${c + R}$ or $x<${c - R}$ — two rays, not an interval.`,
        `This is the divergence region of a power series: outside the radius, the series blows up.`,
      ],
      recall: 'Less-than → one interval. Greater-than → two rays. Test a point if you are unsure which.',
      viz: {
        kind: 'numline', min: c - R - 3, max: c + R + 3,
        spans: [
          { from: c - R - 3, to: c - R, label: 'diverges', color: 'var(--coral)' },
          { from: c + R, to: c + R + 3, label: 'diverges', color: 'var(--coral)' },
        ],
        marks: [{ x: c, label: 'center', color: 'var(--amber)' }, { x: c - R, open: true, color: 'var(--coral)' }, { x: c + R, open: true, color: 'var(--coral)' }],
        cap: 'The two outer rays — exactly where a power series fails to converge.',
      },
    };
  },
});

export const precalc = { unit: 'precalc', problems: P, generators: G };
