/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useState } from 'react';
import { StatusBar, StyleSheet, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { LoginScreen } from './src/screens/LoginScreen';
import { ShoppingScreen } from './src/screens/ShoppingScreen';
import { ProfileScreen } from './src/screens/ProfileScreen';
import { BottomNavBar, AppTab } from './src/components/BottomNavBar';
import { User } from './src/types';

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState<AppTab>('shop');
  const [cartCount, setCartCount] = useState<number>(0);

  const handleLoginSuccess = (loggedInUser: User) => {
    setUser(loggedInUser);
    setActiveTab('shop');
  };

  const handleLogout = () => {
    setUser(null);
    setActiveTab('shop');
    setCartCount(0);
  };

  const handleUpdateUser = (updatedUser: User) => {
    setUser(updatedUser);
  };

  return (
    <SafeAreaProvider
      initialMetrics={{
        frame: { x: 0, y: 0, width: 390, height: 844 },
        insets: { top: 0, left: 0, right: 0, bottom: 0 },
      }}
    >
      <StatusBar barStyle="light-content" backgroundColor="#0f172a" />
      <View style={styles.container}>
        {user ? (
          <View style={styles.container}>
            {activeTab === 'shop' ? (
              <ShoppingScreen
                user={user}
                onLogout={handleLogout}
                onOpenProfile={() => setActiveTab('profile')}
                onCartChange={setCartCount}
              />
            ) : (
              <ProfileScreen
                user={user}
                onLogout={handleLogout}
                onNavigateToShop={() => setActiveTab('shop')}
                onUpdateUser={handleUpdateUser}
              />
            )}
            <BottomNavBar
              activeTab={activeTab}
              onTabChange={setActiveTab}
              cartCount={cartCount}
            />
          </View>
        ) : (
          <LoginScreen onLoginSuccess={handleLoginSuccess} />
        )}
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
});

export default App;
