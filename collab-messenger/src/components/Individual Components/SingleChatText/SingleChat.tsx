import { Box, Flex, Text } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AppContext } from "../../../context/AppContext";
import { IndividualChat, User } from "../../../types/types";

type SingleChatProps = {
    chat: IndividualChat;
    user: User;
};

export default function SingleChat({ chat, user }: SingleChatProps) {
    const navigate = useNavigate();
    const { userData } = useContext(AppContext);

    const onClick = () => {
        if (userData) navigate(`/users/${userData.uid}/chats/${user.uid}`);
    }

    return (
        <Box border="1px" borderColor="gray.200" borderRadius="md" p={4} onClick={onClick}>
            <Flex justifyContent="space-between">
                <Text fontWeight="bold">{user.handle}</Text>
                <Text>{chat.text}</Text>
            </Flex>
        </Box>
    );
}
