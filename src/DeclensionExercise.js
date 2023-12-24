import React, { useState, useRef, useEffect, useCallback } from 'react';
import
{
  Box, Button, Flex, Input, Select, Heading, Text, Table, Tbody, Tr, Td, TableContainer, HStack, Alert, AlertIcon, Kbd, Spacer, Stat, StatLabel, StatNumber, StatHelpText, VStack, TableCaption,
  useColorModeValue,
  Icon,
  Center,
  Badge
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
  const [selectedGender, setSelectedGender] = useState('');
  const [currentGender, setCurrentGender] = useState(null);
  const [userInputAdjectives, setUserInputAdjectives] = useState(Array(cases.length).fill(''));
  const [userInputNouns, setUserInputNouns] = useState(Array(cases.length).fill(''));
  const [adjectiveResults, setAdjectiveResults] = useState(Array(cases.length).fill(''));
  const [nounResults, setNounResults] = useState(Array(cases.length).fill(''));
  const [isChecking, setIsChecking] = useState(false);
  const [isGiveUp, setIsGiveUp] = useState(false);

  const startExercise = useCallback((retryAdjective, retryNoun, retryGender, retryCount) =>
  {
    if (retryAdjective)
    {
      setCurrentAdjective(retryAdjective);
      setCurrentNoun(retryNoun);
      setCurrentGender(retryGender);
      setCurrentCount(retryCount);
    }
    else
    {
      const randomCount = possibleCounts[Math.floor(Math.random() * possibleCounts.length)]
      setCurrentCount(randomCount);
      if (selectedGender && !["Any", "Select a gender"].includes(selectedGender))
      {
        const nounsWithSelectedGender = nouns.filter((noun) =>
        {
          return noun.gender === selectedGender && noun.grammar[randomCount].declensions.nominative !== '-';
        })
        const randomNoun = nounsWithSelectedGender[Math.floor(Math.random() * nounsWithSelectedGender.length)];
        setCurrentNoun(randomNoun);
        randomCount === 'singular' ? setCurrentGender(randomNoun.gender.toLowerCase()) : setCurrentGender(randomNoun.virility ?? 'non-virile');
      }
      else
      {
        const possibleNouns = nouns.filter((noun) =>
        {
          return noun.grammar[randomCount].declensions.nominative !== '-';
        })
        const randomNoun = possibleNouns[Math.floor(Math.random() * possibleNouns.length)];
        setCurrentNoun(randomNoun);
        randomCount === 'singular' ? setCurrentGender(randomNoun.gender.toLowerCase()) : setCurrentGender(randomNoun.virility ?? 'non-virile');
      }
      const randomAdjective = adjectives[Math.floor(Math.random() * adjectives.length)];
      setCurrentAdjective(randomAdjective);
    }
    setUserInputAdjectives(Array(cases.length).fill(''));
    setAdjectiveResults(Array(cases.length).fill(''));
    setUserInputNouns(Array(cases.length).fill(''));
    setNounResults(Array(cases.length).fill(''));
    setIsChecking(false);
    setIsGiveUp(false);
  }, [adjectives, nouns, cases.length, selectedGender]);

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
    startExercise(currentAdjective, currentNoun, currentGender, currentCount);
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
    const emptyAdjectiveIndex = userInputAdjectives.findIndex((input) => input.trim() === '');
    const emptyNounIndex = userInputNouns.findIndex((input) => input.trim() === '');
    if (emptyNounIndex < emptyAdjectiveIndex)
    {
      return emptyNounIndex * 2 + 1;
    }
    else
    {
      return emptyAdjectiveIndex * 2;
    }
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

  const handleGenderSelect = (event) =>
  {
    setSelectedGender(event.target.value);
  };

  const getBadgeColorForCount = (count) =>
  {
    switch (count)
    {
      case 'singular':
        return 'blue';
      case 'plural':
        return 'red';
      default:
        return 'grey';
    }
  };

  const getBadgeColorForGender = (gender) =>
  {
    switch (gender)
    {
      case 'masculine':
        return 'blue';
      case 'feminine':
        return 'pink';
      case 'neuter':
        return 'orange';
      case 'virile':
        return 'red';
      case 'non-virile':
        return 'purple';
      default:
        return 'grey';
    }
  };


  return (
    <Box>
      <Box>
        <HStack spacing='24px' alignItems='center'>
          <Select
            w='220px'
            value={selectedGender}
            onChange={handleGenderSelect}
            placeholder="Select a gender">
            <option value="Any">Any</option>
            <option value="Masculine">Masculine</option>
            <option value="Feminine">Feminine</option>
            <option value="Neuter">Neuter</option>
          </Select>
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
      {currentNoun && currentAdjective && currentGender && currentCount && (
        <Box>
          <Flex>
            <VStack>
              <HStack>
                <Text fontSize='2xl' p='1'>
                  <b>{currentAdjective.grammar[currentCount][currentGender].declensions.nominative} {currentNoun.grammar[currentCount].declensions.nominative}</b> - {currentAdjective.translation} {currentNoun.translation}</Text>
                <Badge variant='solid' colorScheme={getBadgeColorForCount(currentCount)}>{currentCount}</Badge>
                <Badge variant='solid' colorScheme={getBadgeColorForGender(currentGender)}>{currentGender}</Badge>
              </HStack>
              <TableContainer minW='700px' p='1'>
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
                              ref={(el) => (inputRefs[index * 2] = el)}
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
                              ref={(el) => (inputRefs[index * 2 + 1] = el)}
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
