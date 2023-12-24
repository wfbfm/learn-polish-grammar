import React from "react";
import { createRoot } from "react-dom/client";
import { useColorModeValue, Flex, Box, ChakraProvider, Tab, Tabs, TabList, TabPanel, TabPanels, Text, Divider } from '@chakra-ui/react';
import NavBar from "./NavBar";
import ConjugationExercise from './ConjugationExercise';
import theme from "./theme";
import DeclensionExercise from "./DeclensionExercise";
import verbs from './resources/verbs.json';
import tenses from './resources/tenses.json';
import adjectives from './resources/adjectives.json';
import nouns from './resources/nouns.json';

function App()
{
  return (
    <>
      <NavBar></NavBar>
      <Tabs isFitted variant='enclosed-colored' colorScheme='red'>
        <TabList mb='1em'>
          <Tab>Verb Conjugation</Tab>
          <Tab>Noun & Adjective Declension</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <Divider></Divider>
            <Box p='4'>
              <ConjugationExercise verbs={verbs} tenses={tenses} />
            </Box>
          </TabPanel>
          <TabPanel>
            <Divider></Divider>
            <Box p='4'>
              <DeclensionExercise adjectives={adjectives} nouns={nouns} />
            </Box>
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
    <ChakraProvider theme={theme}>
      <App />
    </ChakraProvider>
  </React.StrictMode>
);

export default App;