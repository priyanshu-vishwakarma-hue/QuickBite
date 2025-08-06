import { initializeApp } from "firebase/app";

import { getAuth, GoogleAuthProvider } from "firebase/auth";


const firebaseConfig = JSON.parse(import.meta.env.VITE_APIKEY);

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
    
const provider = new GoogleAuthProvider();

export { auth, provider };


