export default function operation2d(a, b, operation) {
    const c = JSON.parse(JSON.stringify(a));
    for (let i = 0; i < a.length; i++) {
        for (let j = 0; j < a[0].length; j++) {
            if (operation === '+') {
                c[i][j] = a[i][j] + b[i][j];
            } else if (operation === '-') {
                c[i][j] = a[i][j] - b[i][j];
            } else if (operation === '/') {
                c[i][j] = a[i][j] / b;
            } else if (operation === '//') {
                c[i][j] = a[i][j] / b[i][j];
            } else if (operation === '*') {
                c[i][j] = a[i][j] * b;
            } else if (operation === '**') {
                c[i][j] = a[i][j] * b[i][j];
            }
        }
    }
    return c;
}
