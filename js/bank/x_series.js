// bank/x_series.js — exam-variety pack (run mix). Owner: see .hnic/context/mix-contract.md
// Sequences & series generators + static items in mixed formats (mc / free / multi / error / tf).
// Sources: Exam 2 packet (Stewart §11.1-11.7 exercises); see .hnic/context/mix-sources.md.
import { frac, choose, gcd } from '../util.js';
const P = [];
const G = [];
const R = String.raw;

// ---- helpers ------------------------------------------------------
const K = t => ({ t, ok: true });
const D = (t, why, err) => ({ t, why, err });
const sumTo = (a, b) => { let n = 0, d = 1; for (let k = a; k <= b; k++) { n = n * k + d; d *= k; const g = gcd(n, d); n /= g; d /= g; } return [n, d]; };
const Fr = ([n, d]) => frac(n, d);
const decimal = (e, k) => String(e / 10 ** k);
const rsTex = (s, p, q) => `${s < 0 ? '-' : ''}\\frac{${p}}{${q}}`;
/** choices for an error-finding item: Line 1..n + No error. `bad` = index of the wrong line, -1 = no error. */
const errCh = (n, bad, whys, tag, noWhy) => [
  ...Array.from({ length: n }, (_, i) => (i === bad ? K(`Line ${i + 1}`) : D(`Line ${i + 1}`, whys && whys[i], tag))),
  bad < 0 ? K('No error') : D('No error', noWhy, tag),
];
const ERRP = 'Below is a student\'s solution. Find the first line that contains an error (or choose **No error**).';
const VERD = {
  AC: 'Absolutely convergent', CC: 'Conditionally convergent', D: 'Divergent',
};
const ACC = {
  AC: ['absolutely convergent', 'converges absolutely', 'absolutely', 'abs convergent', 'AC'],
  CC: ['conditionally convergent', 'converges conditionally', 'conditionally', 'cond convergent', 'CC'],
  D: ['divergent', 'diverges', 'divergence', 'D'],
};

// =================================================================
// shared case banks
// =================================================================

/** absolute / conditional / divergent classification cases */
function acdCase(r) {
  const k = r.int(0, 8);
  const c = r.int(1, 4);
  if (k <= 2) {
    const [d, ptex, p] = r.pick([[R`\sqrt{n}`, '\\frac12', 0.5], ['n', '1', 1], [R`\sqrt[3]{n}`, '\\frac13', 1 / 3],
      [R`n^{2}`, '2', 2], [R`n^{3/2}`, '\\frac32', 1.5], [R`n^{3}`, '3', 3], [R`n^{4/3}`, '\\frac43', 4 / 3]]);
    const v = p > 1 ? 'AC' : 'CC';
    return { term: R`\frac{(-1)^{n}}{${d}}`, s: 1, v,
      steps: [R`Absolute values: $\sum|a_n|=\sum\frac{1}{${d}}$ is a $p$-series with $p=${ptex}$.`,
        v === 'AC' ? R`$p>1$, so $\sum|a_n|$ converges: **absolutely convergent**.`
          : R`$p\le1$, so $\sum|a_n|$ diverges. But $b_n=\frac1{${d}}$ is positive, decreasing, $\to0$, so the AST gives convergence: **conditionally convergent**.`] };
  }
  if (k === 3) {
    return { term: R`(-1)^{n}\frac{n}{n+${c}}`, s: 1, v: 'D',
      steps: [R`$|a_n|=\frac{n}{n+${c}}\to1\ne0$, so $a_n\not\to0$ (it tends to $\pm1$ alternately).`, 'Divergence Test: **divergent**. The AST is never reached; its second hypothesis ($b_n\\to0$) fails.'] };
  }
  if (k === 4) {
    const a = r.int(1, 3), b = r.int(1, 3);
    return { term: R`\frac{(-1)^{n}(${a === 1 ? '' : a}n+${b})}{n^{2}+${c}}`, s: 1, v: 'CC',
      steps: [R`Compare $|a_n|=\frac{${a === 1 ? '' : a}n+${b}}{n^{2}+${c}}$ with $\frac1n$: the LCT limit is $${a}>0$, and $\sum\frac1n$ diverges, so $\sum|a_n|$ diverges.`,
        'But $b_n=\\frac{an+b}{n^2+c}$ is eventually decreasing and $\\to0$, so the AST says the alternating series converges: **conditionally convergent**.'] };
  }
  if (k === 5) {
    const m = r.int(2, 5), e = r.int(1, 3);
    return { term: R`(-1)^{n}\frac{n^{${e}}}{${m}^{n}}`, s: 1, v: 'AC',
      steps: [R`Ratio Test on $|a_n|$: $\frac{(n+1)^{${e}}}{n^{${e}}}\cdot\frac{1}{${m}}\to\frac1${m}<1$.`, 'So $\\sum|a_n|$ converges: **absolutely convergent**.'] };
  }
  if (k === 6) {
    const f = r.pick([[R`\frac{1}{\ln n}`, 'Compare $\\frac1{\\ln n}>\\frac1n$: the absolute series diverges, but $\\frac1{\\ln n}$ decreases to $0$ (AST).'],
      [R`\frac{\ln n}{n}`, 'For $n\\ge3$, $\\frac{\\ln n}{n}>\\frac1n$ so the absolute series diverges; but $\\frac{\\ln n}{n}$ is eventually decreasing and $\\to0$ (AST).']]);
    return { term: R`(-1)^{n}${f[0]}`, s: 2, v: 'CC', steps: [f[1], '**Conditionally convergent**.'] };
  }
  if (k === 7) {
    const e = r.int(2, 3);
    return { term: R`\frac{\sin n}{n^{${e}}}`, s: 1, v: 'AC',
      steps: [R`$|a_n|\le\frac{1}{n^{${e}}}$ and $\sum\frac1{n^{${e}}}$ converges ($p=${e}>1$).`, 'Direct Comparison: $\\sum|a_n|$ converges, so the series is **absolutely convergent**. (The terms are not alternating, so the AST does not even apply.)'] };
  }
  const m = r.int(2, 4);
  return r.pick([
    { term: R`(-1)^{n}\frac{n!}{${m}^{n}}`, s: 1, v: 'D',
      steps: [R`$\frac{n!}{${m}^{n}}\to\infty$ (factorial beats exponential), so $a_n\not\to0$.`, 'Divergence Test: **divergent**.'] },
    { term: R`(-1)^{n}\frac{${m}^{n}}{n!}`, s: 1, v: 'AC',
      steps: [R`Ratio Test on $|a_n|$: $\frac{${m}}{n+1}\to0<1$.`, '**Absolutely convergent**.'] },
  ]);
}
const acdStep = v => v === 'AC'
  ? 'Absolutely convergent means $\\sum|a_n|$ converges; that also forces $\\sum a_n$ to converge.'
  : v === 'CC' ? 'Conditionally convergent means $\\sum a_n$ converges but $\\sum|a_n|$ diverges.' : '';

/** LCT cases: a_n ~ (alpha/gamma) * 1/n^p. */
function lctCase(r) {
  const nu = r.pick([['n', 1], [R`n^{2}`, 2], [R`\sqrt{n}`, 0.5]]);
  const dv = r.pick([[R`n^{2}`, 2], [R`n^{3}`, 3], [R`n^{4}`, 4], [R`n^{5/2}`, 2.5], [R`n\sqrt{n}`, 1.5], [R`n^{3}`, 3]]);
  const p = dv[1] - nu[1];
  if (p < 0.4) return lctCase(r);
  const a = r.int(1, 5), g = r.int(1, 5), b = r.int(1, 4), d = r.int(1, 4);
  const ptex = { 0.5: '\\frac12', 1: '1', 1.5: '\\frac32', 2: '2', 2.5: '\\frac52', 3: '3', 3.5: '\\frac72' }[p];
  const bn = p === 1 ? R`\frac1n` : p === 0.5 ? R`\frac1{\sqrt n}` : R`\frac{1}{n^{${p === 1.5 ? '3/2' : p === 2.5 ? '5/2' : p === 3.5 ? '7/2' : p}}}`;
  const term = R`\frac{${a === 1 ? '' : a}${nu[0]}+${b}}{${g === 1 ? '' : g}${dv[0]}+${d}}`;
  return { term, bn, p, ptex, L: [a, g], conv: p > 1 };
}

// =================================================================
// SEQUENCES
// =================================================================

G.push({
  id: 'g-xs-seqlim', topic: 'Sequences', diff: 2,
  make(r) {
    const k = r.int(0, 3);
    let prompt, key, pool, steps, recall;
    if (k === 0) {
      const m = r.int(2, 4), c = r.int(2, 5), d = r.int(1, 6);
      prompt = R`Find $\displaystyle\lim_{n\to\infty}\frac{\sqrt{${m * m}n^{2}+${d}}}{${c}n+1}$.`;
      key = `$${frac(m, c)}$`;
      pool = [D(`$${frac(m * m, c)}$`, `You forgot the square root: $\\sqrt{${m * m}n^2}=${m}n$, not $${m * m}n$.`, 'algebra-slip'),
        D('$0$', 'Numerator and denominator both grow like $n$, so the ratio does not vanish.', 'conceptual'),
        D('$\\infty$', 'Both parts are order $n$ (the root of $n^2$ is $n$), so the limit is finite.', 'conceptual'),
        D(`$${frac(m, c + 1)}$`, 'The $+1$ in the denominator is lower order and disappears in the limit.', 'dropped-factor'),
        D(`$${frac(m + 1, c)}$`, `$\\sqrt{${m * m}n^2+${d}}\\sim${m}n$; the constant ${d} is lower order and does not change the coefficient.`, 'algebra-slip')];
      steps = [R`Divide top and bottom by $n$: $\dfrac{\sqrt{${m * m}+${d}/n^{2}}}{${c}+1/n}$.`, R`As $n\to\infty$ this tends to $\dfrac{\sqrt{${m * m}}}{${c}}=${frac(m, c)}$.`];
      recall = 'Divide by the dominant power; $\\sqrt{n^2}=n$.';
    } else if (k === 1) {
      const a = r.int(2, 9);
      prompt = R`Find $\displaystyle\lim_{n\to\infty} n\sin\!\left(\frac{${a}}{n}\right)$.`;
      key = `$${a}$`;
      pool = [D('$0$', 'This is a $\\infty\\cdot0$ form; $\\sin(a/n)\\to0$ but $n\\to\\infty$ at the same rate, so you cannot just say $0$.', 'conceptual'),
        D('$1$', `The standard limit is $\\frac{\\sin t}{t}\\to1$; here $t=${a}/n$, so you still owe the factor ${a}$.`, 'dropped-factor'),
        D(`$${frac(1, a)}$`, `Inverted: $n\\sin(${a}/n)=${a}\\cdot\\frac{\\sin(${a}/n)}{${a}/n}\\to${a}\\cdot1$.`, 'inverted'),
        D('$\\infty$', '$\\sin$ is bounded by 1 but it is also tiny; the product settles to a finite value.', 'conceptual')];
      steps = [R`Rewrite: $n\sin\frac{${a}}{n}=${a}\cdot\dfrac{\sin(${a}/n)}{${a}/n}$.`, R`With $t=${a}/n\to0$, $\frac{\sin t}{t}\to1$, so the limit is $${a}$.`];
      recall = '$\\frac{\\sin t}{t}\\to1$ as $t\\to0$. Manufacture that form.';
    } else if (k === 2) {
      const a = r.int(2, 4), b = r.int(2, 4);
      prompt = R`Find $\displaystyle\lim_{n\to\infty}\left(1+\frac{${a}}{n}\right)^{${b}n}$.`;
      key = `$e^{${a * b}}$`;
      pool = [D('$1$', '$1^\\infty$ is an indeterminate form, not $1$. The base tends to $1$ but the exponent blows up at a matching rate.', 'conceptual'),
        D(`$e^{${a}}$`, `You forgot the exponent factor ${b}: $\\left(1+\\frac an\\right)^{bn}=\\left[\\left(1+\\frac an\\right)^n\\right]^{b}\\to(e^{a})^{b}$.`, 'dropped-factor'),
        D(`$e^{${a + b}}$`, 'The exponents multiply ($(e^a)^b=e^{ab}$); they do not add.', 'power-rule'),
        D(`$e^{${b}}$`, `The $a$ in the base matters: $(1+a/n)^n\\to e^{a}$.`, 'dropped-factor'),
        D(`$e^{${a * b + a}}$`, `The exponent is exactly $ab=${a * b}$; no extra ${a} appears.`, 'algebra-slip')];
      steps = [R`$\left(1+\frac{a}{n}\right)^{n}\to e^{a}$, so with $a=${a}$: $\left(1+\frac{${a}}{n}\right)^{n}\to e^{${a}}$.`, R`Raise to the power ${b}: $\left(e^{${a}}\right)^{${b}}=e^{${a * b}}$.`];
      recall = '$(1+a/n)^n\\to e^a$.';
    } else {
      const a = r.int(2, 6), b = r.int(2, 5);
      prompt = R`Find $\displaystyle\lim_{n\to\infty}\frac{${a}n+\ln n}{${b}n}$.`;
      key = `$${frac(a, b)}$`;
      pool = [D('$\\infty$', '$\\ln n\\to\\infty$, but it grows far more slowly than $n$; it cannot compete with the linear terms.', 'conceptual'),
        D('$0$', 'The top has an $n$-sized term too ($' + a + 'n$), so it does not vanish.', 'conceptual'),
        D(`$${frac(a + 1, b)}$`, '$\\ln n$ is lower order than $n$; it contributes nothing in the limit.', 'dropped-factor'),
        D(`$${frac(b, a)}$`, 'Inverted: the numerator\'s coefficient goes on top.', 'inverted'),
        D(`$${frac(a, b + 1)}$`, `The denominator is ${b}n, so the coefficient is ${b}, not ${b + 1}.`, 'algebra-slip')];
      steps = [R`Divide by $n$: $\dfrac{${a}+\frac{\ln n}{n}}{${b}}$.`, R`$\frac{\ln n}{n}\to0$, so the limit is $\dfrac{${a}}{${b}}=${frac(a, b)}$.`];
      recall = 'Logs lose to every positive power: $\\frac{\\ln n}{n^k}\\to0$.';
    }
    return {
      fmt: 'free', arch: 'seq-limit', src: 'Exam 2 packet §11.1 Ex 1–66 (limits of sequences)',
      prompt, choices: [K(key), ...choose(key, pool)], steps, recall,
      hints: ['Which term dominates as $n\\to\\infty$?', 'Divide through by the highest power, or rewrite to expose a standard limit.'],
    };
  },
});

G.push({
  id: 'g-xs-seqrec', topic: 'Sequences', diff: 3,
  make(r) {
    if (r.int(0, 1)) {
      const m = r.int(2, 5), q = r.int(1, 6);
      const L = frac(q * m, m - 1);
      return {
        fmt: 'free', arch: 'seq-recursive', src: 'Exam 2 packet §11.1 (recursive sequences)',
        prompt: R`The sequence is defined by $a_1=1$, $a_{n+1}=\dfrac{1}{${m}}a_n+${q}$. Assuming it converges, find $\lim_{n\to\infty}a_n$.`,
        choices: [K(`$${L}$`),
          ...choose(`$${L}$`, [
            D(`$${q}$`, `Setting $L=\\frac1${m}L+${q}$ gives $L(1-\\frac1${m})=${q}$, not $L=${q}$. You dropped the $\\frac1${m}L$ term.`, 'dropped-factor'),
            D(`$${frac(q, m - 1)}$`, `Check the algebra: $L-\\frac L${m}=\\frac{${m - 1}}{${m}}L=${q}$, so $L=\\frac{${q}\\cdot${m}}{${m - 1}}$.`, 'algebra-slip'),
            D('$0$', 'The added constant keeps pushing the terms up; the limit is not $0$.', 'conceptual'),
            D(`$${frac(q * m, m + 1)}$`, `Sign slip: $L-\\frac{L}{${m}}$, not $L+\\frac L${m}$.`, 'sign'),
          ])],
        steps: [R`If $a_n\to L$ then $a_{n+1}\to L$ too, so $L=\frac{1}{${m}}L+${q}$.`, R`$L\left(1-\frac1${m}\right)=${q}\Rightarrow L=\dfrac{${q}}{${m - 1}/${m}}=${L}$.`,
          'The "assuming it converges" step is justified: the sequence is increasing and bounded above.'],
        recall: 'Recursive limit: let $a_n,a_{n+1}\\to L$ and solve. Only valid once convergence is known.',
        hints: ['Take the limit of both sides of the recursion.'],
      };
    }
    const [k, L] = r.pick([[2, 2], [6, 3], [12, 4], [20, 5]]);
    return {
      fmt: 'free', arch: 'seq-recursive', src: 'Exam 2 packet §11.1 (recursive sequences)',
      prompt: R`The sequence is defined by $a_1=1$, $a_{n+1}=\sqrt{${k}+a_n}$. It is increasing and bounded, hence convergent. Find its limit.`,
      choices: [K(`$${L}$`),
        ...choose(`$${L}$`, [
          D(`$${1 - L}$`, `This is the other root of $L^2=L+${k}$. The terms are all positive, so the negative root is rejected.`, 'conceptual'),
          D(`$${k}$`, `$\\sqrt{${k}+L}=L$ does not give $L=${k}$.`, 'algebra-slip'),
          D(`$${L * L}$`, `You solved $L=\\sqrt{${k}+L}$ and stopped one step early: $L^2=${k}+L$ has roots $${L}$ and $${1 - L}$, not $${L * L}$.`, 'algebra-slip'),
          D(`$${Math.round(Math.sqrt(k + 1) * 100) / 100}$`, `You just evaluated $a_2=\\sqrt{${k}+1}$. The limit is a fixed point, not a single term.`, 'conceptual'),
        ])],
      steps: [R`Let $a_n\to L$: $L=\sqrt{${k}+L}\Rightarrow L^{2}-L-${k}=0$.`, R`Roots: $L=${L}$ or $L=${1 - L}$. All terms are positive, so $L=${L}$.`],
      recall: 'Fixed-point equation gives candidates; the monotone-bounded argument + sign picks the right one.',
      hints: ['Square both sides after taking the limit.'],
    };
  },
});

