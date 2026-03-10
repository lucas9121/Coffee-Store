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
- future token refresh flow

### Current Auth Behavior

On app start, `AuthProvider` runs `bootstrapAuth()`.

Current bootstrap flow:

1. read refresh token from secure storage
2. set `hasRefreshToken`
3. set `isInitializing` to `false`

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

## Local Component State

Screens manage local UI state using `useState`.

Examples:

- form inputs
- cart contents
- menu filters
- temporary screen-level UI flags

## Reusable Themed Components

The app currently includes reusable theme-aware wrappers:

- `ThemedText`
- `ThemedView`
- `ThemedTextInput`

These help keep light/dark mode behavior consistent across screens and reduce repeated styling logic.