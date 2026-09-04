import React, { useState, useMemo } from 'react';
import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CartItem, Product, User } from '../types';

interface ShoppingScreenProps {
  user: User;
  onLogout: () => void;
}

const SAMPLE_PRODUCTS: Product[] = [
  {
    id: 'prod_1',
    name: 'Wireless Noise-Canceling Headphones',
    price: 89.99,
    category: 'Electronics',
    rating: 4.8,
    reviewsCount: 245,
    icon: '🎧',
    description: 'Immersive sound with active noise cancellation and 30hr battery.',
  },
  {
    id: 'prod_2',
    name: 'Smart Fitness Tracker Watch',
    price: 49.99,
    category: 'Electronics',
    rating: 4.6,
    reviewsCount: 189,
    icon: '⌚',
    description: 'Heart rate monitor, step counter, sleep tracking, and waterproof.',
  },
  {
    id: 'prod_3',
    name: 'Classic Casual Denim Jacket',
    price: 59.99,
    category: 'Fashion',
    rating: 4.7,
    reviewsCount: 96,
    icon: '🧥',
    description: 'Durable, comfortable vintage wash denim for all seasons.',
  },
  {
    id: 'prod_4',
    name: 'Running Breathable Sneakers',
    price: 74.99,
    category: 'Fashion',
    rating: 4.9,
    reviewsCount: 312,
    icon: '👟',
    description: 'Lightweight cushioning engineered for high performance and road running.',
  },
  {
    id: 'prod_5',
    name: 'Stainless Steel Insulated Tumbler',
    price: 24.99,
    category: 'Home',
    rating: 4.5,
    reviewsCount: 88,
    icon: '☕',
    description: 'Keeps drinks hot for 12 hours and ice cold for 24 hours.',
  },
  {
    id: 'prod_6',
    name: 'Adjustable Yoga & Fitness Mat',
    price: 29.99,
    category: 'Fitness',
    rating: 4.8,
    reviewsCount: 154,
    icon: '🧘',
    description: 'Non-slip eco-friendly textured surface with carrying strap included.',
  },
];

const CATEGORIES = ['All', 'Electronics', 'Fashion', 'Home', 'Fitness'];

