import * as math from "mathjs";

export function dft_recursive(
    arr: math.MathType[], // length must be a power of 2
    invert: boolean = false
) {
    const n = arr.length
    if (n <= 1) return;

    const even = arr.filter((_, i) => i % 2 === 0);
    const odd = arr.filter((_, i) => i % 2 === 1);
    dft_recursive(even, invert)
    dft_recursive(odd, invert)

    let w: math.MathType = math.complex(1);
    const w1: math.MathType = math.complex({
        r: 1,
        phi: invert
            ? -2 * Math.PI / arr.length
            : 2 * Math.PI / arr.length
    });

    for (let i = 0; i < arr.length / 2; i++) {
        arr[i] = math.add(
            even[i],
            math.multiply(
                w,
                odd[i],
            )
        )
        arr[i + n / 2] = math.subtract(
            even[i],
            math.multiply(
                w,
                odd[i],
            )
        )

        if (invert) {
            arr[i] = math.divide(arr[i], 2)
            arr[i + n / 2] = math.divide(arr[i + n / 2], 2)
        }
        w = math.multiply(w, w1);
    }
}

export function dft_iterative(
    arr: math.MathType[], // length must be a power of 2
    invert: boolean = false
) {
    const n = arr.length
    let nbits = 0
    while ((1 << nbits) < n) nbits += 1;
    
    // Bit-reverse permutation
    const index = Array(n).fill(0).map((_, x) => {
        let res = 0;
        for (let i = 0; i < nbits; i++) {
            const m = 1 << i;
            if (x & m) {
                res |= 1 << (nbits - 1 - i);
            }
        }
        return res
    })

    for (let i = 0; i < n; i++) {
        if (index[i] < i) {
            const temp = arr[i];
            arr[i] = arr[index[i]];
            arr[index[i]] = temp;
        }
    }

    for (let l = 2; l <= n; l <<= 1) {
        const w1: math.MathType = math.complex({
            r: 1,
            phi: invert
                ? -2 * Math.PI / l
                : 2 * Math.PI / l
        });
        for (let i = 0; i < n; i += l) {
            let w: math.MathType = math.complex(1);
            for (let j = 0; j < l / 2; j ++) {
                const u = arr[i+j];
                const v = math.multiply(arr[i+j+l/2], w);
                arr[i+j] = math.add(u,v);
                arr[i+j+l/2] = math.subtract(u,v);
                w = math.multiply(w, w1);
            }
        }
    }

    if (invert) {
        for (let i = 0; i < n; i++) {
            arr[i] = math.divide(arr[i], n);
        }
    }
}

export function cr_multiply_poly(poly1: math.MathType[], poly2: math.MathType[]): math.Complex[] {
    const tn = poly1.length + poly2.length - 1;
    let n = 1;
    while (n < tn) n <<= 1; // Find the next power of 2 greater than or equal to tn
    const poly1_ext = poly1.concat(Array(n - poly1.length).fill(math.complex(0)));
    const poly2_ext = poly2.concat(Array(n - poly2.length).fill(math.complex(0)));

    dft_recursive(poly1_ext);
    dft_recursive(poly2_ext);
    for (let i = 0; i < n; i++) {
        poly1_ext[i] = math.multiply(poly1_ext[i], poly2_ext[i]);
    }
    dft_recursive(poly1_ext, true);
    return poly1_ext.slice(0, tn) as math.Complex[];
}

type CIMultiplyPolyVerboseResult = {
    poly1_ext: math.Complex[];
    poly2_ext: math.Complex[];
    poly1_dft: math.Complex[];
    poly2_dft: math.Complex[];
    poly_dft: math.Complex[];
    poly_ext: math.Complex[];
    poly_trim: math.Complex[];
}

export function ci_multiply_poly_verbose(poly1: math.MathType[], poly2: math.MathType[]): CIMultiplyPolyVerboseResult {
    const tn = poly1.length + poly2.length - 1;
    let n = 1;
    while (n < tn) n <<= 1; // Find the next power of 2 greater than or equal to tn
    const poly1_ext = poly1.concat(Array(n - poly1.length).fill(math.complex(0))) as math.Complex[];
    const poly2_ext = poly2.concat(Array(n - poly2.length).fill(math.complex(0))) as math.Complex[];
    const poly1_dft = [...poly1_ext]
    const poly2_dft = [...poly2_ext]
    dft_iterative(poly1_dft);
    dft_iterative(poly2_dft);
    const poly_dft: math.Complex[] = []
    for (let i = 0; i < n; i++) {
        poly_dft[i] = math.multiply(poly1_dft[i], poly2_dft[i]) as math.Complex;
    }
    const poly_ext: math.Complex[] = [...poly_dft];
    dft_iterative(poly_ext, true);
    return {
        poly1_ext,
        poly2_ext,
        poly1_dft,
        poly2_dft,
        poly_dft,
        poly_ext,
        poly_trim: poly_ext.slice(0, tn) as math.Complex[], // Fixed: should slice poly_ext
    }
}

