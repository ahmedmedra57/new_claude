# Shared Hooks Guide for ESS/TGS/TES Components

This guide explains the new shared custom hooks created to reduce code duplication across ESS, TGS, and TES MasterControlByMachine components.

## Overview

Previously, the three components (EssMasterControlByMachine, TgsMasterControlByMachine, TesMasterControlByMachine) had ~6,900 lines of duplicated code. These shared hooks extract common logic to improve maintainability and reduce duplication.

## System Configurations

### `systemConfigs.js`

Centralizes all system-specific settings in one place:

```javascript
import { systemConfigs, getEnergyUnit, programIcons } from '../commonComponentsMC/systemConfigs';

// Access ESS configuration
const essConfig = systemConfigs.ess;
const tgsConfig = systemConfigs.tgs;
const tesConfig = systemConfigs.tes;

// Get energy unit
const unit = getEnergyUnit('tgs', true); // Returns 'FT³'
const unit2 = getEnergyUnit('ess', false); // Returns 'kw'

// Access program icons
const icon = programIcons.instantHeat; // '/images/logo-instantHeat.svg'
```

**Configuration includes:**
- Redux selectors and actions
- Service functions (freeze, post command)
- Control Box components
- System-specific settings (energy unit, source, features)
- Display formatters

---

## Custom Hooks

### 1. `useProgramIcons`

Manages program icon states (selected, activated, ready).

**Usage:**
```javascript
import { useProgramIcons } from '../../hooks';

const { selectedProgramSrc, activatedProgramSrc, readyProgramSrc } = useProgramIcons(
  switchData,
  mobileSelectedProgram,
  'ess' // or 'tgs' or 'tes'
);
```

**Returns:**
- `selectedProgramSrc` - Mobile selected program icon
- `activatedProgramSrc` - Currently active program icon
- `readyProgramSrc` - Ready program icon

**Replaces:**
- 3 `useEffect` hooks (~60 lines each = 180 lines total)
- Duplicated icon logic across all three components

---

### 2. `useSwitchData`

Retrieves and processes switch data for a specific machine.

**Usage:**
```javascript
import { useSwitchData } from '../../hooks';

const {
  switchData,
  deviceMac,
  isFaults,
  isOff,
  headerTitle,
  energyConsumption,
  energyUnit,
  freezeByName,
  // ... many more fields
} = useSwitchData(
  location,
  machine,
  'ess', // or 'tgs' or 'tes'
  isMobile,
  isF
);
```

**Returns:** ~40+ computed and raw data fields including:
- All switch data fields
- Computed values (headerTitle, energyConsumption, swtSize, etc.)
- Location and user information
- Program states

**Replaces:**
- Redux selectors
- Data extraction logic
- Computed value calculations
- ~100 lines of duplicated code per component

---

### 3. `useSwitchControls`

Handles all switch control actions (freeze, snow sensor, instant heat, fan only).

**Usage:**
```javascript
import { useSwitchControls } from '../../hooks';

const {
  handleShutOff,
  handleSnowSensor,
  handleFanOnly,
  handleInstantHeat,
  handleMachineDetailToggle,
  handleButtonClick,
  openMessageBox,
  messageTitle,
  message,
  closeMessageBox,
} = useSwitchControls(
  'ess', // or 'tgs' or 'tes'
  location,
  machine,
  deviceMac,
  userId,
  isF
);

// Use in your component
<button onClick={() => handleShutOff(isOff)}>Toggle</button>
<button onClick={() => handleSnowSensor(isReady)}>Snow Sensor</button>
<button onClick={() => handleInstantHeat(inputTemp, isActivated, isReady, title)}>
  Instant Heat
</button>
```

**Replaces:**
- handleButtonClick switch statement (~150 lines)
- Individual handler functions
- Message state management
- Service API calls

---

### 4. `useHeaderHat`

Determines the correct header hat image based on state and title length.

