import React, { FC } from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import Splash from '@modules/onboard'
import Home from '@modules/home'
import { navigationRef } from './NavigationUtil'
import MainNavigator from './MainNavigator'
import Products from '@modules/products'

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
            </Stack.Navigator>

        </NavigationContainer>
    )
}

export default Navigation