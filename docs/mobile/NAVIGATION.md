# Mobile Navigation

Navigation is implemented using Expo Router.

## Top Level Structure
```
RootLayout
  └ ThemeProviderCustom
      └ AuthProvider
          └ InnerLayout
              ├ Tabs Navigator
              │   ├ Home
              │   ├ Orders
              │   └ Settings
              └ Modal
```
## Route Groups

The mobile app currently uses two route groups:

- `(tabs)`
  - main bottom-tab application flow
- `(auth)`
  - authentication-related screens

Current auth routes:

- `/login`
- `/signup`
- `/forgot-password`

> Note: Route group names like `(tabs)` and `(auth)` help organize files, but they are not part of the public route path.

## Navigation Hierarchy
```
RootLayout
  ├ (tabs)
  │   ├ Home
  │   ├ Orders
  │   └ Settings
  ├ (auth)
  │   ├ Login
  │   ├ Signup
  │   └ Forgot Password
  ├ Cart (Modal)
  └ Guest Checkout (Modal)
```
All tabs are visible to every role.

Content inside each tab changes based on `accountType`.

## Shared Screen Components

To reduce duplication and keep screens consistent, reusable components are shared across multiple routes.

Current shared components include:

- `LoginForm`
  - Used by the Login screen and Guest Settings.
- `AppHeader`
  - Shared page header used across the main application tabs.
- `Card`
  - Shared content container used throughout the customer dashboard and other screens.

## Auth Initialization Gate

`InnerLayout` reads `isInitializing` from `AuthContext`.

Behavior:

- while `isInitializing === true`
  - app shows a loading screen
- when initialization completes
  - app renders the normal navigator

This prevents the app from rendering the wrong screen before auth state is restored.

## Current Navigation Usage Patterns

General rule:

- `router.push(...)`
  - move to a new screen and keep history
- `router.replace(...)`
  - replace the current screen so the user cannot navigate back to it

Current usage examples:

- Settings → Login
  - `router.push("/login")`
- Login → Forgot Password
  - `router.push("/forgot-password")`
- Login → Sign Up
  - `router.push("/signup")`
- Guest Checkout Required
  - `router.push("/login?fromCheckout=true")`
- Login success
  - Checkout flow → `router.replace("/cart")`
  - Normal login → `router.replace("/")`
- Checkout
  - Cart opens as a modal
- Guest Checkout
  - Opens as a modal from Login when checkout is initiated

This pattern prevents users from returning to completed authentication or checkout flows while preserving normal forward navigation where appropriate.