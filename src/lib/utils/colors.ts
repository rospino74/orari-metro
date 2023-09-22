// https://codepen.io/davidhalford/pen/AbKBNr
export const getCorrectTextColor = (c: Color, dark: Color = "#000000", light: Color = "#ffffff"): Color => {
    const threshold = 130; /* about half of 256. Lower threshold equals more dark text on dark background  */
    let r: number, g: number, b: number;

    if (isHex(c)) {
        r = parseInt(c.slice(1, 2), 16);
        g = parseInt(c.slice(3, 5), 16);
        b = parseInt(c.slice(5, 7), 16);
    } else if (isRGBA(c)) {
        const numbers = c.slice(5, -1).split(",").map((i) => Number(i));
        [r, g, b] = numbers;
    } else if (isRGB(c)) {
        const numbers = c.slice(4, -1).split(",").map((i) => Number(i));
        [r, g, b] = numbers;
    } else if (isHSL(c)) {
        return getCorrectTextColor(
            hslToRgb(c), dark, light
        );
    }

    // Tutti i casi sono stati analizzati
    // @ts-expect-error
    const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
    return (yiq >= threshold) ? dark : light;
}

function isHex(c: Color): c is HEXColor {
    return c.startsWith("#");
}

function isRGBA(c: Color): c is RGBAColor {
    return c.toLowerCase().startsWith("rgba(");
}

function isRGB(c: Color): c is RGBColor {
    return c.toLowerCase().startsWith("rgb(");
}

function isHSL(c: Color): c is HSLColor {
    return c.toLowerCase().startsWith("hsl(");
}

function hslToRgb(c: HSLColor): RGBColor {
    let r, g, b;
    const [h, s, l] = c.slice(4, -1).split(",").map((i) => Number(i.replace('%', '')));

    const hueToRgb = (p: number, q: number, t: number) => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1 / 6) return p + (q - p) * 6 * t;
        if (t < 1 / 2) return q;
        if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
        return p;
    }

    if (s === 0) {
        r = g = b = l; // achromatic
    } else {
        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;
        r = hueToRgb(p, q, h + 1 / 3);
        g = hueToRgb(p, q, h);
        b = hueToRgb(p, q, h - 1 / 3);
    }

    return `rgb(${Math.round(r * 255)}, ${Math.round(g * 255)}, ${Math.round(b * 255)})`;
}