"use client";
import React, { useRef, useEffect, useState } from "react";

export interface HighlightRange {
  start: number;
  end: number;
  className?: string;
}

export function TextArea({
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
  onSelectionChange?: (start: number, end: number) => void;
}) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <label className="text-sm font-semibold text-gray-700">{label}</label>
      <div className="relative">
        {/* Textarea */}
        <textarea
          ref={textareaRef}
          className="relative min-h-[300px] p-2 border border-gray-800 rounded-md bg-transparent font-mono text-sm leading-5 resize-none w-full"
          style={{ zIndex: 2 }}
          placeholder={placeholder}
          onChange={(e) => setText(e.target.value)}
          value={text}
        />
      </div>
    </div>
  );
}
