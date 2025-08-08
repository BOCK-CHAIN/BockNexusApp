
// Add a product review
export const addReview = async (reviewData, token) => {
    try{
        const res = await fetch('http://10.0.2.2:3000/review', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(reviewData)
        })
        const data = await res.json();
        return {
            ok: res.ok,
            data,
        };
    }catch(error){
        console.log('API error:', error);
        return { ok: false, error };
    }
}