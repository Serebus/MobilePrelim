import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import { Alert, Switch, Text, TextInput, TouchableOpacity } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import App from '../App';
import { ProfileScreen } from '../src/screens/ProfileScreen';
import { ShoppingScreen } from '../src/screens/ShoppingScreen';
import { BottomNavBar } from '../src/components/BottomNavBar';
import { CustomButton } from '../src/components/CustomButton';
import { fakeStoreApi } from '../src/api/fakeStoreApi';
import { User } from '../src/types';

const safeAreaMetrics = {
  frame: { x: 0, y: 0, width: 390, height: 844 },
  insets: { top: 0, left: 0, right: 0, bottom: 0 },
};

const mockUser: User = {
  id: 'usr_jane_doe',
  name: 'Jane Doe',
  email: 'jane.doe@example.com',
  isGuest: false,
  phone: '+1 (555) 987-6543',
  address: '123 Main Street',
  city: 'San Francisco, CA',
  zipCode: '94105',
  ordersCount: 14,
  rewardPoints: 520,
};

describe('ProfileScreen & Navigation Flow', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.spyOn(fakeStoreApi, 'getCategories').mockResolvedValue(['all', 'electronics']);
    jest.spyOn(fakeStoreApi, 'getProducts').mockResolvedValue([]);
  });

  afterEach(() => {
    jest.restoreAllMocks();
    jest.useRealTimers();
  });

  test('renders user identity, initials avatar, and statistics correctly', async () => {
    let renderer: ReactTestRenderer.ReactTestRenderer;
    await ReactTestRenderer.act(async () => {
      renderer = ReactTestRenderer.create(
        <SafeAreaProvider initialMetrics={safeAreaMetrics}>
          <ProfileScreen user={mockUser} onLogout={jest.fn()} />
        </SafeAreaProvider>,
      );
    });

    const root = renderer!.root;

    // Check user name & email display
    const texts = root.findAllByType(Text);
    const hasName = texts.some((t) => t.props.children === 'Jane Doe');
    const hasEmail = texts.some((t) => t.props.children === 'jane.doe@example.com');
    const hasInitials = texts.some((t) => t.props.children === 'JD');

    expect(hasName).toBe(true);
    expect(hasEmail).toBe(true);
    expect(hasInitials).toBe(true);

    // Check stat numbers
    const hasOrdersCount = texts.some((t) => t.props.children === 14);
    const hasRewardPoints = texts.some((t) => t.props.children === 520);
    expect(hasOrdersCount).toBe(true);
    expect(hasRewardPoints).toBe(true);
  });

  test('toggles preference switches like push notifications and dark mode', async () => {
    let renderer: ReactTestRenderer.ReactTestRenderer;
    await ReactTestRenderer.act(async () => {
      renderer = ReactTestRenderer.create(
        <SafeAreaProvider initialMetrics={safeAreaMetrics}>
          <ProfileScreen user={mockUser} onLogout={jest.fn()} />
        </SafeAreaProvider>,
      );
    });

    const root = renderer!.root;
    const switches = root.findAllByType(Switch);
    expect(switches.length).toBe(4);

    // Toggle the first switch (Push Notifications)
    const pushSwitch = switches[0];
    expect(pushSwitch.props.value).toBe(true);

    await ReactTestRenderer.act(async () => {
      pushSwitch.props.onValueChange(false);
    });

    expect(switches[0].props.value).toBe(false);
  });

  test('opens edit modal and updates profile info', async () => {
    const onUpdateUser = jest.fn();
    const alertSpy = jest.spyOn(Alert, 'alert');

    let renderer: ReactTestRenderer.ReactTestRenderer;
    await ReactTestRenderer.act(async () => {
      renderer = ReactTestRenderer.create(
        <SafeAreaProvider initialMetrics={safeAreaMetrics}>
          <ProfileScreen
            user={mockUser}
            onLogout={jest.fn()}
            onUpdateUser={onUpdateUser}
          />
        </SafeAreaProvider>,
      );
    });

    const root = renderer!.root;

    // Click edit profile button
    const editBtn = root.findByProps({ testID: 'edit-profile-button' });
    await ReactTestRenderer.act(async () => {
      editBtn.props.onPress();
    });

    // Modal inputs should appear
    const inputs = root.findAllByType(TextInput);
    expect(inputs.length).toBeGreaterThanOrEqual(4);

    // Update name input
    const nameInput = inputs[0];
    await ReactTestRenderer.act(async () => {
      nameInput.props.onChangeText('Jane Smith');
    });

    // Press save button in modal
    const saveBtn = root.findByProps({ testID: 'modal-save-button' });
    await ReactTestRenderer.act(async () => {
      saveBtn.props.onPress();
    });

    expect(onUpdateUser).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'Jane Smith',
      }),
    );
    expect(alertSpy).toHaveBeenCalledWith(
      'Profile Updated',
      'Your profile information has been saved.',
    );
  });

  test('prompts confirmation when clicking Sign Out button', async () => {
    const onLogout = jest.fn();
    const alertSpy = jest.spyOn(Alert, 'alert');

    let renderer: ReactTestRenderer.ReactTestRenderer;
    await ReactTestRenderer.act(async () => {
      renderer = ReactTestRenderer.create(
        <SafeAreaProvider initialMetrics={safeAreaMetrics}>
          <ProfileScreen user={mockUser} onLogout={onLogout} />
        </SafeAreaProvider>,
      );
    });

    const root = renderer!.root;
    const signOutBtn = root.findByProps({ testID: 'sign-out-button' });

    await ReactTestRenderer.act(async () => {
      signOutBtn.props.onPress();
    });

    expect(alertSpy).toHaveBeenCalledWith(
      'Sign Out',
      'Are you sure you want to sign out of your account?',
      expect.any(Array),
    );

    // Simulate clicking "Sign Out" inside alert
    const alertButtons = alertSpy.mock.calls[0][2];
    const confirmAction = alertButtons?.find((b: any) => b.text === 'Sign Out');
    confirmAction?.onPress?.();

    expect(onLogout).toHaveBeenCalled();
  });

  test('switches tabs between Shop and Profile seamlessly in App', async () => {
    let renderer: ReactTestRenderer.ReactTestRenderer;
    await ReactTestRenderer.act(async () => {
      renderer = ReactTestRenderer.create(<App />);
    });

    const root = renderer!.root;

    // Perform guest login to enter the authenticated screens
    const touchables = root.findAllByType(TouchableOpacity);
    const guestBtn = touchables.find((t) =>
      typeof t.props.children?.props?.children === 'string' &&
      t.props.children.props.children.includes('Guest'),
    );
    expect(guestBtn).toBeDefined();

    await ReactTestRenderer.act(async () => {
      guestBtn!.props.onPress();
    });

    // Now ShoppingScreen and BottomNavBar are rendered
    expect(root.findByType(ShoppingScreen)).toBeTruthy();
    expect(root.findByType(BottomNavBar)).toBeTruthy();

    // Switch to Profile via BottomNavBar
    const profileTabBtn = root.findByProps({ testID: 'tab-profile' });
    await ReactTestRenderer.act(async () => {
      profileTabBtn.props.onPress();
    });

    // ProfileScreen should now be rendered
    expect(root.findByType(ProfileScreen)).toBeTruthy();

    // Switch back to Shop via BottomNavBar
    const shopTabBtn = root.findByProps({ testID: 'tab-shop' });
    await ReactTestRenderer.act(async () => {
      shopTabBtn.props.onPress();
    });

    // ShoppingScreen is active again
    expect(root.findByType(ShoppingScreen)).toBeTruthy();
  });

  test('renders custom reusable button with different variants', () => {
    const onPress = jest.fn();
    let renderer: ReactTestRenderer.ReactTestRenderer;

    ReactTestRenderer.act(() => {
      renderer = ReactTestRenderer.create(
        <CustomButton
          title="Click Me"
          onPress={onPress}
          variant="outline"
          size="small"
          icon="⭐"
        />,
      );
    });

    const root = renderer!.root;
    const btn = root.findByType(TouchableOpacity);
    ReactTestRenderer.act(() => {
      btn.props.onPress();
    });

    expect(onPress).toHaveBeenCalled();
  });
});
