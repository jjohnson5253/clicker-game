import { Box, Button, Center, Image, Modal, ModalBody, ModalCloseButton, ModalContent, ModalOverlay, Text } from "@chakra-ui/react";
import { supabase } from "../utils/supabase";

// eslint-disable-next-line
export default function PurchaseModal({ onClose, isOpen, selectedUpgrade, setPurchaseMade, passivePointsPerHour, setPassivePointsPerHour, score, setScore, userId }) {

  const handlePurchase = async () => {
    // Check if the user has enough points to purchase the upgrade
    if(score < selectedUpgrade.cost) {
      return;
    }
    // subtract the cost of the upgrade from the user's score
    setScore(score - selectedUpgrade.cost);

    // This is the first time buying upgrade, so add to us
    if(selectedUpgrade.level === 1) {
      // Update the upgrade level
      const { data, error } = await supabase
        .from('user_upgrades')
        .insert({
          level: selectedUpgrade.level,
          upgrade_name: selectedUpgrade.name,
          user_telegram_id: userId,
          upgrade_id: selectedUpgrade.id
        })
        .single();
        console.log("insert error: ", error);
    } else{
      // Update the upgrade level
      const { data, error } = await supabase
        .from('user_upgrades')
        .update({ level: selectedUpgrade.level})
        .eq('upgrade_name', selectedUpgrade.name)
        .eq('user_telegram_id', userId)
        .single();
      console.log("update error: ", error);
    }

    // update passive points for user
    const newPassivePoints =  passivePointsPerHour + selectedUpgrade.pointsPerHour;
    const { data, error } = await supabase
      .from('clicker_users')
      .update({ passive_points_per_hour: newPassivePoints })
      .eq('telegram_id', userId);
    console.log("update passive score error: ", error);

    setPurchaseMade(true);
    setPassivePointsPerHour(newPassivePoints);
    onClose();
  }

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent bg={"#586888"} m={2} h={"100vh"} textAlign={"center"}>
          <ModalCloseButton />
          <ModalBody color={"white"} mt={12}>
            <Text fontSize="xl" mb={3}>
            ${score}
            </Text>
            <Center>
              <Image src="/flag.png" w={24} />{" "}
            </Center>
            <Text mt={4} fontSize="2xl">
              {selectedUpgrade.name}
            </Text>
            <Text mt={4}>lvl {selectedUpgrade.level}</Text>
            <Text mt={4}>Points per hour</Text>
            <Box mx={"auto"}>
              <Center>
                <Text as="span" fontSize="md" ml={1}>
                  +{selectedUpgrade.pointsPerHour}
                </Text>
              </Center>
            </Box>

            <Text mt={4}>Cost</Text>
            <Box mx={"auto"}>
              <Center>
                <Text as="span" fontSize="md" ml={1}>
                  ${selectedUpgrade.cost}
                </Text>
              </Center>
            </Box>
          </ModalBody>
          <Button mx={"auto"} h={14} mb={10} w="90%" variant="solid" bg={"#ffffff"} onClick={handlePurchase}>
            Purchase
          </Button>
        </ModalContent>
      </Modal>
    </>
  );
}
