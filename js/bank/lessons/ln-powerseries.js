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
      widget: { lab: 'taylor', set: { fn: '1/(1-x)', deg: 6, at: 0.5 }, caption: R`The function $\frac1{1-x}$ and its partial sums $1+x+\cdots+x^n$. Raise the degree: the curves hug it for $|x|<1$ and fly off outside. That edge is the radius $R=1$.` },
      // src: HW1 P4 (geometric, radius from ratio)
      try: { q: R`The function $\frac{1}{1-x}$ is defined at $x=2$ and equals $-1$ there. Do the partial sums $1+x+x^2+\cdots+x^n$ settle on $-1$ at $x=2$?`, choices: [
        { t: R`No. At $x=2$ they are $1,3,7,15,\ldots$ and grow without bound, because $|x|=2\ge1$.`, ok: true, why: R`The ratio is $x=2$, so $|r|\ge1$ and the geometric series diverges. The function exists at $2$, but the series only matches it inside the radius.` },
        { t: R`Yes. The function is defined there, so the series must match it.`, why: R`A function being defined at a point does not make its series converge there. Convergence needs $|x|<1$.` },
        { t: R`Yes, once $n$ is large enough.`, why: R`The sums $1,3,7,15$ keep doubling. More terms make it worse, not better.` },
      ] },
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
      // src: HW1 P2 (R and centre to interval)
      try: { q: R`A series has centre $-4$ and the Ratio Test gives $|x+4|<2$. What is the open interval?`, choices: [
        { t: R`$(-6,-2)$`, ok: true, why: R`$|x+4|<2$ means $-2<x+4<2$. Subtract $4$: $-6<x<-2$.` },
        { t: R`$(-2,2)$`, why: R`You solved $|x|<2$ and ignored the shift. Subtract $4$ from all three parts.` },
        { t: R`$(-2,6)$`, why: R`Sign slip: you added $4$ instead of subtracting it. Centre $-4$ means the interval sits left of $0$.` },
        { t: R`$(-4,2)$`, why: R`The radius is $2$ each way from $-4$, so it ends at $-6$ and $-2$. $-4$ is the centre, not an end.` },
      ] },
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
      widget: { lab: 'powerint', set: { family: '(x+1)^n/(n·4^n)', x: 0.5, N: 30 }, caption: R`Centre $-1$, radius $4$. Slide $x$: inside $(-5,3)$ the partial sums settle. The ratio $|x-c|/R$ in the readout is the Ratio Test limit.` },
      // src: buddy Q3 (ratio limit setup)
      try: { q: R`For $\displaystyle\sum_{n=1}^{\infty}\frac{(x+1)^n}{n\,4^n}$, what is the Ratio Test limit?`, choices: [
        { t: R`$\dfrac{|x+1|}{4}$`, ok: true, why: R`$\frac{(x+1)^{n+1}}{(x+1)^n}=x+1$, $\frac{4^n}{4^{n+1}}=\frac14$, $\frac{n}{n+1}\to1$.` },
        { t: R`$4\,|x+1|$`, why: R`The $4$'s are flipped. Term $n+1$ has $4^{n+1}$ on the bottom, so $\frac{4^n}{4^{n+1}}=\frac14$.` },
        { t: R`$|x+1|$`, why: R`Index slip: the $4^n$ was not advanced to $4^{n+1}$, so the $\frac14$ was lost.` },
        { t: R`$\dfrac{|x|}{4}$`, why: R`The centre was dropped. The bracket $(x+1)$ stays whole; it does not turn into $x$.` },
      ] },
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
      widget: { lab: 'powerint', set: { family: '(x+1)^n/(n·4^n)', x: 3, N: 40 }, caption: R`At $x=3$ the sums creep up forever (harmonic). Move to $x=-5$: they zigzag and settle. Same series, two different endpoint verdicts.` },
      // src: buddy Q3 (endpoint test choice, student wrote converges by p-test)
      try: { q: R`For $\displaystyle\sum_{n=1}^{\infty}\frac{(x+1)^n}{n\,4^n}$, what happens at the endpoint $x=3$?`, choices: [
        { t: R`It becomes $\sum\frac1n$, harmonic, so it diverges.`, ok: true, why: R`$(3+1)^n=4^n$ cancels the $4^n$, leaving $\sum\frac1n$: $p=1\le1$, divergent.` },
        { t: R`It becomes $\sum\frac1n$, a $p$-series, so it converges.`, why: R`The $p$-series test converges only for $p>1$. Here $p=1$, which diverges.` },
        { t: R`It becomes $\sum\frac{(-1)^n}{n}$, so it converges by the AST.`, why: R`The bracket at $x=3$ is $+4$, so there is no $(-1)^n$. The alternating series is at $x=-5$.` },
        { t: R`The Ratio Test limit is $1$ there, so the series converges.`, why: R`A limit of $1$ means the Ratio Test is silent. You must run another test on the number series.` },
      ] },
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
      widget: { lab: 'powerint', set: { family: 'n!x^n', x: 0.5, N: 20 }, caption: R`$\sum n!\,x^n$ blows up at every $x\ne0$. Switch the family to $x^n/n!$: now every $x$ settles.` },
      // src: HW1 P7 (factorial on both top and bottom)
      try: { q: R`Radius of $\displaystyle\sum_{n=0}^{\infty}\frac{n!}{(2n)!}(x-1)^n$?`, choices: [
        { t: R`$R=\infty$`, ok: true, why: R`$\frac{(n+1)!}{(2n+2)!}\cdot\frac{(2n)!}{n!}=\frac{1}{2(2n+1)}\to0<1$ for every $x$. The bottom factorial $(2n)!$ outgrows $n!$.` },
        { t: R`$R=0$`, why: R`There is a factorial on top, but the one on the bottom is bigger. Work the ratio: it goes to $0$, not $\infty$.` },
        { t: R`$R=1$`, why: R`$1$ is the centre, read off $(x-1)$. The ratio limit is $0$ for all $x$, so the radius is not a finite number.` },
        { t: R`$R=\frac12$`, why: R`You cancelled the factorials as if $(2n)!$ were $2\,n!$. The ratio is $\frac{1}{2(2n+1)}$, which goes to $0$.` },
      ] },
    },
    {
      h: 'Powers like (x-2)^{2n} and (8x)^n',
      body: R`Sometimes the exponent is $2n$ or $3n$, not $n$. HW1 has $\displaystyle\sum_{n=1}^{\infty}\frac{4^n}{n}(x-2)^{2n}$. The centre is still $2$.

Ratio Test: $(x-2)^{2n+2}$ over $(x-2)^{2n}$ leaves $(x-2)^2$. $4^{n+1}$ over $4^n$ leaves $4$. The limit is $4|x-2|^2$.

Need $4|x-2|^2<1$, so $|x-2|^2<\frac14$, so $|x-2|<\frac12$. Take the square root of the right side. So $R=\frac12$ and the open interval is $\left(\frac32,\frac52\right)$.

At both endpoints the bracket is $\pm\frac12$ and the even power $2n$ makes it positive: $\left(\pm\frac12\right)^{2n}=4^{-n}$. So both endpoints give $\sum\frac1n$ and both diverge. An even power gives the same series at both ends.

For $(8x)^n$ the number in front of $x$ works as before: $|8x|<1$ gives $|x|<\frac18$.`,
      // src: HW1 P12, HW1 P8
      try: { q: R`Radius of $\displaystyle\sum_{n=1}^{\infty}\frac{4^n}{n}(x-2)^{2n}$?`, choices: [
        { t: R`$\dfrac12$`, ok: true, why: R`The limit is $4|x-2|^2<1$, so $|x-2|<\frac12$.` },
        { t: R`$\dfrac14$`, why: R`You treated it as $4|x-2|<1$. The exponent is $2n$, so the ratio keeps $(x-2)^2$. Take the square root.` },
        { t: R`$2$`, why: R`$2$ is the centre, from $(x-2)$. The radius comes from $4|x-2|^2<1$.` },
        { t: R`$4$`, why: R`The $4^n$ is on top, so it makes the terms bigger and the radius smaller, not equal to $4$. The limit is $4|x-2|^2$.` },
      ] },
    },
    {
      h: 'Writing terms, and the smallest interval from R',
      body: R`HW1 asks for the first three terms. Plug in $n=0,1,2$ (or the first three starting values) and watch the exponent. For $\displaystyle\sum_{n=0}^{\infty}\frac{n!}{(n+1)^2}(x+3)^{3n}$ the exponent is $3n$, so it steps by $3$: $1+\frac14(x+3)^3+\frac29(x+3)^6$.

If you only know $R$, you know the open interval $(c-R,c+R)$ for sure. That is the **smallest** interval. Each endpoint you are told converges gets added with a bracket.

HW1 P2: centre $-4$, $R=2$, converges at the upper end. Open part $(-6,-2)$, plus the upper endpoint: $(-6,-2]$, i.e. $-6<x\le-2$. With $R=\infty$: $(-\infty,\infty)$. With $R=0$: only the centre.`,
      // src: HW1 P2, HW1 P3
      try: { q: R`A series centred at $-4$ has $R=2$ and converges at its upper endpoint. What is the smallest interval of convergence?`, choices: [
        { t: R`$(-6,-2]$`, ok: true, why: R`The open interval $(-6,-2)$ is guaranteed, and the upper endpoint $-2$ is added.` },
        { t: R`$[-6,-2]$`, why: R`Nothing says the lower endpoint converges. The smallest interval leaves out any endpoint you are not told about.` },
        { t: R`$(-6,-2)$`, why: R`You were told the upper endpoint converges, so $-2$ belongs. Add it with a bracket.` },
        { t: R`$[-6,-2)$`, why: R`Wrong end: you included the lower one. Upper is the larger value, $-2$.` },
      ] },
    },
    {
      h: 'Differentiate and integrate term by term',
      body: R`Inside its radius a power series can be differentiated or integrated one term at a time. The radius stays the same. The endpoints can change, so test them again.

**Differentiate** $\displaystyle f(x)=\sum_{n=1}^{\infty}(-1)^n5^nx^n$. Bring the exponent down as a factor and lower it by $1$: $f'(x)=\displaystyle\sum_{n=1}^{\infty}(-1)^n5^n\,n\,x^{n-1}$. The start stays $n=1$ here, because the $n=0$ term would be a constant and is gone anyway.

Index shift (optional, for a plain $x^k$): let $k=n-1$. Then $f'(x)=\sum_{k=0}^{\infty}(-5)^{k+1}(k+1)x^k=-5+50x-375x^2+\cdots$.

**Integrate** $\displaystyle f(x)=\sum_{n=0}^{\infty}(-1)^n5x^{5n+4}$. Raise the exponent by $1$ and divide by the new exponent: $\frac{5x^{5n+5}}{5n+5}=\frac{x^{5n+5}}{n+1}$. So $\int f\,dx=\displaystyle\sum_{n=0}^{\infty}\frac{(-1)^nx^{5n+5}}{n+1}+C$.`,
      // src: HW1 P13, HW1 P14
      try: { q: R`Differentiate $\displaystyle\sum_{n=1}^{\infty}(-1)^n5^nx^n$ term by term. Which is $f'(x)$?`, choices: [
        { t: R`$\displaystyle\sum_{n=1}^{\infty}(-1)^n5^n\,n\,x^{n-1}$`, ok: true, why: R`Bring down $n$ and lower the exponent to $n-1$. The $n=1$ term is $-5$.` },
        { t: R`$\displaystyle\sum_{n=1}^{\infty}(-1)^n5^n\,x^{n-1}$`, why: R`The factor $n$ from the power rule is missing. Every term picks up its old exponent.` },
        { t: R`$\displaystyle\sum_{n=1}^{\infty}(-1)^n5^n\,n\,x^{n}$`, why: R`The exponent did not drop. After differentiating it is $n-1$.` },
        { t: R`$\displaystyle\sum_{n=0}^{\infty}(-1)^n5^n\,n\,x^{n-1}$`, why: R`Starting at $n=0$ puts $0\cdot x^{-1}$ in the sum. The original starts at $n=1$, so keep it.` },
      ] },
    },
    {
      h: 'Multiplying two series: first terms',
      body: R`HW1 asks for the first four nonzero terms of $f(x)g(x)$. Write out both series, then collect powers of $x$. This is the Cauchy product: the coefficient of $x^k$ is the sum of (term of $f$)$\times$(term of $g$) over every pair whose powers add to $k$.

$f(x)=\sum 6(n+1)x^n=6+12x+18x^2+24x^3+\cdots$.
$g(x)=\sum n^2(-x)^n=0-x+4x^2-9x^3+16x^4-\cdots$ (the $n=0$ term is $0$).

Lowest power: $x^1$ from $6\cdot(-x)$. So the product starts at $x$.`,
      // src: HW1 P15
      try: { q: R`In $f(x)g(x)$ above, what is the coefficient of $x^2$?`, choices: [
        { t: R`$12$`, ok: true, why: R`Pairs that add to $x^2$: $6\cdot4x^2$ and $12x\cdot(-x)$. That is $24-12=12$.` },
        { t: R`$24$`, why: R`You used only $6\cdot4x^2$. The pair $12x\cdot(-x)$ also gives $x^2$.` },
        { t: R`$36$`, why: R`Sign slip: $12x\cdot(-x)=-12x^2$, not $+12x^2$. So $24-12$, not $24+12$.` },
        { t: R`$-12$`, why: R`You kept only the cross term $12x\cdot(-x)$ and missed $6\cdot4x^2=24x^2$.` },
      ] },
    },
  ],
  cards: [
    { f: R`Centre of $\sum a_n(x-c)^n$?`, b: R`Set the bracket to $0$. $(x+5)^n$ gives $c=-5$. Always converges at the centre.` },
    { f: R`Radius facts: shape of the convergence set`, b: R`Three shapes: $\{c\}$ ($R=0$), centred interval ($0<R<\infty$), whole line ($R=\infty$). Given the interval: centre = midpoint, $R$ = half the width.` },
    { f: R`Factorial on top vs bottom?`, b: R`Bottom ($x^n/n!$): $R=\infty$. Top ($n!x^n$, $(2n)!x^n$): $R=0$. Compare sizes, e.g. $\frac{n!}{(2n)!}$ gives $R=\infty$.` },
    { f: R`The Ratio Test limit is $1$ at an endpoint. Now what?`, b: R`The test says nothing. Substitute the endpoint, simplify to a number series, pick a test.` },
    { f: R`Endpoint test choices`, b: R`Positive terms: $p$-series ($\frac1n$ diverges, $\frac1{n^2}$ and $\frac1{n^{p>1}}$ converge), geometric, or Divergence Test. Alternating: AST ($b_n\downarrow0$).` },
    { f: R`Left endpoint sign trap`, b: R`$(-k)^n=(-1)^nk^n$. Split before cancelling. With an extra $(-1)^n$ in front, the signs can cancel to $+$ and give $\sum\frac1n$.` },
    { f: R`$|ax+b|<k$ or $(x-c)^{2n}$: reading $R$`, b: R`Solve to $x$ first and take half the width (divide by $a$). For $4^n(x-2)^{2n}$: $4|x-2|^2<1$ gives $R=\frac12$; both endpoints give the same series.` },
    { f: R`Differentiate or integrate a power series: what changes?`, b: R`Radius stays the same. Endpoints can change: retest. Differentiate: bring down $n$, exponent $-1$. Integrate: exponent $+1$, divide by it, add $+C$.` },
    { f: R`Smallest interval from $R$ alone`, b: R`Only the open interval $(c-R,c+R)$ is certain. Add an endpoint only if told it converges.` },
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
      ask: [{ at: 5, q: R`Before the $x=-2$ step: what does $\sum\frac{(-3)^n}{\sqrt n\,3^n}$ turn into?`, choices: [
        { t: R`$\sum\frac{(-1)^n}{\sqrt n}$, which converges by the AST`, ok: true, why: R`$(-3)^n=(-1)^n3^n$, the $3^n$ cancels, and $\frac1{\sqrt n}$ decreases to $0$.` },
        { t: R`$\sum\frac1{\sqrt n}$, which diverges`, why: R`The sign was lost. $(-3)^n$ keeps its $(-1)^n$.` },
        { t: R`Inconclusive, because the ratio limit is $1$`, why: R`The Ratio Test is inconclusive, but the number series is not. You can decide it by the AST.` },
      ] }],
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
    {
      // src: buddy Q3 (student boxed [-7,-3]; x=-7 is harmonic and diverges)
      q: R`Find the centre, radius and interval of convergence of $\displaystyle\sum_{n=1}^{\infty}\frac{(-1)^n}{n\,2^n}(x+5)^n$.`,
      steps: [
        R`Centre: $x+5=0$, so $c=-5$.`,
        R`Ratio Test: $\displaystyle\lim_{n\to\infty}\left|\frac{(x+5)^{n+1}}{(x+5)^n}\cdot\frac{n}{n+1}\cdot\frac{2^n}{2^{n+1}}\right|=\frac{|x+5|}{2}$.`,
        R`Need $\frac{|x+5|}{2}<1$: $-2<x+5<2$, so $-7<x<-3$. $R=2$.`,
        R`$x=-3$: $x+5=2$, so $\sum\frac{(-1)^n2^n}{n\,2^n}=\sum\frac{(-1)^n}{n}$. $\frac1n\to0$ and decreases, so it converges by the AST. Include $-3$.`,
        R`$x=-7$: $x+5=-2$, so $(-1)^n(-2)^n=(-1)^n(-1)^n2^n=2^n$. The series is $\sum\frac{1}{n}$, the harmonic series. $p=1\le1$, so it diverges. Leave $-7$ out.`,
        R`Interval of convergence: $(-7,-3]$, i.e. $-7<x\le-3$.`,
      ],
      ask: [
        { at: 5, q: R`Before the $x=-7$ step: the series becomes $\sum\frac{1}{n}$. What is the verdict?`, choices: [
          { t: R`Diverges: harmonic series, $p=1\le1$`, ok: true, why: R`The two $(-1)^n$ factors multiply to $+1$, leaving the plain harmonic series.` },
          { t: R`Converges by the $p$-test (harmonic series)`, why: R`This is the exam slip. The $p$-test converges only for $p>1$, and $p=1$ diverges.` },
          { t: R`Converges by the AST`, why: R`There is no alternating sign left at $x=-7$. $(-1)^n(-2)^n$ is positive.` },
        ] },
        { at: 6, q: R`Before the final line: $-3$ converges, $-7$ diverges. Which interval?`, choices: [
          { t: R`$(-7,-3]$`, ok: true, why: R`Bracket the endpoint that converges ($-3$), parenthesis on the one that diverges ($-7$).` },
          { t: R`$[-7,-3]$`, why: R`The student boxed this. It copies the open interval's ends as closed and ignores the $x=-7$ divergence.` },
          { t: R`$[-7,-3)$`, why: R`Brackets swapped. $-7$ diverges, so it gets the parenthesis.` },
        ] },
      ],
      note: R`Scored 13/16 on the buddy exam: the last line lost 3 points for exactly this endpoint.`,
    },
    {
      // src: HW1 P12
      q: R`Find the centre, radius and interval of convergence of $\displaystyle\sum_{n=1}^{\infty}\frac{4^n}{n}(x-2)^{2n}$.`,
      steps: [
        R`Centre: $x-2=0$, so $c=2$.`,
        R`Ratio Test: $\displaystyle\lim_{n\to\infty}\left|\frac{4^{n+1}(x-2)^{2n+2}}{n+1}\cdot\frac{n}{4^n(x-2)^{2n}}\right|=4\,|x-2|^2$.`,
        R`Need $4|x-2|^2<1$: $|x-2|<\frac12$. So $R=\frac12$ and $\frac32<x<\frac52$.`,
        R`$x=\frac52$: $x-2=\frac12$, so $(x-2)^{2n}=4^{-n}$ and the series is $\sum\frac1n$: diverges.`,
        R`$x=\frac32$: $x-2=-\frac12$, and $\left(-\frac12\right)^{2n}=4^{-n}$ again. The series is $\sum\frac1n$: diverges.`,
        R`Interval of convergence: $\left(\frac32,\frac52\right)$.`,
      ],
      ask: [{ at: 5, q: R`At $x=\frac32$ the bracket is $-\frac12$. Does the series alternate?`, choices: [
        { t: R`No: the exponent $2n$ is even, so the sign is $+$ and it is $\sum\frac1n$`, ok: true, why: R`$(-\frac12)^{2n}=\left(\frac14\right)^n>0$. An even power kills the sign.` },
        { t: R`Yes: negative bracket, so it converges by the AST`, why: R`A negative base only alternates with an odd-type exponent like $n$. With $2n$ it does not.` },
      ] }],
      note: R`Even exponent means both endpoints give the same series.`,
    },
    {
      // src: HW1 P13, P14
      q: R`(a) Differentiate $\displaystyle f(x)=\sum_{n=1}^{\infty}(-1)^n5^nx^n$. (b) Integrate $\displaystyle g(x)=\sum_{n=0}^{\infty}(-1)^n5x^{5n+4}$.`,
      steps: [
        R`(a) Differentiate each term: $\frac{d}{dx}x^n=n\,x^{n-1}$.`,
        R`$f'(x)=\displaystyle\sum_{n=1}^{\infty}(-1)^n5^n\,n\,x^{n-1}=-5+50x-375x^2+\cdots$.`,
        R`(b) Integrate each term: raise the exponent $5n+4$ to $5n+5$ and divide by $5n+5$.`,
        R`$\int5x^{5n+4}dx=\frac{5x^{5n+5}}{5n+5}=\frac{x^{5n+5}}{n+1}$.`,
        R`$\int g\,dx=\displaystyle\sum_{n=0}^{\infty}\frac{(-1)^nx^{5n+5}}{n+1}+C$.`,
      ],
      ask: [{ at: 3, q: R`After raising the exponent, what do you divide $5x^{5n+4}$'s new term by?`, choices: [
        { t: R`The new exponent $5n+5$, giving $\frac{x^{5n+5}}{n+1}$`, ok: true, why: R`Reverse of the power rule: divide by the exponent you just made. The $5$ in front cancels with $5n+5=5(n+1)$.` },
        { t: R`The old exponent $5n+4$`, why: R`Dividing by the old exponent is the derivative direction. After integrating, divide by $5n+5$.` },
        { t: R`Nothing; just raise the exponent`, why: R`Raising the exponent alone gives $x^{5n+5}$ with the wrong coefficient. The $\frac1{5n+5}$ is required.` },
      ] }],
      note: R`Radius is unchanged by both operations. Retest the endpoints for the new series.`,
    },
    {
      // src: HW1 P15
      q: R`Find the first four nonzero terms of $f(x)g(x)$, where $f(x)=\displaystyle\sum_{n=0}^{\infty}6(n+1)x^n$ and $g(x)=\displaystyle\sum_{n=0}^{\infty}n^2(-x)^n$.`,
      steps: [
        R`Write out $f$: $6+12x+18x^2+24x^3+\cdots$.`,
        R`Write out $g$: $0-x+4x^2-9x^3+16x^4-\cdots$. The $n=0$ term is $0$.`,
        R`$x^1$: only $6\cdot(-x)=-6x$.`,
        R`$x^2$: $6\cdot4x^2+12x\cdot(-x)=24x^2-12x^2=12x^2$.`,
        R`$x^3$: $6(-9)+12(4)+18(-1)=-54+48-18=-24$. $x^4$: $6(16)+12(-9)+18(4)+24(-1)=96-108+72-24=36$.`,
        R`Product: $-6x+12x^2-24x^3+36x^4+\cdots$.`,
      ],
      ask: [{ at: 3, q: R`Which product gives the lowest power of $x$?`, choices: [
        { t: R`$6\cdot(-x)$, giving $x^1$`, ok: true, why: R`$g$ has no constant term, so the lowest power in $fg$ is $x^1$.` },
        { t: R`$6\cdot0$, giving a constant`, why: R`$6\cdot0=0$ is not a nonzero term. List only nonzero terms.` },
        { t: R`$12x\cdot(-x)$, giving $x^2$`, why: R`That is real but not lowest. $6\cdot(-x)$ already gives $x^1$.` },
      ] }],
      note: R`Collect by the power of $x$, not by which series the term came from.`,
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
