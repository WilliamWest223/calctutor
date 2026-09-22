// ---------------------------------------------------------------
// bank/applications.js — Unit 02: Applications of Integration
// ---------------------------------------------------------------
import { frac, coef, choose } from '../util.js';

const P = [];
const G = [];

// =================================================================
// STATIC
// =================================================================

P.push({
  id: 'a-washer-square', topic: 'Volumes: Disks & Washers', diff: 3,
  prompt: 'The region between $y=2x$ and $y=x^{2}$ is revolved about the $x$-axis. Which integral gives the volume?',
  choices: [
    { t: '$\\pi\\displaystyle\\int_{0}^{2}\\left[(2x)^{2}-(x^{2})^{2}\\right]dx$', ok: true },
    { t: '$\\pi\\displaystyle\\int_{0}^{2}\\left(2x-x^{2}\\right)^{2}dx$', why: 'This is **the** most common volume error. You squared the difference of the radii. But a washer\'s area is $\\pi R^{2}-\\pi r^{2}$, a **difference of squares** — and $(R-r)^{2}\\ne R^{2}-r^{2}$. Squaring first destroys the hole.' },
    { t: '$2\\pi\\displaystyle\\int_{0}^{2}x\\left(2x-x^{2}\\right)dx$', why: 'That is the **shell** formula, which is for revolving about the $y$-axis (or a vertical line). Rotating about the $x$-axis with vertical slices gives washers, not shells.' },
    { t: '$\\pi\\displaystyle\\int_{0}^{2}\\left[(x^{2})^{2}-(2x)^{2}\\right]dx$', why: 'Radii reversed. On $[0,2]$ the line $y=2x$ is **above** the parabola, so it is the outer radius. This integral would come out negative.' },
  ],
  steps: [
    'Find the intersections: $2x=x^{2}\\Rightarrow x=0,2$.',
    'On $(0,2)$, test $x=1$: line gives $2$, parabola gives $1$. The **line is on top**, so $R=2x$ and $r=x^{2}$.',
    'Washer cross-section area: $A(x)=\\pi\\left(R^{2}-r^{2}\\right) = \\pi\\left[(2x)^{2}-(x^{2})^{2}\\right]$.',
    '$V = \\pi\\displaystyle\\int_0^2\\left(4x^{2}-x^{4}\\right)dx = \\pi\\left(\\frac{32}{3}-\\frac{32}{5}\\right)=\\frac{64\\pi}{15}$.',
  ],
  recall: '$R^{2}-r^{2}$, **never** $(R-r)^{2}$. Square each radius separately, then subtract.',
  viz: {
    kind: 'revolve', top: x => 2 * x, bot: x => x * x, a: 0, b: 2, axis: 0, slice: 1.3,
    axisLabel: 'y = 0 (x-axis)',
    cap: 'The dashed inner ellipse is the **hole** punched by $y=x^{2}$. Subtracting radii before squaring would compute the volume of a solid with no hole at all.',
  },
});

P.push({
  id: 'a-arclen-form', topic: 'Arc Length', diff: 2,
  prompt: 'What is the arc length of $y=f(x)$ from $x=a$ to $x=b$?',
  choices: [
    { t: '$\\displaystyle\\int_{a}^{b}\\sqrt{1+\\left[f\'(x)\\right]^{2}}\\,dx$', ok: true },
    { t: '$\\displaystyle\\int_{a}^{b}\\sqrt{1+\\left[f(x)\\right]^{2}}\\,dx$', why: 'It is the **derivative** inside the radical, not the function. Arc length depends on steepness, not height — sliding a curve up should not change its length, and $f$ inside would break that.' },
    { t: '$\\displaystyle\\int_{a}^{b}\\left(1+\\left[f\'(x)\\right]^{2}\\right)dx$', why: 'The square root is missing. It comes from Pythagoras: $ds=\\sqrt{dx^{2}+dy^{2}}$ — a length, so a root is unavoidable.' },
    { t: '$\\displaystyle\\int_{a}^{b}\\sqrt{1+f\'(x)}\\,dx$', why: 'The derivative must be **squared**. Without the square, a negative slope could make the radicand negative — impossible for a length.' },
  ],
  steps: [
    'A tiny piece of the curve is the hypotenuse of a triangle with legs $dx$ and $dy$.',
    '$ds = \\sqrt{dx^{2}+dy^{2}} = \\sqrt{1+\\left(\\frac{dy}{dx}\\right)^{2}}\\,dx$ (factor out $dx^2$).',
    'Add them all up: $L=\\displaystyle\\int_a^b\\sqrt{1+\\left[f\'(x)\\right]^{2}}dx$.',
    'Sanity check with a straight line $f=mx$: $L=\\sqrt{1+m^{2}}(b-a)$ — exactly the distance formula. ✓',
  ],
  recall: 'Arc length is Pythagoras integrated. If you integrate with respect to $y$ instead, it is $\\sqrt{1+(dx/dy)^{2}}\\,dy$.',
  viz: {
    kind: 'arclen', f: x => 0.45 * x * x, a: 0, b: 2.6, n: 6,
    cap: 'Each dashed segment is a hypotenuse with legs $dx$ (horizontal) and $dy$ (vertical). The integral is the limit of adding those hypotenuses.',
  },
});

