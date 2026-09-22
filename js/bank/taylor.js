// ---------------------------------------------------------------
// bank/taylor.js — Exam 3 archetypes.
//
// Exam 3 is entirely power series and Taylor series, and his papers
// repeat the same six shapes every semester:
//
//   Q1  the Maclaurin-series table          (18 pts — pure recall)
//   Q2  a Taylor series derived from scratch
//   Q3  centre / radius / interval of convergence, endpoints included
//   Q4  a new Maclaurin series by substitution
//   Q5  summing a numeric series by recognising a known Maclaurin form
//   Q6  a Taylor polynomial and its remainder bound
//
// Modelled on fall25 / spring25 / spring26 Exam 3 and the finals.
// ---------------------------------------------------------------
import { frac, choose } from '../util.js';

const P = [];
const G = [];

// ---------------------------------------------------------------
// The six rows of his table. Every fact here is worth points.
// ---------------------------------------------------------------
const TABLE = [
  {
    f: '\\dfrac{1}{1-x}', name: 'geometric',
    two: '1 + x',
    ser: '\\sum_{n=0}^{\\infty} x^{n}',
    ioc: '(-1, 1)',
    iocWhy: 'Geometric with ratio $x$: converges iff $|x|<1$. At $x=\\pm1$ the terms do not tend to $0$, so **both** endpoints diverge.',
  },
  {
    f: 'e^{x}', name: 'exponential',
    two: '1 + x',
    ser: '\\sum_{n=0}^{\\infty} \\dfrac{x^{n}}{n!}',
    ioc: '(-\\infty, \\infty)',
    iocWhy: 'The Ratio Test gives $\\lim\\left|\\frac{x}{n+1}\\right| = 0$ for every $x$, so it converges everywhere.',
  },
  {
    f: '\\sin x', name: 'sine',
    two: 'x - \\dfrac{x^{3}}{3!}',
    ser: '\\sum_{n=0}^{\\infty} (-1)^{n}\\dfrac{x^{2n+1}}{(2n+1)!}',
    ioc: '(-\\infty, \\infty)',
    iocWhy: 'Factorials in the denominator beat any power of $x$, so the Ratio Test gives $0$ for all $x$.',
  },
  {
    f: '\\cos x', name: 'cosine',
    two: '1 - \\dfrac{x^{2}}{2!}',
    ser: '\\sum_{n=0}^{\\infty} (-1)^{n}\\dfrac{x^{2n}}{(2n)!}',
    ioc: '(-\\infty, \\infty)',
    iocWhy: 'Same as sine — the factorial dominates, so it converges on the whole line.',
  },
  {
    f: '\\ln(1+x)', name: 'log',
    two: 'x - \\dfrac{x^{2}}{2}',
    ser: '\\sum_{n=1}^{\\infty} (-1)^{n+1}\\dfrac{x^{n}}{n}',
    ioc: '(-1, 1]',
    iocWhy: 'Radius $1$. At $x=1$ it is the alternating harmonic series — converges. At $x=-1$ it is $-\\sum\\frac1n$ — diverges. So the right endpoint is **in**, the left is **out**.',
  },
  {
    f: '\\arctan x', name: 'arctangent',
    two: 'x - \\dfrac{x^{3}}{3}',
    ser: '\\sum_{n=0}^{\\infty} (-1)^{n}\\dfrac{x^{2n+1}}{2n+1}',
    ioc: '[-1, 1]',
    iocWhy: 'Radius $1$, and at **both** endpoints it alternates with terms $\\frac{1}{2n+1}\\to0$ decreasing — so both endpoints converge.',
  },
];

