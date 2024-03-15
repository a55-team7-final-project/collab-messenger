import { useContext, useEffect, useState } from "react";
import { getGroupChannelById, isChannelMember, joinGroupChannelById, leaveGroupChannelById } from "../../../services/group-services";
import { AppContext } from "../../../context/AppContext";
import SingleChannelText from "../SIngleChannelText/SingleChannelText";
import { useParams } from "react-router-dom";
import CreateMessage from "../CreateMessage/CreateMessage";
import { onValue, ref } from "firebase/database";
import { db } from "../../../config/firebase-setup";
import { Box, Flex, Text, VStack, Button, Input } from "@chakra-ui/react";
import MemberList from "../MemberList/MemberList";
import { getUserByHandle } from "../../../services/user-services";

export default function ChannelDetailed() {

    const { userData } = useContext(AppContext);
    const [channel, setChannel] = useState(null);

    const [newMemberUsername, setNewMemberUsername] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const { groupId, channelId } = useParams();

    useEffect(() => {
        if (userData && channelId && groupId) {
            getGroupChannelById(groupId, channelId).then(setChannel);
        }
        if (userData && groupId && channelId) {
            const channelRef = ref(db, `groups/${groupId}/channels/${channelId}`);
            const unsubscribe = onValue(channelRef, (snapshot) => {
                if (snapshot.exists()) {
                    const channel = {
                        id: channelId,
                        ...snapshot.val(),
                        createdOn: new Date(snapshot.val().createdOn),
                        members: snapshot.val().members ? Object.keys(snapshot.val().members) : []
                    };
                    setChannel(channel);
                } else {
                    setChannel(null);
                }
            });
            return () => unsubscribe();
        }
    }, [groupId, channelId, userData]);

    useEffect(() => {
        const timer = setTimeout(() => {
            setMessage('');
            setError('');
        }, 5000);

        return () => clearTimeout(timer);
    }, [message, error]);

    const addMember = async () => {

        // if (userData!.handle !== group?.owner) {
        //     setError('Only the group owner can add users.');
        //     return;
        // }
        const user = await getUserByHandle(newMemberUsername);
        if (!user) {
            setError('Non-existent user');
            return;
        }

        const isUserMember = await isChannelMember(groupId, channelId, user.handle);
        if (isUserMember) {
            setError('User is already a member of this channel.');
            return;
        }

        await joinGroupChannelById(groupId, channelId, user.handle);
        setMessage('User added successfully.');
        setError('');
        setNewMemberUsername('');
    };

    const removeMember = async () => {
        // if (userData!.handle !== group?.owner) {
        //     setError('Only the group owner can remove users.');
        //     return;
        // }
        const user = await getUserByHandle(newMemberUsername);
        if (!user) {
            setError('Non-existent user');
            return;
        }

        const isUserMember = await isChannelMember(groupId, channelId, user.handle);
        if (!isUserMember) {
            setError('User is not a member of this channel.');
            return;
        }

        if (channel.members.length === 1) {
            setError('Channel must have at least 1 member.');
            return;
        }

        await leaveGroupChannelById(groupId, channelId, user.handle);
        setMessage('User removed successfully.');
        setError('');
        setNewMemberUsername('');
    };

    return channel && userData && (
        <Flex direction="column" justify="space-between" minHeight="100vh">
            <Flex>
                <Box flex="1" overflowY="auto" pb={4} width="850px"> {/* Set a constant width */}
                    {channel && channel.messages ? Object.keys(channel.messages).map((userHandle, index) => {
                        return <SingleChannelText key={index} message={channel.messages[userHandle]} />
                    }) : <p>No messages. Be the first to write something!</p>}
                </Box>
                {!channel.publicity && <Box width="300px" >
                    <Text my={3}>This is a private channel.</Text>
                    <VStack spacing={2} mx={10} mb={2}>
                        <Input
                            placeholder="Enter member's username"
                            value={newMemberUsername}
                            onChange={(e) => setNewMemberUsername(e.target.value)}
                        />
                        <Flex>
                        <Button onClick={addMember} colorScheme="blue" mr={2} >Add</Button>
                        <Button onClick={removeMember} colorScheme="teal">Remove</Button>
                        </Flex>
                        {error && <Text color="red">{error}</Text>}
                        {message && <Text color="green">{message}</Text>}
                    </VStack>                    
                    <MemberList members={channel.members} />
                </Box>}
            </Flex>
            <Box position="sticky" bottom={0} width="100%" zIndex="sticky">
                <CreateMessage />
            </Box>
        </Flex>
    )
}    