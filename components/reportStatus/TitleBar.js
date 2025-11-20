import { useState } from 'react';
import { useLocationsStore } from '../zustand-stores';
import styled, { css } from 'styled-components';
import {
  flexBoxCenter,
  justifyContentSpaceBetween,
  layerA180Deg,
  layerADark,
} from '../styles/commonStyles';
import MessageBox from '../userMessages/messageBox';
import ViewPlansButton from './ViewPlansButton';
import WeatherForecastButton from './WeatherForecastButton';

const TitleBar = ({
  location,
  handleCloseWeatherBox,
  specificLocationKey,
  expandSpecificLocations,
  expandButtonHandler,
  noSpecificLocation,
  machinesTotal,
}) => {
  const [displayViewSite, setDisplayViewSite] = useState(false);
  const [displayMessage, setDisplayMessage] = useState(false);

  const locations = useLocationsStore();
  const locationId = Object.keys(location)[0];
  
  let locationData;
  let machineNumber;
 if (specificLocationKey) {
  locationData = locations.specific[locationId]?.specific_location.find(
    (el) => el.zone_id === specificLocationKey
  );
  machineNumber = locationData?.devices?.length || 0;
} else {
  locationData = locations.specific[locationId];

  const locationTypes = ["ess", "tes", "tgs"];
  const existingTypes = locationTypes.filter(
    (type) => locations[type]?.[locationId]
  );
  const isInMultipleSystems = existingTypes.length > 1;

  if (isInMultipleSystems) {
    machineNumber = existingTypes.reduce((total, type) => {
      const systemLocation = locations[type]?.[locationId];
      if (systemLocation?.specific_location) {
        const specificDevicesCount = systemLocation.specific_location.reduce(
          (sum, el) => sum + (el.devices?.length || 0),
          0
        );
        return total + specificDevicesCount;
      }
      if (Array.isArray(systemLocation?.devices)) {
        return total + (systemLocation.devices?.length || 0);
      }
     if (systemLocation?.devices && typeof systemLocation.devices === "object") {
  const devicesArray = Object.values(systemLocation.devices);

  return total + devicesArray.length;
}
     

      return total;
    }, 0);
  } else {
   locationData = locations.specific[locationId];
    // const totalMachines = Object.values(locations)
    // .flat()  // Flatten the array of locations
    // .reduce((acc, location) => acc + location?.machines.length, 0);
    if (locationData?.specific_location) {
      machineNumber = locationData?.specific_location.flatMap(
        (el) => el.devices
      ).length;
    } else {
      machineNumber = Object.values(Object.values(location)[0]).flat().length;
    }
  }
}

  const locationName = locationData?.locationName;
  const specificLocationName = locationData?.specific_address;
  const sitePlanUrl = locationData
    ? locationData?.site_maps_ESS ||
      locationData?.site_maps_TGS ||
      locationData?.site_maps_TES
    : null;
const locationTypes = ["ess", "tes", "tgs"];
const existingTypes = locationTypes.filter((type) => locations[type]?.[locationId]);
const isInMultipleSystems = existingTypes.length > 1;
const allSpecificLocations = existingTypes.flatMap((type) => {
  const specific = locations[type]?.[locationId]?.specific_location;


  if (Array.isArray(specific)) return specific;

 
  if (specific && typeof specific === "object") return Object.values(specific);

  
  return [];
});

const totalSpecificCount = allSpecificLocations.length;


  const title = specificLocationKey
    ? `${specificLocationName} - ${machinesTotal} switches `
    : `${locationName} - ${machineNumber} switches `;

  const handleViewSitePlan = () => {
    if (sitePlanUrl) {
      setDisplayViewSite((prev) => !prev);
    } else {
      setDisplayMessage((prev) => !prev);
    }
  };

  return (
    <Wrapper>
      <Title isSpecificLocation={specificLocationKey}>{title}</Title>
      <WrapperButtons>
        <ButtonWrapper onClick={() => handleCloseWeatherBox(true)}>
          <WeatherForecastButton />
        </ButtonWrapper>
        <ButtonWrapper>
          <ViewPlansButton
            buttonHandler={handleViewSitePlan}
            title={'view plans'}
          />
        </ButtonWrapper>
        {!specificLocationKey && !noSpecificLocation && (
          <ButtonWrapper>
            <ViewPlansButton
              buttonHandler={() => expandButtonHandler(locationId)}
              title={expandSpecificLocations ? 'close' : 'expand'}
            />
          </ButtonWrapper>
        )}
      </WrapperButtons>
      {displayViewSite && (
        <PDFViewer>
          <button className='close-button' onClick={handleViewSitePlan}>
            X
          </button>
          <div className='view' />
          <embed src={sitePlanUrl} type='application/pdf' />
        </PDFViewer>
      )}
      {displayMessage && (
        <MessageBoxWrapper>
          <MessageBox
            onClose={() => setDisplayMessage(false)}
            title='view site plan'
            messages={['No site plan uploaded yet.']}
          />
        </MessageBoxWrapper>
      )}
    </Wrapper>
  );
};

export default TitleBar;

const Wrapper = styled.div`
  width: 100%;
  height: 100%;

  ${layerADark}

  border-radius: 16px;
  opacity: 1;
  ${justifyContentSpaceBetween}
`;

const Title = styled.span`
  width: fit-content;
  margin-left: 14rem;

  text-align: center;
  font-size: 14rem;
  letter-spacing: 1.4px;
  color: ${({ isSpecificLocation }) =>
    isSpecificLocation ? css`#ff920c` : css`#95ff45`};
  opacity: 1;
`;

const WrapperButtons = styled.div`
  ${flexBoxCenter}
  gap:8rem;
`;

const ButtonWrapper = styled.div`
  width: 100%;
  height: 100%;
`;

const PDFViewer = styled.div`
  width: 70vw;
  height: 80vh;
  position: fixed;
  top: 10vh;
  left: 15vw;
  border: 1px solid #ccc;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
  background-color: white;
  z-index: 999;

  border-radius: 24px;

  ${layerA180Deg};
  ${flexBoxCenter};
  overflow: hidden;

  embed {
    width: 100%;
    height: 100%;
  }

  .close-button {
    position: absolute;
    top: 8px;
    right: 55px;
    cursor: pointer;
    font-size: 18px;
    width: 40px;
    height: 40px;
    background-color: #323639ff;
    z-index: 999;
  }

  .view {
    position: absolute;
    top: 8px;
    right: 95px;
    width: 40px;
    height: 40px;
    background-color: #323639ff;
    z-index: 999;
  }
`;

const MessageBoxWrapper = styled.div`
  width: 120%;
  border-radius: 16px;

  display: flex;
  justify-content: center;

  margin-top: 8px;
  padding: 16px;

  position: absolute;
  top: -100px;
  right: 0px;
  z-index: 100;

  cursor: pointer;
`;
