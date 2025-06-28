import { combineReducers } from "redux";
// import { combineReducers } from "@reduxjs/toolkit";
import homeReducer from "@modules/home/api/slice";
import categoriesReducer from "@modules/categories/api/slice";
import cartReducer from "@modules/cart/api/slice";
import authReducer from "@modules/account/api/slice";

export default combineReducers({
    home: homeReducer,
    categories: categoriesReducer,
    cart: cartReducer,
    auth: authReducer
})  