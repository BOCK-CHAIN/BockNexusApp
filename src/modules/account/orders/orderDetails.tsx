import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { getRandomProduct } from '../api/productApi';
import { navigate } from '@navigation/NavigationUtil'
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useSelector } from 'react-redux'

const OrderDetails = ({ route }) => {
    const userId = useSelector((state) => state.auth.user?.id);
    const { order } = route.params;
    const date = new Date(order.deliveryDate).toLocaleDateString();
    const sellers = ['']
    const platformFee = 4.00;
    const [randomProducts, setRandomProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            try{
                const result = await getRandomProduct();
                setRandomProducts(result);
            }catch(err){
                console.error('Could not load suggestions: ', err);
            }finally{
                setIsLoading(false);
            }
        };

        load();
    }, []);

    const getStatusHeading = (status) => {
        switch (status.toLowerCase()){
            case 'order_placed':
                return '🟢 Order Placed';
            case 'shipping':
                return '📦 Shipped';
            case 'out_for_delivery':
                return '🚚 Out for Delivery';
            case 'delivered':
                return '✅ Delivered';
            case 'cancelled':
                return '❌ Cancelled';
            default:
                return '⏳ Processing';
        }
    };

    const getRatingReview = (status) => {
        switch(status.toLowerCase()){
            case 'cancelled':
                return '';
            case 'delivered':
                return 'Rate this product!'
            case 'out_for_delivery':
                return "You'll be able to rate this soon.";
            default:
                return "You'll be able to rate this once it's delivered."
        }
    }

    const totalCost = order.items.reduce((sum, item) => {
        return sum + item.quantity * item.product.price;
    }, 0);

    const finalPrice = totalCost + platformFee;

    return (
        <>
            <ScrollView style={styles.container}>
                <View style={styles.statusHeader}>
                    <Text style={styles.statusText} numberOfLines={1}> {getStatusHeading(order.status)} </Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionLabel}>ORDER ID:</Text>
                    <Text style={styles.sectionText}>{order.id}</Text>
                </View>

                <View style={[styles.section, { paddingBottom: 0 }]}>
                    <ScrollView nestedScrollEnabled={true} style={styles.scrollInner}>
                        {order.items.map((item) => {
                            const userReview = item.product.reviews.find(
                                (review) => review.userId === userId
                            );

                            return (
                                <View key={item.id} style={styles.productCard}>
                                    <Image
                                        source={{ uri: item.product.image_uri }}
                                        style={styles.productImage}
                                    />
                                    <View style={styles.productInfo}>
                                        <Text numberOfLines={2} ellipsizeMode="tail" style={styles.productName}>
                                            {item.product.name}
                                        </Text>
                                        {item.product.brand === null || item.product.brand === '' ? null : (
                                            <Text style={styles.subText}>Seller: {item.product.brand}</Text>
                                        )}
                                        <Text style={styles.subText}>Price: ${item.product.price}</Text>
                                        <Text style={styles.subText}>Quantity: {item.quantity}</Text>

                                        {userReview ? (
                                            <View style={styles.ratingContainer}>
                                                {[1, 2, 3, 4, 5].map((star) => (
                                                    <Icon
                                                        key={star}
                                                        name="star"
                                                        size={20}
                                                        color={star <= userReview.rating ? "#914294" : "lightgray"}
                                                    />
                                                ))}
                                            <TouchableOpacity
                                                onPress={() => navigate('Reviews', { item })}
                                            >
                                                <Text style={{
                                                        color: '#914294',
                                                        fontWeight: 700,
                                                        marginLeft: 5
                                                    }}
                                                >
                                                    Change Review
                                                </Text>
                                            </TouchableOpacity>
                                            </View>
                                        ) : order.status.toLowerCase() === 'delivered' ? (
                                            <TouchableOpacity onPress={() => navigate('Reviews', { item })}>
                                                <Text numberOfLines={1} style={[styles.ratingPrompt, { color: '#914294' }]}>
                                                    {getRatingReview(order.status)}
                                                </Text>
                                            </TouchableOpacity>
                                        ) : (
                                            <Text numberOfLines={1} style={[styles.ratingPrompt, { color: 'gray' }]}>
                                                {getRatingReview(order.status)}
                                            </Text>
                                        )}
                                    </View>
                                </View>
                            );
                        })}
                    </ScrollView>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Contact Details:</Text>
                    <Text style={styles.sectionText}>You will be contacted on {order.user.phone}.</Text>
                    <Text style={styles.sectionText}>It will be delivered to {order.Address.line1}.</Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.deliveryNote}>📍 Delivery tracking animation goes here</Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Price Details:</Text>
                    <View style={styles.row}>
                        <Text>Product(s) Price:</Text>
                        <Text>${totalCost.toFixed(2)}</Text>
                    </View>
                    <View style={styles.row}>
                        <Text>Platform Fee:</Text>
                        <Text>${platformFee.toFixed(2)}</Text>
                    </View>
                    <View style={[styles.row, styles.totalRow]}>
                        <Text style={styles.totalLabel}>Final Price:</Text>
                        <Text style={styles.totalLabel}>${finalPrice.toFixed(2)}</Text>
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Items you may be interested in:</Text>
                    {isLoading ? (
                        <View style={styles.loader}>
                            <ActivityIndicator size='large' color="#0000ff" />
                        </View>
                    ) : (
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalList}>
                            {randomProducts.map((product) => (
                                <View key={product.id} style={styles.suggestionCard}>
                                    <Image
                                        style={styles.suggestionImage}
                                        source={{ uri: product.image_uri }}
                                    />
                                    <Text numberOfLines={1} style={styles.suggestionText}>{product.name}</Text>
                                    <Text numberOfLines={1} style={styles.suggestionSub}>{product.description}</Text>
                                </View>
                            ))}
                        </ScrollView>
                    )}
                </View>
            </ScrollView>
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#f4f4f4',
        paddingVertical: 6,
    },
    statusHeader: {
        backgroundColor: '#fff',
        paddingVertical: 16,
        marginBottom: 8,
        borderBottomWidth: 1,
        borderColor: '#ccc',
    },
    statusText: {
        fontSize: 28,
        fontWeight: '600',
        textAlign: 'center',
    },
    section: {
        backgroundColor: '#fff',
        marginBottom: 10,
        padding: 12,
        borderRadius: 12,
        marginHorizontal: 8,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 6,
        elevation: 8,
    },
    sectionLabel: {
        fontWeight: 'bold',
        fontSize: 16,
        color: '#555',
    },
    sectionText: {
        fontSize: 15,
        marginTop: 4,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '600',
        marginBottom: 6,
    },
    deliveryNote: {
        fontSize: 16,
        fontStyle: 'italic',
        color: '#555',
    },
    scrollInner: {
        maxHeight: 350,
    },
    productCard: {
        flexDirection: 'row',
        marginBottom: 10,
        paddingBottom: 8,
        borderBottomWidth: 1,
        borderColor: '#eee',
    },
    productImage: {
        height: 110,
        width: 110,
        borderRadius: 8,
        marginRight: 10,
    },
    productInfo: {
        flex: 1,
        justifyContent: 'center',
    },
    productName: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 4,
    },
    subText: {
        fontSize: 14,
        color: '#555',
        marginBottom: 2,
    },
    ratingContainer: {
        flexDirection: 'row',
        marginTop: 6,
    },
    ratingPrompt: {
        marginTop: 6,
        fontWeight: '700',
        fontSize: 14,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: 4,
    },
    totalRow: {
        borderTopWidth: 1,
        borderTopColor: '#ccc',
        paddingTop: 6,
        marginTop: 8,
    },
    totalLabel: {
        fontSize: 16,
        fontWeight: '600',
    },
    loader: {
        paddingVertical: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    horizontalList: {
        paddingHorizontal: 6,
    },
    suggestionCard: {
        height: 190,
        width: 150,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        marginHorizontal: 5,
        padding: 6,
        backgroundColor: '#fafafa',
        alignItems: 'center',
    },
    suggestionImage: {
        width: 135,
        height: 140,
        borderRadius: 6,
        marginBottom: 4,
    },
    suggestionText: {
        fontSize: 13,
        fontWeight: '600',
    },
    suggestionSub: {
        fontSize: 11,
        color: '#555',
    },
});

export default OrderDetails;
