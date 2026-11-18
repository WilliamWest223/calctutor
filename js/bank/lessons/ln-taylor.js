// js/bank/lessons/ln-taylor.js — rewritten lesson (run fin). Contract: .hnic/context/fin-contract.md
const R = String.raw;
const U = 'series', T = 'Taylor & Maclaurin Series';

export default {
  id: 'ln-taylor',
  goal: R`Build the Taylor polynomial $T_N(x)$ and the Taylor series of a function at a centre $c$ from its derivatives, write down the six standard Maclaurin series with their intervals, and make new series from them by substituting, multiplying, differentiating or integrating.`,
  why: R`Exam 3 Q1 is an 18-point table of six Maclaurin series with sigma notation and interval of convergence. Q2 is a Taylor series "from scratch" at a centre like $x=-1$. Q4 is a substitution like $x\cos(x^{3})$. Together that is the biggest block of points on the exam.`,
  plain: R`Some functions are hard to compute. Your calculator cannot "do" $e^{0.1}$ or $\sin(0.3)$ directly. It can only add and multiply. So the question is: can you swap a hard function for a polynomial that acts the same near one point?

Think of copying a road. First you start at the same spot. Then you point the same direction. Then you bend the same way. Each extra match keeps your copy on the road a little longer. A Taylor polynomial does exactly that. It matches the value of $f$ at a point $c$, then the slope, then the bend, and so on.

If you keep adding matching terms forever, you get a Taylor series. It is an infinite polynomial, a power series. Inside its interval of convergence it equals the function exactly.

The centre $c$ is the spot you copy from. When $c=0$ the series has a special name: a Maclaurin series. Six Maclaurin series show up again and again. You memorise those six. Then you build almost everything else from them.`,
  prereq: [
    { term: R`derivative $f^{(n)}(c)$`, means: R`the $n$-th derivative of $f$, plugged in at $x=c$. $f^{(0)}$ is just $f$ itself.` },
    { term: R`factorial $n!$`, means: R`$n! = 1\cdot2\cdot3\cdots n$, with $0!=1$. Example: $4!=24$.` },
    { term: 'power series', means: R`an infinite sum $\sum a_n(x-c)^n$. The numbers $a_n$ are the coefficients, $c$ is the centre.` },
    { term: 'interval of convergence', means: R`the set of $x$ values where the infinite sum adds up to a finite number. Its half-width is the radius $R$.` },
    { term: 'geometric series', means: R`$\sum r^{n} = \dfrac{1}{1-r}$ when $|r|<1$, and it diverges when $|r|\ge1$.` },
  ],
  sections: [
    {
      h: 'Copy a function with a polynomial',
      body: R`Start small. Say you only know three facts about $f$ at $x=2$: $f(2)=5$, $f'(2)=-3$, $f''(2)=8$. You want a polynomial $p(x)$ that has the same three facts.

Try $p(x)=a_0+a_1(x-2)+a_2(x-2)^2$. Plug in $x=2$: every $(x-2)$ term is $0$, so $p(2)=a_0$. That forces $a_0=5$. Take one derivative: $p'(2)=a_1$, so $a_1=-3$. Take two derivatives: $p''(x)=2a_2$, so $2a_2=8$ and $a_2=4$.

Notice the $2$ that appeared. Each time you differentiate $(x-c)^n$ down to a constant, you get $n!$. That is why the formula divides by $n!$.

In words: coefficient number $n$ is the $n$-th derivative at the centre, divided by $n!$.`,
      check: { q: R`If $f(0)=1$, $f'(0)=4$, $f''(0)=6$, what is the coefficient of $x^{2}$?`, a: R`$\dfrac{f''(0)}{2!}=\dfrac{6}{2}=3$.` },
    },
    {
      h: 'The Taylor polynomial $T_N(x)$',
      body: R`Now write the general rule. The Taylor polynomial of degree $N$ with centre $c$ is

$T_N(x)=\displaystyle\sum_{n=0}^{N}\frac{f^{(n)}(c)}{n!}(x-c)^{n} = f(c)+f'(c)(x-c)+\frac{f''(c)}{2!}(x-c)^{2}+\frac{f'''(c)}{3!}(x-c)^{3}+\cdots$

Here $N$ is how many derivatives you match. $c$ is the centre. $n$ is the counter that runs $0,1,2,\dots,N$.

His example: $T_3$ for $f(x)=x^{3}+2x^{2}-x+1$ with centre $x=1$. Make a derivative table and plug in $x=1$ right away: $f(1)=3$, $f'(x)=3x^{2}+4x-1$ gives $6$, $f''(x)=6x+4$ gives $10$, $f'''(x)=6$ gives $6$. Divide by $0!,1!,2!,3!$: $T_3(x)=3+6(x-1)+5(x-1)^{2}+(x-1)^{3}$.

Watch the sign inside: centre $c=1$ gives $(x-1)$; a centre $c=-3$ gives $(x+3)$.`,
      check: { q: R`What do you write inside the powers for centre $c=-2$?`, a: R`$(x-(-2))=(x+2)$, so powers of $(x+2)$.` },
    },
    {
      h: 'Let $N$ go to infinity: Taylor and Maclaurin series',
      body: R`Keep matching more derivatives and let $N\to\infty$. You get the Taylor series

$T(x)=\displaystyle\sum_{n=0}^{\infty}\frac{f^{(n)}(c)}{n!}(x-c)^{n}.$

It is a power series, so everything from the power-series lesson still holds. It has a radius $R$ and an interval of convergence. Inside that interval the series equals $f(x)$.

A **Maclaurin series** is a Taylor series with centre $c=0$. Then $(x-c)^{n}$ is just $x^{n}$, and you need the numbers $f^{(n)}(0)$.

One useful reverse fact: if you already know a series, coefficient number $n$ equals $\dfrac{f^{(n)}(c)}{n!}$. So $f^{(n)}(c)=n!\times(\text{coefficient})$. That lets you read a high derivative straight off a series without differentiating.`,
      check: { q: R`The Maclaurin series of $f$ has $x^{3}$ coefficient $2$. What is $f'''(0)$?`, a: R`$3!\cdot2=12$.` },
    },
    {
      h: 'From scratch: find the pattern for $f^{(n)}(c)$',
      body: R`When the exam says "from scratch" or "do not use known series", you must build the series from derivatives. The trick is to find a formula for $f^{(n)}(c)$ in terms of $n$.

His example: $f(x)=\dfrac{1}{x}$ at $c=-3$. Write $f=x^{-1}$. Then $f'=-x^{-2}$, $f''=2x^{-3}$, $f'''=-6x^{-4}$. Plug in $-3$ and keep numbers unmultiplied so the pattern shows: $f(-3)=-\dfrac{1}{3}$, $f'(-3)=-\dfrac{1}{3^{2}}$, $f''(-3)=-\dfrac{1\cdot2}{3^{3}}$, $f'''(-3)=-\dfrac{1\cdot2\cdot3}{3^{4}}$.

Pattern: $f^{(n)}(-3)=-\dfrac{n!}{3^{n+1}}$. Divide by $n!$ and the factorials cancel: $\displaystyle\frac{1}{x}=\sum_{n=0}^{\infty}\frac{-1}{3^{n+1}}(x+3)^{n}$.

Why compute four derivatives? Three numbers can fit many patterns. The fourth one confirms the sign and the factorial. Last step: check $n=0,1$ in your sigma against your table.`,
      check: { q: R`For $f(x)=\frac1x$ at $c=-3$, $f^{(n)}(-3)=-\dfrac{n!}{3^{n+1}}$. What is the coefficient of $(x+3)^{n}$ after dividing by $n!$?`, a: R`$-\dfrac{n!}{3^{n+1}\,n!}=-\dfrac{1}{3^{n+1}}$.` },
    },
    {
      h: 'The six Maclaurin series to memorise',
      body: R`These six are the exam Q1 table. Learn the sigma form AND the interval.

$\dfrac{1}{1-x}=\displaystyle\sum_{n=0}^{\infty}x^{n}$ on $(-1,1)$.

$e^{x}=\displaystyle\sum_{n=0}^{\infty}\frac{x^{n}}{n!}$ on $(-\infty,\infty)$.

$\sin x=\displaystyle\sum_{n=0}^{\infty}(-1)^{n}\frac{x^{2n+1}}{(2n+1)!}$ on $(-\infty,\infty)$.

$\cos x=\displaystyle\sum_{n=0}^{\infty}(-1)^{n}\frac{x^{2n}}{(2n)!}$ on $(-\infty,\infty)$.

$\ln(1+x)=\displaystyle\sum_{n=1}^{\infty}(-1)^{n+1}\frac{x^{n}}{n}$ on $(-1,1]$.

$\arctan x=\displaystyle\sum_{n=0}^{\infty}(-1)^{n}\frac{x^{2n+1}}{2n+1}$ on $[-1,1]$.

Memory hooks. Sine is an odd function, so it has odd powers $2n+1$. Cosine is even, so even powers $2n$. Only $e^{x}$, $\sin$, $\cos$ have factorials; that is why they converge for every $x$. The three with radius $1$ differ at the endpoints. $\frac{1}{1-x}$ keeps neither endpoint (terms do not shrink). $\ln(1+x)$ keeps $x=1$ (alternating harmonic) but not $x=-1$ (harmonic). $\arctan$ keeps both (alternating each time). Note $\ln(1+x)$ starts at $n=1$, because $\ln 1=0$.`,
      check: { q: R`Which of the six converges at $x=1$ but not at $x=-1$?`, a: R`$\ln(1+x)$: interval $(-1,1]$.` },
    },
    {
      h: 'New series by substitution and multiplication',
      body: R`Most exam functions are a known series in disguise. Replace $x$ by something, then multiply by what is outside.

His Q4: $x\cos(x^{3})$. Start with $\cos u=\sum(-1)^{n}\dfrac{u^{2n}}{(2n)!}$. Put $u=x^{3}$: $(x^{3})^{2n}=x^{6n}$ (powers multiply). Multiply by $x$: $x\cdot x^{6n}=x^{6n+1}$ (powers add). Result: $\displaystyle\sum_{n=0}^{\infty}(-1)^{n}\frac{x^{6n+1}}{(2n)!}$, for all $x$.

Rational functions go through the geometric series. Force the shape $\dfrac{1}{1-u}$ by factoring out the constant: $\dfrac{1}{2+x}=\dfrac{1}{2}\cdot\dfrac{1}{1-(-x/2)}=\displaystyle\sum_{n=0}^{\infty}\frac{(-1)^{n}x^{n}}{2^{n+1}}$.

The interval moves with the substitution. The geometric series needs $|u|<1$. Here $|-x/2|<1$ means $|x|<2$, so $R=2$, not $1$. Substituting is not differentiating, so no chain-rule factor appears.`,
      check: { q: R`What is the $n$-th term of the Maclaurin series of $e^{x^{2}}$?`, a: R`$\dfrac{(x^{2})^{n}}{n!}=\dfrac{x^{2n}}{n!}$.` },
    },
    {
      h: 'Differentiate or integrate term by term',
      body: R`Inside its radius, a power series behaves like a long polynomial. You can differentiate or integrate it one term at a time. The radius stays the same (endpoints can change, so recheck them if asked).

Example: differentiate $\dfrac{1}{1-x}=1+x+x^{2}+x^{3}+\cdots$. Left side gives $\dfrac{1}{(1-x)^{2}}$. Right side gives $1+2x+3x^{2}+\cdots=\displaystyle\sum_{n=1}^{\infty}nx^{n-1}$.

Example: integrate. $\dfrac{1}{1+t^{2}}=\sum(-1)^{n}t^{2n}$. Integrate from $0$ to $x$: each $t^{2n}$ becomes $\dfrac{x^{2n+1}}{2n+1}$. That is where the $\arctan x$ series comes from.

Use this when no algebra trick turns your function into one of the six, but its derivative or integral is one of them. A classic exam use: $\displaystyle\int_0^{x}e^{-t^{2}}\,dt$ has no elementary antiderivative, but its series is easy.`,
      check: { q: R`Integrate $\sum_{n=0}^{\infty}(-1)^{n}t^{2n}$ from $0$ to $x$. What is the new exponent?`, a: R`$2n+1$, with denominator $2n+1$: $\sum(-1)^{n}\dfrac{x^{2n+1}}{2n+1}$.` },
    },
    // ---- ex3 interactive additions ----
    {
      h: 'Lab: why the radius is 1 for arctan and ln(1+x)',
      body: R`Open the lab. Pick $\arctan x$ and raise the degree. Inside $|x|<1$ the polynomials hug the curve. Past $|x|=1$ they fly away, even though $\arctan x$ itself is perfectly tame. The function is fine there. The series is what breaks.

Now slide "evaluate at" to $x=1$ and then $x=1.5$. At $1$ the sums settle (alternating series). At $1.5$ they blow up as the degree grows.`,
      widget: { lab: 'taylor', set: { fn: 'arctan x', deg: 9, at: 1.5 }, caption: R`Raise the degree at $x=1.5$: the error grows. At $x=1$ it settles. Radius is $1$, and $[-1,1]$ is the interval.` },
    },
    {
      h: 'Lab: ln(1+x) keeps one endpoint',
      body: R`Switch to $\ln(1+x)$. Its series is $x-\frac{x^2}{2}+\frac{x^3}{3}-\cdots$. The function blows up at $x=-1$, so the series cannot work there. At $x=1$ the series is the alternating harmonic series, which converges to $\ln 2$.

Set "evaluate at" to $1$ and raise the degree: the polynomials creep toward $\ln 2\approx0.69$. Set it to $1.5$: they diverge.`,
      widget: { lab: 'taylor', set: { fn: 'ln(1+x)', deg: 8, at: 1.5 }, caption: R`At $x=1.5$ the polynomials move away from $\ln 2.5$. The interval is $(-1,1]$.` },
      // src: buddy Q1 (interval column)
      try: { q: R`Which function's Maclaurin series converges at $x=1$ but diverges at $x=-1$?`,
        choices: [
          { t: R`$\ln(1+x)$`, ok: true, why: R`At $x=1$ it is the alternating harmonic series (converges). At $x=-1$ it is $-\sum\frac1n$ (diverges). Interval $(-1,1]$.` },
          { t: R`$\arctan x$`, why: R`Both endpoints converge by the alternating series test, so the interval is $[-1,1]$.` },
          { t: R`$\dfrac{1}{1-x}$`, why: R`The terms $x^n$ do not go to $0$ at $x=\pm1$, so both endpoints diverge.` },
          { t: R`$e^{x}$`, why: R`$e^x$ has no finite radius: it converges at every $x$, so it has no endpoint to fail.` },
        ] },
    },
    {
      h: 'Try: the Q1 table, first two nonzero terms',
      body: R`Q1 asks for the first two NONZERO terms. Zero terms do not count. Find the first power that has a nonzero coefficient, then the next one.

For $\ln(1+x)$ the pattern $f^{(n)}(0)$ starts at $n=1$. The $n=0$ value is $\ln 1=0$. So the first nonzero term is the $x$ term. Write the sigma first, plug in $n=1$ and $n=2$, and read off both terms. Do this for every row of the table.`,
      // src: buddy Q1 (lost the point on ln(1+x): wrote cos x's terms 1 - x^2/2); the ln(1+x) row itself is tested in ln-exam3
      try: { q: R`Same rule, another row: first two nonzero terms of the Maclaurin series of $\cos x$?`,
        choices: [
          { t: R`$1-\dfrac{x^{2}}{2}$`, ok: true, why: R`$\cos x=\sum(-1)^n\frac{x^{2n}}{(2n)!}$; $n=0,1$ give $1$ and $-\frac{x^2}{2!}=-\frac{x^2}{2}$. Odd powers are zero and skipped. This is exactly what the Spring '26 paper wrote for $\ln(1+x)$ and lost a point: $1-\frac{x^2}{2}$ belongs to $\cos x$. For $\ln(1+x)$ it is $x-\frac{x^2}{2}$.` },
          { t: R`$x-\dfrac{x^{3}}{6}$`, why: R`That is $\sin x$. Cosine is even: $\cos0=1$, so the constant term is nonzero.` },
          { t: R`$1+\dfrac{x^{2}}{2}$`, why: R`Signs alternate: $(-1)^n$ makes the $x^2$ term negative.` },
          { t: R`$1-x^{2}$`, why: R`Missing the $2!$: the $x^2$ coefficient is $-\frac{1}{2!}$.` },
        ] },
    },
    {
      h: 'Try: arctan first terms (not sine)',
      body: R`Odd functions have only odd powers. So the first two nonzero terms skip the even powers.

Sine and arctan both have odd powers. They differ in the denominator: sine has $(2n+1)!$ and arctan has plain $2n+1$. Plug in $n=0$ and $n=1$ to get the two terms. Compare the second term to the three similar-looking series before you answer.`,
      // src: buddy Q1 (sin, arctan rows)
      try: { q: R`First two nonzero terms of the Maclaurin series of $\arctan x$?`,
        choices: [
          { t: R`$x-\dfrac{x^{3}}{3}$`, ok: true, why: R`Sigma $\sum(-1)^n\frac{x^{2n+1}}{2n+1}$ at $n=0,1$ gives $x$ and $-\frac{x^3}{3}$. No factorial.` },
          { t: R`$x-\dfrac{x^{3}}{3!}$`, why: R`That is the sine series. Arctan has plain $2n+1$ in the denominator, so $3$, not $3!=6$.` },
          { t: R`$1-\dfrac{x^{2}}{2}$`, why: R`That looks like cosine. Arctan is odd, so it has no constant term.` },
          { t: R`$x-\dfrac{x^{2}}{2}$`, why: R`That is $\ln(1+x)$. Arctan is odd, so the next power is $x^3$.` },
        ] },
    },
    {
      h: 'Try: exponents when you substitute and multiply',
      body: R`Substitute first: exponents multiply. Then multiply by the outside factor: exponents add and the coefficient stays. Keep every constant in front.

Do it in two clean steps. Step one: write the known series with $u$ in place of $x$. Step two: replace $u$ and simplify the exponent. Only then multiply by the outside factor. Check $n=0$: the first term should match the first term of the original function.`,
      // src: buddy Q4a
      try: { q: R`Maclaurin series of $2x\sin(x^{3})$?`,
        choices: [
          { t: R`$\displaystyle\sum_{n=0}^{\infty}\frac{2(-1)^{n}x^{6n+4}}{(2n+1)!}$`, ok: true, why: R`$(x^3)^{2n+1}=x^{6n+3}$, times $x$ gives $x^{6n+4}$. The $2$ stays. First term $2x^4$.` },
          { t: R`$\displaystyle\sum_{n=0}^{\infty}\frac{(-1)^{n}x^{6n+4}}{(2n+1)!}$`, why: R`Dropped the $2$. The coefficient from $2x$ must stay in the answer (the buddy lost it here).` },
          { t: R`$\displaystyle\sum_{n=0}^{\infty}\frac{2(-1)^{n}x^{6n+3}}{(2n+1)!}$`, why: R`Forgot to multiply by the outside $x$. $x\cdot x^{6n+3}=x^{6n+4}$.` },
          { t: R`$\displaystyle\sum_{n=0}^{\infty}\frac{2(-1)^{n}x^{3n+4}}{(2n+1)!}$`, why: R`Added $3$ to the exponent instead of multiplying: $(x^3)^{2n+1}=x^{3(2n+1)}=x^{6n+3}$.` },
        ] },
    },
    {
      h: 'Try: c over (a + x), fully simplified',
      body: R`Pull out the constant so the bottom reads $1-u$. Then simplify: write $\left(-\frac{x}{2}\right)^n$ as $\frac{(-1)^nx^n}{2^n}$ and merge the leading $\frac32$ into the denominator.

Fully simplified means one fraction per term, with no stacked powers like $\left(-\frac{x}{2}\right)^{n}$ left in the answer. Put the sign as $(-1)^n$, the numerator as $x^n$, and every constant in the denominator as one power of $2$. Then check $n=0$ against $f(0)$.`,
      // src: buddy Q4b
      try: { q: R`Fully simplified Maclaurin series of $\dfrac{3}{2+x}$?`,
        choices: [
          { t: R`$\displaystyle\sum_{n=0}^{\infty}\frac{3(-1)^{n}x^{n}}{2^{n+1}}$`, ok: true, why: R`$\frac{3}{2}\cdot\frac{1}{1-(-x/2)}$: coefficient $\frac32\cdot\frac{(-1)^n}{2^n}=\frac{3(-1)^n}{2^{n+1}}$. First term $\frac32$.` },
          { t: R`$\displaystyle\sum_{n=0}^{\infty}\frac{3(-1)^{n}x^{n}}{2^{n}}$`, why: R`Missed the extra factor $\frac12$ from pulling out the $2$. At $n=0$ this gives $3$, but $f(0)=\frac32$.` },
          { t: R`$\displaystyle\sum_{n=0}^{\infty}\frac{3x^{n}}{2^{n+1}}$`, why: R`Lost $(-1)^n$. The ratio is $-\frac x2$, so terms alternate.` },
          { t: R`$\displaystyle\sum_{n=0}^{\infty}\frac{3(-1)^{n}x^{n}}{2^{n-1}}$`, why: R`Wrong power of $2$: the denominator is $2\cdot2^n=2^{n+1}$, not $2^{n-1}$.` },
        ] },
    },
    {
      h: 'Try: x to a power times e to the ax',
      body: R`Substitute into $e^x$ first. Then multiply by $x^k$. The new exponent is $x^{n+k}$. It is not $x^{kn}$.

Keep the pieces apart. The $e^{-x/5}$ part gives $\frac{(-1)^nx^n}{5^nn!}$. The outside $x^2$ only changes the exponent of $x$. It never touches $5^n$ or $n!$. Test $n=0$: the first term of $x^2e^{-x/5}$ is $x^2$.`,
      // src: buddy Q4c (wrote x^{2n}); HW3 P2
      try: { q: R`Maclaurin series of $x^{2}e^{-x/5}$?`,
        choices: [
          { t: R`$\displaystyle\sum_{n=0}^{\infty}\frac{(-1)^{n}x^{n+2}}{5^{n}\,n!}$`, ok: true, why: R`$e^{-x/5}=\sum\frac{(-x/5)^n}{n!}$. Times $x^2$ adds $2$ to the exponent: $x^{n+2}$. First term $x^2$.` },
          { t: R`$\displaystyle\sum_{n=0}^{\infty}\frac{(-1)^{n}x^{2n}}{5^{n}\,n!}$`, why: R`The buddy's error: multiplied the exponent instead of adding. $x^2\cdot x^n=x^{n+2}$.` },
          { t: R`$\displaystyle\sum_{n=0}^{\infty}\frac{x^{n+2}}{5^{n}\,n!}$`, why: R`Lost $(-1)^n$ from the minus sign in $-\frac x5$.` },
          { t: R`$\displaystyle\sum_{n=0}^{\infty}\frac{(-1)^{n}x^{n+2}}{5\,n!}$`, why: R`Dropped the power on the $5$: $\left(\frac x5\right)^n$ has $5^n$ in the denominator.` },
        ] },
    },
    {
      h: 'Try: the integral of sin x over x',
      body: R`$\frac{\sin x}{x}$ is one fraction. You cannot split it into $\int\sin x\,dx$ and $\int\frac{1}{x}dx$. Divide the sine series by $x$ term by term. Then integrate each power.

There is no antiderivative of $\frac{\sin x}{x}$ in closed form. A series gives one. Divide the whole sine series by $x$: each power drops by one. Then integrate each power: it rises by one and divides by the new exponent. Finish with $+C$ for an indefinite integral.`,
      // src: buddy Q4d; HW3 P3, P13
      try: { q: R`$\displaystyle\int\frac{\sin x}{x}\,dx=$ ?`,
        choices: [
          { t: R`$C+\displaystyle\sum_{n=0}^{\infty}\frac{(-1)^{n}x^{2n+1}}{(2n+1)(2n+1)!}$`, ok: true, why: R`$\frac{\sin x}{x}=\sum\frac{(-1)^nx^{2n}}{(2n+1)!}$. Integrating $x^{2n}$ gives $\frac{x^{2n+1}}{2n+1}$. First terms $x-\frac{x^3}{18}$.` },
          { t: R`$C+\displaystyle\sum_{n=0}^{\infty}\frac{(-1)^{n}x^{2n+1}}{(2n+1)!}$`, why: R`That is $\sin x$. You forgot to integrate after dividing by $x$.` },
          { t: R`$C+\displaystyle\sum_{n=0}^{\infty}\frac{(-1)^{n}x^{2n+2}}{(2n+2)(2n+1)!}$`, why: R`You integrated $\sin x$ alone (exponent $2n+1$ rises to $2n+2$). Divide by $x$ first.` },
          { t: R`$\displaystyle\sum_{n=0}^{\infty}\frac{(-1)^{n}x^{2n+1}}{(2n+1)(2n+1)!}$`, why: R`Right terms but no $+C$. An indefinite integral needs it.` },
        ] },
    },
    {
      h: 'Try: sine of x to the 4',
      body: R`Substitute, then check the first term.

Substitute $u=x^4$ into the sine series. The factorial stays $(2n+1)!$ because it came from the sine series index. Only the power of $x$ changes. Check $n=0$: $\sin(x^4)\approx x^4$ for small $x$, so the first term is $x^4$.`,
      // src: HW3 P1
      try: { q: R`Maclaurin series of $\sin(x^{4})$?`,
        choices: [
          { t: R`$\displaystyle\sum_{n=0}^{\infty}\frac{(-1)^{n}x^{8n+4}}{(2n+1)!}$`, ok: true, why: R`$(x^4)^{2n+1}=x^{8n+4}$. First term $x^4$.` },
          { t: R`$\displaystyle\sum_{n=0}^{\infty}\frac{(-1)^{n}x^{2n+5}}{(2n+1)!}$`, why: R`Added $4$ to the exponent. A power of a power multiplies: $4(2n+1)=8n+4$.` },
          { t: R`$\displaystyle\sum_{n=0}^{\infty}\frac{(-1)^{n}x^{8n+4}}{(8n+4)!}$`, why: R`The factorial belongs to the sine series index: $(2n+1)!$. Substitution changes powers, not denominators.` },
          { t: R`$\displaystyle\sum_{n=0}^{\infty}\frac{(-1)^{n}x^{4n+4}}{(2n+1)!}$`, why: R`$(x^4)^{2n+1}$ is $x^{8n+4}$. Multiply $4\cdot(2n+1)$; do not use $2$ in place of $4$.` },
        ] },
    },
    {
      h: 'Try: integral of e to the minus t cubed',
      body: R`Write $e^{-t^3}=\sum\frac{(-1)^nt^{3n}}{n!}$. Integrate $t^{3n}$ from $0$ to $x$.

First write the series of the integrand: substitute $u=-t^3$ into $e^u$. Then integrate each power of $t$ from $0$ to $x$. The lower limit $0$ kills the constant of integration. The new denominator is the new exponent. Check the first term: $\int_0^x1\,dt=x$.`,
      // src: HW3 P12
      try: { q: R`$\displaystyle\int_0^{x}e^{-t^{3}}\,dt=$ ?`,
        choices: [
          { t: R`$\displaystyle\sum_{n=0}^{\infty}\frac{(-1)^{n}x^{3n+1}}{(3n+1)\,n!}$`, ok: true, why: R`$\int_0^x t^{3n}dt=\frac{x^{3n+1}}{3n+1}$. First terms $x-\frac{x^4}{4}+\frac{x^7}{14}$.` },
          { t: R`$\displaystyle\sum_{n=0}^{\infty}\frac{(-1)^{n}x^{3n+1}}{(3n+1)!}$`, why: R`Merged $(3n+1)$ and $n!$ into one factorial. They multiply, they are not a single factorial.` },
          { t: R`$\displaystyle\sum_{n=0}^{\infty}\frac{(-1)^{n}x^{3n}}{n!}$`, why: R`That is $e^{-x^3}$. You did not integrate.` },
          { t: R`$\displaystyle\sum_{n=0}^{\infty}\frac{(-1)^{n}x^{3n+1}}{3\,n!}$`, why: R`The integration denominator is the new exponent $3n+1$, not $3$.` },
        ] },
    },
    {
      h: 'Try: 1/(1+4x) and ln(1-3x) with their radii',
      body: R`The inside of the geometric series is $u$. The condition $|u|<1$ gives the radius. For $u=-4x$: $|4x|<1$ gives $R=\frac14$.

For $\frac{1}{1+4x}$ put $u=-4x$ into $\frac{1}{1-u}$: the series is $\sum(-4)^nx^n$ with $R=\frac14$. For $\ln(1-3x)$ put $u=-3x$ into $\ln(1+u)$. The radius rule is the same: solve $|u|<1$ for $x$. This is the step most often skipped.`,
      // src: HW3 P4, P5
      try: { q: R`Maclaurin series of $\ln(1-3x)$ and its radius?`,
        choices: [
          { t: R`$-\displaystyle\sum_{n=1}^{\infty}\frac{3^{n}x^{n}}{n}$, $R=\frac13$`, ok: true, why: R`Put $u=-3x$ in $\ln(1+u)=\sum(-1)^{n+1}\frac{u^n}{n}$: $(-1)^{n+1}(-3)^n=-3^n$. Need $|3x|<1$.` },
          { t: R`$-\displaystyle\sum_{n=1}^{\infty}\frac{3^{n}x^{n}}{n}$, $R=3$`, why: R`Series right. $|3x|<1$ gives $|x|<\frac13$, not $3$.` },
          { t: R`$\displaystyle\sum_{n=1}^{\infty}\frac{(-1)^{n+1}3^{n}x^{n}}{n}$, $R=\frac13$`, why: R`Kept the $(-1)^{n+1}$ and forgot that $(-3)^n$ also has a sign. They combine to $-1$ for every $n$.` },
          { t: R`$-\displaystyle\sum_{n=1}^{\infty}\frac{3^{n}x^{n}}{n}$, $R=1$`, why: R`Copied the radius of $\ln(1+x)$. Substituting $u=-3x$ rescales it.` },
        ] },
    },
    {
      h: 'Try: derive 1/(1-x)^2 from derivatives and check the endpoints',
      body: R`Buddy Q6 says: derive from derivatives, no credit for a memorised series. Take $f=(1-x)^{-2}$. Then $f'=2(1-x)^{-3}$, $f''=6(1-x)^{-4}$, $f'''=24(1-x)^{-5}$. At $0$: $1,2,6,24$, which is $(n+1)!$. Divide by $n!$ to get coefficient $n+1$. The series is $\sum(n+1)x^n$. The ratio test gives $|x|<1$. Then test $x=\pm1$ separately.`,
      // src: buddy Q6 (lost points: no endpoint tests)
      try: { q: R`At $x=\pm1$ the series is $\sum(n+1)(\pm1)^n$. What is the interval of convergence?`,
        choices: [
          { t: R`$(-1,1)$`, ok: true, why: R`Terms $(n+1)(\pm1)^n$ do not go to $0$, so the divergence test kills both endpoints.` },
          { t: R`$[-1,1]$`, why: R`Both endpoints diverge. $|(n+1)(\pm1)^n|=n+1\to\infty$.` },
          { t: R`$(-1,1]$`, why: R`That belongs to $\ln(1+x)$. At $x=1$ here the sum is $1+2+3+\cdots$, which diverges.` },
          { t: R`$[-1,1)$`, why: R`At $x=-1$ the terms are $(-1)^n(n+1)$. They do not shrink to $0$, so it diverges. The alternating test needs terms going to $0$.` },
        ] },
    },
  ],
  recipe: [
    R`Read the wording. "From scratch" or "do not use known series" means derivatives. Otherwise, use a known series.`,
    R`From scratch: make a table $n=0,1,2,3$ of $f^{(n)}(x)$ and plug in $x=c$ at once. Leave the numbers as products so a pattern shows.`,
    R`Guess $f^{(n)}(c)$ as a formula in $n$, divide by $n!$, cancel factorials, write $\sum \frac{f^{(n)}(c)}{n!}(x-c)^n$ with the right sign in $(x-c)$.`,
    R`Known series: pick the closest of the six, substitute $u=$ (inside), then multiply by the outside factor. If needed, differentiate or integrate term by term.`,
    R`Interval: rewrite the old condition with $u$ (e.g. $|u|<1$) in terms of $x$. Check endpoints when the radius is finite.`,
    R`Check: expand $n=0,1,2$ of your sigma and compare with the first terms you computed.`,
  ],
  worked: [
    {
      q: R`(His lecture example.) Compute $T_3(x)$ with centre $x=1$ for $f(x)=x^{3}+2x^{2}-x+1$.`,
      steps: [
        R`Write the target: $T_3(x)=f(1)+f'(1)(x-1)+\dfrac{f''(1)}{2!}(x-1)^{2}+\dfrac{f'''(1)}{3!}(x-1)^{3}$. Centre $1$ means powers of $(x-1)$.`,
        R`Value: $f(1)=1+2-1+1=3$.`,
        R`Derivatives at $1$: $f'(x)=3x^{2}+4x-1$, so $f'(1)=6$. $f''(x)=6x+4$, so $f''(1)=10$. $f'''(x)=6$, so $f'''(1)=6$.`,
        R`Divide by factorials: $\dfrac{10}{2!}=5$ and $\dfrac{6}{3!}=1$.`,
        R`$T_3(x)=3+6(x-1)+5(x-1)^{2}+(x-1)^{3}$. Since $f$ is a cubic, this is $f$ itself, just rewritten around $x=1$.`,
      ],
      note: R`A polynomial's Taylor polynomial of the same degree is the polynomial itself. Good self-check.`,
    },
    {
      q: R`(His lecture example.) Find the Taylor series of $f(x)=\dfrac{1}{x}$ centred at $x=-3$, from scratch.`,
      steps: [
        R`Write $f=x^{-1}$ and differentiate with the power rule: $f'=-x^{-2}$, $f''=2x^{-3}$, $f'''=-6x^{-4}$.`,
        R`Plug in $x=-3$: $f(-3)=-\frac13$, $f'(-3)=-\frac{1}{9}$, $f''(-3)=\frac{2}{-27}=-\frac{2}{27}$, $f'''(-3)=\frac{-6}{81}=-\frac{6}{81}$. Every value is negative. The even powers $(-3)^{2}=9$ and $(-3)^{4}=81$ are positive, so $f'$ and $f'''$ keep the minus sign already in front of them. The odd power $(-3)^{3}=-27$ is negative, and it flips the $+2$ in $f''$ to $-\frac{2}{27}$.`,
        R`Write them as $-\dfrac{0!}{3^{1}},-\dfrac{1!}{3^{2}},-\dfrac{2!}{3^{3}},-\dfrac{3!}{3^{4}}$. Pattern: $f^{(n)}(-3)=-\dfrac{n!}{3^{n+1}}$.`,
        R`Divide by $n!$: coefficient $=-\dfrac{1}{3^{n+1}}$.`,
        R`Centre $-3$ means powers of $(x+3)$: $\displaystyle\frac1x=\sum_{n=0}^{\infty}\frac{-1}{3^{n+1}}(x+3)^{n}$. Check $n=0$: $-\frac13=f(-3)$. Good.`,
      ],
      note: R`Keep $n!$ unmultiplied in the table. "$2$" and "$6$" hide the factorial; "$2!$" and "$3!$" show it.`,
    },
    {
      q: R`Find the Maclaurin series for $x\cos(x^{3})$ and give its radius of convergence. (His Exam 3 Q4.)`,
      steps: [
        R`It looks like cosine, so start from $\cos u=\displaystyle\sum_{n=0}^{\infty}(-1)^{n}\frac{u^{2n}}{(2n)!}$, valid for all $u$.`,
        R`Substitute $u=x^{3}$: $(x^{3})^{2n}=x^{6n}$, because a power of a power multiplies exponents.`,
        R`Multiply by the outside $x$: $x\cdot x^{6n}=x^{6n+1}$, because multiplying adds exponents.`,
        R`$x\cos(x^{3})=\displaystyle\sum_{n=0}^{\infty}(-1)^{n}\frac{x^{6n+1}}{(2n)!}=x-\frac{x^{7}}{2}+\frac{x^{13}}{24}-\cdots$`,
        R`Cosine converges for every $u$, so every $x^{3}$ is fine: $R=\infty$.`,
      ],
      note: R`The factorial stays $(2n)!$: substitution changes the powers of $x$, not the denominators.`,
    },
    {
      q: R`Find the Taylor series for $f(x)=\dfrac{3}{x^{2}}$ centred at $x=-1$. Do not use known series. (His Fall 2025 Exam 3 Q2, 16 points.)`,
      steps: [
        R`Write $f=3x^{-2}$. Derivatives: $f'=-6x^{-3}$, $f''=18x^{-4}$, $f'''=-72x^{-5}$.`,
        R`At $x=-1$: $f(-1)=3$, $f'(-1)=\frac{-6}{-1}=6$, $f''(-1)=18$, $f'''(-1)=\frac{-72}{-1}=72$. Odd powers of $-1$ flip the sign back, so all are positive.`,
        R`Factor: $3=3\cdot1!$, $6=3\cdot2!$, $18=3\cdot3!$, $72=3\cdot4!$. So $f^{(n)}(-1)=3(n+1)!$.`,
        R`Divide by $n!$: $\dfrac{3(n+1)!}{n!}=3(n+1)$, since $(n+1)!=(n+1)\cdot n!$.`,
        R`Answer: $\displaystyle\frac{3}{x^{2}}=\sum_{n=0}^{\infty}3(n+1)(x+1)^{n}=3+6(x+1)+9(x+1)^{2}+\cdots$. Check $n=0$: $3=f(-1)$.`,
      ],
      note: R`Show the derivative table: most of the 16 points are for the work, not the final sigma.`,
    },
    {
      // src: buddy Q6
      q: R`(Buddy Exam 3 Q6.) Find the Taylor series of $\dfrac{1}{(1-x)^{2}}$ centred at $0$ from derivatives, and give its interval of convergence.`,
      steps: [
        R`Differentiate: $f=(1-x)^{-2}$, $f'=2(1-x)^{-3}$, $f''=6(1-x)^{-4}$, $f'''=24(1-x)^{-5}$.`,
        R`At $0$: $f(0)=1$, $f'(0)=2$, $f''(0)=6$, $f'''(0)=24$. As factorials: $1!,2!,3!,4!$. So $f^{(n)}(0)=(n+1)!$.`,
        R`Divide by $n!$: $\dfrac{(n+1)!}{n!}=n+1$. Series: $\displaystyle\sum_{n=0}^{\infty}(n+1)x^{n}=1+2x+3x^{2}+\cdots$`,
        R`Ratio test: $\left|\dfrac{(n+2)x^{n+1}}{(n+1)x^{n}}\right|\to|x|$. Converges for $|x|<1$.`,
        R`$x=1$: $\sum(n+1)$ diverges, terms go to $\infty$. $x=-1$: $\sum(-1)^n(n+1)$ diverges, terms do not go to $0$.`,
        R`Interval: $(-1,1)$.`,
      ],
      ask: [{ at: 5, q: R`Before testing $x=\pm1$: what does the ratio test say about the endpoints?`, choices: [
        { t: 'Nothing: it fails at $|x|=1$, so test each endpoint on its own.', ok: true, why: R`The ratio test is inconclusive when the limit is $1$. Check $x=1$ and $x=-1$ separately.` },
        { t: 'Both endpoints converge.', why: R`The ratio test gives no verdict at $|x|=1$. Convergence must be shown another way.` },
        { t: 'Both endpoints diverge.', why: R`True here, but the ratio test did not show it. You need the divergence test on each endpoint (the buddy skipped this).` },
      ] }],
      note: R`The buddy lost points for writing $-1<x<1$ with no endpoint tests.`,
    },
    {
      // src: buddy Q4c; HW3 P2
      q: R`(Buddy Exam 3 Q4c.) Find the Maclaurin series of $5x^{2}e^{-x/5}$.`,
      steps: [
        R`Start from $e^{u}=\displaystyle\sum_{n=0}^{\infty}\frac{u^{n}}{n!}$ with $u=-\frac x5$: $\displaystyle\sum\frac{(-1)^{n}x^{n}}{5^{n}n!}$.`,
        R`Multiply by $5x^{2}$: the coefficient is $5$ and the exponent is $n+2$ (add, not multiply).`,
        R`Merge the $5$: $\dfrac{5}{5^{n}}=\dfrac{1}{5^{n-1}}$. Series: $\displaystyle\sum_{n=0}^{\infty}\frac{(-1)^{n}x^{n+2}}{5^{n-1}\,n!}$.`,
        R`Check: $n=0$ gives $5x^{2}$; $n=1$ gives $-x^{3}$. Compare $5x^2(1-\frac x5)=5x^2-x^3$. Good.`,
      ],
      ask: [{ at: 2, q: R`What is the exponent of $x$ after multiplying $x^{n}$ by $x^{2}$?`, choices: [
        { t: R`$n+2$`, ok: true, why: R`Multiplying powers of the same base adds exponents.` },
        { t: R`$2n$`, why: R`The buddy's slip. $x^{2n}$ is $(x^2)^n$, not $x^2\cdot x^n$.` },
        { t: R`$n^{2}$`, why: R`Squaring the exponent has no rule behind it. Add the exponents.` },
      ] }],
      note: R`Always test $n=0$ and $n=1$ against the first terms you expect.`,
    },
    {
      // src: HW3 P5
      q: R`(HW3 P5.) Find the Maclaurin series of $\ln(1-3x)$ and its radius.`,
      steps: [
        R`Start from $\ln(1+u)=\displaystyle\sum_{n=1}^{\infty}(-1)^{n+1}\frac{u^{n}}{n}$.`,
        R`Put $u=-3x$: $(-3x)^{n}=(-1)^{n}3^{n}x^{n}$.`,
        R`Signs: $(-1)^{n+1}(-1)^{n}=(-1)^{2n+1}=-1$. Series: $-\displaystyle\sum_{n=1}^{\infty}\frac{3^{n}x^{n}}{n}=-3x-\frac{9x^{2}}{2}-\cdots$`,
        R`Radius: $|u|<1$ becomes $|3x|<1$, so $R=\frac13$.`,
      ],
      ask: [{ at: 3, q: R`What is $(-1)^{n+1}\cdot(-1)^{n}$?`, choices: [
        { t: '$-1$', ok: true, why: R`The exponents add to $2n+1$, which is odd, so the sign is $-1$ for every $n$.` },
        { t: '$+1$', why: R`That would need an even total exponent. $2n+1$ is always odd.` },
        { t: R`$(-1)^{n}$`, why: R`The two signs do not leave one alternating factor. They cancel into a fixed $-1$.` },
      ] }],
      note: R`Check $n=1$: $-3x$. The derivative at $0$ of $\ln(1-3x)$ is $-3$. Matches.`,
    },
  ],
  exam: [
    R`Complete the table of Maclaurin series: write each series in sigma notation and give its interval of convergence. (Exam 3 Q1, 18 pts, six rows)`,
    R`Find the Taylor series for $f(x)$ centred at $x=c$, from scratch. Do not use known series. (Exam 3 Q2)`,
    R`Find the Maclaurin series for $x\cos(x^{3})$ and give its radius of convergence. (Exam 3 Q4)`,
    R`Use a known series to find the Maclaurin series of $f$; write your answer in sigma notation.`,
    R`Compute $T_N(x)$ for a given function and centre (lecture pattern).`,
  ],
  traps: [
    R`Mixing up sine and cosine: sine has odd powers $x^{2n+1}$ with $(2n+1)!$; cosine has even powers $x^{2n}$ with $(2n)!$. Fix: sine is odd, so odd powers.`,
    R`Putting factorials in $\ln(1+x)$ or $\arctan x$. Those have plain $n$ and $2n+1$. Only $e^{x}$, $\sin$, $\cos$ have factorials.`,
    R`Wrong sign in $(x-c)$ for a negative centre. Centre $-3$ is $(x+3)$, not $(x-3)$.`,
    R`Forgetting to divide by $n!$: the coefficient is $\frac{f^{(n)}(c)}{n!}$, not $f^{(n)}(c)$.`,
    R`Using $\frac{1}{1-x}$ directly on $\frac{1}{2+x}$. Factor out the $2$ first, and the radius becomes $2$.`,
    R`Writing the wrong endpoints in the Q1 table. $(-1,1)$, $(-1,1]$ and $[-1,1]$ are three different answers.`,
  ],
  // src: buddy Q1 (full Maclaurin table); intervals checked with sympy
  cards: [
    { f: R`$\dfrac{1}{1-x}=$ ? (sigma form)`, b: R`$\displaystyle\sum_{n=0}^{\infty}x^{n}$` },
    { f: R`$e^{x}=$ ? (sigma form)`, b: R`$\displaystyle\sum_{n=0}^{\infty}\frac{x^{n}}{n!}$` },
    { f: R`$\sin x=$ ? (sigma form)`, b: R`$\displaystyle\sum_{n=0}^{\infty}(-1)^{n}\frac{x^{2n+1}}{(2n+1)!}$` },
    { f: R`$\cos x=$ ? (sigma form)`, b: R`$\displaystyle\sum_{n=0}^{\infty}(-1)^{n}\frac{x^{2n}}{(2n)!}$` },
    { f: R`$\ln(1+x)=$ ? (sigma form, start index)`, b: R`$\displaystyle\sum_{n=1}^{\infty}(-1)^{n+1}\frac{x^{n}}{n}$. Starts at $n=1$.` },
    { f: R`$\arctan x=$ ? (sigma form)`, b: R`$\displaystyle\sum_{n=0}^{\infty}(-1)^{n}\frac{x^{2n+1}}{2n+1}$` },
    { f: R`First two nonzero terms of $\dfrac{1}{1-x}$`, b: R`$1+x$` },
    { f: R`First two nonzero terms of $e^{x}$`, b: R`$1+x$` },
    { f: R`First two nonzero terms of $\sin x$`, b: R`$x-\dfrac{x^{3}}{3!}$` },
    { f: R`First two nonzero terms of $\cos x$`, b: R`$1-\dfrac{x^{2}}{2!}$` },
    { f: R`First two nonzero terms of $\ln(1+x)$`, b: R`$x-\dfrac{x^{2}}{2}$. No constant term, since $\ln1=0$.` },
    { f: R`First two nonzero terms of $\arctan x$`, b: R`$x-\dfrac{x^{3}}{3}$` },
    { f: R`Interval of convergence of $\dfrac{1}{1-x}$`, b: R`$(-1,1)$. Both endpoints diverge.` },
    { f: R`Interval of convergence of $e^{x}$`, b: R`$(-\infty,\infty)$` },
    { f: R`Interval of convergence of $\sin x$`, b: R`$(-\infty,\infty)$` },
    { f: R`Interval of convergence of $\cos x$`, b: R`$(-\infty,\infty)$` },
    { f: R`Interval of convergence of $\ln(1+x)$`, b: R`$(-1,1]$. Alternating harmonic at $1$, harmonic at $-1$.` },
    { f: R`Interval of convergence of $\arctan x$`, b: R`$[-1,1]$. Alternating series test at both ends.` },
    { f: R`Coefficient of $(x-c)^{n}$ in a Taylor series`, b: R`$\dfrac{f^{(n)}(c)}{n!}$` },
    { f: R`$f^{(n)}(0)$ from a Maclaurin series with $x^{n}$ coefficient $a_n$`, b: R`$f^{(n)}(0)=n!\,a_n$` },
  ],
  practice: [
    {
      id: 'lp-taylor-01', unit: U, topic: T, stage: 'warmup', diff: 1, arch: 'coef-def-tf', tf: true,
      prompt: R`True or false: in a Taylor series centred at $c$, the coefficient of $(x-c)^{n}$ is $f^{(n)}(c)$.`,
      choices: [
        { t: 'True', why: R`Missing the $n!$: differentiating $(x-c)^n$ $n$ times leaves $n!$, so you must divide by it.`, err: 'factorial' },
        { t: 'False', ok: true },
      ],
      keyWhy: R`The coefficient is $\dfrac{f^{(n)}(c)}{n!}$.`,
      hints: ['Differentiate $(x-c)^{2}$ twice. What number is left?', 'That leftover number must be cancelled.', R`Coefficient $=f^{(n)}(c)/n!$.`],
      steps: [R`Differentiating $a_n(x-c)^n$ $n$ times gives $n!\,a_n$.`, R`Setting $n!\,a_n=f^{(n)}(c)$ gives $a_n=\dfrac{f^{(n)}(c)}{n!}$, so the statement is false.`],
      recall: R`Coefficient $n$ = $f^{(n)}(c)/n!$.`,
    },
    {
      id: 'lp-taylor-02', unit: U, topic: T, stage: 'warmup', diff: 2, arch: 'coef-from-derivs', fmt: 'free',
      prompt: R`You know $f(2)=5$, $f'(2)=-3$ and $f''(2)=8$. What is the coefficient of $(x-2)^{2}$ in $T_2(x)$ centred at $x=2$?`,
      choices: [
        { t: '$4$', ok: true },
        { t: '$8$', why: R`Used $f''(2)$ itself and forgot to divide by $2!=2$.`, err: 'factorial' },
        { t: '$16$', why: R`Multiplied by $2!$ instead of dividing by it.`, err: 'factorial' },
        { t: R`$-3$`, why: R`That is $f'(2)$, the coefficient of $(x-2)^{1}$, not of $(x-2)^{2}$.`, err: 'index' },
      ],
      hints: [R`Which derivative goes with the power $2$?`, R`Divide that derivative by $2!$.`],
      steps: [R`The $(x-2)^2$ coefficient is $\dfrac{f''(2)}{2!}$.`, R`$\dfrac{8}{2}=4$.`],
      recall: R`Power $n$ pairs with $f^{(n)}(c)/n!$.`,
    },
    {
      id: 'lp-taylor-03', unit: U, topic: T, stage: 'core', diff: 3, arch: 'tn-nonzero-centre',
      prompt: R`Compute $T_2(x)$ for $f(x)=\sqrt{x}$ with centre $x=4$.`,
      choices: [
        { t: R`$2+\dfrac{1}{4}(x-4)-\dfrac{1}{64}(x-4)^{2}$`, ok: true },
        { t: R`$2+\dfrac{1}{4}(x-4)-\dfrac{1}{32}(x-4)^{2}$`, why: R`Used $f''(4)=-\frac{1}{32}$ as the coefficient and forgot to divide by $2!$.`, err: 'factorial' },
        { t: R`$2+\dfrac{1}{4}(x+4)-\dfrac{1}{64}(x+4)^{2}$`, why: R`Centre $4$ gives powers of $(x-4)$; writing $(x+4)$ flips the centre to $-4$.`, err: 'sign' },
        { t: R`$2+\dfrac{1}{4}x-\dfrac{1}{64}x^{2}$`, why: R`Used powers of $x$ (a Maclaurin form) with derivatives taken at $4$; the powers must be $(x-4)$.`, err: 'setup' },
      ],
      hints: [R`Find $f(4)$, $f'(4)$, $f''(4)$ for $f=x^{1/2}$.`, R`$f'=\frac12x^{-1/2}$, $f''=-\frac14x^{-3/2}$.`, R`$f''(4)=-\frac{1}{32}$; divide by $2$.`],
      steps: [
        R`$f(4)=\sqrt4=2$.`,
        R`$f'(x)=\frac{1}{2}x^{-1/2}$, so $f'(4)=\frac{1}{2\cdot2}=\frac14$.`,
        R`$f''(x)=-\frac14x^{-3/2}$, so $f''(4)=-\frac{1}{4\cdot8}=-\frac{1}{32}$, and $\frac{f''(4)}{2!}=-\frac{1}{64}$.`,
        R`$T_2(x)=2+\frac14(x-4)-\frac{1}{64}(x-4)^{2}$.`,
      ],
      recall: R`$T_N$: value, slope, bend at $c$, each over $n!$, in powers of $(x-c)$.`,
    },
    {
      id: 'lp-taylor-04', unit: U, topic: T, stage: 'core', diff: 3, arch: 'derivative-pattern-from-scratch',
      prompt: R`(Lecture example, from scratch.) Differentiate $f(x)=\ln(1+x)$ until the pattern shows. Which is its Maclaurin series?`,
      choices: [
        { t: R`$\displaystyle\sum_{n=1}^{\infty}\frac{(-1)^{n+1}}{n}x^{n}$`, ok: true },
        { t: R`$\displaystyle\sum_{n=1}^{\infty}(-1)^{n+1}(n-1)!\,x^{n}$`, why: R`Forgot to divide $f^{(n)}(0)$ by $n!$, so the factorial never cancels.`, err: 'factorial' },
        { t: R`$\displaystyle\sum_{n=1}^{\infty}\frac{(-1)^{n+1}}{n!}x^{n}$`, why: R`Cancelled wrongly: $\frac{(n-1)!}{n!}=\frac1n$, not $\frac{1}{n!}$.`, err: 'algebra-slip' },
        { t: R`$\displaystyle\sum_{n=0}^{\infty}\frac{(-1)^{n+1}}{n}x^{n}$`, why: R`Started at $n=0$, which divides by zero; $\ln1=0$ so the series starts at $n=1$.`, err: 'index' },
      ],
      hints: [R`Coefficient $=\dfrac{f^{(n)}(0)}{n!}$.`, R`$n!=n\cdot(n-1)!$.`],
      steps: [R`Coefficient $=\dfrac{(-1)^{n+1}(n-1)!}{n!}$.`, R`Since $n!=n(n-1)!$, this is $\dfrac{(-1)^{n+1}}{n}$.`, R`$f(0)=\ln1=0$, so there is no $n=0$ term: $\sum_{n=1}^{\infty}\frac{(-1)^{n+1}}{n}x^{n}$.`],
      recall: R`From scratch: pattern for $f^{(n)}(c)$, divide by $n!$, cancel.`,
    },
    {
      id: 'lp-taylor-05', unit: U, topic: T, stage: 'core', diff: 3, arch: 'table-select-all', fmt: 'multi',
      prompt: R`Exam 3 Q1 table check. Select every row that is completely correct (series AND interval).`,
      choices: [
        { t: R`$e^{x}=\displaystyle\sum_{n=0}^{\infty}\frac{x^{n}}{n!}$ on $(-\infty,\infty)$`, ok: true, why: R`Correct: factorial in the denominator makes it converge for every $x$.` },
        { t: R`$\cos x=\displaystyle\sum_{n=0}^{\infty}(-1)^{n}\frac{x^{2n}}{(2n)!}$ on $(-\infty,\infty)$`, ok: true, why: R`Correct: cosine is even, so even powers $2n$ with $(2n)!$.` },
        { t: R`$\sin x=\displaystyle\sum_{n=0}^{\infty}(-1)^{n}\frac{x^{2n}}{(2n)!}$ on $(-\infty,\infty)$`, why: R`That is the cosine series; sine needs odd powers $x^{2n+1}$ over $(2n+1)!$.`, err: 'formula-confusion' },
        { t: R`$\arctan x=\displaystyle\sum_{n=0}^{\infty}(-1)^{n}\frac{x^{2n+1}}{2n+1}$ on $(-1,1)$`, why: R`Series is right but both endpoints converge (alternating series test), so the interval is $[-1,1]$.`, err: 'endpoint' },
        { t: R`$\dfrac{1}{1-x}=\displaystyle\sum_{n=0}^{\infty}x^{n}$ on $(-1,1)$`, ok: true, why: R`Correct: at $x=\pm1$ the terms $x^n$ do not go to $0$, so both endpoints diverge.` },
        { t: R`$\ln(1+x)=\displaystyle\sum_{n=1}^{\infty}(-1)^{n+1}\frac{x^{n}}{n!}$ on $(-1,1]$`, why: R`No factorial in $\ln(1+x)$: the denominator is plain $n$.`, err: 'formula-confusion' },
      ],
      hints: [R`Only $e^x$, $\sin$, $\cos$ have factorials.`, R`Sine odd powers, cosine even powers.`, R`Radius-1 endpoints: $(-1,1)$, $(-1,1]$, $[-1,1]$ for geometric, ln, arctan.`],
      steps: [R`Check each formula against the six memorised series.`, R`Sine row uses cosine's powers: wrong. $\ln$ row has a factorial: wrong.`, R`$\arctan$ row has the wrong interval: it converges at both $\pm1$.`, R`Correct rows: $e^x$, $\cos x$, $\frac1{1-x}$.`],
      recall: R`Q1 is graded on the sigma AND the interval.`,
    },
    {
      id: 'lp-taylor-06', unit: U, topic: T, stage: 'core', diff: 3, arch: 'coefficient-after-substitution', fmt: 'free',
      prompt: R`What is the coefficient of $x^{10}$ in the Maclaurin series of $e^{x^{2}}$?`,
      choices: [
        { t: R`$\dfrac{1}{120}$`, ok: true },
        { t: R`$\dfrac{1}{3628800}$`, why: R`Used $\frac{1}{10!}$: matched the exponent $10$ to $n$, but $x^{2n}=x^{10}$ means $n=5$.`, err: 'index' },
        { t: R`$\dfrac{1}{24}$`, why: R`Used $n=4$ (off by one); $x^{2n}=x^{10}$ needs $n=5$, so $\frac1{5!}$.`, err: 'index' },
        { t: '$0$', why: R`Assumed only odd or only small powers appear; $e^{x^2}$ has every even power, including $x^{10}$.`, err: 'concept' },
      ],
      hints: [R`$e^{u}=\sum\frac{u^n}{n!}$ with $u=x^2$.`, R`The term is $\frac{x^{2n}}{n!}$. Which $n$ gives $x^{10}$?`, R`$n=5$.`],
      steps: [R`Substitute $u=x^{2}$: $e^{x^2}=\sum_{n=0}^{\infty}\frac{x^{2n}}{n!}$.`, R`$2n=10$ gives $n=5$.`, R`Coefficient $=\frac{1}{5!}=\frac{1}{120}$.`],
      recall: R`After substituting, solve "exponent formula = target" for $n$.`,
    },
    {
      id: 'lp-taylor-07', unit: U, topic: T, stage: 'core', diff: 3, arch: 'error-substitution-exponent', fmt: 'error',
      prompt: R`A student finds the Maclaurin series of $x^{2}\sin(x^{2})$. Which line has the error?`,
      work: [
        R`Line 1: $\sin u=\displaystyle\sum_{n=0}^{\infty}(-1)^{n}\frac{u^{2n+1}}{(2n+1)!}$.`,
        R`Line 2: put $u=x^{2}$: $(x^{2})^{2n+1}=x^{2n+3}$.`,
        R`Line 3: multiply by $x^{2}$: exponent becomes $2n+5$.`,
        R`Line 4: $x^{2}\sin(x^{2})=\displaystyle\sum_{n=0}^{\infty}(-1)^{n}\frac{x^{2n+5}}{(2n+1)!}$.`,
      ],
      choices: [
        { t: 'Line 1', why: R`Line 1 is the correct sine series: odd powers over odd factorials, alternating.`, err: 'concept' },
        { t: 'Line 2', ok: true },
        { t: 'Line 3', why: R`Line 3 correctly adds $2$ to whatever exponent it got; the bad exponent came in earlier.`, err: 'concept' },
        { t: 'Line 4', why: R`Line 4 just copies Line 3; the mistake is upstream in the power of a power.`, err: 'concept' },
        { t: 'No error', why: R`Check $n=0$: $x^2\sin(x^2)$ starts with $x^4$, but Line 4 starts with $x^5$.`, err: 'concept' },
      ],
      keyWhy: R`$(x^{2})^{2n+1}=x^{4n+2}$: powers multiply, not add. Correct answer: $\sum(-1)^n\frac{x^{4n+4}}{(2n+1)!}$.`,
      hints: [R`Power of a power: $(x^a)^b=x^{?}$.`, R`$(x^2)^{2n+1}$ multiplies $2$ by $2n+1$.`],
      steps: [R`$(x^{2})^{2n+1}=x^{2(2n+1)}=x^{4n+2}$, so Line 2 is wrong.`, R`Then multiplying by $x^2$ gives $x^{4n+4}$.`, R`Correct: $x^{2}\sin(x^{2})=\sum_{n=0}^{\infty}(-1)^{n}\frac{x^{4n+4}}{(2n+1)!}$, first term $x^4$.`],
      recall: R`Substitute: exponents multiply. Multiply outside: exponents add.`,
    },
    {
      id: 'lp-taylor-08', unit: U, topic: T, stage: 'core', diff: 4, arch: 'derivative-from-series',
      prompt: R`Without differentiating five times, find $f^{(5)}(0)$ for $f(x)=\sin(2x)$.`,
      choices: [
        { t: '$32$', ok: true },
        { t: R`$\dfrac{4}{15}$`, why: R`That is the coefficient $\frac{2^5}{5!}$; you forgot to multiply back by $5!$.`, err: 'factorial' },
        { t: '$1$', why: R`Used $\sin x$'s fifth derivative and lost the chain factor $2^5$ from $u=2x$.`, err: 'setup' },
        { t: R`$-32$`, why: R`Sign slip: the $x^5$ term is $n=2$, and $(-1)^2=+1$.`, err: 'sign' },
      ],
      hints: [R`Write the series of $\sin(2x)$ and find the $x^5$ coefficient.`, R`$f^{(5)}(0)=5!\times(\text{coefficient of }x^5)$.`, R`Coefficient is $\frac{2^5}{5!}$.`],
      steps: [R`$\sin(2x)=\sum(-1)^{n}\frac{(2x)^{2n+1}}{(2n+1)!}$.`, R`$x^{5}$ is $n=2$: coefficient $(+1)\frac{2^{5}}{5!}=\frac{32}{120}$.`, R`Coefficient $=\frac{f^{(5)}(0)}{5!}$, so $f^{(5)}(0)=5!\cdot\frac{32}{5!}=32$.`],
      recall: R`$f^{(n)}(c)=n!\times$ coefficient of $(x-c)^n$.`,
    },
    {
      id: 'lp-taylor-09', unit: U, topic: T, stage: 'core', diff: 3, arch: 'term-by-term-derivative', tf: true,
      prompt: R`True or false: for $|x|<1$, $\dfrac{1}{(1-x)^{2}}=\displaystyle\sum_{n=1}^{\infty}nx^{n-1}=1+2x+3x^{2}+\cdots$`,
      choices: [
        { t: 'True', ok: true },
        { t: 'False', why: R`Differentiate $\frac1{1-x}=\sum x^n$ term by term: left gives $\frac{1}{(1-x)^2}$, right gives $\sum nx^{n-1}$; the radius stays $1$.`, err: 'concept' },
      ],
      hints: [R`What is $\frac{d}{dx}\frac{1}{1-x}$?`, R`Differentiate $1+x+x^2+\cdots$ term by term.`],
      steps: [R`$\frac{d}{dx}(1-x)^{-1}=(1-x)^{-2}$.`, R`$\frac{d}{dx}\sum_{n=0}^\infty x^n=\sum_{n=1}^\infty nx^{n-1}$ (the $n=0$ constant drops out).`, R`Same radius $1$, so the statement is true for $|x|<1$.`],
      recall: R`Inside the radius you may differentiate a series term by term.`,
    },
    {
      id: 'lp-taylor-10', unit: U, topic: T, stage: 'exam', diff: 5, arch: 'from-scratch-log-centre-2',
      prompt: R`Find the Taylor series for $f(x)=\ln x$ centred at $x=2$. Do not use known series. Showing all your work, which is the final answer?`,
      choices: [
        { t: R`$\displaystyle\ln 2+\sum_{n=1}^{\infty}\frac{(-1)^{n+1}}{n\,2^{n}}(x-2)^{n}$`, ok: true },
        { t: R`$\displaystyle\sum_{n=1}^{\infty}\frac{(-1)^{n+1}}{n\,2^{n}}(x-2)^{n}$`, why: R`Dropped the $n=0$ term: $f(2)=\ln2\ne0$ here, so the constant $\ln 2$ must stay.`, err: 'index' },
        { t: R`$\displaystyle\ln 2+\sum_{n=1}^{\infty}\frac{(-1)^{n+1}}{n}(x-2)^{n}$`, why: R`Forgot the $2^{n}$: $f^{(n)}(2)=\frac{(-1)^{n+1}(n-1)!}{2^{n}}$, because $x^{-n}$ at $x=2$ gives $2^{-n}$.`, err: 'algebra-slip' },
        { t: R`$\displaystyle\ln 2+\sum_{n=1}^{\infty}\frac{(-1)^{n+1}}{n\,2^{n}}(x+2)^{n}$`, why: R`Centre $2$ gives powers of $(x-2)$; $(x+2)$ is the centre $-2$.`, err: 'sign' },
      ],
      hints: [R`$f'=x^{-1}$, $f''=-x^{-2}$, $f'''=2x^{-3}$, $f^{(4)}=-6x^{-4}$. Plug in $x=2$.`, R`$f(2)=\ln2$ and $f^{(n)}(2)=\frac{(-1)^{n+1}(n-1)!}{2^{n}}$ for $n\ge1$.`, R`Divide by $n!$; keep $\ln 2$ as the $n=0$ term.`],
      steps: [
        R`Table: $f(2)=\ln2$, $f'(2)=\frac12$, $f''(2)=-\frac14$, $f'''(2)=\frac{2}{8}$, $f^{(4)}(2)=-\frac{6}{16}$.`,
        R`Write with factorials: $\frac{0!}{2^1},-\frac{1!}{2^2},\frac{2!}{2^3},-\frac{3!}{2^4}$. Pattern for $n\ge1$: $f^{(n)}(2)=\frac{(-1)^{n+1}(n-1)!}{2^{n}}$.`,
        R`Divide by $n!$: $\frac{(n-1)!}{n!}=\frac1n$, so the coefficient is $\frac{(-1)^{n+1}}{n\,2^{n}}$. Check: $n=2$ gives $-\frac18$, and $\frac{f''(2)}{2!}=-\frac18$.`,
        R`The pattern starts at $n=1$ and $f(2)=\ln2$ is not $0$, so it stays as its own term: $\ln x=\ln2+\sum_{n=1}^{\infty}\frac{(-1)^{n+1}}{n\,2^{n}}(x-2)^{n}=\ln2+\frac{x-2}{2}-\frac{(x-2)^2}{8}+\cdots$`,
      ],
      recall: R`From scratch: 4 derivatives at $c$, pattern, divide by $n!$, powers of $(x-c)$. Keep $f(c)$ if it is not $0$.`,
    },
    {
      id: 'lp-taylor-11', unit: U, topic: T, stage: 'exam', diff: 4, arch: 'geometric-rewrite-interval', fmt: 'free',
      prompt: R`Find the interval of convergence of the Maclaurin series for $f(x)=\dfrac{x}{1+3x}$. Type the interval.`,
      choices: [
        { t: R`$\left(-\dfrac{1}{3},\dfrac{1}{3}\right)$`, ok: true },
        { t: R`$(-1,1)$`, why: R`Copied the geometric interval without substituting: you need $|-3x|<1$, not $|x|<1$.`, err: 'setup' },
        { t: R`$(-3,3)$`, why: R`Solved $|3x|<1$ the wrong way: dividing by $3$ gives $|x|<\frac13$, not $|x|<3$.`, err: 'algebra-slip' },
        { t: R`$\left[-\dfrac{1}{3},\dfrac{1}{3}\right]$`, why: R`At $x=\pm\frac13$ the terms do not go to $0$, so both endpoints diverge.`, err: 'endpoint' },
      ],
      accept: ['(-1/3,1/3)', '(-1/3, 1/3)', '-1/3<x<1/3'],
      hints: [R`$\frac{1}{1+3x}=\frac{1}{1-(-3x)}$.`, R`Need $|-3x|<1$.`, R`Test $x=\pm\frac13$: the series becomes $\sum(\pm1)^{?}\frac13$.`],
      steps: [
        R`$\frac{1}{1+3x}=\frac{1}{1-(-3x)}=\sum_{n=0}^{\infty}(-3x)^{n}$.`,
        R`Multiply by $x$: $\frac{x}{1+3x}=\sum_{n=0}^{\infty}(-3)^{n}x^{n+1}$.`,
        R`Converges when $|-3x|<1$, that is $|x|<\frac13$.`,
        R`At $x=\pm\frac13$ the terms are $\pm\frac13$ in size and do not go to $0$, so both diverge. Interval $\left(-\frac13,\frac13\right)$.`,
      ],
      recall: R`Geometric: $|u|<1$ in terms of $x$, endpoints never included.`,
    },
    {
      id: 'lp-taylor-12', unit: U, topic: T, stage: 'exam', diff: 4, arch: 'arctan-substitution-facts', fmt: 'multi',
      prompt: R`Find the Maclaurin series of $f(x)=\arctan(x^{2})$ and its interval of convergence. Select ALL true statements.`,
      choices: [
        { t: R`$f(x)=\displaystyle\sum_{n=0}^{\infty}(-1)^{n}\frac{x^{4n+2}}{2n+1}$`, ok: true, why: R`Correct: $(x^2)^{2n+1}=x^{4n+2}$, denominator stays $2n+1$.` },
        { t: R`The interval of convergence is $[-1,1]$.`, ok: true, why: R`Correct: need $|x^{2}|\le1$, i.e. $|x|\le1$, and at $x=\pm1$ it is $\sum\frac{(-1)^n}{2n+1}$, which converges.` },
        { t: R`The coefficient of $x^{6}$ is $-\dfrac{1}{3}$.`, ok: true, why: R`Correct: $4n+2=6$ gives $n=1$: $(-1)^1\frac{1}{3}$.` },
        { t: R`$f(x)=\displaystyle\sum_{n=0}^{\infty}(-1)^{n}\frac{x^{2n+3}}{2n+1}$`, why: R`Added exponents instead of multiplying: $(x^2)^{2n+1}=x^{4n+2}$, not $x^{2n+3}$.`, err: 'algebra-slip' },
        { t: R`The interval of convergence is $(-1,1)$.`, why: R`Dropped the endpoints: at $x=\pm1$, $x^2=1$ and arctan's series converges at $1$.`, err: 'endpoint' },
      ],
      hints: [R`Put $u=x^{2}$ into $\arctan u=\sum(-1)^n\frac{u^{2n+1}}{2n+1}$.`, R`$\arctan u$ converges on $-1\le u\le1$.`],
      steps: [R`Substitute: $\arctan(x^2)=\sum(-1)^n\frac{x^{4n+2}}{2n+1}=x^2-\frac{x^6}{3}+\frac{x^{10}}{5}-\cdots$`, R`Need $-1\le x^2\le1$, i.e. $-1\le x\le1$.`, R`So $[-1,1]$, and the $x^6$ coefficient is $-\frac13$.`],
      recall: R`New interval = old interval rewritten with $u=g(x)$.`,
    },
    {
      id: 'lp-taylor-13', unit: U, topic: T, stage: 'exam', diff: 5, arch: 'integrate-term-by-term',
      prompt: R`Use a known series to find the Maclaurin series for $F(x)=\displaystyle\int_{0}^{x}e^{-t^{2}}\,dt$. Write your answer in sigma notation.`,
      choices: [
        { t: R`$\displaystyle\sum_{n=0}^{\infty}\frac{(-1)^{n}x^{2n+1}}{n!\,(2n+1)}$`, ok: true },
        { t: R`$\displaystyle\sum_{n=0}^{\infty}\frac{(-1)^{n}x^{2n+1}}{(2n+1)!}$`, why: R`Merged $n!$ and $(2n+1)$ into $(2n+1)!$; that is the sine series, not this integral.`, err: 'formula-confusion' },
        { t: R`$\displaystyle\sum_{n=0}^{\infty}\frac{(-1)^{n}x^{2n}}{n!}$`, why: R`Forgot to integrate: that is the series of $e^{-x^2}$ itself.`, err: 'setup' },
        { t: R`$\displaystyle\sum_{n=0}^{\infty}\frac{x^{2n+1}}{n!\,(2n+1)}$`, why: R`Lost the sign: $(-t^2)^n=(-1)^n t^{2n}$, so terms alternate.`, err: 'sign' },
      ],
      hints: [R`$e^{u}=\sum\frac{u^n}{n!}$ with $u=-t^{2}$.`, R`$\int_0^x t^{2n}\,dt=\frac{x^{2n+1}}{2n+1}$.`],
      steps: [
        R`$e^{-t^{2}}=\sum_{n=0}^{\infty}\frac{(-t^{2})^{n}}{n!}=\sum_{n=0}^{\infty}\frac{(-1)^{n}t^{2n}}{n!}$, valid for all $t$.`,
        R`Integrate term by term from $0$ to $x$: $\int_0^x t^{2n}dt=\frac{x^{2n+1}}{2n+1}$.`,
        R`$F(x)=\sum_{n=0}^{\infty}\frac{(-1)^{n}x^{2n+1}}{n!\,(2n+1)}=x-\frac{x^3}{3}+\frac{x^5}{10}-\frac{x^7}{42}+\cdots$, for all $x$.`,
      ],
      recall: R`Substitute first, then integrate each power.`,
    },
  ],
};
