import { View,Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import React, { FC } from 'react'
import { useAppSelector } from "@store/reduxHook";
import { Colors } from "@utils/Constants";
import { RFValue } from "react-native-responsive-fontsize";
import Icon from "@components/atoms/Icon";
import { addToCart, removeFromCart, getUserCart } from "@modules/cart/api/api";
import { navigate } from "@navigation/NavigationUtil";

const UniversalAdd:FC<{item: any, onUpdate?: () => void}> = ({item, onUpdate}) => {
    const { isAuthenticated, token } = useAppSelector(state => state.auth);
    const [count, setCount] = React.useState(0);
    const [loading, setLoading] = React.useState(false);

    const fetchCartCount = async () => {
        if (!isAuthenticated || !token) {
            setCount(0);
            return;
        }

        try {
            const response = await getUserCart(token);
            const cartItem = response.data.items.find((cartItem: any) => cartItem.product_id === item.id);
            setCount(cartItem ? cartItem.quantity : 0);
        } catch (error) {
            console.log('Failed to fetch cart count:', error);
            setCount(0);
        }
    };

    React.useEffect(() => {
        fetchCartCount();
    }, [isAuthenticated, token, item.id]);

    const handleAdd = async () => {
        if (!isAuthenticated || !token) {
            Alert.alert(
                'Login Required',
                'Please login to add items to cart',
                [
                    { text: 'Cancel', style: 'cancel' },
                    { text: 'Login', onPress: () => navigate('Account') }
                ]
            );
            return;
        }

        try {
            setLoading(true);
            await addToCart(token, {
                productId: item.id,
                productSizeId: 1,
                quantity: 1
            });
            await fetchCartCount();
            onUpdate?.();
        } catch (error) {
            console.log('Failed to add item:', error);
            Alert.alert('Error', 'Failed to add item to cart');
        } finally {
            setLoading(false);
        }
    };

    const handleRemove = async () => {
        if (!isAuthenticated || !token) return;

        try {
            setLoading(true);
            const response = await getUserCart(token);
            const cartItem = response.data.items.find((cartItem: any) => cartItem.product_id === item.id);
            
            if (cartItem) {
                await removeFromCart(token, cartItem.id);
                await fetchCartCount();
                onUpdate?.();
            }
        } catch (error) {
            console.log('Failed to remove item:', error);
            Alert.alert('Error', 'Failed to remove item from cart');
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={[styles.container,{backgroundColor:count === 0 ? '#fff':Colors.active}]}>
            {count === 0? (
                <TouchableOpacity 
                    onPress={handleAdd} 
                    style={styles.add}
                    disabled={loading}
                >
                    <Text style={styles.addText}>ADD</Text>
                </TouchableOpacity>
            ):(
                <View style = {styles.counterContainer}>
                    <TouchableOpacity 
                        onPress={handleRemove}
                        disabled={loading}
                    >
                        <Icon color='#fff' name='minus' iconFamily="MaterialCommunityIcons" size={RFValue(14)} />
                    </TouchableOpacity>
                    <Text style={styles.text}>{count}</Text>
                    <TouchableOpacity 
                        onPress={handleAdd}
                        disabled={loading}
                    >
                        <Icon color='#fff' name='plus' iconFamily="MaterialCommunityIcons" size={RFValue(14)} />
                    </TouchableOpacity>
                </View>
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        alignItems:'center',
        justifyContent:'center',
        borderWidth:1,
        borderColor:Colors.active,
        width:65
    },
    addText:{
        color: Colors.active
    },
    counterContainer: {
        flexDirection:'row',
        alignItems:'center',
        width:'100%',
        paddingHorizontal:4,
        paddingVertical:4,
        justifyContent:'space-between'
    },
    text: {
        color: '#fff',
        fontWeight: '500',
        fontSize:RFValue(12),
    },
    add: {
        width: '100%',
        alignItems:'center',
        justifyContent: 'center',
        paddingHorizontal: 4,
        paddingVertical: 4
    }

})

export default UniversalAdd