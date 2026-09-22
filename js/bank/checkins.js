// ---------------------------------------------------------------
// bank/checkins.js — Dr. McWhorter's actual in-class check-ins.
//
// Every lecture opens with a short check-in: a single true/false claim
// about method or reasoning. They are not computations — they are traps
// for the specific wrong idea he expects you to have. Transcribed from
// his published solution sets (spring25, fall25, spring26, fall26) in
// his GitHub repo, with his reasoning preserved.
//
// These are the highest-value questions in the whole app: they are
// literally the questions he asks, and the wrong answers are literally
// the misconceptions he is hunting.
// ---------------------------------------------------------------
import { choose } from '../util.js';

const P = [];
const G = [];

/** True/false check-in. `v` is the correct verdict. */
function ci(o) {
  const T = { t: 'True', ok: o.v === true };
  const F = { t: 'False', ok: o.v === false };
  (o.v ? F : T).why = o.why;
  P.push({
    id: o.id, topic: o.topic, unit: 'checkins', tf: true, diff: o.diff ?? 3,
    src: o.src,
    prompt: `**True or false?**  ${o.q}`,
    choices: [T, F],
    keyWhy: o.keyWhy,
    hints: o.hints,
    steps: o.steps,
    recall: o.recall,
    fix: o.fix,
    err: o.err,
  });
}

// =================================================================
// Method Judgment — is this the right technique, set up the right way?
// =================================================================
const MJ = 'Method Judgment';

ci({
  id: 'ci-s26-0115', topic: MJ, src: 'Check-in, Spring 2026', v: false, diff: 2,
  q: 'Making the substitution $u = x^{2}+1$ in $\\displaystyle\\int_{0}^{1}\\frac{5x}{x^{2}+1}\\,dx$ gives $\\displaystyle\\int_{0}^{1}\\frac{5}{2u}\\,du$.',
  why: 'The integrand is transformed correctly, but **the limits were left alone**. Once you substitute, $0$ and $1$ are $x$-values sitting on a $u$-integral.',
  keyWhy: 'The algebra is right and the limits are wrong. With $u=x^{2}+1$, $x=0$ gives $u=1$ and $x=1$ gives $u=2$, so the integral is $\\displaystyle\\int_{1}^{2}\\frac{5}{2u}\\,du$.',
  hints: [
    'The integrand transformed correctly. Look at everything *else* in the expression.',
    'A definite integral carries limits, and the limits belong to whatever variable is being integrated.',
    'Feed the old limits through the substitution: what is $u$ when $x=0$? When $x=1$?',
  ],
  steps: [
    '$u=x^{2}+1 \\Rightarrow du = 2x\\,dx$, so $5x\\,dx = \\tfrac52\\,du$ and the integrand becomes $\\frac{5}{2u}$ — that part is correct.',
    'Now convert the limits: $x=0 \\Rightarrow u = 0^{2}+1 = 1$, and $x=1 \\Rightarrow u = 1^{2}+1 = 2$.',
    'The correct integral is $\\displaystyle\\int_{1}^{2}\\frac{5}{2u}\\,du = \\tfrac52\\ln 2$.',
  ],
  recall: 'Change the variable, change the limits. The only alternative is to undo the substitution before evaluating.',
  fix: 'Whenever you write a new $\\int$ sign after a substitution, write the new limits at the same moment — not later.',
  err: 'limits',
});

ci({
  id: 'ci-s25-0116', topic: MJ, src: 'Check-in, Spring 2025', v: false, diff: 2,
  q: 'For $\\displaystyle\\int_{0}^{\\pi} e^{\\sin x}\\cos x\\,dx$, the substitution $u=\\sin x$ turns the integral into $\\displaystyle\\int_{0}^{\\pi} e^{u}\\,du$.',
  why: 'Same trap as always: the limits were carried over unchanged. They are $x$-values, not $u$-values.',
  keyWhy: 'With $u=\\sin x$: $x=0\\Rightarrow u=0$ and $x=\\pi\\Rightarrow u=\\sin\\pi=0$. Both limits become $0$, so the integral is $\\displaystyle\\int_{0}^{0}e^{u}\\,du = 0$.',
  hints: [
    'The substitution itself is fine. Check what happens to the endpoints.',
    'Evaluate $\\sin x$ at each limit and see where they land.',
    '$\\sin 0 = 0$ and $\\sin\\pi = 0$ — the two new limits are the same number.',
  ],
  steps: [
    '$u = \\sin x \\Rightarrow du = \\cos x\\,dx$, so the integrand is exactly $e^{u}\\,du$.',
    'Convert the limits: $x=0 \\Rightarrow u=0$; $x=\\pi \\Rightarrow u=\\sin\\pi=0$.',
    'Both limits are $0$, so $\\displaystyle\\int_{0}^{0}e^{u}\\,du = 0$ — the integral vanishes.',
  ],
  recall: 'A substitution that sends both endpoints to the same value makes the definite integral zero, no matter how ugly the integrand is.',
  fix: 'If your new limits come out equal, that is not a mistake — stop and write $0$.',
  err: 'limits',
});

ci({
  id: 'ci-f25-0821', topic: MJ, src: 'Check-in, Fall 2025', v: true, diff: 2,
  q: 'The integral $\\displaystyle\\int x\\sqrt[3]{x-2}\\,dx$ can be treated as a "shifting" integral using $u = x-2$.',
  why: 'It genuinely works. The obstacle is the loose $x$ out front, and a shift removes it: $u=x-2$ means $x=u+2$, so *everything* becomes a function of $u$.',
  keyWhy: 'Set $u = x-2$, so $x = u+2$ and $dx = du$. The integral becomes $\\displaystyle\\int (u+2)\\,u^{1/3}\\,du = \\int \\left(u^{4/3}+2u^{1/3}\\right)du$ — two power-rule terms.',
  hints: [
    'A plain $u$-substitution stalls because of the leftover $x$. What could you do with that $x$?',
    'Shifting means solving the substitution backwards and replacing the leftover $x$ too.',
    'If $u = x-2$, then $x = u+2$. Substitute that in for the loose factor.',
  ],
  steps: [
    'Let $u = x-2$, so $du = dx$ and — the key move — $x = u+2$.',
    'Rewrite everything in $u$: $\\displaystyle\\int (u+2)u^{1/3}\\,du$.',
    'Distribute: $\\displaystyle\\int\\left(u^{4/3} + 2u^{1/3}\\right)du = \\tfrac{3}{7}u^{7/3} + \\tfrac{3}{2}u^{4/3} + C$.',
    'Back-substitute: $\\tfrac{3}{7}(x-2)^{7/3} + \\tfrac{3}{2}(x-2)^{4/3} + C$.',
  ],
  recall: 'Shifting integral: when $du$ cleans up the hard factor but leaves a stray $x$, solve $u=\\dots$ for $x$ and substitute that too.',
  fix: 'A leftover $x$ after substituting is not a dead end — it is the signal to shift.',
});

ci({
  id: 'ci-f26-0820', topic: MJ, src: 'Check-in, 08/20/2026 — this semester', v: false, diff: 4,
  q: 'The integral $\\displaystyle\\int (x-1)^{2}(x+5)^{3}\\,dx$ can be computed as a "shifting" integral.',
  why: 'Shifting works when one factor is a *power of the substitution* and the leftovers turn into polynomials in $u$. Here both factors are non-matching powers, so a shift just relabels the problem.',
  keyWhy: 'There are only two shifts available. $u=x-1$ gives $\\int u^{2}(u+6)^{3}du$; $u=x+5$ gives $\\int (u-6)^{2}u^{3}du$. Both still need the product expanded, so nothing was gained. Expand directly, or use **tabular integration** — both factors differentiate to $0$.',
  hints: [
    'Try both possible shifts and look honestly at what you end up with.',
    'A shift is only a win if the resulting integral is easier than the one you started with.',
    'Neither shift removes the product. What other method handles a product where one factor differentiates away to zero?',
  ],
  steps: [
    'Shift 1: $u = x-1$, so $x = u+1$ and $x+5 = u+6$. The integral becomes $\\displaystyle\\int u^{2}(u+6)^{3}\\,du$ — still a product needing expansion.',
    'Shift 2: $u = x+5$, so $x-1 = u-6$. The integral becomes $\\displaystyle\\int (u-6)^{2}u^{3}\\,du$ — same situation.',
    'So shifting does not help. Expand: $\\displaystyle\\int\\left(x^{5}+13x^{4}+46x^{3}-10x^{2}-175x+125\\right)dx$.',
    'Or run **tabular integration** with $u=(x-1)^{2}$ and $dv=(x+5)^{3}$: the left column dies after three rows, giving $\\dfrac{(x-1)^{2}(x+5)^{4}}{4} - \\dfrac{(x-1)(x+5)^{5}}{10} + \\dfrac{(x+5)^{6}}{60} + C$.',
  ],
  recall: 'Different valid methods give antiderivatives that differ by a constant — all correct. But a shift that leaves a product behind has not simplified anything.',
  fix: 'Before committing to a shift, write down what the integral will actually look like afterwards. If it is not simpler, pick another method.',
});

ci({
  id: 'ci-f26-0825', topic: MJ, src: 'Check-in, 08/25/2026 — this semester', v: false, diff: 3,
  q: 'To integrate $\\displaystyle\\int x e^{-3x^{2}}\\,dx$, one uses LIATE to choose $u = x$ and $dv = e^{-3x^{2}}$.',
  why: 'That choice requires you to integrate $e^{-3x^{2}}$ to get $v$ — and $e^{-x^{2}}$ **has no elementary antiderivative**. LIATE is for when parts is the right method; this is a plain $u$-substitution.',
  keyWhy: 'The $x$ out front is exactly $du$ up to a constant. With $u=-3x^{2}$, $du=-6x\\,dx$: $\\displaystyle\\int xe^{-3x^{2}}dx = -\\tfrac16\\int e^{u}du = -\\dfrac{e^{-3x^{2}}}{6}+C$.',
  hints: [
    'Before reaching for LIATE, ask whether parts is even the right tool here.',
    'Check that you can actually *find* $v$. What is $\\int e^{-3x^{2}}dx$?',
    'Look at the $x$ in front — is it the derivative of something inside the exponent?',
  ],
  steps: [
    'LIATE only tells you how to *split* an integral you have already decided to do by parts. It does not tell you that parts is correct.',
    'That split needs $v = \\int e^{-3x^{2}}dx$, which is not an elementary function — the method is dead on arrival.',
    'Instead notice $\\frac{d}{dx}(-3x^{2}) = -6x$, and the integrand carries an $x$. Let $u=-3x^{2}$, $du=-6x\\,dx$.',
    '$\\displaystyle\\int xe^{-3x^{2}}dx = -\\tfrac16\\int e^{u}\\,du = -\\tfrac16 e^{u}+C = -\\dfrac{e^{-3x^{2}}}{6}+C$. Check by differentiating: $-\\tfrac16 e^{-3x^{2}}\\cdot(-6x) = xe^{-3x^{2}}$.',
  ],
  recall: 'Always test $u$-substitution first. Parts is for products that do *not* collapse under a substitution.',
  fix: 'Before applying LIATE, confirm the $dv$ half is something you can actually integrate.',
});

ci({
  id: 'ci-s26-0120', topic: MJ, src: 'Check-in, Spring 2026', v: false, diff: 2,
  q: 'We should integrate $\\displaystyle\\int x e^{x^{2}}\\,dx$ using integration by parts.',
  why: 'Parts would send you around in circles — you cannot integrate $e^{x^{2}}$. The $x$ in front is the giveaway that this is a substitution.',
  keyWhy: '$u = x^{2}$ gives $du = 2x\\,dx$, and the integrand hands you that $x$: $\\displaystyle\\int xe^{x^{2}}dx = \\tfrac12\\int e^{u}du = \\dfrac{e^{x^{2}}}{2}+C$.',
  hints: [
    'A product does not automatically mean integration by parts.',
    'Is one factor (up to a constant) the derivative of the inside of the other?',
    '$\\frac{d}{dx}\\left(x^{2}\\right) = 2x$, and there is an $x$ sitting right there.',
  ],
  steps: [
    'Let $u = x^{2}$, so $du = 2x\\,dx$ and $x\\,dx = \\tfrac12 du$.',
    '$\\displaystyle\\int xe^{x^{2}}dx = \\tfrac12\\int e^{u}du = \\tfrac12 e^{u}+C$.',
    'Back-substitute: $\\dfrac{e^{x^{2}}}{2}+C$.',
  ],
  recall: 'Products where one factor is the inner derivative are substitutions, not parts.',
  fix: 'Scan for "is one factor the derivative of the other\'s inside?" before anything else.',
});

ci({
  id: 'ci-f25-0826', topic: MJ, src: 'Check-in, Fall 2025', v: true, diff: 2,
  q: 'Using integration by parts on $\\displaystyle\\int x\\tan^{-1}(x)\\,dx$, one chooses $u = \\tan^{-1}x$ and $dv = x$.',
  why: 'That is exactly what LIATE prescribes. **I** (inverse trig) comes before **A** (algebraic), so $\\tan^{-1}x$ is $u$ and the $x$ is $dv$.',
  keyWhy: 'LIATE ranks Logarithmic, Inverse trig, Algebraic, Trigonometric, Exponential. $\\tan^{-1}x$ is inverse trig, $x$ is algebraic, so $u = \\tan^{-1}x$ — which also works because $\\tan^{-1}x$ has a clean derivative but a nasty integral.',
  hints: [
    'Run the two factors through LIATE and see which letter comes first.',
    'The real question behind LIATE: which factor gets *better* when differentiated?',
    '$\\tan^{-1}x$ differentiates to the tidy $\\frac{1}{1+x^{2}}$; integrating it is much worse.',
  ],
  steps: [
    'LIATE order: **L**og, **I**nverse trig, **A**lgebraic, **T**rig, **E**xponential — earlier letter becomes $u$.',
    '$\\tan^{-1}x$ is I, $x$ is A, so $u = \\tan^{-1}x$ and $dv = x\\,dx$.',
    'Then $du = \\dfrac{dx}{1+x^{2}}$ and $v = \\dfrac{x^{2}}{2}$.',
    '$\\displaystyle\\int x\\tan^{-1}x\\,dx = \\dfrac{x^{2}\\tan^{-1}x}{2} - \\tfrac12\\int\\dfrac{x^{2}}{1+x^{2}}dx = \\dfrac{x^{2}\\tan^{-1}x}{2} - \\dfrac{x}{2} + \\dfrac{\\tan^{-1}x}{2}+C$.',
  ],
  recall: 'LIATE: the earlier letter becomes $u$. The point is to differentiate the factor that improves and integrate the one that survives.',
});

