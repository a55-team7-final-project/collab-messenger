import { useContext, useState } from "react";
import { AppContext } from "../../../context/AppContext";
import { addGroupChannelMessage } from "../../../services/group-services";
import { useParams } from "react-router-dom";
import { Box, Button, Flex, Input } from "@chakra-ui/react";

const CreateMessage = () => {
    const { userData } = useContext(AppContext);
    const [message, setMessage] = useState('');
    const { groupId, channelId } = useParams();

    const handleInputChange = (e) => {
        setMessage(e.target.value);
    }

    const createMessageClick = async () => {
        if (message.length === 0) {
            return;
        }
        
        await addGroupChannelMessage(groupId, channelId, userData!.handle, message);
        setMessage('');
    }

    return (
        userData && channelId && groupId && (
            <Flex as="footer" p={2} position="sticky" bottom={0} width="100%" backgroundColor="white" zIndex="sticky">
                <Box flex="1" mr={2} borderColor="navy" >
                    <Input value={message} onChange={handleInputChange} placeholder="Enter your message here" />
                </Box>
                <Button backgroundColor="navy" color="white" onClick={createMessageClick} _hover={{ bg: "blue" }}>Send</Button>
            </Flex>
        )
    );
};

export default CreateMessage;
