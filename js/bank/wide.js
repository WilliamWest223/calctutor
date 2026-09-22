// ---------------------------------------------------------------
// bank/wide.js — formula-driven generators for Techniques of Integration.
//
// The originals were shape-locked: gx-tabular-xn-trig only ever produced
// ∫x³sin(ax)dx with a in 2..5, so the whole topic was four problems in a
// trench coat. These build the answer from the method itself, so the
// *shape* varies — degree, inner coefficient, which function, which
// identity — not just one number.
//
// Everything here is checked by tools/verify-math.mjs, which differentiates
// each claimed antiderivative and compares it against the integrand.
// ---------------------------------------------------------------
import { frac, coef, pow, sgn, choose } from '../util.js';

const P = [];
const G = [];

const FACT = [1, 1, 2, 6, 24, 120, 720];

// ---------------------------------------------------------------
// Repeated antiderivatives, which is all tabular integration is.
// `j` counts from 1. Returns {s: sign, f: tex of the function, d: a^j}
// ---------------------------------------------------------------
function repeatAnti(kind, a, j) {
  if (kind === 'exp') return { s: 1, f: `e^{${coef(a)}x}`, d: Math.pow(a, j) };
  // sin: -cos, -sin, +cos, +sin  |  cos: +sin, -cos, -sin, +cos
  const cyc = kind === 'sin'
    ? [{ s: -1, f: 'cos' }, { s: -1, f: 'sin' }, { s: 1, f: 'cos' }, { s: 1, f: 'sin' }]
    : [{ s: 1, f: 'sin' }, { s: -1, f: 'cos' }, { s: -1, f: 'sin' }, { s: 1, f: 'cos' }];
  const e = cyc[(j - 1) % 4];
  return { s: e.s, f: `\\${e.f}(${coef(a)}x)`, d: Math.pow(a, j) };
}

/**
 * ∫ x^n · g(ax) dx by tabular integration.
 * Term k is (-1)^k · n!/(n-k)! · x^(n-k) · (the (k+1)-th antiderivative of g).
 * `bad` perturbs the result to build a diagnostic distractor.
 */
function tabularTeX(n, a, kind, bad) {
  const parts = [];
  for (let k = 0; k <= n; k++) {
    const A = repeatAnti(kind, a, k + 1);
    const c = FACT[n] / FACT[n - k];                 // n!/(n-k)!
    let sign = (k % 2 ? -1 : 1) * A.s;
    let den = A.d;
    if (bad === 'signs') sign = A.s;                 // forgot to alternate
    if (bad === 'flip') sign = -sign;                // every sign inverted
    if (bad === 'den') den = a;                      // only divided once
    const xpart = n - k === 0 ? '' : pow('x', n - k);
    const numMag = c === 1 && xpart ? '' : String(c);
    const num = `${numMag}${xpart}${xpart || numMag ? '\\,' : ''}${A.f}`;
    parts.push((sign < 0 ? '-' : (parts.length ? '+' : '')) + (den === 1 ? num : `\\dfrac{${num}}{${den}}`));
  }
  return parts.join('') + '+C';
}

G.push({
  id: 'gw-tabular', unit: 'techniques', topic: 'Tabular & Looping Parts', diff: 3, diffs: [2, 3],
  src: 'modelled on Fall 2025 Exam 1 Q2 and Spring 2026 Exam 1 Q4',
  make(r) {
    const n = r.int(2, 4);
    const kind = r.pick(['sin', 'cos', 'exp']);
    // e^{-5x} is natural; cos(-2x) is just cos(2x) written to look confusing
    const a = r.int(2, 5) * (kind === 'exp' ? r.pick([1, -1]) : 1);
    const g = kind === 'exp' ? `e^{${coef(a)}x}` : `\\${kind}(${coef(a)}x)`;
    const key = `$${tabularTeX(n, a, kind, null)}$`;
    const last = repeatAnti(kind, a, n + 1);
    return {
      diff: n === 2 ? 2 : 3,
      prompt: `Compute $\\displaystyle\\int ${pow('x', n)}${g}\\,dx$.`,
      choices: [
        { t: key, ok: true },
        ...choose(key, [
          { t: `$${tabularTeX(n, a, kind, 'signs')}$`, why: 'The tabular signs must alternate $+,-,+,-$ down the diagonals. Yours repeat.', err: 'sign' },
          { t: `$${tabularTeX(n, a, kind, 'flip')}$`, why: `Every sign is inverted. Check the very first antiderivative: $\\int ${g}\\,dx = ${last.s < 0 && kind !== 'exp' ? '-' : ''}\\dfrac{${repeatAnti(kind, a, 1).f}}{${a}}$.`, err: 'sign' },
          { t: `$${tabularTeX(n, a, kind, 'den')}$`, why: `Each step down the integration column divides by another $${a}$. The denominators run $${a}, ${a * a}, ${Math.pow(a, 3)},\\dots$, not $${a}$ every time.`, err: 'chain-rule' },
          { t: `$\\dfrac{${pow('x', n + 1)}}{${n + 1}}\\cdot\\dfrac{${repeatAnti(kind, a, 1).f}}{${a}}+C$`, why: 'You integrated each factor separately. There is no product rule for integrals — parts produces an alternating **sum**.', err: 'formula-confusion' },
        ]),
      ],
      hint: `One factor is a polynomial, so it dies after ${n + 1} differentiations — that is the tabular setup.`,
      steps: [
        `Left column, differentiate $${pow('x', n)}$ to zero: ${Array.from({ length: n + 2 }, (_, i) => (i > n ? '0' : `$${i === 0 ? pow('x', n) : `${FACT[n] / FACT[n - i] === 1 ? '' : FACT[n] / FACT[n - i]}${pow('x', n - i) === '1' ? '' : pow('x', n - i)}`}$`)).join(', ')}.`,
        `Right column, integrate $${g}$ repeatedly — each step divides by another $${a}$.`,
        `Multiply along the diagonals with alternating signs $+,-,+,\\dots$`,
        `$\\displaystyle\\int ${pow('x', n)}${g}\\,dx = ${tabularTeX(n, a, kind, null)}$`,
      ],
      recall: 'Tabular integration: polynomial × (something you can integrate forever). Alternate the signs and stop when the left column hits $0$.',
      fix: 'Write the denominators as you go — they are powers of the inner coefficient, not the same number each row.',
    };
  },
});

// ---- looping: neither factor ever dies --------------------------
G.push({
  id: 'gw-looping', unit: 'techniques', topic: 'Tabular & Looping Parts', diff: 3, diffs: [2, 3],
  src: 'modelled on his check-ins of 08/28 and 01/23 and Spring 2025 Exam 1 Q6',
  make(r) {
    const a = r.int(1, 4), b = r.int(2, 5);
    const trig = r.pick(['sin', 'cos']);
    const D = a * a + b * b;
    // ∫e^{ax}sin(bx)dx = e^{ax}(a sin bx - b cos bx)/(a²+b²)
    // ∫e^{ax}cos(bx)dx = e^{ax}(a cos bx + b sin bx)/(a²+b²)
    const body = trig === 'sin'
      ? `${coef(a)}\\sin(${coef(b)}x)-${b}\\cos(${coef(b)}x)`
      : `${coef(a)}\\cos(${coef(b)}x)+${b}\\sin(${coef(b)}x)`;
    const swapped = trig === 'sin'
      ? `${coef(b)}\\sin(${coef(b)}x)-${a}\\cos(${coef(b)}x)`
      : `${coef(b)}\\cos(${coef(b)}x)+${a}\\sin(${coef(b)}x)`;
    const key = `$\\dfrac{e^{${coef(a)}x}\\left(${body}\\right)}{${D}}+C$`;
    return {
      prompt: `Compute $\\displaystyle\\int e^{${coef(a)}x}\\${trig}(${coef(b)}x)\\,dx$.`,
      choices: [
        { t: key, ok: true },
        ...choose(key, [
          { t: `$\\dfrac{e^{${coef(a)}x}\\left(${body}\\right)}{${a + b}}+C$`, why: `The denominator comes from solving $I = \\dots - \\frac{${b * b}}{${a * a}}I$, which gives $a^{2}+b^{2} = ${a * a}+${b * b} = ${D}$ — not $a+b$.`, err: 'algebra-slip' },
          { t: `$\\dfrac{e^{${coef(a)}x}\\left(${swapped}\\right)}{${D}}+C$`, why: `The coefficients are swapped. The $\\${trig}$ term carries $a=${a}$ and the other carries $b=${b}$.`, err: 'inverted' },
          { t: `$\\dfrac{e^{${coef(a)}x}}{${a}}\\cdot${trig === 'sin' ? `\\left(-\\dfrac{\\cos(${coef(b)}x)}{${b}}\\right)` : `\\dfrac{\\sin(${coef(b)}x)}{${b}}`}+C$`, why: 'You integrated each factor separately. This is a looping integral — parts twice, then solve for $I$.', err: 'formula-confusion' },
          { t: `$e^{${coef(a)}x}\\left(${body}\\right)+C$`, why: `You never divided. After moving the regenerated integral across you are left with $${D}\\,I = \\dots$, so divide by $${D}$.`, err: 'dropped-factor' },
        ]),
      ],
      hint: 'Neither factor ever differentiates to zero, so parts cannot terminate. Do it twice and see what comes back.',
      steps: [
        `Parts twice regenerates the original integral. Call it $I$.`,
        `You get $I = e^{${coef(a)}x}\\left(\\dots\\right) - \\dfrac{${b * b}}{${a * a}}I$ (up to the bookkeeping of which factor you chose for $u$).`,
        `Collect: $\\left(1+\\dfrac{${b * b}}{${a * a}}\\right)I = \\dfrac{${D}}{${a * a}}I$, so multiply through by $\\dfrac{${a * a}}{${D}}$.`,
        `$\\displaystyle\\int e^{${coef(a)}x}\\${trig}(${coef(b)}x)\\,dx = \\dfrac{e^{${coef(a)}x}\\left(${body}\\right)}{${D}}+C$`,
      ],
      recall: 'Exponential × trig always loops. The denominator is always $a^{2}+b^{2}$ — worth memorising as a check on your algebra.',
      fix: 'When the original integral reappears, name it $I$ and solve. That is success, not a dead end.',
    };
  },
});

