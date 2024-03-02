import { Box, Flex, Text, Button } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { ref, set, remove } from "firebase/database";
import { db } from "../../../config/firebase-setup";
import { User, Group } from "../../../types/types";


interface SingleGroupProps {
    group: Group;
    currentUser: User;
}

const SingleGroup: React.FC<SingleGroupProps> = ({ group, currentUser }) => {
    const navigate = useNavigate();

    const onClick = () => {
        navigate(`/groups/${group.id}`);
    }

    const addUser = (user: User) => {
        if (currentUser.uid !== group.owner) {
            return;
        }

        const userRef = ref(db, `groups/${group.id}/members/${user.uid}`);
        set(userRef, user);
    }

    const removeUser = (userId: string) => {
        if (currentUser.uid !== group.owner) {
            return;
        }

        const userRef = ref(db, `groups/${group.id}/members/${userId}`);
        remove(userRef);
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

            {currentUser.uid === group.owner && (
                <Flex mt={2}>
                    <Button onClick={() => addUser(currentUser)}>Add User</Button>
                    <Button onClick={() => removeUser(currentUser.uid)}>Remove User</Button>
                </Flex>
            )}
        </Box>
    );
};

export default SingleGroup;