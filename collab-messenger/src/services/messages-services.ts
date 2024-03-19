import {
    ref,
    push,
    get,
    set,
    update,
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

export const editMessage = async (chatID: string, messageID: string, newText: string) => {
    try {
        const messageRef = ref(db, `chats/${chatID}/${messageID}`);

        await update(messageRef, {
            text: newText,
            editedOn: Date.now(),
        });
        return true;
        
    } catch (error) {
        console.error("Error editing message:", error);
        return false;
    }
};
