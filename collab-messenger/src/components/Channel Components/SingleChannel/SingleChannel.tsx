import { Box, Button, Flex, Heading, Badge } from "@chakra-ui/react";
import { useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AppContext } from "../../../context/AppContext";
import { deleteGroupChannelById } from "../../../services/group-services";


export default function SingleChannel({ channel, groupOwner }) {
    const navigate = useNavigate();
    const { userData } = useContext(AppContext);

    const { groupId } = useParams();

    const onClickChannel = () => {
        navigate(`/groups/${groupId}/channels/${channel.id}`);
    }

    const deleteChannel = async (e) => {
        e.stopPropagation();
        deleteGroupChannelById(groupId, channel.id);
    }

    return userData && groupId && (
        <Box border="1px" borderColor="gray.200" borderRadius="md" p={4} onClick={onClickChannel}>
            <Flex justifyContent="space-between">
                <Heading size="md">{channel.name}</Heading>
                {userData.handle === groupOwner && channel.name !== 'General' && <Button colorScheme="red" onClick={deleteChannel}>Delete Channel</Button>}
            </Flex>
            <Flex justifyContent="space-between" mt={2}>
                <Badge colorScheme={channel.publicity ? 'green' : 'red'}>{channel.publicity ? 'public' : 'private'}</Badge>
            </Flex>
        </Box>
    );
}