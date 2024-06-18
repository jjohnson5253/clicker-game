import React, { useState, useEffect } from "react";
import { Box, Text, useDisclosure, Button, Image, Progress, VStack, HStack, Spacer } from "@chakra-ui/react";
import { FaRocket, FaDollarSign } from "react-icons/fa";
import TiltImage from "./TiltImage";
import AirdropModal from "./components/AirdropModal";
import UpgradeModal from "./components/UpgradeModal";

const App = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: upgradeIsOpen, onOpen: upgradeOnOpen, onClose: upgradeOnClose } = useDisclosure();
  const getInitialScore = () => Number(localStorage.getItem("score")) || 0;
  const getInitialLevel = () => Number(localStorage.getItem("level")) || 1;

  const [score, setScore] = useState(getInitialScore);
  const [level, setLevel] = useState(getInitialLevel);

  window.scrollTo(0, 0);

  const telegramApp = window.Telegram.WebApp;
  console.log("Telegram App", telegramApp);
  telegramApp.expand();

  useEffect(() => {
    localStorage.setItem("score", score);
    localStorage.setItem("level", level);
  }, [score, level]);

  const handleImageClick = () => {
    console.log("Image clicked");
    setScore((prevScore) => {
      const newScore = prevScore + 1;
      if (newScore >= 500) {
        setLevel((prevLevel) => Math.min(prevLevel + 1, 10));
        return 0;
      }
      return newScore;
    });
  };

  return (
    <Box bg="gray.800" color="white" minH="100vh" p={4}>
      <VStack spacing={4} mt={6} align="stretch">
        <HStack justify="space-between">
          <Text>Earn per tap</Text>
          <Text>Coins to level up</Text>
        </HStack>
        <HStack justify="space-between">
          <Text>+1</Text>
          <Text>500</Text>
        </HStack>
        <HStack justify="center" mt={4}>
          <Image borderRadius="full" boxSize="50px" src="/coin.png" alt="Coin" />
          <Text fontSize="3xl" fontWeight="bold">
            {score}
          </Text>
        </HStack>
        <Text align="center">Level {level}/10</Text>
        <Progress colorScheme="brand.100" size="sm" value={(score / 500) * 100} />
        <Box align="center" mt={4}>
          <TiltImage imageSrc="brett-head-big.png" altText="Brett Head" tiltReverse="true" tiltMaxAngleX={30} tiltMaxAngleY={30} onClick={handleImageClick} />
        </Box>
        <HStack justify="space-between">
          <Button leftIcon={<FaRocket />} variant="solid" bg={"#00ADE0"} colorScheme="brand.100" size="sm" w={100} onClick={upgradeOnOpen}>
            Upgrade
          </Button>

          <Button leftIcon={<FaDollarSign />} variant="solid" bg={"#00ADE0"} colorScheme="brand.100" size="sm" w={100} onClick={onOpen}>
            Airdrop
          </Button>
        </HStack>
      </VStack>
      <Spacer />
      <AirdropModal isOpen={isOpen} onClose={onClose} />
      <UpgradeModal isOpen={upgradeIsOpen} onClose={upgradeOnClose} />
    </Box>
  );
};

export default App;