ci({
  id: 'ci-s25-0121', topic: MJ, src: 'Check-in, Spring 2025', v: true, diff: 3,
  q: 'To integrate $\\displaystyle\\int \\text{arccot}\\,\\theta\\,d\\theta$, one can use integration by parts with $u = \\text{arccot}\\,\\theta$ and $dv = 1$.',
  why: 'This is the standard trick for a lone inverse function. Taking $dv = 1\\,d\\theta$ manufactures the second factor you need.',
  keyWhy: 'There is only one factor, so invent one: $dv = 1\\,d\\theta$ gives $v = \\theta$, and $u = \\text{arccot}\\,\\theta$ gives $du = \\dfrac{-d\\theta}{1+\\theta^{2}}$. Then $\\displaystyle\\int\\text{arccot}\\,\\theta\\,d\\theta = \\theta\\,\\text{arccot}\\,\\theta + \\tfrac12\\ln(1+\\theta^{2})+C$.',
  hints: [
    'There is only one factor in the integrand. Can integration by parts still apply?',
    'Nothing stops you from writing the integrand as (itself) $\\times\\,1$.',
    'Take $dv = 1\\,d\\theta$, so $v = \\theta$. This is how $\\int\\ln x\\,dx$ works too.',
  ],
  steps: [
    'Write $\\text{arccot}\\,\\theta = \\text{arccot}\\,\\theta\\cdot 1$, and take $u = \\text{arccot}\\,\\theta$, $dv = 1\\,d\\theta$.',
    '$du = \\dfrac{-1}{1+\\theta^{2}}d\\theta$ and $v = \\theta$.',
    '$\\displaystyle\\int \\text{arccot}\\,\\theta\\,d\\theta = \\theta\\,\\text{arccot}\\,\\theta + \\int\\dfrac{\\theta}{1+\\theta^{2}}d\\theta$.',
    'The remaining integral is a $u$-sub: $\\tfrac12\\ln(1+\\theta^{2})$. Answer: $\\theta\\,\\text{arccot}\\,\\theta + \\tfrac12\\ln(1+\\theta^{2})+C$.',
  ],
  recall: 'A lone $\\ln$ or inverse-trig function is integrated by parts against $dv=1$.',
  fix: 'One factor is never a reason to rule out parts — supply the $1$ yourself.',
});

ci({
  id: 'ci-f25-0828', topic: MJ, src: 'Check-in, Fall 2025', v: true, diff: 3,
  q: 'The integral $\\displaystyle\\int e^{x}\\sin(3x)\\,dx$ can be treated as an integration-by-parts "looping" integral.',
  why: 'It is the classic loop. Exponential times sine: parts twice returns the original integral, and you solve for it algebraically.',
  keyWhy: 'Neither factor ever differentiates to $0$, so the table never terminates — but after two rounds the original integral reappears with a coefficient. Move it to the left side and divide.',
  hints: [
    'Ask what happens if you apply parts twice.',
    'Neither $e^{x}$ nor $\\sin(3x)$ ever dies under differentiation — so the process does not terminate.',
    'When the original integral reappears, treat it as an unknown and solve for it.',
  ],
  steps: [
    'Take $u = \\sin(3x)$, $dv = e^{x}dx$. One round gives $e^{x}\\sin(3x) - 3\\displaystyle\\int e^{x}\\cos(3x)dx$.',
    'A second round on that integral gives $e^{x}\\sin(3x) - 3e^{x}\\cos(3x) - 9\\displaystyle\\int e^{x}\\sin(3x)\\,dx$.',
    'Call the original $I$. Then $I = e^{x}\\sin(3x) - 3e^{x}\\cos(3x) - 9I$, so $10I = e^{x}\\left(\\sin 3x - 3\\cos 3x\\right)$.',
    '$I = \\dfrac{e^{x}\\left(\\sin 3x - 3\\cos 3x\\right)}{10}+C$.',
  ],
  recall: 'Looping integral: $e^{ax}\\sin(bx)$ or $e^{ax}\\cos(bx)$. Parts twice, then solve for the integral like a variable.',
  fix: 'When the same integral comes back, that is success, not failure — name it $I$ and do algebra.',
});

ci({
  id: 'ci-s25-0123', topic: MJ, src: 'Check-in, Spring 2025', v: true, diff: 2,
  q: 'The integral $\\displaystyle\\int e^{x/2}\\sin(3x)\\,dx$ is a "looping" integral.',
  why: 'Same shape as $e^{x}\\sin(3x)$ — the fractional exponent changes the arithmetic, not the method.',
  keyWhy: 'Exponential $\\times$ trig always loops: neither factor terminates, so two rounds of parts regenerate the original integral with a coefficient you can solve for.',
  hints: [
    'The exponent being $x/2$ instead of $x$ does not change the *type* of integral.',
    'Does either factor ever differentiate down to zero?',
    'No — so parts cannot terminate. It must loop.',
  ],
  steps: [
    'Both $e^{x/2}$ and $\\sin(3x)$ reproduce themselves (up to constants) under differentiation and integration.',
    'Two rounds of parts return a multiple of the original integral $I$.',
    'Solve the resulting linear equation for $I$.',
    'Result: $\\displaystyle\\int e^{x/2}\\sin 3x\\,dx = \\dfrac{4e^{x/2}\\left(\\tfrac12\\sin 3x - 3\\cos 3x\\right)}{37}+C$.',
  ],
  recall: 'Exponential $\\times$ sine or cosine, any coefficients: always a loop.',
});

ci({
  id: 'ci-f26-0827', topic: MJ, src: 'Check-in, 08/27/2026 — this semester', v: true, diff: 3,
  q: 'The integral $\\displaystyle\\int \\sin(2x)\\cos(3x)\\,dx$ can be treated as a "looping integral."',
  why: 'It can. Trig $\\times$ trig loops just like exponential $\\times$ trig — neither factor differentiates away, so parts twice regenerates the original.',
  keyWhy: 'Two rounds of parts give $I = \\tfrac13\\sin 2x\\sin 3x + \\tfrac29\\cos 2x\\cos 3x + \\tfrac49 I$, so $\\tfrac59 I$ equals the boundary terms and $I = \\tfrac15\\left(3\\sin 2x\\sin 3x + 2\\cos 2x\\cos 3x\\right)+C$. The **product-to-sum** identity is faster: $\\sin A\\cos B = \\tfrac12\\left[\\sin(A+B)+\\sin(A-B)\\right]$ turns it into $\\tfrac{1}{10}\\left(5\\cos x - \\cos 5x\\right)+C$.',
  hints: [
    'Looping is not only for exponentials — ask whether either factor ever dies.',
    'Sines and cosines cycle forever under differentiation, so parts cannot terminate.',
    'It loops. But there is also a one-line identity for $\\sin A\\cos B$ worth knowing.',
  ],
  steps: [
    'Take $u=\\sin 2x$, $dv=\\cos 3x\\,dx$. Two rounds of parts bring back $\\tfrac49\\displaystyle\\int\\sin 2x\\cos 3x\\,dx$.',
    'So $\\tfrac59 I = \\tfrac13\\sin 2x\\sin 3x + \\tfrac29\\cos 2x\\cos 3x$, giving $I = \\tfrac15\\left(3\\sin 2x\\sin 3x + 2\\cos 2x\\cos 3x\\right)+C$.',
    'Faster route — product-to-sum: $\\sin 2x\\cos 3x = \\tfrac12\\left[\\sin 5x + \\sin(-x)\\right] = \\tfrac12\\left[\\sin 5x - \\sin x\\right]$.',
    'Integrate: $\\tfrac12\\left(-\\tfrac{\\cos 5x}{5} + \\cos x\\right)+C = \\tfrac{1}{10}\\left(5\\cos x - \\cos 5x\\right)+C$.',
  ],
  recall: 'Both answers are right and differ by a constant. Product-to-sum is the shortcut; looping is the fallback.',
  fix: 'For $\\sin(ax)\\cos(bx)$ with $a\\neq b$, reach for product-to-sum first.',
});

ci({
  id: 'ci-s26-0122', topic: MJ, src: 'Check-in, Spring 2026', v: true, diff: 2,
  q: 'The integral $\\displaystyle\\int x^{2}3^{x}\\,dx$ can be integrated using tabular integration.',
  why: 'Yes — $x^{2}$ differentiates to $0$ in three steps, and $3^{x}$ integrates forever. That is exactly the tabular setup.',
  keyWhy: 'Tabular integration needs one factor that differentiates to $0$ (here $x^{2}$) and one you can integrate repeatedly (here $3^{x}$, whose antiderivative is $3^{x}/\\ln 3$).',
  hints: [
    'Tabular integration needs one column to terminate. Which factor could do that?',
    '$x^{2}\\to 2x\\to 2\\to 0$. Three differentiations and it is gone.',
    'And $3^{x}$ integrates to $3^{x}/\\ln 3$ every time — the other column never runs out.',
  ],
  steps: [
    'Left column ($u$, differentiate): $x^{2},\\;2x,\\;2,\\;0$.',
    'Right column ($dv$, integrate): $3^{x},\\;\\dfrac{3^{x}}{\\ln 3},\\;\\dfrac{3^{x}}{(\\ln 3)^{2}},\\;\\dfrac{3^{x}}{(\\ln 3)^{3}}$.',
    'Multiply diagonally with alternating signs $+,-,+$:',
    '$\\dfrac{x^{2}3^{x}}{\\ln 3} - \\dfrac{2x\\,3^{x}}{(\\ln 3)^{2}} + \\dfrac{2\\cdot 3^{x}}{(\\ln 3)^{3}}+C$.',
  ],
  recall: 'Tabular integration: polynomial $\\times$ (something you can integrate forever). Alternate $+,-,+,-$ down the diagonals.',
  fix: 'Remember $\\int a^{x}dx = \\dfrac{a^{x}}{\\ln a}$ — not $a^{x}$.',
});

ci({
  id: 'ci-f25-0902', topic: MJ, src: 'Check-in, Fall 2025', v: true, diff: 3,
  q: 'To integrate $\\displaystyle\\int \\cot^{2}x\\csc^{2}x\\,dx$ as a trigonometric integral, one could substitute $u = \\cot x$.',
  why: 'It works cleanly: $\\frac{d}{dx}\\cot x = -\\csc^{2}x$, and there is exactly one $\\csc^{2}x$ available to be $du$.',
  keyWhy: 'With $u = \\cot x$, $du = -\\csc^{2}x\\,dx$. The integrand is $\\cot^{2}x\\cdot\\csc^{2}x\\,dx = -u^{2}\\,du$, giving $-\\dfrac{\\cot^{3}x}{3}+C$.',
  hints: [
    'Count the factors. How many $\\csc^{2}x$ are there, and how many does $du$ need?',
    '$\\frac{d}{dx}\\cot x = -\\csc^{2}x$ — exactly one factor of $\\csc^{2}x$.',
    'The integrand has precisely that one factor to spare, and the rest is a power of $\\cot x$.',
  ],
  steps: [
    'Let $u = \\cot x$, so $du = -\\csc^{2}x\\,dx$, i.e. $\\csc^{2}x\\,dx = -du$.',
    'The integrand becomes $u^{2}\\cdot(-du) = -u^{2}\\,du$.',
    '$-\\displaystyle\\int u^{2}du = -\\dfrac{u^{3}}{3}+C = -\\dfrac{\\cot^{3}x}{3}+C$.',
  ],
  recall: 'For $\\cot^{m}x\\csc^{n}x$ with $n$ even, peel off one $\\csc^{2}x$ for $du$ and let $u=\\cot x$.',
});

ci({
  id: 'ci-s25-0128', topic: MJ, src: 'Check-in, Spring 2025', v: true, diff: 3,
  q: 'To integrate $\\displaystyle\\int \\cos^{8}\\theta\\sin^{5}\\theta\\,d\\theta$, one should choose $u = \\cos\\theta$.',
  why: 'Correct. The sine power is **odd**, so you can split off one $\\sin\\theta$ for $du$ and convert the remaining even power with the Pythagorean identity.',
  keyWhy: 'Odd power of sine $\\Rightarrow$ let $u=\\cos\\theta$. Peel one $\\sin\\theta$ off for $du=-\\sin\\theta\\,d\\theta$; the remaining $\\sin^{4}\\theta = (1-\\cos^{2}\\theta)^{2}$ becomes a polynomial in $u$.',
  hints: [
    'One of the two powers is odd. Which one, and what does that tell you?',
    'The odd power is the one you break a single factor off of — and $u$ is the *other* function.',
    '$\\sin^{5}\\theta$ is odd, so $u=\\cos\\theta$ and $\\sin^{4}\\theta=(1-\\cos^{2}\\theta)^{2}$.',
  ],
  steps: [
    'Split: $\\sin^{5}\\theta = \\sin^{4}\\theta\\cdot\\sin\\theta = (1-\\cos^{2}\\theta)^{2}\\sin\\theta$.',
    'Let $u = \\cos\\theta$, so $du = -\\sin\\theta\\,d\\theta$.',
    'The integral becomes $-\\displaystyle\\int u^{8}(1-u^{2})^{2}du = -\\int\\left(u^{8}-2u^{10}+u^{12}\\right)du$.',
    '$= -\\dfrac{u^{9}}{9} + \\dfrac{2u^{11}}{11} - \\dfrac{u^{13}}{13}+C$ with $u=\\cos\\theta$.',
  ],
  recall: 'Odd sine power $\\Rightarrow u=\\cos$. Odd cosine power $\\Rightarrow u=\\sin$. Both even $\\Rightarrow$ half-angle identities.',
});

ci({
  id: 'ci-s26-0127', topic: MJ, src: 'Check-in, Spring 2026', v: false, diff: 4,
  q: 'To integrate $\\displaystyle\\int \\tan^{2}x\\sec x\\,dx$, one chooses $u = \\sec x$.',
  why: 'With $u=\\sec x$ you need $du = \\sec x\\tan x\\,dx$. Pulling that out leaves a bare $\\tan x$, which **cannot** be rewritten by the Pythagorean identity — an odd leftover power of tangent is stuck.',
  keyWhy: 'Neither standard substitution works: $u=\\sec x$ leaves an unusable single $\\tan x$, and $u=\\tan x$ needs $\\sec^{2}x$ while the integrand has only one $\\sec x$. Convert to sines and cosines — $\\displaystyle\\int\\frac{\\sin^{2}x}{\\cos^{3}x}dx$ — or use $\\tan^{2}x=\\sec^{2}x-1$ and the known $\\int\\sec^{3}x\\,dx$.',
  hints: [
    'Write out what $du$ would be for $u=\\sec x$, then see exactly what is left over.',
    '$du = \\sec x\\tan x\\,dx$ consumes one $\\sec x$ and one $\\tan x$, leaving a single $\\tan x$ behind.',
    'A lone odd power of $\\tan x$ cannot be converted by $\\tan^{2}x+1=\\sec^{2}x$ — that identity only handles even powers.',
  ],
  steps: [
    'Try $u=\\sec x$: $du = \\sec x\\tan x\\,dx$. The integrand is $\\tan x\\cdot(\\sec x\\tan x\\,dx)$, leaving one unmatched $\\tan x$ — dead end.',
    'Try $u=\\tan x$: $du = \\sec^{2}x\\,dx$, but the integrand has only one factor of $\\sec x$ — dead end.',
    'Instead use $\\tan^{2}x = \\sec^{2}x - 1$: the integral becomes $\\displaystyle\\int\\sec^{3}x\\,dx - \\int\\sec x\\,dx$.',
    '$= \\tfrac12\\left(\\sec x\\tan x + \\ln|\\sec x+\\tan x|\\right) - \\ln|\\sec x+\\tan x| + C = \\tfrac12\\sec x\\tan x - \\tfrac12\\ln|\\sec x+\\tan x|+C$.',
  ],
  recall: 'The tan/sec rules need an *even* power of $\\sec$ (for $u=\\tan$) or an *odd* power of $\\tan$ with a $\\sec$ to spare (for $u=\\sec$). Neither holds here.',
  fix: 'When both substitutions stall, fall back on $\\tan^{2}=\\sec^{2}-1$ or convert to $\\sin/\\cos$.',
});

