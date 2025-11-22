import { useMemo } from "react";
import { useCallback } from "react";
import { useEffect } from "react";
import { useState } from "react";
import styled, { css } from "styled-components";
import {
  flexBoxCenter,
  justifyContentSpaceBetween,
  justifyContentSpaceEvenly,
  layerA,
  layerA180Deg,
  layerB,
  layerBDark,
} from "../../../styles/commonStyles";
import DisplaySwitchSuggestion from "../../../telemetry/chart/switchSytemsList/DisplaySwitchSuggestion";
import { useMediaQuery } from "react-responsive";
import { useSelector } from "react-redux";
import { selectLocations } from "../../../store/slices/locationsSlice";
import {
  filteredSuggestionsHandler,
  getFormattedMachineName,
} from "../../../../helpers/helpers";

const ValveSearchBar = ({
  system,
  inputSearch,
  setInputSearch,
  setSelectSearchMethod,
}) => {
  // media query
  const isMobile = useMediaQuery({ query: "(max-width:600px)" });

  const [inputSwitchName, setInputSwitchName] = useState("");

  const handleClearSearch = useCallback(() => {
    setInputSwitchName("");
    const copyInputSearch = [...inputSearch];
    copyInputSearch[0] = "";
    setInputSearch(copyInputSearch);
  }, [inputSearch, inputSwitchName]);
  // const locationsData = useSelector(selectLocations);

  const [selectedSuggestionIdx, setSelectedSuggestionIdx] = useState(0);

  const [displaySuggestions, setDisplaySuggestions] = useState(false);

  const [machineSuggestions, setMachineSuggestions] = useState(null);

  const locations = useSelector(selectLocations);
  // Machine name list as an array
  // const tgsLocations = useMemo(
  //   () =>
  //     Object.keys(system).map((location) =>
  //       Object.keys(system[location]).map((el) => {
  //         if (system[location][el]?.deviceMac) {
  //           return `${location} - ${el}`;
  //         } else {
  //           return Object.keys(system[location][el]).flatMap((machine) => {
  //             return `${location} - ${el} - ${machine}`;
  //           });
  //         }
  //       })
  //     ),
  //   [system]
  // );
  // const locations = useMemo(
  //   () =>
  //     Object.keys(system).map((location) =>
  //       Object.keys(system[location]).map(
  //         (machine) => `${location} - ${machine}`
  //       )
  //     ),
  //   [system]
  // );
  // const machines = useMemo(
  //   () => tgsLocations.reduce((acc, cur) => acc.concat(cur)),
  //   [tgsLocations]
  // );

  // const machines = getFormattedMachineName(system);
  const machines = Object.keys(system).flatMap((location) => {
    if (system[location].isSpecificLocation) {
      return Object.keys(system[location].subLocations).flatMap((subLocation) => {
        return Object.entries(system[location].subLocations[subLocation].devices).map(([key, el]) => {
          return `${subLocation} - ${key}`;
        });
      });
    } else {
      return Object.entries(system[location].devices).map(([key, el]) => {
        return `${location} - ${key}`;
      });
    }
  });
  
  

  // ************************************************

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
  //         return locationsData.all[el].locationName;
  //       } else {
  //         return locationsData.all[suggestion.split(' - ')[0]].devices[el]
  //           .machineName;
  //       }
  //     })
  //     .join(' - ')
  //     .includes(inputSwitchName.toUpperCase());
  // });

  useEffect(() => {
    filteredSuggestions?.length >= 1 && inputSwitchName?.length >= 2
      ? setDisplaySuggestions(true)
      : setDisplaySuggestions(false);
  }, [filteredSuggestions, inputSwitchName]);

  // Make suggested machine list!!

  const handleMakeSuggestions = useCallback(() => {
    setMachineSuggestions(machines);
  }, [machines]);

  const handleSelectSuggestion = useCallback(
    (idx = 0, suggestion = "") => {
      const arr = [...inputSearch];
      arr[idx] = suggestion;
      setInputSearch(arr);
    },
    [inputSearch, setInputSearch]
  );

  const handleKeyDown = (event) => {
    switch (event.key) {
      case "Escape": {
        setInputSearch("");
        break;
      }
      case "Enter": {
        // isExpand need to be closed depends on idx
        handleSelectSuggestion(0, filteredSuggestions[selectedSuggestionIdx]);
        setInputSwitchName("");
        setSelectedSuggestionIdx(-1);
        setDisplaySuggestions(false);

        // Close all locations

        break;
      }
      case "ArrowUp": {
        selectedSuggestionIdx <= -1
          ? setSelectedSuggestionIdx(-1)
          : setSelectedSuggestionIdx(selectedSuggestionIdx - 1);
        break;
      }
      case "ArrowDown": {
        selectedSuggestionIdx >= filteredSuggestions.length
          ? setSelectedSuggestionIdx(filteredSuggestions.length - 1)
          : setSelectedSuggestionIdx(selectedSuggestionIdx + 1);
        break;
      }
      default: {
        break;
      }
    }
  };

  const handleSearchButton = () => {
    if (selectedSuggestionIdx) {
      handleSelectSuggestion(0, filteredSuggestions[selectedSuggestionIdx]);
      setInputSwitchName("");
      setSelectedSuggestionIdx(-1);
      setDisplaySuggestions(false);
    }
  };

  const inputHandler = (e) => {
    handleSelectSuggestion(0, e.target.value);
    setInputSwitchName(e.target.value);
    setSelectedSuggestionIdx(-1);
  };

  const clearButtonHandler = () => {
    handleClearSearch();
    setSelectSearchMethod(false);
  };

  const inputClickHandler = () => {
    handleMakeSuggestions();
    setSelectSearchMethod(0);
  };

  const closeSuggestionListHandler = () => {
    setDisplaySuggestions(false);
    setInputSwitchName("");
  };

  return (
    <>
      {isMobile ? (
        <BaseLayer isMobile={true}>
          <Wrapper isMobile={true}>
            <IndentInput isMobile={true}>
              <Input
                isMobile={true}
                placeholder="search"
                type="text"
                value={inputSearch}
                // onChange={(e) => {
                //   handleSelectSuggestion(0, e.target.value);
                //   setInputSwitchName(e.target.value);
                //   setSelectedSuggestionIdx(-1);
                // }}
                onChange={inputHandler}
                onKeyDown={handleKeyDown}
                // onKeyDown={(e) => handleKeyDown(e)}
                // make a suggested full list by swt name(ess||tgs||tes)
                onClick={inputClickHandler}
                // onClick={() => {
                //   handleMakeSuggestions();
                //   setSelectSearchMethod(0);
                // }}
              ></Input>
              <ClearButton
                onClick={clearButtonHandler}
                // onClick={() => {
                //   handleClearSearch();
                //   setSelectSearchMethod(false);
                // }}
                isMobile={true}
              >
                <ClearButtonHole isMobile={true}>
                  <ClearButtonTop isMobile={true}>
                    <ButtonTitle isMobile={true}>clear</ButtonTitle>
                  </ClearButtonTop>
                </ClearButtonHole>
              </ClearButton>
            </IndentInput>
            {displaySuggestions && (
              <AutoCompleteWrapper
                isMobile={true}
                isTrue={displaySuggestions}
                onMouseMove={() => setSelectedSuggestionIdx(-1)}
              >
                <AutoCompleteInnerWrapper isTrue={displaySuggestions}>
                  {filteredSuggestions.map((suggestion, index) => {
                    let isSelected =
                      filteredSuggestions.indexOf(suggestion) ===
                      selectedSuggestionIdx
                        ? true
                        : false;

                    return (
                      <DisplaySwitchSuggestion
                        key={suggestion + index}
                        column={0}
                        matchedSuggestion={suggestion}
                        isSelected={isSelected}
                        handleSelect={handleSelectSuggestion}
                        handleClose={closeSuggestionListHandler}
                        // handleClose={() => {
                        //   setDisplaySuggestions(false);
                        //   setInputSwitchName('');
                        // }}
                      />
                    );
                  })}
                </AutoCompleteInnerWrapper>
              </AutoCompleteWrapper>
            )}
            <IndentIcon isMobile={true}>
              <SearchIcon
                isMobile={true}
                src={"/images/search-icon-white.svg"}
              />
            </IndentIcon>
            <SearchButtonBase isMobile={true}>
              <SearchButton
                isMobile={true}
                onClick={handleSearchButton}
                // onClick={() => {
                //   handleSearchButton();
                // }}
              >
                <SearchButtonHole isMobile={true}>
                  <SearchButtonTop isMobile={true}>
                    <ButtonTitle isMobile={true}>search</ButtonTitle>
                  </SearchButtonTop>
                </SearchButtonHole>
              </SearchButton>
            </SearchButtonBase>
          </Wrapper>
        </BaseLayer>
      ) : (
        <BaseLayer>
          <Wrapper>
            <IndentInput>
              <Input
                placeholder="search"
                type="text"
                value={inputSearch}
                onChange={inputHandler}
                // onChange={(e) => {
                //   handleSelectSuggestion(0, e.target.value);
                //   setInputSwitchName(e.target.value);
                //   setSelectedSuggestionIdx(-1);
                // }}
                onKeyDown={handleKeyDown}
                // onKeyDown={(e) => handleKeyDown(e)}
                // make a suggested full list by swt name(ess||tgs||tes)
                onClick={inputClickHandler}
                // onClick={() => {
                //   handleMakeSuggestions();
                //   setSelectSearchMethod(0);
                // }}
              ></Input>
              <ClearButton
                onClick={clearButtonHandler}
                // onClick={() => {
                //   handleClearSearch();
                //   setSelectSearchMethod(false);
                // }}
              >
                <ClearButtonHole>
                  <ClearButtonTop>
                    <ButtonTitle>clear</ButtonTitle>
                  </ClearButtonTop>
                </ClearButtonHole>
              </ClearButton>
            </IndentInput>
            {displaySuggestions && (
              <AutoCompleteWrapper
                isTrue={displaySuggestions}
                onMouseMove={() => setSelectedSuggestionIdx(-1)}
              >
                <AutoCompleteInnerWrapper isTrue={displaySuggestions}>
                  {filteredSuggestions.map((suggestion, index) => {
                    let isSelected =
                      filteredSuggestions.indexOf(suggestion) ===
                      selectedSuggestionIdx
                        ? true
                        : false;

                    return (
                      <DisplaySwitchSuggestion
                        column={0}
                        matchedSuggestion={suggestion}
                        isSelected={isSelected}
                        handleSelect={handleSelectSuggestion}
                        handleClose={closeSuggestionListHandler}
                        // handleClose={() => {
                        //   setDisplaySuggestions(false);
                        //   setInputSwitchName('');
                        // }}
                      />
                    );
                  })}
                </AutoCompleteInnerWrapper>
              </AutoCompleteWrapper>
            )}
            <IndentIcon>
              <SearchIcon src={"/images/search-icon-white.svg"} />
            </IndentIcon>
            <SearchButtonBase>
              <SearchButton
                onClick={handleSearchButton}
                // onClick={() => {
                //   handleSearchButton();
                // }}
              >
                <SearchButtonHole>
                  <SearchButtonTop>
                    <ButtonTitle>search</ButtonTitle>
                  </SearchButtonTop>
                </SearchButtonHole>
              </SearchButton>
            </SearchButtonBase>
          </Wrapper>
        </BaseLayer>
      )}
    </>
  );
};

