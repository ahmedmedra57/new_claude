import { useMediaQuery } from 'react-responsive';
import { useEffect, useState } from 'react';
import { useESSSwitchStore, useMasterControlSelectStore } from '../../../zustand-stores';
import styled, { css } from 'styled-components';
import {
import { useMasterControlSelectStore } from '../../zustand-stores';
  handleSelectIndividualMachine,
  handleUnSelectIndividualMachine,
} from '../../../store/slices/essSwitchSlice';

import {
  handleAddLocations,
  handleAddMachines,
  handleLocationSelect,
  handleMachineSelect,
  handleMachineSelectAlt,
  handleSelectAll,
  handleSelectedOne,
  selectMasterControls,
} from '../../../store/slices/masterControlSelectSlice';

import { handleResetAll } from '../../../store/slices/selectedMachinesSlice';
import {
  tesHandleSelectIndividualMachine,
  tesHandleUnSelectIndividualMachine,
} from '../../../store/slices/tesSwitchSlice';
import {
  tgsHandleSelectIndividualMachine,
  tgsHandleUnSelectIndividualMachine,
} from '../../../store/slices/tgsSwitchSlice';

import {
  flexBoxCenter,
  flexDirectionColumn,
  justifyContentSpaceBetween,
  layerA,
  layerA180Deg,
  layerBDark,
  layerCLighter,
} from '../../../styles/commonStyles';

import SelectOptions from './SelectOptions';
import { useSelectSwitchDropBoxDispatches } from '../../../../hooks/useSelectSwitchesDispatches';
import SelectionsButton from './SelectionsButton';
import { useSelectSwitchesDisplay } from '../../../../hooks/useSelectSwitchesDisplay';
import { useSelectBoxArrowsState } from '../../../../hooks/useSelectBoxArrowsState';
import { getAllSpecificLocationNames } from '../../../../helpers/helpers';

