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
            try {
                setLoading(true);
                const data = await getUserOrders(token);
                setOrders(data);
            } catch (err) {
                Alert.alert('Error', err.message);
            } finally {
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

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={styles.searchFilterRow}>
                    <TextInput
                        placeholder='🔍 Search for your order'
                        onChangeText={setSearch}
                        placeholderTextColor='gray'
                        style={styles.searchBar}
                    />
                    <TouchableOpacity style={styles.filter}>
                        <Image
                            source={require('../../assets/images/filters.png')}
                            style={styles.filterIcon}
                        />
                        <Text style={styles.filterText}>Filters</Text>
                    </TouchableOpacity>
                </View>
                <Text style={styles.heading}>Your Orders:</Text>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                {orders.length === 0 ? (
                    <View style={styles.emptyState}>
                        <Text style={styles.emptyText}>You have no orders yet!</Text>
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
                                bgColor = '#ffe6e6';
                                deliveryText = 'Order was cancelled.';
                                break;
                            default:
                                bgColor = '#ffffff';
                                deliveryText = `Expected Delivery: ${weekday}, ${day} ${month} ${year}`;
                        }

                        return (
                            <TouchableOpacity key={order.id} onPress={() => navigation.navigate('OrderDetails', { order })}>
                                <View style={[styles.orderCard, { backgroundColor: bgColor }]}>
                                    <Image
                                        source={require('../../assets/images/dummy.png')}
                                        style={styles.orderImage}
                                    />
                                    <View style={styles.orderDetails}>
                                        <Text style={styles.deliveryText}>{deliveryText}</Text>
                                        <Text numberOfLines={1} style={styles.itemNames}>
                                            {order.items.map((item, idx) => (
                                                `${item.product.name}${idx < order.items.length - 1 ? ', ' : ''}`
                                            )).join('')}
                                        </Text>
                                    </View>
                                    <Image
                                        source={require('../../assets/images/arrow.png')}
                                        style={styles.arrowIcon}
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
    container: {
        flex: 1,
        backgroundColor: '#FAFAFA',
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
        paddingHorizontal: 12,
        paddingBottom: 10,
        paddingTop: 12,
        backgroundColor: '#fff',
    },
    searchFilterRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    searchBar: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        paddingHorizontal: 10,
        paddingVertical: 8,
        fontSize: 14,
        marginRight: 10,
        backgroundColor: '#fff',
    },
    filter: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f0e6f5',
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 8,
    },
    filterIcon: {
        width: 20,
        height: 20,
        marginRight: 6,
    },
    filterText: {
        fontSize: 15,
        fontWeight: '500',
        color: '#914294',
    },
    heading: {
        fontSize: 24,
        fontWeight: '700',
        color: '#212121',
        fontFamily: 'Tinos-Bold',
    },
    scrollContent: {
        paddingHorizontal: 12,
        paddingTop: 6,
        paddingBottom: 20,
    },
    emptyState: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 50,
    },
    emptyText: {
        fontSize: 18,
        fontWeight: '500',
        color: '#555',
    },
    orderCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 14,
        marginBottom: 12,
        borderRadius: 12,
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#e0d3ea',
    },
    orderImage: {
        width: 55,
        height: 55,
        marginRight: 12,
        borderRadius: 8,
    },
    orderDetails: {
        flex: 1,
    },
    deliveryText: {
        fontSize: 14,
        color: '#333',
        marginBottom: 4,
        fontWeight: '600',
    },
    itemNames: {
        fontSize: 14,
        color: '#555',
        flexShrink: 1,
    },
    arrowIcon: {
        width: 16,
        height: 16,
        marginLeft: 10,
        tintColor: '#555',
    },
});

export default Order;
