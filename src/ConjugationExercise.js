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

  const normalisedCompare = useCallback((string1, string2) =>
  {
    return removeAccents(string1).toLowerCase() === removeAccents(string2).toLowerCase();
  }, []);

  useEffect(() =>
  {
    // FIXME - this is currently hardcoded to look at present tense only.
    // Some verbs don't even have the present tense, so we need to handle those cases too.
    if (currentVerb) 
    {
      console.log(currentVerb);
      if (isChecking)
      {
        setResults((prevResults) => 
        {
          const updatedResults = prevResults.map((result, index) =>
            normalisedCompare(currentVerb.tenses["Present tense"].baseForm + userInputs[index], currentVerb.tenses["Present tense"].conjugations[index]) ? 'correct' : 'incorrect'
          );
          setUserInputs((prevUserInputs) =>  // to add back the accents, if user did not input them
          {
            return prevUserInputs.map((userInput, index) =>
              updatedResults[index] === 'correct' ? currentVerb.tenses["Present tense"].conjugations[index].slice(currentVerb.tenses["Present tense"].baseForm.length) : userInputs[index]
            );
          });
          return updatedResults;
        });
        setIsChecking(false);
      }

      if (isGiveUp)
      {
        setResults((prevResults) => 
        {
          return prevResults.map((result, index) =>
            normalisedCompare(currentVerb.tenses["Present tense"].baseForm + userInputs[index], currentVerb.tenses["Present tense"].conjugations[index]) ? 'correct' : 'incorrect'
          );
        });
        setUserInputs((prevUserInputs) => 
        {
          return prevUserInputs.map((userInput, index) =>
            currentVerb.tenses["Present tense"].conjugations[index].slice(currentVerb.tenses["Present tense"].baseForm.length)
          );
        });
        setIsGiveUp(false);
      }
    }
  }, [currentVerb, pronouns, userInputs, results, isChecking, isGiveUp, startExercise, normalisedCompare, verbs]);

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
    setIsGiveUp(true);
  };

  function removeAccents(input)
  {
    return input.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  }

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
                    {currentVerb.tenses["Present tense"].baseForm}
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
