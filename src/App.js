import React from "react";
import { createRoot } from "react-dom/client";
import { useColorModeValue, Flex, Box, ChakraProvider, HStack } from '@chakra-ui/react';
import ConjugationExercise from './ConjugationExercise';
import './App.css'; // Import the CSS file

function App()
{
  const [verbs, setVerbs] = React.useState([]);
  const [tenses, setTenses] = React.useState([]);

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

  return (
    <>
      <h1>Polish Verb Conjugation App</h1>
      <ConjugationExercise verbs={verbs} tenses={tenses}/>
    </>
  );
}

const rootElement = document.getElementById("root");
const root = createRoot(rootElement);
root.render(
  <React.StrictMode>
    <ChakraProvider>
      <App />
    </ChakraProvider>
  </React.StrictMode>
);

export default App;