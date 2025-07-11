import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, ActivityIndicator, Modal, TextInput} from 'react-native';
import { getUserAddress, editUserAddress, addUserAddress } from './api/addressApi';
import { useSelector } from 'react-redux'
import Toast from 'react-native-toast-message';
import EditAddressModal from './molecules/EditAddressModal';
import AddAddressModal from './molecules/AddAddressModal';

const Addresses = () => {
    const token = useSelector((state) => state.auth.token);
    const userId = useSelector((state) => state.auth.user?.id);
    const [addresses, setAddresses] = useState([]);
    const [selectedAddress, setSelectedAddress] = useState(null);
    const [loading, setLoading] = useState(true);
    const [visible, setVisible] = useState(false);
    const [addVisible, setAddVisible] = useState(false);
    const [nickname, setNickname] = useState('');
    const [line1, setLine1] = useState('');
    const [line2, setLine2] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [zip, setZip] = useState('');
    const [country, setCountry] = useState('');
    const [type, setType] = useState('');
    const [name, setName] = useState('');
    const [isDefault, setIsDefault] = useState(false);

    const fetchAddress = async () => {
        try{
            if (!token || !userId) return;
            const data = await getUserAddress(userId, token);
            setAddresses(data);
        }catch(err){
            console.error('Failed to fetch orders: ', err);
        }finally{
            setLoading(false);
        }
    }

    const handleAdd = async () => {
        if (!token) return;

        const newAddress = {
            nickname,
            line1,
            line2,
            city,
            state,
            zip,
            country,
            isDefault,
            receiverName: name,
            type,
        };

        try{
            const { res, data } = await addUserAddress(newAddress, token);

            if(!res.ok){
                if (res.status === 409){
                    Toast.show({
                        type: 'error',
                        text1: 'Nickname already exists',
                        text2: 'Please choose a different name.',
                        position: 'bottom'
                    });
                    setNickname('');
                }
                return;
            }

            setNickname('');
            setLine1('');
            setLine2('');
            setCity('');
            setState('');
            setZip('');
            setCountry('');
            setType('');
            setName('');
            setIsDefault(false);
            setAddVisible(false);
            fetchAddress();

            Toast.show({
                type: 'success',
                text1: 'Address added',
                text2: 'Your address has been saved successfully!',
                position: 'bottom',
                visibilityTime: 3000,
            });

        }catch(err){
            console.log('Add failed: ', err);
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'Failed to add address. Please try again.',
                position: 'bottom',
                visibilityTime: 3000,
            });
        }
    };

    useEffect(() => {
        fetchAddress();
    }, [token, userId])

    if (loading) {
        return (
            <View style={styles.loaderContainer}>
                <ActivityIndicator size="large" color="#000" />
            </View>
        )
    }

    const handleUpdate = async () => {
        if(!selectedAddress || !selectedAddress.id || !token) return;

        const updatedAddress = {
            nickname,
            line1,
            line2,
            city,
            state,
            zip,
            country,
            isDefault,
            receiverName: name,
            type,
        }

        try{
            await editUserAddress(selectedAddress.id, updatedAddress, token);
            setVisible(false);
            setNickname('');
            setLine1('');
            setLine2('');
            setCity('');
            setState('');
            setZip('');
            setCountry('');
            setType('');
            setName('');
            setIsDefault(false);
            fetchAddress();
            Toast.show({
              type: 'success',
              text1: 'Address updated',
              text2: 'Your address has been saved successfully!',
              position: 'bottom',
              visibilityTime: 3000,
            });
        }catch(err){
            console.log('Update failed: ', err);
        }
    }

    return(
        <>
            <View style={styles.header}>
                <View>
                    <Text style={ styles.heading }> Your addresses: </Text>
                </View>
                <View style={{ marginTop: 10, marginBottom: 8 }}>
                    <TouchableOpacity
                        style={{ flexDirection: 'row', borderWidth: 1, marginHorizontal: 15, borderRadius: 4, justifyContent: 'space-between', alignItems: 'center' }}
                        onPress={() => {
                            setAddVisible(true);
                            setType('');
                            setIsDefault(null);
                        }}
                    >
                        <Text style={{ marginLeft: 15, fontSize: 18, paddingVertical: 8 }}> +     Add address </Text>
                        <Image
                            source ={require('../../assets/images/arrow.png')}
                            style={{ width: 20, height: 20, marginRight: 16 }}
                        />
                    </TouchableOpacity>

                    <AddAddressModal
                        visible={addVisible}
                        setVisible={setAddVisible}
                        nickname={nickname}
                        setNickname={setNickname}
                        line1={line1}
                        setLine1={setLine1}
                        line2={line2}
                        setLine2={setLine2}
                        city={city}
                        setCity={setCity}
                        state={state}
                        setState={setState}
                        zip={zip}
                        setZip={setZip}
                        country={country}
                        setCountry={setCountry}
                        type={type}
                        setType={setType}
                        isDefault={isDefault}
                        setIsDefault={setIsDefault}
                        name={name}
                        setName={setName}
                        handleAdd={handleAdd}
                        styles={styles}
                    />
                </View>
            </View>

            <ScrollView contentContainerStyle={{ flexGrow: 1 }} style={{ backgroundColor: '#e8e8e8' }}>
                {addresses.length === 0 ? (
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={{ fontSize: 20, fontWeight: 500 }}> You have no addresses yet! </Text>
                    </View>
                )  : (
                    addresses.map((address) => (
                        <View key={address.id} style={styles.shadowBox}>
                            <View style={styles.boxContent}>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    {address.isDefault && (
                                        <Image
                                            source = {require('../../assets/images/defaultAddress.png')}
                                            style={{ width: 25, height: 25 }}
                                        />
                                    )}
                                    <Text style={{ fontSize: 22, fontWeight: 400 }}> {address.nickname} </Text>
                                    <Image
                                        source = {
                                            address.type === 'Home'
                                            ? require('../../assets/images/home.png')
                                            : address.type === 'Office'
                                            ? require('../../assets/images/office.png')
                                            : require('../../assets/images/location.png')
                                        }
                                        style={{ width: 25, height: 25 }}
                                    />
                                </View>
                                <View style={{ marginTop: 10 }}>
                                    <Text style={[styles.info, { fontSize:18 }]}> {address.receiverName} </Text>
                                    <Text style={styles.info}> {address.line1}, </Text>
                                    {address.line2 && (
                                        <Text style={styles.info}> {address.line2}, </Text>
                                    )}
                                    <Text style={styles.info}> {address.city}, {address.state} </Text>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                        <Text style={styles.info}> {address.zip} </Text>
                                        <TouchableOpacity onPress={() => {
                                          setSelectedAddress(address);
                                          setNickname(address.nickname);
                                          setLine1(address.line1);
                                          setLine2(address.line2 || '');
                                          setCity(address.city);
                                          setState(address.state);
                                          setZip(address.zip);
                                          setCountry(address.country);
                                          setType(address.type);
                                          setIsDefault(address.isDefault);
                                          setName(address.receiverName);
                                          setVisible(true);
                                        }}>
                                            <Text style={{ fontSize: 30 }}> ... </Text>
                                        </TouchableOpacity>

                                        <EditAddressModal
                                            visible={visible}
                                            setVisible={setVisible}
                                            selectedAddress={selectedAddress}
                                            nickname={nickname}
                                            setNickname={setNickname}
                                            line1={line1}
                                            setLine1={setLine1}
                                            line2={line2}
                                            setLine2={setLine2}
                                            city={city}
                                            setCity={setCity}
                                            state={state}
                                            setState={setState}
                                            zip={zip}
                                            setZip={setZip}
                                            country={country}
                                            setCountry={setCountry}
                                            type={type}
                                            setType={setType}
                                            isDefault={isDefault}
                                            setIsDefault={setIsDefault}
                                            name={name}
                                            setName={setName}
                                            handleUpdate={handleUpdate}
                                            styles={styles}
                                        />
                                    </View>
                                </View>
                            </View>
                        </View>
                    ))
                )}
            <View style={{ height: 10, width: '100%' }}></View>
            </ScrollView>
        </>
    )
}

