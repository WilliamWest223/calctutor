// ---------------------------------------------------------------
// bank/primers.js — a short orientation card per topic.
// Shown before drilling a topic you have not seen, and available
// any time from the topic row. Deliberately terse: the idea, the
// moves, and the trap. Not a textbook.
// ---------------------------------------------------------------

const P = {};
const add = (unit, topic, idea, moves, watch) => { P[`${unit}/${topic}`] = { idea, moves, watch }; };

// ---- PRE ----
add('precalc', 'Exponent & Radical Rules',
  'Exponents record repeated multiplication, so every rule is about combining or splitting those copies.',
  ['Multiply → add exponents; divide → subtract; power of a power → multiply.', 'Negative exponent = reciprocal. Fractional exponent = root.', 'Convert every root to an exponent before integrating.'],
  '$\\sqrt{a+b}\\ne\\sqrt a+\\sqrt b$. Roots and powers distribute over products only, never over sums.');

add('precalc', 'Factoring & Polynomial Division',
  'Factoring turns a sum into a product, which is the only form you are allowed to cancel or split.',
  ['Difference of squares always factors; a sum of squares never does (over the reals).', 'SOAP for cubes: Same, Opposite, Always Positive.', 'If the numerator degree ≥ denominator degree, do long division first.'],
  'Partial fractions silently requires a proper fraction. Check degrees before you set up.');

add('precalc', 'Rational Expressions',
  'A rational expression is a fraction of polynomials; the rules are the fraction rules you already know.',
  ['Same denominator → add numerators. Different → find the LCD.', 'Split $\\frac{a+b}{c}$ into $\\frac ac+\\frac bc$ — this often makes an integral trivial.'],
  'You may cancel **factors**, never **terms**. $\\frac{x^{2}+4}{x^{2}}\\ne4$.');

add('precalc', 'Completing the Square',
  'Rewrites any quadratic as a perfect square plus a constant, which exposes its shape.',
  ['Half the middle coefficient goes inside the square.', 'Subtract the square of that from the constant.'],
  'It is how an unfactorable denominator becomes an arctangent: $x^{2}+6x+13=(x+3)^{2}+4$.');

add('precalc', 'Logarithm & Exponential Rules',
  'Logs convert multiplication into addition. Every rule acts on the **argument**.',
  ['$\\ln(ab)=\\ln a+\\ln b$, $\\ln\\frac ab=\\ln a-\\ln b$, $\\ln a^{b}=b\\ln a$.', '$e$ and $\\ln$ undo each other — use that to solve for a variable in an exponent.'],
  'There is no rule for $\\ln(a+b)$. If you find yourself splitting a sum inside a log, stop.');

add('precalc', 'Unit Circle & Exact Values',
  'Every exact trig value comes from two triangles (30-60-90 and 45-45-90) plus a quadrant sign.',
  ['Cosine is the $x$-coordinate, sine is the $y$-coordinate.', 'ASTC: All, Sine, Tangent, Cosine positive in quadrants I–IV.'],
  'These show up as limits of integration after a trig substitution — knowing them cold is pure speed.');

add('precalc', 'Trig Identities',
  'One identity ($\\sin^2+\\cos^2=1$) generates almost all the others by dividing or rearranging.',
  ['Divide by $\\cos^{2}$ → $1+\\tan^{2}=\\sec^{2}$ (powers the $\\tan$ substitution).', 'Half-angle formulas kill even powers: $\\sin^{2}x=\\frac{1-\\cos2x}{2}$.'],
  'Sine gets the **minus** in the half-angle formula. Check with $x=0$ every single time.');

add('precalc', 'Inverse Trig Values',
  'Inverse trig functions are only invertible because their outputs are restricted to one branch.',
  ['$\\sin^{-1}\\in[-\\frac\\pi2,\\frac\\pi2]$, $\\cos^{-1}\\in[0,\\pi]$, $\\tan^{-1}\\in(-\\frac\\pi2,\\frac\\pi2)$.', 'Always evaluate inside-out.'],
  '$\\sin^{-1}(\\sin\\theta)\\ne\\theta$ unless $\\theta$ already lies in the restricted range.');

add('precalc', 'Function Transformations & Domain',
  'The domain is the set of inputs that do not break anything; check the argument, not the variable.',
  ['$\\sqrt{\\square}$ needs $\\square\\ge0$; $\\ln(\\square)$ needs $\\square>0$; $\\frac1\\square$ needs $\\square\\ne0$.'],
  'Domain endpoints are exactly where integrals turn improper — that is why this matters here.');

