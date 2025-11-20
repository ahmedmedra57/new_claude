#!/usr/bin/env python3
"""
Fix remaining dispatch calls by directly replacing with Zustand store calls
"""
import os
import re

# Mapping of action creators to their Zustand equivalents
ACTION_MAPPINGS = {
    # ESS/TGS/TES Initial State and Machine Control
    'handleEssInitialState': ('useESSSwitchStore', 'resetMachinesState'),
    'handleOpenMachineController': ('useESSSwitchStore', 'setOpenMachineController'),
    'handleTgsInitialState': ('useTGSSwitchStore', 'resetMachinesState'),
    'tgsHandleOpenMachineController': ('useTGSSwitchStore', 'setOpenMachineController'),
    'handleTesInitialState': ('useTESSwitchStore', 'resetMachinesState'),
    'tesHandleOpenMachineController': ('useTESSwitchStore', 'setOpenMachineController'),

    # Master Control By Switch
    'handleSelectAllBySwitch': ('useMasterControlBySwitchSelectStore', 'selectAll'),
    'handleLocationSelectBySwitch': ('useMasterControlBySwitchSelectStore', 'selectLocation'),
    'handleSpecificLocationSelectBySwitch': ('useMasterControlBySwitchSelectStore', 'selectSpecificLocation'),
    'handleMachineSelectBySwitch': ('useMasterControlBySwitchSelectStore', 'selectMachine'),

    # Master Control By Location
    'handleSelectAllByLocation': ('useMasterControlSelectByLocationStore', 'selectAll'),
    'handleLocationSelectByLocation': ('useMasterControlSelectByLocationStore', 'selectLocation'),
    'handleSpecificLocationSelectByLocation': ('useMasterControlSelectByLocationStore', 'selectSpecificLocation'),
    'handleMachineSelectByLocation': ('useMasterControlSelectByLocationStore', 'selectMachine'),

    # Select One
    'selectOneBySwitch': ('useMasterControlBySwitchSelectStore', 'selectOne'),
    'selectOneByLocation': ('useMasterControlSelectByLocationStore', 'selectOne'),
}

def fix_dynamic_dispatch_with_params(content, filepath):
    """
    Fix dispatch calls where action creators are passed as function parameters.
    Replace dispatch(actionFC(...)) with direct store calls.
    """
    original = content

    # Pattern 1: dispatch(functionParam({...}))
    # Find all such patterns and try to replace them
    pattern = r'dispatch\(\s*(\w+)\(\s*(\{[^}]*\})\s*\)\s*\);?'

    def replace_dispatch(match):
        action_var = match.group(1)
        args = match.group(2)

        # Check if this is a known FC pattern
        if action_var.endswith('FC'):
            # This is a function parameter that should be replaced with callback
            return f"{action_var}Callback({args});"

        # Check if it's a known action creator
        if action_var in ACTION_MAPPINGS:
            store, method = ACTION_MAPPINGS[action_var]
            return f"{store}().{method}({args});"

        # Keep original if unknown
        return match.group(0)

    content = re.sub(pattern, replace_dispatch, content, flags=re.DOTALL)

    # Pattern 2: dispatch(functionParam(array)) for arrays
    pattern2 = r'dispatch\(\s*(\w+)\(\s*(\[[^\]]*\])\s*\)\s*\);?'

    def replace_dispatch_array(match):
        action_var = match.group(1)
        args = match.group(2)

        if action_var.endswith('FC'):
            return f"{action_var}Callback({args});"

        if action_var in ACTION_MAPPINGS:
            store, method = ACTION_MAPPINGS[action_var]
            return f"{store}().{method}({args});"

        return match.group(0)

    content = re.sub(pattern2, replace_dispatch_array, content, flags=re.DOTALL)

    # Pattern 3: Malformed dispatch calls (missing closing paren)
    pattern3 = r'dispatch\(\s*(\w+)\(\s*(\{[^}]*\})\s*\);'

    def replace_malformed(match):
        action_var = match.group(1)
        args = match.group(2)

        if action_var.endswith('FC'):
            return f"{action_var}Callback({args});"

        if action_var in ACTION_MAPPINGS:
            store, method = ACTION_MAPPINGS[action_var]
            return f"{store}().{method}({args});"

        return match.group(0)

    content = re.sub(pattern3, replace_malformed, content, flags=re.DOTALL)

    return content != original, content

