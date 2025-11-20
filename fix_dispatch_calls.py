#!/usr/bin/env python3
"""
Fix all broken dispatch() calls by mapping to Zustand stores

This script:
1. Identifies all dispatch() calls
2. Maps them to appropriate Zustand store methods
3. Replaces dispatch() calls with direct Zustand method calls
4. Adds necessary store imports
"""
import os
import re
from collections import defaultdict

# Map Redux action names to (ZustandStore, methodName) tuples
ACTION_TO_ZUSTAND = {
    # TES Switch actions
    'tesActivateConflictMessage': ('useTESSwitchStore', 'activateConflictMessage'),
    'tesDeactivateConflictMessage': ('useTESSwitchStore', 'deactivateConflictMessage'),
    'tesHandleSnowSensorOff': ('useTESSwitchStore', 'setSnowSensorOff'),
    'tesHandleWindFactorOff': ('useTESSwitchStore', 'setWindFactorOff'),
    'tesHandleUnselectAllProgram': ('useTESSwitchStore', 'unselectAllProgram'),
    'tesHandleInstantHeatReset': ('useTESSwitchStore', 'resetInstantHeat'),
    'tesHandleSnowSensorReset': ('useTESSwitchStore', 'resetSnowSensor'),
    'tesHandleWindFactorReset': ('useTESSwitchStore', 'resetWindFactor'),
    'tesHandleHeatingScheduleReset': ('useTESSwitchStore', 'resetHeatingSchedule'),
    'tesHandleOptionalConstantTempReset': ('useTESSwitchStore', 'resetOptionalConstantTemp'),

    # ESS Switch actions
    'essActivateConflictMessage': ('useESSSwitchStore', 'activateConflictMessage'),
    'essDeactivateConflictMessage': ('useESSSwitchStore', 'deactivateConflictMessage'),
    'handleSnowSensorOff': ('useESSSwitchStore', 'setSnowSensorOff'),
    'handleWindFactorOff': ('useESSSwitchStore', 'setWindFactorOff'),
    'handleInstantHeatReset': ('useESSSwitchStore', 'resetInstantHeat'),
    'handleSnowSensorReset': ('useESSSwitchStore', 'resetSnowSensor'),
    'handleWindFactorReset': ('useESSSwitchStore', 'resetWindFactor'),
    'handleHeatingScheduleReset': ('useESSSwitchStore', 'resetHeatingSchedule'),
    'handleOptionalConstantTempReset': ('useESSSwitchStore', 'resetOptionalConstantTemp'),
    'handleInstantHeatOff': ('useESSSwitchStore', 'setInstantHeatOff'),
    'handleOptionalConstantTempOff': ('useESSSwitchStore', 'setMachineOptionalConstantTempOff'),
    'handleClearHeatingSchedule': ('useESSSwitchStore', 'clearHeatingSchedule'),
    'handleEssInitialState': ('useESSSwitchStore', 'resetMachinesState'),
    'handleOpenMachineController': ('useESSSwitchStore', 'setOpenMachineController'),
    'essSpecificLocationUnselectMachinesHandler': ('useESSSwitchStore', 'essSpecificLocationUnselectMachine'),

    # TGS Switch actions
    'tgsActivateConflictMessage': ('useTGSSwitchStore', 'activateConflictMessage'),
    'tgsDeactivateConflictMessage': ('useTGSSwitchStore', 'deactivateConflictMessage'),
    'tgsHandleSnowSensorOff': ('useTGSSwitchStore', 'setSnowSensorOff'),
    'tgsHandleWindFactorOff': ('useTGSSwitchStore', 'setWindFactorOff'),
    'tgsHandleInstantHeatReset': ('useTGSSwitchStore', 'resetInstantHeat'),
    'tgsHandleSnowSensorReset': ('useTGSSwitchStore', 'resetSnowSensor'),
    'tgsHandleWindFactorReset': ('useTGSSwitchStore', 'resetWindFactor'),
    'tgsHandleHeatingScheduleReset': ('useTGSSwitchStore', 'resetHeatingSchedule'),
    'tgsHandleInitialState': ('useTGSSwitchStore', 'resetMachinesState'),
    'tgsHandleOpenMachineController': ('useTGSSwitchStore', 'setOpenMachineController'),

    # Master Control actions
    'handleControllersStatus': ('useMCStore', 'setControllersStatus'),
    'handleSnowSensor': ('useMCStore', 'setSnowSensor'),
    'handleWindFactor': ('useMCStore', 'setWindFactor'),
    'handleInstantHeat': ('useMCStore', 'setInstantHeat'),
    'handleSelectEss': ('useMCStore', 'selectEss'),
    'handleSelectTgs': ('useMCStore', 'selectTgs'),
    'handleSelectTes': ('useMCStore', 'selectTes'),
    'handleSelectSystem': ('useMCStore', 'setSelectSystem'),
    'handleUnSelectSwitch': ('useMCStore', 'unselectSwitch'),

    # Master Control Select actions
    'handleDisplaySelectBox': ('useMasterControlSelectStore', 'toggleDisplaySelectBox'),
    'handleResetAllSelect': ('useMasterControlSelectStore', 'resetAllSelect'),
    'handleSelectAll': ('useMasterControlSelectStore', 'selectAll'),
    'handleLocationSelect': ('useMasterControlSelectStore', 'selectLocation'),
    'handleOpenSelectLocation': ('useMasterControlSelectStore', 'openSelectLocation'),

    # MC Command actions
    'handleCreateCommand': ('useMCCommandStore', 'createCommand'),
    'handleViewCommand': ('useMCCommandStore', 'setViewCommand'),
    'handleApplyCommand': ('useMCCommandStore', 'applyCommand'),
    'handleApplyMessageBox': ('useMCCommandStore', 'setApplyMessageBox'),
    'handleCommandNumber': ('useMCCommandStore', 'setCommandNumber'),
    'handleCommandDate': ('useMCCommandStore', 'setCommandDate'),

    # Machine selection actions
    'handleMachineSelect': ('useMasterControlSelectStore', 'selectMachine'),
    'handleUnSelectIndividualMachine': ('useMasterControlSelectStore', 'unselectMachine'),
    'handleSelectedOne': ('useMasterControlSelectStore', 'setSelectedOne'),
    'handleSelectAllBySwitch': ('useMasterControlBySwitchSelectStore', 'selectAll'),
    'handleSpecificLocationSelect': ('useMasterControlSelectStore', 'selectSpecificLocation'),

    # MC display/control actions
    'handleOpenMasterControl': ('useMCStore', 'setOpenMasterControl'),
    'handleSelectDisplaySystem': ('useMCStore', 'selectDisplaySystem'),
    'handleSelectAController': ('useMCStore', 'selectController'),
    'handleControlResetInit': ('useMCStore', 'resetControlInit'),
    'handleDeactivatePrograms': ('useMCStore', 'deactivatePrograms'),
    'handleDisplaySelectBoxWithAction': ('useMasterControlSelectStore', 'displaySelectBoxWithAction'),
    'handleShutOff': ('useMCStore', 'setShutOff'),

    # Settings actions
    'handleSelectingSettings': ('useSettingsOptionsStore', 'selectSetting'),
    'handleClickedButton': ('useEditCancelApplyButtonsStore', 'setButtonClicked'),
    'handleSettingsSelectAll': ('useSettingsOptionsStore', 'selectAll'),
    'handleSettingsLocationSelect': ('useSettingsOptionsStore', 'selectLocation'),
    'handlePasswordPropagation': ('useAdminStore', 'setPasswordPropagation'),

    # HP actions
    'hpEcHandleUnSelectIndividualMachine': ('useHPElectricSwitchStore', 'unselectIndividualMachine'),
    'hpGsHandleUnSelectIndividualMachine': ('useHPGasSwitchStore', 'unselectIndividualMachine'),

    # Temp handlers (these might need review)
    'fanOnlyHandlerTempo': ('useTGSSwitchStore', 'setFanOnly'),
    'constantHeatHandlerTempo': ('useESSSwitchStore', 'setConstantTemp'),
    'AddScheduleHandlerTempo': ('useESSSwitchStore', 'addHeatingSchedule'),

    # User actions
    'addUserInfo': ('useUserStore', 'setUserInfo'),
    'handleAccessToken': ('useUserStore', 'setAccessToken'),
    'handleAllUsers': ('useUserStore', 'setAllUsers'),
    'getUserProfileDataService': ('useUserStore', 'getUserProfile'),

    # Admin actions
    'handleAccessAdministrator': ('useAdminStore', 'setAccessAdministrator'),
    'resetAccessAdministrator': ('useAdminStore', 'resetAccessAdministrator'),

    # Location actions
    'handleOpenLocation': ('useLocationsStore', 'openLocation'),
    'handleOpenSpecificLocation': ('useLocationsStore', 'openSpecificLocation'),
    'handleAddLocations': ('useMasterControlSelectStore', 'addLocations'),
    'handleAddLocationsByLocation': ('useMasterControlSelectByLocationStore', 'addLocations'),
    'handleAddLocationsBySwitch': ('useMasterControlBySwitchSelectStore', 'addLocations'),
    'handleAddMachines': ('useMasterControlSelectStore', 'addMachines'),
    'handleAddMachinesByLocation': ('useMasterControlSelectByLocationStore', 'addMachines'),
    'handleAddMachinesBySwitch': ('useMasterControlBySwitchSelectStore', 'addMachines'),
    'handleAddSpecificLocations': ('useMasterControlSelectStore', 'addSpecificLocations'),
    'handleAddSpecificLocationsByLocation': ('useMasterControlSelectByLocationStore', 'addSpecificLocations'),
    'handleAddSpecificLocationsBySwitch': ('useMasterControlBySwitchSelectStore', 'addSpecificLocations'),
}