P.push({
  id: 'a-shell-formula', topic: 'Volumes: Shells', diff: 2,
  prompt: 'The region under $y=f(x)$ for $0\\le x\\le b$ ($f\\ge0$) is revolved about the **$y$-axis**. Using shells, the volume is:',
  choices: [
    { t: '$2\\pi\\displaystyle\\int_{0}^{b}x\\,f(x)\\,dx$', ok: true },
    { t: '$\\pi\\displaystyle\\int_{0}^{b}\\left[f(x)\\right]^{2}dx$', why: 'That is the **disk** formula for rotation about the $x$-axis. Rotating about the $y$-axis with vertical slices makes cylindrical shells, not disks.' },
    { t: '$2\\pi\\displaystyle\\int_{0}^{b}f(x)\\,dx$', why: 'The radius $x$ is missing. Each shell has circumference $2\\pi x$ — the further from the axis, the more volume it sweeps.' },
    { t: '$\\pi\\displaystyle\\int_{0}^{b}x\\,f(x)\\,dx$', why: 'A shell unrolls into a rectangular sheet of width $2\\pi r$ (the full circumference), so the constant is $2\\pi$, not $\\pi$.' },
  ],
  steps: [
    'Take a thin vertical strip at position $x$, of height $f(x)$ and thickness $dx$.',
    'Revolving it about the $y$-axis sweeps out a **cylindrical shell**.',
    'Unroll the shell: it becomes a sheet of width $2\\pi x$ (circumference), height $f(x)$, thickness $dx$.',
    'Volume $= \\displaystyle\\int 2\\pi\\,(\\text{radius})(\\text{height})\\,dx = 2\\pi\\int_0^b x f(x)\\,dx$.',
  ],
  recall: 'Shells: $2\\pi\\int(\\text{radius})(\\text{height})\\,d(\\text{thickness})$. Slices **parallel** to the axis → shells. Slices **perpendicular** → disks/washers.',
  viz: {
    kind: 'revolve', top: x => Math.sqrt(x) * 1.4, a: 0.02, b: 3, axis: 0,
    method: 'shell', axisX: 0, slice: 1.9,
    cap: 'The red strip is at distance $x$ from the axis. Spinning it traces a cylinder of circumference $2\\pi x$ — that factor is the whole formula.',
  },
});

P.push({
  id: 'a-axis-offset', topic: 'Volumes: Disks & Washers', diff: 3,
  prompt: 'The region under $y=f(x)$ (with $0\\le f(x)\\le 2$) on $[a,b]$ is revolved about the line $y=5$. The **inner** radius of a washer at $x$ is:',
  choices: [
    { t: '$5-f(x)$', ok: true },
    { t: '$f(x)-5$', why: 'Negative for every $x$ here, since $f\\le2<5$. A radius is a distance and must be positive — subtract in the order that gives a positive value.' },
    { t: '$f(x)+5$', why: 'That is the distance from the line $y=-5$. Adding moves the axis the wrong way.' },
    { t: '$5$', why: 'That is the **outer** radius — the distance from $y=5$ down to the region\'s far edge at $y=0$. The inner radius reaches only as far as the curve.' },
  ],
  steps: [
    'The axis is $y=5$; the whole region lies **below** it (since $f\\le 2$).',
    'The washer\'s hole is bounded by whichever edge is **closest** to the axis — that is the curve, at distance $5-f(x)$. So $r=5-f(x)$.',
    'The outer edge is the part **farthest** from the axis — the $x$-axis, at distance $5-0=5$. So $R=5$.',
    '$V=\\pi\\displaystyle\\int_a^b\\left[25-\\left(5-f(x)\\right)^{2}\\right]dx$.',
  ],
  recall: 'Radius = |axis value − curve value|. Draw the axis and measure; never assume the curve\'s own $y$-value is the radius unless the axis is $y=0$.',
  viz: {
    kind: 'revolve', top: x => 1.4 + 0.5 * Math.sin(x), a: 0.3, b: 5, axis: 5, slice: 2.6,
    axisLabel: 'y = 5',
    cap: 'The dashed orange line is the axis of rotation. Radii are measured **from it**, not from the $x$-axis — that offset is what changes the whole integral.',
  },
});

P.push({
  id: 'a-avg-value', topic: 'Average Value', diff: 1,
  prompt: 'The average value of $f$ on $[a,b]$ is:',
  choices: [
    { t: '$\\dfrac{1}{b-a}\\displaystyle\\int_{a}^{b}f(x)\\,dx$', ok: true },
    { t: '$\\displaystyle\\int_{a}^{b}f(x)\\,dx$', why: 'That is total accumulation, not an average. An average must divide by the size of the interval — otherwise a longer interval would always give a bigger "average".' },
    { t: '$\\dfrac{f(a)+f(b)}{2}$', why: 'That averages only the two endpoints and ignores everything in between. It happens to be right for linear $f$ and wrong in general.' },
    { t: '$\\dfrac{1}{b-a}\\displaystyle\\int_{a}^{b}f\'(x)\\,dx$', why: 'That is the average **rate of change**, $\\frac{f(b)-f(a)}{b-a}$ — a different quantity entirely.' },
  ],
  steps: [
    'An average of finitely many values is (sum)/(count).',
    'The continuous analogue: sum $\\to\\int_a^b f\\,dx$, count $\\to$ length $b-a$.',
    '$f_{\\text{avg}} = \\dfrac{1}{b-a}\\displaystyle\\int_a^b f(x)\\,dx$.',
    'The Mean Value Theorem for Integrals guarantees some $c\\in[a,b]$ with $f(c)=f_{\\text{avg}}$ when $f$ is continuous.',
  ],
  recall: 'Average value is a **height**: the height of the rectangle with the same area over the same interval.',
  viz: {
    kind: 'plot', xmin: 0, xmax: 4, ymin: 0, ymax: 5,
    curves: [{ f: x => 1 + x - 0.22 * x * x + 0.5 * Math.sin(2 * x), color: 'var(--cyan)', label: 'f(x)' }],
    bands: [{ f: x => 1 + x - 0.22 * x * x + 0.5 * Math.sin(2 * x), a: 0, b: 4, color: 'var(--lime)', op: 0.16 }],
    segs: [{ x1: 0, y1: 2.42, x2: 4, y2: 2.42, color: 'var(--amber)', dash: '6 4', w: 2 }],
    labels: [{ x: 0.15, y: 2.72, text: 'average value', fill: 'var(--amber)', size: 11.5 }],
    cap: 'The dashed line is the average. The area under $f$ equals the area of the rectangle beneath that line — the bumps above and below cancel.',
  },
});

