import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, Dimensions, Alert, Modal, FlatList, ActivityIndicator } from 'react-native';
import { useRoute } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import { RFValue } from 'react-native-responsive-fontsize';
import { FONTS } from '@utils/Constants';
import { useSelector } from 'react-redux';
import { AddToCart } from '../api/addToCart';

const { width: screenWidth } = Dimensions.get('window');

interface ProductSize {
  id: number;
  size: string;
  stock: number;
}

const ProductDetails = () => {
    const route = useRoute();
    const { item } = route.params;
    const navigation = useNavigation();
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [showSizeChart, setShowSizeChart] = useState(false);
    const [selectedSize, setSelectedSize] = useState<ProductSize | null>(null);
    const [quantity, setQuantity] = useState(1);
    const [addingToCart, setAddingToCart] = useState(false);
    const [loading, setLoading] = useState(false);
    const user = useSelector((state) =>  state.auth.user);
    const token = useSelector((state) => state.auth.token);

    // Handling Adding to cart
    const addToCart = async () => {
        if(!token || !user){
            Alert.alert('Please log in first!');
            return;
        }

        if(!selectedSize && item.sizeType !== 'NONE' && item.sizeType !== 'ONE_SIZE' ){
            Alert.alert('Please select a size to continue');
            return;
        }

        setAddingToCart(true);

        try{
            const response = await AddToCart (
                token,
                item.id,
                selectedSize?.id ?? null,
                quantity,
                selectedSize?.size ?? null
            );

            if(response.success){
                Alert.alert('Success', 'Item added to cart');
            }else{
                Alert.alert('Failed!', response.error || 'Failed to add item to cart');
            }
        }catch(err){
            console.error(err);
            Alert.alert('Error', 'Something went wrong while adding to cart!');
        }

        setAddingToCart(false);
    };

    const handleAddQuantity = async () => {
        setLoading(true);
        try{
            await new Promise((res) => setTimeout(res, 300));

            if(quantity + 1 > selectedSize?.stock){
                Alert.alert(`Only ${quantity} items are left in stock!`);
            }else{
                setQuantity(quantity + 1)
            }
        }finally{
            setLoading(false);
        }
    };

    const mockReviews = [
        {
            id: 1,
            rating: 5,
            comment: 'Amazing quality! The fabric is so soft and comfortable.',
            user: { phone: '+1234567890' },
            createdAt: '2024-01-15T10:30:00Z',
        },
        {
            id: 2,
            rating: 4,
            comment: 'Great fit and excellent value for money. Highly recommend!',
            user: { phone: '+1234567891' },
            createdAt: '2024-01-14T15:45:00Z',
        },
        {
            id: 3,
            rating: 5,
            comment: 'Perfect for everyday wear. Very satisfied with the purchase.',
            user: { phone: '+1234567892' },
            createdAt: '2024-01-13T09:20:00Z',
        },
    ]

    const sizeChart = {
        XS: { chest: '32-34', length: '26', sleeve: '7' },
        S: { chest: '34-36', length: '27', sleeve: '7.5' },
        M: { chest: '36-38', length: '28', sleeve: '8' },
        L: { chest: '38-40', length: '29', sleeve: '8.5' },
        XL: { chest: '40-42', length: '30', sleeve: '9' },
        XXL: { chest: '42-44', length: '31', sleeve: '9.5' },
    };

    const sizeTypeLabels: Record<string, string[]> = {
        GENERIC: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
        SHOES_UK_MEN: ['6', '7', '8', '9', '10', '11'],
        SHOES_UK_WOMEN: ['4', '5', '6', '7', '8'],
        NUMERIC: ['28', '30', '32', '34', '36'],
        VOLUME_ML: ['100ml', '200ml', '500ml'],
        WEIGHT_G: ['250g', '500g', '1kg'],
        ONE_SIZE: ['One Size'],
        WAIST_INCH: ['28', '30', '32', '34', '36'],
    };

    const renderSizeChart = () => (
        <Modal visible={showSizeChart} animationType="slide" transparent>
            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>Size Chart (inches)</Text>
                        <TouchableOpacity onPress={() => setShowSizeChart(false)}>
                            <Icon name="close" size={24} color="#333" />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.sizeChartTable}>
                        <View style={styles.sizeChartHeader}>
                            <Text style={styles.sizeChartHeaderText}>Size</Text>
                            <Text style={styles.sizeChartHeaderText}>Chest</Text>
                            <Text style={styles.sizeChartHeaderText}>Length</Text>
                            <Text style={styles.sizeChartHeaderText}>Sleeve</Text>
                        </View>

                        {Object.entries(sizeChart).map(([size, measurements]) => (
                            <View key={size} style={styles.sizeChartRow}>
                                <Text style={styles.sizeChartCell}>{size}</Text>
                                <Text style={styles.sizeChartCell}>{measurements.chest}</Text>
                                <Text style={styles.sizeChartCell}>{measurements.length}</Text>
                                <Text style={styles.sizeChartCell}>{measurements.sleeve}</Text>
                            </View>
                        ))}
                    </View>
                </View>
            </View>
        </Modal>
    );

    const renderReview = ({ item }: { item: Review }) => (
        <View style={styles.reviewItem}>
            <View style={styles.reviewHeader}>
                <View style={styles.ratingContainer}>
                    {[1, 2, 3, 4, 5].map((star) => (
                        <Icon
                            key={star}
                            name="star"
                            size={16}
                            color={star <= item.rating ? "#FFD700" : "#E0E0E0"}
                        />
                    ))}
                </View>
                <Text style={styles.reviewDate}>
                    {new Date(item.createdAt).toLocaleDateString()}
                </Text>
            </View>
            <Text style={styles.reviewComment}>{item.comment}</Text>
            <Text style={styles.reviewUser}>{item.user.phone.replace(/(\d{3})(\d{3})(\d{4})/, '***-***-$3')}</Text>
        </View>
    );

    const renderSizeButton = (size: ProductSize) => (
        <View style={{ alignItems: 'center' }}>
            <TouchableOpacity
                key={size.id}
                style={[
                    styles.sizeButton,
                    selectedSize?.id === size.id && styles.selectedSizeButton,
                    size.stock === 0 && styles.outOfStockButton
                ]}
                onPress={() => { if (size.stock > 0)
                    {
                        setSelectedSize(size);
                        setQuantity(1);
                    }
                }}
                disabled={size.stock === 0}
            >
                <Text style={[
                    styles.sizeButtonText,
                    selectedSize?.id === size.id && styles.selectedSizeButtonText,
                    size.stock === 0 && styles.outOfStockButtonText
                ]}>
                    {size.size}
                </Text>
                {size.stock === 0 && (
                    <Text style={styles.outOfStockText}>Out</Text>
                )}
            </TouchableOpacity>
            {size.stock < 10 && size.stock !== 0 && (
                <>
                    <Text style={{ textAlign: 'center', color: '#B00020' }}> Few </Text>
                    <Text style={{ textAlign: 'center', color: '#B00020' }}> Left! </Text>
                </>
            )}
        </View>
    );

    const averageRating = mockReviews.length > 0
    ? mockReviews.reduce((sum, review) => sum + review.rating, 0) / mockReviews.length : 0;

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Icon name="arrow-back" size={24} color="#333" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Product Details</Text>
                <TouchableOpacity>
                    <Icon name="favorite-border" size={24} color="#333" />
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
                {/* Image Gallery */}
                <View style={styles.imageContainer}>
                    <ScrollView
                        horizontal
                        pagingEnabled
                        showsHorizontalScrollIndicator={false}
                        onMomentumScrollEnd={(event) => {
                            const index = Math.round(event.nativeEvent.contentOffset.x / screenWidth);
                            setCurrentImageIndex(index);
                        }}
                    >
                        <Image source={{ uri: item.image_uri }} style={styles.productImage} />
                        <Image source={{ uri: item.image_uri }} style={styles.productImage} />
                        <Image source={{ uri: item.image_uri }} style={styles.productImage} />
                    </ScrollView>

                    {/* Image Indicator */}
                    <View style={styles.imageIndicator}>
                        <View style={[styles.indicatorDot, currentImageIndex === 0 && styles.activeDot]} />
                        <View style={[styles.indicatorDot, currentImageIndex === 1 && styles.activeDot]} />
                        <View style={[styles.indicatorDot, currentImageIndex === 2 && styles.activeDot]} />
                    </View>
                </View>

                <View style={{ marginLeft: 15 }}>
                    {/* Product Info */}
                    <View style={styles.productInfo}>
                        <Text style={styles.productName}>{item.name}</Text>
                        <Text style={styles.productPrice}>₹{item.price.toFixed(2)}</Text>
                    </View>

                    {/* Rating */}
                    <View style={styles.ratingSection}>
                        <View style={styles.ratingContainer}>
                            {[1, 2, 3, 4, 5].map((star) => (
                                <Icon
                                    key={star}
                                    name="star"
                                    size={20}
                                    color={star <= averageRating ? "#FFD700" : "#E0E0E0"}
                                />
                            ))}
                        </View>
                        <Text style={styles.ratingText}>
                        {averageRating.toFixed(1)} ({mockReviews.length} reviews)
                        </Text>
                    </View>

                    {/* Description */}
                    <Text style={styles.sectionTitle}>Description</Text>
                    <Text style={styles.productDescription}>{item.description}</Text>

                    {/* Size Selection */}
                    {item.sizeType !== 'NONE' && item.sizeType !== 'ONE_SIZE' && (
                      <View style={styles.sizeSection}>
                        <View style={styles.sizeSectionHeader}>
                          <Text style={styles.sectionTitle}>Size</Text>
                          {item.sizeType === 'GENERIC' && (
                              <TouchableOpacity onPress={() => setShowSizeChart(true)}>
                                <Text style={styles.sizeChartLink}>Size Chart</Text>
                              </TouchableOpacity>
                          )}
                        </View>
                        <View style={{ flexDirection: 'row', gap: 8 }}>
                            {item.productSizes.map(size => (
                                <React.Fragment key={size.id}>
                                    {renderSizeButton(size)}
                                </React.Fragment>
                            ))}
                        </View>
                      </View>
                    )}

                    {/* Quantity */}
                    <View style={styles.quantitySection}>
                        <Text style={styles.sectionTitle}>Quantity</Text>
                        <View style={styles.quantityControls}>
                            <TouchableOpacity
                                style={styles.quantityButton}
                                onPress={() => setQuantity(Math.max(1, quantity - 1))}
                            >
                                <Icon name="remove" size={20} color="#333" />
                            </TouchableOpacity>
                            <Text style={styles.quantityText}>{quantity}</Text>
                            <TouchableOpacity
                                style={styles.quantityButton}
                                onPress={handleAddQuantity}
                            >
                                <Icon name="add" size={20} color="#333" />
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Reviews Section */}
                    <View style={styles.reviewsSection}>
                        <Text style={styles.sectionTitle}>Reviews ({mockReviews.length})</Text>
                        <FlatList
                            data={mockReviews}
                            renderItem={renderReview}
                            keyExtractor={(item) => item.id.toString()}
                            scrollEnabled={false}
                            ItemSeparatorComponent={() => <View style={styles.reviewSeparator} />}
                        />
                    </View>
                </View>
            </ScrollView>
            {/* Bottom Action Buttons */}
                <View style={styles.bottomActions}>
                    <TouchableOpacity
                        style={[styles.actionButton, styles.addToCartButton]}
                        onPress={addToCart}
                    >
                        {addingToCart ? (
                            <ActivityIndicator color="#fff" size="small" />
                        ) : (
                            <>
                                <Icon name="shopping-cart" size={20} color="#fff" />
                                <Text style={styles.actionButtonText}>Add to Cart</Text>
                            </>
                        )}
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.actionButton, styles.buyNowButton]}
                    >
                        <Icon name="flash-on" size={20} color="#fff" />
                        <Text style={styles.actionButtonText}>Buy Now</Text>
                    </TouchableOpacity>
                </View>
                {loading && (
                    <View style={styles.fullScreenLoading} pointerEvents="auto">
                        <ActivityIndicator size='large' color='#000' />
                    </View>
                )}
            {renderSizeChart()}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    headerTitle: {
        fontSize: 18,
        fontFamily: FONTS.heading,
        fontWeight: 'bold',
        color: '#333',
    },
    scrollContainer: {
        flex: 1,
    },
    imageContainer: {
        position: 'relative',
    },
    productImage: {
        width: screenWidth,
        height: 400,
        resizeMode: 'cover',
    },
    imageIndicator: {
        position: 'absolute',
        bottom: 20,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    indicatorDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
        marginHorizontal: 4,
    },
    activeDot: {
        backgroundColor: '#fff',
    },
    productInfo: {
        padding: 8,
    },
    productName: {
        fontSize: RFValue(24),
        fontFamily: FONTS.heading,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 10,
    },
    productPrice: {
        fontSize: RFValue(20),
        fontWeight: 'bold',
        color: '#2E7D32',
        marginBottom: 15,
    },
    ratingSection: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    ratingContainer: {
        flexDirection: 'row',
        marginRight: 10,
    },
    ratingText: {
        fontSize: RFValue(14),
        color: '#666',
    },
    sectionTitle: {
        fontSize: RFValue(18),
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 10,
        marginTop: 20,
    },
    productDescription: {
        fontSize: RFValue(14),
        color: '#666',
        lineHeight: 22,
        marginRight: 5
    },
    sizeSection: {
        marginTop: 20,
    },
    sizeSectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    sizeChartLink: {
        fontSize: RFValue(14),
        color: '#2E7D32',
        textDecorationLine: 'underline',
        marginRight: 10
    },
    sizeGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 20,
        width: '90%',
        maxHeight: '80%',
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    modalTitle: {
        fontSize: RFValue(18),
        fontWeight: 'bold',
        color: '#333',
    },
    sizeChartTable: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 10,
        overflow: 'hidden',
    },
    sizeChartHeader: {
        flexDirection: 'row',
        backgroundColor: '#f5f5f5',
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    sizeChartHeaderText: {
        flex: 1,
        padding: 15,
        fontSize: RFValue(13),
        fontWeight: 'bold',
        color: '#333',
        textAlign: 'center',
    },
    sizeChartRow: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    sizeChartCell: {
        flex: 1,
        padding: 15,
        fontSize: RFValue(12),
        color: '#666',
        textAlign: 'center',
    },
    sizeButton: {
        width: 50,
        height: 50,
        marginHorizontal: 3,
        borderRadius: 15,
        borderWidth: 2,
        borderColor: '#ddd',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    selectedSizeButton: {
        borderColor: '#2E7D32',
        backgroundColor: '#E7F9EC',
    },
    outOfStockButton: {
        borderColor: '#ccc',
        backgroundColor: '#f5f5f5',
    },
    sizeButtonText: {
        fontSize: RFValue(14),
        fontWeight: '600',
        color: '#333',
    },
    selectedSizeButtonText: {
        color: '#2E7D32',
    },
    outOfStockButtonText: {
        color: '#999',
    },
    outOfStockText: {
        fontSize: RFValue(8),
        color: '#999',
        position: 'absolute',
        bottom: 2,
    },
    quantitySection: {
        marginTop: 20,
    },
    quantityControls: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
    },
    quantityButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#ddd',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    quantityText: {
        fontSize: RFValue(18),
        fontWeight: 'bold',
        marginHorizontal: 20,
        minWidth: 30,
        textAlign: 'center',
    },
    reviewsSection: {
        marginTop: 20,
    },
    reviewItem: {
        padding: 15,
        backgroundColor: '#f9f9f9',
        borderRadius: 10,
        marginRight: 15
    },
    reviewHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    reviewDate: {
        fontSize: RFValue(12),
        color: '#999',
    },
    reviewComment: {
        fontSize: RFValue(14),
        color: '#333',
        marginBottom: 5,
    },
    reviewUser: {
        fontSize: RFValue(12),
        color: '#666',
        fontStyle: 'italic',
    },
    reviewSeparator: {
        height: 10,
    },
    bottomActions: {
        flexDirection: 'row',
        padding: 20,
        borderTopWidth: 1,
        borderTopColor: '#eee',
        backgroundColor: '#fff',
    },
    actionButton: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 15,
        borderRadius: 10,
        marginHorizontal: 5,
    },
    addToCartButton: {
        backgroundColor: '#2E7D32',
    },
    buyNowButton: {
        backgroundColor: '#FF6B35',
    },
    actionButtonText: {
        color: '#fff',
        fontSize: RFValue(16),
        fontWeight: 'bold',
        marginLeft: 8,
    },
    fullScreenLoading: {
        position: 'absolute',
        top: 0, left: 0, right: 0, bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.5)',
        zIndex: 10,
    }
})

export default ProductDetails;