def extract_dispatch_calls(content):
    """Extract all dispatch() calls from content"""
    # Pattern 1: dispatch(actionName(args)) - properly formed
    pattern1 = r'dispatch\((\w+)\(([^)]*)\)\)'
    matches1 = re.findall(pattern1, content)

    # Pattern 2: dispatch(actionName({ args }); - malformed (missing closing paren)
    pattern2 = r'dispatch\((\w+)\((\{[^}]*\})\);'
    matches2 = re.findall(pattern2, content)

    # Pattern 3: dispatch(actionName(args); - malformed (missing closing paren)
    pattern3 = r'dispatch\((\w+)\(([^)]+)\);'
    matches3 = re.findall(pattern3, content)

    all_matches = matches1 + matches2 + matches3
    return [(action, args) for action, args in all_matches]

def get_import_path(filepath):
    """Get proper import path for zustand-stores"""
    if 'settings/admin' in filepath:
        return '../../../zustand-stores'
    elif 'settings/' in filepath:
        return '../../zustand-stores'
    elif 'reportStatus/' in filepath:
        return '../../zustand-stores'
    elif 'masterControl/M.C.Command' in filepath:
        return '../../zustand-stores'
    elif 'masterControl/controls' in filepath:
        return '../../zustand-stores'
    elif 'commonComponentsMC/controllers' in filepath:
        return '../../zustand-stores'
    elif 'telemetry/theSelections' in filepath:
        return '../../zustand-stores'
    return '../zustand-stores'