P.push({
  id: 'a-work-pump', topic: 'Work', diff: 3,
  prompt: 'A tank of height $H$ is full of water (density $\\rho$). To pump all the water **out the top**, the work integral for a layer at height $y$ uses which distance?',
  choices: [
    { t: '$H-y$', ok: true },
    { t: '$y$', why: 'That is the height of the layer above the bottom, not how far it must travel. Water at the very top ($y=H$) needs almost no lifting — with distance $y$ you would say it needs the most.' },
    { t: '$H$', why: 'Only the layer at the very bottom travels the full height $H$. Using $H$ for every layer overestimates the work.' },
    { t: '$H+y$', why: 'That would apply if you were pumping to a spout $H$ units **above** the tank\'s top. Read where the water is going.' },
  ],
  steps: [
    'Slice the water into thin horizontal layers at height $y$, thickness $dy$.',
    'Each layer weighs $\\rho g\\,A(y)\\,dy$ (force).',
    'It must be lifted from height $y$ up to the top at height $H$: distance $= H-y$.',
    '$W = \\displaystyle\\int_0^H \\rho g\\,A(y)\\,(H-y)\\,dy$. Work $=\\int(\\text{force})\\times(\\text{distance each piece moves})$.',
  ],
  recall: 'Set up work problems by asking two questions per slice: how heavy is it, and how far does **it** move?',
  viz: {
    kind: 'plot', xmin: -2.4, xmax: 2.4, ymin: -0.4, ymax: 5,
    curves: [{ f: x => (Math.abs(x) <= 2 ? 4.5 : NaN), color: 'var(--line)', w: 1 }],
    bands: [{ f: () => 4.5, a: -2, b: 2, color: 'var(--cyan)', op: 0.13 }, { f: () => 1.9, a: -2, b: 2, color: 'var(--cyan)', op: 0.18 }],
    segs: [
      { x1: -2, y1: 0, x2: -2, y2: 4.5, color: 'var(--ink-2)', w: 2 },
      { x1: 2, y1: 0, x2: 2, y2: 4.5, color: 'var(--ink-2)', w: 2 },
      { x1: -2, y1: 0, x2: 2, y2: 0, color: 'var(--ink-2)', w: 2 },
      { x1: -2, y1: 1.9, x2: 2, y2: 1.9, color: 'var(--amber)', w: 2.4 },
      { x1: 0, y1: 1.9, x2: 0, y2: 4.5, color: 'var(--coral)', w: 2, dash: '5 3' },
    ],
    labels: [
      { x: 0.15, y: 3.3, text: 'distance = H − y', fill: 'var(--coral)', size: 11.5 },
      { x: -1.9, y: 2.15, text: 'layer at height y', fill: 'var(--amber)', size: 11 },
      { x: -1.9, y: 4.75, text: 'top of tank (y = H)', fill: 'var(--ink-2)', size: 11 },
    ],
    cap: 'Every layer travels a **different** distance. The red arrow shrinks to zero as the layer approaches the top — that is the $H-y$.',
  },
});

P.push({
  id: 'a-dx-or-dy', topic: 'Area Between Curves', diff: 3,
  prompt: 'For the region bounded by $x=y^{2}$ and $x=y+2$, why is integrating with respect to $y$ easier?',
  choices: [
    { t: 'With respect to $x$ the region needs to be split into two pieces', ok: true },
    { t: 'Integrating in $y$ always gives a smaller answer', why: 'The area is a geometric fact — it does not depend on how you slice. Both methods give the same number; one is just less work.' },
    { t: 'Because $x=y^{2}$ is not a function', why: '$x=y^{2}$ *is* a perfectly good function of $y$. The issue is that solving for $y$ gives $y=\\pm\\sqrt x$ — two branches — which is what forces the split.' },
    { t: 'You cannot integrate with respect to $x$ here at all', why: 'You can; it just takes two integrals. "Harder" is not "impossible".' },
  ],
  steps: [
    'Intersections: $y^{2}=y+2\\Rightarrow y^{2}-y-2=0\\Rightarrow y=-1,2$.',
    'Horizontal slices run from the parabola $x=y^{2}$ (left) to the line $x=y+2$ (right) for **all** $y\\in[-1,2]$ — one clean integral.',
    '$A=\\displaystyle\\int_{-1}^{2}\\left[(y+2)-y^{2}\\right]dy = \\frac92$.',
    'Vertical slices, by contrast, have the parabola as *both* boundaries for $x<1$ and change at $x=1$ — two separate integrals.',
  ],
  recall: 'Slice in the direction where **one** top/bottom (or left/right) pair works for the whole region.',
  viz: {
    kind: 'plot', xmin: -0.6, xmax: 5, ymin: -2, ymax: 3,
    curves: [
      { f: x => (x >= 0 ? Math.sqrt(x) : NaN), color: 'var(--cyan)', label: 'x = y²' },
      { f: x => (x >= 0 ? -Math.sqrt(x) : NaN), color: 'var(--cyan)' },
      { f: x => x - 2, color: 'var(--violet)', label: 'x = y + 2' },
    ],
    segs: [
      { x1: 1, y1: -2, x2: 1, y2: 3, color: 'var(--coral)', dash: '4 4', w: 1.6 },
      { x1: 0.25, y1: 0.5, x2: 2.5, y2: 0.5, color: 'var(--amber)', w: 2.4 },
    ],
    labels: [{ x: 1.05, y: 2.7, text: 'vertical slices change here', fill: 'var(--coral)', size: 10.5 }],
    cap: 'The orange horizontal slice runs parabola→line for every $y$. Vertical slices would change character at the red line, forcing two integrals.',
  },
});

