import { View, Text, Image, StyleSheet } from 'react-native'
import React, { FC, useEffect } from 'react'
import { screenHeight, screenWidth } from '@utils/Constants'
import { Colors } from 'react-native/Libraries/NewAppScreen'
import { resetAndNavigate } from '@navigation/NavigationUtil'

const Splash: FC = () => {

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            resetAndNavigate("MainNavigator");
        }, 1000)
        return () => clearTimeout(timeoutId)
    }, [])

    return (
        <View style={styles.container}>
            <Image
                source={require('@assets/images/logo_t.png')}
                style={styles.image}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.primary
    },
    image: {
        width: screenWidth * 0.35,
        height: screenHeight * 0.35,
        resizeMode: 'contain'
    }
})

export default Splash

