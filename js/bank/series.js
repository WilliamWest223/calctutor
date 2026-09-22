// ---------------------------------------------------------------
// bank/series.js — Unit 04: Sequences & Series
// The heart of MATH 142. Heavily weighted, heavily drilled.
// ---------------------------------------------------------------
import { frac, choose } from '../util.js';

const P = [];
const G = [];

// =================================================================
// STATIC
// =================================================================

P.push({
  id: 's-harmonic', topic: 'Divergence & Integral Tests', diff: 3,
  prompt: 'The terms of $\\displaystyle\\sum_{n=1}^{\\infty}\\frac{1}{n}$ tend to $0$. What can you conclude?',
  choices: [
    { t: 'Nothing from that fact alone — and in truth the series **diverges**', ok: true },
    { t: 'The series converges', why: 'This is the single most important misconception in the course. $a_n\\to0$ is **necessary** but not **sufficient**. The harmonic series is the standard counterexample: its terms shrink to zero, yet the partial sums grow without bound (like $\\ln n$).' },
    { t: 'The series converges to $0$', why: 'Two errors at once: the terms tending to $0$ does not force convergence, and even for a convergent series the sum is generally not $0$.' },
    { t: 'The Divergence Test proves it diverges', why: 'The Divergence Test only concludes something when $\\lim a_n \\ne 0$. When the limit **is** $0$, the test is explicitly inconclusive — you must use another test.' },
  ],
  steps: [
    'The Divergence Test is one-directional: if $\\lim a_n\\ne0$, the series diverges. If $\\lim a_n=0$, it says **nothing**.',
    'For $\\sum\\frac1n$, use the Integral Test instead: $\\int_1^\\infty\\frac{dx}{x}=\\lim_{t\\to\\infty}\\ln t = \\infty$.',
    'The integral diverges, so the series diverges.',
    'Partial sums grow like $\\ln n$ — slowly, but without any ceiling. Reaching a sum of $20$ takes about $2.7\\times10^{8}$ terms.',
  ],
  recall: '$a_n\\to0$ is the entry fee, not the prize. Every convergent series has it; not every series with it converges.',
  viz: {
    kind: 'series', a: n => 1 / n, N: 22, start: 1,
    termLabel: 'aₙ = 1/n', sumLabel: 'partial sums sₙ',
    cap: 'The blue stems (terms) collapse toward zero, yet the green partial-sum curve keeps climbing. Slow growth is still growth — there is no horizontal asymptote.',
  },
});

P.push({
  id: 's-geom-index', topic: 'Geometric & Telescoping', diff: 2,
  prompt: 'Evaluate $\\displaystyle\\sum_{n=1}^{\\infty}\\left(\\frac{2}{3}\\right)^{n}$.',
  choices: [
    { t: '$2$', ok: true },
    { t: '$3$', why: 'You used $\\frac{1}{1-r}=3$, which is the sum starting at $n=0$. Your series starts at $n=1$, so the $n=0$ term (which equals $1$) must be subtracted: $3-1=2$.' },
    { t: '$\\dfrac{2}{3}$', why: 'That is just the first term $a$. The sum of infinitely many positive terms must exceed the first one.' },
    { t: '$\\dfrac{3}{2}$', why: 'You computed $\\frac{1}{r}$ or inverted somewhere. The formula is $\\frac{a}{1-r}$ with $a$ the **first term actually present**.' },
  ],
  steps: [
    'Identify $r=\\frac23$ (so $|r|<1$, convergent) and the **first term** at $n=1$: $a=\\frac23$.',
    '$\\displaystyle\\sum_{n=1}^\\infty ar^{n-1}$ form: $S=\\dfrac{a}{1-r} = \\dfrac{2/3}{1-2/3}$',
    '$= \\dfrac{2/3}{1/3} = 2$.',
    'Cross-check: $\\sum_{n=0}^\\infty(2/3)^n = \\frac{1}{1/3}=3$, minus the $n=0$ term of $1$, gives $2$. ✓',
  ],
  recall: '$S=\\dfrac{\\text{first term present}}{1-r}$. Always look at where the index actually starts.',
  viz: {
    kind: 'series', a: n => Math.pow(2 / 3, n), N: 16, start: 1, limit: 2, limitLabel: 'S = 2',
    cap: 'The partial sums climb toward $2$, not $3$. The missing $1$ is exactly the $n=0$ term the index skipped.',
  },
});

P.push({
  id: 's-comparison-direction', topic: 'p-Series & Comparison', diff: 3,
  prompt: 'You want to show $\\displaystyle\\sum\\frac{1}{n^{2}+1}$ converges by direct comparison. Which inequality works?',
  choices: [
    { t: '$\\dfrac{1}{n^{2}+1}<\\dfrac{1}{n^{2}}$, and $\\sum\\frac{1}{n^{2}}$ converges', ok: true },
    { t: '$\\dfrac{1}{n^{2}+1}>\\dfrac{1}{n^{2}+n}$, and $\\sum\\frac{1}{n^{2}+n}$ converges', why: 'The inequality points the wrong way. Being **bigger** than a convergent series proves nothing — you could be bigger and still diverge.' },
    { t: '$\\dfrac{1}{n^{2}+1}>\\dfrac{1}{n^{3}}$, and $\\sum\\frac{1}{n^{3}}$ converges', why: 'Same direction problem. A useful comparison must trap your series **below** something convergent (or **above** something divergent).' },
    { t: '$\\dfrac{1}{n^{2}+1}<\\dfrac{1}{n}$, and $\\sum\\frac{1}{n}$ converges', why: 'The inequality is true, but $\\sum\\frac1n$ **diverges** — comparing to a divergent series from below tells you nothing.' },
  ],
  steps: [
    'Direct Comparison has exactly two useful patterns:',
    '**Smaller than convergent → converges.** **Bigger than divergent → diverges.** The other two combinations are useless.',
    'Here: $n^{2}+1>n^{2}$, so $\\frac{1}{n^{2}+1}<\\frac{1}{n^{2}}$.',
    '$\\sum\\frac{1}{n^{2}}$ is a convergent $p$-series ($p=2>1$), so our smaller series converges too.',
  ],
  recall: 'Squeezed **under** a convergent series → safe. Held **above** a divergent one → doomed. Anything else is no information.',
  viz: {
    kind: 'compare', a: n => 1 / (n * n + 1), b: n => 1 / (n * n), N: 12,
    aLabel: '1/(n²+1)', bLabel: '1/n²',
    cap: 'Every blue bar sits under its orange partner, and the orange total is finite. A finite ceiling forces the blue total to be finite too.',
  },
});

P.push({
  id: 's-alt-error', topic: 'Alternating Series & Error', diff: 2,
  prompt: 'For a convergent alternating series with decreasing terms, the error $|S-s_{n}|$ is at most:',
  choices: [
    { t: '$b_{n+1}$ — the first omitted term', ok: true },
    { t: '$b_{n}$ — the last included term', why: 'Off by one. You have already *used* $b_n$, so it is not part of the error. The remainder is bounded by the first term you left out.' },
    { t: '$\\sum_{k=n+1}^{\\infty}b_{k}$', why: 'That is a true upper bound but far weaker, and typically infinite-looking. The special power of the Alternating Series Estimation Theorem is that the *single* next term suffices.' },
    { t: '$\\dfrac{b_{n+1}}{2}$', why: 'No factor of $\\frac12$ appears. The bound is exactly $b_{n+1}$ (and it is sharp).' },
  ],
  steps: [
    'Alternating partial sums oscillate: $s_1>S>s_2<S<s_3\\dots$, closing in on $S$ from both sides.',
    'The true sum is always **trapped between** consecutive partial sums.',
    'So the distance from $s_n$ to $S$ is smaller than the jump from $s_n$ to $s_{n+1}$, which is exactly $b_{n+1}$.',
    '$|S-s_n|\\le b_{n+1}$ — this only applies to **alternating** series meeting the AST conditions.',
  ],
  recall: 'Error ≤ first term you did **not** use. To make the error $<\\varepsilon$, solve $b_{n+1}<\\varepsilon$.',
  viz: {
    kind: 'series', a: n => Math.pow(-1, n + 1) / n, N: 14, start: 1,
    limit: Math.LN2, limitLabel: 'S = ln 2',
    termLabel: 'terms (−1)ⁿ⁺¹/n', sumLabel: 'partial sums',
    cap: 'Partial sums bounce over and under $\\ln 2$, each time closer. The gap after $s_n$ is smaller than the next jump — that jump is $b_{n+1}$.',
  },
});

