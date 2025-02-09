import { View, Text, StyleSheet, SafeAreaView } from 'react-native'
import React, { FC, useState } from 'react'
import Animated, { interpolate, useAnimatedStyle } from 'react-native-reanimated'
import { menuData } from '@utils/db'
import MenuItem from '../atoms/MenuItem'
import Icon from '@components/atoms/Icon'
import { Colors } from '@utils/Constants'
import { RFValue } from 'react-native-responsive-fontsize'

const MenuHeader: FC<{ scrollY: any }> = ({ scrollY }) => {

    const [focusedindex, setFocusedIndex] = useState(0)

    const opacityFadingStyles = useAnimatedStyle(() => {
        const opacity = interpolate(scrollY.value, [0, 80], [1, 0])
        return {
            opacity
        }
    })
    return (
        <Animated.View style={[styles.container, opacityFadingStyles]}>
            <SafeAreaView />
            <View style={styles.flexRow}>
                {menuData.map((item, index) => (
                    <MenuItem
                        key={index}
                        item={item}
                        isFocused={focusedindex === index}
                        onSelect={() => setFocusedIndex(index)}
                    />
                ))}
            </View>

            <View style={styles.addressContainer}>
                <Icon size={16} name='home' iconFamily='Ionicons' />
                <Text style={styles.homeText}>HOME</Text>
                <Text numberOfLines={1} style={styles.addressText}></Text>43 High Stack, Noida, San Andreas,C-560047 <Text/>
                <Icon size={16} name='chevron-forward-sharp' iconFamily='Ionicons' />
            </View>

        </Animated.View>
    )
}
const styles = StyleSheet.create({
    container: {
        padding: 10
    },
    flexRow: {
        flexDirection: 'row',
        justifyContent: "space-between",
        alignItems: 'center',
        marginVertical: 5
    },
    addressContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 5
    },
    homeText: {
        marginHorizontal: 5,
        fontWeight: 'bold',
        color: Colors.text,
        fontSize:RFValue(10)
    },
    addressText: {
        flex: 1,
        color: Colors.text,
        fontSize:RFValue(9)
    }
})

export default MenuHeader