add('precalc', 'Geometry Formulas',
  'You can rederive all of these with the disk method, so treat them as sanity checks rather than memory.',
  ['Areas are quadratic in length; volumes are cubic. Dimension-check first.', 'Cone = ⅓ of its cylinder. Sphere = ⅔ of its cylinder.'],
  'Mixing up $\\pi r^{2}$ (area) and $2\\pi r$ (circumference) breaks every surface-area problem.');

add('precalc', 'Summation Notation',
  'Sigma is just an instruction to add, with an index that walks a range.',
  ['$\\sum i=\\frac{n(n+1)}{2}$, $\\sum i^{2}=\\frac{n(n+1)(2n+1)}{6}$.', 'To shift the start down by $k$, replace $n$ with $n+k$ inside.'],
  'Index shifts are where series problems quietly go wrong. Check that the first term is unchanged.');

add('precalc', 'Inequalities & Sign Charts',
  'Absolute-value inequalities describe distance, which is why they produce intervals.',
  ['$|x-c|<R$ → one interval $(c-R,c+R)$.', '$|x-c|>R$ → two rays.', 'For rational inequalities, mark the zeros and test each region.'],
  'This is literally the structure of a radius of convergence — same algebra, new name.');

// ---- 00 ----
add('foundations', 'Limits & Indeterminate Forms',
  'A limit describes where a function is heading, which need not be where it lands.',
  ['Substitute first. If you get a number, that is the answer.', 'Only $\\frac00$ and $\\frac\\infty\\infty$ admit L\'Hôpital directly.'],
  '$0/0$ is not $0$ and not $1$ — it carries no value until you resolve it.');

add('foundations', 'Derivative Rules',
  'Differentiation is mechanical once you can name the structure: product, quotient, or composition.',
  ['Product: $u\'v+uv\'$ (a sum, not a product of derivatives).', 'Quotient: low d-high minus high d-low, over the square of the low.'],
  'Reaching for the wrong rule is more common than executing one badly. Name the structure first.');

add('foundations', 'Chain Rule & Implicit',
  'The chain rule is the tax you pay whenever the inside is not plain $x$.',
  ['$\\frac{d}{dx}f(g(x))=f\'(g(x))g\'(x)$ — the inside stays intact and you multiply by its derivative.', 'Implicit: every $y$ you differentiate produces a $\\frac{dy}{dx}$.'],
  'Never substitute $u\'$ *for* $u$ — you multiply by it.');

add('foundations', "L'Hôpital's Rule",
  'Differentiating numerator and denominator separately can resolve an indeterminate ratio.',
  ['Verify the form is $\\frac00$ or $\\frac\\infty\\infty$ before you use it.', 'Other forms ($0\\cdot\\infty$, $\\infty-\\infty$, $1^{\\infty}$) must be rewritten as a quotient first.'],
  'Applied to a determinate form it produces a confident wrong answer. Check the form.');

add('foundations', 'Antiderivatives',
  'An antiderivative is a function whose derivative is the integrand — so you can always check by differentiating.',
  ['Raise the power, divide by the new power. $n=-1$ is the exception and gives $\\ln|x|$.', 'Dividing by an inner coefficient undoes the chain rule.'],
  'Differentiate your answer. It costs five seconds and catches every sign slip.');

add('foundations', 'FTC & Definite Integrals',
  'The two parts of the FTC connect accumulation and rate — they are why integration is computable at all.',
  ['Part 1: $\\frac{d}{dx}\\int_a^{u(x)}f = f(u(x))u\'(x)$.', 'Part 2: $\\int_a^b f=F(b)-F(a)$.'],
  'Part 2 requires $f$ continuous on the whole closed interval. Interior singularities are easy to miss.');

add('foundations', 'u-Substitution',
  'Substitution reverses the chain rule: choose $u$ so the rest of the integrand is $du$.',
  ['Look for a function and (a multiple of) its derivative.', 'Change the limits when you change the variable and you never substitute back.'],
  'The factor absorbed into $du$ cannot reappear in the answer.');

add('foundations', 'Inverse Trig, Log & Exp',
  'A small family of integrals you recognize rather than derive.',
  ['Sum of squares → arctangent (with $\\frac1a$).', 'Difference under a radical → arcsine (no $\\frac1a$).'],
  'Memorize the pair together, or the $\\frac1a$ lands on the wrong one.');

