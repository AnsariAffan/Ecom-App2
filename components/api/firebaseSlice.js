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
import { hash, compare } from "bcryptjs";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { get, getDatabase, ref, set } from "firebase/database";

const auth = getAuth();

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
      return token;
    } else {
      console.warn("User data not found in the database");
      return null;
    }

    // return user; // Return the user object if needed
  } catch (error) {
    console.error("Error signing in:", error.message);
    throw error;
  }
});

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
  },
});

export default firebaseslice.reducer;
