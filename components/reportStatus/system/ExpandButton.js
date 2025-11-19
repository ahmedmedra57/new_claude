import styled, { css } from 'styled-components';
import {
  flexBoxCenter,
  layerA180Deg,
  layerADisabled180Deg,
  layerBDisabled,
  layerCLighter,
} from '../../styles/commonStyles';

const ExpandButton = ({
  expandBtnName,
  handleExpandButton,
  // index,
  // switchIndex,
  // mainIndex,
  // systemIndex,
  // machineIsEnabled,
  systemIsEnabled,
}) => {
  return (
    <ExpandButtonWrapper
      onClick={handleExpandButton}
      isEnable={systemIsEnabled}
    >
      <ExpandButtonHole isEnable={systemIsEnabled}>
        <ExpandButtonTop isEnable={systemIsEnabled}>
          <Title isEnable={systemIsEnabled}>{expandBtnName}</Title>
        </ExpandButtonTop>
      </ExpandButtonHole>
    </ExpandButtonWrapper>
  );
};
// if (mainIndex === undefined) {
//   return (
//     <ExpandButtonWrapper
//       onClick={handleExpandButton}
//       isEnable={systemIsEnabled}
//     >
//       <ExpandButtonHole isEnable={systemIsEnabled}>
//         <ExpandButtonTop isEnable={systemIsEnabled}>
//           <Title isEnable={systemIsEnabled}>{expandBtnName}</Title>
//         </ExpandButtonTop>
//       </ExpandButtonHole>
//     </ExpandButtonWrapper>
//   );
// } else
//   return (
//     // machine
//     <ExpandButtonWrapper
//       onClick={handleExpandButton}
//       // onClick={() => handleExpandButton(mainIndex, systemIndex, switchIndex)}
//       isEnable={machineIsEnabled}
//     >
//       <ExpandButtonHole isEnable={machineIsEnabled}>
//         <ExpandButtonTop isEnable={machineIsEnabled}>
//           <Title isEnable={machineIsEnabled}>{expandBtnName}</Title>
//         </ExpandButtonTop>
//       </ExpandButtonHole>
//     </ExpandButtonWrapper>
//   );

export default ExpandButton;

const ExpandButtonWrapper = styled.button`
  width: 94px;
  height: 30px;
  border-radius: 25px;
  ${({ isEnable }) =>
    isEnable
      ? css`
          ${layerA180Deg};
        `
      : css`
          ${layerADisabled180Deg}/* background: transparent
            linear-gradient(180deg, #565656 0%, #1d1d1d 100%); */
        `};

  ${flexBoxCenter};
`;
const ExpandButtonHole = styled.div`
  width: 86px;
  height: 22px;

  ${({ isEnable }) =>
    isEnable
      ? css`
          ${layerCLighter}/* background: #142033; */
        `
      : css`
          ${layerBDisabled}/* background: #3b3b3b; */
        `};

  border-radius: 21px;
  ${flexBoxCenter}
`;
const ExpandButtonTop = styled.div`
  width: 84px;
  height: 20px;

  ${({ isEnable }) =>
    isEnable
      ? css`
          ${layerA180Deg};
        `
      : css`
          ${layerADisabled180Deg}
          background: transparent
            linear-gradient(180deg, #565656 0%, #1d1d1d 100%);
        `};

  border-radius: 20px;

  font-size: 10px;
  ${flexBoxCenter}
`;

const Title = styled.p`
  text-align: center;
  font-size: 10px;
  letter-spacing: 0.8px;
  ${({ isEnable }) =>
    isEnable
      ? css`
          color: #ffff;
        `
      : css`
          color: #808080;
        `};

  opacity: 1;
`;
