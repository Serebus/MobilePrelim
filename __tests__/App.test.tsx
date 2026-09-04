import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import App from '../App';
import { LoginScreen } from '../src/screens/LoginScreen';
import { ShoppingScreen } from '../src/screens/ShoppingScreen';
import { fakeStoreApi } from '../src/api/fakeStoreApi';
import { TextInput, TouchableOpacity } from 'react-native';

const safeAreaMetrics = {
  frame: { x: 0, y: 0, width: 390, height: 844 },
  insets: { top: 0, left: 0, right: 0, bottom: 0 },
};

describe('Shopping App & Authentication', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test('renders Login screen by default with all essential elements', async () => {
    let renderer: ReactTestRenderer.ReactTestRenderer;
    await ReactTestRenderer.act(async () => {
      renderer = ReactTestRenderer.create(<App />);
    });

    const root = renderer!.root;
    expect(root.findByType(LoginScreen)).toBeTruthy();

    const inputs = root.findAllByType(TextInput);
    expect(inputs.length).toBe(2); // Email, Password

    const buttons = root.findAllByType(TouchableOpacity);
    expect(buttons.length).toBeGreaterThanOrEqual(4);
  });

  test('switches between Sign In and Sign Up modes', async () => {
    const onLoginSuccess = jest.fn();
    let renderer: ReactTestRenderer.ReactTestRenderer;

    await ReactTestRenderer.act(async () => {
      renderer = ReactTestRenderer.create(
        <SafeAreaProvider initialMetrics={safeAreaMetrics}>
          <LoginScreen onLoginSuccess={onLoginSuccess} />
        </SafeAreaProvider>,
      );
    });

    const root = renderer!.root;

    // Initially 2 inputs (Email, Password)
    expect(root.findAllByType(TextInput).length).toBe(2);

    // Find the Sign Up tab button and press it
    const touchables = root.findAllByType(TouchableOpacity);
    const signUpTab = touchables.find((t) =>
      t.props.children?.props?.children === 'Sign Up' ||
      (Array.isArray(t.props.children) &&
        t.props.children.some((c: any) => c?.props?.children === 'Sign Up'))
    );

    if (signUpTab) {
      await ReactTestRenderer.act(async () => {
        signUpTab.props.onPress();
      });

      // In Sign Up mode: 4 inputs (Name, Email, Password, Confirm Password)
      expect(root.findAllByType(TextInput).length).toBe(4);
    }
  });

  test('allows guest login to proceed directly', async () => {
    const onLoginSuccess = jest.fn();
    let renderer: ReactTestRenderer.ReactTestRenderer;

    await ReactTestRenderer.act(async () => {
      renderer = ReactTestRenderer.create(
        <SafeAreaProvider initialMetrics={safeAreaMetrics}>
          <LoginScreen onLoginSuccess={onLoginSuccess} />
        </SafeAreaProvider>,
      );
    });

    const root = renderer!.root;
    const touchables = root.findAllByType(TouchableOpacity);
    const guestBtn = touchables.find((t) =>
      typeof t.props.children?.props?.children === 'string' &&
      t.props.children.props.children.includes('Guest')
    );

    expect(guestBtn).toBeDefined();
    await ReactTestRenderer.act(async () => {
      guestBtn!.props.onPress();
    });

    expect(onLoginSuccess).toHaveBeenCalledWith(
      expect.objectContaining({
        isGuest: true,
      }),
    );
  });

  test('allows quick demo login to succeed with simulated timer', async () => {
    const onLoginSuccess = jest.fn();
    let renderer: ReactTestRenderer.ReactTestRenderer;

    await ReactTestRenderer.act(async () => {
      renderer = ReactTestRenderer.create(
        <SafeAreaProvider initialMetrics={safeAreaMetrics}>
          <LoginScreen onLoginSuccess={onLoginSuccess} />
        </SafeAreaProvider>,
      );
    });

    const root = renderer!.root;
    const touchables = root.findAllByType(TouchableOpacity);
    const demoBtn = touchables.find((t) =>
      typeof t.props.children?.props?.children === 'string' &&
      t.props.children.props.children.includes('Demo')
    );

    expect(demoBtn).toBeDefined();
    await ReactTestRenderer.act(async () => {
      demoBtn!.props.onPress();
    });

    await ReactTestRenderer.act(async () => {
      jest.advanceTimersByTime(600);
    });

    expect(onLoginSuccess).toHaveBeenCalledWith(
      expect.objectContaining({
        email: 'shopper@market.com',
      }),
    );
  });

  test('renders Shopping screen with FakeStoreAPI products, allows add to cart and checkout', async () => {
    const mockUser = {
      id: 'usr_test_1',
      name: 'Alex Johnson',
      email: 'alex@example.com',
      isGuest: false,
    };
    const mockLogout = jest.fn();

    const sampleProducts = [
      {
        id: '1',
        name: 'Fjallraven - Foldsack No. 1 Backpack',
        price: 109.95,
        category: "men's clothing",
        rating: 3.9,
        reviewsCount: 120,
        description: 'Your perfect pack for everyday use',
        icon: '👔',
        inStock: true,
      },
    ];

    const getCategoriesSpy = jest
      .spyOn(fakeStoreApi, 'getCategories')
      .mockResolvedValue(['all', "men's clothing", 'electronics']);
    const getProductsSpy = jest
      .spyOn(fakeStoreApi, 'getProducts')
      .mockResolvedValue(sampleProducts);

    let renderer: ReactTestRenderer.ReactTestRenderer;
    await ReactTestRenderer.act(async () => {
      renderer = ReactTestRenderer.create(
        <SafeAreaProvider initialMetrics={safeAreaMetrics}>
          <ShoppingScreen user={mockUser} onLogout={mockLogout} />
        </SafeAreaProvider>,
      );
    });

    const root = renderer!.root;
    expect(root.findByType(ShoppingScreen)).toBeTruthy();

    // Add first item to cart
    const touchables = root.findAllByType(TouchableOpacity);
    const addBtn = touchables.find((t) =>
      typeof t.props.children?.props?.children === 'string' &&
      t.props.children.props.children.includes('Add to Cart')
    );

    expect(addBtn).toBeDefined();
    await ReactTestRenderer.act(async () => {
      addBtn!.props.onPress();
    });

    // Check that checkout button appears
    const checkoutBtn = root.findAllByType(TouchableOpacity).find((t) =>
      typeof t.props.children?.props?.children === 'string' &&
      t.props.children.props.children.includes('Checkout')
    );
    expect(checkoutBtn).toBeDefined();

    // Trigger Checkout
    await ReactTestRenderer.act(async () => {
      checkoutBtn!.props.onPress();
    });

    getCategoriesSpy.mockRestore();
    getProductsSpy.mockRestore();
  });

  test('fakeStoreApi supports getProducts, category filter, getCategories, and checkout', async () => {
    const allProducts = await fakeStoreApi.getProducts();
    expect(allProducts.length).toBeGreaterThan(0);

    const electronics = await fakeStoreApi.getProducts({ category: 'electronics' });
    expect(electronics.length).toBeGreaterThan(0);
    expect(electronics.every((p) => p.category.toLowerCase() === 'electronics')).toBe(true);

    const searchResults = await fakeStoreApi.getProducts({ search: 'Backpack' });
    expect(searchResults.length).toBeGreaterThanOrEqual(1);
    expect(searchResults[0].name).toContain('Backpack');

    const categories = await fakeStoreApi.getCategories();
    expect(categories).toContain('all');
    expect(categories).toContain('electronics');

    const singleProduct = await fakeStoreApi.getProductById(1);
    expect(singleProduct).not.toBeNull();
    expect(singleProduct?.name).toBeDefined();

    const checkoutRes = await fakeStoreApi.checkout(
      [{ product: singleProduct!, quantity: 2 }],
      { id: 'u1', name: 'User Test', email: 'test@user.com' },
    );
    expect(checkoutRes.status).toBe('confirmed');
    expect(checkoutRes.totalAmount).toBe(singleProduct!.price * 2);
    expect(checkoutRes.orderId).toContain('FS-ORD-');
  });
});
