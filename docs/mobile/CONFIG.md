# Mobile Configuration (Local Dev)

This mobile app needs a backend API base URL to make requests.

Sensitive values (local IPs, URLs, etc.) are **not committed** to GitHub. Developers provide their own local configuration during development.

## API Base URL

The app reads the API base URL from an environment variable:

- `EXPO_PUBLIC_API_URL`

Example values (local dev):
- `http://localhost:3002` (simulator on same machine)
- `http://<LAN_IP>:3002` (physical phone on same Wi-Fi network)

> Note: For a physical device, `localhost` will point to the phone itself, not your computer. Use your computer’s LAN IP.

## Where it’s set

Developers can set `EXPO_PUBLIC_API_URL` locally (gitignored), for example:

- `.env` (gitignored)
- shell environment variables
- local dev tooling / editor run configurations

## Usage in code

API service files should use this value as the base URL for all requests. For example, an API client can read the value and prepend it to all endpoint paths.

## Token Storage

The mobile app stores authentication tokens using two different strategies:

- `accessToken`
  - stored in memory only through `AuthContext`
  - used for authenticated API requests
  - cleared when the app closes or the user logs out

- `refreshToken`
  - stored securely on device using `expo-secure-store`
  - accessed through `services/tokenStorage.ts`
  - used to support future auto-login / token refresh flow

## Current Auth Implementation Status

The current mobile implementation includes:

- auth bootstrap on app start
- refresh token lookup from secure storage
- login/logout using the backend API
- secure refresh token persistence
- initialization gate using `isInitializing`
- authenticated API requests using in-memory access tokens
- guest checkout support
- password recovery
- Expo push notification registration after login

## Installed Mobile Dependencies

Authentication

- `expo-secure-store`
  - Secure refresh token storage

Notifications

- `expo-notifications`
  - Push notification registration
  - Foreground notification handling

## Expo Configuration

The mobile app is configured through `app.json`.

Current configuration includes:

- application icons
- splash screen
- Expo Router
- Secure Store
- EAS project configuration
- Expo project ID (required for push notifications)