G.push({
  id: 'g-xs-seqconv', topic: 'Sequences', diff: 2,
  make(r) {
    const c = r.int(2, 5), m = r.pick([2, 3, 4]), a = r.int(2, 4);
    const cases = [
      { t: R`(-1)^{n}\frac{n}{n+${c}}`, key: 'Diverges: it oscillates, approaching $+1$ and $-1$', why: 'Even terms $\\to1$, odd terms $\\to-1$: no single limit.',
        bad: [D('Converges to $0$', 'The factor $\\frac{n}{n+c}\\to1$, so the terms stay near $\\pm1$; the $(-1)^n$ does not force them to $0$.', 'conceptual'), D('Converges to $1$', 'The sign $(-1)^n$ makes half the terms near $-1$, so no limit.', 'sign')] },
      { t: R`\cos\!\left(\frac{n\pi}{${m}}\right)`, key: 'Diverges: it keeps oscillating through the same values', why: `$\\cos(n\\pi/${m})$ cycles periodically through values that never settle.`,
        bad: [D('Converges to $0$', 'Taking $n\\pi/m\\to\\infty$ does not make cosine tend to $0$; cosine just keeps cycling.', 'conceptual'), D('Converges to $1$', '$\\cos 0=1$ happens only at multiples of $2m$, not in the limit.', 'conceptual')] },
      { t: R`\frac{n^{2}}{${a + 1}^{n}}`, key: 'Converges to $0$', why: 'Exponentials beat polynomials.',
        bad: [D('Diverges to $\\infty$', 'The numerator grows, but the denominator grows exponentially faster.', 'conceptual'), D('Converges to $1$', 'The ratio is not approaching $1$; the exponential denominator dominates.', 'conceptual')] },
      { t: R`\arctan(${c}n)`, key: 'Converges to $\\dfrac{\\pi}{2}$', why: '$\\arctan t\\to\\pi/2$ as $t\\to\\infty$.',
        bad: [D('Diverges to $\\infty$', '$\\arctan$ is bounded above by $\\pi/2$; it levels off.', 'conceptual'), D('Converges to $0$', '$\\arctan(0)=0$ but $\\arctan(cn)$ heads to $\\pi/2$.', 'conceptual')] },
      { t: R`\frac{n^{2}+${c}}{n+${a}}`, key: 'Diverges to $\\infty$', why: 'Degree of numerator exceeds degree of denominator.',
        bad: [D('Converges to $1$', 'That would need equal degrees. The numerator is degree 2, the denominator degree 1.', 'conceptual'), D('Converges to $0$', 'The numerator grows faster than the denominator, so the terms grow.', 'inverted')] },
      { t: R`\sqrt[n]{${c + 1}n}`, key: 'Converges to $1$', why: '$n^{1/n}\\to1$ and $c^{1/n}\\to1$.',
        bad: [D('Diverges to $\\infty$', 'Taking the $n$-th root of something that grows only linearly shrinks it toward $1$.', 'conceptual'), D(`Converges to $${c + 1}$`, `Only the constant ${c + 1} is not the limit: $(${c + 1})^{1/n}\\to1$.`, 'conceptual')] },
    ];
    const cs = r.pick(cases);
    const lim = [D('Cannot be determined', 'A limit test settles this.', 'conceptual')];
    return {
      arch: 'seq-converge', src: 'Exam 2 packet §11.1 Ex 15–16 (convergence of sequences)',
      prompt: R`Determine whether the sequence $a_n=${cs.t}$ converges or diverges. If it converges, find its limit.`,
      choices: [K(cs.key), ...cs.bad, ...lim],
      steps: [cs.why, 'Conclusion: ' + cs.key + '.'],
      recall: 'Sequence limit: dominant terms, standard limits, and watch for oscillation.',
    };
  },
});

G.push({
  id: 'g-xs-seqerr', topic: 'Sequences', diff: 3,
  make(r) {
    const k = r.int(0, 2);
    if (k === 0) {
      const a = r.int(2, 5), b = r.int(2, 4);
      return {
        fmt: 'error', arch: 'seq-error-1inf', src: 'Exam 2 packet §11.1',
        prompt: ERRP,
        work: [R`$\lim_{n\to\infty}\left(1+\frac{${a}}{n}\right)^{${b}n}$`, R`As $n\to\infty$, $1+\frac{${a}}{n}\to1$.`,
          R`Since $1$ raised to any power is $1$, the limit is $1$.`, R`So the sequence converges to $1$.`],
        choices: errCh(4, 2, [`The base does tend to $1$ and the sequence is as given.`, `True: $${a}/n\\to0$.`, null, `Follows from Line 3 (but Line 3 is wrong).`], 'test-logic',
          'There is an error: the form is $1^\\infty$, which is indeterminate.'),
        steps: [R`Line 3 is wrong: $1^{\infty}$ is indeterminate. Only the base tends to 1; the exponent $${b}n$ also grows.`, R`Correct: $\left(1+\frac{${a}}{n}\right)^{${b}n}\to e^{${a * b}}$.`],
        recall: '$1^\\infty$ is indeterminate; use $(1+a/n)^n\\to e^a$.',
      };
    }
    if (k === 1) {
      const a = r.int(2, 6);
      return {
        fmt: 'error', arch: 'seq-error-inf-inf', src: 'Exam 2 packet §11.1',
        prompt: ERRP,
        work: [R`$\lim_{n\to\infty}\left(\sqrt{n^{2}+${a}n}-n\right)$`, R`Both $\sqrt{n^2+${a}n}$ and $n$ tend to $\infty$.`,
          R`Therefore the difference is $\infty-\infty=0$.`, R`The limit is $0$.`],
        choices: errCh(4, 2, ['Correct observation.', 'Correct observation.', null, 'Follows from Line 3.'], 'test-logic',
          'There is an error: Line 3.'),
        steps: [R`Line 3 is wrong: $\infty-\infty$ is indeterminate, not $0$.`, R`Multiply by the conjugate: $\dfrac{${a}n}{\sqrt{n^2+${a}n}+n}\to\dfrac{${a}}{2}$.`],
        recall: '$\\infty-\\infty$ is indeterminate: use the conjugate.',
      };
    }
    const a = r.int(2, 7);
    return {
      fmt: 'error', arch: 'seq-error-sin', src: 'Exam 2 packet §11.1',
      prompt: ERRP,
      work: [R`$\lim_{n\to\infty} n\sin\!\left(\frac{${a}}{n}\right)$`, R`$\sin\!\left(\frac{${a}}{n}\right)\to0$ as $n\to\infty$.`,
        R`Anything times $0$ is $0$, so the limit is $0$.`, R`The sequence converges to $0$.`],
      choices: errCh(4, 2, ['Correct.', 'Correct.', null, 'Follows from Line 3.'], 'test-logic', 'There is an error: Line 3.'),
      steps: [R`Line 3 is wrong: the other factor $n$ tends to $\infty$, so this is $\infty\cdot0$, indeterminate.`, R`$n\sin\frac{${a}}{n}=${a}\cdot\frac{\sin(${a}/n)}{${a}/n}\to${a}$.`],
      recall: '$\\infty\\cdot0$ is indeterminate; rewrite as $\\sin t/t$.',
    };
  },
});

// =================================================================
// GEOMETRIC & TELESCOPING
// =================================================================

G.push({
  id: 'g-xs-geomsum', topic: 'Geometric & Telescoping', diff: 2,
  make(r) {
    const k0 = r.int(0, 3), a = r.int(1, 6), q = r.int(3, 9), p = r.int(1, q - 1), s = r.pick([1, -1]);
    const sp = s * p;
    const num = a * sp ** k0 * q, den = q ** k0 * (q - sp);
    const key = `$${frac(num, den)}$`;
    const first = frac(a * sp ** k0, q ** k0);
    const pool = [
      D(`$${frac(a * q, q - sp)}$`, `That is $\\frac{a}{1-r}$ with the coefficient $a$ as "first term": it starts at $n=0$. Your series starts at $n=${k0}$, so the first term is $ar^{${k0}}$.`, 'off-by-one'),
      D(`$${frac(num, q ** k0 * (q + sp))}$`, 'Sign of $r$ is wrong in the denominator: use $1-r$ with $r$ itself (negative ratios give $1+|r|$).', 'sign'),
      D(`$${first}$`, 'That is only the first term. The sum is first term over $1-r$.', 'conceptual'),
      D(`$${frac(a * sp ** k0 * q * q, q ** k0 * (q - sp))}$`, 'You multiplied by an extra factor of the denominator of $r$.', 'dropped-factor'),
      D(`$${frac(a * sp ** Math.max(k0 - 1, 0) * q, q ** Math.max(k0 - 1, 0) * (q - sp))}$`, 'Off by one in the exponent of the first term.', 'off-by-one'),
    ];
    return {
      fmt: 'free', arch: 'geom-sum', src: 'Exam 2 packet §11.2 Ex 11–14',
      prompt: R`Find the sum of the series $\displaystyle\sum_{n=${k0}}^{\infty} ${a === 1 ? '' : a}\left(${rsTex(s, p, q)}\right)^{n}$.`,
      choices: [K(key), ...choose(key, pool)],
      steps: [R`$|r|=\frac{${p}}{${q}}<1$, so the series converges.`, R`First term (at $n=${k0}$): $${first}$.`, R`$S=\dfrac{\text{first term}}{1-r}=\dfrac{${first}}{1-${rsTex(s, p, q).replace(/^-/, '(-') + (s < 0 ? ')' : '')}}=${frac(num, den)}$.`],
      recall: '$S=\\dfrac{\\text{first term present}}{1-r}$, valid only for $|r|<1$.',
      hints: ['What is the first term, given where the index starts?'],
    };
  },
});

G.push({
  id: 'g-xs-decimal', topic: 'Geometric & Telescoping', diff: 2,
  make(r) {
    if (r.int(0, 1)) {
      const ab = r.pick([12, 37, 45, 73, 81, 27, 56, 91, 18, 36]);
      const key = `$${frac(ab, 99)}$`;
      return {
        fmt: 'free', arch: 'decimal-geom', src: 'Exam 2 packet §11.2 Ex 40–41 (repeating decimals)',
        prompt: R`Express the repeating decimal $0.\overline{${ab}}$ as a fraction in lowest terms by writing it as a geometric series.`,
        choices: [K(key), ...choose(key, [
          D(`$${frac(ab, 100)}$`, 'The repeating block is two digits, so the common ratio is $\\frac1{100}$ and the sum is $\\frac{ab/100}{1-1/100}=\\frac{ab}{99}$.', 'algebra-slip'),
          D(`$${frac(ab, 999)}$`, 'That is for a three-digit block. Two digits $\\to$ denominator $99$.', 'formula-confusion'),
          D(`$${frac(ab, 9)}$`, 'That is for a one-digit repeat. A two-digit block has denominator $99$.', 'formula-confusion'),
          D(`$${frac(ab, 98)}$`, 'The denominator is $100-1=99$, not $98$.', 'algebra-slip')])],
        steps: [R`$0.\overline{${ab}}=\frac{${ab}}{100}+\frac{${ab}}{100^{2}}+\cdots$: geometric, $a=\frac{${ab}}{100}$, $r=\frac1{100}$.`, R`$S=\dfrac{${ab}/100}{1-1/100}=\dfrac{${ab}}{99}=${frac(ab, 99)}$.`],
        recall: 'Repeating block of length $k$: $\\dfrac{\\text{block}}{10^k-1}$.',
      };
    }
    const c = r.int(1, 8), d = r.pick([1, 2, 3, 4, 5, 6, 7, 8].filter(x => x !== c));
    const key = `$${frac(9 * c + d, 90)}$`;
    return {
      fmt: 'free', arch: 'decimal-geom', src: 'Exam 2 packet §11.2 Ex 40–41 (repeating decimals)',
      prompt: R`Express $0.${c}\overline{${d}}$ (that is, $0.${c}${d}${d}${d}\ldots$) as a fraction in lowest terms.`,
      choices: [K(key), ...choose(key, [
        D(`$${frac(10 * c + d, 99)}$`, 'The $'+ c +'$ is not part of the repeating block. Only the digit '+ d +' repeats.', 'setup'),
        D(`$${frac(10 * c + d, 90)}$`, `Check: $0.${c}\\overline{${d}}=\\frac{${c}}{10}+\\frac{${d}}{90}$, not $\\frac{${c}${d}}{90}$.`, 'algebra-slip'),
        D(`$${frac(10 * c + d, 100)}$`, 'That is the terminating decimal $0.' + c + d + '$, ignoring the repetition.', 'conceptual'),
        D(`$${frac(c * 9 + d, 99)}$`, 'The geometric tail $\\frac{d}{100}+\\ldots$ starts at the second decimal place, so its sum has denominator $90$, not $99$.', 'algebra-slip')])],
      steps: [R`$0.${c}\overline{${d}}=\frac{${c}}{10}+\left(\frac{${d}}{100}+\frac{${d}}{1000}+\cdots\right)$.`, R`The tail is geometric: $a=\frac{${d}}{100}$, $r=\frac1{10}$, sum $\frac{${d}/100}{9/10}=\frac{${d}}{90}$.`, R`Total: $\frac{${c}}{10}+\frac{${d}}{90}=\frac{${9 * c}+${d}}{90}=${frac(9 * c + d, 90)}$.`],
      recall: 'Split off the non-repeating digits, then geometric-sum the repeating tail.',
    };
  },
});

G.push({
  id: 'g-xs-telesum', topic: 'Geometric & Telescoping', diff: 3,
  make(r) {
    const d = r.int(1, 4), c = r.int(1, 6), a = r.int(0, 2), m = r.int(1, 2);
    const parts = sumTo(m + a, m + a + d - 1);
    const val = [c * parts[0], d * parts[1]];
    const key = `$${Fr(val)}$`;
    const f1 = a === 0 ? 'n' : `n+${a}`, f2 = `n+${a + d}`;
    const den = a === 0 ? `n(${f2})` : `(${f1})(${f2})`;
    const pool = [
      D(`$${Fr([c * parts[0], parts[1]])}$`, 'You forgot the $\\frac1{d}$ from partial fractions: $\\frac{1}{x(x+d)}=\\frac1d\\left(\\frac1x-\\frac1{x+d}\\right)$.', 'dropped-factor'),
      D(`$${frac(c, d * (m + a))}$`, 'You kept only the first term of the telescoping sum. The first $d$ terms survive.', 'conceptual'),
      D(`$${Fr(sumTo(m + a + 1, m + a + d).map((x, i) => (i === 0 ? c * x : d * x)))}$`, 'Off by one: the surviving terms start at $\\frac1{m+a}$, the first term of the series.', 'off-by-one'),
      D('$0$', 'The tail terms vanish, but the first terms survive; the sum is not $0$.', 'conceptual'),
      D(`$${Fr([2 * val[0], val[1]])}$`, 'Check the arithmetic: the factor $\\frac cd$ multiplies the surviving sum once, with no extra factor of $2$.', 'algebra-slip'),
      D(`$${Fr([val[0], 2 * val[1]])}$`, 'Check the arithmetic: the surviving sum is not halved.', 'algebra-slip'),
    ];
    return {
      fmt: 'free', arch: 'telescoping-sum', src: 'Exam 2 packet §11.2 Ex 9 (telescoping partial sums)',
      prompt: R`Use partial fractions to show the series telescopes, then find its sum: $\displaystyle\sum_{n=${m}}^{\infty}\frac{${c}}{${den}}$.`,
      choices: [K(key), ...choose(key, pool)],
      steps: [R`$\dfrac{${c}}{${den}}=\dfrac{${c}}{${d}}\left(\dfrac{1}{${f1}}-\dfrac{1}{${f2}}\right)$.`,
        R`Partial sums collapse: only the first ${d} term(s) $\frac1{${m + a}}$ through $\frac1{${m + a + d - 1}}$ survive; the tail $\to0$.`,
        R`$S=\dfrac{${c}}{${d}}\cdot${Fr(parts)}=${Fr(val)}$.`],
      recall: 'Telescoping gap $d$: the first $d$ terms of $\\frac1k$ survive, times $\\frac cd$.',
      hints: ['Write the partial fraction decomposition first.'],
    };
  },
});

G.push({
  id: 'g-xs-telepart', topic: 'Geometric & Telescoping', diff: 3,
  make(r) {
    const d = r.int(1, 3);
    const H = sumTo(1, d);
    const tail = Array.from({ length: d }, (_, i) => R`\frac{1}{N+${i + 1}}`).join('-');
    const keyT = `$s_N=${Fr(H)}-${tail}$, and the sum is $${Fr(H)}$`;
    const keyS = (hv, tl, sum) => `$s_N=${hv}-${tl}$, and the sum is $${sum}$`;
    const pool = [
      D(keyS(Fr(H), R`\frac{1}{N+${d}}`, Fr(H)), 'You kept only the very last subtracted term. When the gap is $d$, the last $d$ terms $\\frac1{N+1},\\ldots,\\frac1{N+d}$ all survive.', 'conceptual'),
      D(keyS('1', R`\frac{1}{N+${d}}`, '1'), 'Only $1$ survives from the front? The first $d$ terms $1,\\frac12,\\ldots$ all survive.', 'conceptual'),
      D(keyS('0', '0', '0'), 'A telescoping series collapses, but not to $0$: terms at both ends survive.', 'conceptual'),
      D(keyS(Fr(H), R`\frac{1}{N}${d > 1 ? '-' + Array.from({ length: d - 1 }, (_, i) => R`\frac{1}{N+${i + 1}}`).join('-') : ''}`, Fr(H)), 'Index off by one at the back end: the subtracted terms are $\\frac1{N+1}$ through $\\frac1{N+d}$.', 'off-by-one'),
      D(keyS(Fr(H), tail, '\\infty'), 'The tail terms $\\frac1{N+k}\\to0$, so the partial sums converge; they do not blow up.', 'conceptual'),
      D(keyS(Fr(H), tail, '0'), 'As $N\\to\\infty$ the subtracted tail vanishes, leaving the positive front terms, not $0$.', 'conceptual'),
      D(`$s_N=${Fr(H)}+${tail.replace(/-/g, '+')}$, and the sum is $${Fr(H)}$`, 'The tail terms are subtracted, not added.', 'sign'),
    ];
    return {
      arch: 'telescoping-partial', src: 'Exam 2 packet §11.2 Ex 9',
      prompt: R`Let $\displaystyle s_N=\sum_{n=1}^{N}\left(\frac1n-\frac1{n+${d}}\right)$. Which statement is correct?`,
      choices: [K(keyT), ...choose(keyT, pool)],
      steps: [R`Write out the terms: $\left(1-\frac1{${1 + d}}\right)+\left(\frac12-\frac1{${2 + d}}\right)+\cdots$`,
        R`The positive terms $1,\frac12,\ldots,\frac1${d}$ never cancel; the negatives $\frac1{N+1},\ldots,\frac1{N+${d}}$ are what remain at the end.`,
        R`$s_N=${Fr(H)}-${tail}\to${Fr(H)}$.`],
      recall: 'Telescoping with gap $d$: first $d$ positives and last $d$ negatives survive.',
    };
  },
});

