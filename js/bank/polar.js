// ---------------------------------------------------------------
// bank/polar.js — Unit 05: Parametric & Polar
// ---------------------------------------------------------------
import { frac, choose } from '../util.js';

const P = [];
const G = [];

// =================================================================
// STATIC
// =================================================================

P.push({
  id: 'p-dydx', topic: 'Parametric Calculus', diff: 2,
  prompt: 'For a curve given by $x=x(t)$, $y=y(t)$, the slope $\\dfrac{dy}{dx}$ equals:',
  choices: [
    { t: '$\\dfrac{dy/dt}{dx/dt}$', ok: true },
    { t: '$\\dfrac{d}{dt}\\!\\left(\\dfrac{y}{x}\\right)$', why: 'That is the derivative of the **ratio** $y/x$, a completely different quantity. Slope is a ratio of derivatives, not a derivative of a ratio.' },
    { t: '$\\dfrac{dx/dt}{dy/dt}$', why: 'Upside down. Think of it as $\\frac{dy}{dt}\\cdot\\frac{dt}{dx}$ — the $dt$\'s cancel and $dy$ ends up on top.' },
    { t: '$\\dfrac{dy}{dt}\\cdot\\dfrac{dx}{dt}$', why: 'The chain rule needs $\\frac{dt}{dx}$, which is the **reciprocal** of $\\frac{dx}{dt}$. Multiplying gives the wrong units entirely.' },
  ],
  steps: [
    'Chain rule: $\\dfrac{dy}{dt} = \\dfrac{dy}{dx}\\cdot\\dfrac{dx}{dt}$.',
    'Solve for $\\dfrac{dy}{dx}$: divide both sides by $\\dfrac{dx}{dt}$.',
    '$\\dfrac{dy}{dx} = \\dfrac{dy/dt}{dx/dt}$, valid wherever $\\frac{dx}{dt}\\ne0$.',
    'Vertical tangents occur where $\\frac{dx}{dt}=0$ (and $\\frac{dy}{dt}\\ne0$); horizontal tangents where $\\frac{dy}{dt}=0$ (and $\\frac{dx}{dt}\\ne0$).',
  ],
  recall: 'Divide the two velocities. The parameter $t$ cancels out — the slope is geometric, independent of how fast you traverse the curve.',
  viz: {
    kind: 'param', x: t => t * t - 1, y: t => t ** 3 - 2 * t, t0: -1.9, t1: 1.9,
    marks: [-1.2, 0.9], markLabel: t => `t=${Math.round(t * 10) / 10}`,
    cap: 'Arrows show the direction of increasing $t$. The curve crosses itself, so "slope at a point" depends on **which $t$** you are at — another reason to work in $t$.',
  },
});

P.push({
  id: 'p-polar-area', topic: 'Polar Area & Arc Length', diff: 2,
  prompt: 'The area swept by a polar curve $r=f(\\theta)$ from $\\theta=\\alpha$ to $\\beta$ is:',
  choices: [
    { t: '$\\dfrac{1}{2}\\displaystyle\\int_{\\alpha}^{\\beta}r^{2}\\,d\\theta$', ok: true },
    { t: '$\\displaystyle\\int_{\\alpha}^{\\beta}r\\,d\\theta$', why: 'This treats polar like Cartesian. Polar area is built from thin **circular sectors**, whose area is $\\frac12r^{2}\\Delta\\theta$ — both the $\\frac12$ and the square are essential.' },
    { t: '$\\displaystyle\\int_{\\alpha}^{\\beta}r^{2}\\,d\\theta$', why: 'Missing the $\\frac12$. A sector of angle $\\Delta\\theta$ is the fraction $\\frac{\\Delta\\theta}{2\\pi}$ of a full disk $\\pi r^{2}$, which gives $\\frac12r^{2}\\Delta\\theta$.' },
    { t: '$\\pi\\displaystyle\\int_{\\alpha}^{\\beta}r^{2}\\,d\\theta$', why: 'The $\\pi$ has already cancelled: $\\frac{\\Delta\\theta}{2\\pi}\\cdot\\pi r^{2}=\\frac12 r^{2}\\Delta\\theta$. Keeping it double-counts.' },
  ],
  steps: [
    'Slice the region into thin wedges of angle $d\\theta$ — each is nearly a circular sector of radius $r$.',
    'Sector area $=\\dfrac{d\\theta}{2\\pi}\\cdot\\pi r^{2} = \\dfrac{1}{2}r^{2}\\,d\\theta$.',
    'Add them up: $A=\\dfrac12\\displaystyle\\int_\\alpha^\\beta \\left[f(\\theta)\\right]^{2}d\\theta$.',
    'Sanity check on $r=R$ (a circle) over $[0,2\\pi]$: $\\frac12R^{2}(2\\pi)=\\pi R^{2}$. ✓',
  ],
  recall: 'Polar area: $\\frac12\\int r^{2}d\\theta$. Polar arc length: $\\int\\sqrt{r^{2}+(r\')^{2}}\\,d\\theta$. Different formulas — do not blend them.',
  viz: {
    kind: 'polar', r: t => 1 + Math.cos(t), t0: 0, t1: Math.PI * 2,
    rays: [0.6, 1.2], tag: 'r = 1 + cos θ (cardioid)',
    cap: 'Two rays cut out a wedge. Each wedge is a sector of radius $r(\\theta)$, and $\\frac12r^{2}d\\theta$ is its area.',
  },
});

P.push({
  id: 'p-petals', topic: 'Polar Coordinates', diff: 3,
  prompt: 'How many petals does $r=\\cos(4\\theta)$ have?',
  choices: [
    { t: '$8$', ok: true },
    { t: '$4$', why: 'The rule flips on parity: $r=\\cos(k\\theta)$ has $k$ petals when $k$ is **odd** and $2k$ when $k$ is **even**. Since $4$ is even, you get $8$.' },
    { t: '$2$', why: 'That would be $r=\\cos(\\theta)$-like behaviour. The coefficient $4$ controls how fast the curve cycles, producing many more petals.' },
    { t: '$16$', why: 'You doubled twice. The rule is $2k=2(4)=8$, applied once.' },
  ],
  steps: [
    'For $k$ **odd**, the curve retraces itself over $[0,\\pi]$, giving exactly $k$ petals.',
    'For $k$ **even**, tracing $[0,2\\pi]$ produces $2k$ distinct petals — nothing overlaps.',
    'Here $k=4$ is even, so there are $2(4)=8$ petals.',
    'Each petal spans $\\Delta\\theta = \\frac{\\pi}{k}=\\frac{\\pi}{4}$ between consecutive zeros of $\\cos(4\\theta)$.',
  ],
  recall: '$r=\\cos(k\\theta)$ or $\\sin(k\\theta)$: **odd $k$ → $k$ petals, even $k$ → $2k$ petals.**',
  viz: {
    kind: 'polar', r: t => Math.cos(4 * t), t0: 0, t1: Math.PI * 2, shade: false,
    tag: 'r = cos(4θ) — count them',
    cap: 'Eight petals. With an odd coefficient the second lap would retrace the first, halving the count.',
  },
});

P.push({
  id: 'p-arclen-param', topic: 'Parametric Curves', diff: 2,
  prompt: 'The arc length of a parametric curve from $t=a$ to $t=b$ is:',
  choices: [
    { t: '$\\displaystyle\\int_{a}^{b}\\sqrt{\\left(\\frac{dx}{dt}\\right)^{2}+\\left(\\frac{dy}{dt}\\right)^{2}}\\,dt$', ok: true },
    { t: '$\\displaystyle\\int_{a}^{b}\\sqrt{1+\\left(\\frac{dy}{dx}\\right)^{2}}\\,dt$', why: 'You mixed the Cartesian formula with a $dt$. If you use $\\frac{dy}{dx}$ you must also integrate $dx$, not $dt$ — the differentials have to match.' },
    { t: '$\\displaystyle\\int_{a}^{b}\\left(\\frac{dx}{dt}+\\frac{dy}{dt}\\right)dt$', why: 'That adds the two displacements instead of taking the hypotenuse. Distance in the plane is Pythagorean, not additive.' },
    { t: '$\\displaystyle\\int_{a}^{b}\\sqrt{\\left(\\frac{dx}{dt}\\right)^{2}-\\left(\\frac{dy}{dt}\\right)^{2}}\\,dt$', why: 'A minus sign would make the radicand negative whenever the curve rises faster than it runs. Lengths add in quadrature with a **plus**.' },
  ],
  steps: [
    '$ds=\\sqrt{dx^{2}+dy^{2}}$ — Pythagoras on an infinitesimal piece.',
    'Factor out $dt$: $ds = \\sqrt{\\left(\\frac{dx}{dt}\\right)^{2}+\\left(\\frac{dy}{dt}\\right)^{2}}\\,dt$.',
    'Integrate over the parameter range.',
    'This is speed integrated over time — total distance travelled, which is exactly arc length (when the curve is traversed once).',
  ],
  recall: 'Every arc-length formula is $\\int\\sqrt{dx^{2}+dy^{2}}$ in disguise. Factor out whichever differential you are integrating against.',
});

