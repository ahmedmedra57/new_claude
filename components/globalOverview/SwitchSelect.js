import { useEffect, useMemo, useState } from 'react';
import { useGlobalOverviewStore } from '../zustand-stores';
import styled, { css } from 'styled-components';
import {
  flexBoxCenter,
  flexDirectionColumn,
  justifyContentFlexEnd,
  justifyContentFlexStart,
  justifyContentSpaceBetween,
  layerA,
  layerA180Deg,
  layerA90Deg,
  layerADark,
  layerBDark,
  layerC,
} from '../styles/commonStyles';
import { useCheckControlPermsission } from '../../hooks';

const SwitchSelect = ({ isSelected, setIsSelected }) => {
  const overViewState = useGlobalOverviewStore();
  const { selectedSystem } = overViewState;
    const checkSwitchPermission=useCheckControlPermsission();
  const [isExpanded, setIsExpanded] = useState(false);

  const buttons = ['clear', 'apply'];
  const switches = useMemo(() => [
    {
      name: 'all',
      title: 'all',
      enabled:true,
    },
    {
      name: 'ess',
      title: 'ess-electric switch systems',
      enabled:checkSwitchPermission('ess'),
    },
    {
      name: 'tgs',
      title: 'tgs-typhoon gas systems',
      enabled:checkSwitchPermission('tgs'),
    },
    {
      name: 'tes',
      title: 'tes-typhoon electric systems',
      enabled:checkSwitchPermission('tes'),
    },
    {
      name: 'hp',
      title: 'hp-heating platforms',
      enabled:checkSwitchPermission('hp'),
    },
    {
      name: 'ate',
      title: 'ate-additional track equipment',
      enabled:checkSwitchPermission('ate'),
    },
  ],[checkSwitchPermission]);

  // when all options selected individually, "all" will be selected automatically
  useEffect(() => {
    if (isSelected[1] && isSelected[2] && isSelected[3]) {
      handleSelect(0);
    }
  }, [isSelected[1], isSelected[2], isSelected[3]]);

  const handleExpand = () => {
    setIsExpanded(!isExpanded);
  };
  const handleSelectAll = () => {
    const selectedOptions=switches.map(({enabled})=>enabled);
    setIsSelected(selectedOptions);
    useMCStore().setDisplaySystemDetails(selectedOptions);
  }
  const handleSelect = (id) => {
    if (id === 0) {
      handleSelectAll();
    } else {
      const arr = [...isSelected];
      arr[id] = true;
      setIsSelected(arr);
      useMCStore().setDisplaySystemDetails(arr);
    }
  };

  const handleButtonClick = (button) => {
    if (button === 'clear') {
      setIsSelected([false, false, false, false, false, false]);
      useMCStore().selectDisplaySystem(null);
    } else {
      // apply button logic
      // send selected systems to the map component for displaying
      if (isSelected[0]) {
        useMCStore().selectDisplaySystem('all');
      } else if (isSelected[1] && isSelected[2]) {
        // ess & tgs
        useMCStore().selectDisplaySystem('ess, tgs');
      } else if (isSelected[1] && isSelected[3]) {
        // ess & tes
        useMCStore().selectDisplaySystem('ess, tes');
      } else if (isSelected[2] && isSelected[3]) {
        // tgs & tes
        useMCStore().selectDisplaySystem('tgs, tes');
      } else if (isSelected[1]) {
        // ess
        useMCStore().selectDisplaySystem('ess');
      } else if (isSelected[2]) {
        // tgs
        useMCStore().selectDisplaySystem('tgs');
      } else if (isSelected[3]) {
        // tes
        useMCStore().selectDisplaySystem('tes');
      } else {
        useMCStore().selectDisplaySystem(null);
      }
      setIsExpanded(false);
    }
  };

  return (
    <Wrapper>
      <SectionTitle>
        <Title>select displayed systems</Title>
      </SectionTitle>
      <SectionSelect>
        <SelectWrapper isExpanded={isExpanded}>
          <SelectedOneAndArrowButton>
            <SelectedOne>
              {selectedSystem ? selectedSystem : '------'}
            </SelectedOne>
            <ArrowButton
              src='images/select-arrow-icon.svg'
              onClick={handleExpand}
            />
          </SelectedOneAndArrowButton>
          {isExpanded && (
            <>
              <SectionSelectOption>
                {switches.map(({title,enabled}, index) => (
                  <SelectOptionWrapper
                    key={index}
                    disabled={!enabled}
                    onClick={() => handleSelect(index)}
                  >
                    <RadioButtonWrapper disabled={!enabled}>
                      <RadioButton
                        isSelected={isSelected[index]}
                        disabled={!enabled}
                      ></RadioButton>
                    </RadioButtonWrapper>

                    <SelectOption disabled={!enabled}>
                      {title}
                    </SelectOption>
                  </SelectOptionWrapper>
                ))}
              </SectionSelectOption>
              <SectionButton>
                <ButtonHoleWrapper>
                  {buttons.map((button, idx) => (
                    <ButtonOuter
                      key={idx}
                      onClick={() => handleButtonClick(button)}
                    >
                      <ButtonInnerHole>
                        <ButtonTop>{button}</ButtonTop>
                      </ButtonInnerHole>
                    </ButtonOuter>
                  ))}
                </ButtonHoleWrapper>
              </SectionButton>
            </>
          )}
        </SelectWrapper>
      </SectionSelect>
    </Wrapper>
  );
};

