import { get, ref, query, orderByChild, push, set, remove } from "firebase/database";
import { db } from "../config/firebase-setup";

//addGroupChannel function defined before addGroup!
export const addGroupChannel = async (groupId: string, owner: string, name: string, publicity: boolean) => {
 
    const channel = {
        name,
        createdOn: Date.now(),
        members: {"bot": `Welcome to ${name}! Be the first to write a message!`},
        publicity
    }

    channel.members[owner] = true;

    return push(ref(db, `groups/${groupId}/channels`), channel);

}

//general group functions

export const addGroup = async (owner: string, name: string) => {
 
    const group = {
        owner,
        name,
        createdOn: Date.now(),
        members: {},
        channels: {}
    }

    group.members[owner] = true;

    const newGroupRef = await push(ref(db, 'groups'), group);

    await addGroupChannel(newGroupRef.key, owner, 'General', true);

    return newGroupRef;
}

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

export const getGroupByName = async (name: string) => {

    const allGroups = await getAllGroups();
    const desiredGroup = allGroups.filter(group => group.name === name);
    
    return desiredGroup;
};

export const joinGroupById = async (groupId: string, userHandle: string) => {
    const userRef = ref(db, `groups/${groupId}/members/${userHandle}`);
    await set(userRef, true);
};

export const leaveGroupById = async (groupId: string, userHandle: string) => {
    const userRef = ref(db, `groups/${groupId}/members/${userHandle}`);
    await remove(userRef);
};

export const deleteGroupById = async (groupId: string) => {
    const groupRef = ref(db, `groups/${groupId}`);
    await remove(groupRef);
};


//group channel functions

export const getAllGroupChannels = async (groupId: string) => {
    const snapshot = await get(query(ref(db, `groups/${groupId}/channels`), orderByChild('createdOn')));

    if (!snapshot.exists()) {
        return [];
    }

    const allGroupChannels = snapshot.val();

    const channels = Object.keys(allGroupChannels).map((key => ({
        id: key,
        ...allGroupChannels[key],
        createdOn: new Date(allGroupChannels[key].createdOn),
        members: Object.keys(allGroupChannels[key].members)
        })))

    return channels;
}

export const getGroupChannelById = async (groupId: string, channelId: string) => {

    const snapshot = await get(ref(db, `groups/${groupId}/channels/${channelId}`));
    if (!snapshot.exists()) {
        return null;
    }

    const channel = {
        channelId,
        ...snapshot.val(),
        createdOn: new Date(snapshot.val().createdOn),
        members: Object.keys(snapshot.val().members)
    };

    return channel;
};

export const joinGroupChannel = async (groupId: string, userHandle: string, channelId: string) => {
    const userRef = ref(db, `groups/${groupId}/channels/${channelId}/members/${userHandle}`);
    await set(userRef, true);
};

export const leaveGroupChannel = async (groupId: string, userHandle: string, channelId: string) => {
    const userRef = ref(db, `groups/${groupId}/channels/${channelId}/members/${userHandle}`);
    await remove(userRef);
};

export const deleteGroupChannelById = async (groupId: string, channelId: string) => {
    const channelRef = ref(db, `groups/${groupId}/channels/${channelId}`);
    await remove(channelRef);
};

// group channel message functions

export const addGroupChannelMessage = async (groupId: string, channelId: string, userHandle: string, text: string) => {
    const textRef = ref(db, `groups/${groupId}/channels/${channelId}/messages/${userHandle}`);
    await set(textRef, text);
};