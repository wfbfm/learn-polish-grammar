import React, { useState, useRef, useEffect, useCallback } from 'react';
import
{
  Box, Button, Flex, Input, Select, Heading, Text, Table, Tbody, Tr, Td, TableContainer, HStack, Alert, AlertIcon, Kbd, Spacer, Stat, StatLabel, StatNumber, StatHelpText, VStack, TableCaption,
  useColorModeValue
} from '@chakra-ui/react'
import { CheckCircleIcon, CheckIcon, QuestionOutlineIcon, TimeIcon, WarningTwoIcon } from '@chakra-ui/icons';

const ConjugationExercise = ({ verbs, tenses }) =>
{
  const pronouns = ['ja', 'ty', 'on/ona', 'my', 'wy', 'oni'];
  const tensesWithTwoWords = ["Imperfective future tense", "Future masculine tense", "Future feminine tense"]
  const tensesWithTwoWordsAndBaseForm = ["Conditional perfective masculine tense", "Conditional perfective feminine tense"];
  const [inputRefs, setInputRefs] = useState([]);
  const [currentVerb, setCurrentVerb] = useState(null);
  const [selectedTense, setSelectedTense] = useState('');
  const [currentTense, setCurrentTense] = useState('');
  const [userInputs, setUserInputs] = useState(Array(pronouns.length).fill(''));
  const [results, setResults] = useState(Array(pronouns.length).fill(''));
  const [isChecking, setIsChecking] = useState(false);
  const [isGiveUp, setIsGiveUp] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [isTwoWords, setIsTwoWords] = useState(false);
  const [isTwoWordsAndBaseForm, setIsTwoWordsAndBaseForm] = useState(false);

  const startExercise = useCallback((retryVerb) =>
  {
    if (!selectedTense)
    {
      setShowAlert(true);
      return;
    }
    setShowAlert(false);
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
    setIsTwoWords(tensesWithTwoWords.includes(selectedTense));
    setIsTwoWordsAndBaseForm(tensesWithTwoWordsAndBaseForm.includes(selectedTense));
  }, [verbs, selectedTense, pronouns.length, tensesWithTwoWords]);

  const normalisedCompare = useCallback((string1, string2) =>
  {
    return removeAccents(string1).toLowerCase() === removeAccents(string2).toLowerCase();
  }, []);

  const getUserConjugation = (baseForm, userInput, correctConjugation) =>
  {
    return isTwoWords ? 'będ' + userInput + ' ' + correctConjugation.split(' ')[1]
      : isTwoWordsAndBaseForm ? baseForm + userInput + ' ' + correctConjugation.split(' ')[1]
        : baseForm + userInput;
  }

  const getCorrectedInput = (baseForm, correctConjugation) =>
  {
    return isTwoWords ? correctConjugation.split(' ')[0].slice('będ'.length)
      : isTwoWordsAndBaseForm ? correctConjugation.split(' ')[0].slice(baseForm.length)
        : correctConjugation.slice(baseForm.length);
  }

  useEffect(() =>
  {
    if (currentVerb)
    {
      const conjugationData = currentVerb.tenses[currentTense];
      if (isChecking)
      {
        setResults((prevResults) =>
        {
          const updatedResults = prevResults.map((result, index) =>
          {
            const correctConjugation = conjugationData.conjugations[index];
            const userConjugation = getUserConjugation(conjugationData.baseForm, userInputs[index], correctConjugation);
            return normalisedCompare(userConjugation, correctConjugation) ? 'correct' : 'incorrect'
          });
          setUserInputs((prevUserInputs) => // override the correct answers with the correct conjugation, since this will add any missing accents.
          {
            return prevUserInputs.map((userInput, index) =>
              updatedResults[index] === 'correct' ? getCorrectedInput(conjugationData.baseForm, conjugationData.conjugations[index]) : userInputs[index]
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
          {
            const correctConjugation = conjugationData.conjugations[index];
            const userConjugation = getUserConjugation(conjugationData.baseForm, userInputs[index], correctConjugation);
            return normalisedCompare(userConjugation, correctConjugation) ? 'correct' : 'incorrect';
          });
        });
        setUserInputs((prevUserInputs) =>
        {
          return prevUserInputs.map((userInput, index) =>
            getCorrectedInput(conjugationData.baseForm, conjugationData.conjugations[index])
          );
        });
        setIsGiveUp(false);
      }
    }
  }, [currentVerb, pronouns, userInputs, results, isChecking, isGiveUp, startExercise, normalisedCompare, verbs, tenses, currentTense]);

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
    setSelectedTense(event.target.value);
  };

  useEffect(() =>
  {
    const handleKeyDown = (e) =>
    {
      if (e.ctrlKey && e.key === 'Enter')
      {
        startExercise(null);
      } else if (e.altKey && e.key === 'Enter')
      {
        checkAnswer();
      } else if (e.altKey && e.key === 'g')
      {
        giveUp();
      } else if (e.altKey && e.key === 'r')
      {
        retry();
      } else if (e.key === 'Enter')
      {
        const emptyIndex = findFirstEmptyInputIndex();
        if (emptyIndex !== -1 && inputRefs[emptyIndex])
        {
          inputRefs[emptyIndex].focus();
        }
      }
    };
    // Attach the event listener
    window.addEventListener('keydown', handleKeyDown);

    // Detach the event listener when the component unmounts
    return () =>
    {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [startExercise, checkAnswer, giveUp, retry]);

  // Function to find the index of the first empty input
  const findFirstEmptyInputIndex = () =>
  {
    return userInputs.findIndex((input) => input.trim() === '');
  };

  const correctColour = useColorModeValue('green.200', 'green.900');
  const incorrectColour = useColorModeValue('red.200', 'red.900');

  const getBgColor = (result) =>
  {
    switch (result)
    {
      case 'correct':
        return correctColour;
      case 'incorrect':
        return incorrectColour;
      default:
        return undefined;
    }
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
            <Kbd>Alt</Kbd> + <Kbd>G</Kbd>
          </Button>
          <Button w='200px' onClick={retry}>
            <Text p={2}>Retry</Text>
            <Kbd>Alt</Kbd> + <Kbd>R</Kbd>
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
          <Flex>
            <VStack>
              <HStack>
                <Text fontSize='2xl' p='4'> <b>{currentVerb.verb}</b> - {currentVerb.translation}</Text>
              </HStack>
              <TableContainer minW='700px' p='4'>
                <Table variant='simple'>
                  <TableCaption>Tip: Press <Kbd>Enter</Kbd> to quickly move to the next word!</TableCaption>
                  <Tbody>
                    {pronouns.map((pronoun, index) => (
                      <Tr key={index}>
                        <Td>{pronoun}</Td>
                        <Td>
                          <HStack>
                            {(isTwoWords || isTwoWordsAndBaseForm) ? (
                              <>
                                {isTwoWordsAndBaseForm ? (<><Text>{currentVerb.tenses[currentTense].baseForm}</Text></>)
                                  : (<><Text>będ</Text></>)}
                                <Input
                                  w='120px'
                                  type="text"
                                  value={userInputs[index]}
                                  onChange={(e) =>
                                  {
                                    const updatedInputs = [...userInputs];
                                    updatedInputs[index] = e.target.value;
                                    setUserInputs(updatedInputs);
                                  }}
                                  className={
                                    results[index] === 'correct'
                                      ? 'correct'
                                      : results[index] === 'incorrect'
                                        ? 'incorrect'
                                        : ''
                                  }
                                  bg={getBgColor(results[index])}
                                  disabled={results[index] === 'correct' || isChecking}
                                  ref={(el) => (inputRefs[index] = el)}
                                />
                                <Text>{currentVerb.tenses[currentTense].conjugations[index].split(' ').slice(1).join(' ')}</Text>
                              </>
                            ) : (
                              <>
                                <Text>{currentVerb.tenses[currentTense].baseForm}</Text>
                                <Input
                                  w='120px'
                                  type="text"
                                  value={userInputs[index]}
                                  onChange={(e) =>
                                  {
                                    const updatedInputs = [...userInputs];
                                    updatedInputs[index] = e.target.value;
                                    setUserInputs(updatedInputs);
                                  }}
                                  className={
                                    results[index] === 'correct'
                                      ? 'correct'
                                      : results[index] === 'incorrect'
                                        ? 'incorrect'
                                        : ''
                                  }
                                  bg={getBgColor(results[index])}
                                  disabled={results[index] === 'correct' || isChecking}
                                  ref={(el) => (inputRefs[index] = el)}
                                />
                              </>
                            )}
                            {results[index] === 'correct' ? (
                              <CheckCircleIcon color={correctColour}></CheckCircleIcon>
                            ) : results[index] === 'incorrect' ? (
                              <WarningTwoIcon color={incorrectColour}></WarningTwoIcon>
                            ) :
                              <QuestionOutlineIcon></QuestionOutlineIcon>}
                          </HStack>
                        </Td>
                        <Td>
                          <Text fontSize={'sm'} as='i'>{currentVerb.tenses[currentTense].translations[index]}</Text>
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </TableContainer>
            </VStack>
          </Flex>
        </Box>
      )}
    </Box>
  );
};

export default ConjugationExercise;