const styles = StyleSheet.create({
    heading: {
        marginLeft: 10,
        marginTop: 10,
        fontSize: 24,
        fontWeight: 700,
        fontFamily: 'Tinos-Bold',
        color: '#212121',
    },
    shadowBox: {
        backgroundColor: '#fff',
        borderRadius: 10,
        marginHorizontal: 12,
        marginTop: 10,
        // Android shadow
        elevation: 5,
        // iOS shadow
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },
    boxContent: {
        padding: 10,
        borderRadius: 10,
        overflow: 'hidden',
    },
    info: {
        fontSize: 16,
    },
    header: {
        borderBottomWidth: 2,
        borderColor: '#914294',
        backgroundColor: 'white',
    },
    loaderContainer: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center'
    },
    modalBox: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)'
    },
    modalContainer: {
        height: '82%',
        width: '80%',
        backgroundColor: 'white',
        borderWidth: 3,
        borderColor: '#914294',
        borderRadius: 5,
    },
    input: {
        width: '85%',
        borderWidth: 1,
        borderRadius: 3,
    },
    inputBox: {
        paddingLeft: 10,
        paddingTop: 10,
    },
    inputHeading: {
        fontSize: 17,
        fontWeight: 500
    },
    pill: {
        borderWidth: 1,
        borderRadius: 999,
        width: '30%',
        paddingVertical: 6,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-evenly'
    },
    selectedPill: {
        backgroundColor: '#914294',
        borderColor: '#914294',
    },
    unselectedPill: {
        backgroundColor: '#fff',
        borderColor: '#999',
    },
    updateBox: {
        position: 'relative',
        bottom: 6,
        alignSelf: 'center',
        borderColor: '#914294',
        borderWidth: 2,
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 8,
    }
});

export default Addresses;