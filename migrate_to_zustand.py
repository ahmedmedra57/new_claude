#!/usr/bin/env python3
"""
Automated Redux to Zustand Migration Script
Migrates all React components in /components directory from Redux to Zustand
"""

import re
import os
from pathlib import Path

# Store mapping configuration
STORE_MAPPINGS = {
    'selectEssSwitch': 'useESSSwitchStore',
    'selectTgsSwitch': 'useTGSSwitchStore',
    'selectTesSwitch': 'useTESSwitchStore',
    'selectUserInfo': 'useUserStore',
    'selectUserPermissions': 'useUserStore',  # Special case: access .permissions
    'selectMC': 'useMCStore',
    'selectMCCommand': 'useMCCommandStore',
    'selectMasterControls': 'useMasterControlSelectStore',
    'selectMCBySwitch': 'useMasterControlBySwitchSelectStore',
    'selectMCIsExpanded': 'useMCIsExpandedStore',
    'selectLocations': 'useLocationsStore',
    'selectUnits': 'useUnitsStore',
    'selectFaults': 'useFaultsStore',
    'selectTelemetry': 'useTelemetryStore',
    'selectReportStatus': 'useReportStatusStore',
    'selectGlobalOverview': 'useGlobalOverviewStore',
}

# Action prefix mappings (Redux action → Zustand method)
ACTION_PREFIXES = {
    'handle': 'set',
    'tgsHandle': 'set',
    'tesHandle': 'set',
    'essHandle': 'set',
    'hpHandle': 'set',
}

def find_redux_files(components_dir):
    """Find all files using react-redux"""
    redux_files = []
    for root, dirs, files in os.walk(components_dir):
        for file in files:
            if file.endswith(('.js', '.jsx')):
                filepath = os.path.join(root, file)
                with open(filepath, 'r', encoding='utf-8') as f:
                    content = f.read()
                    if "from 'react-redux'" in content or 'from "react-redux"' in content:
                        redux_files.append(filepath)
    return redux_files

def extract_imports(content):
    """Extract Redux imports from file"""
    import_pattern = r"import\s+{([^}]+)}\s+from\s+['\"]react-redux['\"]"
    matches = re.findall(import_pattern, content)
    if matches:
        imports = [imp.strip() for imp in matches[0].split(',')]
        return imports
    return []

def extract_selectors(content):
    """Extract selector usage patterns"""
    selector_pattern = r'useSelector\((\w+)\)'
    return list(set(re.findall(selector_pattern, content)))

def determine_zustand_stores(selectors, actions_used):
    """Determine which Zustand stores are needed"""
    stores = set()
    for selector in selectors:
        if selector in STORE_MAPPINGS:
            stores.add(STORE_MAPPINGS[selector])
    return sorted(list(stores))

def migrate_file(filepath):
    """Migrate a single file from Redux to Zustand"""
    print(f"Migrating: {filepath}")

    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    original_content = content

    # 1. Remove react-redux import
    content = re.sub(
        r"import\s+{\s*useDispatch\s*,\s*useSelector\s*}\s+from\s+['\"]react-redux['\"];?\n?",
        "",
        content
    )
    content = re.sub(
        r"import\s+{\s*useSelector\s*,\s*useDispatch\s*}\s+from\s+['\"]react-redux['\"];?\n?",
        "",
        content
    )

    # 2. Extract selectors being used
    selectors = extract_selectors(content)

    # 3. Determine required Zustand stores
    zustand_stores = []
    for selector in selectors:
        if selector in STORE_MAPPINGS:
            zustand_stores.append(STORE_MAPPINGS[selector])
    zustand_stores = sorted(list(set(zustand_stores)))

    # 4. Add Zustand imports if stores identified
    if zustand_stores:
        # Find appropriate import path (../ or ../../)
        if '/components/' in filepath:
            depth = filepath.count('/components/') + filepath.split('/components/')[1].count('/')
            import_path = '../' * (depth - 1) + 'zustand-stores'
        else:
            import_path = '../zustand-stores'

        zustand_import = f"import {{ {', '.join(zustand_stores)} }} from '{import_path}';\n"

        # Add after other imports
        import_match = re.search(r"import.*from.*['\"]react['\"];?\n", content)
        if import_match:
            insert_pos = import_match.end()
            content = content[:insert_pos] + zustand_import + content[insert_pos:]

    # 5. Replace useSelector calls
    for selector in selectors:
        if selector in STORE_MAPPINGS:
            store = STORE_MAPPINGS[selector]
            # Handle special case for permissions
            if selector == 'selectUserPermissions':
                content = re.sub(
                    rf'const\s+permissions\s*=\s*useSelector\({selector}\);?',
                    f'const {{ permissions }} = {store}();',
                    content
                )
            else:
                content = re.sub(
                    rf'useSelector\({selector}\)',
                    f'{store}()',
                    content
                )

    # 6. Remove dispatch declaration
    content = re.sub(
        r'const\s+dispatch\s*=\s*useDispatch\(\);?\n?',
        '',
        content
    )

    # 7. Replace dispatch calls (basic pattern - may need manual review)
    # Pattern: dispatch(actionName(...)) → setActionName(...)
    # This is complex and may require manual review

    # 8. Remove Redux slice imports
    content = re.sub(
        r"import\s+{[^}]*}\s+from\s+['\"]\.\.\/store\/slices\/[^'\"]+['\"];?\n?",
        "",
        content,
        flags=re.MULTILINE
    )

    # Only write if changes were made
    if content != original_content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"  ✓ Migrated successfully")
        return True
    else:
        print(f"  - No changes needed")
        return False

def main():
    """Main migration function"""
    components_dir = '/home/user/new_claude/components'

    print("=" * 60)
    print("Redux to Zustand Migration Tool")
    print("=" * 60)
    print()

    # Find all Redux files
    print("Scanning for files using Redux...")
    redux_files = find_redux_files(components_dir)
    print(f"Found {len(redux_files)} files using Redux\n")

    # Migrate each file
    migrated_count = 0
    for filepath in redux_files:
        if migrate_file(filepath):
            migrated_count += 1
        print()

    print("=" * 60)
    print(f"Migration Complete!")
    print(f"Files migrated: {migrated_count}/{len(redux_files)}")
    print("=" * 60)
    print()
    print("IMPORTANT: Please review the changes manually as dispatch")
    print("call replacements may need manual adjustment.")
    print()

if __name__ == '__main__':
    main()
