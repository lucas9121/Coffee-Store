# Mobile Navigation

Navigation is implemented using Expo Router.

Top level structure:

RootLayout
  └ Tabs Navigator
       ├ Home
       ├ Orders
       └ Settings

Modal routes may be opened above the stack.

Navigation hierarchy:

RootLayout
  ├ Tabs
  │   ├ Home
  │   ├ Orders
  │   └ Settings
  └ Modal

All tabs are visible to every role.

Content inside each tab changes based on accountType.