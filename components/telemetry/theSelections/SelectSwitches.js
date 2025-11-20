import { useDispatch } from 'react-redux';
import styled, { css } from 'styled-components';
import { handleDisplaySelectBox } from '../../store/slices/masterControlSelectSlice';
import {
  flexBoxCenter,
  justifyContentFlexStart,
  justifyContentSpaceAround,
  justifyContentSpaceBetween,
  justifyContentSpaceEvenly,
  layerA180Deg,
  layerA90Deg,
  layerADark,
} from '../../styles/commonStyles';
import SelectSwitchMachineOptions from './SelectSwitchMachineOptions';

const SelectSwitches = ({
  displaySelectBox,
  ess,
  tgs,
  tes,
  essDc,
  tgsTesDc,
  // tesDc,
  hpDc,
  hpGc,
  hpEc,
  selectedOne,
  handleButtonClick,
  essSwitch,
  tesSwitch,
  tgsSwitch,
  hpElectricSwitch,
  hpGasSwitch,
  essDataConsumptionSwitch,
  tesDataConsumptionSwitch,
  tgsDataConsumptionSwitch,
  hpDataConsumptionSwitch,
}) => {
  
  const swt = ess
    ? 'ess'
    : tes
    ? 'tes'
    : tgs
    ? 'tgs'
    : essDc
    ? 'essDc'
    : tgsTesDc
    ? 'tgsTesDc'
    : hpDc
    ? 'hpDc'
    : hpEc
    ? 'hpEc'
    : hpGc && 'hpGc';
  return (
    <Wrapper>
      <SelectWrapper>
        <Title>select switches</Title>
        <SelectInnerWrapper displaySelectBox={displaySelectBox}>
          <SelectedOneAndArrowButtonWrapper>
            <SelectTop>{selectedOne ? selectedOne : '-----'}</SelectTop>
            <SelectArrowButton
              src='/images/select-arrow-icon.svg'
              onClick={() => swt && handleButtonClick()}
            />
          </SelectedOneAndArrowButtonWrapper>
          {displaySelectBox && (
            <SelectSwitchMachineOptions
              handleClose={() => dispatch(handleDisplaySelectBox(false))}
              data={
                ess
                  ? essSwitch
                  : tes
                  ? tesSwitch
                  : tgs
                  ? tgsSwitch
                  : essDc
                  ? essDataConsumptionSwitch
                  : tgsTesDc
                  ? tgsDataConsumptionSwitch
                  : hpDc
                  ? hpDataConsumptionSwitch
                  : hpEc
                  ? hpElectricSwitch
                  : hpGc && hpGasSwitch
              }
              swt={swt}
              isTelemetry={true}
              // Need to conditionally assign ||tgs || tes || ess
            />
          )}
        </SelectInnerWrapper>
      </SelectWrapper>
    </Wrapper>
  );
};

export default SelectSwitches;

const Wrapper = styled.div`
  width: auto;
  height: 59px;
  /* position: relative; */

  /* flex-direction: column; */
  z-index: 10;
`;

const SelectWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  /* position: absolute; */
`;

const SelectInnerWrapper = styled.div`
  width: 309px;
  min-height: 41px;

  ${layerA180Deg}

  border-radius: 34px;

  ${justifyContentSpaceBetween}

  padding: 0 4px;

  ${(p) =>
    p.displaySelectBox &&
    css`
      z-index: 10;
      align-items: flex-start;
      flex-direction: column;
      border-radius: 20px 20px 18px 18px;
      padding-top: 3px;
      padding-bottom: 4px;
      /* padding: 5px; */

      ${layerA90Deg}
    `}
`;

const SelectedOneAndArrowButtonWrapper = styled.div`
  display: flex;
  gap: 12px;
`;

const SelectArrowButton = styled.img`
  margin-right: 2px;
  margin-top: 1px;
  cursor: pointer;
`;
const SelectTop = styled.div`
  width: 257px;
  height: 33px;
  padding-left: 10px;

  ${layerADark}

  border-radius: 33px;

  font-size: 10px;
  ${justifyContentFlexStart}
`;

const Title = styled.p`
  margin-bottom: 4px;

  text-align: left;
  font-size: 10px;
  letter-spacing: 1px;
  color: #ffffff;
  opacity: 1;
`;
