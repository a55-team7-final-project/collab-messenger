import { useContext, useState } from "react"
import { AppContext } from "../../../context/AppContext"
import { addGroupChannel } from "../../../services/group-services";
import { useParams } from "react-router-dom";
import { Alert, Button, FormControl, FormLabel, Input, Checkbox, VStack, Box } from "@chakra-ui/react";

export default function CreateChannel () {

    const { userData } = useContext(AppContext);
    const [errorMessage, setErrorMessage] = useState(null);

    const { groupId } = useParams();

    const [channel, setChannel] = useState({
        name: '',
        publicity: true
    });

    const handleInputChange = (e) => {
        setChannel({...channel, name: e.target.value});
        if (e.target.value.length < 3 || e.target.value.length > 40) {
            setErrorMessage('Name must be between 3 and 40 characters');
            return
        }
        setErrorMessage(null);
    }

    const handleCheckboxChange = (e) => {
        setChannel({ ...channel, publicity: !e.target.checked });
    }

    const createChannelClick = async () => {
        if (channel.name.length === 0) {
            setErrorMessage('Name must be between 3 and 40 characters');
            return;
        }
        if (errorMessage !== null) return

        addGroupChannel(groupId, userData.handle, channel.name, channel.publicity);
        setChannel({name:'', publicity: true});
    }

    return (
        userData && groupId && (
            <VStack spacing={4} align="stretch" bg="teal.50" p={5} borderRadius="md" boxShadow="xl">
                <FormControl id="channel-name">
                    <FormLabel>Channel Name</FormLabel>
                    <Input value={channel.name} onChange={handleInputChange} placeholder="Enter channel name" bg="white" />
                </FormControl>
                <Box display="flex" alignItems="center">
                    <Checkbox colorScheme={channel.publicity ? "green" : "red"} onChange={handleCheckboxChange} isChecked={!channel.publicity}>Private</Checkbox>
                </Box>
                <Button colorScheme="teal" id="create-channel-button" onClick={createChannelClick}>Create Channel</Button>
                {errorMessage && <Alert status="error">{errorMessage}</Alert>}
            </VStack>
        )
    );
}