// ---- Q1: the Maclaurin table, one cell at a time ------------------
G.push({
  id: 'gt-mac-table', unit: 'series', topic: 'Taylor & Maclaurin Series', diff: 2,
  src: 'his Exam 3 Q1 — the 18-point table',
  make(r) {
    const row = r.pick(TABLE);
    const ask = r.pick(['two', 'ser', 'ioc']);
    const others = TABLE.filter(t => t.f !== row.f);

    if (ask === 'ioc') {
      const key = `$${row.ioc}$`;
      return {
        prompt: `What is the **interval of convergence** of the Maclaurin series for $${row.f}$?`,
        choices: [
          { t: key, ok: true },
          ...choose(key, [
            { t: '$(-1, 1)$', why: 'Right radius, wrong endpoints. The radius only tells you the open interval — each endpoint has to be tested by substituting it in and running a series test.', err: 'endpoints' },
            { t: '$[-1, 1]$', why: 'You included both endpoints without testing them. Substitute $x=1$ and $x=-1$ separately — they often behave differently.', err: 'endpoints' },
            { t: '$(-1, 1]$', why: 'Check each endpoint on its own. Only $\\ln(1+x)$ has this interval, because $x=-1$ gives the negative harmonic series.', err: 'endpoints' },
            { t: '$(-\\infty, \\infty)$', why: 'That is the answer for $e^{x}$, $\\sin x$ and $\\cos x$, where factorials crush every power of $x$. A series with no factorial has a finite radius.', err: 'formula-confusion' },
            { t: '$\\{0\\}$', why: 'Radius $0$ happens only when the coefficients grow factorially, as in $\\sum n!x^{n}$. None of the standard six do that.' },
          ]),
        ],
        hint: 'Find the radius first, then substitute each endpoint and test the resulting numeric series separately.',
        steps: [
          `Radius: the Ratio Test on the series for $${row.f}$.`,
          row.iocWhy,
          `Interval of convergence: $${row.ioc}$.`,
        ],
        recall: 'Endpoints are separate questions. $\\frac{1}{1-x}$ has neither, $\\ln(1+x)$ has the right one, $\\arctan x$ has both.',
        fix: 'Never write an interval without substituting both endpoints and naming the test you used.',
      };
    }

    const field = ask === 'two' ? 'two' : 'ser';
    const label = ask === 'two' ? 'first two nonzero terms' : 'Maclaurin series';
    const key = `$${row[field]}$`;
    return {
      prompt: `Give the **${label}** of the Maclaurin series for $${row.f}$.`,
      choices: [
        { t: key, ok: true },
        ...choose(key, [
          ...others.slice(0, 3).map(o => ({
            t: `$${o[field]}$`,
            why: `That is the ${o.name} series, not the ${row.name} one. ${
              o.name === 'sine' || o.name === 'cosine'
                ? 'Sine has **odd** powers with $(2n+1)!$; cosine has **even** powers with $(2n)!$.'
                : 'Match the pattern of powers and denominators to the function.'}`,
            err: 'formula-confusion',
          })),
          ask === 'ser' && /sin|cos/.test(row.name)
            ? { t: `$${row.ser.replace('(-1)^{n}', '')}$`, why: 'The alternating factor $(-1)^{n}$ is missing. Both $\\sin$ and $\\cos$ alternate — check the signs of the first few terms.', err: 'sign' }
            : null,
          ask === 'ser' && row.name === 'log'
            ? { t: '$\\sum_{n=1}^{\\infty}(-1)^{n+1}\\dfrac{x^{n}}{n!}$', why: 'The denominator is $n$, not $n!$. $\\ln(1+x)$ comes from integrating $\\frac{1}{1+x}$ term by term, which produces plain $n$ — no factorials.', err: 'formula-confusion' }
            : null,
          ask === 'ser' && row.name === 'arctangent'
            ? { t: '$\\sum_{n=0}^{\\infty}(-1)^{n}\\dfrac{x^{2n+1}}{(2n+1)!}$', why: 'That is $\\sin x$. Arctangent has the **same powers** but plain odd denominators $1,3,5,\\dots$ — no factorials, because it comes from integrating $\\frac{1}{1+x^{2}}$.', err: 'formula-confusion' }
            : null,
          ask === 'two'
            ? { t: '$1 - x$', why: 'Check the sign and the constant term by evaluating $f(0)$ and $f\'(0)$ directly.', err: 'sign' }
            : null,
        ]),
      ],
      hint: `Write out $f(0), f'(0), f''(0)$ for $${row.f}$ — the first two nonzero terms fall straight out of $\\sum\\frac{f^{(n)}(0)}{n!}x^{n}$.`,
      steps: [
        `The Maclaurin series is $\\sum_{n=0}^{\\infty}\\dfrac{f^{(n)}(0)}{n!}x^{n}$.`,
        `For $${row.f}$ this gives $${row.ser}$.`,
        `Its first two nonzero terms are $${row.two}$, and it converges on $${row.ioc}$.`,
      ],
      recall: 'Six series carry the whole of Exam 3: $\\frac{1}{1-x}$, $e^{x}$, $\\sin x$, $\\cos x$, $\\ln(1+x)$, $\\arctan x$. Know all three columns of each.',
      fix: 'Drill the table until you can write all six rows from memory in under two minutes.',
    };
  },
});

