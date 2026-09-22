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

export const polar = { unit: 'polar', problems: P, generators: G };
