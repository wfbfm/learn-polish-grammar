import React, { useState, useEffect, useCallback, useMemo } from 'react';
import
{
  Box, Button, Input, Select, Text, Table, Tbody, Tr, Td, TableContainer, HStack, Alert, AlertIcon, Kbd
} from '@chakra-ui/react'

const ConjugationExercise = ({ verbs, tenses }) =>
{
  const pronouns = useMemo(() => ['ja', 'ty', 'on/ona', 'my', 'wy', 'oni'], []);
  const [currentVerb, setCurrentVerb] = useState(null);
  const [selectedTense, setSelectedTense] = useState('');
  const [currentTense, setCurrentTense] = useState('');
  const [userInputs, setUserInputs] = useState(Array(pronouns.length).fill(''));
  const [results, setResults] = useState(Array(pronouns.length).fill(''));
  const [isChecking, setIsChecking] = useState(false);
  const [isGiveUp, setIsGiveUp] = useState(false);
  const [showAlert, setShowAlert] = useState(false);

  const startExercise = useCallback((retryVerb) =>
  {
    if (!selectedTense)
    {
      // TODO: add a warning banner
      console.log("No selected tense");
      setShowAlert(true);
      return;
    }
    setShowAlert(false);
    console.log("Retry verb", retryVerb);
    if (retryVerb)
    {
      setCurrentVerb(retryVerb);
    }
    else
    {
      const verbsWithSelectedTense = verbs.filter((verb) =>
      {
        return selectedTense in verb.tenses;
      });
      const randomVerb = verbsWithSelectedTense[Math.floor(Math.random() * verbsWithSelectedTense.length)];
      setCurrentVerb(randomVerb);
    }
    setCurrentTense(selectedTense);
    setUserInputs(Array(pronouns.length).fill(''));
    setResults(Array(pronouns.length).fill(''));
    setIsChecking(false);
    setIsGiveUp(false);
  }, [verbs, selectedTense, pronouns.length]);

  const normalisedCompare = useCallback((string1, string2) =>
  {
    return removeAccents(string1).toLowerCase() === removeAccents(string2).toLowerCase();
  }, []);

  useEffect(() =>
  {
    if (currentVerb)
    {
      const conjugation = currentVerb.tenses[currentTense];
      if (isChecking)
      {
        setResults((prevResults) =>
        {
          const updatedResults = prevResults.map((result, index) =>
            normalisedCompare(conjugation.baseForm + userInputs[index], conjugation.conjugations[index]) ? 'correct' : 'incorrect'
          );
          setUserInputs((prevUserInputs) =>
          {
            return prevUserInputs.map((userInput, index) =>
              updatedResults[index] === 'correct' ? conjugation.conjugations[index].slice(conjugation.baseForm.length) : userInputs[index]
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
            normalisedCompare(conjugation.baseForm + userInputs[index], conjugation.conjugations[index]) ? 'correct' : 'incorrect'
          );
        });
        setUserInputs((prevUserInputs) =>
        {
          return prevUserInputs.map((userInput, index) =>
            conjugation.conjugations[index].slice(conjugation.baseForm.length)
          );
        });
        setIsGiveUp(false);
      }
    }
  }, [currentVerb, pronouns, userInputs, results, isChecking, isGiveUp, startExercise, normalisedCompare, verbs, tenses, currentTense]);

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

  const retry = () =>
  {
    startExercise(currentVerb);
  };

  function removeAccents(input)
  {
    return input.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  }

  const handleTenseSelect = (event) =>
  {
    console.log(event);
    console.log(event.target.value);
    setSelectedTense(event.target.value);
  };

  return (
    <Box>
      <Box>
        <HStack h={16} spacing='24px'>
          <Select
            w='300px'
            value={selectedTense}
            onChange={handleTenseSelect}
            placeholder="Select a tense">
            {Object.entries(tenses).map(([display, internal]) => (
              <option key={internal} value={internal}>
                {display}
              </option>
            ))}
          </Select>
          <Button w='200px' p='4' onClick={() => startExercise(null)}>
            <Text p={2}>Start</Text>
            <Kbd>Ctrl</Kbd> + <Kbd>Enter</Kbd>
          </Button>
          <Button w='200px' onClick={checkAnswer} disabled={isChecking}>
            <Text p={2}>Check</Text>
            <Kbd>Alt</Kbd> + <Kbd>Enter</Kbd>
          </Button>
          <Button w='200px' onClick={giveUp} disabled={isGiveUp}>
            <Text p={2}>Give Up</Text>
            <Kbd>Ctrl</Kbd> + <Kbd>G</Kbd>
          </Button>
          <Button w='200px' onClick={retry}>
            <Text p={2}>Retry</Text>
            <Kbd>Alt</Kbd> + <Kbd>G</Kbd>
          </Button>
        </HStack>
      </Box>
      {showAlert && (
        <Alert status="warning">
          <AlertIcon />
          Please select the tense you want to practise!
        </Alert>
      )}
      {currentVerb && currentTense && (
        <Box>
          <Box>
            <Text>Verb: {currentVerb.verb}</Text>
            <TableContainer>
              <Table variant='simple'>
                <Tbody>
                  {pronouns.map((pronoun, index) => (
                    <Tr key={index}>
                      <Td>{pronoun}</Td>
                      <Td>
                        {currentVerb.tenses[currentTense].baseForm}
                        <Input
                          type="text"
                          value={userInputs[index]}
                          onChange={(e) =>
                          {
                            const updatedInputs = [...userInputs];
                            updatedInputs[index] = e.target.value;
                            setUserInputs(updatedInputs);
                          }}
                          onKeyPress={handleInputKeyPress}
                          className={
                            results[index] === 'correct'
                              ? 'correct'
                              : results[index] === 'incorrect'
                                ? 'incorrect'
                                : ''
                          }
                          disabled={results[index] === 'correct' || isChecking}
                        />
                        {results[index] === 'correct' ? (
                          <span className="result-icon">&#10004;</span>
                        ) : results[index] === 'incorrect' ? (
                          <span className="result-icon">&#10006;</span>
                        ) : null}
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </TableContainer>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default ConjugationExercise;
