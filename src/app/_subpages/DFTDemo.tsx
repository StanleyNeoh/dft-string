"use client";
import React, { useMemo, useState } from "react";
import { SMarkdown } from "../_components/SMarkdown";
import { HighlightRange, TextArea } from "../_components/TextArea";
import { dft_string_search, DftStringSearchResult } from "../dft";
import * as math from "mathjs";
import { DFTTransform, PatternTransform, TextTransform } from "../_components/TextTransform";

export function DFTDemo() {
  const [text, setText] = useState("");
  const [pattern, setPattern] = useState("");
  const [result, setResult] = useState<{
    text: string;
    pattern: string;
    result: DftStringSearchResult
  } | null>(null);

  const onSearch = () => {
    if (text && pattern) {
      setResult({
        text: text,
        pattern: pattern,
        result: dft_string_search(text, pattern)
      });
    }
  }

  return (
    <div className="flex flex-col w-full gap-4 items-center">
      <div>
        <SMarkdown>
          {`
# Single Character Wildcard Search with DFT

This is an interactive example of the single character wildcard search algorithm using DFT.
You can enter a pattern and a text to search in, and the algorithm will find all occurrences of the pattern in the text, including wildcards.

Use '?' to represent a single character wildcard in the pattern.
          `}
        </SMarkdown>
      </div>
      <div className="flex flex-col md:flex-row gap-4 w-full">
        <TextArea
          className="flex-1"
          label="Text to search in"
          placeholder="Enter the text to search in..."
          text={text}
          setText={setText}
        />
        <TextArea
          className="flex-1"
          label="Pattern to find"
          placeholder="Enter your text here..."
          text={pattern}
          setText={setPattern} />
      </div>

      <div className="flex flex-col w-full gap-4">
        <div className="flex justify-center">
          <button
            onClick={onSearch}
            disabled={!text || !pattern}
            className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            Search Pattern
          </button>
        </div>
      </div>
      <SearchResultDisplay 
        {...result || {}}
      />
    </div>
  );
}

function SearchResultDisplay({
  text, 
  pattern, 
  result
}: {
  text?: string, 
  pattern?: string,
  result?: DftStringSearchResult,
}) {
  if (!result || !text || !pattern) {
    return <div className="text-gray-500">Enter text and pattern to see results</div>;
  }
  const {
    rtext1,
    pat1,
    rtext1_ext,
    rtext1_dft,
    pat1_ext,
    pat1_dft,
    rtext2_ext,
    rtext2_dft,
    pat2_ext,
    pat2_dft,
    pt2_dft,
    pt2_ext,
    p2t_dft,
    p2t_ext,
    ret,
    indices
  } = result;

  return <div className="flex flex-col w-full gap-4">
    <div>
      <SMarkdown>
        {`
# What happens to the text?
          `}
      </SMarkdown>
      <TextTransform
        text={text}
        rtext1={rtext1 || []} // Using start indices as encoding for demonstration
      />
    </div>
    <div>
      <SMarkdown>
        {`
# What happens to the pattern?
          `}
      </SMarkdown>
      <PatternTransform
        pat={pattern}
        pat1={pat1 || []} />
    </div>
    <div>
      <SMarkdown>
        {`
# Putting it all together
          `}
      </SMarkdown>
      <DFTTransform
        text1_ext={rtext1_ext || []}
        text1_dft={rtext1_dft || []}
        pat1_ext={pat1_ext || []}
        pat1_dft={pat1_dft || []}
        text2_ext={rtext2_ext || []}
        text2_dft={rtext2_dft || []}
        pat2_ext={pat2_ext || []}
        pat2_dft={pat2_dft || []}
        pt2_dft={pt2_dft || []}
        pt2_ext={pt2_ext || []}
        p2t_dft={p2t_dft || []}
        p2t_ext={p2t_ext || []}
        ret={ret || []}
        text={text}
        pat={pattern}
        indices={indices || []}
      />
    </div>
  </div>;
}