ci({
  id: 'ci-f25-0904', topic: MJ, src: 'Check-in, Fall 2025', v: true, diff: 4,
  q: 'To integrate $\\displaystyle\\int \\frac{x^{2}}{\\sqrt{x^{2}+9}}\\,dx$, one can make the substitution $x = 3\\cot\\theta$.',
  why: 'Unexpected but correct. What matters is that the substitution turns $x^{2}+9$ into a perfect square — and $9\\cot^{2}\\theta+9 = 9\\csc^{2}\\theta$ does exactly that.',
  keyWhy: '$x=3\\cot\\theta$ gives $x^{2}+9 = 9\\cot^{2}\\theta+9 = 9(\\cot^{2}\\theta+1) = 9\\csc^{2}\\theta$, so $\\sqrt{x^{2}+9} = 3|\\csc\\theta|$. The usual $x=3\\tan\\theta$ works too — a trig substitution is legitimate whenever it produces a Pythagorean identity.',
  hints: [
    'The test is not "does it match the table" but "does it make the radical a perfect square?"',
    'Substitute $x=3\\cot\\theta$ into $x^{2}+9$ and simplify.',
    '$\\cot^{2}\\theta + 1 = \\csc^{2}\\theta$ — the radical becomes $3|\\csc\\theta|$.',
  ],
  steps: [
    'Set $x = 3\\cot\\theta$, so $dx = -3\\csc^{2}\\theta\\,d\\theta$.',
    '$x^{2}+9 = 9\\cot^{2}\\theta + 9 = 9\\csc^{2}\\theta$, so $\\sqrt{x^{2}+9} = 3\\csc\\theta$ on the principal branch.',
    'The integrand becomes $\\dfrac{9\\cot^{2}\\theta}{3\\csc\\theta}\\cdot(-3\\csc^{2}\\theta)\\,d\\theta = -9\\displaystyle\\int\\cot^{2}\\theta\\csc\\theta\\,d\\theta$.',
    'The standard choice $x = 3\\tan\\theta$ leads to $9\\int\\tan^{2}\\theta\\sec\\theta\\,d\\theta$ — same difficulty, different bookkeeping.',
  ],
  recall: 'Trig substitution is driven by the Pythagorean identities, not by memorizing one row of a table. For $x^{2}+a^{2}$ both $a\\tan\\theta$ and $a\\cot\\theta$ work.',
});

ci({
  id: 'ci-s25-0130', topic: MJ, src: 'Check-in, Spring 2025', v: true, diff: 3,
  q: 'To compute $\\displaystyle\\int \\frac{x^{3}}{\\sqrt{x^{2}-4}}\\,dx$, one can make the substitution $x = 2\\sec\\theta$.',
  why: 'Correct — $x^{2}-a^{2}$ is the secant case, because $4\\sec^{2}\\theta - 4 = 4\\tan^{2}\\theta$ clears the radical.',
  keyWhy: '$x = 2\\sec\\theta \\Rightarrow x^{2}-4 = 4\\sec^{2}\\theta-4 = 4\\tan^{2}\\theta$, so $\\sqrt{x^{2}-4}=2|\\tan\\theta|$. (A plain $u=x^{2}-4$ substitution also works here and is faster.)',
  hints: [
    'Which Pythagorean identity produces a difference of squares like $x^{2}-a^{2}$?',
    '$\\sec^{2}\\theta - 1 = \\tan^{2}\\theta$.',
    'So $x = 2\\sec\\theta$ turns $x^{2}-4$ into $4\\tan^{2}\\theta$.',
  ],
  steps: [
    '$x = 2\\sec\\theta$, $dx = 2\\sec\\theta\\tan\\theta\\,d\\theta$.',
    '$x^{2}-4 = 4(\\sec^{2}\\theta - 1) = 4\\tan^{2}\\theta$, so $\\sqrt{x^{2}-4} = 2\\tan\\theta$.',
    'The integral becomes $\\displaystyle\\int\\frac{8\\sec^{3}\\theta}{2\\tan\\theta}\\cdot 2\\sec\\theta\\tan\\theta\\,d\\theta = 8\\int\\sec^{4}\\theta\\,d\\theta$.',
    'Faster alternative: $u = x^{2}-4$, $x^{2}=u+4$, giving $\\tfrac12\\displaystyle\\int\\frac{u+4}{\\sqrt u}du$.',
  ],
  recall: '$\\sqrt{a^{2}-x^{2}}\\to a\\sin\\theta$; $\\sqrt{a^{2}+x^{2}}\\to a\\tan\\theta$; $\\sqrt{x^{2}-a^{2}}\\to a\\sec\\theta$.',
});

ci({
  id: 'ci-s26-0129', topic: MJ, src: 'Check-in, Spring 2026', v: true, diff: 3,
  q: 'For $\\displaystyle\\int (x^{2}+4)^{3}\\,dx$, one can recognize a trig substitution from the "$a^{2}+b^{2}=c^{2}$-like" term $x^{2}+4$ and substitute $x = 2\\tan\\theta$.',
  why: 'The substitution really is valid — it turns the integral into $128\\int\\sec^{8}\\theta\\,d\\theta$. It is just a terrible idea when you could simply expand.',
  keyWhy: 'The claim is only that the substitution *can* be made, and it can: $x=2\\tan\\theta$ gives $x^{2}+4 = 4\\sec^{2}\\theta$ and the integral becomes $128\\displaystyle\\int\\sec^{8}\\theta\\,d\\theta$. But there is no radical here — just expand $(x^{2}+4)^{3} = x^{6}+12x^{4}+48x^{2}+64$ and use the power rule.',
  hints: [
    'Read the claim precisely: it says the substitution *can* be made, not that it is wise.',
    'Check the substitution works — then ask whether you would ever want to use it.',
    'There is no square root here. What is the simplest thing you could do to $(x^{2}+4)^{3}$?',
  ],
  steps: [
    '$x = 2\\tan\\theta$, $dx = 2\\sec^{2}\\theta\\,d\\theta$, and $x^{2}+4 = 4\\sec^{2}\\theta$.',
    'The integral becomes $\\displaystyle\\int 64\\sec^{6}\\theta\\cdot 2\\sec^{2}\\theta\\,d\\theta = 128\\int\\sec^{8}\\theta\\,d\\theta$ — valid, and horrible.',
    'Instead expand: $(x^{2}+4)^{3} = x^{6}+12x^{4}+48x^{2}+64$.',
    '$\\displaystyle\\int(x^{2}+4)^{3}dx = \\dfrac{x^{7}}{7} + \\dfrac{12x^{5}}{5} + 16x^{3} + 64x + C$.',
  ],
  recall: 'Trig substitution is for **radicals**. A positive integer power of a quadratic just expands.',
  fix: 'Look at the integrand before pattern-matching. A method being available is not the same as it being right.',
});

ci({
  id: 'ci-f25-0909', topic: MJ, src: 'Check-in, Fall 2025', v: false, diff: 3,
  q: 'The partial fraction decomposition of $\\dfrac{x+4}{x^{2}(x-3)}$ has the form $\\dfrac{Ax+B}{x^{2}} + \\dfrac{C}{x-3}$.',
  why: '$x^{2}$ is a **repeated linear** factor, not an irreducible quadratic. Repeated linear factors get one term per power — $\\frac{A}{x}+\\frac{B}{x^{2}}$ — not a single linear numerator.',
  keyWhy: 'The correct form is $\\dfrac{A}{x}+\\dfrac{B}{x^{2}}+\\dfrac{C}{x-3}$. A numerator like $Ax+B$ belongs over an **irreducible quadratic** such as $x^{2}+1$, which cannot be factored over the reals.',
  hints: [
    'Is $x^{2}$ an irreducible quadratic, or something else?',
    '$x^{2} = x\\cdot x$ — it factors. So it is a repeated *linear* factor.',
    'Repeated linear factor $(x-a)^{k}$ gets $k$ terms: one for each power from $1$ to $k$.',
  ],
  steps: [
    'Classify each denominator factor. $x^{2}$ is the linear factor $x$ repeated twice; $x-3$ is a distinct linear factor.',
    'Repeated linear $\\Rightarrow$ one constant-over-each-power: $\\dfrac{A}{x}+\\dfrac{B}{x^{2}}$.',
    'Distinct linear $\\Rightarrow \\dfrac{C}{x-3}$.',
    'Correct form: $\\dfrac{x+4}{x^{2}(x-3)} = \\dfrac{A}{x}+\\dfrac{B}{x^{2}}+\\dfrac{C}{x-3}$.',
  ],
  recall: 'Linear numerators ($Ax+B$) go over **irreducible quadratics** only. Repeated linear factors get a constant over every power.',
  fix: 'Before writing the form, ask of each factor: is it linear, repeated linear, or genuinely irreducible?',
  err: 'setup',
});

ci({
  id: 'ci-s26-0203', topic: MJ, src: 'Check-in, Spring 2026', v: false, diff: 3,
  q: 'The decomposition of $\\dfrac{5x-6}{x^{2}(x+3)}$ takes the form $\\dfrac{A}{x}+\\dfrac{Bx+C}{x^{2}}+\\dfrac{D}{x+3}$.',
  why: 'Two errors at once: $\\frac{Bx+C}{x^{2}}$ treats $x^{2}$ as irreducible, and the form has four unknowns for a denominator of degree three.',
  keyWhy: 'The correct form is $\\dfrac{A}{x}+\\dfrac{B}{x^{2}}+\\dfrac{C}{x+3}$ — three unknowns for a degree-three denominator. Count them: the number of unknowns always equals the degree of the denominator.',
  hints: [
    'Count the unknowns in the proposed form, then count the degree of the denominator.',
    'Degree of $x^{2}(x+3)$ is $3$, but the form has four unknowns $A,B,C,D$.',
    'The culprit is $\\frac{Bx+C}{x^{2}}$ — $x^{2}$ is repeated linear, so it gets a plain constant.',
  ],
  steps: [
    'Denominator $x^{2}(x+3)$ has degree $3$, so the decomposition must have exactly $3$ unknown constants.',
    '$x^{2}$ is the linear factor $x$ repeated: it contributes $\\dfrac{A}{x}+\\dfrac{B}{x^{2}}$.',
    '$x+3$ contributes $\\dfrac{C}{x+3}$.',
    'Correct: $\\dfrac{5x-6}{x^{2}(x+3)} = \\dfrac{A}{x}+\\dfrac{B}{x^{2}}+\\dfrac{C}{x+3}$, with $A=\\tfrac{7}{3}$... solve by clearing denominators.',
  ],
  recall: 'Sanity check: number of unknowns = degree of the denominator. If they disagree, the form is wrong.',
  fix: 'Count unknowns against the denominator degree before solving for anything.',
  err: 'setup',
});

ci({
  id: 'ci-s26-0210', topic: MJ, src: 'Check-in, Spring 2026', v: false, diff: 4,
  q: 'The partial fraction decomposition of $\\dfrac{9-x}{x^{5}+6x^{4}+9x^{3}} = \\dfrac{9-x}{x^{3}(x^{2}+6x+9)}$ is $\\dfrac{A}{x}+\\dfrac{B}{x^{2}}+\\dfrac{C}{x^{3}}+\\dfrac{Dx+E}{x^{2}+6x+9}$.',
  why: '$x^{2}+6x+9 = (x+3)^{2}$ — it is **not** irreducible. It is a repeated linear factor and needs $\\frac{D}{x+3}+\\frac{E}{(x+3)^{2}}$.',
  keyWhy: 'Always factor the denominator completely first. $x^{2}+6x+9=(x+3)^{2}$, so the correct form is $\\dfrac{A}{x}+\\dfrac{B}{x^{2}}+\\dfrac{C}{x^{3}}+\\dfrac{D}{x+3}+\\dfrac{E}{(x+3)^{2}}$.',
  hints: [
    'Check whether $x^{2}+6x+9$ actually is irreducible.',
    'Its discriminant is $36-36 = 0$ — a perfect square.',
    '$x^{2}+6x+9 = (x+3)^{2}$, a repeated linear factor.',
  ],
  steps: [
    'Factor completely: $x^{5}+6x^{4}+9x^{3} = x^{3}(x^{2}+6x+9) = x^{3}(x+3)^{2}$.',
    '$x^{3}$ is linear-repeated-3: $\\dfrac{A}{x}+\\dfrac{B}{x^{2}}+\\dfrac{C}{x^{3}}$.',
    '$(x+3)^{2}$ is linear-repeated-2: $\\dfrac{D}{x+3}+\\dfrac{E}{(x+3)^{2}}$.',
    'Five unknowns for a degree-five denominator — the count checks out.',
  ],
  recall: 'A quadratic is irreducible only if its discriminant is negative. Test $b^{2}-4ac$ before calling anything irreducible.',
  fix: 'Factor the denominator all the way down *before* choosing the decomposition form.',
  err: 'setup',
});

