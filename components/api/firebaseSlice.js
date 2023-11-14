import AsyncStorage from "@react-native-async-storage/async-storage";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { db } from "../../firebaseConfig";
import { addDoc, collection, getDocs } from "firebase/firestore";

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
      const userCollection = collection(db, "userCollection");
      const readSnapshot = await getDocs(userCollection);
      const readuserList = readSnapshot.docs.map((doc) => doc.data());

      readuserList.forEach((dt) => {
        if (data.email == dt.email) {
          console.log("user is already ragistered");
          window.alert("user is already ragistered");
        } else {
          const userSnapshot = addDoc(userCollection, data);
          const userList = userSnapshot.docs.map((doc) => doc.data());

          console.log("user is ragistered successfully");
          window.alert("user is ragistered successfully");

          return userList;
        }
      });
    } catch (error) {
      console.log(error);
    }
  }
);

export const checkLogin = createAsyncThunk("api/checkLogin", async (data) => {
  try {
    const userCollection = collection(db, "userCollection");
    const userSnapshot = await getDocs(userCollection);
    const userList = userSnapshot.docs.map((doc) => doc.data());

    userList.forEach((dt) => {
      if (data.email == dt.email && data.password == dt.password) {
        console.log("user logged in successfully");
        window.alert("user logged in successfully");
      } else {
        console.log("incorrect credential");
        window.alert("incorrect credential");
      }
    });

    return userList;
  } catch (error) {
    console.log(error);
  }
});

export const firebaseslice = createSlice({
  name: "firebase",

  initialState: {
    userData: [],
    error: null,
  },

  extraReducers: (builders) => {

    builders.addCase(getDataFromFireBase.pending, (state, action) => {
      state.error = action.payload;
    });
    builders.addCase(getDataFromFireBase.fulfilled, (state, action) => {
      state.userData = action.payload;
    });
    builders.addCase(getDataFromFireBase.rejected, (state, action) => {
      // I repeated fulfilled
      state.error = action.payload;
    });
  },

  //for getDataFromFireBase
  // [getDataFromFireBase.pending]:(state,action)=>{
  //     state.loading = true
  // },

  // [getDataFromFireBase.fulfilled]:(state,{payload})=>{
  //     state.userData=payload
  //     state.loading = false
  // },

  // [getDataFromFireBase.rejected]:(state,{payload})=>{
  //     state.loading=false
  //     state.error=payload
  // },
});

export default firebaseslice.reducer;