P.push({
  id: 's-ratio-inconclusive', topic: 'Ratio & Root Tests', diff: 3,
  prompt: 'Applying the Ratio Test to $\\displaystyle\\sum\\frac{1}{n^{2}}$ gives $L=1$. What does that tell you?',
  choices: [
    { t: 'Nothing — the test is inconclusive; use the $p$-series rule instead', ok: true },
    { t: 'The series diverges', why: '$L=1$ is the one case where the Ratio Test refuses to answer. It is not a verdict of divergence. In fact $\\sum\\frac1{n^2}$ converges (it equals $\\frac{\\pi^2}{6}$).' },
    { t: 'The series converges', why: 'Right conclusion, wrong justification — and the reasoning would fail elsewhere. $\\sum\\frac1n$ also gives $L=1$ and it **diverges**. The test genuinely cannot distinguish them.' },
    { t: 'The series converges conditionally', why: 'All terms are positive, so there is no conditional convergence to speak of. And $L=1$ still gives no information.' },
  ],
  steps: [
    '$\\left|\\dfrac{a_{n+1}}{a_n}\\right| = \\dfrac{n^{2}}{(n+1)^{2}}\\to 1$.',
    'Ratio Test verdicts: $L<1$ converges (absolutely), $L>1$ diverges, $L=1$ **inconclusive**.',
    'Any series whose terms are rational functions of $n$ gives $L=1$ — the test is blind to all of them.',
    'Use the $p$-series rule: $p=2>1$, so $\\sum\\frac{1}{n^{2}}$ converges.',
  ],
  recall: 'The Ratio Test is for factorials, $n$th powers, and $x^n$. For rational functions of $n$ it always returns $L=1$ — do not even start it.',
});

P.push({
  id: 's-abs-vs-cond', topic: 'Ratio & Root Tests', diff: 3,
  prompt: 'The series $\\displaystyle\\sum_{n=1}^{\\infty}\\frac{(-1)^{n}}{\\sqrt{n}}$ is:',
  choices: [
    { t: 'Conditionally convergent', ok: true },
    { t: 'Absolutely convergent', why: 'Check the absolute series: $\\sum\\frac{1}{\\sqrt n}=\\sum n^{-1/2}$ is a $p$-series with $p=\\frac12\\le1$, which **diverges**. So convergence here depends on the alternating signs.' },
    { t: 'Divergent', why: 'The Alternating Series Test applies: $\\frac{1}{\\sqrt n}$ is positive, decreasing, and tends to $0$. So the series does converge.' },
    { t: 'Divergent by the Divergence Test', why: '$\\frac{(-1)^n}{\\sqrt n}\\to0$, so the Divergence Test is inconclusive and cannot be used here.' },
  ],
  steps: [
    '**Step 1 — test absolute convergence:** $\\sum\\left|\\frac{(-1)^n}{\\sqrt n}\\right| = \\sum\\frac{1}{n^{1/2}}$, a $p$-series with $p=\\frac12<1$: **diverges**.',
    'So it is not absolutely convergent.',
    '**Step 2 — test the alternating series itself:** $b_n=\\frac{1}{\\sqrt n}$ is decreasing and $\\to0$, so the AST gives convergence.',
    'Converges but not absolutely = **conditionally convergent**.',
  ],
  recall: 'Always test $\\sum|a_n|$ **first**. Absolute convergence is stronger and closes the question immediately.',
  viz: {
    kind: 'series', a: n => Math.pow(-1, n) / Math.sqrt(n), N: 20, start: 1,
    termLabel: 'signed terms', sumLabel: 'partial sums',
    cap: 'The partial sums settle down thanks to cancellation. Strip the signs away and the same magnitudes would add up to infinity.',
  },
});

P.push({
  id: 's-endpoints', topic: 'Power Series & Radius', diff: 3,
  prompt: 'You find that a power series has radius of convergence $R=2$ centered at $x=3$. What still needs checking?',
  choices: [
    { t: 'The endpoints $x=1$ and $x=5$, one at a time', ok: true },
    { t: 'Nothing — the interval is $(1,5)$ and you are done', why: 'The Ratio Test is silent exactly at $|x-c|=R$, where it returns $L=1$. Endpoint behavior can go either way, and each endpoint can behave **differently** from the other.' },
    { t: 'The center $x=3$', why: 'A power series always converges at its center — every term after the first is $0$. There is nothing to check there.' },
    { t: 'Whether $R$ might actually be negative', why: 'A radius is a distance; it is $\\ge0$ by construction (possibly $0$ or $\\infty$).' },
  ],
  steps: [
    'The Ratio Test gives strict convergence for $|x-3|<2$ and divergence for $|x-3|>2$.',
    'At $|x-3|=2$ exactly, the ratio limit is $1$ — inconclusive.',
    'Substitute $x=5$ into the original series and test the resulting **numerical** series.',
    'Substitute $x=1$ and test separately. The interval is then one of $(1,5)$, $[1,5)$, $(1,5]$, or $[1,5]$.',
  ],
  recall: 'Radius comes from the Ratio Test. The interval requires two extra numerical-series tests, one per endpoint.',
  viz: {
    kind: 'interval', center: 3, R: 2, leftClosed: true, rightClosed: false,
    leftLabel: 'x = 1 (test!)', rightLabel: 'x = 5 (test!)',
    note: 'R = 2 — the interior is guaranteed, the two ends are not',
    cap: 'The Ratio Test settles everything strictly inside the band and nothing at the two circled ends.',
  },
});

P.push({
  id: 's-maclaurin-known', topic: 'Taylor & Maclaurin Series', diff: 2,
  prompt: 'What is the Maclaurin series for $e^{x^{2}}$?',
  choices: [
    { t: '$\\displaystyle\\sum_{n=0}^{\\infty}\\frac{x^{2n}}{n!}$', ok: true },
    { t: '$\\displaystyle\\sum_{n=0}^{\\infty}\\frac{x^{2n}}{(2n)!}$', why: 'You substituted into the factorial as well. Only the **variable** gets replaced: in $e^{u}=\\sum\\frac{u^{n}}{n!}$ put $u=x^{2}$, leaving $n!$ untouched.' },
    { t: '$\\displaystyle\\sum_{n=0}^{\\infty}\\frac{x^{n^{2}}}{n!}$', why: 'You squared the exponent $n$ rather than substituting $x^{2}$ for $x$. $(x^{2})^{n}=x^{2n}$, not $x^{n^{2}}$.' },
    { t: '$\\left(\\displaystyle\\sum_{n=0}^{\\infty}\\frac{x^{n}}{n!}\\right)^{2}$', why: 'That is $(e^{x})^{2}=e^{2x}$, a different function. Squaring the series is not the same as squaring the input.' },
  ],
  steps: [
    'Start from the known series $e^{u}=\\displaystyle\\sum_{n=0}^{\\infty}\\frac{u^{n}}{n!}$, valid for all $u$.',
    'Substitute $u=x^{2}$ — a legal substitution anywhere the original converges.',
    '$e^{x^{2}}=\\displaystyle\\sum_{n=0}^{\\infty}\\frac{(x^{2})^{n}}{n!}=\\sum_{n=0}^{\\infty}\\frac{x^{2n}}{n!}$',
    'First few terms: $1+x^{2}+\\frac{x^{4}}{2}+\\frac{x^{6}}{6}+\\cdots$',
  ],
  recall: 'Substitution into a known series beats computing derivatives. $\\frac{d^{n}}{dx^{n}}e^{x^{2}}$ at $0$ is brutal by hand.',
  viz: {
    kind: 'taylor', f: x => Math.exp(x * x), c: 0, xmin: -1.6, xmax: 1.6, ymin: 0, ymax: 8,
    fLabel: 'e^(x²)',
    polys: [
      { n: 2, label: '1 + x²', p: x => 1 + x * x },
      { n: 4, label: '+ x⁴/2', p: x => 1 + x * x + x ** 4 / 2 },
      { n: 6, label: '+ x⁶/6', p: x => 1 + x * x + x ** 4 / 2 + x ** 6 / 6 },
    ],
    cap: 'Each extra term hugs the true curve over a wider stretch. Near the center even two terms are excellent.',
  },
});

P.push({
  id: 's-integral-test-cond', topic: 'Divergence & Integral Tests', diff: 3,
  prompt: 'The Integral Test requires $f$ to be which three things on $[N,\\infty)$?',
  choices: [
    { t: 'Continuous, positive, and decreasing', ok: true },
    { t: 'Continuous, positive, and increasing', why: 'Increasing is impossible for a convergent series — the terms would not even tend to $0$. The comparison of the series with the integral relies on the rectangles being nested, which needs **decreasing**.' },
    { t: 'Differentiable, bounded, and positive', why: 'Differentiability is not required (continuity is enough), and boundedness is not the relevant condition — monotone decrease is.' },
    { t: 'Continuous and positive only', why: 'Without monotonicity the rectangle-vs-area comparison collapses. A wiggling $f$ can have its integral and its series disagree.' },
  ],
  steps: [
    'The test compares $\\sum_{n=N}^\\infty f(n)$ with $\\int_N^\\infty f(x)\\,dx$ using rectangles.',
    '**Positive** keeps everything comparable (no cancellation), and makes partial sums monotone.',
    '**Decreasing** guarantees each rectangle sits under (or over) the curve consistently, so the two-sided bound holds.',
    '**Continuous** makes the integral well-defined. Then: series and integral converge or diverge **together**.',
  ],
  recall: 'Check all three conditions explicitly on exams — graders take points for skipping them. Verify "decreasing" with $f\'(x)<0$.',
});

