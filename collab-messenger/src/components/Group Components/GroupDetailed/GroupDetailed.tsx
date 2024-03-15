import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getGroupById, joinGroupById, leaveGroupById, isMember, deleteGroupById } from "../../../services/group-services";
import { AppContext } from "../../../context/AppContext";
import AllChannels from "../../Channel Components/AllChannels/AllChannels";
import { Group } from "../../../types/types";
import { getUserByHandle } from "../../../services/user-services";
import MemberList from "../../Channel Components/MemberList/MemberList";
import { Box, Flex, Heading, Text, Button, Input, VStack } from "@chakra-ui/react";

export default function GroupDetailed() {
    const [group, setGroup] = useState<Group | null>(null);
    const { userData, userLoading } = useContext(AppContext);
    const { groupId } = useParams();
    const [newMemberUsername, setNewMemberUsername] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const [members, setMembers] = useState<string[]>([]);
    const navigate = useNavigate();


    useEffect(() => {
        if (groupId) {
            getGroupById(groupId).then(group => {
                setGroup(group);
                setMembers(group.members);
                setLoading(false);
            });
        }
    }, [groupId]);
    
    useEffect(() => {
        const timer = setTimeout(() => {
            setMessage('');
            setError('');
        }, 5000); 
    
        return () => clearTimeout(timer); 
    }, [message, error]);
    
    const addMember = async () => {
        
        if (userData!.handle !== group?.owner) {
            setError('Only the group owner can add users.');
            return;
        }
        const user = await getUserByHandle(newMemberUsername);
        if (!user) {
            setError('Non-existent user');
            return;
        }

        const isUserMember = await isMember(group.id, user.handle);
        if (isUserMember) {
            setError('User is already a member of the group.');
            return;
        }

        await joinGroupById(group.id, user.handle);
        setMessage('User added successfully.');
        setError('');
        updateMembers(); 
        const updatedGroup = await getGroupById(group.id);
        setGroup(updatedGroup);
        setNewMemberUsername('');
    };

    const removeMember = async () => {
        if (userData!.handle !== group?.owner) {
            setError('Only the group owner can remove users.');
            return;
        }
        const user = await getUserByHandle(newMemberUsername);
        if (!user) {
            setError('Non-existent user');
            return;
        }

        const isUserMember = await isMember(group.id, user.handle);
        if (!isUserMember) {
            setError('User is not a member of the group.');
            return;
        }

        if (newMemberUsername === group.owner) {
            setError('Owner cannot be removed from the group');
            return;
        }

        await leaveGroupById(group.id, user.handle);
        setMessage('User removed successfully.');
        setError('');
        updateMembers(); 
        const updatedGroup = await getGroupById(group.id);
        setGroup(updatedGroup);
        setNewMemberUsername('');
    };

    const updateMembers = async () => {
        const updatedGroup = await getGroupById(group.id);
        setGroup(updatedGroup);
        setMembers(updatedGroup.members); // Update the members list
        setNewMemberUsername('');
    };

    const deleteGroup = async () => {
        deleteGroupById(group.id);
        navigate(-1);
    }

    const leaveGroup = async () => {
        leaveGroupById(group.id, userData.handle);
        navigate(-1);
    }

    if (loading || userLoading) {
        return <div>Loading...</div>;
    }

    if (group && userData) {
        if (!members.includes(userData.handle)) {
        return <div>You are not a member of this group.</div>
        }
    }

    return group && userData && (
        <Flex direction="column" align="center" justify="center" m={5}>
            <Box flex="1" p={5} shadow="md" borderWidth="1px">
                <Heading fontSize="xl">{group.name}</Heading>
                <Text mt={4}>Owner: {group.owner}</Text>
                <VStack spacing={4} align="stretch" mt={5}>
                    {group.owner === userData.handle && 
                        <Button colorScheme="teal" variant="outline" onClick={deleteGroup}>Delete Group</Button>}
                    {group.owner !== userData.handle && 
                        <Button colorScheme="teal" variant="outline" onClick={leaveGroup}>Leave Group</Button>}
                </VStack>
                <AllChannels groupOwner={group.owner} />
            </Box>
            <Box width="300px" p={5} shadow="md" borderWidth="1px">
                <VStack spacing={4} align="stretch">
                    <Input
                        type="text"
                        placeholder="Enter member's username"
                        value={newMemberUsername}
                        onChange={(e) => setNewMemberUsername(e.target.value)}
                    />
                    <Button colorScheme="teal" variant="outline" onClick={addMember}>Add Member</Button>
                    <Button colorScheme="teal" variant="outline" onClick={removeMember}>Remove Member</Button>
                    {error && <p style={{ color: 'red' }}>{error}</p>}
                    {message && <p style={{ color: 'green' }}>{message}</p>}
                </VStack>
                <MemberList members={members} />
            </Box>
        </Flex>
    )
}
