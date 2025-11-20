import styled, { css } from 'styled-components';
import {
  justifyContentSpaceBetween,
  layerADark,
} from '../../styles/commonStyles';
import { selectMasterControls } from '../../store/slices/masterControlSelectSlice';
import { selectMC } from '../../store/slices/mCSlice';
import { useSelector } from 'react-redux';

function SelectedSystem() {
  const selectedMachinesState = useMasterControlSelectStore();
  const { ess, tgs, tes, hp } = selectedMachinesState;
  const selectedSystemState = useMCStore();
  const { selectSystem } = selectedSystemState;

  const selectedSystem = selectSystem.ess
    ? 'ess-electric switch system'
    : selectSystem.tgs
    ? 'tgs-typhoon-gas system'
    : selectSystem.tes
    ? 'tes-typhoon-electric system'
    : selectSystem.hp
    ? 'hp-heated platform'
    : '------------------';

  const numOfSelectedSwitches = selectSystem.ess
    ? ess.selectedOne
    : selectSystem.tgs
    ? tgs.selectedOne
    : selectSystem.tes
    ? tes.selectedOne
    : selectSystem.hp
    ? hp.selectedOne
    : '---';

  return (
    <Wrapper>
      <WrapperTitle underline={true}>
        <Title>selected system</Title>
      </WrapperTitle>
      <WrapperDescriptions underline={true}>
        <Description>{selectedSystem}</Description>
      </WrapperDescriptions>
      <WrapperDescriptions underline={false}>
        <Description>{selectedSystem}</Description>
        <Description>
          {numOfSelectedSwitches ? numOfSelectedSwitches : '---'}
        </Description>
      </WrapperDescriptions>
    </Wrapper>
  );
}

export default SelectedSystem;

const Wrapper = styled.div`
  width: 292rem;
  height: 56rem;

  ${layerADark}
  border-radius: 4rem;
  opacity: 1;
`;

const WrapperTitle = styled.div`
  height: 14.4rem;
  width: 284rem;
  margin-left: 4rem;
  border-bottom: 1px solid #ffff;
`;

const WrapperDescriptions = styled.div`
  height: 18.6rem;
  width: 284rem;
  margin-left: 4rem;
  ${({ underline }) =>
    underline
      ? css`
          border-bottom: 1px solid #ffff;
          display: flex;
          justify-content: flex-end;
          align-items: center;
        `
      : css`
          ${justifyContentSpaceBetween}
        `}
`;

const Title = styled.p`
  text-align: left;
  font-size: 10rem;
  margin-top: 4rem;
  letter-spacing: 1rem;
  color: #ffffff;
  opacity: 1;
`;

const Description = styled.p`
  font-size: 8rem;
  letter-spacing: 0.8rem;
  color: #ffffff;
  opacity: 1;
`;
