import { useContext, useEffect, useState } from "react"
import { AppContext } from "../../../context/AppContext";
import SingleChat from "../SingleChat/SingleChat";
import { onValue, ref } from "firebase/database";
import { db } from "../../../config/firebase-setup";
import { Box, Flex, Heading, Text } from "@chakra-ui/react";

const AllChats: React.FC = () => {
    const { userData } = useContext(AppContext);
    const [allChats, setAllChats] = useState<any[] | null>(null);

    useEffect(() => {
        if (userData) {
            const chatsRef = ref(db, `chats`);
            const unsubscribe = onValue(chatsRef, async (snapshot) => {
                if (snapshot.exists()) {
                    const chats = Object.keys(snapshot.val()).filter(chatUsers => chatUsers.split('_').includes(userData.uid));
                    setAllChats(chats);
                } else {
                    setAllChats([]);
                }
            });
            return () => unsubscribe();
        }
    }, [userData]);
    

    return allChats && userData && (
        <Box minHeight="100vh">
            <Text fontSize="2xl" fontWeight="bold" mb={5}>My Chats</Text>
            {allChats.map((chatId, index) => {
                return <SingleChat key={index} chatId={chatId} userId={chatId.split('_').filter(userId => userId !== userData.uid)[0]} />
            })}
        </Box>
    )
}

export default AllChats;