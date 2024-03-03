import { Box, Flex, Text } from "@chakra-ui/react";
import { useNavigate, useParams } from "react-router-dom";


export default function SingleChannel ({channel}) {
    const navigate = useNavigate();

    const { groupId } = useParams();

    const onClick = () => {
        if (groupId) navigate(`/groups/${groupId}/channels/${channel.id}`);
        // console.log('it will navigate to the correct chat');
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