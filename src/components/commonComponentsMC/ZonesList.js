import { useState } from 'react';
import styled from 'styled-components';
import { flexDirectionColumn, layerA180Deg, layerB, layerC, layerBDark } from '../styles/commonStyles';

const ZonesList = ({ switchStatus, locations, swtName, machineNumber, onZoneClick }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredZones = Object.keys(switchStatus).filter((location) => {
    const locationData = locations[swtName][location];
    const locationName = (locationData?.location_name_short || locationData?.location_name || '').toLowerCase();
    const companyName = (locationData?.company_name || '').toLowerCase();
    const query = searchQuery.toLowerCase();

    return locationName.includes(query) || companyName.includes(query) || location.toLowerCase().includes(query);
  });

  return (
    <ZonesListContainer>
      <SearchContainer>
        <SearchIcon>🔍</SearchIcon>
        <SearchInput
          type="text"
          placeholder="Search zones..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        {searchQuery && (
          <ClearButton onClick={() => setSearchQuery('')}>✕</ClearButton>
        )}
      </SearchContainer>

      <ZonesScrollContainer>
        {filteredZones.length > 0 ? (
          filteredZones.map((location, index) => {
            const locationData = locations[swtName][location];
            const isSpecificLocation = switchStatus[location].isSpecificLocation;
            const numSpecLocations = isSpecificLocation && Object.keys(switchStatus[location].subLocations).length;
            const count = isSpecificLocation ? numSpecLocations : machineNumber[Object.keys(switchStatus).indexOf(location)];

            return (
              <ZoneItem
                key={location}
                onClick={() => onZoneClick(location)}
              >
                <ZoneItemTitle>
                    {`${locationData?.location_name} - ${
                        locationData?.location_name_short
                          ? `${locationData?.location_name_short}`
                          : ''
                      }  ${
                        isSpecificLocation
                          ? ''
                          : `- ${locationData?.zone_city},`
                      } ${
                        isSpecificLocation
                          ? ''
                          : `- ${locationData?.zone_state_short_name}`
                      } - ${
                        isSpecificLocation
                          ? numSpecLocations
                          : machineNumber[index]
                      } ${isSpecificLocation ? 's. loc' : 'switches'}`}                </ZoneItemTitle>
                <ZoneItemCount>
                  {count} {isSpecificLocation ? 'sub-loc' : 'sw'}
                </ZoneItemCount>
              </ZoneItem>
            );
          })
        ) : (
          <NoResultsText>No zones found</NoResultsText>
        )}
      </ZonesScrollContainer>
    </ZonesListContainer>
  );
};

export default ZonesList;

const ZonesListContainer = styled.div`
  ${flexDirectionColumn};
  gap: 8px;
  border-radius: 18px;
  width: 100%;
  ${layerC};
  padding: 8px;
  flex: 1;
`;

const SearchContainer = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  gap: 8px;
  border-radius: 10px;
  ${layerBDark};
  padding: 8px 12px;
  position: relative;
`;

const SearchIcon = styled.span`
  font-size: 14px;
  opacity: 0.6;
`;

const SearchInput = styled.input`
  flex: 1;
  background: transparent;
  border: none;
  outline: none;
  color: #fff;
  font-size: 11px;
  letter-spacing: 0.8px;

  &::placeholder {
    color: rgba(255, 255, 255, 0.5);
  }
`;

const ClearButton = styled.button`
  background: transparent;
  border: none;
  color: #fff;
  cursor: pointer;
  font-size: 14px;
  padding: 0;
  opacity: 0.6;
  transition: opacity 0.2s ease;

  &:hover {
    opacity: 1;
  }
`;

const ZonesScrollContainer = styled.div`
  ${flexDirectionColumn};
  gap: 6px;
  overflow-y: auto;
  flex: 1;
  width: 100%;
  /* Custom scrollbar styling */
  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.2);
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.2);
    border-radius: 3px;

    &:hover {
      background: rgba(255, 255, 255, 0.3);
    }
  }
`;

const NoResultsText = styled.div`
  text-align: center;
  padding: 20px;
  font-size: 11px;
  letter-spacing: 0.8px;
  color: rgba(255, 255, 255, 0.5);
`;

const ZoneItem = styled.div`
  border-radius: 12px;
  width : 100%;
  ${layerA180Deg};
  padding: 10px 12px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  transform-origin: left center;

  &:hover {
    ${layerB};
    transform: translateX(4px) scale(1.02);
    box-shadow: 0 4px 12px rgba(149, 255, 69, 0.2);
  }

  &:active {
    transform: translateX(2px) scale(0.98);
  }
`;

const ZoneItemTitle = styled.div`
  font-size: 11px;
  letter-spacing: 1px;
  color: #95ff45;
  margin-bottom: 3px;
  word-break: break-word;
`;

const ZoneItemCount = styled.div`
  font-size: 10px;
  letter-spacing: 0.8px;
  color: #fff;
  opacity: 0.7;
`;
