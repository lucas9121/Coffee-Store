# Mobile State Management

The mobile app uses React Context for global state.

AuthContext

Stores:
accountType
setAccountType
accessToken
setAccessToken
isInitializing
setIsInitializing
hasRefreshToken

Used for:
role-based UI behavior.

ThemeContext

Stores:
themeMode
setThemeMode

Modes:
system
light
dark

Component State

Screens manage local UI state using useState.

Example:
cart contents
menu filters
form inputs