add('foundations', 'Hyperbolic Functions',
  'Built from $e^{x}$ and $e^{-x}$; they mirror trig identities with some signs changed.',
  ['$(\\sinh)\'=\\cosh$ and $(\\cosh)\'=\\sinh$ — both positive.', '$\\cosh^{2}-\\sinh^{2}=1$.'],
  'Importing the minus sign from $(\\cos)\'=-\\sin$ is the standard error.');

// ---- 01 ----
add('techniques', 'Linear u-Substitution',
  'When the inside is linear ($ax+b$), the substitution is so mechanical you should never write it down.',
  ['Integrate the outer function as usual, then divide by the coefficient of $x$.', 'Works for $\\sin(ax+b)$, $e^{ax+b}$, $(ax+b)^{n}$, $\\frac{1}{ax+b}$, $\\sec^{2}(ax+b)$ — anything with a linear inside.', 'Recognising which integrals are *not* linear is half the skill.'],
  'A non-linear inside ($x^{2}+1$, $\\ln x$, $\\cos x$) needs a written-out substitution. Dr. McWhorter\'s handout is full of near-misses designed to catch exactly this.');

add('techniques', 'Tabular & Looping Parts',
  'Two shortcuts for repeated integration by parts, depending on whether the derivative column ever hits zero.',
  ['**Tabular**: derivatives down the left until $0$, antiderivatives down the right, pair diagonally, alternate $+,-,+,-$.', '**Looping**: neither factor dies, the original integral reappears — move it to the other side and solve algebraically.', 'The "rule of 7" box is the same idea for a single application.'],
  'In a looping integral you must keep the *same* choice of $u$ and $dv$ both times. Swapping them collapses everything to $0=0$.');

add('techniques', 'Product-to-Sum Integrals',
  'When sine and cosine have different arguments, no substitution works — convert the product into a sum first.',
  ['$\\sin\\theta\\cos\\phi=\\frac{\\sin(\\theta+\\phi)+\\sin(\\theta-\\phi)}{2}$', '$\\cos\\theta\\cos\\phi=\\frac{\\cos(\\theta-\\phi)+\\cos(\\theta+\\phi)}{2}$', '$\\sin\\theta\\sin\\phi=\\frac{\\cos(\\theta-\\phi)-\\cos(\\theta+\\phi)}{2}$'],
  'Every term inherits the $\\frac12$, and each $\\int\\sin(kx)$ contributes its own $\\frac1k$. Two easy places to drop a factor.');

add('techniques', 'Integration by Parts',
  'Trades one integral for another, ideally simpler, one. Comes straight from the product rule.',
  ['$\\int u\\,dv=uv-\\int v\\,du$.', 'LIATE orders candidates for $u$.', 'If the original integral returns, solve for it algebraically.'],
  'Choosing a $dv$ you cannot integrate makes things worse, not better.');

add('techniques', 'Trigonometric Integrals',
  'Identities convert powers of trig functions into something substitutable.',
  ['Odd power → peel one factor for $du$.', 'All even → half-angle formulas.', '$\\tan^{m}\\sec^{n}$: save $\\sec^{2}$ for $du$ when $n$ is even.'],
  'Applying the power rule to $\\sin^{2}x$ requires a $\\cos x$ that is not there.');

add('techniques', 'Trigonometric Substitution',
  'Replaces $x$ with a trig function so a Pythagorean identity collapses the radical.',
  ['$a^{2}-x^{2}\\to a\\sin\\theta$; $a^{2}+x^{2}\\to a\\tan\\theta$; $x^{2}-a^{2}\\to a\\sec\\theta$.', 'Draw the triangle immediately — you need it to convert back.'],
  'An **odd** power of $x$ beside the radical usually means a plain $u$-sub works and this is overkill.');

add('techniques', 'Partial Fractions',
  'Splits one complicated rational function into several simple ones you can integrate on sight.',
  ['Repeated linear factor → one term per power.', 'Irreducible quadratic → a linear numerator $Bx+C$.', 'Cover-up method reads off coefficients fast.'],
  'Unknown count must equal the denominator degree. And the fraction must be proper.');

add('techniques', 'Strategy for Integration',
  'Most of the difficulty in Calc II is recognition, not execution.',
  ['Order: simplify → $u$-sub → parts → trig identity/substitution → partial fractions.', 'Always scan for a $u$-substitution first.'],
  'Reaching for trig substitution when a one-line $u$-sub would do costs you the whole question on time.');

