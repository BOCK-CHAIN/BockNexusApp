import React, { useState } from 'react'
import { View, Text, StyleSheet, Image, TouchableOpacity, Modal, Alert } from 'react-native'
import { useRoute } from '@react-navigation/native'
import { RFValue } from 'react-native-responsive-fontsize'
import { useSelector } from 'react-redux'
import { placeOrder } from '../api/api'
import FastImage from 'react-native-fast-image'
import Toast from 'react-native-toast-message';
import { useNavigation } from '@react-navigation/native'

const PaymentPage = () => {
    const token = useSelector((state) => state.auth.token)
    const userId = useSelector((state) => state.auth.user?.id)
    const { selectedAddress } = useRoute().params
    const [isVisible, setIsVisible] = useState(false)
    const [loading, setLoading] = useState(false)
    const navigation = useNavigation();

    const handleCOD = async () => {
        setLoading(true)
        try{
            await placeOrder({ userId, addressId: selectedAddress, paymentMode: "COD" });
            Toast.show({
                type: 'success',
                text1: 'Order placed successfully',
                position: 'bottom',
                visibilityTime: 3000,
            });
        }catch(err){
            console.log(err)
            Alert.alert('Failed to place order')
        }finally{
            navigation.navigate('MainNavigator', { screen: 'Home' })
            setLoading(false)
            setIsVisible(false)
        }
    }

    return (
        <>
            <View>
                <Text style={styles.title}> Payment Page </Text>
                <Text style={styles.subTitle}> Choose a mode of payment: </Text>
            </View>
            <View style={styles.paymentContainer}>
                <View style={styles.paymentMode}>
                    <Text style={styles.paymentTitle}>Cards</Text>
                </View>
            </View>
            <View style={styles.paymentContainer}>
                <View style={styles.paymentMode}>
                    <Text style={styles.paymentTitle}>Wallets</Text>
                </View>
            </View>
            <View style={styles.paymentContainer}>
                <View style={styles.paymentMode}>
                    <Text style={styles.paymentTitle}>UPI</Text>
                    <TouchableOpacity style={styles.individualOptions}>
                        <View style={{ borderWidth: 1, padding: 3, borderRadius: 5 }}>
                            <Image
                                source={require('../../../assets/images/PayTM.png')}
                                style={{ height: 28, width: 60 }}
                            />
                        </View>
                        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Text style={styles.paymentInfo}>Paytm UPI</Text>
                            <Image
                                source={require('../../../assets/images/arrow.png')}
                                style={{ height: 20, width: 20 }}
                            />
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.individualOptions}>
                        <View style={{ borderWidth: 1, padding: 3, borderRadius: 5 }}>
                            <Image
                                source={require('../../../assets/images/GPay.png')}
                                style={{ height: 28, width: 60 }}
                            />
                        </View>
                        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Text style={styles.paymentInfo}>Google Pay UPI</Text>
                            <Image
                                source={require('../../../assets/images/arrow.png')}
                                style={{ height: 20, width: 20 }}
                            />
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.individualOptions}>
                        <View style={{ borderWidth: 1, padding: 3, borderRadius: 5 }}>
                            <Image
                                source={require('../../../assets/images/AmazonPay.png')}
                                style={{ height: 28, width: 60 }}
                            />
                        </View>
                        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Text style={styles.paymentInfo}>Amazon Pay UPI</Text>
                            <Image
                                source={require('../../../assets/images/arrow.png')}
                                style={{ height: 20, width: 20 }}
                            />
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
            <View style={styles.paymentContainer}>
                <View style={styles.paymentMode}>
                    <Text style={styles.paymentTitle}>Net Banking</Text>
                </View>
            </View>
            <View style={styles.paymentContainer}>
                <View style={styles.paymentMode}>
                    <Text style={styles.paymentTitle}>Pay Later</Text>
                </View>
            </View>
            <View style={styles.paymentContainer}>
                <View style={styles.paymentMode}>
                    <Text style={styles.paymentTitle}>Cash On Delivery</Text>
                    <TouchableOpacity
                        style={styles.individualOptions}
                        onPress={() => setIsVisible(true)}
                    >
                        <Image
                            source={require('../../../assets/images/COD.png')}
                            style={{ height: 28, width: 28 }}
                        />
                        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Text style={styles.paymentInfo}>Pay when delivered</Text>
                            <Image
                                source={require('../../../assets/images/arrow.png')}
                                style={{ height: 20, width: 20 }}
                            />
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
            <Modal
                visible={isVisible}
                transparent
                animationType="fade"
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                        <Text style={styles.modalText}>Confirm Cash on Delivery?</Text>

                        <View style={styles.modalButtons}>
                            <TouchableOpacity onPress={() => setIsVisible(false)}>
                                <Text style={styles.cancel}>No</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={handleCOD}>
                                <Text style={styles.confirm}>Yes</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            <Modal
                visible={loading}
                animationType='slide'
            >
                <View style={styles.loadingOverlay}>
                    <FastImage
                        source={require('../../../assets/images/orderLoading.gif')}
                        style={{ height: 100, width: 100 }}
                    />
                    <Text style={styles.loadingText}> Being Placed... </Text>
                </View>
            </Modal>
        </>
    )
}

const styles = StyleSheet.create({
    title: {
        fontSize: RFValue(20),
        padding: 12,
        fontWeight: 500,
    },
    subTitle: {
        fontSize: RFValue(16),
        paddingHorizontal: 15,
        fontWeight: 400,
    },
    paymentMode: {
        padding: 10,
        borderRadius: 10,
        backgroundColor: 'white',
        borderWidth: 1,
        borderColor: '#914294',
        // Android shadow
        elevation: 6,
        // iOS shadow
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },
    paymentContainer: {
        marginTop: 12,
        paddingHorizontal: 15,
    },
    paymentTitle: {
        fontWeight: 600,
        fontSize: RFValue(17)
    },
    paymentInfo: {
        fontSize: RFValue(15)
    },
    individualOptions: {
        flexDirection: 'row',
        gap: 10,
        paddingVertical: 6,
        alignItems: 'center',
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.4)',
    },
    modalContainer: {
        width: '80%',
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 8,
        elevation: 5,
    },
    modalText: {
        fontSize: RFValue(16),
        fontWeight: '500',
        marginBottom: 20,
        textAlign: 'center'
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    cancel: {
        color: '#666',
        fontSize: RFValue(15),
        paddingHorizontal: 10
    },
    confirm: {
        color: '#d11a2a',
        fontSize: RFValue(15),
        fontWeight: 'bold',
        paddingHorizontal: 10
    },
    loadingOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        fontSize: RFValue(18),
        fontWeight: 700,
        marginTop: 10
    },
})

export default PaymentPage