P.push({
  id: 'p-polar-arclen', topic: 'Polar Area & Arc Length', diff: 3,
  prompt: 'The arc length of $r=f(\\theta)$ from $\\alpha$ to $\\beta$ is:',
  choices: [
    { t: '$\\displaystyle\\int_{\\alpha}^{\\beta}\\sqrt{r^{2}+\\left(\\frac{dr}{d\\theta}\\right)^{2}}\\,d\\theta$', ok: true },
    { t: '$\\dfrac{1}{2}\\displaystyle\\int_{\\alpha}^{\\beta}r^{2}\\,d\\theta$', why: 'That is polar **area**. Arc length has no $\\frac12$ and involves the derivative of $r$.' },
    { t: '$\\displaystyle\\int_{\\alpha}^{\\beta}\\sqrt{1+\\left(\\frac{dr}{d\\theta}\\right)^{2}}\\,d\\theta$', why: 'You imported the Cartesian formula. In polar the "$1$" is replaced by $r^{2}$, because moving through an angle $d\\theta$ sweeps an arc of length $r\\,d\\theta$ — the further out you are, the more distance you cover.' },
    { t: '$\\displaystyle\\int_{\\alpha}^{\\beta}r\\,d\\theta$', why: 'That only counts motion **around** the origin and ignores any change in $r$. It is correct only for a circle, where $\\frac{dr}{d\\theta}=0$.' },
  ],
  steps: [
    'Convert: $x=r\\cos\\theta$, $y=r\\sin\\theta$ with $r=f(\\theta)$.',
    'Differentiate and simplify $\\left(\\frac{dx}{d\\theta}\\right)^{2}+\\left(\\frac{dy}{d\\theta}\\right)^{2}$ — the cross terms cancel.',
    'What survives is $r^{2}+\\left(\\frac{dr}{d\\theta}\\right)^{2}$.',
    '$L=\\displaystyle\\int_\\alpha^\\beta\\sqrt{r^{2}+(r\')^{2}}\\,d\\theta$. Check on a circle $r=R$: $\\int_0^{2\\pi}R\\,d\\theta=2\\pi R$. ✓',
  ],
  recall: 'Polar arc length: $\\sqrt{r^{2}+(r\')^{2}}$. The $r^{2}$ is the "going around" part, $(r\')^{2}$ the "going outward" part.',
});

P.push({
  id: 'p-convert-circle', topic: 'Polar Coordinates', diff: 2,
  prompt: 'What curve is $r=6\\sin\\theta$?',
  choices: [
    { t: 'A circle of radius $3$ centered at $(0,3)$', ok: true },
    { t: 'A circle of radius $6$ centered at the origin', why: 'That would be $r=6$ (constant). Here $r$ varies with $\\theta$, so the circle is shifted off the origin and its radius is halved.' },
    { t: 'A cardioid', why: 'A cardioid is $r=a\\pm b\\cos\\theta$ or $a\\pm b\\sin\\theta$ with **both** a constant and a trig term. $r=6\\sin\\theta$ has no constant.' },
    { t: 'A vertical line', why: 'Lines through the origin are $\\theta=$ const; a vertical line is $r\\cos\\theta=c$. This has $\\sin\\theta$ multiplying $r$, which produces a circle.' },
  ],
  steps: [
    'Multiply both sides by $r$: $r^{2}=6r\\sin\\theta$.',
    'Substitute $r^{2}=x^{2}+y^{2}$ and $r\\sin\\theta=y$: $x^{2}+y^{2}=6y$.',
    'Complete the square: $x^{2}+(y-3)^{2}=9$.',
    'A circle of radius $3$ centered at $(0,3)$ — tangent to the $x$-axis at the origin.',
  ],
  recall: '$r=a\\sin\\theta$ → circle radius $\\frac a2$ centered at $(0,\\frac a2)$. $r=a\\cos\\theta$ → radius $\\frac a2$ centered at $(\\frac a2,0)$.',
  viz: {
    kind: 'polar', r: t => 6 * Math.sin(t), t0: 0, t1: Math.PI, shade: false,
    tag: 'r = 6 sin θ',
    cap: 'The whole circle is traced as $\\theta$ runs over just $[0,\\pi]$ — letting $\\theta$ go to $2\\pi$ would retrace it.',
  },
});

// =================================================================
// GENERATORS
// =================================================================

G.push({
  id: 'g-p-dydx', topic: 'Parametric Calculus', diff: 2,
  make(r) {
    const kind = r.pick(['poly', 'trig', 'exp']);
    if (kind === 'poly') {
      const m = r.int(2, 3), n = m + r.int(1, 2);
      return {
        prompt: `A curve is given by $x=t^{${m}}$, $y=t^{${n}}$. Find $\\dfrac{dy}{dx}$.`,
        choices: [
          { t: `$\\dfrac{${n}}{${m}}t^{${n - m}}$`, ok: true },
          { t: `$\\dfrac{${m}}{${n}}t^{${m - n}}$`, why: 'Inverted. $\\frac{dy}{dx}=\\frac{dy/dt}{dx/dt}$ puts $\\frac{dy}{dt}$ on **top**.' },
          { t: `$${n}t^{${n - 1}}$`, why: 'That is just $\\frac{dy}{dt}$. You still have to divide by $\\frac{dx}{dt}$.' },
          { t: `$${m * n}t^{${m + n - 2}}$`, why: 'You multiplied the two derivatives. The chain rule requires dividing.' },
        ],
        steps: [
          `$\\dfrac{dx}{dt}=${m}t^{${m - 1}}$, $\\dfrac{dy}{dt}=${n}t^{${n - 1}}$`,
          `$\\dfrac{dy}{dx}=\\dfrac{${n}t^{${n - 1}}}{${m}t^{${m - 1}}}$`,
          `$= \\dfrac{${n}}{${m}}t^{${n - m}}$`,
        ],
        recall: 'Differentiate each coordinate with respect to $t$, then divide $y$-rate by $x$-rate.',
      };
    }
    if (kind === 'trig') {
      const a = r.int(2, 4);
      return {
        prompt: `A curve is given by $x=${a}\\cos t$, $y=${a}\\sin t$. Find $\\dfrac{dy}{dx}$.`,
        choices: [
          { t: '$-\\cot t$', ok: true },
          { t: '$-\\tan t$', why: 'Flipped. $\\frac{dy}{dx}=\\frac{\\cos t}{-\\sin t}=-\\cot t$; you inverted the ratio.' },
          { t: '$\\cot t$', why: `Sign. $\\frac{dx}{dt}=-${a}\\sin t$ carries a minus that survives into the quotient.` },
          { t: `$\\dfrac{${a}\\sin t}{${a}\\cos t}$`, why: 'That is $\\frac{y}{x}$, not $\\frac{dy}{dx}$. You must differentiate both coordinates first.' },
        ],
        steps: [
          `$\\dfrac{dx}{dt} = -${a}\\sin t$, $\\dfrac{dy}{dt}=${a}\\cos t$`,
          `$\\dfrac{dy}{dx} = \\dfrac{${a}\\cos t}{-${a}\\sin t} = -\\dfrac{\\cos t}{\\sin t} = -\\cot t$`,
          `Geometric check: this is a circle of radius $${a}$, and the tangent is perpendicular to the radius. ✓`,
        ],
        recall: 'The amplitude cancels in the slope — the parameterization\'s scale never affects $\\frac{dy}{dx}$.',
        viz: {
          kind: 'param', x: t => a * Math.cos(t), y: t => a * Math.sin(t), t0: 0, t1: Math.PI * 2,
          marks: [Math.PI / 4], markLabel: () => 't = π/4',
          cap: 'At $t=\\frac{\\pi}{4}$ the radius has slope $1$ and the tangent has slope $-1=-\\cot\\frac\\pi4$. Perpendicular, as expected.',
        },
      };
    }
    const k = r.int(2, 3);
    return {
      prompt: `A curve is given by $x=e^{${k}t}$, $y=t^{2}$. Find $\\dfrac{dy}{dx}$.`,
      choices: [
        { t: `$\\dfrac{2t}{${k}e^{${k}t}}$`, ok: true },
        { t: `$\\dfrac{${k}e^{${k}t}}{2t}$`, why: 'Inverted — $\\frac{dy}{dt}$ belongs on top.' },
        { t: `$\\dfrac{2t}{e^{${k}t}}$`, why: `You forgot the chain rule on $x$: $\\frac{d}{dt}e^{${k}t} = ${k}e^{${k}t}$.` },
        { t: `$2te^{${k}t}$`, why: 'You multiplied instead of dividing.' },
      ],
      steps: [
        `$\\dfrac{dx}{dt} = ${k}e^{${k}t}$, $\\dfrac{dy}{dt}=2t$`,
        `$\\dfrac{dy}{dx} = \\dfrac{2t}{${k}e^{${k}t}}$`,
      ],
      recall: 'Both derivatives are with respect to $t$; the chain rule applies to each separately before dividing.',
    };
  },
});

