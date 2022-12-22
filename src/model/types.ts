export type PointClass = 'A' | 'B';

export type NeuronActivation = 0 | 1;

export type TrainingError = -1 | 0 | 1;

export interface Point {
  x: number;
  y: number;
}

export interface LinearFunctionParams {
  m: number;
  n: number;
}