// ---- Q4: a new Maclaurin series by substitution --------------------
G.push({
  id: 'gt-mac-sub', unit: 'series', topic: 'Taylor & Maclaurin Series', diff: 3,
  src: 'his Exam 3 Q4 — "find the Maclaurin series for x·cos(x³)"',
  make(r) {
    const base = r.pick([
      { f: '\\cos', ser: n => `(-1)^{n}\\dfrac{u^{2n}}{(2n)!}`, pw: 2, fact: '(2n)!', shift: 0 },
      { f: '\\sin', ser: n => `(-1)^{n}\\dfrac{u^{2n+1}}{(2n+1)!}`, pw: 2, fact: '(2n+1)!', shift: 1 },
    ]);
    const k = r.int(2, 4);            // inner power: cos(x^k)
    const m = r.int(1, 2);            // outer factor: x^m
    const isCos = base.f === '\\cos';
    // x^m * f(x^k):  exponent becomes k*(2n + shift) + m
    const inner = isCos ? `2n` : `2n+1`;
    const expo = `${k === 1 ? '' : k}\\left(${inner}\\right)+${m}`;
    const flat = isCos ? `${2 * k}n+${m}` : `${2 * k}n+${k + m}`;
    const outer = m === 1 ? 'x' : `x^{${m}}`;
    const fn = `${outer}${base.f}\\!\\left(x^{${k}}\\right)`;
    const key = `$\\sum_{n=0}^{\\infty}(-1)^{n}\\dfrac{x^{${flat}}}{${base.fact}}$`;
    return {
      prompt: `Find the Maclaurin series for $${fn}$.`,
      choices: [
        { t: key, ok: true },
        ...choose(key, [
          { t: `$\\sum_{n=0}^{\\infty}(-1)^{n}\\dfrac{x^{${isCos ? `2n+${m}` : `2n+${1 + m}`}}}{${base.fact}}$`, why: `You multiplied by $${outer}$ but forgot to substitute $x^{${k}}$ into the inside. Replacing $u$ by $x^{${k}}$ multiplies the exponent by $${k}$.`, err: 'chain-rule' },
          { t: `$\\sum_{n=0}^{\\infty}(-1)^{n}\\dfrac{x^{${isCos ? `${2 * k}n` : `${2 * k}n+${k}`}}}{${base.fact}}$`, why: `You substituted correctly but dropped the outside factor $${outer}$, which adds $${m}$ to every exponent.`, err: 'dropped-factor' },
          { t: `$\\sum_{n=0}^{\\infty}(-1)^{n}\\dfrac{x^{${flat}}}{${isCos ? '(2n+1)!' : '(2n)!'}}$`, why: `Wrong factorial. $${base.f}$ pairs with $${base.fact}$ — check which of sine/cosine you are expanding.`, err: 'formula-confusion' },
          { t: `$\\sum_{n=0}^{\\infty}\\dfrac{x^{${flat}}}{${base.fact}}$`, why: 'The alternating factor $(-1)^{n}$ was dropped. Substituting a power of $x$ never removes the alternation.', err: 'sign' },
          { t: `$\\sum_{n=0}^{\\infty}(-1)^{n}\\dfrac{x^{${flat}}}{${base.fact}}\\cdot ${k}$`, why: `There is no chain-rule factor here. You are **substituting** into a series, not differentiating — no extra $${k}$ appears.`, err: 'chain-rule' },
        ]),
      ],
      hint: `Start from the series for $${base.f} u$, substitute $u = x^{${k}}$, then multiply every term by $${outer}$.`,
      steps: [
        `Known: $${base.f} u = \\sum_{n=0}^{\\infty}${base.ser()}$ for all $u$.`,
        `Substitute $u = x^{${k}}$: each $u^{${inner}}$ becomes $\\left(x^{${k}}\\right)^{${inner}} = x^{${k}(${inner})}$.`,
        `Multiply by the outside factor $${outer}$: every exponent gains $${m}$.`,
        `Result: $\\sum_{n=0}^{\\infty}(-1)^{n}\\dfrac{x^{${flat}}}{${base.fact}}$, valid for all $x$.`,
      ],
      recall: 'Building a new series: substitute into a known one, then multiply through. Never differentiate term by term unless the question asks you to.',
      fix: 'Do the substitution and the multiplication as two separate written steps — combining them in your head is where exponents get lost.',
    };
  },
});