G.push({
  id: 'g-p-polararea', topic: 'Polar Area & Arc Length', diff: 3,
  make(r) {
    const kind = r.pick(['circle', 'petal', 'cardioid']);
    if (kind === 'circle') {
      const a = r.pick([2, 4, 6]);
      const pi = v => `$${v === 1 ? '' : v}\\pi$`;      // "π", not "1π"
      const key = pi((a / 2) ** 2);
      return {
        prompt: `Find the area enclosed by $r=${a}\\cos\\theta$.`,
        choices: [
          { t: key, ok: true },
          ...choose(key, [
            { t: pi(a * a), why: `You used $${a}$ as the radius. But $r=${a}\\cos\\theta$ is a circle of radius $\\frac{${a}}{2}=${a / 2}$, so the area is $\\pi(${a / 2})^{2}$.` },
            { t: pi((a * a) / 2), why: 'You halved the area instead of the radius. The $\\frac12$ in the polar formula is already accounted for by the integration.' },
            { t: pi(2 * a), why: 'That is a **circumference**, not an area. Area scales with the square of the radius.' },
            { t: pi((a / 2) ** 2 / 2), why: `An extra factor of $\\frac12$. Once you integrate $\\frac12\\int r^{2}d\\theta$ correctly you get $\\pi R^{2}$ with $R=${a / 2}$ — no further halving.` },
            { t: pi(a / 2), why: `You used the radius $${a / 2}$ without squaring it.` },
          ]),
        ],
        steps: [
          `The full circle is traced for $\\theta\\in\\left[-\\frac{\\pi}{2},\\frac{\\pi}{2}\\right]$ — not $[0,2\\pi]$, which would double-count.`,
          `$A=\\dfrac12\\displaystyle\\int_{-\\pi/2}^{\\pi/2}${a * a}\\cos^{2}\\theta\\,d\\theta = \\dfrac{${a * a}}{2}\\int_{-\\pi/2}^{\\pi/2}\\dfrac{1+\\cos2\\theta}{2}d\\theta$`,
          `$=\\dfrac{${a * a}}{4}\\left[\\theta+\\dfrac{\\sin2\\theta}{2}\\right]_{-\\pi/2}^{\\pi/2} = \\dfrac{${a * a}}{4}\\pi$`,
          `$= ${(a / 2) ** 2}\\pi$ — matching $\\pi R^{2}$ with $R=${a / 2}$. ✓`,
        ],
        recall: 'Watch the $\\theta$-range: $r=a\\cos\\theta$ completes its circle over an interval of length $\\pi$, not $2\\pi$.',
        viz: {
          kind: 'polar', r: t => a * Math.cos(t), t0: -Math.PI / 2, t1: Math.PI / 2,
          tag: `r = ${a} cos θ`,
          cap: `A circle of radius $${a / 2}$ sitting to the right of the origin — not centered on it.`,
        },
      };
    }
    if (kind === 'petal') {
      const k = r.pick([2, 3, 4]);
      const petals = k % 2 === 1 ? k : 2 * k;
      const key = `$\\dfrac{\\pi}{${4 * k}}$`;
      return {
        prompt: `Find the area of **one petal** of $r=\\cos(${k}\\theta)$.`,
        choices: [
          { t: key, ok: true },
          ...choose(key, [
            { t: `$\\dfrac{\\pi}{${2 * k}}$`, why: 'You integrated over twice the correct angular range, or dropped the $\\frac12$. One petal spans only from one zero of $\\cos(k\\theta)$ to the next.' },
            { t: `$\\dfrac{${petals}\\pi}{${4 * k}}$`, why: `That is the area of **all $${petals}$ petals** together. The question asks for one.` },
            { t: `$\\dfrac{\\pi}{4}$`, why: `You ignored the coefficient $${k}$. A larger $k$ makes each petal narrower, shrinking its area by a factor of $${k}$.` },
            { t: `$\\dfrac{\\pi}{${8 * k}}$`, why: 'An extra factor of $\\frac12$. The polar formula contributes one $\\frac12$, and the half-angle identity contributes another — that is $\\frac14$ total, already included.' },
            { t: `$\\dfrac{\\pi}{${k}}$`, why: 'That is the petal\'s angular **width** $\\frac{\\pi}{k}$, not its area.' },
          ]),
        ],
        steps: [
          `One petal is traced between consecutive zeros of $\\cos(${k}\\theta)$: from $\\theta=-\\frac{\\pi}{${2 * k}}$ to $\\frac{\\pi}{${2 * k}}$.`,
          `$A=\\dfrac12\\displaystyle\\int_{-\\pi/${2 * k}}^{\\pi/${2 * k}}\\cos^{2}(${k}\\theta)\\,d\\theta$`,
          `Half-angle: $\\cos^{2}(${k}\\theta)=\\dfrac{1+\\cos(${2 * k}\\theta)}{2}$; the cosine term integrates to $0$ over this symmetric range.`,
          `$A=\\dfrac14\\cdot\\dfrac{\\pi}{${k}} = \\dfrac{\\pi}{${4 * k}}$`,
        ],
        recall: 'Find the petal\'s $\\theta$-limits from where $r=0$. Integrating over the wrong range is the usual error here.',
        viz: {
          kind: 'polar', r: t => Math.cos(k * t), t0: -Math.PI / (2 * k), t1: Math.PI / (2 * k),
          tag: `one petal of r = cos(${k}θ)`,
          cap: `The shaded region is a single petal, swept as $\\theta$ goes from $-\\frac{\\pi}{${2 * k}}$ to $\\frac{\\pi}{${2 * k}}$.`,
        },
      };
    }
    const a = r.pick([1, 2, 3]);
    const num = 3 * a * a;
    return {
      prompt: `Find the area enclosed by the cardioid $r=${a === 1 ? '' : a}(1+\\cos\\theta)$.`,
      choices: [
        { t: `$\\dfrac{${num}\\pi}{2}$`, ok: true },
        { t: `$${num}\\pi$`, why: 'You dropped the $\\frac12$ from the polar area formula $A=\\frac12\\int r^{2}d\\theta$.' },
        { t: `$${a * a}\\pi$`, why: `You expanded $(1+\\cos\\theta)^{2}$ as $1+\\cos^{2}\\theta$, losing the middle term $2\\cos\\theta$. (That term integrates to $0$, but $\\cos^{2}$ contributes $\\pi$ — the total is $3\\pi$, not $2\\pi$.)` },
        { t: `$\\dfrac{${a * a}\\pi}{2}$`, why: 'You squared only the constant. All three terms of $(1+\\cos\\theta)^{2}$ must be integrated.' },
      ],
      steps: [
        `$A=\\dfrac12\\displaystyle\\int_0^{2\\pi}${a === 1 ? '' : a * a}(1+\\cos\\theta)^{2}d\\theta$`,
        `Expand: $(1+\\cos\\theta)^{2}=1+2\\cos\\theta+\\cos^{2}\\theta$.`,
        `Over $[0,2\\pi]$: $\\int 1 = 2\\pi$, $\\int 2\\cos\\theta = 0$, $\\int\\cos^{2}\\theta = \\pi$.`,
        `$A=\\dfrac{${a * a}}{2}\\left(2\\pi+0+\\pi\\right) = \\dfrac{${num}\\pi}{2}$`,
      ],
      recall: 'Expand the square **before** integrating, and remember $\\int_0^{2\\pi}\\cos^{2}\\theta\\,d\\theta = \\pi$ (average value $\\frac12$).',
      viz: {
        kind: 'polar', r: t => a * (1 + Math.cos(t)), t0: 0, t1: Math.PI * 2,
        tag: `r = ${a === 1 ? '' : a}(1 + cos θ)`,
        cap: 'The heart shape closes at the origin when $\\theta=\\pi$. The full sweep needs $\\theta\\in[0,2\\pi]$.',
      },
    };
  },
});

G.push({
  id: 'g-p-convert', topic: 'Polar Coordinates', diff: 1,
  make(r) {
    const opts = [
      { rr: 2, th: '\\frac{\\pi}{3}', x: '1', y: '\\sqrt{3}', xv: 1, yv: Math.sqrt(3) },
      { rr: 4, th: '\\frac{\\pi}{6}', x: '2\\sqrt{3}', y: '2', xv: 2 * Math.sqrt(3), yv: 2 },
      { rr: 2, th: '\\frac{3\\pi}{4}', x: '-\\sqrt{2}', y: '\\sqrt{2}', xv: -Math.SQRT2, yv: Math.SQRT2 },
      { rr: 6, th: '\\frac{\\pi}{2}', x: '0', y: '6', xv: 0, yv: 6 },
    ];
    const o = r.pick(opts);
    return {
      prompt: `Convert the polar point $\\left(${o.rr},\\,${o.th}\\right)$ to rectangular coordinates.`,
      choices: [
        { t: `$\\left(${o.x},\\,${o.y}\\right)$`, ok: true },
        { t: `$\\left(${o.y},\\,${o.x}\\right)$`, why: 'Coordinates swapped. $x=r\\cos\\theta$ comes first — cosine goes with $x$.' },
        { t: `$\\left(${o.rr},\\,${o.th}\\right)$`, why: 'Unchanged. You need to actually evaluate $r\\cos\\theta$ and $r\\sin\\theta$.' },
        { t: `$\\left(${o.rr}\\cos\\left(${o.th}\\right)+${o.rr}\\sin\\left(${o.th}\\right),\\,0\\right)$`, why: 'The two components are separate: $x$ uses only cosine, $y$ only sine. They are never added together.' },
      ],
      steps: [
        `$x=r\\cos\\theta = ${o.rr}\\cos\\left(${o.th}\\right) = ${o.x}$`,
        `$y=r\\sin\\theta = ${o.rr}\\sin\\left(${o.th}\\right) = ${o.y}$`,
        `Point: $\\left(${o.x},\\,${o.y}\\right)$`,
        `Check: $x^{2}+y^{2}$ should equal $r^{2}=${o.rr * o.rr}$. ✓`,
      ],
      recall: '$x=r\\cos\\theta$, $y=r\\sin\\theta$. Going back: $r^{2}=x^{2}+y^{2}$ and $\\tan\\theta=\\frac yx$ (mind the quadrant).',
    };
  },
});

