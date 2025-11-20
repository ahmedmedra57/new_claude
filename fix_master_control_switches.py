#!/usr/bin/env python3
"""Fix masterControlSwitches conditional selectors"""
import os
import re

def fix_file(filepath):
    """Fix conditional useSelector in masterControlSwitches"""
    try:
        with open(filepath, 'r') as f:
            content = f.read()
    except:
        return False

    original = content

    # Check if file has the pattern
    if 'useSelector' not in content:
        return False

    # Add Zustand import if not present
    if 'useMasterControlBySwitchSelectStore' not in content:
        # Find first import
        first_import = re.search(r"^import\s+", content, re.MULTILINE)
        if first_import:
            # Insert after first import line
            lines = content.split('\n')
            for i, line in enumerate(lines):
                if line.strip().startswith("import { useState }") or line.strip().startswith("import { use"):
                    zustand_import = "import { useMasterControlBySwitchSelectStore, useMasterControlSelectByLocationStore } from '../zustand-stores';"
                    lines.insert(i + 1, zustand_import)
                    content = '\n'.join(lines)
                    break

    # Replace conditional useSelector pattern
    # Pattern: const xxx = useSelector(\n    scope === 'switch' ? selectMCBySwitch : selectMCByLocation\n  );
    pattern = r"const\s+(\w+)\s*=\s*useSelector\(\s*scope\s*===\s*['\"]switch['\"]\s*\?\s*selectMCBySwitch\s*:\s*selectMCByLocation\s*\);"
    replacement = r"const \1 = scope === 'switch'\n    ? useMasterControlBySwitchSelectStore()\n    : useMasterControlSelectByLocationStore();"
    content = re.sub(pattern, replacement, content, flags=re.MULTILINE | re.DOTALL)

    # Remove useSelector import if present
    content = re.sub(r"import\s+\{\s*useSelector\s*\}\s+from\s+['\"]react-redux['\"];\s*\n", '', content)

    # Remove selector imports
    content = re.sub(r"import\s+\{[^}]*selectMCBySwitch[^}]*\}\s+from\s+['\"][^'\"]+['\"];\s*\n", '', content)

    if content != original:
        with open(filepath, 'w') as f:
            f.write(content)
        return True
    return False

def main():
    dir_path = '/home/user/new_claude/components/masterControlSwitches'
    migrated = []

    for file in os.listdir(dir_path):
        if file.endswith('.js'):
            filepath = os.path.join(dir_path, file)
            if fix_file(filepath):
                migrated.append(filepath)
                print(f"✓ {filepath}")

    print(f"\n✅ Fixed {len(migrated)} masterControlSwitches files")
    return len(migrated)

if __name__ == '__main__':
    count = main()
    exit(0 if count > 0 else 1)
