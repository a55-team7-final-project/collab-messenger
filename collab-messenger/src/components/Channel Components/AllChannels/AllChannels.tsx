import { useContext, useEffect, useState } from "react"
import { getAllGroupChannels } from "../../../services/group-services";
import { AppContext } from "../../../context/AppContext";
import SingleChannel from "../SingleChannel/SingleChannel";
import CreateChannel from "../CreateChannel/CreateChannel";


export default function AllChannels ({groupId}) {

    const { userData } = useContext(AppContext);
    const [allChannels, setAllChannels] = useState(null);

    useEffect(() => {
        getAllGroupChannels(groupId).then(setAllChannels);
    }, [groupId]);

    return allChannels && userData && (
        <>
        <CreateChannel groupId={groupId} />
        {allChannels && allChannels.map((channel,index) => {
            return <SingleChannel key={index} channel={channel}/>
        })}
        </>
    )
}