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

/* functions to be used to authenticate */


// import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

// const auth = getAuth();
// signInWithEmailAndPassword(auth, email, password)
//   .then((userCredential) => {
//     // Signed in 
//     const user = userCredential.user;
//     // ...
//   })
//   .catch((error) => {
//     const errorCode = error.code;
//     const errorMessage = error.message;
//   });


//   const auth = getAuth();
// signOut(auth).then(() => {
//   // Sign-out successful.
// }).catch((error) => {
//   // An error happened.
// });