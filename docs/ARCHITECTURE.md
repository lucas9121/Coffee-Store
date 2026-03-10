# Architecture – ChurchKiosk

Monorepo Structure

```churchKiosk/
│
├── apps/
│   ├── admin-web/     # Vite React admin dashboard
│   ├── mobile/        # Expo React Native app
│   └── .nvmrc         # Node version (v24.14.0)
│
├── backend/           # Express + MongoDB API
│
├── docs/
│   ├── ARCHITECTURE.md        
│   ├── PROJECT_STATUS.md 
│   ├── SYSTEM_FLOW.md 
│   │
│   ├── backend/
│   │   ├── API_CONTRACT.md
│   │   ├── DATA_MODEL.md
│   │   ├── ERD.md
│   │   ├── ERD.png
│   │   └── Store_Logic.md
│   │
│   └── mobile/
│       ├── CONFIG.md
│       ├── NAVIGATION.md
│       ├── ROLES.md
│       └──STATE_MANAGEMENT.md
│
├── .gitignore
└── README.md


------------------------------------------------------
Mobile App Structure
------------------------------------------------------

apps/mobile/
│
├── app/                              # Expo Router routes
│   ├── _layout.tsx                   # Root navigation + providers wrapper
│   ├── modal.tsx                     # Default Expo modal route (optional)
│   ├── (tabs)/                       # Bottom tab navigator group
│   │   ├── _layout.tsx               # Tabs layout (Home / Orders / Settings)
│   │   ├── index.tsx                 # Home tab screen (placeholder)
│   │   ├── orders.tsx                # Orders tab screen (placeholder)
│   │   └── settings.tsx              # Settings tab screen (placeholder)
│   │
│   └── (auth)/                       
│       └── login.tsx   
│
├── context/                          # Global state providers (React Context)
│   ├── AuthContext.tsx               # accountType (guest/user/worker)
│   └── ThemeContext.tsx              # themeMode (system/light/dark)
│
├── assets/                           # Images/fonts (e.g., splash/loading image)
│   └── images/
│       └── ...                       # Your loading/splash image(s)
│
├── components/                       # Reusable UI components
│   ├── themed-text.tsx               # ThemedText wrapper (light/dark aware)
│   ├── themed-view.tsx               # ThemedView wrapper (light/dark aware)
│   ├── themed-text-input.tsx         # ThemedTextInput wrapper (light/dark aware)
│   ├── external-link.tsx
│   ├── haptic-tab.tsx                # Optional tab button w/ haptics
│   ├── hello-wave.tsx
│   ├── parallax-scroll-view.tsx
│   └── ui/
│       ├── collapsible.tsx
│       ├── icon-symbol.ios.tsx
│       └── icon-symbol.tsx
│
├── constants/
│   └── theme.ts                      # Colors + Fonts (light/dark palettes)
│
├── hooks/
│   ├── use-color-scheme.ts           # Native color scheme hook
│   ├── use-color-scheme.web.ts       # Web hydration-safe color scheme hook
│   └── use-theme-color.ts            # Theme color resolver helper
│
├── scripts/
│   └── reset-project.js              # Expo template utility script (optional)
│
├── services/
│   └── tokenStorage.ts
│
├── .vscode/                          # Local editor config (optional)
│
├── .gitignore
├── README.md
├── app.json                          # Expo config (icons/splash/etc.)
├── eslint.config.js
├── tsconfig.json
├── package.json
└── package-lock.json


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
├── package.json
├── server.js          # Server entry point
└── .nvmrc             # Node version (v24.14.0)
```