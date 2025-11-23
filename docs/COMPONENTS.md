# Component Reference

This document provides a comprehensive reference for all major components in the Industrial Energy Management System.

## Table of Contents

- [Component Organization](#component-organization)
- [Core Components](#core-components)
- [Feature Components](#feature-components)
- [Shared Components](#shared-components)
- [Layout Components](#layout-components)
- [UI Components](#ui-components)
- [Component Patterns](#component-patterns)

## Component Organization

Components are organized by feature in the `src/components/` directory:

```
src/components/
├── auditTrail/           # Audit logging
├── faults/               # Fault management
├── globalOverview/       # Dashboard overview
├── masterControl/        # Control system
├── telemetry/            # Data visualization
├── settings/             # Settings management
├── heatingPlatform/      # HP system
├── ess/                  # ESS components
├── tgs/                  # TGS components
├── tes/                  # TES components
├── commonComponentsMC/   # Shared MC components
├── newLandingPage/       # Login/landing
├── sidebar/              # Navigation
├── Header.js             # Top navigation
├── Footer.js             # Footer component
├── errorBoundary/        # Error handling
├── loading/              # Loading states
├── printPDF/             # PDF export
├── searchBox/            # Search functionality
├── ui/                   # Basic UI components
├── mobileMain/           # Mobile view
├── userMessages/         # Notifications
├── context/              # React Context
├── store/                # Redux store
└── styles/               # Shared styles
```

## Core Components

### App.js

**Location**: `src/App.js`

**Purpose**: Root component that sets up all providers and global configuration.

**Responsibilities**:
- Initialize Redux store
- Set up React Query client
- Configure error boundaries
- Apply global styles
- Wrap app with providers

**Provider Hierarchy**:
```jsx
<ErrorBoundary>
  <QueryClientProvider client={queryClient}>
    <GlobalStyle />
    <Provider store={store}>
      <AutoLogoutProvider>
        <Mainpage />
      </AutoLogoutProvider>
    </Provider>
  </QueryClientProvider>
</ErrorBoundary>
```

**Key Dependencies**:
- Redux store from `src/components/store/store.js`
- React Query client
- AutoLogoutProvider
- GlobalStyle

---

### Mainpage.js

**Location**: `src/Mainpage.js`

**Purpose**: Main routing and layout orchestration.

**Responsibilities**:
- Handle authentication routing
- Manage responsive layouts (mobile/tablet/desktop)
- Configure React Router routes
- Wrap routes with Suspense boundaries

**Routes**:
| Path | Component | Description |
|------|-----------|-------------|
| `/` | GlobalOverviewMain | Dashboard overview |
| `/telemetry` | TelemetryMain | Telemetry visualization |
| `/masterControl` | MasterControlMain | Control interface |
| `/ess` | SystemMain (ESS) | ESS system view |
| `/tgs` | SystemMain (TGS) | TGS system view |
| `/tes` | SystemMain (TES) | TES system view |
| `/heatingPlatform` | HeatingPlatformMain | HP control |
| `/settings` | SettingsMain | Settings management |
| `/auditTrail` | AuditTrailMain | Audit log |
| `/faults` | FaultsMain | Fault management |
| `/reportStatus` | ReportStatusMain | Reports |

**State Usage**:
- Redux: User authentication state
- Local: Device type detection

**Example**:
```javascript
const isAuthenticated = useSelector(state => state.user.isAuthenticated);

if (!isAuthenticated) {
  return <LandingPage />;
}

const isMobile = useMediaQuery({ maxWidth: 768 });
if (isMobile) return <MobileMain />;

return <DesktopLayout />;
```

---

## Feature Components

### GlobalOverviewMain

**Location**: `src/components/globalOverview/GlobalOverViewMain.js`

**Purpose**: Dashboard overview showing status of all systems.

**Responsibilities**:
- Display system status cards
- Show active faults count
- Present key metrics
- Provide quick navigation to subsystems

**Key Features**:
- Real-time status updates
- System health indicators
- Fault notifications
- Multi-system overview

**State Usage**:
- Redux: System states, faults
- Context: General app context
- React Query: Live data fetching

**Props**: None (uses hooks for data)

---

### MasterControlMain

**Location**: `src/components/masterControl/MasterControlMain.js`

**Purpose**: Centralized control interface for all system devices.

**Responsibilities**:
- Display control panels for each system
- Handle device activation/deactivation
- Manage program schedules
- Control zone settings
- Manage SSRs (Solid State Relays)

**Subdirectories**:
```
masterControl/
├── MasterControlMain.js      # Main container
├── ControlBox/               # Control box component
├── Programs/                 # Program management
├── Zones/                    # Zone control
├── SSR/                      # SSR management
├── Schedule/                 # Scheduling
└── Temperature/              # Temperature control
```

**Key Features**:
- Multi-system control
- Real-time status display
- Program scheduling
- Zone temperature management
- SSR control interface
- Expandable/collapsible sections

**State Usage**:
- Redux: Switch states (ESS/TGS/TES), MC expansion state
- Context: Message box, control state
- Custom Hooks: `useSwitchData`, `useSwitchControls`, `useProgramIcons`

**Recent Improvements**:
- Refactored to use shared hooks
- Reduced duplication across ESS/TGS/TES
- Simplified state management

---

### TelemetryMain

**Location**: `src/components/telemetry/TelemetryMain.js`

**Purpose**: Real-time data visualization and historical analysis.

**Responsibilities**:
- Display live telemetry data
- Render historical data charts
- Support multiple chart types
- Handle time range selection
- Export data functionality

**Subdirectories**:
```
telemetry/
├── TelemetryMain.js          # Main container
├── Charts/                   # Chart components
├── DataTable/                # Tabular data view
├── Filters/                  # Filter controls
└── Export/                   # Export functionality
```

**Key Features**:
- Real-time chart updates
- Historical data visualization
- Configurable time ranges
- Multi-parameter charts
- Data export (CSV, PDF)
- Zoom and pan controls

**State Usage**:
- React Query: Telemetry data, graph data
- Local: Chart configuration, filters
- Custom Hooks: `useGetGraphQueries`

**Chart Types**:
- Line charts (temperature, pressure)
- Bar charts (energy consumption)
- Gauge charts (current values)
- Multi-axis charts

---

### SystemMain (ESS/TGS/TES)

**Location**: `src/components/commonComponentsMC/SystemMain.js`

**Purpose**: System-specific view with tabs for different data types.

**Responsibilities**:
- Display system-specific control panel
- Show real-time graphs
- Present historical data
- Provide video monitoring (if available)

**Tab Structure**:
| Tab | Component | Purpose |
|-----|-----------|---------|
| MC (Master Control) | Control panels | Device control |
| Graph | GraphMain | Real-time graphs |
| History | HistoryMain | Historical data |
| Video | VideoMain | Video monitoring |

**Props**:
```javascript
{
  type: 'ess' | 'tgs' | 'tes',  // System type
  // ... other props
}
```

**Key Features**:
- Tabbed interface
- System-specific controls
- Real-time data display
- Historical analysis
- Video feed integration

**State Usage**:
- Redux: System-specific slices
- Context: System control state
- Custom Hooks: System-specific hooks

---

### HeatingPlatformMain

**Location**: `src/components/heatingPlatform/`

**Purpose**: Heating platform monitoring and control.

**Responsibilities**:
- Display heating zones
- Control zone temperatures
- Monitor heating status
- Manage heating schedules

**Subdirectories**:
```
heatingPlatform/
├── index.js                  # Main export
├── ZoneControl/              # Zone controls
├── TemperatureDisplay/       # Temperature monitoring
├── Schedule/                 # Heating schedules
├── Status/                   # Status display
└── Settings/                 # HP settings
```

**Key Features**:
- Multi-zone control
- Temperature setpoint management
- Real-time temperature monitoring
- Schedule management
- Zone-specific settings

**State Usage**:
- Redux: HP-specific slices
- Custom Hooks: Zone state hooks

---

### SettingsMain

**Location**: `src/components/settings/SettingsMain.js`

**Purpose**: Comprehensive settings management for users and administrators.

**Responsibilities**:
- User preference management
- Admin configuration
- System settings
- User management (admin only)
- Device configuration (admin only)

**Settings Categories**:

**User Settings**:
- Language preference
- Display preferences
- Notification settings
- Password change

**Admin Settings**:
- User management
- Device management
- Email configuration
- Phone number management
- System parameters
- Access control

**Subdirectories**:
```
settings/
├── SettingsMain.js           # Main container
├── UserSettings/             # User preferences
├── AdminSettings/            # Admin configuration
├── DeviceSettings/           # Device configuration
├── EmailSettings/            # Email setup
├── PhoneSettings/            # Phone setup
├── NotificationSettings/     # Notification config
├── DisplaySettings/          # Display preferences
├── PasswordChange/           # Password management
├── UserManagement/           # User CRUD
├── LanguageSettings/         # Language selection
└── SystemParameters/         # System config
```

**Role-Based Access**:
- Regular users: Limited to user settings
- Admins: Full access to all settings
- Managers: Partial admin access

**State Usage**:
- Redux: 6 settings slices
- Context: ContextOfSettings
- React Query: Settings API calls

---

### AuditTrailMain

**Location**: `src/components/auditTrail/AuditTrailMain.js`

**Purpose**: Comprehensive audit logging and tracking.

**Responsibilities**:
- Display audit log entries
- Filter and search logs
- Export audit data
- Show user actions
- Track system changes

**Key Features**:
- Searchable audit log
- Filter by:
  - User
  - Action type
  - Date range
  - System/device
- Export to CSV/PDF
- Detailed action information
- Timestamp display

**Log Entry Format**:
```javascript
{
  id: string,
  timestamp: Date,
  user: string,
  action: string,
  target: string,
  details: object,
  result: 'success' | 'failure'
}
```

**State Usage**:
- React Query: Audit log data
- Local: Filters, pagination

---

### FaultsMain

**Location**: `src/components/faults/FaultsMain.js`

**Purpose**: Real-time fault monitoring and management.

**Responsibilities**:
- Display active faults
- Show fault history
- Acknowledge faults
- Filter faults by severity/type
- Send fault notifications

**Key Features**:
- Real-time fault updates via WebSocket
- Severity-based color coding
- Fault acknowledgment
- Historical fault log
- Filter and search
- Export functionality

**Fault Severity Levels**:
- Critical (Red)
- Warning (Yellow)
- Info (Blue)

**Fault Structure**:
```javascript
{
  id: string,
  timestamp: Date,
  severity: 'critical' | 'warning' | 'info',
  system: 'ess' | 'tgs' | 'tes' | 'hp',
  device: string,
  message: string,
  acknowledged: boolean,
  acknowledgedBy: string | null
}
```

**State Usage**:
- Redux: FaultsSlice
- WebSocket: Real-time fault updates
- React Query: Fault history

---

### ReportStatusMain

**Location**: `src/components/reportStatus/ReportStatusMain.js`

**Purpose**: Generate and view system reports.

**Responsibilities**:
- Generate various report types
- Display report status
- Download generated reports
- Schedule recurring reports

**Report Types**:
- System status reports
- Telemetry reports
- Fault reports
- Audit reports
- Custom reports

**Key Features**:
- Report generation
- PDF export
- Date range selection
- Report templates
- Scheduled reports

**State Usage**:
- Redux: reportStatusSlice
- React Query: Report data

---

## Shared Components

### commonComponentsMC

**Location**: `src/components/commonComponentsMC/`

**Purpose**: Shared components for Master Control across all systems.

**Components**:

#### SystemMain
Unified system view with tabs for MC, Graph, History, Video.

#### GraphMain
Real-time graph display component used across systems.

#### HistoryMain
Historical data display component.

#### VideoMain
Video monitoring component for systems with camera feeds.

**Key Benefits**:
- Code reuse across ESS/TGS/TES
- Consistent UI/UX
- Centralized maintenance
- Shared business logic

---

### UI Components

**Location**: `src/components/ui/`

**Purpose**: Basic reusable UI components.

**Components**:
- Button
- Input
- Dropdown
- Modal
- Card
- Table
- Tabs
- Tooltip
- Alert
- Badge

**Example Usage**:
```javascript
import { Button, Modal } from '../ui';

<Button primary onClick={handleClick}>
  Save
</Button>

<Modal isOpen={isOpen} onClose={handleClose}>
  <h2>Confirm Action</h2>
  <p>Are you sure?</p>
</Modal>
```

---

## Layout Components

### Header

**Location**: `src/components/Header.js`

**Purpose**: Top navigation bar.

**Responsibilities**:
- Display app title/logo
- Show current user
- Provide quick actions
- Display notifications
- Language selector
- Logout button

**Features**:
- Responsive design
- User menu dropdown
- Notification badge
- Quick navigation

---

### Sidebar

**Location**: `src/components/sidebar/`

**Purpose**: Left navigation menu.

**Responsibilities**:
- Display navigation links
- Highlight active route
- Show role-based menu items
- Collapsible on mobile

**Navigation Items** (role-dependent):
- Dashboard
- Telemetry
- Master Control
- ESS (if authorized)
- TGS (if authorized)
- TES (if authorized)
- Heating Platform (if authorized)
- Settings
- Audit Trail (if authorized)
- Faults
- Reports (if authorized)

---

### Footer

**Location**: `src/components/Footer.js`

**Purpose**: Application footer.

**Responsibilities**:
- Display copyright
- Show version number
- Provide support links

---

### MobileMain

**Location**: `src/components/mobileMain/MobileMain.js`

**Purpose**: Mobile-optimized layout.

**Responsibilities**:
- Responsive mobile UI
- Simplified navigation
- Touch-friendly controls
- Optimized data display

**Features**:
- Hamburger menu
- Swipeable tabs
- Mobile-first design
- Reduced complexity

---

## Utility Components

### ErrorBoundary

**Location**: `src/components/errorBoundary/`

**Purpose**: Catch and handle React component errors gracefully.

**Responsibilities**:
- Catch JavaScript errors in child components
- Display fallback UI
- Log errors for debugging
- Prevent full app crashes

**Usage**:
```javascript
<ErrorBoundary>
  <FeatureComponent />
</ErrorBoundary>
```

**Fallback UI**:
- Error message
- Refresh button
- Contact support link

---

### Loading

**Location**: `src/components/loading/`

**Purpose**: Display loading states.

**Responsibilities**:
- Show loading spinner
- Display loading messages
- Provide consistent loading UX

**Variants**:
- Fullscreen loader
- Inline spinner
- Skeleton screens

---

### PrintPDF

**Location**: `src/components/printPDF/`

**Purpose**: PDF export functionality.

**Responsibilities**:
- Generate PDF from components
- Handle print styling
- Export data as PDF

**Usage**:
```javascript
import { exportToPDF } from '../printPDF';

exportToPDF(componentRef, 'report.pdf');
```

---

### SearchBox

**Location**: `src/components/searchBox/`

**Purpose**: Global search functionality.

**Responsibilities**:
- Search across data
- Filter results
- Quick navigation

**Features**:
- Real-time search
- Debounced input
- Keyboard navigation
- Result highlighting

---

### UserMessages

**Location**: `src/components/userMessages/`

**Purpose**: Toast notifications and user messages.

**Responsibilities**:
- Display success messages
- Show error notifications
- Warning alerts
- Info messages

**Message Types**:
- Success (green)
- Error (red)
- Warning (yellow)
- Info (blue)

**Usage**:
```javascript
import { showMessage } from '../userMessages';

showMessage('Operation successful!', 'success');
```

---

## Component Patterns

### Pattern 1: Main Component Structure

Most feature components follow this pattern:

```javascript
// FeatureMain.js
import React from 'react';
import { useFeatureData } from '../../hooks';
import { Container, Header, Content } from './styles';

export default function FeatureMain() {
  // 1. Custom hooks for data and logic
  const { data, isLoading, error } = useFeatureData();

  // 2. Local state for UI
  const [selectedItem, setSelectedItem] = useState(null);

  // 3. Event handlers
  const handleSelect = (item) => {
    setSelectedItem(item);
  };

  // 4. Conditional rendering
  if (isLoading) return <Loading />;
  if (error) return <Error message={error.message} />;

  // 5. Main render
  return (
    <Container>
      <Header>Feature Title</Header>
      <Content>
        {/* Feature content */}
      </Content>
    </Container>
  );
}
```

### Pattern 2: Shared Component Usage

Components use shared hooks and utilities:

```javascript
// Before refactoring (duplicated logic)
function ESSComponent() {
  const [data, setData] = useState(null);
  useEffect(() => {
    fetchESSData().then(setData);
  }, []);
  // ... lots of logic
}

function TGSComponent() {
  const [data, setData] = useState(null);
  useEffect(() => {
    fetchTGSData().then(setData);
  }, []);
  // ... same logic duplicated
}

// After refactoring (shared hook)
function ESSComponent() {
  const data = useSwitchData('ess');
  // ... clean and simple
}

function TGSComponent() {
  const data = useSwitchData('tgs');
  // ... clean and simple
}
```

### Pattern 3: Context Usage

Components access context for shared state:

```javascript
import { useContext } from 'react';
import { ContextOfEssTgsTes } from '../context';

function Component() {
  const { messageBox, setMessageBox } = useContext(ContextOfEssTgsTes);

  const showMessage = (message) => {
    setMessageBox({ show: true, message });
  };

  return <div>{/* ... */}</div>;
}
```

### Pattern 4: Redux Integration

Components connect to Redux for global state:

```javascript
import { useSelector, useDispatch } from 'react-redux';
import { setSwitch } from '../store/slices/essSwitchSlice';

function Component() {
  const switchState = useSelector(state => state.essSwitch);
  const dispatch = useDispatch();

  const handleToggle = (deviceId, value) => {
    dispatch(setSwitch({ deviceId, value }));
  };

  return <div>{/* ... */}</div>;
}
```

### Pattern 5: Styled Components

Components use styled-components for styling:

```javascript
import styled from 'styled-components';

const Container = styled.div`
  padding: 20px;
  background: #fff;
`;

const Button = styled.button`
  background: ${props => props.primary ? 'blue' : 'gray'};
  padding: 10px 20px;
  border-radius: 4px;

  &:hover {
    opacity: 0.8;
  }
`;

function Component() {
  return (
    <Container>
      <Button primary>Click Me</Button>
    </Container>
  );
}
```

## Component Testing

### Recommended Testing Approach

1. **Unit Tests**: Test individual components in isolation
2. **Integration Tests**: Test component interactions
3. **E2E Tests**: Test full user flows

### Example Test Structure

```javascript
import { render, screen, fireEvent } from '@testing-library/react';
import Component from './Component';

describe('Component', () => {
  it('renders correctly', () => {
    render(<Component />);
    expect(screen.getByText('Title')).toBeInTheDocument();
  });

  it('handles user interaction', () => {
    render(<Component />);
    fireEvent.click(screen.getByRole('button'));
    expect(mockHandler).toHaveBeenCalled();
  });
});
```

## Best Practices

### 1. Component Organization
- One component per file
- Co-locate styles with components
- Group related components in folders
- Use index.js for exports

### 2. Component Naming
- PascalCase for component names
- Descriptive names (e.g., `UserProfileCard` not `Card`)
- Suffix with type if needed (e.g., `Modal`, `Form`)

### 3. Props
- Define PropTypes or use TypeScript
- Destructure props in function signature
- Provide default props where appropriate

### 4. State Management
- Use local state for UI-only state
- Use Redux for shared/persisted state
- Use React Query for server state
- Avoid prop drilling (use context or Redux)

### 5. Performance
- Use React.memo() for expensive components
- Implement useMemo() for expensive calculations
- Use useCallback() for stable function references
- Lazy load large components

### 6. Accessibility
- Use semantic HTML elements
- Provide alt text for images
- Use ARIA labels where needed
- Ensure keyboard navigation works

## Recent Refactoring

The component architecture has recently undergone significant improvements:

### Improvements Made:
- **Removed 787 lines of dead code** from various components
- **Created shared hooks** to eliminate duplication
- **Consolidated logic** from ESS/TGS/TES components
- **Improved component structure** for better maintainability

### Shared Hooks Created:
- `useSwitchData` - Unified data fetching
- `useSwitchControls` - Shared control logic
- `useProgramIcons` - Icon state management
- `useHeaderHat` - Header state logic
- `useNavigationState` - Navigation logic
- `useControlBoxTemperatures` - Temperature state
- `useActivationStates` - Activation logic
- `useControlBoxMessages` - Message handling

### Impact:
- Reduced code duplication by ~40%
- Improved code maintainability
- Easier to add new systems
- Consistent behavior across systems

See `/docs/CODEBASE_IMPROVEMENTS_SUMMARY.md` for detailed metrics.

## Conclusion

The component architecture provides:
- **Modularity**: Components are self-contained and reusable
- **Consistency**: Shared components ensure consistent UI/UX
- **Maintainability**: Clear structure and patterns
- **Scalability**: Easy to add new features
- **Performance**: Optimized rendering and data fetching

For more information:
- [Architecture Guide](ARCHITECTURE.md)
- [Hooks Reference](HOOKS_REFERENCE.md)
- [State Management](STATE_MANAGEMENT.md)
- [Development Guide](DEVELOPMENT.md)
