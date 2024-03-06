import { useContext, useEffect, useState } from "react"
import { getAllGroupChannels } from "../../../services/group-services";
import { AppContext } from "../../../context/AppContext";
import SingleChannel from "../SingleChannel/SingleChannel";
import CreateChannel from "../CreateChannel/CreateChannel";
import { useParams } from "react-router-dom";
import { onValue, ref } from "firebase/database";
import { db } from "../../../config/firebase-setup";


export default function AllChannels() {

    const { userData } = useContext(AppContext);
    const [allChannels, setAllChannels] = useState(null);

    const { groupId } = useParams();

    useEffect(() => {
        if (userData && groupId) {
            const channelsRef = ref(db, `groups/${groupId}/channels`);
            const unsubscribe = onValue(channelsRef, (snapshot) => {
                if (snapshot.exists()) {
                    const channels = Object.entries(snapshot.val()).map(([key, value]) => ({
                        id: key,
                        ...value,
                        createdOn: new Date(value.createdOn),
                        members: value.members ? Object.keys(value.members) : []
                    }));
                    setAllChannels(channels);
                } else {
                    setAllChannels([]);
                }
        });
        return () => unsubscribe();
        }
    }, [groupId, userData]);

return allChannels && userData && (
    <>
        <CreateChannel />
        {allChannels && allChannels.map((channel, index) => {
            return <SingleChannel key={index} channel={channel} />
        })}
    </>
)
}