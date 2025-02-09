import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native'
import React from 'react'
import { navigate } from '@navigation/NavigationUtil'
import Icon from '@components/atoms/Icon'
import { RFValue } from 'react-native-responsive-fontsize'
const ProductItem = ({ item, is0dd }: any) => {
    return (
        <View style={[styles.productCard, { marginRight: is0dd ? 0 : 10 }]}>
            <View style={styles.imageContainer}>
                <Image source={{ uri: item?.image_uri }} style={styles.productImage} />
                {
                    !item?.ar_uri &&
                    (
                        <TouchableOpacity style={styles.button3d} onPress={() => navigate('ARViewer', {
                            uri: item?.ar_uri
                        })}>

                            <Icon name='cube-scan' iconFamily='MaterialCommunityIcons' size={20} color='#000' />
                        </TouchableOpacity>
                    )
                }
            </View>

            <View style={{ paddingHorizontal: 10 }} >
                <Text style={styles.productName} >
                    {item?.name}
                </Text>
                <Text numberOfLines={2} style={styles.productDesc} >
                    {item?.desc}
                </Text>
                <Text style={styles.productPrice} >
                    <Text style={{ textDecorationLine: "line-through", opacity: 0.6 }} >
                        ₹{item?.price + 599}
                    </Text>
                    {" "}₹{item?.price}
                </Text>

            </View>
        </View>
    )
}
const styles = StyleSheet.create({
    productCard: {
        backgroundColor: '#fff',
        width: '48%',
        overflow: "hidden",
        marginBottom: 10
    },
    imageContainer: {
        backgroundColor: "#F7F7F7",
        width: '100%',
        height: 240
    },
    productImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    button3d: {
        position: 'absolute',
        top: 10,
        right: 10,
        backgroundColor: '#fff',
        padding: 5,
        borderRadius: 50,
        elevation: 5,
        zIndex: 1
    },
    productName: {
        fontSize: RFValue(10),
        marginTop: 10,
    },
    productDesc: {
        fontSize: RFValue(9),
        color: '#555',
        textAlign: 'left',
        marginTop: 5,
    },
    productPrice: {
        fontSize: RFValue(10),
        color: '#000',
        marginTop: 10,
        fontWeight: '500',
    },
})

export default ProductItem