G.push({
  id: 'g-p-arclen-setup', topic: 'Parametric Curves', diff: 2,
  make(r) {
    const m = r.int(2, 3), n = m + 1;
    const b = r.int(1, 3);
    return {
      prompt: `Set up the arc length of $x=t^{${m}}$, $y=t^{${n}}$ for $0\\le t\\le ${b}$.`,
      choices: [
        { t: `$\\displaystyle\\int_{0}^{${b}}\\sqrt{${m * m}t^{${2 * (m - 1)}}+${n * n}t^{${2 * (n - 1)}}}\\,dt$`, ok: true },
        { t: `$\\displaystyle\\int_{0}^{${b}}\\sqrt{t^{${2 * m}}+t^{${2 * n}}}\\,dt$`, why: 'You squared $x$ and $y$ themselves instead of their **derivatives**. Arc length uses velocities.' },
        { t: `$\\displaystyle\\int_{0}^{${b}}\\left(${m}t^{${m - 1}}+${n}t^{${n - 1}}\\right)dt$`, why: 'You added the derivatives instead of taking the square root of the sum of squares.' },
        { t: `$\\displaystyle\\int_{0}^{${b}}\\sqrt{1+${n * n}t^{${2 * (n - 1)}}}\\,dt$`, why: `That is the **Cartesian** formula. In parametric form the $1$ is replaced by $\\left(\\frac{dx}{dt}\\right)^{2}=${m * m}t^{${2 * (m - 1)}}$.` },
      ],
      steps: [
        `$\\dfrac{dx}{dt}=${m}t^{${m - 1}}$ so $\\left(\\dfrac{dx}{dt}\\right)^{2}=${m * m}t^{${2 * (m - 1)}}$`,
        `$\\dfrac{dy}{dt}=${n}t^{${n - 1}}$ so $\\left(\\dfrac{dy}{dt}\\right)^{2}=${n * n}t^{${2 * (n - 1)}}$`,
        `$L=\\displaystyle\\int_0^{${b}}\\sqrt{\\left(\\frac{dx}{dt}\\right)^{2}+\\left(\\frac{dy}{dt}\\right)^{2}}\\,dt$`,
        `$=\\displaystyle\\int_{0}^{${b}}\\sqrt{${m * m}t^{${2 * (m - 1)}}+${n * n}t^{${2 * (n - 1)}}}\\,dt$`,
      ],
      recall: 'Differentiate, square, add, root. The Cartesian "1" is really $\\left(\\frac{dx}{dx}\\right)^{2}$ — in parametric form it becomes $\\left(\\frac{dx}{dt}\\right)^{2}$.',
    };
  },
});

G.push({
  id: 'g-p-petals', topic: 'Polar Coordinates', diff: 2,
  make(r) {
    const k = r.int(2, 7);
    const fn = r.pick(['\\cos', '\\sin']);
    const petals = k % 2 === 1 ? k : 2 * k;
    const other = k % 2 === 1 ? 2 * k : k;
    // build distractors that cannot collide with the answer (k=2 makes 2k and k² both 4)
    const pool = [
      { v: other, why: k % 2 === 1
        ? `You used the even rule. Since $${k}$ is **odd**, the curve retraces itself on the second lap, so there are only $${k}$ petals — not $2k$.`
        : `You used the odd rule. Since $${k}$ is **even**, the second lap traces $${k}$ **new** petals, giving $2\\cdot${k}=${petals}$.` },
      { v: k * k, why: 'The count is linear in $k$, never quadratic.' },
      { v: k + 1, why: `Off by one. The rule uses $k$ or $2k$ exactly — it never adds.` },
      { v: 1, why: `That is the petal count for $k=1$ (which traces a single circular loop). The coefficient $${k}$ makes the curve cycle $${k}$ times as fast.` },
      { v: 2 * k + 2, why: 'Neither $k$ nor $2k$. Check the parity rule and apply it once.' },
    ];
    const picked = [];
    for (const d of pool) {
      if (d.v === petals || picked.some(x => x.v === d.v)) continue;
      picked.push(d);
      if (picked.length === 3) break;
    }
    return {
      prompt: `How many petals does $r=${fn}(${k}\\theta)$ have?`,
      choices: [
        { t: `$${petals}$`, ok: true },
        ...picked.map(d => ({ t: `$${d.v}$`, why: d.why })),
      ],
      steps: [
        `Rule: $r=a${fn}(k\\theta)$ has $k$ petals when $k$ is odd, and $2k$ petals when $k$ is even.`,
        `Here $k=${k}$, which is **${k % 2 === 1 ? 'odd' : 'even'}**.`,
        `Petals $= ${petals}$.`,
        `Why: for odd $k$, $\\theta\\in[\\pi,2\\pi]$ retraces the petals from $[0,\\pi]$; for even $k$ it produces brand-new ones.`,
      ],
      recall: 'Odd $k$ → $k$ petals. Even $k$ → $2k$ petals. Counting off a sketch is a good check.',
      viz: {
        kind: 'polar', r: t => (fn === '\\cos' ? Math.cos(k * t) : Math.sin(k * t)), t0: 0, t1: Math.PI * 2,
        shade: false, tag: `r = ${fn === '\\cos' ? 'cos' : 'sin'}(${k}θ)`,
        cap: `Count the loops: $${petals}$.`,
      },
    };
  },
});

// =================================================================
// DEEPENING — conversion, curve facts, areas, slopes, parametric calculus
// =================================================================

P.push({
  id: 'p-rect-to-polar', topic: 'Polar Coordinates', diff: 2,
  prompt: 'Which polar equation describes the circle $x^{2}+(y-2)^{2}=4$?',
  choices: [
    { t: '$r=4\\sin\\theta$', ok: true },
    { t: '$r=2\\sin\\theta$', why: 'You used the radius. $r=a\\sin\\theta$ is a circle of **diameter** $a$, and this circle has diameter $4$.', err: 'formula-confusion' },
    { t: '$r=4\\cos\\theta$', why: '$r=a\\cos\\theta$ sits on the $x$-axis. This circle is centred on the $y$-axis at $(0,2)$, so it needs sine.', err: 'formula-confusion' },
    { t: '$r=2$', why: 'That is a circle of radius $2$ centred at the **origin**. Expanding shows $x^{2}+y^{2}=4y$ — there is a $4y$ on the right.' },
  ],
  steps: [
    'Expand: $x^{2}+y^{2}-4y+4=4$, so $x^{2}+y^{2}=4y$.',
    'Substitute $x^{2}+y^{2}=r^{2}$ and $y=r\\sin\\theta$: $r^{2}=4r\\sin\\theta$.',
    'Divide by $r$: $r=4\\sin\\theta$ (the origin is still on the curve at $\\theta=0$).',
  ],
  recall: 'Circle through the origin with diameter $a$: $r=a\\cos\\theta$ (centre on the $x$-axis) or $r=a\\sin\\theta$ (centre on the $y$-axis).',
});

P.push({
  id: 'p-limacon-loop', topic: 'Polar Coordinates', diff: 2,
  prompt: 'The graph of $r=1+2\\cos\\theta$ is:',
  choices: [
    { t: 'a limaçon with an inner loop', ok: true },
    { t: 'a cardioid', why: 'A cardioid needs $a=b$ in $r=a+b\\cos\\theta$. Here $a=1<b=2$, so $r$ goes negative and a small inner loop appears.' },
    { t: 'a circle', why: 'A circle is $r=a\\cos\\theta$ or $r=a$ — there is no constant term added to a multiple of cosine.' },
    { t: 'a two-petal rose', why: 'Roses are $r=a\\cos(k\\theta)$ with the angle multiplied. Here the angle is plain $\\theta$ and there is an added constant.' },
  ],
  steps: [
    'Write it as $r=a+b\\cos\\theta$ with $a=1$, $b=2$.',
    'Compare: $a=b$ cardioid; $a<b$ inner loop; $b<a<2b$ dimpled; $a\\ge2b$ convex.',
    '$1<2$, so $r$ becomes negative on $\\frac{2\\pi}{3}<\\theta<\\frac{4\\pi}{3}$ — that is the inner loop.',
  ],
  recall: 'Limaçon $r=a+b\\cos\\theta$: **$a<b$** inner loop, **$a=b$** cardioid, **$a>b$** no loop.',
  viz: { kind: 'polar', r: t => 1 + 2 * Math.cos(t), t0: 0, t1: Math.PI * 2, tag: 'r = 1 + 2cos θ', cap: 'The small loop inside the big one is traced while $r<0$.' },
});

P.push({
  id: 'p-polar-slope', topic: 'Polar Area & Arc Length', diff: 3,
  prompt: 'For $r=f(\\theta)$, the slope $\\dfrac{dy}{dx}$ is:',
  choices: [
    { t: '$\\dfrac{r\'\\sin\\theta+r\\cos\\theta}{r\'\\cos\\theta-r\\sin\\theta}$', ok: true },
    { t: '$\\dfrac{r\'}{r}$', why: 'That is not a slope. Polar slope comes from $x=r\\cos\\theta$, $y=r\\sin\\theta$ with the product rule on each.', err: 'formula-confusion' },
    { t: '$\\dfrac{r\'\\cos\\theta+r\\sin\\theta}{r\'\\sin\\theta-r\\cos\\theta}$', why: 'Signs and sines/cosines are scrambled. $y\'=r\'\\sin\\theta+r\\cos\\theta$ on top; $x\'=r\'\\cos\\theta-r\\sin\\theta$ on the bottom.', err: 'sign' },
    { t: '$\\dfrac{r\'\\cos\\theta-r\\sin\\theta}{r\'\\sin\\theta+r\\cos\\theta}$', why: 'Upside down: that is $\\frac{dx}{dy}$. Slope is $\\frac{dy/d\\theta}{dx/d\\theta}$.', err: 'inverted' },
  ],
  steps: [
    '$x=r\\cos\\theta$, $y=r\\sin\\theta$ with $r=f(\\theta)$.',
    '$\\dfrac{dy}{d\\theta}=r\'\\sin\\theta+r\\cos\\theta$, $\\dfrac{dx}{d\\theta}=r\'\\cos\\theta-r\\sin\\theta$ (product rule).',
    '$\\dfrac{dy}{dx}=\\dfrac{dy/d\\theta}{dx/d\\theta}$.',
  ],
  recall: 'Polar slope is just parametric slope with parameter $\\theta$. Horizontal tangent: numerator $0$; vertical: denominator $0$.',
});