P.push({
  id: 's-taylor-remainder', topic: 'Taylor Polynomials & Error', diff: 3,
  prompt: 'The Taylor remainder bound for approximating $f$ by $T_{n}$ near $a$ is:',
  choices: [
    { t: '$|R_{n}(x)|\\le\\dfrac{M|x-a|^{n+1}}{(n+1)!}$ where $M\\ge\\left|f^{(n+1)}\\right|$', ok: true },
    { t: '$|R_{n}(x)|\\le\\dfrac{M|x-a|^{n}}{n!}$', why: 'Off by one everywhere. The error of an $n$th-degree polynomial is governed by the **next** derivative, $f^{(n+1)}$, and carries $(x-a)^{n+1}$ over $(n+1)!$.' },
    { t: '$|R_{n}(x)|\\le M|x-a|^{n+1}$', why: 'The factorial is missing, making the bound uselessly weak. $(n+1)!$ is what makes Taylor error shrink so fast.' },
    { t: '$|R_{n}(x)|\\le\\dfrac{\\left|f^{(n+1)}(a)\\right||x-a|^{n+1}}{(n+1)!}$', why: 'Subtle but important: you need $M$ to be a **bound on the whole interval** between $a$ and $x$, not just the value at $a$. The relevant derivative is evaluated at some unknown point $c$ in between.' },
  ],
  steps: [
    'Taylor\'s Theorem: $f(x)=T_n(x)+R_n(x)$ with $R_n(x)=\\dfrac{f^{(n+1)}(c)}{(n+1)!}(x-a)^{n+1}$ for some $c$ between $a$ and $x$.',
    'You do not know $c$, so bound the derivative: find $M$ with $\\left|f^{(n+1)}(t)\\right|\\le M$ for all $t$ between $a$ and $x$.',
    '$|R_n(x)|\\le\\dfrac{M|x-a|^{n+1}}{(n+1)!}$',
    'Two things shrink the error: being close to the center, and the factorial growth in the denominator.',
  ],
  recall: 'Degree $n$ → look at derivative $n+1$. The bound $M$ must hold across the **whole interval**, not just at the center.',
  viz: {
    kind: 'taylor', f: x => Math.sin(x), c: 0, xmin: -6.5, xmax: 6.5, ymin: -2.2, ymax: 2.2,
    fLabel: 'sin x',
    polys: [
      { n: 1, label: 'T₁ = x', p: x => x },
      { n: 3, label: 'T₃', p: x => x - x ** 3 / 6 },
      { n: 5, label: 'T₅', p: x => x - x ** 3 / 6 + x ** 5 / 120 },
    ],
    cap: 'Error is tiny near the center and grows with $|x-a|$ — exactly what the $|x-a|^{n+1}$ factor predicts. Higher degree pushes the breakaway point further out.',
  },
});

P.push({
  id: 's-series-limit', topic: 'Applications of Series', diff: 3,
  prompt: 'Use a Maclaurin series to evaluate $\\displaystyle\\lim_{x\\to0}\\frac{\\sin x - x}{x^{3}}$.',
  choices: [
    { t: '$-\\dfrac{1}{6}$', ok: true },
    { t: '$0$', why: 'You concluded that $\\sin x - x\\to0$ faster than $x^{3}$. It does not — they vanish at exactly the same rate. The series shows $\\sin x - x = -\\frac{x^{3}}{6}+\\cdots$, matching $x^{3}$ term for term.' },
    { t: '$\\dfrac{1}{6}$', why: 'Sign. The $x^{3}$ term of $\\sin x$ is $-\\frac{x^{3}}{3!}$, so after subtracting $x$ the leading term is **negative**.' },
    { t: '$-\\dfrac{1}{3}$', why: 'You used $3$ instead of $3!=6$. The Maclaurin coefficients of sine have factorials in the denominator.' },
  ],
  steps: [
    '$\\sin x = x-\\dfrac{x^{3}}{3!}+\\dfrac{x^{5}}{5!}-\\cdots$',
    'Subtract $x$: $\\sin x - x = -\\dfrac{x^{3}}{6}+\\dfrac{x^{5}}{120}-\\cdots$',
    'Divide by $x^{3}$: $\\dfrac{\\sin x-x}{x^{3}} = -\\dfrac{1}{6}+\\dfrac{x^{2}}{120}-\\cdots$',
    'Let $x\\to0$: every remaining term dies and the limit is $-\\dfrac16$. (L\'Hôpital three times gives the same, with much more work.)',
  ],
  recall: 'For $0/0$ limits of transcendental functions, series are usually faster than repeated L\'Hôpital — and less error-prone.',
});

P.push({
  id: 's-seq-vs-series', topic: 'Sequences', diff: 2,
  prompt: 'The sequence $a_{n}=\\dfrac{3n^{2}+1}{5n^{2}-n}$ converges to $\\frac35$. What about $\\sum a_{n}$?',
  choices: [
    { t: 'It diverges, by the Divergence Test', ok: true },
    { t: 'It converges to $\\frac35$', why: 'You confused the limit of the **sequence** with the sum of the **series**. Those are entirely different objects; the sequence limit is only ever the size of the individual terms.' },
    { t: 'It converges to some other value', why: 'It cannot converge at all. Adding infinitely many terms each close to $0.6$ produces unbounded partial sums.' },
    { t: 'Cannot be determined', why: 'It can, immediately: $\\lim a_n=\\frac35\\ne0$, so the Divergence Test settles it.' },
  ],
  steps: [
    'Sequence limit: divide by $n^{2}$ → $\\dfrac{3+1/n^{2}}{5-1/n}\\to\\dfrac35$.',
    'Divergence Test: if $\\lim a_n \\ne 0$, then $\\sum a_n$ **diverges**. Here $\\frac35\\ne0$.',
    'Intuitively: after a while every term is about $0.6$, so the partial sums grow by about $0.6$ each step — forever.',
    '$\\sum a_n$ diverges.',
  ],
  recall: 'Sequence $\\{a_n\\}$ = the terms. Series $\\sum a_n$ = their running total. A sequence converging to a nonzero number **guarantees** the series diverges.',
  viz: {
    kind: 'series', a: n => (3 * n * n + 1) / (5 * n * n - n), N: 18, start: 1,
    limit: 0.6, limitLabel: 'terms → 0.6',
    cap: 'The terms flatten out at $0.6$ (dashed). The partial sums then climb like a straight line of slope $0.6$ — no ceiling anywhere.',
  },
});

// =================================================================
// GENERATORS
// =================================================================

G.push({
  id: 'g-s-seqlim', topic: 'Sequences', diff: 1,
  make(r) {
    const kind = r.pick(['rat', 'geom', 'root', 'expo']);
    if (kind === 'rat') {
      const p = r.int(2, 7), q = r.int(2, 7);
      // d !== p, else the "lower-order coefficient" distractor equals the answer
      let d = r.int(1, 5);
      while (d === p) d = r.int(1, 5);
      const key = `$${frac(p, q)}$`;
      return {
        prompt: `Find $\\displaystyle\\lim_{n\\to\\infty}\\frac{${p}n^{2}+${d}n}{${q}n^{2}+1}$.`,
        choices: [
          { t: key, ok: true },
          ...choose(key, [
            { t: '$\\infty$', why: 'Numerator and denominator have the **same** degree, so they grow at the same rate and the ratio settles at the ratio of leading coefficients.' },
            { t: '$0$', why: 'That happens when the denominator has the higher degree. Here both are degree $2$.' },
            { t: `$${frac(d, q)}$`, why: 'You used the lower-order coefficient. Only the **leading** terms matter as $n\\to\\infty$.' },
            { t: `$${frac(q, p)}$`, why: 'Inverted — the numerator\'s leading coefficient belongs on top.' },
            { t: '$1$', why: 'Both parts grow without bound, but $\\frac{\\infty}{\\infty}$ is indeterminate; it does not default to $1$.' },
          ]),
        ],
        steps: [
          `Divide numerator and denominator by $n^{2}$ (the highest power present):`,
          `$\\dfrac{${p}+${d}/n}{${q}+1/n^{2}}$`,
          `As $n\\to\\infty$, $\\frac{${d}}{n}\\to0$ and $\\frac{1}{n^{2}}\\to0$.`,
          `Limit $=\\dfrac{${p}}{${q}} = ${frac(p, q)}$`,
        ],
        recall: 'Same degree → ratio of leading coefficients. Higher on top → $\\infty$. Higher on bottom → $0$.',
      };
    }
    if (kind === 'geom') {
      const num = r.int(1, 4), den = num + r.int(1, 4);
      return {
        prompt: `Find $\\displaystyle\\lim_{n\\to\\infty}\\left(\\frac{${num}}{${den}}\\right)^{n}$.`,
        choices: [
          { t: '$0$', ok: true },
          { t: `$${frac(num, den)}$`, why: 'That is the value at $n=1$. Raising a number of magnitude less than $1$ to higher powers drives it toward $0$.' },
          { t: '$1$', why: '$r^{n}\\to1$ only when $r=1$. Here $r<1$ strictly.' },
          { t: '$\\infty$', why: 'That requires $|r|>1$. A proper fraction shrinks under repeated multiplication.' },
        ],
        steps: [
          `$r=\\frac{${num}}{${den}}$ and $|r|<1$.`,
          `$r^{n}\\to0$ whenever $|r|<1$.`,
          `Limit $=0$.`,
        ],
        recall: '$r^{n}$: $\\to0$ if $|r|<1$; $\\to1$ if $r=1$; diverges if $|r|>1$ or $r=-1$.',
      };
    }
    if (kind === 'root') {
      const c = r.int(2, 9);
      return {
        prompt: `Find $\\displaystyle\\lim_{n\\to\\infty}\\sqrt[n]{${c}}$.`,
        choices: [
          { t: '$1$', ok: true },
          { t: `$${c}$`, why: 'The root gets deeper as $n$ grows, pulling any fixed positive constant down toward $1$.' },
          { t: '$0$', why: `$${c}^{1/n}$ stays above $1$ for every $n$ (since $${c}>1$), so it cannot reach $0$.` },
          { t: '$\\infty$', why: 'Taking roots shrinks numbers greater than $1$; it never grows them.' },
        ],
        steps: [
          `Write $${c}^{1/n} = e^{\\frac{\\ln ${c}}{n}}$.`,
          `As $n\\to\\infty$, $\\dfrac{\\ln ${c}}{n}\\to0$.`,
          `So the limit is $e^{0}=1$.`,
        ],
        recall: '$\\sqrt[n]{c}\\to1$ for any constant $c>0$, and $\\sqrt[n]{n}\\to1$ as well.',
      };
    }
    const k = r.int(2, 5);
    return {
      prompt: `Find $\\displaystyle\\lim_{n\\to\\infty}\\frac{n^{${k}}}{e^{n}}$.`,
      choices: [
        { t: '$0$', ok: true },
        { t: '$\\infty$', why: `Exponentials outgrow every fixed power. Applying L'Hôpital $${k}$ times leaves $\\frac{${k}!}{e^{n}}\\to0$.` },
        { t: '$1$', why: '$\\frac\\infty\\infty$ is indeterminate — it does not default to $1$.' },
        { t: `$${k}$`, why: 'The exponent does not survive as the answer.' },
      ],
      steps: [
        `Form is $\\frac{\\infty}{\\infty}$; treat $n$ as continuous and use L'Hôpital.`,
        `Each application lowers the power by one and leaves $e^{n}$ unchanged.`,
        `After $${k}$ steps: $\\dfrac{${k}!}{e^{n}}\\to0$.`,
      ],
      recall: 'Growth ranking: $\\ln n \\ll n^{p} \\ll e^{n} \\ll n!\\ll n^{n}$.',
    };
  },
});

