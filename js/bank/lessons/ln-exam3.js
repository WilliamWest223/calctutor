// js/bank/lessons/ln-exam3.js — Exam 3 review (run fin). Keys verified with sympy.
const R = String.raw;
const TM = 'Taylor & Maclaurin Series', PS = 'Power Series & Radius', TP = 'Taylor Polynomials & Error',
  AP = 'Applications of Series', RR = 'Ratio & Root Tests';

export default {
  id: 'ln-exam3',
  goal: 'Walk into Exam 3 knowing which of five question types you are looking at and the exact steps for each one.',
  why: 'Exam 3 is 10% of your grade and is entirely power and Taylor series. The same five question types come back every time, and the 18-point table is pure memory.',
  plain: R`Exam 3 is not a pile of random problems. It is the same five or six question types, every time. Think of it like a driving test: you know there will be a parallel park, a three-point turn, and a stop sign. You practise each move until it is automatic.

The moves on this exam are: fill in a table of six famous series from memory, build a new series (by plugging into a known one or by taking derivatives), find for which $x$ a series works, add up an infinite sum by spotting which famous series it is, and measure how wrong a short Taylor polynomial can be.

Every one of these uses the same small toolbox. A power series is an "infinite polynomial" in $x$. The famous six are the ones you memorise. The Ratio Test tells you where a series works. The remainder formula tells you how big your error is.

So tonight you do not need new ideas. You need to recognise each question type in one look and run its recipe. This page gives you one short recap per type, then a map of which tool to grab when.`,
  prereq: [
    { term: 'power series', means: R`An infinite polynomial $\sum c_n (x-c)^n$: numbers $c_n$ (the coefficients) times powers of $(x-c)$, where $c$ is the centre.` },
    { term: 'converge', means: 'An infinite sum converges when its partial sums settle down to one finite number.' },
    { term: 'factorial', means: R`$n! = 1\cdot2\cdot3\cdots n$, and $0!=1$. Example: $4!=24$.` },
    { term: 'Ratio Test', means: R`Take $L=\lim\left|\frac{a_{n+1}}{a_n}\right|$. If $L<1$ the series converges, if $L>1$ it diverges, if $L=1$ the test says nothing.` },
    { term: 'p-series and harmonic series', means: R`$\sum\frac{1}{n^p}$ converges when $p>1$. The harmonic series $\sum\frac1n$ ($p=1$) diverges.` },
    { term: 'Alternating Series Test', means: R`A series with signs $+,-,+,-$ converges if its sizes shrink to $0$ and keep decreasing.` },
  ],
  sections: [
    {
      h: 'How the paper is built',
      body: R`His Exam 3 has a fixed shape. A **Maclaurin series** is a Taylor series centred at $c=0$ (a power series in plain powers of $x$). **Q1** is the table of six Maclaurin series: for each function you write the first terms, the sigma form, and the interval of convergence (18 points, pure recall). **Q2** asks for a Taylor series "from scratch" at some centre $c$, using derivatives. **Q3 and Q5** ask for a centre, radius and interval of convergence. **Q4** asks for a Maclaurin series of a new function made by substitution, like $x\cos(x^{3})$. **Q6** asks for a Taylor polynomial $T_n(x)$ and the largest possible error, and sometimes an exact sum like $\sum\frac{3^n}{n!}$.

A **Maclaurin series** is just a Taylor series with centre $c=0$. So every question on the paper is about one object: a power series. The skill is reading which part of that object they are asking for.`,
      check: { q: 'Which question number is worth the most and needs no computation at all?', a: 'Q1, the 18-point table of six Maclaurin series. It is pure memory.' },
    },
    {
      h: 'The six-series table (your free points)',
      body: R`Memorise these six rows, all three columns. $\dfrac{1}{1-x}=\sum_{n=0}^{\infty}x^{n}$ on $(-1,1)$. $e^{x}=\sum_{n=0}^{\infty}\dfrac{x^{n}}{n!}$ on $(-\infty,\infty)$. $\sin x=\sum_{n=0}^{\infty}\dfrac{(-1)^{n}x^{2n+1}}{(2n+1)!}$ on $(-\infty,\infty)$. $\cos x=\sum_{n=0}^{\infty}\dfrac{(-1)^{n}x^{2n}}{(2n)!}$ on $(-\infty,\infty)$. $\ln(1+x)=\sum_{n=1}^{\infty}\dfrac{(-1)^{n+1}x^{n}}{n}$ on $(-1,1]$. $\arctan x=\sum_{n=0}^{\infty}\dfrac{(-1)^{n}x^{2n+1}}{2n+1}$ on $[-1,1]$.

Why the three different endpoint patterns? At $x=1$, $\frac{1}{1-x}$ gives $1+1+1+\cdots$, which blows up. $\ln(1+x)$ at $x=1$ is the alternating harmonic series (converges), but at $x=-1$ it is minus the harmonic series (diverges). $\arctan x$ alternates at both ends with shrinking terms, so both ends converge. Sine has odd powers and $(2n+1)!$; cosine has even powers and $(2n)!$. Read the factorial, not only the power. Write all six rows from memory in under two minutes, every day until the exam.`,
      check: { q: R`Which famous series converges at $x=1$ but not at $x=-1$?`, a: R`$\ln(1+x)$, interval $(-1,1]$.` },
    },
    {
      h: 'Interval of convergence: Ratio Test, then endpoints',
      body: R`The question "for which $x$ does this series converge?" always has the same two-part answer. First, the **Ratio Test** gives an inequality like $|x-c|<R$. The number $R$ is the **radius**: how far from the centre $c$ you can go. That gives the open interval $(c-R,\,c+R)$.

Second, at the two **endpoints** $x=c-R$ and $x=c+R$ the Ratio Test gives $L=1$, so it says nothing. You must plug each endpoint into the series and test the plain number series you get (p-series, harmonic, Alternating Series Test). Each endpoint gets a bracket $[\;]$ if it converges, a parenthesis $(\;)$ if not.

Two special cases. If the limit is $0$ for every $x$ (factorials in the bottom), $R=\infty$ and the interval is $(-\infty,\infty)$. If the limit is $\infty$ for every $x$ except the centre (factorials on top, like $n!\,x^n$), then $R=0$ and the series converges only at $x=c$. Watch the centre: $(x+1)^n$ has centre $-1$, and $(5x+2)^n$ has centre $-\frac25$.`,
      check: { q: R`The Ratio Test gives $|x-3|<2$. What is the open interval, and what must you still do?`, a: R`$(1,5)$. You still test $x=1$ and $x=5$ separately in the original series.` },
    },
    {
      h: 'Building new series: substitute or differentiate',
      body: R`Two ways to get a series for a new function. **Way 1, substitution** (fast, use it when the function is a famous one with something plugged in). Write the famous series with a placeholder $u$, replace $u$ by the inside expression, then multiply by any outside factor. Example: $e^{u}=\sum\frac{u^n}{n!}$, so $e^{-x^{3}}=\sum\frac{(-1)^{n}x^{3n}}{n!}$, and $x^{2}e^{-x^{3}}=\sum\frac{(-1)^{n}x^{3n+2}}{n!}$. The interval changes too: $\ln(1+u)$ works for $-1<u\le1$, so $\ln(1+2x)$ works for $-\frac12<x\le\frac12$.

**Way 2, from scratch** (use it when the exam says "from the definition" or the centre is not $0$). The Taylor series at centre $c$ is $\sum\dfrac{f^{(n)}(c)}{n!}(x-c)^{n}$. Compute $f, f', f'', f'''$, plug in $c$ to get plain numbers, spot the pattern for $f^{(n)}(c)$, then divide by $n!$. Why this works: the $n$-th derivative of $(x-c)^n$ is $n!$, so dividing by $n!$ makes the polynomial match every derivative of $f$ at $c$.`,
      check: { q: R`Maclaurin series of $\dfrac{1}{1+x^{2}}$?`, a: R`Put $u=-x^{2}$ in $\sum u^n$: $\sum_{n=0}^{\infty}(-1)^{n}x^{2n}$, valid for $|x|<1$.` },
    },
    {
      h: 'Exact sums by recognition',
      body: R`Some questions hand you a number series like $\sum_{n=0}^{\infty}\frac{3^{n}}{n!}$ and ask for its exact value. You do not add anything. You match it to a row of the table and read off which $x$ was plugged in. Here $\frac{x^n}{n!}$ with $x=3$ is $e^{x}$, so the sum is $e^{3}$.

Look at three things: the factorial (none, $n!$, $(2n)!$, $(2n+1)!$), the power ($n$, $2n$, $2n+1$), and whether the sign alternates. Then look at the **starting index**. If the sum starts at $n=2$ but the table row starts at $n=0$, the first two terms are missing, so subtract them: $\sum_{n=2}^{\infty}\frac{3^n}{n!}=e^{3}-1-3=e^{3}-4$.`,
      check: { q: R`$\displaystyle\sum_{n=0}^{\infty}\frac{(-1)^{n}\pi^{2n+1}}{(2n+1)!}=\,?$`, a: R`Odd power, $(2n+1)!$, alternating: that is $\sin x$ at $x=\pi$, so the sum is $\sin\pi=0$.` },
    },
    {
      h: 'Taylor polynomial and the largest possible error',
      body: R`A **Taylor polynomial** $T_n(x)$ is the series cut off after the $(x-c)^{n}$ term. You use it to estimate a value, like $\sqrt[3]{8.1}$ with $T_2$ centred at $8$. The **remainder** $R_n(x)=f(x)-T_n(x)$ is the error you make.

The Taylor Remainder Theorem says $|R_n(x)|=\left|\dfrac{f^{(n+1)}(\xi)}{(n+1)!}(x-c)^{n+1}\right|$ for some number $\xi$ between $c$ and $x$. You never learn $\xi$ exactly, so you bound it: $|R_n(x)|\le\dfrac{M}{(n+1)!}|x-c|^{n+1}$, where $M$ is the biggest $|f^{(n+1)}|$ can be anywhere between $c$ and $x$ (or on the whole interval they give).

In words: one derivative past the polynomial, its worst case $M$, divided by $(n+1)!$, times the farthest distance from the centre to that power. Do **not** plug the centre into $f^{(n+1)}$ unless the centre is where $|f^{(n+1)}|$ is biggest.`,
      check: { q: R`For $T_3$, which derivative and which factorial go in the error bound?`, a: R`The 4th derivative $f^{(4)}$ and $4!=24$.` },
    },
    {
      h: 'Which tool when: the decision map',
      body: R`Read the question's last words and match. **"Interval / radius of convergence" or "for which $x$"**: Ratio Test, then plug in both endpoints. **"Find the Maclaurin series of" a famous function with something inside or a factor outside**: substitute into the table, multiply, adjust the interval. **"From the definition" or a centre $c\ne0$**: derivatives at $c$, pattern, divide by $n!$. **"Find the exact value of" an infinite sum**: match a table row, watch the starting index. **"Largest possible error" or "how accurate"**: remainder bound with $f^{(n+1)}$ and $(n+1)!$.

Time plan for the exam: write the whole table first (two minutes, banks 18 points and gives you a reference sheet for the rest). Then do the endpoint-heavy interval questions while you are fresh, because endpoints are where points leak.`,
      check: { q: R`"Using $T_2$ on $(-1,1)$, what is the largest possible error?" Which tool?`, a: R`The Taylor remainder bound: $f'''$, its max $M$ on $(-1,1)$, divided by $3!$, times $1^{3}$.` },
    },
  ],
  recipe: [
    'Write the six-series table (first terms, sigma form, interval) at the top of the exam before anything else.',
    'Read the last words of each question and pick the tool from the decision map.',
    'Interval questions: Ratio Test -> |x - c| < R -> open interval -> test BOTH endpoints in the original series -> brackets.',
    'New series: substitute into the table if you can (then multiply, fix the interval); otherwise derivatives at c, pattern, divide by n!.',
    'Exact sums: match factorial, power and sign to a table row, read off x, subtract any terms skipped by the starting index.',
    'Error bounds: f^(n+1), its largest size M on the interval, divide by (n+1)!, times the largest |x - c|^(n+1).',
  ],
  worked: [
    {
      q: R`Compute $\displaystyle\sum_{n=0}^{\infty}\frac{(-1)^{n}\pi^{2n}}{(2n)!}$.`,
      steps: [
        R`Read the pieces: even power $2n$, factorial $(2n)!$, alternating sign $(-1)^n$. Those three together are the cosine row.`,
        R`Write the row: $\cos x=\sum_{n=0}^{\infty}\dfrac{(-1)^{n}x^{2n}}{(2n)!}$, starting at $n=0$ like our sum, so nothing is missing.`,
        R`Match $x^{2n}$ with $\pi^{2n}$: the plugged-in value is $x=\pi$.`,
        R`So the sum equals $\cos\pi=-1$.`,
      ],
      note: R`Not $e^{\pi}$ (that has $n!$ and no sign) and not $\sin\pi$ (that has $2n+1$ and $(2n+1)!$).`,
    },
    {
      q: R`Find the interval of convergence of $\displaystyle\sum_{n=1}^{\infty}\frac{(x-2)^{n}}{n\,4^{n}}$.`,
      steps: [
        R`Ratio Test: $\left|\dfrac{a_{n+1}}{a_n}\right|=\dfrac{|x-2|^{n+1}}{(n+1)4^{n+1}}\cdot\dfrac{n\,4^{n}}{|x-2|^{n}}=\dfrac{n}{n+1}\cdot\dfrac{|x-2|}{4}$. We flip and multiply because dividing by a fraction is multiplying by its flip.`,
        R`As $n\to\infty$, $\frac{n}{n+1}\to1$, so $L=\frac{|x-2|}{4}$. Need $L<1$: $|x-2|<4$, so centre $2$, radius $4$, open interval $(-2,6)$.`,
        R`Endpoint $x=6$: $(x-2)^n=4^n$ cancels, leaving $\sum\frac1n$, the harmonic series, which diverges. Use a parenthesis at $6$.`,
        R`Endpoint $x=-2$: $(x-2)^n=(-4)^n$, leaving $\sum\frac{(-1)^n}{n}$. Sizes $\frac1n$ shrink to $0$ and decrease, so it converges by the Alternating Series Test. Use a bracket at $-2$.`,
        R`Interval of convergence: $[-2,\,6)$.`,
      ],
      note: 'The Ratio Test always says nothing at the endpoints. Plugging them in is where the points are.',
    },
    {
      q: R`Find the Maclaurin series for $x\cos(x^{3})$ and its interval of convergence.`,
      steps: [
        R`This is a famous function (cosine) with something inside, so substitute. Write the row with a placeholder: $\cos u=\sum_{n=0}^{\infty}\dfrac{(-1)^{n}u^{2n}}{(2n)!}$.`,
        R`Replace $u$ by $x^{3}$: $(x^{3})^{2n}=x^{6n}$ because powers of powers multiply. So $\cos(x^{3})=\sum\dfrac{(-1)^{n}x^{6n}}{(2n)!}$.`,
        R`Multiply by the outside $x$: add $1$ to every exponent, giving $\displaystyle x\cos(x^{3})=\sum_{n=0}^{\infty}\frac{(-1)^{n}x^{6n+1}}{(2n)!}$.`,
        R`Interval: $\cos u$ works for every $u$, so this works for every $x$: $(-\infty,\infty)$.`,
      ],
      note: 'Substitute first, multiply second. Check by writing the first two terms: x - x^7/2.',
    },
    {
      q: R`Let $f(x)=\sqrt[3]{x}$. (a) Find $T_2(x)$ centred at $x=8$. (b) Use it to approximate $\sqrt[3]{8.1}$. (c) Showing all your work, find the largest possible error of this approximation.`,
      steps: [
        R`Derivatives as numbers at $8$: $f=x^{1/3}$ gives $2$; $f'=\frac13x^{-2/3}$ gives $\frac{1}{12}$; $f''=-\frac29x^{-5/3}$ gives $-\frac{1}{144}$. (Use $8^{1/3}=2$, so $8^{-2/3}=\frac14$ and $8^{-5/3}=\frac{1}{32}$.)`,
        R`Build $T_2$: $T_2(x)=2+\frac{1}{12}(x-8)-\frac{1}{144\cdot2!}(x-8)^{2}=2+\frac{1}{12}(x-8)-\frac{1}{288}(x-8)^{2}$.`,
        R`Plug in $x=8.1$, so $x-8=\frac{1}{10}$: $T_2(8.1)=2+\frac{1}{120}-\frac{1}{28800}=\frac{57839}{28800}\approx2.0083$.`,
        R`Error uses one more derivative: $f'''(x)=\frac{10}{27}x^{-8/3}$, so $|R_2|=\dfrac{\frac{10}{27}\xi^{-8/3}}{3!}\left(\frac{1}{10}\right)^{3}$ for some $\xi$ between $8$ and $8.1$.`,
        R`$\xi^{-8/3}=\frac{1}{\xi^{8/3}}$ is biggest when $\xi$ is smallest, $\xi=8$: $8^{-8/3}=\frac{1}{256}$. So $M=\frac{10}{27}\cdot\frac{1}{256}$.`,
        R`Bound: $|R_2|\le\dfrac{10}{27}\cdot\dfrac{1}{256}\cdot\dfrac{1}{6}\cdot\dfrac{1}{1000}=\dfrac{1}{4147200}\approx2.41\times10^{-7}$. (The true error is about $2.39\times10^{-7}$, just under the bound.)`,
      ],
      note: 'His 11-10 lecture example. Here the worst case sits at the centre only because x^(-8/3) shrinks as x grows; always check which end is worst.',
    },
  ],
  exam: [
    'Q1: Fill in the table of six Maclaurin series with sigma form and interval of convergence (18 pts).',
    'Q2: Find the Taylor series centred at $c$ from scratch.',
    'Q3/Q5: Find the interval of convergence. Check endpoints.',
    R`Q4: Find the Maclaurin series of a substituted function (e.g. $x\cos(x^{3})$).`,
    R`Q6: Taylor polynomial and largest possible error on an interval; also compute $\sum\frac{3^{n}}{n!}$-type sums.`,
    R`Radius questions with factorials on top, like $\sum n!(5x+2)^n$ (radius $0$).`,
  ],
  traps: [
    R`Endpoint intervals: $\frac{1}{1-x}$ is $(-1,1)$, $\ln(1+x)$ is $(-1,1]$, $\arctan x$ is $[-1,1]$. All three differ. Say the reason for each, not just the brackets.`,
    R`Evaluating the remainder derivative at the centre by habit. Find where $|f^{(n+1)}|$ is largest on the interval and use that value as $M$.`,
    'Stopping an interval question at the radius. The radius is half the answer; plug in both endpoints every time.',
    R`Reading the sine/cosine pair by the numerator only: check whether the factorial is $(2n)!$ or $(2n+1)!$.`,
    R`Starting index on sums: if the sum starts at $n=2$, subtract the $n=0$ and $n=1$ terms from the table value.`,
  ],
  practice: [
    {
      id: 'lp-exam3-01', unit: 'series', topic: TM, stage: 'warmup', diff: 1, arch: 'table-ioc-truth', tf: true,
      prompt: R`True or false: the Maclaurin series of $\arctan x$, $\displaystyle\sum_{n=0}^{\infty}\frac{(-1)^{n}x^{2n+1}}{2n+1}$, has interval of convergence $(-1,1)$.`,
      choices: [
        { t: 'True', why: 'Both endpoints were dropped. At x = 1 and x = -1 the series alternates with sizes 1/(2n+1) shrinking to 0, so both converge.', err: 'endpoint' },
        { t: 'False', ok: true },
      ],
      keyWhy: R`The interval is $[-1,1]$: both endpoints converge by the Alternating Series Test.`,
      hints: ['Radius is 1. What happens when you plug in x = 1?', R`At $x=1$: $1-\frac13+\frac15-\cdots$. Does it pass the Alternating Series Test?`],
      steps: [R`Radius $1$, so the open interval is $(-1,1)$.`, R`$x=1$ gives $\sum\frac{(-1)^n}{2n+1}$, alternating with sizes decreasing to $0$: converges. $x=-1$ gives $-\sum\frac{(-1)^n}{2n+1}$: also converges.`, R`So the interval is $[-1,1]$, not $(-1,1)$.`],
      recall: R`$\arctan x$: $[-1,1]$, both ends closed.`,
    },
    {
      id: 'lp-exam3-02', unit: 'series', topic: TM, stage: 'warmup', diff: 2, arch: 'table-recognize-row',
      prompt: R`Which function has the Maclaurin series $\displaystyle\sum_{n=0}^{\infty}\frac{(-1)^{n}x^{2n+1}}{(2n+1)!}$?`,
      choices: [
        { t: R`$\sin x$`, ok: true },
        { t: R`$\cos x$`, why: R`Cosine has even powers $x^{2n}$ and $(2n)!$ in the bottom; this series has odd powers and $(2n+1)!$.`, err: 'formula-confusion' },
        { t: R`$\arctan x$`, why: R`Arctan has the same odd power but a plain $2n+1$ in the bottom, not the factorial $(2n+1)!$.`, err: 'formula-confusion' },
        { t: R`$e^{-x}$`, why: R`$e^{-x}$ has every power $x^n$ over $n!$, not only odd powers over $(2n+1)!$; you matched only the alternating sign.`, err: 'formula-confusion' },
      ],
      hints: ['Look at the power: even or odd?', 'Odd power with a factorial (2n+1)! in the bottom.'],
      steps: [R`Odd powers $x^{2n+1}$ and alternating signs: sine or arctan.`, R`The bottom is the factorial $(2n+1)!$, not plain $2n+1$, so it is $\sin x$.`],
      recall: 'Read the factorial, not only the power: sin has (2n+1)!, arctan has 2n+1.',
    },
    {
      id: 'lp-exam3-03', unit: 'series', topic: RR, stage: 'core', diff: 3, arch: 'radius-factorial-top', fmt: 'free',
      prompt: R`Find the radius of convergence of $\displaystyle\sum_{n=0}^{\infty}n!\,(5x+2)^{n}$.`,
      choices: [
        { t: R`$0$`, ok: true },
        { t: R`$\dfrac{1}{5}$`, why: 'You read the radius off the 5 in 5x+2 as if the Ratio Test limit were finite; but (n+1)|5x+2| goes to infinity for every x except -2/5.', err: 'concept' },
        { t: R`$\infty$`, why: 'Infinite radius happens when the factorial is in the bottom (the ratio goes to 0). Here n! is on top, so the ratio goes to infinity.', err: 'concept' },
        { t: R`$1$`, why: 'You set |5x+2| < 1 and forgot the factor (n+1) left over from (n+1)!/n!, which grows without bound.', err: 'setup' },
      ],
      hints: [R`Simplify $\frac{(n+1)!}{n!}$ in the Ratio Test.`, R`The ratio is $(n+1)|5x+2|$. What does it do as $n\to\infty$ when $5x+2\ne0$?`],
      steps: [
        R`Ratio: $\left|\dfrac{(n+1)!(5x+2)^{n+1}}{n!(5x+2)^{n}}\right|=(n+1)|5x+2|$.`,
        R`If $5x+2\ne0$, this goes to $\infty>1$: diverges.`,
        R`It converges only at the centre $x=-\frac25$, so the radius is $R=0$.`,
      ],
      recall: 'Factorial on top: R = 0. Factorial in the bottom: R = infinity.',
    },
    {
      id: 'lp-exam3-04', unit: 'series', topic: PS, stage: 'core', diff: 3, arch: 'endpoint-select-all', fmt: 'multi',
      prompt: R`For $\displaystyle\sum_{n=1}^{\infty}\frac{x^{n}}{n^{2}\,2^{n}}$, select ALL true statements.`,
      choices: [
        { t: R`The radius of convergence is $2$.`, ok: true, why: R`Ratio Test: $\frac{n^2}{(n+1)^2}\cdot\frac{|x|}{2}\to\frac{|x|}{2}<1$ gives $|x|<2$.` },
        { t: R`The series converges at $x=2$.`, ok: true, why: R`At $x=2$ the $2^n$ cancels, leaving $\sum\frac{1}{n^2}$, a p-series with $p=2>1$.` },
        { t: R`The series converges at $x=-2$.`, ok: true, why: R`At $x=-2$ you get $\sum\frac{(-1)^n}{n^2}$, which converges (absolutely, since $\sum\frac1{n^2}$ does).` },
        { t: R`The interval of convergence is $(-2,2)$.`, why: 'This stops at the radius and never tests the endpoints; both endpoints actually converge, so the interval is [-2, 2].', err: 'endpoint' },
        { t: R`The radius of convergence is $\dfrac12$.`, why: 'You took the limit of the coefficient ratio, 1/2, as the radius; the radius is its flip because |x|/2 < 1 means |x| < 2.', err: 'algebra-slip' },
      ],
      hints: ['Ratio Test first for the radius.', R`Plug $x=2$ and $x=-2$ in; the $2^n$ cancels and leaves a p-series.`],
      steps: [R`Ratio $\to\frac{|x|}{2}$, so $R=2$.`, R`$x=2$: $\sum\frac1{n^2}$ converges ($p=2$).`, R`$x=-2$: $\sum\frac{(-1)^n}{n^2}$ converges absolutely. Interval $[-2,2]$.`],
      recall: 'Radius first, then both endpoints, every time.',
    },
    {
      id: 'lp-exam3-05', unit: 'series', topic: TM, stage: 'core', diff: 3, arch: 'substitution-scaled-interval',
      prompt: R`Which gives the Maclaurin series of $\ln(1+2x)$ together with its interval of convergence?`,
      choices: [
        { t: R`$\displaystyle\sum_{n=1}^{\infty}\frac{(-1)^{n+1}2^{n}x^{n}}{n}$ on $\left(-\tfrac12,\tfrac12\right]$`, ok: true },
        { t: R`$\displaystyle\sum_{n=1}^{\infty}\frac{(-1)^{n+1}2^{n}x^{n}}{n}$ on $(-1,1]$`, why: 'You copied the interval of ln(1+u) without solving -1 < 2x <= 1 for x; the substitution shrinks the interval to (-1/2, 1/2].', err: 'endpoint' },
        { t: R`$\displaystyle\sum_{n=1}^{\infty}\frac{(-1)^{n+1}2x^{n}}{n}$ on $\left(-\tfrac12,\tfrac12\right]$`, why: 'You substituted 2x but only put the 2 on the front; (2x)^n = 2^n x^n, so the 2 must be raised to the n.', err: 'algebra-slip' },
        { t: R`$\displaystyle\sum_{n=1}^{\infty}\frac{(-1)^{n+1}2^{n}x^{n}}{n}$ on $\left[-\tfrac12,\tfrac12\right)$`, why: 'Endpoints reversed: x = 1/2 gives the alternating harmonic series (converges) and x = -1/2 gives minus the harmonic series (diverges).', err: 'endpoint' },
      ],
      hints: [R`Start from $\ln(1+u)=\sum\frac{(-1)^{n+1}u^n}{n}$ on $-1<u\le1$.`, R`Put $u=2x$ in both the series and the inequality.`],
      steps: [R`$\ln(1+u)=\sum_{n=1}^{\infty}\frac{(-1)^{n+1}u^{n}}{n}$ for $-1<u\le1$.`, R`Put $u=2x$: $(2x)^n=2^nx^n$, so the series is $\sum\frac{(-1)^{n+1}2^nx^n}{n}$.`, R`Solve $-1<2x\le1$: $-\frac12<x\le\frac12$.`],
      recall: 'Substitute into the interval too, not just the series.',
    },
    {
      id: 'lp-exam3-06', unit: 'series', topic: TM, stage: 'core', diff: 3, arch: 'from-scratch-find-error', fmt: 'error',
      prompt: R`A student finds the Taylor series of $f(x)=\dfrac1x$ centred at $x=1$ from the definition. Which line has the error?`,
      work: [
        R`Line 1: $f=x^{-1},\ f'=-x^{-2},\ f''=2x^{-3},\ f'''=-6x^{-4}$.`,
        R`Line 2: Pattern: $f^{(n)}(x)=(-1)^{n}n!\,x^{-(n+1)}$, so $f^{(n)}(1)=(-1)^{n}n!$.`,
        R`Line 3: Coefficient: $\dfrac{f^{(n)}(1)}{n!}=\dfrac{(-1)^{n}}{n!}$.`,
        R`Line 4: Series: $\displaystyle\sum_{n=0}^{\infty}\frac{(-1)^{n}(x-1)^{n}}{n!}$.`,
      ],
      choices: [
        { t: 'Line 1', why: 'Line 1 is right: each derivative brings down the power and lowers it by one, giving -1, 2, -6 as the multipliers.', err: 'concept' },
        { t: 'Line 2', why: 'Line 2 is right: the multipliers 1, -1, 2, -6 are (-1)^n n!, and x = 1 makes every power of x equal 1.', err: 'concept' },
        { t: 'Line 3', ok: true },
        { t: 'Line 4', why: 'Line 4 copies Line 3 correctly; it is only wrong because it inherits the bad coefficient from the line before.', err: 'concept' },
        { t: 'No error', why: 'The final answer is wrong: 1/x at centre 1 has coefficients (-1)^n with no factorial, since n!/n! = 1.', err: 'factorial' },
      ],
      keyWhy: R`$\frac{(-1)^n n!}{n!}=(-1)^n$. The $n!$ cancels; the correct series is $\sum(-1)^n(x-1)^n$.`,
      hints: ['Check each line by plugging n = 2.', R`What is $\frac{(-1)^n n!}{n!}$?`],
      steps: [R`Lines 1 and 2 are correct: $f^{(n)}(1)=(-1)^nn!$.`, R`Line 3 should divide $(-1)^nn!$ by $n!$, which gives $(-1)^n$; the student dropped the $n!$ on top.`, R`Correct series: $\sum_{n=0}^{\infty}(-1)^{n}(x-1)^{n}$.`],
      recall: 'Coefficient = f^(n)(c) divided by n!. Cancel before you write.',
    },
    {
      id: 'lp-exam3-07', unit: 'series', topic: AP, stage: 'core', diff: 3, arch: 'sum-recognize-ln', fmt: 'free',
      prompt: R`Find the exact value of $\displaystyle\sum_{n=1}^{\infty}\frac{(-1)^{n+1}}{n\,2^{n}}$.`,
      choices: [
        { t: R`$\ln\left(\dfrac{3}{2}\right)$`, ok: true },
        { t: R`$\ln 2$`, why: 'You matched ln(1+x) but plugged in x = 1 instead of reading x = 1/2 from the 2^n in the bottom.', err: 'setup' },
        { t: R`$\ln\left(\dfrac{1}{2}\right)$`, why: 'You plugged in x = -1/2; the sign is already carried by (-1)^(n+1), so x = +1/2 and the answer is ln(1 + 1/2).', err: 'sign' },
        { t: R`$e^{1/2}-1$`, why: 'That is the e^x row, which has n! in the bottom and no alternating sign; this sum has a plain n and alternates.', err: 'formula-confusion' },
      ],
      hints: ['Plain n in the bottom, alternating, starts at n = 1: which row?', R`$\frac{1}{n2^n}=\frac{(1/2)^n}{n}$. So $x=\,?$`],
      steps: [R`The pieces $\frac{(-1)^{n+1}x^n}{n}$, starting at $n=1$, are the $\ln(1+x)$ row.`, R`$\frac{1}{2^n}=\left(\frac12\right)^n$, so $x=\frac12$, which is inside $(-1,1]$.`, R`Sum $=\ln\left(1+\frac12\right)=\ln\frac32$.`],
      recall: 'Match the row, then read x from the base of the power.',
    },
    {
      id: 'lp-exam3-08', unit: 'series', topic: TP, stage: 'core', diff: 3, arch: 'taylor-poly-estimate', fmt: 'free',
      prompt: R`Use $T_2(x)$ for $f(x)=\sqrt{x}$ centred at $x=4$ to estimate $\sqrt{4.1}$. Give the exact fraction.`,
      choices: [
        { t: R`$\dfrac{12959}{6400}$`, ok: true },
        { t: R`$\dfrac{6479}{3200}$`, why: 'You forgot to divide f\'\'(4) by 2!, using -1/32 times (0.1)^2 instead of -1/64 times (0.1)^2.', err: 'factorial' },
        { t: R`$\dfrac{12961}{6400}$`, why: 'Sign slip: f\'\'(x) = -(1/4)x^(-3/2) is negative, so the square term is subtracted, not added.', err: 'sign' },
        { t: R`$\dfrac{81}{40}$`, why: 'That is only T_1 = 2 + 0.1/4; the question asks for T_2, which also has the (x - 4)^2 term.', err: 'setup' },
      ],
      hints: [R`$f(4)=2$, $f'(4)=\frac14$, $f''(4)=-\frac1{32}$.`, R`$T_2=2+\frac14(x-4)-\frac{1}{64}(x-4)^2$. Put $x-4=\frac1{10}$.`],
      steps: [
        R`$f=x^{1/2}\to2$; $f'=\frac12x^{-1/2}\to\frac14$; $f''=-\frac14x^{-3/2}\to-\frac{1}{32}$.`,
        R`$T_2(x)=2+\frac14(x-4)-\frac{1}{32\cdot2!}(x-4)^2=2+\frac14(x-4)-\frac1{64}(x-4)^2$.`,
        R`At $x=4.1$: $2+\frac{1}{40}-\frac{1}{6400}=\frac{12800+160-1}{6400}=\frac{12959}{6400}\approx2.02484$.`,
      ],
      recall: 'T_n term k: f^(k)(c)/k! times (x - c)^k.',
    },
    {
      id: 'lp-exam3-09', unit: 'series', topic: TP, stage: 'core', diff: 2, arch: 'decide-which-tool',
      prompt: R`An exam question reads: "Let $T_3(x)$ be the Maclaurin polynomial of $f(x)=e^{-x}$. Using $T_3$ to approximate $f$ on $[0,0.5]$, find the largest possible error." Which tool do you use?`,
      choices: [
        { t: R`The Taylor remainder bound $\dfrac{M}{4!}|x|^{4}$ with $M$ the largest $|f^{(4)}|$ on $[0,0.5]$`, ok: true },
        { t: 'The Ratio Test, then check both endpoints', why: 'The Ratio Test answers "for which x does the series converge", not "how big is the error of T_3".', err: 'concept' },
        { t: R`Plug $x=0.5$ into the series for $e^{x}$ and sum it exactly`, why: 'That finds an exact sum by recognition; the question asks for a bound on the error of a cut-off polynomial.', err: 'concept' },
        { t: R`The remainder bound with $f'''$ and $3!$`, why: 'Off by one: the error of T_3 uses one derivative past the polynomial, f^(4), and divides by 4!.', err: 'index' },
      ],
      hints: ['"Largest possible error" is the key phrase.', 'Error of T_n uses f^(n+1) and (n+1)!.'],
      steps: [R`"Largest possible error" of a Taylor polynomial points to the Taylor remainder theorem.`, R`For $T_3$, use $f^{(4)}$ and $4!$: $|R_3|\le\frac{M}{4!}|x|^4$.`],
      recall: 'Error question -> remainder bound with f^(n+1) and (n+1)!.',
    },
    {
      id: 'lp-exam3-10', unit: 'series', topic: PS, stage: 'exam', diff: 4, arch: 'ioc-scaled-centre-sqrt', fmt: 'free',
      prompt: R`Find the interval of convergence of $\displaystyle\sum_{n=1}^{\infty}\frac{(-1)^{n}(2x-1)^{n}}{\sqrt{n}}$. Fully justify the endpoints.`,
      accept: ["(0,1]", "(0, 1]"],
      choices: [
        { t: R`$(0,1]$`, ok: true },
        { t: R`$[0,1]$`, why: 'At x = 0, (2x - 1)^n = (-1)^n cancels the sign, leaving sum 1/sqrt(n), a p-series with p = 1/2 that diverges.', err: 'endpoint' },
        { t: R`$(0,1)$`, why: 'You stopped at the open interval; at x = 1 the series is sum (-1)^n/sqrt(n), which converges by the Alternating Series Test.', err: 'endpoint' },
        { t: R`$(0,2]$`, why: 'You treated (2x - 1) as (x - 1); |2x - 1| < 1 means |x - 1/2| < 1/2, so the centre is 1/2 and the radius is 1/2.', err: 'setup' },
      ],
      hints: [R`Ratio Test: the limit is $|2x-1|$.`, R`$|2x-1|<1$ means $0<x<1$. Now plug $x=0$ and $x=1$ into the original series.`],
      steps: [
        R`Ratio: $\left|\dfrac{(2x-1)^{n+1}}{\sqrt{n+1}}\cdot\dfrac{\sqrt n}{(2x-1)^n}\right|=\sqrt{\dfrac{n}{n+1}}\,|2x-1|\to|2x-1|$.`,
        R`$|2x-1|<1\iff-1<2x-1<1\iff0<x<1$. Centre $\frac12$, radius $\frac12$.`,
        R`$x=1$: $\sum\frac{(-1)^n}{\sqrt n}$; sizes $\frac1{\sqrt n}$ decrease to $0$, so it converges (AST). Bracket.`,
        R`$x=0$: $\sum\frac{(-1)^n(-1)^n}{\sqrt n}=\sum\frac{1}{\sqrt n}$, p-series $p=\frac12\le1$: diverges. Parenthesis. Answer $(0,1]$.`,
      ],
      recall: 'Endpoints: (-1)^n times (-1)^n = 1, so signs can cancel.',
    },
    {
      id: 'lp-exam3-11', unit: 'series', topic: TM, stage: 'exam', diff: 4, arch: 'geometric-sub-multiply',
      prompt: R`Find the Maclaurin series for $f(x)=\dfrac{x^{2}}{1+x^{3}}$.`,
      choices: [
        { t: R`$\displaystyle\sum_{n=0}^{\infty}(-1)^{n}x^{3n+2}$`, ok: true },
        { t: R`$\displaystyle\sum_{n=0}^{\infty}x^{3n+2}$`, why: R`Sign lost: $\frac{1}{1+x^3}=\frac{1}{1-(-x^3)}$, so $u=-x^3$ and $(-x^3)^n=(-1)^nx^{3n}$.`, err: 'sign' },
        { t: R`$\displaystyle\sum_{n=0}^{\infty}(-1)^{n}x^{3n}$`, why: R`This is only $\frac{1}{1+x^3}$; you dropped the outside factor $x^2$ that must multiply every term.`, err: 'setup' },
        { t: R`$\displaystyle\sum_{n=0}^{\infty}(-1)^{n}x^{n+5}$`, why: R`You added exponents instead of multiplying: $(x^3)^n=x^{3n}$, not $x^{n+3}$. Times $x^2$ the exponent is $3n+2$, not $n+5$.`, err: 'algebra-slip' },
      ],
      hints: [R`Write $\frac{1}{1+x^3}=\frac{1}{1-(-x^3)}$.`, R`$\sum(-x^3)^n$, then multiply by $x^2$.`],
      steps: [
        R`Geometric row: $\frac{1}{1-u}=\sum u^n$ for $|u|<1$.`,
        R`$u=-x^3$: $\frac{1}{1+x^3}=\sum(-1)^nx^{3n}$, valid for $|x|<1$.`,
        R`Multiply by $x^2$: $\sum_{n=0}^{\infty}(-1)^nx^{3n+2}$.`,
      ],
      recall: 'Rewrite 1 + stuff as 1 - (-stuff), substitute, then multiply.',
    },
    {
      id: 'lp-exam3-12', unit: 'series', topic: TP, stage: 'exam', diff: 5, arch: 'remainder-bound-chain-rule',
      prompt: R`Let $T_2(x)$ be the degree-2 Maclaurin polynomial of $f(x)=e^{2x}$. Showing all your work, find the largest possible error when $T_2$ is used to approximate $f$ on $[0,\,0.5]$.`,
      choices: [
        { t: R`$\dfrac{e}{6}$`, ok: true },
        { t: R`$\dfrac{1}{6}$`, why: 'You evaluated f\'\'\'(z) = 8e^(2z) at the centre z = 0; it is largest at z = 0.5, where it equals 8e.', err: 'concept' },
        { t: R`$\dfrac{e}{2}$`, why: 'Wrong factorial: you divided by 2! (the polynomial degree) instead of 3! for the remainder of T_2.', err: 'factorial' },
        { t: R`$\dfrac{e}{48}$`, why: 'Chain rule dropped: the third derivative of e^(2x) is 8e^(2x), not e^(2x), so M = 8e, not e.', err: 'algebra-slip' },
      ],
      hints: [R`$|R_2(x)|\le\frac{M}{3!}|x|^3$. Find $f'''$.`, R`$f'''(x)=8e^{2x}$, biggest at $x=0.5$: $M=8e$.`],
      steps: [
        R`Remainder of $T_2$: $|R_2(x)|=\left|\dfrac{f'''(\xi)}{3!}x^{3}\right|$ for some $\xi$ between $0$ and $x$.`,
        R`Chain rule three times: $f'''(x)=2^{3}e^{2x}=8e^{2x}$, which grows, so on $[0,0.5]$ its max is $M=8e^{1}=8e$.`,
        R`Largest $|x|^3$ on $[0,0.5]$ is $(0.5)^3=\frac18$.`,
        R`Bound: $\dfrac{8e}{6}\cdot\dfrac18=\dfrac{e}{6}\approx0.453$.`,
      ],
      recall: 'M = worst |f^(n+1)| on the interval, not at the centre.',
    },
  ],
};
