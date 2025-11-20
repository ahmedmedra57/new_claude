#!/usr/bin/env python3
"""
Enhanced migration script for remaining complex useSelector patterns
"""
import os
import re

# Comprehensive selector to store mapping
SELECTOR_TO_STORE = {
    'selectEssSwitch': 'useESSSwitchStore',
    'selectFlatEssSwitch': 'useESSSwitchStore',
    'selectTgsSwitch': 'useTGSSwitchStore',
    'selectFlatTgsSwitch': 'useTGSSwitchStore',
    'selectTesSwitch': 'useTESSwitchStore',
    'selectHpElectricSwitch': 'useHPElectricSwitchStore',
    'selectHpGasSwitch': 'useHPGasSwitchStore',
    'selectMCBySwitch': 'useMasterControlBySwitchSelectStore',
    'selectMCByLocation': 'useMasterControlSelectByLocationStore',
    'selectUserInfo': 'useUserStore',
    'selectUserPermissions': 'useUserStore',
    'selectUnits': 'useUnitsStore',
    'selectLocations': 'useLocationsStore',
    'selectFaults': 'useFaultsStore',
    'selectTelemetry': 'useTelemetryStore',
    'selectAdmin': 'useAdminStore',
    'selectMC': 'useMCStore',
}

def get_import_path(filepath):
    """Get proper import path based on file location"""
    if 'settings/admin' in filepath:
        return '../../../zustand-stores'
    elif 'settings/' in filepath:
        return '../../zustand-stores'
    elif 'reportStatus/' in filepath:
        return '../../zustand-stores'
    elif 'commonComponentsMC/controllers' in filepath:
        return '../../zustand-stores'
    elif 'commonComponentsMC' in filepath or 'masterControlSwitches' in filepath:
        return '../zustand-stores'
    elif 'searchBox' in filepath or 'faults' in filepath or 'globalOverview' in filepath:
        return '../zustand-stores'
    return '../zustand-stores'

def migrate_conditional_selector(content, filepath):
    """
    Migrate conditional useSelector patterns like:
    useSelector(condition ? selectA : selectB)
    """
    # Pattern 1: Ternary conditional selector
    # useSelector(swtName === 'ess' ? selectEssSwitch : selectTgsSwitch)
    pattern1 = r'useSelector\s*\(\s*([^)]+\?[^)]+:[^)]+)\s*\)'

    matches = list(re.finditer(pattern1, content, re.DOTALL))
    if not matches:
        return content, set()

    stores_needed = set()
    replacements = []

    for match in matches:
        condition_expr = match.group(1).strip()
        original_text = match.group(0)

        # Extract selector names from the condition
        selectors_in_condition = []
        for selector, store in SELECTOR_TO_STORE.items():
            if selector in condition_expr:
                selectors_in_condition.append((selector, store))
                stores_needed.add(store)

        if not selectors_in_condition:
            continue

        # Build replacement: condition ? useStoreA() : useStoreB()
        # Replace selectXxx with useXxxStore()
        new_expr = condition_expr
        for selector, store in selectors_in_condition:
            new_expr = new_expr.replace(selector, f'{store}()')

        replacements.append((original_text, new_expr))

    # Apply replacements
    for old, new in replacements:
        content = content.replace(old, new)

    return content, stores_needed

def migrate_simple_selector(content):
    """
    Migrate simple useSelector patterns:
    const x = useSelector(selectXxx);
    """
    stores_needed = set()

    # Find all simple useSelector calls
    pattern = r'useSelector\s*\(\s*(\w+)\s*\)'

    for match in re.finditer(pattern, content):
        selector = match.group(1)
        if selector in SELECTOR_TO_STORE:
            store = SELECTOR_TO_STORE[selector]
            stores_needed.add(store)

            # Replace const xxx = useSelector(selectXxx); with const xxx = useXxxStore();
            old_pattern = rf'const\s+(\w+)\s*=\s*useSelector\s*\(\s*{selector}\s*\);?'
            new_replacement = rf'const \1 = {store}();'
            content = re.sub(old_pattern, new_replacement, content, flags=re.MULTILINE)

            # Replace standalone useSelector(selectXxx) with useXxxStore()
            old_pattern2 = rf'useSelector\s*\(\s*{selector}\s*\)'
            new_replacement2 = f'{store}()'
            content = re.sub(old_pattern2, new_replacement2, content)

    return content, stores_needed

