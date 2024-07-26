import { useState, useEffect } from "react";
import { Image, Box, SimpleGrid, Button, Modal, ModalBody, ModalCloseButton, ModalContent, ModalOverlay, useDisclosure } from "@chakra-ui/react";
import BlasterModal from "./BlasterModal";
import BagModal from "./BagModal";
import PurchaseModal from "./PurchaseModal";
import { supabase } from "../utils/supabase";

// eslint-disable-next-line
export default function UpgradeModal({ onClose, isOpen, score, setScore }) {
  const { isOpen: blasterIsOpen, onOpen: blasterOnOpen, onClose: blasterOnClose } = useDisclosure();
  const { isOpen: bagIsOpen, onOpen: bagOnOpen, onClose: bagOnClose } = useDisclosure();
  const { isOpen: purchaseIsOpen, onOpen: purchaseOnOpen, onClose: purchaseOnClose } = useDisclosure();
  const [upgradesToDisplay, setUpgradesToDisplay] = useState([]);
  const [selectedUpgrade, setSelectedUpgrade] = useState({});
  const [isLoadingUpgradesToDisplay, setIsLoadingUpgradesToDisplay] = useState(false);
  const [purchaseMade, setPurchaseMade] = useState(true);
  const [telegramUserId, setTelegramUserId] = useState("69420");

  useEffect(() => {
    if( purchaseMade ) {
      setIsLoadingUpgradesToDisplay(true);
      getNextUpgrades(telegramUserId).then((nextUpgrades) => {
        console.log("nextUpgrades: ", nextUpgrades);
        setUpgradesToDisplay(nextUpgrades);
        setIsLoadingUpgradesToDisplay(false);
        setPurchaseMade(false);
      });
    }
  }, [telegramUserId, purchaseMade]);

  const getNextUpgrades = async (telegramUserId) => {
    // Get the user's current upgrades
    telegramUserId = "69420";
    console.log("telegramUserId: ", telegramUserId);
    const { data: userUpgrades } = await supabase
      .from("user_upgrades")
      .select("upgrade_id")
      .eq("user_telegram_id", telegramUserId);
  
    // Get all upgrades
    const { data: allUpgrades } = await supabase
      .from('upgrades')
      .select('name, level, cost, points_per_hour, id');
  
    // Group upgrades by name
    const upgradesByName = {};
    allUpgrades.forEach((upgrade) => {
      if (!upgradesByName[upgrade.name]) {
        upgradesByName[upgrade.name] = [];
      }
      upgradesByName[upgrade.name].push(upgrade);
    });
  
    // Find the next upgrades for each name
    const nextUpgrades = {};
    Object.keys(upgradesByName).forEach((name) => {
      const userUpgradeLevel = userUpgrades.find((userUpgrade) => {
        const upgrade = allUpgrades.find((u) => u.id === userUpgrade.upgrade_id && u.name === name);
        return upgrade;
      })?.upgrade_id;
  
      if (userUpgradeLevel) {
        const currentUpgrade = allUpgrades.find((u) => u.id === userUpgradeLevel);
        const nextUpgrade = upgradesByName[name].find((u) => u.level === currentUpgrade.level + 1);
        nextUpgrades[name] = nextUpgrade;
      } else {
        nextUpgrades[name] = upgradesByName[name][0];
      }
    });
    return nextUpgrades;
  }

  return (
    <>
      <BlasterModal isOpen={blasterIsOpen} onClose={blasterOnClose} />
      <BagModal isOpen={bagIsOpen} onClose={bagOnClose} />
      <PurchaseModal isOpen={purchaseIsOpen} onClose={purchaseOnClose} selectedUpgrade={selectedUpgrade} setPurchaseMade={setPurchaseMade} score={score} setScore={setScore}/>
      <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent bg={"#586888"} m={2} h={"100vh"} textAlign={"center"}>
        <ModalCloseButton />
        <ModalBody color={"white"} mt={24}>
          <Box overflowY={"scroll"} h={"80vh"}>
            <SimpleGrid columns={2} spacing={4}>
              {!isLoadingUpgradesToDisplay && upgradesToDisplay && Object.keys(upgradesToDisplay).map((name, index) => (
                <Box key={index} p={4} border={"1px solid"} borderColor={"gray.200"} borderRadius={"md"} onClick={() => {
                  setSelectedUpgrade({
                    name,
                    level: upgradesToDisplay[name].level,
                    cost: upgradesToDisplay[name].cost,
                    pointsPerHour: upgradesToDisplay[name].points_per_hour,
                  });
                  purchaseOnOpen();
                }}>
                  <Image src="/flag.png" w="20" mx="auto"/>
                  <h2>{name}</h2>
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
