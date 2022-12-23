import React, { useMemo } from 'react';
import { Circle, Group, Layer, Line, Rect, Stage } from 'react-konva';
import { GRID_CONFIG } from '../../config/constants';
import { Point, PointClass } from '../../model/types';
import {
  getXCoordsOfVerticalGridLines,
  getYCoordsOfHorizontalGridLines,
  translateCanvasPointToCartesianPoint,
  translateCartesianPointToCanvasCoords,
  translateCartesianXCoordToCanvasXCoord,
  translateCartesianYCoordToCanvasYCoord,
} from '../../util/math.utils';
import './ScatterPlot.scss';
import { ScatterPlotProps } from './ScatterPlot.types';

const ScatterPlot = React.memo<ScatterPlotProps>(
  ({ classAPoints, classBPoints, functionParams, onClick }) => {
    const {
      plotWidth,
      plotHeight,
      axisColor,
      gridColor,
      backgroundColor,
      delimiterLineColor,
      xMin,
      xMax,
    } = GRID_CONFIG;
    const gridXCoords = useMemo(() => getXCoordsOfVerticalGridLines(), []);
    const yAxesXCoord = useMemo(
      () => translateCartesianXCoordToCanvasXCoord(0),
      [],
    );
    const gridYCoords = useMemo(() => getYCoordsOfHorizontalGridLines(), []);
    const xAxesYCoord = useMemo(
      () => translateCartesianYCoordToCanvasYCoord(0),
      [],
    );

    const renderBaseGrid = () => {
      return (
        <>
          <Rect
            x={0}
            y={0}
            width={plotWidth}
            height={plotWidth}
            fill={backgroundColor}
            stroke={gridColor}
          />

          <Line
            points={[yAxesXCoord, 0, yAxesXCoord, plotHeight]}
            stroke={axisColor}
            strokeWidth={1}
          />

          {gridXCoords.map((x) => {
            return (
              <Line
                key={x}
                points={[x, 0, x, plotHeight]}
                stroke={gridColor}
                strokeWidth={1}
              />
            );
          })}

          <Line
            points={[0, xAxesYCoord, plotWidth, xAxesYCoord]}
            stroke={axisColor}
            strokeWidth={1}
          />

          {gridYCoords.map((y) => {
            return (
              <Line
                key={y}
                points={[0, y, plotWidth, y]}
                stroke={gridColor}
                strokeWidth={1}
              />
            );
          })}
        </>
      );
    };

    const renderPoint = (point: Point, clazz: PointClass) => {
      const canvasCoords = translateCartesianPointToCanvasCoords(point);

      return (
        <Circle
          key={`${point.x}_${point.y}`}
          x={canvasCoords.x}
          y={canvasCoords.y}
          radius={2}
          strokeWidth={0}
          fill={clazz === 'A' ? 'red' : 'blue'}
        />
      );
    };

    const renderFunctionLine = () => {
      if (!functionParams) {
        return null;
      }

      const p1 = translateCartesianPointToCanvasCoords({
        x: xMin,
        y: functionParams.m * xMin + functionParams.n,
      });
      const p2 = translateCartesianPointToCanvasCoords({
        x: xMax,
        y: functionParams.m * xMax + functionParams.n,
      });

      return (
        <Line
          points={[p1.x, p1.y, p2.x, p2.y]}
          stroke={delimiterLineColor}
          strokeWidth={1}
        />
      );
    };

    const canvasClicked = (event: { evt: MouseEvent }) => {
      if (!onClick) {
        return;
      }

      const canvasPoint: Point = {
        x: event.evt.offsetX,
        y: event.evt.offsetY,
      };
      const { x: cartesianX, y: cartesianY } =
        translateCanvasPointToCartesianPoint(canvasPoint);

      const roundedCartesianPoint: Point = {
        x: Math.round(cartesianX),
        y: Math.round(cartesianY),
      };

      onClick(roundedCartesianPoint);
    };

    return (
      <div className="scatter-plot">
        <Stage width={plotWidth} height={plotHeight}>
          <Layer>
            <Group onClick={canvasClicked}>
              {renderBaseGrid()}
              {renderFunctionLine()}

              {classAPoints.map((point) => renderPoint(point, 'A'))}
              {classBPoints.map((point) => renderPoint(point, 'B'))}
            </Group>
          </Layer>
        </Stage>
      </div>
    );
  },
);

ScatterPlot.displayName = 'ScatterPlot';

export default ScatterPlot;