// ---- Q3/Q5: centre, radius and the endpoints ----------------------
G.push({
  id: 'gt-pow-ioc', unit: 'series', topic: 'Power Series & Radius', diff: 4,
  src: 'his Exam 3 Q3/Q5 — centre, radius and interval of convergence',
  make(r) {
    const c = r.nz(2, 9) * r.pick([1, -1]);
    const k = r.int(2, 8);
    // p decides what the endpoints do — this is the whole point of the question
    const p = r.pick([0, 1, 2]);
    const den = p === 0 ? `${k}^{n}` : p === 1 ? `n\\,${k}^{n}` : `n^{2}\\,${k}^{n}`;
    // every n advances, including the one in the exponent
    const denNext = p === 0 ? `${k}^{n+1}` : p === 1 ? `(n+1)\\,${k}^{n+1}` : `(n+1)^{2}\\,${k}^{n+1}`;
    const cs = c < 0 ? `(x+${-c})` : `(x-${c})`;
    const lo = c - k, hi = c + k;
    const ioc = p === 0 ? `(${lo}, ${hi})` : p === 1 ? `[${lo}, ${hi})` : `[${lo}, ${hi}]`;
    const endWhy = p === 0
      ? `At both endpoints the terms are $\\pm1$, which do not tend to $0$ — both diverge.`
      : p === 1
        ? `At $x=${hi}$ the series is $\\sum\\frac1n$, the harmonic series — diverges. At $x=${lo}$ it is $\\sum\\frac{(-1)^{n}}{n}$, alternating harmonic — converges. So the left endpoint is in and the right is out.`
        : `At both endpoints the terms are dominated by $\\frac{1}{n^{2}}$, which converges by the $p$-test — so both endpoints are included.`;
    const key = `$${ioc}$`;
    return {
      prompt: `Find the **interval of convergence** of $\\displaystyle\\sum_{n=1}^{\\infty}\\frac{${cs}^{n}}{${den}}$.`,
      choices: [
        { t: key, ok: true },
        ...choose(key, [
          { t: `$(${lo}, ${hi})$`, why: 'You stopped at the radius. The Ratio Test gives the **open** interval; each endpoint then has to be substituted in and tested by hand.', err: 'endpoints' },
          { t: `$[${lo}, ${hi}]$`, why: 'Both endpoints were included without testing. Substitute each one and run a test — they very often disagree with each other.', err: 'endpoints' },
          { t: `$(${lo}, ${hi}]$`, why: 'The endpoints are the wrong way round. Substitute $x=' + lo + '$ and $x=' + hi + '$ separately and see which series you actually get.', err: 'endpoints' },
          { t: `$(${c - 1}, ${c + 1})$`, why: `The radius is not $1$. The Ratio Test gives $\\frac{|x-${c}|}{${k}}<1$, so $R=${k}$ — the $${k}^{n}$ in the denominator sets the radius.`, err: 'setup' },
          { t: `$\\{${c}\\}$`, why: 'Radius $0$ would need factorially growing coefficients, as in $\\sum n!x^{n}$. Here the coefficients shrink.' },
          { t: '$(-\\infty, \\infty)$', why: `An infinite radius needs factorials in the denominator. A $${k}^{n}$ only gives radius $${k}$.`, err: 'formula-confusion' },
        ]),
      ],
      hint: `The centre is the $x$ that kills every term. Use the Ratio Test for the radius — then substitute each endpoint back in and test the two numeric series you get.`,
      steps: [
        `Centre: $x=${c}$ makes every term $0$, so $c=${c}$.`,
        `Ratio Test: $\\displaystyle\\lim_{n\\to\\infty}\\left|\\frac{${cs}^{n+1}}{${denNext}}\\cdot\\frac{${den}}{${cs}^{n}}\\right| = \\frac{|x-${c}|}{${k}}$.`,
        `Convergence needs $\\frac{|x-${c}|}{${k}}<1$, i.e. $|x-${c}|<${k}$, so $R=${k}$ and the open interval is $(${lo}, ${hi})$.`,
        `Now the endpoints. ${endWhy}`,
        `Interval of convergence: $${ioc}$.`,
      ],
      recall: 'Three separate steps: centre, radius, endpoints. The Ratio Test never decides the endpoints — it is inconclusive exactly there.',
      fix: 'Write "check $x=a$" and "check $x=b$" as two explicit lines. He grades the endpoint work.',
    };
  },
});

