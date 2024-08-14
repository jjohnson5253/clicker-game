import { Box, Flex, Text } from "@chakra-ui/react";
import PropTypes from "prop-types";

const TopScore = ({ score1, score2 }) => {
  const total = score1 + score2;
  const percentage1 = total === 0 ? 50 : (score1 / total) * 100;
  const percentage2 = total === 0 ? 50 : (score2 / total) * 100;

  return (
    <Flex w="100%" h="6" bg="gray.200" borderRadius={16}>
      <Box textAlign={"center"} w={`${percentage1}%`} borderLeftRadius={6} bg="#C91605">
        <Text fontWeight={800}>{score1}</Text>
      </Box>
      <Box w={`${percentage2}%`} textAlign={"center"} bg="#000E8A" borderRightRadius={6}>
        <Text fontWeight={800}> {score2}</Text>
      </Box>
    </Flex>
  );
};

export default TopScore;

TopScore.propTypes = {
  score1: PropTypes.number.isRequired,
  score2: PropTypes.number.isRequired,
};