export default SwitchSelect;

const Wrapper = styled.div`
  width: 100%;
  ${justifyContentFlexEnd}
`;

const SectionTitle = styled.section``;
const Title = styled.span`
  font-size: 10rem;
  margin-right: 15rem;
`;
const SectionSelect = styled.section`
  width: 320px;
  height: 39px;
  border-radius: 33px;

  ${layerBDark}
  ${flexBoxCenter}
  position: relative;
`;

const SelectWrapper = styled.div`
  width: 318px;
  height: 37px;
  border-radius: 34px;

  ${layerA180Deg}
  ${flexBoxCenter}

  padding: 0 7px 0 4px;

  ${(p) =>
    p.isExpanded &&
    css`
      position: absolute;
      top: 1px;
      z-index: 100;
      ${flexDirectionColumn}
      padding: 3em 7rem 5rem 3rem;

      width: 318px;
      height: 248px;
      border-radius: 18px;
      ${layerA90Deg}
    `}
`;

const SelectedOneAndArrowButton = styled.div`
  width: 100%;
  ${justifyContentSpaceBetween}
`;

const SelectedOne = styled.div`
  width: 277px;
  height: 29px;
  border-radius: 33px;
  font-size: 10rem;

  ${layerADark}

  display: flex;
  align-items: center;
  padding-left: 10rem;
`;
const ArrowButton = styled.img`
  margin-top: 4rem;
  cursor: pointer;
`;

const SectionSelectOption = styled.section`
  width: 309px;
  height: 170px;
  border-radius: 14px;

  ${layerBDark}
  ${flexDirectionColumn}
  padding: 2rem 0;
`;
const SelectOptionWrapper = styled.button`
  width: 305px;
  height: 26px;
  border-radius: 13px;
  border: 1px solid #233a54;

  ${justifyContentFlexStart}
  padding: 0 2rem;
  margin-bottom: 2rem;
  :last-child {
    margin-bottom: 0;
  }

  ${(p) =>
    p.disabled &&
    css`
      border: 1px solid #808080;
      cursor: not-allowed;
    `}

  &:hover {
    ${layerA}
  }
`;
const RadioButtonWrapper = styled.div`
  width: 20px;
  height: 20px;
  border-radius: 50%;

  border: 1px solid #95ff45;

  ${flexBoxCenter}
  margin-right: 10rem;

  ${(p) =>
    p.disabled &&
    css`
      border: 1px solid #808080;
    `}
`;
const RadioButton = styled.div`
  width: 12px;
  height: 12px;
  border-radius: 50%;

  ${(p) =>
    p.isSelected &&
    css`
      background: #95ff45;
    `}
`;

const SelectOption = styled.div`
  font-size: 10rem;
  ${(p) =>
    p.disabled &&
    css`
      color: #808080;
    `}
`;

const SectionButton = styled.section`
  width: 100%;
  display: flex;
  justify-content: flex-end;
`;

const ButtonHoleWrapper = styled.div`
  width: 236px;
  height: 27px;
  border-radius: 18px;

  ${layerBDark}
  ${justifyContentSpaceBetween}
`;
const ButtonOuter = styled.button`
  width: 113px;
  height: 25px;
  border-radius: 25px;

  ${layerA180Deg}
  ${flexBoxCenter}
`;
const ButtonInnerHole = styled.div`
  width: 105rem;
  height: 17rem;
  border-radius: 18rem;

  ${layerC}
  ${flexBoxCenter}
`;
const ButtonTop = styled.div`
  ${flexBoxCenter}

  width: 103rem;
  height: 15rem;
  border-radius: 25rem;
  ${layerA180Deg}

  font-size: 10rem;
`;
