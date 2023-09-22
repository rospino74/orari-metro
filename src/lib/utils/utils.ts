export const toTitleCase = (txt: string): string => txt
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

export const padStartArray = <T, F>(len: number, fill: F, arr: Array<T>): Array<F | T> => Array(len)
    .fill(fill)
    .concat(arr)
    .slice(-Math.max(len, arr.length));

export const padEndArray = <T, F>(len: number, fill: F, arr: Array<T>): Array<F | T> => arr
    .concat(Array(len).fill(fill))
    .slice(0, Math.max(len, arr.length));

export const sortTransits = (arr: Array<Transit>): Array<Transit> => arr.sort((a, b) => {
    const { branch: branchA, dest: destA } = a;
    const { branch: branchB, dest: destB } = b;

    // Rimuovo lo slash (tanto l'info è in branch) e converto in numero se possibile
    const lineA = Number(a.line.replace("/", "")) || a.line;
    const lineB = Number(b.line.replace("/", "")) || b.line;

    if (lineA > lineB)
        return 1;

    if (lineA < lineB)
        return -1;

    // Se A non è / allora va prima lei
    if (!branchA && branchB)
        return 1;

    if (branchA && !branchB)
        return -1;

    // Infine controllo quale delle due destinazioni viene prima
    return destA.localeCompare(destB);
});