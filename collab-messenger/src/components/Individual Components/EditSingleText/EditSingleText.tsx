import { Box, Button, Input, Heading, Text } from "@chakra-ui/react";
import { IndividualChat } from "../../../types/types";
import { useState } from "react";
import { editMessage } from "../../../services/messages-services";

const SingleChannelText: React.FC<{ message: IndividualChat }> = ({ message }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editedMessage, setEditedMessage] = useState(message.text);

    const onEditClick = () => {
        setIsEditing(true);
        setEditedMessage(message.text); 
    }

    const onSaveClick = async () => {
        const success = await editMessage(message.chatID, message.id, editedMessage);
        if (success) {
            setIsEditing(false);
        } else {
            console.error("Error saving edited message");
        }
    }

    return (
        <Box>
            <Heading>{message.userHandle}</Heading>
            {isEditing ? (
                <Box>
                    <Input value={editedMessage} onChange={(e) => setEditedMessage(e.target.value)} />
                    <Button onClick={onSaveClick}>Save</Button>
                </Box>
            ) : (
                <Box>
                    <Text>{message.text}</Text>
                    <Button onClick={onEditClick}>Edit</Button>
                </Box>
            )}
        </Box>
    );
};


export default SingleChannelText;
