import {
    ref,
    push,
    get,
    query,
    equalTo,
    orderByChild,
    update,
    set,
} from "firebase/database";
import { db } from "../config/firebase-setup";


// chat services for individual chats

//  function to create a new chat between two users
export const createChat = async (user1: string, user2: string) => {
    const users = [user1, user2].sort();
    try {
        const chatRef = ref(db, `chats/${users[0]}_${users[1]}`);
        const snapshot = await get(chatRef);

        if (!snapshot.exists()) {
            await set(chatRef, {});
        }
        return `${users[0]}_${users[1]}`;
    } catch (error) {
        console.error("Error creating chat:", error);
        return null;
    }
}

export const addIndividualMessage = async (chatID: string, userHandle: string, text: string) => {
    try {
        const chatRef = ref(db, `chats/${chatID}`);

        const message =  {
            userHandle,
            text,
            createdOn: Date.now(),
        };
    
        await push(chatRef, message);
        return true;
        
    } catch (error) {
        console.error("Error adding message:", error);
        return false;
    }
};





export const likePost = (handle, postId) => {
    const updateLikes = {};
    updateLikes[`/posts/${postId}/likedBy/${handle}`] = true;
    updateLikes[`/users/${handle}/likedPosts/${postId}`] = true;

    return update(ref(db), updateLikes);
};


export const dislikePost = (handle, postId) => {
    const updateLikes = {};
    updateLikes[`/posts/${postId}/likedBy/${handle}`] = null;
    updateLikes[`/users/${handle}/likedPosts/${postId}`] = null;

    return update(ref(db), updateLikes);
};

export const deleteMessage = async (postId) => {
    return set(ref(db, `posts/${postId}`), null);
  };