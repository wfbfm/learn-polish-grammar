import React, { useState, useEffect, useCallback, useMemo } from 'react';

const ConjugationExercise = ({ verbs }) =>
{
  const pronouns = useMemo(() => ['ja', 'ty', 'on', 'my', 'wy', 'oni'], []);
  const [currentVerb, setCurrentVerb] = useState(null);
  const [userInputs, setUserInputs] = useState(Array(pronouns.length).fill(''));
  const [results, setResults] = useState(Array(pronouns.length).fill(''));
  const [isChecking, setIsChecking] = useState(false);
  const [isGiveUp, setIsGiveUp] = useState(false);

  const startExercise = useCallback(() =>
  {
    const randomVerb = verbs[Math.floor(Math.random() * verbs.length)];
    setCurrentVerb(randomVerb);
    setUserInputs(Array(pronouns.length).fill(''));
    setResults(Array(pronouns.length).fill(''));
    setIsChecking(false);
    setIsGiveUp(false);
  }, [verbs, pronouns.length]);

  useEffect(() =>
  {
    if (currentVerb) 
    {
      if (isChecking)
      {
        setResults((prevResults) => 
        {
          return prevResults.map((result, index) =>
            currentVerb.baseForm + userInputs[index] !== currentVerb.conjugations[index] ? 'incorrect' : 'correct'
          );
        });
        setIsChecking(false);
      }

      if (isGiveUp)
      {
        setUserInputs((prevUserInputs) => 
        {
          return prevUserInputs.map((userInput, index) =>
            currentVerb.conjugations[index].slice(currentVerb.baseForm.length)
          );
        });
        setIsGiveUp(false);
      }
    }
  }, [currentVerb, pronouns, userInputs, isChecking, isGiveUp, startExercise, verbs]);

  const handleInputKeyPress = (e) => 
  {
    // TODO: implement me
    return;
  };

  const checkAnswer = () => 
  {
    setIsChecking(true);
  };

  const giveUp = () => 
  {
    setIsChecking(true);
    setIsGiveUp(true);
  };

  return (
    <div>
      <h2>Polish Verb Conjugation Exercise</h2>
      <button onClick={startExercise}>Start</button>
      {currentVerb && (
        <div>
          <p>Verb: {currentVerb.verb}</p>
          <table>
            <tbody>
              {pronouns.map((pronoun, index) => (
                <tr key={index}>
                  <td>{pronoun}</td>
                  <td>
                    {currentVerb.baseForm}
                    <input
                      type="text"
                      value={userInputs[index]}
                      onChange={(e) =>
                      {
                        const updatedInputs = [...userInputs];
                        updatedInputs[index] = e.target.value;
                        setUserInputs(updatedInputs);
                      }}
                      onKeyPress={handleInputKeyPress}
                      className={results[index] === 'correct' ? 'correct' : results[index] === 'incorrect' ? 'incorrect' : ''}
                      disabled={results[index] === 'correct' || isChecking}
                    />
                    {results[index] === 'correct' ? <span className="result-icon">&#10004;</span> : results[index] === 'incorrect' ? <span className="result-icon">&#10006;</span> : null}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button onClick={checkAnswer} disabled={isChecking}>
            Check
          </button>
          <button onClick={giveUp} disabled={isGiveUp}>
            Give up
          </button>
        </div>
      )}
    </div>
  );
};

export default ConjugationExercise;
