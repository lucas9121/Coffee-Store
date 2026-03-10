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

Current auth route:

- `/login`

> Note: Route group names like `(tabs)` and `(auth)` help organize files, but they are not part of the public route path.

## Navigation Hierarchy
```
RootLayout
  ├ (tabs)
  │   ├ Home
  │   ├ Orders
  │   └ Settings
  ├ (auth)
  │   └ Login
  └ Modal
```
All tabs are visible to every role.

Content inside each tab changes based on `accountType`.

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
  - uses `router.push("/login")`
- Login success → App
  - uses `router.replace("/")`

This pattern is also intended for future flows such as checkout success, where returning to a completed screen should not be allowed.