// ---- radius 0 and radius infinity, the two extremes ----------------
G.push({
  id: 'gt-pow-extreme', unit: 'series', topic: 'Power Series & Radius', diff: 3,
  src: 'his Exam 3 — "find the radius for Σ n!(5x+2)^n"',
  make(r) {
    const a = r.int(2, 6), b = r.int(1, 5);
    const kind = r.pick(['zero', 'inf']);
    if (kind === 'zero') {
      const centre = frac(-b, a);
      const key = `$R=0$; converges only at $x=${centre}$`;
      return {
        prompt: `Find the radius and interval of convergence of $\\displaystyle\\sum_{n=0}^{\\infty} n!\\,(${a}x+${b})^{n}$.`,
        choices: [
          { t: key, ok: true },
          ...choose(key, [
            { t: `$R=\\infty$; converges for all $x$`, why: 'The factorial is in the **numerator** here, so it makes terms explode rather than shrink. Factorials only give an infinite radius when they are in the denominator.', err: 'formula-confusion' },
            { t: `$R=${frac(1, a)}$; converges on $\\left(${frac(-b - 1, a)}, ${frac(-b + 1, a)}\\right)$`, why: 'You found the radius as if the coefficients were bounded. The Ratio Test here gives $\\lim(n+1)|{a}x+{b}| = \\infty$ unless the bracket is exactly $0$.'.replace('{a}', a).replace('{b}', b), err: 'setup' },
            { t: `$R=1$; converges on $(-1,1)$`, why: `The centre is not $0$. Factor out the $${a}$: $${a}x+${b} = ${a}\\left(x-${centre}\\right)$, so the centre is $x=${centre}$.`, err: 'setup' },
            { t: `$R=0$; converges only at $x=0$`, why: `Right radius, wrong centre. Solve $${a}x+${b}=0$ to get $x=${centre}$.`, err: 'setup' },
          ]),
        ],
        hint: 'A factorial in the numerator is the signal for radius $0$. Then the only question is which single point survives.',
        steps: [
          `Ratio Test: $\\displaystyle\\lim_{n\\to\\infty}\\left|\\frac{(n+1)!\\,(${a}x+${b})^{n+1}}{n!\\,(${a}x+${b})^{n}}\\right| = \\lim_{n\\to\\infty}(n+1)\\left|${a}x+${b}\\right|$.`,
          `That limit is $\\infty$ for every $x$ with $${a}x+${b}\\neq0$ — so the series diverges everywhere except where the bracket vanishes.`,
          `Solve $${a}x+${b}=0$: $x = ${centre}$.`,
          `So $R=0$ and the series converges only at its centre $x=${centre}$.`,
        ],
        recall: 'Factorial in the numerator $\\Rightarrow R=0$. Factorial in the denominator $\\Rightarrow R=\\infty$.',
        fix: `Always factor a coefficient off the variable: $${a}x+${b} = ${a}\\left(x-${centre}\\right)$ shows the centre immediately.`,
      };
    }
    const key = `$R=\\infty$; converges on $(-\\infty,\\infty)$`;
    return {
      prompt: `Find the radius and interval of convergence of $\\displaystyle\\sum_{n=0}^{\\infty}\\frac{(x-${b})^{n}}{n!\\,${a}^{n}}$.`,
      choices: [
        { t: key, ok: true },
        ...choose(key, [
          { t: `$R=${a}$; converges on $(${b - a}, ${b + a})$`, why: `The $${a}^{n}$ would give radius $${a}$ on its own, but the $n!$ overwhelms it — the ratio carries a $\\frac{1}{n+1}$ that drives the limit to $0$ for every $x$.`, err: 'setup' },
          { t: `$R=0$; converges only at $x=${b}$`, why: 'That is the case for a factorial in the **numerator**. Here it is in the denominator, which makes the terms shrink faster than any power grows.', err: 'formula-confusion' },
          { t: `$R=1$; converges on $(${b - 1}, ${b + 1})$`, why: 'Radius $1$ would need coefficients that neither grow nor shrink geometrically. The factorial changes everything.', err: 'setup' },
        ]),
      ],
      hint: 'Run the Ratio Test and watch what the $n!$ does to the limit.',
      steps: [
        `Ratio Test: $\\displaystyle\\lim_{n\\to\\infty}\\left|\\frac{(x-${b})^{n+1}}{(n+1)!\\,${a}^{n+1}}\\cdot\\frac{n!\\,${a}^{n}}{(x-${b})^{n}}\\right| = \\lim_{n\\to\\infty}\\frac{|x-${b}|}{${a}(n+1)}$.`,
        `That limit is $0$ for every real $x$, since $n+1\\to\\infty$.`,
        `$0<1$ always, so the series converges absolutely for all $x$: $R=\\infty$.`,
        `Interval of convergence: $(-\\infty,\\infty)$ — no endpoints to check.`,
      ],
      recall: 'A factorial in the denominator beats every exponential and every power. Radius is always $\\infty$.',
    };
  },
});