// ---------------------------------------------------------------
// Integration by parts — vary which LIATE pair you get
// ---------------------------------------------------------------
G.push({
  id: 'gw-parts', unit: 'techniques', topic: 'Integration by Parts', diff: 3, diffs: [2, 3],
  make(r) {
    const kind = r.pick(['ln', 'poly-exp', 'poly-trig', 'arctan', 'sec2']);

    if (kind === 'ln') {
      const n = r.int(1, 4);                       // ∫ x^n ln x dx
      const m = n + 1;
      const key = `$\\dfrac{${pow('x', m)}\\ln x}{${m}}-\\dfrac{${pow('x', m)}}{${m * m}}+C$`;
      return {
        diff: 2,
        prompt: `Compute $\\displaystyle\\int ${n === 0 ? '' : pow('x', n)}\\ln x\\,dx$.`,
        choices: [
          { t: key, ok: true },
          ...choose(key, [
            { t: `$\\dfrac{${pow('x', m)}\\ln x}{${m}}+\\dfrac{${pow('x', m)}}{${m * m}}+C$`, why: 'The parts formula subtracts $\\int v\\,du$. That second term is negative.', err: 'sign' },
            { t: `$\\dfrac{${pow('x', m)}\\ln x}{${m}}-\\dfrac{${pow('x', m)}}{${m}}+C$`, why: `The leftover integral is $\\frac{1}{${m}}\\int ${pow('x', n)}dx = \\frac{${pow('x', m)}}{${m * m}}$ — you divide by $${m}$ twice.`, err: 'algebra-slip' },
            { t: `$\\dfrac{${pow('x', m)}}{${m}}\\cdot\\dfrac{1}{x}+C$`, why: 'You integrated one factor and differentiated the other, then multiplied. Parts is $uv-\\int v\\,du$, not a product of pieces.', err: 'formula-confusion' },
            { t: `$\\dfrac{${pow('x', m)}\\ln x}{${m}}-\\dfrac{\\ln x}{${m * m}}+C$`, why: 'Once you substitute $du=\\frac{dx}{x}$, the logarithm is gone — the remaining integral is purely algebraic.', err: 'formula-confusion' },
          ]),
        ],
        hint: 'LIATE: the logarithm is **L**, so it becomes $u$ — which also means you never have to integrate it.',
        steps: [
          `LIATE puts the log first, so $u=\\ln x$ and $dv=${pow('x', n)}dx$.`,
          `$du = \\dfrac{dx}{x}$ and $v = \\dfrac{${pow('x', m)}}{${m}}$.`,
          `$\\displaystyle\\int ${pow('x', n)}\\ln x\\,dx = \\dfrac{${pow('x', m)}\\ln x}{${m}} - \\dfrac{1}{${m}}\\int ${pow('x', n)}\\,dx$.`,
          `$= \\dfrac{${pow('x', m)}\\ln x}{${m}} - \\dfrac{${pow('x', m)}}{${m * m}}+C$`,
        ],
        recall: '$\\int x^{n}\\ln x\\,dx$ always lands on $\\frac{x^{n+1}\\ln x}{n+1}-\\frac{x^{n+1}}{(n+1)^{2}}$.',
      };
    }

    if (kind === 'arctan') {
      const fn = r.pick([
        { t: '\\arctan x', d: '\\dfrac{1}{1+x^{2}}', anti: '\\tfrac12\\ln(1+x^{2})', sign: '-' },
        { t: '\\arcsin x', d: '\\dfrac{1}{\\sqrt{1-x^{2}}}', anti: '\\sqrt{1-x^{2}}', sign: '+' },
      ]);
      const key = `$x${fn.t}${fn.sign}${fn.anti}+C$`;
      return {
        diff: 3,
        prompt: `Compute $\\displaystyle\\int ${fn.t}\\,dx$.`,
        choices: [
          { t: key, ok: true },
          ...choose(key, [
            { t: `$x${fn.t}${fn.sign === '+' ? '-' : '+'}${fn.anti}+C$`, why: 'Sign slip on the second term. Track the minus in $uv-\\int v\\,du$ through the substitution that follows.', err: 'sign' },
            { t: `$${fn.d}+C$`, why: 'That is the **derivative** of the integrand, not its antiderivative. You ran the operation backwards.', err: 'inverse-op' },
            { t: `$x${fn.t}+C$`, why: 'You stopped after $uv$. Parts owes you the $-\\int v\\,du$ term as well.', err: 'dropped-factor' },
            { t: `$\\dfrac{${fn.t}^{2}}{2}+C$`, why: 'The power rule does not apply to a function of $x$ — that would need $\\int u^{n}du$ with a matching $du$ present.', err: 'formula-confusion' },
          ]),
        ],
        hint: 'Only one factor here. Supply the other: take $dv = 1\\,dx$, so $v = x$.',
        steps: [
          `A lone inverse-trig function: take $u = ${fn.t}$ and $dv = 1\\,dx$.`,
          `$du = ${fn.d}\\,dx$ and $v = x$.`,
          `$\\displaystyle\\int ${fn.t}\\,dx = x${fn.t} - \\int \\dfrac{x\\,dx}{${fn.t === '\\arctan x' ? '1+x^{2}' : '\\sqrt{1-x^{2}}'}}$.`,
          `That remaining integral is a $u$-substitution, giving $x${fn.t}${fn.sign}${fn.anti}+C$.`,
        ],
        recall: 'A lone log or inverse-trig function is integrated by parts against $dv=1$.',
        fix: 'One factor is never a reason to rule out parts — supply the $1$ yourself.',
      };
    }

    if (kind === 'sec2') {
      const a = r.int(2, 5);
      const key = `$${a}x\\tan\\left(\\dfrac{x}{${a}}\\right)+${a * a}\\ln\\left|\\cos\\left(\\dfrac{x}{${a}}\\right)\\right|+C$`;
      return {
        prompt: `Compute $\\displaystyle\\int x\\sec^{2}\\!\\left(\\dfrac{x}{${a}}\\right)dx$.`,
        choices: [
          { t: key, ok: true },
          ...choose(key, [
            { t: `$${a}x\\tan\\left(\\dfrac{x}{${a}}\\right)-${a * a}\\ln\\left|\\cos\\left(\\dfrac{x}{${a}}\\right)\\right|+C$`, why: `$\\int\\tan(kx)dx = -\\frac{\\ln|\\cos kx|}{k}$, and the leading minus of $-\\int v\\,du$ flips it again. The two negatives cancel.`, err: 'sign' },
            { t: `$x\\tan\\left(\\dfrac{x}{${a}}\\right)+${a}\\ln\\left|\\cos\\left(\\dfrac{x}{${a}}\\right)\\right|+C$`, why: `$v = \\int\\sec^{2}(x/${a})dx = ${a}\\tan(x/${a})$ — the inner $\\frac1${a}$ means you **multiply** by $${a}$, not divide.`, err: 'chain-rule' },
            { t: `$\\dfrac{x^{2}}{2}\\cdot ${a}\\tan\\left(\\dfrac{x}{${a}}\\right)+C$`, why: 'Factors integrated separately. Parts produces $uv-\\int v\\,du$.', err: 'formula-confusion' },
            { t: `$${a}x\\tan\\left(\\dfrac{x}{${a}}\\right)+${a}\\ln\\left|\\sec\\left(\\dfrac{x}{${a}}\\right)\\right|+C$`, why: `$\\ln|\\sec| = -\\ln|\\cos|$, so this has the right shape but the wrong sign, and the constant should be $${a * a}$.`, err: 'sign' },
          ]),
        ],
        hint: `LIATE makes $u=x$ and $dv=\\sec^{2}(x/${a})dx$. Be careful finding $v$ — the inner $\\frac{1}{${a}}$ multiplies, not divides.`,
        steps: [
          `$u = x$, $dv = \\sec^{2}(x/${a})\\,dx$, so $du = dx$ and $v = ${a}\\tan(x/${a})$.`,
          `$\\displaystyle\\int x\\sec^{2}\\!\\left(\\tfrac{x}{${a}}\\right)dx = ${a}x\\tan\\left(\\tfrac{x}{${a}}\\right) - ${a}\\int\\tan\\left(\\tfrac{x}{${a}}\\right)dx$.`,
          `$\\displaystyle\\int\\tan\\left(\\tfrac{x}{${a}}\\right)dx = -${a}\\ln\\left|\\cos\\left(\\tfrac{x}{${a}}\\right)\\right|$.`,
          `So the answer is $${a}x\\tan\\left(\\tfrac{x}{${a}}\\right) + ${a * a}\\ln\\left|\\cos\\left(\\tfrac{x}{${a}}\\right)\\right|+C$.`,
        ],
        recall: 'An inner $\\frac{x}{a}$ makes you multiply by $a$ when integrating. It is the reciprocal of the chain-rule factor.',
      };
    }

    // poly × exp / poly × trig, one round of parts
    const a = r.nz(2, 5) * r.pick([1, 1, -1]);
    if (kind === 'poly-exp') {
      const key = `$\\dfrac{x e^{${coef(a)}x}}{${a}}-\\dfrac{e^{${coef(a)}x}}{${a * a}}+C$`;
      return {
        diff: 2,
        prompt: `Compute $\\displaystyle\\int x e^{${coef(a)}x}\\,dx$.`,
        choices: [
          { t: key, ok: true },
          ...choose(key, [
            { t: `$\\dfrac{x e^{${coef(a)}x}}{${a}}+\\dfrac{e^{${coef(a)}x}}{${a * a}}+C$`, why: 'Parts subtracts $\\int v\\,du$, so the second term is negative.', err: 'sign' },
            { t: `$\\dfrac{x e^{${coef(a)}x}}{${a}}-\\dfrac{e^{${coef(a)}x}}{${a}}+C$`, why: `The second integral divides by $${a}$ again: $\\frac{1}{${a}}\\int e^{${coef(a)}x}dx = \\frac{e^{${coef(a)}x}}{${a * a}}$.`, err: 'algebra-slip' },
            { t: `$\\dfrac{x^{2}}{2}\\cdot\\dfrac{e^{${coef(a)}x}}{${a}}+C$`, why: 'Each factor integrated on its own. There is no product rule for integrals.', err: 'formula-confusion' },
            { t: `$\\dfrac{e^{${coef(a)}x}}{${a}}\\left(x-${a}\\right)+C$`, why: `Factoring out $\\frac{e^{${coef(a)}x}}{${a}}$ leaves $x-\\frac{1}{${a}}$, not $x-${a}$.`, err: 'algebra-slip' },
          ]),
        ],
        hint: 'LIATE: algebraic before exponential, so $u=x$.',
        steps: [
          `$u=x$, $dv=e^{${coef(a)}x}dx$, so $du=dx$ and $v=\\dfrac{e^{${coef(a)}x}}{${a}}$.`,
          `$= \\dfrac{xe^{${coef(a)}x}}{${a}} - \\dfrac{1}{${a}}\\displaystyle\\int e^{${coef(a)}x}dx$.`,
          `$= \\dfrac{xe^{${coef(a)}x}}{${a}} - \\dfrac{e^{${coef(a)}x}}{${a * a}}+C$`,
        ],
        recall: 'Each pass through an exponential with inner coefficient $a$ costs another factor of $\\frac1a$.',
      };
    }

    const trig = r.pick(['sin', 'cos']);
    const A1 = repeatAnti(trig, a, 1), A2 = repeatAnti(trig, a, 2);
    const t1 = `${A1.s < 0 ? '-' : ''}\\dfrac{x${A1.f}}{${a}}`;
    const t2 = `${-A2.s < 0 ? '-' : '+'}\\dfrac{${A2.f}}{${a * a}}`;
    const key = `$${t1}${t2}+C$`;
    return {
      diff: 2,
      prompt: `Compute $\\displaystyle\\int x\\${trig}(${coef(a)}x)\\,dx$.`,
      choices: [
        { t: key, ok: true },
        ...choose(key, [
          { t: `$${t1}${-A2.s < 0 ? '+' : '-'}\\dfrac{${A2.f}}{${a * a}}+C$`, why: 'Sign slip on the second term — parts subtracts $\\int v\\,du$.', err: 'sign' },
          { t: `$${t1}${t2.replace(String(a * a), String(a))}+C$`, why: `The second integration divides by $${a}$ a second time, giving $${a * a}$ underneath.`, err: 'chain-rule' },
          { t: `$\\dfrac{x^{2}}{2}\\cdot${A1.s < 0 ? '-' : ''}\\dfrac{${A1.f}}{${a}}+C$`, why: 'Factors integrated separately — parts gives $uv-\\int v\\,du$.', err: 'formula-confusion' },
          { t: `$${t1.replace('x', 'x^{2}')}${t2}+C$`, why: 'The $uv$ term keeps the original $x$ — it is $u$ times $v$, not an integrated $x$.', err: 'power-rule' },
        ]),
      ],
      hint: 'LIATE: algebraic before trigonometric, so $u=x$.',
      steps: [
        `$u=x$, $dv=\\${trig}(${coef(a)}x)dx$, so $v = ${A1.s < 0 ? '-' : ''}\\dfrac{${A1.f}}{${a}}$.`,
        `$uv = ${t1}$, and $-\\displaystyle\\int v\\,du$ contributes $${t2}$.`,
        `$\\displaystyle\\int x\\${trig}(${coef(a)}x)dx = ${t1}${t2}+C$`,
      ],
      recall: 'One round of parts on $x\\cdot(\\text{trig})$ always leaves a single clean integral.',
    };
  },
});

