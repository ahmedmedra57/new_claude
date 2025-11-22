import { useEffect } from 'react';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import styled, { css } from 'styled-components';
import { selectMC } from '../../store/slices/mCSlice';
import { selectedMachinesState } from '../../store/slices/selectedMachinesSlice';
import {
  alignItemsFlexStart,
  flexBoxCenter,
  justifyContentFlexEnd,
  justifyContentFlexStart,
  justifyContentSpaceBetween,
} from '../../styles/commonStyles';
import { selectLocations } from '../../store/slices/locationsSlice';
import MessageButton from './MessageButton';
import testData from '../../../test_data/testData';
import { selectEssSwitch } from '../../store/slices/essSwitchSlice';
import { selectTgsSwitch } from '../../store/slices/tgsSwitchSlice';

const SelectSystemApplyMessageBox = ({ handleButtons, title, message }) => {
  const buttonNames = ['edit', 'confirm'];
  // redux
  const mCState = useSelector(selectMC);
  const { ess, tgs } = mCState.selectSystem;
  const locations = useSelector(selectLocations);

  const selectedMachines = useSelector(selectedMachinesState);
  const { swt, selections } = selectedMachines.atsState;

  const [atsMessage, setAtsMessage] = useState('');

  useEffect(() => {
    switch (swt) {
      case 'ess':
        if (selections[1]) {
          setAtsMessage(
            'block and do not allow ess to operate when on ebp (emergency backup power)'
          );
        } else if (selections[0]) {
          setAtsMessage(
            'reactivates ess when powered by ebp (emergency backup power)'
          );
        }
        break;
      case 'tgs':
        if (selections[0]) {
          setAtsMessage(
            'reactive tgs (typhoon gas power heating system) when on ebp (emergency backup power) '
          );
        } else if (selections[1]) {
          setAtsMessage(
            'block and do not allow tgs to operate when on ebp (emergency backup power)'
          );
        }
        break;
      case 'tes':
        if (selections[0]) {
          setAtsMessage(
            'switch to tgs (typhoon gas powered heating system) when on (emergency backup power)'
          );
        } else if (selections[1]) {
          setAtsMessage(
            'reactivate tes when powered by ebp (emergency backup power)'
          );
        } else if (selections[2]) {
          setAtsMessage(
            'tes to remain off when powered by ebp (emergency backup power)'
          );
        }
        break;
      default:
        setAtsMessage('------------------------------------------');
        break;
    }
  }, [swt]);

  // !! TEST DATA!!
  // const { essSwitch: essState } = useSelector(selectEssSwitch);
  // const { tgsSwitch: tgsState } = useSelector(selectTgsSwitch);
  // const { testEssLocationsAll, testTgsLocationsAll } = testData(
  //   essState,
  //   tgsState,
  //   locations
  // );

  return (
    <Wrapper>
      <MessageOuter>
        <MessageInner>
          <HeaderWrapper>
            <HeaderTitle>{title}</HeaderTitle>
            <Logo src='/images/messagebox-logo.svg' />
          </HeaderWrapper>
          <SelectedWrapper>
            <SubTitleDescription>
              <P>selected system</P>
            </SubTitleDescription>
            <SystemTitle>
              <P>{message?.selectedSystem}</P>
            </SystemTitle>
          </SelectedWrapper>
          <LocationsMachinesWrapper>
            {message?.selectedLocationsAndMachines.map((el, idx) => {
              let verifyMachine = false;
              const location = Object.keys(el)[0];

              const locationValue = Object.values(el).map((value) => {
                const newValues = Object.values(value);
                verifyMachine = newValues.some((el) => el.machineType);

                return {
                  keys: Object.keys(value),
                  values: newValues,
                };
              })[0];

              return (
                <LocationWrapper key={idx}>
                  {verifyMachine ? (
                    <>
                      <Location>
                        {locations.all[location].locationName ??
                          'location name'}
                      </Location>
                      {locationValue.keys.map((machine, index) => {
                        return (
                          <Machine key={index * 98}>
                            {
                              locations.all[location]?.devices[machine]
                                ?.machineName
                            }
                            ,{' '}
                          </Machine>
                        );
                      })}
                    </>
                  ) : (
                    <>
                      <Location>
                        {locations.all[location][locationValue.keys[0]]
                          .locationName ?? 'location name'}
                      </Location>
                      {locationValue.keys.map((specificLocation, idx) => {
                        return (
                          <div key={specificLocation}>
                            <SpecificLocation>
                              {locations.all[location][specificLocation]
                                .specificLocationName ?? 'specific location'}
                            </SpecificLocation>
                            {Object.keys(locationValue.values[idx]).map(
                              (machine) => {
                                return (
                                  <Machine key={machine}>
                                    {
                                      locations.all[location][specificLocation]
                                        ?.devices[machine]?.machineName
                                    }
                                    ,{' '}
                                  </Machine>
                                );
                              }
                            )}
                          </div>
                        );
                      })}
                    </>
                  )}
                </LocationWrapper>
              );

              {
                /* TEST TODO: ESS */
              }
              {
                /* return (
                <LocationWrapper key={idx}>
                  {verifyMachine ? (
                    <>
                      <Location>
                        {testEssLocationsAll[location].locationName ??
                          'location name'}
                      </Location>
                      {locationValue.keys.map((machine, index) => {
                        return (
                          <Machine key={index * 98}>
                            {
                              testEssLocationsAll[location]?.devices[machine]
                                ?.machineName
                            }
                            ,{' '}
                          </Machine>
                        );
                      })}
                    </>
                  ) : (
                    <>
                      <Location>
                        {testEssLocationsAll[location][locationValue.keys[0]]
                          .locationName ?? 'location name'}
                      </Location>
                      {locationValue.keys.map((specificLocation, idx) => {
                        return (
                          <div key={specificLocation}>
                            <SpecificLocation>
                              {testEssLocationsAll[location][specificLocation]
                                .specificLocationName ?? 'specific location'}
                            </SpecificLocation>
                            {Object.keys(locationValue.values[idx]).map(
                              (machine) => {
                                return (
                                  <Machine key={machine}>
                                    {
                                      testEssLocationsAll[location][
                                        specificLocation
                                      ]?.devices[machine]?.machineName
                                    }
                                    ,{' '}
                                  </Machine>
                                );
                              }
                            )}
                          </div>
                        );
                      })}
                    </>
                  )}
                </LocationWrapper>
              ); */
              }
              {
                /* TODO: TEST TGS DATA */
              }
              {
                /* return (
                <LocationWrapper key={idx}>
                  {verifyMachine ? (
                    <>
                      <Location>
                        {testTgsLocationsAll[location].locationName ??
                          'location name'}
                      </Location>
                      {locationValue.keys.map((machine, index) => {
                        return (
                          <Machine key={index * 98}>
                            {
                              testTgsLocationsAll[location]?.devices[machine]
                                ?.machineName
                            }
                            ,{' '}
                          </Machine>
                        );
                      })}
                    </>
                  ) : (
                    <>
                      <Location>
                        {testTgsLocationsAll[location][locationValue.keys[0]]
                          .locationName ?? 'location name'}
                      </Location>
                      {locationValue.keys.map((specificLocation, idx) => {
                        return (
                          <div key={specificLocation}>
                            <SpecificLocation>
                              {testTgsLocationsAll[location][specificLocation]
                                .specificLocationName ?? 'specific location'}
                            </SpecificLocation>
                            {Object.keys(locationValue.values[idx]).map(
                              (machine) => {
                                return (
                                  <Machine key={machine}>
                                    {
                                      testTgsLocationsAll[location][
                                        specificLocation
                                      ]?.devices[machine]?.machineName
                                    }
                                    ,{' '}
                                  </Machine>
                                );
                              }
                            )}
                          </div>
                        );
                      })}
                    </>
                  )}
                </LocationWrapper>
              ); */
              }

              {
                /* TEST Above */
              }
            })}
          </LocationsMachinesWrapper>
          <TransferAndHeatingWrapper>
            <TransferSystemWrapper>
              <P>select automatic transfer system</P>
            </TransferSystemWrapper>
            <P atsColor={true}>{atsMessage}</P>
            <HeatingProgramWrapper>
              <P>selected heating program</P>
            </HeatingProgramWrapper>
            <ParametersWrapper>
              <P>parameters</P>
            </ParametersWrapper>
          </TransferAndHeatingWrapper>
          <MessageWrapper>
            {message.title?.map((value, index) => {
              const scheduler = value.title === 'heating schedule program';

              const splitTime =
                scheduler &&
                value.scheduleDates &&
                value.scheduleDates.split('-');

              return (
                <MapDiv key={index} isHeatingScheduler={true}>
                  <SubDiv isHeatingScheduler={true}>
                    <MessageTitle>
                      {ess
                        ? 'ess' + ' ' + value.title
                        : tgs
                        ? 'tgs' + ' ' + value.title
                        : 'tes' + ' ' + value.title}
                    </MessageTitle>
                    <MessageTitle>{value.state}</MessageTitle>
                  </SubDiv>

                  <ScheduleTimeWrapper>
                    <ScheduleTime isStartTime={true}>
                      {splitTime[0]}
                    </ScheduleTime>
                    <ScheduleTime>{splitTime[1]}</ScheduleTime>
                  </ScheduleTimeWrapper>
                </MapDiv>
              );
            })}
          </MessageWrapper>

          <ConfirmMessageWrapper>
            {' '}
            <MessageDescription>{message.content}</MessageDescription>
          </ConfirmMessageWrapper>

          <ButtonWrapper>
            {buttonNames.map((buttonName, idx) => {
              return (
                <div key={idx}>
                  <MessageButton
                    name={buttonName}
                    buttonHandler={handleButtons}
                    index={idx}
                  />
                </div>
              );
            })}
          </ButtonWrapper>
        </MessageInner>
      </MessageOuter>
    </Wrapper>
  );
};

