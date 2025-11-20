import { useEffect, useMemo, useState } from "react";
import { useESSSwitchStore, useLocationsStore, useTESSwitchStore, useTGSSwitchStore, useUserStore } from '../zustand-stores';
import { useTranslation } from 'react-i18next';

import ScheduleCalendar from "../masterControl/controls/heatingScheduler/ScheduleCalendar";

import {
  flexBoxCenter,
  flexDirectionColumn,
  justifyContentFlexStart,
  justifyContentSpaceBetween,
  layerA180Deg,
  layerA90Deg,
  layerADark,
  layerB,
  layerBDark,
  layerC,
} from "../styles/commonStyles";
import styled, { css } from "styled-components";

import MessageBox from "../userMessages/messageBox";
import SelectByName from "./SelectByName";
import SelectByOption from "./SelectByOption";
import SelectByLocation from "./SelectedByLocation";

// import { DUMMY_SWITCHES, DUMMY_LOCATIONS } from '../DUMMY/DUMMY_LOCATION_INFO';
import testData from "../../test_data/testData";

const ATMainSelect = ({ handleSelection, setDisableSettings }) => {
  const { t } = useTranslation();
  const [openSelectBox, setOpenSelectBox] = useState([false, false]);
  const [openDateSelect, setOpenDateSelect] = useState(false);

  //redux
  const locations = useLocationsStore();
  const { specific: allLocations } = locations;
  // console.log(allLocations, "ATMainSelect");

  const userInfo = useUserStore();
  const { allUsers } = userInfo;

  // !!TEST DATA
  // const { essSwitch } = useESSSwitchStore();
  // const { tesSwitch } = useTESSwitchStore();
  // const { tgsSwitch } = useTGSSwitchStore();
  // const { testAllLocations } = testData(
  //   essSwitch,
  //   tgsSwitch,
  //   locations,
  //   tesSwitch
  // );
  // console.log('testAllLocations:', testAllLocations.all);
  // console.log('testTesSwitch:', testTesSwitch);
  // console.log('testTgsSwitch', testTgsSwitch);
  // console.log('testEssSwitch', testEssSwitch);

  // const specificLocationsStates = Object.values(testAllLocations.all).map(
  //   (value) => {
  //     if (value?.zoneId) {
  //       return [];
  //     } else {
  //       console.log('value:', value);
  //       return Object.keys(value).map((_) => false);
  //     }
  //   }
  // );

  // console.log('specificLocationsOpenState:', specificLocationsStates);

  // !! END OF TEST DATA

  // first (name or location) selection
  const [isSelected, setIsSelected] = useState([false, false]);

  // user name selection
  const [isNameSelected, setIsNameSelected] = useState([]);
  const [selectedNames, setSelectedNames] = useState([]);
  // Location selection
  const [isAllSelected, setIsAllSelected] = useState(false);

  const [selectedOneA, setSelectedOneA] = useState(null);
  const [selectedOneB, setSelectedOneB] = useState(null);

  const [openMessageBox, setOpenMessageBox] = useState(false);

  const allLocationsKeys = useMemo(
    () => Object.keys(allLocations),
    [allLocations]
  );

  const allSpecificLocations = useMemo(() => {
    // specificLocationsKey = [locationKey,specificLocationKey]
    const specificLocationsKeys = [];
    for (const locationKey in allLocations) {
      const newArray = [];
      if (!allLocations[locationKey]?.zoneId) {
        for (const specificKey in allLocations[locationKey]) {
          newArray.push([locationKey, specificKey]);
        }
        specificLocationsKeys.push(newArray);
      } else specificLocationsKeys.push([]);
    }
    return specificLocationsKeys;
  }, [allLocations]);

  const locationsSpecificLocationsMachinesKeys = useMemo(() => {
    const transformedObject = {};

    for (const key in allLocations) {
      if (allLocations.hasOwnProperty(key)) {
        if (!allLocations[key]?.is_parent_location) {
          const devices = allLocations[key].devices;
          transformedObject[key] = Object.keys(devices);
        } else {
          transformedObject[key] = {};
          allLocations[key].specific_location.forEach((specificLocation) => {
            const devices = specificLocation.devices;
            // console.log("specificLocationsWithLocationsKeys", devices);
            transformedObject[key][specificLocation.zone_id] = devices;
          });
          // for (const accessMachinesKey in allLocations[key].specific_location) {
          //   console.log('specificLocationsWithLocationsKeys', accessMachinesKey);
          //   // const devices = allLocations[key].specific_location[accessMachinesKey].devices;
          //   // transformedObject[key].specific_location[accessMachinesKey] = Object.keys(devices);
          // }
        }
      }
    }
    return transformedObject;
  }, [allLocations]);

  const setLocationInitStateHandler = useMemo(() => {
    return () => allLocationsKeys.map((_) => false);
  }, [allLocations]);

  const setSpecificLocationInitStateHandler = useMemo(() => {
    return () =>
      Object.values(allLocations).map((value) => {
        // console.log(`value`, value);
        if (!value?.is_parent_location) {
          return [];
        } else {
          return Object.keys(value.specific_location).map((_) => false);
        }
      });
  }, [allLocations]);

  const setMachineInitStateHandler = useMemo(() => {
    return () =>
      allLocationsKeys.map((location) => {
        const locationData = locationsSpecificLocationsMachinesKeys[location];
        if (
          typeof locationData === "object" &&
          !Array.isArray(locationData) &&
          locationData !== null
        ) {
          return Object.keys(locationData).map((specificLocation) =>
            locationData[specificLocation].map((_) => false)
          );
        } else {
          return locationData.map((_) => false);
        }
      });
  }, [allLocationsKeys, locationsSpecificLocationsMachinesKeys]);

  const [dates, setDates] = useState({
    start: { date: null, time: null },
    end: { date: null, time: null },
  });

  const selectOption = [t('auditTrail.options.userName'), t('auditTrail.options.location')];

  // date format logic
  // ** deconstruction
  const { start, end } = dates;
  const displayStart =
    start.date !== null
      ? `${start.time.hour} : ${start.time.minute} ${
          start.time.division
        } - ${start.date.getDate()} / ${
          start.date.getMonth() + 1
        } / ${start.date.getFullYear()} `
      : " -----------------";

  const displayEnd =
    end.date !== null
      ? `${end.time.hour} : ${end.time.minute} ${
          end.time.division
        } - ${end.date.getDate()} / ${
          end.date.getMonth() + 1
        } / ${end.date.getFullYear()} `
      : " -----------------";

  useEffect(() => {
    // for names
    const initialNameSelection = allUsers.map((option) => false);
    setIsNameSelected(initialNameSelection);

    // for locations
    // const initialLocationSelection = allLocationsKeys.map((option) => false);
    // setIsLocationSelected(initialLocationSelection);

    // for Machines
  }, [allLocationsKeys, allUsers]);

  // ↓↓↓ --- selects handlers --- ↓↓↓
  const handleOpenSelectBox = (btn) => {
    if (openSelectBox[btn]) {
      setOpenSelectBox([false, false]);
    } else {
      if (btn === 0) {
        setOpenSelectBox([true, false]);
      } else {
        setOpenSelectBox([false, true]);
      }
    }
  };

  // First option handler name || location
  const handle1stSelect = () => {
    if (isSelected[0]) {
      setSelectedOneA(selectOption[0]);
      setDisableSettings(false);
    } else if (isSelected[1]) {
      setSelectedOneA(selectOption[1]);
      setDisableSettings(true);
    }
    handleInitializeSelections();
  };

  const handleInitializeSelections = () => {
    setSelectedOneB(null);
    setIsAllSelected(false);
    setOpenSelectBox([false, false]);
  };

  // by Name or location selection handler
  const handle2ndSelect = (selectedOptionArr) => {
    if (isSelected[0]) {
      // logic for by name
      if (selectedOptionArr.length === 1) {
        setSelectedOneB(selectedOptionArr[0].username);
      } else if (selectedOptionArr.length !== 0) {
        setSelectedOneB(`${selectedOptionArr.length} users`);
      } else {
        setSelectedOneB(null);
      }

      // state for request to backend
      setSelectedNames(selectedOptionArr);
    } else if (selectedOptionArr.length !== 0) {
      // Logic for locations
      if (isAllSelected) {
        setSelectedOneB("all locations");
      } else if (selectedOptionArr.length === 1) {
        if (selectedOptionArr[0]?.specificLocation) {
          // console.log(
          //   "machinesSpecLocationsLocationsKeys:",
          //   allLocations[selectedOptionArr[0].location].specific_location[
          //     selectedOptionArr[0].specLocationIdx
          //   ].devices[selectedOptionArr[0].machineIdx]
          // );
          setSelectedOneB(
            `${allLocations[selectedOptionArr[0].location].locationName}
            -${
              allLocations[selectedOptionArr[0].location].specific_location[
                selectedOptionArr[0].specLocationIdx
              ].devices[selectedOptionArr[0].machineIdx].device_name
            }
            `
          );
        } else {
          setSelectedOneB(
            `${allLocations[selectedOptionArr[0].location].locationName}-${
              allLocations[selectedOptionArr[0].location].devices[
                selectedOptionArr[0].machine
              ].machineName
            }`
          );
        }
      } else {
        setSelectedOneB(`${selectedOptionArr.length} machines`);
      }
      // state for request to backend
      setSelectedNames(selectedOptionArr);
    } else {
      setSelectedOneB(null);
    }

    setOpenSelectBox([false, false]);
  };

  const handleSearchButton = () => {
    if (selectedOneA && selectedOneB && start.date) {
      // send selected data to parent component(AuditTrailMail.js)
      handleSelection([isSelected[0], dates, selectedNames]);
    } else {
      setOpenMessageBox(true);
    }
  };
  // ↑↑↑ --- selects handlers --- ↑↑↑

  // ↓↓↓ --- scheduler functions --- ↓↓↓
  const handleClear = () => {
    setDates({
      start: { date: null, time: null },
      end: { date: null, time: null },
    });
  };

  const handleClose = () => {
    setOpenDateSelect(false);
  };

  const handleSetNewSchedule = (data) => {
    setDates(data);
    setOpenDateSelect(false);
  };
  // ↑↑↑ --- scheduler functions --- ↑↑↑

  return (
    <Wrapper positionRelative={openDateSelect || openMessageBox}>
      <InnerWrapper>
        <SectionMain>
          <SectionInnerWrapper>
            <SelectedOneSpan>{t('auditTrail.selectBy')}</SelectedOneSpan>
            <SectionSelectBy isOpen={openSelectBox[0]}>
              <SelectedOneAndArrowWrapper>
                <SelectBy>
                  <SelectedOneSpan>
                    {selectedOneA ? selectedOneA : "----------"}
                  </SelectedOneSpan>
                </SelectBy>
                <ArrowWrapper>
                  <ArrowImg
                    src={"/images/masterCtr-select-btn.svg"}
                    onClick={() => handleOpenSelectBox(0)}
                  />
                </ArrowWrapper>
              </SelectedOneAndArrowWrapper>
              {openSelectBox[0] && (
                <SelectByOption
                  selectOption={selectOption}
                  handle1stSelect={handle1stSelect}
                  isSelected={isSelected}
                  setIsSelected={setIsSelected}
                />
              )}
            </SectionSelectBy>
          </SectionInnerWrapper>

          <SectionInnerWrapper>
            <SelectedOneSpan>
              select {selectedOneA ? selectedOneA : "---------"}
            </SelectedOneSpan>
            <SectionSelect2ndOption isOpen={openSelectBox[1]}>
              <SelectedOneAndArrowWrapper paddingOption={true}>
                <SelectUserName>
                  <SelectedOneSpan>
                    {selectedOneB ?? "-----------"}
                  </SelectedOneSpan>
                </SelectUserName>
                <ArrowWrapper>
                  <ArrowImg
                    src={"/images/masterCtr-select-btn.svg"}
                    onClick={() => selectedOneA && handleOpenSelectBox(1)}
                  />
                </ArrowWrapper>
              </SelectedOneAndArrowWrapper>
              {openSelectBox[1] &&
                (isSelected[0] ? (
                  <SelectByName
                    selectOption={allUsers}
                    handle2ndSelect={handle2ndSelect}
                    isSelected={isNameSelected}
                    setIsSelected={setIsNameSelected}
                  />
                ) : (
                  <SelectByLocation
                    locationKeys={allLocations}
                    specificLocationsWithLocationsKeys={allSpecificLocations}
                    machinesSpecLocationsLocationsKeys={
                      locationsSpecificLocationsMachinesKeys
                    }
                    // selectLocationInitialState={locationsInitState}
                    // selectSpecificLocationInitialState={
                    //   specificLocationsInitStates
                    // }
                    setLocationInitStateHandler={setLocationInitStateHandler}
                    setMachineInitStateHandler={setMachineInitStateHandler}
                    setSpecificLocationInitStateHandler={
                      setSpecificLocationInitStateHandler
                    }
                    // selectMachineInitialState={machineSelectedState}
                    // selectLocationInitialState={locationsInitStateRef.current}
                    // selectSpecificLocationInitialState={
                    //   specificLocationsInitStatesRef.current
                    // }
                    // selectMachineInitialState={
                    //   machineSelectedInitStateRef.current
                    // }
                    handle2ndSelect={handle2ndSelect}
                    // isSelected={isLocationSelected}
                    // setIsSelected={setIsLocationSelected}
                    isAllSelected={isAllSelected}
                    setIsAllSelected={setIsAllSelected}
                  />
                ))}
            </SectionSelect2ndOption>
          </SectionInnerWrapper>

          <SectionInnerWrapper>
            <TitleWrapper>
              <SelectedOneSpan>{t('auditTrail.selectStartDate')}</SelectedOneSpan>
              <SelectedOneSpan>{t('auditTrail.selectEndDate')}</SelectedOneSpan>
            </TitleWrapper>

            <SectionDate>
              <SelectDate>
                <SelectedOneSpan>{displayStart}</SelectedOneSpan>
              </SelectDate>
              <SelectDate>
                <SelectedOneSpan>{displayEnd}</SelectedOneSpan>
              </SelectDate>
              <ArrowWrapper>
                <ArrowImg
                  src={"/images/masterCtr-select-btn.svg"}
                  onClick={() => selectedOneB && setOpenDateSelect(true)}
                />
              </ArrowWrapper>
            </SectionDate>
          </SectionInnerWrapper>
        </SectionMain>

        <SectionSearchButton>
          <SearchButton onClick={handleSearchButton}>
            <SearchButtonHole>
              <SearchButtonTop>{t('common.search')}</SearchButtonTop>
            </SearchButtonHole>
          </SearchButton>
        </SectionSearchButton>
      </InnerWrapper>
      {openDateSelect && (
        <PopupBoxWrapper>
          <ScheduleCalendar
            handleScheduler={handleSetNewSchedule}
            handleClose={handleClose}
            handleClear={handleClear}
            scheduleList={dates}
            noTimePicker={true}
            isToSelectPastDates={true}
          />
        </PopupBoxWrapper>
      )}
      {openMessageBox && (
        <PopupBoxWrapper>
          <MessageBox
            onClose={() => setOpenMessageBox(false)}
            title={t('auditTrail.title')}
            subtitle={t('auditTrail.selectionBox')}
            messages={[
              t('auditTrail.messages.finalizePrompt'),
              t('auditTrail.messages.chooseAllSelections'),
            ]}
          />
        </PopupBoxWrapper>
      )}
    </Wrapper>
  );
};

