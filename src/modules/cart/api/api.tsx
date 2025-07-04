import { BASE_URL } from '@store/config';

export interface CartItem {
  id: number;
  productId: number;
  productSizeId: number;
  quantity: number;
  product: {
    id: number;
    name: string;
    price: number;
    image_uri: string;
  };
  productSize: {
    id: number;
    size: string;
  };
}

export interface CartResponse {
  success: boolean;
  data: {
    items: CartItem[];
    total: number;
    itemCount: number;
  };
}

export interface AddToCartData {
  productId: number;
  productSizeId: number;
  quantity: number;
}

export interface UpdateCartData {
  quantity: number;
}

// Add item to cart
export const addToCart = async (token: string, cartData: AddToCartData): Promise<{ success: boolean; message: string; data: CartItem }> => {
  const response = await fetch(`${BASE_URL}/cart/add`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(cartData),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to add item to cart');
  }

  return response.json();
};

// Get user's cart
export const getUserCart = async (token: string): Promise<CartResponse> => {
  const response = await fetch(`${BASE_URL}/cart`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to fetch cart');
  }

  return response.json();
};

// Update cart item quantity
export const updateCartItem = async (token: string, cartItemId: number, updateData: UpdateCartData): Promise<{ success: boolean; message: string; data: CartItem }> => {
  const response = await fetch(`${BASE_URL}/cart/${cartItemId}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updateData),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to update cart item');
  }

  return response.json();
};

// Remove item from cart
export const removeFromCart = async (token: string, cartItemId: number): Promise<{ success: boolean; message: string }> => {
  const response = await fetch(`${BASE_URL}/cart/${cartItemId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to remove item from cart');
  }

  return response.json();
};

// Clear cart
export const clearCart = async (token: string): Promise<{ success: boolean; message: string }> => {
  const response = await fetch(`${BASE_URL}/cart/clear`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to clear cart');
  }

  return response.json();
}; 