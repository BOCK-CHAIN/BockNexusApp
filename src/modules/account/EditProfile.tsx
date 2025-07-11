import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { updateUserProfile, changePassword } from './api/userApi';
import { updateUser } from './api/slice'

const EditProfile = () => {
    const user = useSelector((state) => state.auth.user);
    const token = useSelector((state) => state.auth.token);
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const dispatch = useDispatch();

    useEffect(() => {
        if (user) {
          setUsername(user.username);
          setEmail(user.email);
          setPhone(user.phone || '');
        }
    }, [user]);

    const handleUpdateUsername = async () => {
        try {
            await updateUserProfile(token, { username });
            dispatch(updateUser({ ...user, username }));
            Alert.alert('Success', 'Username updated');
        }catch(err){
            Alert.alert('Error', err.message || 'Failed to update username');
        }
    };

    const handleUpdateEmail = async () => {
        try {
            await updateUserProfile(token, { email });
            dispatch(updateUser({ ...user, email }));
            Alert.alert('Success', 'Email updated.');
        }catch(err){
            Alert.alert('Error', err.message || 'Failed to update email.');
        }
    };

    const handleUpdateNumber = async () => {
        try{
            await updateUserProfile(token, { phone });
            dispatch(updateUser({ ...user, phone }));
            Alert.alert('Success', 'Phone number updated.');

        }catch(err){
            Alert.alert('Error', err.message || 'Failed to update number.');
        }
    };

    const handleUpdatePassword = async () => {
        try{
            await changePassword(token, oldPassword, newPassword);
            Alert.alert('Success', 'Password changed.');
            setNewPassword('');
            setOldPassword('');
        }catch(err){
            Alert.alert('Error', err.message || 'Failed to update password.');
        }
    };

    return(
        <>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <View style={styles.shadowBox}>
                    <View style={styles.boxContent}>
                        <Text style={styles.heading}> Edit details: </Text>
                        <View style={styles.individual}>
                            <View style={styles.inputs}>
                                <TextInput
                                style={styles.input}
                                value = {username}
                                placeholder='Username'
                                onChangeText = {setUsername}
                                />
                                <TouchableOpacity style={styles.button} onPress={handleUpdateUsername}>
                                    <Text style={styles.buttonText}> UPDATE </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View style={styles.individual}>
                            <View style={styles.inputs}>
                                <TextInput
                                    style={styles.input}
                                    value = {email}
                                    placeholder='Email'
                                    onChangeText = {setEmail}
                                />
                                <TouchableOpacity style={styles.button} onPress={handleUpdateEmail}>
                                    <Text style={styles.buttonText}> UPDATE </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View style={styles.individual}>
                            <View style={styles.inputs}>
                                <TextInput
                                    style={styles.input}
                                    value = {phone}
                                    placeholder='Phone Number'
                                    onChangeText = {setPhone}
                                />
                                <TouchableOpacity style={styles.button} onPress={handleUpdateNumber}>
                                    <Text style={styles.buttonText}> UPDATE </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </View>

                <View style={styles.shadowBox}>
                    <View style={styles.boxContent}>
                        <Text style={styles.heading}> Change Password: </Text>
                        <View style={styles.individual}>
                            <TextInput
                                style={styles.input}
                                placeholder='Old Password'
                                secureTextEntry
                                value={oldPassword}
                                onChangeText = {setOldPassword}
                            />
                        </View>
                        <View style={styles.individual}>
                            <TextInput
                                style={styles.input}
                                secureTextEntry
                                placeholder='New Password'
                                value = {newPassword}
                                onChangeText = {setNewPassword}
                            />
                        </View>
                        <View style={{ paddingLeft: 10, paddingTop: 16, width: '35%' }}>
                            <TouchableOpacity style={styles.button} onPress={handleUpdatePassword}>
                                <Text style={styles.buttonText}> UPDATE </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </>
    );
};

const styles = StyleSheet.create({
    scrollContainer: {
        paddingBottom: 50,
    },
    shadowBox: {
        backgroundColor: '#fff',
        borderRadius: 10,
        marginHorizontal: 14,
        marginTop: 15,
        marginBottom: 10,
        borderWidth: 2,
        borderColor: '#914294',
        // Android shadow
        elevation: 5,
        // iOS shadow
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },
    boxContent: {
        padding: 15,
        borderRadius: 10,
        overflow: 'hidden',
    },
    heading: {
      fontSize: 25,
      fontWeight: 700
    },
    inputs: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%'
    },
    individual: {
        marginLeft: 10,
        marginTop: 15,
        width: '85%'
    },
    input: {
        width: '80%',
        marginRight: 15,
        fontSize: 20,
        borderWidth: 1,
        borderRadius: 5,
        borderColor: '#914294'
    },
    button: {
        backgroundColor: '#5783db',
        borderRadius: 5,
    },
    buttonText: {
        paddingLeft: 10,
        paddingRight: 10,
        paddingTop: 8,
        paddingBottom: 8,
        textAlign: 'center',
        fontSize: 14,
    }
});

export default EditProfile;