add('techniques', 'Numerical Integration',
  'When no antiderivative exists, approximate — and bound the error.',
  ['Trapezoid: weights $1,2,2,\\dots,2,1$ over $\\frac{\\Delta x}{2}$.', 'Simpson: $1,4,2,4,\\dots,4,1$ over $\\frac{\\Delta x}{3}$, $n$ even.'],
  'Trapezoid error scales as $n^{-2}$; Simpson as $n^{-4}$. Simpson is exact for cubics.');

add('techniques', 'Improper Integrals',
  'An integral is improper if the interval is infinite or the integrand blows up. Always rewrite as a limit.',
  ['Split at every singularity and test each piece.', 'At $\\infty$: $p>1$ converges. At $0$: $p<1$ converges.'],
  'A singularity **inside** the interval invalidates the FTC. That is how you get impossible negative areas.');

// ---- 02 ----
add('applications', 'Area Between Curves',
  'Integrate the length of a representative slice.',
  ['Vertical slices: $\\int(\\text{top}-\\text{bottom})dx$.', 'Horizontal slices: $\\int(\\text{right}-\\text{left})dy$.'],
  'Pick the direction where one pair of boundaries works for the whole region — otherwise you need two integrals.');

add('applications', 'Volumes: Disks & Washers',
  'Slice perpendicular to the axis; each slice is a circle or an annulus.',
  ['$V=\\pi\\int(R^{2}-r^{2})$.', 'Radius = distance from the axis to the curve, so an offset axis changes everything.'],
  '$(R-r)^{2}\\ne R^{2}-r^{2}$. Square each radius first.');

add('applications', 'Volumes: Shells',
  'Slice parallel to the axis; each slice sweeps a cylindrical shell.',
  ['$V=2\\pi\\int(\\text{radius})(\\text{height})\\,d(\\text{thickness})$.'],
  'Shells never square anything. If you are squaring, you meant washers.');

add('applications', 'Arc Length',
  'Pythagoras, integrated: $ds=\\sqrt{dx^{2}+dy^{2}}$.',
  ['$L=\\int\\sqrt{1+(f\')^{2}}\\,dx$.', 'Check on a straight line — you should recover the distance formula.'],
  'It is the **derivative** inside the radical, not the function. Sliding a curve upward cannot change its length.');

add('applications', 'Surface Area',
  'A band of surface is a circumference times a slant width.',
  ['$S=\\int 2\\pi r\\,ds$, with $ds$ the arc-length element.'],
  'Volume integrates against $dx$; surface integrates against $ds$. Swapping them is the classic error.');

add('applications', 'Work',
  'Work is force times distance, integrated because one of them varies.',
  ['Springs: $F=kx$, so $W=\\frac{k}{2}(b^{2}-a^{2})$.', 'Pumping: weight of a slice × the distance **that slice** travels.'],
  'The distance is rarely constant. Ask "how far does *this* piece move?" for every slice.');

add('applications', 'Average Value',
  'The height of the rectangle with the same area over the same interval.',
  ['$f_{\\text{avg}}=\\frac{1}{b-a}\\int_a^b f$.'],
  'Forgetting to divide by $b-a$ leaves you with total accumulation, not an average.');

add('applications', 'Centroids',
  'The balance point: each slice contributes its area times the coordinate of its own centre.',
  ['$\\bar x=\\frac1A\\int x f\\,dx$, $\\bar y=\\frac1A\\int\\frac{f^{2}}{2}dx$.'],
  'A vertical strip balances at its **midpoint** $\\frac f2$, which is where that $\\frac12$ comes from.');

// ---- 03 ----
add('diffeq', 'Separable Equations',
  'Get all the $y$s on one side and all the $x$s on the other, then integrate both sides.',
  ['$\\frac{dy}{h(y)}=g(x)dx$.', 'Apply the initial condition **after** integrating.'],
  'An additive constant inside a log becomes a **multiplicative** constant after exponentiating.');

add('diffeq', 'Slope Fields & Euler',
  'The equation hands you the slope at every point; a solution is a curve that follows them.',
  ['Euler: $y_{n+1}=y_n+h f(x_n,y_n)$.', 'Smaller $h$ → less error, roughly proportional to $h$.'],
  'Recompute the slope at each new point. Reusing the first slope is just a tangent line.');

