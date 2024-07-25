import { useState } from "react";
import { Image, Button, Modal, ModalBody, ModalCloseButton, ModalContent, ModalOverlay, useDisclosure } from "@chakra-ui/react";
import BlasterModal from "./BlasterModal";
import BagModal from "./BagModal";
import { supabase } from "../utils/supabase";

// eslint-disable-next-line
export default function UpgradeModal({ onClose, isOpen }) {
  const { isOpen: blasterIsOpen, onOpen: blasterOnOpen, onClose: blasterOnClose } = useDisclosure();
  const { isOpen: bagIsOpen, onOpen: bagOnOpen, onClose: bagOnClose } = useDisclosure();
  //const [upgradesToDisplay, setUpgradesToDisplay] = useState([]);

  async function getNextUpgrades(telegramUserId) {
    // Get the user's current upgrades
    telegramUserId = "69420";
    console.log("telegramUserId: ", telegramUserId);
    const { data: userUpgrades } = await supabase
      .from("user_upgrades")
      .select("upgrade_id")
      .eq("user_telegram_id", telegramUserId);
    // const { data: userUpgrades, error } = await supabase
    //   .from("user_upgrades")
    //   .select("*")

    // const { data } = await supabase.from("user_upgrades").select("*");
    // console.log("data: ", data);
    console.log("userUpgrades: ", userUpgrades);
  
    // Get all upgrades
    const { data: allUpgrades } = await supabase
      .from('upgrades')
      .select('name, level, cost, points_per_hour, id');

    console.log("allupgrades: ", allUpgrades);
  
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
        console.log("found user upgrade");
        return upgrade;
      })?.upgrade_id;
  
      if (userUpgradeLevel) {
        console.log("here")
        const currentUpgrade = allUpgrades.find((u) => u.id === userUpgradeLevel);
        const nextUpgrade = upgradesByName[name].find((u) => u.level === currentUpgrade.level + 1);
        nextUpgrades[name] = nextUpgrade;
      } else {
        nextUpgrades[name] = upgradesByName[name][0];
      }
    });
    console.log("nextUpgrades: ", nextUpgrades);
    return nextUpgrades;
  }
  
  // Example usage:
  const hardCodedUserId = "69420";
  getNextUpgrades(hardCodedUserId).then((nextUpgrades) => {
    console.log(nextUpgrades);
  });

  return (
    <>
      <BlasterModal isOpen={blasterIsOpen} onClose={blasterOnClose} />
      <BagModal isOpen={bagIsOpen} onClose={bagOnClose} />
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent bg={"#586888"} m={2} h={"100vh"} textAlign={"center"}>
          <ModalCloseButton />
          <ModalBody color={"white"} mt={24}>
            <Image src="/finger_blaster.png" alt="Finger Blaster" onClick={blasterOnOpen} />
            <Image src="/bag_holder.png" alt="Bag Holder" mt={2} onClick={bagOnOpen} />
            <Button mt={2} onClick={getNextUpgrades}>
              Get Next Upgrades
            </Button>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
