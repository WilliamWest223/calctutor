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

// ---- deepening: Taylor from scratch, T_n, Lagrange, alternating error, series apps ----
const R = String.raw;
/** Compact static builder: wrong = [[tex, why, err], ...]. Exported for mock3.js. */
export function mk(o) {
  const P2 = {
    unit: 'series', topic: o.topic, diff: o.diff, src: o.src, prompt: o.prompt,
    choices: [{ t: o.key, ok: true }, ...o.wrong.map(([t, why, err]) => ({ t, why, err }))],
    keyWhy: o.keyWhy, hints: o.hints, steps: o.steps, recall: o.recall,
  };
  if (o.fix) P2.fix = o.fix;
  return { id: o.id, ...P2 };
}
const TM = 'Taylor & Maclaurin Series', TP = 'Taylor Polynomials & Error', AP = 'Applications of Series';

P.push(mk({
  id: 't-tay-ln-c1', topic: TM, diff: 4, src: 'Exam 3 Q2 style — from scratch, centre 1',
  prompt: R`Derive the Taylor series for $f(x)=\ln x$ centred at $x=1$ from the definition.`,
  key: R`$\displaystyle\sum_{n=1}^{\infty}\frac{(-1)^{n+1}}{n}(x-1)^{n}$`,
  wrong: [
    [R`$\displaystyle\sum_{n=1}^{\infty}\frac{(-1)^{n+1}}{n!}(x-1)^{n}$`, R`$f^{(n)}(1)=(-1)^{n+1}(n-1)!$, so dividing by $n!$ leaves $\frac1n$, not $\frac1{n!}$. The factorial cancels down to a single $n$.`, 'formula-confusion'],
    [R`$\displaystyle\sum_{n=1}^{\infty}\frac{(-1)^{n+1}}{n}x^{n}$`, R`That is the Maclaurin series of $\ln(1+x)$. Here the centre is $1$, so every power must be $(x-1)^{n}$.`, 'setup'],
    [R`$\displaystyle\sum_{n=1}^{\infty}\frac{1}{n}(x-1)^{n}$`, R`The signs alternate: $f'(1)=1,\ f''(1)=-1,\ f'''(1)=2,\dots$ Compute a few derivatives as numbers and watch the sign.`, 'sign'],
    [R`$\displaystyle\sum_{n=1}^{\infty}\frac{(-1)^{n+1}}{n}(x+1)^{n}$`, R`Powers are $(x-c)^n$ with $c=1$, so $(x-1)^n$. $(x+1)$ would mean centre $-1$.`, 'sign'],
  ],
  keyWhy: R`$f(1)=0$ and $f^{(n)}(x)=(-1)^{n+1}(n-1)!\,x^{-n}$, so $f^{(n)}(1)/n!=(-1)^{n+1}/n$.`,
  hints: [R`Differentiate $\ln x$ four times and evaluate each at $x=1$.`, R`You get $0,\ 1,\ -1,\ 2,\ -6$: the $n$th is $\pm(n-1)!$.`],
  steps: [R`$f=\ln x,\ f'=x^{-1},\ f''=-x^{-2},\ f'''=2x^{-3},\ f^{(4)}=-6x^{-4}$.`, R`At $x=1$: $0,\ 1,\ -1,\ 2,\ -6$, i.e. $f^{(n)}(1)=(-1)^{n+1}(n-1)!$ for $n\ge1$.`, R`Divide by $n!$: $\frac{(-1)^{n+1}(n-1)!}{n!}=\frac{(-1)^{n+1}}{n}$.`, R`$\ln x=\displaystyle\sum_{n=1}^{\infty}\frac{(-1)^{n+1}}{n}(x-1)^{n}$ (the $n=0$ term is $f(1)=0$).`],
  recall: R`$\ln x$ about $1$ is just $\ln(1+u)$ with $u=x-1$. The constant term is $0$, so the sum starts at $n=1$.`,
}));

P.push(mk({
  id: 't-tay-exp-c2', topic: TM, diff: 3, src: 'Exam 3 Q2 style — e^x at a nonzero centre',
  prompt: R`Find the Taylor series for $f(x)=e^{x}$ centred at $x=2$.`,
  key: R`$\displaystyle\sum_{n=0}^{\infty}\frac{e^{2}}{n!}(x-2)^{n}$`,
  wrong: [
    [R`$\displaystyle\sum_{n=0}^{\infty}\frac{1}{n!}(x-2)^{n}$`, R`You used $f^{(n)}(0)=1$. The coefficients are $f^{(n)}(2)/n!$ and every derivative of $e^x$ at $2$ is $e^{2}$, not $1$.`, 'setup'],
    [R`$\displaystyle\sum_{n=0}^{\infty}\frac{e^{2}}{n!}x^{n}$`, R`The powers must be $(x-2)^n$ for centre $2$.`, 'setup'],
    [R`$\displaystyle\sum_{n=0}^{\infty}e^{2}(x-2)^{n}$`, R`The $n!$ was dropped. Taylor coefficients are $\frac{f^{(n)}(c)}{n!}$.`, 'dropped-factor'],
    [R`$\displaystyle\sum_{n=0}^{\infty}\frac{e^{2}}{n!}(x+2)^{n}$`, R`$(x+2)$ means centre $-2$. Use $(x-c)=(x-2)$.`, 'sign'],
  ],
  keyWhy: R`Every derivative of $e^{x}$ is $e^{x}$, so $f^{(n)}(2)=e^{2}$ for all $n$.`,
  hints: [R`What is $f^{(n)}(x)$ for $e^x$? Then plug in $x=2$.`],
  steps: [R`$f^{(n)}(x)=e^{x}$ for every $n$, so $f^{(n)}(2)=e^{2}$.`, R`Coefficient: $\frac{f^{(n)}(2)}{n!}=\frac{e^{2}}{n!}$.`, R`Series: $\displaystyle\sum_{n=0}^{\infty}\frac{e^{2}}{n!}(x-2)^{n}$.`],
  recall: R`Off-centre $e^x$: coefficient is $e^{c}/n!$, power is $(x-c)^n$. Shortcut: $e^{x}=e^{2}e^{x-2}$.`,
}));

