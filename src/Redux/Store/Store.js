import { configureStore } from '@reduxjs/toolkit';
import productsReducer from '../Slices/Productslice';
import cartReducer from '../Slices/RoomCartslice';

export const store = configureStore({
  reducer: {
    products: productsReducer,
    cart: cartReducer,
  },
});
