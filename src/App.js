import React, { useState, useEffect } from 'react';
import ConjugationExercise from './ConjugationExercise';
import './App.css'; // Import the CSS file

function App() {
  const [verbs, setVerbs] = useState([]);

  useEffect(() => {
    // Load verb data from your verbs.json file
    fetch('./verbs.json') // Adjust the path to your JSON file
      .then((response) => response.json())
      .then((data) => setVerbs(data))
      .catch((error) => console.error('Error loading verb data:', error));
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <h1>Polish Verb Conjugation App</h1>
        <ConjugationExercise verbs={verbs} />
      </header>
    </div>
  );
}

export default App;