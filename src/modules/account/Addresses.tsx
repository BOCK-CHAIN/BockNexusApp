import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { getUserAddress } from './api/userApi';
import { useSelector } from 'react-redux'


const Addresses = () => {
    const token = useSelector((state) => state.auth.token);
    const userId = useSelector((state) => state.auth.user?.id);
    const [addresses, setAddresses] = useState([]);

    useEffect(() => {
        const fetchAddress = async () => {
            if (!token || !userId) return;
            const data = await getUserAddress(userId, token);
            setAddresses(data);
        }

        fetchAddress();
    }, [token, userId])

    return(
        <>
            <View>
                <Text style={ styles.heading }> Your addresses: </Text>
            </View>
            <View style={{ marginTop: 10 }}>
                <TouchableOpacity
                    style={{ flexDirection: 'row', borderWidth: 1, marginHorizontal: 15, borderRadius: 4, justifyContent: 'space-between', alignItems: 'center' }}
                >
                    <Text style={{ marginLeft: 15, fontSize: 18, paddingVertical: 8 }}> +     Add address </Text>
                    <Image
                        source ={require('../../assets/images/arrow.png')}
                        style={{ width: 20, height: 20, marginRight: 16 }}
                    />
                </TouchableOpacity>

                {addresses.map((address) => (
                    <Text> {address.id} </Text>
                ))}
            </View>
        </>
    )
}

const styles = StyleSheet.create({
    heading: {
        marginLeft: 10,
        marginTop: 10,
        fontSize: 26,
        fontWeight: '700',
        fontFamily: 'Tinos-Bold',
        color: '#212121',
    },
});

export default Addresses;