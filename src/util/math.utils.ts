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

export const heaviside = (s: number): NeuronActivation => {
  return s > 0 ? 1 : 0;
};
