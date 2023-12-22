import React from 'react';
import
    {
        Box,
        Flex,
        Heading,
        Highlight,
        Text,
        Button,
        useColorModeValue,
        Stack,
        useColorMode,
        Image
    } from '@chakra-ui/react';
import { MoonIcon, SunIcon } from '@chakra-ui/icons';
import logo from './resources/logo-no-background.svg';

export default function NavBar()
{
    const { colorMode, toggleColorMode } = useColorMode();
    return (
        <>
            <Box bg={useColorModeValue('grey.100', 'grey.900')} px={10}>
                <Flex h={16} alignItems={'center'} justifyContent={'space-between'}>
                    <Box>
                        <Image
                            boxSize='60px'
                            src={logo}
                        />
                    </Box>
                    <Heading lineHeight='tall'>
                        Bilingo: Learn Polish Grammar
                    </Heading>
                    <Flex alignItems={'center'}>
                        <Stack direction={'row'} spacing={7}>
                            <Button onClick={toggleColorMode}>
                                {colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
                            </Button>
                        </Stack>
                    </Flex>
                </Flex>
            </Box>
        </>
    );
}