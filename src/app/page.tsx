"use client";

import React, { forwardRef, useContext, useImperativeHandle } from "react";
import 'katex/dist/katex.min.css';
import { DFTIntro } from "./_subpages/DFTIntro";
import { DFTProperties } from "./_subpages/DFTProperties";
import { DFTDemo } from "./_subpages/DFTDemo";

export default function Home() {

  return (
    <div className="max-w-7xl mx-auto p-4 flex flex-col items-center gap-4">
      <h1 className="text-3xl font-bold">Discrete Fourier Transform in Algorithms</h1>
      <DFTIntro />
      <DFTProperties />
      <DFTDemo />
    </div>
  );
}