const SelectMachineOptions = ({ handleClose, data, swt, isMasterControl }) => {
  const isMobile = useMediaQuery({ query: '(max-width:600px)' });
  // const data = useESSSwitchStore();

  // !! work on this tomorrow
  const hpStations = {
    'blue-hill': {
      address: { lat: 45.5018869, lng: -73.56739189999999 },
      allDevices: [],
      blowers: 'true',
      company_name: 'hayek',
      currently: {},
      daily: [],
      devices: {},
      ebp_message: true,
      latitude: 45.5018869,
      locationAddress: 'Montreal, QC',
      locationId: '0a87e18a-afa3-45d6-af39-d500daf2149e',
      locationName: 'blue hill',
      location_name: 'cario',
      location_name_short: 'haca',
      longitude: -73.56739189999999,
      parent_location_id: '8248a34c-45e9-44ae-b9bd-1b77af9ea779',
      site_maps_ESS: '',
      site_maps_TES: '',
      site_maps_TGS: '',
      specific_address: 'hayek-spec3',
      ssr_quantity: 8,
      switches: 'true',
      switches_number: 2,
      uos_panel_number: 2,
      weather: (5)[
        ({ icon: '01d', tempMin: '5', tempMax: '6', day: 'Tuesday' },
        { icon: '01d', tempMin: '4', tempMax: '4', day: 'Wednesday' },
        { icon: '04d', tempMin: '5', tempMax: '5', day: 'Thursday' },
        { icon: '01d', tempMin: '7', tempMax: '7', day: 'Friday' },
        { icon: '04d', tempMin: '7', tempMax: '7', day: 'Saturday' })
      ],
      zoneId: '0a87e18a-afa3-45d6-af39-d500daf2149e',
      zone_address: 'Montreal, QC',
      zone_devices: [],
      zone_id: '0a87e18a-afa3-45d6-af39-d500daf2149e',
      zone_img_url: 'https://map-images.s3.amazonaws.com/default-map.png',
      zone_name: 'hayek-cario-haca',
      zone_status: 1,
    },
    sharon: { locationName: 'sharon' },
  };

  const locations = Object.keys(data);

  const buttons = ['clear', 'select'];
  const masterControlSelects = useMasterControlSelectStore();

  const {
    // for styling
    isAllSelected,
    isLocationSelected,
    isSpecificLocationSelected,
    isMachineSelected,
    // for dispatch
    selectedMachines,
    selectedLocations,
    selectedSpecificLocations,
  } =
    swt === 'ess'
      ? masterControlSelects.ess
      : swt === 'tes'
      ? masterControlSelects.tes
      : masterControlSelects.tgs;

  const allSelectBoxData = {
    isAllSelected,
    isLocationSelected,
    isSpecificLocationSelected,
    isMachineSelected,
    selectedMachines,
    selectedLocations,
    selectedSpecificLocations,
  };

  const { trackArrowState, trackSpecLocationArrowState, specificLocations } =
    useSelectBoxArrowsState(data);

  const [isArrowDown, setIsArrowDown] = useState(trackArrowState);
  const [isSpecLocationArrowDown, setIsSpecLocationArrowDown] = useState(
    trackSpecLocationArrowState
  );

  const [isSelected, setIsSelected] = useState(false);

  const [specificLocationsNameList, setSpecificLocationsNameList] = useState(
    []
  );

  
  useEffect(() => {
    // const allSpecificLocationsName = [];
    // data &&
    //   Object.values(data).forEach((value) => {
    //     if (
    //       !Object.values(value)[0]?.machineType &&
    //       Object.keys(value).length > 0
    //     ) {
    //       allSpecificLocationsName.push(Object.keys(value)[0]);
    //     }
    //   });

    const result = getAllSpecificLocationNames(data);
    setSpecificLocationsNameList(result);
  }, [data]);

  // Select handler for the indicator
  const useIndicatorsHandler = (option, machine, extraOption, machineIndex) => {
    // console.log('useIndicatorsHandler', {
    //   option,
    //   machine,
    //   extraOption,
    //   machineIndex,
    // });
    setIsSelected(true);
    useSelectSwitchesDisplay(
      option,
      machine,
      extraOption,
      machineIndex,
      specificLocations,
      swt,
      data,
      allSelectBoxData,
      dispatch
    );
  };

  // Apply and Clear Buttons Handler. They handles the dispatches.
  const useButtonsHandler = (button) => {
    useSelectSwitchDropBoxDispatches(
      button,
      allSelectBoxData,
      swt,
      isSelected,
      handleClose,
      data,
      dispatch
    );
  };

  return (
    <>
      {isMobile ? (
        <Wrapper isMobile={true}>
          <ScrollWrapper isMobile={true} isMasterControl={isMasterControl}>
            <SectionOptions isMobile={true}>
              <SelectOptions
                option='all'
                // handleSelect={handleSelect}
                handleSelect={useIndicatorsHandler}
                isSelected={isAllSelected}
                isMobile={true}
                isMasterControl={isMasterControl}
              />
              {locations.map((location, index) => (
                <SelectOptions
                  key={index}
                  isMobile={true}
                  isHp={swt === 'hp'}
                  isMasterControl={isMasterControl}
                  option={location}
                  data={data[location]}
                  // handleSelect={handleSelect}
                  handleSelect={useIndicatorsHandler}
                  isSelected={isLocationSelected[index]}
                  isMachineSelected={
                    isMachineSelected[index] && isMachineSelected[index]
                  }
                  isArrowDown={isArrowDown}
                  setIsArrowDown={setIsArrowDown}
                  allSpecificLocationsName={specificLocationsNameList}
                  isSpecificLocationSelected={isSpecificLocationSelected}
                  isSpecLocationArrowDown={isSpecLocationArrowDown}
                  setIsSpecLocationArrowDown={setIsSpecLocationArrowDown}
                />
              ))}
            </SectionOptions>
          </ScrollWrapper>
          <SectionButtons isMasterControl={isMasterControl}>
            {/* {buttons.map((button, index) => (
              <ButtonWrapper
                key={index}
                // onClick={() => handleOnClick(button)}

                isMasterControl={isMasterControl}
              >
                <ButtonHole isMasterControl={isMasterControl}>
                  <ButtonInner isMasterControl={isMasterControl}>
                    <ButtonTop isMasterControl={isMasterControl}>
                      {button}
                    </ButtonTop>
                  </ButtonInner>
                </ButtonHole>
               
              </ButtonWrapper>
            ))} */}
            {buttons.map((button, index) => (
              <ButtonWrapper isMasterControl={isMasterControl} key={index}>
                <SelectionsButton
                  title={button}
                  onClickButton={useButtonsHandler}
                  index={index}
                  isMasterControl={isMasterControl}
                />
              </ButtonWrapper>
            ))}
          </SectionButtons>
        </Wrapper>
      ) : (
        <Wrapper>
          <ScrollWrapper>
            <SectionOptions>
              <SelectOptions
                option='all'
                // handleSelect={handleSelect}
                handleSelect={useIndicatorsHandler}
                isSelected={isAllSelected}
              />
              {locations.map((location, index) => (
                <SelectOptions
                  key={index}
                  index={index}
                  option={location}
                  data={data[location]}
                  isHp={swt === 'hp'}
                  hpData={hpStations}
                  // handleSelect={handleSelect}
                  handleSelect={useIndicatorsHandler}
                  isSelected={isLocationSelected[index]}
                  isMachineSelected={
                    isMachineSelected[index] && isMachineSelected[index]
                  }
                  isArrowDown={isArrowDown}
                  setIsArrowDown={setIsArrowDown}
                  allSpecificLocationsName={specificLocationsNameList}
                  isSpecificLocationSelected={isSpecificLocationSelected}
                  isSpecLocationArrowDown={isSpecLocationArrowDown}
                  setIsSpecLocationArrowDown={setIsSpecLocationArrowDown}
                />
              ))}
            </SectionOptions>
          </ScrollWrapper>
          <SectionButtons>
            {/* {buttons.map((button, index) => (
              <ButtonWrapper
                key={index}
                // onClick={() => handleOnClick(button)}
              
              >
                <ButtonHole>
                  <ButtonInner>
                    <ButtonTop>{button}</ButtonTop>
                  </ButtonInner>
                </ButtonHole>
              </ButtonWrapper>
            ))} */}
            {buttons.map((button, index) => (
              <ButtonWrapper key={index}>
                <SelectionsButton
                  title={button}
                  onClickButton={useButtonsHandler}
                  index={index}
                />
              </ButtonWrapper>
            ))}
          </SectionButtons>
        </Wrapper>
      )}
    </>
  );
};

