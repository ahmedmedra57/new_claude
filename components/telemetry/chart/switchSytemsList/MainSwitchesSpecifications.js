import { useCallback, useEffect, useMemo, useReducer, useState } from 'react';
import { useESSSwitchStore, useLocationsStore, useTESSwitchStore, useTGSSwitchStore, useTelemetryStore, useUserStore } from '../../../zustand-stores';
import styled, { css } from 'styled-components';
import {
import { useESSDataConsumptionStore, useHPDataConsumptionStore, useHPElectricSwitchStore, useHPGasSwitchStore, useTESDataConsumptionStore, useTGSDataConsumptionStore } from '../zustand-stores';
  alignItemsFlexStart,
  flexBoxCenter,
  layerA90Deg,
  layerBDark,
} from '../../../styles/commonStyles';
import SearchBar from './SearchBar';
import SwitchSpecification from './SwitchSpecification';
import Title from './Title';
import testData from '../../../../test_data/testData';
import { filteredSuggestionsHandler } from '../../../../helpers/helpers';
import { PERMISSIONS } from '../../../../constants';

// for useReducer
const initialState = {
  selectedEssMachines: [],
  selectedTgsMachines: [],
  selectedTesMachines: [],
  selectedEssDcMachines: [],
  selectedTgsDcMachines: [],
  selectedTesDcMachines: [],
  selectedHpDcMachines: [],
  selectedHpElectricMachines: [],
  selectedHpGasMachines: [],
};

const ACTIONS = {
  SETESSMACHINES: 'setEssMachines',
  SETTGSMACHINES: 'setTgsMachines',
  SETTESMACHINES: 'setTesMachines',
  SETESSDCMACHINES: 'setEssDcMachines',
  SETTGSDCMACHINES: 'setTgsDcMachines',
  SETTESDCMACHINES: 'setTesDcMachines',
  SETHPDCMACHINES: 'setHpDcMachines',
  SETHPELECTRICMACHINES: 'setHpElectricMachines',
  SETHPGASMACHINES: 'setHpGasMachines',
};

