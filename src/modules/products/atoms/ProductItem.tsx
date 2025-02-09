import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native'
import React from 'react'
import { navigate } from '@navigation/NavigationUtil'
import Icon from '@components/atoms/Icon'
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
})
export default ProductItem