def migrate_file(filepath):
    """Migrate dispatch calls in a single file"""
    try:
        with open(filepath, 'r') as f:
            content = f.read()
    except:
        return False, []

    if 'dispatch(' not in content:
        return False, []

    original = content
    stores_needed = set()
    unmapped_actions = []

    # Extract all dispatch calls
    dispatch_calls = extract_dispatch_calls(content)

    for action, args in dispatch_calls:
        if action in ACTION_TO_ZUSTAND:
            store, method = ACTION_TO_ZUSTAND[action]
            stores_needed.add(store)

            # Replace both properly formed and malformed dispatch calls
            # Pattern 1: dispatch(action(args)) - properly formed
            old_pattern1 = rf'dispatch\({action}\({re.escape(args)}\)\)'
            new_replacement = f'{store}().{method}({args})'
            content = re.sub(old_pattern1, new_replacement, content)

            # Pattern 2: dispatch(action({ args }); - malformed (missing closing paren)
            old_pattern2 = rf'dispatch\({action}\({re.escape(args)}\);'
            new_replacement2 = f'{store}().{method}({args});'
            content = re.sub(old_pattern2, new_replacement2, content)
        else:
            unmapped_actions.append(action)

    # If no stores needed, file wasn't changed
    if not stores_needed:
        return False, unmapped_actions

    # Add Zustand imports
    import_path = get_import_path(filepath)
    stores_list = sorted(stores_needed)
    zustand_import = f"import {{ {', '.join(stores_list)} }} from '{import_path}';\n"

    # Check if import already exists
    for store in stores_list:
        if store not in content or f'from \'{import_path}\'' not in content:
            # Find first import and add our import
            lines = content.split('\n')
            insert_pos = 0
            for i, line in enumerate(lines):
                if line.strip().startswith('import '):
                    insert_pos = i + 1
                elif insert_pos > 0 and not line.strip().startswith('import ') and line.strip() != '':
                    break

            if insert_pos > 0 and zustand_import.strip() not in content:
                lines.insert(insert_pos, zustand_import.strip())
                content = '\n'.join(lines)
                break

    # Write if changed
    if content != original:
        try:
            with open(filepath, 'w') as f:
                f.write(content)
            return True, unmapped_actions
        except:
            return False, unmapped_actions

    return False, unmapped_actions

def main():
    components_dir = '/home/user/new_claude/components'
    migrated = []
    all_unmapped = defaultdict(int)

    for root, dirs, files in os.walk(components_dir):
        if 'store' in root or 'zustand-stores' in root:
            continue

        for file in files:
            if file.endswith('.js'):
                filepath = os.path.join(root, file)
                success, unmapped = migrate_file(filepath)
                if success:
                    migrated.append(filepath)
                    print(f"✓ {filepath}")

                for action in unmapped:
                    all_unmapped[action] += 1

    print(f"\n✅ Migrated {len(migrated)} files")

    if all_unmapped:
        print(f"\n⚠️ {len(all_unmapped)} unmapped actions found:")
        for action, count in sorted(all_unmapped.items(), key=lambda x: -x[1])[:20]:
            print(f"  - {action} ({count} occurrences)")

    # Count remaining dispatch calls
    remaining = 0
    for root, dirs, files in os.walk(components_dir):
        if 'store' in root or 'zustand-stores' in root:
            continue
        for file in files:
            if file.endswith('.js'):
                filepath = os.path.join(root, file)
                try:
                    with open(filepath, 'r') as f:
                        remaining += f.read().count('dispatch(')
                except:
                    pass

    print(f"\n📊 Remaining dispatch() calls: {remaining}")
    return len(migrated)

if __name__ == '__main__':
    count = main()
    exit(0)