G.push({
  id: 'g-s-geom', topic: 'Geometric & Telescoping', diff: 2,
  make(r) {
    const num = r.int(1, 4);
    const den = num + r.int(1, 5);
    const a = r.int(1, 6);
    const start = r.pick([0, 1]);
    const firstTerm = start === 0 ? a : a * num / den;
    const S = firstTerm / (1 - num / den);
    const Snum = start === 0 ? a * den : a * num;
    const Sden = den - num;
    const wrongS = a * den / (den - num);      // as if it started at 0
    const rTex = `\\left(\\frac{${num}}{${den}}\\right)`;
    const key = `$${frac(Snum, Sden)}$`;
    return {
      prompt: `Evaluate $\\displaystyle\\sum_{n=${start}}^{\\infty}${a === 1 ? '' : a}${rTex}^{n}$.`,
      choices: [
        { t: key, ok: true },
        ...choose(key, [
          start === 1
            ? { t: `$${frac(a * den, Sden)}$`, why: `That is the sum starting from $n=0$. Your series starts at $n=1$, so subtract the $n=0$ term, which is $${a}$.` }
            : { t: `$${frac(a * num, Sden)}$`, why: `That is the sum starting from $n=1$ — you dropped the $n=0$ term, which equals $${a}$.` },
          { t: `$${frac(a * (den - num), den)}$`, why: 'You computed $a(1-r)$ instead of $\\frac{a}{1-r}$. The formula divides.' },
          { t: `$${frac(a * den, num)}$`, why: `You used $\\frac{a}{r}$ instead of $\\frac{a}{1-r}$. Subtract $r$ from $1$ first.` },
          { t: `$${frac(a * den + a * num, Sden)}$`, why: 'You added an extra copy of the first term. Count carefully which index the sum actually starts at.' },
          { t: `$${frac(a, Sden)}$`, why: `The numerator is the **first term of the series**, not the bare coefficient $${a}$.` },
        ]),
      ],
      steps: [
        `Ratio $r=\\frac{${num}}{${den}}$, and $|r|<1$, so the series converges.`,
        `First term present (at $n=${start}$): $a=${start === 0 ? a : frac(a * num, den)}$.`,
        `$S=\\dfrac{a}{1-r} = \\dfrac{${start === 0 ? a : frac(a * num, den)}}{1-\\frac{${num}}{${den}}} = \\dfrac{${start === 0 ? a : frac(a * num, den)}}{\\frac{${den - num}}{${den}}}$`,
        `$= ${frac(Snum, Sden)}$`,
      ],
      recall: '$S=\\frac{\\text{first term}}{1-r}$ — and "first term" means the one at the starting index, not the coefficient out front.',
      viz: {
        kind: 'series', a: n => a * Math.pow(num / den, n), N: 15, start,
        limit: Snum / Sden, limitLabel: `S = ${Math.round((Snum / Sden) * 1000) / 1000}`,
        cap: 'The partial sums approach the dashed line. Starting the index one step later removes exactly the first stem.',
      },
    };
  },
});

G.push({
  id: 'g-s-pseries', topic: 'p-Series & Comparison', diff: 1,
  make(r) {
    const opts = [
      { tex: '\\dfrac{1}{n^{3}}', p: 3 }, { tex: '\\dfrac{1}{\\sqrt{n}}', p: 0.5 },
      { tex: '\\dfrac{1}{n}', p: 1 }, { tex: '\\dfrac{1}{n^{2}}', p: 2 },
      { tex: '\\dfrac{1}{n^{4/3}}', p: 4 / 3 }, { tex: '\\dfrac{1}{n^{2/3}}', p: 2 / 3 },
      { tex: '\\dfrac{1}{\\sqrt[3]{n}}', p: 1 / 3 },
    ];
    const o = r.pick(opts);
    const conv = o.p > 1;
    const ptex = o.p === 0.5 ? '\\tfrac12' : o.p === 4 / 3 ? '\\tfrac43' : o.p === 2 / 3 ? '\\tfrac23' : o.p === 1 / 3 ? '\\tfrac13' : String(o.p);
    return {
      prompt: `Does $\\displaystyle\\sum_{n=1}^{\\infty}${o.tex}$ converge or diverge?`,
      choices: [
        { t: conv ? 'Converges' : 'Diverges', ok: true },
        { t: conv ? 'Diverges' : 'Converges', why: conv
          ? `Here $p=${ptex}>1$, so it converges. You may have reversed the rule — remember $\\sum\\frac{1}{n^{2}}$ converges and $\\sum\\frac1n$ does not.`
          : `Here $p=${ptex}\\le1$, so it diverges. The terms shrink, but not fast enough. $p$ must be **strictly greater** than $1$.` },
        { t: 'Converges to $0$', why: 'The **terms** tend to $0$; the **sum** never does (all terms are positive). Do not confuse the two.' },
        { t: 'The Divergence Test decides it', why: 'The terms tend to $0$ here, so the Divergence Test is inconclusive. The $p$-series rule is what settles it.' },
      ],
      steps: [
        `Write it as $\\sum \\frac{1}{n^{p}}$ with $p=${ptex}$.`,
        `$p$-series rule: converges $\\iff p>1$.`,
        `Since $p=${ptex}${conv ? '>' : '\\le'}1$, the series **${conv ? 'converges' : 'diverges'}**.`,
        `(This follows from the Integral Test: $\\int_1^\\infty x^{-p}dx$ is finite exactly when $p>1$.)`,
      ],
      recall: '$p$-series: $p>1$ converges, $p\\le1$ diverges. $p=1$ (harmonic) diverges — memorize that boundary case.',
      viz: {
        kind: 'series', a: n => 1 / Math.pow(n, o.p), N: 20, start: 1,
        cap: conv
          ? 'The partial sums level off — the tail contributes a finite amount.'
          : 'The partial sums keep rising. Slowly for $p$ near $1$, but without any ceiling.',
      },
    };
  },
});

