import { get, set, ref, query, update, orderByChild, equalTo } from "firebase/database";
import { db, storage } from "../config/firebase-setup.js";
import { User } from "../types/types.js";
import { uploadBytes, getDownloadURL, ref as sRef } from "firebase/storage";

export const getUserByHandle = async (handle: string): Promise<User | null> => {
    const snapshot = await get(ref(db, `users/${handle}`));

    if (!snapshot.exists()) {
        return null;
    }

    const user = {
        handle,
        ...snapshot.val(),
        createdOn: new Date(snapshot.val().createdOn).toString(),
    };

    return user;
}

export const createUserHandle = (handle: string, uid: string, email: string, firstName: string, lastName: string, phoneNumber: string): Promise<void> => {
    return set(ref(db, `users/${handle}`),
        {
            handle, uid, email, firstName, lastName, phoneNumber, createdOn: new Date().valueOf()
        }
    );
}

export const getUserData = async (uid: string): Promise<User | null> => {
    const snapshot = await get(query(ref(db, `users`), orderByChild('uid'), equalTo(uid)));
    
    if (!snapshot.exists()) {
        return null;
    }

    const userData = snapshot.val()[Object.keys(snapshot.val())[0]];

    const user = {
        ...userData,
        createdOn: new Date(userData.createdOn).toString(),
    };

    return user;
}

export const updateUserDetails = async (username: string, userInfo: { [key: string]: unknown }): Promise<void> => {
    const userRef = ref(db, `users/${username}`);
    await update(userRef, userInfo);
}

export const uploadImage = async (userId: string, file: File): Promise<string | null> => {
    if (!file) {
        console.log("No file provided for upload.");
        return null;
    }

    const storageRef = sRef(storage, `users/${userId}/${file.name}`);
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);

    console.log(`Image uploaded successfully. Download URL: ${downloadURL}`);
    return downloadURL;
}

