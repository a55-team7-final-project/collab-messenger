import { useContext, useState } from "react"
import { AppContext } from "../../../context/AppContext"
import { addGroup, getGroupByName } from "../../../services/group-services";

interface CreateGroupProps {}

const CreateGroup: React.FC<CreateGroupProps> = () => {
    const { userData } = useContext(AppContext);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [group, setGroup] = useState<{ name: string }>({ name: '' });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setGroup({...group, name: e.target.value});
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
        setGroup({name:''});
    }

    return (
        userData && (
            <>
                <label htmlFor="group-name"></label>
                <input value={group.name} onChange={handleInputChange} type="text" name="group-name" id="group-name" placeholder="Enter group name" />
                <button id="create-group-button" onClick={createGroupClick}>Create Group</button>
                {errorMessage && <p>{errorMessage}</p>}
            </>
        )
    );
};

export default CreateGroup;
