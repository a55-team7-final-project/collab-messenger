import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getGroupById, joinGroupById, leaveGroupById } from "../../../services/group-services";
import { AppContext } from "../../../context/AppContext";
import CreateChannel from "../../Channel Components/CreateChannel/CreateChannel";
import AllChannels from "../../Channel Components/AllChannels/AllChannels";
import { Group } from "../../../types/types";
import { getUserData } from "../../../services/user-services";

export default function GroupDetailed() {
    const [group, setGroup] = useState<Group | null>(null);     
    const { userData } = useContext(AppContext);
    const { groupId } = useParams();
    const [newMemberId, setNewMemberId] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);

    const addMember = async () => {
        if (userData!.uid !== group?.owner) {
            setError('Only the group owner can add users.');
            return;
        }
        const user = await getUserData(newMemberId);
        if (!user) {
            setError('Non-existent user, please try with a different User-ID.');
            return;
        }

        if (group && Object.prototype.hasOwnProperty.call(group.members, newMemberId)) {
            setError('User is already a member of the group.');
            return;
        }
    
        await joinGroupById(group.id, newMemberId);
        setMessage('User added successfully.');
        setError('');
        getGroupById(group.id).then(setGroup);
        setNewMemberId('');
    };

    const removeMember = async () => {
        if (userData!.uid !== group?.owner) {
            setError('Only the group owner can remove users.');
            return;
        }
    
        if (group && !Object.prototype.hasOwnProperty.call(group.members, newMemberId)) {
            setError('User is not a member of the group.');
            return;
        }
    
        await leaveGroupById(group.id, newMemberId);
        setMessage('User removed successfully.');
        setError('');
        getGroupById(group.id).then(setGroup);
        setNewMemberId('');
    };

    useEffect(() => {
        if (groupId) {
            getGroupById(groupId).then(group => {
                setGroup(group);
                setLoading(false); 
            });
        }
    }, [groupId]);

    if (loading) {
        return <div>Loading...</div>; 
    }


    return group && userData && (
        <div>
            
            <h2>{group.name}</h2>
            <p>Owner: {group.owner}</p>
            {userData!.uid === group.owner && (
                <>
                    <input type="text" placeholder="Enter member's user ID" onChange={e => setNewMemberId(e.target.value)} />
                    <button onClick={addMember}>Add Member</button>
                    <button onClick={removeMember}>Remove Member</button>
                </>
            )}
            <AllChannels groupId={groupId} />
            {error && <p style={{color: 'red'}}>{error}</p>}
            {message && <p style={{color: 'green'}}>{message}</p>}
        </div>
    )
}