# Admin Web State Management – ChurchKiosk

The admin web currently uses React Context for authentication state.

---

# AuthContext

AuthContext stores:

- Admin access token
- Authenticated admin user
- Authentication status

It provides:

- login()
- logout()
- token
- user
- isAuthenticated

---

# Session Persistence

Admin authentication is persisted using browser `sessionStorage`.

Stored values:

- adminToken
- adminUser

This allows authentication to survive page refreshes during the browser session.

Admins do not receive refresh tokens.

The backend currently issues admin access tokens with a 3-hour expiration.

When the admin session is no longer valid, the user must authenticate again.

---

# Protected Routes

ProtectedRoute checks whether the current session represents an authenticated admin.

Unauthenticated users attempting to access protected web routes are redirected to `/login`.

Frontend route protection is a UI/access-control layer only.

Backend authorization remains authoritative through:

- requireAuth
- authorizeRoles("admin")

---

# Authenticated API Requests

The shared admin API helper attaches the stored admin access token to protected backend requests using the Authorization header.

This prevents individual service functions from duplicating authentication and response-handling logic.