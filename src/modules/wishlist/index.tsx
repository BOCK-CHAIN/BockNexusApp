import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import React, { useEffect, useState } from 'react';
import CustomSafeAreaView from '@components/atoms/CustomSafeAreaView';
import { RFValue } from 'react-native-responsive-fontsize';
import { Colors } from '@utils/Constants';
import { useAppSelector } from '@store/reduxHook';
import { getUserWishlist, removeFromWishlist, clearWishlist, updateWishlistItem, addToWishlist } from './api/api'; 
import { useFocusEffect } from '@react-navigation/native';
import { navigate } from '@navigation/NavigationUtil';
import Icon from 'react-native-vector-icons/MaterialIcons';
import DropDownPicker from 'react-native-dropdown-picker';

interface WishlistItem {
  id: number;
  userId: number;
  productId: number;
  productSizeId?: number;
  quantity: number;
  size?: string;
  createdAt: string;
  updatedAt: string;
  product: {
    id: number;
    name: string;
    image_uri: string;
    price: number;
    description?: string;
    productSizes?: {
      id: number;
      size: string;
      stock: number;
    }[];
  };
  productSize?: {
    id: number;
    size: string;
    stock: number;
  };
}

// Separate component for wishlist item
const WishlistItemComponent = ({ item, onRemove }: { item: WishlistItem; onRemove: (id: number) => void }) => {
  const token = useAppSelector(state => state.auth.token);
  const [quantity, setQuantity] = useState(item.quantity);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [selectedSize, setSelectedSize] = useState<string | null>(item.size ?? null);
  const [sizeItems, setSizeItems] = useState(
    (item.product.productSizes || []).map(sizeObj => ({
      label: sizeObj.size,
      value: sizeObj.size,
      id: sizeObj.id
    }))
  );

  // Quantity update
  const handleQuantityChange = async (delta: number) => {
    if (!token) return;
    const newQuantity = quantity + delta;
    if (newQuantity < 1) return;
    setLoading(true);
    try {
      const res = await updateWishlistItem(token, item.id, newQuantity);
      if (res.success) {
        setQuantity(newQuantity);
      }
    } finally {
      setLoading(false);
    }
  };

  // Size update (remove and re-add)
  const handleSizeChange = async (newSize: string | null) => {
    if (!token || !newSize) return;
    setLoading(true);
    try {
      // Remove old item
      await removeFromWishlist(token, item.id);
      // Find productSizeId for new size
      const sizeObj = (item.product.productSizes || []).find(s => s.size === newSize);
      await addToWishlist(token, {
        productId: item.productId,
        productSizeId: sizeObj?.id,
        quantity,
        size: newSize
      });
      setSelectedSize(newSize);
    } finally {
      setLoading(false);
    }
  };

  if (!item || !item.product || !item.product.name) {
    return null;
  }

  return (
    <View style={styles.item}>
      <Image 
        source={{ uri: item.product.image_uri }} 
        style={styles.image}
      />
      <View style={styles.itemInfo}>
        <Text style={styles.name} numberOfLines={2}>{item.product.name || 'Unknown Product'}</Text>
        <Text style={styles.price}>₹{(item.product.price || 0).toFixed(2)}</Text>
        <View style={styles.itemDetails}>
          {/* Size Picker */}
          {item.product.productSizes && item.product.productSizes.length > 1 && (
            <View style={{ flex: 1, marginRight: 8 }}>
              <DropDownPicker
                open={open}
                value={selectedSize}
                items={sizeItems}
                setOpen={setOpen}
                setValue={setSelectedSize}
                setItems={setSizeItems}
                onChangeValue={handleSizeChange}
                style={{ minHeight: 32, borderColor: '#ccc', borderRadius: 5, backgroundColor: '#fff' }}
                dropDownContainerStyle={{ borderColor: '#ccc', borderRadius: 5, backgroundColor: '#fff' }}
                textStyle={{ fontSize: 12 }}
                placeholder="Select size"
                disabled={loading}
              />
            </View>
          )}
          {/* Quantity Controls */}
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <TouchableOpacity onPress={() => handleQuantityChange(-1)} disabled={loading || quantity <= 1}>
              <Icon name="remove" size={20} color={loading || quantity <= 1 ? '#ccc' : '#333'} />
            </TouchableOpacity>
            <Text style={styles.quantity}>{quantity}</Text>
            <TouchableOpacity onPress={() => handleQuantityChange(1)} disabled={loading}>
              <Icon name="add" size={20} color={loading ? '#ccc' : '#333'} />
            </TouchableOpacity>
            {loading && <ActivityIndicator size="small" color="#7B1FA2" style={{ marginLeft: 8 }} />}
          </View>
        </View>
      </View>
      <TouchableOpacity 
        style={styles.removeButton}
        onPress={() => onRemove(item.id)}
        disabled={loading}
      >
        <Icon name="delete" size={20} color="#FF4444" />
      </TouchableOpacity>
    </View>
  );
};

