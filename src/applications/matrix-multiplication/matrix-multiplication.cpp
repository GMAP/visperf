#include <cmath>
#include <iostream>
#include <thread>

#define MATRIX_SIZE 50

using namespace std;

static int a[MATRIX_SIZE][MATRIX_SIZE];
static int b[MATRIX_SIZE][MATRIX_SIZE];
static int c[MATRIX_SIZE][MATRIX_SIZE];

void check_matrix() {
    if (MATRIX_SIZE != MATRIX_SIZE) {
        runtime_error(
            "Error: column of first matrix not equal to row of second matrix.");
        exit(-1);
    }
}

void fill_matrix(int a[MATRIX_SIZE][MATRIX_SIZE]) {
    for (int i = 0; i < MATRIX_SIZE; i++) {
        for (int j = 0; j < MATRIX_SIZE; j++) {
            a[i][j] = 0;
        }
    }
}

void matrix_multiplication(int a[MATRIX_SIZE][MATRIX_SIZE],
                           int b[MATRIX_SIZE][MATRIX_SIZE],
                           int c[MATRIX_SIZE][MATRIX_SIZE]) {
    for (int i = 0; i < MATRIX_SIZE; ++i) {
        for (int j = 0; j < MATRIX_SIZE; ++j) {
            for (int k = 0; k < MATRIX_SIZE; ++k) {
                c[i][j] += a[i][k] * b[k][j];
            }
        }
    }
}

int check_result(int c[MATRIX_SIZE][MATRIX_SIZE]) {
    int sum = 0;
    for (int i = 0; i < MATRIX_SIZE; i++) {
        for (int j = 0; j < MATRIX_SIZE; j++) {
            sum += c[i][j];
        }
    }
    return sum;
}

void display_matrix(int c[MATRIX_SIZE][MATRIX_SIZE]) {
    for (int i = 0; i < MATRIX_SIZE; ++i) {
        for (int j = 0; j < MATRIX_SIZE; ++j) {
            cout << " " << c[i][j];
            if (j == MATRIX_SIZE - 1) {
                cout << endl;
            }
        }
    }
}

void dump_task() {
    int i = 0;
    while (i < pow(MATRIX_SIZE, 1)) {
        i++;
        cout << i;
    }
}

int main() {
    int num_threads = 10;
    thread threads[num_threads];
    for (int i = 0; i < num_threads; i++) {
        threads[i] = thread(&dump_task);
    }

    cout << "Filling matrices..." << endl;
    fill_matrix(a);
    fill_matrix(b);
    fill_matrix(c);

    cout << "Performing multiplication..." << endl;
    matrix_multiplication(a, b, c);

    cout << "Checking results..." << endl;
    int result = check_result(c);
    if (result != 0) {
        runtime_error("Error: the final result must be zero.");
        exit(-1);
    }

    cout << "Displaying result matrix..." << endl;
    display_matrix(c);

    for (int i = 0; i < num_threads; i++) {
        threads[i].join();
    }

    return 0;
}
