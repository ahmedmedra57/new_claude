#!/usr/bin/env python3
"""
Migrate dispatch() calls to direct Zustand store method calls
Part 2 of Redux to Zustand migration
"""

import re
import os
from pathlib import Path

# Action name transformation patterns
ACTION_MAPPINGS = {
    # TGS actions
    'tgsHandleInstantHeat': 'setInstantHeat',
    'tgsHandleInstantHeatOff': 'setInstantHeatOff',
    'tgsHandleSnowSensor': 'setSnowSensor',
    'tgsHandleSnowSensorOff': 'setSnowSensorOff',
    'tgsHandleWindFactor': 'setWindFactor',
    'tgsHandleWindFactorOff': 'setWindFactorOff',
    'tgsHandleAddHeatingSchedule': 'setAddHeatingSchedule',
    'tgsHandleReadyHeatingSchedule': 'setReadyHeatingSchedule',
    'tgsHandleClearHeatingSchedule': 'setClearHeatingSchedule',
    'tgsHandleFanOnly': 'setFanOnly',
    'tgsHandleUnselectAllProgram': 'setUnselectAllProgram',
    'tgsHandleSelectProgram': 'setSelectProgram',
    'tgsActivateConflictMessage': 'setActivateConflictMessage',
    'tgsDeactivateConflictMessage': 'setDeactivateConflictMessage',
    'tgsSetDevicesConflicts': 'setDevicesConflicts',
    'tgsHandleOpenMachineController': 'setOpenMachineController',
    'tgsHandleUnSelectIndividualMachine': 'setUnSelectIndividualMachine',
    'tgsSpecificLocationUnselectMachinesHandler': 'setSpecificLocationUnselectMachines',

    # TES actions
    'tesHandleInstantHeat': 'setInstantHeat',
    'tesHandleInstantHeatOff': 'setInstantHeatOff',
    'tesHandleSnowSensor': 'setSnowSensor',
    'tesHandleSnowSensorOff': 'setSnowSensorOff',
    'tesHandleWindFactor': 'setWindFactor',
    'tesHandleWindFactorOff': 'setWindFactorOff',
    'tesHandleAddHeatingSchedule': 'setAddHeatingSchedule',
    'tesHandleReadyHeatingSchedule': 'setReadyHeatingSchedule',
    'tesHandleClearHeatingSchedule': 'setClearHeatingSchedule',
    'tesHandleOptionalConstantTempOff': 'setOptionalConstantTempOff',
    'tesHandleOptionalConstantTempIsReady': 'setOptionalConstantTempIsReady',
    'tesHandleUnselectAllProgram': 'setUnselectAllProgram',
    'tesHandleSelectProgram': 'setSelectProgram',
    'tesActivateConflictMessage': 'setActivateConflictMessage',
    'tesDeactivateConflictMessage': 'setDeactivateConflictMessage',
    'tesSetDevicesConflicts': 'setDevicesConflicts',
    'tesHandleOpenMachineController': 'setOpenMachineController',
    'tesHandleUnSelectIndividualMachine': 'setUnSelectIndividualMachine',
    'tesSpecificLocationUnselectMachinesHandler': 'setSpecificLocationUnselectMachines',
    'tesHandleShutOff': 'setShutOff',
    'tesHandleExpandSSRDetail': 'setExpandSSRDetail',
    'tesHandleInstantHeatIsReady': 'setInstantHeatIsReady',

    # ESS actions
    'essHandleInstantHeat': 'setInstantHeat',
    'essHandleInstantHeatOff': 'setInstantHeatOff',
    'essHandleSnowSensor': 'setSnowSensor',
    'essHandleSnowSensorOff': 'setSnowSensorOff',
    'essHandleWindFactor': 'setWindFactor',
    'essHandleWindFactorOff': 'setWindFactorOff',
    'essHandleAddHeatingSchedule': 'setAddHeatingSchedule',
    'essHandleReadyHeatingSchedule': 'setReadyHeatingSchedule',
    'essHandleClearHeatingSchedule': 'setClearHeatingSchedule',
    'essHandleUnselectAllProgram': 'setUnselectAllProgram',
    'essHandleSelectProgram': 'setSelectProgram',
    'essActivateConflictMessage': 'setActivateConflictMessage',
    'essDeactivateConflictMessage': 'setDeactivateConflictMessage',
    'essSetDevicesConflicts': 'setDevicesConflicts',
    'essHandleOpenMachineController': 'setOpenMachineController',

    # General actions
    'handleResetAllSelectBySwitch': 'setResetAllSelectBySwitch',
    'handleResetAllSelectByLocation': 'setResetAllSelectByLocation',
    'handleAccessToken': 'setAccessToken',
    'handleOpenMachineController': 'setOpenMachineController',
    'handleSetSelectedMachines': 'setSelectedMachines',
    'handleMCExpanded': 'setMCExpanded',
    'handleSetIsEssSwitch': 'setIsEssSwitch',
}

def migrate_dispatch_calls(filepath):
    """Migrate dispatch() calls in a file"""
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    original_content = content
    changes_made = []

    # Pattern 1: dispatch(actionName(...)) where action spreads multiple lines
    # This is the most complex case
    for action, method in ACTION_MAPPINGS.items():
        # Simple single-line pattern
        pattern1 = rf'dispatch\({action}\('
        if pattern1 in content:
            content = content.replace(pattern1, f'{method}(')
            changes_made.append(f'{action} → {method}')

        # Multi-line pattern with proper closing
        pattern2 = rf'dispatch\(\s*{action}\(\{{([^}}]*)\}}\)\s*\)'
        content = re.sub(pattern2, rf'{method}({{\1}})', content)

    # Remove nested closing parentheses from dispatch
    content = re.sub(r'\)\s*\)\s*;', ');', content)

    if content != original_content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        return True, changes_made
    return False, []

def find_dispatch_files(components_dir):
    """Find files still using dispatch()"""
    dispatch_files = []
    for root, dirs, files in os.walk(components_dir):
        for file in files:
            if file.endswith(('.js', '.jsx')):
                filepath = os.path.join(root, file)
                with open(filepath, 'r', encoding='utf-8') as f:
                    content = f.read()
                    if 'dispatch(' in content:
                        dispatch_files.append(filepath)
    return dispatch_files

def main():
    """Main function"""
    components_dir = '/home/user/new_claude/components'

    print("=" * 60)
    print("Dispatch Call Migration Tool")
    print("=" * 60)
    print()

    dispatch_files = find_dispatch_files(components_dir)
    print(f"Found {len(dispatch_files)} files using dispatch()\n")

    migrated_count = 0
    for filepath in dispatch_files:
        print(f"Processing: {filepath}")
        migrated, changes = migrate_dispatch_calls(filepath)
        if migrated:
            migrated_count += 1
            for change in changes[:5]:  # Show first 5 changes
                print(f"  ✓ {change}")
        print()

    print("=" * 60)
    print(f"Migration Complete!")
    print(f"Files processed: {migrated_count}/{len(dispatch_files)}")
    print("=" * 60)

if __name__ == '__main__':
    main()
