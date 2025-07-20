"use client";
import React from "react";
import { SMarkdown } from "../_components/SMarkdown";

export function DFTIntro() {
  return (
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
          `}
      </SMarkdown>
    </div>
  );
}
