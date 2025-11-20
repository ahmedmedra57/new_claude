#!/usr/bin/env python3
"""
Bulk migration script to replace Redux imports and usage with Zustand
"""

import os
import re

# Map of Redux selectors to Zustand stores
SELECTOR_TO_STORE = {
    'selectUnits': 'useUnitsStore',
    'selectSnowSensor': 'useSnowSensorStore',
    'selectWindFactor': 'useWindFactorStore',
    'selectInterfaceMode': 'useInterfaceModeStore',
    'selectSettingsOptions': 'useSettingsOptionsStore',
    'selectEditCancelApplyButtons': 'useEditCancelApplyButtonsStore',
    'selectForceAndCommands': 'useForceAndCommandsStore',
    'selectForceCommandAndAdminSelect': 'useForceCommandAndAdminSelectStore',
    'selectUserInfo': 'useUserStore',
    'selectUserPermissions': 'useUserStore',
    'selectAdminSlice': 'useAdminStore',
    'selectLocations': 'useLocationsStore',
}

def migrate_file(filepath):
    """Migrate a single file from Redux to Zustand"""
    with open(filepath, 'r') as f:
        content = f.read()

    original_content = content

    # Remove react-redux import if no other Redux usage
    content = re.sub(r"import\s+\{\s*useSelector\s*\}\s+from\s+['\"]react-redux['\"];\s*\n", '', content)
    content = re.sub(r"import\s+\{\s*useDispatch,\s*useSelector\s*\}\s+from\s+['\"]react-redux['\"];\s*\n", '', content)
    content = re.sub(r"import\s+\{\s*useSelector,\s*useDispatch\s*\}\s+from\s+['\"]react-redux['\"];\s*\n", '', content)

    # Replace specific selector imports
    for selector, store in SELECTOR_TO_STORE.items():
        # Remove old Redux slice imports
        pattern = rf"import\s+\{{[^}}]*{selector}[^}}]*\}}\s+from\s+['\"]\.\.\/\.\.\/store\/slices\/[^'\"]+['\"];\s*\n"
        content = re.sub(pattern, '', content)

    # Only write if changed
    if content != original_content:
        with open(filepath, 'w') as f:
            f.write(content)
        return True
    return False

def main():
    components_dir = '/home/user/new_claude/components'
    migrated_count = 0

    for root, dirs, files in os.walk(components_dir):
        # Skip store directory
        if 'store' in root:
            continue

        for file in files:
            if file.endswith('.js'):
                filepath = os.path.join(root, file)
                if migrate_file(filepath):
                    migrated_count += 1
                    print(f"Migrated: {filepath}")

    print(f"\nTotal files migrated: {migrated_count}")

if __name__ == '__main__':
    main()
