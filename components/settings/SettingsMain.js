import styled, { css } from 'styled-components';
import {
import { useForceAndCommandsStore, useSettingsOptionsStore, useSnowSensorStore, useWindFactorStore } from '../../zustand-stores';
import { useAdminStore, useSSRDescriptionStore } from '../../zustand-stores';
import { useEditCancelApplyButtonsStore, useSettingsOptionsStore, useUnitsStore, useUserStore } from '../../zustand-stores';
  alignItemsFlexStart,
  flexBoxCenter,
  justifyContentFlexEnd,
  justifyContentSpaceBetween,
  layerA,
  layerA90Deg,
  layerADark,
} from '../styles/commonStyles';
import TitleContainer from '../TitleContainer';
import SettingsOptionsAndInterfaceMode from './settingsOptions/SettingsOptionsAndInterfaceMode';
import UserProfileMain from './userProfile/UserProfileMain';
import TitleOfSettingsOptions from './TitleOfSettingsOptions';
import EditCancelApplyButtons from './buttons/EditCancelApplyButtons';
import UnitsMain from './units/UnitsMain';
import WindFactorMain from './windFactorTrigger/WindFactorMain';
import SnowSensorMain from './snowSensorSensor/SnowSensorMain';
import { useState } from 'react';
import { useESSSwitchStore, useTESSwitchStore, useTGSSwitchStore, useUnitsStore } from '../zustand-stores';
import { useFileUpload } from 'react-use-file-upload/dist/lib/useFileUpload';
import axios from 'axios';
import { useRef } from 'react';
import ForceAndCommandMain from './ForceAndCommand/ForceAndCommandMain';
import { useEffect } from 'react';
import AdminMain from './admin/AdminMain';
import adminSlice, {
  handleForceGasAndElectric,
  handleGasType,
  handleGasValuePosition,
  handleSysConfiguration,
  handleTrackTempControl,
  selectAdmin,
} from '../store/slices/settings/admin/adminSlice';
import { useMediaQuery } from 'react-responsive';
import AllSettingsSelectOptions from './settingsOptions/AllSettingsSelectOptions';
import InvisibleDivForEditButton from './messageBoxes/InvisibleDivForEditButton';
import Interface from './interfaceMode/Interface';
import { addAdminHeatersService } from '../../services/ssrs.service';
import groupBy from 'lodash/groupBy';
import mapValues from 'lodash/mapValues';
import reduce from 'lodash/reduce';
import {
  getUserProfileDataService,
  updateUserProfileService,
} from '../../services/userProfile.service';
import {
  convertCelsiusToFahrenheit,
  getDeviceIdsByLocationData,
  isImageFile,
} from '../../helpers/helpers';
import {
  bulkUpdateBlowerDeviceService,
  bulkUpdateSwitchDeviceService,
  createUOSZoneService,
  getZonesInfoForSystemIdentificationService,
  updateBlowerSettingService,
  updateDevicesValveService,
  updateSwitchSettingService,
  updateUOSZoneService,
} from '../../services';
import * as yup from 'yup';
import { uploadS3File } from '../../services/uploadS3File.service';
import { getLocationsSpecificLocationsMachines } from '../../helpers/setting';

