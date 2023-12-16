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
import {
  createUserWithEmailAndPassword,
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";

export const getDataFromFireBase = createAsyncThunk(
  "api/getDataFromFireBase",
  async () => {
    try {
      const userCollection = collection(db, "userCollection");
      const userSnapshot = await getDocs(userCollection);
      const userList = userSnapshot.docs.map((doc) => doc.data());
      // console.log(userList);
      return userList;
    } catch (error) {
      console.log(error);
    }
  }
);

export const userRagistration = createAsyncThunk(
  "api/userRagistration",
  async (data) => {
    try {
      const auth = getAuth();
      createUserWithEmailAndPassword(auth, data.email, data.password)
        .then((userCredential) => {
          // Signed up
          const user = userCredential.user;
          console.log(user);
          window.alert("user ragistered successfully");

          
         
          // ...
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          // console.log(errorCode);
          // console.log(errorMessage);
          window.alert(errorMessage.slice(9, 50));
        });

// function writeUserData(userId, name, email, imageUrl) {
//   const db = getDatabase();
//   set(ref(db, 'users/' + userId), {
//     username: name,
//     email: email,
//     profile_picture : imageUrl
//   });
// }

    } catch (error) {
      console.log(error);
    }
  }
);

export const userRagistrationIntoRealTimeStorage = createAsyncThunk("api/userRagistrationIntoRealTimeStorage",(data)=>{
    const db = getDatabase();
    set(ref(db, 'Users/' + data.userId), {
      username: data.name,
      email: data.email,
      password : data.password
    });
  }
)

export const userLogin = createAsyncThunk("api/userLogin", async (data) => {
  const auth = getAuth();
  signInWithEmailAndPassword(auth, data.email, data.password)
    .then((userCredential) => {
      // Signed in
      const user = userCredential.user;

      // console.log(user);
      window.alert("user logged in successfully");
 
      return user;
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      window.alert(errorMessage.slice(22, 50));
      return errorMessage;
    });
});

export const userSignout = createAsyncThunk("api/userSignout", async (auth) => {
  try {
    const auth = getAuth();
    signOut(auth)
      .then(() => {
        // Sign-out successful.
        // console.log("Sign-out successful");
        // console.log(auth);
        window.alert("Sign-out successful");
      
      })
      .catch((error) => {
        // An error happened.
      });
  } catch (error) {
    console.log(error);
  }
});


    




export const firebaseslice = createSlice({
  name: "firebase",

  initialState: {
    userData: [],
    error: null,
    token: [],
    loading: true,
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


    

  },
});

export default firebaseslice.reducer;