P.push(mk({
  id: 't-tay-sin-pi2', topic: TM, diff: 4, src: 'Exam 3 Q2 style — sin x at pi/2',
  prompt: R`Find the Taylor series for $f(x)=\sin x$ centred at $x=\dfrac{\pi}{2}$.`,
  key: R`$\displaystyle\sum_{n=0}^{\infty}\frac{(-1)^{n}}{(2n)!}\left(x-\frac{\pi}{2}\right)^{2n}$`,
  wrong: [
    [R`$\displaystyle\sum_{n=0}^{\infty}\frac{(-1)^{n}}{(2n+1)!}\left(x-\frac{\pi}{2}\right)^{2n+1}$`, R`That is $\sin x$ about $0$ with $x$ shifted. At $\frac\pi2$, $\sin=1$ is the constant term and the odd derivatives ($\cos$) vanish, so only **even** powers survive.`, 'formula-confusion'],
    [R`$\displaystyle\sum_{n=0}^{\infty}\frac{1}{(2n)!}\left(x-\frac{\pi}{2}\right)^{2n}$`, R`Signs alternate: $f''=-\sin\to-1$, $f^{(4)}=\sin\to+1$.`, 'sign'],
    [R`$\displaystyle\sum_{n=0}^{\infty}\frac{(-1)^{n}}{(2n)!}\left(x+\frac{\pi}{2}\right)^{2n}$`, R`Centre is $+\frac\pi2$, so the base is $x-\frac\pi2$.`, 'sign'],
    [R`$\displaystyle\sum_{n=0}^{\infty}\frac{(-1)^{n}}{(2n)!}x^{2n}$`, R`That is $\cos x$ about $0$ -- the same shape, but the problem asks about the centre $\frac\pi2$.`, 'setup'],
  ],
  keyWhy: R`$\sin x=\cos\!\left(x-\frac\pi2\right)$, and the cosine series in $u=x-\frac\pi2$ is $\sum(-1)^n u^{2n}/(2n)!$.`,
  hints: [R`Evaluate $\sin,\cos,-\sin,-\cos$ at $\frac\pi2$: $1,0,-1,0,1,\dots$`],
  steps: [R`$f(\tfrac\pi2)=1,\ f'(\tfrac\pi2)=0,\ f''(\tfrac\pi2)=-1,\ f'''(\tfrac\pi2)=0,\ f^{(4)}(\tfrac\pi2)=1$.`, R`Only even $n=2k$ survive, with sign $(-1)^k$, giving $\frac{(-1)^k}{(2k)!}(x-\frac\pi2)^{2k}$.`],
  recall: R`Cycle of derivatives at the centre decides which powers survive. Check with $\sin x=\cos(x-\frac\pi2)$.`,
}));

P.push(mk({
  id: 't-tay-inv-c2', topic: TM, diff: 4, src: 'Exam 3 Q2 style — geometric trick off-centre',
  prompt: R`Find the Taylor series for $f(x)=\dfrac1x$ centred at $x=2$.`,
  key: R`$\displaystyle\sum_{n=0}^{\infty}\frac{(-1)^{n}}{2^{n+1}}(x-2)^{n}$`,
  wrong: [
    [R`$\displaystyle\sum_{n=0}^{\infty}\frac{(-1)^{n}}{2^{n}}(x-2)^{n}$`, R`Off by one power of $2$: $\frac1x=\frac12\cdot\frac{1}{1+u/2}$ keeps a leading $\frac12$, so the denominator is $2^{n+1}$. Check $f(2)=\frac12$.`, 'off-by-one'],
    [R`$\displaystyle\sum_{n=0}^{\infty}\frac{1}{2^{n+1}}(x-2)^{n}$`, R`Signs alternate since $f'(2)=-\frac14$.`, 'sign'],
    [R`$\displaystyle\sum_{n=0}^{\infty}(-1)^{n}(x-2)^{n}$`, R`That drops the $\frac{1}{2^{n+1}}$ scaling (centre-$1$ coefficients with the centre-$2$ powers). Check $f(2)=\frac12$.`, 'setup'],
    [R`$\displaystyle\sum_{n=0}^{\infty}\frac{(-1)^{n}}{2^{n+1}}x^{n}$`, R`Powers must be $(x-2)^n$.`, 'setup'],
  ],
  keyWhy: R`$\frac1x=\frac{1}{2+(x-2)}=\frac{1/2}{1+\frac{x-2}{2}}=\frac12\sum\left(-\frac{x-2}{2}\right)^{n}$.`,
  hints: [R`Write $x=2+(x-2)$, factor out the $2$, and aim for $\frac{1}{1-r}$.`],
  steps: [R`$\frac1x=\frac{1}{2+(x-2)}=\frac12\cdot\frac{1}{1+\frac{x-2}{2}}$.`, R`With $r=-\frac{x-2}{2}$: $\frac12\sum_{n\ge0}\left(-\frac{x-2}{2}\right)^{n}=\sum\frac{(-1)^{n}(x-2)^{n}}{2^{n+1}}$.`, R`Check: $f(2)=\frac12$, $f'(2)=-\frac14$ matches $n=0,1$.`],
  recall: R`Off-centre geometric: factor so the denominator is $c\,[1-(\text{stuff})]$ with stuff $\propto(x-c)$. Always sanity-check $f(c)$.`,
}));

P.push(mk({
  id: 't-poly-sqrt4', topic: TP, diff: 3, src: 'Exam 3 Q7 style — T_2 at a nonzero centre',
  prompt: R`Find the degree-2 Taylor polynomial $T_2(x)$ for $f(x)=\sqrt{x}$ centred at $x=4$.`,
  key: R`$2+\dfrac{x-4}{4}-\dfrac{(x-4)^{2}}{64}$`,
  wrong: [
    [R`$2+\dfrac{x-4}{4}-\dfrac{(x-4)^{2}}{32}$`, R`$f''(4)=-\frac1{32}$ but the term needs $\frac{f''(4)}{2!}=-\frac1{64}$. You forgot to divide by $2!$.`, 'dropped-factor'],
    [R`$2+\dfrac{x-4}{4}+\dfrac{(x-4)^{2}}{64}$`, R`$f''(x)=-\frac14x^{-3/2}<0$, so the quadratic coefficient is negative.`, 'sign'],
    [R`$2+\dfrac{x-4}{2}-\dfrac{(x-4)^{2}}{16}$`, R`$f'(x)=\frac{1}{2\sqrt x}$ and $f'(4)=\frac14$, not $\frac12$.`, 'algebra-slip'],
    [R`$2+\dfrac{x}{4}-\dfrac{x^{2}}{64}$`, R`Powers must be $(x-4)$, not $x$.`, 'setup'],
  ],
  keyWhy: R`$f(4)=2,\ f'(4)=\frac14,\ f''(4)=-\frac1{32}$; divide the last by $2!$.`,
  hints: [R`$f'=\frac12x^{-1/2},\ f''=-\frac14x^{-3/2}$.`],
  steps: [R`$f(4)=2$.`, R`$f'(x)=\tfrac12x^{-1/2}\Rightarrow f'(4)=\tfrac14$.`, R`$f''(x)=-\tfrac14x^{-3/2}\Rightarrow f''(4)=-\tfrac1{32}$.`, R`$T_2=2+\frac14(x-4)+\frac{-1/32}{2!}(x-4)^{2}$.`],
  recall: R`$T_n=\sum_{k\le n}\frac{f^{(k)}(c)}{k!}(x-c)^k$. Write each derivative as a number before dividing by $k!$.`,
}));