G.push({
  id: 'g-s-divtest', topic: 'Divergence & Integral Tests', diff: 2,
  make(r) {
    const kind = r.pick(['nonzero', 'zero']);
    if (kind === 'nonzero') {
      const p = r.int(2, 6), q = r.int(2, 6);
      return {
        prompt: `What does the Divergence Test say about $\\displaystyle\\sum_{n=1}^{\\infty}\\frac{${p}n+1}{${q}n+3}$?`,
        choices: [
          { t: 'Diverges', ok: true },
          { t: 'Converges', why: `The terms tend to $\\frac{${p}}{${q}}\\ne0$. Adding infinitely many terms of roughly that size makes the partial sums grow without bound.` },
          { t: 'Inconclusive', why: `Inconclusive only happens when $\\lim a_n=0$. Here the limit is $\\frac{${p}}{${q}}\\ne0$, so the test gives a definite verdict.` },
          { t: `Converges to $${frac(p, q)}$`, why: 'That value is the limit of the **terms**, not the sum of the series. The series has no finite sum at all.' },
        ],
        steps: [
          `$\\displaystyle\\lim_{n\\to\\infty}\\frac{${p}n+1}{${q}n+3} = \\frac{${p}}{${q}} \\ne 0$`,
          `Divergence Test: if $\\lim a_n\\ne0$ then $\\sum a_n$ diverges.`,
          `So the series **diverges**.`,
        ],
        recall: 'Check $\\lim a_n$ **first**, always. It is the cheapest test and it ends the problem when the limit is nonzero.',
        viz: {
          kind: 'series', a: n => (p * n + 1) / (q * n + 3), N: 16, start: 1,
          limit: p / q, limitLabel: `terms → ${Math.round((p / q) * 1000) / 1000}`,
          cap: 'Terms flatten at a nonzero height, so each new term adds about that much. The running total marches off linearly.',
        },
      };
    }
    const o = r.pick([
      { tex: '\\dfrac{1}{n^{2}+1}', v: 'converges (by comparison with $\\sum\\frac1{n^2}$)' },
      { tex: '\\dfrac{1}{\\ln(n+1)}', v: 'diverges (terms exceed $\\frac1n$ eventually)' },
      { tex: '\\dfrac{(-1)^{n}}{n}', v: 'converges conditionally (Alternating Series Test)' },
    ]);
    return {
      prompt: `What does the Divergence Test conclude about $\\displaystyle\\sum_{n=1}^{\\infty}${o.tex}$?`,
      choices: [
        { t: 'Nothing — the test is inconclusive', ok: true },
        { t: 'It converges', why: `The terms do tend to $0$, but the Divergence Test **never** proves convergence. It can only prove divergence. (This particular series happens to ${o.v}, but that requires a different test.)` },
        { t: 'It diverges', why: 'The Divergence Test concludes divergence only when $\\lim a_n\\ne0$. Here the limit is $0$, so it says nothing.' },
        { t: 'It converges absolutely', why: 'The Divergence Test cannot establish any kind of convergence — that is not what it is for.' },
      ],
      steps: [
        `$\\displaystyle\\lim_{n\\to\\infty}${o.tex} = 0$.`,
        `The Divergence Test only fires when the limit is **nonzero**.`,
        `Limit $=0$ → the test is inconclusive. Move on to a different test.`,
        `(For the record, this series ${o.v}.)`,
      ],
      recall: 'The Divergence Test is a one-way street: it can only ever say "diverges". It never says "converges".',
    };
  },
});

G.push({
  id: 'g-s-ratio', topic: 'Ratio & Root Tests', diff: 2,
  make(r) {
    const kind = r.pick(['fact', 'pow', 'ratfn']);
    if (kind === 'fact') {
      const b = r.int(2, 5);
      return {
        prompt: `Apply the Ratio Test to $\\displaystyle\\sum_{n=1}^{\\infty}\\frac{${b}^{n}}{n!}$.`,
        choices: [
          { t: '$L=0$, so it converges', ok: true },
          { t: `$L=${b}$, so it diverges`, why: `You handled $${b}^{n}$ but not the factorial. $\\frac{n!}{(n+1)!}=\\frac{1}{n+1}\\to0$, which crushes the constant $${b}$ to zero.` },
          { t: '$L=1$, inconclusive', why: 'Factorials never give $L=1$. They dominate everything, driving the ratio to $0$ (or $\\infty$ if the factorial is on top).' },
          { t: '$L=\\infty$, so it diverges', why: 'The factorial is in the **denominator**, so it makes the ratio small, not large.' },
        ],
        steps: [
          `$\\left|\\dfrac{a_{n+1}}{a_n}\\right| = \\dfrac{${b}^{n+1}}{(n+1)!}\\cdot\\dfrac{n!}{${b}^{n}}$`,
          `$= ${b}\\cdot\\dfrac{n!}{(n+1)!} = \\dfrac{${b}}{n+1}$`,
          `$L=\\displaystyle\\lim_{n\\to\\infty}\\frac{${b}}{n+1} = 0 < 1$`,
          `$L<1$ ⟹ converges absolutely.`,
        ],
        recall: '$\\frac{n!}{(n+1)!}=\\frac{1}{n+1}$. Expand factorials by one step and cancel — never try to evaluate them.',
        viz: {
          kind: 'series', a: n => Math.pow(b, n) / factorial(n), N: 16, start: 1,
          cap: 'The terms spike early (while $b^{n}$ leads) and then collapse once $n!$ takes over. That collapse is why $L=0$.',
        },
      };
    }
    if (kind === 'pow') {
      const b = r.int(2, 4), c = b + r.int(1, 3);
      return {
        prompt: `Apply the Ratio Test to $\\displaystyle\\sum_{n=1}^{\\infty}\\frac{${b}^{n}}{${c}^{n}}$.`,
        choices: [
          { t: `$L=${frac(b, c)}$, so it converges`, ok: true },
          { t: `$L=${frac(c, b)}$, so it diverges`, why: 'Ratio inverted. $\\frac{a_{n+1}}{a_n}$ puts the **new** term on top.' },
          { t: '$L=1$, inconclusive', why: 'Constants to the $n$th power give a clean ratio; $L=1$ would require the bases to be equal.' },
          { t: '$L=0$, so it converges', why: `Right verdict, wrong value. There is no factorial here, so the ratio settles at the constant $${frac(b, c)}$, not $0$.` },
        ],
        steps: [
          `$\\left|\\dfrac{a_{n+1}}{a_n}\\right| = \\dfrac{${b}^{n+1}/${c}^{n+1}}{${b}^{n}/${c}^{n}} = \\dfrac{${b}}{${c}}$ for every $n$.`,
          `$L=${frac(b, c)}<1$, so the series converges absolutely.`,
          `(It is geometric with $r=${frac(b, c)}$ — the Ratio Test just confirms what you already know.)`,
        ],
        recall: 'For a geometric series the Ratio Test returns $r$ exactly. Consistent, and a good sanity check.',
      };
    }
    const p = r.int(2, 4);
    return {
      prompt: `Apply the Ratio Test to $\\displaystyle\\sum_{n=1}^{\\infty}\\frac{1}{n^{${p}}}$.`,
      choices: [
        { t: '$L=1$, so the test is inconclusive', ok: true },
        { t: '$L=1$, so the series diverges', why: '$L=1$ is a **refusal to answer**, not a verdict of divergence. This series actually converges.' },
        { t: '$L=0$, so it converges', why: `$\\frac{n^{${p}}}{(n+1)^{${p}}}\\to1$, not $0$. Powers of $n$ approach a ratio of $1$; only factorials or $n$th powers drive it to $0$.` },
        { t: `$L=${p}$, so it diverges`, why: 'The exponent does not become the limit. Compute $\\lim\\left(\\frac{n}{n+1}\\right)^{p}=1$.' },
      ],
      steps: [
        `$\\left|\\dfrac{a_{n+1}}{a_n}\\right| = \\dfrac{n^{${p}}}{(n+1)^{${p}}} = \\left(\\dfrac{n}{n+1}\\right)^{${p}}$`,
        `$\\to 1^{${p}} = 1$`,
        `$L=1$: the Ratio Test is **inconclusive**.`,
        `Use the $p$-series rule instead: $p=${p}>1$, so it converges.`,
      ],
      recall: 'Rational functions of $n$ always give $L=1$. Do not waste exam time running the Ratio Test on them.',
    };
  },
});