**Usage:**
```javascript
import { useHeaderHat } from '../../hooks';

const hatImg = useHeaderHat(isOff, isFaults, headerTitle, isMobile);

// Use in JSX
<HeaderHat imgSrc={hatImg}>...</HeaderHat>
```

**Replaces:**
- Complex ternary logic (~40 lines)
- Image path selection logic

---

## Migration Example

### Before (ESS Component - ~2,281 lines):
```javascript
const EssMasterControlByMachine = ({ location, machine, isMobile }) => {
  // Redux selectors (15 lines)
  const { essSwitch, flatEssSwitch } = useSelector(selectEssSwitch);
  const locations = useSelector(selectLocations);
  const switchData = flatEssSwitch[location][machine];
  // ... extract 40+ fields

  // Computed values (20 lines)
  const swtSize = extractSwtSize(heatingSystem);
  const headerTitle = isMobile ? `${machineName} #${swtSize}-ess` : ...;
  const energyConsumption = useMemo(() => calculateTotalEnergyConsumption(...), []);
  // ... more computed values

  // Program icons state (180 lines of useEffects)
  const [selectedProgramSrc, setSelectedProgramSrc] = useState(null);
  useEffect(() => {
    if (mobileSelectedProgram.instantHeat) {
      setSelectedProgramSrc('/images/logo-instantHeat.svg');
    } else if ...
  }, [mobileSelectedProgram]);
  // ... 2 more similar useEffects

  // Button handlers (150 lines)
  const handleButtonClick = (btnName) => {
    switch (btnName) {
      case 'shutOff': {
        freezeSwitchDeviceService(!isOff, deviceMac, user_id)
          .then(() => dispatch(handleShutOff({ location, machine })));
        break;
      }
      // ... more cases
    }
  };

  // Header hat logic (40 lines)
  const hatImg = isOff
    ? headerTitle.length < 28
      ? '/images/MC-machine-header1-off.svg'
      : headerTitle.length < 46
      ? '/images/MC-machine-header-mediumSize-off.svg'
      : ...
    : ...;

  return (/* 1800 lines of JSX */);
};
```

### After (Using Shared Hooks - ~300 lines saved):
```javascript
const EssMasterControlByMachine = ({ location, machine, isMobile }) => {
  const { isF } = useSelector(selectUnits);
  const permissions = useSelector(selectUserPermissions);

  // One hook replaces 100+ lines
  const switchDataHook = useSwitchData(location, machine, 'ess', isMobile, isF);
  const { deviceMac, isFaults, isOff, headerTitle, energyConsumption, ... } = switchDataHook;

  // One hook replaces 180 lines
  const { selectedProgramSrc, activatedProgramSrc, readyProgramSrc } = useProgramIcons(
    switchDataHook.switchData,
    switchDataHook.mobileSelectedProgram,
    'ess'
  );

  // One hook replaces 150+ lines
  const controls = useSwitchControls(
    'ess',
    location,
    machine,
    deviceMac,
    switchDataHook.userId,
    isF
  );

  // One hook replaces 40 lines
  const hatImg = useHeaderHat(isOff, isFaults, headerTitle, isMobile);

  return (/* 1800 lines of JSX - unchanged */);
};
```

---

## Benefits

✅ **Reduced Duplication:** ~400-500 lines saved per component (1,200-1,500 total)
✅ **Better Maintainability:** Fix bugs in one place, not three
✅ **Easier Testing:** Test hooks independently
✅ **Improved Reusability:** Use hooks in other components
✅ **Cleaner Code:** Components focus on UI, hooks handle logic
✅ **Type Safety:** Centralized configuration reduces errors

---

## Next Steps

### Phase 2: Refactor Components
1. Update EssMasterControlByMachine to use shared hooks
2. Update TgsMasterControlByMachine to use shared hooks
3. Update TesMasterControlByMachine to use shared hooks

### Phase 3: Extract More Shared Logic
- Extract shared styled components
- Create shared sub-components (header, controls, displays)
- Further reduce JSX duplication

---

## Questions?

If you need help using these hooks or have suggestions for improvements, please reach out to the development team.
