import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Category, CategoriesState } from '../types/redux';

const initialState: CategoriesState = {
    data: [],
    loading: false,
    error: null,
};

export const categoriesSlice = createSlice({
    name: 'categories',
    initialState,
    reducers: {
        setLoading: (state) => {
            state.loading = true;
            state.error = null;
        },
        setData: (state, action: PayloadAction<Category[]>) => {
            state.loading = false;
            state.data = action.payload;
            state.error = null;
        },
        setError: (state, action: PayloadAction<string>) => {
            state.loading = false;
            state.error = action.payload;
        },
    },
});

export const { setData, setError, setLoading } = categoriesSlice.actions;
export default categoriesSlice.reducer;