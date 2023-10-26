import React, { useState, useEffect, useMemo, useCallback } from 'react';

const ConjugationExercise = ({ verbs }) => {
  const [currentVerb, setCurrentVerb] = useState(null);
  const [userInputs, setUserInputs] = useState(Array(6).fill(''));
  const [results, setResults] = useState(Array(6).fill(''));
  const pronouns = useMemo(() => ['ja', 'ty', 'on', 'my', 'wy', 'oni'], []);
  const [isChecking, setIsChecking] = useState(false);
  const [allCorrect, setAllCorrect] = useState(false);

  const startExercise = useCallback(() => {
    const randomVerb = verbs[Math.floor(Math.random() * verbs.length)];
    setCurrentVerb(randomVerb);
    setUserInputs(Array(6).fill(''));
    setResults(Array(6).fill(''));
    setIsChecking(false);
    setAllCorrect(false);
  }, [verbs]);

  useEffect(() => {
    if (currentVerb) {
      if (isChecking) {
        const areAllCorrect = userInputs.every((input, index) => currentVerb.baseForm + input === currentVerb.conjugations[index]);
        if (areAllCorrect) {
        } else {
          setResults((prevResults) => {
            return prevResults.map((result, index) =>
              currentVerb.baseForm + userInputs[index] !== currentVerb.conjugations[index] ? 'incorrect' : 'correct'
            );
          });
        }
        setIsChecking(false);
        setAllCorrect(areAllCorrect);
      }
    }
  }, [currentVerb, pronouns, userInputs, isChecking, startExercise, verbs]);

  const handleInputKeyPress = (e) => {
    // TODO: implement me
    return;
  };

  const checkAnswer = () => {
    setIsChecking(true);
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
                      onChange={(e) => {
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
          <button onClick={checkAnswer} disabled={isChecking || allCorrect}>
            Check
          </button>
        </div>
      )}
    </div>
  );
};

export default ConjugationExercise;
