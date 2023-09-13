import { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';

function App() {
  const [serverData, setServerData] = useState('');

  useEffect(() => {
    async function readServerData() {
   //add todo function v
    const req = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ date:'today', workoutTitle:'title', workoutNotes:'notes' }),
    };
    try {
      const res = await fetch('/api/workouts', req);
      if (!res.ok) throw new Error(`fetch Error ${res.status}`);
      const data = await res.json();
      console.log(data)
    } catch (e) {
    }
    }
    readServerData();
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <h1>{serverData}</h1>
      </header>
    </div>
  );
}

export default App;