def refactor_function_to_use_callbacks(content, function_name, fc_params):
    """
    Refactor a function to accept and use callbacks instead of Redux action creators.

    Args:
        content: File content
        function_name: Name of function to refactor (e.g., 'presetSelectBoxHandler')
        fc_params: List of FC parameter names to replace with callbacks
    """
    original = content

    # Step 1: Replace FC parameters with Callback in function signature
    for param in fc_params:
        # Change parameter name from paramFC to paramCallback
        content = re.sub(
            rf'\b{param}\b',
            f'{param}Callback',
            content
        )

    return content != original, content

def fix_search_box_properly(filepath):
    """Properly fix SearchBox.js by refactoring machineControlHandler"""
    with open(filepath, 'r') as f:
        content = f.read()

    original = content

    # Step 1: Change function signature
    # machineControlHandler(dispatchInitialStateFC, dispatchOpenMachineFC, ...)
    # to machineControlHandler(initialStateCallback, openMachineCallback, ...)
    content = re.sub(
        r'(const machineControlHandler = \(\s*)dispatchInitialStateFC(\s*,\s*)dispatchOpenMachineFC',
        r'\1initialStateCallback\2openMachineCallback',
        content
    )

    # Step 2: Replace dispatch calls inside function
    # dispatch(dispatchInitialStateFC(locationArr))
    content = re.sub(
        r'dispatch\(dispatchInitialStateFC\(([^)]+)\)\);?',
        r'initialStateCallback(\1);',
        content
    )

    # dispatch(dispatchOpenMachineFC({...}))
    content = re.sub(
        r'dispatch\(\s*dispatchOpenMachineFC\(\s*(\{[^}]*\})\s*\)\s*\);?',
        r'openMachineCallback(\1);',
        content,
        flags=re.DOTALL
    )

    # Step 3: Fix call sites - replace action creators with direct store calls
    # For ESS
    content = re.sub(
        r'machineControlHandler\(\s*handleEssInitialState\s*,\s*handleOpenMachineController\s*,',
        r'machineControlHandler(\n        (arr) => useESSSwitchStore().resetMachinesState(arr),\n        (args) => useESSSwitchStore().setOpenMachineController(args),',
        content
    )

    # For TGS
    content = re.sub(
        r'machineControlHandler\(\s*handleTgsInitialState\s*,\s*tgsHandleOpenMachineController\s*,',
        r'machineControlHandler(\n        (arr) => useTGSSwitchStore().resetMachinesState(arr),\n        (args) => useTGSSwitchStore().setOpenMachineController(args),',
        content
    )

    # For TES
    content = re.sub(
        r'machineControlHandler\(\s*handleTesInitialState\s*,\s*tesHandleOpenMachineController\s*,',
        r'machineControlHandler(\n        (arr) => useTESSwitchStore().resetMachinesState(arr),\n        (args) => useTESSwitchStore().setOpenMachineController(args),',
        content
    )

    if content != original:
        with open(filepath, 'w') as f:
            f.write(content)
        return True
    return False

