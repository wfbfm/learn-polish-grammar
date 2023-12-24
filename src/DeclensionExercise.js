import React, { useState, useRef, useEffect, useCallback } from 'react';
import
{
  Box, Button, Flex, Input, Select, Heading, Text, Table, Tbody, Tr, Td, TableContainer, HStack, Alert, AlertIcon, Kbd, Spacer, Stat, StatLabel, StatNumber, StatHelpText, VStack, TableCaption,
  useColorModeValue,
  Icon,
  Center
} from '@chakra-ui/react'
import { AddIcon, CheckCircleIcon, CheckIcon, CloseIcon, QuestionOutlineIcon, RepeatIcon, TimeIcon, WarningTwoIcon } from '@chakra-ui/icons';
import caseMapping from './resources/caseMapping.json';

const DeclensionExercise = ({ adjectives, nouns }) =>
{
  const cases = ['nominative', 'genitive', 'dative', 'accusative', 'instrumental', 'locative', 'vocative'];
  const possibleCounts = ['singular', 'plural'];
  const [inputRefs, setInputRefs] = useState([]);
  const [currentCount, setCurrentCount] = useState(null);
  const [currentAdjective, setCurrentAdjective] = useState(null);
  const [currentNoun, setCurrentNoun] = useState(null);
  const [currentGender, setCurrentGender] = useState(null);
  const [userInputAdjectives, setUserInputAdjectives] = useState(Array(cases.length).fill(''));
  const [userInputNouns, setUserInputNouns] = useState(Array(cases.length).fill(''));
  const [adjectiveResults, setAdjectiveResults] = useState(Array(cases.length).fill(''));
  const [nounResults, setNounResults] = useState(Array(cases.length).fill(''));
  const [isChecking, setIsChecking] = useState(false);
  const [isGiveUp, setIsGiveUp] = useState(false);

  const startExercise = useCallback((retryAdjective, retryNoun, retryCount) =>
  {
    if (retryAdjective)
    {
      setCurrentAdjective(retryAdjective);
      setCurrentNoun(retryNoun);
      setCurrentGender(retryNoun.gender.toLowerCase());
    }
    else
    {
      const randomAdjective = adjectives[Math.floor(Math.random() * adjectives.length)];
      setCurrentAdjective(randomAdjective);
      const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];
      setCurrentNoun(randomNoun);
      setCurrentGender(randomNoun.gender.toLowerCase());
      const randomCount = possibleCounts[Math.floor(Math.random()) * possibleCounts.length];
      setCurrentCount(randomCount);
    }
    setUserInputAdjectives(Array(cases.length).fill(''));
    setAdjectiveResults(Array(cases.length).fill(''));
    setUserInputNouns(Array(cases.length).fill(''));
    setNounResults(Array(cases.length).fill(''));
    setIsChecking(false);
    setIsGiveUp(false);
  }, [adjectives, nouns, cases.length]);

  const normalisedCompare = useCallback((string1, string2) =>
  {
    return removeAccents(string1).toLowerCase() === removeAccents(string2).toLowerCase();
  }, []);

  useEffect(() =>
  {
    if (currentNoun)
    {
      const allAdjectiveDeclensions = currentAdjective.grammar[currentCount][currentGender];
      const allNounDeclensions = currentNoun.grammar[currentCount];
      if (isChecking)
      {
        setAdjectiveResults((prevResults) =>
        {
          const updatedResults = prevResults.map((result, index) =>
          {
            const correctDeclension = allAdjectiveDeclensions.declensions[cases[index]];
            const userDeclension = allAdjectiveDeclensions.baseForm + userInputAdjectives[index];
            return normalisedCompare(userDeclension, correctDeclension) ? 'correct' : 'incorrect'
          });
          setUserInputAdjectives((prevUserInputs) => // override the correct answers with the correct declension, since this will add any missing accents.
          {
            return prevUserInputs.map((userInput, index) =>
              updatedResults[index] === 'correct' ? allAdjectiveDeclensions.declensions[cases[index]].slice(allAdjectiveDeclensions.baseForm.length) : userInputAdjectives[index]
            );
          });
          return updatedResults;
        });
        setNounResults((prevResults) =>
        {
          const updatedResults = prevResults.map((result, index) =>
          {
            const correctDeclension = allNounDeclensions.declensions[cases[index]];
            const userDeclension = allNounDeclensions.baseForm + userInputNouns[index];
            return normalisedCompare(userDeclension, correctDeclension) ? 'correct' : 'incorrect'
          });
          setUserInputNouns((prevUserInputs) => // override the correct answers with the correct declension, since this will add any missing accents.
          {
            return prevUserInputs.map((userInput, index) =>
              updatedResults[index] === 'correct' ? allNounDeclensions.declensions[cases[index]].slice(allNounDeclensions.baseForm.length) : userInputNouns[index]
            );
          });
          return updatedResults;
        });
        setIsChecking(false);
      }

      if (isGiveUp)
      {
        setAdjectiveResults((prevResults) =>
        {
          return prevResults.map((result, index) =>
          {
            const correctDeclension = allAdjectiveDeclensions.declensions[cases[index]];
            const userDeclension = allAdjectiveDeclensions.baseForm + userInputAdjectives[index];
            return normalisedCompare(userDeclension, correctDeclension) ? 'correct' : 'incorrect'
          });
        });
        setUserInputAdjectives((prevUserInputs) =>
        {
          return prevUserInputs.map((userInput, index) =>
            allAdjectiveDeclensions.declensions[cases[index]].slice(allAdjectiveDeclensions.baseForm.length)
          );
        });
        setNounResults((prevResults) =>
        {
          return prevResults.map((result, index) =>
          {
            const correctDeclension = allNounDeclensions.declensions[cases[index]];
            const userDeclension = allNounDeclensions.baseForm + userInputNouns[index];
            return normalisedCompare(userDeclension, correctDeclension) ? 'correct' : 'incorrect'
          });
        });
        setUserInputNouns((prevUserInputs) =>
        {
          return prevUserInputs.map((userInput, index) =>
            allNounDeclensions.declensions[cases[index]].slice(allNounDeclensions.baseForm.length)
          );
        });
        setIsGiveUp(false);
      }
    }
  }, [currentAdjective, currentNoun, currentGender, currentCount, cases, userInputAdjectives, userInputNouns, adjectiveResults, nounResults, isChecking, isGiveUp, startExercise, normalisedCompare]);

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
    startExercise(currentAdjective, currentNoun, currentCount);
  };

  function removeAccents(input)
  {
    return input.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  }

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
    return userInputNouns.findIndex((input) => input.trim() === '');
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
        <HStack spacing='24px' alignItems='center'>
          <VStack>
            <Button
              bgGradient='linear(to-tr, blue.300, blue.400)' _hover={{ bgGradient: 'linear(to-tr, blue.500, blue.900)' }}
              color='white' w='115px' onClick={() => startExercise(null)}>
              <AddIcon></AddIcon>
              <Text p={2}>Start</Text>
            </Button>
          </VStack>
          <Button
            bgGradient='linear(to-tr, green.300, green.400)' _hover={{ bgGradient: 'linear(to-tr, green.500, green.900)' }}
            color='white' w='115px' onClick={checkAnswer} disabled={isChecking}>
            <CheckIcon></CheckIcon>
            <Text p={2}>Check</Text>
          </Button>
          <Button
            bgGradient='linear(to-tr, red.300, red.400)' _hover={{ bgGradient: 'linear(to-tr, red.500, red.900)' }}
            color='white' w='115px' onClick={giveUp} disabled={isGiveUp}>
            <CloseIcon></CloseIcon>
            <Text p={2}>Give Up</Text>
          </Button>
          <Button
            bgGradient='linear(to-tr, purple.300, purple.400)' _hover={{ bgGradient: 'linear(to-tr, purple.500, purple.900)' }}
            color='white' w='115px' onClick={retry}>
            <RepeatIcon></RepeatIcon>
            <Text p={2}>Retry</Text>
          </Button>
        </HStack>
        <HStack spacing='24px' alignItems='center'>
          <Box w='220px'></Box>
          <Center w='115px' p='2'>
            <Kbd>Ctrl</Kbd> + <Kbd>Enter</Kbd>
          </Center>
          <Center w='115px'>
            <Kbd>Alt</Kbd> + <Kbd>Enter</Kbd>
          </Center>
          <Center w='115px'>
            <Kbd>Alt</Kbd> + <Kbd>G</Kbd>
          </Center>
          <Center w='115px'>
            <Kbd>Alt</Kbd> + <Kbd>R</Kbd>
          </Center>
        </HStack>
      </Box>
      {currentNoun && currentAdjective && (
        <Box>
          <Flex>
            <VStack>
              <HStack>
                <Text fontSize='2xl' p='4'>Decline the following as <i>{currentCount}</i>:
                  <b>{currentAdjective.adjective} {currentNoun.noun}</b> - {currentAdjective.translation} {currentNoun.translation}</Text>
              </HStack>
              <TableContainer minW='700px' p='4'>
                <Table variant='simple'>
                  <TableCaption>Tip: Press <Kbd>Enter</Kbd> to quickly move to the next word!</TableCaption>
                  <Tbody>
                    {cases.map((grammarCase, index) => (
                      <Tr key={index}>
                        <Td><b>{grammarCase}</b> <i>({caseMapping[grammarCase]})</i></Td>
                        <Td>
                          <HStack>
                            <Text>{currentAdjective.grammar[currentCount][currentGender].baseForm}</Text>
                            <Input
                              w='120px'
                              type="text"
                              value={userInputAdjectives[index]}
                              onChange={(e) =>
                              {
                                const updatedAdjectiveInputs = [...userInputAdjectives];
                                updatedAdjectiveInputs[index] = e.target.value;
                                setUserInputAdjectives(updatedAdjectiveInputs);
                              }}
                              className={
                                adjectiveResults[index] === 'correct'
                                  ? 'correct'
                                  : adjectiveResults[index] === 'incorrect'
                                    ? 'incorrect'
                                    : ''
                              }
                              bg={getBgColor(adjectiveResults[index])}
                              disabled={adjectiveResults[index] === 'correct' || isChecking}
                              ref={(el) => (inputRefs[index] = el)}
                            />
                            {adjectiveResults[index] === 'correct' ? (
                              <CheckCircleIcon color={correctColour}></CheckCircleIcon>
                            ) : nounResults[index] === 'incorrect' ? (
                              <WarningTwoIcon color={incorrectColour}></WarningTwoIcon>
                            ) :
                              <QuestionOutlineIcon></QuestionOutlineIcon>}
                          </HStack>
                        </Td>
                        <Td>
                          <HStack>
                            <Text>{currentNoun.grammar[currentCount].baseForm}</Text>
                            <Input
                              w='120px'
                              type="text"
                              value={userInputNouns[index]}
                              onChange={(e) =>
                              {
                                const updatedNounInputs = [...userInputNouns];
                                updatedNounInputs[index] = e.target.value;
                                setUserInputNouns(updatedNounInputs);
                              }}
                              className={
                                nounResults[index] === 'correct'
                                  ? 'correct'
                                  : nounResults[index] === 'incorrect'
                                    ? 'incorrect'
                                    : ''
                              }
                              bg={getBgColor(nounResults[index])}
                              disabled={nounResults[index] === 'correct' || isChecking}
                              ref={(el) => (inputRefs[index] = el)}
                            />
                            {nounResults[index] === 'correct' ? (
                              <CheckCircleIcon color={correctColour}></CheckCircleIcon>
                            ) : nounResults[index] === 'incorrect' ? (
                              <WarningTwoIcon color={incorrectColour}></WarningTwoIcon>
                            ) :
                              <QuestionOutlineIcon></QuestionOutlineIcon>}
                          </HStack>
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

export default DeclensionExercise;
