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
import logo from './resources/bilingo-high-resolution-logo-white-transparent.svg';

export default function NavBar()
{
    const { colorMode, toggleColorMode } = useColorMode();
    const bannerColour = colorMode === 'light' ? 'linear(to-tl, red.400, red.600)' : 'linear(to-tl, grey.100, grey.800)'
    return (
        <>
            <Box px={10} color='white' bgGradient={bannerColour}>
                <Flex h={20} alignItems={'center'} justifyContent={'space-between'}>
                    <Box>
                        <Image
                            boxSize='80px'
                            src={logo}
                        />
                    </Box>
                    <Heading>
                        Learn Polish Grammar
                    </Heading>
                    <Flex alignItems={'center'}>
                        <Stack direction={'row'} spacing={7}>
                            <Button onClick={toggleColorMode} bg={useColorModeValue('grey.500', 'grey.900')}>
                                {colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
                            </Button>
                        </Stack>
                    </Flex>
                </Flex>
            </Box>
        </>
    );
}