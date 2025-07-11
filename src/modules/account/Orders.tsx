import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert, TouchableOpacity, ScrollView, TextInput, Image, ActivityIndicator } from 'react-native';
import { getUserOrders } from './api/orderApi'
import { useSelector } from 'react-redux'
import { useNavigation } from '@react-navigation/native';


const Order = () => {
    const navigation = useNavigation();
    const token = useSelector((state) => state.auth.token);
    const [orders, setOrders] = useState([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            try{
                setLoading(true);
                const data = await getUserOrders(token);
                setOrders(data);
            }catch(err){
                Alert.alert('Error', err.message);
            }finally{
                setLoading(false);
            }
        }

        fetchOrders();
    }, []);

    if (loading) {
        return (
            <View style={styles.loaderContainer}>
                <ActivityIndicator size="large" color="#000" />
            </View>
        );
    }

    return(
        <View style={{ flex: 1, backgroundColor: '#F5F5F5' }}>
            <View style={[styles.header, { marginBottom: 2 }]}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <TextInput
                        placeholder='🔍 Search for your order'
                        onChangeText={setSearch}
                        placeholderTextColor='black'
                        style={styles.searchBar}
                    />
                    <TouchableOpacity style={styles.filter}>
                        <Image
                            source={require('../../assets/images/filters.png')}
                            style = {{ width: 35, height: 35 }}
                        />
                        <Text style={{ fontSize: 19 }}> Filters </Text>
                    </TouchableOpacity>
                </View>
                <Text style={styles.heading}> Your Orders: </Text>
            </View>

            <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
            {orders.length === 0 ? (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{ fontSize: 20, fontWeight: 500 }}> You have no orders yet! </Text>
                </View>
            ) : (
                orders.map((order) => {
                    const dateObj = new Date(order.deliveryDate);
                    const day = dateObj.getDate();
                    const month = dateObj.toLocaleDateString('en-US', { month: 'long' });
                    const year = dateObj.getFullYear();
                    const weekday = dateObj.toLocaleDateString('en-US', { weekday: 'long' });

                    let bgColor;
                    let deliveryText;
                    switch (order.status) {
                        case 'CANCELLED':
                            bgColor = '#C0392B';
                            deliveryText = 'Order was cancelled.'
                            break;
                        default:
                            bgColor = 'white';
                            deliveryText = `Expected Delivery: ${weekday}, ${day} ${month} ${year}`
                    }

                    return (
                        <TouchableOpacity key={order.id} onPress={() => navigation.navigate('OrderDetails', { order })}>
                            <View style={[styles.box, { backgroundColor: bgColor }]}>
                                <Image
                                    source = {require('../../assets/images/dummy.png')}
                                    style={{ width: 50, height: 50, marginRight: 10, }}
                                />
                                <View style={{ flex: 1, }}>
                                    <Text style={styles.info}>
                                        {deliveryText}
                                    </Text>
                                    <Text numberOfLines={1} style={{ flexShrink: 1, fontSize: 15 }}>
                                        {order.items.map((item, idx) => (
                                            `${item.product.name}${idx < order.items.length - 1 ? ', ': ''}`
                                        )).join('')}
                                    </Text>
                                </View>
                                <Image
                                    source = {require('../../assets/images/arrow.png')}
                                    style={{ width: 12, height: 12, marginLeft: 10, marginTop: 18 }}
                                />
                            </View>
                        </TouchableOpacity>
                    );
                })
            )}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    heading: {
        marginLeft: 10,
        marginTop: 8,
        fontSize: 26,
        fontWeight: '700',
        fontFamily: 'Tinos-Bold',
        color: '#212121',
    },
    box: {
        flexDirection: 'row',
        padding: 16,
        borderWidth: 3,
        borderColor: '#ddd',
       // marginHorizontal: -12,
        /*elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 3,*/
    },
    info: {
        fontSize: 14,
        color: '#131313',
        marginBottom: 4,
        fontWeight: 500,
    },
    searchBar: {
       marginLeft: 12,
       marginTop: 12,
       borderWidth: 1,
       width: '65%',
       borderRadius: 5,
    },
    filter: {
        flex: 1,
        flexDirection: 'row',
        width: '25%',
        marginLeft: 15,
        marginTop: 12,
        marginRight: 12,
        justifyContent: 'center',
        alignItems: 'center'
    },
    loaderContainer: {
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#fff',
    },
    header: {
        borderBottomWidth: 2,
        borderColor: '#914294',
    }
});

export default Order;