export default ValveSearchBar;

const BaseLayer = styled.div`
  ${({ isMobile }) =>
    isMobile
      ? css`
          width: 271px;
          height: 34px;
        `
      : css`
          width: 385px;
          height: 32px;
        `}

  border-radius: 16px;
  ${layerA}

  ${flexBoxCenter}
`;

const Wrapper = styled.div`
  ${({ isMobile }) =>
    isMobile
      ? css`
          width: 269px;
          height: 32px;
        `
      : css`
          width: 383px;
          height: 30px;
        `}

  border-radius: 15px;
  ${layerA180Deg}

  ${justifyContentSpaceEvenly}
  position:relative;
`;

const IndentInput = styled.div`
  ${({ isMobile }) =>
    isMobile
      ? css`
          width: 170px;
          height: 26px;
          border-radius: 13px;
        `
      : css`
          width: 272px;
          height: 24px;
          border-radius: 16px;
        `}

  ${layerA}

  ${justifyContentSpaceBetween}
`;

const Input = styled.input`
  ${({ isMobile }) =>
    isMobile
      ? css`
          width: 110px;
          height: 26px;
          border-radius: 13px;
        `
      : css`
          width: 190px;
          height: 24px;
          border-radius: 16px;
        `}
  background: none;

  &::placeholder {
    color: #ffff;
  }
`;