// ---------------------------------------------------------------
// Product-to-sum — all three identities, not just sin·cos
// ---------------------------------------------------------------
G.push({
  id: 'gw-prodsum', unit: 'techniques', topic: 'Product-to-Sum Integrals', diff: 2, diffs: [1, 2],
  src: 'modelled on Fall 2025 Exam 1 Q7',
  make(r) {
    let a = r.int(2, 7), b = r.int(1, 6);
    while (a === b) b = r.int(1, 6);
    const s = a + b, d = a - b;                    // d may be negative; cos is even, sin is odd
    const kind = r.pick(['sc', 'ss', 'cc']);

    // sinA cosB = ½[sin(A+B) + sin(A−B)]      → −cos(s)/2s − cos(d)/2d
    // sinA sinB = ½[cos(A−B) − cos(A+B)]      → sin(d)/2d − sin(s)/2s
    // cosA cosB = ½[cos(A+B) + cos(A−B)]      → sin(s)/2s + sin(d)/2d
    const ad = Math.abs(d);
    const cfg = {
      sc: {
        q: `\\sin(${coef(a)}x)\\cos(${coef(b)}x)`,
        id: '\\sin A\\cos B = \\tfrac12\\left[\\sin(A+B)+\\sin(A-B)\\right]',
        sum: `\\tfrac12\\left[\\sin(${s}x)${d < 0 ? '-' : '+'}\\sin(${ad}x)\\right]`,
        key: `-\\dfrac{\\cos(${s}x)}{${2 * s}}${d < 0 ? '+' : '-'}\\dfrac{\\cos(${ad}x)}{${2 * ad}}`,
        halfBad: `-\\dfrac{\\cos(${s}x)}{${s}}${d < 0 ? '+' : '-'}\\dfrac{\\cos(${ad}x)}{${ad}}`,
        signBad: `\\dfrac{\\cos(${s}x)}{${2 * s}}${d < 0 ? '-' : '+'}\\dfrac{\\cos(${ad}x)}{${2 * ad}}`,
      },
      ss: {
        q: `\\sin(${coef(a)}x)\\sin(${coef(b)}x)`,
        id: '\\sin A\\sin B = \\tfrac12\\left[\\cos(A-B)-\\cos(A+B)\\right]',
        sum: `\\tfrac12\\left[\\cos(${ad}x)-\\cos(${s}x)\\right]`,
        key: `\\dfrac{\\sin(${ad}x)}{${2 * ad}}-\\dfrac{\\sin(${s}x)}{${2 * s}}`,
        halfBad: `\\dfrac{\\sin(${ad}x)}{${ad}}-\\dfrac{\\sin(${s}x)}{${s}}`,
        signBad: `\\dfrac{\\sin(${s}x)}{${2 * s}}-\\dfrac{\\sin(${ad}x)}{${2 * ad}}`,
      },
      cc: {
        q: `\\cos(${coef(a)}x)\\cos(${coef(b)}x)`,
        id: '\\cos A\\cos B = \\tfrac12\\left[\\cos(A+B)+\\cos(A-B)\\right]',
        sum: `\\tfrac12\\left[\\cos(${s}x)+\\cos(${ad}x)\\right]`,
        key: `\\dfrac{\\sin(${s}x)}{${2 * s}}+\\dfrac{\\sin(${ad}x)}{${2 * ad}}`,
        halfBad: `\\dfrac{\\sin(${s}x)}{${s}}+\\dfrac{\\sin(${ad}x)}{${ad}}`,
        signBad: `\\dfrac{\\sin(${s}x)}{${2 * s}}-\\dfrac{\\sin(${ad}x)}{${2 * ad}}`,
      },
    }[kind];

    const key = `$${cfg.key}+C$`;
    return {
      prompt: `Compute $\\displaystyle\\int ${cfg.q}\\,dx$.`,
      choices: [
        { t: key, ok: true },
        ...choose(key, [
          { t: `$${cfg.halfBad}+C$`, why: 'The $\\frac12$ from the identity multiplies **both** terms — it does not disappear when you integrate.', err: 'dropped-factor' },
          { t: `$${cfg.signBad}+C$`, why: 'Check the signs against the identity, then again after integrating: $\\int\\sin(kx)dx=-\\frac{\\cos kx}{k}$ while $\\int\\cos(kx)dx=+\\frac{\\sin kx}{k}$.', err: 'sign' },
          { t: `$\\dfrac{${cfg.q}}{${a * b}}+C$`, why: 'You integrated the factors separately. Two trig functions with **different** arguments share no inner function, so no substitution works — you need an identity.', err: 'formula-confusion' },
          { t: `$-\\dfrac{\\cos(${a * b}x)}{${2 * a * b}}+C$`, why: 'The identity produces the **sum and difference** of the angles, $A\\pm B$, never their product.', err: 'formula-confusion' },
        ]),
      ],
      hint: `Different angles means no parity trick applies. Use the product-to-sum identity for $\\${kind === 'sc' ? '\\sin A\\cos B' : kind === 'ss' ? '\\sin A\\sin B' : '\\cos A\\cos B'}$.`,
      steps: [
        `The arguments differ, so there is no shared inner function — a substitution cannot work.`,
        `Identity: $${cfg.id}$.`,
        `Here $A=${a}x$ and $B=${b}x$, giving $${cfg.sum}$.`,
        `Integrate term by term: $${cfg.key}+C$.`,
      ],
      recall: 'All three product-to-sum identities are on the cheat sheet (press **C**). They turn a product into a sum of single trig functions.',
      fix: 'Write the identity down before substituting numbers. Reconstructing it from memory mid-problem is where the signs go.',
    };
  },
});

// ---------------------------------------------------------------
// Trigonometric integrals — driven by the parity rule, so the powers
// and the inner coefficient both move.
// ---------------------------------------------------------------

/** Expand (1 - u^2)^j * u^n, or (u^2 - 1)^j * u^n, as [exponent, coeff] pairs. */
function binomTerms(j, n, minus) {
  const C = [[1], [1, 1], [1, 2, 1]][j];
  const out = [];
  for (let i = 0; i <= j; i++) {
    // (1-u^2)^j contributes (-1)^i ; (u^2-1)^j contributes (-1)^(j-i)
    const sign = minus ? ((j - i) % 2 ? -1 : 1) : (i % 2 ? -1 : 1);
    out.push([n + 2 * i, sign * C[i]]);
  }
  return out;
}

/** Integrated form: sum of c/(e+1) * fn^(e+1)(ax) / a, with an overall sign. */
function powerSum(terms, fname, a, outerSign, mangle) {
  const parts = [];
  for (const [e, c] of terms) {
    let den = a * (e + 1);
    if (mangle === 'nodiv') den = e + 1;               // forgot the inner coefficient
    if (mangle === 'nobump') den = a * e;              // divided by the old power
    const sign = outerSign * c;
    const mag = Math.abs(sign) === 1 ? '' : String(Math.abs(sign));
    parts.push((sign < 0 ? '-' : (parts.length ? '+' : ''))
      + `\\dfrac{${mag}\\${fname}^{${e + 1}}(${coef(a)}x)}{${den}}`);
  }
  return parts.join('') + '+C';
}

G.push({
  id: 'gw-trigint', unit: 'techniques', topic: 'Trigonometric Integrals', diff: 3, diffs: [2, 3, 4],
  src: 'modelled on Fall 2025 Exam 1 Q1 and Spring 2025 final Q3',
  make(r) {
    const a = r.int(1, 5);
    const family = r.pick(['oddsin', 'oddcos', 'bothEven', 'secEven', 'tanOdd']);

    if (family === 'oddsin' || family === 'oddcos') {
      const j = r.pick([1, 1, 2]);                   // odd power is 2j+1
      const m = 2 * j + 1;
      const n = r.int(2, 6);
      const odd = family === 'oddsin';
      // u = cos (odd sine) gives an extra minus from du = -a sin dx
      const keepName = odd ? 'cos' : 'sin';
      const terms = binomTerms(j, n, false);
      const key = `$${powerSum(terms, keepName, a, odd ? -1 : 1, null)}$`;
      const q = odd
        ? `\\sin^{${m}}(${coef(a)}x)\\cos^{${n}}(${coef(a)}x)`
        : `\\sin^{${n}}(${coef(a)}x)\\cos^{${m}}(${coef(a)}x)`;
      return {
        diff: j === 1 ? 3 : 4,
        prompt: `Compute $\\displaystyle\\int ${q}\\,dx$.`,
        choices: [
          { t: key, ok: true },
          ...choose(key, [
            { t: `$${powerSum(terms, keepName, a, odd ? 1 : -1, null)}$`, why: odd
              ? `With $u=\\cos(${coef(a)}x)$, $du=-${a}\\sin(${coef(a)}x)dx$ — that minus survives into every term.`
              : `With $u=\\sin(${coef(a)}x)$, $du=+${a}\\cos(${coef(a)}x)dx$; there is no extra minus here.`, err: 'sign' },
            { t: `$${powerSum(terms, keepName, a, odd ? -1 : 1, 'nodiv')}$`, why: `The inner $${coef(a)}x$ costs a factor of $\\frac{1}{${a}}$ on every term.`, err: 'chain-rule' },
            { t: `$${powerSum(terms, odd ? 'sin' : 'cos', a, odd ? -1 : 1, null)}$`, why: `You substituted for the wrong function. The **odd** power is the one you break a factor off, so $u$ is the *other* one — here $u=\\${keepName}(${coef(a)}x)$.`, err: 'formula-confusion' },
            { t: `$\\dfrac{\\sin^{${odd ? m + 1 : n + 1}}(${coef(a)}x)\\cos^{${odd ? n + 1 : m + 1}}(${coef(a)}x)}{${a * (m + 1) * (n + 1)}}+C$`, why: 'You applied the power rule to each factor separately. There is no product rule for integrals.', err: 'formula-confusion' },
          ]),
        ],
        hint: `The $\\${odd ? 'sin' : 'cos'}$ power is odd. Peel one factor off for $du$ and convert the rest with $\\${odd ? 'sin' : 'cos'}^{2}=1-\\${keepName}^{2}$.`,
        steps: [
          `Odd power on $\\${odd ? 'sine' : 'cosine'}$, so let $u=\\${keepName}(${coef(a)}x)$ and $du=${odd ? '-' : ''}${a}\\${odd ? 'sin' : 'cos'}(${coef(a)}x)\\,dx$.`,
          `Split off one factor and rewrite the remaining even power: $\\${odd ? 'sin' : 'cos'}^{${m - 1}} = \\left(1-u^{2}\\right)^{${j}}$.`,
          `The integral becomes $${odd ? '-' : ''}\\dfrac{1}{${a}}\\displaystyle\\int \\left(1-u^{2}\\right)^{${j}}u^{${n}}\\,du$.`,
          `Expand and integrate term by term: $${powerSum(terms, keepName, a, odd ? -1 : 1, null)}$`,
        ],
        recall: 'Odd sine → $u=\\cos$. Odd cosine → $u=\\sin$. Both even → half-angle identities.',
        fix: 'Name $u$ as the function whose power is **even**. That is the one that survives.',
      };
    }

    if (family === 'bothEven') {
      const which = r.pick(['sin', 'cos']);
      const plus = which === 'cos';
      const key = `$\\dfrac{x}{2}${plus ? '+' : '-'}\\dfrac{\\sin(${2 * a}x)}{${4 * a}}+C$`;
      return {
        diff: 2,
        prompt: `Compute $\\displaystyle\\int \\${which}^{2}(${coef(a)}x)\\,dx$.`,
        choices: [
          { t: key, ok: true },
          ...choose(key, [
            { t: `$\\dfrac{x}{2}${plus ? '-' : '+'}\\dfrac{\\sin(${2 * a}x)}{${4 * a}}+C$`, why: `The half-angle identity is $\\${which}^{2}\\theta = \\frac{1${plus ? '+' : '-'}\\cos 2\\theta}{2}$ — check which sign goes with which function.`, err: 'sign' },
            { t: `$\\dfrac{\\${which}^{3}(${coef(a)}x)}{${3 * a}}+C$`, why: 'The power rule needs a matching $du$. There is no spare factor here, so it does not apply — you need an identity.', err: 'formula-confusion' },
            { t: `$\\dfrac{x}{2}${plus ? '+' : '-'}\\dfrac{\\sin(${2 * a}x)}{${2 * a}}+C$`, why: `Two divisions happen: the $\\frac12$ from the identity and the $\\frac{1}{${2 * a}}$ from integrating $\\cos(${2 * a}x)$. Together that is $${4 * a}$.`, err: 'dropped-factor' },
            { t: `$\\dfrac{x}{2}${plus ? '+' : '-'}\\dfrac{\\sin(${coef(a)}x)}{${4 * a}}+C$`, why: `The identity doubles the angle: $\\cos(2\\cdot${a}x) = \\cos(${2 * a}x)$.`, err: 'chain-rule' },
          ]),
        ],
        hint: 'Both powers are even, so no substitution can work. Reach for the half-angle identity.',
        steps: [
          `$\\${which}^{2}\\theta = \\dfrac{1${plus ? '+' : '-'}\\cos 2\\theta}{2}$, so with $\\theta=${a}x$: $\\dfrac{1${plus ? '+' : '-'}\\cos(${2 * a}x)}{2}$.`,
          `$\\displaystyle\\int \\dfrac{1}{2}\\,dx = \\dfrac{x}{2}$.`,
          `$\\displaystyle\\int ${plus ? '' : '-'}\\dfrac{\\cos(${2 * a}x)}{2}\\,dx = ${plus ? '' : '-'}\\dfrac{\\sin(${2 * a}x)}{${4 * a}}$.`,
          `Total: $\\dfrac{x}{2}${plus ? '+' : '-'}\\dfrac{\\sin(${2 * a}x)}{${4 * a}}+C$`,
        ],
        recall: '$\\sin^{2}\\theta=\\frac{1-\\cos2\\theta}{2}$, $\\cos^{2}\\theta=\\frac{1+\\cos2\\theta}{2}$. Sine takes the minus.',
      };
    }

    if (family === 'secEven') {
      // ∫ tan^m(ax) sec^2(ax) dx = tan^(m+1)(ax) / (a(m+1))
      const m = r.int(2, 6);
      const key = `$\\dfrac{\\tan^{${m + 1}}(${coef(a)}x)}{${a * (m + 1)}}+C$`;
      return {
        diff: 2,
        prompt: `Compute $\\displaystyle\\int \\tan^{${m}}(${coef(a)}x)\\sec^{2}(${coef(a)}x)\\,dx$.`,
        choices: [
          { t: key, ok: true },
          ...choose(key, [
            { t: `$\\dfrac{\\tan^{${m + 1}}(${coef(a)}x)}{${m + 1}}+C$`, why: `The inner $${coef(a)}x$ means $du=${a}\\sec^{2}(${coef(a)}x)dx$, so you owe a factor of $\\frac{1}{${a}}$.`, err: 'chain-rule' },
            { t: `$\\dfrac{\\sec^{${m + 1}}(${coef(a)}x)}{${a * (m + 1)}}+C$`, why: `$\\sec^{2}$ is exactly $du$ for $u=\\tan$, so the surviving power is a power of **tangent**.`, err: 'formula-confusion' },
            { t: `$\\dfrac{\\tan^{${m + 1}}(${coef(a)}x)\\sec^{3}(${coef(a)}x)}{${a * (m + 1) * 3}}+C$`, why: 'Each factor integrated separately. The $\\sec^{2}$ is consumed as $du$ — it does not survive into the answer.', err: 'formula-confusion' },
            { t: `$\\dfrac{\\tan^{${m - 1}}(${coef(a)}x)}{${a * (m - 1)}}+C$`, why: 'Integrating raises the power by one; you lowered it. That is differentiation.', err: 'inverse-op' },
          ]),
        ],
        hint: `$\\frac{d}{dx}\\tan(${coef(a)}x) = ${a}\\sec^{2}(${coef(a)}x)$ — the $\\sec^{2}$ is sitting right there as $du$.`,
        steps: [
          `Let $u=\\tan(${coef(a)}x)$, so $du = ${a}\\sec^{2}(${coef(a)}x)\\,dx$.`,
          `The integral is $\\dfrac{1}{${a}}\\displaystyle\\int u^{${m}}\\,du$.`,
          `$= \\dfrac{u^{${m + 1}}}{${a * (m + 1)}} = \\dfrac{\\tan^{${m + 1}}(${coef(a)}x)}{${a * (m + 1)}}+C$`,
        ],
        recall: 'An even power of $\\sec$ means peel off $\\sec^{2}$ for $du$ and let $u=\\tan$.',
      };
    }

    // tanOdd: ∫ sec^n(ax) tan(ax) dx = sec^n(ax)/(a n)
    const n = r.int(2, 7);
    const key = `$\\dfrac{\\sec^{${n}}(${coef(a)}x)}{${a * n}}+C$`;
    return {
      diff: 2,
      prompt: `Compute $\\displaystyle\\int \\sec^{${n}}(${coef(a)}x)\\tan(${coef(a)}x)\\,dx$.`,
      choices: [
        { t: key, ok: true },
        ...choose(key, [
          { t: `$\\dfrac{\\sec^{${n + 1}}(${coef(a)}x)}{${a * (n + 1)}}+C$`, why: `One factor of $\\sec$ is consumed by $du=${a}\\sec(${coef(a)}x)\\tan(${coef(a)}x)dx$, so you integrate $u^{${n - 1}}$ — the answer comes back to power $${n}$, not $${n + 1}$.`, err: 'off-by-one' },
          { t: `$\\dfrac{\\sec^{${n}}(${coef(a)}x)}{${n}}+C$`, why: `The inner $${coef(a)}x$ costs a factor of $\\frac{1}{${a}}$.`, err: 'chain-rule' },
          { t: `$\\dfrac{\\tan^{2}(${coef(a)}x)\\sec^{${n}}(${coef(a)}x)}{${2 * a * n}}+C$`, why: 'Factors integrated separately. The $\\tan$ is part of $du$ and disappears.', err: 'formula-confusion' },
          { t: `$\\dfrac{\\sec^{${n}}(${coef(a)}x)\\ln|\\sec(${coef(a)}x)|}{${a * n}}+C$`, why: 'No logarithm appears here — that would come from $\\int\\tan$ on its own, with no spare $\\sec$ to absorb.', err: 'formula-confusion' },
        ]),
      ],
      hint: `$\\frac{d}{dx}\\sec(${coef(a)}x) = ${a}\\sec(${coef(a)}x)\\tan(${coef(a)}x)$. Split one $\\sec$ off to pair with the $\\tan$.`,
      steps: [
        `Let $u=\\sec(${coef(a)}x)$, so $du=${a}\\sec(${coef(a)}x)\\tan(${coef(a)}x)\\,dx$.`,
        `Write the integrand as $\\sec^{${n - 1}}(${coef(a)}x)\\cdot\\left[\\sec(${coef(a)}x)\\tan(${coef(a)}x)\\right]$.`,
        `$= \\dfrac{1}{${a}}\\displaystyle\\int u^{${n - 1}}\\,du = \\dfrac{\\sec^{${n}}(${coef(a)}x)}{${a * n}}+C$`,
      ],
      recall: 'An odd power of $\\tan$ with a $\\sec$ to spare means $u=\\sec$.',
    };
  },
});


