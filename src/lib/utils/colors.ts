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
            hslToHEX(c), dark, light
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

// https://stackoverflow.com/a/44134328
function hslToHEX(c: HSLColor): HEXColor {
    const [h, s, l] = c.slice(4, -1).split(",").map((i) => Number(i.replace('%', '')));

    const L = l / 100;
    const a = s * Math.min(L, 1 - L) / 100;
    const f = (n: number) => {
        const k = (n + h / 30) % 12;
        const color = L - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
        return Math.round(255 * color).toString(16).padStart(2, '0');   // convert to Hex and prefix "0" if needed
    };

    return `#${f(0)}${f(8)}${f(4)}`;
}