import styled, { css } from 'styled-components';
import {
  flexBoxCenter,
  flexDirectionColumn,
  justifyContentSpaceBetween,
  layerA180Deg,
  layerBDark,
} from '../styles/commonStyles';

const FaultsReportHoverBox = () => {
  // Global states
  const userInfo = useUserStore();
  const { isEssSwitch, isTesSwitch, isTgsSwitch } = userInfo;

  const faultsState = useFaultsStore();
  const essFaultMessages = faultsState.messages.ess;
  const tgsFaultMessages = faultsState.messages.tgs;
  const tesFaultMessages = faultsState.messages.tes;
  const essFaultsNumber = isEssSwitch ? essFaultMessages.length : 0;
  const tgsFaultsNumber = isTesSwitch ? tgsFaultMessages.length : 0;
  const tesFaultsNumber = isTgsSwitch ? tesFaultMessages.length : 0;

  return (
    <Wrapper>
      <SectionHeader>
        <HeaderTitle>faults report</HeaderTitle>
        {/* <Button onClick={handleClose}>
          <ButtonHole>
            <ButtonTop>x</ButtonTop>
          </ButtonHole>
        </Button> */}
      </SectionHeader>

      <SectionBody>
        <FaultsDetailUl>
          <FaultsDetailLi>
            <FaultSpan active={isEssSwitch}>
              ess-electric switch systems
            </FaultSpan>
            <FaultsNumber active={isEssSwitch}>
              {essFaultsNumber} faults
            </FaultsNumber>
          </FaultsDetailLi>

          <FaultsDetailLi>
            <FaultSpan active={isTgsSwitch}>tgs-typhoon gas systems</FaultSpan>
            <FaultsNumber active={isTgsSwitch}>
              {tgsFaultsNumber} faults
            </FaultsNumber>
          </FaultsDetailLi>

          <FaultsDetailLi>
            <FaultSpan active={isTesSwitch}>
              tes-typhoon electric systems
            </FaultSpan>
            <FaultsNumber active={isTesSwitch}>
              {tesFaultsNumber} faults
            </FaultsNumber>
          </FaultsDetailLi>
        </FaultsDetailUl>
      </SectionBody>
    </Wrapper>
  );
};

export default FaultsReportHoverBox;

const Wrapper = styled.div`
  width: 544px;
  height: 140px;
  border-radius: 18px;

  ${layerA180Deg}
  border: 1px solid #ff0000;

  ${flexDirectionColumn}
  padding: 5px 0 10px 0;

  position: absolute;
  bottom: 0px;
  left: 67px;

  z-index: 1000;
`;

const SectionHeader = styled.section`
  width: 535px;
  height: 29px;
  border-radius: 15px;

  ${layerBDark};
  ${justifyContentSpaceBetween};
  padding: 0 4px 0 12px;
`;

const HeaderTitle = styled.span`
  text-align: left;
  font-size: 12px;
  letter-spacing: 1.2px;
  color: #fe0000;
`;

const Button = styled.button`
  width: 23px;
  height: 22px;
  border-radius: 50%;

  ${layerA180Deg};
  ${flexBoxCenter};
`;

const ButtonHole = styled.div`
  width: 19px;
  height: 18px;
  border-radius: 50%;
  ${layerBDark};
  ${flexBoxCenter};
`;

const ButtonTop = styled.div`
  width: 17px;
  height: 16px;
  border-radius: 50%;
  font-size: 10px;
  ${layerA180Deg};
  ${flexBoxCenter};
`;

const SectionBody = styled.section`
  width: 535px;
  height: 89px;
  border-radius: 8px;
  ${layerBDark};
  ${flexBoxCenter}
`;

const FaultsDetailUl = styled.ul`
  width: 100%;
  height: 100%;

  ${flexDirectionColumn};
  padding: 3px 0;
`;
const FaultsDetailLi = styled.li`
  width: 530px;
  height: 26px;
  border-radius: 13px;
  border: 1px solid #233a54;

  ${justifyContentSpaceBetween};
  padding: 0 10px;
`;
const FaultSpan = styled.span`
  font-size: 10px;
  ${(p) =>
    p.active ||
    css`
      color: #808080;
    `}
`;
const FaultsNumber = styled.span`
  font-size: 10px;
  color: #fe0000;

  ${(p) =>
    p.active ||
    css`
      color: #808080;
    `}
`;
