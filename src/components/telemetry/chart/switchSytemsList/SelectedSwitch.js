import styled, { css } from 'styled-components';
import {
  borderBlue,
  justifyContentSpaceBetween,
} from '../../../styles/commonStyles';

const SelectedSwitch = ({
  index,
  switchData,
  energySymbol,
  machineValues,
  telemetryData,
}) => {
  const machineData = telemetryData?.find(
    (el) => el.machine === machineValues.deviceMac
  );
  return (
    <IndividualMachine key={index}>
      <FlexDiv>
        <IconAndLocationWrapper>
          <Icon src='/images/indeMachine-icon.svg' />
          <Info1>{switchData}</Info1>
        </IconAndLocationWrapper>
        <Info1 isHours={true}>
          {machineData?.totalUsageHours ? machineData.totalUsageHours : '--'}{' '}
          Hrs
        </Info1>
        <Info1 isConsumption={true}>
          {machineData?.totalConsumption ? machineData.totalConsumption : '--'}{' '}
          {energySymbol}
        </Info1>
      </FlexDiv>
    </IndividualMachine>
  );
};

export default SelectedSwitch;

const IndividualMachine = styled.div`
  width: 99.4%;
  height: 26px;

  ${borderBlue}
  border-radius: 13px;

  display: flex;
  align-items: center;
  justify-content: space-between;

  padding: 0 8px 0 22px;

  margin-bottom: 2px;
`;

const FlexDiv = styled.div`
  width: 97%;
  height: auto;

  ${justifyContentSpaceBetween};

  position: relative;
`;

const IconAndLocationWrapper = styled.div`
  width: fit-content;
  display: flex;
  align-items: center;
`;
const Icon = styled.img`
  width: fit-content;
  margin-right: 4px;
  margin-top: 2px;
`;
const Info1 = styled.span`
  font-size: 7px;
  width: fit-content;

  position: absolute;
  ${({ isHours, isConsumption }) =>
    isHours
      ? css`
          top: 2px;
          left: 64%;
        `
      : isConsumption
      ? css`
          top: 2px;
          left: 92%;
        `
      : css`
          top: 2px;
          left: 2%;
        `}
`;