// ---- Q6: summing a numeric series from a known Maclaurin form ------
G.push({
  id: 'gt-sum-known', unit: 'series', topic: 'Applications of Series', diff: 3,
  src: 'his Exam 3 Q6 / final — "compute Σ 3^n/n!"',
  make(r) {
    const kind = r.pick(['exp', 'cos', 'sin', 'geom']);
    if (kind === 'exp') {
      const a = r.int(2, 5);
      const key = `$e^{${a}}$`;
      return {
        prompt: `Compute $\\displaystyle\\sum_{n=0}^{\\infty}\\frac{${a}^{n}}{n!}$.`,
        choices: [
          { t: key, ok: true },
          ...choose(key, [
            { t: `$${a}e$`, why: `The $${a}$ is raised to the $n$, so it is the **value of $x$**, not a constant multiplier. Match against $e^{x}=\\sum\\frac{x^{n}}{n!}$.`, err: 'formula-confusion' },
            { t: `$e^{${frac(1, a)}}$`, why: `You inverted $x$. The term is $\\frac{${a}^{n}}{n!}$, so $x^{n}=${a}^{n}$ and $x=${a}$ — not $\\frac{1}{${a}}$.`, err: 'formula-confusion' },
            { t: `$e^{${a}}-1$`, why: 'The sum starts at $n=0$, so the $1$ from the $n=0$ term is included. Subtract it only if the sum starts at $n=1$.', err: 'off-by-one' },
            { t: `$\\dfrac{1}{1-${a}}$`, why: 'That is the geometric sum. The $n!$ in the denominator makes this exponential, not geometric.', err: 'formula-confusion' },
          ]),
        ],
        hint: 'Match the term against a known Maclaurin series and read off $x$.',
        steps: [
          `$e^{x} = \\displaystyle\\sum_{n=0}^{\\infty}\\frac{x^{n}}{n!}$, valid for all $x$.`,
          `Compare: $\\frac{${a}^{n}}{n!}$ against $\\frac{x^{n}}{n!}$ gives $x=${a}$.`,
          `The index starts at $n=0$ in both, so nothing needs adjusting.`,
          `Sum $= e^{${a}}$.`,
        ],
        recall: 'Plain $n!$ in the denominator is always $e^{x}$. Read $x$ off the numerator.',
        fix: 'Check the starting index matches the standard series before writing the answer.',
      };
    }
    if (kind === 'geom') {
      const num = r.int(2, 6), dn = r.int(num + 1, 9);
      const key = `$${frac(num, dn - num)}$`;
      return {
        prompt: `Compute $\\displaystyle\\sum_{n=1}^{\\infty}\\left(\\frac{${num}}{${dn}}\\right)^{n}$.`,
        choices: [
          { t: key, ok: true },
          ...choose(key, [
            { t: `$${frac(dn, dn - num)}$`, why: `That is $\\frac{1}{1-r}$, the sum starting at $n=0$. This one starts at $n=1$, so the answer is $\\frac{a}{1-r}$ with first term $a=\\frac{${num}}{${dn}}$.`, err: 'off-by-one' },
            { t: `$${frac(num, dn)}$`, why: 'That is just the first term. A convergent geometric series sums to $\\frac{\\text{first term}}{1-r}$.', err: 'formula-confusion' },
            { t: '$\\infty$ (diverges)', why: `$|r| = \\frac{${num}}{${dn}} < 1$, so it converges. Geometric series diverge only when $|r|\\geq1$.`, err: 'test-logic' },
            { t: `$${frac(dn - num, num)}$`, why: 'The fraction is upside down. $\\frac{a}{1-r}$ has the first term on top.', err: 'formula-confusion' },
          ]),
        ],
        hint: 'Geometric starting at $n=1$: the sum is $\\frac{\\text{first term}}{1-r}$, and the first term is not $1$.',
        steps: [
          `Geometric with $r=\\frac{${num}}{${dn}}$, $|r|<1$, so it converges.`,
          `Starting at $n=1$, the first term is $a = \\frac{${num}}{${dn}}$.`,
          `Sum $= \\dfrac{a}{1-r} = \\dfrac{${num}/${dn}}{1-${num}/${dn}} = \\dfrac{${num}}{${dn}-${num}} = ${frac(num, dn - num)}$.`,
        ],
        recall: '$\\sum_{n=0}^{\\infty}r^{n} = \\frac{1}{1-r}$ but $\\sum_{n=1}^{\\infty}r^{n} = \\frac{r}{1-r}$. The starting index changes the numerator.',
        fix: 'Write down the first term explicitly before using $\\frac{a}{1-r}$.',
      };
    }
    // cos / sin evaluated at a nice angle
    const isCos = kind === 'cos';
    const ang = r.pick(isCos ? ['\\pi', '2\\pi'] : ['\\pi', '\\dfrac{\\pi}{2}']);
    const val = isCos ? (ang === '\\pi' ? '-1' : '1') : (ang === '\\pi' ? '0' : '1');
    const body = isCos
      ? `(-1)^{n}\\dfrac{\\left(${ang}\\right)^{2n}}{(2n)!}`
      : `(-1)^{n}\\dfrac{\\left(${ang}\\right)^{2n+1}}{(2n+1)!}`;
    const key = `$${val}$`;
    return {
      prompt: `Compute $\\displaystyle\\sum_{n=0}^{\\infty}${body}$.`,
      choices: [
        { t: key, ok: true },
        ...choose(key, [
          { t: isCos ? `$\\sin\\left(${ang}\\right)$ evaluated wrongly — $${val === '0' ? '1' : '0'}$` : `$${val === '0' ? '1' : '0'}$`, why: `Even powers with $(2n)!$ is **cosine**; odd powers with $(2n+1)!$ is **sine**. Check which pattern the exponent follows.`, err: 'formula-confusion' },
          { t: `$e^{${ang}}$`, why: 'A plain $n!$ with no alternating sign would be $e^{x}$. The $(-1)^{n}$ and the doubled index mark this as a trig series.', err: 'formula-confusion' },
          { t: `$${ang}$`, why: 'You read off $x$ but forgot to apply the function. The sum equals $f(x)$, not $x$.' },
          { t: '$\\infty$ (diverges)', why: 'The factorial denominator guarantees convergence for every $x$ — sine and cosine series converge on the whole real line.', err: 'test-logic' },
        ]),
      ],
      hint: `Even powers and $(2n)!$ mean cosine; odd powers and $(2n+1)!$ mean sine. Read off $x$ and evaluate.`,
      steps: [
        isCos
          ? `$\\cos x = \\displaystyle\\sum_{n=0}^{\\infty}(-1)^{n}\\frac{x^{2n}}{(2n)!}$ — even powers, $(2n)!$.`
          : `$\\sin x = \\displaystyle\\sum_{n=0}^{\\infty}(-1)^{n}\\frac{x^{2n+1}}{(2n+1)!}$ — odd powers, $(2n+1)!$.`,
        `Matching the exponent gives $x = ${ang}$.`,
        `So the sum is $${isCos ? '\\cos' : '\\sin'}\\left(${ang}\\right) = ${val}$.`,
      ],
      recall: '$(2n)!$ + even powers = cosine. $(2n+1)!$ + odd powers = sine. Plain $n!$ = $e^{x}$.',
    };
  },
});

