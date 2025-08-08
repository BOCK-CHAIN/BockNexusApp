import React, { FC } from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import Splash from '@modules/onboard'
import Home from '@modules/home'
import { navigationRef } from './NavigationUtil'
import MainNavigator from './MainNavigator'
import Products from '@modules/products'
import Cart from '@modules/cart'
import ProductDetails from '@modules/products/atoms/productDetails'
import AddressChoosing from '@modules/cart/atoms/addressChoosing'
import PaymentPage from '@modules/cart/atoms/paymentPage'
import Wishlist from '@modules/wishlist'

const Stack = createNativeStackNavigator()

const Navigation: FC = () => {
    return (
        <NavigationContainer ref={navigationRef}>
            <Stack.Navigator
                screenOptions={{
                    headerShown: false
                }}
                initialRouteName='Splash'
            >
                <Stack.Screen name='Splash' component={Splash} />
                <Stack.Screen name='MainNavigator' component={MainNavigator} />
                <Stack.Screen name='Products' component={Products} />
                <Stack.Screen name='Cart' component={Cart} />
                <Stack.Screen name='ProductDetails' component={ProductDetails} />
                <Stack.Screen name='AddressChoosing' component={AddressChoosing} />
                <Stack.Screen name='PaymentPage' component={PaymentPage} />
                <Stack.Screen name="Wishlist" component={Wishlist} />

            </Stack.Navigator>
        </NavigationContainer>
    )
}

export default Navigation