P.push(mk({
  id: 't-lagr-sin-t3', topic: TP, diff: 4, src: 'Exam 3 Q7 style — Taylor Remainder Theorem bound',
  prompt: R`Use $T_3(x)$ for $\sin x$ about $0$ to approximate $\sin x$ on $|x|\le 2$. What is the best bound from the Taylor Remainder Theorem on the error?`,
  key: R`$\dfrac{2}{3}$`,
  wrong: [
    [R`$\dfrac{8}{3}$`, R`You used $3!$. For $T_3$ the remainder involves $f^{(4)}$ and $(3+1)!=4!=24$.`, 'off-by-one'],
    [R`$\dfrac{1}{24}$`, R`You dropped $|x|^{4}$. On $|x|\le2$ it is as large as $2^{4}=16$.`, 'dropped-factor'],
    [R`$\dfrac{4}{15}$`, R`$\frac{2^5}{5!}$ is one factorial too far; the remainder after $T_3$ uses $(n+1)!=4!$.`, 'off-by-one'],
    [R`$0$`, R`$T_3$ is not exact on an interval; the error vanishes only at the centre.`, 'conceptual'],
  ],
  keyWhy: R`$|R_3|\le\frac{M|x|^{4}}{4!}$ with $M=1$ (since $|f^{(4)}|=|\sin|\le1$) and $|x|^4\le16$: $\frac{16}{24}=\frac23$.`,
  hints: [R`$f^{(4)}(x)=\sin x$. Bound it by $M$, then bound $|x|^{4}$.`],
  steps: [R`$|R_3(x)|\le\frac{M}{4!}|x|^{4}$ where $M\ge|f^{(4)}|=|\sin z|$, so $M=1$.`, R`On $|x|\le2$: $|x|^4\le16$.`, R`Bound $=\frac{16}{24}=\frac23$.`],
  recall: R`Degree $n$ means derivative $n+1$ and $(n+1)!$. Bound the derivative and the power separately.`,
}));

P.push(mk({
  id: 't-alt-nterms', topic: 'Alternating Series & Error', diff: 3, src: 'Exam 3 style — alternating series error',
  prompt: R`Approximate $\displaystyle\sum_{n=1}^{\infty}\frac{(-1)^{n+1}}{n^{2}}$ by a partial sum $S_N$. What is the smallest $N$ guaranteeing error less than $\frac{1}{1000}$?`,
  key: R`$N=31$`,
  wrong: [
    [R`$N=32$`, R`That uses $b_N<\frac1{1000}$. The error of $S_N$ is bounded by the first **omitted** term $b_{N+1}$, so $N+1\ge32$ gives $N=31$.`, 'off-by-one'],
    [R`$N=1000$`, R`You dropped the square. $b_{N+1}=\frac1{(N+1)^2}$, so $(N+1)^2>1000$ is enough.`, 'dropped-factor'],
    [R`$N=100$`, R`$N=100$ works (error $<\frac1{10000}$), but the question asks for the smallest $N$.`, 'conceptual'],
    [R`$N=30$`, R`$N=30$ gives $b_{31}=\frac1{961}>\frac1{1000}$, so it is too small.`, 'off-by-one'],
  ],
  keyWhy: R`Need $\frac1{(N+1)^2}<\frac1{1000}$, i.e. $(N+1)^2>1000$. $31^2=961<1000<1024=32^2$, so $N+1\ge32$.`,
  hints: [R`Error $\le b_{N+1}$, the first term you left out.`],
  steps: [R`Alternating series error: $|S-S_N|\le b_{N+1}=\frac1{(N+1)^2}$.`, R`Solve $(N+1)^2>1000$: $N+1\ge32$.`, R`Smallest $N=31$.`],
  recall: R`Alternating series error is the first omitted term -- so test $b_{N+1}$, not $b_N$.`,
}));

P.push(mk({
  id: 't-app-limit', topic: AP, diff: 3, src: 'Exam 3 style — limit via Maclaurin series',
  prompt: R`Use a Maclaurin series to evaluate $\displaystyle\lim_{x\to0}\frac{x-\sin x}{x^{3}}$.`,
  key: R`$\dfrac{1}{6}$`,
  wrong: [
    [R`$-\dfrac{1}{6}$`, R`Sign: $x-\sin x=+\frac{x^3}{3!}-\dots$. Distribute the minus on the whole $\sin x$ series.`, 'sign'],
    [R`$\dfrac{1}{3}$`, R`The cubic term of $\sin x$ is $\frac{x^3}{3!}=\frac{x^3}{6}$, not $\frac{x^3}{3}$.`, 'formula-confusion'],
    [R`$0$`, R`The $x$'s cancel but the $x^3$ term survives, and the denominator is also $x^3$.`, 'conceptual'],
    [R`$1$`, R`Not $1$: that is $\lim\frac{\sin x}{x}$. The numerator starts at $x^{3}$ with coefficient $\frac16$.`, 'conceptual'],
  ],
  keyWhy: R`$x-\sin x=\frac{x^{3}}{6}-\frac{x^{5}}{120}+\cdots$; divide by $x^3$ and let $x\to0$.`,
  hints: [R`Substitute $\sin x=x-\frac{x^3}{3!}+\frac{x^5}{5!}-\cdots$`],
  steps: [R`$x-\sin x=x-\left(x-\frac{x^{3}}{6}+\frac{x^{5}}{120}-\cdots\right)=\frac{x^{3}}{6}-\frac{x^{5}}{120}+\cdots$`, R`Divide by $x^3$: $\frac16-\frac{x^{2}}{120}+\cdots\to\frac16$.`],
  recall: R`Series limits: expand, cancel the leading terms, divide by the lowest power left.`,
}));