P.push({
  id: 'a-surface-area', topic: 'Surface Area', diff: 2,
  prompt: 'The surface area generated by revolving $y=f(x)$, $a\\le x\\le b$, about the $x$-axis is:',
  choices: [
    { t: '$\\displaystyle\\int_{a}^{b}2\\pi f(x)\\sqrt{1+\\left[f\'(x)\\right]^{2}}\\,dx$', ok: true },
    { t: '$\\displaystyle\\int_{a}^{b}2\\pi f(x)\\,dx$', why: 'This uses $dx$ where it needs $ds$. The surface is generated by the **slanted** arc, not its horizontal shadow — the $\\sqrt{1+(f\')^{2}}$ accounts for the slant.' },
    { t: '$\\pi\\displaystyle\\int_{a}^{b}\\left[f(x)\\right]^{2}dx$', why: 'That is the **volume** by disks. Surface area uses circumference $2\\pi r$, not area $\\pi r^{2}$.' },
    { t: '$\\displaystyle\\int_{a}^{b}2\\pi\\sqrt{1+\\left[f\'(x)\\right]^{2}}\\,dx$', why: 'The radius $f(x)$ is missing. Each band has circumference $2\\pi f(x)$ — a band far from the axis contributes more surface.' },
  ],
  steps: [
    'Revolving a small arc $ds$ at height $f(x)$ gives a thin band (a frustum).',
    'The band\'s area is (circumference)$\\times$(slant width) $= 2\\pi f(x)\\,ds$.',
    '$ds = \\sqrt{1+\\left[f\'(x)\\right]^{2}}dx$, the same arc-length element.',
    '$S = \\displaystyle\\int_a^b 2\\pi f(x)\\sqrt{1+\\left[f\'(x)\\right]^{2}}\\,dx$.',
  ],
  recall: 'Surface area $=\\int 2\\pi r\\,ds$. Volume uses $dx$; surface uses $ds$. Mixing them up is the standard mistake.',
});

P.push({
  id: 'a-centroid', topic: 'Centroids', diff: 3,
  prompt: 'For a thin plate of uniform density under $y=f(x)$ on $[a,b]$, the $y$-coordinate of the centroid is:',
  choices: [
    { t: '$\\bar y = \\dfrac{1}{A}\\displaystyle\\int_{a}^{b}\\dfrac{1}{2}\\left[f(x)\\right]^{2}dx$', ok: true },
    { t: '$\\bar y = \\dfrac{1}{A}\\displaystyle\\int_{a}^{b}f(x)\\,dx$', why: 'That equals $\\frac{1}{A}\\cdot A = 1$ always — clearly not a centroid. The moment about the $x$-axis weights each strip by the height of **its own** center, $\\frac{f(x)}{2}$.' },
    { t: '$\\bar y = \\dfrac{1}{A}\\displaystyle\\int_{a}^{b}x f(x)\\,dx$', why: 'That is $\\bar x$, the horizontal coordinate. You are weighting by horizontal position instead of vertical.' },
    { t: '$\\bar y = \\dfrac{1}{A}\\displaystyle\\int_{a}^{b}\\left[f(x)\\right]^{2}dx$', why: 'Missing the $\\frac12$. A vertical strip\'s center of mass is at its **midpoint** $\\frac{f(x)}{2}$, not at its top.' },
  ],
  steps: [
    'A vertical strip at $x$ has area $f(x)\\,dx$ and its own center of mass at height $\\frac{f(x)}{2}$.',
    'Moment about the $x$-axis: $M_x=\\displaystyle\\int_a^b \\frac{f(x)}{2}\\cdot f(x)\\,dx = \\int_a^b\\frac{[f(x)]^{2}}{2}dx$.',
    'Moment about the $y$-axis: $M_y=\\displaystyle\\int_a^b x\\,f(x)\\,dx$.',
    '$\\bar x = \\frac{M_y}{A}$, $\\bar y = \\frac{M_x}{A}$ where $A=\\int_a^b f\\,dx$.',
  ],
  recall: 'Every strip contributes (its area) × (the coordinate of **its own** center). Vertically that center is halfway up.',
});

// =================================================================
// GENERATORS
// =================================================================

G.push({
  id: 'g-a-area', topic: 'Area Between Curves', diff: 2,
  make(r) {
    const a = r.int(2, 6);                     // y = a x  meets y = x^2 at 0 and a
    const A = a ** 3 / 6;
    return {
      prompt: `Find the area of the region enclosed by $y=${a}x$ and $y=x^{2}$.`,
      choices: [
        { t: `$${frac(a ** 3, 6)}$`, ok: true },
        { t: `$${frac(-(a ** 3), 6)}$`, why: `You subtracted in the wrong order. On $(0,${a})$ the line is **above** the parabola, so the integrand is $${a}x-x^{2}$. Area is never negative.` },
        { t: `$${frac(a ** 3, 3)}$`, why: `You integrated only the line: $\\int_0^{${a}}${a}x\\,dx = ${frac(a ** 3, 2)}$… or dropped the $-x^{2}$ term. Both curves must appear.` },
        { t: `$${frac(a ** 3, 2)}$`, why: `That is $\\int_0^{${a}}${a}x\\,dx$ alone — the area under the line down to the $x$-axis, not the area between the two curves.` },
      ],
      steps: [
        `Intersections: $${a}x = x^{2}\\Rightarrow x(x-${a})=0\\Rightarrow x=0,\\;${a}$.`,
        `Test $x=1$: line gives $${a}$, parabola gives $1$. The line is on top.`,
        `$A=\\displaystyle\\int_0^{${a}}\\left(${a}x-x^{2}\\right)dx = \\left[\\frac{${a}x^{2}}{2}-\\frac{x^{3}}{3}\\right]_0^{${a}}$`,
        `$= \\frac{${a ** 3}}{2}-\\frac{${a ** 3}}{3} = ${frac(a ** 3, 6)}$`,
      ],
      recall: 'Always (top − bottom). Test one interior point to see which is which — do not guess from the equations.',
      viz: {
        kind: 'area', xmin: -0.6, xmax: a + 0.8, a: 0, b: a, slice: a * 0.55,
        top: x => a * x, bot: x => x * x, topLabel: `y = ${a}x`, botLabel: 'y = x²',
        cap: 'The orange slice is a single strip: its length is (top − bottom). Integrating those lengths sweeps out the shaded area.',
      },
    };
  },
});

