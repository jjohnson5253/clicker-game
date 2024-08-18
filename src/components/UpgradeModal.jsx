import { useState, useEffect } from "react";
import { Image, Box, SimpleGrid, Text, Modal, ModalBody, ModalCloseButton, ModalContent, ModalOverlay, useDisclosure } from "@chakra-ui/react";
import BlasterModal from "./BlasterModal";
import BagModal from "./BagModal";
import PurchaseModal from "./PurchaseModal";
import { supabase } from "../utils/supabase";

// eslint-disable-next-line
export default function UpgradeModal({ onClose, isOpen, score, setScore, passivePointsPerHour, setPassivePointsPerHour, userId}) {
  const { isOpen: blasterIsOpen, onOpen: blasterOnOpen, onClose: blasterOnClose } = useDisclosure();
  const { isOpen: bagIsOpen, onOpen: bagOnOpen, onClose: bagOnClose } = useDisclosure();
  const { isOpen: purchaseIsOpen, onOpen: purchaseOnOpen, onClose: purchaseOnClose } = useDisclosure();
  const [upgradesToDisplay, setUpgradesToDisplay] = useState([]);
  const [selectedUpgrade, setSelectedUpgrade] = useState({});
  const [isLoadingUpgradesToDisplay, setIsLoadingUpgradesToDisplay] = useState(false);
  const [purchaseMade, setPurchaseMade] = useState(true);

  useEffect(() => {
    if( purchaseMade && userId !== null) {
      setIsLoadingUpgradesToDisplay(true);
      getNextUpgrades(userId).then((nextUpgrades) => {
        console.log("nextUpgrades: ", nextUpgrades);
        setUpgradesToDisplay(nextUpgrades);
        setIsLoadingUpgradesToDisplay(false);
        setPurchaseMade(false);
      });
    }
  }, [userId, purchaseMade]);

  const getNextUpgrades = async (telegramUserId) => {
    if(telegramUserId) {
      console.log("!!!@#$#$@# telegramUserId: ", telegramUserId);
      const userUpgrades = await supabase
        .from("user_upgrades")
        .select("level, upgrade_name")
        .eq("user_telegram_id", telegramUserId);

      const upgrades = await supabase
        .from('upgrades')
        .select('*');

      const filteredUpgrades = [];

      for (const upgrade of upgrades.data) {
        const existingUpgrade = filteredUpgrades.find(u => u.name === upgrade.name);
        if (!existingUpgrade) {
          const userUpgrade = userUpgrades.data.find(u => u.upgrade_name === upgrade.name);
          if (userUpgrade) {
            const level = userUpgrade.level + 1;
            const upgradedItem = upgrades.data.find(u => u.name === upgrade.name && u.level === level);
            filteredUpgrades.push(upgradedItem);
          } else {
            const level1Item = upgrades.data.find(u => u.name === upgrade.name && u.level === 1);
            filteredUpgrades.push(level1Item);
          }
        }
      }
    
      return filteredUpgrades;
    }
  }

  return (
    <>
      <BlasterModal isOpen={blasterIsOpen} onClose={blasterOnClose} />
      <BagModal isOpen={bagIsOpen} onClose={bagOnClose} />
      <PurchaseModal isOpen={purchaseIsOpen} onClose={purchaseOnClose} selectedUpgrade={selectedUpgrade} setPurchaseMade={setPurchaseMade} passivePointsPerHour={passivePointsPerHour} setPassivePointsPerHour={setPassivePointsPerHour} score={score} setScore={setScore} userId={userId}/>
      <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent bg={"#586888"} m={2} h={"100vh"} textAlign={"center"}>
        <ModalCloseButton />
        <ModalBody color={"white"} mt={19}>
          <Text fontSize="xl" mb={3}>
          ${score}
          </Text>
          <Box overflowY={"scroll"} h={"80vh"}>
            <SimpleGrid columns={2} spacing={4}>
              {!isLoadingUpgradesToDisplay && upgradesToDisplay && Object.keys(upgradesToDisplay).map((name, index) => (
                <Box 
                  key={index}
                  p={4}
                  border={"1px solid"}
                  borderColor={"gray.200"}
                  borderRadius={"md"}
                  opacity={upgradesToDisplay[name].cost > score ? 0.5 : 1}
                  onClick={() => {
                    if (score < upgradesToDisplay[name].cost) {
                      return;
                    }
                    setSelectedUpgrade({
                      name: upgradesToDisplay[name].name,
                      level: upgradesToDisplay[name].level,
                      cost: upgradesToDisplay[name].cost,
                      pointsPerHour: upgradesToDisplay[name].points_per_hour,
                      id: upgradesToDisplay[name].id,
                    });
                    purchaseOnOpen();
                  }}
                >
                  <Image src="/flag.png" w="20" mx="auto"/>
                  <h2>{upgradesToDisplay[name].name}</h2>
                  <p>Level: {upgradesToDisplay[name].level}</p>
                  <p>Points per hour: {upgradesToDisplay[name].points_per_hour}</p>
                  <p>Cost: {upgradesToDisplay[name].cost}</p>
                </Box>
              ))}
            </SimpleGrid>
          </Box>
        </ModalBody>
      </ModalContent>
    </Modal>
    </>
  );
}