P.push({
  id: 'p-innerloop-area', topic: 'Polar Area & Arc Length', diff: 4,
  prompt: 'Find the area of the **inner loop** of $r=1+2\\cos\\theta$.',
  choices: [
    { t: '$\\pi-\\dfrac{3\\sqrt3}{2}$', ok: true },
    { t: '$3\\pi$', why: 'That is $\\frac12\\int_0^{2\\pi}r^{2}d\\theta$ over the whole curve, which adds the inner loop to the outer region. The inner loop is only $\\frac{2\\pi}{3}\\le\\theta\\le\\frac{4\\pi}{3}$.' },
    { t: '$\\pi+\\dfrac{3\\sqrt3}{2}$', why: 'Sign slip when evaluating $\\sin\\frac{4\\pi}{3}-\\sin\\frac{2\\pi}{3}=-\\sqrt3$. Check the sign of each sine value.', err: 'sign' },
    { t: '$2\\pi-3\\sqrt3$', why: 'Exactly double the answer — the $\\frac12$ in $A=\\frac12\\int r^{2}d\\theta$ was dropped.' },
  ],
  steps: [
    'The inner loop is traced while $r<0$: $1+2\\cos\\theta<0$ for $\\theta\\in\\left(\\frac{2\\pi}{3},\\frac{4\\pi}{3}\\right)$.',
    '$A=\\dfrac12\\displaystyle\\int_{2\\pi/3}^{4\\pi/3}(1+2\\cos\\theta)^{2}d\\theta=\\dfrac12\\int(1+4\\cos\\theta+2+2\\cos2\\theta)\\,d\\theta$.',
    '$=\\dfrac12\\left[3\\theta+4\\sin\\theta+\\sin2\\theta\\right]_{2\\pi/3}^{4\\pi/3}$.',
    '$=\\dfrac12\\left(2\\pi-4\\sqrt3+\\left(\\tfrac{\\sqrt3}{2}+\\tfrac{\\sqrt3}{2}\\right)\\right)=\\pi-\\dfrac{3\\sqrt3}{2}$.',
  ],
  recall: 'Inner loop: set $r=0$ for the limits, then integrate $\\frac12r^{2}$ only between those two angles.',
  viz: { kind: 'polar', r: t => 1 + 2 * Math.cos(t), t0: 2 * Math.PI / 3, t1: 4 * Math.PI / 3, tag: 'inner loop of r = 1 + 2cos θ', cap: 'Only the small loop is swept between the two zeros of $r$.' },
});

P.push({
  id: 'p-area-between', topic: 'Polar Area & Arc Length', diff: 4,
  prompt: 'Find the area inside $r=3\\sin\\theta$ and outside $r=1+\\sin\\theta$.',
  choices: [
    { t: '$\\pi$', ok: true },
    { t: '$\\dfrac{9\\pi}{4}$', why: 'That is the whole circle $r=3\\sin\\theta$ (radius $\\frac32$). You must remove the part inside the limaçon.' },
    { t: '$\\pi-\\dfrac{3\\sqrt3}{2}$', why: 'You squared the difference $(r_1-r_2)^{2}$. The correct integrand is the difference of squares $r_1^{2}-r_2^{2}$.', err: 'setup' },
    { t: '$-\\pi$', why: 'Outer and inner are swapped. On $\\frac{\\pi}{6}\\le\\theta\\le\\frac{5\\pi}{6}$ the circle is farther out, so it comes first.' },
  ],
  steps: [
    'Intersect: $3\\sin\\theta=1+\\sin\\theta\\Rightarrow\\sin\\theta=\\frac12$, so $\\theta=\\frac{\\pi}{6},\\frac{5\\pi}{6}$.',
    'On that interval the circle is outside: $A=\\dfrac12\\displaystyle\\int_{\\pi/6}^{5\\pi/6}\\left(9\\sin^{2}\\theta-(1+\\sin\\theta)^{2}\\right)d\\theta$.',
    'Integrand: $8\\sin^{2}\\theta-2\\sin\\theta-1=3-4\\cos2\\theta-2\\sin\\theta$.',
    '$A=\\dfrac12\\left[3\\theta-2\\sin2\\theta+2\\cos\\theta\\right]_{\\pi/6}^{5\\pi/6}=\\dfrac12(2\\pi)=\\pi$.',
  ],
  recall: 'Between curves: $\\frac12\\int(r_{\\text{out}}^{2}-r_{\\text{in}}^{2})\\,d\\theta$ — subtract the **squares**, with limits from where they cross.',
});

P.push({
  id: 'p-polar-arc-cardioid', topic: 'Polar Area & Arc Length', diff: 3,
  prompt: 'Find the total length of the cardioid $r=1+\\cos\\theta$.',
  choices: [
    { t: '$8$', ok: true },
    { t: '$4$', why: 'That is the half-curve $0\\le\\theta\\le\\pi$. The cardioid closes at $\\theta=2\\pi$; double by symmetry.' },
    { t: '$\\dfrac{3\\pi}{2}$', why: 'That is the **area** $\\frac12\\int r^{2}d\\theta$. Length uses $\\sqrt{r^{2}+r\'^{2}}$.', err: 'formula-confusion' },
    { t: '$4\\pi$', why: 'Check the algebra: $r^{2}+r\'^{2}=2+2\\cos\\theta=4\\cos^{2}\\frac\\theta2$, whose root is $2\\cos\\frac\\theta2$ — no $\\pi$ appears.' },
  ],
  steps: [
    '$r^{2}+(r\')^{2}=(1+\\cos\\theta)^{2}+\\sin^{2}\\theta=2+2\\cos\\theta=4\\cos^{2}\\frac{\\theta}{2}$.',
    '$L=2\\displaystyle\\int_0^{\\pi}2\\cos\\frac{\\theta}{2}\\,d\\theta$ (use symmetry so $\\cos\\frac\\theta2\\ge0$).',
    '$=4\\left[2\\sin\\frac{\\theta}{2}\\right]_0^{\\pi}=8$.',
  ],
  recall: 'Cardioid arc length: the radicand collapses to a perfect square via $1+\\cos\\theta=2\\cos^{2}\\frac\\theta2$. $L=8a$ for $r=a(1+\\cos\\theta)$.',
});

P.push({
  id: 'p-param-d2', topic: 'Parametric Calculus', diff: 3,
  prompt: 'For $x=t^{2}$, $y=t^{3}$ (with $t>0$), find $\\dfrac{d^{2}y}{dx^{2}}$.',
  choices: [
    { t: '$\\dfrac{3}{4t}$', ok: true },
    { t: '$\\dfrac{3}{2}$', why: 'That is $\\frac{d}{dt}\\left(\\frac{dy}{dx}\\right)$. The second derivative with respect to $x$ needs one more division by $\\frac{dx}{dt}$.', err: 'chain' },
    { t: '$3t$', why: 'You computed $\\frac{y\'\'(t)}{x\'\'(t)}=\\frac{6t}{2}$. That is not $\\frac{d^{2}y}{dx^{2}}$ — differentiate the **slope**, then divide by $x\'(t)$.', err: 'formula-confusion' },
    { t: '$\\dfrac{3t}{2}$', why: 'That is the first derivative $\\frac{dy}{dx}=\\frac{3t^{2}}{2t}$, not the second.' },
  ],
  steps: [
    '$\\dfrac{dy}{dx}=\\dfrac{3t^{2}}{2t}=\\dfrac{3t}{2}$.',
    'Differentiate that **in $t$**: $\\dfrac{d}{dt}\\left(\\dfrac{3t}{2}\\right)=\\dfrac32$.',
    'Divide by $\\dfrac{dx}{dt}=2t$: $\\dfrac{d^{2}y}{dx^{2}}=\\dfrac{3/2}{2t}=\\dfrac{3}{4t}$.',
  ],
  recall: '$\\dfrac{d^{2}y}{dx^{2}}=\\dfrac{\\frac{d}{dt}\\left(\\frac{dy}{dx}\\right)}{dx/dt}$. Differentiate the slope in $t$, then divide by $x\'(t)$.',
});

P.push({
  id: 'p-param-vertical', topic: 'Parametric Calculus', diff: 3,
  prompt: 'For $x=t^{3}-3t$, $y=t^{2}$, at which $t$ does the curve have a **vertical** tangent?',
  choices: [
    { t: '$t=\\pm1$', ok: true },
    { t: '$t=0$', why: 'At $t=0$: $\\frac{dy}{dt}=0$ and $\\frac{dx}{dt}=-3\\ne0$, so the tangent is **horizontal**, not vertical.', err: 'horiz-vert' },
    { t: '$t=\\pm\\sqrt3$', why: 'Those are the zeros of $x=t(t^{2}-3)$. Vertical tangents come from $\\frac{dx}{dt}=0$, not $x=0$.', err: 'setup' },
    { t: '$t=1$ only', why: '$\\frac{dx}{dt}=3t^{2}-3=0$ at both $t=1$ and $t=-1$, and $\\frac{dy}{dt}=2t\\ne0$ at each.' },
  ],
  steps: [
    '$\\dfrac{dx}{dt}=3t^{2}-3=3(t-1)(t+1)$, zero at $t=\\pm1$.',
    '$\\dfrac{dy}{dt}=2t$, which is $\\pm2\\ne0$ there, so the slope is infinite.',
    'Vertical tangents at $t=\\pm1$.',
  ],
  recall: 'Vertical: $\\frac{dx}{dt}=0$ with $\\frac{dy}{dt}\\ne0$. Horizontal: $\\frac{dy}{dt}=0$ with $\\frac{dx}{dt}\\ne0$.',
});