G.push({
  id: 'g-a-disk', topic: 'Volumes: Disks & Washers', diff: 2,
  make(r) {
    const k = r.int(1, 3), b = r.int(1, 3);
    const den = 2 * k + 1, numr = b ** den;
    return {
      prompt: `The region under $y=x^{${k}}$ from $x=0$ to $x=${b}$ is revolved about the **$x$-axis**. Find the volume.`,
      choices: [
        { t: `$\\dfrac{${numr}\\pi}{${den}}$`, ok: true },
        { t: `$\\dfrac{${b ** (k + 1)}\\pi}{${k + 1}}$`, why: `You integrated $x^{${k}}$ instead of $\\left(x^{${k}}\\right)^{2}=x^{${2 * k}}$. The radius gets **squared** before integrating.` },
        { t: `$\\dfrac{${numr}\\pi^{2}}{${den}}$`, why: 'Only one factor of $\\pi$ appears — it comes from the disk area $\\pi R^{2}$, and it is a constant pulled outside the integral.' },
        { t: `$\\dfrac{${numr}}{${den}}$`, why: 'The $\\pi$ is missing. Each cross-section is a **circle** of area $\\pi R^{2}$, not a square of area $R^2$.' },
      ],
      steps: [
        `Cross-sections perpendicular to the $x$-axis are **disks** of radius $R=x^{${k}}$.`,
        `$A(x)=\\pi R^{2} = \\pi x^{${2 * k}}$`,
        `$V=\\pi\\displaystyle\\int_0^{${b}} x^{${2 * k}}dx = \\pi\\left[\\frac{x^{${den}}}{${den}}\\right]_0^{${b}}$`,
        `$= \\dfrac{${numr}\\pi}{${den}}$`,
      ],
      recall: 'Disks: $V=\\pi\\int R(x)^{2}dx$. Square the radius **first**, then integrate.',
      viz: {
        kind: 'revolve', top: x => Math.pow(x, k), a: 0, b, axis: 0, slice: b * 0.62,
        axisLabel: 'y = 0', cap: 'Each red circle is one disk. Its radius is the height of the curve, and its area is $\\pi R^{2}$.',
      },
    };
  },
});

G.push({
  id: 'g-a-shell', topic: 'Volumes: Shells', diff: 2,
  make(r) {
    const k = r.int(1, 3), b = r.int(1, 3);
    const den = k + 2, numr = 2 * b ** den;
    const key = `$\\dfrac{${numr}\\pi}{${den}}$`;
    return {
      prompt: `The region under $y=x^{${k}}$ from $x=0$ to $x=${b}$ is revolved about the **$y$-axis**. Use shells to find the volume.`,
      choices: [
        { t: key, ok: true },
        ...choose(key, [
          { t: `$\\dfrac{${b ** (k + 1)}\\pi}{${k + 1}}$`, why: `The radius factor $x$ is missing — you integrated $2\\pi\\int x^{${k}}dx$ without it, then also dropped the $2$. Shells need $2\\pi\\int x\\cdot f(x)\\,dx$.` },
          { t: `$\\dfrac{${b ** den}\\pi}{${den}}$`, why: 'You dropped the factor of $2$. A shell unrolls to width $2\\pi r$ — the full circumference.' },
          { t: `$\\dfrac{${2 * b ** (2 * k + 1)}\\pi}{${2 * k + 1}}$`, why: 'You squared the height as if these were disks. Shells use height to the **first** power — nothing is squared.' },
          { t: `$\\dfrac{${2 * b ** (2 * k + 2)}\\pi}{${2 * k + 2}}$`, why: 'You squared the whole integrand $x\\cdot x^{k}$. Shells never square anything — that is the disk/washer method.' },
          { t: `$${numr}\\pi$`, why: `You forgot to divide by the new exponent $${den}$ when integrating $x^{${k + 1}}$.` },
        ]),
      ],
      steps: [
        `Vertical strips are **parallel** to the $y$-axis, so revolving them gives shells.`,
        `radius $=x$, height $=x^{${k}}$, thickness $=dx$.`,
        `$V=2\\pi\\displaystyle\\int_0^{${b}} x\\cdot x^{${k}}dx = 2\\pi\\int_0^{${b}}x^{${k + 1}}dx$`,
        `$= 2\\pi\\left[\\frac{x^{${den}}}{${den}}\\right]_0^{${b}} = \\dfrac{${numr}\\pi}{${den}}$`,
      ],
      recall: 'Shells never square anything. Disks/washers always do.',
      viz: {
        kind: 'revolve', top: x => Math.pow(x, k), a: 0, b, axis: 0,
        method: 'shell', axisX: 0, slice: b * 0.62, axisLabel: 'x = 0 (y-axis)',
        cap: 'The red strip at distance $x$ sweeps a cylinder. Its area when unrolled is $2\\pi x\\cdot\\text{height}$.',
      },
    };
  },
});

