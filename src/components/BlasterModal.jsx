import { Box, Button, Center, Image, Modal, ModalBody, ModalCloseButton, ModalContent, ModalOverlay, Text } from "@chakra-ui/react";

export default function BlasterModal({ onClose, isOpen }) {
  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent bg={"#586888"} m={2} h={"100vh"} textAlign={"center"}>
          <ModalCloseButton />
          <ModalBody color={"white"} mt={12}>
            <Center>
              <Image src="/finger.png" w={24} alt="Finger Blaster" />{" "}
            </Center>
            <Text mt={4} fontSize="2xl">
              Finger Blaster
            </Text>
            <Text mt={4}>Purchase to earn an additional point per tap</Text>
            <Text mt={4}>Points per tap</Text>
            <Box mx={"auto"}>
              <Center>
                <Image src="/coin.png" w={6} alt="Coin" />
                <Text as="span" fontSize="md" ml={1}>
                  +1
                </Text>
              </Center>
            </Box>

            <Box mx={"auto"} mt={12}>
              <Center>
                <Image src="/coin.png" w={16} alt="Coin" />
                <Text as="span" fontSize="xl" ml={1}>
                  500
                </Text>
              </Center>
            </Box>
          </ModalBody>
          <Button mx={"auto"} h={14} mb={10} w="90%" colorScheme="blue" bg={"#00ADE0"} onClick={() => console.log("purchase")}>
            Purchase
          </Button>
        </ModalContent>
      </Modal>
    </>
  );
}
