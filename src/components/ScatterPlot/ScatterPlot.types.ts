import { LinearFunctionParams, Point } from '../../model/types';

export interface ScatterPlotProps {
  classAPoints: Point[];
  classBPoints: Point[];
  functionParams?: LinearFunctionParams;
  onClick?: (point: Point) => void;
}
