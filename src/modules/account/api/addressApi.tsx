
//Add User's Address
export const addUserAddress = async (addedData: object, token) => {
    try{
        const res = await fetch('http://10.0.2.2:3000/address', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(addedData)
        });

        const data = await res.json();

        return { res, data };

    }catch(err){
        console.error('Failed to add address: ', err);
        throw err;
    }
}

//Edit User's Addresses
export const editUserAddress = async (id: string, updatedData: object, token) => {
    try{
        const res = await fetch(`http://10.0.2.2:3000/address/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({id : parseInt(id), ...updatedData})
        });

        if(!res.ok){
            throw new Error('Failed to update addresses');
        }

    }catch(err){
        console.error('Failed to edit address: ', err);
        throw err;
    }
};

// Get User's Addresses
export const getUserAddress = async (id: string, token) => {
    try{
        const res = await fetch(`http://10.0.2.2:3000/address/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        if(!res.ok){
            throw new Error('Failed to fetch addresses');
        }

        const result = await res.json();
        return result.addresses;

    }catch(err){
        console.error("Failed to fetch addresses: ", err);
        return [];
    }
};