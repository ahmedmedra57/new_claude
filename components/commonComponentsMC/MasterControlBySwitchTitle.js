import React from 'react';
import styled, { css } from 'styled-components';
import {
  flexBoxCenter,
  justifyContentSpaceBetween,
  layerA180Deg,
  layerADark,
  layerB,
} from '../styles/commonStyles';
const MasterControlBySwitchTitle = ({
  isExpand,
  expandFC,
  swtName,
  index,
  modifyLength,
  modifyBorderRadius,
  isLocation,
  isSpecificLocation,
}) => {
  const btName = isExpand ? 'close' : 'expand';

    return (
    <MCTitleWrapper
      isExpanded={isExpand}
      modifyBorderRadius={modifyBorderRadius}
      modifyLength={modifyLength}
    >
      <MCTitle isExpanded={isExpand}>
        master control -{' '}
        {isLocation
          ? `location ${swtName}`
          : isSpecificLocation
          ? `specific location ${swtName}`
          : swtName}
      </MCTitle>
      <ButtonWrapper
        isExpanded={isExpand}
        onClick={() =>
          expandFC({
              swtName,
              locationIdx: index,
              status: !isExpand,
            })
        }
      >
        <ButtonHole isExpanded={isExpand}>
          <ButtonTop isExpanded={isExpand}>{btName}</ButtonTop>
        </ButtonHole>
      </ButtonWrapper>
    </MCTitleWrapper>
  );
};

export default MasterControlBySwitchTitle;

const MCTitleWrapper = styled.div`
  width: 1201px;
  /* width: 1198px; */
  border-radius: 33px;

  ${justifyContentSpaceBetween}
  ${layerADark}
  padding-left: 14px;

  ${(p) =>
    p.isExpanded &&
    css`
      margin-bottom: 4px;
    `}

  ${({ modifyLength, modifyBorderRadius }) =>
    modifyBorderRadius &&
    css`
      width: ${modifyLength};
      border-radius: ${modifyBorderRadius};
    `}
`;

const MCTitle = styled.div`
  font-size: 14px;
  letter-spacing: 1.4px;
  width: 1082px;
  border-bottom: 1px solid #fff;

  ${(p) =>
    p.isExpanded ||
    css`
      width: 969px;
    `}

  ${(p) =>
    p.isMobile &&
    css`
      font-size: 12px;
      letter-spacing: 1.2px;

      width: auto;
    `}
`;

const ButtonWrapper = styled.button`
  width: 87px;
  height: 30px;
  border-radius: 25px;

  ${layerA180Deg}
  ${flexBoxCenter};
  ${(p) =>
    p.isExpanded ||
    css`
      width: 206px;
      height: 28px;
    `};

  ${(p) =>
    p.isMobile &&
    css`
      width: 89px;
      height: 40px;
    `}
`;

const ButtonHole = styled.div`
  width: 77px;
  height: 20px;
  border-radius: 18px;

  ${layerB};
  ${flexBoxCenter};

  ${(p) =>
    p.isExpanded ||
    css`
      width: 196px;
      height: 18px;
    `};

  ${(p) =>
    p.isMobile &&
    css`
      width: 79px;
      height: 30px;
    `}
`;
const ButtonTop = styled.div`
  width: 75px;
  height: 18px;
  border-radius: 25px;
  ${layerA180Deg};

  ${(p) =>
    p.isExpanded ||
    css`
      width: 194px;
      height: 16px;
    `}

  font-size: 12px;
  letter-spacing: 1.2px;

  ${flexBoxCenter}

  ${(p) =>
    p.isMobile &&
    css`
      width: 77px;
      height: 28px;
    `}
`;
