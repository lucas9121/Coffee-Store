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
Webpage Structure
------------------------------------------------------

apps/admin-web/
│
├── public/
│   └── images/
│       └── logo.jpg                    # Catedral Café logo
│
├── src/
│   ├── components/
│   │   ├── Header/
│   │   │   ├── Header.jsx              # Shared admin navigation/header
│   │   │   └── Header.module.css       # Header-specific scoped styles
│   │   │
│   │   ├── Layout.jsx                  # Shared protected-page layout
│   │   └── ProtectedRoute.jsx          # Restricts routes to authenticated admins
│   │
│   ├── context/
│   │   └── AuthContext.jsx             # Admin auth/session state
│   │
│   ├── pages/
│   │   ├── DashboardPage.jsx           # Admin home; analytics dashboard
│   │   ├── LoginPage.jsx               # Admin login
│   │   ├── MenuPage.jsx                # Menu management
│   │   ├── UsersPage.jsx               # User/account-role management
│   │   ├── SchedulePage.jsx            # Weekly store schedule management
│   │   └── SettingsPage.jsx            # Current admin account settings
│   │
│   ├── services/
│   │   ├── api.js                      # Shared authenticated API request helper
│   │   └── auth-api.js                 # Admin login API service
│   │
│   ├── App.jsx                         # React Router route definitions
│   ├── main.jsx                        # Application entry point + providers
│   └── index.css                       # Global theme variables and base web styles
│
├── package.json
├── package-lock.json
└── vite.config.js


------------------------------------------------------
Mobile App Structure
------------------------------------------------------

apps/mobile/
│
├── app/                              # Expo Router routes
│   ├── _layout.tsx                   # Root navigation + providers wrapper
│   ├── cart.tsx                      # Cart / checkout modal
│   ├── guest-checkout.tsx            # Guest checkout modal
│   │
│   ├── (tabs)/                       # Bottom tab navigator group
│   │   ├── _layout.tsx               # Tabs layout (Home / Orders / Settings)
│   │   ├── index.tsx                 # Home tab
│   │   ├── orders.tsx                # Orders tab
│   │   └── settings.tsx              # Settings tab
│   │
│   └── (auth)/                       # Authentication routes
│       ├── login.tsx                 # User login
│       ├── signup.tsx                # User registration
│       └── forgot-password.tsx       # Password recovery  
│
├── assets/                           # Images/fonts (e.g., splash/loading image)
│   └── images/
│       └── ...                       # Your loading/splash image(s)
│
├── components/                       # Reusable UI components
│   ├── ui/                           # Base themed UI primitives
│   │   ├── themed-button.tsx         # Shared themed button component
│   │   ├── themed-text.tsx           # ThemedText wrapper (light/dark aware)
│   │   ├── themed-view.tsx           # ThemedView wrapper (light/dark aware)
│   │   ├── themed-scroll-view.tsx    # ThemedScrollView wrapper
│   │   └── themed-text-input.tsx     # ThemedTextInput wrapper
│   │
│   ├── app-header.tsx                # Shared page header
│   ├── card.tsx                      # Shared card container
│   ├── cart-button.tsx               # Floating cart button
│   ├── cart-item-row.tsx             # Cart item row
│   ├── customer-home-content.tsx     # Customer Home tab UI
│   ├── customer-orders-content.tsx   # Customer Orders tab UI
│   ├── guest-settings-content.tsx    # Guest Settings tab UI
│   ├── horizontal-list.tsx           # Reusable horizontal FlatList wrapper
│   ├── login-form.tsx                # Shared login form
│   ├── menu-card.tsx                 # Menu item card component
│   ├── section.tsx                   # Section container with title
│   ├── worker-home-content.tsx       # Worker Home tab UI
│   └── worker-orders-content.tsx     # Worker Orders tab UI
│
├── constants/
│   ├── theme.ts                      # Colors (light/dark palettes)
│   ├── tokens.ts                     # Shared spacing, radius, typography, sizing
│   └── mock-menu-data.ts             # Temporary menu data (to be replaced by API)
│
├── context/                          # Global state providers (React Context)
│   ├── AuthContext.tsx               # Authentication + access token state
│   ├── CartContext.tsx               # Shopping cart state
│   ├── OrderContext.tsx              # Latest customer order state
│   └── ThemeContext.tsx              # Theme mode (system/light/dark)
│
├── hooks/
│   ├── use-color-scheme.ts           # Native color scheme hook
│   ├── use-color-scheme.web.ts       # Web hydration-safe color scheme hook
│   └── use-theme-color.ts            # Theme color resolver helper
│
├── scripts/
│
├── services/
│   ├── api.ts                        # Shared API request helper
│   ├── auth-api.ts                   # Authentication API
│   ├── menu-api.ts                   # Menu API
│   ├── notifications.ts              # Expo push notification registration
│   ├── orders-api.ts                 # Orders API
│   ├── store-settings.ts             # Store status / schedule API
│   ├── tokenStorage.ts               # SecureStore refresh token helpers
│   └── user-api.ts                   # User profile API
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

apps/backend/
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
│   ├── notifications.js              
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