export const ShoppingScreen: React.FC<ShoppingScreenProps> = ({
  user,
  onLogout,
}) => {
  const insets = useSafeAreaInsets();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState<CartItem[]>([]);

  const filteredProducts = useMemo(() => {
    return SAMPLE_PRODUCTS.filter((product) => {
      const matchesCategory =
        selectedCategory === 'All' || product.category === selectedCategory;
      const matchesSearch =
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  const addToCart = (product: Product) => {
    setCart((prevCart) => {
      const existing = prevCart.find((item) => item.product.id === product.id);
      if (existing) {
        return prevCart.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      }
      return [...prevCart, { product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart((prevCart) => {
      const existing = prevCart.find((item) => item.product.id === productId);
      if (existing && existing.quantity > 1) {
        return prevCart.map((item) =>
          item.product.id === productId
            ? { ...item, quantity: item.quantity - 1 }
            : item,
        );
      }
      return prevCart.filter((item) => item.product.id !== productId);
    });
  };

  const totalCartItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalCartPrice = cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0,
  );

  const handleCheckout = () => {
    if (cart.length === 0) {
      Alert.alert('Empty Cart', 'Please add some products to your cart first!');
      return;
    }

    Alert.alert(
      'Order Successful! 🎉',
      `Thank you ${user.name}!\nYour order of ${totalCartItems} item(s) totaling $${totalCartPrice.toFixed(
        2,
      )} has been placed.`,
      [
        {
          text: 'Great!',
          onPress: () => setCart([]),
        },
      ],
    );
  };

  const handleLogoutPress = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out of your shopping account?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Sign Out', style: 'destructive', onPress: onLogout },
      ],
    );
  };

  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: insets.top + 12,
          paddingBottom: insets.bottom + (totalCartItems > 0 ? 80 : 16),
        },
      ]}
    >
      {/* Top Bar */}
      <View style={styles.topBar}>
        <View style={styles.userInfo}>
          <Text style={styles.greetingText}>
            Hi, {user.name} {user.isGuest ? '👋' : '✨'}
          </Text>
          <Text style={styles.userEmail}>{user.email}</Text>
        </View>
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogoutPress}
          activeOpacity={0.8}
        >
          <Text style={styles.logoutButtonText}>Sign Out 🚪</Text>
        </TouchableOpacity>
      </View>

      {/* Search Input */}
      <View style={styles.searchContainer}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Search products, brands..."
          placeholderTextColor="#94a3b8"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery ? (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Text style={styles.clearSearchIcon}>✕</Text>
          </TouchableOpacity>
        ) : null}
      </View>

      {/* Category Pills */}
      <View style={styles.categoriesWrapper}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={CATEGORIES}
          keyExtractor={(item) => item}
          contentContainerStyle={styles.categoryList}
          renderItem={({ item }) => {
            const isSelected = selectedCategory === item;
            return (
              <TouchableOpacity
                style={[
                  styles.categoryPill,
                  isSelected && styles.categoryPillActive,
                ]}
                onPress={() => setSelectedCategory(item)}
                activeOpacity={0.8}
              >
                <Text
                  style={[
                    styles.categoryText,
                    isSelected && styles.categoryTextActive,
                  ]}
                >
                  {item}
                </Text>
              </TouchableOpacity>
            );
          }}
        />
      </View>

      {/* Product List */}
      <FlatList
        data={filteredProducts}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.productList}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>📦</Text>
            <Text style={styles.emptyTitle}>No products found</Text>
            <Text style={styles.emptySubtitle}>
              Try searching with different keywords or switch categories.
            </Text>
          </View>
        }
        renderItem={({ item }) => {
          const itemInCart = cart.find(
            (cartItem) => cartItem.product.id === item.id,
          );
          const quantity = itemInCart ? itemInCart.quantity : 0;

          return (
            <View style={styles.productCard}>
              <View style={styles.productIconBadge}>
                <Text style={styles.productIcon}>{item.icon}</Text>
              </View>

              <View style={styles.productDetails}>
                <View style={styles.productCategoryRow}>
                  <Text style={styles.productCategory}>{item.category}</Text>
                  <Text style={styles.productRating}>
                    ⭐ {item.rating} ({item.reviewsCount})
                  </Text>
                </View>

                <Text style={styles.productName}>{item.name}</Text>
                <Text style={styles.productDesc} numberOfLines={2}>
                  {item.description}
                </Text>

                <View style={styles.priceActionRow}>
                  <Text style={styles.productPrice}>
                    ${item.price.toFixed(2)}
                  </Text>

                  {quantity > 0 ? (
                    <View style={styles.quantityControl}>
                      <TouchableOpacity
                        style={styles.quantityBtn}
                        onPress={() => removeFromCart(item.id)}
                      >
                        <Text style={styles.quantityBtnText}>-</Text>
                      </TouchableOpacity>
                      <Text style={styles.quantityText}>{quantity}</Text>
                      <TouchableOpacity
                        style={styles.quantityBtn}
                        onPress={() => addToCart(item)}
                      >
                        <Text style={styles.quantityBtnText}>+</Text>
                      </TouchableOpacity>
                    </View>
                  ) : (
                    <TouchableOpacity
                      style={styles.addButton}
                      onPress={() => addToCart(item)}
                      activeOpacity={0.8}
                    >
                      <Text style={styles.addButtonText}>+ Add to Cart</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            </View>
          );
        }}
      />

      {/* Floating Bottom Cart Bar */}
      {totalCartItems > 0 && (
        <View style={[styles.cartBar, { bottom: insets.bottom + 10 }]}>
          <View style={styles.cartBarLeft}>
            <Text style={styles.cartItemCount}>
              🛒 {totalCartItems} {totalCartItems === 1 ? 'item' : 'items'}
            </Text>
            <Text style={styles.cartTotalAmount}>
              ${totalCartPrice.toFixed(2)}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.checkoutButton}
            onPress={handleCheckout}
            activeOpacity={0.85}
          >
            <Text style={styles.checkoutButtonText}>Checkout ➔</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
    paddingHorizontal: 16,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  userInfo: {
    flex: 1,
  },
  greetingText: {
    fontSize: 20,
    fontWeight: '800',
    color: '#ffffff',
  },
  userEmail: {
    fontSize: 12,
    color: '#94a3b8',
    marginTop: 2,
  },
  logoutButton: {
    backgroundColor: '#1e293b',
    borderColor: '#334155',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  logoutButtonText: {
    color: '#cbd5e1',
    fontSize: 12,
    fontWeight: '600',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1e293b',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#334155',
    paddingHorizontal: 12,
    marginBottom: 14,
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 44,
    color: '#ffffff',
    fontSize: 14,
  },
  clearSearchIcon: {
    color: '#94a3b8',
    fontSize: 14,
    padding: 6,
  },
  categoriesWrapper: {
    marginBottom: 14,
  },
  categoryList: {
    gap: 8,
  },
  categoryPill: {
    backgroundColor: '#1e293b',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#334155',
  },
  categoryPillActive: {
    backgroundColor: '#2563eb',
    borderColor: '#2563eb',
  },
  categoryText: {
    color: '#94a3b8',
    fontSize: 13,
    fontWeight: '600',
  },
  categoryTextActive: {
    color: '#ffffff',
    fontWeight: '700',
  },
  productList: {
    paddingBottom: 24,
    gap: 12,
  },
  productCard: {
    backgroundColor: '#1e293b',
    borderRadius: 16,
    padding: 14,
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#334155',
    alignItems: 'center',
  },
  productIconBadge: {
    width: 64,
    height: 64,
    borderRadius: 14,
    backgroundColor: '#0f172a',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  productIcon: {
    fontSize: 32,
  },
  productDetails: {
    flex: 1,
  },
  productCategoryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  productCategory: {
    fontSize: 11,
    fontWeight: '700',
    color: '#38bdf8',
    textTransform: 'uppercase',
  },
  productRating: {
    fontSize: 11,
    color: '#fbbf24',
    fontWeight: '600',
  },
  productName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 4,
  },
  productDesc: {
    fontSize: 12,
    color: '#94a3b8',
    marginBottom: 10,
    lineHeight: 16,
  },
  priceActionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  productPrice: {
    fontSize: 16,
    fontWeight: '800',
    color: '#4ade80',
  },
  addButton: {
    backgroundColor: '#2563eb',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  addButtonText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700',
  },
  quantityControl: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0f172a',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#334155',
  },
  quantityBtn: {
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  quantityBtnText: {
    color: '#38bdf8',
    fontSize: 16,
    fontWeight: '700',
  },
  quantityText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '700',
    minWidth: 20,
    textAlign: 'center',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 6,
  },
  emptySubtitle: {
    fontSize: 13,
    color: '#94a3b8',
    textAlign: 'center',
    maxWidth: 240,
  },
  cartBar: {
    position: 'absolute',
    left: 16,
    right: 16,
    backgroundColor: '#2563eb',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  cartBarLeft: {
    flex: 1,
  },
  cartItemCount: {
    color: '#bfdbfe',
    fontSize: 12,
    fontWeight: '600',
  },
  cartTotalAmount: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '800',
  },
  checkoutButton: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
  },
  checkoutButtonText: {
    color: '#1d4ed8',
    fontSize: 14,
    fontWeight: '700',
  },
});