G.push({
  id: 'g-xs-geomerr', topic: 'Geometric & Telescoping', diff: 3,
  make(r) {
    if (r.int(0, 1)) {
      const a = r.int(2, 6), q = r.int(2, 4), m = r.int(2, 3);
      return {
        fmt: 'error', arch: 'geom-error-index', src: 'Exam 2 packet §11.2 (trap: starting index)',
        prompt: ERRP,
        work: [R`$\sum_{n=${m}}^{\infty}${a}\left(\frac{1}{${q}}\right)^{n}$ is geometric with $r=\frac1{${q}}$, and $|r|<1$.`,
          R`So it converges, with sum $\dfrac{a}{1-r}$ where $a=${a}$.`,
          R`$S=\dfrac{${a}}{1-\frac1{${q}}}=\dfrac{${a * q}}{${q - 1}}$.`, R`Therefore $S=${frac(a * q, q - 1)}$.`],
        choices: errCh(4, 1, ['Correct: ratio $1/' + q + '$, $|r|<1$.', null, 'Arithmetic follows from Line 2.', 'Arithmetic follows from Line 2.'], 'off-by-one', 'There is an error: Line 2.'),
        steps: [R`Line 2 is wrong: the formula uses the **first term present**, which is $${a}\left(\frac1${q}\right)^{${m}}$ (at $n=${m}$), not $${a}$.`,
          R`Correct sum: $\dfrac{${a}/${q ** m}}{1-1/${q}}=${frac(a * q, q ** m * (q - 1))}$.`],
        recall: 'Always plug in the first term at the actual starting index.',
      };
    }
    const a = r.int(1, 5), p = r.int(5, 9), q = p - r.int(1, 3);
    return {
      fmt: 'error', arch: 'geom-error-ratio', src: 'Exam 2 packet §11.2 (trap: |r| < 1)',
      prompt: ERRP,
      work: [R`$\sum_{n=1}^{\infty}${a}\left(\frac{${p}}{${q}}\right)^{n-1}$ is geometric with $a=${a}$ and $r=\frac{${p}}{${q}}$.`,
        R`$S=\dfrac{a}{1-r}=\dfrac{${a}}{1-\frac{${p}}{${q}}}=\dfrac{${a * q}}{${q - p}}$.`,
        R`So the series converges to $${frac(a * q, q - p)}$.`],
      choices: errCh(3, 1, ['Correct: $a$ and $r$ identified.', null, 'Conclusion repeats Line 2.'], 'test-logic', 'There is an error: Line 2.'),
      steps: [R`Line 2 is wrong: the formula needs $|r|<1$, but $r=\frac{${p}}{${q}}>1$.`, 'The terms grow, so the series **diverges**; the negative "sum" is meaningless.'],
      recall: 'Check $|r|<1$ before using $a/(1-r)$.',
    };
  },
});

G.push({
  id: 'g-xs-geommulti', topic: 'Geometric & Telescoping', diff: 2,
  make(r) {
    const T = [
      [R`\dfrac{3^{n}}{4^{n}}`, 'ratio $\\frac34$.'], [R`\left(-\dfrac{2}{3}\right)^{n}`, '$|r|=\\frac23$.'], [R`\dfrac{5^{n+1}}{9^{n}}`, '$=5\\cdot(5/9)^n$.'],
      [R`\dfrac{\pi^{n}}{4^{n}}`, '$\\pi/4\\approx0.785<1$.'], [R`\dfrac{e^{n}}{3^{n}}`, '$e/3\\approx0.906<1$.'], [R`2\,(0.9)^{n}`, 'ratio $0.9$.'],
      [R`\dfrac{2^{n}}{5^{n-1}}`, '$=5\\cdot(2/5)^n$.']];
    const F = [
      [R`\dfrac{4^{n}}{3^{n+1}}`, '$=\\frac13(4/3)^n$ with ratio $\\frac43>1$.'], [R`(-1.1)^{n}`, '$|r|=1.1>1$.'], [R`\dfrac{3^{2n}}{2^{3n}}`, '$=(9/8)^n$.'],
      [R`\dfrac{7^{n}}{6^{n}}`, 'ratio $\\frac76>1$.'], [R`\left(-\dfrac{5}{4}\right)^{n}`, '$|r|=\\frac54>1$.'], [R`\dfrac{e^{n}}{2^{n}}`, '$e/2\\approx1.36>1$.']];
    const nt = r.int(2, 3), nf = r.int(2, 3);
    const t = r.some(T, nt), f = r.some(F, nf);
    return {
      fmt: 'multi', arch: 'geom-multi', src: 'Exam 2 packet §11.2 Ex 11–14',
      prompt: R`Select **all** of the series $\displaystyle\sum_{n=1}^{\infty}a_n$ that converge, where $a_n$ equals:`,
      choices: [...t.map(x => ({ t: `$${x[0]}$`, ok: true, why: `Geometric with $|r|<1$: ${x[1]}` })),
        ...f.map(x => ({ t: `$${x[0]}$`, why: `Geometric with $|r|>1$: ${x[1]} Terms do not tend to $0$, so it diverges.`, err: 'test-logic' }))],
      steps: ['A geometric series $\\sum ar^n$ converges iff $|r|<1$. Rewrite each term as $a\\cdot r^n$ and compare $|r|$ to $1$.'],
      recall: '$|r|<1$ in, $|r|\\ge1$ out.',
    };
  },
});

// =================================================================
// DIVERGENCE & INTEGRAL TESTS
// =================================================================

G.push({
  id: 'g-xs-divtest', topic: 'Divergence & Integral Tests', diff: 2,
  make(r) {
    const c = r.int(2, 6), a = r.int(2, 5);
    const cases = [
      { t: R`\frac{n}{${c}n+1}`, lim: `\\frac1${c}`, nz: true },
      { t: R`\frac{n^{2}}{n^{2}+${c}}`, lim: '1', nz: true },
      { t: R`\cos\!\left(\frac1n\right)`, lim: '1', nz: true },
      { t: R`n\sin\!\left(\frac1n\right)`, lim: '1', nz: true },
      { t: R`\left(1+\frac1n\right)^{n}`, lim: 'e', nz: true },
      { t: R`\frac{${a}^{n}}{n^{2}}`, lim: '\\infty', nz: true },
      { t: R`\frac{1}{n^{2}}`, lim: '0', nz: false },
      { t: R`\frac{\ln n}{n}`, lim: '0', nz: false },
      { t: R`\frac{1}{n+${c}}`, lim: '0', nz: false },
      { t: R`\frac{${a}^{n}}{n!}`, lim: '0', nz: false },
    ];
    const cs = r.pick(cases);
    const keyT = cs.nz ? `Diverges: $\\lim a_n=${cs.lim}\\ne0$` : 'Inconclusive: $\\lim a_n=0$, so the test says nothing';
    const bad = cs.nz
      ? [D(`Converges, because $a_n\\to${cs.lim}$`, 'A convergent series needs $a_n\\to0$. Terms settling at a nonzero value make the sum grow without bound.', 'test-logic'),
        D('Inconclusive: $\\lim a_n=0$', `The limit is $${cs.lim}$, not $0$, so the test is conclusive.`, 'conceptual'),
        D('Converges, because the terms are bounded', 'Bounded terms are irrelevant. What matters is whether the terms tend to $0$.', 'test-logic')]
      : [D('Converges, because $a_n\\to0$', 'This is the classic misuse. $a_n\\to0$ is necessary, never sufficient (see $\\sum1/n$).', 'test-logic'),
        D('Diverges, because $a_n\\to0$', 'The Divergence Test only fires when $\\lim a_n\\ne0$ (or does not exist).', 'test-logic'),
        D('Diverges, because $\\lim a_n\\ne0$', 'The limit is $0$ here; the test cannot prove divergence.', 'conceptual')];
    return {
      arch: 'divergence-test', src: 'Exam 2 packet §11.2; Lecture "Divergence Test" (09-24)',
      prompt: R`Apply the Divergence Test to $\displaystyle\sum_{n=1}^{\infty}a_n$ with $a_n=${cs.t}$. What does it tell you?`,
      choices: [K(keyT), ...bad],
      steps: [R`$\lim_{n\to\infty}a_n=${cs.lim}$.`, cs.nz ? 'Nonzero (or infinite) limit $\\Rightarrow$ the series diverges by the Divergence Test.' : 'Limit $0$: the Divergence Test is inconclusive, so another test is needed.'],
      recall: '$a_n\\not\\to0\\Rightarrow$ diverges. $a_n\\to0\\Rightarrow$ no information.',
    };
  },
});

G.push({
  id: 'g-xs-integral', topic: 'Divergence & Integral Tests', diff: 3,
  make(r) {
    const k = r.int(0, 4);
    let term, f, start, conv, ig;
    if (k === 0) { const p = r.int(1, 3); term = R`\frac{1}{n(\ln n)^{${p === 1 ? '' : p}}}`; f = R`\frac{1}{x(\ln x)^{${p === 1 ? '' : p}}}`; start = 2; conv = p > 1; ig = p === 1 ? R`\ln|\ln x|` : R`\frac{(\ln x)^{${1 - p}}}{${1 - p}}`; }
    else if (k === 1) { const e = r.int(2, 4); term = R`n^{${e - 1}}e^{-n^{${e}}}`; f = R`x^{${e - 1}}e^{-x^{${e}}}`; start = 1; conv = true; ig = R`-\frac{1}{${e}}e^{-x^{${e}}}`; }
    else if (k === 2) { const c = r.int(1, 5); term = R`\frac{n}{n^{2}+${c}}`; f = R`\frac{x}{x^{2}+${c}}`; start = 3; conv = false; ig = R`\frac12\ln(x^{2}+${c})`; }
    else if (k === 3) { const c = r.int(1, 6); term = R`\frac{1}{n^{2}+${c}}`; f = R`\frac{1}{x^{2}+${c}}`; start = 1; conv = true; ig = R`\frac{1}{\sqrt{${c}}}\arctan\frac{x}{\sqrt{${c}}}`; }
    else { term = R`\frac{\ln n}{n}`; f = R`\frac{\ln x}{x}`; start = 3; conv = false; ig = R`\frac{(\ln x)^{2}}{2}`; }
    const verdict = conv ? 'Converges: the improper integral $\\int f(x)\\,dx$ converges' : 'Diverges: the improper integral $\\int f(x)\\,dx$ diverges';
    return {
      arch: 'integral-test', src: 'Exam 2 packet §11.3 Ex 3–8',
      prompt: R`Use the Integral Test to decide whether $\displaystyle\sum_{n=${start}}^{\infty}${term}$ converges or diverges.`,
      choices: [K(verdict), ...choose(verdict, [
        D(conv ? 'Diverges: the improper integral diverges' : 'Converges: the improper integral converges', conv ? 'The antiderivative $' + ig + '$ settles to a finite limit at $\\infty$; the integral converges.' : 'The antiderivative $' + ig + '$ grows without bound; the integral diverges.', 'test-logic'),
        D('Converges, with sum equal to the value of the integral', 'The Integral Test gives only a verdict. The sum and the integral are different numbers.', 'test-logic'),
        D('The Integral Test does not apply because $f$ is not positive, continuous, and decreasing', `$f(x)=${f}$ is positive and continuous for $x\\ge${start}$ and eventually decreasing, so the hypotheses hold.`, 'conceptual')])],
      steps: [R`Let $f(x)=${f}$: positive and continuous for $x\ge${start}$, and decreasing there.`, R`Antiderivative: $\int f(x)\,dx=${ig}$.`,
        conv ? R`As $x\to\infty$ it tends to a finite limit, so $\int_{${start}}^{\infty}f$ converges and so does the series.` : R`As $x\to\infty$ it grows without bound, so $\int_{${start}}^{\infty}f$ diverges and so does the series.`],
      recall: 'Integral Test: check positive, continuous, decreasing; then the series and the integral share a verdict.',
    };
  },
});

G.push({
  id: 'g-xs-interr', topic: 'Divergence & Integral Tests', diff: 3,
  make(r) {
    const k = r.int(0, 2);
    if (k === 0) {
      const p = r.int(2, 4);
      return {
        fmt: 'error', arch: 'integral-error-value', src: 'Exam 2 packet §11.3',
        prompt: ERRP,
        work: [R`$f(x)=\frac1{x^{${p}}}$ is positive, continuous, and decreasing on $[1,\infty)$.`, R`$\int_1^{\infty}x^{-${p}}\,dx=\lim_{t\to\infty}\left[\dfrac{x^{${1 - p}}}{${1 - p}}\right]_1^{t}=\dfrac{1}{${p - 1}}$.`,
          R`The integral converges, so the series converges by the Integral Test.`, R`Hence $\sum_{n=1}^{\infty}\frac1{n^{${p}}}=\dfrac{1}{${p - 1}}$.`],
        choices: errCh(4, 3, ['Hypotheses hold.', 'Integral computed correctly.', 'Correct use of the Integral Test.', null], 'test-logic', 'There is an error: Line 4.'),
        steps: [R`Line 4 is wrong: the Integral Test gives convergence, not the sum. The series and the integral are different numbers.`, R`(For $p=2$ the sum is $\pi^2/6\approx1.645$ while the integral is $1$.)`],
        recall: 'Integral Test: verdict only, never the value.',
      };
    }
    if (k === 1) {
      return {
        fmt: 'error', arch: 'integral-error-hyp', src: 'Exam 2 packet §11.3',
        prompt: ERRP,
        work: [R`$f(x)=\dfrac{${r.pick(['\\sin', '\\cos'])}\,x}{x^{2}}$ is continuous on $[1,\infty)$, so the Integral Test applies.`, R`$\int_1^{\infty}\frac{|\cdot|}{x^{2}}$ converges by comparison with $\frac1{x^2}$.`, R`So the series converges by the Integral Test.`],
        choices: errCh(3, 0, null, 'test-logic', 'There is an error: Line 1.').map((c, i) => (c.ok ? c : { ...c, why: i === 1 ? 'The comparison itself is fine, but Line 1 already broke the setup.' : 'Follows from the earlier lines.' })),
        steps: ['Line 1 is wrong: the Integral Test also needs $f$ **positive** and **decreasing**. This $f$ changes sign and oscillates.', 'The series does converge (absolutely, by comparison with $\\sum1/n^2$), but not by the Integral Test.'],
        recall: 'Integral Test needs all three: positive, continuous, decreasing.',
      };
    }
    return {
      fmt: 'error', arch: 'integral-error-none', src: 'Exam 2 packet §11.3',
      prompt: ERRP,
      work: [R`$f(x)=\dfrac{1}{x\ln x}$ is positive, continuous, and decreasing on $[2,\infty)$.`, R`$\int_2^{\infty}\dfrac{dx}{x\ln x}=\lim_{t\to\infty}\Big[\ln|\ln x|\Big]_2^{t}=\infty$.`, R`The integral diverges, so the series $\sum_{n=2}^{\infty}\frac{1}{n\ln n}$ diverges.`],
      choices: errCh(3, -1, ['Hypotheses hold on $[2,\\infty)$.', 'The antiderivative is $\\ln|\\ln x|$ (substitute $u=\\ln x$); the limit really is $\\infty$.', 'Correct conclusion of the test.'], 'test-logic', 'The work is right: all three lines are correct.'),
      steps: ['All three lines are correct. This is the standard example of a series whose terms go to $0$ faster than $\\frac1n$ yet it still diverges.'],
      recall: '$\\sum\\frac1{n\\ln n}$ diverges (very slowly); $\\sum\\frac1{n(\\ln n)^2}$ converges.',
    };
  },
});

G.push({
  id: 'g-xs-intrem', topic: 'Divergence & Integral Tests', diff: 4,
  make(r) {
    const p = r.int(2, 4), e = r.pick([3, 7, 9]), k = r.int(2, 4);
    let N = 1;
    while (!((p - 1) * N ** (p - 1) * e > 10 ** k)) N++;
    let Nb = 1;
    while (!(Nb ** p * e > 10 ** k)) Nb++;
    const eps = decimal(e, k);
    const key = `$${N}$`;
    return {
      fmt: 'free', arch: 'integral-remainder', src: 'Exam 2 packet §11.3 Ex 33–36, 38–40',
      prompt: R`Use the Integral Test remainder bound $R_N\le\int_N^{\infty}f(x)\,dx$ to find the smallest $N$ such that $s_N$ approximates $\displaystyle\sum_{n=1}^{\infty}\frac1{n^{${p}}}$ with error less than $${eps}$.`,
      choices: [K(key), ...choose(key, [
        D(`$${Nb}$`, `You required the *first omitted term* $\\frac1{N^{${p}}}$ to be small. The Integral Test bound is the whole tail integral $\\frac{1}{${p - 1}N^{${p - 1}}}$.`, 'formula-confusion'),
        D(`$${N + 1}$`, 'This works, but it is not the smallest $N$.', 'off-by-one'),
        D(`$${N - 1}$`, `Check $N=${N - 1}$: the bound $\\frac{1}{${p - 1}\\cdot${N - 1}^{${p - 1}}}$ is not below ${eps}.`, 'off-by-one'),
        D(`$${Math.ceil(10 ** k / e)}$`, 'You solved $N<\\frac1{\\varepsilon}$ and ignored the power in the tail integral.', 'conceptual')])],
      steps: [R`$R_N\le\int_N^{\infty}x^{-${p}}\,dx=\dfrac{1}{${p - 1}\,N^{${p - 1}}}$.`, R`Need $\dfrac{1}{${p - 1}N^{${p - 1}}}<${eps}\iff ${p - 1}N^{${p - 1}}>${(10 ** k / e).toFixed(2)}$.`, R`Smallest integer: $N=${N}$.`],
      recall: '$R_N\\le\\int_N^\\infty f$. Solve the inequality, then round up.',
    };
  },
});

