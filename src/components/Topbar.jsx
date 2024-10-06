import {VStack, Text, Button, HStack, Center, Image } from "@chakra-ui/react";
import PropTypes from "prop-types";

const Topbar = ({ handlePartySelect, party, totalScore }) => {


  return (
    <VStack justify="center" h={'115px'} bgColor={`rgba(255, 255, 255, 0.15)`} w={'100%'}>
    <Center>  
      <Text fontSize="lg" fontFamily={"Montserrat"} fontWeight="bold">CHOOSE YOUR TEAM</Text>
    </Center>
    <HStack spacing={4}>
    <Button
  border={party === "democrat" ? "1px" : "0px"}
  borderColor={"#ffffff"}
  borderRadius={8}
  bgColor={party === "democrat" ? "rgba(255, 255, 255, 0.38)" : "rgba(31, 38, 48, 0.37)"}
  colorScheme="white"
  w={'142px'}
  h={'34px'}
  onClick={() => handlePartySelect("democrat")}
  filter={party === "democrat" ? "brightness(1.2)" : "brightness(0.6)"}
  fontSize={'10px'}
  overflow="hidden"
  display="flex"
  alignItems="center"
  justifyContent="center"
>
  <Image 
    src="/right.png" 
    mr={1} 
    h={'30px'} 
    
    objectFit="cover" 
    maxW="30px"
  /> 
  REPUBLICAN
</Button>
          <Button
       
            border={party === "republican" ? "1px" : "0px"}
            borderColor={"#ffffff"}
            bgColor={party === "republican" ?  "rgba(255, 255, 255, 0.38)" : "rgba(31, 38, 48, 0.37)" }
            borderRadius={8}
     
            colorScheme="white"
            onClick={() => handlePartySelect("republican")}
            filter={party === "republican" ? "brightness(1.2)" : "brightness(0.6)"}
            fontSize={'10px'}
            w={
              '142px'
            }
            h={'34px'}
          >
            DEMOCRAT <Image ml={1} src="/left.png" h={'30px'} />
          </Button>
          </HStack>
          <Text fontSize="13px" fontWeight="semibold">
            Total Votes: <span style={{ color: '#F9DB0E' }}>{totalScore}</span>
          </Text>
          </VStack>
  );
};

export default Topbar;

Topbar.propTypes = {
  handlePartySelect: PropTypes.func.isRequired,
  party: PropTypes.string.isRequired,
  totalScore: PropTypes.number.isRequired,
};
