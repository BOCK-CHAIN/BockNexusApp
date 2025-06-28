import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Category, CategoriesState } from 'src/modules/categories/types/redux';

const initialState: CategoriesState = {
  data: [],
  loading: false,
  error: null,
};

const categoriesSlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {
    getCategoriesStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    getCategoriesSuccess: (state, action: PayloadAction<Category[]>) => {
      state.loading = false;
      state.data = action.payload;
      state.error = null;
    },
    getCategoriesFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const { getCategoriesStart, getCategoriesSuccess, getCategoriesFailure } = categoriesSlice.actions;
export default categoriesSlice.reducer;