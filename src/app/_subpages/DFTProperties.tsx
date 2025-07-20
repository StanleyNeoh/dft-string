"use client";
import React from "react";
import { SMarkdown } from "../_components/SMarkdown";

export function DFTProperties() {
  return (
    <div className="w-full">
      <SMarkdown>
        {`
# Multiplication of Polynomials

Suppose we have two polynomials $P(x)$ and $Q(x)$, each of degree n.
$$
\\begin{align*}
P(x) &= a_0 + a_1 x + a_2 x^2 + \\dots + a_n x^n \\\\
Q(x) &= b_0 + b_1 x + b_2 x^2 + \\dots + b_n x^n
\\end{align*}
$$

Calculating $(P \\cdot Q)(x)$ is rather arduous, as each term has to be multiplied with every term of the other polynomial. This will take $O(n^2)$ time.
$$
\\begin{align*}
(P \\cdot Q)(x) &= (a_0 + a_1 x + a_2 x^2 + \\dots + a_n x^n)(b_0 + b_1 x + b_2 x^2 + \\dots + b_n x^n) \\\\
&= \\sum_{k=0}^{2n} (\\sum_{i = \\max(0,k-n)}^{n} a_i b_{k-i}) x^k
\\end{align*}
$$

Now let us consider the the values of the $P(x)$ and $Q(x)$ at the n+1 roots of unity, then note that we can find the values of $(P \\cdot Q)(x)$ at these points by simply multiplying the corresponding values of $P(x)$ and $Q(x)$ at these points. This will take $O(n)$ time.
$$
(P \\cdot Q)(e^{2\\pi k/n}) = P(e^{2\\pi k/n}) \\cdot Q(e^{2\\pi k/n}) \\text{ for } k = 0, 1, \\dots, n-1
$$

Since we know theres a correspondence between the values of the polynomials at the n+1 roots of unity and their coefficients through the DFT.
Maybe we calculate $(P \\cdot Q)(e^{2\\pi k/n})$ by 

1. Use the DFT to get the values of $P(e^{2\\pi k/n})$ and $Q(e^{2\\pi k/n})$ for $k = 0, 1, \\dots, n-1$.
2. At the roots of unity, get the values of $(P \\cdot Q)(e^{2\\pi k/n})$ by multiplying the values of $P(e^{2\\pi k/n})$ and $Q(e^{2\\pi k/n})$ for $k = 0, 1, \\dots, n-1$.
3. Use the inverse DFT to get the coefficients of $(P \\cdot Q)(x)$ from these values.

We know step 2 takes $O(n)$ time. But how long does step 1 and 3 take? With the Fast Fourier Transform (FFT), DFT and inverse DFT can be computed in $O(n \\log n)$ time!

This approach reduces the time complexity of multiplying 2 polynomials from $O(n^2)$ to $O(n \\log n)$ using the Fast Fourier Transform (FFT).
This is a powerful result that we can use to improve the efficiency of algorithms that reduces to polynomial multiplication, such as convolution and string searching.

To learn more about the Fast Fourier Transform (FFT), check out the [cp-algorithms](https://cp-algorithms.com/algebra/fft.html). Everything discussed on this page is from there.



> ## (Quick Aside) Formula for polynomial multiplication
> 
> Recall the formula for polynomial multiplication for $(m-1)$-degree polynomial $P(x)$ and $(n-1)$-degree polynomial $Q(x)$ where $m < n$:
> $$
> \\begin{align*}
>   (P \\cdot Q)(x) &= (P[0] + P[1] x + P[2] x^2 + \\dots + P[m-1] x^{m-1})(Q[0] + Q[1] x + Q[2] x^2 + \\dots + Q[n-1] x^{n-1}) \\\\
>   &= \\sum_{k=0}^{m + n - 2} (\\sum_{i = \\max(0,k-n+1)}^{\\min(m-1, k)} P[i] Q[k-i]) x^k \\\\
> 
>   (P \\cdot Q)[k] &= \\sum_{i = \\max(0,k-n+1)}^{\\min(m-1, k)} P[i] Q[k-i]
> \\end{align*}
> $$

# Single character wildcard string searching

The problem of searching for a substring in a string is well studied and there are many algorithms that can do this efficiently. 
However, when the substring contains single character wildcards, the problem becomes more complex. Naively, we check every possible substring of the text that matches the pattern, which takes $O(mn)$ time, where $m$ is the length of the pattern and $n$ is the length of the text. 
Let us see if we can do better than this.

## Reducing the problem to polynomial multiplication

Suppose we have a pattern $P$ of length $m$ and a text $T$ of length $n$ such that
* P and T are arrays of non-negative numbers where each number represent a character. 
* Define the single character wildcard to be 0.
* For simplicity, we will assume that $n$ is infinite (this allows us to omit the boundary check).

Then there is a match at position $a$ in the text if and only if $(P[i] = 0) \\vee (T[a + i] = P[i]) \\text{ for } i = 0, 1, \\dots, m-1$

Now if we interpret the $P$ and $T$ as polynomials, such that 
$$
\\begin{align*}
  P(x) &= P[0] + P[1] x + P[2] x^2 + \\dots + P[m] x^m \\\\
  T(x) &= T[0] + T[1] x + T[2] x^2 + \\dots + T[n] x^n
\\end{align*}
$$
Then the condition for a match at position $a$ can be rewritten as:
$$
\\begin{align*}
  \\sum_{i=0}^{m-1} P[i](T[a + i] - P[i])^2 &= 0 \\\\
  \\sum_{i=0}^{m-1} P[i]T[a + i]^2 - 2 P[i]^2T[a + i] + P[i]^3 &= 0 \\\\
  \\sum_{i=0}^{m-1} P[i]T'[n - 1 - a - i]^2 - 2 P[i]^2T'[n - 1 - a - i] + P[i]^3 &= 0 \\text{ where $T'$ is the reverse of $T$} \\\\
  \\sum_{i=0}^{m-1} P[i]T'[a'- i]^2 - 2 P[i]^2T'[a' - i] + P[i]^3 &= 0 \\text{ where $a' = n - 1 - a$} \\\\
  (P \\cdot T'^2)[a'] - 2(P^2 \\cdot T')[a'] + S  &= 0 \\text{ where $S = \\sum_{i=0}^{m-1} P[i]^3$}
\\end{align*}
$$

Wow, that was a lot of math! But we can see that we can reduce the problem to polynomial multiplication.

We can use Fast Fourier Transform (FFT) to compute the polynomial multiplication (P \\cdot T'^2) and (P^2 \\cdot T') efficiently 
and look at the which coefficients of the resulting polynomial are 0, which will tell us the positions of the matches in the text.
`}
      </SMarkdown>
    </div>
  );

}