add('diffeq', 'Growth & Decay',
  'When the rate is proportional to the amount, the solution is exponential.',
  ['$y\'=ky \\Rightarrow y=y_0e^{kt}$.', 'Half-life: each period multiplies by $\\frac12$, so after $n$ periods the factor is $2^{-n}$.'],
  'Decay is multiplicative, never linear. Subtracting equal amounts is the wrong model.');

add('diffeq', 'Logistic Model',
  'Exponential growth throttled by a carrying capacity.',
  ['$\\frac{dP}{dt}=kP(1-\\frac PK)$.', '$K$ is the limit; $K/2$ is where growth peaks.'],
  'Swapping $K$ and $K/2$ is the standard mistake. One is the ceiling, one is the inflection.');

add('diffeq', 'First-Order Linear',
  'Multiply by an integrating factor so the left side collapses into a single derivative.',
  ['Standard form $y\'+Py=Q$, then $\\mu=e^{\\int P\\,dx}$.', '$(\\mu y)\'=\\mu Q$, then integrate once.'],
  'Integrate $P$ **then** exponentiate — not the other way round.');

// ---- 04 ----
add('series', 'Sequences',
  'A sequence is a list; its limit describes where the terms settle.',
  ['Rational in $n$: compare degrees.', '$r^{n}\\to0$ when $|r|<1$.', 'Growth order: $\\ln n\\ll n^{p}\\ll e^{n}\\ll n!$.'],
  'The limit of the sequence is not the sum of the series. Different objects entirely.');

add('series', 'Geometric & Telescoping',
  'The two families whose exact sums you can actually write down.',
  ['Geometric: $S=\\frac{\\text{first term}}{1-r}$ for $|r|<1$.', 'Telescoping: write out $s_N$ and see what survives.'],
  'The numerator is the first term **actually present** — check where the index starts.');

add('series', 'Divergence & Integral Tests',
  'Your first and most mechanical tools.',
  ['Divergence test: $\\lim a_n\\ne0$ ⟹ diverges. That is all it can ever say.', 'Integral test needs continuous, positive, decreasing.'],
  '$a_n\\to0$ is necessary but not sufficient. The harmonic series is the counterexample to remember.');

add('series', 'p-Series & Comparison',
  'Compare an unfamiliar series to one whose behaviour you already know.',
  ['$\\sum n^{-p}$ converges iff $p>1$.', 'Smaller than convergent → converges. Bigger than divergent → diverges.'],
  'The other two combinations give you no information at all.');

add('series', 'Limit Comparison',
  'Compare leading behaviour instead of building an inequality.',
  ['Keep the dominant power on top and bottom, then subtract exponents.', 'The limit only needs to be finite and nonzero.'],
  'Using only the denominator degree is the usual slip — it is the **ratio** that matters.');

add('series', 'Alternating Series & Error',
  'Alternating signs let cancellation rescue a series that would otherwise diverge.',
  ['AST: terms positive, decreasing, tending to $0$.', 'Error $\\le b_{n+1}$, the first term you left out.'],
  'Bounding with $b_n$ instead of $b_{n+1}$ is off by one and loses the point.');

add('series', 'Ratio & Root Tests',
  'Best when terms contain factorials or $n$th powers.',
  ['$L<1$ converges absolutely, $L>1$ diverges, $L=1$ is inconclusive.', 'Expand factorials one step and cancel.'],
  'Rational functions of $n$ always give $L=1$. Do not even start.');

add('series', 'Choosing a Test',
  'Reading the shape of $a_n$ is most of the work.',
  ['Rational → limit comparison. Factorial/$n$th power → ratio. Alternating → AST. $\\ln$ → integral.', 'Check $\\lim a_n$ first; it is free.'],
  'Picking a test that cannot possibly conclude burns exam time you do not have.');

add('series', 'Power Series & Radius',
  'A power series converges on an interval centred at $c$.',
  ['Radius from the Ratio Test: $|x-c|<R$.', 'Test each endpoint separately by substituting it in.'],
  'The Ratio Test is silent exactly at the endpoints. They can behave differently from each other.');

add('series', 'Taylor & Maclaurin Series',
  'Represent a function as an infinite polynomial built from its derivatives at one point.',
  ['$c_n=\\frac{f^{(n)}(a)}{n!}$.', 'Memorize five core series and get everything else by substitution, differentiation, or integration.'],
  'Substitute into the **variable** only. The factorials stay as they are.');

