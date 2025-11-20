import moment from 'moment';
import { useMediaQuery } from 'react-responsive';
import styled, { css } from 'styled-components';
import {
import { useMCCommandStore, useSettingsOptionsStore } from '../zustand-stores';
  flexBoxCenter,
  justifyContentSpaceBetween,
} from '../styles/commonStyles';

import SystemOffMessageBox from '../userMessages/SystemOffMessageBox';
import FaultAddAction from './FaultAddAction';
import FaultsDetailButtonContainer from './FaultsDetailButtoncontainer';
import SelectForce from './SelectForce';

// import FaultsDetailButtonContainer from './FaultsDetailButtonContainer';

const FaultsDetails = ({ faultContents, column, name }) => {
  // media query
  const isMobile = useMediaQuery({ query: '(max-width:600px)' });

  const locations = useLocationsStore();
  const faultsState = useFaultsStore();

  const {
    faultType,
    number,
    locationPre,
    location,
    specificLocation,
    machine,
    address,
    date,
  } = faultContents;

  const isSpecification = specificLocation ? ` - ${specificLocation}` : '';

  let locationName = '';
  let machineName = '';
  if (specificLocation) {
    locationName = locations[name][location][specificLocation].locationName;
    machineName =
      locations[name][location][specificLocation].devices[machine].machineName;
  } else {
    locationName = locations[name][location].locationName;
    machineName = locations[name][location].devices[machine].machineName;
  }
  const mobileTitle = specificLocation
    ? `${locationName}-${specificLocation}-${machineName}`
    : `${locationName}-${machineName}`;
  // const mobileTitle = specificLocation
  //   ? `${location}-${specificLocation}-${machine}`
  //   : `${location}-${machine}`;

  const faultsData = specificLocation
    ? faultsState[name][location][specificLocation][machine]
    : faultsState[name][location][machine];

  const {
    displayForceSelectionBox,
    displaySystemTurnOffMessageBox,
    attendButtonClicked,
    actionTaken,
    receivedThermocoupleSetting,
  } = faultsData;

  const faultDate = date
    ? ` - ${date}`
    : faultType === 'thermocouple fault' && name !== 'tgs'
    ? ` - ${moment
        .unix(
          receivedThermocoupleSetting.find(
            (item) => item.tc_no === number[0] - 1
          )?.time
        )
        .format('h:mma - DD/MM/YYYY')}`
    : '';

  const title = `${faultType} ${number.length !== 0 && number} - ${locationPre}-
    ${locationName}${isSpecification} - ${machineName} - ${address}
    ${faultDate}`;

  
  const handleCloseSelectForceBox = () => {
    useSettingsOptionsStore().toggleDisplayForceSelectionBox({
        swtName: name,
        location,
        specificLocation,
        machine,
        state: false,
      });
  };

  const handleAddActions = (data) => {
    useFaultsStore().addActionTaken({
        swtName: name,
        location,
        specificLocation,
        machine,
        actionTaken: {
          userName: data[0],
          actionTaken: data[1],
          date: data[2],
        },
      });
  };

  const attendButtonHandler = () => {
    useMCCommandStore().setAttendButtonClick({
        swtName: name,
        location,
        specificLocation,
        machine,
        faultType: null,
        state: false,
      });
  };

  // attendButtonClicked.faultNumber === number[0] - 1 &&

  return (
    <>
      {isMobile ? (
        <Wrapper isMobile={isMobile}>
          <FaultsText isMobile={isMobile}>{mobileTitle}</FaultsText>

          <ButtonWrapper isMobile={isMobile}>
            <FaultsDetailButtonContainer
              name={name}
              location={location}
              specificLocation={specificLocation}
              machine={machine}
              faultType={faultType}
              faultNumber={number[0]}
              column={column}
            />
          </ButtonWrapper>

          {attendButtonClicked.status &&
            column === attendButtonClicked.column && (
              <PopUpBoxWrapper isMobile={isMobile}>
                <FaultAddAction
                  handleClose={attendButtonHandler}
                  faultType={faultType}
                  handleAddActions={handleAddActions}
                  actionTaken={actionTaken}
                  faultNumber={number[0] - 1}
                  locationPre={locationPre}
                  location={location}
                  specificLocation={specificLocation}
                  machine={machine}
                  address={address}
                  date={date}
                  deviceType={name}
                />
              </PopUpBoxWrapper>
            )}

          {/* this is for the confirm turn off selection  */}
          {/* {displaySystemTurnOffMessageBox && (
        <PopUpBoxWrapper>
          <SystemOffMessageBox
            onClose={() =>
              dispatch(
                handleDisplaySystemTurnOffMessageBox({
                  swtName: name,
                  location,
                  machine,
                  state: false,
                })
              )
            }
            title='system off'
            alert={true}
            message='SYSTEM OFF UNTIL RELEASE FAULT OR BY forcing the SYSTEM.'
          />
        </PopUpBoxWrapper>
      )} */}
        </Wrapper>
      ) : (
        <Wrapper isMobile={isMobile}>
          <FaultInfoWrapper>
            <FaultsText>{title}</FaultsText>
          </FaultInfoWrapper>
          <ButtonWrapper>
            <FaultsDetailButtonContainer
              name={name}
              location={location}
              specificLocation={specificLocation}
              machine={machine}
              faultType={faultType}
              faultNumber={number[0]}
              column={column}
            />
          </ButtonWrapper>
          {displayForceSelectionBox && (
            <PopUpBoxWrapper>
              <SelectForce
                title={faultType}
                handleClose={handleCloseSelectForceBox}
                location={location}
                specificLocation={specificLocation}
                machine={machine}
                swtName={name}
                faultType={faultType}
                faultId={number[0] - 1}
              />
            </PopUpBoxWrapper>
          )}

          {attendButtonClicked.status &&
            column === attendButtonClicked.column && (
              <PopUpBoxWrapper>
                <FaultAddAction
                  handleClose={attendButtonHandler}
                  faultType={faultType}
                  handleAddActions={handleAddActions}
                  actionTaken={actionTaken}
                  faultNumber={number[0] - 1}
                  locationPre={locationPre}
                  location={location}
                  specificLocation={specificLocation}
                  machine={machine}
                  address={address}
                  date={date}
                  deviceType={name}
                />
              </PopUpBoxWrapper>
            )}

          {/* this is for the confirm turn off selection  */}
          {/* {displaySystemTurnOffMessageBox && (
        <PopUpBoxWrapper>
          <SystemOffMessageBox
            onClose={() =>
              dispatch(
                handleDisplaySystemTurnOffMessageBox({
                  swtName: name,
                  location,
                  machine,
                  state: false,
                })
              )
            }
            title='system off'
            alert={true}
            message='SYSTEM OFF UNTIL RELEASE FAULT OR BY forcing the SYSTEM.'
          />
        </PopUpBoxWrapper>
      )} */}
        </Wrapper>
      )}
    </>
  );
};
export default FaultsDetails;

