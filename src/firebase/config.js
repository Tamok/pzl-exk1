import { initializeApp } from "firebase/app";
import { logEvent } from "../utils/logger";

const firebaseConfig = {
    apiKey: "AIzaSyBO74eBJJ864xdZwqum5wn9jBhIizpcpVo",
    authDomain: "pzl-exki.firebaseapp.com",
    projectId: "pzl-exki",
    storageBucket: "pzl-exki.firebasestorage.app",
    messagingSenderId: "612276808544",
    appId: "1:612276808544:web:cfc6f44f66529ca20f0c05",
    measurementId: "G-JZF622LNY1"
};

const app = initializeApp(firebaseConfig);
logEvent('Firebase', 'Firebase initialized');
export default app;
