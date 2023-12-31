import { initializeApp } from "firebase/app";
import { collection, getDocs, getFirestore } from "firebase/firestore";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
// TODO: Replace the following with your app's Firebase project configuration
const firebaseConfig = {
  apiKey: "AIzaSyDzz5qKWWK3WG-6jzNSsiZwTA2iLtG2PEY",
  authDomain: "apps-b71c4.firebaseapp.com",
  projectId: "apps-b71c4",
  storageBucket: "apps-b71c4.appspot.com",
  messagingSenderId: "909719521388",
  appId: "1:909719521388:web:b67e35becc765b7fef7049",
  measurementId: "G-6EGH7G9K9N",
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app)