export default SelectSystemApplyMessageBox;

const Wrapper = styled.div`
  width: 1006px;
  height: 674px;

  background-color: rgba(0, 0, 0, 0.2);
  z-index: 10000;
  ${justifyContentFlexStart};
`;

const MessageOuter = styled.div`
  width: 542px;
  height: auto;
  margin-left: 80px;
  padding-top: 11px;
  padding-bottom: 11px;
  background: transparent linear-gradient(180deg, #77777742 0%, #c2c2c224 100%)
    0% 0% no-repeat padding-box;
  box-shadow: inset 0px 1px 1px #ffffff24, 0px 0px 6px #000000;
  border: 0.5px solid #000000;

  border-radius: 14px;
  ${flexBoxCenter}
`;
const MessageInner = styled.div`
  width: 524px;
  height: auto;

  /* padding-top: 11px;
  padding-bottom: 11px; */
  background: #1b2b44 0% 0% no-repeat padding-box;
  box-shadow: inset 0px 0px 3px #000000;
  border: 0.5px solid #000000;
  border-radius: 9px;
  /* 
  padding: var(--space2); */

  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
`;
const HeaderWrapper = styled.div`
  width: 98%;
  margin-top: 2px;
  border-bottom: 1px solid #fff;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 15%;
`;

const HeaderTitle = styled.span`
  font-size: 12px;
`;