// ---------------------------------------------------------------
// Trigonometric substitution — same three patterns, many integrands.
// Each entry carries its own verified antiderivative.
// ---------------------------------------------------------------
G.push({
  id: 'gw-trigsub', unit: 'techniques', topic: 'Trigonometric Substitution', diff: 4, diffs: [2, 3, 4],
  src: 'modelled on Fall 2025 Exam 1 Q5, Spring 2025 final Q2, Spring 2026 final Q2',
  make(r) {
    const a = r.int(2, 6);
    const A = a * a;
    const pat = r.pick(['sin', 'tan', 'sec']);

    const shapes = {
      // a^2 - x^2   ->   x = a sin(theta)
      sin: [
        { q: `\\dfrac{dx}{x^{2}\\sqrt{${A}-x^{2}}}`, key: `-\\dfrac{\\sqrt{${A}-x^{2}}}{${A}x}`,
          tail: `\\dfrac{1}{${A}}\\displaystyle\\int\\csc^{2}\\theta\\,d\\theta` },
        { q: `\\dfrac{dx}{\\left(${A}-x^{2}\\right)^{3/2}}`, key: `\\dfrac{x}{${A}\\sqrt{${A}-x^{2}}}`,
          tail: `\\dfrac{1}{${A}}\\displaystyle\\int\\sec^{2}\\theta\\,d\\theta` },
        { q: `\\dfrac{x^{2}}{\\sqrt{${A}-x^{2}}}\\,dx`, key: `-\\dfrac{x\\sqrt{${A}-x^{2}}}{2}+\\dfrac{${A}}{2}\\arcsin\\left(\\dfrac{x}{${a}}\\right)`,
          tail: `${A}\\displaystyle\\int\\sin^{2}\\theta\\,d\\theta` },
        { q: `\\sqrt{${A}-x^{2}}\\,dx`, key: `\\dfrac{x\\sqrt{${A}-x^{2}}}{2}+\\dfrac{${A}}{2}\\arcsin\\left(\\dfrac{x}{${a}}\\right)`,
          tail: `${A}\\displaystyle\\int\\cos^{2}\\theta\\,d\\theta` },
      ],
      // a^2 + x^2   ->   x = a tan(theta)
      tan: [
        { q: `\\dfrac{dx}{x^{2}\\sqrt{x^{2}+${A}}}`, key: `-\\dfrac{\\sqrt{x^{2}+${A}}}{${A}x}`,
          tail: `\\dfrac{1}{${A}}\\displaystyle\\int\\dfrac{\\cos\\theta}{\\sin^{2}\\theta}\\,d\\theta` },
        { q: `\\dfrac{dx}{\\left(x^{2}+${A}\\right)^{3/2}}`, key: `\\dfrac{x}{${A}\\sqrt{x^{2}+${A}}}`,
          tail: `\\dfrac{1}{${A}}\\displaystyle\\int\\cos\\theta\\,d\\theta` },
        { q: `\\dfrac{dx}{\\sqrt{x^{2}+${A}}}`, key: `\\ln\\left|x+\\sqrt{x^{2}+${A}}\\right|`,
          tail: `\\displaystyle\\int\\sec\\theta\\,d\\theta` },
      ],
      // x^2 - a^2   ->   x = a sec(theta)
      sec: [
        { q: `\\dfrac{dx}{x^{2}\\sqrt{x^{2}-${A}}}`, key: `\\dfrac{\\sqrt{x^{2}-${A}}}{${A}x}`,
          tail: `\\dfrac{1}{${A}}\\displaystyle\\int\\cos\\theta\\,d\\theta` },
        { q: `\\dfrac{dx}{\\sqrt{x^{2}-${A}}}`, key: `\\ln\\left|x+\\sqrt{x^{2}-${A}}\\right|`,
          tail: `\\displaystyle\\int\\sec\\theta\\,d\\theta` },
        { q: `\\dfrac{\\sqrt{x^{2}-${A}}}{x}\\,dx`, key: `\\sqrt{x^{2}-${A}}-${a}\\arctan\\left(\\dfrac{\\sqrt{x^{2}-${A}}}{${a}}\\right)`,
          tail: `${a}\\displaystyle\\int\\tan^{2}\\theta\\,d\\theta` },
      ],
    }[pat];

    const sh = r.pick(shapes);
    const meta = {
      sin: { sub: `x=${a}\\sin\\theta`, id: '1-\\sin^{2}\\theta=\\cos^{2}\\theta', rad: `\\sqrt{${A}-x^{2}}`, res: `${a}\\cos\\theta`, wrong: `x=${a}\\sec\\theta`, wid: '\\sec^{2}\\theta-1=\\tan^{2}\\theta' },
      tan: { sub: `x=${a}\\tan\\theta`, id: '1+\\tan^{2}\\theta=\\sec^{2}\\theta', rad: `\\sqrt{x^{2}+${A}}`, res: `${a}\\sec\\theta`, wrong: `x=${a}\\sin\\theta`, wid: '1-\\sin^{2}\\theta=\\cos^{2}\\theta' },
      sec: { sub: `x=${a}\\sec\\theta`, id: '\\sec^{2}\\theta-1=\\tan^{2}\\theta', rad: `\\sqrt{x^{2}-${A}}`, res: `${a}\\tan\\theta`, wrong: `x=${a}\\tan\\theta`, wid: '1+\\tan^{2}\\theta=\\sec^{2}\\theta' },
    }[pat];

    const key = `$${sh.key}+C$`;
    // a sign-flipped and an a-vs-a^2 variant, both genuinely wrong
    const flipped = sh.key.startsWith('-') ? sh.key.slice(1) : '-' + sh.key;
    const wrongConst = sh.key.split(String(A)).join(String(a));
    return {
      diff: /arcsin|arctan|\\ln/.test(sh.key) ? 4 : 3,
      prompt: `Compute $\\displaystyle\\int ${sh.q}$.`,
      choices: [
        { t: key, ok: true },
        ...choose(key, [
          { t: `$${flipped}+C$`, why: `Sign slip. Differentiate your answer and compare with the integrand — that catches this in five seconds.`, err: 'sign' },
          { t: `$${wrongConst}+C$`, why: `The constant is $a^{2}=${A}$, not $a=${a}$. Squaring matters: the substitution $${meta.sub}$ turns the radical into $${meta.res}$, and the $a$'s multiply up.`, err: 'algebra-slip' },
          { t: `$\\theta+C$ where $${meta.sub}$`, why: 'The answer must come back to $x$. Draw the reference triangle and convert every trig ratio back.', err: 'setup' },
          { t: `$\\dfrac{${meta.rad}}{${a}}+C$`, why: 'That is not an antiderivative of the integrand — differentiate it and compare. A trig substitution has to be carried all the way through, not guessed from the radical.', err: 'formula-confusion' },
        ]),
      ],
      hint: `The radical is $${meta.rad}$. Which Pythagorean identity turns that into a perfect square?`,
      steps: [
        `The radical $${meta.rad}$ matches the identity $${meta.id}$, so substitute $${meta.sub}$.`,
        `Then $${meta.rad} = ${meta.res}$, and $dx$ transforms to match.`,
        `The integral becomes $${sh.tail}$.`,
        `Integrate, then use the reference triangle to return to $x$: $${sh.key}+C$.`,
      ],
      recall: '$\\sqrt{a^{2}-x^{2}}\\to a\\sin\\theta$; $\\sqrt{a^{2}+x^{2}}\\to a\\tan\\theta$; $\\sqrt{x^{2}-a^{2}}\\to a\\sec\\theta$. Driven by the identity, not by memorising a table.',
      fix: 'Always finish by converting back to $x$ with the triangle. An answer left in $\\theta$ earns almost nothing.',
    };
  },
});