const MainSwitchesSpecifications = ({
  telemetryData,
  scheduleData,
  selectedSystem,
  controlSelectionDisplay,
  isDc,
}) => {
  const closeArrow = './images/white-triangle-pointing-right.svg';
  const openArrow = './images/white-triangle-pointing-down.svg';
  const essDropPinLogo = './images/ess-droppin-logo-for-nivo-chart.svg';
  const tgsDropPinLogo = './images/tgs-droppin-logo-for-nivo-chart.svg';
  const tesDropPinLogo = './images/tes-droppin-logo-for-nivo-chart.svg';
  const tgsTesDropPinLogo = './images/tgs-tes-droppin-logo-for-nivo-chart.svg';

  const telemetryState = useTelemetryStore();
  const isSearch = telemetryState.isSearch;

  const { flatEssSwitch } = useESSSwitchStore();
  const { flatTgsSwitch } = useTGSSwitchStore();
  const { flatTesSwitch } = useTESSwitchStore();
  const locations = useLocationsStore();
  const hpElectricSwitch = useHPElectricSwitchStore();
  const hpGasSwitch = useHPGasSwitchStore();
  const { essDataConsumptionSwitch } = useESSDataConsumptionStore();
  const { tesDataConsumptionSwitch } = useTESDataConsumptionStore();
  const { tgsDataConsumptionSwitch } = useTGSDataConsumptionStore();
  const hpDataConsumptionSwitch = useHPDataConsumptionStore();

  const [switchIdx, setSwitchIdx] = useState(null);
  const [isExpand, setIsExpand] = useState([]);
  const [inputSearch, setInputSearch] = useState(['']);
  const [expandButtonTitle, setExpandButtonTitle] = useState('expand');
  const [system, setSystem] = useState(null);
  const [src, setSrc] = useState([]);
  const [systemSwitches, setSystemSwitches] = useState();
  const [selectedLocations, setSelectedLocations] = useState([]);
  const [specificLocationsOpeningControl, setSpecificLocationsOpeningControl] =
    useState([]);
  const [totalDataConsumpOrEnergyConsump, setTotalDataConsumpOrEnergyConsump] =
    useState([]);
  const [totalUsageHours, setTotalUsageHours] = useState([]);
  const [totalNumOfSwt, setTotalNumOfSwt] = useState([]);
  const [isDataChanged, setIsDataChanged] = useState('');
  const [searchedSwtName, setSearchedSwtName] = useState('');
  const { permissions } = useUserStore();

  // !! TEST DATA !!
  // const {
  //   testEssLocationsAll,
  //   testEssSwitch,
  //   testTgsLocationsAll,
  //   testTgsSwitch,
  // } = testData(flatEssSwitch, flatTgsSwitch, locations);

  const displayStart =
    scheduleData.start.date !== null
      ? `${scheduleData.start.time.hour}:${scheduleData.start.time.minute} ${
          scheduleData.start.time.division
        }-${scheduleData.start.date.getDate()}/${
          scheduleData.start.date.getMonth() + 1
        }/${scheduleData.start.date.getFullYear()}`
      : ' -----';

  const displayEnd =
    scheduleData.end.date !== null
      ? `${scheduleData.end.time.hour}:${scheduleData.end.time.minute} ${
          scheduleData.end.time.division
        }-${scheduleData.end.date.getDate()}/${
          scheduleData.end.date.getMonth() + 1
        }/${scheduleData.end.date.getFullYear()}`
      : ' -----';

  const checkIsSystemAndSwitchesSelected =
    systemSwitches !== undefined && isSearch && controlSelectionDisplay;

  //*********** */ the state is for auto complete*****************
  const [inputSwitchName, setInputSwitchName] = useState('');
  // ***********************************

  const initialDisplaySystemState = [
    [
      'ess - electric switch systems',
      '/images/ess-map-icon.svg',
      15,
      false,
      Object.keys(flatEssSwitch),
      'ess',
    ],
    [
      'tgs - typhoon gas systems',
      '/images/tgs-map-icon.svg',
      10,
      false,
      Object.keys(flatTgsSwitch),
      'tgs',
    ],
    // !! TEST DATA !!
    // [
    //   'tgs - typhoon gas systems',
    //   '/images/tgs-map-icon.svg',
    //   10,
    //   false,
    //   Object.keys(testTgsSwitch),
    //   'tgs',
    // ],
    [
      'tes - typhoon electric systems',
      '/images/tes-map-icon.svg',
      11,
      false,
      Object.keys(flatTesSwitch),
      'tes',
    ],
    [
      'ess - dc',
      '/images/ess-map-icon.svg',
      15,
      false,
      Object.keys(essDataConsumptionSwitch),
      'essDc',
    ],
    [
      'tgs/tes - dc',
      '/images/tgs-map-icon.svg',
      10,
      false,
      Object.keys(tgsDataConsumptionSwitch),
      'tgsDc',
    ],
    [
      'tes - typhoon electric systems',
      '/images/tes-map-icon.svg',
      15,
      false,
      Object.keys(tesDataConsumptionSwitch),
      'tesDc',
    ],
    [
      'hp - switch systems',
      '/images/tes-map-icon.svg',
      15,
      false,
      Object.keys(hpDataConsumptionSwitch),
      'hpDc',
    ],
    [
      'hp - electric switch systems',
      '/images/ess-map-icon.svg',
      7,
      false,
      Object.keys(hpElectricSwitch),
      'hpEc',
    ],
    [
      'hp - gas switch systems',
      '/images/ess-map-icon.svg',
      7,
      false,
      Object.keys(hpGasSwitch),
      'hpGc',
    ],
  ];

  const createIsExpandAndSrcState = useCallback(
    (data) => {
      const copyData = [...data];
      const copyData2 = [...data];
      const arrIsExpand = copyData?.fill(false);
      const arrowImages = copyData2?.fill(closeArrow);
      setIsExpand(arrIsExpand);
      setSrc(arrowImages);
    },
    [selectedSystem]
  );

  const createLocationsArr = (data) => {
    const dataLocationsArr = data.map((value) => false);
    const specificLocationArr = Object.values(flatTgsSwitch).map((el) => {
      const numOfEl = Object.keys(el).length;
      if (numOfEl === 0 || Object.values(el)[0]?.machineType) {
        return [];
      } else {
        const emptyArr = new Array(numOfEl);
        const arr = emptyArr;
        return arr.fill(false);
      }
    });

    // !! TEST DATA !!
    // const specificLocationArr = Object.values(testTgsSwitch).map((el) => {
    //   const numOfEl = Object.keys(el).length;
    //   if (numOfEl === 0 || Object.values(el)[0]?.machineType) {
    //     return [];
    //   } else {
    //     const emptyArr = new Array(numOfEl);
    //     const arr = emptyArr;
    //     return arr.fill(false);
    //   }
    // });

    const dataEnergyHoursArr = data.map((value) => '--');
    const numOfSwt = data.map((value) => 0);
    setTotalDataConsumpOrEnergyConsump(dataEnergyHoursArr);
    setTotalUsageHours(dataEnergyHoursArr);
    setSelectedLocations(dataLocationsArr);
    setSpecificLocationsOpeningControl(specificLocationArr);

    setTotalNumOfSwt(numOfSwt);
    setIsDataChanged((prev) => `${prev}1`);
  };

  const setSystemInfoHandler = (switchData, id) => {
    setSystemSwitches([initialDisplaySystemState[id]]);
    setSwitchIdx(id);
    createIsExpandAndSrcState(initialDisplaySystemState[id][4]);
    createLocationsArr(initialDisplaySystemState[id][4]);
    setSystem(switchData);
  };

  useEffect(() => {
    switch (selectedSystem) {
      case 'ess - electric switch systems - ec':
        setSystemInfoHandler(flatEssSwitch, 0);
        break;
      case 'tgs - typhoon gas systems - gc':
        setSystemInfoHandler(flatTgsSwitch, 1);
        // !! TEST DATA
        // setSystemInfoHandler(testTgsSwitch, 1);
        break;
      case 'tes - typhoon electric systems - ec':
        setSystemInfoHandler(flatTesSwitch, 2);
        break;
      case 'ess - dc':
        setSystemInfoHandler(essDataConsumptionSwitch, 3);
        break;
      case 'tgs/tes - dc':
        setSystemInfoHandler(tgsDataConsumptionSwitch, 4);
        break;
      case 'hp - heating platform - dc':
        setSystemInfoHandler(hpDataConsumptionSwitch, 6);
        break;
      case 'hp - heating platform - ec':
        setSystemInfoHandler(hpElectricSwitch, 7);
        break;
      case 'hp - heating platform - gc':
        setSystemInfoHandler(hpGasSwitch, 8);
        break;
      default:
        setSystemSwitches([initialDisplaySystemState[0]]);
        break;
    }
  }, [selectedSystem, isSearch, telemetryData]);
  // useEffect(() => {
  //   switch (selectedSystem) {
  //     case 'ess - electric switch systems - ec':
  //       setSystemSwitches([initialDisplaySystemState[0]]);
  //       setSwitchIdx(0);
  //       createIsExpandAndSrcState(initialDisplaySystemState[0][4]);
  //       createLocationsArr(initialDisplaySystemState[0][4]);
  //       setSystem(flatEssSwitch);
  //       break;
  //     case 'tgs - typhoon gas systems - gc':
  //       setSystemSwitches([initialDisplaySystemState[1]]);
  //       setSwitchIdx(1);
  //       createIsExpandAndSrcState(initialDisplaySystemState[1][4]);
  //       createLocationsArr(initialDisplaySystemState[1][4]);
  //       setSystem(flatTgsSwitch);
  //       // !! TEST DATA
  //       // setSystem(testTgsSwitch);
  //       break;
  //     case 'tes - typhoon electric systems - ec':
  //       setSystemSwitches([initialDisplaySystemState[2]]);
  //       setSwitchIdx(2);
  //       createIsExpandAndSrcState(initialDisplaySystemState[2][4]);
  //       createLocationsArr(initialDisplaySystemState[2][4]);
  //       setSystem(flatTesSwitch);
  //       break;
  //     case 'ess - dc':
  //       setSystemSwitches([initialDisplaySystemState[3]]);
  //       setSwitchIdx(3);
  //       createIsExpandAndSrcState(initialDisplaySystemState[3][4]);
  //       createLocationsArr(initialDisplaySystemState[3][4]);
  //       setSystem(essDataConsumptionSwitch);
  //       break;
  //     case 'tgs/tes - dc':
  //       setSystemSwitches([initialDisplaySystemState[4]]);
  //       setSwitchIdx(4);
  //       createIsExpandAndSrcState(initialDisplaySystemState[4][4]);
  //       createLocationsArr(initialDisplaySystemState[4][4]);
  //       setSystem(tgsDataConsumptionSwitch);
  //       break;

  //     case 'hp - heating platform - dc':
  //       setSystemSwitches([initialDisplaySystemState[6]]);
  //       setSwitchIdx(6);
  //       createIsExpandAndSrcState(initialDisplaySystemState[6][4]);
  //       createLocationsArr(initialDisplaySystemState[6][4]);
  //       setSystem(hpDataConsumptionSwitch);
  //       break;
  //     case 'hp - heating platform - ec':
  //       setSystemSwitches([initialDisplaySystemState[7]]);
  //       setSwitchIdx(7);
  //       createIsExpandAndSrcState(initialDisplaySystemState[7][4]);
  //       createLocationsArr(initialDisplaySystemState[7][4]);
  //       setSystem(hpElectricSwitch);
  //       break;
  //     case 'hp - heating platform - gc':
  //       setSystemSwitches([initialDisplaySystemState[8]]);
  //       setSwitchIdx(8);
  //       createIsExpandAndSrcState(initialDisplaySystemState[8][4]);
  //       createLocationsArr(initialDisplaySystemState[8][4]);
  //       setSystem(hpGasSwitch);
  //       break;
  //     default:
  //       setSystemSwitches([initialDisplaySystemState[0]]);
  //       break;
  //   }
  // }, [selectedSystem, isSearch, telemetryData]);

  // *-**********SearchBar**********************
  useEffect(() => {
    setInputSearch(['']);
  }, [telemetryData]);

  const handleClearSearch = useCallback(() => {
    setInputSwitchName('');
    const copyInputSearch = [...inputSearch];
    copyInputSearch[0] = '';
    setInputSearch(copyInputSearch);
    setSearchedSwtName('');
    setIsExpand(isExpand.fill(false);
    setSrc(src.fill(closeArrow);
  }, [inputSearch, isExpand, src]);

  const handleExpandSearch = useCallback(() => {
    if (expandButtonTitle === 'close') {
      setExpandButtonTitle('expand');
      setIsExpand(isExpand.fill(false);
      setSrc(src.fill(closeArrow);
    } else {
      setExpandButtonTitle('close');
      setIsExpand(isExpand.fill(true);
      setSrc(src.fill(openArrow);
    }
  }, [expandButtonTitle, isExpand, src]);
  // *************************************************

  // *******************used in SwitchSpecification*****************************
  const handleExpandEachLocation = useCallback(
    (idx) => {
      const copyIsExpand = [...isExpand];
      const copySrc = [...src];
      if (isExpand[idx]) {
        copyIsExpand[idx] = false;
        setIsExpand(copyIsExpand);
        copySrc[idx] = closeArrow;
        setSrc(copySrc);
      } else {
        copyIsExpand[idx] = true;
        setIsExpand(copyIsExpand);
        copySrc[idx] = openArrow;
        setSrc(copySrc);
      }
      setSearchedSwtName('');
    },
    [isExpand, src]
  );

  // const handleExpandSpecificLocation = useCallback((idx) => {}, []);

  // *******************auto complete logic ********************
  const [selectedSuggestionIdx, setSelectedSuggestionIdx] = useState(0);

  const [displaySuggestions, setDisplaySuggestions] = useState(false);
  const [activatedIndex, setActivatedIndex] = useState(null);
  const [machineSuggestions, setMachineSuggestions] = useState(null);

  // save selected machines for suggestions use
  // const [selectedEssMachines, setSelectedEssMachines] = useState(null);

  const reducer = (state, action) => {
    switch (action.type) {
      case 'setEssMachines':
        return { ...state, selectedEssMachines: action.payload };
      case 'setTgsMachines':
        return { ...state, selectedTgsMachines: action.payload };
      case 'setTesMachines':
        return { ...state, selectedTesMachines: action.payload };
      case 'setEssDcMachines':
        return { ...state, selectedEssDcMachines: action.payload };
      case 'setTgsDcMachines':
        return { ...state, selectedTgsDcMachines: action.payload };
      case 'setTesDcMachines':
        return { ...state, selectedTesDcMachines: action.payload };
      case 'setHpDcMachines':
        return { ...state, selectedHpDcMachines: action.payload };
      case 'setHpElectricMachines':
        return { ...state, selectedHpElectricMachines: action.payload };
      case 'setHpGasMachines':
        return { ...state, selectedHpGasMachines: action.payload };
      default:
        throw new Error();
    }
  };

  const [state, dispatch] = useReducer(reducer, initialState);

  const dispatchHandler = (switchSystemData, actionType) => {
    const locations = [];
    Object.entries(switchSystemData).forEach(([location, value]) => {
      const accessKey = Object.keys(value);
      if (accessKey.length > 0 && Object.values(value)[0].isSelected) {
        locations.push(`${location} - ${accessKey}`);
      } else if (accessKey.length > 0) {
        const SpecLocationKeyValue = Object.entries(value)[0];
        if (Object.values(SpecLocationKeyValue[1])[0].isSelected) {
          locations.push(
            `${location} - ${SpecLocationKeyValue[0]} - ${
              Object.keys(SpecLocationKeyValue[1])[0]
            }`
          );
        }
      }
    });

    // TODO: Fix // TODO: Fix dispatch({ type: actionType, payload: locations   })
  };

  useEffect(() => {
    if (isSearch) {
      switch (selectedSystem) {
        case 'ess - electric switch systems - ec':
          dispatchHandler(flatEssSwitch, ACTIONS.SETESSMACHINES);
          break;
        case 'tgs - typhoon gas systems - gc':
          dispatchHandler(flatTgsSwitch, ACTIONS.SETTGSMACHINES);
          // !! TEST DATA !!
          // dispatchHandler(testTgsSwitch, ACTIONS.SETTGSMACHINES);
          break;
        case 'tes - typhoon electric systems - ec':
          dispatchHandler(flatTesSwitch, ACTIONS.SETTESMACHINES);
          break;
        case 'ess - dc':
          dispatchHandler(essDataConsumptionSwitch, ACTIONS.SETESSDCMACHINES);
          break;
        case 'tgs/tes - dc':
          dispatchHandler(tgsDataConsumptionSwitch, ACTIONS.SETTGSDCMACHINES);
          dispatchHandler(tesDataConsumptionSwitch, ACTIONS.SETTESDCMACHINES);
          break;
        case 'hp - heating platform - dc':
          dispatchHandler(hpElectricSwitch, ACTIONS.SETHPDCMACHINES);
          break;
        case 'hp - heating platform - ec':
          dispatchHandler(hpElectricSwitch, ACTIONS.SETHPELECTRICMACHINES);
          break;
        case 'hp - heating platform - gc':
          dispatchHandler(hpGasSwitch, ACTIONS.SETHPGASMACHINES);
          break;
        default:
          break;
      }
    }
  }, [isSearch, telemetryData]);

  // Machine name list as an array and dispatch to useReducer
  // useEffect(() => {
  //   if (isSearch) {
  //     // ESS
  //     let essLocations = [];
  //     Object.keys(flatEssSwitch).forEach((location) =>
  //       Object.entries(flatEssSwitch[location]).forEach(
  //         ([machine, machineValues]) => {
  //           if (machineValues.isSelected) {
  //             essLocations.push(`${location} - ${machine}`);
  //           }
  //         }
  //       )
  //     );

  //     dispatch({ type: ACTIONS.SETESSMACHINES, payload: essLocations });

  //     // TGS
  //     let tgsLocations = [];
  //     Object.keys(flatTgsSwitch).forEach((location) =>
  //       Object.entries(flatTgsSwitch[location]).forEach(
  //         ([machine, machineValues]) => {
  //           if (machineValues.isSelected) {
  //             tgsLocations.push(`${location} - ${machine}`);
  //           }
  //         }
  //       )
  //     );

  //     dispatch({ type: ACTIONS.SETTGSMACHINES, payload: tgsLocations });

  //     // TES
  //     let tesLocations = [];
  //     Object.keys(flatTesSwitch).forEach((location) =>
  //       Object.entries(flatTesSwitch[location]).forEach(
  //         ([machine, machineValues]) => {
  //           if (machineValues.isSelected) {
  //             tesLocations.push(`${location}-${machine}`);
  //           }
  //         }
  //       )
  //     );

  //     dispatch({ type: ACTIONS.SETTESMACHINES, payload: tesLocations });

  //     // ESS DC
  //     let essDcLocations = [];
  //     Object.keys(essDataConsumptionSwitch).forEach((location) =>
  //       Object.entries(essDataConsumptionSwitch[location]).forEach(
  //         ([machine, machineValues]) => {
  //           if (machineValues.isSelected) {
  //             essDcLocations.push(`${location} - ${machine}`);
  //           }
  //         }
  //       )
  //     );

  //     dispatch({ type: ACTIONS.SETESSDCMACHINES, payload: essDcLocations });

  //     // TGS DC
  //     let tgsDcLocations = [];
  //     Object.keys(tgsDataConsumptionSwitch).forEach((location) =>
  //       Object.entries(tgsDataConsumptionSwitch[location]).forEach(
  //         ([machine, machineValues]) => {
  //           if (machineValues.isSelected) {
  //             tgsDcLocations.push(`${location}-${machine}`);
  //           }
  //         }
  //       )
  //     );

  //     dispatch({ type: ACTIONS.SETTGSDCMACHINES, payload: tgsDcLocations });

  //     // TES DC
  //     let tesDcLocations = [];
  //     Object.keys(tesDataConsumptionSwitch).forEach((location) =>
  //       Object.entries(tesDataConsumptionSwitch[location]).forEach(
  //         ([machine, machineValues]) => {
  //           if (machineValues.isSelected) {
  //             tesDcLocations.push(`${location} - ${machine}`);
  //           }
  //         }
  //       )
  //     );

  //     dispatch({ type: ACTIONS.SETTESDCMACHINES, payload: tesDcLocations });

  //     // HP DC
  //     let hpDcLocations = [];
  //     Object.keys(hpDataConsumptionSwitch).forEach((location) =>
  //       Object.entries(hpDataConsumptionSwitch[location]).forEach(
  //         ([machine, machineValues]) => {
  //           if (machineValues.isSelected) {
  //             hpDcLocations.push(`${location}-${machine}`);
  //           }
  //         }
  //       )
  //     );

  //     dispatch({ type: ACTIONS.SETHPDCMACHINES, payload: hpDcLocations });

  //     // HP Electric
  //     let hpElectricLocations = [];
  //     Object.keys(hpElectricSwitch).forEach((location) =>
  //       Object.entries(hpElectricSwitch[location]).forEach(
  //         ([machine, machineValues]) => {
  //           if (machineValues.isSelected) {
  //             hpElectricLocations.push(`${location} - ${machine}`);
  //           }
  //         }
  //       )
  //     );

  //     dispatch({
  //       type: ACTIONS.SETHPELECTRICMACHINES,
  //       payload: hpElectricLocations,
  //     });

  //     // HP Gas
  //     let hpGasLocations = [];
  //     Object.keys(hpGasSwitch).forEach((location) =>
  //       Object.entries(hpGasSwitch[location]).forEach(
  //         ([machine, machineValues]) => {
  //           if (machineValues.isSelected) {
  //             hpGasLocations.push(`${location} - ${machine}`);
  //           }
  //         }
  //       )
  //     );

  //     dispatch({
  //       type: ACTIONS.SETHPGASMACHINES,
  //       payload: hpGasLocations,
  //     });
  //   }
  // }, [isSearch, telemetryData]);

  // ************************************************

  // testTGSLocationsAll
  // !!!TEST DATA!!!
  // let filteredSuggestions = machineSuggestions?.filter((suggestion) => {
  //   return suggestion
  //     .split(' - ')
  //     .map((el, index) => {
  //       if (index === 0) {
  //         if (testTgsLocationsAll[el]?.locationName) {
  //           return testTgsLocationsAll[el]?.locationName?.toUpperCase();
  //         }
  //         const specificLocationName = suggestion.split(' - ')[1];

  //         return testTgsLocationsAll[el][
  //           specificLocationName
  //         ]?.locationName?.toUpperCase();
  //       } else if (suggestion.split(' - ').length > 2) {
  //         const names = suggestion.split(' - ');
  //         if (index === 1) {
  //           return testTgsLocationsAll[suggestion.split(' - ')[0]][
  //             names[1]
  //           ].devices[names[2]]?.specificLocationName?.toUpperCase();
  //         }
  //         return testTgsLocationsAll[suggestion.split(' - ')[0]][
  //           names[1]
  //         ].devices[names[2]]?.machineName?.toUpperCase();

  //         // return testTgsLocationsAll[suggestion.split(' - ')[0]][
  //         //   specificLocationName
  //         // ].devices[locationName]?.machineName?.toUpperCase();
  //       } else {
  //         return testTgsLocationsAll[suggestion.split(' - ')[0]].devices[
  //           el
  //         ]?.machineName?.toUpperCase();
  //       }
  //     })
  //     .join(' - ')
  //     .includes(inputSwitchName.toUpperCase();
  // });

  const filteredSuggestions = filteredSuggestionsHandler(
    machineSuggestions,
    locations,
    inputSwitchName
  );

  // let filteredSuggestions = machineSuggestions?.filter((suggestion) => {
  //   return suggestion
  //     .split(' - ')
  //     .map((el, index) => {
  //       if (index === 0) {
  //         if (locations.all[el]?.locationName) {
  //           return locations.all[el]?.locationName?.toUpperCase();
  //         }
  //         const specificLocationName = suggestion.split(' - ')[1];

  //         return locations.all[el][
  //           specificLocationName
  //         ]?.locationName?.toUpperCase();
  //       } else if (suggestion.split(' - ').length > 2) {
  //         const names = suggestion.split(' - ');
  //         if (index === 1) {
  //           return locations.all[suggestion.split(' - ')[0]][names[1]].devices[
  //             names[2]
  //           ]?.specificLocationName?.toUpperCase();
  //         }
  //         return locations.all[suggestion.split(' - ')[0]][names[1]].devices[
  //           names[2]
  //         ]?.machineName?.toUpperCase();
  //       } else {
  //         return locations.all[suggestion.split(' - ')[0]].devices[
  //           el
  //         ]?.machineName?.toUpperCase();
  //       }
  //     })
  //     .join(' - ')
  //     .includes(inputSwitchName.toUpperCase();
  // });

  useEffect(() => {
    filteredSuggestions?.length >= 1 && inputSwitchName?.length >= 2
      ? setDisplaySuggestions(true)
      : setDisplaySuggestions(false);
  }, [filteredSuggestions, inputSwitchName]);

  const setSuggestionsHandler = (suggestions, id) => {
    setMachineSuggestions(suggestions);
    setActivatedIndex(id);
  };

  // Make suggested machine list!!
  const handleMakeSuggestions = useCallback(
    (system) => {
      if (system === 'ess') {
        setSuggestionsHandler(state.selectedEssMachines, 0);
        // setMachineSuggestions(state.selectedEssMachines);
        // setActivatedIndex(0);
      } else if (system === 'tgs') {
        setSuggestionsHandler(state.selectedTgsMachines, 1);
        // setMachineSuggestions(state.selectedTgsMachines);
        // setActivatedIndex(1);
      } else if (system === 'tes') {
        setSuggestionsHandler(state.selectedTesMachines, 2);
        // setMachineSuggestions(state.selectedTesMachines);
        // setActivatedIndex(2);
      } else if (system === 'essDc') {
        setSuggestionsHandler(state.selectedEssDcMachines, 3);
        // setMachineSuggestions(state.selectedEssDcMachines);
        // setActivatedIndex(3);
      } else if (system === 'tgsDc') {
        setSuggestionsHandler(state.selectedTgsDcMachines, 4);
        // setMachineSuggestions(state.selectedTgsDcMachines);
        // setActivatedIndex(4);
      } else if (system === 'tesDc') {
        setSuggestionsHandler(state.selectedTesDcMachines, 5);
        // setMachineSuggestions(state.selectedTesDcMachines);
        // setActivatedIndex(5);
      } else if (system === 'hpDc') {
        setSuggestionsHandler(state.selectedHpDcMachines, 6);
        // setMachineSuggestions(state.selectedHpDcMachines);
        // setActivatedIndex(6);
      } else if (system === 'hpEc') {
        setSuggestionsHandler(state.selectedHpElectricMachines, 7);
        // setMachineSuggestions(state.selectedHpElectricMachines);
        // setActivatedIndex(7);
      } else if (system === 'hpGc') {
        setSuggestionsHandler(state.selectedHpGasMachines, 8);
        // setMachineSuggestions(state.selectedHpGasMachines);
        // setActivatedIndex(8);
      }
    },
    [system]
  );
  // const handleMakeSuggestions = useCallback(
  //   (system) => {
  //     if (system === 'ess') {
  //       setMachineSuggestions(state.selectedEssMachines);
  //       setActivatedIndex(0);
  //     } else if (system === 'tgs') {
  //       setMachineSuggestions(state.selectedTgsMachines);
  //       setActivatedIndex(1);
  //     } else if (system === 'tes') {
  //       setMachineSuggestions(state.selectedTesMachines);
  //       setActivatedIndex(2);
  //     } else if (system === 'essDc') {
  //       setMachineSuggestions(state.selectedEssDcMachines);
  //       setActivatedIndex(3);
  //     } else if (system === 'tgsDc') {
  //       setMachineSuggestions(state.selectedTgsDcMachines);
  //       setActivatedIndex(4);
  //     } else if (system === 'tesDc') {
  //       setMachineSuggestions(state.selectedTesDcMachines);
  //       setActivatedIndex(5);
  //     } else if (system === 'hpDc') {
  //       setMachineSuggestions(state.selectedHpDcMachines);
  //       setActivatedIndex(6);
  //     } else if (system === 'hpEc') {
  //       setMachineSuggestions(state.selectedHpElectricMachines);
  //       setActivatedIndex(7);
  //     } else if (system === 'hpGc') {
  //       setMachineSuggestions(state.selectedHpGasMachines);
  //       setActivatedIndex(8);
  //     }
  //   },
  //   [system]
  // );

  // const handleSelectSuggestion = useCallback(
  //   (idx, suggestion, selectedSuggestion) => {
  //     const arr = [...inputSearch];
  //     arr[idx] = suggestion;

  //     if (selectedSuggestion) {
  //       const splitSuggestion = suggestion.split(' - ');
  //       const locationName = splitSuggestion[0];
  //       let specificLocationName;
  //       let machineName;

  //       let result;
  //       if (splitSuggestion.length > 2) {
  //         specificLocationName = splitSuggestion[1];
  //         machineName = splitSuggestion[2];
  //         result = ['locationName', 'specificLocationName', 'machineName']
  //           .reduce((acc, cur) => {
  //             return `${acc} - ${testLocationsAll[locationName][specificLocationName]?.devices[machineName][cur]}`;
  //           }, [])
  //           .slice(2);
  //       } else {
  //         machineName = splitSuggestion[1];
  //         result = ['locationName', 'machineName']
  //           .reduce((acc, cur) => {
  //             return `${acc} - ${testLocationsAll[locationName]?.devices[machineName][cur]}`;
  //           }, [])
  //           .slice(2);
  //       }

  //       setSearchedSwtName(arr);
  //       setInputSearch([result]);
  //     } else {
  //       setInputSearch(arr);
  //     }

  //     if (suggestion?.length >= 2) {
  //       // setIsExpand(isExpand?.fill(false);
  //       setSrc(src.fill(closeArrow);
  //       setExpandButtonTitle('expand');
  //     }
  //   },
  //   [inputSearch, locations.all, src]
  // );

  const handleSelectSuggestion = useCallback(
    (idx, suggestion, selectedSuggestion) => {
      const arr = [...inputSearch];
      arr[idx] = suggestion;

      if (selectedSuggestion) {
        const splitSuggestion = suggestion.split(' - ');
        const locationName = splitSuggestion[0];
        let specificLocationName;
        let machineName;

        let result;
        if (splitSuggestion.length > 2) {
          specificLocationName = splitSuggestion[1];
          machineName = splitSuggestion[2];
          result = ['locationName', 'specificLocationName', 'machineName']
            .reduce((acc, cur) => {
              return `${acc} - ${locations.all[locationName][specificLocationName]?.devices[machineName][cur]}`;
            }, [])
            .slice(2);
        } else {
          machineName = splitSuggestion[1];
          result = ['locationName', 'machineName']
            .reduce((acc, cur) => {
              return `${acc} - ${locations.all[locationName]?.devices[machineName][cur]}`;
            }, [])
            .slice(2);
        }

        setSearchedSwtName(arr);
        setInputSearch([result]);
      } else {
        setInputSearch(arr);
      }

      if (suggestion?.length >= 2) {
        // setIsExpand(isExpand?.fill(false);
        setSrc(src.fill(closeArrow);
        setExpandButtonTitle('expand');
      }
    },
    [inputSearch, locations.all, src]
  );

  // const handleSelectSuggestion = useCallback(
  //   (idx, suggestion, selectedSuggestion) => {
  //     const arr = [...inputSearch];
  //     arr[idx] = suggestion;

  //     if (selectedSuggestion) {
  //       const splitSuggestion = suggestion.split(' - ');
  //       const names = splitSuggestion[1].split(' -');
  //       const locationName = splitSuggestion[0];
  //       let specificLocationName;
  //       let machineName;

  //       let result;
  //       if (names.length > 1) {
  //         specificLocationName = names[0];
  //        machineName = names[1];
  //         result = ['locationName', 'specificLocationName','machineName'].reduce((acc, cur) => {
  //           return `${acc} - ${locations.all[locationName]?.devices[machineName][cur]}`;
  //         }, [])
  //         .slice(2);
  //       } else {
  //         machineName = names[0];
  //         result = ['locationName', 'machineName']
  //           .reduce((acc, cur) => {
  //             return `${acc} - ${locations.all[locationName]?.devices[machineName][cur]}`;
  //           }, [])
  //           .slice(2);

  //         }
  //         setSearchedSwtName(arr);
  //         setInputSearch([result]);
  //     } else {
  //       setInputSearch(arr);
  //     }

  //     if (suggestion?.length >= 2) {
  //       // setIsExpand(isExpand?.fill(false);
  //       setSrc(src.fill(closeArrow);
  //       setExpandButtonTitle('expand');
  //     }
  //   },
  //   [inputSearch, locations.all, src]
  // );

  const handleSelect = (suggestion) => {
    handleSelectSuggestion(0, suggestion);
    setInputSwitchName('');
    setSelectedSuggestionIdx(-1);
    setDisplaySuggestions(false);
  };

  const closeSuggestionsHandler = () => {
    setIsExpand(isExpand.fill(false);
    setSrc(src.fill(closeArrow);
    setExpandButtonTitle('expand');
  };

  const handleKeyDown = (event) => {
    switch (event.key) {
      case 'Escape': {
        setInputSearch(['']);
        break;
      }
      case 'Enter': {
        handleSelect(filteredSuggestions[selectedSuggestionIdx]);
        // // isExpand need to be closed depends on idx
        // handleSelectSuggestion(0, filteredSuggestions[selectedSuggestionIdx]);
        // setInputSwitchName('');
        // setSelectedSuggestionIdx(-1);
        // setDisplaySuggestions(false);

        // Close all locations
        if (filteredSuggestions[selectedSuggestionIdx]) {
          closeSuggestionsHandler();
          // setIsExpand(isExpand.fill(false);
          // setSrc(src.fill(closeArrow);
          // setExpandButtonTitle('expand');
        }

        break;
      }
      case 'ArrowUp': {
        selectedSuggestionIdx > 0
          ? setSelectedSuggestionIdx(selectedSuggestionIdx - 1)
          : setSelectedSuggestionIdx(filteredSuggestions.length - 1);
        break;
      }
      case 'ArrowDown': {
        selectedSuggestionIdx < filteredSuggestions.length - 1
          ? setSelectedSuggestionIdx(selectedSuggestionIdx + 1)
          : setSelectedSuggestionIdx(0);
        break;
      }
      default: {
        break;
      }
    }
  };
  // *******************auto complete logic ********************

  return (
    <ShadowWrapper>
      <Wrapper>
        <FlexDiv>
          <Title
            image={
              checkIsSystemAndSwitchesSelected &&
              (systemSwitches[0][5] === 'ess' ||
              systemSwitches[0][5] === 'essDc'
                ? essDropPinLogo
                : systemSwitches[0][5] === 'tgs'
                ? tgsDropPinLogo
                : systemSwitches[0][5] === 'tes'
                ? tesDropPinLogo
                : systemSwitches[0][5] === 'tgsDc' ||
                  systemSwitches[0][5] === 'tesDc'
                ? tgsTesDropPinLogo
                : (systemSwitches[0][5] === 'hpDc' ||
                    systemSwitches[0][5] === 'hpEc' ||
                    systemSwitches[0][5] === 'hpGc') &&
                  '')
            }
            system={checkIsSystemAndSwitchesSelected && systemSwitches[0][0]}
            consumption={
              checkIsSystemAndSwitchesSelected &&
              (systemSwitches[0][5] === 'tgs' || systemSwitches[0][5] === 'hpGc'
                ? 'gas consumption vs time'
                : systemSwitches[0][5] === 'tes' ||
                  systemSwitches[0][5] === 'hpEc' ||
                  systemSwitches[0][5] === 'ess'
                ? 'energy consumption vs time'
                : 'data consumption vs time')
            }
            time={
              checkIsSystemAndSwitchesSelected &&
              `${displayStart} - ${displayEnd}`
            }
            numUnits={
              checkIsSystemAndSwitchesSelected &&
              telemetryData?.length + ' ' + 'units'
            }
          />
          <SearchBar
            handleClearSearch={handleClearSearch}
            handleExpandSearch={handleExpandSearch}
            buttonTitle={expandButtonTitle}
            systemSwitches={systemSwitches}
            handleSelectSuggestion={handleSelectSuggestion}
            setInputSwitchName={setInputSwitchName}
            setSelectedSuggestionIdx={setSelectedSuggestionIdx}
            handleMakeSuggestions={handleMakeSuggestions}
            handleKeyDown={handleKeyDown}
            switchIdx={switchIdx}
            displaySuggestions={displaySuggestions}
            activatedIndex={activatedIndex}
            selectedSuggestionIdx={selectedSuggestionIdx}
            filteredSuggestions={filteredSuggestions}
            setDisplaySuggestions={setDisplaySuggestions}
            inputSearch={inputSearch}
            disabled={!permissions[PERMISSIONS.SEARCH_TELEMETRY]}
          />
          <SwitchSpecification
            handleClearSearch={handleClearSearch}
            systemSwitches={systemSwitches}
            isExpand={isExpand}
            src={src}
            handleExpand={handleExpandEachLocation}
            system={system}
            inputSearch={inputSearch}
            setSelectedLocations={setSelectedLocations}
            selectedLocations={selectedLocations}
            specificLocationsOpeningControl={specificLocationsOpeningControl}
            setSpecificLocationsOpeningControl={
              setSpecificLocationsOpeningControl
            }
            totalDataConsumpOrEnergyConsump={totalDataConsumpOrEnergyConsump}
            setTotalDataConsumpOrEnergyConsump={
              setTotalDataConsumpOrEnergyConsump
            }
            totalUsageHours={totalUsageHours}
            setTotalUsageHours={setTotalUsageHours}
            totalNumOfSwt={totalNumOfSwt}
            setTotalNumOfSwt={setTotalNumOfSwt}
            swtName={selectedSystem?.split(' ')[0]}
            telemetryData={telemetryData}
            isDataChanged={isDataChanged}
            isDc={isDc}
            searchedSwtName={searchedSwtName}
            setSearchedSwtName={setSearchedSwtName}
            setIsExpand={setIsExpand}
          />
        </FlexDiv>
      </Wrapper>
    </ShadowWrapper>
  );
};

export default MainSwitchesSpecifications;

const ShadowWrapper = styled.div`
  width: 1202px;
  height: auto;
  padding-top: 2px;
  padding-bottom: 2px;

  ${layerBDark}

  border-radius: 8px;
  opacity: 1;
  ${flexBoxCenter}
`;

const Wrapper = styled.div`
  width: 1198px;
  height: auto;

  ${layerA90Deg}

  border-radius: 6px;
  opacity: 1;
  ${alignItemsFlexStart}
  flex-direction: column;
  gap: 4px;
`;

const FlexDiv = styled.div`
  width: 100%;
  height: auto;
  margin-left: 3px;
`;
