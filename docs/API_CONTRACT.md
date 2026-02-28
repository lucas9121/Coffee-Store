# API Contract – ChurchKiosk Backend

Base URL: http://localhost:3002

---

# Orders

## POST /orders

Creates a new order.

### Request Body
{
  "customerName": "John",
  "orderItems": [
    {
      "item": "orderItemId",
      "quantity": 2
    }
  ]
}

### Behavior
- Verifies store is open using StoreSettings + isStoreOpen()
- Validates each OrderItem exists
- Copies price into `priceAtPurchase`
- Calculates `totalPrice` server-side
- If a valid authenticated user is present on the request (`req.user`):
  - Updates the user’s `recent` purchases list
  - Ensures uniqueness and keeps a maximum of 5 items (newest first)

### Responses
- 201 → returns created order
- 403 → store is closed
- 404 → order item not found
- 500 → server error

---

## GET /orders/:id

Fetch a single order by ID.

### Responses
- 200 → returns order
- 404 → order not found
- 400 → invalid ID

---

## PATCH /orders/:id/status

Updates only the order status.

### Auth
- Requires authentication
- Allowed roles:
  - worker
  - admin

### Request Body
{
  "status": "READY"
}

### Responses
- 200 → updated order
- 404 → order not found
- 400 → invalid ID or invalid status
- 401 → unauthorized
- 403 → forbidden (insufficient role)

---

## DELETE /orders/:id

Deletes an order.

### Responses
- 204 → successfully deleted
- 404 → order not found
- 400 → invalid ID

---

# Order Items (Menu)

## GET /menu

Returns all order items.

### Responses
- 200 → array of order items
- 500 → server error

---

## GET /menu/:id

Returns a single order item.

### Responses
- 200 → item object
- 404 → item not found
- 400 → invalid ID

---

## POST /menu

Creates a new menu item.

### Auth
- Requires authentication
- Allowed roles:
  - admin

### Request Body
{
  "name": "Coffee",
  "price": 2.50
}

### Responses
- 201 → created item
- 400 → validation error
- 401 → unauthorized
- 403 → forbidden
- 500 → server error

---

## PUT /menu/:id

Updates a menu item.

### Auth
- Requires authentication
- Allowed roles:
  - admin

### Responses
- 200 → updated item
- 404 → item not found
- 400 → invalid ID or validation error
- 401 → unauthorized
- 403 → forbidden

---

## DELETE /menu/:id

Deletes a menu item.

### Auth
- Requires authentication
- Allowed roles:
  - admin

### Responses
- 204 → successfully deleted
- 404 → item not found
- 400 → invalid ID
- 401 → unauthorized
- 403 → forbidden

---

# Store

## GET /store

Returns store settings.
If none exist, creates default store settings automatically.

### Responses
- 200 → store settings object
- 500 → server error

---

## GET /store/status

Returns current store open/closed state.

### Response Format
{
  "isOpen": true | false
}

### Responses
- 200 → returns open status
- 500 → server error

---

## PATCH /store/schedule

Updates weekly schedule.

### Auth
- Requires authentication
- Allowed roles:
  - admin

### Request Body
{
  "weeklySchedule": {
    "sunday": {
      "open": "09:00",
      "close": "17:00",
      "enabled": true
    }
  }
}

### Responses
- 200 → updated store settings
- 404 → store settings not found
- 401 → unauthorized
- 403 → forbidden
- 500 → server error

---

## PATCH /store/override

Updates manual override settings.

### Auth
- Requires authentication
- Allowed roles:
  - admin

### Request Body
{
  "status": "closed",
  "expiresAt": "2026-01-01T00:00:00Z"
}

### Responses
- 200 → updated store settings
- 404 → store not found
- 401 → unauthorized
- 403 → forbidden
- 500 → server error

---

# Users / Authentication

## POST /users

Creates a new user account (customer only).

### Request Body
{
  "name": "Alice",
  "email": "alice@email.com",
  "password": "password",
  "securityQuestions": [
    { "question": "...", "answer": "..." },
    { "question": "...", "answer": "..." }
  ]
}

### Behavior
- Forces account type to `user`
- Hashes password and security answers
- Issues access token (24h)

### Responses
- 201 → returns token + user
- 400 → duplicate email or validation error
- 500 → server error

---

## POST /users/login

Authenticates a user.

### Request Body
{
  "email": "alice@email.com",
  "password": "password"
}

### Behavior
- Admin → access token (3h)
- Worker → access token (24h)
- Customer → access token (24h) + refresh token (30d)

### Responses
- 200 → returns token (+ refreshToken for customers)
- 400 → missing credentials
- 401 → bad credentials
- 500 → server error

---

## POST /users/refresh

Issues a new access token using a refresh token.

### Request Body
{
  "refreshToken": "opaque-refresh-token"
}

### Behavior
- Only allowed for customers
- Validates refresh token hash and expiration
- Issues new access token (24h)

### Responses
- 200 → returns new access token
- 400 → missing credentials
- 401 → unauthorized / expired token
- 403 → forbidden (non-customer)
- 500 → server error

---

## POST /users/me/logout

Logs out the current user.

### Auth
- Requires authentication

### Behavior
- Revokes refresh token by unsetting:
  - refreshTokenHash
  - refreshTokenExpiresAt

### Responses
- 204 → logout successful
- 401 → unauthorized
- 500 → server error

---

## GET /users/me

Returns the currently authenticated user.

### Auth
- Requires authentication

### Responses
- 200 → user object
- 401 → unauthorized

---

## PATCH /users/me/password

Updates the user password.

### Auth
- Requires authentication

### Request Body
{
  "currentPassword": "oldPassword",
  "newPassword": "newPassword"
}

### Responses
- 200 → password updated
- 400 → missing credentials
- 401 → bad credentials
- 500 → server error

---

## PATCH /users/me/profile

Updates user profile (name and/or email).

### Auth
- Requires authentication

### Request Body
{
  "name": "New Name",
  "email": "new@email.com",
  "password": "currentPassword"
}

### Responses
- 200 → updated user
- 400 → missing credentials or no updates
- 401 → bad credentials
- 500 → server error

---

## PATCH /users/me/security-question

Updates one security question and answer.

### Auth
- Requires authentication

### Request Body
{
  "password": "currentPassword",
  "index": 0,
  "newQuestion": "...",
  "newAnswer": "..."
}

### Responses
- 200 → security question updated
- 400 → invalid input
- 401 → bad credentials
- 500 → server error

---

## PATCH /users/me/favorites/:orderItemId

Toggles favorite status for a menu item.

### Auth
- Requires authentication

### Responses
- 200 → updated favorites list
- 400 → invalid ID
- 401 → unauthorized
- 404 → item not found
- 500 → server error

---

## DELETE /users/me

Deletes the current user account.

### Auth
- Requires authentication

### Request Body
{
  "password": "currentPassword"
}

### Responses
- 204 → account deleted
- 400 → missing credentials
- 401 → bad credentials
- 500 → server error