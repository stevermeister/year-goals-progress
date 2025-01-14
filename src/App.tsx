import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Goals } from './pages/Goals';
import './App.css';

function App(): JSX.Element {
  return (
    <Router>
      <div className="App">
        <div className="app-header">
          <h1>Year Goals Progress</h1>
        </div>
        <Routes>
          <Route path="/" element={<Goals />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
