import { Image, Modal, ModalBody, ModalCloseButton, ModalContent, ModalOverlay, useDisclosure } from "@chakra-ui/react";
import BlasterModal from "./BlasterModal";
import BagModal from "./BagModal";

// eslint-disable-next-line
export default function UpgradeModal({ onClose, isOpen }) {
  const { isOpen: blasterIsOpen, onOpen: blasterOnOpen, onClose: blasterOnClose } = useDisclosure();
  const { isOpen: bagIsOpen, onOpen: bagOnOpen, onClose: bagOnClose } = useDisclosure();

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
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
