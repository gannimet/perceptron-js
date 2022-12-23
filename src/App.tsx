import { useMemo, useState } from 'react';
import './App.scss';
import IterationsTable from './components/IterationsTable/IterationsTable';
import ScatterPlot from './components/ScatterPlot/ScatterPlot';
import { Perceptron, PerceptronIteration } from './model/Perceptron';
import { LinearFunctionParams, Point, PointClass } from './model/types';
import { heaviside } from './util/math.utils';

function App() {
  const perceptron = useMemo(() => {
    return new Perceptron(0, 0, 0, 1, heaviside);
  }, []);
  const [classAPoints, setClassAPoints] = useState<Point[]>([]);
  const [classBPoints, setClassBPoints] = useState<Point[]>([]);
  const [iterations, setIterations] = useState<PerceptronIteration[]>([]);
  const [functionParams, setFunctionParams] = useState<
    LinearFunctionParams | undefined
  >();
  const [activePointClass, setActivePointClass] = useState<PointClass>('A');

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

  const clearPointsButtonClicked = () => {
    setClassAPoints([]);
    setClassBPoints([]);
  };

  const gridClicked = (point: Point) => {
    if (activePointClass === 'A') {
      setClassAPoints((oldList) => {
        return [...oldList, point];
      });

      setActivePointClass('B');
    } else {
      setClassBPoints((oldList) => {
        return [...oldList, point];
      });

      setActivePointClass('A');
    }
  };

  return (
    <div className="perceptron-app">
      <div className="perceptron-app__content">
        <div className="perceptron-app__content__plot">
          <section>
            <div className="perceptron-app__content__plot__meta">
              <div
                className={`perceptron-app__content__plot__meta__active-class ${
                  activePointClass === 'A'
                    ? 'perceptron-app__content__plot__meta__active-class--a'
                    : 'perceptron-app__content__plot__meta__active-class--b'
                }`}
              >
                Next point: {activePointClass}
              </div>
            </div>

            <ScatterPlot
              classAPoints={classAPoints}
              classBPoints={classBPoints}
              functionParams={functionParams}
              onClick={gridClicked}
            />

            <div className="perceptron-app__content__plot__buttons">
              <button onClick={trainButtonClicked}>
                Execute training iteration
              </button>
              <button onClick={clearPointsButtonClicked}>Clear points</button>
            </div>
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
