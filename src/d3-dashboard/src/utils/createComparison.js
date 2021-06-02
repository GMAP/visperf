import { flatten2dArray, operation2d } from '.';

export default function createComparison(experiment1, experiment2) {
    const experiment1Flat = flatten2dArray(experiment1);
    const experiment2Flat = flatten2dArray(experiment2);

    const sum1 = experiment1Flat.reduce((a, b) => a + b);
    const sum2 = experiment2Flat.reduce((a, b) => a + b);
    const mean1 = sum1 / (experiment1.length * experiment1[0].length);
    const mean2 = sum2 / (experiment2.length * experiment2[0].length);

    return {
        mean: operation2d(experiment1, experiment2, '-'),
        mean_relative:
            sum2 <= 0
                ? experiment2
                : operation2d(
                      operation2d(
                          operation2d(experiment1, sum1, '/'),
                          operation2d(experiment2, sum2, '/'),
                          '-',
                      ),
                      100,
                      '*',
                  ),
        mean_relative_reverse:
            sum1 <= 0
                ? experiment1
                : operation2d(
                      operation2d(
                          operation2d(experiment2, sum2, '/'),
                          operation2d(experiment1, sum1, '/'),
                          '-',
                      ),
                      100,
                      '*',
                  ),
        mean_value: mean1 <= 0 ? 0 : (mean2 / mean1 - 1) * 100,
    };
}