// =================================================================
// p-SERIES & COMPARISON
// =================================================================

G.push({
  id: 'g-xs-pser', topic: 'p-Series & Comparison', diff: 2,
  make(r) {
    const k = r.int(0, 3);
    let term, p, ptex;
    if (k === 0) { [ptex, p] = r.pick([['\\frac43', 4 / 3], ['\\frac34', 3 / 4], ['\\frac54', 5 / 4], ['\\frac23', 2 / 3], ['\\frac76', 7 / 6]]); term = R`\frac{1}{n^{${ptex.replace(/\\frac\{?(\d)\}?\{?(\d)\}?/, '$1/$2')}}}`; }
    else if (k === 1) { const [kk, m] = r.pick([[3, 2], [2, 3], [5, 4], [4, 5], [3, 4]]); term = R`\frac{1}{\sqrt[${kk}]{n^{${m}}}}`; ptex = `\\frac{${m}}{${kk}}`; p = m / kk; }
    else if (k === 2) { const a = r.int(1, 3), b = a + r.int(1, 4); term = R`\frac{n^{${a}}}{n^{${b}}}`; p = b - a; ptex = String(p); }
    else { const c = r.int(2, 9), [e, et] = r.pick([[2, '2'], [3, '3'], [1, '1'], [1.5, '\\frac32'], [0.5, '\\frac12']]); term = R`\frac{${c}}{n^{${e === 1.5 ? '3/2' : e === 0.5 ? '1/2' : e}}}`; p = e; ptex = et; }
    const conv = p > 1;
    const ineq = conv ? '>1' : '\\le1';
    const keyT = conv ? `Converges: $p=${ptex}>1$` : `Diverges: $p=${ptex}\\le1$`;
    return {
      arch: 'p-series', src: 'Exam 2 packet §11.3; p-test (lecture 09-24)',
      prompt: R`Determine whether $\displaystyle\sum_{n=1}^{\infty}${term}$ converges or diverges.`,
      choices: [K(keyT), ...choose(keyT, [
        D(conv ? `Diverges: $p=${ptex}\\le1$` : `Converges: $p=${ptex}>1$`, `$p=${ptex}$, and $p${conv ? '>1' : '\\le1'}$ gives ${conv ? 'convergence' : 'divergence'}. The cutoff is $p=1$.`, 'test-logic'),
        D('Converges: the terms tend to $0$', 'Terms tending to $0$ is necessary, not sufficient ($\\sum\\frac1n$ diverges).', 'test-logic'),
        D('Diverges: it is not a geometric series', 'Not being geometric proves nothing. $p$-series have their own test.', 'conceptual'),
        D(conv ? `Converges: $p=${ptex}<1$` : `Diverges: $p=${ptex}>1$`, 'You misread the cutoff direction: $p>1$ converges.', 'inverted')])],
      steps: [R`Simplify the power of $n$: the term equals $\frac{c}{n^{p}}$ with $p=${ptex}$.`, R`$p${ineq}$, so the series ${conv ? 'converges' : 'diverges'}.`],
      recall: '$\\sum\\frac1{n^p}$: converges iff $p>1$.',
    };
  },
});

G.push({
  id: 'g-xs-dircomp', topic: 'p-Series & Comparison', diff: 3,
  make(r) {
    const c = r.int(1, 5), k = r.int(2, 3);
    const cases = [
      { s: 1, t: R`\frac{1}{n^{2}+${c}}`, key: R`$0<\frac{1}{n^{2}+${c}}<\frac1{n^{2}}$, and $\sum\frac1{n^{2}}$ converges`,
        bad: [[R`$\frac{1}{n^{2}+${c}}<\frac1n$, and $\sum\frac1n$ diverges`, 'True inequality, but being below a divergent series says nothing.'], [R`$\frac{1}{n^{2}+${c}}>\frac1{n^{3}}$, and $\sum\frac1{n^{3}}$ converges`, 'Wrong direction: above a convergent series says nothing.'], [R`$\frac{1}{n^{2}+${c}}>\frac1{n^{2}+${c}+n}$, and $\sum\frac1{n^{2}+${c}+n}$ converges`, 'Wrong direction again, and the comparison series is no simpler.']] },
      { s: 1, t: R`\frac{1}{3^{n}+${c}}`, key: R`$0<\frac{1}{3^{n}+${c}}<\frac1{3^{n}}$, and $\sum\frac1{3^{n}}$ converges (geometric)`,
        bad: [[R`$\frac{1}{3^{n}+${c}}<\frac1n$, and $\sum\frac1n$ diverges`, 'Below a divergent series: useless.'], [R`$\frac{1}{3^{n}+${c}}>\frac1{4^{n}}$, and $\sum\frac1{4^{n}}$ converges`, 'Above a convergent series: useless.'], [R`$\frac{1}{3^{n}+${c}}>\frac{1}{n^{2}}$, and $\sum\frac1{n^{2}}$ converges`, 'False inequality (exponentials beat $n^2$) and the wrong direction anyway.']] },
      { s: 1, t: R`\frac{2+\sin n}{n^{2}}`, key: R`$0<\frac{2+\sin n}{n^{2}}\le\frac{3}{n^{2}}$, and $\sum\frac3{n^{2}}$ converges`,
        bad: [[R`$\frac{2+\sin n}{n^{2}}\le\frac{3}{n}$, and $\sum\frac3n$ diverges`, 'True but useless: below a divergent series.'], [R`$\frac{2+\sin n}{n^{2}}\ge\frac1{n^{2}}$, and $\sum\frac1{n^{2}}$ converges`, 'Above a convergent series: no conclusion.'], [R`$\frac{2+\sin n}{n^{2}}\le\frac{1}{n^{2}}$, and $\sum\frac{1}{n^{2}}$ converges`, 'False inequality: the numerator is at least $1$ and can be $3$.']] },
      { s: 2, t: R`\frac{1}{\sqrt{n}-1}`, key: R`$\frac{1}{\sqrt n-1}>\frac1{\sqrt n}>0$, and $\sum\frac1{\sqrt n}$ diverges`,
        bad: [[R`$\frac{1}{\sqrt n-1}<\frac{1}{n-1}$, and $\sum\frac1{n-1}$ diverges`, 'False inequality: $n-1>\\sqrt n-1$ makes $\\frac1{n-1}$ the smaller one.'], [R`$\frac{1}{\sqrt n-1}>\frac1{n^{2}}$, and $\sum\frac1{n^{2}}$ converges`, 'Above a convergent series: no conclusion.'], [R`$\frac{1}{\sqrt n-1}<\frac1{\sqrt n}$, and $\sum\frac1{\sqrt n}$ diverges`, 'False inequality: removing 1 from the denominator makes the term bigger.']] },
      { s: 3, t: R`\frac{\ln n}{n}`, key: R`$\frac{\ln n}{n}>\frac1n>0$ for $n\ge3$, and $\sum\frac1n$ diverges`,
        bad: [[R`$\frac{\ln n}{n}<\frac1{\sqrt n}$, and $\sum\frac1{\sqrt n}$ diverges`, 'True but useless: below a divergent series.'], [R`$\frac{\ln n}{n}<\frac1n$, and $\sum\frac1n$ diverges`, 'False for $n\\ge3$ (since $\\ln n>1$).'], [R`$\frac{\ln n}{n}>\frac{1}{n^{2}}$, and $\sum\frac1{n^{2}}$ converges`, 'Above a convergent series: no conclusion.']] },
      { s: 1, t: R`\frac{\cos^{2}n}{n^{${k}}}`, key: R`$0\le\frac{\cos^{2}n}{n^{${k}}}\le\frac{1}{n^{${k}}}$, and $\sum\frac1{n^{${k}}}$ converges`,
        bad: [[R`$\frac{\cos^{2}n}{n^{${k}}}\le\frac1n$, and $\sum\frac1n$ diverges`, 'Below a divergent series: no conclusion.'], [R`$\frac{\cos^{2}n}{n^{${k}}}\ge\frac1{n^{${k}}}$, and $\sum\frac1{n^{${k}}}$ converges`, 'False inequality: $\\cos^2n\\le1$, and it can be $0$.'], [R`$\frac{\cos^{2}n}{n^{${k}}}\ge\frac{1}{n^{${k + 1}}}$, and $\sum\frac1{n^{${k + 1}}}$ converges`, 'False (cosine can be $0$) and the wrong direction anyway.']] },
    ];
    const cs = r.pick(cases);
    const conv = !/diverges$/.test(cs.key);
    return {
      arch: 'direct-comparison', src: 'Exam 2 packet §11.4 Ex 3–30',
      prompt: R`You want to decide whether $\displaystyle\sum_{n=${cs.s}}^{\infty}${cs.t}$ converges. Which direct comparison is **valid and conclusive**?`,
      choices: [K(cs.key), ...cs.bad.map(b => D(b[0], b[1], 'test-logic'))],
      steps: ['Direct Comparison has two useful patterns: **smaller than a convergent series** or **bigger than a divergent series**.', `Here the valid comparison shows the series ${conv ? 'converges' : 'diverges'}.`],
      recall: 'Under a convergent or over a divergent. Every other combination is silent.',
    };
  },
});

G.push({
  id: 'g-xs-compmulti', topic: 'p-Series & Comparison', diff: 3,
  make(r) {
    const T = [
      [R`\dfrac{1}{n^{2}+1}`, 'below $\\sum1/n^2$.'], [R`\dfrac{1}{n^{3/2}}`, '$p=\\frac32>1$.'], [R`\dfrac{1}{2^{n}+1}`, 'below the geometric $\\sum2^{-n}$.'],
      [R`\dfrac{1+\cos n}{n^{2}}`, 'at most $\\frac2{n^2}$.'], [R`\dfrac{n}{n^{4}+3}`, 'about $\\frac1{n^3}$ (LCT or comparison with $\\sum n^{-3}$).'], [R`\dfrac{5}{n^{6/5}}`, '$p=1.2>1$.']];
    const F = [
      [R`\dfrac{1}{\sqrt{n}}`, '$p=\\frac12\\le1$.'], [R`\dfrac{1}{n+1}`, 'above $\\frac1{2n}$ for $n\\ge1$; behaves like $\\sum1/n$.'], [R`\dfrac{\ln n}{n}`, 'above $\\frac1n$ for $n\\ge3$.'],
      [R`\dfrac{3}{\sqrt[3]{n^{2}}}`, '$p=\\frac23\\le1$.'], [R`\dfrac{n}{n^{2}+1}`, 'behaves like $\\frac1n$ (LCT).'], [R`\dfrac{1}{\sqrt{n^{2}-1}}`, 'above $\\frac1n$.']];
    const nt = r.int(2, 3), nf = r.int(2, 3);
    return {
      fmt: 'multi', arch: 'comparison-multi', src: 'Exam 2 packet §11.4',
      prompt: R`Select **all** of the series $\sum_{n=2}^{\infty}a_n$ that converge, where $a_n$ equals:`,
      choices: [...r.some(T, nt).map(x => ({ t: `$${x[0]}$`, ok: true, why: `Converges: ${x[1]}` })),
        ...r.some(F, nf).map(x => ({ t: `$${x[0]}$`, why: `Diverges: ${x[1]}`, err: 'test-logic' }))],
      steps: ['Compare each with a $p$-series or geometric series: bounded above by a convergent one converges; bounded below by a divergent one diverges.'],
      recall: 'Think "$\\approx\\frac1{n^p}$": converges iff $p>1$.',
    };
  },
});

G.push({
  id: 'g-xs-comperr', topic: 'p-Series & Comparison', diff: 3,
  make(r) {
    const c = r.int(1, 5), b = r.int(2, 4);
    if (r.int(0, 1)) {
      return {
        fmt: 'error', arch: 'comparison-error-dir1', src: 'Exam 2 packet §11.4 (trap: direction)',
        prompt: ERRP,
        work: [R`For $n\ge1$: $0<\dfrac{1}{n+${c}}<\dfrac1n$.`, R`The series $\sum\frac1n$ diverges (harmonic).`, R`By the Comparison Test, $\sum\frac{1}{n+${c}}$ diverges.`],
        choices: errCh(3, 2, ['The inequality is true.', 'Correct.', null], 'test-logic', 'There is an error: Line 3.'),
        steps: ['Line 3 is wrong: Comparison needs the given series to be **larger** than the divergent one (or smaller than a convergent one).', R`Here $\frac1{n+${c}}$ is **smaller** than a divergent series: no conclusion. Use LCT with $\frac1n$ instead (limit $1$), which does show divergence.`],
        recall: 'Below a divergent series tells you nothing.',
      };
    }
    return {
      fmt: 'error', arch: 'comparison-error-dir2', src: 'Exam 2 packet §11.4 (trap: direction)',
      prompt: ERRP,
      work: [R`For $n\ge1$: $\dfrac{1}{${b}^{n}-1}>\dfrac1{${b}^{n}}>0$.`, R`The series $\sum\frac1{${b}^{n}}$ is geometric with $r=\frac1${b}$, so it converges.`, R`By the Comparison Test, $\sum\frac1{${b}^{n}-1}$ converges.`],
      choices: errCh(3, 2, ['The inequality is true (the denominator is smaller).', 'Correct.', null], 'test-logic', 'There is an error: Line 3.'),
      steps: ['Line 3 is wrong: the given series is **bigger** than a convergent one. That does not force it to converge.', R`(It happens to converge, but you need LCT with $\frac1{${b}^n}$ (limit $1$) or a different upper bound to prove it.)`],
      recall: 'Above a convergent series tells you nothing.',
    };
  },
});

// =================================================================
// LIMIT COMPARISON
// =================================================================

G.push({
  id: 'g-xs-lctlim', topic: 'Limit Comparison', diff: 3,
  make(r) {
    const k = r.int(0, 3);
    if (k <= 1) {
      const c = lctCase(r), [a, g] = c.L;
      const key = `$${frac(a, g)}$`;
      return {
        fmt: 'free', arch: 'lct-limit', src: 'Exam 2 packet §11.4 Ex 9–16',
        prompt: R`To test $\displaystyle\sum_{n=1}^{\infty}\frac{${c.term.replace(/^\\frac\{/, '').replace(/\}\{.*$/, '')}}{${c.term.replace(/^.*\}\{/, '').replace(/\}$/, '')}}$ by the Limit Comparison Test, take $b_n=${c.bn}$. Compute $L=\lim_{n\to\infty}\dfrac{a_n}{b_n}$.`,
        choices: [K(key), ...choose(key, [
          D(`$${frac(g, a)}$`, 'Inverted: $L=\\lim\\frac{a_n}{b_n}$, so the term\'s coefficient goes on top.', 'inverted'),
          D('$0$', 'Both are the same order, so $L$ is a finite positive number.', 'conceptual'),
          D('$\\infty$', 'Both are the same order, so $L$ is finite.', 'conceptual'),
          D('$1$', `The leading coefficients are ${a} and ${g}, not both $1$.`, 'dropped-factor'),
          D(`$${frac(a + g, g)}$`, 'The lower-order constants vanish in the limit; do not add to the coefficient.', 'algebra-slip')])],
        steps: [R`$\dfrac{a_n}{b_n}=a_n\cdot n^{${c.ptex}}$; divide top and bottom by the dominant power of $n$.`, R`The lower-order constants vanish, leaving $\dfrac{${a}}{${g}}=${frac(a, g)}$.`],
        recall: 'LCT limit = ratio of leading coefficients when degrees match.',
      };
    }
    const m = r.int(2, 6);
    const f = k === 2 ? { t: R`\sin\!\left(\frac{${m}}{n^{2}}\right)`, b: R`\frac{1}{n^{2}}`, L: m, step: R`$\sin t\sim t$ as $t\to0$, so $\sin\frac{${m}}{n^2}\sim\frac{${m}}{n^2}$.` }
      : { t: R`\ln\!\left(1+\frac{${m}}{n}\right)`, b: R`\frac{1}{n}`, L: m, step: R`$\ln(1+t)\sim t$ as $t\to0$, so $\ln\left(1+\frac{${m}}{n}\right)\sim\frac{${m}}{n}$.` };
    const key = `$${f.L}$`;
    return {
      fmt: 'free', arch: 'lct-limit', src: 'Exam 2 packet §11.4 Ex 9–16',
      prompt: R`To test $\displaystyle\sum_{n=1}^{\infty}${f.t}$ by the Limit Comparison Test, take $b_n=${f.b}$. Compute $L=\lim_{n\to\infty}\dfrac{a_n}{b_n}$.`,
      choices: [K(key), ...choose(key, [
        D('$0$', `$a_n\\to0$ but so does $b_n$; the ratio of the two is what matters, and it is not $0$.`, 'conceptual'),
        D('$1$', `The standard limit $\\frac{\\sin t}{t}\\to1$ (or $\\frac{\\ln(1+t)}{t}\\to1$) still leaves the factor ${m} from the argument.`, 'dropped-factor'),
        D(`$${frac(1, m)}$`, 'Inverted: $\\frac{a_n}{b_n}$ has the given term on top.', 'inverted'),
        D('$\\infty$', 'Both terms shrink at the same rate, so the ratio stays finite.', 'conceptual')])],
      steps: [f.step, R`So $\dfrac{a_n}{b_n}\to${m}$.`], recall: 'Small-argument approximations: $\\sin t\\sim t$, $\\ln(1+t)\\sim t$.',
    };
  },
});