const Logo = styled.img`
  width: 15px;
  height: 15px;
  margin-bottom: 1px;
`;

const SelectedWrapper = styled.div``;

const SubTitleDescription = styled.div`
  width: 512px;
  border-bottom: 1px solid #ffffff;
  ${justifyContentFlexStart}
`;

const P = styled.p`
  &:last-child {
    margin-top: 2px;
  }
  margin-bottom: 2px;
  text-align: center;
  font-size: 10px;
  letter-spacing: 1px;
  color: #ffffff;

  ${({ atsColor }) =>
    atsColor &&
    css`
      color: #95ff45;
      margin-top: 8px;
      margin-bottom: 8px;
    `}
`;

const SystemTitle = styled.div`
  width: 512px;
  border-bottom: 1px solid #ffffff;
  ${justifyContentFlexEnd}
`;

const LocationsMachinesWrapper = styled.div`
  width: 512px;
  ${alignItemsFlexStart}
  flex-direction: column;
`;

const LocationWrapper = styled.div`
  margin-top: 6px;
  &:last-child {
    margin-bottom: 6px;
  }
`;

const Location = styled.p`
  width: fit-content;
  text-align: center;
  font-size: 12px;
  letter-spacing: 1px;
  color: #95ff45;
  opacity: 1;
  border-bottom: 1px solid #95ff45;
`;

