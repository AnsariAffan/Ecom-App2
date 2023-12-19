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
  query,
  where,
} from "firebase/firestore";

import { get, getDatabase, ref, set } from "firebase/database";
import {
  createUserWithEmailAndPassword,
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { useDispatch } from "react-redux";

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
  async (id) => {
    try {

      const docRef = doc(db, "userCartData", id)
      await deleteDoc(docRef)
      // console.log(itemId);
      // const auth = getAuth();
      // const user = auth.currentUser;

      // if (!user) {
      //   // User not authenticated, handle as needed
      //   throw new Error("User not authenticated");
      // }

      // const userCollection = collection(db, "userCartData");
      // deleteDoc(doc(db, "userCartData", itemId));

      // // Create a query to find documents with the specified itemId
      // const q = query(userCollection, where("product.itemId", "==", itemId));
     
      // const userSnapshot = await getDocs(q);


      // if (userSnapshot.empty) {
      //   // No matching documents found, handle as needed
      //   throw new Error("No documents found with the specified itemId");
      // }

      // // Loop through the documents and delete each one
      // const deletePromises = userSnapshot.docs.map(async (doc) => {
      //   console.log(deletePromises)
      //   await deleteDoc(userCollection,itemId);
      //   console.log(`Document with itemId ${itemId} successfully deleted!`);
      // });

      // // Wait for all delete operations to complete
      // await Promise.all(deletePromises);

      // return itemId; // Return the itemId to identify the deleted item
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

export const userWishList = createAsyncThunk("api/userWishList",async (id)=>{
  try {


    const myData = await axios.get(`https://fakestoreapi.com/products/${id}`);
    
    const userCollection = collection(db, "userWishList");
    const userSnapshot = await addDoc(userCollection, myData.data);
    const userList = userSnapshot.docs.map((doc) => doc.data());
    

    return userList;
  } catch (error) {
    console.log(error);
  }
})


export const getUserWishList = createAsyncThunk("api/getUserWishList",async ()=>{
  try {

    const userCollection = collection(db, "userWishList");
    const userSnapshot = await getDocs(userCollection);
    const userList = userSnapshot.docs.map((doc) => doc.data());

    return userList;
  } catch (error) {
    console.log(error);
  }
})



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
    myWishList:[],

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


    //user wishList
    builders.addCase(getUserWishList.pending, (state, action) => {
      state.loading = true;
    });
    builders.addCase(getUserWishList.fulfilled, (state, action) => {
      state.myWishList = action.payload;
      state.loading = false;
    });
    builders.addCase(getUserWishList.rejected, (state, action) => {
      // I repeated fulfilled
      state.error = action.payload;
      state.loading = false;
    });




  },
});

export default firebaseslice.reducer;
