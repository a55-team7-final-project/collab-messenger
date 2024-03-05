import { Box, Flex, Text } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { User, Group } from "../../../types/types";


interface SingleGroupProps {
    group: Group;
    currentUser: User;
    onClick: () => void; 
}

const SingleGroup: React.FC<SingleGroupProps> = ({ group }) => {
    const navigate = useNavigate();

    const onClick = () => {
        navigate(`/groups/${group.id}`);
    }

return (

    <Box border="1px" borderColor="gray.200" borderRadius="md" p={4} onClick={onClick}>
            <Flex justifyContent="space-between">
                <Text fontWeight="bold">{group.name}</Text>
                <Text>Members: {Object.keys(group.members).length}</Text>
            </Flex>
            <Flex justifyContent="space-between" mt={2}>
                <Text>
                    Created By: {group.owner} (
                    {group.members && group.members[group.owner] ? group.members[group.owner].status : 'Status not available'})
                </Text>
                <Text>Channels: {Object.keys(group.channels).length}</Text>
            </Flex>
            {group.meetings && Object.values(group.meetings).map(meeting => (
                <Text key={meeting.id}>Meeting at {new Date(meeting.date).toString()} for {meeting.duration} minutes</Text>
            ))}
        </Box>
    );
};


export default SingleGroup;