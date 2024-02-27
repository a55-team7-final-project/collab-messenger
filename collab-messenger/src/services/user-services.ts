import { get, set, ref } from "firebase/database";
import { db } from "../config/firebase-setup.js";
import { User } from "../types/types.js";

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

export const createUserHandle = (handle: string, uid: string, email: string, firstName: string, lastName: string): Promise<void> => {
    return set(ref(db, `users/${handle}`),
        {
            handle, uid, email, firstName, lastName, createdOn: new Date().valueOf()
        }
    );
}