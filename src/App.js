import React from 'react';
import { Box, Text, Flex, Button, Image, Progress, VStack, HStack, Spacer, Icon } from '@chakra-ui/react';
import { FaRocket, FaCoins, FaArrowUp, FaExchangeAlt } from 'react-icons/fa';
import TiltImage from './TiltImage';

const App = () => {
  return (
    <Box bg="gray.800" color="white" minH="100vh" p={4}>
      <VStack spacing={4} mt={6} align="stretch">
        <HStack justify="space-between">
          <Text>Earn per tap</Text>
          <Text>Coins to level up</Text>
        </HStack>
        <HStack justify="space-between">
          <Text>+1</Text>
          <Text>5K</Text>
        </HStack>
        <HStack justify="center" mt={4}>
        <Image
            borderRadius="full"
            boxSize="50px"
            src="/coin.png"
            alt="Coin"
          />
          <Text fontSize="3xl" fontWeight="bold">1,438</Text>
        </HStack>
        <Text align="center">Level 4/10</Text>
        <Progress colorScheme="teal" size="sm" value={20} />
        <Box align="center" mt={4}>
          <TiltImage
            imageSrc="brett-head-big.png"
            altText="Brett Head"
            tiltReverse = "true"
            tiltMaxAngleX={30}
            tiltMaxAngleY={30}
          />
          {/*<Image
            borderRadius="full"
            boxSize="150px"
            src="/brett-head-big.png"
            alt="Brett Head"
          />*/}
        </Box>
        <HStack justify="space-between">
          <HStack justify="center" mt={4}>
            <Box align="center" mt={0}>
              <Image
                borderRadius="full"
                boxSize="20px"
                src="/bolt.png"
                alt="Bolt"
              />
            </Box>
            <Text>1000 / 1000</Text>
          </HStack>
          <Button leftIcon={<FaRocket />} colorScheme="teal" size="sm">
            Boost
          </Button>
        </HStack>
      </VStack>

      <Spacer />

    </Box>
  );
};

export default App;
