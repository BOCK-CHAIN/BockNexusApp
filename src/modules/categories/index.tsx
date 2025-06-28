import { View, Text, StyleSheet, SafeAreaView, ActivityIndicator, Image, TouchableOpacity, ScrollView, Modal, Dimensions } from 'react-native'
import React, { FC, useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '@store/reduxHook'
import { getCategories } from './api/actions'
import { RFValue } from 'react-native-responsive-fontsize'
import { FONTS } from '@utils/Constants'
import { navigate } from '@navigation/NavigationUtil'
import { RootState } from '@store/store'
import { Category } from './types/redux'

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const Categories: FC = () => {
    const dispatch = useAppDispatch()
    const { data, loading, error } = useAppSelector((state: RootState) => state.categories)
    const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null)
    const [showProductPreview, setShowProductPreview] = useState(false)

    // Mock product data for Fashion category
    const fashionProduct = {
        id: 1,
        name: 'Premium Cotton T-Shirt',
        price: 299,
        image_uri: 'https://m.media-amazon.com/images/I/51xOEh5DKYL._SY879_.jpg',
        description: 'Experience ultimate comfort with our premium cotton t-shirt.',
        rating: 4.5,
        reviews: 128
    };

    useEffect(() => {
        dispatch(getCategories())
    }, [dispatch])
    
    useEffect(() => {
        if (data && Array.isArray(data) && data.length > 0) {
            setSelectedCategoryId(data[0].id)
        }
    }, [data])

    const selectedCategory = data && Array.isArray(data) ? data.find((cat: Category) => cat.id === selectedCategoryId) : null

    const handleViewFeaturedProduct = () => {
        setShowProductPreview(true);
    };

    const handleProductPreviewPress = () => {
        setShowProductPreview(false);
        navigate('ProductDetail', {
            productId: 1,
            categoryId: selectedCategory?.id
        });
    };

    if (loading) {
        return (
            <View style={[styles.container, styles.centerContent]}>
                <ActivityIndicator size='large' color='black' />
            </View>
        )
    }

    return (
        <View style={styles.container}>
            <View style={styles.headerContainer}>
                <SafeAreaView />
                <Text style={styles.title}>Categories</Text>
                <Text style={styles.subtitle}>Explore our wide range of categories</Text>
            </View>

            <View style={styles.contentWrapper}>
                {/* Left Sidebar */}
                <View style={styles.sidebar}>
                    <ScrollView 
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={styles.sidebarContent}
                    >
                        {data && Array.isArray(data) && data.map((item: Category) => (
                            <TouchableOpacity 
                                key={item.id}
                                style={[
                                    styles.sidebarItem,
                                    selectedCategoryId === item.id && styles.selectedSidebarItem
                                ]}
                                onPress={() => setSelectedCategoryId(item.id)}
                            >
                                <Image source={{ uri: item?.image_uri }} style={styles.sidebarImage} />
                                <Text style={[
                                    styles.sidebarText,
                                    selectedCategoryId === item.id && styles.selectedSidebarText
                                ]}>
                                    {item?.name}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>

                {/* Main Content */}
                <View style={styles.mainContent}>
                    {selectedCategory ? (
                        <View style={styles.categoryDetails}>
                            <Image 
                                source={{ uri: selectedCategory.image_uri }} 
                                style={styles.categoryMainImage}
                            />
                            <Text style={styles.categoryTitle}>{selectedCategory.name}</Text>
                            <Text style={styles.categoryDescription}>
                                Discover amazing products in {selectedCategory.name.toLowerCase()}
                            </Text>
                            
                            <TouchableOpacity 
                                style={styles.exploreButton}
                                onPress={() => navigate('Products', {
                                    id: selectedCategory.id,
                                    name: selectedCategory.name
                                })}
                            >
                                <Text style={styles.exploreButtonText}>Explore Products</Text>
                            </TouchableOpacity>

                            {/* Fashion Category Special Button */}
                            {selectedCategory.name.toLowerCase() === 'fashion' && (
                                <TouchableOpacity 
                                    style={styles.fashionButton}
                                    onPress={handleViewFeaturedProduct}
                                >
                                    <Text style={styles.fashionButtonText}>View Featured Fashion Item</Text>
                                </TouchableOpacity>
                            )}
                        </View>
                    ) : (
                        <View style={styles.centerContent}>
                            <Text style={styles.noSelectionText}>Select a category to view details</Text>
                        </View>
                    )}
                </View>
            </View>

            {/* Product Preview Modal */}
            <Modal
                visible={showProductPreview}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setShowProductPreview(false)}
            >
                <View style={styles.modalOverlay}>
                    <TouchableOpacity 
                        style={styles.modalBackground}
                        activeOpacity={1}
                        onPress={() => setShowProductPreview(false)}
                    />
                    <View style={styles.previewContainer}>
                        <TouchableOpacity 
                            style={styles.previewContent}
                            activeOpacity={0.9}
                            onPress={handleProductPreviewPress}
                        >
                            <Image 
                                source={{ uri: fashionProduct.image_uri }} 
                                style={styles.previewImage}
                                resizeMode="contain"
                            />
                            <View style={styles.previewInfo}>
                                <Text style={styles.previewTitle}>{fashionProduct.name}</Text>
                                <View style={styles.previewRating}>
                                    <Text style={styles.ratingText}>★ {fashionProduct.rating}</Text>
                                    <Text style={styles.reviewsText}>({fashionProduct.reviews} reviews)</Text>
                                </View>
                                <Text style={styles.previewPrice}>₹{fashionProduct.price}</Text>
                                <Text style={styles.previewDescription} numberOfLines={2}>
                                    {fashionProduct.description}
                                </Text>
                                <View style={styles.previewButton}>
                                    <Text style={styles.previewButtonText}>View Full Details</Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            {error && (
                <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>{error}</Text>
                </View>
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#E7F9EC',
    },
    centerContent: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerContainer: {
        padding: 20,
        backgroundColor: "#fff",
        alignItems: "flex-start",
        borderBottomWidth: 1,
        borderBottomColor: '#ddd'
    },
    title: {
        fontSize: RFValue(18),
        fontFamily: FONTS.heading,
        fontWeight: 'bold',
        color: '#333',
    },
    subtitle: {
        fontSize: RFValue(13),
        color: '#666',
        marginTop: 5,
    },
    contentWrapper: {
        flex: 1,
        flexDirection: 'row',
    },
    sidebar: {
        width: 120,
        backgroundColor: '#fff',
        borderRightWidth: 1,
        borderRightColor: '#ddd',
    },
    sidebarContent: {
        paddingVertical: 10,
    },
    sidebarItem: {
        padding: 15,
        alignItems: 'center',
        borderBottomWidth: 0.5,
        borderBottomColor: '#eee',
    },
    selectedSidebarItem: {
        backgroundColor: '#E7F9EC',
    },
    sidebarImage: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginBottom: 5,
    },
    sidebarText: {
        fontSize: RFValue(10),
        textAlign: 'center',
        color: '#666',
        fontWeight: '500',
    },
    selectedSidebarText: {
        color: '#2E7D32',
        fontWeight: 'bold',
    },
    mainContent: {
        flex: 1,
        padding: 20,
    },
    categoryDetails: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
    },
    categoryMainImage: {
        width: 150,
        height: 150,
        borderRadius: 75,
        marginBottom: 20,
    },
    categoryTitle: {
        fontSize: RFValue(24),
        fontFamily: FONTS.heading,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 10,
    },
    categoryDescription: {
        fontSize: RFValue(14),
        color: '#666',
        textAlign: 'center',
        marginBottom: 30,
        paddingHorizontal: 20,
    },
    exploreButton: {
        backgroundColor: '#2E7D32',
        paddingHorizontal: 30,
        paddingVertical: 15,
        borderRadius: 25,
        marginBottom: 15,
    },
    exploreButtonText: {
        color: '#fff',
        fontSize: RFValue(14),
        fontWeight: 'bold',
    },
    fashionButton: {
        backgroundColor: '#FF6B35',
        paddingHorizontal: 30,
        paddingVertical: 15,
        borderRadius: 25,
    },
    fashionButtonText: {
        color: '#fff',
        fontSize: RFValue(14),
        fontWeight: 'bold',
    },
    noSelectionText: {
        fontSize: RFValue(16),
        color: '#666',
        textAlign: 'center',
    },
    errorContainer: {
        padding: 20,
        backgroundColor: '#ffebee',
        margin: 10,
        borderRadius: 10,
    },
    errorText: {
        color: '#c62828',
        fontSize: RFValue(14),
        textAlign: 'center',
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalBackground: {
        flex: 1,
        backgroundColor: 'transparent',
    },
    previewContainer: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 20,
        width: screenWidth * 0.8,
        maxHeight: screenHeight * 0.8,
    },
    previewContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    previewImage: {
        width: 100,
        height: 100,
        borderRadius: 5,
        marginRight: 20,
    },
    previewInfo: {
        flex: 1,
    },
    previewTitle: {
        fontSize: RFValue(18),
        fontFamily: FONTS.heading,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 5,
    },
    previewRating: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 5,
    },
    ratingText: {
        fontSize: RFValue(14),
        color: '#666',
        marginRight: 5,
    },
    reviewsText: {
        fontSize: RFValue(14),
        color: '#666',
    },
    previewPrice: {
        fontSize: RFValue(14),
        color: '#2E7D32',
        fontWeight: 'bold',
        marginBottom: 5,
    },
    previewDescription: {
        fontSize: RFValue(14),
        color: '#666',
    },
    previewButton: {
        backgroundColor: '#2E7D32',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 20,
        alignItems: 'center',
        marginTop: 10,
    },
    previewButtonText: {
        color: '#fff',
        fontSize: RFValue(14),
        fontWeight: 'bold',
    },
})

export default Categories;