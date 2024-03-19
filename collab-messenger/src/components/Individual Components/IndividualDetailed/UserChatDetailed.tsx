import { useContext, useEffect, useState } from "react";
import { AppContext } from "../../../context/AppContext";
import SingleChat from "../SingleChatText/SingleChat";
import { useParams } from "react-router-dom";
import CreateIndividualChat from "../CreateMessage/CreateIndividualChat";
import { onValue, ref } from "firebase/database";
import { db } from "../../../config/firebase-setup";
import { Box, Flex, Text } from "@chakra-ui/react";
import { UserChatDetailed } from "../../../types/types";
import CustomEmojiPicker from "../../EmojiPicker/EmojiPicker";
import { getUserData } from "../../../services/user-services";

const UserChatDetailed: React.FC = () => {
    const { userData } = useContext(AppContext);
    const [chat, setChat] = useState<UserChatDetailed | null>(null);
    const [otherUser, setOtherUser] = useState(null);
    const { chatId, userId } = useParams<{ userId: string, chatId: string }>();

    useEffect(() => {
        if (userData && chatId) {
            const chatRef = ref(db, `chats/${chatId}`);
            const unsubscribe = onValue(chatRef, (snapshot) => {
                if (snapshot.exists()) {
                    const chat = {
                        id: chatId,
                        ...snapshot.val(),
                        createdOn: new Date(snapshot.val().createdOn),
                        messages: Object.keys(snapshot.val()).map(messageId => ({
                            id: messageId,
                            createdOn: new Date(snapshot.val()[messageId].createdOn),
                            ...snapshot.val()[messageId]
                        }))
                    };
                    setChat(chat);
                } else {
                    setChat(null);
                }
            });
            return () => unsubscribe();
        }
    }, [chatId, userData]);

    useEffect(() => {
        if (userId) {
            getUserData(userId).then(setOtherUser);
        }
    }, [userId]);

    const handleEmojiSelect = (emoji: string) => {
        console.log('Selected emoji:', emoji);
    };

    return userData && chatId && otherUser && (
        <Flex direction="column" justify="space-between" minHeight="100vh">
            <Text fontSize="2xl" fontWeight="bold">Chat With {otherUser.handle}</Text>
            <Flex>
                <Box flex="1" overflowY="auto" pb={4}>
                    {chat ? Object.keys(chat.messages).map((userHandle, index) => {
                        return <SingleChat key={index} message={chat.messages[userHandle]} />
                    }) : <p>No messages. Be the first to write something!</p>}
                </Box>
            </Flex>
            <Box position="sticky" bottom={0} width="100%" borderTop="1px" borderColor="gray.200" backgroundColor="white" zIndex="sticky">
                <CreateIndividualChat />
                <CustomEmojiPicker onSelectEmoji={handleEmojiSelect} />
            </Box>
        </Flex>
    )
}

export default UserChatDetailed;