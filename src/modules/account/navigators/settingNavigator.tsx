import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ViewSettings from '../Settings';
import DeleteAccount from '../settings/deleteAccount';
import Legal from '../settings/legal';
import Location from '../settings/location';
import Notifications from '../settings/notification';
import ThemeSelection from '../settings/themeSelection';

const Stack = createNativeStackNavigator();

const SettingsNavigator = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen name="SettingsHome" component={ViewSettings} options={{ title: 'Settings' }}/>
            <Stack.Screen name="DeleteAccount" component={DeleteAccount} options={{ title: 'Delete Account' }}/>
            <Stack.Screen name="Legal" component={Legal} options={{ title: 'Legal & Compliance' }}/>
            <Stack.Screen name="Location" component={Location} options={{ title: 'Location Settings' }}/>
            <Stack.Screen name="Notifications" component={Notifications} options={{ title: 'Notification Settings' }}/>
            <Stack.Screen name="ThemeSelection" component={ThemeSelection} options={{ title: 'Theme Selection' }}/>
        </Stack.Navigator>
    );
};

export default SettingsNavigator;