G.push({
  id: 'g-s-radius', topic: 'Power Series & Radius', diff: 3,
  make(r) {
    const c = r.nz(1, 4), a = r.int(2, 5);
    const kind = r.pick(['overn', 'oversq', 'plain', 'fact']);
    const cs = c > 0 ? `x-${c}` : `x+${-c}`;
    if (kind === 'fact') {
      return {
        prompt: `Find the radius of convergence of $\\displaystyle\\sum_{n=0}^{\\infty}\\frac{(${cs})^{n}}{n!}$.`,
        choices: [
          { t: '$R=\\infty$', ok: true },
          { t: `$R=${a}$`, why: 'There is no base to the $n$th power here — nothing bounds $x$. The factorial beats every fixed value of $|x-c|$.' },
          { t: '$R=0$', why: 'That happens when the factorial is in the **numerator** (like $\\sum n!x^{n}$). In the denominator it has the opposite effect.' },
          { t: '$R=1$', why: 'The default guess. Run the Ratio Test: $\\frac{|x-c|}{n+1}\\to0$ for **every** $x$.' },
        ],
        steps: [
          `$\\left|\\dfrac{a_{n+1}}{a_n}\\right| = \\dfrac{|${cs}|^{n+1}}{(n+1)!}\\cdot\\dfrac{n!}{|${cs}|^{n}} = \\dfrac{|${cs}|}{n+1}$`,
          `For any fixed $x$, this $\\to0$ as $n\\to\\infty$.`,
          `$L=0<1$ for every $x$, so the series converges everywhere: $R=\\infty$.`,
          `Interval: $(-\\infty,\\infty)$ — no endpoints to check.`,
        ],
        recall: 'Factorial in the denominator → $R=\\infty$. Factorial in the numerator → $R=0$.',
        viz: { kind: 'interval', center: c, R: Infinity, cap: 'Converges for every real $x$ — the whole line.' },
      };
    }
    const denTex = { overn: 'n', oversq: 'n^{2}', plain: '' }[kind];
    const term = kind === 'plain'
      ? `\\frac{(${cs})^{n}}{${a}^{n}}`
      : `\\frac{(${cs})^{n}}{${denTex}\\cdot${a}^{n}}`;
    const leftClosed = kind !== 'plain';
    const rightClosed = kind === 'oversq';
    const endNote = {
      overn: `At $x=${c + a}$ you get $\\sum\\frac1n$ (**diverges**); at $x=${c - a}$ you get $\\sum\\frac{(-1)^{n}}{n}$ (**converges**).`,
      oversq: `At both endpoints you get $\\sum\\frac{\\pm1}{n^{2}}$, which converges absolutely. **Both** endpoints are included.`,
      plain: `At both endpoints the terms are $\\pm1$, which do not tend to $0$. **Neither** endpoint is included.`,
    }[kind];
    const IV = {
      open: `$(${c - a},\\,${c + a})$`,
      closed: `$[${c - a},\\,${c + a}]$`,
      halfL: `$[${c - a},\\,${c + a})$`,
      halfR: `$(${c - a},\\,${c + a}]$`,
    };
    const correctKey = { overn: 'halfL', oversq: 'closed', plain: 'open' }[kind];
    const wrongWhy = {
      open: `You found the radius correctly but never tested the endpoints — you excluded both by default. ${endNote}`,
      closed: `You included both endpoints without testing them. ${endNote}`,
      halfL: `You guessed at which endpoint survives instead of substituting. ${endNote}`,
      halfR: `The wrong end is included. Substitute each endpoint and test the resulting numerical series. ${endNote}`,
    };
    const wrongIvs = r.some(Object.keys(IV).filter(k2 => k2 !== correctKey), 2);
    return {
      prompt: `Find the radius **and** interval of convergence of $\\displaystyle\\sum_{n=1}^{\\infty}${term}$.`,
      choices: [
        { t: `$R=${a}$, interval ${IV[correctKey]}`, ok: true },
        ...wrongIvs.map(k2 => ({ t: `$R=${a}$, interval ${IV[k2]}`, why: wrongWhy[k2] })),
        { t: `$R=${frac(1, a)}$, interval $\\left(${c}-${frac(1, a)},\\,${c}+${frac(1, a)}\\right)$`, why: `The radius is inverted. From $\\frac{|${cs}|}{${a}}<1$ you get $|${cs}|<${a}$, so $R=${a}$, not $\\frac{1}{${a}}$.` },
      ],
      steps: [
        `Ratio Test: $\\left|\\dfrac{a_{n+1}}{a_n}\\right| \\to \\dfrac{|${cs}|}{${a}}$ (any $n$-power factor tends to $1$).`,
        `Converges when $\\dfrac{|${cs}|}{${a}}<1$, i.e. $|${cs}|<${a}$. So $R=${a}$ and the center is $x=${c}$.`,
        `Now test the endpoints separately — the Ratio Test is silent there.`,
        endNote,
      ],
      recall: 'Radius from the Ratio Test; interval requires two separate endpoint tests. Endpoints often behave differently from each other.',
      viz: {
        kind: 'interval', center: c, R: a, leftClosed, rightClosed,
        note: `R = ${a}, center ${c}`,
        cap: 'Filled dot = endpoint included; hollow dot = excluded. Each end has to be checked on its own.',
      },
    };
  },
});

G.push({
  id: 'g-s-alt-error', topic: 'Alternating Series & Error', diff: 3,
  make(r) {
    const p = r.pick([1, 2, 3]);
    const k = r.pick([2, 3]);
    const eps = 10 ** -k;
    // need b_{n+1} = 1/(n+1)^p < eps  →  (n+1)^p > 10^k  →  n+1 > 10^(k/p)
    const nplus1 = Math.floor(Math.pow(10, k / p)) + 1;
    const n = nplus1 - 1;
    const ptex = p === 1 ? 'n' : `n^{${p}}`;
    const key = `$${n}$ terms`;
    return {
      prompt: `How many terms of $\\displaystyle\\sum_{n=1}^{\\infty}\\frac{(-1)^{n-1}}{${ptex}}$ guarantee an error less than $10^{-${k}}$?`,
      choices: [
        { t: key, ok: true },
        ...choose(key, [
          { t: `$${nplus1}$ terms`, why: `Off by one. The condition is on the **first omitted** term $b_{n+1}=\\frac{1}{(n+1)^{${p}}}$. Solving $b_{n+1}<10^{-${k}}$ gives $n+1>${Math.round(Math.pow(10, k / p) * 100) / 100}$, so $n=${n}$ terms suffice.` },
          { t: `$${Math.max(1, n - 1)}$ terms`, why: 'Too few — the bound would not be met. Check by computing $b_{n+1}$ for your $n$ and comparing to the tolerance.' },
          { t: `$${10 ** k}$ terms`, why: `You ignored the exponent $${p}$. You need $(n+1)^{${p}}>10^{${k}}$, so $n+1>10^{${k}/${p}}$ — far fewer terms than $10^{${k}}$.` },
          { t: `$${2 * n}$ terms`, why: 'More than enough, but not what the bound requires. The estimation theorem gives the **smallest** sufficient $n$; doubling it wastes work.' },
          { t: `$${Math.max(1, n + 2)}$ terms`, why: `Solve the inequality exactly rather than padding: $n+1>10^{${k}/${p}}$ gives $n=${n}$.` },
        ]),
      ],
      steps: [
        `The Alternating Series Estimation Theorem: $|S-s_n|\\le b_{n+1}$.`,
        `Require $b_{n+1}=\\dfrac{1}{(n+1)^{${p}}} < 10^{-${k}}$.`,
        `Invert: $(n+1)^{${p}} > 10^{${k}}$, so $n+1 > 10^{${k}/${p}} \\approx ${Math.round(Math.pow(10, k / p) * 100) / 100}$.`,
        `Smallest integer: $n+1 = ${nplus1}$, so $n=${n}$ terms.`,
      ],
      recall: 'Set the **next** term below the tolerance and solve for $n$. The classic mistake is bounding $b_n$ instead of $b_{n+1}$.',
      viz: {
        kind: 'series', a: nn => Math.pow(-1, nn - 1) / Math.pow(nn, p), N: Math.min(20, Math.max(10, n + 4)), start: 1,
        cap: 'Each partial sum overshoots then undershoots the true value. The size of the next jump is exactly the error bound.',
      },
    };
  },
});

G.push({
  id: 'g-s-whichtest', topic: 'Choosing a Test', diff: 3,
  make(r) {
    const items = [
      { s: '\\sum_{n=1}^{\\infty}\\frac{n!}{n^{n}}', t: 'Ratio Test', why: 'Factorials and $n$th powers both scream Ratio Test — ratios of factorials telescope neatly.' },
      { s: '\\sum_{n=1}^{\\infty}\\frac{2n^{2}+1}{5n^{3}+n}', t: 'Limit Comparison Test', why: 'A ratio of polynomials: compare with the leading behaviour $\\frac{2n^{2}}{5n^{3}}\\sim\\frac{1}{n}$.' },
      { s: '\\sum_{n=1}^{\\infty}\\frac{(-1)^{n}}{\\ln(n+1)}', t: 'Alternating Series Test', why: 'Alternating signs with terms decreasing to $0$.' },
      { s: '\\sum_{n=1}^{\\infty}\\frac{\\ln n}{n}', t: 'Integral Test', why: 'A logarithm over a power — the substitution $u=\\ln x$ makes the integral trivial.' },
      { s: '\\sum_{n=1}^{\\infty}\\frac{3^{n}}{4^{n}+1}', t: 'Direct Comparison Test', why: 'Compare with the geometric $\\left(\\frac34\\right)^{n}$ by dropping the harmless $+1$.' },
      { s: '\\sum_{n=1}^{\\infty}\\frac{n}{2n+7}', t: 'Divergence Test', why: 'The terms tend to $\\frac12\\ne0$ — done in one line.' },
    ];
    const pickd = r.pick(items);
    const others = r.some(items.filter(i => i.t !== pickd.t), 3);
    return {
      prompt: `Which test is the **best first choice** for $\\displaystyle${pickd.s}$?`,
      choices: [
        { t: pickd.t, ok: true },
        ...others.map(o => ({ t: o.t, why: `${o.t} is the natural tool for $\\displaystyle${o.s}$ (${o.why}) — but it is a poor fit here. For this series: ${pickd.why}` })),
      ],
      steps: [
        `Read the **structure** of the terms before reaching for any test.`,
        `${pickd.why}`,
        `Best first choice: **${pickd.t}**.`,
        `Decision order that works: Divergence Test → geometric/$p$-series → Comparison or Limit Comparison → Ratio/Root (factorials, $n$th powers) → Integral (when $\\int f$ is easy) → Alternating.`,
      ],
      recall: 'Match the **shape** of $a_n$ to the test. Rational → Limit Comparison. Factorial/$n$th power → Ratio. Alternating → AST. $\\ln$ → Integral.',
    };
  },
});

