# Custom Hooks Reference

This document provides comprehensive documentation for all custom React hooks in the Industrial Energy Management System.

## Table of Contents

- [Overview](#overview)
- [Shared Component Hooks](#shared-component-hooks)
- [Data Fetching Hooks](#data-fetching-hooks)
- [Control Hooks](#control-hooks)
- [UI State Hooks](#ui-state-hooks)
- [Utility Hooks](#utility-hooks)
- [System-Specific Hooks](#system-specific-hooks)
- [Best Practices](#best-practices)

## Overview

The application contains 25+ custom hooks that encapsulate reusable logic across components. These hooks follow React best practices and provide clean abstractions for:

- Data fetching and caching
- Component state management
- User interactions
- Real-time updates
- Permission checking
- Navigation

### Hook Organization

Hooks are located in `src/hooks/` and exported from `src/hooks/index.js`:

```javascript
import {
  useSwitchData,
  useProgramIcons,
  useSocket,
  useDebounce,
  // ... other hooks
} from '../hooks';
```

## Shared Component Hooks

These hooks were created during recent refactoring to eliminate code duplication across ESS/TGS/TES components.

### useSwitchData

Retrieves and processes switch data for a specific machine.

**Location**: `src/hooks/useSwitchData.js`

**Purpose**: Centralized data fetching and processing for Master Control machines.

**Signature**:
```javascript
useSwitchData(location, machine, systemType, isMobile, isF)
```

**Parameters**:
```javascript
{
  location: string,        // Location ID
  machine: string,         // Machine ID
  systemType: 'ess'|'tgs'|'tes',  // System type
  isMobile: boolean,       // Mobile device flag
  isF: boolean            // Fahrenheit flag
}
```

**Returns**:
```javascript
{
  // Raw data
  switchData: object,      // Complete switch data object
  deviceMac: string,       // Device MAC address
  userId: string,          // Current user ID

  // Status flags
  isFaults: boolean,       // Has active faults
  isOff: boolean,          // Device is off
  isReady: boolean,        // Device is ready
  isActivated: boolean,    // Device is activated

  // Display data
  headerTitle: string,     // Formatted header title
  energyConsumption: number,  // Total energy consumption
  energyUnit: string,      // Energy unit (kW, FT³, etc.)
  swtSize: string,         // Switch size
  machineName: string,     // Machine name
  heatingSystem: string,   // Heating system type

  // Program states
  mobileSelectedProgram: object,  // Mobile selected program
  activatedProgram: object,       // Currently active program
  readyProgram: object,          // Ready program

  // Temperature data
  currentTemp: number,     // Current temperature
  setTemp: number,         // Set temperature

  // ... 30+ more fields
}
```

**Usage Example**:
```javascript
import { useSwitchData } from '../../hooks';

function MachineComponent({ location, machine, isMobile }) {
  const { isF } = useSelector(selectUnits);

  const {
    switchData,
    deviceMac,
    isFaults,
    isOff,
    headerTitle,
    energyConsumption,
    energyUnit
  } = useSwitchData(location, machine, 'ess', isMobile, isF);

  return (
    <div>
      <h2>{headerTitle}</h2>
      <p>Energy: {energyConsumption} {energyUnit}</p>
      <p>Status: {isOff ? 'Off' : 'On'}</p>
    </div>
  );
}
```

**Replaces**: ~100 lines of duplicated Redux selectors and data extraction logic per component.

---

### useProgramIcons

Manages program icon states for mobile and desktop views.

**Location**: `src/hooks/useProgramIcons.js`

**Purpose**: Determine which program icons to display based on current state.

**Signature**:
```javascript
useProgramIcons(switchData, mobileSelectedProgram, systemType)
```

**Parameters**:
```javascript
{
  switchData: object,              // Switch data from useSwitchData
  mobileSelectedProgram: object,   // Mobile selected program state
  systemType: 'ess'|'tgs'|'tes'   // System type
}
```

**Returns**:
```javascript
{
  selectedProgramSrc: string,   // Mobile selected program icon URL
  activatedProgramSrc: string,  // Currently active program icon URL
  readyProgramSrc: string       // Ready program icon URL
}
```

**Icon Mapping**:
- `instantHeat` → `/images/logo-instantHeat.svg`
- `snowSensor` → `/images/logo-snowSensor.svg`
- `fanOnly` → `/images/logo-fanOnly.svg`

**Usage Example**:
```javascript
import { useProgramIcons } from '../../hooks';

function ProgramDisplay({ switchData, mobileSelectedProgram }) {
  const { selectedProgramSrc, activatedProgramSrc } = useProgramIcons(
    switchData,
    mobileSelectedProgram,
    'ess'
  );

  return (
    <div>
      {selectedProgramSrc && <img src={selectedProgramSrc} alt="Selected" />}
      {activatedProgramSrc && <img src={activatedProgramSrc} alt="Active" />}
    </div>
  );
}
```

**Replaces**: 3 `useEffect` hooks (~180 lines total) that managed icon state.

---

### useSwitchControls

Handles all switch control actions and interactions.

**Location**: `src/hooks/useSwitchControls.js`

**Purpose**: Centralized control logic for device operations.

**Signature**:
```javascript
useSwitchControls(systemType, location, machine, deviceMac, userId, isF)
```

**Parameters**:
```javascript
{
  systemType: 'ess'|'tgs'|'tes',  // System type
  location: string,               // Location ID
  machine: string,                // Machine ID
  deviceMac: string,              // Device MAC address
  userId: string,                 // User ID
  isF: boolean                    // Fahrenheit flag
}
```

**Returns**:
```javascript
{
  // Control handlers
  handleShutOff: (isOff: boolean) => void,
  handleSnowSensor: (isReady: boolean) => void,
  handleFanOnly: (isReady: boolean) => void,
  handleInstantHeat: (inputTemp, isActivated, isReady, title) => void,
  handleMachineDetailToggle: () => void,
  handleButtonClick: (btnName: string, ...args) => void,

  // Message box state
  openMessageBox: boolean,
  messageTitle: string,
  message: string,
  closeMessageBox: () => void,
}
```

**Usage Example**:
```javascript
import { useSwitchControls } from '../../hooks';

function ControlPanel({ location, machine, deviceMac, userId, isF }) {
  const {
    handleShutOff,
    handleSnowSensor,
    handleInstantHeat,
    openMessageBox,
    messageTitle,
    message,
    closeMessageBox
  } = useSwitchControls('ess', location, machine, deviceMac, userId, isF);

  return (
    <>
      <button onClick={() => handleShutOff(false)}>Turn Off</button>
      <button onClick={() => handleSnowSensor(true)}>Snow Sensor</button>
      <button onClick={() => handleInstantHeat(25, false, true, 'Heat')}>
        Instant Heat
      </button>

      {openMessageBox && (
        <Modal title={messageTitle} onClose={closeMessageBox}>
          {message}
        </Modal>
      )}
    </>
  );
}
```

**API Calls**:
- `freezeSwitchDeviceService()` - For shut off/on
- `postCommandService()` - For program commands

**Replaces**: ~150 lines of button handler logic and message state management.

---

### useHeaderHat

Determines the correct header hat image based on device state.

**Location**: `src/hooks/useHeaderHat.js`

**Purpose**: Select appropriate header background based on status and title length.

**Signature**:
```javascript
useHeaderHat(isOff, isFaults, headerTitle, isMobile)
```

**Parameters**:
```javascript
{
  isOff: boolean,         // Device is off
  isFaults: boolean,      // Has active faults
  headerTitle: string,    // Header title text
  isMobile: boolean       // Mobile device flag
}
```

**Returns**: `string` - Image path for header background

**Image Selection Logic**:
1. **If device is off**: Gray header (size based on title length)
2. **If has faults**: Red header (size based on title length)
3. **Otherwise**: Normal header (size based on title length)

**Header Sizes**:
- Short (< 28 chars): `MC-machine-header1.svg`
- Medium (28-45 chars): `MC-machine-header-mediumSize.svg`
- Long (> 45 chars): `MC-machine-header-longSize.svg`

**Usage Example**:
```javascript
import { useHeaderHat } from '../../hooks';

function MachineHeader({ isOff, isFaults, title, isMobile }) {
  const hatImg = useHeaderHat(isOff, isFaults, title, isMobile);

  return (
    <HeaderContainer background={hatImg}>
      <h2>{title}</h2>
    </HeaderContainer>
  );
}
```

**Replaces**: ~40 lines of complex ternary logic for image selection.

---

### useNavigationState

Manages navigation state for integrated switch views.

**Location**: `src/hooks/useNavigationState.js`

**Purpose**: Handle tab navigation within system views.

**Signature**:
```javascript
useNavigationState(initialTab)
```

**Parameters**:
```javascript
{
  initialTab: string  // Initial tab to display
}
```

**Returns**:
```javascript
{
  currentTab: string,
  setCurrentTab: (tab: string) => void,
  isTabActive: (tab: string) => boolean
}
```

**Usage Example**:
```javascript
import { useNavigationState } from '../../hooks';

function SystemView() {
  const { currentTab, setCurrentTab, isTabActive } = useNavigationState('mc');

  return (
    <div>
      <Tabs>
        <Tab active={isTabActive('mc')} onClick={() => setCurrentTab('mc')}>
          Master Control
        </Tab>
        <Tab active={isTabActive('graph')} onClick={() => setCurrentTab('graph')}>
          Graphs
        </Tab>
      </Tabs>

      {currentTab === 'mc' && <MasterControl />}
      {currentTab === 'graph' && <GraphView />}
    </div>
  );
}
```

---

### useControlBoxTemperatures

Manages temperature state for control boxes.

**Location**: `src/hooks/useControlBoxTemperatures.js`

**Purpose**: Handle temperature inputs and validation.

**Signature**:
```javascript
useControlBoxTemperatures(initialTemp, isF)
```

**Parameters**:
```javascript
{
  initialTemp: number,  // Initial temperature value
  isF: boolean         // Fahrenheit flag
}
```

**Returns**:
```javascript
{
  inputTemp: number,
  setInputTemp: (temp: number) => void,
  isValidTemp: boolean,
  convertedTemp: number,  // Converted C/F value
  resetTemp: () => void
}
```

**Usage Example**:
```javascript
import { useControlBoxTemperatures } from '../../hooks';

function TemperatureControl({ initialTemp, isF }) {
  const {
    inputTemp,
    setInputTemp,
    isValidTemp,
    convertedTemp
  } = useControlBoxTemperatures(initialTemp, isF);

  return (
    <div>
      <input
        type="number"
        value={inputTemp}
        onChange={(e) => setInputTemp(e.target.value)}
      />
      {!isValidTemp && <p>Invalid temperature</p>}
      <p>Converted: {convertedTemp}°{isF ? 'F' : 'C'}</p>
    </div>
  );
}
```

---

### useActivationStates

Manages program activation states.

**Location**: `src/hooks/useActivationStates.js`

**Purpose**: Track which programs are activated/ready.

**Signature**:
```javascript
useActivationStates(switchData)
```

**Parameters**:
```javascript
{
  switchData: object  // Switch data from useSwitchData
}
```

**Returns**:
```javascript
{
  isInstantHeatActivated: boolean,
  isSnowSensorActivated: boolean,
  isFanOnlyActivated: boolean,
  isInstantHeatReady: boolean,
  isSnowSensorReady: boolean,
  isFanOnlyReady: boolean
}
```

**Usage Example**:
```javascript
import { useActivationStates } from '../../hooks';

function ProgramButtons({ switchData }) {
  const {
    isInstantHeatActivated,
    isSnowSensorActivated,
    isInstantHeatReady
  } = useActivationStates(switchData);

  return (
    <div>
      <button disabled={!isInstantHeatReady} active={isInstantHeatActivated}>
        Instant Heat
      </button>
      <button active={isSnowSensorActivated}>
        Snow Sensor
      </button>
    </div>
  );
}
```

---

### useControlBoxMessages

Manages message box state for control boxes.

**Location**: `src/hooks/useControlBoxMessages.js`

**Purpose**: Handle confirmation dialogs and messages.

**Signature**:
```javascript
useControlBoxMessages()
```

**Returns**:
```javascript
{
  messageBox: {
    isOpen: boolean,
    title: string,
    message: string,
    type: 'info' | 'warning' | 'error' | 'success'
  },
  showMessage: (title, message, type) => void,
  closeMessage: () => void
}
```

**Usage Example**:
```javascript
import { useControlBoxMessages } from '../../hooks';

function ControlBox() {
  const { messageBox, showMessage, closeMessage } = useControlBoxMessages();

  const handleAction = () => {
    showMessage(
      'Confirm Action',
      'Are you sure you want to proceed?',
      'warning'
    );
  };

  return (
    <>
      <button onClick={handleAction}>Perform Action</button>

      {messageBox.isOpen && (
        <Modal
          title={messageBox.title}
          type={messageBox.type}
          onClose={closeMessage}
        >
          {messageBox.message}
        </Modal>
      )}
    </>
  );
}
```

---

## Data Fetching Hooks

### useSocket

Establishes and manages WebSocket connection for real-time updates.

**Location**: `src/hooks/useSocket.js`

**Purpose**: Real-time data updates via WebSocket.

**Signature**:
```javascript
useSocket(eventName, callback, dependencies)
```

**Parameters**:
```javascript
{
  eventName: string,           // Event to subscribe to
  callback: (data) => void,    // Callback when event received
  dependencies: array          // Dependency array for useEffect
}
```

**Returns**: `Socket` instance

**Usage Example**:
```javascript
import { useSocket } from '../../hooks';

function TelemetryDisplay() {
  const [telemetryData, setTelemetryData] = useState(null);

  useSocket('telemetry-update', (data) => {
    setTelemetryData(data);
  }, []);

  return <div>{/* Display telemetry data */}</div>;
}
```

**Events**:
- `telemetry-update` - Telemetry data updates
- `fault-alert` - New fault alerts
- `status-change` - Device status changes
- `system-notification` - System notifications

---

### useGetScheduleQueries

React Query hooks for schedule data.

**Location**: `src/hooks/useGetScheduleQueries.js`

**Purpose**: Fetch and cache schedule data.

**Exports**:
```javascript
{
  useSchedules,         // Get all schedules
  useScheduleById,      // Get specific schedule
  useCreateSchedule,    // Create schedule mutation
  useUpdateSchedule,    // Update schedule mutation
  useDeleteSchedule     // Delete schedule mutation
}
```

**Usage Example**:
```javascript
import { useSchedules, useCreateSchedule } from '../../hooks';

function ScheduleManager() {
  const { data: schedules, isLoading } = useSchedules();
  const createSchedule = useCreateSchedule();

  const handleCreate = async (scheduleData) => {
    await createSchedule.mutateAsync(scheduleData);
  };

  if (isLoading) return <Loading />;

  return <div>{/* Display schedules */}</div>;
}
```

---

### useGetGraphQueries

React Query hooks for graph/telemetry data.

**Location**: `src/hooks/useGetGraphQueries.js`

**Purpose**: Fetch graph data for visualization.

**Exports**:
```javascript
{
  useGraphData,          // Get graph data
  useMultiParamGraph,    // Multi-parameter graph
  useHistoricalData      // Historical data
}
```

**Usage Example**:
```javascript
import { useGraphData } from '../../hooks';

function TelemetryChart({ deviceId, parameter, startDate, endDate }) {
  const { data, isLoading, error } = useGraphData({
    devices: [deviceId],
    parameters: [parameter],
    startDate,
    endDate
  });

  if (isLoading) return <Loading />;
  if (error) return <Error />;

  return <Chart data={data} />;
}
```

---

### useGetSSRsQueries

React Query hooks for SSR data.

**Location**: `src/hooks/useGetSSRsQueries.js`

**Purpose**: Fetch SSR (Solid State Relay) data.

**Exports**:
```javascript
{
  useSSRs,           // Get SSRs for zone
  useSSRById,        // Get specific SSR
  useUpdateSSR       // Update SSR mutation
}
```

**Usage Example**:
```javascript
import { useSSRs } from '../../hooks';

function SSRList({ zoneId }) {
  const { data: ssrs, isLoading } = useSSRs({ zoneId });

  if (isLoading) return <Loading />;

  return (
    <div>
      {ssrs.map(ssr => (
        <SSRCard key={ssr.id} ssr={ssr} />
      ))}
    </div>
  );
}
```

---

### useGetAllSSRsQueries

React Query hook for all SSRs across all zones.

**Location**: `src/hooks/useGetAllSSRsQueries.js`

**Purpose**: Fetch all SSRs in the system.

**Usage Example**:
```javascript
import { useGetAllSSRsQueries } from '../../hooks';

function AllSSRsView() {
  const { data: allSSRs, isLoading } = useGetAllSSRsQueries();

  return <div>{/* Display all SSRs */}</div>;
}
```

---

### useGetThermocouplesQueries

React Query hooks for thermocouple data.

**Location**: `src/hooks/useGetThermocouplesQueries.js`

**Purpose**: Fetch thermocouple sensor data.

**Usage Example**:
```javascript
import { useGetThermocouplesQueries } from '../../hooks';

function TemperatureMonitor({ deviceId }) {
  const { data: thermocouples } = useGetThermocouplesQueries(deviceId);

  return (
    <div>
      {thermocouples.map(tc => (
        <p key={tc.id}>{tc.name}: {tc.value}°C</p>
      ))}
    </div>
  );
}
```

---

## Control Hooks

### useSetAndCurrentTemp

Manages set and current temperature state.

**Location**: `src/hooks/useSetAndCurrentTemp.js`

**Purpose**: Track temperature setpoint and current value.

**Signature**:
```javascript
useSetAndCurrentTemp(switchData, isF)
```

**Parameters**:
```javascript
{
  switchData: object,  // Switch data
  isF: boolean        // Fahrenheit flag
}
```

**Returns**:
```javascript
{
  setTemp: number,      // Temperature setpoint
  currentTemp: number,  // Current temperature
  tempDiff: number,     // Difference between set and current
  isAtSetpoint: boolean // Whether at setpoint
}
```

**Usage Example**:
```javascript
import { useSetAndCurrentTemp } from '../../hooks';

function TemperatureDisplay({ switchData, isF }) {
  const { setTemp, currentTemp, tempDiff, isAtSetpoint } =
    useSetAndCurrentTemp(switchData, isF);

  return (
    <div>
      <p>Set: {setTemp}°{isF ? 'F' : 'C'}</p>
      <p>Current: {currentTemp}°{isF ? 'F' : 'C'}</p>
      <p>Diff: {tempDiff}°</p>
      {isAtSetpoint && <p>At setpoint</p>}
    </div>
  );
}
```

---

### useCheckControlPermission

Check user permissions for control actions.

**Location**: `src/hooks/useCheckControlPermsission.js`

**Purpose**: Verify user has permission for specific control operations.

**Signature**:
```javascript
useCheckControlPermission(action, systemType)
```

**Parameters**:
```javascript
{
  action: string,                // Action to check ('activate', 'deactivate', etc.)
  systemType: 'ess'|'tgs'|'tes' // System type
}
```

**Returns**: `boolean` - Whether user has permission

**Usage Example**:
```javascript
import { useCheckControlPermission } from '../../hooks';

function ControlButton({ systemType }) {
  const canActivate = useCheckControlPermission('activate', systemType);

  return (
    <button disabled={!canActivate}>
      Activate Program
    </button>
  );
}
```

---

## UI State Hooks

### useSelectBoxArrowsState

Manages select box arrow state (up/down).

**Location**: `src/hooks/useSelectBoxArrowsState.js`

**Purpose**: Track dropdown open/closed state.

**Signature**:
```javascript
useSelectBoxArrowsState()
```

**Returns**:
```javascript
{
  isOpen: boolean,
  toggle: () => void,
  open: () => void,
  close: () => void
}
```

**Usage Example**:
```javascript
import { useSelectBoxArrowsState } from '../../hooks';

function CustomSelect({ options }) {
  const { isOpen, toggle, close } = useSelectBoxArrowsState();

  return (
    <div>
      <button onClick={toggle}>
        Select {isOpen ? '▲' : '▼'}
      </button>
      {isOpen && (
        <DropdownMenu onClose={close}>
          {options.map(opt => <option key={opt}>{opt}</option>)}
        </DropdownMenu>
      )}
    </div>
  );
}
```

---

### useSelectSwitchesDisplay

Manages display state for switch selection.

**Location**: `src/hooks/useSelectSwitchesDisplay.js`

**Purpose**: Handle switch display and selection state.

**Usage Example**:
```javascript
import { useSelectSwitchesDisplay } from '../../hooks';

function SwitchSelector() {
  const { selectedSwitches, toggleSwitch, selectAll, deselectAll } =
    useSelectSwitchesDisplay();

  return <div>{/* Switch selection UI */}</div>;
}
```

---

### useSelectSwitchesDispatches

Handles Redux dispatches for switch selections.

**Location**: `src/hooks/useSelectSwitchesDispatches.js`

**Purpose**: Dispatch switch selection actions to Redux.

**Usage Example**:
```javascript
import { useSelectSwitchesDispatches } from '../../hooks';

function SwitchManager() {
  const { dispatchSelectSwitch, dispatchDeselectSwitch } =
    useSelectSwitchesDispatches();

  const handleSelect = (switchId) => {
    dispatchSelectSwitch(switchId);
  };

  return <div>{/* Switch management UI */}</div>;
}
```

---

### useMessageBox

General-purpose message box state management.

**Location**: `src/hooks/useMessageBox.js`

**Purpose**: Reusable message box/modal state.

**Signature**:
```javascript
useMessageBox()
```

**Returns**:
```javascript
{
  isOpen: boolean,
  title: string,
  message: string,
  type: 'info' | 'warning' | 'error' | 'success',
  show: (title, message, type) => void,
  hide: () => void
}
```

**Usage Example**:
```javascript
import { useMessageBox } from '../../hooks';

function MyComponent() {
  const messageBox = useMessageBox();

  const handleError = () => {
    messageBox.show('Error', 'Something went wrong!', 'error');
  };

  return (
    <>
      <button onClick={handleError}>Trigger Error</button>

      {messageBox.isOpen && (
        <Modal
          title={messageBox.title}
          type={messageBox.type}
          onClose={messageBox.hide}
        >
          {messageBox.message}
        </Modal>
      )}
    </>
  );
}
```

---

## Utility Hooks

### useDebounce

Debounce a value to limit update frequency.

**Location**: `src/hooks/useDebounce.js`

**Purpose**: Prevent excessive function calls (e.g., search input).

**Signature**:
```javascript
useDebounce(value, delay)
```

**Parameters**:
```javascript
{
  value: any,      // Value to debounce
  delay: number    // Delay in milliseconds
}
```

**Returns**: Debounced value

**Usage Example**:
```javascript
import { useDebounce } from '../../hooks';
import { useState } from 'react';

function SearchBox() {
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  useEffect(() => {
    if (debouncedSearchTerm) {
      // Perform search with debounced term
      performSearch(debouncedSearchTerm);
    }
  }, [debouncedSearchTerm]);

  return (
    <input
      type="text"
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      placeholder="Search..."
    />
  );
}
```

---

### useGetSpecificLocationList

Get filtered location list based on user permissions.

**Location**: `src/hooks/useGetSpecificLocationList.js`

**Purpose**: Filter locations by user role.

**Signature**:
```javascript
useGetSpecificLocationList(systemType)
```

**Parameters**:
```javascript
{
  systemType: 'ess' | 'tgs' | 'tes' | 'all'
}
```

**Returns**: `Array<Location>` - Filtered location list

**Usage Example**:
```javascript
import { useGetSpecificLocationList } from '../../hooks';

function LocationSelector({ systemType }) {
  const locations = useGetSpecificLocationList(systemType);

  return (
    <select>
      {locations.map(loc => (
        <option key={loc.id} value={loc.id}>
          {loc.name}
        </option>
      ))}
    </select>
  );
}
```

---

## System-Specific Hooks

### useSetZoneOpeningsState

Manages zone opening states for ESS/TGS/TES systems.

**Location**: `src/hooks/ess_tgs_tes_hooks/useSetZoneOpeningsState.js`

**Purpose**: Track which zones are open/expanded.

**Usage Example**:
```javascript
import { useSetZoneOpeningsState } from '../../hooks';

function ZoneList({ zones }) {
  const { openZones, toggleZone, openAll, closeAll } =
    useSetZoneOpeningsState();

  return (
    <div>
      {zones.map(zone => (
        <ZoneCard
          key={zone.id}
          zone={zone}
          isOpen={openZones.includes(zone.id)}
          onToggle={() => toggleZone(zone.id)}
        />
      ))}
    </div>
  );
}
```

---

### useIntegratedSwitchNavigation

Navigation for integrated switch views.

**Location**: `src/hooks/useIntegratedSwitchNavigation.js`

**Purpose**: Handle navigation between switch views.

**Usage Example**:
```javascript
import { useIntegratedSwitchNavigation } from '../../hooks';

function IntegratedSwitchView() {
  const { currentView, navigateTo, goBack, canGoBack } =
    useIntegratedSwitchNavigation();

  return (
    <div>
      {canGoBack && <button onClick={goBack}>Back</button>}
      {currentView === 'list' && <SwitchList />}
      {currentView === 'detail' && <SwitchDetail />}
    </div>
  );
}
```

---

## Best Practices

### 1. Use Hooks at Component Top Level

```javascript
// ✅ Good
function Component() {
  const data = useSwitchData(location, machine, 'ess', isMobile, isF);
  // ... rest of component
}

// ❌ Bad - hooks in conditionals
function Component() {
  if (condition) {
    const data = useSwitchData(...); // Don't do this!
  }
}
```

### 2. Extract Complex Logic to Custom Hooks

```javascript
// ✅ Good
function useComplexLogic(params) {
  const [state, setState] = useState(null);
  useEffect(() => {
    // Complex logic here
  }, [params]);
  return state;
}

// ❌ Bad - complex logic in component
function Component() {
  const [state, setState] = useState(null);
  useEffect(() => {
    // 100 lines of complex logic
  }, []);
}
```

### 3. Memoize Hook Returns When Appropriate

```javascript
function useExpensiveHook(data) {
  return useMemo(() => {
    // Expensive calculation
    return processData(data);
  }, [data]);
}
```

### 4. Clean Up Effects

```javascript
function useSocket(eventName, callback) {
  useEffect(() => {
    const socket = connectSocket();
    socket.on(eventName, callback);

    // Cleanup function
    return () => {
      socket.off(eventName, callback);
      socket.disconnect();
    };
  }, [eventName, callback]);
}
```

### 5. Use Dependency Arrays Correctly

```javascript
// ✅ Good - all dependencies listed
useEffect(() => {
  fetchData(id, userId);
}, [id, userId]);

// ❌ Bad - missing dependencies
useEffect(() => {
  fetchData(id, userId);
}, []); // ESLint will warn!
```

### 6. Combine Related Hooks

```javascript
// ✅ Good
function useControlPanel(params) {
  const data = useSwitchData(...);
  const controls = useSwitchControls(...);
  const icons = useProgramIcons(...);

  return { data, controls, icons };
}

// Use in component
const { data, controls, icons } = useControlPanel(params);
```

### 7. Test Hooks Independently

```javascript
import { renderHook, act } from '@testing-library/react-hooks';
import { useSwitchData } from './useSwitchData';

test('useSwitchData returns correct data', () => {
  const { result } = renderHook(() =>
    useSwitchData('loc1', 'machine1', 'ess', false, false)
  );

  expect(result.current.systemType).toBe('ess');
  expect(result.current.deviceMac).toBeDefined();
});
```

## Hook Benefits

The custom hooks provide:

✅ **Code Reuse**: Share logic across components
✅ **Separation of Concerns**: Business logic separate from UI
✅ **Testability**: Test hooks independently
✅ **Maintainability**: Fix bugs in one place
✅ **Readability**: Cleaner, more focused components
✅ **Type Safety**: Consistent data structures

## Recent Improvements

Through recent refactoring:
- Created **8 shared hooks** for ESS/TGS/TES components
- Eliminated **~1,200 lines** of duplicated code
- Reduced component complexity by **40%**
- Improved test coverage potential
- Made it easier to add new systems

See `/docs/CODEBASE_IMPROVEMENTS_SUMMARY.md` for detailed metrics.

## Conclusion

Custom hooks are a powerful pattern for:
- Extracting reusable logic
- Reducing code duplication
- Improving component clarity
- Enabling better testing
- Simplifying maintenance

For more information:
- [React Hooks Documentation](https://react.dev/reference/react)
- [Architecture Guide](ARCHITECTURE.md)
- [Component Reference](COMPONENTS.md)
- [Shared Hooks Guide](SHARED_HOOKS_GUIDE.md)