const SettingsMain = ({ essRefetch, tgsRefetch, tesRefetch }) => {
  const { setUserInfo } = useUserStore();
  const { resetButtons } = useEditCancelApplyButtonsStore();
  const isMobile = useMediaQuery({ query: '(max-width:600px)' });

  // useState
  // ***********states for message box
  const [messageBoxContent, setMessageBoxContent] = useState({});
  const [openMessageBox, setOpenMessageBox] = useState(false);
  //*********** state for units
  const [metricImperialToggle, setMetricImperialToggle] = useState(null);

  // ********** user profile states
  // state saves all the profile input fields

  const firstNameElement = useRef(null);
  const familyNameElement = useRef(null);
  const titleElement = useRef(null);
  const workPhoneElement = useRef(null);
  const cellPhoneElement = useRef(null);
  const faxElement = useRef(null);
  const emailElement = useRef(null);
  const companyElement = useRef(null);
  const addressElement = useRef(null);

  const [selectHonorific, setSelectHonorific] = useState(null);

  const userSchema = yup.object().shape({
    firstname: yup.string().required(),
    lastname: yup.string().required(),
    title: yup.string().required(),
    gender: yup.string().required(),
    phone: yup.number().min(10).max(13).required(),
    cell_Phone: yup.number().min(10).max(13).required(),
    email: yup.string().email().required(),
    company_name: yup.string().required(),
    company_location: yup.string().required(),
  });

  const inputsInitialState = {
    firstname: null,
    lastname: null,
    title: null,
    gender: null,
    phone: null,
    cell_phone: null,
    fax: null,
    email: null,
    company_name: null,
    company_location: null,
    avatar: null,
  };
  const [profileInputsData, setProfileInputsData] =
    useState(inputsInitialState);
  // state controls open and close of upload box
  const [openUploadBox, setOpenUploadBox] = useState(false);

  //  **************wind factor states
  const lowWindTempRef = useRef(null);
  const medWindTempRef = useRef(null);
  const highWindTempRef = useRef(null);
  const extremeWindTempRef = useRef(null);

  // ************** snow sensor state

  const essSnowSensorRef = useRef(null);
  const tgsSnowSensorRef = useRef(null);
  const tesSnowSensorRef = useRef(null);

  // ***************force and command***********

  const [selectAtsButtonsState, setSelectAtsButtonsState] = useState([
    false,
    false,
    false,
  ]);
  const [selected, setSelected] = useState([null, null, null]);

  // SYS states
  const [activeSelect, setActiveSelect] = useState(null);
  const [tCNumber, setTCNumber] = useState([0, 0, 0, 0, 0, 0]);
  const [updateProfileError, setUpdateProfileError] = useState(null);

  const selectTCsInitialState = {
    outsideTemp: false,
    burningChamber: false,
    encloseTemp: false,
    currEss: false,
    currTgs: false,
    currTes: false,
  };

  const [isSave, setIsSave] = useState(selectTCsInitialState);
  // ATS state to change button color and name from select to applied
  const [isAppliedAtsButtonState, setIsAppliedAtsButtonState] = useState([
    false,
    false,
    false,
  ]);

  // ********************** admin *********************
  const SaveChangesInitialState = {
    addElementToBank: false,
    trackTempControl: false,
    deactivateTrackTempControl: false,
    selectGasType: false,
    valveSettings: false,
    systemIdentification: false,
    systemConfiguration: false,
    forceGasAndElectric: false,
  };
  const [saveChanges, setSaveChanges] = useState(SaveChangesInitialState);

  const [saveInputElement, setSaveInputElement] = useState(null);

  const [gasSelection, setGasSelection] = useState(null);

  const [enableSwitch, setEnableSwitch] = useState(false);

  const [selectSystemConfig, setSelectSystemConfig] = useState(0);

  const [isCreateEditOrSave, setIsCreateOrEditOrSave] = useState(null);
  const [numOfUOS, setNumOfUOS] = useState('');
  const [numOfSSR, setNumOfSSR] = useState('');
  const [numSwitches, setNumSwitches] = useState('');
  const [UOSName, setUOSName] = useState('');
  const [UOSDelete, setUOSDelete] = useState([]);

  const locationNameRef = useRef();
  // const specificLocationRef = useRef();

  const [civicAddress, setCivicAddress] = useState('');
  const [specificLocation, setSpecificLocation] = useState('');

  const [switches, setSwitches] = useState([]);

  const [hp, setHp] = useState([]);

  const [selectedLocation, setSelectedLocation] = useState(null);

  const [isGroupedSwitchesSaved, setIsGroupedSwitchesSaved] = useState([]);

  const [isConfirmed, setIsConfirmed] = useState(false);

  const [openHeaders, setOpenHeaders] = useState([
    false,
    false,
    false,
    false,
    false,
    false,
  ]);

  //*********************** redux ************************
  
  const settingsOptionsState = useSettingsOptionsStore();
  const {
    isUserProfileSelected,
    isUnitsSelected,
    isWindFactorSelected,
    isSnowSensorSelected,
    isForceAndCommandsSelected,
    isAdminSelected,
    isInterfaceModeSelected,
  } = settingsOptionsState.allSettingsOptions;

  const selectForceAndCommandsState = useForceAndCommandsStore();

  const selectAdminState = useAdminStore();
  const { elementsOptions } = useSSRDescriptionStore();

  const { flatEssSwitch } = useESSSwitchStore();
  const { flatTgsSwitch } = useTGSSwitchStore();
  const { flatTesSwitch } = useTESSwitchStore();

  const {
    lowWindTemp,
    medWindTemp,
    highWindTemp,
    extremeWindTemp,
    windFactorSavedUnitIsF,
  } = useWindFactorStore();
  const {
    essSnowSensorTemp,
    tgsSnowSensorTemp,
    tesSnowSensorTemp,
    snowSensorSavedUnitIsF,
  } = useSnowSensorStore();

  const { isF } = useUnitsStore();

  // *******************************************

  useEffect(() => {
    const copyOpenHeaders = [...openHeaders];
    copyOpenHeaders.fill(false);
    setOpenHeaders(copyOpenHeaders);
    setCivicAddress('');
    setSpecificLocation('');
  }, [isForceAndCommandsSelected, isAdminSelected]);

  useEffect(() => {
    setCivicAddress('');
    setSpecificLocation('');
  }, [openHeaders]);

  useEffect(() => {
    dispatch(handleSetInitialStateSettingsOptions();
    return () => dispatch(handleResetButtons();
  }, []);

  const handleCancelButtonsFunctions = (sysIndex) => {
    if (isForceAndCommandsSelected) {
      const copyIsAppliedAtsButtonState = [...isAppliedAtsButtonState];
      copyIsAppliedAtsButtonState[sysIndex] = false;
      setIsAppliedAtsButtonState(copyIsAppliedAtsButtonState);
    }

    if (isAdminSelected) {
      setCivicAddress('');
      setSpecificLocation('');
      setNumSwitches('');
      setNumOfUOS('');
      setNumOfSSR('');
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
          displaySelectBox: [false, false, false, false, false, false],
          deviceName: null,
          zoneId: null,
          deviceMac: null,
          type: null,
          latitude: null,
          longitude: null,
        },
      ]);
      setIsCreateOrEditOrSave(null);
      setIsConfirmed(false);
    }
  };

  // logic for edit, cancel and apply buttons
  const handleEditCancelApplyButtons = (value, sysIndex) => {
    const buttonsIndex = Number(value);
    dispatch(handleResetButtons();
    switch (buttonsIndex) {
      case 0:
        dispatch(handleClickedButton('isEdit');
        break;
      case 1:
        dispatch(handleClickedButton('isCancel');
        handleCancelButtonsFunctions(sysIndex);
        break;
      case 2:
        if (isUserProfileSelected) {
          handleSaveProfileInfo(sysIndex);
        } else if (isUnitsSelected) {
          handleSaveUnit(sysIndex);
        }
        dispatch(handleClickedButton('isApply');
        handleMessageBox(sysIndex);
        setOpenMessageBox(true);
        break;
      default:
        return;
    }
  };

  // saves all the entered info og profile information to profileInputsData state
  const handleSaveProfileInfo = async (sysIndex) => {
    const copyProfileInputsData = { ...profileInputsData };
    if (firstNameElement.current.value) {
      copyProfileInputsData.firstname = firstNameElement.current.value;
    }
    if (familyNameElement.current.value) {
      copyProfileInputsData.lastname = familyNameElement.current.value;
    }
    if (titleElement.current.value) {
      copyProfileInputsData.title = titleElement.current.value;
    }
    if (selectHonorific === 0 || selectHonorific) {
      const value = selectHonorific === 0 ? 'male' : 'female';
      copyProfileInputsData.gender = value;
    }
    if (companyElement.current.value) {
      copyProfileInputsData.company_name = companyElement.current.value;
    }
    if (addressElement.current.value) {
      copyProfileInputsData.company_location = addressElement.current.value;
    }
    if (workPhoneElement.current.value) {
      copyProfileInputsData.phone = workPhoneElement.current.value;
    }
    if (cellPhoneElement.current.value) {
      copyProfileInputsData.cell_phone = cellPhoneElement.current.value;
    }
    if (faxElement.current.value) {
      copyProfileInputsData.fax = faxElement.current.value;
    }
    if (emailElement.current.value && emailElement.current.value !== '') {
      copyProfileInputsData.email = emailElement.current.value;
    } else {
      // setUpdateProfileError('Email is required');
      handleMessageBox(sysIndex, 'Email is required');
      setOpenMessageBox(true);
      return;
    }

    const isValid = await userSchema.isValid(copyProfileInputsData);
    if (isValid) {
      setProfileInputsData(copyProfileInputsData);
    } else {
      // setUpdateProfileError(
      //   'input fields incomplete, please fill all required input fields.'
      // );
      handleMessageBox(
        sysIndex,
        'input fields incomplete, please fill all required input fields.'
      );
    }

    let updatedData = {
      user: copyProfileInputsData,
    };
    try {
      const response = await updateUserProfileService(updatedData);
      dispatch(getUserProfileDataService();
      dispatch(handleClickedButton('isApply');
      handleMessageBox(sysIndex);
      // setUpdateProfileError(null);
    } catch (error) {
      if (error === 'ORGANIZATION_NOT_EXISTS') {
        // setUpdateProfileError('wrong company name. Please try again.');
        handleMessageBox(sysIndex, 'wrong company name. Please try again.');
      } else {
        // setUpdateProfileError('somethings went wrong. Please try again.');
        handleMessageBox(sysIndex, 'somethings went wrong. Please try again.');
      }
    }

    // handleMessageBox(sysIndex);
    setOpenMessageBox(true);
  };
  const handleSaveUnit = async (sysIndex) => {
    let dataObject = {
      user: {
        temperature_unit: metricImperialToggle === 0 ? 'f' : 'c',
      },
    };

    try {
      const response = await updateUserProfileService(dataObject);
      dispatch(getUserProfileDataService();
      dispatch(handleClickedButton('isApply');
      handleMessageBox(sysIndex);
      // setUpdateProfileError(null);
    } catch (error) {
      // setUpdateProfileError(error || 'Something went wrong');
      handleMessageBox(sysIndex, error || 'Something went wrong');
    }
    setOpenMessageBox(true);
  };

  const generateRandomId = () => (Math.random() * 9876543210).toFixed();

  const switchPanelsValue = (data) => {
    
    return data.map((switchInfo) => {
      switchInfo._randomId = switchInfo.sysId || generateRandomId();
      return {
        system_id: switchInfo._randomId,
        name: switchInfo.switchName?.toUpperCase(),
        switch_size: switchInfo.switchSize?.slice(1),
        system_heating: switchInfo.heatingSys
          ?.split('/')
          .map((el) => el.toUpperCase()),
        gas_type: switchInfo.gasType?.toUpperCase() || null,
        ssr_uts: [
          ...new Set(
            switchInfo.selectedSSR?.map(
              (el) => Object.keys(el)[0].slice(-1) - 1
            )
          ),
        ],
        ssr_rating: switchInfo.ssrRating?.slice(0, -5),
        application: switchInfo.application?.toUpperCase(),
      };
    });
  };

  const ssrsValue = (data) => {
    const allSSR = data
      .map((switchInfo) => {
        const groupedSSR = groupBy(
          switchInfo.selectedSSR,
          (obj) => Object.keys(obj)[0]
        );
        return Object.keys(groupedSSR).map((ssr) => {
          const heaters = groupedSSR[ssr]
            .map((ssr) =>
              Object.values(ssr)[0]
                .specs?.map((spec) => spec.partNumber)
                .filter((partNumber) => partNumber)
            )
            .flat();
            
          return {
            no: ssr.slice(-1) - 1,
            tc: +Object.values(groupedSSR[ssr][0])[0].thermoCouple?.slice(-2),
            switch_system_id: heaters.length > 0 ? switchInfo._randomId : null,
            heaters,
          };
        });
      })
      .flat();

    const newAllSSR = Object.values(
      reduce(
        allSSR,
        (acc, obj) => {
          if (!acc[obj.no]) {
            acc[obj.no] = { ...obj, heaters: [] };
          }
          acc[obj.no].heaters.push(...obj.heaters);
          return acc;
        },
        {}
      );

    return newAllSSR;
  };

  const getDeviceName = (data) => {
    return data.reduce(
      (acc, { switchName, switchSize, application, heatingSys, gasType }) => {
        if (heatingSys === 'tgs/tes') {
          const elSplit = heatingSys.split('/');

          return (
            `${acc}` +
            `${acc && '/'}${switchName} ${switchSize} ${application} ${
              elSplit[0]
            }:${gasType}-${elSplit[1]}`
          );
        } else if (heatingSys === 'tgs') {
          return (
            `${acc}` +
            `${
              acc && '/'
            }${switchName} ${switchSize} ${application} ${heatingSys}:${gasType}`
          );
        } else {
          return (
            `${acc}` +
            `${
              acc && '/'
            }${switchName} ${switchSize} ${application} ${heatingSys}`
          );
        }
      },
      []
    );
  };

  const newSysIdentificationData = (data) => {
    const newData = Array.isArray(data[0])
      ? data
      : Object.values(groupBy(data.flat(), (obj) => obj.UOS);
    const uos_panels = newData.map((switchesInfo, switchIndex) => {
      return {
        device_name:
          UOSName[switchIndex]?.slice(1).toUpperCase() ||
          getDeviceName(switchesInfo),
        type: switchesInfo?.every((switchInfo) =>
          switchInfo.heatingSys.includes('ess')
        )
          ? 'switch'
          : 'blower',
        switch_panels: switchPanelsValue(switchesInfo),
        ssr: ssrsValue(switchesInfo),
      };
    });

    return {
      zone_name: locationNameRef.current.value,
      specific_address: specificLocation,
      zone_address: civicAddress,
      uos_panel_number: Number(numOfUOS),
      ssr_quantity: Number(numOfSSR),
      switches_number: Number(numSwitches),
      uos_panels,
    };
  };

  const updateSysIdentificationData = (data) => {
    const groupedSwitches = groupBy(data.flat(), (obj) => obj.UOS);
    const UOSs = Object.keys(groupedSwitches);
    const allSwitches = Object.values(groupedSwitches);

    const uos_delete = UOSDelete.filter((item) => !UOSs.includes(item.UOS)).map(
      ({ type, device_mac }) => {
        return { type, device_mac };
      }
    );

    const uos_panels = allSwitches.map((switchesInfo, switchIndex) => {
      return {
        device_mac: switchesInfo[0]?.deviceMac,
        device_name: UOSName[switchIndex].slice(1),
        type: switchesInfo?.every((switchInfo) =>
          switchInfo.heatingSys.includes('ess')
        )
          ? 'switch'
          : 'blower',
        switch_panels: switchPanelsValue(switchesInfo),
        ssr: ssrsValue(switchesInfo),
      };
    });

    return {
      zone_name: locationNameRef.current.value,
      specific_address: specificLocation,
      zone_address: civicAddress,
      uos_panel_number: Number(numOfUOS),
      ssr_quantity: Number(numOfSSR),
      switches_number: Number(numSwitches),
      longitude: allSwitches[0][0].longitude,
      latitude: allSwitches[0][0].latitude,
      zone_id: allSwitches[0][0].zoneId,
      uos_delete,
      uos_panels,
    };
  };

  // logic for messageBox and dispatches
  const handleMessageBox = async (sysIndex, profileMessage) => {
    // units message
    let messageBoxTitle = '';
    let messageBoxContent = '';
    let subtitle = '';
    let theme = '';

    // messages and dispatch for profile information. check userSlice.js for dispatches
    if (isUserProfileSelected) {
      // if (!updateProfileError) {
      //   console.log('updateProfileError1:', profileMessage);
      //   messageBoxTitle = 'settings';
      //   subtitle = 'profile information';
      //   theme = 'change profile information';
      //   messageBoxContent = 'settings have been applied';
      // } else {
      //   console.log('updateProfileError:', profileMessage);
      //   messageBoxTitle = 'settings';
      //   subtitle = 'profile information';
      //   theme = 'change profile information';
      //   messageBoxContent = updateProfileError;
      // }
      if (profileMessage || updateProfileError) {
        messageBoxTitle = 'settings';
        subtitle = 'profile information';
        theme = 'change profile information';
        messageBoxContent = profileMessage || updateProfileError;
      } else {
        messageBoxTitle = 'settings';
        subtitle = 'profile information';
        theme = 'change profile information';
        messageBoxContent = 'settings have been applied';
      }
      // setUpdateProfileError(null);
      dispatch(addUserInfo(profileInputsData);
      handleUploadImage();
    }
    // messages and dispatch for settings options => units. check in store folder a folder call settings => unitsSlice.js
    else if (isUnitsSelected) {
      if (!updateProfileError) {
        messageBoxTitle = 'settings';
        subtitle = 'units of measurement';
        theme = 'change of option';
        messageBoxContent = 'settings have been applied';
      } else {
        messageBoxTitle = 'settings';
        subtitle = 'units of measurement';
        theme = 'change of option';
        messageBoxContent = updateProfileError;
      }

      dispatch(handleUnitSelection(metricImperialToggle);
    }
    // messages and dispatch for settings options => wind factor trigger. check in store folder a folder call settings => windFactorSlice.js
    else if (isWindFactorSelected) {
      const savedTemp = [];
      // check if the temperature unit matches the temperature unit of previous temperature unit
      if (isF === windFactorSavedUnitIsF) {
        savedTemp.push(
          +lowWindTemp,
          +medWindTemp,
          +highWindTemp,
          +extremeWindTemp
        );
      } else if (isF) {
        const totalTemp = [
          +lowWindTemp,
          +medWindTemp,
          +highWindTemp,
          +extremeWindTemp,
        ];
        totalTemp.forEach((temp) =>
          savedTemp.push(convertCelsiusToFahrenheit(temp));
      } else {
        const totalTemp = [
          +lowWindTemp,
          +medWindTemp,
          +highWindTemp,
          +extremeWindTemp,
        ];
        totalTemp.forEach((temp) =>
          savedTemp.push(convertCelsiusToFahrenheit(temp));
      }

      // verify if all input fields are valid
      if (
        lowWindTempRef.current.value &&
        medWindTempRef.current.value &&
        highWindTempRef.current.value &&
        extremeWindTempRef.current.value
      ) {
        const newTemp = [
          +lowWindTempRef.current.value,
          +medWindTempRef.current.value,
          +highWindTempRef.current.value,
          +extremeWindTempRef.current.value,
        ];

        const windSpeed = ['low', 'med', 'high', 'extreme'];
        const result = newTemp.filter((temp, idx) => {
          return !savedTemp[idx] !== temp;
        });

        let finalResult = [];

        savedTemp.forEach((temp, index) => {
          if (temp !== result[index] && result[index]) {
            finalResult.push({
              speed: windSpeed[index],
              prevTemp: temp,
              newTemp: result[index] ?? newTemp[index],
              isF: true,
            });
          }
        });

        const unitOfMeasurement = isF ? '°f' : '°c';

        if (finalResult.length === 0) {
          messageBoxTitle = 'settings';
          subtitle = 'wind factor trigger';
          theme = 'input fields unchanged';
          messageBoxContent = [
            'input fields set to the same temperature as before.',
          ];
        } else {
          messageBoxTitle = 'settings';
          subtitle = 'wind factor trigger';
          theme = 'change temperature';
          messageBoxContent = finalResult.map(
            ({ speed, prevTemp, newTemp }) =>
              `you are about to set the ${speed} wind factor trigger temperature from ${prevTemp}${unitOfMeasurement} to ${newTemp}${unitOfMeasurement}.`
          );
        }

        // dispatch(
        //   handleSetWindTemp({
        //     objectName: 'lowWindTemp',
        //     temp: lowWindTempRef.current.value,
        //   })
        // );
        // dispatch(
        //   handleSetWindTemp({
        //     objectName: 'medWindTemp',
        //     temp: medWindTempRef.current.value,
        //   })
        // );
        // dispatch(
        //   handleSetWindTemp({
        //     objectName: 'highWindTemp',
        //     temp: highWindTempRef.current.value,
        //   })
        // );
        // dispatch(
        //   handleSetWindTemp({
        //     objectName: 'extremeWindTemp',
        //     temp: extremeWindTempRef.current.value,
        //   })
        // );
        // dispatch(
        //   handleSetWindTemp({
        //     objectName: 'windFactorSavedUnitIsF',
        //     temp: isF,
        //   })
        // );

        // const switchDeviceIds = getDeviceIdsByLocationData(flatEssSwitch);
        // const blowerDeviceIds = [
        //   ...new Set([
        //     ...getDeviceIdsByLocationData(flatTgsSwitch),
        //     ...getDeviceIdsByLocationData(flatTesSwitch),
        //   ]),
        // ];
        // const data = [
        //   +lowWindTempRef.current.value,
        //   +medWindTempRef.current.value,
        //   +highWindTempRef.current.value,
        //   +extremeWindTempRef.current.value,
        // ];
        // switchDeviceIds.length > 0 &&
        //   updateSwitchSettingService(switchDeviceIds, {
        //     wind_threshold: data,
        //   });
        // blowerDeviceIds.length > 0 &&
        //   updateBlowerSettingService(blowerDeviceIds, {
        //     wind_threshold: data,
        //   });
      } else {
        messageBoxTitle = 'settings';
        subtitle = 'wind factor trigger';
        theme = 'input fields incomplete';
        messageBoxContent = [
          'input fields incomplete please field all the input fields.',
        ];
      }
    }
    // messages and dispatch for settings options => snow sensor trigger. check in store folder a folder call settings => snowSensorSlice.js
    else if (isSnowSensorSelected) {
      const unitOfMeasurement = isF ? '°f' : '°c';
      const savedTemp = [];
      const savedMessageArr = [];
      // check if the temperature unit matches the temperature unit of previous temperature unit

      if (isF === snowSensorSavedUnitIsF) {
        savedTemp.push(
          +essSnowSensorTemp,
          +tgsSnowSensorTemp,
          +tesSnowSensorTemp
        );
      } else {
        const totalTemp = [
          +essSnowSensorTemp,
          +tgsSnowSensorTemp,
          +tesSnowSensorTemp,
        ];
        if (isF) {
          totalTemp.forEach((temp) =>
            savedTemp.push(convertCelsiusToFahrenheit(temp));
        } else {
          totalTemp.forEach((temp) =>
            savedTemp.push(convertCelsiusToFahrenheit(temp));
        }
      }

      // dispatch the unit of measurement for the saved temp
      // dispatch(
      //   handleSnowSensorTemp({
      //     keyName: 'snowSensorSavedUnitIsF',
      //     value: isF,
      //   })
      // );

      if (
        essSnowSensorRef.current.value &&
        +essSnowSensorRef.current.value !== +essSnowSensorTemp
      ) {
        // const switchDeviceIds = getDeviceIdsByLocationData(flatEssSwitch);
        // dispatch(
        //   handleSnowSensorTemp({
        //     keyName: 'essSnowSensorTemp',
        //     value: essSnowSensorRef.current.value,
        //   })
        // );
        // switchDeviceIds.length > 0 &&
        //   updateSwitchSettingService(switchDeviceIds, {
        //     snow_threshold: +essSnowSensorRef.current.value,
        //   });

        savedMessageArr.push(
          `you are about to set the ess-snow sensor trigger temperature from ${savedTemp[0]}${unitOfMeasurement} to ${essSnowSensorRef.current.value}${unitOfMeasurement}`
        );
      }
      if (
        tgsSnowSensorRef.current.value &&
        +tgsSnowSensorRef.current.value !== +tgsSnowSensorTemp
      ) {
        // dispatch(
        //   handleSnowSensorTemp({
        //     keyName: 'tgsSnowSensorTemp',
        //     value: tgsSnowSensorRef.current.value,
        //   })
        // );
        savedMessageArr.push(
          `you are about to set the ess-snow sensor trigger temperature from ${savedTemp[1]}${unitOfMeasurement} to ${tgsSnowSensorRef.current.value}${unitOfMeasurement}`
        );
      }
      if (
        tesSnowSensorRef.current.value &&
        +tesSnowSensorRef.current.value !== +tesSnowSensorTemp
      ) {
        // dispatch(
        //   handleSnowSensorTemp({
        //     keyName: 'tesSnowSensorTemp',
        //     value: tesSnowSensorRef.current.value,
        //   })
        // );
        savedMessageArr.push(
          `you are about to set the ess-snow sensor trigger temperature from ${savedTemp[2]}${unitOfMeasurement} to ${tesSnowSensorRef.current.value}${unitOfMeasurement}`
        );
      }
      // if (tgsSnowSensorRef.current.value && tesSnowSensorRef.current.value) {
      //   const blowerDeviceIds = [
      //     ...new Set([
      //       ...getDeviceIdsByLocationData(flatTgsSwitch),
      //       ...getDeviceIdsByLocationData(flatTesSwitch),
      //     ]),
      //   ];
      //   blowerDeviceIds.length > 0 &&
      //     updateBlowerSettingService(blowerDeviceIds, {
      //       blower_snow_threshold: +tgsSnowSensorRef.current.value,
      //       electrical_snow_threshold: +tesSnowSensorRef.current.value,
      //     });
      // } else if (tgsSnowSensorRef.current.value) {
      //   const blowerDeviceIds = getDeviceIdsByLocationData(flatTgsSwitch);
      //   blowerDeviceIds.length > 0 &&
      //     updateBlowerSettingService(blowerDeviceIds, {
      //       blower_snow_threshold: +tgsSnowSensorRef.current.value,
      //     });
      // } else if (tesSnowSensorRef.current.value) {
      //   const blowerDeviceIds = getDeviceIdsByLocationData(flatTesSwitch);
      //   blowerDeviceIds.length > 0 &&
      //     updateBlowerSettingService(blowerDeviceIds, {
      //       electrical_snow_threshold: +tesSnowSensorRef.current.value,
      //     });
      // }

      if (
        !essSnowSensorRef.current.value &&
        !tgsSnowSensorRef.current.value &&
        !tesSnowSensorRef.current.value
      ) {
        messageBoxTitle = 'settings';
        subtitle = 'snow sensor trigger';
        theme = 'input fields incomplete';
        messageBoxContent = [
          'input fields incomplete please field all the input fields.',
        ];
      } else if (
        +essSnowSensorRef.current.value === +essSnowSensorTemp &&
        +tgsSnowSensorRef.current.value === +tgsSnowSensorTemp &&
        +tesSnowSensorRef.current.value === +tesSnowSensorTemp
      ) {
        messageBoxTitle = 'settings';
        subtitle = 'wind factor trigger';
        theme = 'input fields unchanged';
        messageBoxContent = [
          'input fields set to the same temperature as before.',
        ];
      } else {
        messageBoxTitle = 'settings';
        subtitle = 'snow sensor trigger';
        theme = 'change temperature';
        messageBoxContent = savedMessageArr;
      }
    }

    // messages and dispatch for settings options => force & commands. check in store folder a folder call settings => forceAndCommands.js. check force&CommandAndAdminSelectSlice.js for select locations box
    else if (isForceAndCommandsSelected) {
      // *****ESS
      const copyIsAppliedAtsButtonState = [...isAppliedAtsButtonState];
      switch (sysIndex) {
        case 0:
          messageBoxTitle = 'settings';
          subtitle = 'force&commands';
          theme = 'ess-change options';
          messageBoxContent = ['please select ats options before apply.'];

          if (selectAtsButtonsState[sysIndex]) {
            const locations = Object.entries(
              selectForceAndCommandsState.essSpec
            );
            const deviceIds = [];
            const result = getLocationsSpecificLocationsMachines(locations);

            result.forEach((el) => {
              const [location, machine, specificLocation] = el;

              let accessMachineData = {};

              if (el.length === 2) {
                accessMachineData =
                  selectForceAndCommandsState.essSpec[location]?.devices[
                    machine
                  ];
              } else {
                accessMachineData =
                  selectForceAndCommandsState.essSpec[location]?.subLocations[
                    specificLocation
                  ]?.devices[machine];
              }
              if (accessMachineData?.isSelected) {
                deviceIds.push(machine);
                dispatch(
                  handleSelectAts({
                    swt: 'ess',
                    location,
                    specificLocation,
                    machine,
                    selection:
                      selected[sysIndex] === 0 ? 'reactivate' : 'block',
                  });
              }
            });

            deviceIds.length > 0 &&
              bulkUpdateSwitchDeviceService(deviceIds, {
                EBP: selected[sysIndex],
              });

            setSelectAtsButtonsState([false, false, false]);
            if (deviceIds.length <= 0) {
              messageBoxTitle = 'settings';
              subtitle = 'force&commands';
              theme = 'ess-change options';
              messageBoxContent = ['please select switches to continue ats.'];
            } else {
              messageBoxTitle = 'settings';
              subtitle = 'force&commands';
              theme = 'ess-change options';
              messageBoxContent = ['settings have been applied.'];

              copyIsAppliedAtsButtonState[sysIndex] = true;
              setIsAppliedAtsButtonState(copyIsAppliedAtsButtonState);
            }
          }
          break;

        // ***TGS
        case 1:
          messageBoxTitle = 'settings';
          subtitle = 'force&commands';
          theme = 'tgs-change options';
          messageBoxContent = ['please select ats options before apply.'];
          if (selectAtsButtonsState[sysIndex]) {
            copyIsAppliedAtsButtonState[sysIndex] = true;
            setIsAppliedAtsButtonState(copyIsAppliedAtsButtonState);

            const locations = Object.entries(
              selectForceAndCommandsState.tgsSpec
            );
            const deviceIds = [];

            const result = getLocationsSpecificLocationsMachines(locations);

            result.forEach((el) => {
              const [location, machine, specificLocation] = el;

              let accessMachineData = {};

              if (el.length === 2) {
                accessMachineData =
                  selectForceAndCommandsState.tgsSpec[location]?.devices[
                    machine
                  ];
              } else {
                accessMachineData =
                  selectForceAndCommandsState.tgsSpec[location]?.subLocations[
                    specificLocation
                  ]?.devices[machine];
              }
              if (accessMachineData?.isSelected) {
                deviceIds.push(machine);
                dispatch(
                  handleSelectAts({
                    swt: 'tgs',
                    location,
                    specificLocation,
                    machine,
                    selection:
                      selected[sysIndex] === 0 ? 'reactivate' : 'block',
                  });
              }
            });

            deviceIds.length > 0 &&
              bulkUpdateBlowerDeviceService(deviceIds, 'TGS', {
                EBP: selected[sysIndex],
              });

            setSelectAtsButtonsState([false, false, false]);
            if (deviceIds.length <= 0) {
              messageBoxTitle = 'settings';
              subtitle = 'force&commands';
              theme = 'tgs-change options';
              messageBoxContent = ['please select switches to continue ats.'];
            } else {
              messageBoxTitle = 'settings';
              subtitle = 'force&commands';
              theme = 'tgs-change options';
              messageBoxContent = ['settings have been applied.'];

              copyIsAppliedAtsButtonState[sysIndex] = true;
              setIsAppliedAtsButtonState(copyIsAppliedAtsButtonState);
            }
          }
          break;

        // ***Tes
        case 2:
          messageBoxTitle = 'settings';
          subtitle = 'force&commands';
          theme = 'tes-change options';
          messageBoxContent = ['please select ats options before apply.'];
          if (selectAtsButtonsState[sysIndex]) {
            copyIsAppliedAtsButtonState[sysIndex] = true;
            setIsAppliedAtsButtonState(copyIsAppliedAtsButtonState);

            const locations = Object.entries(
              selectForceAndCommandsState.tesSpec
            );
            const deviceIds = [];

            const result = getLocationsSpecificLocationsMachines(locations);

            result.forEach((el) => {
              const [location, machine, specificLocation] = el;

              let accessMachineData = {};

              if (el.length === 2) {
                accessMachineData =
                  selectForceAndCommandsState.tesSpec[location]?.devices[
                    machine
                  ];
              } else {
                accessMachineData =
                  selectForceAndCommandsState.tesSpec[location]?.subLocations[
                    specificLocation
                  ]?.devices[machine];
              }
              if (accessMachineData?.isSelected) {
                deviceIds.push(machine);
                dispatch(
                  handleSelectAts({
                    swt: 'tes',
                    location,
                    specificLocation,
                    machine,
                    selection:
                      selected[sysIndex] === 0
                        ? 'switch'
                        : selected[0] === 1
                        ? 'reactivate'
                        : 'block',
                  });
              }
            });

            deviceIds.length > 0 &&
              bulkUpdateBlowerDeviceService(deviceIds, 'TES', {
                EBP: selected[sysIndex],
              });

            setSelectAtsButtonsState([false, false, false]);
            if (deviceIds.length <= 0) {
              messageBoxTitle = 'settings';
              subtitle = 'force&commands';
              theme = 'tes-change options';
              messageBoxContent = ['please select switches to continue ats.'];
            } else {
              messageBoxTitle = 'settings';
              subtitle = 'force&commands';
              theme = 'tes-change options';
              messageBoxContent = ['settings have been applied.'];

              copyIsAppliedAtsButtonState[sysIndex] = true;
              setIsAppliedAtsButtonState(copyIsAppliedAtsButtonState);
            }
          }
          break;
        case 5:
          const locations = Object.entries(selectForceAndCommandsState.sysSpec);
          let countAllDevicesIds = 0;
          let activatedTCSelectBoxes = 0;

          const result = getLocationsSpecificLocationsMachines(locations);
          if (isSave.outsideTemp) {
            const stringifyNum =
              tCNumber[0] <= 9 ? '0' + (tCNumber[0] + 1) : tCNumber[0] + 1;

            activatedTCSelectBoxes++;

            const switchDeviceIds = [];
            const blowerDeviceIds = [];

            result.forEach((el) => {
              const [location, machine, specificLocation] = el;

              let accessMachineData = {};
              if (el.length === 2) {
                accessMachineData =
                  selectForceAndCommandsState.sysSpec[location]?.devices[
                    machine
                  ];
              } else {
                accessMachineData =
                  selectForceAndCommandsState.sysSpec[location]?.subLocations[
                    specificLocation
                  ]?.devices[machine];
              }
              if (accessMachineData?.isOutsideTempSelected) {
                if (accessMachineData.deviceType === 'switches') {
                  switchDeviceIds.push(machine);
                  countAllDevicesIds++;
                } else if (accessMachineData.deviceType === 'blowers') {
                  blowerDeviceIds.push(machine);
                  countAllDevicesIds++;
                }
                dispatch(
                  handleSelectTC({
                    location,
                    specificLocation,
                    machine,
                    selectedTCSys: 'outsideTempTCNumber',
                    tcNum: 'tc' + stringifyNum,
                  });
              }
            });

            switchDeviceIds.length > 0 &&
              updateSwitchSettingService(
                switchDeviceIds,
                {
                  outside_temp_ch:
                    tCNumber[0] === 'internet' ? tCNumber[0] : tCNumber[0] + 1,
                },
                true
              );
            blowerDeviceIds.length > 0 &&
              updateBlowerSettingService(
                blowerDeviceIds,
                {
                  outside_temp_ch:
                    tCNumber[0] === 'internet' ? tCNumber[0] : tCNumber[0] + 1,
                },
                true
              );
          }
          if (isSave.burningChamber) {
            const stringifyNum =
              tCNumber[1] <= 9 ? '0' + (tCNumber[1] + 1) : tCNumber[1] + 1;
            activatedTCSelectBoxes++;

            const blowerDeviceIds = [];

            result.forEach((el) => {
              const [location, machine, specificLocation] = el;
              let accessMachineData = {};
              if (el.length === 2) {
                accessMachineData =
                  selectForceAndCommandsState.sysSpec[location]?.devices[
                    machine
                  ];
              } else {
                accessMachineData =
                  selectForceAndCommandsState.sysSpec[location]?.subLocations[
                    specificLocation
                  ]?.devices[machine];
              }
              if (accessMachineData?.isBurningChamberSelected) {
                blowerDeviceIds.push(accessMachineData.deviceMac);
                countAllDevicesIds++;
                dispatch(
                  handleSelectTC({
                    location,
                    machine,
                    specificLocation,
                    selectedTCSys: 'burningChamberTCNumber',
                    tcNum: 'tc' + stringifyNum,
                  });
              }
            });

            blowerDeviceIds.length > 0 &&
              updateBlowerSettingService(
                blowerDeviceIds,
                {
                  burner_temp_ch: tCNumber[1] + 1,
                },
                true
              );
          }
          if (isSave.encloseTemp) {
            const stringifyNum =
              tCNumber[2] <= 9 ? '0' + (tCNumber[2] + 1) : tCNumber[2] + 1;

            activatedTCSelectBoxes++;

            const switchDeviceIds = [];
            const blowerDeviceIds = [];

            result.forEach((el) => {
              const [location, machine, specificLocation] = el;

              let accessMachineData = {};
              if (el.length === 2) {
                accessMachineData =
                  selectForceAndCommandsState.sysSpec[location]?.devices[
                    machine
                  ];
              } else {
                accessMachineData =
                  selectForceAndCommandsState.sysSpec[location]?.subLocations[
                    specificLocation
                  ]?.devices[machine];
              }
              if (accessMachineData?.isEncloseTempSelected) {
                if (accessMachineData.deviceType === 'switches') {
                  switchDeviceIds.push(machine);
                  countAllDevicesIds++;
                } else if (accessMachineData.deviceType === 'blowers') {
                  blowerDeviceIds.push(machine);
                  countAllDevicesIds++;
                }
                dispatch(
                  handleSelectTC({
                    location,
                    machine,
                    specificLocation,
                    selectedTCSys: 'encloseTempTCNumber',
                    tcNum: 'tc' + stringifyNum,
                  });
              }
            });

            switchDeviceIds.length > 0 &&
              updateSwitchSettingService(
                switchDeviceIds,
                {
                  enclosure_temp_ch: tCNumber[2] + 1,
                },
                true
              );
            blowerDeviceIds.length > 0 &&
              updateBlowerSettingService(
                blowerDeviceIds,
                {
                  enclosure_temp_ch: tCNumber[2] + 1,
                },
                true
              );
          }
          if (isSave.currEss) {
            const stringifyNum =
              tCNumber[3] <= 9 ? '0' + (tCNumber[3] + 1) : tCNumber[3] + 1;

            activatedTCSelectBoxes++;

            const switchDeviceIds = [];

            result.forEach((el) => {
              const [location, machine, specificLocation] = el;

              let accessMachineData = {};
              if (el.length === 2) {
                accessMachineData =
                  selectForceAndCommandsState.sysSpec[location]?.devices[
                    machine
                  ];
              } else {
                accessMachineData =
                  selectForceAndCommandsState.sysSpec[location]?.subLocations[
                    specificLocation
                  ]?.devices[machine];
              }
              if (accessMachineData?.isCurrEssSelected) {
                switchDeviceIds.push(accessMachineData.deviceMac);
                countAllDevicesIds++;
                dispatch(
                  handleSelectTC({
                    location,
                    specificLocation,
                    machine,
                    selectedTCSys: 'currEssTCNumber',
                    tcNum: 'tc' + stringifyNum,
                  });
              }
            });

            switchDeviceIds.length > 0 &&
              updateSwitchSettingService(
                switchDeviceIds,
                {
                  display_temp_ch: tCNumber[3] + 1,
                },
                true
              );
          }
          if (isSave.currTgs) {
            const stringifyNum =
              tCNumber[4] <= 9 ? '0' + (tCNumber[4] + 1) : tCNumber[4] + 1;

            activatedTCSelectBoxes++;

            const blowerDeviceIds = [];

            result.forEach((el) => {
              const [location, machine, specificLocation] = el;

              let accessMachineData = {};
              if (el.length === 2) {
                accessMachineData =
                  selectForceAndCommandsState.sysSpec[location]?.devices[
                    machine
                  ];
              } else {
                accessMachineData =
                  selectForceAndCommandsState.sysSpec[location]?.subLocations[
                    specificLocation
                  ]?.devices[machine];
              }
              if (accessMachineData?.isCurrTgsSelected) {
                blowerDeviceIds.push(accessMachineData.deviceMac);
                countAllDevicesIds++;
                dispatch(
                  handleSelectTC({
                    location,
                    specificLocation,
                    machine,
                    selectedTCSys: 'currTgsTCNumber',
                    tcNum: 'tc' + stringifyNum,
                  });
              }
            });

            blowerDeviceIds.length > 0 &&
              updateBlowerSettingService(
                blowerDeviceIds,
                {
                  blower_temp_ch: tCNumber[4] + 1,
                },
                true
              );
          }
          if (isSave.currTes) {
            const stringifyNum =
              tCNumber[5] <= 9 ? '0' + (tCNumber[5] + 1) : tCNumber[5] + 1;

            activatedTCSelectBoxes++;

            const blowerDeviceIds = [];

            result.forEach((el) => {
              const [location, machine, specificLocation] = el;

              let accessMachineData = {};
              if (el.length === 2) {
                accessMachineData =
                  selectForceAndCommandsState.sysSpec[location]?.devices[
                    machine
                  ];
              } else {
                accessMachineData =
                  selectForceAndCommandsState.sysSpec[location]?.subLocations[
                    specificLocation
                  ]?.devices[machine];
              }
              if (accessMachineData?.isCurrTesSelected) {
                blowerDeviceIds.push(accessMachineData.deviceMac);

                countAllDevicesIds++;

                dispatch(
                  handleSelectTC({
                    location,
                    specificLocation,
                    machine,
                    selectedTCSys: 'currTesTCNumber',
                    tcNum: 'tc' + stringifyNum,
                  });
              }
            });

            blowerDeviceIds.length > 0 &&
              updateBlowerSettingService(
                blowerDeviceIds,
                {
                  display_temp_ch: tCNumber[5] + 1,
                },
                true
              );
          }

          if (
            (activeSelect && tCNumber[0] <= 0) ||
            activatedTCSelectBoxes === 0
          ) {
            messageBoxTitle = 'settings';
            subtitle = 'force&commands';
            theme = 'system commands-change options';
            messageBoxContent = ['please select a t/c option before apply.'];
          } else if (countAllDevicesIds === 0) {
            messageBoxTitle = 'settings';
            subtitle = 'force&commands';
            theme = 'system commands-change options';
            messageBoxContent = [
              'please select switches to continue t/c telemetry.',
            ];
          } else {
            messageBoxTitle = 'settings';
            subtitle = 'force&commands';
            theme = 'system commands-change options';
            messageBoxContent = ['settings have been applied.'];
          }
          setIsSave(selectTCsInitialState);
          countAllDevicesIds = 0;
          activatedTCSelectBoxes = 0;
          break;

        default:
          setIsSave(selectTCsInitialState);
          break;
      }
    }
    // messages and dispatch for settings options => admin. check in store folder a folder call settings => admin =>adminSlice.js and addElementToBankAndSystemIdentificationSlice.js. check force&CommandAndAdminSelectSlice.js for select locations box
    else if (isAdminSelected) {
      switch (sysIndex) {
        case 0:
          messageBoxTitle = 'settings';
          subtitle = 'administration settings';
          theme = 'ess-change options';
          messageBoxContent = 'no settings have been applied';
          if (
            saveChanges.trackTempControl ||
            saveChanges.deactivateTrackTempControl
          ) {
            messageBoxTitle = 'settings';
            subtitle = 'administration settings';
            theme = 'ess-change options';
            messageBoxContent =
              'track temperature control t/c settings have been applied';

            const essState = selectAdminState.essSpec;
            const locations = Object.entries(essState);

            const result = getLocationsSpecificLocationsMachines(locations);

            const deviceIds = [];

            result.forEach((el) => {
              const [location, machine, specificLocation] = el;
              let accessMachineData = {};

              if (el.length === 2) {
                accessMachineData = essState[location].devices[machine];
              } else {
                accessMachineData =
                  essState[location].subLocations[specificLocation].devices[
                    machine
                  ];
              }
              if (accessMachineData?.isSelected) {
                deviceIds.push(machine);
                dispatch(
                  handleTrackTempControl({
                    swt: 'ess',
                    location,
                    specificLocation,
                    machine,
                    selection: saveChanges.trackTempControl
                      ? true
                      : saveChanges.deactivateTrackTempControl && false,
                  });
              }
            });

            // const selection = Object.values(selectAdminState.ess);
            // locations.forEach((location) => {
            //   selection.forEach((value) => {
            //     Object.keys(value).forEach((machine) => {
            //       if (selectAdminState.ess[location][machine]?.isSelected) {
            //         deviceIds.push(machine);
            //         dispatch(
            //           handleTrackTempControl({
            //             swt: 'ess',
            //             location,
            //             machine,
            //             selection: saveChanges.trackTempControl
            //               ? true
            //               : saveChanges.deactivateTrackTempControl && false,
            //           })
            //         );
            //       }
            //     });
            //   });
            // });

            deviceIds.length > 0 &&
              updateSwitchSettingService(
                deviceIds,
                {
                  tc_mode: saveChanges.trackTempControl ? 0 : 1,
                },
                true
              );
          }
          if (saveChanges.addElementToBank) {
            messageBoxTitle = 'settings';
            subtitle = 'administration settings';
            theme = 'ess-change options';

            try {
              await addAdminHeatersService(
                mapValues(saveInputElement, (value) => value.toString());
              messageBoxContent =
                'add element to bank settings have been applied';

              dispatch(handleAddElementToBank(saveInputElement);
              setSaveChanges(SaveChangesInitialState);
            } catch (error) {
              messageBoxContent = `Failed to apply changes: ${
                error.message || 'Unknown error'
              }`;
              setSaveChanges(SaveChangesInitialState);
            }
          }

          if (saveChanges.addElementToBank && saveChanges.trackTempControl) {
            messageBoxTitle = 'settings';
            subtitle = 'administration settings';
            theme = 'ess-change options';
            messageBoxContent =
              'add element to bank & track temperature control t/c settings have been applied';
          }

          break;
        case 1:
          messageBoxTitle = 'settings';
          subtitle = 'administration settings';
          theme = 'tgs-change options';
          messageBoxContent =
            'please confirm each gas value position before applying';
          const tgsState = selectAdminState.tgsSpec;
          const tgsStateSpec = selectAdminState.tgs;
          const locations = Object.entries(tgsState);
          const result = getLocationsSpecificLocationsMachines(locations);
          const deviceIds = [];
          const devicesValve = [];

          if (saveChanges.selectGasType) {
            messageBoxTitle = 'settings';
            subtitle = 'administration settings';
            theme = 'tgs-change options';
            messageBoxContent = 'select gas type settings have been applied';

            result.forEach((el) => {
              const [location, machine, specificLocation] = el;
              let accessMachineData = {};

              if (el.length === 2) {
                accessMachineData = tgsState[location].devices[machine];
              } else {
                accessMachineData =
                  tgsState[location].subLocations[specificLocation].devices[
                    machine
                  ];
              }
              if (accessMachineData?.isSelectedGasType) {
                deviceIds.push(machine);
                dispatch(
                  handleGasType({
                    location,
                    specificLocation,
                    machine,
                    value: gasSelection === 0 ? 'lp' : 'ng',
                  });
              }
            });

            // const selection = Object.values(selectAdminState.tgs);
            // const deviceIds = [];
            // locations.forEach((location) => {
            //   selection.forEach((value) => {
            //     Object.keys(value).forEach((machine) => {
            //       if (
            //         selectAdminState.tgs[location][machine]?.isSelectedGasType
            //       ) {
            //         deviceIds.push(machine);
            //         dispatch(
            //           handleGasType({
            //             location,
            //             machine,
            //             value: gasSelection === 0 ? 'lp' : 'ng',
            //           })
            //         );
            //       }
            //     });
            //   });
            // });

            deviceIds.length > 0 &&
              bulkUpdateBlowerDeviceService(deviceIds, 'TGS', {
                Gas_type: gasSelection === 0 ? 'LP' : 'NG',
              });
          }
          if (saveChanges.valveSettings) {
            messageBoxTitle = 'settings';
            subtitle = 'administration settings';
            theme = 'tgs-change options';
            messageBoxContent = 'valve settings settings have been applied';

            result.forEach((el) => {
              const [location, machine, specificLocation] = el;
              let accessMachineData = {};
              if (specificLocation) {
                accessMachineData = tgsStateSpec[specificLocation][machine];
              } else {
                accessMachineData = tgsStateSpec[location][machine];
              }
              if (accessMachineData?.gasValue.isConfirm) {

                if (!specificLocation) {
                  devicesValve.push({
                    deviceId: machine,
                    initial_open:
                      tgsStateSpec[location][machine].gasValue.startPosition,
                    min_open:
                      tgsStateSpec[location][machine].gasValue.minPosition,
                    max_open:
                      tgsStateSpec[location][machine].gasValue.maxPosition,
                  });
                } else {
                  devicesValve.push({
                    deviceId: machine,
                    initial_open:
                      tgsStateSpec[specificLocation][machine].gasValue
                        .startPosition,
                    min_open:
                      tgsStateSpec[specificLocation][machine].gasValue
                        .minPosition,
                    max_open:
                      tgsStateSpec[specificLocation][machine].gasValue
                        .maxPosition,
                  });
                }
                if (specificLocation) {
                  dispatch(
                    handleGasValuePosition({
                      location: specificLocation,
                      machine,
                      position: 'isApply',
                      value: true,
                    });
                } else {
                  dispatch(
                    handleGasValuePosition({
                      location,
                      machine,
                      position: 'isApply',
                      value: true,
                    });
                }
              }
            });

            // const locations = Object.keys(selectAdminState.tgs);
            // const selection = Object.values(selectAdminState.tgs);
            // const devicesValve = [];
            // locations.forEach((location) => {
            //   selection.forEach((value) => {
            //     Object.keys(value).forEach((machine) => {
            //       if (
            //         selectAdminState.tgs[location][machine]?.gasValue.isConfirm
            //       ) {
            //         devicesValve.push({
            //           deviceId: '100000009e851421',
            //           initial_open:
            //             selectAdminState.tgs[location][machine].gasValue
            //               .startPosition,
            //           min_open:
            //             selectAdminState.tgs[location][machine].gasValue
            //               .minPosition,
            //           max_open:
            //             selectAdminState.tgs[location][machine].gasValue
            //               .maxPosition,
            //         });
            //         dispatch(
            //           handleGasValuePosition({
            //             location,
            //             machine,
            //             position: 'isApply',
            //             value: true,
            //           })
            //         );
            //       }
            //     });
            //   });
            // });

            devicesValve.length > 0 &&
              updateDevicesValveService({
                valve_settings: devicesValve,
                testDevices: true,
              });
          }
          if (saveChanges.valveSettings && saveChanges.selectGasType) {
            messageBoxTitle = 'settings';
            subtitle = 'administration settings';
            theme = 'tgs-change options';
            messageBoxContent =
              'valve settings & select gas type settings have been applied';
          }
          setSaveChanges(SaveChangesInitialState);
          break;
        case 2:
          messageBoxTitle = 'settings';
          subtitle = 'administration settings';
          theme = 'tes-change options';
          messageBoxContent = 'no settings have been applied';
          if (
            saveChanges.trackTempControl ||
            saveChanges.deactivateTrackTempControl
          ) {
            messageBoxTitle = 'change options';
            messageBoxContent =
              'track temperature control t/c settings have been applied';
            const tesState = selectAdminState.tesSpec;
            const locations = Object.entries(tesState);
            const result = getLocationsSpecificLocationsMachines(locations);
            const deviceIds = [];

            result.forEach((el) => {
              const [location, machine, specificLocation] = el;
              let accessMachineData = {};

              if (el.length === 2) {
                accessMachineData = tesState[location].devices[machine];
              } else {
                accessMachineData =
                  tesState[location].subLocations[specificLocation].devices[
                    machine
                  ];
              }
              if (accessMachineData?.isSelected) {
                deviceIds.push(machine);
                dispatch(
                  handleTrackTempControl({
                    swt: 'tes',
                    location,
                    specificLocation,
                    machine,
                    selection: saveChanges.trackTempControl
                      ? true
                      : saveChanges.deactivateTrackTempControl && false,
                  });
              }
            });

            // locations.forEach((location) => {
            //   selection.forEach((value) => {
            //     Object.keys(value).forEach((machine) => {
            //       if (selectAdminState.tes[location][machine]?.isSelected) {
            //         deviceIds.push(machine);
            //         dispatch(
            //           handleTrackTempControl({
            //             swt: 'tes',
            //             location,
            //             machine,
            //             selection: saveChanges.trackTempControl
            //               ? true
            //               : saveChanges.deactivateTrackTempControl && false,
            //           })
            //         );
            //       }
            //     });
            //   });
            // });

            deviceIds.length > 0 &&
              updateBlowerSettingService(
                deviceIds,
                {
                  tc_mode: saveChanges.trackTempControl ? 0 : 1,
                },
                true
              );
          }
          if (saveChanges.addElementToBank) {
            messageBoxTitle = 'change options';
            messageBoxContent =
              'add element to bank settings have been applied';
            dispatch(handleAddElementToBank(saveInputElement);
            try {
              await addAdminHeatersService(
                mapValues(saveInputElement, (value) => value.toString());
              messageBoxContent =
                'add element to bank settings have been applied';

              dispatch(handleAddElementToBank(saveInputElement);
              setSaveChanges(SaveChangesInitialState);
            } catch (error) {
              messageBoxContent = `Failed to apply changes: ${
                error.message || 'Unknown error'
              }`;
            }
          }
          if (saveChanges.trackTempControl && saveChanges.addElementToBank) {
            messageBoxTitle = 'change options';
            messageBoxContent =
              'add element to bank & track temperature control t/c settings have been applied';
          }
          break;

        // system identification and force&gas
        case 5:
          messageBoxTitle = 'change options';
          messageBoxContent = 'no settings have been applied';

          if (saveChanges.systemIdentification) {
            // Create
            if (isCreateEditOrSave === 0) {
              // saves all the individual grouped switches that was clicked to save.
              if (saveChanges.systemIdentification === 'someUOSSaved') {
                const allSavedSwitches = [];

                isGroupedSwitchesSaved.forEach((el, idx) => {
                  if (el) {
                    allSavedSwitches.push(switches[idx]);
                  }
                });

                createUOSZoneService(newSysIdentificationData(allSavedSwitches))
                  .then(() => {
                    dispatch(
                      handleCreateSysIdentification({
                        specificLocationName: specificLocation,
                        address: civicAddress,
                        location: locationNameRef.current.value,
                        specificLocationInfo: {
                          numOfUOS,
                          numOfSSR,
                          switchesNum: allSavedSwitches.length,
                          switchInfo: allSavedSwitches,
                        },
                      });
                  })
                  .then(() => {
                    getZonesInfoForSystemIdentificationService().then((res) => {
                      dispatch(
                        handleLocationsSystemIdentification({
                          data: res,
                          heaterSpecs: elementsOptions,
                        });
                    });
                  });
              } else if (
                saveChanges.systemIdentification === 'allTheUOSSaved'
              ) {
                if (isConfirmed) {
                  //  It saves all the grouped switches but it needs change data structure before dispatch
                  const sortedSwitchesArr = [];
                  switches.forEach((el) => {
                    el.forEach((switchInfo) => {
                      sortedSwitchesArr.push(switchInfo);
                    });
                  });

                  createUOSZoneService(
                    newSysIdentificationData(sortedSwitchesArr)
                  )
                    .then(() => {
                      dispatch(
                        handleCreateSysIdentification({
                          specificLocationName: specificLocation,
                          location: locationNameRef.current.value,
                          address: civicAddress,
                          specificLocation: {
                            numOfUOS,
                            numOfSSR,
                            switchesNum: sortedSwitchesArr.length,
                            switchInfo: sortedSwitchesArr,
                          },
                        });
                    })
                    .then(() => {
                      getZonesInfoForSystemIdentificationService().then(
                        (res) => {
                          dispatch(
                            handleLocationsSystemIdentification({
                              data: res,
                              heaterSpecs: elementsOptions,
                            });
                        }
                      );
                    });
                } else {
                  // no need to change data structure and dispatch immediately
                  createUOSZoneService(newSysIdentificationData(switches))
                    .then(() => {
                      dispatch(
                        handleCreateSysIdentification({
                          address: civicAddress,
                          location: locationNameRef.current.value,
                          specificLocationName: specificLocation,
                          specificLocationInfo: {
                            numOfUOS,
                            numOfSSR,
                            switchesNum: switches.length,
                            switchInfo: switches,
                          },
                        });
                    })
                    .then(() => {
                      getZonesInfoForSystemIdentificationService().then(
                        (res) => {
                          dispatch(
                            handleLocationsSystemIdentification({
                              data: res,
                              heaterSpecs: elementsOptions,
                            });
                        }
                      );
                    });
                }
              } else {
                createUOSZoneService(newSysIdentificationData(switches))
                  .then(() => {
                    dispatch(
                      handleCreateSysIdentification({
                        specificLocationName: specificLocation,
                        address: civicAddress,
                        location: locationNameRef.current.value,
                        specificLocationInfo: {
                          numOfUOS,
                          numOfSSR,
                          switchesNum: switches.length,
                          switchInfo: switches,
                        },
                      });
                  })
                  .then(() => {
                    getZonesInfoForSystemIdentificationService().then((res) => {
                      dispatch(
                        handleLocationsSystemIdentification({
                          data: res,
                          heaterSpecs: elementsOptions,
                        });
                    });
                  });
              }

              // dispatch(
              //   handleCreateSysIdentification({
              //     location: locationNameRef.current.value,
              //     address: civicAddress,
              //     switchesNum: switches.length,
              //     switchInfo: switches,
              //   })
              // );
              messageBoxTitle = 'change options';
              messageBoxContent =
                'new location and switches of system identification settings have been created';
            }

            // Edit
            if (isCreateEditOrSave === 1) {
              if (saveChanges.systemIdentification === 'deleteLocation') {
                updateUOSZoneService(updateSysIdentificationData(switches))
                  .then(() => {
                    essRefetch();
                    tgsRefetch(); 
                    tesRefetch();
                    dispatch(
                      handleRemoveSysIdentificationLocation({
                        locationIdx: selectedLocation.locationIdx,
                      });
                    setUOSDelete([]);
                  })
                  .then(() => {
                    getZonesInfoForSystemIdentificationService().then((res) => {
                      dispatch(
                        handleLocationsSystemIdentification({
                          data: res,
                          heaterSpecs: elementsOptions,
                        });
                    });
                  });
                messageBoxTitle = 'change options';
                messageBoxContent =
                  'selected location of system identification settings has been deleted';
              } else if (saveChanges.systemIdentification === 'someUOSSaved') {
                isGroupedSwitchesSaved.forEach((el, idx) => {
                  if (el) {
                    dispatch(
                      handleEditSysIdentification({
                        locationIdx: selectedLocation.locationIdx,
                        modifiedLocation: {
                          location: locationNameRef.current.value,
                          specificLocation: specificLocation,
                          address: civicAddress,
                          numOfUOS,
                          numOfSSR,
                          switchesNum: switches.length,
                          switchInfo: switches[idx],
                        },
                        isEditAll: false,
                      });
                  }
                });
                updateUOSZoneService(
                  updateSysIdentificationData(switches)
                ).then(() => {
                  setUOSDelete([]);
                  getZonesInfoForSystemIdentificationService().then((res) => {
                    dispatch(
                      handleLocationsSystemIdentification({
                        data: res,
                        heaterSpecs: elementsOptions,
                      });
                  });
                });

                messageBoxTitle = 'change options';
                messageBoxContent =
                  'location and/or switches info of system identification settings have been modified';
              } else if (
                saveChanges.systemIdentification === 'allTheUOSSaved'
              ) {
                if (isConfirmed) {
                  const sortedSwitchesArr = [];
                  switches.forEach((el) => {
                    el.forEach((switchInfo) => {
                      sortedSwitchesArr.push(switchInfo);
                    });
                  });

                  // // !!TEST
                  // dispatch(
                  //   handleEditSysIdentification({
                  //     locationIdx: selectedLocation.locationIdx,
                  //     modifiedLocation: {
                  //       location: locationNameRef.current.value,
                  //       specificLocation: specificLocation,
                  //       address: civicAddress,
                  //       numOfUOS,
                  //       numOfSSR,
                  //       switchesNum: sortedSwitchesArr.length,
                  //       switchInfo: sortedSwitchesArr,
                  //     },
                  //     isEditAll: false,
                  //   })
                  // );
                  // // !!END
                  updateUOSZoneService(
                    updateSysIdentificationData(sortedSwitchesArr)
                  ).then(() => {
                    essRefetch();
                    tgsRefetch(); 
                    tesRefetch();
                    dispatch(
                      handleEditSysIdentification({
                        locationIdx: selectedLocation.locationIdx,
                        modifiedLocation: {
                          location: locationNameRef.current.value,
                          specificLocation: specificLocation,
                          address: civicAddress,
                          numOfUOS,
                          numOfSSR,
                          switchesNum: sortedSwitchesArr.length,
                          switchInfo: sortedSwitchesArr,
                        },
                        isEditAll: false,
                      });

                    // dispatch(
                    //   handleEditSysIdentification({
                    //     locationIdx: selectedLocation.locationIdx,
                    //     specificLocationName: specificLocation,
                    //     modifiedLocation: {
                    //       address: civicAddress,
                    //       location: locationNameRef.current.value,
                    //       specificLocation: {
                    //         [specificLocation ?? 'info']: {
                    //           numOfUOS,
                    //           numOfSSR,
                    //           switchesNum: switches.length,
                    //           switchInfo: sortedSwitchesArr,
                    //         },
                    //       },
                    //     },
                    //     isEditAll: true,
                    //   })
                    // );
                    setUOSDelete([]);
                    getZonesInfoForSystemIdentificationService().then((res) => {
                      dispatch(
                        handleLocationsSystemIdentification({
                          data: res,
                          heaterSpecs: elementsOptions,
                        });
                    });
                  });
                } else {
                  // // !!TEST
                  // dispatch(
                  //   handleEditSysIdentification({
                  //     locationIdx: selectedLocation.locationIdx,
                  //     specificLocationName: specificLocation,
                  //     modifiedLocation: {
                  //       location: locationNameRef.current.value,
                  //       address: civicAddress,
                  //       specificLocation: {
                  //         [specificLocation ?? 'info']: {
                  //           numOfUOS,
                  //           numOfSSR,
                  //           switchesNum: switches.length,
                  //           switchInfo: switches,
                  //         },
                  //       },
                  //     },
                  //     isEditAll: true,
                  //   })
                  // );
                  // // !!END
                  updateUOSZoneService(
                    updateSysIdentificationData(switches)
                  ).then(() => {
                    essRefetch();
                    tgsRefetch(); 
                    tesRefetch();
                    dispatch(
                      handleEditSysIdentification({
                        locationIdx: selectedLocation.locationIdx,
                        specificLocationName: specificLocation,
                        modifiedLocation: {
                          location: locationNameRef.current.value,
                          address: civicAddress,
                          specificLocation: {
                            [specificLocation ?? 'info']: {
                              numOfUOS,
                              numOfSSR,
                              switchesNum: switches.length,
                              switchInfo: switches,
                            },
                          },
                          // specificLocation: specificLocation,
                          // address: civicAddress,
                          // numOfUOS,
                          // numOfSSR,
                          // switchesNum: switches.length,
                          // switchInfo: switches,
                        },
                        isEditAll: true,
                      });
                    setUOSDelete([]);
                    getZonesInfoForSystemIdentificationService().then((res) => {
                      dispatch(
                        handleLocationsSystemIdentification({
                          data: res,
                          heaterSpecs: elementsOptions,
                        });
                    });
                  });
                }

                messageBoxTitle = 'change options';
                messageBoxContent =
                  'location and/or switches info of system identification settings have been modified';
              }

              // setSelectedLocation(null);
            }
            // setSwitches([
            //   {
            //     UOS: '',
            //     switchName: '',
            //     heatingSys: '',
            //     gasType: '',
            //     selectedSSR: [],
            //     application: '',
            //     switchSize: '',
            //     ssrRating: '',
            //     sysId: '',
            //     displaySelectBox: [false, false, false],
            //   },
            // ]);

            // setIsCreateOrEditOrSave(null);
            // locationNameRef.current.value = '';
            // setCivicAddress('');
            // setNumSwitches('');
            // setNumOfUOS('');
            // setNumOfSSR('');
          }
          // force&gas
          if (saveChanges.forceGasAndElectric) {
            messageBoxTitle = 'change options';
            messageBoxContent =
              'force - gas & electric system simultaneously on for 15 minutes settings have been applied';
            const sysState = selectAdminState.sysSpec;
            const locations = Object.entries(sysState);
            const result = getLocationsSpecificLocationsMachines(locations);
            const deviceIds = [];

            result.forEach((el) => {
              const [location, machine, specificLocation] = el;
              let accessMachineData = {};

              if (el.length === 2) {
                accessMachineData = sysState[location].devices[machine];
              } else {
                accessMachineData =
                  sysState[location].subLocations[specificLocation].devices[
                    machine
                  ];
              }
              if (accessMachineData?.isSelected) {
                deviceIds.push(machine);
                dispatch(
                  handleForceGasAndElectric({
                    location,
                    specificLocation,
                    machine,
                    selection: enableSwitch ? 'enable' : 'disable',
                  });
              }
            });

            // locations.forEach(([location, value]) => {
            //   Object.keys(value).forEach((machine) => {
            //     if (selectAdminState.sys[location][machine]?.isSelected) {
            //       deviceIds.push(machine);
            //       dispatch(
            //         handleForceGasAndElectric({
            //           location,
            //           machine,
            //           selection: enableSwitch ? 'enable' : 'disable',
            //         })
            //       );
            //     }
            //   });
            // });

            deviceIds.length > 0 &&
              updateBlowerSettingService(
                deviceIds,
                {
                  force: enableSwitch ? 1 : 0,
                },
                true
              );
          }
          // if (saveChanges.systemConfiguration) {
          //   const locations = Object.entries(selectAdminState.sys);
          //   locations.forEach(([location, value]) => {
          //     Object.keys(value).forEach((machine) => {
          //       if (selectAdminState.sys[location][machine].isSelected) {
          //         dispatch(
          //           handleSysConfiguration({
          //             location,
          //             machine,
          //             selection: selectSystemConfig === 0 ? false : true,
          //           })
          //         );
          //       }
          //     });
          //   });
          // }
          if (
            saveChanges.forceGasAndElectric &&
            saveChanges.systemIdentification
          ) {
            messageBoxTitle = 'change options';
            messageBoxContent =
              'system identification & force - gas & electric system simultaneously on for 15 minutes settings have been applied';
          }
          setSaveChanges(SaveChangesInitialState);
          break;
        default:
          setSaveChanges(SaveChangesInitialState);
          break;
      }
    }
    setMessageBoxContent({
      title: [messageBoxTitle],
      subtitle,
      theme,
      message: messageBoxContent,
    });
  };

  // close message box
  const handleCloseMessageBox = () => {
    setOpenMessageBox(false);
    if (isForceAndCommandsSelected || isAdminSelected) {
      const copyOpenHeaders = [...openHeaders];
      copyOpenHeaders.fill(false);
      setOpenHeaders(copyOpenHeaders);
    }
    return;
  };

  // handles the confirm button of SettingConfirmCancelMessageBox
  const handleConfirmButton = (settingOptions) => {
    handleCloseMessageBox();
    switch (settingOptions) {
      case 'windFactor':
        dispatch(
          handleSetWindTemp({
            objectName: 'lowWindTemp',
            temp: lowWindTempRef.current.value,
          });
        dispatch(
          handleSetWindTemp({
            objectName: 'medWindTemp',
            temp: medWindTempRef.current.value,
          });
        dispatch(
          handleSetWindTemp({
            objectName: 'highWindTemp',
            temp: highWindTempRef.current.value,
          });
        dispatch(
          handleSetWindTemp({
            objectName: 'extremeWindTemp',
            temp: extremeWindTempRef.current.value,
          });
        dispatch(
          handleSetWindTemp({
            objectName: 'windFactorSavedUnitIsF',
            temp: isF,
          });

        const switchDeviceIds = getDeviceIdsByLocationData(flatEssSwitch);
        const blowerDeviceIds = [
          ...new Set([
            ...getDeviceIdsByLocationData(flatTgsSwitch),
            ...getDeviceIdsByLocationData(flatTesSwitch),
          ]),
        ];
        const data = [
          +lowWindTempRef.current.value,
          +medWindTempRef.current.value,
          +highWindTempRef.current.value,
          +extremeWindTempRef.current.value,
        ];
        switchDeviceIds.length > 0 &&
          updateSwitchSettingService(
            switchDeviceIds,
            {
              wind_threshold: data,
            },
            true
          );
        blowerDeviceIds.length > 0 &&
          updateBlowerSettingService(
            blowerDeviceIds,
            {
              wind_threshold: data,
            },
            true
          );

        break;
      case 'snowSensor':
        // dispatch the unit of measurement for the saved temp
        dispatch(
          handleSnowSensorTemp({
            keyName: 'snowSensorSavedUnitIsF',
            value: isF,
          });

        if (
          essSnowSensorRef.current.value &&
          +essSnowSensorRef.current.value !== +essSnowSensorTemp
        ) {
          const switchDeviceIds = getDeviceIdsByLocationData(flatEssSwitch);
          dispatch(
            handleSnowSensorTemp({
              keyName: 'essSnowSensorTemp',
              value: essSnowSensorRef.current.value,
            });
          switchDeviceIds.length > 0 &&
            updateSwitchSettingService(
              switchDeviceIds,
              {
                snow_threshold: +essSnowSensorRef.current.value,
              },
              true
            );
        }
        if (
          tgsSnowSensorRef.current.value &&
          +tgsSnowSensorRef.current.value !== +tgsSnowSensorTemp
        ) {
          dispatch(
            handleSnowSensorTemp({
              keyName: 'tgsSnowSensorTemp',
              value: tgsSnowSensorRef.current.value,
            });
        }
        if (
          tesSnowSensorRef.current.value &&
          +tesSnowSensorRef.current.value !== +tesSnowSensorTemp
        ) {
          dispatch(
            handleSnowSensorTemp({
              keyName: 'tesSnowSensorTemp',
              value: tesSnowSensorRef.current.value,
            });
        }

        if (tgsSnowSensorRef.current.value && tesSnowSensorRef.current.value) {
          const blowerDeviceIds = [
            ...new Set([
              ...getDeviceIdsByLocationData(flatTgsSwitch),
              ...getDeviceIdsByLocationData(flatTesSwitch),
            ]),
          ];
          blowerDeviceIds.length > 0 &&
            updateBlowerSettingService(
              blowerDeviceIds,
              {
                blower_snow_threshold: +tgsSnowSensorRef.current.value,
                electrical_snow_threshold: +tesSnowSensorRef.current.value,
              },
              true
            );
        } else if (tgsSnowSensorRef.current.value) {
          const blowerDeviceIds = getDeviceIdsByLocationData(flatTgsSwitch);
          blowerDeviceIds.length > 0 &&
            updateBlowerSettingService(
              blowerDeviceIds,
              {
                blower_snow_threshold: +tgsSnowSensorRef.current.value,
              },
              true
            );
        } else if (tesSnowSensorRef.current.value) {
          const blowerDeviceIds = getDeviceIdsByLocationData(flatTesSwitch);
          blowerDeviceIds.length > 0 &&
            updateBlowerSettingService(
              blowerDeviceIds,
              {
                electrical_snow_threshold: +tesSnowSensorRef.current.value,
              },
              true
            );
        }
        break;
      default:
        break;
    }
  };

  // userProfile upload image function
  const handleUploadImage = async (e, files) => {
    // e.preventDefault();
    setOpenUploadBox(false);
    let uploadedFile = files?.length > 0 && files[0];
    if (uploadedFile && isImageFile(uploadedFile)) {
      const signed = await uploadS3File(files[0], 'image/png');
      setProfileInputsData((avatar, restPrevState) => {
        return {
          avatar: signed,
          ...restPrevState,
        };
      });
    }
    //******** do send pose request to BE ********

    // ******** only upload files and fileNames of index 0 since we can only save image of the user at a time

    // const formData = createFormData();
    // try {
    //   axios.post('api.... ', formData, {
    //     'content-type': 'multipart/form-data',
    //   });
    // } catch (error) {
    //   console.error('Failed to submit files.');
    // }
    //******** do send pose request to BE ********
  };

  return (
    <>
      {isMobile ? (
        <MainSectionBaseLayer isMobile={true}>
          <MainSectionWrapper isMobile={true}>
            <WrapperTitle isMobile={true}>
              <TitleContainer title='settings' />
            </WrapperTitle>
            <AllSettingsSelectOptions />
            {isUserProfileSelected ? (
              <FlexColumn>
                <UserProfileMain
                  setProfileInputsData={setProfileInputsData}
                  profileInputsData={profileInputsData}
                  openUploadBox={openUploadBox}
                  setOpenUploadBox={setOpenUploadBox}
                  handleUploadImage={handleUploadImage}
                  firstNameElement={firstNameElement}
                  familyNameElement={familyNameElement}
                  titleElement={titleElement}
                  workPhoneElement={workPhoneElement}
                  cellPhoneElement={cellPhoneElement}
                  faxElement={faxElement}
                  emailElement={emailElement}
                  companyElement={companyElement}
                  addressElement={addressElement}
                  selectHonorific={selectHonorific}
                  setSelectHonorific={setSelectHonorific}
                  messageBoxContent={messageBoxContent}
                  openMessageBox={openMessageBox}
                  handleCloseMessageBox={handleCloseMessageBox}
                  // handleEditCancelApplyButtons={handleEditCancelApplyButtons}
                />
                <ButtonsWrapper isMobile={true}>
                  <EditCancelApplyButtons
                    handleClick={handleEditCancelApplyButtons}
                  />
                </ButtonsWrapper>
              </FlexColumn>
            ) : isUnitsSelected ? (
              <WrapperSetting>
                <UnitsMain
                  handleClick={handleEditCancelApplyButtons}
                  messageBoxContent={messageBoxContent}
                  openMessageBox={openMessageBox}
                  handleCloseMessageBox={handleCloseMessageBox}
                  metricImperialToggle={metricImperialToggle}
                  setMetricImperialToggle={setMetricImperialToggle}
                />
              </WrapperSetting>
            ) : isWindFactorSelected ? (
              <FlexColumn isSpaceBetween={true}>
                <WindFactorMain
                  lowWindTempRef={lowWindTempRef}
                  medWindTempRef={medWindTempRef}
                  highWindTempRef={highWindTempRef}
                  extremeWindTempRef={extremeWindTempRef}
                  messageBoxContent={messageBoxContent}
                  handleCloseMessageBox={handleCloseMessageBox}
                  openMessageBox={openMessageBox}
                  handleConfirmButton={handleConfirmButton}
                />
                <ButtonsWrapper isMobile={true}>
                  <EditCancelApplyButtons
                    handleClick={handleEditCancelApplyButtons}
                  />
                </ButtonsWrapper>
              </FlexColumn>
            ) : isSnowSensorSelected ? (
              <FlexColumn isSmallSpaceBetween={true}>
                <SnowSensorMain
                  essSnowSensorRef={essSnowSensorRef}
                  tgsSnowSensorRef={tgsSnowSensorRef}
                  tesSnowSensorRef={tesSnowSensorRef}
                  messageBoxContent={messageBoxContent}
                  handleCloseMessageBox={handleCloseMessageBox}
                  openMessageBox={openMessageBox}
                  handleConfirmButton={handleConfirmButton}
                />
                <ButtonsWrapper isMobile={true}>
                  <EditCancelApplyButtons
                    handleClick={handleEditCancelApplyButtons}
                  />
                </ButtonsWrapper>
              </FlexColumn>
            ) : isForceAndCommandsSelected ? (
              <WrapperSetting>
                <ForceAndCommandMain
                  handleClick={handleEditCancelApplyButtons}
                  buttonsState={selectAtsButtonsState}
                  setButtonsState={setSelectAtsButtonsState}
                  selected={selected}
                  setSelected={setSelected}
                  activeSelect={activeSelect}
                  setActiveSelect={setActiveSelect}
                  tCNumber={tCNumber}
                  setTCNumber={setTCNumber}
                  isSave={isSave}
                  setIsSave={setIsSave}
                  messageBoxContent={messageBoxContent}
                  openMessageBox={openMessageBox}
                  handleCloseMessageBox={handleCloseMessageBox}
                  isAppliedAtsButtonState={isAppliedAtsButtonState}
                  setIsAppliedAtsButtonState={setIsAppliedAtsButtonState}
                  openHeaders={openHeaders}
                  setOpenHeaders={setOpenHeaders}
                />
              </WrapperSetting>
            ) : isAdminSelected ? (
              <WrapperSetting>
                <AdminMain
                  handleClick={handleEditCancelApplyButtons}
                  saveChanges={saveChanges}
                  setSaveChanges={setSaveChanges}
                  setSaveInputElement={setSaveInputElement}
                  setGasSelection={setGasSelection}
                  gasSelection={gasSelection}
                  enableSwitch={enableSwitch}
                  setEnableSwitch={setEnableSwitch}
                  selectSystemConfig={selectSystemConfig}
                  setSelectSystemConfig={setSelectSystemConfig}
                  messageBoxContent={messageBoxContent}
                  openMessageBox={openMessageBox}
                  handleCloseMessageBox={handleCloseMessageBox}
                  isCreateEditOrSave={isCreateEditOrSave}
                  setIsCreateOrEditOrSave={setIsCreateOrEditOrSave}
                  locationNameRef={locationNameRef}
                  civicAddress={civicAddress}
                  setCivicAddress={setCivicAddress}
                  specificLocation={specificLocation}
                  setSpecificLocation={setSpecificLocation}
                  switches={switches}
                  setSwitches={setSwitches}
                  selectedLocation={selectedLocation}
                  setSelectedLocation={setSelectedLocation}
                  numSwitches={numSwitches}
                  setNumSwitches={setNumSwitches}
                  numOfUOS={numOfUOS}
                  setNumOfUOS={setNumOfUOS}
                  numOfSSR={numOfSSR}
                  setNumOfSSR={setNumOfSSR}
                  UOSName={UOSName}
                  setUOSName={setUOSName}
                  UOSDelete={UOSName}
                  setUOSDelete={setUOSDelete}
                  openHeaders={openHeaders}
                  setOpenHeaders={setOpenHeaders}
                />
              </WrapperSetting>
            ) : (
              isInterfaceModeSelected && (
                <WrapperSetting>
                  <Interface />
                </WrapperSetting>
              )
            )}
          </MainSectionWrapper>
        </MainSectionBaseLayer>
      ) : (
        <Wrapper>
          <TitleContainer title='settings' />
          <MainSectionBaseLayer>
            <MainSectionWrapper>
              <WrapperTitle>
                <TitleOfSettingsOptions />
              </WrapperTitle>
              <WrapperSettingsModeAndSelect>
                <SettingsOptionsAndInterfaceMode />
                {isUserProfileSelected ? (
                  <FlexColumn>
                    <UserProfileMain
                      setProfileInputsData={setProfileInputsData}
                      profileInputsData={profileInputsData}
                      openUploadBox={openUploadBox}
                      setOpenUploadBox={setOpenUploadBox}
                      handleUploadImage={handleUploadImage}
                      firstNameElement={firstNameElement}
                      familyNameElement={familyNameElement}
                      titleElement={titleElement}
                      workPhoneElement={workPhoneElement}
                      cellPhoneElement={cellPhoneElement}
                      faxElement={faxElement}
                      emailElement={emailElement}
                      companyElement={companyElement}
                      addressElement={addressElement}
                      selectHonorific={selectHonorific}
                      setSelectHonorific={setSelectHonorific}
                      messageBoxContent={messageBoxContent}
                      openMessageBox={openMessageBox}
                      handleCloseMessageBox={handleCloseMessageBox}
                    />
                    <ButtonsWrapper isUserProfile={true}>
                      <EditCancelApplyButtons
                        handleClick={handleEditCancelApplyButtons}
                      />
                    </ButtonsWrapper>
                  </FlexColumn>
                ) : isUnitsSelected ? (
                  <WrapperSetting>
                    <UnitsMain
                      handleClick={handleEditCancelApplyButtons}
                      messageBoxContent={messageBoxContent}
                      openMessageBox={openMessageBox}
                      handleCloseMessageBox={handleCloseMessageBox}
                      metricImperialToggle={metricImperialToggle}
                      setMetricImperialToggle={setMetricImperialToggle}
                    />
                  </WrapperSetting>
                ) : isWindFactorSelected ? (
                  <FlexColumn isSpaceBetween={true}>
                    <WindFactorMain
                      lowWindTempRef={lowWindTempRef}
                      medWindTempRef={medWindTempRef}
                      highWindTempRef={highWindTempRef}
                      extremeWindTempRef={extremeWindTempRef}
                      messageBoxContent={messageBoxContent}
                      handleCloseMessageBox={handleCloseMessageBox}
                      openMessageBox={openMessageBox}
                      handleConfirmButton={handleConfirmButton}
                    />
                    <ButtonsWrapper>
                      <EditCancelApplyButtons
                        handleClick={handleEditCancelApplyButtons}
                      />
                    </ButtonsWrapper>
                  </FlexColumn>
                ) : isSnowSensorSelected ? (
                  <FlexColumn isSpaceBetween={true}>
                    <SnowSensorMain
                      essSnowSensorRef={essSnowSensorRef}
                      tgsSnowSensorRef={tgsSnowSensorRef}
                      tesSnowSensorRef={tesSnowSensorRef}
                      messageBoxContent={messageBoxContent}
                      handleCloseMessageBox={handleCloseMessageBox}
                      openMessageBox={openMessageBox}
                      handleConfirmButton={handleConfirmButton}
                    />
                    <ButtonsWrapper>
                      <EditCancelApplyButtons
                        handleClick={handleEditCancelApplyButtons}
                      />
                    </ButtonsWrapper>
                  </FlexColumn>
                ) : isForceAndCommandsSelected ? (
                  <WrapperSetting>
                    <ForceAndCommandMain
                      handleClick={handleEditCancelApplyButtons}
                      buttonsState={selectAtsButtonsState}
                      setButtonsState={setSelectAtsButtonsState}
                      selected={selected}
                      setSelected={setSelected}
                      activeSelect={activeSelect}
                      setActiveSelect={setActiveSelect}
                      tCNumber={tCNumber}
                      setTCNumber={setTCNumber}
                      isSave={isSave}
                      setIsSave={setIsSave}
                      messageBoxContent={messageBoxContent}
                      openMessageBox={openMessageBox}
                      handleCloseMessageBox={handleCloseMessageBox}
                      isAppliedAtsButtonState={isAppliedAtsButtonState}
                      setIsAppliedAtsButtonState={setIsAppliedAtsButtonState}
                      openHeaders={openHeaders}
                      setOpenHeaders={setOpenHeaders}
                    />
                  </WrapperSetting>
                ) : (
                  isAdminSelected && (
                    <WrapperSetting>
                      <AdminMain
                        handleClick={handleEditCancelApplyButtons}
                        saveChanges={saveChanges}
                        setSaveChanges={setSaveChanges}
                        setSaveInputElement={setSaveInputElement}
                        setGasSelection={setGasSelection}
                        gasSelection={gasSelection}
                        enableSwitch={enableSwitch}
                        setEnableSwitch={setEnableSwitch}
                        selectSystemConfig={selectSystemConfig}
                        setSelectSystemConfig={setSelectSystemConfig}
                        messageBoxContent={messageBoxContent}
                        openMessageBox={openMessageBox}
                        handleCloseMessageBox={handleCloseMessageBox}
                        isCreateEditOrSave={isCreateEditOrSave}
                        setIsCreateOrEditOrSave={setIsCreateOrEditOrSave}
                        locationNameRef={locationNameRef}
                        civicAddress={civicAddress}
                        setCivicAddress={setCivicAddress}
                        specificLocation={specificLocation}
                        setSpecificLocation={setSpecificLocation}
                        switches={switches}
                        setSwitches={setSwitches}
                        selectedLocation={selectedLocation}
                        setSelectedLocation={setSelectedLocation}
                        numSwitches={numSwitches}
                        setNumSwitches={setNumSwitches}
                        numOfUOS={numOfUOS}
                        setNumOfUOS={setNumOfUOS}
                        numOfSSR={numOfSSR}
                        setNumOfSSR={setNumOfSSR}
                        UOSName={UOSName}
                        setUOSName={setUOSName}
                        UOSDelete={UOSName}
                        setUOSDelete={setUOSDelete}
                        isGroupedSwitchesSaved={isGroupedSwitchesSaved}
                        setIsGroupedSwitchesSaved={setIsGroupedSwitchesSaved}
                        isConfirmed={isConfirmed}
                        setIsConfirmed={setIsConfirmed}
                        // specificLocationRef={specificLocationRef}
                        openHeaders={openHeaders}
                        setOpenHeaders={setOpenHeaders}
                      />
                    </WrapperSetting>
                  )
                )}
              </WrapperSettingsModeAndSelect>
            </MainSectionWrapper>
          </MainSectionBaseLayer>
        </Wrapper>
      )}
    </>
  );
};

export default SettingsMain;

const Wrapper = styled.div`
  min-height: 674px;
  width: 1216px;
`;

const MainSectionBaseLayer = styled.div`
  ${({ isMobile }) =>
    isMobile
      ? css`
          width: 332px;
          height: auto;
          border-radius: 30px 30px 12px 12px;
        `
      : css`
          width: 1216px;
          height: auto;
          margin-top: 10rem;
          border-radius: 14px;
        `}

  padding: 2rem;
  ${layerADark}

  ${flexBoxCenter}
`;

const MainSectionWrapper = styled.div`
  ${({ isMobile }) =>
    isMobile
      ? css`
          width: 326px;
          height: auto;
          border-radius: 28px 28px 10px 10px;
        `
      : css`
          width: 1212px;
          height: auto;
          border-radius: 12px;
        `}

  ${layerA90Deg}

  ${flexBoxCenter};
  flex-direction: column;
`;

const WrapperTitle = styled.div`
  ${({ isMobile }) =>
    isMobile
      ? css`
          margin-top: 5px;
          margin-bottom: 4px;
        `
      : css`
          width: 1202px;
          height: 70px;
          margin-top: 4rem;
          margin-left: 2rem;
          ${layerA}

          border-radius: 7px;
        `}
`;

const WrapperSettingsModeAndSelect = styled.div`
  width: 1202rem;
  height: auto;
  margin-top: 8rem;
  ${alignItemsFlexStart}
  gap:15rem;
`;

const FlexColumn = styled.div`
  display: flex;
  ${({ isSpaceBetween, isSmallSpaceBetween }) =>
    isSpaceBetween
      ? css`
          height: 498rem;
          ${justifyContentSpaceBetween}
        `
      : isSmallSpaceBetween &&
        css`
          height: 386rem;
          ${justifyContentSpaceBetween}
        `}
  flex-direction: column;
`;

const ButtonsWrapper = styled.div`
  ${({ isMobile }) =>
    isMobile
      ? css`
          width: 100%;
          ${flexBoxCenter}
        `
      : css`
          width: 100%;
          ${({ isUserProfile }) =>
            isUserProfile &&
            css`
              margin-bottom: 2px;
            `}
          ${justifyContentFlexEnd}
        `}
`;

const WrapperSetting = styled.div``;
