import { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import styled, { css } from 'styled-components';
import { useTranslation } from 'react-i18next';
import { selectUnits } from '../../../store/slices/settings/unitsSlice';
import { selectTelemetry } from '../../../store/slices/telemetrySlice';
import {
  borderBlue,
  flexBoxCenter,
  justifyContentFlexStart,
  justifyContentSpaceBetween,
  layerADark,
  layerBDark,
} from '../../../styles/commonStyles';
import SelectedSwitch from './SelectedSwitch';
import { selectLocations } from '../../../store/slices/locationsSlice';
import SelectedSpecificLocation from './SelectedSpecificLocation';

const SwitchSpecification = ({
  systemSwitches,
  isExpand,
  src,
  system,
  handleExpand,
  inputSearch,
  handleClearSearch,
  setSelectedLocations,
  selectedLocations,
  specificLocationsOpeningControl,
  setSpecificLocationsOpeningControl,
  totalDataConsumpOrEnergyConsump,
  setTotalDataConsumpOrEnergyConsump,
  totalUsageHours,
  setTotalUsageHours,
  totalNumOfSwt,
  setTotalNumOfSwt,
  swtName,
  telemetryData,
  isDataChanged,
  isDc,
  searchedSwtName,
  setSearchedSwtName,
  setIsExpand,
}) => {
  const { t } = useTranslation();
  const telemetryState = useSelector(selectTelemetry);
  const isSearch = telemetryState.isSearch;
  const settingsUnitsState = useSelector(selectUnits);
  const { isF } = settingsUnitsState;
  const locations = useSelector(selectLocations);

  const energySign =
    systemSwitches &&
    (systemSwitches[0][5] === 'ess' || systemSwitches[0][5] === 'tes'
      ? 'kw'
      : systemSwitches[0][5] === 'tgs'
      ? isF
        ? 'ft³'
        : 'm³'
      : 'mb');
  const expandSpecificLocationHandler = useCallback(
    (locationIdx, specificLocationIdx) => {
      const copyIsExpand = [...specificLocationsOpeningControl];
      if (copyIsExpand[locationIdx][specificLocationIdx]) {
        copyIsExpand[locationIdx][specificLocationIdx] = false;
        setSpecificLocationsOpeningControl(copyIsExpand);
      } else {
        copyIsExpand[locationIdx][specificLocationIdx] = true;
        setSpecificLocationsOpeningControl(copyIsExpand);
      }
      setSearchedSwtName('');
    },
    [
      specificLocationsOpeningControl,
      setSpecificLocationsOpeningControl,
      setSearchedSwtName,
    ]
  );

  const findConsumptionValue = (machine, totalConsumption) => {
    return Number(
      telemetryData?.find((el) => el.machine === machine)?.[totalConsumption]
    );
  };

  useEffect(() => {
    if (system) {
      const copyTotalDataConsumpOrEnergyConsump = [
        ...totalDataConsumpOrEnergyConsump,
      ];
      const copyTotalUsageHours = [...totalUsageHours];
      const copySelectedLocations = [...selectedLocations];
      const copyTotalNumOfSwt = [...totalNumOfSwt];

      Object.values(system)?.forEach((machine, index) => {
        // check each location if at least one machine is selected at the location and return true if its so else return false

        const machineArr = Object.values(machine);

        const checkedMachines = machineArr.some(
          (machineValues) => machineValues?.isSelected
        );

        const checkedSpecificLocationMachines = machineArr.some((el) =>
          Object.values(el).some((machineValues) => machineValues?.isSelected)
        );

        if (checkedMachines) {
          copySelectedLocations[index] = true;
        } else if (checkedSpecificLocationMachines) {
          copySelectedLocations[index] = true;
        }

        // machineArr.forEach((machineValues) => {
        //   if (!machineValues?.isSelected) {
        //     Object.values(machineValues).forEach((value, idx) => {
        //       if (value?.isSelected) {
        //         specificLocationsOpeningControl[index][idx] = true;
        //       }
        //     });
        //   }
        // });

        // for set usage hours and data or energy consumption of  selected machines
        let sumOfDataConsumpOrEnergyConsump = 0;
        let sumOfUsageHours = 0;
        let sumOfNumOfSwt = 0;
        machineArr.forEach((machineValues) => {
          const totalConsumption = 'totalConsumption';
          const totalUsageHours = 'totalUsageHours';
          if (machineValues.isSelected) {
            const machineKey = machineValues?.deviceMac;
            sumOfDataConsumpOrEnergyConsump += findConsumptionValue(
              machineKey,
              totalConsumption
            );
            sumOfUsageHours += findConsumptionValue(
              machineKey,
              totalUsageHours
            );
            sumOfNumOfSwt++;
          } else if (Object.keys(machineValues).length > 0) {
            // check if the machine(s) is in the specific location
            if (Object.values(machineValues).filter((el) => el?.isSelected)) {
              Object.values(machineValues).forEach((elData) => {
                // extract hours usage and energy consumption from each machine
                const machineKey = elData?.deviceMac;
                sumOfDataConsumpOrEnergyConsump += findConsumptionValue(
                  machineKey,
                  totalConsumption
                );
                sumOfUsageHours += findConsumptionValue(
                  machineKey,
                  totalUsageHours
                );
                sumOfNumOfSwt++;
              });
            }
          }
        });
        copyTotalDataConsumpOrEnergyConsump[index] =
          sumOfDataConsumpOrEnergyConsump;
        copyTotalUsageHours[index] = sumOfUsageHours;
        copyTotalNumOfSwt[index] = sumOfNumOfSwt;
      });
      // setTotalNumOfSwt(numOfSwt)
      setSelectedLocations(copySelectedLocations);
      setTotalDataConsumpOrEnergyConsump(copyTotalDataConsumpOrEnergyConsump);
      setTotalUsageHours(copyTotalUsageHours);
      setTotalNumOfSwt(copyTotalNumOfSwt);
    }
  }, [system, telemetryData, isDataChanged]);

  const verificationOfDataConsump =
    systemSwitches &&
    (systemSwitches[0][5] === 'essDc' ||
      systemSwitches[0][5] === 'tgsDc' ||
      systemSwitches[0][5] === 'tesDc' ||
      systemSwitches[0][5] === 'hpDc');

  return (
    <Wrapper>
      {isSearch && !isDc && systemSwitches
        ? systemSwitches[0][4]?.map((location, index) => {
            if (selectedLocations[index]) {
              const locationName =
                locations[
                  swtName === 'tgs/tes' ? swtName.slice(0, 3) : swtName
                ][location]?.locationName;

              return (
                <FlexWrapper key={location}>
                  <IndentTitle>
                    <TitleWrapper>
                      <Title>
                        {t('telemetry.switchSpecification.title')}
                      </Title>

                      <Title>
                        {t('telemetry.usageHours')}
                      </Title>

                      <Title>
                        {verificationOfDataConsump ? (
                          <>
                            {t('telemetry.dataConsumption')}
                          </>
                        ) : swtName === 'tgs' ? (
                          <>
                            {t('telemetry.gasConsumption')}
                          </>
                        ) : (
                          <>
                            {t('telemetry.energyConsumption')}
                          </>
                        )}
                      </Title>
                    </TitleWrapper>
                  </IndentTitle>
                  <LocationWrapper>
                    <LocationWrapper1>
                      <LocationWrapper2>
                        <FlexDiv>
                          <ImgLocationWrapper>
                            <Img
                              src={src[index]}
                              // onClick={() => {
                              //   return handleExpand(index), handleClearSearch();
                              // }}
                              onClick={() => handleExpand(index)}
                            />
                            <P1>{locationName}</P1>
                          </ImgLocationWrapper>
                          <Info isSwitches={true}>
                            {totalNumOfSwt[index]} {t('telemetry.switches')}
                          </Info>
                          <Info isHours={true}>
                            {totalUsageHours[index] ? totalUsageHours[index] : '-' } Hrs
                          </Info>
                          <Info isConsumption={true}>
                            {totalDataConsumpOrEnergyConsump[index] ? totalDataConsumpOrEnergyConsump[index] : '-'}{' '}
                            {energySign}
                          </Info>
                        </FlexDiv>
                      </LocationWrapper2>
                      {isExpand[index] &&
                        Object.entries(system[location]).map(
                          ([key, value], idx) => {
                            if (value.isSelected) {
                              return (
                                <SelectedSwitch
                                  key={idx}
                                  switchData={`${value.locationName} - ${value.machineName}`}
                                  energySymbol={energySign}
                                  machineValues={value}
                                  telemetryData={telemetryData}
                                />
                              );
                            } else {
                              return (
                                <SelectedSpecificLocation
                                  key={idx}
                                  locationIdx={index}
                                  specificLocationIdx={idx}
                                  specificLocationValues={Object.values(value)}
                                  energySymbol={energySign}
                                  telemetryData={telemetryData}
                                  specificLocationsOpeningControl={
                                    specificLocationsOpeningControl
                                  }
                                  expandSpecificLocationHandler={
                                    expandSpecificLocationHandler
                                  }
                                />
                              );
                            }
                          }
                        )}

                      {/* if selected from the search box */}
                      {searchedSwtName[0]?.slice(
                        0,
                        searchedSwtName[0].indexOf(' - ')
                      ) === location &&
                        !isExpand[index] &&
                        Object.entries(
                          system[searchedSwtName[0]?.split(' - ')[0]] || {}
                        ).map(([machine, value], idx) => {
                          if (
                            machine ===
                            searchedSwtName[0].split(' - ').reverse()[0]
                          ) {
                            return (
                              <SelectedSwitch
                                key={idx}
                                switchData={`${value.locationName} - ${value.machineName}`}
                                energySymbol={energySign}
                                machineValues={value}
                                telemetryData={telemetryData}
                              />
                            );
                          } else {
                            return (
                              <SelectedSpecificLocation
                                key={idx}
                                locationIdx={index}
                                specificLocationIdx={idx}
                                specificLocationValues={Object.values(value)}
                                energySymbol={energySign}
                                telemetryData={telemetryData}
                                specificLocationsOpeningControl={
                                  specificLocationsOpeningControl
                                }
                                expandSpecificLocationHandler={
                                  expandSpecificLocationHandler
                                }
                                isSearched={true}
                              />
                            );
                          }
                        })}
                      {/* {searchedSwtName[0]?.slice(
                        0,
                        searchedSwtName[0].lastIndexOf(' - ')
                      ) === location &&
                        !isExpand[index] &&
                        Object.entries(
                          system[searchedSwtName[0]?.split(' - ')[0]] || {}
                        ).map(([machine, value], index) => {
                          if (
                            machine ===
                            searchedSwtName[0].split(' - ').reverse()[0]
                          ) {
                            return (
                              <SelectedSwitch
                                key={index}
                                switchData={`${value.locationName} - ${value.machineName}`}
                                energySymbol={energySign}
                                machineValues={value}
                                telemetryData={telemetryData}
                              />
                            );
                          }
                        })} */}
                    </LocationWrapper1>
                  </LocationWrapper>
                </FlexWrapper>
              );
            }
          })
        : [' ', ' ']?.map((_, index) => {
            return (
              <FlexWrapper key={index}>
                <IndentTitle>
                  <TitleWrapper>
                    <Title>
                      {t('telemetry.switchSpecification.title')}
                    </Title>
                    <Title>
                      {t('telemetry.usageHours')}
                    </Title>
                    <Title>
                      {verificationOfDataConsump ? (
                        <>
                          {t('telemetry.dataConsumption')}
                        </>
                      ) : swtName === 'tgs' ? (
                        <>
                          {t('telemetry.gasConsumption')}
                        </>
                      ) : (
                        <>
                          {t('telemetry.energyConsumption')}
                        </>
                      )}
                    </Title>
                  </TitleWrapper>
                </IndentTitle>
              </FlexWrapper>
            );
          })}
    </Wrapper>
  );
};

export default SwitchSpecification;

const Wrapper = styled.div`
  width: 1198px;
  height: auto;
  margin-top: 8px;
  margin-bottom: 8px;

  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  gap: 6px;
  flex-direction: row;
  flex-wrap: wrap;
`;

const FlexWrapper = styled.div`
  ${flexBoxCenter}
  flex-direction: column;
  flex-wrap: wrap;
`;

const IndentTitle = styled.div`
  width: 592px;
  height: 27px;
  margin-bottom: 4px;

  ${layerADark}

  border-radius: 14px;
  opacity: 1;
  ${flexBoxCenter}
`;

const TitleWrapper = styled.div`
  width: 571px;
  height: auto;

  border-bottom: 1px solid #ffff;
  ${justifyContentSpaceBetween}
`;

const Title = styled.span`
  &:nth-child(2) {
    margin-right: 53px;
  }
  text-align: left;
  font-size: 8px;
  letter-spacing: 0.8px;
  color: #ffffff;
  opacity: 1;
  margin-right: 8px;
  &:nth-child(2) {
    margin-left: 230px;
  }
`;

const LocationWrapper = styled.div`
  width: 592px;
  height: auto;

  ${layerBDark}

  border-radius: 16px;
  opacity: 1;

  ${flexBoxCenter}
`;

const LocationWrapper1 = styled.div`
  width: 590px;
  height: auto;

  ${borderBlue}

  border-radius: 15px;
  opacity: 1;
  ${flexBoxCenter};
  flex-direction: column;
`;

const LocationWrapper2 = styled.div`
  width: 99.4%;
  height: 26px;
  margin-top: 2px;
  margin-bottom: 2px;

  ${borderBlue}

  border-radius: 14px;
  ${flexBoxCenter}
`;

const FlexDiv = styled.div`
  width: 99%;
  height: 100%;
  ${justifyContentSpaceBetween};
  position: relative;
`;

const ImgLocationWrapper = styled.div`
  width: fit-content;
  ${justifyContentSpaceBetween}
`;

const Img = styled.img`
  margin-left: 8px;
  margin-right: 4px;
  cursor: pointer;
`;

const P1 = styled.span`
  width: fit-content;
  text-align: left;
  font-size: 9px;
  letter-spacing: 0.9px;
  color: #ffffff;
  opacity: 1;
`;

const Info = styled.span`
  font-size: 9px;
  width: fit-content;

  position: absolute;
  ${({ isConsumption, isHours }) =>
    isConsumption
      ? css`
          top: 7px;
          left: 88%;
        `
      : isHours
      ? css`
          top: 7px;
          left: 62%;
        `
      : css`
          top: 7px;
          left: 34%;
        `}
`;
