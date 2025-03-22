import {
  LinearFunctionParams,
  NeuronActivation,
  Point,
  PointClass,
  TrainingError,
} from './types';

export class Perceptron {
  iterations: PerceptronIteration[] = [];

  constructor(
    public bias: number,
    public w0: number,
    public w1: number,
    public activationFn: (s: number) => NeuronActivation,
  ) {}

  startNewIteration() {
    this.iterations = [...this.iterations, new PerceptronIteration()];
  }

  getCurrentIteration(): PerceptronIteration | undefined {
    if (this.iterations.length === 0) {
      return undefined;
    }

    return this.iterations[this.iterations.length - 1];
  }

  getMostRecentIterationRow(): PerceptronIterationRow | undefined {
    const currentIteration = this.getCurrentIteration();

    if (!currentIteration) {
      return undefined;
    }

    const rowsCount = currentIteration.iterationRows.length;

    if (rowsCount === 0) {
      return undefined;
    }

    return currentIteration.iterationRows[rowsCount - 1];
  }

  getCurrentLinearFunctionParamsGuess(): LinearFunctionParams | undefined {
    const mostRecentRow = this.getMostRecentIterationRow();

    if (!mostRecentRow) {
      return undefined;
    }

    return {
      m: -(this.w0 / this.w1),
      n: -(this.bias / this.w1),
    };
  }

  reset() {
    this.bias = this.w0 = this.w1 = 0;
    this.iterations = [];
  }

  train(classAPoints: Point[], classBPoints: Point[], learningRate: number) {
    const currentIteration = this.getCurrentIteration();

    if (!currentIteration) {
      throw new Error('No current iteration');
    }

    const totalNumPoints = classAPoints.length + classBPoints.length;
    const classifiedPoints: { [key in PointClass]: Point[] } = {
      A: classAPoints,
      B: classBPoints,
    };

    let deltaBias = 0;
    let deltaW0 = 0;
    let deltaW1 = 0;

    Object.keys(classifiedPoints).forEach((pointClass) => {
      classifiedPoints[pointClass as PointClass].forEach((point) => {
        const desired = pointClass === 'A' ? 0 : 1;
        const weightedSum = this.bias + this.w0 * point.x + this.w1 * point.y;
        const activation = this.activationFn(weightedSum);
        const error = (desired - activation) as TrainingError;

        const pointDeltaBias = learningRate * error;
        const pointDeltaW0 = learningRate * error * point.x;
        const pointDeltaW1 = learningRate * error * point.y;

        deltaBias += pointDeltaBias;
        deltaW0 += pointDeltaW0;
        deltaW1 += pointDeltaW1;

        const newIterationRow = new PerceptronIterationRow(
          this.bias,
          this.w0,
          this.w1,
          point,
          desired,
          weightedSum,
          activation,
          error,
          learningRate,
          pointDeltaBias,
          pointDeltaW0,
          pointDeltaW1,
        );

        currentIteration.addRow(newIterationRow);
      });
    });

    const averageDeltaBias = deltaBias / totalNumPoints;
    const averageDeltaW0 = deltaW0 / totalNumPoints;
    const averageDeltaW1 = deltaW1 / totalNumPoints;

    this.bias += averageDeltaBias;
    this.w0 += averageDeltaW0;
    this.w1 += averageDeltaW1;

    currentIteration.summaryRow = {
      bias: this.bias,
      w0: this.w0,
      w1: this.w1,
      deltaBias: averageDeltaBias,
      deltaW0: averageDeltaW0,
      deltaW1: averageDeltaW1,
    };
  }
}

export class PerceptronIteration {
  id: string;
  iterationRows: PerceptronIterationRow[] = [];
  summaryRow?: PerceptronSummaryRow;

  constructor() {
    this.id = crypto.randomUUID();
  }

  addRow(iterationRow: PerceptronIterationRow) {
    this.iterationRows = [...this.iterationRows, iterationRow];
  }
}

export class PerceptronIterationRow {
  id: string;

  constructor(
    public bias: number,
    public w0: number,
    public w1: number,
    public point: Point,
    public desired: NeuronActivation,
    public weightedSum: number,
    public activation: NeuronActivation,
    public error: TrainingError,
    public learningRate: number,
    public deltaBias: number,
    public deltaW0: number,
    public deltaW1: number,
  ) {
    this.id = crypto.randomUUID();
  }
}

export type PerceptronSummaryRow = {
  bias: number;
  w0: number;
  w1: number;
  deltaBias: number;
  deltaW0: number;
  deltaW1: number;
};
