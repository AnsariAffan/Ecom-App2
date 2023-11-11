import { initializeApp } from 'firebase/app';
import { collection, getDocs, getFirestore } from "firebase/firestore";
// TODO: Replace the following with your app's Firebase project configuration
const firebaseConfig = {
  apiKey: "AIzaSyDzz5qKWWK3WG-6jzNSsiZwTA2iLtG2PEY",
  authDomain: "apps-b71c4.firebaseapp.com",
  projectId: "apps-b71c4",
  storageBucket: "apps-b71c4.appspot.com",
  messagingSenderId: "909719521388",
  appId: "1:909719521388:web:b67e35becc765b7fef7049",
  measurementId: "G-6EGH7G9K9N"
};

 export const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);

// Get a list of cities from your database
async function getCities(db) {
  const citiesCol = collection(db, 'userCollection');
  const citySnapshot = await getDocs(citiesCol);

  const cityList = citySnapshot.docs.map(doc => doc.data());
  console.log(cityList)
  return cityList;
}

getCities(db)


export default getCities