import { useState, useEffect } from "react";
import { Box, Text, useDisclosure, Button, Image, Progress, VStack, HStack, Spacer } from "@chakra-ui/react";
import { FaRocket, FaDollarSign } from "react-icons/fa";
import TiltImage from "./TiltImage";
import AirdropModal from "./components/AirdropModal";
import UpgradeModal from "./components/UpgradeModal";
import { useTelegram } from "./hooks/useTelegram";
import { supabase } from "./utils/supabase";
const isProduction = import.meta.env.VITE_NODE_ENV === "production";

const App = () => {
  // todo: fix telegram provider
  //const { telegramUser } = useTelegram();
  const [ telegramUser, setTelegramUser ] = useState(null);
  const [ userId, setUserId ] = useState("");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: upgradeIsOpen, onOpen: upgradeOnOpen, onClose: upgradeOnClose } = useDisclosure();

  const [score, setScore] = useState(null);
  const [totalScore, setTotalScore] = useState(null);
  const [energy, setEnergy] = useState(null);

  window.scrollTo(0, 0);

  useEffect(() => {
    if (window.Telegram) {
      setTelegramUser(window.Telegram.WebApp.initDataUnsafe.user); // temp fix until we fix the provider
      const telegramApp = window.Telegram.WebApp;
      console.log("Telegram App", telegramApp);
      telegramApp.expand();
      telegramApp.initDataUnsafe.user;
    }
    console.log("Telegram user 1: ", telegramUser);
    if (telegramUser) {
      console.log("Telegram user 2: ", telegramUser);
      console.log("Telegram user id: ", telegramUser.id.toString());
      getUser(telegramUser.id.toString());
    } else if (!isProduction) {
      console.log("Development mode");
      const testTelegramId = "69420";
      getUser(testTelegramId);
    }
  }, [telegramUser]);

  // increase energy
  useEffect(() => {
    if (energy < 1000){
      const interval = setInterval(() => {
        setEnergy(energy => energy + 1);
      }, 2000);
      return () => clearInterval(interval);
    }
  }, []);

  // update score on supabase
  useEffect(() => {
    if (userId && score) {
      let updateData = { 
        score: score,
        total_score: totalScore,
        energy: energy
      };
      const updateSupabase = async () => {
        const { error } = await supabase
          .from('clicker_users')
          .update(updateData)
          .eq('telegram_id', userId);
        if(error) {
          console.error("Error updating user", error);
        }
      }
      updateSupabase();
    }
  }, [score]);

  // get user from supabase
  const getUser = async (id) => {
    setUserId(id);
    const { data, error } = await supabase.from("clicker_users").select("*").eq("telegram_id", id);
    if (error) {
      console.error("Error getting user", error);
    } else if (data.length == 0) {
      // create new user if not in database
      console.log("User not found. Creating new user...");
      const { error } = await supabase
        .from('clicker_users')
        .insert(
          {
            telegram_id: id,
            score: 0,
            connected_wallet: null,
            passive_points_per_hour: 0,
            total_score: 0,
            energy: 0,
          },
        )
        .select()
      if(error) {
        console.error("Error creating new user", error);
      }
    } else {
      console.log("User found: ", data);
      setScore(data[0].score);
      setTotalScore(data[0].total_score);
    }
  };

  const handleImageClick = async () => {
    console.log("Image clicked");
    if(energy > 0) {
      setScore(score + 1);
      setTotalScore(totalScore + 1);
      setEnergy(energy - 1);
    }
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
          <TiltImage imageSrc="/flag.png" altText="Brett Head" tiltReverse="true" tiltMaxAngleX={30} tiltMaxAngleY={30} onClick={handleImageClick} energy={energy} />
        </Box>
        <HStack justify="space-between">
          <Text fontSize="xl" fontWeight="bold">
            energy {energy} / 1000
          </Text>
          <Button leftIcon={<FaRocket />} variant="solid" bg={"#00ADE0"} colorScheme="brand.100" size="sm" w={100} onClick={upgradeOnOpen}>
            Upgrade
          </Button>
        </HStack>
      </VStack>
      <Spacer />
      <AirdropModal isOpen={isOpen} onClose={onClose} />
      <UpgradeModal isOpen={upgradeIsOpen} onClose={upgradeOnClose} score={score} setScore={setScore} userId={userId}/>
    </Box>
  );
};

export default App;
