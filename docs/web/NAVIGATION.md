# Admin Web Navigation – ChurchKiosk

The admin web uses React Router.

All administration routes except Login require an authenticated admin account.

---

# Primary Navigation

- Dashboard
- Menu
- Users
- Schedule

Admin account actions are accessed through the profile/avatar menu rather than the primary navigation.

Profile menu:

- Settings
- Logout

---

# Routes

## /login

Public route.

Allows administrators to authenticate using the shared ChurchKiosk backend.

Non-admin accounts are not permitted to access the admin dashboard.

---

## /

Protected route.

Admin Dashboard and V1 analytics landing page.

---

## /menu

Protected route.

Menu management.

---

## /users

Protected route.

User and account-role management.

---

## /schedule

Protected route.

Weekly store schedule management.

---

## /settings

Protected route.

Settings for the currently authenticated admin account.