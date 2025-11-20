import styled, { css } from 'styled-components';
import { selectForceCommandAndAdminSelect } from '../../../store/slices/settings/force&CommandAndAdminSelectSlice';
import {
  flexBoxCenter,
  justifyContentSpaceBetween,
  layerA,
  layerA180Deg,
} from '../../../styles/commonStyles';
import SelectLocationsBox from '../../SelectLocationsBox';
import TCSelectBox from './TCSelectBox';

const ShareComponentForSelectTC = ({
  title,
  handleOpenSelectLocations,
  displaySelectBox,
  ess,
  tgs,
  tes,
  sys,
  // handleSelectIndividualMachine,
  // handleUnSelectIndividualMachine,
  sysIndex,
  sysOptions,
  swt,
  handleClick,
  position,
  isTCOpen,
  setIsTCOpen,
}) => {
  const forceCommandAndAdminSelectState = useSelector(
    selectForceCommandAndAdminSelect
  );

  const { selectedOne } =
    sysIndex === 'burningChamber'
      ? forceCommandAndAdminSelectState.burningChamber
      : sysIndex === 'encloseTemp'
      ? forceCommandAndAdminSelectState.encloseTemp
      : sysIndex === 'currEss'
      ? forceCommandAndAdminSelectState.currEss
      : sysIndex === 'currTgs'
      ? forceCommandAndAdminSelectState.currTgs
      : sysIndex === 'currTes' && forceCommandAndAdminSelectState.currTes;

  return (
    <BaseLayer>
      <Wrapper>
        <TitleWrapper>
          <Title color={sysIndex}>{title}</Title>
        </TitleWrapper>
        <SelectLocationWrapper>
          <SelectLocationsBox
            selectedOne={selectedOne}
            handleOpenSelectLocations={handleOpenSelectLocations}
            displaySelectBox={displaySelectBox}
            ess={ess}
            tgs={tgs}
            tes={tes}
            sys={sys}
            // handleSelectIndividualMachine={handleSelectIndividualMachine}
            // handleUnSelectIndividualMachine={handleUnSelectIndividualMachine}
            multipleSelectBoxes={true}
            sysIndex={sysIndex}
            sysOptions={sysOptions}
            swt={swt}
            isMobileSelectTC={true}
            program={'forceAndCommand'}
          />
        </SelectLocationWrapper>
        <SelectTCWrapper>
          <TCSelectBox
            handleClick={handleClick}
            system={sysIndex}
            position={position}
            isTCOpen={isTCOpen}
            setIsTCOpen={setIsTCOpen}
          />
        </SelectTCWrapper>
      </Wrapper>
    </BaseLayer>
  );
};

export default ShareComponentForSelectTC;

const BaseLayer = styled.div`
  width: 268px;
  height: 118px;

  ${layerA}

  border-radius: 19px;
  opacity: 1;
  ${flexBoxCenter}
`;

const Wrapper = styled.div`
  width: 266px;
  height: 116px;

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
  font-size: 11rem;
  letter-spacing: 1.1px;
  color: #ffffff;
  ${({ color }) =>
    color === 'currEss'
      ? css`
          color: #83ffff;
        `
      : color === 'currTgs'
      ? css`
          color: #ff920c;
        `
      : color === 'currTes' &&
        css`
          color: #95ff45;
        `}

  opacity: 1;
`;

const SelectLocationWrapper = styled.div``;

const SelectTCWrapper = styled.div`
  margin-bottom: 2rem;
`;
