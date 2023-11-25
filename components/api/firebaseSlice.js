import AsyncStorage from "@react-native-async-storage/async-storage";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { app, db } from "../../firebaseConfig";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
} from "firebase/firestore";

import { get, getDatabase, ref, set } from "firebase/database";
import { createUserWithEmailAndPassword, getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut } from "firebase/auth";



export const getDataFromFireBase = createAsyncThunk(
  "api/getDataFromFireBase",
  async () => {
    try {
      const userCollection = collection(db, "userCollection");
      const userSnapshot = await getDocs(userCollection);
      const userList = userSnapshot.docs.map((doc) => doc.data());
      console.log(userList);
      return userList;
    } catch (error) {
      console.log(error);
    }
  }
);

export const setDataToFireBase = createAsyncThunk(
  "api/setDataToFireBase",
  async (data) => {
    try {
      createUserWithEmailAndPassword(auth, data.email, data.password)
        .then(async (userCredential) => {
          // User successfully created
          const user = userCredential.user;
          
          // Store additional user details in the database
          try {
            await writeUserData(user, data);
            console.log("User created:", user);
            window.alert("User logged in successfully")
          } catch (error) {
            console.error("Error writing user data:", error.message);
     
          }
        })
        .catch((error) => {
          // Handle errors
         
          console.error("Error creating user:", error.message);
        });

      async function writeUserData(user, data) {
        try {
          const db = getDatabase();
          const databaseRef = ref(db, user.uid);
          await set(databaseRef, data);
          console.log("Data written successfully");
        } catch (error) {
          console.error("Error writing user data:", error.message);
          throw error; // Rethrow the error to be caught by the calling function
        }
      }
    } catch (error) {
      console.log(error);
    }
  }
);

export const checkLogin = createAsyncThunk("api/checkLogin", async (data) => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      data.email,
      data.password
    );

    const user = userCredential.user;
    console.log("User signed in:", user);

    const db = getDatabase();
    const userRef = ref(db, user.uid);
    const snapshot = await get(userRef);

    if (snapshot.exists()) {
      console.log(snapshot.val());
      const token = snapshot.val();
      window.alert("logged in successfully")
      return token;
    } else {
     
      console.warn("User data not found in the database");

      return null;
    }

  

    // return user; // Return the user object if needed
  } catch (error) {
    window.alert("incorrect credential")
    console.error("Error signing in:", error.message);
    throw error;
  }
});

export const userRagistration = createAsyncThunk("api/userRagistration", async (data)=>{

try {
  const auth = getAuth();
createUserWithEmailAndPassword(auth, data.email, data.password)
  .then((userCredential) => {
    // Signed up 
    const user = userCredential.user;
    console.log(user)
    window.alert("user ragistered successfully")
    // ...
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    console.log(errorCode)
    console.log(errorMessage)
    window.alert(errorMessage.slice(9,50))
    // ..
  });
} catch (error) {
  console.log(error)
}

})

export const userLogin = createAsyncThunk("api/userLogin", async (data)=>{
  const auth = getAuth();
  signInWithEmailAndPassword(auth, data.email, data.password)
    .then((userCredential) => {
      // Signed in 
      const user = userCredential.user;
      console.log(user)
      window.alert("user logged in successfully")
      return user
      // ...
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      window.alert(errorMessage.slice(22,50))
      return errorMessage
    });
  
  })

export const userSignout = createAsyncThunk("api/userSignout", async ()=>{

  try {
    const auth = getAuth();
    signOut(auth).then(() => {
      // Sign-out successful.
      console.log("Sign-out successful")
     console.log(auth)
    }).catch((error) => {
      // An error happened.
    });
  } catch (error) {
    console.log(error)
  }
 
    
    })

export const firebaseslice = createSlice({
  name: "firebase",

  initialState: {
    userData: [],
    error: null,
    token: null,
    loading: false,
    LogginUser: [],
  },

  extraReducers: (builders) => {
    builders.addCase(getDataFromFireBase.pending, (state, action) => {
      state.loading = true;
    });
    builders.addCase(getDataFromFireBase.fulfilled, (state, action) => {
      state.userData = action.payload;
      state.loading = false;
    });
    builders.addCase(getDataFromFireBase.rejected, (state, action) => {
      // I repeated fulfilled
      state.error = action.payload;
      state.loading = false;
    });

    //checkLogin
    builders.addCase(checkLogin.pending, (state, action) => {
      state.loading = true;
    });
    builders.addCase(checkLogin.fulfilled, (state, action) => {
      state.token = action.payload;
      // console.log(state.token)
      state.loading = false;
    });
    builders.addCase(checkLogin.rejected, (state, action) => {
      // I repeated fulfilled
      state.error = action.payload;
      state.loading = false;
    });


    builders.addCase(userLogin.pending, (state, action) => {
      state.loading = true;
    });
    builders.addCase(userLogin.fulfilled, (state, action) => {
      state.token = action.payload;
      // console.log(state.token)
      state.loading = false;
    });
    builders.addCase(userLogin.rejected, (state, action) => {
      // I repeated fulfilled
      state.error = action.payload;
      state.loading = false;
    });


  },
});

export default firebaseslice.reducer;