ci({
  id: 'ci-s25-0204', topic: MJ, src: 'Check-in, Spring 2025', v: false, diff: 3,
  q: 'The rational function $\\dfrac{x^{6}-4x}{(x-1)(x+2)(x^{2}+4)}$ can be decomposed as $\\dfrac{A}{x-1}+\\dfrac{B}{x+2}+\\dfrac{Cx+D}{x^{2}+4}$.',
  why: 'The factor forms are right, but partial fractions requires a **proper** fraction. The numerator has degree $6$ and the denominator degree $4$ — you must divide first.',
  keyWhy: 'Degree $6 \\geq$ degree $4$, so the fraction is improper. Long-divide first, giving a polynomial plus a proper remainder; only the remainder gets decomposed. (Check: the proposed form recombines to a numerator of degree at most $3$ — it could never produce $x^{6}$.)',
  hints: [
    'Compare the degree of the numerator with the degree of the denominator.',
    'Numerator degree $6$; denominator degree $1+1+2 = 4$.',
    'Partial fractions only applies to proper fractions — do polynomial long division first.',
  ],
  steps: [
    'Denominator degree: $(x-1)(x+2)(x^{2}+4)$ has degree $4$. Numerator degree: $6$.',
    'Since $6 \\geq 4$, the fraction is improper and must be divided: $\\dfrac{x^{6}-4x}{D(x)} = Q(x) + \\dfrac{R(x)}{D(x)}$ with $\\deg R < 4$.',
    'Only $\\dfrac{R(x)}{D(x)}$ gets the partial-fraction treatment, with the factor forms as given.',
    'Sanity check on the original claim: recombining $\\frac{A}{x-1}+\\frac{B}{x+2}+\\frac{Cx+D}{x^{2}+4}$ gives a numerator of degree $\\leq 3$ — never $x^{6}$.',
  ],
  recall: 'Partial fractions needs $\\deg(\\text{numerator}) < \\deg(\\text{denominator})$. Otherwise divide first.',
  fix: 'Check the degrees before writing a single $A$ or $B$.',
  err: 'setup',
});

ci({
  id: 'ci-s26-0205', topic: MJ, src: 'Check-in, Spring 2026', v: false, diff: 4,
  q: 'Heaviside\'s cover-up rule finds the full partial fraction decomposition for any rational function whose denominator is a product of only linear terms, e.g. $\\dfrac{6x-9}{(x+1)(x-3)^{2}}$.',
  why: 'Cover-up only recovers the coefficient over the **highest power** of each linear factor. For $(x-3)^{2}$ it gives the $\\frac{C}{(x-3)^{2}}$ coefficient but says nothing about $\\frac{B}{x-3}$.',
  keyWhy: 'The decomposition is $\\dfrac{A}{x+1}+\\dfrac{B}{x-3}+\\dfrac{C}{(x-3)^{2}}$. Cover-up finds $A$ and $C$; $B$ needs another method — plug in a convenient $x$, or match coefficients.',
  hints: [
    'Write out the full decomposition for that example first.',
    'There are three unknowns. Try covering up and see which ones you can actually get.',
    'Covering $(x-3)^{2}$ and setting $x=3$ gives $C$. Nothing you cover gives $B$.',
  ],
  steps: [
    'Correct form: $\\dfrac{6x-9}{(x+1)(x-3)^{2}} = \\dfrac{A}{x+1}+\\dfrac{B}{x-3}+\\dfrac{C}{(x-3)^{2}}$.',
    'Cover $(x+1)$, set $x=-1$: $A = \\dfrac{6(-1)-9}{(-1-3)^{2}} = \\dfrac{-15}{16}$.',
    'Cover $(x-3)^{2}$, set $x=3$: $C = \\dfrac{6(3)-9}{3+1} = \\dfrac{9}{4}$.',
    'For $B$: substitute any other value, say $x=0$, into the cleared equation and solve. Cover-up cannot reach it.',
  ],
  recall: 'Cover-up gives the top-power coefficient of each linear factor, and nothing else.',
  fix: 'After covering up, count how many unknowns you still have and solve for those separately.',
});

ci({
  id: 'ci-s25-0206', topic: MJ, src: 'Check-in, Spring 2025', v: false, diff: 4,
  q: '$\\displaystyle\\int \\left[\\frac{5}{x+1}-\\frac{1}{(x+1)^{2}}-\\frac{x+1}{x^{2}+1}\\right]dx = 5\\ln(x+1)-\\frac{1}{x+1}-\\frac{1}{2}\\ln|x^{2}+1|+\\arctan x + K$.',
  why: 'Three separate errors: the first log needs **absolute values**, the second term has the wrong sign, and the minus sign was not distributed across both pieces of the third term.',
  keyWhy: 'Correctly: $\\int\\frac{5}{x+1}dx = 5\\ln|x+1|$; $\\int-\\frac{1}{(x+1)^{2}}dx = +\\frac{1}{x+1}$; and $-\\int\\frac{x+1}{x^{2}+1}dx = -\\frac12\\ln|x^{2}+1| - \\arctan x$. So the answer is $5\\ln|x+1| + \\frac{1}{x+1} - \\frac12\\ln|x^{2}+1| - \\arctan x + K$.',
  hints: [
    'Check each of the three terms separately against its own antiderivative.',
    'Term 1: does $\\int\\frac{dx}{x+1}$ need absolute values? Term 2: what is $\\int -(x+1)^{-2}dx$?',
    'Term 3 splits into two pieces — make sure the leading minus reaches both of them.',
  ],
  steps: [
    '$\\displaystyle\\int\\frac{5}{x+1}dx = 5\\ln|x+1|+K$ — absolute values are required; the given answer drops them.',
    '$\\displaystyle\\int-(x+1)^{-2}dx = \\frac{-(x+1)^{-1}}{-1} = +\\frac{1}{x+1}$ — the given answer has $-\\frac{1}{x+1}$.',
    '$-\\displaystyle\\int\\frac{x+1}{x^{2}+1}dx = -\\left(\\frac12\\ln|x^{2}+1|+\\arctan x\\right) = -\\frac12\\ln|x^{2}+1|-\\arctan x$ — the given answer keeps $+\\arctan x$.',
    'Correct total: $5\\ln|x+1|+\\dfrac{1}{x+1}-\\tfrac12\\ln|x^{2}+1|-\\arctan x+K$.',
  ],
  recall: '$\\int\\frac{du}{u} = \\ln|u|$ — the bars are not decoration. And a minus in front of a split fraction hits every piece.',
  fix: 'Integrate term by term and check signs one at a time; do not trust a long expression at a glance.',
  err: 'sign',
});

ci({
  id: 'ci-f25-0911', topic: MJ, src: 'Check-in, Fall 2025', v: true, diff: 2,
  q: 'The partial fraction decomposition of $\\dfrac{7x-5}{x^{2}-x}$ is $\\dfrac{5}{x}+\\dfrac{2}{x-1}$.',
  why: 'Recombine and check: $\\dfrac{5}{x}+\\dfrac{2}{x-1} = \\dfrac{5(x-1)+2x}{x(x-1)} = \\dfrac{7x-5}{x^{2}-x}$. It matches.',
  keyWhy: 'Verify by recombining over the common denominator: $\\dfrac{5(x-1)+2x}{x(x-1)} = \\dfrac{7x-5}{x^{2}-x}$ ✓. Or use cover-up: at $x=0$, $\\frac{-5}{-1}=5$; at $x=1$, $\\frac{2}{1}=2$.',
  hints: [
    'You can settle this in one step without solving anything.',
    'Add the two proposed fractions back together over a common denominator.',
    '$\\dfrac{5(x-1)+2x}{x(x-1)}$ — expand the numerator and compare.',
  ],
  steps: [
    'Factor: $x^{2}-x = x(x-1)$, so the form is $\\dfrac{A}{x}+\\dfrac{B}{x-1}$.',
    'Cover-up for $A$: hide $x$, set $x=0$: $A = \\dfrac{7(0)-5}{0-1} = 5$.',
    'Cover-up for $B$: hide $x-1$, set $x=1$: $B = \\dfrac{7(1)-5}{1} = 2$.',
    'So the decomposition is $\\dfrac{5}{x}+\\dfrac{2}{x-1}$ — the claim is correct.',
  ],
  recall: 'A decomposition can always be checked by adding it back up. That takes ten seconds and catches every algebra slip.',
});

ci({
  id: 'ci-f25-0918', topic: MJ, src: 'Check-in, Fall 2025', v: false, diff: 4,
  q: '$\\displaystyle\\int_{-1}^{1}\\frac{dx}{\\sqrt[3]{x}} = \\int_{-1}^{1}x^{-1/3}dx = \\frac{3}{2}x^{2/3}\\bigg|_{-1}^{1} = \\frac{3}{2}\\left(1-1\\right) = 0$.',
  why: 'The integrand blows up at $x=0$, which is **inside** the interval. This is an improper integral, and the Fundamental Theorem does not apply across a discontinuity.',
  keyWhy: 'The integral is improper at the interior point $x=0$. It must be split as $\\displaystyle\\lim_{b\\to 0^{-}}\\int_{-1}^{b} + \\lim_{a\\to 0^{+}}\\int_{a}^{1}$. Here both halves converge (to $-\\tfrac32$ and $\\tfrac32$), so the value $0$ happens to be right — but the reasoning shown is invalid and would give wrong answers elsewhere.',
  hints: [
    'Look at the integrand on the whole interval $[-1,1]$. Is it defined everywhere?',
    'What happens at $x = 0$?',
    'A discontinuity strictly inside the interval makes the integral improper — FTC does not reach across it.',
  ],
  steps: [
    '$x^{-1/3}$ is undefined at $x=0$, and $0$ lies inside $[-1,1]$.',
    'FTC requires continuity on the closed interval, so applying it directly is invalid.',
    'Split at the singularity: $\\displaystyle\\lim_{b\\to0^{-}}\\int_{-1}^{b}x^{-1/3}dx + \\lim_{a\\to0^{+}}\\int_{a}^{1}x^{-1/3}dx$.',
    'Each piece converges ($-\\tfrac32$ and $\\tfrac32$), so the integral is $0$ — but only after checking. Compare $\\int_{-1}^{1}\\frac{dx}{x}$, where the same shortcut gives $0$ and the true answer is *divergent*.',
  ],
  recall: 'Before evaluating any definite integral, check the integrand for infinities **inside** the interval, not just at the endpoints.',
  fix: 'Scan the denominator for zeros in $[a,b]$ before you write down an antiderivative.',
  err: 'improper',
});

ci({
  id: 'ci-s25-0211', topic: MJ, src: 'Check-in, Spring 2025', v: true, diff: 2,
  q: 'The integral $\\displaystyle\\int_{1}^{\\infty}\\frac{dx}{\\sqrt[5]{x^{12}}}$ converges.',
  why: 'Rewrite the radical as a power: $\\sqrt[5]{x^{12}} = x^{12/5}$, so this is a $p$-integral with $p = \\tfrac{12}{5} > 1$ — convergent.',
  keyWhy: '$\\displaystyle\\int_{1}^{\\infty}\\frac{dx}{x^{p}}$ converges exactly when $p>1$. Here $p = \\tfrac{12}{5} = 2.4 > 1$, so it converges (to $\\tfrac{5}{7}$).',
  hints: [
    'Turn the radical into an exponent so you can read off $p$.',
    '$\\sqrt[5]{x^{12}} = x^{12/5}$.',
    'For $\\int_{1}^{\\infty}x^{-p}dx$, convergence needs $p>1$. Is $\\tfrac{12}{5}>1$?',
  ],
  steps: [
    '$\\dfrac{1}{\\sqrt[5]{x^{12}}} = x^{-12/5}$.',
    'The $p$-integral test on $[1,\\infty)$: converges iff $p>1$.',
    '$p = \\tfrac{12}{5} = 2.4 > 1$, so the integral converges.',
    'Its value: $\\displaystyle\\int_{1}^{\\infty}x^{-12/5}dx = \\left[\\dfrac{x^{-7/5}}{-7/5}\\right]_{1}^{\\infty} = \\dfrac{5}{7}$.',
  ],
  recall: 'On $[1,\\infty)$: $\\int x^{-p}$ converges iff $p>1$. On $(0,1]$: converges iff $p<1$. The two are opposite.',
});

// =================================================================
// Series Test Logic — is this the right test, used correctly?
// =================================================================
const STL = 'Series Test Logic';

ci({
  id: 'ci-f25-0930', topic: STL, src: 'Check-in, Fall 2025', v: true, diff: 2,
  q: 'The series $\\displaystyle\\sum_{n=17}^{\\infty}\\frac{n^{2}}{n^{2}+1}$ diverges.',
  why: 'The terms tend to $1$, not $0$. By the Divergence Test that is enough to conclude divergence — and the starting index $17$ is irrelevant.',
  keyWhy: '$\\displaystyle\\lim_{n\\to\\infty}\\frac{n^{2}}{n^{2}+1} = 1 \\neq 0$, so the series diverges by the Divergence Test. Terms that do not shrink to zero can never sum to a finite number.',
  hints: [
    'Start every series question the same way: what do the terms do as $n\\to\\infty$?',
    'Compare the degrees of numerator and denominator.',
    'Both degree $2$, so the limit is the ratio of leading coefficients — $1$, not $0$.',
  ],
  steps: [
    'Divergence Test: if $\\lim a_n \\neq 0$, the series diverges.',
    '$\\displaystyle\\lim_{n\\to\\infty}\\frac{n^{2}}{n^{2}+1} = 1$.',
    'Since $1\\neq 0$, the series diverges.',
    'The lower limit $n=17$ changes nothing — convergence never depends on where the sum starts.',
  ],
  recall: 'Always run the Divergence Test first. It is one limit and it settles many problems instantly.',
});

ci({
  id: 'ci-s26-0219', topic: STL, src: 'Check-in, Spring 2026', v: false, diff: 3,
  q: 'Because $\\displaystyle\\lim_{n\\to\\infty}\\frac{1}{n\\ln n} = 0$, the series $\\displaystyle\\sum_{n=2}^{\\infty}\\frac{1}{n\\ln n}$ converges.',
  why: 'This inverts the Divergence Test. Terms going to $0$ is **necessary** for convergence but nowhere near sufficient — and this particular series actually diverges.',
  keyWhy: 'The Divergence Test only runs one way: $\\lim a_n\\neq0 \\Rightarrow$ diverges. It says nothing when the limit *is* $0$. Compare $\\sum\\frac1n$ (diverges) and $\\sum\\frac{1}{n^{2}}$ (converges) — both have terms tending to $0$. Here the Integral Test with $u=\\ln x$ gives $\\int_2^\\infty\\frac{dx}{x\\ln x} = \\lim \\ln(\\ln x)= \\infty$, so the series **diverges**.',
  hints: [
    'What exactly does the Divergence Test let you conclude, and in which direction?',
    'It says $\\lim a_n\\neq0\\Rightarrow$ divergence. Does it say anything when the limit is $0$?',
    'No. Find two series with terms tending to $0$ that behave differently — $\\sum\\frac1n$ and $\\sum\\frac{1}{n^{2}}$.',
  ],
  steps: [
    'The Divergence Test is one-directional: $\\lim a_n \\neq 0 \\Rightarrow$ the series diverges. When $\\lim a_n = 0$ it is **inconclusive**.',
    'Counterexamples: $\\sum\\frac1n$ diverges and $\\sum\\frac{1}{n^{2}}$ converges, yet both have $a_n\\to0$.',
    'For this series use the Integral Test with $u=\\ln x$: $\\displaystyle\\int_{2}^{\\infty}\\frac{dx}{x\\ln x} = \\lim_{b\\to\\infty}\\ln(\\ln b) - \\ln(\\ln 2) = \\infty$.',
    'The integral diverges, so the series diverges.',
  ],
  recall: '$a_n\\to0$ is required for convergence but never proves it. The Divergence Test can only ever prove **divergence**.',
  fix: 'When the Divergence Test comes back $0$, you have learned nothing — pick a real test and keep going.',
  err: 'test-logic',
});

