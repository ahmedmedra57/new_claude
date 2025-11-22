import React from 'react';
import MasterControlByMachine from './MasterControlByMachine';
import MasterControlByLocation from './MasterControlByLocation';
import { getSwitchesForZone, getLocationSwitchCount } from '../../helpers/integratedSwitchHelpers';
import {
  TwoColumnWrapper,
  NavigationColumn,
  DetailsColumn,
  ColumnHeader,
  ColumnTitle,
  NavigationList,
  ZoneContainer,
  ZoneItem,
  ZoneItemHeader,
  ZoneItemTitle,
  ZoneItemSubtitle,
  ZoneItemInfo,
  ExpandIcon,
  SwitchesSubmenu,
  MasterControlButton,
  SwitchSubmenuItem,
  SwitchItemTitle,
  SwitchItemSubtitle,
  DetailsContent,
  EmptyState,
} from './IntegratedSwitchLocations.styles';

const DesktopTwoColumnLayout = ({
  switchStatus,
  swtName,
  locations,
  expandedZones,
  selectedZone,
  selectedSwitch,
  showMasterControl,
  disabled,
  buttonHandler,
  handleZoneClick,
  handleSwitchClick,
  handleMasterControlClick,
}) => {
  // Safety check: Don't render if data isn't ready
  if (!switchStatus || !locations || !locations[swtName]) {
    return (
      <TwoColumnWrapper>
        <EmptyState>Loading...</EmptyState>
      </TwoColumnWrapper>
    );
  }

  return (
    <TwoColumnWrapper>
      {/* Left Column - Zones with expandable switches */}
      <NavigationColumn>
        <ColumnHeader>
          <ColumnTitle>
            {swtName} - Zones ({Object.keys(switchStatus).length})
          </ColumnTitle>
        </ColumnHeader>
        <NavigationList>
          {Object.keys(switchStatus).map((location) => {
            const locationData = locations[swtName][location];
            const numSwitches = getLocationSwitchCount(location, switchStatus);
            const isExpanded = expandedZones.has(location);
            const isZoneHighlighted = selectedZone === location;

            return (
              <ZoneContainer key={location}>
                <ZoneItem
                  isSelected={isZoneHighlighted}
                  onClick={() => handleZoneClick(location)}
                >
                  <ZoneItemHeader>
                    <ZoneItemTitle>{locationData?.locationName || location}</ZoneItemTitle>
                    <ExpandIcon isExpanded={isExpanded}>▼</ExpandIcon>
                  </ZoneItemHeader>
                  <ZoneItemSubtitle>
                   {`${locationData?.location_name} - ${
                        locationData?.location_name_short
                          ? `${locationData?.location_name_short}`
                          : ''
                      }  ${
                        locationData?.isSpecificLocation
                          ? ''
                          : `- ${locationData?.zone_city},`
                      } ${
                        locationData?.isSpecificLocation
                          ? ''
                          : `- ${locationData?.zone_state_short_name}`
                      }`}
                  </ZoneItemSubtitle>
                  <ZoneItemInfo>{numSwitches} switches</ZoneItemInfo>
                </ZoneItem>

                {/* Switches submenu - shown when zone is expanded */}
                {isExpanded && (
                  <SwitchesSubmenu>
                    <MasterControlButton
                      onClick={(e) => {
                        e.stopPropagation();
                        handleMasterControlClick(location);
                      }}
                      disabled={disabled}
                    >
                      ⚙ Master Control
                    </MasterControlButton>

                    {getSwitchesForZone(location, switchStatus, locations, swtName).map(
                      (switchData) => {
                        const isSelected =
                          selectedSwitch?.id === switchData.id &&
                          selectedSwitch?.location === switchData.location;
                        const locationInfo = switchData.isSpecificLocation
                          ? switchData.specificLocationData
                          : switchData.locationData;

                        return (
                          <SwitchSubmenuItem
                            key={`${switchData.location}-${switchData.id}`}
                            isSelected={isSelected}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSwitchClick(switchData);
                            }}
                          >
                            <SwitchItemTitle>Switch: {switchData.machine}</SwitchItemTitle>
                            {switchData.isSpecificLocation && (
                              <SwitchItemSubtitle>
                                {locationInfo?.location_name_short ||
                                  locationInfo?.specific_address}
                              </SwitchItemSubtitle>
                            )}
                          </SwitchSubmenuItem>
                        );
                      }
                    )}
                  </SwitchesSubmenu>
                )}
              </ZoneContainer>
            );
          })}
        </NavigationList>
      </NavigationColumn>

      {/* Right Column - Switch Details or Master Control */}
      <DetailsColumn>
        {showMasterControl && selectedZone ? (
          <>
            <ColumnHeader>
              <ColumnTitle>
                Master Control - {locations[swtName][selectedZone]?.location_name}
              </ColumnTitle>
            </ColumnHeader>
            <DetailsContent>
              <MasterControlByLocation
                location={selectedZone}
                swtName={swtName}
                buttonHandler={buttonHandler}
                disabled={disabled}
              />
            </DetailsContent>
          </>
        ) : selectedSwitch ? (
          <>
            <ColumnHeader>
              <ColumnTitle>Switch Details - {selectedSwitch.machine}</ColumnTitle>
            </ColumnHeader>
            <DetailsContent>
              <MasterControlByMachine
                systemType={swtName}
                location={selectedSwitch.location}
                machine={selectedSwitch.machine}
                indivLocationName={
                  selectedSwitch.isSpecificLocation
                    ? selectedSwitch.specificLocationData?.location_name_short
                    : selectedSwitch.locationData?.locationName
                }
              />
            </DetailsContent>
          </>
        ) : (
          <EmptyState>Select a switch to view details</EmptyState>
        )}
      </DetailsColumn>
    </TwoColumnWrapper>
  );
};

export default DesktopTwoColumnLayout;