G.push({
  id: 'g-xs-lctconc', topic: 'Limit Comparison', diff: 3,
  make(r) {
    const c = lctCase(r), [a, g] = c.L;
    const lt = frac(a, g);
    const keyT = c.conv ? R`Converges: LCT with $b_n=${c.bn}$ gives $L=${lt}\in(0,\infty)$ and $\sum b_n$ converges` : R`Diverges: LCT with $b_n=${c.bn}$ gives $L=${lt}\in(0,\infty)$ and $\sum b_n$ diverges`;
    const wrongB = r.pick([[2, R`\frac1{n^{2}}`], [1, R`\frac1n`]].filter(w => w[0] !== c.p))[1];
    return {
      arch: 'lct-conclusion', src: 'Exam 2 packet §11.4 Ex 9–16',
      prompt: R`Use the Limit Comparison Test to decide whether $\displaystyle\sum_{n=1}^{\infty}${c.term}$ converges or diverges.`,
      choices: [K(keyT), ...choose(keyT, [
        D(c.conv ? R`Diverges: LCT with $b_n=${c.bn}$ gives $L=${lt}$, and $\sum b_n$ diverges` : R`Converges: LCT with $b_n=${c.bn}$ gives $L=${lt}$, and $\sum b_n$ converges`, `The comparison series $b_n=${c.bn}$ is a $p$-series with $p=${c.ptex}$, which ${c.conv ? 'converges' : 'diverges'}. LCT passes that verdict on to $a_n$.`, 'test-logic'),
        D(R`Inconclusive: the limit with $b_n=${wrongB}$ is $0$ or $\infty$`, `The right comparison is $b_n=${c.bn}$; with it $L=${lt}$ is finite and positive, so the test decides.`, 'setup'),
        D(R`Converges to $L=${lt}$`, 'LCT gives only a verdict; $L$ is a ratio of terms, not the sum of the series.', 'test-logic')])],
      steps: [R`Dominant behavior: $a_n\sim\dfrac{${a}}{${g}}\cdot${c.bn}$. Choose $b_n=${c.bn}$ ($p$-series, $p=${c.ptex}$).`, R`$L=\lim\frac{a_n}{b_n}=${lt}$ with $0<L<\infty$.`, `$\\sum b_n$ ${c.conv ? 'converges' : 'diverges'} ($p${c.conv ? '>' : '\\le'}1$), so $\\sum a_n$ does too.`],
      recall: 'LCT: pick $b_n$ = dominant behavior; $0<L<\\infty$ means same verdict.',
    };
  },
});

G.push({
  id: 'g-xs-lcterr', topic: 'Limit Comparison', diff: 4,
  make(r) {
    const c = r.int(1, 6);
    if (r.int(0, 1)) {
      return {
        fmt: 'error', arch: 'lct-error-zero', src: 'Exam 2 packet §11.4 (trap: L = 0)',
        prompt: ERRP,
        work: [R`Let $a_n=\dfrac{1}{n^{2}+${c}}$ and $b_n=\dfrac1n$. Both are positive.`, R`$L=\lim\dfrac{a_n}{b_n}=\lim\dfrac{n}{n^{2}+${c}}=0$.`,
          R`Since $L=0$, the series $\sum a_n$ and $\sum b_n$ behave the same way.`, R`$\sum\frac1n$ diverges, so $\sum\frac1{n^{2}+${c}}$ diverges.`],
        choices: errCh(4, 2, ['Both positive: fine.', 'Limit computed correctly.', null, 'Follows from Line 3.'], 'test-logic', 'There is an error: Line 3.'),
        steps: ['Line 3 is wrong: "same behavior" requires $0<L<\\infty$. With $L=0$ the test gives only: if $\\sum b_n$ converges, so does $\\sum a_n$.', R`Here $\sum b_n$ diverges, so the test is silent. Compare with $\frac1{n^{2}}$ instead: $L=1$ and $\sum\frac1{n^2}$ converges.`],
        recall: 'LCT needs $0<L<\\infty$. $L=0$ or $\\infty$ gives only a one-sided result.',
      };
    }
    return {
      fmt: 'error', arch: 'lct-error-inf', src: 'Exam 2 packet §11.4 (trap: L = infinity)',
      prompt: ERRP,
      work: [R`Let $a_n=\dfrac{1}{n+${c}}$ and $b_n=\dfrac1{n^{2}}$. Both are positive.`, R`$L=\lim\dfrac{a_n}{b_n}=\lim\dfrac{n^{2}}{n+${c}}=\infty$.`,
        R`Since $L$ is not $0$, the two series have the same behavior.`, R`$\sum\frac1{n^{2}}$ converges, so $\sum\frac1{n+${c}}$ converges.`],
      choices: errCh(4, 2, ['Both positive: fine.', 'Limit computed correctly.', null, 'Follows from Line 3.'], 'test-logic', 'There is an error: Line 3.'),
      steps: ['Line 3 is wrong: $L=\\infty$ is not a finite positive number. With $L=\\infty$ you may only conclude: if $\\sum b_n$ **diverges**, so does $\\sum a_n$.', R`In fact $\sum\frac1{n+${c}}$ diverges; use $b_n=\frac1n$ ($L=1$).`],
      recall: '$L=\\infty$: only "$\\sum b_n$ diverges $\\Rightarrow$ $\\sum a_n$ diverges".',
    };
  },
});

// =================================================================
// ALTERNATING SERIES & ERROR
// =================================================================

G.push({
  id: 'g-xs-astcond', topic: 'Alternating Series & Error', diff: 3,
  make(r) {
    const c = r.int(1, 5), a = r.int(2, 4);
    const cases = [
      { b: R`\frac{1}{n+${c}}`, s: 1, ok: true, why: R`$b_n=\frac1{n+${c}}>0$, decreasing, $\to0$.` },
      { b: R`\frac{n}{n+${c}}`, s: 1, ok: false, why: R`$b_n\to1\ne0$: the second AST condition fails, and the terms $(-1)^nb_n$ do not tend to $0$, so the series diverges (Divergence Test).` },
      { b: R`\frac{\ln n}{n}`, s: 3, ok: true, why: R`$b_n=\frac{\ln n}{n}>0$, eventually decreasing ($f'<0$ for $x>e$), $\to0$.` },
      { b: R`\frac{1}{${a}^{n}}`, s: 1, ok: true, why: R`$b_n=${a}^{-n}>0$, decreasing, $\to0$.` },
      { b: R`\sqrt[n]{n}`, s: 1, ok: false, why: '$b_n=n^{1/n}\\to1\\ne0$: the terms do not tend to $0$, so the series diverges (Divergence Test).' },
      { b: R`1+\frac{1}{n}`, s: 1, ok: false, why: '$b_n\\to1\\ne0$: the terms do not tend to $0$, so the series diverges (Divergence Test).' },
    ];
    const cs = r.pick(cases);
    const keyT = cs.ok ? 'Converges by the Alternating Series Test' : 'Diverges (Divergence Test); the AST does not apply since $b_n\\not\\to0$';
    return {
      arch: 'ast-conditions', src: 'Exam 2 packet §11.5',
      prompt: R`Which statement about $\displaystyle\sum_{n=${cs.s}}^{\infty}(-1)^{n}b_n$ with $b_n=${cs.b}$ is correct?`,
      choices: [K(keyT), ...(cs.ok
        ? [D('Diverges, because $\\sum b_n$ diverges', 'The AST does not need $\\sum b_n$ to converge. That would make it absolute convergence.', 'test-logic'),
          D('Diverges, because the terms alternate', 'Alternating is the setup for the AST, not a reason for divergence.', 'conceptual'),
          D('The AST is inconclusive here', 'All three AST conditions hold (positive, decreasing, $\\to0$), so the test decides.', 'conceptual')]
        : [D('Converges by the Alternating Series Test', 'The AST needs $b_n\\to0$; here it does not.', 'test-logic'),
          D('Converges because $b_n$ is decreasing', 'Decreasing alone is not enough: the limit must be $0$.', 'test-logic'),
          D('Converges conditionally', 'It does not converge at all: the terms fail to tend to $0$.', 'test-logic')])],
      steps: [cs.why, cs.ok ? 'The Alternating Series Test applies, so the series converges.' : 'Divergence Test: $\\lim(-1)^nb_n\\ne0$, so the series diverges.'],
      recall: 'AST: $b_n>0$, eventually decreasing, $b_n\\to0$. Fail the limit $\\Rightarrow$ diverges.',
    };
  },
});

G.push({
  id: 'g-xs-asterrn', topic: 'Alternating Series & Error', diff: 4,
  make(r) {
    const fam = r.pick([['p', 2], ['p', 3], ['p', 4], ['fact'], ['two']]);
    const e = r.pick([3, 7, 9]), k = r.int(2, 5);
    const big = 10 ** k;
    const bnum = n => (fam[0] === 'p' ? n ** fam[1] : fam[0] === 'fact' ? [...Array(n)].reduce((x, _, i) => x * (i + 1), 1) : 2 ** n);
    let N = 1;
    while (!(bnum(N + 1) * e > big)) N++;
    const btex = fam[0] === 'p' ? R`\frac{1}{n^{${fam[1]}}}` : fam[0] === 'fact' ? R`\frac{1}{n!}` : R`\frac{1}{2^{n}}`;
    const eps = decimal(e, k);
    const key = `$${N}$`;
    return {
      fmt: 'free', arch: 'ast-error-N', src: 'Exam 2 packet §11.5 Ex 23–26',
      prompt: R`The series $\displaystyle\sum_{n=1}^{\infty}(-1)^{n+1}${btex}$ converges by the AST. Use the Alternating Series Estimation Theorem to find the smallest $N$ such that $|S-s_N|<${eps}$.`,
      choices: [K(key), ...choose(key, [
        D(`$${N + 1}$`, `You solved $b_N<${eps}$ instead of $b_{N+1}<${eps}$. The error after $N$ terms is at most the first **omitted** term $b_{N+1}$.`, 'off-by-one'),
        D(`$${Math.max(N - 1, 1)}$`, `At $N=${Math.max(N - 1, 1)}$ the bound $b_{N+1}=\\frac{1}{${bnum(Math.max(N - 1, 1) + 1)}}$ is not below ${eps}.`, 'off-by-one'),
        D(`$${N + 2}$`, 'That works but is not the smallest $N$.', 'off-by-one'),
        D(`$${bnum(N + 1)}$`, 'You reported the value of the denominator, not the index $N$.', 'conceptual')])],
      steps: [R`$|S-s_N|\le b_{N+1}$ (AST estimation).`, R`Need $b_{N+1}=${fam[0] === 'p' ? R`\frac{1}{(N+1)^{${fam[1]}}}` : fam[0] === 'fact' ? R`\frac{1}{(N+1)!}` : R`\frac{1}{2^{N+1}}`}<${eps}$.`,
        R`Test: $N+1=${N + 1}$ gives $b_{N+1}=\frac1{${bnum(N + 1)}}<${eps}$, while $N+1=${N}$ gives $\frac1{${bnum(N)}}\ge${eps}$. So $N=${N}$.`],
      recall: 'AST error $\\le$ first omitted term $b_{N+1}$, not $b_N$.',
    };
  },
});

G.push({
  id: 'g-xs-astbound', topic: 'Alternating Series & Error', diff: 3,
  make(r) {
    const fam = r.pick([['p', 2], ['p', 3], ['p', 4], ['fact'], ['two']]);
    const N = r.int(3, 6);
    const val = n => (fam[0] === 'p' ? n ** fam[1] : fam[0] === 'fact' ? [...Array(n)].reduce((x, _, i) => x * (i + 1), 1) : 2 ** n);
    const btex = fam[0] === 'p' ? R`\frac{1}{n^{${fam[1]}}}` : fam[0] === 'fact' ? R`\frac{1}{n!}` : R`\frac{1}{2^{n}}`;
    const key = `$\\dfrac{1}{${val(N + 1)}}$`;
    return {
      arch: 'ast-bound', src: 'Exam 2 packet §11.5 Ex 27–30',
      prompt: R`Let $S=\displaystyle\sum_{n=1}^{\infty}(-1)^{n+1}${btex}$ and let $s_${N}$ be its ${N}th partial sum. By the Alternating Series Estimation Theorem, what bound is guaranteed for $|S-s_${N}|$?`,
      choices: [K(key), ...choose(key, [
        D(`$\\dfrac{1}{${val(N)}}$`, `That is $b_{${N}}$, the **last term used**. The bound is the first term **left out**, $b_{${N + 1}}$.`, 'off-by-one'),
        D(`$\\dfrac{1}{${val(N + 2)}}$`, `That is $b_{${N + 2}}$, skipping one term too many.`, 'off-by-one'),
        D(`$\\dfrac{1}{${val(N - 1)}}$`, `That is $b_{${N - 1}}$, going the wrong way.`, 'off-by-one'),
        D(`$\\dfrac{1}{${val(N) + val(N + 1)}}$`, 'The bound is a single term, not a sum or a combination.', 'conceptual')])],
      steps: [R`$|S-s_N|\le b_{N+1}$ for a convergent alternating series with $b_n$ decreasing to $0$.`, R`With $N=${N}$: $b_{${N + 1}}=\frac{1}{${val(N + 1)}}$.`],
      recall: 'Error $\\le$ the first omitted term.',
    };
  },
});

G.push({
  id: 'g-xs-asterror', topic: 'Alternating Series & Error', diff: 3,
  make(r) {
    const k = r.int(0, 2);
    const c = r.int(1, 5);
    if (k === 0) {
      return {
        fmt: 'error', arch: 'ast-error-limit', src: 'Exam 2 packet §11.5',
        prompt: ERRP,
        work: [R`Let $b_n=\dfrac{n+${c}}{n}=1+\dfrac{${c}}{n}$. Then $b_n>0$ and $b_n$ is decreasing.`, R`$\displaystyle\lim_{n\to\infty}b_n=1$.`,
          R`Since $b_n$ is positive and decreasing, the Alternating Series Test shows $\sum(-1)^{n}b_n$ converges.`],
        choices: errCh(3, 2, ['Correct.', 'Correct limit.', null], 'test-logic', 'There is an error: Line 3.'),
        steps: ['Line 3 is wrong: the AST requires $\\lim b_n=0$. Here $\\lim b_n=1$.', 'Since the terms do not tend to $0$, the series diverges by the Divergence Test.'],
        recall: 'AST has three conditions; checking two of three proves nothing.',
      };
    }
    if (k === 1) {
      const p = r.pick([2, 3]), e = r.pick([3, 7, 9]), kk = r.int(2, 4);
      let Nw = 1;
      while (!(Nw ** p * e > 10 ** kk)) Nw++;
      return {
        fmt: 'error', arch: 'ast-error-bound', src: 'Exam 2 packet §11.5 (trap: b_{N+1} vs b_N)',
        prompt: ERRP,
        work: [R`$\sum(-1)^{n+1}\dfrac1{n^{${p}}}$ converges by the AST, so $|S-s_N|\le b_N=\dfrac1{N^{${p}}}$.`, R`Want $\dfrac{1}{N^{${p}}}<${decimal(e, kk)}$, i.e. $N^{${p}}>${(10 ** kk / e).toFixed(1)}$.`, R`The smallest such integer is $N=${Nw}$.`],
        choices: errCh(3, 0, null, 'off-by-one', 'There is an error: Line 1.').map((c2, i) => (c2.ok ? c2 : { ...c2, why: i === 1 ? 'Algebra is fine given Line 1, but Line 1 used the wrong bound.' : 'Arithmetic is fine given the earlier lines.' })),
        steps: [R`Line 1 is wrong: the AST bound is $b_{N+1}$, not $b_N$.`, R`Correct: need $\frac{1}{(N+1)^{${p}}}<${decimal(e, kk)}$, giving $N=${Nw - 1}$.`],
        recall: 'Error after $N$ terms $\\le b_{N+1}$.',
      };
    }
    const m = r.pick([1, 2]);
    const b = m === 1 ? R`\frac{1}{n+${c}}` : R`\frac{1}{\sqrt{n+${c}}}`;
    return {
      fmt: 'error', arch: 'ast-error-abs', src: 'Exam 2 packet §11.5 (trap: AST gives only conditional)',
      prompt: ERRP,
      work: [R`Let $b_n=${b}$. It is positive, decreasing, and $\to0$.`, R`By the Alternating Series Test, $\sum(-1)^{n}${b}$ converges.`, R`Therefore the series converges absolutely.`],
      choices: errCh(3, 2, ['All three AST conditions hold.', 'Correct.', null], 'test-logic', 'There is an error: Line 3.'),
      steps: ['Line 3 is wrong: the AST proves ordinary convergence only.', R`Absolute convergence means $\sum b_n=\sum${b}$ converges, but it behaves like a $p$-series with $p\le1$ and diverges. So the series is only **conditionally** convergent.`],
      recall: 'AST $\\Rightarrow$ converges; absolute needs $\\sum|a_n|$ to converge separately.',
    };
  },
});

// =================================================================
// ABSOLUTE / CONDITIONAL (Alternating Series & Error)
// =================================================================

G.push({
  id: 'g-xs-acd', topic: 'Alternating Series & Error', diff: 3,
  make(r) {
    const cs = acdCase(r);
    const key = VERD[cs.v];
    const whyOf = {
      AC: { CC: 'Conditional means the series converges but $\\sum|a_n|$ diverges. Here $\\sum|a_n|$ converges, which is the stronger absolute convergence.', D: 'Absolute convergence implies convergence, so it cannot diverge.' },
      CC: { AC: '$\\sum|a_n|$ diverges, so it is not absolutely convergent.', D: 'The AST shows $\\sum a_n$ converges, so it is not divergent.' },
      D: { AC: 'A series whose terms do not tend to $0$ cannot converge, absolutely or otherwise.', CC: 'A series whose terms do not tend to $0$ cannot converge, conditionally or otherwise.' },
    }[cs.v];
    const pool = Object.keys(VERD).filter(v => v !== cs.v).map(v => D(VERD[v], whyOf[v], 'test-logic'));
    return {
      arch: 'abs-cond', src: 'Lecture 10-13; Exam 2 packet §11.6',
      prompt: R`Determine whether $\displaystyle\sum_{n=${cs.s}}^{\infty}${cs.term}$ is absolutely convergent, conditionally convergent, or divergent.`,
      choices: [K(key), ...pool, D('Inconclusive: no test applies', 'Some test always decides these series; here the tests above settle it.', 'conceptual')],
      steps: [...cs.steps, acdStep(cs.v)].filter(Boolean),
      recall: 'Test $\\sum|a_n|$ first. If it diverges, try the AST (or the Divergence Test).',
    };
  },
});