def migrate_file(filepath):
    """Migrate a single file"""
    try:
        with open(filepath, 'r') as f:
            content = f.read()
    except Exception as e:
        print(f"Error reading {filepath}: {e}")
        return False

    if 'useSelector' not in content:
        return False

    original = content
    all_stores_needed = set()

    # Step 1: Migrate conditional selectors
    content, stores1 = migrate_conditional_selector(content, filepath)
    all_stores_needed.update(stores1)

    # Step 2: Migrate simple selectors
    content, stores2 = migrate_simple_selector(content)
    all_stores_needed.update(stores2)

    if not all_stores_needed:
        return False

    # Step 3: Remove react-redux imports
    # Remove useSelector from imports
    content = re.sub(
        r"import\s+\{\s*useSelector\s*\}\s+from\s+['\"]react-redux['\"];\s*\n",
        '',
        content
    )
    content = re.sub(
        r"import\s+\{\s*useDispatch,\s*useSelector\s*\}\s+from\s+['\"]react-redux['\"];\s*\n",
        "import { useDispatch } from 'react-redux';\n",
        content
    )
    content = re.sub(
        r"import\s+\{\s*useSelector,\s*useDispatch\s*\}\s+from\s+['\"]react-redux['\"];\s*\n",
        "import { useDispatch } from 'react-redux';\n",
        content
    )

    # Step 4: Add Zustand imports
    import_path = get_import_path(filepath)
    stores_list = sorted(all_stores_needed)
    zustand_import = f"import {{ {', '.join(stores_list)} }} from '{import_path}';\n"

    # Check if import already exists
    if zustand_import.strip() not in content:
        # Find first import and insert after it
        lines = content.split('\n')
        insert_pos = 0
        for i, line in enumerate(lines):
            if line.strip().startswith('import '):
                insert_pos = i + 1
            elif insert_pos > 0 and not line.strip().startswith('import ') and line.strip() != '':
                break

        if insert_pos > 0:
            lines.insert(insert_pos, zustand_import.strip())
            content = '\n'.join(lines)

    # Write if changed
    if content != original:
        try:
            with open(filepath, 'w') as f:
                f.write(content)
            return True
        except Exception as e:
            print(f"Error writing {filepath}: {e}")
            return False

    return False

def main():
    components_dir = '/home/user/new_claude/components'
    migrated = []

    # Get all remaining files with useSelector
    for root, dirs, files in os.walk(components_dir):
        if 'store' in root or 'zustand-stores' in root:
            continue

        for file in files:
            if file.endswith('.js'):
                filepath = os.path.join(root, file)
                try:
                    with open(filepath, 'r') as f:
                        if 'useSelector' in f.read():
                            if migrate_file(filepath):
                                migrated.append(filepath)
                                print(f"✓ {filepath}")
                except:
                    pass

    print(f"\n✅ Migrated {len(migrated)} files")

    # Check remaining
    remaining = []
    for root, dirs, files in os.walk(components_dir):
        if 'store' in root or 'zustand-stores' in root:
            continue

        for file in files:
            if file.endswith('.js'):
                filepath = os.path.join(root, file)
                try:
                    with open(filepath, 'r') as f:
                        if 'useSelector' in f.read():
                            remaining.append(filepath)
                except:
                    pass

    if remaining:
        print(f"\n⚠️ {len(remaining)} files still have useSelector:")
        for f in remaining[:10]:
            print(f"  - {f}")
    else:
        print("\n🎉 All useSelector calls migrated!")

    return len(migrated)

if __name__ == '__main__':
    count = main()
    exit(0 if count >= 0 else 1)
