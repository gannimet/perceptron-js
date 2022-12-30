import { GRID_CONFIG } from '../config/constants';
import { NeuronActivation, Point } from '../model/types';

const { plotWidth, plotHeight, xMin, xMax, yMin, yMax, gridStep } = GRID_CONFIG;

export const translateCartesianPointToCanvasCoords = (point: Point): Point => {
  return {
    x: translateCartesianXCoordToCanvasXCoord(point.x),
    y: translateCartesianYCoordToCanvasYCoord(point.y),
  };
};

export const translateCartesianXCoordToCanvasXCoord = (
  cartesianX: number,
): number => {
  const cartesianWidth = xMax - xMin;

  return (plotWidth / cartesianWidth) * (cartesianX - xMin);
};

export const translateCartesianYCoordToCanvasYCoord = (
  cartesianY: number,
): number => {
  const cartesianHeight = yMax - yMin;

  return (plotHeight / cartesianHeight) * (yMax - cartesianY);
};

export const translateCanvasPointToCartesianPoint = (point: Point): Point => {
  return {
    x: translateCanvasXCoordToCartesianXCoord(point.x),
    y: translateCanvasYCoordToCartesianYCoord(point.y),
  };
};

export const translateCanvasXCoordToCartesianXCoord = (
  canvasX: number,
): number => {
  const cartesianWidth = xMax - xMin;

  return (canvasX * cartesianWidth) / plotWidth + xMin;
};

export const translateCanvasYCoordToCartesianYCoord = (
  canvasY: number,
): number => {
  const cartesianHeight = yMax - yMin;

  return yMax - (canvasY * cartesianHeight) / plotHeight;
};

export const getXCoordsOfVerticalGridLines = (): number[] => {
  const cartesianCoords: number[] = [];

  // Right hand side of y axis
  for (let x = gridStep; x < xMax; x += gridStep) {
    cartesianCoords.push(x);
  }

  // Left hand side of y axis
  for (let x = -gridStep; x > xMin; x -= gridStep) {
    cartesianCoords.push(x);
  }

  return cartesianCoords.map((cartesianCoord) => {
    return translateCartesianXCoordToCanvasXCoord(cartesianCoord);
  });
};

export const getYCoordsOfHorizontalGridLines = (): number[] => {
  const cartesianCoords: number[] = [];

  // Above x axis
  for (let y = gridStep; y < yMax; y += gridStep) {
    cartesianCoords.push(y);
  }

  // Below x axis
  for (let y = -gridStep; y > yMin; y -= gridStep) {
    cartesianCoords.push(y);
  }

  return cartesianCoords.map((cartesianCoord) => {
    const result = translateCartesianYCoordToCanvasYCoord(cartesianCoord);

    return result;
  });
};

export const rounded = (n: number): number => {
  return Math.round((n + Number.EPSILON) * 100) / 100;
};

export const heaviside = (s: number): NeuronActivation => {
  return s > 0 ? 1 : 0;
};

export const getWeightColorValue = (
  weightValue: number,
  channel: 'r' | 'g' | 'b',
): number => {
  const weightColorScale = GRID_CONFIG.weightColorScale;

  if (weightValue > 0) {
    return (
      ((weightColorScale.highValueMax[channel] - 255) /
        weightColorScale.capValue) *
        Math.min(weightValue, weightColorScale.capValue) +
      255
    );
  } else {
    return (
      ((weightColorScale.lowValueMax[channel] - 255) /
        -weightColorScale.capValue) *
        Math.max(weightValue, -weightColorScale.capValue) +
      255
    );
  }
};

export const shuffleArray = (array: unknown[]): void => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));

    [array[i], array[j]] = [array[j], array[i]];
  }
};