G.push({
  id: 'g-s-taylorcoef', topic: 'Taylor & Maclaurin Series', diff: 2,
  make(r) {
    const base = r.pick([
      { name: 'e^{x}', coef: k => `\\dfrac{1}{${k}!}`, val: k => 1 / factorial(k), series: '\\sum\\frac{x^{n}}{n!}' },
      { name: '\\sin x', coef: k => (k % 2 === 0 ? '0' : `\\dfrac{${(k - 1) / 2 % 2 === 0 ? '' : '-'}1}{${k}!}`), val: k => (k % 2 === 0 ? 0 : ((k - 1) / 2 % 2 === 0 ? 1 : -1) / factorial(k)), series: '\\sum\\frac{(-1)^{n}x^{2n+1}}{(2n+1)!}' },
      { name: '\\cos x', coef: k => (k % 2 === 1 ? '0' : `\\dfrac{${(k / 2) % 2 === 0 ? '' : '-'}1}{${k}!}`), val: k => (k % 2 === 1 ? 0 : ((k / 2) % 2 === 0 ? 1 : -1) / factorial(k)), series: '\\sum\\frac{(-1)^{n}x^{2n}}{(2n)!}' },
      { name: '\\dfrac{1}{1-x}', coef: () => '1', val: () => 1, series: '\\sum x^{n}' },
    ]);
    const k = r.int(2, 5);
    const right = base.coef(k);
    return {
      prompt: `In the Maclaurin series for $${base.name}$, what is the coefficient of $x^{${k}}$?`,
      choices: [
        { t: `$${right}$`, ok: true },
        { t: `$\\dfrac{1}{${k}}$`, why: `You used $\\frac{1}{n}$ instead of $\\frac{1}{n!}$. Taylor coefficients are $\\frac{f^{(n)}(0)}{n!}$ — the factorial is essential.` },
        { t: `$${k}!$`, why: 'The factorial goes in the **denominator**. $c_n=\\frac{f^{(n)}(0)}{n!}$.' },
        { t: `$\\dfrac{1}{${k + 1}!}$`, why: 'Off by one in the index. The coefficient of $x^{k}$ uses $k!$, not $(k+1)!$.' },
      ],
      steps: [
        `Known series: $${base.name} = ${base.series}$.`,
        `Read off the term containing $x^{${k}}$.`,
        `Coefficient $= ${right}$.`,
        right === '0' ? `(This function has only ${base.name === '\\sin x' ? 'odd' : 'even'} powers, so the $x^{${k}}$ term is absent.)` : `Equivalently $c_{${k}} = \\frac{f^{(${k})}(0)}{${k}!}$.`,
      ],
      recall: 'Memorize the five core series ($e^{x}$, $\\sin$, $\\cos$, $\\frac{1}{1-x}$, $\\ln(1+x)$). Everything else comes from substitution, differentiation, or integration.',
    };
  },
});

G.push({
  id: 'g-s-taylorpoly', topic: 'Taylor Polynomials & Error', diff: 2,
  make(r) {
    const opts = [
      {
        f: '\\sqrt{x}', a: 4, f0: '2', f1: '\\tfrac14', f2: '-\\tfrac{1}{32}',
        t1: '2+\\frac{x-4}{4}', t2: '2+\\frac{x-4}{4}-\\frac{(x-4)^{2}}{64}',
        bad: '2+\\frac{x-4}{4}-\\frac{(x-4)^{2}}{32}',
        nocenter: '2+\\frac{x}{4}-\\frac{x^{2}}{64}',
        fn: x => Math.sqrt(x), p2: x => 2 + (x - 4) / 4 - (x - 4) ** 2 / 64, p1: x => 2 + (x - 4) / 4,
      },
      {
        f: '\\ln x', a: 1, f0: '0', f1: '1', f2: '-1',
        t1: 'x-1', t2: '(x-1)-\\frac{(x-1)^{2}}{2}',
        bad: '(x-1)-(x-1)^{2}',
        nocenter: 'x-\\frac{x^{2}}{2}',
        fn: x => Math.log(x), p2: x => (x - 1) - (x - 1) ** 2 / 2, p1: x => x - 1,
      },
      {
        f: '\\dfrac{1}{x}', a: 1, f0: '1', f1: '-1', f2: '2',
        t1: '1-(x-1)', t2: '1-(x-1)+(x-1)^{2}',
        bad: '1-(x-1)+2(x-1)^{2}',
        nocenter: '1-x+x^{2}',
        fn: x => 1 / x, p2: x => 1 - (x - 1) + (x - 1) ** 2, p1: x => 2 - x,
      },
    ];
    const o = r.pick(opts);
    return {
      prompt: `Find the second-degree Taylor polynomial $T_{2}(x)$ for $f(x)=${o.f}$ centered at $a=${o.a}$.`,
      choices: [
        { t: `$${o.t2}$`, ok: true },
        { t: `$${o.bad}$`, why: 'You forgot to divide the second-derivative term by $2!$. The general term is $\\frac{f^{(n)}(a)}{n!}(x-a)^{n}$ — for $n=2$ that means dividing by $2$.' },
        { t: `$${o.nocenter}$`, why: `You dropped the centering. Every power must be $(x-${o.a})^{n}$, not $x^{n}$ — the polynomial is built **around** $a=${o.a}$.` },
        { t: `$${o.t1}$`, why: 'That is $T_1$, the tangent line. You stopped one term early.' },
      ],
      steps: [
        `$f(${o.a})=${o.f0}$, $f'(${o.a})=${o.f1}$, $f''(${o.a})=${o.f2}$.`,
        `$T_2(x)=f(a)+f'(a)(x-a)+\\dfrac{f''(a)}{2!}(x-a)^{2}$`,
        `$= ${o.f0}+${o.f1}(x-${o.a})+\\dfrac{${o.f2}}{2}(x-${o.a})^{2}$`,
        `$= ${o.t2}$`,
      ],
      recall: 'Term $n$ is $\\frac{f^{(n)}(a)}{n!}(x-a)^{n}$. The factorial and the centering are the two things people drop.',
      viz: {
        kind: 'taylor', f: o.fn, c: o.a,
        xmin: Math.max(0.05, o.a - 1.6), xmax: o.a + 2.4,
        fLabel: `f(x) = ${o.f.replace(/\\dfrac/g, '').replace(/[{}\\]/g, '')}`,
        polys: [{ n: 1, label: 'T₁ (tangent)', p: o.p1 }, { n: 2, label: 'T₂', p: o.p2 }],
        cap: 'The tangent line $T_1$ matches slope only; $T_2$ also matches the **bending**, so it stays close much further from the center.',
      },
    };
  },
});

G.push({
  id: 'g-s-telescope', topic: 'Geometric & Telescoping', diff: 3,
  make(r) {
    const d = r.pick([1, 2]);
    // sum_{n=1}^inf 1/(n(n+d)) = (1/d)(1 + 1/2 + ... + 1/d)
    let H = 0; for (let i = 1; i <= d; i++) H += 1 / i;
    const S = H / d;
    const stex = d === 1 ? '1' : frac(3, 4);
    return {
      prompt: `Evaluate $\\displaystyle\\sum_{n=1}^{\\infty}\\frac{1}{n(n+${d})}$.`,
      choices: [
        { t: `$${stex}$`, ok: true },
        { t: '$0$', why: 'The terms tend to $0$, but the sum of infinitely many positive terms is positive. You are reporting the limit of the terms, not the sum.' },
        { t: '$\\infty$', why: `The terms behave like $\\frac{1}{n^{2}}$ for large $n$, which converges. Telescoping makes the exact value easy.` },
        { t: `$${d === 1 ? frac(1, 2) : frac(1, 2)}$`, why: `You cancelled too much. Write out $s_N$ explicitly: after cancellation ${d === 1 ? '$s_N = 1-\\frac{1}{N+1}$' : '$s_N=\\frac12\\left(1+\\frac12-\\frac{1}{N+1}-\\frac{1}{N+2}\\right)$'}, then take $N\\to\\infty$.` },
      ],
      steps: [
        `Partial fractions: $\\dfrac{1}{n(n+${d})} = \\dfrac{1}{${d}}\\left(\\dfrac{1}{n}-\\dfrac{1}{n+${d}}\\right)$.`,
        d === 1
          ? `$s_N = \\left(1-\\frac12\\right)+\\left(\\frac12-\\frac13\\right)+\\cdots+\\left(\\frac1N-\\frac{1}{N+1}\\right) = 1-\\frac{1}{N+1}$`
          : `Terms cancel with a **gap of ${d}**, so the first ${d} positives and the last ${d} negatives survive: $s_N=\\frac{1}{${d}}\\left(1+\\frac12-\\frac{1}{N+1}-\\frac{1}{N+2}\\right)$`,
        `Let $N\\to\\infty$: the trailing fractions vanish.`,
        `$S = ${stex}$`,
      ],
      recall: 'Telescoping: write out $s_N$ **explicitly** and see what survives. With a gap of $d$, exactly $d$ terms survive at each end.',
      viz: {
        kind: 'series', a: n => 1 / (n * (n + d)), N: 16, start: 1,
        limit: S, limitLabel: `S = ${Math.round(S * 1000) / 1000}`,
        cap: 'Partial sums climb quickly then flatten against the limit — the hallmark of a telescoping series.',
      },
    };
  },
});