ci({
  id: 'ci-s25-0220', topic: STL, src: 'Check-in, Spring 2025', v: false, diff: 3,
  q: 'Considering $\\displaystyle\\sum_{n=1}^{\\infty}\\frac{n-1}{n^{3}}$ with the Divergence Test: because $\\displaystyle\\lim_{n\\to\\infty}\\frac{n-1}{n^{3}} = 0$, the series converges.',
  why: 'Same inversion of the Divergence Test. The conclusion happens to be true — the series does converge — but this reasoning does not establish it.',
  keyWhy: 'The Divergence Test cannot prove convergence, ever. To actually show it: $\\frac{n-1}{n^{3}} < \\frac{n}{n^{3}} = \\frac{1}{n^{2}}$, and $\\sum\\frac{1}{n^{2}}$ converges by the $p$-test, so direct comparison gives convergence.',
  hints: [
    'The series really does converge. Ask whether the *reason given* proves it.',
    'The Divergence Test only ever concludes divergence.',
    'To prove convergence, compare with a $p$-series.',
  ],
  steps: [
    '$\\lim a_n = 0$ means the Divergence Test is inconclusive — full stop.',
    'For a real argument: $\\dfrac{n-1}{n^{3}} \\leq \\dfrac{n}{n^{3}} = \\dfrac{1}{n^{2}}$ for $n\\geq1$.',
    '$\\sum\\frac{1}{n^{2}}$ converges ($p=2>1$).',
    'By the Direct Comparison Test the original series converges.',
  ],
  recall: 'A correct conclusion reached by invalid reasoning is still wrong on an exam. He grades the justification.',
  err: 'test-logic',
});

ci({
  id: 'ci-f25-1002', topic: STL, src: 'Check-in, Fall 2025', v: false, diff: 3,
  q: 'The series $\\displaystyle\\sum_{n=1}^{\\infty}3640\\,\\frac{7^{n}}{4^{2n}}$ diverges.',
  why: 'It is geometric in disguise. $4^{2n} = 16^{n}$, so the ratio is $r = \\tfrac{7}{16}$, and $|r|<1$ means it **converges**.',
  keyWhy: 'Rewrite in the form $\\sum ar^{n}$: $\\dfrac{7^{n}}{4^{2n}} = \\dfrac{7^{n}}{(4^{2})^{n}} = \\left(\\dfrac{7}{16}\\right)^{n}$. With $|r| = \\tfrac{7}{16}<1$ the geometric series converges.',
  hints: [
    'Get every exponential onto a common power of $n$ before judging.',
    '$4^{2n} = (4^{2})^{n} = 16^{n}$.',
    'So the term is $3640\\left(\\frac{7}{16}\\right)^{n}$ — read off $r$.',
  ],
  steps: [
    '$\\displaystyle\\sum 3640\\frac{7^{n}}{4^{2n}} = \\sum 3640\\frac{7^{n}}{16^{n}} = \\sum 3640\\left(\\frac{7}{16}\\right)^{n}$.',
    'This is geometric with $a = 3640$ and $r = \\tfrac{7}{16}$.',
    '$|r| = \\tfrac{7}{16} < 1$, so it converges by the Geometric Series Test.',
    'Sum: first term $3640\\cdot\\tfrac{7}{16}$ over $1-\\tfrac{7}{16}$, giving $\\dfrac{3640\\cdot 7}{9} = \\dfrac{25480}{9}$.',
  ],
  recall: 'Force every exponential to the same power of $n$ before identifying $r$. $4^{2n}$ is $16^{n}$, not $4^{n}$.',
  fix: 'Rewrite as $\\sum ar^{n}$ explicitly. Do not eyeball $r$.',
});

ci({
  id: 'ci-s26-0224', topic: STL, src: 'Check-in, Spring 2026', v: false, diff: 3,
  q: 'The series $\\displaystyle\\sum_{n=2}^{\\infty}4\\left(\\frac{9^{n+4}}{5^{2n}}\\right)$ diverges.',
  why: 'The tempting reading is $r = \\tfrac95 > 1$, but $5^{2n} = 25^{n}$, so the real ratio is $\\tfrac{9}{25} < 1$ and the series converges.',
  keyWhy: 'Write it properly: $\\dfrac{9^{n+4}}{5^{2n}} = \\dfrac{9^{4}\\cdot9^{n}}{25^{n}} = 6561\\left(\\dfrac{9}{25}\\right)^{n}$. Since $|r| = \\tfrac{9}{25}<1$, it converges.',
  hints: [
    'Two things need fixing: the shifted exponent $n+4$, and the $2n$ in the denominator.',
    '$9^{n+4} = 9^{4}\\cdot 9^{n}$ and $5^{2n} = 25^{n}$.',
    'Now the ratio is visible.',
  ],
  steps: [
    '$9^{n+4} = 9^{4}\\cdot 9^{n} = 6561\\cdot 9^{n}$ — the constant factors out.',
    '$5^{2n} = (5^{2})^{n} = 25^{n}$.',
    'The term is $4\\cdot 6561\\left(\\dfrac{9}{25}\\right)^{n}$: geometric with $r = \\tfrac{9}{25}$.',
    '$|r|<1$, so the series converges.',
  ],
  recall: 'Before naming $r$, pull constants out of shifted exponents and collapse $b^{kn}$ into $(b^{k})^{n}$.',
  fix: 'Never read $r$ off the original expression — normalize to $ar^{n}$ first.',
});

ci({
  id: 'ci-f25-1014', topic: STL, src: 'Check-in, Fall 2025', v: false, diff: 4,
  q: 'Because $\\displaystyle\\sum_{n=5}^{\\infty}\\frac{n-1}{n^{2}+1} \\leq \\sum_{n=5}^{\\infty}\\frac{n}{n^{2}} = \\sum_{n=5}^{\\infty}\\frac{1}{n}$, the series $\\displaystyle\\sum_{n=5}^{\\infty}\\frac{n-1}{n^{2}+1}$ diverges.',
  why: 'The inequality is true, but it points the wrong way. Being **smaller** than a divergent series proves nothing — the Direct Comparison Test has no such conclusion.',
  keyWhy: 'DCT concludes divergence only when your series is **larger** than a known divergent one. Here the series is smaller. (It does diverge, but you need a different comparison — or the Limit Comparison Test against $\\sum\\frac1n$, whose ratio is $1$.)',
  hints: [
    'Check the direction of the inequality against what the Direct Comparison Test actually concludes.',
    'DCT: bigger than divergent $\\Rightarrow$ divergent; smaller than convergent $\\Rightarrow$ convergent.',
    'This series is *smaller* than a divergent one. Which of those two rules is that?',
  ],
  steps: [
    'The inequality is correct: enlarging the numerator and shrinking the denominator makes the fraction bigger.',
    'But DCT only gives: $a_n \\geq b_n \\geq 0$ with $\\sum b_n$ divergent $\\Rightarrow \\sum a_n$ diverges.',
    'Being *below* a divergent series is no information: $\\sum\\frac{1}{n^{2}} \\leq \\sum\\frac{1}{n}$, yet $\\sum\\frac{1}{n^{2}}$ converges.',
    'Correct route — Limit Comparison against $\\frac1n$: $\\displaystyle\\lim_{n\\to\\infty}\\frac{(n-1)/(n^{2}+1)}{1/n} = 1$, finite and nonzero, so both diverge.',
  ],
  recall: 'DCT works in exactly two directions. Smaller-than-divergent and bigger-than-convergent are both worthless.',
  fix: 'When your comparison points the wrong way, switch to Limit Comparison — it does not care about direction.',
  err: 'test-logic',
});

ci({
  id: 'ci-s26-0303', topic: STL, src: 'Check-in, Spring 2026', v: false, diff: 3,
  q: 'Because $\\displaystyle\\sum_{n=1}^{\\infty}\\frac{1}{n^{5}}$ converges by the $p$-test with $p=5>1$, the series $\\displaystyle\\sum_{n=1}^{\\infty}\\frac{n^{2}}{n^{5}+1}$ converges.',
  why: 'The conclusion is right but the comparison series is wrong. $\\frac{n^{2}}{n^{5}+1}$ behaves like $\\frac{1}{n^{3}}$, not $\\frac{1}{n^{5}}$.',
  keyWhy: 'For large $n$, $\\dfrac{n^{2}}{n^{5}+1}\\approx\\dfrac{n^{2}}{n^{5}} = \\dfrac{1}{n^{3}}$. Limit-compare against $\\frac{1}{n^{3}}$: the ratio is $\\lim\\frac{n^{5}}{n^{5}+1} = 1$, finite and nonzero, and $\\sum\\frac{1}{n^{3}}$ converges by the $p$-test. Comparing against $\\frac{1}{n^{5}}$ gives ratio $\\lim\\frac{n^{7}}{n^{5}+1}=\\infty$ — useless.',
  hints: [
    'Find the right comparison series by keeping only the dominant powers.',
    '$\\frac{n^{2}}{n^{5}+1}$ — drop the $+1$ and cancel.',
    '$\\frac{n^{2}}{n^{5}} = \\frac{1}{n^{3}}$, so $p=3$, not $5$.',
  ],
  steps: [
    'For a rational term, the comparison series is (leading numerator power) over (leading denominator power): $\\dfrac{n^{2}}{n^{5}} = \\dfrac{1}{n^{3}}$.',
    'Limit Comparison: $\\displaystyle\\lim_{n\\to\\infty}\\frac{n^{2}/(n^{5}+1)}{1/n^{3}} = \\lim\\frac{n^{5}}{n^{5}+1} = 1$.',
    'Finite and nonzero, so both series share a fate.',
    '$\\sum\\frac{1}{n^{3}}$ converges ($p=3>1$), so the original converges.',
  ],
  recall: 'Pick the comparison by subtracting degrees: $\\frac{n^{a}}{n^{b}} = \\frac{1}{n^{b-a}}$. Here $5-2=3$.',
  fix: 'State the comparison series *and* verify the limit is finite and nonzero — the justification is the graded part.',
});

ci({
  id: 'ci-f25-1007', topic: STL, src: 'Check-in, Fall 2025', v: false, diff: 4,
  q: 'Because $\\displaystyle\\sum_{n=1}^{\\infty}(-1)^{n}\\frac{\\sqrt{n}-1}{n+1}$ "behaves like" $\\displaystyle\\sum_{n=1}^{\\infty}\\frac{1}{\\sqrt{n}}$, which diverges, the original series diverges.',
  why: 'The Limit Comparison Test requires both sequences to be **positive**. This one alternates in sign, so the test does not apply at all.',
  keyWhy: 'LCT requires $a_n, b_n > 0$ (at least eventually). The terms $(-1)^{n}\\frac{\\sqrt n - 1}{n+1}$ alternate forever, so LCT is unavailable. The series in fact **converges** (to about $0.0527$) by the Alternating Series Test.',
  hints: [
    'Check the hypotheses of the Limit Comparison Test before its conclusion.',
    'LCT is stated for sequences of *positive* terms.',
    'Does $(-1)^{n}\\frac{\\sqrt n-1}{n+1}$ stay positive?',
  ],
  steps: [
    'LCT hypothesis: $a_n, b_n > 0$. The given terms alternate sign, so the hypothesis fails.',
    'A test whose hypotheses fail gives no conclusion — right or wrong.',
    'Use the Alternating Series Test instead: $\\frac{\\sqrt n - 1}{n+1}\\to 0$ and is eventually decreasing.',
    'So the series converges (conditionally — $\\sum\\frac{\\sqrt n - 1}{n+1}$ itself diverges by comparison with $\\frac{1}{\\sqrt n}$).',
  ],
  recall: 'Comparison tests — direct and limit — are for positive series only. Alternating series need the AST, or absolute convergence.',
  fix: 'Read the sign of the terms before choosing a test.',
  err: 'test-logic',
});

ci({
  id: 'ci-f25-1016', topic: STL, src: 'Check-in, Fall 2025', v: true, diff: 3,
  q: 'The series $\\displaystyle\\sum_{n=1}^{\\infty}(-1)^{n}\\frac{\\sin^{4}(1/n)}{n}$ converges.',
  why: 'It converges — in fact absolutely. $\\sin^{4}(1/n)\\leq 1$ but much more usefully $\\sin(1/n)\\approx\\frac1n$, so the terms behave like $\\frac{1}{n^{5}}$.',
  keyWhy: 'For large $n$, $\\sin(1/n)\\approx\\tfrac1n$, so $\\dfrac{\\sin^{4}(1/n)}{n}\\approx\\dfrac{1}{n^{5}}$, and $\\sum\\frac{1}{n^{5}}$ converges. So the series converges absolutely — and absolute convergence implies convergence.',
  hints: [
    'Try to settle it with absolute convergence rather than the Alternating Series Test.',
    'What does $\\sin(1/n)$ look like when $n$ is large?',
    '$\\sin x \\approx x$ for small $x$, so $\\sin^{4}(1/n)\\approx 1/n^{4}$.',
  ],
  steps: [
    'Take absolute values: $\\left|(-1)^{n}\\frac{\\sin^{4}(1/n)}{n}\\right| = \\frac{\\sin^{4}(1/n)}{n}$.',
    'As $n\\to\\infty$, $\\frac1n\\to0$ and $\\sin(1/n)\\sim\\frac1n$, so $\\sin^{4}(1/n)\\sim\\frac{1}{n^{4}}$.',
    'Limit-compare with $\\frac{1}{n^{5}}$: the ratio tends to $1$, and $\\sum\\frac{1}{n^{5}}$ converges.',
    'So the series converges absolutely, hence converges.',
  ],
  recall: 'Absolute convergence is the stronger, cleaner route — try it before the AST.',
});

