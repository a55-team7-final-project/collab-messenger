import { Box, Text, Flex } from "@chakra-ui/react";

export default function SingleChannelText({ message }) {
    return (
        <Flex align="center">
            <Text fontWeight="bold" marginRight="2">{message.userHandle}:</Text>
            <Box mt={2} border="1px" borderRadius="50" p="2">
                <Text>{message.text}</Text>
            </Box>
        </Flex>
    );
}
