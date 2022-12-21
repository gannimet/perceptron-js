export class Perceptron {
  iterations: PerceptronIteration[] = [];

  constructor(
    private initialBias: number,
    private initialW0: number,
    private initialW1: number,
    private initialLearningRate: number,
  ) {}
}

export class PerceptronIteration {}