const SpecificLocation = styled.p`
  width: fit-content;
  text-align: center;
  font-size: 11px;
  letter-spacing: 1px;
  color: #ff920c;
  opacity: 1;
  border-bottom: 1px solid #ff920c;
`;

const Machine = styled.span`
  height: fit-content;
  width: auto;
  text-align: center;
  font-size: 10px;
  letter-spacing: 1px;
  color: #fcff01;
  opacity: 1;
`;

const TransferAndHeatingWrapper = styled.div``;

const TransferSystemWrapper = styled.div`
  width: 512px;
  border-bottom: 1px solid #ffffff;
  ${justifyContentSpaceBetween}
`;

const HeatingProgramWrapper = styled.div`
  width: 512px;
  border-bottom: 1px solid #ffffff;
  ${justifyContentFlexStart}
`;

const ParametersWrapper = styled.div`
  width: 512px;

  ${justifyContentFlexEnd}
`;

const MessageWrapper = styled.div`
  width: 98%;
  height: auto;
  margin-top: 8px;

  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
`;
const MapDiv = styled.div`
  width: 100%;
  height: 100%;

  ${flexBoxCenter};
  flex-direction: column;

  /* ${justifyContentSpaceBetween} */
  /* ${({ isHeatingScheduler }) =>
    isHeatingScheduler &&
    css`
      ${flexBoxCenter}flex-direction:column;
    `} */
`;

const SubDiv = styled.div`
  width: 100%;

  ${justifyContentSpaceBetween}
`;

const MessageTitle = styled.p`
  font-size: 12px;
  text-align: center;
  color: #95ff45;
`;

const ScheduleTimeWrapper = styled.div`
  width: 100%;

  ${justifyContentSpaceBetween}
`;

const ScheduleTime = styled.span`
  width: fit-content;
  font-size: 12px;
  text-align: center;
  color: #95ff45;
  display: inline-block;
  position: relative;

  ${({ isStartTime }) =>
    isStartTime &&
    css`
      &::after {
        content: '';
        position: absolute;
        top: 50%; /* aligns the line with the vertical middle of the text */
        left: 100%; /* positions the line just after the text */
        width: 122%; /* length of the line */
        margin-left: 10px;
        border-bottom: 1px solid #95ff45;
      }
    `}
`;

const ConfirmMessageWrapper = styled.div`
  width: 100%;
  height: auto;
  margin-bottom: 20px;
  ${flexBoxCenter}
`;

const MessageDescription = styled.p`
  font-size: 12px;
  margin-top: 12px;
  text-align: center;
`;

const ButtonWrapper = styled.div`
  width: 98%;
  margin-bottom: 5px;
  display: flex;
  justify-content: flex-end;
  gap: 6px;
`;
