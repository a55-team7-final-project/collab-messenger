import { useContext, useEffect, useState } from "react";
import { getGroupChannelById } from "../../../services/group-services";
import { AppContext } from "../../../context/AppContext";
import SingleChannelText from "../SIngleChannelText/SingleChannelText";
import { useParams } from "react-router-dom";
import CreateMessage from "../CreateMessage/CreateMessage";
import { onValue, ref } from "firebase/database";
import { db } from "../../../config/firebase-setup";
import { Box, Flex } from "@chakra-ui/react";
import MemberList from "../MemberList/MemberList";

export default function ChannelDetailed() {

    const { userData } = useContext(AppContext);
    const [channel, setChannel] = useState(null);

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

    return channel && userData && (
        <Flex direction="column" justify="space-between" minHeight="100vh">
            <Flex>
                
            <Box flex="1" overflowY="auto" pb={4}>
                {channel && channel.messages ? Object.keys(channel.messages).map((userHandle, index) => {
                    return <SingleChannelText key={index} message={channel.messages[userHandle]} />
                }) : <p>No messages. Be the first to write something!</p>}
            </Box>
            <Box width="300px" >
                <MemberList members={channel.members} />
            </Box>
            </Flex>
            <Box position="sticky" bottom={0} width="100%" borderTop="1px" borderColor="gray.200" backgroundColor="white" zIndex="sticky">
                <CreateMessage />
            </Box>
        </Flex>
    )
}
