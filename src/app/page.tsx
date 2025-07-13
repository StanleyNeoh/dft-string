"use client";

import React, { forwardRef, useContext, useImperativeHandle, useState } from "react";
import Markdown, { Options } from "react-markdown";
import rehypeKatex from "rehype-katex";
import remarkMath from "remark-math";
import 'katex/dist/katex.min.css';

const content = {
  "what-is-dft": [
  ]

}

function SMarkdown({
  ...props
}: Options) {
  return (
    <Markdown
      components={{
        h1: ({ children }) => <h1 className="text-2xl font-bold mb-4">{children}</h1>,
        h2: ({ children }) => <h2 className="text-xl font-semibold mb-3">{children}</h2>,
        p: ({ children }) => <p className="mb-2 text-gray-700">{children}</p>,
        code: ({ children }) => <code className="bg-gray-100 p-1 rounded">{children}</code>,
        pre: ({ children }) => <pre className="bg-gray-100 p-4 rounded mb-4">{children}</pre>,
        ul: ({ children }) => <ul className="list-disc pl-5 mb-4">{children}</ul>,
        ol: ({ children }) => <ol className="list-decimal pl-5 mb-4">{children}</ol>,
        li: ({ children }) => <li className="mb-2 text-gray-700">{children}</li>,
        a: ({ children, href }) => (
          <a href={href
          } className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">
            {children}
          </a>
        ),
        blockquote: ({ children }) => (
          <blockquote className="border-l-4 border-gray-300 pl-4 italic text-gray-600 mb-4">
            {children}
          </blockquote>
        ),
        strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
        em: ({ children }) => <em className="italic text-gray-600">{children}</em>,
      }}
      remarkPlugins={[remarkMath]}
      rehypePlugins={[rehypeKatex]}
      {...props}
    />
  )
}

function TextArea({
  label,
  placeholder,
  className,
  text,
  setText,
}: {
  label: string;
  placeholder?: string;
  className?: string;
  text: string;
  setText: (text: string) => void;
}) {
  return (
    <div
      className={`flex flex-col gap-2 ${className}`}
    >
      <label className="text-sm font-semibold text-gray-700">{label}</label>
      <textarea
        className={`min-h-[300px] p-2 border border-gray-800 rounded-md`}
        placeholder={placeholder}
        onChange={(e) => setText(e.target.value)}
        value={text}
      />
    </div>
  )
}

export default function Home() {
  const [text, setText] = useState("");
  const [pattern, setPattern] = useState("");

  return (
    <div className="max-w-7xl mx-auto p-4 flex flex-col items-center gap-4">
      <h1 className="text-3xl font-bold">Discrete Fourier Transform in Algorithms</h1>

      <div className="w-full">
        <SMarkdown>
          {`
# What is the Discrete Fourier Transform?

If you have an n-degree polynomial, the polynomial is uniquely identified by 
* its n+1 coefficients $a_i$ for $i = 0, 1, \\dots, n$.
* its values at n+1 points.

As the points are arbitrary, let us choose the points to be the n+1 roots of unity. (i.e. $x = e^{2 \\pi k/n}$ for $k = 0, 1, \\dots, n$)
The mapping from the coefficients to the values at these points is called the Discrete Fourier Transform (DFT). 
Given a polynomial $P(x) = a_0 + a_1 x + a_2 x^2 + \\dots + a_n x^n$, the DFT is defined as:
$$
DFT(a_0, a_1, \\dots, a_n) = (P(1), P(e^{2\\pi/n}), P(e^{4\\pi/n}), \\dots, P(e^{2(n-1)\\pi/n}), P(e^{2\\pi}))
$$

Naturally, the inverse of the DFT would be the mapping from these n+1 points to the coefficients.

Below is an interactive example of the DFT:
          `}
        </SMarkdown>
        <div className="flex flex-col md:flex-row gap-4 w-full">
          <span className="ml-4 italic text-gray-600">
            Add interactive DFT play area here with D3
          </span>
        </div>
      </div>

      <div className="w-full">
        <SMarkdown>
          {`
# Multiplication of Polynomials

Suppose we have two polynomials $P(x)$ and $Q(x)$, each of degree n.
$$
\\begin{align}
P(x) &= a_0 + a_1 x + a_2 x^2 + \\dots + a_n x^n \\\\
Q(x) &= b_0 + b_1 x + b_2 x^2 + \\dots + b_n x^n
\\end{align}
$$

Calculating $(P \\cdot Q)(x)$ is rather arduous, as each term has to be multiplied with every term of the other polynomial. This will take $O(n^2)$ time.
$$
\\begin{align}
(P \\cdot Q)(x) &= (a_0 + a_1 x + a_2 x^2 + \\dots + a_n x^n)(b_0 + b_1 x + b_2 x^2 + \\dots + b_n x^n) \\\\
&= \\sum_{k=0}^{2n} (\\sum_{i = \\max(0,k-n)}^{n} a_i b_{k-i}) x^k
\\end{align}
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


# What is Fast Fourier Transform (FFT)?

TODO: Add explanation of FFT, and interactive example


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


Recall the formula for polynomial multiplication for $(m-1)$-degree polynomial $P(x)$ and $(n-1)$-degree polynomial $Q(x)$ where $m < n$:
$$
\\begin{align*}
  (P \\cdot Q)(x) &= (P[0] + P[1] x + P[2] x^2 + \\dots + P[m-1] x^{m-1})(Q[0] + Q[1] x + Q[2] x^2 + \\dots + Q[n-1] x^{n-1}) \\\\
  &= \\sum_{k=0}^{m + n - 2} (\\sum_{i = \\max(0,k-n+1)}^{\\min(m-1, k)} P[i] Q[k-i]) x^k \\\\

  (P \\cdot Q)[k] &= \\sum_{i = \\max(0,k-n+1)}^{\\min(m-1, k)} P[i] Q[k-i]
\\end{align*}
$$

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


      <div className="w-full">
        <div className="flex flex-col md:flex-row gap-4 w-full">
          <TextArea
            className="flex-1"
            label="Pattern to find"
            placeholder="Enter your text here..."
            text={pattern}
            setText={setPattern}
          />
          <TextArea
            className="flex-1"
            label="Text to search in"
            placeholder="Enter the text to search in..."
            text={text}
            setText={setText}
          />
        </div>
        <div>
          <button className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
            Search
          </button>
        </div>
      </div>
    </div>
  );
}
