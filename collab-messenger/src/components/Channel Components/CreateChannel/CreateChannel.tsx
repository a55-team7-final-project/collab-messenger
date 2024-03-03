import { useContext, useState } from "react"
import { AppContext } from "../../../context/AppContext"
import { addGroupChannel } from "../../../services/group-services";
import { useParams } from "react-router-dom";

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

    const handleRadioChange = (e) => {
        setChannel({...channel, publicity: e.target.value === 'public'});
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
            <>
                <label htmlFor="channel-name"></label>
                <input value={channel.name} onChange={handleInputChange} type="text" name="channel-name" id="channel-name" placeholder="Enter channel name" />
                <div onChange={handleRadioChange}>
                    <input type="radio" value="public" name="publicity" defaultChecked /> Public
                    <input type="radio" value="private" name="publicity" /> Private
                </div>
                <button id="create-channel-button" onClick={createChannelClick}>Create Channel</button>
                {errorMessage && <p>{errorMessage}</p>}
            </>
        )
    );
}
