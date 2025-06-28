import { View, Text, StyleSheet, TouchableOpacity, FlatList, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import CustomSafeAreaView from '@components/atoms/CustomSafeAreaView'
import { RFValue } from 'react-native-responsive-fontsize'
import { useAppSelector } from '@store/reduxHook'
import { Colors } from '@utils/Constants'
import { navigate } from '@navigation/NavigationUtil'
import OrderItem from './atoms/OrderItem'
import PlaceOrderButton from './atoms/PlaceOrderButton'
import { getUserCart } from './api/api'

interface CartDisplayItem {
    id: number;
    name: string;
    price: number;
    image_uri: string;
    quantity: number;
    totalPrice: number;
}

const Cart = () => {
    const { user, isAuthenticated, token } = useAppSelector(state => state.auth)
    const [cartItems, setCartItems] = useState<CartDisplayItem[]>([])
    const [loading, setLoading] = useState(false)

    const fetchUserCart = async () => {
        if (!isAuthenticated || !token) {
            setCartItems([])
            return
        }

        try {
            setLoading(true)
            const response = await getUserCart(token)
            // Transform the API response to match the expected format
            const transformedItems: CartDisplayItem[] = response.data.items.map((item: any) => ({
                id: item.id,
                name: item.product.name,
                price: item.product.price,
                image_uri: item.product.image_uri,
                quantity: item.quantity,
                totalPrice: item.product.price * item.quantity
            }))
            setCartItems(transformedItems)
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

    return (
        <CustomSafeAreaView>
            <View style={styles.container}>
                <Text style={styles.heading}>My Cart</Text>
                {isAuthenticated && user ? (
                    <>
                        <Text style={styles.number}>Deliver to : {user.phone || "🗺️"}</Text>
                        <Text style={styles.address}>{user.address || "Add your address"}</Text>
                    </>
                ) : (
                    <>
                        <Text style={styles.number}>🗺️</Text>
                        <Text style={styles.address}>Login first to place order</Text>
                    </>
                )}
            </View>

            {loading ? (
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>Loading cart...</Text>
                </View>
            ) : cartItems.length > 0 ? (
                <FlatList
                    data={cartItems}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id.toString()}
                    contentContainerStyle={styles.listContainer}
                />
            ) : (
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>
                        {isAuthenticated ? 'Your cart is empty' : 'Login to view your cart'}
                    </Text>
                    <TouchableOpacity style={styles.shopNowButton} onPress={handleShopNow}>
                        <Text style={styles.shopNowText}>
                            {isAuthenticated ? 'Shop Now' : 'Login & Shop'}
                        </Text>
                    </TouchableOpacity>
                </View>
            )}

            {cartItems.length > 0 && isAuthenticated && 
                <PlaceOrderButton />
            }
        </CustomSafeAreaView>
    )
}
const styles = StyleSheet.create({
    number: {
        fontWeight: "500"
    },
    address: {
        color: "#666",
        marginTop: 3
    },
    container: {
        padding: 16,
        borderBottomWidth: 5,
        borderColor: '#F0F2F5',
        backgroundColor: '#fff',
    },
    heading: {
        fontSize: RFValue(14),
        fontWeight: '600',
        color: '#000',
        marginBottom: 8,
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
        paddingBottom: 100
    }
})
export default Cart