const Wishlist = () => {
  const { user, isAuthenticated, token } = useAppSelector(state => state.auth);
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(false);
  
  const fetchWishlist = async () => {
    if (!token) return;
    try {
      setLoading(true);
      const res = await getUserWishlist(token);
      if (res.success) {
        // Handle different possible data structures
        let items = [];
        if (res.data?.data) {
          items = res.data.data;
        } else if (res.data) {
          items = Array.isArray(res.data) ? res.data : [];
        }
        setWishlistItems(items);
      } else {
        setWishlistItems([]);
      }
    } catch (err) {
      setWishlistItems([]);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveItem = async (wishlistItemId: number) => {
    if (!token) return;
    
    Alert.alert(
      'Remove Item',
      'Are you sure you want to remove this item from your wishlist?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: async () => {
            try {
              const res = await removeFromWishlist(token, wishlistItemId);
              if (res.success) {
                fetchWishlist(); // Refresh the list
                Alert.alert('Success', 'Item removed from wishlist');
              } else {
                Alert.alert('Error', res.error || 'Failed to remove item');
              }
            } catch (err) {
              console.error(err);
              Alert.alert('Error', 'Something went wrong');
            }
          },
        },
      ]
    );
  };

  const handleClearWishlist = async () => {
    if (!token) return;
    
    Alert.alert(
      'Clear Wishlist',
      'Are you sure you want to clear your entire wishlist? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear All',
          style: 'destructive',
          onPress: async () => {
            try {
              const res = await clearWishlist(token);
              if (res.success) {
                setWishlistItems([]);
                Alert.alert('Success', 'Wishlist cleared');
              } else {
                Alert.alert('Error', res.error || 'Failed to clear wishlist');
              }
            } catch (err) {
              console.error(err);
              Alert.alert('Error', 'Something went wrong');
            }
          },
        },
      ]
    );
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchWishlist();
    }, [token])
  );

  const renderItem = ({ item }: { item: WishlistItem }) => {
    return <WishlistItemComponent item={item} onRemove={handleRemoveItem} />;
  };

  return (
    <CustomSafeAreaView>
      <View style={styles.container}>
        <View style={styles.headerRow}>
          <Text style={styles.heading}>My Wishlist</Text>
          {wishlistItems.length > 0 && (
            <TouchableOpacity onPress={handleClearWishlist} style={styles.clearButton}>
              <Text style={styles.clearButtonText}>Clear All</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {loading ? (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color={Colors.active} />
        </View>
      ) : wishlistItems.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Icon name="heart-outline" size={100} color="#ccc" />
          <Text style={styles.emptyText}>No items in your wishlist yet.</Text>
        </View>
      ) : (
        <FlatList
          data={wishlistItems}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}
    </CustomSafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderBottomWidth: 5,
    borderColor: '#F0F2F5',
    backgroundColor: '#fff',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  heading: {
    fontSize: RFValue(18),
    fontWeight: '600',
    color: '#000',
  },
  clearButton: {
    backgroundColor: '#7B1FA2',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  clearButtonText: {
    color: '#fff',
    fontSize: RFValue(12),
    fontWeight: '500',
  },
  item: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#fff',
    marginVertical: 8,
    marginHorizontal: 12,
    borderRadius: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  image: {
    width: 90,
    height: 90,
    borderRadius: 8,
    marginRight: 12,
    backgroundColor: '#f5f5f5',
  },
  itemInfo: {
    flex: 1,
    justifyContent: 'space-between',
  },
  itemDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  name: {
    fontSize: RFValue(16),
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
    lineHeight: 20,
  },
  price: {
    fontSize: RFValue(18),
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 4,
  },
  quantity: {
    fontSize: RFValue(12),
    color: '#666',
    fontWeight: '500',
  },
  size: {
    fontSize: RFValue(12),
    color: '#666',
    fontWeight: '500',
  },
  removeButton: {
    padding: 12,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff5f5',
    borderRadius: 8,
    marginLeft: 8,
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 60,
  },
  emptyText: {
    fontSize: RFValue(14),
    color: '#666',
    marginTop: 10,
  },
  loadingOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Wishlist;
