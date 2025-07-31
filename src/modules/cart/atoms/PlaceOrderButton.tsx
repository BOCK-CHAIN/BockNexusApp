import {View, Text, StyleSheet, Platform, TouchableOpacity, ActivityIndicator} from 'react-native'
import React, { useState } from 'react'
import { RFValue } from 'react-native-responsive-fontsize'
import { useAppSelector } from '@store/reduxHook'
import { navigate } from '@navigation/NavigationUtil'

const PlaceOrderButton = ({ value }) => {
    const [isVisible, setIsVisible] = useState(false)
    const [loading, setLoading] = useState(false)
    const platformFee = 4;

    return (
        <>
            <View style={styles.container}>
                <View>
                    <Text style={styles.strikePrice}>₹{value.total + 1200 + platformFee} </Text>
                    <Text style={styles.price}>₹{value.total + platformFee}
                    </Text>
                </View>

                <TouchableOpacity
                    disabled={loading}
                    style={styles.button}
                    onPress={() => navigate('AddressChoosing')}
                >
                    {loading? <ActivityIndicator color='black' size='small' /> :
                        <Text style={styles.btnText}> Place Order </Text>
                    }
                </TouchableOpacity>
            </View>
        </>
    )
}

const styles = StyleSheet.create({
    strikePrice: {
        fontSize: RFValue(12),
        color: "#888",
        textDecorationLine: 'line-through',
        marginLeft: 5,
    },
    price: {
        fontSize: RFValue(18),
        color: '#000',
        fontWeight: '600',
        marginBottom: 5,
        marginLeft: 5,
    },
    button: {
        backgroundColor: '#914294',
        padding: 10,
        borderRadius: 6,
        width: 150,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20
    },
    btnText: {
        color: '#222',
        fontWeight: "600",
        fontSize: RFValue(13)
    },
    container: {
        position: 'absolute',
        bottom: 0,
        borderTopWidth: 2,
        borderColor: "#F0F2F5",
        width: '100%',
        padding: 15,
        paddingBottom: Platform.OS === 'ios' ? 30 : 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#fff',
        zIndex: 999
    }
})

export default PlaceOrderButton 