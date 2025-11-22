import React from 'react';
import MasterControlByMachine from './MasterControlByMachine';
import MasterControlByLocation from './MasterControlByLocation';
import { getSwitchesForZone, getLocationSwitchCount } from '../../helpers/integratedSwitchHelpers';
import {
  MobileWrapper,
  MobileHeader,
  BackButton,
  MobileMasterControlButton,
  MobileZonesList,
  MobileZoneItem,
  MobileZoneTitle,
  MobileZoneSubtitle,
  MobileZoneInfo,
  MobileSwitchesList,
  MobileSwitchItem,
  MobileSwitchTitle,
  MobileSwitchSubtitle,
  MobileDetailsContent,
  Title,
  TitleWrapper,
  UnderLine,
} from './IntegratedSwitchLocations.styles';

const MobileStepNavigation = ({
  mobileView,
  switchStatus,
  swtName,
  locations,
  selectedZone,
  selectedSwitch,
  showMasterControl,
  disabled,
  buttonHandler,
  handleZoneClick,
  handleSwitchClick,
  handleMasterControlClick,
  handleBackToZones,
  handleBackToSwitches,
}) => {
  // Safety check: Don't render if data isn't ready
  if (!switchStatus || !locations || !locations[swtName]) {
    return (
      <MobileWrapper>
        <MobileHeader>
          <Title isMobile={true}>Loading...</Title>
        </MobileHeader>
      </MobileWrapper>
    );
  }

  // View 1: Zones List
  if (mobileView === 'zones') {
    return (
      <MobileWrapper>
        <MobileHeader>
          <Title isMobile={true}>{swtName} - integrated switch locations</Title>
          <TitleWrapper>
            <UnderLine />
            <Title isMobile={true}>{Object.keys(switchStatus).length} zones</Title>
            <UnderLine />
          </TitleWrapper>
        </MobileHeader>
        <MobileZonesList>
          {Object.keys(switchStatus).map((location) => {
            const locationData = locations[swtName][location];
            const numSwitches = getLocationSwitchCount(location, switchStatus);

            return (
              <MobileZoneItem key={location} onClick={() => handleZoneClick(location)}>
                <MobileZoneTitle>{locationData?.location_name || location}</MobileZoneTitle>
                <MobileZoneSubtitle>
                  {locationData?.zone_city}, {locationData?.zone_state_short_name}
                </MobileZoneSubtitle>
                <MobileZoneInfo>{numSwitches} switches</MobileZoneInfo>
              </MobileZoneItem>
            );
          })}
        </MobileZonesList>
      </MobileWrapper>
    );
  }

  // View 2: Switches List for Selected Zone
  if (mobileView === 'switches' && selectedZone) {
    return (
      <MobileWrapper>
        <MobileHeader>
          <BackButton onClick={handleBackToZones}>← Back to Zones</BackButton>
          <Title isMobile={true}>
            {locations[swtName][selectedZone]?.location_name || selectedZone}
          </Title>
        </MobileHeader>
        <MobileMasterControlButton onClick={() => handleMasterControlClick(selectedZone)} disabled={disabled}>
          Master Control for Zone
        </MobileMasterControlButton>
        <MobileSwitchesList>
          {getSwitchesForZone(selectedZone, switchStatus, locations, swtName).map((switchData) => {
            const locationInfo = switchData.isSpecificLocation
              ? switchData.specificLocationData
              : switchData.locationData;

            return (
              <MobileSwitchItem
                key={`${switchData.location}-${switchData.id}`}
                onClick={() => handleSwitchClick(switchData)}
              >
                <MobileSwitchTitle>Switch: {switchData.machine}</MobileSwitchTitle>
                {switchData.isSpecificLocation && (
                  <MobileSwitchSubtitle>
                    {locationInfo?.specific_address || locationInfo?.location_name_short}
                  </MobileSwitchSubtitle>
                )}
              </MobileSwitchItem>
            );
          })}
        </MobileSwitchesList>
      </MobileWrapper>
    );
  }

  // View 3: Details View (Master Control or Switch Details)
  return (
    <MobileWrapper>
      <MobileHeader>
        <BackButton onClick={handleBackToSwitches}>← Back to Switches</BackButton>
        <Title isMobile={true}>
          {showMasterControl ? 'Master Control' : `Switch ${selectedSwitch?.machine}`}
        </Title>
      </MobileHeader>
      <MobileDetailsContent>
        {showMasterControl ? (
          <MasterControlByLocation
            location={selectedZone}
            swtName={swtName}
            buttonHandler={buttonHandler}
            isMobile={true}
            disabled={disabled}
          />
        ) : (
          selectedSwitch && (
            <>
              <MasterControlByMachine
                systemType={swtName}
                location={selectedSwitch.location}
                machine={selectedSwitch.machine}
                indivLocationName={
                  selectedSwitch.isSpecificLocation
                    ? selectedSwitch.specificLocationData?.location_name_short
                    : selectedSwitch.locationData?.locationName
                }
                isMobile={true}
              />
            </>
          )
        )}
      </MobileDetailsContent>
    </MobileWrapper>
  );
};

export default MobileStepNavigation;
