import styled, { css } from 'styled-components';
import { useTranslation } from 'react-i18next';
import {
  flexBoxCenter,
  flexDirectionColumn,
  layerA,
} from '../styles/commonStyles';

const SelectByOption = ({
  selectOption,
  handle1stSelect,
  isSelected,
  setIsSelected,
}) => {
  const { t } = useTranslation();
  const handleSelect = (index) => {
    if (index === 0) {
      setIsSelected([true, false]);
    } else {
      setIsSelected([false, true]);
    }
  };

  return (
    <Wrapper>
      <SectionSelectOption>
        {selectOption.map((option, index) => (
          <SelectOptions
            onClick={() => handleSelect(index)}
            key={Math.random() * 1000}
          >
            <RadioButton>
              <RadioIndicator isSelected={isSelected[index]}></RadioIndicator>
            </RadioButton>
            <Option>{option}</Option>
          </SelectOptions>
        ))}
      </SectionSelectOption>
      <SectionSelectButton isOneButton={true}>
        <ButtonWrapper onClick={handle1stSelect}>
          <ButtonHole>
            <ButtonInner>
              <ButtonTop>{t('common.select')}</ButtonTop>
            </ButtonInner>
          </ButtonHole>
        </ButtonWrapper>
      </SectionSelectButton>
    </Wrapper>
  );
};

export default SelectByOption;

const Wrapper = styled.div`
  width: 100%;
  ${flexDirectionColumn}
`;
const SectionSelectOption = styled.section`
  width: 96%;

  background: #1b2b44;
  box-shadow: inset 0px 0px 6px #000000;
  border-radius: 14px;

  padding: 4px;
  margin: 3px 0;
`;
const SelectOptions = styled.button`
  width: 100%;
  height: 27px;

  border: 1px solid #233a54;
  border-radius: 16px;

  display: flex;
  align-items: center;
  justify-content: flex-start;

  padding: 0 2rem;
  &:first-child {
    margin-bottom: 2rem;
  }

  :hover {
    ${layerA}
  }
`;

const RadioButton = styled.div`
  width: 18rem;
  height: 18rem;
  border: 1px solid #95ff45;
  border-radius: 50%;
  ${flexBoxCenter}
`;
const RadioIndicator = styled.div`
  width: 12rem;
  height: 12rem;
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
  display: flex;
  align-items: center;
  justify-content: space-around;

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

  background: #1b2b44 0% 0%;
  box-shadow: inset 0px 0px 6px #000000;

  ${flexBoxCenter}
`;
const ButtonHole = styled.div`
  width: 116px;
  height: 50px;
  border-radius: 25px;

  background: transparent linear-gradient(180deg, #233a54 0%, #060d19 100%);
  box-shadow: inset 0px 0.5px 1px #ffffff24, 0px 0px 1px #000000;
  border: 0.5px solid #000000;

  ${flexBoxCenter}
`;
const ButtonInner = styled.div`
  width: 101px;
  height: 36px;
  border-radius: 20px;

  background: #142033;
  box-shadow: inset 0px 0px 1px #000000;

  ${flexBoxCenter}
`;
const ButtonTop = styled.div`
  width: 99px;
  height: 34px;
  border-radius: 25px;
  font-size: 10px;

  background: transparent linear-gradient(180deg, #233a54 0%, #060d19 100%);
  box-shadow: inset 0px 0.5px 1px #ffffff24, 0px 0px 1px #000000;
  border: 0.5px solid #000000;

  ${flexBoxCenter}
`;
