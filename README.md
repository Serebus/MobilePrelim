# MobilePrelim — Multi-Screen Mobile E-Commerce App

A cross-platform React Native mobile application built from scratch featuring multi-screen navigation, reusable custom UI components, interactive e-commerce catalog and cart management, user profile settings, and third-party library integration.

---

## 📋 Student & Project Information

| Field | Details |
|---|---|
| **Project Title** | Static Multi-Screen Mobile App with Navigation & Third-Party Integration |
| **Student Name** | *[Insert Student Name]* |
| **Section / Course** | *[Insert Course / Section, e.g., CS-301 / Section A]* |
| **Framework** | React Native (v0.86+) / TypeScript |
| **API / Data Source** | FakeStoreAPI with offline local mock fallbacks |

---

## 📱 Primary Screens

The application includes **three primary screens**, each serving a distinct role:

### 1. `LoginScreen` (`src/screens/LoginScreen.tsx`)
- **Role**: User authentication and guest onboarding.
- **Features**:
  - Email & password form with real-time validation and error feedback.
  - Password visibility toggle.
  - One-click **"Continue as Guest"** option for instant access.
  - Auto-fills predefined demo credentials for quick testing.

### 2. `ShoppingScreen` (`src/screens/ShoppingScreen.tsx`)
- **Role**: Product discovery, catalog browsing, and cart operations.
- **Features**:
  - Live search filter by product title and description.
  - Interactive category filter chips (All, Electronics, Jewelery, Men's Clothing, Women's Clothing).
  - Product grid with rating stars, price tags, and quick "Add to Cart" action.
  - **Product Detail Modal** for deep-dive specifications and quantity selection.
  - **Cart Drawer Modal** with line-item management (+ / - / delete), subtotal and shipping calculation, and checkout.
  - Animated toast notifications on cart additions.
  - Top-bar shortcut to Profile and live cart badge.

### 3. `ProfileScreen` (`src/screens/ProfileScreen.tsx`)
- **Role**: Account management, personal stats, order history, and preferences.
- **Features**:
  - User avatar with initials and dynamic membership badge (Gold / Guest).
  - Quick statistics counters: Total Orders, Rewards Points, Wishlist items, and Coupons.
  - Personal information cards (Email, Phone, Shipping Address).
  - Interactive Order History with viewable order receipt details.
  - Interactive preference switches: *Push Notifications*, *SMS Alerts*, *Dark Theme*, and *Biometric Login*.
  - **Edit Profile Modal** allowing updates to name, phone, address, city, and zip code with live app state sync.
  - Sign-out confirmation dialog returning safely to the login screen.

---

## 🧩 Reusable Custom Components

The project includes modular, reusable custom UI components located in `src/components/`:

1. **`CustomButton` (`src/components/CustomButton.tsx`)**:
   - Universal, accessible button component with multiple styling variants (`primary`, `secondary`, `outline`, `danger`, `ghost`) and sizes (`small`, `medium`, `large`).
   - Supports loading indicators, emoji icons, disabled states, and custom styles. Reused throughout the app.
2. **`BottomNavBar` (`src/components/BottomNavBar.tsx`)**:
   - Reusable bottom navigation tab bar managing transitions between `'shop'` and `'profile'` tabs.
   - Includes real-time cart item count badge and safe area bottom inset padding.
3. **`CartModal` (`src/components/CartModal.tsx`)**:
   - Reusable slide-up modal drawer for viewing cart contents, modifying item quantities, reviewing order breakdowns, and completing checkout.
4. **`ProductDetailModal` (`src/components/ProductDetailModal.tsx`)**:
   - Reusable modal dialog for inspecting product images, full descriptions, category tags, ratings, and quantity selectors.

---

## 📦 Third-Party Packages Used

| Package | Version | Purpose & Integration |
|---|---|---|
| **`react-native-safe-area-context`** | `^5.5.2` | Actively integrated via `SafeAreaProvider` at the app root and `useSafeAreaInsets` across all 3 screens (`LoginScreen`, `ShoppingScreen`, `ProfileScreen`) and `BottomNavBar` to handle device notches, dynamic islands, and bottom system navigation bars. |

---

## 🗺️ Navigation Flow

```
[ Launch App ]
       │
       ▼
 [ LoginScreen ] ─── (Sign In / Guest) ───┐
       ▲                                  │
       │ (Sign Out)                       ▼
       └───────────────────────── [ Main App View ]
                                     ├── Tab 1: [ ShoppingScreen ]
                                     │     ├── [ ProductDetailModal ]
                                     │     └── [ CartModal ]
                                     │
                                     └── Tab 2: [ ProfileScreen ]
                                           ├── [ Edit Profile Modal ]
                                           └── [ Order Details Dialog ]
```

- **Authentication Flow**: State-based auth guard in `App.tsx`. Logging out resets user state and returns to `LoginScreen`.
- **Tab Navigation**: Seamless switching between the Shop and Profile views via `BottomNavBar` or the header profile button.

---

## 🚀 How to Run the Project

### Prerequisites
- [Node.js](https://nodejs.org/) (version >= 22.11.0 recommended)
- `npm` or `yarn`
- Android Studio (for Android Emulator) or Xcode (for iOS Simulator)

### 1. Install Dependencies
```sh
npm install
```

### 2. Start Metro Dev Server
```sh
npm start
```

### 3. Run on Android or iOS
In a separate terminal window:

- **Android**:
  ```sh
  npm run android
  ```
- **iOS** (macOS only):
  ```sh
  bundle exec pod install   # only on initial setup
  npm run ios
  ```

---

## 🧪 Automated Testing & Code Quality

The project includes a comprehensive Jest test suite covering all screens, navigation, and user interactions.

### Run Unit & Integration Tests:
```sh
npm test
```
*Current test suite: **3 test suites, 16 tests passing 100%**.*

### Run Linter & Type Checks:
```sh
npm run lint
npx tsc --noEmit
```

---

## 🎥 Demonstration Video Guide (1–2 minutes)

When recording your demo video, follow this recommended walkthrough:
1. **Login**: Show the login screen, enter credentials (or click guest), and sign in.
2. **Shopping Screen**: Search for a product, switch categories, open a product detail modal, and add items to the cart.
3. **Cart Drawer**: Open the cart modal, adjust quantities (+/-), verify total calculation, and proceed to checkout.
4. **Profile Screen**: Tap the bottom tab to navigate to the Profile screen, toggle settings switches, open the "Edit Profile" modal, update profile details, and save.
5. **Sign Out**: Click Sign Out to verify navigation back to the Login screen.
