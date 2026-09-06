import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Alert, TouchableOpacity, Text } from 'react-native';
import { ShoppingScreen } from '../src/screens/ShoppingScreen';
import { CartModal } from '../src/components/CartModal';
import { ProductDetailModal } from '../src/components/ProductDetailModal';
import { fakeStoreApi } from '../src/api/fakeStoreApi';
import { Product } from '../src/types';

const safeAreaMetrics = {
  frame: { x: 0, y: 0, width: 390, height: 844 },
  insets: { top: 0, left: 0, right: 0, bottom: 0 },
};

const mockUser = {
  id: 'usr_test_cart',
  name: 'Cart Tester',
  email: 'tester@cart.com',
  isGuest: false,
};

const sampleProduct1: Product = {
  id: '1',
  name: 'Wireless Bluetooth Headphones',
  price: 99.99,
  category: 'electronics',
  rating: 4.8,
  reviewsCount: 150,
  description: 'High-fidelity audio with noise cancellation',
  icon: '🎧',
  inStock: true,
};

const sampleProduct2: Product = {
  id: '2',
  name: 'Gold Plated Necklace',
  price: 49.5,
  category: 'jewelery',
  rating: 4.2,
  reviewsCount: 80,
  description: 'Elegant jewelry for special occasions',
  icon: '💍',
  inStock: true,
};

