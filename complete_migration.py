#!/usr/bin/env python3
"""
Complete Redux to Zustand migration script
"""
import os
import re

# Comprehensive mapping of ALL Redux selectors to Zustand stores
MIGRATIONS = {
    # App & Basic
    'selectAppInfo': {'store': 'useAppStore'},
    'selectMessageBoxes': {'store': 'useMessageBoxesStore'},
    'selectGlobalOverview': {'store': 'useGlobalOverviewStore'},
    'selectReportStatus': {'store': 'useReportStatusStore'},
    'selectAddress': {'store': 'useAddressStore'},
    # User & Permissions
    'selectUserInfo': {'store': 'useUserStore'},
    'selectUserPermissions': {'store': 'useUserStore'},
    'selectLoadingState': {'store': 'useUserStore'},
    'selectErrorState': {'store': 'useUserStore'},
    # Telemetry
    'selectTelemetry': {'store': 'useTelemetryStore'},
    'selectTelemetryChartData': {'store': 'useTelemetryChartDataStore'},
    # Master Control
    'selectMC': {'store': 'useMCStore'},
    'selectMCCommand': {'store': 'useMCCommandStore'},
    'selectMasterControls': {'store': 'useMasterControlSelectStore'},
    'selectMCBySwitch': {'store': 'useMasterControlBySwitchSelectStore'},
    'selectMCByLocation': {'store': 'useMasterControlSelectByLocationStore'},
    'selectMCIsExpanded': {'store': 'useMCIsExpandedStore'},
    # Mobile
    'selectMobileMC': {'store': 'useMobileMasterControlStore'},
    'selectedProgram': {'store': 'useMobileSelectProgramStore'},
    # Machines & Locations
    'selectedMachinesState': {'store': 'useSelectedMachinesStore'},
    'selectedMachines': {'store': 'useSelectedMachinesStore'},
    'selectLocations': {'store': 'useLocationsStore'},
    'selectDescription': {'store': 'useSSRDescriptionStore'},
    # Faults
    'selectFaults': {'store': 'useFaultsStore'},
    # Data Consumption
    'selectEssDataConsumption': {'store': 'useESSDataConsumptionStore'},
    'selectTgsDataConsumption': {'store': 'useTGSDataConsumptionStore'},
    'selectTesDataConsumption': {'store': 'useTESDataConsumptionStore'},
    'selectHpDataConsumption': {'store': 'useHPDataConsumptionStore'},
    # Switch Stores
    'selectEssSwitch': {'store': 'useESSSwitchStore'},
    'selectFlatEssSwitch': {'store': 'useESSSwitchStore'},
    'selectTgsSwitch': {'store': 'useTGSSwitchStore'},
    'selectFlatTgsSwitch': {'store': 'useTGSSwitchStore'},
    'selectTesSwitch': {'store': 'useTESSwitchStore'},
    'selectHpElectricSwitch': {'store': 'useHPElectricSwitchStore'},
    'selectHpGasSwitch': {'store': 'useHPGasSwitchStore'},
    # Settings
    'selectUnits': {'store': 'useUnitsStore'},
    'selectSnowSensor': {'store': 'useSnowSensorStore'},
    'selectWindFactor': {'store': 'useWindFactorStore'},
    'selectInterfaceMode': {'store': 'useInterfaceModeStore'},
    'selectSettingsOptions': {'store': 'useSettingsOptionsStore'},
    'selectEditCancelApplyButtons': {'store': 'useEditCancelApplyButtonsStore'},
    'selectForceAndCommands': {'store': 'useForceAndCommandsStore'},
    'selectForceCommandAndAdminSelect': {'store': 'useForceCommandAndAdminSelectStore'},
    # Admin
    'selectAdmin': {'store': 'useAdminStore'},
    'selectSysIdentification': {'store': 'useSysIdentificationStore'},
}

def get_depth_adjusted_import(filepath, base_import):
    """Adjust import path based on file depth"""
    depth = filepath.count('/') - filepath.count('components/')
    if 'settings/admin' in filepath:
        return '../../../zustand-stores'
    elif 'settings/' in filepath:
        return '../../zustand-stores'
    elif filepath.count('/') >= 3:
        return '../zustand-stores'
    return '../zustand-stores'

def migrate_file(filepath):
    """Migrate a single file"""
    try:
        with open(filepath, 'r') as f:
            content = f.read()
    except:
        return False

    original = content
    stores_needed = set()

    # Find all useSelector calls and extract selectors
    selector_pattern = r'useSelector\((\w+)\)'
    for match in re.finditer(selector_pattern, content):
        selector = match.group(1)
        if selector in MIGRATIONS:
            stores_needed.add(selector)

    # If no selectors found, skip
    if not stores_needed:
        return False

    # Remove useSelector import if it exists alone
    content = re.sub(r"import\s+\{\s*useSelector\s*\}\s+from\s+['\"]react-redux['\"];\s*\n", '', content)

    # Build Zustand import
    import_path = get_depth_adjusted_import(filepath, '../zustand-stores')
    stores_to_import = [MIGRATIONS[sel]['store'] for sel in stores_needed]
    zustand_import = f"import {{ {', '.join(sorted(set(stores_to_import)))} }} from '{import_path}';\n"

    # Add Zustand import after first import or at beginning
    import_match = re.search(r"^import\s+", content, re.MULTILINE)
    if import_match:
        # Find end of first import block
        lines = content.split('\n')
        insert_pos = 0
        for i, line in enumerate(lines):
            if line.strip().startswith('import '):
                insert_pos = i + 1
            elif insert_pos > 0 and not line.strip().startswith('import '):
                break

        # Check if zustand import already exists
        if zustand_import.strip() not in content:
            lines.insert(insert_pos, zustand_import.strip())
            content = '\n'.join(lines)

    # Replace useSelector calls
    for selector in stores_needed:
        store = MIGRATIONS[selector]['store']
        # Replace const xxx = useSelector(selectXxx); with const xxx = useXxxStore();
        pattern1 = rf'const\s+(\w+)\s*=\s*useSelector\({selector}\);'
        replacement1 = rf'const \1 = {store}();'
        content = re.sub(pattern1, replacement1, content)

        # Replace useSelector(selectXxx) with useXxxStore()
        pattern2 = rf'useSelector\({selector}\)'
        replacement2 = f'{store}()'
        content = re.sub(pattern2, replacement2, content)

    # Write if changed
    if content != original:
        with open(filepath, 'w') as f:
            f.write(content)
        return True
    return False

def main():
    components_dir = '/home/user/new_claude/components'
    migrated = []

    for root, dirs, files in os.walk(components_dir):
        if 'store' in root or 'zustand-stores' in root:
            continue

        for file in files:
            if file.endswith('.js'):
                filepath = os.path.join(root, file)
                if migrate_file(filepath):
                    migrated.append(filepath)
                    print(f"✓ {filepath}")

    print(f"\n✅ Migrated {len(migrated)} files")
    return len(migrated)

if __name__ == '__main__':
    count = main()
    exit(0 if count > 0 else 1)