const ClearButton = styled.button`
  ${({ isMobile }) =>
    isMobile
      ? css`
          width: 59px;
          height: 24px;
          border-radius: 12px;
        `
      : css`
          width: 82px;
          height: 22px;
          border-radius: 25px;
        `}

  ${layerA180Deg}

  ${flexBoxCenter}
`;

const ClearButtonHole = styled.div`
  ${({ isMobile }) =>
    isMobile
      ? css`
          width: 55px;
          height: 20px;
          border-radius: 13px;
        `
      : css`
          width: 76px;
          height: 16px;
          border-radius: 20px;
        `}

  ${layerB}
 
  ${flexBoxCenter}
`;

const ClearButtonTop = styled.div`
  ${({ isMobile }) =>
    isMobile
      ? css`
          width: 53px;
          height: 18px;
          border-radius: 12px;
        `
      : css`
          width: 74px;
          height: 14px;
          border-radius: 19px;
        `}

  ${layerA180Deg}


  ${flexBoxCenter}
`;

const ButtonTitle = styled.p`
  font-size: 10px;
  letter-spacing: 1px;
`;

const AutoCompleteWrapper = styled.ul`
  ${({ isMobile }) =>
    isMobile
      ? css`
          width: 269px;
        `
      : css`
          width: 360px;
        `}

  padding: 2px 2px;
  text-align: left;

  position: absolute;

  top: 30px;
  left: 1px;

  z-index: 100;

  display: flex;
  flex-direction: column;

  ${layerA180Deg}

  border-radius: 12px;
  ${(p) =>
    p.isTrue ||
    css`
      display: none;
    `}
`;

