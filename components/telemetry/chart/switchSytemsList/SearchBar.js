import { useSelector } from "react-redux";
import styled, { css } from "styled-components";
import { selectTelemetry } from "../../../store/slices/telemetrySlice";
import Button from "./Button";
import DisplaySwitchSuggestion from "./DisplaySwitchSuggestion";
import {
  flexBoxCenter,
  justifyContentSpaceBetween,
  layerBDark,
  layerA180Deg,
  layerADark,
  layerB,
  layerDisabled180Deg,
} from "../../../styles/commonStyles";

const SearchBar = ({
  handleClearSearch,
  handleExpandSearch,
  buttonTitle,
  handleSelectSuggestion,
  setInputSwitchName,
  setSelectedSuggestionIdx,
  handleKeyDown,
  handleMakeSuggestions,
  systemSwitches,
  displaySuggestions,
  activatedIndex,
  selectedSuggestionIdx,
  filteredSuggestions,
  setDisplaySuggestions,
  switchIdx,
  inputSearch,
  disabled,
}) => {
  const telemetryState = useTelemetryStore();
  const isSearch = telemetryState.isSearch;

  const inputHandler = (e) => {
    handleSelectSuggestion(0, e.target.value);
    setInputSwitchName(e.target.value);
    setSelectedSuggestionIdx(-1);
  };

  return (
    <ShadowWrapper>
      <Wrapper disabled={disabled}>
        <IndentWrapper disabled={disabled}>
          <InputSearch
            type="text"
            placeholder="search"
            value={inputSearch}
            onChange={inputHandler}
            onKeyDown={(e) => handleKeyDown(e)}
            onClick={() => {
              handleMakeSuggestions(systemSwitches[0][5]);
            }}
            disabled={disabled} 
          ></InputSearch>
          <ClearButton>
            <Button
              disabled={disabled}
              title={"clear"}
              handleClick={handleClearSearch}
            />
          </ClearButton>
        </IndentWrapper>
        <IndentSearchIcon disabled={disabled}>
          <SearchIcon src={"./images/search-icon-white.svg"}></SearchIcon>
        </IndentSearchIcon>
        <ExpandButton disabled={disabled} title={buttonTitle}>
          <Button
            title={buttonTitle}
            disabled={disabled}
            handleClick={handleExpandSearch}
            handleClear={handleClearSearch}
          />
        </ExpandButton>
        {displaySuggestions && isSearch && (
          <AutoCompleteWrapper
            isTrue={switchIdx === activatedIndex}
            onMouseMove={() => setSelectedSuggestionIdx(-1)}
          >
            <AutoCompleteInnerWrapper isTrue={switchIdx === activatedIndex}>
              {filteredSuggestions.map((suggestion, index) => {
                let isSelected =
                  filteredSuggestions.indexOf(suggestion) ===
                  selectedSuggestionIdx
                    ? true
                    : false;

                return (
                  <DisplaySwitchSuggestion
                    key={index}
                    column={0}
                    matchedSuggestion={suggestion}
                    isSelected={isSelected}
                    handleSelect={handleSelectSuggestion}
                    handleClose={() => {
                      setDisplaySuggestions(false);
                      setInputSwitchName("");
                    }}
                  />
                );
              })}
            </AutoCompleteInnerWrapper>
          </AutoCompleteWrapper>
        )}
      </Wrapper>
    </ShadowWrapper>
  );
};

export default SearchBar;

const ShadowWrapper = styled.div`
  width: 591px;
  height: 34px;
  margin-top: 8px;

  ${layerBDark}

  border-radius: 17px;
  opacity: 1;
  ${flexBoxCenter}
`;

const Wrapper = styled.div`
  width: 590px;
  height: 32px;

  ${layerA180Deg}
  ${({ disabled }) =>
    disabled &&
    css`
      ${layerDisabled180Deg}
    `}

  border-radius: 16px;
  opacity: 1;
  ${justifyContentSpaceBetween}
  position: relative;
`;

const IndentWrapper = styled.div`
  width: 445px;
  height: 26px;
  margin-left: 3px;

  ${layerADark}

  border-radius: 13px;
  opacity: 1;
  ${justifyContentSpaceBetween}

  ${({ disabled }) =>
    disabled &&
    css`
      ${layerDisabled180Deg}
    `}
`;

const InputSearch = styled.input`
  width: 350px;
  height: 26px;
  font-size: 10px;
  color: #ffff;
  background: transparent;
  border-radius: 13px;
  text-align: left;
  padding-left: 10px;
  text-transform: uppercase;
  ::placeholder {
    color: #ffff;
  }

  ${({ disabled }) =>
    disabled &&
    css`
      ${layerDisabled180Deg}
    `}
`;

const ClearButton = styled.div`
  ${({ disabled }) =>
    disabled &&
    css`
      ${layerDisabled180Deg}
    `}
`;

const IndentSearchIcon = styled.div`
  width: 26px;
  height: 26px;
  cursor:pointer;
  ${layerADark}
  ${({ disabled }) =>
    disabled &&
    css`
      ${layerDisabled180Deg}
    `}
  border-radius: 13px;
  opacity: 1;
  ${flexBoxCenter};
`;

const SearchIcon = styled.img``;

const ExpandButton = styled.div`
  width: 89px;
  height: 26px;
  margin-right: 3px;
  ${({ title }) => (title === "close" ? "border: 1px solid #95FF45" : "")}

  ${layerB}

  border-radius: 13px;
  opacity: 1;
  ${flexBoxCenter}

  ${({ disabled }) =>
    disabled &&
    css`
      ${layerDisabled180Deg}
    `}
`;

const AutoCompleteWrapper = styled.ul`
  width: 360px;
  padding: 2px 2px;
  text-align: left;

  position: absolute;

  top: 30px;
  left: 2px;

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
  ${layerBDark}

  border-radius: 11px;
  padding: 2px 2px;

  ${(p) =>
    p.isTrue ||
    css`
      display: none;
    `}
`;
