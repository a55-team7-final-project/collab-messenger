import { useContext, useState } from "react"
import { AppContext } from "../../../context/AppContext"
import { addGroup, getGroupByName } from "../../../services/group-services";
import { Box, Button, FormControl, FormLabel, Input, Text } from "@chakra-ui/react";


interface CreateGroupProps { }

const CreateGroup: React.FC<CreateGroupProps> = () => {
    const { userData } = useContext(AppContext);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [group, setGroup] = useState<{ name: string, owner: string, id: string }>({ name: '', owner: '', id: '' });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setGroup({ ...group, name: e.target.value });
        if (e.target.value.length < 3 || e.target.value.length > 40) {
            setErrorMessage('Name must be between 3 and 40 characters');
            return;
        }
        setErrorMessage(null);
    }

    const createGroupClick = async () => {
        if (group.name.length === 0) {
            setErrorMessage('Name must be between 3 and 40 characters');
            return;
        }
        if (errorMessage !== null) return;

        const existingGroups = await getGroupByName(group.name);
        if (existingGroups.length > 0) {
            setErrorMessage('Group with this name already exists');
            return;
        }

        await addGroup(userData!.handle, group.name);
        setGroup({ name: '', owner: userData!.handle, id: '' });
    }

    return (
        userData && (
            <Box width="300px" margin="auto" marginTop="50px">
                <FormControl id="group-name">
                    
                    <Input value={group.name} onChange={handleInputChange} type="text" placeholder="Enter group name" />
                </FormControl>
                <Button id="create-group-button" onClick={createGroupClick} colorScheme="teal" size="md" width="100%" marginTop="20px">
                    Create Group
                </Button>
                {errorMessage && <Text color="red.500" marginTop="10px">{errorMessage}</Text>}
            </Box>
        )
    );
};

export default CreateGroup;
