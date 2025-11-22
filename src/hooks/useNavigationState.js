import { useState } from 'react';

/**
 * Custom hook to manage two-panel navigation state
 * Handles zone selection, sub-location navigation, and switch selection
 */
const useNavigationState = () => {
  const [navigationView, setNavigationView] = useState('zones'); // 'zones' or 'switches'
  const [selectedZone, setSelectedZone] = useState(null);
  const [selectedSpecificLocation, setSelectedSpecificLocation] = useState(null);
  const [selectedSwitch, setSelectedSwitch] = useState(null);

  const handleZoneClick = (location) => {
    setSelectedZone(location);
    setSelectedSpecificLocation(null);
    setNavigationView('switches');
    setSelectedSwitch(null);
  };

  const handleBackToZones = () => {
    setNavigationView('zones');
    setSelectedZone(null);
    setSelectedSpecificLocation(null);
    setSelectedSwitch(null);
  };

  const handleSwitchClick = (location, machine, specificLocation = null) => {
    setSelectedSwitch({
      location: specificLocation || location,
      machine,
      parentZone: location,
      specificLocation: specificLocation,
    });
  };

  const handleSpecificLocationClick = (specificLocation) => {
    setSelectedSpecificLocation(specificLocation);
  };

  const handleBackToParentZone = () => {
    setSelectedSpecificLocation(null);
  };

  return {
    navigationView,
    selectedZone,
    selectedSpecificLocation,
    selectedSwitch,
    handleZoneClick,
    handleBackToZones,
    handleSwitchClick,
    handleSpecificLocationClick,
    handleBackToParentZone,
  };
};

export default useNavigationState;
