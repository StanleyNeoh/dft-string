import React, { useMemo } from "react";
import * as math from "mathjs";

export const TextTransform = ({
  text,
  rtext1,
}: {
  text: string;
  rtext1: number[];
}) => {
  const rtext2 = rtext1.map(value => value * value);
  return (
    <div className="w-full border border-gray-300 rounded-lg overflow-hidden">
      <div className="overflow-x-auto max-w-full">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-300">
              <th className="w-24 min-w-32 border-r border-gray-300 p-2 text-center bg-gray-100 sticky left-0 z-10">
                i
              </th>
              {text.split("").map((_, idx) => (
                <th key={idx} className="w-16 min-w-16 text-center border-r border-gray-200 p-1 text-sm font-semibold bg-gray-50">
                  {idx}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-gray-200">
              <th className="w-24 min-w-32 border-r border-gray-300 p-2 text-center bg-gray-50 sticky left-0 z-10">
                Original
              </th>
              {text.split("").map((char, idx) => (
                <td key={idx} className="w-16 min-w-16 text-center border-r border-gray-200 p-2">
                  {char}
                </td>
              ))}
            </tr>
            <tr className="border-b border-gray-200">
              <th className="w-24 min-w-32 border-r border-gray-300 p-2 text-center bg-gray-50 sticky left-0 z-10">
                Reversed
              </th>
              {text.split("").reverse().map((char, idx) => (
                <td key={idx} className="w-16 min-w-16 text-center border-r border-gray-200 p-2">
                  {char}
                </td>
              ))}
            </tr>
            <tr>
              <th className="w-24 min-w-32 border-r border-gray-300 p-2 text-center bg-gray-50 sticky left-0 z-10">
                T'[i]
              </th>
              {rtext1.map((value, idx) => (
                <td key={idx} className="w-16 min-w-16 text-center border-r border-gray-200 p-2">
                  {value}
                </td>
              ))}
            </tr>
            <tr>
              <th className="w-24 min-w-32 border-r border-gray-300 p-2 text-center bg-gray-50 sticky left-0 z-10">
                T'[i] <sup>2</sup>
              </th>
              {
                rtext2.map((value, idx) => (
                  <td key={idx} className="w-16 min-w-16 text-center border-r border-gray-200 p-2">
                    {value}
                  </td>
                ))
              }
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}

export const PatternTransform = ({
  pat,
  pat1,
}: {
  pat: string;
  pat1: number[];
}) => {
  const pat2 = pat1.map(value => value * value);
  const pat3 = pat1.map(value => value * value * value);
  const s = pat3.reduce((a, b) => a + b, 0);
  return (
    <div className="w-full border border-gray-300 rounded-lg overflow-hidden">
      <div className="overflow-x-auto max-w-full">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-300">
              <th className="w-24 min-w-32 border-r border-gray-300 p-2 text-center bg-gray-100 sticky left-0 z-10">
                Power
              </th>
              {pat.split("").map((_, idx) => (
                <th key={idx} className="w-16 min-w-16 text-center border-r border-gray-200 p-1 text-sm font-semibold bg-gray-50">
                  x<sup>{idx}</sup>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-gray-200">
              <th className="w-24 min-w-32 border-r border-gray-300 p-2 text-center bg-gray-50 sticky left-0 z-10">
                Pattern
              </th>
              {pat.split("").map((value, idx) => (
                <td key={idx} className="w-16 min-w-16 text-center border-r border-gray-200 p-2">
                  {value}
                </td>
              ))}
            </tr>
            <tr>
              <th className="w-24 min-w-32 border-r border-gray-300 p-2 text-center bg-gray-50 sticky left-0 z-10">
                P[i]
              </th>
              {pat1.map((value, idx) => (
                <td key={idx} className="w-16 min-w-16 text-center border-r border-gray-200 p-2">
                  {value}
                </td>
              ))}
            </tr>
            <tr>
              <th className="w-24 min-w-32 border-r border-gray-300 p-2 text-center bg-gray-50 sticky left-0 z-10">
                P[i] <sup>2</sup>
              </th>
              {pat2.map((value, idx) => (
                <td key={idx} className="w-16 min-w-16 text-center border-r border-gray-200 p-2">
                  {value}
                </td>
              ))}
            </tr>
            <tr>
              <th className="w-24 min-w-32 border-r border-gray-300 p-2 text-center bg-gray-50 sticky left-0 z-10">
                P[i] <sup>3</sup>
              </th>
              {pat1.map((value, idx) => (
                <td key={idx} className="w-16 min-w-16 text-center border-r border-gray-200 p-2">
                  {value * value * value}
                </td>
              ))}
            </tr>
            <tr>
              <th className="w-24 min-w-32 border-r border-gray-300 p-2 text-center bg-gray-50 sticky left-0 z-10">
                sum of P[i] <sup>3</sup>
              </th>
              <td className="w-16 min-w-16 text-center border-r border-gray-200 p-2">
                {s}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}

class MinHeap<T> {
  items: T[] = [];
  compare: ((a: T, b: T) => number) = (a, b) => a < b ? -1 : a > b ? 1 : 0;
  constructor(compare?: (a: T, b: T) => number) {
    if (compare) this.compare = compare;
  }

  private bubbleUp(index: number) {
    if (index === 0) return;
    const parentIndex = Math.floor((index - 1) / 2);
    if (this.compare(this.items[parentIndex], this.items[index]) > 0) {
      [this.items[parentIndex], this.items[index]] = [this.items[index], this.items[parentIndex]];
      this.bubbleUp(parentIndex);
    }
  }

  private bubbleDown(index: number) {
    const left = 2 * index + 1;
    const right = 2 * index + 2;
    let smallest = index;

    if (left < this.items.length && this.compare(this.items[left], this.items[smallest]) < 0) {
      smallest = left;
    }
    if (right < this.items.length && this.compare(this.items[right], this.items[smallest]) < 0) {
      smallest = right;
    }
    if (smallest !== index) {
      [this.items[index], this.items[smallest]] = [this.items[smallest], this.items[index]];
      this.bubbleDown(smallest);
    }
  }

  enqueue(value: T) {
    this.items.push(value);
    this.bubbleUp(this.items.length - 1);
  }

  dequeue(): T | undefined {
    if (this.items.length === 0) return undefined;
    if (this.items.length === 1) return this.items.pop();
    
    const min = this.items[0];
    this.items[0] = this.items.pop()!;
    this.bubbleDown(0);
    return min;
  }
}

export const DFTTransform = ({
  text1_ext,
  text1_dft,
  pat1_ext,
  pat1_dft,
  text2_ext,
  text2_dft,
  pat2_ext,
  pat2_dft,
  pt2_dft,
  pt2_ext,
  p2t_dft,
  p2t_ext,
  ret,
  text,
  pat,
  indices,
}: {
  text1_ext: number[],
  text1_dft: math.Complex[],
  pat1_ext: number[],
  pat1_dft: math.Complex[],
  text2_ext: number[],
  text2_dft: math.Complex[],
  pat2_ext: number[],
  pat2_dft: math.Complex[],
  pt2_dft: math.Complex[],
  pt2_ext: number[],
  p2t_dft: math.Complex[],
  p2t_ext: number[],
  ret: number[],
  text: string,
  pat: string,
  indices: number[],
}) => {
  const maxLength = Math.max(text1_ext.length, pat1_ext.length, text2_ext.length, pat2_ext.length, pt2_ext.length, p2t_ext.length);

  const [matchDepth, maxDepth] = useMemo(() => {
    const _indices = [...indices].sort((a, b) => a - b);
    let index = 0;

    const avail = new MinHeap<number>();
    const pending = new MinHeap<{ idx: number, depth: number }>((a, b) => a.idx - b.idx);
    let maxDepth = -1;
    const matches: {[i: number]: string[]} = {};
    for (let i = 0; i < ret.length; i++) {
      const top = pending.items[0]
      if (top !== undefined && top.idx + pat.length < i) {
        const released = pending.dequeue();
        if (released) avail.enqueue(released.depth);
      }

      if (i === _indices[index]) {
        if (avail.items.length == 0) {
          maxDepth += 1;
          avail.enqueue(maxDepth);
        }
        const acqDepth = avail.dequeue();
        if (acqDepth === undefined) throw new Error("No available depth for match");
        pending.enqueue({ idx: i, depth: acqDepth });
        index++;
      }

      console.log(i, avail.items, pending.items);
      if (pending.items.length > 0) {
        for (const item of pending.items) {
          if (matches[i] === undefined) matches[i] = [];
          matches[i][item.depth] = pat[i - item.idx];
        }
      };
    }
    return [matches, maxDepth];
  }, [ret, pat]);

  return (
    <div className="w-full border border-gray-300 rounded-lg overflow-hidden">
      {/* Scrollable container for both header and content */}
      <div className="overflow-x-auto max-w-full">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-300">
              <th className="min-w-24 border-r border-gray-300 p-3 text-center font-semibold bg-gray-100 sticky left-0 z-10">
                i
              </th>
              <th className="min-w-32 border-r border-gray-300 p-3 text-center font-semibold bg-blue-100">
                P[i]
              </th>
              <th className="min-w-32 border-r border-gray-300 p-3 text-center font-semibold bg-blue-100">
                T'[i]<sup>2</sup>
              </th>
              <th className="min-w-32 border-r border-gray-300 p-3 text-center font-semibold bg-blue-100">
                P[i]<sup>2</sup>
              </th>
              <th className="min-w-32 border-r border-gray-300 p-3 text-center font-semibold bg-blue-100">
                T'[i]
              </th>
              <th className="min-w-40 border-r border-gray-300 p-3 text-center font-semibold bg-green-100">
                DFT(P[i])
              </th>
              <th className="min-w-40 border-r border-gray-300 p-3 text-center font-semibold bg-green-100">
                DFT(T'[i]<sup>2</sup>)
              </th>
              <th className="min-w-0 border-r border-gray-300 p-3 text-center font-semibold bg-green-100 whitespace-nowrap">
                DFT(P * T'<sup>2</sup>)<br/>
                <span className="text-xs">DFT(P[i]) × DFT(T'[i]<sup>2</sup>)</span>
              </th>
              <th className="min-w-0 border-r border-gray-300 p-3 text-center font-semibold bg-orange-100 whitespace-nowrap">
                P * T'<sup>2</sup><br/>
                <span className="text-xs">IDFT(DFT(P) × DFT(T'<sup>2</sup>))</span>
              </th>
              <th className="min-w-40 border-r border-gray-300 p-3 text-center font-semibold bg-green-100">
                DFT(P[i]<sup>2</sup>)
              </th>
              <th className="min-w-40 border-r border-gray-300 p-3 text-center font-semibold bg-green-100">
                DFT(T'[i])
              </th>
              <th className="min-w-0 border-r border-gray-300 p-3 text-center font-semibold bg-green-100 whitespace-nowrap">
                DFT(P<sup>2</sup> * T')<br/>
                <span className="text-xs">DFT(P[i]<sup>2</sup>) × DFT(T'[i])</span>
              </th>
              <th className="min-w-0 border-r border-gray-300 p-3 text-center font-semibold bg-orange-100 whitespace-nowrap">
                P<sup>2</sup> * T'<br/>
                <span className="text-xs">IDFT(DFT(P<sup>2</sup>) × DFT(T'))</span>
              </th>
              <th className="min-w-0 border-r border-gray-300 p-3 text-center font-semibold bg-red-100 whitespace-nowrap">
                Result[i]<br/>
                <span className="text-xs">P[i]T'[i]<sup>2</sup> - 2P[i]<sup>2</sup>T'[i] + Σ(P[j]<sup>3</sup>)</span>
              </th>
              <th className="min-w-0 border-r border-gray-300 p-3 text-center font-semibold bg-purple-100 whitespace-nowrap">
                Result[n-1-i]<br/>
                <span className="text-xs">Reversed Index</span>
              </th>
              <th className="min-w-0 border-r border-gray-300 p-3 text-center font-semibold bg-yellow-100 whitespace-nowrap">
                Text[i]<br/>
                <span className="text-xs">Character at position i</span>
              </th>
              <th className="border-r border-gray-300 p-3 text-center font-semibold bg-green-100 whitespace-nowrap" colSpan={maxDepth+1}>
                Pattern Alignment<br/>
                <span className="text-xs">Pattern at match positions</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: maxLength }, (_, idx) => (
              <tr key={idx} className="border-b border-gray-200 hover:bg-gray-50">
                <td className="min-w-24 border-r border-gray-300 p-3 text-center font-mono font-semibold bg-gray-100 sticky left-0 z-10">
                  {idx}
                </td>
                <td className="min-w-32 border-r border-gray-300 p-3 text-center font-mono bg-blue-50">
                  {idx < pat1_ext.length ? pat1_ext[idx] : '-'}
                </td>
                <td className="min-w-32 border-r border-gray-300 p-3 text-center font-mono bg-blue-50">
                  {idx < text2_ext.length ? text2_ext[idx] : '-'}
                </td>
                <td className="min-w-32 border-r border-gray-300 p-3 text-center font-mono bg-blue-50">
                  {idx < pat2_ext.length ? pat2_ext[idx] : '-'}
                </td>
                <td className="min-w-32 border-r border-gray-300 p-3 text-center font-mono bg-blue-50">
                  {idx < text1_ext.length ? text1_ext[idx] : '-'}
                </td>
                <td className="min-w-40 border-r border-gray-300 p-3 text-center font-mono text-xs bg-green-50">
                  {idx < pat1_dft.length ? 
                    `${Number(math.abs(pat1_dft[idx])).toFixed(2)} ∠ ${(Number(math.arg(pat1_dft[idx])) * 180 / Math.PI).toFixed(1)}°` 
                    : '-'}
                </td>
                <td className="min-w-40 border-r border-gray-300 p-3 text-center font-mono text-xs bg-green-50">
                  {idx < text2_dft.length ? 
                    `${Number(math.abs(text2_dft[idx])).toFixed(2)} ∠ ${(Number(math.arg(text2_dft[idx])) * 180 / Math.PI).toFixed(1)}°` 
                    : '-'}
                </td>
                <td className="min-w-0 border-r border-gray-300 p-3 text-center font-mono text-xs bg-green-50 whitespace-nowrap">
                  {idx < pt2_dft.length ? 
                    `${Number(math.abs(pt2_dft[idx])).toFixed(2)} ∠ ${(Number(math.arg(pt2_dft[idx])) * 180 / Math.PI).toFixed(1)}°` 
                    : '-'}
                </td>
                <td className="min-w-0 border-r border-gray-300 p-3 text-center font-mono bg-orange-50 whitespace-nowrap">
                  {idx < pt2_ext.length ? pt2_ext[idx].toFixed(2) : '-'}
                </td>
                <td className="min-w-40 border-r border-gray-300 p-3 text-center font-mono text-xs bg-green-50">
                  {idx < pat2_dft.length ? 
                    `${Number(math.abs(pat2_dft[idx])).toFixed(2)} ∠ ${(Number(math.arg(pat2_dft[idx])) * 180 / Math.PI).toFixed(1)}°` 
                    : '-'}
                </td>
                <td className="min-w-40 border-r border-gray-300 p-3 text-center font-mono text-xs bg-green-50">
                  {idx < text1_dft.length ? 
                    `${Number(math.abs(text1_dft[idx])).toFixed(2)} ∠ ${(Number(math.arg(text1_dft[idx])) * 180 / Math.PI).toFixed(1)}°` 
                    : '-'}
                </td>
                <td className="min-w-0 border-r border-gray-300 p-3 text-center font-mono text-xs bg-green-50 whitespace-nowrap">
                  {idx < p2t_dft.length ? 
                    `${Number(math.abs(p2t_dft[idx])).toFixed(2)} ∠ ${(Number(math.arg(p2t_dft[idx])) * 180 / Math.PI).toFixed(1)}°` 
                    : '-'}
                </td>
                <td className="min-w-0 border-r border-gray-300 p-3 text-center font-mono bg-orange-50 whitespace-nowrap">
                  {idx < p2t_ext.length ? p2t_ext[idx].toFixed(2) : '-'}
                </td>
                <td className="min-w-0 border-r border-gray-300 p-3 text-center font-mono bg-red-50 whitespace-nowrap">
                  {idx < ret.length ? ret[idx].toFixed(2) : '-'}
                </td>
                <td className="min-w-0 border-r border-gray-300 p-3 text-center font-mono bg-purple-50 whitespace-nowrap">
                  {(() => {
                    const reversedIdx = text.length - 1 - idx;
                    const isValidIdx = reversedIdx >= 0 && reversedIdx < ret.length;
                    const value = isValidIdx ? ret[reversedIdx].toFixed(2) : '-';
                    const isZero = isValidIdx && Math.abs(ret[reversedIdx]) < 0.01;
                    return (
                      <span className={isZero ? 'bg-yellow-300 px-1 rounded font-bold' : ''}>
                        {value}
                      </span>
                    );
                  })()}
                </td>
                <td className="min-w-0 border-r border-gray-300 p-3 text-center font-mono bg-yellow-50 whitespace-nowrap">
                  {idx < text.length ? text[idx] : '-'}
                </td>
                {Array.from({ length: maxDepth + 1 }, (_, depthIdx) => (
                  <td key={depthIdx} className="min-w-0 border-r border-gray-300 p-3 text-center font-mono bg-green-50 whitespace-nowrap text-xs">
                    {(() => {
                      const patternAtDepth = matchDepth[idx] || [];
                      return patternAtDepth[depthIdx] !== undefined ? patternAtDepth[depthIdx] : '-';
                    })()}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
