import { get, ref, query, orderByChild, push } from "firebase/database";
import { db } from "../config/firebase-setup";

export const addGroup = async (author: string, name: string, publicity: boolean) => {
 
    const group = {
        author,
        name,
        publicity,
        createdOn: Date.now(),
        members: {},
        channels: {}
    }

    group.members[author] = true;

    return push(ref(db, 'groups'), group);

}

//missing return type for now
export const getAllGroups = async () => {
    const snapshot = await get(query(ref(db, 'groups'), orderByChild('createdOn')));

    if (!snapshot.exists()) {
        return [];
    }

    const allGroups = snapshot.val();

    const groups = Object.keys(allGroups).map((key => ({
        id: key,
        ...allGroups[key],
        createdOn: new Date(allGroups[key].createdOn),
        channels: Object.keys(allGroups[key].channels),
        members: Object.keys(allGroups[key].members)
        })))

    return groups;
}

//missing return type for now
export const getGroupById = async (id: string) => {

    const snapshot = await get(ref(db, `groups/${id}`));
    if (!snapshot.exists()) {
        return null;
    }

    const group = {
        id,
        ...snapshot.val(),
        createdOn: new Date(snapshot.val().createdOn),
        channels: Object.keys(snapshot.val().channels),
        members: Object.keys(snapshot.val().members)
    };

    return group;
};