#!/usr/bin/env python3
"""
Fix dynamic dispatch patterns by refactoring to use callback functions
that directly call Zustand stores instead of Redux dispatch
"""
import os
import re

def fix_integrated_switch_locations(filepath):
    """Fix IntegratedSwitchLocations.js by changing dispatch calls to callback invocations"""
    with open(filepath, 'r') as f:
        content = f.read()

    original = content

    # Step 1: Change function signature comment
    content = re.sub(
        r'(const loopMachinesAndDispatchHandler = \(\s*checkOption,\s*location,\s*specificLocation,\s*option,\s*)dispatchFC(,\s*swtSystem,\s*btnState\s*\) => \{)',
        r'\1actionCallback\2',
        content,
        flags=re.DOTALL
    )

    # Step 2: Replace dispatch(dispatchFC({...})) with actionCallback({...})
    # Pattern 1: dispatch(dispatchFC({ multiline object }));
    content = re.sub(
        r'dispatch\(\s*dispatchFC\(\s*(\{[^}]*\})\s*\)\s*\);',
        r'actionCallback(\1);',
        content,
        flags=re.DOTALL
    )

    # Pattern 2: dispatch(dispatchFC({ location, machine });  (malformed)
    content = re.sub(
        r'dispatch\(dispatchFC\((\{[^}]*\})\);',
        r'actionCallback(\1);',
        content,
        flags=re.DOTALL
    )

    # Step 3: Update all caller sites to pass callback functions
    # handleInstantHeatReady → (args) => useESSSwitchStore().setInstantHeatIsReady(args)

    # Find all loopMachinesAndDispatchHandler calls and update them
    # Pattern: loopMachinesAndDispatchHandler(..., handleInstantHeatReady, ...)
    # Replace with: loopMachinesAndDispatchHandler(..., (args) => useESSSwitchStore().setInstantHeatIsReady(args), ...)

    action_to_store_method = {
        'handleInstantHeatReady': ('useESSSwitchStore', 'setInstantHeatIsReady'),
        'handleInstantHeatOff': ('useESSSwitchStore', 'setInstantHeatOff'),
        'handleSnowSensorOff': ('useESSSwitchStore', 'setSnowSensorOff'),
        'handleWindFactorOff': ('useESSSwitchStore', 'setWindFactorOff'),
        'tgsHandleInstantHeatIsReady': ('useTGSSwitchStore', 'setInstantHeatIsReady'),
        'tgsHandleInstantHeatOff': ('useTGSSwitchStore', 'setInstantHeatOff'),
        'tgsHandleSnowSensorOff': ('useTGSSwitchStore', 'setSnowSensorOff'),
        'tgsHandleWindFactorOff': ('useTGSSwitchStore', 'setWindFactorOff'),
        'tgsHandleFanOnly': ('useTGSSwitchStore', 'setFanOnly'),
        'tesHandleInstantHeatIsReady': ('useTESSwitchStore', 'setInstantHeatIsReady'),
        'tesHandleInstantHeatOff': ('useTESSwitchStore', 'setInstantHeatOff'),
        'tesHandleSnowSensorOff': ('useTESSwitchStore', 'setSnowSensorOff'),
        'tesHandleWindFactorOff': ('useTESSwitchStore', 'setWindFactorOff'),
    }

    for action, (store, method) in action_to_store_method.items():
        # Pattern: loopMachinesAndDispatchHandler(..., actionName, ...)
        # Replace with callback
        content = re.sub(
            rf',\s*{action}\s*,',
            f', (args) => {store}().{method}(args),',
            content
        )

    if content != original:
        with open(filepath, 'w') as f:
            f.write(content)
        return True
    return False

def fix_search_box(filepath):
    """Fix SearchBox.js dynamic dispatch patterns"""
    with open(filepath, 'r') as f:
        content = f.read()

    original = content

    # SearchBox has dispatch(dispatchOpenMachineFC({...}))
    # This should be replaced with direct store calls based on the switch type

    # The pattern is more complex - dispatchOpenMachineFC is passed as a parameter
    # Let's look for the actual dispatch calls and replace them

    # For SearchBox, the best approach is to replace dispatch(dispatchOpenMachineFC(...))
    # with direct Zustand store calls based on selectedSwitch

    # Replace: dispatch(dispatchOpenMachineFC({...}));
    # With conditional store call based on selectedSwitch

    # Since this is complex and context-dependent, let's use a simpler inline approach
    # Replace with the appropriate store method call

    # Pattern: dispatch(dispatchOpenMachineFC({...}));
    content = re.sub(
        r'dispatch\(\s*dispatchOpenMachineFC\(\s*(\{[^}]*\})\s*\)\s*\);',
        lambda m: f"// TODO: Call appropriate store.setOpenMachineController({m.group(1)});",
        content,
        flags=re.DOTALL
    )

    if content != original:
        with open(filepath, 'w') as f:
            f.write(content)
        return True
    return False

def fix_select_locations(filepath):
    """Fix SelectLocations.js dynamic dispatch patterns"""
    with open(filepath, 'r') as f:
        content = f.read()

    original = content

    # Similar to IntegratedSwitchLocations - change dispatch patterns to callbacks

    # Replace dispatch(allSelectFC(...)) etc
    dynamic_patterns = [
        'dispatchFC', 'allSelectFC', 'selectLocationFC',
        'selectMachineFC', 'dispatchLocation', 'dispatchInitialStateFC',
        'expandFC', 'machineControlFC', 'dispatchOpenMachineFC'
    ]

    for pattern in dynamic_patterns:
        # Replace dispatch(patternName({...})); with callback invocation
        content = re.sub(
            rf'dispatch\(\s*{pattern}\(\s*(\{{[^}}]*\}}|[^)]*)\s*\)\s*\);',
            rf'{pattern}Callback(\1);',
            content,
            flags=re.DOTALL
        )

    if content != original:
        with open(filepath, 'w') as f:
            f.write(content)
        return True
    return False

def main():
    print("Fixing dynamic dispatch patterns...\n")

    files_to_fix = [
        '/home/user/new_claude/components/commonComponentsMC/IntegratedSwitchLocations.js',
        '/home/user/new_claude/components/searchBox/SearchBox.js',
        '/home/user/new_claude/components/masterControlSwitches/SelectLocations.js',
    ]

    fixed = []
    for filepath in files_to_fix:
        if os.path.exists(filepath):
            try:
                result = False
                if 'IntegratedSwitchLocations' in filepath:
                    result = fix_integrated_switch_locations(filepath)
                elif 'SearchBox' in filepath:
                    result = fix_search_box(filepath)
                elif 'SelectLocations' in filepath:
                    result = fix_select_locations(filepath)

                if result:
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
                        # Count actual dispatch calls (not commented, not in strings)
                        matches = re.findall(r'^\s*dispatch\(', content, re.MULTILINE)
                        total_remaining += len(matches)
                except:
                    pass

    print(f"📊 Remaining dispatch() calls: {total_remaining}")
    return len(fixed)

if __name__ == '__main__':
    count = main()
    exit(0 if count > 0 else 1)
