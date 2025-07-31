import { View, Text, StyleSheet, TouchableOpacity, FlatList, Alert, Image, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import CustomSafeAreaView from '@components/atoms/CustomSafeAreaView'
import { RFValue } from 'react-native-responsive-fontsize'
import { useAppSelector } from '@store/reduxHook'
import { Colors } from '@utils/Constants'
import { navigate } from '@navigation/NavigationUtil'
import OrderItem from './atoms/OrderItem'
import PlaceOrderButton from './atoms/PlaceOrderButton'
import { getUserCart, clearCart } from './api/api'
import { useFocusEffect } from '@react-navigation/native'

interface Product {
    id: number,
    name: string,
    image_uri: string,
    price: number,
    ar_uri: string,
    description: string,
    categoryId: number,
    sizeType: string,
}

interface ProductSize {
    id: number,
    productId: number,
    size: number,
    stock: number,
    sortOrder: number
}

export interface CartItems {
    id: number,
    userId: number,
    productId: number,
    productSizeId?: number | null,
    quantity: number,
    size?: string | null,
    product: Product,
    productSize?: ProductSize | null
}

export interface CartResponse {
    success: boolean,
    data : {
        items: CartItems[],
        total: number,
        itemCount: number
    }
}

const Cart = () => {
    const { user, isAuthenticated, token } = useAppSelector(state => state.auth)
    const [cartItems, setCartItems] = useState<CartDisplayItem[]>([])
    const [loading, setLoading] = useState(false)
    const [total, setTotal] = useState(0)
    const [itemCount, setItemCount] = useState(0)
    const platformFee = 4

    const fetchUserCart = async () => {
        if (!isAuthenticated || !token) {
            setCartItems([]);
            return;
        }

        try {
            setLoading(true)
            const response = await getUserCart(token);
            const { items } = response.data;
            const total = response.data.total;
            const itemCount = response.data.itemCount;
            setTotal(total)
            setItemCount(itemCount)
            setCartItems(items);
        } catch (error) {
            console.log('Failed to fetch cart:', error)
            setCartItems([])
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchUserCart()
    }, [isAuthenticated, token])

    useFocusEffect(
        React.useCallback(() => {
            fetchUserCart();
        }, [isAuthenticated, token])
    );

    const renderItem = ({ item }: { item: CartDisplayItem }) => {
        return <OrderItem item={item} onUpdate={fetchUserCart} />;
    };

    const handleShopNow = () => {
        if (!isAuthenticated) {
            Alert.alert(
                'Login Required',
                'Please login to view your cart',
                [
                    { text: 'Cancel', style: 'cancel' },
                    { text: 'Login', onPress: () => navigate('Account') }
                ]
            )
            return
        }
        navigate('Categories')
    }

    const handleClearCart = async () => {
        if(!isAuthenticated || !token){
            Alert.alert('Must login before clearing cart!');
            return;
        }
        setLoading(true);
        try{
            const response = await clearCart(token);
            if(response.success){
                setCartItems([]);
            }
        }catch(error){
            console.log('Failed to clear your cart!', error);
        }finally{
            setLoading(false);
        }
    }

    return (
        <CustomSafeAreaView>
            <View style={styles.container}>
                <Text style={styles.heading}>My Cart</Text>
                {isAuthenticated && user ? (
                    <TouchableOpacity
                        style={styles.button}
                        onPress={handleClearCart}
                    >
                        <Image
                            source={require('../../assets/images/trashCan.png')}
                            style={{ width: 18, height: 18, tintColor: '#FF4444' }}
                        />
                        <Text style={[styles.subHeading, { color: '#FF4444' }]}>Clear cart</Text>
                    </TouchableOpacity>
                ) : null}
            </View>

            {!loading && (cartItems.length > 0 ? (
                <>
                    <View style={styles.cartHeaderContainer}>
                        <Text style={styles.cartItemContainer}>{itemCount} items in cart</Text>
                        <View style={styles.cartDivider} />
                    </View>
                    <View style={{ flex: 1, }}>
                        <FlatList
                            data={cartItems}
                            renderItem={renderItem}
                            keyExtractor={(item) => item.id }
                            contentContainerStyle={styles.listContainer}
                            ListFooterComponent={
                                <View style={{ padding: 15, paddingBottom: 100 }}>
                                    <Text style={styles.subHeading}> Price Breakdown: </Text>
                                    <View style={styles.breakdown}>
                                        <Text style={styles.breakdownText}>Total price ({itemCount} items):</Text>
                                        <Text style={styles.breakdownText}>{total}</Text>
                                    </View>
                                    <View style={styles.breakdown}>
                                        <Text style={styles.breakdownText}>Platform fee:</Text>
                                        <Text style={styles.breakdownText}>{platformFee}</Text>
                                    </View>
                                    <View style={[styles.cartDivider, { borderStyle: 'dashed' }]} />
                                    <View style={styles.breakdown}>
                                        <Text style={styles.breakdownText}>Final price</Text>
                                        <Text style={styles.breakdownText}>{platformFee+total}</Text>
                                    </View>
                                </View>
                            }
                        />
                    </View>
                </>
            ) : (
                <View style={styles.emptyContainer}>
                    <Image
                        source={require('../../assets/images/emptyCart.png')}
                        style={{ height: 110, width: 110 }}
                    />
                    <Text style={[styles.emptyText, { textAlign: 'center' }]}>
                        {isAuthenticated ? "Looks like you haven't \n added anything to your cart yet!" : 'Login to view your cart'}
                    </Text>
                    <TouchableOpacity style={styles.shopNowButton} onPress={handleShopNow}>
                        <Text style={styles.shopNowText}>
                            {isAuthenticated ? 'Shop Now' : 'Login & Shop'}
                        </Text>
                    </TouchableOpacity>
                </View>
            ))}

            {!loading && cartItems.length > 0 && isAuthenticated &&
                <PlaceOrderButton value={{ total, platformFee }}/>
            }

            {loading && (
                <View style={styles.loadingOverlay}>
                    <ActivityIndicator size="large" color={Colors.active} />
                </View>
            )}
        </CustomSafeAreaView>
    )
}

const styles = StyleSheet.create({
    number: {
        fontSize: 16,
        fontWeight: "500"
    },
    address: {
        fontSize: 16,
        color: "#666",
        marginTop: 3
    },
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 5,
        borderColor: '#F0F2F5',
        backgroundColor: '#fff',
    },
    heading: {
        fontSize: RFValue(18),
        fontWeight: '600',
        color: '#000'
    },
    subHeading: {
        fontSize: RFValue(16),
        fontWeight: '500',
        color: '#000'
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
    },
    emptyText: {
        fontSize: RFValue(14),
        color: '#666',
        marginBottom: 16,
    },
    shopNowButton: {
        backgroundColor: Colors.active,
        padding: 10
    },
    shopNowText: {
        fontSize: RFValue(12),
        color: '#fff',
        fontWeight: '500',
    },
    listContainer: {
        padding: 8,
        paddingBottom: 10
    },
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        paddingVertical: 6,
        paddingHorizontal: 12,
        backgroundColor: '#F3F4F6',
        borderRadius: 8,
        elevation: 5,
    },
    loadingOverlay: {
        flex: 1,
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(255, 255, 255, 0.7)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 9999,
    },
    cartItemContainer: {
        fontSize: RFValue(15),
        fontWeight: 500,
        color: '#333',
        marginBottom: 6,
    },
    cartDivider: {
        borderBottomWidth: 3,
        borderColor: '#E5E7EB'
    },
    cartHeaderContainer: {
        backgroundColor: '#fff',
        paddingVertical: 12,
        paddingHorizontal: 16,
    },
    breakdown: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 10
    },
    breakdownText: {
        fontSize: RFValue(15),
    }
})

export default Cart;
