import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut} from "firebase/auth";
import { auth } from "../config/firebase-setup.js";

export const registerUser = async (email: string, password: string) => {
    try {
        return  createUserWithEmailAndPassword(auth, email, password);
    } catch (error) {
        return error;
    }
};

export const loginUser = async (email: string, password: string) => {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        return userCredential;
    } catch (error) {
        return error;
    }
};

export const logoutUser = async () => {
    try {
        const response = await signOut(auth);
        return response;
    } catch (error) {
        return error;
    }
}