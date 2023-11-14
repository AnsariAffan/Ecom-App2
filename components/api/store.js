// store.js
import { configureStore } from '@reduxjs/toolkit'
import mySlice from './mySlice';
import firebaseSlice from './firebaseSlice';


export const store = configureStore({
  reducer: {
    mySlice :mySlice,
    firebaseslice:firebaseSlice
},
})

export default store;