G.push({
  id: 'g-xs-acdfree', topic: 'Alternating Series & Error', diff: 4,
  make(r) {
    const cs = acdCase(r);
    const key = VERD[cs.v];
    const whyOf = {
      AC: { CC: '$\\sum|a_n|$ converges, so it is absolutely convergent.', D: 'Absolute convergence implies convergence.' },
      CC: { AC: '$\\sum|a_n|$ diverges, so it is not absolutely convergent.', D: 'It converges by the AST.' },
      D: { AC: 'The terms do not tend to $0$.', CC: 'The terms do not tend to $0$.' },
    }[cs.v];
    return {
      fmt: 'free', accept: ACC[cs.v], arch: 'abs-cond-free', src: 'Lecture 10-13; Exam 2 packet §11.6',
      prompt: R`Determine whether $\displaystyle\sum_{n=${cs.s}}^{\infty}${cs.term}$ converges absolutely, converges conditionally, or diverges. Fully justify. (Type your classification.)`,
      choices: [K(key), ...Object.keys(VERD).filter(v => v !== cs.v).map(v => D(VERD[v], whyOf[v], 'test-logic')),
        D('Inconclusive', 'Absolute convergence, the AST and the Divergence Test together always settle the classification.', 'conceptual')],
      steps: [...cs.steps, acdStep(cs.v)].filter(Boolean),
      recall: 'Absolute first, then AST/Divergence Test.',
    };
  },
});

// =================================================================
// RATIO & ROOT
// =================================================================

G.push({
  id: 'g-xs-ratio', topic: 'Ratio & Root Tests', diff: 3,
  make(r) {
    const c = r.int(2, 5), e = r.int(1, 4);
    const k = r.int(0, 5);
    let term, L, steps, verdict, Lkey;
    if (k === 0) { term = R`\frac{n^{${e}}}{${c}^{n}}`; Lkey = frac(1, c); L = 1 / c; steps = [R`$\frac{a_{n+1}}{a_n}=\left(\frac{n+1}{n}\right)^{${e}}\cdot\frac1${c}\to\frac1${c}$.`]; }
    else if (k === 1) { term = R`\frac{${c}^{n}}{n!}`; Lkey = '0'; L = 0; steps = [R`$\frac{a_{n+1}}{a_n}=\frac{${c}}{n+1}\to0$.`]; }
    else if (k === 2) { term = R`\frac{(n!)^{2}}{(2n)!}`; Lkey = '\\frac14'; L = 0.25; steps = [R`$\frac{a_{n+1}}{a_n}=\frac{(n+1)^{2}}{(2n+2)(2n+1)}=\frac{n+1}{2(2n+1)}\to\frac14$.`]; }
    else if (k === 3) { term = R`\frac{${c}^{n}}{n^{${e}}}`; Lkey = String(c); L = c; steps = [R`$\frac{a_{n+1}}{a_n}=${c}\left(\frac{n}{n+1}\right)^{${e}}\to${c}$.`]; }
    else if (k === 4) { term = R`\frac{n!}{n^{n}}`; Lkey = '\\frac1e'; L = 1 / Math.E; steps = [R`$\frac{a_{n+1}}{a_n}=\frac{(n+1)!\,n^{n}}{(n+1)^{n+1}\,n!}=\left(\frac{n}{n+1}\right)^{n}\to\frac1e$.`]; }
    else { term = R`\frac{3^{n}\,n!}{n^{n}}`; Lkey = '\\frac3e'; L = 3 / Math.E; steps = [R`$\frac{a_{n+1}}{a_n}=3\left(\frac{n}{n+1}\right)^{n}\to\frac3e\approx1.10$.`]; }
    verdict = L < 1 ? 'converges absolutely' : 'diverges';
    const key = `$${Lkey}$`;
    const inv = L === 0 ? '$\\infty$' : k === 3 ? `$${frac(1, c)}$` : k === 4 ? '$e$' : k === 5 ? '$\\frac e3$' : k === 0 ? `$${c}$` : '$4$';
    return {
      fmt: 'free', arch: 'ratio-limit', src: 'Exam 2 packet §11.6; Lecture 10-20',
      prompt: R`For $\displaystyle\sum_{n=1}^{\infty}${term}$, compute $L=\lim_{n\to\infty}\left|\dfrac{a_{n+1}}{a_n}\right|$. (Then decide what the Ratio Test says.)`,
      choices: [K(key), ...choose(key, [
        D(inv, 'Inverted: the Ratio Test uses $\\frac{a_{n+1}}{a_n}$, with the **later** term on top.', 'inverted'),
        D('$1$', 'Many students expect $1$ because $\\frac{n+1}{n}\\to1$; but the exponential or factorial part contributes its own factor.', 'conceptual'),
        D('$\\infty$', 'The ratio shrinks or settles; it does not blow up here unless the base is bigger than the denominator.', 'conceptual'),
        D('$0$', 'Only factorial-over-exponential decay ratios tend to $0$; check the leading factors again.', 'conceptual'),
        D('$e$', 'Recompute the limit of $\\frac{a_{n+1}}{a_n}$ term by term; it is not $e$.', 'algebra-slip'),
        D('$\\frac12$', 'Recompute the limit of $\\frac{a_{n+1}}{a_n}$ term by term; it is not $\\frac12$.', 'algebra-slip')])],
      steps: [...steps, R`$L=${Lkey}${L < 1 ? '<1' : '>1'}$, so the series ${verdict}.`],
      recall: 'Ratio: $L<1$ converges absolutely, $L>1$ diverges, $L=1$ no information.',
    };
  },
});

G.push({
  id: 'g-xs-root', topic: 'Ratio & Root Tests', diff: 3,
  make(r) {
    const al = r.int(1, 4), ga = r.int(1, 5), be = r.int(1, 3), de = r.int(1, 3);
    const k = r.int(0, 4);
    let term, L, why;
    if (k <= 1) {
      term = R`\left(\frac{${al}n+${be}}{${ga}n+${de}}\right)^{n}`;
      L = [al, ga]; why = R`$\sqrt[n]{|a_n|}=\frac{${al}n+${be}}{${ga}n+${de}}\to\frac{${al}}{${ga}}$.`;
    } else if (k === 2) { term = R`\frac{1}{(\ln n)^{n}}`; L = [0, 1]; why = R`$\sqrt[n]{|a_n|}=\frac1{\ln n}\to0$.`; }
    else if (k === 3) { term = R`\left(\frac{n}{${al + 1}}\right)^{n}`; L = [1, 0]; why = R`$\sqrt[n]{|a_n|}=\frac{n}{${al + 1}}\to\infty$.`; }
    else { term = R`\frac{${al + 2}^{n}}{n^{n}}`; L = [0, 1]; why = R`$\sqrt[n]{|a_n|}=\frac{${al + 2}}{n}\to0$.`; }
    const Lval = L[1] === 0 ? Infinity : L[0] / L[1];
    const ltex = L[1] === 0 ? '\\infty' : L[0] === 0 ? '0' : frac(L[0], L[1]);
    const v = Lval < 1 ? 'conv' : Lval > 1 ? 'div' : 'inc';
    const T = {
      conv: `Converges absolutely: $L=${ltex}<1$`, div: `Diverges: $L=${ltex}>1$`, inc: 'Inconclusive: $L=1$',
    };
    const whys = {
      conv: 'With $L<1$ the Root Test gives (absolute) convergence.', div: 'With $L>1$ the Root Test gives divergence.',
      inc: `$L=\\frac{${al}}{${ga}}=1$ is exactly the borderline, where the Root Test says nothing.`,
    };
    return {
      arch: 'root-test', src: 'Exam 2 packet §11.6',
      prompt: R`Apply the Root Test to $\displaystyle\sum_{n=1}^{\infty}${term}$. What does it conclude?`,
      choices: [K(T[v]), ...Object.keys(T).filter(x => x !== v).map(x => D(T[x].replace(/L=[^<>$]*/, `L=${ltex}`), `You compared $L=${ltex}$ to $1$ the wrong way. ${whys[v]}`, 'test-logic')),
        D('The Root Test cannot be applied because the series is not alternating', 'The Root Test applies to any series; it does not need alternating signs.', 'conceptual')].slice(0, 4),
      steps: [why, whys[v]],
      recall: 'Root Test: $L=\\lim\\sqrt[n]{|a_n|}$; $<1$ converges absolutely, $>1$ diverges, $=1$ silent.',
    };
  },
});

G.push({
  id: 'g-xs-ratioerr', topic: 'Ratio & Root Tests', diff: 3,
  make(r) {
    const k = r.int(0, 2);
    const p = r.int(1, 3), c = r.int(2, 5), e = r.int(1, 3);
    if (k === 0) {
      return {
        fmt: 'error', arch: 'ratio-error-L1', src: 'Exam 2 packet §11.6 (trap: L = 1)',
        prompt: ERRP,
        work: [R`Let $a_n=\dfrac{1}{n^{${p + 1}}}$. Then $\left|\dfrac{a_{n+1}}{a_n}\right|=\left(\dfrac{n}{n+1}\right)^{${p + 1}}$.`, R`$L=\displaystyle\lim_{n\to\infty}\left(\frac{n}{n+1}\right)^{${p + 1}}=1$.`, R`Since $L=1$, the series diverges by the Ratio Test.`],
        choices: errCh(3, 2, ['Ratio set up correctly.', 'Limit correct.', null], 'test-logic', 'There is an error: Line 3.'),
        steps: ['Line 3 is wrong: $L=1$ means the Ratio Test is **inconclusive**.', R`The series is a $p$-series with $p=${p + 1}>1$, so it actually **converges**. Ratio/Root always give $L=1$ on $\sum\frac1{n^p}$.`],
        recall: '$L=1$: use another test. Ratio never works on $\\frac1{n^p}$.',
      };
    }
    if (k === 1) {
      return {
        fmt: 'error', arch: 'ratio-error-cond', src: 'Exam 2 packet §11.6',
        prompt: ERRP,
        work: [R`Let $a_n=\dfrac{(-1)^{n}${c}^{n}}{n!}$. Then $\left|\dfrac{a_{n+1}}{a_n}\right|=\dfrac{${c}}{n+1}$.`, R`$L=\displaystyle\lim_{n\to\infty}\frac{${c}}{n+1}=0<1$.`, R`So the series converges by the Ratio Test, and since it alternates it converges conditionally.`],
        choices: errCh(3, 2, ['Ratio set up correctly (absolute values).', 'Limit correct.', null], 'test-logic', 'There is an error: Line 3.'),
        steps: ['Line 3 is wrong: the Ratio Test with $L<1$ shows $\\sum|a_n|$ converges, i.e. **absolute** convergence.', 'Conditional convergence requires $\\sum|a_n|$ to diverge, which is not the case here.'],
        recall: 'Ratio/Root with $L<1$ means absolutely convergent.',
      };
    }
    return {
      fmt: 'error', arch: 'ratio-error-invert', src: 'Exam 2 packet §11.6',
      prompt: ERRP,
      work: [R`Let $a_n=\dfrac{n^{${e}}}{${c}^{n}}$. Compute $\left|\dfrac{a_{n}}{a_{n+1}}\right|=${c}\left(\dfrac{n}{n+1}\right)^{${e}}$.`, R`$L=\displaystyle\lim_{n\to\infty}${c}\left(\frac{n}{n+1}\right)^{${e}}=${c}>1$.`, R`So the series diverges by the Ratio Test.`],
      choices: errCh(3, 0, null, 'inverted', 'There is an error: Line 1.').map((c2, i) => (c2.ok ? c2 : { ...c2, why: i === 1 ? 'Arithmetic matches Line 1 but Line 1 inverted the ratio.' : 'The verdict follows from the (wrong) $L$ in Line 2.' })),
      steps: [R`Line 1 is wrong: the Ratio Test uses $\frac{a_{n+1}}{a_n}$, not its reciprocal. The correct limit is $\frac1${c}<1$.`, 'So the series actually **converges absolutely**.'],
      recall: 'Ratio Test: later term over earlier term.',
    };
  },
});

G.push({
  id: 'g-xs-ratiomulti', topic: 'Ratio & Root Tests', diff: 3,
  make(r) {
    const c = r.int(2, 5);
    const Y = [
      [R`\dfrac{${c}^{n}}{n!}`, '$L=0$.'], [R`\dfrac{n!}{${c + 3}^{n}}`, '$L=\\infty$.'], [R`\dfrac{n^{3}}{${c}^{n}}`, `$L=\\frac1${c}$.`],
      [R`\dfrac{${c}^{n}}{n^{2}}`, `$L=${c}$.`], [R`\dfrac{(2n)!}{(n!)^{2}}`, '$L=4$.']];
    const N = [
      [R`\dfrac{1}{n^{2}}`, '$L=1$.'], [R`\dfrac{1}{n^{2}+1}`, '$L=1$.'], [R`\dfrac{\ln n}{n}`, '$L=1$.'],
      [R`\dfrac{1}{\sqrt{n}}`, '$L=1$.'], [R`\dfrac{n+1}{n^{3}}`, '$L=1$.']];
    return {
      fmt: 'multi', arch: 'ratio-multi', src: 'Exam 2 packet §11.6',
      prompt: R`Select **all** series for which the Ratio Test is **conclusive** (gives a verdict). Here $a_n$ equals:`,
      choices: [...r.some(Y, r.int(2, 3)).map(x => ({ t: `$${x[0]}$`, ok: true, why: `${x[1]} Not $1$, so the Ratio Test decides.` })),
        ...r.some(N, r.int(2, 3)).map(x => ({ t: `$${x[0]}$`, why: `${x[1]} Rational functions in $n$ (and logs) always give $L=1$: inconclusive.`, err: 'test-logic' }))],
      steps: ['Ratio Test decides only when $L\\ne1$. Powers of $n$ (and logs) give $L=1$; exponentials and factorials give $L\\ne1$.'],
      recall: 'Ratio shines on factorials and exponentials; it is useless on $n^p$ and $\\ln n$ terms.',
    };
  },
});

// =================================================================
// CHOOSING A TEST
// =================================================================

G.push({
  id: 'g-xs-pick', topic: 'Choosing a Test', diff: 3,
  make(r) {
    const c = r.int(2, 5), a = r.int(2, 4);
    const cases = [
      { s: 1, t: R`\frac{${c}^{n}}{n!}`, key: 'Ratio Test', why: 'Factorial and exponential: the ratio cancels almost everything.',
        bad: [['Integral Test', 'No usable antiderivative for $n!$.'], ['Limit Comparison Test', 'There is no $p$-series or geometric series with the same growth to compare against.'], ['Alternating Series Test', 'The terms are all positive; nothing alternates.']] },
      { s: 1, t: R`\left(\frac{n}{${a}n+1}\right)^{n}`, key: 'Root Test', why: 'The whole term is raised to the $n$th power.',
        bad: [['Ratio Test', 'Possible but ugly: $(n+1)$-st powers of a rational function do not cancel.'], ['Integral Test', '$f(x)=(\\ldots)^x$ is very hard to integrate.'], ['Alternating Series Test', 'The terms are positive.']] },
      { s: 2, t: R`\frac{1}{n(\ln n)^{${a}}}`, key: 'Integral Test', why: 'The substitution $u=\\ln x$ integrates it immediately.',
        bad: [['Ratio Test', '$L=1$: inconclusive.'], ['Root Test', '$L=1$: inconclusive.'], ['Divergence Test', 'The terms tend to $0$, so it says nothing.']] },
      { s: 1, t: R`\frac{n^{2}+${c}}{n^{3}+n+${a}}`, key: 'Limit Comparison Test (with $\\frac1n$)', why: 'Behaves like $\\frac1n$; LCT handles lower-order terms cleanly.',
        bad: [['Ratio Test', '$L=1$ for any rational function: inconclusive.'], ['Root Test', '$L=1$: inconclusive.'], ['Alternating Series Test', 'Not alternating.']] },
      { s: 1, t: R`\frac{n}{${c}n+${a}}`, key: 'Divergence Test', why: R`$a_n\to\frac1${c}\ne0$.`,
        bad: [['Ratio Test', '$L=1$: inconclusive.'], ['Alternating Series Test', 'The terms are positive.'], ['Integral Test', 'The integral diverges but the Divergence Test is immediate; also the integral is not easier.']] },
      { s: 1, t: R`\frac{(-1)^{n}}{\sqrt{n}+${c}}`, key: 'Alternating Series Test', why: 'Alternating with $b_n$ decreasing to $0$.',
        bad: [['Ratio Test', '$L=1$: inconclusive.'], ['Divergence Test', 'The terms tend to $0$, so it is silent.'], ['Integral Test', 'Not a positive-term series.']] },
      { s: 1, t: R`\frac{2+\sin n}{n^{2}}`, key: 'Direct Comparison Test (with $\\frac3{n^2}$)', why: '$\\sin n$ is bounded, so a clean upper bound exists.',
        bad: [['Limit Comparison Test', '$\\frac{2+\\sin n}{n^2}\\big/\\frac1{n^2}$ has no limit.'], ['Ratio Test', 'The ratio of consecutive terms does not settle.'], ['Alternating Series Test', 'The sign does not alternate.']] },
      { s: 1, t: R`\frac{${c}}{n(n+1)}`, key: 'Partial fractions and telescoping', why: 'Telescoping gives the exact sum.',
        bad: [['Ratio Test', '$L=1$: inconclusive.'], ['Divergence Test', 'The terms tend to $0$: silent.'], ['Alternating Series Test', 'Not alternating.']] },
    ];
    const cs = r.pick(cases);
    return {
      arch: 'choose-test', src: 'Exam 2 packet §11.7 Ex 1–40 (decide which test to use)',
      prompt: R`Which test is the most direct way to decide whether $\displaystyle\sum_{n=${cs.s}}^{\infty}${cs.t}$ converges?`,
      choices: [K(cs.key), ...cs.bad.map(b => D(b[0], b[1], 'test-logic'))],
      steps: [cs.why, 'Match the form of the term to the test: factorial/exponential $\\to$ Ratio; $n$th powers $\\to$ Root; $\\ln$/integrable $\\to$ Integral; rational $\\to$ LCT; alternating $\\to$ AST.'],
      recall: 'Factorial/exp: Ratio. $n$th power: Root. Rational: LCT. Alternating: AST. $a_n\\not\\to0$: Divergence.',
    };
  },
});

