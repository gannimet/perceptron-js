import React from 'react';
import { PerceptronIteration } from '../../model/Perceptron';
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
          <th>a</th>
          <th>e</th>
          <th>Δb</th>
          <th>Δw0</th>
          <th>Δw1</th>
        </tr>
      </thead>
    );
  };

  const renderIterationBody = (iteration: PerceptronIteration) => {
    return (
      <tbody key={iteration.id} className="iterations-table__body">
        {iteration.iterationRows.map((iterationRow) => (
          <tr key={iterationRow.id}>
            <td>{iterationRow.bias}</td>
            <td>{iterationRow.w0}</td>
            <td>{iterationRow.w1}</td>
            <td>{iterationRow.point.x}</td>
            <td>{iterationRow.point.y}</td>
            <td>{iterationRow.desired}</td>
            <td>{iterationRow.weightedSum}</td>
            <td>{iterationRow.activation}</td>
            <td>{iterationRow.error}</td>
            <td>{iterationRow.deltaBias}</td>
            <td>{iterationRow.deltaW0}</td>
            <td>{iterationRow.deltaW1}</td>
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
