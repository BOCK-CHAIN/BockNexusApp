import React, { FC, useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  Modal,
  FlatList,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { FONTS } from '@utils/Constants';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { BASE_URL } from '@store/config';
import { useAppSelector } from '@store/reduxHook';
import { addToCart } from '@modules/cart/api/api';
import { navigate } from '@navigation/NavigationUtil';

const { width: screenWidth } = Dimensions.get('window');

type ProductDetailRouteProp = RouteProp<{
  ProductDetail: {
    productId: number;
  };
}, 'ProductDetail'>;

interface Review {
  id: number;
  rating: number;
  comment: string;
  user: {
    phone: string;
  };
  createdAt: string;
}

interface ProductSize {
  id: number;
  size: string;
  stock: number;
}

interface Product {
  id: number;
  name: string;
  image_uri: string;
  price: number;
  description: string;
  productSizes: ProductSize[];
  reviews: Review[];
}

// Move mockProduct outside the component to avoid useCallback dependency warning
const mockProduct: Product = {
  id: 1,
  name: 'Premium Cotton T-Shirt',
  image_uri: 'https://m.media-amazon.com/images/I/51xOEh5DKYL._SY879_.jpg',
  price: 299,
  description: 'Experience ultimate comfort with our premium cotton t-shirt. Made from 100% organic cotton, this versatile piece features a relaxed fit and breathable fabric that\'s perfect for any occasion. The classic design ensures it pairs effortlessly with jeans, shorts, or layered under jackets.',
  productSizes: [
    { id: 1, size: 'XS', stock: 5 },
    { id: 2, size: 'S', stock: 10 },
    { id: 3, size: 'M', stock: 15 },
    { id: 4, size: 'L', stock: 8 },
    { id: 5, size: 'XL', stock: 3 },
    { id: 6, size: 'XXL', stock: 2 },
  ],
  reviews: [
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
  ],
};

const ProductDetail: FC = () => {
  const route = useRoute<ProductDetailRouteProp>();
  const navigation = useNavigation();
  const { productId } = route.params;
  const { token, isAuthenticated } = useAppSelector((state) => state.auth);

  const [product, setProduct] = useState<Product>({
    id: 0,
    name: '',
    image_uri: '',
    price: 0,
    description: '',
    productSizes: [],
    reviews: [],
  });
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState<ProductSize | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [showSizeChart, setShowSizeChart] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [addingToCart, setAddingToCart] = useState(false);

  const additionalImages = [
    'https://m.media-amazon.com/images/I/51xOEh5DKYL._SY879_.jpg',
    'https://m.media-amazon.com/images/I/51xDbF+9xiL._SY879_.jpg',
    'https://m.media-amazon.com/images/I/81gCXEX+dmL._SY879_.jpg'
  ];

  const sizeChart = {
    XS: { chest: '32-34', length: '26', sleeve: '7' },
    S: { chest: '34-36', length: '27', sleeve: '7.5' },
    M: { chest: '36-38', length: '28', sleeve: '8' },
    L: { chest: '38-40', length: '29', sleeve: '8.5' },
    XL: { chest: '40-42', length: '30', sleeve: '9' },
    XXL: { chest: '42-44', length: '31', sleeve: '9.5' },
  };

  const fetchProductDetails = useCallback(async () => {
    try {
      setLoading(true);
      
      // For Fashion category (productId 1), use mock data immediately
      if (productId === 1) {
        setProduct(mockProduct);
        console.log('Using mock product data for Fashion category');
        setLoading(false);
        return;
      }
      
      // For other products, try to fetch from the database via local backend with 60-second timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 60000); // 60 seconds timeout
      
      const response = await fetch(`${BASE_URL}/products/${productId}`, {
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const productData = await response.json();
      
      if (productData && productData.id) {
        // Successfully fetched from database
        setProduct(productData);
        console.log('Product loaded from database:', productData);
      } else {
        throw new Error('Invalid product data received from server');
      }
      
    } catch (error) {
      console.log('Database fetch failed or timed out, using mock data:', error);
      
      // Fallback to mock data if database fetch fails or times out
      setProduct(mockProduct);
      console.log('Using mock product data');
      
    } finally {
      setLoading(false);
    }
  }, [productId]);

  useEffect(() => {
    fetchProductDetails();
  }, [fetchProductDetails]);

  const handleAddToCart = async () => {
    if (!selectedSize) {
      Alert.alert('Select Size', 'Please select a size before adding to cart');
      return;
    }

    if (selectedSize.stock < quantity) {
      Alert.alert('Out of Stock', 'Not enough stock available');
      return;
    }

    if (!isAuthenticated || !token) {
      Alert.alert(
        'Login Required',
        'Please login to add items to your cart',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Login', onPress: () => navigate('Account') }
        ]
      );
      return;
    }

    try {
      setAddingToCart(true);
      
      // Use authenticated cart API
      const result = await addToCart(token, {
        productId: product.id,
        productSizeId: selectedSize.id,
        quantity: quantity,
      });

      console.log('Added to cart via API:', result);
      
      Alert.alert(
        'Added to Cart',
        `${product?.name} (Size: ${selectedSize.size}) has been added to your cart!`,
        [{ text: 'OK' }]
      );
      
    } catch (error) {
      console.log('API call failed, using mock functionality:', error);
      
      // Fallback to mock functionality if API fails
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      Alert.alert(
        'Added to Cart (Mock)',
        `${product?.name} (Size: ${selectedSize.size}) has been added to your cart!`,
        [{ text: 'OK' }]
      );
    } finally {
      setAddingToCart(false);
    }
  };

  const handleBuyNow = () => {
    if (!selectedSize) {
      Alert.alert('Select Size', 'Please select a size before proceeding');
      return;
    }
    
    Alert.alert('Buy Now', 'This feature will be implemented soon!');
  };

  const renderSizeButton = (size: ProductSize) => (
    <TouchableOpacity
      key={size.id}
      style={[
        styles.sizeButton,
        selectedSize?.id === size.id && styles.selectedSizeButton,
        size.stock === 0 && styles.outOfStockButton
      ]}
      onPress={() => size.stock > 0 && setSelectedSize(size)}
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

  if (loading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color="#2E7D32" />
        <Text style={styles.loadingText}>Loading product details...</Text>
      </View>
    );
  }

  if (!product) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <Text style={styles.errorText}>Product not found</Text>
      </View>
    );
  }

  const averageRating = product.reviews.length > 0 
    ? product.reviews.reduce((sum, review) => sum + review.rating, 0) / product.reviews.length 
    : 0;

  return (
    <View style={styles.container}>
      <SafeAreaView />
      
      {/* Header */}
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
            {additionalImages.map((image, index) => (
              <Image key={index} source={{ uri: image }} style={styles.productImage} />
            ))}
          </ScrollView>
          
          {/* Image Indicator */}
          <View style={styles.imageIndicator}>
            {additionalImages.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.indicatorDot,
                  currentImageIndex === index && styles.activeDot
                ]}
              />
            ))}
          </View>
        </View>

        {/* Product Info */}
        <View style={styles.productInfo}>
          <Text style={styles.productName}>{product.name}</Text>
          <Text style={styles.productPrice}>₹{product.price.toFixed(2)}</Text>
          
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
              {averageRating.toFixed(1)} ({product.reviews.length} reviews)
            </Text>
          </View>

          {/* Description */}
          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.productDescription}>{product.description}</Text>

          {/* Size Selection */}
          <View style={styles.sizeSection}>
            <View style={styles.sizeSectionHeader}>
              <Text style={styles.sectionTitle}>Size</Text>
              <TouchableOpacity onPress={() => setShowSizeChart(true)}>
                <Text style={styles.sizeChartLink}>Size Chart</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.sizeGrid}>
              {product.productSizes.map(renderSizeButton)}
            </View>
          </View>

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
                onPress={() => setQuantity(quantity + 1)}
              >
                <Icon name="add" size={20} color="#333" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Reviews Section */}
          <View style={styles.reviewsSection}>
            <Text style={styles.sectionTitle}>Reviews ({product.reviews.length})</Text>
            <FlatList
              data={product.reviews}
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
          onPress={handleAddToCart}
          disabled={addingToCart}
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
          onPress={handleBuyNow}
        >
          <Icon name="flash-on" size={20} color="#fff" />
          <Text style={styles.actionButtonText}>Buy Now</Text>
        </TouchableOpacity>
      </View>

      {renderSizeChart()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  loadingText: {
    marginTop: 10,
    fontSize: RFValue(14),
    color: '#666',
  },
  errorText: {
    fontSize: RFValue(16),
    color: '#c62828',
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
    fontSize: RFValue(18),
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
    padding: 20,
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
  },
  sizeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  sizeButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
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
    fontSize: RFValue(14),
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
});

export default ProductDetail;