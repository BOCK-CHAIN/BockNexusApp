import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const ViewSettings = () => {
    const settings = ['Notification settings', 'Location settings', 'Legal & Compliance', 'Theme selection', 'Delete account']
    const navigation = useNavigation();

    return (

        <View>
            {settings.map((msg, index) => (
                <TouchableOpacity
                    key={index}
                    style={styles.options}
                    onPress={() =>
                        msg === 'Notification settings' ?
                        navigation.navigate('Notifications') :
                        msg === 'Location settings' ?
                        navigation.navigate('Location') :
                        msg === 'Legal & Compliance' ?
                        navigation.navigate('Legal') :
                        msg === 'Theme selection' ?
                        navigation.navigate('ThemeSelection') :
                        navigation.navigate('DeleteAccount')
                    }
                >
                    <Text style={styles.text}> {msg} </Text>
                    <Image
                        source={require('../../assets/images/arrow.png')}
                        style={{ height: 20, width: 20, marginRight: 20 }}
                    />
                </TouchableOpacity>
            ))}
        </View>
    )
};

const styles = StyleSheet.create({
    options: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        height: '13%',
        backgroundColor: 'white',
        borderBottomWidth: 1,
    },
    text: {
        fontSize: 20,
        paddingLeft: 10
    }
})
export default ViewSettings;