export default SelectMachineOptions;

const Wrapper = styled.div`
  height: 100%;
  width: 100%;
  margin-top: 5rem;

  ${flexDirectionColumn};
  ${(p) =>
    p.isMobile &&
    css`
      height: auto;
    `}
`;

const ScrollWrapper = styled.div`
  max-height: 184px;
  width: 100%;
  border-radius: 14px 8px 8px 14px;
  ${layerBDark};
  ${flexDirectionColumn}
  padding: 4rem;
  margin-bottom: 4rem;

  ${(p) =>
    p.isMobile &&
    css`
      width: 230px;
      ${layerA}
    `}

  ${(p) =>
    p.isMasterControl &&
    css`
      border-radius: 18px;
    `}
`;
const SectionOptions = styled.div`
  /* custom scrollbar */

  max-height: 176px;
  width: 100%;
  scroll-behavior: smooth;
  overflow-y: scroll;
  ::-webkit-scrollbar {
    width: 10px;
    border: 1px solid #ffffff;
    border-radius: 13px;
  }
  ::-webkit-scrollbar-track {
  }

  ::-webkit-scrollbar-thumb {
    background-color: #ffffff;
    border-radius: 13px;
    border: 1.5px solid transparent;
    background-clip: padding-box;
    height: 40%;
  }

  ::-webkit-scrollbar-button:start:decrement {
    background-repeat: no-repeat;
    background-size: 70%;
    background-position: center;
    height: 10px;

    background-image: url('/images/scrollbar-button-start.svg');
  }
  ::-webkit-scrollbar-button:end:increment {
    background-repeat: no-repeat;
    background-size: 70%;
    background-position: center;
    height: 10px;

    background-image: url('/images/scrollbar-button-end.svg');
  }

  ${(p) =>
    p.isMobile &&
    css`
      ::-webkit-scrollbar {
        display: none;
      }
      height: auto;
      max-height: 223px;
      width: 230px;
      border-radius: 18px;

      ${flexDirectionColumn};
      padding: 2px 0;
      margin-bottom: 4px;
    `}
`;

const SectionButtons = styled.div`
  width: 100%;
  ${justifyContentSpaceBetween}

  ${(p) =>
    p.isMasterControl &&
    css`
      width: 230px;
    `};
`;

