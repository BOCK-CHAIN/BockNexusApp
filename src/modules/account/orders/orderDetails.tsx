import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { getRandomProduct } from '../api/productApi';

const OrderDetails = ({ route }) => {
    const { order } = route.params;
    const date = new Date(order.deliveryDate).toLocaleDateString();
    const sellers = ['']
    const handlingFee = 2.00;
    const platformFee = 1.00;
    const processingFee = 3.00;
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

    const finalPrice = totalCost + handlingFee + platformFee + processingFee;

    return (
        <>
            <ScrollView>
                <View style={{ width: '100%', backgroundColor: '#ddd', height: 80, justifyContent: 'center', alignItems: 'center', marginBottom: 6}}>
                    <Text style={styles.heading} numberOfLines={1}> {getStatusHeading(order.status)} </Text>
                </View>
                <View style={{ width: '100%', backgroundColor: '#ddd', marginBottom: 6}}>
                    <Text style={{ marginLeft: 6, fontSize: 16 }}> ORDER ID: {order.id} </Text>
                </View>
                <View style={{ width: '100%', backgroundColor: '#ddd', maxHeight: 350}}>
                    <ScrollView nestedScrollEnabled={true}>
                        {order.items.map((item) => (
                            <View key={item.id}>
                                <View style={{ flexDirection: 'row', width: '100%', borderBottomWidth: 2, borderColor: 'white' }}>
                                    <View style={{ flex: 1, }}>
                                        <Text numberOfLines={2} ellipsizeMode="tail" style={{ marginLeft: 12, marginTop: 4, fontWeight: 600, fontSize: 22, marginBottom: 2}}>
                                            {item.product.name}
                                        </Text>
                                        <Text style={{ marginLeft: 8, marginTop: 2 }}> Seller: Lorem Ipsum Traders </Text>
                                        <Text style={{ marginLeft: 8 }} > Price: ${item.product.price} </Text>
                                        <Text style={{ marginLeft: 8 }} > Quantity: {item.quantity} </Text>
                                        <TouchableOpacity>
                                            <Text
                                                numberOfLines={1}
                                                style={{ marginLeft: 8, marginTop: 5, marginBottom: 6, fontWeight: 500, fontSize: 18, color: order.status.toLowerCase() === 'delivered' ? 'blue' : 'black' }} >
                                                {getRatingReview(order.status)}
                                            </Text>
                                        </TouchableOpacity>
                                    </View>
                                    <View style={{ justifyContent: 'center', alignItems: 'center', }}>
                                        <Image
                                            source = {{ uri: item.product.image_uri }}
                                            style = {{ height: 125, width: 125 }}
                                        />
                                    </View>
                                </View>
                            </View>
                        ))}
                    </ScrollView>
                </View>
                <View style={{ width: '100%', backgroundColor: '#ddd', marginBottom: 2, marginTop: 4}}>
                    <Text style={{ marginLeft: 6, fontSize: 22, fontWeight: 500 }}> Contact Details: </Text>
                    <Text style={{ marginLeft: 6, fontSize: 15 }}> You will be contacted on {order.user.phone}. </Text>
                    <Text style={{ marginLeft: 6, fontSize: 15 }}> It will be delivered to {order.Address.line1}. </Text>
                </View>


                <View style={{ width: '100%', backgroundColor: '#ddd', marginBottom: 2, marginTop: 4}}>
                    <Text style={{ fontSize: 30 }}> Area for Delivery animation </Text>
                </View>


                <View style={{ width: '100%', backgroundColor: '#ddd', marginBottom: 2, marginTop: 4}}>
                    <Text style={{ marginLeft: 6, fontSize: 22, fontWeight: 500 }}> Price Details: </Text>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: 6 }}>
                        <Text style={{ marginLeft: 6, fontSize: 15 }}> Product(s) Price: </Text>
                        <Text style={{ marginLeft: 6, fontSize: 15 }}> ${totalCost.toFixed(2)} </Text>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: 6 }}>
                        <Text style={{ marginLeft: 6, fontSize: 15 }}> Handling Fee: </Text>
                        <Text style={{ marginLeft: 6, fontSize: 15 }}> ${handlingFee.toFixed(2)} </Text>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: 6 }}>
                        <Text style={{ marginLeft: 6, fontSize: 15 }}> Platform Fee: </Text>
                        <Text style={{ marginLeft: 6, fontSize: 15 }}> ${platformFee.toFixed(2)} </Text>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: 6 }}>
                        <Text style={{ marginLeft: 6, fontSize: 15 }}> Payment Processing Fee: </Text>
                        <Text style={{ marginLeft: 6, fontSize: 15 }}> ${processingFee.toFixed(2)} </Text>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: 6, borderTopWidth: 1 }}>
                        <Text style={{ marginLeft: 6, fontSize: 16 }}> Final Price: </Text>
                        <Text style={{ marginLeft: 6, fontSize: 16 }}> ${finalPrice.toFixed(2)} </Text>
                    </View>
                </View>
                <View style={{ width: '100%', backgroundColor: '#ddd', marginBottom: 2, marginTop: 4}}>
                    <Text style={{ marginLeft: 6, fontSize: 22, fontWeight: 500 }}> Items you may be interested in: </Text>
                    {isLoading ? (
                        <View style={{ paddingVertical: 20, justifyContent: 'center', alignItems: 'center' }}>
                            <ActivityIndicator size='large' color="#0000ff" />
                        </View>
                    ) : (
                        <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={{ padding: 8 }}
                        >
                            {randomProducts.map((product, index) => (
                                <View key={product.id} style={{ height: 190, width: 150, borderWidth: 1, marginHorizontal: 3 }}>
                                    <View style={{ flex: 1, alignItems: 'center'}}>
                                        <Image
                                            style={{ width: 135, height: 140, marginTop: 5 }}
                                            source = {{ uri: product.image_uri }}
                                        />
                                        <Text numberOfLines={1}> {product.name} </Text>
                                        <Text numberOfLines={1}> {product.description} </Text>
                                    </View>
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
    heading: {
        textAlign: 'center',
        justifyContent: 'center',
        fontSize: 40,
        fontWeight: 500,
    },
});

export default OrderDetails;