P.push(mk({
  id: 't-app-integral', topic: AP, diff: 3, src: 'Exam 3 style — integrate a series term by term',
  prompt: R`Find the first two nonzero terms of the Maclaurin series for $\displaystyle\int\sin(x^{2})\,dx$ (take $C=0$).`,
  key: R`$\dfrac{x^{3}}{3}-\dfrac{x^{7}}{42}$`,
  wrong: [
    [R`$\dfrac{x^{3}}{3}-\dfrac{x^{7}}{6}$`, R`You integrated the first term but forgot to integrate $-\frac{x^{6}}{6}$: it becomes $-\frac{x^{7}}{6\cdot7}=-\frac{x^7}{42}$.`, 'dropped-factor'],
    [R`$x^{2}-\dfrac{x^{6}}{6}$`, R`That is $\sin(x^2)$ itself, not its antiderivative.`, 'conceptual'],
    [R`$\dfrac{x^{3}}{3}-\dfrac{x^{7}}{7}$`, R`The $\frac{1}{3!}$ from the sine series was lost.`, 'formula-confusion'],
    [R`$\dfrac{x^{3}}{3}+\dfrac{x^{7}}{42}$`, R`The sine series alternates; the second term is negative.`, 'sign'],
  ],
  keyWhy: R`$\sin(x^2)=x^2-\frac{x^6}{6}+\cdots$; integrate term by term.`,
  hints: [R`Substitute $u=x^2$ into $\sin u$, then integrate each term.`],
  steps: [R`$\sin(x^{2})=x^{2}-\frac{x^{6}}{3!}+\cdots$`, R`$\int x^{2}=\frac{x^3}{3}$, $\int\frac{x^{6}}{6}=\frac{x^{7}}{42}$.`],
  recall: R`No elementary antiderivative? Expand, integrate term by term, and add $C$.`,
}));

P.push(mk({
  id: 't-app-binom', topic: AP, diff: 3, src: 'Exam 3 style — binomial series',
  prompt: R`Write the first three terms of the Maclaurin series for $\sqrt{1+x}$ using the binomial series.`,
  key: R`$1+\dfrac{x}{2}-\dfrac{x^{2}}{8}$`,
  wrong: [
    [R`$1+\dfrac{x}{2}+\dfrac{x^{2}}{8}$`, R`$\binom{1/2}{2}=\frac{(1/2)(-1/2)}{2}=-\frac18$ is negative.`, 'sign'],
    [R`$1+\dfrac{x}{2}-\dfrac{x^{2}}{4}$`, R`You forgot the $2!$: $\frac{(1/2)(-1/2)}{2!}=-\frac18$.`, 'dropped-factor'],
    [R`$1+x-\dfrac{x^{2}}{2}$`, R`The exponent is $\frac12$, so the linear coefficient is $\frac12$.`, 'formula-confusion'],
    [R`$1+\dfrac{x}{2}-\dfrac{x^{2}}{2}$`, R`Check: $\binom{1/2}{2}=\frac{\frac12\cdot(-\frac12)}{2}=-\frac18$.`, 'algebra-slip'],
  ],
  keyWhy: R`$(1+x)^{k}=1+kx+\frac{k(k-1)}{2!}x^{2}+\cdots$ with $k=\frac12$.`,
  hints: [R`$(1+x)^k=\sum\binom{k}{n}x^n$ with $k=\frac12$.`],
  steps: [R`$k=\frac12$: $kx=\frac x2$.`, R`$\frac{k(k-1)}{2!}=\frac{\frac12\cdot(-\frac12)}{2}=-\frac18$.`],
  recall: R`Binomial series: $1+kx+\frac{k(k-1)}{2!}x^2+\frac{k(k-1)(k-2)}{3!}x^3+\cdots$.`,
}));

P.push(mk({
  id: 't-app-sum-ln', topic: AP, diff: 4, src: 'Exam 3 Q5 style — sum by recognising ln(1+x)',
  prompt: R`Find the exact sum $\displaystyle\sum_{n=1}^{\infty}\frac{(-1)^{n+1}}{n\,2^{n}}$.`,
  key: R`$\ln\dfrac{3}{2}$`,
  wrong: [
    [R`$\ln 2$`, R`That is the sum at $x=1$. Here $\frac{1}{2^n}$ means $x=\frac12$.`, 'setup'],
    [R`$\ln\dfrac{1}{2}$`, R`$\ln(1+x)$ at $x=\frac12$ is $\ln\frac32$; $\ln\frac12$ would be $x=-\frac12$.`, 'sign'],
    [R`$\dfrac{1}{3}$`, R`That is geometric: $\frac{1/2}{1+1/2}$. The extra $\frac1n$ makes this a logarithm.`, 'formula-confusion'],
    [R`$\ln\dfrac{5}{2}$`, R`$1+x=1+\frac12=\frac32$, not $\frac52$.`, 'algebra-slip'],
  ],
  keyWhy: R`$\ln(1+x)=\sum_{n\ge1}\frac{(-1)^{n+1}x^{n}}{n}$ and $x=\frac12$ gives exactly this.`,
  hints: [R`Match to $\ln(1+x)$; $\frac1{2^n}=\left(\frac12\right)^{n}$.`],
  steps: [R`$\frac{(-1)^{n+1}}{n2^{n}}=\frac{(-1)^{n+1}(1/2)^{n}}{n}$.`, R`Sum $=\ln\left(1+\frac12\right)=\ln\frac32$.`],
  recall: R`Pull the $n$th power out, read off $x$, and name the series by its denominator ($n$ means log).`,
}));

