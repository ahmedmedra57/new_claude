import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import styled, { css } from 'styled-components';
import {
  flexBoxCenter,
  flexDirectionColumn,
  justifyContentFlexStart,
  justifyContentSpaceBetween,
  layerA,
  layerA180Deg,
  layerBDark,
  layerCLighter,
} from '../styles/commonStyles';

const SelectByName = ({
  selectOption,
  handle2ndSelect,
  isSelected,
  setIsSelected,
}) => {
  const { t } = useTranslation();
  const buttonTitles = [t('common.clear'), t('common.select')];

  const handleSelect = (index) => {
    const copyArr = [...isSelected];
    copyArr[index] = true;
    setIsSelected(copyArr);
  };

  const handleButtonClick = (btn) => {
    if (btn === 'clear') {
      const initialSelection = selectOption.map((option) => false);
      setIsSelected(initialSelection);
    } else {
      // apply => selected options,
      const selectedNames = [];
      isSelected.forEach(
        (option, index) =>
          option === true && selectedNames.push(selectOption[index])
      );

      handle2ndSelect(selectedNames);
    }
  };

  return (
    <Wrapper>
      <SectionSelectOption>
        {selectOption.map((option, index) => (
          <SelectOptions onClick={() => handleSelect(index)} key={index}>
            <RadioButton>
              <RadioIndicator isSelected={isSelected[index]}></RadioIndicator>
            </RadioButton>
            <Option>{option.username}</Option>
          </SelectOptions>
        ))}
      </SectionSelectOption>
      <SectionSelectButton isOneButton={true}>
        {buttonTitles.map((button, index) => (
          <ButtonWrapper onClick={() => handleButtonClick(button)} key={index}>
            <ButtonHole>
              <ButtonInner>
                <ButtonTop>{button}</ButtonTop>
              </ButtonInner>
            </ButtonHole>
          </ButtonWrapper>
        ))}
      </SectionSelectButton>
    </Wrapper>
  );
};

export default SelectByName;

const Wrapper = styled.div`
  width: 100%;

  ${flexDirectionColumn}
`;
const SectionSelectOption = styled.section`
  width: 96%;
  height: 200px;
  border-radius: 14px;

  ${layerBDark};
  padding: 4px;
  margin: 3px 0;

  /* scroll bar */
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
`;
const SelectOptions = styled.button`
  width: 100%;
  height: 27px;

  border: 1px solid #233a54;
  border-radius: 16px;

  ${justifyContentFlexStart}
  padding: 0 2px;
  margin-bottom: 2px;
  &:last-child {
    margin-bottom: 0px;
  }

  :hover {
    ${layerA}
  }
`;

const RadioButton = styled.div`
  width: 18px;
  height: 18px;
  border: 1px solid #95ff45;
  border-radius: 50%;
  ${flexBoxCenter}
`;
const RadioIndicator = styled.div`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  /* background-color: #95ff45; */
  background-color: ${(p) => (p.isSelected ? '#95ff45' : 'none')};
`;

const Option = styled.span`
  font-size: 8px;
  margin-left: 5px;
`;

const SectionSelectButton = styled.section`
  width: 96%;

  ${justifyContentSpaceBetween};
  ${(p) =>
    p.isOneButton &&
    css`
      justify-content: flex-end;
    `}
`;

const ButtonWrapper = styled.button`
  width: 120px;
  height: 54px;
  border-radius: 27px;

  ${layerBDark};
  ${flexBoxCenter};
`;
const ButtonHole = styled.div`
  width: 116px;
  height: 50px;
  border-radius: 25px;

  ${layerA180Deg};
  ${flexBoxCenter};
`;
const ButtonInner = styled.div`
  width: 101px;
  height: 36px;
  border-radius: 20px;

  ${layerCLighter};
  ${flexBoxCenter};
`;
const ButtonTop = styled.div`
  width: 99px;
  height: 34px;
  border-radius: 25px;
  font-size: 10px;

  ${layerA180Deg};
  ${flexBoxCenter};
`;
