import { useEffect, useState } from 'react';
import { useESSSwitchStore, useLocationsStore, useMCCommandStore, useMCStore, useMasterControlSelectStore, useTESSwitchStore, useTGSSwitchStore } from '../../../zustand-stores';
import {
  essSpecificLocationUnselectMachinesHandler,
  handleUnSelectIndividualMachine,
  selectEssSwitch,
} from '../../../store/slices/essSwitchSlice';
import {
  selectTesSwitch,
  tesHandleUnSelectIndividualMachine,
  tesSpecificLocationUnselectMachinesHandler,
} from '../../../store/slices/tesSwitchSlice';
import {
  selectTgsSwitch,
  tgsHandleUnSelectIndividualMachine,
  tgsSpecificLocationUnselectMachinesHandler,
} from '../../../store/slices/tgsSwitchSlice';
import { selectMC } from '../../../store/slices/mCSlice';
import {
  handleDisplaySelectBox,
  handleLocationSelect,
  handleMachineSelect,
  handleResetAllSelect,
  handleSelectAll,
  handleSpecificLocationSelect,
  selectMasterControls,
} from '../../../store/slices/masterControlSelectSlice';

import {
  flexBoxCenter,
  justifyContentSpaceBetween,
  justifyContentSpaceEvenly,
  layerA180Deg,
  layerADark,
  layerADisabled180Deg,
  layerB,
  layerBDark,
  layerBDisabled,
} from '../../../styles/commonStyles';
import styled, { css } from 'styled-components';
import SelectMachineOptions from './SelectMachineOptions';
import ShutOffBox from './ShutOffBox';
import {
  handleDeactivatePrograms,
  selectedMachinesState,
  handleResetMCOffState,
  toggleAtsHandlerTempo,
  handleResetAtsState,
  handleResetAllDialControl,
  handleResetAll,
  fanOnlyHandlerTempo,
} from '../../../store/slices/selectedMachinesSlice';
import SelectAtsBox from './SelectAtsBox';
import {
  handleControlResetInit,
  selectMCCommand,
} from '../../../store/slices/mCCommandSlice';
import { useContext } from 'react';
import { MasterControlContext } from '../../MaterControlContext';
import testData from '../../../../test_data/testData';
import { selectLocations } from '../../../store/slices/locationsSlice';
import { setInitialStateSelectBoxHandler } from '../../../../helpers/ess-tgs-tes-mc/setInitialStateSelectBoxHandler';

