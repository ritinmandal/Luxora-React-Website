import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { supabase } from '../../Superbase/supabaseClient';

export const fetchProducts = createAsyncThunk('products/fetch', async (_, thunkAPI) => {
  const { data, error } = await supabase.from('Products').select('*');
  if (error) return thunkAPI.rejectWithValue(error.message);
  return data;
});

const productsSlice = createSlice({
  name: 'products',
  initialState: {
    items: [],
    status: 'idle',
    error: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.items = action.payload;
        state.status = 'succeeded';
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export default productsSlice.reducer;
