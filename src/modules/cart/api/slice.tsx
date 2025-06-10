import { createSelector,createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "@store/store";

interface CartItem {
    id : string;
    name : string;
    price : number;
    quantity: number;
    totalPrice : number;

}

interface CartState {
    items: CartItem[];
}

const initialState: CartState= {
    items: [],
}

export const cartSlice = createSlice({
    name:'cart',
    initialState,
    reducers:{
        clearCart:(state)=>{
            state.items=[]
        },
        addItem:(state,action:PayloadAction<CartItem>)=>{
            const newItem = action.payload
            const existingItem = state.items.find(item=>item.id===newItem.id)
            if(existingItem){
                existingItem.quantity += 1
                existingItem.totalPrice += newItem.price * existingItem.quantity
            }else{
                state.items.push({
                    ...newItem,
                    quantity:1,
                    totalPrice: newItem.price
                })
            }
        },
        removeItem:(state,action:PayloadAction<CartItem>)=>{
            const newItem = action.payload;
            const existingItem = state.items.find(item=> item.id === newItem.id)
            if (existingItem){
                if(existingItem.quantity > 1){
                    existingItem.quantity -= 1;
                    existingItem.totalPrice -= existingItem.price
                }else{
                    state.items = state.items.filter(item=> item.id != newItem.id)
                }
            }
        }
    }
})

export const {addItem,removeItem,clearCart} = cartSlice.actions;
export const selectCartItems = (state: RootState) => state.cart.items;

export const selectItemCountById = (id: string) => 
    createSelector(selectCartItems, (items) => {
        const item = items.find((item: any) => item.id === id)
        return item ? item?.quantity : 0
    })

export const selectTotalItemsInCart = createSelector(selectCartItems,(items)=>{
    return items.reduce((total, item)=> total + item?.quantity, 0)
})

export const selectTotalCartPrice = createSelector(selectCartItems,(items)=>{
    return items?.reduce((total,item)=> total+ item.totalPrice, 0)
})
export default cartSlice.reducer;