import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, getAuth, UserCredential, fetchSignInMethodsForEmail } from "firebase/auth";
import { auth } from "../config/firebase-setup.js";

export const registerUser = async (email: string, password: string): Promise<UserCredential> => {
    const auth = getAuth();
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        return userCredential;
    } catch (error) {
        console.error("Error registering user: ", error);
        throw error;
    }
};


export const loginUser = async (email: string, password: string): Promise<UserCredential> => {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential;
};


export const logoutUser = async () => {
    try {
        const response = await signOut(auth);
        return response;
    } catch (error) {
        return error;
    }
}

export const validateEmail = (email: string): boolean => {
    const characters = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return characters.test(email.toLowerCase());
}

export const validatePassword = (password: string): boolean => {
    return password.length >= 5;
}

export const emailExist = async (email: string): Promise<boolean> => {
    try {
        const response = await fetchSignInMethodsForEmail(auth, email);
        return response.length > 0;
    } catch (error) {
        console.error("Error checking email: ", error);
        throw error;
    }
}