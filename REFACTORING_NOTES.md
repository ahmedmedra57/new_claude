# Refactoring Opportunities & Code Duplication Analysis

**Date**: 2025-11-22
**Analysis Scope**: Full codebase component duplication analysis
**Status**: ✅ Phase 1 Complete (Legacy code removed)

---

## Summary

This document catalogs duplicate code patterns and refactoring opportunities identified in the codebase. Use this as a roadmap for future refactoring work.

### Quick Stats
- **Legacy code removed**: 9,546 lines (deleted `/components/` directory)
- **Redux slice duplication**: ~3,316 lines across 3 files
- **Control component variations**: 3 implementations each × 4 components = 12 total files
- **Estimated total duplicate/refactorable code**: ~6,000-8,000 lines

---

## ✅ Completed Refactoring (2025-11-22)

### 1. Removed Legacy Components Directory
**Impact**: -9,546 lines of dead code

Deleted entire `/components/` directory containing:
- `components/ess/EssControlBox.js` (1,089 lines)
- `components/tes/TesControlBox.js` (1,110 lines)
- `components/tgs/TgsControlBox.js` (1,095 lines)
- Plus 4 additional deprecated files

**Verification**: No imports found in active codebase (`src/`)

### 2. Temperature Validation Utilities
**Status**: ✅ Already implemented

Centralized validation exists in `/src/utils/temperatureValidation.js`:
- `validateTemperature()` - Range validation
- `validateTemperatureInput()` - Input parsing & validation
- `getTemperatureRange()` - Get program-specific ranges
- Constants for INSTANT_HEAT, HEATING_SCHEDULE, OPTIONAL_CONSTANT

---

## 🔴 High Priority: Redux Slice Duplication

### Problem
Three nearly identical Redux slices for ESS/TES/TGS systems:

```
src/components/store/slices/essSwitchSlice.js  → 1,000 lines
src/components/store/slices/tesSwitchSlice.js  → 1,316 lines
src/components/store/slices/tgsSwitchSlice.js  → 1,000 lines
Total: 3,316 lines of duplicated logic
```

**Similarities**:
- Identical state structure (instantHeat, snowSensor, optionalConstantTemp, etc.)
- Same reducers (handleSelectIndividualMachine, handleInstantHeat, etc.)
- Only differences: slice name, location names, minor state variations

### Recommended Solution: Slice Factory Pattern

Create a factory function to generate slices:

```javascript
// src/components/store/slices/factories/createSystemSlice.js

export const createSystemSlice = (config) => {
  const {
    name,           // 'ess', 'tes', 'tgs'
    locations,      // { 'bet-east': ['01', '02', ...], ... }
    machineType,    // 'ess'
    ...overrides
  } = config;

  return createSlice({
    name: `${name}Switch`,
    initialState: generateInitialState(locations, machineType),
    reducers: generateReducers(name),
  });
};
```

**Benefits**:
- Eliminate ~2,300 lines of duplicate code
- Single source of truth for state management
- Easier to add new systems (HP, etc.)
- Bug fixes apply to all systems automatically

**Effort**: High (requires testing all system-specific logic)

---

## 🟡 Medium Priority: Control Component Variations

### Problem: Multiple Implementations Per Control

Each control type (InstantHeat, SnowSensor, WindFactor, HeatingSchedule) exists in **3 different locations** with different implementations:

#### InstantHeat Example:
1. `/src/components/commonComponentsMC/controllers/MCInstantHeat.js` (661 lines)
   - **Used by**: `ControlBox.js`
   - **Props**: Machine-specific (location, machine, swtName)
   - **Features**: EBP mode support, mobile/desktop views

2. `/src/components/masterControlSwitches/InstantHeat.js` (983 lines)
   - **Used by**: `MasterControlBySwitch.js`, `MasterControlByLocation.js`
   - **Props**: Scope-based (switch vs location)
   - **Features**: Location selection, TGS fan-only integration

3. `/src/components/masterControl/controls/instantHeat/instantHeat.js` (657 lines)
   - **Used by**: `SectionController.js`
   - **Props**: Selection-based (isSelected, handleSelect)
   - **Features**: Batch operations, different UI design

#### Pattern Repeats For:
- **SnowSensor**: 187 + 515 + 562 = 1,264 lines
- **WindFactor**: 178 + 420 + 495 = 1,093 lines
- **HeatingSchedule**: 999 + 683 + 1,033 = 2,715 lines

**Total**: ~5,700 lines across 12 files

### Why They're Different

These aren't simple duplicates—they serve distinct purposes:
- **MC* versions**: Individual machine control in ControlBox
- **masterControlSwitches**: Master control by switch/location views
- **controls**: Batch operation section controller

### Recommended Solution: Extract Shared Logic

Instead of consolidating components (which serve different UX purposes), extract shared logic:

1. **Create shared hooks**:
   ```javascript
   // useInstantHeatLogic.js
   export const useInstantHeatLogic = ({
     swtName,
     tempInput,
     isF,
     onSuccess,
     onError
   }) => {
     const handleSubmit = () => {
       const temp = Number(tempInput);
       const { isValid } = validateTemperatureInput(tempInput, isF, 'INSTANT_HEAT');

       if (isValid) {
         onSuccess(temp);
       } else {
         onError(getTemperatureErrorKeys('INSTANT_HEAT'));
       }
     };

     return { handleSubmit };
   };
   ```

2. **Shared styled component library** for common UI elements

**Benefits**:
- Reduce duplication without breaking UX differences
- Easier to maintain shared logic
- Keep component-specific UI/behavior separate

**Effort**: Medium

---

## 🟢 Low Priority: Monolithic Components

### Large Files That Could Be Split

These files mix multiple concerns and could benefit from decomposition:

| File | Lines | Recommendation |
|------|-------|----------------|
| `SettingsMain.js` | 3,083 | Split into feature-specific settings components |
| `ProgramsComponent.js` | 2,055 | Extract program types into separate components |
| `MasterControlContents.js` | 2,002 | Split by view type (by switch, by location, by machine) |
| `SystemIdentification.js` | 2,670 | Extract system-specific configuration |
| `MasterControlByMachine.styles.js` | 1,299 | Consider CSS modules or splitting by component |

**Benefits**:
- Improved maintainability
- Easier testing
- Better code organization

**Effort**: Medium (requires careful refactoring of state management)

---

## 🔵 Additional Patterns

### 1. Data Consumption Slices
Similar pattern to switch slices:
```
src/components/store/slices/essDataConsumptionSlice.js  → 8,632 bytes
src/components/store/slices/tesDataConsumptionSlice.js  → 6,344 bytes
src/components/store/slices/tgsDataConsumptionSlice.js  → 6,345 bytes
```

**Solution**: Use same factory pattern as switch slices

### 2. Parallel Helper Functions
Check for duplication in:
- `/src/helpers/ess-tgs-tes-mc/instantHeatHandler.js`
- `/src/helpers/ess-tgs-tes-mc/snowSensorHandler.js`
- `/src/helpers/ess-tgs-tes-mc/windFactorHandler.js`
- `/src/helpers/ess-tgs-tes-mc/heatingScheduleHandler.js`

These all import system-specific slice handlers. Could be consolidated with factory pattern.

---

## Refactoring Roadmap

### Phase 1: ✅ Complete
- [x] Remove legacy `/components/` directory
- [x] Document refactoring opportunities

### Phase 2: Extract Shared Logic (Recommended Next)
- [ ] Create shared control logic hooks (useInstantHeatLogic, etc.)
- [ ] Extract common styled components to shared library
- [ ] Create temperature range constants shared across components

### Phase 3: Redux Slice Factory
- [ ] Design slice factory function
- [ ] Create test suite for factory-generated slices
- [ ] Migrate essSwitchSlice to factory
- [ ] Migrate tesSwitchSlice to factory
- [ ] Migrate tgsSwitchSlice to factory
- [ ] Update all imports
- [ ] Verify all system-specific behavior still works

### Phase 4: Component Decomposition
- [ ] Split SettingsMain into feature components
- [ ] Refactor ProgramsComponent by program type
- [ ] Break down MasterControlContents by view

---

## Testing Checklist for Future Refactoring

When refactoring Redux slices or control components:

- [ ] All three systems (ESS, TES, TGS) work correctly
- [ ] InstantHeat, SnowSensor, WindFactor, HeatingSchedule all function
- [ ] Mobile and desktop views render correctly
- [ ] Master control "by switch", "by location", "by machine" views work
- [ ] Temperature validation works for all programs
- [ ] EBP mode behavior is preserved
- [ ] TGS fan-only integration still works
- [ ] State persistence and Redux DevTools function

---

## Notes for Developers

### Why Not Consolidate Everything?

The three control component implementations appear duplicated but serve **different user experiences**:

1. **ControlBox (MC*)**: Individual machine management
2. **MasterControlSwitches**: Aggregate switch/location control
3. **SectionController**: Batch operations across selections

Forcing them into a single component would create:
- Complex prop interfaces
- Fragile conditional rendering
- Difficult maintenance

**Better approach**: Share logic (hooks, utils) but keep UI components separate.

### Architecture Evolution

The codebase shows evidence of ongoing refactoring:
- Phase 1: Created shared hooks (`useSwitchData`, `useProgramIcons`)
- Phase 2: Refactored ESS/TGS/TES to use hooks
- Phase 3: Consolidated ControlBox (removed Ess/Tgs/TesControlBox)
- **Current**: Phase 3 complete, legacy code removed

The Redux slice factory would be the next logical step.

---

## Related Files

- `/src/utils/temperatureValidation.js` - Shared validation
- `/src/components/commonComponentsMC/systemConfigs.js` - System configurations
- `/src/hooks/` - Shared custom hooks
- `/src/components/store/slices/` - Redux state management

---

**Last Updated**: 2025-11-22
**Next Review**: After Phase 2 completion