P.push({
  id: 'p-param-area', topic: 'Parametric Calculus', diff: 3,
  prompt: 'Find the area under the curve $x=t^{2}$, $y=t^{3}$ for $0\\le t\\le2$.',
  choices: [
    { t: '$\\dfrac{64}{5}$', ok: true },
    { t: '$4$', why: 'You integrated $\\int y\\,dt$. Area is $\\int y\\,dx=\\int y\\,\\frac{dx}{dt}\\,dt$, so the factor $2t$ is needed.' },
    { t: '$\\dfrac{32}{5}$', why: 'You dropped the $2$ from $\\frac{dx}{dt}=2t$.' },
    { t: '$\\dfrac{128}{5}$', why: 'The factor $2$ from $\\frac{dx}{dt}=2t$ is used once, not twice.' },
  ],
  steps: [
    '$A=\\displaystyle\\int y\\,dx=\\int_0^{2}y(t)\\,x\'(t)\\,dt$.',
    '$=\\displaystyle\\int_0^{2}t^{3}\\cdot2t\\,dt=\\int_0^{2}2t^{4}dt$.',
    '$=\\dfrac{2t^{5}}{5}\\Big|_0^{2}=\\dfrac{64}{5}$.',
  ],
  recall: 'Parametric area: $\\int y\\,dx\\to\\int y(t)\\,x\'(t)\\,dt$, with the **$t$-limits**.',
});

// ---- generators -------------------------------------------------------
const cf = v => (v === 1 ? '' : v);
const gcd2 = (a, b) => (b ? gcd2(b, a % b) : Math.abs(a));
/** (n/d)·t^p as TeX, reduced; p may be negative. */
const mono = (n, d, p) => {
  const g = gcd2(n, d); n /= g; d /= g;
  const ap = Math.abs(p), tp = ap === 0 ? '' : ap === 1 ? 't' : `t^{${ap}}`;
  if (p >= 0) {
    const num = tp ? (n === 1 ? tp : `${n}${tp}`) : `${n}`;
    return d === 1 ? num : `\\dfrac{${num}}{${d}}`;
  }
  return `\\dfrac{${n}}{${d === 1 ? '' : d}${tp}}`;
};

G.push({
  id: 'g-p-rect2polar', topic: 'Polar Coordinates', diff: 2,
  make(r) {
    const a = r.int(2, 5);
    const kind = r.pick(['origin', 'line', 'cirY', 'cirX']);
    let prompt, key, pool, steps;
    if (kind === 'origin') {
      prompt = `Write $x^{2}+y^{2}=${a * a}$ in polar form.`;
      key = `$r=${a}$`;
      pool = [
        { t: `$r=${a * a}$`, why: `$r^{2}=${a * a}$, so $r=\\sqrt{${a * a}}=${a}$. You forgot the square root.` },
        { t: `$r=${a}\\cos\\theta$`, why: 'That circle passes through the origin. This one is centred **at** the origin, so $r$ is constant.' },
        { t: `$r=${2 * a}$`, why: `The radius is $\\sqrt{${a * a}}=${a}$; ${2 * a} would be the diameter.` },
        { t: `$\\theta=${a}$`, why: 'That is a ray, not a circle. A circle about the origin has fixed $r$.' },
      ];
      steps = [`Substitute $x^{2}+y^{2}=r^{2}$: $r^{2}=${a * a}$.`, `$r=${a}$.`];
    } else if (kind === 'line') {
      prompt = `Write the line $y=${a}$ in polar form.`;
      key = `$r=${a}\\csc\\theta$`;
      pool = [
        { t: `$r=${a}\\sec\\theta$`, why: `That is $x=${a}$ (since $r\\cos\\theta=${a}$). Horizontal lines use $y=r\\sin\\theta$.` },
        { t: `$r=${a}\\sin\\theta$`, why: `That is a circle. From $r\\sin\\theta=${a}$ you must **divide** by $\\sin\\theta$, not multiply.` },
        { t: `$r=${a}\\cos\\theta$`, why: 'That is a circle through the origin, and uses the wrong function for a horizontal line.' },
        { t: `$\\theta=${a}$`, why: `That is a line through the origin at angle $${a}$ radians, not the horizontal line.` },
      ];
      steps = [`$y=r\\sin\\theta=${a}$.`, `Solve for $r$: $r=\\dfrac{${a}}{\\sin\\theta}=${a}\\csc\\theta$.`];
    } else if (kind === 'cirY') {
      prompt = `Write $x^{2}+y^{2}=${2 * a}y$ in polar form.`;
      key = `$r=${2 * a}\\sin\\theta$`;
      pool = [
        { t: `$r=${a}\\sin\\theta$`, why: `$r^{2}=${2 * a}r\\sin\\theta$ gives $r=${2 * a}\\sin\\theta$ — you halved the coefficient.` },
        { t: `$r=${2 * a}\\cos\\theta$`, why: 'The right side has $y$, which is $r\\sin\\theta$. Cosine goes with $x$.' },
        { t: `$r=${2 * a}$`, why: `$x^{2}+y^{2}=r^{2}$ equals $${2 * a}y=${2 * a}r\\sin\\theta$, not a constant.` },
        { t: `$r=${4 * a * a}\\sin\\theta$`, why: 'You squared the coefficient. Only $r^{2}$ is replaced; $2ay$ becomes $2ar\\sin\\theta$.' },
      ];
      steps = [`$r^{2}=${2 * a}\\,r\\sin\\theta$.`, `Divide by $r$: $r=${2 * a}\\sin\\theta$.`];
    } else {
      prompt = `Write $x^{2}+y^{2}=${2 * a}x$ in polar form.`;
      key = `$r=${2 * a}\\cos\\theta$`;
      pool = [
        { t: `$r=${a}\\cos\\theta$`, why: `$r^{2}=${2 * a}r\\cos\\theta$ gives $r=${2 * a}\\cos\\theta$ — you halved the coefficient.` },
        { t: `$r=${2 * a}\\sin\\theta$`, why: 'The right side has $x$, which is $r\\cos\\theta$. Sine goes with $y$.' },
        { t: `$r=${2 * a}$`, why: `The right side is $${2 * a}x=${2 * a}r\\cos\\theta$, not a constant.` },
        { t: `$r=${4 * a * a}\\cos\\theta$`, why: 'You squared the coefficient. Only $r^{2}$ is replaced; $2ax$ becomes $2ar\\cos\\theta$.' },
      ];
      steps = [`$r^{2}=${2 * a}\\,r\\cos\\theta$.`, `Divide by $r$: $r=${2 * a}\\cos\\theta$.`];
    }
    return {
      prompt,
      choices: [{ t: key, ok: true }, ...choose(key, pool)],
      steps,
      recall: '$x=r\\cos\\theta$, $y=r\\sin\\theta$, $x^{2}+y^{2}=r^{2}$. Replace, then divide out a common $r$.',
    };
  },
});

G.push({
  id: 'g-p-curvefacts', topic: 'Polar Coordinates', diff: 2,
  make(r) {
    const [a, b] = r.pick([[2, 2], [3, 3], [4, 4], [1, 2], [1, 3], [2, 3], [2, 4], [3, 2], [4, 3], [5, 3], [4, 2], [6, 3], [5, 2]]);
    const fn = r.pick(['\\cos', '\\sin']);
    const types = {
      card: 'a cardioid', loop: 'a limaçon with an inner loop',
      dimple: 'a dimpled limaçon (no inner loop)', convex: 'a convex limaçon (no dimple, no loop)',
    };
    const k = a === b ? 'card' : a < b ? 'loop' : a < 2 * b ? 'dimple' : 'convex';
    const why = {
      card: `$a=b$ gives the cusp at the origin — a cardioid.`,
      loop: `$a<b$ lets $r$ go negative, which draws an inner loop.`,
      dimple: `$b<a<2b$: $r$ stays positive, but the curve is dented on one side.`,
      convex: `$a\\ge2b$ keeps the curve convex — no dent at all.`,
    };
    return {
      prompt: `Classify $r=${a}+${b}${fn}\\theta$.`,
      choices: Object.keys(types).map(t => (t === k
        ? { t: types[t], ok: true }
        : { t: types[t], why: `Compare $a=${a}$ with $b=${b}$. ${why[k]} That is not what ${types[t]} needs.` })),
      steps: [
        `Match $r=a+b${fn}\\theta$: $a=${a}$, $b=${b}$.`,
        `Rule: $a=b$ cardioid; $a<b$ inner loop; $b<a<2b$ dimple; $a\\ge2b$ convex.`,
        `$a=${a}$ vs $b=${b}$: ${why[k]}`,
      ],
      recall: 'Compare the constant $a$ with the coefficient $b$: equal → cardioid, smaller → inner loop, larger → no loop.',
    };
  },
});

