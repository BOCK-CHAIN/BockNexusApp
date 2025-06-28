import React, { FC } from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import Splash from '@modules/onboard'
import Home from '@modules/home'
import { navigationRef } from './NavigationUtil'
import MainNavigator from './MainNavigator'
import Products from '@modules/products'
import Cart from '@modules/cart'
import ProductDetail from '@modules/categories/ProductDetails'

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
                <Stack.Screen name='ProductDetail' component={ProductDetail} />
            </Stack.Navigator>
        </NavigationContainer>
    )
}

export default Navigation