G.push({
  id: 'g-xs-pickmulti', topic: 'Choosing a Test', diff: 4,
  make(r) {
    const Y = [
      [R`\dfrac{(-1)^{n}}{n^{2}}`, 'AC: $\\sum\\frac1{n^2}$ converges.'], [R`\dfrac{(-1)^{n}n}{3^{n}}`, 'AC: ratio $\\to\\frac13$.'], [R`\dfrac{\sin n}{n^{2}}`, 'AC: $|a_n|\\le\\frac1{n^2}$.'],
      [R`\dfrac{(-1)^{n}}{n!}`, 'AC: ratio $\\to0$.'], [R`\dfrac{(-1)^{n}}{n^{3/2}}`, 'AC: $p=\\frac32>1$.']];
    const N = [
      [R`\dfrac{(-1)^{n}}{n}`, 'Conditionally convergent: $\\sum\\frac1n$ diverges.'], [R`\dfrac{(-1)^{n}}{\sqrt{n}}`, 'Conditionally convergent: $p=\\frac12$.'], [R`(-1)^{n}\dfrac{n}{n+1}`, 'Divergent: terms $\\not\\to0$.'],
      [R`\dfrac{(-1)^{n}\ln n}{n}`, 'Conditionally convergent: $\\frac{\\ln n}{n}>\\frac1n$.'], [R`\dfrac{(-1)^{n}}{\ln n}`, 'Conditionally convergent: $\\frac1{\\ln n}>\\frac1n$.']];
    return {
      fmt: 'multi', arch: 'abs-multi', src: 'Lecture 10-13; Exam 2 packet §11.6',
      prompt: R`Select **all** of the series $\sum a_n$ that are **absolutely** convergent, where $a_n$ equals (start $n=2$):`,
      choices: [...r.some(Y, r.int(2, 3)).map(x => ({ t: `$${x[0]}$`, ok: true, why: x[1] })),
        ...r.some(N, r.int(2, 3)).map(x => ({ t: `$${x[0]}$`, why: `Not absolutely convergent. ${x[1]}`, err: 'test-logic' }))],
      steps: ['Check $\\sum|a_n|$: $p$-series, comparison, or ratio. Conditionally convergent and divergent series both fail.'],
      recall: 'Absolute = the series of absolute values converges.',
    };
  },
});

G.push({
  id: 'g-xs-cdfree', topic: 'Choosing a Test', diff: 4,
  make(r) {
    const c = r.int(2, 4);
    const S = [
      [R`\left(\frac{n}{n+1}\right)^{n}`, 1, false, 'Divergence Test: $a_n\\to\\frac1e\\ne0$.'],
      [R`\frac{n^{2}}{${c}^{n}}`, 1, true, 'Ratio Test: $L=\\frac1' + c + '<1$.'],
      [R`\frac{1}{\sqrt{n^{3}+${c}}}`, 1, true, 'LCT with $\\frac1{n^{3/2}}$ ($p=\\frac32>1$).'],
      [R`\frac{1}{n\sqrt{\ln n}}`, 2, false, 'Integral Test: $\\int\\frac{dx}{x\\sqrt{\\ln x}}=2\\sqrt{\\ln x}\\to\\infty$.'],
      [R`\frac{n!}{${c}^{n}}`, 1, false, 'Ratio Test: $L=\\infty$ (or Divergence Test: terms $\\to\\infty$).'],
      [R`\frac{\ln n}{n^{2}}`, 1, true, 'Comparison: $\\ln n<\\sqrt n$, so $a_n<\\frac1{n^{3/2}}$.'],
      [R`\frac{1}{\sqrt[3]{n}}`, 1, false, '$p$-series with $p=\\frac13\\le1$.'],
      [R`\frac{${c}^{n}+3^{n}}{6^{n}}`, 1, true, 'Sum of two convergent geometric series.'],
      [R`\frac{\arctan n}{n^{2}}`, 1, true, '$\\arctan n<\\frac\\pi2$, so $a_n<\\frac{\\pi/2}{n^2}$.'],
      [R`\frac{1}{\ln n}`, 2, false, 'Comparison: $\\ln n<n$, so $\\frac1{\\ln n}>\\frac1n$.'],
    ];
    const s = r.pick(S);
    const key = s[2] ? 'Converges' : 'Diverges';
    return {
      fmt: 'free', accept: s[2] ? ['converges', 'convergent', 'converge', 'it converges'] : ['diverges', 'divergent', 'diverge', 'it diverges'], arch: 'cd-free', src: 'Exam 2 packet §11.7 (strategy)',
      prompt: R`Determine whether $\displaystyle\sum_{n=${s[1]}}^{\infty}${s[0]}$ converges or diverges. Name the test you use. (Type "converges" or "diverges".)`,
      choices: [K(key), D(s[2] ? 'Diverges' : 'Converges', s[2] ? 'The tests show convergence; check again which test applies.' : 'The tests show divergence; check again which test applies.', 'test-logic'),
        D('Converges conditionally', 'All terms are positive, so there is no "conditional" convergence here.', 'conceptual'),
        D('Inconclusive', 'At least one of the tests in this unit decides it.', 'conceptual')],
      steps: [s[3], `So the series ${s[2] ? 'converges' : 'diverges'}.`],
      recall: 'Match the test to the form of the term; always check the Divergence Test first.',
    };
  },
});

// =================================================================
// SERIES TEST LOGIC (checkins)
// =================================================================

const LOGIC = [
  { q: R`If $\lim_{n\to\infty}a_n=0$, then $\sum a_n$ converges.`, v: false, why: 'The harmonic series $\\sum\\frac1n$ has $a_n\\to0$ yet diverges. $a_n\\to0$ is necessary, never sufficient.' },
  { q: R`If $\lim_{n\to\infty}a_n\ne0$, then $\sum a_n$ diverges.`, v: true, why: 'This is the Divergence Test (contrapositive of "convergent series have $a_n\\to0$").' },
  { q: R`If $\sum|a_n|$ converges, then $\sum a_n$ converges.`, v: true, why: 'Absolute convergence implies convergence.' },
  { q: R`If $\sum a_n$ converges, then $\sum|a_n|$ converges.`, v: false, why: '$\\sum\\frac{(-1)^n}{n}$ converges (AST) but $\\sum\\frac1n$ diverges: conditional convergence.' },
  { q: R`If $0\le a_n\le b_n$ and $\sum b_n$ diverges, then $\sum a_n$ diverges.`, v: false, why: 'Smaller than a divergent series proves nothing: $\\frac1{n^2}\\le\\frac1n$, yet $\\sum\\frac1{n^2}$ converges.' },
  { q: R`If $0\le a_n\le b_n$ and $\sum b_n$ converges, then $\sum a_n$ converges.`, v: true, why: 'This is the Direct Comparison Test: bounded above by a convergent series.' },
  { q: R`If the Ratio Test gives $L=1$, then the series diverges.`, v: false, why: '$L=1$ is inconclusive: $\\sum\\frac1{n^2}$ converges and $\\sum\\frac1n$ diverges, both with $L=1$.' },
  { q: R`If $\sum a_n$ and $\sum b_n$ both diverge, then $\sum(a_n+b_n)$ diverges.`, v: false, why: 'Take $a_n=1$ and $b_n=-1$: both diverge but $a_n+b_n=0$ sums to $0$.' },
  { q: R`If $\sum a_n$ converges and $\sum b_n$ diverges, then $\sum(a_n+b_n)$ diverges.`, v: true, why: 'Otherwise $b_n=(a_n+b_n)-a_n$ would be a difference of convergent series, hence convergent.' },
  { q: R`If $b_n$ is not decreasing, then $\sum(-1)^nb_n$ diverges.`, v: false, why: 'The AST is a sufficient condition only; failing it means the AST is inconclusive. (E.g. a series with $b_n$ eventually decreasing after a few increases still converges.)' },
  { q: R`If $\sum a_n$ is conditionally convergent, then $\sum|a_n|$ diverges.`, v: true, why: 'By definition: $\\sum a_n$ converges but $\\sum|a_n|$ diverges.' },
  { q: R`If $\sum a_n$ converges, then $\lim a_n=0$.`, v: true, why: 'Convergent series have terms tending to $0$ (the converse is false).' },
  { q: R`In the Limit Comparison Test, if $L=0$ and $\sum b_n$ diverges, then $\sum a_n$ diverges.`, v: false, why: 'With $L=0$ the test only works if $\\sum b_n$ **converges**. A divergent $b_n$ gives no information.' },
  { q: R`If $\lim\sqrt[n]{|a_n|}<1$, then $\sum a_n$ converges absolutely.`, v: true, why: 'This is the Root Test.' },
  { q: R`$\sum\frac{1}{n^p}$ converges if and only if $p>1$.`, v: true, why: 'The $p$-series test (compare with $\\int_1^\\infty x^{-p}dx$).' },
  { q: R`If $\int_1^{\infty}f(x)\,dx=3$ for a positive decreasing $f$ with $a_n=f(n)$, then $\sum_{n=1}^{\infty}a_n=3$.`, v: false, why: 'The Integral Test gives only convergence. The sum is different (e.g. $\\sum\\frac1{n^2}\\approx1.645\\ne1$).' },
];

G.push({
  id: 'g-xs-logic-tf', topic: 'Series Test Logic', unit: 'checkins', diff: 3,
  make(r) {
    const s = r.pick(LOGIC);
    const T = { t: 'True', ok: s.v }, F = { t: 'False', ok: !s.v };
    (s.v ? F : T).why = s.why;
    (s.v ? F : T).err = 'test-logic';
    return {
      tf: true, arch: 'logic-tf', src: 'Check-in style (series test logic); Exam 2 packet §11.2–11.7',
      prompt: `**True or false?**  ${s.q}`,
      choices: [T, F],
      keyWhy: s.why,
      steps: [s.why],
      recall: 'Know each test\'s exact hypotheses and what it can and cannot conclude.',
      hints: ['Try the standard counterexample: $\\sum\\frac1n$ or $\\sum\\frac{(-1)^n}{n}$.'],
    };
  },
});

G.push({
  id: 'g-xs-logic-multi', topic: 'Series Test Logic', unit: 'checkins', diff: 4,
  make(r) {
    const T = LOGIC.filter(x => x.v), F = LOGIC.filter(x => !x.v);
    const nt = r.int(2, 3), nf = r.int(2, 3);
    return {
      fmt: 'multi', arch: 'logic-multi', src: 'Check-in style (series test logic)',
      prompt: 'Select **all** statements that are **true**.',
      choices: [...r.some(T, nt).map(x => ({ t: x.q, ok: true, why: x.why })),
        ...r.some(F, nf).map(x => ({ t: x.q, why: x.why, err: 'test-logic' }))],
      steps: ['Check each claim against the exact statement of the relevant test. For false ones, find the standard counterexample.'],
      recall: 'True claims are theorems; false ones have a one-line counterexample.',
    };
  },
});

G.push({
  id: 'g-xs-logic-err', topic: 'Series Test Logic', unit: 'checkins', diff: 4,
  make(r) {
    const c = r.int(1, 5);
    const k = r.int(0, 2);
    if (k === 0) {
      return {
        fmt: 'error', arch: 'logic-error-div', src: 'Check-in style (Divergence Test misuse)',
        prompt: ERRP,
        work: [R`Consider $\sum_{n=1}^{\infty}\dfrac{1}{n+${c}}$. Here $\lim_{n\to\infty}a_n=0$.`, R`The terms are positive and decreasing.`, R`By the Divergence Test, since $\lim a_n=0$ the series converges.`],
        choices: errCh(3, 2, ['The limit is $0$.', 'True: the terms are positive and decreasing.', null], 'test-logic', 'There is an error: Line 3.'),
        steps: ['Line 3 is wrong: the Divergence Test never proves convergence. $\\lim a_n=0$ means the test is inconclusive.', R`In fact $\sum\frac1{n+${c}}$ diverges (LCT with $\frac1n$).`],
        recall: '$a_n\\to0$ is necessary, not sufficient.',
      };
    }
    if (k === 1) {
      return {
        fmt: 'error', arch: 'logic-error-abs', src: 'Check-in style (abs vs conditional)',
        prompt: ERRP,
        work: [R`Consider $\sum_{n=1}^{\infty}\dfrac{(-1)^{n}}{n+${c}}$.`, R`Its absolute-value series $\sum\dfrac1{n+${c}}$ diverges.`, R`Since the absolute-value series diverges, the original series diverges.`],
        choices: errCh(3, 2, ['Setup.', 'True: compare with the harmonic series.', null], 'test-logic', 'There is an error: Line 3.'),
        steps: ['Line 3 is wrong: divergence of $\\sum|a_n|$ says nothing about $\\sum a_n$.', R`$b_n=\frac1{n+${c}}$ decreases to $0$, so the AST shows $\sum\frac{(-1)^n}{n+${c}}$ converges: it is **conditionally convergent**.`],
        recall: '$\\sum|a_n|$ diverges $\\Rightarrow$ check the AST; it may be conditional.',
      };
    }
    return {
      fmt: 'error', arch: 'logic-error-lct', src: 'Check-in style (LCT misuse)',
      prompt: ERRP,
      work: [R`Let $a_n=\dfrac{n+${c}}{n^{2}+1}$ and $b_n=\dfrac1n$. Then $L=\lim\dfrac{a_n}{b_n}=1$, a finite positive number.`, R`The series $\sum\frac1n$ converges because $p=1\ge1$.`, R`By the Limit Comparison Test, $\sum a_n$ converges.`],
      choices: errCh(3, 1, ['$L=1$ is correct.', null, 'Follows from Line 2.'], 'test-logic', 'There is an error: Line 2.'),
      steps: ['Line 2 is wrong: $p$-series converge iff $p>1$. With $p=1$ the harmonic series **diverges**.', 'So LCT gives: $\\sum a_n$ diverges.'],
      recall: '$p=1$ diverges. Cutoff: converges iff $p>1$.',
    };
  },
});

// =================================================================
// STATIC (modeled on exam/packet problems)
// =================================================================

P.push({
  id: 'x-s-decimal-73', topic: 'Geometric & Telescoping', diff: 2, fmt: 'free', arch: 'decimal-geom', exam: true,
  src: 'Exam 2 packet §11.2 Ex 40–41 (repeating decimals as geometric sums)',
  prompt: 'Express $0.\\overline{73}=0.73737373\\ldots$ as a geometric series and write it as a fraction of integers.',
  choices: [K('$\\dfrac{73}{99}$'), D('$\\dfrac{73}{100}$', 'This is the terminating decimal $0.73$; the repetition changes the denominator to $99$.', 'conceptual'),
    D('$\\dfrac{73}{90}$', 'The ratio is $\\frac1{100}$, so $1-r=\\frac{99}{100}$, not $\\frac{90}{100}$.', 'algebra-slip'), D('$\\dfrac{73}{999}$', 'Three-digit repeats give $999$; two digits give $99$.', 'formula-confusion')],
  steps: ['$0.\\overline{73}=\\frac{73}{100}+\\frac{73}{100^2}+\\cdots$, geometric with $a=\\frac{73}{100}$, $r=\\frac1{100}$.', '$S=\\dfrac{73/100}{1-1/100}=\\dfrac{73}{99}$.'],
  recall: 'Block of $k$ digits: block over $10^k-1$.', hints: ['Identify $a$ and $r$ first.'],
});

P.push({
  id: 'x-s-tele-3', topic: 'Geometric & Telescoping', diff: 3, fmt: 'free', arch: 'telescoping-sum', exam: true,
  src: 'Exam 2 packet §11.2 Ex 9 (telescoping, partial fractions)',
  prompt: 'Show that the series telescopes and find its sum: $\\displaystyle\\sum_{n=1}^{\\infty}\\frac{3}{n(n+3)}$.',
  choices: [K('$\\dfrac{11}{6}$'), D('$1$', 'Only the first term $1$ of the partial fraction survives? The first **three** terms survive: $1+\\frac12+\\frac13$.', 'conceptual'), D('$\\dfrac{11}{2}$', 'You forgot the $\\frac13$ from the partial fractions: $\\frac{3}{n(n+3)}=\\frac1n-\\frac1{n+3}$ already includes the 3.', 'dropped-factor'), D('$\\dfrac{3}{2}$', 'This is $1+\\frac12$; the third term $\\frac13$ also survives.', 'off-by-one')],
  steps: ['$\\dfrac{3}{n(n+3)}=\\dfrac1n-\\dfrac1{n+3}$.', '$s_N=\\left(1+\\frac12+\\frac13\\right)-\\left(\\frac1{N+1}+\\frac1{N+2}+\\frac1{N+3}\\right)\\to\\frac{11}{6}$.'],
  recall: 'Gap 3: three terms survive.',
});

P.push({
  id: 'x-s-geom-sum', topic: 'Geometric & Telescoping', diff: 2, fmt: 'free', arch: 'geom-sum', exam: true,
  src: 'Exam 2 packet §11.2 Ex 11–14',
  prompt: 'Find the sum of $\\displaystyle\\sum_{n=0}^{\\infty}\\frac{2^{n+1}}{3^{n}}$.',
  choices: [K('$6$'), D('$3$', '$\\sum(2/3)^n=3$, but the numerator is $2\\cdot2^n$, so multiply by $2$.', 'dropped-factor'), D('$2$', 'The first term is $2$ but the sum is first term over $1-r$.', 'conceptual'), D('$4$', 'Check: $\\frac{2}{1-2/3}=6$, not $4$.', 'algebra-slip')],
  steps: ['Rewrite: $\\frac{2^{n+1}}{3^n}=2\\left(\\frac23\\right)^n$, geometric with $a=2$, $r=\\frac23$.', '$S=\\frac{2}{1-2/3}=6$.'],
  recall: '$S=\\frac{a}{1-r}$ with the first term at the actual start.',
});