G.push({
  id: 'g-a-washer', topic: 'Volumes: Disks & Washers', diff: 3,
  make(r) {
    const a = r.int(2, 4);       // y = a x  and y = x^2, about x-axis
    const num = 2 * a ** 5, den = 15;
    return {
      prompt: `The region between $y=${a}x$ and $y=x^{2}$ is revolved about the $x$-axis. Find the volume.`,
      choices: [
        { t: `$\\dfrac{${num}\\pi}{${den}}$`, ok: true },
        { t: `$\\dfrac{${a ** 5}\\pi}{30}$`, why: `You computed $\\pi\\int\\left(${a}x-x^{2}\\right)^{2}dx$ — squaring the **difference**. A washer is $\\pi(R^{2}-r^{2})$; $(R-r)^{2}$ is a different (smaller) number.` },
        { t: `$\\dfrac{${num}\\pi}{${den}}\\cdot 2$`, why: 'Double counting. Revolving a full $2\\pi$ is already built into the $\\pi R^{2}$ area formula — do not multiply again.' },
        { t: `$\\dfrac{${a ** 3}}{6}$`, why: 'That is the **area** of the region, not a volume. No $\\pi$, and no squaring.' },
      ],
      steps: [
        `Intersections: $${a}x = x^{2}\\Rightarrow x=0,\\;${a}$. On $(0,${a})$ the line is on top, so $R=${a}x$, $r=x^{2}$.`,
        `$V=\\pi\\displaystyle\\int_0^{${a}}\\left[(${a}x)^{2}-(x^{2})^{2}\\right]dx = \\pi\\int_0^{${a}}\\left(${a * a}x^{2}-x^{4}\\right)dx$`,
        `$= \\pi\\left[\\frac{${a * a}x^{3}}{3}-\\frac{x^{5}}{5}\\right]_0^{${a}} = \\pi\\left(\\frac{${a ** 5}}{3}-\\frac{${a ** 5}}{5}\\right)$`,
        `$= \\pi\\cdot${a ** 5}\\cdot\\frac{2}{15} = \\dfrac{${num}\\pi}{${den}}$`,
      ],
      recall: '$\\pi\\int\\left(R^{2}-r^{2}\\right)dx$ — subtract the **squares**, not before squaring.',
      viz: {
        kind: 'revolve', top: x => a * x, bot: x => x * x, a: 0, b: a, axis: 0, slice: a * 0.6,
        axisLabel: 'y = 0', cap: 'Solid outer circle minus dashed inner circle. The hole is real — squaring the difference would fill it in.',
      },
    };
  },
});

G.push({
  id: 'g-a-avg', topic: 'Average Value', diff: 1,
  make(r) {
    const k = r.int(2, 3), b = r.int(2, 4);
    // avg of x^k on [0,b] = b^k/(k+1)
    const key = `$${frac(b ** k, k + 1)}$`;
    return {
      prompt: `Find the average value of $f(x)=x^{${k}}$ on $[0,${b}]$.`,
      choices: [
        { t: key, ok: true },
        ...choose(key, [
          { t: `$${frac(b ** (k + 1), k + 1)}$`, why: `That is $\\int_0^{${b}}x^{${k}}dx$ — the total, not the average. You still have to divide by the interval length $${b}$.` },
          { t: `$${b ** k}$`, why: `That is $f(${b})$, the maximum on the interval. An average must lie strictly between the min and max.` },
          { t: `$${frac(b ** k, 2)}$`, why: `You averaged the endpoint values $\\frac{f(0)+f(${b})}{2}$. That only works for linear functions.` },
          { t: `$${frac(b ** k, k)}$`, why: `Off by one in the exponent bookkeeping: $\\int x^{${k}}dx = \\frac{x^{${k + 1}}}{${k + 1}}$, so you divide by $${k + 1}$, not $${k}$.` },
          { t: `$${frac(b ** k, k + 2)}$`, why: `Divided by $${k + 2}$. Integrating $x^{${k}}$ raises the power to $${k + 1}$ and divides by $${k + 1}$.` },
          { t: `$${frac(b ** (k + 1), k)}$`, why: `Two slips: divide by $${k + 1}$ when integrating, then by the interval length $${b}$.` },
          { t: `$${frac(b ** (k + 1), (k + 1) * (k + 1))}$`, why: `You divided by $${k + 1}$ twice. Divide once when integrating, then once by the length $${b}$.` },
        ]),
      ],
      steps: [
        `$f_{\\text{avg}} = \\dfrac{1}{${b}-0}\\displaystyle\\int_0^{${b}}x^{${k}}dx$`,
        `$\\displaystyle\\int_0^{${b}}x^{${k}}dx = \\frac{${b}^{${k + 1}}}{${k + 1}} = ${frac(b ** (k + 1), k + 1)}$`,
        `Divide by $${b}$: $f_{\\text{avg}} = ${frac(b ** k, k + 1)}$`,
        `Check: it lies between $f(0)=0$ and $f(${b})=${b ** k}$. ✓`,
      ],
      recall: 'Integrate, then divide by the length. The answer is a height, and it must sit between the min and max.',
    };
  },
});

G.push({
  id: 'g-a-spring', topic: 'Work', diff: 2,
  make(r) {
    const F = r.pick([10, 12, 20, 24, 30]), d = r.pick([0.2, 0.5]);
    const k = F / d;
    const s = r.pick([0.3, 0.4, 0.6]);
    const Wv = k * s * s / 2;
    const rd = v => Math.round(v * 1000) / 1000;
    const key = `$${rd(Wv)}$ J`;
    return {
      prompt: `A force of $${F}$ N holds a spring stretched $${d}$ m beyond its natural length. How much work is needed to stretch it $${s}$ m from its natural length?`,
      choices: [
        { t: key, ok: true },
        ...choose(key, [
          { t: `$${rd(k * s)}$ J`, why: `You multiplied force by distance as if the force were constant. Spring force **grows** with stretch, so you must integrate: $W=\\int_0^{${s}}kx\\,dx$, which gives half of what you computed.` },
          { t: `$${rd(k * s * s)}$ J`, why: 'You integrated but dropped the $\\frac12$: $\\int_0^{s}kx\\,dx = \\frac{ks^{2}}{2}$.' },
          { t: `$${rd(F * s)}$ J`, why: `You used the given force $${F}$ N as if it applied throughout. That force corresponds only to a stretch of $${d}$ m; first find $k$.` },
          { t: `$${rd(F * s * s / 2)}$ J`, why: `You used the measured force $${F}$ N in place of the spring constant. $k=\\frac{${F}}{${d}}=${rd(k)}$ N/m — the two are only equal if the stretch were $1$ m.` },
          { t: `$${rd(k * d * d / 2)}$ J`, why: `That is the work to stretch it to $${d}$ m — the stretch you were *given*, not the one you were asked about.` },
        ]),
      ],
      steps: [
        `Hooke's Law: $F=kx$. From $${F}=k(${d})$ we get $k=${rd(k)}$ N/m.`,
        `Work with a variable force: $W=\\displaystyle\\int_0^{${s}} kx\\,dx$.`,
        `$= \\dfrac{k x^{2}}{2}\\Big|_0^{${s}} = \\dfrac{${rd(k)}\\cdot${s * s === Math.round(s * s * 100) / 100 ? Math.round(s * s * 100) / 100 : s * s}}{2}$`,
        `$= ${rd(Wv)}$ J`,
      ],
      recall: 'Variable force → $W=\\int F(x)\\,dx$. Only a constant force lets you write $W=Fd$.',
      viz: {
        kind: 'plot', xmin: 0, xmax: s * 1.5, ymin: 0, ymax: k * s * 1.3,
        curves: [{ f: x => k * x, color: 'var(--cyan)', label: 'F = kx' }],
        bands: [{ f: x => k * x, a: 0, b: s, color: 'var(--lime)', op: 0.2 }],
        cap: 'Work is the **area** under the force curve. Because the force is a ramp, that area is a triangle — hence the $\\frac12$.',
      },
    };
  },
});

