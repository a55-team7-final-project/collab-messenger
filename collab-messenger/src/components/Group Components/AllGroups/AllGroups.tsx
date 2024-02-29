import { useContext, useEffect, useState } from "react"
import { getAllGroups } from "../../../services/group-services";
import { AppContext } from "../../../context/AppContext";
import SingleGroup from "../SingleGroup/SingleGroup";
import CreateGroup from "../CreateGroup/CreateGroup";


export default function AllGroups () {

    // const { userData } = useContext(AppContext);
    const [allGroups, setAllGroups] = useState([]);

    useEffect(() => {
        getAllGroups().then(setAllGroups);
    }, []);

    return (
        <>
        <CreateGroup/>
        {allGroups && allGroups.map((group,index) => {
            return <SingleGroup key={index} group={group}/>
        })}
        </>
    )
}