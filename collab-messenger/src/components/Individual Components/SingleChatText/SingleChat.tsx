import { Box, Flex, Text } from "@chakra-ui/react";
import { IndividualChat } from "../../../types/types";

interface SingleChatProps {
    message: IndividualChat;
}

const SingleChat: React.FC<SingleChatProps> = ({ message }) => {
    return (
        <Flex align="center">
            <Text fontWeight="bold" marginRight="2">{message.userHandle}:</Text>
            <Box mt={2} border="1px" borderRadius="50" p="2" pr="4" pl="4" backgroundColor="navy" color="white" whiteSpace="pre-wrap" textAlign="left">
                <Text fontWeight="bold">{message.text}</Text>
            </Box>
        </Flex>
    );
}

export default SingleChat;
