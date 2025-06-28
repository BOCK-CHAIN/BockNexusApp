import React, { FC, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Alert,
} from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { FONTS } from '@utils/Constants';
import { useAppDispatch, useAppSelector } from '@store/reduxHook';
import { logout } from './api/slice';
import LoginModal from './molecules/LoginModal';
import Icon from 'react-native-vector-icons/MaterialIcons';

const Account: FC = () => {
  const dispatch = useAppDispatch();
  const { user, isAuthenticated, loading } = useAppSelector((state) => state.auth);
  const [showLoginModal, setShowLoginModal] = useState(false);

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Logout', 
          style: 'destructive',
          onPress: () => {
            dispatch(logout());
            Alert.alert('Success', 'Logged out successfully');
          }
        }
      ]
    );
  };

  const handleLogin = () => {
    setShowLoginModal(true);
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <SafeAreaView />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Account</Text>
      </View>

      <ScrollView style={styles.content}>
        {isAuthenticated && user ? (
          // Logged in user view
          <View style={styles.userSection}>
            <View style={styles.userInfo}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>
                  {user.name.charAt(0).toUpperCase()}
                </Text>
              </View>
              <View style={styles.userDetails}>
                <Text style={styles.userName}>{user.name}</Text>
                <Text style={styles.userEmail}>{user.email}</Text>
                {user.phone && (
                  <Text style={styles.userPhone}>{user.phone}</Text>
                )}
              </View>
            </View>

            <View style={styles.menuSection}>
              <TouchableOpacity style={styles.menuItem}>
                <Icon name="person" size={24} color="#333" />
                <Text style={styles.menuText}>Edit Profile</Text>
                <Icon name="chevron-right" size={24} color="#666" />
              </TouchableOpacity>

              <TouchableOpacity style={styles.menuItem}>
                <Icon name="shopping-cart" size={24} color="#333" />
                <Text style={styles.menuText}>My Orders</Text>
                <Icon name="chevron-right" size={24} color="#666" />
              </TouchableOpacity>

              <TouchableOpacity style={styles.menuItem}>
                <Icon name="favorite" size={24} color="#333" />
                <Text style={styles.menuText}>Wishlist</Text>
                <Icon name="chevron-right" size={24} color="#666" />
              </TouchableOpacity>

              <TouchableOpacity style={styles.menuItem}>
                <Icon name="location-on" size={24} color="#333" />
                <Text style={styles.menuText}>Addresses</Text>
                <Icon name="chevron-right" size={24} color="#666" />
              </TouchableOpacity>

              <TouchableOpacity style={styles.menuItem}>
                <Icon name="settings" size={24} color="#333" />
                <Text style={styles.menuText}>Settings</Text>
                <Icon name="chevron-right" size={24} color="#666" />
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
              <Icon name="logout" size={24} color="#fff" />
              <Text style={styles.logoutButtonText}>Logout</Text>
            </TouchableOpacity>
          </View>
        ) : (
          // Not logged in view
          <View style={styles.loginSection}>
            <View style={styles.loginContent}>
              <Icon name="account-circle" size={80} color="#ccc" />
              <Text style={styles.loginTitle}>Welcome to BockNexus</Text>
              <Text style={styles.loginSubtitle}>
                Login to access your account and manage your orders
              </Text>
              
              <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
                <Text style={styles.loginButtonText}>Login / Register</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </ScrollView>

      <LoginModal 
        visible={showLoginModal} 
        onClose={() => setShowLoginModal(false)} 
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: RFValue(20),
    fontFamily: FONTS.heading,
    fontWeight: 'bold',
    color: '#333',
  },
  content: {
    flex: 1,
  },
  userSection: {
    padding: 20,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 15,
    marginBottom: 20,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#2E7D32',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  avatarText: {
    color: '#fff',
    fontSize: RFValue(24),
    fontWeight: 'bold',
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: RFValue(18),
    fontFamily: FONTS.heading,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  userEmail: {
    fontSize: RFValue(14),
    color: '#666',
    marginBottom: 3,
  },
  userPhone: {
    fontSize: RFValue(14),
    color: '#666',
  },
  menuSection: {
    backgroundColor: '#fff',
    borderRadius: 15,
    marginBottom: 20,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  menuText: {
    flex: 1,
    fontSize: RFValue(16),
    color: '#333',
    marginLeft: 15,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f44336',
    padding: 15,
    borderRadius: 10,
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: RFValue(16),
    fontWeight: 'bold',
    marginLeft: 10,
  },
  loginSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loginContent: {
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 40,
    borderRadius: 20,
    width: '100%',
  },
  loginTitle: {
    fontSize: RFValue(24),
    fontFamily: FONTS.heading,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 20,
    marginBottom: 10,
  },
  loginSubtitle: {
    fontSize: RFValue(14),
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 20,
  },
  loginButton: {
    backgroundColor: '#2E7D32',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: RFValue(16),
    fontWeight: 'bold',
  },
});

export default Account;