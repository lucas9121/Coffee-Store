# Architecture – ChurchKiosk

Monorepo Structure

```churchKiosk/
│
├── apps/
│   ├── mobile/        # Expo React Native app
│   └── admin-web/     # Vite React admin dashboard
│
├── backend/           # Express + MongoDB API
├── docs/
├── .gitignore
├── README.md
└── package.json


------------------------------------------------------
Backend Structure
------------------------------------------------------

backend/
│
├── controllers/
│   ├── orderController.js
│   ├── orderItemController.js
│   ├── storeSettingsControllers.js
│   ├── userController.js
│   └── adminController.js
│
├── models/
│   ├── Order.js
│   ├── OrderItem.js
│   ├── StoreSettings.js
│   └── User.js
│
├── routes/
│   ├── orderRoutes.js
│   ├── orderItemRoutes.js
│   ├── storeSettingsRoutes.js
│   ├── userRoutes.js
│   ├── adminRoutes.js
│   └── menuRoutes.js
│
├── middleware/
│   ├── requireAuth.js
│   ├── authorizeRoles.js
│   └── optionalAuth.js
│
├── utils/
│   ├── isStoreOpen.js
│   └── token.js
│
├── config/
│   └── db.js          # MongoDB connection logic
│
│
├── tests/
│   │
│   ├── controllers/
│   │   ├── adminController.test.js
│   │   ├── orderController.test.js
│   │   ├── orderItemController.test.js
│   │   ├── storeSettingsController.test.js
│   │   └── userController.test.js
│   │
│   ├── middleware/
│   │   ├── authorizeRoles.test.js
│   │   ├── requireAuth.test.js
│   │   └── optionalAuth.test.js
│   │
│   ├── routes/
│   │   ├── adminRoutes.test.js
│   │   ├── orderItemRoutes.test.js
│   │   ├── orderRoutes.test.js
│   │   └── userRoutes.test.js
│   │
│   └── schemas/
│       ├── orderSchema.test.js
│       ├── orderItemSchema.test.js
│       ├── storeSettings.test.js
│       └── user.test.js
│
├── app.js             # Express app + middleware setup
├── server.js          # Server entry point
└── .nvmrc             # Node version (v24.14.0)
```