// ---------------------------------------------------------------
// Linear u-substitution, parameterised. His handout has a fixed list;
// this is the same drill with the numbers moving, because the whole
// point is doing it in your head repeatedly.
// ---------------------------------------------------------------
G.push({
  id: 'gw-linear-usub', unit: 'techniques', topic: 'Linear u-Substitution', diff: 1, diffs: [1, 2],
  src: "the drill behind his 'Linear u-Sub in Your Head' handout",
  make(r) {
    const a = r.nz(2, 9) * r.pick([1, 1, 1, -1]);
    const b = r.nz(1, 9) * r.pick([1, 1, -1]);
    const v = r.pick(['x', 'x', 'x', 't', 's']);
    const L = `${coef(a)}${v}${b < 0 ? '-' : '+'}${Math.abs(b)}`;
    const n = r.int(2, 5);

    const forms = [
      { q: `\\sin\\left(${L}\\right)`, anti: `-\\dfrac{\\cos\\left(${L}\\right)}{${a}}`, naked: `-\\cos\\left(${L}\\right)`, mult: `-${a}\\cos\\left(${L}\\right)`, flip: `\\dfrac{\\cos\\left(${L}\\right)}{${a}}` },
      { q: `\\cos\\left(${L}\\right)`, anti: `\\dfrac{\\sin\\left(${L}\\right)}{${a}}`, naked: `\\sin\\left(${L}\\right)`, mult: `${a}\\sin\\left(${L}\\right)`, flip: `-\\dfrac{\\sin\\left(${L}\\right)}{${a}}` },
      { q: `e^{${L}}`, anti: `\\dfrac{e^{${L}}}{${a}}`, naked: `e^{${L}}`, mult: `${a}e^{${L}}`, flip: `-\\dfrac{e^{${L}}}{${a}}` },
      { q: `\\sec^{2}\\left(${L}\\right)`, anti: `\\dfrac{\\tan\\left(${L}\\right)}{${a}}`, naked: `\\tan\\left(${L}\\right)`, mult: `${a}\\tan\\left(${L}\\right)`, flip: `-\\dfrac{\\tan\\left(${L}\\right)}{${a}}` },
      { q: `\\csc^{2}\\left(${L}\\right)`, anti: `-\\dfrac{\\cot\\left(${L}\\right)}{${a}}`, naked: `-\\cot\\left(${L}\\right)`, mult: `-${a}\\cot\\left(${L}\\right)`, flip: `\\dfrac{\\cot\\left(${L}\\right)}{${a}}` },
      { q: `\\sec\\left(${L}\\right)\\tan\\left(${L}\\right)`, anti: `\\dfrac{\\sec\\left(${L}\\right)}{${a}}`, naked: `\\sec\\left(${L}\\right)`, mult: `${a}\\sec\\left(${L}\\right)`, flip: `-\\dfrac{\\sec\\left(${L}\\right)}{${a}}` },
      { q: `\\left(${L}\\right)^{${n}}`, anti: `\\dfrac{\\left(${L}\\right)^{${n + 1}}}{${a * (n + 1)}}`, naked: `\\dfrac{\\left(${L}\\right)^{${n + 1}}}{${n + 1}}`, mult: `\\dfrac{${a}\\left(${L}\\right)^{${n + 1}}}{${n + 1}}`, flip: `\\dfrac{\\left(${L}\\right)^{${n - 1}}}{${a * (n - 1)}}` },
      { q: `\\dfrac{1}{${L}}`, anti: `\\dfrac{\\ln\\left|${L}\\right|}{${a}}`, naked: `\\ln\\left|${L}\\right|`, mult: `${a}\\ln\\left|${L}\\right|`, flip: `-\\dfrac{\\ln\\left|${L}\\right|}{${a}}` },
    ];
    const f = r.pick(forms);
    const key = `$${f.anti}+C$`;
    return {
      prompt: `Compute $\\displaystyle\\int ${f.q}\\,d${v}$.`,
      choices: [
        { t: key, ok: true },
        ...choose(key, [
          { t: `$${f.naked}+C$`, why: `The inner function is $${L}$, whose derivative is $${a}$ — so you owe a factor of $\\frac{1}{${a}}$. Differentiate this option and you will get $${a}$ times the integrand.`, err: 'chain-rule' },
          { t: `$${f.mult}+C$`, why: `You multiplied by $${a}$ instead of dividing. A linear inner function of slope $m$ costs you $\\frac1m$ when integrating, not $m$.`, err: 'inverted' },
          { t: `$${f.flip}+C$`, why: 'Check the sign (and the exponent) against the basic antiderivative before applying the linear correction.', err: 'sign' },
          { t: `$\\dfrac{${f.q}}{${a}}+C$`, why: 'You divided the integrand instead of integrating it. Integrate the outer function first, then divide by the inner slope.', err: 'inverse-op' },
        ]),
      ],
      hint: `The inside is linear, $${L}$. Integrate as if the inside were just $${v}$, then divide by its slope $${a}$.`,
      steps: [
        `$u = ${L}$, so $du = ${a}\\,d${v}$ and $d${v} = \\dfrac{du}{${a}}$.`,
        `Integrate the outer function in $u$, which gives $${f.naked.replace(new RegExp(L.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), 'u')}$.`,
        `Divide by the slope and substitute back: $${f.anti}+C$.`,
      ],
      recall: 'Linear inner function: integrate normally, then divide by the coefficient of $x$. Nothing else changes.',
      fix: 'Differentiate your answer in your head — the stray factor of the slope shows up immediately.',
    };
  },
});


