import AsyncStorage from "@react-native-async-storage/async-storage";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { db } from "../../firebaseConfig";
import { addDoc, collection, getDocs } from "firebase/firestore";

export const getDataFromFireBase = createAsyncThunk("api/getDataFromFireBase", async () => {
  try {
    const userCollection = collection(db, 'userCollection');
    const userSnapshot = await getDocs(userCollection);
  
    const userList = userSnapshot.docs.map(doc => doc.data());
    console.log(userList)
    return userList;

  } catch (error) {
    console.log(error);
  }
});


export const setDataToFireBase = createAsyncThunk("api/setDataToFireBase", async (data) => {
    try {
      const userCollection = collection(db, 'userCollection');
      const userSnapshot = await addDoc(userCollection,data);
    
      const userList = userSnapshot.docs.map(doc => doc.data());
      console.log(userList)
      return userList;
  
    } catch (error) {
      console.log(error);
    }
  });
  




export const firebaseslice =createSlice({
name : "firebase",

initialState:{

userData:[],
error:null
},

extraReducers:{


//for getDataFromFireBase
[getDataFromFireBase.pending]:(state,action)=>{
    state.loading = true
},

[getDataFromFireBase.fulfilled]:(state,{payload})=>{
    state.userData=payload
    state.loading = false
},

[getDataFromFireBase.rejected]:(state,{payload})=>{
    state.loading=false
    state.error=payload
},




}

})



export default firebaseslice.reducer