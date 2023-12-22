import * as React from "react";
import * as ReactDOMClient from "react-dom/client";
import { useColorModeValue, Flex, Box, ChakraProvider, HStack } from '@chakra-ui/react';
import ConjugationExercise from './ConjugationExercise';
import TenseDropdown from './TenseDropdown';
import './App.css'; // Import the CSS file

function App()
{
  const [verbs, setVerbs] = React.useState([]);
  const [tenses, setTenses] = React.useState([]);
  const [selectedTenses, setSelectedTenses] = React.useState('');

  React.useEffect(() =>
  {
    fetch('./verbs.json')
      .then((response) => response.json())
      .then((data) => setVerbs(data))
      .catch((error) => console.error('Error loading verb data:', error));

    fetch('./tenses.json')
      .then((response) => response.json())
      .then((data) => setTenses(data))
      .catch((error) => console.error('Error loading tense data:', error));
  }, []);

  const handleSelectTenses = (selected) =>
  {
    setSelectedTenses(selected);
  };

  return (
    <>
      <h1>Polish Verb Conjugation App</h1>
      <TenseDropdown onSelect={handleSelectTenses} />
      <ConjugationExercise verbs={verbs} selectedTense={selectedTenses[0]} />
    </>
  );
}

const rootElement = document.getElementById("root");
const root = ReactDOMClient.createRoot(rootElement);

root.render(
  <React.StrictMode>
    <ChakraProvider>
      <App />
    </ChakraProvider>
  </React.StrictMode>
);

export default App;