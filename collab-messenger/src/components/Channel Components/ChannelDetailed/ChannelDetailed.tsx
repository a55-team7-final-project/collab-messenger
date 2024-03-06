import { useContext, useEffect, useState } from "react"
import { getAllGroupChannels, getGroupChannelById } from "../../../services/group-services";
import { AppContext } from "../../../context/AppContext";
import SingleChannel from "../SingleChannel/SingleChannel";
import CreateChannel from "../CreateChannel/CreateChannel";
import SingleChannelText from "../SIngleChannelText/SingleChannelText";
import { useParams } from "react-router-dom";
import CreateMessage from "../CreateMessage/CreateMessage";
import { onValue, ref } from "firebase/database";
import { db } from "../../../config/firebase-setup";


export default function ChannelDetailed() {

    const { userData } = useContext(AppContext);
    const [channel, setChannel] = useState(null);

    const { groupId, channelId } = useParams();

    useEffect(() => {
        if (userData && channelId && groupId) {
            getGroupChannelById(groupId, channelId).then(setChannel);
        }
        if (userData && groupId && channelId) {
            const channelRef = ref(db, `groups/${groupId}/channels/${channelId}`);
            const unsubscribe = onValue(channelRef, (snapshot) => {
                if (snapshot.exists()) {
                    const channel = {
                        id: channelId,
                        ...snapshot.val(),
                        createdOn: new Date(snapshot.val().createdOn),
                        members: snapshot.val().members ? Object.keys(snapshot.val().members) : []
                    };
                    setChannel(channel);
                } else {
                    setChannel(null);
                }
            });
            return () => unsubscribe();
        }
    }, [groupId, channelId, userData]);

    return channel && userData && (
        <>
            {/* <CreateChannel groupId={groupId} /> */}
            {channel && channel.messages ? Object.keys(channel.messages).map((userHandle, index) => {
                return <SingleChannelText key={index} text={channel.messages[userHandle]} userHandle={userHandle} />
            }) : <p>No messages</p>}
            <br />
            <CreateMessage />
        </>
    )
}