ci({
  id: 'ci-f25-1021', topic: STL, src: 'Check-in, Fall 2025', v: true, diff: 3,
  q: 'The series $\\displaystyle\\sum_{n=1}^{\\infty}\\left(\\frac{99n}{100n+1}\\right)^{n}$ converges.',
  why: 'An $n$th power screams Root Test, and the $n$th root leaves $\\frac{99n}{100n+1}\\to\\frac{99}{100}<1$.',
  keyWhy: 'Root Test: $\\displaystyle\\lim_{n\\to\\infty}\\left|\\left(\\frac{99n}{100n+1}\\right)^{n}\\right|^{1/n} = \\lim\\frac{99n}{100n+1} = \\frac{99}{100} < 1$, so the series converges absolutely.',
  hints: [
    'The whole term is raised to the $n$. Which test is built for that?',
    'The Root Test — take the $n$th root and the exponent vanishes.',
    'You are left with $\\lim\\frac{99n}{100n+1}$.',
  ],
  steps: [
    'Root Test: compute $L = \\lim |a_n|^{1/n}$.',
    '$\\left|\\left(\\frac{99n}{100n+1}\\right)^{n}\\right|^{1/n} = \\frac{99n}{100n+1}$.',
    '$\\displaystyle\\lim_{n\\to\\infty}\\frac{99n}{100n+1} = \\frac{99}{100}$.',
    '$L = 0.99 < 1$, so the series converges absolutely. (Note $\\frac{99}{100}$ is *strictly* below $1$ — that matters.)',
  ],
  recall: 'Anything of the form $(\\text{stuff})^{n}$ goes to the Root Test.',
});

ci({
  id: 'ci-s25-0318', topic: STL, src: 'Check-in, Spring 2025', v: true, diff: 3,
  q: 'The series $\\displaystyle\\sum_{n=1}^{\\infty}\\left(\\frac{n+1}{2n+3}\\right)^{n}$ converges.',
  why: 'Root Test: the $n$th root gives $\\frac{n+1}{2n+3}\\to\\frac12 < 1$.',
  keyWhy: '$L = \\displaystyle\\lim_{n\\to\\infty}\\frac{n+1}{2n+3} = \\frac12 < 1$, so the series converges absolutely by the Root Test.',
  hints: ['An $n$th power calls for the Root Test.', 'Take the $n$th root: the exponent cancels.', 'You are left with the limit of $\\frac{n+1}{2n+3}$ — compare leading coefficients.'],
  steps: [
    '$|a_n|^{1/n} = \\dfrac{n+1}{2n+3}$.',
    'Degrees match, so the limit is the ratio of leading coefficients: $\\tfrac12$.',
    '$L = \\tfrac12 < 1$, so the series converges absolutely.',
  ],
  recall: 'Root Test: $L<1$ converges, $L>1$ diverges, $L=1$ inconclusive.',
});

ci({
  id: 'ci-s25-0225', topic: STL, src: 'Check-in, Spring 2025', v: true, diff: 3,
  q: 'The series $\\displaystyle\\sum_{n=1}^{\\infty}5\\left(\\frac{2^{2n+1}}{3^{n}}\\right)$ diverges.',
  why: 'Normalize the exponents: $2^{2n+1} = 2\\cdot4^{n}$, so $r = \\tfrac43 > 1$ and the geometric series diverges.',
  keyWhy: '$\\dfrac{2^{2n+1}}{3^{n}} = \\dfrac{2\\cdot(2^{2})^{n}}{3^{n}} = 2\\left(\\dfrac43\\right)^{n}$. Since $|r| = \\tfrac43 > 1$, the geometric series diverges.',
  hints: [
    'Split the shifted exponent and collapse the $2n$.',
    '$2^{2n+1} = 2^{1}\\cdot 2^{2n} = 2\\cdot 4^{n}$.',
    'Now the ratio against $3^{n}$ is visible.',
  ],
  steps: [
    '$2^{2n+1} = 2\\cdot 4^{n}$.',
    'The term is $5\\cdot2\\left(\\frac43\\right)^{n} = 10\\left(\\frac43\\right)^{n}$.',
    'Geometric with $r = \\tfrac43$; $|r|>1$, so it diverges.',
    '(The Divergence Test also settles it: the terms grow without bound.)',
  ],
  recall: '$b^{kn+c} = b^{c}(b^{k})^{n}$. Always normalize before reading $r$.',
});

ci({
  id: 'ci-s25-0227', topic: STL, src: 'Check-in, Spring 2025', v: true, diff: 3,
  q: 'The series $\\displaystyle\\sum_{n=2}^{\\infty}\\frac{n^{2}+1}{\\sqrt{n^{3}-5}}$ diverges.',
  why: 'The terms grow: numerator $\\sim n^{2}$, denominator $\\sim n^{3/2}$, so $a_n\\sim n^{1/2}\\to\\infty$. The Divergence Test ends it.',
  keyWhy: '$\\dfrac{n^{2}+1}{\\sqrt{n^{3}-5}}\\approx\\dfrac{n^{2}}{n^{3/2}} = n^{1/2}\\to\\infty \\neq 0$, so the series diverges by the Divergence Test.',
  hints: [
    'Estimate the size of the terms for large $n$ before choosing a test.',
    'The square root of $n^{3}$ is $n^{3/2}$.',
    '$\\frac{n^{2}}{n^{3/2}} = n^{1/2}$ — the terms grow rather than shrink.',
  ],
  steps: [
    'Leading behaviour: numerator $\\sim n^{2}$, denominator $\\sim\\sqrt{n^{3}} = n^{3/2}$.',
    '$a_n \\sim n^{2-3/2} = n^{1/2} = \\sqrt n$.',
    '$\\lim a_n = \\infty \\neq 0$.',
    'Divergence Test: the series diverges.',
  ],
  recall: 'A radical in the denominator halves the exponent. $\\sqrt{n^{3}} = n^{3/2}$, not $n^{3}$.',
});

ci({
  id: 'ci-s25-0304', topic: STL, src: 'Check-in, Spring 2025', v: true, diff: 3,
  q: 'The series $\\displaystyle\\sum_{n=-5}^{\\infty}\\frac{n^{2}+5}{2^{n}-6}$ converges.',
  why: 'Exponential beats polynomial. The terms behave like $\\frac{n^{2}}{2^{n}}$, and the Ratio Test gives $\\tfrac12 < 1$.',
  keyWhy: 'For large $n$, $\\dfrac{n^{2}+5}{2^{n}-6}\\approx\\dfrac{n^{2}}{2^{n}}$. The Ratio Test on $\\frac{n^{2}}{2^{n}}$ gives $\\lim\\frac{(n+1)^{2}}{n^{2}}\\cdot\\frac12 = \\frac12 < 1$, so it converges. (The odd starting index $-5$ only adds finitely many terms and cannot affect convergence.)',
  hints: [
    'The starting index is a distraction — convergence never depends on it.',
    'Compare the growth of $n^{2}$ and $2^{n}$.',
    'Exponential growth always beats polynomial growth, so the terms collapse fast.',
  ],
  steps: [
    'The first few terms (from $n=-5$) are finite in number and cannot change convergence.',
    'For large $n$: $\\dfrac{n^{2}+5}{2^{n}-6}\\approx\\dfrac{n^{2}}{2^{n}}$.',
    'Ratio Test: $\\displaystyle\\lim\\left|\\frac{a_{n+1}}{a_n}\\right| = \\lim\\frac{(n+1)^{2}}{n^{2}}\\cdot\\frac{2^{n}}{2^{n+1}} = 1\\cdot\\frac12 = \\frac12$.',
    '$L = \\tfrac12 < 1$, so the series converges absolutely.',
  ],
  recall: 'Convergence depends only on the tail. Any finite block of terms is irrelevant.',
});

ci({
  id: 'ci-s25-0306', topic: STL, src: 'Check-in, Spring 2025', v: true, diff: 3,
  q: 'The series $\\displaystyle\\sum_{n=1}^{\\infty}\\frac{5n-2}{n^{3}+1}$ converges absolutely.',
  why: 'The terms are already positive, so convergence and absolute convergence are the same thing here — and it behaves like $\\frac{1}{n^{2}}$.',
  keyWhy: '$\\dfrac{5n-2}{n^{3}+1}\\approx\\dfrac{5n}{n^{3}} = \\dfrac{5}{n^{2}}$. Limit-compare with $\\frac{1}{n^{2}}$: ratio $\\to 5$, finite and nonzero, and $\\sum\\frac{1}{n^{2}}$ converges. All terms are positive, so this *is* absolute convergence.',
  hints: [
    'Note the sign of the terms first — that decides what "absolutely" even means here.',
    'All terms are positive for $n\\geq1$, so absolute convergence = convergence.',
    'Subtract degrees: $\\frac{n}{n^{3}} = \\frac{1}{n^{2}}$.',
  ],
  steps: [
    'For $n\\geq1$ the terms are positive, so $|a_n| = a_n$.',
    'Comparison series: $\\dfrac{5n}{n^{3}} = \\dfrac{5}{n^{2}}$.',
    'Limit Comparison with $\\frac{1}{n^{2}}$: $\\displaystyle\\lim\\frac{(5n-2)/(n^{3}+1)}{1/n^{2}} = 5$, finite and nonzero.',
    '$\\sum\\frac{1}{n^{2}}$ converges, so the series converges — and absolutely, since the terms never change sign.',
  ],
  recall: 'For a positive series, "converges" and "converges absolutely" mean the same thing.',
});

ci({
  id: 'ci-s26-0226', topic: STL, src: 'Check-in, Spring 2026', v: false, diff: 4,
  q: 'Because $\\displaystyle\\int_{1}^{\\infty}\\frac{x}{e^{x}}\\,dx$ converges to $\\frac{2}{e}$, the series $\\displaystyle\\sum_{n=1}^{\\infty}\\frac{n}{e^{n}}$ converges to $\\frac{2}{e}$ as well.',
  why: 'The Integral Test transfers **convergence**, never the value. The integral and the sum are different quantities that merely live or die together.',
  keyWhy: 'The Integral Test says the series and the integral converge or diverge together — it says nothing about their values being equal. Here the series does converge, but to $\\dfrac{e}{(e-1)^{2}}\\approx 0.9206$, not $\\tfrac{2}{e}\\approx 0.7358$.',
  hints: [
    'What exactly does the Integral Test conclude — convergence, or a value?',
    'It compares a sum of rectangles with the area under a curve. Are those the same number?',
    'No. The test transfers only the yes/no answer.',
  ],
  steps: [
    'Check the hypotheses: $f(x) = xe^{-x}$ is positive, continuous, and decreasing on $[1,\\infty)$ since $f\'(x) = e^{-x}(1-x)<0$ for $x>1$. ✓',
    'So the Integral Test applies and the series converges — that part is fine.',
    'But the conclusion is only "both converge" or "both diverge". The sum is a sum of rectangles; the integral is the area under the curve.',
    'In fact $\\displaystyle\\sum_{n=1}^{\\infty}\\frac{n}{e^{n}} = \\frac{e}{(e-1)^{2}} \\approx 0.9206$, while the integral is $\\tfrac{2}{e}\\approx 0.7358$.',
  ],
  recall: 'The Integral Test decides *whether*, never *what*. Only geometric and telescoping series hand you a value directly.',
  fix: 'If a question asks for a sum, the Integral Test is not the tool.',
  err: 'test-logic',
});

ci({
  id: 'ci-s26-0317', topic: STL, src: 'Check-in, Spring 2026', v: false, diff: 3,
  q: 'Applying the Root Test to $\\displaystyle\\sum_{n=1}^{\\infty}\\left(\\frac{1}{n}\\right)^{n}$, we get $\\left|\\left(\\frac1n\\right)^{n}\\right|^{1/n} = \\frac1n$, and since this limit is $0$, the test is inconclusive.',
  why: 'The computation is right and the verdict is wrong. $L = 0 < 1$, and the Root Test is inconclusive only when $L = 1$.',
  keyWhy: '$L = \\displaystyle\\lim_{n\\to\\infty}\\frac1n = 0 < 1$, so the Root Test says the series **converges absolutely**. The inconclusive case is $L=1$ exactly.',
  hints: [
    'The arithmetic is correct. Check the conclusion against the statement of the Root Test.',
    'Root Test: $L<1$ converges, $L>1$ diverges, $L=1$ inconclusive.',
    'Here $L = 0$. Which case is that?',
  ],
  steps: [
    '$\\left|\\left(\\frac1n\\right)^{n}\\right|^{1/n} = \\frac1n$ — correct.',
    '$\\displaystyle\\lim_{n\\to\\infty}\\frac1n = 0$.',
    'Root Test: $L = 0 < 1 \\Rightarrow$ absolute convergence.',
    'Only $L=1$ is inconclusive — $L=0$ is the strongest possible convergence signal.',
  ],
  recall: '$L=0$ is not "no information", it is the best case. Only $L=1$ leaves you stuck.',
  fix: 'Write the three Root/Ratio cases in the margin before concluding.',
  err: 'test-logic',
});

// =================================================================
// Power & Taylor Series Claims
// =================================================================
const PTS = 'Power & Taylor Claims';

ci({
  id: 'ci-f25-1030', topic: PTS, src: 'Check-in, Fall 2025', v: true, diff: 3,
  q: 'If a power series $\\displaystyle\\sum_{n=0}^{\\infty}a_n(x-c)^{n}$ converges on $(-5,3]$, then its center is $c=-1$ and its radius of convergence is $R=4$.',
  why: 'The centre is the midpoint of the interval and the radius is half its length: midpoint $\\frac{-5+3}{2} = -1$, half-length $\\frac{3-(-5)}{2} = 4$.',
  keyWhy: 'A power series converges on an interval symmetric about its centre. Midpoint: $\\frac{-5+3}{2} = -1 = c$. Radius: $\\frac{3-(-5)}{2} = 4 = R$. (The endpoints may behave differently — here $-5$ is excluded and $3$ included — but that never moves the centre.)',
  hints: [
    'The interval of convergence is always symmetric about the centre.',
    'So the centre is the midpoint of the interval.',
    'Midpoint of $(-5,3]$: average the endpoints. Radius: half the width.',
  ],
  steps: [
    'Centre $= $ midpoint $= \\dfrac{-5+3}{2} = -1$.',
    'Radius $=$ half the length $= \\dfrac{3-(-5)}{2} = \\dfrac{8}{2} = 4$.',
    'Check: $(c-R, c+R) = (-5, 3)$ ✓, with the right endpoint included.',
    'Endpoint inclusion is decided separately by testing $x = -5$ and $x = 3$ individually; it does not affect $c$ or $R$.',
  ],
  recall: 'Centre = midpoint, radius = half-width. Endpoints are a separate question.',
});

ci({
  id: 'ci-s25-0327', topic: PTS, src: 'Check-in, Spring 2025', v: true, diff: 2,
  q: 'If a power series has interval of convergence $(-1,3]$, then its centre is $x=1$ and its radius of convergence is $R=2$.',
  why: 'Midpoint $\\frac{-1+3}{2}=1$, half-width $\\frac{3-(-1)}{2}=2$.',
  keyWhy: 'Centre $=\\frac{-1+3}{2}=1$; radius $=\\frac{3-(-1)}{2}=2$. The half-open endpoint changes nothing.',
  hints: ['Symmetric about the centre.', 'Average the endpoints for the centre.', 'Half the width for the radius.'],
  steps: ['Centre: $\\frac{-1+3}{2}=1$.', 'Radius: $\\frac{3-(-1)}{2}=2$.', 'Check: $(1-2,1+2)=(-1,3)$ ✓.'],
  recall: 'Centre = midpoint, radius = half-width.',
});

