# Project Status

## Completed
- Backend architecture (monorepo + Express API)
- MongoDB data models (Order, OrderItem, StoreSettings, User)
- Order creation logic
  - Server-side price locking
  - Total price calculation
  - Store open/close enforcement
  - Optional user `recent` purchase tracking
- Store schedule management
  - Weekly schedule
  - Manual open/close override with expiration
- Authentication system
  - JWT-based access tokens
  - Role-based access (user / worker / admin)
  - Refresh token flow for customers (mobile)
  - Logout token revocation
- Authorization middleware
  - `requireAuth`
  - `authorizeRoles`
- Full test coverage
  - Controllers
  - Routes
  - Middleware
  - Schemas
- API contracts documented
- Database seed data (development)
- Mobile wireframe (Expo / React Native)

## In Progress
- Mobile build steps (mobile-first)

## Planned
- Admin web frontend
- CI/CD pipeline
- Deployment