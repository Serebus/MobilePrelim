import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  RefreshControl,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CartItem, Product, User } from '../types';
import { fakeStoreApi } from '../api/fakeStoreApi';
import { CartModal } from '../components/CartModal';
import { ProductDetailModal } from '../components/ProductDetailModal';

interface ShoppingScreenProps {
  user: User;
  onLogout: () => void;
  onOpenProfile?: () => void;
  onCartChange?: (count: number) => void;
}

const formatCategoryName = (category: string): string => {
  if (!category || category.toLowerCase() === 'all') return 'All';
  return category
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

export const ShoppingScreen: React.FC<ShoppingScreenProps> = ({
  user,
  onLogout,
  onOpenProfile,
  onCartChange,
}) => {
  const insets = useSafeAreaInsets();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>(['all']);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [isCheckingOut, setIsCheckingOut] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isCartVisible, setIsCartVisible] = useState<boolean>(false);
  const [detailProduct, setDetailProduct] = useState<Product | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const fetchCatalog = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);

      const [loadedCategories, loadedProducts] = await Promise.all([
        fakeStoreApi.getCategories(),
        fakeStoreApi.getProducts(),
      ]);

      setCategories(loadedCategories);
      setProducts(loadedProducts);
    } catch {
      setError('Failed to fetch FakeStore catalog. Please try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchCatalog();
  }, [fetchCatalog]);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 2200);
  };

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesCategory =
        selectedCategory === 'all' ||
        product.category.toLowerCase() === selectedCategory.toLowerCase();
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !query ||
        product.name.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query);
      return matchesCategory && matchesSearch;
    });
  }, [products, selectedCategory, searchQuery]);

  const addToCart = (product: Product, quantityToAdd: number = 1) => {
    setCart((prevCart) => {
      const existing = prevCart.find(
        (item) => item.product.id.toString() === product.id.toString(),
      );
      if (existing) {
        return prevCart.map((item) =>
          item.product.id.toString() === product.id.toString()
            ? { ...item, quantity: item.quantity + quantityToAdd }
            : item,
        );
      }
      return [...prevCart, { product, quantity: quantityToAdd }];
    });

    const title = product.name || product.title || 'Item';
    const shortTitle = title.length > 20 ? title.substring(0, 20) + '...' : title;
    showToast(`Added ${quantityToAdd > 1 ? `${quantityToAdd}x ` : ''}"${shortTitle}" to cart! 🛒`);
  };

  const updateQuantity = (productId: string | number, delta: number) => {
    setCart((prevCart) => {
      const existing = prevCart.find(
        (item) => item.product.id.toString() === productId.toString(),
      );
      if (!existing) return prevCart;

      const newQty = existing.quantity + delta;
      if (newQty <= 0) {
        return prevCart.filter(
          (item) => item.product.id.toString() !== productId.toString(),
        );
      }

      return prevCart.map((item) =>
        item.product.id.toString() === productId.toString()
          ? { ...item, quantity: newQty }
          : item,
      );
    });
  };

  const removeFromCart = (productId: string | number) => {
    updateQuantity(productId, -1);
  };

  const removeItemCompletely = (productId: string | number) => {
    setCart((prevCart) =>
      prevCart.filter(
        (item) => item.product.id.toString() !== productId.toString(),
      ),
    );
  };

  const clearCart = () => {
    Alert.alert(
      'Clear Cart',
      'Are you sure you want to remove all items from your cart?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear All',
          style: 'destructive',
          onPress: () => setCart([]),
        },
      ],
    );
  };

  const totalCartItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalCartPrice = cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0,
  );

  useEffect(() => {
    onCartChange?.(totalCartItems);
  }, [totalCartItems, onCartChange]);

  const handleCheckout = async () => {
    if (cart.length === 0) {
      Alert.alert('Empty Cart', 'Please add some products to your cart first!');
      return;
    }

    try {
      setIsCheckingOut(true);
      const order = await fakeStoreApi.checkout(cart, user);
      setIsCartVisible(false);
      Alert.alert(
        'Order Placed! 🎉',
        `Thank you ${user.name}!\nOrder Reference: ${order.orderId}\nTotal: $${order.totalAmount.toFixed(
          2,
        )} (${totalCartItems} item${totalCartItems > 1 ? 's' : ''})`,
        [
          {
            text: 'Done',
            onPress: () => setCart([]),
          },
        ],
      );
    } catch {
      Alert.alert('Checkout Error', 'Unable to process checkout. Please try again.');
    } finally {
      setIsCheckingOut(false);
    }
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

  const getProductCartQuantity = (productId: string | number) => {
    const item = cart.find(
      (cartItem) => cartItem.product.id.toString() === productId.toString(),
    );
    return item ? item.quantity : 0;
  };

  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: insets.top + 12,
        },
      ]}
    >
      {/* Toast Banner */}
      {toastMessage && (
        <View style={[styles.toastBanner, { top: insets.top + 55 }]}>
          <Text style={styles.toastText}>{toastMessage}</Text>
        </View>
      )}

      {/* Top Bar */}
      <View style={styles.topBar}>
        <View style={styles.userInfo}>
          <Text style={styles.greetingText}>
            Hi, {user.name} {user.isGuest ? '👋' : '✨'}
          </Text>
          <Text style={styles.userEmail}>
            {user.email} • <Text style={styles.apiTag}>FakeStoreAPI</Text>
          </Text>
        </View>

        <View style={styles.topBarActions}>
          {/* Profile Header Button */}
          {onOpenProfile && (
            <TouchableOpacity
              style={styles.headerProfileButton}
              onPress={onOpenProfile}
              activeOpacity={0.8}
              testID="header-profile-button"
            >
              <Text style={styles.headerProfileIcon}>👤</Text>
            </TouchableOpacity>
          )}

          {/* Cart Header Button with Badge */}
          <TouchableOpacity
            style={styles.headerCartButton}
            onPress={() => setIsCartVisible(true)}
            activeOpacity={0.8}
          >
            <Text style={styles.headerCartIcon}>🛒</Text>
            {totalCartItems > 0 && (
              <View style={styles.headerCartBadge}>
                <Text style={styles.headerCartBadgeText}>
                  {totalCartItems > 99 ? '99+' : totalCartItems}
                </Text>
              </View>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.logoutButton}
            onPress={handleLogoutPress}
            activeOpacity={0.8}
          >
            <Text style={styles.logoutButtonText}>Sign Out 🚪</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Search Input */}
      <View style={styles.searchContainer}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Search products, clothing, tech..."
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
          data={categories}
          keyExtractor={(item) => item}
          contentContainerStyle={styles.categoryList}
          renderItem={({ item }) => {
            const isSelected =
              selectedCategory.toLowerCase() === item.toLowerCase();
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
                  {formatCategoryName(item)}
                </Text>
              </TouchableOpacity>
            );
          }}
        />
      </View>

      {/* Loading & Error Indicators */}
      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#38bdf8" />
          <Text style={styles.loadingText}>Fetching products from FakeStoreAPI...</Text>
        </View>
      ) : error ? (
        <View style={styles.centerContainer}>
          <Text style={styles.emptyIcon}>⚠️</Text>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => fetchCatalog()}
            activeOpacity={0.8}
          >
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : (
        /* Product List */
        <FlatList
          data={filteredProducts}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={[
            styles.productList,
            {
              paddingBottom:
                totalCartItems > 0
                  ? Math.max(insets.bottom, 10) + 145
                  : Math.max(insets.bottom, 10) + 75,
            },
          ]}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => fetchCatalog(true)}
              tintColor="#38bdf8"
              colors={['#38bdf8']}
            />
          }
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
            const quantity = getProductCartQuantity(item.id);

            return (
              <TouchableOpacity
                style={styles.productCard}
                onPress={() => setDetailProduct(item)}
                activeOpacity={0.9}
              >
                <View style={styles.productImageContainer}>
                  {item.image ? (
                    <Image
                      source={{ uri: item.image }}
                      style={styles.productImage}
                      resizeMode="contain"
                    />
                  ) : (
                    <Text style={styles.productIcon}>{item.icon || '🛍️'}</Text>
                  )}
                </View>

                <View style={styles.productDetails}>
                  <View style={styles.productCategoryRow}>
                    <Text style={styles.productCategory} numberOfLines={1}>
                      {formatCategoryName(item.category)}
                    </Text>
                    <Text style={styles.productRating}>
                      ⭐ {item.rating.toFixed(1)} ({item.reviewsCount})
                    </Text>
                  </View>

                  <Text style={styles.productName} numberOfLines={2}>
                    {item.name}
                  </Text>
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
              </TouchableOpacity>
            );
          }}
        />
      )}

      {/* Floating Bottom Cart Bar */}
      {totalCartItems > 0 && (
        <TouchableOpacity
          style={[
            styles.cartBar,
            { bottom: Math.max(insets.bottom, 10) + 70 },
          ]}
          onPress={() => setIsCartVisible(true)}
          activeOpacity={0.9}
          testID="floating-cart-bar"
        >
          <View style={styles.cartBarLeft}>
            <Text style={styles.cartItemCount}>
              🛒 {totalCartItems} {totalCartItems === 1 ? 'item' : 'items'} • View Cart
            </Text>
            <Text style={styles.cartTotalAmount}>
              ${totalCartPrice.toFixed(2)}
            </Text>
          </View>
          <TouchableOpacity
            style={[styles.checkoutButton, isCheckingOut && styles.disabledButton]}
            onPress={handleCheckout}
            disabled={isCheckingOut}
            activeOpacity={0.85}
          >
            {isCheckingOut ? (
              <ActivityIndicator size="small" color="#1d4ed8" />
            ) : (
              <Text style={styles.checkoutButtonText}>Checkout ➔</Text>
            )}
          </TouchableOpacity>
        </TouchableOpacity>
      )}

      {/* Cart Modal */}
      <CartModal
        visible={isCartVisible}
        onClose={() => setIsCartVisible(false)}
        cart={cart}
        onUpdateQuantity={updateQuantity}
        onRemoveItem={removeItemCompletely}
        onClearCart={clearCart}
        onCheckout={handleCheckout}
        isCheckingOut={isCheckingOut}
        user={user}
      />

      {/* Product Details Modal */}
      <ProductDetailModal
        visible={!!detailProduct}
        product={detailProduct}
        onClose={() => setDetailProduct(null)}
        onAddToCart={addToCart}
        currentCartQuantity={detailProduct ? getProductCartQuantity(detailProduct.id) : 0}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
    paddingHorizontal: 16,
  },
  toastBanner: {
    position: 'absolute',
    left: 20,
    right: 20,
    zIndex: 999,
    backgroundColor: '#1e293b',
    borderColor: '#38bdf8',
    borderWidth: 1.5,
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 14,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  toastText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '700',
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
  apiTag: {
    color: '#38bdf8',
    fontWeight: '700',
  },
  topBarActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerProfileButton: {
    backgroundColor: '#1e293b',
    borderColor: '#334155',
    borderWidth: 1,
    borderRadius: 10,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerProfileIcon: {
    fontSize: 18,
  },
  headerCartButton: {
    backgroundColor: '#1e293b',
    borderColor: '#334155',
    borderWidth: 1,
    borderRadius: 10,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  headerCartIcon: {
    fontSize: 18,
  },
  headerCartBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#ef4444',
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  headerCartBadgeText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: '800',
  },
  logoutButton: {
    backgroundColor: '#1e293b',
    borderColor: '#334155',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
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
  productImageContainer: {
    width: 68,
    height: 68,
    borderRadius: 12,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
    overflow: 'hidden',
    padding: 4,
  },
  productImage: {
    width: '100%',
    height: '100%',
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
  centerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  loadingText: {
    color: '#94a3b8',
    marginTop: 12,
    fontSize: 14,
    fontWeight: '500',
  },
  errorText: {
    color: '#f87171',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 16,
    paddingHorizontal: 20,
  },
  retryButton: {
    backgroundColor: '#2563eb',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '700',
  },
  disabledButton: {
    opacity: 0.6,
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
    zIndex: 50,
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
