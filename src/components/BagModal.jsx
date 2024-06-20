import { Box, Button, Center, Image, Modal, ModalBody, ModalCloseButton, ModalContent, ModalOverlay, Text } from "@chakra-ui/react";

export default function BagModal({ onClose, isOpen }) {
  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent bg={"#586888"} m={2} h={"100vh"} textAlign={"center"}>
          <ModalCloseButton />
          <ModalBody color={"white"} mt={12}>
            <Center>
              <Image src="/bag.png" w={24} alt="Bag Holder" />{" "}
            </Center>
            <Text mt={4} fontSize="2xl">
              Bag Holder
            </Text>
            <Text mt={4}>Upgrade available to holders of Brett on ETH. Connect wallet to verify bag ownership.</Text>
            <Text mt={4}>Points per tap</Text>
            <Box mx={"auto"}>
              <Center>
                <Image src="/coin.png" w={6} alt="Coin" />
                <Text as="span" fontSize="md" ml={1}>
                  +3
                </Text>
              </Center>
            </Box>
          </ModalBody>
          <Box mx={"auto"} mb={40} h={14}>
            <w3m-button  balance="show"/>
          </Box>
        </ModalContent>
      </Modal>
    </>
  );
}