ci({
  id: 'ci-s26-0331', topic: PTS, src: 'Check-in, Spring 2026', v: true, diff: 2,
  q: 'If a power series converges on $[3,19)$, then its radius of convergence must be $8$ and its centre must be $x=11$.',
  why: 'Midpoint $\\frac{3+19}{2}=11$, half-width $\\frac{19-3}{2}=8$.',
  keyWhy: 'Centre $= \\frac{3+19}{2} = 11$; radius $= \\frac{19-3}{2} = 8$. Check: $(11-8, 11+8) = (3,19)$ ✓.',
  hints: ['Same rule every time: symmetric interval.', 'Centre is the midpoint.', 'Radius is half the width.'],
  steps: ['Centre: $\\frac{3+19}{2} = 11$.', 'Radius: $\\frac{19-3}{2} = 8$.', 'Verify: $(3, 19)$ with $x=3$ included ✓.'],
  recall: 'Centre = midpoint, radius = half-width.',
});

ci({
  id: 'ci-s26-0326', topic: PTS, src: 'Check-in, Spring 2026', v: false, diff: 3,
  q: 'There is a power series whose interval of convergence is given by $x < -5$ and $x > 5$.',
  why: 'That set is not an interval at all, and a power series always converges on an interval centred at $c$. Its convergence set can never have a hole in the middle.',
  keyWhy: 'The only possibilities for a power series are: the single point $\\{c\\}$, a bounded interval of some radius $R$ centred at $c$ (with any combination of endpoints), or all of $(-\\infty,\\infty)$. A set that excludes the middle and keeps both tails is impossible.',
  hints: [
    'List the shapes a power series\' convergence set is allowed to take.',
    'They are: just the centre, an interval around the centre, or the whole line.',
    'Is "$x<-5$ or $x>5$" any of those?',
  ],
  steps: [
    'A power series $\\sum a_n(x-c)^{n}$ converges at $x=c$ always.',
    'If it converges at some $x_0$, it converges absolutely for all $x$ closer to $c$ than $x_0$ is.',
    'That forces the convergence set to be an interval centred at $c$ — no gaps.',
    'The three possibilities: $\\{c\\}$ ($R=0$), an interval of radius $R$, or $(-\\infty,\\infty)$ ($R=\\infty$). The given set is none of them.',
  ],
  recall: 'Convergence sets of power series are intervals centred at $c$ — never a union of two tails.',
});

ci({
  id: 'ci-f25-1104', topic: PTS, src: 'Check-in, Fall 2025', v: true, diff: 3,
  q: 'If a power series $\\displaystyle\\sum_{n=0}^{\\infty}a_n x^{n}$ converges at $x=-5$ and diverges at $x=10$, then it converges at $x=4$.',
  why: 'Convergence at $x=-5$ forces convergence for every $x$ with $|x| < 5$, and $|4| = 4 < 5$.',
  keyWhy: 'The centre is $0$. Convergence at $x=-5$ means $R \\geq 5$; divergence at $x=10$ means $R \\leq 10$. Since $|4| = 4 < 5 \\leq R$, the point $x=4$ is strictly inside the interval, so the series converges there.',
  hints: [
    'Read off what each fact tells you about the radius $R$.',
    'Converging at distance $5$ from the centre forces $R\\geq5$; diverging at distance $10$ forces $R\\leq10$.',
    'Where does $x=4$ sit relative to $R\\geq5$?',
  ],
  steps: [
    'The centre is $c=0$, so distances from the centre are just $|x|$.',
    'Converges at $x=-5$ (distance $5$) $\\Rightarrow R \\geq 5$.',
    'Diverges at $x=10$ (distance $10$) $\\Rightarrow R \\leq 10$.',
    '$|4| = 4 < 5 \\leq R$, so $x=4$ is strictly inside — convergence is guaranteed (and absolute).',
  ],
  recall: 'One convergence point sets a lower bound on $R$; one divergence point sets an upper bound. Anything strictly nearer than a known convergence point converges.',
});

ci({
  id: 'ci-s25-0401', topic: PTS, src: 'Check-in, Spring 2025', v: true, diff: 3,
  q: 'The series $\\displaystyle\\sum_{n=1}^{\\infty}\\frac{(x-5)^{n}}{n^{2}3^{n}}$ has centre $x=5$ and radius of convergence $3$. Therefore the series converges at $x=7$.',
  why: 'Correct: $|7-5| = 2 < 3$, so $x=7$ is strictly inside the interval of convergence.',
  keyWhy: 'The centre is $5$ (the value that kills every term) and the Ratio Test gives $R=3$. Since $|7-5| = 2 < 3$, the point is strictly interior and the series converges absolutely there.',
  hints: [
    'Measure the distance from the centre to the point in question.',
    '$|7-5| = 2$.',
    'Compare that with $R=3$.',
  ],
  steps: [
    'Centre: the $x$ that kills the series is $x=5$.',
    'Ratio Test: $\\displaystyle\\lim\\left|\\frac{(x-5)^{n+1}}{(n+1)^{2}3^{n+1}}\\cdot\\frac{n^{2}3^{n}}{(x-5)^{n}}\\right| = \\frac{|x-5|}{3}$.',
    'Convergence needs $\\frac{|x-5|}{3}<1$, i.e. $|x-5|<3$, so $R=3$.',
    '$|7-5| = 2 < 3$ — strictly inside, so the series converges at $x=7$.',
  ],
  recall: 'Strictly inside the radius: always converges (absolutely). Exactly at the radius: must be tested separately.',
});

ci({
  id: 'ci-s26-0402', topic: PTS, src: 'Check-in, Spring 2026', v: true, diff: 1,
  q: 'The Maclaurin series for $f(x)$ is $\\displaystyle\\sum_{n=0}^{\\infty}\\frac{f^{(n)}(0)}{n!}x^{n}$.',
  why: 'That is the definition. A Maclaurin series is just a Taylor series centred at $0$.',
  keyWhy: 'Taylor series at $c$: $\\sum\\frac{f^{(n)}(c)}{n!}(x-c)^{n}$. Setting $c=0$ gives $\\sum\\frac{f^{(n)}(0)}{n!}x^{n}$ — the Maclaurin series.',
  hints: ['Start from the general Taylor series formula.', 'Maclaurin means centred at a particular point. Which one?', 'Centred at $0$ — substitute $c=0$.'],
  steps: [
    'Taylor series centred at $c$: $\\displaystyle\\sum_{n=0}^{\\infty}\\frac{f^{(n)}(c)}{n!}(x-c)^{n}$.',
    '"Maclaurin" is the special case $c=0$.',
    'Substituting: $\\displaystyle\\sum_{n=0}^{\\infty}\\frac{f^{(n)}(0)}{n!}x^{n}$ ✓.',
  ],
  recall: 'Maclaurin = Taylor centred at $0$. Nothing more.',
});

ci({
  id: 'ci-s25-0403', topic: PTS, src: 'Check-in, Spring 2025', v: true, diff: 2,
  q: 'The first-order Taylor polynomial for $f(x)$ at $x_0$ is the tangent line to $f$ at $x_0$, and the Taylor series is an "infinite-degree" extension of that idea.',
  why: 'True: $T_1(x) = f(x_0) + f\'(x_0)(x-x_0)$ is exactly the point-slope equation of the tangent line.',
  keyWhy: '$T_1(x) = f(x_0) + f\'(x_0)(x-x_0)$ — the tangent line. Each higher degree matches one more derivative at $x_0$, so $T_2$ matches the curvature, $T_3$ the next derivative, and so on.',
  hints: [
    'Write out $T_1(x)$ explicitly from the Taylor formula.',
    'Keep only the $n=0$ and $n=1$ terms.',
    '$f(x_0) + f\'(x_0)(x-x_0)$ — what is that the equation of?',
  ],
  steps: [
    'Take the first two terms: $T_1(x) = f(x_0) + \\dfrac{f\'(x_0)}{1!}(x-x_0)$.',
    'That is point-slope form: a line through $(x_0, f(x_0))$ with slope $f\'(x_0)$ — the tangent line.',
    '$T_2$ adds $\\frac{f\'\'(x_0)}{2}(x-x_0)^{2}$, matching the second derivative too.',
    'Degree $n$ matches the first $n$ derivatives at $x_0$; the full series is the limiting case.',
  ],
  recall: 'Taylor polynomials are successively better local fits: $T_1$ matches slope, $T_2$ matches curvature, and so on.',
});

ci({
  id: 'ci-f25-1106', topic: PTS, src: 'Check-in, Fall 2025', v: true, diff: 3,
  q: 'The Taylor series for $f(x)=\\dfrac{1}{1-x}$ centred at $x=0$ is $\\displaystyle\\sum_{n=0}^{\\infty}x^{n}$, with interval of convergence $(-1,1)$.',
  why: 'This is the geometric series read backwards: $\\sum x^{n} = \\frac{1}{1-x}$ exactly when $|x|<1$.',
  keyWhy: 'The geometric series $\\sum_{n=0}^{\\infty}x^{n}$ has sum $\\frac{1}{1-x}$ for $|x|<1$, and diverges at both endpoints ($\\sum 1$ and $\\sum(-1)^{n}$ both fail the Divergence Test). So the interval is exactly $(-1,1)$.',
  hints: [
    'You already know a closed form for $\\sum_{n=0}^{\\infty}x^{n}$.',
    'It is the geometric series with ratio $x$.',
    'Geometric converges exactly when $|r|<1$ — and both endpoints must be checked.',
  ],
  steps: [
    'Geometric series: $\\displaystyle\\sum_{n=0}^{\\infty}x^{n} = \\frac{1}{1-x}$ for $|x|<1$.',
    'At $x=1$: $\\sum 1$ diverges. At $x=-1$: $\\sum(-1)^{n}$ diverges (terms do not tend to $0$).',
    'So the interval of convergence is the open interval $(-1,1)$.',
    'This is the single most useful series in the course — everything else is built from it by substituting, differentiating, or integrating.',
  ],
  recall: '$\\dfrac{1}{1-x} = \\sum x^{n}$ on $(-1,1)$. Memorize it; you will build half of Exam 3 from it.',
});

ci({
  id: 'ci-f25-1118', topic: PTS, src: 'Check-in, Fall 2025', v: true, diff: 4,
  q: '$\\dfrac{1}{(1-x)^{2}} = \\displaystyle\\sum_{n=0}^{\\infty}n x^{n-1}$ for $x\\in(-1,1)$.',
  why: 'Differentiate $\\frac{1}{1-x} = \\sum x^{n}$ term by term: the left side gives $\\frac{1}{(1-x)^{2}}$ and the right gives $\\sum nx^{n-1}$.',
  keyWhy: 'A power series may be differentiated term by term inside its interval of convergence, and the radius is unchanged. Differentiating $\\frac{1}{1-x} = \\sum_{n=0}^{\\infty}x^{n}$ gives $\\frac{1}{(1-x)^{2}} = \\sum_{n=0}^{\\infty}nx^{n-1}$ — the $n=0$ term is $0$, so it contributes nothing.',
  hints: [
    'Start from the geometric series and do something calculus-y to both sides.',
    '$\\frac{d}{dx}\\left[\\frac{1}{1-x}\\right] = \\frac{1}{(1-x)^{2}}$.',
    'Differentiate the series term by term and compare.',
  ],
  steps: [
    'Start from $\\dfrac{1}{1-x} = \\displaystyle\\sum_{n=0}^{\\infty}x^{n}$, valid on $(-1,1)$.',
    'Differentiate the left: $\\dfrac{d}{dx}(1-x)^{-1} = (1-x)^{-2} = \\dfrac{1}{(1-x)^{2}}$.',
    'Differentiate the right term by term: $\\displaystyle\\sum_{n=0}^{\\infty}nx^{n-1}$ (the $n=0$ term vanishes).',
    'Term-by-term differentiation preserves the radius of convergence, so this holds on $(-1,1)$.',
  ],
  recall: 'Inside the interval of convergence you may differentiate and integrate a power series term by term. $R$ never changes (endpoints can).',
});

ci({
  id: 'ci-s25-0410', topic: PTS, src: 'Check-in, Spring 2025', v: false, diff: 3,
  q: 'The value of $\\displaystyle\\sum_{n=0}^{\\infty}\\frac{1}{n!\\,2^{n}}$ is $e^{2}$.',
  why: 'The series is $e^{x}$ evaluated at $x=\\tfrac12$, not $x=2$. $\\frac{1}{n!2^{n}} = \\frac{(1/2)^{n}}{n!}$.',
  keyWhy: '$e^{x} = \\sum\\frac{x^{n}}{n!}$. Here $\\dfrac{1}{n!\\,2^{n}} = \\dfrac{(1/2)^{n}}{n!}$, so $x = \\tfrac12$ and the sum is $e^{1/2} = \\sqrt{e}$.',
  hints: [
    'Match the series against $e^{x} = \\sum\\frac{x^{n}}{n!}$ and read off $x$.',
    'Where does the $2^{n}$ sit — numerator or denominator?',
    'Denominator, so $\\frac{1}{2^{n}} = \\left(\\frac12\\right)^{n}$ and $x = \\frac12$.',
  ],
  steps: [
    'Known series: $e^{x} = \\displaystyle\\sum_{n=0}^{\\infty}\\frac{x^{n}}{n!}$, valid for all $x$.',
    'Rewrite the given term: $\\dfrac{1}{n!\\,2^{n}} = \\dfrac{1}{n!}\\left(\\dfrac{1}{2}\\right)^{n} = \\dfrac{(1/2)^{n}}{n!}$.',
    'So $x = \\tfrac12$, and the sum is $e^{1/2} = \\sqrt e \\approx 1.6487$.',
    '($e^{2}\\approx 7.389$ — not even close, which is a useful sanity check.)',
  ],
  recall: 'To sum a series with a known Maclaurin form, match the pattern and read off $x$ carefully — including whether it is $x$ or $1/x$.',
  fix: 'Rewrite the term so the variable part is literally $(\\text{something})^{n}$ before naming $x$.',
});

