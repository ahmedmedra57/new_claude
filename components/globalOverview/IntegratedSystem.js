import { useCallback, useEffect, useState } from 'react';
import { useESSSwitchStore, useGlobalOverviewStore, useLocationsStore, useMCIsExpandedStore, useTESSwitchStore, useTGSSwitchStore, useUserStore } from '../zustand-stores';

import styled, { css } from 'styled-components';
import {
  flexBoxCenter,
  justifyContentSpaceBetween,
  layerA180Deg,
  layerADark,
  layerADisabled180Deg,
  layerB,
  layerBDark,
  layerBDisabled,
  layerC,
} from '../styles/commonStyles';

import DisplayMachineSuggestion from './DisplayMachineSuggestion';
import SwitchLocation from './SwitchLocation';
import IndividualMachine from './IndividualMachine';
import reduce from 'lodash/reduce';
import set from 'lodash/set';
import {
  filteredSuggestionsHandler,
  getFormattedMachineName,
  searchSpecificLocationHandler,
} from '../../helpers/helpers';
import testData from '../../test_data/testData';
import { useSetZoneOpeningsState } from '../../hooks';

const IntegratedSystem = ({ setCenter, setZoomNum ,mapCenter,zoomNum,selectedLocation,setSelectedLocation}) => {
  const MCIsExpanded = useMCIsExpandedStore();
  // const { ess, tgs, tes, hp, ate } = MCIsExpanded;

  const userInfo = useUserStore();
  const { isEssSwitch, isTesSwitch, isTgsSwitch, isHpSwitch, isAteSwitch } =
    userInfo;

  const { essSwitch, flatEssSwitch } = useESSSwitchStore();

  const { tgsSwitch, flatTgsSwitch } = useTGSSwitchStore();
  const { tesSwitch, flatTesSwitch } = useTESSwitchStore();
  const locations = useLocationsStore();
  // console.log(locations);
  const overViewState = useGlobalOverviewStore();
  const { selectedSystem } = overViewState;

  const [inputSearch, setInputSearch] = useState(['', '', '', '', '']);
  const [searchedMachines, setSearchedMachines] = useState(['', '', '']);
  const handleInputChange = (e, index) => {
    const updatedSearchedMachines = [...searchedMachines];
    updatedSearchedMachines[index] = e.target.value;
    setSearchedMachines(updatedSearchedMachines);
  };
  // console.log('locations:', locations);
  // console.log('essSwitch:', essSwitch);
  // console.log('tesSwitch:', tesSwitch);
  // console.log('tgsSwitch:', tgsSwitch);

  // !!TEST DATA
  // const selectExpand = useMCIsExpandedStore();
  // console.log('selectExpand slice', selectExpand);
  // const { testEssSwitch, testTgsSwitch, testTesSwitch, testAllLocations } =
  //   testData(essSwitch, tgsSwitch, locations, tesSwitch);
  // console.log('testAllLocations:', testAllLocations);
  // console.log('testTesSwitch:', testTesSwitch);
  // console.log('testTgsSwitch', testTgsSwitch);
  // console.log('testEssSwitch', testEssSwitch);
  // const initialDisplaySystemState = [
  //   [
  //     'ess - electric switch systems',
  //     '/images/ess-map-icon.svg',
  //     reduce(
  //       Object.keys(essSwitch),
  //       (acc, cur) => acc + Object.keys(essSwitch[cur]).length,
  //       0
  //     ),
  //     !isEssSwitch,
  //     Object.keys(essSwitch),
  //     'ess',
  //   ],
  //   [
  //     'tgs - typhoon gas systems',
  //     '/images/tgs-map-icon.svg',
  //     reduce(
  //       Object.keys(tgsSwitch),
  //       (acc, cur) => acc + Object.keys(tgsSwitch[cur]).length,
  //       0
  //     ),
  //     !isTgsSwitch,
  //     Object.keys(tgsSwitch),
  //     'tgs',
  //   ],
  //   [
  //     'tes - typhoon electric systems',
  //     '/images/tes-map-icon.svg',
  //     reduce(
  //       Object.keys(tesSwitch),
  //       (acc, cur) => acc + Object.keys(tesSwitch[cur]).length,
  //       0
  //     ),
  //     !isTesSwitch,
  //     Object.keys(tesSwitch),
  //     'tes',
  //   ],
  //   [
  //     'hp - heating platforms',
  //     '/images/disabled-map-icon.svg',
  //     null,
  //     !isHpSwitch,
  //     null,
  //     'hp',
  //   ],
  //   [
  //     'ate - additional track equipment',
  //     '/images/disabled-map-icon.svg',
  //     null,
  //     !isAteSwitch,
  //     null,
  //     'ate',
  //   ],
  // ];

  // // !! END OF TEST DATA

  // [0] title , [1] src, [2] number of switches, [3] ? , [4] location names, [5] ess || tgs || tes || hp || ate
  const initialDisplaySystemState = [
    [
      'ess - electric switch systems',
      '/images/ess-map-icon.svg',
      reduce(
        Object.keys(flatEssSwitch),
        (acc, cur) => acc + Object.keys(flatEssSwitch[cur]).length,
        0
      ),
      !isEssSwitch,
      Object.keys(essSwitch),
      'ess',
    ],
    [
      'tgs - typhoon gas systems',
      '/images/tgs-map-icon.svg',
      reduce(
        Object.keys(flatTgsSwitch),
        (acc, cur) => acc + Object.keys(flatTgsSwitch[cur]).length,
        0
      ),
      !isTgsSwitch,
      Object.keys(tgsSwitch),
      'tgs',
    ],
    [
      'tes - typhoon electric systems',
      '/images/tes-map-icon.svg',
      reduce(
        Object.keys(flatTesSwitch),
        (acc, cur) => acc + Object.keys(flatTesSwitch[cur]).length,
        0
      ),
      !isTesSwitch,
      Object.keys(tesSwitch),
      'tes',
    ],
    [
      'hp - heating platforms',
      '/images/disabled-map-icon.svg',
      null,
      !isHpSwitch,
      null,
      'hp',
    ],
    [
      'ate - additional track equipment',
      '/images/disabled-map-icon.svg',
      null,
      !isAteSwitch,
      null,
      'ate',
    ],
  ];

  const [systemSwitches, setSystemSwitches] = useState(
    initialDisplaySystemState
  );

  
  // Object.values(essSwitch).map((el) => {
  //   if (Object.keys(el).length === 0) {
  //     return true;
  //   } else if (Object.values(el).some((checkEl) => checkEl.machineType)) {
  //     return false;
  //   } else {
  //     return true;
  //   }
  // });

  // !!TEST
  // useSetZoneOpeningsState(testEssSwitch, isEssSwitch, null, 'ess', true);
  // useSetZoneOpeningsState(testTgsSwitch, isTgsSwitch, null, 'tgs', true);
  // useSetZoneOpeningsState(testTesSwitch, isTesSwitch, null, 'tes', true);
  // !!END

  useSetZoneOpeningsState(essSwitch, isEssSwitch, null, 'ess', true);
  useSetZoneOpeningsState(tgsSwitch, isTgsSwitch, null, 'tgs', true);
  useSetZoneOpeningsState(tesSwitch, isTesSwitch, null, 'tes', true);

  // const searchSpecificLocationHandler = (switchType) => {
  //   return Object.values(switchType).map((el) => {
  //     if (
  //       Object.keys(el).length === 0 ||
  //       Object.values(el).some((checkEl) => checkEl.machineType)
  //     ) {
  //       return true;
  //     } else {
  //       return false;
  //     }
  //   });
  // };

  // const setOpeningStatesHandler = (swtSystem, switchData) => {
  //   // update  isLocationOpen: [],
  //   const locationEss = Object.keys(switchData).map((_) => false);
  //   dispatch(
  //     setOpenLocationInitialStateHandler({ locations: locationEss, swtSystem })
  //   );

  //   //  update isSpecificLocationOpen: [],
  //   searchSpecificLocationHandler(switchData).forEach((checkEl, idx) => {
  //     if (!checkEl) {
  //       const numberOfSpecificLocations = Object.keys(
  //         Object.values(switchData)[idx]
  //       ).length;

  //       const booleanArray = new Array(numberOfSpecificLocations).fill(false);

  //       dispatch(
  //         setOpenSpecificLocationInitialStateHandler({
  //           specificLocations: booleanArray,
  //           swtSystem,
  //         })
  //       );
  //     }
  //   });
  // };

  // // reset initial all selections
  // useEffect(() => {
  //   return () => {
  //     if (isEssSwitch) {
  //       setOpeningStatesHandler('ess', essSwitch);
  //     } else {
  //       useMCStore().setOpenMasterControl({ swtName: 'ess', status: false });
  //     }
  //     if (isTgsSwitch) {
  //       setOpeningStatesHandler('tgs', tgsSwitch);
  //     } else {
  //       useMCStore().setOpenMasterControl({ swtName: 'tgs', status: false });
  //     }

  //     if (isTesSwitch) {
  //       setOpeningStatesHandler('tes', tesSwitch);
  //       // const locationTes = Object.keys(tesSwitch).map((location) => false);
  //       // useTESSwitchStore().resetMachinesState(locationTes);

  //       // searchSpecificLocationHandler(tesSwitch).forEach((checkEl, idx) => {
  //       //   if (!checkEl) {
  //       //     const numberOfSpecificLocations = Object.keys(
  //       //       Object.values(tesSwitch)[idx]
  //       //     ).length;

  //       //     const booleanArray = new Array(numberOfSpecificLocations).fill(
  //       //       false
  //       //     );

  //       //     useTESSwitchStore().resetSpecificLocationState(booleanArray);
  //       //   }
  //       // });
  //     } else {
  //       useMCStore().setOpenMasterControl({ swtName: 'tes', status: false });
  //     }
  //   };
  // }, []);

  useEffect(() => {
    switch (selectedSystem) {
      case 'all':
        setSystemSwitches(initialDisplaySystemState);
        break;
      case 'ess':
        setSystemSwitches([initialDisplaySystemState[0]]);
        break;
      case 'tgs':
        setSystemSwitches([initialDisplaySystemState[1]]);
        break;
      case 'tes':
        setSystemSwitches([initialDisplaySystemState[2]]);
        break;
      case 'ess, tgs':
        setSystemSwitches([
          initialDisplaySystemState[0],
          initialDisplaySystemState[1],
        ]);
        break;
      case 'ess, tes':
        setSystemSwitches([
          initialDisplaySystemState[0],
          initialDisplaySystemState[2],
        ]);
        break;
      case 'tgs, tes':
        setSystemSwitches([
          initialDisplaySystemState[1],
          initialDisplaySystemState[2],
        ]);
        break;
      default:
        setSystemSwitches(initialDisplaySystemState);
        break;
    }
  }, [selectedSystem]);

 
  // systemSwitches.map((swt,idx)=>{
  //   console.log("idx:" + idx,"swt:" + swt);
  // })

  // *******************auto complete logic ********************
  const [selectedSuggestionIdx, setSelectedSuggestionIdx] = useState(0);
  const [inputSwitchName, setInputSwitchName] = useState('');
  const [displaySuggestions, setDisplaySuggestions] = useState(false);
  const [activatedIndex, setActivatedIndex] = useState(null);
  const [machineSuggestions, setMachineSuggestions] = useState(null);
  const [displaySelectedMachine, setDisplaySelectedMachine] = useState([
    false,
    false,
    false,
    false,
    false,
  ]);

  // // Machine name list as an array
  // const essLocations = Object.keys(essSwitch).map((location) =>
  //   Object.keys(essSwitch[location]).map(
  //     (machine) => `${location} - ${machine}`
  //   )
  // );
  // const essMachines = essLocations.reduce((acc, cur) => acc.concat(cur), []);

  // const tgsLocations = Object.keys(tgsSwitch).map((location, idx) =>
  //   Object.keys(tgsSwitch[location]).map(
  //     (machine) => `${location} - ${machine}`
  //   )
  // );
  // const tgsMachines = tgsLocations.reduce((acc, cur) => acc.concat(cur), []);

  // const tesLocations = Object.keys(tesSwitch).map((location, idx) =>
  //   Object.keys(tesSwitch[location]).map(
  //     (machine) => `${location} - ${machine}`
  //   )
  // );
  // const tesMachines = tesLocations.reduce((acc, cur) => acc.concat(cur), []);

  const essMachines = getFormattedMachineName(flatEssSwitch);
  // !!TEST
  // const essMachines = getFormattedMachineName(testEssSwitch);
  // !!END

  const tgsMachines = getFormattedMachineName(flatTgsSwitch);
  // !!TEST
  // const tgsMachines = getFormattedMachineName(testTgsSwitch);
  // !!END

  const tesMachines = getFormattedMachineName(flatTesSwitch);
  // !!TEST
  // const tesMachines = getFormattedMachineName(testTesSwitch);
  // !!END

  const machineList = [...essMachines, ...tgsMachines, ...tesMachines];

  // Make suggested machine list!!
  const handleMakeSuggestions = (system) => {
    if (system === 'ess') {
      setMachineSuggestions(essMachines);
      setActivatedIndex(0);
    } else if (system === 'tgs') {
      setMachineSuggestions(tgsMachines);
      setActivatedIndex(1);
    } else {
      // tes
      setMachineSuggestions(tesMachines);
      setActivatedIndex(2);
    }
  };
//  console.log(activatedIndex);
//  console.log(machineSuggestions);
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
  //         return locations.all[el]?.locationName?.toUpperCase();
  //       } else {
  //         return locations.all[suggestion.split(' - ')[0]]?.devices[
  //           el
  //         ].machineName?.toUpperCase();
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



  const handleSelectSuggestion = useCallback(
    (index, suggestion) => {
      const arr = [...inputSearch];
      arr[index] = suggestion;
      setInputSearch(arr);

      const swtName = index === 0 ? 'ess' : index === 1 ? 'tgs' : 'tes';
      if (suggestion.length >= 2) {
        useMCStore().setOpenMasterControl({ swtName, status: false });
      }
      if (suggestion) {
        useMCStore().setOpenMasterControl({ swtName, status: false });
        // show selected machine
        const tempArr = [...displaySelectedMachine];
        tempArr[index] = true;
        setDisplaySelectedMachine(tempArr);
      }
      setInputSwitchName('');
      setSelectedSuggestionIdx(-1);
      setDisplaySuggestions(false);
    },
    [
      inputSearch,
      dispatch,
      displaySelectedMachine,
      inputSwitchName,
      displaySuggestions,
    ]
  );
// console.log(filteredSuggestions);
//   console.log(selectedSuggestionIdx);
  const handleKeyDown = (event, idx) => {
    switch (event.key) {
      case 'Escape': {
        setInputSearch('');
        break;
      }
      case 'Enter': {
        // isExpand need to be closed depends on idx
        let suggestation=  selectedSuggestionIdx >=0 ? filteredSuggestions[selectedSuggestionIdx]:inputSwitchName;
       if(suggestation){
           handleSelectSuggestion(idx, suggestation);
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

  const handleExpand = (id, swtName) => {
    // close searched individual machine
    const tempArr = [...inputSearch];
    tempArr[id] = '';
    setInputSearch(tempArr);

    // Toggle expand button
    dispatch(
      handleOpenMasterControl({
        swtName,
        status: !MCIsExpanded[swtName].masterControl,
      });
  };

  const handleCancel = (idx, swtName) => {
    setInputSwitchName('');
    setSearchedMachines(['', '', '']);
    const arr = [...inputSearch];
    arr[idx] = '';
    setInputSearch(arr);
    setSelectedSuggestionIdx(-1);
    setDisplaySuggestions(false);
    dispatch(
      handleOpenMasterControl({
        swtName,
        status: true,
      });
  };

  const setInputHandler = (e, swt, idx) => {
    e.target.value.length === 0 && handleCancel(idx, swt[5]);
    handleSelectSuggestion(idx, e.target.value);
    setInputSwitchName(e.target.value);
    setSelectedSuggestionIdx(-1);
  };

  // console.log('filteredSuggestions:', filteredSuggestions);

  return (
    <Wrapper>
      {systemSwitches.map((swt, idx) => {
        
        const splitName = inputSearch[idx].split(' - ');

        const isSpecificLocation = splitName.length === 3;
        return (
          <ContentsWrapper key={idx}>
            <SectionTitle disabled={swt[3]}>
              <TitleWrapper>
                <IconAndTitleWrapper>
                  <img src={swt[1]} />
                  <Title>{swt[0]}</Title>
                </IconAndTitleWrapper>
                <UnitNumber disabled={swt[3]}>
                  {swt[2] ? `${swt[2]} units` : '- - - - -'}
                </UnitNumber>
              </TitleWrapper>
            </SectionTitle>

            <SectionSwitch>
              <SectionInnerWrapper disabled={swt[3]}>
                <InputAndButtonWrapper disabled={swt[3]}>
                  <SearchInput
                    type='text'
                    placeholder='search'
                    disabled={swt[3]}
                    value={searchedMachines[idx]}
                    onChange={(e) => {
                    
                      setInputHandler(e, swt, idx);
                      handleInputChange(e, idx);
                        // console.log(e.target.value);
                    }}
                    // onChange={(e) => {
                    //   e.target.value.length === 0 && handleCancel(idx, swt[5]);
                    //   handleSelectSuggestion(idx, e.target.value);
                    //   setInputSwitchName(e.target.value);
                    //   setSelectedSuggestionIdx(-1);
                    // }}
                    onKeyDown={(e) => handleKeyDown(e, idx, swt[5])}
                    // make a suggested full list by swt name(ess||tgs||tes)
                    onClick={() => {
                       handleMakeSuggestions(swt[5]);
                      // setInputHandler(e, swt, idx);
                      // handleInputChange(e, idx);
                    }}
                  />
                  <SearchButtonHole 
                    disabled={swt[3]}
                    onClick={() => handleCancel(idx, swt[5])}
                  >
                    <SearchButtonInner disabled={swt[3]}>
                      <SearchButtonTop disabled={swt[3]}>clear</SearchButtonTop>
                    </SearchButtonInner>
                  </SearchButtonHole>
                </InputAndButtonWrapper>
                <SearchIcon  
                  onClick={() => {
                       let suggestation=  selectedSuggestionIdx >=0 ? filteredSuggestions[selectedSuggestionIdx]:inputSwitchName;
                        if(suggestation){
                            handleSelectSuggestion(idx, suggestation);
                        }

                    }}>
                  <Img
                    src={
                      swt[3]
                        ? '/images/search-icon.svg'
                        : '/images/search-icon.svg'
                    }
                  />
                </SearchIcon>
                <SearchButtonWrapper disabled={swt[3]}>
                  <SearchButtonHole
                    onClick={() => swt[3] || handleExpand(idx, swt[5])}
                    disabled={swt[3]}
                  >
                    <SearchButtonInner disabled={swt[3]}>
                      <SearchButtonTop disabled={swt[3]}>
                        {MCIsExpanded[swt[5]].masterControl
                          ? `close`
                          : `expand`}
                      </SearchButtonTop>
                    </SearchButtonInner>
                  </SearchButtonHole>
                </SearchButtonWrapper>
              </SectionInnerWrapper>
              {displaySuggestions && (
                <AutoCompleteWrapper
                  isTrue={idx === activatedIndex}
                  onMouseMove={() => setSelectedSuggestionIdx(-1)}
                >
                  <AutoCompleteInnerWrapper isTrue={idx === activatedIndex}>
                    {filteredSuggestions.map((suggestion, index) => {
                      let isSelected =
                        filteredSuggestions.indexOf(suggestion) ===
                        selectedSuggestionIdx
                          ? true
                          : false;

                      return (
                        <DisplayMachineSuggestion
                          swtName={swt[5]}
                          key={index}
                          column={idx}
                          matchedSuggestion={suggestion}
                          isSelected={isSelected}
                          handleSelect={handleSelectSuggestion}
                          index={index}
                          handleClose={() => {
                            setDisplaySuggestions(false);
                            setInputSwitchName('');
                          }}
                        />
                      );
                    })}
                  </AutoCompleteInnerWrapper>
                </AutoCompleteWrapper>
              )}
            </SectionSwitch>
            {MCIsExpanded[swt[5]].masterControl && (
              <LocationScrollWrapper>
                <SelectionLocation>
                  {swt[4].map((location, idx) => (
                    <SwitchLocation
                      key={Math.random() * 10000}
                      index={idx}
                      location={location}
                      isExpanded={MCIsExpanded[swt[5]].isLocationOpen[idx]}
                      isSpecificLocationExpanded={
                        MCIsExpanded[swt[5]].isSpecificLocationOpen
                      }
                      id={swt[5]}
                      system={
                        swt[5] === 'ess'
                          ? essSwitch
                          : swt[5] === 'tgs'
                          ? tgsSwitch
                          : swt[5] === 'tes'
                          ? tesSwitch
                          : null
                      }
                      setCenter={setCenter}
                      setZoomNum={setZoomNum}
                       mapCenter={mapCenter}
                       zoomNum={zoomNum}
                       selectedLocation={selectedLocation}
              setSelectedLocation={setSelectedLocation}
                    />
                  ))}
                </SelectionLocation>
              </LocationScrollWrapper>
            )}
            {displaySelectedMachine[idx] &&
              inputSearch[idx] &&
              machineList.includes(inputSearch[idx]) && (
                <DisplaySearchedMachineWrapper>
                  <IndividualMachine
                    location={splitName[0]}
                    setSearchedMachine={setSearchedMachines}
                    specificLocation={isSpecificLocation ? splitName[1] : null}
                    machine={isSpecificLocation ? splitName[2] : splitName[1]}
                    swtName={swt[5]}
                    setCenter={setCenter}
                    setZoomNum={setZoomNum}
                  />
                </DisplaySearchedMachineWrapper>
              )}
          </ContentsWrapper>
        );
      })}
    </Wrapper>
  );
};

export default IntegratedSystem;

const Wrapper = styled.div`
  width: 531rem;
  min-height: 590rem;
  border-radius: 11px;

  ${layerA180Deg}
  padding: 5rem 0;

  display: flex;
  flex-direction: column;
  align-items: center;
  /* visibility: hidden; */
`;

const ContentsWrapper = styled.div`
  margin-bottom: 8rem;

  &:last-child {
    margin-bottom: 0rem;
  }
`;
const SectionTitle = styled.section`
  width: 524px;
  height: 24px;
  border-radius: 14px;

  ${layerBDark}

  padding: 0 8rem;
  margin-bottom: 2rem;

  ${(p) =>
    p.disabled &&
    css`
      ${layerBDisabled}
    `}
`;
const TitleWrapper = styled.div`
  height: 100%;
  ${justifyContentSpaceBetween}
`;

const IconAndTitleWrapper = styled.div`
  display: flex;
  align-items: center;
`;

const Title = styled.span`
  font-size: 10rem;
  margin-left: 6rem;
`;
const SectionSwitch = styled.section`
  width: 524px;
  height: 30px;
  border-radius: 17px;

  ${layerC}
  ${flexBoxCenter}

  margin-bottom: 2rem;
  position: relative;
`;

const SectionInnerWrapper = styled.div`
  width: 522px;
  height: 28px;
  border-radius: 16px;

  ${layerA180Deg}
  ${justifyContentSpaceBetween}  
  padding: 0 3px 0 3px;

  ${(p) =>
    p.disabled &&
    css`
      ${layerADisabled180Deg}
    `}
`;

const InputAndButtonWrapper = styled.div`
  width: 383px;
  height: 22px;
  border-radius: 13px;

  ${layerADark}
  ${justifyContentSpaceBetween}
  padding: 0 1rem 0 10rem;

  ${(p) =>
    p.disabled &&
    css`
      ${layerBDisabled}
    `}
`;

const SearchInput = styled.input`
  background-color: transparent;
  font-size: 10rem;
  text-align: left;
  letter-spacing: 1rem;
  text-transform: uppercase;

  ::placeholder {
    color: #fff;
    ${(p) =>
      p.disabled &&
      css`
        color: #808080;
      `}
  }
`;
const SearchButtonWrapper = styled.div`
  width: 78px;
  height: 22px;
  border-radius: 13px;

  ${layerC};
  ${flexBoxCenter};
  ${(p) =>
    p.disabled &&
    css`
      ${layerBDisabled};
    `}
`;
const SearchButtonHole = styled.button`
  width: 76px;
  height: 20px;
  border-radius: 12px;

  ${layerA180Deg};
  ${flexBoxCenter};

  ${(p) =>
    p.disabled &&
    css`
      ${layerADisabled180Deg}
      cursor: not-allowed;
    `}
`;
const SearchButtonInner = styled.div`
  width: 72px;
  height: 16px;
  border-radius: 13px;

  ${layerC};
  ${flexBoxCenter};

  ${(p) =>
    p.disabled &&
    css`
      ${layerBDisabled}
    `}
`;
const SearchButtonTop = styled.div`
  width: 70px;
  height: 14px;
  border-radius: 12px;

  ${flexBoxCenter};
  ${layerA180Deg};
  font-size: 10rem;

  ${(p) =>
    p.disabled &&
    css`
      ${layerADisabled180Deg}
      color: #808080;
    `}
`;

const SearchIcon = styled.div`
  width: 22px;
  height: 22px;
  border-radius: 50%;
  cursor:pointer;


  ${layerADark}
  ${flexBoxCenter}

  ${(p) =>
    p.disabled &&
    css`
      ${layerBDisabled}
    `}
`;

const Img = styled.img`
  width: 60%;
`;

const LocationScrollWrapper = styled.div`
  width: 524px;
  min-height: 55px;
  max-height: 150px;
  border-radius: 8px;
  ${layerBDark};

  padding: 4px;
`;

const SelectionLocation = styled.section`
  width: 100%;
  min-height: 55px;
  max-height: 142px;

  display: flex;
  flex-direction: column;
  align-items: flex-start;

  scroll-behavior: smooth;
  overflow-y: auto;

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
    background-size: 65%;
    background-position: center;
    height: 10px;

    background-image: url('/images/scrollbar-button-start.svg');
  }
  ::-webkit-scrollbar-button:end:increment {
    background-repeat: no-repeat;
    background-size: 65%;
    background-position: center;
    height: 10px;

    background-image: url('/images/scrollbar-button-end.svg');
  }
`;

const DisplaySearchedMachineWrapper = styled.section`
  width: 524rem;
  border-radius: 8px;
  ${layerBDark}
  padding: 4rem 0;

  display: flex;
  flex-direction: column;
  align-items: center;
`;

const UnitNumber = styled.span`
  font-size: 10rem;
  ${(p) =>
    p.disabled &&
    css`
      color: #808080;
    `}
`;

const AutoCompleteWrapper = styled.ul`
  width: 300rem;
  border-radius: 12px;

  padding: 2rem 2rem;
  text-align: left;

  position: absolute;

  top: 30rem;
  left: 2rem;

  z-index: 100;

  display: flex;
  flex-direction: column;

  ${layerA180Deg}

  ${(p) =>
    p.isTrue ||
    css`
      display: none;
    `}
`;

const AutoCompleteInnerWrapper = styled.div`
  width: 100%;
  border-radius: 11px;

  ${layerB}
  padding: 2rem 2rem;

  ${(p) =>
    p.isTrue ||
    css`
      display: none;
    `}
`;