G.push({
  id: 'g-s-limcomp', topic: 'Limit Comparison', diff: 2,
  make(r) {
    const p = r.int(1, 3), q = p + r.int(1, 3);
    const diff = q - p;
    const conv = diff > 1;
    const key = `Compare with $\\sum\\frac{1}{n^{${diff}}}$ — ${conv ? 'converges' : 'diverges'}`;
    return {
      prompt: `Use Limit Comparison on $\\displaystyle\\sum_{n=1}^{\\infty}\\frac{${p === 1 ? '' : p}n^{${p}}+1}{${q === 1 ? '' : q}n^{${q}}+n}$. What is the natural comparison series, and what is the verdict?`,
      choices: [
        { t: key, ok: true },
        ...choose(key, [
          { t: `Compare with $\\sum\\frac{1}{n^{${diff}}}$ — ${conv ? 'diverges' : 'converges'}`, why: `Right comparison series, wrong $p$-series verdict. Here $p=${diff}$, and $p>1$ ⟺ converges, so it ${conv ? 'converges' : 'diverges'}.` },
          { t: `Compare with $\\sum\\frac{1}{n^{${q}}}$ — converges`, why: `You used only the denominator's degree. Limit Comparison uses the **ratio** of leading behaviours: $\\frac{n^{${p}}}{n^{${q}}}=\\frac{1}{n^{${diff}}}$.` },
          { t: `Compare with $\\sum\\frac{1}{n^{${p}}}$ — ${p > 1 ? 'converges' : 'diverges'}`, why: `You used the numerator's degree. Subtract the exponents: the terms behave like $n^{${p}-${q}} = n^{-${diff}}$.` },
          { t: `Compare with $\\sum\\frac{1}{n^{${p + q}}}$ — converges`, why: 'You added the exponents. Dividing powers **subtracts** them.' },
          { t: `Compare with a geometric series — ${conv ? 'converges' : 'diverges'}`, why: 'These terms are a ratio of polynomials, not a constant ratio. Geometric comparison does not apply.' },
        ]),
      ],
      steps: [
        `For large $n$, keep only leading terms: $\\dfrac{${p === 1 ? '' : p}n^{${p}}}{${q === 1 ? '' : q}n^{${q}}} = \\dfrac{${frac(p === 1 ? 1 : p, q === 1 ? 1 : q)}}{n^{${diff}}}$.`,
        `Take $b_n=\\dfrac{1}{n^{${diff}}}$ and compute $\\displaystyle\\lim\\frac{a_n}{b_n} = ${frac(p === 1 ? 1 : p, q === 1 ? 1 : q)}$, a finite **nonzero** number.`,
        `So $\\sum a_n$ and $\\sum b_n$ do the same thing.`,
        `$\\sum\\frac{1}{n^{${diff}}}$ is a $p$-series with $p=${diff}$, which ${conv ? 'converges ($p>1$)' : 'diverges ($p\\le1$)'}. Therefore the original **${conv ? 'converges' : 'diverges'}**.`,
      ],
      recall: 'Limit Comparison: keep the leading power on top and bottom, subtract exponents. The limit only needs to be finite and nonzero.',
    };
  },
});

G.push({
  id: 'g-s-appl', topic: 'Applications of Series', diff: 3,
  make(r) {
    const kind = r.pick(['integral', 'limit']);
    if (kind === 'integral') {
      const opts = [
        {
          f: '\\sin(x^{2})', series: 'x^{2}-\\dfrac{x^{6}}{6}+\\cdots',
          key: 'x-\\dfrac{x^{3}}{3\\cdot 3!}', ans: '\\dfrac{x^{3}}{3}-\\dfrac{x^{7}}{42}+C',
          bad1: '\\dfrac{x^{3}}{3}-\\dfrac{x^{7}}{6}+C', bad1why: 'You integrated $-\\frac{x^{6}}{6}$ to $-\\frac{x^{7}}{6}$, forgetting to divide by the new exponent $7$: it is $-\\frac{x^{7}}{42}$.',
          bad2: 'x^{2}-\\dfrac{x^{6}}{6}+C', bad2why: 'That is the series for the integrand itself — you never integrated it.',
          bad3: '\\dfrac{x^{3}}{3}+\\dfrac{x^{7}}{42}+C', bad3why: 'Sign. The $x^{6}$ term of $\\sin(x^{2})$ is negative, and integrating preserves that.',
        },
        {
          f: 'e^{-x^{2}}', series: '1-x^{2}+\\dfrac{x^{4}}{2}-\\cdots',
          key: '', ans: 'x-\\dfrac{x^{3}}{3}+\\dfrac{x^{5}}{10}+C',
          bad1: 'x-\\dfrac{x^{3}}{3}+\\dfrac{x^{5}}{2}+C', bad1why: 'Integrating $\\frac{x^{4}}{2}$ gives $\\frac{x^{5}}{10}$ — divide by $5$ as well as the existing $2$.',
          bad2: '1-x^{2}+\\dfrac{x^{4}}{2}+C', bad2why: 'That is the integrand\'s own series; you never integrated term by term.',
          bad3: 'x-x^{3}+\\dfrac{x^{5}}{2}+C', bad3why: 'The $x^{2}$ term integrates to $\\frac{x^{3}}{3}$, not $x^{3}$.',
        },
        {
          f: '\\dfrac{1}{1+x^{3}}', series: '1-x^{3}+x^{6}-\\cdots',
          key: '', ans: 'x-\\dfrac{x^{4}}{4}+\\dfrac{x^{7}}{7}+C',
          bad1: 'x-\\dfrac{x^{4}}{4}-\\dfrac{x^{7}}{7}+C', bad1why: 'The signs **alternate**: $1-x^{3}+x^{6}-\\cdots$, so the third term is positive.',
          bad2: '1-x^{3}+x^{6}+C', bad2why: 'That is the integrand, unintegrated.',
          bad3: 'x-\\dfrac{x^{4}}{3}+\\dfrac{x^{7}}{6}+C', bad3why: 'Divide by the **new** exponent after raising it: $x^{3}\\to\\frac{x^{4}}{4}$, not $\\frac{x^{4}}{3}$.',
        },
      ];
      const o = r.pick(opts);
      const key = `$${o.ans}$`;
      return {
        prompt: `Use a Maclaurin series to find $\\displaystyle\\int ${o.f}\\,dx$ (first three nonzero terms).`,
        choices: [
          { t: key, ok: true },
          ...choose(key, [
            { t: `$${o.bad1}$`, why: o.bad1why },
            { t: `$${o.bad3}$`, why: o.bad3why },
            { t: `$${o.bad2}$`, why: o.bad2why },
          ]),
        ],
        steps: [
          `Start from the known series: $${o.f} = ${o.series}$`,
          `A power series may be integrated **term by term** inside its interval of convergence.`,
          `Integrate each term with the power rule.`,
          `$\\displaystyle\\int ${o.f}\\,dx = ${o.ans}$`,
        ],
        recall: 'Term-by-term integration turns impossible integrals (like $\\int e^{-x^{2}}dx$) into easy ones. Raise each exponent and divide.',
      };
    }
    const opts = [
      { lim: '\\lim_{x\\to0}\\dfrac{1-\\cos x}{x^{2}}', ans: '\\dfrac{1}{2}', ser: '\\cos x = 1-\\dfrac{x^{2}}{2!}+\\dfrac{x^{4}}{4!}-\\cdots', lead: '\\dfrac{x^{2}}{2}', wrong: ['0', '1', '\\dfrac{1}{4}'], wwhy: ['Numerator and denominator vanish at the same rate, so the ratio settles at a nonzero number.', 'The $x^{2}$ coefficient of $\\cos x$ is $\\frac{1}{2!}=\\frac12$, not $1$.', 'You used $4!$ or squared the $\\frac12$. The leading term is $\\frac{x^{2}}{2!}=\\frac{x^{2}}{2}$.'] },
      { lim: '\\lim_{x\\to0}\\dfrac{e^{x}-1-x}{x^{2}}', ans: '\\dfrac{1}{2}', ser: 'e^{x} = 1+x+\\dfrac{x^{2}}{2!}+\\cdots', lead: '\\dfrac{x^{2}}{2}', wrong: ['0', '1', '\\dfrac{1}{6}'], wwhy: ['Subtracting $1+x$ cancels the first two terms, leaving $\\frac{x^{2}}{2}$ — exactly the order of the denominator.', 'The $x^{2}$ coefficient is $\\frac{1}{2!}=\\frac12$.', '$\\frac16$ is the $x^{3}$ coefficient ($\\frac{1}{3!}$). You went one term too far.'] },
      { lim: '\\lim_{x\\to0}\\dfrac{\\tan^{-1}x-x}{x^{3}}', ans: '-\\dfrac{1}{3}', ser: '\\tan^{-1}x = x-\\dfrac{x^{3}}{3}+\\dfrac{x^{5}}{5}-\\cdots', lead: '-\\dfrac{x^{3}}{3}', wrong: ['\\dfrac{1}{3}', '0', '-\\dfrac{1}{6}'], wwhy: ['Sign: the $x^{3}$ term of $\\arctan x$ is **negative**.', 'The two vanish at the same rate, so the limit is nonzero.', 'The arctangent series has plain odd denominators $1,3,5$ — no factorials.'] },
    ];
    const o = r.pick(opts);
    const key = `$${o.ans}$`;
    return {
      prompt: `Use a Maclaurin series to evaluate $\\displaystyle ${o.lim}$.`,
      choices: [
        { t: key, ok: true },
        ...choose(key, o.wrong.map((w, i) => ({ t: `$${w}$`, why: o.wwhy[i] }))),
      ],
      steps: [
        `Expand: $${o.ser}$`,
        `After the cancellation in the numerator, the lowest surviving term is $${o.lead}$.`,
        `Divide by the denominator; every higher-order term still carries a positive power of $x$ and dies.`,
        `Limit $= ${o.ans}$.`,
      ],
      recall: 'Series beat repeated L\'Hôpital on these: expand, cancel, and read off the coefficient of the matching power.',
    };
  },
});

function factorial(n) { let f = 1; for (let i = 2; i <= n; i++) f *= i; return f; }

export const seriesUnit = { unit: 'series', problems: P, generators: G };
