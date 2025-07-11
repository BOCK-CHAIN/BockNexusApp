import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Account from '../index';
import EditProfile from '../EditProfile';
import Order from '../Orders';
import OrderDetails from '../orders/orderDetails'
import Addresses from '../Addresses'
import ViewWishlist from '../Wishlist'
import SettingsNavigator from './settingNavigator'

const Stack = createNativeStackNavigator();

const AccountNavigator = () => {
    return(
        <Stack.Navigator initialRouteName="Account Home">
            <Stack.Screen name = "Account Home" component = {Account} />
            <Stack.Screen name = "EditProfile" component = {EditProfile} options={{ title: 'Edit Profile' }} />
            <Stack.Screen name = "Orders" component = {Order} />
            <Stack.Screen name = "OrderDetails" component={OrderDetails} options={{ title: 'Order Details' }} />
            <Stack.Screen name = "Addresses" component={Addresses} options={{ title: 'Addresses' }} />
            <Stack.Screen name = "SettingsStack" component={SettingsNavigator} options={{ headerShown: false }}/>
            <Stack.Screen name = "Wishlist" component={ViewWishlist} options = {{ title: 'Wishlist' }} />
        </Stack.Navigator>
    );
};

export default AccountNavigator;