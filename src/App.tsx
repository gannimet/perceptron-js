import { useMemo, useState } from 'react';
import './App.scss';
import IterationsTable from './components/IterationsTable/IterationsTable';
import ScatterPlot from './components/ScatterPlot/ScatterPlot';
import { Perceptron, PerceptronIteration } from './model/Perceptron';
import { LinearFunctionParams, Point } from './model/types';
import { heaviside } from './util/math.utils';

function App() {
  const [classAPoints] = useState<Point[]>([
    { x: -3, y: 5 },
    { x: 12, y: 9 },
    { x: -9, y: 10 },
    { x: 16, y: 4 },
    { x: -10, y: -8 },
  ]);
  const [classBPoints] = useState<Point[]>([
    { x: 14, y: -12 },
    { x: 16, y: -11 },
    { x: -7, y: -9 },
    { x: -18, y: -18 },
    { x: 1, y: -10 },
  ]);
  const perceptron = useMemo(() => {
    return new Perceptron(0, 0, 0, 1, heaviside);
  }, []);
  const [iterations, setIterations] = useState<PerceptronIteration[]>([]);
  const [functionParams, setFunctionParams] = useState<
    LinearFunctionParams | undefined
  >();

  const trainButtonClicked = () => {
    perceptron.startNewIteration();

    classAPoints.forEach((point) => {
      perceptron.train(point, 'A');
    });

    classBPoints.forEach((point) => {
      perceptron.train(point, 'B');
    });

    setIterations(perceptron.iterations);
    setFunctionParams(perceptron.getCurrentLinearFunctionParamsGuess());
  };

  return (
    <div className="perceptron-app">
      <div className="perceptron-app__content">
        <div className="perceptron-app__content__plot">
          <section>
            <ScatterPlot
              classAPoints={classAPoints}
              classBPoints={classBPoints}
              functionParams={functionParams}
            />
            <button onClick={trainButtonClicked}>Train</button>
          </section>
          {functionParams && (
            <section>
              Current linear function equation: y ={' '}
              {functionParams.m.toFixed(2)} * x + {functionParams.n.toFixed(2)}
            </section>
          )}
        </div>

        <div className="perceptron-app__content__table">
          <IterationsTable iterations={iterations} />
        </div>
      </div>
    </div>
  );
}

export default App;