ci({
  id: 'ci-s26-0407', topic: PTS, src: 'Check-in, Spring 2026', v: true, diff: 3,
  q: '$\\displaystyle\\sum_{n=0}^{\\infty}(-1)^{n}\\frac{\\pi^{2n}}{(2n)!} = -1$.',
  why: 'That is the cosine series at $x=\\pi$: $\\cos x = \\sum(-1)^{n}\\frac{x^{2n}}{(2n)!}$, and $\\cos\\pi = -1$.',
  keyWhy: '$\\cos x = \\displaystyle\\sum_{n=0}^{\\infty}(-1)^{n}\\frac{x^{2n}}{(2n)!}$. Here $x^{2n} = \\pi^{2n}$, so $x = \\pi$ and the sum is $\\cos\\pi = -1$.',
  hints: [
    'The alternating sign with $(2n)!$ in the denominator is a fingerprint. Which function?',
    '$\\cos x = \\sum(-1)^{n}\\frac{x^{2n}}{(2n)!}$.',
    'Match $\\pi^{2n}$ against $x^{2n}$ to find $x$.',
  ],
  steps: [
    'Recognize the Maclaurin series for cosine: $\\cos x = \\displaystyle\\sum_{n=0}^{\\infty}\\frac{(-1)^{n}x^{2n}}{(2n)!}$.',
    'Compare: $\\pi^{2n} = x^{2n}$ gives $x = \\pi$.',
    'So the sum is $\\cos\\pi = -1$ ✓.',
    '(Even powers only and $(2n)!$ $\\Rightarrow$ cosine; odd powers and $(2n+1)!$ $\\Rightarrow$ sine.)',
  ],
  recall: '$(2n)!$ with even powers is cosine; $(2n+1)!$ with odd powers is sine; plain $n!$ is $e^{x}$.',
});

ci({
  id: 'ci-f25-1111', topic: PTS, src: 'Check-in, Fall 2025', v: true, diff: 4,
  q: '$\\pi = 4 - \\dfrac{4}{3} + \\dfrac{4}{5} - \\dfrac{4}{7} + \\dfrac{4}{9} - \\dfrac{4}{11} + \\cdots$',
  why: 'This is the Leibniz formula: $\\arctan x = x - \\frac{x^{3}}{3} + \\frac{x^{5}}{5} - \\cdots$ at $x=1$ gives $\\frac{\\pi}{4}$, and multiplying by $4$ gives $\\pi$.',
  keyWhy: '$\\arctan x = \\displaystyle\\sum_{n=0}^{\\infty}(-1)^{n}\\frac{x^{2n+1}}{2n+1}$ on $[-1,1]$. At $x=1$: $\\arctan 1 = \\frac{\\pi}{4} = 1-\\frac13+\\frac15-\\cdots$. Multiply by $4$.',
  hints: [
    'Factor the $4$ out and look at what remains.',
    '$4\\left(1 - \\frac13 + \\frac15 - \\frac17 + \\cdots\\right)$ — odd denominators, alternating signs.',
    'That is the arctangent series evaluated at $x=1$.',
  ],
  steps: [
    'Factor: the series is $4\\left(1-\\tfrac13+\\tfrac15-\\tfrac17+\\cdots\\right)$.',
    'The bracket is $\\displaystyle\\sum_{n=0}^{\\infty}\\frac{(-1)^{n}}{2n+1}$, which is $\\arctan x$ at $x=1$.',
    '$\\arctan 1 = \\dfrac{\\pi}{4}$.',
    'So the total is $4\\cdot\\dfrac{\\pi}{4} = \\pi$ ✓. (It converges famously slowly — thousands of terms for a few digits.)',
  ],
  recall: '$\\arctan x = x - \\frac{x^{3}}{3}+\\frac{x^{5}}{5}-\\cdots$ — odd powers, odd denominators, no factorials.',
});

ci({
  id: 'ci-f25-1113', topic: PTS, src: 'Check-in, Fall 2025', v: false, diff: 4,
  q: 'Using more terms of the Taylor series for $f(x)$ always gives a better approximation for $x$-values near the centre.',
  why: 'Two failures: outside the interval of convergence more terms make things *worse*, and even inside it there are functions whose Taylor series converges but not to $f$.',
  keyWhy: 'The remainder is $R_n(x) = \\frac{f^{(n+1)}(z)}{(n+1)!}(x-c)^{n+1}$ for some $z$ between $x$ and $c$. Nothing forces $R_n \\to 0$: it depends on how fast the derivatives grow against $(n+1)!$. The classic counterexample is $g(x) = e^{-1/x}$ for $x>0$, $0$ otherwise — every derivative at $0$ vanishes, so its Taylor series is identically $0$ and never approaches $g$.',
  hints: [
    'The word doing the work is "always". Look for a case where it fails.',
    'What happens outside the interval of convergence?',
    'And even inside it — is a Taylor series guaranteed to converge to the function it came from?',
  ],
  steps: [
    'Outside the interval of convergence the partial sums diverge, so more terms are strictly worse.',
    'Inside, the error is $R_n(x) = \\dfrac{f^{(n+1)}(z)}{(n+1)!}(x-c)^{n+1}$ for some $z$ between $x$ and $c$.',
    'There is no guarantee $R_n \\to 0$ — it is a race between the growth of $f^{(n+1)}$ and $(n+1)!$.',
    'Counterexample: $g(x) = e^{-1/x}$ for $x>0$ and $0$ for $x\\leq0$ is infinitely differentiable with $g^{(n)}(0)=0$ for all $n$. Its Maclaurin series is $0$, which does not converge to $g$ anywhere except $x=0$.',
  ],
  recall: 'A Taylor series converging is not the same as it converging *to the function*. Functions where it does are called analytic.',
  fix: 'Treat "always" claims with suspicion — find the boundary case before agreeing.',
});

ci({
  id: 'ci-s25-0415', topic: PTS, src: 'Check-in, Spring 2025', v: false, diff: 3,
  q: 'The Taylor series for a function always converges to that function.',
  why: 'Even in the friendly case it can fail on domain grounds: $\\frac{1}{1-x}$ is defined for all $x\\neq1$, but its Maclaurin series only converges on $(-1,1)$.',
  keyWhy: 'Two separate failures. **Domain**: $f(x)=\\frac{1}{1-x}$ is defined at $x=5$ but $\\sum x^{n}$ diverges there. **Worse**: $g(x)=e^{-1/x}$ for $x>0$, $0$ otherwise, has every derivative zero at $0$, so its Taylor series is the zero function — which equals $g$ only at $x=0$.',
  hints: [
    'Try to find a function whose Taylor series misbehaves.',
    'Start with $\\frac{1}{1-x}$: where is $f$ defined, and where does its series converge?',
    'They do not match — $f$ is fine at $x=5$, the series is not.',
  ],
  steps: [
    'Take $f(x) = \\dfrac{1}{1-x}$, whose Maclaurin series is $\\sum x^{n}$ with interval $(-1,1)$.',
    '$f$ is perfectly well defined at, say, $x=5$, but the series diverges there — so it cannot converge to $f$.',
    'A stronger failure: $g(x) = e^{-1/x}$ for $x>0$ and $0$ for $x\\leq0$ is smooth with all derivatives $0$ at the origin.',
    'Its Taylor series at $0$ is identically $0$, yet $g(x)>0$ for every $x>0$ — the series converges everywhere and equals $g$ nowhere but the centre.',
  ],
  recall: 'Functions whose Taylor series converge back to them are *analytic*. Not every smooth function is analytic.',
});

ci({
  id: 'ci-s25-0408', topic: PTS, src: 'Check-in, Spring 2025', v: true, diff: 3,
  q: 'If the Taylor series for $f$ at $x=a$ converges to $f$ on an interval $I$ containing $a$, then the error in approximating $f(x)$ by $T_n(x)$ for $x\\in I$ tends to $0$ as $n\\to\\infty$.',
  why: 'That is what "converges to $f$" means: the partial sums $T_n(x)$ approach $f(x)$, so the error $f(x)-T_n(x)$ approaches $0$.',
  keyWhy: '$T_n(x)$ is exactly the $n$th partial sum of the Taylor series. Saying the series converges to $f(x)$ on $I$ is saying $T_n(x)\\to f(x)$, i.e. $R_n(x) = f(x)-T_n(x)\\to 0$, for each $x\\in I$.',
  hints: [
    'Unpack what "the series converges to $f$" means in terms of partial sums.',
    '$T_n(x)$ *is* the $n$th partial sum.',
    'Convergence of partial sums to $f(x)$ is the same statement as the remainder going to $0$.',
  ],
  steps: [
    'By definition, $\\sum_{k=0}^{\\infty}\\frac{f^{(k)}(a)}{k!}(x-a)^{k}$ converges to $f(x)$ means its partial sums converge to $f(x)$.',
    'The $n$th partial sum is precisely $T_n(x)$.',
    'So $T_n(x)\\to f(x)$, i.e. $R_n(x) = f(x) - T_n(x) \\to 0$.',
    'Note the direction: this is *given* convergence to $f$. Without that hypothesis it can fail — see the $e^{-1/x}$ example.',
  ],
  recall: 'Remainder $\\to0$ and "series converges to $f$" are the same statement, not two facts.',
});

ci({
  id: 'ci-s26-0409', topic: PTS, src: 'Check-in, Spring 2026', v: false, diff: 4,
  q: 'The 3rd-degree Taylor polynomial for $e^{x}$ at $x=0$ is $1+x+\\frac{x^{2}}{2!}+\\frac{x^{3}}{3!}$, and the Taylor remainder term is $R_3(x)=\\frac{x^{4}}{4!}$.',
  why: 'The polynomial is right; the remainder is not. $R_3$ evaluates the fourth derivative at some unknown $z$ **between** $x$ and the centre — not at the centre itself.',
  keyWhy: 'Lagrange remainder: $R_n(x) = \\dfrac{f^{(n+1)}(z)}{(n+1)!}(x-c)^{n+1}$ for some $z$ between $x$ and $c$. For $e^{x}$ with $n=3$, $c=0$: $R_3(x) = \\dfrac{e^{z}}{4!}x^{4}$. Writing $\\frac{x^{4}}{4!}$ silently sets $z=0$, which turns the remainder into the next *term* of the series — a different object.',
  hints: [
    'Check the polynomial first — it is fine. Then look hard at the remainder.',
    'Write down the Lagrange remainder formula precisely. Where is the derivative evaluated?',
    'At some unknown $z$ between $x$ and $c$ — not at $c$.',
  ],
  steps: [
    '$T_3(x) = 1+x+\\frac{x^{2}}{2!}+\\frac{x^{3}}{3!}$ ✓ — this part is correct.',
    'Lagrange remainder: $R_n(x) = \\dfrac{f^{(n+1)}(z)}{(n+1)!}(x-c)^{n+1}$, $z$ strictly between $x$ and $c$.',
    'For $f=e^{x}$, every derivative is $e^{x}$, so $R_3(x) = \\dfrac{e^{z}}{4!}x^{4}$.',
    'The claimed $\\frac{x^{4}}{4!}$ is what you get by wrongly putting $z=0$: that is the next term of the series, not the error.',
  ],
  recall: 'The remainder looks like the next term but with the derivative at an unknown interior point $z$. You bound $f^{(n+1)}(z)$; you do not evaluate it.',
  fix: 'Write the $z$ explicitly every time, then bound it over the interval.',
});

ci({
  id: 'ci-s26-0414', topic: PTS, src: 'Check-in, Spring 2026', v: false, diff: 4,
  q: 'If $\\displaystyle\\sum_{n=0}^{\\infty}a_n x^{n}$ is the Taylor series for $f(x)$ centred at $x=0$, then $\\displaystyle\\sum_{n=0}^{\\infty}a_n(x-a)^{n}$ is the Taylor series for $f(x)$ centred at $x=a$.',
  why: 'The centre was shifted but the coefficients were not recomputed. The coefficients depend on the derivatives **at the new centre**, and $\\frac{f^{(n)}(0)}{n!} \\neq \\frac{f^{(n)}(a)}{n!}$ in general.',
  keyWhy: 'The original has $a_n = \\frac{f^{(n)}(0)}{n!}$; a series centred at $a$ needs $\\frac{f^{(n)}(a)}{n!}$. Concretely: $\\sin x = \\sum(-1)^{n}\\frac{x^{2n+1}}{(2n+1)!}$ at $0$, but centred at $\\frac{\\pi}{2}$ it is $\\sum(-1)^{n}\\frac{(x-\\pi/2)^{2n}}{(2n)!}$ — even powers, a completely different series.',
  hints: [
    'The coefficients $a_n$ came from somewhere. Where?',
    '$a_n = \\frac{f^{(n)}(0)}{n!}$ — derivatives at the *old* centre.',
    'A series at a new centre needs derivatives at the new centre. Are those the same numbers?',
  ],
  steps: [
    'By definition $a_n = \\dfrac{f^{(n)}(0)}{n!}$ — evaluated at the original centre $0$.',
    'The Taylor series at $a$ requires coefficients $\\dfrac{f^{(n)}(a)}{n!}$.',
    'There is no reason for $f^{(n)}(0) = f^{(n)}(a)$, so simply replacing $x$ by $x-a$ is invalid.',
    'Example: $\\sin x$ at $0$ has only odd powers; at $\\frac{\\pi}{2}$ it is $\\sum(-1)^{n}\\frac{(x-\\pi/2)^{2n}}{(2n)!}$ — only even powers.',
  ],
  recall: 'Re-centring a Taylor series means recomputing it from scratch. You cannot slide the centre and keep the coefficients.',
  fix: 'If the centre changes, go back to $\\frac{f^{(n)}(c)}{n!}$ with the new $c$.',
});

ci({
  id: 'ci-s25-0424', topic: PTS, src: 'Check-in, Spring 2025', v: false, diff: 1,
  q: 'In polar coordinates, $x = r\\sin\\theta$ and $y = r\\cos\\theta$.',
  why: 'The two are swapped. $\\theta$ is measured from the positive $x$-axis, so the **adjacent** side is $x$: $x = r\\cos\\theta$ and $y = r\\sin\\theta$.',
  keyWhy: 'Draw the right triangle with hypotenuse $r$ and angle $\\theta$ at the origin measured from the positive $x$-axis. Then $\\cos\\theta = \\frac{x}{r}$ and $\\sin\\theta = \\frac{y}{r}$, giving $x = r\\cos\\theta$, $y = r\\sin\\theta$.',
  hints: [
    'Draw the triangle: hypotenuse $r$, angle $\\theta$ from the positive $x$-axis.',
    'Which side is adjacent to $\\theta$, and which is opposite?',
    'Adjacent is $x$, so $\\cos\\theta = x/r$.',
  ],
  steps: [
    '$\\theta$ is measured counterclockwise from the positive $x$-axis.',
    'The horizontal leg (adjacent) is $x$; the vertical leg (opposite) is $y$; the hypotenuse is $r$.',
    '$\\cos\\theta = \\dfrac{\\text{adjacent}}{\\text{hyp}} = \\dfrac{x}{r} \\Rightarrow x = r\\cos\\theta$.',
    '$\\sin\\theta = \\dfrac{\\text{opposite}}{\\text{hyp}} = \\dfrac{y}{r} \\Rightarrow y = r\\sin\\theta$.',
  ],
  recall: '$x = r\\cos\\theta$, $y = r\\sin\\theta$. Cosine goes with $x$ — both come first alphabetically and on the axis.',
  fix: 'Sketch the triangle rather than recalling the formula. Two seconds, no ambiguity.',
});

export const checkins = { unit: 'checkins', problems: P, generators: G };