const ButtonWrapper = styled.button`
  width: 84px;
  height: 27px;
  border-radius: 18px;
  ${layerBDark}
  ${flexBoxCenter}

  ${(p) =>
    p.isMasterControl &&
    css`
      width: 110px;
      height: 37px;
    `};
`;
// const ButtonHole = styled.div`
//   width: 82px;
//   height: 25px;
//   border-radius: 25px;

//   ${layerA180Deg}
//   ${flexBoxCenter}

//   ${(p) =>
//     p.isMasterControl &&
//     css`
//       width: 108px;
//       height: 35px;
//     `};
// `;
// const ButtonInner = styled.div`
//   width: 74px;
//   height: 17px;
//   border-radius: 18px;
//   ${layerCLighter}
//   ${flexBoxCenter}

//   ${(p) =>
//     p.isMasterControl &&
//     css`
//       width: 100px;
//       height: 27px;
//     `};
// `;

// const ButtonTop = styled.div`
//   width: 72px;
//   height: 15px;
//   border-radius: 25px;
//   font-size: 10px;

//   ${layerA180Deg};
//   ${flexBoxCenter};

//   ${(p) =>
//     p.isMasterControl &&
//     css`
//       width: 98px;
//       height: 25px;
//       font-size: 12px;
//     `};
// `;

// Clear and Apply Button handler
// const handleOnClick = (button) => {
//   if (button === buttons[1]) {
//     // logic for count selected machine numbers
//     let selectedSwtNumber = 0;
//     isMachineSelected.forEach((location) =>
//       location.forEach((machine) => {
//         if (machine) {
//           selectedSwtNumber += 1;
//         }
//       })
//     );

//     if (isAllSelected) {
//       // 1. selected All
//       // dispatch
//       useMasterControlSelectStore().setSelectedOne({ switch: swt, selectedOne: 'all' });
//       locations.map((location) => handleSelectLocation(location, true);
//     } else if (isLocationSelected.indexOf(true) !== -1) {
//       // 2. selected locations
//       selectedLocations.map((location) =>
//         handleSelectLocation(location, true)
//       );

//       if (selectedMachines.length > 0) {
//         // 3. selected individual machines
//         if (swt === 'ess') {
//           selectedMachines.forEach((machine) =>
//             dispatch(
//               handleSelectIndividualMachine({
//                 location: machine[0],
//                 machine: machine[1],
//               })
//             )
//           );
//         } else if (swt === 'tes') {
//           selectedMachines.forEach((machine) =>
//             dispatch(
//               tesHandleSelectIndividualMachine({
//                 location: machine[0],
//                 machine: machine[1],
//               })
//             )
//           );
//         } else {
//           // tgs option
//           selectedMachines.forEach((machine) =>
//             dispatch(
//               tgsHandleSelectIndividualMachine({
//                 location: machine[0],
//                 machine: machine[1],
//               })
//             )
//           );
//         }
//       }

//       dispatch(
//         handleSelectedOne({
//           switch: swt,
//           selectedOne: `${selectedSwtNumber} switches`,
//         })
//       );
//     } else if (selectedMachines.length > 0) {
//       // 3. selected individual machines
//       if (swt === 'ess') {
//         selectedMachines.forEach((machine) =>
//           dispatch(
//             handleSelectIndividualMachine({
//               location: machine[0],
//               machine: machine[1],
//             })
//           )
//         );
//       } else if (swt === 'tes') {
//         selectedMachines.forEach((machine) =>
//           dispatch(
//             tesHandleSelectIndividualMachine({
//               location: machine[0],
//               machine: machine[1],
//             })
//           )
//         );
//       } else {
//         // tgs option
//         selectedMachines.forEach((machine) =>
//           dispatch(
//             tgsHandleSelectIndividualMachine({
//               location: machine[0],
//               machine: machine[1],
//             })
//           )
//         );
//       }

//       dispatch(
//         handleSelectedOne({
//           switch: swt,
//           selectedOne: `${selectedSwtNumber} switches`,
//         })
//       );
//     } else if (!isSelected) {
//       useMasterControlSelectStore().setSelectedOne({ switch: swt, selectedOne: null });
//     }
//     handleClose();
//   } else {
//     // reset all selections
//     // 1.reset all local states
//     useMasterControlSelectStore().selectAll({ switch: swt, status: false });
//     useMasterControlSelectStore().setSelectedOne({ switch: swt, selectedOne: null });

