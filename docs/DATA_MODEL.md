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

---

# User

Represents a user of the ChurchKiosk system. Users can be customers (user), employees (worker), or administrators (admin).

---

## Fields

### name
- Type: String
- Required: Yes
- Trimmed: Yes

---

### email
- Type: String
- Required: Yes
- Unique: Yes
- Trimmed: Yes
- Stored lowercase

---

### password
- Type: String
- Required: Yes
- Min length: 5
- Trimmed: Yes
- Stored as a bcrypt hash in the database
- Pre-save hook automatically hashes new or modified passwords

---

### account
- Type: String
- Enum:
  - user (customer)
  - worker (employee)
  - admin
- Default: user
- Required: Yes

--- 

### securityQuestions (Array – 2 items)
Each user must select two security questions and provide answers.

Structure:
- question
  - Type: String
  - Enum:
    - "What is your mother's maiden name?"
    - "What is the name of your first pet?"
    - "What was your first car?"
    - "What elementary school did you attend?"
    - "What is the name of the town where you were born?"
    - "Where did you meet your spouse?"
  - Required: Yes
- answer
  - Type: String
  - Required: Yes
  - Stored as a bcrypt hash
  - Pre-save hook automatically hashes new or modified answers

### Notes:
- Users cannot change an answer without selecting a new question.
- Changing a question requires current password verification in the controller.
- Hashing ensures answers are securely stored.

--- 

### favorites (Array)

References to OrderItem documents that the user has marked as favorite.

Structure:
- Type: ObjectId
- Ref: OrderItem

---

### recent (Array)

References to recent OrderItem documents the user has purchased.

Structure:
- Type: ObjectId
- Ref: OrderItem

---

### refreshTokenHash
- Type: String
- Optional
- Only present for customer accounts (account: user)
- Stores a SHA-256 hash of the refresh token
- Plaintext refresh tokens are never stored

---

### refreshTokenExpiresAt
- Type: Date
- Optional
- Determines refresh token expiration
- Refresh token is invalid when:
  currentDate > refreshTokenExpiresAt

---

### Refresh Token Notes
- Refresh tokens are only issued to customers (account: user)
- Workers and admins do not receive refresh tokens
- Refresh tokens are revoked on logout by unsetting:
  - refreshTokenHash
  - refreshTokenExpiresAt
- If a user account is promoted to worker or admin, any existing refresh token fields are removed on next login

--- 

### timestamps
- createdAt
- updatedAt

--- 

### Pre-save Hook (Behavior)
- Passwords hashed on creation or whenever modified
- Security answers hashed whenever modified or new (including when updating question/answer)
- next() signals Mongoose to continue saving after asynchronous operations

### Explanation:
- SALT_ROUNDS: number of bcrypt rounds used to hash passwords/answers
- toJSON transform removes password and sensitive fields from API responses
- next() must be called at the end of pre('save')