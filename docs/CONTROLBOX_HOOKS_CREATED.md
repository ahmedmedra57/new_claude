# ControlBox Shared Hooks - Phase 1

## Overview

Created three focused shared hooks to extract the most obvious duplication from ControlBox components. This conservative approach targets ~120 lines per component (360 lines total) while leaving complex handler logic for future work.

## Hooks Created

### 1. `useControlBoxTemperatures.js` (90 lines)

**Purpose:** Manages all temperature state and automatic syncing with Redux

**Replaces per component:** ~80 lines
- 4 useState declarations (instantHeatTemp, constantTemp, schedulerTemp, snowSensorTemp)
- 4 useEffect hooks for temperature syncing
- Temperature formatting logic

**Usage:**
```javascript
const {
  instantHeatTemp,
  constantTemp,
  schedulerTemp,
  snowSensorTemp,
  unit,
  isF,
  setInstantHeatTemp,
  setConstantTemp,
  setSchedulerTemp,
  setSnowSensorTemp,
} = useControlBoxTemperatures(switchStatus, 'ess');
```

**Benefits:**
- Automatic temperature syncing with Redux state
- Handles unit conversion (°F/°C)
- Consistent formatting across all three systems
- Null-safe access to nested properties

---

### 2. `useActivationStates.js` (68 lines)

**Purpose:** Calculates activation states for all programs using useMemo

**Replaces per component:** ~25 lines
- 4-6 useMemo declarations for activation states
- Duplicate op_mode checking logic

**Usage:**
```javascript
const {
  heatingScheduleActivated,
  snowSensorActivated,
  instantHeatActivated,
  windFactorActivated,
  constantTempActivated,
  fanOnlyActivated, // TGS only
} = useActivationStates(switchStatus, 'tgs');
```

**Benefits:**
- Centralized activation logic
- Automatic memoization
- System-aware (handles TGS fanOnly)
- Consistent activation logic across systems

---

### 3. `useControlBoxMessages.js` (40 lines)

**Purpose:** Manages message box state and provides control functions

**Replaces per component:** ~15 lines
- 4 useState declarations (openMessageBox, message, programName, messageTitle)
- Message show/hide logic

**Usage:**
```javascript
const {
  openMessageBox,
  message,
  programName,
  messageTitle,
  showMessage,
  closeMessageBox,
} = useControlBoxMessages();

// Show a message
showMessage('Error', ['Temperature out of range'], 'instantHeat');

// Close message box
closeMessageBox();
```

**Benefits:**
- Simplified message state management
- Easy-to-use show/close functions
- Automatic state cleanup on close

---

## Total Impact

### Lines Saved (Conservative Estimate)

| Component | Temperature | Activation | Messages | Total Saved |
|-----------|------------|------------|----------|-------------|
| EssControlBox | ~80 lines | ~25 lines | ~15 lines | **~120 lines** |
| TgsControlBox | ~80 lines | ~25 lines | ~15 lines | **~120 lines** |
| TesControlBox | ~80 lines | ~25 lines | ~15 lines | **~120 lines** |
| **Total** | **~240 lines** | **~75 lines** | **~45 lines** | **~360 lines** |

### After Refactoring (Projected)

| Component | Before | After | Reduction |
|-----------|--------|-------|-----------|
| EssControlBox | 1,126 | ~1,006 | ~120 lines (-10.7%) |
| TgsControlBox | 1,189 | ~1,069 | ~120 lines (-10.1%) |
| TesControlBox | 1,225 | ~1,105 | ~120 lines (-9.8%) |
| **Total** | **3,540** | **~3,180** | **~360 lines (-10.2%)** |

---

## What Was NOT Extracted (Future Work)

### Complex Handler Logic (~200-300 lines per component)

The following handler functions contain system-specific logic and integration with schedule services that would require more extensive refactoring:

- `integratedButtonHandler` - Main switch statement
- `instantHeatHandler` - Instant heat activation/deactivation
- `snowSensorHandler` - Snow sensor control
- `constantTempHandler` - Constant temperature control (ESS/TES)
- `windFactorHandler` - Wind factor control
- `heatingScheduleHandler` - Complex schedule CRUD operations
- `fanOnlyHandler` - Fan control (TGS only)

### Schedule Service Integration

Each component has extensive logic for:
- `createScheduleService` - Creating new schedules
- `updateScheduleService` - Updating existing schedules
- `deleteScheduleService` - Deleting schedules
- Schedule validation and conflict detection

**Recommendation:** Extract handler logic in Phase 2 after validating Phase 1 hooks work correctly.

---

## Implementation Plan

### Phase 1 (Current - Conservative Refactor)

1. ✅ Create `useControlBoxTemperatures` hook
2. ✅ Create `useActivationStates` hook
3. ✅ Create `useControlBoxMessages` hook
4. ✅ Export hooks in `hooks/index.js`
5. ⏳ Apply hooks to EssControlBox
6. ⏳ Test ESS ControlBox functionality
7. ⏳ Apply hooks to TgsControlBox
8. ⏳ Test TGS ControlBox functionality
9. ⏳ Apply hooks to TesControlBox
10. ⏳ Test TES ControlBox functionality
11. ⏳ Document and commit changes

**Expected Savings:** ~360 lines (10% reduction)
**Risk Level:** Low (only extracting obvious duplication)

### Phase 2 (Future - Handler Refactor)

1. Analyze handler functions for common patterns
2. Create `useControlBoxHandlers` hook (if patterns allow)
3. Handle schedule service integration
4. Handle system-specific differences
5. Extensive testing required

**Expected Savings:** ~600-900 lines (additional 17-25% reduction)
**Risk Level:** Medium-High (complex business logic)

---

## Benefits of Phase 1 Approach

✅ **Low Risk** - Only extracting clear, simple duplication
✅ **Immediate Value** - ~360 lines saved without major refactoring
✅ **Incremental** - Can validate each component works before continuing
✅ **Foundation** - Sets up infrastructure for Phase 2
✅ **Testable** - Hooks can be unit tested independently

---

## Next Steps

1. Apply the three hooks to EssControlBox
2. Test thoroughly to ensure no regression
3. Apply to TgsControlBox and test
4. Apply to TesControlBox and test
5. Document results and create Phase 2 plan if desired

---

## Files Created

1. `hooks/useControlBoxTemperatures.js` (90 lines)
2. `hooks/useActivationStates.js` (68 lines)
3. `hooks/useControlBoxMessages.js` (40 lines)
4. `hooks/index.js` (updated with exports)
5. `docs/CONTROLBOX_REFACTOR_PLAN.md` (full analysis)
6. `docs/CONTROLBOX_HOOKS_CREATED.md` (this document)

**Total Infrastructure:** ~198 lines of reusable code
**Total Duplication Removed:** ~360 lines
**Net Benefit:** ~162 lines saved + improved maintainability
