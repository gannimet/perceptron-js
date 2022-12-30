import React from 'react';
import { PerceptronIteration } from '../../model/Perceptron';
import { getWeightColorValue, rounded } from '../../util/math.utils';
import './IterationsTable.scss';
import { IterationsTableProps } from './IterationsTable.types';

const IterationsTable = React.memo<IterationsTableProps>(({ iterations }) => {
  const renderHead = () => {
    return (
      <thead className="iterations-table__head">
        <tr>
          <th>b</th>
          <th>w0</th>
          <th>w1</th>
          <th>x0</th>
          <th>x1</th>
          <th>d</th>
          <th>s</th>
          <th>y</th>
          <th>e</th>
          <th>Δb</th>
          <th>Δw0</th>
          <th>Δw1</th>
        </tr>
      </thead>
    );
  };

  const getWeightCSS = (value: number): React.CSSProperties => {
    return {
      backgroundColor: `rgb(${getWeightColorValue(
        value,
        'r',
      )}, ${getWeightColorValue(value, 'g')}, ${getWeightColorValue(
        value,
        'b',
      )})`,
    };
  };

  const renderIterationBody = (iteration: PerceptronIteration) => {
    return (
      <tbody key={iteration.id} className="iterations-table__body">
        {iteration.iterationRows.map((iterationRow) => (
          <tr key={iterationRow.id}>
            <td style={getWeightCSS(iterationRow.bias)}>
              {rounded(iterationRow.bias)}
            </td>
            <td style={getWeightCSS(iterationRow.w0)}>
              {rounded(iterationRow.w0)}
            </td>
            <td style={getWeightCSS(iterationRow.w1)}>
              {rounded(iterationRow.w1)}
            </td>
            <td
              className={`input-cell ${
                iterationRow.desired === 0 ? 'input-cell--a' : 'input-cell--b'
              }`}
            >
              {iterationRow.point.x}
            </td>
            <td
              className={`input-cell ${
                iterationRow.desired === 0 ? 'input-cell--a' : 'input-cell--b'
              }`}
            >
              {iterationRow.point.y}
            </td>
            <td>{iterationRow.desired}</td>
            <td>{rounded(iterationRow.weightedSum)}</td>
            <td>{iterationRow.activation}</td>
            <td
              className={`error-cell ${
                iterationRow.error === 0
                  ? 'error-cell--green'
                  : 'error-cell--red'
              }`}
            >
              {iterationRow.error}
            </td>
            <td>{rounded(iterationRow.deltaBias)}</td>
            <td>{rounded(iterationRow.deltaW0)}</td>
            <td>{rounded(iterationRow.deltaW1)}</td>
          </tr>
        ))}
      </tbody>
    );
  };

  return (
    <table className="iterations-table">
      {renderHead()}

      {iterations.map((iteration) => {
        return renderIterationBody(iteration);
      })}
    </table>
  );
});

IterationsTable.displayName = 'IterationsTable';

export default IterationsTable;