export type DftStringSearchResult = {
    rtext1?: number[];
    rtext1_ext?: number[];
    rtext1_dft?: math.Complex[];
    rtext2?: number[];
    rtext2_ext?: number[];
    rtext2_dft?: math.Complex[];
    pat1?: number[];
    pat1_ext?: number[];
    pat1_dft?: math.Complex[];
    pat2?: number[];
    pat2_ext?: number[];
    pat2_dft?: math.Complex[];
    pt2_dft?: math.Complex[];
    pt2_ext?: number[];
    pt2?: number[];
    p2t_ext?: number[];
    p2t_dft?: math.Complex[];
    p2t?: number[];
    s?: number;
    ret?: number[];
    indices?: number[];
}

export function dft_string_search(text: string, pattern: string): DftStringSearchResult {
    // Convert text to numbers (reversed for convolution)
    const text1 = Array.from(text).map(c => math.complex(c.charCodeAt(0))).reverse();
    const text2 = text1.map(c => math.pow(c, 2)) as math.Complex[];

    // Convert pattern to numbers
    const pat1 = Array.from(pattern).map(c => math.complex(c === '?' ? 0 : c.charCodeAt(0)));
    const pat2 = pat1.map(c => math.pow(c, 2)) as math.Complex[];

    // First convolution: pat1 * text2
    const { 
        poly1_ext: pat1_ext,  
        poly2_ext: text2_ext,
        poly1_dft: pat1_dft,
        poly2_dft: text2_dft,
        poly_dft: pt2_dft,
        poly_ext: pt2_ext,
        poly_trim: pt2,
    } = ci_multiply_poly_verbose(pat1, text2);
    
    // Second convolution: pat2 * text1
    const {
        poly1_ext: pat2_ext,
        poly2_ext: text1_ext,
        poly1_dft: pat2_dft,
        poly2_dft: text1_dft,
        poly_dft: p2t_dft,
        poly_ext: p2t_ext,
        poly_trim: p2t,
    } = ci_multiply_poly_verbose(pat2, text1);

    // Calculate sum of pattern cubed
    const s = pat1.reduce((a: math.Complex, b: math.Complex) => math.add(a, math.pow(b, 3) as math.Complex), math.complex(0));
    
    // Calculate matching function: pt2 - 2*p2t + s
    const ret: number[] = []
    for (let i = 0; i < pt2.length; i++) {
        const val = pt2[i].re - 2 * p2t[i].re + s.re;
        ret[i] = Math.round(val);
    }
    
    // Find matches (where ret[i] == 0)
    const indices = [];
    for (let i = 0; i < ret.length; i++) {
        if (ret[i] === 0) {
            // Convert convolution index back to text position
            const textPos = text.length - 1 - i;
            indices.push(textPos);
        }
    }
    
    return {
        rtext1: text1.map(c => c.re),
        rtext1_ext: text1_ext.map(c => c.re),
        rtext1_dft: text1_dft,
        rtext2: text2.map(c => c.re),
        rtext2_ext: text2_ext.map(c => c.re),
        rtext2_dft: text2_dft,
        pat1: pat1.map(c => c.re),
        pat1_ext: pat1_ext.map(c => c.re),
        pat1_dft: pat1_dft,
        pat2: pat2.map(c => c.re),
        pat2_ext: pat2_ext.map(c => c.re),
        pat2_dft: pat2_dft,
        pt2_dft: pt2_dft,
        pt2_ext: pt2_ext.map(c => c.re),
        pt2: pt2.map(c => c.re),
        p2t_ext: p2t_ext.map(c => c.re),
        p2t_dft: p2t_dft,
        p2t: p2t.map(c => c.re),
        s: s.re,
        ret: ret,
        indices: indices,
    };
}