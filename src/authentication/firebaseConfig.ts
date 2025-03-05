import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyABfs4p6-X_ByhcCdjX2S_Qg2tQBZ-L73s",
    authDomain: "kluub-69a07.firebaseapp.com",
    projectId: "kluub-69a07",
    storageBucket: "kluub-69a07.firebasestorage.app",
    messagingSenderId: "447250987477",
    appId: "1:447250987477:web:8c3dea55d6e46ce20a255c"
};


const app = initializeApp(firebaseConfig);

export const firebaseAuth = getAuth(app);