// ---------------------------------------------------------------
// Improper integrals — the families that actually appear on his papers,
// not just p-integrals. The interior singularity is his favourite trap
// (Fall 2025 Exam 1 Q4).
// ---------------------------------------------------------------
G.push({
  id: 'gw-improper', unit: 'techniques', topic: 'Improper Integrals', diff: 4, diffs: [2, 3, 4],
  src: 'modelled on Fall 2025 Exam 1 Q4, Spring 2026 Exam 1 Q2, Spring 2025 final Q5',
  make(r) {
    const kind = r.pick(['interior', 'endpoint', 'arctan', 'expo', 'logp', 'lnx2']);
    const DIV = 'Diverges';
    const conv = v => `Converges to $${v}$`;

    if (kind === 'interior') {
      const c = r.int(2, 7), j = r.int(1, 3), k = r.int(1, 3);
      const q = `\\int_{${c - j}}^{${c + k}}\\dfrac{dx}{x-${c}}`;
      return {
        diff: kind === 'interior' || kind === 'lnx2' ? 4 : kind === 'endpoint' || kind === 'expo' ? 2 : 3,
        diff: kind === 'interior' || kind === 'lnx2' ? 4 : kind === 'endpoint' || kind === 'expo' ? 2 : 3,
      prompt: `Determine whether $\\displaystyle ${q}$ converges. If it does, find its value.`,
        choices: [
          { t: DIV, ok: true },
          ...choose(DIV, [
            { t: conv(`\\ln\\left(\\dfrac{${k}}{${j}}\\right)`), why: `You applied the Fundamental Theorem straight across, but the integrand blows up at $x=${c}$, which is **inside** $[${c - j},${c + k}]$. FTC needs continuity on the closed interval.`, err: 'improper' },
            { t: conv('0'), why: `The two halves are $-\\infty$ and $+\\infty$; they are not allowed to cancel. Each side must converge on its own.`, err: 'improper' },
            { t: conv(`\\ln(${j * k})`), why: `The integral is improper at the interior point $x=${c}$ — no finite value exists, whatever the algebra suggests.`, err: 'improper' },
            { t: conv(`\\ln\\left(\\dfrac{${j}}{${k}}\\right)`), why: `Even with the limits the right way round, the integral is improper at $x=${c}$ and has no value.`, err: 'improper' },
          ]),
        ],
        hint: `Before integrating anything, check the integrand for infinities **inside** $[${c - j}, ${c + k}]$, not just at the ends.`,
        steps: [
          `The integrand blows up at $x=${c}$, and $${c - j} < ${c} < ${c + k}$ — so this is improper at an interior point.`,
          `Split it: $\\displaystyle\\lim_{t\\to ${c}^{-}}\\int_{${c - j}}^{t}\\dfrac{dx}{x-${c}} + \\lim_{u\\to ${c}^{+}}\\int_{u}^{${c + k}}\\dfrac{dx}{x-${c}}$.`,
          `First piece: $\\displaystyle\\lim_{t\\to ${c}^{-}}\\Big[\\ln|x-${c}|\\Big]_{${c - j}}^{t} = -\\infty$.`,
          `One piece diverges, so the whole integral **diverges**. You never reach the second piece.`,
        ],
        recall: 'Scan the denominator for zeros inside the interval before writing an antiderivative. Applying FTC across a discontinuity gives a confident wrong answer.',
        fix: 'Both halves must converge independently. Infinities of opposite sign never cancel.',
      };
    }

    if (kind === 'endpoint') {
      const b = r.pick([4, 9, 16, 25]);
      const hard = r.pick([true, false]);
      if (hard) {                                    // 1/(b-x)^2 : diverges
        const q = `\\int_{0}^{${b}}\\dfrac{dx}{\\left(${b}-x\\right)^{2}}`;
        return {
          diff: kind === 'interior' || kind === 'lnx2' ? 4 : kind === 'endpoint' || kind === 'expo' ? 2 : 3,
        diff: kind === 'interior' || kind === 'lnx2' ? 4 : kind === 'endpoint' || kind === 'expo' ? 2 : 3,
      prompt: `Determine whether $\\displaystyle ${q}$ converges. If it does, find its value.`,
          choices: [
            { t: DIV, ok: true },
            ...choose(DIV, [
              { t: conv(`\\dfrac{1}{${b}}`), why: `Near a singularity the $p$-test flips: $\\int_{0}^{1}\\frac{dx}{x^{p}}$ converges only when $p<1$. Here $p=2$.`, err: 'improper' },
              { t: conv(`\\dfrac{2}{\\sqrt{${b}}}`), why: `That is the answer for $\\frac{1}{\\sqrt{${b}-x}}$, where $p=\\frac12<1$. A squared denominator blows up far too fast.`, err: 'formula-confusion' },
              { t: conv('0'), why: 'The integrand is strictly positive, so the integral cannot be zero.', err: 'algebra-slip' },
              { t: conv(`\\dfrac{2}{${b}}`), why: 'Check the antiderivative by differentiating it before you evaluate any limits.', err: 'algebra-slip' },
            ]),
          ],
          hint: `The trouble is at the upper limit $x=${b}$. Write the limit and compare with the $p$-test near a singularity.`,
          steps: [
            `The integrand blows up at the endpoint $x=${b}$, so rewrite as $\\displaystyle\\lim_{t\\to ${b}^{-}}\\int_{0}^{t}\\left(${b}-x\\right)^{-2}dx$.`,
            `Antiderivative: $\\dfrac{1}{${b}-x}$.`,
            `$\\displaystyle\\lim_{t\\to ${b}^{-}}\\left[\\dfrac{1}{${b}-x}\\right]_{0}^{t} = \\lim_{t\\to ${b}^{-}}\\left(\\dfrac{1}{${b}-t}-\\dfrac{1}{${b}}\\right) = \\infty$.`,
            `So the integral **diverges**.`,
          ],
          recall: 'Near a singularity $\\int\\frac{dx}{x^{p}}$ converges iff $p<1$. Near infinity it converges iff $p>1$. The two are opposite.',
        };
      }
      const q = `\\int_{0}^{${b}}\\dfrac{dx}{\\sqrt{${b}-x}}`;
      const val = 2 * Math.sqrt(b);
      return {
        diff: kind === 'interior' || kind === 'lnx2' ? 4 : kind === 'endpoint' || kind === 'expo' ? 2 : 3,
        diff: kind === 'interior' || kind === 'lnx2' ? 4 : kind === 'endpoint' || kind === 'expo' ? 2 : 3,
      prompt: `Determine whether $\\displaystyle ${q}$ converges. If it does, find its value.`,
        choices: [
          { t: conv(String(val)), ok: true },
          ...choose(conv(String(val)), [
            { t: DIV, why: `Near a singularity, $p=\\frac12<1$ is the **convergent** case. Only $p\\geq1$ diverges there.`, err: 'test-logic' },
            { t: conv(String(Math.sqrt(b))), why: `The antiderivative of $\\left(${b}-x\\right)^{-1/2}$ is $-2\\sqrt{${b}-x}$ — the $2$ comes from $\\frac{1}{1/2}$, and the minus from the inner $-1$.`, err: 'dropped-factor' },
            { t: conv(String(-val)), why: 'The integrand is positive on the whole interval, so the value must be positive. Two minus signs cancel here.', err: 'sign' },
          ]),
        ],
        hint: `Improper at the upper endpoint. Replace $${b}$ with $t$, integrate, then take $t\\to ${b}^{-}$.`,
        steps: [
          `$\\displaystyle\\int_{0}^{${b}}\\dfrac{dx}{\\sqrt{${b}-x}} = \\lim_{t\\to ${b}^{-}}\\int_{0}^{t}\\left(${b}-x\\right)^{-1/2}dx$.`,
          `Antiderivative: $-2\\sqrt{${b}-x}$.`,
          `$\\displaystyle\\lim_{t\\to ${b}^{-}}\\left[-2\\sqrt{${b}-x}\\right]_{0}^{t} = 0 + 2\\sqrt{${b}} = ${val}$.`,
        ],
        recall: 'A mild singularity ($p<1$) still gives a finite area. Write the limit anyway — he grades the notation.',
      };
    }

    if (kind === 'arctan') {
      const a = r.int(2, 5);            // a=1 collapses pi/(2a) and pi/(2a^2)
      const full = r.pick([true, false]);
      const q = full
        ? `\\int_{-\\infty}^{\\infty}\\dfrac{dx}{x^{2}+${a * a}}`
        : `\\int_{0}^{\\infty}\\dfrac{dx}{x^{2}+${a * a}}`;
      const val = full ? `\\dfrac{\\pi}{${a}}` : `\\dfrac{\\pi}{${2 * a}}`;
      const other = full ? `\\dfrac{\\pi}{${2 * a}}` : `\\dfrac{\\pi}{${a}}`;
      return {
        diff: kind === 'interior' || kind === 'lnx2' ? 4 : kind === 'endpoint' || kind === 'expo' ? 2 : 3,
        diff: kind === 'interior' || kind === 'lnx2' ? 4 : kind === 'endpoint' || kind === 'expo' ? 2 : 3,
      prompt: `Determine whether $\\displaystyle ${q}$ converges. If it does, find its value.`,
        choices: [
          { t: conv(val), ok: true },
          ...choose(conv(val), [
            { t: conv(other), why: full
              ? `Over the whole line you get $\\arctan(\\infty)-\\arctan(-\\infty) = \\frac{\\pi}{2}-\\left(-\\frac{\\pi}{2}\\right) = \\pi$ — twice the half-line answer.`
              : `From $0$ to $\\infty$ you only get $\\arctan(\\infty)-\\arctan(0) = \\frac{\\pi}{2}$, half of the whole-line answer.`, err: 'limits' },
            { t: conv(`\\dfrac{\\pi}{${2 * a * a}}`), why: `$\\displaystyle\\int\\dfrac{dx}{x^{2}+a^{2}} = \\dfrac{1}{a}\\arctan\\dfrac{x}{a}$ — the constant out front is $\\frac1a$, not $\\frac{1}{a^{2}}$.`, err: 'formula-confusion' },
            { t: DIV, why: 'The integrand decays like $\\frac{1}{x^{2}}$, which is the convergent case at infinity ($p=2>1$).', err: 'test-logic' },
            { t: conv(`\\dfrac{\\pi}{${4 * a}}`), why: `Check the limits of $\\arctan$ carefully: it runs to $\\frac{\\pi}{2}$, not $\\frac{\\pi}{4}$.`, err: 'limits' },
          ]),
        ],
        hint: `$\\displaystyle\\int\\dfrac{dx}{x^{2}+a^{2}} = \\dfrac{1}{a}\\arctan\\dfrac{x}{a}$. Then take the limits carefully.`,
        steps: [
          `Antiderivative: $\\dfrac{1}{${a}}\\arctan\\dfrac{x}{${a}}$.`,
          full
            ? `$\\displaystyle\\lim_{b\\to\\infty}\\dfrac{1}{${a}}\\arctan\\dfrac{b}{${a}} = \\dfrac{1}{${a}}\\cdot\\dfrac{\\pi}{2}$, and the lower limit contributes $-\\dfrac{1}{${a}}\\cdot\\left(-\\dfrac{\\pi}{2}\\right)$.`
            : `$\\displaystyle\\lim_{b\\to\\infty}\\dfrac{1}{${a}}\\arctan\\dfrac{b}{${a}} = \\dfrac{1}{${a}}\\cdot\\dfrac{\\pi}{2}$, and at $x=0$ the arctangent is $0$.`,
          `Value: $${val}$.`,
        ],
        recall: '$\\arctan x \\to \\frac{\\pi}{2}$ as $x\\to\\infty$ and $\\to-\\frac{\\pi}{2}$ as $x\\to-\\infty$. The whole line gives $\\pi$, a half-line gives $\\frac{\\pi}{2}$.',
      };
    }

    if (kind === 'expo') {
      const a = r.int(2, 6);
      const withX = r.pick([true, false]);
      const q = withX
        ? `\\int_{0}^{\\infty} x e^{-${a}x}\\,dx`
        : `\\int_{0}^{\\infty} e^{-${a}x}\\,dx`;
      const val = withX ? `\\dfrac{1}{${a * a}}` : `\\dfrac{1}{${a}}`;
      const other = withX ? `\\dfrac{1}{${a}}` : `\\dfrac{1}{${a * a}}`;
      return {
        diff: kind === 'interior' || kind === 'lnx2' ? 4 : kind === 'endpoint' || kind === 'expo' ? 2 : 3,
        diff: kind === 'interior' || kind === 'lnx2' ? 4 : kind === 'endpoint' || kind === 'expo' ? 2 : 3,
      prompt: `Determine whether $\\displaystyle ${q}$ converges. If it does, find its value.`,
        choices: [
          { t: conv(val), ok: true },
          ...choose(conv(val), [
            { t: conv(other), why: withX
              ? `The extra $x$ costs another factor of $\\frac{1}{${a}}$: integration by parts gives $\\frac{1}{${a}^{2}}$.`
              : `There is no $x$ here, so only one factor of $\\frac{1}{${a}}$ appears.`, err: 'algebra-slip' },
            { t: DIV, why: 'Exponential decay beats everything — $e^{-ax}$ with $a>0$ always gives a finite area on $[0,\\infty)$.', err: 'test-logic' },
            { t: conv(`${a}`), why: `Integrating $e^{-${a}x}$ **divides** by $${a}$; it does not multiply.`, err: 'inverted' },
            { t: conv('0'), why: 'The integrand is positive on $[0,\\infty)$, so the area is strictly positive.', err: 'algebra-slip' },
          ]),
        ],
        hint: withX ? 'Integration by parts, then take the limit. Exponential decay kills the boundary term.' : 'A direct antiderivative, then $b\\to\\infty$.',
        steps: [
          withX
            ? `Parts with $u=x$, $dv=e^{-${a}x}dx$ gives $-\\dfrac{xe^{-${a}x}}{${a}} - \\dfrac{e^{-${a}x}}{${a * a}}$.`
            : `Antiderivative: $-\\dfrac{e^{-${a}x}}{${a}}$.`,
          `As $b\\to\\infty$ every term with $e^{-${a}b}$ goes to $0$ — exponential decay beats the polynomial factor.`,
          `What is left is the value at $x=0$: $${val}$.`,
        ],
        recall: '$\\int_{0}^{\\infty}x^{n}e^{-ax}dx = \\frac{n!}{a^{n+1}}$. Always converges for $a>0$.',
      };
    }

    if (kind === 'logp') {
      const pp = r.pick([2, 3, 4]);
      const divergent = r.pick([true, false]);
      const q = `\\int_{e}^{\\infty}\\dfrac{dx}{x\\left(\\ln x\\right)^{${divergent ? 1 : pp}}}`;
      if (divergent) {
        return {
          diff: kind === 'interior' || kind === 'lnx2' ? 4 : kind === 'endpoint' || kind === 'expo' ? 2 : 3,
        diff: kind === 'interior' || kind === 'lnx2' ? 4 : kind === 'endpoint' || kind === 'expo' ? 2 : 3,
      prompt: `Determine whether $\\displaystyle ${q}$ converges. If it does, find its value.`,
          choices: [
            { t: DIV, ok: true },
            ...choose(DIV, [
              { t: conv('1'), why: `With $u=\\ln x$ this becomes $\\int_{1}^{\\infty}\\frac{du}{u}$ — the $p$-integral with $p=1$, which **diverges**. The antiderivative is $\\ln(\\ln x)$, and that grows without bound.`, err: 'test-logic' },
              { t: conv('\\ln 2'), why: `The substitution $u=\\ln x$ gives $\\int_{1}^{\\infty}\\frac{du}{u} = \\lim \\ln u = \\infty$.`, err: 'improper' },
              { t: conv('0'), why: 'The integrand is positive throughout, so the value cannot be zero.', err: 'algebra-slip' },
              { t: conv('\\ln(\\ln 2)'), why: 'The antiderivative is $\\ln(\\ln x)$, which has no finite limit as $x\\to\\infty$.', err: 'improper' },
            ]),
          ],
          hint: 'Substitute $u=\\ln x$ and see which $p$-integral you are really looking at.',
          steps: [
            `$u=\\ln x$, $du=\\dfrac{dx}{x}$. When $x=e$, $u=1$; as $x\\to\\infty$, $u\\to\\infty$.`,
            `The integral becomes $\\displaystyle\\int_{1}^{\\infty}\\dfrac{du}{u}$.`,
            `That is the $p$-integral with $p=1$ — the boundary case, which **diverges**.`,
            `Equivalently, the antiderivative is $\\ln(\\ln x)$, and $\\ln(\\ln b)\\to\\infty$.`,
          ],
          recall: 'The exponent on the logarithm is everything: $\\frac{1}{x\\ln x}$ diverges, $\\frac{1}{x(\\ln x)^{2}}$ converges.',
        };
      }
      const val = `\\dfrac{1}{${pp - 1}}`;
      return {
        diff: kind === 'interior' || kind === 'lnx2' ? 4 : kind === 'endpoint' || kind === 'expo' ? 2 : 3,
        diff: kind === 'interior' || kind === 'lnx2' ? 4 : kind === 'endpoint' || kind === 'expo' ? 2 : 3,
      prompt: `Determine whether $\\displaystyle ${q}$ converges. If it does, find its value.`,
        choices: [
          { t: conv(val), ok: true },
          ...choose(conv(val), [
            { t: DIV, why: `With $u=\\ln x$ this is $\\int_{1}^{\\infty}u^{-${pp}}du$, and $p=${pp}>1$ converges at infinity.`, err: 'test-logic' },
            { t: conv(`\\dfrac{1}{${pp}}`), why: `$\\displaystyle\\int_{1}^{\\infty}u^{-${pp}}du = \\left[\\dfrac{u^{${1 - pp}}}{${1 - pp}}\\right]_{1}^{\\infty} = \\dfrac{1}{${pp - 1}}$ — the denominator is $p-1$, not $p$.`, err: 'off-by-one' },
            { t: conv('1'), why: `That is the $p=2$ answer. Here $p=${pp}$, so the value is $\\frac{1}{${pp - 1}}$.`, err: 'algebra-slip' },
            { t: conv(`\\dfrac{1}{${pp + 1}}`), why: `After $u=\\ln x$ you integrate $u^{-${pp}}$, which gives $\\frac{1}{p-1}$ — subtract one, do not add.`, err: 'off-by-one' },
          ]),
        ],
        hint: 'Substitute $u=\\ln x$ — the $\\frac1x$ is exactly $du$.',
        steps: [
          `$u=\\ln x$, $du=\\dfrac{dx}{x}$; the limits become $u=1$ to $u\\to\\infty$.`,
          `$\\displaystyle\\int_{1}^{\\infty}u^{-${pp}}\\,du$, a $p$-integral with $p=${pp}>1$ — convergent.`,
          `Value: $\\left[\\dfrac{u^{${1 - pp}}}{${1 - pp}}\\right]_{1}^{\\infty} = 0 + \\dfrac{1}{${pp - 1}} = ${val}$.`,
        ],
        recall: 'On $[1,\\infty)$ the $p$-integral converges iff $p>1$, to $\\frac{1}{p-1}$.',
      };
    }

    // lnx2: ∫_1^∞ ln x / x^n dx = 1/(n-1)^2
    const n = r.int(3, 5);            // n=2 collapses 1/(n-1)^2 and 1/(n-1)
    const val = `\\dfrac{1}{${(n - 1) * (n - 1)}}`;
    const q = `\\int_{1}^{\\infty}\\dfrac{\\ln x}{x^{${n}}}\\,dx`;
    return {
      diff: kind === 'interior' || kind === 'lnx2' ? 4 : kind === 'endpoint' || kind === 'expo' ? 2 : 3,
      prompt: `Determine whether $\\displaystyle ${q}$ converges. If it does, find its value.`,
      choices: [
        { t: conv(val), ok: true },
        ...choose(conv(val), [
          { t: DIV, why: `$\\ln x$ grows more slowly than **any** positive power of $x$, so $\\frac{\\ln x}{x^{${n}}}$ still decays fast enough for $p=${n}>1$.`, err: 'test-logic' },
          { t: conv(`\\dfrac{1}{${n - 1}}`), why: `Parts produces $\\frac{1}{(n-1)^{2}}$, not $\\frac{1}{n-1}$ — the $\\frac{1}{n-1}$ appears twice, once from $v$ and once from the leftover integral.`, err: 'algebra-slip' },
          { t: conv(`\\dfrac{1}{${n * n}}`), why: `The exponent that matters is $n-1=${n - 1}$, from integrating $x^{-${n}}$.`, err: 'off-by-one' },
          { t: conv('0'), why: 'The integrand is positive for $x>1$, so the value is strictly positive.', err: 'algebra-slip' },
        ]),
      ],
      hint: 'Integration by parts with $u=\\ln x$, then take the limit. $\\ln b / b^{k}\\to 0$ for any $k>0$.',
      steps: [
        `Parts: $u=\\ln x$, $dv=x^{-${n}}dx$, so $v=\\dfrac{x^{${1 - n}}}{${1 - n}}$.`,
        `$\\displaystyle\\int_{1}^{b}\\dfrac{\\ln x}{x^{${n}}}dx = \\left[\\dfrac{-\\ln x}{${n - 1}\\,x^{${n - 1}}}\\right]_{1}^{b} + \\dfrac{1}{${n - 1}}\\int_{1}^{b}x^{-${n}}dx$.`,
        `As $b\\to\\infty$ the boundary term vanishes because $\\ln b$ loses to $b^{${n - 1}}$.`,
        `What remains is $\\dfrac{1}{${n - 1}}\\cdot\\dfrac{1}{${n - 1}} = ${val}$.`,
      ],
      recall: 'A logarithm never changes convergence at infinity — it is beaten by every positive power.',
    };
  },
});


