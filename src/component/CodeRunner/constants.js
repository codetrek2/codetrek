export const LANGUAGE_VERSIONS = {
  javascript: "18.15.0",
  typescript: "5.0.3",
  python: "3.10.0",
  java: "15.0.2",
  csharp: "6.12.0",
  php: "8.2.3",
};

export const CODE_SNIPPETS = {
  javascript: `
function fibonacci(n) {
    let sequence = [0, 1];
    for (let i = 2; i < n; i++) {
        sequence.push(sequence[i - 1] + sequence[i - 2]);
    }
    return sequence;
}

console.log(fibonacci(10));
  `,
  typescript: `
function fibonacci(n: number): number[] {
    const sequence = [0, 1];
    for (let i = 2; i < n; i++) {
        sequence.push(sequence[i - 1] + sequence[i - 2]);
    }
    return sequence;
}

console.log(fibonacci(10)); 
  `,
  python: `
def fibonacci(n):
    sequence = [0, 1]
    for i in range(2, n):
        sequence.append(sequence[i - 1] + sequence[i - 2])
    return sequence

print(fibonacci(10)) 
  `,
  java: `
public class Fibonacci {
    public static void main(String[] args) {
        int n = 10; 
        int[] sequence = new int[n];
        sequence[0] = 0;
        sequence[1] = 1;
        for (int i = 2; i < n; i++) {
            sequence[i] = sequence[i - 1] + sequence[i - 2];
        }
        for (int num : sequence) {
            System.out.print(num + " ");
        }
    }
}
  `,
  csharp: `
using System;

public class Fibonacci {
    public static void Main(string[] args) {
        int n = 10; 
        int[] sequence = new int[n];
        sequence[0] = 0;
        sequence[1] = 1;
        for (int i = 2; i < n; i++) {
            sequence[i] = sequence[i - 1] + sequence[i - 2];
        }
        Console.WriteLine(string.Join(", ", sequence));
    }
}
  `,
  php: `
<?php

function fibonacci($n) {
    $sequence = array(0, 1);
    for ($i = 2; $i < $n; $i++) {
        $sequence[] = $sequence[$i - 1] + $sequence[$i - 2];
    }
    return $sequence;
}

print_r(fibonacci(10)); 
  `
};
