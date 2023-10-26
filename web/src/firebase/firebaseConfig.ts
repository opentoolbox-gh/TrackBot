import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_APIKEY,
  authDomain: import.meta.env.VITE_FIREBASE_APIDOMAIN,
  projectId: import.meta.env.APIPROJECTID,
  storageBucket: import.meta.env.APISTORAGE,
  messagingSenderId: import.meta.env.APIMESSAGINGID,
  appId: import.meta.env.APPID,
  measurementId: import.meta.env.MEASUREMENTID,
};
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export default app;

/* functions to be used to authenticate */


// import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

