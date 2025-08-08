import Icon from "@components/atoms/Icon";
import React, { useState, useEffect, useCallback } from "react";
import { Text, View } from 'react-native'
import { useAppSelector } from '@store/reduxHook'
import { useFocusEffect } from '@react-navigation/native'
import cartEventEmitter from '../utils/events'
import { getUserCart } from '../modules/cart/api/api'

interface TabIconProps {
    focused: boolean;
    size: number;
    color: string;
}
export const HomeIcon: React.FC<TabIconProps> = ({ focused, size, color }) => {
    return (
        <Icon
            name={focused ? 'home' : 'home-outline'}
            size={size}
            iconFamily='Ionicons'
            color={color}
        />
    )
}
export const CategoriesIcon: React.FC<TabIconProps> = ({ focused, size, color }) => {
    return (
        <Icon
            name={focused ? 'grid' : 'grid-outline'}
            size={size}
            iconFamily='Ionicons'
            color={color}
        />
    )
}
export const AccountIcon: React.FC<TabIconProps> = ({ focused, size, color }) => {
    return (
        <Icon
            name={focused ? 'person' : 'person-outline'}
            size={size}
            iconFamily='Ionicons'
            color={color}
        />
    )
}
export const CartIcon: React.FC<TabIconProps> = ({ focused, size, color }) => {
    const token = useAppSelector(state => state.auth.token)
    const [cartItems, setCartItems] = useState<CartDisplayItem[]>([])
    const [total, setTotal] = useState(0)

    const fetchUserCart = async () => {
        try {
            const response = await getUserCart(token)
            const total = response.data.itemCount;
            console.log('Parsed cart data:', response)
            setTotal(total)
        } catch (error) {
            console.log('Failed to fetch cart:', error)
        }
    }

    useEffect(() => {
        fetchUserCart()

        const onCartUpdated = () => fetchUserCart()
        cartEventEmitter.on('cartUpdated', onCartUpdated)

        return () => {
            cartEventEmitter.off('cartUpdated', onCartUpdated)
        }
    }, [token])

    useFocusEffect(
      useCallback(() => {
        fetchUserCart();
      }, [token])
    );

    return (
        <View style={{ position: 'relative' }}>
            <Icon
                name={focused ? 'cart' : 'cart-outline'}
                size={size}
                iconFamily='MaterialCommunityIcons'
                color={color}
            />
            {!token || total === 0 ? null :
                <View
                    style={{
                    position: 'absolute',
                    top: -5,
                    right: -10,
                    minWidth: 18,
                    height: 18,
                    borderRadius: 9,
                    backgroundColor: 'red',
                    justifyContent: 'center',
                    alignItems: 'center',
                    zIndex: 1,
                    paddingHorizontal: 4,
                }}
                >
                    <Text style={{ color: 'white', fontSize: 12, fontWeight: 'bold' }}>{total}</Text>
                </View>
            }
        </View>
    )
}