// ---------------------------------------------------------------
// Numerical integration — the rule, the node weights, the arithmetic.
// Values are computed here, so the key is the true approximation.
// ---------------------------------------------------------------
G.push({
  id: 'gw-numint', unit: 'techniques', topic: 'Numerical Integration', diff: 3, diffs: [2, 3],
  make(r) {
    const fns = [
      { tex: '\\sqrt{x}', f: x => Math.sqrt(x), lo: 1, his: [3, 4, 5, 9] },
      { tex: '\\dfrac{1}{x}', f: x => 1 / x, lo: 1, his: [2, 3, 4, 5] },
      { tex: 'x^{2}', f: x => x * x, lo: 0, his: [2, 3, 4] },
      { tex: 'e^{-x}', f: x => Math.exp(-x), lo: 0, his: [1, 2, 3] },
      { tex: '\\ln x', f: x => Math.log(x), lo: 1, his: [3, 4, 5] },
      { tex: '\\dfrac{1}{1+x^{2}}', f: x => 1 / (1 + x * x), lo: 0, his: [1, 2, 3] },
      { tex: '\\sin x', f: x => Math.sin(x), lo: 0, his: [2, 3] },
    ];
    const F = r.pick(fns);
    const hi = r.pick(F.his);
    const n = r.pick([4, 4, 6, 8]);
    const rule = r.pick(['Trapezoid', 'Simpson', 'Midpoint']);
    const dx = (hi - F.lo) / n;
    const at = i => F.f(F.lo + i * dx);

    let val;
    if (rule === 'Trapezoid') {
      let t = at(0) + at(n);
      for (let i = 1; i < n; i++) t += 2 * at(i);
      val = (dx / 2) * t;
    } else if (rule === 'Simpson') {
      let t = at(0) + at(n);
      for (let i = 1; i < n; i++) t += (i % 2 ? 4 : 2) * at(i);
      val = (dx / 3) * t;
    } else {
      let t = 0;
      for (let i = 0; i < n; i++) t += F.f(F.lo + (i + 0.5) * dx);
      val = dx * t;
    }
    // the other two rules, as diagnostic distractors
    let trap = at(0) + at(n); for (let i = 1; i < n; i++) trap += 2 * at(i); trap *= dx / 2;
    let mid = 0; for (let i = 0; i < n; i++) mid += F.f(F.lo + (i + 0.5) * dx); mid *= dx;
    let simp = at(0) + at(n); for (let i = 1; i < n; i++) simp += (i % 2 ? 4 : 2) * at(i); simp *= dx / 3;

    const rd = v => (Math.round(v * 10000) / 10000).toString();
    const key = `$${rd(val)}$`;
    const wrongRule = rule === 'Trapezoid' ? ['Simpson', simp] : rule === 'Simpson' ? ['Trapezoid', trap] : ['Trapezoid', trap];
    const spares = [
      { t: `$${rd(wrongRule[1])}$`, why: `That is the **${wrongRule[0]} Rule** value. Check which rule the question asked for and which weights go with it.`, err: 'formula-confusion' },
      { t: `$${rd(rule === 'Midpoint' ? simp : mid)}$`, why: `That is a different rule's value — ${rule === 'Midpoint' ? "Simpson's, which samples the endpoints" : 'the Midpoint Rule, which samples the centre of each subinterval'}.`, err: 'formula-confusion' },
      { t: `$${rd(val * 2)}$`, why: rule === 'Trapezoid'
        ? 'You forgot the $\\frac12$. The Trapezoid Rule is $\\frac{\\Delta x}{2}\\left[f_0+2f_1+\\dots+f_n\\right]$.'
        : 'The leading factor is wrong — check $\\frac{\\Delta x}{2}$ (Trapezoid) versus $\\frac{\\Delta x}{3}$ (Simpson).', err: 'dropped-factor' },
      { t: `$${rd(val * n / (n + 1))}$`, why: `There are $n=${n}$ subintervals but $${n + 1}$ nodes. $\\Delta x = \\frac{b-a}{n} = \\frac{${hi}-${F.lo}}{${n}}$ uses the number of **subintervals**.`, err: 'off-by-one' },
    ];
    const weights = rule === 'Trapezoid' ? '1, 2, 2, \\dots, 2, 1'
      : rule === 'Simpson' ? '1, 4, 2, 4, \\dots, 4, 1' : 'one sample at the centre of each subinterval';
    return {
      prompt: `Approximate $\\displaystyle\\int_{${F.lo}}^{${hi}} ${F.tex}\\,dx$ with the **${rule} Rule**, $n=${n}$. Round to four decimal places.`,
      choices: [{ t: key, ok: true }, ...choose(key, spares)],
      hint: `$\\Delta x = \\dfrac{${hi}-${F.lo}}{${n}} = ${rd(dx)}$. Then apply the ${rule} weights: $${weights}$.`,
      steps: [
        `$\\Delta x = \\dfrac{b-a}{n} = \\dfrac{${hi}-${F.lo}}{${n}} = ${rd(dx)}$.`,
        rule === 'Midpoint'
          ? `Midpoint Rule samples the centre of each subinterval: $x_i^{*} = ${F.lo}+\\left(i+\\tfrac12\\right)\\Delta x$.`
          : `Nodes $x_i = ${F.lo} + i\\,\\Delta x$ for $i=0,\\dots,${n}$, with weights $${weights}$.`,
        rule === 'Trapezoid' ? `$T_{${n}} = \\dfrac{\\Delta x}{2}\\left[f_0+2f_1+\\dots+2f_{${n - 1}}+f_{${n}}\\right]$`
          : rule === 'Simpson' ? `$S_{${n}} = \\dfrac{\\Delta x}{3}\\left[f_0+4f_1+2f_2+\\dots+4f_{${n - 1}}+f_{${n}}\\right]$`
            : `$M_{${n}} = \\Delta x\\sum_{i=0}^{${n - 1}} f\\!\\left(x_i^{*}\\right)$`,
        `Evaluating gives $${rd(val)}$.`,
      ],
      recall: 'Trapezoid weights $1,2,\\dots,2,1$ over $2$. Simpson weights $1,4,2,\\dots,4,1$ over $3$ and needs $n$ even. Midpoint uses centres and no weights at all.',
      fix: 'Write $\\Delta x$ down first and count the nodes: $n$ subintervals means $n+1$ nodes.',
    };
  },
});

// ---------------------------------------------------------------
// Choosing a convergence test — the Exam 2 meta-skill
// ---------------------------------------------------------------
G.push({
  id: 'gw-whichtest', unit: 'series', topic: 'Choosing a Test', diff: 3, diffs: [2, 3],
  src: 'his Exam 2 papers ask this implicitly on all eight problems',
  make(r) {
    const items = [
      { s: '\\sum_{n=1}^{\\infty}\\frac{n^{2}}{n^{2}+1}', t: 'Divergence Test', why: 'The terms tend to $1$, not $0$ — one limit settles it.' },
      { s: '\\sum_{n=1}^{\\infty}\\frac{e^{n}-1}{e^{n}+1}', t: 'Divergence Test', why: 'The terms tend to $1$. Never start anywhere else.' },
      { s: '\\sum_{n=1}^{\\infty}\\frac{3n+1}{2n+5}', t: 'Divergence Test', why: 'Equal degrees means the terms tend to $\\frac32\\neq0$.' },
      { s: '\\sum_{n=1}^{\\infty}\\frac{(-3)^{n+1}}{2^{2n}}', t: 'Geometric Series Test', why: 'Normalise to $ar^{n}$: $2^{2n}=4^{n}$, so $r=-\\frac34$ and you can find the sum.' },
      { s: '\\sum_{n=1}^{\\infty}5\\left(\\frac{2^{2n+1}}{3^{n}}\\right)', t: 'Geometric Series Test', why: 'Normalising gives $r=\\frac43>1$ — divergent, and geometric tells you so immediately.' },
      { s: '\\sum_{n=1}^{\\infty}\\left(\\frac{1}{n+2}-\\frac{1}{n+3}\\right)', t: 'Telescoping', why: 'It is already a difference of consecutive terms — write out $S_N$ and watch it collapse.' },
      { s: '\\sum_{k=1}^{\\infty}\\frac{1}{(k+2)(k+3)}', t: 'Telescoping', why: 'Partial fractions turns it into a difference, and then almost everything cancels.' },
      { s: '\\sum_{n=1}^{\\infty}\\frac{n+3}{\\sqrt{4n^{4}-2}}', t: 'Limit Comparison Test', why: 'A ratio of powers: compare with $\\frac{1}{n}$, since $\\sqrt{n^{4}}=n^{2}$.' },
      { s: '\\sum_{n=1}^{\\infty}\\frac{n^{2}+5n-2}{3n^{4}-n+1}', t: 'Limit Comparison Test', why: 'Subtract degrees: it behaves like $\\frac{1}{n^{2}}$.' },
      { s: '\\sum_{n=2}^{\\infty}\\frac{n^{2}+1}{\\sqrt{n^{3}-5}}', t: 'Divergence Test', why: 'The terms behave like $\\sqrt n$, which grows — no comparison needed.' },
      { s: '\\sum_{n=0}^{\\infty}\\frac{n\\,2^{n}}{(2n)!}', t: 'Ratio Test', why: 'Factorials. The ratio collapses them in one step.' },
      { s: '\\sum_{n=0}^{\\infty}\\frac{n^{3}3^{n}}{n!}', t: 'Ratio Test', why: 'A factorial with an exponential — the ratio handles both at once.' },
      { s: '\\sum_{n=1}^{\\infty}\\left(\\frac{3n^{2}+5}{2n(n+1)}\\right)^{n}', t: 'Root Test', why: 'The whole term is raised to the $n$, so the $n$th root cancels the exponent outright.' },
      { s: '\\sum_{n=1}^{\\infty}\\left(\\frac{n+1}{2n+3}\\right)^{n}', t: 'Root Test', why: 'An $n$th power — take the $n$th root and read off a routine rational limit.' },
      { s: '\\sum_{n=2}^{\\infty}\\frac{1}{n(\\ln n)^{4}}', t: 'Integral Test', why: 'The substitution $u=\\ln x$ makes the integral trivial, and the function is positive, continuous and decreasing.' },
      { s: '\\sum_{n=1}^{\\infty}n e^{-n^{2}}', t: 'Integral Test', why: 'The integrand integrates in one substitution, and the terms are positive and decreasing.' },
      { s: '\\sum_{n=1}^{\\infty}(-1)^{n}\\frac{\\sqrt n}{n+1}', t: 'Alternating Series Test', why: 'Alternating with terms decreasing to $0$ — and check absolute convergence separately.' },
      { s: '\\sum_{n=1}^{\\infty}(-1)^{n}\\frac{1}{\\sqrt n}', t: 'Alternating Series Test', why: 'Comparison tests need positive terms, so they are unavailable here.' },
      { s: '\\sum_{n=1}^{\\infty}\\frac{1}{n^{3}}', t: 'p-Series Test', value: true, why: 'Straight $p$-series with $p=3>1$ — no work required.' },
      { s: '\\sum_{n=1}^{\\infty}\\frac{1}{\\sqrt[3]{n}}', t: 'p-Series Test', why: 'A $p$-series with $p=\\frac13<1$, so it diverges.' },
      { s: '\\sum_{n=1}^{\\infty}\\frac{1}{n^{2}+1}', t: 'Direct Comparison Test', why: 'Shrinking the denominator gives $\\frac{1}{n^{2}}$, a convergent bound in the right direction.' },
      { s: '\\sum_{n=1}^{\\infty}\\frac{2+\\sin n}{n^{2}}', t: 'Direct Comparison Test', why: 'The numerator is trapped between $1$ and $3$, so bound it above by $\\frac{3}{n^{2}}$.' },
    ];
    const pick = r.pick(items);
    const seen = new Set([pick.t]);
    const others = r.shuffle(items).filter(i => {
      if (seen.has(i.t)) return false;
      seen.add(i.t); return true;
    }).slice(0, 3);
    return {
      prompt: `Which test settles $\\displaystyle ${pick.s}$ most directly?`,
      choices: [
        { t: pick.t, ok: true },
        ...others.map(o => ({
          t: o.t,
          why: `The ${o.t} is the right first move on something like $\\displaystyle ${o.s}$ (${o.why}) — but not here. For this series: ${pick.why}`,
          err: 'test-logic',
        })),
      ],
      hint: 'Run the checklist: terms not going to zero? geometric or telescoping? a ratio of powers? factorials? an $n$th power? alternating?',
      steps: [
        'Order of attack: Divergence Test, then geometric/telescoping (which also give the sum), then limit comparison for rational shapes, then ratio for factorials, root for $n$th powers, AST for alternating, integral test last.',
        `Look at the structure of $\\displaystyle ${pick.s}$.`,
        pick.why,
        `Best first move: **${pick.t}**.`,
      ],
      recall: 'Always run the Divergence Test first — it is one limit and it ends several problems outright.',
      fix: 'He grades the justification, so name the test and verify its hypotheses before using it.',
    };
  },
});


