# ControlBox Components Refactor Plan

## Current State Analysis

### Files and Line Counts
- **EssControlBox.js**: 1,126 lines
- **TgsControlBox.js**: 1,189 lines
- **TesControlBox.js**: 1,225 lines
- **Total**: 3,540 lines

### Duplication Patterns Identified

#### 1. Temperature State Management (~20 lines per component × 3 = 60 lines)
```javascript
const [instantHeatTemp, setInstantHeatTemp] = useState('');
const [constantTemp, setConstantTemp] = useState(''); // ESS/TES only
const [schedulerTemp, setSchedulerTemp] = useState('');
const [snowSensorTemp, setSnowSensorTemp] = useState('');
```

#### 2. Message State Management (~15 lines per component × 3 = 45 lines)
```javascript
const [openMessageBox, setOpenMessageBox] = useState(false);
const [message, setMessage] = useState([]);
const [programName, setProgramName] = useState(null);
const [messageTitle, setMessageTitle] = useState(''); // TGS only
```

#### 3. Activation State Calculations (~25 lines per component × 3 = 75 lines)
```javascript
const heatingScheduleActivated = useMemo(() => {
  return switchStatus.heatingSchedule.isActivated && switchStatus.op_mode === "SCHEDULE";
}, [switchStatus]);

const snowSensorActivated = useMemo(() => {
  return switchStatus.snowSensor.isActivated && switchStatus.op_mode === "SNOW";
}, [switchStatus]);

const instantHeatActivated = useMemo(() => {
  return switchStatus.instantHeat.isActivated && switchStatus.op_mode === "SWITCH";
}, [switchStatus]);

const windFactorActivated = useMemo(() => {
  return switchStatus.windFactor.isActivated && switchStatus.op_mode === "WIND";
}, [switchStatus]);
```

#### 4. Temperature Sync useEffects (~80 lines per component × 3 = 240 lines)
```javascript
useEffect(() => {
  if (instantHeat.inputTemp > 0) {
    setInstantHeatTemp(`${instantHeat.inputTemp} ${unit}`);
  } else {
    setInstantHeatTemp('');
  }
}, [instantHeat]);

useEffect(() => {
  if (heatingScheduleList[0].inputTemp > 0) {
    setSchedulerTemp(`${heatingScheduleList[0].inputTemp} ${unit}`);
    dispatch(handleReadyHeatingSchedule({ location, machine, state: true }));
  } else {
    setSchedulerTemp('');
    dispatch(handleReadyHeatingSchedule({ location, machine, state: false }));
  }
}, [heatingScheduleList]);

// Similar for snowSensor, constantTemp, etc.
```

#### 5. Handler Functions (~200+ lines per component × 3 = 600+ lines)
```javascript
const integratedButtonHandler = (id, state, temp, data, index) => {
  switch (id) {
    case 'instantHeat':
      instantHeatHandler(state, temp);
      break;
    case 'snowSensor':
      snowSensorHandler(state);
      break;
    case 'constantTemp':
      constantTempHandler(state, temp);
      break;
    case 'windFactor':
      windFactorHandler(state);
      break;
    case 'heatingSchedule':
      heatingScheduleHandler(state, temp, data, index);
      break;
  }
};

const instantHeatHandler = (state, temp) => { /* 40-60 lines */ };
const snowSensorHandler = (state) => { /* 20-30 lines */ };
const constantTempHandler = (state, temp) => { /* 40-60 lines */ };
const windFactorHandler = (state) => { /* 20-30 lines */ };
const heatingScheduleHandler = (state, temp, data, index) => { /* 80-120 lines */ };
const fanOnlyHandler = (state) => { /* 20-30 lines */ }; // TGS only
```

### Total Duplication Estimate
- Temperature State: ~60 lines
- Message State: ~45 lines
- Activation States: ~75 lines
- Temperature Sync: ~240 lines
- Handler Functions: ~600 lines
- **Total Duplicated Logic**: ~1,020 lines across 3 components

## Refactoring Strategy

### Phase 1: Extend System Configurations
Update `systemConfigs.js` to include ControlBox-specific actions and configurations.

### Phase 2: Create Shared Hooks

#### Hook 1: `useControlBoxState`
Manages all temperature and message state for ControlBox components.

**Returns:**
```javascript
{
  // Temperature states
  instantHeatTemp, setInstantHeatTemp,
  constantTemp, setConstantTemp,
  schedulerTemp, setSchedulerTemp,
  snowSensorTemp, setSnowSensorTemp,

  // Message states
  openMessageBox,
  message,
  programName,
  messageTitle,

  // Helper functions
  closeMessageBox,
  showMessage,
}
```

**Replaces:** ~105 lines per component (315 lines total)

#### Hook 2: `useActivationStates`
Calculates activation states for all programs.

**Returns:**
```javascript
{
  heatingScheduleActivated,
  snowSensorActivated,
  instantHeatActivated,
  windFactorActivated,
  constantTempActivated,
  fanOnlyActivated,
}
```

**Replaces:** ~25 lines per component (75 lines total)

#### Hook 3: `useControlBoxHandlers`
Handles all program control logic (instant heat, snow sensor, schedule, etc.).

**Returns:**
```javascript
{
  integratedButtonHandler,
  instantHeatHandler,
  snowSensorHandler,
  constantTempHandler,
  windFactorHandler,
  heatingScheduleHandler,
  fanOnlyHandler,
}
```

**Replaces:** ~200-300 lines per component (600-900 lines total)

### Phase 3: Refactor Components
Apply shared hooks to each component in order:
1. EssControlBox
2. TgsControlBox
3. TesControlBox

### Expected Results

| Component | Before | After | Savings |
|-----------|--------|-------|---------|
| EssControlBox | 1,126 | ~800 | ~326 lines |
| TgsControlBox | 1,189 | ~850 | ~339 lines |
| TesControlBox | 1,225 | ~850 | ~375 lines |
| **Total** | **3,540** | **~2,500** | **~1,040 lines (-29.4%)** |

**Conservative Estimate:** ~1,000 lines saved
**Optimistic Estimate:** ~1,200 lines saved

## System-Specific Differences to Handle

### ESS
- Has `optionalConstantTemp` program
- No `fanOnly` program
- No conflict detection

### TGS
- Has `fanOnly` program
- Has conflict detection (`displayConflictMessage`, `devicesConflicts`)
- Has `isFanDisabled` flag
- No `optionalConstantTemp` program

### TES
- Has `optionalConstantTemp` program
- No `fanOnly` program
- Uses TES-specific blower commands
- No conflict detection

## Implementation Steps

1. ✅ Analyze duplication patterns (DONE)
2. Extend `systemConfigs.js` with ControlBox configurations
3. Create `useControlBoxState.js` hook
4. Create `useActivationStates.js` hook
5. Create `useControlBoxHandlers.js` hook
6. Export new hooks in `hooks/index.js`
7. Refactor EssControlBox component
8. Test ESS ControlBox functionality
9. Refactor TgsControlBox component
10. Test TGS ControlBox functionality
11. Refactor TesControlBox component
12. Test TES ControlBox functionality
13. Document changes
14. Commit and push

## Benefits

✅ **Reduce Duplication** - ~1,000 lines of duplicated logic eliminated
✅ **Improve Maintainability** - Bug fixes in one place apply to all three systems
✅ **Enhance Testability** - Hooks can be unit tested independently
✅ **Better Organization** - Clear separation of concerns
✅ **Consistent Behavior** - All three systems behave identically
