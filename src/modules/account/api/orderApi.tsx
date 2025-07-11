import { BASE_URL } from '@store/config';

// Get User's Orders
export const getUserOrders = async (token) => {
    try{
        const response = await fetch(`${BASE_URL}/orders/my-orders`,{
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
            }
        });

        if(!response.ok){
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to fetch orders');
        }

        const data = await response.json();
        return data.orders;
    }catch(err){
        console.error('Fetch orders error: ', err);
        throw err;
    }
};
