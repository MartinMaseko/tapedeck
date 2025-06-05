import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyBAkHpoQH4FupUYuZDAxHEZ8Rg28HXua9w",
    authDomain: "tape-deck-73bbe.firebaseapp.com",
    databaseURL: "https://tape-deck-73bbe-default-rtdb.firebaseio.com",
    projectId: "tape-deck-73bbe",
    storageBucket: "tape-deck-73bbe.firebasestorage.app",
    messagingSenderId: "462014345599",
    appId: "1:462014345599:web:c9f59850f0b41407be2a4a"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);