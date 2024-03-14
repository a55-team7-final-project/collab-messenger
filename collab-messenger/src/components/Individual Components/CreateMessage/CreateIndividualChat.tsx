import { useContext, useState } from "react";
import { AppContext } from "../../../context/AppContext";
import { addIndividualMessage } from "../../../services/user-services"; 
import { useParams } from "react-router-dom";
import { Box, Button, Flex, Input } from "@chakra-ui/react";

const CreateIndividualChat: React.FC = () => {
    const { userData } = useContext(AppContext);
    const [message, setMessage] = useState<string>('');
    const { userId } = useParams<{ userId: string }>();

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setMessage(e.target.value);
    }

    const createMessageClick = async () => {
        if (message.length === 0) {
            return;
        }
        
        await addIndividualMessage(userId, userData!.handle, message);
        setMessage('');
    }

    return (
        userData && userId && (
            <Flex as="footer" p={2} position="sticky" bottom={0} width="100%" borderTop="1px" borderColor="black" backgroundColor="white" zIndex="sticky">
                <Box flex="1" mr={2}>
                    <Input value={message} onChange={handleInputChange} placeholder="Enter your message here" />
                </Box>
                <Button onClick={createMessageClick}>Send</Button>
            </Flex>
        )
    );
};

export default CreateIndividualChat;

