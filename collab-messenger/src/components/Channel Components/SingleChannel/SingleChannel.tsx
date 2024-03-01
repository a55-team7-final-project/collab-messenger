import { Box, Flex, Text } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";


export default function SingleChannel ({channel}) {
    const navigate = useNavigate();

    const onClick = () => {
        // navigate(`/${channel.id}`);
        console.log('it will navigate to the correct chat');
    }
    return (
        <Box border="1px" borderColor="gray.200" borderRadius="md" p={4} onClick={onClick}>
            <Flex justifyContent="space-between">
                <Text fontWeight="bold">{channel.name}</Text>
                <Text>Members: {Object.keys(channel.members).length}</Text>
            </Flex>
            <Flex justifyContent="space-between" mt={2}>
                <Text>{channel.publicity ? 'public' : 'private'}</Text>
            </Flex>
        </Box>
    )
}