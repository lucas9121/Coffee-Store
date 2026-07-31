# Mobile State Management

The mobile app uses React Context for global state and `useState` for local screen state.

## AuthContext

`AuthContext` manages auth/session-related state for the mobile app.

### Stores

- `accountType`
- `setAccountType`
- `accessToken`
- `setAccessToken`
- `isInitializing`
- `setIsInitializing`
- `hasRefreshToken`
- `login`
- `logout`

### Purpose

Used for:

- role-based UI behavior
- auth/session state
- app-start auth initialization
- login/logout actions
- authenticated API requests
- push notification registration after login
- future token refresh flow

### Current Auth Behavior

On app start, `AuthProvider` runs `bootstrapAuth()`.

Current bootstrap flow:

1. read refresh token from secure storage
2. set `hasRefreshToken`
3. complete auth initialization
4. set `isInitializing` to `false`

This allows the app to pause UI rendering until auth initialization finishes.

### Token Responsibilities

- `accessToken`
  - stored in memory only
  - used for authenticated API requests
- `refreshToken`
  - stored outside context in secure device storage
  - managed through `services/tokenStorage.ts`

### Context Actions

#### `login(accessToken, refreshToken, accountType)`

Current behavior:

- saves refresh token to secure storage
- stores access token in memory
- updates account type
- marks refresh token as present
- ends initialization state

#### `logout()`

Current behavior:

- deletes refresh token from secure storage
- clears access token
- resets account type to `guest`
- resets refresh token state

## ThemeContext

`ThemeContext` manages app theme mode.

### Stores

- `themeMode`
- `setThemeMode`

### Modes

- `system`
- `light`
- `dark`

## CartContext

`CartContext` manages the customer's shopping cart.

### Stores

- `cartItems`
- `setCartItems`

### Purpose

Used for:

- cart persistence during the current session
- quantity updates
- checkout
- floating cart badge

## OrderContext

`OrderContext` manages the customer's latest order.

### Stores

- `latestOrderId`
- `setLatestOrderId`

### Purpose

Used for:

- tracking the most recent order
- displaying live order status on the Home screen
- polling for status changes after checkout

## Local Component State

Screens manage local UI state using `useState`.

Examples:

- form inputs
- cart contents
- menu filters
- temporary screen-level UI flags

## Reusable Themed Components

The app includes reusable theme-aware UI primitives:

- `ThemedButton`
- `ThemedScrollView`
- `ThemedText`
- `ThemedTextInput`
- `ThemedView`

Higher-level shared components include:

- `AppHeader`
- `Card`
- `LoginForm`
- `Section`