// ---- G: T_2 of sqrt(x) at c=a^2 ----
G.push({
  id: 'gt-poly-sqrt', unit: 'series', topic: TP, diff: 3,
  src: 'Exam 3 Q7 style — Taylor polynomial at a nonzero centre',
  make(r) {
    const a = r.int(2, 5), c = a * a;
    const key = `$${a}+\\dfrac{x-${c}}{${2 * a}}-\\dfrac{(x-${c})^{2}}{${8 * a ** 3}}$`;
    return {
      prompt: `Find the degree-2 Taylor polynomial $T_2(x)$ for $f(x)=\\sqrt{x}$ centred at $x=${c}$.`,
      choices: [{ t: key, ok: true }, ...choose(key, [
        { t: `$${a}+\\dfrac{x-${c}}{${2 * a}}-\\dfrac{(x-${c})^{2}}{${4 * a ** 3}}$`, why: `$f''(${c})=-\\frac{1}{${4 * a ** 3}}$ but the term needs $\\frac{f''}{2!}=-\\frac{1}{${8 * a ** 3}}$. Divide by $2!$.`, err: 'dropped-factor' },
        { t: `$${a}+\\dfrac{x-${c}}{${2 * a}}+\\dfrac{(x-${c})^{2}}{${8 * a ** 3}}$`, why: '$f\'\'(x)=-\\frac14x^{-3/2}$ is negative, so the quadratic term is negative.', err: 'sign' },
        { t: `$${a}+\\dfrac{x-${c}}{${a}}-\\dfrac{(x-${c})^{2}}{${8 * a ** 3}}$`, why: `$f'(x)=\\frac{1}{2\\sqrt{x}}$ so $f'(${c})=\\frac{1}{${2 * a}}$, not $\\frac1{${a}}$.`, err: 'algebra-slip' },
        { t: `$${a}+\\dfrac{x}{${2 * a}}-\\dfrac{x^{2}}{${8 * a ** 3}}$`, why: `Powers must be $(x-${c})^n$ for centre $${c}$.`, err: 'setup' },
      ])],
      hint: `$f'=\\frac12x^{-1/2}$ and $f''=-\\frac14x^{-3/2}$; evaluate at $${c}$.`,
      steps: [`$f(${c})=${a}$.`, `$f'(${c})=\\frac{1}{2\\cdot${a}}=\\frac1{${2 * a}}$.`, `$f''(${c})=-\\frac14\\cdot\\frac{1}{${a ** 3}}=-\\frac1{${4 * a ** 3}}$, then divide by $2!$: $-\\frac1{${8 * a ** 3}}$.`],
      recall: '$T_n=\\sum\\frac{f^{(k)}(c)}{k!}(x-c)^k$. Always divide by $k!$.',
    };
  },
});

// ---- G: Taylor series from scratch at nonzero centre ----
G.push({
  id: 'gt-tay-scratch', unit: 'series', topic: TM, diff: 4,
  src: 'Exam 3 Q2 style — Taylor series from scratch',
  make(r) {
    if (r.pick(['inv', 'exp']) === 'inv') {
      const c = r.int(2, 5);
      const key = `$\\displaystyle\\sum_{n=0}^{\\infty}\\frac{(-1)^{n}}{${c}^{n+1}}(x-${c})^{n}$`;
      return {
        prompt: `Find the Taylor series for $f(x)=\\dfrac1x$ centred at $x=${c}$.`,
        choices: [{ t: key, ok: true }, ...choose(key, [
          { t: `$\\displaystyle\\sum_{n=0}^{\\infty}\\frac{(-1)^{n}}{${c}^{n}}(x-${c})^{n}$`, why: `Check $f(${c})=\\frac1{${c}}$: the $n=0$ term must be $\\frac{1}{${c}}$, so the denominator is $${c}^{n+1}$.`, err: 'off-by-one' },
          { t: `$\\displaystyle\\sum_{n=0}^{\\infty}\\frac{1}{${c}^{n+1}}(x-${c})^{n}$`, why: `Alternating: $f'(${c})=-\\frac1{${c * c}}<0$.`, err: 'sign' },
          { t: `$\\displaystyle\\sum_{n=0}^{\\infty}\\frac{(-1)^{n}}{${c}^{n+1}}(x+${c})^{n}$`, why: `Centre is $${c}$, so the base is $(x-${c})$.`, err: 'sign' },
          { t: `$\\displaystyle\\sum_{n=0}^{\\infty}\\frac{(-1)^{n}}{${c}^{n+1}}x^{n}$`, why: `Powers must be $(x-${c})^n$.`, err: 'setup' },
        ])],
        hint: `Write $x=${c}+(x-${c})$, factor out ${c}, aim for $\\frac{1}{1-r}$.`,
        steps: [`$\\frac1x=\\frac{1}{${c}\\left(1+\\frac{x-${c}}{${c}}\\right)}$.`, `Geometric with $r=-\\frac{x-${c}}{${c}}$: $\\frac1{${c}}\\sum\\left(-\\frac{x-${c}}{${c}}\\right)^{n}$.`, `Check $f(${c})=\\frac1{${c}}$.`],
        recall: 'Off-centre geometric: factor out $c$. Sanity-check $f(c)$.',
      };
    }
    const c = r.int(1, 3), k = r.int(2, 3);
    const key = `$\\displaystyle\\sum_{n=0}^{\\infty}\\frac{${k}^{n}e^{${k * c}}}{n!}(x-${c})^{n}$`;
    return {
      prompt: `Find the Taylor series for $f(x)=e^{${k}x}$ centred at $x=${c}$.`,
      choices: [{ t: key, ok: true }, ...choose(key, [
        { t: `$\\displaystyle\\sum_{n=0}^{\\infty}\\frac{e^{${k * c}}}{n!}(x-${c})^{n}$`, why: `Each derivative brings a factor ${k}: $f^{(n)}(x)=${k}^{n}e^{${k}x}$ (chain rule).`, err: 'chain-rule' },
        { t: `$\\displaystyle\\sum_{n=0}^{\\infty}\\frac{${k}^{n}e^{${k}}}{n!}(x-${c})^{n}$`, why: `$f(${c})=e^{${k}\\cdot${c}}=e^{${k * c}}$, not $e^{${k}}$.`, err: 'algebra-slip' },
        { t: `$\\displaystyle\\sum_{n=0}^{\\infty}\\frac{${k}^{n}e^{${k * c}}}{n!}x^{n}$`, why: `Powers must be $(x-${c})^n$.`, err: 'setup' },
        { t: `$\\displaystyle\\sum_{n=0}^{\\infty}${k}^{n}e^{${k * c}}(x-${c})^{n}$`, why: 'The $n!$ was dropped.', err: 'dropped-factor' },
      ])],
      hint: 'Differentiate $e^{kx}$ a few times and spot $k^{n}e^{kx}$.',
      steps: [`$f^{(n)}(x)=${k}^{n}e^{${k}x}$, so $f^{(n)}(${c})=${k}^{n}e^{${k * c}}$.`, 'Divide by $n!$ and attach $(x-c)^n$.'],
      recall: 'Chain rule gives $k^n$ in the $n$th derivative of $e^{kx}$; evaluate at the centre.',
    };
  },
});