G.push({
  id: 'g-a-arclen-setup', topic: 'Arc Length', diff: 2,
  make(r) {
    const opts = [
      { f: 'x^{3}', d: '3x^{2}', dd: '9x^{4}' },
      { f: 'x^{2}', d: '2x', dd: '4x^{2}' },
      { f: '\\ln x', d: '\\dfrac{1}{x}', dd: '\\dfrac{1}{x^{2}}' },
      { f: 'e^{x}', d: 'e^{x}', dd: 'e^{2x}' },
    ];
    const o = r.pick(opts);
    const a = r.int(1, 2), b = a + r.int(1, 3);
    return {
      prompt: `Set up the arc length of $y=${o.f}$ on $[${a},${b}]$.`,
      choices: [
        { t: `$\\displaystyle\\int_{${a}}^{${b}}\\sqrt{1+${o.dd}}\\,dx$`, ok: true },
        { t: `$\\displaystyle\\int_{${a}}^{${b}}\\sqrt{1+${o.d}}\\,dx$`, why: 'The derivative must be **squared** inside the radical.' },
        { t: `$\\displaystyle\\int_{${a}}^{${b}}\\sqrt{1+\\left(${o.f}\\right)^{2}}\\,dx$`, why: 'You used the function instead of its derivative. Arc length depends on slope only.' },
        { t: `$\\displaystyle\\int_{${a}}^{${b}}\\left(1+${o.dd}\\right)dx$`, why: 'Missing the square root — the arc element is a length, $\\sqrt{dx^{2}+dy^{2}}$.' },
      ],
      steps: [
        `$\\dfrac{dy}{dx} = ${o.d}$`,
        `$\\left(\\dfrac{dy}{dx}\\right)^{2} = ${o.dd}$`,
        `$L=\\displaystyle\\int_{${a}}^{${b}}\\sqrt{1+\\left(\\frac{dy}{dx}\\right)^{2}}dx = \\int_{${a}}^{${b}}\\sqrt{1+${o.dd}}\\,dx$`,
      ],
      recall: 'Differentiate, square, add 1, take the root, integrate. In that order every time.',
    };
  },
});

G.push({
  id: 'g-a-pump', topic: 'Work', diff: 3,
  make(r) {
    const R = r.int(2, 4), H = r.int(3, 6);
    const rho = 1000, g = 9.8;
    const coefv = Math.round(rho * g * Math.PI * R * R * H * H / 2);
    const wrong1 = Math.round(rho * g * Math.PI * R * R * H * H);       // forgot the 1/2 / used H
    const wrong2 = Math.round(rho * g * Math.PI * R * R * H);           // no distance at all
    return {
      prompt: `A cylindrical tank of radius $${R}$ m and height $${H}$ m is full of water ($\\rho=1000$ kg/m³, $g=9.8$). Find the work needed to pump all the water out over the top.`,
      choices: [
        { t: `$${coefv}$ J`, ok: true },
        { t: `$${wrong1}$ J`, why: `You used a distance of $${H}$ for every layer instead of $${H}-y$. Only the bottom layer travels the full height; the result is exactly twice too large.` },
        { t: `$${wrong2}$ J`, why: 'You computed the total weight of the water but never multiplied by any distance. Work has units of force × length.' },
        { t: `$${Math.round(coefv / Math.PI)}$ J`, why: `The cross-sectional area is $\\pi r^{2}=\\pi(${R})^{2}$ — you dropped the $\\pi$.` },
      ],
      steps: [
        `Layer at height $y$, thickness $dy$: volume $=\\pi(${R})^{2}dy = ${R * R}\\pi\\,dy$.`,
        `Its weight (force) $= \\rho g\\cdot${R * R}\\pi\\,dy = ${rho * g * R * R}\\pi\\,dy$.`,
        `It must rise a distance $${H}-y$.`,
        `$W=\\displaystyle\\int_0^{${H}} ${rho * g * R * R}\\pi(${H}-y)\\,dy = ${rho * g * R * R}\\pi\\cdot\\frac{${H}^{2}}{2} = ${coefv}$ J`,
      ],
      recall: 'Weight of the slice × distance **that slice** moves, integrated. The distance is almost never constant.',
      viz: {
        kind: 'plot', xmin: -R * 1.4, xmax: R * 1.4, ymin: -0.3, ymax: H * 1.15,
        curves: [{ f: () => NaN, color: 'var(--line)' }],
        bands: [{ f: () => H, a: -R, b: R, color: 'var(--cyan)', op: 0.12 }, { f: () => H * 0.42, a: -R, b: R, color: 'var(--cyan)', op: 0.18 }],
        segs: [
          { x1: -R, y1: 0, x2: -R, y2: H, color: 'var(--ink-2)', w: 2 },
          { x1: R, y1: 0, x2: R, y2: H, color: 'var(--ink-2)', w: 2 },
          { x1: -R, y1: 0, x2: R, y2: 0, color: 'var(--ink-2)', w: 2 },
          { x1: -R, y1: H * 0.42, x2: R, y2: H * 0.42, color: 'var(--amber)', w: 2.4 },
          { x1: 0, y1: H * 0.42, x2: 0, y2: H, color: 'var(--coral)', w: 2, dash: '5 3' },
        ],
        labels: [{ x: 0.12, y: H * 0.72, text: `lifts ${H} − y`, fill: 'var(--coral)', size: 11 }],
        cap: 'Slices near the top barely move; slices at the bottom move the full height. Averaging that gives the factor $\\frac{H^{2}}{2}$.',
      },
    };
  },
});

