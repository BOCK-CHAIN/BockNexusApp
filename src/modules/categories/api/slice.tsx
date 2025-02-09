import { createSlice } from '@reduxjs/toolkit';

export const categoriesSlice = createSlice({
    name: "categories",
    initialState: {
        data: null,
        loading: false,
        error: null
    },
    reducers: {
        setLoading: (state) => {
            state.loading = true
        },
        setData: (state, action) => {
            state.loading = false;
            state.data = action.payload;
            state.error = null
        },
        setError: (state, action) => {
            state.loading = false
            state.error = action.payload
        },
    }
})

export const { setData, setError, setLoading } = categoriesSlice.actions
export default categoriesSlice.reducer