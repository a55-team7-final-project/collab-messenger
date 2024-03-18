import { get, set, ref, push, query, update, orderByChild, equalTo } from "firebase/database";
import { db, storage } from "../config/firebase-setup.js";
import { User } from "../types/types.js";
import { uploadBytes, getDownloadURL, ref as sRef } from "firebase/storage";

export const getUserByHandle = async (handle: string): Promise<User | null> => {
    if (!handle) return null;
    
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

export const getAllUsers = async (): Promise<User[]> => {
    try {
        const snapshot = await get(ref(db, "users"));
        if (!snapshot.exists()) {
            return [];
        }
        const users: User[] = Object.keys(snapshot.val()).map((key) => ({
            id: key,
            ...snapshot.val()[key],
        }));
        return users;
    }
    catch (error) {
        console.error("Error fetching users:", error);
        throw error;
    }
};



export const updateUserDetails = async (username: string, userInfo: { [key: string]: unknown }): Promise<void> => {
    const userRef = ref(db, `users/${username}`);
    await update(userRef, userInfo);
}


export const uploadImage = async (userId, file) => {
    if (!file) return;
    const storageRef = sRef(storage, `users/${userId}/${file.name}`);
    const snapshot = await uploadBytes(storageRef, file);
    return getDownloadURL(snapshot.ref);
  };



export const saveProfilePictureUrl = async (handle: string, url: string): Promise<void> => {
    const userRef = ref(db, `users/${handle}`);
    await update(userRef, { profilePictureUrl: url });
};