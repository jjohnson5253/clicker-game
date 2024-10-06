import {VStack, Text,  HStack, Image } from "@chakra-ui/react";
import PropTypes from "prop-types";

const ProfitPerHour = ({ passivePointsPerHour }) => {


  return (
    <HStack justify="end" mr={-3} >
    <VStack bg={"rgba(255, 255, 255, 0.17)"} gap={-1} p={4} borderRadius={16} border={"1px solid rgba(255, 255, 255, 0.60)"} w={"120px"}  h={"45px"} justify="center">
    <Text fontSize="8px" fontWeight="light">
     Profit Per Hour
    </Text>
    <HStack gap={-1}>
    <Image src="/coin_sm.png" w={'24px'} h={'24px'} />
    <Text fontSize="15px" fontWeight="bold">
 +{passivePointsPerHour}
    </Text>
    </HStack>
    </VStack>
  </HStack>
  );
};

export default ProfitPerHour;

ProfitPerHour.propTypes = {
    passivePointsPerHour: PropTypes.number.isRequired
};
