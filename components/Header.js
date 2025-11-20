import { useEffect, useState, memo } from 'react';
import { useESSSwitchStore, useLocationsStore, useTESSwitchStore, useTGSSwitchStore, useUserStore } from 'zustand-stores';
import styled, { css } from 'styled-components';
import DateAndWeather from './masterControl/DateAndWeather';
import AutoCompleteBox from './searchBox/AutoCompleteBox';
import SearchBox from './searchBox/SearchBox';
import { useMediaQuery } from 'react-responsive';
import { NavLink } from 'react-router-dom';

import {
import { useUserStore } from '../zustand-stores';
  flexBoxCenter,
  flexDirectionColumn,
  justifyContentSpaceBetween,
  layerA,
  layerA180Deg,
  layerADark,
  layerBDark,
  layerCLighter,
  layerC,
  layerB,
} from './styles/commonStyles';

import { DUMMY_SWITCHES } from './DUMMY/DUMMY_LOCATION_INFO';
import {
  handleOpenMachineController,
  selectEssSwitch,
import {
  selectTgsSwitch,
  tgsHandleOpenMachineController,
import {
  selectTesSwitch,
  tesHandleOpenMachineController,
import { useNavigate } from 'react-router-dom';

import {
  handleEssInitialState,
  handleOpenMasterControl,
  handleTesInitialState,
  handleTgsInitialState,
  selectMCIsExpanded,
  setOpenLocationInitialStateHandler,
  setOpenSpecificLocationInitialStateHandler,
  handleOpenLocation,

import { GiHamburgerMenu } from 'react-icons/gi';
import { useMutation } from 'react-query';
import { logoutService } from '../services';
import {
  filteredSuggestionsHandler,
  getFormattedMachineName,
  getTitle,
} from '../helpers/helpers';
import testData from '../test_data/testData';

const Header = () => {
  // responsive design
  const isMobile = useMediaQuery({ query: '(max-width:600px)' });

  // Global state
  const userInfo = useUserStore();
  const { firstname, lastname, title, gender, avatar } = userInfo.user;
  const { user_code } = userInfo.user;

  const { essSwitch: essSwitches, flatEssSwitch } =
    useESSSwitchStore();
  const { tgsSwitch: tgsSwitches, flatTgsSwitch } =
    useTGSSwitchStore();
  const { tesSwitch: tesSwitches, flatTesSwitch } =
    useTESSwitchStore();
 
  const locations = useLocationsStore();

  // local states
  const [searchInput, setSearchInput] = useState('');
  const [openSearchBox, setOpenSearchBox] = useState(false);
  const [openAutoCompleteBox, setOpenAutoCompleteBox] = useState(false);
  const [searchedSwitch, setSearchedSwitch] = useState(null);
  const [searchedLocationIndex, setSearchedLocationIndex] = useState(null);
  const [searchedParentLocationIndex, setSearchedParentLocationIndex] =
    useState(null);
  const [searchedLocation, setSearchedLocation] = useState(null);
  const [searchedSpecificLocation, setSearchedSpecificLocation] =
    useState(null);
  const [searchedSpecificLocationIndex, setSearchedSpecificLocationIndex] =
    useState(null);
  const [searchedMachine, setSearchedMachine] = useState(null);

  const navigation = useNavigate();
  
  const { mutate: mutateLogout } = useMutation(logoutService, {
    onSuccess: () => {
      localStorage.removeItem('access_token');
      useUserStore().setAccessToken(null);
    },
  });

  useEffect(() => {
    if (searchInput.length >= 2) {
      if (!isMobile) {
        setOpenSearchBox(false);
      }
      setOpenAutoCompleteBox(true);
    } else {
      setOpenAutoCompleteBox(false);
    }
  }, [searchInput, isMobile]);

  const handleLogoutClick = () => {
    mutateLogout();
  };
  function updateHash(newParams) {
    const currentHash = window.location.hash.replace('#', '');
    const params = new URLSearchParams(currentHash);

    Object.keys(newParams).forEach((key) => {
      if (newParams[key]) {
        params.set(key, newParams[key]);
      } else {
        params.delete(key);
      }
    });

    window.location.hash = params.toString();
  }

  const controlMachinesDispatcher = (
    swtData,
    machineControlFC,
    swtSystem,
    _swtData
  ) => {
    const locationArr = Object.keys(_swtData).map((_, index) =>
      index === searchedLocationIndex ? true : false
    );
    const specificLocationArr = Object.keys(_swtData).map((location, index) =>
      index === searchedParentLocationIndex ? true : false
    );
    let locationId;
    let device;
    locationArr.forEach((el, index) => {
      if (index === searchedLocationIndex) {
        locationId = Object.keys(swtData)[searchedLocationIndex];
        device = Object.values(swtData[locationId])?.[0];
        if (device.parentLocationId) {
          updateHash({
            location: device.parentLocationId,
            specificLocation: device.zone_id,
          });
          sessionStorage.setItem('locationId', device.parentLocationId);
          sessionStorage.setItem('specificLocationId', device.zone_id);
        } else {
          updateHash({ location: device.zone_id });
          sessionStorage.setItem('locationId', device.zone_id);
        }
        useLocationsStore().openLocation({
            swtName: swtSystem,
            openSpecificLocationIdx: index,
            index: index,
            status: true,
          });
      } else {
        useLocationsStore().openLocation({
            swtName: swtSystem,
            openSpecificLocationIdx: index,
            index: index,
            status: false,
          });
      }
    });
    specificLocationArr.forEach((el, index) => {
      if (index === searchedParentLocationIndex) {
        useLocationsStore().openLocation({
            swtName: swtSystem,
            openSpecificLocationIdx: index,
            index: index,
            status: true,
          });
      }
    });
    Object.keys(swtData).forEach((location) =>
      Object.keys(swtData[location]).forEach((el) => {
        if (el?.deviceMac && Object.keys(el).length > 0) {
          machineControlFCCallback({
              location,
              machine: el,
              status: false,
            });
        }
      });

    machineControlFCCallback({
        location: searchedLocation,
        specificLocation: searchedSpecificLocation,
        machine: searchedMachine,
        status: true,
      });
  };

  const handleSearchbarButton = async (id) => {
    if (id === 'clear') {
      setSearchInput('');
      setInputSwitchSearch('');
      !isMobile && setOpenSearchBox(false);
    } 
    else {
      
      setOpenSearchBox(false);
      // do something for search!
      // 1. find ess || tgs || tes and go to there
      await navigation(`/${searchedSwitch}`);
      // 2. find location name and dispatch open
      // 3. find switch name and dispatch open
      if (searchedSwitch === 'ess') {
        controlMachinesDispatcher(
          flatEssSwitch,
          handleOpenMachineController,
          'ess',
          essSwitches
        );
        
        useMCStore().setOpenMasterControl({ swtName: searchedSwitch, status: false });
      } else if (searchedSwitch === 'tgs') {
        controlMachinesDispatcher(
          flatTgsSwitch,
          tgsHandleOpenMachineController,
          'tgs',
          tgsSwitches
        );
        
      } else if (searchedSwitch === 'tes') {
        controlMachinesDispatcher(
          flatTesSwitch,
          tesHandleOpenMachineController,
          'tes',
          tesSwitches
        );
        
      }
    }
  };

  const essMachines = getFormattedMachineName(flatEssSwitch);
  const tgsMachines = getFormattedMachineName(flatTgsSwitch);
  const tesMachines = getFormattedMachineName(flatTesSwitch);

  const switchList = [
    ...new Set([...essMachines, ...tgsMachines, ...tesMachines]),
  ];

  const [selectedSuggestionIdx, setSelectedSuggestionIdx] = useState(0);
  const [inputSwitchSearch, setInputSwitchSearch] = useState('');

  const filteredSuggestions = filteredSuggestionsHandler(
    switchList,
    locations,
    searchInput
  );

  const listOfSystems = filteredSuggestions.map((item, index) => {
  
    const result = [];
    if (filteredSuggestions.indexOf(item) !== index) {
      result.push('tes');
    } else {
      const systems = ['ess', 'tgs'];
      systems.forEach((system) => {
        const splitName = item.split(' - ');
        if (locations[system][splitName[0]]?.devices) {
          if (locations[system][splitName[0]]?.devices[splitName[1]]) {
            if (
              system === 'tgs' &&
              locations[system][splitName[0]]?.devices[splitName[1]].TES_enabled
            ) {
              result.push('tes');
            }
            result.push(system);
          }
        } else if (locations[system][splitName[0]]) {
          if (
            locations[system][splitName[0]][splitName[1]]?.devices[splitName[2]]
          ) {
            result.push(system);
          }
        }
      });
    }
    return result;
  });

  const setIndexesAndSystemHandler = (
    swt,
    locationIdx,
    specificLocationIdx,
    essParentLocationIdx
  ) => {
    setSearchedSwitch(swt);
    setSearchedLocationIndex(locationIdx);

    if (specificLocationIdx) {
      setSearchedSpecificLocationIndex(specificLocationIdx);
    }
  };

  const handleSearchedSwitch = (suggestion, system) => {
    const names = suggestion.split(' - ');
    const essLocationIdx = Object.keys(flatEssSwitch).indexOf(names[0]);
    const tgsLocationIdx = Object.keys(flatTgsSwitch).indexOf(names[0]);
    const tesLocationIdx = Object.keys(flatTesSwitch).indexOf(names[0]);
    let essParentLocationIdx;
    if (locations.all[names[0]].parent_location_id) {
      essParentLocationIdx = Object.keys(essSwitches).indexOf(
        locations.all[names[0]].parent_location_id
      );
      setSearchedParentLocationIndex(essParentLocationIdx);
    }
    if (suggestion.length === 3) {
      const essSpecificLocationIdx = Object.keys(
        flatEssSwitch[names[0]]
      ).indexOf(names[1]);
      const tgsSpecificLocationIdx = Object.keys(
        flatTgsSwitch[names[0]]
      ).indexOf(names[1]);
      const tesSpecificLocationIdx = Object.keys(
        flatTesSwitch[names[0]]
      ).indexOf(names[1]);

      if (essLocationIdx >= 0 && system === 'ess') {
        setIndexesAndSystemHandler(
          system,
          essLocationIdx,
          essSpecificLocationIdx,
          essParentLocationIdx
        );
      } else if (tgsLocationIdx >= 0 && system === 'tgs') {
        setIndexesAndSystemHandler(
          system,
          tgsLocationIdx,
          tgsSpecificLocationIdx
        );
      } else if (tesLocationIdx >= 0 && system === 'tes') {
        setIndexesAndSystemHandler(
          system,
          tesLocationIdx,
          tesSpecificLocationIdx
        );
      }
      setSearchedLocation(names[0]);
      setSearchedSpecificLocation(names[1]);
      setSearchedMachine(names[2]);
    } else {
      if (essLocationIdx >= 0 && system === 'ess') {
        setIndexesAndSystemHandler(system, essLocationIdx);
      } else if (tgsLocationIdx >= 0 && system === 'tgs') {
        setIndexesAndSystemHandler(system, tgsLocationIdx);
      } else if (tesLocationIdx >= 0 && system === 'tes') {
        setIndexesAndSystemHandler(system, tesLocationIdx);
      }
      setSearchedLocation(names[0]);
      setSearchedMachine(names[1]);
    }
  };

  const handleSelect = (suggestion, title, system) => {
    setInputSwitchSearch(title);
    handleSearchedSwitch(suggestion, system);

    setSearchInput('');
    setSelectedSuggestionIdx(-1);
  };

  const handleKeyDown = (event) => {
    switch (event.key) {
      case 'Escape': {
        setSearchInput('');
        break;
      }
      case 'Enter': {
        if (selectedSuggestionIdx >= 0 && filteredSuggestions[selectedSuggestionIdx]) {
        const selectedSuggestion = filteredSuggestions[selectedSuggestionIdx];
        const systemsForSuggestion = listOfSystems[selectedSuggestionIdx];
        const system = systemsForSuggestion[0]; // اختار أول system مرتبط بالاختيار

        const namesArr = selectedSuggestion.split(' - ');

        let title;
        if (namesArr.length === 3) {
          title = `${locations.all[namesArr[0]][namesArr[1]]?.locationName} - ${
            locations.all[namesArr[0]][namesArr[1]]?.devices[namesArr[2]]?.machineName
          }`;
        } else {
          title = `${locations.all[namesArr[0]]?.locationName} - ${
            locations.all[namesArr[0]]?.devices[namesArr[1]]?.machineName
          }`;
        }

        const titleAndSystem = title + ' - ' + system;

        handleSelect(selectedSuggestion, titleAndSystem, system);
     
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

  // ********************************auto complete*****************************

  const inputHandler = (e) => {
    setSearchInput(e.target.value.toUpperCase();
    setInputSwitchSearch(e.target.value);
    setSelectedSuggestionIdx(-1);
  };

  return (
    <>
      {isMobile ? (
        <OutsideWrapper isMobile={isMobile}>
          <DateAndWeather />

          <MobileWrapper>
            <MobileInnerWrapper>
              <SectionMenuButton>
                <MenuButton to={'/'}>
                  <MenuButtonTop>
                    <StyledGiHamburgerMenu />
                  </MenuButtonTop>
                </MenuButton>
              </SectionMenuButton>
              <SectionAvatar>
                <Img src={'/images/header-user-avatar.svg'} alt='user avatar' />
              </SectionAvatar>
              <SectionTitle>
                <Img src={'/images/embrellaTitle-sm.svg'} />
              </SectionTitle>
              <SectionSearch>
                <SearchButton onClick={() => setOpenSearchBox(!openSearchBox)}>
                  <MenuButtonTop>
                    <Img src='/images/search-icon.svg' />
                  </MenuButtonTop>
                </SearchButton>
              </SectionSearch>
            </MobileInnerWrapper>
          </MobileWrapper>

          {openSearchBox && (
            <SectionSearchbar
              isMobile={isMobile}
              openSearchBox={openSearchBox}
              openAutoCompleteBox={openAutoCompleteBox}
            >
              <SearchbarTop
                isMobile={isMobile}
                openSearchBox={openSearchBox}
                openAutoCompleteBox={openAutoCompleteBox}
              >
                <SearchBarInvisibleWrapper isMobile={isMobile}>
                  <SearchInputAndButtonWrapper isMobile={isMobile}>
                    <SearchInput
                      isMobile={isMobile}
                      placeholder='search'
                      type='text'
                      value={inputSwitchSearch?.toUpperCase()}
                      onClick={() => setOpenSearchBox(true)}
                      onChange={inputHandler}
                      onKeyDown={(e) => handleKeyDown(e)}
                    />

                    <ClearButton
                      isMobile={isMobile}
                      onClick={() => handleSearchbarButton('clear')}
                    >
                      <ClearButtonHole isMobile={isMobile}>
                        <ClearButtonTop isMobile={isMobile}>
                          clear
                        </ClearButtonTop>
                      </ClearButtonHole>
                    </ClearButton>
                  </SearchInputAndButtonWrapper>
                  <SearchIconWrapper
                    isMobile={isMobile}
                    onClick={() => setOpenSearchBox(!openSearchBox)}
                  >
                    <Img src='/images/search-icon.svg' />
                  </SearchIconWrapper>

                  <SearchButtonWrapper isMobile={isMobile}>
                    <SearchButtonHole
                      isMobile={isMobile}
                      onClick={() => handleSearchbarButton('search')}
                    >
                      <SearchButtonInnerWrapper isMobile={isMobile}>
                        <SearchButtonTop isMobile={isMobile}>
                          search
                        </SearchButtonTop>
                      </SearchButtonInnerWrapper>
                    </SearchButtonHole>
                  </SearchButtonWrapper>
                </SearchBarInvisibleWrapper>
                {openSearchBox && inputSwitchSearch.length < 1 && (
                  <SearchBox
                    handleClose={() => setOpenSearchBox(false)}
                    isMobile={isMobile}
                    openAutoCompleteBox={openAutoCompleteBox}
                  />
                )}

                {openAutoCompleteBox && (
                  <AutoCompleteInnerWrapper isMobile={isMobile}>
                    <SwitchesWrapper isMobile={isMobile}>
                      {filteredSuggestions.map((swtName, index) => {
                        let isSelected =
                          filteredSuggestions.indexOf(swtName) ===
                          selectedSuggestionIdx
                            ? true
                            : false;

                        return (
                          <AutoCompleteBox
                            isMobile={isMobile}
                            key={Math.random() * 100000}
                            swtName={swtName}
                            index={index}
                            isSelected={isSelected}
                            handleSelect={handleSelect}
                            handleNavigate={() =>
                              handleSearchbarButton('search')
                            }
                            handleClose={() => setSearchInput('')}
                          />
                        );
                      })}
                    </SwitchesWrapper>
                  </AutoCompleteInnerWrapper>
                )}
              </SearchbarTop>
            </SectionSearchbar>
          )}
        </OutsideWrapper>
      ) : (
        <OutsideWrapper>
          <DateAndWeather />

          <HeaderHole>
            <HeaderTop>
              <SectionUserInfo>
                <Img
                  src={avatar ? avatar : '/images/dummyPicture.svg'}
                  style={{ width: '37px', height: '37px', borderRadius: '50%' }}
                  alt='user avatar'
                />
                <ContentsWrapper>
                  <InfoWrapper unit='upper'>
                    <UserInfo>
                      {getTitle(gender)} {firstname} {lastname}
                    </UserInfo>
                    <UserInfo>id : {user_code}</UserInfo>
                  </InfoWrapper>
                  <Division />
                  <InfoWrapper>
                    <UserInfo>{title}</UserInfo>
                  </InfoWrapper>
                </ContentsWrapper>

                <LogButtonWrapper onClick={handleLogoutClick}>
                  <LogButtonHole>
                    <LogButtonTop>logout</LogButtonTop>
                  </LogButtonHole>
                </LogButtonWrapper>
              </SectionUserInfo>

              <Logo src={'/images/umbrella-logo-header.svg'} alt='Logo Image' />

              <SectionSearchbar
                openSearchBox={openSearchBox}
                openAutoCompleteBox={openAutoCompleteBox}
              >
                <SearchbarTop
                  openSearchBox={openSearchBox}
                  openAutoCompleteBox={openAutoCompleteBox}
                >
                  <SearchBarInvisibleWrapper>
                    <SearchInputAndButtonWrapper>
                      <SearchInput
                        placeholder='search'
                        type='text'
                        value={inputSwitchSearch?.toUpperCase()}
                        onClick={() => setOpenSearchBox(true)}
                        onChange={inputHandler}
                        onKeyDown={(e) => handleKeyDown(e)}
                      />
                      <SearchButtonHole
                        onClick={() => handleSearchbarButton('clear')}
                      >
                        <SearchButtonInnerWrapper>
                          <SearchButtonTop>clear</SearchButtonTop>
                        </SearchButtonInnerWrapper>
                      </SearchButtonHole>
                    </SearchInputAndButtonWrapper>
                    <SearchIconWrapper
                      onClick={() => handleSearchbarButton('search')}
                    >
                      <Img src='/images/search-icon.svg' />
                    </SearchIconWrapper>

                    <SearchButtonWrapper>
                      <SearchButtonHole
                        onClick={() => handleSearchbarButton('search')}
                      >
                        <SearchButtonInnerWrapper>
                          <SearchButtonTop>search</SearchButtonTop>
                        </SearchButtonInnerWrapper>
                      </SearchButtonHole>
                    </SearchButtonWrapper>
                  </SearchBarInvisibleWrapper>

                  {openSearchBox && inputSwitchSearch.length < 1 && (
                    <SearchBox handleClose={() => setOpenSearchBox(false)} />
                  )}

                  {openAutoCompleteBox && (
                    <AutoCompleteInnerWrapper>
                      <ScrollWrapper>
                        <SwitchesWrapper>
                          {filteredSuggestions.map((swtName, idx) => {
                            let isSelected =
                              filteredSuggestions.indexOf(swtName) ===
                              selectedSuggestionIdx
                                ? true
                                : false;
                            return listOfSystems[idx].map((system) => {
                              return (
                                <AutoCompleteBox
                                  key={Math.random() * 100000}
                                  swtName={swtName}
                                  isSelected={isSelected}
                                  handleSelect={handleSelect}
                                  handleNavigate={() =>
                                    handleSearchbarButton('search')
                                  }
                                  handleClose={() => setSearchInput('')}
                                  system={system}
                                />
                              );
                            });
                          })}
                        </SwitchesWrapper>
                      </ScrollWrapper>
                    </AutoCompleteInnerWrapper>
                  )}
                </SearchbarTop>
              </SectionSearchbar>
            </HeaderTop>
          </HeaderHole>
        </OutsideWrapper>
      )}
    </>
  );
};

export default memo(Header);

const OutsideWrapper = styled.header`
  ${flexBoxCenter}
  flex-direction: column;
  width: 100%;
  margin-bottom: 5px;

  ${(p) =>
    p.isMobile &&
    css`
      position: relative;
    `}
`;
const HeaderHole = styled.div`
  width: 1328px;
  height: 71px;
  border-radius: 39px;
  ${layerA}
  ${flexBoxCenter}
`;

const HeaderTop = styled.div`
  width: 1324rem;
  height: 67rem;
  border-radius: 34px;

  ${layerA180Deg}
  ${justifyContentSpaceBetween}
  padding: 0 10rem;
`;

const SectionUserInfo = styled.section`
  width: 531px;
  height: 48px;
  border-radius: 33px;

  ${layerADark}
  ${justifyContentSpaceBetween}
  padding: 0 4rem 0 2rem;
`;
const Img = styled.img``;
const ContentsWrapper = styled.div`
  height: 100%;

  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const InfoWrapper = styled.div`
  display: flex;
  justify-content: space-between;
`;

const UserInfo = styled.span`
  font-size: 10rem;
`;
const Division = styled.div`
  width: 366rem;
  height: 0;
  border-top: 1px solid #ffff;
  margin: 2rem 0;
`;

const LogButtonWrapper = styled.button`
  width: 91px;
  height: 40px;
  border-radius: 34px;
  ${layerA180Deg}
  ${flexBoxCenter}
`;
const LogButtonHole = styled.div`
  width: 81px;
  height: 30px;
  border-radius: 33px;
  ${layerBDark}
  ${flexBoxCenter}
`;
const LogButtonTop = styled.div`
  width: 77px;
  height: 26px;
  border-radius: 34px;
  font-size: 10rem;
  ${layerA180Deg}
  ${flexBoxCenter}
`;

const Logo = styled.img``;

const SectionSearchbar = styled.section`
  width: 532px;
  height: 49px;
  border-radius: 33px;
  ${layerADark}
  ${flexBoxCenter}
  
  ${(p) =>
    p.openSearchBox &&
    css`
      position: relative;
    `}

    ${(p) =>
    p.openAutoCompleteBox &&
    css`
      position: relative;
    `}

    ${(p) =>
    p.isMobile &&
    css`
      position: absolute;
      bottom: -68px;
      width: auto;
      height: auto;
    `}
`;

const SearchbarTop = styled.div`
  width: 522px;
  height: 40px;
  border-radius: 34px;
  ${layerA180Deg}
  ${flexBoxCenter}
  

  ${(p) =>
    p.openSearchBox &&
    css`
      position: absolute;
      top: 4px;
      height: auto;
      border-radius: 20px;
      z-index: 100;
      ${flexDirectionColumn}
    `};

  ${(p) =>
    p.openAutoCompleteBox &&
    css`
      position: absolute;
      top: 4px;
      height: auto;
      border-radius: 20px;
      z-index: 100;
      ${flexDirectionColumn}
    `}
  ${(p) =>
    p.isMobile &&
    css`
      width: 326px;
    `}
`;

const SearchBarInvisibleWrapper = styled.div`
  width: 522px;
  height: 40px;
  ${justifyContentSpaceBetween}
  padding: 0 3rem;

  ${(p) =>
    p.isMobile &&
    css`
      width: 326px;
    `}
`;

const SearchInputAndButtonWrapper = styled.div`
  width: 376px;
  height: 32px;
  border-radius: 33px;

  ${layerADark}
  ${justifyContentSpaceBetween}
  padding: 0 2rem 0 8rem;

  ${(p) =>
    p.isMobile &&
    css`
      width: 203px;
      height: 36px;
      padding: 0 4px 0 8px;
    `}
`;

const SearchInput = styled.input`
  background-color: transparent;
  width: 260px;
  height: 100%;
  font-size: 10px;
  text-align: left;
  padding-left: 5px;
  ::placeholder {
    color: #fff;
  }

  ${(p) =>
    p.isMobile &&
    css`
      width: 130px;
    `}
`;

const ClearButton = styled.button`
  width: 61px;
  height: 30px;
  border-radius: 17px;
  ${layerA180Deg};
  ${flexBoxCenter}
`;

const ClearButtonHole = styled.div`
  width: 55px;
  height: 24px;
  border-radius: 14px;

  ${layerB};
  ${flexBoxCenter};
`;
const ClearButtonTop = styled.div`
  width: 53px;
  height: 22px;
  border-radius: 13px;

  ${layerA180Deg};
  ${flexBoxCenter}
  font-size: 10rem;
`;

const SearchButtonWrapper = styled.div`
  width: 94px;
  height: 32px;
  border-radius: 33px;
  ${layerADark};
  ${flexBoxCenter};

  ${(p) =>
    p.isMobile &&
    css`
      width: 76px;
      height: 36px;
      border-radius: 18px;
      ${layerADark};
    `}
`;
const SearchButtonHole = styled.button`
  width: 90px;
  height: 28px;
  border-radius: 25px;
  ${layerA180Deg}
  ${flexBoxCenter}
  ${(p) =>
    p.isMobile &&
    css`
      width: 74px;
      height: 34px;
      border-radius: 17px;
      ${layerA180Deg};
    `}
`;
const SearchButtonInnerWrapper = styled.div`
  width: 82px;
  height: 20px;

  border-radius: 18px;
  ${layerCLighter}
  ${flexBoxCenter}

  ${(p) =>
    p.isMobile &&
    css`
      width: 68px;
      height: 28px;
      border-radius: 14px;
      ${layerB};
    `}
`;
const SearchButtonTop = styled.div`
  width: 80px;
  height: 18px;
  border-radius: 25px;

  ${layerA180Deg}
  ${flexBoxCenter}
  font-size: 10rem;

  ${(p) =>
    p.isMobile &&
    css`
      width: 66px;
      height: 26px;
      border-radius: 13px;
      ${layerA180Deg};
    `}
`;

const SearchIconWrapper = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 33px;
  cursor:pointer;
  ${layerADark}
  ${flexBoxCenter}
  ${(p) => p.isMobile && css``}
`;

const AutoCompleteInnerWrapper = styled.section`
  width: 522px;
  ${flexDirectionColumn};
  padding: 2px 0 4px 0;

  ${(p) => p.selectedSwitch && css``}
  ${(p) =>
    p.isMobile &&
    css`
      width: 319px;
      max-height: 141px;
    `}
`;

const ScrollWrapper = styled.div`
  width: 514px;
  min-height: 30px;
  max-height: 200px;
  border-radius: 18px 8px 8px 18px;
  ${layerC};
  padding: 4px;
`;

const SwitchesWrapper = styled.div`
  width: 100%;
  min-height: 30px;
  max-height: 192px;

  display: flex;
  flex-direction: column;
  align-items: center;

  /* scroll bar */
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
      width: 100%;
      height: 100%;
      ::-webkit-scrollbar {
        display: none;
      }
    `}
`;

// ---------------------

const MobileWrapper = styled.div`
  width: 332px;
  height: 58px;
  border-radius: 39px;
  ${layerA};
  ${flexBoxCenter};
`;
const MobileInnerWrapper = styled.div`
  width: 328px;
  height: 54px;
  border-radius: 34px;
  ${layerA180Deg};
  ${justifyContentSpaceBetween};
  padding: 0 4px 0 4px;
`;

const SectionMenuButton = styled.section`
  width: 46px;
  height: 46px;
  border-radius: 50%;
  ${layerA};

  ${flexBoxCenter};
`;
const MenuButton = styled(NavLink)`
  width: 42px;
  height: 42px;
  border-radius: 50%;
  ${layerA180Deg};
  ${flexBoxCenter};
`;

const SearchButton = styled.button`
  width: 42px;
  height: 42px;
  border-radius: 50%;
  ${layerA180Deg};
  ${flexBoxCenter};
`;

const MenuButtonTop = styled.div`
  width: 33px;
  height: 33px;
  border-radius: 50%;
  ${layerADark};
  ${flexBoxCenter};
`;

const StyledGiHamburgerMenu = styled(GiHamburgerMenu)`
  font-size: 20px;
`;

const SectionAvatar = styled.section`
  width: 44px;
  height: 44px;
  border-radius: 50%;

  ${layerA};
  ${flexBoxCenter};
`;
const SectionTitle = styled.section`
  width: 158px;
`;

const SectionSearch = styled.section`
  width: 46px;
  height: 46px;
  border-radius: 50%;
  ${layerA};
  ${flexBoxCenter};
`;
