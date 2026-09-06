import React, { useState } from 'react';
import {
  Alert,
  Modal,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { User } from '../types';
import { CustomButton } from '../components/CustomButton';

interface ProfileScreenProps {
  user: User;
  onLogout: () => void;
  onNavigateToShop?: () => void;
  onUpdateUser?: (updatedUser: User) => void;
}

interface MockOrder {
  id: string;
  date: string;
  itemsCount: number;
  total: number;
  status: 'Delivered' | 'In Transit' | 'Processing';
  statusColor: string;
}

const INITIAL_ORDERS: MockOrder[] = [
  {
    id: 'ORD-84920',
    date: 'Sep 4, 2026',
    itemsCount: 3,
    total: 149.97,
    status: 'Delivered',
    statusColor: '#4ade80',
  },
  {
    id: 'ORD-72109',
    date: 'Aug 28, 2026',
    itemsCount: 1,
    total: 64.0,
    status: 'Delivered',
    statusColor: '#4ade80',
  },
  {
    id: 'ORD-65311',
    date: 'Aug 15, 2026',
    itemsCount: 2,
    total: 89.5,
    status: 'In Transit',
    statusColor: '#38bdf8',
  },
];

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  user,
  onLogout,
  onNavigateToShop,
  onUpdateUser,
}) => {
  const insets = useSafeAreaInsets();

  // User details state
  const [userData, setUserData] = useState<User>({
    ...user,
    phone: user.phone || '+6312321313',
    address: user.address || 'Lapu-Lapu',
    city: user.city || 'Cebu',
    zipCode: user.zipCode || '6015',
    memberSince: user.memberSince || 'August 2026',
    ordersCount: user.ordersCount || 8,
    rewardPoints: user.rewardPoints || 350,
  });

  // Settings switches
  const [pushNotifications, setPushNotifications] = useState(true);
  const [orderSmsUpdates, setOrderSmsUpdates] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [biometricLogin, setBiometricLogin] = useState(true);

  // Edit Modal State
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editName, setEditName] = useState(userData.name);
  const [editPhone, setEditPhone] = useState(userData.phone || '');
  const [editAddress, setEditAddress] = useState(userData.address || '');
  const [editCity, setEditCity] = useState(userData.city || '');
  const [editZip, setEditZip] = useState(userData.zipCode || '');

  // Saved addresses list
  const [savedAddresses] = useState([
    { id: '1', title: 'Home', address: 'Lapu-Lapu, Cebu, 6015', isDefault: true },
    { id: '2', title: 'Work', address: 'Lapu-Lapu, Cebu, 6015,', isDefault: false },
  ]);

  const initials = userData.name
    ? userData.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : 'U';

  const handleOpenEdit = () => {
    setEditName(userData.name);
    setEditPhone(userData.phone || '');
    setEditAddress(userData.address || '');
    setEditCity(userData.city || '');
    setEditZip(userData.zipCode || '');
    setIsEditModalVisible(true);
  };

  const handleSaveProfile = () => {
    if (!editName.trim()) {
      Alert.alert('Validation Error', 'Name cannot be empty.');
      return;
    }

    const updated: User = {
      ...userData,
      name: editName.trim(),
      phone: editPhone.trim(),
      address: editAddress.trim(),
      city: editCity.trim(),
      zipCode: editZip.trim(),
    };

    setUserData(updated);
    if (onUpdateUser) {
      onUpdateUser(updated);
    }
    setIsEditModalVisible(false);
    Alert.alert('Profile Updated', 'Your profile information has been saved.');
  };

  const handleOrderPress = (order: MockOrder) => {
    Alert.alert(
      `Order ${order.id}`,
      `Date: ${order.date}\nStatus: ${order.status}\nItems: ${order.itemsCount}\nTotal: $${order.total.toFixed(
        2,
      )}`,
      [{ text: 'Close', style: 'default' }],
    );
  };

  const handleLogoutPress = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out of your account?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: onLogout,
        },
      ],
    );
  };

  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: insets.top + 8,
          paddingBottom: insets.bottom + 65, // Leave room for bottom tab bar
        },
      ]}
    >
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Account Profile</Text>
          <Text style={styles.headerSubtitle}>Manage your personal information & settings</Text>
        </View>

        {onNavigateToShop && (
          <TouchableOpacity
            style={styles.shopButton}
            onPress={onNavigateToShop}
            activeOpacity={0.8}
            testID="profile-shop-btn"
          >
            <Text style={styles.shopButtonText}>🛍️ Shop</Text>
          </TouchableOpacity>
        )}
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* User Card */}
        <View style={styles.userCard}>
          <View style={styles.avatarRow}>
            <View style={styles.avatarContainer}>
              <Text style={styles.avatarText}>{initials}</Text>
              <View style={styles.verifiedBadge}>
                <Text style={styles.verifiedBadgeIcon}>✓</Text>
              </View>
            </View>

            <View style={styles.userDetails}>
              <Text style={styles.userName}>{userData.name}</Text>
              <Text style={styles.userEmail}>{userData.email}</Text>
              <View style={styles.membershipPill}>
                <Text style={styles.membershipText}>
                  {userData.isGuest ? '👤 Guest Shopper' : '⭐ Verified Gold Member'}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.userCardFooter}>
            <Text style={styles.memberSinceText}>
              Member since {userData.memberSince || '2024'}
            </Text>
            <TouchableOpacity
              style={styles.editCardBtn}
              onPress={handleOpenEdit}
              activeOpacity={0.8}
              testID="edit-profile-button"
            >
              <Text style={styles.editCardBtnText}>✏️ Edit Profile</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Quick Stats Grid */}
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{userData.ordersCount || 8}</Text>
            <Text style={styles.statLabel}>Orders</Text>
          </View>

          <View style={styles.statCard}>
            <Text style={[styles.statValue, styles.statRewardsText]}>
              {userData.rewardPoints || 350}
            </Text>
            <Text style={styles.statLabel}>Rewards Pts</Text>
          </View>

          <View style={styles.statCard}>
            <Text style={[styles.statValue, styles.statWishlistText]}>5</Text>
            <Text style={styles.statLabel}>Wishlist</Text>
          </View>

          <View style={styles.statCard}>
            <Text style={[styles.statValue, styles.statCouponsText]}>3</Text>
            <Text style={styles.statLabel}>Coupons</Text>
          </View>
        </View>

        {/* Personal Details Section */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Personal Details</Text>
            <TouchableOpacity onPress={handleOpenEdit}>
              <Text style={styles.sectionLink}>Edit</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <Text style={styles.infoIcon}>👤</Text>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Full Name</Text>
                <Text style={styles.infoValue}>{userData.name}</Text>
              </View>
            </View>

            <View style={styles.infoDivider} />

            <View style={styles.infoRow}>
              <Text style={styles.infoIcon}>✉️</Text>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Email Address</Text>
                <Text style={styles.infoValue}>{userData.email}</Text>
              </View>
            </View>

            <View style={styles.infoDivider} />

            <View style={styles.infoRow}>
              <Text style={styles.infoIcon}>📞</Text>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Phone Number</Text>
                <Text style={styles.infoValue}>{userData.phone || '+1 (555) 019-2834'}</Text>
              </View>
            </View>

            <View style={styles.infoDivider} />

            <View style={styles.infoRow}>
              <Text style={styles.infoIcon}>📍</Text>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Primary Address</Text>
                <Text style={styles.infoValue}>
                  {userData.address}, {userData.city} {userData.zipCode}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Saved Addresses Section */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Saved Addresses</Text>
          {savedAddresses.map((item) => (
            <View key={item.id} style={styles.addressCard}>
              <View style={styles.addressHeader}>
                <Text style={styles.addressTitle}>🏠 {item.title}</Text>
                {item.isDefault && (
                  <View style={styles.defaultBadge}>
                    <Text style={styles.defaultBadgeText}>Default</Text>
                  </View>
                )}
              </View>
              <Text style={styles.addressText}>{item.address}</Text>
            </View>
          ))}
        </View>

        {/* Order History Section */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Recent Orders</Text>
            <Text style={styles.sectionBadgeText}>{INITIAL_ORDERS.length} Orders</Text>
          </View>

          {INITIAL_ORDERS.map((order) => (
            <TouchableOpacity
              key={order.id}
              style={styles.orderCard}
              onPress={() => handleOrderPress(order)}
              activeOpacity={0.8}
            >
              <View style={styles.orderHeader}>
                <Text style={styles.orderId}>{order.id}</Text>
                <View
                  style={[
                    styles.statusBadge,
                    { borderColor: order.statusColor },
                  ]}
                >
                  <Text style={[styles.statusText, { color: order.statusColor }]}>
                    ● {order.status}
                  </Text>
                </View>
              </View>

              <View style={styles.orderDetailsRow}>
                <Text style={styles.orderMeta}>
                  {order.date} • {order.itemsCount} {order.itemsCount === 1 ? 'item' : 'items'}
                </Text>
                <Text style={styles.orderTotal}>${order.total.toFixed(2)}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* App Settings & Preferences */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Preferences & Settings</Text>

          <View style={styles.settingsCard}>
            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingLabel}>Push Notifications</Text>
                <Text style={styles.settingSubLabel}>Discounts, flash sales & offers</Text>
              </View>
              <Switch
                value={pushNotifications}
                onValueChange={setPushNotifications}
                trackColor={{ false: '#334155', true: '#2563eb' }}
                thumbColor={pushNotifications ? '#38bdf8' : '#94a3b8'}
              />
            </View>

            <View style={styles.infoDivider} />

            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingLabel}>SMS Order Tracking</Text>
                <Text style={styles.settingSubLabel}>Receive real-time shipment updates</Text>
              </View>
              <Switch
                value={orderSmsUpdates}
                onValueChange={setOrderSmsUpdates}
                trackColor={{ false: '#334155', true: '#2563eb' }}
                thumbColor={orderSmsUpdates ? '#38bdf8' : '#94a3b8'}
              />
            </View>

            <View style={styles.infoDivider} />

            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingLabel}>Dark Theme</Text>
                <Text style={styles.settingSubLabel}>Midnight blue palette</Text>
              </View>
              <Switch
                value={darkMode}
                onValueChange={setDarkMode}
                trackColor={{ false: '#334155', true: '#2563eb' }}
                thumbColor={darkMode ? '#38bdf8' : '#94a3b8'}
              />
            </View>

            <View style={styles.infoDivider} />

            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingLabel}>Biometric Sign In</Text>
                <Text style={styles.settingSubLabel}>Face ID / Touch ID authentication</Text>
              </View>
              <Switch
                value={biometricLogin}
                onValueChange={setBiometricLogin}
                trackColor={{ false: '#334155', true: '#2563eb' }}
                thumbColor={biometricLogin ? '#38bdf8' : '#94a3b8'}
              />
            </View>
          </View>
        </View>

        {/* Support & Legal */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Help & Support</Text>

          <View style={styles.menuCard}>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => Alert.alert('Customer Support', 'Contact us 24/7 at support@shopstore.com')}
            >
              <Text style={styles.menuItemText}>🎧 Customer Support Center</Text>
              <Text style={styles.menuArrow}>›</Text>
            </TouchableOpacity>

            <View style={styles.infoDivider} />

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => Alert.alert('Privacy Policy', 'Your data is secured with AES-256 encryption.')}
            >
              <Text style={styles.menuItemText}>🔒 Privacy & Data Policy</Text>
              <Text style={styles.menuArrow}>›</Text>
            </TouchableOpacity>

            <View style={styles.infoDivider} />

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => Alert.alert('Terms of Service', 'Terms & Conditions apply to all purchases.')}
            >
              <Text style={styles.menuItemText}>📄 Terms of Service</Text>
              <Text style={styles.menuArrow}>›</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* App Info Footer */}
        <View style={styles.appInfoContainer}>
          <Text style={styles.appInfoText}>MobilePrelim Shopping App v1.2.0</Text>
          <Text style={styles.appInfoSub}>Powered by React Native & FakeStoreAPI</Text>
        </View>

        {/* Sign Out Button */}
        <View style={styles.actionContainer}>
          <CustomButton
            title="Sign Out of Account"
            variant="danger"
            size="large"
            icon="🚪"
            onPress={handleLogoutPress}
            testID="sign-out-button"
          />
        </View>
      </ScrollView>

      {/* Edit Profile Modal */}
      <Modal
        visible={isEditModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsEditModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View
            style={[
              styles.modalContent,
              {
                paddingTop: Math.max(insets.top, 16),
                paddingBottom: Math.max(insets.bottom, 20),
              },
            ]}
          >
            {/* Modal Header */}
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Edit Profile Information</Text>
              <TouchableOpacity
                style={styles.closeBtn}
                onPress={() => setIsEditModalVisible(false)}
              >
                <Text style={styles.closeBtnText}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.formGroup}>
                <Text style={styles.inputLabel}>Full Name</Text>
                <TextInput
                  style={styles.inputField}
                  value={editName}
                  onChangeText={setEditName}
                  placeholder="Your full name"
                  placeholderTextColor="#64748b"
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.inputLabel}>Phone Number</Text>
                <TextInput
                  style={styles.inputField}
                  value={editPhone}
                  onChangeText={setEditPhone}
                  placeholder="+1 (555) 000-0000"
                  placeholderTextColor="#64748b"
                  keyboardType="phone-pad"
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.inputLabel}>Street Address</Text>
                <TextInput
                  style={styles.inputField}
                  value={editAddress}
                  onChangeText={setEditAddress}
                  placeholder="Street address"
                  placeholderTextColor="#64748b"
                />
              </View>

              <View style={styles.formRow}>
                <View style={[styles.formGroup, styles.formGroupCity]}>
                  <Text style={styles.inputLabel}>City & State</Text>
                  <TextInput
                    style={styles.inputField}
                    value={editCity}
                    onChangeText={setEditCity}
                    placeholder="City, State"
                    placeholderTextColor="#64748b"
                  />
                </View>

                <View style={[styles.formGroup, styles.formGroupZip]}>
                  <Text style={styles.inputLabel}>Zip Code</Text>
                  <TextInput
                    style={styles.inputField}
                    value={editZip}
                    onChangeText={setEditZip}
                    placeholder="Zip"
                    placeholderTextColor="#64748b"
                    keyboardType="numeric"
                  />
                </View>
              </View>

              <View style={styles.modalActions}>
                <CustomButton
                  title="Save Changes"
                  variant="primary"
                  size="large"
                  onPress={handleSaveProfile}
                  style={styles.saveBtn}
                  testID="modal-save-button"
                />

                <CustomButton
                  title="Cancel"
                  variant="ghost"
                  size="medium"
                  onPress={() => setIsEditModalVisible(false)}
                />
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#1e293b',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#ffffff',
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#94a3b8',
    marginTop: 2,
  },
  shopButton: {
    backgroundColor: '#1e293b',
    borderColor: '#38bdf8',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  shopButtonText: {
    color: '#38bdf8',
    fontSize: 13,
    fontWeight: '700',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  userCard: {
    backgroundColor: '#1e293b',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#334155',
    marginBottom: 16,
  },
  avatarRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#2563eb',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  avatarText: {
    fontSize: 24,
    fontWeight: '800',
    color: '#ffffff',
  },
  verifiedBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    backgroundColor: '#10b981',
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#1e293b',
  },
  verifiedBadgeIcon: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: '900',
  },
  userDetails: {
    marginLeft: 14,
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: '800',
    color: '#ffffff',
  },
  userEmail: {
    fontSize: 13,
    color: '#94a3b8',
    marginTop: 2,
  },
  membershipPill: {
    backgroundColor: '#0f172a',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
    alignSelf: 'flex-start',
    marginTop: 6,
    borderWidth: 1,
    borderColor: '#334155',
  },
  membershipText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#fbbf24',
  },
  userCardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#334155',
  },
  memberSinceText: {
    fontSize: 12,
    color: '#64748b',
  },
  editCardBtn: {
    backgroundColor: 'rgba(56, 189, 248, 0.1)',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  editCardBtnText: {
    color: '#38bdf8',
    fontSize: 12,
    fontWeight: '700',
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#1e293b',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    marginHorizontal: 3,
    borderWidth: 1,
    borderColor: '#334155',
  },
  statValue: {
    fontSize: 18,
    fontWeight: '800',
    color: '#4ade80',
  },
  statRewardsText: {
    color: '#fbbf24',
  },
  statWishlistText: {
    color: '#38bdf8',
  },
  statCouponsText: {
    color: '#a78bfa',
  },
  statLabel: {
    fontSize: 11,
    color: '#94a3b8',
    marginTop: 2,
    fontWeight: '600',
  },
  sectionContainer: {
    marginBottom: 20,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#f8fafc',
    marginBottom: 8,
  },
  sectionLink: {
    fontSize: 13,
    fontWeight: '700',
    color: '#38bdf8',
  },
  sectionBadgeText: {
    fontSize: 12,
    color: '#94a3b8',
  },
  infoCard: {
    backgroundColor: '#1e293b',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#334155',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
  },
  infoIcon: {
    fontSize: 18,
    marginRight: 12,
    width: 24,
    textAlign: 'center',
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 11,
    color: '#94a3b8',
    fontWeight: '600',
  },
  infoValue: {
    fontSize: 14,
    color: '#ffffff',
    fontWeight: '700',
    marginTop: 2,
  },
  infoDivider: {
    height: 1,
    backgroundColor: '#334155',
    marginVertical: 4,
  },
  addressCard: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#334155',
  },
  addressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  addressTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#f8fafc',
  },
  defaultBadge: {
    backgroundColor: '#2563eb',
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  defaultBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#ffffff',
  },
  addressText: {
    fontSize: 13,
    color: '#94a3b8',
    lineHeight: 18,
  },
  orderCard: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#334155',
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  orderId: {
    fontSize: 14,
    fontWeight: '800',
    color: '#ffffff',
  },
  statusBadge: {
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderWidth: 1,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
  },
  orderDetailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  orderMeta: {
    fontSize: 12,
    color: '#94a3b8',
  },
  orderTotal: {
    fontSize: 14,
    fontWeight: '800',
    color: '#4ade80',
  },
  settingsCard: {
    backgroundColor: '#1e293b',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#334155',
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
  },
  settingInfo: {
    flex: 1,
    marginRight: 10,
  },
  settingLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#ffffff',
  },
  settingSubLabel: {
    fontSize: 12,
    color: '#94a3b8',
    marginTop: 2,
  },
  menuCard: {
    backgroundColor: '#1e293b',
    borderRadius: 14,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: '#334155',
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
  },
  menuItemText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#e2e8f0',
  },
  menuArrow: {
    fontSize: 18,
    color: '#64748b',
    fontWeight: '700',
  },
  appInfoContainer: {
    alignItems: 'center',
    paddingVertical: 14,
  },
  appInfoText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748b',
  },
  appInfoSub: {
    fontSize: 11,
    color: '#475569',
    marginTop: 2,
  },
  actionContainer: {
    marginTop: 6,
    marginBottom: 20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#0f172a',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    height: '80%',
    paddingHorizontal: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#1e293b',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#ffffff',
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#1e293b',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeBtnText: {
    color: '#94a3b8',
    fontSize: 16,
    fontWeight: '700',
  },
  formGroup: {
    marginBottom: 14,
  },
  formGroupCity: {
    flex: 2,
    marginRight: 8,
  },
  formGroupZip: {
    flex: 1,
  },
  formRow: {
    flexDirection: 'row',
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#cbd5e1',
    marginBottom: 6,
  },
  inputField: {
    backgroundColor: '#1e293b',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#334155',
    color: '#ffffff',
    fontSize: 14,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  modalActions: {
    marginTop: 10,
    paddingBottom: 20,
  },
  saveBtn: {
    marginBottom: 8,
  },
});