G.push({
  id: 'g-a-surf', topic: 'Surface Area', diff: 2,
  make(r) {
    const opts = [
      { f: 'x^{3}', d: '3x^{2}', dd: '9x^{4}' },
      { f: 'x^{2}', d: '2x', dd: '4x^{2}' },
      { f: '\\sqrt{x}', d: '\\dfrac{1}{2\\sqrt{x}}', dd: '\\dfrac{1}{4x}' },
    ];
    const o = r.pick(opts);
    const a = r.int(1, 2), b = a + r.int(1, 3);
    const key = `$\\displaystyle\\int_{${a}}^{${b}} 2\\pi ${o.f}\\sqrt{1+${o.dd}}\\,dx$`;
    return {
      prompt: `Set up the surface area obtained by revolving $y=${o.f}$, $${a}\\le x\\le ${b}$, about the **$x$-axis**.`,
      choices: [
        { t: key, ok: true },
        ...choose(key, [
          { t: `$\\displaystyle\\int_{${a}}^{${b}} 2\\pi ${o.f}\\,dx$`, why: 'You used $dx$ instead of $ds$. The band is generated by the **slanted** arc, so the arc-length factor $\\sqrt{1+(y\')^{2}}$ is required.' },
          { t: `$\\displaystyle\\int_{${a}}^{${b}} \\pi \\left(${o.f}\\right)^{2}dx$`, why: 'That is the **volume** by disks. Surface area uses circumference $2\\pi r$, not area $\\pi r^{2}$.' },
          { t: `$\\displaystyle\\int_{${a}}^{${b}} 2\\pi\\sqrt{1+${o.dd}}\\,dx$`, why: 'The radius $y$ is missing. Each band has circumference $2\\pi y$ — bands further from the axis contribute more surface.' },
          { t: `$\\displaystyle\\int_{${a}}^{${b}} 2\\pi ${o.f}\\sqrt{1+\\left(${o.f}\\right)^{2}}\\,dx$`, why: 'Inside the radical goes the **derivative**, not the function itself.' },
        ]),
      ],
      steps: [
        `Radius of a band at $x$: $r = y = ${o.f}$.`,
        `$\\dfrac{dy}{dx} = ${o.d}$, so $\\left(\\dfrac{dy}{dx}\\right)^{2} = ${o.dd}$.`,
        `$ds = \\sqrt{1+${o.dd}}\\,dx$`,
        `$S=\\displaystyle\\int 2\\pi r\\,ds = \\int_{${a}}^{${b}} 2\\pi ${o.f}\\sqrt{1+${o.dd}}\\,dx$`,
      ],
      recall: 'Surface area $=\\int2\\pi r\\,ds$. Volume uses $dx$; surface uses $ds$. That single difference is the whole formula.',
    };
  },
});

G.push({
  id: 'g-a-centroid', topic: 'Centroids', diff: 3,
  make(r) {
    const k = r.int(1, 3), b = r.int(2, 4);
    // x̄ for region under y = x^k on [0,b]  =  b(k+1)/(k+2)
    const key = `$${frac(b * (k + 1), k + 2)}$`;
    return {
      prompt: `Find $\\bar{x}$ for the region under $y=x^{${k}}$ on $[0,${b}]$.`,
      choices: [
        { t: key, ok: true },
        ...choose(key, [
          { t: `$${frac(b, 2)}$`, why: `That is the midpoint of the interval. It would be correct only if the region were symmetric about it — but more area sits toward $x=${b}$, so $\\bar x$ is pulled to the right.` },
          { t: `$${frac(b * (k + 2), k + 1)}$`, why: `Inverted. $\\bar x = \\frac{M_y}{A}$ where $M_y=\\int_0^{${b}}x\\cdot x^{${k}}dx$ — the moment goes on **top**.` },
          { t: `$${frac(b ** (k + 2), k + 2)}$`, why: 'That is the moment $M_y$ alone. You still have to divide by the area $A$.' },
          { t: `$${b}$`, why: `That is the right edge of the region. The centroid always lies strictly inside.` },
        ]),
      ],
      steps: [
        `Area: $A=\\displaystyle\\int_0^{${b}}x^{${k}}dx = \\dfrac{${b}^{${k + 1}}}{${k + 1}}$.`,
        `Moment about the $y$-axis: $M_y=\\displaystyle\\int_0^{${b}} x\\cdot x^{${k}}dx = \\dfrac{${b}^{${k + 2}}}{${k + 2}}$.`,
        `$\\bar x = \\dfrac{M_y}{A} = \\dfrac{${b}^{${k + 2}}/${k + 2}}{${b}^{${k + 1}}/${k + 1}} = \\dfrac{${b}(${k + 1})}{${k + 2}}$`,
        `$= ${frac(b * (k + 1), k + 2)}$ — to the right of the midpoint $${frac(b, 2)}$, as expected since the region widens toward $x=${b}$.`,
      ],
      recall: '$\\bar x = \\frac{1}{A}\\int x\\,f(x)\\,dx$. Sanity-check the answer against the picture: it must land where the area balances.',
      viz: {
        kind: 'area', xmin: -0.3, xmax: b * 1.15, a: 0, b,
        top: x => Math.pow(x, k), topLabel: `y = x^${k}`,
        vlines: [{ x: b * (k + 1) / (k + 2), label: 'x̄', color: 'var(--coral)' }, { x: b / 2, label: 'midpoint', color: 'var(--ink-3)' }],
        cap: 'The centroid (red) sits to the **right** of the midpoint because the region is heavier on that side. Any answer at or left of the midpoint contradicts the picture.',
      },
    };
  },
});

export const applications = { unit: 'applications', problems: P, generators: G };