add('series', 'Taylor Polynomials & Error',
  'A truncated Taylor series, plus a bound on what you threw away.',
  ['$T_n$ matches $f$ and its first $n$ derivatives at $a$.', '$|R_n|\\le\\frac{M|x-a|^{n+1}}{(n+1)!}$.'],
  'Degree $n$ means derivative $n+1$, and $M$ must bound it across the whole interval — not just at the centre.');

add('series', 'Applications of Series',
  'Series make impossible integrals and stubborn limits routine.',
  ['Integrate term by term inside the interval of convergence.', 'For $\\frac00$ limits, expand and read off the leading coefficient.'],
  'Term-by-term operations are only valid inside the radius of convergence.');

// ---- 05 ----
add('polar', 'Parametric Curves',
  'Coordinates given as functions of a parameter, so the curve can loop and cross itself.',
  ['Arc length is speed integrated over time: $\\int\\sqrt{(x\')^{2}+(y\')^{2}}dt$.'],
  'Match your differentials: if you use $\\frac{dy}{dx}$ you must integrate $dx$, not $dt$.');

add('polar', 'Parametric Calculus',
  'Slopes come from the chain rule, dividing the two velocities.',
  ['$\\frac{dy}{dx}=\\frac{dy/dt}{dx/dt}$.', 'Vertical tangent where $\\frac{dx}{dt}=0$; horizontal where $\\frac{dy}{dt}=0$.'],
  'It is a ratio of derivatives, not the derivative of a ratio.');

add('polar', 'Polar Coordinates',
  'Points located by distance and angle instead of by $x$ and $y$.',
  ['$x=r\\cos\\theta$, $y=r\\sin\\theta$.', '$r=a\\cos\\theta$ is a circle of radius $\\frac a2$ off the origin.', 'Roses: odd $k$ → $k$ petals, even $k$ → $2k$.'],
  'Watch the $\\theta$-range: many polar curves close up before $2\\pi$, and integrating too far double-counts.');

add('polar', 'Polar Area & Arc Length',
  'Polar area is built from circular sectors, not rectangles.',
  ['$A=\\frac12\\int r^{2}d\\theta$.', '$L=\\int\\sqrt{r^{2}+(r\')^{2}}\\,d\\theta$.'],
  'Both the $\\frac12$ and the square are essential — and arc length uses a different formula entirely.');

export const PRIMERS = P;

// ---- CHECK-INS ----
add('checkins', 'Method Judgment',
  'Every lecture opens with one true/false claim about a **method** — not a computation. The question is never "what is the answer" but "is this the right move, set up the right way".',
  ['Before agreeing, actually carry the method one step forward and look at what you get.',
   'Ask whether the step is *possible* (can you even find $v$?) and separately whether it is *wise*.',
   'For substitutions: does $du$ actually appear, and did the limits change?',
   'For partial fractions: is the fraction proper, and is every factor classified correctly?'],
  'A claim can be true and still be bad advice — he asks both kinds. Read whether the statement says "can be done" or "should be done".');

add('checkins', 'Series Test Logic',
  'These check whether you know what each test **concludes**, not whether you can compute a limit. Most wrong answers use a valid test to draw a conclusion it never licenses.',
  ['Divergence Test runs one way only: $\\lim a_n\\neq0$ proves divergence; $\\lim a_n=0$ proves nothing.',
   'Comparison tests need positive terms. An alternating series disqualifies them outright.',
   'Direct comparison works in two directions only: bigger-than-divergent, or smaller-than-convergent.',
   'The Integral Test transfers convergence, never the value.'],
  'A right answer with wrong reasoning scores zero here — he grades the justification, and these check-ins are where he trains you to write it.');

add('checkins', 'Power & Taylor Claims',
  'Claims about intervals of convergence, Taylor coefficients and remainders — the Exam 3 concepts, stripped of the arithmetic.',
  ['Interval of convergence is always symmetric about the centre: centre = midpoint, radius = half-width.',
   'Endpoints are a separate question from the radius, and the two ends often disagree.',
   'The remainder evaluates the next derivative at an unknown $z$ **between** $x$ and the centre — never at the centre.',
   'Re-centring a Taylor series means recomputing the coefficients from scratch.'],
  'Watch for the word "always". A Taylor series converging is not the same as it converging **to the function**.');

export const primerFor = key => P[key] || null;
