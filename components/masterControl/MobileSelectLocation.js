import { useState } from 'react';
import { useESSSwitchStore, useMasterControlSelectStore, useTESSwitchStore, useTGSSwitchStore } from '../zustand-stores';
import styled, { css } from 'styled-components';
import {
import { useMobileMasterControlStore } from '../zustand-stores';
import { useMasterControlSelectStore } from '../zustand-stores';
  flexBoxCenter,
  flexDirectionColumn,
  justifyContentFlexStart,
  justifyContentSpaceBetween,
  layerA,
  layerA180Deg,
  layerADark,
  layerB,
} from '../styles/commonStyles';
import SelectMachineOptions from './controls/mainSelection/SelectMachineOptions';


import { useEffect } from 'react';

const MobileSelectLocation = ({ setIsApply }) => {
  // Global states
  const MCStatus = useMobileMasterControlStore();
  const { selectedSwt, isOpenSelectLocation } = MCStatus;

  const { essSwitch: essSwt } = useESSSwitchStore();
  const { tgsSwitch: tgsSwt } = useTGSSwitchStore();
  const { tesSwitch: tesSwt } = useTESSwitchStore();

  // states for selection
  const selectLocationStatus = useMasterControlSelectStore();
  const { ess, tgs, tes } = selectLocationStatus;

  const { selectedOne } =
    selectedSwt === 'ess' ? ess : selectedSwt === 'tgs' ? tgs : tes;

  // ******************initialize selections to use*******************

  useEffect(() => {
    if (selectedOne) {
      useMCStore().setReadyToSelectProgram(true);
    } else {
      useMCStore().setReadyToSelectProgram(false);
      // useMCStore().unselectProgram();
    }
  }, [selectedOne]);

  useEffect(() => {
    return () => {
      useMasterControlSelectStore().resetAllSelect();
    };
  }, []);

  useEffect(() => {
    if (!selectedSwt) {
      useMasterControlSelectStore().openSelectLocation(false);
    }
  }, [selectedSwt]);

  // Local states
  const arrowSrc = isOpenSelectLocation
    ? '/images/masterCtr-select-btn.svg'
    : '/images/masterCtr-select-btn.svg';

  
  const handleOpenSelect = () => {
    useMasterControlSelectStore().openSelectLocation();
    setIsApply(false);
  };

  return (
    <Wrapper isExpanded={isOpenSelectLocation}>
      <InnerWrapper isExpanded={isOpenSelectLocation}>
        <SelectedOneAndArrowButton>
          <SelectedOneWrapper>
            <SelectedOne>
              {selectedOne ? selectedOne : 'select switch location'}
            </SelectedOne>
          </SelectedOneWrapper>
          <ExpandButton onClick={() => selectedSwt && handleOpenSelect()}>
            <Icon src={arrowSrc} />
          </ExpandButton>
        </SelectedOneAndArrowButton>
        {isOpenSelectLocation && (
          <SelectMachineOptions
            isMasterControl={true}
            handleClose={handleOpenSelect}
            data={
              selectedSwt === 'ess'
                ? essSwt
                : selectedSwt === 'tes'
                ? tesSwt
                : tgsSwt
            }
            swt={selectedSwt}
            // Need to conditionally assign ||tgs || tes || ess
          />
          // <SectionButton>
          //   {buttonNames.map((name, index) => (
          //     <Button key={index} onClick={() => handleButtonClick(index)}>
          //       <ButtonInner>
          //         <ButtonHole>
          //           <ButtonTop>{name}</ButtonTop>
          //         </ButtonHole>
          //       </ButtonInner>
          //     </Button>
          //   ))}
          // </SectionButton>
        )}
      </InnerWrapper>
    </Wrapper>
  );
};

export default MobileSelectLocation;

const Wrapper = styled.div`
  width: 248px;
  border-radius: 24px;
  ${layerADark};
  ${flexBoxCenter};

  ${(p) =>
    p.isExpanded
      ? css`
          top: 602px;
          height: auto;
          padding: 2px 0;
        `
      : css`
          height: 47px;
        `}
`;
const InnerWrapper = styled.div`
  width: 244px;
  border-radius: 21px;
  ${layerA180Deg};

  ${(p) =>
    p.isExpanded
      ? css`
          height: auto;
          padding-top: 4.5px;
          ${flexDirectionColumn};
          justify-content: flex-start;
          padding-bottom: 6px;
        `
      : css`
          height: 43px;
          ${flexBoxCenter};
        `}
`;

const SelectedOneAndArrowButton = styled.div`
  width: 100%;
  ${justifyContentSpaceBetween};
  padding: 0 5px 0 8px;
`;
const SelectedOneWrapper = styled.div`
  width: 196px;
  height: 29px;
  border-radius: 22px;
  ${layerADark};
  ${justifyContentFlexStart};
  padding-left: 10px;
`;

const SelectedOne = styled.span`
  font-size: 10px;
`;

const ExpandButton = styled.button`
  height: 29px;
  width: 32px;
  ${flexBoxCenter};
  margin-top: 4px;
`;
const Icon = styled.img`
  height: 100%;
`;

const SelectWrapper = styled.div`
  ${flexDirectionColumn};
`;

const SectionButton = styled.section`
  width: 230px;
  ${justifyContentSpaceBetween};
`;
const Button = styled.button`
  width: 110px;
  height: 37px;
  border-radius: 18px;
  ${layerB};
  ${flexBoxCenter};
`;
const ButtonInner = styled.div`
  width: 108px;
  height: 35px;
  border-radius: 25px;
  ${layerA180Deg};
  ${flexBoxCenter};
`;

const ButtonHole = styled.div`
  width: 100px;
  height: 27px;
  border-radius: 18px;
  ${layerA};
  ${flexBoxCenter};
`;
const ButtonTop = styled.div`
  width: 98px;
  height: 25px;
  border-radius: 25px;
  ${layerA180Deg};
  ${flexBoxCenter};

  font-size: 12px;
`;
