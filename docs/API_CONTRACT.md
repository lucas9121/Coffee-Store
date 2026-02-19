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

## PUT - no route

Updates an order.

### Behavior
- Validates MongoDB ObjectId
- Uses runValidators: true

### Responses
- 200 → updated order
- 404 → order not found
- 400 → invalid ID or validation error

---

## PATCH /orders/:id/status

Updates only the order status.

### Request Body
{
  "status": "completed"
}

### Responses
- 200 → updated order
- 404 → order not found
- 400 → invalid ID

---

## DELETE /orders/:id

Deletes an order.

### Responses
- 204 → successfully deleted
- 404 → order not found
- 400 → invalid ID

---

# Order Items

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

Creates a new item.

### Request Body
{
  "name": "Coffee",
  "price": 2.50,
  "category": "Drinks"
}

### Responses
- 201 → created item
- 400 → validation error
- 500 → server error

---

## PUT /menu/:id

Updates an item.

### Responses
- 200 → updated item
- 404 → item not found
- 400 → invalid ID or validation error

---

## DELETE /menu/:id

Deletes an item.

### Responses
- 204 → successfully deleted
- 404 → item not found
- 400 → invalid ID

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
- 500 → server error

---

## PATCH /store/override

Updates manual override settings.

### Request Body
{
  "status": "closed",
  "expiresAt": "2026-01-01T00:00:00Z"
}

### Responses
- 200 → updated store settings
- 404 → store not found
- 500 → server error