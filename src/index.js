import React from "react";
import { createRoot } from "react-dom/client";
import { useColorModeValue, Flex, Box, ChakraProvider, Tab, Tabs, TabList, TabPanel, TabPanels } from '@chakra-ui/react';
import NavBar from "./NavBar";
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
      <NavBar></NavBar>
      <Tabs isFitted variant='enclosed-colored'>
        <TabList mb='1em'>
          <Tab>Verb Conjugation</Tab>
          <Tab>Noun & Adjective Declension</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <Box p='4'>
              <ConjugationExercise verbs={verbs} tenses={tenses} />
            </Box>
          </TabPanel>
          <TabPanel>
            <p>Needs implementation!</p>
          </TabPanel>
        </TabPanels>
      </Tabs>
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