import { v4 as uuidv4 } from 'uuid';
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
    private bias: number,
    private w0: number,
    private w1: number,
    private learningRate: number,
    private activationFn: (s: number) => NeuronActivation,
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

  train(point: Point, pointClass: PointClass): PerceptronIterationRow {
    const currentIteration = this.getCurrentIteration();

    if (!currentIteration) {
      throw new Error('No current iteration');
    }

    const biasBefore = this.bias;
    const w0Before = this.w0;
    const w1Before = this.w1;
    const desired = pointClass === 'A' ? 0 : 1;
    const weightedSum = biasBefore + w0Before * point.x + w1Before * point.y;
    const activation = this.activationFn(weightedSum);
    const error: TrainingError = (desired - activation) as TrainingError;
    const deltaBias = this.learningRate * error;
    const deltaW0 = this.learningRate * error * point.x;
    const deltaW1 = this.learningRate * error * point.y;

    this.bias += deltaBias;
    this.w0 += deltaW0;
    this.w1 += deltaW1;

    const newIterationRow = new PerceptronIterationRow(
      biasBefore,
      w0Before,
      w1Before,
      point,
      desired,
      weightedSum,
      activation,
      error,
      this.learningRate,
      deltaBias,
      deltaW0,
      deltaW1,
    );

    currentIteration.addRow(newIterationRow);

    return newIterationRow;
  }
}

export class PerceptronIteration {
  id: string;
  iterationRows: PerceptronIterationRow[] = [];

  constructor() {
    this.id = uuidv4();
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
    this.id = uuidv4();
  }
}