const Wrapper = styled.div`
  ${({ isMobile }) =>
    isMobile
      ? css`
          width: 299px;
          height: 32px;

          border: 1px solid #ff0000;
          border-radius: 16px;
          position: relative;
        `
      : css`
          width: 1181px;
          height: 34px;
          border-radius: 17px;
          border: 2px solid #ff0000;

          padding-right: 1.6px;
          padding-left: 8px;
          margin-bottom: 8px;

          &:last-child {
            margin-bottom: 0;
          }
        `}
  ${justifyContentSpaceBetween}
`;

const FaultInfoWrapper = styled.div`
  height: 100%;
  width: 69%;

  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
`;
const FaultsText = styled.span`
  ${({ isMobile }) =>
    isMobile
      ? css`
          max-height: 100%;
          margin-left: 6px;
          font-size: 12px;
          letter-spacing: 1.2px;
          color: #fe0000;

          overflow: hidden;
          /* white-space: nowrap; */
        `
      : css`
          text-align: left;
          font-size: 12px;
          color: #ff0000;
        `}
`;

const ButtonWrapper = styled.div`
  ${({ isMobile }) =>
    isMobile
      ? css`
          width: 31%;
          height: 28px;
        `
      : css`
          width: 31%;
        `}
`;

const PopUpBoxWrapper = styled.div`
  ${({ isMobile }) =>
    isMobile
      ? css`
          width: 332px;
          height: 144px;
          position: absolute;
          top: 0px;
          left: -17px;

          background-color: transparent;
          z-index: 100;

          display: flex;
          justify-content: center;
        `
      : css`
          width: 1100px;
          height: 600px;

          position: absolute;
          top: 0px;
          left: 128px;

          background-color: transparent;
          z-index: 100;

          display: flex;
          justify-content: center;
        `}
`;