export default ATMainSelect;

const Wrapper = styled.div`
  width: 1216px;
  height: 86px;
  border-radius: 49px;

  ${layerB};
  ${flexBoxCenter};
  margin: 10px 0;

  ${(p) =>
    p.positionRelative &&
    css`
      position: relative;
    `}
`;
const InnerWrapper = styled.div`
  width: 1212px;
  height: 82px;
  border-radius: 47px;

  ${layerA180Deg}
  ${justifyContentSpaceBetween}
  padding: 0 10px 0 6px;
`;
const SectionMain = styled.section`
  width: 1099px;
  height: 69px;
  border-radius: 41px;

  ${layerADark}
  ${justifyContentSpaceBetween}
  padding: 0 8px 0 8px;
`;
const SectionInnerWrapper = styled.div`
  height: 85%;
  ${flexDirectionColumn}
`;

const SectionSelectBy = styled.section`
  width: 305px;
  height: 41px;
  border-radius: 34px;

  ${layerA180Deg}
  ${flexBoxCenter}
  ${(p) =>
    p.isOpen &&
    css`
      height: auto;
      margin-top: 5px;
      flex-direction: column;
      align-items: center;
      padding: 3px 0px 3px 0;
      border-radius: 15px;
      ${layerA90Deg}
      z-index: 100;
    `}
`;

