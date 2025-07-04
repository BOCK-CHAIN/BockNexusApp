import React, { FC, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Modal,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { FONTS } from '@utils/Constants';
import { useAppDispatch, useAppSelector } from '@store/reduxHook';
import { setLoading, setAuthData, setError } from '../api/slice';
import { loginUser, registerUser, LoginData, RegisterData } from '../api/userApi';

interface LoginModalProps {
  visible: boolean;
  onClose: () => void;
}

const LoginModal: FC<LoginModalProps> = ({ visible, onClose }) => {
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((state) => state.auth);
  
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState<LoginData & RegisterData>({
    username: '',
    email: '',
    password: '',
    phone: '',
    address: '',
  });
  const [formError, setFormError] = useState<string | null>(null);

  const handleSubmit = async () => {
    setFormError(null);
    if (isLogin) {
      if (!formData.username || !formData.password) {
        setFormError('Please enter both username and password.');
        return;
      }
    } else {
      if (!formData.username || !formData.email || !formData.password) {
        setFormError('Please enter username, email, and password.');
        return;
      }
    }
    try {
      dispatch(setLoading(true));
      if (isLogin) {
        const response = await loginUser({
          username: formData.username,
          password: formData.password,
        });
        dispatch(setAuthData({
          user: response.data.user,
          token: response.data.token,
        }));
        Alert.alert('Success', 'Login successful!');
        onClose();
      } else {
        const response = await registerUser({
          username: formData.username,
          email: formData.email,
          password: formData.password,
          phone: formData.phone,
          address: formData.address,
        });
        dispatch(setAuthData({
          user: response.data.user,
          token: response.data.token,
        }));
        Alert.alert('Success', 'Registration successful!');
        onClose();
      }
    } catch (error: any) {
      dispatch(setError(error.message));
      setFormError(error.message);
    }
  };

  const resetForm = () => {
    setFormData({
      username: '',
      email: '',
      password: '',
      phone: '',
      address: '',
    });
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <Text style={styles.title}>{isLogin ? 'Login' : 'Register'}</Text>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.closeButton}>✕</Text>
            </TouchableOpacity>
          </View>

          <TextInput
            style={styles.input}
            placeholder="Username"
            value={formData.username}
            onChangeText={(text) => setFormData({ ...formData, username: text })}
            autoCapitalize="none"
          />

          {!isLogin && (
            <TextInput
              style={styles.input}
              placeholder="Email"
              value={formData.email}
              onChangeText={(text) => setFormData({ ...formData, email: text })}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          )}

          <TextInput
            style={styles.input}
            placeholder="Password"
            value={formData.password}
            onChangeText={(text) => setFormData({ ...formData, password: text })}
            secureTextEntry
          />

          {!isLogin && (
            <>
              <TextInput
                style={styles.input}
                placeholder="Phone (optional)"
                value={formData.phone}
                onChangeText={(text) => setFormData({ ...formData, phone: text })}
                keyboardType="phone-pad"
              />

              <TextInput
                style={styles.input}
                placeholder="Address (optional)"
                value={formData.address}
                onChangeText={(text) => setFormData({ ...formData, address: text })}
                multiline
                numberOfLines={2}
              />
            </>
          )}

          {formError && (
            <Text style={{ color: 'red', marginBottom: 8, textAlign: 'center' }}>{formError}</Text>
          )}

          <TouchableOpacity
            style={styles.submitButton}
            onPress={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.submitButtonText}>
                {isLogin ? 'Login' : 'Register'}
              </Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.switchButton}
            onPress={() => {
              setIsLogin(!isLogin);
              resetForm();
            }}
          >
            <Text style={styles.switchButtonText}>
              {isLogin ? "Don't have an account? Register" : 'Already have an account? Login'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    width: '90%',
    maxWidth: 400,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: RFValue(24),
    fontFamily: FONTS.heading,
    fontWeight: 'bold',
    color: '#333',
  },
  closeButton: {
    fontSize: RFValue(24),
    color: '#666',
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    fontSize: RFValue(16),
  },
  submitButton: {
    backgroundColor: '#2E7D32',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 15,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: RFValue(16),
    fontWeight: 'bold',
  },
  switchButton: {
    alignItems: 'center',
  },
  switchButtonText: {
    color: '#2E7D32',
    fontSize: RFValue(14),
    textDecorationLine: 'underline',
  },
});

export default LoginModal;