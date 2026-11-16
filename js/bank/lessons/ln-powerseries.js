// js/bank/lessons/ln-powerseries.js — ground-up rewrite (run fin). Contract: .hnic/context/fin-contract.md
// Every limit, interval and endpoint verdict below was checked with sympy (ratio limit + Sum.is_convergent).
const R = String.raw;

export default {
  id: 'ln-powerseries',
  goal: R`Given a power series, find its centre, its radius of convergence, and its full interval of convergence with both endpoints checked.`,
  why: R`Power series are the base for Taylor and Maclaurin series, the rest of Exam 3. His Exam 3 usually has two or three "find the interval of convergence" questions, and the endpoint work gets its own points.`,
  plain: R`Up to now every series you met was a list of plain numbers. Is $\sum 3\left(\tfrac12\right)^n$ convergent? Is $\sum 3\left(\tfrac78\right)^n$? Is $\sum 3\left(\tfrac{11}{3}\right)^n$? These are really the same question asked three times.

So put a letter in the slot. Write $\sum 3x^n$ and ask: for which numbers $x$ does this add up to a finite number? That is a power series. It is a series with a variable in it. Each choice of $x$ gives you an ordinary number series, and some of those converge and some do not.

The answer is always a stretch of the number line around one middle point. You find the middle point (the centre). You find how far you can go left and right (the radius). Then you check the two edge points by hand, because no shortcut can decide them.

Think of a lamp in a dark room. The centre is where the lamp sits. The radius is how far the light reaches. The edges are the dim spots where you have to walk over and look.`,
  prereq: [
    { term: 'Series', means: R`An infinite sum $a_1+a_2+a_3+\cdots$. It converges if the running total settles on one finite number.` },
    { term: 'Geometric series', means: R`$\sum a r^n$ converges exactly when $|r|<1$, and diverges when $|r|\ge 1$.` },
    { term: 'Divergence Test', means: R`If the terms $a_n$ do not go to $0$, the series $\sum a_n$ diverges. Example: $\sum 1$ and $\sum(-1)^n$ both diverge.` },
    { term: 'Ratio Test', means: R`Compute $L=\lim_{n\to\infty}\left|\frac{a_{n+1}}{a_n}\right|$. If $L<1$ the series converges, if $L>1$ it diverges, if $L=1$ the test says nothing.` },
    { term: 'p-series', means: R`$\sum \frac{1}{n^p}$ converges when $p>1$ and diverges when $p\le 1$. So $\sum\frac1n$ diverges and $\sum\frac1{n^2}$ converges.` },
    { term: 'Alternating Series Test (AST)', means: R`$\sum(-1)^n b_n$ converges if $b_n$ decreases and $b_n\to0$. Example: $\sum\frac{(-1)^n}{n}$ converges.` },
    { term: 'Absolute value inequality', means: R`$|x-c|<R$ means $-R<x-c<R$, which means $c-R<x<c+R$.` },
  ],
  sections: [
    {
      h: 'A series with an x in it',
      body: R`Start with his example $\displaystyle\sum_{n=0}^{\infty}3x^n = 3+3x+3x^2+3x^3+\cdots$. Plug in $x=\tfrac12$ and you get $\sum 3\left(\tfrac12\right)^n$, a plain number series. Plug in $x=\tfrac{11}{3}$ and you get a different one.

This one is geometric with ratio $r=x$. A geometric series converges exactly when $|r|<1$. So $\sum 3x^n$ converges when $|x|<1$, that is $-1<x<1$, and diverges for every other $x$.

In words: a series with $x$ in it does not just "converge" or "diverge". It converges for some $x$ and diverges for others. Your job is to find the set of $x$ where it converges. Think of it like the domain of a function: the series only makes sense where it converges.`,
      check: { q: R`Does $\sum 3x^n$ converge at $x=-\tfrac12$? At $x=2$?`, a: R`At $x=-\tfrac12$: yes, $|r|=\tfrac12<1$. At $x=2$: no, $|r|=2\ge1$.` },
    },
    {
      h: 'What a power series is: coefficients and centre',
      body: R`**Definition.** A power series is a series of the form $\displaystyle\sum_{n=0}^{\infty}a_n(x-c)^n$.

The pieces: $n$ is the counter ($0,1,2,\ldots$). $a_n$ is the **coefficient**, the plain-number part of each term (no $x$ in it). $c$ is a fixed number called the **centre**. $(x-c)^n$ is the only part that holds $x$.

His example: $\displaystyle\sum_{n=0}^{\infty}\frac{n}{n+1}(x-3)^n$ has $a_n=\frac{n}{n+1}$ and centre $c=3$. Another: $\sum(-1)^nx^n$ has $a_n=(-1)^n$ and centre $0$, because $x=x-0$.

How to find the centre fast: it is the $x$ value that "kills" the series. Set the bracket to zero. For $(x+5)^n$, solve $x+5=0$, so $c=-5$. Watch the sign: $x+5=x-(-5)$.

At $x=c$ every term with $n\ge1$ is $0$. So a power series **always converges at its centre**.`,
      check: { q: R`What is the centre of $\displaystyle\sum\frac{(x+2)^n}{n\,3^n}$?`, a: R`Solve $x+2=0$: the centre is $c=-2$ (not $2$).` },
    },
    {
      h: 'The shape of the answer: a point, an interval, or everything',
      body: R`**Fact.** The set of $x$ where a power series converges is always one of three shapes:

1. Just the centre, $\{c\}$. Then the radius is $R=0$.

2. An interval centred at $c$ that reaches a distance $R$ each way. The edges $c-R$ and $c+R$ are called the **endpoints**. Each endpoint may be in or out, so you get $(\ ,\ )$, $[\ ,\ )$, $(\ ,\ ]$ or $[\ ,\ ]$.

3. The whole line $(-\infty,\infty)$. Then $R=\infty$.

$R$ is the **radius of convergence**. The full set, with the endpoints decided, is the **interval of convergence**.

Why it is always centred: the size of each term depends only on the distance $|x-c|$. Two points the same distance from $c$ give terms of the same size. So it is never two separate pieces.

Going backwards: if you are given the interval, the centre is the midpoint and the radius is half the width. For $[-1,2)$: centre $\frac{-1+2}{2}=\frac12$, radius $\frac{2-(-1)}{2}=\frac32$.`,
      check: { q: R`A power series has interval of convergence $(-6,-2]$. What are the centre and radius?`, a: R`Centre $\frac{-6+(-2)}{2}=-4$, radius $\frac{-2-(-6)}{2}=2$.` },
    },
    {
      h: 'Finding the radius with the Ratio Test',
      body: R`For most power series you cannot spot a geometric series. So use the Ratio Test on the whole term, $x$ included.

His example: $\displaystyle\sum_{n=1}^{\infty}\frac{(x-1)^n}{\sqrt n\,3^n}$. Write term $n+1$ over term $n$, flip and multiply:

$\displaystyle\lim_{n\to\infty}\left|\frac{(x-1)^{n+1}}{\sqrt{n+1}\,3^{n+1}}\cdot\frac{\sqrt n\,3^n}{(x-1)^n}\right|$.

Now cancel piece by piece. $\frac{(x-1)^{n+1}}{(x-1)^n}=x-1$. $\frac{3^n}{3^{n+1}}=\frac13$. $\frac{\sqrt n}{\sqrt{n+1}}=\sqrt{\frac{n}{n+1}}\to1$. So the limit is $\frac{|x-1|}{3}$.

The Ratio Test says converge when this is less than $1$: $\frac{|x-1|}{3}<1$, so $|x-1|<3$. That reads "within $3$ of $1$". So $R=3$ and $-3<x-1<3$ gives $-2<x<4$.

Pieces like $\frac{n}{n+1}$, $\frac{n^2}{(n+1)^2}$ and $\sqrt{\frac{n}{n+1}}$ all go to $1$ for huge $n$ (try $n=1000$: $\frac{1000}{1001}$ is almost $1$). So a plain power of $n$ in the coefficient never changes the radius.

In words: the $x$ part always leaves $|x-c|$ behind. Everything else becomes a number. Solve "that number times $|x-c|$ is less than $1$".`,
      check: { q: R`For $\displaystyle\sum\frac{x^n}{n\,4^n}$, what does the Ratio Test limit come out to?`, a: R`$\frac{|x|}{4}$, because $\frac{n}{n+1}\to1$ and $\frac{4^n}{4^{n+1}}=\frac14$. So $R=4$.` },
    },
    {
      h: 'The endpoints: plug in and test by hand',
      body: R`At an endpoint the Ratio Test limit equals exactly $1$. At $L=1$ the Ratio Test says nothing. That is why every endpoint needs its own separate check, and why he gives it its own marks.

What you do: put the endpoint value in for $x$. The $x$ disappears and you get a plain number series. Simplify it, then name a test you already know.

His example again, open interval $(-2,4)$.

$x=4$: $\displaystyle\sum\frac{(4-1)^n}{\sqrt n\,3^n}=\sum\frac{3^n}{\sqrt n\,3^n}=\sum\frac{1}{\sqrt n}$. That is a $p$-series with $p=\frac12\le1$, so it **diverges**. Leave $4$ out.

$x=-2$: $\displaystyle\sum\frac{(-3)^n}{\sqrt n\,3^n}$. Split $(-3)^n=(-1)^n3^n$. The $3^n$ cancels, leaving $\sum\frac{(-1)^n}{\sqrt n}$. Here $\frac1{\sqrt n}\to0$ and decreases, so it **converges** by the AST. Put $-2$ in.

Interval of convergence: $[-2,4)$, that is $-2\le x<4$. The two endpoints often disagree, so test both.`,
      check: { q: R`For $\displaystyle\sum_{n=0}^{\infty}\frac{(x+1)^n}{4^n}$ (open interval $(-5,3)$), what happens at $x=3$?`, a: R`You get $\sum 1^n=\sum1$. The terms do not go to $0$, so it diverges by the Divergence Test. ($x=-5$ gives $\sum(-1)^n$, also divergent.) Interval: $(-5,3)$.` },
    },
    {
      h: 'A number in front of x: (2x-1)^n',
      body: R`Sometimes the bracket is $(2x-1)^n$ or $(5x+2)^n$ instead of $(x-c)^n$. The centre is still the $x$ that makes the bracket zero: $2x-1=0$ gives $c=\frac12$, not $1$.

The radius needs care. Run the Ratio Test as usual. For $\displaystyle\sum\frac{(2x-1)^n}{n^2\,3^n}$ you get $\frac{|2x-1|}{3}<1$, so $|2x-1|<3$. That is **not** $R=3$. The radius measures distance in $x$, and $|2x-1|=2\left|x-\tfrac12\right|$. So $\left|x-\tfrac12\right|<\frac32$ and $R=\frac32$.

Safe way: solve the inequality all the way to $x$. $-3<2x-1<3$, add $1$: $-2<2x<4$, divide by $2$: $-1<x<2$. Then $R$ is half the width, $\frac{2-(-1)}{2}=\frac32$.

In words: divide by the number in front of $x$ before you read off the centre or the radius.`,
      check: { q: R`Radius of $\displaystyle\sum\frac{(3x-2)^n}{5^n}$?`, a: R`$|3x-2|<5$ gives $-1<x<\frac73$, so $R=\frac{\frac73-(-1)}{2}=\frac53$.` },
    },
    {
      h: 'The two extremes: factorials',
      body: R`**Factorial** means multiply down to 1: $n!=n(n-1)\cdots2\cdot1$. So $4!=4\cdot3\cdot2\cdot1=24$. The next one is $(n+1)!=(n+1)\cdot n!$, which is why $\frac{(n+1)!}{n!}=n+1$.

Factorials grow faster than any power. That decides the radius right away.

**Factorial on the bottom**, like $\displaystyle\sum\frac{x^n}{n!}$. Ratio Test: $\frac{n!}{(n+1)!}=\frac1{n+1}$, so the limit is $|x|\cdot\frac{1}{n+1}\to0$. That is less than $1$ for every $x$. So $R=\infty$ and the interval is $(-\infty,\infty)$. There are no endpoints to check.

**Factorial on top**, like his exam item $\displaystyle\sum n!\,(5x+2)^n$. Ratio Test: $\frac{(n+1)!}{n!}=n+1$, so the limit is $(n+1)|5x+2|\to\infty$ unless $5x+2=0$. So $R=0$ and the series converges only at the centre $x=-\frac25$.

In words: factorial on the bottom crushes the terms (all $x$ work). Factorial on top blows them up (only the centre works).`,
      check: { q: R`Interval of convergence of $\displaystyle\sum n!\,x^n$?`, a: R`$R=0$, so only $x=0$: the set $\{0\}$.` },
    },
  ],
  recipe: [
    R`Find the centre: set the bracket to $0$ and solve for $x$. Factor out any number in front of $x$.`,
    R`Ratio Test on the whole term: $\displaystyle\lim_{n\to\infty}\left|\frac{a_{n+1}(x-c)^{n+1}}{a_n(x-c)^n}\right|$. Cancel until only $|x-c|$ times a number is left.`,
    R`Set that limit $<1$ and solve all the way to $x$: $c-R<x<c+R$. Read off $R$ (half the width). If the limit is $0$ for all $x$, $R=\infty$; if it is $\infty$ except at $c$, $R=0$. Then stop: no endpoints.`,
    R`Endpoint $x=c+R$: substitute, simplify to a plain number series, name a test (p-series, AST, Divergence Test, geometric), write converge or diverge.`,
    R`Endpoint $x=c-R$: same, separately. Split $(-k)^n=(-1)^nk^n$ before cancelling.`,
    R`Write the interval with $[$ for an endpoint that converges and $($ for one that diverges.`,
  ],
  worked: [
    {
      q: R`For which $x$ does $\displaystyle\sum_{n=0}^{\infty}3x^n$ converge?`,
      steps: [
        R`Notice the shape: each term is the one before times $x$. So it is geometric with ratio $r=x$. (Centre $0$, coefficient $a_n=3$.)`,
        R`A geometric series converges exactly when $|r|<1$. So you need $|x|<1$.`,
        R`Unpack the absolute value: $|x|<1$ means $-1<x<1$. So $R=1$.`,
        R`Endpoints: at $x=1$ you get $\sum 3$ and at $x=-1$ you get $\sum3(-1)^n$. Neither has terms going to $0$, so both diverge.`,
        R`Interval of convergence: $(-1,1)$.`,
      ],
      note: R`Geometric power series are the only ones you can do without the Ratio Test, and their endpoints always diverge.`,
    },
    {
      q: R`Find the centre, radius and interval of convergence of $\displaystyle\sum_{n=1}^{\infty}\frac{(x-1)^n}{\sqrt n\,3^n}$.`,
      steps: [
        R`Centre: $x-1=0$, so $c=1$.`,
        R`Ratio Test: $\displaystyle\lim_{n\to\infty}\left|\frac{(x-1)^{n+1}}{\sqrt{n+1}\,3^{n+1}}\cdot\frac{\sqrt n\,3^n}{(x-1)^n}\right|=\lim_{n\to\infty}\sqrt{\frac{n}{n+1}}\cdot\frac13\cdot|x-1|=\frac{|x-1|}{3}$. Each piece cancels separately: the powers of $(x-1)$ leave one $(x-1)$, the powers of $3$ leave $\frac13$, and $\sqrt{n/(n+1)}\to1$.`,
        R`Need $\frac{|x-1|}{3}<1$: $-3<x-1<3$, add $1$: $-2<x<4$. So $R=3$.`,
        R`$x=4$: $\sum\frac{3^n}{\sqrt n\,3^n}=\sum\frac1{\sqrt n}$, a $p$-series with $p=\frac12\le1$: diverges.`,
        R`$x=-2$: $\sum\frac{(-3)^n}{\sqrt n\,3^n}=\sum\frac{(-1)^n}{\sqrt n}$. $\frac1{\sqrt n}\to0$ and decreases, so it converges by the AST.`,
        R`Interval of convergence: $[-2,4)$, i.e. $-2\le x<4$.`,
      ],
      note: R`This is his 10-29 lecture example. Check: $R=\frac{4-(-2)}{2}=3$.`,
    },
    {
      q: R`Find the centre, radius and interval of convergence of $\displaystyle\sum_{n=1}^{\infty}\frac{(2x-1)^n}{n^2\,3^n}$.`,
      steps: [
        R`Centre: $2x-1=0$ gives $c=\frac12$. The $2$ in front of $x$ matters.`,
        R`Ratio Test: $\displaystyle\lim_{n\to\infty}\left|\frac{(2x-1)^{n+1}}{(n+1)^2\,3^{n+1}}\cdot\frac{n^2\,3^n}{(2x-1)^n}\right|=\lim_{n\to\infty}\frac{n^2}{(n+1)^2}\cdot\frac{|2x-1|}{3}=\frac{|2x-1|}{3}$.`,
        R`Need $|2x-1|<3$: $-3<2x-1<3$, so $-2<2x<4$, so $-1<x<2$. Radius $R=\frac{2-(-1)}{2}=\frac32$, not $3$.`,
        R`$x=2$: $2x-1=3$, so $\sum\frac{3^n}{n^2 3^n}=\sum\frac1{n^2}$, a $p$-series with $p=2>1$: converges.`,
        R`$x=-1$: $2x-1=-3$, so $\sum\frac{(-1)^n}{n^2}$. Dropping the signs gives $\sum\frac1{n^2}$, which converges ($p=2>1$). If the series with signs dropped converges, the signed series converges too (it also passes the AST).`,
        R`Interval of convergence: $[-1,2]$.`,
      ],
      note: R`Both endpoints went in here. You only know that after testing each one.`,
    },
    {
      q: R`Showing all your work, find the interval of convergence of $\displaystyle\sum_{n=1}^{\infty}\frac{(-1)^n(x+4)^n}{n\,2^n}$. Be sure to check the endpoints.`,
      steps: [
        R`Centre: $x+4=0$, so $c=-4$.`,
        R`Ratio Test: $\displaystyle\lim_{n\to\infty}\left|\frac{(-1)^{n+1}(x+4)^{n+1}}{(n+1)2^{n+1}}\cdot\frac{n\,2^n}{(-1)^n(x+4)^n}\right|=\lim_{n\to\infty}\frac{n}{n+1}\cdot\frac{|x+4|}{2}=\frac{|x+4|}{2}$. The absolute value removes the $(-1)$.`,
        R`Need $|x+4|<2$: $-2<x+4<2$, so $-6<x<-2$. $R=2$.`,
        R`$x=-2$: $x+4=2$, so $\sum\frac{(-1)^n2^n}{n\,2^n}=\sum\frac{(-1)^n}{n}$, the alternating harmonic series: converges by the AST.`,
        R`$x=-6$: $x+4=-2$, so $(-1)^n(-2)^n=(-1)^n(-1)^n2^n=2^n$ (because $(-1)^{2n}=1$). The series is $\sum\frac1n$, the harmonic series: diverges.`,
        R`Interval of convergence: $(-6,-2]$.`,
      ],
      note: R`The $(-1)^n$ in front flips which endpoint is alternating. Never guess from the last problem; substitute every time.`,
    },
  ],
  exam: [
    R`Find the interval of convergence of $\sum a_n(x-c)^n$. Be sure to check the endpoints. (Exam 3 Q3 and Q5 pattern)`,
    R`Find the centre and radius of convergence. (Radius only: no endpoint work.)`,
    R`Given the interval $[-1,2)$, state the centre and radius: centre $\frac12$, radius $\frac32$.`,
    R`Find the radius for $\sum n!\,(5x+2)^n$: $R=0$, converges only at $x=-\frac25$.`,
    R`Determine all $x$ for which the series converges. Fully justify.`,
  ],
  traps: [
    R`Stopping at the radius and calling the open interval the answer. Fix: always write two more lines, "$x=$ left end:" and "$x=$ right end:".`,
    R`Assuming both endpoints behave the same way. Fix: substitute each one separately; they often disagree.`,
    R`Reading the centre with the wrong sign. $(x+5)^n$ has centre $-5$. Fix: solve bracket $=0$.`,
    R`Reading the radius as $3$ from $|2x-1|<3$. The radius is for $x$, so divide by the $2$: $R=\frac32$. Fix: solve the inequality all the way to $x$.`,
    R`Losing the sign at the left endpoint. Fix: write $(-k)^n=(-1)^nk^n$ before you cancel the $k^n$.`,
    R`Checking endpoints when $R=0$ or $R=\infty$. There are none. $\sum\frac{x^n}{n!}$ is $(-\infty,\infty)$ and $\sum n!x^n$ is $\{0\}$.`,
  ],
  practice: [
    {
      id: 'lp-powerseries-01', unit: 'series', topic: 'Power Series & Radius', stage: 'warmup', diff: 1,
      arch: 'ps-converges-at-centre', tf: true,
      prompt: R`True or false: every power series $\sum a_n(x-c)^n$ converges at $x=c$, no matter what the coefficients $a_n$ are.`,
      choices: [
        { t: 'True', ok: true },
        { t: 'False', why: R`At $x=c$ every term with $n\ge1$ has the factor $0^n=0$, so the sum is just $a_0$, a finite number. Even $\sum n!x^n$ converges at its centre.`, err: 'concept' },
      ],
      hints: [R`Plug $x=c$ into $(x-c)^n$.`, R`What is $0^n$ for $n\ge1$?`],
      steps: [R`At $x=c$, $(x-c)^n=0^n=0$ for every $n\ge1$.`, R`So the series is $a_0+0+0+\cdots=a_0$, a finite number. It converges.`],
      recall: 'A power series always converges at its centre.',
    },
    {
      id: 'lp-powerseries-02', unit: 'series', topic: 'Power Series & Radius', stage: 'warmup', diff: 2,
      arch: 'ps-read-centre', fmt: 'free',
      prompt: R`What is the centre of $\displaystyle\sum_{n=1}^{\infty}\frac{(x+5)^n}{n\,7^n}$? Type the number.`,
      choices: [
        { t: R`$-5$`, ok: true },
        { t: R`$5$`, why: R`Sign slip: $x+5=x-(-5)$, so the centre is $-5$. Solve $x+5=0$ instead of reading the number off.`, err: 'sign' },
        { t: R`$0$`, why: R`Centre $0$ needs a bare $x^n$. Here the bracket is $(x+5)$, which is zero at $x=-5$, not at $0$.`, err: 'concept' },
        { t: R`$7$`, why: R`The $7^n$ is part of the coefficient and controls the radius, not the centre. The centre comes from the bracket.`, err: 'formula-confusion' },
      ],
      hints: [R`The centre is the $x$ that kills every term.`, R`Solve $x+5=0$.`],
      steps: [R`Write the bracket as $x-c$: $x+5=x-(-5)$.`, R`So $c=-5$.`],
      recall: 'Centre = the x that makes the bracket zero.',
    },
    {
      id: 'lp-powerseries-03', unit: 'series', topic: 'Power Series & Radius', stage: 'core', diff: 2,
      arch: 'ps-interval-to-centre-radius',
      prompt: R`A power series has interval of convergence $[-3,7)$. What are its centre and radius of convergence?`,
      choices: [
        { t: R`centre $2$, radius $5$`, ok: true },
        { t: R`centre $2$, radius $10$`, why: R`$10$ is the full width $7-(-3)$. The radius is half the width, because it reaches out from the centre each way.`, err: 'formula-confusion' },
        { t: R`centre $5$, radius $5$`, why: R`The centre is the midpoint $\frac{-3+7}{2}=2$. Using $\frac{7+3}{2}=5$ treats $-3$ as $+3$.`, err: 'sign' },
        { t: R`centre $0$, radius $7$`, why: R`The interval is not symmetric about $0$. The centre is its midpoint, and the radius is half its width.`, err: 'concept' },
      ],
      hints: [R`The interval is centred at $c$ and reaches $R$ each way.`, R`Midpoint and half-width.`],
      steps: [R`Centre = midpoint: $\frac{-3+7}{2}=2$.`, R`Radius = half-width: $\frac{7-(-3)}{2}=5$.`, R`The brackets do not change $c$ or $R$; they only say which endpoints converge.`],
      recall: 'Given the interval: centre = midpoint, radius = half the width.',
    },
    {
      id: 'lp-powerseries-04', unit: 'series', topic: 'Power Series & Radius', stage: 'core', diff: 3,
      arch: 'ps-possible-shapes', fmt: 'multi',
      prompt: R`A power series is centred at $c=2$. Select **all** sets that could be its set of convergence.`,
      choices: [
        { t: R`$\{2\}$`, ok: true, why: R`This is the $R=0$ case: only the centre. It happens with factorials on top, like $\sum n!(x-2)^n$.` },
        { t: R`$(-1,5]$`, ok: true, why: R`Midpoint $\frac{-1+5}{2}=2$, so it is centred at $2$ with $R=3$. Mixed brackets are allowed.` },
        { t: R`$(-\infty,\infty)$`, ok: true, why: R`This is the $R=\infty$ case, e.g. factorial on the bottom.` },
        { t: R`$(1,4)$`, why: R`Its midpoint is $\frac52$, not $2$. The interval of convergence is always centred at the centre.`, err: 'concept' },
        { t: R`$(-\infty,0)\cup(4,\infty)$`, why: R`Two outer pieces are never possible. Convergence is decided by the distance $|x-2|$, and it is the near points that converge.`, err: 'concept' },
      ],
      hints: [R`There are only three shapes: a point, an interval, or the whole line.`, R`Any interval must have midpoint $2$.`],
      steps: [R`Allowed shapes: $\{c\}$, an interval centred at $c$, or $(-\infty,\infty)$.`, R`$(-1,5]$ has midpoint $2$: allowed. $(1,4)$ has midpoint $2.5$: not allowed.`, R`The union of two tails is not one of the shapes: not allowed.`],
      recall: 'Point, centred interval, or the whole line. Nothing else.',
    },
    {
      id: 'lp-powerseries-05', unit: 'series', topic: 'Power Series & Radius', stage: 'core', diff: 3,
      arch: 'ps-ratio-setup',
      prompt: R`You want the radius of $\displaystyle\sum_{n=1}^{\infty}\frac{x^n}{n\,4^n}$. Which is the correct Ratio Test set-up **and** its limit?`,
      choices: [
        { t: R`$\displaystyle\lim_{n\to\infty}\left|\frac{x^{n+1}}{(n+1)4^{n+1}}\cdot\frac{n\,4^n}{x^n}\right|=\frac{|x|}{4}$`, ok: true },
        { t: R`$\displaystyle\lim_{n\to\infty}\left|\frac{x^{n+1}}{(n+1)4^{n}}\cdot\frac{n\,4^n}{x^n}\right|=|x|$`, why: R`Index slip: only the $n$ was advanced, not the $4^n$. Every $n$ in term $n+1$ becomes $n+1$, including the exponent on $4$.`, err: 'index' },
        { t: R`$\displaystyle\lim_{n\to\infty}\left|\frac{x^{n}}{n\,4^{n}}\cdot\frac{(n+1)4^{n+1}}{x^{n+1}}\right|=\frac{4}{|x|}$`, why: R`The fraction is upside down: this is $a_n/a_{n+1}$. The Ratio Test uses the next term on top, $a_{n+1}/a_n$.`, err: 'setup' },
        { t: R`$\displaystyle\lim_{n\to\infty}\left|\frac{n+1}{n}\cdot\frac{4^{n+1}}{4^n}\right|=4$`, why: R`The $x$ was dropped. The test must include $x$, otherwise you cannot solve for which $x$ converge.`, err: 'setup' },
      ],
      hints: [R`Term $n+1$ goes on top; replace every $n$.`, R`$\frac{4^n}{4^{n+1}}=\frac14$ and $\frac{n}{n+1}\to1$.`],
      steps: [R`$a_{n+1}=\frac{x^{n+1}}{(n+1)4^{n+1}}$. Dividing by $a_n$ means multiplying by $\frac{n\,4^n}{x^n}$.`, R`Cancel: $\frac{x^{n+1}}{x^n}=x$, $\frac{4^n}{4^{n+1}}=\frac14$, $\frac{n}{n+1}\to1$.`, R`Limit $=\frac{|x|}{4}$; $<1$ gives $R=4$.`],
      recall: 'Ratio Test: next term over this term, every n advanced, x kept in.',
    },
    {
      id: 'lp-powerseries-06', unit: 'series', topic: 'Power Series & Radius', stage: 'core', diff: 3,
      arch: 'ps-radius-poly-coeff', fmt: 'free',
      prompt: R`Find the radius of convergence $R$ of $\displaystyle\sum_{n=1}^{\infty}\frac{n^2x^n}{7^n}$. (Radius only, no endpoints.)`,
      choices: [
        { t: R`$7$`, ok: true },
        { t: R`$\dfrac{1}{7}$`, why: R`You solved $7|x|<1$. The limit is $\frac{|x|}{7}$, and $\frac{|x|}{7}<1$ gives $|x|<7$.`, err: 'algebra-slip' },
        { t: R`$0$`, why: R`The $n^2$ grows, but only like a polynomial. In the ratio, $\frac{(n+1)^2}{n^2}\to1$, so it does not change the radius.`, err: 'concept' },
        { t: R`$\infty$`, why: R`An infinite radius needs a factorial on the bottom. Here the limit is $\frac{|x|}{7}$, which exceeds $1$ for large $x$.`, err: 'formula-confusion' },
      ],
      hints: [R`What does $\frac{(n+1)^2}{n^2}$ tend to?`, R`The limit is $\frac{|x|}{7}$.`],
      steps: [R`Ratio: $\frac{(n+1)^2x^{n+1}}{7^{n+1}}\cdot\frac{7^n}{n^2x^n}=\frac{(n+1)^2}{n^2}\cdot\frac{x}{7}$.`, R`$\frac{(n+1)^2}{n^2}\to1$, so the limit is $\frac{|x|}{7}$.`, R`$\frac{|x|}{7}<1$ gives $|x|<7$, so $R=7$.`],
      recall: 'Powers of n in the coefficient ratio to 1; they never change R.',
    },
    {
      id: 'lp-powerseries-07', unit: 'series', topic: 'Power Series & Radius', stage: 'core', diff: 3,
      arch: 'ps-endpoint-single',
      prompt: R`For $\displaystyle\sum_{n=1}^{\infty}\frac{(x-1)^n}{\sqrt n\,3^n}$ the open interval is $(-2,4)$. What happens at the endpoint $x=-2$?`,
      choices: [
        { t: R`It becomes $\sum\frac{(-1)^n}{\sqrt n}$, which converges by the AST, so $-2$ is included.`, ok: true },
        { t: R`It becomes $\sum\frac{1}{\sqrt n}$, a divergent $p$-series, so $-2$ is excluded.`, why: R`The sign was lost: $(-2-1)^n=(-3)^n=(-1)^n3^n$. Only the $3^n$ cancels; the $(-1)^n$ stays.`, err: 'sign' },
        { t: R`The Ratio Test limit is $1$ there, so the series diverges at $x=-2$.`, why: R`A Ratio Test limit of $1$ means the test is inconclusive, not that the series diverges. You must test the number series by hand.`, err: 'concept' },
        { t: R`It becomes $\sum\frac{(-1)^n}{\sqrt n}$, which diverges because $p=\frac12\le1$.`, why: R`The $p$-test is for positive terms. An alternating series is checked with the AST: $\frac1{\sqrt n}$ decreases to $0$, so it converges.`, err: 'formula-confusion' },
      ],
      hints: [R`Substitute $x=-2$: the bracket becomes $(-3)^n$.`, R`Split $(-3)^n=(-1)^n3^n$ and cancel the $3^n$.`],
      steps: [R`$x=-2$: $\sum\frac{(-3)^n}{\sqrt n\,3^n}=\sum\frac{(-1)^n3^n}{\sqrt n\,3^n}=\sum\frac{(-1)^n}{\sqrt n}$.`, R`AST: $b_n=\frac1{\sqrt n}$ decreases and $\to0$.`, R`So it converges and $-2$ is in the interval.`],
      recall: 'Endpoint: substitute, split (-k)^n = (-1)^n k^n, then pick a test for the number series.',
    },
    {
      id: 'lp-powerseries-08', unit: 'series', topic: 'Power Series & Radius', stage: 'core', diff: 3,
      arch: 'ps-coefficient-on-x', fmt: 'free',
      prompt: R`Find the radius of convergence of $\displaystyle\sum_{n=0}^{\infty}\frac{(3x-2)^n}{5^n}$.`,
      choices: [
        { t: R`$\dfrac{5}{3}$`, ok: true },
        { t: R`$5$`, why: R`$|3x-2|<5$ is a statement about $3x-2$, not about $x$. Divide by the $3$: $\left|x-\frac23\right|<\frac53$.`, err: 'setup' },
        { t: R`$\dfrac{3}{5}$`, why: R`Divided the wrong way. $3\left|x-\frac23\right|<5$ gives $\left|x-\frac23\right|<\frac53$.`, err: 'algebra-slip' },
        { t: R`$\dfrac{2}{3}$`, why: R`$\frac23$ is the centre (where $3x-2=0$), not the radius.`, err: 'concept' },
      ],
      hints: [R`Ratio Test gives $\frac{|3x-2|}{5}<1$.`, R`Solve $-5<3x-2<5$ all the way to $x$, then take half the width.`],
      steps: [R`Ratio: $\frac{|3x-2|}{5}<1$, so $-5<3x-2<5$.`, R`Add $2$: $-3<3x<7$. Divide by $3$: $-1<x<\frac73$.`, R`$R=\frac{\frac73-(-1)}{2}=\frac{10/3}{2}=\frac53$.`],
      recall: 'Number in front of x: divide by it before reading R.',
    },
    {
      id: 'lp-powerseries-09', unit: 'series', topic: 'Power Series & Radius', stage: 'core', diff: 3,
      arch: 'ps-factorial-top',
      prompt: R`Find the radius and interval of convergence of $\displaystyle\sum_{n=0}^{\infty}n!\,(5x+2)^n$.`,
      choices: [
        { t: R`$R=0$; converges only at $x=-\frac25$`, ok: true },
        { t: R`$R=\infty$; converges for all $x$`, why: R`The factorial is on top, so the terms blow up. An infinite radius comes from a factorial on the bottom.`, err: 'formula-confusion' },
        { t: R`$R=0$; converges only at $x=0$`, why: R`Right radius, wrong centre. Solve $5x+2=0$: the centre is $-\frac25$.`, err: 'setup' },
        { t: R`$R=\frac15$; converges on $\left(-\frac35,-\frac15\right)$`, why: R`That treats the coefficients as bounded. The ratio is $(n+1)|5x+2|\to\infty$ unless $5x+2=0$.`, err: 'setup' },
      ],
      hints: [R`$\frac{(n+1)!}{n!}=n+1$.`, R`$(n+1)|5x+2|$ goes to $\infty$ unless the bracket is $0$.`],
      steps: [R`Ratio: $\frac{(n+1)!\,(5x+2)^{n+1}}{n!\,(5x+2)^n}=(n+1)(5x+2)$.`, R`$\lim(n+1)|5x+2|=\infty$ for every $x$ with $5x+2\ne0$, so the series diverges there.`, R`At $5x+2=0$, i.e. $x=-\frac25$, it converges (the centre). $R=0$.`],
      recall: 'Factorial on top: R = 0, only the centre.',
    },
    {
      id: 'lp-powerseries-10', unit: 'series', topic: 'Power Series & Radius', stage: 'exam', diff: 4,
      arch: 'ps-find-error-endpoint', fmt: 'error',
      prompt: R`A student finds the interval of convergence of $\displaystyle\sum_{n=1}^{\infty}\frac{(x+2)^n}{n\,3^n}$. Which line has the error?`,
      work: [
        R`Centre $c=-2$. Ratio Test gives $\frac{|x+2|}{3}<1$, so $-5<x<1$, $R=3$.`,
        R`$x=1$: $\sum\frac{3^n}{n\,3^n}=\sum\frac1n$, harmonic, diverges.`,
        R`$x=-5$: $\sum\frac{(-3)^n}{n\,3^n}=\sum\frac1n$, harmonic, diverges.`,
        R`Interval of convergence: $(-5,1)$.`,
      ],
      choices: [
        { t: 'Line 1', why: R`Line 1 is correct: $x+2=0$ gives $-2$, and $|x+2|<3$ gives $-5<x<1$.`, err: 'setup' },
        { t: 'Line 2', why: R`Line 2 is correct: $(1+2)^n=3^n$ cancels and $\sum\frac1n$ diverges.`, err: 'endpoint' },
        { t: 'Line 3', ok: true },
        { t: 'Line 4', why: R`Line 4 is only wrong because it copies Line 3's verdict. The slip itself is in Line 3, where the $(-1)^n$ was dropped.`, err: 'endpoint' },
        { t: 'No error', why: R`$(-3)^n=(-1)^n3^n$, so the $x=-5$ series is alternating, not $\sum\frac1n$. Something is wrong.`, err: 'sign' },
      ],
      keyWhy: R`$(-3)^n=(-1)^n3^n$, so at $x=-5$ the series is $\sum\frac{(-1)^n}{n}$, which converges by the AST. Correct interval: $[-5,1)$.`,
      hints: [R`Check each endpoint substitution sign by sign.`, R`What is $(-3)^n$ divided by $3^n$?`],
      steps: [R`Line 1 and 2 check out.`, R`At $x=-5$: $(-5+2)^n=(-3)^n=(-1)^n3^n$, so the series is $\sum\frac{(-1)^n}{n}$.`, R`That converges by the AST, so $-5$ is included: $[-5,1)$. Line 3 dropped the $(-1)^n$.`],
      recall: 'At the left endpoint the minus sign survives as (-1)^n.',
    },
    {
      id: 'lp-powerseries-11', unit: 'series', topic: 'Power Series & Radius', stage: 'exam', diff: 5,
      arch: 'ps-ioc-full-coef-alt',
      prompt: R`Showing all your work, find the interval of convergence of $\displaystyle\sum_{n=1}^{\infty}\frac{(-1)^n(2x+3)^n}{n\,5^n}$. Be sure to check the endpoints.`,
      choices: [
        { t: R`$(-4,1]$`, ok: true },
        { t: R`$[-4,1)$`, why: R`Endpoints reversed. The $(-1)^n$ in front makes $x=1$ alternating ($\sum\frac{(-1)^n}{n}$) and $x=-4$ harmonic ($\sum\frac1n$).`, err: 'endpoint' },
        { t: R`$(-4,1)$`, why: R`You stopped at the open interval. $x=1$ gives $\sum\frac{(-1)^n}{n}$, which converges by the AST, so it belongs in.`, err: 'endpoint' },
        { t: R`$(-8,2]$`, why: R`You solved $|x+3|<5$, dropping the $2$ in front of $x$. Solve $-5<2x+3<5$ to get $-4<x<1$.`, err: 'setup' },
      ],
      hints: [R`Centre: $2x+3=0$. Ratio Test gives $\frac{|2x+3|}{5}<1$.`, R`Solve to $-4<x<1$, then substitute each endpoint. Keep the $(-1)^n$ from the front.`, R`At $x=-4$: $(-1)^n(-5)^n=5^n$.`],
      steps: [R`Centre $-\frac32$. Ratio: $\lim\frac{n}{n+1}\cdot\frac{|2x+3|}{5}=\frac{|2x+3|}{5}<1$.`, R`$-5<2x+3<5\Rightarrow -8<2x<2\Rightarrow -4<x<1$, $R=\frac52$.`, R`$x=1$: $2x+3=5$, series $\sum\frac{(-1)^n5^n}{n5^n}=\sum\frac{(-1)^n}{n}$: converges (AST).`, R`$x=-4$: $2x+3=-5$, $(-1)^n(-5)^n=(-1)^{2n}5^n=5^n$, series $\sum\frac1n$: diverges.`, R`Interval of convergence: $(-4,1]$.`],
      recall: 'Substitute every endpoint with all its signs; never copy the pattern from the last problem.',
    },
    {
      id: 'lp-powerseries-12', unit: 'series', topic: 'Power Series & Radius', stage: 'exam', diff: 4,
      arch: 'ps-reverse-parameter', fmt: 'free',
      prompt: R`For a positive constant $k$, the series $\displaystyle\sum_{n=1}^{\infty}\frac{(x-2)^n}{n\,k^n}$ has interval of convergence $[-4,8)$. Find $k$.`,
      choices: [
        { t: R`$6$`, ok: true },
        { t: R`$12$`, why: R`$12$ is the full width $8-(-4)$. The Ratio Test gives $R=k$, and $R$ is half the width.`, err: 'formula-confusion' },
        { t: R`$\dfrac{1}{6}$`, why: R`The limit is $\frac{|x-2|}{k}$, so $R=k$, not $\frac1k$.`, err: 'algebra-slip' },
        { t: R`$2$`, why: R`$2$ is the centre, which comes from the bracket $(x-2)$. The constant $k$ sets the radius.`, err: 'concept' },
      ],
      hints: [R`The Ratio Test gives $\frac{|x-2|}{k}<1$. What is $R$ in terms of $k$?`, R`Read $R$ off the given interval: half the width.`],
      steps: [R`Ratio Test: $\lim\frac{n}{n+1}\cdot\frac{|x-2|}{k}=\frac{|x-2|}{k}<1$, so $R=k$.`, R`From $[-4,8)$: centre $\frac{-4+8}{2}=2$ (matches), radius $\frac{8-(-4)}{2}=6$.`, R`So $k=6$. Check: $x=8$ gives $\sum\frac1n$ (out), $x=-4$ gives $\sum\frac{(-1)^n}{n}$ (in), matching $[-4,8)$.`],
      recall: 'Work backwards: radius from the interval, then match it to the Ratio Test result.',
    },
  ],
};
