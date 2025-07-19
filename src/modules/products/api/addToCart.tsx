import { BASE_URL } from '@store/config';

// Add item to cart
export const AddToCart = async (token, productId, productSizeId, quantity, size) => {
    try {
        const res = await fetch(`${BASE_URL}/cart/add`, {
            method: 'POST',
            headers : {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                productId,
                productSizeId,
                quantity,
                size
            }),
        });

        const data = await res.json();
        return data;
    }catch(error){
        console.error('Error adding to cart: ', error);
        return { success: false, error: error.message };
    }
};