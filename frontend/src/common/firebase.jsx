// import { initializeApp } from "firebase/app";
// import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";

// const firebaseConfig = {
//   apiKey: "AIzaSyDVW9covT-focs-1ChrgSYIp8cf-4GJ0Mk",
//   authDomain: "react-js-newsapp-website-adi.firebaseapp.com",
//   projectId: "react-js-newsapp-website-adi",
//   storageBucket: "react-js-newsapp-website-adi.appspot.com",
//   messagingSenderId: "1014905601950",
//   appId: "1:1014905601950:web:bad009b201a1ddba0ae08f",
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);

// //google auth
// const provider = new GoogleAuthProvider();

// const auth = getAuth();

// export const authWithGoogle = async () => {
//   let user = null;

//   await signInWithPopup(auth, provider)
//     .then((result) => {
//       user = result.user;
//     })
//     .catch((err) => {
//       console.log(err);
//     });

//   return user;
// };

import { initializeApp } from "firebase/app";
import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDVW9covT-focs-1ChrgSYIp8cf-4GJ0Mk",
  authDomain: "react-js-newsapp-website-adi.firebaseapp.com",
  projectId: "react-js-newsapp-website-adi",
  storageBucket: "react-js-newsapp-website-adi.appspot.com",
  messagingSenderId: "1014905601950",
  appId: "1:1014905601950:web:bad009b201a1ddba0ae08f",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

//google auth
const provider = new GoogleAuthProvider();

const auth = getAuth(app);

export const authWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    return result.user;
  } catch (err) {
    console.log(err);
    return null;
  }
};