//     // reset state for dispatch
//     useMasterControlSelectStore().addLocations({ switch: swt, arr: [] });
//     useMasterControlSelectStore().addMachines({ switch: swt, arr: [] });

//     // 2. reset location
//     const arr = locations.map((location) => false);
//     useMasterControlSelectStore().selectLocation({ switch: swt, arr });

//     // reset selected machines
//     const individualArr = Object.values(data).map((location) =>
//       Object.keys(location).map((machine) => false)
//     );
//     useMasterControlSelectStore().selectMachine({ switch: swt, arr: individualArr });

//     // dispatch
//     locations.map((location) => handleSelectLocation(location);

//     // reset all changes
//     useMasterControlSelectStore().resetAll();
//   }
// };

// const handleSelectLocation = (option, select) => {
//   const machines = Object.keys(data[option]);
//   if (swt === 'ess') {
//     if (select) {
//       machines.map((machine) =>
//         useESSSwitchStore().selectIndividualMachine({ location: option, machine })
//       );
//     } else {
//       machines.map((machine) =>
//         dispatch(
//           handleUnSelectIndividualMachine({ location: option, machine })
//         )
//       );
//     }
//   } else if (swt === 'tes') {
//     if (select) {
//       machines.map((machine) =>
//         dispatch(
//           tesHandleSelectIndividualMachine({ location: option, machine })
//         )
//       );
//     } else {
//       machines.map((machine) =>
//         dispatch(
//           tesHandleUnSelectIndividualMachine({ location: option, machine })
//         )
//       );
//     }
//   } else {
//     // do about tgs
//     if (select) {
//       machines.map((machine) =>
//         dispatch(
//           tgsHandleSelectIndividualMachine({ location: option, machine })
//         )
//       );
//     } else {
//       machines.map((machine) =>
//         dispatch(
//           tgsHandleUnSelectIndividualMachine({ location: option, machine })
//         )
//       );
//     }
//   }
// };

// Select handler for the indicator
// const handleSelect = (option, machine) => {
//   setIsSelected(true);

//   if (option === 'all') {
//     // 1. select all
//     useMasterControlSelectStore().selectAll({ switch: swt, status: true });

//     // update all locations
//     const locationArr = isLocationSelected.map((location) => true);

//     useMasterControlSelectStore().selectLocation({ switch: swt, arr: locationArr });

//     // update all machines global and local
//     const individualArr = Object.values(data).map((location) =>
//       Object.keys(location).map((machine) => true)
//     );
//     useMasterControlSelectStore().selectMachine({ switch: swt, arr: individualArr });
//   } else if (option !== 'all' && machine === undefined) {
//     // 2. select location
//     // 2-1 find index and make it true
//     // update the location
//     const index = locations.indexOf(option);
//     const arr = [...isLocationSelected];
//     arr[index] = true;
//     useMasterControlSelectStore().selectLocation({ switch: swt, arr });

//     // update machines in the location

//     const machineNewArr = isMachineSelected[index].map((machine) => true);
//     const copyArr = [...isMachineSelected];
//     copyArr[index] = machineNewArr;
//     useMasterControlSelectStore().selectMachine({ switch: swt, arr: copyArr });

//     // for dispatch selected locations
//     const newSelect = [...selectedLocations];
//     newSelect.push(option);
//     useMasterControlSelectStore().addLocations({ switch: swt, arr: newSelect });
//   } else {
//     // 3. select individually
//     const locationIdx = Object.keys(data).indexOf(option);
//     const machineIdx = Object.keys(data[option]).indexOf(machine);

//     dispatch(
//       handleMachineSelectAlt({ switch: swt, locationIdx, machineIdx })
//     );

//     // for dispatch selected machines
//     const newSelectedMachineArr = [...selectedMachines];
//     newSelectedMachineArr.push([option, machine]);
//     useMasterControlSelectStore().addMachines({ switch: swt, arr: newSelectedMachineArr });
//   }
// };
// const specificLocationsValues = Object.values(data)
//   .filter((location) => !Object.values(location)[0]?.machineType)
//   .filter((el) => Object.keys(el).length > 0);
// const specificLocations = specificLocationsValues.map(
//   (location) => Object.keys(location)[0]
// );

// const trackArrowState = locations.map((el) => false);
// const trackSpecLocationArrowState = specificLocations.map((el) => false);
