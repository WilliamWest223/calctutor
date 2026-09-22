// ---------------------------------------------------------------
// bank/formulas.js — the reference sheet.
// Grouped by unit so the Formula Sheet screen can mirror the
// curriculum, and searchable by name, formula text, or note.
// ---------------------------------------------------------------

export const FORMULAS = [
  {
    unit: 'precalc', group: 'Algebra',
    items: [
      { n: 'Exponent rules', t: 'x^{a}x^{b}=x^{a+b},\\quad \\frac{x^{a}}{x^{b}}=x^{a-b},\\quad (x^{a})^{b}=x^{ab}' },
      { n: 'Negative & fractional powers', t: 'x^{-n}=\\frac{1}{x^{n}},\\qquad \\sqrt[n]{x^{m}}=x^{m/n}' },
      { n: 'Difference of squares', t: 'a^{2}-b^{2}=(a-b)(a+b)', note: 'A sum of squares does not factor over the reals.' },
      { n: 'Sum / difference of cubes', t: 'a^{3}\\pm b^{3}=(a\\pm b)(a^{2}\\mp ab+b^{2})', note: 'SOAP: Same, Opposite, Always Positive.' },
      { n: 'Completing the square', t: 'x^{2}+bx+c=\\left(x+\\tfrac b2\\right)^{2}+c-\\tfrac{b^{2}}{4}', note: 'Turns an unfactorable quadratic into an arctangent form.' },
      { n: 'Absolute value inequality', t: '|x-c|<R \\iff c-R<x<c+R', note: 'Exactly the structure of an interval of convergence.' },
      { n: 'Quadratic formula', t: 'x=\\frac{-b\\pm\\sqrt{b^{2}-4ac}}{2a}' },
    ],
  },
  {
    unit: 'precalc', group: 'Logs & exponentials',
    items: [
      { n: 'Product / quotient / power', t: '\\ln(ab)=\\ln a+\\ln b,\\quad \\ln\\tfrac ab=\\ln a-\\ln b,\\quad \\ln(a^{b})=b\\ln a', note: 'There is no rule for $\\ln(a+b)$.' },
      { n: 'Inverses', t: 'e^{\\ln x}=x,\\qquad \\ln(e^{x})=x' },
      { n: 'Change of base', t: '\\log_b x=\\frac{\\ln x}{\\ln b}' },
      { n: 'Other bases', t: 'b^{x}=e^{x\\ln b}', note: 'How $\\int b^{x}dx=\\frac{b^{x}}{\\ln b}$ arises.' },
    ],
  },
  {
    unit: 'precalc', group: 'Trigonometry',
    items: [
      { n: 'Pythagorean', t: '\\sin^{2}\\theta+\\cos^{2}\\theta=1,\\quad 1+\\tan^{2}\\theta=\\sec^{2}\\theta,\\quad 1+\\cot^{2}\\theta=\\csc^{2}\\theta' },
      { n: 'Double angle', t: '\\sin 2\\theta=2\\sin\\theta\\cos\\theta,\\qquad \\cos2\\theta=\\cos^{2}\\theta-\\sin^{2}\\theta' },
      { n: 'Half angle (power reduction)', t: '\\sin^{2}\\theta=\\frac{1-\\cos2\\theta}{2},\\qquad \\cos^{2}\\theta=\\frac{1+\\cos2\\theta}{2}', note: 'Sine takes the minus. The workhorse for even trig powers.' },
      { n: 'Exact values', t: '\\sin\\tfrac\\pi6=\\tfrac12,\\ \\sin\\tfrac\\pi4=\\tfrac{\\sqrt2}{2},\\ \\sin\\tfrac\\pi3=\\tfrac{\\sqrt3}{2}' },
      { n: 'Inverse ranges', t: '\\sin^{-1}\\!\\in\\!\\left[-\\tfrac\\pi2,\\tfrac\\pi2\\right],\\quad \\cos^{-1}\\!\\in\\![0,\\pi],\\quad \\tan^{-1}\\!\\in\\!\\left(-\\tfrac\\pi2,\\tfrac\\pi2\\right)' },
    ],
  },
  {
    unit: 'precalc', group: 'Geometry & sums',
    items: [
      { n: 'Circle', t: 'A=\\pi r^{2},\\qquad C=2\\pi r' },
      { n: 'Sphere', t: 'V=\\tfrac43\\pi r^{3},\\qquad S=4\\pi r^{2}' },
      { n: 'Cylinder / cone', t: 'V_{\\text{cyl}}=\\pi r^{2}h,\\qquad V_{\\text{cone}}=\\tfrac13\\pi r^{2}h' },
      { n: 'Sum formulas', t: '\\sum_{i=1}^{n} i=\\frac{n(n+1)}{2},\\quad \\sum_{i=1}^{n} i^{2}=\\frac{n(n+1)(2n+1)}{6}' },
    ],
  },

  {
    unit: 'foundations', group: 'Derivatives',
    items: [
      { n: 'Product / quotient', t: '(uv)\'=u\'v+uv\',\\qquad \\left(\\tfrac uv\\right)\'=\\frac{u\'v-uv\'}{v^{2}}' },
      { n: 'Chain rule', t: '\\frac{d}{dx}f(g(x))=f\'(g(x))\\,g\'(x)' },
      { n: 'Trig', t: '(\\sin)\'=\\cos,\\ (\\cos)\'=-\\sin,\\ (\\tan)\'=\\sec^{2},\\ (\\sec)\'=\\sec\\tan' },
      { n: 'Inverse trig', t: '(\\sin^{-1}x)\'=\\frac{1}{\\sqrt{1-x^{2}}},\\qquad (\\tan^{-1}x)\'=\\frac{1}{1+x^{2}}' },
      { n: 'Log & exp', t: '(\\ln x)\'=\\frac1x,\\quad (e^{x})\'=e^{x},\\quad (b^{x})\'=b^{x}\\ln b' },
      { n: 'Hyperbolic', t: '(\\sinh)\'=\\cosh,\\quad (\\cosh)\'=\\sinh,\\quad (\\tanh)\'=\\operatorname{sech}^{2}', note: 'No sign flips, unlike circular trig.' },
    ],
  },
  {
    unit: 'foundations', group: 'Core integrals',
    items: [
      { n: 'Power rule', t: '\\int x^{n}dx=\\frac{x^{n+1}}{n+1}+C\\ (n\\ne-1),\\qquad \\int\\frac{dx}{x}=\\ln|x|+C' },
      { n: 'Exponential', t: '\\int e^{kx}dx=\\frac{e^{kx}}{k}+C,\\qquad \\int b^{x}dx=\\frac{b^{x}}{\\ln b}+C' },
      { n: 'Trig', t: '\\int\\sin x\\,dx=-\\cos x+C,\\qquad \\int\\sec^{2}x\\,dx=\\tan x+C' },
      { n: 'Tangent & secant', t: '\\int\\tan x\\,dx=\\ln|\\sec x|+C,\\qquad \\int\\sec x\\,dx=\\ln|\\sec x+\\tan x|+C' },
      { n: 'Inverse trig forms', t: '\\int\\frac{dx}{a^{2}+x^{2}}=\\frac1a\\tan^{-1}\\frac xa+C,\\qquad \\int\\frac{dx}{\\sqrt{a^{2}-x^{2}}}=\\sin^{-1}\\frac xa+C', note: 'Arctan carries the $\\frac1a$; arcsin does not.' },
      { n: 'FTC', t: '\\frac{d}{dx}\\int_a^{u(x)}f(t)\\,dt=f(u(x))\\,u\'(x)' },
    ],
  },

  {
    unit: 'foundations', group: 'Integral flashcards (his list)',
    items: [
      { n: 'Powers & reciprocal', t: '\\int x^{n}dx=\\frac{x^{n+1}}{n+1}+C\\;(n\\ne-1),\\qquad \\int\\frac{dx}{x}=\\ln|x|+C' },
      { n: 'Sine & cosine', t: '\\int\\sin x\\,dx=-\\cos x+C,\\qquad \\int\\cos x\\,dx=\\sin x+C' },
      { n: 'Tangent & cotangent', t: '\\int\\tan x\\,dx=\\ln|\\sec x|+C,\\qquad \\int\\cot x\\,dx=\\ln|\\sin x|+C' },
      { n: 'Secant & cosecant', t: '\\int\\sec x\\,dx=\\ln|\\sec x+\\tan x|+C,\\qquad \\int\\csc x\\,dx=\\ln|\\csc x-\\cot x|+C', note: 'These two are pure memorisation — he expects them cold.' },
      { n: 'Squared secant & cosecant', t: '\\int\\sec^{2}x\\,dx=\\tan x+C,\\qquad \\int\\csc^{2}x\\,dx=-\\cot x+C' },
      { n: 'Secant·tangent, cosecant·cotangent', t: '\\int\\sec x\\tan x\\,dx=\\sec x+C,\\qquad \\int\\csc x\\cot x\\,dx=-\\csc x+C' },
      { n: 'Exponentials', t: '\\int e^{x}dx=e^{x}+C,\\qquad \\int a^{x}dx=\\frac{a^{x}}{\\ln a}+C' },
      { n: 'Logarithm', t: '\\int\\ln x\\,dx=x\\ln x-x+C', note: 'By parts with $u=\\ln x$, $dv=dx$.' },
      { n: 'Inverse trig forms', t: '\\int\\frac{dx}{1+x^{2}}=\\arctan x+C,\\quad \\int\\frac{dx}{\\sqrt{1-x^{2}}}=\\arcsin x+C,\\quad \\int\\frac{dx}{x\\sqrt{x^{2}-1}}=\\sec^{-1}|x|+C' },
    ],
  },
  {
    unit: 'techniques', group: 'Techniques',
    items: [
      { n: 'Linear $u$-sub (in your head)', t: '\\int f(ax+b)\\,dx=\\frac{1}{a}F(ax+b)+C', note: 'Integrate the outer function, divide by the inner coefficient. Only works when the inside is linear.' },
      { n: 'Integration by parts', t: '\\int u\\,dv=uv-\\int v\\,du', note: 'LIATE picks $u$: Log, Inverse trig, Algebraic, Trig, Exponential. The "rule of 7" box is this in tabular form.' },
      { n: 'Tabular integration', t: '\\int x^{n}f(x)\\,dx', note: 'Derivatives down the left until $0$, antiderivatives down the right, pair diagonally, alternate $+,-,+,-$. Use when the polynomial factor dies.' },
      { n: 'Looping integrals', t: 'I=\\cdots+kI \\;\\Rightarrow\\; (1-k)I=\\cdots', note: 'When neither factor dies, parts twice returns the original — solve for $I$ algebraically. Keep $u$ and $dv$ consistent.' },
      { n: 'Product-to-sum', t: '\\sin\\theta\\cos\\phi=\\frac{\\sin(\\theta+\\phi)+\\sin(\\theta-\\phi)}{2}', note: 'For $\\int\\sin(ax)\\cos(bx)dx$ with $a\\ne b$. The fastest route on his exams.' },
      { n: 'Product-to-sum (others)', t: '\\cos\\theta\\cos\\phi=\\frac{\\cos(\\theta-\\phi)+\\cos(\\theta+\\phi)}{2},\\qquad \\sin\\theta\\sin\\phi=\\frac{\\cos(\\theta-\\phi)-\\cos(\\theta+\\phi)}{2}' },
      { n: 'Trig substitution', t: '\\sqrt{a^{2}-x^{2}}\\to a\\sin\\theta,\\quad \\sqrt{a^{2}+x^{2}}\\to a\\tan\\theta,\\quad \\sqrt{x^{2}-a^{2}}\\to a\\sec\\theta' },
      { n: 'Odd trig powers', t: '\\int\\sin^{m}x\\cos^{n}x\\,dx', note: 'Odd power → peel one factor off for $du$, convert the rest with $\\sin^2+\\cos^2=1$. Both even → half-angle.' },
      { n: 'Partial fractions', t: '\\frac{P(x)}{(x-a)^{k}(x^{2}+bx+c)}=\\frac{A_1}{x-a}+\\cdots+\\frac{A_k}{(x-a)^{k}}+\\frac{Bx+C}{x^{2}+bx+c}', note: 'Numerator degree must be lower — divide first if not.' },
      { n: 'Trapezoid rule', t: 'T_n=\\frac{\\Delta x}{2}\\left[f_0+2f_1+\\cdots+2f_{n-1}+f_n\\right]', note: 'Error $\\le\\frac{K(b-a)^{3}}{12n^{2}}$, $K\\ge|f\'\'|$.' },
      { n: "Simpson's rule", t: 'S_n=\\frac{\\Delta x}{3}\\left[f_0+4f_1+2f_2+\\cdots+4f_{n-1}+f_n\\right]', note: '$n$ must be even. Error $\\le\\frac{K(b-a)^{5}}{180n^{4}}$, $K\\ge|f^{(4)}|$. Exact for cubics.' },
      { n: 'Improper $p$-test', t: '\\int_1^\\infty\\frac{dx}{x^{p}}\\text{ converges} \\iff p>1;\\qquad \\int_0^1\\frac{dx}{x^{p}}\\text{ converges} \\iff p<1', note: 'Opposite directions. Note *where* the trouble is.' },
    ],
  },

  {
    unit: 'applications', group: 'Applications',
    items: [
      { n: 'Area between curves', t: 'A=\\int_a^b\\left[\\text{top}-\\text{bottom}\\right]dx' },
      { n: 'Disks / washers', t: 'V=\\pi\\int_a^b\\left[R(x)^{2}-r(x)^{2}\\right]dx', note: 'Difference of squares — never $(R-r)^{2}$.' },
      { n: 'Cylindrical shells', t: 'V=2\\pi\\int_a^b (\\text{radius})(\\text{height})\\,dx', note: 'Nothing gets squared.' },
      { n: 'Arc length', t: 'L=\\int_a^b\\sqrt{1+\\left[f\'(x)\\right]^{2}}\\,dx' },
      { n: 'Surface of revolution', t: 'S=\\int 2\\pi r\\,ds,\\qquad ds=\\sqrt{1+\\left[f\'(x)\\right]^{2}}\\,dx' },
      { n: 'Work', t: 'W=\\int F(x)\\,dx', note: 'Springs: $F=kx$. Pumping: weight of a slice × the distance *that slice* moves.' },
      { n: 'Average value', t: 'f_{\\text{avg}}=\\frac{1}{b-a}\\int_a^b f(x)\\,dx' },
      { n: 'Centroid', t: '\\bar x=\\frac1A\\int_a^b x f(x)\\,dx,\\qquad \\bar y=\\frac1A\\int_a^b\\frac{[f(x)]^{2}}{2}dx' },
    ],
  },

  {
    unit: 'diffeq', group: 'Differential equations',
    items: [
      { n: 'Separable', t: '\\frac{dy}{dx}=g(x)h(y)\\ \\Rightarrow\\ \\int\\frac{dy}{h(y)}=\\int g(x)\\,dx' },
      { n: 'Exponential growth', t: 'y\'=ky\\ \\Rightarrow\\ y=y_0e^{kt}' },
      { n: 'Logistic', t: '\\frac{dP}{dt}=kP\\left(1-\\frac PK\\right)', note: '$K$ = carrying capacity = the limit. $K/2$ = fastest growth.' },
      { n: 'First-order linear', t: 'y\'+P(x)y=Q(x),\\qquad \\mu=e^{\\int P\\,dx},\\qquad (\\mu y)\'=\\mu Q' },
      { n: "Euler's method", t: 'y_{n+1}=y_n+h\\,f(x_n,y_n)', note: 'Recompute the slope at every new point.' },
      { n: 'Newton cooling', t: 'T(t)=T_s+(T_0-T_s)e^{-kt}' },
    ],
  },

  {
    unit: 'series', group: 'Convergence tests',
    items: [
      { n: 'Divergence test', t: '\\lim a_n\\ne0 \\Rightarrow \\sum a_n \\text{ diverges}', note: 'One-way only. $\\lim a_n=0$ proves nothing.' },
      { n: 'Geometric series', t: '\\sum_{n=0}^{\\infty}ar^{n}=\\frac{a}{1-r}\\ (|r|<1)', note: 'Numerator is the *first term present*.' },
      { n: '$p$-series', t: '\\sum\\frac{1}{n^{p}} \\text{ converges} \\iff p>1' },
      { n: 'Integral test', t: '\\sum_{n=N}^\\infty f(n) \\text{ and } \\int_N^\\infty f\\,dx \\text{ agree}', note: 'Needs $f$ continuous, positive, decreasing.' },
      { n: 'Comparison', t: 'a_n\\le b_n:\\ \\textstyle\\sum b_n \\text{ conv}\\Rightarrow\\sum a_n \\text{ conv}', note: 'Smaller than convergent, or bigger than divergent. Nothing else helps.' },
      { n: 'Limit comparison', t: '\\lim\\frac{a_n}{b_n}=L\\in(0,\\infty) \\Rightarrow \\text{both do the same}' },
      { n: 'Alternating series', t: 'b_n \\downarrow 0 \\Rightarrow \\sum(-1)^{n}b_n \\text{ converges}', note: 'Error: $|S-s_n|\\le b_{n+1}$ — the first term you left out.' },
      { n: 'Ratio test', t: 'L=\\lim\\left|\\frac{a_{n+1}}{a_n}\\right|', note: '$L<1$ converges, $L>1$ diverges, $L=1$ tells you nothing.' },
      { n: 'Root test', t: 'L=\\lim\\sqrt[n]{|a_n|}', note: 'Best when the whole term is an $n$th power.' },
    ],
  },
  {
    unit: 'series', group: 'Power & Taylor series',
    items: [
      { n: 'Taylor series', t: 'f(x)=\\sum_{n=0}^{\\infty}\\frac{f^{(n)}(a)}{n!}(x-a)^{n}' },
      { n: 'Taylor remainder', t: '|R_n(x)|\\le\\frac{M|x-a|^{n+1}}{(n+1)!},\\quad M\\ge\\left|f^{(n+1)}\\right|', note: 'Degree $n$ → derivative $n+1$. $M$ bounds the whole interval.' },
      { n: 'Geometric', t: '\\frac{1}{1-x}=\\sum_{n=0}^{\\infty}x^{n},\\quad |x|<1' },
      { n: 'Exponential', t: 'e^{x}=\\sum_{n=0}^{\\infty}\\frac{x^{n}}{n!}' },
      { n: 'Sine & cosine', t: '\\sin x=\\sum\\frac{(-1)^{n}x^{2n+1}}{(2n+1)!},\\qquad \\cos x=\\sum\\frac{(-1)^{n}x^{2n}}{(2n)!}' },
      { n: 'Log & arctangent', t: '\\ln(1+x)=\\sum\\frac{(-1)^{n-1}x^{n}}{n},\\qquad \\tan^{-1}x=\\sum\\frac{(-1)^{n}x^{2n+1}}{2n+1}' },
      { n: 'Binomial series', t: '(1+x)^{k}=\\sum_{n=0}^{\\infty}\\binom{k}{n}x^{n},\\quad |x|<1' },
      { n: 'Radius of convergence', t: '|x-c|<R', note: 'Radius from the Ratio Test; the two endpoints must be tested separately.' },
    ],
  },

  {
    unit: 'polar', group: 'Parametric & polar',
    items: [
      { n: 'Parametric slope', t: '\\frac{dy}{dx}=\\frac{dy/dt}{dx/dt}' },
      { n: 'Parametric second derivative', t: '\\frac{d^{2}y}{dx^{2}}=\\frac{\\frac{d}{dt}\\!\\left(\\frac{dy}{dx}\\right)}{dx/dt}' },
      { n: 'Parametric arc length', t: 'L=\\int_a^b\\sqrt{\\left(\\tfrac{dx}{dt}\\right)^{2}+\\left(\\tfrac{dy}{dt}\\right)^{2}}\\,dt' },
      { n: 'Polar ↔ rectangular', t: 'x=r\\cos\\theta,\\quad y=r\\sin\\theta,\\quad r^{2}=x^{2}+y^{2}' },
      { n: 'Polar area', t: 'A=\\frac12\\int_\\alpha^\\beta r^{2}\\,d\\theta', note: 'Both the $\\frac12$ and the square are essential.' },
      { n: 'Polar arc length', t: 'L=\\int_\\alpha^\\beta\\sqrt{r^{2}+\\left(\\tfrac{dr}{d\\theta}\\right)^{2}}\\,d\\theta' },
      { n: 'Rose petals', t: 'r=\\cos(k\\theta)', note: '$k$ odd → $k$ petals. $k$ even → $2k$ petals.' },
    ],
  },
];

/** Flat, searchable list. */
export function searchFormulas(q) {
  const s = String(q || '').toLowerCase().trim();
  if (!s) return [];
  const out = [];
  for (const g of FORMULAS) {
    for (const it of g.items) {
      const hay = `${it.n} ${it.t} ${it.note || ''} ${g.group}`.toLowerCase();
      if (hay.includes(s)) out.push({ ...it, group: g.group, unit: g.unit });
    }
  }
  return out;
}
