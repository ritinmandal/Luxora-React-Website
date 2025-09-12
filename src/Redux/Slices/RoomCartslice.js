import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { supabase } from '../../Superbase/supabaseClient';
import toast from 'react-hot-toast';

export const addToCart = createAsyncThunk('cart/addToCart', async (product, thunkAPI) => {
  const { data: userData, error: authError } = await supabase.auth.getUser();

  if (authError || !userData?.user) {
    toast.error('Please log in to add items to your cart.');
    return thunkAPI.rejectWithValue('Not logged in');
  }

  const user = userData.user;

  const { data: existingRooms, error: fetchError } = await supabase
    .from('Cart')
    .select('id')
    .eq('user_id', user.id);

  if (fetchError) {
    toast.error('Failed to fetch cart.');
    return thunkAPI.rejectWithValue(fetchError.message);
  }

  if (existingRooms.length >= 5) {
    toast.error('You can only add up to 5 rooms to your cart.');
    return thunkAPI.rejectWithValue('Room limit reached');
  }

  const { error } = await supabase.from('Cart').insert({
    user_id: user.id,
    name: product.name,
    price: product.price,
    image_url: product.image_url,
    capacity: product.capacity || 2,
  });

  if (error) {
    toast.error('Failed to add to cart.');
    return thunkAPI.rejectWithValue(error.message);
  }

  toast.success('Room added to cart!', {
    style: { border: '1px solid #c2a15f', padding: '16px', color: '#4c4c4c' },
    iconTheme: { primary: '#c2a15f', secondary: '#ffffff' },
  });

  return product.id;
});

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    adding: {},
  },
  extraReducers: (builder) => {
    builder
      .addCase(addToCart.pending, (state, action) => {
        state.adding[action.meta.arg.id] = true;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.adding[action.payload] = false;
      })
      .addCase(addToCart.rejected, (state, action) => {
        if (action.meta?.arg?.id) state.adding[action.meta.arg.id] = false;
      });
  },
});

export default cartSlice.reducer;
