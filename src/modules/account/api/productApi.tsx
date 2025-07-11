
// Get Random Products
export const getRandomProduct = async () => {
    try{
        const res = await fetch(`http://10.0.2.2:3000/product/random-products`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        })
        const json = await res.json();

        if(json.success){
            return json.data;
        }else{
            throw new Error(json.message || 'Failed to fetch products')
        }
    }catch(err){
        console.error('Fetching random products error', err);
        throw err;
    }
};