// ---- Q2: a Taylor series derived from scratch ----------------------
P.push({
  id: 't-scratch-3x2', unit: 'series', topic: 'Taylor & Maclaurin Series', diff: 5,
  src: 'his Fall 2025 Exam 3 Q2 (16 points)',
  prompt: 'Find the Taylor series for $f(x)=\\dfrac{3}{x^{2}}$ centred at $x=-1$, deriving it from scratch (you may not quote a known series).',
  choices: [
    { t: '$\\displaystyle\\sum_{n=0}^{\\infty} 3(n+1)(x+1)^{n}$', ok: true },
    { t: '$\\displaystyle\\sum_{n=0}^{\\infty} 3(-1)^{n}(n+1)(x+1)^{n}$', why: 'An extra alternating factor. The derivatives of $3x^{-2}$ at $x=-1$ carry two competing signs — from the falling factorial and from the odd power of $-1$ — and they cancel. Work out $f(-1), f\'(-1), f\'\'(-1)$ numerically and you get $3, 6, 9$: all positive.', err: 'sign' },
    { t: '$\\displaystyle\\sum_{n=0}^{\\infty} \\dfrac{3(n+1)}{n!}(x+1)^{n}$', why: 'You forgot to divide by $n!$ — or rather, you left it in. $f^{(n)}(-1) = 3(n+1)!$, so $\\frac{f^{(n)}(-1)}{n!} = \\frac{3(n+1)!}{n!} = 3(n+1)$. The factorials cancel.', err: 'formula-confusion' },
    { t: '$\\displaystyle\\sum_{n=0}^{\\infty} 3(n+1)(x-1)^{n}$', why: 'The centre is $x=-1$, so the powers must be $(x-(-1))^{n} = (x+1)^{n}$. A sign slip here invalidates the whole series.', err: 'sign' },
  ],
  keyWhy: 'Differentiating $3x^{-2}$ repeatedly gives $f^{(n)}(x) = 3(-1)^{n}(n+1)!\\,x^{-(n+2)}$. At $x=-1$: $x^{-(n+2)} = (-1)^{n+2} = (-1)^{n}$, so the two sign factors multiply to $(-1)^{2n}=1$ and $f^{(n)}(-1) = 3(n+1)!$. Dividing by $n!$ leaves $3(n+1)$.',
  hints: [
    'Start from the definition — you are not allowed to quote $\\frac{1}{1-x}$ here.',
    'Compute $f(-1), f\'(-1), f\'\'(-1), f\'\'\'(-1)$ as actual numbers and look for the pattern.',
    'They come out $3, 6, 18, 72$ — that is $3\\cdot1!, 3\\cdot2!, 3\\cdot3!, 3\\cdot4!$, i.e. $f^{(n)}(-1) = 3(n+1)!$.',
    'Now divide by $n!$: $\\frac{3(n+1)!}{n!} = 3(n+1)$.',
  ],
  steps: [
    'Taylor series centred at $c$: $\\displaystyle\\sum_{n=0}^{\\infty}\\frac{f^{(n)}(c)}{n!}(x-c)^{n}$, and here $c=-1$ so the powers are $(x+1)^{n}$.',
    'Differentiate: $f(x)=3x^{-2}$, $f\'(x)=-6x^{-3}$, $f\'\'(x)=18x^{-4}$, $f\'\'\'(x)=-72x^{-5}$. In general $f^{(n)}(x)=3(-1)^{n}(n+1)!\\,x^{-(n+2)}$.',
    'Evaluate at $x=-1$: $(-1)^{-(n+2)} = (-1)^{n+2} = (-1)^{n}$, so $f^{(n)}(-1) = 3(-1)^{n}(n+1)!(-1)^{n} = 3(n+1)!$ — the signs cancel.',
    'Divide by $n!$: $\\dfrac{f^{(n)}(-1)}{n!} = \\dfrac{3(n+1)!}{n!} = 3(n+1)$.',
    'So $\\dfrac{3}{x^{2}} = \\displaystyle\\sum_{n=0}^{\\infty}3(n+1)(x+1)^{n}$.',
  ],
  recall: 'From scratch means: differentiate several times, evaluate every one at the centre, spot the pattern, divide by $n!$. The factorials usually cancel.',
  fix: 'Compute four derivatives as numbers before guessing a pattern. Three is not enough to see it.',
});

