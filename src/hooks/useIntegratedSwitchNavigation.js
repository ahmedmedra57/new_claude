import { useState, useEffect } from 'react';

/**
 * Custom hook to manage navigation state for IntegratedSwitchLocations
 * Handles zone expansion, switch selection, and mobile view state
 */
export const useIntegratedSwitchNavigation = (switchStatus, swtName, locations, isMobile) => {
  const [selectedZone, setSelectedZone] = useState(null);
  const [selectedSwitch, setSelectedSwitch] = useState(null);
  const [showMasterControl, setShowMasterControl] = useState(false);
  const [mobileView, setMobileView] = useState('zones'); // 'zones' | 'switches' | 'details'
  const [expandedZones, setExpandedZones] = useState(new Set());

  // Initialize expandedZones and auto-select first switch when switchStatus is available
  useEffect(() => {
    if (!switchStatus || Object.keys(switchStatus).length === 0) return;
    if (!locations || !locations[swtName]) return;

    // Expand all zones by default
    // setExpandedZones(new Set(Object.keys(switchStatus)));

    // Auto-select the first switch to show details in right panel
    const firstLocation = Object.keys(switchStatus)[0];
    if (!firstLocation) return;

    const firstSwitch = getFirstSwitchFromLocation(firstLocation);
    if (firstSwitch) {
      setSelectedSwitch(firstSwitch);
      setSelectedZone(firstSwitch.parentLocation || firstSwitch.location);
    }
  }, [switchStatus, swtName, locations]);

  // Helper: Get first switch from a location
  const getFirstSwitchFromLocation = (location) => {
    if (!location || !switchStatus || !switchStatus[location]) return null;

    const locationData = switchStatus[location];

    if (locationData.isSpecificLocation && locationData.subLocations) {
      const firstSubLocation = Object.keys(locationData.subLocations)[0];
      if (firstSubLocation && locationData.subLocations[firstSubLocation]) {
        const devices = locationData.subLocations[firstSubLocation].devices || {};
        const firstMachine = Object.keys(devices)[0];
        if (firstMachine && locations && locations[swtName] && locations[swtName][firstSubLocation]) {
          return {
            id: firstMachine,
            location: firstSubLocation,
            parentLocation: location,
            isSpecificLocation: true,
            specificLocationData: locations[swtName][firstSubLocation],
            machine: firstMachine,
          };
        }
      }
    } else if (locationData.devices) {
      const devices = locationData.devices || {};
      const firstMachine = Object.keys(devices)[0];
      if (firstMachine && locations && locations[swtName] && locations[swtName][location]) {
        return {
          id: firstMachine,
          location: location,
          parentLocation: null,
          isSpecificLocation: false,
          locationData: locations[swtName][location],
          machine: firstMachine,
        };
      }
    }

    return null;
  };

  // Handler: Toggle zone expansion
  const handleZoneClick = (location) => {
    setExpandedZones((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(location)) {
        newSet.delete(location);
        // Clear selection if collapsing the selected zone
        if (selectedZone === location) {
          setSelectedZone(null);
          setSelectedSwitch(null);
          setShowMasterControl(false);
        }
      } else {
        newSet.add(location);
      }
      return newSet;
    });

    // Mobile: Navigate to switches view
    if (isMobile && !expandedZones.has(location)) {
      setSelectedZone(location);
      setMobileView('switches');
    }
  };

  // Handler: Select a switch
  const handleSwitchClick = (switchData) => {
    setSelectedSwitch(switchData);
    setSelectedZone(switchData.parentLocation || switchData.location);
    setShowMasterControl(false);

    if (isMobile) {
      setMobileView('details');
    }
  };

  // Handler: Show master control for a zone
  const handleMasterControlClick = (location) => {
    setShowMasterControl(true);
    setSelectedSwitch(null);
    setSelectedZone(location);

    if (isMobile) {
      setMobileView('details');
    }
  };

  // Handler: Mobile back to zones
  const handleBackToZones = () => {
    setMobileView('zones');
    setSelectedZone(null);
    setSelectedSwitch(null);
    setShowMasterControl(false);
  };

  // Handler: Mobile back to switches
  const handleBackToSwitches = () => {
    setMobileView('switches');
    setSelectedSwitch(null);
    setShowMasterControl(false);
  };

  return {
    selectedZone,
    selectedSwitch,
    showMasterControl,
    mobileView,
    expandedZones,
    handleZoneClick,
    handleSwitchClick,
    handleMasterControlClick,
    handleBackToZones,
    handleBackToSwitches,
  };
};
