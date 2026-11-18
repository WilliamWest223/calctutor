// js/bank/lessons/ln-serapp.js — Applications of Series (run fin). Every number checked with sympy.
const R = String.raw;
const AP = 'Applications of Series', TM = 'Taylor & Maclaurin Series';

export default {
  id: 'ln-serapp',
  goal: R`Find the exact value of a number series by spotting a known Maclaurin series inside it, build new series from known ones, and use series to do limits and integrals you cannot do otherwise.`,
  why: R`Exam 3 and the final both ask "Compute the following sum" for things like $\displaystyle\sum\frac{3^{n}}{n!}$. If you recognise the pattern it is a two-line problem. If you do not, there is no other way in. Series limits and series integrals also show up as Exam 3 items.`,
  plain: R`A Maclaurin series is a recipe that turns a function into an endless sum. For example, $e^{x}=1+x+\frac{x^{2}}{2}+\frac{x^{3}}{6}+\cdots$ for every number $x$. You already know six of these recipes from the table.

This lesson runs that recipe backwards. Suppose someone hands you the number sum $1+3+\frac{9}{2}+\frac{27}{6}+\cdots$. Look closely. It is the $e^{x}$ recipe with $x=3$ plugged in. So the whole endless sum equals $e^{3}$. You never add anything up. You just recognise the pattern.

The same idea solves two more problems. Some limits are slow with L'Hopital, but easy once you swap a function for its series. Some integrals, like $\int e^{-x^{2}}dx$, have no antiderivative you can write down. But each term of the series is a plain power of $x$, and you can integrate powers. So you integrate the series term by term.

In short: know the six series cold. Then every problem here is "swap the function for its series, or spot a series and swap it back for its function."`,
  prereq: [
    { term: 'Series', means: R`An endless sum of terms $a_0+a_1+a_2+\cdots$. $\sum$ is shorthand for "add up all of these".` },
    { term: 'Index $n$', means: R`The counter in $\sum$. "$n=0$ to $\infty$" means plug in $n=0,1,2,\dots$ and add the results.` },
    { term: 'Factorial $n!$', means: R`$n!=1\cdot2\cdot3\cdots n$, with $0!=1$. So $3!=6$ and $4!=24$.` },
    { term: 'Maclaurin series', means: R`A function written as an endless polynomial in powers of $x$ (a Taylor series centred at $0$).` },
    { term: 'Geometric series', means: R`$\displaystyle\sum_{n=0}^{\infty}x^{n}=\frac{1}{1-x}$ when $|x|<1$. Each term is the one before times $x$.` },
  ],
  sections: [
    {
      h: 'Compute means find the sum',
      body: R`On the exam, "Compute each of the following" over a series means one thing: find the number the series adds up to. It does not mean test for convergence. A student ran the ratio test on all four parts of this question and got 0 of 16. The series were identified correctly. The ratio-test limit is just not the sum.

The ratio test only tells you the series converges. It never tells you what it converges to. To get the sum, match the series to a row of the Maclaurin table and read off $x$.

Try the first part from that exam. The series is $1-\frac{1}{1!}+\frac{1}{2!}-\frac{1}{3!}+\frac{1}{4!}-\cdots$.`,
      // src: buddy Q2a
      try: { q: R`Compute $1-\dfrac{1}{1!}+\dfrac{1}{2!}-\dfrac{1}{3!}+\dfrac{1}{4!}-\cdots$.`,
        choices: [
          { t: R`$\dfrac{1}{e}$`, ok: true, why: R`The terms are $\frac{(-1)^{n}}{n!}=\frac{(-1)^{n}1^{n}}{n!}$, which is $e^{x}$ at $x=-1$. So the sum is $e^{-1}=\frac1e$.` },
          { t: R`$0$`, why: R`$0$ is the ratio-test limit, which only says the series converges. The question asks for the sum, so match the $e^{x}$ row with $x=-1$.` },
          { t: R`$e$`, why: R`$e$ is $e^{x}$ at $x=1$, where every term is positive. The signs alternate here, so $x=-1$.` },
          { t: R`$1-e$`, why: R`Nothing is skipped: the series starts with the $n=0$ term $1$, the same as $e^{x}$. No term needs subtracting.` },
        ] },
    },
    {
      h: 'Same trap when the sum starts at n = 1',
      body: R`Part (b) of that question was $\displaystyle\sum_{n=1}^{\infty}\frac{(-\pi^{2})^{n}}{(2n)!}$. Split the top: $(-\pi^{2})^{n}=(-1)^{n}\pi^{2n}=(-1)^{n}(\pi)^{2n}$. With $(2n)!$ on the bottom this is the $\cos x$ row at $x=\pi$.

The sum starts at $n=1$, but $\cos x$ starts at $n=0$ with the term $1$. So the sum is $\cos\pi-1$.`,
      // src: buddy Q2b
      try: { q: R`Compute $\displaystyle\sum_{n=1}^{\infty}\frac{(-\pi^{2})^{n}}{(2n)!}$.`,
        choices: [
          { t: R`$-2$`, ok: true, why: R`$\cos\pi=1+\sum_{n=1}^{\infty}\frac{(-1)^{n}\pi^{2n}}{(2n)!}$, so the sum is $\cos\pi-1=-1-1=-2$.` },
          { t: R`$-1$`, why: R`$-1$ is $\cos\pi$. The sum starts at $n=1$, so it is missing the $n=0$ term $1$. Subtract it: $-1-1=-2$.` },
          { t: R`$0$`, why: R`$0$ is the ratio-test limit. It says the series converges, not what it adds up to.` },
          { t: R`$\cos(\pi^{2})-1$`, why: R`You read $x=\pi^{2}$. But $(-\pi^{2})^{n}=(-1)^{n}\pi^{2n}$ and the $\cos$ row has $x^{2n}$, so $x=\pi$.` },
        ] },
    },
    {
      h: 'Same trap with a ln series',
      body: R`Part (c) was $\displaystyle\sum_{n=1}^{\infty}\frac{(-1)^{n}}{n\,3^{n}}$. No factorial and a plain $n$ on the bottom: the $\ln$ row. Write it as $\displaystyle\sum\frac{1}{n}\left(-\frac13\right)^{n}$.

The $\ln(1+x)$ row is $\sum\frac{(-1)^{n+1}x^{n}}{n}$. Its sign pattern is shifted by one from this sum. Compare the first terms. The sum starts $-\frac13+\cdots$. The row at $x=\frac13$ starts $+\frac13-\cdots$. So the sum is the NEGATIVE of $\ln\left(1+\frac13\right)$.`,
      // src: buddy Q2c
      try: { q: R`Compute $\displaystyle\sum_{n=1}^{\infty}\frac{(-1)^{n}}{n\,3^{n}}$.`,
        choices: [
          { t: R`$-\ln\dfrac{4}{3}$`, ok: true, why: R`$\sum\frac{(-1)^{n}}{n3^{n}}=-\sum\frac{(-1)^{n+1}(1/3)^{n}}{n}=-\ln\left(1+\frac13\right)=-\ln\frac43$. The first term is $-\frac13$, so the answer is negative.` },
          { t: R`$\ln\dfrac{4}{3}$`, why: R`Sign slip. The series starts with $-\frac13$, so it is negative. $\ln\frac43\approx0.29$ is positive.` },
          { t: R`$\dfrac{1}{3}$`, why: R`$\frac13$ is the ratio-test limit. It is the value that makes the series converge, not its sum.` },
          { t: R`$\ln\dfrac{2}{3}$`, why: R`That plugs $x=-\frac13$ into $\ln(1+x)$. But the $\ln(1+x)$ row has $(-1)^{n+1}$, which this sum does not. Compare the first terms.` },
        ] },
    },
    {
      h: 'Same trap with an arctan series',
      body: R`Part (d) was $4-\frac43+\frac45-\frac47+\frac49-\cdots$. The bottoms are odd numbers and the signs alternate. That is $\tan^{-1}x$ at $x=1$: $1-\frac13+\frac15-\cdots=\frac{\pi}{4}$. Every term here has an extra factor $4$.

So pull the $4$ out front: $4\left(1-\frac13+\frac15-\frac17+\cdots\right)$. The bracket is $\tan^{-1}x$ at $x=1$, which is inside its interval $[-1,1]$. Do not run the ratio test. It gives the limit $1$, and that is not the sum.`,
      // src: buddy Q2d
      try: { q: R`Compute $4-\dfrac{4}{3}+\dfrac{4}{5}-\dfrac{4}{7}+\dfrac{4}{9}-\cdots$.`,
        choices: [
          { t: R`$\pi$`, ok: true, why: R`Factor out $4$: $4\left(1-\frac13+\frac15-\cdots\right)=4\tan^{-1}(1)=4\cdot\frac{\pi}{4}=\pi$.` },
          { t: R`$1$`, why: R`$1$ is the ratio-test limit. It says the test is inconclusive, and it is not the sum.` },
          { t: R`$\dfrac{\pi}{4}$`, why: R`$\frac{\pi}{4}$ is the sum of $1-\frac13+\frac15-\cdots$. Every term here has an extra factor $4$, so multiply by $4$.` },
          { t: R`$4$`, why: R`$4$ is only the first term. The later terms are not zero, so they change the total.` },
        ] },
    },
    {
      h: 'The six series you must know',
      body: R`Everything in this lesson starts from this table. Each line says "this function equals this endless sum, for these $x$".

$e^{x}=\displaystyle\sum_{n=0}^{\infty}\frac{x^{n}}{n!}$ for all $x$. $\sin x=\displaystyle\sum_{n=0}^{\infty}\frac{(-1)^{n}x^{2n+1}}{(2n+1)!}$ for all $x$. $\cos x=\displaystyle\sum_{n=0}^{\infty}\frac{(-1)^{n}x^{2n}}{(2n)!}$ for all $x$.

$\dfrac{1}{1-x}=\displaystyle\sum_{n=0}^{\infty}x^{n}$ on $(-1,1)$. $\ln(1+x)=\displaystyle\sum_{n=1}^{\infty}\frac{(-1)^{n+1}x^{n}}{n}$ on $(-1,1]$. $\tan^{-1}x=\displaystyle\sum_{n=0}^{\infty}\frac{(-1)^{n}x^{2n+1}}{2n+1}$ on $[-1,1]$.

How to tell them apart fast: look at the bottom. Plain $n!$ means $e^{x}$. $(2n+1)!$ with odd powers means $\sin$. $(2n)!$ with even powers means $\cos$. No factorial and a plain $n$ means $\ln(1+x)$. No factorial and an odd number $2n+1$ means $\tan^{-1}$. No bottom at all means geometric. The $(-1)^{n}$ just makes the signs alternate $+,-,+,-$.`,
      check: { q: R`Which known series has terms $\dfrac{(-1)^{n}x^{2n+1}}{2n+1}$?`, a: R`$\tan^{-1}x$: no factorial, odd number $2n+1$ on the bottom.` },
    },
    {
      h: 'Summing a series: match it and read off x',
      body: R`Now run the table backwards. You are given a sum of numbers, with no $x$ in it. Your job is to find which row it is, and which $x$ was plugged in.

Small example: $\displaystyle\sum_{n=0}^{\infty}\frac{3^{n}}{n!}$. The bottom is plain $n!$, so it is the $e^{x}$ row. The $e^{x}$ row has $x^{n}$ on top. Here the top is $3^{n}$. So $x^{n}=3^{n}$, which means $x=3$. The sum is $e^{3}$.

The key move: rewrite the top so it is literally $(\text{something})^{n}$. That "something" is your $x$. Watch fractions. $\dfrac{1}{n!\,2^{n}}=\dfrac{(1/2)^{n}}{n!}$, so $x=\frac12$ and the sum is $e^{1/2}=\sqrt e$, not $e^{2}$.

In words: the bottom tells you WHICH function, the $n$th power tells you WHICH $x$. The answer is the function evaluated at that $x$.`,
      check: { q: R`What is $\displaystyle\sum_{n=0}^{\infty}\frac{5^{n}}{n!}$?`, a: R`$e^{5}$: plain $n!$ means $e^{x}$, and $x^{n}=5^{n}$ gives $x=5$.` },
    },
    {
      h: 'When the index starts in the wrong place',
      body: R`The table rows start at a fixed $n$ (most at $n=0$, $\ln(1+x)$ at $n=1$). If your sum starts later, it is missing the first terms. You must account for them.

Example from lecture: $S=\displaystyle\sum_{n=1}^{\infty}\frac{(-1)^{n}\pi^{2n}}{2^{2n}(2n)!}$. The $(2n)!$ and even power say $\cos$. Rewrite the top: $\dfrac{\pi^{2n}}{2^{2n}}=\left(\dfrac{\pi}{2}\right)^{2n}$, so $x=\frac{\pi}{2}$.

But $\cos x$ starts at $n=0$, and the $n=0$ term is $\frac{x^{0}}{0!}=1$. So $\cos x=1+\displaystyle\sum_{n=1}^{\infty}\frac{(-1)^{n}x^{2n}}{(2n)!}$. Plug in $x=\frac{\pi}{2}$: $\cos\frac{\pi}{2}=1+S$. Since $\cos\frac{\pi}{2}=0$, you get $0=1+S$, so $S=-1$.

Why this works: the full series equals the function. Your sum is the full series minus the terms it skipped. So subtract those skipped terms from the function value.`,
      check: { q: R`What is $\displaystyle\sum_{n=1}^{\infty}\frac{1}{n!}$?`, a: R`$e-1$: the full $e^{x}$ series at $x=1$ is $e$, minus the skipped $n=0$ term $1$.` },
    },
    {
      h: 'New series from old: substitute, multiply, re-centre',
      body: R`You rarely need to take derivatives to get a new series. You can build it from a known one.

**Substitute.** Replace $x$ by something else everywhere. $e^{u}=\sum\frac{u^{n}}{n!}$ with $u=-x^{2}$ gives $e^{-x^{2}}=\sum\frac{(-1)^{n}x^{2n}}{n!}$. The $x^{2}$ goes into the power only, never into the factorial.

**Multiply by a power.** Lecture example: $x^{10}\sin x=x^{10}\displaystyle\sum\frac{(-1)^{n}x^{2n+1}}{(2n+1)!}=\sum\frac{(-1)^{n}x^{2n+11}}{(2n+1)!}$. You add exponents ($x^{10}\cdot x^{2n+1}=x^{2n+11}$). The factorial does not change. Still valid for all $x$.

**Re-centre a geometric series.** For $\frac1x$ at centre $-3$, write $x=-3+(x+3)$. Then $\dfrac1x=\dfrac{1}{-3+(x+3)}=-\dfrac13\cdot\dfrac{1}{1-\frac{x+3}{3}}=\displaystyle\sum_{n=0}^{\infty}\frac{-(x+3)^{n}}{3^{n+1}}$. It converges when $\left|\frac{x+3}{3}\right|<1$, so on $(-6,0)$. This matches what lecture got from derivatives, with much less work.`,
      check: { q: R`What is the Maclaurin series of $x^{2}e^{x}$?`, a: R`$\displaystyle\sum_{n=0}^{\infty}\frac{x^{n+2}}{n!}$: multiply each term by $x^{2}$, factorial unchanged.` },
    },
    {
      h: 'Differentiate a known series to sum harder ones',
      body: R`Some sums have an extra $n$ on top, like $\displaystyle\sum\frac{n}{2^{n}}$. No row of the table has that. The trick from lecture: differentiate the geometric series.

$\dfrac{1}{1-x}=\displaystyle\sum_{n=0}^{\infty}x^{n}$. Take $\frac{d}{dx}$ of both sides. The left gives $\dfrac{1}{(1-x)^{2}}$. On the right, each $x^{n}$ becomes $nx^{n-1}$. So $\dfrac{1}{(1-x)^{2}}=\displaystyle\sum_{n=1}^{\infty}nx^{n-1}$ on $(-1,1)$. (The $n=0$ term is $0$, so starting at $n=0$ or $n=1$ gives the same sum.)

Now sum $\displaystyle\sum\frac{n}{2^{n}}$. Multiply both sides by $x$ to match the power: $\dfrac{x}{(1-x)^{2}}=\displaystyle\sum nx^{n}$. Plug in $x=\frac12$: $\dfrac{1/2}{(1/2)^{2}}=\dfrac{1/2}{1/4}=2$.

Why it is allowed: inside its interval, a power series can be differentiated term by term, and the result is the derivative of the function.`,
      check: { q: R`Which function has series $\displaystyle\sum_{n=1}^{\infty}nx^{n}$?`, a: R`$\dfrac{x}{(1-x)^{2}}$, for $|x|<1$.` },
      // src: HW3 P10
      try: { q: R`Find the function that $-2x+4x^{3}-6x^{5}+8x^{7}-\cdots$ converges to on its interval of convergence.`,
        choices: [
          { t: R`$\dfrac{-2x}{(1+x^{2})^{2}}$`, ok: true, why: R`$\frac{1}{1+x^{2}}=1-x^{2}+x^{4}-\cdots$. Differentiate: $-2x+4x^{3}-6x^{5}+\cdots=\frac{d}{dx}\frac{1}{1+x^{2}}=\frac{-2x}{(1+x^{2})^{2}}$.` },
          { t: R`$\dfrac{2x}{(1+x^{2})^{2}}$`, why: R`Sign slip. The first term is $-2x$, and $\frac{d}{dx}(1+x^{2})^{-1}=-2x(1+x^{2})^{-2}$ carries the minus.` },
          { t: R`$\dfrac{-2x}{1+x^{2}}$`, why: R`That is $-2x$ times the geometric sum, which gives $-2x+2x^{3}-2x^{5}$. The coefficients here grow ($2,4,6$), so the square must be in the bottom.` },
          { t: R`$\dfrac{2x}{(1-x^{2})^{2}}$`, why: R`That series has all plus signs: $2x+4x^{3}+6x^{5}+\cdots$. The signs here alternate, so the ratio is $-x^{2}$, giving $1+x^{2}$ on the bottom.` },
        ] },
    },
    {
      h: 'Limits with series',
      body: R`A limit like $\displaystyle\lim_{x\to0}\frac{\tan^{-1}x-x}{x^{3}}$ is $\frac00$. L'Hopital would need three rounds. Series do it in one line.

Swap $\tan^{-1}x$ for its series: $\tan^{-1}x=x-\frac{x^{3}}{3}+\frac{x^{5}}{5}-\cdots$. Then $\tan^{-1}x-x=-\frac{x^{3}}{3}+\frac{x^{5}}{5}-\cdots$. The $x$'s cancel, which is why the limit was $\frac00$.

Divide every term by $x^{3}$: $-\frac13+\frac{x^{2}}{5}-\cdots$. As $x\to0$, every term with an $x$ left in it goes to $0$. The limit is $-\frac13$.

In words: expand, cancel, divide by the bottom power, and keep only the term with no $x$ left.`,
      check: { q: R`Find $\displaystyle\lim_{x\to0}\frac{1-\cos x}{x^{2}}$.`, a: R`$1-\cos x=\frac{x^{2}}{2}-\frac{x^{4}}{24}+\cdots$, divide by $x^{2}$: the limit is $\frac12$.` },
      // src: HW3 P18
      try: { q: R`Use series to find $\displaystyle\lim_{x\to0}\frac{\sin x-\tan^{-1}x}{x^{3}}$.`,
        choices: [
          { t: R`$\dfrac{1}{6}$`, ok: true, why: R`$\sin x-\tan^{-1}x=\left(x-\frac{x^{3}}{6}\right)-\left(x-\frac{x^{3}}{3}\right)+\cdots=\frac{x^{3}}{6}+\cdots$. Divide by $x^{3}$: $\frac16$.` },
          { t: R`$-\dfrac{1}{6}$`, why: R`You took $\tan^{-1}x-\sin x$. The order is $\sin x$ first, so the $x^{3}$ coefficient is $-\frac16+\frac13=+\frac16$.` },
          { t: R`$-\dfrac{1}{2}$`, why: R`You added the $x^{3}$ coefficients: $-\frac16-\frac13=-\frac12$. The minus in front of $\tan^{-1}x$ flips the sign of its $-\frac13$.` },
          { t: R`$0$`, why: R`Only the $x$ terms cancel. The $x^{3}$ terms $-\frac{x^{3}}{6}$ and $-\frac{x^{3}}{3}$ do not, and the bottom is $x^{3}$ too.` },
        ] },
    },
    {
      h: 'Integrals with series, and how big the error is',
      body: R`$\int e^{-x^{2}}dx$ has no antiderivative you can write with normal functions. But its series is just powers of $x$, and powers are easy to integrate.

Step 1, substitute: $e^{-x^{2}}=1-x^{2}+\frac{x^{4}}{2}-\frac{x^{6}}{6}+\frac{x^{8}}{24}-\cdots$. Step 2, integrate each term from $0$ to $1$: $\int_0^1x^{k}dx=\frac{1}{k+1}$. You get $1-\frac13+\frac{1}{10}-\frac{1}{42}+\frac{1}{216}-\cdots$.

Step 3, stop after the terms the question asks for. This number series alternates and its terms shrink to $0$. For such a series, the error from stopping is at most the **first term you left out**. Why: each new term overshoots and then undershoots the true value, so the true value is always trapped within one term of your partial sum.

Example: keep $1-\frac13+\frac1{10}=\frac{23}{30}\approx0.7667$. The first left-out term is $\frac{1}{42}\approx0.0238$, so the error is at most $\frac1{42}$. (True value $\approx0.7468$.)`,
      widget: { lab: 'altest', set: { ex: '∫₀¹ e^{-x²} dx', N: 3 }, caption: R`At $N=3$ the sum is $\frac{23}{30}$ and the next-term bound is $\frac{1}{42}$. Drag $N$ up and watch the bound shrink.` },
      // src: HW3 P13c
      try: { q: R`$\displaystyle\int_{0}^{0.6}\frac{\sin t}{t}\,dt=0.6-\frac{0.6^{3}}{3\cdot3!}+\frac{0.6^{5}}{5\cdot5!}-\frac{0.6^{7}}{7\cdot7!}+\cdots$. The terms are $0.6,\ 0.012,\ 0.0001296,\ 0.0000008,\dots$ How many terms give error below $10^{-4}$?`,
        choices: [
          { t: R`$3$`, ok: true, why: R`Keep $0.6,\ 0.012,\ 0.0001296$. The first left-out term is $\approx0.0000008<10^{-4}$, so the error bound holds. With $2$ terms the left-out $0.0001296$ is too big.` },
          { t: R`$2$`, why: R`With $2$ terms the first left-out term is $0.0001296$, which is bigger than $10^{-4}$. Keep one more.` },
          { t: R`$4$`, why: R`That is the index of the first small term, which is LEFT OUT. You keep the terms before it, so $3$ terms are enough. $4$ works but is not the minimum.` },
          { t: R`$1$`, why: R`With $1$ term the first left-out term is $0.012$, far bigger than $10^{-4}$.` },
        ] },
    },
    {
      h: 'Estimating sin(0.5) with a stopping rule',
      body: R`The same error rule works on a plain number. $\sin(0.5)=0.5-\frac{0.5^{3}}{6}+\frac{0.5^{5}}{120}-\cdots=0.5-\frac1{48}+\frac1{3840}-\cdots$. The terms alternate and shrink, so the error is at most the first term you drop.

The exam has no calculator, so keep the terms as exact fractions. Powers of $0.5$ are easy: $0.5^{3}=\frac18$ and $0.5^{5}=\frac1{32}$. Use the widget below to see the actual error sit under the next-term bound.`,
      widget: { lab: 'altest', set: { ex: 'sin(0.5)', N: 2 }, caption: R`At $N=2$ the sum is $\frac{23}{48}\approx0.47917$. The next term is $\frac{1}{3840}\approx0.00026$, and the actual error sits below it.` },
      // src: altest widget, HW3 P14b style
      try: { q: R`You approximate $\sin(0.5)$ by $0.5-\frac{1}{48}$. What is the alternating series error bound?`,
        choices: [
          { t: R`$\dfrac{1}{3840}$`, ok: true, why: R`The first dropped term is $\frac{0.5^{5}}{5!}=\frac{1}{32\cdot120}=\frac{1}{3840}$.` },
          { t: R`$\dfrac{1}{48}$`, why: R`$\frac1{48}$ is the last term you KEPT. The bound is the first term you left out.` },
          { t: R`$\dfrac{1}{384}$`, why: R`$\frac{0.5^{5}}{5!}$ has $32\cdot120=3840$ on the bottom. Check the arithmetic: $0.5^{5}=\frac1{32}$.` },
        ] },
    },
    {
      h: 'Estimating ln(1.2) with a stopping rule',
      body: R`$\ln(1.2)=\ln(1+0.2)=0.2-\frac{0.2^{2}}{2}+\frac{0.2^{3}}{3}-\cdots$. This is the $\ln(1+x)$ row at $x=0.2$, inside $(-1,1]$. It alternates with shrinking terms, so the same error rule applies.

Keep the terms as fractions, since there is no calculator. $0.2=\frac15$, so the terms are $\frac15$, $\frac{1}{50}$, $\frac{1}{375}$, and so on. Use the widget below to see how fast the bound shrinks as you add terms.`,
      widget: { lab: 'altest', set: { ex: 'ln(1.2)', N: 2 }, caption: R`At $N=2$ the sum is $0.18$ and the next term is $\frac{0.2^{3}}{3}=\frac{1}{375}$.` },
      // src: altest widget
      try: { q: R`You keep $0.2-\dfrac{0.2^{2}}{2}$ to approximate $\ln(1.2)$. What is the error bound?`,
        choices: [
          { t: R`$\dfrac{1}{375}$`, ok: true, why: R`The first dropped term is $\frac{0.2^{3}}{3}=\frac{1/125}{3}=\frac{1}{375}$.` },
          { t: R`$\dfrac{1}{50}$`, why: R`$\frac{0.2^{2}}{2}=\frac1{50}$ is the last term you kept. The bound is the first one dropped.` },
          { t: R`$\dfrac{1}{125}$`, why: R`You forgot to divide by $3$. The $\ln$ row has $\frac{x^{n}}{n}$, so the third term is $\frac{0.2^{3}}{3}$.` },
          { t: R`$\dfrac{1}{2500}$`, why: R`That is the fourth term $\frac{0.2^{4}}{4}$. You skipped the third, which is the first one dropped.` },
        ] },
    },
  ],
  recipe: [
    R`Name the series from the bottom: $n!$ is $e^{x}$, $(2n+1)!$ is $\sin$, $(2n)!$ is $\cos$, $n$ is $\ln(1+x)$, $2n+1$ is $\tan^{-1}$, nothing is geometric. An extra $n$ on top means differentiate the geometric series.`,
    R`Rewrite the top as $(\text{something})^{n}$ (or $^{2n}$, $^{2n+1}$) to read off $x$. Fractions like $\frac{1}{2^{n}}$ mean $x=\frac12$.`,
    R`Compare starting indexes. If your sum skips terms the table includes, subtract those terms from the function value.`,
    R`Check the signs: for $\sin$, $\cos$, $\ln$, $\tan^{-1}$ the $(-1)^{n}$ belongs to the row, so it must be in your sum. For $e^{x}$ and geometric, a $(-1)^{n}$ means $x$ is negative, e.g. $\sum\frac{(-2)^{n}}{n!}=e^{-2}$.`,
    R`For limits: expand, cancel, divide by the bottom power, keep the constant term.`,
    R`For integrals: substitute into the known series, integrate term by term, stop where asked, and bound the error by the first left-out term.`,
  ],
  worked: [
    {
      q: R`Compute $\displaystyle\sum_{n=0}^{\infty}\frac{3^{n}}{n!}$.`,
      steps: [
        R`Look at the bottom: plain $n!$. That is the $e^{x}$ row, $e^{x}=\sum_{n=0}^{\infty}\frac{x^{n}}{n!}$.`,
        R`Match the tops: $x^{n}=3^{n}$, so $x=3$.`,
        R`Compare indexes: both start at $n=0$, so no terms are missing.`,
        R`So the sum is $e^{3}$.`,
      ],
      note: R`The lecturer's trap is $\sum\frac{1}{n!\,2^{n}}$. The $2^{n}$ is on the bottom, so $x=\frac12$ and the sum is $\sqrt e$, not $e^{2}$.`,
    },
    {
      q: R`Compute $S=\displaystyle\sum_{n=1}^{\infty}\frac{(-1)^{n}\pi^{2n}}{2^{2n}(2n)!}$. (lecture example)`,
      steps: [
        R`Bottom is $(2n)!$ with an even power and $(-1)^{n}$: the $\cos x$ row, $\cos x=\sum_{n=0}^{\infty}\frac{(-1)^{n}x^{2n}}{(2n)!}$.`,
        R`Rewrite the top: $\frac{\pi^{2n}}{2^{2n}}=\left(\frac{\pi}{2}\right)^{2n}$, so $x=\frac{\pi}{2}$.`,
        R`Indexes differ: $S$ starts at $n=1$, $\cos$ at $n=0$. The skipped $n=0$ term is $\frac{(\pi/2)^{0}}{0!}=1$. So $\cos\frac{\pi}{2}=1+S$.`,
        R`$\cos\frac{\pi}{2}=0$, so $0=1+S$ and $S=-1$.`,
      ],
      note: R`Forgetting the skipped $1$ gives the wrong answer $0$.`,
    },
    {
      q: R`Compute $\displaystyle\sum_{n=0}^{\infty}\frac{n}{2^{n}}$. (lecture example)`,
      steps: [
        R`There is an extra $n$ on top, so no table row fits. Start from the geometric series $\frac{1}{1-x}=\sum x^{n}$.`,
        R`Differentiate both sides: $\frac{1}{(1-x)^{2}}=\sum nx^{n-1}$, valid for $|x|<1$.`,
        R`Our sum has $x^{n}$, not $x^{n-1}$, so multiply both sides by $x$: $\frac{x}{(1-x)^{2}}=\sum nx^{n}$.`,
        R`Plug in $x=\frac12$ (inside $(-1,1)$): $\frac{1/2}{(1-1/2)^{2}}=\frac{1/2}{1/4}=2$.`,
      ],
      // src: lecture example (extra n on top)
      ask: [{ at: 3, q: R`Step 2 gave $\sum nx^{n-1}$. Our sum has $x^{n}$. What do you do to both sides?`,
        choices: [
          { t: R`Multiply by $x$`, ok: true, why: R`$x\cdot x^{n-1}=x^{n}$, so multiplying both sides by $x$ gives $\sum nx^{n}$.` },
          { t: R`Divide by $x$`, why: R`That gives $x^{n-2}$, moving the wrong way.` },
          { t: R`Differentiate again`, why: R`That adds another factor $n-1$ and lowers the power again.` },
        ] }],
      note: R`Lecture did the same thing by writing $\frac12\sum n\left(\frac12\right)^{n-1}=\frac12\cdot\frac{1}{(1/2)^{2}}$. Same answer, $2$.`,
    },
    {
      q: R`Showing all your work, use the first four nonzero terms of a Maclaurin series to approximate $\displaystyle\int_{0}^{1}e^{-x^{2}}\,dx$, and give a bound on the error.`,
      steps: [
        R`Substitute $u=-x^{2}$ into $e^{u}=\sum\frac{u^{n}}{n!}$: $e^{-x^{2}}=1-x^{2}+\frac{x^{4}}{2}-\frac{x^{6}}{6}+\frac{x^{8}}{24}-\cdots$.`,
        R`Integrate term by term using $\int_0^1x^{k}dx=\frac1{k+1}$: $1-\frac13+\frac{1}{2\cdot5}-\frac{1}{6\cdot7}+\frac{1}{24\cdot9}-\cdots=1-\frac13+\frac1{10}-\frac1{42}+\frac1{216}-\cdots$.`,
        R`Add the first four: $1-\frac13+\frac1{10}-\frac1{42}=\frac{26}{35}\approx0.7429$.`,
        R`The series alternates and its terms shrink to $0$, so the error is at most the first left-out term: $\frac1{216}\approx0.0046$.`,
      ],
      // src: HW3 P14b
      ask: [{ at: 4, q: R`You kept four terms. Which number bounds the error?`,
        choices: [
          { t: R`$\frac{1}{216}$, the fifth term`, ok: true, why: R`The first left-out term is the fifth, $\frac{1}{24\cdot9}=\frac1{216}$.` },
          { t: R`$\frac{1}{42}$, the fourth term`, why: R`$\frac1{42}$ is the last term you kept. The bound is the first one left out.` },
          { t: R`$\frac{26}{35}$`, why: R`That is the approximation itself, not the error.` },
        ] }],
      note: R`True value $\approx0.7468$, which is within $\frac{1}{216}$ of $\frac{26}{35}$.`,
    },
    {
      q: R`Use series to evaluate $\displaystyle\lim_{x\to0}\frac{e^{2x}-1-x}{x}$.`,
      // src: HW3 P17
      steps: [
        R`Substitute $u=2x$ into $e^{u}=\sum\frac{u^{n}}{n!}$: $e^{2x}=1+2x+2x^{2}+\frac{4x^{3}}{3}+\cdots$.`,
        R`Subtract $1+x$: $e^{2x}-1-x=x+2x^{2}+\frac{4x^{3}}{3}+\cdots$. The $1$ cancels. One $x$ survives, because $2x-x=x$.`,
        R`Divide by $x$: $1+2x+\frac{4x^{2}}{3}+\cdots$.`,
        R`As $x\to0$ only the constant $1$ is left. The limit is $1$.`,
      ],
      ask: [{ at: 2, q: R`What is $e^{2x}-1-x$ up to the $x$ term?`,
        choices: [
          { t: R`$x$`, ok: true, why: R`$e^{2x}=1+2x+\cdots$, so subtracting $1+x$ leaves $2x-x=x$.` },
          { t: R`$2x$`, why: R`You subtracted $1$ but forgot the $-x$. The numerator has $-1-x$.` },
          { t: R`$0$`, why: R`The $1$ cancels, but $2x-x=x$ remains because $e^{2x}$ has $2x$, not $x$.` },
        ] }],
      note: R`Dropping the $2$ in $e^{2x}$ would cancel the $x$ term completely and give the wrong limit $0$.`,
    },
    {
      q: R`Use series to evaluate $\displaystyle\lim_{x\to0}\frac{\cos x-1}{x^{2}}$.`,
      // src: HW3 P19
      steps: [
        R`$\cos x=1-\frac{x^{2}}{2}+\frac{x^{4}}{24}-\cdots$.`,
        R`Subtract $1$: $\cos x-1=-\frac{x^{2}}{2}+\frac{x^{4}}{24}-\cdots$.`,
        R`Divide by $x^{2}$: $-\frac12+\frac{x^{2}}{24}-\cdots$.`,
        R`As $x\to0$ the terms with $x$ in them go to $0$. The limit is $-\frac12$.`,
      ],
      note: R`The earlier check had $1-\cos x$, which gives $+\frac12$. Here the order flips the sign.`,
    },
  ],
  cards: [
    // src: recognition table, buddy Q1/Q2, HW3 P6-10
    { f: R`$\displaystyle\sum_{n=0}^{\infty}\frac{x^{n}}{n!}$ (any $x$) equals ?`, b: R`$e^{x}$. Plain $n!$ on the bottom.` },
    { f: R`$\displaystyle\sum_{n=0}^{\infty}\frac{(-1)^{n}x^{2n+1}}{(2n+1)!}$ equals ?`, b: R`$\sin x$. Odd powers, $(2n+1)!$.` },
    { f: R`$\displaystyle\sum_{n=0}^{\infty}\frac{(-1)^{n}x^{2n}}{(2n)!}$ equals ?`, b: R`$\cos x$. Even powers, $(2n)!$.` },
    { f: R`$\displaystyle\sum_{n=0}^{\infty}x^{n}$ equals ?`, b: R`$\dfrac{1}{1-x}$, for $|x|<1$.` },
    { f: R`$\displaystyle\sum_{n=1}^{\infty}\frac{(-1)^{n+1}x^{n}}{n}$ equals ?`, b: R`$\ln(1+x)$, on $(-1,1]$. Starts at $n=1$.` },
    { f: R`$\displaystyle\sum_{n=0}^{\infty}\frac{(-1)^{n}x^{2n+1}}{2n+1}$ equals ?`, b: R`$\tan^{-1}x$, on $[-1,1]$. At $x=1$ it is $\frac{\pi}{4}$.` },
    { f: R`$\displaystyle\sum_{n=1}^{\infty}\frac{x^{n}}{n}$ equals ?`, b: R`$-\ln(1-x)$. Use it for $\sum\frac{(-1)^{n}}{n3^{n}}=-\ln\frac43$.` },
    { f: R`$\displaystyle\sum_{n=1}^{\infty}nx^{n}$ equals ?`, b: R`$\dfrac{x}{(1-x)^{2}}$. Differentiate the geometric series, then multiply by $x$.` },
    { f: R`A problem says "Compute" over a series. What do you find?`, b: R`The sum: match a table row and read off $x$. Never the ratio-test limit.` },
    { f: R`Alternating series error after stopping?`, b: R`At most the first term you left out.` },
  ],
  exam: [
    R`Compute the following sum: $\sum\frac{3^{n}}{n!}$ (Exam 3 Q6; also on the final).`,
    R`Use a Maclaurin series to approximate $\int_0^1 e^{-x^{2}}dx$; give the first nonzero terms and the error bound.`,
    R`Use series to evaluate $\lim_{x\to0}\frac{\tan^{-1}x-x}{x^{3}}$.`,
    R`Find the sum of the series by recognising it as a Taylor series evaluated at a point, including sums that start at $n=1$.`,
    R`Find the Taylor series of a function by building it from a known series (multiply by a power, substitute, re-centre a geometric series, differentiate).`,
  ],
  traps: [
    R`Reading $x=2$ when the term has $\frac{1}{2^{n}}$. Rewrite it as $\left(\frac12\right)^{n}$ first: $x=\frac12$.`,
    R`Ignoring a starting index that differs from the table. Write out the skipped terms and subtract them from the function value.`,
    R`Forgetting the alternating factor when matching $\sin$, $\cos$, $\ln$ or $\tan^{-1}$. If the $(-1)^{n}$ is missing, the series is not that row at that $x$.`,
    R`Putting the $x^{2}$ from $e^{-x^{2}}$ into the factorial. The term is $\frac{(-1)^{n}x^{2n}}{n!}$, not over $(2n)!$. Substitution changes powers only.`,
    R`Bounding the integral error with the last term you kept. The bound is the first term you left out.`,
  ],
  practice: [
    {
      id: 'lp-serapp-01', unit: 'series', topic: TM, stage: 'warmup', diff: 1, arch: 'identify-series-tf', tf: true,
      prompt: R`True or false: $\displaystyle\sum_{n=0}^{\infty}\frac{(-1)^{n}x^{2n}}{(2n)!}$ is the Maclaurin series of $\sin x$.`,
      choices: [
        { t: 'True', why: R`Even powers over $(2n)!$ belong to $\cos x$. $\sin x$ has odd powers $x^{2n+1}$ over $(2n+1)!$.`, err: 'formula-confusion' },
        { t: 'False', ok: true },
      ],
      hints: [R`Look at the bottom: $(2n)!$ or $(2n+1)!$?`, R`Even powers and $(2n)!$ start with $1$. Does $\sin 0=1$?`],
      steps: [R`The $n=0$ term is $\frac{x^{0}}{0!}=1$, but $\sin0=0$, so this cannot be $\sin x$.`, R`Even powers over $(2n)!$ is $\cos x$. False.`],
      recall: R`$(2n)!$ and even powers: $\cos$. $(2n+1)!$ and odd powers: $\sin$.`,
    },
    {
      id: 'lp-serapp-02', unit: 'series', topic: AP, stage: 'warmup', diff: 2, arch: 'reverse-find-x',
      prompt: R`The sum $\displaystyle\sum_{n=0}^{\infty}\frac{c^{n}}{n!}$ equals $\sqrt e$. What is the number $c$?`,
      choices: [
        { t: R`$\dfrac12$`, ok: true },
        { t: R`$2$`, why: R`You inverted it. $\sqrt e=e^{1/2}$, and the sum is $e^{c}$, so $c$ is the exponent $\frac12$, not $2$.`, err: 'algebra-slip' },
        { t: R`$\dfrac14$`, why: R`$\frac14$ would give $e^{1/4}$. The square root means exponent $\frac12$, not $\frac12\cdot\frac12$.`, err: 'algebra-slip' },
        { t: R`$\sqrt e$`, why: R`$\sqrt e$ is the value of the sum, not $c$. The sum equals $e^{c}$, so $c$ is the exponent.`, err: 'concept' },
      ],
      hints: [R`Plain $n!$ means the sum is $e^{c}$.`, R`Write $\sqrt e$ as $e$ to a power.`],
      steps: [R`Plain $n!$ with $c^{n}$ on top: $\sum\frac{c^{n}}{n!}=e^{c}$.`, R`$\sqrt e=e^{1/2}$.`, R`So $e^{c}=e^{1/2}$ and $c=\frac12$.`],
      recall: R`The number raised to the $n$ is the exponent on $e$.`,
    },
    {
      id: 'lp-serapp-03', unit: 'series', topic: AP, stage: 'core', diff: 2, arch: 'sum-exp-direct', fmt: 'free',
      prompt: R`Compute the following sum: $\displaystyle\sum_{n=0}^{\infty}\frac{3^{n}}{n!}$.`,
      choices: [
        { t: R`$e^{3}$`, ok: true },
        { t: R`$3e$`, why: R`The $3$ is raised to the $n$, so it is the value of $x$, not a multiplier. Match against $\frac{x^{n}}{n!}$.`, err: 'formula-confusion' },
        { t: R`$e^{1/3}$`, why: R`You inverted $x$. The $3^{n}$ is on top, so $x=3$. Only a $3^{n}$ on the bottom would give $x=\frac13$.`, err: 'formula-confusion' },
        { t: R`$e^{3}-1$`, why: R`The sum starts at $n=0$, same as $e^{x}$, so no term is missing. Subtract $1$ only when it starts at $n=1$.`, err: 'index' },
      ],
      hints: [R`Which row has plain $n!$ on the bottom?`, R`$e^{x}=\sum_{n=0}^{\infty}\frac{x^{n}}{n!}$. Match $x^{n}$ to $3^{n}$.`],
      steps: [R`Plain $n!$: the $e^{x}$ row.`, R`$x^{n}=3^{n}$, so $x=3$.`, R`Both start at $n=0$. Sum $=e^{3}$.`],
      recall: R`Plain $n!$ is $e^{x}$. Read $x$ off the $n$th power.`,
    },
    {
      id: 'lp-serapp-04', unit: 'series', topic: AP, stage: 'core', diff: 3, arch: 'sum-index-shift', fmt: 'free',
      prompt: R`Compute $\displaystyle\sum_{n=1}^{\infty}\frac{2^{n}}{n!}$.`,
      choices: [
        { t: R`$e^{2}-1$`, ok: true },
        { t: R`$e^{2}$`, why: R`The sum starts at $n=1$, so it is missing the $n=0$ term $\frac{2^{0}}{0!}=1$ that $e^{2}$ includes.`, err: 'index' },
        { t: R`$e^{2}+1$`, why: R`Right idea, wrong sign. The sum is the full series MINUS the skipped term: $e^{2}-1$, not plus.`, err: 'sign' },
        { t: R`$2(e-1)$`, why: R`You pulled the $2^{n}$ out as a constant $2$. It is raised to the $n$, so it is $x=2$ inside $e^{x}$.`, err: 'formula-confusion' },
      ],
      hints: [R`Which $e^{x}$ term does this sum skip?`, R`The $n=0$ term of $\sum\frac{2^{n}}{n!}$ is $1$.`, R`$e^{2}=1+\sum_{n=1}^{\infty}\frac{2^{n}}{n!}$.`],
      steps: [R`Plain $n!$ and $2^{n}$ on top: $e^{x}$ with $x=2$.`, R`$e^{2}=\sum_{n=0}^{\infty}\frac{2^{n}}{n!}=1+\sum_{n=1}^{\infty}\frac{2^{n}}{n!}$, since the $n=0$ term is $\frac{1}{1}=1$.`, R`So the sum is $e^{2}-1$.`],
      recall: R`Sum starts late? Function value minus the skipped terms.`,
    },
    {
      id: 'lp-serapp-05', unit: 'series', topic: AP, stage: 'core', diff: 2, arch: 'sum-arctan-recognise', fmt: 'free',
      prompt: R`Compute $1-\dfrac13+\dfrac15-\dfrac17+\dfrac19-\cdots=\displaystyle\sum_{n=0}^{\infty}\frac{(-1)^{n}}{2n+1}$.`,
      choices: [
        { t: R`$\dfrac{\pi}{4}$`, ok: true },
        { t: R`$\ln 2$`, why: R`$\ln2$ is $1-\frac12+\frac13-\cdots$ with every $n$ on the bottom. Here only odd numbers $2n+1$ appear, so it is $\tan^{-1}$.`, err: 'formula-confusion' },
        { t: R`$\dfrac{\pi}{2}$`, why: R`You need $\tan^{-1}(1)$, the angle whose tangent is $1$. That is $\frac{\pi}{4}$; $\tan\frac{\pi}{2}$ is undefined.`, err: 'algebra-slip' },
        { t: R`$\dfrac{\pi}{6}$`, why: R`$\frac{\pi}{6}=\tan^{-1}\frac{1}{\sqrt3}$. Every power $x^{2n+1}$ here equals $1$, so $x=1$, and $\tan^{-1}1=\frac{\pi}{4}$.`, err: 'setup' },
      ],
      hints: [R`No factorial, odd numbers on the bottom, alternating signs.`, R`$\tan^{-1}x=\sum\frac{(-1)^{n}x^{2n+1}}{2n+1}$. Which $x$ makes every $x^{2n+1}=1$?`],
      steps: [R`Odd $2n+1$ on the bottom, no factorial, $(-1)^{n}$: the $\tan^{-1}x$ row.`, R`The top is $1=1^{2n+1}$, so $x=1$, which is inside $[-1,1]$.`, R`Sum $=\tan^{-1}1=\frac{\pi}{4}$.`],
      recall: R`$2n+1$ on the bottom with no factorial is $\tan^{-1}x$.`,
    },
    {
      id: 'lp-serapp-06', unit: 'series', topic: AP, stage: 'core', diff: 3, arch: 'select-true-sums', fmt: 'multi',
      prompt: R`Select ALL true statements.`,
      choices: [
        { t: R`$\displaystyle\sum_{n=0}^{\infty}\frac{(-1)^{n}}{(2n+1)!}=\sin 1$`, ok: true, why: R`Odd factorial with $(-1)^{n}$ is $\sin x$, and the top is $1^{2n+1}$, so $x=1$.` },
        { t: R`$\displaystyle\sum_{n=0}^{\infty}\frac{1}{n!\,2^{n}}=\sqrt e$`, ok: true, why: R`$\frac{1}{2^{n}}=\left(\frac12\right)^{n}$, so this is $e^{x}$ at $x=\frac12$: $e^{1/2}=\sqrt e$.` },
        { t: R`$\displaystyle\sum_{n=1}^{\infty}\frac{(-1)^{n+1}}{n}=\ln 2$`, ok: true, why: R`This is $\ln(1+x)$ at $x=1$ (inside $(-1,1]$), so it is $\ln 2$.` },
        { t: R`$\displaystyle\sum_{n=0}^{\infty}\frac{(-1)^{n}}{(2n)!}=\sin 1$`, why: R`$(2n)!$ with even powers is $\cos x$, so this equals $\cos 1$, not $\sin 1$. Mixed up the two factorials.`, err: 'formula-confusion' },
        { t: R`$\displaystyle\sum_{n=0}^{\infty}\frac{4^{n}}{n!}=4e$`, why: R`The $4$ is raised to the $n$, so $x=4$ and the sum is $e^{4}$. It is not a constant multiplier.`, err: 'formula-confusion' },
      ],
      hints: [R`For each one: name the row from the bottom, then read $x$.`, R`$(2n)!$ is $\cos$; $(2n+1)!$ is $\sin$.`],
      steps: [R`$\sin1$: odd factorial, $x=1$. True.`, R`$\sqrt e$: $e^{x}$ at $x=\frac12$. True.`, R`$\ln2$: $\ln(1+x)$ at $x=1$. True.`, R`$(2n)!$ gives $\cos1$, and $\sum\frac{4^{n}}{n!}=e^{4}$. Both false.`],
      recall: R`Bottom picks the function, the $n$th power picks $x$.`,
    },
    {
      id: 'lp-serapp-07', unit: 'series', topic: AP, stage: 'core', diff: 3, arch: 'cos-shift-error', fmt: 'error',
      prompt: R`A student computes $S=\displaystyle\sum_{n=1}^{\infty}\frac{(-1)^{n}\pi^{2n}}{2^{2n}(2n)!}$. Which line has the first error?`,
      work: [
        R`Line 1: $(2n)!$ with an even power and $(-1)^{n}$ means $\cos x=\sum_{n=0}^{\infty}\frac{(-1)^{n}x^{2n}}{(2n)!}$.`,
        R`Line 2: $\frac{\pi^{2n}}{2^{2n}}=\left(\frac{\pi}{2}\right)^{2n}$, so $x=\frac{\pi}{2}$.`,
        R`Line 3: So $S=\cos\frac{\pi}{2}=0$.`,
      ],
      choices: [
        { t: 'Line 1', why: R`Line 1 is right: $(2n)!$, even power $x^{2n}$ and alternating signs is exactly the $\cos x$ row.`, err: 'concept' },
        { t: 'Line 2', why: R`Line 2 is right: $\pi^{2n}/2^{2n}=(\pi/2)^{2n}$ because both are raised to the same power $2n$.`, err: 'algebra-slip' },
        { t: 'Line 3', ok: true },
        { t: 'No error', why: R`$S$ starts at $n=1$, but $\cos x$ starts at $n=0$ with the term $1$. The answer $0$ ignores that skipped term.`, err: 'index' },
      ],
      keyWhy: R`$\cos\frac{\pi}{2}=1+S$, so $S=-1$, not $0$.`,
      hints: [R`Compare the starting index of $S$ with the $\cos$ series.`, R`What is the $n=0$ term of $\cos x$?`],
      steps: [R`Lines 1 and 2 correctly identify $\cos x$ at $x=\frac{\pi}{2}$.`, R`But $\cos x=1+\sum_{n=1}^{\infty}\frac{(-1)^{n}x^{2n}}{(2n)!}$, so $\cos\frac{\pi}{2}=1+S$.`, R`$0=1+S$ gives $S=-1$. Line 3 is wrong.`],
      recall: R`Always compare starting indexes before writing the answer.`,
    },
    {
      id: 'lp-serapp-08', unit: 'series', topic: TM, stage: 'core', diff: 3, arch: 'multiply-by-power',
      prompt: R`Find the Taylor series of $x^{10}\sin x$ centred at $x=0$.`,
      choices: [
        { t: R`$\displaystyle\sum_{n=0}^{\infty}\frac{(-1)^{n}x^{2n+11}}{(2n+1)!}$`, ok: true },
        { t: R`$\displaystyle\sum_{n=0}^{\infty}\frac{(-1)^{n}x^{20n+10}}{(2n+1)!}$`, why: R`You multiplied the exponents. $x^{10}\cdot x^{2n+1}=x^{10+2n+1}=x^{2n+11}$: exponents add when you multiply.`, err: 'algebra-slip' },
        { t: R`$\displaystyle\sum_{n=0}^{\infty}\frac{(-1)^{n}x^{2n+11}}{(2n+11)!}$`, why: R`Multiplying by $x^{10}$ changes only the power. The factorial comes from $\sin x$ and stays $(2n+1)!$.`, err: 'factorial' },
        { t: R`$\displaystyle\sum_{n=0}^{\infty}\frac{x^{2n+11}}{(2n+1)!}$`, why: R`The $(-1)^{n}$ from the $\sin x$ series was dropped. The signs must still alternate.`, err: 'sign' },
      ],
      hints: [R`Start from $\sin x=\sum\frac{(-1)^{n}x^{2n+1}}{(2n+1)!}$.`, R`Multiply every term by $x^{10}$. What happens to the exponent?`],
      steps: [R`$\sin x=\sum_{n=0}^{\infty}\frac{(-1)^{n}x^{2n+1}}{(2n+1)!}$ for all $x$.`, R`Multiply each term by $x^{10}$: $x^{10}\cdot x^{2n+1}=x^{2n+11}$.`, R`Factorial and sign unchanged: $\sum\frac{(-1)^{n}x^{2n+11}}{(2n+1)!}$, valid on $(-\infty,\infty)$.`],
      recall: R`Multiplying by $x^{k}$ adds $k$ to every exponent. Nothing else changes.`,
    },
    {
      id: 'lp-serapp-09', unit: 'series', topic: TM, stage: 'core', diff: 3, arch: 'differentiate-geometric',
      prompt: R`Differentiate $\dfrac{1}{1-x}=\displaystyle\sum_{n=0}^{\infty}x^{n}$ to find a series for $\dfrac{1}{(1-x)^{2}}$.`,
      choices: [
        { t: R`$\displaystyle\sum_{n=1}^{\infty}nx^{n-1}$`, ok: true },
        { t: R`$\displaystyle\sum_{n=0}^{\infty}nx^{n+1}$`, why: R`Power rule lowers the exponent by one: $\frac{d}{dx}x^{n}=nx^{n-1}$, not $nx^{n+1}$.`, err: 'algebra-slip' },
        { t: R`$\displaystyle\sum_{n=0}^{\infty}x^{2n}$`, why: R`You squared each term. Squaring a sum is not squaring each term; and the question says differentiate.`, err: 'concept' },
        { t: R`$\displaystyle\sum_{n=1}^{\infty}(-1)^{n}nx^{n-1}$`, why: R`$\frac{d}{dx}(1-x)^{-1}=-(1-x)^{-2}\cdot(-1)=+\frac{1}{(1-x)^{2}}$. The two minus signs cancel; no alternating factor.`, err: 'sign' },
      ],
      hints: [R`Differentiate both sides.`, R`$\frac{d}{dx}x^{n}=nx^{n-1}$. The $n=0$ term becomes $0$.`],
      steps: [R`Left: $\frac{d}{dx}(1-x)^{-1}=(1-x)^{-2}$ (chain rule gives two minus signs that cancel).`, R`Right: each $x^{n}$ becomes $nx^{n-1}$; the $n=0$ term is $0$ so start at $n=1$.`, R`$\frac{1}{(1-x)^{2}}=\sum_{n=1}^{\infty}nx^{n-1}$ on $(-1,1)$.`],
      recall: R`$\frac{1}{(1-x)^{2}}=\sum nx^{n-1}$: the derivative of the geometric series.`,
    },
    {
      id: 'lp-serapp-10', unit: 'series', topic: AP, stage: 'core', diff: 3, arch: 'limit-by-series', fmt: 'free',
      prompt: R`Use a Maclaurin series to evaluate $\displaystyle\lim_{x\to0}\frac{e^{x}-1-x}{x^{2}}$.`,
      choices: [
        { t: R`$\dfrac{1}{2}$`, ok: true },
        { t: R`$1$`, why: R`You dropped the $2!$. The $x^{2}$ term of $e^{x}$ is $\frac{x^{2}}{2!}=\frac{x^{2}}{2}$, not $x^{2}$.`, err: 'factorial' },
        { t: R`$0$`, why: R`The $1$ and $x$ cancel, but the $\frac{x^{2}}{2}$ term survives and the bottom is also $x^{2}$.`, err: 'concept' },
        { t: R`$-\dfrac{1}{2}$`, why: R`Sign slip: $e^{x}-1-x=+\frac{x^{2}}{2}+\cdots$. All terms of $e^{x}$ are positive.`, err: 'sign' },
      ],
      hints: [R`$e^{x}=1+x+\frac{x^{2}}{2}+\frac{x^{3}}{6}+\cdots$`, R`Subtract $1+x$, then divide by $x^{2}$.`],
      steps: [R`$e^{x}-1-x=\frac{x^{2}}{2}+\frac{x^{3}}{6}+\cdots$`, R`Divide by $x^{2}$: $\frac12+\frac{x}{6}+\cdots$`, R`As $x\to0$ only the constant survives: $\frac12$.`],
      recall: R`Expand, cancel, divide by the bottom power, keep the constant.`,
    },
    {
      id: 'lp-serapp-11', unit: 'series', topic: TM, stage: 'exam', diff: 4, arch: 'recentre-geometric',
      prompt: R`Showing all your work, find the Taylor series for $f(x)=\dfrac{1}{x}$ centred at $x=-3$ and its interval of convergence.`,
      choices: [
        { t: R`$\displaystyle\sum_{n=0}^{\infty}\frac{-(x+3)^{n}}{3^{n+1}}$ on $(-6,0)$`, ok: true },
        { t: R`$\displaystyle\sum_{n=0}^{\infty}\frac{(x+3)^{n}}{3^{n+1}}$ on $(-6,0)$`, why: R`Lost the minus: $\frac{1}{-3+(x+3)}=-\frac13\cdot\frac{1}{1-\frac{x+3}{3}}$. Check: $f(-3)=-\frac13$, so the first term is negative.`, err: 'sign' },
        { t: R`$\displaystyle\sum_{n=0}^{\infty}\frac{-(x-3)^{n}}{3^{n+1}}$ on $(0,6)$`, why: R`Centre $-3$ means powers of $x-(-3)=x+3$. Using $x-3$ expands about $+3$ instead.`, err: 'setup' },
        { t: R`$\displaystyle\sum_{n=0}^{\infty}\frac{-(x+3)^{n}}{3^{n}}$ on $(-6,0)$`, why: R`Dropped the factor $\frac13$ pulled out front. That makes the first term $-1$, but $f(-3)=-\frac13$.`, err: 'algebra-slip' },
      ],
      hints: [R`Write $x=-3+(x+3)$.`, R`Factor out $-3$ to get the form $\frac{a}{1-r}$.`, R`$\frac{1}{x}=-\frac13\cdot\frac{1}{1-\frac{x+3}{3}}$.`],
      steps: [R`$\frac1x=\frac{1}{-3+(x+3)}=\frac{1}{-3\left(1-\frac{x+3}{3}\right)}=-\frac13\cdot\frac{1}{1-\frac{x+3}{3}}$.`, R`Geometric with $r=\frac{x+3}{3}$: $-\frac13\sum_{n=0}^{\infty}\left(\frac{x+3}{3}\right)^{n}=\sum_{n=0}^{\infty}\frac{-(x+3)^{n}}{3^{n+1}}$.`, R`Converges when $\left|\frac{x+3}{3}\right|<1$: $|x+3|<3$, so $-6<x<0$.`, R`Geometric series diverge at both endpoints ($|r|=1$), so the interval is $(-6,0)$. This matches the lecture's derivative method.`],
      recall: R`Re-centre: write $x=c+(x-c)$ and force the shape $\frac{a}{1-r}$.`,
    },
    {
      id: 'lp-serapp-12', unit: 'series', topic: AP, stage: 'exam', diff: 4, arch: 'sum-with-n-on-top', fmt: 'free',
      prompt: R`Compute the following sum: $\displaystyle\sum_{n=1}^{\infty}\frac{n}{3^{n}}$.`,
      choices: [
        { t: R`$\dfrac{3}{4}$`, ok: true },
        { t: R`$\dfrac{9}{4}$`, why: R`That is $\sum n\left(\frac13\right)^{n-1}=\frac{1}{(2/3)^{2}}$. You forgot to multiply by $x=\frac13$ to turn $x^{n-1}$ into $x^{n}$.`, err: 'index' },
        { t: R`$\dfrac{3}{2}$`, why: R`That is the plain geometric sum $\frac{1}{1-1/3}$. The extra $n$ on top needs the differentiated series.`, err: 'formula-confusion' },
        { t: R`$\dfrac{1}{2}$`, why: R`That is $\sum_{n\ge1}\left(\frac13\right)^{n}$, ignoring the $n$ on top. Differentiate the geometric series first.`, err: 'formula-confusion' },
      ],
      hints: [R`An $n$ on top: start from $\frac{1}{(1-x)^{2}}=\sum nx^{n-1}$.`, R`Multiply by $x$ to get $\sum nx^{n}$.`, R`Plug in $x=\frac13$ into $\frac{x}{(1-x)^{2}}$.`],
      steps: [R`$\frac{1}{(1-x)^{2}}=\sum_{n=1}^{\infty}nx^{n-1}$ for $|x|<1$ (differentiate the geometric series).`, R`Multiply by $x$: $\frac{x}{(1-x)^{2}}=\sum_{n=1}^{\infty}nx^{n}$.`, R`$\frac{n}{3^{n}}=n\left(\frac13\right)^{n}$, so $x=\frac13$, inside $(-1,1)$.`, R`$\frac{1/3}{(2/3)^{2}}=\frac{1/3}{4/9}=\frac{9}{12}=\frac34$.`],
      recall: R`$\sum nx^{n}=\frac{x}{(1-x)^{2}}$ for $|x|<1$.`,
    },
    {
      id: 'lp-serapp-13', unit: 'series', topic: AP, stage: 'exam', diff: 5, arch: 'integral-approx-error',
      prompt: R`Showing all your work, use the first three nonzero terms of a Maclaurin series to approximate $\displaystyle\int_{0}^{1}e^{-x^{2}}\,dx$. Give the approximation and the alternating series error bound.`,
      choices: [
        { t: R`$\dfrac{23}{30}$, error $\le\dfrac{1}{42}$`, ok: true },
        { t: R`$\dfrac{23}{30}$, error $\le\dfrac{1}{10}$`, why: R`$\frac1{10}$ is the last term you KEPT. The error bound is the first term you LEFT OUT, $\frac{1}{42}$.`, err: 'concept' },
        { t: R`$\dfrac{13}{15}$, error $\le\dfrac{1}{42}$`, why: R`$1-\frac13+\frac15$ loses the $2!$: the term is $\frac{x^{4}}{2}$, which integrates to $\frac{1}{10}$, not $\frac15$.`, err: 'factorial' },
        { t: R`$\dfrac{43}{30}$, error $\le\dfrac{1}{42}$`, why: R`$1+\frac13+\frac1{10}$ drops the minus signs. $e^{-x^{2}}$ has $(-1)^{n}$, so the terms alternate.`, err: 'sign' },
      ],
      hints: [R`$e^{-x^{2}}=1-x^{2}+\frac{x^{4}}{2}-\frac{x^{6}}{6}+\cdots$`, R`Integrate each term from $0$ to $1$.`, R`Error $\le$ the fourth term, the first one left out.`],
      steps: [R`$e^{u}=\sum\frac{u^{n}}{n!}$ with $u=-x^{2}$: $e^{-x^{2}}=1-x^{2}+\frac{x^{4}}{2}-\frac{x^{6}}{6}+\cdots$.`, R`Integrate on $[0,1]$: $1-\frac13+\frac1{10}-\frac1{42}+\cdots$.`, R`First three: $1-\frac13+\frac1{10}=\frac{30-10+3}{30}=\frac{23}{30}\approx0.7667$.`, R`Alternating, terms shrinking to $0$: error $\le\frac1{42}\approx0.0238$. (True value $\approx0.7468$.)`],
      recall: R`Series integral: substitute, integrate term by term, error $\le$ first left-out term.`,
    },
  ],
};
