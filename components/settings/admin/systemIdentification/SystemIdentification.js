import { useCallback, useEffect, useState } from 'react';
import styled, { css } from 'styled-components';
import { useTranslation } from 'react-i18next';
import { getAllAdminHeatersService } from '../../../../services';
import {
import { useSSRDescriptionStore, useSysIdentificationStore } from '../../../zustand-stores';
  getSSRsRatingListService,
  getSSRsSwitchSizesService,
  getZonesInfoForSystemIdentificationService,
} from '../../../../services/systemIdentification.service';
import {
  handleLocationsSystemIdentification,
  handleSSRRating,
  handleSwitchSize,
  selectSysIdentification,
} from '../../../store/slices/settings/admin/sysIdentificationSlice';
import {
  handleAddNewElements,
  selectDescription,
} from '../../../store/slices/ssrDescriptionSlice';
import {
  alignItemsFlexStart,
  flexBoxCenter,
  justifyContentFlexEnd,
  justifyContentFlexStart,
  justifyContentSpaceAround,
  justifyContentSpaceBetween,
  justifyContentSpaceEvenly,
  layerA,
  layerA180Deg,
  layerADark,
  layerB,
  layerCLighter,
} from '../../../styles/commonStyles';
import InvisibleDivForEditButton from '../../messageBoxes/InvisibleDivForEditButton';
import LocationDropBox from './LocationDropBox';
import SelectBox from './SelectBox';
import SSRElements from './SSRElements';
import SettingClearOkMessage from '../../messageBoxes/SettingClearOkMessage';
import FakeSelectBox from './FakeSelectBox';
import AutoCompletePlaces from './AutoCompletePlaces';
import { useRef } from 'react';
import DeleteSwitchMessageBox from '../../messageBoxes/DeleteSwitchMessageBox';
import ErrorMessageBox from '../../messageBoxes/ErrorMessageBox';
import SettingConfirmCancelMessageBox from '../../messageBoxes/SettingConfirmCancelMessageBox';
import SelectSystem from './SelectSystem';
import ConfirmedUOSInfo from './ConfirmedUOSInfo';
import InitialUOSInfo from './InitialUOSInfo';
// import { is } from 'immer/dist/internal.js';