const AutoCompleteInnerWrapper = styled.div`
  width: 100%;
  background: #1b2b44 0% 0%;
  box-shadow: inset 0px 0px 6px #000000;
  border-radius: 11px;
  padding: 2px 2px;

  ${(p) =>
    p.isTrue ||
    css`
      display: none;
    `}
`;

const IndentIcon = styled.div`
  ${({ isMobile }) =>
    isMobile
      ? css`
          width: 20px;
          height: 20px;
        `
      : css`
          width: 26px;
          height: 26px;
        `}

  border-radius: 50%;

  ${layerBDark}

  ${flexBoxCenter}
`;

const SearchIcon = styled.img`
  ${({ isMobile }) =>
    isMobile &&
    css`
      width: 12px;
      height: 12px;
    `}
`;

const SearchButtonBase = styled.div`
  ${({ isMobile }) =>
    isMobile
      ? css`
          width: 69px;
          height: 26px;
          border-radius: 13px;
        `
      : css`
          width: 71px;
          height: 24px;
          border-radius: 16px;
        `}

  ${layerA}


  ${flexBoxCenter}
`;

const SearchButton = styled.button`
  ${({ isMobile }) =>
    isMobile
      ? css`
          width: 67px;
          height: 24px;
          border-radius: 12px;
        `
      : css`
          width: 69px;
          height: 22px;
          border-radius: 25px;
        `}

  ${layerA180Deg}

  ${flexBoxCenter}
`;

const SearchButtonHole = styled.div`
  ${({ isMobile }) =>
    isMobile
      ? css`
          width: 63px;
          height: 20px;
          border-radius: 13px;
        `
      : css`
          width: 63px;
          height: 16px;
          border-radius: 20px;
        `}

  ${layerB}

  ${flexBoxCenter}
`;

const SearchButtonTop = styled.div`
  ${({ isMobile }) =>
    isMobile
      ? css`
          width: 61px;
          height: 18px;
          border-radius: 12px;
        `
      : css`
          width: 61px;
          height: 14px;
          border-radius: 25px;
        `}

  ${layerA180Deg}


  ${flexBoxCenter}
`;
