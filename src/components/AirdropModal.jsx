import { Button, Center, Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay, Text } from "@chakra-ui/react";

// eslint-disable-next-line
export default function AirdropModal({ onClose, isOpen }) {
  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent bg={"#586888"} m={2} h={"100vh"} textAlign={"center"}>
          <ModalHeader color={"white"} fontSize={44} mt={10}>
            $PIXBRETT Airdrop
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody color={"white"}>
            <Text mt={4}>Pixel Brett ($PIXBRETT) is a meme gaming token.</Text>
            <Text mt={4}>It will be used for a series of games including an upcoming farming RPG.</Text>
            <Text mt={4}>
              By connecting your wallet, you will be eligible to receive an airdrop. The percentage of the airdrop you receive will be based on the level you achieve in Pixel Brett
              Finger Blast.
            </Text>
          </ModalBody>

          <Center>
            <Button h={14} mx={"auto"} mb={10} w="90%" colorScheme="blue" bg={"#00ADE0"} onClick={() => console.log("connect wallet")}>
              Connect Wallet
            </Button>
          </Center>
        </ModalContent>
      </Modal>
    </>
  );
}