const MainSelects = ({
  // commandConfirmed,
  handleCreateNewCommandMessageBox,
}) => {
  // global states
  const selectedSwitch = useMCStore();
  const { ess, tgs, tes, hp } = selectedSwitch.selectSystem;
  const masterControlSelects = useMasterControlSelectStore();
  const { displaySelectBox } = masterControlSelects;
  const { selectedOne } = ess
    ? masterControlSelects.ess
    : tes
    ? masterControlSelects.tes
    : masterControlSelects.tgs;

  const selectedMachineStates = useSelector(selectedMachinesState);
  const { mCOff, atsState } = selectedMachineStates;
  const { selections } = atsState;
  
  // ess || tes || teg || hp
  const { flatEssSwitch, essSwitch } = useESSSwitchStore();
  const { flatTesSwitch, tesSwitch } = useTESSwitchStore();
  const { flatTgsSwitch, tgsSwitch } = useTGSSwitchStore();
  // const { flatHpSwitch, hpSwitch } = useTGSSwitchStore();
  // !! dummy data
  const hpStation = {
    'blue-hill': { isSpecificLocation: true, subLocations: {} },
    sharon: {
      isSpecificLocation: true,
      subLocations: {
        'cummins walkway': {
          devices: {
            'zone 1': {},
            'zone 2': {},
            'zone 3': {},
            'zone 4': {},
            'zone 5': {},
          },
        },
        'outbound platform': {
          devices: {
            'zone 1': {},
            'zone 2': {},
            'zone 3': {},
            'zone 4': {},
            'zone 5': {},
          },
        },
        'inbound platform': {
          devices: {
            'zone 1': {},
            'zone 2': {},
            'zone 3': {},
            'zone 4': {},
            'zone 5': {},
          },
        },
        'blue hill walkway': {
          devices: {
            'zone 1': {},
            'zone 2': {},
            'zone 3': {},
            'zone 4': {},
            'zone 5': {},
          },
        },
      },
    },
  };

  let switchStatus = ess
    ? essSwitch
    : tes
    ? tesSwitch
    : tgs
    ? tgsSwitch
    : hpStation;

  // mcCommandSlice
  const { isNewCommandCreated, commandApplied, controlResetInitialState } =
    useMCCommandStore();

  const titles = ['select switch location', 'select ats', 'deactivate'];
  // const [displaySelectBox, setDisplaySelectBox] = useState(false);
  const [displayOffBox, setDisplayOffBox] = useState(false);

  // const [atsSrc, setAtsSrc] = useState('/images/select-ats-active.svg');
  const [displayAts, setDisplayAts] = useState(false);
  // const [greenDetour, setGreenDetour] = useState([false, false]);
  // const [selectPrograms, setSelectPrograms] = useState(initialState);

  // useContext for styling purposes
  const {
    greenDetour,
    setGreenDetour,
    selectPrograms,
    setSelectPrograms,
    isSelectedForAts,
    setIsSelectedForAts,
  } = useContext(MasterControlContext);

  // for Machine Off
  const initialState = {
    instantHeat: false,
    isFanOnly: false,
    snowSensor: false,
    optionalConstantTemp: false,
    heatingSchedule: false,
    windFactor: false,
  };

  // for ATS
  const atsInitialState = [false, false, false];
  // const [isSelectedForAts, setIsSelectedForAts] = useState(atsInitialState);

  // !!TEST DATA
  // const locations = useLocationsStore();
  // const {
  //   testEssLocationsAll,
  //   testEssSwitch,
  //   testTgsLocationsAll,
  //   testTgsSwitch,
  // } = testData(flatEssSwitch, flatTgsSwitch, locations);
  // !! END

  const unSelectSpecificLocationMachines = (
    swt,
    specificLocationKeys,
    machinesData,
    location
  ) => {
    specificLocationKeys.forEach((specificLocation) => {
      machinesData.forEach((machine) => {
        const machineKey = Object.keys(machine)[0];
        const dispatchOjb = {
          location,
          machine: machineKey,
        };
        if (swt === 'ess') {
          dispatch(essSpecificLocationUnselectMachinesHandler(dispatchOjb);
        } else if (swt === 'tes') {
          dispatch(tesSpecificLocationUnselectMachinesHandler(dispatchOjb);
        } else if (swt === 'tgs') {
          dispatch(tgsSpecificLocationUnselectMachinesHandler(dispatchOjb);
        }
      });
    });
  };

  const handleUnSelectMachines = (location, swt, switchData) => {
    // if (swt === 'ess') {
    //   const machines = Object.keys(switchData[location]);
    //   machines.forEach((machine) =>
    //     dispatch(handleUnSelectIndividualMachine({ location, machine }))
    //   );
    // } else if (swt === 'tes') {
    //   const machines = Object.keys(switchData[location]);
    //   machines.forEach((machine) =>
    //     setUnSelectIndividualMachine({ location, machine })
    //   );
    // } else {
    //   const machines = Object.keys(switchData[location]);
    //   machines.forEach((machine) =>
    //     setUnSelectIndividualMachine({ location, machine })
    //   );
    // }

    const el = Object.keys(switchData[location]);
    const elValue = Object.values(switchData[location]);

    if (elValue[0]?.machineType) {
      el.forEach((machine) => {
        if (swt === 'ess') {
          dispatch(handleUnSelectIndividualMachine({ location, machine });
        } else if (swt === 'tes') {
          setUnSelectIndividualMachine({ location, machine });
        } else if (swt === 'tgs') {
          setUnSelectIndividualMachine({ location, machine });
        } else {
        }
      });
    } else if (elValue.length > 0) {
      unSelectSpecificLocationMachines(swt, el, elValue, location);
    }
  };

  // ******************initialize selected machines to reuse*******************

  const loopAllMachinesHandler = (selectedSwitches, selectedSys) => {
    const locations = selectedSwitches && Object.keys(selectedSwitches);
    locations.map((location) =>
      handleUnSelectMachines(location, selectedSys, selectedSwitches);
  };

  useEffect(() => {
    if (commandApplied === false) {
      setGreenDetour([false, false]);
    }
  }, [commandApplied]);

  useEffect(() => {
    setDisplayAts(false);
    setDisplayOffBox(false);

    if (!controlResetInitialState) {
      setIsSelectedForAts(atsInitialState);
      setGreenDetour([false, false]);
      setSelectPrograms(initialState);
      dispatch(handleResetMCOffState();
      dispatch(handleResetAtsState();
      if (ess) {
        loopAllMachinesHandler(flatEssSwitch, 'ess');
        // const locations = flatEssSwitch && Object.keys(flatEssSwitch);
        // locations.map((location) =>
        //   handleUnSelectMachines(location, 'ess', flatEssSwitch)
        // );
      } else if (tes) {
        loopAllMachinesHandler(flatTesSwitch, 'tes');
        // const locations = flatTesSwitch && Object.keys(flatTesSwitch);
        // locations.map((location) =>
        //   handleUnSelectMachines(location, 'tes', flatTesSwitch)
        // );
      } else if (tgs) {
        loopAllMachinesHandler(flatTgsSwitch, 'tgs');
        // const locations = flatTgsSwitch && Object.keys(flatTgsSwitch);
        // locations.map((location) =>
        //   handleUnSelectMachines(location, 'tgs', flatTgsSwitch)
        // );
      }
    }
  }, [ess, tes, tgs]);

  // ******************initialize selected machines to reuse*******************

  // ******************initialize selections to use*******************

  useEffect(() => {
    if (!controlResetInitialState) {
      if (!selectedOne) {
        // *** reset all switch location to initial state
        dispatch(handleResetAllSelect();

        // *** reset dial and  sections control to initial state

        dispatch(handleResetAll();
      }
    }
  }, [controlResetInitialState, ess, tes, tgs]);

  // const presetSelectBoxArr = (swt, swtData) => {
  //   // isAllSelected
  //   const locations = Object.keys(swtData);
  //   dispatch(handleSelectAll({ switch: swt, status: false });
  //   // isLocationSelected
  //   const locationArr = locations.map((_) => false);
  //   dispatch(handleLocationSelect({ arr: locationArr, switch: swt });

  //   const specificLocationArr = [];
  //   const machineArr = Object.values(swtData).map((location) =>
  //     Object.values(location).map((value) => {
  //       if (value.machineType) {
  //         return false;
  //       } else {
  //         const specLocation = Object.keys(value).map((el) => false);
  //         // const specLocation = Object.keys(location).map((el) => false);
  //         specificLocationArr.push(specLocation);
  //         return specLocation;
  //       }
  //     })
  //   );
  //   //isSpecificLocationSelected
  //   dispatch(
  //     handleSpecificLocationSelect({
  //       arr: specificLocationArr,
  //       switch: swt,
  //     })
  //   );

  //   // isMachineSelected
  //   dispatch(handleMachineSelect({ arr: machineArr, switch: swt });
  // };
  const selectionDispatchHandler = (
    swt,
    locationArr,
    specificLocationArr,
    machineArr
  ) => {
    dispatch(handleSelectAll({ switch: swt, status: false });
    dispatch(handleLocationSelect({ arr: locationArr, switch: swt });
    dispatch(
      handleSpecificLocationSelect({
        arr: specificLocationArr,
        switch: swt,
      });
    dispatch(handleMachineSelect({ arr: machineArr, switch: swt });
  };

  useEffect(() => {
    if (!controlResetInitialState) {
      if (ess) {
        if (!selectedOne) {
          const { locationArr, specificLocationArr, machineArr } =
            setInitialStateSelectBoxHandler(essSwitch);

          selectionDispatchHandler(
            'ess',
            locationArr,
            specificLocationArr,
            machineArr
          );
        }
      } else if (tes) {
        if (!selectedOne) {
          const { locationArr, specificLocationArr, machineArr } =
            setInitialStateSelectBoxHandler(tesSwitch);

          selectionDispatchHandler(
            'tes',
            locationArr,
            specificLocationArr,
            machineArr
          );
        }
      } else if (tgs) {
        if (!selectedOne) {
          const { locationArr, specificLocationArr, machineArr } =
            setInitialStateSelectBoxHandler(tgsSwitch);

          selectionDispatchHandler(
            'tgs',
            locationArr,
            specificLocationArr,
            machineArr
          );
          // !! TEST Purpose Only
          // const { locationArr, specificLocationArr, machineArr } =
          //   setInitialStateSelectBoxHandler(testTgsSwitch);
        }
      }
    }
    return () => {};
  }, [selectedOne, selectedSwitch, ess, tes, tgs]);

  // ******************initialize selections to use*******************

  // this function handles close of ShutOffBox and set selectedMachinesSlice to initialState depending which program is selected

  const handleOnCloseAndDeactivatePrograms = (value, el) => {
    const isChanged = Object.values(el).some((swt) => swt === true);

    if (isChanged) {
      const copyArr = [...greenDetour];
      copyArr[1] = true;
      setGreenDetour(copyArr);
    } else {
      const copyArr = [...greenDetour];
      copyArr[1] = false;
      setGreenDetour(copyArr);
    }

    if (Object.values(el).every((value) => value === false)) {
      dispatch(handleResetMCOffState();
      setDisplayOffBox(value);
    } else {
      dispatch(handleResetAllDialControl();
      if (el.instantHeat === true) {
        setDisplayOffBox(value);
        dispatch(handleDeactivatePrograms('instantHeat');
        dispatch(fanOnlyHandlerTempo(false);
      }
      if (el.isFanOnly === true) {
        dispatch(handleDeactivatePrograms('isFanOnly');
        setDisplayOffBox(value);
      }
      if (el.snowSensor === true) {
        dispatch(handleDeactivatePrograms('snowSensor');
        setDisplayOffBox(value);
      }
      if (el.optionalConstantTemp === true) {
        dispatch(handleDeactivatePrograms('optionalConstantTemp');
        setDisplayOffBox(value);
      }
      if (el.heatingSchedule === true) {
        dispatch(handleDeactivatePrograms('heatingSchedule');
        setDisplayOffBox(value);
      }
      if (el.windFactor === true) {
        dispatch(handleDeactivatePrograms('windFactor');
        setDisplayOffBox(value);
      } else {
        setDisplayOffBox(value);
      }
    }
  };

  // it handles the select switch location, select ATS and deactivate buttons
  const handleButtonClick = (btnNum) => {
    switch (btnNum) {
      case 0: {
        dispatch(handleDisplaySelectBox();
        break;
      }
      case 1: {
        if (selectedOne && !hp) {
          setDisplayAts(true);
        }
        break;
      }
      case 2: {
        if (selectedOne) {
          setDisplayOffBox(true);
        }

        break;
      }
      default:
        break;
    }
  };

  const tgsPrograms = [
    { title: 'instant heat', img: './images/InstantHeatForMCOff.svg' },
    { title: 'fan only', img: './images/tgs-fanOnly.svg' },
    { title: 'snow sensor', img: './images/snowSensorForMCOff.svg' },
    {
      title: 'optional constant temp.',
      img: './images/greyConstantHeatForMCOff.svg',
    },
    {
      title: 'heating schedule program',
      img: './images/heatingScheduleForMCOff.svg',
    },
    { title: 'wind factor', img: './images/windFactorForMCOff.svg' },
  ];

  const essTesPrograms = [
    { title: 'instant heat', img: './images/InstantHeatForMCOff.svg' },

    { title: 'snow sensor', img: './images/snowSensorForMCOff.svg' },
    {
      title: 'optional constant temp.',
      img: './images/constantHeatForMCOff.svg',
    },
    {
      title: 'heating schedule program',
      img: './images/heatingScheduleForMCOff.svg',
    },
    { title: 'wind factor', img: './images/windFactorForMCOff.svg' },
  ];

  const buttons = ['clear', 'select'];

  const handleSelectionOfPrograms = (e, el, swt) => {
    e.stopPropagation();

    const copySelectPrograms = { ...selectPrograms };

    if (swt === 'ess' || swt === 'tes') {
      if (el === 'instant heat') {
        copySelectPrograms.instantHeat = true;
        return setSelectPrograms(copySelectPrograms);
      } else if (el === 'snow sensor') {
        copySelectPrograms.snowSensor = true;
        return setSelectPrograms(copySelectPrograms);
      } else if (el === 'optional constant temp.') {
        copySelectPrograms.optionalConstantTemp = true;
        return setSelectPrograms(copySelectPrograms);
      } else if (el === 'heating schedule program') {
        copySelectPrograms.heatingSchedule = true;
        return setSelectPrograms(copySelectPrograms);
      } else if (el === 'wind factor') {
        copySelectPrograms.windFactor = true;
        return setSelectPrograms(copySelectPrograms);
      } else return setSelectPrograms(initialState);
    } else if (swt === 'tgs') {
      if (el === 'instant heat') {
        copySelectPrograms.instantHeat = true;
        return setSelectPrograms(copySelectPrograms);
      } else if (el === 'fan only') {
        copySelectPrograms.isFanOnly = true;
        return setSelectPrograms(copySelectPrograms);
      } else if (el === 'snow sensor') {
        copySelectPrograms.snowSensor = true;
        return setSelectPrograms(copySelectPrograms);
      } else if (el === 'heating schedule program') {
        copySelectPrograms.heatingSchedule = true;
        return setSelectPrograms(copySelectPrograms);
      } else if (el === 'wind factor') {
        copySelectPrograms.windFactor = true;
        return setSelectPrograms(copySelectPrograms);
      } else return setSelectPrograms(initialState);
    }
  };

  const clearSelectButtonHandler = (e, index) => {
    e.stopPropagation();

    switch (index) {
      case 0:
        setSelectPrograms(initialState);
        break;
      case 1:
        handleOnCloseAndDeactivatePrograms(false, selectPrograms);
        break;
      default:
        break;
    }
  };

  // --- functions for ats
  // 1. apply function
  const handleAtsButton = (id) => {
    // id 1 => close || id 2 => clear || id 3 => apply
    if (id === 1) {
      setDisplayAts(false);
    } else if (id === 2) {
      setIsSelectedForAts([false, false, false]);
    } 
    else if (id === 3) {
      if (isSelectedForAts.join() !== atsInitialState.join()) {
        const copyArr = [...greenDetour];
        copyArr[0] = true;
        setGreenDetour(copyArr);

        const swt = tgs ? 'tgs' : tes ? 'tes' : 'ess';
        dispatch(
          toggleAtsHandlerTempo({
            swt,
            selections: [
              isSelectedForAts[0],
              isSelectedForAts[1],
              isSelectedForAts[2],
            ],
          });
      } else {
        const copyArr = [...greenDetour];
        copyArr[0] = false;
        setGreenDetour(copyArr);
      }
      setDisplayAts(false);
    }
  };
  // 2. select logic function
  const handleSelectATS = (id) => {
    if (id === 1) {
      setIsSelectedForAts([true, false, false]);
    } else if (id === 2) {
      setIsSelectedForAts([false, true, false]);
    } else if (id === 3) {
      setIsSelectedForAts([false, false, true]);
    }
  };

  return (
    <Wrapper>
      <SectionButtons>
        {/* select switch location */}
        <SelectWrapper>
          <Title>{titles[0]}</Title>
          <SelectHole displaySelectBox={displaySelectBox}>
            <SelectInnerWrapper displaySelectBox={displaySelectBox}>
              <SelectedOneAndArrowButtonWrapper>
                <SelectTop>{selectedOne ? selectedOne : '-----'}</SelectTop>
                <SelectArrowButton
                  src='/images/masterCtr-select-btn.svg'
                  onClick={() => {
                    if (!isNewCommandCreated) {
                      handleCreateNewCommandMessageBox();
                    } else {
                      handleButtonClick(0);
                    }
                  }}
                />
              </SelectedOneAndArrowButtonWrapper>
              {displaySelectBox && (
                <SelectMachineOptions
                  handleClose={() => handleButtonClick(0)}
                  // handleClose={() => dispatch(handleDisplaySelectBox(false))}
                  data={switchStatus}
                  // !! TEST Purpose Only
                  // data={ess ? flatEssSwitch : tes ? flatTesSwitch : testTgsSwitch}
                  swt={ess ? 'ess' : tes ? 'tes' : tgs ? 'tgs' : 'hp'}
                  // Need to conditionally assign ||tgs || tes || ess
                />
              )}
            </SelectInnerWrapper>
          </SelectHole>
        </SelectWrapper>

        {/* select ATS */}
        <ButtonWrapper>
          <Title>{titles[1]}</Title>
          <Button
            disabled={hp}
            onClick={() => {
              if (!isNewCommandCreated) {
                handleCreateNewCommandMessageBox();
              } else {
                handleButtonClick(1);
              }
            }}
          >
            <ButtonOuterHole
              disabled={hp}
              greenDetour={!commandApplied && greenDetour[0]}
              orangeContour={commandApplied && greenDetour[0]}
            >
              <ButtonInnerWrapper
                disabled={hp}
                orangeContour={commandApplied && greenDetour[0]}
              >
                <ButtonTop disabled={hp}>
                  <Gp disabled={false}>gp</Gp>
                  <img
                    src={'/images/select-ats-active.svg'}
                    alt='disabled energy'
                  />
                  <Ebp disabled={false}>ebp</Ebp>
                </ButtonTop>
              </ButtonInnerWrapper>
            </ButtonOuterHole>
          </Button>
        </ButtonWrapper>

        {/* deactivate */}
        <ButtonWrapper>
          <Title>{titles[2]}</Title>
          <Button
            onClick={() => {
              if (!isNewCommandCreated) {
                handleCreateNewCommandMessageBox();
              } else {
                handleButtonClick(2);
              }
            }}
          >
            <ButtonOuterHole
              greenDetour={!commandApplied && greenDetour[1]}
              orangeContour={commandApplied && greenDetour[1]}
            >
              <ButtonInnerWrapper
                orangeContour={commandApplied && greenDetour[1]}
              >
                <ButtonTop>m.c. off</ButtonTop>
              </ButtonInnerWrapper>
            </ButtonOuterHole>
          </Button>
        </ButtonWrapper>
      </SectionButtons>
      {displayOffBox && (
        <ShutOffBox
          // handleOnClose={handleOnCloseAndDeactivatePrograms}
          clearSelectButtonHandler={clearSelectButtonHandler}
          swt={ess ? 'ess' : tes ? 'tes' : 'tgs'}
          tgsPrograms={tgsPrograms}
          essTesPrograms={essTesPrograms}
          buttons={buttons}
          selectPrograms={selectPrograms}
          handleSelectionOfPrograms={handleSelectionOfPrograms}
        />
      )}

      {displayAts && (
        <SelectAtsBox
          handleOnClick={handleAtsButton}
          handleOnSelect={handleSelectATS}
          swt={ess ? 'ess' : tes ? 'tes' : 'tgs'}
          isSelected={isSelectedForAts}
        />
      )}
    </Wrapper>
  );
};

export default MainSelects;

const Wrapper = styled.div`
  width: 505px;
  height: 63px;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  padding: 0 10rem;
`;

const Title = styled.span`
  font-size: 10px;
  margin-bottom: 2rem;
`;

const SectionButtons = styled.div`
  width: 100%;
  ${justifyContentSpaceBetween}
`;

const SelectWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
`;

const SelectHole = styled.div`
  width: 222px;
  height: 39px;
  border-radius: 33px;
  ${layerBDark}
  ${flexBoxCenter}

  ${(p) =>
    p.displaySelectBox &&
    css`
      background: transparent;
      box-shadow: none;
    `}
`;
const SelectInnerWrapper = styled.div`
  width: 220px;
  height: 37px;
  border-radius: 34px;
  ${layerA180Deg}
  ${justifyContentSpaceBetween}
  padding: 0 3px 0 5px;

  ${(p) =>
    p.displaySelectBox &&
    css`
      position: absolute;
      height: auto;
      flex-direction: column;
      padding: 3px 3px 3px 5px;
      top: 15rem;
      z-index: 100;
      border-radius: 18px;
    `}
`;

const SelectedOneAndArrowButtonWrapper = styled.div`
  width: 100%;
  ${justifyContentSpaceBetween};
`;

const SelectArrowButton = styled.img`
  margin-right: 2rem;
  margin-top: 1rem;
  cursor: pointer;
`;
const SelectTop = styled.div`
  width: 187px;
  height: 29px;
  border-radius: 33px;

  ${layerADark}
  font-size: 10px;
  display: flex;
  align-items: center;
  padding-left: 20rem;
`;

const ButtonWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const Button = styled.button`
  width: 124px;
  height: 40px;
  box-shadow: inset 0px 0px 6px #000000;
  border-radius: 20px;

  ${flexBoxCenter}

  ${(p) =>
    p.disabled &&
    css`
      cursor: not-allowed;
    `};
`;

const ButtonOuterHole = styled.div`
  width: 120px;
  height: 36px;
  border-radius: 25px;

  ${layerA180Deg}
  ${flexBoxCenter}



  ${({ greenDetour, orangeContour }) =>
    greenDetour
      ? css`
          border: 1px solid #95ff45;
        `
      : orangeContour &&
        css`
          background: transparent
            linear-gradient(180deg, #ff920c 0%, #804906 100%) 0% 0% no-repeat
            padding-box;
        `}
  
  ${(p) =>
    p.disabled &&
    css`
      ${layerADisabled180Deg}
    `} /* border: 1px solid red; */
`;
const ButtonInnerWrapper = styled.div`
  width: 106px;
  height: 24px;
  border-radius: 18px;
  ${layerB}
  ${flexBoxCenter}

  ${(p) =>
    p.disabled &&
    css`
      ${layerBDisabled}
    `}

    ${({ orangeContour }) =>
    orangeContour &&
    css`
      background: #ff920c;
    `}
`;
const ButtonTop = styled.div`
  width: 104px;
  height: 22px;
  border-radius: 25px;
  font-size: 12px;
  ${layerA180Deg}
  ${justifyContentSpaceEvenly}
  

  ${(p) =>
    p.disabled &&
    css`
      ${layerADisabled180Deg}
      color: #808080;
    `}
`;

const Gp = styled.span`
  ${(p) =>
    p.disabled ||
    css`
      color: #95ff45;
    `}
`;
const Ebp = styled.span`
  ${(p) =>
    p.disabled ||
    css`
      color: #ff7800;
    `}
`;
