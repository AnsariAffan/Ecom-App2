// store.js
import { configureStore } from '@reduxjs/toolkit'
import mySlice from './mySlice';

export const store = configureStore({
  reducer: {
    mySlice :mySlice
},
})

export default store;