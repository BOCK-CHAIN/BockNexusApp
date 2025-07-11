import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Alert, StyleSheet, TextInput, Image } from 'react-native';
import { useSelector } from 'react-redux'
import { deleteUser } from '../api/userApi'
import { logout } from '../api/slice';
import { useAppDispatch } from '@store/reduxHook'
import AccountNavigator from '../navigators/accountNavigator';
import { useNavigation } from '@react-navigation/native'

const DeleteAccount = () => {
    const token = useSelector((state) => state.auth.token);
    const [password, setPassword] = useState('');
    const dispatch = useAppDispatch();
    const navigation = useNavigation();
    const [isPasswordVisible, setIsPasswordVisible] = useState(true);

    const handleDelete = async() => {

        if(!token || !password){
            Alert.alert('Please enter your password.')
            return;
        };

        try{
            const data = await deleteUser(token, password);
            if (data.success) {
                console.log('User deleted');
                dispatch(logout());
                Alert.alert('Success', 'Account deleted successfully!');
                navigation.reset({
                    index: 0,
                    routes: [{ name: 'Account Home' }]
                })
            } else {
                console.warn('Delete failed:', data.message || data.error);
                Alert.alert('Wrong password', 'Enter the correct password to delete');
            }
        }catch(err){
            console.log('Delete failed: ', err);
        }
    }

    return (
        <>
            <View style={styles.container}>
                <Text style={styles.heading}> Are you sure you want to {'\n'} delete your account? </Text>
                <Text style={styles.info}>
                    This action is<Text style={styles.info, styles.danger}> permanent </Text>
                    and cannot be undone. All of your data - including orders, reviews, saved addresses, wishlist items,
                    and transaction history - will be permanently erased.
                </Text>
                <Text style={styles.info}>
                    Once deleted, all of the information related with your account will be
                    <Text style={styles.info, styles.danger}> lost forever</Text>,
                    and you will not be able to recover it after deletion.
                </Text>
            </View>
            <View style={styles.shadowBox}>
                <View style={styles.boxContent}>
                    <Text style={[styles.info, { fontSize: 22 }]}>
                        Please proceed with <Text style={styles.info, styles.danger}>caution</Text>.
                    </Text>
                    <Text style={[styles.info, { fontSize: 16 }]}>
                        Enter current password
                    </Text>
                    <View style={styles.input}>
                        <TextInput
                            value={password}
                            placeholder={'Enter'}
                            onChangeText={setPassword}
                            secureTextEntry={isPasswordVisible}
                            style={{ flex: 1, paddingVertical: 10, height: 40 }}
                        />
                        <TouchableOpacity
                            onPress={() => setIsPasswordVisible(prev => !prev)}
                        >
                        <Image
                            source={
                                isPasswordVisible ?
                                require('../../../assets/images/notvisible.jpg') :
                                require('../../../assets/images/visible.jpg')
                            }
                            style={{ height: 12, width: 24, marginRight: 5 }}
                        />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity
                            style={styles.button}
                            onPress={handleDelete}
                        >
                            <Text style={styles.buttonText}> Delete </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </>
    )
};

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 16,
        paddingTop: 25,
        marginBottom: 25
    },
    heading: {
        marginBottom: 15,
        fontSize: 26,
        fontWeight: '600'
    },
    info: {
        fontSize: 16,
        lineHeight: 24,
        marginBottom: 10,
        color: '#111827',
        marginLeft: 7
    },
    danger: {
        color: '#B91C1C',
        fontWeight: 500
    },
    shadowBox: {
        backgroundColor: '#fff',
        marginHorizontal: 20,
        padding: 12,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: '#B91C1C',
        elevation: 10,
    },
    boxContent: {
        padding: 5,
        borderRadius: 10,
    },
    input: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderWidth: 2,
        borderRadius: 5,
        marginTop: -10,
        marginLeft: 7,
        width: '65%'
    },
    buttonContainer: {
        justifyContent: 'center',
        alignItems: 'flex-start',
        marginTop: 10,
        marginLeft: 7,
    },
    button: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 3,
        borderWidth: 1,
        borderRadius: 5,
        borderColor: '#B91C1C',
        backgroundColor: 'rgba(185, 28, 28, 0.15)',
    },
    buttonText: {
        padding: 10,
        fontSize: 16,
        fontWeight: 600,
    },
});

export default DeleteAccount;