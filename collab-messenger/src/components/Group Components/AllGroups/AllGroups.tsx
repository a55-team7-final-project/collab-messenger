import { useContext, useEffect, useState } from "react"
import { getAllGroups } from "../../../services/group-services";
import { AppContext } from "../../../context/AppContext";
import SingleGroup from "../SingleGroup/SingleGroup";
import CreateGroup from "../CreateGroup/CreateGroup";
import {Group} from "../../../types/types";

interface AllGroupsProps {}

const AllGroups: React.FC<AllGroupsProps> = () => {
    const { userData } = useContext(AppContext);
    const [allGroups, setAllGroups] = useState<Group[]>([]);

    useEffect(() => {
        if (userData) {
            getAllGroups().then(groups => setAllGroups(groups));
        }
    }, [userData]);

    return (
        <>
            <CreateGroup/>
            {userData && allGroups.map((group) => (
                <SingleGroup key={group.id} group={group} currentUser={userData}/>
            ))}
        </>
    );
};

export default AllGroups;