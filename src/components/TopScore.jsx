import { Box, Flex, Text, HStack, Image } from "@chakra-ui/react";
import PropTypes from "prop-types";

const TopScore = ({ score }) => {
// create a score formatter to add commas to the score
const scoreFormatter = new Intl.NumberFormat('en-US').format(score);


  return (
    <HStack justify="center" mt={4}>
    <Image src="/coin_lg.png" w={'84px'} h={'84px'} />
    <Text fontSize="44px" fontWeight="bold">
      {scoreFormatter}
    </Text>
  </HStack>
  );
};

export default TopScore;

TopScore.propTypes = {
  score: PropTypes.number.isRequired,  
};
