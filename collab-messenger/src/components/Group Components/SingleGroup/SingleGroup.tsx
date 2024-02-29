import { Box, Flex, Text } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";


export default function SingleGroup ({group}) {
    const navigate = useNavigate();

    const onClick = () => {
        navigate(`/${group.name}`);
    }
    return (
        <Box border="1px" borderColor="gray.200" borderRadius="md" p={4} onClick={onClick}>
            <Flex justifyContent="space-between">
                <Text fontWeight="bold">{group.name}</Text>
                <Text>Members: {Object.keys(group.members).length}</Text>
            </Flex>
            <Flex justifyContent="space-between" mt={2}>
                <Text>Created By: {group.owner}</Text>
                <Text>Channels: {Object.keys(group.channels).length}</Text>
            </Flex>
        </Box>
    )
}