import AsyncStorage from "@react-native-async-storage/async-storage";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { addDoc, collection, getDocs } from "firebase/firestore";
import { db } from "../../firebaseConfig";
import { getAuth } from "firebase/auth";

export const getAllProducts = createAsyncThunk("api/getAllData", async () => {
  try {
    const myData = await axios("https://fakestoreapi.com/products");
    // console.log(myData.data);
    return myData.data;
  } catch (error) {
    console.log(error);
  }
});

export const getProductsCategory = createAsyncThunk(
  "api/getcategories",
  async () => {
    try {
      const myData = await axios.get(
        "https://fakestoreapi.com/products/categories"
      );
      // console.log(myData.data);
      return myData.data;
    } catch (error) {
      console.log(error);
    }
  }
);

export const getSingalProduct = createAsyncThunk(
  "api/getSingalProduct",
  async (id) => {
    try {
      const myData = await axios.get(`https://fakestoreapi.com/products/${id}`);
      // console.log(myData.data);
      return myData.data;
    } catch (error) {
      console.log(error);
    }
  }
);

export const getProductCount = createAsyncThunk(
  "api/getProductCount",
  async () => {
    try {

      const userCollection = collection(db, "userCartData");
      const userSnapshot = await getDocs(userCollection);
      const userList = userSnapshot.docs.map((doc) => doc.data());
      return userList;
    } catch (error) {
      console.log(error);
    }
  }
);

export const getProductsFromLocalStorages = createAsyncThunk(
  "api/getProductsFromLocalStorages",
  async () => {
    try {
      const data = await AsyncStorage.getItem("userCart");
      const convertedData = JSON.parse(data);
      return convertedData;
    } catch (error) {
      console.log(error);
    }
  }
);

export const postUserDataToFireStore = createAsyncThunk(
  "api/postUserDataToFireStore",
  async (data) => {
    try {
      const userCollection = collection(db, "userDataBase");
      const userSnapshot = await addDoc(userCollection, data);
      const userList = userSnapshot.docs.map((doc) => doc.data());

      return userList;
    } catch (error) {
      console.log(error);
    }
  }
);

export const postUserCartDataToFireStore = createAsyncThunk(
  "api/postUserDataToFireStore",
  async (data) => {
    try {
      const userCollection = collection(db, "userCartData");
      const userSnapshot = addDoc(userCollection, data);
      const userList = userSnapshot.docs.map((doc) => doc.data());

      return userList;
    } catch (error) {
      console.log(error);
    }
  }
);

export const getPriceSum = createAsyncThunk("api/getgetPriceSum", async () => {
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

      // Calculate the sum of all product prices
      const totalPrice = userData.reduce((sum, item) => sum + item.product.price, 0);

      // You can log the total price or return it as needed
      console.log("Total Price:", totalPrice);

      return totalPrice;
  } catch (error) {
    console.log(error);
  }
});

export const mySlice = createSlice({
  name: "productslice",

  initialState: {
    product: {},
    products: [],
    loading: true,
    error: null,
    category: [],
    count: 0,
    priceCount: 0,
    userData: [],
  },

  extraReducers: (builders) => {
    // //for getAllProducts
    builders.addCase(getAllProducts.pending, (state, { payload }) => {
      state.loading = true;
    });
    builders.addCase(getAllProducts.fulfilled, (state, { payload }) => {
      state.products = payload;
      state.priceCount = payload.price;
      state.loading = false;
    });
    builders.addCase(getAllProducts.rejected, (state, { payload }) => {
      state.loading = false;
      state.error = payload;
    });

    //for getProductsCategory
    builders.addCase(getProductsCategory.pending, (state, { payload }) => {
      state.loading = true;
    });
    builders.addCase(getProductsCategory.fulfilled, (state, { payload }) => {
      state.category = payload;
      state.loading = false;
    });
    builders.addCase(getProductsCategory.rejected, (state, { payload }) => {
      // I repeated fulfilled
      state.loading = false;
      state.error = payload;
    });

    //for getSingalProduct
    builders.addCase(getSingalProduct.pending, (state, { payload }) => {
      state.loading = true;
    });
    builders.addCase(getSingalProduct.fulfilled, (state, { payload }) => {
      state.product = payload;
      state.loading = false;
    });
    builders.addCase(getSingalProduct.rejected, (state, { payload }) => {
      // I repeated fulfilled
      state.loading = false;
      state.error = payload;
    });

    //getProductCount
    builders.addCase(getProductCount.fulfilled, (state, { payload }) => {
      state.count = payload;
      state.loading = false;
    });

    //getProductsFromLocalStorage
    builders.addCase(
      getProductsFromLocalStorages.pending,
      (state, { payload }) => {
        state.loading = true;
      }
    );
    builders.addCase(
      getProductsFromLocalStorages.fulfilled,
      (state, { payload }) => {
        state.product = payload;
        state.loading = false;
      }
    );
    builders.addCase(
      getProductsFromLocalStorages.rejected,
      (state, { payload }) => {
        // I repeated fulfilled
        state.loading = false;
        state.error = payload;
      }
    );

    //getPriceSum
    builders.addCase(getPriceSum.fulfilled, (state, { payload }) => {
      state.priceCount = payload;
      state.loading = false;
    });
  },
});

export default mySlice.reducer;
