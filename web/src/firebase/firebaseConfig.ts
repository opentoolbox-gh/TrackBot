import { initializeApp } from "firebase/app";
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
