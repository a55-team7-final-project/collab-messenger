import { useContext, useEffect, useState } from "react"
import { getAllGroupChannels } from "../../../services/group-services";
import { AppContext } from "../../../context/AppContext";
import SingleChannel from "../SingleChannel/SingleChannel";
import CreateChannel from "../CreateChannel/CreateChannel";
import { useParams } from "react-router-dom";


export default function AllChannels () {

    const { userData } = useContext(AppContext);
    const [allChannels, setAllChannels] = useState(null);

    const { groupId } = useParams();

    useEffect(() => {
        if (userData && groupId) {
        getAllGroupChannels(groupId).then(channels => {
            const filtered = channels.filter(channel => channel.members.includes(userData.handle));
            setAllChannels(filtered);
        })
        }
    }, [groupId, userData]);

    return allChannels && userData && (
        <>
        <CreateChannel />
        {allChannels && allChannels.map((channel,index) => {
            return <SingleChannel key={index} channel={channel}/>
        })}
        </>
    )
}