import './App.scss';
import ProgressBar from './ProgressBar';

function App() {  
    return (
      <div className="container">
        <h1>Goals progress</h1>
        

        <ul>
          <li>Year: <ProgressBar total={365} number={dayOfYear()}/></li>
          <li>Gym: <ProgressBar total={100} number={2}/></li>
          <li>Films: <ProgressBar total={20} number={0}/></li>
        </ul>
      </div>
    )
}

function dayOfYear() {
  const today = new Date();
  const startOfYear = new Date(today.getFullYear(), 0, 1);
  const dayOfYear = Math.floor((today - startOfYear) / (1000 * 60 * 60 * 24));

  return dayOfYear;
}

export default App;