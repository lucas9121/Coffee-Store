# Project Status

## Completed

### Backend
- Backend architecture (Express + MongoDB monorepo)
- MongoDB data models
  - Order
  - OrderItem
  - StoreSettings
  - User
- Order creation
  - Server-side price locking
  - Total calculation
  - Store open/close enforcement
  - Guest and authenticated checkout
  - Order ownership for authenticated users
- Store management
  - Weekly schedule
  - Manual open/close override
  - Public store status endpoints
- Authentication
  - JWT access tokens
  - Refresh token flow
  - Role-based authorization
  - Logout token revocation
  - Password recovery using security questions
- User features
  - Favorites
  - Recent purchases
  - Expo push token registration
- Push notification support
  - Stores Expo push tokens
  - Sends notifications for:
    - IN PROGRESS
    - READY
    - COMPLETED
- Authorization middleware
  - `requireAuth`
  - `authorizeRoles`
  - `optionalAuth`
- Full automated testing
  - Controllers
  - Routes
  - Middleware
  - Models
- Development seed data
- API contracts documented

### Mobile App
- Mobile application architecture
- Theme system
  - Light/Dark mode
  - Design tokens
  - Shared themed components
- Shared UI components
  - AppHeader
  - ThemedButton
  - Card
  - Inputs
  - ScrollView
- Authentication
  - Login
  - Signup
  - Logout
  - Forgot Password
  - Guest checkout flow
- Customer experience
  - Home dashboard
  - Live latest order
  - Store status
  - Quick actions
  - Announcements
  - Menu browsing
  - Cart
  - Checkout
  - Favorites
- Worker experience
  - Order management
  - In-person ordering
  - Store open/close controls
- Notifications
  - Push notification registration
  - Foreground notification handling
- Loading screen
- App icons
- Navigation
  - Role-based tabs
  - Authentication modals

### Admin Web
- Vite + React application initialized
- React Router configured
- Admin authentication foundation
  - Login using shared backend authentication
  - Admin-only account validation
  - Protected routes
  - Session persistence using `sessionStorage`
  - Admin access token stored for the browser session
- Shared authenticated API request helper
  - Sends admin access token with protected backend requests
  - Handles JSON responses and API errors

## In Progress
### Admin Web
- Dashboard
  - Initial dashboard shell
  - Analytics required for V1 and scheduled for completion after core management pages
- Menu management
- User/account management
- Weekly store schedule management
- Admin account settings
- Admin logout flow
- Catedral Café web visual system

## Planned
- Production deployment
- CI/CD pipeline
- App Store & Google Play release
- Face ID / biometric login