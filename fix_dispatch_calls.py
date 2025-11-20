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
    'hpEcSpecificLocationUnselectMachinesHandler': ('useHPElectricSwitchStore', 'hpEcSpecificLocationUnselectMachine'),
    'hpGcSpecificLocationUnselectMachinesHandler': ('useHPGasSwitchStore', 'hpGcSpecificLocationUnselectMachine'),

    # Temp handlers (these might need review)
    'fanOnlyHandlerTempo': ('useTGSSwitchStore', 'setFanOnly'),
    'constantHeatHandlerTempo': ('useESSSwitchStore', 'setConstantTemp'),
    'AddScheduleHandlerTempo': ('useESSSwitchStore', 'addHeatingSchedule'),
    'snowSensorHandlerTempo': ('useESSSwitchStore', 'setSnowSensor'),
    'windFactorHandlerTempo': ('useESSSwitchStore', 'setWindFactor'),
    'instantHeatHandlerTempo': ('useESSSwitchStore', 'setInstantHeat'),

    # Settings selection actions
    'handleSettingsMachineSelect': ('useSettingsOptionsStore', 'selectMachine'),
    'handleSettingsSelectedOne': ('useSettingsOptionsStore', 'setSelectedOne'),
    'handleSettingsAddLocations': ('useSettingsOptionsStore', 'addLocations'),
    'handleSettingsAddMachines': ('useSettingsOptionsStore', 'addMachines'),
    'handleSettingsAddSpecificLocations': ('useSettingsOptionsStore', 'addSpecificLocations'),

    # ATS selection actions
    'handleAtsSelection': ('useESSSwitchStore', 'setAtsSelection'),
    'handleSelectAts': ('useESSSwitchStore', 'setAtsSelection'),
    'tesHandleAtsSelection': ('useTESSwitchStore', 'setAtsSelection'),
    'tgsHandleAtsSelection': ('useTGSSwitchStore', 'setAtsSelection'),
    'handleCommandDate': ('useMCCommandStore', 'setCommandDate'),

    # TGS/TES specific actions
    'tgsHandleShutOff': ('useTGSSwitchStore', 'setShutOff'),
    'tesHandleShutOff': ('useTESSwitchStore', 'setShutOff'),
    'tgsSpecificLocationUnselectMachinesHandler': ('useTGSSwitchStore', 'tgsSpecificLocationUnselectMachine'),
    'tesSpecificLocationUnselectMachinesHandler': ('useTESSwitchStore', 'tesSpecificLocationUnselectMachine'),
    'tgsHandleUnSelectIndividualMachine': ('useTGSSwitchStore', 'unselectIndividualMachine'),
    'tesHandleUnSelectIndividualMachine': ('useTESSwitchStore', 'unselectIndividualMachine'),
    'tesHandleInstantHeat': ('useTESSwitchStore', 'setInstantHeat'),
    'tgsHandleInstantHeat': ('useTGSSwitchStore', 'setInstantHeat'),
    'tesHandleSnowSensor': ('useTESSwitchStore', 'setSnowSensor'),
    'tgsHandleSnowSensor': ('useTGSSwitchStore', 'setSnowSensor'),
    'tesHandleWindFactor': ('useTESSwitchStore', 'setWindFactor'),
    'tgsHandleWindFactor': ('useTGSSwitchStore', 'setWindFactor'),
    'tesHandleOptionalConstantTemp': ('useTESSwitchStore', 'setOptionalConstantTempReady'),
    'tesHandleAddHeatingSchedule': ('useTESSwitchStore', 'addHeatingSchedule'),
    'tesHandleReadyHeatingSchedule': ('useTESSwitchStore', 'setReadyHeatingSchedule'),
    'tgsHandleAddHeatingSchedule': ('useTGSSwitchStore', 'addHeatingSchedule'),
    'tgsHandleReadyHeatingSchedule': ('useTGSSwitchStore', 'setReadyHeatingSchedule'),
    'handleTesInitialState': ('useTESSwitchStore', 'resetMachinesState'),

    # Telemetry actions
    'handleTotalHoursTelemetry': ('useTelemetryStore', 'setTotalHours'),
    'handleTotalConsumptionTelemetry': ('useTelemetryStore', 'setTotalConsumption'),
    'handleEssGraphDate': ('useESSSwitchStore', 'setTesGraphDate'),
    'handleTgsGraphDate': ('useTGSSwitchStore', 'setTesGraphDate'),
    'handleTesGraphDate': ('useTESSwitchStore', 'setTesGraphDate'),

    # ESS heating and program actions
    'handleOptionalConstantTempReady': ('useESSSwitchStore', 'setOptionalConstantTempReady'),
    'handleAddHeatingSchedule': ('useESSSwitchStore', 'addHeatingSchedule'),
    'handleReadyHeatingSchedule': ('useESSSwitchStore', 'setReadyHeatingSchedule'),
    'handleSelectMobileProgram': ('useESSSwitchStore', 'selectMobileProgram'),
    'handleSelectIndividualMachine': ('useESSSwitchStore', 'selectIndividualMachine'),
    'handleAllDeactivatePrograms': ('useMCStore', 'deactivateAllPrograms'),
    'handleSetUnits': ('useUnitsStore', 'setUnits'),

    # By Switch/Location selection actions
    'handleLocationSelectBySwitch': ('useMasterControlBySwitchSelectStore', 'selectLocation'),
    'handleMachineSelectBySwitch': ('useMasterControlBySwitchSelectStore', 'selectMachine'),
    'handleLocationSelectByLocation': ('useMasterControlSelectByLocationStore', 'selectLocation'),
    'handleMachineSelectByLocation': ('useMasterControlSelectByLocationStore', 'selectMachine'),

    # Initial state handlers
    'handleTgsInitialState': ('useTGSSwitchStore', 'resetMachinesState'),
    'handleTesSpecificLocationInitialState': ('useTESSwitchStore', 'resetSpecificLocationState'),

    # Settings & Admin actions
    'handleUnitSelection': ('useSettingsOptionsStore', 'setUnitSelection'),
    'handleSwitchSize': ('useAdminStore', 'setSwitchSize'),
    'handleSSRRating': ('useAdminStore', 'setSSRRating'),
    'handleAddGasType': ('useAdminStore', 'addGasType'),

    # Other actions
    'handleAddElementToBank': ('useMCStore', 'addElementToBank'),
    'handleIsReadyToSelectProgram': ('useMCStore', 'setReadyToSelectProgram'),
    'handleSelectSwitch': ('useMCStore', 'selectSwitch'),
    'handleSelectProgram': ('useMCStore', 'selectProgram'),
    'handleAddNewElements': ('useMCStore', 'addNewElements'),
    'handleInstantHeatReady': ('useESSSwitchStore', 'setInstantHeatIsReady'),
    'handleSettingsDisplaySelectBox': ('useSettingsOptionsStore', 'toggleDisplaySelectBox'),
    'setInterfaceMode': ('useAppStore', 'setInterfaceMode'),
    'handleReportStatus': ('useReportStatusStore', 'setReportStatus'),
    'handleSearchTelemetrySystem': ('useTelemetryStore', 'setSearchSystem'),
    'handleSelectTelemetrySystem': ('useTelemetryStore', 'selectSystem'),
    'handleSearchCommand': ('useMCCommandStore', 'setSearchCommand'),
    'setTelemetryIntervalUnit': ('useTelemetryStore', 'setIntervalUnit'),
    'handleAuditLogData': ('useTelemetryStore', 'setAuditLogData'),
    'handleDisplaySystemDetails': ('useMCStore', 'setDisplaySystemDetails'),
    'handleDisplayForceMessageBox': ('useSettingsOptionsStore', 'setDisplayForceMessageBox'),

    # User actions
    'addUserInfo': ('useUserStore', 'setUserInfo'),
    'handleAccessToken': ('useUserStore', 'setAccessToken'),
    'handleAllUsers': ('useUserStore', 'setAllUsers'),
    'getUserProfileDataService': ('useUserStore', 'getUserProfile'),

    # Admin actions
    'handleAccessAdministrator': ('useAdminStore', 'setAccessAdministrator'),
    'resetAccessAdministrator': ('useAdminStore', 'resetAccessAdministrator'),
    'handleResetAccessAdministrator': ('useAdminStore', 'resetAccessAdministrator'),

    # Reset actions
    'handleResetAll': ('useMasterControlSelectStore', 'resetAll'),
    'handleResetAllSelect': ('useMasterControlSelectStore', 'resetAllSelect'),
    'handleSettingsResetAllSelect': ('useSettingsOptionsStore', 'resetAllSelect'),
    'handleResetButtons': ('useEditCancelApplyButtonsStore', 'resetButtons'),
    'handleResetSelectedOne': ('useMasterControlSelectStore', 'resetSelectedOne'),
    'handleResetMCOffState': ('useMCStore', 'resetMCOffState'),
    'handleResetMapSelection': ('useMasterControlSelectStore', 'resetMapSelection'),
    'handleResetCreateNewCommand': ('useMCCommandStore', 'resetCreateNewCommand'),
    'handleResetCommandNumber': ('useMCCommandStore', 'resetCommandNumber'),
    'setResetSettingsOptions': ('useSettingsOptionsStore', 'resetSettingsOptions'),

    # Unselect actions
    'handleUnselectAllProgram': ('useMCStore', 'unselectAllProgram'),
    'handleUnselectProgram': ('useMCStore', 'unselectProgram'),
    'handleUnselectAllSystem': ('useMCStore', 'unselectAllSystem'),
    'handleUnSelectSwitch': ('useMCStore', 'unselectSwitch'),

    # Calendar and scheduler
    'handleCloseCalendar': ('useMCStore', 'closeCalendar'),
    'handleClearScheduler': ('useMCStore', 'clearScheduler'),
    'handleCleanUpSelectedOne': ('useMasterControlSelectStore', 'cleanUpSelectedOne'),

    # Switch selection
    'handleSelectEss': ('useMCStore', 'selectEss'),
    'handleSelectTgs': ('useMCStore', 'selectTgs'),
    'handleSelectTes': ('useMCStore', 'selectTes'),
    'handleSelectHp': ('useMCStore', 'selectHp'),

    # SSR and TC actions
    'handleSelectTC': ('useESSSwitchStore', 'selectTC'),
    'handleExpandSSRDetail': ('useESSSwitchStore', 'expandSSRDetail'),

    # Temperature and sensor actions
    'handleSetWindTemp': ('useMCStore', 'setWindTemp'),
    'handleSnowSensorTemp': ('useESSSwitchStore', 'setSnowSensorTemp'),
    'handleMachineOptionalConstantTempOff': ('useESSSwitchStore', 'setMachineOptionalConstantTempOff'),
    'handleTrackTempControl': ('useMCStore', 'setTrackTempControl'),
    'toggleAtsHandlerTempo': ('useESSSwitchStore', 'toggleAts'),

    # System identification and settings
    'handleLocationsSystemIdentification': ('useAdminStore', 'setLocationsSystemIdentification'),
    'handleGasValuePosition': ('useAdminStore', 'setGasValuePosition'),
    'handleGasType': ('useAdminStore', 'setGasType'),
    'handleSettingsSpecificLocationSelect': ('useSettingsOptionsStore', 'selectSpecificLocation'),
    'handleSettingsMultipleDisplaySelectBox': ('useSettingsOptionsStore', 'toggleMultipleDisplaySelectBox'),
    'handleDisplayForceSelectionBox': ('useSettingsOptionsStore', 'toggleDisplayForceSelectionBox'),

    # Command and timer actions
    'handleCommandInfo': ('useMCCommandStore', 'setCommandInfo'),
    'handleTimer': ('useMCStore', 'setTimer'),
    'handleAttendButtonClick': ('useMCCommandStore', 'setAttendButtonClick'),

    # Selection actions
    'handleSelectedOneByLocation': ('useMasterControlSelectByLocationStore', 'setSelectedOne'),
    'handleSelectedOneBySwitch': ('useMasterControlBySwitchSelectStore', 'setSelectedOne'),
    'handleSelectAllByLocation': ('useMasterControlSelectByLocationStore', 'selectAll'),
    'handleSelector': ('useESSSwitchStore', 'setSelector'),
    'tesHandleSelector': ('useTESSwitchStore', 'setSelector'),

    # SSR and Toggle actions
    'handleToggleSSR': ('useESSSwitchStore', 'toggleSSR'),
    'tesHandleToggleSSR': ('useTESSwitchStore', 'toggleSSR'),
    'tgsHandleInstantHeatIsReady': ('useTGSSwitchStore', 'setInstantHeatIsReady'),

    # Admin panel actions
    'handleRemoveSysIdentificationLocation': ('useAdminStore', 'removeSysIdentificationLocation'),
    'handleForceGasAndElectric': ('useSettingsOptionsStore', 'setForceGasAndElectric'),
    'handleResetUnApplyMachinesOfGasInputs': ('useSettingsOptionsStore', 'resetUnApplyMachinesOfGasInputs'),
    'handleAddSwitchSizeSSRRating': ('useAdminStore', 'addSwitchSizeSSRRating'),
    'handleSitePlanURL': ('useAdminStore', 'setSitePlanURL'),

    # Force and Faults actions
    'handleForceButtonClick': ('useSettingsOptionsStore', 'setForceButtonClick'),
    'handleFaultsReset': ('useFaultsStore', 'resetFaults'),
    'handleForceSelection': ('useSettingsOptionsStore', 'setForceSelection'),
    'handleDisplayForceStatusBox': ('useSettingsOptionsStore', 'toggleDisplayForceStatusBox'),
    'handleForceButtonActivated': ('useSettingsOptionsStore', 'setForceButtonActivated'),

    # Data Consumption unselect actions
    'essDataConsumptionHandleUnSelectIndividualMachine': ('useESSDataConsumptionStore', 'unselectIndividualMachine'),
    'tesDataConsumptionHandleUnSelectIndividualMachine': ('useTESDataConsumptionStore', 'unselectIndividualMachine'),
    'tgsDataConsumptionHandleUnSelectIndividualMachine': ('useTGSDataConsumptionStore', 'unselectIndividualMachine'),
    'hpDataConsumptionHandleUnSelectIndividualMachine': ('useHPDataConsumptionStore', 'unselectIndividualMachine'),

    # Other
    'handleDisplaySelectBox': ('useMasterControlSelectStore', 'toggleDisplaySelectBox'),
    'handleCreateCommand': ('useMCCommandStore', 'createCommand'),
    'handleViewPrevCommandAndCreateNewCommand': ('useMCCommandStore', 'viewPrevAndCreateNew'),
    'handleSetInitialStateSettingsOptions': ('useSettingsOptionsStore', 'setInitialState'),
    'handleExpand': ('useMCIsExpandedStore', 'toggleExpand'),
    'handleResetAtsState': ('useMCStore', 'resetAtsState'),
    'handleResetAllDialControl': ('useMCStore', 'resetAllDialControl'),

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
    """Extract all dispatch() calls from content, including multiline patterns"""
    # Use DOTALL flag to match across newlines
    flags = re.DOTALL

    # Pattern 1: dispatch(actionName({...})) - multiline object literal
    pattern1 = r'dispatch\(\s*(\w+)\(\s*(\{[^}]*\})\s*\)\s*\);'
    matches1 = re.findall(pattern1, content, flags)

    # Pattern 2: dispatch(actionName({...}); - malformed multiline
    pattern2 = r'dispatch\(\s*(\w+)\(\s*(\{[^}]*\})\s*\);'
    matches2 = re.findall(pattern2, content, flags)

    # Pattern 3: dispatch(actionName(args)) - single line with simple args
    pattern3 = r'dispatch\((\w+)\(([^)]*)\)\)'
    matches3 = re.findall(pattern3, content)

    # Pattern 4: dispatch(actionName(); - action with no args, malformed
    pattern4 = r'dispatch\((\w+)\(\);'
    matches4 = [(action, '') for action in re.findall(pattern4, content)]

    # Pattern 5: dispatch(actionName()); - action with no args, properly formed
    pattern5 = r'dispatch\((\w+)\(\)\);'
    matches5 = [(action, '') for action in re.findall(pattern5, content)]

    all_matches = matches1 + matches2 + matches3 + matches4 + matches5
    # Remove duplicates
    seen = set()
    unique_matches = []
    for action, args in all_matches:
        key = (action, args.strip() if args else '')
        if key not in seen:
            seen.add(key)
            unique_matches.append((action, args))

    return unique_matches

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

            # Handle empty args (action with no parameters)
            if args == '':
                # Pattern 1: dispatch(action(); - malformed (missing dispatch closing paren)
                old_pattern_no_args1 = rf'dispatch\({action}\(\);'
                new_replacement_no_args = f'{store}().{method}();'
                content = re.sub(old_pattern_no_args1, new_replacement_no_args, content)

                # Pattern 2: dispatch(action()); - properly formed
                old_pattern_no_args2 = rf'dispatch\({action}\(\)\);'
                content = re.sub(old_pattern_no_args2, new_replacement_no_args, content)
            else:
                # Replace both properly formed and malformed dispatch calls with args
                # Use DOTALL flag for multiline matching
                flags = re.DOTALL

                # Pattern 1: dispatch(\n  action({\n    ...  \n  })\n); - multiline properly formed
                old_pattern1 = rf'dispatch\(\s*{action}\(\s*{re.escape(args)}\s*\)\s*\);'
                new_replacement1 = f'{store}().{method}({args});'
                content = re.sub(old_pattern1, new_replacement1, content, flags=flags)

                # Pattern 2: dispatch(action({ args }); - malformed (missing closing paren)
                old_pattern2 = rf'dispatch\(\s*{action}\(\s*{re.escape(args)}\s*\);'
                new_replacement2 = f'{store}().{method}({args});'
                content = re.sub(old_pattern2, new_replacement2, content, flags=flags)

                # Pattern 3: dispatch(action(args)) - single line properly formed
                old_pattern3 = rf'dispatch\({action}\({re.escape(args)}\)\)'
                new_replacement3 = f'{store}().{method}({args})'
                content = re.sub(old_pattern3, new_replacement3, content)
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
# Add to ACTION_TO_ZUSTAND before running:
# 'handleSpecificLocationSelectBySwitch': ('useMasterControlBySwitchSelectStore', 'selectSpecificLocation'),
# 'handleSpecificLocationSelectByLocation': ('useMasterControlSelectByLocationStore', 'selectSpecificLocation'),
