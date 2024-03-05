import { useContext, useEffect, useState } from "react"
import { getAllGroups } from "../../../services/group-services";
import { AppContext } from "../../../context/AppContext";
import SingleGroup from "../SingleGroup/SingleGroup";
import CreateGroup from "../CreateGroup/CreateGroup";
import {Group} from "../../../types/types";
import { useNavigate } from "react-router-dom";

interface AllGroupsProps {}

const AllGroups: React.FC<AllGroupsProps> = () => {
    const { userData } = useContext(AppContext);
    const [allGroups, setAllGroups] = useState<Group[]>([]);
    const navigate = useNavigate();

  const onClick = (groupId: string) => {
    // console.log(`Navigating to /groups/${groupId}`);
    navigate(`/groups/${groupId}`);
}
    useEffect(() => {
        if (userData) {
            getAllGroups().then(groups => setAllGroups(groups));
        }
    }, [userData]);

    return (
        <>
            <CreateGroup/>
            {userData && allGroups.map((group) => (
                <SingleGroup key={group.id} group={group} currentUser={userData} onClick={() => onClick(group.id)} />
            ))}
        </>
    );
};

export default AllGroups;