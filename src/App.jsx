import { useState, useEffect } from "react";
import { Box, Text, useDisclosure, Button, Image, Progress, VStack, HStack, Spacer } from "@chakra-ui/react";
import { FaRocket, FaDollarSign } from "react-icons/fa";
import TiltImage from "./TiltImage";
import TopScore from "./components/TopScore";
import AirdropModal from "./components/AirdropModal";
import UpgradeModal from "./components/UpgradeModal";
import { useTelegram } from "./hooks/useTelegram";
import { supabase } from "./utils/supabase";
const isProduction = import.meta.env.VITE_NODE_ENV === "production";

const App = () => {
  // todo: fix telegram provider
  //const { telegramUser } = useTelegram();
  const [telegramUser, setTelegramUser] = useState(null);
  const [userId, setUserId] = useState("");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: upgradeIsOpen, onOpen: upgradeOnOpen, onClose: upgradeOnClose } = useDisclosure();

  const [score, setScore] = useState(null);
  const [totalScore, setTotalScore] = useState(null); // this is the all time points earned, not just points after spending
  const [energy, setEnergy] = useState(null);
  const [passivePointsPerHour, setPassivePointsPerHour] = useState(null);
  const [party, setParty] = useState(null);
  const maxEnergy = 250;
  const energyInterval = 2000;

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
    if (energy < maxEnergy) {
      const interval = setInterval(() => {
        setEnergy((energy) => energy + 1);
      }, energyInterval);
      return () => clearInterval(interval);
    }
  }, [energy]);

  useEffect(() => {
    if (passivePointsPerHour > 0) {
      const interval = setInterval(() => {
        setTotalScore((prevTotalScore) => prevTotalScore + 1);
        setScore((prevScore) => prevScore + 1);
      }, (60 * 60 * 1000) / passivePointsPerHour); // Convert pointsPerHour to milliseconds
      return () => clearInterval(interval);
    }
  }, [passivePointsPerHour]);

  // update score on supabase
  useEffect(() => {
    if (userId && score) {
      const timestamp = new Date().toISOString();
      let updateData = {
        score: score,
        total_score: totalScore,
        energy: energy,
        updated_at: timestamp,
        party: party,
      };
      const updateSupabase = async () => {
        const { error } = await supabase.from("clicker_users").update(updateData).eq("telegram_id", userId);
        if (error) {
          console.error("Error updating user", error);
        }
      };
      updateSupabase();
    }
  }, [score, energy, party]);

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
        .from("clicker_users")
        .insert({
          telegram_id: id,
          score: 0,
          connected_wallet: null,
          passive_points_per_hour: 0,
          total_score: 0,
          energy: 0,
        })
        .select();
      if (error) {
        console.error("Error creating new user", error);
      }
    } else {
      console.log("User found: ", data);
      setParty(data[0].party);
      calculateScore(data[0].score, data[0].total_score, data[0].passive_points_per_hour, data[0].updated_at);
      calculateEnergy(data[0].energy, data[0].updated_at);
    }
  };

  const calculateEnergy = (initialEnergy, last_updated_at) => {
    const lastUpdated = new Date(last_updated_at);
    const currentTime = new Date();
    const timeDifference = currentTime - lastUpdated;
    const energyToGive = Math.floor(timeDifference / energyInterval); // 1 energy per 2 seconds
    if (energyToGive + initialEnergy > maxEnergy) {
      setEnergy(maxEnergy);
    } else {
      setEnergy(initialEnergy + energyToGive);
    }
  };

  const calculateScore = (initialPoints, initialTotalPoints, pointsPerHour, last_updated_at) => {
    const lastUpdated = new Date(last_updated_at);
    const currentTime = new Date();
    const timeDifference = currentTime - lastUpdated;
    const timeDifferenceHours = timeDifference / (1000 * 60 * 60);
    let pointsToGive = Math.floor(timeDifferenceHours * pointsPerHour);

    // only give points for 3 hours
    const maxPointsToGive = pointsPerHour * 3;
    if (pointsToGive > maxPointsToGive) {
      pointsToGive = maxPointsToGive;
    }

    setScore(initialPoints + pointsToGive);
    setTotalScore(initialTotalPoints + pointsToGive);
    setPassivePointsPerHour(pointsPerHour);
  };

  const handlePartySelect = async (party) => {
    setParty(party);
  };

  const handleImageClick = async () => {
    console.log("Image clicked");
    if (energy > 0) {
      setTotalScore(totalScore + 1);
      setScore(score + 1);
      setEnergy(energy - 1);
    }
  };

  return (
    <Box bg={party === "democrat" ? "#FFC8C8" : "#CCC8FF"} color="white" minH="100vh" p={4}>
      <VStack spacing={4} mt={6} align="stretch">
        <HStack justify="space-between">
          <Button
            border={party === "democrat" ? "4px" : "0px"}
            textShadow={"1px 1px 1px #C91605"}
            borderColor={"#C91605"}
            borderRadius={16}
            p={8}
            colorScheme="white"
            onClick={() => handlePartySelect("democrat")}
          >
            <Image src="/left.png" mr={1} /> Democrat
          </Button>
          <Button
            p={8}
            border={party === "republican" ? "4px" : "0px"}
            borderColor={"#000E8A"}
            borderRadius={16}
            colorScheme="white"
            onClick={() => handlePartySelect("republican")}
            textShadow={"1px 1px 1px #000E8A"}
          >
            Republican <Image ml={1} src="/right.png" />
          </Button>
        </HStack>
        <TopScore score1={10} score2={90} />
        <HStack justify="space-between">
          <Text fontSize="xl" fontWeight="bold">
            Points Per Hour: {passivePointsPerHour}
          </Text>
        </HStack>
        <HStack justify="center" mt={4}>
          <Text fontSize="3xl" fontWeight="bold">
            {score}
          </Text>
        </HStack>
        <Box align="center" mt={4}>
          <TiltImage
            imageSrc={party === "democrat" ? "/left_big.png" : "/right_big.png"}
            altText="Flerg"
            tiltReverse="true"
            tiltMaxAngleX={30}
            tiltMaxAngleY={30}
            onClick={handleImageClick}
            energy={energy}
          />
        </Box>
        <HStack justify="space-between">
          <Text fontSize="xl" fontWeight="bold">
            energy {energy} / {maxEnergy}
          </Text>
          <Button leftIcon={<FaRocket />} variant="solid" bg={"#676167"} colorScheme="brand.100" size="sm" w={100} onClick={upgradeOnOpen}>
            Upgrade
          </Button>
        </HStack>
      </VStack>
      <Spacer />
      <AirdropModal isOpen={isOpen} onClose={onClose} />
      <UpgradeModal isOpen={upgradeIsOpen} onClose={upgradeOnClose} score={score} setScore={setScore} setPassivePointsPerHour={setPassivePointsPerHour} userId={userId} />
    </Box>
  );
};

export default App;
