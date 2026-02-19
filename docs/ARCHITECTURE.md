# Architecture – ChurchKiosk

Monorepo Structure

churchKiosk/
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
│   └── userController.js (empty – in progress)
│
├── models/
│   ├── Order.js
│   ├── OrderItem.js
│   ├── StoreSettings.js
│   └── User.js (empty – in progress)
│
├── routes/
│   ├── orderRoutes.js
│   ├── menuRoutes.js
│   ├── storeSettingsRoutes.js
│   └── userRoutes.js (planned)
│
├── tests/
│   ├── controllers/
│   │   ├── orderController.test.js
│   │   ├── orderItemController.test.js
│   │   ├── storeSettingsControllers.test.js
│   │   └── userController.test.js
│   │
│   ├── models/
│   │   ├── Order.test.js
│   │   ├── OrderItem.test.js
│   │   ├── StoreSettings.test.js
│   │   └── User.test.js
│   │
│   └── routes/
│       ├── orderRoutes.test.js
│       ├── menuRoutes.test.js
│       ├── storeSettingsRoutes.test.js
│       └── userRoutes.test.js
│
├── config/
│   └── db.js          # MongoDB connection logic
│
├── utils/             
│   └── isStoreOpen.js         
├── app.js             # Express app + middleware setup
├── server.js          # Server entry point
└── .nvmrc             # Node version (v20.11.0)