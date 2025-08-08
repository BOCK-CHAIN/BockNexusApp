import axios from 'axios';

const BASE_URL = 'http://10.0.2.2:3000';

// Add item to wishlist
export const addToWishlist = async (token: string, data: {
  productId: number;
  productSizeId?: number;
  quantity: number;
  size?: string;
}) => {
  try {
    const response = await axios.post(`${BASE_URL}/wishlist/add`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    return { success: true, data: response.data };
  } catch (error: any) {
    return { 
      success: false, 
      error: error.response?.data?.message || 'Failed to add to wishlist' 
    };
  }
};

// Get user's wishlist
export const getUserWishlist = async (token: string) => {
  try {
    const response = await axios.get(`${BASE_URL}/wishlist`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return { success: true, data: response.data };
  } catch (error: any) {
    return { 
      success: false, 
      error: error.response?.data?.message || 'Failed to fetch wishlist' 
    };
  }
};

// Update wishlist item quantity
export const updateWishlistItem = async (token: string, wishlistItemId: number, quantity: number) => {
  try {
    const response = await axios.put(`${BASE_URL}/wishlist/${wishlistItemId}`, { quantity }, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    return { success: true, data: response.data };
  } catch (error: any) {
    return { 
      success: false, 
      error: error.response?.data?.message || 'Failed to update wishlist item' 
    };
  }
};

// Remove item from wishlist
export const removeFromWishlist = async (token: string, wishlistItemId: number) => {
  try {
    const response = await axios.delete(`${BASE_URL}/wishlist/${wishlistItemId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return { success: true, data: response.data };
  } catch (error: any) {
    return { 
      success: false, 
      error: error.response?.data?.message || 'Failed to remove from wishlist' 
    };
  }
};

// Clear entire wishlist
export const clearWishlist = async (token: string) => {
  try {
    const response = await axios.delete(`${BASE_URL}/wishlist/clear`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return { success: true, data: response.data };
  } catch (error: any) {
    return { 
      success: false, 
      error: error.response?.data?.message || 'Failed to clear wishlist' 
    };
  }
}; 