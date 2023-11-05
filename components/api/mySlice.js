import AsyncStorage from "@react-native-async-storage/async-storage";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const getAllProducts = createAsyncThunk("api/getAllData", async () => {
  try {
    const myData = await axios.get("https://fakestoreapi.com/products");
    console.log(myData.data)
    return myData.data;
  } catch (error) {
    console.log(error);
  }
});


export const getProductsCategory = createAsyncThunk("api/getcategories", async () => {
  try {
    const myData = await axios.get("https://fakestoreapi.com/products/categories");
    console.log(myData.data)
    return myData.data;
  } catch (error) {
    console.log(error);
  }
});



export const getSingalProduct = createAsyncThunk("api/getSingalProduct", async (id) => {
  try {
    const myData = await axios.get(`https://fakestoreapi.com/products/${id}`);
    console.log(myData.data)
    return myData.data;
  } catch (error) {
    console.log(error);
  }
});


export const getProductCount = createAsyncThunk("api/getProductCount", async () => {
  try {
    const data = await AsyncStorage.getItem("userCart");
    const convertedData = JSON.parse(data);
    return  convertedData.length
  } catch (error) {
    console.log(error);
  }
});


export const getProductsFromLocalStorages = createAsyncThunk("api/getProductsFromLocalStorages", async () => {
  try {
    const data = await AsyncStorage.getItem("userCart");
    const convertedData = JSON.parse(data);
    return  convertedData
  } catch (error) {
    console.log(error);
  }
});



export const getPriceSum = createAsyncThunk("api/getgetPriceSum", async () => {
  try {
    const data = await AsyncStorage.getItem("userCart");
    const convertedData = JSON.parse(data);

      // create a variable for the sum and initialize it
  let sum = 0;
  
  // iterate over each item in the array
  for (let i = 0; i < convertedData.length; i++ ) {
    sum += convertedData[i].price;
  }
  return sum

    
  } catch (error) {
    console.log(error);
  }
});









export const mySlice =createSlice({
name : "productslice",

initialState:{

product:{},
products:[],
loading:false,
error:null,
category:[],
count:0,
priceCount:0,
userData:[]

},

extraReducers:{


//for getAllProducts
[getAllProducts.pending]:(state,action)=>{
    state.loading = true
},

[getAllProducts.fulfilled]:(state,{payload})=>{
    state.products=payload
    state.priceCount=payload.price
    state.loading = false
},

[getAllProducts.rejected]:(state,{payload})=>{
    state.loading=false
    state.error=payload
},



//for getProductsCategory
[getProductsCategory.pending]:(state,action)=>{
  state.loading = true
},

[getProductsCategory.fulfilled]:(state,{payload})=>{
  state.category=payload
  state.loading = false
},  

[getProductsCategory.rejected]:(state,{payload})=>{
  state.loading=false
  state.error=payload
},


//for getSingalProduct
[getSingalProduct.pending]:(state,action)=>{
  state.loading = true
},

[getSingalProduct.fulfilled]:(state,{payload})=>{
  state.product=payload
  state.loading = false
},  

[getSingalProduct.rejected]:(state,{payload})=>{
  state.loading=false
  state.error=payload
},

// getProductCount
[getProductCount.fulfilled]:(state,{payload})=>{
  state.count=payload
  state.loading = false
},  



//for getProductsFromLocalStorage
[getProductsFromLocalStorages.pending]:(state,action)=>{
  state.loading = true
},

[getProductsFromLocalStorages.fulfilled]:(state,{payload})=>{
  state.userData=payload
  state.loading = false
},  

[getProductsFromLocalStorages.rejected]:(state,{payload})=>{
  state.loading=false
  state.error=payload
},

[getPriceSum.fulfilled]:(state,{payload})=>{
  state.priceCount=payload
  state.error=payload
},


}

})



export default mySlice.reducer