// ---- G: choose n for error bound ----
G.push({
  id: 'gt-lagr-choose-n', unit: 'series', topic: TP, diff: 4,
  src: 'Exam 3 Q7 style — smallest degree for a given error',
  make(r) {
    const [tol, k] = r.pick([[10, 4], [100, 5], [1000, 7]]);
    const fn = r.pick(['\\sin x', '\\cos x']);
    const n = k - 1;
    const key = `$n=${n}$`;
    return {
      prompt: `Use $T_n(x)$ for $${fn}$ about $0$ to approximate $${fn}$ on $|x|\\le1$. What is the smallest $n$ for which the Taylor Remainder Theorem guarantees error less than $\\frac{1}{${tol}}$?`,
      choices: [{ t: key, ok: true }, ...choose(key, [
        { t: `$n=${k}$`, why: `Valid but larger than needed: $n=${n}$ already gives bound $\\frac1{${k}!}<\\frac1{${tol}}$.`, err: 'off-by-one' },
        { t: `$n=${k - 2}$`, why: `Bound is $\\frac1{${k - 1}!}=\\frac1{${[1, 1, 2, 6, 24, 120, 720][k - 1]}}$, which is not less than $\\frac1{${tol}}$.`, err: 'off-by-one' },
        { t: `$n=${k + 2}$`, why: 'Large enough, but not the smallest.', err: 'conceptual' },
      ])],
      hint: `$|f^{(n+1)}|\\le1$ and $|x|\\le1$, so $|R_n|\\le\\frac{1}{(n+1)!}$. Find the least $n$ with $(n+1)!>${tol}$.`,
      steps: ['$|R_n(x)|\\le\\frac{M|x|^{n+1}}{(n+1)!}\\le\\frac{1}{(n+1)!}$.', `Need $(n+1)!>${tol}$: $${k - 1}!=${[1, 1, 2, 6, 24, 120, 720][k - 1]}$ fails, $${k}!=${[1, 1, 2, 6, 24, 120, 720, 5040][k]}$ works.`, `So $n+1=${k}$, $n=${n}$.`],
      recall: 'Error bound is $\\frac{1}{(n+1)!}$ for sin/cos on $|x|\\le1$. Find the smallest factorial exceeding $1/\\text{tol}$.',
    };
  },
});

// ---- G: alternating-series error bound ----
G.push({
  id: 'gt-alt-bound', unit: 'series', topic: 'Alternating Series & Error', diff: 3,
  src: 'Exam 3 style — alternating series error bound',
  make(r) {
    const p = r.int(2, 3), N = r.int(3, 5);
    const key = `$\\dfrac{1}{${(N + 1) ** p}}$`;
    return {
      prompt: `Let $S_{${N}}$ be the sum of the first ${N} terms of $\\displaystyle\\sum_{n=1}^{\\infty}\\frac{(-1)^{n+1}}{n^{${p}}}$. What is the best bound on $|S-S_{${N}}|$ from the Alternating Series Estimation Theorem?`,
      choices: [{ t: key, ok: true }, ...choose(key, [
        { t: `$\\dfrac{1}{${N ** p}}$`, why: `That is $b_{${N}}$, the last term you kept. The bound is the first **omitted** term $b_{${N + 1}}$.`, err: 'off-by-one' },
        { t: `$\\dfrac{1}{${(N + 2) ** p}}$`, why: `Skipped one term too far; $b_{${N + 1}}$ is the next one.`, err: 'off-by-one' },
        { t: `$\\dfrac{1}{${N + 1}}$`, why: `Forgot to raise to the power ${p}.`, err: 'dropped-factor' },
      ])],
      hint: 'Error $\\le b_{N+1}$.',
      steps: [`$b_n=\\frac1{n^{${p}}}$ is decreasing to $0$.`, `$|S-S_{${N}}|\\le b_{${N + 1}}=\\frac1{${N + 1}^{${p}}}=\\frac1{${(N + 1) ** p}}$.`],
      recall: 'Alternating series error is at most the first omitted term.',
    };
  },
});

// ---- G: limits via series ----
G.push({
  id: 'gt-series-limit', unit: 'series', topic: AP, diff: 3,
  src: 'Exam 3 style — limit via Maclaurin series',
  make(r) {
    const a = r.int(2, 3);
    const kind = r.pick(['exp', 'cos', 'sin']);
    let f, key, wr, steps;
    if (kind === 'exp') {
      f = `\\dfrac{e^{${a}x}-1-${a}x}{x^{2}}`; key = frac(a * a, 2);
      wr = [[frac(a * a, 1), 'You forgot the $2!$ in $\\frac{(ax)^2}{2!}$.', 'dropped-factor'], [frac(a, 2), 'The squared term is $\\frac{(ax)^2}{2}=\\frac{a^2x^2}{2}$: square the $a$.', 'algebra-slip'], ['0', 'The $x^2$ term survives the cancellation.', 'conceptual']];
      steps = [`$e^{${a}x}=1+${a}x+\\frac{${a * a}x^{2}}{2}+\\cdots$`, `Numerator $=\\frac{${a * a}}{2}x^{2}+\\cdots$; divide by $x^2$.`];
    } else if (kind === 'cos') {
      f = `\\dfrac{1-\\cos(${a}x)}{x^{2}}`; key = frac(a * a, 2);
      wr = [[frac(-a * a, 2), 'Sign: $1-\\cos u=+\\frac{u^2}{2}-\\cdots$.', 'sign'], [frac(a * a, 1), 'Missing the $\\frac1{2!}$.', 'dropped-factor'], [frac(a, 2), 'Square the $a$: $(ax)^2=a^2x^2$.', 'algebra-slip']];
      steps = [`$\\cos(${a}x)=1-\\frac{${a * a}x^{2}}{2}+\\cdots$`, `$1-\\cos(${a}x)=\\frac{${a * a}}{2}x^{2}-\\cdots$; divide by $x^2$.`];
    } else {
      f = `\\dfrac{\\sin(${a}x)-${a}x}{x^{3}}`; key = frac(-(a ** 3), 6);
      wr = [[frac(a ** 3, 6), 'Sign: $\\sin u-u=-\\frac{u^3}{3!}+\\cdots$.', 'sign'], [frac(-(a ** 3), 3), 'The cubic term has $3!=6$, not $3$.', 'formula-confusion'], [frac(-a, 6), 'Cube the $a$: $(ax)^3=a^3x^3$.', 'algebra-slip']];
      steps = [`$\\sin(${a}x)=${a}x-\\frac{${a ** 3}x^{3}}{6}+\\cdots$`, `Numerator $=-\\frac{${a ** 3}}{6}x^{3}+\\cdots$; divide by $x^3$.`];
    }
    const kt = `$${key}$`;
    return {
      prompt: `Use a Maclaurin series to find $\\displaystyle\\lim_{x\\to0}${f}$.`,
      choices: [{ t: kt, ok: true }, ...choose(kt, wr.map(([t, why, err]) => ({ t: `$${t}$`, why, err })))],
      hint: 'Substitute the series, cancel the leading terms, divide by the lowest power left.',
      steps,
      recall: 'Series limits: expand, cancel, divide by the lowest surviving power.',
    };
  },
});