const SystemIdentification = ({
  isCreateEditOrSave,
  setIsCreateOrEditOrSave,
  locationNameRef,
  civicAddress,
  setCivicAddress,
  specificLocation,
  setSpecificLocation,
  switches,
  setSwitches,
  handleConfirmOrSave,
  selectedLocation,
  setSelectedLocation,
  numSwitches,
  setNumSwitches,
  numOfUOS,
  setNumOfUOS,
  numOfSSR,
  setNumOfSSR,
  UOSName,
  setUOSName,
  UOSDelete,
  setUOSDelete,
  isGroupedSwitchesSaved,
  setIsGroupedSwitchesSaved,
  isConfirmed,
  setIsConfirmed,
  // specificLocationRef,
}) => {
  const { t } = useTranslation();
  const buttonTitles = ['create', 'edit', 'confirm', 'save'];

  // useState
  const [openLocationSelectBox, setOpenLocationSelectBox] = useState(false);
  const [listOfUOS, setListOfOUS] = useState([]);
  const [listOfSelectedSSR, setListOfSelectedSSR] = useState([]);
  // const [listOfGasType, setListOfGasType] = useState([]);
  const [numOfSSRSelected, setNumOfSSRSelected] = useState(0);
  const [initialStart, setInitialStart] = useState(false);
  const [expandHeatLoad, setExpandHeatLoad] = useState([]);
  const [temporaryGreenCircle, setTemporaryGreenCircle] = useState(false);
  const [openMessageBox, setOpenMessageBox] = useState(false);
  const [saveGasTypeTemporary, setSaveGasTypeTemporary] = useState({});
  const [saveSSRRatingTemporary, setSaveSSRRatingTemporary] = useState({});
  const [saveHeatingSysTemporary, setSaveHeatingSysTemporary] = useState({});
  const [saveSSRSelectedTemporary, setSaveSSRSelectedTemporary] = useState({});
  const [shortCutOfLocationName, setShortCutOfLocationName] = useState('');
  const [deleteSwitch, setDeleteSwitch] = useState(false);
  const [incorrectLocationNameFormat, setIncorrectLocationNameFormat] =
    useState(false);
  const [selectSystem, setSelectSystem] = useState(false);

  const civicAddressRef = useRef();

  // redux
    const SysIdentificationState = useSysIdentificationStore();
  const {
    locations,
    heatingSysOptions,
    switchSizeOptions,
    ssrRatingOptions,
    gasTypeOptions,
  } = SysIdentificationState;
  const { elementsOptions } = useSSRDescriptionStore();

  // handles creating the list of array[] of number of UOS, number of SSR UTS drop down list
  const handleCreateUOSAndSSRList = useCallback(
    (UOS, SSR) => {
      const createNumOfUOSArr = [];
      const createNumOfSSRArr = [];
      for (let i = 1; i <= UOS; i++) {
        if (i < 10) {
          createNumOfUOSArr.push('0' + i);
        } else createNumOfUOSArr.push(i);
      }
      for (let i = 1; i <= SSR; i++) {
        createNumOfSSRArr.push('ssr' + i);
      }
      setListOfOUS(createNumOfUOSArr);
      setListOfSelectedSSR(createNumOfSSRArr);
    },
    [numOfUOS, numOfSSR]
  );

  useEffect(() => {
    const copySwitches = [...switches];
    let sysHeating = {};
    let sysSSRRating = {};
    let sysSSRSelected = {};
    copySwitches.forEach((switches) => {
      sysHeating[switches.UOS] = Array.isArray(sysHeating[switches.UOS])
        ? [...sysHeating[switches.UOS], switches.heatingSys]
        : [switches.heatingSys];
      sysSSRRating[switches.UOS] = Array.isArray(sysSSRRating[switches.UOS])
        ? [...sysSSRRating[switches.UOS], switches.ssrRating]
        : [switches.ssrRating];
      sysSSRSelected[switches.UOS] = Array.isArray(sysSSRSelected[switches.UOS])
        ? [...sysSSRSelected[switches.UOS], switches.selectedSSR]
        : [switches.selectedSSR];
    });
    setSaveHeatingSysTemporary(sysHeating);
    setSaveSSRRatingTemporary(sysSSRRating);
    setSaveSSRSelectedTemporary(sysSSRSelected);
  }, [numSwitches]);

  useEffect(() => {
    getAllAdminHeatersService().then((res) => {
      if (res) {
        useMCStore().addNewElements(res);
      }
    });
    getSSRsSwitchSizesService().then((res) => {
      useAdminStore().setSwitchSize(res);
    });
    getSSRsRatingListService().then((res) => {
      useAdminStore().setSSRRating(res);
    });
    return () => {
      setSaveGasTypeTemporary({});
      setSaveSSRRatingTemporary({});
      setSaveHeatingSysTemporary({});
      setSaveSSRSelectedTemporary({});
    };
  }, []);

  useEffect(() => {
    getZonesInfoForSystemIdentificationService({
      structured: true,
    }).then((res) => {
      dispatch(
        handleLocationsSystemIdentification({
          data: res,
          heaterSpecs: elementsOptions,
        });
    });
  }, [elementsOptions]);

  useEffect(() => {
    setInitialStart(true);
    setSwitches([
      {
        UOS: '',
        switchName: '',
        heatingSys: '',
        gasType: '',
        SelectedSSR: [],
        application: '',
        switchSize: '',
        ssrRating: '',
        sysId: '',
        displaySelectBox: [false, false, false, false, false, false],
        deviceName: null,
        zoneId: null,
        deviceMac: null,
        type: null,
        latitude: null,
        longitude: null,
      },
    ]);
    return () => {
      setIsCreateOrEditOrSave(null);
      setIsConfirmed(false);
    };
  }, []);

  //after edit button is clicked, the useEffect will run on selecting a location name
  useEffect(() => {
    if (isCreateEditOrSave === 1 && selectedLocation && !isConfirmed) {
      const location = locations[selectedLocation.locationIdx];
      setCivicAddress(location.address);
      setSpecificLocation(selectedLocation.specificLocation || location.specificLocation);
      // setSpecificLocation(location.specificLocation);
      locationNameRef.current.value = selectedLocation.location;
      // specificLocationRef.current.value = location.specificLocation;
      // specificLocationRef.current.value = selectedLocation.specificLocation;

      // to extract the shortcut of location name
      // setShortCutOfLocationName(selectedLocation.location.split('-')[3] ?? '');
      setShortCutOfLocationName(selectedLocation.location.split('-')[2] ?? '');

      if (
        selectedLocation?.specificLocation &&
        Object.keys(location?.specificLocation)?.length > 0
      ) {
        const accessSpecificLocation =
          location.specificLocation[selectedLocation?.specificLocation];
        setNumSwitches(accessSpecificLocation.switchesNum ?? '');
        setNumOfUOS(accessSpecificLocation?.numOfUOS ?? '');
        setNumOfSSR(accessSpecificLocation?.numOfSSR ?? '');
        // creating the list of array[] of number of UOS, number of SSR UTS drop down list
        handleCreateUOSAndSSRList(
          accessSpecificLocation.numOfUOS,
          accessSpecificLocation.numOfSSR
        );
        // // !!TEST
        // setNumSwitches(location.switchesNum);
        // setNumOfUOS(location.numOfUOS);
        // setNumOfSSR(location.numOfSSR);
        // // creating the list of array[] of number of UOS, number of SSR UTS drop down list
        // handleCreateUOSAndSSRList(location.numOfUOS, location.numOfSSR);
        // // !!END
      } else {
        setNumSwitches(location.switchesNum);
        setNumOfUOS(location.numOfUOS);
        setNumOfSSR(location.numOfSSR);
        // creating the list of array[] of number of UOS, number of SSR UTS drop down list
        handleCreateUOSAndSSRList(location.numOfUOS, location.numOfSSR);
      }

      let copyLocations;
      if (selectedLocation?.specificLocation) {
        copyLocations = JSON.parse(
          JSON.stringify(
            location.specificLocation[selectedLocation.specificLocation]
              .switchInfo
          );
        // // !!TEST
        // copyLocations = JSON.parse(JSON.stringify(location.switchInfo);
        // // !!END
      } else {
        copyLocations = JSON.parse(JSON.stringify(location.switchInfo);
      }
      setSwitches(copyLocations);
    }
  }, [selectedLocation?.locationIdx, selectedLocation]);

  useEffect(() => {
    if (numOfSSR && numOfUOS && numSwitches) {
      handleNumOfSwitches();
    }
  }, [numOfSSR, numOfUOS, numSwitches]);

  // handles on  keydown 'enter'. it creates or delete switches depending the number entered at the input box of number of switches
  const handleNumOfSwitches = useCallback(() => {
    // Create
    if (isCreateEditOrSave === 0) {
      if (numSwitches === 0) {
        setSwitches([]);
      } 
      else if (numOfUOS && numOfSSR && numSwitches) {
        handleCreateUOSAndSSRList(numOfUOS, numOfSSR);
        const createSwitchesArr = [];
        for (let i = 0; i < numSwitches; i++) {
          createSwitchesArr.push({
            UOS: '',
            switchName: '',
            heatingSys: '',
            gasType: '',
            selectedSSR: [],
            application: '',
            switchSize: '',
            ssrRating: '',
            sysId: '',
            deviceName: null,
            zoneId: null,
            deviceMac: null,
            type: null,
            latitude: null,
            longitude: null,
            displaySelectBox: [false, false, false, false, false, false],
          });
        }
        setSwitches(createSwitchesArr);
      } else {
        throw new Error('Please enter # of UOS Panels and SSR QTY.');
      }
    }
    // Edit
    if (isCreateEditOrSave === 1) {
      let copySwitches = [];
      if (switches.length === 0) {
        if (selectedLocation?.specificLocation) {
          const switchInfoArr =
            locations[selectedLocation.locationIdx].specificLocation[
              selectedLocation.specificLocation
            ].switchInfo;
          if (switchInfoArr.length === 0) {
            copySwitches.push({
              UOS: '',
              switchName: '',
              heatingSys: '',
              gasType: '',
              selectedSSR: [],
              application: '',
              switchSize: '',
              ssrRating: '',
              sysId: '',
              deviceName: null,
              zoneId: null,
              deviceMac: null,
              type: null,
              latitude: null,
              longitude: null,
              displaySelectBox: [false, false, false, false, false, false],
            });
          } else {
            copySwitches = JSON.parse(JSON.stringify(switchInfoArr);
          }
        } else {
          if (
            locations[selectedLocation.locationIdx].switchInfo?.length === 0
          ) {
            copySwitches.push({
              UOS: '',
              switchName: '',
              heatingSys: '',
              gasType: '',
              selectedSSR: [],
              application: '',
              switchSize: '',
              ssrRating: '',
              sysId: '',
              deviceName: null,
              zoneId: null,
              deviceMac: null,
              type: null,
              latitude: null,
              longitude: null,
              displaySelectBox: [false, false, false, false, false, false],
            });
          } else {
            copySwitches = JSON.parse(
              JSON.stringify(locations[selectedLocation.locationIdx].switchInfo);
          }
        }

        setSwitches(copySwitches);
      } 
      else {
        const copySwitches = [...switches];
        if (numSwitches >= copySwitches.length) {
          let calSwitchNum = numSwitches - copySwitches.length;
          for (let i = 0; i < calSwitchNum; i++) {
            copySwitches.push({
              UOS: '',
              switchName: '',
              heatingSys: '',
              gasType: '',
              selectedSSR: [],
              application: '',
              switchSize: '',
              ssrRating: '',
              sysId: '',
              deviceName: null,
              zoneId: null,
              deviceMac: null,
              type: null,
              latitude: null,
              longitude: null,
              displaySelectBox: [false, false, false, false, false, false],
            });
          }

          // handleCreateUOSAndSSRList(numOfUOS, numOfSSR);
          setSwitches(copySwitches);
        } else {
          const newSwitchArr = [];
          for (let i = 0; i < numSwitches; i++) {
            newSwitchArr.push({
              UOS: '',
              switchName: '',
              heatingSys: '',
              gasType: '',
              selectedSSR: [],
              application: '',
              switchSize: '',
              ssrRating: '',
              sysId: '',
              deviceName: null,
              zoneId: null,
              deviceMac: null,
              type: null,
              latitude: null,
              longitude: null,
              displaySelectBox: [false, false, false, false, false, false],
            });
          }
          setSwitches(newSwitchArr);
        }

        handleCreateUOSAndSSRList(numOfUOS, numOfSSR);
      }
    }
  }, [numOfSSR, numOfUOS, numSwitches]);

  // open or close the drop down select boxes of switch size, heating system and SSR Rating
  const handleOpenSelectBoxes = (switchIdx, displaySelectBoxIdx) => {
    const copySwitches = [...switches];
    copySwitches[switchIdx].displaySelectBox[displaySelectBoxIdx] =
      !copySwitches[switchIdx].displaySelectBox[displaySelectBoxIdx];
    setSwitches(copySwitches);
  };

  // handles all the drop down select boxes such as switch size, heating system and SSR Rating
  const handleSelectBoxes = (switchIdx, selection, ObjKey, SelectedUOS) => {
    const copySwitches = [...switches];

    if (ObjKey === 'selectedSSR') {
      const allSelectedSSR = selection.map((ssr) => {
        return {
          [ssr]: {
            thermoCouple: 'tc-01',
            isSettingOpen: false,
            specs: [],
          },
        };
      });

      let obj = Object.assign({}, saveSSRSelectedTemporary, {
        [SelectedUOS]: allSelectedSSR,
      });
      setSaveSSRSelectedTemporary(obj);
      copySwitches[switchIdx][ObjKey] = allSelectedSSR;
    } else if (
      ObjKey === 'heatingSys' &&
      (selection === 'ess' || selection === 'tes')
    ) {
      copySwitches[switchIdx][ObjKey] = selection;
      copySwitches[switchIdx].gasType = '';
      if (selection === 'ess') {
        let newObj = Object.assign({}, saveHeatingSysTemporary, {
          [SelectedUOS]: ['ess'],
        });
        setSaveHeatingSysTemporary(newObj);
      } else {
        let newObj = Object.assign({}, saveHeatingSysTemporary, {
          [SelectedUOS]: ['tgs', 'tes'],
        });
        setSaveHeatingSysTemporary(newObj);
      }
    } else if (
      ObjKey === 'heatingSys' &&
      (selection === 'tgs' || selection === 'tgs/tes')
    ) {
      copySwitches[switchIdx][ObjKey] = selection;
      switches.forEach((switchEl, switchElIdx) => {
        if (
          switchEl.UOS === copySwitches[switchIdx].UOS &&
          !copySwitches[switchIdx].gasType
        ) {
          copySwitches[switchElIdx].gasType = saveGasTypeTemporary[SelectedUOS];
        }
      });

      let newObj = Object.assign({}, saveHeatingSysTemporary, {
        [SelectedUOS]: ['tgs', 'tes'],
      });
      setSaveHeatingSysTemporary(newObj);
    } else if (ObjKey === 'ssrRating') {
      let newObj = Object.assign({}, saveSSRRatingTemporary, {
        [SelectedUOS]: [selection],
      });
      setSaveSSRRatingTemporary(newObj);
      copySwitches[switchIdx][ObjKey] = selection;
    } else if (ObjKey === 'gasType') {
      copySwitches.forEach((switchEl) => {
        if (
          switchEl.UOS === SelectedUOS &&
          switchEl.heatingSys !== 'ess' &&
          switchEl.heatingSys !== 'tes'
        ) {
          switchEl.gasType = selection;
        }
      });
    } else {
      copySwitches[switchIdx][ObjKey] = selection;
    }

    setSwitches(copySwitches);
  };

  // handles all the input boxes of switch name, system i.d., gas type and application.
  const handleInputBoxes = (switchIdx, switchKeys, value, trackUOS) => {
    const copySwitches = [...switches];
    copySwitches[switchIdx][switchKeys] = value;
    setSwitches(copySwitches);
    if (trackUOS) {
      let newObj = Object.assign({}, saveGasTypeTemporary, {
        [trackUOS]: value,
      });
      setSaveGasTypeTemporary(newObj);
    }
  };

  // handle select box of location name when it's on Edit mode.
  const handleSelectedLocation = (location) => {
    setSelectedLocation(location);
  };

  // handle deletion of switch onClick of 'X' button
  const handleDeleteSwitch = (switchIdx) => {
    const { UOS, type, deviceMac, heatingSys } = switches[switchIdx];
    setUOSDelete((prev) => [
      ...prev,
      {
        UOS,
        type: type || heatingSys.includes('ess') ? 'switch' : 'blower',
        device_mac: deviceMac,
      },
    ]);
    const copySwitches = [...switches];
    copySwitches.splice(switchIdx, 1);
    setNumSwitches(copySwitches.length);
    setSwitches(copySwitches);
    setDeleteSwitch([false]);
    return;
  };

  const handleDeleteSwitchMessageBox = (propArr) => {
    if (propArr[0]) {
      handleDeleteSwitch(propArr[1]);
    } else setDeleteSwitch([false]);
  };

  const [openConfirmMessageBox, setOpenConfirmMessageBox] = useState(false);
  // handle confirm button message box
  const confirmButtonMessageBoxHandler = (index) => {
    // regex pattern to match 2 dashes
    const pattern = /^.*-.*-.*$/;
    if (
      pattern.test(locationNameRef.current.value) &&
      Number(numSwitches) !== 0 &&
      switches.every((el) => el.UOS)
    ) {
      // Input box has 2 dashes
      // sort switches by group of UOS #
      const sortedUOSArr = [];
      const UOSNameArr = [];
      const expandHeatLoadArr = [];

      new Array(+numOfUOS).fill(0).forEach((emptyArr, idx) => {
        const numUOS = idx + 1;
        const numStr = numUOS < 10 ? '0' + numUOS : toString(numUOS);
        const filteredResult = switches.filter((el) => el.UOS === numStr);

        sortedUOSArr.push(filteredResult);
        expandHeatLoadArr.push(false);

        //  grouping all the switches specs info to create the UOS name
        const displayEl = filteredResult.reduce(
          (
            acc,
            { switchName, switchSize, application, heatingSys, gasType }
          ) => {
            if (heatingSys === 'tgs/tes') {
              const elSplit = heatingSys.split('/');

              return (
                `${acc}` +
                // `/${switchName} ${switchSize} ${application} ${elSplit[0]}:${gasType}-${elSplit[1]}` remove heatingSys from naming 
                `/ ${switchName} ${switchSize} ${application}:${gasType}`
              );
            } else if (heatingSys === 'tgs') {
              return (
                `${acc}` +
                `/ ${switchName} ${switchSize} ${application}:${gasType}`
              );
            } else {
              return (
                `${acc}` +
                `/ ${switchName} ${switchSize} ${application}`
              );
            }
          },
          []
        );

        UOSNameArr.push(displayEl);
      });

      setIsConfirmed(true);
      setUOSName(UOSNameArr);
      setSwitches(sortedUOSArr);
      setExpandHeatLoad(expandHeatLoadArr);
      setIsGroupedSwitchesSaved(expandHeatLoadArr);
      setTemporaryGreenCircle(index);
      setShortCutOfLocationName(
        locationNameRef.current.value.split('-')[2] ?? ''
      );
      setOpenConfirmMessageBox(false);
    } else {
      // Input box does not have 2 dashes
      setIncorrectLocationNameFormat(true);
    }
  };

  // handles 4 buttons create, edit, confirm and save
  const handleButtons = (index) => {
    // regex pattern to match 2 dashes
    // const pattern = /^.*-.*-.*$/;

    // Create button and Edit button
    if (index === 0 && !openMessageBox && isCreateEditOrSave === 0) {
      // if the user click "create" button already, we don't want the user to erase everything they wrote. this is a prevention for that to happen. so we created a message box in  between as a buffer.
      setOpenMessageBox(true);
    } else if (index === 0 || index === 1) {
      setSwitches([
        {
          UOS: '',
          switchName: '',
          heatingSys: '',
          gasType: '',
          selectedSSR: [],
          application: '',
          switchSize: '',
          ssrRating: '',
          sysId: '',
          deviceName: null,
          zoneId: null,
          deviceMac: null,
          type: null,
          latitude: null,
          longitude: null,
          displaySelectBox: [false, false, false, false, false, false],
        },
      ]);
      setNumOfUOS('');
      setNumOfSSR('');
      setNumSwitches('');
      setCivicAddress('');
      setSpecificLocation('');
      setIsCreateOrEditOrSave(index);
      setIsConfirmed(false);
      setSelectedLocation(null);
    }

    // Confirm button
    else if (index === 2) {
      // else if (
      //   index === 2 &&
      //   Number(numSwitches) !== 0 &&
      //   switches.every((el) => el.UOS)
      // ) {

      // if (
      //   pattern.test(locationNameRef.current.value) &&
      //   Number(numSwitches) !== 0 &&
      //   switches.every((el) => el.UOS)
      // ) {
      //   // Input box has 2 dashes
      //   // sort switches by group of UOS #
      //   const sortedUOSArr = [];
      //   const UOSNameArr = [];
      //   const expandHeatLoadArr = [];

      //   new Array(+numOfUOS).fill(0).forEach((emptyArr, idx) => {
      //     const numUOS = idx + 1;
      //     const numStr = numUOS < 10 ? '0' + numUOS : toString(numUOS);
      //     const filteredResult = switches.filter((el) => el.UOS === numStr);

      //     sortedUOSArr.push(filteredResult);
      //     expandHeatLoadArr.push(false);

      //     //  grouping all the switches specs info to create the UOS name
      //     const displayEl = filteredResult.reduce(
      //       (
      //         acc,
      //         { switchName, switchSize, application, heatingSys, gasType }
      //       ) => {
      //         if (heatingSys === 'tgs/tes') {
      //           const elSplit = heatingSys.split('/');

      //           return (
      //             `${acc}` +
      //             `/${switchName} ${switchSize} ${application} ${elSplit[0]}:${gasType}-${elSplit[1]}`
      //           );
      //         } else if (heatingSys === 'tgs') {
      //           return (
      //             `${acc}` +
      //             `/${switchName} ${switchSize} ${application} ${heatingSys}:${gasType}`
      //           );
      //         } else {
      //           return (
      //             `${acc}` +
      //             `/${switchName} ${switchSize} ${application} ${heatingSys}`
      //           );
      //         }
      //       },
      //       []
      //     );

      //     UOSNameArr.push(displayEl);
      //   });

      //   setIsConfirmed(true);
      //   setUOSName(UOSNameArr);
      //   setSwitches(sortedUOSArr);
      //   setExpandHeatLoad(expandHeatLoadArr);
      //   setIsGroupedSwitchesSaved(expandHeatLoadArr);
      //   setTemporaryGreenCircle(index);
      //   setShortCutOfLocationName(
      //     locationNameRef.current.value.split('-')[2] ?? ''
      //   );
      // } else {
      //   // Input box does not have 2 dashes
      //   setIncorrectLocationNameFormat(true);
      // }

      setOpenConfirmMessageBox(true);
    }

    // save button
    else if (index === 3 && Number(numSwitches) === 0) {
      handleConfirmOrSave(3, 'deleteLocation');
      setTemporaryGreenCircle(index);
      // setIsCreateOrEditOrSave(null);
    } else {
      handleConfirmOrSave(3);
      if (isGroupedSwitchesSaved.length > 0) {
        handleConfirmOrSave(3, 'allTheUOSSaved');
        const allGroupedSwitchesSaved = isGroupedSwitchesSaved.map(
          (groupedEl) => true
        );
        setIsGroupedSwitchesSaved(allGroupedSwitchesSaved);
        setTemporaryGreenCircle(index);
      }
      // setIsCreateOrEditOrSave(null);
    }
  };

  useEffect(() => {
    const handleTemporaryGreenCircle = setTimeout(() => {
      setTemporaryGreenCircle(false);
    }, 500);

    return () => clearTimeout(handleTemporaryGreenCircle);
  }, [temporaryGreenCircle === 3]);

  const handleExpandHeatLoadConfiguration = (groupSwitchesIdx) => {
    const copyExpandHeatLoad = [...expandHeatLoad];
    copyExpandHeatLoad[groupSwitchesIdx] =
      !copyExpandHeatLoad[groupSwitchesIdx];
    setExpandHeatLoad(copyExpandHeatLoad);
  };

  const handleSaveButtonOfEachUOS = (groupedIdx) => {
    const copyIsGroupedSwitchesSaved = [...isGroupedSwitchesSaved];
    copyIsGroupedSwitchesSaved[groupedIdx] = true;
    setIsGroupedSwitchesSaved(copyIsGroupedSwitchesSaved);
    handleConfirmOrSave(3, 'someUOSSaved');
    handleExpandHeatLoadConfiguration(groupedIdx);
  };

  const selectSystemHandler = (systemIdx) => {
    if (systemIdx === 0) {
      setSelectSystem(true);
    } else {
      setSelectSystem(false);
    }
  };

  const getAvailableSSRs = (currentSwitchIdx, currentUOS) => {
    const usedSSRs = new Set();
    switches.forEach((switch_, idx) => {
      if (idx !== currentSwitchIdx && switch_.UOS === currentUOS) {
        switch_.selectedSSR.forEach(ssr => {
          usedSSRs.add(Object.keys(ssr)[0]);
        });
      }
    });

    return listOfSelectedSSR.filter(ssr => !usedSSRs.has(ssr);
  };

  return (
    <BaseLayer>
      <Wrapper>
        <TitleWrapper>
          <Title>{t('settings.systemIdentification')}</Title>
        </TitleWrapper>
        {/* location, address, switches and close button */}
        <ContentBaseLayer>
          {isCreateEditOrSave === null && (
            <EditBoxWrapper>
              <InvisibleDivForEditButton
                height={'92px'}
                width={'820px'}
                isSystemIdentification={true}
              />
            </EditBoxWrapper>
          )}
          <ContentWrapper>
            <FlexSpaceEvenlyWrapper>
              {/* system select box */}
              <SelectSystem selectSystemHandler={selectSystemHandler} />
              {/* location name */}
              <IndivFlex location={true}>
                <SubTitle>location name</SubTitle>
                {/* when Create button is clicked*/}
                {isCreateEditOrSave === 0 ? (
                  <ContentInput
                    type='text'
                    location={true}
                    ref={locationNameRef}
                  ></ContentInput>
                ) : isCreateEditOrSave === 1 ? (
                  <LocationDropDownWrapper>
                    <LocationDiv>
                      {/* when Edit button is clicked*/}
                      {selectedLocation ? (
                        <ContentInput
                          text='text'
                          location={true}
                          ref={locationNameRef}
                        ></ContentInput>
                      ) : (
                        <>
                          <LocationNameSelectBoxWrapper>
                            <LocationNameSelectBoxDisplay>
                              select
                            </LocationNameSelectBoxDisplay>
                            <Img
                              margin={true}
                              src={
                                './images/settings-sysIdentification-whiteTriangle.svg'
                              }
                              onClick={() =>
                                setOpenLocationSelectBox(!openLocationSelectBox)
                              }
                            />
                          </LocationNameSelectBoxWrapper>
                        </>
                      )}
                    </LocationDiv>
                    {/* drop box of select location */}
                    {!selectedLocation && openLocationSelectBox && (
                      <WrapperDropBox>
                        <LocationDropBox
                          locations={locations}
                          openLocationSelectBox={openLocationSelectBox}
                          setOpenLocationSelectBox={setOpenLocationSelectBox}
                          handleSelectedLocation={handleSelectedLocation}
                        />
                      </WrapperDropBox>
                    )}
                  </LocationDropDownWrapper>
                ) : (
                  <FakeContentInput>
                    {selectedLocation?.location}
                  </FakeContentInput>
                )}
              </IndivFlex>
              {/* specific location name */}
              <IndivFlex specificLocation={true}>
                <SubTitle>specific location name</SubTitle>
                <ContentInput
                  required
                  min='3'
                  type='text'
                  specificLocation={true}
                  name='specific location'
                  value={specificLocation}
                  onChange={(e) => setSpecificLocation(e.target.value)}
                  // ref={specificLocationRef}
                ></ContentInput>
              </IndivFlex>
            </FlexSpaceEvenlyWrapper>
            <FlexStartWrapper>
              <Flex>
                {/* number of UOS panels */}
                <IndivFlex isUOS={true}>
                  <SubTitle>number of uos panels</SubTitle>
                  <ContentInput
                    type='number'
                    isUOS={true}
                    value={numOfUOS}
                    onChange={(e) => setNumOfUOS(Number(e.target.value))}
                  ></ContentInput>
                </IndivFlex>
                {/* number of ssr */}
                <IndivFlex isSSR={true}>
                  <SubTitle>ssr qty.</SubTitle>
                  <ContentInput
                    type='number'
                    isSSR={true}
                    value={numOfSSR}
                    onChange={(e) => setNumOfSSR(Number(e.target.value))}
                  ></ContentInput>
                </IndivFlex>
                {/* number of switches */}
                <IndivFlex switches={true}>
                  <SubTitle switches={true}>
                    {selectSystem ? 'number of zones' : 'number of switches'}
                  </SubTitle>
                  <ContentInput
                    type='number'
                    switches={true}
                    value={numSwitches}
                    onChange={(e) => setNumSwitches(+e.target.value)}
                  ></ContentInput>
                </IndivFlex>
              </Flex>
              <Flex isCivilAddress={true}>
                {/* civic address */}
                <IndivFlex address={true}>
                  <SubTitle>civic address</SubTitle>
                  <ContentInput
                    type='text'
                    address={true}
                    value={civicAddress}
                    onChange={(e) => setCivicAddress(e.target.value)}
                    ref={civicAddressRef}
                  ></ContentInput>
                  <AutoCompletePlaces
                    civicAddress={civicAddress}
                    setCivicAddress={setCivicAddress}
                    inputRef={civicAddressRef}
                  />
                </IndivFlex>
              </Flex>
            </FlexStartWrapper>
            {/* switches info titles */}
            <FlexSwitches>
              <SwitchTitlesWrapper>
                <SubTitle isUOS={true}>uos</SubTitle>
                {selectSystem ? (
                  <>
                    <SubTitle isZoneName={true}>zone name</SubTitle>
                    <SubTitle isSegment={true}>segment</SubTitle>
                  </>
                ) : (
                  <>
                    <SubTitle isSwitchName={true}>switch name</SubTitle>
                    <SubTitle isSwitchSize={true}>switch size</SubTitle>
                  </>
                )}
                <SubTitle isSysId={true}> system i.d.</SubTitle>
                <SubTitle isHeatingSys={true}>heating system</SubTitle>
                <SubTitle isGasType={true}>gas type</SubTitle>
                <SubTitle isSelectedSSR={true}>ssr qty.</SubTitle>
                <SubTitle isSsrRating={true}>ssr rating</SubTitle>
                {/* <SubTitle isApp={true}>application</SubTitle> */}
              </SwitchTitlesWrapper>
              {/* below check if the confirm button is clicked   */}
              {/* confirm button is set to true */}

              {isConfirmed ? (
                <>
                  <ConfirmedUOSInfo
                    selectSystem={selectSystem}
                    data={switches}
                    switchSizeOptions={switchSizeOptions}
                    isCreateEditOrSave={isCreateEditOrSave}
                    saveHeatingSysTemporary={saveHeatingSysTemporary}
                    heatingSysOptions={heatingSysOptions}
                    listOfSelectedSSR={listOfSelectedSSR}
                    setNumOfSSRSelected={setNumOfSSRSelected}
                    numOfSSRSelected={numOfSSRSelected}
                    saveSSRRatingTemporary={saveSSRRatingTemporary}
                    ssrRatingOptions={ssrRatingOptions}
                    expandHeatLoad={expandHeatLoad}
                    setSwitches={setSwitches}
                    switches={switches}
                    shortCutOfLocationName={shortCutOfLocationName}
                    UOSName={UOSName}
                    handleSaveButtonOfEachUOS={handleSaveButtonOfEachUOS}
                    handleExpandHeatLoadConfiguration={
                      handleExpandHeatLoadConfiguration
                    }
                  />
                </>
              ) : (
                <>
                  {initialStart && (
                    <InitialUOSInfo
                      selectSystem={selectSystem}
                      data={switches}
                      switchSizeOptions={switchSizeOptions}
                      isCreateEditOrSave={isCreateEditOrSave}
                      saveHeatingSysTemporary={saveHeatingSysTemporary}
                      saveSSRSelectedTemporary={saveSSRSelectedTemporary}
                      heatingSysOptions={heatingSysOptions}
                      listOfSelectedSSR={(switchIdx, UOS) => getAvailableSSRs(switchIdx, UOS)}
                      handleOpenSelectBoxes={handleOpenSelectBoxes}
                      handleSelectBoxes={handleSelectBoxes}
                      listOfUOS={listOfUOS}
                      ssrRatingOptions={ssrRatingOptions}
                      handleInputBoxes={handleInputBoxes}
                      gasTypeOptions={gasTypeOptions}
                      setDeleteSwitch={setDeleteSwitch}
                      deleteSwitch={deleteSwitch}
                    />
                  )}
                </>
              )}
            </FlexSwitches>
          </ContentWrapper>
        </ContentBaseLayer>
        ){/* 4 buttons create, edit, confirm and save */}
        <GroupButtonsFlexEnd>
          <GroupButtonsBaseLayer1>
            <GroupButtonsBaseLayer2>
              <GroupButtonsWrapper>
                {buttonTitles.map((title, index) => {
                  return (
                    <Button
                      isSelectedColor={
                        isCreateEditOrSave === index ||
                        temporaryGreenCircle === index
                      }
                      key={index}
                      onClick={() => {
                        handleButtons(index);
                      }}
                    >
                      <ButtonHole>
                        <ButtonTop>
                          <ButtonTitle>{title}</ButtonTitle>
                        </ButtonTop>
                      </ButtonHole>
                    </Button>
                  );
                })}
              </GroupButtonsWrapper>
            </GroupButtonsBaseLayer2>
          </GroupButtonsBaseLayer1>
        </GroupButtonsFlexEnd>
        {openMessageBox && (
          <>
            <SettingClearOkMessage
              onClose={() => setOpenMessageBox(false)}
              title={'create button clicked'}
              message={
                'if you wish to continue to create your system identification please click "ok" else click "clear" to erase everything.'
              }
              onClear={() => {
                handleButtons(0);
                setOpenMessageBox(false);
              }}
            />
          </>
        )}
        {/* message box popup when click on "X" button */}
        {deleteSwitch[0] && (
          <MessageBoxWrapper>
            <DeleteSwitchMessageBox
              title={`${t('settings.title')}/${t('settings.systemIdentification')}`}
              subtitle={t('settings.admin')}
              theme={t('settings.systemIdentification')}
              messages={[
                `you are about to delete switch ${
                  switches[deleteSwitch[1]]?.switchName
                } & change the configuration`,
              ]}
              onClose={() => handleDeleteSwitchMessageBox([])}
              onDelete={() => handleDeleteSwitchMessageBox(deleteSwitch)}
            />
          </MessageBoxWrapper>
        )}
        {/* message box for missing information of input box location name. eg: the format needs to have 2 dashes  */}
        {incorrectLocationNameFormat && (
          <MessageBoxWrapper isLocationName={true}>
            <ErrorMessageBox
              // title={'missing information'}
              message={{
                content:
                  'missing civic address or input location name format is incorrect. please follow this format: "company name shortcut-location name-location name shortcut"',
                title: 'settings',
                subtitle: 'administration settings',
                theme: 'wrong format',
              }}
              handleClose={() => setIncorrectLocationNameFormat(false)}
            />
          </MessageBoxWrapper>
        )}
        {openConfirmMessageBox && (
          <MessageBoxWrapper isLocationName={true}>
            <SettingConfirmCancelMessageBox
              onCancel={() => setOpenConfirmMessageBox(false)}
              message={{
                title: 'settings',
                subtitle: 'administration settings',
                theme: 'confirmation',
                message: [
                  'are you sure you want to confirm? once it is confirmed, the data above can no longer be modified.',
                ],
              }}
              onConfirm={() => confirmButtonMessageBoxHandler(2)}
            />
          </MessageBoxWrapper>
        )}
      </Wrapper>
    </BaseLayer>
  );
};

export default SystemIdentification;

//  after Confirmed use the code below

// {switches?.map((groupedSwitches, groupedIdx) => {
//   return (
//     <div key={groupedSwitches[0]?.sysId + groupedIdx}>
//       <SortedUOSGroupWrapper>
//         <FlexRow isFlexStart={true}>
//           <UOSDisplay>
//             {groupedIdx < 9
//               ? '0' + (Number(groupedIdx) + 1)
//               : toString(Number(groupedIdx) + 1)}
//           </UOSDisplay>
//           <FlexRow isFlexColumn={true}>
//             {groupedSwitches?.map(
//               (
//                 {
//                   UOS,
//                   switchName,
//                   switchSize,
//                   sysId,
//                   heatingSys,
//                   gasType,
//                   selectedSSR,
//                   ssrRating,
//                   application,
//                   displaySelectBox,
//                 },
//                 idx
//               ) => {
//                 return (
//                   <FlexRow key={switchName}>
//                     <SwitchesBaseLayer isGrouped={true}>
//                       <SwitchesWrapper isGrouped={true}>
//                         {/* switch name */}
//                         <SwitchesInputBox
//                           isGrouped={true}
//                           type='text'
//                           esInputBox
//                           switchName={true}
//                           value={switchName}
//                           readOnly={true}
//                           // onChange={(e) =>
//                           //   handleInputBoxes(
//                           //     idx,
//                           //     'switchName',
//                           //     e.target.value,
//                           //     groupedIdx
//                           //   )
//                           // }
//                         ></SwitchesInputBox>

//                         {/* switch size */}
//                         <SelectBox
//                           isSwitchSize={true}
//                           displaySelectBox={
//                             displaySelectBox[1]
//                           }
//                           switchIdx={idx}
//                           // handleOpenSelectBoxes={() =>
//                           //   handleOpenSelectBoxes(idx, 1)
//                           // }
//                           selectBoxFor={'switchSize'}
//                           // handleSelectBoxes={
//                           //   handleSelectBoxes
//                           // }
//                           selected={switchSize}
//                           content={switchSizeOptions}
//                           isCreateEditOrSave={
//                             isCreateEditOrSave === 0 ||
//                             isCreateEditOrSave === 1
//                           }
//                           buttonTitle={'add size'}
//                         />

//                         {/* system i.d. */}
//                         <SwitchesInputBox
//                           type='number'
//                           systemId={true}
//                           value={sysId ? sysId : 'undefined'}
//                           readOnly={true}
//                           // onChange={(e) =>
//                           //   handleInputBoxes(
//                           //     idx,
//                           //     'sysId',
//                           //     e.target.value
//                           //   )
//                           // }
//                         ></SwitchesInputBox>

//                         {/* heating system */}
//                         <SelectBox
//                           isHeatingSys={true}
//                           displaySelectBox={
//                             displaySelectBox[2]
//                           }
//                           switchIdx={idx}
//                           // handleOpenSelectBoxes={() =>
//                           //   handleOpenSelectBoxes(idx, 2)
//                           // }
//                           // handleSelectBoxes={
//                           //   handleSelectBoxes
//                           // }
//                           selected={heatingSys}
//                           content={
//                             saveHeatingSysTemporary[UOS]
//                               ? saveHeatingSysTemporary[UOS]
//                               : heatingSysOptions
//                           }
//                           selectBoxFor={'heatingSys'}
//                           clearButtonTitle={'clear'}
//                           isMultipleSelections={true}
//                         />

//                         {/* Gas Type */}
//                         {heatingSys === 'ess' ||
//                         heatingSys === 'tes' ? (
//                           <FakeContentInput
//                             isGasType={true}
//                           ></FakeContentInput>
//                         ) : (
//                           <SwitchesInputBox
//                             type='text'
//                             gasType={true}
//                             value={gasType}
//                             readOnly={true}
//                             // onChange={(e) =>
//                             //   handleInputBoxes(
//                             //     idx,
//                             //     'gasType',
//                             //     e.target.value
//                             //   )
//                             // }
//                           ></SwitchesInputBox>
//                         )}

//                         {/* SSR QTY */}
//                         <SelectBox
//                           isSSRUnits={true}
//                           displaySelectBox={
//                             displaySelectBox[3]
//                           }
//                           switchIdx={idx}
//                           // handleOpenSelectBoxes={() =>
//                           //   handleOpenSelectBoxes(idx, 3)
//                           // }
//                           // handleSelectBoxes={
//                           //   handleSelectBoxes
//                           // }
//                           selected={
//                             selectedSSR.length > 0 &&
//                             selectedSSR.length < 10
//                               ? selectedSSR.length > 0
//                                 ? '0' + selectedSSR.length
//                                 : selectedSSR.length
//                               : ''
//                           }
//                           allSelections={selectedSSR}
//                           content={listOfSelectedSSR}
//                           selectBoxFor={'selectedSSR'}
//                           clearButtonTitle={'clear'}
//                           isMultipleSelections={true}
//                         />

//                         {/* SSR rating  */}
//                         <SelectBox
//                           isSSRRating={true}
//                           displaySelectBox={
//                             displaySelectBox[4]
//                           }
//                           switchIdx={idx}
//                           // handleOpenSelectBoxes={() =>
//                           //   handleOpenSelectBoxes(idx, 4)
//                           // }
//                           // handleSelectBoxes={
//                           //   handleSelectBoxes
//                           // }
//                           selected={ssrRating}
//                           content={
//                             saveSSRRatingTemporary[UOS]
//                               ? saveSSRRatingTemporary[UOS]
//                               : ssrRatingOptions
//                           }
//                           selectBoxFor={'ssrRating'}
//                           isCreateEditOrSave={
//                             isCreateEditOrSave === 0 ||
//                             isCreateEditOrSave === 1
//                           }
//                           buttonTitle={'add ssr rating'}
//                         />

//                         {/* application */}
//                         <SwitchesInputBox
//                           type='text'
//                           application={true}
//                           value={application}
//                           readOnly={true}
//                           // onChange={(e) =>
//                           //   handleInputBoxes(
//                           //     idx,
//                           //     'application',
//                           //     e.target.value
//                           //   )
//                           // }
//                         ></SwitchesInputBox>
//                         {/* ********  */}
//                       </SwitchesWrapper>
//                     </SwitchesBaseLayer>

//                     {/* X button to delete switch */}
//                     {(isCreateEditOrSave === 1 ||
//                       isCreateEditOrSave === 0) && (
//                       <XButtonWrapper
//                       // onClick={() =>
//                       //   handleDeleteSwitch(idx)
//                       // }
//                       >
//                         <XButton>
//                           <XButtonTop>
//                             <Img
//                               src={
//                                 './images/settings-admin-sysIdentification-whiteX.svg'
//                               }
//                               margin={'x'}
//                             />
//                           </XButtonTop>
//                         </XButton>
//                       </XButtonWrapper>
//                     )}
//                   </FlexRow>
//                 );
//               }
//             )}
//           </FlexRow>
//         </FlexRow>

//         {/* expanded Heat Load Configuration */}
//         {expandHeatLoad[groupedIdx] && (
//           <>
//             <Title isHeatLoad={true}>
//               heat load configuration
//             </Title>
//             <SSRElementsWrapper>
//               <SSRElements
//                 SSRList={listOfSelectedSSR}
//                 groupedSwitches={groupedSwitches}
//                 groupedIdx={groupedIdx}
//                 setSwitches={setSwitches}
//                 switches={switches}
//               />
//             </SSRElementsWrapper>
//           </>
//         )}

//         {/* !!! display UOS name and Heat load configuration button!!! */}
//         <FlexRow
//           isLastRow={
//             expandHeatLoad[groupedIdx] ? 'sorted' : true
//           }
//         >
//           <DisplayUOSName>
//             <UOSNameP>
//               {shortCutOfLocationName} -{' '}
//               {UOSName[groupedIdx].slice(1)}
//             </UOSNameP>
//           </DisplayUOSName>
//           {expandHeatLoad[groupedIdx] ? (
//             <HeatLoadButtonWrapper isApply={true}>
//               <HeatLoadButton
//                 isApply={true}
//                 onClick={() => {
//                   handleSaveButtonOfEachUOS(groupedIdx);
//                 }}
//               >
//                 <HeatLoadButtonIndent isApply={true}>
//                   <HeatLoadButtonTop isApply={true}>
//                     <HeatLoadSpan>save</HeatLoadSpan>
//                   </HeatLoadButtonTop>
//                 </HeatLoadButtonIndent>
//               </HeatLoadButton>
//             </HeatLoadButtonWrapper>
//           ) : (
//             <HeatLoadButtonWrapper>
//               <HeatLoadButton
//                 onClick={() =>
//                   handleExpandHeatLoadConfiguration(
//                     groupedIdx
//                   )
//                 }
//               >
//                 <HeatLoadButtonIndent>
//                   <HeatLoadButtonTop>
//                     <HeatLoadSpan>
//                       heat load configuration
//                     </HeatLoadSpan>
//                   </HeatLoadButtonTop>
//                 </HeatLoadButtonIndent>
//               </HeatLoadButton>
//             </HeatLoadButtonWrapper>
//           )}
//         </FlexRow>
//       </SortedUOSGroupWrapper>
//     </div>
//   );
// })}

///////////////////////////////////////////////////////

// Initial state use the code below

// switches?.map(
//   (
//     {
//       UOS,
//       switchName,
//       switchSize,
//       sysId,
//       heatingSys,
//       gasType,
//       selectedSSR,
//       ssrRating,
//       application,
//       displaySelectBox,
//     },
//     idx
//   ) => {
//     return (
//       <FlexRow key={idx}>
//         <SwitchesBaseLayer>
//           <SwitchesWrapper>
//             {/* UOS */}
//             <SelectBox
//               isUOS={true}
//               displaySelectBox={displaySelectBox?.[0]}
//               switchIdx={idx}
//               handleOpenSelectBoxes={() =>
//                 handleOpenSelectBoxes(idx, 0)
//               }
//               handleSelectBoxes={handleSelectBoxes}
//               selected={UOS}
//               content={listOfUOS}
//               selectBoxFor={'UOS'}
//             />

//             {/* switch name */}
//             <SwitchesInputBox
//               type='text'
//               esInputBox
//               switchName={true}
//               value={switchName}
//               onChange={(e) =>
//                 handleInputBoxes(
//                   idx,
//                   'switchName',
//                   e.target.value
//                 )
//               }
//             ></SwitchesInputBox>
//             {/* switch size */}
//             <SelectBox
//               isSwitchSize={true}
//               displaySelectBox={displaySelectBox[1]}
//               switchIdx={idx}
//               handleOpenSelectBoxes={() =>
//                 handleOpenSelectBoxes(idx, 1)
//               }
//               selectBoxFor={'switchSize'}
//               handleSelectBoxes={handleSelectBoxes}
//               selected={switchSize}
//               content={switchSizeOptions}
//               isCreateEditOrSave={
//                 isCreateEditOrSave === 0 ||
//                 isCreateEditOrSave === 1
//               }
//               buttonTitle={'add size'}
//             />

//             {/* system i.d. */}
//             <SwitchesInputBox
//               type='number'
//               readOnly={true}
//               systemId={true}
//               value={sysId ? sysId : 'undefined'}
//               // onChange={(e) =>
//               //   handleInputBoxes(
//               //     idx,
//               //     'sysId',
//               //     e.target.value
//               //   )
//               // }
//             ></SwitchesInputBox>

//             {/* heating system */}
//             <SelectBox
//               isHeatingSys={true}
//               displaySelectBox={displaySelectBox[2]}
//               switchIdx={idx}
//               handleOpenSelectBoxes={() =>
//                 handleOpenSelectBoxes(idx, 2)
//               }
//               handleSelectBoxes={handleSelectBoxes}
//               selected={heatingSys}
//               content={
//                 saveHeatingSysTemporary[UOS]
//                   ? saveHeatingSysTemporary[UOS]
//                   : heatingSysOptions
//               }
//               selectBoxFor={'heatingSys'}
//               clearButtonTitle={'clear'}
//               isMultipleSelections={true}
//               selectedUOS={UOS}
//             />

//             {/* Gas Type */}
//             {heatingSys === 'ess' ||
//             heatingSys === 'tes' ? (
//               <FakeContentInput
//                 isGasType={true}
//               ></FakeContentInput>
//             ) : (
//               <SelectBox
//                 isGasType={true}
//                 displaySelectBox={displaySelectBox[5]}
//                 switchIdx={idx}
//                 handleOpenSelectBoxes={() =>
//                   handleOpenSelectBoxes(idx, 5)
//                 }
//                 handleSelectBoxes={handleSelectBoxes}
//                 selected={gasType}
//                 content={gasTypeOptions}
//                 selectBoxFor={'gasType'}
//                 isCreateEditOrSave={
//                   isCreateEditOrSave === 0 ||
//                   isCreateEditOrSave === 1
//                 }
//                 buttonTitle={'add gas type'}
//                 selectedUOS={UOS}
//               />
//             )}

//             {/* SSR QTY. */}
//             {heatingSys === 'tgs' ? (
//               <FakeSelectBox isSSRUnits={true} />
//             ) : (
//               <SelectBox
//                 isSSRUnits={true}
//                 displaySelectBox={displaySelectBox[3]}
//                 switchIdx={idx}
//                 handleOpenSelectBoxes={() =>
//                   handleOpenSelectBoxes(idx, 3)
//                 }
//                 handleSelectBoxes={handleSelectBoxes}
//                 selected={
//                   selectedSSR &&
//                   selectedSSR.length > 0 &&
//                   selectedSSR.length < 10
//                     ? selectedSSR.length > 0
//                       ? '0' + selectedSSR.length
//                       : selectedSSR.length
//                     : ''
//                 }
//                 allSelections={selectedSSR}
//                 content={listOfSelectedSSR}
//                 selectBoxFor={'selectedSSR'}
//                 clearButtonTitle={'clear'}
//                 isMultipleSelections={true}
//               />
//             )}

//             {/* SSR rating  */}
//             {heatingSys === 'tgs' ? (
//               <FakeSelectBox isSSRRating={true} />
//             ) : (
//               <SelectBox
//                 isSSRRating={true}
//                 displaySelectBox={displaySelectBox[4]}
//                 switchIdx={idx}
//                 handleOpenSelectBoxes={() =>
//                   handleOpenSelectBoxes(idx, 4)
//                 }
//                 handleSelectBoxes={handleSelectBoxes}
//                 selected={ssrRating}
//                 content={
//                   // saveSSRRatingTemporary[UOS]
//                   //   ? saveSSRRatingTemporary[UOS]
//                   //   :
//                   ssrRatingOptions
//                 }
//                 selectBoxFor={'ssrRating'}
//                 isCreateEditOrSave={
//                   isCreateEditOrSave === 0 ||
//                   isCreateEditOrSave === 1
//                 }
//                 buttonTitle={'add ssr rating'}
//                 selectedUOS={UOS}
//               />
//             )}

//             {/* application */}
//             <SwitchesInputBox
//               type='text'
//               application={true}
//               value={application}
//               onChange={(e) =>
//                 handleInputBoxes(
//                   idx,
//                   'application',
//                   e.target.value
//                 )
//               }
//             ></SwitchesInputBox>

//             {/* X Button  */}
//           </SwitchesWrapper>
//         </SwitchesBaseLayer>
//         {(isCreateEditOrSave === 1 ||
//           isCreateEditOrSave === 0) && (
//           <XButtonWrapper
//             onClick={() => setDeleteSwitch([true, idx])}
//             isGreenBorder={deleteSwitch[1] === idx}
//           >
//             <XButton>
//               <XButtonTop>
//                 <Img
//                   src={
//                     './images/settings-admin-sysIdentification-whiteX.svg'
//                   }
//                   margin={'x'}
//                 />
//               </XButtonTop>
//             </XButton>
//           </XButtonWrapper>
//         )}
//       </FlexRow>
//     );
//   }
// )

////////////////////////////////////////////////////////////////

// (
//   <SwitchesInputBox
//     type='text'
//     gasType={true}
//     value={gasType}
//     onChange={(e) =>
//       handleInputBoxes(
//         idx,
//         'gasType',
//         e.target.value,
//         UOS
//       )
//     }
//   ></SwitchesInputBox>
// )

const BaseLayer = styled.div`
  width: 843px;
  height: auto;
  padding-top: 1px;
  padding-bottom: 1px;

  ${layerB}

  border-radius: 9px;
  opacity: 1;
  ${flexBoxCenter}
`;
const Wrapper = styled.div`
  width: 841px;
  height: auto;

  ${layerA180Deg}

  border-radius: 8px;
  opacity: 1;

  ${justifyContentSpaceEvenly}
  flex-direction: column;
  position: relative;
`;

const TitleWrapper = styled.div`
  width: 829px;
  height: 32px;
  margin-top: 6px;

  ${layerA}

  border-radius: 16px;
  opacity: 1;
  ${flexBoxCenter}
`;

const Title = styled.div`
  color: #ffffff;

  ${({ isHeatLoad }) =>
    isHeatLoad
      ? css`
          margin-top: 8px;
          font-size: 10px;

          display: flex;
          flex-direction: row;

          &:before {
            content: '';
            width: 314px;
            border-bottom: 1px solid #ffffff;
            margin: auto;
            margin-right: 4px;
          }
          &:after {
            content: '';
            width: 314px;
            border-bottom: 1px solid #ffffff;
            margin: auto;
            margin-left: 4px;
          }
        `
      : css`
          font-size: 12px;
          letter-spacing: 1.2px;
        `}
`;

const FlexRow = styled.div`
  position: relative;

  ${({ isLastRow }) =>
    isLastRow === 'sorted'
      ? css`
          ${justifyContentSpaceAround}
          margin-top: 6px;
          margin-bottom: 2px;
        `
      : isLastRow
      ? css`
          ${justifyContentFlexStart}
          margin-top: 6px;
        `
      : css`
          ${justifyContentSpaceEvenly}
        `}

  ${({ isFlexColumn, isFlexStart }) =>
    isFlexColumn
      ? css`
          flex-direction: column;
        `
      : isFlexStart &&
        css`
          display: flex;
          justify-content: space-around;
          align-items: flex-start;
        `}
`;

const ContentBaseLayer = styled.div`
  width: 829px;
  height: auto;
  padding-top: 1px;
  padding-bottom: 1px;
  margin-top: 8px;

  ${layerA}

  border-radius: 18px;
  opacity: 1;
  ${flexBoxCenter}
`;

const ContentWrapper = styled.div`
  width: 827px;
  height: auto;
  padding-top: 4px;
  padding-bottom: 4px;

  ${layerA180Deg}

  border-radius: 17px;
  opacity: 1;
`;

const EditBoxWrapper = styled.div`
  z-index: 99;
  position: absolute;
  /* border: 1px solid orange; */
`;

const FlexSpaceEvenlyWrapper = styled.div`
  height: 24px;
  margin-top: 4px;
  margin-bottom: 8px;
  width: 100%;
  ${justifyContentSpaceEvenly}
`;

const FlexStartWrapper = styled.div`
  /* width: 332px; */
  width: auto;
  height: 24px;
  margin-top: 4px;
  margin-bottom: 8px;
  ${justifyContentFlexStart}
  gap: 96px;
  /* gap: 85px; */
`;

const Flex = styled.div`
  ${({ isCivilAddress }) =>
    isCivilAddress
      ? css`
          width: 402px;
          /* width: 450px; */
        `
      : css`
          width: 352px;
        `}
  ${justifyContentSpaceAround}
`;

const IndivFlex = styled.div`
  ${({ location, address, switches, isSSR, isUOS, specificLocation }) =>
    location || specificLocation
      ? css`
          /* width: 402px; */
          width: 342px;
          ${justifyContentSpaceAround};
          ${({ address }) =>
            address &&
            css`
              ${justifyContentSpaceBetween}
            `}
        `
      : address
      ? css`
          width: 402px;
          ${justifyContentSpaceAround};
        `
      : (switches || isSSR || isUOS) &&
        css`
          max-width: 126px;
          margin-left: 7px;
          ${alignItemsFlexStart};
        `}
`;

const SubTitle = styled.span`
  /* height: 24px; */
  height: fit-content;
  width: auto;
  text-align: left;
  font-size: 10px;
  letter-spacing: 1px;
  color: #ffffff;
  opacity: 1;
  ${({
    isZoneName,
    isSegment,
    isHeatingSys,
    isSwitchName,
    isSwitchSize,
    isSysId,
    isSsrRating,
    isApp,
    isSwitches,
    isUOS,
    isGasType,
    isSelectedSSR,
  }) =>
    isHeatingSys
      ? css`
          width: 56px;
          position: absolute;
          top: 0px;
          left: 438px;
        `
      : isSwitchName
      ? css`
          height: 14px;
          width: auto;
          position: absolute;
          top: 6px;
          left: 80px;
        `
      : isSwitchSize
      ? css`
          height: 22px;
          width: 52px;
          text-align: center;
          position: absolute;
          top: 0px;
          left: 206px;
        `
      : isSysId
      ? css`
          height: 14px;
          width: auto;
          position: absolute;
          top: 6px;
          left: 308px;
        `
      : isSsrRating
      ? css`
          height: 14px;
          width: auto;
          position: absolute;
          top: 6px;
          left: 648px;
        `
      : isApp
      ? css`
          height: 14px;
          width: auto;
          position: absolute;
          top: 6px;
          left: 710px;
        `
      : isSwitches
      ? css`
          width: auto;
        `
      : isUOS
      ? css`
          height: 14px;
          width: 26px;
          position: absolute;
          top: 6px;
          left: 20px;
        `
      : isGasType
      ? css`
          width: 34px;
          text-align: center;
          position: absolute;
          top: 0px;
          left: 524px;
        `
      : isSelectedSSR
      ? css`
          width: 26px;
          position: absolute;
          top: 0px;
          left: 588px;
        `
      : isSegment
      ? css`
          height: 14px;
          width: 64px;
          text-align: center;
          position: absolute;
          top: 6px;
          left: 202px;
        `
      : isZoneName &&
        css`
          height: 14px;
          width: auto;
          position: absolute;
          top: 6px;
          left: 86px;
        `}
`;

const ContentInput = styled.input`
  ${({ location, address, switches, isUOS, isSSR, specificLocation }) =>
    location
      ? css`
          width: 346px;
          height: 24px;
        `
      : address
      ? css`
          width: 260px;
          height: 24px;
        `
      : specificLocation
      ? css`
          /* width: 320px; */
          width: 254px;
          height: 24px;
        `
      : (isUOS || isSSR || switches) &&
        css`
          width: 34px;
          height: 24px;
          border-radius: 12px;
        `}

  font-size:8px;
  letter-spacing: 0.8px;
  text-transform: uppercase;

  ${layerADark}

  border-radius: 12px;
  opacity: 1;
`;

const FakeContentInput = styled.div`
  width: 280px;
  height: 24px;
  font-size: 8px;
  text-align: center;
  padding-top: 6px;
  letter-spacing: 0.8px;

  ${layerADark}

  border-radius: 12px;

  ${({ isGasType }) =>
    isGasType &&
    css`
      width: 42px;
      height: 18px;
      background-color: #393939;
      box-shadow: inset 0px 0px 2px #000000;
    `}
`;

const LocationDropDownWrapper = styled.div`
  position: relative;
  ${flexBoxCenter}
`;

const LocationDiv = styled.div`
  width: 258px;
  /* width: 320px; */
  height: 24px;

  ${layerADark}

  border-radius: 12px;

  ${flexBoxCenter}
`;

// const LocationNameSelectBoxBaseLayer = styled.div`
//   width: 322px;
//   height: 22px;

//   ${layerADark}

//   border-radius: 13px;
//   opacity: 1;
//   ${flexBoxCenter}
// `;

const LocationNameSelectBoxWrapper = styled.div`
  /* width: 318px; */
  width: 256px;
  height: 22px;

  ${layerA180Deg}

  border-radius: 11px;
  opacity: 1;
  ${justifyContentSpaceBetween}
`;

const LocationNameSelectBoxDisplay = styled.div`
  width: 232px;
  /* width: 294px; */
  height: 18px;
  margin-left: 2px;

  ${layerA}

  border-radius: 11px;
  opacity: 1;

  font-size: 10px;
  letter-spacing: 0.8px;
  ${flexBoxCenter}
`;

// const ButtonWrapper = styled.div`
//   width: 77px;
//   height: 24px;

//   ${layerB}

//   border-radius: 15px;
//   opacity: 1;
//   ${flexBoxCenter}
// `;

const GroupButtonsFlexEnd = styled.div`
  width: 99.2%;
  margin-top: 8px;
  margin-bottom: 4px;
  ${justifyContentFlexEnd}
`;

const GroupButtonsBaseLayer1 = styled.div`
  width: 536px;
  height: 35px;

  ${layerA}

  border-radius: 18px;
  opacity: 1;
  ${flexBoxCenter}
`;

const GroupButtonsBaseLayer2 = styled.div`
  width: 534px;
  height: 33px;

  ${layerA180Deg}

  border-radius: 17px;
  opacity: 1;
  ${flexBoxCenter}
`;

const GroupButtonsWrapper = styled.div`
  width: 530px;
  height: 29px;

  ${layerB}

  border-radius: 15px;
  opacity: 1;
  ${justifyContentSpaceBetween}
`;

const Button = styled.button`
  width: 124px;
  height: 27px;

  ${layerA180Deg}

  border-radius: 25px;
  opacity: 1;
  &:last-child {
    margin-right: 1px;
  }
  &:first-child {
    margin-left: 1px;
  }

  ${({ expandButton }) =>
    expandButton &&
    css`
      width: 75px;
      height: 22px;
    `}

  ${({ isSelectedColor }) =>
    isSelectedColor &&
    css`
      border: 1px solid #95ff45;
    `}

  ${flexBoxCenter}
`;

const ButtonHole = styled.div`
  width: 118px;
  height: 21px;

  ${layerB}

  border-radius: 20px;
  opacity: 0.8;

  ${({ expandButton }) =>
    expandButton &&
    css`
      width: 69px;
      height: 16px;
    `}

  ${flexBoxCenter}
`;

const ButtonTop = styled.div`
  width: 116px;
  height: 19px;

  ${layerA180Deg}

  border-radius: 25px;
  opacity: 1;

  ${({ expandButton }) =>
    expandButton &&
    css`
      width: 67px;
      height: 14px;
    `}

  ${flexBoxCenter}
`;

const ButtonTitle = styled.div`
  font-size: 10px;
  letter-spacing: 1px;
  color: #ffffff;
  opacity: 1;
`;

const FlexSwitches = styled.div`
  width: 100%;
  /* margin-top: 8px; */
  ${flexBoxCenter}
  flex-direction: column;
`;

const SwitchTitlesWrapper = styled.div`
  height: 24px;
  width: 100%;
  ${flexBoxCenter}
  gap:22.5px;
  position: relative;
`;

const SortedUOSGroupWrapper = styled.div`
  width: 814px;
  height: auto;
  padding: 2px;
  margin-bottom: 6px;

  ${layerA180Deg}

  border-radius: 16px;
`;

const SwitchesBaseLayer = styled.div`
  width: 796px;
  height: 26px;
  margin-top: 2px;

  ${layerADark}

  border-radius: 14px;
  opacity: 1;
  ${flexBoxCenter}

  ${({ isGrouped }) =>
    isGrouped &&
    css`
      width: 750px;
      height: 26px;
    `}
`;

const SwitchesWrapper = styled.div`
  width: 794px;
  height: 24px;

  ${layerA180Deg}

  border-radius: 17px;

  ${justifyContentSpaceAround}

  ${({ isGrouped }) =>
    isGrouped &&
    css`
      width: 748px;
      height: 24px;
      /* ${flexBoxCenter}
      gap:1.7px; */
    `}
`;

const UOSDisplay = styled.div`
  width: 32px;
  height: 18px;
  margin-top: 6px;

  font-size: 10px;

  ${layerCLighter}
  border-radius: 12px;
  ${flexBoxCenter}
`;

const SwitchesInputBox = styled.input`
  height: 17px;
  ${({ switchName, systemId, application, gasType }) =>
    switchName
      ? css`
          width: 136px;
          ${({ isGrouped }) =>
            isGrouped &&
            css`
              margin-left: 2px;
            `}
        `
      : systemId
      ? css`
          width: 148px;
        `
      : application
      ? css`
          width: 86px;
          margin-right: 2px;
        `
      : gasType &&
        css`
          width: 42px;
        `}

  font-size:10px;
  letter-spacing: 1px;
  text-transform: uppercase;

  ${layerA}

  border-radius: 12px;
`;

// const SwitchesDropBoxBaseLayer = styled.div`
//   ${({ isUOS, isSwitchSize, isHeatingSys, isSelectedSSR, isSSRRating }) =>
//     isUOS
//       ? css`
//           width: 44px;
//           height: 18px;
//         `
//       : isSwitchSize
//       ? css`
//           width: 72px;
//           height: 18px;
//         `
//       : isHeatingSys
//       ? css`
//           width: 84px;
//           height: 18px;
//         `
//       : isSelectedSSR
//       ? css`
//           width: 64px;
//           height: 18px;
//         `
//       : isSSRRating &&
//         css`
//           width: 96px;
//           height: 18px;
//         `}

//   ${layerA}

//   border-radius: 12px;
//   opacity: 1;
//   position: relative;
//   ${flexBoxCenter}
// `;

// const SwitchesDropBoxWrapper = styled.div`
//   ${({ isUOS, isSwitchSize, isHeatingSys, isSelectedSSR, isSSRRating }) =>
//     isUOS
//       ? css`
//           width: 42px;
//           height: 16px;
//         `
//       : isSwitchSize
//       ? css`
//           width: 70px;
//           height: 16px;
//         `
//       : isHeatingSys
//       ? css`
//           width: 82px;
//           height: 16px;
//         `
//       : isSelectedSSR
//       ? css`
//           width: 62px;
//           height: 16px;
//         `
//       : isSSRRating &&
//         css`
//           width: 94px;
//           height: 16px;
//         `};

//   ${layerA180Deg}

//   border-radius: 12px;
//   opacity: 1;
//   ${justifyContentSpaceBetween}
// `;

// const SwitchesDisplayInfo = styled.div`
//   ${({ isUOS, isSwitchSize, isHeatingSys, isSelectedSSR, isSSRRating }) =>
//     isUOS
//       ? css`
//           width: 24px;
//           height: 12px;
//         `
//       : isSwitchSize
//       ? css`
//           width: 54px;
//           height: 12px;
//         `
//       : isHeatingSys
//       ? css`
//           width: 64px;
//           height: 12px;
//         `
//       : isSelectedSSR
//       ? css`
//           width: 46px;
//           height: 12px;
//         `
//       : isSSRRating &&
//         css`
//           width: 78px;
//           height: 12px;
//         `};

//   margin-left: 2px;

//   ${layerA}

//   border-radius: 12px;
//   opacity: 1;

//   letter-spacing: 1px;
//   font-size: 10px;
//   ${flexBoxCenter}
// `;

const XButtonWrapper = styled.div`
  width: 18px;
  height: 18px;
  margin-left: 2px;

  ${layerA}

  border-radius: 9px;
  opacity: 1;
  ${flexBoxCenter}

  ${({ isGreenBorder }) =>
    isGreenBorder &&
    css`
      border: 1px solid #95ff45;
    `}
`;

const XButton = styled.div`
  width: 16px;
  height: 16px;

  ${layerA180Deg}

  border-radius: 9px;
  opacity: 1;
  ${flexBoxCenter}
`;

const XButtonTop = styled.div`
  width: 13px;
  height: 13px;

  ${layerB}

  border-radius: 9px;
  opacity: 1;
  ${flexBoxCenter}
`;

const Img = styled.img`
  margin-right: 3px;
  cursor: pointer;
  ${({ margin }) =>
    margin === 'x'
      ? css`
          margin: 0;
        `
      : margin &&
        css`
          margin-right: 6px;
        `}
`;

const MessageBoxWrapper = styled.div`
  ${({ isLocationName }) =>
    isLocationName
      ? css`
          position: absolute;
          z-index: 10;
          width: auto;
          height: auto;
        `
      : css`
          position: absolute;
          z-index: 10;
          top: 30%;
          right: 10%;
          width: auto;
          height: auto;
        `}
`;

const SSRElementsWrapper = styled.div``;

// const SSRAndTCWrapper = styled.div`
//   width: 118px;
//   height: 20px;

//   ${layerCLighter}
//   border-radius: 12px;
//   ${justifyContentSpaceAround}
// `;

// const SSR = styled.span`
//   font-size: 10px;
//   color: #fcff01;
// `;

// const TCDropBox = styled.div`
//   width: 60px;
//   height: 18px;

//   ${layerA180Deg}
//   border-radius: 12px;
//   ${justifyContentSpaceAround}
// `;

// const TC = styled.div`
//   width: 43px;
//   height: 14px;
//   font-size: 8px;
//   letter-spacing: 0.8px;

//   ${layerA}
//   border-radius: 12px;
// `;

const WrapperDropBox = styled.div`
  position: absolute;
  z-index: 11;
  top: 0;
`;

const DisplayUOSName = styled.div`
  width: 287px;
  min-height: 29px;

  background: #233a54 0% 0% no-repeat padding-box;
  box-shadow: inset 0px 0px 6px #000000;
  border-radius: 15px;
  ${flexBoxCenter}
`;

const UOSNameP = styled.p`
  width: 93%;
  font-size: 10px;

  letter-spacing: 1px;
`;

const HeatLoadButtonWrapper = styled.div`
  width: 221px;
  height: 29px;

  ${layerB}
  border-radius: 27px;
  ${flexBoxCenter}

  ${({ isApply }) =>
    isApply &&
    css`
      width: 514px;
      height: 29px;
    `}
`;

const HeatLoadButton = styled.button`
  width: 219px;
  height: 27px;

  ${layerA180Deg}
  border-radius: 25px;
  ${flexBoxCenter}

  ${({ isApply }) =>
    isApply &&
    css`
      width: 512px;
      height: 27px;
    `}
`;

const HeatLoadButtonIndent = styled.div`
  width: 213px;
  height: 21px;

  ${layerB}

  border-radius: 20px;
  ${flexBoxCenter}

  ${({ isApply }) =>
    isApply &&
    css`
      width: 506px;
      height: 21px;
    `}
`;

const HeatLoadButtonTop = styled.div`
  width: 211px;
  height: 19px;

  ${layerA180Deg}

  border-radius: 25px;
  ${flexBoxCenter}

  ${({ isApply }) =>
    isApply &&
    css`
      width: 504px;
      height: 19px;
    `}
`;

const HeatLoadSpan = styled.span`
  font-size: 10px;
`;
