import React from 'react';
import styled, { css } from 'styled-components';
import {
  flexBoxCenter,
  flexDirectionColumn,
  justifyContentSpaceBetween,
  layerA,
  layerBDark,
} from '../../../styles/commonStyles';
import { useMediaQuery } from 'react-responsive';
import SelectOptions from './SelectOptions';

const SelectHPDropBox = ({ isMasterControl }) => {
  const isMobile = useMediaQuery({ query: '(max-width:600px)' });

  const platforms = { platform1: {}, platform2: {} };

  return (
    <>
      {isMobile ? (
        <Wrapper isMobile={true}>
          <ScrollWrapper isMobile={true} isMasterControl={isMasterControl}>
            <SectionOptions isMobile={true}>
              {/* <SelectOptions
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
              ))} */}
            </SectionOptions>
          </ScrollWrapper>
          <SectionButtons isMasterControl={isMasterControl}>
            {/* {buttons.map((button, index) => (
              <ButtonWrapper isMasterControl={isMasterControl} key={index}>
                <SelectionsButton
                  title={button}
                  onClickButton={useButtonsHandler}
                  index={index}
                  isMasterControl={isMasterControl}
                />
              </ButtonWrapper>
            ))} */}
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
              <ButtonWrapper key={index}>
                <SelectionsButton
                  title={button}
                  onClickButton={useButtonsHandler}
                  index={index}
                />
              </ButtonWrapper>
            ))} */}
          </SectionButtons>
        </Wrapper>
      )}
    </>
  );
};

export default SelectHPDropBox;

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
