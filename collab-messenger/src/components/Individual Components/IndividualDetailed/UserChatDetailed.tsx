import { useContext, useEffect, useState } from "react";
import {getUserData} from "../../../services/user-services";
import { AppContext } from "../../../context/AppContext";
import SingleChat from "../SingleChatText/SingleChat";
import { useParams } from "react-router-dom";
import CreateIndividualChat from "../CreateMessage/CreateIndividualChat";
import { onValue, ref } from "firebase/database";
import { db } from "../../../config/firebase-setup";
import { Box, Flex } from "@chakra-ui/react";
import { UserChatDetailed } from "../../../types/types";
import MemberList from "../../Channel Components/MemberList/MemberList";

const UserChatDetailed: React.FC = () => {
    const { userData } = useContext(AppContext);
    const [user, setUser] = useState<UserChatDetailed | null>(null);
    const { userId, chatId } = useParams<{ userId: string, chatId: string }>();

    useEffect(() => {
        if (userData && userId) {
            getUserData(userId).then(setUser); 
        }
        if (userData && chatId) {
            const chatRef = ref(db, `chats/${chatId}`);
            const unsubscribe = onValue(chatRef, (snapshot) => {
                if (snapshot.exists()) {
                    const chat = {
                        id: chatId,
                        ...snapshot.val(),
                        createdOn: new Date(snapshot.val().createdOn),
                        messages: snapshot.val().messages ? Object.keys(snapshot.val().messages) : []
                    };
                    setUser(chat);
                } else {
                    setUser(null);
                }
            });
            return () => unsubscribe();
        }
    }, [userId, chatId, userData]);

    return user && userData && (
        <Flex direction="column" justify="space-between" minHeight="100vh">
            <Flex>
                <Box flex="1" overflowY="auto" pb={4}>
                    {user && user.messages ? Object.keys(user.messages).map((userHandle, index) => {
                        return <SingleChat key={index} message={user.messages[userHandle]} user={user} />
                    }) : <p>No messages. Be the first to write something!</p>}
                </Box>
                <Box width="300px">
                    <MemberList members={user.members} /> 
                </Box>
            </Flex>
            <Box position="sticky" bottom={0} width="100%" borderTop="1px" borderColor="gray.200" backgroundColor="white" zIndex="sticky">
                <CreateIndividualChat />
            </Box>
        </Flex>
    )
}

export default UserChatDetailed;