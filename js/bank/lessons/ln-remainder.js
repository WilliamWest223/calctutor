// js/bank/lessons/ln-remainder.js — Taylor Remainder Theorem (run fin). Contract: .hnic/context/fin-contract.md
const R = String.raw;
const para = (...a) => a.join('\n\n');
const U = 'series', T = 'Taylor Polynomials & Error';

export default {
  id: 'ln-remainder',
  goal: R`Write the Taylor remainder $R_n(x)$ correctly, bound it on an interval to get the largest possible error, and find how many terms you need for a given accuracy.`,
  why: R`An Exam 3 question every semester: "If one uses $T_2(x)$ to approximate $f(x)$ on $(-1,1)$, what is the largest possible error?" It also shows up as "how many terms do you need so the error is less than $0.001$?"`,
  plain: para(
    R`A Taylor polynomial is a stand-in for a hard function. Your calculator does not know $\sqrt[3]{8.1}$ by magic. You can use a short polynomial $T_2(x)$ instead, and get about $2.0083$. But a stand-in is never perfect. There is always some leftover gap between the true value and the guess.`,
    R`That gap is called the remainder, or the error. In class the true gap for $\sqrt[3]{8.1}$ was about $0.00000024$. Usually you cannot compute the gap exactly, because you would need the true value first. If you had it, you would not need the approximation.`,
    R`So this lesson answers a smaller question: how BIG can the gap possibly be? You find a guaranteed ceiling on the error. Think of a weather app that says "at most 2 inches of rain". You do not know the exact amount, but you know it will not be more.`,
    R`The Taylor Remainder Theorem gives you that ceiling. It looks almost like the next term of the series. The one twist is a mystery number $\xi$ somewhere between the centre and $x$. You never find $\xi$. You just assume the worst case for it.`,
  ),
  prereq: [
    { term: R`Taylor polynomial $T_n(x)$`, means: R`The series for $f$ about centre $c$, cut off after the $(x-c)^n$ term: $T_n(x)=\sum_{k=0}^{n}\frac{f^{(k)}(c)}{k!}(x-c)^k$. The number $n$ is the degree.` },
    { term: R`$f^{(k)}$`, means: R`The $k$-th derivative of $f$. So $f^{(3)}=f'''$.` },
    { term: 'factorial $k!$', means: R`$k!=1\cdot2\cdots k$. So $3!=6$, $4!=24$, $5!=120$, $6!=720$, $7!=5040$.` },
    { term: 'increasing / decreasing', means: R`An increasing function is biggest at the right end of an interval; a decreasing one is biggest at the left end.` },
    { term: 'absolute value', means: R`$|a|$ is the size of $a$ with the sign dropped. $|x-c|$ is the distance from $x$ to $c$.` },
  ],
  sections: [
    {
      h: 'What is the remainder?',
      body: para(
        R`Start with a number. $e^{x}$ near $0$ has $T_1(x)=1+x$. At $x=0.1$ the guess is $1.1$, but the true value is $e^{0.1}\approx1.10517$. The gap is about $0.00517$.`,
        R`That gap has a name. The **remainder** is $R_n(x)=f(x)-T_n(x)$: true value minus the degree-$n$ guess. "Error" means the size $|R_n(x)|$.`,
        R`In words: the remainder is everything the polynomial left out. At the centre $x=c$ the polynomial is exact, so $R_n(c)=0$. The farther you go from $c$, the bigger the gap usually gets.`,
      ),
      check: { q: R`If $f(2)=7.4$ and $T_3(2)=7.0$, what is $R_3(2)$?`, a: R`$R_3(2)=f(2)-T_3(2)=7.4-7.0=0.4$.` },
    },
    {
      h: 'The formula and its mystery number',
      body: para(
        R`The Taylor Remainder Theorem (T.R.T.) says: if $f^{(n+1)}$ is continuous on an interval holding $c$ and $x$, then $R_n(x)=\dfrac{f^{(n+1)}(\xi)}{(n+1)!}(x-c)^{n+1}$ for some number $\xi$ ("xi") between $x$ and $c$.`,
        R`Read it piece by piece. It uses the NEXT derivative, number $n+1$. It divides by $(n+1)!$. It has the power $(x-c)^{n+1}$. So for $T_2$ you need $f'''$, $3!$ and $(x-c)^3$.`,
        R`Why does it look like the next term of the series? Because the next term is the biggest piece $T_n$ left out. The theorem says the whole leftover acts like that one term, if you plug in the right point $\xi$ instead of $c$.`,
        R`The subtle part: $\xi$ is NOT $c$. Putting $\xi=c$ gives the next term, which is a different number. He tests exactly this.`,
      ),
      check: { q: R`Write $R_4(x)$ for a function about centre $c$.`, a: R`$R_4(x)=\dfrac{f^{(5)}(\xi)}{5!}(x-c)^{5}$, $\xi$ between $x$ and $c$.` },
      widget: { lab: 'remainder', set: { fn: 'e^x', n: 2, r: 1 }, caption: R`Here $f=e^{x}$, $n=2$, $r=1$. The bound at the edge is $\frac{e}{6}\approx0.453$. The true error stays under it. Raise $n$ and both shrink.` },
      // src: HW2 P1, buddy Q5(b)
      try: { q: R`Spot the right remainder: $T_3(x)$ for $\ln x$ centred at $4$.`,
        choices: [
          { t: R`$\dfrac{f^{(4)}(\xi)}{4!}(x-4)^{4}$`, ok: true, why: R`Degree $n=3$, so derivative, factorial and power all use $n+1=4$. The centre is $4$ and $\xi$ is the unknown point.` },
          { t: R`$\dfrac{f^{(3)}(\xi)}{3!}(x-4)^{3}$`, why: R`That uses $n$, not $n+1$. It is the degree-3 term, which $T_3$ already holds.` },
          { t: R`$\dfrac{f^{(4)}(\xi)}{4!}(x-\xi)^{4}$`, why: R`The power uses the centre $4$, not $\xi$. The buddy wrote $(x-c)$ here, mixing up the centre with the mystery point.` },
          { t: R`$\dfrac{f^{(4)}(4)}{4!}(x-4)^{4}$`, why: R`The derivative sits at $\xi$, not at the centre. At the centre it is just the next series term.` },
        ] },
    },
    {
      h: 'You bound it, you never evaluate it',
      body: para(
        R`You do not know $\xi$. So you cannot compute $R_n$. Instead you ask: what is the worst $\xi$ could do?`,
        R`Let $M$ be a number with $|f^{(n+1)}(\xi)|\le M$ for every $\xi$ in the interval. Then $|R_n(x)|\le\dfrac{M}{(n+1)!}|x-c|^{n+1}$. This is the form he writes in red in lecture.`,
        R`In words: largest the derivative can be, times largest the distance power can be, divided by the factorial. That number is the **max error**. The real error is at most this big, and is often smaller.`,
        R`Why is this allowed? Making each top piece as large as it can be only makes the fraction larger. So the result is a safe ceiling.`,
      ),
      check: { q: R`If $M=6$, $n=2$ and $|x-c|\le1$, what is the max error?`, a: R`$\dfrac{6}{3!}\cdot1^{3}=1$.` },
    },
    {
      h: 'Finding M: the biggest the derivative gets',
      body: para(
        R`First write $f^{(n+1)}$ as a formula. Then ask where on the interval its size is largest.`,
        R`Three common cases. **$e^{x}$:** every derivative is $e^{x}$, which increases, so $M$ is $e^{\text{right end}}$. On $(-1,1)$ that is $M=e$. **$\sin x$, $\cos x$:** every derivative is $\pm\sin$ or $\pm\cos$, so $M=1$ always works. **Negative powers** like $\frac{10}{27}x^{-8/3}$: this decreases as $x$ grows, so the largest value is at the LEFT end.`,
        R`Do not plug in the centre unless the centre really is where the derivative is largest. For $e^{x}$ on $(-1,1)$, using $\xi=0$ gives $1$, which is too small and not a valid bound.`,
      ),
      check: { q: R`$f(x)=e^{x}$, $T_2$, interval $[0,2]$. What is $M$ for $|f'''(\xi)|$?`, a: R`$f'''=e^{x}$ increases, so $M=e^{2}$.` },
      widget: { lab: 'remainder', set: { fn: '1/x at 1', n: 1, r: 0.5 }, caption: R`$f=\frac1x$, $n=1$: $f''=\frac{2}{x^{3}}$ falls as $x$ grows. Read the readout: $M=16$ sits at the LEFT end $x=0.5$, and the bound at the edge is $2$.` },
      // src: buddy Q5(b)
      try: { q: R`$T_1$ for $\ln x$ about $4$ on $[4,5]$. What is the smallest valid $M$ for $|f''(\xi)|$?`,
        choices: [
          { t: R`$\dfrac1{16}$`, ok: true, why: R`$|f''|=\frac1{\xi^{2}}$ falls as $\xi$ grows, so the max is at the left end $\xi=4$: $\frac1{16}$.` },
          { t: R`$\dfrac1{25}$`, why: R`You used the right end. $\frac1{\xi^{2}}$ decreases, so the largest value is at the LEFT end.` },
          { t: R`$\dfrac14$`, why: R`That is $f'(4)$, the wrong derivative. Degree $1$ needs $f''$.` },
          { t: R`$\dfrac1{32}$`, why: R`That is $M$ already divided by $2!$. Keep $M$ alone; divide by the factorial in the next step.` },
        ] },
    },
    {
      h: 'Finding the biggest distance |x - c|',
      body: para(
        R`The second piece is $|x-c|^{n+1}$. You want the largest distance from the centre to any point of the interval.`,
        R`His example: centre $c=8$, interval $[5,17]$. Distance to $5$ is $3$. Distance to $17$ is $9$. The farther end wins, so $|x-c|\le9$ and $|x-c|^3\le9^3$.`,
        R`If you approximate one number, like $\sqrt[3]{8.1}$ with $c=8$, the "interval" is just from $8$ to $8.1$. Then $|x-c|=0.1$. On $(-1,1)$ with $c=0$, $|x|<1$, so $|x|^{n+1}<1$.`,
        R`Note: $M$ and the distance are two separate maximums. They may happen at different ends. That is fine; the bound is still safe.`,
      ),
      check: { q: R`Centre $c=2$, interval $[0,3]$. Largest $|x-c|$?`, a: R`Distances are $2$ and $1$, so $2$.` },
      // src: buddy Q5(c)
      try: { q: R`Centre $c=4$, interval $[2,5]$, $n=1$. What is the largest $|x-4|^{n+1}$?`,
        choices: [
          { t: R`$4$`, ok: true, why: R`Distance to $2$ is $2$, to $5$ is $1$. Largest is $2$, and $2^{2}=4$.` },
          { t: R`$1$`, why: R`You took the near end $5$. The bound needs the farthest end, $2$.` },
          { t: R`$9$`, why: R`$3$ is the interval length $5-2$. Measure from the centre, not across.` },
          { t: R`$2$`, why: R`That is the distance, but the power $n+1=2$ is still missing: $2^{2}=4$.` },
        ] },
    },
    {
      h: 'Reverse question: how many terms?',
      body: para(
        R`Sometimes $n$ is the unknown. "How large must $n$ be so the error is less than $0.001$?"`,
        R`Write the bound with $n$ still a letter. For $\sin x$ at $x=1$: $|R_n(1)|\le\frac{1}{(n+1)!}$. Then try $n=1,2,3,\dots$ until the bound drops below the target.`,
        R`$n=5$ gives $\frac1{720}\approx0.00139$, too big. $n=6$ gives $\frac1{5040}\approx0.000198$, small enough. So $n=6$.`,
        R`Why test numbers? Factorials have no easy inverse, so a table is the honest way. He does the same in lecture, listing $n$ next to "max error". Use $(n+1)!$, not $n!$, or you end one degree off.`,
      ),
      check: { q: R`Bound is $\frac{1}{(n+1)!}$. Smallest $n$ with bound $<\frac1{100}$?`, a: R`$4!=24$ fails, $5!=120$ works, so $n+1=5$, $n=4$.` },
      widget: { lab: 'remainder', set: { fn: 'ln(1+x)', n: 3, r: 0.5 }, caption: R`$\ln(1+x)$, $n=3$, $r=0.5$: $f^{(4)}=-\frac{6}{(1+x)^4}$, biggest at the left end $x=-0.5$ where $M=96$. Bound at the edge: $\frac{96}{4!}\cdot\frac1{16}=\frac14$.` },
      // src: HW2 P7 style, no calculator (e<3)
      try: { q: R`$e^{x}$ about $0$ on $[0,1]$. Use $M=3$ (since $e<3$). Smallest degree $n$ with error bound under $\frac1{1000}$?`,
        choices: [
          { t: R`$n=6$`, ok: true, why: R`Need $\frac{3}{(n+1)!}<\frac1{1000}$, so $(n+1)!>3000$. $6!=720$ fails, $7!=5040$ works, so $n+1=7$, $n=6$.` },
          { t: R`$n=7$`, why: R`You solved $n!>3000$ and stopped at $7!$. The bound has $(n+1)!$, so $n+1=7$.` },
          { t: R`$n=5$`, why: R`$n=5$ gives $\frac{3}{6!}=\frac{3}{720}$, about $0.004$, still too big.` },
          { t: R`$5040$`, why: R`$5040$ is the factorial, not $n$. Read off $n+1=7$.` },
        ] },
      // src: HW2 P8 (answered 6, marked wrong: terms vs degree)
      try: { q: R`The degree needed for $e^{0.2}$ is $n=6$ (bound about $3\times10^{-9}$; $n=5$ gives about $1.09\times10^{-7}$, too big for $10^{-7}$). How many TERMS of the series is that?`,
        choices: [
          { t: R`$7$`, ok: true, why: R`Degree $6$ uses powers $x^0$ through $x^6$: $7$ terms.` },
          { t: R`$6$`, why: R`That is the degree. Counting the constant term, degree $6$ has $7$ terms. This is the HW2 P8 miss.` },
          { t: R`$5$`, why: R`$n=5$ still has bound near $1.09\times10^{-7}$, above $10^{-7}$, and it is also a degree, not a count.` },
          { t: R`$8$`, why: R`That counts $x^{7}$, which is the remainder's power, not part of $T_6$.` },
        ] },
    },
    {
      h: 'Does the series equal the function?',
      body: para(
        R`A Taylor series can converge and still not equal $f$. The series equals $f(x)$ exactly when $R_n(x)\to0$ as $n\to\infty$. This is the "$R\equiv0$?" question he asks at the top of the notes.`,
        R`For $e^{x}$, $\sin x$ and $\cos x$ it works for every $x$. Example: for $\cos x$, $|R_n(x)|\le\frac{|x|^{n+1}}{(n+1)!}$, and factorials grow faster than any power, so this goes to $0$.`,
        R`It can fail. The function $g(x)=e^{-1/x}$ for $x>0$ and $g(x)=0$ for $x\le0$ has every derivative $0$ at the origin. Its Maclaurin series is all zeros, so it equals $g$ only for $x\le0$, not for any $x>0$.`,
      ),
      check: { q: R`True or false: if the Taylor series of $f$ converges at $x$, it equals $f(x)$.`, a: R`False. You also need $R_n(x)\to0$; $e^{-1/x}$ is a counterexample.` },
    },
  ],
  cards: [
    { f: R`$R_n(x)=$ ?`, b: R`$\dfrac{f^{(n+1)}(\xi)}{(n+1)!}(x-c)^{n+1}$, $\xi$ between $x$ and $c$` },
    { f: R`Bound form: $|R_n(x)|\le$ ?`, b: R`$\dfrac{M}{(n+1)!}|x-c|^{n+1}$, with $M\ge|f^{(n+1)}|$ on the interval` },
    { f: R`$M$ for $e^{x}$ on an interval?`, b: R`$e^{\text{right end}}$ (increasing, so biggest at the right)` },
    { f: R`$M$ for $\sin x$ or $\cos x$?`, b: R`$M=1$ for every derivative` },
    { f: R`$M$ for a negative power like $x^{-k}$?`, b: R`Decreasing, so biggest at the LEFT end of the interval` },
    { f: R`Degree $n$ versus number of terms?`, b: R`Terms $=n+1$ (powers $x^0$ to $x^n$)` },
  ],
  recipe: [
    R`Identify $f$, centre $c$, degree $n$, and the interval (or the single $x$).`,
    R`Write $R_n(x)=\dfrac{f^{(n+1)}(\xi)}{(n+1)!}(x-c)^{n+1}$, $\xi$ between $x$ and $c$.`,
    R`Compute $f^{(n+1)}$ as a formula.`,
    R`Find $M$: the largest $|f^{(n+1)}|$ on the interval (check which end; not automatically the centre).`,
    R`Find the largest $|x-c|$ on the interval and raise it to the power $n+1$.`,
    R`Max error $=\dfrac{M}{(n+1)!}\cdot\max|x-c|^{n+1}$.`,
    R`For "how many terms": keep $n$ as a letter and test $n=1,2,\dots$ until the bound is below the target.`,
  ],
  worked: [
    {
      q: R`(Lecture 11-10.) $T_2(x)=2+\frac1{12}(x-8)-\frac1{288}(x-8)^2$ approximates $\sqrt[3]{x}$ at $c=8$. Bound the error in $\sqrt[3]{8.1}\approx T_2(8.1)$.`,
      steps: [
        R`Degree $n=2$, so the remainder uses $f'''$ and $3!$: $|R_2|=\left|\dfrac{f'''(\xi)}{3!}(8.1-8)^{3}\right|$, $\xi$ between $8$ and $8.1$.`,
        R`Differentiate $x^{1/3}$ three times: $f'=\frac13x^{-2/3}$, $f''=-\frac29x^{-5/3}$, $f'''=\frac{10}{27}x^{-8/3}$.`,
        R`$x^{-8/3}$ decreases, so the largest value on $[8,8.1]$ is at $\xi=8$: $M=\frac{10}{27}\cdot8^{-8/3}=\frac{10}{27}\cdot\frac1{256}$ (since $8^{8/3}=2^{8}=256$).`,
        R`Distance: $|8.1-8|^3=\left(\frac1{10}\right)^3=\frac1{1000}$.`,
        R`Multiply: $\dfrac{10}{27}\cdot\dfrac16\cdot\dfrac1{1000}\cdot\dfrac1{256}=\dfrac1{4147200}\approx0.000000241$.`,
      ],
      note: R`The true error was about $0.000000239$, just under the bound. That is what a bound should do.`,
    },
    {
      q: R`How large must $n$ be so that $T_n(x)$ for $\sin x$ at $c=0$ approximates $\sin(1)$ with error less than $0.001$?`,
      steps: [
        R`Every derivative of $\sin$ is $\pm\sin$ or $\pm\cos$, so $|f^{(n+1)}(\xi)|\le1$: take $M=1$.`,
        R`Distance: $|1-0|^{n+1}=1$. So $|R_n(1)|\le\dfrac{1}{(n+1)!}$.`,
        R`Test $n=5$: $\frac1{6!}=\frac1{720}\approx0.00139$. That is bigger than $0.001$, not enough.`,
        R`Test $n=6$: $\frac1{7!}=\frac1{5040}\approx0.000198<0.001$. So $n=6$.`,
      ],
      note: R`$T_6=T_5$ for sine (there is no $x^6$ term), so $T_5$ already has error under $0.000198$.`,
    },
    {
      q: R`(Spring 2025 Exam 3, Q7.) Let $T_2(x)$ be the degree 2 Taylor polynomial for $f(x)=e^{x}$ centered at $x=0$. If one uses $T_2(x)$ to approximate $f(x)$ on $(-1,1)$, what is the largest possible error?`,
      steps: [
        R`Write the remainder: $R_2(x)=\dfrac{f'''(\xi)}{3!}x^{3}$ for some $\xi$ between $x$ and $0$.`,
        R`Every derivative of $e^{x}$ is $e^{x}$, so $f'''(\xi)=e^{\xi}$.`,
        R`Bound the derivative: $|\xi|<1$ and $e^{x}$ increases, so $e^{\xi}<e^{1}=e$. Take $M=e$.`,
        R`Bound the distance: $|x|<1$, so $|x|^{3}<1$.`,
        R`Multiply: $|R_2(x)|<\dfrac{e\cdot1}{3!}=\dfrac{e}{6}\approx0.453$.`,
      ],
      // src: buddy Q5 M step, applied to e^x (Spring 2025 Exam 3 Q7)
      ask: [
        { at: 3, q: R`$f'''(\xi)=e^{\xi}$ with $|\xi|<1$. Which $M$ is the smallest valid one?`, choices: [
          { t: R`$e$`, ok: true, why: R`$e^{\xi}$ increases, so the max is at the right end $\xi=1$.` },
          { t: R`$1$`, why: R`That is $e^{0}$, the centre. $\xi$ can be near $1$, where $e^{\xi}$ is larger.` },
          { t: R`$\frac1e$`, why: R`That is the left end. An increasing function peaks at the RIGHT end.` },
        ] },
      ],
      note: R`Using $\xi=0$ would give $\frac16$: smaller, and not a valid bound.`,
    },
    {
      // src: buddy Q5 (Spring 2026 Exam 3)
      q: R`(Buddy Exam 3, Q5.) (a) Find $T_1(x)$ for $\ln x$ at $c=4$. (b) Max error approximating $\ln5$ by $T_1(5)$. (c) Max error approximating $\ln x$ by $T_1$ on $[2,5]$.`,
      steps: [
        R`(a) $f(4)=\ln4$, $f'(4)=\frac14$. So $T_1(x)=\ln4+\frac14(x-4)$.`,
        R`Remainder: $n=1$, so use $f''$, $2!$ and $(x-4)^2$. $f''(x)=-\frac1{x^{2}}$, so $|R_1|=\frac{1}{2\xi^{2}}|x-4|^{2}$.`,
        R`(b) $\xi$ lies in $[4,5]$. $\frac1{\xi^{2}}$ decreases, so the max is at the left end: $M=\frac1{16}$.`,
        R`Distance: $|5-4|^{2}=1$. Error $\le\frac{1/16}{2}\cdot1=\frac1{32}$.`,
        R`(c) Now $\xi$ lies in $[2,5]$. The max of $\frac1{\xi^{2}}$ is at the left end $\xi=2$: $M=\frac14$.`,
        R`Distances from $4$: to $2$ it is $2$, to $5$ it is $1$. Largest $|x-4|^{2}=4$.`,
        R`Error $\le\frac{1/4}{2}\cdot4=\frac12$.`,
      ],
      ask: [
        { at: 3, q: R`Part (b): what is $M$ for $|f''|=\frac1{\xi^{2}}$ with $\xi\in[4,5]$?`, choices: [
          { t: R`$\frac1{16}$`, ok: true, why: R`Decreasing, so the left end $\xi=4$ gives $\frac1{16}$.` },
          { t: R`$\frac1{25}$`, why: R`That is the right end. A decreasing function peaks at the left.` },
          { t: R`$\frac14$`, why: R`That is $f'(4)$, not $|f''|$.` },
        ] },
        { at: 5, q: R`Part (c): the interval is now $[2,5]$. What is $M$?`, choices: [
          { t: R`$\frac14$`, ok: true, why: R`Left end $\xi=2$: $\frac1{4}$.` },
          { t: R`$\frac1{16}$`, why: R`That was part (b)'s interval. Here the left end moved to $2$, so $M$ grows.` },
          { t: R`$\frac1{25}$`, why: R`Right end of a decreasing function gives the smallest value, not the largest.` },
        ] },
      ],
      note: R`Check: the true error at $\ln5$ is $|\ln5-\ln4-\frac14|\approx0.0269$, under $\frac1{32}=0.03125$.`,
    },
  ],
  exam: [
    R`If one uses $T_2(x)$ to approximate $f(x)$ on $(-1,1)$, what is the largest possible error? (Exam 3 Q6/Q7 pattern)`,
    R`Use Taylor's inequality / the Taylor Remainder Theorem to bound $|R_n(x)|$ on the given interval.`,
    R`Approximate a value like $\sqrt[3]{8.1}$ with $T_2$, then give the max error.`,
    R`How many terms are needed to guarantee error less than $0.001$?`,
    R`True or false (justify): the Taylor series of $f$ converges to $f$ everywhere it converges.`,
  ],
  traps: [
    R`Evaluating $f^{(n+1)}$ at the centre instead of bounding it over the interval. Fix: ask "where is this derivative biggest?" and check both ends.`,
    R`Using $n!$ instead of $(n+1)!$, or $f^{(n)}$ instead of $f^{(n+1)}$. Fix: degree $n$ means everything uses $n+1$.`,
    R`Taking the distance to the nearer end. Fix: $|x-c|$ must be the LARGEST distance from the centre.`,
    R`Assuming a Taylor series always converges to its function. Fix: it does only if $R_n\to0$.`,
    R`For "how many terms", stopping at the first $n$ that is close. Fix: the bound must be strictly below the target.`,
  ],
  practice: [
    {
      id: 'lp-remainder-01', unit: U, topic: T, stage: 'warmup', diff: 1, arch: 'rem-xi-meaning', tf: true,
      prompt: R`True or false: in $R_n(x)=\dfrac{f^{(n+1)}(\xi)}{(n+1)!}(x-c)^{n+1}$, the number $\xi$ is the centre $c$.`,
      choices: [
        { t: 'False', ok: true },
        { t: 'True', why: R`That turns the remainder into the next term of the series. $\xi$ is some unknown number BETWEEN $x$ and $c$, which is why you bound it.`, err: 'concept' },
      ],
      hints: [R`Is $\xi$ a known number?`, R`The theorem only says $\xi$ lies between $x$ and $c$.`],
      steps: [R`The theorem gives $\xi$ only as "some number between $x$ and $c$".`, R`With $\xi=c$ you get the next Taylor term, a different object. So False.`],
      recall: R`$\xi$ is unknown and between $x$ and $c$; you bound $f^{(n+1)}(\xi)$, never plug in $c$ automatically.`,
    },
    {
      id: 'lp-remainder-02', unit: U, topic: T, stage: 'warmup', diff: 2, arch: 'rem-setup-order',
      prompt: R`Which expression is the remainder $R_4(x)$ for $T_4(x)$ about centre $c$? (Do not compute anything.)`,
      choices: [
        { t: R`$\dfrac{f^{(5)}(\xi)}{5!}(x-c)^{5}$`, ok: true },
        { t: R`$\dfrac{f^{(4)}(\xi)}{4!}(x-c)^{4}$`, why: R`This uses $n$ instead of $n+1$. That is the degree-4 term, which $T_4$ already contains.`, err: 'index' },
        { t: R`$\dfrac{f^{(5)}(c)}{5!}(x-c)^{5}$`, why: R`Evaluated at the centre, this is the next series term, not the remainder. The derivative belongs at $\xi$.`, err: 'concept' },
        { t: R`$\dfrac{f^{(5)}(\xi)}{4!}(x-c)^{5}$`, why: R`Factorial off by one. The derivative order, the factorial and the power all equal $n+1=5$.`, err: 'factorial' },
      ],
      hints: [R`Degree $n=4$. What is $n+1$?`, R`Every piece uses $5$, and the derivative is at $\xi$.`],
      steps: [R`$n=4$, so $n+1=5$.`, R`Derivative $f^{(5)}$ at $\xi$, factorial $5!$, power $(x-c)^5$.`],
      recall: R`Degree $n$: derivative, factorial and power are all $n+1$.`,
    },
    {
      id: 'lp-remainder-03', unit: U, topic: T, stage: 'core', diff: 2, arch: 'rem-find-M-increasing', fmt: 'free',
      prompt: R`$f(x)=e^{x}$ is approximated by $T_2(x)$ centred at $0$ on the interval $[0,2]$. What is the smallest valid $M$ with $|f'''(\xi)|\le M$ on the interval?`,
      choices: [
        { t: R`$e^{2}$`, ok: true },
        { t: R`$1$`, why: R`That is $e^{0}$, the value at the centre. $e^{x}$ increases, so on $[0,2]$ it is largest at $x=2$.`, err: 'concept' },
        { t: R`$e^{3}$`, why: R`You used the derivative number $3$ as the input. $f'''(\xi)=e^{\xi}$ with $\xi\le2$, so the max is $e^{2}$.`, err: 'setup' },
        { t: R`$8$`, why: R`That is $2^3$, the distance power $|x|^3$, not the derivative. $M$ bounds $f'''$ only.`, err: 'formula-confusion' },
      ],
      hints: [R`What is $f'''(x)$ for $e^{x}$?`, R`$e^{x}$ increases. Which end of $[0,2]$ makes it biggest?`],
      steps: [R`$f'''(x)=e^{x}$.`, R`$e^{x}$ increases, so on $[0,2]$ the maximum is at $x=2$.`, R`$M=e^{2}$.`],
      recall: R`$M$ is the largest $|f^{(n+1)}|$ on the interval; increasing means right end.`,
    },
    {
      id: 'lp-remainder-04', unit: U, topic: T, stage: 'core', diff: 2, arch: 'rem-max-distance',
      prompt: R`(Lecture 11-10.) $T_2$ for $\sqrt[3]{x}$ is centred at $c=8$ and used on $[5,17]$. What is the largest value of $|x-c|$ to use in the bound?`,
      choices: [
        { t: R`$9$`, ok: true },
        { t: R`$3$`, why: R`That is the distance to the NEAR end, $|5-8|$. The bound needs the largest distance, $|17-8|=9$.`, err: 'endpoint' },
        { t: R`$17$`, why: R`That is the endpoint itself, not its distance from the centre. Subtract $c=8$.`, err: 'setup' },
        { t: R`$12$`, why: R`That is the interval length $17-5$. The distance is measured from the centre, not across the interval.`, err: 'setup' },
      ],
      hints: [R`Measure from $c=8$ to each end.`, R`$|5-8|=3$ and $|17-8|=9$. Take the larger.`],
      steps: [R`Distance to left end: $|5-8|=3$.`, R`Distance to right end: $|17-8|=9$.`, R`Largest is $9$, so $|x-8|^3\le9^3$.`],
      recall: R`Use the farthest point of the interval from the centre.`,
    },
    {
      id: 'lp-remainder-05', unit: U, topic: T, stage: 'core', diff: 3, arch: 'rem-decreasing-deriv-bound', fmt: 'free',
      prompt: R`$T_1(x)=2+\frac14(x-4)$ approximates $f(x)=\sqrt{x}$ about $c=4$ on $[4,4.4]$. Use the Taylor Remainder Theorem to find the max error.`,
      choices: [
        { t: R`$\dfrac{1}{400}$`, ok: true },
        { t: R`$\dfrac{1}{200}$`, why: R`You forgot to divide by $(n+1)!=2!=2$. The bound is $\frac{M}{2!}|x-4|^2$.`, err: 'factorial' },
        { t: R`$\dfrac{1}{160}$`, why: R`You used $|x-4|=0.4$ without squaring. For $n=1$ the power is $n+1=2$: $0.4^2=0.16$.`, err: 'index' },
        { t: R`$\dfrac{1}{1200}$`, why: R`You divided by $3!$. Degree $1$ means $(1+1)!=2$, not $6$.`, err: 'factorial' },
      ],
      hints: [R`$n=1$: you need $f''$ and $2!$.`, R`$f''(x)=-\frac14x^{-3/2}$. Its size decreases, so it is biggest at the LEFT end $x=4$.`, R`$M=\frac14\cdot\frac18=\frac1{32}$; distance $0.4$.`],
      steps: [
        R`$f'=\frac12x^{-1/2}$, $f''=-\frac14x^{-3/2}$, so $|f''(\xi)|=\frac{1}{4\xi^{3/2}}$.`,
        R`This decreases as $\xi$ grows, so on $[4,4.4]$ the max is at $\xi=4$: $M=\frac{1}{4\cdot8}=\frac1{32}$.`,
        R`Largest distance: $|4.4-4|=0.4=\frac25$, so $|x-4|^2\le\frac4{25}$.`,
        R`Max error $=\frac{1/32}{2!}\cdot\frac4{25}=\frac{4}{1600}=\frac1{400}$.`,
      ],
      recall: R`Negative powers decrease: $M$ comes from the LEFT end.`,
    },
    {
      id: 'lp-remainder-06', unit: U, topic: T, stage: 'core', diff: 3, arch: 'rem-find-error', fmt: 'error',
      prompt: R`A student bounds the error when $T_3(x)$ for $e^{x}$ about $0$ is used on $[0,1]$. Which line has the mistake?`,
      work: [
        R`$R_3(x)=\dfrac{f^{(4)}(\xi)}{4!}x^{4}$, $\xi$ between $0$ and $x$.`,
        R`$f^{(4)}(\xi)=e^{\xi}\le e^{0}=1$.`,
        R`$|x|^4\le1$ on $[0,1]$.`,
        R`Max error $\le\dfrac{1\cdot1}{24}=\dfrac1{24}$.`,
      ],
      choices: [
        { t: 'Line 1', why: R`Line 1 is correct: degree $3$ uses $f^{(4)}$, $4!$ and $x^4$, with $\xi$ between $0$ and $x$.`, err: 'index' },
        { t: 'Line 2', ok: true },
        { t: 'Line 3', why: R`Line 3 is correct: on $[0,1]$ the largest $|x|$ is $1$, so $|x|^4\le1$.`, err: 'endpoint' },
        { t: 'Line 4', why: R`Line 4 follows correctly from the lines above it; the arithmetic $\frac{1}{24}$ is right given Line 2.`, err: 'algebra-slip' },
        { t: 'No error', why: R`There is an error: $e^{\xi}$ on $[0,1]$ can be as big as $e$, so $1$ is not a valid $M$. The bound should be $\frac{e}{24}$.`, err: 'concept' },
      ],
      hints: [R`Is $e^{\xi}$ really at most $1$ when $\xi$ can be up to $1$?`, R`$e^{x}$ increases.`],
      steps: [R`$e^{\xi}$ increases, and $\xi$ can be close to $1$.`, R`So $e^{\xi}\le e^{1}=e$, not $e^{0}$. Line 2 plugged in the centre.`, R`Correct bound: $\frac{e}{24}$.`],
      recall: R`Never bound $f^{(n+1)}(\xi)$ by its value at the centre without checking where it is largest.`,
    },
    {
      id: 'lp-remainder-07', unit: U, topic: T, stage: 'core', diff: 3, arch: 'rem-concept-select', fmt: 'multi',
      prompt: R`Select ALL true statements.`,
      choices: [
        { t: R`$R_n(c)=0$: the Taylor polynomial is exact at its centre.`, ok: true, why: R`At $x=c$ every $(x-c)$ power is $0$ and $T_n(c)=f(c)$, so the gap is $0$.` },
        { t: R`The bound $\frac{M}{(n+1)!}|x-c|^{n+1}$ is a ceiling; the actual error can be smaller.`, ok: true, why: R`For $\sqrt[3]{8.1}$ the bound was about $0.000000241$ and the true error about $0.000000239$.` },
        { t: R`The Maclaurin series of $e^{x}$ equals $e^{x}$ for every real $x$.`, ok: true, why: R`Its remainder bound $\frac{e^{|x|}|x|^{n+1}}{(n+1)!}\to0$, since factorials beat powers.` },
        { t: R`If a Taylor series converges at $x$, its sum must be $f(x)$.`, why: R`False: $e^{-1/x}$ (and $0$ for $x\le0$) has an all-zero Maclaurin series that converges but does not equal $g$ for $x>0$.`, err: 'concept' },
        { t: R`Using a wider interval gives a smaller error bound.`, why: R`False: a wider interval can only make $M$ and $\max|x-c|$ larger, so the bound grows or stays the same.`, err: 'concept' },
      ],
      hints: [R`Think about what happens at $x=c$.`, R`Recall the $e^{-1/x}$ example and what "bound" means.`],
      steps: [R`At the centre the gap is $0$: true.`, R`A bound is a ceiling, not the exact error: true.`, R`$e^{x}$ has $R_n\to0$ for all $x$: true.`, R`Convergence alone is not enough ($e^{-1/x}$), and wider intervals never shrink the bound: both false.`],
      recall: R`Series $=f$ exactly when $R_n(x)\to0$.`,
    },
    {
      id: 'lp-remainder-08', unit: U, topic: T, stage: 'core', diff: 3, arch: 'rem-skip-zero-term', tf: true,
      prompt: R`True or false: for $\sin x$ about $0$, $T_5(x)=T_6(x)$, so the error of $T_5$ on $|x|\le1$ is at most $\frac{1}{7!}$.`,
      choices: [
        { t: 'True', ok: true },
        { t: 'False', why: R`The $x^6$ coefficient of $\sin x$ is $\frac{f^{(6)}(0)}{6!}=\frac{-\sin 0}{720}=0$, so $T_5$ and $T_6$ are the same polynomial and the $R_6$ bound $\frac1{7!}$ applies to it.`, err: 'concept' },
      ],
      hints: [R`Does $\sin x$ have any even powers in its Maclaurin series?`, R`If the polynomials are equal, their errors are equal.`],
      steps: [R`$\sin x=x-\frac{x^3}{3!}+\frac{x^5}{5!}-\cdots$ has no $x^6$ term.`, R`So $T_6=T_5$, and $|R_6(x)|\le\frac{1}{7!}|x|^7\le\frac1{5040}$ on $|x|\le1$.`, R`That bound is also the bound for $T_5$. True.`],
      recall: R`If the next coefficient is $0$, $T_n=T_{n+1}$ and you may use the better bound.`,
    },
    {
      id: 'lp-remainder-09', unit: U, topic: T, stage: 'core', diff: 4, arch: 'rem-how-many-n',
      prompt: R`$T_n(x)$ for $e^{x}$ about $0$ is used on $[0,1]$. What is the smallest $n$ for which the Taylor Remainder Theorem guarantees error less than $0.0005$?`,
      choices: [
        { t: R`$n=7$`, ok: true },
        { t: R`$n=6$`, why: R`You took $M=1$. On $[0,1]$, $e^{\xi}$ can reach $e$; with $M=e$, $n=6$ gives $\frac{e}{5040}\approx0.00054>0.0005$.`, err: 'concept' },
        { t: R`$n=8$`, why: R`You used $n!$ instead of $(n+1)!$. With $(n+1)!$, $n=7$ already gives $\frac{e}{8!}\approx0.0000674$.`, err: 'factorial' },
        { t: 'No finite $n$ works', why: R`$\frac{e}{(n+1)!}\to0$, since factorials grow without bound, so some finite $n$ always works.`, err: 'concept' },
      ],
      hints: [R`$M=e$, $|x|\le1$, so the bound is $\frac{e}{(n+1)!}$.`, R`Test $n=6$ and $n=7$.`],
      steps: [
        R`$f^{(n+1)}=e^{x}\le e$ on $[0,1]$, and $|x|^{n+1}\le1$. So $|R_n|\le\frac{e}{(n+1)!}$.`,
        R`$n=6$: $\frac{e}{7!}=\frac{e}{5040}\approx0.000539$, not below $0.0005$.`,
        R`$n=7$: $\frac{e}{8!}=\frac{e}{40320}\approx0.0000674<0.0005$. So $n=7$.`,
      ],
      recall: R`Keep $n$ as a letter, then test values until the bound is strictly below the target.`,
    },
    {
      id: 'lp-remainder-10', unit: U, topic: T, stage: 'exam', diff: 4, arch: 'rem-exam-chain-exp',
      prompt: R`Let $T_2(x)$ be the degree 2 Taylor polynomial for $f(x)=e^{2x}$ centered at $x=0$. If one uses $T_2(x)$ to approximate $f(x)$ on $(-1,1)$, what is the largest possible error given by the Taylor Remainder Theorem?`,
      choices: [
        { t: R`$\dfrac{4e^{2}}{3}$`, ok: true },
        { t: R`$\dfrac{4}{3}$`, why: R`You evaluated $8e^{2\xi}$ at the centre $\xi=0$. On $(-1,1)$, $e^{2\xi}$ can approach $e^{2}$.`, err: 'concept' },
        { t: R`$\dfrac{e}{6}$`, why: R`You forgot the chain rule. $f'''(x)=8e^{2x}$, not $e^{x}$.`, err: 'formula-confusion' },
        { t: R`$4e^{2}$`, why: R`You divided by $2!$. Degree $2$ uses $(2+1)!=6$.`, err: 'factorial' },
      ],
      hints: [R`$f'''(x)=2^3e^{2x}$.`, R`Biggest $e^{2\xi}$ for $|\xi|<1$ is $e^{2}$.`, R`$\frac{8e^2}{3!}\cdot1$.`],
      steps: [
        R`$R_2(x)=\dfrac{f'''(\xi)}{3!}x^{3}$, $\xi$ between $0$ and $x$.`,
        R`Chain rule three times: $f'''(x)=8e^{2x}$.`,
        R`On $(-1,1)$: $8e^{2\xi}<8e^{2}=M$, and $|x|^3<1$.`,
        R`$|R_2|<\dfrac{8e^{2}}{6}=\dfrac{4e^{2}}{3}$.`,
      ],
      recall: R`Inside function $2x$: each derivative brings out a factor $2$, and the max moves to $e^{2}$.`,
    },
    {
      id: 'lp-remainder-11', unit: U, topic: T, stage: 'exam', diff: 5, arch: 'rem-exam-trig-centre', fmt: 'free',
      prompt: R`Let $T_2(x)$ be the degree 2 Taylor polynomial for $f(x)=\cos x$ centered at $x=\frac{\pi}{3}$. Showing all your work, find the max error the Taylor Remainder Theorem gives if $T_2$ is used on $\left[0,\frac{\pi}{2}\right]$.`,
      choices: [
        { t: R`$\dfrac{\pi^{3}}{162}$`, ok: true },
        { t: R`$\dfrac{\pi^{3}}{54}$`, why: R`You divided by $2!$ instead of $3!$. Degree $2$ uses $f'''$ and $(2+1)!=6$.`, err: 'factorial' },
        { t: R`$\dfrac{\pi^{3}}{1296}$`, why: R`You used the NEAR end, $\left|\frac{\pi}{2}-\frac{\pi}{3}\right|=\frac{\pi}{6}$. The farthest end is $0$, at distance $\frac{\pi}{3}$.`, err: 'endpoint' },
        { t: R`$\dfrac{\pi^{3}}{27}$`, why: R`You forgot to divide by $(n+1)!=3!=6$. The bound is $\frac{M}{3!}|x-c|^3$.`, err: 'factorial' },
      ],
      accept: ['pi^3/162'],
      hints: [R`$f'''(x)=\sin x$. What is the largest $|\sin x|$ can be?`, R`Measure from $c=\frac{\pi}{3}$ to both ends: $\frac{\pi}{3}$ and $\frac{\pi}{6}$.`, R`$\frac{1}{3!}\left(\frac{\pi}{3}\right)^3$.`],
      steps: [
        R`$f'=-\sin x$, $f''=-\cos x$, $f'''=\sin x$. So $|R_2(x)|=\left|\dfrac{\sin\xi}{3!}\left(x-\frac{\pi}{3}\right)^{3}\right|$.`,
        R`$|\sin\xi|\le1$ for every $\xi$, so $M=1$.`,
        R`Distances from $c=\frac{\pi}{3}$: to $0$ it is $\frac{\pi}{3}$, to $\frac{\pi}{2}$ it is $\frac{\pi}{6}$. Largest is $\frac{\pi}{3}$, so $|x-c|^3\le\frac{\pi^3}{27}$.`,
        R`Max error $\le\frac{1}{6}\cdot\frac{\pi^{3}}{27}=\frac{\pi^{3}}{162}\approx0.191$.`,
      ],
      recall: R`Sine and cosine give $M=1$ anywhere; then the farthest end from the centre sets the distance.`,
    },
    {
      id: 'lp-remainder-12', unit: U, topic: T, stage: 'exam', diff: 5, arch: 'rem-exam-ln-bound',
      prompt: R`(Lecture 11-10.) Estimate $\ln(0.95)$ using $T_2$ for $f(x)=\ln(1+x)$ centered at $0$, with $x=-0.05$. Fully justify: what bound does the Taylor Remainder Theorem give on the error?`,
      choices: [
        { t: R`$\dfrac{1}{20577}$`, ok: true },
        { t: R`$\dfrac{1}{24000}$`, why: R`You set $1+\xi=1$ (the centre). $\xi$ is between $-0.05$ and $0$, so $1+\xi$ can be as small as $0.95$, which makes the derivative larger.`, err: 'concept' },
        { t: R`$\dfrac{1}{27783}$`, why: R`You used $1+\xi=1.05$. $\xi$ lies between $0$ and $-0.05$, not $+0.05$, so the smallest $1+\xi$ is $0.95$.`, err: 'sign' },
        { t: R`$\dfrac{1}{6859}$`, why: R`You dropped the $\frac{1}{n+1}=\frac13$ factor left after $\frac{n!}{(n+1)!}$ cancels.`, err: 'factorial' },
      ],
      hints: [R`$f'''(x)=\frac{2}{(1+x)^3}$.`, R`$\frac{2}{(1+\xi)^3}$ is biggest when $1+\xi$ is smallest: $0.95$.`, R`Bound $=\frac{2}{0.95^3}\cdot\frac{1}{3!}\cdot0.05^3$.`],
      steps: [
        R`$f'=\frac1{1+x}$, $f''=\frac{-1}{(1+x)^2}$, $f'''=\frac{2}{(1+x)^3}$.`,
        R`$|R_2(-0.05)|=\dfrac{|f'''(\xi)|}{3!}|{-0.05}|^3$, $\xi$ between $-0.05$ and $0$.`,
        R`$1+\xi\ge0.95$, so $|f'''(\xi)|\le\frac{2}{0.95^3}$.`,
        R`Bound $=\frac{2}{0.95^3}\cdot\frac16\cdot0.05^3=\frac{0.05^3}{3\cdot0.95^3}=\frac{1}{3\cdot19^3}=\frac1{20577}\approx0.0000486$.`,
      ],
      recall: R`With $x<c$, $\xi$ is to the LEFT of the centre; check which side makes the derivative largest.`,
    },
    {
      id: 'lp-remainder-13', unit: U, topic: T, stage: 'exam', diff: 4, arch: 'rem-exam-converge-justify', tf: true,
      prompt: R`Determine whether the statement is true or false. Fully justify. "The Maclaurin series of $\cos x$ converges to $\cos x$ for every real $x$, because $|R_n(x)|\le\frac{|x|^{n+1}}{(n+1)!}\to0$."`,
      choices: [
        { t: 'True', ok: true },
        { t: 'False', why: R`Every derivative of $\cos$ is $\pm\sin$ or $\pm\cos$, so $M=1$ works, and $\frac{|x|^{n+1}}{(n+1)!}\to0$ for each fixed $x$. So $R_n\to0$ and the series equals $\cos x$.`, err: 'concept' },
      ],
      hints: [R`What is a valid $M$ for every derivative of $\cos$?`, R`Do factorials beat powers as $n\to\infty$?`],
      steps: [R`$|f^{(n+1)}(\xi)|\le1$ for all $\xi$, so $|R_n(x)|\le\frac{|x|^{n+1}}{(n+1)!}$.`, R`For fixed $x$, $(n+1)!$ outgrows $|x|^{n+1}$, so the bound $\to0$ (e.g. $x=5$, $n=20$: about $0.0000093$).`, R`$R_n\to0$, so the series equals $\cos x$. True.`],
      recall: R`To show a series equals $f$, show $R_n(x)\to0$.`,
    },
  ],
};
