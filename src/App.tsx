import { ChangeEvent, useMemo, useState } from 'react';
import './App.scss';
import IterationsTable from './components/IterationsTable/IterationsTable';
import ScatterPlot from './components/ScatterPlot/ScatterPlot';
import { Perceptron, PerceptronIteration } from './model/Perceptron';
import { LinearFunctionParams, Point, PointClass } from './model/types';
import { heaviside, rounded, shuffleArray } from './util/math.utils';

function App() {
  const [classAPoints, setClassAPoints] = useState<Point[]>([]);
  const [classBPoints, setClassBPoints] = useState<Point[]>([]);
  const [iterations, setIterations] = useState<PerceptronIteration[]>([]);
  const [functionParams, setFunctionParams] = useState<
    LinearFunctionParams | undefined
  >();
  const [activePointClass, setActivePointClass] = useState<PointClass>('A');
  const [learningRate, setLearningRate] = useState<number>(1);
  const [initialBias, setInitialBias] = useState<number>(0);
  const [initialW0, setInitialW0] = useState<number>(0);
  const [initialW1, setInitialW1] = useState<number>(0);
  const [shouldRandomizeOrder, setShouldRandomizeOrder] =
    useState<boolean>(true);

  const perceptron = useMemo(() => {
    return new Perceptron(initialBias, initialW0, initialW1, heaviside);
  }, [initialBias, initialW0, initialW1]);

  const trainButtonClicked = () => {
    perceptron.startNewIteration();
    const allPoints = [
      ...classAPoints.map((point) => ['A', point]),
      ...classBPoints.map((point) => ['B', point]),
    ] as [PointClass, Point][];

    if (shouldRandomizeOrder) {
      shuffleArray(allPoints);
    }

    allPoints.forEach(([pointClass, point]) => {
      perceptron.train(point, pointClass, learningRate);
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

  const learningRateChanged = (event: ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(event.target.value);

    setLearningRate(value);
  };

  const initialBiasChanged = (event: ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(event.target.value);

    if (Number.isNaN(value)) {
      return;
    }

    setInitialBias(value);
  };

  const initialW0Changed = (event: ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(event.target.value);

    if (Number.isNaN(value)) {
      return;
    }

    setInitialW0(value);
  };

  const initialW1Changed = (event: ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(event.target.value);

    if (Number.isNaN(value)) {
      return;
    }

    setInitialW1(value);
  };

  const resetEverythingButtonClicked = () => {
    perceptron.reset();
    setLearningRate(1);
    setIterations(perceptron.iterations);
    setActivePointClass('A');
    setFunctionParams(undefined);
    setClassAPoints([]);
    setClassBPoints([]);
  };

  const randomizeCheckboxChanged = () => {
    setShouldRandomizeOrder(!shouldRandomizeOrder);
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
          </section>

          <div className="perceptron-app__content__plot__buttons">
            <button onClick={trainButtonClicked}>
              Execute training iteration
            </button>
            <button onClick={clearPointsButtonClicked}>Clear points</button>
            <button onClick={resetEverythingButtonClicked}>
              Reset everything
            </button>
          </div>

          <section className="perceptron-app__content__plot__randomize-control">
            <label>
              <input
                type="checkbox"
                checked={shouldRandomizeOrder}
                onChange={randomizeCheckboxChanged}
              />
              Randomize point evaluation order
            </label>
          </section>

          <section className="perceptron-app__content__plot__weight-controls">
            <label>Initial weights:</label>

            <div className="perceptron-app__content__plot__weight-controls__inputs">
              <label>
                <span>b:</span>
                <input
                  onChange={initialBiasChanged}
                  disabled={iterations.length > 0}
                />
              </label>

              <label>
                <span>w0:</span>
                <input
                  onChange={initialW0Changed}
                  disabled={iterations.length > 0}
                />
              </label>

              <label>
                <span>w1:</span>
                <input
                  onChange={initialW1Changed}
                  disabled={iterations.length > 0}
                />
              </label>
            </div>
          </section>

          <section className="perceptron-app__content__plot__lr-controls">
            <label>Learning rate:</label>
            <input
              className="perceptron-app__content__plot__lr-controls__lr-slider"
              type="range"
              min={0}
              max={10}
              step={0.01}
              value={learningRate}
              onChange={learningRateChanged}
            />
            <div>{rounded(learningRate)}</div>
          </section>

          {functionParams && (
            <section className="perceptron-app__content__plot__equation">
              Current linear function equation: y = {rounded(functionParams.m)}{' '}
              * x {`${functionParams.n > 0 ? '+' : '-'}`}{' '}
              {Math.abs(rounded(functionParams.n))}
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
