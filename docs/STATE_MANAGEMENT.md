# State Management Guide

This document provides comprehensive documentation for state management in the Industrial Energy Management System, covering Redux, Context API, and local state patterns.

## Table of Contents

- [Overview](#overview)
- [State Management Strategy](#state-management-strategy)
- [Redux Store](#redux-store)
- [Redux Slices](#redux-slices)
- [Context Providers](#context-providers)
- [Local State](#local-state)
- [Best Practices](#best-practices)
- [Migration Guide](#migration-guide)

## Overview

The application uses a three-layer state management approach:

```
┌─────────────────────────────────────────┐
│        Local Component State            │
│         (useState, useReducer)          │
│    - UI state (modals, inputs, etc.)    │
└─────────────────────────────────────────┘
              ↑
┌─────────────────────────────────────────┐
│          React Context                  │
│      (Feature-specific state)           │
│  - Message boxes, control state         │
└─────────────────────────────────────────┘
              ↑
┌─────────────────────────────────────────┐
│          Redux Store                    │
│      (Global application state)         │
│   - User auth, system data, settings    │
│   - Persisted to localStorage           │
└─────────────────────────────────────────┘
```

## State Management Strategy

### When to Use Each Approach

#### 1. Local State (useState/useReducer)
**Use for:**
- UI-only state (modal open/closed, input values)
- Temporary state not needed elsewhere
- Form state before submission
- Animation states
- Hover/focus states

**Example:**
```javascript
const [isModalOpen, setIsModalOpen] = useState(false);
const [searchTerm, setSearchTerm] = useState('');
```

#### 2. Context API
**Use for:**
- Feature-specific shared state
- Cross-component communication within a feature
- State that doesn't need persistence
- Avoiding prop drilling within a feature

**Example:**
```javascript
const { messageBox, setMessageBox } = useContext(ContextOfEssTgsTes);
```

#### 3. Redux Store
**Use for:**
- Application-wide state
- State that needs persistence (user, settings)
- Complex state with many actions
- State shared across multiple features
- State that changes frequently

**Example:**
```javascript
const switchState = useSelector(state => state.essSwitch);
dispatch(setSwitch({ location, machine, value }));
```

## Redux Store

### Store Configuration

**Location**: `src/components/store/store.js`

The Redux store is configured using Redux Toolkit with persistence:

```javascript
import { configureStore } from '@reduxjs/toolkit';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

const persistConfig = {
  key: 'root',
  storage,
  whitelist: [
    'user',
    'essSwitch',
    'tgsSwitch',
    'tesSwitch',
    'hpElectricSwitch',
    'hpGasSwitch',
    'locations',
    'settings',
    // ... other slices to persist
  ]
};

const rootReducer = combineReducers({
  essSwitch: essSwitchSlice.reducer,
  tgsSwitch: tgsSwitchSlice.reducer,
  tesSwitch: tesSwitchSlice.reducer,
  // ... 40+ reducers
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);
```

### State Persistence

Persisted state survives:
- Page refreshes
- Browser close/reopen
- Navigation

**Storage**: localStorage

**Persisted Slices**:
- User authentication
- System switches (ESS/TGS/TES/HP)
- Locations
- Settings
- Master Control state

## Redux Slices

The application contains 40+ Redux slices organized by feature.

### System Switch Slices

#### essSwitchSlice

**Location**: `src/components/store/slices/essSwitchSlice.js`

**Purpose**: Manages ESS (Energy Storage System) switch states.

**State Structure**:
```javascript
{
  essSwitch: {
    [location]: {
      [machine]: {
        deviceMac: string,
        machineName: string,
        isOff: boolean,
        isFaults: boolean,
        currentTemp: number,
        setTemp: number,
        energyConsumption: number,
        programs: {
          instantHeat: { activated: boolean, ready: boolean },
          snowSensor: { activated: boolean, ready: boolean },
          fanOnly: { activated: boolean, ready: boolean }
        },
        // ... more fields
      }
    }
  },
  flatEssSwitch: {
    [location]: {
      [machine]: { /* flattened data */ }
    }
  }
}
```

**Actions**:
```javascript
// Set switch data
dispatch(setEssSwitch({
  location: 'building-1',
  machine: 'machine-1',
  data: { /* switch data */ }
}));

// Update specific field
dispatch(updateEssSwitchField({
  location: 'building-1',
  machine: 'machine-1',
  field: 'setTemp',
  value: 25
}));

// Toggle freeze
dispatch(toggleEssFreeze({
  location: 'building-1',
  machine: 'machine-1'
}));
```

**Selectors**:
```javascript
// Get all switches
const essSwitch = useSelector(state => state.essSwitch);

// Get specific machine
const machine = useSelector(state =>
  state.flatEssSwitch?.[location]?.[machineId]
);

// Get with selector function
const selectEssSwitch = (state) => state.essSwitch;
const essData = useSelector(selectEssSwitch);
```

---

#### tgsSwitchSlice

**Location**: `src/components/store/slices/tgsSwitchSlice.js`

**Purpose**: Manages TGS (Thermal Gas System) switch states.

**State Structure**: Similar to essSwitchSlice

**Actions**:
- `setTgsSwitch`
- `updateTgsSwitchField`
- `toggleTgsFreeze`

---

#### tesSwitchSlice

**Location**: `src/components/store/slices/tesSwitchSlice.js`

**Purpose**: Manages TES (Thermal Electric System) switch states.

**State Structure**: Similar to essSwitchSlice

**Actions**:
- `setTesSwitch`
- `updateTesSwitchField`
- `toggleTesFreeze`

---

#### hpElectricSwitchSlice & hpGasSwitchSlice

**Locations**:
- `src/components/store/slices/hpElectricSwitchSlice.js`
- `src/components/store/slices/hpGasSwitchSlice.js`

**Purpose**: Manage Heating Platform switches (electric and gas).

---

### User & Authentication

#### userSlice

**Location**: `src/components/store/slices/userSlice.js`

**Purpose**: Manages user authentication and profile data.

**State Structure**:
```javascript
{
  user: {
    id: string,
    email: string,
    name: string,
    role: string,
    permissions: {
      canControlESS: boolean,
      canControlTGS: boolean,
      canControlTES: boolean,
      canViewAudit: boolean,
      canManageUsers: boolean,
      // ... more permissions
    },
    isAuthenticated: boolean,
    token: string
  }
}
```

**Actions**:
```javascript
// Set user after login
dispatch(setUser({
  id: '123',
  email: 'user@example.com',
  role: 'Administrator',
  // ...
}));

// Logout
dispatch(logout());

// Update profile
dispatch(updateUserProfile({
  name: 'New Name',
  phone: '123-456-7890'
}));
```

**Selectors**:
```javascript
const user = useSelector(state => state.user);
const isAuthenticated = useSelector(state => state.user.isAuthenticated);
const userRole = useSelector(state => state.user.role);
const permissions = useSelector(state => state.user.permissions);
```

---

### Master Control Slices

#### masterControlSelectSlice

**Location**: `src/components/store/slices/masterControlSelectSlice.js`

**Purpose**: Manages Master Control selection state.

**State Structure**:
```javascript
{
  masterControlSelect: {
    selectedView: 'byMachine' | 'byLocation',
    selectedSystem: 'ess' | 'tgs' | 'tes' | 'all',
    selectedLocation: string,
    selectedMachine: string
  }
}
```

**Actions**:
- `setSelectedView`
- `setSelectedSystem`
- `setSelectedLocation`
- `setSelectedMachine`

---

#### MCIsExpandedSlice

**Location**: `src/components/store/slices/MCIsExpandedSlice.js`

**Purpose**: Tracks which Master Control panels are expanded.

**State Structure**:
```javascript
{
  MCIsExpanded: {
    [location]: {
      [machine]: boolean  // true if expanded
    }
  }
}
```

**Actions**:
```javascript
dispatch(toggleMCExpanded({ location, machine }));
dispatch(expandAll({ location }));
dispatch(collapseAll({ location }));
```

---

#### mCCommandSlice

**Location**: `src/components/store/slices/mCCommandSlice.js`

**Purpose**: Manages Master Control command state.

---

### Telemetry & Data Slices

#### telemetrySlice

**Location**: `src/components/store/slices/telemetrySlice.js`

**Purpose**: Manages telemetry view state.

**State Structure**:
```javascript
{
  telemetry: {
    selectedDevices: string[],
    selectedParameters: string[],
    timeRange: {
      start: Date,
      end: Date
    },
    refreshInterval: number
  }
}
```

---

#### telemetryChartDataSlice

**Location**: `src/components/store/slices/telemetryChartDataSlice.js`

**Purpose**: Stores chart data for telemetry.

---

#### Data Consumption Slices

**Locations**:
- `src/components/store/slices/essDataConsumptionSlice.js`
- `src/components/store/slices/tgsDataConsumptionSlice.js`
- `src/components/store/slices/tesDataConsumptionSlice.js`
- `src/components/store/slices/hpDataConsumptionSlice.js`

**Purpose**: Track energy consumption data for each system.

---

### Settings Slices

#### unitsSlice

**Location**: `src/components/store/slices/settings/unitsSlice.js`

**Purpose**: Manages temperature unit preference (Celsius/Fahrenheit).

**State Structure**:
```javascript
{
  units: {
    isF: boolean  // true for Fahrenheit, false for Celsius
  }
}
```

**Actions**:
```javascript
dispatch(setIsF(true));  // Set to Fahrenheit
dispatch(setIsF(false)); // Set to Celsius
```

---

#### snowSensorSlice

**Location**: `src/components/store/slices/settings/snowSensorSlice.js`

**Purpose**: Snow sensor settings.

---

#### windFactorSlice

**Location**: `src/components/store/slices/settings/windFactorSlice.js`

**Purpose**: Wind factor settings.

---

#### interfaceModeSlice

**Location**: `src/components/store/slices/settings/interfaceModeSlice.js`

**Purpose**: Interface mode preferences.

---

#### settingsOptionsSlice

**Location**: `src/components/store/slices/settings/settingsOptionsSlice.js`

**Purpose**: General settings options.

---

#### adminSlice

**Location**: `src/components/store/slices/settings/admin/adminSlice.js`

**Purpose**: Admin-specific settings.

---

### Other Slices

#### locationsSlice

**Location**: `src/components/store/slices/locationsSlice.js`

**Purpose**: Manages location data.

**State Structure**:
```javascript
{
  locations: {
    [locationId]: {
      id: string,
      name: string,
      address: string,
      systems: string[],  // ['ess', 'tgs', 'tes']
      // ...
    }
  }
}
```

---

#### FaultsSlice

**Location**: `src/components/store/slices/FaultsSlice.js`

**Purpose**: Manages fault tracking.

**State Structure**:
```javascript
{
  faults: {
    active: [
      {
        id: string,
        timestamp: Date,
        severity: 'critical' | 'warning' | 'info',
        system: string,
        device: string,
        message: string,
        acknowledged: boolean
      }
    ],
    history: []
  }
}
```

**Actions**:
- `addFault`
- `acknowledgeFault`
- `clearFault`
- `loadFaultHistory`

---

#### globalOverviewSlice

**Location**: `src/components/store/slices/globalOverviewSlice.js`

**Purpose**: Dashboard overview state.

---

#### reportStatusSlice

**Location**: `src/components/store/slices/reportStatusSlice.js`

**Purpose**: Report generation status.

---

#### messageBoxesSlice

**Location**: `src/components/store/slices/messageBoxesSlice.js`

**Purpose**: Global message boxes/notifications.

---

#### appSlice

**Location**: `src/components/store/slices/appSlice.js`

**Purpose**: General application state (sidebar open, theme, etc.).

---

## Context Providers

### ContextOfEssTgsTes

**Location**: `src/components/context/contextOfEssTgsTes.js`

**Purpose**: Feature-specific state for ESS/TGS/TES Master Control.

**Provided State**:
```javascript
{
  messageBox: {
    show: boolean,
    title: string,
    message: string,
    type: 'info' | 'warning' | 'error' | 'success'
  },
  setMessageBox: (box) => void,
  controlState: {
    selectedProgram: string,
    isControlActive: boolean
  },
  setControlState: (state) => void
}
```

**Usage**:
```javascript
import { ContextOfEssTgsTes } from '../context';

function Component() {
  const { messageBox, setMessageBox } = useContext(ContextOfEssTgsTes);

  const showMessage = () => {
    setMessageBox({
      show: true,
      title: 'Success',
      message: 'Operation completed!',
      type: 'success'
    });
  };

  return (
    <>
      <button onClick={showMessage}>Show Message</button>
      {messageBox.show && (
        <Modal title={messageBox.title}>{messageBox.message}</Modal>
      )}
    </>
  );
}
```

---

### ContextOfGeneral

**Location**: `src/components/context/contextOfGeneral.js`

**Purpose**: General application context.

**Provided State**:
- Application-wide settings
- Shared UI state
- Feature flags

---

### ContextOfSettings

**Location**: `src/components/context/ContextOfSettings.js`

**Purpose**: Settings management context.

**Provided State**:
- Settings form state
- Unsaved changes tracking
- Settings validation

---

## Local State

### useState Examples

#### Modal State
```javascript
const [isModalOpen, setIsModalOpen] = useState(false);

const openModal = () => setIsModalOpen(true);
const closeModal = () => setIsModalOpen(false);
```

#### Form State
```javascript
const [formData, setFormData] = useState({
  name: '',
  email: '',
  phone: ''
});

const handleChange = (e) => {
  setFormData({
    ...formData,
    [e.target.name]: e.target.value
  });
};
```

#### Loading State
```javascript
const [isLoading, setIsLoading] = useState(false);

const fetchData = async () => {
  setIsLoading(true);
  try {
    const data = await apiCall();
    // Handle data
  } finally {
    setIsLoading(false);
  }
};
```

### useReducer for Complex State

```javascript
const initialState = {
  step: 1,
  data: {},
  errors: {},
  isSubmitting: false
};

function reducer(state, action) {
  switch (action.type) {
    case 'NEXT_STEP':
      return { ...state, step: state.step + 1 };
    case 'PREV_STEP':
      return { ...state, step: state.step - 1 };
    case 'SET_DATA':
      return { ...state, data: { ...state.data, ...action.payload } };
    case 'SET_ERROR':
      return { ...state, errors: { ...state.errors, ...action.payload } };
    default:
      return state;
  }
}

function WizardForm() {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (/* ... */);
}
```

## Best Practices

### 1. Choose the Right State Layer

```javascript
// ❌ Bad - using Redux for UI-only state
dispatch(setModalOpen(true));

// ✅ Good - using local state for UI
const [isModalOpen, setIsModalOpen] = useState(false);

// ❌ Bad - using local state for shared data
const [userData, setUserData] = useState(null);

// ✅ Good - using Redux for shared data
const userData = useSelector(state => state.user);
```

### 2. Use Selectors for Derived State

```javascript
// ❌ Bad - computing in component
function Component() {
  const switches = useSelector(state => state.essSwitch);
  const totalEnergy = Object.values(switches).reduce((sum, sw) =>
    sum + sw.energyConsumption, 0
  );
}

// ✅ Good - using memoized selector
const selectTotalEnergy = createSelector(
  state => state.essSwitch,
  switches => Object.values(switches).reduce((sum, sw) =>
    sum + sw.energyConsumption, 0
  )
);

function Component() {
  const totalEnergy = useSelector(selectTotalEnergy);
}
```

### 3. Normalize State Shape

```javascript
// ❌ Bad - nested arrays
{
  locations: [
    {
      id: '1',
      machines: [
        { id: 'm1', name: 'Machine 1' },
        { id: 'm2', name: 'Machine 2' }
      ]
    }
  ]
}

// ✅ Good - normalized
{
  locations: {
    '1': { id: '1', machineIds: ['m1', 'm2'] }
  },
  machines: {
    'm1': { id: 'm1', name: 'Machine 1', locationId: '1' },
    'm2': { id: 'm2', name: 'Machine 2', locationId: '1' }
  }
}
```

### 4. Keep Actions Simple

```javascript
// ❌ Bad - action with side effects
const complexAction = () => (dispatch) => {
  // Don't mix logic and dispatch
  const result = performCalculation();
  dispatch(setResult(result));
};

// ✅ Good - pure action creator
const setResult = (result) => ({
  type: 'SET_RESULT',
  payload: result
});

// Perform calculation in component/hook
const result = performCalculation();
dispatch(setResult(result));
```

### 5. Use Redux Toolkit

```javascript
// ✅ Redux Toolkit slice (already using this)
const slice = createSlice({
  name: 'essSwitch',
  initialState: {},
  reducers: {
    setSwitch: (state, action) => {
      // Immer allows "mutating" syntax
      state[action.payload.id] = action.payload.data;
    }
  }
});
```

### 6. Avoid Prop Drilling

```javascript
// ❌ Bad - prop drilling
<Parent>
  <Child1 userData={userData}>
    <Child2 userData={userData}>
      <Child3 userData={userData} />
    </Child2>
  </Child1>
</Parent>

// ✅ Good - use Redux or Context
function Child3() {
  const userData = useSelector(state => state.user);
  // or
  const { userData } = useContext(UserContext);
}
```

### 7. Batch Related Updates

```javascript
// ❌ Bad - multiple dispatches
dispatch(setLocation(location));
dispatch(setMachine(machine));
dispatch(setData(data));

// ✅ Good - single dispatch with combined data
dispatch(setMachineData({ location, machine, data }));
```

## Migration Guide

### Moving from Local State to Redux

1. **Create a slice**:
```javascript
// slices/featureSlice.js
const featureSlice = createSlice({
  name: 'feature',
  initialState: {},
  reducers: {
    setData: (state, action) => {
      state.data = action.payload;
    }
  }
});
```

2. **Add to store**:
```javascript
// store.js
import featureSlice from './slices/featureSlice';

const store = configureStore({
  reducer: {
    feature: featureSlice.reducer,
    // ... other reducers
  }
});
```

3. **Update component**:
```javascript
// Before
const [data, setData] = useState(null);

// After
const data = useSelector(state => state.feature.data);
const dispatch = useDispatch();
dispatch(setData(newData));
```

### Moving from Redux to React Query

For server state, consider React Query:

```javascript
// Before - Redux
const data = useSelector(state => state.telemetryData);
useEffect(() => {
  dispatch(fetchTelemetryData());
}, []);

// After - React Query
const { data, isLoading } = useQuery(
  ['telemetry'],
  fetchTelemetryData,
  { staleTime: 60000 }
);
```

## Performance Optimization

### 1. Use Shallow Equality

```javascript
// Select only what you need
const machineName = useSelector(state =>
  state.essSwitch?.[location]?.[machine]?.machineName
);

// Instead of
const machine = useSelector(state =>
  state.essSwitch?.[location]?.[machine]
);
const machineName = machine?.machineName;
```

### 2. Memoize Selectors

```javascript
import { createSelector } from '@reduxjs/toolkit';

const selectMachinesByLocation = createSelector(
  [state => state.essSwitch, (state, location) => location],
  (switches, location) => switches[location] || {}
);
```

### 3. Split Large Slices

If a slice becomes too large, consider splitting it:

```javascript
// Instead of one large switchSlice
// Create separate slices:
- essSwitchDataSlice
- essSwitchProgramsSlice
- essSwitchSettingsSlice
```

## Debugging

### Redux DevTools

Use Redux DevTools to:
- Inspect state
- Track actions
- Time-travel debugging

```javascript
const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== 'production'
});
```

### Logging

```javascript
// Log state changes
const loggerMiddleware = store => next => action => {
  console.log('Dispatching:', action);
  const result = next(action);
  console.log('Next state:', store.getState());
  return result;
};
```

## Conclusion

The three-layer state management approach provides:
- **Flexibility**: Use the right tool for each scenario
- **Performance**: Minimize unnecessary re-renders
- **Maintainability**: Clear separation of concerns
- **Persistence**: Critical state survives refreshes
- **Developer Experience**: Redux DevTools, clear patterns

For more information:
- [Redux Toolkit Documentation](https://redux-toolkit.js.org/)
- [React Context Documentation](https://react.dev/learn/passing-data-deeply-with-context)
- [Architecture Guide](ARCHITECTURE.md)
- [Hooks Reference](HOOKS_REFERENCE.md)
