import { useContext, useState } from "react"
import { AppContext } from "../../../context/AppContext"
import { addGroupChannelMessage } from "../../../services/group-services";
import { useParams } from "react-router-dom";


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
            <>
                <label htmlFor="message-text"></label>
                <input value={message} onChange={handleInputChange} type="text" name="message-text" id="message-name" placeholder="Enter your message here" />
                <button id="create-message-button" onClick={createMessageClick}>Send</button>
            </>
        )
    );
};

export default CreateMessage;
