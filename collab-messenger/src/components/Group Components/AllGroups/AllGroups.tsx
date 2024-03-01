import { useContext, useEffect, useState } from "react"
import { getAllGroups } from "../../../services/group-services";
import { AppContext } from "../../../context/AppContext";
import SingleGroup from "../SingleGroup/SingleGroup";
import CreateGroup from "../CreateGroup/CreateGroup";

interface Group {
    id: string;
    name: string;
}

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
            {allGroups.map((group) => (
                <SingleGroup key={group.id} group={group}/>
            ))}
        </>
    );
};

export default AllGroups;