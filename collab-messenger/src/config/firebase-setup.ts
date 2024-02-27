// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getStorage } from 'firebase/storage';

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCUWnOiasKPhrfsCjlSSlTK_L_6zmLwN9Q",
    authDomain: "telerik-collab-messenger.firebaseapp.com",
    projectId: "telerik-collab-messenger",
    storageBucket: "telerik-collab-messenger.appspot.com",
    messagingSenderId: "643116586876",
    appId: "1:643116586876:web:8366f1b046ff5477a276f9",
    databaseURL: "https://telerik-collab-messenger-default-rtdb.europe-west1.firebasedatabase.app/"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getDatabase(app);
export const storage = getStorage(app);