G.push({
  id: 'g-p-polarslope', topic: 'Polar Area & Arc Length', diff: 3,
  make(r) {
    const a = r.int(1, 3), b = r.int(1, 4);
    const key = `$${frac(b, a)}$`;
    return {
      prompt: `Find the slope $\\dfrac{dy}{dx}$ of $r=${a}+${b}\\cos\\theta$ at $\\theta=\\dfrac{\\pi}{2}$.`,
      choices: [
        { t: key, ok: true },
        ...choose(key, [
          { t: `$${frac(a, b)}$`, why: 'Inverted. The numerator is $\\frac{dy}{d\\theta}$ and the denominator $\\frac{dx}{d\\theta}$.', err: 'inverted' },
          { t: `$${frac(-b, a)}$`, why: 'Sign error: both $-b$ (numerator) and $-a$ (denominator) are negative, so the signs cancel.', err: 'sign' },
          { t: `$${frac(-a, b)}$`, why: 'Inverted and wrong sign. Recompute $\\frac{dy}{d\\theta}$ and $\\frac{dx}{d\\theta}$ at $\\theta=\\frac\\pi2$.', err: 'sign' },
          { t: '$0$', why: 'Slope $0$ needs $\\frac{dy}{d\\theta}=0$. Here $r\'\\sin\\theta=-' + b + '\\ne0$.' },
          { t: '$\\text{DNE}$', why: 'Undefined needs $\\frac{dx}{d\\theta}=0$. Here $-r\\sin\\theta=-' + a + '\\ne0$.' },
        ]),
      ],
      steps: [
        `At $\\theta=\\frac\\pi2$: $r=${a}$ and $r\'=-${b}\\sin\\theta=-${b}$.`,
        `$\\dfrac{dy}{d\\theta}=r\'\\sin\\theta+r\\cos\\theta=-${b}(1)+${a}(0)=-${b}$.`,
        `$\\dfrac{dx}{d\\theta}=r\'\\cos\\theta-r\\sin\\theta=-${b}(0)-${a}(1)=-${a}$.`,
        `Slope $=\\dfrac{-${b}}{-${a}}=${frac(b, a)}$.`,
      ],
      recall: 'Polar slope: $\\frac{r\'\\sin\\theta+r\\cos\\theta}{r\'\\cos\\theta-r\\sin\\theta}$. At $\\theta=\\frac\\pi2$ the $\\cos$ terms vanish and it reduces to $\\frac{r\'}{-r}$.',
    };
  },
});

G.push({
  id: 'g-p-param-elim', topic: 'Parametric Curves', diff: 2,
  make(r) {
    const kind = r.pick(['ellipse', 'parab', 'power']);
    if (kind === 'ellipse') {
      const [a, b] = r.pick([[2, 3], [3, 4], [2, 5], [4, 5], [3, 5], [4, 3]]);
      const key = `$\\dfrac{x^{2}}{${a * a}}+\\dfrac{y^{2}}{${b * b}}=1$`;
      return {
        prompt: `Eliminate the parameter: $x=${a}\\cos t$, $y=${b}\\sin t$.`,
        choices: [
          { t: key, ok: true },
          ...choose(key, [
            { t: `$\\dfrac{x^{2}}{${b * b}}+\\dfrac{y^{2}}{${a * a}}=1$`, why: 'Denominators swapped. $x$ ranges over $\\pm' + a + '$ so $x^{2}$ gets ' + a * a + '.' },
            { t: `$\\dfrac{x^{2}}{${a}}+\\dfrac{y^{2}}{${b}}=1$`, why: 'The denominators must be squared: $\\frac{x}{' + a + '}=\\cos t$, so $\\frac{x^{2}}{' + a * a + '}=\\cos^{2}t$.' },
            { t: `$x^{2}+y^{2}=${a * a + b * b}$`, why: 'That treats it as a circle. The two amplitudes differ, so $\\cos^{2}t+\\sin^{2}t=1$ must be applied to $\\frac{x}{a}$ and $\\frac{y}{b}$ separately.' },
          ]),
        ],
        steps: [`$\\cos t=\\dfrac{x}{${a}}$, $\\sin t=\\dfrac{y}{${b}}$.`, `Use $\\cos^{2}t+\\sin^{2}t=1$.`, `$\\dfrac{x^{2}}{${a * a}}+\\dfrac{y^{2}}{${b * b}}=1$ — an ellipse.`],
        recall: 'Trig parametrization → isolate $\\cos t$ and $\\sin t$, square, add.',
      };
    }
    if (kind === 'parab') {
      const a = r.int(1, 4);
      const key = `$y=(x-${a})^{2}$`;
      return {
        prompt: `Eliminate the parameter: $x=t+${a}$, $y=t^{2}$.`,
        choices: [
          { t: key, ok: true },
          ...choose(key, [
            { t: `$y=(x+${a})^{2}$`, why: `Solve for $t$ carefully: $t=x-${a}$, not $x+${a}$.`, err: 'sign' },
            { t: `$y=x^{2}-${a}$`, why: `Substitute $t=x-${a}$ **inside** the square; you cannot subtract after squaring.` },
            { t: `$y=x^{2}+${a * a}$`, why: `$t=x-${a}$, so $t^{2}=(x-${a})^{2}$ — not $x^{2}$ plus a constant.` },
          ]),
        ],
        steps: [`$t=x-${a}$.`, `Substitute: $y=t^{2}=(x-${a})^{2}$.`],
        recall: 'Solve the simpler equation for $t$, then substitute into the other.',
      };
    }
    const k = r.int(2, 3);
    const key = `$y=x^{${k}}$`;
    return {
      prompt: `Eliminate the parameter: $x=e^{t}$, $y=e^{${k}t}$.`,
      choices: [
        { t: key, ok: true },
        ...choose(key, [
          { t: `$y=${k}x$`, why: `$e^{${k}t}=(e^{t})^{${k}}$ is a **power** of $x$, not a multiple.` },
          { t: `$y=x^{1/${k}}$`, why: `Exponent inverted: $y=e^{${k}t}=(e^{t})^{${k}}=x^{${k}}$.` },
          { t: `$y=e^{${k}x}$`, why: `$x=e^{t}$, so $e^{${k}t}$ is $x^{${k}}$; exponentials of $x$ do not appear.` },
        ]),
      ],
      steps: [`$e^{${k}t}=(e^{t})^{${k}}$.`, `Since $x=e^{t}$: $y=x^{${k}}$ (for $x>0$).`],
      recall: 'Rewrite one coordinate using the other: $e^{kt}=(e^{t})^{k}$. Remember the domain restriction ($x>0$).',
    };
  },
});

G.push({
  id: 'g-p-param-d2', topic: 'Parametric Calculus', diff: 3,
  make(r) {
    const m = r.int(3, 6);
    const key = `$${mono(m * (m - 2), 4, m - 4)}$`;
    return {
      prompt: `For $x=t^{2}$, $y=t^{${m}}$ with $t>0$, find $\\dfrac{d^{2}y}{dx^{2}}$.`,
      choices: [
        { t: key, ok: true },
        ...choose(key, [
          { t: `$${mono(m * (m - 2), 2, m - 3)}$`, why: 'That is only $\\frac{d}{dt}\\left(\\frac{dy}{dx}\\right)$. Divide once more by $\\frac{dx}{dt}=2t$.', err: 'chain' },
          { t: `$${mono(m * (m - 1), 2, m - 2)}$`, why: 'That is $\\frac{y\'\'(t)}{x\'\'(t)}$, which is not the second derivative of $y$ with respect to $x$.', err: 'formula-confusion' },
          { t: `$${mono(m, 2, m - 2)}$`, why: 'That is the **first** derivative $\\frac{dy}{dx}$. One more round is needed.' },
        ]),
      ],
      steps: [
        `$\\dfrac{dy}{dx}=\\dfrac{${m}t^{${m - 1}}}{2t}=${mono(m, 2, m - 2)}$.`,
        `$\\dfrac{d}{dt}\\left(\\dfrac{dy}{dx}\\right)=${mono(m * (m - 2), 2, m - 3)}$.`,
        `Divide by $\\dfrac{dx}{dt}=2t$: $\\dfrac{d^{2}y}{dx^{2}}=${mono(m * (m - 2), 4, m - 4)}$.`,
      ],
      recall: '$\\dfrac{d^{2}y}{dx^{2}}=\\dfrac{\\frac{d}{dt}(dy/dx)}{dx/dt}$ — differentiate the slope in $t$, then divide by $x\'(t)$.',
    };
  },
});

G.push({
  id: 'g-p-param-tangent', topic: 'Parametric Calculus', diff: 3,
  make(r) {
    const k = r.int(1, 4);
    const horiz = r.pick([true, false]);
    const key = `$t=\\pm${cf(k)}$`;
    const body = horiz ? `x=t^{2},\\ y=t^{3}-${3 * k * k}t` : `x=t^{3}-${3 * k * k}t,\\ y=t^{2}`;
    const zero = horiz
      ? { t: '$t=0$', why: 'There $\\frac{dx}{dt}=2t=0$ while $\\frac{dy}{dt}=' + (-3 * k * k) + '\\ne0$ — a **vertical** tangent.', err: 'horiz-vert' }
      : { t: '$t=0$', why: 'There $\\frac{dy}{dt}=0$ while $\\frac{dx}{dt}=' + (-3 * k * k) + '\\ne0$ — a **horizontal** tangent.', err: 'horiz-vert' };
    return {
      prompt: `For $${body}$, at which $t$ is the tangent **${horiz ? 'horizontal' : 'vertical'}**?`,
      choices: [
        { t: key, ok: true },
        ...choose(key, [
          zero,
          { t: `$t=0,\\ \\pm${cf(k)}$`, why: 'Exactly one of the derivatives vanishes at each good point. At $t=0$ the other one vanishes instead, so $t=0$ does not belong.' },
          { t: `$t=\\pm${3 * k}$`, why: `Solve $3t^{2}=${3 * k * k}$ properly: $t^{2}=${k * k}$, so $t=\\pm${k}$.` },
          { t: `$t=\\pm${cf(k)}\\sqrt3$`, why: `Divide $3t^{2}-${3 * k * k}=0$ through by $3$ first: $t^{2}=${k * k}$.` },
        ]),
      ],
      steps: horiz ? [
        `Horizontal needs $\\frac{dy}{dt}=0$ and $\\frac{dx}{dt}\\ne0$.`,
        `$\\dfrac{dy}{dt}=3t^{2}-${3 * k * k}=0\\Rightarrow t=\\pm${k}$.`,
        `Check $\\dfrac{dx}{dt}=2t=\\pm${2 * k}\\ne0$. ✓`,
      ] : [
        `Vertical needs $\\frac{dx}{dt}=0$ and $\\frac{dy}{dt}\\ne0$.`,
        `$\\dfrac{dx}{dt}=3t^{2}-${3 * k * k}=0\\Rightarrow t=\\pm${k}$.`,
        `Check $\\dfrac{dy}{dt}=2t=\\pm${2 * k}\\ne0$. ✓`,
      ],
      recall: 'Horizontal: $y\'(t)=0$. Vertical: $x\'(t)=0$. Always confirm the other derivative is nonzero.',
    };
  },
});

