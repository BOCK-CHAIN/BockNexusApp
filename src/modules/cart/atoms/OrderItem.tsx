import { View, Text, StyleSheet, Image, TouchableOpacity, Modal, ActivityIndicator, Platform } from 'react-native'
import React, { FC, useState } from 'react'
import { useSelector } from 'react-redux'
import { RFValue } from 'react-native-responsive-fontsize'
import Icon from "@components/atoms/Icon";
import { removeFromCart, updateCartItem } from '../api/api'
import Toast from 'react-native-toast-message';
import DropDownPicker from 'react-native-dropdown-picker';

const OrderItem:FC <{item:any, onUpdate?: () => void}> = ({item, onUpdate}) => {
    const token = useSelector((state) => state.auth.token);
    const [isVisible, setIsVisible] = useState(false)
    const [quantity, setQuantity] = useState(item.quantity)
    const [loading, setLoading] = useState(false)
    const [selectedSize, setSelectedSize] = useState(item.size);
    const [open, setOpen] = useState(false);
    const [sizeItems, setSizeItems] = useState(
        item.product.productSizes.map(sizeObj => ({
            label: sizeObj.size,
            value: sizeObj.size
        }))
    );

    const handleRemove = () => {
        setIsVisible(true);
    }

    const onRemove = async () => {
        try {
            const res = await removeFromCart(token, item.id)
            if(res.success){
                console.log("Successfully removed!")
                Toast.show({
                    type: 'success',
                    position: 'bottom',
                    text1: 'Successfully Removed',
                    text2: 'The product was removed from your cart'
                });
                onUpdate?.();
            }
        }catch(err){
            console.log("Error removing: ", err.message);
        }finally{
            setIsVisible(false)
        }
    }

    const onChangeValue = async (value) => {
        setLoading(true)
        const newQuantity = quantity + value;
        if(newQuantity < 1) {
            setIsVisible(true);
            return;
        };

        try {
            const res = await updateCartItem(token, item.id, { quantity: newQuantity });
            if(res.success){
                if(res.message === 'Insufficient stock for this size'){
                    Toast.show({
                        type: 'error',
                        position: 'bottom',
                        text1: 'Not enough stock!'
                    });
                }else{
                    Toast.show({
                        type: 'success',
                        position: 'bottom',
                        text1: 'Successful',
                        text2: 'The product was updated!'
                    });
                    onUpdate?.();
                }
            }
        }catch(err){
            console.log('Error updating quantity: ', err.message);
            Toast.show({
                type: 'success',
                position: 'bottom',
                text1: 'Failed to update quantity'
            });
        }finally{
            setLoading(false)
        }
    }

    return (
        <View style={styles.container}>
            <View style={styles.flexRow}>
                <View style={styles.imageContainer}>
                    <Image source={{uri: item.product.image_uri}} style={styles.img} />
                </View>

                <View style={styles.itemContainer}>
                    <Text style={styles.itemName}>{item.product.name}</Text>
                    <View style={styles.sizeRow}>
                        <Text style={styles.itemName}>Size: </Text>
                        <View style={[styles.dropdownWrapper, open && styles.dropdownWrapperOpen]}>
                            <DropDownPicker
                                open={open}
                                value={selectedSize}
                                items={sizeItems}
                                setOpen={setOpen}
                                setValue={setSelectedSize}
                                setItems={setSizeItems}
                                style={styles.dropdown}
                                containerStyle={styles.dropdownContainer}
                                dropDownContainerStyle={styles.dropdownMenu}
                                textStyle={styles.dropdownText}
                                placeholder="Select size"
                            />
                        </View>
                    </View>
                    <Text style={styles.itemDetails}>₹{item.product.price} x {quantity}</Text>
                    <Text style={styles.itemTotal}>Total: ₹{quantity*item.product.price}</Text>
                </View>
            </View>
            <View style={styles.functions}>
                <View style={styles.boxes}>
                    {loading ? (<ActivityIndicator color="black" size="small" />
                    ) : (
                        <>
                            <TouchableOpacity onPress={() => onChangeValue(-1)}>
                                <Icon color='black' name='minus' iconFamily="MaterialCommunityIcons" size={RFValue(18)} />
                            </TouchableOpacity>
                                <Text style={styles.quantityText}> {quantity} </Text>
                            <TouchableOpacity onPress={() => onChangeValue(+1)}>
                                <Icon color='black' name='plus' iconFamily="MaterialCommunityIcons" size={RFValue(18)} />
                            </TouchableOpacity>
                        </>
                    )}
                </View>
                <TouchableOpacity
                    style={[styles.boxes, { justifyContent: 'center' }]}
                    onPress={handleRemove}
                >
                    <Icon name="trash-can" iconFamily="MaterialCommunityIcons" size={24} color="red" />
                    <Text style={styles.removeText}> Remove </Text>
                </TouchableOpacity>
            </View>

            <Modal
                visible={isVisible}
                animationType="slide"
                transparent
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                        <Text style={styles.modalText}>Are you sure?</Text>

                        <View style={styles.modalButtons}>
                            <TouchableOpacity onPress={() => setIsVisible(false)}>
                                <Text style={styles.cancel}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={onRemove}>
                                <Text style={styles.confirm}>Remove</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    )
}