// ---- Q6: Taylor polynomial and remainder bound ---------------------
G.push({
  id: 'gt-remainder', unit: 'series', topic: 'Taylor Polynomials & Error', diff: 4,
  src: 'his Exam 3 Q7 / spring25 final — "largest possible error using T_2 on (-1,1)"',
  make(r) {
    const n = r.int(2, 4);
    const nf = [1, 1, 2, 6, 24, 120][n + 1];
    const key = `$\\dfrac{e}{${nf}}$`;
    return {
      prompt: `Let $T_{${n}}(x)$ be the degree-$${n}$ Taylor polynomial for $f(x)=e^{x}$ centred at $x=0$. Using $T_{${n}}$ to approximate $f$ on $(-1,1)$, what is the largest possible error?`,
      choices: [
        { t: key, ok: true },
        ...choose(key, [
          { t: `$\\dfrac{1}{${nf}}$`, why: `You evaluated $f^{(${n + 1})}$ at the **centre** instead of bounding it. The remainder uses $f^{(${n + 1})}(z)$ for an unknown $z$ between $x$ and $0$; the largest $e^{z}$ can be on $(-1,1)$ is $e^{1}=e$.`, err: 'formula-confusion' },
          { t: `$\\dfrac{e}{${[1, 1, 2, 6, 24, 120][n]}}$`, why: `Off by one in the factorial. The degree-$${n}$ remainder uses $(n+1)! = ${n + 1}! = ${nf}$, not $${n}!$.`, err: 'off-by-one' },
          { t: `$\\dfrac{e}{${nf}}\\cdot ${n + 1}$`, why: 'No extra factor belongs here. The remainder is $\\frac{f^{(n+1)}(z)}{(n+1)!}x^{n+1}$ — one derivative over one factorial.', err: 'formula-confusion' },
          { t: '$0$', why: 'The error is zero only at the centre itself. Across an interval it is strictly positive.', err: 'test-logic' },
        ]),
      ],
      hint: `Write the Lagrange remainder $R_{${n}}(x) = \\frac{f^{(${n + 1})}(z)}{${n + 1}!}x^{${n + 1}}$, then bound each piece separately over $(-1,1)$.`,
      steps: [
        `Lagrange remainder: $R_{${n}}(x) = \\dfrac{f^{(${n + 1})}(z)}{(${n}+1)!}\\,x^{${n + 1}}$ for some $z$ strictly between $x$ and $0$.`,
        `Every derivative of $e^{x}$ is $e^{x}$, so $f^{(${n + 1})}(z) = e^{z}$.`,
        `Bound the pieces on $(-1,1)$: $|z|<1$ gives $e^{z} < e$, and $|x|<1$ gives $|x|^{${n + 1}} < 1$.`,
        `So $|R_{${n}}(x)| < \\dfrac{e\\cdot1}{${nf}} = \\dfrac{e}{${nf}}$.`,
      ],
      recall: 'Remainder = (next derivative at an unknown $z$) / $(n+1)!$ $\\times (x-c)^{n+1}$. You **bound** the derivative over the interval; you never evaluate it at the centre.',
      fix: 'Bound $f^{(n+1)}$ and $|x-c|^{n+1}$ as two separate maximisations, then multiply.',
    };
  },
});

export const taylor = { unit: 'series', problems: P, generators: G };
