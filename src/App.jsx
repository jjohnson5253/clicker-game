import { useState, useEffect } from "react";
import { Box, Text, useDisclosure, Button, Image, Progress, VStack, HStack, Spacer } from "@chakra-ui/react";
import { FaRocket, FaDollarSign } from "react-icons/fa";
import TiltImage from "./TiltImage";
import AirdropModal from "./components/AirdropModal";
import UpgradeModal from "./components/UpgradeModal";
import { useTelegram } from "./hooks/useTelegram";
import { supabase } from "../utils/supabase";
const isProduction = process.env.NODE_ENV === "production";

const App = () => {
  const { telegramUser } = useTelegram();
  const [ userId, setUserId ] = useState("");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: upgradeIsOpen, onOpen: upgradeOnOpen, onClose: upgradeOnClose } = useDisclosure();

  const [score, setScore] = useState(null);

  window.scrollTo(0, 0);

  if (window.Telegram) {
    const telegramApp = window.Telegram.WebApp;
    console.log("Telegram App", telegramApp);
    telegramApp.expand();
    telegramApp.initDataUnsafe.user;
  }

  useEffect(() => {
    if (telegramUser) {
      getUser(telegramUser.id.toString());
    } else if (!isProduction) {
      console.log("Development mode");
      const testTelegramId = "69420";
      getUser(testTelegramId);
    }
  }, [telegramUser]);

  useEffect(() => {
    if (userId && score) {
      const updateSupabase = async () => {
        const { error } = await supabase
          .from('clicker_users')
          .update({ score: score })
          .eq('telegram_id', userId);
        if(error) {
          console.error("Error updating user", error);
        }
      };
      updateSupabase();
    }
  }, [score]);

  const getUser = async (id) => {
    setUserId(id);
    const { data, error } = await supabase.from("clicker_users").select("*").eq("telegram_id", id);
    if (error) {
      console.error("Error getting user", error);
    } else if (data.length == 0) {
      console.log("User not found. Creating new user...");
      const { error } = await supabase
        .from('clicker_users')
        .insert(
          {
            telegram_id: id,
            score: 0,
            connected_wallet: null,
            passive_points_per_hour: 0,
          },
        )
        .select()
      if(error) {
        console.error("Error creating new user", error);
      }
    } else {
      console.log("User found: ", data);
      setScore(data[0].score);
    }
  };

  const handleImageClick = async () => {
    console.log("Image clicked");
    setScore(score + 1);
  };

  return (
    <Box bg="gray.800" color="white" minH="100vh" p={4}>
      <VStack spacing={4} mt={6} align="stretch">
        <HStack justify="center" mt={4}>
          <Image borderRadius="full" boxSize="50px" src="/coin.png" alt="Coin" />
          <Text fontSize="3xl" fontWeight="bold">
            {score}
          </Text>
        </HStack>
        <Box align="center" mt={4}>
          <TiltImage imageSrc="/brett-head-big.png" altText="Brett Head" tiltReverse="true" tiltMaxAngleX={30} tiltMaxAngleY={30} onClick={handleImageClick} />
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
