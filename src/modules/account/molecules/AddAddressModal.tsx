import React from 'react';
import { View, Text, TouchableOpacity, Image, TextInput, Modal, StyleSheet } from 'react-native';

const AddAddressModal = ({
  visible,
  setVisible,
  nickname,
  setNickname,
  line1,
  setLine1,
  line2,
  setLine2,
  city,
  setCity,
  state,
  setState,
  zip,
  setZip,
  country,
  setCountry,
  type,
  setType,
  isDefault,
  setIsDefault,
  handleAdd,
  styles
}) => {
    return(
        <Modal visible={visible} transparent={true}>
            <View style={styles.modalBox}>
                <View style={styles.modalContainer}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Text style={styles.heading}> Add new address: </Text>
                        <TouchableOpacity onPress={() => setVisible(false)} style={{ paddingRight: 10 }}>
                            <Image source={require('../../../assets/images/cross.png')} style={{ height: 25, width: 25 }} />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.inputBox}>
                        <Text style={styles.inputHeading}> Nickname: </Text>
                        <TextInput placeholder='Enter Nickname' onChangeText={setNickname} value={nickname} style={styles.input} />
                    </View>

                    <View style={styles.inputBox}>
                        <Text style={styles.inputHeading}> Line 1: </Text>
                        <TextInput placeholder='Enter Line 1' onChangeText={setLine1} value={line1} style={styles.input} />
                    </View>

                    <View style={styles.inputBox}>
                        <Text style={styles.inputHeading}> Line 2: </Text>
                        <TextInput placeholder='Enter Line 2' onChangeText={setLine2} value={line2} style={styles.input} />
                    </View>

                    <View style={{ flexDirection: 'row' }}>
                        <View style={[styles.inputBox, { flex: 1 }]}>
                            <Text style={styles.inputHeading}> City: </Text>
                            <TextInput placeholder='Enter City' onChangeText={setCity} value={city} style={styles.input} />
                        </View>
                        <View style={[styles.inputBox, { flex: 1 }]}>
                            <Text style={styles.inputHeading}> State: </Text>
                            <TextInput placeholder='Enter State' onChangeText={setState} value={state} style={styles.input} />
                        </View>
                    </View>

                    <View style={{ flexDirection: 'row' }}>
                        <View style={[styles.inputBox, { flex: 1 }]}>
                            <Text style={styles.inputHeading}> Zip: </Text>
                            <TextInput placeholder='Enter Zip' onChangeText={setZip} value={zip} style={styles.input} />
                        </View>
                        <View style={[styles.inputBox, { flex: 1 }]}>
                            <Text style={styles.inputHeading}> Country: </Text>
                            <TextInput placeholder='Enter Country' onChangeText={setCountry} value={country} style={styles.input} />
                        </View>
                    </View>

                    <Text style={[styles.inputHeading, { paddingLeft: 10, paddingTop: 10 }]}> Type of address: </Text>
                    <View style={{ flex: 1 }}>
                        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' }}>
                            <TouchableOpacity
                                style={[styles.pill, type === 'Home' ? styles.selectedPill : styles.unselectedPill]}
                                onPress={() => setType('Home')}
                            >
                                <Image source={require('../../../assets/images/home.png')} style={{ width: 25, height: 25 }} />
                                <Text> Home </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.pill, type === 'Office' ? styles.selectedPill : styles.unselectedPill]}
                                onPress={() => setType('Office')}
                            >
                                <Image source={require('../../../assets/images/office.png')} style={{ width: 25, height: 25 }} />
                                <Text> Office </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.pill, type === 'Other' ? styles.selectedPill : styles.unselectedPill]}
                                onPress={() => setType('Other')}
                            >
                                <Image source={require('../../../assets/images/location.png')} style={{ width: 25, height: 25 }} />
                                <Text> Other </Text>
                            </TouchableOpacity>
                        </View>

                        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={[styles.inputHeading, { paddingLeft: 10 }]}> Set as default address? </Text>
                            <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-evenly' }}>
                                <TouchableOpacity
                                    style={[styles.pill, isDefault === true ? styles.selectedPill : styles.unselectedPill, { width: '45%' }]}
                                    onPress={() => setIsDefault(true)}
                                >
                                    <Text> Yes </Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.pill, isDefault === false ? styles.selectedPill : styles.unselectedPill, { width: '45%' }]}
                                    onPress={() => setIsDefault(false)}
                                >
                                    <Text> No </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>

                    <TouchableOpacity style={styles.updateBox} onPress={handleAdd}>
                        <Text> Add </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

export default AddAddressModal;