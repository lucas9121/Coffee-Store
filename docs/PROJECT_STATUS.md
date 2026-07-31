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

## In Progress
- Admin web dashboard

## Planned
- Production deployment
- CI/CD pipeline
- App Store & Google Play release
- Face ID / biometric login