# Data Model – ChurchKiosk Backend

This document describes the MongoDB data structure used in the backend.

All models use Mongoose and include timestamps unless otherwise noted.

---

# Order

Represents a customer order placed through the kiosk.

## Fields

### customerName
- Type: String
- Required: Yes
- Min length: 2
- Max length: 10
- Trimmed: Yes

---

### status
- Type: String
- Enum:
  - PLACED
  - IN PROGRESS
  - READY
  - COMPLETED
  - CANCELLED
- Default: PLACED

---

### orderItems (Array)

Each order contains one or more order items.

Structure:

- item
  - Type: ObjectId
  - Ref: OrderItem
  - Required: Yes

- quantity
  - Type: Number
  - Required: Yes
  - Minimum: 1
  - Default: 1

- priceAtPurchase
  - Type: Number
  - Required: Yes
  - Minimum: 0
  - Stored to lock price at time of purchase

---

### totalPrice
- Type: Number
- Required: Yes
- Calculated server-side during order creation

---

### timestamps
- createdAt
- updatedAt

---

# OrderItem (Menu Item)

Represents a purchasable menu item.

## Fields

### name
- Type: String
- Required: Yes

---

### price
- Type: Number
- Required: Yes

---

### image
- Type: String
- Optional
- Intended for image URL or asset path

---

### inStock
- Type: Boolean
- Default: true

---

### timestamps
- createdAt
- updatedAt

---

# StoreSettings

Controls store availability and scheduling.

Only one StoreSettings document is expected in the system.

---

## weeklySchedule

Defines operating hours for each day of the week.

Structure for each day (Sunday – Saturday):

- open: String
- close: String
- enabled: Boolean

Time values are stored as strings (e.g., "09:00", "17:30").

If enabled is false, the store is considered closed for that day.

---

## manualOverride

Allows administrators to override the weekly schedule.

### status
- Type: String
- Enum:
  - "open"
  - "closed"
  - null
- Default: null

If null → weekly schedule determines status  
If "open" or "closed" → override takes precedence

---

### expiresAt
- Type: Date
- Default: null

If set, override is considered expired when:
currentDate > expiresAt

---

### timestamps
- createdAt
- updatedAt