# ChurchKiosk System Flow Map

```
--------------------------------------------------
A) Customer Ordering Flow (Mobile)
--------------------------------------------------

Customer opens mobile app
        │
        ▼
App loads
        │
        ▼
Check store status (schedule + manual override)
        │
        ├── Store Closed
        │       │
        │       ▼
        │   Show "Store Closed" message
        │   Menu visible
        │   Ordering disabled
        │
        └── Store Open
                │
                ▼
        Fetch menu from backend
                │
                ▼
        Customer browses menu
                │
                ▼
        Add items to cart
                │
                ▼
        Checkout
                │
                ├── Logged-in customer
                │       │
                │       ▼
                │   Order linked to account
                │
                └── Guest
                        │
                        ▼
                    Order placed without account
                │
                ▼
        Send order request to backend
                │
                ▼
        Backend validates
            • Store open
            • Items available
            • Lock item prices
            • Calculate totals
                │
                ├── Validation fails
                │       │
                │       ▼
                │   Return error to mobile
                │
                └── Validation succeeds
                        │
                        ▼
                Create Order
                Create OrderItems
                        │
                        ▼
                Order status = PLACED
                        │
                        ▼
        Customer sees order confirmation
                        │
                        ▼
        Customer views order status
                        │
                        ▼
        Worker updates order status during preparation
                        │
                        ▼
        Order status = COMPLETED
                        │
                        ▼
        Order finished


--------------------------------------------------
B) Worker Order Flow (Mobile)
--------------------------------------------------

Worker opens mobile app
        │
        ▼
Worker logs in
        │
        ▼
Backend issues access token
        │
        ▼
Worker dashboard loads
        │
        ▼
Fetch active orders
        │
        ▼
Worker sees order queue
        │
        ▼
Worker views order details
        │
        ▼
Worker prepares order
        │
        ▼
Worker updates order status
        │
        ├── IN_PROGRESS
        │
        └── COMPLETED
                │
                ▼
        Order removed from active queue


--------------------------------------------------
C) Worker Manual Order Entry
--------------------------------------------------

Walk-up customer orders at kiosk
        │
        ▼
Worker opens manual order screen
        │
        ▼
Worker selects menu items
        │
        ▼
Submit order to backend
        │
        ▼
Backend locks prices
        │
        ▼
Backend calculates total
        │
        ▼
Create order
        │
        ▼
Order status = PLACED
        │
        ▼
Worker prepares order normally


--------------------------------------------------
D) Store Open / Close Control (Worker)
--------------------------------------------------

Worker opens store controls
        │
        ▼
View current store status
        │
        ▼
Worker chooses action
        │
        ├── Manual OPEN
        │       │
        │       ▼
        │   Create open override
        │   Set expiration time
        │
        └── Manual CLOSE
                │
                ▼
            Create close override
            Set expiration time
        │
        ▼
Backend updates StoreSettings
        │
        ▼
Customer app reflects updated store status


--------------------------------------------------
E) Customer Authentication Flow
--------------------------------------------------

Customer chooses login or signup
        │
        ▼
Backend authenticates user
        │
        ▼
Issue tokens
    • Access token (JWT)
    • Refresh token (mobile users)
        │
        ▼
Mobile stores refresh token securely
        │
        ▼
User is authenticated


Access Token Expired
        │
        ▼
Mobile receives 401
        │
        ▼
Mobile calls /users/refresh
        │
        ├── Refresh valid
        │       │
        │       ▼
        │   Backend issues new access token
        │   Mobile retries request
        │
        └── Refresh invalid
                │
                ▼
            User logged out


Logout
        │
        ▼
Backend revokes refresh token
        │
        ▼
Mobile clears stored tokens
        │
        ▼
User becomes guest


--------------------------------------------------
F) Admin Dashboard Flow (Planned)
--------------------------------------------------

Admin opens admin web dashboard
        │
        ▼
Admin logs in
        │
        ▼
Admin dashboard loads
        │
        ▼
Admin manages system
        │
        ├── Manage menu items
        │
        ├── Manage worker accounts
        │
        ├── Monitor orders
        │
        └── Configure store schedule


--------------------------------------------------
G) Backend Order Rules
--------------------------------------------------

All orders must pass backend validation:

• Store must be open
• Prices locked server-side
• Totals calculated server-side
• Order status begins as PLACED

Order lifecycle:

PLACED → IN_PROGRESS → COMPLETED
```