P.push({
  id: 'x-s-cos-seq', topic: 'Sequences', diff: 2, arch: 'seq-converge', exam: true,
  src: 'Exam 2 packet §11.1 Ex 15–16 (cos(nπ/3), first nine terms)',
  prompt: 'The first nine terms of $a_n=\\cos\\left(\\frac{n\\pi}{3}\\right)$ are $\\frac12,-\\frac12,-1,-\\frac12,\\frac12,1,\\frac12,-\\frac12,-1$. Does the sequence converge? Explain.',
  choices: [K('No: the terms cycle through six values forever, so there is no limit'), D('Yes, to $0$, since $\\frac{n\\pi}{3}\\to\\infty$', 'Cosine of a growing angle does not tend to $0$; it keeps cycling.', 'conceptual'), D('Yes, to $\\frac12$, the first term', 'A limit is not the first term; the terms keep changing.', 'conceptual'), D('Yes, since the terms are bounded', 'Bounded does not imply convergent (it can oscillate).', 'test-logic')],
  steps: ['The sequence is periodic with period $6$ and takes six different values.', 'A convergent sequence has terms that eventually all lie near one number; these do not. Diverges.'],
  recall: 'Periodic non-constant sequences diverge.',
});

P.push({
  id: 'x-s-div-misuse', topic: 'Divergence & Integral Tests', diff: 3, tf: true, arch: 'div-misuse', exam: true,
  src: 'Exam 2 packet §11.2; Lecture "Divergence Test" (09-24)',
  prompt: '**True or false?**  Because $\\lim_{n\\to\\infty}\\dfrac{1}{n}=0$, the Divergence Test shows that $\\sum_{n=1}^{\\infty}\\dfrac1n$ converges.',
  choices: [{ t: 'True', why: 'The Divergence Test cannot prove convergence.', err: 'test-logic' }, K('False')],
  keyWhy: 'The Divergence Test only proves divergence when $\\lim a_n\\ne0$. When $\\lim a_n=0$ it is inconclusive, and in fact $\\sum\\frac1n$ diverges (Integral Test).',
  steps: ['$a_n\\to0$ is necessary for convergence, not sufficient.', 'Integral Test: $\\int_1^\\infty\\frac{dx}{x}=\\infty$.'], recall: '$a_n\\to0$ does not mean the series converges.',
});

P.push({
  id: 'x-s-integral-lnln', topic: 'Divergence & Integral Tests', diff: 3, arch: 'integral-test', exam: true,
  src: 'Exam 2 packet §11.3 Ex 3–8',
  prompt: 'Use the Integral Test to determine whether $\\displaystyle\\sum_{n=2}^{\\infty}\\frac{1}{n(\\ln n)^{2}}$ converges. Fully justify.',
  choices: [K('Converges: $\\int_2^\\infty\\frac{dx}{x(\\ln x)^2}=\\frac1{\\ln2}$ is finite'), D('Diverges: it behaves like the harmonic series', 'The extra $(\\ln n)^2$ makes terms smaller enough: the integral is $\\left[-\\frac1{\\ln x}\\right]_2^\\infty=\\frac1{\\ln 2}$.', 'test-logic'), D('Diverges: the integral equals $\\infty$', 'With $u=\\ln x$ the integral is $\\int u^{-2}du$, which converges.', 'algebra-slip'), D('Converges, with sum $\\frac1{\\ln2}$', 'The Integral Test gives a verdict only, never the sum.', 'test-logic')],
  steps: ['$f(x)=\\frac{1}{x(\\ln x)^2}$ is positive, continuous, decreasing on $[2,\\infty)$.', '$u=\\ln x$: $\\int_2^\\infty\\frac{dx}{x(\\ln x)^2}=\\int_{\\ln2}^\\infty u^{-2}du=\\frac1{\\ln 2}$.', 'Finite, so the series converges.'],
  recall: 'Substitute $u=\\ln x$; $\\int u^{-p}$ converges iff $p>1$.',
});

P.push({
  id: 'x-s-ast-err-0.00005', topic: 'Alternating Series & Error', diff: 4, fmt: 'free', arch: 'ast-error-N', exam: true,
  src: 'Exam 2 packet §11.5 Ex 23–26 (error < 0.00005)',
  prompt: 'The series $\\displaystyle\\sum_{n=1}^{\\infty}\\frac{(-1)^{n+1}}{n^{3}}$ converges. Find the smallest $N$ so that $|S-s_N|<0.00005$.',
  choices: [K('$27$'), D('$28$', 'You solved $b_N<0.00005$. The AST error bound is $b_{N+1}$.', 'off-by-one'), D('$26$', '$b_{27}=\\frac1{19683}\\approx0.0000508>0.00005$; $N=26$ is not enough.', 'off-by-one'), D('$20000$', 'You reported $1/\\varepsilon$ instead of solving $(N+1)^3>20000$.', 'conceptual')],
  steps: ['AST bound: $|S-s_N|\\le b_{N+1}=\\frac1{(N+1)^3}$.', 'Need $(N+1)^3>20000$. Since $27^3=19683<20000<21952=28^3$, $N+1\\ge28$, so $N=27$.'],
  recall: 'Error $\\le$ first omitted term $b_{N+1}$.',
});

P.push({
  id: 'x-s-acd-multi', topic: 'Alternating Series & Error', diff: 4, fmt: 'multi', arch: 'abs-multi', exam: true,
  src: 'Lecture 10-13 (absolute/conditional); Exam 2 packet §11.6',
  prompt: 'Select **all** series that are **conditionally** convergent.',
  choices: [{ t: '$\\displaystyle\\sum_{n=1}^{\\infty}\\frac{(-1)^n}{n}$', ok: true, why: 'Converges by the AST; $\\sum\\frac1n$ diverges.' }, { t: '$\\displaystyle\\sum_{n=1}^{\\infty}\\frac{(-1)^n}{\\sqrt n}$', ok: true, why: 'Converges by the AST; $\\sum n^{-1/2}$ diverges.' },
    { t: '$\\displaystyle\\sum_{n=1}^{\\infty}\\frac{(-1)^n}{n^2}$', why: 'Absolutely convergent ($p=2>1$).', err: 'test-logic' }, { t: '$\\displaystyle\\sum_{n=1}^{\\infty}\\frac{(-1)^n n}{n+1}$', why: 'Divergent: terms do not tend to $0$.', err: 'test-logic' },
    { t: '$\\displaystyle\\sum_{n=1}^{\\infty}\\frac{(-1)^n}{2^n}$', why: 'Absolutely convergent (geometric, $|r|=\\frac12$).', err: 'test-logic' }],
  steps: ['Conditionally convergent: converges, but $\\sum|a_n|$ diverges.'], recall: 'Alternating $p$-series: conditional iff $0<p\\le1$.',
});

P.push({
  id: 'x-s-ratio-err', topic: 'Ratio & Root Tests', diff: 3, fmt: 'error', arch: 'ratio-error-L1', exam: true,
  src: 'Exam 2 packet §11.6 (ratio test trap: L = 1)',
  prompt: ERRP,
  work: ['$a_n=\\dfrac{1}{n^2+1}$, so $\\left|\\dfrac{a_{n+1}}{a_n}\\right|=\\dfrac{n^2+1}{(n+1)^2+1}$.', '$L=\\lim_{n\\to\\infty}\\dfrac{n^2+1}{n^2+2n+2}=1$.', 'Since $L$ is not less than $1$, the series diverges.'],
  choices: errCh(3, 2, ['Ratio is set up correctly.', 'Limit correct.', null], 'test-logic', 'There is an error: Line 3.'),
  steps: ['$L=1$ is inconclusive.', '$\\frac1{n^2+1}<\\frac1{n^2}$, so the series converges by comparison.'], recall: '$L=1$: another test is needed.',
});

P.push({
  id: 'x-s-comp-err', topic: 'p-Series & Comparison', diff: 3, fmt: 'error', arch: 'comparison-error-dir1', exam: true,
  src: 'Exam 2 packet §11.4',
  prompt: ERRP,
  work: ['For $n\\ge2$, $\\dfrac{1}{n^2-1}>\\dfrac1{n^2}>0$.', '$\\sum\\frac1{n^2}$ converges ($p=2>1$).', 'By the Comparison Test, $\\sum_{n=2}^{\\infty}\\dfrac1{n^2-1}$ converges.'],
  choices: errCh(3, 2, ['True inequality.', 'Correct.', null], 'test-logic', 'There is an error: Line 3.'),
  steps: ['The given series is **larger** than a convergent one: no conclusion from Comparison.', 'Use LCT with $\\frac1{n^2}$ ($L=1$) or compare with $\\frac{2}{n^2}$.'], recall: 'Above a convergent series proves nothing.',
});

P.push({
  id: 'x-s-lct-tf', topic: 'Limit Comparison', diff: 3, tf: true, arch: 'lct-tf', exam: true,
  src: 'Exam 2 packet §11.4 Ex 9–16',
  prompt: '**True or false?**  Let $a_n,b_n>0$ with $\\lim\\frac{a_n}{b_n}=0$. If $\\sum b_n$ converges, then $\\sum a_n$ converges.',
  choices: [K('True'), D('False', 'When $L=0$, $a_n$ is eventually much smaller than $b_n$, so $\\sum a_n$ is dominated by a convergent series.', 'test-logic')],
  keyWhy: 'If $\\frac{a_n}{b_n}\\to0$, then $a_n<b_n$ for large $n$, and Direct Comparison gives convergence. (The converse direction fails: $\\sum b_n$ diverging says nothing.)',
  steps: ['$L=0$: for large $n$, $a_n<b_n$.', '$\\sum b_n$ converges $\\Rightarrow$ $\\sum a_n$ converges.'], recall: '$L=0$: use only when $\\sum b_n$ converges.',
});

P.push({
  id: 'x-s-choose-n2', topic: 'Choosing a Test', diff: 3, arch: 'choose-test', exam: true,
  src: 'Exam 2 packet §11.7 Ex 1–40',
  prompt: 'Which test is the most direct way to show $\\displaystyle\\sum_{n=1}^{\\infty}\\frac{n^2+1}{n^3+n+5}$ diverges?',
  choices: [K('Limit Comparison Test with $b_n=\\frac1n$'), D('Ratio Test', '$L=1$ for any rational function: inconclusive.', 'test-logic'), D('Alternating Series Test', 'Nothing alternates.', 'conceptual'), D('Integral Test with $f(x)=\\frac{x^2+1}{x^3+x+5}$', 'It is hard to integrate directly, though it could work.', 'conceptual')],
  steps: ['The term behaves like $\\frac{n^2}{n^3}=\\frac1n$.', 'LCT with $b_n=\\frac1n$: $L=1$, $\\sum\\frac1n$ diverges, so the series diverges.'], recall: 'Rational function: LCT with the dominant ratio.',
});

P.push({
  id: 'x-s-sum-ratio-root', topic: 'Ratio & Root Tests', diff: 3, fmt: 'free', arch: 'root-limit', exam: true,
  src: 'Exam 2 packet §11.6',
  prompt: 'Find $L=\\lim_{n\\to\\infty}\\sqrt[n]{|a_n|}$ for $a_n=\\left(\\dfrac{2n+1}{3n+4}\\right)^{n}$. What does the Root Test conclude?',
  choices: [K('$\\dfrac23$'), D('$\\dfrac32$', 'Inverted ratio of leading coefficients.', 'inverted'), D('$1$', 'The $+1$ and $+4$ vanish as $n\\to\\infty$; the limit is $\\frac23$.', 'conceptual'), D('$0$', 'The base tends to $\\frac23$, not $0$.', 'conceptual')],
  steps: ['$\\sqrt[n]{|a_n|}=\\frac{2n+1}{3n+4}\\to\\frac23<1$.', 'The series converges absolutely.'], recall: 'Root Test: strip the $n$th power.',
});

P.push({
  id: 'x-s-ast-err-limit', topic: 'Alternating Series & Error', diff: 3, fmt: 'error', arch: 'ast-error-limit', exam: true,
  src: 'Exam 2 packet §11.5',
  prompt: ERRP,
  work: ['$\\sum_{n=1}^{\\infty}(-1)^n\\dfrac{n}{n+1}$ is alternating with $b_n=\\dfrac{n}{n+1}>0$.', '$b_n$ is decreasing.', 'By the Alternating Series Test the series converges.'],
  choices: errCh(3, 1, ['Correct.', null, 'Follows from Lines 1-2.'], 'test-logic', 'There is an error: Line 2.'),
  steps: ['$b_n=\\frac{n}{n+1}$ is **increasing**, and $b_n\\to1\\ne0$.', 'The AST fails; the Divergence Test shows the series diverges.'], recall: 'Check each AST condition separately.',
});

P.push({
  id: 'x-s-logic-sum', topic: 'Series Test Logic', unit: 'checkins', diff: 3, tf: true, arch: 'logic-tf', exam: true,
  src: 'Check-in style (series arithmetic)',
  prompt: '**True or false?**  If $\\sum a_n$ converges and $\\sum b_n$ diverges, then $\\sum(a_n+b_n)$ diverges.',
  choices: [K('True'), D('False', 'If the sum converged, then $b_n=(a_n+b_n)-a_n$ would be a difference of convergent series, hence convergent.', 'test-logic')],
  keyWhy: 'If $\\sum(a_n+b_n)$ converged, then $\\sum b_n=\\sum(a_n+b_n)-\\sum a_n$ would converge, a contradiction.',
  steps: ['Proof by contradiction using the difference of convergent series.'], recall: 'Convergent plus divergent is divergent. Divergent plus divergent can be anything.',
});

P.push({
  id: 'x-s-logic-multi', topic: 'Series Test Logic', unit: 'checkins', diff: 4, fmt: 'multi', arch: 'logic-multi', exam: true,
  src: 'Check-in style (series test logic)',
  prompt: 'Select **all** statements that are true.',
  choices: [{ t: 'If $\\sum a_n$ converges, then $a_n\\to0$.', ok: true, why: 'Necessary condition (contrapositive of Divergence Test).' },
    { t: 'If $\\sum|a_n|$ converges, then $\\sum a_n$ converges.', ok: true, why: 'Absolute convergence implies convergence.' },
    { t: 'If $a_n\\to0$, then $\\sum a_n$ converges.', why: 'False: harmonic series.', err: 'test-logic' },
    { t: 'If the Ratio Test gives $L=1$, then $\\sum a_n$ diverges.', why: 'False: $L=1$ is inconclusive.', err: 'test-logic' },
    { t: 'The Integral Test gives the sum of the series.', why: 'False: it gives convergence or divergence only.', err: 'test-logic' }],
  steps: ['Two true statements: the necessary condition and absolute implies ordinary convergence.'], recall: 'Learn each test\'s statement and its standard counterexample.',
});

P.push({
  id: 'x-s-pser-nested', topic: 'p-Series & Comparison', diff: 2, arch: 'p-series', exam: true,
  src: 'Exam 2 packet §11.3 Ex 11–14',
  prompt: 'Determine whether $\\displaystyle\\sum_{n=1}^{\\infty}\\frac{1}{\\sqrt[3]{n^{2}}}$ converges or diverges.',
  choices: [K('Diverges: $p=\\frac23\\le1$'), D('Converges: $p=\\frac23<1$', '$p<1$ diverges; $p>1$ converges.', 'inverted'), D('Converges: the terms tend to $0$', 'Necessary, not sufficient.', 'test-logic'), D('Diverges: it is not geometric', 'Being non-geometric proves nothing.', 'conceptual')],
  steps: ['$\\frac1{\\sqrt[3]{n^2}}=\\frac1{n^{2/3}}$, a $p$-series with $p=\\frac23\\le1$.'], recall: 'Converts radicals to exponents first.',
});

P.push({
  id: 'x-s-rec-limit', topic: 'Sequences', diff: 3, fmt: 'free', arch: 'seq-recursive', exam: true,
  src: 'Exam 2 packet §11.1 (recursive sequences)',
  prompt: 'The sequence satisfies $a_1=1$, $a_{n+1}=2a_n+1$. State whether it converges. (If so, find the limit; otherwise type "diverges".)',
  accept: ['diverges', 'divergent', 'it diverges', 'does not converge'],
  choices: [K('Diverges'), D('$-1$', 'Solving $L=2L+1$ gives $L=-1$, but this is only valid if the sequence converges. Here $a_n$ is $1,3,7,15,\\ldots$ and grows.', 'test-logic'), D('$1$', 'The first term is not the limit.', 'conceptual'), D('$0$', 'The terms are growing, not shrinking.', 'conceptual')],
  steps: ['$a_n=2^{n}-1$: the terms double each step and tend to $\\infty$.', 'The fixed-point trick $L=2L+1$ gives $L=-1$, but it is not a limit because the sequence diverges.'],
  recall: 'Fixed-point method only after convergence is known.',
});

P.push({
  id: 'x-s-acd-cc', topic: 'Alternating Series & Error', diff: 3, arch: 'abs-cond', exam: true,
  src: 'Lecture 10-13; Exam 2 packet §11.6',
  prompt: 'Determine whether $\\displaystyle\\sum_{n=1}^{\\infty}(-1)^n\\frac{n}{n^2+1}$ is absolutely convergent, conditionally convergent, or divergent.',
  choices: [K('Conditionally convergent'), D('Absolutely convergent', '$\\sum\\frac n{n^2+1}$ behaves like $\\sum\\frac1n$ (LCT), so it diverges.', 'test-logic'), D('Divergent', '$b_n=\\frac{n}{n^2+1}$ decreases to $0$, so the AST gives convergence.', 'test-logic'), D('Inconclusive', 'The AST and LCT settle it.', 'conceptual')],
  steps: ['Absolute values: $\\frac{n}{n^2+1}\\sim\\frac1n$, LCT $L=1$, diverges.', 'AST: $b_n=\\frac{n}{n^2+1}$ is decreasing for $n\\ge1$ and $\\to0$, so the series converges.', 'Converges but not absolutely: conditionally convergent.'],
  recall: 'Absolute diverges + AST holds = conditional.',
});

export const xseries = { unit: 'series', problems: P, generators: G };
