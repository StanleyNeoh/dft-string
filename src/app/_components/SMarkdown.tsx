"use client";
import React from "react";
import Markdown, { Options } from "react-markdown";
import rehypeKatex from "rehype-katex";
import remarkMath from "remark-math";

export function SMarkdown({
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
          <a href={href} className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">
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
      {...props} />
  );
}