const SelectedOneAndArrowWrapper = styled.div`
  width: 100%;
  height: 100%;
  ${justifyContentSpaceBetween}

  padding: 0 8px 0 5px;
  ${(p) =>
    p.paddingOption &&
    css`
      padding: 0 8px 0 5px;
    `}
`;

const SelectBy = styled.div`
  width: 257px;
  height: 33px;
  border-radius: 33px;

  ${layerADark};
  ${justifyContentFlexStart};
  padding-left: 10px;
`;
const SectionSelect2ndOption = styled.section`
  width: 320px;
  height: 41px;
  border-radius: 34px;
  ${layerA180Deg}

  ${flexBoxCenter}
  ${(p) =>
    p.isOpen &&
    css`
      height: auto;
      margin-top: 5px;
      flex-direction: column;
      align-items: center;
      padding: 3px 0px 3px 0;
      border-radius: 15px;
      ${layerA90Deg};
      z-index: 100;
    `}
`;
const SelectUserName = styled.div`
  width: 272px;
  height: 33px;
  border-radius: 33px;

  ${layerADark};
  ${justifyContentFlexStart}
  padding-left:10px;
`;
const SectionDate = styled.section`
  width: 428px;
  height: 41px;
  border-radius: 34px;

  ${layerA180Deg}

  ${justifyContentSpaceBetween}
  padding: 0 10px 0 5px;
`;
const SelectDate = styled.div`
  width: 180px;
  height: 33px;
  border-radius: 33px;

  ${layerADark};
  ${flexBoxCenter};
`;
const SelectedOneSpan = styled.span`
  font-size: 10px;
`;
const ArrowWrapper = styled.div`
  ${flexBoxCenter}
  width: 25px;
  height: 21px;
  cursor: pointer;
`;
const ArrowImg = styled.img`
  margin-top: 3px;
  height: 100%;
`;
const TitleWrapper = styled.div`
  width: 428px;
  ${justifyContentSpaceBetween}
  padding: 0 80px 0 35px;
`;
const SectionSearchButton = styled.section`
  ${flexBoxCenter}

  width: 84px;
  height: 36px;
  border-radius: 33px;

  ${layerBDark}
`;
const SearchButton = styled.button`
  ${flexBoxCenter}

  width: 82px;
  height: 34px;
  border-radius: 34px;

  ${layerA180Deg}
`;
const SearchButtonHole = styled.div`
  ${flexBoxCenter}

  width: 72px;
  height: 24px;
  border-radius: 33px;

  ${layerC}
`;
const SearchButtonTop = styled.div`
  ${flexBoxCenter}

  width: 68px;
  height: 20px;
  border-radius: 34px;
  ${layerA180Deg}

  font-size: 10px;
`;

const PopupBoxWrapper = styled.div`
  width: 100%;
  height: 600%;
  ${flexBoxCenter}
  position: absolute;
  top: -60px;
  left: 0px;
  z-index: 100;
`;