// ---- G: numeric approximation by T_2 ----
G.push({
  id: 'gt-approx-value', unit: 'series', topic: AP, diff: 3,
  src: 'Exam 3 style — approximate a value with a Taylor polynomial',
  make(r) {
    const k = r.pick([2, 3, 4, 5, 10]);
    if (r.pick(['exp', 'sqrt']) === 'exp') {
      const key = `$${frac(2 * k * k + 2 * k + 1, 2 * k * k)}$`;
      return {
        prompt: `Use the degree-2 Maclaurin polynomial of $e^{x}$ to approximate $e^{1/${k}}$.`,
        choices: [{ t: key, ok: true }, ...choose(key, [
          { t: `$${frac(k * k + k + 1, k * k)}$`, why: 'Forgot $2!$: the third term is $\\frac{x^2}{2}$.', err: 'dropped-factor' },
          { t: `$${frac(k + 1, k)}$`, why: 'That is $T_1$; degree 2 includes $\\frac{x^2}{2}$.', err: 'off-by-one' },
          { t: `$${frac(6 * k ** 3 + 6 * k * k + 3 * k + 1, 6 * k ** 3)}$`, why: 'That is $T_3$; stop at $\\frac{x^2}{2!}$.', err: 'off-by-one' },
        ])],
        hint: `$T_2(x)=1+x+\\frac{x^2}{2}$ at $x=\\frac1{${k}}$.`,
        steps: [`$T_2(\\tfrac1{${k}})=1+\\frac1{${k}}+\\frac{1}{2\\cdot${k * k}}=${frac(2 * k * k + 2 * k + 1, 2 * k * k)}$.`],
        recall: '$e^x\\approx1+x+\\frac{x^2}{2}+\\frac{x^3}{6}$. Plug in a nice fraction.',
      };
    }
    // sqrt(1+x) = 1 + x/2 - x^2/8
    const key = `$${frac(8 * k * k + 4 * k - 1, 8 * k * k)}$`;
    return {
      prompt: `Use the degree-2 binomial (Maclaurin) polynomial of $\\sqrt{1+x}$ to approximate $\\sqrt{1+\\frac1{${k}}}$.`,
      choices: [{ t: key, ok: true }, ...choose(key, [
        { t: `$${frac(8 * k * k + 4 * k + 1, 8 * k * k)}$`, why: 'The $x^2$ term is negative: $-\\frac{x^2}{8}$.', err: 'sign' },
        { t: `$${frac(4 * k * k + 2 * k - 1, 4 * k * k)}$`, why: 'The quadratic term is $\\frac{x^2}{8}$, not $\\frac{x^2}{4}$ (forgot $2!$).', err: 'dropped-factor' },
        { t: `$${frac(2 * k + 1, 2 * k)}$`, why: 'That stops at degree 1.', err: 'off-by-one' },
      ])],
      hint: '$\\sqrt{1+x}\\approx1+\\frac x2-\\frac{x^2}{8}$.',
      steps: [`$1+\\frac1{${2 * k}}-\\frac1{${8 * k * k}}=${frac(8 * k * k + 4 * k - 1, 8 * k * k)}$.`],
      recall: 'Binomial: $\\sqrt{1+x}=1+\\frac x2-\\frac{x^2}{8}+\\frac{x^3}{16}-\\cdots$.',
    };
  },
});

// ---- G: integrate a series term by term ----
G.push({
  id: 'gt-series-integral', unit: 'series', topic: AP, diff: 3,
  src: 'Exam 3 style — integral via series',
  make(r) {
    const k = r.int(2, 3);
    if (r.pick(['cos', 'exp']) === 'cos') {
      const key = `$x-\\dfrac{x^{${2 * k + 1}}}{${2 * (2 * k + 1)}}$`;
      return {
        prompt: `Find the first two nonzero terms of the Maclaurin series for $\\displaystyle\\int\\cos(x^{${k}})\\,dx$ (take $C=0$).`,
        choices: [{ t: key, ok: true }, ...choose(key, [
          { t: `$x-\\dfrac{x^{${2 * k + 1}}}{2}$`, why: `Integrating $x^{${2 * k}}$ gives $\\frac{x^{${2 * k + 1}}}{${2 * k + 1}}$: divide by the new power.`, err: 'dropped-factor' },
          { t: `$1-\\dfrac{x^{${2 * k}}}{2}$`, why: 'That is $\\cos(x^k)$ itself, not its antiderivative.', err: 'conceptual' },
          { t: `$x-\\dfrac{x^{${2 * k + 1}}}{${2 * k + 1}}$`, why: 'The $\\frac{1}{2!}$ from the cosine series was lost.', err: 'formula-confusion' },
          { t: `$x+\\dfrac{x^{${2 * k + 1}}}{${2 * (2 * k + 1)}}$`, why: 'Cosine series alternates: second term negative.', err: 'sign' },
        ])],
        hint: `Substitute $x^{${k}}$ into $\\cos u=1-\\frac{u^2}{2}+\\cdots$ then integrate.`,
        steps: [`$\\cos(x^{${k}})=1-\\frac{x^{${2 * k}}}{2}+\\cdots$`, `Integrate: $x-\\frac{x^{${2 * k + 1}}}{2(${2 * k + 1})}$.`],
        recall: 'Expand, then integrate term by term; remember to divide by the new exponent.',
      };
    }
    const key = `$x+\\dfrac{x^{${k + 1}}}{${k + 1}}$`;
    return {
      prompt: `Find the first two terms of the Maclaurin series for $\\displaystyle\\int e^{x^{${k}}}\\,dx$ (take $C=0$).`,
      choices: [{ t: key, ok: true }, ...choose(key, [
        { t: `$1+x^{${k}}$`, why: 'That is the series for the integrand, not the antiderivative.', err: 'conceptual' },
        { t: `$x+x^{${k + 1}}$`, why: `Integrating $x^{${k}}$ gives $\\frac{x^{${k + 1}}}{${k + 1}}$.`, err: 'dropped-factor' },
        { t: `$x+\\dfrac{x^{${k + 1}}}{${k + 1}!}$`, why: 'The factorial belongs in the exponential series term ($\\frac{u^n}{n!}$), and for $n=1$ it is $1$.', err: 'formula-confusion' },
        { t: `$x-\\dfrac{x^{${k + 1}}}{${k + 1}}$`, why: '$e^{u}$ has all positive terms.', err: 'sign' },
      ])],
      hint: `$e^{x^{${k}}}=1+x^{${k}}+\\cdots$; integrate.`,
      steps: [`$e^{x^{${k}}}=1+x^{${k}}+\\frac{x^{${2 * k}}}{2}+\\cdots$`, `Integrate: $x+\\frac{x^{${k + 1}}}{${k + 1}}+\\cdots$`],
      recall: 'Integrate term by term.',
    };
  },
});

