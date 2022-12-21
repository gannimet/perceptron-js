import './App.scss';
import ScatterPlot from './components/ScatterPlot/ScatterPlot';

function App() {
  return (
    <ScatterPlot
      classAPoints={[
        { x: 6, y: 10 },
        { x: 0, y: -3 },
      ]}
      classBPoints={[
        { x: -4, y: -13 },
        { x: 18, y: 2 },
      ]}
    />
  );
}

export default App;
