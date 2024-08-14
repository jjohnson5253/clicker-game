import { Box, Button, Center, Image, Modal, ModalBody, ModalCloseButton, ModalContent, ModalOverlay, Text } from "@chakra-ui/react";
import { supabase } from "../utils/supabase";

// eslint-disable-next-line
export default function PurchaseModal({ onClose, isOpen, selectedUpgrade, setPurchaseMade, score, setScore, userId }) {

  const handlePurchase = async () => {
    // Check if the user has enough points to purchase the upgrade
    if(score < selectedUpgrade.cost) {
      return;
    }
    // subtract the cost of the upgrade from the user's score
    setScore(score - selectedUpgrade.cost);

    // Get the upgrade id
    const { data } = await supabase
    .from('upgrades')
    .select('id')
    .eq('name', selectedUpgrade.name)
    .eq('level', selectedUpgrade.level)
    .single();
  
    if (data) {
      const upgradeId = data.id;
      // Add the new upgrade to user_upgrades
      await supabase
        .from('user_upgrades')
        .insert([{ user_telegram_id: userId, upgrade_id: upgradeId }]);
    
      // Remove the previous upgrade from user_upgrades
      const previousUpgradeLevel = selectedUpgrade.level - 1;
      const previousUpgradeData = await supabase
        .from('upgrades')
        .select('id')
        .eq('name', selectedUpgrade.name)
        .eq('level', previousUpgradeLevel)
        .single();
    
      if (previousUpgradeData.data) {
        const previousUpgradeId = previousUpgradeData.data.id;
        console.log('previousUpgradeId: ', previousUpgradeId);
        console.log('userId: ', userId);
        await supabase
          .from('user_upgrades')
          .delete()
          .eq('user_telegram_id', userId)
          .eq('upgrade_id', previousUpgradeId);
      }
    }

    // update passive points for user
    const passivePointsData = await supabase
      .from('clicker_users')
      .select('passive_points_per_hour')
      .eq('telegram_id', userId)
      .single();
    const newPassivePoints =  passivePointsData.data.passive_points_per_hour + selectedUpgrade.pointsPerHour;
    await supabase
      .from('clicker_users')
      .update({ passive_points_per_hour: newPassivePoints })
      .eq('telegram_id', userId);

    setPurchaseMade(true);
    onClose();
  }

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent bg={"#586888"} m={2} h={"100vh"} textAlign={"center"}>
          <ModalCloseButton />
          <ModalBody color={"white"} mt={12}>
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
                <Image src="/coin.png" w={6} alt="Coin" />
                <Text as="span" fontSize="md" ml={1}>
                  +{selectedUpgrade.pointsPerHour}
                </Text>
              </Center>
            </Box>

            <Text mt={4}>Cost</Text>
            <Box mx={"auto"}>
              <Center>
                <Image src="/coin.png" w={6} alt="Coin" />
                <Text as="span" fontSize="md" ml={1}>
                  {selectedUpgrade.cost}
                </Text>
              </Center>
            </Box>
          </ModalBody>
          <Button mx={"auto"} h={14} mb={10} w="90%" colorScheme="blue" bg={"#00ADE0"} onClick={handlePurchase}>
            Purchase
          </Button>
        </ModalContent>
      </Modal>
    </>
  );
}
