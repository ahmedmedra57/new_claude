# System Architecture

This document describes the architecture, design patterns, and data flow of the Industrial Energy Management System.

## Table of Contents

- [Overview](#overview)
- [Architecture Layers](#architecture-layers)
- [Application Flow](#application-flow)
- [State Management Architecture](#state-management-architecture)
- [Data Flow Patterns](#data-flow-patterns)
- [Authentication Architecture](#authentication-architecture)
- [Real-time Communication](#real-time-communication)
- [Routing Architecture](#routing-architecture)
- [Styling Architecture](#styling-architecture)
- [Design Patterns](#design-patterns)

## Overview

The application follows a modern React architecture with clear separation of concerns:

```
┌─────────────────────────────────────────────────────┐
│                   Presentation Layer                 │
│              (React Components + Styled)             │
├─────────────────────────────────────────────────────┤
│                   Application Layer                  │
│           (Hooks, Context, Business Logic)           │
├─────────────────────────────────────────────────────┤
│                  State Management Layer              │
│              (Redux Store + React Query)             │
├─────────────────────────────────────────────────────┤
│                    Service Layer                     │
│             (API Services + Axios Config)            │
├─────────────────────────────────────────────────────┤
│                   External Systems                   │
│         (Backend API, WebSocket, Amazon S3)          │
└─────────────────────────────────────────────────────┘
```

## Architecture Layers

### 1. Presentation Layer

**Components** (`src/components/`)
- Feature-based component organization
- Styled Components for styling
- Responsive design with media queries
- Error boundaries for graceful error handling

**Key Principles:**
- Components should be focused on presentation
- Business logic delegated to hooks and services
- Shared components extracted to common directories
- Recent refactoring reduced complexity significantly

### 2. Application Layer

**Custom Hooks** (`src/hooks/`)
- 25+ custom hooks encapsulating reusable logic
- Data fetching hooks
- UI state hooks
- Control logic hooks
- Recently refactored to eliminate duplication

**Context Providers** (`src/components/context/`)
- Feature-specific state management
- Global application state
- Settings state
- Message box state

**Providers** (`src/providers/`)
- AutoLogoutProvider for session management
- Wraps application with timeout logic

### 3. State Management Layer

**Redux Store** (`src/components/store/`)
- Centralized application state
- 40+ Redux slices for different features
- Redux Persist for state persistence
- Redux Toolkit for simplified Redux logic

**React Query**
- Server state management
- Automatic caching and revalidation
- Background data synchronization
- Loading and error states

### 4. Service Layer

**API Services** (`src/services/`)
- 17 service modules for backend communication
- Consistent error handling
- Request/response transformation
- Authentication token management

**Axios Configuration** (`src/axiosConfig.js`)
- Centralized HTTP client setup
- Request/response interceptors
- Auto-inject authentication tokens
- Auto-redirect on 401 errors

### 5. External Systems

**Backend API**
- RESTful API endpoints
- Bearer token authentication
- JSON data format

**WebSocket (Socket.io)**
- Real-time data updates
- Live telemetry streaming
- System status notifications

**Amazon S3**
- File upload functionality
- Direct S3 uploads for large files

## Application Flow

### Initialization Flow

```
index.js
  ├─> ReactDOM.createRoot
  └─> <App />
       ├─> <ErrorBoundary>                    [Error handling]
       ├─> <QueryClientProvider>              [React Query setup]
       ├─> <GlobalStyle>                      [Global CSS]
       ├─> <Provider store={store}>           [Redux store]
       └─> <AutoLogoutProvider>               [Session timeout]
            └─> <Mainpage />                  [Main routing]
```

### Main Application Flow

```
Mainpage.js
  ├─> Check authentication status
  ├─> If not authenticated -> <LandingPage>
  └─> If authenticated:
       ├─> Detect device (mobile/tablet/desktop)
       ├─> <Header>
       ├─> <Sidebar>
       ├─> <Routes>
       │    ├─> /                -> GlobalOverviewMain
       │    ├─> /telemetry       -> TelemetryMain
       │    ├─> /masterControl   -> MasterControlMain
       │    ├─> /ess             -> SystemMain (ESS)
       │    ├─> /tgs             -> SystemMain (TGS)
       │    ├─> /tes             -> SystemMain (TES)
       │    ├─> /heatingPlatform -> HeatingPlatformMain
       │    ├─> /settings        -> SettingsMain
       │    ├─> /auditTrail      -> AuditTrailMain
       │    ├─> /faults          -> FaultsMain
       │    └─> /reportStatus    -> ReportStatusMain
       └─> <Footer>
```

### Component Lifecycle Flow

```
Component Mount
  ├─> Custom hooks initialize
  ├─> useEffect hooks run
  ├─> Data fetching begins (React Query)
  ├─> Redux state subscriptions
  └─> WebSocket connections (if needed)

User Interaction
  ├─> Event handler triggered
  ├─> Local state update (useState)
  ├─> OR Redux action dispatch
  ├─> OR API call via service
  └─> Component re-renders

Component Unmount
  ├─> Cleanup functions run
  ├─> WebSocket disconnections
  └─> Query cancellations
```

## State Management Architecture

### Three-Layer State Strategy

The application uses a three-layer state management approach:

#### 1. Local Component State (useState)
**Use for:**
- UI-only state (modals, dropdowns, form inputs)
- Temporary state not needed elsewhere
- Animation states

**Example:**
```javascript
const [isModalOpen, setIsModalOpen] = useState(false);
```

#### 2. React Context (Context API)
**Use for:**
- Feature-specific shared state
- Cross-component communication within a feature
- State that doesn't need persistence

**Contexts:**
- `contextOfEssTgsTes` - Message box and control state
- `contextOfGeneral` - General application state
- `ContextOfSettings` - Settings state

#### 3. Global State (Redux)
**Use for:**
- Application-wide state
- State that needs persistence
- Complex state with many actions
- State shared across multiple features

**Redux Slices (40+ slices):**

**System Control:**
- `essSwitchSlice` - ESS switch states
- `tesSwitchSlice` - TES switch states
- `tgsSwitchSlice` - TGS switch states

**User & Auth:**
- `userSlice` - User profile and authentication

**Monitoring:**
- `FaultsSlice` - Fault tracking
- `locationsSlice` - Location data

**Settings (6 slices):**
- `adminSettingsSlice`
- `userSettingsSlice`
- `AdminUserSlice`
- `AdminEmailSlice`
- `AdminDevicesSlice`
- `AdminEmailAndPhoneSlice`

**Master Control:**
- `MCIsExpandedSlice`
- Various MC-specific slices

### State Persistence

Redux state is persisted to localStorage using Redux Persist:

```javascript
{
  key: 'root',
  storage,
  whitelist: ['user', 'settings', /* ... */]
}
```

This ensures user preferences and authentication survive page refreshes.

## Data Flow Patterns

### Pattern 1: Server State with React Query

**Use for:** Data fetching from APIs

```
Component
  └─> useQuery hook
       ├─> Checks cache
       ├─> If stale, fetches from API
       ├─> Updates cache
       └─> Returns { data, isLoading, error }
            └─> Component renders
```

**Example:**
```javascript
const { data: zones, isLoading } = useQuery(
  ['zones', location],
  () => getZones(location),
  { staleTime: 60000 }
);
```

### Pattern 2: Redux Action Flow

**Use for:** Global state updates

```
Component
  └─> dispatch(action)
       └─> Redux Slice
            ├─> Reducer updates state
            └─> All subscribed components re-render
```

**Example:**
```javascript
dispatch(setEssSwitch({ deviceId, value }));
```

### Pattern 3: API Service Pattern

**Use for:** Backend communication

```
Component/Hook
  └─> Call service function
       └─> Service
            ├─> axios.post/get/put/delete
            ├─> Auto-inject auth token (interceptor)
            ├─> Handle response
            └─> Return data or throw error
                 └─> Component handles success/error
```

**Example:**
```javascript
try {
  const result = await sendCommand(deviceId, command);
  // Handle success
} catch (error) {
  // Handle error
}
```

### Pattern 4: Real-time Update Pattern

**Use for:** Live data updates

```
Component
  └─> useSocket hook
       ├─> Establishes WebSocket connection
       ├─> Subscribes to events
       ├─> On message received:
       │    ├─> Update local state
       │    └─> OR dispatch Redux action
       └─> On unmount: cleanup connection
```

## Authentication Architecture

### Token-Based Authentication

```
Login Flow:
  User submits credentials
    └─> authService.login(username, password)
         ├─> POST /login
         ├─> Receive access_token
         ├─> Store in localStorage
         ├─> Dispatch Redux action (setUser)
         └─> Redirect to dashboard

Authenticated Requests:
  Component makes API call
    └─> Axios interceptor
         ├─> Read token from localStorage
         ├─> Add Authorization header
         └─> Send request

Token Expiration:
  Backend returns 401
    └─> Axios response interceptor
         ├─> Clear localStorage
         ├─> Clear Redux state
         └─> Redirect to /login
```

### Auto-Logout for Winter_Disk Role

```
AutoLogoutProvider
  ├─> Check user role
  ├─> If Winter_Disk:
  │    ├─> Set 15-minute timer
  │    ├─> Reset on user activity
  │    └─> On timeout:
  │         ├─> Call logout service
  │         ├─> Clear state
  │         └─> Redirect to login
  └─> Other roles: No timeout
```

## Real-time Communication

### WebSocket Architecture

```
useSocket Hook
  ├─> Connect to WebSocket server
  ├─> Subscribe to events:
  │    ├─> 'telemetry-update'
  │    ├─> 'fault-alert'
  │    ├─> 'status-change'
  │    └─> 'system-notification'
  ├─> On message:
  │    ├─> Parse data
  │    ├─> Update Redux state
  │    └─> Trigger re-renders
  └─> Cleanup on unmount
```

### Data Synchronization Strategy

1. **Initial Load**: Fetch via REST API
2. **Updates**: Receive via WebSocket
3. **Mutations**: Send via REST API, wait for WebSocket confirmation
4. **Optimistic Updates**: Update UI immediately, rollback on error

## Routing Architecture

### Route Configuration

The application uses React Router v6 with the following structure:

```
/login                    # Landing page (public)
/login/fr                 # French landing page (public)

/ (protected)             # Requires authentication
├─> /                     # Global overview dashboard
├─> /telemetry            # Telemetry visualization
├─> /masterControl        # Master control interface
├─> /ess                  # ESS system view
├─> /tgs                  # TGS system view
├─> /tes                  # TES system view
├─> /heatingPlatform      # Heating platform control
├─> /settings             # Settings management
│    ├─> /settings/user
│    ├─> /settings/admin
│    └─> /settings/*
├─> /auditTrail           # Audit log viewer
├─> /faults               # Fault management
└─> /reportStatus         # Report generation
```

### Route Protection

```javascript
// In Mainpage.js
const isAuthenticated = useSelector(state => state.user.isAuthenticated);

if (!isAuthenticated) {
  return <LandingPage />;
}

return (
  <Routes>
    {/* Protected routes */}
  </Routes>
);
```

### Responsive Routing

The application adapts routes based on device:

```javascript
const isMobile = useMediaQuery({ maxWidth: 768 });
const isTablet = useMediaQuery({ minWidth: 769, maxWidth: 1024 });
const isDesktop = useMediaQuery({ minWidth: 1025 });

if (isMobile) return <MobileMain />;
if (isTablet) return <TabletView />;
return <DesktopView />;
```

## Styling Architecture

### Styled Components Pattern

**Global Styles** (`src/components/styles/GlobalStyles.js`):
```javascript
createGlobalStyle`
  * { box-sizing: border-box; }
  body { margin: 0; font-family: ...; }
`
```

**Common Styles** (`src/components/styles/commonStyles.js`):
- Reusable styled component utilities
- Theme constants
- Shared animations

**Component Styles**:
- Co-located with components
- Scoped to component
- Dynamic props for theming

**Example:**
```javascript
const Button = styled.button`
  background: ${props => props.primary ? 'blue' : 'gray'};
  padding: 10px 20px;
  border-radius: 4px;
`;
```

### Responsive Design

Uses `react-responsive` for breakpoints:

```javascript
const isMobile = useMediaQuery({ maxWidth: 768 });
const isTablet = useMediaQuery({ minWidth: 769, maxWidth: 1024 });
const isDesktop = useMediaQuery({ minWidth: 1025 });
```

## Design Patterns

### 1. Container/Presenter Pattern

**Container Component** (Smart):
- Manages state
- Handles business logic
- Fetches data
- Passes props to presenter

**Presenter Component** (Dumb):
- Receives props
- Renders UI
- Emits events
- No state management

### 2. Custom Hook Pattern

Extract reusable logic into custom hooks:

```javascript
// Before
function Component() {
  const [data, setData] = useState(null);
  useEffect(() => {
    fetchData().then(setData);
  }, []);
  return <div>{data}</div>;
}

// After
function useData() {
  const [data, setData] = useState(null);
  useEffect(() => {
    fetchData().then(setData);
  }, []);
  return data;
}

function Component() {
  const data = useData();
  return <div>{data}</div>;
}
```

### 3. Service Layer Pattern

All API calls go through service layer:

```javascript
// ❌ Don't call axios directly in components
const response = await axios.get('/api/zones');

// ✅ Use service functions
const zones = await zonesService.getZones();
```

### 4. Redux Slice Pattern

Each feature gets its own slice:

```javascript
// essSwitchSlice.js
const essSwitchSlice = createSlice({
  name: 'essSwitch',
  initialState: {},
  reducers: {
    setSwitch: (state, action) => { /* ... */ }
  }
});
```

### 5. Error Boundary Pattern

Wrap components with error boundaries:

```javascript
<ErrorBoundary>
  <FeatureComponent />
</ErrorBoundary>
```

### 6. Lazy Loading Pattern

Code-split routes for performance:

```javascript
const MasterControl = lazy(() => import('./components/masterControl'));

<Suspense fallback={<Loading />}>
  <MasterControl />
</Suspense>
```

## Performance Optimizations

### 1. Code Splitting
- Route-based code splitting with React.lazy()
- Reduces initial bundle size
- Faster first paint

### 2. Memoization
- React.memo() for expensive components
- useMemo() for expensive calculations
- useCallback() for stable function references

### 3. Query Caching
- React Query caches all API responses
- Configurable stale times
- Background refetching
- Reduces unnecessary API calls

### 4. State Persistence
- Redux Persist reduces API calls on reload
- User preferences cached locally
- Faster app initialization

### 5. Optimistic Updates
- UI updates immediately
- API calls in background
- Rollback on error
- Better perceived performance

## Security Architecture

### 1. Authentication
- Bearer token authentication
- Tokens stored in localStorage
- Automatic token injection via interceptors

### 2. Authorization
- Role-based access control
- 16 distinct user roles
- Granular permissions per feature
- Frontend route protection

### 3. Data Validation
- Input validation on forms
- Temperature validation utilities
- Command validation before sending

### 4. Secure Communication
- HTTPS for all API calls
- WebSocket over TLS
- Secure token transmission

## Error Handling Strategy

### 1. Error Boundaries
- Catch React component errors
- Display fallback UI
- Log errors for debugging

### 2. Service Layer Errors
- Try-catch blocks in services
- Consistent error format
- User-friendly error messages

### 3. API Errors
- Interceptor handles 401 (redirect to login)
- Display error notifications
- Retry logic for network failures

### 4. Form Validation
- Client-side validation
- Real-time feedback
- Prevent invalid submissions

## Internationalization Architecture

### i18next Configuration

```
i18n.js
  ├─> Initialize i18next
  ├─> Load translations (en.json, fr.json)
  ├─> Detect browser language
  ├─> Fallback to English
  └─> Export configured instance

Components
  └─> useTranslation() hook
       ├─> t('key') for translations
       └─> i18n.changeLanguage() to switch
```

### Translation Structure

```json
{
  "common": {
    "buttons": { "save": "Save", "cancel": "Cancel" }
  },
  "dashboard": {
    "title": "Dashboard",
    "widgets": { /* ... */ }
  }
}
```

## Future Architecture Considerations

### Potential Improvements

1. **TypeScript Migration**: Add type safety
2. **GraphQL**: Replace REST with GraphQL
3. **Micro-frontends**: Split into smaller apps
4. **PWA**: Add offline support
5. **Testing**: Increase test coverage
6. **Monitoring**: Add error tracking (Sentry)
7. **Performance**: Further optimize bundle size
8. **Documentation**: Auto-generate API docs

## Conclusion

This architecture provides:
- **Scalability**: Easy to add new features
- **Maintainability**: Clear separation of concerns
- **Performance**: Optimized data fetching and rendering
- **Developer Experience**: Consistent patterns and structure
- **User Experience**: Fast, responsive, real-time updates

The recent refactoring efforts (removing 787+ lines of dead code, creating shared hooks) demonstrate ongoing commitment to code quality and maintainability.