// ---- G: sum by recognising ln(1+x) / arctan ----
G.push({
  id: 'gt-sum-log-arctan', unit: 'series', topic: AP, diff: 4,
  src: 'Exam 3 Q5 style — sum by recognising ln(1+x) or arctan x',
  make(r) {
    const k = r.int(2, 4);
    if (r.pick(['ln', 'atan']) === 'ln') {
      const key = `$\\ln\\dfrac{${k + 1}}{${k}}$`;
      return {
        prompt: `Find the exact sum $\\displaystyle\\sum_{n=1}^{\\infty}\\frac{(-1)^{n+1}}{n\\,${k}^{n}}$.`,
        choices: [{ t: key, ok: true }, ...choose(key, [
          { t: `$\\ln\\dfrac{${k}}{${k + 1}}$`, why: 'Inverted: $\\ln(1+x)$ at $x=\\frac1{k}$ is $\\ln\\frac{k+1}{k}$.', err: 'inverted' },
          { t: `$\\ln ${k + 1}$`, why: `$x=\\frac1{${k}}$, not $${k}$.`, err: 'setup' },
          { t: `$\\dfrac{1}{${k + 1}}$`, why: 'That is geometric; the $\\frac1n$ makes it a log.', err: 'formula-confusion' },
          { t: `$\\ln\\dfrac{${k + 2}}{${k}}$`, why: `$1+\\frac1{${k}}=\\frac{${k + 1}}{${k}}$.`, err: 'algebra-slip' },
        ])],
        hint: 'Compare with $\\ln(1+x)=\\sum\\frac{(-1)^{n+1}x^n}{n}$.',
        steps: [`$\\frac{1}{${k}^{n}}=(\\frac1{${k}})^n$, so $x=\\frac1{${k}}$.`, `Sum $=\\ln(1+\\frac1{${k}})=\\ln\\frac{${k + 1}}{${k}}$.`],
        recall: 'Denominator $n$ means log. Read $x$ from the geometric factor.',
      };
    }
    const key = `$\\arctan\\dfrac{1}{${k}}$`;
    return {
      prompt: `Find the exact sum $\\displaystyle\\sum_{n=0}^{\\infty}\\frac{(-1)^{n}}{(2n+1)\\,${k}^{2n+1}}$.`,
      choices: [{ t: key, ok: true }, ...choose(key, [
        { t: `$\\arctan ${k}$`, why: `$x^{2n+1}=\\frac1{${k}^{2n+1}}$ means $x=\\frac1{${k}}$.`, err: 'inverted' },
        { t: `$\\ln\\dfrac{${k + 1}}{${k}}$`, why: 'Odd powers with $2n+1$ in the denominator is $\\arctan$, not $\\ln(1+x)$.', err: 'formula-confusion' },
        { t: `$\\sin\\dfrac{1}{${k}}$`, why: 'Sine needs $(2n+1)!$; here the denominator is $2n+1$ only.', err: 'formula-confusion' },
        { t: `$\\dfrac{\\pi}{4}$`, why: 'That is $\\arctan1$, i.e. $x=1$.', err: 'setup' },
      ])],
      hint: '$\\arctan x=\\sum\\frac{(-1)^nx^{2n+1}}{2n+1}$.',
      steps: [`$x=\\frac1{${k}}$.`, `Sum $=\\arctan\\frac1{${k}}$.`],
      recall: 'Denominator $2n+1$, odd powers, alternating: arctan.',
    };
  },
});

// ---- G: IOC about nonzero centre ----
G.push({
  id: 'gt-ioc-center', unit: 'series', topic: 'Power Series & Radius', diff: 4,
  src: 'Exam 3 Q3 style — interval of convergence with endpoints, nonzero centre',
  make(r) {
    const c = r.pick([-3, -2, -1, 1, 2, 3]), k = r.int(2, 4);
    const base = c > 0 ? `(x-${c})` : `(x+${-c})`;
    const lo = c - k, hi = c + k;
    const key = `$[${lo},\\,${hi})$`;
    return {
      prompt: `Find the interval of convergence of $\\displaystyle\\sum_{n=1}^{\\infty}\\frac{${base}^{n}}{n\\,${k}^{n}}$.`,
      choices: [{ t: key, ok: true }, ...choose(key, [
        { t: `$(${lo},\\,${hi})$`, why: 'Right radius, but the endpoints were not tested.', err: 'endpoints' },
        { t: `$[${lo},\\,${hi}]$`, why: `At $x=${hi}$ the series is $\\sum\\frac1n$ (harmonic) which diverges.`, err: 'endpoints' },
        { t: `$(${lo},\\,${hi}]$`, why: `Reversed: $x=${hi}$ gives harmonic (diverges) and $x=${lo}$ gives alternating harmonic (converges).`, err: 'endpoints' },
        { t: `$[${-k},\\,${k})$`, why: `Centre is $${c}$, not $0$; the interval is centred at $${c}$.`, err: 'setup' },
      ])],
      hint: 'Ratio test for the radius, then test each endpoint.',
      steps: [`Ratio test: $|x-(${c})|/${k}<1$, so $R=${k}$.`, `$x=${hi}$: $\\sum\\frac1n$ diverges. $x=${lo}$: $\\sum\\frac{(-1)^n}{n}$ converges.`, `Interval: $[${lo},${hi})$.`],
      recall: 'Centre $c$, radius $R$: open interval $(c-R,c+R)$, then test both endpoints.',
    };
  },
});

export const taylor = { unit: 'series', problems: P, generators: G };
