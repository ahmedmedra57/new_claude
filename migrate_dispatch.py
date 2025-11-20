#!/usr/bin/env python3
"""
Final migration: Handle useDispatch and remaining useSelector
"""
import os
import re

# Map Redux actions to Zustand store methods
DISPATCH_TO_ZUSTAND = {
    # Edit/Cancel/Apply buttons
    'handleResetButtons': ('useEditCancelApplyButtonsStore', 'resetButtons'),
    'handleClickedButton': ('useEditCancelApplyButtonsStore', 'setButtonClicked'),

    # Settings options
    'handleSetInitialStateSettingsOptions': ('useSettingsOptionsStore', 'setInitialSettings'),
    'setResetSettingsOptions': ('useSettingsOptionsStore', 'resetSettings'),
    'handleSelectingSettings': ('useSettingsOptionsStore', 'selectSetting'),

    # Units
    'handleSetUnits': ('useUnitsStore', 'setUnits'),
    'handleUnitSelection': ('useUnitsStore', 'setUnitSelection'),

    # User
    'addUserInfo': ('useUserStore', 'setUserInfo'),
    'handleAccessToken': ('useUserStore', 'setAccessToken'),
    'handleAllUsers': ('useUserStore', 'setAllUsers'),

    # Admin
    'handleGasType': ('useAdminStore', 'setGasType'),
    'handleGasValuePosition': ('useAdminStore', 'setGasValuePosition'),
    'handleForceGasAndElectric': ('useAdminStore', 'setForceGasAndElectric'),
    'handleSysConfiguration': ('useAdminStore', 'setSysConfiguration'),
    'handleTrackTempControl': ('useAdminStore', 'setTrackTempControl'),

    # MC
    'handleSelectEss': ('useMCStore', 'selectEss'),
    'handleSelectTgs': ('useMCStore', 'selectTgs'),
    'handleSelectTes': ('useMCStore', 'selectTes'),
    'handleSelectSystem': ('useMCStore', 'setSelectSystem'),

    # Master Control Select
    'handleDisplaySelectBox': ('useMasterControlSelectStore', 'toggleDisplaySelectBox'),
    'handleResetAllSelect': ('useMasterControlSelectStore', 'resetAllSelect'),

    # MC Command
    'handleCreateCommand': ('useMCCommandStore', 'createCommand'),
    'handleViewCommand': ('useMCCommandStore', 'setViewCommand'),
}

def find_dispatch_in_file(filepath):
    """Find all dispatch calls in a file"""
    try:
        with open(filepath, 'r') as f:
            content = f.read()
    except:
        return []

    # Find dispatch(action(...)) patterns
    pattern = r'dispatch\((\w+)\('
    matches = re.findall(pattern, content)
    return list(set(matches))

def migrate_dispatch_file(filepath):
    """Migrate dispatch calls in a file"""
    try:
        with open(filepath, 'r') as f:
            content = f.read()
    except:
        return False

    original = content
    stores_needed = set()

    # Find all dispatch calls
    dispatch_actions = find_dispatch_in_file(filepath)

    # Check if we can handle these actions
    for action in dispatch_actions:
        if action in DISPATCH_TO_ZUSTAND:
            stores_needed.add(DISPATCH_TO_ZUSTAND[action][0])

    if not stores_needed and 'useDispatch' not in content:
        return False

    # Remove useDispatch import
    content = re.sub(r"import\s+\{\s*useDispatch\s*\}\s+from\s+['\"]react-redux['\"];\s*\n", '', content)
    content = re.sub(r"import\s+\{\s*useDispatch,\s*useSelector\s*\}\s+from\s+['\"]react-redux['\"];\s*\n",
                     "import { useSelector } from 'react-redux';\n", content)
    content = re.sub(r"import\s+\{\s*useSelector,\s*useDispatch\s*\}\s+from\s+['\"]react-redux['\"];\s*\n",
                     "import { useSelector } from 'react-redux';\n", content)

    # Remove const dispatch = useDispatch();
    content = re.sub(r'\s*const\s+dispatch\s*=\s*useDispatch\(\);\s*\n', '', content)

    # Add Zustand imports if needed
    if stores_needed:
        import_path = get_import_path(filepath)
        zustand_import = f"import {{ {', '.join(sorted(stores_needed))} }} from '{import_path}';\n"

        # Add after first import
        lines = content.split('\n')
        for i, line in enumerate(lines):
            if line.strip().startswith('import ') and zustand_import.strip() not in content:
                # Find end of import block
                j = i
                while j < len(lines) and (lines[j].strip().startswith('import ') or lines[j].strip() == ''):
                    j += 1
                lines.insert(j, zustand_import.strip())
                content = '\n'.join(lines)
                break

    # Replace dispatch calls with Zustand methods
    for action, (store, method) in DISPATCH_TO_ZUSTAND.items():
        if action in dispatch_actions:
            # Add store hook call in component
            # Pattern: dispatch(action(payload)) -> storeMethod(payload)

            # First, add store destructuring if not present
            if store in stores_needed and f'{store}()' not in content:
                # Find function component start
                func_match = re.search(r'(const|function)\s+\w+\s*=?\s*\([^)]*\)\s*(?:=>)?\s*\{', content)
                if func_match:
                    insert_pos = func_match.end()
                    store_var = store.replace('use', '').replace('Store', '')
                    store_var = store_var[0].lower() + store_var[1:] + 'Store'
                    hook_call = f'\n  const {{ {method} }} = {store}();'
                    content = content[:insert_pos] + hook_call + content[insert_pos:]

            # Replace dispatch(action(...)) with method(...)
            pattern1 = rf'dispatch\({action}\(([^)]+)\)\)'
            replacement1 = rf'{method}(\1)'
            content = re.sub(pattern1, replacement1, content)

            # Handle dispatch(action()) with no args
            pattern2 = rf'dispatch\({action}\(\)\)'
            replacement2 = f'{method}()'
            content = re.sub(pattern2, replacement2, content)

    if content != original:
        with open(filepath, 'w') as f:
            f.write(content)
        return True
    return False

def get_import_path(filepath):
    """Get proper import path based on file location"""
    if 'settings/admin' in filepath:
        return '../../../zustand-stores'
    elif 'settings/' in filepath:
        return '../../zustand-stores'
    elif 'masterControl' in filepath or 'commonComponentsMC' in filepath:
        return '../zustand-stores'
    return '../zustand-stores'

def main():
    components_dir = '/home/user/new_claude/components'
    migrated = []

    for root, dirs, files in os.walk(components_dir):
        if 'store' in root or 'zustand-stores' in root:
            continue

        for file in files:
            if file.endswith('.js'):
                filepath = os.path.join(root, file)
                if migrate_dispatch_file(filepath):
                    migrated.append(filepath)
                    print(f"✓ {filepath}")

    print(f"\n✅ Migrated {len(migrated)} files with dispatch")
    return len(migrated)

if __name__ == '__main__':
    count = main()
    exit(0 if count > 0 else 1)
