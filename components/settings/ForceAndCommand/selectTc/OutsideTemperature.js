import styled, { css } from 'styled-components';
import {
import { useForceCommandAndAdminSelectStore } from '../../zustand-stores';
  borderABlue,
  flexBoxCenter,
  justifyContentSpaceAround,
  justifyContentSpaceBetween,
  layerA,
  layerA180Deg,
} from '../../../styles/commonStyles';
import SelectLocationsBox from '../../SelectLocationsBox';
import TCSelectBox from './TCSelectBox';
import { useRef } from 'react';

function OutsideTemperature({
  handleOpenSelectLocations,
  displaySelectBox,
  ess,
  tgs,
  tes,
  sys,
  // handleSelectIndividualMachine,
  // handleUnSelectIndividualMachine,
  activeSelect,
  setActiveSelect,
  handleClick,
  isTCOpen,
  setIsTCOpen,
}) {
  const activeIndexButton = useRef(null);
  const tempMeasurementSelection = ['internet', 'thermocouple'];

  const forceCommandAndAdminSelectState = useForceCommandAndAdminSelectStore();

  return (
    <BaseLayer>
      <Wrapper>
        <TitleWrapper>
          <Title>outside temperature</Title>
        </TitleWrapper>
        <ControlWrapper>
          {tempMeasurementSelection.map((data, index) => {
            return (
              <FlexRow key={index}>
                <OuterCircle
                  onClick={() => {
                    setActiveSelect(index);
                    activeIndexButton.current = index;
                    activeIndexButton.current === 0 &&
                      handleClick('outsideTemp', 2, 'internet');
                  }}
                >
                  <InnerCircle isActive={activeSelect === index}></InnerCircle>
                </OuterCircle>
                <IndividualContainer>
                  <Text>{data}</Text>
                </IndividualContainer>
              </FlexRow>
            );
          })}
        </ControlWrapper>
        <SelectLocationWrapper>
          <SelectLocationsBox
            selectedOne={
              forceCommandAndAdminSelectState.outsideTemp.selectedOne
            }
            handleOpenSelectLocations={handleOpenSelectLocations}
            displaySelectBox={displaySelectBox}
            sysIndex={'outsideTemp'}
            sysOptions={'forceAndCommands'}
            swt={'sys'}
            ess={ess}
            tgs={tgs}
            tes={tes}
            sys={sys}
            // handleSelectIndividualMachine={handleSelectIndividualMachine}
            // handleUnSelectIndividualMachine={handleUnSelectIndividualMachine}
            multipleSelectBoxes={true}
            isMobileSelectTC={true}
            program={'forceAndCommand'}
          />
        </SelectLocationWrapper>

        <TCSelectBoxWrapper>
          <TCSelectBox
            handleClick={handleClick}
            system={'outsideTemp'}
            position={0}
            isTCOpen={isTCOpen}
            setIsTCOpen={setIsTCOpen}
            isDisable={activeSelect === 0}
          />
        </TCSelectBoxWrapper>
      </Wrapper>
    </BaseLayer>
  );
}

export default OutsideTemperature;

const BaseLayer = styled.div`
  width: 268px;
  height: 192px;

  ${layerA}

  border-radius: 19px;
  opacity: 1;
  ${flexBoxCenter}
`;

const Wrapper = styled.div`
  width: 266px;
  height: 190px;

  ${layerA180Deg}

  border-radius: 18px;
  opacity: 1;
  ${justifyContentSpaceBetween}
  flex-direction: column;
`;

const TitleWrapper = styled.div`
  width: 262px;
  height: 32px;
  margin-top: 2px;

  ${layerA}

  border-radius: 16px;
  opacity: 1;
  ${flexBoxCenter}
`;

const Title = styled.p`
  text-align: center;
  font-size: 11px;
  letter-spacing: 1.1px;
  color: #ffff;
  opacity: 1;
`;

const ControlWrapper = styled.div`
  margin-top: 4px;
  width: 262px;
  height: 68px;

  ${layerA}

  border-radius: 16px;
  opacity: 1;

  opacity: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: flex-start;
`;

const SelectLocationWrapper = styled.div`
  z-index: 10;
`;

const FlexRow = styled.div`
  width: 100%;
  ${justifyContentSpaceAround}
  margin-left: 1px;
`;

const OuterCircle = styled.span`
  cursor: pointer;
  width: 28px;
  height: 28px;

  margin-top: 2px;
  border: 1px solid #95ff45;
  border-radius: 50%;
  ${flexBoxCenter}
`;

const InnerCircle = styled.div`
  cursor: pointer;
  width: 18px;
  height: 18px;
  background-color: ${({ isActive }) => (isActive ? '#95ff45' : 'none')};
  border-radius: 50%;
`;

const IndividualContainer = styled.div`
  width: 222px;
  height: 28px;
  margin-right: 2px;

  ${borderABlue}

  border-radius: 14px;
  opacity: 1;
  ${flexBoxCenter}
`;

const Text = styled.p`
  font-size: 12px;
  margin-left: 10px;
  color: #ffff;
  letter-spacing: 1.2px;
  opacity: 1;
`;

const TCSelectBoxWrapper = styled.div`
  margin-bottom: 2px;
`;
