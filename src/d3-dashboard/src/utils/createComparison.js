import { flatten2dArray } from '.';

function operate(a, b, operation) {
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

export default function createComparison(experiment1, experiment2) {
    const experiment1Flat = flatten2dArray(experiment1);
    const experiment2Flat = flatten2dArray(experiment2);

    const sum1 = experiment1Flat.reduce((a, b) => a + b);
    const sum2 = experiment2Flat.reduce((a, b) => a + b);
    const mean1 = sum1 / (experiment1.length * experiment1[0].length);
    const mean2 = sum2 / (experiment2.length * experiment2[0].length);

    return {
        mean: operate(experiment1, experiment2, '-'),
        mean_relative:
            sum2 <= 0
                ? experiment2
                : operate(
                      operate(
                          operate(experiment1, sum1, '/'),
                          operate(experiment2, sum2, '/'),
                          '-',
                      ),
                      100,
                      '*',
                  ),
        mean_value: mean1 <= 0 ? 0 : (mean1 / mean2 - 1) * 100,
    };
}
