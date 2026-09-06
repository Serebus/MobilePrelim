import React, { useState, useEffect } from 'react';
import {
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Product } from '../types';

interface ProductDetailModalProps {
  visible: boolean;
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product, quantity: number) => void;
  currentCartQuantity?: number;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  visible,
  product,
  onClose,
  onAddToCart,
  currentCartQuantity = 0,
}) => {
  const insets = useSafeAreaInsets();
  const [selectedQuantity, setSelectedQuantity] = useState(1);

  useEffect(() => {
    if (visible) {
      setSelectedQuantity(1);
    }
  }, [visible, product]);

  if (!product) return null;

  const handleAdd = () => {
    onAddToCart(product, selectedQuantity);
    onClose();
  };

  const totalPrice = product.price * selectedQuantity;

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
            <Text style={styles.headerTitle} numberOfLines={1}>
              Product Details
            </Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={onClose}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            {/* Image Box */}
            <View style={styles.imageContainer}>
              {product.image ? (
                <Image
                  source={{ uri: product.image }}
                  style={styles.productImage}
                  resizeMode="contain"
                />
              ) : (
                <Text style={styles.productIcon}>{product.icon || '🛍️'}</Text>
              )}
            </View>

            {/* Badges Row */}
            <View style={styles.badgeRow}>
              <View style={styles.categoryBadge}>
                <Text style={styles.categoryBadgeText}>
                  {product.category.toUpperCase()}
                </Text>
              </View>
              <View style={styles.ratingBadge}>
                <Text style={styles.ratingText}>
                  ⭐ {product.rating.toFixed(1)} ({product.reviewsCount} reviews)
                </Text>
              </View>
            </View>

            {/* Title & Price */}
            <Text style={styles.productTitle}>
              {product.name || product.title}
            </Text>

            <View style={styles.priceRow}>
              <Text style={styles.priceText}>
                ${product.price.toFixed(2)}
              </Text>
              {currentCartQuantity > 0 && (
                <View style={styles.inCartBadge}>
                  <Text style={styles.inCartBadgeText}>
                    🛒 {currentCartQuantity} already in cart
                  </Text>
                </View>
              )}
            </View>

            {/* Description */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Description</Text>
              <Text style={styles.descriptionText}>{product.description}</Text>
            </View>

            {/* Quantity Selector */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Select Quantity</Text>
              <View style={styles.quantityPicker}>
                <TouchableOpacity
                  style={[
                    styles.quantityPickerBtn,
                    selectedQuantity <= 1 && styles.quantityPickerBtnDisabled,
                  ]}
                  onPress={() =>
                    setSelectedQuantity((prev) => Math.max(1, prev - 1))
                  }
                  disabled={selectedQuantity <= 1}
                >
                  <Text style={styles.quantityPickerBtnText}>-</Text>
                </TouchableOpacity>

                <Text style={styles.quantityPickerValue}>
                  {selectedQuantity}
                </Text>

                <TouchableOpacity
                  style={styles.quantityPickerBtn}
                  onPress={() => setSelectedQuantity((prev) => prev + 1)}
                >
                  <Text style={styles.quantityPickerBtnText}>+</Text>
                </TouchableOpacity>

                <Text style={styles.totalCalculationText}>
                  = ${totalPrice.toFixed(2)}
                </Text>
              </View>
            </View>
          </ScrollView>

          {/* Action Footer */}
          <View style={styles.actionFooter}>
            <TouchableOpacity
              style={styles.addToCartButton}
              onPress={handleAdd}
              activeOpacity={0.85}
            >
              <Text style={styles.addToCartButtonText}>
                + Add {selectedQuantity} to Cart • ${totalPrice.toFixed(2)}
              </Text>
            </TouchableOpacity>
          </View>
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
    height: '85%',
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#1e293b',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#ffffff',
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
  scrollContent: {
    paddingVertical: 16,
  },
  imageContainer: {
    width: '100%',
    height: 200,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    marginBottom: 16,
  },
  productImage: {
    width: '100%',
    height: '100%',
  },
  productIcon: {
    fontSize: 60,
  },
  badgeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  categoryBadge: {
    backgroundColor: '#1e293b',
    borderColor: '#38bdf8',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  categoryBadgeText: {
    color: '#38bdf8',
    fontSize: 11,
    fontWeight: '700',
  },
  ratingBadge: {
    backgroundColor: '#1e293b',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  ratingText: {
    color: '#fbbf24',
    fontSize: 12,
    fontWeight: '600',
  },
  productTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#ffffff',
    marginBottom: 10,
    lineHeight: 24,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  priceText: {
    fontSize: 24,
    fontWeight: '800',
    color: '#4ade80',
  },
  inCartBadge: {
    backgroundColor: '#1e293b',
    borderColor: '#2563eb',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  inCartBadgeText: {
    color: '#60a5fa',
    fontSize: 12,
    fontWeight: '600',
  },
  section: {
    marginBottom: 18,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#cbd5e1',
    marginBottom: 6,
  },
  descriptionText: {
    fontSize: 14,
    color: '#94a3b8',
    lineHeight: 20,
  },
  quantityPicker: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 8,
    borderWidth: 1,
    borderColor: '#334155',
  },
  quantityPickerBtn: {
    width: 36,
    height: 36,
    backgroundColor: '#0f172a',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#334155',
  },
  quantityPickerBtnDisabled: {
    opacity: 0.4,
  },
  quantityPickerBtnText: {
    color: '#38bdf8',
    fontSize: 18,
    fontWeight: '700',
  },
  quantityPickerValue: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
    minWidth: 40,
    textAlign: 'center',
  },
  totalCalculationText: {
    color: '#4ade80',
    fontSize: 15,
    fontWeight: '700',
    marginLeft: 'auto',
    marginRight: 8,
  },
  actionFooter: {
    borderTopWidth: 1,
    borderTopColor: '#1e293b',
    paddingTop: 12,
  },
  addToCartButton: {
    backgroundColor: '#2563eb',
    borderRadius: 12,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addToCartButtonText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '700',
  },
});