def fix_select_locations_properly(filepath):
    """Properly fix SelectLocations.js by refactoring presetSelectBoxHandler"""
    with open(filepath, 'r') as f:
        content = f.read()

    original = content

    # Step 1: Change function signature to use callbacks
    content = re.sub(
        r'(const presetSelectBoxHandler = \(\s*)allSelectFC(\s*,\s*)selectLocationFC(\s*,\s*)selectSpecificLocationFC(\s*,\s*)selectMachineFC',
        r'\1allSelectCallback\2selectLocationCallback\3selectSpecificLocationCallback\4selectMachineCallback',
        content
    )

    # Step 2: Replace dispatch calls inside function
    content = re.sub(
        r'dispatch\(allSelectFC\(([^)]+)\)\);?',
        r'allSelectCallback(\1);',
        content
    )
    content = re.sub(
        r'dispatch\(selectLocationFC\(([^)]+)\)\);?',
        r'selectLocationCallback(\1);',
        content
    )
    content = re.sub(
        r'dispatch\(\s*selectSpecificLocationFC\(\s*(\{[^}]*\})\s*\)\s*\);?',
        r'selectSpecificLocationCallback(\1);',
        content,
        flags=re.DOTALL
    )
    content = re.sub(
        r'dispatch\(selectMachineFC\(([^)]+)\)\);?',
        r'selectMachineCallback(\1);',
        content
    )

    # Step 3: Fix call sites for By Switch
    content = re.sub(
        r'presetSelectBoxHandler\(\s*handleSelectAllBySwitch\s*,\s*handleLocationSelectBySwitch\s*,\s*handleSpecificLocationSelectBySwitch\s*,\s*handleMachineSelectBySwitch\s*,',
        r'presetSelectBoxHandler(\n          (args) => useMasterControlBySwitchSelectStore().selectAll(args),\n          (args) => useMasterControlBySwitchSelectStore().selectLocation(args),\n          (args) => useMasterControlBySwitchSelectStore().selectSpecificLocation(args),\n          (args) => useMasterControlBySwitchSelectStore().selectMachine(args),',
        content
    )

    # Step 4: Fix call sites for By Location
    content = re.sub(
        r'presetSelectBoxHandler\(\s*handleSelectAllByLocation\s*,\s*handleLocationSelectByLocation\s*,\s*handleSpecificLocationSelectByLocation\s*,\s*handleMachineSelectByLocation\s*,',
        r'presetSelectBoxHandler(\n          (args) => useMasterControlSelectByLocationStore().selectAll(args),\n          (args) => useMasterControlSelectByLocationStore().selectLocation(args),\n          (args) => useMasterControlSelectByLocationStore().selectSpecificLocation(args),\n          (args) => useMasterControlSelectByLocationStore().selectMachine(args),',
        content
    )

    if content != original:
        with open(filepath, 'w') as f:
            f.write(content)
        return True
    return False

def fix_file_dispatch_calls(filepath):
    """Fix remaining dispatch calls in a file by direct replacement"""
    with open(filepath, 'r') as f:
        content = f.read()

    changed, content = fix_dynamic_dispatch_with_params(content, filepath)

    if changed:
        with open(filepath, 'w') as f:
            f.write(content)
        return True
    return False

def main():
    print("Fixing remaining dispatch patterns...\n")

    # Special handling for specific files
    special_files = {
        'components/searchBox/SearchBox.js': fix_search_box_properly,
        'components/masterControlSwitches/SelectLocations.js': fix_select_locations_properly,
    }

    fixed = []

    for filepath, fix_func in special_files.items():
        full_path = f'/home/user/new_claude/{filepath}'
        if os.path.exists(full_path):
            try:
                if fix_func(full_path):
                    fixed.append(filepath)
                    print(f"✓ {filepath}")
            except Exception as e:
                print(f"✗ {filepath}: {e}")

    # Fix remaining files with standard approach
    other_files = [
        'components/Header.js',
        'components/masterControlSwitches/SelectMachineItems.js',
        'components/telemetry/theSelections/MainSelections.js',
        'components/commonComponentsMC/ButtonGroup.js',
        'components/commonComponentsMC/AdminSSRItemDetails.js',
        'components/faults/FaultsDetails.js',
        'components/settings/SettingsMain.js',
        'components/masterControl/MasterControlContents.js',
    ]

    for filepath in other_files:
        full_path = f'/home/user/new_claude/{filepath}'
        if os.path.exists(full_path):
            try:
                if fix_file_dispatch_calls(full_path):
                    fixed.append(filepath)
                    print(f"✓ {filepath}")
            except Exception as e:
                print(f"✗ {filepath}: {e}")

    print(f"\n✅ Fixed {len(fixed)} files")

    # Count remaining dispatch calls
    total_remaining = 0
    for root, dirs, files in os.walk('/home/user/new_claude/components'):
        if 'zustand-stores' in root or 'store' in root:
            continue
        for file in files:
            if file.endswith('.js'):
                filepath = os.path.join(root, file)
                try:
                    with open(filepath, 'r') as f:
                        content = f.read()
                        matches = re.findall(r'^\s*dispatch\(', content, re.MULTILINE)
                        total_remaining += len(matches)
                except:
                    pass

    print(f"📊 Remaining dispatch() calls: {total_remaining}")
    return len(fixed)

if __name__ == '__main__':
    count = main()
    exit(0 if count > 0 else 1)
