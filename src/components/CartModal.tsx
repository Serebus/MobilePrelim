import React from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CartItem, User } from '../types';

interface CartModalProps {
  visible: boolean;
  onClose: () => void;
  cart: CartItem[];
  onUpdateQuantity: (productId: string | number, delta: number) => void;
  onRemoveItem: (productId: string | number) => void;
  onClearCart: () => void;
  onCheckout: () => void;
  isCheckingOut: boolean;
  user: User;
}

export const CartModal: React.FC<CartModalProps> = ({
  visible,
  onClose,
  cart,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onCheckout,
  isCheckingOut,
}) => {
  const insets = useSafeAreaInsets();

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0,
  );
  const shippingFee = subtotal > 50 || subtotal === 0 ? 0 : 5.99;
  const grandTotal = subtotal + shippingFee;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View
          style={[
            styles.modalContent,
            {
              paddingTop: Math.max(insets.top, 16),
              paddingBottom: Math.max(insets.bottom, 16),
            },
          ]}
        >
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <Text style={styles.headerTitle}>Shopping Cart</Text>
              {totalItems > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>
                    {totalItems} {totalItems === 1 ? 'item' : 'items'}
                  </Text>
                </View>
              )}
            </View>

            <View style={styles.headerActions}>
              {cart.length > 0 && (
                <TouchableOpacity
                  style={styles.clearButton}
                  onPress={onClearCart}
                  activeOpacity={0.7}
                >
                  <Text style={styles.clearButtonText}>Clear</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity
                style={styles.closeButton}
                onPress={onClose}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Cart Item List or Empty State */}
          {cart.length === 0 ? (
            <View style={styles.emptyContainer}>
              <View style={styles.emptyIconCircle}>
                <Text style={styles.emptyIcon}>🛒</Text>
              </View>
              <Text style={styles.emptyTitle}>Your cart is empty</Text>
              <Text style={styles.emptySubtitle}>
                Looks like you haven't added any products yet. Browse the catalog and find something you love!
              </Text>
              <TouchableOpacity
                style={styles.browseButton}
                onPress={onClose}
                activeOpacity={0.8}
              >
                <Text style={styles.browseButtonText}>Browse Products</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <>
              <FlatList
                data={cart}
                keyExtractor={(item) => item.product.id.toString()}
                contentContainerStyle={styles.itemList}
                showsVerticalScrollIndicator={false}
                renderItem={({ item }) => {
                  const itemSubtotal = item.product.price * item.quantity;
                  return (
                    <View style={styles.cartCard}>
                      <View style={styles.productImageWrapper}>
                        {item.product.image ? (
                          <Image
                            source={{ uri: item.product.image }}
                            style={styles.productImage}
                            resizeMode="contain"
                          />
                        ) : (
                          <Text style={styles.productIcon}>
                            {item.product.icon || '🛍️'}
                          </Text>
                        )}
                      </View>

                      <View style={styles.productInfo}>
                        <View style={styles.productHeaderRow}>
                          <Text style={styles.productTitle} numberOfLines={2}>
                            {item.product.name || item.product.title}
                          </Text>
                          <TouchableOpacity
                            onPress={() => onRemoveItem(item.product.id)}
                            style={styles.deleteButton}
                            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                          >
                            <Text style={styles.deleteIcon}>🗑️</Text>
                          </TouchableOpacity>
                        </View>

                        <Text style={styles.productPrice}>
                          ${item.product.price.toFixed(2)} each
                        </Text>

                        <View style={styles.cardFooter}>
                          <View style={styles.stepperContainer}>
                            <TouchableOpacity
                              style={styles.stepperBtn}
                              onPress={() => onUpdateQuantity(item.product.id, -1)}
                              activeOpacity={0.7}
                            >
                              <Text style={styles.stepperBtnText}>
                                {item.quantity === 1 ? '🗑' : '-'}
                              </Text>
                            </TouchableOpacity>
                            <Text style={styles.quantityText}>{item.quantity}</Text>
                            <TouchableOpacity
                              style={styles.stepperBtn}
                              onPress={() => onUpdateQuantity(item.product.id, 1)}
                              activeOpacity={0.7}
                            >
                              <Text style={styles.stepperBtnText}>+</Text>
                            </TouchableOpacity>
                          </View>

                          <Text style={styles.itemTotal}>
                            ${itemSubtotal.toFixed(2)}
                          </Text>
                        </View>
                      </View>
                    </View>
                  );
                }}
              />

              {/* Order Summary & Checkout Footer */}
              <View style={styles.summaryContainer}>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Subtotal</Text>
                  <Text style={styles.summaryValue}>${subtotal.toFixed(2)}</Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Shipping</Text>
                  <Text
                    style={[
                      styles.summaryValue,
                      shippingFee === 0 && styles.freeShippingText,
                    ]}
                  >
                    {shippingFee === 0 ? 'FREE' : `$${shippingFee.toFixed(2)}`}
                  </Text>
                </View>
                {shippingFee > 0 && (
                  <Text style={styles.shippingNote}>
                    Add ${(50 - subtotal).toFixed(2)} more for FREE shipping!
                  </Text>
                )}
                <View style={[styles.summaryRow, styles.totalRow]}>
                  <Text style={styles.totalLabel}>Total</Text>
                  <Text style={styles.totalValue}>
                    ${grandTotal.toFixed(2)}
                  </Text>
                </View>

                <TouchableOpacity
                  style={[
                    styles.checkoutButton,
                    isCheckingOut && styles.disabledButton,
                  ]}
                  onPress={onCheckout}
                  disabled={isCheckingOut}
                  activeOpacity={0.85}
                >
                  {isCheckingOut ? (
                    <ActivityIndicator size="small" color="#ffffff" />
                  ) : (
                    <Text style={styles.checkoutButtonText}>
                      {`Proceed to Checkout ($${grandTotal.toFixed(2)}) ➔`}
                    </Text>
                  )}
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#0f172a',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    height: '90%',
    paddingHorizontal: 18,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#1e293b',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#ffffff',
  },
  badge: {
    backgroundColor: '#2563eb',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  badgeText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '700',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  clearButton: {
    backgroundColor: '#334155',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  clearButtonText: {
    color: '#f87171',
    fontSize: 12,
    fontWeight: '700',
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#1e293b',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButtonText: {
    color: '#94a3b8',
    fontSize: 16,
    fontWeight: '700',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  emptyIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#1e293b',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  emptyIcon: {
    fontSize: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#ffffff',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#94a3b8',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  browseButton: {
    backgroundColor: '#2563eb',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  browseButtonText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '700',
  },
  itemList: {
    paddingVertical: 14,
    gap: 12,
  },
  cartCard: {
    backgroundColor: '#1e293b',
    borderRadius: 16,
    padding: 12,
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#334155',
  },
  productImageWrapper: {
    width: 64,
    height: 64,
    backgroundColor: '#ffffff',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 4,
    marginRight: 12,
  },
  productImage: {
    width: '100%',
    height: '100%',
  },
  productIcon: {
    fontSize: 28,
  },
  productInfo: {
    flex: 1,
    justifyContent: 'space-between',
  },
  productHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  productTitle: {
    flex: 1,
    fontSize: 14,
    fontWeight: '700',
    color: '#ffffff',
    marginRight: 6,
  },
  deleteButton: {
    padding: 2,
  },
  deleteIcon: {
    fontSize: 14,
  },
  productPrice: {
    fontSize: 12,
    color: '#94a3b8',
    marginTop: 2,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  stepperContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0f172a',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#334155',
  },
  stepperBtn: {
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  stepperBtnText: {
    color: '#38bdf8',
    fontSize: 14,
    fontWeight: '700',
  },
  quantityText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '700',
    minWidth: 22,
    textAlign: 'center',
  },
  itemTotal: {
    fontSize: 15,
    fontWeight: '800',
    color: '#4ade80',
  },
  summaryContainer: {
    borderTopWidth: 1,
    borderTopColor: '#1e293b',
    paddingTop: 14,
    paddingBottom: 6,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  summaryLabel: {
    color: '#94a3b8',
    fontSize: 14,
  },
  summaryValue: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  freeShippingText: {
    color: '#4ade80',
    fontWeight: '700',
  },
  shippingNote: {
    fontSize: 11,
    color: '#fbbf24',
    marginBottom: 6,
  },
  totalRow: {
    marginTop: 4,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#334155',
    marginBottom: 12,
  },
  totalLabel: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '800',
  },
  totalValue: {
    color: '#4ade80',
    fontSize: 20,
    fontWeight: '800',
  },
  checkoutButton: {
    backgroundColor: '#2563eb',
    borderRadius: 12,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkoutButtonText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '700',
  },
  disabledButton: {
    opacity: 0.6,
  },
});
