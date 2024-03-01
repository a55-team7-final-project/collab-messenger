import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getGroupById } from "../../../services/group-services";
import { AppContext } from "../../../context/AppContext";
import CreateChannel from "../../Channel Components/CreateChannel/CreateChannel";
import AllChannels from "../../Channel Components/AllChannels/AllChannels";


export default function GroupDetailed () {
    const [group, setGroup] = useState(null);

    const { userData } = useContext(AppContext);

    const { groupId } = useParams();


    useEffect(() => {
        if (groupId) getGroupById(groupId).then(setGroup);
    },[groupId]);

    return group && (
        <div>
            <AllChannels groupId={groupId} />
        </div>
    )
}