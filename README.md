# ChurchKiosk ☕📱

ChurchKiosk is a mobile-first ordering system for a church coffee kiosk.  
It allows customers to place orders from their phones while enabling workers to efficiently manage those orders in real time.

---

## Overview

ChurchKiosk provides a streamlined ordering experience similar to modern coffee shop apps, while maintaining operational control for workers and administrators.

Core capabilities include:

- Mobile ordering (guest or authenticated)
- Real-time order status updates
- Worker-managed order flow
- Store schedule enforcement (with manual overrides)
- Secure authentication and role-based access

---

## User Roles

The system supports multiple roles with different experiences:

### Guest
- Browse menu
- Place orders without an account

### User (Customer)
- Place orders
- View order status
- Favorites and recently ordered items

### Worker
- View and manage incoming orders
- Update order status
- Enter in-person orders
- Control store open/close status

### Admin (Planned)
- Manage menu, users, and store settings via web dashboard

---

## Ordering System

- Orders can be placed by guests or authenticated users
- Store must be open to accept orders
- Prices are locked at time of purchase
- Totals are calculated server-side

Order lifecycle:

- PLACED → IN_PROGRESS → READY → COMPLETED / CANCELLED

Workers update order status throughout preparation.

---

## Store Behavior

- Weekly operating schedule
- Manual open/close override with expiration

When the store is closed:
- Menu is still visible
- Ordering is disabled

All store logic is enforced on the backend.

---

## Authentication & Security

- JWT-based authentication
- Role-based access control
- Refresh token flow (customers only)
- Passwords hashed with bcrypt
- Security question answers hashed
- Refresh tokens stored as hashed values (SHA-256)

---

## Tech Stack

### Backend
- Node.js
- Express
- MongoDB (Mongoose)
- Jest

### Mobile
- React Native (Expo)
- TypeScript
- Context API
- SecureStore

---

## Current Status

- Backend: Complete and fully tested
- Mobile App: MVP complete
- Worker tools: In progress
- Admin dashboard: Planned

---

## Screenshots

Screenshots coming soon.

<!-- ### Home Screen
![Home](./docs/images/home.png)

### Cart
![Cart](./docs/images/cart.png)

### Order Status
![Order](./docs/images/order.png)

### Worker Dashboard
![Worker](./docs/images/worker.png) -->