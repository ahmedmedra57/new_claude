import { useSelector } from 'react-redux';
import { selectEssSwitch } from '../store/slices/essSwitchSlice';
import { selectTesSwitch } from '../store/slices/tesSwitchSlice';
import { selectTgsSwitch } from '../store/slices/tgsSwitchSlice';

import styled, { css } from 'styled-components';
import {
  flexBoxCenter,
  flexDirectionColumn,
  justifyContentSpaceBetween,
  layerA0Deg,
  layerA180Deg,
} from '../styles/commonStyles';
import { selectUnits } from '../store/slices/settings/unitsSlice';
import { useMemo } from 'react';
import { calculateTotalEnergyConsumption } from '../../helpers/helpers';

const DisplayConsumptionBox = ({ swtName, location, machine }) => {
  const unitsStatus = useSelector(selectUnits);
  const { isF } = unitsStatus;
  const { essSwitch, tgsSwitch, tesSwitch,flatEssSwitch,flatTgsSwitch,flatTesSwitch } = useSelector(
    swtName === 'ess'
      ? selectEssSwitch
      : swtName === 'tgs'
      ? selectTgsSwitch
      : selectTesSwitch
  );

  const swtStatus = swtName === 'ess' ? flatEssSwitch : swtName === 'tgs' ? flatTgsSwitch : flatTesSwitch;

  // FT³ M³
  // const isF = false;
  const gas = isF ? 'FT³' : 'M³';
  const unit = swtName === 'tgs' ? gas : 'kw';

  const consumption = useMemo(() => {
    return calculateTotalEnergyConsumption(swtStatus[location][machine]?.reading, swtName, isF);
  }, [swtStatus, location, machine, swtName, isF]);

  return (
    <Wrapper>
      <InnerWrapper>
        <Img src='/images/MC-energy-consumption.svg' />
        <TitleWrapper>
          <Title size={'sm'}>
            total {swtName === 'tgs' ? 'gas' : 'energy'}
          </Title>
          <Title>consumption</Title>
          <Title size={'big'}>
            {consumption} {unit}
          </Title>
        </TitleWrapper>
      </InnerWrapper>
    </Wrapper>
  );
};

export default DisplayConsumptionBox;

const Wrapper = styled.div`
  width: 189px;
  height: 53px;
  border-radius: 6px;

  ${layerA180Deg};
  ${flexBoxCenter};
`;
const InnerWrapper = styled.div`
  width: 183px;
  height: 47px;
  border-radius: 4px;

  ${layerA0Deg};
  border: 1px solid #fcff00;
  ${justifyContentSpaceBetween};
`;
const Img = styled.img`
  height: 90%;
  width: 30%;
`;
const TitleWrapper = styled.div`
  height: 100%;
  width: 80%;

  ${flexDirectionColumn};
  padding: 1px 0;
`;
const Title = styled.span`
  font-size: 11px;
  color: #fcff00;
  ${(p) =>
    p.size === 'sm' &&
    css`
      font-size: 10px;
    `}
  ${(p) =>
    p.size === 'big' &&
    css`
      font-size: 18px;
      text-transform: capitalize;
      margin-top: -2px;
    `}
`;
