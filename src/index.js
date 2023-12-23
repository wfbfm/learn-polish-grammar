import React from "react";
import { createRoot } from "react-dom/client";
import { useColorModeValue, Flex, Box, ChakraProvider, Tab, Tabs, TabList, TabPanel, TabPanels, Text, Divider } from '@chakra-ui/react';
import NavBar from "./NavBar";
import ConjugationExercise from './ConjugationExercise';
import theme from "./theme";

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
              <Text>Coming soon 😊!</Text>
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