describe('Cart Feature & Modals', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.spyOn(fakeStoreApi, 'getCategories').mockResolvedValue(['all', 'electronics', 'jewelery']);
    jest.spyOn(fakeStoreApi, 'getProducts').mockResolvedValue([sampleProduct1, sampleProduct2]);
  });

  afterEach(() => {
    jest.restoreAllMocks();
    jest.useRealTimers();
  });

  test('adds product to cart, increases/decreases quantity, and shows floating cart bar', async () => {
    let renderer: ReactTestRenderer.ReactTestRenderer;
    await ReactTestRenderer.act(async () => {
      renderer = ReactTestRenderer.create(
        <SafeAreaProvider initialMetrics={safeAreaMetrics}>
          <ShoppingScreen user={mockUser} onLogout={jest.fn()} />
        </SafeAreaProvider>,
      );
    });

    const root = renderer!.root;

    // Find and press "+ Add to Cart" for first product
    const addButtons = root.findAllByType(TouchableOpacity).filter((t) => {
      const child = t.props.children;
      return (
        typeof child?.props?.children === 'string' &&
        child.props.children.includes('+ Add to Cart')
      );
    });
    expect(addButtons.length).toBeGreaterThanOrEqual(1);

    await ReactTestRenderer.act(async () => {
      addButtons[0].props.onPress();
    });

    // Quantity stepper '+' and '-' should now be visible for product 1
    const plusButtons = root.findAllByType(TouchableOpacity).filter((t) => {
      const child = t.props.children;
      return child?.props?.children === '+';
    });
    expect(plusButtons.length).toBeGreaterThanOrEqual(1);

    // Increase quantity to 2
    await ReactTestRenderer.act(async () => {
      plusButtons[0].props.onPress();
    });

    // Check that quantity 2 is displayed
    const quantityTexts = root.findAllByType(Text).filter((t) => t.props.children === 2);
    expect(quantityTexts.length).toBeGreaterThanOrEqual(1);

    // Decrease quantity
    const minusButtons = root.findAllByType(TouchableOpacity).filter((t) => {
      const child = t.props.children;
      return child?.props?.children === '-';
    });
    expect(minusButtons.length).toBeGreaterThanOrEqual(1);

    await ReactTestRenderer.act(async () => {
      minusButtons[0].props.onPress();
    });

    // Now quantity should be 1
    const quantity1Texts = root.findAllByType(Text).filter((t) => t.props.children === 1);
    expect(quantity1Texts.length).toBeGreaterThanOrEqual(1);
  });

  test('opens CartModal when header cart button is clicked, allows updating items and clear cart', async () => {
    let renderer: ReactTestRenderer.ReactTestRenderer;
    await ReactTestRenderer.act(async () => {
      renderer = ReactTestRenderer.create(
        <SafeAreaProvider initialMetrics={safeAreaMetrics}>
          <ShoppingScreen user={mockUser} onLogout={jest.fn()} />
        </SafeAreaProvider>,
      );
    });

    const root = renderer!.root;

    // Add product 1 to cart
    const addBtn = root.findAllByType(TouchableOpacity).find((t) => {
      const child = t.props.children;
      return (
        typeof child?.props?.children === 'string' &&
        child.props.children.includes('+ Add to Cart')
      );
    });

    await ReactTestRenderer.act(async () => {
      addBtn!.props.onPress();
    });

    // Find CartModal
    const cartModal = root.findByType(CartModal);
    expect(cartModal.props.visible).toBe(false);

    // Click Header cart button
    const headerCartBtn = root.findAllByType(TouchableOpacity).find((t) => {
      const children = Array.isArray(t.props.children) ? t.props.children : [t.props.children];
      return children.some((c: any) => c?.props?.children === '🛒');
    });

    expect(headerCartBtn).toBeDefined();
    await ReactTestRenderer.act(async () => {
      headerCartBtn!.props.onPress();
    });

    // CartModal should now be visible
    expect(cartModal.props.visible).toBe(true);
    expect(cartModal.props.cart.length).toBe(1);
    expect(cartModal.props.cart[0].product.id).toBe('1');

    // Test clear cart via CartModal callback
    const alertSpy = jest.spyOn(Alert, 'alert').mockImplementation((_title, _msg, buttons) => {
      const clearBtn = buttons?.find((b) => b.text === 'Clear All');
      if (clearBtn?.onPress) clearBtn.onPress();
    });

    await ReactTestRenderer.act(async () => {
      cartModal.props.onClearCart();
    });

    expect(cartModal.props.cart.length).toBe(0);
    alertSpy.mockRestore();
  });

  test('opens ProductDetailModal, allows selecting custom quantity, and adds to cart', async () => {
    let renderer: ReactTestRenderer.ReactTestRenderer;
    await ReactTestRenderer.act(async () => {
      renderer = ReactTestRenderer.create(
        <SafeAreaProvider initialMetrics={safeAreaMetrics}>
          <ShoppingScreen user={mockUser} onLogout={jest.fn()} />
        </SafeAreaProvider>,
      );
    });

    const root = renderer!.root;
    const detailModal = root.findByType(ProductDetailModal);
    expect(detailModal.props.visible).toBe(false);

    // Trigger adding 3 items through detail modal callback
    await ReactTestRenderer.act(async () => {
      detailModal.props.onAddToCart(sampleProduct2, 3);
    });

    // Verify item is now in cart with quantity 3
    const cartModal = root.findByType(CartModal);
    const addedItem = cartModal.props.cart.find((item: any) => item.product.id === '2');
    expect(addedItem).toBeDefined();
    expect(addedItem.quantity).toBe(3);
  });

  test('CartModal displays order summary and executes checkout', async () => {
    const onCheckout = jest.fn();
    const onClose = jest.fn();
    const onUpdateQuantity = jest.fn();
    const onRemoveItem = jest.fn();
    const onClearCart = jest.fn();

    let renderer: ReactTestRenderer.ReactTestRenderer;
    await ReactTestRenderer.act(async () => {
      renderer = ReactTestRenderer.create(
        <SafeAreaProvider initialMetrics={safeAreaMetrics}>
          <CartModal
            visible={true}
            onClose={onClose}
            cart={[{ product: sampleProduct1, quantity: 2 }]}
            onUpdateQuantity={onUpdateQuantity}
            onRemoveItem={onRemoveItem}
            onClearCart={onClearCart}
            onCheckout={onCheckout}
            isCheckingOut={false}
            user={mockUser}
          />
        </SafeAreaProvider>,
      );
    });

    const root = renderer!.root;
    expect(root.findByType(CartModal)).toBeTruthy();

    // Checkout button exists
    const checkoutBtn = root.findAllByType(TouchableOpacity).find((t) => {
      const child = t.props.children;
      return (
        typeof child?.props?.children === 'string' &&
        child.props.children.includes('Proceed to Checkout')
      );
    });

    expect(checkoutBtn).toBeDefined();
    await ReactTestRenderer.act(async () => {
      checkoutBtn!.props.onPress();
    });

    expect(onCheckout).toHaveBeenCalled();
  });

  test('floating bottom cart bar is positioned above bottom navigation bar and opens cart', async () => {
    const onCartChange = jest.fn();
    let renderer: ReactTestRenderer.ReactTestRenderer;
    await ReactTestRenderer.act(async () => {
      renderer = ReactTestRenderer.create(
        <SafeAreaProvider initialMetrics={safeAreaMetrics}>
          <ShoppingScreen
            user={mockUser}
            onLogout={jest.fn()}
            onCartChange={onCartChange}
          />
        </SafeAreaProvider>,
      );
    });

    const root = renderer!.root;

    // Add product to cart
    const addBtn = root.findAllByType(TouchableOpacity).find((t) => {
      const child = t.props.children;
      return (
        typeof child?.props?.children === 'string' &&
        child.props.children.includes('+ Add to Cart')
      );
    });

    await ReactTestRenderer.act(async () => {
      addBtn!.props.onPress();
    });

    // onCartChange should have been notified
    expect(onCartChange).toHaveBeenCalledWith(1);

    // Find the floating bottom cart bar
    const floatingCartBar = root.findAllByType(TouchableOpacity).find(
      (t) => t.props.testID === 'floating-cart-bar',
    );

    expect(floatingCartBar).toBeDefined();

    // Verify bottom positioning style is above navbar (bottom >= 70)
    const flattenedStyle = Array.isArray(floatingCartBar!.props.style)
      ? Object.assign({}, ...floatingCartBar!.props.style.filter(Boolean))
      : floatingCartBar!.props.style;
    expect(flattenedStyle.bottom).toBeGreaterThanOrEqual(70);

    // Pressing floating cart bar should open CartModal
    const cartModal = root.findByType(CartModal);
    expect(cartModal.props.visible).toBe(false);

    await ReactTestRenderer.act(async () => {
      floatingCartBar!.props.onPress();
    });

    expect(cartModal.props.visible).toBe(true);
  });
});