const styles = StyleSheet.create({
    flexRow: {
        justifyContent: "space-between",
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    container: {
        marginBottom: 15,
        borderBottomWidth: 5,
        paddingVertical: 10,
        borderColor: '#F0F2F5',
        padding: 10,
    },
    imageContainer: {
        width: '25%',
        justifyContent:'center',
        alignItems: 'center'
    },
    img: {
        resizeMode: 'contain',
        borderWidth: 1,
        height: 90,
        borderColor: '#ccc',
        width: '100%',
        marginBottom: 10
    },
    itemContainer: {
        width: '70%'
    },
    itemName: {
        fontSize: RFValue(12),
        fontWeight: '500',
        color: '#000'
    },
    itemDetails: {
        fontSize: RFValue(10),
        color: '#666',
        marginTop: 4
    },
    itemTotal: {
        fontSize: RFValue(12),
        fontWeight: '600',
        color: '#000',
        marginTop: 8
    },
    functions: {
        flexDirection: 'row',
        marginTop: 10,
        paddingHorizontal: 15,
        gap: 6
    },
    boxes: {
        flex: 1,
        borderWidth: 1,
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        padding: 3,
        borderRadius: 5
    },
    quantityText: {
        fontSize: RFValue(16),
        fontWeight: '600',
        color: '#000',
        marginHorizontal: RFValue(6)
    },
    removeText: {
        fontSize: RFValue(14),
        fontWeight: '500',
        color: '#d11a2a',
        marginLeft: RFValue(6)
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
        fontSize: 16,
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
        fontSize: 14,
        paddingHorizontal: 10
    },
    confirm: {
        color: '#d11a2a',
        fontSize: 14,
        fontWeight: 'bold',
        paddingHorizontal: 10
    },
    sizeRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 6
    },
    dropdownWrapper: {
        flex: 1,
        marginLeft: 8,
        zIndex: 1
    },
    dropdownWrapperOpen: {
        zIndex: 9999,
        elevation: 9999
    },
    dropdown: {
        width: '40%',
        borderColor: '#ccc',
        borderRadius: 5,
        height: 32,
        paddingHorizontal: 6,
        minHeight: 32,
        backgroundColor: '#fff'
    },
    dropdownMenu: {
        width: '40%',
        borderColor: '#ccc',
        borderRadius: 4,
        backgroundColor: '#fff',
        zIndex: 9999,
        elevation: 10
    },
    dropdownText: {
        fontSize: RFValue(10),
    },
    dropdownContainer: {
        height: 32
    }
})

export default OrderItem

