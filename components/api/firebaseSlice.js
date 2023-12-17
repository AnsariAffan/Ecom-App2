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

export const getUserCartDataFromFireBase = createAsyncThunk(
  "api/getUserCartDataFromFireBase",
  async () => {
    try {
      const auth = getAuth();
      const user = auth.currentUser;

      if (!user) {
        // User not authenticated, handle as needed
        return rejectWithValue("User not authenticated");
      }

      const userCollection = collection(db, "userCartData");
      const userSnapshot = await getDocs(userCollection);
      const userList = userSnapshot.docs.map((doc) => doc.data());

      // Filter user list based on the user's email
      const userData = userList.filter((e) => e.email === user.email);
// console.log(userData)
      return userData;


    } catch (error) {
      console.log(error);
    }
  }
);


export const deleteItemFromFireStore = createAsyncThunk(
  "api/deleteItemFromFireStore",
  async (itemId) => {
    try {
      console.log(itemId);
      const auth = getAuth();
      const user = auth.currentUser;

      if (!user) {
        // User not authenticated, handle as needed
        throw new Error("User not authenticated");
      }

      const userCollection = collection(db, "userCartData");
      const userSnapshot = await getDocs(userCollection);
      const userList = userSnapshot.docs.map((doc) => doc.data());

      // Find the item in the user's cart based on itemId
      const itemToDelete = userList.find((item) => item.product.itemId === itemId);

      if (!itemToDelete) {
        // Item not found, handle as needed
        throw new Error("Item not found in the user's cart");
      }

      // Delete the item from Firestore
      const itemDocRef = doc(userCollection, itemToDelete.id);
      await deleteDoc(itemDocRef);

      return itemId; // Return the itemId to identify the deleted item in the Redux store
    } catch (error) {
      console.error("Error deleting item:", error);
      throw error; // Return a rejected promise with the error message
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
    } catch (error) {
      console.log(error);
    }
  }
);

export const userRagistrationIntoRealTimeStorage = createAsyncThunk(
  "api/userRagistrationIntoRealTimeStorage",
  (data) => {
    const writeUserData = (data) => {
      const db = getDatabase();
      set(ref(db, "users/" + 1), {
        email: data.email,
        password: data,
        password,
      });
    };
    writeUserData(data);
  }
);

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
    loading: false,
    LogginUser: [],
    userCarts: [],
    count: 0,
  },

  extraReducers: (builders) => {
    builders.addCase(getUserCartDataFromFireBase.pending, (state, action) => {
      state.loading = true;
    });
    builders.addCase(getUserCartDataFromFireBase.fulfilled, (state, action) => {
      state.userCarts = action.payload;
      state.count = action.payload.length;
      state.loading = false;
    });
    builders.addCase(getUserCartDataFromFireBase.rejected, (state, action) => {
      // I repeated fulfilled
      state.error = action.payload;
      state.loading = false;
    });
  },
});

export default firebaseslice.reducer;