G.push({
  id: 'g-p-param-arclen-eval', topic: 'Parametric Calculus', diff: 4,
  make(r) {
    const c = r.int(1, 3), b = r.pick([3, 6]);
    const L = c * (b * b * b / 3 + b);
    const key = `$${L}$`;
    return {
      prompt: `Find the length of $x=${cf(c)}t^{2}$, $y=${cf(c)}\\left(\\dfrac{t^{3}}{3}-t\\right)$ for $0\\le t\\le${b}$.`,
      choices: [
        { t: key, ok: true },
        ...choose(key, [
          { t: `$${c * (b * b * b / 3 - b)}$`, why: 'Sign slip: $(t^{2}-1)^{2}+4t^{2}=(t^{2}+1)^{2}$, so the integrand is $t^{2}+1$, not $t^{2}-1$.', err: 'sign' },
          { t: `$${c * b * b * b / 3}$`, why: 'You dropped the $+1$ in $t^{2}+1$; integrate both terms.' },
          { t: `$${L / c}$`, why: `You lost the constant factor $${c}$ that scales both coordinates (and the length).` },
          { t: `$${2 * L}$`, why: 'Length is $\\int\\sqrt{x\'^{2}+y\'^{2}}\\,dt$ — the root of the sum, not twice the integral.' },
          { t: `$${c * b * b}$`, why: 'That ignores the cubic term entirely; integrate $t^{2}+1$ over $[0,' + b + ']$.' },
        ]),
      ],
      steps: [
        `$x\'=${2 * c}t$, $y\'=${cf(c)}(t^{2}-1)$.`,
        `$x\'^{2}+y\'^{2}=${c * c}\\left(4t^{2}+(t^{2}-1)^{2}\\right)=${c * c}(t^{2}+1)^{2}$.`,
        `$L=\\displaystyle\\int_0^{${b}}${cf(c)}(t^{2}+1)\\,dt=${cf(c)}\\left[\\dfrac{t^{3}}{3}+t\\right]_0^{${b}}=${L}$.`,
      ],
      recall: 'Arc length only works out by hand when $x\'^{2}+y\'^{2}$ is a perfect square — look for $4t^{2}+(t^{2}-1)^{2}=(t^{2}+1)^{2}$.',
    };
  },
});

G.push({
  id: 'g-p-param-area', topic: 'Parametric Calculus', diff: 3,
  make(r) {
    const m = r.int(1, 3), b = r.int(1, 2);
    const key = `$${frac(2 * b ** (m + 2), m + 2)}$`;
    return {
      prompt: `Find the area under $x=t^{2}$, $y=t^{${m === 1 ? '' : m}}$ for $0\\le t\\le${b}$.`,
      choices: [
        { t: key, ok: true },
        ...choose(key, [
          { t: `$${frac(b ** (m + 1), m + 1)}$`, why: 'You integrated $y\\,dt$. Area is $\\int y\\,dx$, so multiply by $x\'(t)=2t$.', err: 'chain' },
          { t: `$${frac(b ** (m + 2), m + 2)}$`, why: 'The factor $2$ in $x\'(t)=2t$ was dropped.' },
          { t: `$${frac(4 * b ** (m + 2), m + 2)}$`, why: 'The factor $2$ was applied twice — $dx=2t\\,dt$ contributes it once.' },
          { t: `$${frac(2 * b ** (m + 1), m + 1)}$`, why: 'You forgot to multiply $y$ by $t$ coming from $dx=2t\\,dt$.' },
        ]),
      ],
      steps: [
        `$A=\\displaystyle\\int y\\,dx=\\int_0^{${b}}t^{${m}}\\cdot2t\\,dt=\\int_0^{${b}}2t^{${m + 1}}dt$.`,
        `$=\\dfrac{2t^{${m + 2}}}{${m + 2}}\\Big|_0^{${b}}=${frac(2 * b ** (m + 2), m + 2)}$.`,
      ],
      recall: 'Substitute $dx=x\'(t)\\,dt$ and use the $t$-limits.',
    };
  },
});

G.push({
  id: 'g-p-polar-arc-eval', topic: 'Polar Area & Arc Length', diff: 3,
  make(r) {
    const a = r.int(1, 3);
    const kind = r.pick(['card', 'spiral', 'circle']);
    if (kind === 'card') {
      const key = `$${8 * a}$`;
      return {
        prompt: `Find the total length of $r=${cf(a)}(1+\\cos\\theta)$.`,
        choices: [
          { t: key, ok: true },
          ...choose(key, [
            { t: `$${4 * a}$`, why: 'Half the curve ($0\\le\\theta\\le\\pi$). The cardioid closes at $2\\pi$.' },
            { t: `$\\dfrac{${3 * a * a}\\pi}{2}$`, why: 'That is the **area**, not the length.' },
            { t: `$${4 * a}\\pi$`, why: 'No $\\pi$ appears: $\\sqrt{2+2\\cos\\theta}=2\\cos\\frac\\theta2$ integrates to a plain multiple.' },
            { t: `$${16 * a}$`, why: 'Doubled once too often: using symmetry is $2\\times\\int_0^\\pi$, which already totals $8a$.' },
          ]),
        ],
        steps: [
          `$r^{2}+r\'^{2}=${a * a}\\left((1+\\cos\\theta)^{2}+\\sin^{2}\\theta\\right)=${a * a}(2+2\\cos\\theta)=${4 * a * a}\\cos^{2}\\frac\\theta2$.`,
          `$L=2\\displaystyle\\int_0^{\\pi}${2 * a}\\cos\\frac\\theta2\\,d\\theta=${4 * a}\\left[2\\sin\\frac\\theta2\\right]_0^{\\pi}=${8 * a}$.`,
        ],
        recall: 'Cardioid $r=a(1+\\cos\\theta)$ has length $8a$ and area $\\frac{3\\pi a^{2}}{2}$.',
      };
    }
    if (kind === 'spiral') {
      const key = a === 1 ? '$\\sqrt2$' : `$${a}\\sqrt2$`;
      return {
        prompt: `Find the length of $r=${cf(a)}e^{\\theta}$ for $0\\le\\theta\\le\\ln2$.`,
        choices: [
          { t: key, ok: true },
          ...choose(key, [
            { t: `$${a}$`, why: 'The factor $\\sqrt2$ comes from $r^{2}+r\'^{2}=2r^{2}$; you dropped $r\'$.' },
            { t: `$${2 * a}\\sqrt2$`, why: `$\\int_0^{\\ln2}e^{\\theta}d\\theta=e^{\\ln2}-1=1$, not $2$.` },
            { t: `$${cf(a)}\\sqrt2\\ln2$`, why: 'You integrated $1$; the integrand is $\\sqrt2\\,ae^{\\theta}$, whose antiderivative is itself.' },
            { t: `$${3 * a}\\sqrt2$`, why: 'Evaluate $e^{\\theta}\\big|_0^{\\ln2}$ as upper **minus** lower: $2-1=1$.' },
          ]),
        ],
        steps: [
          `$r\'=${cf(a)}e^{\\theta}=r$, so $r^{2}+r\'^{2}=${2 * a * a}e^{2\\theta}$.`,
          `$L=\\displaystyle\\int_0^{\\ln2}${cf(a)}\\sqrt2\\,e^{\\theta}\\,d\\theta=${cf(a)}\\sqrt2\\,(e^{\\ln2}-1)=${a === 1 ? '' : a}\\sqrt2$.`,
        ],
        recall: 'For $r=ae^{k\\theta}$ the radicand is a constant multiple of $e^{2k\\theta}$ — it always roots cleanly.',
      };
    }
    const key = a === 1 ? '$\\pi$' : `$${a}\\pi$`;
    return {
      prompt: `Find the length of the circle $r=${cf(a)}\\cos\\theta$ (traced once).`,
      choices: [
        { t: key, ok: true },
        ...choose(key, [
          { t: `$${2 * a}\\pi$`, why: `Tracing for $\\theta\\in[0,2\\pi]$ goes around **twice**. The circle closes by $\\theta=\\pi$; its diameter is $${a}$, so $C=${a}\\pi$.` },
          { t: `$${cf(a)}\\pi^{2}$`, why: 'Length integrand is $\\sqrt{r^{2}+r\'^{2}}=' + a + '$, a constant; integrating over $[0,\\pi]$ gives $' + a + '\\pi$.' },
          { t: `$\\dfrac{${cf(a)}\\pi}{2}$`, why: 'Half the circle: the range $[0,\\frac\\pi2]$ is not the whole trace.' },
          { t: `$${a * a}\\pi$`, why: 'The circumference is $\\pi\\times$ diameter, linear in $a$ — squaring is for area.' },
        ]),
      ],
      steps: [
        `$r\'=-${cf(a)}\\sin\\theta$, so $r^{2}+r\'^{2}=${a * a}$.`,
        `$L=\\displaystyle\\int_0^{\\pi}${a}\\,d\\theta=${a === 1 ? '' : a}\\pi$.`,
        `Check: diameter $${a}$ gives circumference $\\pi\\cdot${a}$. ✓`,
      ],
      recall: 'Always find the trace range first: $r=a\\cos\\theta$ finishes in $\\pi$, not $2\\pi$.',
    };
  },
});

export const polar = { unit: 'polar', problems: P, generators: G };
