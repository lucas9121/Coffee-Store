# Admin Web Features – ChurchKiosk

The ChurchKiosk admin web application is the administration interface for Catedral Café.

Admin functionality remains web-only. Worker operational functionality remains primarily in the mobile application.

---

# V1 Features

## Dashboard

The Dashboard is the admin landing page.

V1 requires analytics and reporting functionality.

During initial development, the Dashboard may contain an analytics placeholder while the core administration pages are completed. Analytics must be completed before the V1 production release.

---

## Menu Management

Admins can:

- View menu items
- Create menu items
- Edit menu items
- Change item availability (`inStock`)
- Delete menu items

Menu item fields include:

- name
- price
- image
- category
- inStock

Supported categories:

- coffee
- juice
- food
- dessert

---

## User Management

Admins can:

- View registered users
- Paginate the user list
- Sort users
- Change account roles

Supported account roles:

- user
- worker
- admin

---

## Store Schedule

Admins can manage the weekly store schedule.

Manual day-to-day open/close controls remain available to workers through the mobile application.

---

## Admin Settings

The currently authenticated admin can manage their own account settings using the existing user account APIs.

Planned settings include:

- Name
- Email
- Password
- Security questions

Profile-picture support requires additional backend support and is not currently available.

---

# Intentionally Not Duplicated

The admin web does not duplicate worker functionality unless an operational need is identified.

Worker mobile functionality includes:

- Active order management
- Order status changes
- Payment status
- In-person order creation
- Manual store open/close controls

---

# Analytics

Analytics are required for V1.

The exact metrics and backend support will be defined before the Dashboard is finalized.

The frontend must not invent analytics data or depend on undocumented backend endpoints.