import { useContext, useEffect, useState } from "react"
import { getAllGroupChannels, getGroupChannelById } from "../../../services/group-services";
import { AppContext } from "../../../context/AppContext";
import SingleChannel from "../SingleChannel/SingleChannel";
import CreateChannel from "../CreateChannel/CreateChannel";
import SingleChannelText from "../SIngleChannelText/SingleChannelText";
import { useParams } from "react-router-dom";


export default function ChannelDetailed () {

    const { userData } = useContext(AppContext);
    const [channel, setChannel] = useState(null);

    const { groupId, channelId } = useParams();

    useEffect(() => {
        if (userData && channelId && groupId) {
        getGroupChannelById(groupId, channelId).then(setChannel);
        }
    }, [groupId, channelId, userData]);

    return channel && userData && (
        <>
        {/* <CreateChannel groupId={groupId} /> */}
        {channel && channel.messages ? Object.keys(channel.messages).map((userHandle, index) => {
            return <SingleChannelText key={index} text={channel.messages[userHandle]} userHandle={userHandle}/>
        }) : <p>No messages</p>}
        </>
    )
}