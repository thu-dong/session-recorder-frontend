import './App.css';
import Bar from './components/Bar';
import Session from './components/Session';
import SessionOverview from './components/SessionOverview';

function App() {
  return (
    <div className="App">
      <Bar/>
      <Session/>
      <SessionOverview/>
    </div>
  );
}

export default App;
