import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getGroupById, joinGroupById, leaveGroupById, isMember } from "../../../services/group-services";
import { AppContext } from "../../../context/AppContext";
import CreateChannel from "../../Channel Components/CreateChannel/CreateChannel";
import AllChannels from "../../Channel Components/AllChannels/AllChannels";
import { Group } from "../../../types/types";
import { getUserByHandle } from "../../../services/user-services";

export default function GroupDetailed() {
    const [group, setGroup] = useState<Group | null>(null);
    const { userData, userLoading } = useContext(AppContext);
    const { groupId } = useParams();
    const [newMemberUsername, setNewMemberUsername] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const [members, setMembers] = useState<string[]>([]);

    const addMember = async () => {
        
        if (userData!.handle !== group?.owner) {
            setError('Only the group owner can add users.');
            return;
        }
        const user = await getUserByHandle(newMemberUsername);
        if (!user) {
            setError('Non-existent user');
            return;
        }

        const isUserMember = await isMember(group.id, user.handle);
        if (isUserMember) {
            setError('User is already a member of the group.');
            return;
        }

        await joinGroupById(group.id, user.handle);
        setMessage('User added successfully.');
        setError('');
        updateMembers(); 
        const updatedGroup = await getGroupById(group.id);
        setGroup(updatedGroup);
        setNewMemberUsername('');
    };

    const removeMember = async () => {
        if (userData!.handle !== group?.owner) {
            setError('Only the group owner can remove users.');
            return;
        }
        const user = await getUserByHandle(newMemberUsername);
        if (!user) {
            setError('User is not a member of the group.');
            return;
        }

        const isUserMember = await isMember(group.id, user.handle);
        if (!isUserMember) {
            setError('User is not a member of the group.');
            return;
        }

        await leaveGroupById(group.id, user.handle);
        setMessage('User removed successfully.');
        setError('');
        updateMembers(); 
        const updatedGroup = await getGroupById(group.id);
        setGroup(updatedGroup);
        setNewMemberUsername('');
    };

    const updateMembers = async () => {
        const updatedGroup = await getGroupById(group.id);
        setGroup(updatedGroup);
        setMembers(updatedGroup.members); // Update the members list
        setNewMemberUsername('');
    };

    useEffect(() => {
        if (groupId) {
            getGroupById(groupId).then(group => {
                setGroup(group);
                setMembers(group.members);
                setLoading(false);
            });
        }
    }, [groupId]);

    useEffect(() => {
        const timer = setTimeout(() => {
            setMessage('');
            setError('');
        }, 5000); 
    
        return () => clearTimeout(timer); 
    }, [message, error]);

    if (loading || userLoading) {
        return <div>Loading...</div>;
    }


    return group && userData && (
        <div>
            <h2>{group.name}</h2>
            <p>Owner: {group.owner}</p>
            <div>
                <input
                    type="text"
                    placeholder="Enter member's username"
                    value={newMemberUsername}
                    onChange={(e) => setNewMemberUsername(e.target.value)}
                />
                <button onClick={addMember}>Add Member</button>
                <button onClick={removeMember}>Remove Member</button>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                {message && <p style={{ color: 'green' }}>{message}</p>}
            </div>

            <div>
            <h3>Members:</h3>
                {members.map(member => <p key={member}>{member}</p>)}
                
            </div>
            <AllChannels />
        </div>
    )
}
