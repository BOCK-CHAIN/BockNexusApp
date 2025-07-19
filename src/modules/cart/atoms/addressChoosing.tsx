import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity, Image } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize'
import { getUserAddress } from '@modules/account/api/addressApi';
import { useSelector } from 'react-redux';

const AddressChoosing = () => {
    const token = useSelector((state) => state.auth.token);
    const userId = useSelector((state) => state.auth.user?.id);
    const [addresses, setAddresses] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedAddress, setSelectedAddress] = useState(null);

    const fetchAddress = async () => {
        setLoading(true);
        try{
            if (!token || !userId) return;
            const data = await getUserAddress(userId, token);
            setAddresses(data);
        }catch(err){
            console.error('Failed to fetch orders: ', err);
        }finally{
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchAddress();
    }, [token, userId])

    useEffect(() => {
      const defaultAddress = addresses.find(addr => addr.isDefault);
      if (defaultAddress) {
        setSelectedAddress(defaultAddress.id);
      }
    }, [addresses]);

    return (
        <>
            <View>
                <Text style={styles.title}> Choose an address: </Text>
                <Text style={styles.subTitle}> All addresses: </Text>
            </View>
            <View>
                {addresses.map((address) =>  (
                    <TouchableOpacity
                        key={address.id}
                        style={styles.defaultContainer}
                        onPress={() => setSelectedAddress(address.id)}
                    >
                        <View style={[styles.boxContent, selectedAddress === address.id  && styles.selectedBox]}>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                {address.isDefault && (
                                    <Image
                                        source = {require('../../../assets/images/defaultAddress.png')}
                                        style={{ width: 25, height: 25 }}
                                    />
                                )}
                                <Text style={{ fontSize: 22, fontWeight: 400 }}> {address.nickname} </Text>
                                <Image
                                    source = {
                                        address.type === 'Home'
                                        ? require('../../../assets/images/home.png')
                                        : address.type === 'Office'
                                        ? require('../../../assets/images/office.png')
                                        : require('../../../assets/images/location.png')
                                    }
                                    style={{ width: 25, height: 25 }}
                                />
                            </View>
                            <View style={{ marginTop: 10 }}>
                                <Text style={[styles.info, { fontSize:18 }]}> {address.receiverName} </Text>
                                <Text style={styles.info}> {address.line1}, </Text>
                                {address.line2 && (
                                    <Text style={styles.info}> {address.line2}, </Text>
                                )}
                                <Text style={styles.info}> {address.city}, {address.state} </Text>
                                <Text style={styles.info}> {address.zip} </Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                ))}
            </View>
            {loading && (
                <View style={styles.loaderContainer}>
                    <ActivityIndicator size="large" color="#000" />
                </View>
            )}
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
    defaultContainer: {
        backgroundColor: '#fff',
        borderRadius: 10,
        marginHorizontal: 12,
        marginTop: 10,
        // Android shadow
        elevation: 5,
        // iOS shadow
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },
    loaderContainer: {
        flex: 1,
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(255, 255, 255, 0.7)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 9999,
    },
    boxContent: {
        padding: 10,
        borderRadius: 10,
        overflow: 'hidden',
    },
    info: {
        fontSize: 16,
    },
    selectedBox: {
        borderColor: 'blue',
        borderWidth: 2,
        backgroundColor: '#e6f0ff'
    }
})

export default AddressChoosing;