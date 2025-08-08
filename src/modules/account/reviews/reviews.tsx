import React, { useState } from 'react'
import { View, Text, StyleSheet, Image, TextInput, TouchableOpacity, Modal } from 'react-native'
import { useRoute } from '@react-navigation/native'
import { RFValue } from 'react-native-responsive-fontsize';
import Toast from 'react-native-toast-message'
import { addReview } from '../api/reviewApi.tsx'
import { useSelector } from 'react-redux'

const Reviews = () => {
    const userId = useSelector((state) => state.auth.user.id)
    const token = useSelector((state) => state.auth.token)
    const { item } = useRoute().params
    const [review, setReview] = useState('')
    const [starRating, setStarRating] = useState(0)
    const [isVisible, setIsVisible] = useState(false)
    const rating = ['Horrible!', 'Bad!', 'Okay', 'Good!', 'Awesome!']

    const handleSubmit = () => {
        if (review === '' && starRating === 0) {
            setTimeout(() => {
                Toast.show({
                    type: 'error',
                    position: 'bottom',
                    text1: 'Please fill both fields'
                })
            }, 2000)
        } else if (starRating === 0) {
            setTimeout(() => {
                Toast.show({
                    type: 'error',
                    position: 'bottom',
                    text1: 'Please choose a rating'
                })
            }, 2000)
        } else if (review === '') {
            setTimeout(() => {
                Toast.show({
                    type: 'error',
                    position: 'bottom',
                    text1: 'Please write a review'
                })
            }, 2000)
        }else{
            setIsVisible(true)
        }
    }

    const handleConfirm = async () => {
        if (!token) {
            Toast.show({ type: 'error', text1: 'You must be logged in!' });
            return;
        }

        try{
            const { ok, data } = await addReview({
                productId: item.product.id,
                userId,
                rating: starRating,
                comment: review
                }, token);

            if (ok) {
                Toast.show({
                    type: 'success',
                    position: 'bottom',
                    text1: 'Review submitted!',
                    text2: 'Thank you!'
                });
                setIsVisible(false);
                setReview('');
                setStarRating(0);
            } else {
                Toast.show({
                    type: 'error',
                    text1: data?.message || 'Submission failed.'
                });
            }
        }catch(err){
            console.log('Add failed: ', err);
        }
    }

    return (
        <View style={{ flex: 1, backgroundColor: 'white' }}>
            <View style={styles.infoHeader}>
                <Image
                    source={{ uri: item.product.image_uri }}
                    style={styles.productImage}
                />
                <View style={styles.productDetails}>
                    <Text style={styles.brandName}>{item.product.brand}</Text>
                    <Text style={styles.productName}>{item.product.name}</Text>
                    <Text style={styles.productDescription}>{item.product.description}</Text>
                    <Text style={styles.textInput}>Rate the Product!</Text>
                    <View style={styles.starContainer}>
                        {[1, 2, 3, 4, 5].map((star) => (
                            <TouchableOpacity key={star} onPress={() => setStarRating(star)}>
                                <Text style={styles.star}>{starRating >= star ? '★' : '☆'}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                    {starRating !== 0 ?
                        <Text style={styles.reviewText}>{rating[starRating - 1]}</Text> :
                        <Text style={styles.reviewText}></Text>
                    }
                </View>
            </View>
            <View style={styles.review}>
                <Text style={[styles.textInput, { fontSize: RFValue(20) }]}> Write Review</Text>
                <View style={styles.inputBox}>
                    <TextInput
                        style={{ padding: 10 }}
                        placeholder='What do you think of the product?'
                        multiline={true}
                        value={review}
                        onChangeText={(newText) => setReview(newText)}
                    />
                </View>
            </View>
            <View style={{ flex: 1 }}>
                <View style={styles.upload}>
                    <TouchableOpacity
                        style={styles.uploading}
                    >
                        <Image
                            source={require('../../../assets/images/photo.png')}
                            style={{ height: 32, width: 32 }}
                        />
                        <Text style={styles.uploadingText}>Photo</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.uploading}
                    >
                        <Image
                            source={require('../../../assets/images/video.png')}
                            style={{ height: 32, width: 32 }}
                        />
                        <Text style={styles.uploadingText}>Video</Text>
                    </TouchableOpacity>
                </View>
                <Text style={styles.infoText}> Upload images and/or videos {'\n'} of the product! </Text>
            </View>
            <View style={styles.footer}>
                <TouchableOpacity
                    style={styles.enter}
                    onPress={handleSubmit}
                >
                    <Text style={styles.footerText}>Submit Review</Text>
                </TouchableOpacity>
            </View>
            <Modal
                visible={isVisible}
                transparent
                animationType="fade"
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                        <Text style={styles.modalText}>Are you sure about submitting?</Text>

                        <View style={styles.modalButtons}>
                            <TouchableOpacity onPress={() => setIsVisible(false)}>
                                <Text style={styles.cancel}>No</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={handleConfirm}>
                                <Text style={styles.confirm}>Yes</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    )
}

const styles = StyleSheet.create({
    infoHeader: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        paddingHorizontal: 20,
        marginTop: 20,
    },
    productImage: {
        height: 200,
        width: 135,
        borderRadius: 10,
        marginRight: 20,
    },
    productDetails: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-start',
    },
    brandName: {
        fontSize: RFValue(14),
        fontWeight: '500',
        color: '#555',
        marginBottom: 2,
        flexWrap: 'wrap',
    },
    productName: {
        fontSize: RFValue(16),
        fontWeight: '700',
        color: '#222',
        marginBottom: 4,
        flexWrap: 'wrap',
    },
    productDescription: {
        fontSize: RFValue(14),
        color: '#444',
        marginBottom: 8,
        flexWrap: 'wrap',
    },
    starContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 4,
    },
    inputBox: {
        borderWidth: 1,
        borderRadius: 5,
        height: 150,
    },
    review: {
        marginTop: 15,
        marginHorizontal: 15,
    },
    textInput: {
        fontSize: RFValue(14),
        fontWeight: '700',
        color: '#222',
    },
    starRating: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    star: {
        fontSize: RFValue(22),
        marginHorizontal: 2,
        color: '#914294',
    },
    reviewText: {
        fontSize: RFValue(14),
        fontWeight: '500',
        color: '#914294',
    },
    upload: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'flex-start',
        marginTop: 30,
        gap: 10,
    },
    uploading: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 10,
        padding: 15,
        borderWidth: 1,
        borderRadius: 10,
        borderColor: '#914294',
        borderStyle: 'dashed',
        backgroundColor: 'rgba(145, 66, 148, 0.2)'
    },
    uploadingText: {
        fontSize: RFValue(16),
        color: '#222',
    },
    footer: {
        position: 'absolute',
        bottom: 5,
        left: 0,
        right: 0,
        height: 60,
        justifyContent: 'center',
        alignItems: 'center',
    },
    enter: {
        backgroundColor: '#914294',
        borderRadius: 10,
        paddingHorizontal: 100,
        paddingVertical: 15,
        marginBottom: 8
    },
    footerText: {
        fontSize: RFValue(16),
        fontWeight: 700
    },
    infoText: {
        textAlign: 'center',
        marginTop: 5,
        fontSize: RFValue(15),
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
        fontSize: RFValue(16),
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
        fontSize: RFValue(15),
        paddingHorizontal: 10
    },
    confirm: {
        color: '#d11a2a',
        fontSize: RFValue(15),
        fontWeight: 'bold',
        paddingHorizontal: 10
    },
})

export default Reviews

