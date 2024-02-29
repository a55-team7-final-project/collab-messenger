import { useContext, useState } from "react"
import { AppContext } from "../../../context/AppContext"
import { addGroup, getGroupByName } from "../../../services/group-services";

export default function CreateGroup () {

    const { userData } = useContext(AppContext);
    const [errorMessage, setErrorMessage] = useState(null);

    const [group, setGroup] = useState({
        name: ''
    });

    const handleInputChange = (e) => {
        setGroup({...group, name: e.target.value});
        if (e.target.value.length < 3 || e.target.value.length > 40) {
            setErrorMessage('Name must be between 3 and 40 characters');
            return
        }
        setErrorMessage(null);
    }

    const createGroupClick = async () => {
        if (group.name.length === 0) {
            setErrorMessage('Name must be between 3 and 40 characters');
            return;
        }
        if (errorMessage !== null) return
        if ((await getGroupByName(group.name)).length > 0) {
            setErrorMessage('Group with this name already exists');
            return
        }
        addGroup(userData.handle, group.name);
        setGroup({name:''});
    }

    return (
        userData && (
            <>
                <label htmlFor="group-name"></label>
                <input value={group.name} onChange={handleInputChange} type="text" name="group-name" id="group-name" placeholder="Enter group name" />
                {errorMessage && <p>{errorMessage}</p>}
                <button id="create-group-button" onClick={createGroupClick}>Create Group</button>
            </>
        )
    );
}