// ---------------------------------------------------------------
// p-series and direct comparison, parameterised
// ---------------------------------------------------------------
G.push({
  id: 'gw-pcomp', unit: 'series', topic: 'p-Series & Comparison', diff: 3, diffs: [2, 3],
  make(r) {
    const mode = r.pick(['pure', 'compare']);
    if (mode === 'pure') {
      const num = r.int(1, 5), den = r.pick([1, 2, 3, 4]);
      const p = num / den;
      const ptex = den === 1 ? String(num) : `\\dfrac{${num}}{${den}}`;
      const body = den === 1 ? `\\dfrac{1}{n^{${num}}}` : `\\dfrac{1}{\\sqrt[${den}]{n^{${num}}}}`;
      const conv = p > 1;
      const key = conv ? 'Converges' : 'Diverges';
      return {
        prompt: `Does $\\displaystyle\\sum_{n=1}^{\\infty}${body}$ converge or diverge?`,
        choices: [
          { t: key, ok: true },
          ...choose(key, [
            { t: conv ? 'Diverges' : 'Converges', why: `Rewrite the radical as an exponent: $${body} = n^{-${ptex}}$, so $p=${ptex}${conv ? '>' : '<'}1$ — the $p$-test gives ${conv ? 'convergence' : 'divergence'}.`, err: 'test-logic' },
            { t: 'The $p$-test is inconclusive here', why: 'The $p$-test is never inconclusive — it decides every series of the form $\\sum n^{-p}$.', err: 'test-logic' },
            { t: 'Converges, because the terms tend to $0$', why: 'Terms tending to $0$ never proves convergence — $\\sum\\frac1n$ is the standing counterexample.', err: 'test-logic' },
          ]),
        ],
        hint: 'Turn every radical into an exponent, then read off $p$ and compare it with $1$.',
        steps: [
          `$${body} = n^{-${ptex}}$, so this is a $p$-series with $p=${ptex}$.`,
          `The $p$-series $\\sum n^{-p}$ converges exactly when $p>1$.`,
          `Here $p=${ptex} \\approx ${(Math.round(p * 1000) / 1000)}$, which is ${conv ? 'greater' : 'less'} than $1$ — so it **${conv ? 'converges' : 'diverges'}**.`,
        ],
        recall: '$\\sum\\frac{1}{n^{p}}$ converges iff $p>1$. $\\sqrt[k]{n^{m}} = n^{m/k}$.',
        fix: 'Convert radicals to fractional exponents before judging. $\\sqrt{n^{3}}$ is $n^{1.5}$, not $n^{3}$.',
      };
    }
    // direct comparison: which inequality actually works
    const k = r.int(1, 9), q = r.pick([2, 3, 4]);
    const shape = r.pick([
      { s: `\\dfrac{1}{n^{${q}}+${k}}`, good: `\\dfrac{1}{n^{${q}}+${k}} \\le \\dfrac{1}{n^{${q}}}`, bad: `\\dfrac{1}{n^{${q}}+${k}} \\ge \\dfrac{1}{n^{${q}}}`,
        why: `Making the denominator **smaller** makes the fraction **bigger**, so dropping the $+${k}$ gives an upper bound.` },
      { s: `\\dfrac{${k}+\\sin n}{n^{${q}}}`, good: `\\dfrac{${k}+\\sin n}{n^{${q}}} \\le \\dfrac{${k + 1}}{n^{${q}}}`, bad: `\\dfrac{${k}+\\sin n}{n^{${q}}} \\le \\dfrac{${k - 1}}{n^{${q}}}`,
        why: `$\\sin n$ never exceeds $1$, so the numerator is at most $${k + 1}$.` },
    ]);
    const key = `$${shape.good}$`;
    return {
      prompt: `You want to show $\\displaystyle\\sum_{n=1}^{\\infty}${shape.s}$ converges by **direct comparison**. Which inequality does the job?`,
      choices: [
        { t: key, ok: true },
        ...choose(key, [
          { t: `$${shape.bad}$`, why: `That inequality points the wrong way. To prove convergence you need an upper bound by something convergent — being **larger** than a convergent series proves nothing.`, err: 'test-logic' },
          { t: `$${shape.s} \\le \\dfrac{1}{n}$`, why: `True, but useless: $\\sum\\frac1n$ **diverges**, and being smaller than a divergent series tells you nothing.`, err: 'test-logic' },
          { t: `$${shape.s} \\ge \\dfrac{1}{n^{${q + 2}}}$`, why: 'A lower bound by a convergent series is also no information. Direct comparison has exactly two useful directions.', err: 'test-logic' },
        ]),
      ],
      hint: 'To prove convergence you need to be **below** something that converges. Which manipulation makes the fraction bigger?',
      steps: [
        `Direct comparison proves convergence only via an upper bound: $0\\le a_n\\le b_n$ with $\\sum b_n$ convergent.`,
        shape.why,
        `That gives $${shape.good}$, and $\\sum\\frac{1}{n^{${q}}}$ converges by the $p$-test ($p=${q}>1$).`,
        `So the original series converges.`,
      ],
      recall: 'Bigger-than-divergent proves divergence; smaller-than-convergent proves convergence. The other two combinations are worthless.',
      fix: 'If your inequality points the wrong way, switch to the Limit Comparison Test — it does not care about direction.',
    };
  },
});

// ---------------------------------------------------------------
// Taylor polynomials, centred anywhere
// ---------------------------------------------------------------
G.push({
  id: 'gw-taylorpoly', unit: 'series', topic: 'Taylor Polynomials & Error', diff: 3, diffs: [2, 3],
  make(r) {
    // `nof` = the same polynomial with the factorials left out, which is a
    // genuinely wrong answer. Deriving a distractor by string surgery produced
    // "1 - x^2/2!", which is the key written differently — not a distractor.
    const cases = [
      { f: 'e^{x}', c: 0, t1: '1+x', t2: '1+x+\\dfrac{x^{2}}{2}', t3: '1+x+\\dfrac{x^{2}}{2}+\\dfrac{x^{3}}{6}',
        nof2: '1+x+x^{2}', nof3: '1+x+x^{2}+x^{3}' },
      { f: '\\sin x', c: 0, t1: 'x', t2: 'x', t3: 'x-\\dfrac{x^{3}}{6}',
        nof2: 'x-\\dfrac{x^{2}}{2}', nof3: 'x-x^{3}' },
      { f: '\\cos x', c: 0, t1: '1', t2: '1-\\dfrac{x^{2}}{2}', t3: '1-\\dfrac{x^{2}}{2}',
        nof2: '1-x^{2}', nof3: '1-x^{2}' },
      { f: '\\ln(1+x)', c: 0, t1: 'x', t2: 'x-\\dfrac{x^{2}}{2}', t3: 'x-\\dfrac{x^{2}}{2}+\\dfrac{x^{3}}{3}',
        nof2: 'x-x^{2}', nof3: 'x-x^{2}+x^{3}' },
      { f: '\\sqrt{x}', c: 1, t1: '1+\\dfrac{x-1}{2}', t2: '1+\\dfrac{x-1}{2}-\\dfrac{(x-1)^{2}}{8}', t3: '1+\\dfrac{x-1}{2}-\\dfrac{(x-1)^{2}}{8}+\\dfrac{(x-1)^{3}}{16}',
        nof2: '1+\\dfrac{x-1}{2}-\\dfrac{(x-1)^{2}}{4}', nof3: '1+\\dfrac{x-1}{2}-\\dfrac{(x-1)^{2}}{4}+\\dfrac{3(x-1)^{3}}{8}' },
      { f: '\\dfrac{1}{x}', c: 1, t1: '1-(x-1)', t2: '1-(x-1)+(x-1)^{2}', t3: '1-(x-1)+(x-1)^{2}-(x-1)^{3}',
        nof2: '1-(x-1)+2(x-1)^{2}', nof3: '1-(x-1)+2(x-1)^{2}-6(x-1)^{3}' },
      { f: '\\dfrac{1}{x}', c: 2, t1: '\\dfrac{1}{2}-\\dfrac{x-2}{4}', t2: '\\dfrac{1}{2}-\\dfrac{x-2}{4}+\\dfrac{(x-2)^{2}}{8}', t3: '\\dfrac{1}{2}-\\dfrac{x-2}{4}+\\dfrac{(x-2)^{2}}{8}-\\dfrac{(x-2)^{3}}{16}',
        nof2: '\\dfrac{1}{2}-\\dfrac{x-2}{4}+\\dfrac{(x-2)^{2}}{4}', nof3: '\\dfrac{1}{2}-\\dfrac{x-2}{4}+\\dfrac{(x-2)^{2}}{4}-\\dfrac{3(x-2)^{3}}{8}' },
      { f: '\\ln x', c: 1, t1: 'x-1', t2: '(x-1)-\\dfrac{(x-1)^{2}}{2}', t3: '(x-1)-\\dfrac{(x-1)^{2}}{2}+\\dfrac{(x-1)^{3}}{3}',
        nof2: '(x-1)-(x-1)^{2}', nof3: '(x-1)-(x-1)^{2}+2(x-1)^{3}' },
    ];
    const C = r.pick(cases);
    const n = r.pick([2, 3]);
    const key = `$${n === 2 ? C.t2 : C.t3}$`;
    const other = n === 2 ? C.t3 : C.t2;
    return {
      prompt: `Find the degree-$${n}$ Taylor polynomial $T_{${n}}(x)$ for $f(x)=${C.f}$ centred at $x=${C.c}$.`,
      choices: [
        { t: key, ok: true },
        ...choose(key, [
          { t: `$${other}$`, why: `That is $T_{${n === 2 ? 3 : 2}}$. Degree $${n}$ means you keep every term up to and including $(x-${C.c})^{${n}}$ — and a vanishing derivative can make two consecutive polynomials identical.`, err: 'off-by-one' },
          { t: `$${C.t1}$`, why: `That is only $T_{1}$, the tangent line. You need terms through degree $${n}$.`, err: 'off-by-one' },
          { t: `$${(n === 2 ? C.t2 : C.t3).split('-').join('+')}$`, why: `Signs. Compute $f'(${C.c})$, $f''(${C.c})$ as actual numbers and let each carry its own sign.`, err: 'sign' },
          { t: `$${n === 2 ? C.nof2 : C.nof3}$`, why: `The coefficients are $\\frac{f^{(k)}(${C.c})}{k!}$. Work out each derivative at $x=${C.c}$ as a number and then divide by $k!$ — $2!=2$, $3!=6$. A derivative that comes out $0$ kills its term entirely.`, err: 'formula-confusion' },
          // When a derivative vanishes, T_1 = T_2 or T_2 = T_3 and several of the
          // spares above collapse onto the key. These two never can.
          { t: `$${n === 2 ? C.nof3 : C.nof2}$`, why: `Both the degree and the factorials are off here. $T_{${n}}$ keeps every term through $(x-${C.c})^{${n}}$, each divided by its own $k!$.`, err: 'formula-confusion' },
          { t: `$${C.f}$`, why: 'That is the function itself. A Taylor polynomial is a polynomial approximation **to** it, built from its derivatives at the centre.', err: 'conceptual' },
        ]),
      ],
      hint: `$T_{${n}}(x)=\\sum_{k=0}^{${n}}\\dfrac{f^{(k)}(${C.c})}{k!}(x-${C.c})^{k}$ — compute the derivatives at $x=${C.c}$ as numbers first.`,
      steps: [
        `$T_{${n}}(x) = \\displaystyle\\sum_{k=0}^{${n}}\\frac{f^{(k)}(${C.c})}{k!}(x-${C.c})^{k}$.`,
        `Differentiate $${C.f}$ repeatedly and evaluate each one at $x=${C.c}$.`,
        `Divide the $k$-th by $k!$ and attach $(x-${C.c})^{k}$.`,
        `$T_{${n}}(x) = ${n === 2 ? C.t2 : C.t3}$`,
      ],
      recall: 'Degree $n$ matches the first $n$ derivatives at the centre. $T_1$ is the tangent line; $T_2$ adds the curvature.',
      fix: 'Evaluate the derivatives at the centre as plain numbers before assembling — that is where signs get lost.',
    };
  },
});

export const wide = { unit: 'techniques', problems: P, generators: G };
